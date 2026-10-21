-- Additive, opt-in migration. No existing save is rewritten or deleted.
create table empire_private.unified_workshops (
 user_id uuid primary key references auth.users(id) on delete cascade,
 revision bigint not null default 1, state jsonb not null,
 meta jsonb not null, status text not null default 'unverified' check(status in ('unverified','review','excluded')),
 flags jsonb not null default '[]',updated_at timestamptz not null default now()
);
create index unified_ranking_order on empire_private.unified_workshops (((state#>>'{ascension,level}')::integer) desc,((state->>'rebirth')::integer) desc,((state#>>'{stats,completed}')::bigint) desc,user_id) where status='unverified';
create table empire_private.unified_recoveries (
 id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,
 source text not null,state jsonb not null,meta jsonb not null default '{}',protected boolean not null default false,
 created_at timestamptz not null default now()
);
create index unified_recovery_owner on empire_private.unified_recoveries(user_id,created_at desc,id);
create table empire_private.unified_receipts (
 user_id uuid not null references auth.users(id) on delete cascade,request_id uuid not null,
 revision bigint not null,snapshot_id text not null,result jsonb,created_at timestamptz not null default now(),
 primary key(user_id,request_id)
);
do $$declare t text;begin foreach t in array array['unified_workshops','unified_recoveries','unified_receipts'] loop
 execute format('alter table empire_private.%I enable row level security',t);
 execute format('revoke all on empire_private.%I from public,anon,authenticated',t);
end loop;end $$;

create function empire_private.try_unified_snapshot(raw text) returns jsonb language plpgsql immutable set search_path='' as $$begin return raw::jsonb;exception when invalid_text_representation then return null;end $$;
revoke all on function empire_private.try_unified_snapshot(text) from public,anon,authenticated;
create function public.empire_unified_load(p_user uuid) returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object(
 'current',(select jsonb_build_object('state',state,'revision',revision,'meta',meta,'status',status,'flags',flags,'updatedAt',floor(extract(epoch from updated_at)*1000)) from empire_private.unified_workshops where user_id=p_user),
 'legacyMain',case when not exists(select 1 from empire_private.unified_workshops where user_id=p_user) then (select jsonb_build_object('state',case when attempt->>'status' in ('briefing','active','retry') and coalesce((attempt->>'paid')::boolean,false)=false then state||jsonb_build_object('unifiedAttempt',jsonb_build_object('attempt',attempt,'game',null)) else state end,'revision',revision,'attempt',attempt,'classification',classification) from empire_private.players where user_id=p_user) else null end,
 'legacyBackup',case when not exists(select 1 from empire_private.unified_workshops where user_id=p_user) then (select jsonb_build_object('state',empire_private.try_unified_snapshot(save),'invalid',empire_private.try_unified_snapshot(save) is null,'updatedAt',updated_at) from public.empire_backups where user_id=p_user) else null end,
 'token',md5(p_user::text||coalesce((select state::text||revision::text from empire_private.players where user_id=p_user),'')||coalesce((select save from public.empire_backups where user_id=p_user),'')||coalesce((select revision::text from empire_private.unified_workshops where user_id=p_user),'')),
 'recoveries',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'source',source,'createdAt',created_at,'ascension',state#>'{ascension,level}','rebirth',state->'rebirth') order by created_at desc),'[]') from empire_private.unified_recoveries where user_id=p_user));
$$;

create function public.empire_unified_receipt(p_user uuid,p_request uuid) returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object('revision',w.revision,'settledRevision',r.revision,'snapshotId',r.snapshot_id,'result',r.result,'duplicate',true,'state',w.state,'meta',w.meta,'status',w.status)
 from empire_private.unified_receipts r join empire_private.unified_workshops w on w.user_id=r.user_id where r.user_id=p_user and r.request_id=p_request;
$$;

create function public.empire_unified_commit(p_user uuid,p_request uuid,p_expected bigint,p_state jsonb,p_meta jsonb,p_result jsonb,p_kind text,p_token text default null,p_archives jsonb default '[]',p_quote integer default null,p_volume numeric default 0,p_asset text default 'copper',p_world bigint default null,p_news bigint default null,p_flags jsonb default '[]') returns jsonb
language plpgsql security definer set search_path='' as $$
declare w empire_private.unified_workshops;old jsonb;stamp timestamptz:=clock_timestamp();item jsonb;market_table text;influence_table text;m record;influence record;scale integer;prior integer;changed integer;
begin
 if p_kind not in ('migration','sync','economic') or p_kind is null or p_expected<0 or p_request is null then raise exception 'Invalid unified commit';end if;
 -- Same lock order as existing financial writers. Concurrent account creation
 -- uses an advisory lock, and every update also compares the saved revision.
 perform 1 from empire_private.market where id for update;perform 1 from empire_private.gold_market where id for update;
 if p_world is not null then perform empire_private.export_tick();perform 1 from empire_private.export_clock where id for update;end if;
 perform pg_advisory_xact_lock(hashtextextended(p_user::text,6101));
 old:=public.empire_unified_receipt(p_user,p_request);if old is not null then return old;end if;
 select * into w from empire_private.unified_workshops where user_id=p_user for update;
 if coalesce(w.revision,0)<>p_expected then raise exception 'SAVE_CONFLICT: Another device accepted a different snapshot. Both copies are preserved.';end if;
 if p_kind='migration' then
  if w.user_id is not null or p_token is distinct from (public.empire_unified_load(p_user)->>'token') then raise exception 'SAVE_CONFLICT: Migration sources changed; review them again.';end if;
 elsif w.user_id is null then raise exception 'Reconcile your workshop first';end if;
 if p_meta->>'ownerId' is distinct from p_user::text or (p_meta->>'schema')::integer is distinct from 1 or coalesce(p_meta->>'id','')!~'^[0-9a-f-]{36}$' then raise exception 'Invalid snapshot ownership or identity';end if;
 if w.user_id is not null and p_meta->>'parent' is distinct from w.meta->>'id' then raise exception 'STALE_ANCESTRY: Snapshot parent is not the accepted revision';end if;
 if pg_column_size(p_state)>1200000 or jsonb_typeof(p_state)<>'object' or (p_state->>'version')::integer is distinct from 4 or (p_state->>'rebirth')::integer not between 0 and 26 or (p_state#>>'{ascension,level}')::integer not between 0 and 5 then raise exception 'Invalid unified snapshot';end if;
 if empire_private.aura_integer(p_state->'money')<0 or jsonb_array_length(p_state->'copper')<>6 then raise exception 'Invalid balances';end if;
 if p_kind<>'economic' and w.user_id is not null and w.state->'trade' is distinct from p_state->'trade' then raise exception 'ECONOMY_CONFLICT: Shipping requires server settlement';end if;
 if p_kind='sync' and w.state=p_state then return jsonb_build_object('state',w.state,'meta',w.meta,'revision',w.revision,'status',w.status,'unchanged',true);end if;
 if p_asset='copper' then market_table:='market';influence_table:='influence';scale:=1000000;
 elsif p_asset='gold' then market_table:='gold_market';influence_table:='gold_influence';scale:=1000;
 else raise exception 'Unknown market';end if;
 if p_quote is not null then
  perform public.empire_quotes();execute format('select * from empire_private.%I where id',market_table) into m;
  if m.quote<>p_quote then raise exception 'QUOTE_CHANGED: Review the current shared quote';end if;
  if p_volume<>0 then
   execute format('insert into empire_private.%I(user_id,epoch) values($1,$2) on conflict do nothing',influence_table) using p_user,m.epoch;
   execute format('select * from empire_private.%I where user_id=$1 and epoch=$2 for update',influence_table) into influence using p_user,m.epoch;
   if influence.trades>=6 then raise exception 'Wait for the next market tick before trading again';end if;
   prior:=greatest(-20,least(20,round(influence.volume/scale)));changed:=greatest(-20,least(20,round((influence.volume+p_volume)/scale)));
   execute format('update empire_private.%I set volume=volume+$1,trades=trades+1 where user_id=$2 and epoch=$3',influence_table) using p_volume,p_user,m.epoch;
   execute format('update empire_private.%I set pressure=greatest(-100,least(100,pressure+$1)) where id',market_table) using changed-prior;
  end if;
 end if;
 if p_world is not null then
  if p_world<>(select epoch from empire_private.export_clock where id) or p_news<>(select news_epoch from empire_private.export_clock where id) then raise exception 'EXPORT_QUOTE_CHANGED: Review worldwide export terms again';end if;
 end if;
 if w.user_id is not null then insert into empire_private.unified_recoveries(user_id,source,state,meta) values(p_user,'cloud revision '||w.revision,w.state,w.meta);end if;
 if jsonb_array_length(p_archives)>3 then raise exception 'Too many migration alternatives';end if;
 for item in select value from jsonb_array_elements(p_archives) loop
  insert into empire_private.unified_recoveries(user_id,source,state,meta,protected) values(p_user,item->>'source',item->'state',coalesce(item->'meta','{}'),p_kind='migration');
 end loop;
 insert into empire_private.unified_workshops(user_id,state,meta,revision,flags,status,updated_at)
 values(p_user,p_state,p_meta,1,p_flags,case when jsonb_array_length(p_flags)>0 then 'review' else 'unverified' end,stamp)
 on conflict(user_id) do update set state=excluded.state,meta=excluded.meta,revision=unified_workshops.revision+1,flags=excluded.flags,
 status=case when unified_workshops.status='excluded' then 'excluded' when unified_workshops.status='review' or jsonb_array_length(p_flags)>0 then 'review' else 'unverified' end,updated_at=stamp returning * into w;
 insert into empire_private.unified_receipts values(p_user,p_request,w.revision,p_meta->>'id',p_result,stamp);
 delete from empire_private.unified_recoveries where user_id=p_user and not protected and id not in(select id from empire_private.unified_recoveries where user_id=p_user and not protected order by created_at desc,id limit 6);
 delete from empire_private.unified_receipts where user_id=p_user and request_id not in(select request_id from empire_private.unified_receipts where user_id=p_user order by created_at desc,request_id limit 64);
 perform set_config('empire.sync_board','on',true);perform empire_private.refresh_leaderboard();perform set_config('empire.sync_board','off',true);
 return jsonb_build_object('state',w.state,'meta',w.meta,'revision',w.revision,'result',p_result,'status',w.status);
end $$;

create function public.empire_unified_recovery(p_user uuid,p_id uuid) returns jsonb language sql security definer set search_path='' as $$
 select jsonb_build_object('state',state,'meta',meta,'source',source,'id',id) from empire_private.unified_recoveries where user_id=p_user and id=p_id;
$$;
create function public.empire_unified_moderate(p_owner uuid,p_user uuid,p_exclude boolean) returns void language plpgsql security definer set search_path='' as $$
begin perform empire_private.assert_owner(p_owner);update empire_private.unified_workshops set status=case when p_exclude then 'excluded' else 'unverified' end where user_id=p_user;
 insert into empire_private.admin_audit(user_id,request_id,action,details) values(p_owner,gen_random_uuid(),'unified-moderation',jsonb_build_object('target',p_user,'excluded',p_exclude));
 perform set_config('empire.sync_board','on',true);perform empire_private.refresh_leaderboard();end $$;
create function public.empire_unified_debug_copy(p_owner uuid,p_expected bigint) returns jsonb language plpgsql security definer set search_path='' as $$
declare u empire_private.unified_workshops;d empire_private.debug_players;
begin perform empire_private.assert_owner(p_owner);select * into u from empire_private.unified_workshops where user_id=p_owner;
 if not found then raise exception 'Sync your Unified Workshop first';end if;
 select * into d from empire_private.debug_players where user_id=p_owner for update;
 if not found or d.revision<>p_expected then raise exception 'SAVE_CONFLICT: Refresh Debug before replacing it';end if;
 insert into empire_private.admin_audit(user_id,request_id,slot,action,details,result) values(p_owner,gen_random_uuid(),'debug','unified-to-debug',jsonb_build_object('sourceRevision',u.revision),jsonb_build_object('previousState',d.state,'previousAttempt',d.attempt,'previousRevision',d.revision));
 update empire_private.debug_players set state=u.state,attempt=null,revision=revision+1,updated_at=now() where user_id=p_owner;
 return jsonb_build_object('copied',true);end $$;
do $$declare f record;begin for f in select p.oid::regprocedure as signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'empire_unified_%' loop
 execute format('revoke all on function %s from public,anon,authenticated',f.signature);
 execute format('grant execute on function %s to service_role',f.signature);
end loop;end $$;

alter table public.empire_leaderboard add column verification text not null default 'verified';
create or replace function empire_private.exclude_modified_board() returns trigger language plpgsql security definer set search_path='' as $$begin
 if current_setting('empire.rebuilding_board',true) is distinct from 'on' then return null;end if;
 if exists(select 1 from empire_private.unified_workshops where user_id=new.user_id) then
  if not exists(select 1 from empire_private.unified_workshops where user_id=new.user_id and status='unverified') then return null;end if;
 elsif not exists(select 1 from empire_private.players where user_id=new.user_id and classification='verified') then return null;end if;
 return new;end $$;
create or replace function empire_private.refresh_leaderboard() returns void language plpgsql security definer set search_path='' as $$
declare stamp timestamptz:=clock_timestamp();begin
 if current_setting('empire.sync_board',true) is distinct from 'on' and (select next_refresh_at>stamp from empire_private.leaderboard_clock where id) then return;end if;
 perform pg_advisory_xact_lock(270621100);perform set_config('empire.rebuilding_board','on',true);
 delete from public.empire_leaderboard;
 insert into public.empire_leaderboard(user_id,rebirth,level,completed,copper_mg,ascension,gold_mg,updated_at,verification)
 select user_id,(state->>'rebirth')::integer,1+floor(sqrt((state->>'xp')::numeric/20))::integer,(state#>>'{stats,completed}')::bigint,
 (state#>>'{stats,copperCollected,$int}')::numeric,coalesce((state#>>'{ascension,level}')::integer,0),coalesce((state#>>'{gold,recovered,$int}')::numeric,0),stamp,verification
 from(select user_id,state,'unverified'::text as verification from empire_private.unified_workshops where status='unverified'
 union all select p.user_id,p.state,'verified' from empire_private.players p where p.classification='verified' and not exists(select 1 from empire_private.unified_workshops u where u.user_id=p.user_id)) rows
 order by coalesce((state#>>'{ascension,level}')::integer,0) desc,(state->>'rebirth')::integer desc,(state#>>'{stats,completed}')::bigint desc,(state#>>'{stats,copperCollected,$int}')::numeric desc,user_id limit 100;
 perform set_config('empire.rebuilding_board','off',true);
 update empire_private.leaderboard_clock set refreshed_at=stamp,next_refresh_at=to_timestamp(floor(extract(epoch from stamp)/1800)*1800)+interval '30 minutes' where id;
end $$;
create or replace function public.empire_rankings() returns jsonb language sql security definer set search_path='' as $$
 select coalesce(jsonb_agg(to_jsonb(rows) order by rank),'[]') from(select row_number() over(order by b.ascension desc,b.rebirth desc,b.completed desc,b.copper_mg desc,b.user_id) as rank,p.username,b.ascension,b.rebirth,b.level,b.completed,b.copper_mg::text,b.gold_mg::text,b.verification,b.updated_at from public.empire_leaderboard b join public.empire_profiles p on p.id=b.user_id order by b.ascension desc,b.rebirth desc,b.completed desc,b.copper_mg desc,b.user_id limit 100) rows;
$$;
