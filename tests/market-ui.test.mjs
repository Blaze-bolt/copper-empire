import test from 'node:test';import assert from 'node:assert/strict';import{paintQuotes}from'../src/online/market-ui.js';
test('market refresh updates every visible price and works on pages without price elements',()=>{
 const copper=[{textContent:''},{textContent:''}],gold=[{textContent:''}];paintQuotes({querySelectorAll:q=>q.includes('gold')?gold:copper},12345,678901);assert.deepEqual(copper.map(n=>n.textContent),['1.2345','1.2345']);assert.equal(gold[0].textContent,'67.8901');assert.doesNotThrow(()=>paintQuotes({querySelectorAll:()=>[]},6000,600000));
});
