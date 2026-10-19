import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {MG,DOLLAR,parseCopper,copper,money} from '../src/empire/data.js';
import * as E from '../src/empire/state.js';
import {CATALOGUE} from '../src/empire/catalogue.js';
import {illustration} from '../src/empire/art.js';
import {INDUSTRIAL_MODELS} from '../src/empire/industrial-art.js';
import {MODEL_DESCRIPTIONS} from '../src/empire/model-descriptions.js';
import {editSave} from '../supabase/functions/admin-editor.js';
import {recipesFromSpecification} from '../scripts/industrial-economy.mjs';
import {freight,proposedPrice,comparison,TARGET_MARGINS} from '../scripts/industrial-rebalance.mjs';
test('Gt and Q formatting preserve exact huge balances and signed analytical results',()=>{
 assert.equal(MG.Gt,1000n*MG.Mt);assert.equal(parseCopper('1.25','Gt'),1250n*MG.Mt);
 assert.equal(copper(1250n*MG.Mt),'1.25 Gt');assert.equal(copper(2500000n*MG.Mt),'2,500 Gt');
 assert.equal(copper(-1250n*MG.Mt),'-1.25 Gt');assert.equal(copper(MG.Gt-1n),'999.99 Mt');
 assert.equal(money(1250000000000000n*DOLLAR,true),'$1.25Q');assert.equal(money(-1250000000000000n*DOLLAR,true),'-$1.25Q');
 assert.equal(E.saleValue(MG.Gt,6000),600000000000000n*DOLLAR);
 const s=E.newState();s.copper[0]=parseCopper('2500.000000000000000001','Gt');s.money=10n**90n+123456789n;
 const restored=E.load({getItem:k=>k===E.SAVE_KEY?E.encode(s):null});assert.equal(restored.copper[0],s.copper[0]);assert.equal(restored.money,s.money);
});
test('the owner editor accepts exact Gt values without converting through Number',()=>{
 const s=E.newState(),t=editSave(s,{kind:'copper-set',quality:0,unit:'Gt',value:'2500.000000000000000001'});
 assert.equal(t.state.copper[0],2500n*MG.Gt+1n);assert.equal(s.copper[0],0n);
});
test('all 87 catalogue definitions retain the pre-industrial authored contract',()=>{
 const fixture=JSON.parse(readFileSync(new URL('./fixtures/catalogue-87.json',import.meta.url)));
 assert.equal(CATALOGUE.slice(0,87).length,87);
 for(const [i,d]of CATALOGUE.slice(0,87).entries())for(const [key,value]of Object.entries(fixture[i]))assert.equal(String(d[key]),String(value),`${d.id} ${key}`);
});
test('all 59 replacements have individual layouts and meaningful part structure',()=>{
 assert.deepEqual(Object.keys(INDUSTRIAL_MODELS).map(Number),Array.from({length:59},(_,i)=>i+29));
 assert.equal(Object.keys(MODEL_DESCRIPTIONS).length,59);
 const geometry=new Set();
 for(let id=29;id<=87;id++){
  const d=CATALOGUE[id-1],a=illustration(d,'a'),b=illustration(d,'b'),body=INDUSTRIAL_MODELS[id]();
  assert.equal(a,b,'No shared SVG definition IDs or randomness');assert.match(a,new RegExp(`data-model="${id}"`));
  assert.ok((body.match(/data-part=/g)||[]).length>=5,`Part hierarchy ${id}`);assert.match(body,/copper/);
  assert.doesNotMatch(body,/NaN|undefined|Infinity|<script|onload=/);assert.ok(body.length<50000,`Mobile markup budget ${id}`);
  geometry.add(createHash('sha256').update(body.replaceAll(/#[a-fA-F0-9]{3,8}/g,'#000')).digest('hex'));
 }
 assert.equal(geometry.size,59,'Geometric differences survive removal of color');
 for(const [id,count]of [[34,6],[50,8],[63,9],[77,12]])assert.equal((INDUSTRIAL_MODELS[id]().match(/data-part="motor"/g)||[]).length,count,`Exact module count #${id}`);
 assert.equal((INDUSTRIAL_MODELS[36]().match(/data-part="ceramic-bushing"/g)||[]).length,5);
 assert.equal((INDUSTRIAL_MODELS[87]().match(/data-part="enclosed-generator"/g)||[]).length,4);
});
const products=recipesFromSpecification(readFileSync(new URL('../docs/GLOBAL_INDUSTRIAL_MASTER_SPEC.txt',import.meta.url),'utf8'));
test('the 25-product proposal retains all authored inputs and references, and is reproducible',()=>{
 assert.equal(products.length,25);assert.equal(products[0].copper,MG.Mt/2n);assert.equal(products[24].copper,30n*MG.Gt);
 assert.equal(products[0].reference,450n*10n**9n*DOLLAR);assert.equal(products[24].reference,42n*10n**15n*DOLLAR);
 const before=E.encode(products);
 for(const [i,p]of products.entries()){
  const price=proposedPrice(p,i);assert.ok(price>=p.reference);assert.equal(price%(10n**9n*DOLLAR),0n);
  const c=comparison(p,i,price,10000);assert.ok(c.net*100n>=price*BigInt(TARGET_MARGINS[i]));
  let previous=price;
  for(const q of [3000,6000,10000,15000,20000]){const result=comparison(p,i,price,q);assert.ok(result.net<previous);previous=result.net;assert.equal(result.fee,p.fee*85n/100n);}
 }
 assert.equal(E.encode(products),before);
 assert.deepEqual([3000,6000,10000,15000,20000].map(q=>products.filter((p,i)=>comparison(p,i,proposedPrice(p,i),q).net>0n).length),[25,25,25,4,0]);
});
test('proposed freight scales with revenue, volume and distance and has bounded discounts',()=>{
 const price=450n*10n**9n*DOLLAR;
 assert.equal(freight(price,1,15),3625000000n*DOLLAR);
 assert.equal(freight(price,1,90),4875000000n*DOLLAR);
 assert.equal(freight(price,1,15,10),2537500000n*DOLLAR);
 assert.ok(freight(price,5)>freight(price,1));assert.throws(()=>freight(price,1,15,11));
});
