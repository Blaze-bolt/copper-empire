# Copper Empire — Recycling Tycoon

A browser game with 87 electronics, 87 compulsory signature minigames, an exact copper/gold economy, 18 Rebirth chapters, and five Ascension levels.

Read the [Ascension and Gold expansion guide](docs/ASCENSION_GOLD.md) for all new costs, bonuses, milestone/reset rules, device values and controls.

Read the [complete player guide](docs/PLAYER_GUIDE.md) for every electronic and signature challenge, exact costs and recovery ranges, progression, workshop systems, accounts, and saves.

## Play

Open the published GitHub Pages website. Claim a free Small DC Motor, complete its skill challenge, sell the recovered copper, and grow your workshop. Every required challenge must succeed before a disassembly pays. Failures retain the electronic and reset the attempt, with no copper or XP awarded.

The game supports keyboard, mouse, and touch. Instructions appear before each challenge. Escape pauses; leaving the tab pauses active minigames. Practice has selectable difficulty and grants no rewards.

Progress saves in the browser. Use Settings to export/import a backup. Localhost, GitHub Pages, different browsers, and different profiles have separate storage; import a backup once to move existing progress onto the published website. Local play needs no account. Online accounts add cloud saves, verified rankings, and shared trades. There is no real money or cash-out.

## Systems

- 87 illustrated electronics and signature challenges, with compulsory stages and skill-based rewards.
- Exact integer milligrams and nanodollars; six copper qualities and a fictional bounded copper market.
- 15 tools, crafting, research, aura collection, prestige, contracts, six bosses, and achievements.
- Virtual smelting at Rebirth 5, automation at Rebirth 8, refining at Rebirth 10, and refining research at Rebirth 11.
- Rebirth trials and explicit reset confirmation. Four new electronics unlock per tier through R12; Ascension 1 opens the Gold Operation and eligibility for R13–R18.

All devices, circuits, and furnace activities are stylized game abstractions, without practical electrical disassembly instructions. Local workshops retain browser saves. Verified online workshops use server-checked actions and rewards; imported saves remain local.

## Develop locally

Install Node.js 22 or newer, then run:

```sh
npm ci
npm run build
node server.mjs
```

Open http://127.0.0.1:3000/.

```sh
node --test tests/*.test.mjs
node scripts/build.mjs
node scripts/balance.mjs
```

The static build is written to `dist/`. The locked dependencies bundle the official Supabase client and run the PostgreSQL tests. Optional Google Fonts fall back to system fonts when unavailable.

## Publish with GitHub Pages

In repository Settings → Pages, choose **GitHub Actions** as the source. Push to `main`, or manually run **Publish Copper Empire** in Actions. The workflow tests the game, builds only static game assets, and deploys `dist/`. Relative asset URLs support both project URLs and custom domains.

The repository contains only Copper Empire's game source, tests, build tools, and hosting configuration. Browser saves, local output, private attachments, and Windows desktop launcher configuration are not included.

## Validation

Automated checks cover all 87 signatures and seven panning claims, seeded solvability at beginner/expert/extreme settings, failure resets, duplicate rewards, exact transactions, migration, tools, progression, bosses, refining, and browser rendering templates. Economic simulations at 70% and 95% independent per-stage success reach the R12 Ascension entry. They demonstrate reachability, not human playtime; long stage chains require practice.

The original game remains available at `classic.html` with a separate save. Original shared circuit logic, illustrations, and layout are retained in `src/engine.js`, `src/art.js`, and `styles.css`.

## Online upgrade

Optional accounts add unique usernames, private cloud backups, a verified online workshop, worldwide rankings, and a shared copper market that ticks every 10 seconds. Only the latest hour of chart prices is retained. All 52 original games and the original local workshop remain available. The expansion adds 35 exact signatures, permanent Stage Compression, A1–A5, CE skills, gold equipment and Golden Engineering. Existing local progress is preserved separately from verified online balances.

Run `npm ci` before testing or building. Node 22+ is recommended. The production build bundles the official Supabase client and copies the licensed music; the development server serves its generated SDK from `dist/vendor`. Run `npm run build` once before `npm start`.

See [online setup and security](docs/ONLINE_SETUP.md) for migrations, Edge Function deployment, public environment variables, SMTP setup, transaction/reward validation, polling, and data retention. Public signup email delivery requires a configured SMTP sender; the default Supabase sender is restricted. Do not commit credentials.

Background music: “Dreams Become Real” by Kevin MacLeod, licensed CC BY 4.0. Attribution, source links, permissions, and loop adaptation are recorded in [the music license](assets/music/LICENSE.txt) and shown in game Settings. Music waits for user interaction, preserves volume/on-off, and continues across menus.
# Owner controls

The existing owner's floating copper coin opens two persistent cloud workshops, exact save editors, and independent worldwide copper/gold market administration. See [Owner Admin V2](docs/OWNER_ADMIN.md) for access, backups, competitive safeguards, settings, deployment and UUID provisioning.


## Audio, pulse controls and expanded smelting (5.2)

Read the [complete update guide](AUDIO_SMELTING_UPDATE.md) for the five supplied background tracks, four live audio channels, SHORT/LONG pulse controls, geometric capacity ranks 0–12, finite paid batch queues, Furnace Mastery, exact upgrade costs, save compatibility and verification.

## Industrial Era checkpoint 1 (5.2.1)

The first incremental master-spec checkpoint replaces all 59 R7–R18 device layouts, adds enlarged model inspection and exact Gt/Q display support, and preserves all 87 existing device contracts and minigames. [Actual color/monochrome models and before/after comparisons](docs/model-proof/index.html), [completion and remaining-work record](docs/industrial-era/checkpoint.md), and [backend measurements](docs/industrial-era/backend-usage.md) are included.

The requested factory price rebalance is an [unapproved proposal](docs/industrial-era/rebalance-proposal.md) with [exact five-price results](docs/industrial-era/rebalance.csv). No recipe or export-price changes have been applied. The new A2 era, factories, workers, countries and shipping are not yet implemented by this checkpoint. Automated validation: 260 passing tests.
