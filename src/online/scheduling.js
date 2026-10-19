// Idle workshops need revision reads, not repeated Edge requests or writes.
import {factorySettings,warehouseUsed} from '../empire/industry-state.js';
import {productById} from '../empire/industry-data.js';
export function nextWorkshopDue(s,now=Date.now(),bonuses={}){
 const at=[];const add=n=>{if(Number.isFinite(n))at.push(n);};
 if(s.ascension?.level>=2&&!s.ascension.industrialClaimed&&s.ascension.records?.some(r=>r.level===2))add(now);
 if(s.furnace.upgrades.auto)for(const j of s.furnace.jobs)add(j.ends);
 if(s.furnace.queue?.length&&s.copper[0]>=1000000n&&s.furnace.jobs.length<1+(s.furnace.upgrades.slots||0)+(s.prestige.slots||0))add(now);
 for(const j of s.industry?.jobs||[]){if(j.status==='producing')add(j.ends);if(j.status==='completed'&&j.auto){const f=s.industry.facilities.find(f=>f.id===j.factory);if(f&&warehouseUsed(s,f.id)+j.quantity*productById(j.product).volume<=factorySettings(s,f).warehouse)add(now);}}
 for(const f of s.industry?.facilities||[])if(!f.paused&&!f.pauseReason&&f.queue.length)add(now);
 for(const j of s.trade?.shipments||[])add(j.status==='LOADING'?j.departure:j.status==='OUTBOUND'?j.eta:j.status==='RETURNING'?j.returnAt:Infinity);
 for(const c of s.trade?.contracts||[])if(c.status==='active')add(c.deadline+1);
 if((bonuses.stock||s.automation.purchased&&s.automation.stock)&&!s.inventory[1])add(now);
 if(s.rebirth>=8&&s.automation.purchased&&s.automation.wire&&s.copper[0]>=50000n&&(s.components.parts||0)>0)add(s.automation.last+30000);
 if(s.market.limit&&s.market.quote>=s.market.limit.quote&&s.copper[s.market.limit.quality]>=s.market.limit.amount)add(now);
 return Math.min(Infinity,...at);
}
