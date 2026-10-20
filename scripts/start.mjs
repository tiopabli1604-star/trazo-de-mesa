import path from 'node:path';
process.env.DATA_DIR=path.resolve(process.env.DATA_DIR||'.data');
const args=process.argv.slice(2);
process.env.HOSTNAME=args.includes('--host')?args[args.indexOf('--host')+1]:'127.0.0.1';
if(args.includes('--port'))process.env.PORT=args[args.indexOf('--port')+1];
await import('../.next/standalone/server.js');
