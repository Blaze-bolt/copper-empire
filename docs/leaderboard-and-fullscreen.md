# Fullscreen and leaderboard update (v6.0.1)

The header button enters/exits fullscreen after a mouse, keyboard or touch action. Esc and browser fullscreen changes update its label. Unsupported browsers disable the control; request errors are shown without touching saves.

The worldwide leaderboard is rebuilt at :00 and :30 UTC. Only the latest top 100 rows are retained in public.empire_leaderboard; there is no leaderboard history or per-player standings table. All private player accounts/saves remain intact and are the source of truth. Verified Main workshops qualify; Debug and admin-modified workshops do not. Ascension, rebirth, completed recoveries, lifetime copper and UUID determine order. Numeric copper/gold stay exact strings in responses.

Apply supabase/migrations/20261021052010_leaderboard_snapshot.sql after previous migrations. It installs a guarded private refresh, a half-hour cron job, and empire_rankings_snapshot. Older clients can still read empire_rankings. Older financial RPCs no longer rewrite standings per action. A missed cron tick is repaired by the first snapshot read; concurrent refreshes serialize and recheck the due time. Routine scheduler logs for this job expire after two days. Public read functions intentionally use SECURITY DEFINER to expose only existing public ranking fields and update a due snapshot; no caller chooses a user or writes a score. Private helpers/clock deny browser roles. No new environment variables or keys.

The browser caches until the shared next update, deduplicates concurrent requests, backs off one minute on failure and preserves the last good snapshot. Leaderboard polling no longer depends on market requests and uses no Realtime messages. On the leaderboard page no market polling is needed.

Validation: 380 regression tests passed and production build passed. Added isolated Postgres tests with 105 synthetic players verify top-100 retention, ordering, entry from outside the top 100, half-hour staleness, no player-save mutation, and denied direct writes/private reads. No synthetic players are added to production.
