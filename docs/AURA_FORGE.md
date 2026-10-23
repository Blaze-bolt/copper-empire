# Aura Forge v6.1.0

> v6.5.0 expands this historical 20-aura catalogue to 34 with exact rational weights. See [Aura Rarity Expansion](AURA_RARITY_EXPANSION.md) for the current catalogue, migration and release order.

> v6.2.0 saving/eligibility changes supersede the older Local/Main instructions below. See [Unified Workshop](UNIFIED_WORKSHOP.md) for current reconciliation, Debug, local Forge and cloud synchronization behavior.

This focused update replaces aura luck with fixed probabilities, 20 collectible auras, and 16 permanent sequential capacity purchases. It keeps the existing framework, GitHub Pages build, electronics, minigames, save slots, and economy. All dollars are fictional game currency.

## Player behavior

- Aura purchases still unlock at Rebirth 2. Tier 0 permits one roll. Each roll costs exactly $100, separately from capacity purchases. The authored 17 capacities and noncumulative costs are in `src/empire/aura-data.js`.
- Purchases require an authenticated online Main workshop or the existing owner-only Debug workshop. Offline collections remain available, including equip/unequip. Local clients cannot create authoritative purchased auras.
- Every card shows its exact comma-separated `Owned: X`, including zero and duplicates. Owned count, lifetime rolls, and unique types are separate statistics. Collection sorts by rarity, name, or exact owned count.
- Batches of at least 100,000 rolls require confirmation. Buttons lock while a request is pending. Small openings reveal individual copies; bulk openings display all 20 exact counts, including zeros. Outcomes are persisted before any animation. Last opening can be reopened after reconnecting. Animation skipping and reduced motion do not affect awards.
- The probability calculator uses `-expm1(n * log1p(-p))`. Copper God's 100-million-roll probability is approximately 0.995016625%; it remains possible to receive zero or multiple copies.

## Probabilities and sampling

The catalogue stores integer weights over 10,000,000,000. Every authored denominator divides that number. Rusty receives the remaining 7,477,422,429 units (74.77422429%). The integer weights sum exactly to the denominator. UI percentages are formatted informational values; the full denominators remain visible.

`aura-sampler.js` samples a multinomial through sequential conditional binomials, from rarest to most common. The common count is the remaining trials, not an expected value. Conditional denominators use remaining integer weights. Counts always sum to the purchased quantity.

Sparse binomials use geometric waiting times, which sample the Bernoulli success process. Central binomials use Hörmann's transformed-rejection proposal (BTRD); acceptance evaluates adjacent binomial probability ratios from the mode. Monotone ratio bounds allow early rejection of far tails. There is no normal, Poisson, Stirling, rounded expected-value, pity, or fixed-variance substitute. Mathematical reference: [Boost.Random binomial distribution implementation](https://www.boost.org/doc/libs/latest/boost/random/binomial_distribution.hpp). Production uniforms come from server-side Web Crypto, not seeded gameplay randomness. Tests inject a repeatable seed.

As with the rest of the JavaScript runtime, logarithms and uniform generation use finite IEEE-754 arithmetic. The algorithm targets the binomial distribution without a distribution approximation; it does not claim arbitrary-precision real arithmetic. A defensive work budget rejects pathological draws with an explicit error before payment; it never substitutes approximate rewards.

## Exact counters and compatibility

Ownership and lifetime rolls use JavaScript BigInt and the existing JSON `{$int:"digits"}` encoding. SQL validates decimal digits with PostgreSQL numeric. No Number conversion is used for accumulated ownership, sorting, totals, or rendering. Individual batch quantities/counts are safe integers bounded at 100 million. Existing safe integer counters and decimal strings are migrated without precision loss. Invalid or already unsafe numeric data is rejected rather than silently rounded. There is no gameplay inventory cap; normal runtime/database numeric and save-size limits still apply.

The original eight aura IDs remain unchanged. Migration fills twelve new counters with zero, retains ownership, and keeps valid equipped auras. It adds `auraForge` with tier 0 and migration metadata. No free capacity tier is granted. Existing lifetime rolls are retained independently of ownership totals. Capacity, all copies, equipped aura, and lifetime rolls survive ordinary Rebirth and Ascension.

The removed prestige aura-luck investment refunds its original escalating price exactly once: rank `r` returns `r*(r+1)` PP (original per-rank price `2*rank`). Its former non-aura material-discovery contribution is preserved as `legacyQualityLuck`. Other prestige discovery, research, and quality bonuses are unchanged and cannot affect aura odds. A saved migration flag prevents duplicate compensation.

No bulk rewrite of players occurs. Normalization is returned on load and persisted with the next successful authenticated mutation. Existing attempts, factory queues/buildings, workers, shipments, money, copper, gold, CE, settings, and unrelated progression are retained. Active challenges reject Forge mutations until finished or left, preserving the existing attempt. Old v6 clients must reload before aura commands; unrelated existing commands and saves remain compatible.

## Functional abilities

Only the single `equipped` ID supplies effects. Duplicates never stack. All 20 authored abilities are defined in `aura-data.js` and tested against actual recovery, XP, smelting, factory preview, and manufacturing fees.

- Electronic copper: grade-adjusted base × ordinary recovery factor × permanent/Ascension recovery factor × `(1 + aura recovery/100)`, with integer settlement. Copper God contributes 4×, not 300×.
- Electronic XP: existing ordinary and permanent XP factors × `(1 + aura XP/100)`, then floor. Eligible boss XP also receives the aura factor. No aura factor is applied to fixed gold, CE, export prices, or money payouts.
- Smelting and factory throughput: ordinary processing work divided by `(1 + aura speed/100)`. +100% doubles speed. Ordinary duration floors are applied before the aura factor, so it cannot be nullified by a floor.
- Each producing job stores remaining ordinary work, its server timestamp, and the active rate. Equipping settles work at the previous rate, then changes only future work. Unequipping, repeated equips, reconnecting, and optional furnace challenge reductions cannot replay accrued acceleration. Completed jobs never restart. Existing funded jobs retain accrued progress; aura metadata begins prospectively.
- Copper Eclipse charges exactly 97% of the eligible manufacturing fee after the existing A2 85% factor, using one exact integer division. Copper recipes/opportunity cost, wages, freight, export taxes, and dispatched shipment settlements are unchanged. Already funded manufacturing fees remain locked.

## Authority and migration

Additive migration: `supabase/migrations/20261021065956_aura_forge.sql`. It adds a private exact-integer validator and service-role-only `empire_commit_forge`; no tables are dropped or player records rewritten.

The Edge Function authenticates the bearer token with Supabase Auth and requires a confirmed account. Client-supplied identity, outcomes, price, ownership, and tier are not trusted. Sampling runs in the service before committing. The SQL transaction independently checks the stored tier, sequential upgrade, allowed batch, affordability, exact money/money-spent delta, all 20 inventory deltas, sum, and lifetime roll delta. Existing locked revision/receipt commits settle state and rewards together. Duplicate UUID retries return their existing receipt; concurrent new requests from the same revision permit one commit. Failed validation rolls back payment and inventory. Main/Debug receipts and state stay separated; Debug requires the existing owner role.

One request writes one aggregate state and compact result receipt, regardless of batch size. There are no individual-roll rows, Realtime subscriptions, background aura polling, or new recurring jobs. Receipts use the existing receipt retention and conflict-recovery infrastructure. A very old retry cannot settle twice because its expected revision is stale.

No new environment variables or credentials are introduced. Keep the existing Supabase URL/public browser configuration and server-only `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`. Never expose the service role in the browser or repository.

Deployment order after review: (1) apply the additive migration with the normal Supabase migration workflow; (2) deploy `empire-api` with the updated shared sources; (3) merge the reviewed frontend and let the existing Pages workflow publish it. Do not publish only the frontend before its RPC/API dependency. This PR does not deploy the backend or mutate production players. Existing live v6.0.1 stays in place until release.

## Verification and reproduction

Latest local regression run: **406 tests passed, zero failures**; production build passed. Run `npm ci`, `npm test`, and `npm run build`. New tests are `tests/aura-forge.test.mjs` and `tests/aura-forge-sql.test.mjs`. They cover exact weights/costs/counters, seeded reference histograms, central variance, multinomial covariance, extreme rare zero/multiple results, 100-million batches, every ability, migration/refund/reset safety, timer changes, authentication, SQL permissions, rollback, stale/concurrent requests, idempotency, and slot isolation. SQL tests apply the repository migrations to disposable PGlite PostgreSQL with a fixed clock; production uses real Supabase PostgreSQL.

For browser checks, run `node scripts/preview-aura-forge.mjs` (default loopback port 3004). The clearly marked QA page uses the actual Forge UI, HTTP handler, service, sampler, and SQL migrations against an in-memory synthetic account. Its reset controls affect only that disposable database. It never connects to Supabase or reads browser saves. Do not expose this development fixture on a public server; the production build does not include it.

Browser verification completed: tier unlocking with Enter, five-roll individual reveal, skipped animation, all 20 result rows, duplicate request retry, reload persistence, 100-million confirmation/purchase, exact sum of 100 million, continued UI heartbeat, huge comma-separated counters, collection sorting, single equip/unequip, reduced-motion rendering, and narrow mobile layout without horizontal overflow. One observed maximum-batch local HTTP/service/SQL request took 21.1 ms; timing varies by hardware and network. This is not a hosted Supabase load test or production deployment verification. No owner Main save or real account was used for testing.
