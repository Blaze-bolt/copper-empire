// Authored player copy, imported from docs/MINIGAME_INSTRUCTIONS_SOURCE.txt.
// Corrections to runtime discrepancies live in minigame-guides.js.
export const GUIDE_COPY=[
  {
    "id": 1,
    "name": "Precision Timing",
    "objective": "Stop the moving marker inside the green zone.",
    "howTo": "Watch the marker travel along the track, then press Space or tap Lock it in when it enters green.",
    "rules": "Stopping outside green fails the stage. There is no countdown on the first motor.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2,
    "name": "Fan Blade Alignment",
    "objective": "Match every fan blade to its numbered outline at the correct angle.",
    "howTo": "Select a loose blade, rotate it in 60-degree steps, then tap its matching numbered shadow to place it. Repeat for all blades.",
    "rules": "A blade must match both its number and rotation. Three incorrect placements end the attempt.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 3,
    "name": "Rotor Balance",
    "objective": "Move weights until the spinning wheel is balanced.",
    "howTo": "Tap a segment containing a weight, then tap its destination. Try arranging weights so they counterbalance around the wheel; press Check when ready.",
    "rules": "The balance reading must fall below 0.15. Moving weight to a poor spot won't solve it.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 4,
    "name": "Sound Wave Matching",
    "objective": "Make your adjustable wave overlap the reference wave.",
    "howTo": "Change the Amplitude, Frequency and Phase controls, comparing your waveform with the reference as you go.",
    "rules": "Maintain at least 90% similarity for two seconds. A close match for only a moment is not enough.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 5,
    "name": "Vibration Pattern Memory",
    "objective": "Repeat the short-and-long pulse pattern in the same order.",
    "howTo": "Watch the demonstration without pressing anything. When input begins, tap SHORT for a short pulse or LONG for a long pulse; S and L work too.",
    "rules": "Each tap submits one pulse. Holding a button longer does not create a long pulse; use LONG instead.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 6,
    "name": "Frequency Slider Puzzle",
    "objective": "Make all five bars match their reference heights.",
    "howTo": "Look at the target shown for each band. Move its slider up or down until the value matches, then submit the full arrangement.",
    "rules": "Check every band before submitting; one correct slider does not complete the puzzle.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 7,
    "name": "Airflow Maze",
    "objective": "Create an uninterrupted path from IN to OUT.",
    "howTo": "Tap an arrow to rotate its direction. Follow the arrows from IN and make each one point toward the next usable tile, then test the route.",
    "rules": "Walls cannot carry airflow. Testing an incomplete path spends two moves.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 8,
    "name": "Circuit Tile Rotation",
    "objective": "Join the two outside terminals with a continuous circuit.",
    "howTo": "Tap circuit tiles to rotate their visible connections until the paths join end-to-end. Press Test when the route appears connected.",
    "rules": "Touching lines must connect correctly; a gap or incorrect turn breaks the circuit.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 9,
    "name": "Symbol Matching",
    "objective": "Select the moving shapes that match the target symbol.",
    "howTo": "Check the reference symbol first. Tap only matching shapes as they move across the screen; ignore the decoys.",
    "rules": "Three wrong selections or four missed targets end the stage.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 10,
    "name": "Rotating Gear Puzzle",
    "objective": "Point every gear marker straight upward.",
    "howTo": "Tap a gear to turn it clockwise. Watch its neighbours: they rotate the opposite way, so plan more than one move ahead.",
    "rules": "All markers must face up before your move allowance runs out.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 11,
    "name": "Conveyor Component Sorting",
    "objective": "Send each moving component to the bin with the same label.",
    "howTo": "Read the component's A, B or C label, then tap or drag it into the matching bin before it passes.",
    "rules": "Three incorrect sorts or four missed components end the stage.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 12,
    "name": "Precision Path Tracing",
    "objective": "Trace the glowing route all the way from START to END.",
    "howTo": "Begin at START, then drag along the highlighted corridor. On supported controls, use arrows or the on-screen direction buttons instead.",
    "rules": "Stay inside the corridor; cutting across the unmarked area does not count.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 13,
    "name": "Suction Direction Puzzle",
    "objective": "Guide both colored particles to their separate exits.",
    "howTo": "Rotate the directional arrows before releasing the particles. Trace orange from tile 1 to tile 8 and teal from tile 13 to tile 12.",
    "rules": "Both colored routes must work. A route that sends one particle to the wrong exit is incorrect.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 14,
    "name": "Flow Network Puzzle",
    "objective": "Send every flow to the destination shown for it.",
    "howTo": "Toggle gates A, B and C. Each route turns RIGHT only when exactly one of its two linked gates is open; otherwise it goes the other way. Press Dispatch to test.",
    "rules": "All flow destinations must match together, not one at a time.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 15,
    "name": "Magnetic Polarity Logic",
    "objective": "Arrange positive and negative blocks in an alternating pattern.",
    "howTo": "Tap one polarity block and then a second to swap them. Compare every block with the one above, below, left and right.",
    "rules": "Two blocks that touch along an edge must have opposite signs. Submit only when every pair follows the rule.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 16,
    "name": "Spin Cycle Rhythm",
    "objective": "Hit the notes as they cross the top target line.",
    "howTo": "Watch each rotating note and tap Space at the moment it reaches the marker at the top.",
    "rules": "Reach at least 75% accuracy and miss no more than three notes.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 17,
    "name": "Pipe Connection Puzzle",
    "objective": "Build one complete pipe route between IN and OUT.",
    "howTo": "Select a pipe piece, rotate it to point the right way, then place it in an available spot. Tap a placed piece to pick it up again.",
    "rules": "Use every piece exactly once and leave no gap between connected pipe ends.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 18,
    "name": "Temperature Balance",
    "objective": "Keep both temperature meters inside their green bands at once.",
    "howTo": "Adjust the two controls gradually. Each control also influences the other meter; keep watching both readings as you change them.",
    "rules": "Both meters must stay in their target bands for three continuous seconds.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 19,
    "name": "Pressure Stability",
    "objective": "Keep the drifting pressure gauge within the safe middle range.",
    "howTo": "Use + and − or the arrow keys to correct the gauge as it drifts. Make at least three adjustments while accumulating safe time.",
    "rules": "Collect ten seconds inside 35–65%. Staying outside for more than 2.5 seconds continuously fails.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 20,
    "name": "Valve Sequence Memory",
    "objective": "Repeat the numbered valves in the demonstrated order.",
    "howTo": "Watch which valve numbers flash. After the demonstration, tap the valves in that same numerical order, even if their positions move.",
    "rules": "One incorrect valve ends the stage. Remember the numbers, not just the locations.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 21,
    "name": "Moving Target Challenge",
    "objective": "Hit the highlighted moving target repeatedly.",
    "howTo": "Tap the amber target whenever it appears and ignore the gray distractions. Look again after each hit because the active target moves.",
    "rules": "Three wrong selections end the stage.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 22,
    "name": "Power Output Matching",
    "objective": "Make your six output bars match the six reference marks.",
    "howTo": "Tap each column to cycle its output from 0 to 5. Compare the six heights with the reference, then Submit.",
    "rules": "The average difference from the targets must be no more than 0.25.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 23,
    "name": "Dual Circuit Synchronisation",
    "objective": "Complete both circuit boards simultaneously.",
    "howTo": "Rotate tiles until both boards have working connections. The first linked tile turns on BOTH boards, while other tiles change independently.",
    "rules": "A change that repairs one board may disturb the other. Check both before testing.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 24,
    "name": "Coil Pattern Reconstruction",
    "objective": "Restore the displayed ring's segment order and arrow direction.",
    "howTo": "Memorize the reference ring. Swap pieces into their positions and rotate each arrow upward as needed.",
    "rules": "Correct pieces in the wrong positions, or correct positions with wrong arrows, do not win.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 25,
    "name": "Multi-Channel Flow",
    "objective": "Direct each moving token into its matching outlet.",
    "howTo": "Before a token reaches a junction, change that junction to A, B or C so it follows the matching route.",
    "rules": "You may misroute at most two tokens.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 26,
    "name": "Elevator Positioning",
    "objective": "Stop the platform at each marked floor in order.",
    "howTo": "Use Up and Down to change movement, Brake to slow down and Stop once the platform is close to the next target.",
    "rules": "You must stop within 4.5% of the target at a low speed. Reaching the floor while moving too fast doesn't count.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 27,
    "name": "Factory Conveyor Coordination",
    "objective": "Schedule conveyor speeds so loads do not collide.",
    "howTo": "Switch each belt between Paused, Slow and Fast, and set its A, B or C exit. Watch when loads will arrive at the shared junction.",
    "rules": "Arrivals at the shared junction must be at least 0.7 seconds apart.",
    "visual": "Spotlight the animated reference first; show a harmless sample playback and then spotlight the response buttons without revealing the live pattern."
  },
  {
    "id": 28,
    "name": "Load Distribution Puzzle",
    "objective": "Keep the loaded platform balanced in its middle zone.",
    "howTo": "Select a weight, then choose an open platform slot. Use the visible weight values and distances to spread the load evenly.",
    "rules": "Place all four blocks and keep the weighted balance point in the middle before submitting.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 29,
    "name": "Energy Routing",
    "objective": "Deliver power from source 0 to every starred point.",
    "howTo": "Choose connections between points, starting from the power source. Trace which stars are reachable through your selected connections.",
    "rules": "Every star must have power, and selected connections must stay within six energy tokens.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 30,
    "name": "Recycling Assembly Line",
    "objective": "Process six batches through stations in the correct order.",
    "howTo": "Select a batch, read its station sequence, then tap the requested stations in that order. Switch batches when useful.",
    "rules": "Stations temporarily cool down. Fewer than three processing errors are allowed.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 31,
    "name": "Multi-Rotor Synchronisation",
    "objective": "Bring every spinning marker into its top alignment zone together.",
    "howTo": "Adjust individual rotor speeds in quarter steps. You can set a rotor's speed to zero to hold its position, then press Synchronize.",
    "rules": "All rotors must be aligned at the same time, not just one after another.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 32,
    "name": "Power Grid Restoration",
    "objective": "Reconnect the grid so all stations receive power from source 0.",
    "howTo": "Choose links that connect the source to the other nodes. Use the displayed energy limit and count links touching each node.",
    "rules": "You have seven energy. No node may have more than two connections.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 33,
    "name": "Precision Frequency Lock",
    "objective": "Keep your adjustable marker following the moving target.",
    "howTo": "Move your marker with Left and Right or the on-screen bar. Make small corrections as the target travels.",
    "rules": "Stay inside tolerance for eight consecutive seconds. Three seconds of mismatch loses.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 34,
    "name": "Factory Robot Programming",
    "objective": "Program a robot to collect both stars and reach EXIT.",
    "howTo": "Build a command sequence using Move, Left, Right and Collect. Repeat executes the previous command twice more; then run your program.",
    "rules": "The robot must collect both stars before reaching EXIT. Check the route your commands actually produce.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 35,
    "name": "Stability Matrix",
    "objective": "Turn every lit matrix cell off.",
    "howTo": "Tap a cell to change that cell and its four direct neighbours. Plan which cells to toggle, then check the board.",
    "rules": "Every cell must be off before the move budget runs out.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 36,
    "name": "Magnetic Field Maze",
    "objective": "Reach EXIT without entering forbidden spaces.",
    "howTo": "Rotate the directional field arrow underneath your token, then press Step to move one tile. Repeat until you reach the exit.",
    "rules": "A step into an invalid or forbidden tile ends the stage.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 37,
    "name": "Alternating Pulse Sequence",
    "objective": "Hit the timed notes on both lanes.",
    "howTo": "Use A or Left for one lane and D or Right for the other. Tap as each note reaches its lane's top timing mark.",
    "rules": "More than three missed notes ends the stage; keep watching both lanes.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 38,
    "name": "Generator Network Puzzle",
    "objective": "Supply the three demands using two limited generators.",
    "howTo": "Choose how many energy tokens each generator sends to each destination. Review generator totals and destination needs before testing.",
    "rules": "A connection holds at most three tokens. Use no more than four connections and do not exceed supply.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 39,
    "name": "Rotational Momentum Challenge",
    "objective": "Bring the rotating disc to its target angle and nearly stop it.",
    "howTo": "Apply clockwise or counterclockwise impulses to steer and slow the disc. Watch both its angle and the speed readout before Lock.",
    "rules": "The disc must be on target and moving below 8 degrees per second.",
    "visual": "Spotlight the animated reference first; show a harmless sample playback and then spotlight the response buttons without revealing the live pattern."
  },
  {
    "id": 40,
    "name": "Automated Recovery Scheduling",
    "objective": "Fit every job into an eight-tick schedule without resource clashes.",
    "howTo": "Select a job, then tap where it should begin on the timeline. A two-resource job occupies both rows during its run.",
    "rules": "All jobs must fit before the end, with no overlapping use of the same resource.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 41,
    "name": "Ultra-Precision Alignment",
    "objective": "Align every ring's arrow with its narrow target.",
    "howTo": "Rotate rings in 15-degree steps. Watch for linked rings: adjusting one may also move another.",
    "rules": "Every ring must match its marked target before checking.",
    "visual": "Spotlight the animated reference first; show a harmless sample playback and then spotlight the response buttons without revealing the live pattern."
  },
  {
    "id": 42,
    "name": "Multi-Generator Synchronization",
    "objective": "Make all three generator peaks line up in time.",
    "howTo": "Change the phase offsets, which shift a wave left or right without changing its speed. Test when all three peaks appear aligned.",
    "rules": "All peaks need a shared alignment window lasting 0.35 seconds.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 43,
    "name": "Resource Optimization",
    "objective": "Produce the required amount of resource C without leaving unusable waste.",
    "howTo": "Read the available recipes. Choose conversions between A, B and C, tracking what each move consumes and produces.",
    "rules": "An impossible leftover combination or using all permitted actions without success fails.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 44,
    "name": "Titan Core Sequence",
    "objective": "Solve the connected panels and enter their final code.",
    "howTo": "Complete each panel, remembering the symbol values it reveals. Enter the SUN–MOON–DIAMOND values in the displayed order.",
    "rules": "The final answer must use the values revealed by this attempt, not a remembered code from another run.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 45,
    "name": "Experimental Pattern Decoder",
    "objective": "Work out the values of three symbolic expressions.",
    "howTo": "Use the displayed symbol values. Add touching symbols together and double the expression inside brackets. Enter each result.",
    "rules": "Three incorrect answers end the stage.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 46,
    "name": "Hyper-Speed Reflex Grid",
    "objective": "Repeat the flashed cell sequence under time pressure.",
    "howTo": "Watch the three highlighted cells, then tap them in the same order before seven seconds elapse. Complete all four rounds.",
    "rules": "Three mistakes end the stage. The active cells can change between rounds.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 47,
    "name": "Electromagnetic Logic Gates",
    "objective": "Make the three displayed logic outputs match their targets.",
    "howTo": "Toggle the Boolean inputs. If needed, swap the B/C connections. Compare the resulting AND, OR and NOT outputs with the references.",
    "rules": "Test only when all three outputs match together.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 48,
    "name": "Experimental Core Stabilization",
    "objective": "Keep three linked readings inside their marked bands.",
    "howTo": "Move the three controls in small steps while monitoring how each one changes multiple readings.",
    "rules": "All three readings must remain inside target for three continuous seconds.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 49,
    "name": "Multi-Dimensional Energy Routing",
    "objective": "Guide two tokens through a two-layer board to their own goals.",
    "howTo": "Choose which token to move, use direction controls, and use the central portal when needed to change layers.",
    "rules": "Deliver both tokens to their matching destinations in sixteen moves.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 50,
    "name": "Ultra-Dense Pattern Compression",
    "objective": "Build the shown picture using the available small blocks.",
    "howTo": "Select a reusable 2-by-2 block, then tap the square where its top-left corner should go. Use Restart if you want to clear the layout.",
    "rules": "Match the whole reference while staying within the block allowance.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 51,
    "name": "Hyper-Scale Command Center",
    "objective": "Complete eight system tasks by dividing limited resources.",
    "howTo": "Move four shared resource controls to satisfy each displayed task. Let the systems cool when necessary before continuing.",
    "rules": "Finish all eight tasks before three deadlines are missed or the system overheats.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 52,
    "name": "Experimental Energy Converter",
    "objective": "Produce exactly one Y and one Z using the virtual converter.",
    "howTo": "Open both input gates and connect the converter route. Feed 2 units of A and 1 of B for each conversion, then trigger during the green timing window.",
    "rules": "Respect the converter capacity. Extra products or incorrectly timed conversions do not meet the target.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 53,
    "name": "Four-Phase Alignment",
    "objective": "Line up all four rings with their green target arcs.",
    "howTo": "Use the plus or minus 15-degree controls under each ring. Once all are inside the marked arcs, press Lock.",
    "rules": "Each ring must be within 12 degrees of its target and hold alignment for two seconds. Three bad locks fail.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 54,
    "name": "Symbol Queue Reconstruction",
    "objective": "Turn your five-symbol sequence into the displayed target sequence.",
    "howTo": "Use Rotate Left, Rotate Right, Reverse First Three or Swap Adjacent Pair. Watch the queue after each operation.",
    "rules": "Reach the exact target within eight operations. The last and first positions count as adjacent for the wraparound swap.",
    "visual": "Spotlight the animated reference first; show a harmless sample playback and then spotlight the response buttons without revealing the live pattern."
  },
  {
    "id": 55,
    "name": "Momentum Dial Lock",
    "objective": "Stop three moving dials at their individual target angles.",
    "howTo": "Choose a dial, use thrust to change its momentum, apply Brake to slow it, then Lock only when it is near its goal.",
    "rules": "Each dial must be within ten degrees and slower than five degrees per second. Three bad locks fail.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 56,
    "name": "Six-Destination Power Allocation",
    "objective": "Distribute all twelve available energy units according to the destination demands.",
    "howTo": "Set the six amount sliders. The requested amounts are shown next to the destinations; each link can carry at most five.",
    "rules": "Use exactly twelve units and meet every displayed demand; three invalid submissions fail.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 57,
    "name": "Linked Rotor Rotation",
    "objective": "Turn every rotor arrow to the direction shown on its target.",
    "howTo": "Tap a rotor to rotate it; its linked horizontal neighbour also turns. Recheck both arrows after every click.",
    "rules": "All rotor directions must match together.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 58,
    "name": "Rotating Symbol Memory",
    "objective": "Remember symbol identities even while the board changes position.",
    "howTo": "Watch four symbols flash one after another. When asked to repeat them, choose the same symbols rather than the same screen locations.",
    "rules": "The matrix rotates after flashes. Complete four rounds; two errors fail.",
    "visual": "Spotlight the animated reference first; show a harmless sample playback and then spotlight the response buttons without revealing the live pattern."
  },
  {
    "id": 59,
    "name": "Converter Output Allocation",
    "objective": "Feed four virtual converters to reach their requested outputs.",
    "howTo": "Check each converter's multiplier and permitted input range. Adjust its slider so its resulting output matches the printed target.",
    "rules": "Allocate exactly twenty inputs overall and meet all four output targets; three invalid submissions fail.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 60,
    "name": "Pulsing Ring Rhythm",
    "objective": "Tap each ring as it crosses the top timing mark.",
    "howTo": "Watch each ring's independent rotation and tap its control at the highlighted top point. Continue through three six-note rounds.",
    "rules": "Four missed beats fail. Different rings do not necessarily share the same timing.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 61,
    "name": "Checkpoint Junction Routing",
    "objective": "Guide the moving token through checkpoints in numerical order.",
    "howTo": "Before the token reaches a junction, choose the branch labeled with the next required checkpoint number.",
    "rules": "A wrong checkpoint or dead-end path ends the stage immediately.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 62,
    "name": "Eight-Point Network",
    "objective": "Connect all eight marked points without overspending.",
    "howTo": "Select links to build a connected network. Check the cost displayed for each available connection.",
    "rules": "All eight nodes must be connected and the total selected link cost must fit the budget. An affordable loop is allowed.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 63,
    "name": "Neighbour-Coupled Arrows",
    "objective": "Point every arrow straight upward.",
    "howTo": "Tap a tile to turn its arrow clockwise; the arrows directly above, below, left and right turn the opposite way.",
    "rules": "Get all arrows upright before the move limit is exhausted.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 64,
    "name": "Geometric Tile Reconstruction",
    "objective": "Rebuild the numbered picture in its original order and direction.",
    "howTo": "Tap two tiles to swap positions, and rotate tiles until their small arrows point up. Compare the result to the reference.",
    "rules": "Every tile must occupy the correct place and orientation within the move budget.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 65,
    "name": "Four-Control Stability",
    "objective": "Keep four connected readings inside their respective target regions.",
    "howTo": "Change one of the four integer controls at a time, then watch how all four meters respond.",
    "rules": "Maintain all target readings for three seconds. Remaining outside the safe region for ten seconds fails.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 66,
    "name": "Advanced Robot Program",
    "objective": "Write a short robot program to gather two tokens and reach EXIT.",
    "howTo": "Add Forward, Left, Right, Collect and Repeat Previous commands, then run the sequence to test its movement.",
    "rules": "Collect both tokens and finish at EXIT within twelve command slots. Three failed program runs end the stage.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 67,
    "name": "Checkpoint Route Planner",
    "objective": "Draw a connected route from START to END through both required checkpoints.",
    "howTo": "Choose route links one by one. You may remove a link and try another route before validation.",
    "rules": "Visit both marked checkpoints, stay within the weighted cost budget and avoid a broken route. Three invalid checks fail.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 68,
    "name": "Machine Timeline Scheduling",
    "objective": "Schedule six jobs on their permitted machines without conflicts.",
    "howTo": "Choose a job, then select or drag it to an allowed machine and starting time. Observe duration and prerequisite tasks.",
    "rules": "All six must finish by tick twelve without overlaps or broken dependencies.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 69,
    "name": "Four-Lane Rhythm",
    "objective": "Play the notes in four lanes, including notes that arrive together.",
    "howTo": "Press keys 1–4 as notes reach their lane markers. Hold a key through a long note's tail when indicated.",
    "rules": "Finish 24 notes with at least 80% accuracy. Four completely missed notes fail.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 70,
    "name": "Changing-Rule Sorting",
    "objective": "Sort eighteen tokens while the sorting rule changes during the game.",
    "howTo": "Read the current rule: it might ask for shape, color or symbol. Route each token according to that rule, then re-read it after six correct sorts.",
    "rules": "Three incorrect sorts end the stage. Don't keep using the old rule after it changes.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 71,
    "name": "Six-Station Power Grid",
    "objective": "Connect the power source to all six marked stations.",
    "howTo": "Select cable links through the 5-by-5 grid and check whether every star can be reached from the source.",
    "rules": "Stay within fourteen links and observe the connection limit printed on each node. Three bad validations fail.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 72,
    "name": "Coupled Turbine Balance",
    "objective": "Keep three turbine outputs near their indicated goals while slowing their movement.",
    "howTo": "Accelerate or brake the displayed turbine controls. Some changes affect a neighbouring turbine too.",
    "rules": "Maintain all three target bands with low momentum for four seconds; avoid the broad danger limits.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 73,
    "name": "Six-Symbol Equation Code",
    "objective": "Solve the linked clues and enter the resulting six-digit code.",
    "howTo": "Read all six equations. Work out shared symbol values that satisfy them together, then enter the digits in the requested order.",
    "rules": "The same symbol represents the same value in every equation. Three incorrect submissions fail.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 74,
    "name": "Abstract State Machine",
    "objective": "Navigate from the current state to the starred goal.",
    "howTo": "Select one of the visible transitions, checking what it costs and which state it leads to before moving.",
    "rules": "Reach the target before resources run out. Entering the red forbidden state ends the stage.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 75,
    "name": "Three-Robot Coordination",
    "objective": "Move three robots to their matching goals without letting them collide.",
    "howTo": "Choose a direction or Wait for each robot, then press Advance to execute that shared turn. Repeat as a sequence.",
    "rules": "Complete within twelve turns. Robots cannot enter walls, share a tile or swap through each other.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 76,
    "name": "Four-Resource Project Allocation",
    "objective": "Fund four projects from four limited resource pools.",
    "howTo": "Adjust how much of each resource goes to each project. Read the required amounts for each resource type separately.",
    "rules": "Every project must receive all its requirements without spending more than any resource pool holds. Three invalid submissions fail.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 77,
    "name": "Five-Lane Advanced Rhythm",
    "objective": "Play the changing timing windows across five note lanes.",
    "howTo": "Use keys 1–5. Tap single or paired notes together and hold sustained notes until their ends.",
    "rules": "Complete thirty notes while staying below five misses. Later notes have narrower hit windows.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 78,
    "name": "Two-Layer Portal Routing",
    "objective": "Route three colored inputs to their matching colored outputs.",
    "howTo": "Rotate arrows on both layers to direct each route. Use an upward portal tile only when it is part of a marked matching portal pair.",
    "rules": "All three paths must end at their own outputs; mismatched portals do not transfer the route.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 79,
    "name": "Two-Layer Symbol Memory",
    "objective": "Rebuild both symbol grids from a short preview.",
    "howTo": "Study the two 3-by-3 layers during the eight-second viewing phase. Then swap symbols and rotate them to match the original positions and directions.",
    "rules": "Both layers, including their orientations, must match within the move allowance.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 80,
    "name": "Two-Source Transport Flow",
    "objective": "Deliver required quantities from two sources through hubs to five destinations at minimum cost.",
    "howTo": "Set the amount on each available link. Check source supplies, hub inflows and outflows, destination demands, link capacities and total cost.",
    "rules": "Every destination must receive its demand, hubs must balance and the route must meet the minimum-cost requirement.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 81,
    "name": "Material Collection Robot",
    "objective": "Program a robot to collect three materials and drop each at its matching station.",
    "howTo": "Build Move, Collect and Deposit commands. Repeat replays the previous command block twice; Conditional Skip skips the next command if empty.",
    "rules": "The program has fourteen slots. All three materials must reach the correct stations.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 82,
    "name": "Linked Control Panels",
    "objective": "Solve three connected panels whose outputs feed one another.",
    "howTo": "Start with panel A to route power, use the resulting capacity when setting panel B, then encode B's output in panel C.",
    "rules": "The final check validates all three panels together. Changing an earlier panel may invalidate a later one.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 83,
    "name": "Six Coupled Phase Rings",
    "objective": "Align six rings whose controls rotate neighbours as well.",
    "howTo": "Select a ring and turn it plus or minus thirty degrees. Watch the two linked neighbours after every adjustment.",
    "rules": "Match every displayed ring target before using the move budget.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 84,
    "name": "Programmable Logic Gates",
    "objective": "Build a gate network that produces the required outputs for all input examples.",
    "howTo": "Choose AND, OR, XOR or NOT gates for the slots. Connect them to compatible input ports, then test the shown cases.",
    "rules": "All four outputs must match for every listed input case. Three failed validations end the stage.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 85,
    "name": "Six-by-Six Pattern Builder",
    "objective": "Reconstruct the pictured board and place the required symbols into special pockets.",
    "howTo": "Rotate 2-by-2 squares clockwise and swap entire rows until the pattern matches. Merge exactly three matching symbols into the outlined pockets.",
    "rules": "Finish both the pattern and the pocket requirement within the move budget.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 86,
    "name": "Three-Phase Systems Finale",
    "objective": "Complete a linked sequence of resource, route and timing puzzles.",
    "howTo": "First allocate the shared resources. Next plan an affordable route using what remains. Finally synchronize the three indicators.",
    "rules": "Choices in an earlier phase change later limits. All three phases must succeed.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 87,
    "name": "Ascendant Final Challenge",
    "objective": "Complete four different puzzle sections in one run.",
    "howTo": "Memorize six symbols, allocate ten resource units, stop three moving rings in their targets, then connect the final network.",
    "rules": "A failure in any section restarts the full signature; finish all four in order.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 88,
    "name": "Quantum Logic Grid",
    "objective": "Make your 5-by-5 grid match the reference pattern exactly.",
    "howTo": "Tap a cell to flip it and its diagonal neighbours. Compare your grid to the reference after each change.",
    "rules": "Match all 25 cells within fourteen clicks. Cells directly above or beside your choice do not flip.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 89,
    "name": "Five-Channel Calibration",
    "objective": "Keep all five adjustable markers inside their moving goal bands.",
    "howTo": "Use the five channel sliders or focused arrow keys. Watch each target band drift and adjust markers to follow.",
    "rules": "All five must stay aligned simultaneously for three seconds. A full instability meter fails.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 90,
    "name": "Robotic Recovery Routing",
    "objective": "Move three robots to their matching colored goals.",
    "howTo": "Press Up, Down, Left, Right or Stay. Every robot receives the SAME command on each turn, so plan how they move together.",
    "rules": "Reach all three goals within the displayed turn limit. Walls, collisions and swapping positions are forbidden.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 91,
    "name": "Titan Sequence Reconstruction",
    "objective": "Choose the correct transformed version of the remembered symbol sequence.",
    "howTo": "Watch six symbols for four seconds. Read the requested change: reverse, rotate left, rotate right or swap neighbouring pairs. Choose the resulting sequence from the options.",
    "rules": "Complete four rounds. A second wrong answer ends the stage.",
    "visual": "Spotlight the animated reference first; show a harmless sample playback and then spotlight the response buttons without revealing the live pattern."
  },
  {
    "id": 92,
    "name": "Grid Synchronization",
    "objective": "Stop each of the six spinning discs inside its marked target wedge.",
    "howTo": "Watch the moving pointer on each disc, then tap its Lock control when the pointer enters the highlighted sector.",
    "rules": "Lock all six. Only two mistimed locks are allowed.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 93,
    "name": "Transformer Flow Balance",
    "objective": "Send exactly the requested energy to six destinations using two limited sources.",
    "howTo": "Adjust each source-to-destination amount. Add outgoing amounts for each source and incoming amounts for each destination before submitting.",
    "rules": "Meet all six demands without exceeding source supplies or connection capacity. Three incorrect submissions fail.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 94,
    "name": "CNC Command Programming",
    "objective": "Write a robot program that collects three parts and drops each at its matching station.",
    "howTo": "Add Move, Turn, Pick, Drop and Repeat Twice commands; run the program to see what happens.",
    "rules": "All three parts must be delivered correctly within fourteen instruction slots. Three failed executions end the stage.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 95,
    "name": "Stator Ring Assembly",
    "objective": "Put eight ring sectors in the correct order and orientation.",
    "howTo": "Use the swap control to exchange adjacent sectors. Rotate an individual sector left or right by 45 degrees to match its reference arrow.",
    "rules": "Finish the full reference pattern within sixteen actions.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 96,
    "name": "Automation Scheduler",
    "objective": "Fit eight jobs onto four available machine timelines.",
    "howTo": "Select or drag a job to an allowed machine lane and choose its start time. Check the job's length and any overlap with existing work.",
    "rules": "All eight jobs must fit before virtual time twelve with no overlaps.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 97,
    "name": "Servo Wave Matching",
    "objective": "Make four adjustable signal curves overlap their target curves.",
    "howTo": "For each curve adjust Frequency, Amplitude and Phase, then compare the copper-colored line with the teal reference. Press Lock when ready.",
    "rules": "All four curves must stay close enough for two seconds. Five bad lock attempts fail.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 98,
    "name": "Conveyor Sorting",
    "objective": "Send twenty moving tokens to one of three matching exits.",
    "howTo": "Look at the token's symbol or color, then press exit 1, 2 or 3 before the next token advances.",
    "rules": "Only two wrong routes are allowed; a third error ends the stage.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 99,
    "name": "PLC Logic Puzzle",
    "objective": "Make the six connected logic sockets produce every required test result.",
    "howTo": "Choose AND, OR or NOT for each socket. Follow its displayed input connections and compare output values across the four listed input cases.",
    "rules": "Run all four cases successfully. Three failed validations end the stage.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 100,
    "name": "Breaker Dependency Puzzle",
    "objective": "Activate all eight nodes in an order their dependencies permit.",
    "howTo": "Read the Needs list on each node. Start with a node that needs nothing, then activate nodes only after all their prerequisites show complete.",
    "rules": "Activate all nodes. A third dependency mistake fails.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 101,
    "name": "Three-Phase Balance",
    "objective": "Distribute twelve tokens across three phase meters.",
    "howTo": "Adjust the three phase amounts while checking each displayed target and maximum capacity.",
    "rules": "Use exactly twelve tokens; each amount must be within one of its target and below its capacity. Three incorrect checks fail.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 102,
    "name": "Grid Route Optimizer",
    "objective": "Join five starred stations through a blocked grid.",
    "howTo": "Tap passable cells to place or remove cable segments and create one connected network linking every starred point.",
    "rules": "Use at most twenty cable segments and do not route through blocked squares.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 103,
    "name": "Converter Synchronization",
    "objective": "Press SYNC when all three moving markers are in their highlighted windows together.",
    "howTo": "Watch the two horizontal indicators and the vertical indicator. Wait for the moment all three are inside their own green bands, then tap SYNC.",
    "rules": "You have three synchronization attempts.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 104,
    "name": "Superconducting Ring Calibration",
    "objective": "Match the twelve position symbols to the displayed target.",
    "howTo": "Tap a position to advance its state. The two immediate neighbours also advance, so watch the full ring after each click.",
    "rules": "Match every position within twenty actions.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 105,
    "name": "Cryogenic Stability",
    "objective": "Keep three simulated temperatures in their safe bands.",
    "howTo": "Share ten cooling points across the three cooling channels; adjust the controls as the temperature readings drift.",
    "rules": "Keep all temperatures safe for four seconds. If the instability meter fills, the stage fails.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 106,
    "name": "Copper Separation Sorting",
    "objective": "Sort twenty-four labeled tokens into their corresponding outlets.",
    "howTo": "Read each token's visible symbol, then press the matching one of three outlet buttons before its timer expires.",
    "rules": "The third wrong or missed route ends the stage.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 107,
    "name": "Research Instrument Alignment",
    "objective": "Turn six connected instrument arms to their reference directions.",
    "howTo": "Tap an arm to rotate it clockwise by 60 degrees. Its clockwise neighbour turns too, so plan around that side effect.",
    "rules": "All six arms must match within eighteen actions.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 108,
    "name": "Rotor Balance",
    "objective": "Arrange eight positive and negative blocks to cancel out horizontal and vertical force.",
    "howTo": "Select a +1 or −1 block and place it into one of the eight labelled positions around the rotor. Watch the two vector totals.",
    "rules": "Place all four +1 and four −1 blocks; both vector totals must equal zero.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 109,
    "name": "Data Center Cooling Network",
    "objective": "Connect the cooling source to all three server-rack inlets without leaks.",
    "howTo": "Rotate the pipe pieces until each required inlet connects through continuous pipe paths. Check that unused open pipe ends do not leak.",
    "rules": "Every rack must be connected and the completed network must be sealed.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 110,
    "name": "Gantry Path Programming",
    "objective": "Visit stations 1, 2, 3 and 4 in order, then reach DOCK.",
    "howTo": "Select up to six waypoints to shape the gantry's route. Use Clear to redesign the path; press Run to test it.",
    "rules": "Visit stations in number order and reach the dock within twenty-two grid steps.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 111,
    "name": "Motor Vibration Analyzer",
    "objective": "Match the combined vibration trace to the target waveform.",
    "howTo": "Move the Low, Mid and High harmonic sliders, watching how each changes the copper-colored combined curve.",
    "rules": "Keep the waveform error below the shown threshold for three seconds without filling instability.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 112,
    "name": "Converter Module Network",
    "objective": "Rotate four connection modules into one working route.",
    "howTo": "Tap module controls to turn their ports until the power input reaches the required outputs through matching openings.",
    "rules": "Complete all output connections within fifteen actions.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 113,
    "name": "Turbine Synchronization",
    "objective": "Make both turbines spin at nearly the same speed and angle.",
    "howTo": "Use separate speed and phase buttons for rotor 1 and rotor 2. Watch both values, then press Lock when they line up.",
    "rules": "Maintain speed difference below 3% and phase difference below twelve degrees for two seconds. Three bad locks fail.",
    "visual": "Spotlight the animated reference first; show a harmless sample playback and then spotlight the response buttons without revealing the live pattern."
  },
  {
    "id": 114,
    "name": "Supercomputer Packet Routing",
    "objective": "Deliver each labeled data packet to its matching destination.",
    "howTo": "For each round choose the next reachable node for every packet, or Stay. Check blocked links and how many packets each link can carry.",
    "rules": "All packets must arrive within eight rounds without exceeding link capacity.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 115,
    "name": "Industrial Command Priorities",
    "objective": "Put six jobs in a schedule that meets every deadline.",
    "howTo": "Read each job's duration, priority and due time, then tap jobs in the order you want them run. Check the resulting ten-slot timeline.",
    "rules": "Fit all jobs before their deadlines. Especially protect priority-three critical jobs.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 116,
    "name": "Generator Array Balancing",
    "objective": "Produce the requested combined output while keeping generators balanced.",
    "howTo": "Move the three generator sliders, checking both the total output and the gap between the largest and smallest outputs.",
    "rules": "Keep total output within 1% of target and spread within the displayed limit for three seconds.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 117,
    "name": "Experimental Control Matrix",
    "objective": "Fill a 5-by-5 symbol board without repeating a symbol in any row or column.",
    "howTo": "Tap an unlocked square to cycle its symbol. Leave the fixed clue squares unchanged; compare each row and column as you fill.",
    "rules": "Each of the five symbols must appear exactly once in every row and every column.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 118,
    "name": "Megafactory Logistics",
    "objective": "Route three packets from their starting points to their matching exits.",
    "howTo": "Tap direction arrows to rotate their paths, then press Simulate to test where all three packets travel.",
    "rules": "All three must arrive within twenty ticks without entering walls, colliding or swapping positions.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 119,
    "name": "Central Power Complex Finale",
    "objective": "Complete the three connected finale sections.",
    "howTo": "First rotate and connect six power modules. Next divide the available energy between four destinations. Finally synchronize two discs and one moving marker.",
    "rules": "Complete all three sections within the shared three-error allowance.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 1001,
    "name": "Gold Panning",
    "objective": "Keep the gold marker inside its green pocket until each round finishes.",
    "howTo": "Tilt the pan using the slider, Left/Right controls or on-screen buttons. Tap Shake occasionally to clear sediment, then let the pan settle.",
    "rules": "Complete three increasingly difficult rounds. Leaving the pocket too long or shaking until instability fills fails; you may retry.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 1002,
    "name": "Gold Panning Round Set 2",
    "objective": "Keep the gold marker inside its green pocket until each round finishes.",
    "howTo": "Tilt the pan using the slider, Left/Right controls or on-screen buttons. Tap Shake occasionally to clear sediment, then let the pan settle.",
    "rules": "Complete three increasingly difficult rounds. Leaving the pocket too long or shaking until instability fills fails; you may retry. Higher claim levels can add stronger currents or moving pockets; follow the live green marker.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 1003,
    "name": "Gold Panning Round Set 3",
    "objective": "Keep the gold marker inside its green pocket until each round finishes.",
    "howTo": "Tilt the pan using the slider, Left/Right controls or on-screen buttons. Tap Shake occasionally to clear sediment, then let the pan settle.",
    "rules": "Complete three increasingly difficult rounds. Leaving the pocket too long or shaking until instability fills fails; you may retry. Higher claim levels can add stronger currents or moving pockets; follow the live green marker.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 1004,
    "name": "Gold Panning Round Set 4",
    "objective": "Keep the gold marker inside its green pocket until each round finishes.",
    "howTo": "Tilt the pan using the slider, Left/Right controls or on-screen buttons. Tap Shake occasionally to clear sediment, then let the pan settle.",
    "rules": "Complete three increasingly difficult rounds. Leaving the pocket too long or shaking until instability fills fails; you may retry. Higher claim levels can add stronger currents or moving pockets; follow the live green marker.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 1005,
    "name": "Gold Panning Round Set 5",
    "objective": "Keep the gold marker inside its green pocket until each round finishes.",
    "howTo": "Tilt the pan using the slider, Left/Right controls or on-screen buttons. Tap Shake occasionally to clear sediment, then let the pan settle.",
    "rules": "Complete three increasingly difficult rounds. Leaving the pocket too long or shaking until instability fills fails; you may retry. Higher claim levels can add stronger currents or moving pockets; follow the live green marker.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 1006,
    "name": "Gold Panning Round Set 6",
    "objective": "Keep the gold marker inside its green pocket until each round finishes.",
    "howTo": "Tilt the pan using the slider, Left/Right controls or on-screen buttons. Tap Shake occasionally to clear sediment, then let the pan settle.",
    "rules": "Complete three increasingly difficult rounds. Leaving the pocket too long or shaking until instability fills fails; you may retry. Higher claim levels can add stronger currents or moving pockets; follow the live green marker.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 1007,
    "name": "Gold Panning Round Set 7",
    "objective": "Keep the gold marker inside its green pocket until each round finishes.",
    "howTo": "Tilt the pan using the slider, Left/Right controls or on-screen buttons. Tap Shake occasionally to clear sediment, then let the pan settle.",
    "rules": "Complete three increasingly difficult rounds. Leaving the pocket too long or shaking until instability fills fails; you may retry. Higher claim levels can add stronger currents or moving pockets; follow the live green marker.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 2001,
    "name": "Wire Winding",
    "objective": "Stop the spool pointer inside the highlighted winding window six times.",
    "howTo": "Watch the rotating marker. Tap WIND whenever it enters the target region, then prepare for the next pass.",
    "rules": "You need six accurate hits within nine total attempts; the target gradually becomes smaller.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2002,
    "name": "Cable Insulation Alignment",
    "objective": "Place three differently marked layers into their matching cable rings.",
    "howTo": "Select or drag a layer, then tap the ring with the same color or shape. Work from inner ring to outer ring if that helps you track placements.",
    "rules": "All three must match within thirty seconds. Three incorrect placements fail.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2003,
    "name": "Pipe Bending Pattern",
    "objective": "Make the four adjustable pipe curves match the reference drawings.",
    "howTo": "Compare the reference pipes above with the working pieces below. Rotate a curve or swap it into the next position as needed.",
    "rules": "Match both curve order and direction within twelve actions.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 2004,
    "name": "Copper Sheet Pressing",
    "objective": "Match the target thickness on five successive presses.",
    "howTo": "Read the displayed thickness target for the current round, adjust the Thickness slider, and tap PRESS to check.",
    "rules": "Each press must be within five units of its target; only two bad presses are allowed.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 2005,
    "name": "Cooling Tube Routing",
    "objective": "Build a sealed pipe route from IN to OUT.",
    "howTo": "Tap each pipe tile to rotate its openings. Follow the route from IN and check that all pipe ends connect correctly before testing.",
    "rules": "No disconnected pipe ends or leaks are allowed in the completed route.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2006,
    "name": "Motor Coil Winding",
    "objective": "Repeat the six glowing coil locations in the order shown.",
    "howTo": "Watch the six flashes without touching the grid, then tap the same positions in sequence once the input phase starts.",
    "rules": "Two sequence mistakes are tolerated; a further error fails.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2007,
    "name": "Transformer Coil Matching",
    "objective": "Share fifteen winding tokens between coils A, B and C.",
    "howTo": "Read the three requested winding amounts. Adjust each coil's value until it matches its target, then Submit.",
    "rules": "Use all fifteen tokens and match each requested amount exactly.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 2008,
    "name": "Wiring Harness Assembly",
    "objective": "Connect five labeled wires to their matching terminals.",
    "howTo": "Select or drag each wire, compare its label or symbol with the terminal labels, and place it on the correct one.",
    "rules": "All five matches are needed. Only two incorrect placements are tolerated.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2009,
    "name": "Stator Segment Alignment",
    "objective": "Restore six curved stator pieces to their numbered order and upright orientation.",
    "howTo": "Use Swap Adjacent to move pieces into positions one through six, then rotate each winding marker to point up.",
    "rules": "Finish within twelve allowed moves; order AND orientation must match.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 2010,
    "name": "Heat Exchanger Flow",
    "objective": "Build two separate sealed pipe paths across the board.",
    "howTo": "Rotate pipe tiles so the upper IN connects only to its upper OUT and the lower IN connects only to the lower OUT.",
    "rules": "The two routes may not cross, leak or leave unmatched ends.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 2011,
    "name": "Precision Connector Inspection",
    "objective": "Find the three connectors whose pins differ from the reference.",
    "howTo": "Study the reference connector, then inspect the twelve numbered drawings and tap the three with a visibly shorter pin.",
    "rules": "Only one incorrect selection is allowed. Choose differences, not ordinary matching connectors.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2012,
    "name": "Busbar Placement",
    "objective": "Bridge all four marked terminal pairs with the available bar pieces.",
    "howTo": "Select a bar, then tap the grid position where it should begin. Check its length against the row's start and end terminals.",
    "rules": "Each pair needs a continuous bar, with no overlapping bars; use at most ten placement actions.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2013,
    "name": "Cooling Module Calibration",
    "objective": "Hold all three fan readings inside their safe ranges.",
    "howTo": "Adjust fans A, B and C using their sliders. Watch the moving targets and correct readings that drift toward the edges.",
    "rules": "All three must remain in their target ranges for three seconds before instability reaches its limit.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 2014,
    "name": "Cable Network Sequencing",
    "objective": "Connect six modules in an order that respects their dependencies.",
    "howTo": "Read the prerequisite numbers shown on every cable module. Activate modules with no unmet requirements, then continue in order.",
    "rules": "Activate every module; at most two dependency mistakes are permitted.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 2015,
    "name": "Generator Phase Lock",
    "objective": "Stop three rotating pointers in their target sectors.",
    "howTo": "Watch the first spinning pointer and press its STOP control in the highlighted zone. Repeat separately for the other rotors.",
    "rules": "Lock all three pointers. Only two bad stops are allowed.",
    "visual": "Spotlight the animated reference first; show a harmless sample playback and then spotlight the response buttons without revealing the live pattern."
  },
  {
    "id": 2016,
    "name": "Transformer Core Assembly",
    "objective": "Fit six shapes inside the highlighted outline.",
    "howTo": "Select a core piece, rotate it with the Turn control, then tap the top-left placement square on the board.",
    "rules": "Fit every piece inside the outline without overlapping another, within fifteen actions.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2017,
    "name": "Grid Distribution Puzzle",
    "objective": "Allocate the available virtual power across the displayed load branches.",
    "howTo": "Use the branch sliders and read each branch's minimum and maximum. Check that the total uses the available pool correctly.",
    "rules": "Respect every minimum, maximum and the overall resource total; no more than three wrong validations.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 2018,
    "name": "Motor Shaft Alignment",
    "objective": "Line up two virtual shafts on both horizontal and vertical axes.",
    "howTo": "Adjust the four offsets: shaft A left-right/up-down and shaft B left-right/up-down. Watch all target readings.",
    "rules": "Keep both shafts within the shown alignment tolerance for two seconds.",
    "visual": "Spotlight the animated reference first; show a harmless sample playback and then spotlight the response buttons without revealing the live pattern."
  },
  {
    "id": 2019,
    "name": "Converter Frequency Control",
    "objective": "Match two frequency readings and one phase reading to the references.",
    "howTo": "Adjust Frequency A, Frequency B and Phase using their sliders. Compare each current value with its printed reference, then LOCK.",
    "rules": "All three must be within three units of their targets; three incorrect locks fail.",
    "visual": "Spotlight one control or slider, demonstrate a small adjustment, then spotlight its matching changing meter; reveal the goal band and hold requirement."
  },
  {
    "id": 2020,
    "name": "Substation Routing",
    "objective": "Connect four marked stations through a grid of cable spaces.",
    "howTo": "Tap passable squares to place or remove cable segments. Keep away from blocked squares and connect all station symbols.",
    "rules": "Use no more than sixteen cable pieces and verify the complete network.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2021,
    "name": "Generator Module Sequencing",
    "objective": "Activate six generator modules after their prerequisites are complete.",
    "howTo": "Read each module's incoming dependency arrows, start with eligible modules, and work forward until all are active.",
    "rules": "Activating a module too early is a mistake; only two are tolerated.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 2022,
    "name": "Continental Grid Planning",
    "objective": "Choose six links that connect the seven stations at acceptable total cost.",
    "howTo": "Tap connection options to turn them on or off. Compare their costs and check whether the entire set forms one connected grid.",
    "rules": "Use exactly six links, keep within the shown budget and connect all stations.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2023,
    "name": "Megaplant Conveyor Management",
    "objective": "Send twenty-five labeled items to their matching chutes.",
    "howTo": "Read the moving item's symbol and press chute 1, 2 or 3 before it reaches the dispatch point.",
    "rules": "A third wrong dispatch ends the stage.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 2024,
    "name": "Infrastructure Assembly Planner",
    "objective": "Pack the six shown schematic shapes into the grid.",
    "howTo": "Select a shape, rotate it if necessary and tap its intended top-left placement square. Check the marked pairs that must touch.",
    "rules": "Fit pieces inside the grid without overlaps and satisfy every required touching pair.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2025,
    "name": "Industrial Power Complex Finale",
    "objective": "Finish three linked industrial certification puzzles.",
    "howTo": "First connect the six-module power network. Next allocate its energy to four facilities. Finally synchronize the three moving indicators.",
    "rules": "Each section depends on the previous one. Stay within the shared mistake limit.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  },
  {
    "id": 2026,
    "name": "Precision Quality Scan",
    "objective": "Decide whether each of ten products matches the reference.",
    "howTo": "Compare the current product's connector drawing with the reference. Press PASS if it matches, or REWORK if it has a different pin.",
    "rules": "Classify at least nine of the ten products correctly.",
    "visual": "Spotlight the relevant key/button, animate a press on a practice example, then show the target region and failure boundary."
  },
  {
    "id": 2027,
    "name": "Production Optimization",
    "objective": "Schedule eight jobs on three machines before the deadline.",
    "howTo": "Select each job, read which lanes it can use, and place it into an open starting slot on one of those lanes.",
    "rules": "All jobs must fit before time eight without overlapping on a machine.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2028,
    "name": "Freight Container Packing",
    "objective": "Fit ten differently shaped cargo pieces into the container grid.",
    "howTo": "Select a piece, rotate it into a useful direction, then tap where its top-left corner should be placed.",
    "rules": "Every shape must fit completely inside the packing grid without overlapping another piece.",
    "visual": "Spotlight the first selectable object, show a harmless sample tap, then spotlight the affected object/result and the relevant mistake or move counter."
  },
  {
    "id": 2029,
    "name": "Supply Chain Synchronization",
    "objective": "Time five stations so each handoff arrives inside the next station's receiving window.",
    "howTo": "Adjust the five start offsets, watching the indicated travel times and target receiving windows.",
    "rules": "All handoffs must stay in their acceptable windows for three seconds.",
    "visual": "Spotlight the animated reference first; show a harmless sample playback and then spotlight the response buttons without revealing the live pattern."
  },
  {
    "id": 2030,
    "name": "Master Industrial Certification",
    "objective": "Pass three short challenges drawn from precision, logic and logistics.",
    "howTo": "Read the name and instructions of each currently presented challenge. Complete it, then follow the next section's separate controls.",
    "rules": "You must pass all three sections. This tutorial should show a new brief explanation when the challenge type changes.",
    "visual": "Spotlight the goal and the board, demonstrate the first harmless control action using a practice example, and show the visible limit indicator."
  }
];
