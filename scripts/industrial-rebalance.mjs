// Proposal only. No imports by the game, no mutations of its recipes or prices.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {recipesFromSpecification} from './industrial-economy.mjs';
import {DOLLAR,MG,money} from '../src/empire/data.js';
const B=10n**9n*DOLLAR;
export const TARGET_MARGINS=[8,10,8,8,18,15,15,18,18,20,30,12,25,15,20,18,20,22,28,25,25,28,30,32,35];
export const minimumWages=i=>BigInt(1+(i>=10&&i<20?20:0)+(i>=20?100:0))*B;
export function freight(gross,volume,minutes=15,logistics=0){
 if(gross<0n||!Number.isSafeInteger(volume)||volume<1||!Number.isSafeInteger(minutes)||minutes<15||!Number.isInteger(logistics)||logistics<0||logistics>10)throw Error('Invalid proposed freight inputs.');
 // Round upward once to the exact currency quantum. No speed or personal bonus on freight.
 const numerator=(gross*225n+BigInt(volume)*B*BigInt(minutes)*500n)*BigInt(100-3*logistics);
 return (numerator+2999999n)/3000000n;
}
export function comparison(p,index,price,quote){
 const volume=[1,2,3,5,10][Math.floor(index/5)],wages=minimumWages(index),fee=p.fee*85n/100n;
 const copper=p.copper*BigInt(quote)*100n,shipping=freight(price,volume);
 return {price,copper,fee,wages,shipping,net:price-copper-fee-wages-shipping};
}
export function proposedPrice(p,index){
 const volume=[1,2,3,5,10][Math.floor(index/5)],cost=p.copper*10000n*100n+p.fee*85n/100n+minimumWages(index)+BigInt(volume)*B/4n;
 // At $1/g, net revenue margin floor by product. Freight's 0.75% is included.
 const denominator=10000n-BigInt(TARGET_MARGINS[index])*100n-75n;
 const exact=(cost*10000n+denominator-1n)/denominator;
 return exact>p.reference?(exact+B-1n)/B*B:p.reference;
}
export const margin=r=>Number(r.net*10000n/r.price)/100;
if(process.argv[1]?.endsWith('industrial-rebalance.mjs')){
 const products=recipesFromSpecification(await readFile('docs/GLOBAL_INDUSTRIAL_MASTER_SPEC.txt','utf8'));
 if(products.length!==25)throw Error('Incomplete specification');
 const quotes=[3000,6000,10000,15000,20000];
 const rows=[],csv=['Product,Name,Original price ($),Proposed price ($),Copper ($/g),Original net ($),Original margin (%),Proposed net ($),Proposed margin (%),Manufacturing fee after A2 ($),Worker wages ($),Proposed freight ($)'];
 let md='# Factory export price rebalance — awaiting owner approval\n\n**Proposal only. No recipes, copper inputs, production times or live export prices have been modified.**\n\nThe original catalogue is profitable around the $0.60/g equilibrium under minimal staffing, but most products lose opportunity value around $1/g. This proposal gives commodity products modest margins and complex goods larger value-added margins at $1/g. It leaves substantial high-copper-price risk.\n\n## Exact assumptions\n\n- One funded output per job, neutral country, no news, quality, reputation or agreement bonus; no optional workers. All figures are fictional game money.\n- Copper cost is the **current sale opportunity** of the exact Standard copper consumed. Historical purchase cost is separate. Raw-copper direct sales have no buy spread; no 1% copper-purchase fee is counted here. If copper is bought for production, add its actual purchase spread to cash accounting.\n- Manufacturing fee = authored fee × 85%, applying the existing specified A2 production-fee discount. Copper inputs get no discount.\n- Minimum paid automation wages: F01–10 Operator $1B/job; F11–20 Operator + Supervisor $21B/job; F21–25 Operator + Factory Manager $101B/job. Shared hires are permanent capital costs, not recharged per product. No workers are granted by this proposal. Manual net is the listed net plus those wages.\n- **Proposed freight per dispatch:** `ceil[(0.0075 × locked gross + $250M × occupied cargo-volume × route base minutes / 15) × (1 − 0.03 × Export Logistics rank)]`. Ranks 0–10; never negative. The comparison uses Australia’s 15-minute route and rank 0. Other countries use the authored route lengths; vessel speed changes ETA, not this freight distance factor. For multiple goods, compute percentage freight per line plus handling for total occupied volume, and round the final dispatch total once.\n- No wages during idle time or return voyages. Wages are reserved once when a paid production job starts. Batch N multiplies copper/fees, while a job’s wages are amortized across N outputs; shipping handling scales by cargo volume.\n- Net margin = `(locked gross − current copper opportunity − fee − allocated wages − freight) / locked gross`. No gross revenue is called profit. No facility, vessel or worker purchase amortization is assumed; those are shown separately below.\n- Proposed prices are the smallest whole-$1B prices reaching the product-specific margin floor at $1/g, never below the original. Floors span 8–35% according to processing complexity; prices and floors are design proposals requiring approval.\n\n## Comparison\n\nEach cell is **original margin → proposed margin** at that copper price, after A2 fees, minimal wages and proposed freight. Exact dollar net results are in [the CSV](rebalance.csv). Compact displayed prices round down to two decimals; the CSV retains exact whole dollars.\n\n| Product | Original export | Proposed export | $0.30/g | $0.60/g | $1.00/g | $1.50/g | $2.00/g |\n|---|---:|---:|---:|---:|---:|---:|---:|\n';
 for(const [i,p] of products.entries()){
  const proposed=proposedPrice(p,i),cells=[];
  for(const q of quotes){const a=comparison(p,i,p.reference,q),b=comparison(p,i,proposed,q);cells.push(`${margin(a).toFixed(1)}% → ${margin(b).toFixed(1)}%`);csv.push([p.id,'"'+p.name+'"',p.reference/DOLLAR,proposed/DOLLAR,(q/10000).toFixed(2),a.net/DOLLAR,margin(a).toFixed(2),b.net/DOLLAR,margin(b).toFixed(2),b.fee/DOLLAR,b.wages/DOLLAR,b.shipping/DOLLAR].join(','));}
  md+=`| ${p.id} ${p.name} | ${money(p.reference,true)} | ${money(proposed,true)} | ${cells.join(' | ')} |\n`;
  rows.push({id:p.id,original:p.reference.toString(),proposed:proposed.toString(),targetMargin:TARGET_MARGINS[i]});
 }
 const profitable=quotes.map(q=>({price:q/10000,original:products.filter((p,i)=>comparison(p,i,p.reference,q).net>0n).length,proposed:products.filter((p,i)=>comparison(p,i,proposedPrice(p,i),q).net>0n).length}));
 md+='\n## What this changes\n\n'+profitable.map(r=>`- At $${r.price.toFixed(2)}/g: ${r.original}/25 original recipes and ${r.proposed}/25 proposed recipes have positive net under these assumptions.`).join('\n')+'\n\nAt $1.50/g, the most complex products retain some opportunity margin while commodity recipes favor selling copper directly. At $2/g, neutral exports are loss-making across this proposal; country demand, relationships and favorable world events can selectively improve offers, but no profit is promised. The production screen should compare actual quotes and require an explicit loss confirmation before reserving a negative-margin job.\n\n## Capital and sensitivity\n\nF01 minimum automated capital is the $1T factory + $50B license + $50B Operator hire + $100B Coastal Ship, plus 5Mt construction copper. This is $1.2T cash plus copper opportunity ($3T at equilibrium); capital should be recovered through repeated jobs, not hidden in the first per-unit margin. A2 reset does not grant these resources. Higher-tier research consumes authored goods and money; these remain investments. Ships take real outbound and return time, so throughput is constrained even when per-unit margin is positive.\n\nAll optional staff together cost $168B/job (Operator 1 + Handler 2 + Inspector 5 + Supervisor 20 + Logistics 40 + Manager 100). Buying every worker for a single cheap product can erase its margin; only assigned staff should be charged. Quality bonuses need to be compared with their real extra wages. For a more conservative long-route estimate, Brazil’s route handling charge is six times Australia’s, before any logistics reduction; the percentage portion stays 0.75%.\n\n**Approval requested:** these 25 proposed export reference prices, the freight formula, and loss-confirmation behavior. No changes will be applied before approval. The original prices remain the sole implementation baseline until then.\n';
 await mkdir('docs/industrial-era',{recursive:true});await writeFile('docs/industrial-era/rebalance-proposal.md',md);await writeFile('docs/industrial-era/rebalance.csv',csv.join('\n')+'\n');await writeFile('output/industrial-baseline/proposed-prices.json',JSON.stringify(rows,null,2));
 console.log(JSON.stringify({products:products.length,profitable},null,2));
}
