import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.118.0';
import {createEmpireHandler} from '../http-handler.js';
const url=Deno.env.get('SUPABASE_URL')!,key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const db={rpc:async(name:string,args:unknown)=>{const r=await client.rpc(name,args);if(r.error)throw Error(r.error.message);return r.data;}};
Deno.serve(createEmpireHandler({db,authenticate:async(token:string)=>{const {data,error}=await client.auth.getUser(token);return error?null:data.user;}}));
