// Individual physical layouts. Shared machining primitives are materials/parts, never device templates.
const C={dark:'#273c3e',edge:'#b4c5bb',metal:'#728b83',side:'#475e59',copper:'#dc955e',shine:'#f0bc7f',screen:'#153e42',led:'#a6d8c4'};
const many=(n,f)=>Array.from({length:n},(_,i)=>f(i)).join('');
const part=(name,body)=>`<g data-part="${name}">${body}</g>`;
const at=(x,y,body,s=1,angle=0)=>`<g transform="translate(${x} ${y}) scale(${s}) rotate(${angle})">${body}</g>`;
const line=(d,color=C.copper,w=5)=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const rect=(x,y,w,h,color=C.metal,r=3)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${color}" stroke="${C.dark}" stroke-width="2"/>`;
const box=(x,y,w,h,depth=14)=>part('housing',`<path d="M${x} ${y}l${depth} ${-depth*.6}h${w}l${-depth} ${depth*.6}Z" fill="${C.edge}" stroke="${C.dark}" stroke-width="2"/>${rect(x,y,w,h)}<path d="M${x+w} ${y}l${depth} ${-depth*.6}v${h}l${-depth} ${depth*.6}Z" fill="${C.side}" stroke="${C.dark}" stroke-width="2"/>`);
const vessel=(x,y,w,h)=>part('cylindrical-vessel',rect(x,y,w,h,C.metal,0)+`<ellipse cx="${x+w/2}" cy="${y+h}" rx="${w/2}" ry="${w*.16}" fill="${C.side}" stroke="${C.dark}" stroke-width="2"/><ellipse cx="${x+w/2}" cy="${y}" rx="${w/2}" ry="${w*.16}" fill="${C.edge}" stroke="${C.dark}" stroke-width="2"/>`+line(`M${x+w*.75} ${y+10}v${h-16}`,C.edge,3));
const capacitor=(x,y,w=25,h=45)=>part('capacitor',vessel(x,y,w,h)+rect(x+w*.4,y-9,w*.2,8,C.copper,0));
const foot=(x,y,w=50)=>part('mount',rect(x,y,w,12,C.side)+rect(x+6,y+3,5,4,C.edge,1)+rect(x+w-11,y+3,5,4,C.edge,1));
const base=(x=55,y=280,w=360)=>part('foundation',box(x,y,w,12,10));
const wire=d=>part('copper-conductor',line(d,C.dark,9)+line(d,C.copper,5));
const screen=(x,y,w=28,h=20)=>part('instrument',rect(x,y,w,h,C.screen)+line(`M${x+4} ${y+h*.7}l5 -4 5 2 5 -7`,C.led,2));
const coil=(x,y,w=60,h=65,n=8)=>part('copper-winding',many(n,i=>`<ellipse cx="${x+i*w/n}" cy="${y}" rx="${w/n*1.1}" ry="${h/2}" fill="none" stroke="${C.dark}" stroke-width="7"/><ellipse cx="${x+i*w/n}" cy="${y-1}" rx="${w/n*1.1}" ry="${h/2}" fill="none" stroke="${i%2?C.copper:C.shine}" stroke-width="4"/>`));
const ring=(x,y,r=50,thickness=15,slots=12)=>part('stator',`<path fill-rule="evenodd" d="M${x-r} ${y}a${r} ${r} 0 1 0 ${r*2} 0a${r} ${r} 0 1 0 ${-r*2} 0M${x-r+thickness} ${y}a${r-thickness} ${r-thickness} 0 1 1 ${(r-thickness)*2} 0a${r-thickness} ${r-thickness} 0 1 1 ${-(r-thickness)*2} 0" fill="${C.side}" stroke="${C.edge}" stroke-width="3"/>${many(slots,i=>`<path data-part="copper-slot" d="M${x} ${y-r+5}v${thickness-8}" stroke="${C.copper}" stroke-width="7" transform="rotate(${i*360/slots} ${x} ${y})"/>`)}`);
const fan=(x,y,r=25)=>part('cooling-fan',`<circle cx="${x}" cy="${y}" r="${r}" fill="${C.dark}" stroke="${C.edge}" stroke-width="3"/><g class="industrial-fan" style="transform-origin:${x}px ${y}px">${many(5,i=>`<path d="M${x} ${y}q${-r*.9} ${-r*.2} ${-r*.45} ${-r*.7}q${r*.6} ${-r*.1} ${r*.45} ${r*.7}" fill="${C.metal}" transform="rotate(${i*72} ${x} ${y})"/>`)}</g><circle cx="${x}" cy="${y}" r="4" fill="${C.copper}"/>`);
const radiator=(x,y,w=45,h=95)=>part('radiator',rect(x,y,w,h,C.side)+many(Math.floor(w/7),i=>rect(x+3+i*7,y+4,3,h-8,C.edge,0)));
const bushing=(x,y,h=45)=>part('ceramic-bushing',line(`M${x} ${y}v${-h}`,C.dark,10)+many(4,i=>`<ellipse cx="${x}" cy="${y-h*.2-i*h*.18}" rx="9" ry="4" fill="${C.edge}" stroke="${C.side}"/>`)+rect(x-4,y-h-5,8,8,C.copper));
const motor=(x,y,w=100,h=65,{fins=true,terminal=true,cutout=true}={})=>part('motor',foot(x+9,y+h,w-15)+rect(x,y,w,h,C.metal,Math.min(22,h/3))+`<ellipse cx="${x}" cy="${y+h/2}" rx="${h*.22}" ry="${h/2}" fill="${C.side}" stroke="${C.edge}" stroke-width="3"/>`+(fins?many(7,i=>line(`M${x+15+i*(w-25)/7} ${y+5}v${h-10}`,C.side,3)):'')+rect(x-28,y+h*.42,30,h*.17,C.edge)+(terminal?box(x+w*.5,y-15,w*.3,17,7):'')+(cutout?coil(x+w*.22,y+h*.65,w*.35,h*.33,5):''));
const generator=(x,y,w=130,h=80)=>part('enclosed-generator',motor(x,y,w,h,{fins:false})+fan(x+w-22,y+h*.5,h*.27)+line(`M${x+15} ${y+10}h${w-45}`,C.edge,3));
const cabinet=(x,y,w=55,h=115,modules=3)=>part('cabinet',box(x,y,w,h,12)+many(modules,i=>rect(x+6,y+8+i*(h-16)/modules,w-12,(h-23)/modules,C.side)+screen(x+11,y+12+i*(h-16)/modules,18,10))+wire(`M${x+w-8} ${y+10}v${h-20}`));
const transformer=(x,y,w=80,h=80,bushings=3)=>part('transformer',box(x,y,w,h)+radiator(x-20,y+12,17,h-17)+radiator(x+w+15,y+9,20,h-13)+many(bushings,i=>bushing(x+13+i*(w-15)/bushings,y,30))+coil(x+15,y+h*.68,w*.5,h*.35,6));
const belt=(x,y,w=140,angle=0)=>part('conveyor',at(x,y,`<path d="M0 0h${w}v23H0Z" fill="${C.side}" stroke="${C.edge}" stroke-width="3"/>${many(Math.floor(w/15),i=>line(`M${i*15+5} 3v17`,C.dark,3))}${line(`M10 23v35m${w-20} -35v35`,C.metal,7)}${rect(w*.5,3,17,12,C.copper)}`,1,angle));
const bin=(x,y,w=42,h=37)=>part('collection-bin',`<path d="M${x} ${y}h${w}l-5 ${h}h${-w+10}Z" fill="${C.side}" stroke="${C.edge}" stroke-width="2"/>${coil(x+9,y+12,w-18,14,4)}`);
const tower=(x,y,w=70,h=140)=>part('tower',box(x,y,w,h,18)+many(3,i=>screen(x+8,y+16+i*(h-25)/3,w-16,18))+line(`M${x+5} ${y+h-8}l${w-10} ${-h+20}m${-w+10} 0l${w-10} ${h-20}`,C.edge,3)+wire(`M${x+w+12} ${y+8}v${h-10}`));
const robot=(x,y,s=1)=>part('robot-arm',at(x,y,`${foot(-24,0,50)}${line('M0 0v-24l-33 -45 35 -40 25 18',C.dark,19)}${line('M0 0v-24l-33 -45 35 -40 25 18',C.metal,13)}${wire('M8 -10l-32 -57 27 -31 20 14')}${[-24,-69,-109].map((v,i)=>`<circle cx="${i===1?-33:i===2?2:0}" cy="${v}" r="9" fill="${C.edge}" stroke="${C.dark}" stroke-width="3"/>`).join('')}${line('M27 -91l12 -5m-12 5 9 8',C.copper,5)}`,s));
const turbine=(x,y,r=65)=>part('turbine',ring(x,y,r,9,24)+many(22,i=>`<path d="M${x+8} ${y}l${r*.6} ${-r*.4} ${r*.18} ${r*.2}Z" fill="${C.edge}" stroke="${C.side}" transform="rotate(${i*360/22} ${x} ${y})"/>`)+`<circle cx="${x}" cy="${y}" r="12" fill="${C.copper}"/>`);
const radial=(count,cx,cy,r,draw)=>many(count,i=>{const a=i*Math.PI*2/count-Math.PI/2;return draw(cx+Math.cos(a)*r,cy+Math.sin(a)*r,i);});
const tiltedRing=(x,y,r,squash=.5,angle=0)=>at(x,y,`<g transform="scale(1 ${squash})">${ring(0,0,r,8,0)}</g>`,1,angle);
const emblem=(x,y)=>part('empire-emblem',`<circle cx="${x}" cy="${y}" r="16" fill="${C.dark}" stroke="${C.copper}" stroke-width="3"/><path d="M${x+6} ${y-7}h-10v14h10m-2-10h-5v6h5" fill="none" stroke="${C.shine}" stroke-width="2"/>`);
// Explicit authored device layouts. Coordinates, hierarchy and negative spaces carry identity.
export const INDUSTRIAL_MODELS={
29:()=>base()+generator(100,150,210,100)+box(330,165,55,85)+wire('M275 145v-28h80v48')+rect(65,188,35,20,C.edge),
30:()=>base()+belt(60,220,115,-20)+box(185,133,125,120)+line('M170 150V90h150v70',C.edge,10)+screen(210,98,50,24)+belt(290,230,75,20)+bin(330,270)+bin(383,254),
31:()=>base()+line('M100 275V120h255v155',C.edge,12)+ring(220,190,83,25,18)+line('M95 190h250',C.edge,11)+coil(184,190,65,48)+foot(95,269,40)+foot(310,269,40)+wire('M280 130q85 -55 95 30'),
32:()=>base()+cabinet(85,130,60,135)+cabinet(315,95,57,170)+transformer(184,180,75,85)+wire('M100 115V70h265v22'),
33:()=>base(42,280,390)+motor(100,135,240,115)+fan(170,190,30)+fan(287,190,35)+rect(40,182,63,26,C.edge)+cabinet(350,176,35,80,2),
34:()=>base()+line('M95 140v135h280V130M95 200h280',C.edge,9)+many(6,i=>motor(110+i%3*90,145+Math.floor(i/3)*65,65,42))+wire('M115 125h245v138')+screen(386,180),
35:()=>base(120,281,230)+tower(195,80,105,195)+many(4,i=>capacitor(115+i%2*32,160+Math.floor(i/2)*55,26,45))+wire('M318 260v-70h-45')+rect(215,225,65,40,C.screen),
36:()=>base()+radiator(65,152,55,116)+radiator(345,150,60,118)+many(3,i=>coil(150+i*65,205,40,100))+box(115,245,220,25)+many(5,i=>bushing(135+i*43,155,63)),
37:()=>base()+ring(210,175,100,30,20)+line('M120 255l35 -40m120 0 32 40',C.edge,15)+rect(192,165,150,22,C.edge)+ring(335,176,40,13,8)+cabinet(380,191,30,74,2),
38:()=>base(35,280,415)+generator(65,150,140,90)+generator(250,195,112,65)+radiator(375,130,48,130)+cabinet(230,80,50,85,2)+wire('M85 120V65h250v104'),
39:()=>base()+motor(95,150,200,95)+box(300,180,80,75)+ring(355,222,35,12,8)+fan(105,195,35)+wire('M200 140v-35h100'),
40:()=>base(25,280,420)+tower(210,75,65,170)+belt(30,220,145,-28)+belt(280,170,130,20)+bin(350,256,60)+bin(80,260,58)+ring(170,230,32,11,8)+ring(315,235,27,10,8)+line('M160 140h140',C.edge,7),
41:()=>base(25,282,425)+motor(85,155,280,95)+fan(190,187,28)+fan(305,190,33)+rect(35,192,52,27,C.edge)+many(4,i=>foot(85+i*82,265,34)),
42:()=>base(25,280,420)+generator(50,170,95,63)+generator(183,203,100,55)+generator(305,143,97,65)+tower(183,56,66,132)+wire('M65 150V110h265v30')+line('M265 275h135v-45',C.edge,8),
43:()=>base(25,280,425)+belt(42,227,360)+many(4,i=>ring(88+i*90,211,35,12,8))+line('M55 190V128h352v85',C.edge,9)+screen(210,135,60,34)+bin(340,265)+bin(395,265),
44:()=>base(20,280,425)+generator(55,160,150,85)+generator(255,175,130,70)+rect(205,195,50,13,C.edge)+radiator(385,93,37,170)+wire('M80 145q40 -100 100 -20m105 25q15 -80 70 -15')+line('M55 275l60 -25 80 25 80 -25 85 25',C.edge,5),
45:()=>base(110,280,250)+`<path d="M125 150l55 -65h133l55 65-25 110H150Z" fill="${C.metal}" stroke="${C.edge}" stroke-width="4"/>`+many(4,i=>capacitor(165+i*40,87,25,50))+screen(225,173,67,47)+wire('M170 165q-35 40 0 70h45')+screen(328,209,33,24),
46:()=>base(135,285,205)+vessel(187,65,95,202)+tiltedRing(235,125,82,.35)+line('M185 180l-58 98m156-100 65 100',C.edge,15)+coil(210,222,52,60)+bushing(175,250,35)+bushing(310,250,35),
47:()=>base(60,280,355)+many(6,i=>at(110+i%3*120,150+Math.floor(i/3)*88,coil(0,0,45,60),1,i%2?25:-25))+line('M90 190h290',C.edge,8)+wire('M110 255h270V115')+screen(365,95,37,32),
48:()=>base(110,280,250)+ring(240,172,110,7,0)+tiltedRing(240,172,110,.6,50)+tiltedRing(240,172,110,.6,-50)+ring(240,172,64,24,16)+radial(4,240,172,116,(x,y)=>box(x-13,y-12,26,24,5))+line('M150 110l-20 165m200-165 20 165',C.edge,8)+wire('M172 220q-50 40 10 42m115-40q50 45 -10 40'),
49:()=>base(55,280,365)+radiator(70,102,55,165)+radiator(340,102,55,165)+line('M120 185h230',C.edge,15)+coil(170,185,110,85)+box(135,80,190,29)+screen(210,84,55,20)+wire('M120 239h220'),
50:()=>base(45,280,375)+many(8,i=>motor(60+i%4*85,140+Math.floor(i/4)*65,67,43,{terminal:false}))+cabinet(400,140,28,130,4)+wire('M70 125h320v133'),
51:()=>base(65,282,350)+radial(8,240,185,115,(x,y,i)=>box(x-20,y-12,30+(i%3)*9,36+(i%2)*20,8))+`<path d="M210 70h60l35 35v135l-35 35h-60l-35-35V105Z" fill="${C.metal}" stroke="${C.edge}" stroke-width="4"/>`+coil(219,166,46,100)+screen(218,89,45,25)+wire('M120 250h240v-130'),
52:()=>base(70,283,345)+tower(95,64,40,190)+tower(352,50,35,208)+box(195,130,80,115)+tiltedRing(240,182,106,.38,0)+tiltedRing(240,182,106,.38,60)+tiltedRing(240,182,106,.38,-60)+radial(6,240,182,85,(x,y)=>at(x,y,coil(-13,0,26,30,4)))+emblem(236,178),
53:()=>base(115,275,245)+radial(3,240,183,70,(x,y)=>coil(x-22,y,45,60))+ring(240,183,30,9,8)+line('M160 260l80 -130 80 130',C.edge,9)+wire('M190 140q-70 -35 -30 40m130 45q90 15 30 -40')+line('M350 235v-90l-65 -10',C.edge,5),
54:()=>base(90,280,300)+cabinet(105,70,110,205,4)+ring(300,190,55,12,12)+box(265,230,75,35)+wire('M212 115h150v145')+screen(277,180,42,23),
55:()=>base(80,280,330)+turbine(240,165,101)+line('M125 267V165h30m170 0h30v102',C.edge,13)+line('M365 140l30 -45h-70',C.metal,5)+wire('M155 263h170v-30'),
56:()=>box(55,85,365,190,12)+many(6,i=>wire(`M75 ${108+i*27}h330`))+many(4,i=>cabinet(90+i*83,123,45,93,2))+many(4,i=>bushing(72+i*105,263,30)),
57:()=>base()+line('M100 170h280',C.edge,17)+coil(145,170,185,80)+radial(6,240,170,102,(x,y)=>at(x,y,coil(-20,0,40,45,5)))+ring(95,170,35,12,10)+ring(375,170,40,14,10)+line('M95 210v60m280-60v60',C.edge,12),
58:()=>base(35,280,410)+cabinet(55,75,65,190,6)+cabinet(135,45,65,155,5)+cabinet(270,45,65,155,5)+cabinet(355,80,65,185,6)+box(180,233,130,35)+many(3,i=>screen(188+i*40,215,35,27))+line('M70 60V25h305v40',C.edge,8),
59:()=>base()+many(3,i=>cabinet(80+i*110,85+i*36,78,178-i*34,4))+many(6,i=>capacitor(94+i%3*110,217+Math.floor(i/3)*22,17,20))+wire('M100 65h105v38h110v38h80'),
60:()=>base(30,280,420)+generator(95,170,260,90)+line('M55 275V120q185 -170 370 0v155',C.edge,14)+radiator(50,188,35,74)+radiator(375,188,35,74)+line('M75 125h325',C.metal,9)+wire('M115 138h240'),
61:()=>base()+`<g transform="translate(240 175) scale(1.35 .65)">${ring(0,0,125,14,24)}${radial(12,0,0,110,(x,y,i)=>at(x,y,coil(-12,0,24,33,4),1,i*30))}</g>`+box(67,210,110,48)+screen(350,225,40,28),
62:()=>base(30,280,420)+transformer(100,132,65,70)+transformer(280,132,65,70)+transformer(100,221,65,54)+transformer(280,221,65,54)+wire('M120 97h190v100H120Z')+screen(220,168,37,28),
63:()=>base(70,280,335)+line('M90 95v177h284V95M90 150h284M90 210h284',C.edge,9)+many(9,i=>motor(110+i%3*88,100+Math.floor(i/3)*60,62,40,{terminal:false}))+radiator(380,100,33,168)+wire('M100 80h265v187'),
64:()=>base(90,280,300)+`<path d="M190 60h100l35 105-35 110H190l-35-110Z" fill="${C.side}" stroke="${C.edge}" stroke-width="4"/>`+many(6,i=>box(i%2?300:100,85+Math.floor(i/2)*62,65,43,8))+wire('M240 72v190')+line('M165 255l145 -150m-145 0 145 150',C.edge,8),
65:()=>base(45,265,390)+box(62,155,350,95,15)+many(16,i=>box(75+i%4*86,163+Math.floor(i/4)*21,65,14,5))+many(3,i=>wire(`M70 ${185+i*22}h330`))+fan(63,145,23)+fan(411,145,23),
66:()=>base(45,280,390)+box(60,90,330,25)+many(6,i=>box(72+i*50,125,32,142,9)+wire(`M${80+i*50} 145v100`))+line('M65 275h330',C.edge,8)+screen(378,175,43,48)+many(5,i=>line(`M${92+i*50} 103v4`,C.dark,10)),
67:()=>base(95,280,300)+ring(240,175,88,27,0)+radial(8,240,175,70,(x,y,i)=>at(x,y,coil(-15,0,30,40,5),1,i*45))+many(6,i=>box(100+i*53,262,25,20,5))+wire('M120 235q-60 -90 5 -125m230 0q55 100 -10 130'),
68:()=>base(20,285,435)+belt(30,240,180)+belt(255,235,180)+tower(202,70,60,180)+box(45,133,70,80)+box(325,125,85,80)+box(135,165,60,60)+many(3,i=>box(135+i*80,247,35,30))+line('M65 90h110v65m140-40h100v80',C.edge,6),
69:()=>base(30,280,425)+motor(130,160,250,85)+ring(110,196,75,17,16)+ring(390,197,34,11,8)+coil(220,202,75,70)+line('M50 197h370',C.edge,8),
70:()=>base(80,280,320)+radial(6,240,177,106,(x,y,i)=>at(x,y,box(-27,-20,50,42,7)+robot(0,8,.35),.8,i*60))+ring(240,177,43,15,8)+radial(6,240,177,65,(x,y)=>wire(`M240 177L${x} ${y}`)),
71:()=>base(20,280,425)+many(4,i=>generator(65+i%2*200,115+Math.floor(i/2)*95,135,65))+wire('M40 205h365M225 80v195')+radiator(405,135,26,125)+screen(220,60,40,25),
72:()=>base(30,280,420)+turbine(125,170,80)+turbine(350,192,52)+motor(205,167,95,65,{terminal:false,cutout:false})+line('M85 190h305',C.edge,10)+radiator(180,90,38,60)+line('M400 220v-95h-85',C.metal,14)+wire('M215 243h88v-20'),
73:()=>base(40,280,405)+many(9,i=>coil(100+i%3*120,130+Math.floor(i/3)*60,45,40))+many(4,i=>tower(i%2?390:45,i<2?80:195,25,75))+wire('M90 175h270M90 245h270M240 100v165'),
74:()=>base(50,280,380)+vessel(178,77,115,185)+ring(236,160,56,12,12)+cabinet(75,157,60,100,3)+radiator(330,145,65,117)+wire('M128 230h50m118 0h40')+screen(205,240,56,22),
75:()=>base(40,280,400)+box(70,230,105,45)+box(190,186,105,90)+box(310,141,105,135)+ring(122,187,52,17,12)+ring(241,141,52,17,12)+ring(361,96,52,17,12)+wire('M170 225h45v-45h120')+line('M170 252h20m105-45h17',C.edge,7),
76:()=>base(40,280,400)+tower(208,45,65,225)+box(65,130,90,60)+box(330,130,90,60)+box(130,220,65,50)+box(290,220,65,50)+belt(130,110,80)+belt(270,110,80)+bin(75,245)+bin(375,245),
77:()=>base(25,280,425)+many(12,i=>generator(50+i%4*74,95+Math.floor(i/4)*59,57,36))+cabinet(365,75,65,194,6)+wire('M55 270h285V75'),
78:()=>`<path d="M45 280 240 48 435 280Z" fill="${C.side}" stroke="${C.edge}" stroke-width="4"/>`+tower(75,155,58,108)+tower(332,145,58,119)+tower(205,50,64,101)+ring(240,192,50,17,12)+wire('M135 230l70 -38m75 0 50 35m-90-75v-15'),
79:()=>base(95,282,290)+ring(240,158,120,38,32)+foot(125,271,65)+foot(295,271,65)+line('M140 235v35m195-35v35',C.edge,15)+many(4,i=>box(110+i*74,159+(i%2?90:-70),20,17,4)),
80:()=>base(70,280,340)+radial(6,240,177,112,(x,y,i)=>wire(`M240 177L${x} ${y}`)+tower(x-16,y-30,30,40+(i%3)*8)+bushing(x-10,y-33,19))+box(199,125,80,95,18)+screen(215,150,45,29),
81:()=>base(50,280,380)+box(120,202,240,65)+many(4,i=>at(143+i*53,163,screen(0,0,45,42),1,-8))+cabinet(53,122,48,145,4)+cabinet(380,122,44,145,4)+belt(190,235,100)+bin(292,230,25,27),
82:()=>base(20,280,430)+generator(45,142,140,85)+motor(225,170,78,52)+motor(322,209,80,50)+transformer(320,95,60,67)+belt(45,265,150,-18)+cabinet(210,78,63,81,2)+wire('M65 100h140v60h100'),
83:()=>base(85,282,320)+tower(207,42,65,230)+ring(240,165,100,11,16)+ring(240,165,77,10,14)+ring(240,165,51,9,12)+radiator(90,137,42,135)+radiator(350,137,42,135),
84:()=>base(70,280,345)+ring(240,172,110,8,0)+radial(8,240,172,81,(x,y,i)=>at(x,y,coil(-22,0,44,53,6),1,i*45))+box(217,148,46,48,9)+line('M145 95l-30 180m215-180 35 180M110 270h260',C.edge,8),
85:()=>base(70,280,345)+radial(6,240,184,100,(x,y)=>wire(`M240 184L${x} ${y}`)+bin(x-15,y-7,30,27))+`<path d="M200 105h80l38 70-38 70h-80l-38-70Z" fill="${C.screen}" stroke="${C.edge}" stroke-width="7"/>`+robot(340,125,.8)+radial(6,240,175,66,(x,y)=>screen(x-9,y-6,18,12))+coil(217,180,46,60),
86:()=>base(35,280,410)+many(4,i=>tower(i%2?350:55,i<2?60:177,65,i<2?110:92))+box(180,177,120,83)+wire('M95 165h290v105H95Z')+many(4,i=>bushing(165+i*50,173,25))+radiator(220,80,50,63)+screen(220,198,46,30),
87:()=>base(20,282,435)+generator(35,170,85,65)+generator(355,160,85,70)+generator(115,103,70,55)+generator(290,100,67,60)+part('horizontal-turbine',motor(115,243,80,30,{terminal:false,cutout:false})+fan(183,258,12))+part('horizontal-turbine',motor(290,243,80,30,{terminal:false,cutout:false})+fan(358,258,12))+part('octagonal-control-tower',`<path d="M220 40h40l15 15v190l-15 15h-40l-15-15V55Z" fill="${C.side}" stroke="${C.edge}" stroke-width="3"/>`+many(4,i=>screen(222,70+i*44,36,25)))+tiltedRing(240,110,125,.3)+radiator(380,90,25,58)+wire('M60 255h350')+emblem(241,100)
};
export function industrialIllustration(d,uid='device'){
 const draw=INDUSTRIAL_MODELS[d.id];if(!draw)return null;
 return `<svg class="device-art empire-device industrial-model device-${d.id}" viewBox="0 0 480 350" role="img" aria-label="Illustration of ${d.name}" data-model="${d.id}"><title>${d.name}</title><g class="device-shell">${draw()}</g><text x="390" y="325" fill="#9aa88e" font-size="10" font-family="monospace">CE—${String(d.id).padStart(3,'0')}</text></svg>`;
}
export const MACHINE_PARTS={C,many,part,at,line,rect,box,vessel,capacitor,foot,base,wire,screen,coil,ring,fan,radiator,bushing,motor,generator,cabinet,transformer,belt,bin,tower,robot,turbine,radial,emblem,tiltedRing};
