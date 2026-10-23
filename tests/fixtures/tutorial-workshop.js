import {OnlineWorkshop}from'../../src/online/client.js';
import {decode}from'../../src/empire/state.js';
// A separate localhost origin, with network/account operations unavailable.
OnlineWorkshop.prototype.init=async function(){this.initializing=false;};
OnlineWorkshop.prototype.rawApi=async function(body){if(body.command==='server-status')return{enabled:false,allowed:true,serverTime:Date.now()};throw Error('No backend in the disposable tutorial fixture.');};
await import('../../src/empire/app.js');
setInterval(()=>{const raw=localStorage.getItem('copper-unified-v1'),doc=raw?decode(raw):null;document.querySelector('#qa-workshop-report').textContent=JSON.stringify({seen:doc?.state.tutorials?.completed,attempt:doc?.state.unifiedAttempt?.attempt.status,realElapsed:doc?.state.unifiedAttempt?.game?.elapsed??null,copper:String(doc?.state.copper[0]??0n)});},250);
