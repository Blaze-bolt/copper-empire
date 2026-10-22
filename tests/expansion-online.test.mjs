import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import * as E from '../src/empire/state.js';import * as P from '../src/empire/progression.js';
import {CATALOGUE,deviceById} from '../src/empire/catalogue.js';import {DOLLAR,MG} from '../src/empire/data.js';
import {createGame} from '../src/empire/games.js';import {transition,replayStage,pack,unpack,storedState} from '../supabase/functions/service.js';
import {solve} from './solve-games.mjs';import {solveExpansion} from './solve-expansion.mjs';
const rich=()=>{const s=E.newState();s.ascension.level=1;s.rebirth=18;s.xp=E.levelXP(60);s.gold.unlocked=true;s.encountered=CATALOGUE.map(d=>d.id);return s;};
test('the complete new catalogue matches every independently parsed owner specification row',()=>{
 const text=fs.readFileSync(new URL('../docs/EXPANSION_DEVICE_SPEC.md',import.meta.url),'utf8');let rows=0;
 for(const line of text.split('\n')){const c=line.trim().split('|').map(x=>x.trim());const id=Number(c[1]);if(!(id>=53&&id<=87)||c.length!==9)continue;rows++;const d=deviceById(id);assert.equal(d.name,c[2]);assert.equal(d.level,Number(c[3]));const price=c[4].match(/^\$([\d.]+)([BT])$/);const dollars=Number(price[1])*(price[2]==='T'?1e12:1e9);assert.equal(d.price,BigInt(dollars)*DOLLAR);const recovery=c[5].replaceAll(',','').match(/^([\d.]+)–([\d.]+) (kt|Mt)$/);for(const [index,key]of [[1,'min'],[2,'max']]){const n=recovery[index].split('.'),scale=10n**BigInt(n[1]?.length||0);assert.equal(d[key],BigInt(n.join(''))*MG[recovery[3]]/scale);}assert.equal(d.xp,Number(c[6].replaceAll(',','')));assert.equal(d.stageCount,Number(c[7]));}
 assert.equal(rows,35);
});
for(let id=53;id<=87;id++)test(`online signature ${id}: recorded controls verify, empty/reordered recordings do not`,()=>{
 const s=rich(),a=transition(s,null,'begin',{device:id,mode:'practice',difficulty:6},0).attempt;transition(s,a,'launch',{},0);const recording=[],g=createGame(id,6,a.seed,E.bonuses(s));solveExpansion(g,recording);assert.ok(recording.length<60000);
 assert.throws(()=>replayStage(unpack(pack(a)),s,[],600000),/not completed/);
 const result=transition(s,a,'stage',{attempt:a.id,index:0,events:recording},600000);assert.ok(result.result.practice);assert.equal(s.stats.completed,0);assert.equal(s.xp,E.levelXP(60));assert.equal(E.totalCopper(s),0n);assert.throws(()=>transition(s,a,'stage',{attempt:a.id,index:0,events:recording},600000));
});
test('new electronics pay only after every supporting stage and compulsory signature',()=>{
 const s=rich();s.rebirth=13;s.compression=7;s.compressionAscension=s.ascension.level;s.inventory[53]=1;const a=transition(s,null,'begin',{device:53},0).attempt;assert.equal(a.stages.length,3);assert.equal(a.stages.at(-1),53);
 for(let stage=0;stage<3;stage++){transition(s,a,'launch',{},0);const events=[],g=createGame(a.stages[a.index],a.difficulty,a.seed+a.index*7919,E.bonuses(s));g.id<=52?solve(g,events):solveExpansion(g,events);const result=transition(s,a,'stage',{attempt:a.id,index:a.index,events},600000);if(stage<2){assert.equal(s.inventory[53],1);assert.equal(E.totalCopper(s),0n);assert.equal(result.result,null);}else{assert.equal(s.inventory[53],0);assert.ok(result.result.amount>=deviceById(53).min*250n/100n);assert.equal(s.stats.completed,1);}}
});
test('gold market purchases never count as panned recovery; forged and locked trades fail unchanged',()=>{
 const s=rich();s.money=1000n*DOLLAR;const before=s.money;transition(s,null,'trade',{asset:'gold',side:'buy',amount:'1000',quote:600000});assert.equal(s.gold.balance,1000n);assert.equal(s.gold.recovered,0n);assert.equal(before-s.money,606n*DOLLAR/10n);transition(s,null,'trade',{asset:'gold',side:'sell',amount:'1000',quote:600000});assert.equal(s.gold.balance,0n);assert.equal(s.gold.recovered,0n);assert.equal(s.money,999400000000n);
 const saved=E.encode(s);assert.throws(()=>transition(s,null,'trade',{asset:'gold',side:'sell',amount:'1',quote:600000}));assert.throws(()=>transition(s,null,'trade',{asset:'gold',side:'buy',amount:'1',quote:600001}));assert.equal(E.encode(s),saved);s.gold.unlocked=false;assert.throws(()=>transition(s,null,'trade',{asset:'gold',side:'buy',amount:'1',quote:600000}));
});
test('all five Ascensions use total multipliers; current-run proof and new trials remain required',()=>{
 const s=rich();s.ascension.level=0;s.rebirth=15;s.run.devices=[52];let ce=0;
 for(let next=1;next<=5;next++){const req=P.ascensionRequirement(s);s.rebirth=req.rebirth;s.xp=E.levelXP(req.level);s.run.devices=[req.device];s.run.earned=req.earned;s.gold.recovered=req.gold;assert.ok(E.ascensionReady(s));assert.throws(()=>E.confirmAscension(s));s.pendingAscension={attempt:'test-'+next,level:next-1,next};E.confirmAscension(s);ce+=P.ASCENSIONS[next].ce;assert.equal(s.ascension.ce,ce);assert.equal(P.permanentBonuses(s).recovery,[0,250,500,500,500,500][next]);assert.equal(s.ascension.records.length,next);assert.throws(()=>E.confirmAscension(s));}assert.equal(ce,535);assert.ok(P.ascensionRequirement(s).capped);assert.ok(!E.ascensionReady(s));
});
test('each R13–18 milestone is exact and gold progress survives its reset',()=>{
 const s=rich();for(let r=12;r<18;r++){s.rebirth=r;const req=P.GOLD_REBIRTHS[r-12];s.xp=E.levelXP(req[0]);s.run.earned=req[1]*DOLLAR;s.gold.recovered=req[2];s.gold.research=['contacts','conductive','alloying','legacy'];s.gold.claims=[0,1,2,3];s.run.devices=[53];s.run.bosses=['imperial'];assert.ok(E.rebirthReady(s));s.gold.recovered--;assert.ok(!E.rebirthReady(s));s.gold.recovered++;s.pendingRebirth={rebirth:r};E.confirmRebirth(s);assert.equal(s.gold.recovered,req[2]);assert.equal(s.rebirth,r+1);}assert.ok(!E.rebirthReady(s));
});
test('CE and Golden Engineering affect actual smelting/refining throughput and costs',()=>{
 const s=rich();s.furnace.ingots=100;s.refining.unlocked=true;const baseline=E.furnaceSettings(s);s.ascension.upgrades={heritage:5,efficiency:5};s.gold.research=['processing','metallurgy'];assert.ok(E.furnaceSettings(s).duration<baseline.duration);let produced=0;for(let i=0;i<4;i++)produced+=E.refine(s);assert.equal(produced,6);assert.equal(s.furnace.ingots,40);assert.equal(s.furnace.refined,6);s.money=1000000n*DOLLAR;s.copper[0]=100n*MG.kg;const money=s.money;E.buyFurnaceUpgrade(s,'speed');assert.equal(money-s.money,1700n*DOLLAR);
 const stored=storedState(s);assert.ok(!stored.market.history);assert.ok(!stored.goldMarket.history);
});
