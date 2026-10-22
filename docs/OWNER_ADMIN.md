# Owner Admin V2

> v6.2.0 saving/eligibility changes supersede the older Local/Main instructions below. See [Unified Workshop](UNIFIED_WORKSHOP.md) for current reconciliation, Debug, local Forge and cloud synchronization behavior.

This is an additive update to the existing Copper Empire game, 87 electronics, 87 signature games, Ascension and Gold Operation. No framework or hosting change is required.

## Access and save switching

Sign in with the existing owner account, `@copper`, and continue the cloud workshop. A 42-pixel copper **Cu** coin appears in the upper-left. Click it to open the compact control room; click again, press Escape, or use its close button to collapse it. On a phone it becomes a drawer. Opening it pauses a running challenge without discarding the attempt. Close the controls and resume the challenge explicitly.

The **Saves** section offers Main Workshop, Debug Workshop, Copy Main to Debug and Reset Debug. The current slot appears at the top of the panel and on the game page. Leave any challenge and resolve pending actions before switching. Each action is acknowledged by the server before a switch. Main and Debug never merge. Closing the browser preserves both saves; the preferred slot is remembered across devices. Each tab explicitly addresses its own selected slot, so switching another device does not redirect an in-flight command.

Debug runs the full existing gameplay engine: purchases, disassembly, practice, copper sales, crafting, tools, facilities, Rebirth, Ascension, panning and gold research. It has independent balances, inventory, XP, achievements, statistics, attempts and revision receipts. Its trades use the shared quote as a reference but never create global influence rows, market pressure or leaderboard entries. Main with administrator-modified progression also has simulated trade influence until restored. Global market administration is a different operation and remains live in either slot.

## Main edits, backup and fairness

Every Main edit requires this warning and an explicit confirmation:

> You're modifying your real workshop. This change will be saved, but administrator-granted progression will not count as legitimately earned leaderboard progress.

The first edit transaction copies the original Main state, attempt, revision and verification classification into a private immutable recovery row before applying the edit. Later edits cannot replace that original backup. Every intervention has a private audit entry describing the changed fields.

An edited Main is labelled **ADMIN MODIFIED**, removed from competitive rankings, and cannot influence shared demand with granted resources. Normal gameplay remains available. Rebirth and Ascension do not clear this database classification. A defensive leaderboard trigger applies to older API clients as well.

**Restore Main from original backup** is a separately confirmed operation. It replaces later Main progress with the original snapshot and restores that snapshot's verification classification. It increments the current revision rather than rewinding it. It never imports Debug progress. Until an original verified snapshot is explicitly restored, modified Main remains excluded. The backup stays available after restoration. Copy and reset operations only replace Debug; there is no Debug-to-Main copy feature.

Player editing uses exact integer wallet units and milligrams. Money additions/sets support up to nine dollar decimal places. Metal inputs support mg, g, kg, t, kt and Mt, with no fractional milligrams. Negative amounts, unknown items, invalid ranks, nonfinite values and excessive quantities are rejected. Copper edits target one of the six qualities. XP, level, R0–R18, A0–A5, CE, inventory, practice signatures, tools, PP, gold claims, equipment and Golden Engineering change actual stored values. Grants never fabricate earned copper, run earnings, boss victories, recovery history, Ascension trial records or panned-gold milestones. Separate prerequisites still apply. Setting A1 or higher enables the real Gold Operation; the Ascension multiplier comes from its existing level model.

## Real shared markets

Choose **Copper** or **Gold**. Every price, settings, event and cancellation command targets that asset only. Public quote responses include active bounds, mode, regime and an event summary; no owner identity or private log is exposed.

Manual prices are persisted immediately and apply once at the next official 10-second epoch. There is one pending price override per asset. A new price replaces the previous pending price; Cancel removes it. Replacement, cancellation and execution update the original audit result. An adjustment uses the shared price at execution, then clamps to that tick's configured minimum/maximum. An exact set is clamped the same way. No random movement runs on a manual-override tick. The resulting point is part of the existing one-hour chart (maximum 361 points).

Bounds and model settings are queued for the next tick. Require `0 < minimum < equilibrium < maximum`; supported quotes range from $0.0001 to $200,000 per gram, in $0.0001 steps. Defaults are copper $0.30 / $0.60 / $2.00 and gold $30 / $60 / $180. Changing bounds also updates server trade validation and chart scaling. Historical points stay visible if old bounds were wider.

Regime defaults are Quiet 20% with +2%/-2%, Normal 55% with +5%/-5%, Turbulent 22% with +8%/-8%, Extreme 3% with +10%/-10%. Up/down caps are independent, 0–100%; probabilities total 100%. Automatic uses a weighted draw when persistence expires. Fixed modes select their named cap. Frozen preserves the quote while epochs and history continue; a manual override while Frozen needs an extra confirmation. Returning to Automatic clears momentum and resumes from the current epoch.

Momentum strength (0–1) controls retained momentum. Persistence (0–1) is the chance to keep the current automatic regime each tick. Reversal frequency (0–1) reverses momentum at the chosen probability. Mean reversion (0–0.2) pulls relative price distance toward equilibrium. Direction adds per-tick bias: Strongly Bullish +1.2%, Bullish +0.6%, Neutral 0%, Bearish -0.6%, Strongly Bearish -1.2%; Automatic has no fixed directional bias. Noise, momentum, bias, reversion, bounded player pressure and event effects are finally clamped to the chosen asymmetric cap and absolute bounds. These are real backend parameters.

| Fictional event | Duration | Effect before regime cap |
| --- | --- | --- |
| Copper Shortage | 3 minutes | +1.4% bias, 1.2× noise |
| Industrial Demand Surge | 4 minutes | +1% bias, 1.1× noise |
| Manufacturing Boom | 5 minutes | +0.6% bias, 1.05× noise |
| Supply Glut | 3 minutes | -1.4% bias, 1.2× noise |
| Recycling Boom | 4 minutes | -0.9% bias, 1.05× noise |
| Market Panic | 90 seconds | -2.5% bias, 1.5× noise |
| Market Recovery | 4 minutes | 4× mean reversion, 0.8× noise |

An event starts at the next tick; one event is active per asset. The same fictional event models are available for gold and affect gold alone. No diamond market exists. Frozen prevents automatic event movement while the event's duration continues to elapse. No real money or real-world spot prices are involved.

## Backend setup and owner provisioning

Apply `supabase/migrations/20261017232219_owner_admin_v2.sql` after the existing migrations. It adds private owner, Debug, receipt, Main backup, audit and per-asset settings tables, save classification/version columns, slot RPCs and the configurable market tick. Existing Main rows are retained, with `verified` as their classification. All added private tables enable RLS and deny browser roles. All privileged RPCs revoke public, anonymous and authenticated execution; only the Edge Function's service role may call them. The existing API authenticates every request using `auth.getUser` and requires a confirmed email before deriving the UUID passed to the database.

Resolve the intended existing account once, verify its profile and confirmation, then provision that immutable Auth UUID through a trusted Supabase SQL session:

```sql
-- Replace only after checking the existing Auth user and profile yourself.
insert into empire_private.owner_admin(user_id)
values ('THE_VERIFIED_EXISTING_AUTH_UUID')
on conflict(singleton) do nothing;
```

The boolean singleton primary key permits exactly one administrator. A conflicting owner requires deliberate trusted database maintenance; there is no self-grant, username/email check at runtime, frontend authorization flag, public provisioning endpoint, or automatic creation of another administrator. On this deployment the existing confirmed `@copper` UUID was resolved and provisioned, without creating a new account. The actual UUID is private configuration in Supabase and is not required in browser code.

Deploy the `empire-api` entrypoint with its relative dependencies, including the new `admin-service.js` and `admin-editor.js`. The gateway's legacy JWT verification setting remains as before: the function itself performs fresh Supabase Auth verification. No new frontend environment variable or secret is needed. Existing public `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` build variables remain supported. Service-role credentials stay in the Supabase function environment, never GitHub Pages or the repository.

Save identity is `(owner Auth UUID, slot)`, with save version and monotonically increasing per-slot revision. Requests carry an immutable UUID and explicit slot. Transactions use consistent copper → gold → owner/player locks. CAS rejects stale devices; durable receipts prevent duplicate gameplay rewards, edits, copies, resets and market commands. Full audits persist; only the most recent 50 entries are fetched by the panel. Opening the panel refreshes controls; compact market polling remains every ten seconds without Realtime subscriptions. Hidden tabs stop polling.

## Verification

Automated tests cover exact editors, rejection of forged owner claims, pinned client slots, SQL authorization, independent saves, CAS, Main backup/restore/classification, competitive exclusion, simulated trade isolation, copy/reset idempotency, both market queues, bounds, cancellation, replacement, frozen confirmation, asymmetric configuration, events and full Debug gameplay through the shared server replay validator. Existing tests retain all 87 signature games and gold claims. Run `npm test` and `npm run build` before publishing. Actual browser and live-backend observations are reported with the delivered release; local simulations alone are not described as live tests.

### Release verification — 18 October 2026

- 224 automated checks passed, including the original games, PostgreSQL authorization/transactions, owner editor logic, exact-integer audit rendering, price-display updates on pages without price elements, and production asset URLs. The static build and GitHub Pages deployment passed. Production uses a content-addressed game bundle and versioned stylesheets to avoid mixing cached files from different releases.
- The existing owner signed in normally. The small icon appeared for that account and was absent in an unsigned browser session. It started collapsed, expanded without reloading the game, and closed with Escape. A 390 × 844 viewport verified the scrollable mobile drawer; the desktop viewport was restored afterward.
- Live Debug money changed $10,000 → $20,000 → $200,000. Standard copper changed 750 g → 1.5 kg → 15 kg. Rebirth 12, level 28, A1, 25 CE, 200 g of granted gold, claims, equipment and Golden Engineering persisted in Supabase. Granted gold left lifetime panned gold at zero.
- A second game session loaded the same Debug save. A stale first-session edit was rejected, and Refresh safely loaded the newer revision. Normal electronic purchasing and copper/gold trades worked. A normal live timing challenge earned grade S, exactly 3,649 mg copper and 60 XP through the existing server replay validator. Debug created no world-market influence rows or ranking entry.
- Main-to-Debug copying and Debug reset worked through confirmed controls. Debug was returned to a fresh independent save. Main remained byte-for-byte unchanged at revision 0 and classification `verified`; the first-edit backup remains uncreated because no live Main edit was confirmed. The Main warning was reviewed and cancelled. Main edit/backup/restore/competitive-exclusion behavior was tested in the PostgreSQL suite, without modifying the owner's real progress.
- Real copper commands applied on official ticks: +$1, −$1, exact $1.2345, and clamping at $2. A queued price was cancelled before execution; repeating an already-applied request did not queue or apply it again. A gold +$1 command changed gold alone. Frozen mode and its separate manual-override confirmation worked. A Market Recovery event appeared in the public interface and expired normally. Settings returned to Automatic with default bounds, no pending prices, and 360 retained points per asset at final inspection.
- Anonymous admin/private-slot API calls were rejected. Private write permissions and the sole-owner registry were checked after migration. No privileged key was introduced into browser configuration. The original owner account and all existing Main data were preserved.
