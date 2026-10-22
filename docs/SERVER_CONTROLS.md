# Server access and copper trajectories

These controls extend the existing authenticated owner panel. They do not change player inventories, reset progress, or provision another owner. The migration defaults to **public access open**. Applying it does not activate maintenance.

## Server Lockdown

Open the owner coin, expand **Server Lockdown**, optionally enter a custom message and reopening estimate, then choose **Enable lockdown** and confirm. The estimate is informational; the owner must choose **Reopen to everyone** to reopen. A blank estimate displays no reopening time. **Preview maintenance screen** previews only in the owner's browser.

The owner remains authorized through the existing Supabase owner UUID. Sign-in, password recovery, status checks, and export of one's own cloud save remain available. Ordinary gameplay, cloud mutations, Aura Forge, purchases, rewards, markets, factory actions, shipments and ranking-source changes are blocked. Personal backup export remains available locally. Public file importing has been removed from Settings, Account & Cloud, and the unreadable-save screen; that screen instead exports the preserved raw save data for owner support. Existing automatic recovery copies and explicit cloud/device reconciliation are retained.

### Testers

Create a testing code of 10–128 characters and share it privately. A successful check issues a random 256-bit bearer token lasting two hours, stored separately in session storage. Signed-in grants are bound to that account; guest grants are temporary bearer access and can accompany subsequent sign-in. A token does not grant ownership or access to another account's progress.

Only a salted PBKDF2-SHA256 hash (600,000 rounds) is stored for the configured code. Only SHA-256 token hashes are stored for testing sessions. Codes, salts, hashes and tokens are omitted from public status and admin audit details. The configured code is never returned to the owner. Incorrect submissions are limited to five per network per minute, with a shared ceiling of 300 checks per minute before expensive hashing. The deployment's reverse proxy must supply the trusted `X-Forwarded-For` client address; rotating addresses still encounters the global ceiling. The application never logs request bodies or codes.

Changing/revoking the code can either retain existing sessions or invalidate them, using the checkbox. **Revoke all testing sessions** invalidates existing sessions immediately at the database; visitors see maintenance after their next status check. Leaving the code enabled permits a fresh unlock. Expired/revoked sessions and old rate buckets are pruned when relevant controls/checks run; no per-roll or Realtime records are added.

### Preservation and enforcement

Startup shows a neutral “Opening your workshop…” screen while the first access check is pending. Maintenance appears only after confirmed lockdown (or owner preview); connection errors keep retry, account recovery, and personal exports available without claiming maintenance. The browser checks status every 45 seconds and after returning to the tab. Access expires locally after a 60-second stale-status lease; a network outage therefore pauses play rather than silently opening a closed server. A verified response restores access. Existing legacy tabs must reload to receive the maintenance UI; their database mutations are still rejected by the migration's write triggers.

The current challenge is paused and checkpointed, the existing DOM is hidden rather than destroyed, and dirty/pending unified snapshots retain their request IDs and unsynced status. Blocked uploads are not acknowledged. Reopening restores the workshop and resumes the existing safe sync schedule; no forced snapshot replaces pending local progress.

Every guarded transaction holds a shared access-row lock through settlement. Activating maintenance takes the conflicting exclusive lock. A transaction either commits completely before activation or checks the enabled state and rejects; already committed progress is not rolled back. Defensive triggers protect legacy Main, Debug, unified workshops and backup writes, including older backend deployments. Browser roles cannot call the privileged guard or testing RPCs directly. Market clocks and read-only ranking refreshes can continue without accepting player mutations.

The unified architecture still allows local/offline simulation between cloud snapshots. Removing file imports is not an anti-cheat proof for browser-controlled data. Existing snapshot validation and server settlement remain necessary. Lockdown prevents unauthorized shared writes, and supported current clients also pause local gameplay; it does not erase unsynced work.

## Market Price Trajectory

Expand **Market Price Trajectory** and enter a copper target in dollars per gram, duration of 2–360 ticks, final tolerance (default 2%, accepted 0.1–10%), and Low, Normal or High volatility. Each tick uses the existing global ten-second epoch. **View progress / Refresh** shows start/target, completed and remaining ticks, approximate time remaining, volatility, tolerance and status. Starting another active trajectory requires explicit confirmation. **Cancel trajectory** returns subsequent ticks to the prior normal market configuration.

The path uses a randomized geometric bridge inside backward-computed reachable intervals. Every step respects the configured quiet/normal/turbulent upward and downward caps and global bounds. Opposite-direction ticks can occur where enough reachability remains. Each bridge has a randomized goal within the clipped tolerance band; no final out-of-cap jump is allowed. Infeasible deadlines are rejected. With default limits, $1 to $2 in ten ticks requires High volatility; Normal's 5% cap cannot reach $1.96 in that time. Increasing duration allows gentler trajectories.

Only copper is affected. The existing market clock, cron/catch-up mechanism and one-hour history are reused, retaining at most 361 points. The owner need not keep a browser open. While active, ordinary random drift, market events and equilibrium behavior do not compete with the bridge. Queued manual/config/event changes must first execute or be cancelled. Direct adjustments and settings remain available, with confirmation before replacing an active bridge. The original automatic/frozen configuration resumes afterward.

## Review and release

No new environment variables or privileged frontend keys are required. Keep existing Supabase service credentials exclusively in the Edge Function environment. The public frontend continues to use the existing publishable key and GitHub Pages deployment.

After review/approval, apply `20261022085700_server_lockdown_trajectory.sql` after its predecessor migrations, deploy the bundled `empire-api`, then publish the matching frontend. No maintenance activation is part of deployment. Keep rollout in this order so older backends are protected by database triggers. Rollback the UI/backend only with maintenance disabled or retain these database protections; do not delete player data or roll back committed transactions.

Automated tests run every repository migration in isolated PGlite databases, exercise the actual HTTP handler, permissions, rate limits, revocation/expiry, compare-and-swap, duplicate requests, activation between authorization and commit, unified unfinished-save preservation, trajectory feasibility/caps/tolerance/cancellation/catch-up and bounded history. Browser verification uses a disposable, in-memory two-origin fixture (`node scripts/preview-server-controls.mjs`), synthetic owner/tester identities and no Supabase connection. No owner Main or production account is used. Production migration, real proxy rate-bucket behavior, distributed lock scheduling and deployment are not claimed as live-tested by these local checks.


## Music additions in this review

Settings now append the owner-supplied Sunshine and RickRoll recordings, using the filenames as titles. The owner confirmed permission for public distribution; the provenance record is in `assets/music/LICENSE.txt`. The original downloads are unchanged. Playback modes persist separately from workshop progress: repeat current song (the existing default), random different song (uniformly selected from the other seven), or displayed list order with wraparound. No new Supabase requests are used. Selecting a mode retains the current audio source; automatic end events advance only the active source, so a manually stopped old song cannot skip the newly selected one. Browser autoplay restrictions, gains/mute, and background-tab suspension are preserved.
