import test from 'node:test';import assert from 'node:assert/strict';
import {createGame,gameAction} from '../src/empire/games.js';
import {gameView,HOW_TO} from '../src/empire/game-ui.js';
import {replayStage} from '../supabase/functions/service.js';
import * as E from '../src/empire/state.js';
import {solveFactory} from './solve-factory.mjs';
for(let id=2001;id<=2030;id++)test(`factory ${id}: authored controls and seeded solutions verified on server`,()=>{
 for(const seed of [1,7,91,1723]){const g=createGame(id,6,seed);assert.ok(gameView(g).scene);assert.ok(HOW_TO[id]);const events=solveFactory(g);const a={stages:[id],index:0,difficulty:6,seed,status:'active',hints:0,replays:0,launchedAt:0};assert.ok(replayStage(a,E.newState(),events,600000)>.4);assert.throws(()=>replayStage(a,E.newState(),[],600000));}
});
test('100 seeds per factory game never produce impossible generated constraints',()=>{for(let seed=1;seed<=100;seed++)for(let id=2001;id<=2030;id++)solveFactory(createGame(id,6,seed));});
test('failure thresholds are meaningful and no control can claim passive victory',()=>{
 for(const id of [2007,2017,2019,2022,2027]){const g=createGame(id,6,3);for(let k=0;k<4;k++)gameAction(g,id===2019?'lock':'submit',{});assert.equal(g.status,'failed','bad submit '+id);}
 const g=createGame(2001,6,1);for(let i=0;i<4;i++)gameAction(g,'wind');assert.equal(g.status,'failed');
});
