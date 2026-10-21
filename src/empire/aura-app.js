import {AURA_TIERS,AURA_ROLL_COST,auraById,exactCount} from './aura-data.js';
import {auraResultView} from './aura-ui.js';
import {money} from './data.js';
import {equipAura} from './state.js';
export function connectAuraForge({state,ui,online,applyCloud,render,modal,toast,save=()=>{},document:doc=document,music}){
 let pending=false;
 async function action(name,el){
  if(name==='skip'){doc.querySelector('.forge-result')?.classList.add('forge-skip');return;}
  if(pending)return;
  if(name==='select'){ui.auraBatch=Number(el.dataset.quantity);ui.auraProbabilityRolls=ui.auraBatch;render();return;}
  if(name==='last'){if(state().auraForge.lastBatch)modal(auraResultView(state().auraForge.lastBatch),'result-modal forge-modal');return;}
  if(!online.active){if(name==='equip'||name==='unequip'){equipAura(state(),name==='unequip'?null:el.dataset.id);save();render();toast('Local aura equipment updated.');return;}toast('Sign in and continue your online workshop to purchase aura rolls.');return;}
  const quantity=Number(el.dataset.quantity||ui.auraBatch||1);
  if(name==='roll'&&quantity>=100000){modal(`<div class="result-screen"><div class="modal-eyebrow">REVIEW YOUR PURCHASE</div><h2 id="modal-title">Forge ${exactCount(quantity)} auras?</h2><p>${exactCount(quantity)} independent rolls × $100 = <strong>${money(BigInt(quantity)*AURA_ROLL_COST)}</strong>.</p><p>Available: ${money(state().money,true)}. Rare auras remain uncertain; no minimum rarity is guaranteed.</p><button class="button primary full" data-forge="confirm-roll" data-quantity="${quantity}">Confirm purchase</button><button class="quiet-button" data-action="close">Keep my money</button></div>`,'result-modal');return;}
  const command=name==='capacity'?'aura-capacity':name==='roll'||name==='confirm-roll'?'aura-roll':name==='unequip'?'aura-unequip':name==='equip'?'equip-aura':null;if(!command)return;
  pending=true;ui.forgePending=true;render();
  doc.querySelectorAll('[data-forge="confirm-roll"]').forEach(b=>b.disabled=true);
  try{const data=await online.command(command,command==='aura-capacity'?{tier:Number(el.dataset.tier)}:command==='aura-roll'?{quantity}:{id:el.dataset.id});applyCloud(data);render();if(command==='aura-roll'){music?.cue(auraById(data.result.best).index>=4?'rare':'aura');modal(auraResultView(data.result),'result-modal forge-modal');}else toast(command==='aura-capacity'?'Permanent capacity upgraded to '+exactCount(AURA_TIERS[data.result.tier])+' rolls.':command==='aura-unequip'?'Aura unequipped.':'Aura equipped. Its workshop ability is active.');}
  catch(error){toast(error.message||'Purchase not completed. Check Account & Cloud before retrying.');}
  finally{pending=false;ui.forgePending=false;render();doc.querySelectorAll('[data-forge="confirm-roll"]').forEach(b=>b.disabled=false);}
 }
 doc.addEventListener('click',event=>{const el=event.target.closest?.('[data-forge]');if(el)void action(el.dataset.forge,el);});
 doc.addEventListener('change',event=>{const el=event.target,key=el.dataset?.forgeField;if(!key)return;if(key==='sort')ui.auraSort=el.value;if(key==='probability')ui.auraProbability=el.value;if(key==='trials'){const n=Number(el.value);if(!Number.isSafeInteger(n)||n<1||n>100000000){toast('Enter a whole number from 1 to 100,000,000.');el.value=ui.auraProbabilityRolls||ui.auraBatch||1;return;}ui.auraProbabilityRolls=n;}render();});
 return {action};
}
