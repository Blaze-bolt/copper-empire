import test,{after} from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';import * as E from '../src/empire/state.js';import {pack} from '../supabase/functions/service.js';
const db=new PGlite();after(()=>db.close());
await db.exec(`create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key,raw_user_meta_data jsonb);create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;create function public.empire_test_clock() returns timestamptz language sql stable as $$ select '2026-10-17 10:00:00+00'::timestamptz $$;`);
for(const file of ['202610160001_empire.sql','202610160002_clock_retention.sql','202610160003_compact_saves.sql','202610160004_read_optimized_clock.sql','202610160005_enforce_compact_market.sql','202610160006_backup_price_history.sql','20261017095733_ascension_gold_markets.sql']){
 let sql=await readFile(new URL('../supabase/migrations/'+file,import.meta.url),'utf8');sql=sql.replace(/create extension if not exists pg_cron;[\s\S]*$/,'').replaceAll('clock_timestamp()','public.empire_test_clock()').replaceAll('now()','public.empire_test_clock()');try{await db.exec(sql);}catch(e){throw Error(file+': '+e.message);}
}
const rpc=async(name,args={})=>{const keys=Object.keys(args);return (await db.query(`select public.${name}(${keys.map((k,i)=>`${k}=>$${i+1}`).join(',')}) as result`,Object.values(args))).rows[0].result;};
const user='30000000-0000-4000-8000-000000000001';await db.query('insert into auth.users values($1,$2)',[user,{username:'expansion_tester'}]);
test('both markets: permanent shared quotes, strict hour retention, no writes inside a tick',async()=>{
 await db.exec('insert into empire_private.gold_prices values(1,600000);insert into empire_private.prices values(1,5000);update empire_private.market set epoch=epoch-361;update empire_private.gold_market set epoch=epoch-361;');
 const quotes=await rpc('empire_quotes');assert.ok(quotes.copper.quote>=3000&&quotes.copper.quote<=20000);assert.ok(quotes.gold.quote>=300000&&quotes.gold.quote<=1800000);assert.equal(quotes.copper.next,quotes.gold.next);
 for(const [table,endpoint]of [['prices','empire_price_history'],['gold_prices','empire_gold_price_history']]){const points=await rpc(endpoint,{p_after:0});assert.ok(points.length<=361);assert.ok(points.every(p=>p.at>=quotes.copper.serverTime-3600000));assert.equal((await db.query(`select count(*) n from empire_private.${table} where epoch=1`)).rows[0].n,0);}
 const before=(await db.query('select xmin::text v from empire_private.gold_market')).rows[0].v;await rpc('empire_quotes');await rpc('empire_gold_quote');assert.equal((await db.query('select xmin::text v from empire_private.gold_market')).rows[0].v,before);
});
test('gold trade commit: quote change rollback, idempotency and safe legacy RPC',async()=>{
 const s=E.newState();s.ascension.level=1;s.gold.unlocked=true;s.gold.balance=123n;s.gold.recovered=100n;
 await rpc('empire_load',{p_user:user,p_initial:pack(s)});const q=await rpc('empire_gold_quote');
 const request={p_user:user,p_request:'40000000-0000-4000-8000-000000000001',p_expected:0,p_state:pack(s),p_attempt:null,p_result:{gold:true},p_quote:q.quote,p_volume:'123',p_asset:'gold'};
 await assert.rejects(rpc('empire_commit_asset',{...request,p_quote:q.quote+1}),/QUOTE_CHANGED/);assert.equal((await rpc('empire_load',{p_user:user,p_initial:pack(s)})).revision,0);
 const paid=await rpc('empire_commit_asset',request);assert.equal(paid.revision,1);const duplicate=await rpc('empire_commit_asset',request);assert.ok(duplicate.duplicate);assert.equal(duplicate.revision,1);assert.equal((await rpc('empire_rankings'))[0].gold_mg,'100');assert.equal((await rpc('empire_rankings'))[0].ascension,1);assert.ok(!('history' in paid.state.goldMarket));
 const legacy={...request,p_request:'40000000-0000-4000-8000-000000000002',p_expected:1,p_quote:null,p_volume:'0'};delete legacy.p_asset;assert.equal((await rpc('empire_commit',legacy)).revision,2);
});
test('all gold private tables and authoritative commits deny browser roles',async()=>{
 await db.exec('set role authenticated;');
 for(const table of ['gold_market','gold_prices','gold_influence'])await assert.rejects(db.query(`select * from empire_private.${table}`),/permission denied/);
 await assert.rejects(db.query(`select public.empire_commit_asset(null,null,0,'{}',null,null)`),/permission denied/);
 const q=await rpc('empire_quotes');assert.ok(q.gold.global);await db.exec('reset role;');
});
