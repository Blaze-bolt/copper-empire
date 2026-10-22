export const MUSIC_TRACKS=[
 {id:'ocean-dih',title:'Ocean Dih',file:'ocean-dih.mp3'},
 {id:'mugamillion',title:'MugaMillion',file:'mugamillion.mp3'},
 {id:'jazzy-juice',title:'Jazzy Juice',file:'jazzy-juice.mp3'},
 {id:'thats-what-i-like',title:'Thats what I like',file:'thats-what-i-like.mp3'},
 {id:'grief',title:'Grief',file:'grief.mp3'},
 {id:'dreams-become-real',title:'Dreams Become Real',file:'dreams-become-real.mp3'},
 {id:'sunshine',title:'Sunshine',file:'sunshine.mp3'},
 {id:'rickroll',title:'RickRoll',file:'rickroll.mp3'}
];
// Calibrate all recordings to the existing ambient track's level, with peak headroom.
export function normalizeMusicBuffer(buffer){let square=0,peak=0,count=0;for(let c=0;c<buffer.numberOfChannels;c++){const data=buffer.getChannelData(c);for(let i=0;i<data.length;i++){const value=data[i];square+=value*value;peak=Math.max(peak,Math.abs(value));count++;}}const rms=Math.sqrt(square/Math.max(1,count)),gain=rms?Math.min(.052/rms,.32/Math.max(.0001,peak)):1;for(let c=0;c<buffer.numberOfChannels;c++){const data=buffer.getChannelData(c);for(let i=0;i<data.length;i++)data[i]*=gain;}return buffer;}

export const PLAYBACK_MODES=['repeat','random','order'];
export function nextMusicTrack(current,mode,random=Math.random,tracks=MUSIC_TRACKS){
 const index=tracks.findIndex(t=>t.id===current);if(index<0)return tracks[0]?.id;
 if(mode==='repeat'||tracks.length<2)return current;
 if(mode==='order')return tracks[(index+1)%tracks.length].id;
 const pick=Math.max(0,Math.min(tracks.length-2,Math.floor(random()*(tracks.length-1))));
 return tracks[pick>=index?pick+1:pick].id;
}
