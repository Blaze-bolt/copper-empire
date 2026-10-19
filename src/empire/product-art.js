import {MACHINE_PARTS as P} from './industrial-art.js';
import {productById} from './industry-data.js';
const {C,many,part,at,line,rect,box,base,wire,screen,coil,ring,fan,radiator,bushing,motor,generator,cabinet,transformer,belt,tower,robot}=P;
const pallet=(x=95,y=265,w=290)=>part('shipping-pallet',box(x,y,w,16,10)+many(3,i=>rect(x+20+i*(w-50)/3,y+14,25,15,C.side)));
const spool=(x,y,r=85,w=120)=>part('copper-spool',`<ellipse cx="${x}" cy="${y}" rx="23" ry="${r}" fill="#9c8261" stroke="${C.dark}" stroke-width="5"/>`+coil(x,y,w,r*1.65,18)+`<ellipse cx="${x+w}" cy="${y}" rx="26" ry="${r}" fill="#9c8261" stroke="${C.dark}" stroke-width="5"/><ellipse cx="${x+w}" cy="${y}" rx="7" ry="14" fill="${C.side}"/>`);
export const PRODUCT_MODELS={
 F01:()=>pallet(90,270,295)+spool(150,172,85,155)+wire('M170 238q-55 15-55-20'),
 F02:()=>part('insulated-cable-coil',many(5,i=>`<ellipse cx="240" cy="${150+i*14}" rx="130" ry="62" fill="none" stroke="${C.edge}" stroke-width="22"/><ellipse cx="240" cy="${149+i*14}" rx="130" ry="62" fill="none" stroke="${C.dark}" stroke-width="17"/>`)+line('M125 192Q60 240 95 260m245-111q65-20 70 25',C.dark,24)+coil(83,259,26,23,4)+coil(393,170,25,23,4)),
 F03:()=>pallet()+many(7,i=>line(`M${120+i%2*8} ${170+i*12}h235`,C.copper,16)+`<ellipse cx="355" cy="${170+i*12}" rx="8" ry="7" fill="${C.dark}" stroke="${C.shine}" stroke-width="3"/>`)+line('M150 155v100m145-100v100',C.edge,6)+wire('M95 155v-50q0-20 22-20h38m220 70v-40q0-20 20-20h25'),
 F04:()=>pallet(80,267,320)+many(8,i=>`<path d="M100 ${239-i*12}l75-60h215l-75 60Z" fill="${i%2?C.copper:C.shine}" stroke="${C.side}" stroke-width="3"/>`)+line('M190 170l-56 45v49m207-94-56 45v49',C.edge,8),
 F05:()=>box(95,70,300,195,8)+rect(110,85,268,160,C.dark)+many(5,i=>wire(`M${135+i*46} 105v100q0 20 22 20t22-20V105`))+bushing(135,80,25)+bushing(365,80,25),
 F06:()=>pallet(130,275,230)+ring(240,164,100,35,20)+wire('M290 245q105 20 90-50')+rect(140,263,200,12,C.side),
 F07:()=>pallet(90,270,300)+box(125,90,235,155,9)+rect(170,125,135,80,C.dark)+many(12,i=>line(`M${130+i*5} 110v115m${170-i*5} -115v115`,i%2?C.copper:C.shine,4))+wire('M133 232h-38v-60m250 60h40v-60'),
 F08:()=>part('five-terminal-harness',line('M100 200h100q25 0 45-20l100-105m-100 105 125-50m-125 50h140m-140 0 120 65m-120-65 65 110',C.dark,24)+many(5,i=>line(`M105 ${190+i*5}h90q25 0 48-15L${[345,370,385,365,310][i]} ${[75,130,180,245,290][i]}`,['#dc955e','#88bba7','#c7ae7c','#8eacd4','#ba91b9'][i],4))+many(5,i=>box([330,355,370,350,295][i],[50,105,155,220,265][i],35,22,6))+box(62,175,42,45,5)),
 F09:()=>pallet(70,284,340)+ring(240,150,120,40,32)+many(4,i=>at(240,150,rect(-16,-136,32,15,C.edge),1,i*90))+wire('M345 219h75v45m-305-45H65v45'),
 F10:()=>pallet()+box(112,112,260,140,8)+many(20,i=>rect(135+i*10,105,4,150,C.edge,0))+many(6,i=>wire(`M110 ${119+i*22}h250q22 0 22 11t-22 11H110`))+wire('M110 120H75v-35m285 160h40v-35'),
 F11:()=>box(75,100,330,155,14)+rect(87,110,305,130,C.dark)+many(3,i=>line(`M${180+i*75} 112v126`,C.edge,3))+line('M90 170h298',C.edge,3)+many(12,i=>at(110+i%4*76,133+Math.floor(i/4)*36,i%3===0?ring(0,0,10,4,0):i%3===1?rect(-18,-7,36,14,C.copper):line('M-17 6h35v-12',C.copper,8))),
 F12:()=>pallet()+many(4,i=>part('perforated-busbar',rect(80+i*12,115+i*35,320,15,C.copper)+many(7,j=>`<circle cx="${105+i*12+j*43}" cy="${122+i*35}" r="4" fill="${C.dark}"/>`)+many(2,j=>bushing(120+j*220+i*12,140+i*35,16)))),
 F13:()=>pallet()+box(102,75,280,180,16)+fan(173,150,50)+fan(300,150,50)+wire('M125 221h225V85h-25m-180 0v130h180'),
 F14:()=>pallet(55,281,380)+line('M95 278V70h290v208',C.edge,12)+part('steel-cable-reel',spool(160,170,88,150))+many(8,i=>line(`M${167+i*18} 102v135`,C.dark,13))+wire('M330 210h60v40')+coil(384,248,25,18,4),
 F15:()=>pallet(70,280,340)+generator(135,112,230,126)+rect(75,167,62,25,C.edge)+coil(235,195,85,45,9)+rect(355,255,20,25,C.side),
 F16:()=>pallet(70,280,340)+transformer(145,130,175,130,4)+radiator(80,148,44,108)+radiator(355,147,35,110)+screen(272,210,30,30),
 F17:()=>pallet(145,285,190)+cabinet(175,45,120,225,5)+wire('M180 55h108')+many(3,i=>bushing(195+i*38,45,23)),
 F18:()=>pallet(45,283,390)+motor(95,150,175,100)+box(290,153,95,105,14)+rect(270,195,25,25,C.edge)+cabinet(345,70,55,72,2)+wire('M260 140h80V88'),
 F19:()=>pallet(60,280,370)+many(3,i=>cabinet(85+i*110,92,83,167,4))+many(3,i=>wire(`M95 ${55+i*14}h320v165`))+many(3,i=>radiator(102+i*110,230,50,22)),
 F20:()=>base(30,282,420)+transformer(90,178,100,85,3)+many(2,i=>cabinet(280+i*72,165,55,100,3))+many(4,i=>bushing(100+i*76,138,55))+many(2,i=>wire(`M95 ${117+i*18}h290`))+box(210,230,45,40),
 F21:()=>base(25,280,425)+generator(75,110,145,80)+generator(250,180,150,82)+generator(110,223,100,50)+box(285,65,65,95)+radiator(294,76,45,75)+wire('M75 96h310v80')+many(3,i=>bushing(95+i*90,100,24)),
 F22:()=>base(30,280,420)+many(3,i=>cabinet(55+i*115,195,65,65,2))+tower(210,55,60,125)+many(3,i=>wire(`M${85+i*115} 190V${155-i*17}H240`))+many(5,i=>bushing(65+i*80,169,38)),
 F23:()=>base(25,280,430)+belt(50,220,155,-14)+belt(270,185,155,8)+robot(190,260,1.1)+robot(308,255,.85)+motor(70,118,90,65)+cabinet(365,88,45,85,3)+wire('M50 84h295v70')+box(220,86,70,65),
 F24:()=>base(20,280,435)+transformer(48,195,70,65,3)+cabinet(155,139,65,122,3)+generator(263,207,140,56)+tower(329,55,52,132)+many(3,i=>wire(`M${65+i*120} 122h65V95`))+screen(234,89,55,38)+line('M260 128v65',C.edge,7),
 F25:()=>base(18,282,437)+generator(65,207,145,62)+generator(276,207,135,62)+box(178,109,130,120,12)+many(2,i=>transformer(59+i*285,100,55,65,2))+tower(220,44,48,70)+wire('M45 185V68h370v117')+many(6,i=>bushing(70+i*61,186,30))+screen(209,132,62,47)
};
export function productIllustration(id,context='product'){const p=productById(id);if(!p||!PRODUCT_MODELS[id])throw Error('Unknown factory product model.');return `<svg class="device-illustration product-illustration" viewBox="0 0 480 330" role="img" aria-label="${p.name}" data-product-model="${id}"><ellipse cx="240" cy="306" rx="175" ry="10" fill="#101b1b" opacity=".45"/>${PRODUCT_MODELS[id]()}</svg>`;}
