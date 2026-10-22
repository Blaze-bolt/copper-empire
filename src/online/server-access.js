export const STATUS_INTERVAL=45000;
export const ACCESS_LEASE=60000;
const TOKEN_KEY='copper-testing-session';
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function maintenanceView(status={},error='',preview=false){
 status??={};
 const reopening=status.reopensAt?new Date(status.reopensAt):null;
 return `<main class="server-maintenance" aria-labelledby="maintenance-title"><div class="maintenance-card"><a class="maintenance-brand" href="#">Cu <span>Copper Empire</span></a><div class="maintenance-art" aria-hidden="true"><svg viewBox="0 0 120 100"><path d="M25 75V35l35-20 35 20v40L60 95Z"/><path d="m25 35 35 20 35-20M60 55v40"/><circle cx="60" cy="43" r="16"/><path d="m53 38 14 10m-14 0 14-10"/></svg><span class="maintenance-light"></span></div><p class="maintenance-eyebrow">WORKSHOP STATUS</p><h1 id="maintenance-title">Temporarily Unavailable</h1><p>Sorry! Copper Empire is currently undergoing maintenance or testing. We're working on improving the game. Please come back later.</p>${status.message?`<div class="maintenance-message">${escape(status.message)}</div>`:''}${reopening&&!Number.isNaN(reopening.getTime())?`<p class="maintenance-reopening">Expected reopening: <time datetime="${escape(reopening.toISOString())}">${escape(reopening.toLocaleString())}</time><small>Estimate only. The owner reopens the workshop.</small></p>`:''}<p class="maintenance-saved">Your account and progress are safe. You can stay signed in.</p>${error?`<p class="maintenance-error" role="alert">${escape(error)}</p>`:''}<form data-maintenance-form="unlock"><label for="testing-access-code">Testing access code</label><div class="maintenance-unlock"><input id="testing-access-code" name="code" type="password" autocomplete="off" minlength="10" maxlength="128" placeholder="Enter a testing code" required><button class="button primary" type="submit">Unlock Access</button></div><small>This temporary testing code is separate from your account password.</small></form><div class="maintenance-actions"><button type="button" class="button secondary" data-maintenance="retry">Retry / Check Status</button><button type="button" class="quiet-button" data-maintenance="export">Export my local save</button><button type="button" class="quiet-button" data-maintenance="cloud-export">Export my cloud save</button></div><details class="maintenance-account"><summary>Account sign-in & recovery</summary><form data-maintenance-form="signin"><label>Email<input name="email" type="email" autocomplete="username" required></label><label>Account password<input name="password" type="password" autocomplete="current-password" required></label><button class="button secondary" type="submit">Sign in</button><button class="quiet-button" type="button" data-maintenance="reset">Email a password reset</button></form><p>Open your newest recovery link on the same browser. Password changes remain available during maintenance.</p><form data-maintenance-form="password" hidden><label>New password<input name="password" type="password" autocomplete="new-password" minlength="8" required></label><label>Confirm password<input name="confirmation" type="password" autocomplete="new-password" minlength="8" required></label><button class="button secondary" type="submit">Save new password</button></form></details>${preview?'<button class="button secondary" type="button" data-maintenance="close-preview">Close preview</button>':''}<div class="maintenance-status" role="status" aria-live="polite">${status.serverTime?'Status checked '+escape(new Date(status.serverTime).toLocaleTimeString()):'Checking server access…'}</div></div></main>`;
}
export class ServerAccess {
 constructor({request,storage=globalThis.sessionStorage,now=Date.now,onChange=()=>{}}){Object.assign(this,{request,storage,now,onChange});this.status=null;this.checkedAt=0;this.error='';this.pending=null;this.preview=false;this.token=storage?.getItem(TOKEN_KEY)||null;}
 get blocked(){return this.preview||!this.status||this.now()-this.checkedAt>=ACCESS_LEASE||this.status.enabled&&!this.status.allowed||this.status.enabled&&this.status.tester&&!this.status.owner&&this.status.expiresAt<=this.now()+(this.status.serverTime-this.checkedAt);}
 async check({force=false}={}){if(this.pending){if(force){await this.pending;return this.check();}return this.pending;}this.pending=(async()=>{try{this.status=await this.request({command:'server-status'});this.checkedAt=this.now();this.error='';if(!this.status.tester&&this.token){this.token=null;this.storage?.removeItem(TOKEN_KEY);}}catch{this.error='Server status is unavailable. Your local progress is preserved. Please check again.';}finally{this.pending=null;this.onChange();}return this.status;})();return this.pending;}
 async unlock(code){const result=await this.request({command:'testing-unlock',code});if(result.error)throw Error(result.error);if(!/^[a-f0-9]{64}$/.test(result.token||''))throw Error('Testing access was not confirmed.');this.token=result.token;this.storage?.setItem(TOKEN_KEY,this.token);this.status=result.status;this.checkedAt=this.now();this.error='';this.onChange();}
 reject(status){if(status){this.status=status;this.checkedAt=this.now();}else{this.status={...(this.status||{}),enabled:true,allowed:false,owner:false,tester:false};}this.onChange();}
 forget(){this.token=null;this.storage?.removeItem(TOKEN_KEY);this.status=null;this.checkedAt=0;return this.check();}
}
export function connectServerAccess({online,unified,save,paused,render,reopen=()=>{},exportLocal,exportCloud,document:doc=document}){
 const root=doc.createElement('div');root.id='server-access-root';doc.body.append(root);let wasBlocked=false,busy=false,lastView='';
 const access=new ServerAccess({request:body=>online.rawApi(body),onChange:reconcile});online.serverAccess=access;
 function reconcile(){
  const blocked=access.blocked;unified.suspended=blocked;
  if(blocked&&!wasBlocked){paused();save();}
  const opening=wasBlocked&&!blocked;wasBlocked=blocked;doc.body.classList.toggle('server-closed',blocked);
  for(const id of ['app','overlay-root']){const el=doc.getElementById(id);if(el)el.hidden=blocked;}
  if(!blocked){root.replaceChildren();lastView='';if(opening){render();reopen();}return;}
  const view=maintenanceView(access.preview?access.previewStatus:access.status,access.error,access.preview);
  if(view!==lastView){const focused=root.contains(doc.activeElement)&&!!doc.activeElement.closest('form,details'),focusTitle=!root.firstElementChild||doc.activeElement?.id==='maintenance-title';if(!focused||access.error||!root.firstElementChild){root.innerHTML=view;lastView=view;if(focusTitle){const title=root.querySelector('h1');title?.setAttribute('tabindex','-1');title?.focus();}}}
  const recovery=root.querySelector('[data-maintenance-form="password"]');if(recovery)recovery.hidden=!online.recovering;
 }
 const allowed=target=>root.contains(target)||online.serverAccess.status?.owner&&!!target.closest?.('#owner-admin-root');
 // Capture before every existing delegated gameplay listener, including touch and keyboard.
 for(const type of ['click','keydown','keyup','pointerdown','pointermove','pointerup','change','input','drop','dragstart','submit'])doc.addEventListener(type,event=>{if(access.blocked&&!allowed(event.target)){event.preventDefault();event.stopImmediatePropagation();}},true);
 root.addEventListener('click',async event=>{const action=event.target.closest('[data-maintenance]')?.dataset.maintenance;if(!action||busy)return;busy=true;
  try{if(action==='retry')await access.check();if(action==='export')exportLocal();if(action==='cloud-export')await exportCloud();if(action==='close-preview'){access.preview=false;reconcile();}if(action==='reset'){const email=root.querySelector('[name="email"]').value;await online.reset(email);access.error='If this email is registered, check your newest recovery email.';reconcile();}}
  catch(e){access.error=e.message;reconcile();}finally{busy=false;}
 });
 root.addEventListener('submit',async event=>{event.preventDefault();if(busy)return;busy=true;const form=event.target,kind=form.dataset.maintenanceForm;for(const b of form.querySelectorAll('button'))b.disabled=true;
  try{if(kind==='unlock')await access.unlock(form.elements.code.value);if(kind==='signin'){await online.signIn(form.elements.email.value,form.elements.password.value);await access.check({force:true});render();}if(kind==='password'){await online.password(form.elements.password.value,form.elements.confirmation.value);access.error='Password saved. You can sign in with it.';reconcile();}}
  catch(e){access.error=e.message;lastView='';reconcile();}finally{form.reset();busy=false;for(const b of form.querySelectorAll('button'))b.disabled=false;}
 });
 access.reconcile=reconcile;reconcile();
 const poll=setInterval(()=>{reconcile();if(!doc.hidden)void access.check();},STATUS_INTERVAL);
 doc.addEventListener('visibilitychange',()=>{if(!doc.hidden){reconcile();void access.check();}});
 window.addEventListener('online',()=>void access.check());window.addEventListener('offline',()=>{access.checkedAt=0;reconcile();});
 access.dispose=()=>clearInterval(poll);return access;
}
