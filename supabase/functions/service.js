import {addPurchasedCopper} from '../../src/empire/copper-sales.js';
import {stageReport} from '../../src/empire/grading.js';
import * as E from '../../src/empire/state.js';
import * as I from '../../src/empire/industry-state.js';
import * as T from '../../src/empire/trade-state.js';
import {countryById} from '../../src/empire/trade-data.js';
import {createGame,gameAction,tickGame} from '../../src/empire/games.js';
import {deviceById} from '../../src/empire/catalogue.js';
import {BOSSES,QUALITY,DOLLAR} from '../../src/empire/data.js';
export const pack=x=>JSON.parse(E.encode(x));
export function storedState(s){const copy=pack(s);copy.goldMarket={global:true};copy.market={global:true,upgrades:copy.market.upgrades,alert:copy.market.alert,limit:copy.market.limit,refreshAt:copy.market.refreshAt};return copy;}
export const unpack=x=>E.decode(JSON.stringify(x));
const integer=(n,min=0,max=119)=>{if(!Number.isInteger(n)||n<min||n>max)throw Error('Invalid selection.');return n;};
const amount=x=>{if(typeof x!=='string'||!/^\d{1,110}$/.test(x)||BigInt(x)<=0n)throw Error('Enter a positive, exact copper amount.');return BigInt(x);};
const seed=()=>crypto.getRandomValues(new Uint32Array(1))[0];
export function replayStage(attempt,state,events,now=Date.now(),checkpoint=false){
 if(attempt?.status!=='active'||!Array.isArray(events)||events.length>60000)throw Error('No active challenge or recording too large.');
 const g=createGame(attempt.stages[attempt.index],attempt.difficulty,attempt.seed+attempt.index*7919,E.bonuses(state));
 if(attempt.checkpoint&&g.id===1&&!g.duration)Object.assign(g,attempt.checkpoint);
 let simulated=g.elapsed;
 for(const event of events){
  if(!Array.isArray(event)||g.status!=='active')throw Error('Invalid challenge recording.');
  if(event[0]==='t'){
   const dt=event[1];if(!Number.isFinite(dt)||dt<=0||dt>.040001)throw Error('Invalid clock.');
   simulated+=dt;if(simulated-(attempt.checkpoint?.elapsed||0)>600||simulated>(now-attempt.launchedAt)/1000+1)throw Error('Challenge clock exceeds elapsed server time.');tickGame(g,dt);
  }else if(event[0]==='a'){if(checkpoint)throw Error('A clock checkpoint cannot contain player actions.');
   const [,action,payload]=event;
   if(typeof action!=='string'||action.length>30||!payload||typeof payload!=='object'||JSON.stringify(payload).length>500||Object.values(payload).some(v=>typeof v==='number'&&!Number.isFinite(v)))throw Error('Invalid controls.');
   if(action==='hint'){if(attempt.hints>=E.bonuses(state).hint)throw Error('No hints remaining.');attempt.hints++;}
   if(action==='replay'){if(g.phase!=='input'||attempt.replays>=E.bonuses(state).replay)throw Error('No replay remaining.');attempt.replays++;}
   gameAction(g,action,payload);
  }else throw Error('Unknown recording event.');
 }
 if(checkpoint){if(g.id!==1||g.duration||g.status!=='active')throw Error('No clock checkpoint is available for this challenge.');attempt.checkpoint={position:g.position,direction:g.direction,elapsed:g.elapsed};return 0;}
 if(g.status!=='success')throw Error('The challenge was not completed. No reward awarded.');
 const report=stageReport(g);attempt.pendingStageReport=report;return report.score;
}
export function transition(s,a,command,p={},now=Date.now(),context={}){
 E.expansionDefaults(s);E.claimLegacyIndustrial(s);E.migrateAttempt(a);let result=null,trade=null,worldGate=null;
 const world=context.world,owner=context.user||'local';
 const gateWorld=()=>{if(!world||p.version!==world.version||p.newsVersion!==world.newsVersion)throw Error('EXPORT_QUOTE_CHANGED: Refresh and review current worldwide prices.');worldGate={version:world.version,newsVersion:world.newsVersion};};
 const exportInfo=()=>{gateWorld();const country=countryById(p.country||'AU'),row=world.prices.find(x=>x.country===country?.id&&x.product===p.product);if(!country||!row)throw Error('Unknown export route.');return {unitPrice:row.price,minutes:country.minutes,personalBps:T.personalBps(s,country.id)};};
 const id=String(p.id??'');
 if(a&&['active','briefing'].includes(a.status)&&!['launch','stage','checkpoint','fail','begin','heartbeat'].includes(command))throw Error('Finish or leave your current attempt first.');
 switch(command){
 case 'factory-build':I.buildFactory(s,Number(p.factory));break;
 case 'factory-upgrade':I.upgradeFactory(s,Number(p.factory),id,p.rank);break;
 case 'worker-hire':I.hireWorker(s,id);break;
 case 'worker-assign':I.assignWorker(s,id,Number(p.factory));break;
 case 'factory-license':I.automationLicense(s,id);break;
 case 'factory-research':I.researchIndustry(s,Number(id));break;
 case 'factory-reserve':result=I.reserveProduction(s,p,now,exportInfo());trade={quote:s.market.quote,volume:0n};break;
 case 'factory-collect':result=I.collectProduction(s,id,now);break;
 case 'factory-queue':I.queueProduction(s,p,exportInfo());trade={quote:s.market.quote,volume:0n};break;
 case 'factory-queue-manage':I.manageQueue(s,p.factory,p.action,id);break;
 case 'factory-begin':{
  if(a&&['active','briefing'].includes(a.status))throw Error('Finish or leave this attempt before starting production.');
  a=I.beginProduction(s,id,seed(),now);break;
 }
 case 'factory-practice':{
  if(s.ascension.level<2||!s.industry.facilities.length)throw Error('Construct your first A2 factory before practicing production.');
  a={id:crypto.randomUUID(),mode:'factory-practice',device:1,stages:[integer(p.game,2001,2030)],index:0,scores:[],status:'briefing',seed:seed(),difficulty:6,hints:0,replays:0,paid:false};break;
 }
 case 'ship-buy':result=T.buyShip(s,id,owner);break;
 case 'port-upgrade':T.portUpgrade(s,id,p.rank);break;
 case 'trade-agreement':T.buyAgreement(s,p.country,!!p.strategic);break;
 case 'export-accept':gateWorld();result=T.acceptExportContract(s,p,world,now);break;
 case 'ship-dispatch':gateWorld();result=T.dispatchShipment(s,p,world,owner,now);trade={quote:s.market.quote,volume:0n};break;
 case 'ship-cancel':result=T.cancelShipment(s,id,now);break;
 case 'loading-plan':T.saveLoadingPlan(s,p);break;
 case 'loading-plan-delete':T.deleteLoadingPlan(s,id);break;
 case 'trade-refresh':I.industryBackground(s,now,context.world);T.tradeBackground(s,now);break;
 case 'heartbeat':if(!a||!['active','briefing'].includes(a.status))E.background(s,now,context.world);break;
 case 'begin':{
  const n=integer(p.device,1),mode=p.mode||'device';if(!['device','practice','trial','boss','furnace','ascension','gold'].includes(mode))throw Error('Unknown attempt.');
  if(mode==='device'&&n===1&&!s.inventory[1])E.purchaseDevice(s,1);
  const boss=mode==='boss'?BOSSES.find(b=>b.id===p.boss):null;
  const d=deviceById(n);let difficulty=d.difficulty;
  if(mode==='practice')difficulty=integer(p.difficulty,0,6);
  if(mode==='ascension'||mode==='gold')difficulty=6;if(mode==='trial')difficulty=Math.min(6,Math.floor(s.rebirth/2));
  if(mode==='boss'){if(!boss)throw Error('Unknown boss.');difficulty=boss.difficulty;}
  if(p.expert){if(s.rebirth<4)throw Error('Expert unlocks at Rebirth 4.');difficulty=Math.max(4,difficulty);}
  if(a&&['active','briefing'].includes(a.status)){if(a.mode==='factory')I.failProduction(s,a);a.status='active';E.stageFail(s,a);}
  if(mode==='furnace'){
   const job=s.furnace.jobs.find(j=>j.id===id);if(!job||job.bonusUsed||now>=job.ends)throw Error('Bonus unavailable.');job.bonusUsed=true;
   a={id:crypto.randomUUID(),mode,job:id,device:1,stages:[1],index:0,scores:[],status:'briefing',seed:seed(),difficulty:1,hints:0,replays:0,paid:false};
  }else a=E.begin(s,n,{mode,difficulty,seed:seed(),boss});break;
 }
 case 'launch':if(a?.status!=='briefing')throw Error('No challenge to launch.');a.status='active';a.launchedAt=now;delete a.checkpoint;{const n=a.stages[a.index];if(n<=119&&!s.encountered.includes(n))s.encountered.push(n);}break;
 case 'checkpoint':if(p.attempt!==a?.id||p.index!==a.index)throw Error('This stage is no longer current.');replayStage(a,s,p.events,now,true);break;
 case 'stage':{
  if(p.attempt!==a?.id||p.index!==a.index)throw Error('This stage is no longer current.');
  const score=replayStage(a,s,p.events,now);E.stagePass(a,score,a.pendingStageReport);delete a.pendingStageReport;
  if(a.status==='complete'){
   if(a.mode==='furnace'){const job=s.furnace.jobs.find(j=>j.id===a.job),saved=E.furnaceBonus(s,job,now);a.paid=true;result={furnace:true,secondsSaved:saved/1000};}
   else if(a.mode==='factory')result=I.finishProductionChallenge(s,a,E.performanceGrade(a.scores),now);
   else if(a.mode==='factory-practice'){a.paid=true;if(a.stages[0]>=2026&&!s.industry.optional.includes(a.stages[0]))s.industry.optional.push(a.stages[0]);result={practice:true,grade:E.performanceGrade(a.scores),amount:0n,xp:0};}
   else result=E.reward(s,a);
  }break;
 }
 case 'retry-trial-stage':E.retryAscensionStage(s,a);break;
 case 'fail':if(a&&['active','briefing'].includes(a.status)){if(a.mode==='factory')I.failProduction(s,a);a.status='active';E.stageFail(s,a);}break;
 case 'refund-essence':result={refunded:E.refundEssence(s)};break;
 case 'compression':E.buyCompression(s,integer(p.rank,1,7));break;
 case 'essence':E.buyEssence(s,id,integer(p.rank,1,5));break;
 case 'gold-equipment':E.buyGoldEquipment(s,id,integer(p.rank,1,5));break;
 case 'gold-research':E.buyGoldResearch(s,id);break;
 case 'gold-claim':E.unlockGoldClaim(s,integer(Number(id),1,6));break;
 case 'confirm-ascension':result=E.confirmAscension(s);break;
 case 'purchase':E.purchaseDevice(s,integer(Number(id),1));break;
 case 'tool':E.buyTool(s,id);break;
 case 'market-upgrade':E.buyMarket(s,id);break;
 case 'trade':{
  if(p.asset==='gold'){const n=amount(p.amount);if(p.quote!==s.goldMarket.quote)throw Error('QUOTE_CHANGED: Review the new gold price.');result=E.tradeGold(s,p.side,n,p.quote);trade={quote:p.quote,volume:p.side==='buy'?n:-n,asset:'gold'};break;}if(p.asset&&p.asset!=='copper')throw Error('Unknown market asset.');
  const q=integer(p.quality??0,0,5),n=amount(p.amount);if(p.quote!==s.market.quote)throw Error('QUOTE_CHANGED: Review the new price.');
  if(p.side==='sell'){result={side:'sell',amount:n,quality:q,quote:s.market.quote,proceeds:E.sell(s,n,q)};trade={quote:s.market.quote,volume:-n};}
  else if(p.side==='buy'&&q===0){const cost=(n*BigInt(s.market.quote)*100n*101n+99n)/100n;if(s.money<cost)throw Error('Not enough money.');s.money-=cost;s.stats.moneySpent+=cost;addPurchasedCopper(s,n);result={side:'buy',amount:n,quality:0,quote:s.market.quote,cost};trade={quote:s.market.quote,volume:n};}
  else throw Error('Unknown trade.');break;
 }
 case 'set-alert':s.market.alert=integer(p.quote,s.market.minimum||3000,s.market.maximum||20000);break;
 case 'limit-order':{const n=amount(p.amount),q=integer(p.quality,0,5);if(!s.market.upgrades.includes('terminal')||n>s.copper[q])throw Error('Check the order quantity and terminal upgrade.');s.market.limit={amount:n,quality:q,quote:integer(p.quote,s.market.minimum||3000,s.market.maximum||20000)};break;}
 case 'cancel-order':s.market.limit=null;break;
 case 'market-refresh':if(!s.market.upgrades.includes('permit')||now<s.market.refreshAt||s.money<25000n*DOLLAR)throw Error('Check your permit, funds, and cooldown.');s.money-=25000n*DOLLAR;s.stats.moneySpent+=25000n*DOLLAR;s.market.refreshAt=now+60000;trade={quote:s.market.quote,volume:20000000n};result={message:'A shared demand signal was submitted for the next tick. The price is not guaranteed to rise.'};break;
 case 'craft':E.craft(s,id);break;
 case 'research':E.research(s,id);break;
 case 'aura-capacity':result=E.buyAuraCapacity(s,integer(p.tier,1,16));break;
 case 'aura-roll':case 'roll':{const before=[...s.achievements];result=E.rollAuras(s,p.quantity??1);E.checkAchievements(s);result.achievements=s.achievements.filter(id=>!before.includes(id));break;}
 case 'equip-aura':case 'equip-and-close':E.equipAura(s,id,now);break;
 case 'aura-unequip':E.equipAura(s,null,now);break;
 case 'confirm-rebirth':result=E.confirmRebirth(s);break;
 case 'prestige':E.buyPrestige(s,id);break;
 case 'furnace-queue':E.queueFurnace(s,amount(p.amount),now);break;
 case 'furnace-cancel':E.cancelFurnaceQueue(s,id);break;
 case 'furnace-start':E.startFurnace(s,amount(p.amount),now);break;
 case 'furnace-collect':result=E.collectFurnace(s,id,now);break;
 case 'furnace-upgrade':E.buyFurnaceUpgrade(s,id);break;
 case 'sell-ingots':case 'sell-refined':{const n=BigInt(command==='sell-refined'?s.furnace.refined:s.furnace.ingots)*(command==='sell-refined'?10000000n:1000000n);result=E.sellIngots(s,command==='sell-refined');trade={quote:s.market.quote,volume:-n};break;}
 case 'buy-automation':E.buyAutomation(s);break;
 case 'auto-toggle':if(!s.automation.purchased||!['wire','stock'].includes(id))throw Error('Automation unavailable.');s.automation[id]=!s.automation[id];break;
 case 'buy-refining':E.buyRefining(s);break;
 case 'refine':E.refine(s);break;
 case 'refining-research':E.refineResearch(s);break;
 case 'accept-contract':E.acceptContract(s,E.availableContracts(s).find(c=>c.id===id));break;
 case 'claim-contract':E.claimContract(s,id);break;
 case 'setting':case 'sound':{const key=command==='sound'?'sound':id;if(!['sound','motion'].includes(key))throw Error('Unknown preference.');s.settings[key]=!s.settings[key];break;}
 default:throw Error('Unknown workshop command.');
 }
 // Limit orders execute on an authenticated heartbeat, atomically at the shared quote.
 if(command==='heartbeat'&&!a?.status?.match(/active|briefing/)&&s.market.limit&&s.market.upgrades.includes('terminal')){
  const order=s.market.limit;if(s.market.quote>=order.quote&&s.copper[order.quality]>=order.amount){result={proceeds:E.sell(s,order.amount,order.quality),limit:true};trade={quote:s.market.quote,volume:-order.amount};s.market.limit=null;}
 }
 if(context.world&&context.feesBefore!==undefined&&s.industry.stats.fees!==context.feesBefore){worldGate={version:context.world.version,newsVersion:context.world.newsVersion};trade??={quote:s.market.quote,volume:0n};}
 E.checkAchievements(s);return {state:s,attempt:a,result,trade,worldGate};
}
export async function handleCommand(db,user,body,now=Date.now()){
 if(!/^[0-9a-f-]{36}$/i.test(body.requestId||'')||!Number.isSafeInteger(body.revision))throw Error('Invalid request identity.');
 const receipt=await db.rpc('empire_receipt',{p_user:user,p_request:body.requestId});if(receipt){const quotes=await db.rpc('empire_quotes',{});receipt.state=pack(E.expansionDefaults(unpack(receipt.state)));Object.assign(receipt.state.market,quotes.copper);Object.assign(receipt.state.goldMarket,quotes.gold);return receipt;}
 const initial=E.newState(now);initial.market.global=true;
 const loaded=await db.rpc('empire_load',{p_user:user,p_initial:storedState(initial)});
 if(loaded.revision!==body.revision)throw Error('SAVE_CONFLICT: Another device changed your workshop. Refresh before continuing.');
 const s=E.expansionDefaults(unpack(loaded.state)),a=unpack(loaded.attempt);const quotes=await db.rpc('empire_quotes',{});Object.assign(s.market,quotes.copper);s.market.history=[];Object.assign(s.goldMarket,quotes.gold);s.goldMarket.history=[];
 const context={user,feesBefore:s.industry.stats.fees};if((['heartbeat','trade-refresh'].includes(body.command)&&s.industry.facilities.some(f=>f.queue.length))||['factory-reserve','factory-queue','ship-dispatch','export-accept'].includes(body.command))context.world=unpack(await db.rpc('empire_export_world',{}));
 const before=E.encode(s);const t=transition(s,a,body.command,body.payload,now,context);
 if(body.command==='heartbeat'&&before===E.encode(t.state))return {state:pack(t.state),attempt:pack(t.attempt),revision:loaded.revision,result:null,classification:loaded.classification};
 const args={p_user:user,p_request:body.requestId,p_expected:body.revision,p_state:storedState(t.state),p_attempt:pack(t.attempt),p_result:pack(t.result),p_quote:t.trade?.quote??null,p_volume:t.trade?.volume.toString()??'0',p_asset:t.trade?.asset||'copper'};
 if(t.worldGate)Object.assign(args,{p_world_epoch:t.worldGate.version,p_news_epoch:t.worldGate.newsVersion,p_slot:body.slot||'main'});
 const forge=['aura-roll','aura-capacity','roll'].includes(body.command);if(forge){delete args.p_quote;delete args.p_volume;delete args.p_asset;Object.assign(args,{p_slot:body.slot||'main',p_command:body.command==='roll'?'aura-roll':body.command,p_quantity:body.payload?.quantity??1,p_tier:body.payload?.tier??0});}
 const committed=await db.rpc(forge?'empire_commit_forge':t.worldGate?'empire_commit_industry':'empire_commit_asset',args);Object.assign(committed.state.market,quotes.copper);Object.assign(committed.state.goldMarket,quotes.gold);return committed;
}
