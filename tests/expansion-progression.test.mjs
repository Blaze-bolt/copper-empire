import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/empire/state.js';
import * as P from '../src/empire/progression.js';
import {CATALOGUE,deviceById} from '../src/empire/catalogue.js';
import {DOLLAR,MG} from '../src/empire/data.js';
test('35 exact additions retain original #52 and precise late-game values',()=>{
 assert.equal(CATALOGUE.slice(0,87).length,87);const d=deviceById(52);assert.equal(d.price,35000000000n*DOLLAR);assert.equal(d.min,175000n*MG.t);assert.equal(d.stageCount,10);
 const last=deviceById(87);assert.equal(last.price,190000000000000n*DOLLAR);assert.equal(last.max,1600n*MG.Mt);assert.equal(last.xp,2050);
 assert.equal(new Set(CATALOGUE.map(d=>d.signature)).size,119);
});
test('compression exact 100x costs, atomic sequential purchases and signature floors',()=>{
 const s=E.newState();s.copper[0]=200n*MG.Mt;
 for(let rank=1;rank<=7;rank++){const before=s.copper[0];E.buyCompression(s,rank);assert.equal(before-s.copper[0],P.COMPRESSION_COSTS[rank-1]);assert.throws(()=>E.buyCompression(s,rank));if(rank>1)assert.equal(P.COMPRESSION_COSTS[rank-1],P.COMPRESSION_COSTS[rank-2]*100n);}
 s.rebirth=12;assert.equal(E.effectiveStageCount(s,deviceById(52)),3);s.rebirth=13;assert.equal(E.effectiveStageCount(s,deviceById(52)),3);s.tools.push('workbench');assert.equal(E.effectiveStageCount(s,deviceById(52)),2);
 s.rebirth=18;assert.equal(E.effectiveStageCount(s,deviceById(87)),3);assert.equal(E.effectiveStageCount(s,deviceById(53)),1);assert.equal(E.effectiveStageCount(s,deviceById(1)),1);
 s.ascension.level=1;s.xp=E.levelXP(60);for(const d of CATALOGUE.slice(0,87)){s.inventory[d.id]=1;const a=E.begin(s,d.id,{seed:5});assert.equal(a.stages.at(-1),d.signature);assert.ok(a.stages.length>=1&&a.stages.length<=d.stageCount);}
});
test('additive save migration preserves old values and never silently ascends older R13+',()=>{
 const s=E.newState();delete s.ascension;delete s.compression;delete s.gold;delete s.goldMarket;delete s.pendingAscension;s.rebirth=15;s.money=987654321987654321n;s.inventory[52]=3;
 const loaded=E.load({getItem:k=>k===E.SAVE_KEY?E.encode(s):null});assert.equal(loaded.money,s.money);assert.equal(loaded.rebirth,15);assert.equal(loaded.inventory[52],3);assert.equal(loaded.ascension.level,0);assert.equal(loaded.gold.balance,0n);
});
const eligible=()=>{const s=E.newState();s.rebirth=12;s.xp=E.levelXP(28);s.run.devices=[52];return s;};
test('Ascension requires the real trial, separate confirmation, and awards once',()=>{
 const s=eligible();assert.ok(E.ascensionReady(s));assert.throws(()=>E.confirmAscension(s));const a=E.begin(s,1,{mode:'ascension',seed:5});assert.equal(a.stages.length,12);
 a.status='active';assert.throws(()=>E.reward(s,a));for(let i=0;i<12;i++){a.status='active';E.stagePass(a,.99);}const r=E.reward(s,a);assert.ok(r.ascension);assert.equal(s.rebirth,12);assert.equal(s.ascension.level,0);
 E.confirmAscension(s);assert.equal(s.ascension.level,1);assert.equal(s.ascension.ce,25);assert.equal(s.rebirth,0);assert.equal(s.xp,0);assert.ok(s.gold.unlocked);assert.equal(P.permanentBonuses(s).recovery,250);assert.throws(()=>E.confirmAscension(s));assert.throws(()=>E.reward(s,a));
});
test('Ascension reset preserves gold, compression, collections, history and essence purchases',()=>{
 const s=eligible();s.compression=7;s.ascension.upgrades.precision=1;s.gold.balance=123456n;s.gold.recovered=234567n;s.gold.research=['contacts'];s.gold.claims=[0,1];s.gold.equipment.pan=2;s.auras.glow=1;s.achievements=['first'];s.stats.completed=99;s.furnace.upgrades.speed=3;s.pp=70;s.prestige.precision=5;s.pendingAscension={attempt:'proof',level:0,next:1};E.confirmAscension(s);
 assert.equal(s.compression,7);assert.equal(s.gold.balance,123456n);assert.equal(s.gold.recovered,234567n);assert.deepEqual(s.gold.research,['contacts']);assert.equal(s.ascension.upgrades.precision,1);assert.equal(s.auras.glow,1);assert.equal(s.stats.completed,99);assert.equal(s.pp,0);assert.deepEqual(s.prestige,{});assert.deepEqual(s.furnace.upgrades,{});
});
test('first Ascension recovery and XP apply without automatic purchase discounts',()=>{
 const s=E.newState();s.ascension.level=1;s.gold.unlocked=true;s.inventory[1]=1;const a=E.begin(s,1);a.status='active';E.stagePass(a,1);const r=E.reward(s,a,()=>0);assert.equal(r.amount,r.base*120n/100n*250n/100n);assert.equal(r.xp,deviceById(1).xp*2);assert.equal(E.shopPrice(s,deviceById(53)),deviceById(53).price);
});
test('R13–18 gold milestones exclude bought gold and cap at R18',()=>{
 const s=eligible();s.xp=E.levelXP(30);s.run.earned=80000000000n*DOLLAR;s.ascension.level=1;s.gold.balance=999999n;assert.ok(!E.rebirthReady(s));s.gold.recovered=5000n;assert.ok(E.rebirthReady(s));s.rebirth=18;assert.ok(!E.rebirthReady(s));
});
test('ordinary rebirth preserves all permanent gold progress',()=>{
 const s=E.newState();s.ascension.level=1;s.gold.unlocked=true;s.gold.balance=500n;s.gold.recovered=1000n;s.gold.equipment.pan=2;s.compression=4;s.xp=E.levelXP(6);s.run.earned=35n*DOLLAR;s.run.completed=3;s.pendingRebirth={rebirth:0};E.confirmRebirth(s);assert.equal(s.gold.balance,500n);assert.equal(s.gold.recovered,1000n);assert.equal(s.gold.equipment.pan,2);assert.equal(s.compression,4);
});
test('gold and essence purchases are bounded and duplicate-safe',()=>{
 const s=E.newState();s.ascension.level=1;s.ascension.ce=25;s.gold.unlocked=true;s.gold.balance=10000n;E.buyEssence(s,'extraction',1);assert.equal(s.ascension.ce,20);assert.throws(()=>E.buyEssence(s,'extraction',1));E.buyEssence(s,'extraction',2);assert.equal(s.ascension.ce,10);
 E.buyGoldEquipment(s,'pan',1);assert.equal(s.gold.balance,9980n);assert.throws(()=>E.buyGoldEquipment(s,'pan',1));assert.throws(()=>E.unlockGoldClaim(s,1));s.gold.recovered=200n;E.buyGoldEquipment(s,'map',1);E.unlockGoldClaim(s,1);assert.deepEqual(s.gold.claims,[0,1]);
 E.buyGoldResearch(s,'contacts');assert.throws(()=>E.buyGoldResearch(s,'contacts'));
});
test('an early CE build can always be refunded to unlock advanced research without minting CE',()=>{
 const s=E.newState();s.ascension.level=1;s.ascension.ce=25;s.gold.unlocked=true;s.gold.research=['contacts'];
 for(const id of ['extraction','learning','momentum','precision'])E.buyEssence(s,id,1);
 assert.equal(s.ascension.ce,1);assert.throws(()=>E.buyEssence(s,'master',1));assert.equal(E.refundEssence(s),24);assert.equal(s.ascension.ce,25);assert.equal(E.refundEssence(s),0);assert.equal(s.ascension.ce,25);E.buyEssence(s,'master',1);assert.equal(s.ascension.ce,10);assert.equal(s.ascension.upgrades.master,1);assert.deepEqual(s.gold.research,['contacts']);assert.equal(s.ascension.level,1);
});
