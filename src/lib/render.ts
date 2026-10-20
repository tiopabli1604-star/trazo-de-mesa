import {Canvas,StaticCanvas,Textbox,Rect,Ellipse,FabricImage,type FabricObject} from 'fabric';
import {PDFDocument} from 'pdf-lib';
import {zipSync} from 'fflate';
import {db,download} from './db';
import type {Design,Element,Page} from './document';
export type TaggedObject=FabricObject & {elementId?:string};
export async function makeObject(e:Element):Promise<TaggedObject>{
  const options={left:e.x,top:e.y,originX:'left' as const,originY:'top' as const,angle:e.rotation,fill:e.fill,strokeWidth:0,selectable:!e.locked,evented:!e.locked,objectCaching:false};
  let obj:TaggedObject;
  if(e.type==='text')obj=new Textbox(e.text??'',{...options,width:e.width,fontSize:e.fontSize??48,fontFamily:e.fontFamily??'Arial',fontWeight:e.fontWeight??'normal',lineHeight:1.12});
  else if(e.type==='circle')obj=new Ellipse({...options,rx:e.width/2,ry:e.height/2});
  else if(e.type==='image'){
    const asset=e.assetId?await db.assets.get(e.assetId):undefined;if(!asset)throw new Error('No se encuentra una imagen del diseño. Restaura un respaldo.');
    const url=URL.createObjectURL(asset.blob);try{obj=await FabricImage.fromURL(url,{},options);obj.scaleX=e.width/(obj.width||1);obj.scaleY=e.height/(obj.height||1);}finally{URL.revokeObjectURL(url);}
  }else obj=new Rect({...options,width:e.width,height:e.height});
  obj.elementId=e.id;obj.borderColor='#245641';obj.cornerColor='#245641';obj.cornerStyle='circle';obj.transparentCorners=false;return obj;
}
export async function drawPage(canvas:Canvas|StaticCanvas,page:Page,shouldApply:()=>boolean=()=>true){const objects=await Promise.all(page.elements.map(makeObject));if(!shouldApply())return [];canvas.clear();canvas.backgroundColor=page.background;canvas.add(...objects);canvas.requestRenderAll();return objects;}
export async function renderPages(doc:Design,pageIds:string[],format:'png'|'jpeg'='png',scale=1){
  if(doc.width*doc.height*scale*scale>16000000)throw new Error('Reduce la resolución: máximo 16 megapíxeles por página.');
  await document.fonts.ready;const results:{id:string;blob:Blob;width:number;height:number}[]=[];
  for(const page of doc.pages.filter(p=>pageIds.includes(p.id))){const el=document.createElement('canvas');const c=new StaticCanvas(el,{width:doc.width,height:doc.height,enableRetinaScaling:false});try{await drawPage(c,format==='jpeg'&&page.background==='transparent'?{...page,background:'#ffffff'}:page);const url=c.toDataURL({format,multiplier:scale,quality:0.95});const blob=await (await fetch(url)).blob();results.push({id:page.id,blob,width:Math.round(doc.width*scale),height:Math.round(doc.height*scale)});}finally{await c.dispose();}}
  if(!results.length)throw new Error('Selecciona al menos una página.');return results;
}
export async function exportDocument(doc:Design,format:'png'|'jpeg'|'pdf',ids:string[],scale=1){
  const pages=await renderPages(doc,ids,format==='jpeg'?'jpeg':'png',scale);const safe=doc.title.replace(/[^\p{L}\p{N}\s_-]/gu,'').slice(0,80)||'diseño';
  if(format==='pdf'){const pdf=await PDFDocument.create();for(const p of pages){const image=await pdf.embedPng(await p.blob.arrayBuffer());const page=pdf.addPage([doc.width*0.75,doc.height*0.75]);page.drawImage(image,{x:0,y:0,width:doc.width*0.75,height:doc.height*0.75});}download(new Blob([await pdf.save()] as BlobPart[],{type:'application/pdf'}),safe+'.pdf');}
  else if(pages.length===1)download(pages[0].blob,safe+(format==='jpeg'?'.jpg':'.png'));
  else{const files:Record<string,Uint8Array>={};for(let i=0;i<pages.length;i++)files[`${safe}-${i+1}.${format==='jpeg'?'jpg':'png'}`]=new Uint8Array(await pages[i].blob.arrayBuffer());download(new Blob([zipSync(files)] as BlobPart[],{type:'application/zip'}),safe+'.zip');}
}
