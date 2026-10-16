import fs from 'node:fs';
import * as E from '../src/empire/state.js';
import {CATALOGUE} from '../src/empire/catalogue.js';
import {DOLLAR,TOOLS,BOSSES,rng} from '../src/empire/data.js';
export function simulate(probability,seed=2026,chapters=13){
 const random=rng(seed),s=E.newState(0),report=[];let stages=0,attempts=0,failures=0;
 function attempt(id,options={}){const a=E.begin(s,id,{...options,seed:Math.floor(random()*2**32)});attempts++;const score=random()<(probability===.95?.75:.15)?1:.88;while(a.status!=='complete'){a.status='active';stages++;if(random()>probability){E.stageFail(s,a);failures++;return false;}E.stagePass(a,score);}E.reward(s,a,random);return true;}
 for(let chapter=0;chapter<chapters;chapter++){
  const before={stages,attempts,failures,completed:s.stats.completed};let loops=0;
  while(!E.rebirthReady(s)){
   if(++loops>20000)throw Error(`Progress stalled at R${chapter}: level ${E.level(s)}, money earned ${s.run.earned/DOLLAR}, extra ${E.extraReady(s)}`);
   for(const c of [...s.contracts])if(!c.claimed&&E.contractProgress(s,c)>=c.target)E.claimContract(s,c.id);
   if((chapter===5&&s.run.advancedContracts<3)||(chapter===8&&s.run.difficultContracts<5)){const rank=chapter===5?'advanced':'difficult',offer=E.availableContracts(s).find(c=>c.rank===rank&&c.type==='complete');if(offer&&!s.contracts.some(c=>!c.claimed&&c.name===offer.name))E.acceptContract(s,offer);}
   const needBoss=chapter===6?true:chapter===9?!s.run.bosses.some(id=>['generator','colossus'].includes(id)):chapter>=11?!s.run.bosses.includes('colossus'):false;
   if(needBoss){const boss=[...BOSSES].reverse().find(b=>s.rebirth>=b.rebirth&&E.level(s)>=b.level&&!s.bossClaims.includes(`${b.id}-${s.rebirth}`)&&(chapter<9||['generator','colossus'].includes(b.id))&&(chapter<11||b.id==='colossus'));if(boss){attempt(Math.min(52,boss.rebirth*4+1),{mode:'boss',boss,difficulty:boss.difficulty});continue;}}
   let eligible=CATALOGUE.filter(d=>E.unlocked(s,d)&&(s.inventory[d.id]>0||s.money>=E.shopPrice(s,d)));
   let d=eligible.at(-1);
   if((chapter===3&&s.run.devices.length<5)||(chapter===7&&s.run.devices.length<8))d=eligible.find(d=>!s.run.devices.includes(d.id))||d;
   if(!(s.inventory[d.id]>0))E.purchaseDevice(s,d.id);
   attempt(d.id,chapter===4&&s.run.expert===0?{difficulty:4}:{});
   // Copper is earned only by complete attempts. Failures retain the original electronic.
   for(let q=0;q<6;q++)if(s.copper[q])E.sell(s,s.copper[q],q);
  }
  while(!attempt(1,{mode:'trial',difficulty:Math.min(6,Math.floor(chapter/2))})){if(attempts>500000)throw Error('Trial retry cap');}
  const row={rebirth:chapter+1,stageSuccessRate:probability,attempts:attempts-before.attempts,failedAttempts:failures-before.failures,stagesPlayed:stages-before.stages,devicesCompleted:s.stats.completed-before.completed,earnedDollars:Number(s.run.earned)/Number(DOLLAR),level:E.level(s),unlockedDevices:CATALOGUE.filter(d=>E.unlocked(s,d)).length};
  E.confirmRebirth(s);row.availableAfterRebirth=CATALOGUE.filter(d=>d.rebirth<=s.rebirth).length;report.push(row);
 }
 return {probability,seed,assumptions:'Independent per-stage success; retry retained items; all copper sold at $0.50/g; no tools or prestige bonuses; A/S performance mix; active contract and boss requirements; no offline rewards.',totals:{attempts,failures,stages,completed:s.stats.completed,rebirth:s.rebirth,pp:s.pp},chapters:report};
}
if(process.argv[1]?.endsWith('balance.mjs')){const result=[simulate(.7),simulate(.95)];fs.mkdirSync('output',{recursive:true});fs.writeFileSync('output/balance-report.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result.map(r=>({probability:r.probability,...r.totals})),null,2));}
