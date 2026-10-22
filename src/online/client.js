import {onlineConfig as config} from './config.js';
import * as E from '../empire/state.js';
export class OnlineWorkshop {
 constructor(notify){this.notify=notify;this.client=null;this.session=null;this.active=false;this.revision=0;this.busy=false;this.username='';this.market=null;this.rankings=[];this.lastSync=0;this.error='';this.queue=Promise.resolve();this.slot='main';this.classification='verified';this.admin={owner:false};}
 async init(createClient){
  if(!config.enabled||!config.publishableKey){this.error='Online setup is not enabled on this copy yet.';return;}
  const url=new URL(globalThis.location?.href||'https://localhost/'),hash=new URLSearchParams(url.hash.slice(1));
  this.authReturn=url.searchParams.has('code')||['error','error_code','error_description','access_token','type'].some(key=>hash.has(key)||url.searchParams.has(key));
  this.initializing=true;
  try{
   if(!createClient)({createClient}=await import('../../vendor/supabase.js'));
   this.client=createClient(config.url,config.publishableKey,{auth:{flowType:'pkce',detectSessionInUrl:true,persistSession:true}});
   this.client.auth.onAuthStateChange((event,session)=>{
    if(this.session?.user.id!==session?.user.id){this.username='';this.admin={owner:false};this.slot='main';this.classification='verified';this.recovering=false;}
    this.session=session;
    if(this.active&&session?.user.id!==this.activeUserId){this.active=false;this.onSignOut?.();}
    if(event==='PASSWORD_RECOVERY'&&session){this.recovering=true;this.authError='';}
    if(event==='SIGNED_OUT'){this.recovering=false;this.active=false;this.onSignOut?.();}
    setTimeout(()=>this.notify?.(),0);
   });
   // getSession() alone does not report errors from processing an email link.
   const {error:callbackError}=await this.client.auth.initialize();if(callbackError)throw callbackError;
   if(['error','error_code','error_description'].some(key=>hash.has(key)||url.searchParams.has(key)))throw Error('Invalid email link.');
   // A code left in the URL was not exchanged (for example, its verifier is missing).
   if(url.searchParams.has('code')&&new URL(globalThis.location.href).searchParams.has('code'))throw Error('Email link could not be verified.');
   const {data,error}=await this.client.auth.getSession();if(error)throw error;this.session=data.session;
   if(this.authReturn&&!this.session)throw Error('No verified email session was received.');
   if(this.session&&!this.recovering&&!this.authReturn)await this.profile();
  }catch(error){
   if(this.authReturn){this.recovering=false;this.authError='This email link could not be verified. It may have expired or already been used. Request a new password reset below, then open the newest email on the same device and browser. Keep browser storage enabled.';}
   else this.error=error.message;
  }finally{this.initializing=false;}
 }
 async profile(){if(!this.session)return;const {data,error}=await this.client.from('empire_profiles').select('username').eq('id',this.session.user.id).single();if(error)throw error;this.username=data.username;await this.adminStatus();}
 async api(body){if(!this.client||!this.session)throw Error('Sign in to your account first.');const {data:{session},error}=await this.client.auth.getSession();if(error||!session)throw Error('Your sign-in expired. Sign in again.');this.session=session;const encoded=E.encode({...body,clientVersion:9});const res=await fetch(config.url+'/functions/v1/empire-api',{method:'POST',headers:{'content-type':'application/json',apikey:config.publishableKey,authorization:'Bearer '+session.access_token},body:encoded,keepalive:body.keepalive===true&&new TextEncoder().encode(encoded).length<=60000,signal:globalThis.AbortSignal?.timeout?.(20000)});const data=await res.json();if(!res.ok||data.error){const problem=Error(data.error||'The workshop is unavailable.');problem.definitive=true;throw problem;}return E.decode(JSON.stringify(data));}
 async adminStatus(){if(!this.session){this.admin={owner:false};return this.admin;}this.admin=await this.api({command:'admin-status'});return this.admin;}
 async load(){const data=await this.api({command:'load',slot:this.slot});this.revision=data.revision;this.classification=data.classification||'verified';this.lastSync=Date.now();this.attempt=data.attempt;this.pending=null;this.error='';return data;}
 async command(command,payload={}){
  if(this.busy)throw Error('Your previous action is still saving. Please wait.');if(this.pending)throw Error('Retry your pending save from Account & Cloud before making another change.');this.busy=true;
  const request={command,payload,slot:this.slot,requestId:crypto.randomUUID(),revision:this.revision};this.pending=request;
  try{return await this.send(request);}finally{this.busy=false;this.notify?.();}
 }
 async send(request){try{const data=await this.api(request);if(data.slot&&data.slot!==request.slot&&!(request.command==='admin-save'&&request.payload.action==='switch'))throw Error('Save slot mismatch. Refresh your workshop.');if(data.state){this.slot=data.slot||request.slot;this.revision=data.revision;this.classification=data.classification||'verified';this.attempt=data.attempt;}if(data.admin)this.admin=data.admin;this.lastSync=Date.now();this.pending=null;this.error='';return data;}catch(error){if(error.definitive)this.pending=null;this.error=error.message;this.notify?.();throw error;}}
 async retry(){if(!this.pending)throw Error('No pending action.');if(this.busy)throw Error('A save is still in progress.');this.busy=true;try{return await this.send(this.pending);}finally{this.busy=false;}}
 async pollMarket(history=false,goldHistory=false){
  if(!this.client)throw Error(this.error||'Online service unavailable.');
  const {data,error}=await this.client.rpc('empire_quotes');if(error)throw error;
  this.clockOffset=data.copper.serverTime-Date.now();
  const merge=async(asset,quote,want)=>{const property=asset==='copper'?'market':'goldMarket',cursor=asset+'HistoryCursor';let points=(this[property]?.history||[]).filter(p=>p.at>=quote.serverTime-3600000);
   if(want){const {data:recent,error:failed}=await this.client.rpc(asset==='copper'?'empire_price_history':'empire_gold_price_history',{p_after:this[cursor]||0});if(failed)throw failed;this[cursor]=recent.length?Math.floor(recent.at(-1).at/10000):(this[cursor]||0);points=[...new Map([...points,...recent].map(p=>[p.at,p])).values()].sort((a,b)=>a.at-b.at).slice(-361);}
   else if(!points.length||points.at(-1).at!==quote.next-10000){points.push({at:quote.next-10000,quote:quote.quote});points=points.slice(-361);}this[property]={...quote,history:points};};
  await Promise.all([merge('copper',data.copper,history),merge('gold',data.gold,goldHistory)]);return this.market;
 }
 async pollRankings(now=Date.now()){
  if(!this.client||now<(this.rankingsNextPoll||0))return this.rankings;
  if(this.rankingsPending)return this.rankingsPending;
  this.rankingsPending=(async()=>{try{
   const {data,error}=await this.client.rpc('empire_rankings_snapshot');if(error)throw error;
   if(!Array.isArray(data?.rows))throw Error('The rankings response was incomplete.');
   this.rankings=data.rows.slice(0,100);this.rankingsLoaded=true;this.rankingsError='';
   this.rankingsUpdatedAt=data.updatedAt;this.rankingsNextUpdate=data.nextUpdate;
   this.rankingsNextPoll=now+Math.max(1000,Math.min(900000,data.nextUpdate-data.serverTime+1000));
  }catch(error){this.rankingsError=error.message||'Rankings are temporarily unavailable.';this.rankingsNextPoll=now+60000;}
  return this.rankings;})();
  try{return await this.rankingsPending;}finally{this.rankingsPending=null;}
 }
 async pollRevision(){const {data,error}=await this.client.rpc('empire_my_revision',{p_slot:this.slot});if(error)throw error;return data;}
 async pollIndustry(previous){const {data,error}=await this.client.rpc('empire_export_world',{p_version:previous?.version??-1,p_news_version:previous?.newsVersion??-1});if(error)throw error;const fresh=E.decode(JSON.stringify(data));return {...previous,...fresh,prices:fresh.prices||previous?.prices,events:fresh.events||previous?.events,news:fresh.news||previous?.news};}
 async industryNews(before){const {data,error}=await this.client.rpc('empire_export_news_page',{p_before:before});if(error)throw error;return data;}
 async industryHistory(country,product){const {data,error}=await this.client.rpc('empire_export_history',{p_country:country,p_product:product});if(error)throw error;return E.decode(JSON.stringify(data));}
 async signIn(email,password){const {data,error}=await this.client.auth.signInWithPassword({email,password});if(error)throw error;this.session=data.session;this.authError='';await this.profile();}
 async signUp(email,password,username){if(password.length<8||password.length>128)throw Error('Choose a password with 8–128 characters.');username=username.trim().toLowerCase();if(!/^[a-z][a-z0-9_]{2,19}$/.test(username))throw Error('Use 3–20 letters, numbers, or underscores, starting with a letter.');const {data:available,error:lookup}=await this.client.from('empire_profiles').select('id').eq('username',username);if(lookup)throw lookup;if(available.length)throw Error('That username is already taken.');const {data,error}=await this.client.auth.signUp({email,password,options:{data:{username},emailRedirectTo:new URL('./',location.href).href.split('#')[0]}});if(error)throw Error(/database/i.test(error.message)?'Username unavailable or reserved. Choose another username.':error.message);this.session=data.session;if(data.session)await this.profile();return !!data.session;}
 async reset(email){const {error}=await this.client.auth.resetPasswordForEmail(email,{redirectTo:new URL('./',location.href).href.split('#')[0]});if(error)throw error;}
 async password(password,confirmation){if(!this.session)throw Error('Open a fresh password reset email first.');if(password.length<8||password.length>128)throw Error('Choose a password with 8–128 characters.');if(password!==confirmation)throw Error('The passwords do not match.');const {error}=await this.client.auth.updateUser({password});if(error)throw error;this.recovering=false;this.authError='';}
 async backup(save){if(!this.session)throw Error('Sign in to back up your local workshop.');const snapshot=E.decode(save);if(snapshot.market)snapshot.market.history=[];if(snapshot.goldMarket)snapshot.goldMarket.history=[];save=E.encode(snapshot);if(save.length>1000000)throw Error('This backup is too large. Export it to a file instead.');const {error}=await this.client.from('empire_backups').upsert({user_id:this.session.user.id,save,updated_at:new Date().toISOString()});if(error)throw error;}
 async restore(){const {data,error}=await this.client.from('empire_backups').select('save,updated_at').eq('user_id',this.session.user.id).single();if(error)throw Error('No cloud backup was found for this account.');return E.load({getItem:key=>key===E.SAVE_KEY?data.save:null});}
 async signOut(){const {error}=await this.client.auth.signOut();if(error)throw error;}
}
