import * as E from '../../src/empire/state.js';
import {handleCommand,pack,storedState} from './service.js';
import {editSave,validateMarketConfig,marketDefaults,priceInteger,MARKET_EVENTS} from './admin-editor.js';
const slotOf=body=>{const slot=body.slot??'main';if(!['main','debug'].includes(slot))throw Error('Unknown save slot.');return slot;};
const identity=body=>{if(!/^[0-9a-f-]{36}$/i.test(body.requestId||'')||!Number.isSafeInteger(body.revision)||body.revision<0)throw Error('Invalid request identity.');};
export async function loadSlot(db,user,slot){const data=await db.rpc('empire_slot_load',{p_user:user,p_slot:slot,p_initial:storedState(E.newState())});E.migrateAttempt(data.attempt);data.state=pack(E.expansionDefaults(E.decode(JSON.stringify(data.state))));const quotes=await db.rpc('empire_quotes',{});Object.assign(data.state.market,quotes.copper);Object.assign(data.state.goldMarket,quotes.gold);return data;}
export async function handleWorkshop(db,user,body,now=Date.now()){
 const slot=slotOf(body);
 if(body.command==='admin-status')return db.rpc('empire_admin_status',{p_user:user});
 if(body.command==='admin-market'||body.command==='admin-save'){
  identity(body);const status=await db.rpc('empire_admin_status',{p_user:user});if(!status.owner)throw Error('OWNER_ONLY: This action is restricted to the provisioned owner.');
  const p=body.payload||{};
  try{
   if(body.command==='admin-market'){
    if(!['copper','gold'].includes(p.asset))throw Error('Unknown market asset.');let action=p.action,payload={};
    if(action==='defaults'){if(p.confirm!==true)throw Error('Confirm restoring market defaults.');action='config';payload=marketDefaults(p.asset);}
    else if(action==='config')payload=validateMarketConfig(p.config);
    else if(['adjust','set'].includes(action))payload={value:priceInteger(p.value,action==='adjust')};
    else if(action==='event'){if(!MARKET_EVENTS[p.id])throw Error('Unknown market event.');payload={id:p.id};}
    else if(action!=='cancel')throw Error('Unknown market command.');
    if(!Number.isSafeInteger(p.expectedVersion)||p.expectedVersion<0)throw Error('Refresh the market configuration.');
    const result=await db.rpc('empire_admin_market',{p_user:user,p_request:body.requestId,p_asset:p.asset,p_action:action,p_payload:payload,p_expected:p.expectedVersion,p_confirm:p.confirm===true});
    return {result,admin:await db.rpc('empire_admin_status',{p_user:user})};
   }
   await loadSlot(db,user,'main');await loadSlot(db,user,'debug');
   let state=null,details={};const action=p.action;
   // Repeated edits must reach the SQL receipt before deriving a new changed state.
   const loaded=await loadSlot(db,user,slot);
   if(action==='edit'){const edited=editSave(E.decode(JSON.stringify(loaded.state)),p.edit||{});state=storedState(edited.state);details=pack(edited.details);}
   else if(action==='reset-debug')state=storedState(E.newState());
   else if(action==='switch')details={target:p.target};
   else if(!['copy','restore-main'].includes(action))throw Error('Unknown save administration command.');
   if(action==='copy'&&!Number.isSafeInteger(p.otherRevision))throw Error('Refresh both workshop revisions before copying.');
   const result=await db.rpc('empire_admin_save',{p_user:user,p_request:body.requestId,p_action:action,p_slot:slot,p_expected:body.revision,p_other_expected:p.otherRevision??0,p_state:state,p_details:details,p_confirm:p.confirm===true});
   return {...await loadSlot(db,user,result.slot),admin:await db.rpc('empire_admin_status',{p_user:user})};
  }catch(error){await db.rpc('empire_admin_error',{p_user:user,p_request:crypto.randomUUID(),p_message:String(error.message).slice(0,512)}).catch(()=>{});throw error;}
 }
 if(body.command==='load')return loadSlot(db,user,slot);
 // Route the existing, fully verified gameplay engine through the selected persistent slot.
 const routed={rpc:async(name,args)=>{
  if(name==='empire_load')return db.rpc('empire_slot_load',{...args,p_slot:slot});
  if(name==='empire_receipt')return db.rpc('empire_slot_receipt',{...args,p_slot:slot});
  if(name==='empire_commit_asset'&&slot==='debug'){const {p_volume,...rest}=args;return db.rpc('empire_debug_commit',rest);}
  return db.rpc(name,args);
 }};
 if(slot==='debug'){const status=await db.rpc('empire_admin_status',{p_user:user});if(!status.owner)throw Error('OWNER_ONLY: Debug Workshop is restricted to the owner.');}
 const data=await handleCommand(routed,user,body,now);return {...data,slot,classification:data.classification|| (slot==='debug'?'debug':'verified')};
}
