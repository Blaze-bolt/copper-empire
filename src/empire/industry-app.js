import {countryById} from './trade-data.js';
import {personalBps} from './trade-state.js';
import * as I from './industry-state.js';
import {productionReview} from './industry-ui.js';
import {seedNow} from './data.js';
export function connectIndustry(c){
 const execute=async(command,p)=>{if(c.online.active){const data=await c.online.command(command,p);c.applyCloud(data);return data;}const s=c.state();let result=null,attempt=null;switch(command){
 case 'factory-build':I.buildFactory(s,p.factory);break;
 case 'factory-upgrade':I.upgradeFactory(s,p.factory,p.id,p.rank);break;
 case 'worker-hire':I.hireWorker(s,p.id);break;
 case 'worker-assign':I.assignWorker(s,p.id,p.factory);break;
 case 'factory-license':I.automationLicense(s,p.id);break;
 case 'factory-research':I.researchIndustry(s,Number(p.id));break;
 case 'factory-reserve':{const w=await c.world(),country=countryById(p.country);result=I.reserveProduction(s,p,Date.now(),{unitPrice:w.prices.find(q=>q.product===p.product&&q.country===p.country).price,minutes:country.minutes,personalBps:personalBps(s,p.country)});} break;
 case 'factory-collect':result=I.collectProduction(s,p.id);break;
 case 'factory-queue':I.queueProduction(s,p);break;
 case 'factory-queue-manage':I.manageQueue(s,p.factory,p.action,p.id);break;
 case 'factory-begin':attempt=I.beginProduction(s,p.id,seedNow());break;
 case 'factory-practice':if(s.ascension.level<2||!s.industry.facilities.length)throw Error('Construct an A2 factory before practicing.');attempt={id:'factory-practice-'+seedNow(),mode:'factory-practice',device:1,stages:[p.game],index:0,scores:[],status:'briefing',seed:seedNow(),difficulty:6,hints:0,replays:0,paid:false};break;
 default:throw Error('Unknown factory action.');
 }c.checkAchievements?.(s);c.save();return {result,attempt};};
 return {
 async action(name,el){const v=c.ui.industry,p={id:el.dataset.id,factory:Number(el.dataset.factory||v?.factory||1)};if(!name.startsWith('industry-'))return false;const n=name.slice(9);if(n==='close'){c.close();return true;}if(n==='tab'){v.tab=p.id;c.render();return true;}if(n==='recipe'){v.product=p.id;v.tab='production';c.render();return true;}
 if(n==='review'||n==='queue-review'){const w=await c.world(),country=countryById(c.ui.tradeFields?.country||'AU'),q=I.productionPreview(c.state(),Number(v.factory),v.product,Number(v.quantity),!!v.auto);c.ui.industryPending={factory:Number(v.factory),product:v.product,quantity:Number(v.quantity),auto:!!v.auto,quote:c.state().market.quote,country:country.id,version:w.version,newsVersion:w.newsVersion,expectedFee:q.fee.toString(),expectedWages:q.wages.toString(),expectedCopper:q.copper.toString()};c.modal(productionReview(c.state(),c.ui,n==='queue-review',{unitPrice:w.prices.find(q=>q.country===country.id&&q.product===v.product).price,minutes:country.minutes,personalBps:personalBps(c.state(),country.id)}),'result-modal');return true;}
 let command;
 if(n==='reserve-confirm'||n==='queue-confirm'){const data=await execute(n==='reserve-confirm'?'factory-reserve':'factory-queue',{...c.ui.industryPending,acceptLoss:el.dataset.loss==='true'});c.close();c.render();if(data.result&&!data.result.auto)c.startAttempt((await execute('factory-begin',{id:data.result.id})).attempt);return true;}
 if(n==='build')command='factory-build';if(n==='upgrade'){command='factory-upgrade';p.rank=Number(el.dataset.rank);}if(n==='hire')command='worker-hire';if(n==='worker-assign'||n==='worker-dismiss'){command='worker-assign';if(n==='worker-dismiss')p.factory=0;}if(n==='license')command='factory-license';if(n==='research')command='factory-research';if(n==='collect')command='factory-collect';if(n==='begin')command='factory-begin';if(n==='practice'){command='factory-practice';p.game=Number(p.id);}if(n.startsWith('queue-')){command='factory-queue-manage';p.action=n==='queue-pause'?'pause':n==='queue-first'?'first':'cancel';}if(!command)throw Error('Unknown industrial control.');const data=await execute(command,p);if(data.attempt)c.startAttempt(data.attempt);else{c.render();c.toast('Industrial workshop saved.');}return true;
 },
 field(el){if(!el.matches('[data-industry-field]'))return false;const v=c.ui.industry;if(el.id==='factory-id')v.factory=Number(el.value);if(el.id==='factory-product')v.product=el.value;if(el.id==='factory-quantity'){v.quantity=Number(el.value);return true;}if(el.id==='factory-auto')v.auto=el.value==='1';c.render();return true;}
 };
}
