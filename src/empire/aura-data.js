// Exact integer weights: every published denominator divides ten billion.
export const AURA_DENOMINATOR=10000000000;
const catalogue=[
 ['rusty','Rusty Aura',null,'#9c775e',{recovery:5},'+5% copper recovery'],
 ['glow','Copper Glow',5,'#e69155',{recovery:10},'+10% copper recovery'],
 ['bronze','Bronze Radiance',25,'#d1a556',{xp:15},'+15% earned XP'],
 ['electric','Electric Copper',100,'#57c6c2',{recovery:20},'+20% copper recovery'],
 ['plasma','Plasma Core',500,'#c686f0',{smelting:25},'+25% smelting speed'],
 ['storm','Storm Conductor',5000,'#7ca9ff',{xp:30,recovery:10},'+30% XP · +10% copper recovery'],
 ['ancient','Ancient Copper Spirit',25000,'#7edba4',{recovery:40},'+40% copper recovery'],
 ['celestial','Celestial Copper',100000,'#ffe5a0',{recovery:50},'+50% copper recovery'],
 ['molten','Molten Heart',250000,'#ff7149',{smelting:60},'+60% smelting speed'],
 ['quantum','Quantum Circuit',500000,'#80fff1',{xp:50,recovery:25},'+50% XP · +25% copper recovery'],
 ['eclipse','Copper Eclipse',1000000,'#e2aa86',{fee:3},'−3% manufacturing fees'],
 ['void','Void Conductor',2500000,'#b394ff',{xp:80,recovery:40},'+80% XP · +40% copper recovery'],
 ['neon','Neon Foundry',5000000,'#f589df',{factory:50},'+50% factory production speed'],
 ['galactic','Galactic Copper',10000000,'#86c8ff',{recovery:100},'+100% copper recovery'],
 ['primordial','Primordial Core',25000000,'#f4bc6a',{recovery:125},'+125% copper recovery'],
 ['singularity','Copper Singularity',100000000,'#b7a1ff',{recovery:150,xp:75},'+150% copper recovery · +75% XP'],
 ['eternal','Eternal Furnace',250000000,'#ffbd89',{smelting:100,factory:100},'+100% smelting and factory speed'],
 ['cosmic','Cosmic Copperstorm',500000000,'#92edff',{recovery:200,xp:100},'+200% copper recovery · +100% XP'],
 ['reality','Reality Breaker',1000000000,'#ff99bb',{recovery:250,xp:125},'+250% copper recovery · +125% XP'],
 ['god','Copper God',10000000000,'#fff1ac',{recovery:300,xp:150,factory:50},'+300% copper recovery · +150% XP · +50% factory speed']
];
const remainder=AURA_DENOMINATOR-catalogue.slice(1).reduce((sum,a)=>sum+AURA_DENOMINATOR/a[2],0);
export const AURAS=catalogue.map(([id,name,odds,color,effect,ability],index)=>Object.freeze({id,name,odds,color,effect:Object.freeze(effect),ability,index,weight:odds?AURA_DENOMINATOR/odds:remainder}));
export const AURA_ROLL_COST=100n*1000000000n;
export const AURA_TIERS=[1,5,10,50,100,500,1000,5000,10000,50000,100000,500000,1000000,5000000,10000000,50000000,100000000];
export const AURA_TIER_COSTS=[0n,5000n,25000n,250000n,1000000n,10000000n,50000000n,500000000n,2000000000n,20000000000n,100000000000n,1000000000000n,5000000000000n,50000000000000n,250000000000000n,2500000000000000n,10000000000000000n].map(n=>n*1000000000n);
export const auraById=id=>AURAS.find(a=>a.id===id);
export const auraEffects=s=>auraById(s.equipped)?.effect||{};
export const auraSpeed=(s,kind)=>1+(auraEffects(s)[kind]||0)/100;
export const auraProbability=a=>a.weight/AURA_DENOMINATOR;
export function atLeastOne(a,n){if(!Number.isSafeInteger(n)||n<0||n>100000000)throw Error('Use 0–100,000,000 rolls.');return -Math.expm1(n*Math.log1p(-auraProbability(a)));}
export function probabilityLabel(p){if(p===0)return '0%';const percent=p*100;return percent<.000001?percent.toExponential(5)+'%':percent.toLocaleString('en-US',{maximumSignificantDigits:8})+'%';}
export const exactCount=n=>BigInt(n||0).toLocaleString('en-US');
