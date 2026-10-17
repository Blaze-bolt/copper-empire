import test from 'node:test';import assert from 'node:assert/strict';
import {createGame,gameAction,tickGame} from '../src/empire/games.js';
import {goldCurrent} from '../src/empire/gold-games.js';
import * as E from '../src/empire/state.js';
import {replayStage} from '../supabase/functions/service.js';
export function solvePan(g,events){
 const act=(a,p={})=>{events?.push(['a',a,p]);gameAction(g,a,p);};
 for(let k=0;k<12000&&g.status==='active';k++){
  const target=g.claim>=4?.5+.12*Math.sin(g.elapsed*.55+g.seed):.5;
  const targetVelocity=g.claim>=4?.066*Math.cos(g.elapsed*.55+g.seed):0;
  const desired=Math.max(-.15,Math.min(.15,(target-g.position)*2+targetVelocity));
  const force=(desired-g.velocity)*5-goldCurrent(g)+g.velocity*3.2;
  if(k%5===0)act('tilt',{value:Math.max(-1,Math.min(1,force/.5))});
  if(!g.shakes||g.sediment>.48)act('shake');
  events?.push(['t',.02]);tickGame(g,.02);
 }
 assert.equal(g.status,'success',g.reason);return g;
}
for(let claim=0;claim<7;claim++)test(`gold claim ${claim}: three interactive rounds and validated integer reward`,()=>{
 for(const seed of [1,71,1234]){
  const s=E.newState();s.ascension.level=1;s.gold.unlocked=true;s.gold.claims=Array.from({length:claim+1},(_,i)=>i);
  const a=E.begin(s,claim+1,{mode:'gold',seed});a.status='active';a.launchedAt=0;const events=[],g=solvePan(createGame(101+claim,6,seed,E.bonuses(s)),events);
  assert.equal(g.round,3);const score=replayStage(a,s,events,Math.ceil(g.elapsed*1000));E.stagePass(a,score);const result=E.reward(s,a,()=>0);assert.ok(result.gold);assert.equal(typeof result.amount,'bigint');assert.equal(s.gold.balance,result.amount);assert.equal(s.gold.recovered,result.amount);assert.throws(()=>E.reward(s,a));
 }
});
test('failed pan yields no gold; upgrades alter mechanics without automatic wins',()=>{
 const s=E.newState();s.ascension.level=1;s.gold.unlocked=true;s.gold.equipment={pan:4,kit:4,station:3,supply:3,drone:3};const base=createGame(107,6,5),upgraded=createGame(107,6,5,E.bonuses(s));assert.ok(upgraded.width>base.width);assert.ok(upgraded.roundLength<base.roundLength);assert.ok(upgraded.currentFactor<base.currentFactor);
 const a=E.begin(s,1,{mode:'gold'});a.status='active';E.stageFail(s,a);assert.equal(s.gold.balance,0n);assert.equal(s.gold.recovered,0n);assert.equal(s.gold.failed,1);assert.throws(()=>E.reward(s,a));
 for(let k=0;k<10000&&upgraded.status==='active';k++)tickGame(upgraded,.02);assert.notEqual(upgraded.status,'success');
});
