# Copper Empire 5.2 — Audio, Pulse Controls and Smelting

This upgrades the existing game and its existing authenticated cloud service. All 87 electronics and signatures remain; only #5's input method changes. No framework, account, market or deployment migration is required.

## Audio diagnosis and fixes

The existing soundtrack measured -25.8 dB mean and -9.9 dB peak before the old 18% music gain (about another -14.9 dB). Effects used a separate oscillator graph with a peak gain of only 0.035. Most actions shared one generic chirp, and returning to a tab resumed audio only when music was enabled.

A single lifetime AudioContext now supplies music, effects, interface, master and a final compressor/limiter. New preferences default to 70% master, 45% music, 80% effects and 65% interface. Mute All, Music On, Effects On and Test Sound operate the real graph. Channel sliders update immediately. Suspended audio resumes on interaction or returning to the tab, including when music is off. Requests are serialized to prevent duplicate soundtrack sources. Effects have short envelopes, cooldowns and an eight-voice limit.

Music buffers are calibrated to RMS 0.052 with peak headroom of 0.32 before channel gain. The music channel applies 2.5× calibration gain; master and music preferences each apply once. At defaults the calibrated mean is approximately -27.8 dBFS, compared with approximately -40.7 dBFS previously. A four-second tail/head crossfade joins each selected track's loop. Navigation does not recreate the source. Changing a track fades the old voice, saves the choice, and loads only the requested track. Each selected track loops; this is a selectable library, not automatic playlist rotation.

The five owner-supplied tracks display their original base filenames: Ocean Dih, MugaMillion, Jazzy Juice, Thats what I like, Grief. Original downloads remain unchanged; MP3 distribution copies are included. The owner confirmed distribution rights. `assets/music/LICENSE.txt` records that confirmation separately from the existing Kevin MacLeod CC BY 4.0 attribution, which is preserved. No additional license terms were supplied for the five recordings.

Audio covers navigation/dialogs; purchases and rejection; challenge start, interaction, incorrect input, stage completion and rewards; all 87 signature games through mechanic families; memory demonstrations; copper/gold trades, alerts and large market moves; crafting/research; smelting start, ambience, readiness, collection and upgrades; prestige/level/claim unlocks, rebirth and Ascension; aura roll/rarity/equip; contracts and boss results; gold equipment and panning; owner-panel actions and save switching. Ordinary ten-second market ticks remain silent. Sound never determines challenge correctness. Existing reduced-motion and pause behavior remains.

Audio preferences live in `copper-empire-audio-v2` on the device, separate from Main/Debug balances. Legacy Music On/Off, custom volume and effects mute migrate. The old default 18% music setting becomes the new 45% default. Explicit custom levels stay unchanged. No settings migration changes progression.

## SHORT / LONG

Phone Vibration Motor (#5) still demonstrates the same generated pattern and keeps its difficulty, mistake rules, practice and grading. SHORT • or S submits the short symbol; LONG — or L submits the long symbol immediately. Click/touch uses native button activation. Holding S/L, Enter or Space does not repeat inputs. Demonstration input is ignored. The lamp displays SHORT/LONG labels so muted play remains understandable. Success feedback names the submitted symbol.

The engine and backend replay validate explicit numeric symbols 0/1. Hold-duration detection, pointer timers, Space release detection, solver assumptions and server hold-time accumulation were removed. Watching time is still verified by the server. A challenge already open in an older browser version should be restarted after refreshing; its unspent item remains safe.

## Smelting mechanics

All amounts use exact BigInt milligrams. Base capacity is `floor(2,000,000 × 3^rank / 2^rank) mg`, with flooring only after the full rational calculation. Bigger Batches then adds exactly 1,000,000 mg per prestige rank once. Whole-kg batching uses the floor of that final capacity.

| Capacity rank | Exact base mg | Whole kg | Money for this rank | Standard copper for this rank |
|---:|---:|---:|---:|---:|
| 0 | 2,000,000 | 2 | — | — |
| 1 | 3,000,000 | 3 | $3,500 | 1.5 kg |
| 2 | 4,500,000 | 4 | $10,000 | 4 kg |
| 3 | 6,750,000 | 6 | $30,000 | 10 kg |
| 4 | 10,125,000 | 10 | $90,000 | 25 kg |
| 5 | 15,187,500 | 15 | $270,000 | 60 kg |
| 6 | 22,781,250 | 22 | $810,000 | 150 kg |
| 7 | 34,171,875 | 34 | $2,430,000 | 375 kg |
| 8 | 51,257,812 | 51 | $7,290,000 | 900 kg |
| 9 | 76,886,718 | 76 | $21,870,000 | 2.25 t |
| 10 | 115,330,078 | 115 | $65,610,000 | 5.5 t |
| 11 | 172,995,117 | 172 | $196,830,000 | 14 t |
| 12 | 259,492,675 | 259 | $590,490,000 | 35 t |

Existing eligible furnace discounts reduce both displayed and charged money/copper costs once. No ordinary copper-recovery rewards were reduced.

All other furnace purchases cost the following base × `3^(nextRank−1)`, before existing discounts:

| Upgrade | Cap | Unlock | Base money / copper | Effect per rank |
|---|---:|---:|---|---|
| Processing speed | 12 | R5 | $2,000 / 1 kg | Duration ×0.92 |
| Processing slots | 8 | R5 | $10,000 / 3 kg | +1 independent slot |
| Automatic collection | 1 | R5 | $15,000 / 5 kg | Collect ready jobs once on update |
| Ingot quality | 12 | R5 | $25,000 / 8 kg | +10 sale percentage points |
| Advanced refining | 8 | R5 | $60,000 / 10 kg | +12 ordinary ingot sale percentage points |
| Sale bonuses | 12 | R5 | $35,000 / 5 kg | +5 sale percentage points |
| Thermal Efficiency | 8 | R5 | $12,000 / 4 kg | Duration ×0.96, same paid recipe |
| Batch Automation | 5 | R7 | $50,000 / 12 kg | +1 finite queue entry |
| Furnace Mastery | 5 | R9 | $100,000 / 25 kg | +4 percentage points to optional remaining-time reduction |

Upgrade-derived duration is `max(5, 30 × 0.92^speed × (1−0.05×QuickProcessing) × 0.96^thermal / permanentSmeltingThroughput)` seconds. Permanent throughput applies once. Slots are `1 + slotRank + ParallelProcessing`. Sale is `180 + 10×quality + 12×refining + 5×sale + 5×RefinedValue` percent. These bonuses are additive. The separate Industrial Refined product keeps its existing formula.

Batch Automation queues one requested ingot recipe at a chosen whole-kg maximum per entry. It starts once in a free slot with the smaller of requested maximum, capacity and affordable whole kg. Copper is deducted then, never at queue time. If less than 1 kg is available it waits. Cancellation returns no free copper. A reload can collect an old completed job and start a fresh queued job at the current time; it cannot synthesize historical batches or endlessly repeat a recipe.

The optional timing challenge removes `20% + 4%×masteryRank` of remaining time, maximum 40%. The challenge consumes its single opportunity when started. Failure leaves the paid job processing with unchanged input/output. A verified success applies the bonus once and cannot move the end before now. The optional skill reward is separate from the five-second upgrade-duration floor.

The UI exposes exact capacity, whole-kg maximum, available copper, duration, independent job bars, input/output previews, sale multiplier, ingots, ranks/caps/costs, queue and collection status. Quick choices are 1 kg, floor(25% capacity), floor(50% capacity), and maximum affordable. For very small capacities the percentage shortcuts choose at least 1 kg. Invalid start requests show a reason and disable the start button. Ambience runs only on the Smelting page with active jobs; simultaneous readiness/automatic collection notifications are aggregated.

## Economy checks

Using a $0.60/g shared quote and 1% purchase spread, before prestige/permanent bonuses, the following illustrative builds were checked. Capacity/speed/quality/sale/refining share the listed rank; slots rank is half that rank. These are test builds, not automatic progression grants.

| Chapter | Rank | Whole kg / job | Duration | Total slots | Sale multiplier | Margin / kg after buying raw copper |
|---|---:|---:|---:|---:|---:|---:|
| R5 | 2 | 4 | 25.39s | 2 | 2.34× | $798 |
| R8 | 4 | 10 | 21.49s | 3 | 2.88× | $1,122 |
| R10 | 6 | 22 | 18.19s | 4 | 3.42× | $1,446 |
| R12 | 8 | 51 | 15.40s | 5 | 3.96× | $1,770 |

Processing margins are deliberately positive and higher throughput is substantial. Purchases, input, finite slots, real waiting time, upgrade costs and a maximum five queued starts keep it bounded. There is no automatic copper purchasing or unlimited offline processing loop. Buying and processing raw copper does not forge disassembly completions, earned copper, XP or gold milestones. No recovery nerf or market-price change was made.

## Saves, backend and deployment

Version 4 saves remain version 4. An additive empty `furnace.queue` field is added if absent. Existing capacity ranks 0–6 are retained numerically and receive the new formula. Existing jobs, amounts, outputs, timestamps, ingots and prestige remain intact. Job output is fixed when starting; later upgrades never recalculate it. Ordinary Rebirth clears current processing jobs, queued jobs and ingot inventory but preserves furnace upgrades, matching the existing facility rules. Ascension clears ordinary facilities and queue as already documented in its confirmation. Gold, accounts, achievements, permanent expansion systems and other progress retain their existing rules.

The authenticated Edge Function uses the same state, game and smelting engine as automated tests. It validates costs, unlocks, capacities, exact amounts, slots, timing replay and once-only rewards. New commands are `furnace-queue` and `furnace-cancel`; they pass through the existing revision/idempotency transaction and Main/Debug isolation. No table, Auth, Realtime, public API key or environment-variable changes are needed. No private keys are included. `node scripts/prepare-edge.mjs` bundles the existing authenticated entrypoint for deployment; the function continues to call fresh `auth.getUser` before handling any request.

## Changed files and verification

- `src/online/music.js`, `music-library.js`, `audio-cues.js`: unified audio graph, track library, preferences and gameplay cues.
- `assets/music/*.mp3`, `assets/music/LICENSE.txt`: five supplied distribution tracks and rights record; existing track retained.
- `src/empire/app.js`, `views.js`, `game-ui.js`, `games.js`, `empire.css`: actual controls, audio events, SHORT/LONG, queue actions and responsive UI.
- `src/empire/smelting.js`, `smelting-ui.js`, `data.js`, `state.js`, `progression.js`: costs, limits, exact calculations, paid queues, bonuses and additive defaults.
- `supabase/functions/service.js`: new authoritative commands and pulse/bonus replay changes.
- `tests/audio-smelting.test.mjs`, `online-service.test.mjs`, `solve-games.mjs`, `admin-sql.test.mjs`: new and updated functional checks.
- `scripts/prepare-edge.mjs`, package version files, this document: deployment preparation and release record.

Automated coverage includes all 87 minigame solvers, all 52 original games' server replay at beginner/expert/extreme, new pulse correctness/grading, exact capacities/costs/caps, old-save preservation, slots, finite funding/queue behavior, one-time collection and mastery, R5/R8/R10/R12 economics, audio gains/mute/cooldowns/polyphony/load retries, all soundtrack titles, normalization/headroom, loop crossfades and track switching. Existing SQL tests retain account authorization, optimistic concurrency, idempotency, leaderboard classification, market security and Main/Debug isolation.

Browser testing and release results are recorded below after publication. Numeric level analysis and browser playback checks verify the audio path; speaker/headphone volume remains controlled by the player's device. Physical touchscreen hardware is not available in the browser test environment; the standard native-button touch path is shared with mouse activation.

### Release verification — 18 October 2026

254 automated checks pass, including a PostgreSQL-backed cloud queue/funding/idempotency test. Production static and authenticated backend bundles build successfully. Desktop browser checks covered all five supplied recordings becoming ready, exact selected titles, a live 45% music setting, persistence across reload, navigation, mute controls, and an S-grade muted pulse-memory completion using a held key and mouse clicks. The pulse lamp and demonstration sounds share the same half-second offset. The 390px mobile settings layout was checked. Independent 11 kg and 1 kg processing jobs were started through the real quick buttons. Physical touchscreen testing remains unavailable. The owner Main cloud save hash matched its pre-update value before backend deployment.

Live authenticated production checks also passed in the owner’s isolated Debug Workshop: eight upgrade purchases used their displayed costs, capacity reached exactly 4,500,000 mg with a 4 kg whole-batch limit, speed/thermal processing became 26.496 seconds, a 4 kg job and a finite queued 4 kg job consumed exactly 8 kg and automatically collected exactly eight ingots. A completed optional timing replay was validated by the deployed backend. A regression test now ensures batches that finish during a challenge report zero additional seconds saved instead of claiming a percentage reduction. Main balances, progress and verification classification remained unchanged; the QA Debug save was returned to its initial empty state after testing.
