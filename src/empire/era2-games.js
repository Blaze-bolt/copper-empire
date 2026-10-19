import {rng} from './data.js';
import {generateCircuit,rotate,circuitConnected} from '../engine.js';
const R=n=>Array.from({length:n},(_,i)=>i),pick=(r,n)=>Math.floor(r()*n),mod=(v,n)=>(v%n+n)%n;
export const same=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const ok=(i,n)=>Number.isInteger(i)&&i>=0&&i<n;
const shuffle=(a,r)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=pick(r,i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
const fail=(g,reason)=>{g.status='failed';g.reason=reason;};
const win=g=>{if(!g.actions)return;g.status='success';g.score=g.errors?Math.max(.5,1-g.errors*.12):g.moves>(g.optimal||g.maxMoves)?Math.max(.65,1-(g.moves-(g.optimal||g.maxMoves))*.035):1;};
const bad=(g,reason,limit=3)=>{g.errors++;g.message=reason;if(g.errors>=limit)fail(g,reason);};
const check=(g,valid,limit=3)=>valid?win(g):bad(g,'The displayed constraints are not satisfied. Adjust the solution and try again.',limit);
const triangle=t=>1-Math.abs(mod(t,2)-1);
export const angleGap=(a,b)=>Math.abs(mod(a-b+180,360)-180);
function diagonal(a,i,n=5){const x=i%n,y=Math.floor(i/n);for(const[dx,dy]of[[0,0],[-1,-1],[1,-1],[-1,1],[1,1]])if(x+dx>=0&&x+dx<n&&y+dy>=0&&y+dy<n)a[(y+dy)*n+x+dx]^=1;}
function ringStep(a,i,k=1){for(const j of[mod(i-1,a.length),i,mod(i+1,a.length)])a[j]=mod(a[j]+k,3);}
function armStep(a,i,k=1){a[i]=mod(a[i]+k,6);a[(i+1)%a.length]=mod(a[(i+1)%a.length]+k,6);}
const directions=[[0,-1],[1,0],[0,1],[-1,0],[0,0]];
export function stepCell(cell,dir,w,h){const[x,y]=directions[dir]||[99,99],nx=cell%w+x,ny=Math.floor(cell/w)+y;return nx>=0&&nx<w&&ny>=0&&ny<h?ny*w+nx:-1;}
export function bfs(start,goal,w,h,blocked=[]){const wall=new Set(blocked),queue=[[start,[]]],seen=new Set([start]);for(let head=0;head<queue.length;head++){const[c,path]=queue[head];if(c===goal)return path;for(let d=0;d<4;d++){const n=stepCell(c,d,w,h);if(n>=0&&!wall.has(n)&&!seen.has(n)){seen.add(n);queue.push([n,[...path,d]]);}}}return null;}
const transformed=(a,rule)=>rule===0?[...a].reverse():rule===1?[...a.slice(1),a[0]]:rule===2?[a.at(-1),...a.slice(0,-1)]:a.map((_,i)=>a[i^1]);
function sequenceRound(g,r){g.sequence=shuffle(R(8),r).slice(0,6);g.rule=pick(r,4);const answer=transformed(g.sequence,g.rule);g.answers=[answer];while(g.answers.length<4){const a=shuffle(answer,r);if(!g.answers.some(x=>same(x,a)))g.answers.push(a);}g.answers=shuffle(g.answers,r);g.correct=g.answers.findIndex(a=>same(a,answer));g.phase='watch';g.watchUntil=g.elapsed+4;}
function pathTiles(w,h,path){const masks=Array(w*h).fill(0);for(let k=1;k<path.length;k++){const a=path[k-1],b=path[k],d=b===a+1?1:b===a-1?3:b>a?2:0;masks[a]|=1<<d;masks[b]|=1<<((d+2)%4);}return masks;}
export function pipeValid(g){
 const {w,h,masks,start,ends}=g.pipes,visited=new Set([start]),queue=[start];
 for(let head=0;head<queue.length;head++){const c=queue[head];for(let d=0;d<4;d++)if(masks[c]&(1<<d)){const n=stepCell(c,d,w,h);if(n<0){if(!(c===start&&d===3||ends.includes(c)&&d===1))return false;}else{if(!(masks[n]&(1<<((d+2)%4))))return false;if(!visited.has(n)){visited.add(n);queue.push(n);}}}}
 return ends.every(c=>visited.has(c))&&masks.every((m,c)=>!m||visited.has(c));
}
function coolingPipes(r){const w=6,h=6,paths=[[12,13,14,15,16,17],[16,10,4,5],[16,22,28,34,35]],solution=Array(36).fill(0);for(const p of paths){const m=pathTiles(w,h,p);m.forEach((v,i)=>solution[i]|=v);}solution[12]|=8;for(const c of[5,17,35])solution[c]|=2;const masks=solution.map(m=>R(pick(r,4)).reduce(v=>rotate(v),m));return{w,h,start:12,ends:[5,17,35],masks,solution};}
function moduleNetwork(r,n=4){const w=n===4?2:3,h=2,path=n===4?[0,1,3,2]:[0,1,2,5,4,3],solution=pathTiles(w,h,path);solution[0]|=8;solution[path.at(-1)]|=8;return {w,h,path,solution,masks:solution.map(v=>R(pick(r,4)).reduce(x=>rotate(x),v))};}
export function moduleConnected(p){const seen=new Set([0]),queue=[0];for(let head=0;head<queue.length;head++){const c=queue[head];for(let d=0;d<4;d++)if(p.masks[c]&(1<<d)){const n=stepCell(c,d,p.w,p.h);if(n<0){if(!(d===3&&(c===0||c===p.path.at(-1))))return false;}else if(!(p.masks[n]&(1<<((d+2)%4))))return false;else if(!seen.has(n)){seen.add(n);queue.push(n);}}}return seen.size===p.masks.length;}
function schedule(r){const jobs=R(8).map(i=>({duration:2+i%2,eligible:[i%4,(i+1)%4]})),witness=jobs.map((j,i)=>({lane:i%4,start:i<4?0:jobs[i-4].duration}));return {jobs,placements:Array(8).fill(null),witness,lanes:4,horizon:12};}
export function timetableValid(g){const occupancy=R(g.lanes).map(()=>Array(g.horizon).fill(false));return g.jobs.every((j,i)=>{const p=g.placements[i];if(!p||!j.eligible.includes(p.lane)||!ok(p.start,g.horizon)||p.start+j.duration>g.horizon)return false;for(let t=p.start;t<p.start+j.duration;t++){if(occupancy[p.lane][t])return false;occupancy[p.lane][t]=true;}return true;});}
export function gateOutputs(gates,a,b){const v=[a,b];for(let i=0;i<6;i++){const[x,y]=[[0,1],[0,1],[2,0],[3,1],[4,5],[6,2]][i];v.push(gates[i]===0?v[x]&&v[y]:gates[i]===1?v[x]||v[y]:!v[x]);}return +v.at(-1);}
function syncState(g){const t=g.elapsed-(g.phaseStarted||0)-2;g.angles=[mod(t*60,360),mod(t*120,360)];g.position=.5+.45*Math.sin(t*Math.PI/2);g.positions=[.5+.45*Math.sin(t*Math.PI/3),.5+.45*Math.sin(t*Math.PI*2/3)];}
const syncValid=g=>g.id===103?g.positions.every(v=>Math.abs(v-.5)<=.075*(1+(g.bonus.width||0)))&&Math.abs(g.position-.5)<=.075*(1+(g.bonus.width||0)):g.angles.every(a=>angleGap(a,0)<=12*(1+(g.bonus.width||0)))&&Math.abs(g.position-.5)<=.075*(1+(g.bonus.width||0));
export function createEra2Game(g){
 const r=rng(g.seed);g.duration=180*(1+(g.bonus.time||0));g.maxMoves=120;g.optimal=120;
 switch(g.id){
 case 88:{g.n=5;g.target=R(25).map(()=>pick(r,2));g.values=[...g.target];g.witness=R(10).map(()=>pick(r,25));g.witness.forEach(i=>diagonal(g.values,i));if(same(g.values,g.target)){diagonal(g.values,0);g.witness=[0];}g.maxMoves=14;g.optimal=g.witness.length;break;}
 case 89:g.values=Array(5).fill(0);g.centers=R(5).map(()=>30+pick(r,40));g.bands=[...g.centers];g.instability=0;g.width=12;break;
 case 90:{g.w=8;g.h=8;g.starts=[0,8,16];g.positions=[...g.starts];const anchor=20+pick(r,3),goal=[anchor,anchor+8,anchor+16];g.goals=goal;const direct=bfs(0,anchor,8,6);const used=new Set(g.starts);let positions=[...g.starts];for(const d of direct){positions=positions.map(c=>stepCell(c,d,8,8));positions.forEach(c=>used.add(c));}g.blocked=R(64).filter(c=>!used.has(c)&&r()<.28);const anchorWalls=R(48).filter(c=>[c,c+8,c+16].some(v=>g.blocked.includes(v)));g.witness=bfs(0,anchor,8,6,anchorWalls);if(!g.witness||g.witness.length>18)throw Error('Invalid generated shared robot route');g.maxMoves=18;g.optimal=g.witness.length;break;}
 case 91:g.round=0;sequenceRound(g,r);break;
 case 92:g.angles=R(6).map(()=>pick(r,300)+30);g.rates=[35,-45,55,-65,75,-85];g.locked=Array(6).fill(false);g.targets=Array(6).fill(0);break;
 case 93:g.demands=R(6).map(()=>2+pick(r,4));g.witness=R(12).map((_,i)=>i<6?1:g.demands[i-6]-1);g.supply=[6,g.demands.reduce((a,b)=>a+b,0)-6];g.caps=Array(12).fill(6);g.values=Array(12).fill(0);break;
 case 94:{g.w=7;g.h=7;g.start=21;g.heading=1;g.pickups=[22,24,26];g.dropoffs=[23,25,27];g.program=[];g.witness=R(3).flatMap(()=>['move','pick','move','drop']);g.maxProgram=14;break;}
 case 95:g.tiles=R(8).map(id=>({id,angle:0}));g.undo=[];for(let k=0;k<10;k++){const i=pick(r,8);if(k%2){[g.tiles[i],g.tiles[(i+1)%8]]=[g.tiles[(i+1)%8],g.tiles[i]];g.undo.unshift(['swap',i]);}else{g.tiles[i].angle=mod(g.tiles[i].angle-1,8);g.undo.unshift(['rotate',i]);}}g.maxMoves=16;g.optimal=10;break;
 case 96:Object.assign(g,schedule(r));break;
 case 97:g.target=R(12).map((_,i)=>i%3===0?1+pick(r,4):i%3===1?1+pick(r,5):pick(r,4));g.values=Array(12).fill(0);g.locking=false;break;
 case 98:case 106:g.tokens=R(g.id===98?20:24).map(()=>pick(r,3));g.index=0;g.clock=0;g.interval=2.5;break;
 case 99:{let gates;for(let k=0;k<100;k++){gates=R(6).map(()=>pick(r,3));const values=R(4).map(i=>gateOutputs(gates,!!(i&2),!!(i&1)));if(new Set(values).size>1){g.tests=values;break;}}if(!g.tests){gates=Array(6).fill(1);g.tests=R(4).map(i=>gateOutputs(gates,!!(i&2),!!(i&1)));}g.witness=gates;g.gates=Array(6).fill(null);break;}
 case 100:g.deps=R(8).map(i=>R(i).filter(()=>r()<.3));g.active=[];break;
 case 101:g.target=[3+pick(r,2),4,0];g.target[2]=12-g.target[0]-g.target[1];g.caps=g.target.map(v=>v+1);g.values=[0,0,0];break;
 case 102:g.w=g.h=7;g.stations=[3,21,24,27,45];g.witness=[3,10,17,21,22,23,24,25,26,27,31,38,45];g.blocked=R(49).filter(c=>!g.witness.includes(c)&&r()<.3);g.chosen=[];g.maxSegments=20;break;
 case 103:g.phaseStarted=0;syncState(g);break;
 case 104:g.target=R(12).map(()=>pick(r,3));g.values=[...g.target];g.witness=R(8).map(()=>pick(r,12));g.witness.forEach(i=>ringStep(g.values,i,2));g.maxMoves=20;g.optimal=g.witness.length;break;
 case 105:g.needs=[3,3,4];g.values=[4,3,3];g.temperatures=[0,0,0];g.instability=0;break;
 case 107:g.target=R(6).map(()=>pick(r,6));g.values=[...g.target];g.witness=R(8).map(()=>pick(r,6));g.witness.forEach(i=>armStep(g.values,i,5));g.maxMoves=18;g.optimal=8;break;
 case 108:g.blocks=[1,1,1,1,-1,-1,-1,-1];g.slots=Array(8).fill(null);g.vectors=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]];break;
 case 109:g.pipes=coolingPipes(r);break;
 case 110:g.w=8;g.h=5;g.start=16;g.stations=[18,20,22,15];g.goal=7;g.witness=[...g.stations,7];g.waypoints=[];g.blocked=R(40).filter(c=>![16,17,18,19,20,21,22,23,15,7].includes(c)&&r()<.25);break;
 case 111:g.target=R(3).map(()=>3+pick(r,5));g.values=[0,0,0];g.instability=0;break;
 case 112:g.modules=moduleNetwork(r);if(moduleConnected(g.modules))g.modules.masks[1]=rotate(g.modules.masks[1]);g.maxMoves=15;break;
 case 113:g.speeds=[40,100];g.angles=[40,210];g.locking=false;break;
 case 114:g.edges=[...R(9).map(i=>[i,i+1,1]),[0,5,1],[2,7,1],[4,9,1]];g.blockedEdges=[9,10,11].filter(()=>r()<.5);g.positions=[0,3,6];g.goals=[3,6,9];g.orders=[0,3,6];g.round=0;break;
 case 115:{const order=shuffle(R(6),r);g.tasks=R(6).map(i=>({duration:i%2+1,priority:1+i%3,deadline:10}));let end=0;for(const i of order){end+=g.tasks[i].duration;g.tasks[i].deadline=Math.min(10,end+1);}g.witness=order;g.order=[];break;}
 case 116:g.targetTotal=3*(40+pick(r,20));g.caps=[80,80,80];g.values=[0,0,0];g.spread=12;break;
 case 117:{const cols=shuffle(R(5),r),rows=shuffle(R(5),r),symbols=shuffle(R(5),r);g.solution=rows.flatMap(y=>cols.map(x=>symbols[(x+y)%5]));g.clues=R(25).filter(()=>r()<.45);if(!g.clues.length)g.clues=[0];g.values=g.solution.map((v,i)=>g.clues.includes(i)?v:-1);break;}
 case 118:g.w=g.h=6;g.starts=[0,12,24];g.goals=[5,17,29];g.arrows=R(36).map(()=>pick(r,4));g.blocked=R(36).filter(c=>![0,2,4].includes(Math.floor(c/6))&&r()<.4);g.witness=g.starts.flatMap(c=>R(5).map(i=>c+i));break;
 case 119:g.part=0;g.modules=moduleNetwork(r,6);g.values=[0,0,0,0];g.min=[2,3,2,3];g.max=[5,6,5,6];g.pool=16;g.phaseStarted=0;syncState(g);g.duration=300*(1+(g.bonus.time||0));break;
 default:throw Error('Unknown A2 signature');
 }
 return g;
}
export function era2Action(g,action,p={}){
 const i=Number(p.i??0),v=Number(p.value??0),r=rng(g.seed+g.round*191+g.actions*23);
 if(action==='replay'&&g.id===91&&g.phase==='input'){g.phase='watch';g.watchUntil=g.elapsed+4;g.message='Memory Assistant: watch the same sequence again.';return;}
 if(action==='hint'){const network=g.id===109?g.pipes:[112,119].includes(g.id)&&(g.id!==119||g.part===0)?g.modules:null;if(network){g.hint=network.masks.findIndex((m,k)=>m!==network.solution[k]);g.message=g.hint<0?'The network matches its reference. Test the route.':`Scanner: tile ${g.hint+1} needs rotation.`;}return;}
 if(action==='select'&&Number.isInteger(i)){g.selected=i;return;}
 if(action==='slider'&&ok(i,g.values?.length||0)&&Number.isInteger(v)){const cap=g.caps?.[i]??(g.id===105?10:g.id===97?5:g.id===101?12:100);if(v>=0&&v<=cap)g.values[i]=v;return;}
 switch(g.id){
 case 88:if(action==='cell'&&ok(i,25)){diagonal(g.values,i);g.moves++;if(same(g.values,g.target))win(g);else if(g.moves>=14)fail(g,'The grid does not match after 14 clicks.');}break;
 case 89:break;
 case 90:if(action==='move'&&ok(i,5)){const next=g.positions.map(c=>stepCell(c,i,8,8));if(next.some(c=>c<0||g.blocked.includes(c))||new Set(next).size<3||next.some((c,k)=>g.positions.some((old,j)=>k!==j&&c===old&&next[j]===g.positions[k])))g.message='That shared move would cross a wall or collide. Choose another direction.';else{g.positions=next;g.moves++;if(same(next,g.goals))win(g);else if(g.moves>=18)fail(g,'The robots used all 18 turns.');}}break;
 case 91:if(action==='answer'&&g.phase==='input'&&ok(i,4)){if(i!==g.correct){bad(g,'The transformed sequence was incorrect.',2);if(g.status==='active')sequenceRound(g,r);}else if(++g.round===4)win(g);else sequenceRound(g,r);}break;
 case 92:if(action==='lock'&&ok(i,6)&&!g.locked[i]){if(angleGap(g.angles[i],g.targets[i])<=16*(1+(g.bonus.width||0))){g.locked[i]=true;if(g.locked.every(Boolean))win(g);}else bad(g,'The disc was outside its marked target. Three missed locks end the challenge.');}break;
 case 93:if(action==='submit'){const a=g.values.slice(0,6).reduce((a,b)=>a+b,0),b=g.values.slice(6).reduce((a,b)=>a+b,0);check(g,a===g.supply[0]&&b===g.supply[1]&&g.demands.every((n,i)=>g.values[i]+g.values[i+6]===n));}break;
 case 94:if(action==='program'&&['move','left','right','pick','drop','repeat'].includes(p.command)&&g.program.length<14)g.program.push(p.command);if(action==='clear')g.program=[];if(action==='run')runCNC(g);break;
 case 95:if(ok(i,8)){if(action==='swap'){[g.tiles[i],g.tiles[(i+1)%8]]=[g.tiles[(i+1)%8],g.tiles[i]];g.moves++;}if(action==='rotate'){g.tiles[i].angle=mod(g.tiles[i].angle+(v<0?-1:1),8);g.moves++;}if(g.tiles.every((t,k)=>t.id===k&&t.angle===0))win(g);}break;
 case 96:if(action==='place'&&ok(g.selected,8)&&ok(i,4)&&Number.isInteger(p.start)&&p.start>=0&&p.start<12)g.placements[g.selected]={lane:i,start:p.start};if(action==='submit')check(g,timetableValid(g));break;
 case 97:if(action==='lock'){if(g.values.every((x,k)=>Math.abs(x-g.target[k])<=.1))g.locking=true;else bad(g,'The four curves are not within tolerance.',5);}break;
 case 98:case 106:if(action==='sort'&&ok(i,3)){if(i!==g.tokens[g.index])bad(g,'The token entered the wrong symbol-marked outlet.');if(g.status==='active'){g.index++;g.clock=0;if(g.index===g.tokens.length)win(g);}}break;
 case 99:if(action==='gate'&&ok(i,6)&&ok(v,3))g.gates[i]=v;if(action==='slot'&&ok(i,6)&&ok(g.selected,3))g.gates[i]=g.selected;if(action==='submit')check(g,g.gates.every(x=>x!==null)&&g.tests.every((out,k)=>gateOutputs(g.gates,!!(k&2),!!(k&1))===out));break;
 case 100:if(action==='node'&&ok(i,8)&&!g.active.includes(i)){if(g.deps[i].every(j=>g.active.includes(j))){g.active.push(i);if(g.active.length===8)win(g);}else bad(g,'Activate all displayed prerequisites first.');}break;
 case 101:if(action==='submit')check(g,g.values.reduce((a,b)=>a+b,0)===12&&g.values.every((x,k)=>Math.abs(x-g.target[k])<=1));break;
 case 102:if(action==='cell'&&ok(i,49)&&!g.blocked.includes(i)){if(g.chosen.includes(i))g.chosen=g.chosen.filter(c=>c!==i);else if(g.chosen.length<20)g.chosen.push(i);else g.message='Remove a segment before adding another.';}if(action==='submit')check(g,stationNetwork(g));break;
 case 103:if(action==='sync')check(g,syncValid(g));break;
 case 104:if(action==='cell'&&ok(i,12)){ringStep(g.values,i);g.moves++;if(same(g.values,g.target))win(g);else if(g.moves>=20)fail(g,'The ring used all 20 actions.');}break;
 case 105:break;
 case 107:if(action==='arm'&&ok(i,6)){armStep(g.values,i);g.moves++;if(same(g.values,g.target))win(g);else if(g.moves>=18)fail(g,'The instruments used all 18 adjustments.');}break;
 case 108:if(action==='slot'&&ok(i,8)&&ok(g.selected,8)){const old=g.slots.indexOf(g.selected);if(old>=0)g.slots[old]=null;g.slots[i]=g.selected;g.moves++;}if(action==='submit'){const vec=rotorVectors(g);check(g,g.slots.every(x=>x!==null)&&new Set(g.slots).size===8&&vec.every(x=>x===0));}break;
 case 109:if(action==='cell'&&ok(i,36))g.pipes.masks[i]=rotate(g.pipes.masks[i]);if(action==='submit')check(g,pipeValid(g));break;
 case 110:if(action==='cell'&&ok(i,40)&&!g.blocked.includes(i)&&g.waypoints.length<6)g.waypoints.push(i);if(action==='clear')g.waypoints=[];if(action==='run')check(g,gantryValid(g));break;
 case 111:break;
 case 112:if(action==='cell'&&ok(i,4)){g.modules.masks[i]=rotate(g.modules.masks[i]);g.moves++;if(moduleConnected(g.modules))win(g);}break;
 case 113:if(action==='speed'&&ok(i,2))g.speeds[i]=Math.max(10,Math.min(120,g.speeds[i]+(v<0?-2:2)));if(action==='phase'&&ok(i,2))g.angles[i]=mod(g.angles[i]+(v<0?-5:5),360);if(action==='lock'){if(turbineAligned(g))g.locking=true;else bad(g,'Match speed within 3% and phase within 12° before locking.');}break;
 case 114:if(action==='route'&&ok(i,3)&&ok(v,10))g.orders[i]=v;if(action==='turn')packetTurn(g);break;
 case 115:if(action==='task'&&ok(i,6)&&!g.order.includes(i))g.order.push(i);if(action==='clear')g.order=[];if(action==='submit'){let t=0;check(g,g.order.length===6&&g.order.every(i=>(t+=g.tasks[i].duration)<=g.tasks[i].deadline)&&t<=10);}break;
 case 116:if(action==='submit')g.locking=true;break;
 case 117:if(action==='cell'&&ok(i,25)&&!g.clues.includes(i))g.values[i]=mod(g.values[i]+1,5);if(action==='set'&&ok(i,25)&&!g.clues.includes(i)&&ok(v,5))g.values[i]=v;if(action==='submit')check(g,latinValid(g));break;
 case 118:if(action==='cell'&&ok(i,36)&&!g.blocked.includes(i))g.arrows[i]=(g.arrows[i]+1)%4;if(action==='run')check(g,logisticsValid(g));break;
 case 119:if(g.part===0){if(action==='cell'&&ok(i,6))g.modules.masks[i]=rotate(g.modules.masks[i]);if(action==='submit'){if(moduleConnected(g.modules)){g.part=1;g.message='Network complete. Allocate the fixed pool.';}else bad(g,'The six-module network has a leak or disconnected output.',4);}}else if(g.part===1&&action==='submit'){if(g.values.reduce((a,b)=>a+b,0)===16&&g.values.every((x,k)=>x>=g.min[k]&&x<=g.max[k])){g.part=2;g.phaseStarted=g.elapsed;syncState(g);g.message='Allocation complete. Synchronize both discs and the line marker.';}else bad(g,'Respect every minimum, maximum and the pool of 16.',4);}else if(g.part===2&&action==='sync')check(g,syncValid(g),4);break;
 }
 if(g.status==='active'&&g.moves>=g.maxMoves&&[95,112].includes(g.id))fail(g,'The adjustment budget is exhausted.');
}
export function rotorVectors(g){return [0,1].map(k=>g.slots.reduce((n,id,i)=>n+(id===null?0:g.blocks[id]*g.vectors[i][k]),0));}
function stationNetwork(g){if(!g.stations.every(c=>g.chosen.includes(c)))return false;const seen=new Set([g.stations[0]]),q=[g.stations[0]];for(let h=0;h<q.length;h++)for(let d=0;d<4;d++){const n=stepCell(q[h],d,7,7);if(g.chosen.includes(n)&&!seen.has(n)){seen.add(n);q.push(n);}}return g.stations.every(c=>seen.has(c));}
function runCNC(g){let c=g.start,dir=g.heading,cargo=null,done=[],last=null;const program=[];for(const op of g.program){if(op==='repeat'){if(!last){bad(g,'Repeat Twice needs an earlier command.');return;}program.push(last,last);}else{program.push(op);last=op;}}if(program.length>42){bad(g,'Program expansion is too long.');return;}for(const op of program){if(op==='left')dir=mod(dir-1,4);if(op==='right')dir=mod(dir+1,4);if(op==='move'){c=stepCell(c,dir,7,7);if(c<0){bad(g,'The robot left the work grid.');return;}}if(op==='pick'){const k=g.pickups.indexOf(c);if(k<0||cargo!==null||done.includes(k)){bad(g,'Pick must target an available pickup while empty.');return;}cargo=k;}if(op==='drop'){if(cargo===null||c!==g.dropoffs[cargo]){bad(g,'Drop must match the carried symbol.');return;}done.push(cargo);cargo=null;}}g.position=c;g.delivered=done;check(g,done.length===3&&cargo===null);}
export function gantryValid(g){let c=g.start,moves=0,next=0;for(const waypoint of g.waypoints){const route=bfs(c,waypoint,8,5,g.blocked);if(!route)return false;for(const d of route){c=stepCell(c,d,8,5);moves++;if(c===g.stations[next])next++;else if(g.stations.includes(c)&&g.stations.indexOf(c)>next)return false;}}g.routeMoves=moves;return c===g.goal&&next===4&&moves<=22;}
function packetTurn(g){const used=new Map();for(let k=0;k<3;k++){if(g.positions[k]===g.goals[k])continue;const a=g.positions[k],b=g.orders[k];if(a===b)continue;const edge=g.edges.findIndex(([x,y])=>x===a&&y===b||x===b&&y===a);if(edge<0||g.blockedEdges.includes(edge)||(used.get(edge)||0)>=g.edges[edge][2]){bad(g,'A packet route is blocked, nonadjacent, or exceeds edge capacity.');return;}used.set(edge,(used.get(edge)||0)+1);}g.positions=g.orders.map((v,k)=>g.positions[k]===g.goals[k]?g.positions[k]:v);g.round++;if(same(g.positions,g.goals))win(g);else if(g.round>=8)fail(g,'Packets did not arrive within eight rounds.');}
export function latinValid(g){return g.values.every(x=>x>=0)&&R(5).every(i=>new Set(g.values.slice(i*5,i*5+5)).size===5&&new Set(R(5).map(j=>g.values[j*5+i])).size===5);}
export function logisticsValid(g){let positions=[...g.starts];for(let t=0;t<20;t++){const next=positions.map((c,k)=>c===g.goals[k]?c:stepCell(c,g.arrows[c],6,6));if(next.some(c=>c<0||g.blocked.includes(c))||new Set(next).size<3||next.some((c,k)=>positions.some((old,j)=>j!==k&&c===old&&next[j]===positions[k])))return false;positions=next;if(same(positions,g.goals))return true;}return false;}
const turbineAligned=g=>Math.abs(g.speeds[0]-g.speeds[1])/Math.max(...g.speeds)<.03&&angleGap(...g.angles)<12;
export function tickEra2Game(g,dt){
 if(g.id===89){g.bands=g.centers.map((c,i)=>c+5*Math.sin(g.elapsed*.22+i));const good=g.values.every((v,i)=>Math.abs(v-g.bands[i])<=g.width/2);g.stable=good?g.stable+dt:0;if(!good&&g.elapsed>4)g.instability+=dt*.025;else g.instability=Math.max(0,g.instability-dt*.06);if(g.instability>=1)fail(g,'Calibration instability reached 100%.');else if(g.stable>=3)win(g);}
 if(g.id===91&&g.phase==='watch'&&g.elapsed>=g.watchUntil)g.phase='input';
 if(g.id===92)g.angles=g.angles.map((a,i)=>g.locked[i]?a:mod(a+g.rates[i]*dt,360));
 if(g.id===97){const good=g.locking&&g.values.every((v,i)=>Math.abs(v-g.target[i])<=.1);g.stable=good?g.stable+dt:0;if(g.stable>=2)win(g);}
 if(g.id===98||g.id===106){g.clock+=dt;if(g.clock>=g.interval){g.clock=0;bad(g,'A token reached the end without a route.');if(g.status==='active'&&++g.index===g.tokens.length)win(g);}}
 if(g.id===103||g.id===119&&g.part===2)syncState(g);
 if(g.id===105){g.temperatures=g.values.map((v,i)=>20+Math.sin(g.elapsed*.3+i)*.3-v*2);const good=g.values.reduce((a,b)=>a+b,0)===10&&g.temperatures.every((v,i)=>Math.abs(v-(20-g.needs[i]*2))<=1);g.stable=good?g.stable+dt:0;if(!good&&g.elapsed>4)g.instability+=dt*.035;else g.instability=Math.max(0,g.instability-dt*.05);if(g.instability>=1)fail(g,'Cryogenic instability reached 100%.');else if(g.stable>=4)win(g);}
 if(g.id===111){g.error=Math.sqrt(g.values.reduce((n,v,i)=>n+(v-g.target[i])**2,0)/3);g.stable=g.error<=.15?g.stable+dt:0;if(g.elapsed>5&&g.error>.15)g.instability+=dt*.025;else g.instability=Math.max(0,g.instability-dt*.05);if(g.instability>=1)fail(g,'Vibration instability reached 100%.');else if(g.stable>=3)win(g);}
 if(g.id===113){g.angles=g.angles.map((a,i)=>mod(a+g.speeds[i]*dt,360));g.stable=g.locking&&turbineAligned(g)?g.stable+dt:0;if(g.stable>=2)win(g);}
 if(g.id===116){const total=g.values.reduce((a,b)=>a+b,0),good=Math.abs(total-g.targetTotal)<=g.targetTotal*.01&&Math.max(...g.values)-Math.min(...g.values)<=g.spread;g.stable=good?g.stable+dt:0;if(g.stable>=3)win(g);}
}
