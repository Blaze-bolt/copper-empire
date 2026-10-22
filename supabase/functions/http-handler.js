import {handleClientWorkshop} from './client-compat.js';
import {accessStatus,accessReads,guardedDatabase,unlockTesting,administerAccess,digest} from './server-access.js';
const cors={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info,x-empire-testing','Access-Control-Allow-Methods':'POST,OPTIONS','Content-Type':'application/json','Cache-Control':'no-store'};
const send=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:cors});
// The caller identity always comes from verified authentication, never JSON.
export function createEmpireHandler({authenticate,db}){return async req=>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(req.method!=='POST')return send({error:'Use POST'},405);
 if(Number(req.headers.get('content-length'))>3000000)return send({error:'Request too large'},413);
 try{
  const raw=await req.text();if(raw.length>3000000)return send({error:'Request too large'},413);
  const body=JSON.parse(raw),token=req.headers.get('authorization')?.replace(/^Bearer /i,''),testing=req.headers.get('x-empire-testing');
  if(testing&&!/^[a-f0-9]{64}$/.test(testing))return send({error:'Testing session is invalid.'},403);
  const user=token?await authenticate(token):null,uid=user?.id&&user.email_confirmed_at?user.id:null;
  if(body.command==='server-status')return send(await accessStatus(db,uid,testing));
  if(body.command==='testing-unlock')return send(await unlockTesting(db,uid,body.code,req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'));
  if(!uid)return send({error:'Sign in with a verified email address.'},401);
  if(body.command==='admin-status'){const admin=await db.rpc('empire_admin_status',{p_user:uid});if(admin.owner)admin.lockdown=await db.rpc('empire_lockdown_admin_status',{p_user:uid});return send(admin);}
  if(body.command==='admin-lockdown')return send(await administerAccess(db,uid,body));
  if(body.command==='admin-trajectory')return send(await db.rpc('empire_admin_trajectory',{p_user:uid,p_request:body.requestId,p_action:body.payload?.action,p_payload:body.payload || {},p_expected:body.payload?.expectedVersion}));
  if(body.command==='save-export')return send(await db.rpc('empire_unified_load',{p_user:uid}));
  if(!accessReads.has(body.command)){
   const access=await accessStatus(db,uid,testing);
   if(access.enabled&&!access.allowed)return send({error:'SERVER_LOCKDOWN: Your progress is preserved. The server is temporarily closed.',access},423);
  }
  return send(await handleClientWorkshop(guardedDatabase(db,uid,testing?await digest(testing):null),uid,body));
 }catch(error){return send({error:error.message||'Request failed'},String(error.message).includes('SERVER_LOCKDOWN')?423:400);}
};}
