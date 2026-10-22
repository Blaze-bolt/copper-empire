import test,{after} from 'node:test';import assert from 'node:assert/strict';import {readFile,readdir} from 'node:fs/promises';import {PGlite} from '@electric-sql/pglite';
import {createEmpireHandler} from '../supabase/functions/http-handler.js';import {hashCode,verifyCode,digest,guardedDatabase} from '../supabase/functions/server-access.js';
import * as E from '../src/empire/state.js';import {pack,unpack} from '../supabase/functions/service.js';
const db=new PGlite();after(()=>db.close());
await db.exec("create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key,raw_user_meta_data jsonb);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;create table public.test_clock(at timestamptz);insert into public.test_clock values('2026-10-22 09:00:00+00');create function public.empire_test_clock() returns timestamptz language sql stable as $$select at from public.test_clock$$;");
for(const f of (await readdir('supabase/migrations')).filter(f=>f.endsWith('.sql')).sort())await db.exec((await readFile('supabase/migrations/'+f,'utf8')).replace(/create extension if not exists pg_cron;[\s\S]*$/,'').replaceAll('clock_timestamp()','public.empire_test_clock()').replaceAll('now()','public.empire_test_clock()'));
const rpc=async(name,args={})=>(await db.query(`select public.${name}(${Object.keys(args).map((k,i)=>`${k}=>$${i+1}`).join(',')}) as result`,Object.values(args))).rows[0].result,adapter={rpc};
const owner='88000000-0000-4000-8000-000000000001',user='88000000-0000-4000-8000-000000000002',other='88000000-0000-4000-8000-000000000003';
for(const[id,username]of [[owner,'control_owner'],[user,'control_user'],[other,'control_other']])await db.query('insert into auth.users values($1,$2)',[id,{username}]);await db.query('insert into empire_private.owner_admin(user_id) values($1)',[owner]);
const initial=E.newState();initial.money=10n**30n;initial.rebirth=12;initial.copper[0]=10n**25n;initial.auras.rusty=123456789012345678901n;
await rpc('empire_load',{p_user:user,p_initial:pack(initial)});
const handler=createEmpireHandler({db:adapter,authenticate:async token=>['owner','user','other'].includes(token)?{id:{owner,user,other}[token],email_confirmed_at:'yes'}:null});
const call=async(body,who='user',testing=null,ip='192.0.2.1')=>{const headers={'content-type':'application/json','x-forwarded-for':ip};if(who)headers.authorization='Bearer '+who;if(testing)headers['x-empire-testing']=testing;const r=await handler(new Request('https://qa.invalid',{method:'POST',headers,body:E.encode(body)}));return {status:r.status,data:unpack(await r.json())};};
const access=()=>rpc('empire_lockdown_admin_status',{p_user:owner});
const control=async(action,payload={},who=owner,expected=null,id=crypto.randomUUID())=>rpc('empire_admin_lockdown',{p_user:who,p_request:id,p_action:action,p_payload:payload,p_expected:expected??(await access()).version});
const settings=(enabled,extra={})=>control('settings',{enabled,message:'',reopensAt:null,confirm:true,...extra});
const next=async(seconds=10)=>db.query("update public.test_clock set at=at+($1||' seconds')::interval",[seconds]);
const state=async()=>unpack((await db.query('select state from empire_private.players where user_id=$1',[user])).rows[0].state);
const adminMarket=async(action,payload={},confirm=false)=>rpc('empire_admin_market',{p_user:owner,p_request:crypto.randomUUID(),p_asset:'copper',p_action:action,p_payload:payload,p_expected:(await rpc('empire_admin_status',{p_user:owner})).markets.copper.version,p_confirm:confirm});
async function price(q){await adminMarket('config',{...(await rpc('empire_admin_status',{p_user:owner})).markets.copper.config,mode:'frozen'},true);await next();await rpc('empire_quotes');await adminMarket('set',{value:q},true);await next();await rpc('empire_quotes');}
const trajectory=async(action,payload={},who=owner,expected=null)=>rpc('empire_admin_trajectory',{p_user:who,p_request:crypto.randomUUID(),p_action:action,p_payload:payload,p_expected:expected??(await rpc('empire_admin_status',{p_user:owner})).markets.copper.version});

test('lockdown defaults OPEN, anonymous status is safe, and owner identity cannot be forged',async()=>{
 const s=await call({command:'server-status'},null);assert.equal(s.status,200);assert.equal(s.data.enabled,false);assert.equal(s.data.owner,false);
 assert.equal((await call({command:'admin-lockdown',user:owner,payload:{action:'settings',enabled:true}},'user')).status,400);
 await assert.rejects(control('settings',{enabled:true},user),/OWNER_ONLY/);
 await assert.rejects(control('settings',{enabled:true,confirm:false}),/Confirm/);
});
test('activation and custom message preserve exact saves and make all normal API commands inaccessible',async()=>{
 const before=await state();await settings(true,{message:'Private testing <script> is text',reopensAt:null});
 const s=await call({command:'server-status'},null);assert.equal(s.data.allowed,false);assert.equal(s.data.reopensAt,null);assert.equal((await call({command:'server-status'},'owner')).data.owner,true);
 for(const command of ['purchase','tool','trade','aura-roll','aura-capacity','equip-aura','begin','stage','confirm-ascension','industry-build','ship-dispatch','heartbeat','reward','unified-sync','unified-migrate','unified-economic']){
  const r=await call({command,clientVersion:9,requestId:crypto.randomUUID(),revision:0,payload:{user:owner,isAdmin:true}});assert.equal(r.status,423,command);
 }
 assert.deepEqual(await state(),before);assert.equal((await call({command:'save-export'})).status,200);assert.equal((await call({command:'unified-load',clientVersion:9})).status,200);assert.equal((await call({command:'admin-status'},'owner')).data.lockdown.enabled,true);
});
test('database backstop blocks legacy saves and direct backups; browser roles cannot call privileged controls',async()=>{
 const before=await state();await assert.rejects(rpc('empire_commit_asset',{p_user:user,p_request:crypto.randomUUID(),p_expected:0,p_state:pack({...before,money:0n}),p_attempt:null,p_result:null}),/SERVER_LOCKDOWN/);
 await assert.rejects(db.query('insert into public.empire_backups(user_id,save) values($1,$2)',[user,E.encode(before)]),/SERVER_LOCKDOWN/);assert.deepEqual(await state(),before);
 await db.exec('set role authenticated');for(const f of ['empire_access_status','empire_testing_secret','empire_admin_lockdown','empire_lockdown_rpc','empire_admin_trajectory']){const row=(await db.query("select has_function_privilege('authenticated',p.oid,'execute') allowed from pg_proc p where proname=$1",[f])).rows[0];assert.equal(row.allowed,false,f);}await db.exec('reset role');
});
let code='Disposable-testing-code-47',testing;
test('testing codes have independent random salts and correct PBKDF2 verification',async()=>{
 const a=await hashCode(code),b=await hashCode(code);assert.notEqual(a.salt,b.salt);assert.notEqual(a.hash,b.hash);assert.equal(await verifyCode(code,a),true);assert.equal(await verifyCode('Incorrect-testing-code',a),false);await control('code',{...a,revokeSessions:true});
 assert.ok(!JSON.stringify(await access()).includes(a.hash));const audit=await db.query('select details,result from empire_private.admin_audit');assert.ok(!JSON.stringify(audit.rows).includes(a.salt));assert.ok(!JSON.stringify(audit.rows).includes(code));
});
test('incorrect-code rate limiting is durable, shared, bounded and does not expose the configured secret',async()=>{
 for(let i=0;i<5;i++){const r=await call({command:'testing-unlock',code:'incorrect-testing-code'},null,null,'192.0.2.9');assert.match(r.data.error,/not accepted/);}
 const sixth=await call({command:'testing-unlock',code},null,null,'192.0.2.9');assert.equal(sixth.data.rateLimited,true);assert.ok(sixth.data.retryAfter>0);await next(61);
 const good=await call({command:'testing-unlock',code},null,null,'192.0.2.9');assert.equal(good.status,200);testing=good.data.token;assert.match(testing,/^[a-f0-9]{64}$/);assert.equal(good.data.status.tester,true);assert.ok(!JSON.stringify(good.data).includes(code));assert.ok(!JSON.stringify(await access()).includes(testing));
 const row=(await db.query('select token_hash from empire_private.testing_sessions')).rows[0];assert.equal(row.token_hash,await digest(testing));assert.notEqual(row.token_hash,testing);
});
test('authorized testers and the authenticated owner can play; request bodies cannot grant testing access',async()=>{
 const result=await call({command:'purchase',clientVersion:9,slot:'main',requestId:crypto.randomUUID(),revision:0,payload:{id:1}},'user',testing);assert.equal(result.status,200,E.encode(result.data));
 assert.equal((await call({command:'purchase',testingToken:testing,isTester:true})).status,423);
 assert.equal((await call({command:'load',slot:'debug',clientVersion:9},'owner')).status,200);
 assert.equal((await call({command:'server-status'},'user',testing)).data.allowed,true);
});
test('account-bound testing sessions cannot be borrowed by a different authenticated account',async()=>{
 const result=await call({command:'testing-unlock',code},'user',null,'192.0.2.12');assert.equal(result.data.status.tester,true);const token=result.data.token;assert.equal((await call({command:'server-status'},'other',token)).data.tester,false);
});
test('code changes can preserve sessions, while explicit revocation invalidates them immediately',async()=>{
 const old=testing;await control('revoke-code',{revokeSessions:false});assert.equal((await call({command:'server-status'},'user',old)).data.tester,true);
 assert.match((await call({command:'testing-unlock',code},null,null,'192.0.2.13')).data.error,/not accepted/);
 await control('revoke-sessions');assert.equal((await call({command:'server-status'},'user',old)).data.tester,false);
 await control('code',{...await hashCode(code),revokeSessions:true});testing=(await call({command:'testing-unlock',code},null,null,'192.0.2.14')).data.token;
 await next(7201);assert.equal((await call({command:'server-status'},'user',testing)).data.tester,false);
});
test('concurrent owner settings use compare-and-swap and idempotent receipts',async()=>{
 const old=await access(),id=crypto.randomUUID();await control('settings',{enabled:true,message:'Kept',confirm:true},owner,old.version,id);await control('settings',{enabled:false},owner,old.version,id);assert.equal((await access()).enabled,true);
 const v=(await access()).version;const results=await Promise.allSettled([control('settings',{enabled:true,message:'A'},owner,v),control('settings',{enabled:false,message:'B'},owner,v)]);assert.equal(results.filter(x=>x.status==='fulfilled').length,1);await settings(true);
});
test('lockdown activated after the preliminary HTTP check still rejects commit atomically',async()=>{
 await settings(false);const before=await state();let changed=false;
 const late=createEmpireHandler({authenticate:async()=>({id:user,email_confirmed_at:'yes'}),db:{rpc:async(name,args)=>{const result=await rpc(name,args);if(name==='empire_access_status'&&!changed){changed=true;await settings(true);}return result;}}});
 const response=await late(new Request('https://qa.invalid',{method:'POST',headers:{authorization:'Bearer user'},body:E.encode({command:'purchase',slot:'main',clientVersion:9,revision:1,requestId:crypto.randomUUID(),payload:{device:2}})}));assert.equal(response.status,423);assert.deepEqual(await state(),before);
});
test('reopening preserves progress and accepts a normal trade exactly once',async()=>{
 await settings(false);const before=await state(),quote=(await rpc('empire_quotes')).copper.quote;const current=(await db.query('select revision from empire_private.players where user_id=$1',[user])).rows[0].revision;
 const body={command:'trade',slot:'main',clientVersion:9,revision:current,requestId:crypto.randomUUID(),payload:{side:'sell',amount:'1000',quality:0,quote}};
 const first=await call(body),second=await call(body);assert.equal(first.status,200);assert.equal(second.status,200);assert.equal(second.data.revision,first.data.revision);assert.equal((await state()).copper[0],before.copper[0]-1000n);
});
test('the guarded RPC accepts only known writes and the authenticated caller identity',async()=>{
 await assert.rejects(rpc('empire_lockdown_rpc',{p_user:user,p_token:null,p_name:'empire_testing_secret',p_args:{p_user:user}}),/not permitted/);
 await assert.rejects(guardedDatabase(adapter,user,null).rpc('empire_slot_load',{p_user:owner,p_slot:'debug',p_initial:pack(initial)}),/identity/);
});
test('trajectory authorization, bounds and infeasible deadlines are enforced',async()=>{
 await price(10000);await assert.rejects(trajectory('start',{target:'2',ticks:10,volatility:'normal',tolerance:2},user),/OWNER_ONLY/);
 await assert.rejects(trajectory('start',{target:'2',ticks:10,volatility:'normal',tolerance:2}),/smoothly/);
 await assert.rejects(trajectory('start',{target:'2.01',ticks:40,volatility:'high',tolerance:2}),/bounds/);
 await assert.rejects(trajectory('start',{target:'1',ticks:0,volatility:'high',tolerance:2}),/2–360/);
});
test('upward bridge uses shared ten-second ticks and finishes within clipped tolerance without a final jump',async()=>{
 await price(10000);await trajectory('start',{target:'2',ticks:10,volatility:'high',tolerance:2});let previous=10000;const path=[];
 for(let i=0;i<10;i++){await next();const q=(await rpc('empire_quotes')).copper.quote;assert.ok(q>=Math.ceil(previous*.92)&&q<=Math.floor(previous*1.08));assert.ok(q<=20000);assert.equal((await rpc('empire_quotes')).copper.quote,q);path.push(q);previous=q;}
 assert.ok(previous>=19600&&previous<=20000);const t=(await rpc('empire_admin_status',{p_user:owner})).markets.copper.trajectory;assert.equal(t.status,'completed');assert.equal(t.completed,10);await next();assert.equal((await rpc('empire_quotes')).copper.quote,previous);assert.ok(new Set(path.map((q,i)=>q-(i?path[i-1]:10000))).size>2);
});
test('downward paths fluctuate naturally and respect every cap, endpoint and worldwide history record',async()=>{
 await db.query('select setseed(0.321)');await price(18000);await trajectory('start',{target:'0.5',ticks:35,volatility:'high',tolerance:2});let previous=18000;let up=0,down=0;
 for(let i=0;i<35;i++){await next();const q=(await rpc('empire_quotes')).copper.quote;assert.ok(q>=Math.ceil(previous*.92)&&q<=Math.floor(previous*1.08));if(q>previous)up++;if(q<previous)down++;previous=q;}
 assert.ok(previous>=4900&&previous<=5100);assert.ok(up>0);assert.ok(down>0);const points=await rpc('empire_price_history');assert.equal(points.at(-1).quote,previous);assert.ok(points.length<=361);
});
test('replacement confirmation, cancellation and concurrent trajectory administration are safe',async()=>{
 await trajectory('start',{target:'1',ticks:30,volatility:'normal',tolerance:2});await assert.rejects(trajectory('start',{target:'1.2',ticks:30,volatility:'normal',tolerance:2}),/Confirm/);
 const version=(await rpc('empire_admin_status',{p_user:owner})).markets.copper.version;
 const results=await Promise.allSettled([trajectory('start',{target:'1',ticks:30,volatility:'normal',tolerance:2,confirm:true},owner,version),trajectory('cancel',{},owner,version)]);assert.equal(results.filter(x=>x.status==='fulfilled').length,1);
 await trajectory('cancel');assert.equal((await rpc('empire_admin_status',{p_user:owner})).markets.copper.trajectory.status,'cancelled');
});
test('other market controls require confirmation before cancelling an active trajectory',async()=>{
 await trajectory('start',{target:'1',ticks:30,volatility:'high',tolerance:2});await assert.rejects(adminMarket('set',{value:9000}),/Confirm cancelling/);
 await adminMarket('set',{value:9000},true);await next();assert.equal((await rpc('empire_quotes')).copper.quote,9000);assert.equal((await rpc('empire_admin_status',{p_user:owner})).markets.copper.trajectory.status,'cancelled');
});
test('closed-owner-browser catch-up completes a trajectory and keeps at most one hour of history',async()=>{
 await trajectory('start',{target:'1.2',ticks:30,volatility:'normal',tolerance:2});await next(7200);const q=await rpc('empire_quotes');assert.ok(q.copper.quote>=11760&&q.copper.quote<=12240);assert.ok((await rpc('empire_price_history')).length<=361);assert.equal((await rpc('empire_admin_status',{p_user:owner})).markets.copper.trajectory.status,'completed');
});


test('rotating network buckets cannot bypass the global verification budget',async()=>{
 await next(61);for(let i=0;i<300;i++){const r=await rpc('empire_testing_attempt',{p_bucket:await digest('rotating-'+i)});assert.equal(r.allowed,true);}
 assert.equal((await rpc('empire_testing_attempt',{p_bucket:await digest('new-network')})).allowed,false);
 await next(61);assert.equal((await rpc('empire_testing_attempt',{p_bucket:await digest('new-network')})).allowed,true);
});


test('lockdown keeps a unified unfinished save dirty until the same request can settle once for a tester',async()=>{
 await settings(false);
 const loaded=await call({command:'unified-load'}),meta={schema:1,id:crypto.randomUUID(),parent:null,root:crypto.randomUUID(),lineage:[],ownerId:user,migrated:true};
 const migrated=await call({command:'unified-migrate',clientVersion:9,requestId:crypto.randomUUID(),revision:0,source:'legacy-main',state:pack(initial),meta,confirm:true,sourceToken:loaded.data.token});
 assert.equal(migrated.status,200,E.encode(migrated.data));
 const snapshot=E.decode(E.encode(migrated.data.state));snapshot.unifiedAttempt={attempt:{id:'preserved-lockdown-challenge',stages:[1],index:0,scores:[],status:'active',paid:false},game:null};
 const request={command:'unified-sync',clientVersion:9,requestId:crypto.randomUUID(),revision:migrated.data.revision,state:pack(snapshot),meta:{...meta,id:crypto.randomUUID(),parent:meta.id,lineage:[meta.id]}};
 await settings(true);assert.equal((await call(request)).status,423);
 const backup=await call({command:'save-export'});assert.equal(backup.status,200);assert.equal(backup.data.current.revision,migrated.data.revision);
 const unlocked=await call({command:'testing-unlock',code},'user',null,'192.0.2.88');assert.ok(unlocked.data.token,E.encode(unlocked.data));
 const accepted=await call(request,'user',unlocked.data.token);assert.equal(accepted.status,200,E.encode(accepted.data));assert.equal(accepted.data.state.unifiedAttempt.attempt.id,'preserved-lockdown-challenge');
 const retry=await call(request,'user',unlocked.data.token);assert.equal(retry.status,200);assert.equal(retry.data.revision,accepted.data.revision);
 await settings(false);
});
