import {AURA_TIERS,AURA_ROLL_COST,auraById,exactCount} from './aura-data.js';
import {auraResultView} from './aura-ui.js';
import {money} from './data.js';
import {equipAura,encode,decode,rollAuras,buyAuraCapacity,checkAchievements} from './state.js';
import {settleAuraBatch} from './aura-forge.js';
export function sampleInWorker(quantity){return new Promise((resolve,reject)=>{const worker=new Worker(new URL('./aura-worker.js',import.meta.url),{type:'module'});const timeout=setTimeout(()=>{worker.terminate();reject(Error('Aura sampling timed out. No money was spent.'));},30000);worker.onmessage=event=>{clearTimeout(timeout);worker.terminate();if(event.data.error)reject(Error(event.data.error));else resolve(event.data.counts);};worker.onerror=()=>{clearTimeout(timeout);worker.terminate();reject(Error('The aura worker could not start. No money was spent.'));};worker.postMessage({quantity});});}
export function connectAuraForge({state,ui,online,applyCloud,render,modal,toast,save=()=>{},commitLocal,document:doc=document,music}){
 let pending=false;
 async function action(name,el){
  if(name==='skip'){doc.querySelector('.forge-result')?.classList.add('forge-skip');return;}
  if(pending)return;
  if(name==='select'){ui.auraBatch=Number(el.dataset.quantity);ui.auraProbabilityRolls=ui.auraBatch;render();return;}
  if(name==='last'){if(state().auraForge.lastBatch)modal(auraResultView(state().auraForge.lastBatch),'result-modal forge-modal');return;}
  const quantity=Number(el.dataset.quantity||ui.auraBatch||1);
  if(name==='roll'&&quantity>=100000){modal(`<div class="result-screen"><div class="modal-eyebrow">REVIEW YOUR PURCHASE</div><h2 id="modal-title">Forge ${exactCount(quantity)} auras?</h2><p>${exactCount(quantity)} independent rolls × $100 = <strong>${money(BigInt(quantity)*AURA_ROLL_COST)}</strong>.</p><p>Available: ${money(state().money,true)}. Rare auras remain uncertain; no minimum rarity is guaranteed.</p><button class="button primary full" data-forge="confirm-roll" data-quantity="${quantity}">Confirm purchase</button><button class="quiet-button" data-action="close">Keep my money</button></div>`,'result-modal');return;}
  const command=name==='capacity'?'aura-capacity':name==='roll'||name==='confirm-roll'?'aura-roll':name==='unequip'?'aura-unequip':name==='equip'?'equip-aura':null;if(!command)return;
  if(!online.active&&command==='aura-roll'){const s=state();if(s.rebirth<2||!AURA_TIERS.includes(quantity)||quantity>AURA_TIERS[s.auraForge.tier]){toast('Select an unlocked batch quantity.');return;}if(s.money<BigInt(quantity)*AURA_ROLL_COST){toast('Insufficient money.');return;}}
  pending=true;ui.forgePending=true;render();
  doc.querySelectorAll('[data-forge="confirm-roll"]').forEach(b=>b.disabled=true);
  try{let data;if(online.active){data=await online.command(command,command==='aura-capacity'?{tier:Number(el.dataset.tier)}:command==='aura-roll'?{quantity}:{id:el.dataset.id});applyCloud(data);}else{const next=decode(encode(state()));let result;if(command==='aura-capacity')result=buyAuraCapacity(next,Number(el.dataset.tier));else if(command==='aura-roll'){if(quantity>=100000&&typeof Worker!=='undefined')result=settleAuraBatch(next,quantity,await sampleInWorker(quantity));else result=rollAuras(next,quantity);}else equipAura(next,command==='aura-unequip'?null:el.dataset.id);const before=new Set(next.achievements);checkAchievements(next);if(result?.counts)result.achievements=next.achievements.filter(id=>!before.has(id));if(commitLocal)commitLocal(next);else{const previous=decode(encode(state()));Object.assign(state(),next);try{save();}catch(error){Object.assign(state(),previous);throw error;}}data={result,state:next};}render();if(command==='aura-roll'){music?.cue(auraById(data.result.best).index>=4?'rare':'aura');modal(auraResultView(data.result),'result-modal forge-modal');}else toast(command==='aura-capacity'?'Permanent capacity upgraded to '+exactCount(AURA_TIERS[data.result.tier])+' rolls.':command==='aura-unequip'?'Aura unequipped.':'Aura equipped. Its workshop ability is active.');}
  catch(error){toast(error.message||'Purchase not completed. Check Account & Cloud before retrying.');}
  finally{pending=false;ui.forgePending=false;render();doc.querySelectorAll('[data-forge="confirm-roll"]').forEach(b=>b.disabled=false);}
 }
 doc.addEventListener('click',event=>{const el=event.target.closest?.('[data-forge]');if(el)void action(el.dataset.forge,el);});
 doc.addEventListener('change',event=>{const el=event.target,key=el.dataset?.forgeField;if(!key)return;if(key==='sort')ui.auraSort=el.value;if(key==='probability')ui.auraProbability=el.value;if(key==='trials'){const n=Number(el.value);if(!Number.isSafeInteger(n)||n<1||n>100000000){toast('Enter a whole number from 1 to 100,000,000.');el.value=ui.auraProbabilityRolls||ui.auraBatch||1;return;}ui.auraProbabilityRolls=n;}render();});
 return {action};
}
