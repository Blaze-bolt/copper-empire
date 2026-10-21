-- One shared snapshot, at most 100 rows. Player saves remain the source of truth.
create table empire_private.leaderboard_clock (
 id boolean primary key default true check(id),
 refreshed_at timestamptz, next_refresh_at timestamptz not null default '-infinity'
);
alter table empire_private.leaderboard_clock enable row level security;
revoke all on empire_private.leaderboard_clock from public,anon,authenticated;
insert into empire_private.leaderboard_clock(id) values(true);

-- Older financial RPCs still attempt to update the board after each action.
-- Suppress those derived writes; only the scheduled rebuild may insert/update.
create or replace function empire_private.exclude_modified_board() returns trigger
language plpgsql security definer set search_path='' as $$ begin
 if current_setting('empire.rebuilding_board',true) is distinct from 'on' then return null;end if;
 if not exists(select 1 from empire_private.players where user_id=new.user_id and classification='verified') then return null;end if;
 return new;
end $$;
revoke all on function empire_private.exclude_modified_board() from public,anon,authenticated;

create function empire_private.refresh_leaderboard() returns void
language plpgsql security definer set search_path='' as $$
declare stamp timestamptz:=clock_timestamp();boundary timestamptz;
begin
 if (select next_refresh_at>stamp from empire_private.leaderboard_clock where id) then return;end if;
 perform pg_advisory_xact_lock(270621100);
 if (select next_refresh_at>stamp from empire_private.leaderboard_clock where id) then return;end if;
 boundary:=to_timestamp(floor(extract(epoch from stamp)/1800)*1800);
 perform set_config('empire.rebuilding_board','on',true);
 delete from public.empire_leaderboard;
 insert into public.empire_leaderboard(user_id,rebirth,level,completed,copper_mg,ascension,gold_mg,updated_at)
 select p.user_id,(p.state->>'rebirth')::integer,
  1+floor(sqrt((p.state->>'xp')::numeric/20))::integer,
  (p.state#>>'{stats,completed}')::bigint,(p.state#>>'{stats,copperCollected,$int}')::numeric,
  coalesce((p.state#>>'{ascension,level}')::integer,0),coalesce((p.state#>>'{gold,recovered,$int}')::numeric,0),stamp
 from empire_private.players p join public.empire_profiles u on u.id=p.user_id
 where p.classification='verified'
 order by coalesce((p.state#>>'{ascension,level}')::integer,0) desc,(p.state->>'rebirth')::integer desc,
  (p.state#>>'{stats,completed}')::bigint desc,(p.state#>>'{stats,copperCollected,$int}')::numeric desc,p.user_id
 limit 100;
 perform set_config('empire.rebuilding_board','off',true);
 update empire_private.leaderboard_clock set refreshed_at=stamp,next_refresh_at=boundary+interval '30 minutes' where id;
end $$;
revoke all on function empire_private.refresh_leaderboard() from public,anon,authenticated;
grant execute on function empire_private.refresh_leaderboard() to service_role;

-- Public read exposes only the same non-sensitive ranking fields as before.
-- Refresh-on-demand is a guarded fallback for a missed cron tick, not per-poll work.
create function public.empire_rankings_snapshot() returns jsonb
language plpgsql security definer set search_path='' as $$
begin
 perform empire_private.refresh_leaderboard();
 return (select jsonb_build_object('rows',public.empire_rankings(),
  'updatedAt',floor(extract(epoch from refreshed_at)*1000),
  'nextUpdate',floor(extract(epoch from next_refresh_at)*1000),
  'serverTime',floor(extract(epoch from clock_timestamp())*1000))
  from empire_private.leaderboard_clock where id);
end $$;
revoke all on function public.empire_rankings_snapshot() from public;
grant execute on function public.empire_rankings_snapshot() to anon,authenticated,service_role;
select empire_private.refresh_leaderboard();

create extension if not exists pg_cron;
select cron.schedule('leaderboard-half-hour','*/30 * * * *',$job$
 select empire_private.refresh_leaderboard();
 delete from cron.job_run_details where jobid=(select jobid from cron.job where jobname='leaderboard-half-hour') and start_time<now()-interval '2 days';
$job$);
