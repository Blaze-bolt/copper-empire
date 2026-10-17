import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,gameAction,tickGame} from '../src/empire/games.js';
import {gameView,HOW_TO} from '../src/empire/game-ui.js';
import {solveExpansion} from './solve-expansion.mjs';
for(let id=53;id<=87;id++)test(`signature ${id}: real controls solve seeded puzzles; no passive victory`,()=>{
 for(const seed of [1,7,19,54321]){
  const g=createGame(id,6,seed);assert.ok(HOW_TO[id]?.length>40);const ui=gameView(g);assert.ok(ui.scene.length>50);assert.ok(!/undefined|NaN/.test(ui.scene+ui.controls),String(id));if(g.phase!=='watch')assert.ok((ui.scene+ui.controls).includes('data-g='));solveExpansion(g);assert.ok(g.score>=.45&&g.score<=1);
 }
 const idle=createGame(id,6,1);for(let t=0;t<400&&idle.status==='active';t+=.04)tickGame(idle,.04);assert.notEqual(idle.status,'success');
});
test('invalid inputs cannot solve expansion constraints or award wins',()=>{
 for(const id of [56,59,62,67,68,71,73,76,78,80,82,84,85]){const g=createGame(id,6,7);for(let i=0;i<3;i++)gameAction(g,'submit');assert.equal(g.status,'failed',String(id));assert.equal(g.score,0);}
 const cap=createGame(87,6,7);for(let t=0;t<7;t+=.02)tickGame(cap,.02);gameAction(cap,'symbol',{i:(cap.sequence[0]+1)%6});assert.equal(cap.status,'failed');assert.equal(cap.part,0);
});
