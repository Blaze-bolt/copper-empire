import {EXPANSION_CATALOGUE,EXPANSION_SIGNATURES} from './expansion-catalogue.js';
// Exact catalogue and signature descriptions from the supplied v4.0 specification.
const rows=[
  {
    "id": 1,
    "name": "Small DC Motor",
    "price": "0",
    "min": "500",
    "max": "2000",
    "level": 1,
    "rebirth": 0,
    "signature": 1
  },
  {
    "id": 2,
    "name": "USB Desk Fan",
    "price": "750000000",
    "min": "3000",
    "max": "8000",
    "level": 2,
    "rebirth": 0,
    "signature": 2
  },
  {
    "id": 3,
    "name": "Computer Cooling Fan",
    "price": "2000000000",
    "min": "8000",
    "max": "18000",
    "level": 4,
    "rebirth": 0,
    "signature": 3
  },
  {
    "id": 4,
    "name": "Old Speaker",
    "price": "4000000000",
    "min": "15000",
    "max": "30000",
    "level": 6,
    "rebirth": 0,
    "signature": 4
  },
  {
    "id": 5,
    "name": "Phone Vibration Motor",
    "price": "6000000000",
    "min": "25000",
    "max": "50000",
    "level": 1,
    "rebirth": 1,
    "signature": 5
  },
  {
    "id": 6,
    "name": "Portable Speaker",
    "price": "12000000000",
    "min": "50000",
    "max": "90000",
    "level": 3,
    "rebirth": 1,
    "signature": 6
  },
  {
    "id": 7,
    "name": "Laptop Cooling Assembly",
    "price": "20000000000",
    "min": "90000",
    "max": "160000",
    "level": 5,
    "rebirth": 1,
    "signature": 7
  },
  {
    "id": 8,
    "name": "Power Adapter",
    "price": "35000000000",
    "min": "150000",
    "max": "280000",
    "level": 8,
    "rebirth": 1,
    "signature": 8
  },
  {
    "id": 9,
    "name": "Desktop Power Supply",
    "price": "55000000000",
    "min": "250000",
    "max": "450000",
    "level": 1,
    "rebirth": 2,
    "signature": 9
  },
  {
    "id": 10,
    "name": "Electric Toothbrush Motor",
    "price": "85000000000",
    "min": "400000",
    "max": "700000",
    "level": 4,
    "rebirth": 2,
    "signature": 10
  },
  {
    "id": 11,
    "name": "Printer Motor Assembly",
    "price": "140000000000",
    "min": "650000",
    "max": "1100000",
    "level": 7,
    "rebirth": 2,
    "signature": 11
  },
  {
    "id": 12,
    "name": "Electric Drill Motor",
    "price": "220000000000",
    "min": "1000000",
    "max": "1800000",
    "level": 10,
    "rebirth": 2,
    "signature": 12
  },
  {
    "id": 13,
    "name": "Vacuum Cleaner Motor",
    "price": "350000000000",
    "min": "1700000",
    "max": "2800000",
    "level": 1,
    "rebirth": 3,
    "signature": 13
  },
  {
    "id": 14,
    "name": "Small Water Pump",
    "price": "550000000000",
    "min": "2600000",
    "max": "4500000",
    "level": 4,
    "rebirth": 3,
    "signature": 14
  },
  {
    "id": 15,
    "name": "Transformer Unit",
    "price": "850000000000",
    "min": "4000000",
    "max": "7000000",
    "level": 7,
    "rebirth": 3,
    "signature": 15
  },
  {
    "id": 16,
    "name": "Washing Machine Motor",
    "price": "1400000000000",
    "min": "6500000",
    "max": "11000000",
    "level": 11,
    "rebirth": 3,
    "signature": 16
  },
  {
    "id": 17,
    "name": "Dishwasher Motor",
    "price": "2100000000000",
    "min": "10000000",
    "max": "17000000",
    "level": 1,
    "rebirth": 4,
    "signature": 17
  },
  {
    "id": 18,
    "name": "Air Conditioner Motor",
    "price": "3500000000000",
    "min": "16000000",
    "max": "28000000",
    "level": 5,
    "rebirth": 4,
    "signature": 18
  },
  {
    "id": 19,
    "name": "Refrigerator Compressor",
    "price": "5500000000000",
    "min": "26000000",
    "max": "43000000",
    "level": 9,
    "rebirth": 4,
    "signature": 19
  },
  {
    "id": 20,
    "name": "Heavy Electric Pump",
    "price": "8500000000000",
    "min": "42000000",
    "max": "70000000",
    "level": 13,
    "rebirth": 4,
    "signature": 20
  },
  {
    "id": 21,
    "name": "Industrial Fan Motor",
    "price": "13000000000000",
    "min": "65000000",
    "max": "110000000",
    "level": 1,
    "rebirth": 5,
    "signature": 21
  },
  {
    "id": 22,
    "name": "Heavy-Duty Alternator",
    "price": "21000000000000",
    "min": "105000000",
    "max": "175000000",
    "level": 5,
    "rebirth": 5,
    "signature": 22
  },
  {
    "id": 23,
    "name": "Industrial Transformer",
    "price": "34000000000000",
    "min": "170000000",
    "max": "280000000",
    "level": 10,
    "rebirth": 5,
    "signature": 23
  },
  {
    "id": 24,
    "name": "Generator Stator",
    "price": "55000000000000",
    "min": "275000000",
    "max": "450000000",
    "level": 15,
    "rebirth": 5,
    "signature": 24
  },
  {
    "id": 25,
    "name": "Industrial Water Pump",
    "price": "85000000000000",
    "min": "430000000",
    "max": "700000000",
    "level": 1,
    "rebirth": 6,
    "signature": 25
  },
  {
    "id": 26,
    "name": "Elevator Motor",
    "price": "140000000000000",
    "min": "700000000",
    "max": "1150000000",
    "level": 6,
    "rebirth": 6,
    "signature": 26
  },
  {
    "id": 27,
    "name": "Factory Conveyor Motor",
    "price": "225000000000000",
    "min": "1100000000",
    "max": "1900000000",
    "level": 11,
    "rebirth": 6,
    "signature": 27
  },
  {
    "id": 28,
    "name": "Heavy Machinery Motor",
    "price": "370000000000000",
    "min": "1850000000",
    "max": "3000000000",
    "level": 16,
    "rebirth": 6,
    "signature": 28
  },
  {
    "id": 29,
    "name": "Industrial Power Generator",
    "price": "600000000000000",
    "min": "3000000000",
    "max": "5000000000",
    "level": 1,
    "rebirth": 7,
    "signature": 29
  },
  {
    "id": 30,
    "name": "Factory Recycling Machine",
    "price": "950000000000000",
    "min": "4800000000",
    "max": "8000000000",
    "level": 7,
    "rebirth": 7,
    "signature": 30
  },
  {
    "id": 31,
    "name": "Large Generator Assembly",
    "price": "1550000000000000",
    "min": "7800000000",
    "max": "13000000000",
    "level": 12,
    "rebirth": 7,
    "signature": 31
  },
  {
    "id": 32,
    "name": "Industrial Power Station Module",
    "price": "2500000000000000",
    "min": "12500000000",
    "max": "21000000000",
    "level": 18,
    "rebirth": 7,
    "signature": 32
  },
  {
    "id": 33,
    "name": "High-Capacity Generator",
    "price": "4000000000000000",
    "min": "20000000000",
    "max": "34000000000",
    "level": 1,
    "rebirth": 8,
    "signature": 33
  },
  {
    "id": 34,
    "name": "Automated Factory Motor Array",
    "price": "6500000000000000",
    "min": "32000000000",
    "max": "55000000000",
    "level": 7,
    "rebirth": 8,
    "signature": 34
  },
  {
    "id": 35,
    "name": "Heavy Industrial Power Unit",
    "price": "10500000000000000",
    "min": "52000000000",
    "max": "90000000000",
    "level": 13,
    "rebirth": 8,
    "signature": 35
  },
  {
    "id": 36,
    "name": "Mega Transformer Assembly",
    "price": "17000000000000000",
    "min": "85000000000",
    "max": "145000000000",
    "level": 19,
    "rebirth": 8,
    "signature": 36
  },
  {
    "id": 37,
    "name": "Giant Industrial Alternator",
    "price": "27000000000000000",
    "min": "135000000000",
    "max": "230000000000",
    "level": 1,
    "rebirth": 9,
    "signature": 37
  },
  {
    "id": 38,
    "name": "High-Output Generator Complex",
    "price": "44000000000000000",
    "min": "220000000000",
    "max": "375000000000",
    "level": 8,
    "rebirth": 9,
    "signature": 38
  },
  {
    "id": 39,
    "name": "Massive Motor Assembly",
    "price": "72000000000000000",
    "min": "360000000000",
    "max": "610000000000",
    "level": 14,
    "rebirth": 9,
    "signature": 39
  },
  {
    "id": 40,
    "name": "Automated Copper Recovery Plant",
    "price": "115000000000000000",
    "min": "575000000000",
    "max": "980000000000",
    "level": 20,
    "rebirth": 9,
    "signature": 40
  },
  {
    "id": 41,
    "name": "Ultra-Industrial Motor",
    "price": "185000000000000000",
    "min": "930000000000",
    "max": "1600000000000",
    "level": 1,
    "rebirth": 10,
    "signature": 41
  },
  {
    "id": 42,
    "name": "Advanced Generator Complex",
    "price": "300000000000000000",
    "min": "1500000000000",
    "max": "2600000000000",
    "level": 8,
    "rebirth": 10,
    "signature": 42
  },
  {
    "id": 43,
    "name": "Mega Recycling Assembly",
    "price": "480000000000000000",
    "min": "2400000000000",
    "max": "4100000000000",
    "level": 15,
    "rebirth": 10,
    "signature": 43
  },
  {
    "id": 44,
    "name": "Titan Generator System",
    "price": "780000000000000000",
    "min": "3900000000000",
    "max": "6700000000000",
    "level": 22,
    "rebirth": 10,
    "signature": 44
  },
  {
    "id": 45,
    "name": "Experimental Power Module",
    "price": "1250000000000000000",
    "min": "6300000000000",
    "max": "10700000000000",
    "level": 1,
    "rebirth": 11,
    "signature": 45
  },
  {
    "id": 46,
    "name": "Hyper-Industrial Generator",
    "price": "2000000000000000000",
    "min": "10000000000000",
    "max": "17000000000000",
    "level": 9,
    "rebirth": 11,
    "signature": 46
  },
  {
    "id": 47,
    "name": "Advanced Electromagnetic Array",
    "price": "3200000000000000000",
    "min": "16000000000000",
    "max": "27000000000000",
    "level": 16,
    "rebirth": 11,
    "signature": 47
  },
  {
    "id": 48,
    "name": "Experimental Copper Core",
    "price": "5200000000000000000",
    "min": "26000000000000",
    "max": "44000000000000",
    "level": 23,
    "rebirth": 11,
    "signature": 48
  },
  {
    "id": 49,
    "name": "Next-Generation Power Generator",
    "price": "8300000000000000000",
    "min": "41500000000000",
    "max": "70000000000000",
    "level": 1,
    "rebirth": 12,
    "signature": 49
  },
  {
    "id": 50,
    "name": "Ultra-Dense Motor Assembly",
    "price": "13500000000000000000",
    "min": "67500000000000",
    "max": "114000000000000",
    "level": 9,
    "rebirth": 12,
    "signature": 50
  },
  {
    "id": 51,
    "name": "Hyper-Scale Industrial Core",
    "price": "21500000000000000000",
    "min": "107500000000000",
    "max": "183000000000000",
    "level": 17,
    "rebirth": 12,
    "signature": 51
  },
  {
    "id": 52,
    "name": "Experimental Energy Converter",
    "price": "35000000000000000000",
    "min": "175000000000000",
    "max": "300000000000000",
    "level": 25,
    "rebirth": 12,
    "signature": 52
  }
];
export const SIGNATURES=[
  {
    "id": 1,
    "name": "Precision Timing",
    "device": "Small DC Motor",
    "spec": "A horizontal timing bar appears with a moving indicator and a green target zone.\nThe indicator travels continuously between the two ends.\nThe player presses Space, clicks, or taps to stop the indicator.\nWin: Stop the indicator inside the highlighted area.\nLose: Stop outside the target zone.\nStarting settings:\n\t•\tTarget width: 35% of the bar.\n\t•\tIndicator travel time: 2 seconds from end to end.\n\t•\tOne successful stop required.\n\t•\tNo overall time limit for the starter device.\nHigher difficulty versions use smaller targets, faster movement, or multiple stops."
  },
  {
    "id": 2,
    "name": "Fan Blade Alignment",
    "device": "USB Desk Fan",
    "spec": "Display a circular fan with several detachable, stylized blade shapes.\nA translucent target silhouette indicates where each blade belongs.\nPlayers drag blades into the correct positions around the centre.\nBlades may also need rotating using a rotate button.\nWin: All blades match the target positions and orientations.\nLose: The timer expires or the player submits too many incorrect placements.\nStart with three blades and a generous timer.\nHigher difficulties introduce more blades and different shapes."
  },
  {
    "id": 3,
    "name": "Rotor Balance",
    "device": "Computer Cooling Fan",
    "spec": "Display an abstract rotating disc divided into equally spaced segments.\nSome segments contain movable virtual weights.\nA visual balance meter indicates whether the distribution is balanced.\nPlayers move weights between segments.\nWin: Reduce the balance error below the target threshold.\nLose: Run out of time or adjustment moves.\nUse a simplified mathematical balance model, not real motor-servicing procedures.\nGenerate puzzles with known solutions."
  },
  {
    "id": 4,
    "name": "Sound Wave Matching",
    "device": "Old Speaker",
    "spec": "Show two animated waveforms.\nThe reference waveform is displayed in one colour and the player’s waveform in another.\nPlayers adjust amplitude, frequency, and phase using sliders.\nWin: Achieve at least 90% waveform similarity for two continuous seconds.\nLose: The timer expires before reaching the required accuracy.\nDifficulty increases through additional parameters and stricter tolerance."
  },
  {
    "id": 5,
    "name": "Vibration Pattern Memory",
    "device": "Phone Vibration Motor",
    "spec": "Display a sequence of short and long pulses using an animated indicator.\nThe player watches and then reproduces the sequence using a single button.\nShort taps represent short pulses; holding represents long pulses.\nWin: Reproduce the complete pattern within the allowed timing tolerance.\nLose: Enter an incorrect pulse or exceed the timer.\nMake the interaction work without actual device vibration hardware."
  },
  {
    "id": 6,
    "name": "Frequency Slider Puzzle",
    "device": "Portable Speaker",
    "spec": "Multiple sliders control fictional frequency bands.\nA target frequency profile appears above the sliders.\nPlayers adjust individual bands to match the displayed target.\nWin: Every slider reaches its allowed target tolerance.\nLose: Time expires.\nUnlike Sound Wave Matching, this is a discrete multi-band profile-matching puzzle rather than a continuous waveform comparison."
  },
  {
    "id": 7,
    "name": "Airflow Maze",
    "device": "Laptop Cooling Assembly",
    "spec": "Display a grid containing a starting airflow icon, an endpoint, and rotating directional tiles.\nPlayers rotate tiles to guide animated airflow through the maze.\nWin: Create a continuous valid path to the destination.\nLose: Reach the move limit or run out of time.\nAdd one-way tiles and obstacles at higher difficulties."
  },
  {
    "id": 8,
    "name": "Circuit Tile Rotation",
    "device": "Power Adapter",
    "spec": "Display a fictional grid of circuit tiles, each containing a straight, curved, or branching path.\nPlayers rotate tiles by clicking them.\nThe objective is to connect a glowing start node to an end node.\nWin: A valid uninterrupted path exists between the two nodes.\nLose: The timer expires.\nThe puzzle must not contain real electrical wiring instructions. All grids must be solvable."
  },
  {
    "id": 9,
    "name": "Symbol Matching",
    "device": "Desktop Power Supply",
    "spec": "Display a target abstract symbol at the top of the screen.\nMultiple symbols move across the bottom.\nPlayers must select all copies of the target symbol and ignore others.\nWin: Correctly identify the required number of matching symbols.\nLose: Make too many incorrect selections or allow too many targets to disappear.\nDifficulty increases through movement speed, visual similarity, and target count."
  },
  {
    "id": 10,
    "name": "Rotating Gear Puzzle",
    "device": "Electric Toothbrush Motor",
    "spec": "Display several interconnected gears with coloured orientation markers.\nTurning one gear affects its neighbouring gears.\nThe player must determine a sequence of rotations that brings all markers into alignment.\nWin: Every marker aligns with its target.\nLose: Exceed the move limit.\nGenerate puzzle states by scrambling a valid target configuration."
  },
  {
    "id": 11,
    "name": "Conveyor Component Sorting",
    "device": "Printer Motor Assembly",
    "spec": "Components travel along an animated conveyor belt.\nSeveral labelled collection bins appear underneath.\nPlayers drag or tap components into their corresponding bins.\nWin: Sort the required number correctly.\nLose: Make too many sorting errors or miss too many components.\nIncrease conveyor speed and introduce additional categories with difficulty."
  },
  {
    "id": 12,
    "name": "Precision Path Tracing",
    "device": "Electric Drill Motor",
    "spec": "A glowing abstract path appears on the screen.\nPlayers drag their cursor along the path, starting at one end.\nWin: Reach the endpoint while maintaining sufficient path accuracy.\nLose: Stray too far outside the path or exceed the timer.\nIncrease difficulty using curved paths, narrow corridors, and moving visual distractions.\nThis must be an arcade tracing game, not a real cutting or drilling tutorial."
  },
  {
    "id": 13,
    "name": "Suction Direction Puzzle",
    "device": "Vacuum Cleaner Motor",
    "spec": "Display a grid of directional arrow tiles and several coloured particles.\nPlayers rotate arrows to create paths from particle starting positions to matching collection zones.\nWin: Every particle reaches its correct destination.\nLose: A particle enters an invalid zone or the timer expires.\nHigher difficulty introduces multiple particle colours and intersecting routes."
  },
  {
    "id": 14,
    "name": "Flow Network Puzzle",
    "device": "Small Water Pump",
    "spec": "Display a fictional pipe network with branching routes and coloured flow tokens.\nPlayers toggle gates to direct each token to its matching destination.\nWin: Deliver the required tokens correctly without exceeding the available moves.\nLose: Route a token incorrectly or run out of moves.\nThis differs from Airflow Maze because players coordinate several simultaneous flows rather than creating one continuous path."
  },
  {
    "id": 15,
    "name": "Magnetic Polarity Logic",
    "device": "Transformer Unit",
    "spec": "Display coloured blocks with abstract positive and negative symbols.\nPlayers arrange blocks on a grid according to stated attraction and repulsion rules.\nWin: Every block satisfies the puzzle’s placement constraints.\nLose: Submit an invalid arrangement too many times or exceed the timer.\nThis is a fictional spatial logic challenge. Do not teach real transformer disassembly or electrical testing."
  },
  {
    "id": 16,
    "name": "Spin Cycle Rhythm",
    "device": "Washing Machine Motor",
    "spec": "Display circular rhythm tracks with markers approaching a timing line.\nPlayers tap when each marker crosses the line.\nWin: Achieve the minimum accuracy across the complete rhythm pattern.\nLose: Miss too many notes or fall below the required score.\nSupport keyboard and touchscreen input.\nDifficulty increases through tempo and complex patterns."
  },
  {
    "id": 17,
    "name": "Pipe Connection Puzzle",
    "device": "Dishwasher Motor",
    "spec": "Display a set of movable pipe-shaped puzzle pieces and fixed connection points.\nPlayers drag the pieces onto a grid to form the correct shape.\nWin: Create a connected route using exactly the required pieces.\nLose: Exceed the available placements or timer.\nUnlike Flow Network, this is a spatial placement puzzle requiring the player to construct the layout from separate shapes."
  },
  {
    "id": 18,
    "name": "Temperature Balance",
    "device": "Air Conditioner Motor",
    "spec": "Display two fictional temperature-style meters and a shared balancing control.\nAdjusting one meter also affects the other.\nPlayers must determine the correct settings to bring both meters into their highlighted zones simultaneously.\nWin: Maintain both virtual indicators inside their zones for three seconds.\nLose: Time expires.\nUse arbitrary arcade units instead of actual operational temperatures."
  },
  {
    "id": 19,
    "name": "Pressure Stability",
    "device": "Refrigerator Compressor",
    "spec": "A virtual gauge fluctuates unpredictably but within a known movement pattern.\nPlayers use two controls to push the gauge upward or downward.\nWin: Keep the indicator inside the target zone for the required duration.\nLose: Remain outside the permitted game zone for too long.\nUnlike Temperature Balance, this is a continuous reaction and stability challenge with one moving indicator."
  },
  {
    "id": 20,
    "name": "Valve Sequence Memory",
    "device": "Heavy Electric Pump",
    "spec": "Display a group of numbered, fictional valve icons.\nThe icons light up in a sequence.\nPlayers must repeat the sequence by clicking them in the correct order.\nWin: Complete the entire sequence.\nLose: Select an incorrect icon.\nHigher difficulty introduces longer sequences and temporary changes to icon positions."
  },
  {
    "id": 21,
    "name": "Moving Target Challenge",
    "device": "Industrial Fan Motor",
    "spec": "Several circular targets move across the screen.\nPlayers click the highlighted targets while ignoring differently coloured decoys.\nWin: Reach the required number of correct hits.\nLose: Make too many mistakes or run out of time.\nDifficulty affects target speed, size, and overlapping movement."
  },
  {
    "id": 22,
    "name": "Power Output Matching",
    "device": "Heavy-Duty Alternator",
    "spec": "Display a target output curve over time.\nPlayers adjust fictional output controls to reproduce the curve using a series of discrete settings.\nWin: The resulting output curve stays within the allowed error tolerance.\nLose: The overall error exceeds the limit after submission.\nUnlike Sound Wave Matching, this is a planning puzzle using a sequence of fixed output values rather than live signal sliders."
  },
  {
    "id": 23,
    "name": "Dual Circuit Synchronisation",
    "device": "Industrial Transformer",
    "spec": "Display two independent circuit tile grids.\nPlayers must solve both paths, but rotating certain linked tiles in one grid changes corresponding tiles in the other.\nWin: Both circuits are connected simultaneously.\nLose: Exceed the move or time limit.\nEnsure all generated puzzles have valid solutions."
  },
  {
    "id": 24,
    "name": "Coil Pattern Reconstruction",
    "device": "Generator Stator",
    "spec": "Display a circular pattern made from coloured abstract segments.\nThe completed target appears briefly before segments are scrambled.\nPlayers rotate and swap segments to recreate the target.\nWin: Reconstruct the entire circular pattern.\nLose: Exceed the move limit or timer.\nThis is a visual arrangement puzzle, not a real winding or electrical assembly procedure."
  },
  {
    "id": 25,
    "name": "Multi-Channel Flow",
    "device": "Industrial Water Pump",
    "spec": "Display multiple lanes containing coloured tokens travelling toward junctions.\nPlayers switch junction directions while the tokens move.\nWin: Every token reaches its assigned destination.\nLose: Too many tokens enter incorrect routes.\nUnlike the static Flow Network puzzle, this happens in real time and requires quick decisions."
  },
  {
    "id": 26,
    "name": "Elevator Positioning",
    "device": "Elevator Motor",
    "spec": "Display a vertical shaft with a moving platform and several target stopping points.\nPlayers control acceleration and braking using simple buttons.\nWin: Stop accurately at the required target positions in sequence.\nLose: Overshoot too far, stop at the wrong position, or exceed the time limit.\nUse simplified fictional movement physics."
  },
  {
    "id": 27,
    "name": "Factory Conveyor Coordination",
    "device": "Factory Conveyor Motor",
    "spec": "Display three conveyor belts that move objects toward shared junctions.\nPlayers change belt speeds and junction directions to prevent objects from colliding.\nWin: Successfully transport the required number of objects.\nLose: Exceed the permitted collision or missed-object count.\nDifficulty increases through faster belts and more junctions."
  },
  {
    "id": 28,
    "name": "Load Distribution Puzzle",
    "device": "Heavy Machinery Motor",
    "spec": "Display a platform divided into multiple areas and a collection of differently weighted blocks.\nPlayers drag blocks onto the platform.\nA visual indicator displays the centre of balance.\nWin: Keep the virtual centre of balance inside the target region while placing all required blocks.\nLose: Exceed the move limit or submit an invalid arrangement.\nUse abstract puzzle weights, not real industrial lifting instructions."
  },
  {
    "id": 29,
    "name": "Energy Routing",
    "device": "Industrial Power Generator",
    "spec": "Display a branching network of fictional energy nodes.\nPlayers activate paths while staying within a limited energy budget.\nWin: Power every required target node without exceeding the budget.\nLose: Exceed the available energy or move limit.\nThis is a graph-navigation puzzle with resource management."
  },
  {
    "id": 30,
    "name": "Recycling Assembly Line",
    "device": "Factory Recycling Machine",
    "spec": "Display an animated virtual factory with three processing stations.\nPlayers assign incoming coloured materials to the correct stations and control the order of processing.\nWin: Complete the requested number of finished batches.\nLose: Too many batches are processed in the wrong order or the timer expires.\nThis should combine scheduling and sorting, not simply repeat the earlier conveyor challenge."
  },
  {
    "id": 31,
    "name": "Multi-Rotor Synchronisation",
    "device": "Large Generator Assembly",
    "spec": "Display several rotating discs with separate speeds and orientation markers.\nPlayers can speed up, slow down, or temporarily pause individual discs.\nWin: Align all discs at the same synchronization moment.\nLose: Run out of adjustment opportunities.\nHigher difficulties introduce more rotors and complex speed ratios."
  },
  {
    "id": 32,
    "name": "Power Grid Restoration",
    "device": "Industrial Power Station Module",
    "spec": "Display a fictional grid of disconnected energy nodes.\nPlayers select which connections to restore while avoiding overloaded abstract nodes.\nWin: Restore all required connections within the available capacity budget.\nLose: Exceed the budget or move limit.\nThis is a strategy puzzle, not real power-grid maintenance instruction."
  },
  {
    "id": 33,
    "name": "Precision Frequency Lock",
    "device": "High-Capacity Generator",
    "spec": "Display an oscillating target frequency marker and a player-controlled marker.\nPlayers use small directional inputs to match the target as it moves.\nWin: Stay within the allowed tolerance for the required duration.\nLose: Time expires or the mismatch remains too large.\nThis differs from frequency slider matching because the target changes continuously."
  },
  {
    "id": 34,
    "name": "Factory Robot Programming",
    "device": "Automated Factory Motor Array",
    "spec": "Display a simple grid with a fictional robot, obstacles, and collection targets.\nPlayers assemble instructions using visual command blocks such as Move, Turn, Repeat, and Collect.\nWin: The robot collects all targets and reaches the exit.\nLose: The instruction program runs out of moves or enters an invalid position.\nThis must function as a visual programming puzzle."
  },
  {
    "id": 35,
    "name": "Stability Matrix",
    "device": "Heavy Industrial Power Unit",
    "spec": "Display a grid of values that change when neighbouring cells are selected.\nPlayers must bring all cells into a specified target range.\nWin: Every cell satisfies its target condition simultaneously.\nLose: Run out of moves.\nUse a deterministic mathematical matrix puzzle with guaranteed solvability."
  },
  {
    "id": 36,
    "name": "Magnetic Field Maze",
    "device": "Mega Transformer Assembly",
    "spec": "Display a board containing coloured virtual magnetic zones.\nPlayers move a token through the board by placing or rotating abstract field icons.\nWin: Guide the token to the destination.\nLose: Enter a forbidden tile or exceed the move limit.\nThis is a turn-based spatial planning challenge, not a real electromagnetic equipment simulation."
  },
  {
    "id": 37,
    "name": "Alternating Pulse Sequence",
    "device": "Giant Industrial Alternator",
    "spec": "Two rows of pulse indicators move toward timing markers.\nPlayers alternate between left and right inputs to match the required rhythm.\nWin: Achieve the required accuracy on both lanes.\nLose: Miss too many pulses.\nUnlike the earlier Spin Cycle Rhythm, this challenge explicitly tests alternating-hand coordination and simultaneous lane awareness."
  },
  {
    "id": 38,
    "name": "Generator Network Puzzle",
    "device": "High-Output Generator Complex",
    "spec": "Display a network graph with several fictional generators and demand nodes.\nPlayers decide which nodes to activate and where to route limited energy tokens.\nWin: Satisfy every demand node while staying within available token production.\nLose: Exceed the supply or connection budget.\nUnlike basic Energy Routing, this introduces multiple sources and differing node demands."
  },
  {
    "id": 39,
    "name": "Rotational Momentum Challenge",
    "device": "Massive Motor Assembly",
    "spec": "Display a large virtual disc with momentum-based motion.\nPlayers apply short impulses to guide it toward a target orientation.\nWin: Stop the disc within the target angle and speed tolerance.\nLose: Exceed the permitted impulses or timer.\nThe simplified physics should be predictable and responsive."
  },
  {
    "id": 40,
    "name": "Automated Recovery Scheduling",
    "device": "Automated Copper Recovery Plant",
    "spec": "Display several fictional processing jobs, each with a duration and resource requirement.\nPlayers drag jobs onto a timeline containing limited processing slots.\nWin: Schedule all required jobs within the available time and capacity.\nLose: Submit a schedule that exceeds capacity or fails to complete the jobs.\nThis is a scheduling optimization puzzle, not a real recovery or chemical-processing guide."
  },
  {
    "id": 41,
    "name": "Ultra-Precision Alignment",
    "device": "Ultra-Industrial Motor",
    "spec": "Display several concentric rings with small alignment markers.\nPlayers rotate the rings independently.\nWin: Align all markers simultaneously within a very small tolerance.\nLose: Exceed the adjustment limit or timer.\nDifficulty increases through linked ring movement and narrower tolerances."
  },
  {
    "id": 42,
    "name": "Multi-Generator Synchronization",
    "device": "Advanced Generator Complex",
    "spec": "Display several virtual generator output bars that oscillate at different rates.\nPlayers adjust virtual timing offsets until the bars synchronize.\nWin: Keep every bar within the target synchronization window simultaneously.\nLose: Timer expires.\nUnlike Multi-Rotor Synchronisation, the player adjusts timing offsets rather than directly changing rotation speeds."
  },
  {
    "id": 43,
    "name": "Resource Optimization",
    "device": "Mega Recycling Assembly",
    "spec": "Players receive fictional resource tokens and a selection of processing recipes.\nEvery recipe consumes and produces different quantities of tokens.\nWin: Produce the requested final resources without exceeding the available inputs.\nLose: Reach a state where the target is impossible or run out of actions.\nGenerate challenges with at least one valid solution and allow a clear restart."
  },
  {
    "id": 44,
    "name": "Titan Core Sequence",
    "device": "Titan Generator System",
    "spec": "Display a series of linked puzzle panels.\nEach solved panel reveals a symbol needed for the next panel.\nPlayers must use previously discovered symbols to determine a final code.\nWin: Solve every panel and enter the correct final code.\nLose: Exceed the time or incorrect-entry limit.\nThis tests deduction and retaining information across stages."
  },
  {
    "id": 45,
    "name": "Experimental Pattern Decoder",
    "device": "Experimental Power Module",
    "spec": "Display a fictional language of geometric symbols governed by a few visible rules.\nPlayers examine examples and determine the meaning of new symbol combinations.\nWin: Decode the required message correctly.\nLose: Exceed the number of incorrect attempts.\nAll puzzle rules must be internally consistent and logically deducible."
  },
  {
    "id": 46,
    "name": "Hyper-Speed Reflex Grid",
    "device": "Hyper-Industrial Generator",
    "spec": "Display a grid containing targets that briefly light up.\nPlayers must select targets in the correct order while the active positions change.\nWin: Complete the required number of rounds with sufficient accuracy.\nLose: Make too many mistakes.\nUnlike basic target clicking, this requires remembering target order while responding quickly.\nProvide reasonable minimum reaction windows for accessibility."
  },
  {
    "id": 47,
    "name": "Electromagnetic Logic Gates",
    "device": "Advanced Electromagnetic Array",
    "spec": "Display a fictional logic network with abstract AND, OR, and NOT gates.\nPlayers can change selected inputs and rearrange allowed gate connections.\nWin: Produce the displayed target output pattern.\nLose: Exceed the move limit or submit an invalid configuration.\nThe puzzle should use conventional Boolean logic but not instruct players about real electrical installation."
  },
  {
    "id": 48,
    "name": "Experimental Core Stabilization",
    "device": "Experimental Copper Core",
    "spec": "Display three linked fictional stability indicators.\nEvery adjustment changes more than one indicator.\nPlayers must find a configuration that brings all indicators into their target zones.\nWin: Maintain all three inside their target ranges for several seconds.\nLose: Timer expires.\nUnlike the two-meter Temperature Balance challenge, this uses three coupled parameters with nonlinear but predictable relationships."
  },
  {
    "id": 49,
    "name": "Multi-Dimensional Energy Routing",
    "device": "Next-Generation Power Generator",
    "spec": "Display several layers of a fictional network graph.\nPlayers may move between layers using special portal nodes.\nWin: Route every energy token to its designated destination across all layers.\nLose: Exceed the move or energy budget.\nCreate a solution validator and generate only solvable instances."
  },
  {
    "id": 50,
    "name": "Ultra-Dense Pattern Compression",
    "device": "Ultra-Dense Motor Assembly",
    "spec": "Display a large coloured symbol grid and a limited library of reusable pattern blocks.\nPlayers must represent the grid using as few blocks as possible.\nWin: Reconstruct the entire grid within the available block budget.\nLose: Exceed the block budget or timer.\nThis is a spatial compression puzzle requiring recognition of repeated patterns."
  },
  {
    "id": 51,
    "name": "Hyper-Scale Command Center",
    "device": "Hyper-Scale Industrial Core",
    "spec": "Display several simultaneous abstract factory systems.\nEach system presents scheduled tasks and occasional alerts.\nPlayers must prioritize actions, assign limited resources, and prevent the systems from exceeding their limits.\nWin: Complete the required production objectives while maintaining all systems.\nLose: Too many objectives expire or resources are misallocated.\nThis is a real-time resource-management challenge, distinct from the static scheduling puzzle."
  },
  {
    "id": 52,
    "name": "Experimental Energy Converter Challenge",
    "device": "Experimental Energy Converter",
    "spec": "This must be the most complex signature minigame currently available, but NOT the final challenge of the entire game.\nDisplay an interconnected abstract conversion network containing:\n\t•\tResource tokens.\n\t•\tLogic switches.\n\t•\tRotating pathway tiles.\n\t•\tLimited-capacity nodes.\n\t•\tTiming windows.\n\t•\tOutput targets.\nPlayers must configure the network, route the correct tokens, and trigger the conversion sequence at the appropriate moment.\nWin: Produce all required target outputs while respecting the resource budget, route constraints, and timing windows.\nLose: Exceed the resource budget, make an invalid conversion, or run out of time.\nThis minigame combines logic, planning, and timing into one coherent mechanic.\nIt must have its own proper interface and objective rather than simply playing other minigames in sequence."
  }
];
SIGNATURES.push(...EXPANSION_SIGNATURES);
export const TIERS=['Beginner','Easy','Normal','Hard','Expert','Master','Extreme'];
export const CATALOGUE=rows.map(d=>({...d,price:BigInt(d.price),min:BigInt(d.min),max:BigInt(d.max),xp:30+d.rebirth*90+((d.id-1)%4)*25,difficulty:Math.min(6,Math.floor((d.id-1)/8)),tier:TIERS[Math.min(6,Math.floor((d.id-1)/8))],category:['Beginner devices','Compact electronics','Home electronics','Household machinery','Heavy domestic equipment','Industrial foundations','Large machinery','Factory-scale systems','Advanced industrial systems','Massive electrical systems','Gigantic recycling technology','Experimental technology','Next-generation technology'][d.rebirth],stageCount:d.id<=4?(d.id<=2?1:2):d.id<=8?(d.id<=6?2:3):d.id<=16?(d.id<=12?3:4):d.id<=24?(d.id<=20?4:5):d.id<=32?(d.id<=28?5:6):d.id<=40?6+Math.floor((d.id-33)/3):8+Math.floor((d.id-41)/4)}));
CATALOGUE.push(...EXPANSION_CATALOGUE);
export const deviceById=id=>CATALOGUE.find(d=>d.id===Number(id));
