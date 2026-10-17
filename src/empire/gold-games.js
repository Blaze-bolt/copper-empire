export const GOLD_HELP='Tilt the pan with the slider, pointer, arrow keys, or tilt buttons. Keep the gold marker inside the green pocket; shake to clear sediment. Excessive shaking creates instability. Complete three increasingly difficult rounds. A failed pan gives no gold and is free to retry.';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function createGoldGame(g){
 const e=g.bonus.goldEquipment||{},claim=g.id-101;
 return Object.assign(g,{claim,round:0,position:.5,velocity:0,tilt:0,target:.5,width:Math.min(.48,(.32-claim*.014)*(1+(e.pan||0)*.08+(e.station||0)*.06)),instability:0,sediment:.22,progress:0,outside:0,shakes:0,lastShake:-10,roundTime:0,roundScores:[],roundLength:Math.max(7.5,12*(1-(e.station||0)*.08-(e.supply||0)*.08)),stabilityFactor:1-(e.kit||0)*.12,currentFactor:1-(e.drone||0)*.2,equipment:e,duration:180*(1+(g.bonus.time||0))});
}
export function goldAction(g,action,{value=0,position}={}){
 if(action==='tilt'&&Number.isFinite(value))g.tilt=clamp(value,-1,1);
 if(action==='slider'&&Number.isFinite(value))g.tilt=clamp(value/100,-1,1);
 if(action==='pan-pointer'&&Number.isFinite(position))g.tilt=clamp((position-.5)*2,-1,1);
 if(action==='nudge'&&Number.isFinite(value))g.tilt=clamp(g.tilt+(value<0?-.15:.15),-1,1);
 if(action==='shake'&&g.elapsed-g.lastShake>=.7){g.lastShake=g.elapsed;g.shakes++;g.sediment=Math.max(0,g.sediment-.32);g.instability+=.19*g.stabilityFactor;if(g.instability>=1){g.status='failed';g.reason='The pan became too unstable. Let it settle between shakes.';}}
}
export function goldCurrent(g){
 const t=g.elapsed,phase=(g.seed%60)/10,c=g.claim;let current=.018*(c+1)*Math.sin(t*.8+phase);
 if(c===0)current=.018;
 if(c===2)current+=.035*Math.sin(t*1.7+phase);
 if(c===3||c===6)current+=.085*Math.sin(t*1.9)**5;
 if(c===4)current+=.04*Math.sin(t*2.1);
 if(c===5)current+=.03*Math.sin(t*.4)+g.sediment*.025;
 return current*g.currentFactor*(1+g.round*.18);
}
export function tickGoldGame(g,dt){
 g.roundTime+=dt;g.target=g.claim>=4?.5+.12*Math.sin(g.elapsed*.55+g.seed):.5;
 g.velocity+=(goldCurrent(g)+g.tilt*.5-g.velocity*3.2)*dt;g.position+=g.velocity*dt;
 g.instability=Math.max(0,g.instability-dt*.11);g.sediment=Math.min(1,g.sediment+dt*(.024+(g.claim>=5?.012:0)));
 const inside=Math.abs(g.position-g.target)<=g.width*(1-g.round*.12)/2&&g.sediment<.82;
 if(inside){g.progress+=dt;g.outside=Math.max(0,g.outside-dt*1.5);}else g.outside+=dt;
 if(g.position<0||g.position>1||g.outside>=6){g.status='failed';g.reason='The gold marker escaped its pocket for too long.';return;}
 if(g.progress>=g.roundLength&&g.shakes>0){
  g.roundScores.push(Math.max(.45,Math.min(1,g.progress/g.roundTime-.12*g.instability)));
  g.round++;if(g.round===3){g.status='success';g.score=g.roundScores.reduce((a,b)=>a+b,0)/3;return;}
  g.progress=0;g.roundTime=0;g.outside=0;g.shakes=0;g.sediment=.25;g.velocity*=.4;g.message='Round '+(g.round+1)+' — a narrower pocket and stronger current.';
 }
}
export function goldView(g){
 const width=g.width*(1-g.round*.12),pc=n=>Math.round(n*100);
 return {scene:`<div class="gold-pan-scene"><div class="river-flow river-${g.claim}"></div><div class="virtual-pan" style="transform:rotate(${g.tilt*10}deg)"><div class="pan-rings"></div><div class="pan-gold">✦ · ✧</div></div></div><p class="expansion-note">Panning round ${g.round+1}/3 · recovered hold ${g.progress.toFixed(1)}/${g.roundLength.toFixed(1)}s${g.equipment.map?' · next current '+(goldCurrent({...g,elapsed:g.elapsed+1})>0?'→':'←'):''}</p><div class="timing-track expansion-timing" data-pan-track><i class="timing-zone" style="left:${pc(g.target-width/2)}%;width:${pc(width)}%"></i><b class="timing-marker" style="left:${pc(g.position)}%"></b></div><div class="pan-readings"><span>Sediment ${pc(g.sediment)}%</span><span>Instability ${pc(g.instability)}%</span><span>Outside ${g.outside.toFixed(1)}/6s</span></div>`,controls:`<div class="sliders"><label>Pan tilt <output>${pc(g.tilt)}</output><input type="range" min="-100" max="100" step="1" value="${pc(g.tilt)}" data-g="slider" data-i="0" aria-label="Pan tilt"/></label></div><div class="game-tray"><button class="game-button" data-g="nudge" data-value="-1">← Tilt left</button><button class="game-button" data-g="tilt" data-value="0">Center tilt</button><button class="game-button" data-g="nudge" data-value="1">Tilt right →</button><button class="game-button" data-g="shake">Shake pan · Space</button></div>`};
}
