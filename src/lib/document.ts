import { z } from 'zod';
export const uid = () => crypto.randomUUID();
const num = z.number().finite();
const color = z.string().regex(/^#[\da-f]{6}$/i);
export const elementSchema = z.object({
  id:z.string().uuid(), type:z.enum(['text','image','rect','circle']), x:num, y:num,
  width:num.positive().max(8192), height:num.positive().max(8192), rotation:num.default(0),
  fill:color, text:z.string().max(20000).optional(), fontSize:num.min(8).max(500).optional(),
  fontFamily:z.enum(['Arial','Georgia','Verdana']).optional(), fontWeight:z.enum(['normal','bold']).optional(),
  assetId:z.string().uuid().optional(), locked:z.boolean().optional(), groupId:z.string().uuid().optional()
});
export const pageSchema = z.object({id:z.string().uuid(),background:z.union([color,z.literal('transparent')]),elements:z.array(elementSchema).max(500)});
export const documentSchema = z.object({schemaVersion:z.literal(1),id:z.string().uuid(), title:z.string().trim().min(1).max(200),
  width:z.number().int().min(100).max(4096),height:z.number().int().min(100).max(4096),pages:z.array(pageSchema).min(1).max(50)
}).superRefine((doc,ctx)=>{
  if(doc.width*doc.height>16000000)ctx.addIssue({code:'custom',message:'El diseño supera el límite de píxeles.'});
  const ids=new Set<string>();
  for(const page of doc.pages){
    for(const id of [page.id,...page.elements.map(e=>e.id)]){if(ids.has(id))ctx.addIssue({code:'custom',message:'Identificador repetido.'});ids.add(id);}
    for(const e of page.elements)if(e.type==='image'&&!e.assetId)ctx.addIssue({code:'custom',message:'Falta el archivo de una imagen.'});
  }
});
export type Element = z.infer<typeof elementSchema>;
export type Design = z.infer<typeof documentSchema>;
export type Page = z.infer<typeof pageSchema>;
export type SavedDesign = {id:string;document:Design;revision:number;updatedAt:string;folderId:string|null;thumbnail?:string};
export function cloneDesign(doc:Design):Design {const result=structuredClone(doc);result.id=uid();result.title=doc.title+' · copia';for(const p of result.pages){p.id=uid();const groups=new Map<string,string>();for(const e of p.elements){e.id=uid();if(e.groupId){if(!groups.has(e.groupId))groups.set(e.groupId,uid());e.groupId=groups.get(e.groupId);}}}return result;}
export function newDesign(title='Mi nuevo diseño',width=1080,height=1080):Design{return {schemaVersion:1,id:uid(),title,width,height,pages:[{id:uid(),background:'#ffffff',elements:[]}]};}
const text=(s:string,x:number,y:number,w:number,size:number,fill:string,fontFamily:'Arial'|'Georgia'='Georgia'):Element=>({id:uid(),type:'text',x,y,width:w,height:size*1.5,rotation:0,fill,text:s,fontSize:size,fontFamily,fontWeight:'normal'});
const shape=(type:'rect'|'circle',x:number,y:number,w:number,h:number,fill:string):Element=>({id:uid(),type,x,y,width:w,height:h,rotation:0,fill});
export type Template={id:string;name:string;category:string;description:string;make:()=>Design};
export const templates:Template[]=[
  {id:'botanica',name:'Pausa botánica',category:'Redes sociales',description:'Verde profundo y tipografía editorial',make:()=>{const d=newDesign('Pausa botánica');d.pages[0].background='#eeeade';d.pages[0].elements=[text('ESTUDIO BOTÁNICO',90,75,850,27,'#244b3c','Arial'),shape('circle',510,370,440,440,'#d3b88b'),shape('rect',590,610,270,470,'#244b3c'),shape('circle',460,430,290,400,'#53735a'),shape('circle',690,285,260,440,'#244b3c'),text('Crecer\na tu ritmo.',85,200,800,110,'#244b3c'),text('Una pausa. Un poco de luz.\nUn espacio para empezar de nuevo.',90,860,750,31,'#244b3c','Arial')];return d;}},
  {id:'cafe',name:'Mesa de domingo',category:'Carteles',description:'Un encuentro con sabor a casa',make:()=>{const d=newDesign('Mesa de domingo',900,1200);d.pages[0].background='#f2d6bd';d.pages[0].elements=[text('LA SOBREMESA',70,75,760,24,'#65352a','Arial'),shape('circle',320,525,480,440,'#c96f47'),shape('circle',385,580,335,335,'#f6ebda'),shape('circle',445,640,215,215,'#65352a'),text('Buenos días,\nsin prisa.',65,190,800,100,'#65352a'),text('CAFÉ · CONVERSACIÓN · DOMINGO',70,1050,780,23,'#65352a','Arial')];return d;}},
  {id:'ideas',name:'Ideas en movimiento',category:'Presentaciones',description:'Una idea clara, mucho espacio',make:()=>{const d=newDesign('Ideas en movimiento',1600,900);d.pages[0].background='#e2e8ed';d.pages[0].elements=[text('CUADERNO DE IDEAS / 01',95,75,1100,28,'#283d57','Arial'),shape('circle',1130,350,560,560,'#aab9cb'),shape('rect',1250,0,220,470,'#58728d'),text('Todo empieza\ncon una idea.',95,230,1320,122,'#283d57'),text('Un proyecto por imaginar. Un camino por descubrir.',100,740,1300,34,'#283d57','Arial')];return d;}},
  {id:'taller',name:'Hecho a mano',category:'Carteles',description:'Formas simples para grandes planes',make:()=>{const d=newDesign('Hecho a mano',900,1200);d.pages[0].background='#ece5cc';d.pages[0].elements=[shape('rect',0,0,900,90,'#653c28'),text('TALLER ABIERTO',75,170,770,30,'#653c28','Arial'),text('Haz sitio\na tus ideas.',65,290,800,108,'#653c28'),shape('circle',60,750,350,350,'#b7844b'),shape('rect',470,750,340,350,'#556b46'),text('CREAR · COMPARTIR · APRENDER',75,1120,780,22,'#653c28','Arial')];return d;}},
  {id:'notas',name:'Pequeñas cosas',category:'Redes sociales',description:'Una nota que merece quedarse',make:()=>{const d=newDesign('Pequeñas cosas');d.pages[0].background='#e8dfe8';d.pages[0].elements=[shape('circle',730,-140,450,450,'#ccb9ce'),text('NOTAS PARA HOY',100,115,850,26,'#563d59','Arial'),text('Lo pequeño\ntambién\ncuenta.',90,300,900,123,'#563d59'),text('GUARDA UN MOMENTO PARA TI.',100,940,850,24,'#563d59','Arial')];return d;}},
  {id:'portfolio',name:'Una nueva mirada',category:'Presentaciones',description:'Una portada con intención',make:()=>{const d=newDesign('Una nueva mirada',1600,900);d.pages[0].background='#f4eee3';d.pages[0].elements=[shape('rect',1020,0,580,900,'#a24d37'),shape('circle',1110,220,420,420,'#e6b28c'),text('PORTAFOLIO / 2026',90,75,900,28,'#42392e','Arial'),text('Una nueva\nmirada.',80,280,1050,126,'#42392e'),text('Una selección de proyectos personales.',95,760,1200,32,'#42392e','Arial')];return d;}}
];
export function templatePreview(t:Template){return t.make();}
