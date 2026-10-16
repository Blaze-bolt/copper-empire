import { DEVICES, UPGRADES, CHALLENGES, defaultState, loadState, createAttempt, passChallenge, failAttempt, claimReward, buyUpgrade, requiredChallenges, generateCircuit, circuitConnected, circuitUsefulTile, rotate, generateMemory, timingConfig, timingHit, challengeDuration } from './engine.js';
import { icon, deviceArt, coilArt } from './art.js';
const $ = (selector, root = document) => root.querySelector(selector);
const app = $('#app'), overlay = $('#overlay-root');
let state = loadState(localStorage), selected = 'motor', page = 'workshop', filter = 'all', attempt = null, game = null, paused = false, modalKind = null, lastFrame = 0, audioContext;
const fmt = n => n.toLocaleString();
const currentDevice = () => DEVICES.find(d => d.id === selected);
const has = id => state.upgrades.includes(id);
function save() { try { localStorage.setItem('copperworks-save', JSON.stringify(state)); } catch { toast('Your browser could not save progress. Keep this tab open.'); } }
function toast(text) { const el = $('#toast'); el.textContent = text; el.classList.add('show'); clearTimeout(toast.timeout); toast.timeout = setTimeout(() => el.classList.remove('show'), 3400); }
function sound(type = 'tap') {
  if (!state.sound) return;
  try { audioContext ||= new (window.AudioContext || window.webkitAudioContext)(); if (audioContext.state === 'suspended') audioContext.resume(); const o = audioContext.createOscillator(), gain = audioContext.createGain(); o.connect(gain); gain.connect(audioContext.destination); o.type = 'sine'; const now = audioContext.currentTime; o.frequency.setValueAtTime(type === 'fail' ? 160 : type === 'success' ? 600 : 440, now); o.frequency.exponentialRampToValueAtTime(type === 'fail' ? 65 : type === 'success' ? 1000 : 560, now + .13); gain.gain.setValueAtTime(.045, now); gain.gain.exponentialRampToValueAtTime(.001, now + .22); o.start(); o.stop(now + .23); } catch {}
}
function pill(text, cls='') { return `<span class="pill ${cls}">${text}</span>`; }
function render() {
  document.documentElement.classList.toggle('reduced-motion', !state.motion);
  const level = Math.floor(state.xp / 150) + 1, nextXp = state.xp % 150;
  app.innerHTML = `<aside class="sidebar"><a class="brand" href="#workshop" aria-label="Copperworks home"><span class="brand-mark">${icon('copper')}</span><span>COPPER<span class="brand-light">WORKS</span><small>THE ART OF A SECOND LIFE</small></span></a><div class="nav-label">YOUR SPACE</div><nav aria-label="Main navigation">${[['workshop','grid','Workshop'],['inventory','box','Inventory'],['upgrades','tools','Upgrades'],['statistics','chart','Statistics'],['journal','book','Salvage journal']].map(([id, ic, label]) => `<button class="nav-item ${page===id?'active':''}" data-page="${id}" aria-label="${label}" title="${label}">${icon(ic)}<span>${label}</span>${id==='inventory'?`<span class="nav-count">${Object.values(state.inventory).reduce((a,b)=>a+b,0)}</span>`:''}${id==='workshop'?'<span class="nav-dot"></span>':''}</button>`).join('')}</nav><div class="sidebar-bottom"><div class="workshop-level"><div class="level-top"><span class="level-emblem">${icon('workshop')}</span><div>${level>5?'Salvage specialist':level>2?'Skilled recycler':'Apprentice recycler'}<small>LEVEL ${String(level).padStart(2,'0')}</small></div></div><div class="xp-bar"><i style="width:${nextXp/1.5}%"></i></div><div class="xp-caption"><span>${nextXp} / 150 XP</span><span>Next level ${icon('arrow')}</span></div></div><button class="nav-item" data-action="settings" aria-label="Settings">${icon('settings')}<span>Settings</span></button><div class="sidebar-footer"><span class="online-dot"></span> A little less landfill.</div></div></aside><div class="main-wrap"><header class="topbar"><div class="breadcrumb">Your workspace ${icon('chevron')} <strong>${{workshop:'Workshop',inventory:'Inventory',upgrades:'Upgrades',statistics:'Statistics',journal:'Salvage journal'}[page]}</strong></div><div class="topbar-right"><span class="balance">${icon('copper')}<strong>${fmt(state.copper)}</strong><span>g copper</span></span><span class="top-divider"></span><button class="icon-button" data-action="sound" aria-label="${state.sound?'Mute':'Enable'} sound" title="${state.sound?'Mute':'Enable'} sound">${icon(state.sound?'sound':'muted')}</button><button class="avatar" data-action="profile" aria-label="View recycler statistics">J<span></span></button></div></header><main id="main-content">${page==='workshop'?workshopView():page==='inventory'?inventoryView():page==='upgrades'?upgradesView():page==='statistics'?statisticsView():journalView()}</main><footer class="main-footer"><span>${icon('leaf')} Every little bit makes a difference.</span><span>COPPERWORKS <i>·</i> EST. 2026</span></footer></div>`;
}
function titleBlock(title, subtitle, extra='') { return `<div class="page-heading"><div><div class="eyebrow"><span class="online-dot"></span> YOUR NEXT CHAPTER STARTS HERE</div><h1>${title}</h1><p>${subtitle}</p></div>${extra}</div>`; }
function deviceCard(d, inventory = false) {
  const active = selected===d.id;
  return `<button class="device-card ${active?'selected':''} ${state.inventory[d.id]?'':'out-of-stock'}" data-device="${d.id}" aria-pressed="${active}"><div class="device-card-top">${pill(d.tier, `tier-${d.level}`)}<span class="stock">×${state.inventory[d.id]}</span></div><div class="device-thumb">${deviceArt(d.id, `card-${d.id}`)}</div><div class="device-card-name">${d.short}${active?icon('check'):''}</div><div class="device-meta">${icon('copper')} ${d.reward}–${Math.round(d.reward*1.15)} g <span>·</span> ${requiredChallenges(d,state.upgrades).length} ${requiredChallenges(d,state.upgrades).length===1?'challenge':'challenges'}</div>${inventory?`<span class="card-inventory-footer">${state.inventory[d.id]} available ${icon('arrow')}</span>`:''}</button>`;
}
function workshopView() {
  const d = currentDevice(), challenges = requiredChallenges(d,state.upgrades);
  return `${titleBlock("Let's get to work.", 'A little skill. A lot of potential. Give old electronics a new beginning.', `<div class="workshop-status"><span class="online-dot"></span> Workshop is open</div>`)}<section class="workbench" aria-label="Selected device"><div class="bench-grid"></div><div class="bench-copy"><div class="eyebrow">ON YOUR WORKBENCH <span>${String(d.level).padStart(2,'0')} / 05</span></div><h2>${d.name}</h2><p>${d.description}</p><div class="bench-facts"><div><span>POTENTIAL COPPER</span><strong class="copper-value">${icon('copper')} ${d.reward}<small>–${Math.round(d.reward*1.15)} g</small></strong></div><div><span>DIFFICULTY</span><strong class="difficulty-text"><i class="difficulty-bars level-${d.level}">${Array.from({length:5},(_,i)=>`<b class="${i<d.level?'on':''}"></b>`).join('')}</i>${d.tier}</strong></div><div><span>CHALLENGES</span><strong>${String(challenges.length).padStart(2,'0')}<small> to complete</small></strong></div></div><button class="button primary start-button" data-action="start">${state.inventory[d.id]?'Start disassembly':'Source this device'} ${icon('arrow')}</button><div class="skill-note">${icon('target')} Skill earns the copper. Make every move count.</div></div><div class="bench-visual"><div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div><div class="bench-stock"><span class="online-dot"></span> ${state.inventory[d.id]} in your inventory</div><div class="hero-device">${deviceArt(d.id, 'hero')}</div><div class="device-callout"><span class="callout-dot"></span><span>COPPER WINDINGS<br/><strong>A second life, waiting inside.</strong></span></div><span class="bench-id">CW—${String(d.level).padStart(3,'0')} <span>RECOVER. REIMAGINE.</span></span></div></section><section class="inventory-section"><div class="section-heading"><h3>Your next projects <span>CHOOSE A DEVICE</span></h3><button class="text-button" data-page="inventory">View inventory ${icon('arrow')}</button></div><div class="device-grid">${DEVICES.map(d=>deviceCard(d)).join('')}</div></section><div class="workshop-lower"><section class="upgrades-preview"><div class="section-heading"><h3>Better tools. Better possibilities.</h3><button class="text-button" data-page="upgrades">All upgrades ${icon('arrow')}</button></div><div class="upgrade-preview-grid">${UPGRADES.slice(0,3).map(upgradeCard).join('')}</div></section><section class="activity-panel"><div class="section-heading"><h3>The little wins</h3>${icon('leaf')}</div><div class="impact-number">${fmt(state.recovered)}<small>g</small><span>copper given a second life</span></div><div class="impact-bottom"><span>${icon('check')} ${state.completed} devices recovered</span><button class="text-button" data-page="statistics" aria-label="View recovery statistics">${icon('arrow')}</button></div></section></div><div class="workbench-note">${icon('help')} New to the workbench? <button data-action="help">Here’s how it works</button><span>Built for curious minds and steady hands.</span></div>`;
}
function upgradeCard(u) { const owned = has(u.id); return `<article class="upgrade-card ${owned?'owned':''}"><div class="upgrade-card-top"><span class="upgrade-icon">${icon(u.icon)}</span>${owned?pill(`${icon('check')} Equipped`,'equipped'):''}</div><h4>${u.name}</h4><p>${u.text}</p><button class="upgrade-buy ${owned?'equipped':''}" data-upgrade="${u.id}" ${owned?'disabled':''} aria-label="${owned?'Equipped':`Buy ${u.name} for ${u.cost} grams of copper`}">${owned?'Ready to work':`${icon('copper')} ${u.cost} g <span>${icon('arrowUp')}</span>`}</button></article>`; }
function inventoryView() { return `${titleBlock('Good things, waiting.', 'Your next second-life story is already on the shelf.')}<div class="inventory-toolbar"><div class="tab-group"><button data-filter="all" class="${filter==='all'?'active':''}">All devices</button><button data-filter="available" class="${filter==='available'?'active':''}">In stock</button></div><span>${Object.values(state.inventory).reduce((a,b)=>a+b,0)} devices ready to recover</span></div><div class="device-grid inventory-grid">${DEVICES.filter(d=>filter!=='available'||state.inventory[d.id]>0).map(d=>deviceCard(d,true)).join('')}</div><section class="panel sourcing"><div><div class="eyebrow">THE SALVAGE YARD</div><h3>There’s always another possibility.</h3><p>Source a device for your next project. Small motors are always free.</p></div><div class="source-list">${DEVICES.map(d=>`<div><span>${d.name}<small>${d.tier} · ${d.reward} g base recovery</small></span><button class="button secondary" data-source="${d.id}">${d.cost?`${d.cost} g`:'Free'} ${icon('plus')}</button></div>`).join('')}</div></section>`; }
function upgradesView() { return `${titleBlock('An edge, earned.', 'Invest recovered copper in tools that make every challenge a little more manageable.')}<div class="full-upgrade-grid">${UPGRADES.map(u=>`<div>${upgradeCard(u)}<p class="upgrade-detail">${u.detail}</p></div>`).join('')}</div><div class="panel upgrade-explainer">${icon('tools')}<div><h3>Your tools come with you.</h3><p>Purchased upgrades are permanent and apply automatically to every new attempt. Skill still opens every device.</p></div></div>`; }
function statisticsView() { const level = Math.floor(state.xp/150)+1; return `${titleBlock('Small actions. Real progress.', 'Every device recovered is another step toward your recycling empire.')}<div class="stats-grid">${[['copper','Copper recovered',fmt(state.recovered)+' g'],['workshop','Devices recovered',fmt(state.completed)],['bolt','Experience earned',fmt(state.xp)+' XP'],['star','Best performance',state.bestGrade||'—']].map(([i,t,v])=>`<div class="panel stat-card">${icon(i)}<span>${t}</span><strong>${v}</strong></div>`).join('')}</div><div class="stats-two"><section class="panel"><div class="eyebrow">YOUR RECYCLING JOURNEY</div><h3>Level ${level} · ${level>5?'Salvage specialist':level>2?'Skilled recycler':'Apprentice recycler'}</h3><p>${150-state.xp%150} XP until your next level. Your workshop grows with every successful recovery.</p><div class="large-xp"><i style="width:${state.xp%150/1.5}%"></i></div><div class="stat-line"><span>Tools equipped</span><strong>${state.upgrades.length} / 5</strong></div><div class="stat-line"><span>Rare flux crystals found</span><strong>${state.rare}</strong></div></section><section class="panel"><div class="eyebrow">RECOVERY BY DEVICE</div><h3>A second life, in numbers.</h3>${DEVICES.map(d=>{let n=state.history.filter(h=>h.device===d.id).length;return `<div class="recovery-row"><span>${d.short}</span><div><i style="width:${n?Math.max(5,n/Math.max(1,state.completed)*100):0}%"></i></div><strong>${n}</strong></div>`}).join('')}<small class="muted">Device breakdown reflects your last 30 recoveries.</small></section></div>`; }
function journalView() { return `${titleBlock('Every recovery has a story.', 'A record of your steady hands, bright ideas, and copper well earned.')}<div class="panel journal">${state.history.length?`<div class="journal-row journal-head"><span>DEVICE RECOVERED</span><span>GRADE</span><span>COPPER</span><span>EXPERIENCE</span></div>${state.history.map(h=>`<div class="journal-row"><span class="journal-device">${icon('component')}<span>${DEVICES.find(d=>d.id===h.device).name}<small>${new Date(h.at).toLocaleDateString(undefined,{month:'short',day:'numeric'})}${h.rare?' · Rare flux crystal found':''}</small></span></span><span class="grade-small">${h.grade}</span><strong class="orange">+${h.copper} g</strong><span>+${h.xp} XP</span></div>`).join('')}`:`<div class="empty-state">${icon('book')}<h3>Your story starts at the workbench.</h3><p>Complete your first disassembly to add a recovery to your journal.</p><button class="button primary" data-page="workshop">Find your first project ${icon('arrow')}</button></div>`}</div>`; }
function setPage(next) { if (!['workshop','inventory','upgrades','statistics','journal'].includes(next)) return; page=next; render(); window.scrollTo({top:0,behavior:'smooth'}); }
function sourceDevice(id) { const d=DEVICES.find(d=>d.id===id); if (!d) return; if(state.copper<d.cost) return toast(`You need ${d.cost-state.copper} g more copper. Try a free small motor.`); state.copper-=d.cost; state.inventory[id]++; save(); render(); sound(); toast(`${d.name} added to your inventory.`); }
function openModal(html, cls='') { overlay.innerHTML=`<div class="modal-backdrop"><section class="modal ${cls}" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">${html}</section></div>`; document.body.classList.add('modal-open'); requestAnimationFrame(()=> $('.modal',overlay)?.focus()); }
function closeModal() { game=null; attempt=null; modalKind=null; paused=false; overlay.innerHTML=''; document.body.classList.remove('modal-open'); $('[data-action="start"]')?.focus(); }
function modalCloseButton() { return `<button class="icon-button modal-close" data-action="close-modal" aria-label="Close dialog">${icon('close')}</button>`; }
function helpModal() { modalKind='help'; openModal(`${modalCloseButton()}<div class="modal-eyebrow">WELCOME TO COPPERWORKS</div><h2 id="modal-title">A little skill goes a long way.</h2><p>Choose an electronic device, complete its challenges, and give its copper a second life.</p><div class="help-steps">${[['01','Choose your project','Five devices. Five levels of possibility.'],['02','Put your skills to work','Timing, memory, abstract circuits, and component matching.'],['03','Enjoy the little wins','Earn copper and XP. Invest in tools. Take on a bigger challenge.']].map(([n,t,s])=>`<div><b>${n}</b><span><strong>${t}</strong><small>${s}</small></span></div>`).join('')}</div><div class="notice">${icon('help')} A missed challenge ends the attempt. Your device stays in inventory, ready to try again. There are no skips or automatic wins.</div><p class="stylized-note">A fictional salvage game. The puzzles do not represent real electrical wiring or disassembly.</p><button class="button primary full" data-action="close-modal">Let's get to work ${icon('arrow')}</button>`,'info-modal'); }
function settingsModal() { modalKind='settings'; openModal(`${modalCloseButton()}<div class="modal-eyebrow">MAKE YOURSELF AT HOME</div><h2 id="modal-title">Workshop settings</h2><div class="setting-row"><div><strong>Workshop sounds</strong><small>Gentle feedback for your little wins.</small></div><button class="toggle ${state.sound?'on':''}" role="switch" aria-checked="${state.sound}" data-setting="sound" aria-label="Workshop sounds"><i></i></button></div><div class="setting-row"><div><strong>Decorative animations</strong><small>Device motion and opening effects.</small></div><button class="toggle ${state.motion?'on':''}" role="switch" aria-checked="${state.motion}" data-setting="motion" aria-label="Decorative animations"><i></i></button></div><div class="notice">${icon('check')} Progress saves automatically on this browser. Timed challenges pause when you leave the tab. Press Escape to pause a challenge.</div><button class="button secondary full" data-action="close-modal">Back to the workshop</button>`,'info-modal'); }
function beginAttempt() { const d=currentDevice(); if (!state.inventory[d.id]) return sourceDevice(d.id); attempt=createAttempt(d,state.upgrades); paused=false; modalKind='game'; briefing(); }
function gameHeader() { const d=attempt.device; return `<div class="game-header"><span class="game-device">${icon('tools')} ${d.name}</span>${game ? `<button class="icon-button" data-action="pause" aria-label="Pause challenge">${icon('pause')}</button>` : `<button class="icon-button" data-action="abandon" aria-label="Leave disassembly">${icon('close')}</button>`}</div><div class="challenge-progress">${attempt.challenges.map((c,i)=>`<span class="${i<attempt.index?'done':i===attempt.index?'current':''}">${i<attempt.index?icon('check'):icon(CHALLENGES[c].icon)}<i>${CHALLENGES[c].name}</i></span>`).join('<b></b>')}</div>`; }
const instruction = {
  timing: ['Stop the indicator inside the orange zone.', 'Use the button, Space, or Enter. A missed hit or expired timer ends the attempt. Higher tiers require multiple hits.'],
  circuit: ['Connect IN to OUT by rotating the tiles.', 'Click, tap, or focus a tile and press Enter to rotate it clockwise. Connect the left edge of IN to the right edge of OUT, then test your path. A broken path or timeout ends the attempt.'],
  memory: ['Watch the symbols. Repeat their sequence.', 'Wait for the glowing sequence to finish, then tap the symbols in order. You can also use the number keys. One incorrect symbol ends the attempt.'],
  assembly: ['Match every component to its outlined slot.', 'Drag components into their matching shapes, or select a component and tap its slot. Number keys select components; Tab and Enter select slots. Wrong slots or timeout end the attempt.']
};
function briefing() { game=null; const type=attempt.challenges[attempt.index], c=CHALLENGES[type]; openModal(`${gameHeader()}<div class="challenge-intro"><div class="challenge-icon">${icon(c.icon)}</div><div class="modal-eyebrow">CHALLENGE ${attempt.index+1} OF ${attempt.challenges.length}</div><h2 id="modal-title">${c.verb}.</h2><h4>${instruction[type][0]}</h4><p>${instruction[type][1]}</p><div class="briefing-chips">${pill(attempt.device.tier)}${pill(type==='memory'?'Take your time':'Timer pauses with your tab')}${has(({timing:'precision',circuit:'scanner',memory:'memory',assembly:'time'})[type])?pill(`${icon('check')} Upgrade equipped`,'equipped'):''}</div><button class="button primary full" data-action="begin-challenge">Begin challenge ${icon('arrow')}</button><button class="quiet-button" data-action="abandon">Leave workbench</button></div>`,'game-modal'); }
function launchChallenge() {
  if (!attempt || !['active','between'].includes(attempt.status)) return;
  attempt.status='active'; paused=false;
  const type=attempt.challenges[attempt.index], level=attempt.device.level;
  game={ type, level, elapsed:0, clock:0, remaining:0, duration:0, finished:false };
  let content='';
  if(type==='timing') { const config=timingConfig(level,state.upgrades); Object.assign(game,config,{position:.06, direction:1, center:.55, hitCount:0, quality:[], remaining:challengeDuration(type,level,state.upgrades), duration:challengeDuration(type,level,state.upgrades), cooldown:0}); content=`<div class="timing-stage"><div class="timing-status"><span>STEADY HANDS, GOOD TIMING.</span><span id="hit-count">Hit 1 of ${game.hits}</span></div><div class="timing-track"><div class="timing-marks">${Array.from({length:31},()=>'<i></i>').join('')}</div><div id="timing-zone" class="timing-zone" style="left:${(game.center-game.width/2)*100}%;width:${game.width*100}%"><span>SWEET SPOT</span></div><div id="timing-indicator" class="timing-indicator" style="left:6%"><i></i></div></div><div class="timing-scale"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div><button class="button primary timing-hit" data-action="timing-hit">${icon('target')} Lock it in <kbd>SPACE</kbd></button><div class="hit-dots">${Array.from({length:game.hits},(_,i)=>`<i id="hit-${i}"></i>`).join('')}</div></div>`; }
  if(type==='circuit') { const size=level<=2?3:level===3?4:5; game.puzzle=generateCircuit(size); Object.assign(game,{remaining:challengeDuration(type,level,state.upgrades),duration:challengeDuration(type,level,state.upgrades),scanned:null}); content=`<div class="circuit-labels"><span><i></i> IN</span><span>OUT <i></i></span></div><div class="circuit-board" style="--grid:${size}">${game.puzzle.masks.map((m,i)=>circuitTile(m,i)).join('')}</div><div class="circuit-controls"><button class="button secondary" data-action="scan" ${has('scanner')?'':'disabled'} title="${has('scanner')?'Highlight one tile to adjust':'Purchase Puzzle scanner to unlock'}">${icon('scan')} Scan tile ${!has('scanner')?icon('lock'):''}</button><button class="button primary" data-action="test-circuit">Test circuit ${icon('bolt')}</button></div><small class="board-note">An abstract signal puzzle. Tiles rotate clockwise. A failed test ends the attempt.</small>`; }
  if(type==='memory') { Object.assign(game,generateMemory(level),{phase:'watch',watchClock:0,watchStep:-1,input:[],replayed:false}); content=`<div class="memory-heading"><span id="memory-status">Watch closely…</span><span id="memory-count">${game.sequence.length} symbols to remember</span></div><div class="memory-dots">${game.sequence.map((_,i)=>`<i id="memory-dot-${i}"></i>`).join('')}</div><div class="memory-board" style="--symbols:${game.symbols.length}">${game.symbols.map((s,i)=>`<button class="memory-symbol symbol-${i}" data-symbol="${i}" aria-label="${s}, key ${i+1}" disabled>${icon(s)}<kbd>${i+1}</kbd></button>`).join('')}</div><div class="memory-controls"><button class="button secondary" data-action="replay" disabled>${icon('refresh')} Replay sequence ${!has('memory')?icon('lock'):''}</button><span id="memory-helper">${has('memory')?'One replay available':'Remember the order, not the speed.'}</span></div>`; }
  if(type==='assembly') { const count=Math.min(6,level+2), kinds=['sun','diamond','wave','triangle','moon','star'].slice(0,count); const shuffled=[...kinds].sort(()=>Math.random()-.5); Object.assign(game,{kinds,placed:[],selected:null,moves:0,remaining:challengeDuration(type,level,state.upgrades),duration:challengeDuration(type,level,state.upgrades)}); const slots=[...kinds,...(level>=4?['decoy-a','decoy-b']:[])].sort(()=>Math.random()-.5); content=`<div class="assembly-label">YOUR COMPONENTS <span id="assembly-count">0 / ${count} placed</span></div><div class="component-tray">${shuffled.map(kind=>`<button class="component-piece" data-component="${kind}" draggable="true" aria-label="Select ${kind} component">${icon(kind)}<kbd>${kinds.indexOf(kind)+1}</kbd></button>`).join('')}</div><div class="assembly-label slots-label">MATCHING SLOTS ${level>=4?'<span>Watch out for decoys</span>':''}</div><div class="assembly-slots">${slots.map(kind=>`<button class="component-slot ${kind.startsWith('decoy')?'decoy':''}" data-slot="${kind}" aria-label="${kind.startsWith('decoy')?'Decoy':kind} slot">${icon(kind==='decoy-a'?'component':kind==='decoy-b'?'circuit':kind)}</button>`).join('')}</div><small class="board-note">Drag and drop, or select a component and then tap its matching slot.</small>`; }
  openModal(`${gameHeader()}<div class="challenge-live"><div class="live-heading"><div><div class="modal-eyebrow">CHALLENGE ${attempt.index+1} OF ${attempt.challenges.length}</div><h2 id="modal-title">${CHALLENGES[type].name}</h2></div>${type!=='memory'?`<span class="game-timer">${icon('timer')} <strong id="time-left">${Math.ceil(game.remaining)}s</strong></span>`:''}</div><p class="live-instructions">${instruction[type][0]}</p>${type!=='memory'?'<div class="time-track"><i id="time-bar"></i></div>':''}${content}</div><div id="pause-layer"></div>`,'game-modal');
  lastFrame=performance.now(); sound();
}
function circuitTile(mask,i) { const p=game.puzzle; return `<button class="circuit-tile ${p.blocked.has(i)?'blocked':''} ${i===game.scanned?'scanned':''}" data-tile="${i}" aria-label="${p.blocked.has(i)?'Obstacle':`Rotate tile ${i+1}, connections ${[mask&1?'up':'',mask&2?'right':'',mask&4?'down':'',mask&8?'left':''].filter(Boolean).join(' ')}`}" ${p.blocked.has(i)?'disabled':''}>${p.blocked.has(i)?icon('close'):`<svg viewBox="0 0 100 100" aria-hidden="true">${[1,2,4,8].map((b,j)=>mask&b?`<path d="M50 50 ${['V0','H100','V100','H0'][j]}"/>`:'').join('')}<circle cx="50" cy="50" r="7"/></svg>`}${i===0?'<span class="terminal-dot start-dot"></span>':i===p.size*p.size-1?'<span class="terminal-dot end-dot"></span>':''}</button>`; }
function winChallenge(score) {
  if (!game || game.finished || !attempt || attempt.status!=='active') return;
  game.finished=true; passChallenge(attempt,score); sound('success');
  if(attempt.status==='complete') return finishAttempt();
  game=null;
  const next=CHALLENGES[attempt.challenges[attempt.index]];
  openModal(`${gameHeader()}<div class="challenge-intro between-screen"><div class="challenge-icon success-icon">${icon('check')}</div><div class="modal-eyebrow">NICE WORK. KEEP IT GOING.</div><h2 id="modal-title">One step closer.</h2><p>Challenge ${attempt.index} complete. Your device is almost ready for its second life.</p><div class="next-challenge"><span>UP NEXT</span><strong>${icon(next.icon)} ${next.name}</strong></div><button class="button primary full" data-action="next-challenge">Continue to challenge ${attempt.index+1} ${icon('arrow')}</button><div class="stylized-note">Complete all ${attempt.challenges.length} challenges to earn your copper.</div></div>`,'game-modal');
}
function failure(reason) {
  if(!attempt || !failAttempt(attempt)) return;
  game=null; paused=false; sound('fail');
  openModal(`${modalCloseButton()}<div class="result-screen failure-screen"><div class="result-icon">${icon('tools')}</div><div class="modal-eyebrow">A SETBACK. NOT THE END.</div><h2 id="modal-title">Disassembly failed.</h2><p>${reason}</p><div class="failed-rewards"><span>${icon('copper')} 0 g copper</span><span>${icon('bolt')} 0 XP</span></div><div class="notice">${icon('box')} Your ${attempt.device.name.toLowerCase()} is safe in your inventory. All challenge progress has reset. Start fresh when you’re ready.</div><button class="button primary full" data-action="retry">Try again ${icon('refresh')}</button><button class="quiet-button" data-action="close-modal">Back to workshop</button></div>`,'result-modal');
}
function finishAttempt() {
  const result=claimReward(state,attempt); if(!result) return;
  game=null; save(); render(); sound('success');
  openModal(`<div class="result-screen success-screen"><div class="success-sparks">${Array.from({length:14},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><div class="modal-eyebrow">ANOTHER SECOND LIFE, MADE POSSIBLE.</div><h2 id="modal-title">That’s the good stuff.</h2><p>${attempt.device.name} successfully recovered.</p><div class="reveal-art"><div class="reveal-device">${deviceArt(attempt.device.id,'reveal')}</div><div class="reveal-copper">${coilArt()}</div><span class="result-grade">${result.grade}<small>${{S:'PERFECT',A:'EXCELLENT',B:'GOOD',C:'COMPLETED'}[result.grade]}</small></span></div><div class="reward-total">+${result.copper}<small>g copper</small></div><div class="reward-breakdown">${result.base} g recovered ${result.extra?`+ ${result.extra} g performance bonus`:''}</div><div class="success-rewards"><span>${icon('bolt')} +${result.xp} XP</span>${result.rare?`<span class="rare-reward">${icon('spark')} Rare flux crystal +1</span>`:`<span>${icon('leaf')} A little less landfill</span>`}</div><button class="button primary full" data-action="close-modal">Back to the workbench ${icon('arrow')}</button><small class="stylized-note">Copper and experience have been added to your inventory.</small></div>`,'result-modal');
}
function timingPress() {
  if(!game||game.type!=='timing'||paused||game.finished||game.cooldown>0) return;
  if(!timingHit(game.position,game.center,game.width)) return failure('The indicator stopped outside the highlighted zone. Take a breath and watch its rhythm.');
  const distance=Math.abs(game.position-game.center)/(game.width/2);
  game.quality.push(distance<=.28?1:Math.max(.65,1-distance*.3));
  $(`#hit-${game.hitCount}`)?.classList.add('done'); game.hitCount++; sound('success');
  if(game.hitCount>=game.hits) return winChallenge(game.quality.reduce((a,b)=>a+b,0)/game.hits);
  game.center=.23+Math.random()*.54; game.cooldown=.48;
  $('#hit-count').textContent=`Hit ${game.hitCount+1} of ${game.hits}`;
  const zone=$('#timing-zone'); zone.style.left=`${(game.center-game.width/2)*100}%`;
  $('.timing-track').classList.add('hit-flash'); setTimeout(()=>$('.timing-track')?.classList.remove('hit-flash'),350);
}
function rotateTile(i) {
  if(!game||game.type!=='circuit'||paused||game.finished||game.puzzle.blocked.has(i)) return;
  game.puzzle.masks[i]=rotate(game.puzzle.masks[i]); game.puzzle.turns++;
  const tile=$(`[data-tile="${i}"]`), hadFocus=document.activeElement===tile; tile.outerHTML=circuitTile(game.puzzle.masks[i],i); if(hadFocus) $(`[data-tile="${i}"]`)?.focus(); sound();
}
function memoryInput(i) {
  if(!game||game.type!=='memory'||game.phase!=='input'||paused||game.finished) return;
  if(i!==game.sequence[game.input.length]) return failure('That symbol was not next in the sequence. Watch the whole pattern and try again.');
  game.input.push(i); sound();
  $(`#memory-dot-${game.input.length-1}`)?.classList.add('done');
  const button=$(`[data-symbol="${i}"]`); button.classList.add('pressed'); setTimeout(()=>button.classList.remove('pressed'),180);
  $('#memory-count').textContent=`${game.input.length} / ${game.sequence.length} correct`;
  if(game.input.length===game.sequence.length) winChallenge(game.replayed ? .88 : 1);
}
function replayMemory() {
  if(!game||game.type!=='memory'||game.phase!=='input'||paused||game.replayed||!has('memory')) return;
  Object.assign(game,{phase:'watch',watchClock:0,watchStep:-1,input:[],replayed:true});
  $$('.memory-symbol').forEach(b=>{b.disabled=true;b.classList.remove('lit')}); $$('.memory-dots i').forEach(b=>b.classList.remove('done','watching')); $('#memory-status').textContent='One more look…'; $('[data-action="replay"]').disabled=true; $('#memory-helper').textContent='Replay used. You’ve got this.';
}
const $$ = (selector,root=document) => [...root.querySelectorAll(selector)];
function selectComponent(kind) {
  if(!game||game.type!=='assembly'||paused||game.placed.includes(kind)) return;
  game.selected=kind; $$('.component-piece').forEach(b=>b.classList.toggle('selected',b.dataset.component===kind)); sound();
}
function placeComponent(slot) {
  if(!game||game.type!=='assembly'||paused||game.finished) return;
  if(!game.selected) return toast('Select a component first, then choose its matching slot.');
  if(game.placed.includes(slot)) return;
  if(game.selected!==slot) return failure('That component does not match the slot. Match the symbol to its exact outline.');
  const kind=game.selected; game.placed.push(kind); game.selected=null; game.moves++;
  const part=$(`[data-component="${kind}"]`); part.classList.add('placed'); part.classList.remove('selected'); part.disabled=true;
  const target=$(`[data-slot="${slot}"]`); target.classList.add('filled'); target.disabled=true;
  $('#assembly-count').textContent=`${game.placed.length} / ${game.kinds.length} placed`; sound('success');
  if(game.placed.length===game.kinds.length) winChallenge(game.elapsed<game.duration*.5?1:Math.max(.45,1-(game.elapsed/game.duration-.5)*1.05));
}
function setPaused(value) {
  if(!game||game.finished) return;
  paused=value; lastFrame=performance.now();
  $('.challenge-live').inert=value; $('.game-header').inert=value;
  $('#pause-layer').innerHTML=value?`<div class="pause-content">${icon('pause')}<h3>Take a breather.</h3><p>Your challenge is paused. Everything is right where you left it.</p><button class="button primary" data-action="resume">Resume challenge ${icon('play')}</button><button class="quiet-button" data-action="abandon">Leave workbench</button></div>`:'';
  $('#pause-layer').classList.toggle('visible',value);
  if(value) $('[data-action="resume"]')?.focus();
}
function frame(now) {
  // Clamp simulation time: a slow frame never costs the player unseen time.
  const dt=Math.min(.04,Math.max(0,(now-(lastFrame||now))/1000)); lastFrame=now;
  if(game&&!game.finished&&!paused&&!document.hidden) {
    game.elapsed+=dt;
    if(game.duration) {
      game.remaining=Math.max(0,game.remaining-dt);
      const time=$('#time-left'), bar=$('#time-bar'); if(time) time.textContent=`${Math.ceil(game.remaining)}s`; if(bar) {bar.style.width=`${game.remaining/game.duration*100}%`;bar.classList.toggle('urgent',game.remaining<10)}
      if(game.remaining<=0) { failure('Time ran out before the challenge was complete. Try a steadier approach, or equip Time extension for timed challenges.'); requestAnimationFrame(frame); return; }
    }
    if(game.type==='timing') {
      if(game.cooldown>0) game.cooldown-=dt;
      else { game.position+=dt*game.speed*game.direction; if(game.position>=.98) {game.position=.98;game.direction=-1} if(game.position<=.02) {game.position=.02;game.direction=1} }
      const el=$('#timing-indicator'); if(el) el.style.left=`${game.position*100}%`;
    }
    if(game.type==='memory'&&game.phase==='watch') {
      game.watchClock+=dt;
      const step=Math.floor((game.watchClock-.7)/.95);
      if(step!==game.watchStep) {
        game.watchStep=step;
        $$('.memory-symbol').forEach(b=>b.classList.remove('lit')); $$('.memory-dots i').forEach(b=>b.classList.remove('watching'));
        if(step>=0&&step<game.sequence.length) { $(`[data-symbol="${game.sequence[step]}"]`)?.classList.add('lit'); $(`#memory-dot-${step}`)?.classList.add('watching'); sound(); }
        if(step>=game.sequence.length) { game.phase='input'; $$('.memory-symbol').forEach(b=>b.disabled=false); $('#memory-status').textContent='Your turn. Follow the pattern.'; $('#memory-count').textContent=`0 / ${game.sequence.length} correct`; $('[data-action="replay"]').disabled=!has('memory')||game.replayed; }
      }
      if(game.phase==='watch'&&(game.watchClock-.7)% .95>.62) $$('.memory-symbol').forEach(b=>b.classList.remove('lit'));
    }
  }
  requestAnimationFrame(frame);
}
app.addEventListener('click',e=>{
  const nav=e.target.closest('[data-page]'); if(nav) return setPage(nav.dataset.page);
  const device=e.target.closest('[data-device]'); if(device) {selected=device.dataset.device;page='workshop';render();window.scrollTo({top:0,behavior:'smooth'});sound();return;}
  const source=e.target.closest('[data-source]'); if(source) return sourceDevice(source.dataset.source);
  const upgrade=e.target.closest('[data-upgrade]'); if(upgrade) { const u=UPGRADES.find(x=>x.id===upgrade.dataset.upgrade); if(!buyUpgrade(state,u.id)) return toast(`You need ${Math.max(0,u.cost-state.copper)} g more copper for ${u.name.toLowerCase()}.`); save(); render(); sound('success'); toast(`${u.name} equipped. ${u.detail}`);return; }
  const tab=e.target.closest('[data-filter]'); if(tab) {filter=tab.dataset.filter;render();return;}
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(action==='start') beginAttempt(); if(action==='help') helpModal(); if(action==='settings') settingsModal(); if(action==='sound') {state.sound=!state.sound;save();render();if(state.sound)sound();} if(action==='profile')setPage('statistics');
});
overlay.addEventListener('click',e=>{
  const setting=e.target.closest('[data-setting]'); if(setting) {state[setting.dataset.setting]=!state[setting.dataset.setting];save();render();settingsModal();return;}
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(action==='close-modal') { if(attempt?.status==='active'&&game) return setPaused(true);return closeModal(); }
  if(action==='begin-challenge')return launchChallenge();
  if(action==='retry') {attempt=createAttempt(attempt.device,state.upgrades);return briefing();}
  if(action==='next-challenge')return briefing();
  if(action==='pause')return setPaused(true); if(action==='resume')return setPaused(false);
  if(action==='abandon') { if(attempt) {attempt.status='active';failure('You left the workbench before completing every challenge. Your device is ready whenever you are.');}return; }
  if(paused) return;
  if(action==='timing-hit')return timingPress();
  if(action==='test-circuit'&&game?.type==='circuit') {if(circuitConnected(game.puzzle)) winChallenge(game.elapsed<game.duration*.4?1:Math.max(.45,1-(game.elapsed/game.duration-.4)*.9));else failure('The signal could not reach OUT. Connect the entrance and exit on the outer edges as well as the path between them.');return;}
  if(action==='scan'&&game?.type==='circuit'&&has('scanner')) { const tile=circuitUsefulTile(game.puzzle); if(tile===undefined)return toast('Your signal path is ready. Test your circuit!'); $$('.circuit-tile.scanned').forEach(t=>t.classList.remove('scanned')); game.scanned=tile; $(`[data-tile="${tile}"]`)?.classList.add('scanned'); toast('The highlighted tile belongs to the path. Try rotating it.');return; }
  if(action==='replay')return replayMemory();
  const tile=e.target.closest('[data-tile]'); if(tile)return rotateTile(Number(tile.dataset.tile));
  const symbol=e.target.closest('[data-symbol]'); if(symbol)return memoryInput(Number(symbol.dataset.symbol));
  const component=e.target.closest('[data-component]'); if(component)return selectComponent(component.dataset.component);
  const slot=e.target.closest('[data-slot]'); if(slot)return placeComponent(slot.dataset.slot);
});
let dragging=false, pointerStart=null;
overlay.addEventListener('dragstart',e=>{const piece=e.target.closest('[data-component]');if(!piece||paused)return e.preventDefault();selectComponent(piece.dataset.component);dragging=true;e.dataTransfer.setData('text/plain',piece.dataset.component);e.dataTransfer.effectAllowed='move';});
overlay.addEventListener('dragover',e=>{if(e.target.closest('[data-slot]')){e.preventDefault();e.dataTransfer.dropEffect='move';}});
overlay.addEventListener('drop',e=>{e.preventDefault();const slot=e.target.closest('[data-slot]');if(slot&&dragging)placeComponent(slot.dataset.slot);dragging=false;});
overlay.addEventListener('dragend',()=>dragging=false);
overlay.addEventListener('pointerdown',e=>{const piece=e.target.closest('[data-component]');if(piece&&e.pointerType!=='mouse'&&!piece.disabled){pointerStart={x:e.clientX,y:e.clientY,kind:piece.dataset.component};selectComponent(pointerStart.kind);}});
overlay.addEventListener('pointerup',e=>{if(pointerStart&&Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y)>8){const slot=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-slot]');if(slot)placeComponent(slot.dataset.slot);}pointerStart=null;});
overlay.addEventListener('pointercancel',()=>pointerStart=null);
document.addEventListener('keydown',e=>{
  if(!overlay.firstElementChild)return;
  if(e.key==='Tab') {const items=$$('button:not([disabled]),a[href],[tabindex="0"]',overlay).filter(el=>el.getClientRects().length&&!el.closest('#pause-layer:not(.visible)')&&!el.closest('[inert]')); const first=items[0],last=items.at(-1); if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('.modal'))){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()} }
  if(e.key==='Escape'){e.preventDefault();if(game)setPaused(!paused);else closeModal();return;}
  if(paused||!game||game.finished||e.repeat)return;
  if(game.type==='timing'&&(e.code==='Space'||e.code==='Enter')&&!e.target.closest('[data-action="pause"]')){e.preventDefault();timingPress();}
  if(game.type==='memory'&&/^[1-6]$/.test(e.key)){e.preventDefault();const i=Number(e.key)-1;if(i<game.symbols.length)memoryInput(i);}
  if(game.type==='assembly'&&/^[1-6]$/.test(e.key)){e.preventDefault();const i=Number(e.key)-1;if(game.kinds[i])selectComponent(game.kinds[i]);}
  if(game.type==='circuit'&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){const tile=document.activeElement.closest('[data-tile]');if(tile){e.preventDefault();let i=Number(tile.dataset.tile),n=game.puzzle.size;const delta={ArrowUp:-n,ArrowDown:n,ArrowLeft:-1,ArrowRight:1}[e.key];for(let k=0;k<n*n;k++){i=(i+delta+n*n)%(n*n);if(!game.puzzle.blocked.has(i)){ $(`[data-tile="${i}"]`)?.focus();break;}}}}
});
document.addEventListener('visibilitychange',()=>{lastFrame=performance.now();if(document.hidden&&game)setPaused(true);});
window.addEventListener('blur',()=>{if(game)setPaused(true);});
window.addEventListener('hashchange',()=>{if(location.hash==='#workshop'&&!overlay.firstElementChild)setPage('workshop');});
render(); requestAnimationFrame(frame);

