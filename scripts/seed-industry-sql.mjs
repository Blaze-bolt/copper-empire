import {readFile,writeFile} from 'node:fs/promises';
import {PRODUCTS} from '../src/empire/industry-data.js';
import {COUNTRIES} from '../src/empire/trade-data.js';
const path='supabase/migrations/20261019051421_global_industry_era.sql',q=s=>"'"+s.replaceAll("'","''")+"'",array=a=>'array['+a.map(q).join(',')+']';
let sql=await readFile(path,'utf8');sql=sql.replace('-- SEED_REFERENCE',`insert into empire_private.export_products values\n${PRODUCTS.map(p=>`(${q(p.id)},${p.reference},${array(p.tags)})`).join(',\n')};\ninsert into empire_private.export_countries values\n${COUNTRIES.map(c=>`(${q(c.id)},${c.demand},${array(c.tags)})`).join(',\n')};`);await writeFile(path,sql);
