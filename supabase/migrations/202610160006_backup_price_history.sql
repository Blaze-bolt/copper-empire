-- Remove only duplicated price-history points from backup JSON; keep all progress.
create function empire_private.trim_backup_price_history() returns trigger language plpgsql set search_path='' as $$
declare backup jsonb;
begin
 begin backup:=new.save::jsonb;exception when invalid_text_representation then return new;end;
 if jsonb_typeof(backup->'market')='object' and backup#>'{market,history}' is not null then
  new.save:=jsonb_set(backup,'{market,history}','[]'::jsonb)::text;
 end if;
 return new;
end $$;
create trigger trim_backup_price_history before insert or update of save on public.empire_backups for each row execute function empire_private.trim_backup_price_history();

