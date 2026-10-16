export const DEVICES = [
  { id: 'motor', name: 'Small electric motor', short: 'Electric motor', tier: 'Beginner', level: 1, reward: 40, xp: 25, cost: 0, challenges: ['timing'], description: 'Small in size. Full of possibility.', tag: 'A great place to start', color: '#73958c' },
  { id: 'fan', name: 'Desktop fan', short: 'Desktop fan', tier: 'Easy', level: 2, reward: 75, xp: 45, cost: 18, challenges: ['timing', 'circuit'], description: 'Give an old favorite a fresh purpose.', tag: 'Find your rhythm', color: '#92aabc' },
  { id: 'supply', name: 'Old power supply', short: 'Power supply', tier: 'Medium', level: 3, reward: 125, xp: 75, cost: 35, challenges: ['circuit', 'memory', 'assembly'], description: 'A little logic goes a long way.', tag: 'Put your mind to work', color: '#b8aa89' },
  { id: 'washer', name: 'Washing machine motor', short: 'Washer motor', tier: 'Hard', level: 4, reward: 200, xp: 110, cost: 65, challenges: ['timing', 'circuit', 'memory', 'assembly'], description: 'A bigger challenge. A better haul.', tag: 'For steady hands', color: '#7e8d9b' },
  { id: 'industrial', name: 'Industrial motor', short: 'Industrial motor', tier: 'Expert', level: 5, reward: 320, xp: 170, cost: 110, challenges: ['timing', 'circuit', 'memory', 'assembly', 'timing'], description: 'The crown jewel of the salvage yard.', tag: 'Make every move count', color: '#c78b62' },
];
export const UPGRADES = [
  { id: 'precision', name: 'Precision tools', icon: 'tools', cost: 65, text: 'A wider sweet spot.', detail: 'Makes every timing target 35% wider.' },
  { id: 'scanner', name: 'Puzzle scanner', icon: 'scan', cost: 80, text: 'See the connection.', detail: 'Highlights a useful, incorrectly rotated circuit tile.' },
  { id: 'memory', name: 'Memory assistant', icon: 'brain', cost: 90, text: 'A second look helps.', detail: 'Replay the glowing sequence once per memory challenge.' },
  { id: 'time', name: 'Time extension', icon: 'timer', cost: 100, text: 'A little breathing room.', detail: 'Adds 15 seconds to every timed challenge.' },
  { id: 'workshop', name: 'Advanced workshop', icon: 'workshop', cost: 230, text: 'Work smarter. Go further.', detail: 'Removes one challenge from Medium, Hard, and Expert devices.' },
];
export const CHALLENGES = { timing: { name: 'Precision timing', icon: 'target', verb: 'Find the sweet spot' }, circuit: { name: 'Circuit puzzle', icon: 'circuit', verb: 'Make the connection' }, memory: { name: 'Memory sequence', icon: 'brain', verb: 'Follow the pattern' }, assembly: { name: 'Component match', icon: 'component', verb: 'Everything in its place' } };
export const defaultState = () => ({ version: 1, copper: 120, xp: 0, recovered: 0, completed: 0, bestGrade: null, rare: 0, inventory: { motor: 3, fan: 2, supply: 1, washer: 1, industrial: 1 }, upgrades: [], history: [], sound: true, motion: true });
export function loadState(storage) {
  try {
    const value = JSON.parse(storage.getItem('copperworks-save'));
    if (!value || value.version !== 1) return defaultState();
    const state = { ...defaultState(), ...value };
    for (const key of ['copper', 'xp', 'recovered', 'completed', 'rare']) if (!Number.isFinite(state[key]) || state[key] < 0) return defaultState();
    state.inventory = Object.fromEntries(DEVICES.map(d => [d.id, Math.max(0, Math.floor(Number(value.inventory?.[d.id]) || 0))]));
    state.upgrades = Array.isArray(value.upgrades) ? value.upgrades.filter(id => UPGRADES.some(u => u.id === id)) : [];
    state.bestGrade = ['S','A','B','C'].includes(state.bestGrade) ? state.bestGrade : null;
    state.sound = state.sound !== false; state.motion = state.motion !== false;
    state.history = Array.isArray(value.history) ? value.history.slice(0, 30).filter(x => DEVICES.some(d => d.id === x.device) && ['S','A','B','C'].includes(x.grade) && Number.isFinite(x.copper) && Number.isFinite(x.at)) : [];
    return state;
  } catch { return defaultState(); }
}
export const requiredChallenges = (device, upgrades) => upgrades.includes('workshop') && device.level >= 3 ? device.challenges.slice(0, -1) : [...device.challenges];
export function createAttempt(device, upgrades) { return { device, challenges: requiredChallenges(device, upgrades), index: 0, scores: [], status: 'active', paid: false }; }
export function passChallenge(attempt, score) {
  if (attempt.status !== 'active') return false;
  attempt.scores.push(Math.max(0, Math.min(1, score)));
  attempt.index++;
  attempt.status = attempt.index === attempt.challenges.length ? 'complete' : 'between';
  return true;
}
export function failAttempt(attempt) { if (attempt.status !== 'active') return false; attempt.status = 'failed'; attempt.index = 0; attempt.scores = []; return true; }
export function claimReward(state, attempt, rng = Math.random) {
  if (attempt.status !== 'complete' || attempt.paid || attempt.scores.length !== attempt.challenges.length || !state.inventory[attempt.device.id]) return null;
  const score = attempt.scores.reduce((a, b) => a + b, 0) / attempt.scores.length;
  const grade = score >= .97 ? 'S' : score >= .83 ? 'A' : score >= .65 ? 'B' : 'C';
  const bonus = { S: .15, A: .10, B: .05, C: 0 }[grade];
  const copper = Math.round(attempt.device.reward * (1 + bonus));
  const rare = rng() < .12;
  attempt.paid = true;
  state.inventory[attempt.device.id]--;
  state.copper += copper; state.recovered += copper; state.xp += attempt.device.xp; state.completed++; state.rare += Number(rare);
  if (!state.bestGrade || 'SABC'.indexOf(grade) < 'SABC'.indexOf(state.bestGrade)) state.bestGrade = grade;
  const result = { device: attempt.device.id, grade, copper, base: attempt.device.reward, extra: copper - attempt.device.reward, xp: attempt.device.xp, rare, at: Date.now() };
  state.history.unshift(result); state.history = state.history.slice(0, 30);
  return result;
}
export function buyUpgrade(state, id) {
  const upgrade = UPGRADES.find(u => u.id === id);
  if (!upgrade || state.upgrades.includes(id) || state.copper < upgrade.cost) return false;
  state.copper -= upgrade.cost; state.upgrades.push(id); return true;
}
export const rotate = (mask, turns = 1) => { for (let i = 0; i < (turns % 4); i++) mask = ((mask << 1) & 15) | ((mask >> 3) & 1); return mask; };
const directions = [{ dr: -1, dc: 0, bit: 1, opposite: 4 }, { dr: 0, dc: 1, bit: 2, opposite: 8 }, { dr: 1, dc: 0, bit: 4, opposite: 1 }, { dr: 0, dc: -1, bit: 8, opposite: 2 }];
export function generateCircuit(size, rng = Math.random) {
  // A monotone path guarantees a solution and remains readable at every size.
  const path = [0]; let r = 0, c = 0;
  while (r < size - 1 || c < size - 1) {
    if (r === size - 1 || (c < size - 1 && rng() > .5)) c++; else r++;
    path.push(r * size + c);
  }
  const solution = Array(size * size).fill(0); solution[0] |= 8;
  solution[size * size - 1] |= 2;
  for (let p = 0; p < path.length - 1; p++) {
    const a = path[p], b = path[p + 1];
    if (b - a === 1) { solution[a] |= 2; solution[b] |= 8; } else { solution[a] |= 4; solution[b] |= 1; }
  }
  const pathSet = new Set(path);
  const blocked = new Set();
  const masks = solution.map((mask, i) => {
    if (mask) return rotate(mask, Math.floor(rng() * 4));
    if (size === 5 && rng() < .38) { blocked.add(i); return 0; }
    return rotate(rng() > .5 ? 3 : 5, Math.floor(rng() * 4));
  });
  if (circuitConnected({ size, masks })) masks[0] = rotate(masks[0]);
  return { size, masks, solution, path, pathSet, blocked, turns: 0, minimum: path.length };
}
export function circuitConnected({ size, masks }) {
  if (!(masks[0] & 8) || !(masks.at(-1) & 2)) return false;
  const seen = new Set([0]), queue = [0];
  while (queue.length) {
    const i = queue.shift(); if (i === size * size - 1) return true;
    const r = Math.floor(i / size), c = i % size;
    for (const d of directions) {
      const nr = r + d.dr, nc = c + d.dc, ni = nr * size + nc;
      if (nr >= 0 && nc >= 0 && nr < size && nc < size && !seen.has(ni) && (masks[i] & d.bit) && (masks[ni] & d.opposite)) { seen.add(ni); queue.push(ni); }
    }
  }
  return false;
}
export function circuitUsefulTile(puzzle) { return puzzle.path.find(i => puzzle.masks[i] !== puzzle.solution[i]); }
export const SYMBOLS = ['sun', 'diamond', 'wave', 'triangle', 'moon', 'star'];
export function generateMemory(level, rng = Math.random) { const count = Math.min(6, 3 + Math.floor(level / 2)); return { symbols: SYMBOLS.slice(0, count), sequence: Array.from({ length: level + 2 }, () => Math.floor(rng() * count)) }; }
export function timingConfig(level, upgrades) { return { width: (.29 - level * .029) * (upgrades.includes('precision') ? 1.35 : 1), speed: .40 + level * .075, hits: level >= 4 ? 3 : level >= 2 ? 2 : 1 }; }
export function timingHit(position, center, width) { return Math.abs(position - center) <= width / 2; }


export function challengeDuration(type, level, upgrades = []) { const extra = upgrades.includes("time") ? 15 : 0; if (type === "timing") return 25 + level * 5 + extra; if (type === "circuit") return 100 + (level <= 2 ? 3 : level === 3 ? 4 : 5) * 15 + extra; if (type === "assembly") return Math.max(40, 75 - level * 6) + extra; return 0; }
