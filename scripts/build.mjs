import {mkdir,copyFile,cp,readFile,writeFile} from 'node:fs/promises';
import {build} from 'esbuild';
import {createHash} from 'node:crypto';
await mkdir('dist/vendor',{recursive:true});
for(const file of ['index.html','classic.html','styles.css','empire.css','.nojekyll'])await copyFile(file,`dist/${file}`);
await cp('src','dist/src',{recursive:true});
await cp('assets','dist/assets',{recursive:true});
// Review artifacts are separate, on-demand pages; they add no game-start requests.
await cp('docs/model-proof','dist/model-proof',{recursive:true});
await cp('docs/industrial-era','dist/industry-review',{recursive:true});
await build({entryPoints:['src/online/sdk-entry.js'],bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,outfile:'dist/vendor/supabase.js'});
// Repository variables are public by design. Fail closed if a privileged key is supplied.
if(process.env.SUPABASE_URL||process.env.SUPABASE_PUBLISHABLE_KEY){const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_PUBLISHABLE_KEY;if(!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url||'')||!key?.startsWith('sb_publishable_'))throw Error('Only a public Supabase URL and publishable key may be built into the website.');await writeFile('dist/src/online/config.js',`export const onlineConfig=${JSON.stringify({enabled:process.env.ONLINE_ENABLED!=='false',url,publishableKey:key})};\n`);}
// A content-addressed game module prevents browsers mixing files from different releases.
// Keep the original two-directory depth so music and the external SDK retain their URLs.
const game=await build({entryPoints:['dist/src/empire/app.js'],bundle:true,format:'esm',platform:'browser',target:'es2022',external:['../../vendor/supabase.js'],entryNames:'workshop-[hash]',outdir:'dist/src/empire',metafile:true});
const modulePath=Object.keys(game.metafile.outputs).find(x=>/workshop-[^/]+\.js$/.test(x));
let html=await readFile('dist/index.html','utf8');html=html.replace('./src/empire/app.js','./'+modulePath.replace(/^dist\//,''));
for(const name of ['styles.css','empire.css']){const digest=createHash('sha256').update(await readFile('dist/'+name)).digest('hex').slice(0,12);html=html.replace('./'+name,'./'+name+'?v='+digest);}
await writeFile('dist/index.html',html);
console.log('Built Copper Empire in dist/');
