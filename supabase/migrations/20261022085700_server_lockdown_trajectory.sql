-- Additive controls; default is OPEN. No player rows are rewritten.
create table empire_private.server_access (
 id boolean primary key default true check(id),enabled boolean not null default false,
 message text not null default '' check(length(message)<=1000),reopens_at timestamptz,
 version bigint not null default 0,code_version bigint not null default 0,session_epoch bigint not null default 0,
 code_hash text,code_salt text,code_rounds integer,updated_at timestamptz not null default now()
);
insert into empire_private.server_access(id) values(true);
create table empire_private.testing_sessions (
 token_hash text primary key check(token_hash ~ '^[a-f0-9]{64}$'),user_id uuid references auth.users(id) on delete cascade,
 epoch bigint not null,expires_at timestamptz not null
);
create index testing_session_expiry on empire_private.testing_sessions(expires_at);
create index testing_session_user on empire_private.testing_sessions(user_id);
create table empire_private.testing_limits(bucket text primary key,window_at timestamptz not null,attempts integer not null);
do $$declare t text;begin foreach t in array array['server_access','testing_sessions','testing_limits'] loop
 execute format('alter table empire_private.%I enable row level security',t);
 execute format('revoke all on empire_private.%I from public,anon,authenticated',t);
end loop;end $$;

create function empire_private.testing_valid(p_user uuid,p_token text,p_epoch bigint) returns boolean
language sql stable security definer set search_path='' as $$
 select p_token is not null and exists(select 1 from empire_private.testing_sessions where token_hash=p_token and epoch=p_epoch and expires_at>clock_timestamp() and (user_id is null or user_id=p_user));
$$;
create function public.empire_access_status(p_user uuid default null,p_token text default null) returns jsonb
language plpgsql security definer set search_path='' as $$
declare s empire_private.server_access;o boolean;t boolean;expiry timestamptz;begin
 select * into s from empire_private.server_access where id;
 o:=exists(select 1 from empire_private.owner_admin where user_id=p_user and singleton);
 t:=empire_private.testing_valid(p_user,p_token,s.session_epoch);
 if t then select expires_at into expiry from empire_private.testing_sessions where token_hash=p_token;end if;
 return jsonb_build_object('enabled',s.enabled,'message',s.message,'reopensAt',s.reopens_at,'version',s.version,'owner',o,'tester',t,'allowed',not s.enabled or o or t,'expiresAt',floor(extract(epoch from expiry)*1000),'serverTime',floor(extract(epoch from clock_timestamp())*1000));
end $$;
create function public.empire_lockdown_admin_status(p_user uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare s empire_private.server_access;begin perform empire_private.assert_owner(p_user);
 select * into s from empire_private.server_access where id;
 return public.empire_access_status(p_user,null)||jsonb_build_object('hasCode',s.code_hash is not null,'sessions',(select count(*) from empire_private.testing_sessions where epoch=s.session_epoch and expires_at>clock_timestamp()));
end $$;
create function public.empire_admin_lockdown(p_user uuid,p_request uuid,p_action text,p_payload jsonb,p_expected bigint) returns jsonb
language plpgsql security definer set search_path='' as $$
declare s empire_private.server_access;r jsonb;begin
 perform empire_private.assert_owner(p_user);
 select * into s from empire_private.server_access where id for update;
 select result into r from empire_private.admin_audit where user_id=p_user and request_id=p_request;
 if found then return public.empire_lockdown_admin_status(p_user);end if;
 if p_request is null or p_expected is null or s.version<>p_expected then raise exception 'ACCESS_CONFLICT: Refresh server controls.';end if;
 if p_action='settings' then
  if jsonb_typeof(p_payload->'enabled')<>'boolean' or length(coalesce(p_payload->>'message',''))>1000 then raise exception 'Invalid maintenance settings';end if;
  if (p_payload->>'enabled')::boolean and not s.enabled and coalesce((p_payload->>'confirm')::boolean,false)<>true then raise exception 'Confirm activating global lockdown';end if;
  s.enabled:=(p_payload->>'enabled')::boolean;s.message:=coalesce(p_payload->>'message','');s.reopens_at:=(p_payload->>'reopensAt')::timestamptz;
 elsif p_action='code' then
  if coalesce(p_payload->>'hash','') !~ '^[a-f0-9]{64}$' or coalesce(p_payload->>'salt','') !~ '^[a-f0-9]{32}$' or (p_payload->>'rounds')::integer is distinct from 600000 then raise exception 'Invalid testing hash';end if;
  s.code_hash:=p_payload->>'hash';s.code_salt:=p_payload->>'salt';s.code_rounds:=600000;s.code_version:=s.code_version+1;
  if coalesce((p_payload->>'revokeSessions')::boolean,true) then s.session_epoch:=s.session_epoch+1;end if;
 elsif p_action='revoke-code' then
  s.code_hash:=null;s.code_salt:=null;s.code_rounds:=null;s.code_version:=s.code_version+1;
  if coalesce((p_payload->>'revokeSessions')::boolean,true) then s.session_epoch:=s.session_epoch+1;end if;
 elsif p_action='revoke-sessions' then s.session_epoch:=s.session_epoch+1;
 else raise exception 'Unknown server access action';end if;
 update empire_private.server_access set enabled=s.enabled,message=s.message,reopens_at=s.reopens_at,code_hash=s.code_hash,code_salt=s.code_salt,code_rounds=s.code_rounds,code_version=s.code_version,session_epoch=s.session_epoch,version=version+1,updated_at=clock_timestamp() where id;
 delete from empire_private.testing_sessions where expires_at<=clock_timestamp() or epoch<>s.session_epoch;
 -- Deliberately omit the payload: hashes, salts and codes never enter audit logs.
 insert into empire_private.admin_audit(user_id,request_id,action,details,result) values(p_user,p_request,'server-'||p_action,jsonb_build_object('enabled',s.enabled),jsonb_build_object('status','saved'));
 return public.empire_lockdown_admin_status(p_user);
end $$;

create function public.empire_testing_attempt(p_bucket text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare stamp timestamptz:=clock_timestamp();w timestamptz;g integer;b integer;begin
 if coalesce(p_bucket,'') !~ '^[a-f0-9]{64}$' then raise exception 'Invalid rate bucket';end if;
 -- Fixed order: global bucket, then network bucket. Both counters commit even on a wrong code.
 insert into empire_private.testing_limits values('global',stamp,1) on conflict(bucket) do update set attempts=case when testing_limits.window_at<=stamp-interval '1 minute' then 1 else testing_limits.attempts+1 end,window_at=case when testing_limits.window_at<=stamp-interval '1 minute' then stamp else testing_limits.window_at end returning attempts,window_at into g,w;
 if g>300 then return jsonb_build_object('allowed',false,'retryAfter',greatest(1,ceil(extract(epoch from w+interval '1 minute'-stamp))));end if;
 insert into empire_private.testing_limits values(p_bucket,stamp,1) on conflict(bucket) do update set attempts=case when testing_limits.window_at<=stamp-interval '1 minute' then 1 else testing_limits.attempts+1 end,window_at=case when testing_limits.window_at<=stamp-interval '1 minute' then stamp else testing_limits.window_at end returning attempts,window_at into b,w;
 delete from empire_private.testing_limits where window_at<stamp-interval '10 minutes';
 return jsonb_build_object('allowed',b<=5,'retryAfter',greatest(1,ceil(extract(epoch from w+interval '1 minute'-stamp))));
end $$;
create function public.empire_testing_secret() returns jsonb language sql security definer set search_path='' as $$
 select case when code_hash is null then null else jsonb_build_object('hash',code_hash,'salt',code_salt,'rounds',code_rounds,'version',code_version) end from empire_private.server_access where id;
$$;
create function public.empire_testing_grant(p_user uuid,p_token text,p_version bigint) returns jsonb
language plpgsql security definer set search_path='' as $$
declare s empire_private.server_access;expiry timestamptz:=clock_timestamp()+interval '2 hours';begin
 select * into s from empire_private.server_access where id for share;
 if s.code_hash is null or s.code_version is distinct from p_version then raise exception 'Testing access changed. Try the current code.';end if;
 delete from empire_private.testing_sessions where expires_at<=clock_timestamp() or epoch<>s.session_epoch;
 insert into empire_private.testing_sessions(token_hash,user_id,epoch,expires_at) values(p_token,p_user,s.session_epoch,expiry);
 return jsonb_build_object('expiresAt',floor(extract(epoch from expiry)*1000));
end $$;

create function empire_private.assert_server_access(p_user uuid) returns void
language plpgsql security definer set search_path='' as $$
declare s empire_private.server_access;begin
 -- Shared lock lasts through the transaction. Activation takes the conflicting row lock.
 select * into s from empire_private.server_access where id for share;
 if s.enabled and not exists(select 1 from empire_private.owner_admin where user_id=p_user and singleton) then
  if current_setting('empire.testing_user',true) is distinct from coalesce(p_user::text,'') or not empire_private.testing_valid(p_user,current_setting('empire.testing_hash',true),s.session_epoch) then
   raise exception 'SERVER_LOCKDOWN: Changes are blocked; your existing progress is preserved.';
  end if;
 end if;
end $$;
create function empire_private.guard_player_write() returns trigger
language plpgsql security definer set search_path='' as $$begin
 perform empire_private.assert_server_access(case when tg_op='DELETE' then old.user_id else new.user_id end);
 if tg_op='DELETE' then return old;end if;return new;
end $$;
-- Backstop older Edge Functions and direct legacy backup upserts too.
create trigger lockdown_players before insert or update or delete on empire_private.players for each row execute function empire_private.guard_player_write();
create trigger lockdown_debug before insert or update or delete on empire_private.debug_players for each row execute function empire_private.guard_player_write();
create trigger lockdown_unified before insert or update or delete on empire_private.unified_workshops for each row execute function empire_private.guard_player_write();
create trigger lockdown_backup before insert or update or delete on public.empire_backups for each row execute function empire_private.guard_player_write();

create function public.empire_lockdown_rpc(p_user uuid,p_token text,p_name text,p_args jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare proc record;argument record;parts text[]:='{}';r jsonb;begin
 if p_name not in ('empire_load','empire_slot_load','empire_commit','empire_commit_asset','empire_debug_commit','empire_commit_industry','empire_commit_forge','empire_unified_commit','empire_unified_debug_copy','empire_unified_moderate','empire_admin_save') or p_name is null then raise exception 'RPC not permitted';end if;
 if coalesce(p_args->>'p_user',p_args->>'p_owner','')<>coalesce(p_user::text,'') or p_user is null then raise exception 'Caller identity mismatch';end if;
 perform set_config('empire.testing_user',p_user::text,true);perform set_config('empire.testing_hash',coalesce(p_token,''),true);
 perform empire_private.assert_server_access(p_user);
 select p.* into strict proc from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname=p_name;
 if exists(select 1 from jsonb_object_keys(p_args) k where not k=any(proc.proargnames)) then raise exception 'Unknown RPC argument';end if;
 for argument in select proc.proargnames[i+1] name,format_type(proc.proargtypes[i],null) typ from generate_series(0,proc.pronargs-1) i loop
  if p_args ? argument.name then
   parts:=array_append(parts,format('%I => %s',argument.name,case when argument.typ='jsonb' then format('($1 -> %L)',argument.name) else format('($1 ->> %L)::%s',argument.name,argument.typ) end));
  end if;
 end loop;
 execute format('select public.%I(%s)',p_name,array_to_string(parts,',')) into r using p_args;
 return r;
end $$;

-- Trajectories share the existing market_admin row, clock and price-history store.
alter table empire_private.market_admin add column trajectory jsonb;
create function empire_private.trajectory_step(q integer,t jsonb,lo integer,hi integer) returns jsonb
language plpgsql volatile set search_path='' as $$
declare remaining integer:=(t->>'duration')::integer-(t->>'completed')::integer;up numeric:=(t->>'up')::numeric;dn numeric:=(t->>'down')::numeric;
 low integer;high integer;desired numeric;nextq integer;goal integer:=(t->>'goal')::integer;opposite_lo integer;opposite_hi integer;begin
 low:=greatest(lo,ceil(q*(1-dn))::integer,(t->'reachableLow'->>(remaining-1))::integer);
 high:=least(hi,floor(q*(1+up))::integer,(t->'reachableHigh'->>(remaining-1))::integer);
 if low>high then raise exception 'Trajectory became infeasible; cancel and review market bounds';end if;
 desired:=q*power(goal::numeric/q,1::numeric/remaining);
 desired:=desired+q*(random()-random())*(up+dn)*case t->>'volatility' when 'low' then .35 when 'high' then .9 else .6 end;
 opposite_lo:=case when goal>=q then low else greatest(low,q+1) end;
 opposite_hi:=case when goal>=q then least(high,q-1) else high end;
 if remaining>1 and opposite_lo<=opposite_hi and random()<.30 then nextq:=opposite_lo+floor(random()*(opposite_hi-opposite_lo+1))::integer;
 else nextq:=greatest(low,least(high,round(desired)::integer));end if;
 t:=t||jsonb_build_object('completed',(t->>'completed')::integer+1,'lastPrice',nextq,'status',case when remaining=1 then 'completed' else 'active' end);
 return jsonb_build_object('quote',nextq,'trajectory',t);
end $$;
create function public.empire_admin_trajectory(p_user uuid,p_request uuid,p_action text,p_payload jsonb,p_expected bigint) returns jsonb
language plpgsql security definer set search_path='' as $$
declare a empire_private.market_admin;q integer;lo integer;hi integer;target integer;duration integer;tol numeric;up numeric;dn numeric;reg integer;
 lows jsonb;highs jsonb;l integer;h integer;k integer;goal integer;t jsonb;prior jsonb;begin
 perform empire_private.assert_owner(p_user);
 perform 1 from empire_private.market where id for update;perform 1 from empire_private.gold_market where id for update;perform public.empire_quotes();
 select * into a from empire_private.market_admin where asset='copper' for update;
 if exists(select 1 from empire_private.admin_audit where user_id=p_user and request_id=p_request) then return jsonb_build_object('version',a.version,'trajectory',a.trajectory);end if;
 if p_request is null or p_expected is null or a.version<>p_expected then raise exception 'MARKET_CONFLICT: Refresh trajectory controls.';end if;
 if p_action='cancel' then t:=a.trajectory||jsonb_build_object('status','cancelled');
 elsif p_action='start' then
  if a.trajectory->>'status'='active' and coalesce((p_payload->>'confirm')::boolean,false)<>true then raise exception 'Confirm replacing the active trajectory';end if;
  if a.pending_price is not null or a.pending_config is not null or a.pending_event is not null then raise exception 'Apply or cancel queued market changes before starting a trajectory';end if;
  if coalesce(p_payload->>'target','') !~ '^[0-9]+(\.[0-9]{1,4})?$' or coalesce(p_payload->>'ticks','') !~ '^[0-9]+$' then raise exception 'Enter an exact target and whole tick count';end if;
  target:=round((p_payload->>'target')::numeric*10000)::integer;duration:=(p_payload->>'ticks')::integer;tol:=coalesce((p_payload->>'tolerance')::numeric,2);
  if duration not between 2 and 360 or tol not between .1 and 10 or p_payload->>'volatility' not in ('low','normal','high') or p_payload->>'volatility' is null then raise exception 'Use 2–360 ticks, 0.1–10%% tolerance, and a listed volatility';end if;
  lo:=(a.config->>'minimum')::integer;hi:=(a.config->>'maximum')::integer;
  if target not between lo and hi then raise exception 'Target must stay inside current copper price bounds';end if;
  reg:=case p_payload->>'volatility' when 'low' then 0 when 'normal' then 1 else 2 end;
  up:=(a.config->'up'->>reg)::numeric/100;dn:=(a.config->'down'->>reg)::numeric/100;
  if up>=1 or dn>=1 then raise exception 'Trajectory movement caps must be below 100%%';end if;
  l:=greatest(lo,ceil(target*(1-tol/100))::integer);h:=least(hi,floor(target*(1+tol/100))::integer);
  lows:=jsonb_build_array(l);highs:=jsonb_build_array(h);
  for k in 1..duration loop l:=greatest(lo,ceil(l/(1+up))::integer);h:=least(hi,floor(h/(1-dn))::integer);lows:=lows||jsonb_build_array(l);highs:=highs||jsonb_build_array(h);end loop;
  select quote into q from empire_private.market where id;
  if q<l or q>h then raise exception 'Target cannot be reached smoothly within these ticks and movement caps. Add ticks or increase allowed volatility.';end if;
  goal:=greatest((lows->>0)::integer,least((highs->>0)::integer,round(target*(1+(random()*2-1)*tol/100*.75))::integer));
  t:=jsonb_build_object('status','active','startPrice',q,'target',target,'goal',goal,'duration',duration,'completed',0,'volatility',p_payload->>'volatility','tolerance',tol,'up',up,'down',dn,'reachableLow',lows,'reachableHigh',highs,'startedEpoch',floor(extract(epoch from clock_timestamp())/10),'lastPrice',q);
 else raise exception 'Unknown trajectory action';end if;
 update empire_private.market_admin set trajectory=t,version=version+1 where asset='copper';
 insert into empire_private.admin_audit(user_id,request_id,asset,action,details,result) values(p_user,p_request,'copper','trajectory-'||p_action,p_payload,jsonb_build_object('status',t->>'status'));
 return jsonb_build_object('version',a.version+1,'trajectory',t);
end $$;

-- Preserve the engine and manual controls; add one trajectory branch to its tick.
do $$declare source text;begin
 select pg_get_functiondef('empire_private.tick_asset(text)'::regprocedure) into source;
 if strpos(source,'u uuid;r uuid;')=0 or strpos(source,'if m.epoch<target-360 then')=0 or strpos(source,'elsif c->>''mode''<>''frozen'' then')=0 or strpos(source,'set config=a.config,')=0 or strpos(source,' end loop;')=0 then raise exception 'Market tick definition changed: review trajectory integration before applying this migration';end if;
 source:=replace(source,'u uuid;r uuid;','u uuid;r uuid;bridge jsonb;');
 source:=replace(source,'if m.epoch<target-360 then','if m.epoch<target-360 and coalesce(a.trajectory->>''status'','''')<>''active'' then');
 source:=replace(source,'elsif c->>''mode''<>''frozen'' then', E'elsif p_asset=''copper'' and a.trajectory->>''status''=''active'' then\n   bridge:=empire_private.trajectory_step(m.quote,a.trajectory,lo,hi);m.quote:=(bridge->>''quote'')::integer;a.trajectory:=bridge->''trajectory'';m.momentum:=0;m.regime:=''trajectory'';dirty:=true;\n  elsif c->>''mode''<>''frozen'' then');
 source:=replace(source,' end loop;',E'  if coalesce(a.trajectory->>''status'','''')<>''active'' and m.epoch<target-360 then m.epoch:=target-360;end if;\n end loop;');
 source:=replace(source,'set config=a.config,','set trajectory=a.trajectory,config=a.config,');
 execute source;
end $$;
-- Direct adjustments/config/events retain their existing behavior after an explicit replacement confirmation.
alter function public.empire_admin_market(uuid,uuid,text,text,jsonb,bigint,boolean) rename to empire_admin_market_before_trajectory;
create function public.empire_admin_market(p_user uuid,p_request uuid,p_asset text,p_action text,p_payload jsonb,p_expected bigint,p_confirm boolean default false) returns jsonb
language plpgsql security definer set search_path='' as $$
declare a empire_private.market_admin;r jsonb;begin
 perform empire_private.assert_owner(p_user);
 perform 1 from empire_private.market where id for update;perform 1 from empire_private.gold_market where id for update;
 perform public.empire_quotes();select * into a from empire_private.market_admin where asset=p_asset for update;
 if not exists(select 1 from empire_private.admin_audit where user_id=p_user and request_id=p_request) and a.trajectory->>'status'='active' then
  if not p_confirm then raise exception 'Confirm cancelling the active trajectory before using another copper market control';end if;
  if a.version<>p_expected then raise exception 'MARKET_CONFLICT: Refresh market controls.';end if;
  update empire_private.market_admin set trajectory=trajectory||'{"status":"cancelled"}'::jsonb where asset=p_asset;
 end if;
 return public.empire_admin_market_before_trajectory(p_user,p_request,p_asset,p_action,p_payload,p_expected,p_confirm);
end $$;
do $$declare f record;begin
 for f in select p.oid::regprocedure sig from pg_proc p join pg_namespace n on n.oid=p.pronamespace where
 (n.nspname='public' and (p.proname in ('empire_access_status','empire_lockdown_admin_status','empire_admin_lockdown','empire_testing_attempt','empire_testing_secret','empire_testing_grant','empire_lockdown_rpc','empire_admin_trajectory','empire_admin_market','empire_admin_market_before_trajectory'))) or
 (n.nspname='empire_private' and p.proname in ('testing_valid','assert_server_access','guard_player_write','trajectory_step')) loop
 execute format('revoke all on function %s from public,anon,authenticated',f.sig);
 if f.sig::text like 'empire_%' then null;end if;
 execute format('grant execute on function %s to service_role',f.sig);
 end loop;
end $$;
