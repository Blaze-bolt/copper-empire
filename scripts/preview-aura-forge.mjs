// Disposable local QA backend. Never connects to Supabase or loads a real save.
import http from 'node:http';import {readFile,readdir} from 'node:fs/promises';import {resolve,extname,sep} from 'node:path';import {PGlite} from '@electric-sql/pglite';
import * as E from '../src/empire/state.js';import {pack,unpack} from '../supabase/functions/service.js';import {createEmpireHandler} from '../supabase/functions/http-handler.js';
const root=resolve('.'),port=Number(process.env.PORT||3004),db=new PGlite();
await db.exec("create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key,raw_user_meta_data jsonb);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;");
for(const file of (await readdir('supabase/migrations')).filter(x=>x.endsWith('.sql')).sort())await db.exec((await readFile('supabase/migrations/'+file,'utf8')).replace(/create extension if not exists pg_cron;[\s\S]*$/,''));
const user='90000000-0000-4000-8000-000000000001';await db.query('insert into auth.users values($1,$2)',[user,{username:'local_forge_fixture'}]);
const rpc=async(name,args={})=>(await db.query(`select public.${name}(${Object.keys(args).map((k,i)=>`${k}=>$${i+1}`).join(',')}) as result`,Object.values(args))).rows[0].result;
async function reset(mode){const s=E.newState();s.rebirth=12;s.ascension.level=2;s.money=100000000000000000000000000000n;s.copper[0]=0n;s.auraForge.tier=mode==='maximum'||mode==='large-count'?16:0;
 if(mode==='large-count'){s.auras.rusty=123456789012345678901234567890n;s.stats.rolls=123456789012345678901234567890n;for(const a of ['plasma','eclipse','eternal','god'])s.auras[a]=1n;}
 await db.query('insert into empire_private.players(user_id,state) values($1,$2) on conflict(user_id) do update set state=excluded.state,attempt=null,revision=empire_private.players.revision+1',[user,pack(s)]);
}
await reset('starter');
const handler=createEmpireHandler({db:{rpc},authenticate:async token=>token==='local-fixture-only'?{id:user,email_confirmed_at:'local-test'}:null});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.mp3':'audio/mpeg'};
http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://127.0.0.1:'+port);
 if(url.pathname==='/qa/reset'&&req.method==='POST'){let body='';for await(const chunk of req)body+=chunk;const mode=JSON.parse(body).mode;if(!['starter','maximum','large-count'].includes(mode))throw Error('Unknown fixture');await reset(mode);res.writeHead(200,{'content-type':'application/json'});res.end('{}');return;}
 if(url.pathname==='/qa/command'){let body='';for await(const chunk of req)body+=chunk;const started=performance.now();const response=await handler(new Request('http://127.0.0.1:'+port+url.pathname,{method:'POST',headers:{authorization:req.headers.authorization||'','content-type':'application/json'},body}));const data=await response.json();data.qaMs=performance.now()-started;res.writeHead(response.status,{'content-type':'application/json'});res.end(JSON.stringify(data));return;}
 const path=resolve(root,'.'+(url.pathname==='/'?'/tests/fixtures/aura-forge.html':url.pathname));if(!path.startsWith(root+sep)||url.pathname.split('/').some(p=>p.startsWith('.'))||!types[extname(path)]){res.writeHead(404);res.end();return;}const contents=await readFile(path);res.writeHead(200,{'content-type':types[extname(path)]});res.end(contents);
}catch(error){res.writeHead(400,{'content-type':'application/json'});res.end(JSON.stringify({error:error.message}));}}).listen(port,'127.0.0.1',()=>console.log('Disposable Aura Forge preview: http://127.0.0.1:'+port));
