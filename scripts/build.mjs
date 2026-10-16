import {mkdir,copyFile,cp,readFile,writeFile} from 'node:fs/promises';
import {build} from 'esbuild';
await mkdir('dist/vendor',{recursive:true});
for(const file of ['index.html','classic.html','styles.css','empire.css','.nojekyll'])await copyFile(file,`dist/${file}`);
await cp('src','dist/src',{recursive:true});
await cp('assets','dist/assets',{recursive:true});
await build({entryPoints:['src/online/sdk-entry.js'],bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,outfile:'dist/vendor/supabase.js'});
// Repository variables are public by design. Fail closed if a privileged key is supplied.
if(process.env.SUPABASE_URL||process.env.SUPABASE_PUBLISHABLE_KEY){const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_PUBLISHABLE_KEY;if(!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url||'')||!key?.startsWith('sb_publishable_'))throw Error('Only a public Supabase URL and publishable key may be built into the website.');await writeFile('dist/src/online/config.js',`export const onlineConfig=${JSON.stringify({enabled:process.env.ONLINE_ENABLED!=='false',url,publishableKey:key})};\n`);}
console.log('Built Copper Empire in dist/');
