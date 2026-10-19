# Backend usage and security — October 19, 2026

The existing Sydney project remains on Free. No paid resources were enabled. Before/after the additive industry migration, database size was 13,522,611 / 13,948,595 bytes (roughly 14 MB; maintenance changes it). Copper and gold history each had 360 points; their one-hour maximum remains 361. Accounts, saves and necessary financial receipts are separate from chart retention.

## Storage and schedules

One existing 10-second metal clock remains. One new 20-minute industrial clock coordinates the news and hourly export versions; there are no 250 per-pair jobs. Current export storage is 250 prices plus at most 24 full hourly snapshots. News expires after 48 hours and is capped at 100 total while active event effects are protected. Dispatches store their compact locked economic effects independently. Short cron execution logs are pruned by each job. Player transport/jobs advance from stored timestamps; no per-second server writes.

Measured initial world JSON was 38,344 bytes as PostgreSQL text; compact public HTTP unchanged-world response was 157 bytes (172 as SQL text). Both-metal quote response previously measured 518 bytes and full one-hour copper chart 13,760 bytes. Payloads vary with news and numbers. Full prices are returned only when their hourly version changes. News is returned only when its 20-minute version changes; older retained headlines are paged on demand. There are **no Realtime subscriptions or broadcast messages**.

## Polling and invocation budget

Visible dashboard/market/industry pages read metal quotes every 10 seconds; other pages every 60 seconds. Hidden tabs stop polling. Industry version metadata is checked every 60 seconds while that terminal is visible. Idle signed-in workshops read a small owner-scoped revision every 60 seconds. Edge heartbeats occur only for real due jobs, arrivals/returns, finite queues, expiry, funded legacy automation or a once-only legacy A2 grant. They do not run every 20 seconds for an empty idle workshop. Active game commands and initial cloud load still invoke the Edge API.

The following deliberately assumes every player continuously watches the busiest market/industry page. Per player/hour: 360 metal polls ×518 B, 60 revision polls ×50 B (estimate), 60 world checks ×157 B, one 38,344 B world set and two additional 10 KB news responses (estimate) = about 257 KB. Initial history, authentication, gameplay recordings, UI overhead, TLS/HTTP, rankings and retries are excluded. No actual 500-user load test was run.

| Concurrent visible players | Approx read requests/hour | Approx payload MB/hour | Empty idle Edge heartbeats/hour | Realtime messages |
|---:|---:|---:|---:|---:|
| 10 | 4,800 | 2.57 | 0 | 0 |
| 50 | 24,000 | 12.87 | 0 | 0 |
| 100 | 48,000 | 25.73 | 0 | 0 |
| 500 | 240,000 | 128.67 | 0 | 0 |

An illustrative 30 actual gameplay API commands/player/hour adds 300 / 1,500 / 3,000 / 15,000 Edge invocations for those player counts. The request bodies and growing saves can exceed the idle payload by a large amount. Five hundred people active all month do not fit a small Free budget merely because each global table is bounded. Measure active hours and real command/save sizes before scaling.

Current official Free allowances include 500 MB database, 500,000 Edge invocations/month and 5 GB uncached egress, with cached egress tracked separately. See [billing](https://supabase.com/docs/guides/platform/billing-on-supabase), [Edge invocations](https://supabase.com/docs/guides/platform/manage-your-usage/edge-function-invocations) and [egress](https://supabase.com/docs/guides/platform/manage-your-usage/egress). These are a budget, not authorization to purchase upgrades or a performance guarantee.

## Transaction and advisory review

Financial actions derive outcomes on the server, authenticate fresh verified-email users, lock rows in a consistent order and use request receipts plus expected revisions. Shared price/news versions are checked again inside SQL commit. Exact numbers use BigInt/string/NUMERIC. The browser cannot commit arbitrary balances. Debug commits require the bound owner Auth UUID and never affect Main, demand or verified ranking.

The live performance advisor reports no findings. Security notices are reviewed rather than hidden:

- Six private export tables have RLS with no client policies and no browser grants: intentional deny-by-default. Safe market read functions expose only fictional shared data. [RLS notice](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
- Public SECURITY DEFINER notices apply to the deliberately public metal/export prices, bounded news/history and published rankings. The revision function instead requires auth.uid() and returns only that caller's slot revision; financial commits are service-only. Search paths are fixed. [Public function notice](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), [authenticated function notice](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).
- The existing Auth leaked-password check is disabled. This expansion did not weaken or change authentication settings. [Password protection guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

Tests use actual SQL migrations with a controlled clock for 24h/48h cleanup and concurrency, not production time manipulation. Live checks verify initial shared state, public reads, denied commits, authenticated API failures and the installed schedules. They do not claim hours of production wall-clock observation.
