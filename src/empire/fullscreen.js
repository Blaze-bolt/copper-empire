import {icon} from '../art.js';

// Fullscreen is a display preference, never a workshop/save transaction.
export function createFullscreenControl(doc,notify=()=>{}) {
  let pending=false;
  const active=()=>Boolean(doc.fullscreenElement||doc.webkitFullscreenElement);
  const supported=()=>doc.documentElement.requestFullscreen?doc.fullscreenEnabled!==false:
    Boolean(doc.documentElement.webkitRequestFullscreen)&&doc.webkitFullscreenEnabled!==false;
  function sync() {
    const enabled=active(),available=supported();
    for(const button of doc.querySelectorAll('[data-fullscreen]')) {
      const label=available?(enabled?'Exit fullscreen':'Enter fullscreen'):'Fullscreen unavailable in this browser';
      button.setAttribute('aria-label',label);
      button.setAttribute('title',enabled?label+' (Esc)':label);
      button.setAttribute('aria-pressed',String(enabled));
      button.disabled=pending||!available;
      button.innerHTML=icon(enabled?'collapse':'expand');
    }
  }
  async function toggle() {
    if(pending||!supported())return;
    pending=true;
    sync();
    try {
      if(active()) {
        const exit=doc.exitFullscreen||doc.webkitExitFullscreen;
        if(!exit)throw Error('Fullscreen exit is unavailable.');
        await exit.call(doc);
      } else {
        const root=doc.documentElement;
        await (root.requestFullscreen||root.webkitRequestFullscreen).call(root);
      }
    } catch {
      notify('Fullscreen could not be changed. Please try again or use your browser’s fullscreen control.');
    } finally {
      pending=false;
      sync();
    }
  }
  doc.addEventListener('click',event=>{
    if(event.target.closest?.('[data-fullscreen]'))void toggle();
  });
  doc.addEventListener('fullscreenchange',sync);
  doc.addEventListener('webkitfullscreenchange',sync);
  return {sync,toggle};
}
