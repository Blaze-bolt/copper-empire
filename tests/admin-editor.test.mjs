import test from 'node:test';import assert from 'node:assert/strict';import * as E from '../src/empire/state.js';import {DOLLAR,MG} from '../src/empire/data.js';import {editSave,marketDefaults,validateMarketConfig,priceInteger} from '../supabase/functions/admin-editor.js';import {handleWorkshop} from '../supabase/functions/admin-service.js';import {OnlineWorkshop} from '../src/online/client.js';
test('money and six copper qualities use exact durable arithmetic; grants do not forge earned records',()=>{
 let s=E.newState();s.money=5000n*DOLLAR;s.copper[0]=750n*MG.g;
 const edit=p=>s=editSave(s,p).state;
 edit({kind:'money-multiply',value:10});assert.equal(s.money,50000n*DOLLAR);edit({kind:'money-multiply',value:2});assert.equal(s.money,100000n*DOLLAR);edit({kind:'money-add',value:'0.000000001'});assert.equal(s.money,100000n*DOLLAR+1n);
 edit({kind:'copper-multiply',quality:0,value:10});assert.equal(s.copper[0],7500n*MG.g);edit({kind:'copper-multiply',quality:0,value:2});assert.equal(s.copper[0],15n*MG.kg);
 for(let quality=0;quality<6;quality++){edit({kind:'copper-set',quality,value:'1.25',unit:'Mt'});edit({kind:'copper-multiply',quality,value:2});assert.equal(s.copper[quality],2500000000000000n);}
 const restored=E.decode(E.encode(s));assert.deepEqual(restored,s);assert.equal(s.stats.moneyEarned,0n);assert.equal(s.stats.copperCollected,0n);assert.equal(s.run.earned,0n);assert.equal(s.stats.completed,0);assert.deepEqual(s.run.devices,[]);
});
test('progression editing changes actual eligibility while preserving separate prerequisites',()=>{
 let s=E.newState();const edit=p=>s=editSave(s,p).state;edit({kind:'rebirth-set',value:12});edit({kind:'level-set',value:28});assert.equal(E.level(s),28);assert.equal(s.rebirth,12);assert.equal(E.ascensionReady(s),false);assert.deepEqual(s.run.bosses,[]);
 edit({kind:'electronic',id:52,value:2});assert.equal(s.inventory[52],2);assert.equal(E.ascensionReady(s),false);edit({kind:'practice',id:87});assert.ok(s.encountered.includes(87));edit({kind:'tool',id:'precision'});assert.ok(E.bonuses(s).width>0);edit({kind:'prestige',value:20});assert.equal(s.pp,20);edit({kind:'xp-set',value:100});edit({kind:'xp-add',value:50});assert.equal(s.xp,150);
 edit({kind:'ascension',value:1});assert.ok(s.gold.unlocked);edit({kind:'ce-add',value:25});edit({kind:'ce-set',value:10});assert.equal(s.ascension.ce,10);edit({kind:'gold-set',value:2,unit:'kg'});edit({kind:'gold-multiply',value:10});assert.equal(s.gold.balance,20000000n);edit({kind:'gold-add',value:3,unit:'mg'});assert.equal(s.gold.recovered,0n);edit({kind:'gold-claims',value:6});assert.equal(s.gold.claims.length,7);edit({kind:'gold-equipment',id:'pan',value:4});assert.equal(s.gold.equipment.pan,4);edit({kind:'gold-research',id:'legacy'});assert.ok(s.gold.research.includes('legacy'));assert.deepEqual(s.ascension.records,[]);assert.deepEqual(s.achievements,[]);
});
test('editor rejects negative, nonfinite, fractional mg, unknown IDs, overflow and out-of-range ranks',()=>{
 const s=E.newState();for(const p of [{kind:'money-set',value:'-1'},{kind:'money-set',value:'Infinity'},{kind:'money-set',value:'9'.repeat(111)},{kind:'copper-set',quality:0,unit:'mg',value:'.1'},{kind:'copper-set',quality:6,unit:'g',value:'1'},{kind:'rebirth-set',value:19},{kind:'xp-set',value:Infinity},{kind:'ascension',value:6},{kind:'gold-equipment',id:'map',value:2},{kind:'tool',id:'fake'},{kind:'electronic',id:88,value:1},{kind:'money-multiply',value:3}])assert.throws(()=>editSave(s,p));assert.equal(s.money,0n);
});
test('market configuration validates asymmetric caps, directions and exact four-decimal prices',()=>{
 for(const asset of ['copper','gold'])assert.deepEqual(validateMarketConfig(marketDefaults(asset)),marketDefaults(asset));assert.equal(priceInteger('1.0001'),10001);assert.equal(priceInteger('-0.5',true),-5000);assert.throws(()=>priceInteger('1.00001'));for(const cfg of [{...marketDefaults('copper'),minimum:7000},{...marketDefaults('copper'),probabilities:[20,20,20,20]},{...marketDefaults('copper'),momentum:2},{...marketDefaults('copper'),up:[2,5,8,Infinity]},{...marketDefaults('copper'),mode:'win'}])assert.throws(()=>validateMarketConfig(cfg));
});
test('forged frontend owner flags, usernames, emails, and slot names cannot authorize backend edits',async()=>{
 const db={rpc:async(name,args)=>{if(name==='empire_admin_status')return {owner:false};throw Error('Unexpected privileged RPC '+name);}};
 for(const command of ['admin-save','admin-market','purchase'])await assert.rejects(handleWorkshop(db,'not-owner',{command,slot:'debug',isAdmin:true,username:'copper',email:'marcas.bolt@outlook.com',requestId:crypto.randomUUID(),revision:0,payload:{action:'edit',edit:{kind:'money-set',value:100}}}),/OWNER_ONLY/);
 await assert.rejects(handleWorkshop(db,'not-owner',{command:'load',slot:'../main'}),/Unknown save slot/);
});
test('client pins every pending command to its original slot and applies revisions only to that response',async()=>{
 const o=new OnlineWorkshop();o.slot='debug';o.revision=7;o.api=async req=>{assert.equal(req.slot,'debug');assert.equal(req.revision,7);return {state:{},slot:'debug',revision:8,classification:'debug'};};await o.command('purchase',{id:1});assert.equal(o.revision,8);assert.equal(o.classification,'debug');o.api=async()=>({state:{},slot:'main',revision:0});await assert.rejects(o.command('purchase',{id:1}),/slot mismatch/);assert.equal(o.slot,'debug');assert.equal(o.revision,8);assert.ok(o.pending);assert.equal(o.pending.slot,'debug');
});
