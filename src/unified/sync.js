import * as E from '../empire/state.js';
import {UNIFIED_KEY,SYNC_INTERVAL,clone,compactState,validateSnapshot,candidate,selectMigration,sameSave,canonical,statePatch} from './save.js';
const uuid=()=>crypto.randomUUID();
const material=s=>{const copy=compactState(s);delete copy.stats.playtime;copy.market={upgrades:copy.market.upgrades,alert:copy.market.alert,limit:copy.market.limit,refreshAt:copy.market.refreshAt};copy.goldMarket={};delete copy.revision;return canonical(copy);};
export class UnifiedSync {
 constructor({storage,state,apply,api,account,notify=()=>{},now=Date.now,locks=globalThis.navigator?.locks}){Object.assign(this,{storage,state,apply,api,account,notify,now,locks});this.busy=false;this.online=true;this.connected=false;this.error='';this.retryAt=0;this.failures=0;this.conflict=null;this.plan=null;this.base=null;
  const raw=storage.getItem(UNIFIED_KEY);if(raw){this.doc=E.decode(raw);if(this.doc.schema!==1)throw Error('Unsupported unified save metadata.');const migrated=validateSnapshot(this.doc.state);if(compressionChanged(this.doc.state,migrated)){this.archive('Before Stage Compression reset migration',this.doc.state,this.doc);this.doc={...this.doc,state:migrated,id:uuid(),lineage:[this.doc.id,...this.doc.lineage].slice(0,32),dirty:true,generation:this.doc.generation+1,lastLocal:this.now()};storage.setItem(UNIFIED_KEY,E.encode(this.doc));}}else this.doc={schema:1,id:uuid(),root:uuid(),lineage:[],ownerId:null,cloudRevision:0,lastLocal:0,lastSync:0,dirty:true,generation:0,migrated:false,state:clone(state()),recoveries:[]};
  this.online=globalThis.navigator?.onLine!==false;this.lastMaterial=material(state());this.nextSync=this.doc.lastSync+SYNC_INTERVAL;this.device=storage.getItem('copper-device-id')||uuid();storage.setItem('copper-device-id',this.device);
 }
 get status(){if(this.suspended)return 'Maintenance · local changes preserved';if(this.conflict||this.plan)return 'Save conflict detected';if(!this.online)return 'Offline';if(this.busy)return 'Syncing';if(this.error)return 'Sync failed';if(this.doc.dirty)return this.account()?'Unsynced changes':'Saved locally';return this.connected?'Cloud synced':'Saved locally';}
 get locked(){return this.economicPending||!!this.pending?.economic||!!this.doc.pending?.economic;}
 persistDocument(doc){const old=this.storage.getItem(UNIFIED_KEY);if(old){const current=E.decode(old);if(current.id!==this.doc.id)throw Error('TAB_CONFLICT: Another tab saved progress. Review both copies before continuing.');}this.storage.setItem(UNIFIED_KEY,E.encode(doc));this.doc=doc;}
 save(next=this.state(),force=false){const meaningful=material(next);if(!force&&meaningful===this.lastMaterial)return false;const previous=clone(this.doc);const doc={...this.doc,state:clone(next),id:uuid(),lineage:[this.doc.id,...this.doc.lineage].slice(0,32),dirty:true,generation:this.doc.generation+1,lastLocal:this.now()};
  try{this.persistDocument(doc);}catch(error){this.conflict={kind:'storage',local:clone(next),other:this.readDisk(),message:error.message};this.notify();throw error;}
  this.lastMaterial=meaningful;this.notify();return previous.id!==doc.id;
 }
 readDisk(){try{return E.decode(this.storage.getItem(UNIFIED_KEY)||'null');}catch{return null;}}
 archive(label,state=this.state(),meta=this.doc){const r={id:uuid(),label,at:this.now(),state:clone(state),meta:{id:meta.id,root:meta.root,lineage:meta.lineage,cloudRevision:meta.cloudRevision,ownerId:meta.ownerId}};this.doc.recoveries=[r,...this.doc.recoveries].slice(0,6);return r;}
 async request(body){if(this.suspended&&!['unified-load','unified-recovery'].includes(body.command))throw Error('SERVER_LOCKDOWN: Your pending changes are preserved. Try again after reopening.');return this.api({...body,slot:'main',clientVersion:9});}
 async connect(){if(!this.account()||!this.online)return;this.save();if(this.doc.pending&&this.doc.ownerId===this.account()&&this.doc.pending.command!=='unified-migrate'){try{await this.retry();}catch{if(this.conflict)return;}}const loaded=await this.request({command:'unified-load'});this.remote=loaded;const uid=this.account();
  if(loaded.current&&this.doc.ownerId===uid&&this.doc.migrated){
   this.connected=true;const cloud=loaded.current;
   if(this.doc.cloudRevision===cloud.revision){this.base=clone(cloud.state);this.nextSync=this.now()+SYNC_INTERVAL;this.notify();return;}
   if(!this.doc.dirty&&this.doc.id===cloud.meta?.parent){await this.acceptRemote(cloud);return;}
   if(!this.doc.dirty){this.plan={kind:'continuation',candidates:[candidate('device',this.state(),this.doc),candidate('cloud',cloud.state,cloud.meta)],recommended:'cloud',eligible:['cloud'],reason:'The cloud has a newer accepted revision. Your device copy will be archived before replacement.'};this.notify();return;}
   this.conflict={kind:'cloud',local:clone(this.state()),remote:cloud,message:'Another device synchronized different progress. Both copies are preserved.'};this.notify();return;
  }
  const candidates=[candidate('device',this.state(),this.doc)];
  for(const[source,row]of [['cloud',loaded.current],['legacy-main',!loaded.current&&loaded.legacyMain],['cloud-backup',!loaded.current&&loaded.legacyBackup]])if(row?.state){try{candidates.push(candidate(source,row.state,row.meta||{}));}catch(error){this.invalidSources??=[];this.invalidSources.push({source,error:error.message});}}
  if(loaded.legacyBackup?.invalid){this.invalidSources??=[];this.invalidSources.push({source:'cloud-backup',error:'Unreadable original retained in cloud storage.'});}const selection=selectMigration(candidates);this.plan={kind:loaded.current?'reconcile':'migration',candidates,...selection};this.notify();
 }
 async acceptRemote(row){if(row.meta.ownerId!==this.account())throw Error('ACCOUNT_CHANGED: Sign back into the account that owns this response.');this.archive('Device before cloud continuation');const state=validateSnapshot(row.state),migrated=compressionChanged(row.state,state);const doc={...this.doc,...row.meta,schema:1,ownerId:this.account(),state:clone(state),cloudRevision:row.revision,syncedId:row.meta.id,lastSync:this.now(),lastLocal:this.now(),dirty:migrated,migrated:true,pending:null};if(migrated){doc.id=uuid();doc.lineage=[row.meta.id,...doc.lineage].slice(0,32);doc.generation++;}this.persistDocument(doc);this.apply(state);this.base=clone(state);this.connected=true;this.plan=null;this.conflict=null;this.error='';this.lastMaterial=material(state);this.nextSync=this.now()+SYNC_INTERVAL;this.notify();}
 async choose(source){if(this.busy)throw Error('A migration is already processing.');const plan=this.plan;if(!plan||!plan.eligible.includes(source))throw Error('Review the save with migration priority first.');const selected=plan.candidates.find(c=>c.source===source);if(plan.kind==='reconcile'){if(source==='cloud'){const fresh=await this.request({command:'unified-load'});if(fresh.current.revision!==this.remote.current.revision)throw Error('SAVE_CONFLICT: Cloud progress changed during review. Compare again.');return this.acceptRemote(fresh.current);}this.connected=true;return this.resolveConflict('device');}if(plan.kind==='continuation'){await this.acceptRemote(this.remote.current);return;}
  this.archive('Device before initial migration');const request={command:'unified-migrate',requestId:uuid(),revision:this.remote.current?.revision??0,source,state:clone(this.state()),meta:this.metadata(),confirm:true,sourceToken:this.remote.token};
  this.pending=request;this.writePending();this.busy=true;this.notify();try{const result=await this.request(request);await this.acceptRemote(result);this.plan=null;}catch(e){this.error=e.message;throw e;}finally{this.busy=false;this.notify();}
 }
 metadata(){return {schema:1,id:uuid(),parent:this.doc.syncedId||this.doc.id,root:this.doc.root,lineage:[this.doc.id,...this.doc.lineage].slice(0,32),ownerId:this.account(),device:this.device,migrated:true};}
 writePending(){const doc={...this.doc,pending:clone(this.pending)};this.persistDocument(doc);}
 async withLock(fn){if(this.locks)return this.locks.request('copper-unified-'+this.account(),{ifAvailable:true},lock=>lock?fn():false);return fn();}
 async sync({manual=false,keepalive=false}={}){if(this.suspended||!this.account()||!this.connected||!this.online||this.busy||this.conflict||this.plan)return false;if(!manual&&this.now()<Math.max(this.nextSync,this.retryAt))return false;this.save();if(!this.doc.dirty&&!this.doc.pending)return false;return this.withLock(()=>this.upload({keepalive}));}
 async upload({economic=null,payload={},keepalive=false}={}){
  if(this.busy)throw Error('Another synchronization is processing.');const captured=compactState(this.state());
  const request=this.doc.pending||{command:economic?'unified-economic':'unified-sync',requestId:uuid(),revision:this.doc.cloudRevision,generation:this.doc.generation,meta:this.metadata(),state:economic?undefined:captured,patch:economic?statePatch(this.base,captured):undefined,economic,payload};
  const generation=request.generation??this.doc.generation;this.pending=request;this.writePending();this.busy=true;this.economicPending=!!economic;this.notify();
  try{const response=await this.request({...request,keepalive});if(this.account()!==request.meta.ownerId)throw Error('ACCOUNT_CHANGED: The upload belongs to your previous sign-in. Its receipt is preserved.');const changed=this.doc.generation!==generation;
   // Ordinary local actions may continue during a snapshot upload. Its response
   // only clears the exact generation captured, never newer local work.
   if(response.duplicate&&response.revision>response.settledRevision)throw Error('SAVE_CONFLICT: Your earlier request settled, then another device saved newer progress. Compare both copies.');
   const current=this.state(),next=economic?validateSnapshot(response.state):current;
   const doc={...this.doc,state:clone(next),cloudRevision:response.revision,syncedId:response.meta.id,lastSync:this.now(),id:economic?response.meta.id:this.doc.id,dirty:changed&&!economic,migrated:true,ownerId:this.account(),pending:null};
   this.persistDocument(doc);this.base=clone(response.state);this.pending=null;this.lastMaterial=material(next);if(economic)this.apply(next);
   this.nextSync=this.now()+SYNC_INTERVAL;this.retryAt=0;this.failures=0;this.error='';this.onAccepted?.();this.notify();return response;
  }catch(error){if(error.definitive&&!/CONFLICT|STALE/.test(error.message)){this.pending=null;this.persistDocument({...this.doc,pending:null});}this.error=error.message;this.failures++;this.retryAt=this.now()+Math.min(SYNC_INTERVAL,15000*2**Math.min(6,this.failures-1));if(/CONFLICT|STALE/.test(error.message))this.conflict={kind:'cloud',local:clone(this.state()),message:error.message};this.notify();throw error;
  }finally{this.busy=false;this.economicPending=false;this.notify();}
 }
 async economic(command,payload={}){if(!this.connected)throw Error('Connect cloud sync before using worldwide transactions. Guest play remains available.');if(!this.online)throw Error('Reconnect for a worldwide transaction. Local gameplay is saved.');if(this.conflict||this.plan||this.doc.pending)throw Error('Resolve or retry your pending cloud save first.');this.save();return this.withLock(()=>this.upload({economic:command,payload}));}
 async resolveConflict(source){const loaded=await this.request({command:'unified-load'});this.remote=loaded;this.archive('Device before conflict resolution');this.doc.pending=null;this.pending=null;this.plan={kind:source==='cloud'?'continuation':'resolution',candidates:[candidate('device',this.state(),this.doc),candidate('cloud',loaded.current.state,loaded.current.meta)],eligible:['device','cloud'],recommended:null,reason:'Choose one complete copy. The other is kept for recovery.'};this.conflict=null;
  if(source==='cloud')return this.acceptRemote(loaded.current);
  this.doc.cloudRevision=loaded.current.revision;this.base=clone(loaded.current.state);this.doc.dirty=true;this.doc.syncedId=loaded.current.meta.id;this.persistDocument({...this.doc});this.plan=null;return this.upload({economic:'resolve-copy',payload:{confirm:true}});
 }
 async retry(){if(this.busy)return false;if(!this.doc.pending)throw Error('No pending upload.');this.conflict=null;return this.withLock(()=>this.upload({economic:this.doc.pending.economic}));}
 disconnect(){this.save();this.connected=false;this.base=null;this.plan=null;this.conflict=null;this.notify();}
 async tick(){if(this.account()&&this.connected&&this.doc.dirty&&this.online&&this.now()>=Math.max(this.nextSync,this.retryAt))try{await this.sync();}catch{/* Pending data stays durable, with bounded backoff. */}}
 setOnline(value){this.online=value;if(value&&this.doc.dirty)this.nextSync=Math.min(this.nextSync,this.now()+1000);this.notify();}
 importSave(input,label='Imported save'){const next=validateSnapshot(input);this.archive(label);this.save(next,true);this.apply(next);this.notify();}
 restoreLocal(id){const recovery=this.doc.recoveries.find(r=>r.id===id);if(!recovery)throw Error('Recovery copy not found.');this.importSave(recovery.state,'Before recovery restore');}
 receiveStorage(raw){if(!raw)return;const other=E.decode(raw);if(other.id===this.doc.id){if(other.cloudRevision>this.doc.cloudRevision&&material(this.state())===material(this.doc.state)){this.doc=other;this.base=clone(other.state);this.nextSync=other.lastSync+SYNC_INTERVAL;this.notify();}return;}this.conflict={kind:'tab',local:clone(this.state()),other,message:'Another browser tab saved different progress. Stop editing this tab and review the copies.'};this.notify();}
}

const compressionChanged=(before,after)=>before.compressionPolicyVersion!==after.compressionPolicyVersion||before.compressionAscension!==after.compressionAscension||before.compression!==after.compression;
