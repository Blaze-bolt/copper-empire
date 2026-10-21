import test from 'node:test';
import assert from 'node:assert/strict';
import {OnlineWorkshop} from '../src/online/client.js';
import {accountView} from '../src/online/views.js';

const session={user:{id:'recovery-user',user_metadata:{username:'recycler'}}};
function browser(t,href){
 const previous=Object.getOwnPropertyDescriptor(globalThis,'location');
 Object.defineProperty(globalThis,'location',{configurable:true,writable:true,value:new URL(href)});
 t.after(()=>{if(previous)Object.defineProperty(globalThis,'location',previous);else delete globalThis.location;});
}
function sdk({error=null,event=null,currentSession=null,consumeCode=false}={}){
 let callback,updates=[];
 const client={auth:{
  onAuthStateChange(fn){callback=fn;},
  async initialize(){
   if(consumeCode)location.search='';
   if(event)callback(event,currentSession);
   return {error};
  },
  async getSession(){return {data:{session:currentSession},error:null};},
  async updateUser(value){updates.push(value);return {error:null};}
 }};
 return {client,updates,emit:(event,session)=>callback(event,session),createClient:()=>client};
}

test('expired email errors are surfaced even when getSession would silently return no session',async t=>{
 browser(t,'https://example.test/game/#error=access_denied&error_code=otp_expired');
 const o=new OnlineWorkshop(),stub=sdk({error:{message:'Email link expired'}});
 await o.init(stub.createClient);
 assert.match(o.authError,/expired or already been used/);
 const html=accountView(o);
 assert.match(html,/role="alert"/);
 assert.match(html,/Email a password reset/);
 assert.doesNotMatch(html,/id="new-password"/);
});

test('a code without a browser verifier does not turn an existing session into password recovery',async t=>{
 browser(t,'https://example.test/game/?code=unexchanged');
 const o=new OnlineWorkshop(),stub=sdk({currentSession:session});
 await o.init(stub.createClient);
 assert.match(o.authError,/could not be verified/);
 assert.equal(Boolean(o.recovering),false);
 assert.doesNotMatch(accountView(o),/id="new-password"/);
});

test('verified recovery shows the password form before workshop controls without loading game services',async t=>{
 browser(t,'https://example.test/game/?code=valid');
 const o=new OnlineWorkshop(),stub=sdk({event:'PASSWORD_RECOVERY',currentSession:session,consumeCode:true});
 o.profile=async()=>{throw Error('Game services must not block password recovery');};
 await o.init(stub.createClient);
 assert.equal(o.recovering,true);
 assert.equal(o.authError,'');
 const html=accountView(o);
 assert.match(html,/Choose a new password/);
 assert.match(html,/id="confirm-password"/);
 assert.doesNotMatch(html,/Continue online workshop|Make a name for yourself/);
});

test('a recovery event arriving after initialization still opens the password form',async t=>{
 browser(t,'https://example.test/game/?code=valid');
 const o=new OnlineWorkshop(),stub=sdk({currentSession:session,consumeCode:true});
 await o.init(stub.createClient);
 stub.emit('PASSWORD_RECOVERY',session);
 assert.equal(o.recovering,true);
 assert.match(accountView(o),/Choose a new password/);
 stub.emit('SIGNED_OUT',null);
 assert.equal(o.recovering,false);
 assert.doesNotMatch(accountView(o),/id="new-password"/);
});

test('ordinary sign-in and a recovery-looking URL alone do not show the password form',async t=>{
 browser(t,'https://example.test/game/#type=recovery');
 const o=new OnlineWorkshop(),stub=sdk();
 await o.init(stub.createClient);
 assert.doesNotMatch(accountView(o),/id="new-password"/);
});

test('password changes require a session, matching inputs and 8–128 characters',async()=>{
 const o=new OnlineWorkshop(),stub=sdk();o.client=stub.client;
 await assert.rejects(o.password('new-password','new-password'),/fresh password reset email/);
 o.session=session;o.recovering=true;
 await assert.rejects(o.password('short','short'),/8–128/);
 await assert.rejects(o.password('x'.repeat(129),'x'.repeat(129)),/8–128/);
 await assert.rejects(o.password('new-password','different-password'),/do not match/);
 assert.equal(stub.updates.length,0);
 await o.password('new-password','new-password');
 assert.deepEqual(stub.updates,[{password:'new-password'}]);
 assert.equal(o.recovering,false);
});

test('a rejected password update keeps the form available for correction',async()=>{
 const o=new OnlineWorkshop();o.session=session;o.recovering=true;
 o.client={auth:{updateUser:async()=>({error:Error('Choose a stronger password')})}};
 await assert.rejects(o.password('new-password','new-password'),/stronger password/);
 assert.equal(o.recovering,true);
});
