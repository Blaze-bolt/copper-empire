// Shared by the browser and authoritative recording replay. Completion rules live
// in the games; this module evaluates how a completed solution was performed.
const clamp=n=>Math.max(0,Math.min(1,n));
const gap=(a,b=0)=>Math.abs(((a-b+540)%360)-180);
const mean=a=>a.length?a.reduce((n,v)=>n+v,0)/a.length:0;
export const GRADE_PERCENT={EX:150,S:120,A:110,B:105,C:100};
export const GRADE_ORDER=['EX','S','A','B','C'];
export const sOrBetter=grade=>grade==='EX'||grade==='S';
const groups={
 timing:[1,26,31,39,52,55,60,86,92,103,119],
 rhythm:[16,37,69,77],
 tracking:[4,18,19,33,42,48,53,65,72,89,97,105,111,113,116],
 reaction:[9,11,21,25,27,30,51,70,98,106],
 memory:[5,20,24,44,45,46,58,79,87,91],
};
export const SCORING_PROFILES=Object.fromEntries(Array.from({length:119},(_,k)=>{const id=k+1;return[id,Object.entries(groups).find(([,ids])=>ids.includes(id))?.[0]||'logic'];}));
const turns=(a,b,mod=4)=>a.reduce((n,v,i)=>n+((b[i]-v+mod)%mod),0);
function benchmark(g){
 if([5,20].includes(g.id))return g.sequence.length;
 if(g.id===24){const seen=new Set();let swaps=0;for(let i=0;i<g.pieces.length;i++){let k=i,n=0;while(!seen.has(k)){seen.add(k);n++;k=g.pieces[k].id;}swaps+=Math.max(0,n-1);}return g.pieces.reduce((n,p)=>n+(4-p.angle)%4,0)+swaps*2;}
 if(g.id===58)return 16;
 if(g.id===91)return 4;
 if(g.id===87)return 6+4+g.witness.length;
 if(g.id===75)return g.witness.length*4;
 if(g.id===114)return 12;
 if(g.id===118)return g.witness.reduce((n,i)=>n+(1-g.arrows[i]+4)%4,0);
 if(g.id===84)return g.witness.reduce((n,v)=>n+v+1,0);
 if(g.id===22)return g.target.reduce((n,v)=>n+v,0);
 if(g.id===44)return 4;
 if(g.id===45)return g.questions.length;
 if(g.id===46)return g.rounds*g.sequence.length;
 if(g.id===49)return 10;
 if(g.id===83)return g.scramble.length;
 if(g.optimal&&g.optimal!==120)return g.optimal;
 if([57,63].includes(g.id))return g.scramble.length*3;
 if(g.id===10)return g.undo.length*3;
 if(g.id===3)return g.undo.length;
 if(g.id===64||g.id===79)return g.undo.reduce((n,x)=>n+(x[0]==='rotate'?x[2]:1),0);
 if(g.id===41)return g.undo.length;
 if(g.id===35)return g.undo.length;
 if([7,13].includes(g.id))return turns(g.puzzle.arrows,g.puzzle.target);
 if([8,109,112].includes(g.id)){const p=g.puzzle||g.pipes||g.modules;return p.masks.reduce((n,m,i)=>{const target=p.solution[i];if(!target)return n;for(let k=0;k<4;k++){if(m===target)return n+k;m=((m<<1)&15)|(m>>3);}return n;},0);}
 if(g.id===2)return g.pieces.reduce((n,p,i)=>n+(g.targets[i]-p.angle+360)%360/60+1,0);
 if(g.id===117)return 25-g.clues.length;
 if(g.id===50)return g.budget;
 if(g.id===34)return g.solution.length;
 if(g.id===38)return g.solution.reduce((n,x)=>n+x,0);
 if(g.witness?.length)return g.witness.length;
 const fixed={14:2,15:3,17:24,22:6,23:27,28:4,29:4,32:7,36:16,40:4,43:24,47:3,56:6,59:4,61:5,65:4,68:6,73:6,75:10,76:16,78:36,80:12,82:18,84:16,93:12,96:8,99:6,100:8,101:3,102:13,108:8,110:5,114:3,115:6,118:45};
 return fixed[g.id]||g.values?.length||1;
}
export function initGrading(g){if(g.id>119)return g;g.grading={version:2,profile:SCORING_PROFILES[g.id],benchmark:Math.max(1,benchmark(g)),operations:0,invalid:0,hints:0,replays:0,samples:0,loss:0,weight:0,lastControl:null,lastResponse:0};return g;}
function sample(g,normalized,weight=1){if(!Number.isFinite(normalized)||weight<=0)return;const m=g.grading;m.loss+=Math.min(1,normalized*normalized)*weight;m.weight+=weight;m.samples++;}
function actionPrecision(g,a,p){
 const i=Number(p.i||0),w=1+(g.bonus.width||0);
 if((g.id===1&&a==='hit')||(g.id===52&&a==='convert'))sample(g,Math.abs(g.position-g.center)/(g.width/2));
 if(g.id===26&&a==='stop')sample(g,Math.max(Math.abs(g.position-g.targets[g.targetIndex])/.045,Math.abs(g.velocity)/.035));
 if(g.id===31&&a==='test')sample(g,mean(g.angles.map(x=>gap(x)/18)));
 if(g.id===39&&a==='test')sample(g,Math.max(gap(g.angle,g.target)/12,Math.abs(g.velocity)/8));
 if(g.id===55&&a==='lock'&&!g.locked[i])sample(g,Math.max(gap(g.angles[i],g.targets[i])/g.tolerance,Math.abs(g.velocity[i])/5));
 if(g.id===60&&a==='beat'&&!g.hit[i])sample(g,Math.abs(g.elapsed-g.due[i])/g.window);
 if(g.id===86&&g.phase==='sync'&&a==='lock'&&!g.locked[i])sample(g,Math.abs(g.positions[i]-g.syncTargets[i])/(g.width/2));
 if(g.id===87&&g.part===2&&a==='lock'&&!g.locked[i])sample(g,gap(g.angles[i])/g.tolerance);
 if(g.id===92&&a==='lock'&&!g.locked[i])sample(g,gap(g.angles[i],g.targets[i])/(16*w));
 if((g.id===103&&a==='sync')||(g.id===119&&g.part===2&&a==='submit')){sample(g,Math.max(Math.abs(g.position-.5)/(.075*w),...(g.id===103?g.positions.map(v=>Math.abs(v-.5)/(.075*w)):g.angles.map(v=>gap(v)/(12*w)))));}
 if([16,37,69,77].includes(g.id)&&a==='beat'){
  const notes=g.notes.filter(n=>(n.lane||0)===i&&!n.resolved&&!n.done&&!n.pressed);
  const note=notes.sort((a,b)=>Math.abs(a.at-g.elapsed)-Math.abs(b.at-g.elapsed))[0];
  if(note)sample(g,Math.abs(note.at-g.elapsed)/([69,77].includes(g.id)?.2*w:.24));
 }
 if(g.grading.profile==='reaction'&&['target','bin','sort'].includes(a)){
  const object=g.objects?.find(o=>o.id===(a==='bin'?g.selected:i));
  const delay=object?g.elapsed-object.born:g.clock;
  // A 350 ms response earns full reaction credit; no frame-perfect input.
  if(Number.isFinite(delay))sample(g,Math.max(0,delay-.35)/(object?2:Math.max(.5,(g.interval||2)-.35)));
 }
 if(g.id===12&&a==='trace'){
  let dist=Infinity;for(let k=1;k<g.path.length;k++){const b=g.path[k],a=g.path[k-1],dx=b.x-a.x,dy=b.y-a.y,t=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy));dist=Math.min(dist,Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy));}
  // Distance weighting makes pointer sample frequency irrelevant.
  const length=Math.hypot(p.x-g.cursor.x,p.y-g.cursor.y);sample(g,dist/g.width,length);
 }
}
const ignore=new Set(['select','layer','panel','token','hint','replay','test','submit','run','lock','sync','beat','release','trace','accelerate','brake','up','down','impulse','rotor-speed','rotor-pause','offset','move']);
export function beforeGradingAction(g,action,p){
 if(!g.grading||g.status!=='active')return null;
 const m=g.grading;if(action==='hint')m.hints++;if(action==='replay')m.replays++;
 actionPrecision(g,action,p);
 const previous={errors:g.errors,missed:g.missed||0,moves:g.moves,stable:g.stable,phase:g.phase,part:g.part,round:g.round,input:g.input,signature:JSON.stringify([g.values,g.chosen,g.program,g.placements,g.gates,g.tiles,g.slots,g.arrows,g.positions,g.active,g.order,g.waypoints,g.puzzle?.masks,g.puzzle?.arrows])};
 if((!ignore.has(action)||(action==='move'&&m.profile==='logic'))&&!(g.id===3&&g.selected===null)){
  const key=action+':'+(p.row??'')+':'+(p.i??'');
  if(!['slider','allocation','speed','order'].includes(action)||m.lastControl!==key)m.operations++;
  m.lastControl=key;
 }
 return previous;
}
export function afterGradingAction(g,action,previous){
 if(!previous||!g.grading)return;
 const changed=previous.signature!==JSON.stringify([g.values,g.chosen,g.program,g.placements,g.gates,g.tiles,g.slots,g.arrows,g.positions,g.active,g.order,g.waypoints,g.puzzle?.masks,g.puzzle?.arrows]);
 if(['test','submit'].includes(action)&&g.status==='active'&&g.message&&g.errors===previous.errors&&!changed&&g.phase===previous.phase&&g.part===previous.part&&g.round===previous.round&&!g.testing)mInvalid(g);
 if(['undo','clear','reset','restart','remove'].includes(action))mInvalid(g);
 finishGrading(g);
}
function mInvalid(g){g.grading.invalid++;}
export function observeGradingTick(g,dt,oldStable){
 if(!g.grading)return;
 if(g.stable>oldStable||g.id===19&&g.inside>0){let errors=null;
  if([18,48,97,111].includes(g.id))errors=g.id===111?[g.error/.15]:g.values.map((v,i)=>Math.abs(v-(g.secret||g.target)[i])/(g.id===97?.1:.55));
  if(g.id===4)errors=g.values.map((v,i)=>Math.abs(v-g.target[i])/Math.max(1,g.target[i]));
  if(g.id===19)errors=[Math.abs(g.value-.5)/.18];
  if(g.id===33)errors=[Math.abs(g.position-g.target)/.11];
  if(g.id===42){const bars=g.offsets.map((p,i)=>(Math.sin(g.elapsed*g.rates[i]+p*Math.PI/180)+1)/2);errors=[(Math.max(...bars)-Math.min(...bars))/.12];}
  if(g.id===53)errors=g.angles.map((v,i)=>gap(v-g.rates[i]*(g.stable-1))/g.tolerance);
  if(g.id===65)errors=g.matrix.map((row,i)=>Math.abs(row.reduce((n,v,k)=>n+v*g.values[k],0)-g.target[i])/.45);
  if(g.id===72)errors=g.values.map((v,i)=>Math.max(Math.abs(v-.5)/(.07*(1+(g.bonus.width||0))),Math.abs(g.velocity[i])/.04));
  if(g.id===89)errors=g.values.map((v,i)=>Math.abs(v-g.bands[i])/(g.width/2));
  if(g.id===105)errors=g.values.map((v,i)=>Math.abs(v-g.needs[i])*2);
  if(g.id===113)errors=[gap(...g.angles)/12,Math.abs(g.speeds[0]-g.speeds[1])/Math.max(...g.speeds)/.03];
  if(g.id===116)errors=[Math.abs(g.values.reduce((a,b)=>a+b,0)-g.targetTotal)/(g.targetTotal*.01),(Math.max(...g.values)-Math.min(...g.values))/g.spread];
  if(errors)sample(g,Math.sqrt(mean(errors.map(v=>v*v))),dt);
 }
 finishGrading(g);
}
export function finishGrading(g){if(g.status!=='success'||!g.grading)return;
 const m=g.grading,mistakes=Math.max(g.errors||0,g.missed||0)+m.invalid;
 const precision=m.weight?clamp(1-.6*m.loss/m.weight):1;
 const efficiency=['logic','memory'].includes(m.profile)?clamp(1-Math.max(0,m.operations-m.benchmark)/m.benchmark*.55):1;
 const penalty=mistakes*.13+m.replays*.10+m.hints*.05;
 // No generic timer penalty: puzzle thought and mandatory watch/hold time are free.
 const score=clamp(Math.min(precision,efficiency)-penalty);
 g.score=score;g.scoring={version:2,score,profile:m.profile,precision,efficiency,mistakes,hints:m.hints,replays:m.replays,penalty,exceptional:precision>=.95&&efficiency>=.95&&!mistakes&&!m.replays&&!m.hints};
}
export function stageReport(g){return g.scoring?{...g.scoring,id:g.id}:{version:1,id:g.id,score:g.score,mistakes:g.errors||0,replays:0,hints:0,exceptional:false,legacy:true};}
export function performanceSummary(scores,attempt={}){
 const average=mean(scores),reports=attempt.stageReports||[],reasons=[];
 if(average<.985)reasons.push('Average score is below 98.5%.');
 scores.forEach((score,i)=>{if(score<.95)reasons.push(`Stage ${i+1} scored below 95%.`);});
 if(reports.length!==scores.length||reports.some(r=>r.version!==2))reasons.push('This recovery includes a stage started with legacy scoring.');
 if(reports.some(r=>r.mistakes))reasons.push('A mistake was recorded.');
 if(attempt.replays||reports.some(r=>r.replays))reasons.push('Memory replay assistance was used.');
 if(attempt.hints||reports.some(r=>r.hints))reasons.push('Scanner assistance was used.');
 if(reports.some((r,i)=>!r.exceptional||r.score!==scores[i]||!Number.isFinite(r.precision)||r.precision<.95||!Number.isFinite(r.efficiency)||r.efficiency<.95))reasons.push('A stage did not meet its exceptional precision or efficiency criterion.');
 const grade=scores.length&&reasons.length===0?'EX':average>=.93?'S':average>=.83?'A':average>=.70?'B':'C';
 return {grade,average,multiplier:GRADE_PERCENT[grade]/100,stages:scores.map((score,i)=>({stage:i+1,score,...reports[i]})),exReasons:[...new Set(reasons)]};
}
export const performanceGrade=(scores,attempt)=>performanceSummary(scores,attempt).grade;
