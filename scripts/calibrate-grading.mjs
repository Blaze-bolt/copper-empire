// Reproducible input simulation, not a quota or a production randomness source.
import {createGame,gameAction,tickGame} from '../src/empire/games.js';
import {performanceGrade,stageReport} from '../src/empire/grading.js';
import {rng} from '../src/empire/data.js';
const random=rng(6212026),normal=()=>Math.sqrt(-2*Math.log(Math.max(Number.MIN_VALUE,random())))*Math.cos(2*Math.PI*random());
const results=[];
for(const sigma of [.04,.09,.15]){
 const grades={EX:0,S:0,A:0,B:0,C:0};let failed=0;
 for(let attempt=0;attempt<2000;attempt++){
  const g=createGame(1,6,attempt+1);
  while(g.status==='active'){
   const target=g.center+normal()*sigma*g.speed;
   while(g.status==='active'&&g.position<Math.max(.04,target))tickGame(g,.005);
   if(g.status==='active')gameAction(g,'hit');
  }
  if(g.status==='success')grades[performanceGrade([g.score],{stageReports:[stageReport(g)]})]++;else failed++;
 }
 const completed=Object.values(grades).reduce((a,b)=>a+b,0);
 results.push({model:'four precision hits, difficulty 6, zero intentional mistakes',timingStandardDeviationMs:sigma*1000,attempts:2000,completed,failed,grades,exPercentOfSuccessful:100*grades.EX/completed});
}
console.log(JSON.stringify({seed:6212026,limitations:'Synthetic independent normally distributed timing offsets. This measures the actual input/scoring engine; it is not a human playtest or evidence of a game-wide skilled-player EX frequency.',results},null,2));
