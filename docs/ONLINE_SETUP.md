# Online backend setup

This upgrades the existing vanilla JavaScript Copper Empire project. All 52 original catalogue entries and minigames, illustrations, local saves, classic game, and GitHub Pages path are retained. The expansion adds 35 exact electronics/signatures plus Ascension, Stage Compression and Gold Operation.

For the additive Global Industrial Era migration and deployment, see [the industry setup guide](industrial-era/IMPLEMENTATION.md) and [current validation](industrial-era/checkpoint.md).

## What runs where

GitHub Pages serves static HTML/CSS/JavaScript and the licensed music asset. The official Supabase JavaScript client is bundled with esbuild; no frontend framework is introduced. Supabase handles email/password accounts, unique usernames, private backup slots, authoritative online workshop saves, two shared markets, and verified rankings. The original local workshop remains available without signing in.

## Configuration

The checked-in `src/online/config.js` contains only a public project URL and publishable key. These are designed to be visible in browsers. It can be disabled with `enabled:false` without disabling local play. An alternative deployment can override it at build time with repository variables:

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Public `https://PROJECT.supabase.co` URL |
| `SUPABASE_PUBLISHABLE_KEY` | Public `sb_publishable_...` key |
| `ONLINE_ENABLED` | Set `false` to disable online features in that build |

Pass both URL and public key together. The build rejects privileged keys. Add variables to the build step's `env` if using GitHub repository variables. The included default config needs no GitHub secret.

Edge Functions receive `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Supabase's runtime. The service-role key must stay there: never put it in source, repository variables, browser storage, a frontend build, or GitHub. No SMTP secret belongs in this repository either. `.env*` and local credentials are ignored.

## Database and function deployment

1. Use the selected Supabase organization and a free project; do not enable paid add-ons without the owner's approval.
2. Apply the migrations in `supabase/migrations` in order. Migration 1 creates accounts, private players/receipts, owner-only backups, public ranking fields, and atomic save/trade functions. Migration 2 enables pg_cron and a 10-second market clock with one-hour retention. Migrations 3–6 compact saved market preferences, avoid redundant writes during polling, and enforce compact storage with a database trigger, including older in-flight API versions and backup copies. Cleanup touches only duplicated price-history data, preserving all other save fields. Migration 20261017095733 adds the gold market, expands copper bounds and market behavior, adds Ascension/panned-gold ranking columns, and installs a service-only atomic asset commit. Apply it once after the original six. Existing player states receive additive defaults in the server, without a bulk player-save rewrite.
3. Deploy `supabase/functions/empire-api/index.ts` as `empire-api`, including `service.js` and its relative imports from the engine/catalogue/data/state/games and all new progression, expansion-catalogue, expansion-games and gold-games imports. Keep the directory hierarchy. `deno.json` is included.
4. The legacy JWT gateway is disabled because the function explicitly verifies every bearer token with `auth.getUser()` and requires a confirmed email. No unauthenticated save, trade, or reward route exists. User IDs always come from the verified token. Service-only database functions are revoked from `anon` and `authenticated`.
5. Set Auth Site URL to `https://blaze-bolt.github.io/copper-empire/` and allow that exact redirect URL. For development, add only the local URLs being used; remove unused testing callbacks afterward.
6. Keep email confirmations enabled. Configure custom SMTP before opening public registration. Supabase's default sender is restricted and unsuitable for worldwide signups. Keep SMTP credentials only in Supabase Authentication → Emails → SMTP Settings. Set a suitable minimum password length and email rate limits.

## Free email option

Brevo's documented free tier includes 300 email sends per day. See https://developers.brevo.com/docs/supabase-smtp-integration and https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans . The owner must create/verify their account, approve its terms, and verify a sender/domain. No paid plan is required for the free allowance. Provider activation and sender verification may require owner action.

Use `smtp-relay.brevo.com`, port `587`, the Brevo SMTP login, and an SMTP key (not a general API key). Enter the SMTP key directly in Supabase; never paste it into the chat or repository. Set the sender to the verified sender and the display name to `Copper Empire`. After setup, test a real signup confirmation and a password reset through a mailbox controlled by the owner. Do not claim delivery was tested until those messages are received and the links work.

## Cloud save behavior

The existing `copper-empire-v4` local save and its recovery copies stay in place. Signing in loads a separate verified online workshop. Each meaningful online action is executed by the server using the existing rules. A revision check prevents stale devices from overwriting newer progress. Retrying a request uses the same UUID; the durable receipt prevents duplicate rewards or trades. An uncertain network save stays pending until retried or refreshed.

An account also has a private local-workshop backup slot. Restoring it requires a review and preserves a recovery copy. Imported or backed-up local progress never becomes a verified market balance or leaderboard score. Shared chart history is omitted from cloud player states and backup archives; it is fetched from the bounded market history instead. Accounts, saves, and necessary transaction receipts are not deleted by market retention.

Attempts store only seed, challenge list, server timestamps, progress, budgets, and scores. Each completed stage replays the actual control/tick recording through the shared 87-signature and seven-claim engine. Rewards require all stages, and are generated only on the server. Failed attempts retain the item and award zero copper/XP. Recordings are checked then discarded, rather than retained in database storage. The unlimited beginner timing challenge can checkpoint its verified clock without rewarding or skipping gameplay. Other challenge clocks and replay budgets are validated. This rejects forged balances, outcomes, and impossible accelerated clocks; it is not a claim to defeat bots that can solve games legitimately.

## Shared market and data limits

Each asset has a database singleton permanently storing its shared quote, current 10-second epoch, bounded pressure, momentum and activity regime. Cron advances it every 10 seconds, independently of open browsers. The SQL function also catches up after downtime using a bounded loop. Copper sells add supply; buys add demand. Each player contributes at most 0.03 percentage points of pressure per tick; aggregate player pressure is at most 0.15 percentage points. Server-generated movement, momentum, shocks and equilibrium recovery dominate. This is a market-maker simulation, not a player-to-player order book. Each player can trade at most six times per asset per tick. Buying standard copper includes a 1% spread; quality sales and all wallet accounting use exact integers.

The prices table deletes entries older than 3,600,000 ms on every tick and never exceeds 361 points. Only the most recent hour is available. Cron run logs are also pruned to one hour for this high-frequency job; the job itself remains. Ephemeral influence rows expire at the next tick. No Realtime subscription is created. Visible pages poll one compact combined quote every 10 seconds, scheduled just after the next shared tick using the returned server-clock offset, and only the open copper/gold chart requests its incremental points. Failed or stale polls retry after 10 seconds rather than spinning. Hidden tabs stop polling. Rankings poll only while shown, at 30-second intervals. Own workshop/background work polls at 20 seconds; unchanged heartbeats do not write receipts or bump save revisions. While another device has an active attempt, a heartbeat leaves that attempt unchanged.

A quote change rejects a trade before changing balances, asking the player to review the new price. Limit sales execute on the next authenticated heartbeat, including on return to the game, at the shared quote. The influence permit submits a bounded shared demand signal on the next tick, with its existing cost and cooldown. The watchlist adds a five-minute moving average without extending the one-hour retention window.

## Verification

Run `npm ci`, `npm test`, and `npm run build` with Node 22+. Existing tests cover all 52 games and economy progression. New tests replay every game at difficulty 0/4/6 and use a real embedded PostgreSQL engine (PGlite) for uniqueness, RLS, transactions, revisions, retention, influence limits, and exact large quantities. No Docker is needed for those tests.

`scripts/test-live.mjs` is an optional deployed-backend smoke test. It expects two disposable, confirmed QA accounts described in a temporary `copper-empire-qa.json` file in the OS temporary directory, never the repository. It verifies real sign-in, seeded minigame replay rewards, duplicate protection, cloud restore across sessions, privacy, trades, history, rankings, rejected direct writes, failure resets, and stale saves. Remove the test accounts and temporary credentials afterward; do not leave QA scores on production rankings.

Security advisories may flag intentionally public SECURITY DEFINER read functions for the shared quote, bounded history, and public ranking fields. Their fixed SQL has an empty search path and no arbitrary user identifier or SQL input. These public functions were reviewed after deployment; private write routes remain service-only. See Supabase's [anonymous execution advisory](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) and [signed-in execution advisory](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable) for context. Private tables intentionally deny all browser roles. Leaked-password screening may depend on Supabase plan availability; do not upgrade automatically.
# Owner Admin V2

Apply the additive owner migration and deploy the updated API before publishing its frontend. [Owner setup and operating guide](OWNER_ADMIN.md) explains the sole UUID binding, private Debug slot, modified Main classification, restorable original backup, audited market queues and security model. Existing non-owner accounts keep the Main slot and normal verified behavior.

