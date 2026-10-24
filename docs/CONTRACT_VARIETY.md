# Contract variety · v6.5.1

Adds 16 repeatable contract offers to address the small advanced/difficult selection used by ordinary Rebirth milestones. The original contracts, their offer IDs at each Rebirth, accepted terms, payouts, three-active limit and milestone thresholds are preserved.

## Choices and progression

| Tier | Added | Earliest unlock | Available choices after update |
|---|---:|---:|---|
| Basic | 3 | R0 | 7 at R0; 10 after the existing basic unlocks |
| Advanced | 6 | R4 | 8 at R4; 9 from R5 |
| Difficult | 7 | R8 | 8 at R8; 9 from R12 |

Rebirth 6 still requires **three advanced contracts claimed during the current run**. Rebirth 9 still requires **five difficult contracts claimed during the current run**. At those two gates, the Contracts page displays the exact required tier and claimed/required count. Merely accepting or finishing an order does not count until its reward is claimed.

The board groups offers by Basic, Advanced and Difficult and shows the number of choices in each tier. Every offer remains available immediately after completion; there is no refresh timer, cooldown or stock rotation. Players can choose different orders or repeat one, and hold three different active orders at once. The board disables additional accepts while all three slots are occupied. Active progress uses readable copper quantities and money rather than raw milligrams/nanodollars, and displayed contract XP reflects the existing permanent XP multiplier.

## New orders

| Tier | Order | Goal |
|---|---|---|
| Basic | Small batch recovery | Complete 3 electronics |
| Basic | Workshop routine | Complete 5 electronics |
| Basic | Starter copper order | Recover 10 g copper |
| Advanced | Advanced copper order | Recover 30 kg copper |
| Advanced | Workshop supply run | Sell 50 kg copper |
| Advanced | Quality recovery batch | Complete 2 electronics at A or better |
| Advanced | Reliable recovery crew | Complete 4 devices consecutively without failure |
| Advanced | Component production order | Craft 6 components |
| Advanced | Advanced batch recovery | Complete 6 electronics |
| Difficult | Industrial copper order | Recover 100 t copper |
| Difficult | Industrial supply run | Sell 150 t copper |
| Difficult | Industrial component order | Craft 15 components |
| Difficult | Industrial quality batch | Complete 4 electronics at A or better |
| Difficult | Dependable industrial crew | Complete 6 devices consecutively without failure |
| Difficult | Large-scale recovery order | Complete 10 electronics |
| Difficult | Industrial ingot order | Smelt 20 ingots |

Mandatory tiers have enough deterministic alternatives to avoid requiring rare discoveries or one-per-run bosses. Crafting offers unlock only after crafting; new ingot offers unlock after smelting. Only actions performed after accepting a new order advance it. New sales orders use actual copper-sold totals, so another contract's money reward cannot fulfill them. New A-or-better orders use cumulative current-run A/S/EX counts, avoiding the 100-entry journal limit.

Newly accepted streak orders take the current streak as their baseline. A qualifying real attempt failure resets active streak progress and allows a fresh sequence of successes; practice and the other existing excluded modes retain their existing streak behavior. This prevents accepting/claiming the same streak order indefinitely from a pre-existing streak. Already accepted legacy streak orders retain their saved baselines and progress.

Offer selection is resolved against the canonical unlocked catalogue before checking duplicates or creating an accepted order. Submitted names, targets, rank and reward values cannot override it. Claim validation, exact money settlement, difficulty counters and duplicate-reward rejection retain their existing paths. No automatic completion, free rebirth, reward multiplier change or special owner progress is added.

## Save and backend compatibility

The new definitions use a separate `contract-...` ID namespace; original `offer-N` mappings are unchanged at every unlock boundary. Active orders remain complete saved copies with their original names, target, baseline, rank, ID and locked reward. No save migration or database schema change is required. Accounts, pending attempts, Main/Debug, 15-minute synchronization, electronics, auras, gold, CE, processing and shipments are untouched.

The same state module is used by local gameplay and authenticated workshop commands. After release approval, deploy `empire-api` from the reviewed sources before publishing the frontend, so online/Debug acceptance understands the new IDs and metrics. Existing service authentication and permissions remain unchanged. There are no new environment variables, database tables, timers, Realtime messages or background jobs. The existing unified-workshop classification and local-progress trust model are unchanged.

## Validation

All **861 automated tests pass**, including 28 focused contract cases and an additional disposable PostgreSQL/unified synchronization case. The production build passes. Tests verify offer counts across all 27 rebirth states, access gates, original IDs, real-action witnesses for all 16 added orders, three/five distinct contract milestones, repeated accepts requiring fresh work, grade journal limits, streak failure behavior, canonical duplicate validation, the clipboard limit, saved terms, online claim rejection and idempotent cloud synchronization. The existing economy simulations still reach every ordinary rebirth through R12.

Browser verification uses only `tests/fixtures/contracts.html`, an explicitly disposable local state with no storage or Supabase connection. The fixture renders the real contract board and calls the actual state functions; its recovery button is a synthetic test harness, excluded from production. It is not a shortcut in the game. `tests/fixtures/contracts-mobile.html` provides a 390-pixel frame and an explicit overflow measurement. Run `PORT=3017 node server.mjs` with the environment syntax for your shell to reproduce the checks. No real player account or save is used.

Browser checks completed: three distinct advanced claims reach the R6 requirement (3/3), and five distinct difficult claims reach the R9 requirement (5/5). Both counters survive a save encode/decode/validation round trip. The three-active limit and keyboard acceptance were verified. A 390-pixel frame reports 375 pixels of usable width and exactly 375 pixels of scroll width, with all 27 R8 offers rendered. Screenshots are retained locally under ignored output/contracts-proof. These are synthetic workshop/browser checks and disposable PostgreSQL tests, not production account mutations.
