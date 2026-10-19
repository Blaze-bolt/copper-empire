// Local disposable fixture, imported through the normal save UI on an isolated preview origin.
import {writeFile,mkdir} from 'node:fs/promises';
import * as E from '../src/empire/state.js';import {DOLLAR,MG} from '../src/empire/data.js';import {CATALOGUE} from '../src/empire/catalogue.js';
const s=E.newState();s.money=100000000000000000n*DOLLAR;s.copper[0]=10000n*MG.Gt;s.xp=E.levelXP(60);s.rebirth=19;s.ascension={level:2,ce:275,upgrades:{},records:[{level:1,ce:25},{level:2,ce:250}],industrialClaimed:true,industrialUnlocked:true};s.gold.unlocked=true;s.gold.recovered=600000n;s.gold.balance=600000n;s.encountered=CATALOGUE.map(d=>d.id);s.inventory[88]=2;s.inventory[101]=2;s.compression=7;
await mkdir('output/checkpoint-4',{recursive:true});await writeFile('output/checkpoint-4/local-qa-save.json',E.encode(s));console.log('Created a disposable LOCAL QA save. Never import it into Main.');
