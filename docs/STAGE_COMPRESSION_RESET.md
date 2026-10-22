# Stage Compression Ascension reset — v6.2.2

Stage Compression now resets to **Rank 0 only when Ascension is confirmed**.
The next purchase is Rank 1 for exactly **100 g Standard copper**. The original
seven costs and their 100× progression are unchanged. Ordinary Rebirth preserves
the purchased rank. Reviewing or failing an Ascension trial does not reset it.

The shared `progression.js` implementation serves the browser, unified workshop
and remaining verified server engine. Rank display and actual generated stage
count use the same `s.compression`. Current-chapter devices retain their authored
three-stage floor, previous chapters retain at least one, and the compulsory
signature remains the final stage. Existing active attempts retain their already
generated stages; the repaired rank applies to subsequent attempts.

## One-time save repair

The additive save policy has two fields:

- `compressionPolicyVersion: 1`
- `compressionAscension`: the Ascension level owning the current rank.

An old save without the policy is stamped during normal loading/validation.
Unascended players keep their rank. An already-Ascended player with an unmarked
rank has it reset once to zero. The previous rank is retained in
`compressionMigration` for diagnostics/recovery. A rank stamped to an earlier
Ascension is also stale and is repaired. Once stamped, subsequent purchases at
the same Ascension are preserved across loads, retries, cloud sync and Rebirth.
New confirmed Ascensions reset the rank and stamp the new Ascension together.
Unknown future policy versions are rejected without rewriting their data.

Old saves do not contain a trustworthy purchase date/Ascension for each rank.
Consequently an unmarked post-Ascension rank cannot be distinguished from a
retained pre-Ascension rank; the one-time repair applies to all such unmarked
Ascended saves. It neither charges nor grants copper and changes no other
progress, permanent Ascension skills, gold, facilities, shipments or counters.

Original legacy local save strings remain untouched. Unified document migration
keeps a local recovery of the complete pre-repair state and marks the repaired
document dirty so the ordinary sync schedule can persist it. Cloud continuations
are also marked dirty when normalized; server commits preserve their usual
revision protection and recoveries. This is a **lazy versioned save migration**,
not an unreviewed bulk rewrite of production accounts or original backup tables.

## Compatibility and release

The frontend sends API client version 9. Old clients may still read progress but
must reload before writing unified snapshots or confirming an Ascension with the
old “keeps Stage Compression” warning. Deploy the updated Edge Function and tested
frontend together after review. No SQL schema change, new secret or environment
variable is required. Do not test on the owner's Main save.

Regression coverage includes A1/A2 confirmation, the 100 g repurchase, ordinary
Rebirth, trial failure, old local and unified saves, original recovery copies,
repeated loads/new purchases, old clients, server transitions, and every catalogue
device at every rank under current/previous-chapter floors.

Verification: **597 automated tests passed**, followed by a successful production
build. A disposable browser fixture loaded an old A1/Rank 6 save, displayed Rank 0
and the 100 g Rank 1 cost, retained the original Rank 6 recovery, purchased Rank 1,
and reloaded with Rank 1 still owned and Rank 2 correctly priced at 10 kg. Browser
console checks reported no errors. No production account or owner save was used.
