import * as E from '../empire/state.js';
import {AURAS,AURA_TIERS} from '../empire/aura-data.js';
import {TOOLS,PRESTIGE,FURNACE_UPGRADES} from '../empire/data.js';
import {ESSENCE_UPGRADES,GOLD_EQUIPMENT,GOLD_RESEARCH} from '../empire/progression.js';
import {FACTORY_UPGRADES,WORKERS} from '../empire/industry-state.js';
import {productById} from '../empire/industry-data.js';
import {SHIP_CLASSES,PORT_UPGRADES,countryById} from '../empire/trade-data.js';
import {restoreAttempt} from './attempt.js';

export const UNIFIED_KEY='copper-unified-v1';
export const SYNC_INTERVAL=15*60*1000;
export const clone=value=>E.decode(E.encode(value));
const integer=(n,label,min=0,max=Number.MAX_SAFE_INTEGER)=>{if(!Number.isSafeInteger(n)||n<min||n>max)throw Error('Invalid '+label+'.');};
const exact=(n,label,limit=110)=>{if(typeof n!=='bigint'||n<0n||n.toString().length>limit)throw Error('Invalid exact '+label+'.');};

// Both the Edge Function and the browser validate the same complete document.
// Validation is deliberately not described as proof that local gameplay is honest.
export function validateSnapshot(input){
 const s=clone(input);
 if(s?.version!==4)throw Error('Unsupported save version. Original progress is preserved.');
 let nodes=0;const visit=(v,depth=0)=>{if(++nodes>100000||depth>32)throw Error('Save structure exceeds supported limits.');if(typeof v==='number'&&!Number.isFinite(v))throw Error('Invalid numeric save value.');if(v&&typeof v==='object')for(const[k,x]of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(k))throw Error('Unsafe save property.');visit(x,depth+1);}};visit(s);
 if(E.encode(s).length>1000000)throw Error('Save exceeds the one-megabyte limit. Export your recovery copy.');
 exact(s.money,'money');if(!Array.isArray(s.copper)||s.copper.length!==6)throw Error('Invalid copper qualities.');s.copper.forEach(n=>exact(n,'copper'));
 if(s.copperPurchased){if(!Array.isArray(s.copperPurchased)||s.copperPurchased.length!==6)throw Error('Invalid purchased copper record.');s.copperPurchased.forEach((n,q)=>{exact(n,'purchased copper');if(n>s.copper[q])throw Error('Purchased copper exceeds inventory.');});}
 integer(s.rebirth,'Rebirth',0,26);integer(s.xp,'XP');integer(s.pp,'Prestige Points');
 const a=s.ascension?.level??0;integer(a,'Ascension',0,5);
 if(s.ascension)integer(s.ascension.ce,'Copper Essence');
 for(const[id,n]of Object.entries(s.inventory||{})){integer(Number(id),'electronic ID',1,119);integer(n,'inventory count');}
 if(!Array.isArray(s.tools)||s.tools.some(id=>!TOOLS.some(t=>t.id===id)))throw Error('Invalid tool inventory.');
 for(const[id,n]of Object.entries(s.prestige||{})){const p=PRESTIGE.find(p=>p.id===id);integer(n,'prestige rank',0,id==='luck'?10:p?.max??0);}
 if(!s.stats||!s.run)throw Error('Missing workshop statistics.');
 for(const key of ['moneyEarned','moneySpent','copperCollected','copperSold'])exact(s.stats[key],'lifetime '+key);
 for(const key of ['completed','failed','purchased','contracts','bosses'])integer(s.stats[key],'lifetime '+key);
 if(s.gold){exact(s.gold.balance,'gold');exact(s.gold.recovered,'recovered gold');}
 // Existing integer aura counters are normalized without rounding.
 E.expansionDefaults(s);integer(s.compression,'Stage Compression rank',0,7);integer(s.compressionPolicyVersion,'compression policy version',1,1);integer(s.compressionAscension,'compression Ascension',0,5);
 for(const a of AURAS)exact(s.auras[a.id],a.name+' count',131072);exact(s.stats.rolls,'lifetime aura rolls',131072);
 integer(s.auraForge.tier,'Forge tier',0,AURA_TIERS.length-1);
 const ranks=(r,definitions,label)=>{if(!r||Array.isArray(r)||typeof r!=='object')throw Error('Invalid '+label+' ranks.');for(const[id,n]of Object.entries(r)){const d=definitions.find(d=>d.id===id);if(!d)throw Error('Unknown '+label+' upgrade.');integer(n,label+' rank',0,d.max);}};
 ranks(s.ascension.upgrades,ESSENCE_UPGRADES,'Essence');ranks(s.gold.equipment,GOLD_EQUIPMENT,'gold equipment');ranks(s.furnace.upgrades,FURNACE_UPGRADES,'furnace');ranks(s.trade.ports,PORT_UPGRADES,'port');
 if(s.gold.claims.some(id=>!Number.isInteger(id)||id<0||id>6)||new Set(s.gold.claims).size!==s.gold.claims.length||s.gold.research.some(id=>!GOLD_RESEARCH.some(p=>p.id===id)))throw Error('Invalid gold progression.');
 const facilities=new Set();for(const f of s.industry.facilities){integer(f.id,'factory',1,4);if(facilities.has(f.id)||!Array.isArray(f.queue))throw Error('Duplicate or invalid factory.');facilities.add(f.id);ranks(f.upgrades,FACTORY_UPGRADES,'factory');for(const q of f.queue){if(!productById(q.product))throw Error('Invalid queued product.');integer(q.quantity,'queued quantity',1,1000000);}}
 for(const[id,w]of Object.entries(s.industry.workers)){if(!WORKERS.some(x=>x.id===id)||typeof w.active!=='boolean')throw Error('Invalid worker.');integer(w.factory,'worker assignment',0,4);if(w.active&&!facilities.has(w.factory))throw Error('Worker assigned to a missing factory.');}
 if(s.industry.research.some(n=>!Number.isInteger(n)||n<1||n>5)||s.industry.licenses.some(id=>!productById(id)))throw Error('Invalid factory research or license.');
 for(const g of s.industry.goods){if(!facilities.has(g.factory)||!productById(g.product))throw Error('Invalid warehouse lot.');integer(g.quantity,'warehouse quantity',1);integer(g.quality,'product quality',0,1000);for(const key of ['fee','wages','copper','costBasis'])exact(g[key],'warehouse '+key);}
 for(const j of s.industry.jobs){if(!facilities.has(j.factory)||!productById(j.product)||!['reserved','challenge','producing','completed','failed'].includes(j.status))throw Error('Invalid production job.');integer(j.quantity,'production quantity',1,1000000);for(const key of ['fee','wages','copper'])exact(j[key],'production '+key);}
 if(typeof s.settings.sound!=='boolean'||typeof s.settings.motion!=='boolean')throw Error('Invalid workshop preferences.');
 if(s.equipped&&!AURAS.some(a=>a.id===s.equipped&&s.auras[a.id]>0n))throw Error('Equipped aura is not owned.');
 for(const job of [...s.furnace.jobs,...s.industry.jobs]){if(job.ends!==undefined)integer(Math.ceil(job.ends),'job timestamp');if(job.auraWork!==undefined&&(!Number.isFinite(job.auraWork)||job.auraWork<0))throw Error('Invalid remaining processing work.');}
 const ids=new Set();for(const ship of s.trade.ships){if(typeof ship.id!=='string'||ids.has(ship.id)||!SHIP_CLASSES.some(c=>c.id===ship.class)||!['AVAILABLE','LOADING','OUTBOUND','RETURNING'].includes(ship.state))throw Error('Duplicate or invalid vessel.');ids.add(ship.id);}
 const shipments=new Set();for(const j of s.trade.shipments){if(shipments.has(j.id)||!ids.has(j.ship)||!countryById(j.country)||!['LOADING','OUTBOUND','RETURNING'].includes(j.status)||!Number.isSafeInteger(j.eta)||j.eta<j.departure||j.returnAt<j.eta)throw Error('Invalid shipment continuity.');shipments.add(j.id);exact(j.gross,'locked shipment payment');}
 if(s.unifiedAttempt)restoreAttempt(s.unifiedAttempt);
 return s;
}

export function compactState(input){const s=validateSnapshot(input);s.market={...s.market,history:[]};s.goldMarket={...s.goldMarket,history:[]};delete s.unifiedRuntime;return s;}
export function canonical(value){const sort=v=>Array.isArray(v)?v.map(sort):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,sort(v[k])])):v;return E.encode(sort(value));}
export const sameSave=(a,b)=>canonical(compactState(a))===canonical(compactState(b));
export function candidate(source,state,meta={}){const valid=validateSnapshot(state);return {source,state:valid,meta,ascension:valid.ascension.level,rebirth:valid.rebirth};}
export function descendants(newer,older){return !!older?.id&&newer?.ownerId===older?.ownerId&&newer?.root===older?.root&&(newer.id===older.id||(newer.lineage||[]).includes(older.id));}
export function selectMigration(candidates){
 if(!candidates.length)throw Error('No valid save candidates.');
 const sorted=[...candidates].sort((a,b)=>b.ascension-a.ascension||b.rebirth-a.rebirth),top=sorted.filter(c=>c.ascension===sorted[0].ascension&&c.rebirth===sorted[0].rebirth);
 if(top.length===1)return {recommended:top[0].source,eligible:top.map(c=>c.source),reason:'Higher Ascension first, then higher Rebirth.'};
 if(top.every(c=>sameSave(c.state,top[0].state)))return {recommended:top.find(c=>c.source==='cloud')?.source||top[0].source,eligible:top.map(c=>c.source),reason:'These saves contain the same progress.'};
 const descendant=top.find(c=>top.every(o=>c===o||descendants(c.meta,o.meta)));
 return {recommended:descendant?.source||null,eligible:top.map(c=>c.source),reason:descendant?'A newer descendant of the same save.':'Equal Ascension and Rebirth with different progress. Choose a complete save; balances are never combined.'};
}

// Top-level replacement patches have unambiguous semantics and preserve BigInt.
// Only changed domains cross the wire on shared-economic requests.
export function statePatch(base,next){const a=compactState(base),b=compactState(next),patch={};for(const key of new Set([...Object.keys(a),...Object.keys(b)]))if(canonical(a[key])!==canonical(b[key]))patch[key]=b[key]===undefined?{$delete:true}:b[key];return patch;}
export function applyPatch(base,patch){if(!patch||Array.isArray(patch)||typeof patch!=='object')throw Error('Invalid save patch.');const s=clone(base);for(const[k,v]of Object.entries(patch)){if(['__proto__','constructor','prototype','unifiedRuntime'].includes(k))throw Error('Invalid patch key.');if(v?.$delete===true&&Object.keys(v).length===1)delete s[k];else s[k]=clone(v);}return validateSnapshot(s);}
export function anomalyFlags(previous,next,elapsed){const flags=[];if(next.rebirth>18&&next.ascension.level<2||next.rebirth>12&&next.ascension.level<1)flags.push('legacy_chapter_without_ascension');if(previous){if(next.stats.completed-previous.stats.completed>Math.max(1000,Math.ceil(elapsed/1000)*20))flags.push('unusually_fast_recoveries');if(next.ascension.level>previous.ascension.level+1)flags.push('ascension_jump');if(next.stats.completed<previous.stats.completed||next.stats.rolls<previous.stats.rolls)flags.push('lifetime_counter_regression');}return flags;}

export function validateLockedTrade(before,after){
 if(before?.copperPurchased&&!after.copperPurchased)throw Error('UPDATE_REQUIRED: Reload to preserve copper purchase provenance.');
 if(!before?.trade)return;
 // Once connected, only the server may change the shipping domain. Local
 // factory production can add stock, but cannot rewrite funded shipment locks.
 if(canonical(before.trade)!==canonical(after.trade))throw Error('ECONOMY_CONFLICT: Refresh server-settled shipping before synchronizing.');
}
