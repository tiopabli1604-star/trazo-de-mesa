import Dexie, {type Table} from 'dexie';
import {zipSync,unzipSync,strToU8,strFromU8} from 'fflate';
import {documentSchema,uid,type Design,type SavedDesign} from './document';
export type Asset={id:string;hash:string;blob:Blob;width:number;height:number;createdAt:string};
class LocalDB extends Dexie {
  designs!:Table<SavedDesign>; revisions!:Table<{id:string;designId:string;sequence:number;snapshot:Design;createdAt:string}>;
  assets!:Table<Asset>;folders!:Table<{id:string;name:string;updatedAt:string}>;
  publications!:Table<{id:string;designId:string;token:string;status:string;requestId:string;updatedAt:string}>;
  settings!:Table<{key:string;value:unknown}>;templates!:Table<{id:string;document:Design;title:string}>;
  constructor(){super('trazo-de-mesa');this.version(1).stores({designs:'id,updatedAt,folderId',revisions:'id,&[designId+sequence],designId,createdAt',assets:'id,hash,createdAt',folders:'id,name,updatedAt',publications:'id,designId,status,updatedAt',settings:'key',templates:'id,title'});}
}
export const db=new LocalDB();
export class ConflictError extends Error{constructor(){super('Hay otra versión guardada. Descarga una copia antes de continuar.');}}
export async function saveDesign(document:Design,expectedRevision:number,folderId?:string|null,thumbnail?:string):Promise<SavedDesign>{
  documentSchema.parse(document);const now=new Date().toISOString();
  return db.transaction('rw',db.designs,db.revisions,async()=>{const old=await db.designs.get(document.id);if((old?.revision??0)!==expectedRevision)throw new ConflictError();
    const row:SavedDesign={id:document.id,document:structuredClone(document),revision:expectedRevision+1,updatedAt:now,folderId:folderId===undefined?(old?.folderId??null):folderId,thumbnail:thumbnail??old?.thumbnail};
    await db.designs.put(row);await db.revisions.put({id:uid(),designId:document.id,sequence:row.revision,snapshot:row.document,createdAt:now});
    const revs=await db.revisions.where('designId').equals(document.id).sortBy('sequence');await db.revisions.bulkDelete(revs.slice(0,-20).map(r=>r.id));return row;
  });
}
export async function deleteDesign(id:string){await db.transaction('rw',db.designs,db.revisions,async()=>{await db.designs.delete(id);await db.revisions.where('designId').equals(id).delete();});}
export async function sha256(bytes:ArrayBuffer){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(n=>n.toString(16).padStart(2,'0')).join('');}
export async function importAsset(file:File):Promise<Asset>{
  if(file.size>10*1024*1024)throw new Error('La imagen debe ocupar menos de 10 MB.');
  const bytes=new Uint8Array(await file.arrayBuffer());const isPNG=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;const isJPG=bytes[0]===255&&bytes[1]===216;const isWebP=strFromU8(bytes.slice(0,4))==='RIFF'&&strFromU8(bytes.slice(8,12))==='WEBP';
  if(!isPNG&&!isJPG&&!isWebP)throw new Error('Elige una imagen PNG, JPG o WebP.');
  const hash=await sha256(await file.arrayBuffer());const old=await db.assets.where('hash').equals(hash).first();if(old)return old;
  const bmp=await createImageBitmap(file);const {width,height}=bmp;bmp.close();if(width*height>16000000)throw new Error('La imagen supera los 16 megapíxeles.');
  const asset={id:uid(),hash,blob:new Blob([bytes],{type:isPNG?'image/png':isJPG?'image/jpeg':'image/webp'}),width,height,createdAt:new Date().toISOString()};await db.assets.put(asset);return asset;
}
export function assetIds(doc:Design){return [...new Set(doc.pages.flatMap(p=>p.elements.flatMap(e=>e.assetId?[e.assetId]:[])))];}
export async function backup(doc:Design){const files:Record<string,Uint8Array>={'document.json':strToU8(JSON.stringify(doc))};const manifest:Record<string,string>={};for(const id of assetIds(doc)){const a=await db.assets.get(id);if(!a)throw new Error('Falta una imagen.');const path='assets/'+id;files[path]=new Uint8Array(await a.blob.arrayBuffer());manifest[id]=a.blob.type;}files['manifest.json']=strToU8(JSON.stringify(manifest));return new Blob([zipSync(files)] as BlobPart[],{type:'application/zip'});}
export async function restore(file:File){if(file.size>100*1024*1024)throw new Error('El respaldo supera los 100 MB.');let size=0,count=0;const files=unzipSync(new Uint8Array(await file.arrayBuffer()),{filter(entry){size+=entry.originalSize;count++;if(size>200*1024*1024||count>500||entry.name.includes('..')||entry.name.startsWith('/'))throw new Error('Respaldo no válido.');return true;}});
  if(!files['document.json']||!files['manifest.json'])throw new Error('No es un respaldo de este editor.');
  const doc=documentSchema.parse(JSON.parse(strFromU8(files['document.json'])));const manifest=JSON.parse(strFromU8(files['manifest.json'])) as Record<string,string>;const replacements=new Map<string,string>();const staged:Asset[]=[];
  for(const id of assetIds(doc)){const content=files['assets/'+id];if(!content||!['image/png','image/jpeg','image/webp'].includes(manifest[id]))throw new Error('Respaldo incompleto.');const incoming=new File([content] as BlobPart[],id,{type:manifest[id]});const a=await importAsset(incoming);replacements.set(id,a.id);staged.push(a);}
  doc.id=uid();doc.title=doc.title+' · restaurado';for(const p of doc.pages){p.id=uid();for(const e of p.elements){e.id=uid();if(e.assetId)e.assetId=replacements.get(e.assetId);}}
  await saveDesign(doc,0);return doc;
}
export function download(blob:Blob,name:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);}
