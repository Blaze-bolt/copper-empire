import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../src/empire/state.js';
import * as P from '../src/empire/progression.js';
import {deviceById,CATALOGUE} from '../src/empire/catalogue.js';
import {DOLLAR,MG} from '../src/empire/data.js';
import {createGame} from '../src/empire/games.js';
import {transition} from '../supabase/functions/service.js';
import {solve} from './solve-games.mjs';
import {solveExpansion} from './solve-expansion.mjs';
const eligible=()=>{const s=E.newState();s.ascension.level=1;s.ascension.ce=7;s.rebirth=18;s.xp=E.levelXP(45);s.run.devices=[87];s.gold.recovered=600000n;s.gold.balance=3n;return s;};
test('A2 exact eligibility uses earned gold and current-run device proof',()=>{
 const s=eligible();assert.ok(E.ascensionReady(s));assert.equal(P.ascensionRequirement(s).stages,12);
 for(const change of [x=>x.rebirth=17,x=>x.xp=E.levelXP(45)-1,x=>x.run.devices=[],x=>x.gold.recovered=599999n]){const x=structuredClone(s);change(x);assert.ok(!E.ascensionReady(x));}
 s.gold.balance=999999999n;s.gold.recovered=0n;assert.ok(!E.ascensionReady(s));assert.throws(()=>E.confirmAscension(s));
});
test('A2 replays all twelve distinct stages before separate once-only reset and +250 CE',()=>{
 let s=eligible(),a=null,now=100000;({state:s,attempt:a}=transition(s,a,'begin',{device:1,mode:'ascension'},now));assert.deepEqual(a.stages,P.A2_TRIAL);
 for(let i=0;i<12;i++){({state:s,attempt:a}=transition(s,a,'launch',{},now));const g=createGame(a.stages[i],a.difficulty,a.seed+i*7919,E.bonuses(s)),events=[];g.id<=52?solve(g,events):solveExpansion(g,events);assert.equal(g.status,'success','trial stage '+i);now+=Math.ceil(g.elapsed*1000)+2000;({state:s,attempt:a}=transition(s,a,'stage',{attempt:a.id,index:i,events},now));}
 assert.equal(a.status,'complete');assert.equal(s.ascension.level,1);assert.equal(s.ascension.ce,7);assert.ok(s.pendingAscension);const gold=s.gold.recovered;
 E.confirmAscension(s);assert.equal(s.ascension.level,2);assert.equal(s.ascension.ce,257);assert.equal(s.rebirth,0);assert.equal(s.gold.recovered,gold);assert.equal(s.gold.balance,3n);assert.throws(()=>E.confirmAscension(s));assert.ok(!P.claimLegacyIndustrial(s));
});
test('three failed-stage retries total, fourth failure resets the entire trial',()=>{
 const s=eligible(),a=E.begin(s,1,{mode:'ascension',seed:2});a.index=4;a.scores=[1,1,1,1];const before=E.encode(s.copper);
 for(let i=1;i<=3;i++){a.status='active';E.stageFail(s,a);assert.equal(a.status,'retry');assert.equal(a.retriesUsed,i);assert.equal(a.index,4);E.retryAscensionStage(s,a);assert.equal(a.status,'briefing');}
 a.status='active';E.stageFail(s,a);assert.equal(a.status,'failed');assert.deepEqual(a.scores,[]);assert.equal(a.index,0);assert.throws(()=>E.retryAscensionStage(s,a));assert.equal(E.encode(s.copper),before);assert.equal(s.gold.balance,3n);
});
test('legacy earned A2 grant preserves spent ranks and adds CE exactly once',()=>{
 const s=eligible();s.ascension.level=2;s.ascension.upgrades={extraction:3};s.ascension.records=[{level:2,ce:40}];const old=E.encode(s);assert.ok(P.claimLegacyIndustrial(s));assert.equal(s.ascension.ce,257);assert.deepEqual(s.ascension.upgrades,{extraction:3});assert.ok(!P.claimLegacyIndustrial(s));const restored=E.load({getItem:k=>k===E.SAVE_KEY?old:null});assert.equal(restored.ascension.ce,257);assert.ok(!P.claimLegacyIndustrial(restored));
});
test('A2 total bonuses and all eight chapter gates retain mandatory signatures',()=>{
 const s=eligible();s.ascension.level=2;const b=P.permanentBonuses(s);assert.equal(b.recovery,500);assert.equal(b.xp,400);assert.equal(b.money,400);assert.equal(b.smelting,2);assert.equal(b.factorySpeed,1.5);assert.equal(b.factoryFeeDiscount,15);assert.equal(b.shopDiscount,0);assert.equal(b.toolDiscount,0);
 s.compression=7;s.tools.push('workbench');for(let r=18;r<26;r++){s.rebirth=r;const req=E.rebirthRequirement(s);s.xp=E.levelXP(req.level);s.run.earned=req.earned;s.run.devices=[P.ERA2_REBIRTHS[r-18][2]];assert.ok(E.rebirthReady(s));s.pendingRebirth={rebirth:r};E.confirmRebirth(s);for(const d of CATALOGUE.filter(d=>d.rebirth===r+1)){s.xp=E.levelXP(60);s.inventory[d.id]=1;const a=E.begin(s,d.id,{seed:1});assert.equal(a.stages.at(-1),d.id);assert.equal(a.stages.length,3);}}
 assert.ok(E.rebirthRequirement(s).capped);assert.equal(deviceById(119).rebirth,26);assert.ok(deviceById(119).max>MG.Gt);
});
test('legacy gold attempt IDs migrate without touching new electronic IDs',()=>{
 const gold={mode:'gold',stages:[101,107]};E.migrateAttempt(gold);assert.deepEqual(gold.stages,[1001,1007]);E.migrateAttempt(gold);assert.deepEqual(gold.stages,[1001,1007]);const d={mode:'device',stages:[101,107]};E.migrateAttempt(d);assert.deepEqual(d.stages,[101,107]);
});
