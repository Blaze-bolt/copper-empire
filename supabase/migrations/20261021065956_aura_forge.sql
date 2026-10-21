-- Additive Aura Forge settlement. Existing JSON saves migrate on a successful
-- authenticated command, never by a bulk rewrite of Main or Debug workshops.
create function empire_private.aura_integer(value jsonb) returns numeric
language plpgsql immutable set search_path='' as $$
declare text_value text;
begin
 if value is null then return 0;end if;
 text_value:=case when jsonb_typeof(value)='object' then value->>'$int' else value#>>'{}' end;
 if text_value is null or text_value!~'^\d+$' then raise exception 'Invalid exact aura integer';end if;
 return text_value::numeric;
end $$;
revoke all on function empire_private.aura_integer(jsonb) from public,anon,authenticated;

create function public.empire_commit_forge(p_user uuid,p_request uuid,p_expected bigint,p_state jsonb,p_attempt jsonb,p_result jsonb,p_slot text,p_command text,p_quantity integer default 1,p_tier integer default 0) returns jsonb
language plpgsql security definer set search_path='' as $$
declare old_state jsonb;old_revision bigint;receipt jsonb;current_tier integer;new_tier integer;
 capacity integer[]:=array[1,5,10,50,100,500,1000,5000,10000,50000,100000,500000,1000000,5000000,10000000,50000000,100000000];
 prices numeric[]:=array[0,5000,25000,250000,1000000,10000000,50000000,500000000,2000000000,20000000000,100000000000,1000000000000,5000000000000,50000000000000,250000000000000,2500000000000000,10000000000000000];
 ids text[]:=array['rusty','glow','bronze','electric','plasma','storm','ancient','celestial','molten','quantum','eclipse','void','neon','galactic','primordial','singularity','eternal','cosmic','reality','god'];
 id text;cost numeric;awarded numeric;total numeric:=0;before_count numeric;after_count numeric;
begin
 if p_slot is null or p_slot not in ('main','debug') then raise exception 'Unknown save slot';end if;
 if p_slot='debug' then perform empire_private.assert_owner(p_user);end if;
 receipt:=public.empire_slot_receipt(p_user,p_slot,p_request);if receipt is not null then return receipt;end if;
 -- Preserve the existing financial lock ordering and idempotent commit path.
 perform 1 from empire_private.market m where m.id for update;perform 1 from empire_private.gold_market m where m.id for update;
 if p_slot='main' then select state,revision into old_state,old_revision from empire_private.players where user_id=p_user for update;
 else select state,revision into old_state,old_revision from empire_private.debug_players where user_id=p_user for update;end if;
 receipt:=public.empire_slot_receipt(p_user,p_slot,p_request);if receipt is not null then return receipt;end if;
 if old_revision is null or old_revision<>p_expected then raise exception 'SAVE_CONFLICT: Refresh the workshop';end if;
 if (old_state->>'rebirth')::integer<2 then raise exception 'Aura Forge requires Rebirth 2';end if;
 current_tier:=coalesce((old_state#>>'{auraForge,tier}')::integer,0);new_tier:=(p_state#>>'{auraForge,tier}')::integer;
 if current_tier not between 0 and 16 or new_tier is null then raise exception 'Invalid capacity';end if;
 if p_command='aura-capacity' then
  if p_tier is null or p_tier<>current_tier+1 or p_tier>16 or new_tier<>p_tier then raise exception 'Sequential capacity upgrade required';end if;
  cost:=prices[p_tier+1]*1000000000;
 elsif p_command='aura-roll' then
  if p_quantity is null or p_quantity<1 or not p_quantity=any(capacity) or p_quantity>capacity[current_tier+1] or new_tier<>current_tier then raise exception 'Locked batch quantity';end if;
  cost:=p_quantity::numeric*100*1000000000;
  if (p_result->>'quantity')::integer is distinct from p_quantity or empire_private.aura_integer(p_result->'cost')<>cost then raise exception 'Invalid purchase receipt';end if;
 else raise exception 'Unknown forge command';end if;
 if empire_private.aura_integer(old_state->'money')<cost or empire_private.aura_integer(p_state->'money')<>empire_private.aura_integer(old_state->'money')-cost then raise exception 'Invalid aura payment';end if;
 if empire_private.aura_integer(p_state#>'{stats,moneySpent}')<>empire_private.aura_integer(old_state#>'{stats,moneySpent}')+cost then raise exception 'Invalid purchase accounting';end if;
 foreach id in array ids loop
  before_count:=empire_private.aura_integer(old_state->'auras'->id);after_count:=empire_private.aura_integer(p_state->'auras'->id);
  awarded:=case when p_command='aura-roll' then empire_private.aura_integer(p_result->'counts'->id) else 0 end;
  if after_count<>before_count+awarded then raise exception 'Aura inventory mismatch';end if;total:=total+awarded;
 end loop;
 if p_command='aura-roll' and total<>p_quantity then raise exception 'Incomplete aura batch';end if;
 if empire_private.aura_integer(p_state#>'{stats,rolls}')<>empire_private.aura_integer(old_state#>'{stats,rolls}')+(case when p_command='aura-roll' then p_quantity else 0 end) then raise exception 'Lifetime roll mismatch';end if;
 if p_slot='debug' then return public.empire_debug_commit(p_user,p_request,p_expected,p_state,p_attempt,p_result,null,'copper');end if;
 return public.empire_commit_asset(p_user,p_request,p_expected,p_state,p_attempt,p_result,null,0,'copper');
end $$;
revoke all on function public.empire_commit_forge(uuid,uuid,bigint,jsonb,jsonb,jsonb,text,text,integer,integer) from public,anon,authenticated;
grant execute on function public.empire_commit_forge(uuid,uuid,bigint,jsonb,jsonb,jsonb,text,text,integer,integer) to service_role;
