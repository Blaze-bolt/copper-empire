// Lossless MP3 frame excerpt; only used when preparing a licensed source asset.
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
const input=process.argv[2];if(!input)throw Error('Pass the original licensed MP3 path.');
const data=await readFile(input),frames=[];let elapsed=0;
for(let offset=0;offset<data.length-4;){
 const h=data.readUInt32BE(offset),sync=(h>>>21)===0x7ff,version=(h>>>19)&3,layer=(h>>>17)&3,bi=(h>>>12)&15,si=(h>>>10)&3,padding=(h>>>9)&1;
 if(!sync||version===1||layer!==1||bi===0||bi===15||si===3){offset++;continue;}
 const bitrate=(version===3?[0,32,40,48,56,64,80,96,112,128,160,192,224,256,320]:[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160])[bi]*1000;
 const rate=[44100,48000,32000][si]/(version===3?1:version===2?2:4),length=Math.floor((version===3?144:72)*bitrate/rate)+padding;
 if(offset+length>data.length)break;frames.push({offset,end:offset+length,at:elapsed});elapsed+=(version===3?1152:576)/rate;offset+=length;
}
if(elapsed<180||frames.length<1000)throw Error('Source MP3 did not parse as expected.');
const chosen=frames.filter(frame=>frame.at>=90&&frame.at<180);await writeFile('assets/music/dreams-become-real.mp3',data.subarray(chosen[0].offset,chosen.at(-1).end));console.log('Prepared a 90-second licensed ambient excerpt; runtime crossfades the loop.');
