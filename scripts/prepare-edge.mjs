import {mkdir,readFile,writeFile} from 'node:fs/promises';import {build} from 'esbuild';
// Bundle the same tested authority modules used by the browser and service tests.
await mkdir('output/backend',{recursive:true});
await build({entryPoints:['supabase/functions/empire-api/index.ts'],bundle:true,format:'esm',platform:'neutral',target:'es2022',external:['https://*'],minify:true,outfile:'output/backend/index.ts'});
await writeFile('output/backend/deploy.json',JSON.stringify({project_id:'drlemqycvlhvxuscszhb',name:'empire-api',entrypoint_path:'index.ts',import_map_path:'deno.json',verify_jwt:false,files:[{name:'index.ts',content:await readFile('output/backend/index.ts','utf8')},{name:'deno.json',content:await readFile('supabase/functions/empire-api/deno.json','utf8')}]}));
console.log('Prepared authenticated backend bundle. Authentication remains inside the function. No secrets are included.');
