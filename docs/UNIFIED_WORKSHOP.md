# Unified Workshop — v6.2.0

This update replaces the two normal playthroughs with one browser workshop. Owner Debug remains isolated. It changes saving and compatibility, not the 119 electronics, signature challenges, factory recipes, aura odds, or progression balance.

## Player behavior

Meaningful purchases, rewards, failures, equipment changes, processing, wages and progression save immediately to `copper-unified-v1`. The previous `copper-empire-v4` save is retained as an original recovery source. Guest play works without an account, including Aura Forge. Exact currency and aura counts use the existing tagged BigInt serialization; counters are never converted to floating point.

Signed-in players upload a compact snapshot every **15 minutes, only when dirty**. Sync Now requests an earlier upload. Reconnection retries use bounded backoff, starting at 15 seconds and capped at 15 minutes. Backgrounding/closing attempts an earlier save, but browsers do not guarantee completion. Requests under 60 KB may use fetch keepalive; larger uploads use ordinary fetch rather than exceeding the browser keepalive budget.

Account & Cloud shows local and accepted-cloud times, pending changes, next scheduled sync, connection, revision, recoveries and conflicts. “Cloud synced” means an acknowledgement was received, not merely that a request started. Signing out retains the same workshop. No normal Local/Main switch remains.

Unfinished normal challenges have a save checkpoint containing the attempt, completed stages and live game state, including Set-backed puzzles. Discrete inputs, stage transitions, pause/background and periodic local checkpoints persist it; animation frames do not write storage. Restoring a live challenge pauses it. A legacy server attempt keeps its completed stages and retry budget; its current stage restarts from its original seed because the old server did not retain a complete live-game state. Paid/failed attempts cannot be re-awarded by restoring the checkpoint. The original legacy attempt remains archived.

## Migration and recovery

Initial reconciliation validates device, legacy Main and private cloud-backup candidates. **Higher Ascension wins, then higher Rebirth**. Ties use proven ancestry; divergent ties require a choice. Timestamps and money do not override that priority. The comparison displays progression and balances, and replacement requires an explicit confirmation. One complete copy is selected; resources are never combined.

Initial device/Main/backup alternatives are archived before acceptance. Legacy source tables remain unchanged. Invalid originals remain in their existing storage and are reported rather than discarded. After migration, legacy Main mutation commands are rejected for that account, preventing old tabs from creating another normal playthrough.

An existing unified cloud save on a new device is reconciled, not migrated again. Clean continuation and divergent changes still respect accepted revisions. Import/recovery validates the complete copy, compares progression, retains the current copy and requires confirmation. Restoring locally does not automatically replace newer cloud progress.

Local recoveries retain six recent alternatives. Cloud storage retains the current snapshot, six routine previous snapshots, and up to three protected initial alternatives. Original legacy rows are retained separately. Recovery bodies are fetched only when selected; routine loads return small recovery headers.

## Concurrency and shared transactions

Each snapshot has schema version 1 metadata: unique ID, parent, root, bounded ancestry, account ownership, cloud revision, dirty generation, local/cloud times and a durable pending request. Game payload version remains 4 for compatibility. Only the generation included in an accepted request becomes clean; actions made during its upload stay pending.

Web Locks coordinate same-browser uploads where supported. Storage events stop divergent tabs from silently overwriting each other. The backend uses account locks, parent/revision compare-and-swap and replay receipts. A timeout reuses its original UUID and payload. If a previously settled request is retried after another accepted revision, the client requests a conflict comparison instead of treating stale local data as current.

Shared market trades, vessel purchases, export dispatch/settlement and other shared operations remain authenticated server transactions against **this same unified inventory**. They send changed-domain patches, authoritative quotes and an idempotency ID. Their atomic accepted checkpoint is an intentional exception to the periodic snapshot interval. Ordinary local actions do not each create database records. Existing market ticks, hourly exports and news clocks are unchanged.

After an account is migrated, the shipping domain is server-owned. Uploaded snapshots cannot rewrite ships, locked prices, paid deliveries or return history. Offline copper gameplay and funded production can continue; cloud-owned shipments await reconnection for authoritative settlement. Guest shipping remains fictional local play until migration. Explicitly selecting an older copy cannot undo accepted shipment history: incompatible shipping histories are rejected and both copies remain recoverable. There is no balance-maximizing merge. Local economy values are unverified; revision protection prevents accidental transaction replay but cannot make an editable browser save cheat-proof.

Production jobs keep funded fees, wages, remaining work, aura timing and end timestamps. Already-funded batches are not charged again by synchronization. Automation queues use current shared quotes when connected; they wait for an available shared world quote rather than inventing one while offline. Settlement, collection and arrival paths retain their existing paid-once guards.

## Aura Forge and Debug

All 20 fixed probabilities, abilities, permanent tiers, exact Owned counters, artworks, calculator and result rows remain. Normal purchases validate unlock, capacity and money, sample authentic random counts, save a candidate transaction durably, and then reveal it. Large batches use a module Worker and the existing statistically tested multinomial sampler. A worker error/timeout spends nothing. Guest and signed-in normal play have the same eligibility; disabled purchases explain unlocks, money, processing or maximum tier.

Owner Debug still uses the existing server-validated engine and its separate inventory. Its changes never enter unified snapshots or rankings. Copying the accepted unified snapshot into Debug requires owner authorization and confirmation, archives the previous Debug state/attempt, and never changes normal progress. Signing out of Debug restores the normal document before local saving. Switching is blocked while a normal transaction is pending.

## Leaderboards and moderation

An accepted changed snapshot or economic checkpoint refreshes the current top 100, ordered by Ascension, Rebirth and the existing progression tie-breakers. The 30-minute scheduled rebuild remains a fallback. Clients cache rankings for at most 15 minutes; acceptance invalidates the submitting client's cache. Rows say **Synced · unverified**; unmigrated legacy verified rows retain a separate label. Debug, excluded and review-flagged snapshots do not rank. The page explains that local unsynced changes are absent.

Schema validation, ownership, ancestry and replay checks are enforced server-side. Anomaly flags cover impossible legacy chapter/Ascension combinations, unusually fast recoveries, Ascension jumps and lifetime-counter regressions. These are moderation signals, not claims of perfect cheating detection. Existing owner authorization governs exclusion/reinstatement; reinstatement never claims verification.

## Backend and deployment

New files: `src/unified/{save,sync,ui,app,attempt}.js`, the aura Worker, `supabase/functions/unified-service.js`, and migration `20261021100843_unified_workshop.sql`. Existing app, Forge, trade, owner and ranking adapters call the new path. No framework or repository migration is involved.

The latest production password-recovery validation, confirmation field and SUPERISE!!! music link are preserved. No new environment variables or secrets are required. Existing Edge Function `SUPABASE_URL` and privileged `SUPABASE_SERVICE_ROLE_KEY` remain server-only. Existing static build variables `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` and `ONLINE_ENABLED` remain public configuration; never put a service-role key into the build. Existing Auth redirects/SMTP configuration are unchanged.

Release order after review:

1. Back up the database and apply the additive unified-workshop migration. It does not rewrite existing player saves.
2. Deploy the updated `empire-api` Edge Function with its shared source modules. Privileged snapshot/recovery/moderation functions grant execution only to `service_role`; private tables have RLS and no browser-role grants.
3. Run authenticated staging smoke checks, then deploy the tested GitHub Pages frontend. The migration is not invoked for an account until that player confirms their selection.
4. Verify initial comparison, accepted snapshot, manual sync, conflict handling and rankings with disposable accounts. Never use the owner's Main data as a test fixture.

This pull request does **not** apply the production migration, modify the owner's save, merge or deploy itself. Deploy backend and frontend as one reviewed release; older clients are intentionally blocked from mutating a migrated legacy Main.

Free-plan bounds: one current snapshot/account; at most nine cloud recoveries; 64 aggregate receipts/account; no per-roll rows; top 100 ranking rows; indexed account/recovery/ranking lookups; no player-save Realtime subscription; unchanged snapshots perform no write. Snapshot size is bounded at 1 MB. Local quota failures preserve the prior durable document and expose an export/recovery warning; users should export before clearing browser storage.

## Verification

Release candidate verification: **449 tests passed, zero failures**, followed by a successful static build. Browser checks also verified mobile comparison at 390 px with no horizontal overflow, exact 100-million-roll results and reload persistence, local/offline purchases, manual/15-minute sync, shared copper purchase into the same inventory, sign-out preservation, recovery confirmation, two-tab comparison, and a live challenge reloading paused. No production save or real account was used. Production Supabase deployment and authenticated staging checks remain release steps, rather than tests claimed to have run against the live project.

Run `node --test --test-concurrency=4 tests/*.test.mjs` and `node scripts/build.mjs`. New tests exercise the actual migration and service in disposable PostgreSQL/PGlite, plus controller clocks and persistence. They cover priority, confirmation, exact counts, 15-minute/no-change behavior, concurrent generations, outbox retry, revisions, ownership, private grants, shared payment rollback, frozen shipment locks, one-time delivery, factory mastery/wages, bounded recoveries, invalid original backups and unfinished challenges. Existing minigame, aura probability/ability, factory, audio, market and shipping regressions remain included.

For browser checks, run `node scripts/preview-unified.mjs` and open `http://127.0.0.1:3007/`. This loopback-only fixture uses an in-memory database and synthetic account, never production Supabase or real tokens. Its visible toolbar simulates offline/reconnection, advances the sync clock, and creates a maximum-capacity guest. It is excluded from the static build. Browser proof includes guest purchases/reload, migration of A0/R12 over R10/R11, manual/automatic sync, offline purchase, unverified rankings and a real 100-million batch whose 20 rows sum exactly to 100 million. Verification results and remaining staging limits are recorded in the PR.
