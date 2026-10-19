-- Global Industrial Era. Additive: existing Main/Debug player rows are not rewritten.
create table empire_private.export_products(product text primary key,reference numeric(110,0) not null check(reference>0),tags text[] not null);
create table empire_private.export_countries(country text primary key,demand integer not null,tags text[] not null);
create table empire_private.export_clock(id boolean primary key default true check(id),epoch bigint not null default -1,news_epoch bigint not null default -1);
insert into empire_private.export_clock(id) values(true);
create table empire_private.export_prices(country text references empire_private.export_countries,product text references empire_private.export_products,price numeric(110,0) not null,previous numeric(110,0) not null,change_bps integer not null default 0,primary key(country,product));
create index export_prices_product_idx on empire_private.export_prices(product);
create table empire_private.export_snapshots(epoch bigint primary key,prices jsonb not null);
create table empire_private.export_news(id bigint primary key,country text not null,tag text,headline text not null,starts bigint not null,ends bigint not null,price_bps integer not null,freight_bps integer not null,time_bps integer not null);
insert into empire_private.export_products values
('F01',615000000000000000000,array['wiring','cables']),
('F02',1265000000000000000000,array['cables','advanced-cables']),
('F03',1860000000000000000000,array['infrastructure']),
('F04',2492000000000000000000,array['industrial-equipment']),
('F05',4217000000000000000000,array['cooling']),
('F06',5456000000000000000000,array['motors']),
('F07',6845000000000000000000,array['transformers']),
('F08',9978000000000000000000,array['wiring','electronics']),
('F09',14298000000000000000000,array['generators','motors']),
('F10',22148000000000000000000,array['cooling']),
('F11',33823000000000000000000,array['precision','electronics']),
('F12',40255000000000000000000,array['distribution','power-grid']),
('F13',78818000000000000000000,array['cooling','electronics']),
('F14',105190000000000000000000,array['advanced-cables','cables']),
('F15',149807000000000000000000,array['generators','heavy-machines']),
('F16',221259000000000000000000,array['transformers','heavy-machines']),
('F17',379839000000000000000000,array['power-grid','advanced-power','controls']),
('F18',627861000000000000000000,array['motors','heavy-machines']),
('F19',1115119000000000000000000,array['advanced-power','electronics']),
('F20',1655923000000000000000000,array['power-grid','distribution','infrastructure']),
('F21',3323372000000000000000000,array['generators','industrial-equipment']),
('F22',6926462000000000000000000,array['power-grid','infrastructure']),
('F23',14375601000000000000000000,array['industrial-equipment','controls']),
('F24',27992719000000000000000000,array['infrastructure','advanced-power']),
('F25',58599383000000000000000000,array['generators','industrial-equipment','advanced-power']);
insert into empire_private.export_countries values
('CN',8,array['cables','motors','industrial-equipment']),
('US',12,array['generators','advanced-power']),
('IN',10,array['power-grid','transformers']),
('DE',14,array['precision','motors','cooling']),
('JP',13,array['precision','electronics','cooling']),
('AU',7,array['wiring','infrastructure']),
('GB',9,array['advanced-power','power-grid','controls']),
('KR',11,array['electronics','advanced-cables']),
('CA',8,array['heavy-machines','generators']),
('BR',10,array['motors','transformers','distribution']);
insert into empire_private.export_prices(country,product,price,previous)
 select c.country,p.product,trunc(p.reference*(100+case when c.tags&&p.tags then c.demand else 0 end)/100),trunc(p.reference*(100+case when c.tags&&p.tags then c.demand else 0 end)/100) from empire_private.export_products p cross join empire_private.export_countries c;
alter table empire_private.export_products enable row level security;
alter table empire_private.export_countries enable row level security;
alter table empire_private.export_clock enable row level security;
alter table empire_private.export_prices enable row level security;
alter table empire_private.export_snapshots enable row level security;
alter table empire_private.export_news enable row level security;
revoke all on empire_private.export_products,empire_private.export_countries,empire_private.export_clock,empire_private.export_prices,empire_private.export_snapshots,empire_private.export_news from public,anon,authenticated;

create function empire_private.export_price_set() returns jsonb language sql stable set search_path='' as $$
 select jsonb_agg(jsonb_build_object('country',country,'product',product,'price',jsonb_build_object('$int',price::text),'previous',jsonb_build_object('$int',previous::text),'changeBps',change_bps) order by country,product) from empire_private.export_prices;
$$;
create function empire_private.export_news_json(p empire_private.export_news) returns jsonb language sql immutable set search_path='' as $$
 select jsonb_build_object('id',p.id,'country',p.country,'tag',p.tag,'headline',p.headline,'starts',p.starts,'ends',p.ends,'priceBps',p.price_bps,'freightBps',p.freight_bps,'timeBps',p.time_bps);
$$;
create function empire_private.export_tick() returns void language plpgsql security definer set search_path='' as $$
declare moment bigint:=floor(extract(epoch from clock_timestamp())*1000);target bigint:=moment/3600000;news_target bigint:=moment/1200000;c empire_private.export_clock;ep bigint;dest text;kind integer;duration integer;price_effect integer;freight_effect integer;time_effect integer;headline text;tag text;row record;base numeric;effect integer;next_price numeric;movement numeric;
begin
 select * into c from empire_private.export_clock where id;
 if c.epoch>=target and c.news_epoch>=news_target then return;end if;
 select * into c from empire_private.export_clock where id for update;
 if c.epoch>=target and c.news_epoch>=news_target then return;end if;
 if c.news_epoch<news_target then
  for ep in greatest(case when c.news_epoch<0 then news_target else c.news_epoch+1 end,news_target-143)..news_target loop
   select country into dest from empire_private.export_countries order by random() limit 1;
   kind:=floor(random()*8)::integer;duration:=1+floor(random()*3)::integer;tag:=null;
   case kind
    when 0 then headline:='Fictional infrastructure program raises demand';price_effect:=650;freight_effect:=0;time_effect:=0;tag:='infrastructure';
    when 1 then headline:='Fictional electronics order surge';price_effect:=500;freight_effect:=0;time_effect:=0;tag:='electronics';
    when 2 then headline:='Fictional port congestion slows new voyages';price_effect:=100;freight_effect:=1200;time_effect:=2000;
    when 3 then headline:='Fictional freight-efficiency pilot opens';price_effect:=0;freight_effect:=-1000;time_effect:=-1500;
    when 4 then headline:='Fictional industrial oversupply softens prices';price_effect:=-700;freight_effect:=0;time_effect:=0;tag:='industrial-equipment';
    when 5 then headline:='Fictional generator procurement rally';price_effect:=800;freight_effect:=0;time_effect:=0;tag:='generators';
    when 6 then headline:='Fictional cooling-project pause eases demand';price_effect:=-500;freight_effect:=0;time_effect:=0;tag:='cooling';
    else headline:='Fictional shipping route reopens';price_effect:=200;freight_effect:=-500;time_effect:=-1000;
   end case;
   insert into empire_private.export_news values(ep,dest,tag,headline,ep::bigint*1200000,ep::bigint*1200000+duration*3600000,price_effect,freight_effect,time_effect) on conflict do nothing;
  end loop;
 end if;
 if c.epoch<target then
  for ep in greatest(case when c.epoch<0 then target else c.epoch+1 end,target-23)..target loop
   for row in select q.*,p.reference,p.tags as product_tags,cc.demand,cc.tags as country_tags from empire_private.export_prices q join empire_private.export_products p using(product) join empire_private.export_countries cc using(country) order by q.country,q.product loop
    base:=trunc(row.reference*(100+case when row.product_tags&&row.country_tags then row.demand else 0 end)/100);
    select coalesce(sum(n.price_bps),0) into effect from empire_private.export_news n where n.starts<=ep::bigint*3600000 and n.ends>ep::bigint*3600000 and n.country=row.country and (n.tag is null or n.tag=any(row.product_tags));
    movement:=greatest(-800,least(800,round((random()*600-300)+(base-row.price)/base*1000+greatest(-800,least(800,effect)))));
    next_price:=greatest(trunc(base*.70),least(trunc(base*1.50),trunc(row.price*(10000+movement)/10000)));
    update empire_private.export_prices set previous=price,price=next_price,change_bps=round((next_price-row.price)/row.price*10000) where country=row.country and product=row.product;
   end loop;
   insert into empire_private.export_snapshots values(ep,empire_private.export_price_set()) on conflict(epoch) do update set prices=excluded.prices;
  end loop;
 end if;
 update empire_private.export_clock set epoch=target,news_epoch=news_target where id;
 delete from empire_private.export_snapshots where epoch<target-23;
 -- Protect active news. Departure locks retain their compact event effects independently.
 delete from empire_private.export_news where ends<=moment and (starts<moment-172800000 or id in(select id from empire_private.export_news where ends<=moment order by starts desc offset greatest(0,100-(select count(*) from empire_private.export_news where ends>moment))));
end $$;
revoke all on function empire_private.export_tick(),empire_private.export_price_set(),empire_private.export_news_json(empire_private.export_news) from public,anon,authenticated;

-- Public shared market reads expose no player data. Repeated reads during a tick do not rewrite rows.
create function public.empire_export_world(p_version bigint default -1,p_news_version bigint default -1) returns jsonb language plpgsql security definer set search_path='' as $$
declare c empire_private.export_clock;moment bigint:=floor(extract(epoch from clock_timestamp())*1000);begin
 perform empire_private.export_tick();select * into c from empire_private.export_clock where id;
 return jsonb_build_object('version',c.epoch,'newsVersion',c.news_epoch,'serverTime',moment,'nextHour',(c.epoch+1)*3600000,'nextNews',(c.news_epoch+1)*1200000,
 'prices',case when p_version=c.epoch then null else empire_private.export_price_set() end,
 'events',case when p_news_version=c.news_epoch then null else (select coalesce(jsonb_agg(empire_private.export_news_json(n) order by n.starts desc),'[]') from empire_private.export_news n where n.starts<=moment and n.ends>moment) end,
 'news',case when p_news_version=c.news_epoch then null else (select coalesce(jsonb_agg(empire_private.export_news_json(n) order by n.starts desc),'[]') from(select * from empire_private.export_news order by starts desc limit 30)n) end);
end $$;
create function public.empire_export_history(p_country text,p_product text) returns jsonb language sql security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object('at',s.epoch*3600000,'price',q->'price') order by s.epoch),'[]') from empire_private.export_snapshots s cross join lateral jsonb_array_elements(s.prices) q where q->>'country'=p_country and q->>'product'=p_product;
$$;
create function public.empire_export_news_page(p_before bigint default 9223372036854775807) returns jsonb language sql security definer set search_path='' as $$
 select coalesce(jsonb_agg(empire_private.export_news_json(n) order by n.starts desc),'[]') from(select * from empire_private.export_news where starts<p_before order by starts desc limit 30)n;
$$;
grant execute on function public.empire_export_world(bigint,bigint),public.empire_export_history(text,text),public.empire_export_news_page(bigint) to anon,authenticated,service_role;

-- Lock order matches the existing economy: copper, gold, export clock, player/receipt.
-- Only the authenticated Edge service can commit a derived economic state.
create function public.empire_commit_industry(p_user uuid,p_request uuid,p_expected bigint,p_state jsonb,p_attempt jsonb,p_result jsonb,p_world_epoch bigint,p_news_epoch bigint,p_slot text default 'main',p_quote integer default null,p_volume numeric default 0,p_asset text default 'copper') returns jsonb language plpgsql security definer set search_path='' as $$
declare c empire_private.export_clock;r jsonb;begin
 if p_slot not in ('main','debug') then raise exception 'Unknown save slot';end if;
 if p_slot='debug' then perform empire_private.assert_owner(p_user);end if;
 perform 1 from empire_private.market where id for update;perform 1 from empire_private.gold_market where id for update;
 perform empire_private.export_tick();select * into c from empire_private.export_clock where id for update;
 r:=public.empire_slot_receipt(p_user,p_slot,p_request);if r is not null then return r;end if;
 if c.epoch<>p_world_epoch or c.news_epoch<>p_news_epoch then raise exception 'EXPORT_QUOTE_CHANGED: Review the new shared export price and route conditions.';end if;
 if p_slot='debug' then return public.empire_debug_commit(p_user,p_request,p_expected,p_state,p_attempt,p_result,p_quote,p_asset);end if;
 return public.empire_commit_asset(p_user,p_request,p_expected,p_state,p_attempt,p_result,p_quote,p_volume,p_asset);
end $$;
revoke all on function public.empire_commit_industry(uuid,uuid,bigint,jsonb,jsonb,jsonb,bigint,bigint,text,integer,numeric,text) from public,anon,authenticated;
grant execute on function public.empire_commit_industry(uuid,uuid,bigint,jsonb,jsonb,jsonb,bigint,bigint,text,integer,numeric,text) to service_role;
select empire_private.export_tick();
create function public.empire_my_revision(p_slot text default 'main') returns jsonb language plpgsql security definer set search_path='' as $$
declare who uuid:=auth.uid();r jsonb;begin
 if who is null then raise exception 'Sign in to read your workshop revision.';end if;
 if p_slot='main' then select jsonb_build_object('revision',revision,'classification',classification) into r from empire_private.players where user_id=who;
 elsif p_slot='debug' then perform empire_private.assert_owner(who);select jsonb_build_object('revision',revision,'classification','debug') into r from empire_private.debug_players where user_id=who;
 else raise exception 'Unknown save slot';end if;return r;
end $$;
revoke all on function public.empire_my_revision(text) from public,anon;
grant execute on function public.empire_my_revision(text) to authenticated,service_role;
-- A single new 20-minute schedule advances both clocks. No 250-job fan-out or Realtime stream.
create extension if not exists pg_cron;
select cron.schedule('industrial-world-clock','*/20 * * * *',$job$ select empire_private.export_tick(); delete from cron.job_run_details where jobid=(select jobid from cron.job where jobname='industrial-world-clock') and end_time<now()-interval '1 hour'; $job$);
