import {sampleInWorker} from '../../src/empire/aura-app.js';
import {createGame} from '../../src/empire/games.js';import {gameView} from '../../src/empire/game-ui.js';
let heartbeat=0;setInterval(()=>document.querySelector('#heartbeat').textContent='Heartbeat '+(++heartbeat),10);
document.querySelector('#worker').onclick=async()=>{const start=performance.now(),beat=heartbeat,counts=await sampleInWorker(100000000);document.querySelector('#worker-result').textContent=`${Object.keys(counts).length} exact counters; sum ${Object.values(counts).reduce((a,b)=>a+b,0)}; ${(performance.now()-start).toFixed(1)} ms; heartbeat advanced ${heartbeat-beat}; Crown ${counts.crown}`;};
const g=createGame(20,3,7);g.sequence=[0,0,0,2];let sample=0;
function paint(){g.elapsed=.5+Math.floor(sample/2)*.9+(sample%2?.75:.1);document.querySelector('#valves').innerHTML=gameView(g).scene;document.querySelector('#sample').textContent=`Sample ${sample+1} · ${sample%2?'Dark gap':'Flash '+(Math.floor(sample/2)+1)} · sequence 1, 1, 1, 3`;}
document.querySelector('#next').onclick=()=>{sample=(sample+1)%8;paint();};paint();

document.querySelector('#measure').onclick=()=>{const d=document.querySelector('iframe').contentDocument;document.querySelector('#mobile-result').textContent=JSON.stringify({width:d.documentElement.clientWidth,scrollWidth:d.documentElement.scrollWidth,cards:d.querySelectorAll('[data-aura-card]').length,counter:d.querySelector('[data-aura-card="rusty"] .forge-owned').textContent,cardWidth:d.querySelector('[data-aura-card]').getBoundingClientRect().width});};
