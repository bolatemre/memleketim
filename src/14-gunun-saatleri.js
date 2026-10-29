/* ================= GÜNÜN SAATLERİ ================= */
// 1 gerçek saniye = 1 oyun dakikası; bir gün 24 dakika sürer
const gameMin=()=>Math.floor(now()/1000)%1440;
const hhmm=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
function darkness(m){const h=m/60,D=.7;if(h<5)return D;if(h<7)return D*(1-(h-5)/2);if(h<17.5)return 0;if(h<19.5)return .32*(h-17.5)/2;if(h<21)return .32+(D-.32)*(h-19.5)/1.5;return D;}
function sunset(m){const h=m/60;if(h<17&&h>7.5)return 0;if(h>=17&&h<20)return Math.sin((h-17)/3*Math.PI);if(h>=5&&h<=7.5)return Math.sin((h-5)/2.5*Math.PI)*.6;return 0;}
function lamps(){if(darkness(gameMin())<.05&&!lamps.always)return lamps.list||[];
  if(!lamps.list||lamps.n!==allRoads().length+S.blocks.length){lamps.n=allRoads().length+S.blocks.length;
    lamps.list=ROADS.filter(([x,y])=>(x*7+y*3)%5===0).concat((S.roads||[]).filter((_,i)=>i%3===2)).filter(([x,y])=>cellUnlocked(x,y)).map(([x,y])=>({type:'lamp',gx:x+.85,gy:y+.1}));}return lamps.list;}
lamps.always=true;
function drawLamp(e,t){const p=iso(e.gx,e.gy),d=darkness(gameMin());ctx.strokeStyle='#3d3a3a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x,p.y-40);ctx.stroke();
  ctx.fillStyle='#2f2c2c';ctx.fillRect(p.x-5,p.y-46,10,7);ctx.fillStyle=d>.12?'#ffe7a3':'#e8eef2';ctx.beginPath();ctx.arc(p.x,p.y-38,4,0,7);ctx.fill();}
const LIT={house:1,prod:1,hall:1,barn:1,service:1,market:1,helipad:.4,airport:1,station:.6};
// Gece: karanlık ayrı bir katmana çizilir, lambalar ve pencereler bu katmanda gerçekten "delik açar"
let NC=null,NX=null;
function drawNight(t){
  const m=gameMin(),d=darkness(m),ss=sunset(m);if(d<.01&&ss<.01)return;
  ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);
  if(ss>0){ctx.globalCompositeOperation='soft-light';ctx.fillStyle=`rgba(255,110,30,${.8*ss})`;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over';}
  ctx.restore();
  if(d<=0)return;
  // karanlık katmanı yarı çözünürlükte (yumuşak ışık için yeterli, telefonu yormaz)
  const cw=Math.ceil(cv.width/2),ch=Math.ceil(cv.height/2);if(!NC){NC=document.createElement('canvas');NX=NC.getContext('2d');}if(NC.width!==cw||NC.height!==ch){NC.width=cw;NC.height=ch;}
  const k=Math.max(0,Math.min(1,(d-.08)/.3)),wt0=ctx.getTransform(),wt=new DOMMatrix([wt0.a/2,wt0.b/2,wt0.c/2,wt0.d/2,wt0.e/2,wt0.f/2]);
  NX.setTransform(1,0,0,1,0,0);NX.globalCompositeOperation='source-over';NX.clearRect(0,0,cw,ch);NX.fillStyle=`rgba(12,20,54,${d})`;NX.fillRect(0,0,cw,ch);
  if(k>0){NX.setTransform(wt);NX.globalCompositeOperation='destination-out';
    const hole=(x,y,rx,ry,a)=>{const g=NX.createRadialGradient(x,y,0,x,y,rx);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(.55,`rgba(0,0,0,${a*.55})`);g.addColorStop(1,'rgba(0,0,0,0)');
      NX.fillStyle=g;NX.save();NX.translate(x,y);NX.scale(1,ry/rx);NX.translate(-x,-y);NX.beginPath();NX.arc(x,y,rx,0,7);NX.fill();NX.restore();};
    for(const l of lamps()){const p=iso(l.gx,l.gy);hole(p.x,p.y-6,135,95,.92*k);}
    for(const e of S.ents){const f=LIT[DEF[e.type].kind];if(!f||!cellUnlocked(e.gx,e.gy))continue;const r=rectOf(e);if(!r)continue;hole(r.x+r.w*.5,r.y+r.h*.62,r.w*.42,r.w*.3,.55*k*f);}
    for(const v of VILL){const p=iso(v.cx,v.cy);hole(p.x,p.y-12,26,20,.25*k);}}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(NC,0,0,cv.width,cv.height);ctx.restore();
  if(k<=0)return;
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const l of lamps()){const p=iso(l.gx,l.gy);const g=ctx.createRadialGradient(p.x,p.y-38,2,p.x,p.y-24,95);g.addColorStop(0,`rgba(255,214,120,${.75*k})`);g.addColorStop(.2,`rgba(255,190,90,${.28*k})`);g.addColorStop(1,'rgba(255,170,60,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(p.x,p.y-14,95,70,0,0,7);ctx.fill();}
  for(const e of S.ents){const d2=DEF[e.type];const f=LIT[d2.kind];if(!f||!cellUnlocked(e.gx,e.gy))continue;const r=rectOf(e);if(!r)continue;
    const flick=.92+Math.sin(t/700+e.gx*3+e.gy)*.08,x=r.x+r.w*.5,y=r.y+r.h*.62,R=r.w*.32;
    const g=ctx.createRadialGradient(x,y,4,x,y,R);g.addColorStop(0,`rgba(255,200,110,${.35*k*f*flick})`);g.addColorStop(1,'rgba(255,170,70,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,7);ctx.fill();
    for(let i=0;i<3;i++){const wx=r.x+r.w*(.3+i*.2),wy=r.y+r.h*(.5+((e.gx+i)%2)*.08);ctx.fillStyle=`rgba(255,226,140,${.5*k*f*flick})`;ctx.beginPath();ctx.arc(wx,wy,3.2,0,7);ctx.fill();}}
  ctx.restore();
}
