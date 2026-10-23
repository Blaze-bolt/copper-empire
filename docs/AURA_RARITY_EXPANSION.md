# Aura rarity expansion · v6.5.0

Implements the exact 34-row catalogue in [the supplied specification](AURA_RARITY_EXPANSION_SPEC.txt), plus the requested Valve Sequence Memory repeated-flash fix. This is a review branch: no live database, markets, player saves or deployment are changed by preparing it.

## Collection and probability model

- Preserve all 20 released IDs, names, effects, ability text, colors and emblems. Add exactly 14 unique IDs with individual vector emblems. Cards retain exact comma-separated ownership counters, including zero, equip status, published odds and ability. New entries carry a textual NEW AURA badge. Bands are Workshop, Radiant, Mythic, Cosmic and Transcendent, with exact odds always visible. Specializations are explicitly distinct, rather than promising universal power increases.
- Rarity sorting uses numeric denominators and stable tie-breakers. Quantum Circuit remains 1/500,000; Copper Eclipse remains 1/1,000,000. All 34 rows, including zeros, appear in batch results; older 20-row receipts replay with new rows showing zero, without generating copies.
- Compute the least common multiple using BigInt: **420,000,000,000**. Every individual weight is a positive BigInt and the sum is exactly that denominator. Rusty Aura remains the common **remainder**, so its probability necessarily decreases when the new exclusive outcomes are added. Every other existing single-roll probability stays unchanged. It is mathematically impossible to add positive probability mass while preserving both all non-common odds and the old common remainder; the supplied remainder rule determines this behavior.
- Use the existing sequential conditional-binomial sampler, rarest first. Conditional remaining weights stay BigInt. Guard before converting numerator and denominator individually to safe integers for the existing binomial PMF computation; 420 billion is below 2^53. Never multiply a denominator or weight by 100 million. Batch quantities/counts are bounded at 100 million, while accumulated ownership/lifetime counts remain BigInt without Number conversion.
- Sparse events retain geometric waiting times with `log1p`; central events retain BTRD rejection with direct binomial PMF ratios. There is no Poisson/normal approximation, expected-count rounding, pity or luck adjustment. As before, real logarithms and secure random uniforms use finite IEEE-754 arithmetic; rational weights are exact, not arbitrary-precision transcendental arithmetic. Unsupported ratios fail explicitly rather than silently round rare probabilities to zero.
- Copper Crown remains 1/20 billion per roll. Its probability of at least one in 100 million rolls is approximately **0.4987520807%**; zero or multiple copies are possible. Copper God's odds remain 1/10 billion.
- Individual rolls remain **$100**. All 16 sequential capacity upgrades and costs are unchanged. This update does not rebalance the bulk-purchase economy.

## Abilities and player safety

All 34 effects use the existing single-equipped-aura recovery, XP, manufacturing fee and prospective processing-work code. Duplicates do not stack. New bonuses do not affect gold, CE, export prices or other unrelated payouts. Existing multiplier ordering and timestamp safeguards remain unchanged.

`auraDefaults` extends collections with 14 zero BigInt counters and `auraForge.catalogueVersion: 2`, retaining the original luck-refund marker, capacity, all old counts, valid equipment, lifetime rolls and last receipt. Repeated normalization grants nothing. Existing unified save validation and server transitions use the same catalogue. Unknown IDs and malformed counters are rejected while the original recovery copy remains intact. The historical Spectrum Complete achievement keeps its original 20-discovery requirement; existing awards are not revoked, and going above 20 discoveries no longer prevents earning it.

No tables, new accounts, environment variables, credentials, recurring jobs, polling or per-roll records are introduced. Normal 15-minute unified synchronization, local/offline Forge behavior, owner Debug separation, existing accounts, attempts, gold, CE, factories, workers and shipments retain their existing rules. The unified system deliberately accepts complete local gameplay snapshots under its existing integrity classification; this expansion does not claim to turn local gameplay into server-verified progression.

## Backend migration and release order

`supabase/migrations/20261023091806_aura_catalogue_expansion.sql` replaces the existing service-role-only Forge settlement function with the same locks, prices, revision checks and idempotent receipt path, extending validation to all 34 IDs and rejecting unknown inventory/result IDs. Missing legacy counters remain zero. It does **not** update player rows or markets. Existing 20-row receipts still return before new validation on a retry. Browser roles retain no direct settlement privileges.

After owner release approval:

1. Apply the additive SQL migration using the existing migration workflow.
2. Prepare/deploy `empire-api` from the reviewed sources with the existing authentication settings (`node scripts/prepare-edge.mjs`).
3. Publish the reviewed frontend through the existing GitHub Pages workflow.

Deploying only the frontend before the backend would cause old settlement validation to reject batches containing new aura copies. No live migration, player rewrite or hosted test is part of this review preparation.

## Valve Sequence Memory

Keep the existing 0.9-second demonstration beat and total watch duration. Each beat now lights for 0.6 seconds and stays dark for 0.3 seconds. Repeated values are therefore separate flashes. A text caption identifies the valve and flash number, including replay offsets; the input phase reminds players that repeated numbers count. Input gating, puzzle generation, sequences, shuffling, difficulty, replay availability, success/failure and rewards are unchanged. The actual game and tutorial share this renderer.

## Verification

Validation: **832 tests passed, zero failures**; production build passed. Run `npm test` and `npm run build`. Dedicated expansion tests freeze the released 20-entry catalogue independently, verify every new authored entry, exact normalization, unsafe-ratio rejection, conservation and variability of 100-million batches, rare zero/multiple outcomes, seeded reference distributions, compatibility/migration, independent totals, artwork, UI order and unchanged prices. Existing effect tests now exercise all 34 auras against actual recovery, XP, smelting, factory production and fee rules. SQL tests exercise all migrations in disposable PGlite, including new Crown settlement, invalid new/unknown IDs, rollback, retries, concurrency, permissions, Main/Debug and unified-cloud compatibility. Valve tests verify repeated on/off beats and unchanged completion/failure rules.

Browser reproduction: run `PORT=3016 node scripts/preview-aura-forge.mjs` (set the environment variable using the host shell). Open `http://localhost:3016/` for the actual HTTP/service/SQL Forge in a disposable local database. Open `/tests/fixtures/aura-expansion-visual.html` for a real browser-worker 100-million sample, responsive 390-pixel iframe, exact large counters and deterministic repeated valve flashes. These fixtures are excluded from the production build. They use no real Supabase account or player save. Physical-device/screen-reader certification and hosted load testing are not claimed.

Observed browser checks: all 34 cards and exact counters, 14 new badges, a 100-million HTTP/service/SQL purchase settling in 73.1 ms, zero Crown copies in that natural sample, 34 result rows summing to exactly 100 million, unchanged totals on duplicate request, new-aura equip/reload, a 100-million worker sample in 34.2 ms with three UI heartbeat updates, and a 390-pixel iframe with 374-pixel content/scroll widths (no horizontal overflow) and a 30-digit exact counter. Timings vary. Repeated Valve 1 rendered lit, dark, then lit as flash 2.
