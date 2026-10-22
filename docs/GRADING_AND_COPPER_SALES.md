# Performance grading and Ascension copper sales — v6.2.1

## Scope and deployment

This focused update follows Unified Workshop PR #10. It changes evaluation and
rewards, not the 119 electronic models, winning constraints, timers, failure
budgets or catalogue. Deploy the shared Edge Function source and frontend
together after review. No schema migration or new environment variable is needed.
Do not use an owner save as a test fixture.

## Grading

`grading.js` is shared by browser controls and server recording replay. All 119
signatures have an explicit scoring profile. Continuous timing error replaces
broad perfect bands; hold and tracking games accumulate distance-weighted or
time-weighted error; reaction scoring includes response latency with a 350 ms
full-credit allowance. Logic uses known generated witnesses or documented
solution-operation benchmarks rather than the generous failure move limit.
Witnesses are achievable reference solutions, not claims of mathematical optimality.
Pointer movement samples and consecutive slider updates are not counted as
individual logical decisions. Mandatory demonstrations and thinking time have no
generic speed penalty. Existing per-game completion tests still determine wins.

The normalized precision score is `1 − 0.6 × mean(squared normalized error)`.
Logic efficiency loses 0.55 points per additional benchmark's worth of decisions.
Each recorded mistake or failed constraint submission costs 13 percentage points;
each memory replay costs 10 and each scanner hint costs five. Duplicated error and
miss counters are counted once. Actual stage scores have no artificial 45% floor.
Natural deterministic hold motion is evaluated against its intended centered
trajectory; unavoidable visual temperature oscillation is not a player mistake.

Final thresholds: EX ≥98.5%, S ≥93%, A ≥83%, B ≥70%, otherwise C. EX additionally
requires every stage ≥95%, versioned exceptional stage reports, zero mistakes,
zero replays and no scanner assistance. Legacy numeric scores still complete and
receive S/A/B/C; they cannot acquire invented EX evidence. Only electronic
recoveries gain the EX 1.50× copper multiplier. Existing Prestige grade additions,
tool recovery, permanent recovery and aura recovery remain in their previous order.
Gold, CE, boss cash, manufacturing and exports do not gain the EX copper multiplier.
EX counts as S-or-better for ordinary contracts, achievements and Rebirth checks.

Results retain average, individual stage reports, penalties, exact recovery and
reasons an S recovery missed EX. Run EX counters and a lifetime EX recovery counter
are additive. Existing histories, attempts, inventories and saves are preserved.

### Verification and calibration

The complete regression suite passed **585 tests**. New coverage compares actual
controls and server replay for all 119 games at two independent seeds, and checks
thresholds, meaningful B/C successes, non-frame-perfect EX, assistance, reward
ordering, old attempts, resets and fabricated grade fields.

Run `node scripts/calibrate-grading.mjs` for a reproducible simulation through the
actual timing engine. Seed 6212026, 2,000 attempts per group, difficulty 6 and four
required precision hits produced:

| Independent input timing deviation | Successful | EX | S | A | B | C | EX / successful |
|---|---:|---:|---:|---:|---:|---:|---:|
| 40 ms standard deviation | 1,992 | 218 | 1,252 | 498 | 24 | 0 | 10.94% |
| 90 ms | 1,124 | 9 | 182 | 533 | 362 | 38 | 0.80% |
| 150 ms | 319 | 2 | 39 | 111 | 150 | 17 | 0.63% |

These are synthetic normally distributed input errors, not human playtests.
The 40 ms model is near the requested one-in-8–10 successful attempts; a
game-wide skilled-human EX frequency has **not** been established. Perfect
knowledge witness solvers test solvability and consistency, not human grading rates.
Production grading has no random quota, adjustment or guaranteed EX.

Remaining security limitation: Unified Workshop intentionally accepts unverified
offline gameplay snapshots, as approved in PR #10. Recording replay verifies
online engine commands and ignores client-submitted scores/grade fields. Local
save editing cannot be cryptographically prevented while accepting arbitrary
offline gameplay; synced Unified results must retain their unverified label.

## Ascension sale bonus

Eligible **raw recovered copper sales** pay 1× before Ascension, **1.5× at A1** and
**2× total at A2 and later**. Contract/boss multipliers are separate and unchanged.
The market's worldwide quote is not changed. Gold, ingot/refined product payouts,
factory exports, XP, CE and opportunity-cost forecasts retain their existing rules.

All market purchases are tagged in `copperPurchased`, six exact BigInt milligram
counters. Purchases sell at the ordinary quote. A mixed sale or material spend
consumes bought copper first, then recovered copper. All ordinary material sinks,
factory construction/production, ports, compression, research and furnace inputs
use the same consumption helper. A sale uses integer arithmetic for each eligible
portion; its exact payout is reflected in the preview and earnings statistics.
The server independently applies these rules during shared trading.

Existing saves did not record copper provenance. Their untagged stock is
grandfathered as eligible, without altering their balances or historical records.
This may include material bought before the update; its original source cannot be
reconstructed reliably. **Every new market purchase is excluded**, preventing a
repeatable immediate purchase/resale bonus. Removing an existing provenance field
from a synchronized snapshot is rejected. Legacy unverified save imports retain
the general Unified Workshop trust limitation described above.

Rebirth and Ascension clear the run's raw copper and matching purchase counters
together. The bonus tier is derived from the retained Ascension level. Exact tags
survive local/cloud serialization. Admin balance reductions clamp provenance to
the remaining stock without inventing recovered-history statistics.

The Stage Compression reset change requested subsequently is a separate follow-up;
this update retains the existing compression reset policy.
