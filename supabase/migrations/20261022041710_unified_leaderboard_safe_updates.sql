-- Keep the bounded ranking cache compatible with production safe-update checks.
create or replace function empire_private.refresh_leaderboard() returns void language plpgsql security definer set search_path='' as $$
declare stamp timestamptz:=clock_timestamp();begin
 if current_setting('empire.sync_board',true) is distinct from 'on' and (select next_refresh_at>stamp from empire_private.leaderboard_clock where id) then return;end if;
 perform pg_advisory_xact_lock(270621100);perform set_config('empire.rebuilding_board','on',true);
 delete from public.empire_leaderboard where user_id is not null;
 insert into public.empire_leaderboard(user_id,rebirth,level,completed,copper_mg,ascension,gold_mg,updated_at,verification)
 select user_id,(state->>'rebirth')::integer,1+floor(sqrt((state->>'xp')::numeric/20))::integer,(state#>>'{stats,completed}')::bigint,
 (state#>>'{stats,copperCollected,$int}')::numeric,coalesce((state#>>'{ascension,level}')::integer,0),coalesce((state#>>'{gold,recovered,$int}')::numeric,0),stamp,verification
 from(select user_id,state,'unverified'::text as verification from empire_private.unified_workshops where status='unverified'
 union all select p.user_id,p.state,'verified' from empire_private.players p where p.classification='verified' and not exists(select 1 from empire_private.unified_workshops u where u.user_id=p.user_id)) rows
 order by coalesce((state#>>'{ascension,level}')::integer,0) desc,(state->>'rebirth')::integer desc,(state#>>'{stats,completed}')::bigint desc,(state#>>'{stats,copperCollected,$int}')::numeric desc,user_id limit 100;
 perform set_config('empire.rebuilding_board','off',true);
 update empire_private.leaderboard_clock set refreshed_at=stamp,next_refresh_at=to_timestamp(floor(extract(epoch from stamp)/1800)*1800)+interval '30 minutes' where id;
end $$;
