import {auraEffects} from './aura-data.js';
import {DOLLAR} from './data.js';
export const BILLION=1000000000n*DOLLAR;
export function freight(gross,volume,minutes=15,rank=0){
 if(typeof gross!=='bigint'||gross<0n||!Number.isSafeInteger(volume)||volume<1||!Number.isSafeInteger(minutes)||minutes<15||!Number.isInteger(rank)||rank<0||rank>10)throw Error('Invalid shipment freight inputs.');
 return ((gross*225n+BigInt(volume)*BILLION*BigInt(minutes)*500n)*BigInt(100-3*rank)+2999999n)/3000000n;
}
export function productionFee(s,product,quantity){if(!Number.isSafeInteger(quantity)||quantity<1||quantity>1000000)throw Error('Choose a valid batch quantity.');return product.fee*BigInt(quantity)*BigInt(s.ascension?.level>=2?85:100)*BigInt(100-(auraEffects(s).fee||0))/10000n;}
export function opportunityCost(product,quantity,quote){if(!Number.isSafeInteger(quantity)||quantity<1||!Number.isInteger(quote)||quote<1||quote>2000000000)throw Error('Invalid current copper quote.');return product.copper*BigInt(quantity)*BigInt(quote)*100n;}
export function marginBreakdown({product,quantity=1,quote,unitPrice,fee,wages=0n,minutes=15,logistics=0,qualityBps=0,personalBps=0}){
 if(typeof unitPrice!=='bigint'||unitPrice<1n||typeof fee!=='bigint'||fee<0n||typeof wages!=='bigint'||wages<0n||!Number.isInteger(qualityBps)||qualityBps<0||qualityBps>1000||!Number.isInteger(personalBps)||personalBps<0||personalBps>1800)throw Error('Invalid export breakdown.');
 const base=unitPrice*BigInt(quantity),quality=base*BigInt(qualityBps)/10000n,personal=(base+quality)*BigInt(personalBps)/10000n,gross=base+quality+personal;
 const copper=opportunityCost(product,quantity,quote),shipping=freight(gross,product.volume*quantity,minutes,logistics);
 return {base,quality,personal,gross,copper,fee,wages,shipping,net:gross-copper-fee-wages-shipping};
}
