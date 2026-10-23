import {editSave} from './admin-editor.js';
import {mergeTutorials} from '../../src/empire/tutorial-state.js';
import * as E from '../../src/empire/state.js';
import {validateSnapshot,compactState,candidate,selectMigration,applyPatch,anomalyFlags,validateLockedTrade} from '../../src/unified/save.js';
import {pack,unpack,transition} from './service.js';

const economicCommands=new Set(['trade','sell-ingots','sell-refined','ship-buy','port-upgrade','trade-agreement','export-accept','ship-dispatch','ship-cancel','trade-refresh','loading-plan','loading-plan-delete','heartbeat','resolve-copy','owner-edit']);
const requestIdentity=body=>{if(!/^[0-9a-f-]{36}$/i.test(body.requestId||'')||!Number.isSafeInteger(body.revision)||body.revision<0)throw Error('Invalid snapshot request identity.');};
const decodeLoad=raw=>unpack(raw);

export async function handleUnified(db,user,body,now=Date.now()){
 if(body.slot&&body.slot!=='main')throw Error('Unified snapshots cannot target Debug.');
 if(Number(body.clientVersion)<8)throw Error('UPDATE_REQUIRED: Reload for the unified workshop.');
 if(body.command==='unified-debug-copy'){if(body.confirm!==true)throw Error('Confirm replacing Debug.');return db.rpc('empire_unified_debug_copy',{p_owner:user,p_expected:body.debugRevision});}
 if(body.command==='unified-recovery')return db.rpc('empire_unified_recovery',{p_user:user,p_id:body.id});
 if(body.command==='unified-moderate'){if(!/^[0-9a-f-]{36}$/i.test(body.user||''))throw Error('Invalid target account.');return db.rpc('empire_unified_moderate',{p_owner:user,p_user:body.user,p_exclude:body.exclude===true});}
 const loaded=decodeLoad(await db.rpc('empire_unified_load',{p_user:user}));
 if(body.command==='unified-load')return pack(loaded);
 if(Number(body.clientVersion||0)<9)throw Error('UPDATE_REQUIRED: Reload to preserve the Stage Compression reset policy before synchronizing. Your original save is retained.');
 requestIdentity(body);const receipt=await db.rpc('empire_unified_receipt',{p_user:user,p_request:body.requestId});if(receipt)return receipt;
 const old=loaded.current;if((old?.revision??0)!==body.revision)throw Error('SAVE_CONFLICT: Another device synchronized. Review both copies.');
 let s,result=null,trade=null,worldGate=null;const archives=[];let kind;
 if(body.command==='unified-migrate'){
  if(old||body.confirm!==true||body.sourceToken!==loaded.token)throw Error('SAVE_CONFLICT: Review migration and confirm the current sources.');
  const choices=[candidate('device',unpack(body.state),body.meta)];
  for(const[source,row]of [['legacy-main',loaded.legacyMain],['cloud-backup',loaded.legacyBackup]])if(row?.state)try{choices.push(candidate(source,row.state,row.meta||{}));}catch{/* Invalid originals remain in their old tables and are reported by the client. */}
  const selection=selectMigration(choices);if(!selection.eligible.includes(body.source))throw Error('Migration must respect Ascension first, then Rebirth.');
  s=validateSnapshot(choices.find(c=>c.source===body.source).state);mergeTutorials(s,...choices.map(c=>c.state));
  for(const c of choices)archives.push({source:c.source,state:pack(c.state),meta:pack(c.meta)});
  // Old local vessels become bound to the same account, without changing their
  // identity, cargo, locked rate, payment, or travel timestamps.
  for(const ship of s.trade.ships)ship.owner=user;for(const shipment of s.trade.shipments)shipment.owner=user;
  kind='migration';
 }else if(body.command==='unified-sync'){
  if(!old)throw Error('Reconcile saves before synchronization.');s=validateSnapshot(unpack(body.state));validateLockedTrade(old.state,s);kind='sync';
 }else if(body.command==='unified-economic'){
  if(!old||!economicCommands.has(body.economic))throw Error('Unknown unified economic command.');
  s=applyPatch(old.state,unpack(body.patch));validateLockedTrade(old.state,s);kind='economic';
  const quotes=await db.rpc('empire_quotes');Object.assign(s.market,quotes.copper);s.market.global=true;Object.assign(s.goldMarket,quotes.gold);
  const p=body.payload||{};if(body.economic==='resolve-copy'){if(p.confirm!==true)throw Error('Confirm the divergent save replacement.');}
  else if(body.economic==='owner-edit'){const status=await db.rpc('empire_admin_status',{p_user:user});if(!status.owner||p.confirm!==true)throw Error('OWNER_ONLY: Confirm this owner edit.');s=editSave(s,p.edit||{}).state;}else{
   const context={user,feesBefore:s.industry.stats.fees};if(['ship-dispatch','export-accept','heartbeat','trade-refresh'].includes(body.economic))context.world=unpack(await db.rpc('empire_export_world'));
   const changed=transition(s,null,body.economic,p,now,context);s=changed.state;result=changed.result;trade=changed.trade;worldGate=changed.worldGate;
  }
 }else throw Error('Unknown unified command.');
 // Completion is monotonic, even when a previous client or a conflict resolution
 // selects a coherent older workshop. No balance or gameplay domain is merged.
 if(old)mergeTutorials(s,old.state);
 s=compactState(s);const meta={...body.meta,schema:1,ownerId:user,migrated:true};
 if(typeof meta.root!=='string'||!Array.isArray(meta.lineage)||meta.lineage.length>32||!meta.lineage.every(x=>typeof x==='string'&&x.length<=64))throw Error('Invalid save ancestry.');
 if(old&&meta.parent!==old.meta.id)throw Error('STALE_ANCESTRY: Reconcile against the current cloud snapshot.');
 const flags=anomalyFlags(old?.state,s,Math.max(0,now-(old?.updatedAt||now)));if(body.economic==='owner-edit')flags.push('owner_modified');
 return db.rpc('empire_unified_commit',{p_user:user,p_request:body.requestId,p_expected:body.revision,p_state:pack(s),p_meta:meta,p_result:pack(result),p_kind:kind,p_token:body.sourceToken||null,p_archives:archives,p_quote:trade?.quote??null,p_volume:trade?.volume?.toString()||'0',p_asset:trade?.asset||'copper',p_world:worldGate?.version??null,p_news:worldGate?.newsVersion??null,p_flags:flags});
}
