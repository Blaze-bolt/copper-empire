create schema if not exists empire_private;
revoke all on schema empire_private from public,anon,authenticated;
create table public.empire_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique check(username ~ '^[a-z][a-z0-9_]{2,19}$' and username not in ('admin','administrator','system','support','moderator','copper_empire')),
 created_at timestamptz not null default now()
);
alter table public.empire_profiles enable row level security;
create policy profiles_public on public.empire_profiles for select using(true);
revoke all on public.empire_profiles from anon,authenticated;
grant select on public.empire_profiles to anon,authenticated;
create function public.empire_signup() returns trigger language plpgsql security definer set search_path='' as $$
begin insert into public.empire_profiles(id,username) values(new.id,lower(trim(new.raw_user_meta_data->>'username'))); return new; end $$;
create trigger empire_signup after insert on auth.users for each row execute function public.empire_signup();
create table empire_private.players (
 user_id uuid primary key references auth.users(id) on delete cascade,
 revision bigint not null default 0, state jsonb not null, attempt jsonb,
 updated_at timestamptz not null default now()
);
create table empire_private.receipts (
 user_id uuid references auth.users(id) on delete cascade, request_id uuid not null,
 result jsonb, created_at timestamptz not null default now(), primary key(user_id,request_id)
);
create table public.empire_backups (
 user_id uuid primary key references auth.users(id) on delete cascade,
 save text not null check(octet_length(save)<=1000000), updated_at timestamptz not null default now()
);
alter table public.empire_backups enable row level security;
create policy backup_read on public.empire_backups for select to authenticated using((select auth.uid())=user_id);
create policy backup_insert on public.empire_backups for insert to authenticated with check((select auth.uid())=user_id);
create policy backup_update on public.empire_backups for update to authenticated using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
grant select,insert,update on public.empire_backups to authenticated;
create table public.empire_leaderboard (
 user_id uuid primary key references auth.users(id) on delete cascade,
 rebirth integer not null, level integer not null, completed bigint not null,
 copper_mg numeric(120,0) not null, updated_at timestamptz not null default now()
);
alter table public.empire_leaderboard enable row level security;
create policy board_read on public.empire_leaderboard for select using(true);
revoke all on public.empire_leaderboard from anon,authenticated;
grant select on public.empire_leaderboard to anon,authenticated;
create index empire_board_order on public.empire_leaderboard(rebirth desc,completed desc,copper_mg desc,user_id);
create table empire_private.market (
 id boolean primary key default true check(id), epoch bigint not null, quote integer not null check(quote between 3000 and 10000), previous integer not null, pressure integer not null default 0
);
insert into empire_private.market values(true,floor(extract(epoch from now())/10),5000,5000,0);
create table empire_private.prices (epoch bigint primary key,quote integer not null);
insert into empire_private.prices select epoch,quote from empire_private.market;
create table empire_private.influence (user_id uuid references auth.users(id) on delete cascade,epoch bigint not null,volume numeric not null default 0,trades integer not null default 0,primary key(user_id,epoch));
alter table empire_private.players enable row level security;
alter table empire_private.receipts enable row level security;
alter table empire_private.market enable row level security;
alter table empire_private.prices enable row level security;
alter table empire_private.influence enable row level security;
create function public.empire_market() returns jsonb language plpgsql security definer set search_path='' as $$
declare m empire_private.market; target bigint:=floor(extract(epoch from clock_timestamp())/10); t bigint; delta integer; points jsonb; advanced boolean:=false;
begin
 select * into m from empire_private.market where id;
 if m.epoch<target then select * into m from empire_private.market where id for update;end if;
 -- Bound recovery after inactivity to one hour. Normal operation is one tick.
 if m.epoch < target-360 then m.epoch:=target-360; end if;
 while m.epoch<target loop
 advanced:=true;t:=m.epoch+1;
 delta:=round((6000-m.quote)*0.018)::integer + ((('x'||substr(md5(t::text),1,6))::bit(24)::int)%101-50) + greatest(-100,least(100,m.pressure));
 m.previous:=m.quote; m.quote:=greatest(3000,least(10000,m.quote+delta));m.epoch:=t;m.pressure:=0;
 insert into empire_private.prices values(t,m.quote) on conflict(epoch) do nothing;
 end loop;
 if advanced then
 update empire_private.market set epoch=m.epoch,quote=m.quote,previous=m.previous,pressure=m.pressure where id;
 delete from empire_private.prices where epoch*10000<floor(extract(epoch from clock_timestamp())*1000)-3600000;
 delete from empire_private.influence where epoch<target;
 end if;
 select coalesce(jsonb_agg(jsonb_build_object('at',epoch*10000,'quote',quote) order by epoch),'[]') into points from empire_private.prices where epoch*10000>=floor(extract(epoch from clock_timestamp())*1000)-3600000;
 return jsonb_build_object('global',true,'quote',m.quote,'previous',m.previous,'next',(target+1)*10000,'serverTime',floor(extract(epoch from clock_timestamp())*1000),'history',points,'high',(select max(quote) from empire_private.prices),'low',(select min(quote) from empire_private.prices));
end $$;
create function public.empire_load(p_user uuid,p_initial jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare p empire_private.players;
begin
 insert into empire_private.players(user_id,state) values(p_user,p_initial) on conflict do nothing;
 select * into p from empire_private.players where user_id=p_user;
 return jsonb_build_object('state',p.state,'attempt',p.attempt,'revision',p.revision);
end $$;
create function public.empire_commit(p_user uuid,p_request uuid,p_expected bigint,p_state jsonb,p_attempt jsonb,p_result jsonb,p_quote integer default null,p_volume numeric default 0) returns jsonb language plpgsql security definer set search_path='' as $$
declare p empire_private.players; old jsonb; m empire_private.market; influence empire_private.influence; prior integer; changed integer;
begin
 -- Consistent lock order: market before player. Atomic price validation and wallet update.
 perform public.empire_market(); select * into m from empire_private.market where id for update;
 select * into p from empire_private.players where user_id=p_user for update;
 if not found then raise exception 'Workshop not initialized';end if;
 select result into old from empire_private.receipts where user_id=p_user and request_id=p_request;
 if found then return jsonb_build_object('state',p.state,'attempt',p.attempt,'revision',p.revision,'result',old,'duplicate',true);end if;
 if p.revision<>p_expected then raise exception 'SAVE_CONFLICT: Another device changed this workshop. Refresh before continuing.';end if;
 if p_quote is not null and p_quote<>m.quote then raise exception 'QUOTE_CHANGED: The shared price changed. Review the new quote and try again.';end if;
 if p_volume<>0 then
 insert into empire_private.influence(user_id,epoch) values(p_user,m.epoch) on conflict do nothing;
 select * into influence from empire_private.influence where user_id=p_user and epoch=m.epoch for update;
 if influence.trades>=6 then raise exception 'Wait for the next 10-second market tick before trading again.';end if;
 prior:=greatest(-20,least(20,round(influence.volume/1000000)));
 changed:=greatest(-20,least(20,round((influence.volume+p_volume)/1000000)));
 update empire_private.influence set volume=volume+p_volume,trades=trades+1 where user_id=p_user and epoch=m.epoch;
 update empire_private.market set pressure=greatest(-100,least(100,pressure+changed-prior)) where id;
 end if;
 update empire_private.players set state=p_state,attempt=p_attempt,revision=revision+1,updated_at=now() where user_id=p_user returning * into p;
 insert into public.empire_leaderboard(user_id,rebirth,level,completed,copper_mg) values(p_user,(p_state->>'rebirth')::integer,1+floor(sqrt((p_state->>'xp')::numeric/20))::integer,(p_state#>>'{stats,completed}')::bigint,(p_state#>>'{stats,copperCollected,$int}')::numeric)
 on conflict(user_id) do update set rebirth=excluded.rebirth,level=excluded.level,completed=excluded.completed,copper_mg=excluded.copper_mg,updated_at=now();
 insert into empire_private.receipts(user_id,request_id,result) values(p_user,p_request,p_result);
 return jsonb_build_object('state',p.state,'attempt',p.attempt,'revision',p.revision,'result',p_result);
end $$;
create function public.empire_rankings() returns jsonb language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_agg(row),'[]') from (select row_number() over(order by b.rebirth desc,b.completed desc,b.copper_mg desc,b.user_id) as rank,p.username,b.rebirth,b.level,b.completed,b.copper_mg::text as copper_mg from public.empire_leaderboard b join public.empire_profiles p on p.id=b.user_id order by b.rebirth desc,b.completed desc,b.copper_mg desc,b.user_id limit 100) row;
$$;
revoke all on function public.empire_signup(),public.empire_load(uuid,jsonb),public.empire_commit(uuid,uuid,bigint,jsonb,jsonb,jsonb,integer,numeric) from public,anon,authenticated;
grant execute on function public.empire_load(uuid,jsonb),public.empire_commit(uuid,uuid,bigint,jsonb,jsonb,jsonb,integer,numeric) to service_role;
revoke all on function public.empire_market(),public.empire_rankings() from public;
grant execute on function public.empire_market(),public.empire_rankings() to anon,authenticated,service_role;
create function public.empire_receipt(p_user uuid,p_request uuid) returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object('state',p.state,'attempt',p.attempt,'revision',p.revision,'result',r.result,'duplicate',true) from empire_private.receipts r join empire_private.players p on p.user_id=r.user_id where r.user_id=p_user and r.request_id=p_request;
$$;
revoke all on function public.empire_receipt(uuid,uuid) from public,anon,authenticated;
grant execute on function public.empire_receipt(uuid,uuid) to service_role;
