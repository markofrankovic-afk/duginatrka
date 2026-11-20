'use strict';
(()=>{
const $=id=>document.getElementById(id);
const cv=$('c'),g=cv.getContext('2d');
const H=720,GY=590,TW=1800;
let DPR=1,S=1,W=1280;
// ---------- save ----------
const SK='dugina-trka-v1';
let save={rings:0,done:{},up:{let:0,skok:0,jur:0,mag:0},uni:0,owned:[0],music:1,story:0,world:0};
try{const o=JSON.parse(localStorage.getItem(SK)||'{}');Object.assign(save,o);save.up=Object.assign({let:0,skok:0,jur:0,mag:0},o.up||{});}catch(e){}
const store=()=>{try{localStorage.setItem(SK,JSON.stringify(save))}catch(e){}};
const mulberry=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
// ---------- colour ----------
let SAT=1,HAZE='#ffffff',HAZEK=0;
const cc={};
function rgb(h){let v=cc[h];if(!v){const s=h.replace('#','');v=cc[h]=[parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)];}return v;}
function C(h,a){let[r,gg,b]=rgb(h);
  if(SAT<1){const l=r*.3+gg*.59+b*.11,qr=l*.74+58,qg=l*.76+62,qb=l*.78+72;r=qr+(r-qr)*SAT;gg=qg+(gg-qg)*SAT;b=qb+(b-qb)*SAT;}
  if(HAZEK>0){const[hr,hg,hb]=rgb(HAZE);r+=(hr-r)*HAZEK;gg+=(hg-gg)*HAZEK;b+=(hb-b)*HAZEK;}
  return a==null?`rgb(${r|0},${gg|0},${b|0})`:`rgba(${r|0},${gg|0},${b|0},${a})`;}
const hx2=v=>Math.max(0,Math.min(255,v|0)).toString(16).padStart(2,'0');
function dk(h,k=.25){const[r,gg,b]=rgb(h);return '#'+hx2(r*(1-k))+hx2(gg*(1-k))+hx2(b*(1-k)*1.04);}
function lt(h,k=.3){const[r,gg,b]=rgb(h);return '#'+hx2(r+(255-r)*k)+hx2(gg+(255-gg)*k)+hx2(b+(255-b)*k);}
function mix(a,b,t){const A=rgb(a),B=rgb(b);return '#'+hx2(A[0]+(B[0]-A[0])*t)+hx2(A[1]+(B[1]-A[1])*t)+hx2(A[2]+(B[2]-A[2])*t);}
// ---------- shape helpers ----------
function rr(c,x,y,w,h,r){r=Math.min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function ell(c,x,y,rx,ry,rot=0){c.beginPath();c.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot,0,Math.PI*2);}
function fs(c,fill,line,lw=3){if(fill){c.fillStyle=C(fill);c.fill();}if(line){c.strokeStyle=C(line);c.lineWidth=lw;c.lineJoin='round';c.lineCap='round';c.stroke();}}
function poly(c,pts){c.beginPath();c.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)c.lineTo(pts[i],pts[i+1]);c.closePath();}
function star5(c,x,y,R,r,rot=0){c.beginPath();for(let i=0;i<10;i++){const a=rot-Math.PI/2+i*Math.PI/5,q=i%2?r:R;c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.closePath();}
function heartP(c,x,y,s){c.beginPath();c.moveTo(x,y+s*.35);c.bezierCurveTo(x-s*1.1,y-s*.35,x-s*.45,y-s*1.05,x,y-s*.45);c.bezierCurveTo(x+s*.45,y-s*1.05,x+s*1.1,y-s*.35,x,y+s*.35);c.closePath();}
// ---------- worlds ----------
const META={"w1":{"layers":[{"src":"w1_l0.webp","y":0.15092592592592594,"h":0.8490740740740741,"par":0.08,"mir":false,"top0":false},{"src":"w1_l1.webp","y":0.044444444444444446,"h":0.23981481481481481,"par":0.03,"mir":false,"top0":false},{"src":"w1_l2.webp","y":0.2564814814814815,"h":0.5787037037037037,"par":0.25,"mir":false,"top0":false},{"src":"w1_l3.webp","y":0.21851851851851853,"h":0.6731481481481482,"par":0.42,"mir":false,"top0":false}],"sky":"w1_sky.webp","ground":{"src":"w1_g.webp","h":0.21666666666666667,"surf":0.017592592592592594,"fill":"#855542","dark":"#664136","mir":false},"map":"w1_map.webp","mapg":"w1_mapg.webp"},"w2":{"layers":[{"src":"w2_l0.webp","y":0.0,"h":1.0,"par":0.06,"mir":false,"top0":true},{"src":"w2_l1.webp","y":0.0,"h":1.0,"par":0.12,"mir":false,"top0":true},{"src":"w2_l2.webp","y":0.0,"h":1.0,"par":0.2,"mir":false,"top0":true},{"src":"w2_l3.webp","y":0.13148148148148148,"h":0.8685185185185185,"par":0.33,"mir":true,"top0":false},{"src":"w2_l4.webp","y":0.0824074074074074,"h":0.9175925925925926,"par":0.55,"mir":true,"top0":false}],"sky":"w2_sky.webp","ground":{"src":"w2_g.webp","h":0.16666666666666666,"surf":0.04351851851851852,"fill":"#7e7b66","dark":"#62604c","mir":false},"map":"w2_map.webp","mapg":"w2_mapg.webp"},"w3":{"layers":[{"src":"w3_l0.webp","y":0.1259259259259259,"h":0.8046296296296296,"par":0.06,"mir":false,"top0":false},{"src":"w3_l1.webp","y":0.05092592592592592,"h":0.2759259259259259,"par":0.03,"mir":false,"top0":false},{"src":"w3_l2.webp","y":0.2861111111111111,"h":0.7138888888888889,"par":0.16,"mir":false,"top0":false},{"src":"w3_l3.webp","y":0.3648148148148148,"h":0.6351851851851852,"par":0.3,"mir":false,"top0":false},{"src":"w3_l4.webp","y":0.2222222222222222,"h":0.7777777777777778,"par":0.5,"mir":false,"top0":false}],"sky":"w3_sky.webp","ground":{"src":"w3_g.webp","h":0.35462962962962963,"surf":0.19166666666666668,"fill":"#23485f","dark":"#184255","mir":false},"map":"w3_map.webp","mapg":"w3_mapg.webp"},"w4":{"layers":[{"src":"w4_l0.webp","y":0.0,"h":0.7407407407407407,"par":0.02,"mir":false,"top0":true},{"src":"w4_l1.webp","y":0.013888888888888888,"h":0.7574074074074074,"par":0.04,"mir":false,"top0":false},{"src":"w4_l2.webp","y":0.0,"h":0.7240740740740741,"par":0.06,"mir":false,"top0":true},{"src":"w4_l3.webp","y":0.05,"h":0.38796296296296295,"par":0.09,"mir":false,"top0":false},{"src":"w4_l4.webp","y":0.34629629629629627,"h":0.35833333333333334,"par":0.2,"mir":false,"top0":false},{"src":"w4_l5.webp","y":0.4601851851851852,"h":0.175,"par":0.3,"mir":false,"top0":false},{"src":"w4_l6.webp","y":0.4185185185185185,"h":0.5814814814814815,"par":0.45,"mir":false,"top0":false}],"sky":"w4_sky.webp","ground":{"src":"w4_g.webp","h":0.17962962962962964,"surf":0.075,"fill":"#c2e3f6","dark":"#9db9c7","mir":false},"map":"w4_map.webp","mapg":"w4_mapg.webp"},"w5":{"layers":[{"src":"w5_l0.webp","y":0.5111111111111111,"h":0.4888888888888889,"par":0.06,"mir":false,"top0":false},{"src":"w5_l1.webp","y":0.000925925925925926,"h":0.9990740740740741,"par":0.12,"mir":true,"top0":true},{"src":"w5_l2.webp","y":0.0,"h":1.0,"par":0.2,"mir":false,"top0":true},{"src":"w5_l3.webp","y":0.0,"h":0.9111111111111111,"par":0.33,"mir":true,"top0":true},{"src":"w5_l4.webp","y":0.13703703703703704,"h":0.8629629629629629,"par":0.55,"mir":true,"top0":false}],"sky":"w5_sky.webp","ground":{"src":"w5_g.webp","h":0.09351851851851851,"surf":0.0,"fill":"#5f3763","dark":"#624264","mir":false},"map":"w5_map.webp","mapg":"w5_mapg.webp"},"w6":{"layers":[{"src":"w6_l0.webp","y":0.053703703703703705,"h":0.4064814814814815,"par":0.03,"mir":false,"top0":false},{"src":"w6_l1.webp","y":0.06666666666666667,"h":0.9333333333333333,"par":0.08,"mir":false,"top0":false},{"src":"w6_l2.webp","y":0.13703703703703704,"h":0.8629629629629629,"par":0.16,"mir":false,"top0":false},{"src":"w6_l3.webp","y":0.0,"h":1.0,"par":0.3,"mir":true,"top0":true},{"src":"w6_l4.webp","y":0.0,"h":1.0,"par":0.5,"mir":false,"top0":true}],"sky":"w6_sky.webp","ground":{"src":"w6_g.webp","h":0.10925925925925926,"surf":0.014814814814814815,"fill":"#97a16e","dark":"#777f56","mir":true},"map":"w6_map.webp","mapg":"w6_mapg.webp"},"w7":{"layers":[{"src":"w7_l0.webp","y":0.19074074074074074,"h":0.8092592592592592,"par":0.06,"mir":false,"top0":false},{"src":"w7_l1.webp","y":0.45185185185185184,"h":0.5453703703703704,"par":0.14,"mir":false,"top0":false},{"src":"w7_l2.webp","y":0.04814814814814815,"h":0.2361111111111111,"par":0.03,"mir":false,"top0":false},{"src":"w7_l3.webp","y":0.14166666666666666,"h":0.8583333333333333,"par":0.26,"mir":false,"top0":false},{"src":"w7_l4.webp","y":0.49907407407407406,"h":0.35462962962962963,"par":0.45,"mir":false,"top0":false}],"sky":"w7_sky.webp","ground":{"src":"w7_g.webp","h":0.21944444444444444,"surf":0.019444444444444445,"fill":"#87665b","dark":"#644b41","mir":false},"map":"w7_map.webp","mapg":"w7_mapg.webp"}};
const WORLDS=[
 {id:'w1',name:'Slatko selo',deco:['cake','tower','tent','windmill'],pal:['#ffc1d9','#ffe7a3','#ffd1e8','#fff3c4','#ffb3a7','#c9f0d1','#cfe0ff'],feat:{},mus:0,
  story:'Tamno trnje je ukralo boje Slatkom selu! Trči, skači i skupljaj prstenove.'},
 {id:'w2',name:'Šuma gljiva',deco:['mush','tree','mush2','pine'],pal:['#ff8fa8','#ffd27a','#c9a3ff','#ffe0f0','#ff6b8a','#b5e6c0'],feat:{tramp:1},mus:1,
  story:'U šumi rastu skočne gljive. Skoči na njih i odbij se visoko do zvjezdica!'},
 {id:'w3',name:'Tirkizna dolina',deco:['tree','windmill','pine','tower'],pal:['#7fe0d0','#ffd36e','#ff9fd0','#c6f3ff','#9ab0ff','#b5e6c0'],feat:{mover:1},mus:2,
  story:'U dolini lebde čarobne ploče koje se pomiču. Pazi kad skačeš na njih!'},
 {id:'w4',name:'Zvjezdani oblaci',deco:['ctower','balloon','arch','ctower2'],pal:['#ffb3d1','#b3d9ff','#fff1a8','#d6c2ff','#a8f0d8','#ffd1a8'],feat:{storm:1},night:1,mus:3,
  story:'Noću u oblacima žive mrzovoljni olujni oblačići. Zaobiđi ih!'},
 {id:'w5',name:'Čarobna šuma',deco:['mush2','tree','spire','pine'],pal:['#c98bff','#ff9fd0','#7fe0f0','#ffe0f0','#a98bff','#ffd27a'],feat:{bob:1,mover:1},mus:4,
  story:'Kroz ljubičastu šumu lete tamni duhići. Preskoči ih!'},
 {id:'w6',name:'Džungla slapova',deco:['hut','palm','light','boat'],pal:['#ff8a7a','#ffd36e','#7fd6ff','#ffffff','#ff9fd0','#9ef0c8'],feat:{water:1,bob:1},mus:5,
  story:'U džungli je puno vode. Ne upadni u nju i čuvaj se tamnih meduza!'},
 {id:'w7',name:'Dvorac duge',deco:['castle','ttower','tent','ttower2'],pal:['#ff9ad5','#b9a3ff','#ffd36e','#8fe3ff','#ff7aa8','#c6ffb3'],feat:{tramp:1,mover:1,storm:1},mus:0,
  story:'Zadnji put do Dvorca duge! Vrati duge boje cijeloj zemlji.'}
];
WORLDS.forEach((w,i)=>w.wi=i);
const NL=4; // levels per world
const UNIS=[
 {name:'Duga',body:'#ffffff',line:'#b39ad6',mane:['#ff5d8f','#ffa64d','#ffe14d','#6ee07a','#5ec8ff','#a37bff'],horn:'#ffd166',hoof:'#f9b8d6',eye:'#5b3a8c',wing:'#ffffff',price:0},
 {name:'Ružica',body:'#ffd0e8',line:'#d07bab',mane:['#ff4fa0','#c86bff','#ffffff','#ff9ad5','#ff4fa0'],horn:'#fff0a8',hoof:'#c86bff',eye:'#3a2a8c',wing:'#fff0f8',price:0},
 {name:'Plavica',body:'#d4f0ff',line:'#6fa7d6',mane:['#3d7bff','#7fd6ff','#ffffff','#b8a6ff','#3d7bff'],horn:'#ffe08a',hoof:'#3d7bff',eye:'#1d3a7a',wing:'#ffffff',price:300},
 {name:'Zlatica',body:'#fff1bd',line:'#d1a64a',mane:['#ff9a3c','#ffd23f','#fff4c2','#ff6f61','#ffd23f'],horn:'#ff9a3c',hoof:'#ff6f61',eye:'#6a3a1a',wing:'#fff8dc',price:500},
 {name:'Ljubica',body:'#e6d8ff',line:'#9a7bd1',mane:['#7b4dff','#ff6ad5','#55d6ff','#ffffff','#7b4dff'],horn:'#9ff0ff',hoof:'#7b4dff',eye:'#3a1a6a',wing:'#f4eeff',price:800},
 {name:'Mentica',body:'#d8fbe8',line:'#5fb38a',mane:['#2fd18a','#ffe14d','#5ec8ff','#ffffff','#2fd18a'],horn:'#ffb3d1',hoof:'#2fd18a',eye:'#1a5a3a',wing:'#ffffff',price:1200}
];
if(!save.owned.includes(1))save.owned.push(1);
const UPS=[
 {k:'let',name:'Super let',desc:'Duže lebdiš kad držiš prst',ic:'🪽'},
 {k:'skok',name:'Super skok',desc:'Skočne gljive i skokovi su viši',ic:'⬆️'},
 {k:'jur',name:'Dugin juriš',desc:'Dugina staza traje duže',ic:'🌈'},
 {k:'mag',name:'Magnet',desc:'Prstenovi sami lete k tebi',ic:'🧲'}];
const UPC=[150,300,500];

// ---------- buildings ----------
function bld(c,type,x,y,s,v,pal){
  c.save();c.translate(x,y);c.scale(s,s);
  const P=i=>pal[(i+v)%pal.length];
  const L=h=>dk(h,.38);
  switch(type){
  case 'cake':{const a=P(0),b=P(1),d=P(2);
    rr(c,-62,-86,124,86,12);fs(c,a,L(a),4);
    for(const wx of[-34,24]){rr(c,wx-11,-66,22,26,10);fs(c,'#fff8ee',L(a),3);c.beginPath();c.moveTo(wx,-66);c.lineTo(wx,-40);c.moveTo(wx-11,-53);c.lineTo(wx+11,-53);fs(c,null,L(a),2);}
    rr(c,-13,-44,26,44,13);fs(c,dk(a,.12),L(a),3);
    c.beginPath();c.moveTo(-74,-82);c.bezierCurveTo(-70,-170,70,-170,74,-82);for(let i=74;i>=-74;i-=18.5){c.quadraticCurveTo(i-4,-62,i-9,-80);}c.closePath();fs(c,b,L(b),4);
    for(let i=-50;i<=50;i+=34){ell(c,i,-120,5,5);fs(c,P(4));}
    rr(c,-22,-178,44,34,8);fs(c,d,L(d),3);for(let i=-16;i<=16;i+=8){c.beginPath();c.moveTo(i,-176);c.lineTo(i,-146);fs(c,null,L(d),2);}
    ell(c,0,-182,28,15);fs(c,'#ffffff',L(d),3);ell(c,0,-202,9,9);fs(c,'#ff4d6d',L('#ff4d6d'),3);
    break;}
  case 'tower':{const a=P(3),b=P(0),d=P(5);
    rr(c,-34,-170,68,170,8);fs(c,a,L(a),4);
    for(const wy of[-140,-95]){rr(c,-12,wy,24,28,12);fs(c,'#fff8ee',L(a),3);}
    rr(c,-12,-40,24,40,10);fs(c,dk(a,.15),L(a),3);
    c.save();poly(c,[-46,-166,46,-166,0,-262]);c.clip();for(let i=0;i<8;i++)for(let j=0;j<8;j++){if((i+j)%2){c.fillStyle=C(b);c.fillRect(-48+i*12,-264+j*12.5,12,12.5);}else{c.fillStyle=C(d);c.fillRect(-48+i*12,-264+j*12.5,12,12.5);}}c.restore();
    poly(c,[-46,-166,46,-166,0,-262]);fs(c,null,L(b),4);
    c.beginPath();c.moveTo(0,-262);c.lineTo(0,-292);fs(c,null,'#8a6a4a',3);poly(c,[0,-292,26,-284,0,-276]);fs(c,P(4),L(P(4)),2);
    break;}
  case 'tent':{const a=P(2),b=P(5),d=P(1);
    rr(c,-70,-70,140,70,8);fs(c,'#f6e7cf',L('#f6e7cf'),4);
    rr(c,-60,-50,120,18,6);fs(c,d,L(d),3);
    for(let i=0;i<7;i++){const x0=-80+i*23;c.beginPath();c.moveTo(x0,-80);c.lineTo(x0+23,-80);c.lineTo(x0+23,-62);c.quadraticCurveTo(x0+11.5,-48,x0,-62);c.closePath();fs(c,i%2?a:'#ffffff',L(a),3);}
    poly(c,[-84,-80,84,-80,0,-150]);fs(c,b,L(b),4);c.save();poly(c,[-84,-80,84,-80,0,-150]);c.clip();for(let i=-84;i<84;i+=28){poly(c,[i,-80,i+14,-80,0,-150]);fs(c,'#ffffff');}c.restore();poly(c,[-84,-80,84,-80,0,-150]);fs(c,null,L(b),4);
    for(let i=-44;i<=44;i+=44){ell(c,i,-38,9,9);fs(c,P(4),L(P(4)),2);}
    break;}
  case 'windmill':{const a=P(1),b=P(4);
    poly(c,[-40,0,40,0,24,-130,-24,-130]);fs(c,a,L(a),4);rr(c,-12,-38,24,38,10);fs(c,dk(a,.15),L(a),3);ell(c,0,-90,10,12);fs(c,'#fff8ee',L(a),3);
    poly(c,[-34,-126,34,-126,0,-170]);fs(c,b,L(b),4);
    c.save();c.translate(0,-140);c.rotate(v*.4);for(let i=0;i<4;i++){c.rotate(Math.PI/2);rr(c,-9,-92,18,84,4);fs(c,'#fffdf5',L(a),3);for(let k=-82;k<-14;k+=14){c.beginPath();c.moveTo(-9,k);c.lineTo(9,k);fs(c,null,L(a),1.5);}}ell(c,0,0,9,9);fs(c,P(0),L(P(0)),3);c.restore();
    break;}
  case 'mush':case 'mush2':{const a=type==='mush'?'#ff6b8a':P(2),st='#fff1dc';
    rr(c,-34,-100,68,100,18);fs(c,st,L(st),4);rr(c,-12,-46,24,46,12);fs(c,'#c98b5a',L('#c98b5a'),3);ell(c,18,-72,8,10);fs(c,'#ffe9a8',L(st),3);
    c.beginPath();c.moveTo(-92,-96);c.bezierCurveTo(-90,-210,90,-210,92,-96);c.quadraticCurveTo(0,-76,-92,-96);c.closePath();fs(c,a,L(a),4);
    for(const[dx,dy,r]of[[-44,-130,12],[0,-160,14],[42,-126,11],[-10,-112,8],[66,-104,7]]){ell(c,dx,dy,r,r*.85);fs(c,'#ffffff');}
    break;}
  case 'tree':{const a=P(5);rr(c,-12,-90,24,90,8);fs(c,'#a8784f',L('#a8784f'),4);
    for(const[dx,dy,r]of[[-40,-110,44],[38,-112,42],[0,-160,52],[-10,-104,40]]){ell(c,dx,dy,r,r);fs(c,mix(a,'#5fb06e',.5),L(mix(a,'#5fb06e',.5)),4);}
    for(const[dx,dy]of[[-30,-130],[20,-170],[40,-110]]){ell(c,dx,dy,6,6);fs(c,P(0));}
    break;}
  case 'pine':{rr(c,-9,-40,18,40,6);fs(c,'#a8784f',L('#a8784f'),3);const a='#5fb07a';for(let i=0;i<3;i++){poly(c,[-58+i*12,-30-i*55,58-i*12,-30-i*55,0,-110-i*55]);fs(c,a,L(a),4);}break;}
  case 'ctower':case 'ctower2':{const a=type==='ctower'?'#ffffff':P(3),b=P(1);
    rr(c,-30,-200,60,200,10);fs(c,a,L('#c8dcf0'),4);for(const wy of[-170,-120,-70]){rr(c,-10,wy,20,26,10);fs(c,P(0),L('#c8dcf0'),3);}
    c.beginPath();c.moveTo(-40,-196);c.bezierCurveTo(-40,-270,40,-270,40,-196);c.closePath();fs(c,b,L(b),4);ell(c,0,-262,6,6);fs(c,P(2),L(P(2)),2);
    for(const[dx,r]of[[-60,30],[-25,38],[20,36],[58,28]]){ell(c,dx,-6,r,r*.7);fs(c,'#ffffff');}
    break;}
  case 'balloon':{c.translate(0,-210);const a=P(0),b=P(2);ell(c,0,0,50,58);fs(c,a,L(a),4);c.save();ell(c,0,0,50,58);c.clip();for(let i=-40;i<=40;i+=40){ell(c,i,0,12,58);fs(c,b);}c.restore();ell(c,0,0,50,58);fs(c,null,L(a),4);
    c.beginPath();c.moveTo(-26,50);c.lineTo(-14,92);c.moveTo(26,50);c.lineTo(14,92);fs(c,null,'#8a6a4a',2);rr(c,-16,90,32,24,6);fs(c,'#d9a066',L('#d9a066'),3);break;}
  case 'arch':{const cols=['#ff8fb1','#ffc178','#fff08a','#9de8a0','#8fd3ff','#c3a6ff'];for(let i=0;i<6;i++){c.beginPath();c.arc(0,0,130-i*12,Math.PI,0);c.strokeStyle=C(cols[i]);c.lineWidth=12;c.stroke();}
    for(const dx of[-120,120]){for(const[ox,r]of[[-26,26],[0,32],[26,24]]){ell(c,dx+ox,-4,r,r*.7);fs(c,'#ffffff');}}break;}
  case 'spire':case 'spire2':{const cols=[P(0),P(1),P(2)];
    for(const[dx,h,w,k]of[[-40,140,34,0],[30,200,40,1],[0,120,36,2],[60,110,28,0]]){const a=cols[k];poly(c,[dx-w/2,0,dx+w/2,0,dx+w/2,-h*.75,dx,-h,dx-w/2,-h*.75]);fs(c,a,L(a),4);poly(c,[dx-w/2+5,-6,dx-2,-6,dx-2,-h*.9,dx-w/2+5,-h*.72]);fs(c,lt(a,.45));}
    break;}
  case 'igloo':{c.beginPath();c.arc(0,0,80,Math.PI,0);c.closePath();fs(c,'#f4fbff',L('#cfe6fb'),4);for(const yy of[-24,-48]){c.beginPath();const w=Math.sqrt(6400-yy*yy);c.moveTo(-w,yy);c.lineTo(w,yy);fs(c,null,'#b8d4f0',2);}
    c.beginPath();c.arc(30,0,22,Math.PI,0);c.closePath();fs(c,P(0),L(P(0)),3);break;}
  case 'peak':{poly(c,[-150,0,0,-230,150,0]);fs(c,P(4),L(P(4)),4);poly(c,[-56,-144,0,-230,56,-144,30,-124,10,-140,-14,-120,-34,-138]);fs(c,'#ffffff',L(P(4)),3);break;}
  case 'light':{const a='#ffffff',b='#ff6b6b';poly(c,[-34,0,34,0,22,-200,-22,-200]);fs(c,a,L('#d8c8c8'),4);c.save();poly(c,[-34,0,34,0,22,-200,-22,-200]);c.clip();for(let yy=-30;yy>-200;yy-=60){c.fillStyle=C(b);c.fillRect(-40,yy-30,80,30);}c.restore();poly(c,[-34,0,34,0,22,-200,-22,-200]);fs(c,null,L(b),4);
    rr(c,-26,-240,52,40,6);fs(c,'#fff6a8',L('#e6c75a'),4);poly(c,[-32,-238,32,-238,0,-280]);fs(c,b,L(b),4);rr(c,-12,-34,24,34,10);fs(c,P(2),L(P(2)),3);break;}
  case 'hut':{const a=P(1),b=P(0);for(const dx of[-46,46]){rr(c,dx-5,-40,10,40,3);fs(c,'#b88a5a',L('#b88a5a'),3);}rr(c,-60,-110,120,72,8);fs(c,a,L(a),4);rr(c,-14,-90,28,52,10);fs(c,P(2),L(P(2)),3);
    poly(c,[-80,-106,80,-106,0,-170]);fs(c,b,L(b),4);c.save();poly(c,[-80,-106,80,-106,0,-170]);c.clip();for(let i=-80;i<80;i+=32){poly(c,[i,-106,i+16,-106,0,-170]);fs(c,'#ffffff');}c.restore();poly(c,[-80,-106,80,-106,0,-170]);fs(c,null,L(b),4);break;}
  case 'palm':{c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(-10,-90,20,-180);c.lineWidth=18;c.strokeStyle=C(L('#c99a5c'));c.stroke();c.lineWidth=13;c.strokeStyle=C('#c99a5c');c.stroke();
    c.translate(20,-180);for(let i=0;i<6;i++){c.save();c.rotate(-2.6+i*.95);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(40,-30,90,6);c.quadraticCurveTo(40,-6,0,0);fs(c,'#5fc27a',L('#5fc27a'),3);c.restore();}ell(c,-6,8,9,9);fs(c,'#8a5a3a');ell(c,8,10,9,9);fs(c,'#8a5a3a');break;}
  case 'boat':{c.translate(0,-10);c.beginPath();c.moveTo(-70,-20);c.lineTo(70,-20);c.quadraticCurveTo(60,10,40,12);c.lineTo(-40,12);c.quadraticCurveTo(-60,10,-70,-20);fs(c,P(0),L(P(0)),4);rr(c,-3,-150,6,130,2);fs(c,'#a8784f');poly(c,[4,-146,4,-30,70,-34]);fs(c,'#ffffff',L('#cccccc'),3);poly(c,[-4,-120,-4,-34,-50,-36]);fs(c,P(2),L(P(2)),3);break;}
  case 'castle':{const a=P(1),b=P(0),w='#fff4d6';
    rr(c,-110,-150,220,150,8);fs(c,a,L(a),4);for(let i=-100;i<=80;i+=40){rr(c,i,-170,22,22,3);fs(c,a,L(a),3);}
    for(const[dx,h]of[[-110,250],[110,250],[0,320]]){rr(c,dx-30,-h,60,h,6);fs(c,lt(a,.15),L(a),4);poly(c,[dx-42,-h+4,dx+42,-h+4,dx,-h-90]);fs(c,b,L(b),4);c.beginPath();c.moveTo(dx,-h-90);c.lineTo(dx,-h-120);fs(c,null,'#8a6a4a',3);poly(c,[dx,-h-120,dx+24,-h-112,dx,-h-104]);fs(c,P(2),L(P(2)),2);
      for(let yy=-h+40;yy<-50;yy+=60){rr(c,dx-10,yy,20,28,10);fs(c,w,L(a),3);}}
    c.beginPath();c.moveTo(-28,0);c.lineTo(-28,-50);c.arc(0,-50,28,Math.PI,0);c.lineTo(28,0);c.closePath();fs(c,dk(a,.3),L(a),4);break;}
  case 'ttower':case 'ttower2':{const a=type==='ttower'?P(1):P(3),b=P(0);rr(c,-36,-210,72,210,6);fs(c,a,L(a),4);for(let yy=-180;yy<-30;yy+=55){rr(c,-11,yy,22,30,11);fs(c,'#fff2b8',L(a),3);}
    poly(c,[-50,-206,50,-206,0,-300]);fs(c,b,L(b),4);ell(c,0,-304,6,6);fs(c,'#ffd36e');break;}
  case 'lantern':{rr(c,-4,-150,8,150,3);fs(c,'#5a4a6a');c.beginPath();c.moveTo(0,-150);c.quadraticCurveTo(30,-160,44,-140);fs(c,null,'#5a4a6a',6);rr(c,32,-140,24,34,6);fs(c,'#ffe58a',L('#ffe58a'),3);break;}
  }
  c.restore();
}
// ---------- sprites cache ----------
const SPR={};
function sprite(key,w,h,fn){let s=SPR[key];if(s)return s;const k=Math.min(2,S*1.1);s=document.createElement('canvas');s.width=Math.ceil(w*k);s.height=Math.ceil(h*k);const c=s.getContext('2d');c.scale(k,k);fn(c);s.lw=w;s.lh=h;SPR[key]=s;return s;}
function cloudSpr(i){return sprite('cl'+i,300,140,c=>{const r=mulberry(50+i);c.translate(150,95);const puffs=[];for(let k=0;k<6;k++)puffs.push([-95+k*38+r()*10,-r()*30-(k>0&&k<5?20:0),30+r()*22]);
  c.fillStyle='rgba(255,255,255,.95)';for(const[x,y,rd]of puffs){ell(c,x,y,rd,rd);c.fill();}rr(c,-110,-20,220,40,20);c.fill();
  c.strokeStyle='rgba(170,205,230,.6)';c.lineWidth=3;c.beginPath();c.arc(-30,-30,16,.5,4.6);c.stroke();c.beginPath();c.arc(40,-22,12,3.6,7.5);c.stroke();});}
function thornSpr(wi){return sprite('th'+wi,140,130,c=>{c.translate(70,118);
  const gr=c.createRadialGradient(0,-40,5,0,-40,68);gr.addColorStop(0,'rgba(255,60,200,.65)');gr.addColorStop(1,'rgba(255,60,200,0)');c.fillStyle=gr;c.fillRect(-70,-118,140,130);
  const dark=wi===4?'#2a1a55':'#24113a',mid=wi===4?'#4a3a9a':'#4b2370';
  if(wi===4){for(const[dx,h,w]of[[-22,70,22],[8,92,26],[30,60,20],[-4,50,22]]){poly(c,[dx-w/2,0,dx+w/2,0,dx+w/2,-h*.7,dx,-h,dx-w/2,-h*.7]);c.fillStyle=dark;c.fill();c.strokeStyle='#ff5ad0';c.lineWidth=2;c.stroke();poly(c,[dx-w/2+4,-4,dx-2,-4,dx-2,-h*.85,dx-w/2+4,-h*.66]);c.fillStyle=mid;c.fill();}return;}
  for(let i=0;i<9;i++){const a=-Math.PI/2+(i-4)*.32,l=50+(i%3)*14;c.save();c.rotate(a+Math.PI/2);c.beginPath();c.moveTo(-9,0);c.quadraticCurveTo(-12,-l*.6,0,-l);c.quadraticCurveTo(12,-l*.6,9,0);c.closePath();c.fillStyle=i%2?dark:mid;c.fill();c.strokeStyle='rgba(255,90,210,.8)';c.lineWidth=1.8;c.stroke();c.restore();}
  ell(c,0,-6,26,12);c.fillStyle=dark;c.fill();
  for(let i=0;i<5;i++){c.save();c.rotate(-1.1+i*.55);poly(c,[-3,-30,3,-30,0,-52]);c.fillStyle='#120820';c.fill();c.restore();}});}
function ringSpr(){return sprite('ring',60,60,c=>{c.translate(30,30);c.lineWidth=11;c.strokeStyle='rgba(255,255,255,.95)';c.beginPath();c.arc(0,0,19,0,7);c.stroke();c.lineWidth=7;c.strokeStyle='#d92f8f';c.beginPath();c.arc(0,0,19,0,7);c.stroke();c.lineWidth=5;c.strokeStyle='#ff6fbd';c.stroke();c.lineWidth=2;c.strokeStyle='#ffd3ec';c.beginPath();c.arc(0,0,19,3.6,5.2);c.stroke();});}

// ---------- unicorn drawing ----------
function legPath(c,hx,hy,a1,a2,l1,l2){const kx=hx+Math.sin(a1)*l1,ky=hy+Math.cos(a1)*l1,fx=kx+Math.sin(a2)*l2,fy=ky+Math.cos(a2)*l2;return[kx,ky,fx,fy];}
function lg(c,x0,y0,x1,y1,stops){const gr=c.createLinearGradient(x0,y0,x1,y1);stops.forEach((s,i)=>gr.addColorStop(s[0],s[1]));return gr;}
function drawLeg(c,P,hx,hy,a1,a2,shade){const[kx,ky,fx,fy]=legPath(c,hx,hy,a1,a2,23,24);const body=shade?dk(P.body,.13):P.body;
  c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(hx,hy);c.lineTo(kx,ky);c.lineTo(fx,fy);c.strokeStyle=C(P.line);c.lineWidth=17;c.stroke();
  c.strokeStyle=lg(c,hx,hy,fx,fy,[[0,C(body)],[1,C(dk(body,.06))]]);c.lineWidth=11.5;c.stroke();
  if(!shade){c.beginPath();c.moveTo(hx-2,hy+2);c.lineTo(kx-2,ky);c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=3;c.stroke();}
  const hxp=fx+Math.sin(a2)*4,hyp=fy+Math.cos(a2)*4;ell(c,hxp,hyp,8.5,6.5,-a2);c.fillStyle=lg(c,hxp,hyp-6,hxp,hyp+6,[[0,C(lt(P.hoof,.35))],[1,C(shade?dk(P.hoof,.15):P.hoof)]]);c.fill();c.strokeStyle=C(P.line);c.lineWidth=2.6;c.stroke();
  ell(c,hxp-2,hyp-2.5,3,1.6,-a2);c.fillStyle='rgba(255,255,255,.7)';c.fill();}
function strands(c,list,P){c.lineCap='round';c.lineJoin='round';const path=s=>{c.beginPath();c.moveTo(s[0],s[1]);c.bezierCurveTo(s[2],s[3],s[4],s[5],s[6],s[7]);};
  for(const s of list){path(s);c.strokeStyle=C(P.line);c.lineWidth=s[9]+4.5;c.stroke();}
  for(const s of list){path(s);c.strokeStyle=lg(c,s[0],s[1],s[6],s[7],[[0,C(lt(s[8],.25))],[1,C(s[8])]]);c.lineWidth=s[9];c.stroke();}
  c.globalAlpha=.55;for(const s of list){c.beginPath();c.moveTo(s[0],s[1]-s[9]*.22);c.bezierCurveTo(s[2],s[3]-s[9]*.25,s[4],s[5]-s[9]*.25,(s[4]+s[6])/2,(s[5]+s[7])/2-s[9]*.2);c.strokeStyle='#ffffff';c.lineWidth=Math.max(1.5,s[9]*.2);c.stroke();}c.globalAlpha=1;}
function drawRider(c,t,air){c.save();c.translate(-4,-92);
  const skin='#ffdcc6',skL='#c98a6a',hair='#e8873a',hairD='#9a4a1a',top='#ff86c0',topD='#b0447e';
  // leg
  c.lineCap='round';c.beginPath();c.moveTo(0,4);c.lineTo(15,15);c.lineTo(11,33);c.strokeStyle=C('#6e4a8a');c.lineWidth=12;c.stroke();c.strokeStyle=lg(c,0,4,11,33,[[0,C('#c7b0ff')],[1,C('#a68be6')]]);c.lineWidth=8;c.stroke();
  ell(c,14,35,8,5.5);fs(c,'#ff6fae','#9a3a6a',2.2);ell(c,12,33,3,1.5);c.fillStyle='rgba(255,255,255,.7)';c.fill();
  // ponytail (behind head)
  const sw=Math.sin(t*9)*5;c.beginPath();c.moveTo(-9,-66);c.quadraticCurveTo(-34,-66+sw,-31,-38+sw);c.strokeStyle=C(hairD);c.lineWidth=15;c.stroke();c.strokeStyle=lg(c,-9,-66,-31,-38,[[0,C(lt(hair,.15))],[1,C(hair)]]);c.lineWidth=10.5;c.stroke();
  c.beginPath();c.moveTo(-14,-64);c.quadraticCurveTo(-30,-62+sw,-29,-46+sw);c.strokeStyle='rgba(255,230,190,.6)';c.lineWidth=2.5;c.stroke();
  // torso
  rr(c,-12,-32,24,38,10);c.fillStyle=lg(c,0,-32,0,6,[[0,C(lt(top,.15))],[1,C(dk(top,.08))]]);c.fill();c.strokeStyle=C(topD);c.lineWidth=3;c.stroke();
  heartP(c,1,-14,7);c.fillStyle='#ffffff';c.fill();
  // head
  ell(c,3,-55,17,17);c.fillStyle=lg(c,3,-72,3,-38,[[0,C('#ffe8da')],[1,C(skin)]]);c.fill();c.strokeStyle=C(skL);c.lineWidth=2.8;c.stroke();
  // hair cap + bangs
  c.beginPath();c.arc(3,-57,18,Math.PI*1.0,Math.PI*1.97);c.quadraticCurveTo(16,-60,10,-64);c.quadraticCurveTo(7,-58,2,-62);c.quadraticCurveTo(-2,-56,-8,-60);c.quadraticCurveTo(-12,-52,-15,-50);c.closePath();
  c.fillStyle=lg(c,3,-76,3,-50,[[0,C(lt(hair,.25))],[1,C(hair)]]);c.fill();c.strokeStyle=C(hairD);c.lineWidth=2.6;c.stroke();
  c.beginPath();c.arc(1,-63,11,3.6,4.6);c.strokeStyle='rgba(255,240,210,.75)';c.lineWidth=3;c.stroke();
  // bow
  c.save();c.translate(-10,-70);c.rotate(-.4);for(const s of[-1,1]){c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(s*12,-9,s*13,0);c.quadraticCurveTo(s*12,9,0,0);fs(c,'#ff4f9a','#a8306a',2);}ell(c,0,0,3.5,3.5);fs(c,'#ff8fc4','#a8306a',2);c.restore();
  // face
  ell(c,11,-54,4,5.4);fs(c,'#3a2440');ell(c,12.2,-56,1.6,1.9);c.fillStyle='#fff';c.fill();ell(c,10,-52,.9,.9);c.fill();
  c.beginPath();c.moveTo(8,-60);c.lineTo(6.5,-62.5);c.moveTo(11,-60.5);c.lineTo(10.5,-63.5);c.strokeStyle=C('#3a2440');c.lineWidth=1.3;c.stroke();
  ell(c,14,-46,4.5,2.6);c.fillStyle='rgba(255,130,160,.55)';c.fill();
  c.beginPath();c.arc(12,-49,3.6,.25,1.45);fs(c,null,'#9a4a4a',1.6);
  ell(c,-1,-51,3.2,4);fs(c,skin,skL,1.6);
  // arm
  c.beginPath();c.moveTo(2,-22);c.lineTo(21,-13);c.strokeStyle=C(topD);c.lineWidth=11;c.stroke();c.strokeStyle=C(top);c.lineWidth=7.5;c.stroke();ell(c,23,-12,5,5);fs(c,skin,skL,2);
  c.restore();}
function drawUni(c,ui,t,st){
  const P=UNIS[ui];const ph=st.ph||0,air=st.air,wv=t*8;const n=P.mane.length;
  const bob=air?0:-Math.abs(Math.sin(ph))*4;const tilt=air?Math.max(-.16,Math.min(.12,(st.vy||0)/4000)):Math.sin(ph*2)*.025;
  c.save();c.translate(0,bob);c.rotate(tilt);
  // tail (fuller)
  const tl=[];const tn=Math.max(n,6);for(let i=0;i<tn;i++){const o=i-tn/2,w=Math.sin(wv+i*.7)*7,w2=Math.cos(wv*.8+i)*5;tl.push([-48,-76+o*1.8,-76,-88+o*3+w,-92,-58+o*5-w,-110-Math.abs(o)*2+w2,-40+o*6.5+w*1.3,P.mane[i%n],9.5]);}
  strands(c,tl,P);
  let FL,BL;if(air){FL=[[.95,-.45],[1.15,-.25]];BL=[[-.95,-.35],[-.7,-.65]];}else{const s=Math.sin(ph),s2=Math.sin(ph+Math.PI);FL=[[s*.75,s*.75-Math.max(0,Math.cos(ph))*1.25],[s2*.75,s2*.75-Math.max(0,Math.cos(ph+Math.PI))*1.25]];BL=[[s2*.65,s2*.65+Math.max(0,Math.cos(ph+Math.PI))*.9],[s*.65,s*.65+Math.max(0,Math.cos(ph))*.9]];}
  drawLeg(c,P,30,-56,FL[1][0],FL[1][1],1);drawLeg(c,P,-34,-56,BL[1][0],BL[1][1],1);
  // far wing
  const wa=st.wing||0;
  // body
  ell(c,-2,-66,52,29);c.fillStyle=lg(c,0,-95,0,-37,[[0,C(lt(P.body,.6))],[.55,C(P.body)],[1,C(dk(P.body,.1))]]);c.fill();c.strokeStyle=C(P.line);c.lineWidth=4;c.stroke();
  // neck
  c.beginPath();c.moveTo(18,-84);c.quadraticCurveTo(30,-110,40,-126);c.lineTo(62,-116);c.quadraticCurveTo(52,-86,48,-58);c.closePath();c.fillStyle=lg(c,30,-126,50,-60,[[0,C(lt(P.body,.5))],[1,C(P.body)]]);c.fill();
  c.beginPath();c.moveTo(18,-86);c.quadraticCurveTo(30,-110,40,-126);fs(c,null,P.line,4);c.beginPath();c.moveTo(62,-116);c.quadraticCurveTo(52,-86,49,-60);fs(c,null,P.line,4);
  drawLeg(c,P,30,-56,FL[0][0],FL[0][1],0);drawLeg(c,P,-34,-56,BL[0][0],BL[0][1],0);
  ell(c,-2,-66,51,28);c.save();c.clip();ell(c,-6,-44,46,13);c.fillStyle=C(dk(P.body,.07),.8);c.fill();ell(c,-14,-86,30,8,-.08);c.fillStyle='rgba(255,255,255,.75)';c.fill();c.restore();
  // shoulder/hip curves
  c.beginPath();c.arc(26,-62,15,-1.9,-.3);c.moveTo(-26,-74);c.arc(-34,-62,14,-1.2,.2);c.strokeStyle=C(dk(P.body,.12),.7);c.lineWidth=2;c.stroke();
  // wing
  c.save();c.translate(-2,-86);c.rotate(-.25-wa);
  const wt=P.mane[Math.min(4,n-1)];
  for(let i=0;i<5;i++){c.save();c.rotate(-i*.2+.05);rr(c,-7,-66+i*6,15,62-i*8,7.5);c.fillStyle=lg(c,0,-66+i*6,0,-4,[[0,C(mix(P.wing,wt,.45))],[.5,C(lt(P.wing,.3))],[1,C(P.wing)]]);c.fill();c.strokeStyle=C(P.line);c.lineWidth=2.6;c.stroke();c.restore();}
  ell(c,0,-6,17,12.5);c.fillStyle=lg(c,0,-18,0,6,[[0,C('#ffffff')],[1,C(P.wing)]]);c.fill();c.strokeStyle=C(P.line);c.lineWidth=2.8;c.stroke();c.restore();
  // mane
  const mn=[];const bases=[[46,-152],[42,-142],[38,-131],[33,-120],[28,-109],[23,-98],[18,-87]];
  bases.forEach((b,i)=>{const w=Math.sin(wv+i*.9)*6,len=36+i*3;mn.push([b[0],b[1],b[0]-18,b[1]-8+w,b[0]-len*.8,b[1]+2-w,b[0]-len,b[1]+14+i*2+w,P.mane[i%n],11.5]);});
  strands(c,mn,P);
  // head
  ell(c,52,-136,26,24);c.fillStyle=lg(c,52,-160,52,-112,[[0,C(lt(P.body,.6))],[1,C(P.body)]]);c.fill();c.strokeStyle=C(P.line);c.lineWidth=4;c.stroke();
  ell(c,73,-121,19,15,.3);c.fill();c.stroke();ell(c,52,-136,24,22);c.fill();ell(c,71,-122,17,13,.3);c.fillStyle=C(lt(P.body,.35));c.fill();
  ell(c,82,-121,2.6,2.2);fs(c,dk(P.line,.2));
  c.beginPath();c.arc(75,-113,6,.3,1.6);fs(c,null,dk(P.line,.1),2.5);
  ell(c,58,-122,8,5);c.fillStyle='rgba(255,140,175,.5)';c.fill();
  // ear
  poly(c,[36,-152,44,-180,53,-153]);fs(c,P.body,P.line,3.5);poly(c,[41,-155,44,-171,48,-156]);fs(c,'#ffc8dc');
  // horn
  c.save();c.translate(55,-158);c.rotate(.42);const hg=c.createRadialGradient(0,-30,2,0,-30,34);hg.addColorStop(0,'rgba(255,250,200,.55)');hg.addColorStop(1,'rgba(255,250,200,0)');c.fillStyle=hg;c.fillRect(-34,-64,68,68);
  poly(c,[-8.5,0,8.5,0,0,-44]);c.fillStyle=lg(c,-8,0,8,-30,[[0,C(dk(P.horn,.1))],[.5,C(lt(P.horn,.45))],[1,C(P.horn)]]);c.fill();c.strokeStyle=C(dk(P.horn,.35));c.lineWidth=2.8;c.stroke();
  for(let k=1;k<4;k++){c.beginPath();c.moveTo(-8.5+k*2.3,-k*9.5);c.lineTo(8.5-k*2.3,-k*9.5-5);fs(c,null,dk(P.horn,.3),2);}
  const tw=.6+.4*Math.sin(t*5);star5(c,2,-46,6*tw,2.2*tw,t);c.fillStyle='#ffffff';c.fill();c.restore();
  // eye
  const blink=((t*1000|0)%3800)<120;
  if(blink){c.beginPath();c.arc(59,-139,9,.15,Math.PI-.15);fs(c,null,P.eye,3);}else{
    ell(c,59,-140,10,13.5);fs(c,'#ffffff',P.eye,2);ell(c,60,-139,8.5,12);c.fillStyle=lg(c,60,-151,60,-127,[[0,C(dk(P.eye,.25))],[.6,C(P.eye)],[1,C(lt(P.eye,.55))]]);c.fill();
    ell(c,60.5,-138,4.3,6);fs(c,'#1a1030');ell(c,63,-145,3.8,4.6);c.fillStyle='#fff';c.fill();ell(c,57,-133,1.9,1.9);c.fill();ell(c,61,-130,4,1.6);c.fillStyle='rgba(255,255,255,.35)';c.fill();
    c.beginPath();c.moveTo(51,-148);c.lineTo(46,-153);c.moveTo(54,-151);c.lineTo(51,-157.5);c.moveTo(58,-152.5);c.lineTo(57,-159);fs(c,null,P.eye,2.4);}
  // forelock
  strands(c,[[46,-162,58,-170,72,-160,76,-147+Math.sin(wv)*2,P.mane[0],10],[42,-160,52,-172,66,-166,67,-151,P.mane[1%n],9],[40,-158,46,-170,58,-170,58,-156,P.mane[2%n],7]],P);
  if(st.rider)drawRider(c,t,air);
  c.restore();
}

// ---------- image layers ----------
const TWL=1280;const IMG={};
function loadImg(src){return new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>res(null);im.src='a/'+src;});}
function loadWorld(wi){const id=WORLDS[wi].id;if(IMG[id])return IMG[id].p;const m=META[id];const o=IMG[id]={ready:false};
  o.p=Promise.all([loadImg(m.sky),...m.layers.map(l=>loadImg(l.src)),loadImg(m.ground.src),loadImg(m.map),loadImg(m.mapg)]).then(a=>{o.sky=a[0];o.layers=m.layers.map((l,i)=>Object.assign({img:a[1+i]},l));o.ground=Object.assign({img:a[1+m.layers.length]},m.ground);o.map=a[2+m.layers.length];o.mapg=a[3+m.layers.length];o.ready=true;return o;});return o.p;}
function W_(wi){const o=IMG[WORLDS[wi].id];return o&&o.ready?o:null;}
function tiles(c,img,par,camX,y,h,mir,drift){const off=camX*par+drift;let k=Math.floor(off/TWL);let x=k*TWL-off;for(;x<W;x+=TWL,k++){if(mir&&(k&1)){c.save();c.translate(x+TWL,y);c.scale(-1,1);c.drawImage(img,0,0,TWL,h);c.restore();}else c.drawImage(img,x,y,TWL,h);}}
function drawBack(c,wi,camX,camY,t){const o=W_(wi);if(!o){c.fillStyle='#bfe3f2';c.fillRect(0,0,W,H);return;}
  const sy=Math.max(-camY,0);c.drawImage(o.sky,0,-40+sy*.04,W,H+80);
  for(const l of o.layers){if(!l.img)continue;const yy=l.y*H+(l.top0?0:sy*l.par*.7);const drift=(l.par<.05&&l.y<.4)?t*8:0;tiles(c,l.img,l.par,camX,yy,l.h*H,l.mir,drift);}}
// ---------- level generation ----------
function genLevel(wi,li){
  const r=mulberry(1000+wi*37+li*11);const d=Math.min(1,(wi*NL+li)/(WORLDS.length*NL-1));const F=WORLDS[wi].feat;
  const len=8200+wi*700+li*1000;
  const L={wi,li,ground:[],plats:[],rings:[],thorns:[],stars:[],boosts:[],tramps:[],hearts:[],storms:[],bobs:[],cands:[],len,check:0,end:0};
  const ground=(a,b)=>L.ground.push([a,b]);
  const row=(x0,n,y,dx=58)=>{for(let i=0;i<n;i++)L.rings.push({x:x0+i*dx,y,got:0});};
  const arc=(x0,x1,y0,h,n)=>{for(let i=0;i<n;i++){const t=(i+.5)/n;L.rings.push({x:x0+(x1-x0)*t,y:y0-Math.sin(t*Math.PI)*h,got:0});}};
  let x=1000;ground(-800,x);row(420,6,GY-55);
  let last='',lastH=0;
  while(x<len){
    const o=['flat','gap','islands','gap','flat','boost'];if(d>.12)o.push('thorns2');if(d>.25)o.push('stairs');
    if(F.tramp)o.push('tramp','tramp');if(F.mover)o.push('mover','mover','vmover');if(F.storm)o.push('storm','storm');if(F.bob)o.push('bob','bob');
    let k=o[r()*o.length|0];if(k===last)k=k==='flat'?'gap':'flat';last=k;
    switch(k){
    case 'flat':{const w=520+r()*380;ground(x,x+w);if(r()<.5)row(x+90,5,GY-55);else arc(x+60,x+w-120,GY-60,120,6);
      if(r()<.75)L.thorns.push({x:x+w*.62});if(r()<.18&&x-lastH>2400){L.hearts.push({x:x+w*.3,y:GY-210,got:0});lastH=x;}x+=w;break;}
    case 'thorns2':{const w=760;ground(x,x+w);L.thorns.push({x:x+250},{x:x+540});arc(x+150,x+350,GY-60,170,5);arc(x+440,x+640,GY-60,170,5);x+=w;break;}
    case 'gap':{const gw=140+r()*90+d*90;arc(x-70,x+gw+70,GY-55,200,7);x+=gw;const w=360+r()*240;ground(x,x+w);x+=w;break;}
    case 'islands':{const gw=520+r()*300+d*180;const n=gw>720?3:2;for(let i=0;i<n;i++){const pw=150+r()*40,px=x+(i+.5)*gw/n-pw/2,py=GY-80-r()*110-(i%2)*50;L.plats.push({x:px,w:pw,y:py});row(px+pw/2-50,3,py-58,50);if(i===n-1)L.cands.push({x:px+pw/2,y:py-250});}
      x+=gw;const w=420;ground(x,x+w);x+=w;break;}
    case 'stairs':{for(let i=0;i<3;i++){const px=x+50+i*220,py=GY-100-i*85;L.plats.push({x:px,w:150,y:py});row(px+25,3,py-58,50);}L.cands.push({x:x+700,y:GY-470});x+=880;const w=460;ground(x,x+w);x+=w;break;}
    case 'boost':{const w=1250;ground(x,x+w);L.boosts.push({x:x+120});row(x+260,16,GY-55,58);for(const tx of[480,720,960])L.thorns.push({x:x+tx});x+=w;break;}
    case 'tramp':{const w=760;ground(x,x+w);L.tramps.push({x:x+260,sq:0});for(let i=0;i<5;i++)L.rings.push({x:x+300+i*30,y:GY-140-i*70,got:0});L.cands.push({x:x+460,y:GY-470});L.thorns.push({x:x+620});x+=w;break;}
    case 'mover':{const gw=560;L.plats.push({x:x+90,w:170,y:GY-70,mv:{ax:150,ay:0,sp:1.3,ph:r()*6}});row(x+120,3,GY-130,50);x+=gw;const w=400;ground(x,x+w);x+=w;break;}
    case 'vmover':{const gw=520;L.plats.push({x:x+110,w:160,y:GY-120,mv:{ax:0,ay:90,sp:1.5,ph:r()*6}});L.plats.push({x:x+330,w:120,y:GY-230});row(x+350,2,GY-290,50);L.cands.push({x:x+390,y:GY-430});x+=gw;const w=400;ground(x,x+w);x+=w;break;}
    case 'storm':{const w=840;ground(x,x+w);L.storms.push({x:x+420,y:GY-190,ph:r()*6});row(x+150,4,GY-55);row(x+560,4,GY-55);x+=w;break;}
    case 'bob':{const gw=280;arc(x-60,x+gw+60,GY-60,230,7);L.bobs.push({x:x+gw/2,y:GY-60,ph:r()*6});x+=gw;const w=420;ground(x,x+w);x+=w;break;}
    }
  }
  {const gs=[];for(const q of L.ground){const l=gs[gs.length-1];if(l&&q[0]<=l[1]+1)l[1]=Math.max(l[1],q[1]);else gs.push(q.slice());}L.ground=gs;}
  // checkpoint
  let best=null;for(const s of L.ground){if(s[0]>len*.45&&s[1]-s[0]>300){best=s;break;}}L.check=best?best[0]+120:0;
  ground(x,x+2400);L.end=x+520;row(x+60,5,GY-55);
  // stars
  const cs=L.cands.slice();const picks=[];for(const f of[.2,.5,.8]){let bi=-1,bd=1e9;cs.forEach((q,i)=>{const dd=Math.abs(q.x-len*f);if(dd<bd&&!picks.includes(q)){bd=dd;bi=i;}});if(bi>=0&&bd<len*.18)picks.push(cs[bi]);else{const tx=len*f;const s=L.ground.find(s=>s[0]<tx&&s[1]>tx+200)||L.ground[0];picks.push({x:Math.max(s[0]+150,Math.min(s[1]-100,tx)),y:GY-330});}}
  L.stars=picks.map(q=>({x:q.x,y:q.y,got:0}));
  // clear rings overlapping thorns
  L.rings=L.rings.filter(q=>!L.thorns.some(t=>Math.abs(t.x-q.x)<26&&q.y>GY-90));
  return L;
}
function platPos(p,t){if(!p.mv)return p;return{x:p.x+Math.sin(t*p.mv.sp+p.mv.ph)*p.mv.ax,y:p.y+Math.sin(t*p.mv.sp+p.mv.ph)*p.mv.ay,w:p.w};}

// ---------- audio ----------
let AC=null,master=null,musG=null;
function audio(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();master=AC.createGain();master.gain.value=.5;master.connect(AC.destination);musG=AC.createGain();musG.gain.value=save.music?.55:0;musG.connect(master);}catch(e){}}
function tone(f,d,type='sine',v=.25,f2=0,dl=0,dest){if(!AC)return;const t=AC.currentTime+dl;const o=AC.createOscillator(),gn=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(v,t+.01);gn.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(gn);gn.connect(dest||master);o.start(t);o.stop(t+d+.05);}
let combo=0,comboT=0;
function sfx(n){if(!AC)return;switch(n){
  case 'jump':tone(420,.18,'triangle',.18,760);break;
  case 'jump2':tone(600,.2,'triangle',.16,1200);tone(900,.15,'sine',.08,1500,.05);break;
  case 'ring':{const f=880*Math.pow(2,Math.min(combo,12)/12);tone(f,.15,'sine',.16);tone(f*2,.1,'sine',.05,0,.03);break;}
  case 'hurt':tone(330,.35,'sawtooth',.12,110);break;
  case 'star':[0,4,7,12].forEach((s,i)=>tone(660*Math.pow(2,s/12),.25,'triangle',.15,0,i*.07));break;
  case 'heart':[0,7,12].forEach((s,i)=>tone(520*Math.pow(2,s/12),.2,'sine',.15,0,i*.06));break;
  case 'boost':tone(300,.6,'sawtooth',.06,1200);[0,4,7,11,14].forEach((s,i)=>tone(700*Math.pow(2,s/12),.15,'triangle',.08,0,i*.05));break;
  case 'boing':tone(180,.4,'sine',.3,720);break;
  case 'poof':tone(500,.25,'square',.06,120);break;
  case 'portal':for(let i=0;i<10;i++)tone(400*Math.pow(2,i/6),.3,'sine',.1,0,i*.07);break;
  case 'win':[0,4,7,12,16,19,24].forEach((s,i)=>tone(523*Math.pow(2,s/12),.35,'triangle',.14,0,i*.1));break;
  case 'click':tone(700,.07,'sine',.12);break;
  case 'splash':tone(800,.3,'triangle',.08,150);break;
}}
// music
const SC=[[0,2,4,7,9],[0,3,5,7,10],[0,2,4,7,9],[0,2,3,7,8],[0,2,4,5,9],[0,2,4,7,11]];
const ROOT=[523,494,587,466,554,523];
let musStep=0,musNext=0,musWorld=0;
function musTick(){if(!AC||!save.music||document.hidden)return;const now=AC.currentTime;if(musNext<now)musNext=now+.05;
  while(musNext<now+.3){const s=musStep%32,sc=SC[musWorld],root=ROOT[musWorld];const r=mulberry(musWorld*97+(musStep>>5)%4*13+s)();
    if(s%2===0||r<.3){const deg=[0,2,4,2,1,3,4,0][(s>>2)%8]+((s&3)===2?2:0);const st=sc[(deg+5)%5]+12*Math.floor(deg/5);if(r<.85)tone(root*Math.pow(2,st/12),.22,'triangle',.11,0,musNext-now,musG);}
    if(s%8===0)tone(root/4*Math.pow(2,[0,5,7,3][(s>>3)%4]/12),.5,'sine',.22,0,musNext-now,musG);
    if(s%4===2)tone(root/2*Math.pow(2,[0,5,7,3][(s>>3)%4]/12+[0,4,7][(s>>2)%3]/12),.18,'sine',.06,0,musNext-now,musG);
    musStep++;musNext+=.16;}}
const MUSL={"m0": 73.84615, "m1": 65.08475, "m2": 68.57143, "m3": 91.42857, "m4": 76.8, "m5": 61.93548, "m6": 68.57143},WMUS=['m1','m2','m1','m3','m4','m5','m6'];const MBUF={};let musSrc=null,musName='',musFade=null;
function decode(ab){return new Promise((res,rej)=>{try{const p=AC.decodeAudioData(ab,res,rej);if(p&&p.then)p.then(res,rej);}catch(e){rej(e)}});}
function getMus(n){if(!MBUF[n])MBUF[n]=fetch('a/'+n+'.mp3').then(r=>r.arrayBuffer()).then(decode).catch(()=>null);return MBUF[n];}
function playMusic(n){if(!AC||n===musName)return;musName=n;getMus(n).then(buf=>{if(!buf||musName!==n)return;const old=musSrc;
  const gn=AC.createGain();gn.gain.value=0;gn.connect(musG);const src=AC.createBufferSource();src.buffer=buf;src.loop=true;src.loopStart=1.0;src.loopEnd=Math.min(buf.duration-.05,1.0+MUSL[n]);src.connect(gn);src.start();
  const t=AC.currentTime;gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(1,t+1.2);musSrc={src,gn};
  if(old){old.gn.gain.cancelScheduledValues(t);old.gn.gain.setValueAtTime(old.gn.gain.value,t);old.gn.gain.linearRampToValueAtTime(0,t+.9);setTimeout(()=>{try{old.src.stop()}catch(e){}},1100);}});
  for(const k of WMUS)if(k!==n&&!MBUF[k]){setTimeout(()=>getMus(k),4000);break;}}
function wantMusic(){if(!AC)return;if(mode==='play'||mode==='portal'||mode==='pause'||mode==='win')playMusic(WMUS[L?L.wi:0]);else playMusic('m0');}
setInterval(wantMusic,400);

// ---------- game state ----------
let mode='title',L=null,PL=null,T=0,camX=0,camY=0,held=false,jbuf=0,parts=[],trail=[],shake=0,lvRings=0,banner=null,winT=0,mapAnim=null;
const GR=2700,JV=1080,JV2=980;
function SPD(){return 440+(L?L.wi:0)*14;}
function newPlayer(x){return{x,y:GY,vy:0,onG:true,jumps:0,coy:0,glide:0,inv:0,boost:0,hearts:3,ph:0,wing:0,safeX:x,trailT:0,gl:0,flt:0,dead:0};}
function startLevel(wi,li){L=genLevel(wi,li);PL=newPlayer(150);camX=PL.x-W*.28;camY=0;parts=[];trail=[];lvRings=0;T=0;musWorld=wi%6;loadWorld(wi);if(wi+1<WORLDS.length)setTimeout(()=>loadWorld(wi+1),3000);mode='play';showScr(null);$('hud').style.display='flex';
  banner={t:WORLDS[wi].name,s:'Razina '+(li+1),life:2.4};updHud();}
function glideMax(){return .9+save.up.let*.6;}
function burst(x,y,cols,n=12,sp=260,sz=6){for(let i=0;i<n;i++){const a=Math.random()*7,v=sp*(.4+Math.random()*.6);parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-80,life:.6+Math.random()*.4,max:1,c:cols[i%cols.length],s:sz*(.6+Math.random()*.6),star:Math.random()<.4});}}
const RAIN=['#ff5d8f','#ffa64d','#ffe14d','#6ee07a','#5ec8ff','#a37bff'];
function onGroundX(x){for(const s of L.ground)if(x+22>s[0]&&x-22<s[1])return true;return false;}
function hurt(){const p=PL;if(p.inv>0||p.boost>0)return;p.hearts--;p.inv=1.8;p.vy=-620;p.onG=false;p.jumps=1;sfx('hurt');shake=.35;burst(p.x,p.y-70,['#ffffff','#ffb3d1'],10);updHud();if(p.hearts<=0)lose();}
function lose(){const p=PL;p.hearts=3;const cx=(L.check&&p.x>L.check)?L.check:150;respawn(cx);banner={t:'Još jednom!',s:'Možeš ti to! 💪',life:2};updHud();}
function respawn(x){const p=PL;const s=L.ground.find(s=>s[1]>x+150)||L.ground[0];p.x=Math.max(s[0]+40,Math.min(x,s[1]-200));p.y=GY-180;p.vy=0;p.flt=.5;p.inv=Math.max(p.inv,1.6);p.onG=false;p.jumps=1;trail=[];}
function fell(){const p=PL;p.hearts--;sfx(L.wi===4?'splash':'hurt');shake=.3;updHud();if(p.hearts<=0){lose();return;}respawn(p.safeX-120);}
function press(){audio();if(mode==='play'){jbuf=.16;held=true;}}
function release(){held=false;}

function update(dt){T+=dt;const p=PL;
  if(mode==='portal'){winT+=dt;p.x+=SPD()*dt*.5*(1-Math.min(1,winT));if(winT>1.4){finishLevel();}return;}
  const boostOn=p.boost>0;const sp=SPD()*(boostOn?1.65:1);
  if(p.flt>0){p.flt-=dt;p.vy=0;}else{
  p.x+=sp*dt;
  if(jbuf>0)jbuf-=dt;
  if(p.onG)p.coy=.13;else p.coy-=dt;
  if(jbuf>0){if(p.coy>0){p.vy=-JV;p.jumps=1;p.onG=false;p.coy=0;jbuf=0;sfx('jump');burst(p.x-10,p.y,['#ffffff'],5,120,4);}
    else if(p.jumps<2){p.vy=-JV2;p.jumps=2;jbuf=0;sfx('jump2');p.trailT=.7;burst(p.x,p.y-40,RAIN,10,200,5);}}
  p.vy+=GR*dt;
  p.gl=0;if(held&&p.vy>0&&!p.onG&&p.glide>0){p.vy=Math.min(p.vy,120);p.glide-=dt;p.gl=1;if(Math.random()<.4)parts.push({x:p.x-30,y:p.y-60,vx:-60,vy:30,life:.5,max:.5,c:RAIN[Math.random()*6|0],s:4,star:1});}
  const py0=p.y;p.y+=p.vy*dt;p.onG=false;
  if(p.vy>=0){
    if(p.y>=GY&&py0<=GY+28&&onGroundX(p.x)){p.y=GY;land();p.safeX=p.x;
      for(const tr of L.tramps)if(Math.abs(p.x-tr.x)<62){p.vy=-(1520+save.up.skok*90);p.onG=false;p.jumps=1;tr.sq=1;sfx('boing');burst(tr.x,GY-50,['#ffffff','#ff8fb1'],8);}}
    else for(const pl of L.plats){const q=platPos(pl,T);if(p.x+24>q.x&&p.x-24<q.x+q.w&&py0<=q.y+8+Math.max(0,q.y-platPos(pl,T-dt).y)&&p.y>=q.y){p.y=q.y;land();break;}}
  }}
  if(p.y>GY+300){fell();}
  if(p.inv>0)p.inv-=dt;if(p.boost>0){p.boost-=dt;if(Math.random()<.6)parts.push({x:p.x-40,y:p.y-30-Math.random()*60,vx:-200,vy:0,life:.4,max:.4,c:RAIN[Math.random()*6|0],s:5,star:1});}
  if(p.trailT>0)p.trailT-=dt;
  p.ph+=dt*(p.onG?sp/34:0);p.wing=p.onG?0:(p.gl?Math.sin(T*18)*.5+.3:Math.sin(T*12)*.4+.4);
  if(comboT>0){comboT-=dt;if(comboT<=0)combo=0;}
  // trail
  if(p.boost>0||p.trailT>0)trail.push([p.x-20,p.y-62,T]);while(trail.length&&(T-trail[0][2]>.45||trail.length>60))trail.shift();
  // pickups
  const cxp=p.x+12,cyp=p.y-72,mag=save.up.mag?60+save.up.mag*55:0;
  for(const q of L.rings){if(q.got)continue;const dx=q.x-cxp,dy=q.y-cyp;if(Math.abs(dx)>300)continue;const d2=dx*dx+dy*dy;
    if(mag&&d2<(mag+60)**2){const d=Math.sqrt(d2)||1;q.x-=dx/d*620*dt;q.y-=dy/d*620*dt;}
    if(d2<52*52){q.got=1;lvRings++;combo++;comboT=.5;sfx('ring');burst(q.x,q.y,['#ff6fbd','#ffffff','#ffd3ec'],6,160,4);updHud();}}
  for(const q of L.stars){if(q.got)continue;if(Math.hypot(q.x-cxp,q.y-cyp)<62){q.got=1;sfx('star');burst(q.x,q.y,['#ffe14d','#ffffff','#ffb84d'],20,320,7);updHud();banner={t:'⭐ Zvjezdica!',s:'',life:1.1,small:1};}}
  for(const q of L.hearts){if(q.got)continue;if(Math.hypot(q.x-cxp,q.y-cyp)<56){q.got=1;p.hearts=Math.min(3,p.hearts+1);sfx('heart');burst(q.x,q.y,['#ff5d8f','#ffffff'],12);updHud();}}
  for(const b of L.boosts){if(!b.used&&p.onG&&Math.abs(p.x-(b.x+50))<70){b.used=1;p.boost=2.2+save.up.jur*.8;sfx('boost');banner={t:'🌈 Dugin juriš!',s:'',life:1.2,small:1};}}
  // hazards
  for(const t of L.thorns){if(t.dead)continue;const dx=t.x-p.x,dy=(GY-30)-(p.y-58);if(Math.abs(dx)>120)continue;if(dx*dx+dy*dy<50*50){if(p.boost>0){t.dead=1;sfx('poof');burst(t.x,GY-30,['#ff5ad0','#7a3aa8','#ffffff'],14);lvRings+=2;updHud();}else hurt();}}
  for(const s of L.storms){const sy=s.y+Math.sin(T*1.6+s.ph)*95;const dx=s.x-p.x,dy=sy-(p.y-62);if(Math.abs(dx)<170&&dx*dx+dy*dy<70*70){if(p.boost>0&&!s.dead){s.dead=1;sfx('poof');burst(s.x,sy,['#9a8ab8','#ffffff'],14);}else if(!s.dead)hurt();}}
  for(const s of L.bobs){const sy=s.y-Math.abs(Math.sin(T*1.8+s.ph))*220;const dx=s.x-p.x,dy=sy-(p.y-62);if(!s.dead&&dx*dx+dy*dy<56*56){if(p.boost>0){s.dead=1;sfx('poof');burst(s.x,sy,['#b06ad8','#ffffff'],14);}else hurt();}}
  for(const tr of L.tramps)if(tr.sq>0)tr.sq-=dt*3;
  if(L.check&&!L.checked&&p.x>L.check){L.checked=1;sfx('heart');burst(L.check,GY-150,RAIN,18);banner={t:'🌸 Kontrolna točka',s:'',life:1.2,small:1};}
  if(p.x>=L.end-40){mode='portal';winT=0;sfx('portal');burst(L.end,GY-170,RAIN,40,400,8);}
  // camera
  const tx=p.x-W*.28;camX+=(tx-camX)*Math.min(1,dt*10);const ty=Math.max(-210,Math.min(0,p.y-330));camY+=(ty-camY)*Math.min(1,dt*4);
  // parts
  for(const q of parts){q.life-=dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=500*dt;}parts=parts.filter(q=>q.life>0);
  if(shake>0)shake-=dt;
  if(banner){banner.life-=dt;if(banner.life<=0)banner=null;}
  updProgress();
}
function land(){const p=PL;if(p.vy>500)burst(p.x,p.y,['#ffffff'],5,100,4);p.vy=0;p.onG=true;p.jumps=0;p.glide=glideMax();}

// ---------- rendering of level ----------
function gTop(){const o=W_(L.wi);return GY-o.ground.surf*H-2;}
function drawGround(c,x0,x1,Wd){const o=W_(L.wi);if(!o)return;const G=o.ground,gh=G.h*H,top=gTop();
  for(const s of L.ground){if(s[1]<x0-50||s[0]>x1+50)continue;const a=s[0],b=s[1];
    c.save();rr(c,a,top-200,b-a,1000,22);c.clip();
    c.fillStyle=G.fill;c.fillRect(Math.max(a,x0-10),top+gh-4,Math.min(b,x1+10)-Math.max(a,x0-10),400);
    let k=Math.floor(Math.max(a,x0-10)/TWL);for(let x=k*TWL;x<Math.min(b,x1+10);x+=TWL,k++){if(G.mir&&(k&1)){c.save();c.translate(x+TWL,top);c.scale(-1,1);c.drawImage(G.img,0,0,TWL,gh);c.restore();}else c.drawImage(G.img,x,top,TWL,gh);}
    c.restore();
    // soft edge shading
    for(const ex of[a,b]){if(ex<x0-30||ex>x1+30)continue;const gr=c.createLinearGradient(ex,0,ex+(ex===a?24:-24),0);gr.addColorStop(0,'rgba(40,20,40,.35)');gr.addColorStop(1,'rgba(40,20,40,0)');c.fillStyle=gr;c.fillRect(ex===a?ex:ex-24,GY,24,300);}
  }}
function drawGaps(c,x0,x1,Wd,t){if(!Wd.feat.water)return;const y=GY+30;const gr=c.createLinearGradient(0,y,0,y+200);gr.addColorStop(0,'#5fe0e0');gr.addColorStop(1,'#1f9fc0');c.fillStyle=gr;c.fillRect(x0-50,y,x1-x0+100,500);c.fillStyle='rgba(255,255,255,.7)';for(let x=Math.floor(x0/60)*60;x<x1+60;x+=60){ell(c,x+Math.sin(t*2+x)*8,y+4,20,4);c.fill();}}
function drawIsland(c,q,Wd){const o=W_(L.wi);if(!o)return;const G=o.ground;const{x,y,w}=q;const gh=G.h*H,sf=G.surf*H;
  c.beginPath();c.moveTo(x+6,y+20);c.quadraticCurveTo(x+w*.2,y+64,x+w*.45,y+96);c.quadraticCurveTo(x+w*.55,y+104,x+w*.62,y+84);c.quadraticCurveTo(x+w*.85,y+52,x+w-6,y+20);c.closePath();c.fillStyle=G.dark;c.fill();c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=3;c.stroke();
  c.lineCap='round';for(let i=0;i<3;i++){const rx=x+w*(.38+i*.12),ry=y+74+(i%2)*10;c.beginPath();c.moveTo(rx,ry-14);c.quadraticCurveTo(rx+(i-1)*10,ry+12,rx+(i-1)*18+6,ry+22);c.strokeStyle='#3a1f52';c.lineWidth=5;c.stroke();ell(c,rx+(i-1)*18+6,ry+24,5,7,(i-1)*.6);c.fillStyle='#2a1640';c.fill();}
  c.save();rr(c,x,y-sf-40,w,sf+40+Math.min(gh-sf,46),18);c.clip();c.fillStyle=G.fill;c.fillRect(x,y,w,50);{const k=G.img.width/TWL,sw=Math.min(G.img.width,w*k),sx=Math.abs(x*1.7)%Math.max(1,G.img.width-sw);c.drawImage(G.img,sx,0,sw,G.img.height,x,y-sf-2,w,gh);}c.restore();}
function drawTramp(c,tr,Wd){const sq=Math.max(0,tr.sq);const x=tr.x,y=GY;c.save();c.translate(x,y);c.scale(1+sq*.25,1-sq*.3);
  rr(c,-12,-46,24,46,10);fs(c,'#fff1dc','#c9a27a',3);c.beginPath();c.moveTo(-62,-40);c.bezierCurveTo(-60,-104,60,-104,62,-40);c.quadraticCurveTo(0,-26,-62,-40);c.closePath();fs(c,'#ff6fae','#a83a6a',4);
  for(const[dx,dy,r]of[[-30,-62,9],[8,-80,10],[34,-58,8]]){ell(c,dx,dy,r,r*.8);fs(c,'#ffffff');}c.restore();}
function drawBoost(c,b,t){const x=b.x,y=GY;c.save();c.globalAlpha=b.used?.4:1;rr(c,x,y-8,100,14,7);fs(c,'#ffffff','#c9a0e0',3);for(let i=0;i<6;i++){c.fillStyle=RAIN[i];c.fillRect(x+6+i*15,y-5,13,8);}
  for(let k=0;k<3;k++){const a=((t*2+k/3)%1);c.globalAlpha=(b.used?.2:1)*(1-a);poly(c,[x+20+k*24,y-26-a*30,x+34+k*24,y-40-a*30,x+20+k*24,y-54-a*30]);fs(c,null,RAIN[k*2],4);}c.restore();}
function drawStorm(c,s,t,Wd){if(s.dead)return;const y=s.y+Math.sin(t*1.6+s.ph)*95;c.save();c.translate(s.x,y);
  if((t+s.ph)%2.2<.25){c.beginPath();c.moveTo(-6,30);c.lineTo(8,58);c.lineTo(-4,60);c.lineTo(10,92);fs(c,null,'#ffe14d',5);}
  for(const[dx,dy,r]of[[-38,4,28],[0,-12,38],[38,2,30],[0,14,30]]){ell(c,dx,dy,r,r*.85);fs(c,'#6f6390','#3e3460',4);}for(const[dx,dy,r]of[[-38,4,28],[0,-12,38],[38,2,30],[0,14,30]]){ell(c,dx,dy,r-3,r*.85-3);fs(c,'#6f6390');}
  ell(c,-14,-4,6,7);fs(c,'#ffffff');ell(c,14,-4,6,7);fs(c,'#ffffff');ell(c,-13,-2,3,4);fs(c,'#2a2040');ell(c,15,-2,3,4);fs(c,'#2a2040');
  c.beginPath();c.moveTo(-22,-14);c.lineTo(-8,-10);c.moveTo(22,-14);c.lineTo(8,-10);fs(c,null,'#2a2040',3);c.beginPath();c.arc(0,16,8,3.6,5.8);fs(c,null,'#2a2040',3);c.restore();}
function drawBob(c,s,t){if(s.dead)return;const y=s.y-Math.abs(Math.sin(t*1.8+s.ph))*220;c.save();c.translate(s.x,y);const gr=c.createRadialGradient(0,0,4,0,0,60);gr.addColorStop(0,'rgba(255,60,200,.45)');gr.addColorStop(1,'rgba(255,60,200,0)');c.fillStyle=gr;c.fillRect(-60,-60,120,120);
  for(let i=0;i<5;i++){c.beginPath();c.moveTo(-20+i*10,4);c.quadraticCurveTo(-24+i*10+Math.sin(t*6+i)*8,24,-20+i*10,44);fs(c,null,'#4b2370',4);}
  c.beginPath();c.moveTo(-30,6);c.bezierCurveTo(-30,-40,30,-40,30,6);c.quadraticCurveTo(0,0,-30,6);fs(c,'#3a1a5a','#ff5ad0',2.5);ell(c,-10,-12,5,6);fs(c,'#ffffff');ell(c,10,-12,5,6);fs(c,'#ffffff');ell(c,-9,-11,2.5,3);fs(c,'#1a0a2a');ell(c,11,-11,2.5,3);fs(c,'#1a0a2a');c.restore();}
function drawPortal(c,x,y,t,sc=1){c.save();c.translate(x,y);c.scale(sc,sc);const gr=c.createRadialGradient(0,0,20,0,0,240);gr.addColorStop(0,'rgba(255,120,220,.7)');gr.addColorStop(1,'rgba(255,120,220,0)');c.fillStyle=gr;c.fillRect(-240,-240,480,480);
  c.save();ell(c,0,0,78,175);c.clip();c.rotate(.5);for(let i=-14;i<14;i++){const yy=((i*26+t*140)%728+728)%728-364;c.fillStyle=RAIN[(i+60)%6];c.fillRect(-200,yy,400,27);}c.restore();
  ell(c,0,0,78,175);c.strokeStyle='#ff4fc8';c.lineWidth=10;c.stroke();c.strokeStyle='#ffd3f2';c.lineWidth=4;c.stroke();
  for(let i=0;i<8;i++){const a=t*2+i*.785;star5(c,Math.cos(a)*100,Math.sin(a)*200,9,4,t);c.fillStyle='#ffffff';c.fill();}c.restore();}
function drawFlag(c,x,on,t){c.save();c.translate(x,GY);c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(8,-80,0,-150);fs(c,null,'#4f9a49',7);
  const op=on?1:.35;for(let i=0;i<6;i++){const a=i*1.047+t*(on?1:0);ell(c,Math.cos(a)*22*op,-160+Math.sin(a)*22*op,14*op+4,9*op+4,a);fs(c,on?RAIN[i]:'#bbbbbb',on?dk(RAIN[i],.3):'#888888',2);}ell(c,0,-160,10,10);fs(c,'#ffe14d','#c9a020',2);c.restore();}

function render(){const Wd=WORLDS[L.wi];const c=g;c.setTransform(S,0,0,S,0,0);if(!W_(L.wi)){c.fillStyle='#ffd3ec';c.fillRect(0,0,W,H);loadingTxt(c);return;}
  let sx=0,sy=0;if(shake>0){sx=(Math.random()-.5)*14*shake;sy=(Math.random()-.5)*14*shake;}
  SAT=1;HAZEK=0;drawBack(c,L.wi,camX,camY,T);
  c.save();c.translate(-camX+sx,-camY+sy);const x0=camX,x1=camX+W;
  drawGaps(c,x0,x1,Wd,T);
  if(L.check&&L.check>x0-200&&L.check<x1+200)drawFlag(c,L.check,L.checked,T);
  if(L.end<x1+300)drawPortal(c,L.end,GY-175,T);
  drawGround(c,x0,x1,Wd);
  for(const pl of L.plats){const q=platPos(pl,T);if(q.x>x1+50||q.x+q.w<x0-50)continue;drawIsland(c,q,Wd);}
  for(const b of L.boosts)if(b.x>x0-150&&b.x<x1+50)drawBoost(c,b,T);
  for(const tr of L.tramps)if(tr.x>x0-100&&tr.x<x1+100)drawTramp(c,tr,Wd);
  const th=thornSpr(L.wi);for(const t of L.thorns){if(t.dead||t.x<x0-100||t.x>x1+100)continue;const pu=1+Math.sin(T*3+t.x)*.03;c.drawImage(th,t.x-70*pu,GY-118*pu+6,140*pu,130*pu);}
  for(const s of L.storms)if(s.x>x0-150&&s.x<x1+150)drawStorm(c,s,T,Wd);
  for(const s of L.bobs)if(s.x>x0-150&&s.x<x1+150)drawBob(c,s,T);
  const rs=ringSpr();for(const q of L.rings){if(q.got||q.x<x0-40||q.x>x1+40)continue;const sw=Math.cos(T*3+q.x*.01);c.drawImage(rs,q.x-30*Math.abs(sw)-1,q.y-30,60*Math.abs(sw)+2,60);}
  for(const q of L.hearts){if(q.got||q.x<x0-60||q.x>x1+60)continue;const y=q.y+Math.sin(T*3)*8;heartP(c,q.x,y,26);fs(c,'#ff5d8f','#b02a5a',4);ell(c,q.x-9,y-12,5,4);fs(c,'#ffffff');}
  for(const q of L.stars){if(q.got||q.x<x0-60||q.x>x1+60)continue;const y=q.y+Math.sin(T*2.4+q.x)*10;const gr=c.createRadialGradient(q.x,y,4,q.x,y,60);gr.addColorStop(0,'rgba(255,240,150,.8)');gr.addColorStop(1,'rgba(255,240,150,0)');c.fillStyle=gr;c.fillRect(q.x-60,y-60,120,120);star5(c,q.x,y,30,14,Math.sin(T*2)*.2);fs(c,'#ffd84d','#d08a10',4);ell(c,q.x-6,y-8,5,3.5,-.5);fs(c,'#fffbe0');}
  // rainbow trail
  if(trail.length>2){for(let k=0;k<6;k++){c.beginPath();trail.forEach((q,i)=>{const y=q[1]-15+k*6;i?c.lineTo(q[0],y):c.moveTo(q[0],y);});c.strokeStyle=RAIN[k];c.globalAlpha=.85;c.lineWidth=6.5;c.lineCap='round';c.stroke();}c.globalAlpha=1;}
  // player
  const p=PL;if(!(p.inv>0&&Math.floor(T*14)%2&&p.boost<=0)){c.save();c.translate(p.x,p.y);let sc=1;if(mode==='portal'){sc=Math.max(0,1-winT*.9);c.globalAlpha=sc;}c.scale(sc,sc);
    if(p.boost>0){const gr=c.createRadialGradient(0,-70,10,0,-70,110);gr.addColorStop(0,'rgba(255,255,255,.5)');gr.addColorStop(1,'rgba(255,200,240,0)');c.fillStyle=gr;c.fillRect(-110,-180,220,220);}
    if(p.flt>0){ell(c,10,-80,90,90);c.fillStyle='rgba(200,230,255,.35)';c.fill();c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=3;c.stroke();}
    drawUni(c,save.uni,T,{ph:p.ph,air:!p.onG,wing:p.wing,rider:1,vy:p.vy});c.restore();}
  if(p.onG||p.y>GY-400){c.save();c.globalAlpha=.18*Math.max(0,1-(GY-p.y)/400);ell(c,p.x,GY+4,50,8);c.fillStyle='#000';c.fill();c.restore();}
  for(const q of parts){c.globalAlpha=Math.max(0,q.life/q.max);if(q.star){star5(c,q.x,q.y,q.s,q.s*.45,q.life*4);c.fillStyle=q.c;c.fill();}else{ell(c,q.x,q.y,q.s,q.s);c.fillStyle=q.c;c.fill();}}c.globalAlpha=1;
  c.restore();
  if(mode==='portal'&&winT>.8){c.fillStyle=`rgba(255,255,255,${Math.min(1,(winT-.8)/.6)})`;c.fillRect(0,0,W,H);}
  drawBanner(c);
}
function drawBanner(c){if(!banner)return;const b=banner,a=Math.min(1,b.life*2,(b.small?1.1:2.4)-b.life+.3);c.save();c.globalAlpha=Math.max(0,Math.min(1,a));c.textAlign='center';c.textBaseline='middle';
  const y=b.small?190:250;c.font=`800 ${b.small?44:72}px "Baloo 2",system-ui,sans-serif`;c.lineWidth=b.small?9:12;c.strokeStyle='#b0447e';c.strokeText(b.t,W/2,y);c.fillStyle='#ffffff';c.fillText(b.t,W/2,y);
  if(b.s){c.font='800 36px "Baloo 2",system-ui,sans-serif';c.lineWidth=7;c.strokeText(b.s,W/2,y+62);c.fillStyle='#fff3a8';c.fillText(b.s,W/2,y+62);}c.restore();}

// ---------- map ----------
const NODES=[[.14,.74],[.34,.44],[.56,.72],[.76,.42]],GATE=[.91,.66];
let MAP=null;
function buildMap(wi){const Wd=WORLDS[wi];const o=W_(wi);if(!o)return false;const mk=sat=>{const cnv=document.createElement('canvas');const k=Math.min(S,1.5);cnv.width=Math.ceil(W*k);cnv.height=Math.ceil(H*k);const c=cnv.getContext('2d');c.scale(k,k);SAT=sat;HAZEK=0;const r=mulberry(300+wi);
    const im=sat?o.map:o.mapg;const sc=Math.max(W/im.width,H/im.height);c.drawImage(im,(W-im.width*sc)/2,(H-im.height*sc)/2,im.width*sc,im.height*sc);c.fillStyle='rgba(255,255,255,.12)';c.fillRect(0,0,W,H);
    const pts=[[-.02,.86],...NODES,GATE].map(q=>[q[0]*W,q[1]*H]);c.lineCap='round';c.lineJoin='round';
    for(const[lw,col]of[[46,'#b89a78'],[38,'#fbf6ea']]){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];c.bezierCurveTo((a[0]+b[0])/2,a[1],(a[0]+b[0])/2,b[1],b[0],b[1]);}c.strokeStyle=C(col);c.lineWidth=lw;c.stroke();}
    c.setLineDash([2,22]);c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];c.bezierCurveTo((a[0]+b[0])/2,a[1],(a[0]+b[0])/2,b[1],b[0],b[1]);}c.strokeStyle=C('#e6c9a0');c.lineWidth=8;c.stroke();c.setLineDash([]);
    NODES.forEach((q,i)=>{const x=q[0]*W,y=q[1]*H;ell(c,x,y+10,92,30);c.fillStyle=C('#000000',.18);c.fill();ell(c,x,y+6,88,28);fs(c,sat?'#bfe8a0':'#e8e8ee',sat?'#6fae5a':'#a8a8b8',3);const ty=Wd.deco[i];bld(c,ty,x,y+10,ty==='castle'?.42:ty==='balloon'?.55:.62,i,Wd.pal);});
    SAT=1;return cnv;};
  MAP={wi,grey:mk(0),color:mk(1)};return true;}
function nodeDone(wi,i){return save.done[wi+'-'+i]!=null;}
function nodeOpen(wi,i){if(i===0)return wi===0||worldDone(wi-1);return nodeDone(wi,i-1);}
function worldDone(wi){for(let i=0;i<NL;i++)if(!nodeDone(wi,i))return false;return true;}
function worldOpen(wi){return wi===0||worldDone(wi-1);}
function renderMap(dt){const c=g;c.setTransform(S,0,0,S,0,0);const wi=save.world;if(!MAP||MAP.wi!==wi||MAP.W!==W){loadWorld(wi);if(!buildMap(wi)){c.fillStyle='#ffd3ec';c.fillRect(0,0,W,H);loadingTxt(c);return;}MAP.W=W;}
  c.drawImage(MAP.grey,0,0,W,H);
  NODES.forEach((q,i)=>{if(!nodeDone(wi,i))return;let rad=230;if(mapAnim&&mapAnim.wi===wi&&mapAnim.i===i){rad=230*Math.min(1,Math.max(0,(mapAnim.t-.5)/1.4));}
    if(rad<=0)return;c.save();ell(c,q[0]*W,q[1]*H,rad*1.25,rad*.8);c.clip();c.drawImage(MAP.color,0,0,W,H);c.restore();});
  if(worldDone(wi)){c.save();ell(c,GATE[0]*W,GATE[1]*H,170,120);c.clip();c.drawImage(MAP.color,0,0,W,H);c.restore();}
  // gate portal
  drawPortal(c,GATE[0]*W,GATE[1]*H-70,T,.42);if(!worldDone(wi)){ell(c,GATE[0]*W,GATE[1]*H-70,40,80);c.fillStyle='rgba(120,120,140,.65)';c.fill();c.font='40px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText('🔒',GATE[0]*W,GATE[1]*H-70);}
  // node badges
  NODES.forEach((q,i)=>{const x=q[0]*W,y=q[1]*H+50,open=nodeOpen(wi,i),dn=nodeDone(wi,i);ell(c,x,y,26,26);fs(c,dn?'#ff6fae':open?'#ffffff':'#c9c9d6',dn?'#b0447e':'#8a7aa8',4);
    c.font='800 30px "Baloo 2",system-ui';c.textAlign='center';c.textBaseline='middle';c.fillStyle=dn?'#fff':open?'#b0447e':'#8a8aa0';c.fillText(String(i+1),x,y+2);
    const st=save.done[wi+'-'+i]||0;if(dn)for(let k=0;k<3;k++){star5(c,x-30+k*30,y+38,12,5.5);fs(c,k<st?'#ffd84d':'#e0dbe8',k<st?'#c98a10':'#a8a0b8',2.5);}
    if(open&&!dn){const by=q[1]*H-150+Math.sin(T*5)*10;poly(c,[x-20,by-24,x+20,by-24,x,by+8]);fs(c,'#ff6fae','#ffffff',4);}});
  if(mapAnim){mapAnim.t+=dt;const q=NODES[mapAnim.i],x=q[0]*W,y=q[1]*H;const a=mapAnim.t<.4?mapAnim.t/.4:Math.max(0,1-(mapAnim.t-1.6)/.8);
    if(a>0){c.save();c.globalAlpha=a;for(let k=0;k<6;k++){c.fillStyle=RAIN[k];c.fillRect(x-36+k*12,-20,12,y+10);}const gr=c.createRadialGradient(x,y,10,x,y,160);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(x-160,y-160,320,320);
      for(let k=0;k<14;k++){const ang=k*.45+mapAnim.t*3,rd=40+((mapAnim.t*120+k*30)%140);star5(c,x+Math.cos(ang)*rd,y+Math.sin(ang)*rd*.6,8,3.5,ang);c.fillStyle=RAIN[k%6];c.fill();}c.restore();}
    if(mapAnim.t>2.6)mapAnim=null;}
  // player icon at next node
  let cur=NODES.findIndex((_,i)=>nodeOpen(wi,i)&&!nodeDone(wi,i));const tq=cur<0?GATE:NODES[cur];c.save();c.translate(tq[0]*W-70,tq[1]*H+30);c.scale(.5,.5);drawUni(c,save.uni,T,{ph:0,air:0,wing:0,rider:1});c.restore();
}
function mapClick(px,py){const wi=save.world;for(let i=0;i<NL;i++){const q=NODES[i];if(Math.hypot(px-q[0]*W,py-(q[1]*H-30))<95){if(nodeOpen(wi,i)){sfx('click');startLevel(wi,i);}else{sfx('hurt');}return;}}
  if(Math.hypot(px-GATE[0]*W,py-(GATE[1]*H-70))<100){if(worldDone(wi)){sfx('portal');if(wi<WORLDS.length-1){save.world=wi+1;store();mapIntro();}else showEnd();}}}
function mapIntro(){const wi=save.world;$('mapTitle').textContent=WORLDS[wi].name;$('mapPrev').style.visibility=wi>0?'visible':'hidden';$('mapNext').style.visibility=wi<WORLDS.length-1&&worldOpen(wi+1)?'visible':'hidden';$('mapRings').textContent=save.rings;
  const seen=save.seen||(save.seen=[]);if(!seen.includes(wi)){seen.push(wi);store();showStory(WORLDS[wi].name,WORLDS[wi].story,()=>{showScr('sMap');});}}

// ---------- title scene ----------
function loadingTxt(c){c.font='800 44px "Baloo 2",system-ui';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#b0447e';c.fillText('Učitavam… ✨',W/2,H/2);}
function renderTitle(dt){const c=g;c.setTransform(S,0,0,S,0,0);loadWorld(0);const cam=T*300;SAT=1;drawBack(c,0,cam,0,T);const o=W_(0);if(!o){loadingTxt(c);return;}
  const G=o.ground,top=GY-G.surf*H-2;c.fillStyle=G.fill;c.fillRect(0,top+G.h*H-4,W,300);tiles(c,G.img,1,cam,top,G.h*H,G.mir,0);
  c.save();c.translate(W*.5,GY);c.scale(1.5,1.5);drawUni(c,save.uni,T,{ph:T*13,air:0,wing:0,rider:1});c.restore();
  for(let k=0;k<6;k++){c.beginPath();for(let i=0;i<20;i++){const x=W*.5-60-i*24,y=GY-110+k*8+Math.sin(T*6-i*.4)*4;i?c.lineTo(x,y):c.moveTo(x,y);}c.strokeStyle=RAIN[k];c.globalAlpha=.7;c.lineWidth=8;c.stroke();}c.globalAlpha=1;}

// ---------- loop ----------
let last=performance.now();
function frame(now){const dt=Math.min(1/30,(now-last)/1000);last=now;
  if(mode==='play'||mode==='portal'){if(W_(L.wi))update(dt);render();}
  else if(mode==='map'){T+=dt;renderMap(dt);}
  else if(mode==='title'||mode==='story'||mode==='shop'||mode==='end'){T+=dt;if(mode!=='map')renderTitle(dt);}
  else if(mode==='pause'||mode==='win'){render();}
  requestAnimationFrame(frame);}

// ---------- UI ----------
function showScr(id){document.querySelectorAll('.scr').forEach(s=>s.classList.toggle('on',s.id===id));}
function updHud(){if(!PL)return;$('hHearts').innerHTML=[0,1,2].map(i=>`<span class="ht ${i<PL.hearts?'':'off'}">❤</span>`).join('');$('hRings').textContent=lvRings;$('hStars').innerHTML=L.stars.map(s=>`<span class="${s.got?'':'off'}">★</span>`).join('');}
function updProgress(){const f=Math.max(0,Math.min(1,PL.x/L.end));$('pFill').style.width=(f*100)+'%';}
function finishLevel(){mode='win';const key=L.wi+'-'+L.li;const st=L.stars.filter(s=>s.got).length;const first=save.done[key]==null;save.done[key]=Math.max(save.done[key]||0,st);
  const bonus=first?50:10;save.rings+=lvRings+bonus;store();sfx('win');$('hud').style.display='none';
  $('wStars').innerHTML=[0,1,2].map(i=>`<span class="ws ${i<st?'on':''}" style="animation-delay:${.2+i*.25}s">★</span>`).join('');
  $('wRings').textContent='+'+lvRings;$('wBonus').textContent=first?'+50 bonus za novu razinu!':'+10 bonus';
  $('wTitle').textContent=['Bravo!','Super!','Odlično!','Juhu!'][Math.random()*4|0];
  showScr('sWin');if(first)mapAnim={wi:L.wi,i:L.li,t:0};}
function goMap(){mode='map';$('hud').style.display='none';showScr('sMap');mapIntro();}
function showStory(t,s,cb){$('stT').textContent=t;$('stS').textContent=s;showScr('sStory');$('stGo').onclick=()=>{sfx('click');cb();};}
function showEnd(){mode='end';showScr('sEnd');}
function renderShop(){$('shRings').textContent=save.rings;
  $('shUps').innerHTML=UPS.map(u=>{const lv=save.up[u.k],max=lv>=3,pr=UPC[lv];return `<div class="it"><div class="ic">${u.ic}</div><div class="tx"><b>${u.name}</b><small>${u.desc}</small><div class="dots">${[0,1,2].map(i=>`<i class="${i<lv?'on':''}"></i>`).join('')}</div></div>
    <button class="buy ${max?'max':save.rings<pr?'no':''}" data-u="${u.k}">${max?'✔':`<span class="rg"></span>${pr}`}</button></div>`;}).join('');
  $('shUnis').innerHTML=UNIS.map((u,i)=>{const own=save.owned.includes(i);return `<div class="uni ${save.uni===i?'sel':''}" data-i="${i}"><canvas width="220" height="200"></canvas><b>${u.name}</b>${own?'':`<span class="pr"><span class="rg"></span>${u.price}</span>`}</div>`;}).join('');
  document.querySelectorAll('#shUnis .uni').forEach(el=>{const i=+el.dataset.i,cn=el.querySelector('canvas'),c=cn.getContext('2d');c.translate(95,190);c.scale(.95,.95);drawUni(c,i,1,{ph:0,air:0,wing:0,rider:0});
    el.onclick=()=>{if(save.owned.includes(i)){save.uni=i;sfx('click');}else if(save.rings>=UNIS[i].price){save.rings-=UNIS[i].price;save.owned.push(i);save.uni=i;sfx('star');}else{sfx('hurt');return;}store();renderShop();};});
  document.querySelectorAll('#shUps .buy').forEach(b=>b.onclick=()=>{const k=b.dataset.u,lv=save.up[k];if(lv>=3)return;const pr=UPC[lv];if(save.rings<pr){sfx('hurt');return;}save.rings-=pr;save.up[k]++;sfx('star');store();renderShop();});}
let shopBack='title';
function openShop(from){shopBack=from;mode='shop';renderShop();showScr('sShop');}
function setMusic(on){save.music=on?1:0;store();if(musG)musG.gain.value=on?.55:0;document.querySelectorAll('.bMus').forEach(b=>b.textContent=on?'🎵':'🔇');}

// input
function lp(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H];}
cv.addEventListener('pointerdown',e=>{e.preventDefault();audio();if(mode==='play')press();else if(mode==='map'){const[x,y]=lp(e);mapClick(x,y);}});
addEventListener('pointerup',release);addEventListener('pointercancel',release);
addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW'){e.preventDefault();if(!e.repeat)press();}if(e.code==='Escape'&&mode==='play')pause();});
addEventListener('keyup',e=>{if(e.code==='Space'||e.code==='ArrowUp'||e.code==='KeyW')release();});
function pause(){if(mode!=='play')return;mode='pause';showScr('sPause');}
document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();if(AC)AC.suspend();}else if(AC)AC.resume();});
const on=(id,f)=>$(id).addEventListener('click',e=>{e.stopPropagation();audio();sfx('click');f();});
on('bPlay',()=>{if(!save.story){save.story=1;store();showStory('Dugina trka','Tamno trnje je ukralo boje iz Duginje zemlje. Leona i njezin jednorog trče, skaču i lete kroz šest svjetova da vrate sve boje! Dodirni ekran za skok, dodirni dvaput za dupli skok, a drži prst za lebdenje.',()=>goMap());}else goMap();});
on('bShop',()=>openShop('title'));on('bShop2',()=>openShop('map'));
on('shBack',()=>{if(shopBack==='map')goMap();else{mode='title';showScr('sTitle');}});
on('mapBack',()=>{mode='title';showScr('sTitle');});
on('mapPrev',()=>{if(save.world>0){save.world--;store();mapIntro();}});
on('mapNext',()=>{if(save.world<WORLDS.length-1&&worldOpen(save.world+1)){save.world++;store();mapIntro();}});
on('hPause',pause);
on('pCont',()=>{mode='play';showScr(null);});
on('pMap',()=>goMap());on('pRetry',()=>startLevel(L.wi,L.li));
on('wMap',()=>goMap());on('wRetry',()=>startLevel(L.wi,L.li));
on('wNext',()=>{const n=L.li+1;if(n<NL)startLevel(L.wi,n);else goMap();});
on('eBack',()=>{mode='title';showScr('sTitle');});
document.querySelectorAll('.bMus').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();audio();setMusic(!save.music);}));
$('hud').addEventListener('pointerdown',e=>{if(e.target.closest('button'))e.stopPropagation();});

function resize(){DPR=Math.min(2,devicePixelRatio||1);cv.width=Math.round(innerWidth*DPR);cv.height=Math.round(innerHeight*DPR);S=cv.height/H;W=cv.width/S;for(const k in SPR)delete SPR[k];MAP=null;
  $('rot').classList.toggle('on',innerHeight>innerWidth*1.05);}
addEventListener('resize',resize);
resize();setMusic(save.music);showScr('sTitle');requestAnimationFrame(frame);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{MAP=null;});
window.__dt={startLevel,get PL(){return PL},get L(){return L},save,goMap,set mode(v){mode=v},get mode(){return mode},finishLevel,update,render,set T(v){T=v},openShop,store};
})();
