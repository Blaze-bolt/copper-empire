-- Price-history retention only. Preserve every other saved account field.
create function empire_private.remove_duplicate_price_history() returns trigger language plpgsql set search_path='' as $$
begin
 new.state:=new.state #- '{market,history}';
 return new;
end $$;
create trigger remove_duplicate_price_history before insert or update of state on empire_private.players for each row execute function empire_private.remove_duplicate_price_history();
-- Item inventory, copper, money, XP, upgrades, quote and all other fields stay unchanged.
update empire_private.players set state=state #- '{market,history}' where state->'market' ? 'history';
