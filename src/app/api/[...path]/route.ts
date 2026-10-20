import {route} from '@/lib/server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
async function handler(req:Request,ctx:{params:Promise<{path:string[]}>}){return route(req,(await ctx.params).path);}
export {handler as GET,handler as POST,handler as DELETE};
