// Permanent expansion progression. All quantities of metal are integer milligrams.
import {DOLLAR,MG} from './data.js';
export const COMPRESSION_COSTS=[100n*MG.g,10n*MG.kg,MG.t,100n*MG.t,10n*MG.kt,MG.Mt,100n*MG.Mt];
export const ASCENSIONS=[null,{ce:25,recovery:250},{ce:40,recovery:300},{ce:60,recovery:350},{ce:85,recovery:400},{ce:115,recovery:450}];
export const ESSENCE_UPGRADES=[
 ['extraction','Essence Extraction',5,5,'+10% copper recovery per rank'],
 ['learning','Accelerated Learning',5,5,'+10% earned XP per rank'],
 ['momentum','Workshop Momentum',8,5,'+10% contract and boss money per rank'],
 ['precision','Precision Legacy',6,5,'+5% timing tolerance per rank'],
 ['heritage','Industrial Heritage',10,5,'+10% smelting and refining throughput per rank'],
 ['gold','Golden Insight',8,5,'+10% gold recovery per rank'],
 ['efficiency','Essence Efficiency',12,5,'3% lower ordinary tool and furnace upgrade costs per rank'],
 ['master','Master Recycling',15,1,'Unlocks advanced Golden Engineering research']
].map(([id,name,cost,max,description])=>({id,name,cost,max,description}));
export const GOLD_EQUIPMENT=[
 ['pan','Reinforced Gold Pan',20,4,0,'+8% target width per rank'],
 ['kit','Precision Panning Kit',60,4,0,'12% less instability per rank'],
 ['map','River Survey Map',100,1,0,'Unlocks surveyed claims; shows the next current direction'],
 ['filter','Fine Sediment Filter',160,4,1,'+10% gold recovery per rank'],
 ['tray','Gold Recovery Tray',250,4,1,'+8% gold recovery per rank'],
 ['station','Advanced Panning Station',500,3,2,'+6% target width and 8% shorter rounds per rank'],
 ['concentrator','Gold Concentrator',1000,4,2,'+15% gold recovery per rank'],
 ['drone','Survey Drone',2000,3,3,'20% less current acceleration per rank'],
 ['vault','Gold Storage Vault',4000,3,3,'+10% gold recovery per rank; secures advanced claim permits'],
 ['supply','Automated Sediment Supply',6500,3,4,'8% shorter panning rounds per rank; still requires manual play'],
 ['washer','Industrial Gold Washer',10000,3,4,'+20% gold recovery per rank'],
 ['lab','Golden Research Laboratory',18000,2,5,'Unlocks advanced research and +15% gold recovery per rank']
].map(([id,name,cost,max,claim,description])=>({id,name,cost:BigInt(cost),max,claim,description}));
export const GOLD_CLAIMS=[
 ['Starter Creek',10,30,0,null,0,'Gentle, steady current'],
 ['Copperbank River',25,60,200,'map',1,'A slow oscillating current'],
 ['Golden Bend',50,120,1000,'filter',1,'Two crossing current waves'],
 ['Crystal Rapids',100,250,5000,'station',1,'Visible periodic rapids'],
 ['Ember Valley',200,500,15000,'drone',1,'A moving target and warm gusts'],
 ['Ancient Riverbed',400,1000,40000,'vault',1,'Narrow pockets and sediment build-up'],
 ['Imperial Goldfields',800,2000,100000,'lab',1,'Alternating rapids, moving pockets, and sediment']
].map(([name,min,max,recovered,equipment,rank,behavior],id)=>({id,name,min:BigInt(min),max:BigInt(max),recovered:BigInt(recovered),equipment,rank,behavior}));
export const GOLD_RESEARCH=[
 ['contacts','Golden Contacts',250,0,0,null,'+10% copper recovery'],
 ['conductive','Conductive Research',500,0,0,null,'+10% electronic XP'],
 ['alloying','Precision Alloying',1000,0,0,null,'+5% timing tolerance'],
 ['funding','Industrial Funding',2000,0,0,null,'+10% contract money'],
 ['processing','Efficient Processing',4000,10,1000000,'contacts','+15% smelting throughput'],
 ['metallurgy','Advanced Metallurgy',8000,25,5000000,'processing','+15% refining throughput'],
 ['logistics','Workshop Logistics',12000,50,10000000,'funding','10% lower electronics prices'],
 ['recovery','Master Recovery Systems',25000,100,100000000,'metallurgy','+20% copper recovery; requires Master Recycling and a laboratory'],
 ['legacy','Golden Legacy',50000,250,1000000000,'recovery','Permanent workshop: +5% timing tolerance and one puzzle hint; requires Master Recycling and laboratory rank 2']
].map(([id,name,gold,kg,money,prerequisite,description],i)=>({id,name,gold:BigInt(gold),copper:BigInt(kg)*MG.kg,money:BigInt(money)*DOLLAR,prerequisite,description,component:i>=7?'masterAssembly':i>=4?'precisionPart':null}));
export function expansionDefaults(s){
 s.compression??=0;s.ascension??={level:0,ce:0,upgrades:{},records:[]};s.pendingAscension??=null;
 s.gold??={unlocked:false,balance:0n,recovered:0n,claims:[0],equipment:{},research:[],attempts:0,completed:0,failed:0,history:[]};
 s.goldMarket??={quote:600000,previous:600000,next:0,history:[],global:false};
 return s;
}
export function effectiveStageCount(s,d){
 const workbench=(s.tools.includes('workbench')||s.legacyBonuses.includes('workshop'))&&d.id>=9?1:0;
 const floor=d.rebirth===s.rebirth?Math.min(3,d.stageCount):1;
 return Math.min(d.stageCount,Math.max(floor,d.stageCount-(s.compression||0)-workbench));
}
export function buyCompression(s,expectedRank){
 const rank=s.compression||0,cost=COMPRESSION_COSTS[rank];
 if(expectedRank!==rank+1||cost===undefined)throw Error('Review the current Stage Compression rank.');
 if(s.copper[0]<cost)throw Error('Not enough standard copper for this compression rank.');
 s.copper[0]-=cost;s.compression=rank+1;s.revision++;return s.compression;
}
export const essenceCost=(s,u)=>u.cost*((s.ascension?.upgrades[u.id]||0)+1);
export function buyEssence(s,id,expectedRank){
 expansionDefaults(s);const u=ESSENCE_UPGRADES.find(x=>x.id===id),rank=s.ascension.upgrades[id]||0;
 if(!u||!s.ascension.level||rank>=u.max||expectedRank!==rank+1||s.ascension.ce<essenceCost(s,u))throw Error('Check the essence cost, rank, and Ascension requirement.');
 s.ascension.ce-=essenceCost(s,u);s.ascension.upgrades[id]=rank+1;s.revision++;
}
export function permanentBonuses(s){
 const a=s.ascension||{level:0,upgrades:{}},u=a.upgrades,r=s.gold?.research||[],e=s.gold?.equipment||{};
 return {recovery:(ASCENSIONS[a.level]?.recovery||100)*(100+(u.extraction||0)*10+(r.includes('contacts')?10:0)+(r.includes('recovery')?20:0))/100,
 xp:(a.level?2:1)*(100+(u.learning||0)*10),electronicXP:r.includes('conductive')?10:0,
 money:(a.level?2:1)*(100+(u.momentum||0)*10),contract:r.includes('funding')?10:0,
 width:(u.precision||0)*.05+(r.includes('alloying')?.05:0)+(r.includes('legacy')?.05:0),hint:r.includes('legacy')?1:0,
 shopDiscount:(a.level?25:0)+(r.includes('logistics')?10:0),toolDiscount:(a.level?25:0)+(u.efficiency||0)*3,
 upgradeDiscount:(u.efficiency||0)*3,smelting:1+(u.heritage||0)*.1+(r.includes('processing')?.15:0),refining:1+(u.heritage||0)*.1+(r.includes('metallurgy')?.15:0),
 gold:100+(u.gold||0)*10+(e.filter||0)*10+(e.tray||0)*8+(e.concentrator||0)*15+(e.vault||0)*10+(e.washer||0)*20+(e.lab||0)*15};
}
export function ascensionRequirement(s){
 const next=(s.ascension?.level||0)+1;
 if(next>5)return {next,capped:true,rebirth:18,level:0,earned:0n,gold:0n,device:87,stages:0};
 return {next,capped:false,rebirth:next===1?12:18,level:next===1?28:46+(next-2)*4,device:next===1?52:87,
 earned:next===1?0n:10000000000000n*DOLLAR*2n**BigInt(next-2),gold:next===1?0n:1000000n*2n**BigInt(next-2),stages:12+(next-1)*2};
}
export function ascensionReady(s){const r=ascensionRequirement(s);return !r.capped&&s.rebirth>=r.rebirth&&1+Math.floor(Math.sqrt(s.xp/20))>=r.level&&s.run.devices.includes(r.device)&&s.run.earned>=r.earned&&(s.gold?.recovered||0n)>=r.gold;}
export function prepareAscension(s,a){
 if(!ascensionReady(s)||s.pendingAscension)throw Error('Meet every current Ascension milestone first.');
 s.pendingAscension={attempt:a.id,level:s.ascension.level,next:s.ascension.level+1,at:Date.now()};
}
export function confirmAscension(s,blankRun){
 expansionDefaults(s);const p=s.pendingAscension;
 if(!p||p.level!==s.ascension.level||p.next!==p.level+1||!ascensionReady(s))throw Error('Complete and review the current Ascension Trial first.');
 const next=p.next,reward=ASCENSIONS[next];s.ascension.level=next;s.ascension.ce+=reward.ce;
 s.ascension.records.push({level:next,ce:reward.ce,at:Date.now(),attempt:p.attempt,rebirth:s.rebirth});
 s.gold.unlocked=true;s.rebirth=0;s.xp=0;s.money=0n;s.copper=Array(6).fill(0n);s.inventory={};s.tools=['basic'];s.legacyBonuses=[];
 s.pp=0;s.prestige={};s.components={parts:0};s.research=[];s.contracts=[];s.run=blankRun();
 s.furnace={jobs:[],upgrades:{},ingots:0,refined:0};s.refining={unlocked:false,research:0};s.automation={purchased:false,stock:false,wire:false,last:Date.now()};
 s.market.limit=null;s.pendingRebirth=null;s.pendingAscension=null;s.bossClaims=[];
 s.history.unshift({id:'ascension-'+next,ascension:next,amount:0n,at:Date.now()});s.revision++;return next;
}
export const goldEquipmentCost=(s,e)=>e.cost*2n**BigInt(s.gold.equipment[e.id]||0);
export function unlockGoldClaim(s,id){
 expansionDefaults(s);const c=GOLD_CLAIMS[id],g=s.gold;
 if(!g.unlocked||!c||g.claims.includes(id)||!g.claims.includes(id-1)||g.recovered<c.recovered||(c.equipment&&(g.equipment[c.equipment]||0)<c.rank))throw Error('Meet the previous claim, recovered-gold, and equipment prerequisites.');
 g.claims.push(id);s.revision++;
}
export function buyGoldEquipment(s,id,expectedRank){
 expansionDefaults(s);const e=GOLD_EQUIPMENT.find(x=>x.id===id),g=s.gold,rank=g.equipment[id]||0;
 if(!e||!g.unlocked||!g.claims.includes(e.claim)||rank>=e.max||expectedRank!==rank+1||g.balance<goldEquipmentCost(s,e))throw Error('Check the claim prerequisite, gold cost, and equipment rank.');
 g.balance-=goldEquipmentCost(s,e);g.equipment[id]=rank+1;s.revision++;
}
export function buyGoldResearch(s,id){
 expansionDefaults(s);const r=GOLD_RESEARCH.find(x=>x.id===id),g=s.gold;
 if(!r||!g.unlocked||g.research.includes(id)||(r.prerequisite&&!g.research.includes(r.prerequisite))||(['recovery','legacy'].includes(id)&&(!(s.ascension.upgrades.master>0)||(g.equipment.lab||0)<(id==='legacy'?2:1)))||g.balance<r.gold||s.copper[0]<r.copper||s.money<r.money||(r.component&&!(s.components[r.component]>0)))throw Error('Meet all displayed research prerequisites and costs.');
 g.balance-=r.gold;s.copper[0]-=r.copper;s.money-=r.money;s.stats.moneySpent+=r.money;if(r.component)s.components[r.component]--;g.research.push(id);s.revision++;
}
export function rewardGold(s,a,grade,random){
 const g=s.gold,c=GOLD_CLAIMS[a.claim];if(!g?.unlocked||!c||!g.claims.includes(a.claim))throw Error('This river claim is locked.');
 const entropy=random();if(!Number.isFinite(entropy)||entropy<0||entropy>=1)throw Error('Invalid reward entropy.');
 const base=c.min+BigInt(Math.floor(entropy*Number(c.max-c.min+1n)));
 const amount=base*BigInt({C:100,B:105,A:110,S:120}[grade])*BigInt(permanentBonuses(s).gold)/10000n;
 g.balance+=amount;g.recovered+=amount;g.completed++;a.paid=true;
 const result={gold:true,claim:a.claim,grade,amount,base,xp:0,at:Date.now()};g.history.unshift(result);g.history=g.history.slice(0,50);s.revision++;return result;
}
export function tradeGold(s,side,amount,quote){
 if(!s.gold?.unlocked||typeof amount!=='bigint'||amount<=0n||!Number.isInteger(quote)||quote<300000||quote>1800000||quote!==s.goldMarket.quote)throw Error('Review your available gold and current gold quote.');
 const value=amount*BigInt(quote)*100n;
 if(side==='buy'){const cost=(value*101n+99n)/100n;if(s.money<cost)throw Error('Not enough money.');s.money-=cost;s.stats.moneySpent+=cost;s.gold.balance+=amount;s.revision++;return {gold:true,side,amount,cost,quote};}
 if(side==='sell'){if(s.gold.balance<amount)throw Error('Not enough gold.');s.gold.balance-=amount;s.money+=value;s.stats.moneyEarned+=value;s.run.earned+=value;s.revision++;return {gold:true,side,amount,proceeds:value,quote};}
 throw Error('Unknown gold trade.');
}
export const GOLD_REBIRTHS=[
 [30,80000000000n,5000n,'Recover 5 g gold through panning'],[32,180000000000n,15000n,'Recover 15 g gold and complete 3 Golden Engineering projects'],
 [34,400000000000n,40000n,'Recover 40 g gold and an R13 electronic this run'],[36,900000000000n,100000n,'Recover 100 g gold and unlock Crystal Rapids or beyond'],
 [38,2000000000000n,250000n,'Recover 250 g gold and defeat the Imperial Foundry Titan this run'],[40,4500000000000n,600000n,'Recover 600 g gold and complete Golden Legacy']
];
export function goldRebirthExtra(s){
 const i=s.rebirth-12,r=GOLD_REBIRTHS[i];if(!r||!(s.ascension?.level>=1)||(s.gold?.recovered||0n)<r[2])return false;
 return i===0||i===1&&s.gold.research.length>=3||i===2&&s.run.devices.some(id=>id>=53&&id<=58)||i===3&&s.gold.claims.some(id=>id>=3)||i===4&&s.run.bosses.includes('imperial')||i===5&&s.gold.research.includes('legacy');
}
