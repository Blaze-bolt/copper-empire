import {DOLLAR} from './data.js';
export const COUNTRIES=[
 ['CN','China','🇨🇳','Shanghai',35,8,['cables','motors','industrial-equipment'],[76,38]],
 ['US','United States','🇺🇸','Los Angeles',55,12,['generators','advanced-power'],[19,37]],
 ['IN','India','🇮🇳','Mumbai',45,10,['power-grid','transformers'],[66,49]],
 ['DE','Germany','🇩🇪','Hamburg',75,14,['precision','motors','cooling'],[49,28]],
 ['JP','Japan','🇯🇵','Yokohama',40,13,['precision','electronics','cooling'],[87,38]],
 ['AU','Australia','🇦🇺','Melbourne',15,7,['wiring','infrastructure'],[85,79]],
 ['GB','United Kingdom','🇬🇧','Felixstowe',80,9,['advanced-power','power-grid','controls'],[44,27]],
 ['KR','South Korea','🇰🇷','Busan',38,11,['electronics','advanced-cables'],[82,37]],
 ['CA','Canada','🇨🇦','Vancouver',60,8,['heavy-machines','generators'],[20,20]],
 ['BR','Brazil','🇧🇷','Santos',90,10,['motors','transformers','distribution'],[31,76]]
].map(([id,name,flag,port,minutes,demand,tags,map])=>({id,name,flag,port,minutes,demand,tags,map}));
export const SHIP_CLASSES=[['coastal','Coastal Cargo Ship',100,5,10],['general','General Cargo Freighter',750,20,13],['container','Container Ship',5000,75,16],['ultra','Ultra-Large Container Vessel',30000,250,20],['mega','Industrial Megacarrier',200000,1000,25]].map(([id,name,money,capacity,speedTenths])=>({id,name,money:BigInt(money)*1000000000n*DOLLAR,capacity,speedTenths}));
export const PORT_UPGRADES=[['crane','Loading Crane',100,'5% less loading time per rank'],['staging','Staging Warehouse',150,'20 extra cargo volume in a saved loading plan per rank'],['office','Shipping Office',250,'One additional active export contract per two ranks'],['freight','Freight Efficiency',300,'1% lower freight per rank, applied after approved logistics'],['automation','Port Automation',400,'One additional saved loading plan per rank; no automatic dispatch'],['fleet','Fleet Management',500,'2% faster travel per rank, 5-minute minimum']].map(([id,name,cost,description])=>({id,name,cost:BigInt(cost)*1000000000n*DOLLAR,max:10,description}));
export const countryById=id=>COUNTRIES.find(c=>c.id===id);
export const reputationTier=n=>n>=80?{name:'Strategic Partner',bps:1500}:n>=60?{name:'Preferred',bps:900}:n>=40?{name:'Trading Partner',bps:500}:n>=20?{name:'Recognized',bps:200}:{name:'Unknown',bps:0};
