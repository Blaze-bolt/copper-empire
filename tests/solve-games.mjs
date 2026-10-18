import assert from 'node:assert/strict';
import {gameAction as rawA,tickGame as rawT} from '../src/empire/games.js';
import {rotate} from '../src/engine.js';
const recordings=new WeakMap();
const A=(g,a,p={})=>{if(g.status==='active')recordings.get(g)?.push(['a',a,structuredClone(p)]);return rawA(g,a,p);};
const T=(g,dt)=>{if(dt>0)recordings.get(g)?.push(['t',dt]);return rawT(g,dt);};
export function advance(g,seconds){for(let t=0;t<seconds&&g.status==='active';t+=.02)T(g,Math.min(.02,seconds-t));}
const act=(g,a,i=0,value=0,extra={})=>A(g,a,{i,value,...extra});
function circuit(g,p,board){for(let i=0;i<p.masks.length;i++){if(!p.solution[i])continue;for(let n=0;n<4&&p.masks[i]!==p.solution[i];n++)A(g,'tile',{i,board});}}
export function solve(g,recording){if(recording)recordings.set(g,recording);switch(g.id){
case 1:while(g.status==='active'){while(Math.abs(g.position-g.center)>.015&&g.status==='active')advance(g,.02);act(g,'hit');}break;
case 2:for(let i=0;i<g.pieces.length;i++){act(g,'select',i);while(g.pieces[i].angle!==g.targets[i])act(g,'rotate');act(g,'slot',i);}break;
case 3:for(const m of g.undo){act(g,'cell',m.from);act(g,'cell',m.to);}act(g,'test');break;
case 4:case 6:case 18:case 48:{const values=g.secret||g.target;values.forEach((v,i)=>act(g,'slider',i,v));if(g.id===6)act(g,'test');else advance(g,3.1);break;}
case 5:advance(g,g.watchLength+.1);for(const duration of g.sequence){A(g,'pulse',{value:duration>.5?1:0});}break;
case 7:for(let i=0;i<g.puzzle.arrows.length;i++)while(g.puzzle.arrows[i]!==g.puzzle.target[i])act(g,'tile',i);act(g,'test');break;
case 8:circuit(g,g.puzzle);act(g,'test');break;
case 9:case 11:for(let t=0;t<10000&&g.status==='active';t++){for(const o of g.objects)if(!o.hit&&!o.miss&&g.elapsed>=o.born&&g.elapsed<o.born+6){if(g.id===9){if(o.kind===g.target)act(g,'target',o.id);}else{act(g,'select',o.id);act(g,'bin',o.kind);}}advance(g,.05);}break;
case 10:for(const i of g.undo)for(let k=0;k<3&&g.status==='active';k++)act(g,'gear',i);break;
case 12:for(let i=0;i<g.path.length-1;i++)for(let k=0;k<=8;k++){const a=g.path[i],b=g.path[i+1];A(g,'trace',{x:a.x+(b.x-a.x)*k/8,y:a.y+(b.y-a.y)*k/8});}break;
case 13:for(let i=0;i<16;i++)while(g.puzzle.arrows[i]!==g.puzzle.target[i])act(g,'tile',i);act(g,'test');break;
case 14:act(g,'gate',0);act(g,'gate',2);act(g,'test');break;
case 15:for(let i=0;i<6;i++){const target=i%2===0?1:-1;if(g.values[i]!==target){const j=g.values.findIndex((v,k)=>k>i&&v===target);act(g,'cell',i);act(g,'cell',j);}}act(g,'test');break;
case 16:case 37:for(const note of g.notes){advance(g,note.at-g.elapsed);act(g,'beat',note.lane);}advance(g,1);break;
case 17:for(const p of g.pieces){const k=g.path.indexOf(p.cell),before=k===0?-1:g.path[k-1],after=k===g.path.length-1?9:g.path[k+1];let desired=0;if(k===0)desired|=8;else desired|=before-p.cell===-3?1:before-p.cell===-1?8:before-p.cell===1?2:4;if(k===g.path.length-1)desired|=2;else desired|=after-p.cell===3?4:after-p.cell===1?2:after-p.cell===-1?8:1;act(g,'select',p.id);while(p.mask!==desired)act(g,'rotate');act(g,'slot',p.cell);}act(g,'test');break;
case 19:for(let k=0;k<3000&&g.status==='active';k++){if(g.value>.57)act(g,'push',0,-1);advance(g,.02);}break;
case 20:advance(g,g.watchLength+.1);for(const i of g.sequence)act(g,'symbol',i);break;
case 21:while(g.status==='active')act(g,'target',g.target);break;
case 22:g.target.forEach((n,i)=>{for(let k=0;k<n;k++)act(g,'point',i);});act(g,'test');break;
case 23:for(const m of g.undo)for(let n=0;n<3;n++)A(g,'tile',{i:m.tile,board:m.board});act(g,'test');break;
case 24:advance(g,5.1);for(let i=0;i<6;i++){let j=g.pieces.findIndex(p=>p.id===i);if(i!==j){act(g,'cell',i);act(g,'cell',j);}while(g.pieces[i].angle!==0)act(g,'rotate',i);}act(g,'test');break;
case 25:for(let k=0;k<10000&&g.status==='active';k++){g.lanes.forEach((l,i)=>{while(l.route!==l.token)act(g,'junction',i);});advance(g,.05);}break;
case 26:for(let k=0;k<10000&&g.status==='active';k++){const error=g.targets[g.targetIndex]-g.position;if(Math.abs(error)<.025){act(g,'brake');act(g,'stop');}else{if(error>0&&g.velocity<.04)act(g,'up');else if(error<0&&g.velocity>-.04)act(g,'down');advance(g,.04);}}break;
case 27:for(let k=0;k<10000&&g.status==='active';k++){const l=g.lanes[0];while(l.route!==l.token)act(g,'junction',0);if(!l.speed)act(g,'speed',0);advance(g,.1);}break;
case 28:g.solution.forEach((cell,i)=>{act(g,'select',i);act(g,'slot',cell);});act(g,'test');break;
case 29:for(const i of [0,1,2,3])act(g,'edge',i);act(g,'test');break;
case 30:for(let k=0;k<g.required&&g.status==='active';k++){const job=g.jobs[0];act(g,'select',job.id);for(const station of [...job.recipe]){while(g.cooldowns[station]>0)advance(g,.05);act(g,'station',station);}}break;
case 31:for(let i=0;i<3;i++)while(g.speeds[i]>0)act(g,'rotor-speed',i,-1);for(let i=0;i<3;i++){act(g,'rotor-speed',i,1);for(let k=0;k<2000&&Math.min(g.angles[i],360-g.angles[i])>10;k++)advance(g,.04);act(g,'rotor-speed',i,-1);}act(g,'test');break;
case 32:for(let i=0;i<7;i++)act(g,'edge',i);act(g,'test');break;
case 33:for(let k=0;k<2000&&g.status==='active';k++){A(g,'move',{position:g.target});advance(g,.02);}break;
case 34:for(const command of g.solution)A(g,'command',{command});act(g,'run');advance(g,20);break;
case 35:for(const i of g.undo)act(g,'cell',i);break;
case 36:for(const dir of g.solution){while(g.arrows[g.position]!==dir)act(g,'tile',g.position);act(g,'step');}break;
case 38:g.solution.forEach((n,i)=>{for(let k=0;k<n;k++)act(g,'allocation',i,1);});act(g,'test');break;
case 39:for(let k=0;k<8500&&g.status==='active';k++){const error=((g.target-g.angle+540)%360)-180;if(Math.abs(error)<11&&Math.abs(g.velocity)<8){act(g,'test');break;}if(Math.abs(g.velocity)<2)act(g,'impulse',0,Math.sign(error));advance(g,.04);}break;
case 40:g.solution.forEach((p,i)=>{act(g,'select',i);A(g,'place',p);});act(g,'test');break;
case 41:for(const m of g.undo)act(g,'ring',m.i,m.delta);act(g,'test');break;
case 42:for(let i=0;i<3;i++)act(g,'offset',i,90);act(g,'test');advance(g,.6);break;
case 43:while(g.tokens[0]>=2)act(g,'recipe',0);while(g.status==='active'&&g.tokens[1]>0)act(g,'recipe',1);break;
case 44:for(const a of g.answers)act(g,'answer',0,a);A(g,'code',{code:'523'});break;
case 45:for(const q of g.questions)act(g,'answer',0,q.answer);break;
case 46:for(let r=0;r<4;r++){advance(g,3.1);for(const i of [...g.sequence])act(g,'symbol',i);}break;
case 47:act(g,'input',0);act(g,'input',1);act(g,'input',2);act(g,'test');break;
case 49:act(g,'token',0);for(const i of [0,1])act(g,'move',i);act(g,'portal');for(const i of [0,1])act(g,'move',i);act(g,'token',1);for(const i of [0,3])act(g,'move',i);act(g,'portal');for(const i of [0,3])act(g,'move',i);break;
case 50:for(const m of g.witness){act(g,'select',m.pattern);act(g,'place',m.cell);}act(g,'test');break;
case 51:for(let k=0;k<10000&&g.status==='active';k++){for(let i=0;i<3;i++){const sys=g.systems[i];if(sys.coolUntil>g.elapsed)continue;if(sys.heat>68){act(g,'cool',i);continue;}while(sys.allocation<sys.need&&g.systems.reduce((v,s)=>v+s.allocation,0)<4)act(g,'resource',i,1);}advance(g,.05);}break;
case 52:circuit(g,g.puzzle);act(g,'gate',0);act(g,'gate',1);for(const i of [0,1]){act(g,'destination',i);while(Math.abs(g.position-g.center)>.025&&g.status==='active')advance(g,.02);act(g,'convert');}break;
}
 assert.equal(g.status,'success',`Game ${g.id}: ${g.reason||g.message||'still active'}; elapsed ${g.elapsed}, moves ${g.moves}`);recordings.delete(g);return g;
}
