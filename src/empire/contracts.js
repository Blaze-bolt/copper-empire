// Additional repeatable choices. Existing offer-N IDs stay in state.js so old
// clients and active saved contracts retain their original identity and terms.
const rows=[
 ['basic-batch','Small batch recovery','complete',3n,'Complete 3 electronics',0,'basic'],
 ['basic-routine','Workshop routine','complete',5n,'Complete 5 electronics',0,'basic'],
 ['basic-copper','Starter copper order','collect',10000n,'Recover 10 g of copper',0,'basic'],
 ['advanced-copper','Advanced copper order','collect',30000000n,'Recover 30 kg of copper',4,'advanced'],
 ['advanced-supply','Workshop supply run','sold',50000000n,'Sell 50 kg of copper',4,'advanced'],
 ['advanced-quality','Quality recovery batch','gradeA',2n,'Complete 2 electronics with A grade or better',4,'advanced'],
 ['advanced-streak','Reliable recovery crew','streak',4n,'Complete 4 devices in a row without a failure',4,'advanced'],
 ['advanced-components','Component production order','craft',6n,'Craft 6 components',4,'advanced'],
 ['advanced-batch','Advanced batch recovery','complete',6n,'Complete 6 electronics',4,'advanced'],
 ['difficult-copper','Industrial copper order','collect',100000000000n,'Recover 100 t of copper',8,'difficult'],
 ['difficult-supply','Industrial supply run','sold',150000000000n,'Sell 150 t of copper',8,'difficult'],
 ['difficult-components','Industrial component order','craft',15n,'Craft 15 components',8,'difficult'],
 ['difficult-quality','Industrial quality batch','gradeA',4n,'Complete 4 electronics with A grade or better',8,'difficult'],
 ['difficult-streak','Dependable industrial crew','streak',6n,'Complete 6 devices in a row without a failure',8,'difficult'],
 ['difficult-batch','Large-scale recovery order','complete',10n,'Complete 10 electronics',8,'difficult'],
 ['difficult-ingots','Industrial ingot order','ingot',20n,'Smelt 20 ingots',8,'difficult']
];
export const EXTRA_CONTRACTS=Object.freeze(rows.map(([id,name,type,target,description,required,rank])=>Object.freeze({id:'contract-'+id,name,type,target,description,required,rank})));
export function contractRebirthGoal(s){return s.rebirth===5?{rebirth:6,rank:'advanced',completed:s.run.advancedContracts,required:3}:s.rebirth===8?{rebirth:9,rank:'difficult',completed:s.run.difficultContracts,required:5}:null;}
