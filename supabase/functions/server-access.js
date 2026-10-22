// Private testing credentials never enter workshop snapshots or audit details.
export const TESTING_TTL = 7200000;
export const HASH_ROUNDS = 600000;
const hex = bytes => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
const bytes = value => Uint8Array.from(value.match(/../g) || [], x => parseInt(x, 16));
export const randomToken = () => hex(crypto.getRandomValues(new Uint8Array(32)));
export async function digest(value) { return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))); }
async function derive(code, salt, rounds) {
 const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(code), 'PBKDF2', false, ['deriveBits']);
 return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:bytes(salt),iterations:rounds,hash:'SHA-256'}, key, 256)));
}
export async function hashCode(code) {
 if (typeof code !== 'string' || code.length < 10 || code.length > 128) throw Error('Use a testing code with 10–128 characters.');
 const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
 return {salt, hash:await derive(code, salt, HASH_ROUNDS), rounds:HASH_ROUNDS};
}
export async function verifyCode(code, secret) {
 if (!secret?.hash || !/^[a-f0-9]{32}$/.test(secret.salt || '') || secret.rounds !== HASH_ROUNDS) return false;
 const actual = await derive(code, secret.salt, secret.rounds);
 let difference = actual.length ^ secret.hash.length;
 for(let i=0;i<actual.length;i++) difference |= actual.charCodeAt(i) ^ secret.hash.charCodeAt(i);
 return difference === 0;
}
const writes = new Set(['empire_load','empire_slot_load','empire_commit','empire_commit_asset','empire_debug_commit','empire_commit_industry','empire_commit_forge','empire_unified_commit','empire_unified_debug_copy','empire_unified_moderate','empire_admin_save']);
export const accessReads = new Set(['admin-status','unified-load','unified-recovery','save-export']);
export async function accessStatus(db, user, token) {
 return db.rpc('empire_access_status',{p_user:user || null,p_token:token ? await digest(token) : null});
}
export function guardedDatabase(db, user, tokenHash) {
 return {rpc:(name,args={}) => writes.has(name) ? db.rpc('empire_lockdown_rpc',{p_user:user,p_token:tokenHash,p_name:name,p_args:args}) : db.rpc(name,args)};
}
export async function unlockTesting(db, user, code, network) {
 const limit = await db.rpc('empire_testing_attempt',{p_bucket:await digest(network || 'unknown')});
 if (!limit.allowed) return {error:'Too many attempts. Please try again later.',retryAfter:limit.retryAfter,rateLimited:true};
 if (typeof code !== 'string' || code.length < 10 || code.length > 128) return {error:'Testing code was not accepted.'};
 const secret = await db.rpc('empire_testing_secret',{});
 if (!await verifyCode(code, secret)) return {error:'Testing code was not accepted.'};
 const token=randomToken(), grant=await db.rpc('empire_testing_grant',{p_user:user || null,p_token:await digest(token),p_version:secret.version});
 return {token,expiresAt:grant.expiresAt,status:await accessStatus(db,user,token)};
}
export async function administerAccess(db,user,body) {
 const status=await db.rpc('empire_admin_status',{p_user:user});
 if(!status.owner) throw Error('OWNER_ONLY: Only the provisioned owner may change server access.');
 const p=body.payload || {};
 if(!/^[0-9a-f-]{36}$/i.test(body.requestId || '') || !Number.isSafeInteger(p.expectedVersion)) throw Error('Refresh server controls before changing them.');
 let payload={};
 if(p.action==='settings') {
  if(typeof p.enabled!=='boolean' || typeof (p.message ?? '')!=='string' || (p.message || '').length>1000) throw Error('Invalid maintenance settings.');
  const reopening=p.reopensAt == null || p.reopensAt === '' ? null : new Date(p.reopensAt).toISOString();
  payload={enabled:p.enabled,message:p.message || '',reopensAt:reopening,confirm:p.confirm===true};
 } else if(p.action==='code') payload={...await hashCode(p.code),revokeSessions:p.revokeSessions!==false};
 else if(['revoke-code','revoke-sessions'].includes(p.action)) payload={revokeSessions:p.revokeSessions!==false};
 else throw Error('Unknown server access control.');
 return db.rpc('empire_admin_lockdown',{p_user:user,p_request:body.requestId,p_action:p.action,p_payload:payload,p_expected:p.expectedVersion});
}
