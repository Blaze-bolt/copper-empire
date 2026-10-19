import {readFile,writeFile} from 'node:fs/promises';
const text=await readFile('docs/GLOBAL_INDUSTRIAL_MASTER_SPEC.txt','utf8');
const rows=[...text.matchAll(/^M(\d{2}) — ([^\r\n]+)\r?\nOBJECTIVE\/INPUT\/FAIL CONDITION: ([^\r\n]+)/gm)].map(m=>({id:2000+Number(m[1]),name:m[2],spec:m[3]}));
if(rows.length!==30)throw Error('All thirty authored factory challenges are required.');
await writeFile('src/empire/factory-catalogue.js','export const FACTORY_CHALLENGES='+JSON.stringify(rows,null,2)+';\n');
