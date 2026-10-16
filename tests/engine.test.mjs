import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEVICES, defaultState, createAttempt, passChallenge, failAttempt, claimReward, requiredChallenges, generateCircuit, circuitConnected, rotate, generateMemory, timingConfig, timingHit, buyUpgrade, loadState, challengeDuration, circuitUsefulTile } from '../src/engine.js';
test('every generated circuit has a reachable solution without blocked path tiles', () => {
  for (const size of [3,4,5]) for(let seed=1;seed<=400;seed++) {
    let x=seed; const rng=()=>((x=(x*1664525+1013904223)>>>0)/4294967296);
    const puzzle=generateCircuit(size,rng);
    assert.equal(circuitConnected(puzzle),false,'puzzle must start unsolved');
    for(const i of puzzle.path) { assert.equal(puzzle.blocked.has(i),false); let mask=puzzle.masks[i], possible=false; for(let turns=0;turns<4;turns++){if(mask===puzzle.solution[i]) possible=true;mask=rotate(mask);} assert.ok(possible,'solution is achievable by rotating'); puzzle.masks[i]=puzzle.solution[i]; }
    assert.equal(circuitConnected(puzzle),true,'guaranteed solution connects both terminals');
  }
});
test('incomplete, failed, and duplicate attempts cannot pay rewards',()=>{
  const state=defaultState(), device=DEVICES[2], start=structuredClone(state), attempt=createAttempt(device,[]);
  assert.equal(claimReward(state,attempt),null);
  passChallenge(attempt,1); assert.equal(claimReward(state,attempt),null);
  attempt.status='active'; failAttempt(attempt);
  assert.equal(attempt.index,0); assert.deepEqual(attempt.scores,[]);
  assert.equal(claimReward(state,attempt),null); assert.deepEqual(state,start);
  const retry=createAttempt(device,[]); for(const type of retry.challenges){retry.status='active';passChallenge(retry,1);}
  const result=claimReward(state,retry,()=>1);
  assert.equal(result.grade,'S');assert.equal(result.copper,144);assert.equal(state.xp,device.xp);assert.equal(state.inventory[device.id],start.inventory[device.id]-1);
  const paid=structuredClone(state);assert.equal(claimReward(state,retry),null);assert.deepEqual(state,paid);
});
test('every tier requires its complete challenge list; workshop only reduces eligible tiers',()=>{
  DEVICES.forEach((device,i)=>{assert.equal(requiredChallenges(device,[]).length,i+1);assert.equal(requiredChallenges(device,['workshop']).length,i+1-(i>=2?1:0));});
});
test('grades produce exact bonuses and earned XP only',()=>{
  for(const [score,grade,copper] of [[1,'S',46],[.9,'A',44],[.7,'B',42],[.5,'C',40]]){const state=defaultState(),attempt=createAttempt(DEVICES[0],[]);passChallenge(attempt,score);const result=claimReward(state,attempt,()=>0);assert.equal(result.grade,grade);assert.equal(result.copper,copper);assert.equal(state.rare,1);assert.equal(state.completed,1);}
});
test('upgrades cost copper once and actually change timing and challenge count',()=>{
  const state=defaultState();assert.equal(buyUpgrade(state,'precision'),true);assert.equal(state.copper,55);assert.equal(buyUpgrade(state,'precision'),false);assert.equal(buyUpgrade(state,'scanner'),false);assert.ok(timingConfig(5,state.upgrades).width>timingConfig(5,[]).width);assert.ok(timingConfig(5,[]).width<timingConfig(1,[]).width);assert.ok(timingConfig(5,[]).speed>timingConfig(1,[]).speed);assert.equal(timingHit(.5,.5,.2),true);assert.equal(timingHit(.9,.5,.2),false);
});
test('memory difficulty scales and every generated symbol is available',()=>{for(let level=1;level<=5;level++){const m=generateMemory(level);assert.equal(m.sequence.length,level+2);assert.ok(m.sequence.every(i=>i>=0&&i<m.symbols.length));}});
test('corrupt or unavailable save data safely recovers',()=>{assert.deepEqual(loadState({getItem:()=>'{invalid'}),defaultState());const bad=defaultState();bad.copper=-4;assert.deepEqual(loadState({getItem:()=>JSON.stringify(bad)}),defaultState());});

test('Time extension gives every timed game exactly fifteen extra seconds',()=>{for(const type of ['timing','circuit','assembly'])for(let level=1;level<=5;level++)assert.equal(challengeDuration(type,level,['time'])-challengeDuration(type,level,[]),15);assert.equal(challengeDuration('memory',5,['time']),0);});
test('scanner identifies an unsolved tile on the guaranteed path',()=>{for(let i=0;i<100;i++){const puzzle=generateCircuit(5);const hint=circuitUsefulTile(puzzle);assert.ok(puzzle.path.includes(hint));assert.notEqual(puzzle.masks[hint],puzzle.solution[hint]);for(const tile of puzzle.path)puzzle.masks[tile]=puzzle.solution[tile];assert.equal(circuitUsefulTile(puzzle),undefined);}});
