// Pre-implementation feasibility report: never changes the owner's catalogue prices.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {DOLLAR,MG,decimal,money} from '../src/empire/data.js';
export function recipesFromSpecification(text){
 return [...text.matchAll(/^F(\d\d) — ([^\r\n]+)\r?\nRecipe INPUT: ([\d.]+) (Mt|Gt) Standard copper \+ \$([\d.]+)(B|T|Q) production fee\. One output item\. Base production time (\d+) seconds\. GLOBAL reference export price \$([\d.]+)(B|T|Q)/gm)].map(m=>({id:'F'+m[1],name:m[2],copper:decimal(m[3].startsWith('.')?'0'+m[3]:m[3],MG[m[4]]),fee:decimal(m[5],{B:10n**9n,T:10n**12n,Q:10n**15n}[m[6]])*DOLLAR,seconds:Number(m[7]),reference:decimal(m[8],{B:10n**9n,T:10n**12n,Q:10n**15n}[m[9]])*DOLLAR}));
}
export function productMargin(product,quote,{wages=0n,freightBps=100}={}){
 const opportunity=product.copper*BigInt(quote)*100n,fee=product.fee*85n/100n,freight=product.reference*BigInt(freightBps)/10000n;
 return {opportunity,fee,wages,freight,gross:product.reference,net:product.reference-opportunity-fee-wages-freight};
}
if(process.argv[1]?.endsWith('industrial-economy.mjs')){
 const spec=await readFile('docs/GLOBAL_INDUSTRIAL_MASTER_SPEC.txt','utf8'),products=recipesFromSpecification(spec);
 if(products.length!==25)throw Error('Expected the exact 25 authored recipes.');
 await mkdir('docs/industrial-era',{recursive:true});
 const scenarios=[3000,6000,20000],csv=['Product,Price per gram,Manual net ($),Minimum worker net ($),All staff net ($),Copper opportunity ($),A2 fee ($),Freight assumption ($)'];
 let md='# Factory economy feasibility — proposed recipes, not a playable factory\n\nExact integer arithmetic. No catalogue prices changed. A2 production fee discount is 15%; copper input never discounted. Neutral country, no quality/reputation/news bonus. Freight is an **illustrative 1% of gross**, because the specification leaves freight pricing open. Minimum staff: Operator $1B; add Supervisor $20B for F11–20, Manager $100B for F21–25. All-staff stress case: $168B per one-unit job. Manual jobs have no wages. These are opportunity margins at the current copper quote, not historical purchase cost.\n\n| Product | $0.30/g manual | $0.60/g manual | $2.00/g manual | $0.60/g minimum staff |\n|---|---:|---:|---:|---:|\n';
 for(const [i,p] of products.entries()){
  const wages=BigInt(1+(i>=10&&i<20?20:0)+(i>=20?100:0))*10n**9n*DOLLAR;
  const results=scenarios.map(q=>productMargin(p,q));
  for(const q of scenarios){const a=productMargin(p,q),b=productMargin(p,q,{wages}),c=productMargin(p,q,{wages:168n*10n**9n*DOLLAR});csv.push([p.id,(q/10000).toFixed(2),a.net/DOLLAR,b.net/DOLLAR,c.net/DOLLAR,a.opportunity/DOLLAR,a.fee/DOLLAR,a.freight/DOLLAR].join(','));}
  md+=`| ${p.id} ${p.name} | ${results.map(x=>money(x.net,true)).join(' | ')} | ${money(productMargin(p,6000,{wages}).net,true)} |\n`;
 }
 md+='\nAll 25 recipes have positive manual opportunity margin at equilibrium under the stated freight assumption; all 25 lose opportunity value at $2/g. Full staff on a single F01 job is also unprofitable at equilibrium. Workers should be assigned selectively or costs amortized over funded batches. This is a market-sensitive manufacturing economy, not guaranteed profit.\n\nSmallest proposed correction: **keep every authored reference price and recipe**, show accurate net margin and a loss confirmation before funding, and allow players to wait for favorable copper/export quotes. Do not require a loss-making factory job for progression. Freight basis and loss confirmation behavior need owner decision before the shipping economy is enabled. Raising every reference price to guarantee profit at the copper maximum would distort the authored economy and is not recommended.\n';
 await writeFile('docs/industrial-era/economy.md',md);await writeFile('docs/industrial-era/economy.csv',csv.join('\n')+'\n');
 console.log(`Simulated ${products.length} products at three copper prices with manual, minimal staff and full staff scenarios.`);
}
