# Copper Empire — Recycling Tycoon

A browser game with 52 electronics, 52 compulsory signature minigames, an exact copper economy, and twelve unlock chapters followed by repeatable prestige.

## Play

Open the published GitHub Pages website. Claim a free Small DC Motor, complete its skill challenge, sell the recovered copper, and grow your workshop. Every required challenge must succeed before a disassembly pays. Failures retain the electronic and reset the attempt, with no copper or XP awarded.

The game supports keyboard, mouse, and touch. Instructions appear before each challenge. Escape pauses; leaving the tab pauses active minigames. Practice has selectable difficulty and grants no rewards.

Progress saves in the browser. Use Settings to export/import a backup. Localhost, GitHub Pages, different browsers, and different profiles have separate storage; import a backup once to move existing progress onto the published website. No accounts, real money, or backend are required.

## Systems

- 52 illustrated electronics and signature challenges, with compulsory stages and skill-based rewards.
- Exact integer milligrams and nanodollars; six copper qualities and a fictional bounded copper market.
- 15 tools, crafting, research, aura collection, prestige, contracts, five bosses, and achievements.
- Virtual smelting at Rebirth 5, automation at Rebirth 8, refining at Rebirth 10, and refining research at Rebirth 11.
- Rebirth trials and explicit reset confirmation. Four new electronics unlock per tier through R12; prestige remains repeatable afterward.

All devices, circuits, and furnace activities are stylized game abstractions, without practical electrical disassembly instructions. This is a client-side single-player game; save ownership is local and there is no server-side anti-cheat.

## Develop locally

Install Node.js 18 or newer, then run:

```sh
node server.mjs
```

Open http://127.0.0.1:3000/.

```sh
node --test tests/*.test.mjs
node scripts/build.mjs
node scripts/balance.mjs
```

The static build is written to `dist/`. No package installation is needed. Optional Google Fonts fall back to system fonts when unavailable.

## Publish with GitHub Pages

In repository Settings → Pages, choose **GitHub Actions** as the source. Push to `main`, or manually run **Publish Copper Empire** in Actions. The workflow tests the game, builds only static game assets, and deploys `dist/`. Relative asset URLs support both project URLs and custom domains.

The repository contains only Copper Empire's game source, tests, build tools, and hosting configuration. Browser saves, local output, private attachments, and Windows desktop launcher configuration are not included.

## Validation

Automated checks cover all 52 signatures, seeded solvability at beginner/expert/extreme settings, failure resets, duplicate rewards, exact transactions, migration, tools, progression, bosses, refining, and browser rendering templates. Economic simulations at 70% and 95% independent per-stage success reach R13. They demonstrate reachability, not human playtime; long stage chains require practice.

The original game remains available at `classic.html` with a separate save. Original shared circuit logic, illustrations, and layout are retained in `src/engine.js`, `src/art.js`, and `styles.css`.
