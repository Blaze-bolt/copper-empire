import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {CATALOGUE} from '../src/empire/catalogue.js';
import {illustration} from '../src/empire/art.js';
import {illustration as baselineIllustration} from './fixtures/art-5.2.js';
import {INDUSTRIAL_MODELS} from '../src/empire/industrial-art.js';
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const devices=CATALOGUE.filter(d=>INDUSTRIAL_MODELS[d.id]);
const before=devices.map(d=>({id:d.id,svg:baselineIllustration(d,'before-'+d.id)}));
await mkdir('docs/model-proof',{recursive:true});
const cells=(items,mono=false)=>items.map((d,i)=>{
 const x=i%5*260,y=Math.floor(i/5)*225+65;
 const svg=illustration(d,'proof-'+d.id).replace('<svg ',`<svg x="${x+5}" y="${y}" width="250" height="183" `);
 return `<g class="${mono?'silhouette':''}">${svg}</g><text x="${x+12}" y="${y+192}" font-size="12" fill="#243a36">#${d.id} · ${escape(d.name.slice(0,36))}</text>`;
}).join('');
for(const [name,mono] of [['color',false],['silhouettes',true]]){
 const h=Math.ceil(devices.length/5)*225+75;
 await writeFile(`docs/model-proof/r7-r18-${name}.svg`,`<svg xmlns="http://www.w3.org/2000/svg" width="1300" height="${h}" viewBox="0 0 1300 ${h}"><style>.silhouette .device-shell *{fill:#172d2a!important;stroke:#172d2a!important}.silhouette .device-shell path[fill="none"],.silhouette .device-shell ellipse[fill="none"]{fill:none!important}</style><rect width="100%" height="100%" fill="#eef2e9"/><text x="20" y="35" font-family="sans-serif" font-size="22" fill="#243a36">Copper Empire · 59 individual R7–R18 models · ${name}</text>${cells(devices,mono)}</svg>`);
}
const card=d=>`<article><h2>#${d.id} · ${escape(d.name)}</h2><div class="pair"><figure>${before.find(x=>x.id===d.id).svg}<figcaption>BEFORE</figcaption></figure><figure>${illustration(d,'comparison-'+d.id)}<figcaption>AFTER</figcaption></figure></div></article>`;
await writeFile('docs/model-proof/before-after.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Copper Empire — actual renderer comparison</title><style>body{margin:20px;background:#e9eee4;color:#253a36;font-family:system-ui}h1{font-size:26px}h2{font-size:16px}main{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}article{border:1px solid #a8b8a3;padding:12px;border-radius:10px;background:#f4f6ee}.pair{display:flex}figure{margin:0;width:50%;text-align:center}svg{width:100%;height:auto}figcaption{font-size:11px;letter-spacing:2px}@media(max-width:650px){main{grid-template-columns:1fr}}</style><h1>R7–R18: all 59 actual models</h1><p>Left: renderer at release 5.2. Right: individually authored replacement. Device statistics and minigames are unchanged.</p><main>${devices.map(card).join('')}</main></html>`);
await writeFile('docs/model-proof/index.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Copper Empire model review</title><style>body{margin:20px;background:#eef2e9;color:#243a36;font-family:system-ui}img{max-width:100%;height:auto}a{color:#825026}</style><h1>Actual device renderer · R7–R18</h1><p>59 distinct models. <a href="before-after.html">Compare every model before and after</a>.</p><h2>Color render</h2><img src="r7-r18-color.svg" alt="All 59 individual industrial device models"><h2>Monochrome silhouette check</h2><img src="r7-r18-silhouettes.svg" alt="Monochrome silhouettes of the same 59 models"></html>`);
console.log(`Rendered ${devices.length} actual models, silhouettes and before/after comparisons.`);
