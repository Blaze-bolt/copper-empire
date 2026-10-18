# Global Industrial Era — checkpoint 1 (5.2.1)

This is a tested incremental release, **not completion of the full master expansion**. The full owner specification is retained in `docs/GLOBAL_INDUSTRIAL_MASTER_SPEC.txt`. The subsequent owner instruction requests a five-price rebalance proposal and prohibits applying recipe or export-price changes before approval.

## Functional in this checkpoint

- 59 individually authored SVG layouts replace the previous shared models for existing IDs 29–87. A registry supplies real part geometry, different silhouettes, specified module counts, visible copper, cabinets, conveyors, rotors, cooling and supports. Shops, the workshop, owned-device cards and recovery animation use the same renderer.
- Workshop inspection descriptions and an enlarged model dialog. Fans animate only in the featured/enlarged model; reduced motion disables animation.
- Exact Gt parsing, shared formatting across existing copper screens and the owner editor; quadrillion-dollar formatting and signed analytical values. Quantities remain BigInt milligrams and money remains BigInt billionths of a dollar. Existing serialized balances are unchanged.
- Actual renderer contact sheets in color and monochrome and a comparison for every changed model: [model review](../model-proof/index.html).
- Original and proposed economic analysis for all 25 authored factory recipes at five copper prices, including A2 fee discount, minimum wages and an explicit proposed freight formula: [proposal](rebalance-proposal.md), [exact net amounts and margins](rebalance.csv). These files are analysis only; the game does not import proposed prices.

## Preservation and verification

- A new baseline fixture protects ID/name/unlock/price/reward/XP/stage/difficulty/signature contracts for **all 87 existing devices**. No minigame source, progression/reset rule, recipe or global market rule changed in this checkpoint.
- Existing source baseline archived locally; cloud Main/Debug snapshots saved in ignored local output before edits. No backups, authentication data or privileged credentials are included in this release.
- Both live Main save revisions and hashes matched the pre-change baseline at the read-only check. No live player balance was edited for this work.
- 260 automated tests pass (254 existing + 6 new), including existing game success witnesses, server replay checks, PostgreSQL transactions, RLS, Debug isolation, bounded market retention and large exact quantities. Production build passes.
- Desktop and 390px mobile inspection tested in the actual browser; no horizontal page overflow in the mobile workshop. All 59 models rendered in the contact sheets; color and silhouette groups visually inspected. Proofs saved in ignored `output/proof/`.

## Still incomplete — not exposed as finished features

- Phase A remainder: definitive A1/A2 bonuses, removal of Ascension-origin discounts, legacy higher-Ascension migration, A2 once-only +250 CE claim, exact eligibility and 12-stage retry-limited A2 trial. Existing five-Ascension implementation predates this specification; it must be reconciled safely with the new two-era rules before enabling the expanded reset path.
- Phase C: R19–R26, 32 new electronics/models and all 32 new playable signatures. Existing gold signatures currently use 101–107, overlapping the requested new device IDs; assign a separate internal namespace with old-attempt compatibility before adding the new games.
- Phase D: actual factory, all 25 product models, 30 playable manufacturing challenges, product research, funded job state machine and storage. Parsing recipes for a simulation does not implement these features.
- Phase E: permanent manual mastery, paid automation licenses, workers, staffing and finite authoritative queues.
- Phases F/G: ten countries, 250 hourly shared export quotes, real economic news with 48h/100-row cleanup, relations, contracts, fleets, delayed locked-price shipping and exactly-once settlement.
- Phase H remainder: new industry sound cues, new achievements/analytics, full expansion mobile/security/performance acceptance. Existing pulse controls, music and geometric smelting remain covered by regression tests; A2 smelting speed awaits the progression change.

No new SQL schema, scheduled jobs, paid resources or subscriptions were created in this checkpoint. The authenticated API bundle only needs the updated shared units for the owner’s Gt editor; existing permission boundaries remain unchanged. Future financial migrations require their own transaction and security tests before publication.
