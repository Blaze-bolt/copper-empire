# Global Industrial Era — release 6.0.0

The owner-approved expansion is implemented in the existing vanilla JavaScript project. The specification remains in ../GLOBAL_INDUSTRIAL_MASTER_SPEC.txt. No new repository or frontend framework was introduced.

## Checkpoint 1 — preserved

The 59 completed electronic model layouts (IDs 29–87) and the original 87 catalogue contracts and signature engines remain in place. The drawing primitives are exported for the additions. Exact Gt/BigInt currency support and the original model comparison remain available.

## Checkpoint 2 — A2 and R19–R26

Implemented the definitive A1/A2 total bonuses, no inherent Ascension purchase discount, exact A2 requirements, 12-stage trial with three shared stage retries, separate reset confirmation and once-only +250 CE. Legacy earned A2 grants are migration-safe. Added all 32 exact catalogue rows, unique models and signature games; R26 is the final chapter. Gold attempts use a separate namespace with old-client compatibility. Existing Main saves retain version 4 and gain defaults without replacement.

Tests independently compare every new numerical catalogue row with the master. All 32 engines have seeded success witnesses, failure checks and authoritative recording replay. A2 eligibility, retry limit, reset, retained progress and duplicate CE claims are tested.

## Checkpoint 3 — approved economy and factories

All 25 approved export references are frozen in runtime and SQL; original recipes, fees and base times are unchanged. Freight uses the approved exact formula. Production and shipment approvals include current copper opportunity, discounted fees, wages and loss consent. Paid terms and dispatched prices cannot silently change.

All 25 products have distinct models and primary games; all 30 factory games are playable. Buildings, research, warehouses, upgrades, funded lines, product-specific manual mastery, licenses, six paid worker roles, assignments and finite persistent queues work. Five actual server-replayed manual batches unlock the tested product license before a funded waged queue can start. Warehouse consolidation and partial exports preserve every exact cost residue.

## Checkpoint 4 — worldwide trade and fleets

Ten countries, 250 shared prices, hourly price versions, 20-minute fictional news with economic effects, relationships, agreements, export contracts and five vessel classes are implemented. Loading, outbound transit, once-only arrival payment, return transit, fleet upgrades and saved loading plans use persistent timestamps. Cargo and freight are reserved once. News never reprices an already dispatched shipment.

A PostgreSQL test environment runs the actual migrations and command handler: RLS/role denials, Main/Debug separation, stale approvals, receipt retries, rollback/conflict checks, eight concurrent same-revision requests (one winner), concurrent world readers, 24-snapshot and 48-hour/100-news retention, and once-only voyage settlement.

## Checkpoint 5 — presentation and regression

Industry audio cues, persistent audio controls, explicit SHORT/LONG pulse input, expanded smelting, achievements/timestamps, analytics, keyboard controls, pointer/tap placement, reduced motion and inactive-tab timing are retained or extended. New memory replays and useful-tile scanners consume the existing attempt-wide upgrade allowance.

**371 automated tests pass, zero failures.** Production build and authenticated backend bundle succeed. Browser QA includes 390px phone layout without page-wide overflow, all 250 quote rows/filtering, keyboard sequence transformation, actual cable-layer manual production and collection, license gating, warehouse removal and one real 12m30s round-trip voyage with delayed once-only payout. The 32 new models, 25 products and monochrome contact sheets use the actual renderer. No 500-user load test or physical touchscreen hardware test is claimed.

## Live backend acceptance — October 19, 2026

The additive migration 20261019051421_global_industry_era.sql is installed and recorded. The connector migration operation returned an expired-request error, so the exact tested file and migration-history entry were applied transactionally through the signed-in Supabase SQL dashboard. empire-api version 10 is ACTIVE with its explicit import map and fresh verified-user authentication inside the function.

Live public HTTP checks return 250 pairs; unchanged polls omit the price array. Export history/news and both original metal quotes respond. Direct anonymous financial commits are denied; missing/invalid API tokens receive HTTP 401. The migration itself left the owner Main revision/hash unchanged (37). Subsequent normal account access can advance workshop revisions; no player resources were edited for deployment. All browser financial QA before publication used the disposable localhost:3003 origin.

Performance advisors report no findings. Security advisors identify the intentionally restricted private RLS tables, deliberately public fictional market/ranking reads and own-JWT revision read, plus the pre-existing disabled leaked-password check. Details and remediation links are in backend-usage.md. No paid infrastructure was enabled.

Publication status and final owner Debug browser verification are recorded in the GitHub release PR; do not infer a live UI deployment from this backend check alone.

## Review artifacts

- [Implementation, numerical defaults and setup](IMPLEMENTATION.md)
- [Approved comparison at five copper prices](rebalance.csv)
- [Original proposal, retained for audit](rebalance-proposal.md)
- [Actual models and silhouettes](../model-proof/industrial-era.html)
- [Backend measurements and projections](backend-usage.md)
