import assert from 'node:assert/strict';
import {gameAction,tickGame} from '../src/empire/games.js';
import {angleGap,stepCell} from '../src/empire/era2-games.js';
import {rotate} from '../src/engine.js';
export function solveEra2(g,events=[]){
 const A=(a,p={})=>{if(g.status==='active'){events.push(['a',a,{...p}]);gameAction(g,a,p);}};
 const wait=t=>{for(let n=0;n<t&&g.status==='active';n+=.02){const dt=Math.min(.02,t-n);events.push(['t',dt]);tickGame(g,dt);}};
 const fields=vs=>vs.forEach((value,i)=>A('slider',{i,value}));
 const modules=()=>{g.modules.solution.forEach((v,i)=>{for(let k=0;k<4&&g.modules.masks[i]!==v;k++)A('cell',{i});});};
 switch(g.id){
 case 88:g.witness.forEach(i=>A('cell',{i}));break;
 case 89:fields(g.centers);wait(3.1);break;
 case 90:g.witness.forEach(i=>A('move',{i}));break;
 case 91:for(let i=0;i<4&&g.status==='active';i++){wait(g.watchUntil-g.elapsed+.03);A('answer',{i:g.correct});}break;
 case 92:for(let i=0;i<6;i++){let guard=0;while(angleGap(g.angles[i],0)>1&&guard++<20000&&g.status==='active')wait(.02);A('lock',{i});}break;
 case 93:fields(g.witness);A('submit');break;
 case 94:g.witness.forEach(command=>A('program',{command}));A('run');break;
 case 95:for(const[action,i]of g.undo)A(action,{i});break;
 case 96:g.witness.forEach((p,i)=>{A('select',{i});A('place',{i:p.lane,start:p.start});});A('submit');break;
 case 97:fields(g.target);A('lock');wait(2.1);break;
 case 98:case 106:while(g.status==='active'&&g.index<g.tokens.length)A('sort',{i:g.tokens[g.index]});break;
 case 99:g.witness.forEach((value,i)=>A('gate',{i,value}));A('submit');break;
 case 100:for(let i=0;i<8;i++)A('node',{i});break;
 case 101:fields(g.target);A('submit');break;
 case 102:g.witness.forEach(i=>A('cell',{i}));A('submit');break;
 case 103:wait(2);A('sync');break;
 case 104:g.witness.forEach(i=>A('cell',{i}));break;
 case 105:fields(g.needs);wait(4.1);break;
 case 107:g.witness.forEach(i=>A('arm',{i}));break;
 case 108:[0,1,4,5,2,3,6,7].forEach((id,i)=>{A('select',{i:id});A('slot',{i});});A('submit');break;
 case 109:g.pipes.solution.forEach((v,i)=>{for(let k=0;k<4&&g.pipes.masks[i]!==v;k++)A('cell',{i});});A('submit');break;
 case 110:g.witness.forEach(i=>A('cell',{i}));A('run');break;
 case 111:fields(g.target);wait(3.1);break;
 case 112:modules();break;
 case 113:while(g.speeds[0]<60)A('speed',{i:0,value:1});while(g.speeds[1]>60)A('speed',{i:1,value:-1});for(let k=0;k<80&&angleGap(...g.angles)>5;k++)A('phase',{i:1,value:-1});A('lock');wait(2.1);break;
 case 114:for(let turn=0;turn<3;turn++){g.positions.forEach((v,i)=>A('route',{i,value:v+1}));A('turn');}break;
 case 115:g.witness.forEach(i=>A('task',{i}));A('submit');break;
 case 116:fields(Array(3).fill(g.targetTotal/3));wait(3.1);break;
 case 117:g.solution.forEach((value,i)=>{if(!g.clues.includes(i))A('set',{i,value});});A('submit');break;
 case 118:g.witness.forEach(i=>{for(let k=0;k<4&&g.arrows[i]!==1;k++)A('cell',{i});});A('run');break;
 case 119:modules();A('submit');fields([4,4,4,4]);A('submit');wait(2);A('sync');break;
 default:throw Error('Missing A2 solver '+g.id);
 }
 assert.equal(g.status,'success',`A2 ${g.id} seed ${g.seed}: ${g.reason||g.message} time ${g.elapsed}`);return g;
}
