# Global Industrial Era implementation

Release candidate: 6.0.0. This upgrades the existing vanilla JavaScript game and Supabase project. The original 87 electronics, their recipes/rewards and signature engines remain in place. The 59 completed R7–R18 model layouts are unchanged; their drawing primitives are exported for the additions.

## Approved economy

`src/empire/industry-data.js` freezes all 25 owner-approved export references as exact integer money amounts. Original input copper, manufacturing fees and base times are retained. Prices in the original proposal remain available for comparison; that report is not a second source of truth for runtime prices.

Freight before news and optional port improvements:

`ceil((0.0075 × gross + $250,000,000 × cargoVolume × baseRouteMinutes / 15) × (1 − 0.03 × ExportLogisticsRank))`.

The ceiling is applied once to the game's smallest money unit. Every cost and payout uses BigInt; copper is integer mg. A2 reduces only manufacturing fees by 15%. Wages are additional cash expenses. Copper opportunity cost uses the current shared quote, separately from the recorded historical funding basis. Production and dispatch require explicit loss confirmation if their opportunity margin is negative. A copper forecast tick does not change the actual recipe or paid fee; it is rechecked at confirmation. Changed paid terms, shared hourly price versions and route-news versions require a fresh approval.

Money shown compactly has an exact full-dollar tooltip on shipment approvals and world price cells. A dispatched shipment stores its precise unit prices, gross payment, personal/quality bonuses, freight, input-cost basis, opportunity quote, events and timestamps. Subsequent market changes cannot reprice it.

## A2, chapters and compatibility

A2 requires A1, R18, level 45, a successful #87 recovery in the qualifying run, 600 g lifetime validated panning, and the 12-stage trial. The fixed trial uses timing; explicit SHORT/LONG memory; circuit rotation; mechanical alignment; pattern transformation; robot routing; allocation; logic; phase synchronization; multi-target reflex; three-part engineering; Ascendant Core finale. Three failed-stage retries are shared across the attempt. The fourth failure resets the trial. No equipment, money, copper or gold is consumed. Completion opens a separate reset confirmation.

A2 grants **250 additional CE exactly once**, 5× total copper recovery, 4× total XP and qualifying boss/contract money, 2× smelting throughput subject to the floor, 1.5× factory speed and the 15% fee discount. A1 remains 2.5×/2×/2×. Neither Ascension gives an inherent shop or tool discount. Separate purchased research/CE discounts still work. Earned legacy A2 records receive the new +250 grant once without refunding or erasing spent ranks. Existing higher Ascension records are retained; their automatic tier benefits have an A2 floor instead of reducing the new A2 bonus.

All 32 #88–119 catalogue rows are independently tested against the master specification. Each has its own model and signature engine. Seven-rank compression still removes supporting stages, keeps three for eligible current-chapter devices and always retains the signature. Gt = 10^18 mg throughout the economy.

The master gives exact new device data but no numerical R19–R26 entry table. The following increasing defaults are used and tested; they do not alter authored device data:

| Enter | Level | Current-run earnings | Current-run recovered device |
|---|---:|---:|---:|
| R19 | 46 | $750T | #87 |
| R20 | 48 | $2.25Q | #91 |
| R21 | 50 | $6.3Q | #95 |
| R22 | 52 | $17.4Q | #99 |
| R23 | 54 | $46.5Q | #103 |
| R24 | 56 | $117Q | #107 |
| R25 | 58 | $294Q | #111 |
| R26 | 60 | $750Q | #115 |

Each requires A2 and a verified Rebirth Trial. R26 is the final ordinary chapter. An ordinary Rebirth clears an unconfirmed Ascension trial, preventing old trial approvals from crossing runs.

Old gold game IDs 101–107 are migrated to 1001–1007 only for gold attempts. Electronics 101–107 are not remapped. New clients identify protocol 6; older open tabs receive compatible gold response IDs and can finish existing challenges, but must reload before an obsolete Ascension-price purchase or reset confirmation. Main save version remains 4; additions use defaults, not replacement saves.

## Factory rules and chosen numerical details

The A2 blueprint is immediate; construction is independent of R19. Standard Factory costs $1T + 5 Mt, one line, batch one, warehouse 20 volume. Optional buildings cost the specified $10T/25 Mt, $100T/250 Mt and $1Q/2 Gt. Their base lines/storage/batches are respectively 2/60/2, 3/160/4, 5/500/8; all have separate upgrades and queues. Product research and mastery are shared permanent discoveries.

Upgrade caps and rank-one costs follow the master. Later money cost is `ceil(initial × (5/2)^(rank−1))`; copper is `0.1 Mt × rank²`. Batch and warehouse capacity are floored after the full 1.5^rank multiplier, so Standard Factory's first batch rank accumulates fractional capacity toward rank two. Duration is `max(10, ceil(quantity × baseSeconds / throughput))`. Throughput applies A2 once, 1.05^speedRank, and for worker jobs 1 + 5% per efficiency rank, then +15% for an assigned Supervisor and +20% for a Manager. Quality is +1% per rank and +2% for an Inspector, capped at 10% total.

All M01–M30 have real interactive engines, instructions, failure, grading, seeded solvable instances and server replay. M01–M25 are the respective primary recipes. A funded manual failure retains that job and adds 10 seconds, capped at 120 seconds. Its retry is not a new recipe payment. Mastery increments once per **collected manual batch**, not per unit, practice, optional certification or worker output. Thresholds are 5/8/12/16/20 per product tier; licenses cost $50B/$250B/$1T/$10T/$100T per product.

Workers use the exact hire and wage prices. A hire is permanent; dismissal stops assignment and re-assignment is free. Only assigned participating workers are paid per started worker job. Operator is required; Supervisor for F11–F20, Manager for F21–F25 and concurrent automated lines. Handler prepares queued batches. Logistics Manager manages additional saved loading plans. No idle wage debt exists. Queues contain at most two finite entries per automation rank. They pause on missing resources, qualifications, warehouse/line capacity, an unapproved loss or larger labor costs than approved. Resume or cancel/recreate after reviewing costs. Background catch-up completes existing jobs and starts a finite new batch at the present server time; it never backdates endless production.

Full warehouses retain funded finished goods on their line. Compatible product lots merge their exact fees, wages, metal and historical basis, preventing an ever-growing row per individual unit. Partial exports allocate the remaining recorded costs exactly and preserve rounding residues for the final unit.

## Countries, agreements and contracts

The ten countries, ports, route durations, country tag matches and demand percentages follow the master. A single shared hourly price set contains all 250 pairs. Typical hourly movement is about ±3%, including equilibrium recovery; combined news/market movement is capped at ±8%, with prices bounded to 70–150% of the country-adjusted approved reference. Fictional news is shared every 20 minutes; each effect lasts one to three hours. Price biases enter the next hourly update. Applicable freight/travel effects lock on a new dispatch. Older shipments never change.

Reputation bonuses are the authored 0/2/5/9/15%, with a Strategic Agreement adding 3%, total cap 18%. The first three country deliveries in a rolling day earn 3 reputation each; the next seven earn 1; subsequent trivial repeats earn none. A completed accepted contract earns 5. An expired accepted contract loses 2, without charging money or punishing ordinary offline time.

At 40 reputation, a $500B Trade Agreement unlocks a fourth daily premium eight-unit contract offer. At 80, the prior agreement plus $5T buys Strategic access. Ordinary offers ask for 2/3/5 units. All accepted unit rates, deadlines and completion rewards lock; qualifying A2/CE/Golden Engineering money bonuses apply only to the 3% completion reward, not ordinary cargo gross. Daily offer IDs prevent unlimited re-acceptance. In-flight contract cargo reserves its remaining quantity, preventing two ships from claiming the same order. A route that cannot arrive by the deadline is rejected before funding.

## Ships and permanent resets

All five vessel classes use the exact authored prices/capacities/speeds. Voyages use base route time divided by speed, at least five minutes each way. Loading takes 30 seconds before Crane upgrades, with a five-second floor. Loading, outbound and return are separate timestamp states. Arrival pays once; return is calculated from arrival, not from when the player next logs in. An offline return can therefore finish without forcing a second full wait.

Loading can be cancelled before departure if the destination warehouses can receive the restored cargo. Freight remains paid and is recorded as a cancellation loss. Outbound cargo cannot be recalled. Price locks remain recoverable in permanent transaction receipts and active shipment state. Personal shipment history retains the latest 100 records; lifetime counters remain permanent.

Port ranks cap at ten; rank cost triples from the displayed rank-one money cost, plus one Mt × rank. Crane reduces loading by 5%/rank, Staging adds 20 saved-plan volume/rank, Office adds one active contract per two ranks, Freight Efficiency reduces approved freight 1%/rank, Port Automation adds saved loading plans, Fleet Management adds 2% speed/rank. Plans never dispatch or charge freight automatically.

Ordinary Rebirth and Ascension preserve industrial buildings/upgrades, product research, manual mastery, paid licenses, worker hire permits/assignments, funded jobs, queues, warehouse goods, ships, locked cargo, relationships and accepted international contracts. Only ordinary current-run contracts/jobs/facilities follow the existing reset warning. Industry jobs/ships settle once against their original funded terms. No ordinary reset touches gold.

## Audio, input and presentation

Existing owner-supplied track titles, continuous looping, saved 70%/45%/80%/65% controls, mute and test remain. Original synthesized cues cover new production, hires, dispatch, delivery, agreements, certifications and achievements. Music is not restarted by menu switches. The pulse game accepts separate SHORT/LONG tokens through buttons or S/L; correctness never measures a hold duration. Touch drops suppress duplicate compatibility clicks and support tap-select/tap-place as well as dragging. Hidden browser tabs pause challenge clocks. Decorative motion respects reduced motion.

Smelting retains the expanded 2 kg × 1.5^rank exact mg capacity, 12 speed/capacity ranks, A2 half duration with 5s floor, the authored capacity cost table, other rank caps and 20–40% optional timing bonus. No product processing manufactures raw copper for free.

New achievements use actual recovered copper, earned chapters, funded manual collection, license/worker purchases, validated delivered exports, reputation and certification proofs. New earned timestamps persist. Lifetime analytics separate gross proceeds, opportunity net, historical basis, fees, wages, freight, cancelled freight and contract rewards. Local/Debug progress is not added to verified rankings.

## Backend installation and secrets

Reuse the existing Supabase project. Apply `supabase/migrations/20261019051421_global_industry_era.sql` after the earlier migrations, then deploy the bundled `empire-api`. This migration creates only additive global tables/functions and one 20-minute schedule. It does not rewrite Main or Debug saves. Financial RPCs remain service-only; public reads expose only fictional shared quotes/news, or the authenticated caller's own revision. Debug operations still require the provisioned owner UUID and never affect Main or worldwide demand/rankings.

No new secret environment variable is required. The deployed function uses platform-provided `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`; the latter must never appear in browser files or GitHub. The frontend keeps only the existing public `SUPABASE_URL`/`SUPABASE_PUBLISHABLE_KEY` build values. Use `ONLINE_ENABLED` as before. `scripts/prepare-edge.mjs` creates the ignored deployment manifest with an explicit `deno.json` import map. Never upload `output/`, local QA saves or credentials.

See `backend-usage.md` for retention, request budgets and limits. See `checkpoint.md` for actual completed tests and release status; implementation descriptions alone are not a live-test claim.
