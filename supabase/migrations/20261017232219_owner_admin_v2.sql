-- Owner Admin V2: additive slots and private authority. Provision the sole UUID separately.
create table empire_private.owner_admin (
 singleton boolean primary key default true check(singleton), user_id uuid not null unique references auth.users(id),
 preferred_slot text not null default 'main' check(preferred_slot in ('main','debug'))
);
alter table empire_private.players add column classification text not null default 'verified' check(classification in ('verified','admin_modified'));
alter table empire_private.players add column save_version integer not null default 4;
create table empire_private.debug_players (
 user_id uuid primary key references auth.users(id) on delete cascade, slot text not null default 'debug' check(slot='debug'),
 save_version integer not null default 4, revision bigint not null default 0, state jsonb not null, attempt jsonb, updated_at timestamptz not null default now()
);
create table empire_private.debug_receipts (user_id uuid references auth.users(id) on delete cascade,request_id uuid not null,result jsonb,created_at timestamptz not null default now(),primary key(user_id,request_id));
create table empire_private.admin_main_backup (user_id uuid primary key references auth.users(id),state jsonb not null,attempt jsonb,revision bigint not null,classification text not null,created_at timestamptz not null default now());
create table empire_private.admin_audit (
 id bigint generated always as identity primary key,user_id uuid not null references auth.users(id),request_id uuid not null,
 slot text,asset text,action text not null,details jsonb not null default '{}',result jsonb,created_at timestamptz not null default now(),unique(user_id,request_id)
);
create index admin_audit_recent on empire_private.admin_audit(id desc);
create table empire_private.market_admin (
 asset text primary key check(asset in ('copper','gold')),version bigint not null default 0,config jsonb not null,
 pending_config jsonb,config_epoch bigint,pending_price jsonb,pending_event jsonb,active_event jsonb
);
insert into empire_private.market_admin(asset,config) select asset,jsonb_build_object('minimum',lo,'equilibrium',eq,'maximum',hi,'up',jsonb_build_array(2,5,8,10),'down',jsonb_build_array(2,5,8,10),'probabilities',jsonb_build_array(20,55,22,3),'momentum',.72,'reversion',.003,'bias','automatic','persistence',.85,'reversal',.06,'mode','automatic') from (values('copper',3000,6000,20000),('gold',300000,600000,1800000)) t(asset,lo,eq,hi);
alter table empire_private.market drop constraint market_quote_check;
alter table empire_private.market add constraint market_quote_positive check(quote between 1 and 2000000000);
alter table empire_private.gold_market drop constraint gold_market_quote_check;
alter table empire_private.gold_market add constraint gold_quote_positive check(quote between 1 and 2000000000);
do $$ declare t text;begin foreach t in array array['owner_admin','debug_players','debug_receipts','admin_main_backup','admin_audit','market_admin'] loop
 execute format('alter table empire_private.%I enable row level security',t);
 execute format('create policy deny_browser on empire_private.%I for all to anon,authenticated using(false) with check(false)',t);
 execute format('revoke all on empire_private.%I from public,anon,authenticated',t);end loop;end $$;
create trigger compact_debug_save before insert or update of state on empire_private.debug_players for each row execute function empire_private.remove_duplicate_price_history();
create function empire_private.assert_owner(p_user uuid) returns void language plpgsql security definer set search_path='' as $$ begin
 if p_user is null or not exists(select 1 from empire_private.owner_admin where singleton and user_id=p_user) then raise exception 'OWNER_ONLY: This action is restricted to the provisioned owner.';end if;end $$;
revoke all on function empire_private.assert_owner(uuid) from public,anon,authenticated;

create function public.empire_admin_status(p_user uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare owner boolean;begin owner:=exists(select 1 from empire_private.owner_admin where user_id=p_user and singleton);
 if not owner then return jsonb_build_object('owner',false);end if;
 return jsonb_build_object('owner',true,'preferredSlot',(select preferred_slot from empire_private.owner_admin where user_id=p_user),'mainRevision',(select revision from empire_private.players where user_id=p_user),'debugRevision',(select revision from empire_private.debug_players where user_id=p_user),'backupAvailable',exists(select 1 from empire_private.admin_main_backup where user_id=p_user),'classification',(select classification from empire_private.players where user_id=p_user),'markets',(select jsonb_object_agg(asset,to_jsonb(m)) from empire_private.market_admin m),'logs',(select coalesce(jsonb_agg(to_jsonb(a) order by a.id desc),'[]') from (select id,slot,asset,action,details,result,created_at from empire_private.admin_audit where user_id=p_user order by id desc limit 50) a));
end $$;
create function public.empire_slot_load(p_user uuid,p_slot text,p_initial jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare p record;begin
 if p_slot='main' then perform public.empire_load(p_user,p_initial);select * into p from empire_private.players where user_id=p_user;
 elsif p_slot='debug' then perform empire_private.assert_owner(p_user);insert into empire_private.debug_players(user_id,state) values(p_user,p_initial) on conflict do nothing;select d.*,'debug'::text classification into p from empire_private.debug_players d where user_id=p_user;
 else raise exception 'Unknown save slot';end if;
 return jsonb_build_object('state',p.state,'attempt',p.attempt,'revision',p.revision,'saveVersion',p.save_version,'slot',p_slot,'classification',p.classification);
end $$;
create function public.empire_slot_receipt(p_user uuid,p_slot text,p_request uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;begin
 if p_slot='main' then result:=public.empire_receipt(p_user,p_request);if result is not null then result:=result||jsonb_build_object('slot','main','classification',(select classification from empire_private.players where user_id=p_user));end if;return result;
 elsif p_slot='debug' then perform empire_private.assert_owner(p_user);return (select jsonb_build_object('state',p.state,'attempt',p.attempt,'revision',p.revision,'result',r.result,'duplicate',true,'slot','debug','classification','debug') from empire_private.debug_receipts r join empire_private.debug_players p using(user_id) where r.user_id=p_user and r.request_id=p_request);
 else raise exception 'Unknown save slot';end if;end $$;
-- A defensive trigger protects competitive results even from older API versions.
create function empire_private.exclude_modified_board() returns trigger language plpgsql security definer set search_path='' as $$ begin
 if exists(select 1 from empire_private.players where user_id=new.user_id and classification<>'verified') then return null;end if;return new;end $$;
revoke all on function empire_private.exclude_modified_board() from public,anon,authenticated;
create trigger exclude_modified_board before insert or update on public.empire_leaderboard for each row execute function empire_private.exclude_modified_board();
-- Keep the original transactional implementation, with a wrapper that prevents modified balance influence.
alter function public.empire_commit_asset(uuid,uuid,bigint,jsonb,jsonb,jsonb,integer,numeric,text) rename to empire_commit_asset_v5;
create function public.empire_commit_asset(p_user uuid,p_request uuid,p_expected bigint,p_state jsonb,p_attempt jsonb,p_result jsonb,p_quote integer default null,p_volume numeric default 0,p_asset text default 'copper') returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;class text;begin
 perform 1 from empire_private.market where id for update;perform 1 from empire_private.gold_market where id for update;
 select classification into class from empire_private.players where user_id=p_user for update;
 result:=public.empire_commit_asset_v5(p_user,p_request,p_expected,p_state,p_attempt,p_result,p_quote,case when class='verified' then p_volume else 0 end,p_asset);
 if class<>'verified' then delete from public.empire_leaderboard where user_id=p_user;end if;
 return result||jsonb_build_object('slot','main','classification',class);
end $$;
create function public.empire_debug_commit(p_user uuid,p_request uuid,p_expected bigint,p_state jsonb,p_attempt jsonb,p_result jsonb,p_quote integer default null,p_asset text default 'copper') returns jsonb language plpgsql security definer set search_path='' as $$
declare p empire_private.debug_players;r jsonb;quotes jsonb;begin
 perform empire_private.assert_owner(p_user);perform 1 from empire_private.market where id for update;perform 1 from empire_private.gold_market where id for update;quotes:=public.empire_quotes();
 if p_asset not in ('copper','gold') then raise exception 'Unknown market asset';end if;
 select * into p from empire_private.debug_players where user_id=p_user for update;if not found then raise exception 'Debug workshop not initialized';end if;
 select result into r from empire_private.debug_receipts where user_id=p_user and request_id=p_request;if found then return jsonb_build_object('state',p.state,'attempt',p.attempt,'revision',p.revision,'result',r,'duplicate',true,'slot','debug','classification','debug');end if;
 if p.revision<>p_expected then raise exception 'SAVE_CONFLICT: Another device changed this debug workshop.';end if;
 if p_quote is not null and p_quote<>(quotes->p_asset->>'quote')::integer then raise exception 'QUOTE_CHANGED: Review the current reference price.';end if;
 update empire_private.debug_players set state=p_state,attempt=p_attempt,revision=revision+1,updated_at=now() where user_id=p_user returning * into p;
 insert into empire_private.debug_receipts values(p_user,p_request,p_result,now());
 return jsonb_build_object('state',p.state,'attempt',p.attempt,'revision',p.revision,'result',p_result,'slot','debug','classification','debug');
end $$;

create function public.empire_admin_save(p_user uuid,p_request uuid,p_action text,p_slot text,p_expected bigint,p_other_expected bigint,p_state jsonb,p_details jsonb,p_confirm boolean default false) returns jsonb language plpgsql security definer set search_path='' as $$
declare main empire_private.players;debug empire_private.debug_players;target text:=p_slot;result jsonb;backup empire_private.admin_main_backup;begin
 perform empire_private.assert_owner(p_user);
 perform 1 from empire_private.market where id for update;perform 1 from empire_private.gold_market where id for update;
 perform 1 from empire_private.owner_admin where user_id=p_user for update;
 if exists(select 1 from empire_private.admin_audit where user_id=p_user and request_id=p_request) then return (select a.result from empire_private.admin_audit a where user_id=p_user and request_id=p_request);end if;
 select * into main from empire_private.players where user_id=p_user for update;select * into debug from empire_private.debug_players where user_id=p_user for update;
 if p_slot not in ('main','debug') or main.user_id is null or debug.user_id is null then raise exception 'Initialize both workshops before editing.';end if;
 if (case when p_slot='main' then main.revision else debug.revision end)<>p_expected then raise exception 'SAVE_CONFLICT: Refresh the selected workshop before editing.';end if;
 if (case when p_slot='main' then main.attempt else debug.attempt end)->>'status' in ('active','briefing') then raise exception 'Leave the current attempt before switching or editing saves.';end if;
 if p_action='switch' then target:=p_details->>'target';if target not in ('main','debug') then raise exception 'Unknown target slot';end if;update empire_private.owner_admin set preferred_slot=target where user_id=p_user;
 elsif p_action='copy' then
  if not p_confirm then raise exception 'Confirm replacement of the Debug Workshop.';end if;
  if (case when p_slot='main' then debug.revision else main.revision end)<>p_other_expected then raise exception 'SAVE_CONFLICT: A workshop changed before copying.';end if;
  update empire_private.debug_players set state=main.state,attempt=null,revision=revision+1,updated_at=now() where user_id=p_user;
 elsif p_action='reset-debug' then
  if not p_confirm then raise exception 'Confirm resetting the Debug Workshop.';end if;
  if p_slot<>'debug' then raise exception 'Select Debug before resetting it.';end if;
  update empire_private.debug_players set state=p_state,attempt=null,revision=revision+1,updated_at=now() where user_id=p_user;
 elsif p_action='edit' then
  if p_slot='main' then
   if not p_confirm then raise exception 'MAIN_CONFIRMATION_REQUIRED: Review the real-workshop warning.';end if;
   insert into empire_private.admin_main_backup(user_id,state,attempt,revision,classification) values(p_user,main.state,main.attempt,main.revision,main.classification) on conflict do nothing;
   update empire_private.players set state=p_state,attempt=null,classification='admin_modified',revision=revision+1,updated_at=now() where user_id=p_user;delete from public.empire_leaderboard where user_id=p_user;
  else update empire_private.debug_players set state=p_state,attempt=null,revision=revision+1,updated_at=now() where user_id=p_user;end if;
 elsif p_action='restore-main' then
  if not p_confirm or p_slot<>'main' then raise exception 'Confirm restoring the original Main Workshop.';end if;
  select * into backup from empire_private.admin_main_backup where user_id=p_user;if not found then raise exception 'No original Main backup exists.';end if;
  update empire_private.players set state=backup.state,attempt=null,classification=backup.classification,revision=revision+1,updated_at=now() where user_id=p_user;
  delete from public.empire_leaderboard where user_id=p_user;
  insert into public.empire_leaderboard(user_id,rebirth,level,completed,copper_mg,ascension,gold_mg) values(p_user,(backup.state->>'rebirth')::integer,1+floor(sqrt((backup.state->>'xp')::numeric/20))::integer,(backup.state#>>'{stats,completed}')::bigint,(backup.state#>>'{stats,copperCollected,$int}')::numeric,coalesce((backup.state#>>'{ascension,level}')::integer,0),coalesce((backup.state#>>'{gold,recovered,$int}')::numeric,0));
 else raise exception 'Unknown save administration action';end if;
 result:=jsonb_build_object('slot',target,'saved',true);
 insert into empire_private.admin_audit(user_id,request_id,slot,action,details,result) values(p_user,p_request,p_slot,p_action,p_details,result);
 return result;
end $$;

create function empire_private.validate_market_config(c jsonb) returns void language plpgsql set search_path='' as $$
declare k text;n numeric;sum numeric:=0;v jsonb;begin
 if jsonb_typeof(c)<>'object' or not(c ?& array['minimum','equilibrium','maximum','up','down','probabilities','momentum','reversion','bias','persistence','reversal','mode']) then raise exception 'Incomplete market configuration';end if;
 foreach k in array array['minimum','equilibrium','maximum','momentum','reversion','persistence','reversal'] loop if jsonb_typeof(c->k)<>'number' then raise exception 'Numeric market settings required';end if;end loop;
 if not ((c->>'minimum')::bigint>0 and (c->>'minimum')::bigint<(c->>'equilibrium')::bigint and (c->>'equilibrium')::bigint<(c->>'maximum')::bigint and (c->>'maximum')::bigint<=2000000000) then raise exception 'Invalid market bounds';end if;
 foreach k in array array['up','down','probabilities'] loop
  if jsonb_typeof(c->k)<>'array' then raise exception 'Four regime settings required';end if;
  if jsonb_array_length(c->k)<>4 then raise exception 'Four regime settings required';end if;
  for v in select * from jsonb_array_elements(c->k) loop n:=(v#>>'{}')::numeric;if n<0 or n>100 then raise exception 'Regime values must be 0 to 100';end if;if k='probabilities' then sum:=sum+n;end if;end loop;
 end loop;
 if abs(sum-100)>.000001 then raise exception 'Probabilities must total 100';end if;
 foreach k in array array['momentum','persistence','reversal'] loop if (c->>k)::numeric not between 0 and 1 then raise exception 'Invalid model strength';end if;end loop;
 if (c->>'reversion')::numeric not between 0 and .2 or c->>'mode' not in ('automatic','quiet','normal','turbulent','extreme','frozen') or c->>'bias' not in ('automatic','strongly-bullish','bullish','neutral','bearish','strongly-bearish') then raise exception 'Invalid market mode';end if;
end $$;
revoke all on function empire_private.validate_market_config(jsonb) from public,anon,authenticated;
create function public.empire_admin_market(p_user uuid,p_request uuid,p_asset text,p_action text,p_payload jsonb,p_expected bigint,p_confirm boolean default false) returns jsonb language plpgsql security definer set search_path='' as $$
declare m empire_private.market_admin;epoch bigint;result jsonb;command jsonb;begin
 perform empire_private.assert_owner(p_user);if p_asset not in ('copper','gold') then raise exception 'Unknown market asset';end if;
 perform 1 from empire_private.market where id for update;perform 1 from empire_private.gold_market where id for update;perform public.empire_quotes();
 select a.result into result from empire_private.admin_audit a where a.user_id=p_user and a.request_id=p_request;if found then return result;end if;
 select * into m from empire_private.market_admin where asset=p_asset for update;if m.version<>p_expected then raise exception 'MARKET_CONFLICT: Refresh market settings before changing them.';end if;
 epoch:=floor(extract(epoch from clock_timestamp())/10)+1;
 command:=p_payload||jsonb_build_object('epoch',epoch,'request',p_request,'user',p_user);
 if p_action in ('adjust','set') then
  if m.config->>'mode'='frozen' and not p_confirm then raise exception 'Confirm a manual override while frozen.';end if;
  if (p_payload->>'value')::bigint not between -2000000000 and 2000000000 or (p_action='set' and (p_payload->>'value')::bigint<=0) then raise exception 'Invalid manual price';end if;
  if m.pending_price is not null then update empire_private.admin_audit set result=jsonb_build_object('status','replaced') where user_id=(m.pending_price->>'user')::uuid and request_id=(m.pending_price->>'request')::uuid;end if;
  update empire_private.market_admin set pending_price=command||jsonb_build_object('kind',p_action),version=version+1 where asset=p_asset;
 elsif p_action='cancel' then
  if m.pending_price is not null then update empire_private.admin_audit set result=jsonb_build_object('status','cancelled') where user_id=(m.pending_price->>'user')::uuid and request_id=(m.pending_price->>'request')::uuid;end if;
  update empire_private.market_admin set pending_price=null,version=version+1 where asset=p_asset;
 elsif p_action='config' then
  perform empire_private.validate_market_config(p_payload);
  if m.pending_config is not null then update empire_private.admin_audit set result=jsonb_build_object('status','replaced') where user_id=(m.pending_config->>'user')::uuid and request_id=(m.pending_config->>'request')::uuid;end if;
  update empire_private.market_admin set pending_config=command,config_epoch=epoch,version=version+1 where asset=p_asset;
 elsif p_action='event' then
  if p_payload->>'id' not in ('shortage','demand','manufacturing','glut','recycling','panic','recovery') then raise exception 'Unknown market event';end if;
  if m.pending_event is not null then update empire_private.admin_audit set result=jsonb_build_object('status','replaced') where user_id=(m.pending_event->>'user')::uuid and request_id=(m.pending_event->>'request')::uuid;end if;
  update empire_private.market_admin set pending_event=command,version=version+1 where asset=p_asset;
 else raise exception 'Unknown market administration action';end if;
 result:=jsonb_build_object('status',case when p_action='cancel' then 'cancelled' else 'queued' end,'epoch',epoch,'asset',p_asset);
 insert into empire_private.admin_audit(user_id,request_id,asset,action,details,result) values(p_user,p_request,p_asset,'market-'||p_action,p_payload,result);return result;
end $$;
create function public.empire_admin_error(p_user uuid,p_request uuid,p_message text) returns void language plpgsql security definer set search_path='' as $$ begin
 perform empire_private.assert_owner(p_user);insert into empire_private.admin_audit(user_id,request_id,action,details) values(p_user,p_request,'error',jsonb_build_object('message',left(p_message,512))) on conflict do nothing;end $$;

create or replace function empire_private.tick_asset(p_asset text) returns jsonb language plpgsql security definer set search_path='' as $$
declare m record;a empire_private.market_admin;c jsonb;target bigint:=floor(extract(epoch from clock_timestamp())/10);moment bigint:=floor(extract(epoch from clock_timestamp())*1000);
 table_market text;table_prices text;table_influence text;points jsonb;advanced boolean:=false;dirty boolean:=false;manual boolean;lo integer;hi integer;eq integer;reg integer;upcap double precision;downcap double precision;noise double precision;movement double precision;bias double precision;evbias double precision;evvol double precision;evrev double precision;ev jsonb;duration integer;u uuid;r uuid;
begin
 if p_asset='copper' then table_market:='market';table_prices:='prices';table_influence:='influence';elsif p_asset='gold' then table_market:='gold_market';table_prices:='gold_prices';table_influence:='gold_influence';else raise exception 'Unknown market asset';end if;
 execute format('select * from empire_private.%I where id',table_market) into m;
 if m.epoch<target then execute format('select * from empire_private.%I where id for update',table_market) into m;select * into a from empire_private.market_admin where asset=p_asset for update;else select * into a from empire_private.market_admin where asset=p_asset;end if;
 if m.epoch<target-360 then m.epoch:=target-360;end if;
 while m.epoch<target loop
  advanced:=true;m.epoch:=m.epoch+1;manual:=false;
  if a.pending_config is not null and a.config_epoch<=m.epoch then
   u:=(a.pending_config->>'user')::uuid;r:=(a.pending_config->>'request')::uuid;
   a.config:=a.pending_config-'epoch'-'request'-'user';a.pending_config:=null;a.config_epoch:=null;a.version:=a.version+1;dirty:=true;
   m.momentum:=0;m.regime_until:=0;
   update empire_private.admin_audit set result=jsonb_build_object('status','applied','epoch',m.epoch) where user_id=u and request_id=r;
  end if;
  c:=a.config;lo:=(c->>'minimum')::integer;eq:=(c->>'equilibrium')::integer;hi:=(c->>'maximum')::integer;
  if a.pending_event is not null and (a.pending_event->>'epoch')::bigint<=m.epoch then
   ev:=a.pending_event;duration:=case ev->>'id' when 'shortage' then 18 when 'demand' then 24 when 'manufacturing' then 30 when 'glut' then 18 when 'recycling' then 24 when 'panic' then 9 else 24 end;
   a.active_event:=ev||jsonb_build_object('starts',m.epoch,'ends',m.epoch+duration);a.pending_event:=null;a.version:=a.version+1;dirty:=true;
   update empire_private.admin_audit set result=jsonb_build_object('status','applied','epoch',m.epoch,'ends',m.epoch+duration) where user_id=(ev->>'user')::uuid and request_id=(ev->>'request')::uuid;
  end if;
  if a.active_event is not null and (a.active_event->>'ends')::bigint<=m.epoch then a.active_event:=null;dirty:=true;end if;
  m.previous:=m.quote;
  if a.pending_price is not null and (a.pending_price->>'epoch')::bigint<=m.epoch then
   ev:=a.pending_price;m.quote:=greatest(lo,least(hi,case when ev->>'kind'='set' then (ev->>'value')::bigint else m.quote::bigint+(ev->>'value')::bigint end))::integer;
   a.pending_price:=null;a.version:=a.version+1;dirty:=true;manual:=true;m.momentum:=0;
   update empire_private.admin_audit set result=jsonb_build_object('status','applied','epoch',m.epoch,'quote',m.quote) where user_id=(ev->>'user')::uuid and request_id=(ev->>'request')::uuid;
  elsif c->>'mode'<>'frozen' then
   if c->>'mode'='automatic' then
    if m.regime not in ('quiet','normal','turbulent','extreme') or random()>(c->>'persistence')::double precision then
     noise:=random()*100;reg:=case when noise<(c#>>'{probabilities,0}')::double precision then 0 when noise<(c#>>'{probabilities,0}')::double precision+(c#>>'{probabilities,1}')::double precision then 1 when noise<100-(c#>>'{probabilities,3}')::double precision then 2 else 3 end;
     m.regime:=(array['quiet','normal','turbulent','extreme'])[reg+1];
    end if;
   else m.regime:=c->>'mode';end if;
   reg:=case m.regime when 'quiet' then 0 when 'normal' then 1 when 'turbulent' then 2 else 3 end;
   upcap:=(c->'up'->>reg)::double precision/100;downcap:=(c->'down'->>reg)::double precision/100;
   evbias:=case a.active_event->>'id' when 'shortage' then .014 when 'demand' then .01 when 'manufacturing' then .006 when 'glut' then -.014 when 'recycling' then -.009 when 'panic' then -.025 else 0 end;
   evvol:=case a.active_event->>'id' when 'shortage' then 1.2 when 'glut' then 1.2 when 'demand' then 1.1 when 'manufacturing' then 1.05 when 'recycling' then 1.05 when 'panic' then 1.5 when 'recovery' then .8 else 1 end;
   evrev:=case when a.active_event->>'id'='recovery' then 4 else 1 end;
   bias:=case c->>'bias' when 'strongly-bullish' then .012 when 'bullish' then .006 when 'bearish' then -.006 when 'strongly-bearish' then -.012 else 0 end;
   if random()<(c->>'reversal')::double precision then m.momentum:=-m.momentum*.8;end if;
   noise:=(random()*(upcap+downcap)-downcap)*.72*evvol;
   movement:=greatest(-downcap,least(upcap,noise+m.momentum+bias+evbias+(eq-m.quote)::double precision/eq*(c->>'reversion')::double precision*evrev+greatest(-100,least(100,m.pressure))*.000015));
   m.momentum:=greatest(-downcap,least(upcap,m.momentum*(c->>'momentum')::double precision+movement*(1-(c->>'momentum')::double precision)*.7));
   m.quote:=greatest(lo,least(hi,round(m.quote::numeric*(1+movement))::bigint))::integer;
  else m.regime:='frozen';m.momentum:=0;end if;
  m.quote:=greatest(lo,least(hi,m.quote));m.pressure:=0;
  execute format('insert into empire_private.%I values($1,$2) on conflict(epoch) do nothing',table_prices) using m.epoch,m.quote;
 end loop;
 if advanced then
  execute format('update empire_private.%I set epoch=$1,quote=$2,previous=$3,pressure=$4,momentum=$5,regime=$6,regime_until=$7 where id',table_market) using m.epoch,m.quote,m.previous,m.pressure,m.momentum,m.regime,m.regime_until;
  execute format('delete from empire_private.%I where epoch*10000<$1',table_prices) using moment-3600000;
  execute format('delete from empire_private.%I where epoch<$1',table_influence) using target;
 end if;
 if dirty then update empire_private.market_admin set config=a.config,pending_config=a.pending_config,config_epoch=a.config_epoch,pending_price=a.pending_price,pending_event=a.pending_event,active_event=a.active_event,version=a.version where asset=p_asset;end if;
 execute format('select coalesce(jsonb_agg(jsonb_build_object(''at'',epoch*10000,''quote'',quote) order by epoch),''[]'') from empire_private.%I where epoch*10000>=$1',table_prices) into points using moment-3600000;
 return jsonb_build_object('global',true,'quote',m.quote,'previous',m.previous,'next',(target+1)*10000,'serverTime',moment,'regime',m.regime,'mode',a.config->>'mode','minimum',(a.config->>'minimum')::integer,'equilibrium',(a.config->>'equilibrium')::integer,'maximum',(a.config->>'maximum')::integer,'event',case when a.active_event is null then null else jsonb_build_object('id',a.active_event->>'id','endsAt',(a.active_event->>'ends')::bigint*10000) end,'history',points,'high',(select max((x->>'quote')::integer) from jsonb_array_elements(points) x),'low',(select min((x->>'quote')::integer) from jsonb_array_elements(points) x));
end $$;
-- Every new privileged RPC is service-only. No browser accepts a user-supplied owner UUID.
do $$ declare f record;begin for f in select p.oid::regprocedure signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and (p.proname like 'empire_admin_%' or p.proname like 'empire_slot_%' or p.proname in ('empire_debug_commit','empire_commit_asset','empire_commit_asset_v5')) loop
 execute format('revoke all on function %s from public,anon,authenticated',f.signature);execute format('grant execute on function %s to service_role',f.signature);end loop;end $$;
