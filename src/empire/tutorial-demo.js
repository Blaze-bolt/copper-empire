import {createGame,gameAction,tickGame} from './games.js';
import {gameView} from './game-ui.js';
import {ALL_GUIDES,gameGuideKey} from './minigame-guides.js';
// Fixed illustrative seed, never derived from a real attempt or account.
export const DEMO_SEED=22261071;
export function createTutorialDemo(key){
 if(!ALL_GUIDES[key])throw Error('Unknown tutorial.');
 const [base,phase]=String(key).split(':'),g=createGame(Number(base),0,DEMO_SEED,{});
 if(phase!==undefined){
  if(g.id===44){g.panel=3;g.revealed=[2,4,6];}
  if(g.id===82)g.panel=phase;
  if(g.id===86){g.phase=phase==='1'?'route':'sync';if(g.phase==='sync')Object.assign(g,{syncTargets:[.3,.5,.7],syncPhases:[0,.4,.8],positions:[0,.4,.8],locked:[false,false,false],syncScores:[]});}
  if([87,119].includes(g.id)){g.part=Number(phase);if(g.id===87)g.phase=['watch','allocation','synchronization','network'][g.part];}
 }
 // The core's real fixed deduction values must never be a worked tutorial answer.
 if(g.id===44&&g.panel<3)g.answers=[3,6,1];
 return g;
}
export function responseDemo(g){const leaf=g.sub||g;if(leaf.phase==='watch'){
 // Only the fake board advances to its response phase. No live clock is touched.
 for(let i=0;i<500&&leaf.phase==='watch'&&g.status==='active';i++)tickGame(g,.04);
 }return g;}
export class TutorialDemo {
 constructor(key){this.key=String(key);this.reset();}
 reset(){this.game=createTutorialDemo(this.key);this.ticks=0;return this.game;}
 response(){return responseDemo(this.game);}
 action(action,payload={}){
  const g=this.game,leaf=g.sub||g;
  if(leaf.id===44){g.message='Illustrative selection only. The real panels reveal their own code.';return;}
  if(action==='trace-key'){const d=[[0,-1],[1,0],[0,1],[-1,0]][payload.i];action='trace';payload={x:g.cursor.x+d[0]*5,y:g.cursor.y+d[1]*5};}
  if(g.status==='active')gameAction(g,action,payload);
 }
 tick(dt){if(this.game.status==='active'){tickGame(this.game,Math.min(.04,Math.max(0,dt)));this.ticks++;}}
 view(){return gameView(this.game);}
 get guideKey(){return gameGuideKey(this.game);}
}
