import * as E from '../../src/empire/state.js';import {renderApp} from '../../src/empire/views.js';import {connectAuraForge} from '../../src/empire/aura-app.js';
const app=document.querySelector('#app'),overlay=document.querySelector('#overlay-root'),status=document.querySelector('#qa-status'),ui={page:'aura',auraBatch:1,forgeOnlineActive:true};let state,revision=0,last;
const toast=text=>{document.querySelector('#toast').textContent=text;document.querySelector('#toast').classList.add('show');};
function render(){if(!state)return;document.documentElement.classList.toggle('reduced-motion',!state.settings.motion);app.innerHTML=renderApp(state,ui);app.querySelectorAll('[data-nav]').forEach(el=>el.disabled=true);}
function modal(html,cls=''){overlay.innerHTML=`<div class="modal-backdrop"><section class="modal empire-modal ${cls}" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">${html}</section></div>`;app.inert=true;overlay.querySelector('section').focus();}
function close(){overlay.innerHTML='';app.inert=false;render();}
function applyCloud(data){state=data.state;revision=data.revision;status.textContent=`Local database revision ${revision} · Last request ${data.qaMs?.toFixed(1)||'0'} ms · No production data touched.`;}
async function send(body){const response=await fetch('/qa/command',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer local-fixture-only'},body:JSON.stringify(body)});const data=E.decode(await response.text());if(!response.ok)throw Error(data.error);return data;}
const online={active:true,busy:false,async command(command,payload={}){if(this.busy)throw Error('A purchase is saving.');this.busy=true;ui.forgeBusy=true;last={command,payload,slot:'main',revision,requestId:crypto.randomUUID(),clientVersion:7};try{return await send(last);}finally{this.busy=false;ui.forgeBusy=false;}}};
connectAuraForge({state:()=>state,ui,online,applyCloud,render,modal,toast});
document.addEventListener('click',e=>{if(e.target.closest('[data-action="close"]'))close();});
async function load(){applyCloud(await send({command:'load',slot:'main',clientVersion:7}));render();}
for(const mode of ['starter','maximum','large-count'])document.querySelector('#qa-'+mode).onclick=async()=>{close();await fetch('/qa/reset',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode})});ui.auraBatch=1;ui.auraProbabilityRolls=1;await load();};
document.querySelector('#qa-retry').onclick=async()=>{if(!last)return;const data=await send(last);applyCloud(data);render();status.textContent+=' · Retried identical request; receipt reused.';};
document.querySelector('#qa-motion').onclick=()=>{state.settings.motion=!state.settings.motion;render();document.querySelector('#qa-motion').textContent=state.settings.motion?'Enable reduced-motion QA':'Disable reduced-motion QA';};
let beat=0;setInterval(()=>document.querySelector('#qa-heartbeat').textContent='UI heartbeat: '+(++beat),100);await load();
