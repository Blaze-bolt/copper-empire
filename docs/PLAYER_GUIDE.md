# Copper Empire — Complete Game Guide

An explanation of the current game, checked against its source on 17 October 2026. This describes implemented features, rather than the additional gameplay ideas discussed for future updates.

Play at [Copper Empire](https://blaze-bolt.github.io/copper-empire/).

### Reading map

- [Game overview](#1-what-the-game-is), [getting started](#2-your-first-recovery-and-the-main-gameplay-loop), and [disassembly rules](#3-how-a-disassembly-attempt-works).
- [Rewards and grades](#4-recovery-rewards-grades-and-experience) and [all 52 electronics and minigames](#5-all-52-electronics-and-signature-minigames).
- [Market](#6-the-copper-market), [tools](#7-tools-and-workshop-improvements), [crafting](#8-crafting-and-research), and [auras](#9-auras-and-discovery-luck).
- [Rebirth](#10-rebirth-and-chapter-progression), [prestige](#11-prestige-skill-tree), and [bosses](#12-boss-machines).
- [Smelting](#13-smelting), [automation](#14-automation), and [refining](#15-industrial-refining).
- [Contracts](#16-contracts), [achievements and records](#17-achievements-statistics-and-your-recovery-journal), and [practice](#18-practice-room).
- [Accounts, cloud saves, and rankings](#19-accounts-cloud-saves-and-worldwide-rankings), [settings and music](#20-settings-music-and-save-recovery), [every menu](#21-what-each-menu-is-for), and [the complete progression loop](#22-how-the-systems-fit-together).

## 1. What the game is

Copper Empire is a skill-based recycling tycoon. You start with an empty wallet, an empty copper inventory, a basic toolkit, and access to a free Small DC Motor. You earn your first resources by successfully playing its recovery challenge. From there, you buy larger electronics, master new challenges, improve your workshop, sell or process copper, and work toward rebirth milestones.

The game combines an active arcade collection game with a growing workshop economy. Owning an expensive machine is only the beginning: you must complete its entire disassembly attempt to earn the recovery. Repeated clicks, automation, and purchased upgrades do not provide automatic victories.

There are 52 electronics and 52 associated signature minigames. Four electronics belong to the starting chapter, with four more introduced at each rebirth through Rebirth 12. Rebirth continues afterward, but there are currently no additional authored electronics beyond number 52.

Every device, quantity, circuit, pressure gauge, and processing system is part of a fictional simulator. The game does not teach real electrical disassembly, wiring, or furnace operation. Its money is game currency with no real-money cash-out.

## 2. Your first recovery and the main gameplay loop

1. Claim the free Small DC Motor, or enter its workshop and let the game supply one when needed.
2. Read the device's recovery range, difficulty, stage count, and challenge instructions.
3. Start the challenge and stop the indicator inside the green zone.
4. On success, collect the exact copper amount, XP, grade, and any bonus materials.
5. Keep copper for upgrades or sell some for game money.
6. Buy another electronic, improve your equipment, and pursue contracts and rebirth requirements.

The free motor remains available throughout the game. A failed attempt never forces you to buy that electronic again: the item stays in your inventory until a successful recovery consumes one copy.

The central resource decision is whether to spend your standard copper on workshop improvements, sell it to purchase electronics, or retain it for later production. Better equipment makes challenges more manageable and can increase the return from successful play.

## 3. How a disassembly attempt works

### Selecting a device

The shop lists the electronic's price, chapter and player-level requirements, potential base copper recovery, difficulty, and number of stages. You must meet both the rebirth requirement and the current-run level requirement to buy it. Prestige discounts can reduce the listed purchase price.

Your workshop lets you select an owned device and review the attempt before starting. Device illustrations and animated challenge interfaces provide the game's salvage theme without presenting real repair procedures.

### A chain of compulsory challenges

Every device has a signature minigame, listed in the catalogue below. For a multi-stage recovery, the game also selects earlier signatures as supporting stages and finishes with the selected device's own signature. Ordinary device attempts choose supporting signatures without repeating them within that selection.

Completing a stage unlocks the next briefing. It does not award a partial recovery. Every required stage must succeed before the electronic pays copper or XP. The displayed stage count can be reduced for eligible devices by the Advanced Workbench, but the final signature still remains compulsory.

### Failure and retrying

Failure conditions depend on the challenge: a missed timing stop, a wrong memory input, an exhausted move budget, excessive mistakes, or an expired timer can end a stage. When a stage fails, the whole attempt ends immediately. Its stage index and collected stage scores reset, no copper or XP is paid, and the successful-completion streak is broken outside practice.

The failure screen gives the reason and offers another attempt. Your electronic remains owned. Restarting means beginning the chain again, rather than resuming from the last successful stage.

### Difficulty and controls

The current difficulty labels are Beginner, Easy, Normal, Hard, Expert, Master, and Extreme. The chapter and the difficulty label are separate: early chapters can share the same difficulty label, while their devices still have different stage counts and puzzle types.

Difficulty changes challenge-specific settings such as target width, indicator speed, sequence length, grid size, linked controls, reaction demands, and required successes. Timed challenges also become shorter as their selected difficulty rises. Some puzzles emphasize logic and move budgets instead of rapid input.

Controls include mouse, touch, keyboard, sliders, and onscreen buttons as appropriate to each challenge. Timing games use Space; tracing and positioning challenges provide directional alternatives. Read the stage instructions because controls vary across all 52 signatures.

Escape pauses an active challenge. Leaving the browser tab pauses active minigame simulation. Processing jobs and the world market use elapsed time independently; returning to a tab does not rewind the world's price clock.

From Rebirth 4, the workshop also offers an expert recovery option, raising the selected device's attempt to at least Expert difficulty. It is useful for the expert-completion progression milestone; it does not bypass the required stages.

## 4. Recovery rewards, grades, and experience

### Copper and XP

The catalogue's copper range is the random base recovery before grade and equipment bonuses. The final result screen shows the actual recovered total in exact milligrams, including its grade and tool contributions. The successful recovery consumes one electronic, awards its XP, updates statistics and applicable contract progress, and records the result in the journal.

Rewards are rolled after successful completion. Variation in recovered quantity or bonus materials does not randomly change a completed minigame into a failure.

### Performance grades

The game averages the performance scores of all stages in the completed attempt. Challenge accuracy, mistakes, completion time on timed stages, and memory replay use can affect those scores.

| Grade | Average stage score | Base copper multiplier |
| --- | --- | --- |
| S | At least 97% | 1.20× |
| A | At least 83%, below 97% | 1.10× |
| B | At least 65%, below 83% | 1.05× |
| C | Below 65%, with every stage completed | 1.00× |

These are the actual scoring thresholds; an S grade does not require every internal score to be exactly 100%. Showmanship prestige can add to non-C grade bonuses. Other copper bonuses then apply to the graded amount. XP bonuses affect XP separately.

For example, a 1,000 mg base recovery with an S grade becomes 1,200 mg before tool bonuses. Adding only the Component Sorter's 5% recovery bonus makes the final total 1,260 mg. If that recovery also selects Premium quality, 252 mg becomes Premium and 1,008 mg remains Standard; the total mass is still 1,260 mg.

### Six copper qualities

| Quality | Sale multiplier against the Standard quote |
| --- | --- |
| Standard | 1× |
| Clean | 1.25× |
| High-Purity | 1.5× |
| Premium | 2× |
| Ancient | 3× |
| Mythic | 5× |

At base discovery luck, a successful recovery has separate quality chances of 8% Clean, 2% High-Purity, 0.5% Premium, 0.05% Ancient, and 0.005% Mythic. A selected special quality receives one fifth of the recovery, rounded down to whole milligrams; the remainder stays Standard. This is a split of the total recovered mass, rather than extra copper added on top.

Discovery luck increases these chances, with effective luck capped at 3×. Only one special quality is selected for a recovery. Special copper can be sold for its quality multiplier, while ordinary tools and recipes consume Standard copper.

Successful ordinary recoveries also have a 35% chance of a salvaged part and a separate 1% chance of a copper core. Those two material rolls are independent of the copper-quality roll and are not increased by the discovery-luck multiplier in the current rules.

### Units and levels

Copper quantities use whole milligrams: 1 g = 1,000 mg, 1 kg = 1,000 g, 1 t = 1,000 kg, and 1 kt = 1,000 t. Display units grow with your inventory. Custom trades support these units and reject quantities smaller than 1 mg. Wallet accounting also uses exact internal units, so large late-game quantities do not rely on rounded display balances.

Your level is determined by XP. Level 2 starts at 20 XP, level 3 at 80 XP, level 4 at 180 XP, and level 5 at 320 XP. In general, reaching level N requires 20 × (N − 1)² XP. Current XP and level reset on rebirth.

## 5. All 52 electronics and signature minigames

The tables give undiscounted electronic prices, base recovery ranges, unmodified XP rewards, and ordinary stage counts before the workbench reduction. “Level” means current-run player level. Each listed signature is compulsory for its device; the stage total can also include earlier signatures.

The descriptions below use the actual in-game instructions. They explain objectives and controls without giving complete puzzle solutions.

### Starting chapter — R0 · Beginner devices

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Small DC Motor | 1 | $0 | 500 mg–2 g | 30 | 1 | Beginner |
| 2 | USB Desk Fan | 2 | $0.75 | 3 g–8 g | 55 | 1 | Beginner |
| 3 | Computer Cooling Fan | 4 | $2 | 8 g–18 g | 80 | 2 | Beginner |
| 4 | Old Speaker | 6 | $4 | 15 g–30 g | 105 | 2 | Beginner |

#### #1 — Precision Timing

Press Space or Lock it in inside the green target. A missed stop ends the attempt. The first motor has no timer.

#### #2 — Fan Blade Alignment

Select a blade, rotate it in 60° steps, then place it in the matching numbered silhouette. Match its angle too. Three wrong placements lose.

#### #3 — Rotor Balance

Select an occupied segment, then another segment to move one weight. Opposite weights balance. Bring balance error below 0.15, then check.

#### #4 — Sound Wave Matching

Adjust amplitude, frequency, and phase to overlap the reference wave. Hold at least 90% similarity for two seconds.

### Rebirth 1 · Compact electronics

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 5 | Phone Vibration Motor | 1 | $6 | 25 g–50 g | 120 | 2 | Beginner |
| 6 | Portable Speaker | 3 | $12 | 50 g–90 g | 145 | 2 | Beginner |
| 7 | Laptop Cooling Assembly | 5 | $20 | 90 g–160 g | 170 | 3 | Beginner |
| 8 | Power Adapter | 8 | $35 | 150 g–280 g | 195 | 3 | Beginner |

#### #5 — Vibration Pattern Memory

Watch the short and long pulses, then repeat with short taps (¼ second) and long holds (¾ second). Use the button or Space.

#### #6 — Frequency Slider Puzzle

Match all five discrete band sliders to the reference bars, then submit.

#### #7 — Airflow Maze

Rotate arrows clockwise to guide airflow from IN to OUT. Incomplete tests cost two moves. Obstacles cannot carry airflow.

#### #8 — Circuit Tile Rotation

Rotate circuit tiles to join both exterior terminals. Test when ready. An equipped analyzer can highlight a useful tile.

### Rebirth 2 · Home electronics

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 9 | Desktop Power Supply | 1 | $55 | 250 g–450 g | 210 | 3 | Easy |
| 10 | Electric Toothbrush Motor | 4 | $85 | 400 g–700 g | 235 | 3 | Easy |
| 11 | Printer Motor Assembly | 7 | $140 | 650 g–1.1 kg | 260 | 3 | Easy |
| 12 | Electric Drill Motor | 10 | $220 | 1 kg–1.8 kg | 285 | 3 | Easy |

#### #9 — Symbol Matching

Select moving copies of the target shape. Three selection errors or four missed targets end the challenge.

#### #10 — Rotating Gear Puzzle

Turn gears clockwise; neighbours turn in the opposite direction. Align every marker at the top within the move budget.

#### #11 — Conveyor Component Sorting

Select or drag moving components into matching A, B, or C bins. Four misses or three sorting errors lose.

#### #12 — Precision Path Tracing

Drag from START along the whole glowing path to END. Stay inside the corridor. Arrow keys and onscreen buttons also move your trace.

### Rebirth 3 · Household machinery

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 13 | Vacuum Cleaner Motor | 1 | $350 | 1.7 kg–2.8 kg | 300 | 4 | Easy |
| 14 | Small Water Pump | 4 | $550 | 2.6 kg–4.5 kg | 325 | 4 | Easy |
| 15 | Transformer Unit | 7 | $850 | 4 kg–7 kg | 350 | 4 | Easy |
| 16 | Washing Machine Motor | 11 | $1,400 | 6.5 kg–11 kg | 375 | 4 | Easy |

#### #13 — Suction Direction Puzzle

Rotate arrows to route orange from tile 1 to tile 8, and teal from tile 13 to tile 12. Release both particles when ready.

#### #14 — Flow Network Puzzle

Toggle shared gates A, B, C. A flow goes RIGHT when exactly one of its two gates is open. Match all target destinations and dispatch.

#### #15 — Magnetic Polarity Logic

Select two polarity blocks to swap them. Every horizontal and vertical neighbour must have opposite signs. Submit when every rule holds.

#### #16 — Spin Cycle Rhythm

Tap Space when each orbiting note crosses the top line. Hit at least 75% and miss no more than three notes.

### Rebirth 4 · Heavy domestic equipment

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 17 | Dishwasher Motor | 1 | $2,100 | 10 kg–17 kg | 390 | 4 | Normal |
| 18 | Air Conditioner Motor | 5 | $3,500 | 16 kg–28 kg | 415 | 4 | Normal |
| 19 | Refrigerator Compressor | 9 | $5,500 | 26 kg–43 kg | 440 | 4 | Normal |
| 20 | Heavy Electric Pump | 13 | $8,500 | 42 kg–70 kg | 465 | 4 | Normal |

#### #17 — Pipe Connection Puzzle

Select a pipe, rotate it, then place it. Use every piece exactly once to join IN and OUT. Click a placed piece to lift it.

#### #18 — Temperature Balance

Tune two coupled controls so both meters remain inside their shown target bands for three seconds.

#### #19 — Pressure Stability

Keep the drifting gauge inside 35–65% for ten total seconds. Nudge with −/+ or arrow keys at least three times. Over 2.5 consecutive seconds outside loses.

#### #20 — Valve Sequence Memory

Watch numbered valves glow, then repeat their values in order. Positions may shuffle. One wrong valve loses.

### Rebirth 5 · Industrial foundations

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 21 | Industrial Fan Motor | 1 | $13,000 | 65 kg–110 kg | 480 | 5 | Normal |
| 22 | Heavy-Duty Alternator | 5 | $21,000 | 105 kg–175 kg | 505 | 5 | Normal |
| 23 | Industrial Transformer | 10 | $34,000 | 170 kg–280 kg | 530 | 5 | Normal |
| 24 | Generator Stator | 15 | $55,000 | 275 kg–450 kg | 555 | 5 | Normal |

#### #21 — Moving Target Challenge

Click the moving amber target and avoid grey decoys. The active target changes after every hit. Three errors lose.

#### #22 — Power Output Matching

Plan a six-step curve. Click each column to cycle 0–5 and match its reference mark. Submit with mean error at most 0.25.

#### #23 — Dual Circuit Synchronisation

Solve both circuit boards simultaneously. Tile 1 is linked: rotating it rotates both boards. Other tiles are independent.

#### #24 — Coil Pattern Reconstruction

Memorize the ring. Swap segments and rotate their arrows upward to reconstruct the order and orientation.

### Rebirth 6 · Large machinery

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 25 | Industrial Water Pump | 1 | $85,000 | 430 kg–700 kg | 570 | 5 | Hard |
| 26 | Elevator Motor | 6 | $140,000 | 700 kg–1.15 t | 595 | 5 | Hard |
| 27 | Factory Conveyor Motor | 11 | $225,000 | 1.1 t–1.9 t | 620 | 5 | Hard |
| 28 | Heavy Machinery Motor | 16 | $370,000 | 1.85 t–3 t | 645 | 5 | Hard |

#### #25 — Multi-Channel Flow

Cycle moving-token junctions to A, B, or C before arrival. No more than two tokens may be misrouted.

#### #26 — Elevator Positioning

Press Up/Down to change platform velocity, then Brake and Stop at each target height in order. Stop within ±4.5% and low speed.

#### #27 — Factory Conveyor Coordination

Cycle conveyor speeds paused/slow/fast and set exits A/B/C. Keep shared-junction arrivals at least 0.7 seconds apart.

#### #28 — Load Distribution Puzzle

Place four weighted blocks on the platform. Keep the weighted centre of balance inside the middle. Select a block, then a slot, and submit.

### Rebirth 7 · Factory-scale systems

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 29 | Industrial Power Generator | 1 | $600,000 | 3 t–5 t | 660 | 6 | Hard |
| 30 | Factory Recycling Machine | 7 | $950,000 | 4.8 t–8 t | 685 | 6 | Hard |
| 31 | Large Generator Assembly | 12 | $1,550,000 | 7.8 t–13 t | 710 | 6 | Hard |
| 32 | Industrial Power Station Module | 18 | $2,500,000 | 12.5 t–21 t | 735 | 6 | Hard |

#### #29 — Energy Routing

Choose edges to power every starred node from source 0. Stay within the displayed six-token energy budget.

#### #30 — Recycling Assembly Line

Select a batch and visit stations in its displayed order. Stations have brief cooldowns. Complete six batches with fewer than three errors.

#### #31 — Multi-Rotor Synchronisation

Adjust rotor speeds in quarter steps or pause briefly. Align all markers near the top, then synchronize. Speed zero holds a rotor.

#### #32 — Power Grid Restoration

Restore all nodes from source 0 using seven energy. No node may exceed two connections. Avoid overloaded shortcuts.

### Rebirth 8 · Advanced industrial systems

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 33 | High-Capacity Generator | 1 | $4,000,000 | 20 t–34 t | 750 | 6 | Expert |
| 34 | Automated Factory Motor Array | 7 | $6,500,000 | 32 t–55 t | 775 | 6 | Expert |
| 35 | Heavy Industrial Power Unit | 13 | $10,500,000 | 52 t–90 t | 800 | 6 | Expert |
| 36 | Mega Transformer Assembly | 19 | $17,000,000 | 85 t–145 t | 825 | 7 | Expert |

#### #33 — Precision Frequency Lock

Track the moving target with your marker using the bar or Left/Right. Stay within tolerance for eight continuous seconds. Three seconds of mismatch loses.

#### #34 — Factory Robot Programming

Program the robot with Move, turns, Collect, and Repeat. Repeat executes the previous command twice more. Collect both stars and reach EXIT.

#### #35 — Stability Matrix

Click a matrix cell to toggle it and its four neighbours. Bring every cell to zero within the move budget.

#### #36 — Magnetic Field Maze

Rotate the field arrow beneath your token, then Step. Reach EXIT around forbidden cells. An invalid step loses.

### Rebirth 9 · Massive electrical systems

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 37 | Giant Industrial Alternator | 1 | $27,000,000 | 135 t–230 t | 840 | 7 | Expert |
| 38 | High-Output Generator Complex | 8 | $44,000,000 | 220 t–375 t | 865 | 7 | Expert |
| 39 | Massive Motor Assembly | 14 | $72,000,000 | 360 t–610 t | 890 | 8 | Expert |
| 40 | Automated Copper Recovery Plant | 20 | $115,000,000 | 575 t–980 t | 915 | 8 | Expert |

#### #37 — Alternating Pulse Sequence

Alternate A/Left and D/Right when notes reach the top of their own orbit. Watch both lanes; no more than three misses.

#### #38 — Generator Network Puzzle

Allocate integer tokens from two generators to three demands. Each connection holds at most three; use at most four connections and respect supply.

#### #39 — Rotational Momentum Challenge

Apply clockwise/counterclockwise impulses. Natural drag slows the disc. Lock inside the target angle with speed below 8°/s.

#### #40 — Automated Recovery Scheduling

Select a job and a timeline start cell. Two-resource jobs occupy both rows. Fit every job within eight ticks without overlap, then validate.

### Rebirth 10 · Gigantic recycling technology

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 41 | Ultra-Industrial Motor | 1 | $185,000,000 | 930 t–1.6 kt | 930 | 8 | Master |
| 42 | Advanced Generator Complex | 8 | $300,000,000 | 1.5 kt–2.6 kt | 955 | 8 | Master |
| 43 | Mega Recycling Assembly | 15 | $480,000,000 | 2.4 kt–4.1 kt | 980 | 8 | Master |
| 44 | Titan Generator System | 22 | $780,000,000 | 3.9 kt–6.7 kt | 1005 | 8 | Master |

#### #41 — Ultra-Precision Alignment

Rotate rings in 15° steps to the narrow top targets. Harder versions link a ring to the next ring.

#### #42 — Multi-Generator Synchronization

Adjust phase offsets, not speeds. Test when the three peaks can share a synchronization window for 0.35 seconds.

#### #43 — Resource Optimization

Use conversion recipes to produce C from A and B. Avoid waste: an impossible remainder or exhausted action budget loses.

#### #44 — Titan Core Sequence

Solve linked panels and remember their revealed symbol values. Enter the final SUN–MOON–DIAMOND code.

### Rebirth 11 · Experimental technology

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 45 | Experimental Power Module | 1 | $1,250,000,000 | 6.3 kt–10.7 kt | 1020 | 9 | Master |
| 46 | Hyper-Industrial Generator | 9 | $2,000,000,000 | 10 kt–17 kt | 1045 | 9 | Master |
| 47 | Advanced Electromagnetic Array | 16 | $3,200,000,000 | 16 kt–27 kt | 1070 | 9 | Master |
| 48 | Experimental Copper Core | 23 | $5,200,000,000 | 26 kt–44 kt | 1095 | 9 | Master |

#### #45 — Experimental Pattern Decoder

Decode three expressions. Adjacent symbols add; brackets double their contents. Use the published symbol values. Three wrong answers lose.

#### #46 — Hyper-Speed Reflex Grid

Remember three flashing cells, then select them in order within seven seconds. Four rounds change the active cells. Three errors lose.

#### #47 — Electromagnetic Logic Gates

Toggle Boolean inputs and optionally cross B/C connections. Match all three AND/OR/NOT target outputs, then test.

#### #48 — Experimental Core Stabilization

Tune three nonlinearly coupled controls. Hold all three inside their target bands for three seconds.

### Rebirth 12 · Next-generation technology

| # | Electronic | Level | List price | Base copper | Base XP | Stages | Difficulty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 49 | Next-Generation Power Generator | 1 | $8,300,000,000 | 41.5 kt–70 kt | 1110 | 10 | Extreme |
| 50 | Ultra-Dense Motor Assembly | 9 | $13,500,000,000 | 67.5 kt–114 kt | 1135 | 10 | Extreme |
| 51 | Hyper-Scale Industrial Core | 17 | $21,500,000,000 | 107.5 kt–183 kt | 1160 | 10 | Extreme |
| 52 | Experimental Energy Converter | 25 | $35,000,000,000 | 175 kt–300 kt | 1185 | 10 | Extreme |

#### #49 — Multi-Dimensional Energy Routing

Route two tokens across two layers. The centre is a portal. Select a token, move with direction buttons, and reach its matching goal in sixteen moves.

#### #50 — Ultra-Dense Pattern Compression

Reconstruct the reference using reusable 2×2 blocks. Select a block and its top-left placement cell. Fit the block budget. Restart clears the layout.

#### #51 — Hyper-Scale Command Center

Allocate four shared resources among three live systems. Meet each task requirement and allow cooling. Complete eight tasks before three deadlines or an overheat.

#### #52 — Experimental Energy Converter Challenge

Open both input gates and connect the converter route. Each batch consumes 2 A + 1 B. Produce exactly one Y and one Z, respecting capacity, and trigger conversions in the green timing window.

## 6. The copper market

### Shared prices and trading

The world market has one shared Standard-copper price, bounded between $0.30 and $1.00 per gram. Its backend price clock advances every 10 seconds. Players see a live line chart of the most recent hour, with previous price, hourly high, hourly low, and a countdown to the next update.

The price model combines industrial demand, shared variation, and bounded player influence. Purchases add demand and sales add supply for subsequent ticks. Each player has a limited influence and at most six trades per tick. This is a shared simulated market with a market maker; it is not a player-to-player order book.

You can sell 10%, 25%, 50%, or all of a selected copper quality, or enter an exact custom amount. The selected quality's multiplier applies to its sale value. In a verified online workshop, you can also purchase Standard copper with game money, paying a 1% spread. Buying copper does not count as copper recovered through skill on the leaderboard.

Online trades use the shared quote and update balances together. If the quote changes before acceptance, the trade is rejected for review rather than silently using a different price. Local workshop balances remain separate from verified world trading.

### Market history and connectivity

Shared history is restricted to one hour and at most 361 chart points. The clock periodically deletes expired price records; chart queries also exclude records outside the requested hour. The current quote remains permanently stored. This retention rule does not delete player accounts, game progress, or necessary transaction receipts.

The client polls efficiently, aligned with the returned shared clock, and requests incremental history for the open market page. Hidden tabs stop polling. If the online service cannot be reached, an old displayed quote should not be treated as a confirmed current online trade price. The original local market implementation remains a separate fallback with a 30-second cadence; it does not set the worldwide price.

### Market upgrades

| Upgrade | Game-money cost | Shared-market effect |
| --- | --- | --- |
| Market Watchlist | $100 | Five-minute moving average inside the shared one-hour chart. |
| Price Alert System | $500 | Set a custom price-alert threshold. |
| Market Analyst | $2,500 | Trend and volatility descriptions. |
| Trading Terminal | $10,000 | Exact sale controls and one pending limit sale. |
| Market Research Desk | $50,000 | Summary statistics over the available history. |
| Market Influence Permit | $250,000 | Paid bounded demand signal; $25,000 per use, 60-second cooldown. |

In the shared market, the Watchlist adds a five-minute moving average within the existing one-hour chart. It does not buy longer server history. The Trading Terminal supports one pending custom limit sale. An online limit sale is evaluated on an authenticated background update, including when you return to the game; it is not a permanently running offline exchange order.

The Influence Permit's paid action costs $25,000 and has a 60-second cooldown. Online it submits a bounded demand signal for the next shared tick. It does not refresh a private price or guarantee an increase. Market indicators describe what has happened and do not guarantee profitable trades.

## 7. Tools and workshop improvements

Tools are bought with Standard copper, rather than game money. Their effects apply once per owned tool. Different tool bonuses can combine. The table shows undiscounted prices; Workshop Buying Power prestige reduces eligible tool costs. Ordinary tool ownership resets on rebirth, while prestige bonuses can help rebuild the next run.

Timing-width increases scale the eligible target width; they are not automatic successes. Extra time applies to timed challenges. Hints and memory replays have limited attempt-wide budgets. A memory replay can lower a performance score, so it offers assistance rather than a free perfect grade.

| Tool | Standard-copper cost | Effect |
| --- | --- | --- |
| Basic Toolkit | 0 mg | Starting tools |
| Improved Screwdriver | 30 g | +5% timing target width |
| Precision Toolkit | 75 g | +10% timing target width |
| Component Sorter | 150 g | +5% copper reward |
| Advanced Workbench | 300 g | +10% copper; one fewer optional stage on devices #9+ |
| Circuit Analyzer | 500 g | One useful circuit hint per attempt |
| Memory Assistant | 750 g | One memory replay per attempt |
| Reinforced Workbench | 1 kg | +15% earned XP |
| Digital Workshop | 1.5 kg | +10% timed-puzzle duration |
| Precision Robotics | 2.5 kg | +15% copper reward |
| Automated Component Sorter | 4 kg | Automatically organizes your component inventory |
| Industrial Workshop | 6 kg | +20% copper reward |
| Advanced Scanner | 10 kg | Publishes effective rare-discovery probabilities |
| Recycling Automation | 15 kg | Automatically stocks a starter motor when needed |
| Master Recycling Station | 25 kg | +30% copper reward |

The Advanced Workbench removes one supporting stage from devices #9 and above. It never removes the device's own signature, and it does not reduce boss or rebirth-trial chains. Automated sorting organizes your component list; it does not solve sorting minigames. Recycling Automation, the tool, stocks a free starter motor and is distinct from the larger automation facility.

## 8. Crafting and research

Advanced crafting unlocks at Rebirth 4. A recipe consumes its listed Standard copper and input components to create one output component. All ingredients must be available together; an unsuccessful craft does not take a partial set of ingredients.

Crafted components are useful as ingredients, facility requirements, or research inputs. Merely owning the crafted item does not activate its advertised research bonus. You must purchase that research by consuming the required number of components.

| Output component | Standard copper per craft | Other ingredients per craft | Research purchase |
| --- | --- | --- | --- |
| Copper Wire Bundle | 50 g | 1 Salvaged Part | 3 of this component: +2% timing width |
| Copper Coil | 150 g | 1 Copper Wire Bundle | 2 of this component: +3% copper reward |
| Reinforced Copper Plate | 300 g | 1 Copper Wire Bundle | 2 of this component: +5% XP |
| Copper Circuit Module | 750 g | 1 Copper Coil + 1 Reinforced Copper Plate | 1 of this component: two extra puzzle moves |
| High-Grade Copper Core | 1.5 kg | 1 Copper Circuit Module | 1 of this component: +5% copper reward |
| Precision Copper Component | 3 kg | 1 High-Grade Copper Core | 1 of this component: +5% timed-puzzle duration |
| Master Copper Assembly | 8 kg | 1 Precision Copper Component + 2 Reinforced Copper Plate | 1 of this component: +0.10× discovery luck |

Each ordinary research project can be activated once in the current run. Its bonus joins the workshop's existing bonuses. Crafted inventory and this ordinary research reset on rebirth, so a component can have competing uses: spend it on research now, retain it for a recipe, or reserve it for a permanent facility purchase.

## 9. Auras and discovery luck

Aura RNG unlocks at Rebirth 2. Each roll costs $100 of game money and awards an aura, including possible duplicates. Collected auras are kept in your collection, but only one is equipped at a time. The equipped aura multiplies discovery luck; it does not complete challenges, provide guaranteed rare copper, or directly add ordinary recovery mass.

| Aura | Base chance at 1× luck | Equipped luck multiplier |
| --- | --- | --- |
| Rusty Aura | Remaining chance (74.775% at base luck) | 1.05× |
| Copper Glow | 1 in 5 | 1.10× |
| Bronze Radiance | 1 in 25 | 1.20× |
| Electric Copper | 1 in 100 | 1.40× |
| Plasma Core | 1 in 500 | 1.70× |
| Storm Conductor | 1 in 5,000 | 2.00× |
| Ancient Copper Spirit | 1 in 25,000 | 2.50× |
| Celestial Copper | 1 in 100,000 | 3.00× |

The displayed non-Rusty odds are base probabilities at 1× discovery luck. The actual chance for each non-Rusty aura scales with your effective luck; Rusty Aura occupies the remaining probability. Research and prestige can add discovery luck before the equipped aura multiplier is applied. The final effective value is capped at 3×. Aura ownership and your equipped aura survive rebirth.

## 10. Rebirth and chapter progression

Rebirth is a deliberate fresh run with lasting rewards. To qualify, reach the required current-run level, earn the required money during that run, and complete its extra gameplay condition. Money earned is an accumulated run statistic; the requirement is not a fee deducted from your wallet.

You must then complete the rebirth skill trial. A failed trial pays nothing and does not consume an electronic, copper, or money. A successful trial opens a separate confirmation screen. The reset occurs only when you confirm.

| Next rebirth | Required level | Money earned this run | Extra condition |
| --- | --- | --- | --- |
| 1 | 6 | $35 | 3 successful disassemblies |
| 2 | 8 | $250 | 2 A-grade completions |
| 3 | 10 | $1,800 | Complete a 3-stage challenge |
| 4 | 12 | $12,000 | Complete 5 different electronics |
| 5 | 15 | $75,000 | Complete an expert challenge |
| 6 | 16 | $500,000 | Complete 3 advanced contracts |
| 7 | 18 | $3,500,000 | Complete a boss machine |
| 8 | 20 | $22,000,000 | Complete 8 different electronics |
| 9 | 22 | $140,000,000 | Complete 5 difficult contracts |
| 10 | 24 | $900,000,000 | Complete an industrial boss |
| 11 | 26 | $6,000,000,000 | Earn 3 S grades |
| 12 | 28 | $40,000,000,000 | Complete a master recycling challenge |

For Rebirth 2, S grades count toward the requirement for two A-or-better completions. The “industrial boss” condition for Rebirth 10 specifically accepts Mega Generator or Copper Colossus. The “master recycling challenge” condition for Rebirth 12 and later specifically requires a Copper Colossus completion in the current run.

Trials draw from currently unlocked signatures. Their stage counts progress through 3, 3, 4, 4, 5, 5, 6, 7, 7, 8, 9, and 10 for the first twelve rebirths. These trial chains can repeat a selected signature. Trial difficulty also rises with progression.

### What resets

Your game money, all raw-copper qualities, current XP and level, ordinary tools, owned electronics, crafted component stock, ordinary research, active/run contracts, current run statistics, processing batches, unsold standard/refined ingots, and pending limit sale reset. Automation stock and wire-production switches turn off.

### What remains

Your rebirth level and unlocked chapters, unspent Prestige Points, prestige ranks, aura collection and equipped aura, achievements, lifetime statistics, encountered signatures for practice, discovered qualities, purchased permanent automation/refining facilities, furnace upgrades, refining-research ranks, and purchased market upgrades remain. The game keeps its journal and saved recovery history, although the journal is bounded to its recent entries.

Each confirmed rebirth awards a number of Prestige Points equal to the new rebirth number: R1 gives 1 PP, R2 gives 2 PP, and so on. The first twelve give 78 PP in total before spending.

Beyond R12, all 52 devices remain authored content and prestige continues. R13 requires level 30 and $80 billion earned that run; later rebirths increase the level requirement by two and double the earnings target each chapter. The trial remains ten stages, with the current-run Copper Colossus condition. There is no additional catalogue of unimplemented machines hidden after device #52.

## 11. Prestige skill tree

Prestige skills spend PP and persist through rebirth. The price increases with rank: the next purchase costs the skill's base PP price multiplied by the new rank. For example, a base-2-PP skill costs 2 PP for rank 1, 4 PP for rank 2, and 6 PP for rank 3.

| Branch | Skill | Unlock | Base PP cost | Max ranks | Effect per rank |
| --- | --- | --- | --- | --- | --- |
| Extraction | Efficient Extraction | R1 | 1 | 20 | +5% copper per rank |
| Extraction | Hidden Potential | R3 | 2 | 10 | +0.05× discovery luck per rank |
| Extraction | Showmanship | R3 | 2 | 10 | +1% graded reward per rank |
| Precision | Steady Hands | R1 | 1 | 15 | +2% timing width per rank |
| Precision | Room to Think | R1 | 1 | 15 | +3% timed-puzzle duration per rank |
| Precision | Pattern Insight | R3 | 3 | 3 | One extra hint and replay per rank |
| Economy | Salvage Connections | R1 | 1 | 10 | 2% electronics discount per rank |
| Economy | Good Reputation | R3 | 2 | 10 | +10% contract money per rank |
| Economy | Workshop Buying Power | R3 | 2 | 10 | 2% tool cost discount per rank |
| Luck | Fortunate Finds | R1 | 2 | 10 | +0.05× effective luck per rank |
| Smelting | Quick Processing | R5 | 2 | 10 | 5% faster processing per rank |
| Smelting | Bigger Batches | R5 | 2 | 10 | +1 kg batch capacity per rank |
| Smelting | Refined Value | R5 | 2 | 10 | +5% ingot sale value per rank |
| Smelting | Parallel Processing | R5 | 5 | 3 | One extra processing slot per rank |

Extraction improves successful recoveries, Precision makes skill challenges more manageable, Economy reduces rebuilding costs or improves contract payments, Luck improves discovery probabilities, and Smelting develops permanent processing advantages. None of the branches skips compulsory disassembly gameplay.

## 12. Boss machines

Bosses are special multi-stage skill challenges with fixed game-money rewards and XP. They appear with the contract content when their rebirth and level requirements are met. Each boss reward can be claimed once per rebirth chapter, allowing another eligible attempt in a later run.

| Boss | Rebirth | Level | Stages | Difficulty | Money reward | XP |
| --- | --- | --- | --- | --- | --- | --- |
| Scrap Crusher | 3 | 6 | 4 | Normal | $1,500 | 400 |
| Copper Leviathan | 5 | 10 | 5 | Expert | $20,000 | 500 |
| Industrial Titan | 7 | 12 | 6 | Extreme | $1,500,000 | 600 |
| Mega Generator | 9 | 15 | 8 | Extreme | $250,000,000 | 800 |
| Copper Colossus | 10 | 18 | 9 | Extreme | $2,000,000,000 | 900 |

Boss chains choose from unlocked signatures and require every stage. They pay the listed fixed money and 100 XP per stage, rather than an ordinary device's copper recovery. Their completions also satisfy applicable contracts and rebirth conditions. A failed boss attempt restarts the chain and pays nothing.

## 13. Smelting

The Copper Smelting Facility unlocks at Rebirth 5. It converts already-earned Standard copper into virtual ingots: 1 kg produces one standard ingot. Initially, a processing slot accepts up to 2 kg, takes 30 seconds for a batch, and starts with one slot.

Batch sizes must be whole kilograms and fit the available capacity. Copper is deducted when a batch starts. When its timer finishes, collect the output once; processing jobs retain their finish times across a reload. The starting sale value is 1.80× the equivalent raw Standard-copper value at the current quote.

### Optional batch timing challenge

An active batch offers one optional timing challenge. Success removes 20% of that batch's remaining processing time. Failure does not destroy the batch: it keeps processing without the bonus. This is an optional speed bonus to an already-funded material conversion; it does not replace mandatory device challenges or generate fresh copper.

### Furnace upgrades

| Upgrade | First-rank money | First-rank Standard copper | Max ranks | Effect |
| --- | --- | --- | --- | --- |
| Processing speed | $2,000 | 1 kg | 5 | 8% shorter base processing time per rank |
| Batch capacity | $3,500 | 1.5 kg | 6 | +1 kg maximum batch per rank |
| Processing slots | $10,000 | 3 kg | 3 | +1 processing slot per rank |
| Automatic collection | $15,000 | 5 kg | 1 | Collect finished batches automatically |
| Ingot quality | $25,000 | 8 kg | 5 | +0.10× raw-equivalent ingot sale value per rank |
| Advanced refining | $60,000 | 10 kg | 3 | +0.12× raw-equivalent ingot sale value per rank |
| Sale bonuses | $35,000 | 5 kg | 5 | +0.05× raw-equivalent ingot sale value per rank |

Both money and Standard copper are required for each upgrade. The table shows first-rank costs; later ranks multiply both costs by the rank being purchased. Furnace upgrades persist through rebirth.

Processing-speed furnace ranks shorten the base duration by 8% each. Quick Processing prestige adds its own speed reduction, with a minimum processing time of eight seconds. Capacity and parallel slots also combine with the corresponding prestige skills. Ingot value improvements add to the raw-equivalent sale multiplier.

## 14. Automation

The permanent Automated Recycling Workshop unlocks at Rebirth 8 and costs $500,000 plus one Precision Copper Component. Once purchased, it remains owned through rebirth.

Its starter-stock switch keeps one free Small DC Motor available when your stock is empty. Its wire-production switch can make a Copper Wire Bundle every 30 seconds when you have the required 50 g of Standard copper and one salvaged part. It consumes those resources using the existing crafting rule.

Automation helps with inventory and production. It does not complete mandatory minigames, grant automatic grades, or manufacture unearned raw copper. Current background updates are processed while the workshop is running or synchronized; wire production does not promise an unlimited backfilled queue of offline crafts. The two automation switches reset to off on rebirth, although facility ownership remains.

## 15. Industrial refining

Industrial Refining unlocks at Rebirth 10. Building the permanent facility costs $10,000,000 plus one Master Copper Assembly. It consumes ten standard ingots to create one refined ingot representing 10 kg of input copper.

The base refined sale value is 2.20× the equivalent raw Standard-copper value. Refining is a different product calculation from the standard-ingot sale multiplier; bonuses to ordinary ingots should not be assumed to multiply the refined product too.

At Rebirth 11, refining research becomes available. It has five ranks. Each rank consumes two copper cores and costs $1,000,000 multiplied by the rank being purchased. Every rank adds 0.10× raw-equivalent sale value, reaching 2.70× at rank 5. Facility ownership and refining-research ranks survive rebirth, while unsold products reset.

## 16. Contracts

Contracts give specific workshop objectives alongside your main progression. You can hold up to three different unclaimed contracts at once and cannot take duplicate active copies of the same offer. Eligible offers expand with rebirth.

| Contract | Available from | Rank | Objective |
| --- | --- | --- | --- |
| Workshop warm-up | R0 | basic | Complete one electronic |
| Copper collector | R0 | basic | Recover 250 g copper |
| Market momentum | R1 | basic | Earn $1,000 from sales |
| Steady hands | R0 | basic | Complete 3 devices without a failure |
| A perfect recovery | R0 | basic | Earn an S grade |
| Component specialist | R4 | advanced | Craft 3 components |
| Hidden treasure | R2 | basic | Discover special-quality copper |
| Big machine energy | R3 | basic | Complete a boss machine |
| Refined ambition | R5 | advanced | Smelt 5 ingots |
| Advanced recovery order | R4 | advanced | Complete 3 electronics |
| Difficult industrial order | R8 | difficult | Complete 5 electronics |
| Specialized high-tier shipment | R12 | difficult | Recover 1 kt copper |

Complete the tracked objective and then claim its money and XP reward. Ordinary cumulative objectives measure progress from acceptance, while the streak objective checks the current run's successful-completion streak. The money-earned objective uses the game's recorded earnings metric, which can include qualifying non-sale payouts.

Contract reward money scales with the first electronic price in your current chapter, the contract rank, and Good Reputation prestige. Basic, advanced, and difficult contracts use different multipliers. Contract XP is 20 + 30 × your current rebirth. Advanced and difficult claims count toward the appropriate rebirth milestones.

Contracts do not give a skip for the underlying recovery requirements. If an objective requires successful electronics, those successes still come from completed attempts.

## 17. Achievements, statistics, and your recovery journal

### Achievements

- **First Copper:** Recover copper for the first time.
- **Scrap Collector:** Collect 1 kg lifetime copper.
- **Copper Hunter:** Collect 100 kg.
- **First Fortune:** Earn $10,000.
- **Perfect Precision:** Earn an S grade.
- **Reborn:** Complete your first rebirth.
- **Aura Collector:** Obtain your first aura.
- **Rare Discovery:** Find special-quality copper.
- **Furnace Master:** Smelt an ingot.
- **Copper Empire:** Reach 10 rebirths.
- **Minigame Explorer:** Play every currently unlocked signature.
- **Challenge Master:** Complete a difficult multi-stage challenge.

Achievements record milestones rather than providing an automatic paid reward when clicked. Minigame Explorer checks encountered signatures among currently unlocked devices. Challenge Master requires both a five-or-more-stage completion and an expert-or-harder completion in the run; these are the actual tracked conditions.

### Statistics

The statistics screen summarizes progression and workshop activity, including playtime, recoveries, failures, success rate, lifetime copper, copper sold, money earned and spent, electronic purchases, best grade, aura rolls, rarest collected aura, smelted ingots, claimed contracts, bosses, crafts, encountered minigames, and Prestige Points earned and spent. These distinguish current-run progress from lifetime accomplishments. Rare-discovery counts are also tracked for contracts and achievements.

### Recovery Journal

The journal records recent successful recoveries with the device, date, grade, copper, and XP. It also includes rebirth milestones and identifies migrated legacy recoveries. Ordinary reward logging retains the latest 100 entries; it is a recent journal rather than an unlimited permanent archive of every attempt. Failed attempts are represented in failure statistics, rather than paying a successful journal reward.

## 18. Practice Room

Starting an actual signature challenge adds it to the encountered list. Encountered signatures can then be selected in the Practice Room at any of the seven difficulty settings.

Practice consumes no electronic and awards no copper, money, materials, production progress, or XP. It is useful for learning an unfamiliar control scheme or rehearsing a demanding signature before risking the progress of a long chain. Your encountered list remains available after rebirth.

## 19. Accounts, cloud saves, and worldwide rankings

### Account identity

Account & Cloud supports email/password registration, confirmation email, sign-in, sign-out, and password recovery. Usernames are unique after lowercase normalization. They must be 3–20 characters, begin with a letter, and use lowercase letters, numbers, or underscores; certain reserved administrative names are unavailable.

Usernames are public on the world leaderboard. Emails, passwords, and private saves are not leaderboard content. Passwords are handled by the account service rather than written into a game-save export.

### Two kinds of saved progress

Your original Local Workshop remains in that browser. It can be exported and imported, and a signed-in account can hold a private backup of it. Restoring that backup requires a review, keeps a recovery copy, and replaces only the local workshop.

The verified online workshop is a separate save. Meaningful online actions are checked and saved by the backend, allowing you to continue with the same account on another device. Imported local copper, XP, and edited backup values do not become verified online balances or scores. This separation preserves old progress while keeping shared trading and rankings based on checked play.

An online completion is checked before its reward is accepted. Retrying the same uncertain save does not pay it twice. If another device has changed the workshop, stale updates are rejected so that an older tab cannot overwrite newer progress. Use Refresh cloud workshop to load the current state. An interrupted device attempt can be restarted with its electronic retained, rather than granting an automatic reward.

### Leaderboard

World Leaderboard displays the top 100 verified recyclers. Ordering prioritizes rebirth, then completed recoveries, then lifetime recovered copper; player level is shown as additional information. It displays usernames, rebirths, levels, recoveries, and recovered copper.

Buying copper is not a recovery. Imported local backups do not enter the rankings. The page refreshes periodically while open and also offers a manual refresh. The current game has public rankings and a shared economy, but no co-op disassembly session or direct player-to-player trading interface.

## 20. Settings, music, and save recovery

Settings lets you change workshop sound effects and decorative animations, export the local save, or import a reviewed backup. Decorative motion respects reduced-motion settings; moving targets necessary for gameplay still represent the active challenge.

Music has its own ON/OFF switch and volume slider. These preferences are saved in the browser. Playback waits for the required tap, click, or key press, loops continuously through menu changes, and suspends when the tab is hidden. Muting workshop effects and muting music are separate controls.

The background track is “Dreams Become Real” by Kevin MacLeod, from [incompetech.com](https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1500027), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The game uses an excerpt and a crossfade for its loop. Full credits and adaptation details are also in [the bundled music license](../assets/music/LICENSE.txt) and in Settings.

Local progress saves after meaningful actions and keeps a previous-save backup. The migration system preserves an original supported version-1 save and carries forward recognized resources, devices, upgrades, XP, and journal entries. Different origins, browsers, and profiles have separate browser storage, so use an export/import or private cloud backup to move a local workshop intentionally.

The original prototype is also retained at `classic.html` with its own separate save. Its smaller original device/minigame system is not the 52-device main workshop described by this guide.

## 21. What each menu is for

| Menu | Purpose |
| --- | --- |
| Dashboard | Current copper, wallet, level, rebirth, a featured device, market preview, and next milestones. |
| Electronics Shop | Browse the 52 electronics; inspect locks, prices, recovery ranges, and stage counts; buy eligible devices. |
| Disassembly Workshop | Select owned electronics, review compulsory stages, and start ordinary or eligible expert recoveries. |
| Practice Room | Rehearse encountered signatures at a chosen difficulty without consuming devices or earning rewards. |
| Copper Inventory | Review copper by quality and inspect your resource holdings. |
| Copper Market | Follow the shared price and one-hour chart, sell copper, buy Standard copper online, and purchase market tools. |
| Tools | Spend Standard copper on ordinary workshop improvements. |
| Crafting | Use Standard copper and components to craft items and activate ordinary research. |
| Aura RNG | Roll for, collect, and equip discovery-luck auras. |
| Rebirth | Review the next run requirements, complete its trial, and confirm a reset. |
| Prestige Skill Tree | Spend permanent Prestige Points on the persistent skill tree. |
| Smelting | Start funded virtual processing batches, collect ingots, and improve the furnace. |
| Automation | Purchase the permanent workshop and control starter stocking and wire production. |
| Industrial Refining | Build the permanent refining facility, convert ingots, and buy eligible refining research. |
| Contracts | Accept and claim workshop objectives; review and attempt eligible boss machines. |
| Achievements | View earned and outstanding lifetime milestones. |
| Statistics | Review lifetime and current progression metrics. |
| Recovery Journal | Read the recent recovery and rebirth record. |
| Account & Cloud | Register or sign in, enter the verified workshop, manage private local backups, and recover account access. |
| World Leaderboard | View the top 100 verified recyclers and refresh world rankings. |
| Settings | Control effects, motion, music, and local save export/import. |

## 22. How the systems fit together

A successful recovery produces raw material, XP, and possible components. XP and money open larger electronics. Copper spent on tools improves your next attempts; copper sold funds purchases. Components feed research and permanent facility construction. Contracts reward particular play patterns and help meet rebirth conditions.

Rebirth deliberately removes the current run's ordinary stock while preserving your permanent advantages. Prestige, auras, facilities, market improvements, and knowledge of the minigames make the next climb different. Later runs add processing and planning decisions without removing the original requirement to demonstrate skill for new recovered copper.

There are currently no scrapyard expeditions, route-based exploration, co-op recovery jobs, build-your-own-machine mode, or workshop emergencies of the kinds proposed in our feature discussion. Those remain possible additions, rather than features this guide promises are already playable.

## Source and scope

This guide was checked against the current catalogue, game instructions, workshop state/economy rules, page definitions, and online service implementation. Exact tables are generated from those definitions. It is a player guide, not a claim that new features were added or that a new full end-to-end test run was performed while writing it.

See [backend setup](ONLINE_SETUP.md) for deployment details and [the validation record](VALIDATION.md) for the implementation's recorded tests.
