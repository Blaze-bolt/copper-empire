import {candidate,clone,validateSnapshot} from './save.js';
import {mergeTutorials} from '../empire/tutorial-state.js';
import {saveComparison,conflictView} from './ui.js';
import {money,copper} from '../empire/data.js';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function connectUnifiedUI({unified:u,online:o,modal,close,render,toast,state,document:doc=document}){
 let running=false,recovery;
 const show=()=>{if(u.plan)modal(saveComparison(u.plan),'result-modal unified-modal');else if(u.conflict)modal(conflictView(),'result-modal');else toast('No unresolved save conflicts.');};
 doc.addEventListener('click',async event=>{const el=event.target.closest?.('[data-sync]');if(!el||running)return;const action=el.dataset.sync;running=true;el.disabled=true;
  try{
   if(o.active)throw Error('Return from Debug before changing the Unified Workshop.');
   if(action==='now'){if(!u.online)throw Error('You are offline. Your local progress is preserved; reconnect to sync.');const accepted=await u.sync({manual:true});if(accepted){o.rankingsNextPoll=0;await o.pollRankings();toast(u.doc.dirty?'Newer local changes are still pending.':'Cloud synchronization accepted.');}else toast(u.doc.dirty?'Synchronization is pending. Review the save status before continuing.':'No changes to upload. Your latest accepted cloud copy is current.');}
   if(action==='connect'){await u.connect();show();}
   if(action==='review')show();
   if(action==='choose'){const source=el.dataset.source;if(u.plan?.kind==='resolution')await u.resolveConflict(source);else if(u.plan?.kind==='tab'){
    const previous=clone(state()),other=u.readDisk();if(!other)throw Error('The other copy is unavailable; export this save first.');mergeTutorials(previous,other.state);mergeTutorials(other.state,previous);u.doc=other;u.archive('Alternate tab',previous);if(source==='device')u.importSave(previous,'Other tab before confirmed replacement');else u.apply(validateSnapshot(other.state));u.conflict=null;u.plan=null;u.persistDocument({...u.doc});
   }else await u.choose(source);close();render();toast('Selected workshop preserved and connected. Alternatives remain recoverable.');}
   if(action==='conflict-review'){
    if(u.conflict?.kind==='tab'||u.conflict?.kind==='storage'){const other=u.readDisk();u.plan={kind:'tab',candidates:[candidate('device',state(),u.doc),candidate('other-tab',other.state,other)],eligible:['device','other-tab'],reason:'Both browser tabs contain changes. Explicitly choose the complete copy to keep; the other is archived.'};}
    else{const loaded=await u.request({command:'unified-load'});u.remote=loaded;u.plan={kind:'resolution',candidates:[candidate('device',state(),u.doc),candidate('cloud',loaded.current.state,loaded.current.meta)],eligible:['device','cloud'],reason:'Concurrent saves require an explicit choice. Ascension priority cannot silently replace a newer accepted transaction.'};}show();
   }
   if(action==='retry'){if(u.doc.pending?.command==='unified-migrate'){await u.connect();show();}else await u.retry();}
   if(action==='recoveries'){
    let remote=[];if(o.session&&u.online){const loaded=await u.request({command:'unified-load'});remote=loaded.recoveries||[];}
    modal(`<div class="result-screen"><h2 id="modal-title">Recovery copies</h2><p>Restoring creates another local recovery copy and requires a separate confirmation. It never automatically overwrites the cloud.</p>${u.doc.recoveries.map(r=>`<button class="button secondary" data-sync="recovery-review" data-local="${esc(r.id)}">${esc(r.label)} · A${r.state.ascension.level} / R${r.state.rebirth}</button>`).join('')}${remote.map(r=>`<button class="button secondary" data-sync="recovery-review" data-remote="${esc(r.id)}">${esc(r.source)} · A${r.ascension} / R${r.rebirth}</button>`).join('')}<button class="quiet-button" data-action="close">Keep current workshop</button></div>`,'result-modal');
   }
   if(action==='recovery-review'){recovery=el.dataset.local?u.doc.recoveries.find(r=>r.id===el.dataset.local):await u.request({command:'unified-recovery',id:el.dataset.remote});if(!recovery?.state)throw Error('Recovery was not found for this account.');const s=validateSnapshot(recovery.state);modal(`<div class="result-screen"><h2 id="modal-title">Restore this complete copy?</h2><p>A${s.ascension.level} · R${s.rebirth} · ${money(s.money,true)} · ${copper(s.copper.reduce((a,b)=>a+b,0n))}</p><p>Current: A${state().ascension.level} · R${state().rebirth}. The current copy is retained. Any cloud conflict must still be resolved explicitly.</p><button class="button primary" data-sync="recovery-confirm">Confirm local recovery</button><button class="quiet-button" data-action="close">Cancel</button></div>`,'result-modal');}
   if(action==='recovery-confirm'){if(!recovery)throw Error('Review a recovery first.');u.importSave(recovery.state,'Before recovery restore');recovery=null;close();}
   if(action==='exclude'||action==='reinstate'){const username=doc.querySelector('#moderate-username').value.trim().replace(/^@/,'').toLowerCase();const result=await o.client.from('empire_profiles').select('id').eq('username',username).single();if(result.error)throw Error('Account not found.');await u.request({command:'unified-moderate',user:result.data.id,exclude:action==='exclude'});toast('Ranking moderation saved.');}
   render();
  }catch(error){toast(error.message);u.error=error.message;render();}finally{running=false;el.disabled=false;}
 });
 return {show};
}
