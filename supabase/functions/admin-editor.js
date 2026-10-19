// Shared pure validation for owner edits; authorization is enforced separately by the API and SQL.
import * as E from '../../src/empire/state.js';
import {DOLLAR,MG,TOOLS,decimal} from '../../src/empire/data.js';
import {deviceById} from '../../src/empire/catalogue.js';
import {GOLD_EQUIPMENT,GOLD_RESEARCH} from '../../src/empire/progression.js';
export const MAIN_EDIT_WARNING="You're modifying your real workshop. This change will be saved, but administrator-granted progression will not count as legitimately earned leaderboard progress.";
export const MARKET_EVENTS={shortage:{name:'Copper Shortage',ticks:18,bias:.014,volatility:1.2},demand:{name:'Industrial Demand Surge',ticks:24,bias:.01,volatility:1.1},manufacturing:{name:'Manufacturing Boom',ticks:30,bias:.006,volatility:1.05},glut:{name:'Supply Glut',ticks:18,bias:-.014,volatility:1.2},recycling:{name:'Recycling Boom',ticks:24,bias:-.009,volatility:1.05},panic:{name:'Market Panic',ticks:9,bias:-.025,volatility:1.5},recovery:{name:'Market Recovery',ticks:24,bias:0,volatility:.8,reversion:4}};
export const marketDefaults=asset=>({minimum:asset==='gold'?300000:3000,equilibrium:asset==='gold'?600000:6000,maximum:asset==='gold'?1800000:20000,up:[2,5,8,10],down:[2,5,8,10],probabilities:[20,55,22,3],momentum:.72,reversion:.003,bias:'automatic',persistence:.85,reversal:.06,mode:'automatic'});
const number=(v,min,max)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error('Invalid numeric setting.');return v;};
const integer=(v,min,max)=>{number(v,min,max);if(!Number.isSafeInteger(v))throw Error('Enter a whole number.');return v;};
export function validateMarketConfig(c){
 if(!c||typeof c!=='object'||Array.isArray(c))throw Error('Invalid market configuration.');
 const out={};for(const key of ['minimum','equilibrium','maximum'])out[key]=integer(c[key],1,2000000000);
 if(!(out.minimum<out.equilibrium&&out.equilibrium<out.maximum))throw Error('Require 0 < minimum < equilibrium < maximum.');
 for(const key of ['up','down','probabilities']){if(!Array.isArray(c[key])||c[key].length!==4)throw Error('Provide four regime values.');out[key]=c[key].map(v=>number(v,0,100));}
 if(Math.abs(out.probabilities.reduce((a,b)=>a+b,0)-100)>.000001)throw Error('Regime probabilities must total 100%.');
 for(const key of ['momentum','persistence','reversal'])out[key]=number(c[key],0,1);out.reversion=number(c.reversion,0,.2);
 if(!['automatic','strongly-bullish','bullish','neutral','bearish','strongly-bearish'].includes(c.bias)||!['automatic','quiet','normal','turbulent','extreme','frozen'].includes(c.mode))throw Error('Choose a supported market mode and direction.');
 out.bias=c.bias;out.mode=c.mode;return out;
}
export function priceInteger(value,signed=false){const raw=String(value);if(raw.length>30||!(signed?/^-?\d+(?:\.\d{1,4})?$/:/^\d+(?:\.\d{1,4})?$/).test(raw))throw Error('Use a price with at most four decimal places.');const neg=raw.startsWith('-'),n=decimal(neg?raw.slice(1):raw,10000n)*(neg?-1n:1n);if(n>2000000000n||n< -2000000000n)throw Error('Price exceeds the supported range.');return Number(n);}
function exact(value,scale=1n){const text=String(value??'');if(text.length>90||!/^\d+(?:\.\d+)?$/.test(text))throw Error('Enter a nonnegative exact amount.');const n=decimal(text,scale);if(n.toString().length>110)throw Error('Amount exceeds the supported range.');return n;}
function safe(value,min=0,max=1000000){return integer(Number(value),min,max);}
export function editSave(source,p){
 const s=E.expansionDefaults(E.decode(E.encode(source))),before=E.decode(E.encode(s));
 const multiply=(value,allowed)=>{const n=safe(p.value,1,10);if(!allowed.includes(n))throw Error('Choose a supported multiplier.');const result=value*BigInt(n);if(result.toString().length>110)throw Error('Amount exceeds the supported range.');return result;};
 switch(p.kind){
 case 'money-add':s.money+=exact(p.value,DOLLAR);break;case 'money-set':s.money=exact(p.value,DOLLAR);break;case 'money-multiply':s.money=multiply(s.money,[2,5,10]);break;
 case 'copper-add':case 'copper-set':case 'copper-multiply':{const q=safe(p.quality,0,5);if(p.kind==='copper-multiply')s.copper[q]=multiply(s.copper[q],[2,5,10]);else{if(!MG[p.unit])throw Error('Choose a valid metal unit.');const n=exact(p.value,MG[p.unit]);s.copper[q]=p.kind==='copper-add'?s.copper[q]+n:n;}break;}
 case 'gold-add':case 'gold-set':case 'gold-multiply':if(p.kind==='gold-multiply')s.gold.balance=multiply(s.gold.balance,[2,10]);else{if(!MG[p.unit])throw Error('Choose a valid gold unit.');const n=exact(p.value,MG[p.unit]);s.gold.balance=p.kind==='gold-add'?s.gold.balance+n:n;}break;
 case 'rebirth-set':s.rebirth=safe(p.value,0,26);s.pendingRebirth=null;s.pendingAscension=null;break;
 case 'level-set':s.xp=E.levelXP(safe(p.value,1,1000000));break;
 case 'xp-set':s.xp=safe(p.value,0,100000000000000);break;case 'xp-add':s.xp=safe(s.xp+safe(p.value,0,100000000000000),0,100000000000000);break;
 case 'electronic':{const id=safe(p.id,1,119),n=safe(p.value,1,1000000);if(!deviceById(id))throw Error('Unknown electronic.');s.inventory[id]=safe((s.inventory[id]||0)+n,0,1000000000);break;}
 case 'practice':{const id=safe(p.id,1,119);if(!s.encountered.includes(id))s.encountered.push(id);break;}
 case 'tool':if(!TOOLS.some(t=>t.id===p.id))throw Error('Unknown tool.');if(!s.tools.includes(p.id))s.tools.push(p.id);break;
 case 'prestige':s.pp=safe(s.pp+safe(p.value),0,1000000000);break;
 case 'ascension':s.ascension.level=safe(p.value,0,5);s.pendingAscension=null;if(s.ascension.level)s.gold.unlocked=true;break;
 case 'ce-add':s.ascension.ce=safe(s.ascension.ce+safe(p.value),0,1000000000);break;case 'ce-set':s.ascension.ce=safe(p.value,0,1000000000);break;
 case 'gold-claims':{const id=safe(p.value,0,6);s.gold.unlocked=true;s.gold.claims=Array.from({length:id+1},(_,i)=>i);break;}
 case 'gold-equipment':{const e=GOLD_EQUIPMENT.find(e=>e.id===p.id);if(!e)throw Error('Unknown gold equipment.');s.gold.equipment[e.id]=safe(p.value,0,e.max);break;}
 case 'gold-research':if(!GOLD_RESEARCH.some(r=>r.id===p.id))throw Error('Unknown Golden Engineering project.');if(!s.gold.research.includes(p.id))s.gold.research.push(p.id);break;
 case 'reset-progression':{const fresh=E.newState();fresh.settings={...s.settings};return {state:fresh,details:{kind:p.kind,reset:true}};}
 default:throw Error('Unknown player edit.');
 }
 if(s.money.toString().length>110||[...s.copper,s.gold.balance].some(x=>x.toString().length>110))throw Error('Balance exceeds the supported range.');
 // No recovery, boss, earnings, panned-gold, or achievement history is fabricated.
 s.revision++;const changed={};for(const key of Object.keys(s))if(E.encode(s[key])!==E.encode(before[key]))changed[key]={before:before[key],after:s[key]};
 return {state:s,details:{kind:p.kind,changed}};
}
