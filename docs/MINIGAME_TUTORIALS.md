# Minigame instructions and first-time tutorials (6.4.0)

This focused update adds the supplied authored English instructions for 119 electronics, seven gold claims and 30 factory challenges. It retains every existing engine, generated puzzle, difficulty setting, reward and financial validation. The original document is retained in `MINIGAME_INSTRUCTIONS_SOURCE.txt`; `guide-copy.js` contains its 156 structured entries. `minigame-guides.js` applies the corrections below and adds ten explicitly described composite sections.

## Player experience

Briefings and live help present Objective, How to play, How to win, How you can fail and Tip, followed by native keyboard/pointer controls. Composite help changes with the actual current section. Factory certification 2030 shows the instructions for its actual 2004, 2017 and 2027 subgames. Factory finale 2025 uses the actual 119 network, allocation and synchronization instructions. Section guides also cover Titan's final-code input, panels B/C of 82, phases 2/3 of 86, sections 2/3/4 of 87, and sections 2/3 of 119. These are available in the replay library as well.

Before a new challenge launches, its unseen tutorial opens over a dimmed, inert workshop. A separate fake board uses a fixed illustrative seed; it never receives the real attempt, its seed, inventory or payment callbacks. The walkthrough highlights the objective, each distinct operation, the limits and the final Start/Practice choice. Highlighting uses the actual example DOM element, with a moving cursor/finger cue; a separate coach column avoids covering the target. Resize follows the normal layout and offscreen targets scroll into view.

Only the example can receive tutorial input. Focus stays inside the dialog. Native buttons and sliders support Tab, Enter/Space and arrows, with the actual arcade shortcuts routed exclusively to the fake engine. Pointer tracing, drag/drop, touch selection/placement, touch dragging and rhythm press/release operate on that copy. Reduced-motion settings stop decorative tutorial cues. Essential minigame motion remains available to teach timing.

Finishing or explicitly choosing Skip records completion. Escape closes without marking completion; an interrupted walkthrough can be offered on the next encounter. Practice first stays in the fake board and awards nothing. Replay never changes completion history. Existing active attempts restore in their existing paused state without a forced first-time interruption. A newly entered composite section gets its own guide before further real input or time is recorded.

Manual factory onboarding runs before the reservation confirmation is executed, so its demonstration cannot fund a batch. Gold onboarding runs before starting/counting the real panning attempt. Existing funded jobs and attempts are otherwise unchanged.

Settings → Tutorials has a default-on Show First-Time Tutorials switch, Replay Any Minigame Tutorial, and Replay Current Minigame Tutorial. The library searches names and IDs and filters Electronics, Factory, Gold or Composite sections. Practice Room cards and stage briefings include Watch Tutorial; live help can replay the current section. All replays are free and ungraded, including tutorials for progression-locked games.

## Additive persistence and deployment

The existing version-4 workshop gains `tutorials: {schema: 1, completed: {"ID": version}}` and `settings.firstTimeTutorials: true`. Each guide currently has tutorial version 1. This version is independent of the release version and is not reset during ordinary updates, Rebirth or Ascension. No existing balances, inventory, attempts, queues, workers, vessels, settings or progression are cleared.

Completion saves immediately locally. The normal Unified Workshop's existing 15-minute changed-snapshot schedule syncs it; there is no new database table, timer, realtime subscription, per-step write or public endpoint. The server unions completion versions with the existing accepted history before committing any incoming snapshot. An explicit choice of an older coherent workshop does not erase newer tutorial completions. Client cloud continuation and local/tab recovery also preserve this union, without merging any financial/gameplay domains. An accepted server response cannot erase completion made while an upload was in flight.

Owner Debug remains separate. Its tutorial metadata is cached locally by signed-in owner and sent with existing Debug commands; the backend validates and unions it into that same slot. This adds no dedicated write call. Before the next existing command, a new Debug completion is local only. Main and Debug tutorial histories are never copied into each other.

Deploy the updated `empire-api` function, including `tutorial-state.js`, before the static frontend. No SQL migration, secret, new environment variable or permission grant is required. Older clients can keep saving: the backend unions their accepted history rather than rejecting an absent tutorial field. The public website and production backend are deliberately unchanged until this PR is released.

## Verified copy corrections

The authored Objective text is retained for all 156 IDs. The following corrections make How to play / rule text match existing controls and engines; none changes a game rule:

| ID | Correction and reason |
| --- | --- |
| 1 | Distinguishes the no-countdown Beginner motor from harder practice settings, which have a timer and can require multiple stops. |
| 24 | Explicitly describes selecting two segments, per-segment rotation and whole-ring rotation, matching the actual separate controls. |
| 37 | Includes the existing 75% final rhythm-accuracy requirement, in addition to the four-miss failure. |
| 65 | Danger is accumulated above the broad safety limit, with gradual recovery when safe; it is not simply ten seconds outside the target band. |
| 66 | Actual buttons are `move`, `left`, `right`, `collect`, `repeat`; `repeat` repeats the previous command once more. |
| 77 | Includes the existing 80% accuracy requirement; the five-error limit includes mistimed inputs, not only entirely missed notes. |
| 78 | The portal is a distinct fifth arrow state, not an ordinary upward direction. |
| 81 | Actual buttons include `loop` and Conditional Skip. `loop` replays the preceding three commands twice; no Repeat Previous button is available in this game. |
| 90 | Illegal shared robot moves are rejected; they do not immediately fail. Only valid moves count toward the eighteen-turn allowance. |
| 93 | Both source supplies must be used exactly, rather than merely not exceeded. |
| 103 | The two horizontal-looking references are actually rotating discs, alongside the vertical marker. |
| 119 | Explicitly states the sixteen-unit allocation, both discs plus the vertical marker, and that the fourth bad validation fails (three are tolerated). |
| 2016 | Replaces the sample “Turn” label with the actual “Rotate selected piece +90°” control. |
| 2025 | Uses the actual 119 subgame controls and four-error failure rule. |
| 2030 | The existing engine uses the fixed 2004 → 2017 → 2027 sequence; it is not a random draw. Each subgame retains its own failure rules. |

Additional failure clauses were checked against the engines rather than inferred from the sample wording. In particular, an incorrect ID 6 profile only asks the player to adjust again, ID 14's wrong dispatch fails immediately, ID 44 tolerates two combined panel/code mistakes, ID 47 fails on its third bad validation, and ID 50's wrong final reconstruction fails immediately. Other limits, wrong-input allowances and overall countdown expiry are explicitly described without altering the runtime.

## Verification and reproduction

- `node --test tests/tutorials.test.mjs tests/unified-save.test.mjs` verifies registry/target coverage, isolated seeded boards, escaping, per-ID versioned completion, migration/reset persistence, union semantics, backend snapshot commits and the existing save scheduler. All 203 focused tests passed during implementation.
- `npm test`: **815 passed, 0 failed, 0 skipped** in the final combined run, including all 637 pre-existing cases and the new coverage and cloud-history tests. An earlier run exposed an incorrectly prepared Ascension test fixture; that fixture was corrected and the complete suite passed.
- `npm run build`: production static build passed. GitHub PR checks repeat tests and build in a clean environment.
- Open `tests/fixtures/tutorials.html` on a disposable local origin. Run all tutorial coverage checks 847 actual rendered targets across 166 guides, including separate robot commands, queue operations, SHORT/LONG and the final-code field. Run interaction families exercises eleven input families without changing real resources or completion flags.
- `tests/fixtures/tutorials-responsive.html` embeds the same UI at an actual 390-pixel viewport. Stacked layout, document/shell bounds, retained focus and interaction checks passed. This is browser viewport testing, not certification on physical touchscreen hardware.
- `tests/fixtures/tutorial-workshop.html` loads the real workshop with a disposable guest save and all backend calls disabled. Browser checks verified first-play → unstarted real briefing, explicit Skip → one real launch with persisted completion, then refresh → the same paused active attempt with no repeated tutorial. The existing owner Main save was not used.

Representative screenshots and measured coverage are captured during review. No temporary login accounts or production save changes are needed for these fixtures. The current deployment is not modified by these tests.
