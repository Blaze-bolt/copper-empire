import {handleWorkshop,loadSlot} from './admin-service.js';
// Old open tabs may finish their existing challenges. They must reload before
// buying with obsolete Ascension discounts or confirming an outdated reset warning.
export function clientResponse(data,version){if(Number(version)>=6)return {...data,serverVersion:6};const a=data.attempt;return {...data,serverVersion:6,attempt:a?.mode==='gold'?{...a,stages:a.stages.map(id=>id>=1001&&id<=1007?id-900:id)}:a};}
export async function handleClientWorkshop(db,user,body,now=Date.now()){
 if(Number(body.clientVersion||0)<6){if(body.command==='confirm-ascension')throw Error('UPDATE_REQUIRED: Reload Copper Empire to review the new Ascension rewards and reset rules. Your progress is saved.');if(['purchase','tool'].includes(body.command)){const loaded=await loadSlot(db,user,body.slot||'main');if(loaded.state.ascension.level>0)throw Error('UPDATE_REQUIRED: Reload Copper Empire to review the current purchase price. Your money, copper and inventory are unchanged.');}}
 return clientResponse(await handleWorkshop(db,user,body,now),body.clientVersion);
}
