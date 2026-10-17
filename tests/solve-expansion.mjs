import assert from 'node:assert/strict';
import {gameAction,tickGame} from '../src/empire/games.js';
import {angleDistance} from '../src/empire/expansion-games.js';
export function solveExpansion(g,events){
 const A=(action,p={})=>{if(g.status!=='active')return;events?.push(['a',action,{...p}]);gameAction(g,action,p);};
 const wait=seconds=>{for(let t=0;t<seconds&&g.status==='active';t+=.02){const dt=Math.min(.02,seconds-t);events?.push(['t',dt]);tickGame(g,dt);}};
 const fields=values=>values.forEach((value,i)=>A('slider',{i,value}));
 const network=()=>{g.witness.forEach(i=>A('edge',{i}));A('submit');};
 switch(g.id){
 case 53:for(let i=0;i<4;i++){while(angleDistance(g.angles[i]+g.rates[i],0)>7.6)A('phase',{i,value:1});}A('lock');wait(2.1);break;
 case 54:g.witness.forEach(i=>A('operation',{i}));break;
 case 55:for(let i=0;i<3;i++){A('select',{i});let guard=0;while((angleDistance(g.angles[i],g.targets[i])>7||Math.abs(g.velocity[i])>3)&&guard++<3000&&g.status==='active'){const signed=((g.targets[i]-g.angles[i]+540)%360)-180;if(Math.abs(signed)>7){const desired=Math.sign(signed)*Math.min(70,Math.abs(signed)*1.8);if(Math.abs(desired-g.velocity[i])>6)A('accelerate',{i,value:desired>g.velocity[i]?1:-1});}else A('brake',{i});wait(.04);}A('brake',{i});A('lock',{i});}break;
 case 56:fields(g.demand);A('submit');break;
 case 57:case 63:for(const i of [...g.scramble].reverse())for(let k=0;k<3;k++)A('rotor',{i});break;
 case 58:for(let k=0;k<4&&g.status==='active';k++){const seq=[...g.rounds[g.round].sequence];wait(g.watchLength-g.elapsed+.02);seq.forEach(i=>A('symbol',{i}));}break;
 case 59:fields(g.witness);A('submit');break;
 case 60:while(g.status==='active'&&g.elapsed<90){const due=g.due.map((t,i)=>({t,i})).filter(x=>!g.hit[x.i]).sort((a,b)=>a.t-b.t)[0];wait(Math.max(0,due.t-g.elapsed));A('beat',{i:due.i});}break;
 case 61:g.correct.forEach((v,i)=>{if(g.switches[i]!==v)A('switch',{i});});wait(13);break;
 case 62:case 67:case 71:network();break;
 case 64:case 79:if(g.id===79)wait(8.1);for(const [op,i,value]of g.undo){if(op==='rotate')for(let k=0;k<value;k++)A('rotate',{i});else A('swap',{i,value});}break;
 case 65:fields(g.witness);wait(3.1);break;
 case 66:case 81:g.witness.forEach(command=>A('program',{command}));A('run');wait(20);break;
 case 68:g.witness.forEach((p,i)=>{A('select',{i});A('place',{i:p.machine,start:p.start});});A('submit');break;
 case 69:case 77:for(let guard=0;guard<20000&&g.status==='active';guard++){const due=g.notes.filter(n=>!n.done&&!n.pressed&&n.at<=g.elapsed+.00001);due.forEach(n=>A('beat',{i:n.lane}));wait(.02);}break;
 case 70:for(let n=0;n<18;n++){const rule=g.rules[Math.min(2,Math.floor(g.correct/6))];A('sort',{i:g.tokens[g.index][rule]});wait(.1);}break;
 case 72:for(let guard=0;guard<6000&&g.status==='active';guard++){for(let i=0;i<3;i++){const distance=.5-g.values[i],desired=Math.max(-.3,Math.min(.3,distance*2));if(Math.abs(distance)>.015&&Math.abs(desired-g.velocity[i])>.035)A('accelerate',{i,value:desired>g.velocity[i]?1:-1});else if(Math.abs(distance)<.035)A('brake',{i});}wait(.05);}break;
 case 73:fields(g.secret);A('submit');break;
 case 74:g.witness.forEach(i=>A('transition',{i}));break;
 case 75:for(const orders of g.witness){orders.forEach((value,i)=>A('order',{i,value}));A('turn');}break;
 case 76:g.needs.forEach((row,r)=>row.forEach((value,i)=>A('slider',{i,value,row:r})));A('submit');break;
 case 78:g.target.forEach((v,i)=>{while(g.arrows[i]!==v)A('tile',{i});});A('submit');break;
 case 80:fields(g.witness);A('submit');break;
 case 82:for(let i=0;i<3;i++)A('route',{i,value:i});fields(g.needs);g.targetPattern.forEach((v,i)=>{for(let n=0;n<v;n++)A('pattern',{i});});A('submit');break;
 case 83:for(const i of [...g.scramble].reverse())A('phase',{i,value:-1});break;
 case 84:g.witness.forEach((v,i)=>{for(let n=0;n<v;n++)A('gate',{i});A('port',{i,value:i<2?0:1});});A('submit');break;
 case 85:for(const [op,i,value]of g.undo){if(op==='block')for(let k=0;k<value;k++)A('block',{i});else A('rows',{i,value});}for(const blank of [4,5,7]){const source=g.values.findIndex((v,i)=>g.target[i]>=0&&v===g.mergeSymbols[blank]&&g.target[i]===v);A('merge',{i:source,value:blank});}A('submit');break;
 case 86:fields(g.needs);A('submit');network();for(let i=0;i<3;i++){while(Math.abs(g.positions[i]-g.syncTargets[i])>.005&&g.status==='active')wait(.01);A('lock',{i});}break;
 case 87:wait(g.watchLength+.1);g.sequence.forEach(i=>A('symbol',{i}));fields(g.demand);A('submit');for(let i=0;i<3;i++){while(angleDistance(g.angles[i],0)>1&&g.status==='active')wait(.01);A('lock',{i});}network();break;
 default:throw Error('Missing expansion solver '+g.id);
 }
 assert.equal(g.status,'success',`Game ${g.id}: ${g.reason||g.message||'still active'} elapsed=${g.elapsed} moves=${g.moves}`);return g;
}
