-- Additive expansion. Existing player saves and the current copper quote are preserved.
alter table empire_private.market drop constraint market_quote_check;
alter table empire_private.market add constraint market_quote_check check(quote between 3000 and 20000);
alter table empire_private.market add column momentum double precision not null default 0;
alter table empire_private.market add column regime text not null default 'quiet';
alter table empire_private.market add column regime_until bigint not null default 0;
create table empire_private.gold_market (like empire_private.market including all);
alter table empire_private.gold_market drop constraint market_quote_check;
alter table empire_private.gold_market add constraint gold_market_quote_check check(quote between 300000 and 1800000);
insert into empire_private.gold_market(id,epoch,quote,previous) values(true,floor(extract(epoch from clock_timestamp())/10),600000,600000);
create table empire_private.gold_prices (epoch bigint primary key,quote integer not null);
insert into empire_private.gold_prices select epoch,quote from empire_private.gold_market;
create table empire_private.gold_influence (like empire_private.influence including all);
alter table empire_private.gold_influence add constraint gold_influence_user_fkey foreign key(user_id) references auth.users(id) on delete cascade;
alter table empire_private.gold_market enable row level security;
alter table empire_private.gold_prices enable row level security;
alter table empire_private.gold_influence enable row level security;
create policy gold_market_deny_browser on empire_private.gold_market for all to anon,authenticated using(false) with check(false);
create policy gold_prices_deny_browser on empire_private.gold_prices for all to anon,authenticated using(false) with check(false);
create policy gold_influence_deny_browser on empire_private.gold_influence for all to anon,authenticated using(false) with check(false);
revoke all on empire_private.gold_market,empire_private.gold_prices,empire_private.gold_influence from public,anon,authenticated;

create function empire_private.tick_asset(p_asset text) returns jsonb language plpgsql security definer set search_path='' as $$
declare m record; target bigint:=floor(extract(epoch from clock_timestamp())/10); moment bigint:=floor(extract(epoch from clock_timestamp())*1000);
 table_market text; table_prices text; table_influence text; equilibrium integer; minimum integer; maximum integer; cap double precision; movement double precision; noise double precision; points jsonb; advanced boolean:=false;
begin
 if p_asset='copper' then table_market:='market';table_prices:='prices';table_influence:='influence';equilibrium:=6000;minimum:=3000;maximum:=20000;
 elsif p_asset='gold' then table_market:='gold_market';table_prices:='gold_prices';table_influence:='gold_influence';equilibrium:=600000;minimum:=300000;maximum:=1800000;
 else raise exception 'Unknown market asset';end if;
 execute format('select * from empire_private.%I where id',table_market) into m;
 if m.epoch<target then execute format('select * from empire_private.%I where id for update',table_market) into m;end if;
 if m.epoch<target-360 then m.epoch:=target-360;end if;
 while m.epoch<target loop
  advanced:=true;m.epoch:=m.epoch+1;
  if m.epoch>=m.regime_until then
   noise:=random();m.regime:=case when noise<.70 then 'quiet' when noise<.94 then 'active' else 'turbulent' end;
   m.regime_until:=m.epoch+6+floor(random()*19)::bigint;
  end if;
  cap:=case m.regime when 'quiet' then .02 when 'active' then .05 else .08 end;
  if random()<.006 then movement:=(.08+random()*.02)*case when random()<.5 then -1 else 1 end;m.momentum:=movement*.25;
  else
   -- Momentum, occasional reversals, bounded pressure, and gradual mean recovery.
   if random()<.06 then m.momentum:=-m.momentum*.8;end if;
   noise:=(random()*2-1)*cap*.72;
   movement:=greatest(-cap,least(cap,noise+m.momentum+(equilibrium-m.quote)::double precision/equilibrium*.003+greatest(-100,least(100,m.pressure))*.000015));
   m.momentum:=greatest(-.025,least(.025,m.momentum*.72+movement*.2));
  end if;
  m.previous:=m.quote;m.quote:=greatest(minimum,least(maximum,round(m.quote*(1+movement))::integer));m.pressure:=0;
  execute format('insert into empire_private.%I values($1,$2) on conflict(epoch) do nothing',table_prices) using m.epoch,m.quote;
 end loop;
 if advanced then
  execute format('update empire_private.%I set epoch=$1,quote=$2,previous=$3,pressure=$4,momentum=$5,regime=$6,regime_until=$7 where id',table_market) using m.epoch,m.quote,m.previous,m.pressure,m.momentum,m.regime,m.regime_until;
  execute format('delete from empire_private.%I where epoch*10000<$1',table_prices) using moment-3600000;
  execute format('delete from empire_private.%I where epoch<$1',table_influence) using target;
 end if;
 execute format('select coalesce(jsonb_agg(jsonb_build_object(''at'',epoch*10000,''quote'',quote) order by epoch),''[]'') from empire_private.%I where epoch*10000>=$1',table_prices) into points using moment-3600000;
 return jsonb_build_object('global',true,'quote',m.quote,'previous',m.previous,'next',(target+1)*10000,'serverTime',moment,'regime',m.regime,'history',points,'high',(select max((x->>'quote')::integer) from jsonb_array_elements(points) x),'low',(select min((x->>'quote')::integer) from jsonb_array_elements(points) x));
end $$;
revoke all on function empire_private.tick_asset(text) from public,anon,authenticated;
-- Keep the existing clock and old client endpoints working. One clock advances both assets.
create or replace function public.empire_market() returns jsonb language plpgsql security definer set search_path='' as $$
declare copper jsonb;begin copper:=empire_private.tick_asset('copper');perform empire_private.tick_asset('gold');return copper;end $$;
create function public.empire_quotes() returns jsonb language plpgsql security definer set search_path='' as $$
declare copper jsonb;gold jsonb;begin copper:=empire_private.tick_asset('copper');gold:=empire_private.tick_asset('gold');return jsonb_build_object('copper',copper-'history','gold',gold-'history');end $$;
create function public.empire_gold_quote() returns jsonb language sql security definer set search_path='' as $$ select empire_private.tick_asset('gold')-'history'; $$;
create function public.empire_gold_price_history(p_after bigint default 0) returns jsonb language sql stable security definer set search_path='' as $$ select coalesce(jsonb_agg(jsonb_build_object('at',epoch*10000,'quote',quote) order by epoch),'[]') from empire_private.gold_prices where epoch>p_after and epoch*10000>=floor(extract(epoch from clock_timestamp())*1000)-3600000; $$;
revoke all on function public.empire_quotes(),public.empire_gold_quote(),public.empire_gold_price_history(bigint) from public;
grant execute on function public.empire_quotes(),public.empire_gold_quote(),public.empire_gold_price_history(bigint) to anon,authenticated,service_role;

alter table public.empire_leaderboard add column ascension integer not null default 0 check(ascension between 0 and 5);
alter table public.empire_leaderboard add column gold_mg numeric(120,0) not null default 0;
create index empire_board_ascension_order on public.empire_leaderboard(ascension desc,rebirth desc,completed desc,copper_mg desc,user_id);
create or replace function public.empire_rankings() returns jsonb language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_agg(row),'[]') from (select row_number() over(order by b.ascension desc,b.rebirth desc,b.completed desc,b.copper_mg desc,b.user_id) as rank,p.username,b.ascension,b.rebirth,b.level,b.completed,b.copper_mg::text as copper_mg,b.gold_mg::text as gold_mg from public.empire_leaderboard b join public.empire_profiles p on p.id=b.user_id order by b.ascension desc,b.rebirth desc,b.completed desc,b.copper_mg desc,b.user_id limit 100) row;
$$;
create function public.empire_commit_asset(p_user uuid,p_request uuid,p_expected bigint,p_state jsonb,p_attempt jsonb,p_result jsonb,p_quote integer default null,p_volume numeric default 0,p_asset text default 'copper') returns jsonb language plpgsql security definer set search_path='' as $$
declare p empire_private.players; old jsonb; m record; influence record; prior integer; changed integer; market_table text; influence_table text; volume_scale integer;
begin
 if p_asset='copper' then market_table:='market';influence_table:='influence';volume_scale:=1000000;
 elsif p_asset='gold' then market_table:='gold_market';influence_table:='gold_influence';volume_scale:=1000;
 else raise exception 'Unknown market asset';end if;
 -- Every writer takes both market locks in the same order, then the player lock.
 perform 1 from empire_private.market where id for update;perform 1 from empire_private.gold_market where id for update;perform public.empire_quotes();
 execute format('select * from empire_private.%I where id',market_table) into m;
 select * into p from empire_private.players where user_id=p_user for update;
 if not found then raise exception 'Workshop not initialized';end if;
 select result into old from empire_private.receipts where user_id=p_user and request_id=p_request;
 if found then return jsonb_build_object('state',p.state,'attempt',p.attempt,'revision',p.revision,'result',old,'duplicate',true);end if;
 if p.revision<>p_expected then raise exception 'SAVE_CONFLICT: Another device changed this workshop. Refresh before continuing.';end if;
 if p_quote is not null and p_quote<>m.quote then raise exception 'QUOTE_CHANGED: The shared price changed. Review the new quote and try again.';end if;
 if p_volume<>0 then
  execute format('insert into empire_private.%I(user_id,epoch) values($1,$2) on conflict do nothing',influence_table) using p_user,m.epoch;
  execute format('select * from empire_private.%I where user_id=$1 and epoch=$2 for update',influence_table) into influence using p_user,m.epoch;
  if influence.trades>=6 then raise exception 'Wait for the next 10-second market tick before trading again.';end if;
  prior:=greatest(-20,least(20,round(influence.volume/volume_scale)));changed:=greatest(-20,least(20,round((influence.volume+p_volume)/volume_scale)));
  execute format('update empire_private.%I set volume=volume+$1,trades=trades+1 where user_id=$2 and epoch=$3',influence_table) using p_volume,p_user,m.epoch;
  execute format('update empire_private.%I set pressure=greatest(-100,least(100,pressure+$1)) where id',market_table) using changed-prior;
 end if;
 update empire_private.players set state=p_state,attempt=p_attempt,revision=revision+1,updated_at=now() where user_id=p_user returning * into p;
 insert into public.empire_leaderboard(user_id,rebirth,level,completed,copper_mg,ascension,gold_mg) values(p_user,(p_state->>'rebirth')::integer,1+floor(sqrt((p_state->>'xp')::numeric/20))::integer,(p_state#>>'{stats,completed}')::bigint,(p_state#>>'{stats,copperCollected,$int}')::numeric,coalesce((p_state#>>'{ascension,level}')::integer,0),coalesce((p_state#>>'{gold,recovered,$int}')::numeric,0))
 on conflict(user_id) do update set rebirth=excluded.rebirth,level=excluded.level,completed=excluded.completed,copper_mg=excluded.copper_mg,ascension=excluded.ascension,gold_mg=excluded.gold_mg,updated_at=now();
 insert into empire_private.receipts(user_id,request_id,result) values(p_user,p_request,p_result);
 return jsonb_build_object('state',p.state,'attempt',p.attempt,'revision',p.revision,'result',p_result);
end $$;
revoke all on function public.empire_commit_asset(uuid,uuid,bigint,jsonb,jsonb,jsonb,integer,numeric,text) from public,anon,authenticated;
grant execute on function public.empire_commit_asset(uuid,uuid,bigint,jsonb,jsonb,jsonb,integer,numeric,text) to service_role;
create or replace function public.empire_commit(p_user uuid,p_request uuid,p_expected bigint,p_state jsonb,p_attempt jsonb,p_result jsonb,p_quote integer default null,p_volume numeric default 0) returns jsonb language sql security definer set search_path='' as $$ select public.empire_commit_asset(p_user,p_request,p_expected,p_state,p_attempt,p_result,p_quote,p_volume,'copper'); $$;
create or replace function empire_private.remove_duplicate_price_history() returns trigger language plpgsql set search_path='' as $$ begin new.state:=(new.state #- '{market,history}') #- '{goldMarket,history}';return new;end $$;
-- Do not copy chart data into account backups, either. No player progress is rewritten.
create or replace function empire_private.trim_backup_price_history() returns trigger language plpgsql set search_path='' as $$ declare backup jsonb;begin begin backup:=new.save::jsonb;exception when invalid_text_representation then return new;end;if jsonb_typeof(backup->'market')='object' then backup:=jsonb_set(backup,'{market,history}','[]'::jsonb);end if;if jsonb_typeof(backup->'goldMarket')='object' then backup:=jsonb_set(backup,'{goldMarket,history}','[]'::jsonb);end if;new.save:=backup::text;return new;end $$;
