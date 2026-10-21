const paths = {
  expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5"/>',
  collapse: '<path d="M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  box: '<path d="m3 7 9-4 9 4v10l-9 4-9-4V7Zm0 0 9 5 9-5M12 12v9M7.5 5l9 5"/>',
  tools: '<path d="m14 6 4-3 3 3-3 4-4-4ZM4 20l10-10M3 3l5 2 1 4-3 3-4-1-1-5 4 3 2-2-4-4Zm8 11 6 6a2 2 0 0 0 3-3l-6-6"/>',
  chart: '<path d="M4 3v17h17M8 15l4-5 4 2 5-7"/>',
  book: '<path d="M4 3h15a1 1 0 0 1 1 1v17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM3 17h17M8 7h7M8 11h5"/>',
  settings: '<path d="m9 3 1-1h4l1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 2-1 2h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1Z"/><circle cx="12" cy="12" r="3"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  arrowUp: '<path d="m5 16 11-11M6 5h10v10"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  copper: '<path d="m12 3 8 4v10l-8 4-8-4V7l8-4Zm0 0v9m-8-5 8 5 8-5M12 12v9"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',
  circuit: '<path d="M3 5h7v7h7v7M4 19h5v-3m7-11h5M17 9V3"/><circle cx="3" cy="5" r="2"/><circle cx="17" cy="19" r="2"/><circle cx="4" cy="19" r="2"/>',
  brain: '<path d="M12 5c-4-6-10 0-7 4-5 2-2 9 2 8 1 5 5 4 5 1V5Zm0 0c4-6 10 0 7 4 5 2 2 9-2 8-1 5-5 4-5 1M7 9l3 2m7-2-3 2M7 17l2-3m8 3-2-3"/>',
  component: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/><rect x="9" y="9" width="6" height="6" rx="1"/>',
  scan: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M4 12h16"/><rect x="8" y="8" width="8" height="8" rx="1"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 8v5l3 2M9 2h6m2 3 2-2"/>',
  workshop: '<path d="M3 21V9l9-6 9 6v12H3Zm5 0v-8h8v8M1 21h22M8 9h8"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  sound: '<path d="m11 4-6 5H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  muted: '<path d="m11 4-6 5H2v6h3l6 5V4Zm5 5 6 6m0-6-6 6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 8a3 3 0 0 1 6 1c0 2-3 2-3 5m0 3v1"/>',
  leaf: '<path d="M20 3C9 1 2 8 5 16c8 5 17-2 15-13ZM3 21 16 8M9 15V9m0 6h6"/>',
  star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  play: '<path d="m8 4 12 8-12 8V4Z"/>',
  refresh: '<path d="M20 7a9 9 0 1 0 1 9M20 2v6h-6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',
  spark: '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
  diamond: '<path d="m12 2 9 10-9 10-9-10 9-10Z"/>',
  wave: '<path d="M2 8c4-8 6 8 10 0s6 8 10 0M2 16c4-8 6 8 10 0s6 8 10 0"/>',
  triangle: '<path d="m12 3 10 18H2L12 3Z"/>',
  moon: '<path d="M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z"/>',
};
export const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.component}</svg>`;

export function deviceArt(id, uid = 'main') {
  const industrial = id === 'industrial', washer = id === 'washer';
  let body;
  if (id === 'fan') {
    body = `<ellipse cx="240" cy="323" rx="100" ry="14" fill="#303c351b"/><path d="M226 205h27l13 99h-53Z" fill="url(#${uid}-metal)"/><ellipse cx="240" cy="307" rx="84" ry="15" fill="#9da9a8"/><ellipse cx="240" cy="301" rx="80" ry="12" fill="#d0d8d4"/><circle cx="240" cy="139" r="112" fill="#bccac5" stroke="#6d8079" stroke-width="7"/><circle cx="240" cy="139" r="102" fill="#e4e9e0"/><g class="fan-blades" style="transform-origin:240px 139px">${[0,120,240].map(a => `<path d="M242 142c-70 12-88-24-71-47 23-30 56-7 71 47Z" fill="#7e9a90" transform="rotate(${a} 240 139)"/>`).join('')}</g>${[32,55,79,103].map(r => `<circle cx="240" cy="139" r="${r}" stroke="#748b8170" stroke-width="2" fill="none"/>`).join('')}${[0,30,60,90,120,150].map(a=>`<path d="M132 139h216" stroke="#748b8170" stroke-width="2" transform="rotate(${a} 240 139)"/>`).join('')}<circle cx="240" cy="139" r="20" fill="url(#${uid}-metal)" stroke="#76897f" stroke-width="3"/><circle cx="240" cy="139" r="7" fill="#536d60"/>`;
  } else if (id === 'supply') {
    body = `<ellipse cx="240" cy="298" rx="150" ry="20" fill="#303c351c"/><g class="device-shell"><path d="m91 100 192-49 111 69-194 56Z" fill="#c3c5b8"/><path d="m91 100 109 76v131L91 225Z" fill="#8e968a"/><path d="m200 176 194-56v135l-194 52Z" fill="url(#${uid}-metal)"/>${Array.from({length:8},(_,i)=>`<path d="m${211+i*21} ${181-i*6}v65" stroke="#606a60" stroke-width="8"/>`).join('')}<ellipse cx="239" cy="111" rx="70" ry="39" transform="rotate(-13 239 111)" fill="#617269" stroke="#dde1d3" stroke-width="4"/>${[22,40,58].map(r=>`<ellipse cx="239" cy="111" rx="${r}" ry="${r*.55}" transform="rotate(-13 239 111)" fill="none" stroke="#a8b6ab" stroke-width="2"/>`).join('')}<path d="m115 151 44 30v41l-44-31Z" fill="#414e45"/><path d="m113 163 27 20m-27-5 27 20" stroke="#222f28" stroke-width="5"/><path d="m307 273 34 31 32-9" stroke="#b66e41" stroke-width="8" fill="none"/><path d="m321 268 31 20 30-7" stroke="#ce9f62" stroke-width="7" fill="none"/></g>`;
  } else {
    body = `<ellipse cx="240" cy="291" rx="172" ry="22" fill="#3a403216"/><g class="motor-feet"><path d="m143 237-26 40 38 13 54-20-5-35Z" fill="#65766b"/><path d="m278 235 2 46 40 10 45-18-29-40Z" fill="#6d7e70"/><path d="m120 274 35 11 40-15-31-8Z" fill="#a1b0a1"/><path d="m285 276 35 10 38-14-32-8Z" fill="#a1b0a1"/><ellipse cx="149" cy="276" rx="6" ry="3" fill="#394c40"/><ellipse cx="322" cy="276" rx="6" ry="3" fill="#394c40"/></g><g class="device-shell"><path d="m143 126 159-45c49-13 89 16 89 71v45c0 25-14 45-38 52l-156 44Z" fill="url(#${uid}-body)"/>${Array.from({length:13},(_,i)=>`<path d="m${165+i*12} ${119-i*3.3}c39-10 60 30 60 65v42c0 20-7 35-21 43" fill="none" stroke="${i%2?'#8da08d':'#5b7561'}" stroke-width="7"/>`).join('')}<path d="m149 123 32-9c42-11 73 17 73 68v39c0 36-18 56-48 64l-33 9Z" fill="url(#${uid}-rim)"/><path d="m153 127 23-6c34-7 61 18 61 62v41c0 30-14 49-41 57l-22 6Z" fill="#596f59"/><ellipse cx="167" cy="207" rx="67" ry="87" transform="rotate(-14 167 207)" fill="url(#${uid}-metal)" stroke="#899b84" stroke-width="5"/><ellipse cx="166" cy="208" rx="54" ry="72" transform="rotate(-14 166 208)" fill="#6c826a" stroke="#a8b5a0" stroke-width="2"/><ellipse cx="165" cy="208" rx="42" ry="57" transform="rotate(-14 165 208)" fill="#415b47"/>${Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<ellipse cx="${165+Math.cos(a)*32}" cy="${208+Math.sin(a)*44}" rx="10" ry="16" transform="rotate(${i*30-12} ${165+Math.cos(a)*32} ${208+Math.sin(a)*44})" fill="url(#${uid}-copper)" stroke="#73462d" stroke-width="1.5"/>`}).join('')}<ellipse cx="165" cy="208" rx="21" ry="30" transform="rotate(-14 165 208)" fill="#a7ad9c" stroke="#465f49" stroke-width="6"/><path d="m163 194-71 19c-13 5-11 31 3 31l73-19c12-4 10-30-5-31Z" fill="url(#${uid}-shaft)" stroke="#7a857a" stroke-width="1"/><ellipse cx="91" cy="229" rx="10" ry="15" fill="#89938a" transform="rotate(-13 91 229)"/><path d="m94 215 54-15" stroke="#f1efda" stroke-width="3"/><g fill="#c0c7b3" stroke="#536a53" stroke-width="2"><circle cx="138" cy="143" r="6"/><circle cx="204" cy="165" r="6"/><circle cx="135" cy="260" r="6"/><circle cx="212" cy="246" r="6"/></g><path d="m234 104 2-35 63-17 32 23v36l-65 20Z" fill="#83967e" stroke="#566e55" stroke-width="2"/><path d="m236 69 32 23 63-17M268 92v38" fill="none" stroke="#b0bba4" stroke-width="2"/><path d="m244 70 49-13 25 17-49 13Z" fill="#a6b39a"/><circle cx="267" cy="101" r="3" fill="#4c654c"/><path d="m286 64 13-8 18 9" fill="none" stroke="#5f775b" stroke-width="3"/><path d="m290 158 52-14v35l-52 15Z" fill="#d1ccb0" stroke="#6f7f68" stroke-width="2"/><path d="m297 164 36-10m-36 16 28-8m-28 15 34-10" stroke="#67745e" stroke-width="2"/><path d="m301 182 13-4" stroke="#ad7b49" stroke-width="3"/><path d="m372 121 7 36m-8-3 7 34m-8-2 6 26" stroke="#4f6952" stroke-width="4"/></g>${industrial?'<path d="m337 111 11-4v85l-11 5Z" fill="#d39b58"/><path d="m342 113 7 13m-7-1 7 13m-7-1 7 13m-7-1 7 13m-7-1 7 13" stroke="#584f39" stroke-width="4"/>':''}${washer?'<path d="M380 166h39v22h-39" fill="#89948d"/><ellipse cx="421" cy="177" rx="15" ry="38" fill="#65746d" stroke="#b5bdb0" stroke-width="5"/>':''}`;
  }
  return `<svg class="device-art ${id}" viewBox="0 0 480 350" role="img" aria-label="Stylized illustration of a ${id==='fan'?'vintage desktop fan':id==='supply'?'power supply':'salvaged electric motor with copper windings'}"><defs><linearGradient id="${uid}-body" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="${industrial?'#bca16b':'#8f9f82'}"/><stop offset=".5" stop-color="${industrial?'#8c865a':'#728c6b'}"/><stop offset="1" stop-color="#4c6953"/></linearGradient><linearGradient id="${uid}-rim" x1="0" x2="1"><stop stop-color="#abb79f"/><stop offset=".5" stop-color="#6c8468"/><stop offset="1" stop-color="#3f5a44"/></linearGradient><linearGradient id="${uid}-metal" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#d8ddc8"/><stop offset=".35" stop-color="#a9b69c"/><stop offset="1" stop-color="#6b8169"/></linearGradient><linearGradient id="${uid}-copper" x1="0" x2="1"><stop stop-color="#9c5939"/><stop offset=".45" stop-color="#e4aa69"/><stop offset=".6" stop-color="#bd7b49"/><stop offset="1" stop-color="#874b32"/></linearGradient><linearGradient id="${uid}-shaft" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e6e4d4"/><stop offset=".4" stop-color="#c2c6b5"/><stop offset=".65" stop-color="#889587"/><stop offset="1" stop-color="#687c6d"/></linearGradient></defs>${body}</svg>`;
}
export function coilArt() { return `<svg viewBox="0 0 320 190" class="coil-art" aria-hidden="true"><defs><linearGradient id="coil" x1="0" x2="1"><stop stop-color="#80402b"/><stop offset=".3" stop-color="#f9b56c"/><stop offset=".55" stop-color="#bc673f"/><stop offset=".8" stop-color="#f4ad68"/><stop offset="1" stop-color="#9d5030"/></linearGradient></defs><ellipse cx="160" cy="157" rx="105" ry="15" fill="#2b3b2915"/><g transform="rotate(-15 160 100)">${Array.from({length:11},(_,i)=>`<ellipse cx="${110+i*9}" cy="95" rx="43" ry="58" fill="none" stroke="#773e2c" stroke-width="10"/><ellipse cx="${110+i*9}" cy="94" rx="43" ry="58" fill="none" stroke="url(#coil)" stroke-width="7"/>`).join('')}<path d="M204 150c30 0 20-30 45-20" fill="none" stroke="url(#coil)" stroke-width="7"/></g><g fill="#da9255"><path d="m53 54 4-10 4 10 10 4-10 4-4 10-4-10-10-4Z"/><path d="m258 82 3-7 3 7 7 3-7 3-3 7-3-7-7-3Z"/></g></svg>`; }

