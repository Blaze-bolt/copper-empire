-- Polls within a tick perform reads only; one tick updates the permanent quote.
create or replace function public.empire_market() returns jsonb language plpgsql security definer set search_path='' as $$
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
