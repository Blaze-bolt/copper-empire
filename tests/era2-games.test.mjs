import test from 'node:test';import assert from 'node:assert/strict';
import {createGame,gameAction,tickGame} from '../src/empire/games.js';
import {gameView,HOW_TO} from '../src/empire/game-ui.js';
import {solveEra2} from './solve-era2.mjs';
import * as E from '../src/empire/state.js';
import {replayStage} from '../supabase/functions/service.js';
for(let id=88;id<=119;id++)test(`A2 ${id}: solvable seeded mechanic, rendered controls and authoritative replay`,()=>{
 for(const seed of [1,3,17,41,215,9123]){
  const g=createGame(id,6,seed),view=gameView(g);assert.ok(view.scene);assert.ok(HOW_TO[id]);assert.notEqual(g.status,'success');
  const events=[];solveEra2(g,events);assert.ok(g.score>=.45);assert.ok(events.some(e=>e[0]==='a'));
  const s=E.newState(),a={stages:[id],index:0,difficulty:6,seed,status:'active',hints:0,replays:0,launchedAt:0};
  assert.ok(replayStage(a,s,events,Math.ceil(g.elapsed*1000)+1000)>.4);
  assert.throws(()=>replayStage(a,s,[],Math.ceil(g.elapsed*1000)+1000));
 }
});
test('all A2 generators have 100 additional seeded success witnesses',()=>{for(let seed=1;seed<=100;seed++)for(let id=88;id<=119;id++)solveEra2(createGame(id,6,seed));});
test('wrong timing, sequence, routing, logic and allocation cannot claim victory',()=>{for(const[id,action,p]of[[88,'cell',{i:25}],[91,'answer',{i:0}],[93,'submit',{}],[99,'submit',{}],[101,'submit',{}],[109,'submit',{}],[117,'submit',{}]]){const g=createGame(id,6,33);gameAction(g,action,p);assert.notEqual(g.status,'success');}const g=createGame(98,6,9);for(let k=0;k<3;k++)gameAction(g,'sort',{i:(g.tokens[g.index]+1)%3});assert.equal(g.status,'failed');});
