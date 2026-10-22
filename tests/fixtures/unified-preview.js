import * as E from '../../src/empire/state.js';
const key='qa-unified-fixture-booted';if(!sessionStorage.getItem(key)){const seed=await (await fetch('/qa/seed')).text();localStorage.setItem(E.SAVE_KEY,seed);sessionStorage.setItem(key,'yes');}
const toolbar=document.createElement('aside');toolbar.id='unified-qa-toolbar';toolbar.style='position:fixed;bottom:4px;left:5px;right:5px;z-index:9999;padding:8px;background:#2d473b;color:white;border:1px solid #78aa88;font-size:12px;display:flex;gap:8px;align-items:center;flex-wrap:wrap';
toolbar.innerHTML='<strong>DISPOSABLE LOCAL QA · No production saves</strong><button id="qa-reset">Reset guest fixture</button><button id="qa-maximum">Maximum batch guest fixture</button><button id="qa-connect">Connect synthetic account</button><button id="qa-offline">Simulate offline</button><button id="qa-online">Reconnect</button><button id="qa-clock" data-offset="0">Advance sync clock 15 minutes</button>';
document.body.append(toolbar);
toolbar.querySelector('#qa-reset').onclick=async()=>{await fetch('/qa/reset',{method:'POST'});localStorage.clear();sessionStorage.clear();location.reload();};
toolbar.querySelector('#qa-maximum').onclick=async()=>{await fetch('/qa/reset',{method:'POST'});const seed=await(await fetch('/qa/seed?maximum=1')).text();localStorage.clear();sessionStorage.clear();localStorage.setItem(E.SAVE_KEY,seed);sessionStorage.setItem(key,'yes');location.hash='aura';location.reload();};
toolbar.querySelector('#qa-connect').onclick=()=>{sessionStorage.setItem('qa-auth','on');location.reload();};
toolbar.querySelector('#qa-offline').onclick=()=>window.dispatchEvent(new Event('offline'));
toolbar.querySelector('#qa-online').onclick=()=>window.dispatchEvent(new Event('online'));
toolbar.querySelector('#qa-clock').onclick=event=>{event.target.dataset.offset=String(Number(event.target.dataset.offset)+900000);};
await import('../../src/empire/app.js');
