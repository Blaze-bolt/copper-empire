# Backend measurement and scaling projection — October 18, 2026

Read-only live inspection confirmed the existing Sydney project is healthy and its organization remains on **Free**. No paid resource or additional scheduler has been created.

Measured at inspection:

- Database: 13,416,115 bytes (about 13.4 MB; fluctuates with database maintenance).
- Two confirmed Auth accounts; existing Main save JSON sizes 1,385 and 1,718 bytes. Their revisions and hashes matched the baseline.
- One shared 10-second scheduled clock; both copper and gold history had 360 rows. Current quote polling payload: 518 bytes for both metals. One full copper history response: 13,760 bytes. History is bounded to the latest hour, not player saves.
- No Realtime channels in the game client. Quotes use RPC polling once per 10-second tick, incremental chart history only on the relevant market page. Hidden tabs stop polling.
- Existing authenticated background heartbeat remains approximately once per 20 seconds when visible and outside challenges, saving actual job/automation transitions through the server. Unchanged heartbeat state avoids a database commit. Gameplay commands add requests beyond these baseline estimates.

## Existing worst-case visible idle polling (per hour)

Assumes every player is online continuously, no inactive tabs, current small saves, about 2 KB returned per heartbeat. Decimal MB; HTTP overhead, auth lookups, gameplay recordings, retries, rankings and initial chart fetches excluded. These are estimates, not a load test.

| Simultaneous players | Quote RPC requests | Quote payload MB | Heartbeat Edge calls | Heartbeat payload MB | Realtime messages |
|---:|---:|---:|---:|---:|---:|
| 10 | 3,600 | 1.86 | 1,800 | 3.60 | 0 |
| 50 | 18,000 | 9.32 | 9,000 | 18.00 | 0 |
| 100 | 36,000 | 18.65 | 18,000 | 36.00 | 0 |
| 500 | 180,000 | 93.24 | 90,000 | 180.00 | 0 |

The existing pattern is **not a promise that 500 continuous players fit the Free plan**. For example, 90,000 heartbeats/hour would consume 500,000 calls in about 5.6 hours before gameplay. The historical Free limits used for illustration (500 MB database, 500,000 Edge calls/month, 5 GB egress) must be rechecked against the current dashboard before launch; no quota assumption authorizes a paid upgrade. Large future saves and recordings raise bandwidth substantially.

## Required design for the unfinished industry backend

Use one coordinated hourly market update and a shared version, not 250 schedulers or per-user quote rows. Derive job, voyage and return progress locally from authoritative timestamps. Read a compact market version before fetching the full shared set, cache it, settle lazily/idempotently, and pause unused work. Keep no more than about 24 detailed hourly quote snapshots; news inactive rows expire at 48h or count 100, active rows and necessary unsettled locks are protected. These are requirements for the next implementation, **not deployed features**.

Before claiming a larger-player budget is supported, measure realistic save/recording sizes, active-play command rates, monthly active hours and peak concurrency; run concurrent transaction tests; optimize idle heartbeats without delaying actual automation or cross-device synchronization. Financial receipts and security audit retention must be bounded separately from short-lived chart/news data.
