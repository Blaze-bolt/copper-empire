import {handleClientWorkshop} from './client-compat.js';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS','Content-Type':'application/json'};
const send=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:cors});
// The caller identity always comes from verified authentication, never JSON.
export function createEmpireHandler({authenticate,db}){return async req=>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(req.method!=='POST')return send({error:'Use POST'},405);
 if(Number(req.headers.get('content-length'))>3000000)return send({error:'Request too large'},413);
 try{
  const token=req.headers.get('authorization')?.replace(/^Bearer /i,'');if(!token)return send({error:'Sign in to continue.'},401);
  const user=await authenticate(token);if(!user?.id||!user.email_confirmed_at)return send({error:'Sign in with a verified email address.'},401);
  const raw=await req.text();if(raw.length>3000000)return send({error:'Request too large'},413);
  return send(await handleClientWorkshop(db,user.id,JSON.parse(raw)));
 }catch(error){return send({error:error.message||'Request failed'},400);}
};}
