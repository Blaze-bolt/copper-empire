import {readFile,writeFile} from 'node:fs/promises';
const spec=await readFile('docs/GLOBAL_INDUSTRIAL_MASTER_SPEC.txt','utf8');
const models=Object.fromEntries([...spec.matchAll(/^VISUAL MODEL #(\d+) — [^\r\n]+\r?\n([^\r\n]+)/gm)].map(m=>[m[1],m[2]]));
if(Object.keys(models).length!==59)throw Error('The 59 original-device model descriptions must be complete.');
await writeFile('src/empire/model-descriptions.js','// Authored inspection descriptions, IDs and wording retained from the owner specification.\nexport const MODEL_DESCRIPTIONS='+JSON.stringify(models,null,2)+';\n');
