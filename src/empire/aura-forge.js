import {AURAS,AURA_TIERS,AURA_TIER_COSTS,AURA_ROLL_COST,auraById,auraSpeed} from './aura-data.js';
import {sampleAuras,secureUniform} from './aura-sampler.js';
const count=n=>{if(typeof n==='number'&&!Number.isSafeInteger(n)||!['number','bigint','string'].includes(typeof n)||!/^\d+$/.test(String(n)))throw Error('An aura counter is invalid. Your original save is preserved.');return BigInt(n);};
export function auraDefaults(s){
 s.auras??={};s.stats??={};s.stats.rolls=count(s.stats.rolls??0);
 for(const a of AURAS)s.auras[a.id]=count(s.auras[a.id]??0);
 s.auraForge??={version:1,tier:0,legacyQualityLuck:0,refundedPP:0};
 if(!Number.isInteger(s.auraForge.tier)||s.auraForge.tier<0||s.auraForge.tier>=AURA_TIERS.length)throw Error('Invalid saved Aura Forge tier.');
 if(!s.auraForge.migrated){const rank=s.prestige?.luck||0;if(!Number.isInteger(rank)||rank<0||rank>10)throw Error('Invalid legacy luck rank.');
  const refund=rank*(rank+1);s.pp=(s.pp||0)+refund;s.auraForge.refundedPP=refund;s.auraForge.legacyQualityLuck=rank*.05;
  if(s.prestige)delete s.prestige.luck;s.auraForge.migrated=true;
 }
 if(s.equipped&&(!auraById(s.equipped)||s.auras[s.equipped]===0n))s.equipped=null;
 return s;
}
export const totalAuras=s=>AURAS.reduce((sum,a)=>sum+count(s.auras[a.id]??0),0n);
export const uniqueAuras=s=>AURAS.filter(a=>count(s.auras[a.id]??0)>0n).length;
export function buyAuraCapacity(s,tier){auraDefaults(s);if(s.rebirth<2)throw Error('Aura Forge unlocks at Rebirth 2.');if(tier!==s.auraForge.tier+1||tier>=AURA_TIERS.length)throw Error('Purchase the next sequential capacity tier.');const cost=AURA_TIER_COSTS[tier];if(s.money<cost)throw Error('Not enough money for this capacity upgrade.');s.money-=cost;s.stats.moneySpent+=cost;s.auraForge.tier=tier;s.revision++;return {tier,maximum:AURA_TIERS[tier],cost};}
export function rollAuras(s,n,random=secureUniform){
 auraDefaults(s);if(s.rebirth<2)throw Error('Aura Forge unlocks at Rebirth 2.');
 if(!Number.isSafeInteger(n)||n<1||n>AURA_TIERS[s.auraForge.tier]||!AURA_TIERS.includes(n))throw Error('Select an unlocked batch quantity.');
 const cost=BigInt(n)*AURA_ROLL_COST;if(s.money<cost)throw Error('Not enough money for this aura batch.');
 // Sample fully before touching money or inventory. A sampling error awards
 // nothing and cannot leave a partially charged pure-state transition.
 return settleAuraBatch(s,n,sampleAuras(n,random));
}
export function settleAuraBatch(s,n,sampled){
 auraDefaults(s);if(s.rebirth<2||!AURA_TIERS.includes(n)||n>AURA_TIERS[s.auraForge.tier])throw Error('Select an unlocked batch quantity.');
 const cost=BigInt(n)*AURA_ROLL_COST;if(s.money<cost)throw Error('Not enough money for this aura batch.');
 if(AURAS.some(a=>!Number.isSafeInteger(sampled[a.id])||sampled[a.id]<0)||Object.values(sampled).reduce((a,b)=>a+b,0)!==n)throw Error('Incomplete batch. No purchase was made.');
 const discovered=AURAS.filter(a=>sampled[a.id]>0&&s.auras[a.id]===0n).map(a=>a.id);
 s.money-=cost;s.stats.moneySpent+=cost;for(const a of AURAS)s.auras[a.id]+=BigInt(sampled[a.id]);s.stats.rolls+=BigInt(n);s.revision++;
 const result={quantity:n,cost,counts:Object.fromEntries(AURAS.map(a=>[a.id,BigInt(sampled[a.id])])),best:AURAS.filter(a=>sampled[a.id]>0).at(-1).id,discovered,total:totalAuras(s),lifetime:s.stats.rolls,unique:uniqueAuras(s)};
 s.auraForge.lastBatch=result;return result;
}
export function startAuraJob(job,s,kind,now,work){job.auraWork=work;job.auraAt=now;job.auraRate=auraSpeed(s,kind);job.ends=now+work/job.auraRate;return job;}
export function equipForgeAura(s,id,now=Date.now()){
 auraDefaults(s);if(id!==null&&(!auraById(id)||s.auras[id]===0n))throw Error('Collect this aura first.');
 const next={...s,equipped:id};
 for(const [kind,jobs]of [['smelting',s.furnace?.jobs||[]],['factory',(s.industry?.jobs||[]).filter(j=>j.status==='producing')]])for(const job of jobs){
  if(job.ends<=now)continue;
  const anchor=job.auraAt??now,stamp=Math.max(now,anchor),rate=job.auraRate??1;
  const work=job.auraWork===undefined?Math.max(0,job.ends-stamp):Math.max(0,job.auraWork-(stamp-anchor)*rate);
  startAuraJob(job,next,kind,stamp,work);
 }
 s.equipped=id;s.revision++;
}
export function reduceAuraJob(job,now,fraction){const remaining=Math.max(0,job.ends-now),saved=remaining*fraction;if(job.auraWork!==undefined){job.auraWork=Math.max(0,remaining-saved)*job.auraRate;job.auraAt=Math.max(now,job.auraAt);}job.ends-=saved;return saved;}
