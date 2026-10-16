-- Remove redundant chart snapshots from workshop rows; retain all player progress.
update empire_private.players set state=jsonb_set(state,'{market}',(state->'market')-'history'-'quote'-'previous'-'next'-'high'-'low'-'serverTime'-'seed');
-- Explicit denial documents the deliberate browser isolation of these tables.
create policy players_deny_browser on empire_private.players for all to anon,authenticated using(false) with check(false);
create policy receipts_deny_browser on empire_private.receipts for all to anon,authenticated using(false) with check(false);
create policy market_deny_browser on empire_private.market for all to anon,authenticated using(false) with check(false);
create policy prices_deny_browser on empire_private.prices for all to anon,authenticated using(false) with check(false);
create policy influence_deny_browser on empire_private.influence for all to anon,authenticated using(false) with check(false);
