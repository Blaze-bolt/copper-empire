# COPPER EMPIRE — EXACT ELECTRONICS, MINIGAMES, AND STAGE COMPRESSION SPECIFICATION

Implement the following changes in the existing Copper Empire game. This specification overrides conflicting parts of the previous Ascension expansion request.

**Do not simply generate 35 electronic names or 35 minigame placeholders. Implement the precise mechanics described here. Every device must actually be purchasable, selectable and playable.**

## A. CURRENT GAME BASELINE

Existing highest electronic:

- ID: 52
- Name: Experimental Energy Converter
- Unlock: Rebirth 12, Level 25
- Price: $35,000,000,000
- Base copper recovery: 175–300 kilotonnes
- XP: 1,185
- Base stages: 10
- Difficulty: Extreme

Do not change those established values without a clearly documented economy-balancing reason.

All new devices must scale beyond this electronic. Their prices, copper recovery and XP should increase coherently.

Copper mass conversions:

- 1 g = 1,000 mg
- 1 kg = 1,000 g
- 1 t = 1,000 kg
- 1 kt = 1,000 t
- 1 Mt = 1,000 kt

All displayed copper recovery ranges in this document are **base recovery**, before grade and upgrade bonuses.

## B. PERMANENT STAGE COMPRESSION UPGRADE

Introduce a special permanent upgrade named **Stage Compression**.

Each rank subtracts one mandatory supporting minigame stage from ordinary electronic recovery attempts.

Always preserve the chosen electronic's unique signature minigame as its final stage.

### Stage Compression costs

Use exact 100× cost increases between ranks.

| Rank purchased | Standard copper required | Total stages removed by this upgrade |
|---|---:|---:|
| 1 | 100 g | 1 |
| 2 | 10 kg | 2 |
| 3 | 1 t | 3 |
| 4 | 100 t | 4 |
| 5 | 10 kt | 5 |
| 6 | 1 Mt | 6 |
| 7 | 100 Mt | 7 |

The table shows the cost to buy that individual rank, not the cumulative purchase total.

Deduct Standard copper atomically.

Ranks must be purchased in order.

Maximum rank: 7.

The upgrade is permanent across ordinary Rebirths and Ascensions.

### Stage minimums

An electronic from the player's **current rebirth chapter** must retain at least three stages if its authored base count is at least three.

An electronic from an earlier chapter can be shortened to one stage.

A device whose original authored stage count is one or two keeps that smaller original count. Do not artificially add stages to existing beginner devices.

No ordinary electronic can ever have zero stages.

For post-Ascension chapters R13–R18, all newly added devices start with at least six authored stages and must retain a minimum of three when played in their current chapter.

After the player advances to a later chapter, these older electronics become eligible for the one-stage minimum.

**Exact calculation:**

1. Obtain the device's authored base stage count.
2. Subtract the purchased Stage Compression ranks.
3. Subtract the existing Advanced Workbench reduction, if eligible.
4. Determine the stage floor:
   - Current rebirth chapter: `min(3, baseStages)`.
   - Earlier chapter: `1`.
5. Set final stage count to the maximum of the calculated result and the floor, never exceeding the original authored count.
6. Guarantee the selected electronic's signature challenge is the final stage.

If an upgrade cannot reduce the current device's stage count any further, explain this in the UI.

### Critical examples

- R12 player with Stage Compression 7 attempting device #52: minimum 3 stages.
- R13 player attempting device #52: can reduce to 1 stage.
- R18 player attempting device #87: minimum 3 stages.
- R18 player attempting a device from R13: can reduce to 1 stage.
- R0 starter motor: always 1 stage.

Do not apply this ordinary upgrade to boss trials, Rebirth Trials or Ascension Trials. These have independent authored stage requirements.

### Upgrade UI

Display:

- Current Stage Compression rank.
- Next-rank cost.
- Current and next-stage reduction.
- Current-chapter minimum.
- Previous-chapter minimum.
- Permanent ownership status.
- Example of the effect on the selected electronic.

Prevent purchases beyond rank 7 and duplicate purchases.

## C. NEW DEVICE CATALOGUE

Add electronics #53–87, grouped as follows.

Every device entry must include the exact fields in the tables.

Use the price and reward ranges as balancing targets. Do not silently replace them with arbitrary generated values.

### Rebirth 13 — Advanced industrial recovery

| ID | Electronic | Level | Cost | Copper recovery | XP | Base stages |
|---|---|---:|---:|---|---:|---:|
| 53 | Quantum Drive Motor | 1 | $50B | 250–420 kt | 1,200 | 6 |
| 54 | Industrial Fusion Controller | 7 | $65B | 330–550 kt | 1,225 | 6 |
| 55 | Ultra-Precision Turbine | 13 | $85B | 430–720 kt | 1,250 | 7 |
| 56 | Mega Power Distribution Array | 19 | $110B | 550–920 kt | 1,275 | 7 |
| 57 | Titan Electromagnetic Rotor | 25 | $145B | 725–1,200 kt | 1,300 | 8 |
| 58 | Advanced Recovery Supercomputer | 30 | $190B | 950–1,600 kt | 1,325 | 8 |

### Rebirth 14 — Gigantic infrastructure

| ID | Electronic | Level | Cost | Copper recovery | XP | Base stages |
|---|---|---:|---:|---|---:|---:|
| 59 | Hypergrid Power Converter | 1 | $250B | 1.25–2.1 Mt | 1,350 | 7 |
| 60 | Planetary-Scale Generator Module | 8 | $320B | 1.6–2.7 Mt | 1,375 | 7 |
| 61 | Industrial Magnetic Accelerator | 15 | $420B | 2.1–3.5 Mt | 1,400 | 8 |
| 62 | Mega Transformer Network | 22 | $550B | 2.75–4.6 Mt | 1,425 | 8 |
| 63 | Hyper-Density Motor Cluster | 28 | $720B | 3.6–6 Mt | 1,450 | 9 |
| 64 | Colossal Electrical Core | 34 | $940B | 4.7–7.8 Mt | 1,475 | 9 |

### Rebirth 15 — Experimental industry

| ID | Electronic | Level | Cost | Copper recovery | XP | Base stages |
|---|---|---:|---:|---|---:|---:|
| 65 | Experimental Energy Matrix | 1 | $1.2T | 6–10 Mt | 1,500 | 7 |
| 66 | Ultra-Industrial Logic Engine | 8 | $1.5T | 7.5–12.5 Mt | 1,525 | 7 |
| 67 | Hyperconductive Power Core | 16 | $1.9T | 9.5–16 Mt | 1,550 | 8 |
| 68 | Autonomous Recycling Megaplant | 24 | $2.4T | 12–20 Mt | 1,575 | 8 |
| 69 | Electromagnetic Titan Engine | 31 | $3T | 15–25 Mt | 1,600 | 9 |
| 70 | Quantum Recycling Array | 38 | $3.8T | 19–32 Mt | 1,625 | 9 |

### Rebirth 16 — Colossal recovery

| ID | Electronic | Level | Cost | Copper recovery | XP | Base stages |
|---|---|---:|---:|---|---:|---:|
| 71 | Colossal Generator Matrix | 1 | $4.8T | 24–40 Mt | 1,650 | 7 |
| 72 | Hyper-Scale Turbine Engine | 9 | $6T | 30–50 Mt | 1,675 | 7 |
| 73 | Advanced Electromagnetic Grid | 17 | $7.5T | 37.5–63 Mt | 1,700 | 8 |
| 74 | Titan Industrial Reactor Module | 25 | $9.4T | 47–78 Mt | 1,725 | 8 |
| 75 | Quantum Motor Megastructure | 33 | $12T | 60–100 Mt | 1,750 | 9 |
| 76 | Imperial Recycling Core | 40 | $15T | 75–125 Mt | 1,775 | 9 |

### Rebirth 17 — Next-generation mega industry

| ID | Electronic | Level | Cost | Copper recovery | XP | Base stages |
|---|---|---:|---:|---|---:|---:|
| 77 | Ultra-Dense Generator Array | 1 | $19T | 95–160 Mt | 1,800 | 7 |
| 78 | Hyperconductive Industrial Nexus | 10 | $24T | 120–200 Mt | 1,825 | 8 |
| 79 | Experimental Titan Stator | 19 | $30T | 150–250 Mt | 1,850 | 8 |
| 80 | Quantum Energy Distribution Hub | 28 | $38T | 190–320 Mt | 1,875 | 9 |
| 81 | Advanced Recycling Command Core | 36 | $48T | 240–400 Mt | 1,900 | 9 |
| 82 | Hyper-Industrial Megasystem | 44 | $60T | 300–500 Mt | 1,925 | 10 |

### Rebirth 18 — Ultimate copper industry

| ID | Electronic | Level | Cost | Copper recovery | XP | Base stages |
|---|---|---:|---:|---|---:|---:|
| 83 | Titan Quantum Power Engine | 1 | $75T | 375–630 Mt | 1,950 | 7 |
| 84 | Colossal Electromagnetic Nexus | 11 | $95T | 475–800 Mt | 1,975 | 8 |
| 85 | Experimental Recycling Singularity | 22 | $120T | 600–1,000 Mt | 2,000 | 8 |
| 86 | Ultimate Industrial Power Matrix | 33 | $150T | 750–1,250 Mt | 2,025 | 9 |
| 87 | Copper Empire Ascendant Core | 45 | $190T | 950–1,600 Mt | 2,050 | 10 |

B = billion dollars; T = trillion dollars.

These are deliberately fictional late-game electronics.

The goal is to scale past #52 without requiring every late-game electronic to contain 16 compulsory stages.

### Economy verification

Check affordability using expected recovery values multiplied by the shared market quote, and include grade and Ascension bonuses.

A successful completion must generally justify the device's purchase cost while preserving meaningful risk from market prices and gameplay failure.

Difficulty should come from mastering mechanics and advancing progression, not from purchasing devices that are mathematically unprofitable at normal market prices.

Do not increase market prices merely to conceal broken electronic costs.

## D. EXACT SIGNATURE MINIGAMES

Every new electronic must have one unique signature challenge. The following rules define their core mechanics.

Support mouse, touch, keyboard and onscreen controls where relevant. Use the existing shared pause, score, retry and animation systems.

### 53 — Quantum Phase Alignment

Display four circular indicators with independently rotating markers. Each marker has an individual phase offset controlled by left/right buttons.

Objective: align all four markers within ±12 degrees of the top reference line simultaneously and hold for 2 seconds.

Rules:
- Players may adjust one ring at a time.
- Adjusting a ring changes its phase offset by 15 degrees.
- Rings continue rotating at distinct predefined rates.
- Three unsuccessful Lock attempts cause failure.
- Success awards a stage performance score based on alignment error and elapsed time.

### 54 — Fusion Sequence Logic

Display five abstract energy symbols and a target order.

The player has eight available operations: rotate the symbol queue left/right, reverse the first three symbols, or swap adjacent symbols.

Objective: match the target sequence within eight moves.

Rules:
- Generate a target by applying a known sequence of at most six valid operations to the starting sequence.
- Every generated challenge must be solvable.
- Each action counts as one move.
- Exceeding the budget causes failure.
- Fewer moves result in a better performance score.

### 55 — Ultra-Precision Turbine

Display three spinning turbine dials with different angular velocities.

Players control acceleration and braking.

Objective: bring each dial within ±10 degrees of its target and below a defined low-speed threshold, then lock all three.

Rules:
- Each dial has independent momentum.
- Only one dial can be controlled at once.
- Locking a dial freezes it.
- Locking outside tolerance counts as a mistake.
- Three mistakes cause failure.

### 56 — Mega Power Distribution Array

Display a network with one source, six destination nodes and adjustable connections.

The source produces 12 abstract energy units.

Objective: satisfy required destination demands of 2, 3, 1, 2 and 4 units across five required destinations.

Rules:
- Players assign integer capacity to eligible connections.
- Each connection supports at most five units.
- Total assigned supply cannot exceed 12.
- Every mandatory destination must receive its exact demand.
- Submit validates the entire network.
- Three invalid submissions cause failure.

### 57 — Titan Electromagnetic Rotor

Display a 4×4 board of directional arrows.

Each click rotates the selected arrow clockwise and also rotates one linked neighboring arrow.

Objective: reproduce the target direction arrangement.

Rules:
- Generate the puzzle from a solved board by performing six to ten legal moves.
- Provide a move budget with enough allowance to reverse the scramble.
- The board must always be solvable.
- Finishing within fewer moves improves grade.

### 58 — Advanced Recovery Supercomputer

Display a 4×4 symbol matrix.

Show four highlighted positions in order. After each flash, rotate the entire matrix 90 degrees.

Objective: select the original highlighted symbols in the correct order after accounting for all transformations.

Rules:
- Use four rounds.
- One incorrect selection consumes an error allowance.
- Two errors cause failure.
- Successful accuracy and response speed determine score.

### 59 — Hypergrid Power Converter

Display four fictional converters sharing a total resource pool.

Every converter has a minimum and maximum allocation, plus a displayed target output.

Objective: allocate 20 units so all converter outputs match their targets.

Rules:
- Allocations use integer sliders.
- Some converters gain different amounts of output per input unit.
- Generate a guaranteed feasible target allocation first.
- Three invalid submissions cause failure.

### 60 — Planetary-Scale Generator Module

Display six pulsing rings with different rhythmic periods.

Objective: press each ring's button when its pulse reaches the highlighted checkpoint.

Rules:
- Complete three rounds.
- Each round requires six accurate hits.
- Timing tolerance starts at ±180 ms and scales with difficulty.
- Four missed hits fail the stage.
- Accuracy determines the final grade.

### 61 — Industrial Magnetic Accelerator

Display a grid of branching paths and a moving fictional energy token.

Objective: direct the token through five required checkpoints in order.

Rules:
- Change switch states before the token reaches junctions.
- A switch supports two possible outgoing paths.
- Entering a dead end causes failure.
- Incorrect checkpoint order causes failure.
- Complete the route without stopping the token.

### 62 — Mega Transformer Network

Display eight numbered nodes and 12 possible weighted links.

Objective: connect all eight nodes while keeping total link cost at or below the displayed budget.

Rules:
- Generate a connected graph with at least one valid low-cost solution.
- The player toggles links on and off.
- Cycles are allowed but usually waste budget.
- Submit validates connectivity and total cost.
- Three invalid submissions cause failure.

### 63 — Hyper-Density Motor Cluster

Display nine rotors in a 3×3 grid.

Clicking one rotor rotates itself 90 degrees clockwise and its orthogonal neighbors 90 degrees counterclockwise.

Objective: align every marker upward.

Rules:
- Generate the puzzle by scrambling a solved state with legal moves.
- Provide a suitable move budget.
- Every generated puzzle must be solvable.
- Remaining moves affect the grade.

### 64 — Colossal Electrical Core

Display a 5×5 image-like geometric pattern divided into tiles.

Objective: restore the reference image through tile swaps and quarter-turn rotations.

Rules:
- Start from a solved reference and scramble using valid actions.
- Display a limited number of moves.
- Allow selecting two tiles to swap, or rotating a selected tile.
- Success requires every tile's position and orientation to match.
- Exhausting the move budget fails.

### 65 — Experimental Energy Matrix

Display four linked numerical controls and four target bands.

Objective: bring all four derived values into their target bands for three continuous seconds.

Rules:
- Each control affects at least two output readings.
- Inputs change in fixed steps.
- Target configurations are generated from a known feasible control state.
- Players must maintain stability, not merely touch the bands momentarily.
- Too many seconds outside the safe simulation region cause failure.

### 66 — Ultra-Industrial Logic Engine

Display a programmable fictional robot and a 5×5 grid.

Allowed commands: Forward, Turn Left, Turn Right, Collect, and Repeat Previous.

Objective: collect two marked tokens and reach the exit.

Rules:
- Maximum program length: 12 commands.
- Execute the program after pressing Run.
- Hitting a blocked tile stops that run.
- Provide up to three submission attempts.
- Generate reachable layouts and validate solvability before display.

### 67 — Hyperconductive Power Core

Display a grid containing weighted connection tiles.

Objective: connect Start to End while visiting two mandatory nodes.

Rules:
- Each selected connection consumes its displayed cost.
- Maximum route budget is shown.
- Players may remove and replace connections before submitting.
- Generate a valid path under budget.
- Submit rejects disconnected or over-budget routes.
- Three invalid submissions cause failure.

### 68 — Autonomous Recycling Megaplant

Display a scheduling board with three machines and six fictional processing jobs.

Each job has a duration, eligible machine and dependency requirements.

Objective: schedule all jobs within a 12-tick timeline.

Rules:
- Drag or select jobs into slots.
- Dependent jobs cannot start before their prerequisites finish.
- Machines cannot process overlapping jobs.
- Validate the complete schedule.
- Three invalid submissions cause failure.

### 69 — Electromagnetic Titan Engine

Display a four-lane rhythm interface.

Objective: hit 24 notes with at least 80% accuracy.

Rules:
- Some notes require simultaneous two-lane input.
- Other notes require a short hold.
- Provide visual and keyboard alternatives.
- Four complete misses fail.
- Timing accuracy determines grade.

### 70 — Quantum Recycling Array

Display fictional material tokens moving along a conveyor.

Classification rules change periodically among shape, color, and symbol.

Objective: correctly sort 18 tokens.

Rules:
- The active sorting rule is always visible.
- Players select the correct output bin.
- Each wrong bin is an error.
- Three errors cause failure.
- Faster correct responses improve grade.

### 71 — Colossal Generator Matrix

Display a 5×5 network board with movable connection links.

Objective: connect one power source to six required nodes.

Rules:
- Each node has a maximum connection count.
- Players can place or remove links.
- A maximum of 14 links may be active.
- Generate feasible networks with at least one solution.
- Three invalid validations cause failure.

### 72 — Hyper-Scale Turbine Engine

Display three velocity meters and target velocity bands.

Objective: hold all three outputs inside their bands for four seconds.

Rules:
- Player inputs apply acceleration or braking.
- Values continue moving due to simulated momentum.
- Each control affects one primary meter and one secondary meter.
- A visible failure meter fills when outputs exceed broad limits.
- Filling the meter fails the stage.

### 73 — Advanced Electromagnetic Grid

Display a fictional symbolic cipher.

Provide six symbol equations and a limited set of possible numerical values.

Objective: solve the symbol values and enter a six-character final code.

Rules:
- Generate a unique consistent solution.
- Equations must be sufficient to determine every required symbol.
- Allow three code submissions.
- Incorrect submissions display which constraints remain unsatisfied without revealing the answer.

### 74 — Titan Industrial Reactor Module

Display a fictional state-transition diagram.

Objective: reach the highlighted target state from the start state.

Rules:
- Each state has two or three possible transitions.
- Certain transitions consume an abstract resource token.
- The player receives a limited token budget.
- Entering a forbidden state causes failure.
- Generate a guaranteed valid route.

This is an abstract game puzzle, not a real-world reactor operating simulation.

### 75 — Quantum Motor Megastructure

Display three moving robots on a 6×6 board.

Objective: move all three to separate destinations without collisions.

Rules:
- Players program one move per robot per turn.
- All robots move simultaneously after submission.
- Two robots cannot occupy the same square.
- Robots cannot swap through one another in a single turn.
- Reach all goals within 12 turns.
- Generate a solvable starting configuration.

### 76 — Imperial Recycling Core

Display four fictional resources and four projects.

Objective: satisfy each project's minimum requirements without exceeding total available resources.

Rules:
- Resources are integer quantities.
- Some projects require combinations of two resource types.
- Generate a feasible allocation.
- Allow freely editing allocation before validation.
- Three invalid submissions fail.

### 77 — Ultra-Dense Generator Array

Display five rhythm lanes.

Objective: complete a 30-note sequence including taps, holds and simultaneous hits.

Rules:
- Timing windows become narrower later in the challenge.
- Five missed notes fail.
- Hold notes require maintaining input until the end marker.
- Grade depends on accuracy and correct holds.

### 78 — Hyperconductive Industrial Nexus

Display two connected signal-routing layers.

Objective: connect three colored inputs to their matching outputs.

Rules:
- Signals move through directional tiles.
- Special portals transfer signals between layers.
- Rotate routing tiles using clicks or keyboard controls.
- Each output accepts only its matching color.
- Submit checks all three complete routes.
- Three invalid submissions fail.

### 79 — Experimental Titan Stator

Display a rotating 3×3×2 arrangement of symbols using two visible layers.

Objective: memorize the reference arrangement and reconstruct it.

Rules:
- Preview the target for eight seconds.
- Allow switching between the two layers.
- Players swap symbols and rotate individual tiles.
- Generate the scramble through reversible operations.
- Provide a sufficient move budget.
- Correct position and orientation are both required.

### 80 — Quantum Energy Distribution Hub

Display a weighted network containing two supply nodes and five demand nodes.

Objective: satisfy all demands at minimum possible cost within a specified budget.

Rules:
- Each edge has capacity and transportation cost.
- Players allocate integer flow to edges.
- Flow conservation must hold at intermediate nodes.
- Supply and demand totals must balance.
- Generate a feasible low-cost solution.
- Three invalid submissions fail.

### 81 — Advanced Recycling Command Core

Display a programmable command interface and a small fictional production grid.

Allowed commands include Move, Collect, Deposit, Loop and Conditional Skip.

Objective: collect three specified materials and deposit them at the correct stations.

Rules:
- Maximum program length: 14 commands.
- Loops have clearly displayed iteration counts.
- Conditional Skip examines a visible state.
- Each run must terminate within a defined execution limit.
- Provide three program submissions.
- Generate solvable layouts.

### 82 — Hyper-Industrial Megasystem

Display three linked control panels.

Panel A routes energy tokens.

Panel B allocates production capacity.

Panel C matches the resulting output pattern.

Objective: complete all three panels with consistent values.

Rules:
- Panel A's result changes the available capacity in Panel B.
- Panel B's result determines the target in Panel C.
- Players may revisit earlier panels before final submission.
- Generate an internally consistent solution.
- Three final invalid submissions fail.

### 83 — Titan Quantum Power Engine

Display six linked phase rings.

Objective: align all six rings simultaneously.

Rules:
- Rotating a selected ring affects itself and two predetermined linked rings.
- Moves are discrete 30-degree rotations.
- Generate a solvable scrambled state from an aligned configuration.
- Complete within the displayed move budget.
- Success requires all six markers within tolerance.

### 84 — Colossal Electromagnetic Nexus

Display a board of abstract AND, OR, XOR and NOT logic gates.

Objective: connect provided inputs through the gates to reproduce four target outputs.

Rules:
- Players may reposition gates into provided slots.
- Wires connect only compatible abstract ports.
- Generate a valid target circuit first.
- Evaluate the resulting circuit for all specified input cases.
- Three invalid submissions fail.

### 85 — Experimental Recycling Singularity

Display a 6×6 grid of abstract material symbols.

Objective: compress the grid into a specified target pattern.

Rules:
- Allowed actions are Rotate 2×2, Swap Rows, and Merge Matching Symbols.
- Merging follows clearly displayed fictional puzzle rules.
- Generate target puzzles by reversing valid transformations or validate solvability.
- Provide a finite action budget.
- Reaching the target exactly completes the challenge.

### 86 — Ultimate Industrial Power Matrix

Display a three-phase logic challenge:

Phase 1: Select a resource allocation.

Phase 2: Route the allocated resources through a constrained network.

Phase 3: Synchronize the resulting output indicators.

Rules:
- Decisions in Phase 1 determine resources available in Phase 2.
- Phase 2 determines target settings for Phase 3.
- Preserve previous decisions within the attempt.
- Guarantee at least one solution across all phases.
- The final stage succeeds only after all three phases are completed.

### 87 — Copper Empire Ascendant Core

Create the capstone signature challenge.

It contains four interactive sections:

1. A six-symbol memory sequence.
2. A compact resource-allocation puzzle.
3. A three-ring timing and synchronization challenge.
4. A final network-connection logic puzzle.

Each section must work independently and contribute to the overall stage score.

Rules:
- Present clear instructions for each section.
- Preserve section progress during a valid attempt.
- Failure restarts the complete signature challenge.
- Generate or validate solvable puzzle states.
- Overall success requires all four sections.
- Total score determines S/A/B/C performance.

The capstone challenge must look and feel substantially different from the ordinary challenges.

## E. MINIGAME INTEGRATION REQUIREMENTS

For each signature:

- Register the actual playable implementation.
- Add its instructions.
- Integrate it with difficulty scaling.
- Add proper scoring.
- Include input controls.
- Support pauses.
- Support retrying.
- Add Practice Room compatibility.
- Register its electronic association.
- Include it in encounters, journal and statistics.
- Test success and failure conditions.

Do not generate impossible random puzzles.

For puzzles built using scrambling, begin with a valid solved state and apply reversible transformations.

For resource and scheduling puzzles, construct a feasible solution before generating the visible starting state.

Every stage should have a realistic completion time and should not require players to perform unsafe physical activities.

## F. PROGRESSION AND MINIMUM STAGE REQUIREMENTS

All R13–R18 electronics must be locked before Ascension 1.

Do not bypass the current chapter's level requirements.

Gold milestones remain part of R13–R18 rebirth eligibility, as specified in the larger Ascension expansion.

There must be no separate gold Rebirth system.

New electronics primarily reward copper, not gold.

Ordinary electronic failures retain the device.

The final electronic signature remains compulsory.

Stage Compression must reduce supporting signatures, not damage challenge identity.

## G. REQUIRED VALIDATION EXAMPLES

Verify the following:

1. Device #52 remains $35B and 175–300 kt base recovery.
2. Exactly 87 electronics exist.
3. Exactly 87 unique electronic signature implementations exist.
4. Devices #53–87 appear in the correct chapters.
5. Every new minigame has a valid success path.
6. Every new minigame has a valid failure path.
7. Stage Compression rank costs scale by exactly 100×.
8. Current-chapter electronics with at least three authored stages cannot fall below three.
9. Older electronics may fall to one stage.
10. No electronic can have zero stages.
11. The original device's signature is always played.
12. Existing Advanced Workbench reduction interacts correctly with Stage Compression.
13. Stage Compression survives ordinary Rebirth and Ascension.
14. Gold progression does not reset during ordinary Rebirth.
15. Existing saves migrate without losing old progress.
16. New high-value purchases and rewards retain numeric precision.
17. The new minigames function on desktop and touch devices.
18. All required build and automated tests pass.

Do not announce completion merely because catalogue definitions have been added.

A feature counts as implemented only when players can interact with it successfully and the corresponding backend and save rules work.

Finally, report exactly which devices, minigames, upgrades and tests are complete.