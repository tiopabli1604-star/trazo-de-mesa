import {cpSync,existsSync} from 'node:fs';
if(existsSync('.next/standalone')){cpSync('.next/static','.next/standalone/.next/static',{recursive:true});cpSync('public','.next/standalone/public',{recursive:true});}
// Native libraries are not completely traced on every Windows installation.
// Copy installed platform packages, including libvips, rather than only the addon.
for(const pkg of ['@img','sharp'])if(existsSync('node_modules/'+pkg))cpSync('node_modules/'+pkg,'.next/standalone/node_modules/'+pkg,{recursive:true});
