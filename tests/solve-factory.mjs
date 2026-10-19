import assert from 'node:assert/strict';
import {gameAction,tickGame} from '../src/empire/games.js';
import {rotate} from '../src/engine.js';
import {angleGap} from '../src/empire/era2-games.js';
export function solveFactory(g,events=[]){
 const A=(a,p={})=>{if(g.status==='active'){events.push(['a',a,{...p}]);gameAction(g,a,p);}};
 const wait=t=>{for(let n=0;n<t&&g.status==='active';n+=.02){const dt=Math.min(.02,t-n);events.push(['t',dt]);tickGame(g,dt);}};
 const fields=v=>v.forEach((value,i)=>A('slider',{i,value}));
 const solvePart=s=>{
 switch(s.id){
 case 2001:while(s.status==='active'&&s.hits<6){let guard=0;while(angleGap(s.angle,s.center)>2&&guard++<5000)wait(.02);A('wind');}break;
 case 2002:case 2008:s.pieces.forEach((v,i)=>{A('select',{i});A('slot',{i:s.slots.indexOf(v)});});break;
 case 2003:case 2009:s.undo.forEach(([a,i])=>A(a,{i}));break;
 case 2004:for(let i=0;i<5;i++){A('slider',{i:0,value:s.targets[s.round]});A('press');}break;
 case 2005:case 2010:s.pipes.masks.forEach((v,i)=>{for(let t=0;t<4&&s.pipes.masks[i]!==s.pipes.solution[i];t++)A('tile',{i});});A('submit');break;
 case 2006:wait(6.1);s.sequence.forEach(i=>A('symbol',{i}));break;
 case 2007:fields(s.target);A('submit');break;
 case 2011:s.defects.forEach(i=>A('inspect',{i}));break;
 case 2012:s.bars.forEach((v,i)=>{A('select',{i});A('place',{i:i*6+s.starts[i]});});break;
 case 2013:fields(s.centers);wait(3.1);break;
 case 2014:case 2021:for(let i=0;i<6;i++)A('node',{i});break;
 case 2015:for(let i=0;i<3;i++){let guard=0;while(angleGap(s.angles[i],0)>2&&guard++<5000)wait(.02);A('lock',{i});}break;
 case 2016:case 2024:case 2028:s.witness.forEach((p,i)=>{A('select',{i});for(let n=0;n<p.turns;n++)A('turn');A('place',{i:p.i});});break;
 case 2017:fields([5,5,5,5]);A('submit');break;
 case 2018:fields(s.target);wait(2.1);break;
 case 2019:fields(s.target);A('lock');break;
 case 2020:s.witness.forEach(i=>A('cell',{i}));A('submit');break;
 case 2022:s.witness.forEach(i=>A('edge',{i}));A('submit');break;
 case 2023:s.tokens.forEach(i=>A('sort',{i}));break;
 case 2025:{const z=s.sub;z.modules.solution.forEach((v,i)=>{for(let n=0;n<4&&z.modules.masks[i]!==v;n++)A('cell',{i});});A('submit');fields([4,4,4,4]);A('submit');wait(2);A('sync');break;}
 case 2026:s.defects.forEach(i=>A('classify',{i}));break;
 case 2027:s.witness.forEach((p,i)=>{A('select',{i});A('place',{i:p.lane,start:p.start});});A('submit');break;
 case 2029:fields(s.target);wait(3.1);break;
 case 2030:for(let i=0;i<3;i++)solvePart(s.sub);break;
 default:throw Error('No factory solver '+s.id);
 }};
 solvePart(g);assert.equal(g.status,'success',`Factory ${g.id}: ${g.reason}, ${g.elapsed}s, ${g.moves} moves`);return events;
}
