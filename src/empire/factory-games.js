import {rng} from './data.js';
import {rotate} from '../engine.js';
import {angleGap,stepCell,moduleConnected,createEra2Game,era2Action,tickEra2Game} from './era2-games.js';
const R=n=>Array.from({length:n},(_,i)=>i),pick=(r,n)=>Math.floor(r()*n),mod=(x,n)=>(x%n+n)%n;
const shuffle=(a,r)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=pick(r,i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
const valid=(i,n)=>Number.isInteger(i)&&i>=0&&i<n;
const fail=(g,s)=>{g.status='failed';g.reason=s;};
const win=g=>{if(!g.actions)return;g.status='success';g.score=Math.max(.5,1-g.errors*.1-Math.max(0,g.moves-(g.optimal||999))*.025);};
const bad=(g,s,n=3)=>{g.errors++;g.message=s;if(g.errors>=n)fail(g,s);};
const check=(g,yes,n=3)=>yes?win(g):bad(g,'The displayed constraints are not satisfied. Adjust and try again.',n);
const same=(a,b)=>a.length===b.length&&a.every((x,i)=>x===b[i]);
const pathMasks=(w,h,paths)=>{const a=Array(w*h).fill(0);for(const p of paths){for(let k=1;k<p.length;k++){const x=p[k-1],y=p[k],d=y===x+1?1:y===x-1?3:y>x?2:0;a[x]|=1<<d;a[y]|=1<<((d+2)%4);}a[p[0]]|=8;a[p.at(-1)]|=2;}return a;};
function pipes(r,w,h,paths){const solution=pathMasks(w,h,paths);return {w,h,solution,masks:solution.map(m=>R(pick(r,4)).reduce(v=>rotate(v),m)),starts:paths.map(p=>p[0]),ends:paths.map(p=>p.at(-1))};}
export function factoryPipesValid(p){const seen=new Set();for(let k=0;k<p.starts.length;k++){const start=p.starts[k],end=p.ends[k],queue=[start],local=new Set([start]);for(let j=0;j<queue.length;j++){const c=queue[j],m=p.masks[c];if(!m||m.toString(2).replaceAll('0','').length>2)return false;for(let d=0;d<4;d++)if(m&(1<<d)){const n=stepCell(c,d,p.w,p.h);if(n<0){if(!(c===start&&d===3||c===end&&d===1))return false;}else{if(!(p.masks[n]&(1<<((d+2)%4))))return false;if(!local.has(n)){if(seen.has(n))return false;local.add(n);queue.push(n);}}}}if(!local.has(end)||p.ends.some((v,i)=>i!==k&&local.has(v)))return false;for(const c of local)seen.add(c);}return p.masks.every((v,i)=>!v||seen.has(i));}
const rotateShape=cells=>{const a=cells.map(([x,y])=>[-y,x]),minX=Math.min(...a.map(c=>c[0])),minY=Math.min(...a.map(c=>c[1]));return a.map(([x,y])=>[x-minX,y-minY]);};
function poly(r,w,h,lengths){const path=R(w*h).map(i=>{const y=Math.floor(i/w),x=i%w;return [y%2?w-1-x:x,y];}),shapes=[],witness=[];let head=0;for(const length of lengths){const cells=path.slice(head,head+length);head+=length;const x=Math.min(...cells.map(c=>c[0])),y=Math.min(...cells.map(c=>c[1]));let shape=cells.map(([a,b])=>[a-x,b-y]);const turns=pick(r,4);for(let t=0;t<turns;t++)shape=rotateShape(shape);shapes.push(shape);witness.push({i:y*w+x,turns:mod(4-turns,4)});}return {w,h,shapes,witness,placements:Array(lengths.length).fill(null),orient:Array(lengths.length).fill(0),selected:0,adjacency:[]};}
export function polyCells(g,k,p=g.placements[k]){if(!p)return [];let a=g.shapes[k];for(let t=0;t<g.orient[k];t++)a=rotateShape(a);return a.map(([x,y])=>[p.x+x,p.y+y]);}
export function polyValid(g){const seen=new Set();for(let k=0;k<g.shapes.length;k++){if(!g.placements[k])return false;for(const[x,y]of polyCells(g,k)){const id=y*g.w+x;if(x<0||y<0||x>=g.w||y>=g.h||seen.has(id))return false;seen.add(id);}}return seen.size===g.w*g.h&&g.adjacency.every(([a,b])=>polyCells(g,a).some(([x,y])=>polyCells(g,b).some(([u,v])=>Math.abs(x-u)+Math.abs(y-v)===1)));}
function ring(r,n,steps){const sectors=R(n).map(i=>({id:i,angle:0})),undo=[];for(let k=0;k<steps;k++){const i=pick(r,n);if(r()<.5){const j=(i+1)%n;[sectors[i],sectors[j]]=[sectors[j],sectors[i]];undo.unshift(['swap',i]);}else{sectors[i].angle=mod(sectors[i].angle+1,4);undo.unshift(['turn',i],['turn',i],['turn',i]);}}return {sectors,undo,optimal:undo.length};}
const ringOK=g=>g.sectors.every((s,i)=>s.id===i&&s.angle===0);
function dependencies(r,n){return R(n).map(i=>i===0?[]:shuffle(R(i),r).slice(0,1+pick(r,Math.min(2,i))));}
function packingSetup(g,r,id){Object.assign(g,id===2016?poly(r,6,4,[3,4,5,5,4,3]):id===2024?poly(r,4,4,[3,3,3,3,2,2]):poly(r,5,6,Array(10).fill(3)));if(id===2016)g.shapes=g.shapes.map((a,k)=>{for(let t=0;t<g.witness[k].turns;t++)a=rotateShape(a);const turns=pick(r,2);g.witness[k].turns=turns;if(turns)for(let t=0;t<3;t++)a=rotateShape(a);return a;});if(id===2024)g.adjacency=[[0,1],[1,2],[3,4],[4,5]];g.maxMoves=id===2016?15:60;g.optimal=g.shapes.length+g.witness.reduce((n,p)=>n+p.turns,0);}
export function createFactoryGame(g){const r=rng(g.seed);g.duration=180;g.maxMoves=999;g.factory=true;
 switch(g.id){
 case 2001:Object.assign(g,{angle:40,center:0,hits:0,attempts:0,duration:60});break;
 case 2002:case 2008:{const n=g.id===2002?3:5;Object.assign(g,{pieces:shuffle(R(n),r),slots:shuffle(R(n),r),placed:[],selected:null,duration:g.id===2002?30:60});break;}
 case 2003:Object.assign(g,{sectors:R(4).map(i=>({id:i,angle:0})),undo:[],maxMoves:12});for(let j=0;j<2;j++){const i=pick(r,3);[g.sectors[i],g.sectors[i+1]]=[g.sectors[i+1],g.sectors[i]];g.undo.unshift(['swap',i]);}for(let i=0;i<4;i++){g.sectors[i].angle=3;g.undo.unshift(['turn',i]);}g.optimal=6;break;
 case 2004:Object.assign(g,{values:[0],targets:R(5).map(()=>20+pick(r,60)),round:0});break;
 case 2005:g.pipes=pipes(r,5,5,[[5,6,11,12,7,8,13,18,19]]);break;
 case 2006:Object.assign(g,{sequence:R(6).map(()=>pick(r,8)),phase:'watch',input:0,watchUntil:6});break;
 case 2007:g.target=[3+pick(r,3),3+pick(r,3),0];g.target[2]=15-g.target[0]-g.target[1];g.values=[5,5,5];break;
 case 2009:Object.assign(g,ring(r,6,3),{maxMoves:12});if(ringOK(g)){g.sectors[0].angle=3;g.undo=[['turn',0]];}break;
 case 2010:g.pipes=pipes(r,6,4,[[0,1,7,8,2,3,4,10,11],[18,19,20,21,15,16,22,23]]);break;
 case 2011:Object.assign(g,{defects:shuffle(R(12),r).slice(0,3),found:[],difference:1+pick(r,3)});break;
 case 2012:Object.assign(g,{w:6,h:4,bars:[2,3,4,5],row:0,selected:0,placements:Array(4).fill(null),starts:R(4).map(()=>pick(r,2)),maxMoves:10,optimal:4});break;
 case 2013:Object.assign(g,{centers:[30,50,70],values:[0,0,0],instability:0,stable:0});break;
 case 2014:case 2021:Object.assign(g,{dependencies:dependencies(r,6),done:[]});break;
 case 2015:Object.assign(g,{angles:R(3).map(()=>pick(r,360)),rates:[52,65,78],locked:[]});break;
 case 2016:case 2024:case 2028:packingSetup(g,r,g.id);break;
 case 2017:{const min=shuffle([2,3,2,3],r);Object.assign(g,{min,max:min.map(n=>n+3+pick(r,3)),pool:20,values:[0,0,0,0]});break;}
 case 2018:Object.assign(g,{target:R(4).map(()=>25+pick(r,50)),values:[0,0,0,0],stable:0});break;
 case 2019:Object.assign(g,{target:[25+pick(r,50),25+pick(r,50),20+pick(r,60)],values:[0,0,0]});break;
 case 2020:{const row=2+pick(r,3),path=R(8).map(x=>row*8+x),cross=R(5).map(y=>y*8+3),witness=[...new Set([...path,...cross])];Object.assign(g,{w:8,h:8,stations:[path[0],path[7],cross[0],cross[4]],witness,blocked:shuffle(R(64).filter(i=>!witness.includes(i)),r).slice(0,14),chosen:[],maxTiles:16});break;}
 case 2022:{const edges=R(6).map(i=>[i,i+1,2+pick(r,4)]);edges.push([0,3,7],[1,5,8],[2,6,8],[0,6,14]);Object.assign(g,{edges,chosen:[],witness:R(6),budget:edges.slice(0,6).reduce((n,e)=>n+e[2],0)});break;}
 case 2023:Object.assign(g,{tokens:R(25).map(()=>pick(r,3)),index:0,progress:0,interval:3});break;
 case 2025:{const sub=createEra2Game({...g,id:119});g.sub=sub;g.duration=240;break;}
 case 2026:Object.assign(g,{defects:R(10).map(()=>pick(r,2)),index:0,correct:0});break;
 case 2027:{const original=R(8).map(i=>({id:i,duration:2+i%2,eligible:[i%3,(i+1)%3]})),jobs=shuffle(original,r),witness=jobs.map(j=>({lane:j.id%3,start:original.slice(0,j.id).filter(x=>x.id%3===j.id%3).reduce((n,x)=>n+x.duration,0)}));Object.assign(g,{jobs,witness,placements:Array(8).fill(null),selected:0,lanes:3,horizon:8});break;}
 case 2029:Object.assign(g,{target:[5,18,34,48,65],travel:[13,16,14,17],values:[0,0,0,0,0],stable:0});break;
 case 2030:g.part=0;g.challengeIds=[2004,2017,2027];g.sub=createFactoryGame({...g,id:g.challengeIds[0],actions:0,elapsed:0,errors:0});break;
 default:throw Error('Unknown factory challenge.');
 }g.duration*=1+(g.bonus.time||0);if(g.id===2025)g.sub.duration=g.duration;return g;
}
function chainSub(g,action,p){const sub=g.sub;sub.actions++;if(g.id===2025)era2Action(sub,action,p);else factoryAction(sub,action,p);if(sub.status==='failed')fail(g,sub.reason);if(sub.status==='success'){g.errors+=sub.errors;if(g.id===2025)win(g);else if(++g.part===3)win(g);else{g.sub=createFactoryGame({...g,sub:undefined,id:g.challengeIds[g.part],seed:g.seed+g.part*991,actions:0,elapsed:0,errors:0,status:'active',selected:null,stable:0});g.message='Part complete. Next: '+g.part;}}}
export function factoryAction(g,action,p={}){if(g.status!=='active')return;const i=Number(p.i),value=Number(p.value);if(['slider','set'].includes(action)&&!Number.isFinite(value))return;
 if([2025,2030].includes(g.id)){chainSub(g,action,p);return;}
 if(action==='replay'&&g.id===2006&&g.phase==='input'){g.phase='watch';g.input=0;g.watchStart=g.elapsed;g.watchUntil=g.elapsed+6;g.message='Memory Assistant: repeat the same six-slot sequence.';return;}
 if(action==='hint'&&[2005,2010].includes(g.id)){g.hint=g.pipes.masks.findIndex((m,k)=>m!==g.pipes.solution[k]);g.message=g.hint<0?'The pipes match their reference. Test the routes.':`Scanner: tile ${g.hint+1} needs rotation.`;return;}
 if(action==='slider'&&g.values&&valid(i,g.values.length)){const max=g.id===2007?15:g.id===2017?20:100;if(value>=0&&value<=max&&Number.isInteger(value))g.values[i]=value;}
 switch(g.id){
 case 2001:if(action==='wind'){g.attempts++;if(angleGap(g.angle,g.center)<Math.max(9,25-g.hits*2)*(1+(g.bonus.width||0)))g.hits++;else{g.errors++;g.message='Outside the winding window.';}if(g.hits>=6)win(g);else if(g.attempts===9||g.hits+9-g.attempts<6)fail(g,'Six accurate winds were not reached in nine attempts.');}break;
 case 2002:case 2008:if(action==='select'&&valid(i,g.pieces.length)&&!g.placed.includes(i))g.selected=i;if(action==='slot'&&valid(i,g.slots.length)&&g.selected!==null){if(g.pieces[g.selected]===g.slots[i]){g.placed.push(g.selected);g.selected=null;if(g.placed.length===g.pieces.length)win(g);}else bad(g,'Match both the label and shape to the terminal.',3);}break;
 case 2003:case 2009:if(valid(i,g.sectors.length)&&['swap','turn'].includes(action)){g.moves++;if(action==='turn')g.sectors[i].angle=mod(g.sectors[i].angle+1,4);else{const j=g.id===2003?Math.min(3,i+1):(i+1)%6;[g.sectors[i],g.sectors[j]]=[g.sectors[j],g.sectors[i]];}if(ringOK(g))win(g);else if(g.moves>=g.maxMoves)fail(g,'The sector adjustment budget is exhausted.');}break;
 case 2004:if(action==='press'){if(Math.abs(g.values[0]-g.targets[g.round])<=5){g.round++;if(g.round===5)win(g);}else bad(g,'The press is outside the displayed thickness band.',3);}break;
 case 2005:case 2010:if(action==='tile'&&valid(i,g.pipes.masks.length))g.pipes.masks[i]=rotate(g.pipes.masks[i]);if(action==='submit')check(g,factoryPipesValid(g.pipes));break;
 case 2006:if(action==='symbol'&&g.phase==='input'&&valid(i,8)){if(i===g.sequence[g.input]){if(++g.input===6)win(g);}else{g.input=0;bad(g,'Sequence restarted. Repeat the six lit slots in order.',3);}}break;
 case 2007:if(action==='submit')check(g,g.values.reduce((n,v)=>n+v,0)===15&&same(g.values,g.target));break;
 case 2011:if(action==='inspect'&&valid(i,12)&&!g.found.includes(i)){if(g.defects.includes(i)){g.found.push(i);if(g.found.length===3)win(g);}else bad(g,'This connector matches the reference.',2);}break;
 case 2012:if(action==='select'&&valid(i,4))g.selected=i;if(action==='place'&&valid(i,24)){g.moves++;g.placements[g.selected]={x:i%6,y:Math.floor(i/6)};const cells=new Set();let yes=true;g.placements.forEach((p,k)=>{if(!p){yes=false;return;}if(p.y!==k||p.x!==g.starts[k])yes=false;for(let x=p.x;x<p.x+g.bars[k];x++){const c=p.y*6+x;if(x>=6||cells.has(c))yes=false;cells.add(c);}});if(yes)win(g);else if(g.moves>=10)fail(g,'Ten bar placements have been used.');}break;
 case 2014:case 2021:if(action==='node'&&valid(i,6)&&!g.done.includes(i)){if(g.dependencies[i].every(n=>g.done.includes(n))){g.done.push(i);if(g.done.length===6)win(g);}else bad(g,'Complete the displayed incoming dependencies first.',3);}break;
 case 2015:if(action==='lock'&&valid(i,3)&&!g.locked.includes(i)){if(angleGap(g.angles[i],0)<=18*(1+(g.bonus.width||0))){g.locked.push(i);if(g.locked.length===3)win(g);}else bad(g,'This rotor is outside its target sector.',3);}break;
 case 2016:case 2024:case 2028:if(action==='select'&&valid(i,g.shapes.length))g.selected=i;if(action==='turn'){g.orient[g.selected]=mod(g.orient[g.selected]+1,4);g.moves++;}if(action==='place'&&valid(i,g.w*g.h)){g.placements[g.selected]={x:i%g.w,y:Math.floor(i/g.w)};g.moves++;if(polyValid(g))win(g);}if(g.status==='active'&&g.moves>=g.maxMoves)fail(g,'The placement budget is exhausted.');break;
 case 2017:if(action==='submit')check(g,g.values.reduce((n,v)=>n+v,0)===g.pool&&g.values.every((v,k)=>v>=g.min[k]&&v<=g.max[k]),4);break;
 case 2019:if(action==='lock')check(g,g.values.every((v,k)=>Math.abs(v-g.target[k])<=3),3);break;
 case 2020:if(action==='cell'&&valid(i,64)&&!g.blocked.includes(i)){g.chosen=g.chosen.includes(i)?g.chosen.filter(c=>c!==i):g.chosen.length<16?[...g.chosen,i]:g.chosen;}if(action==='submit'){const seen=new Set([g.stations[0]]),q=[g.stations[0]];for(let h=0;h<q.length;h++)for(let d=0;d<4;d++){const n=stepCell(q[h],d,8,8);if(g.chosen.includes(n)&&!seen.has(n)){seen.add(n);q.push(n);}}check(g,g.stations.every(c=>g.chosen.includes(c)&&seen.has(c))&&g.chosen.length<=16);}break;
 case 2022:if(action==='edge'&&valid(i,10))g.chosen=g.chosen.includes(i)?g.chosen.filter(c=>c!==i):[...g.chosen,i];if(action==='submit'){const seen=new Set([0]);for(let k=0;k<7;k++)for(const i of g.chosen){const[a,b]=g.edges[i];if(seen.has(a)||seen.has(b)){seen.add(a);seen.add(b);}}check(g,g.chosen.length===6&&g.chosen.reduce((n,i)=>n+g.edges[i][2],0)<=g.budget&&seen.size===7);}break;
 case 2023:if(action==='sort'&&valid(i,3)){if(i!==g.tokens[g.index])bad(g,'That symbol belongs in another chute.',3);g.index++;g.progress=0;if(g.index===25&&g.status==='active')win(g);}break;
 case 2026:if(action==='classify'&&valid(i,2)){if(i===g.defects[g.index])g.correct++;else{g.errors++;g.message='The drawing differs from the reference.';}g.index++;if(g.index===10){if(g.correct>=9)win(g);else fail(g,'At least nine of ten classifications are required.');}else if(g.errors>1)fail(g,'Two incorrect quality decisions.');}break;
 case 2027:if(action==='select'&&valid(i,8))g.selected=i;if(action==='place'&&valid(i,3)&&valid(Number(p.start),8))g.placements[g.selected]={lane:i,start:Number(p.start)};if(action==='submit'){const occupied=R(3).map(()=>Array(8).fill(false));check(g,g.jobs.every((j,k)=>{const p=g.placements[k];if(!p||!j.eligible.includes(p.lane)||p.start+j.duration>8)return false;for(let t=p.start;t<p.start+j.duration;t++){if(occupied[p.lane][t])return false;occupied[p.lane][t]=true;}return true;}));}break;
 }
}
export function tickFactoryGame(g,dt){if([2025,2030].includes(g.id)){const s=g.sub;if(g.id===2025){s.elapsed+=dt;tickEra2Game(s,dt);}else{ s.elapsed+=dt;tickFactoryGame(s,dt);}if(s.status==='failed')fail(g,s.reason);if(s.status==='success')chainSub(g,'noop',{});}
 if(g.id===2001){g.angle=mod(g.elapsed*105+40,360);g.center=mod(g.hits*23,360);}
 if(g.id===2006&&g.phase==='watch'&&g.elapsed>=g.watchUntil)g.phase='input';
 if(g.id===2013){g.centers=[30,50,70].map((x,i)=>x+4*Math.sin(g.elapsed*.6+i));const aligned=g.values.every((v,i)=>Math.abs(v-g.centers[i])<=7);g.stable=aligned?g.stable+dt:0;g.instability=Math.max(0,g.instability+(aligned?-.2:g.elapsed<4?0:.04)*dt);if(g.stable>=3)win(g);if(g.instability>=1)fail(g,'Fan calibration reached full instability.');}
 if(g.id===2015)g.angles=g.angles.map((a,i)=>g.locked.includes(i)?a:mod(a+g.rates[i]*dt,360));
 if(g.id===2018){g.stable=g.values.every((v,i)=>Math.abs(v-g.target[i])<=3)?g.stable+dt:0;if(g.stable>=2)win(g);}
 if(g.id===2023){g.progress+=dt;if(g.progress>=g.interval){bad(g,'A symbol passed the dispatch window.',3);g.index++;g.progress=0;if(g.index>=25&&g.status==='active')win(g);}}
 if(g.id===2029){const yes=g.values.every((v,i)=>Math.abs(v-g.target[i])<=2)&&g.values.slice(1).every((v,i)=>Math.abs(v-(g.values[i]+g.travel[i]))<=2);g.stable=yes?g.stable+dt:0;if(g.stable>=3)win(g);}
 if(g.duration&&g.elapsed>=g.duration)fail(g,'Factory challenge time expired. The funded batch can be retried.');
}
