import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.118.0';
import {handleCommand,pack,storedState} from '../service.js';
import {newState,expansionDefaults,decode} from '../../../src/empire/state.js';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS','Content-Type':'application/json'};
const send=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:cors});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(req.method!=='POST')return send({error:'Use POST'},405);
 if(Number(req.headers.get('content-length'))>3000000)return send({error:'Request too large'},413);
 try{
  const url=Deno.env.get('SUPABASE_URL')!,key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  // Authentication is performed here, rather than relying on the legacy JWT gateway.
  const token=req.headers.get('authorization')?.replace(/^Bearer /i,'');
  if(!token)return send({error:'Sign in to continue.'},401);
  const {data:{user},error}=await client.auth.getUser(token);
  if(error||!user||!user.email_confirmed_at)return send({error:'Sign in with a verified email address.'},401);
  const raw=await req.text();if(raw.length>3000000)return send({error:'Request too large'},413);
  const body=JSON.parse(raw);
  const db={rpc:async(name:string,args:unknown)=>{const r=await client.rpc(name,args);if(r.error)throw Error(r.error.message);return r.data;}};
  if(body.command==='load'){const data=await db.rpc('empire_load',{p_user:user.id,p_initial:storedState(newState())});data.state=pack(expansionDefaults(decode(JSON.stringify(data.state))));const quotes=await db.rpc('empire_quotes',{});Object.assign(data.state.market,quotes.copper);Object.assign(data.state.goldMarket,quotes.gold);return send(data);}
  return send(await handleCommand(db,user.id,body));
 }catch(error){return send({error:error.message||'Request failed'},400);}
});
