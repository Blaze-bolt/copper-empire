create or replace function public.empire_market() returns jsonb language plpgsql security definer set search_path='' as $$
declare m empire_private.market; target bigint:=floor(extract(epoch from clock_timestamp())/10); t bigint; delta integer; points jsonb;
begin
 select * into m from empire_private.market where id for update;
 -- Bound recovery after inactivity to one hour. Normal operation is one tick.
 if m.epoch < target-360 then m.epoch:=target-360; end if;
 while m.epoch<target loop
 t:=m.epoch+1;
 delta:=round((6000-m.quote)*0.018)::integer + ((('x'||substr(md5(t::text),1,6))::bit(24)::int)%101-50) + greatest(-100,least(100,m.pressure));
 m.previous:=m.quote; m.quote:=greatest(3000,least(10000,m.quote+delta));m.epoch:=t;m.pressure:=0;
 insert into empire_private.prices values(t,m.quote) on conflict(epoch) do nothing;
 end loop;
 update empire_private.market set epoch=m.epoch,quote=m.quote,previous=m.previous,pressure=m.pressure where id;
 delete from empire_private.prices where epoch*10000<floor(extract(epoch from clock_timestamp())*1000)-3600000;
 delete from empire_private.influence where epoch<target;
 select coalesce(jsonb_agg(jsonb_build_object('at',epoch*10000,'quote',quote) order by epoch),'[]') into points from empire_private.prices where epoch>=target-360;
 return jsonb_build_object('global',true,'quote',m.quote,'previous',m.previous,'next',(target+1)*10000,'serverTime',floor(extract(epoch from clock_timestamp())*1000),'history',points,'high',(select max(quote) from empire_private.prices),'low',(select min(quote) from empire_private.prices));
end $$;

create or replace function public.empire_quote() returns jsonb language sql security definer set search_path='' as $$ select public.empire_market()-'history'; $$;
create or replace function public.empire_price_history(p_after bigint default 0) returns jsonb language sql stable security definer set search_path='' as $$ select coalesce(jsonb_agg(jsonb_build_object('at',epoch*10000,'quote',quote) order by epoch),'[]') from empire_private.prices where epoch>p_after and epoch*10000>=floor(extract(epoch from now())*1000)-3600000; $$;
revoke all on function public.empire_quote(),public.empire_price_history(bigint) from public;
grant execute on function public.empire_quote(),public.empire_price_history(bigint) to anon,authenticated,service_role;
create extension if not exists pg_cron;
select cron.schedule('copper-market-clock','10 seconds',$job$ select public.empire_quote(); delete from cron.job_run_details where jobid=(select jobid from cron.job where jobname='copper-market-clock') and end_time<now()-interval '1 hour'; $job$);
