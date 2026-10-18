import {readFile,writeFile} from 'node:fs/promises';
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const inline=s=>escape(s).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/`(.*?)`/g,'<code>$1</code>').replace(/\[([^\]]+)\]\((rebalance\.csv)\)/g,'<a href="$2">$1</a>');
const text=await readFile('docs/industrial-era/rebalance-proposal.md','utf8');
let html='',table=false;
for(const line of text.split(/\r?\n/)){
 if(line.startsWith('|')){
  if(!table){table=true;html+='<div class="table-scroll"><table><thead>';}
  if(/^\|[-:| ]+\|$/.test(line)){html+='</thead><tbody>';continue;}
  const tag=line.startsWith('| Product ')?'th':'td';html+='<tr>'+line.slice(1,-1).split('|').map(c=>`<${tag}>${inline(c.trim())}</${tag}>`).join('')+'</tr>';continue;
 }
 if(table){html+='</tbody></table></div>';table=false;}
 if(line.startsWith('# '))html+='<h1>'+inline(line.slice(2))+'</h1>';
 else if(line.startsWith('## '))html+='<h2>'+inline(line.slice(3))+'</h2>';
 else if(line.startsWith('- '))html+='<p class="assumption">'+inline(line.slice(2))+'</p>';
 else if(line.trim())html+='<p>'+inline(line)+'</p>';
}
await writeFile('docs/industrial-era/rebalance-proposal.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Copper Empire — factory price proposal</title><style>:root{color-scheme:dark}body{font:15px/1.65 system-ui;margin:0;background:#15221f;color:#d4dfd2}main{max-width:1500px;margin:auto;padding:32px}h1{font-size:32px;line-height:1.25;max-width:900px;color:#efbc86}h2{margin-top:36px;color:#e3c199}p{max-width:1100px}a{color:#efbc86}code{font-size:12px;overflow-wrap:anywhere}.assumption{padding-left:15px;border-left:2px solid #7e6344}.badge{font-size:12px;color:#f1c483;text-transform:uppercase;letter-spacing:2px}.table-scroll{overflow:auto;border:1px solid #476051;border-radius:9px;max-height:75vh}table{border-collapse:collapse;font-size:12px;min-width:1350px;width:100%}td,th{padding:11px 12px;border-bottom:1px solid #364c40;text-align:right;white-space:nowrap}th{position:sticky;top:0;background:#2b4034;color:#efbc86;z-index:1}td:first-child,th:first-child{position:sticky;left:0;text-align:left;background:#20352b;max-width:280px;white-space:normal}th:first-child{z-index:2}tr:nth-child(even) td{background:#1c2e26}tr:nth-child(even) td:first-child{background:#243c30}header{border-bottom:1px solid #4c624e;padding-bottom:15px}footer{margin-top:35px;color:#a4b4a2;font-size:13px}@media(max-width:600px){main{padding:18px}h1{font-size:25px}body{font-size:14px}}</style><main><header><div class="badge">Copper Empire · owner review · October 18, 2026</div><p>Read-only balance proposal. The game’s catalogue has not been changed.</p></header>${html}<footer>Reproducible calculations: scripts/industrial-rebalance.mjs. All money and copper calculations use exact integers.</footer></main></html>`);
console.log('Built a readable, mobile-scrollable proposal table.');
