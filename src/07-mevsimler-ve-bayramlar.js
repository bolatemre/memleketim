/* ================= MEVSİMLER VE BAYRAMLAR ================= */
function season(){const m=new Date(now()).getMonth();return m===11||m<2?'kis':m<5?'ilkbahar':m<8?'yaz':'sonbahar';}
const SEASON_NAME={kis:'Kış',ilkbahar:'İlkbahar',yaz:'Yaz',sonbahar:'Sonbahar'};
const SEASON_TINT={kis:'rgba(255,255,255,.38)',ilkbahar:'rgba(255,190,225,.07)',yaz:null,sonbahar:'rgba(255,140,30,.16)'};
// Dini bayram tarihleri yaklaşıktır (Diyanet takvimine göre her yıl güncellenmeli)
const EVENTS=[
 {id:'cumhuriyet',n:'Cumhuriyet Bayramı',md:['10-28','10-30'],msg:'Cumhuriyet Bayramımız kutlu olsun! Bayram boyunca siparişlerde +%50 altın.',bonus:1.5,flag:true},
 {id:'zafer',n:'30 Ağustos Zafer Bayramı',md:['08-30','08-30'],msg:'Zafer Bayramımız kutlu olsun! Siparişlerde +%30 altın.',bonus:1.3,flag:true},
 {id:'cocuk',n:'23 Nisan Ulusal Egemenlik ve Çocuk Bayramı',md:['04-23','04-23'],msg:'23 Nisan kutlu olsun! Çocuklar pasta, kurabiye ve meyve suyu istiyor.',items:['cake','cookie','juice'],flag:true},
 {id:'genclik',n:'19 Mayıs Gençlik ve Spor Bayramı',md:['05-19','05-19'],msg:'19 Mayıs kutlu olsun! Siparişlerde +%30 altın.',bonus:1.3,flag:true},
 {id:'hidrellez',n:'Hıdrellez',md:['05-05','05-06'],msg:'Hıdrellez geldi! Halk oyunları gösterileri bedava.',freeShow:true,bunting:true},
 {id:'yilbasi',n:'Yılbaşı',md:['12-31','01-01'],msg:'Mutlu yıllar! Herkes pasta ve kurabiye istiyor.',items:['cake','cookie'],bunting:true},
 {id:'ramazan',n:'Ramazan Bayramı',dates:[['2027-03-09','2027-03-11'],['2028-02-26','2028-02-28']],msg:'Bayramınız mübarek olsun! Komşular kurabiye, künefe ve pasta bekliyor.',items:['cookie','kunefe','cake','simit'],bunting:true},
 {id:'kurban',n:'Kurban Bayramı',dates:[['2027-05-16','2027-05-19'],['2028-05-04','2028-05-07']],msg:'Bayramınız mübarek olsun! Kebap siparişleri bol.',items:['meat','adana','urfa','iskender'],bunting:true}
];
function curEvent(){const d=new Date(now()),md=String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'),ymd=dayKey(now());
  for(const e of EVENTS){if(e.md){const[a,b]=e.md;if(a<=b?(md>=a&&md<=b):(md>=a||md<=b))return e;}
    if(e.dates)for(const[a,b]of e.dates)if(ymd>=a&&ymd<=b)return e;}return null;}
function eventNotice(){const ev=curEvent();if(!ev||DEMO)return;const k=ev.id+dayKey(now());S.evSeen=S.evSeen||{};if(S.evSeen[k])return;S.evSeen[k]=1;save();
  setTimeout(()=>{sfx.fanfare();talk('p_baskan',ev.msg,[['Sağ ol!',null]]);},900);}
function eventOrder(){const ev=curEvent();if(!ev||!ev.items)return null;const pr=producible();const ok=ev.items.filter(k=>pr.includes(k));if(!ok.length||Math.random()>.45)return null;
  const it={};ok.sort(()=>Math.random()-.5).slice(0,1+Math.floor(Math.random()*2)).forEach(k=>it[k]=1+Math.floor(Math.random()*2));
  const v=Object.entries(it).reduce((a,[k,q])=>a+ITEMS[k].v*q,0),f=FOLK[Math.floor(Math.random()*FOLK.length)];
  return {id:Math.random().toString(36).slice(2),who:'p_baskan',folk:f.n+' · '+f.r,bayram:ev.n,items:it,coins:Math.round(v*1.8*orderMul()),xp:Math.max(4,Math.round(v/3+S.lvl))};}
function drawFlag(x,y,s,turk){ctx.save();ctx.translate(x,y);ctx.strokeStyle='#5b4a3a';ctx.lineWidth=2*s;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-40*s);ctx.stroke();
  const w=26*s,h=17*s,wave=Math.sin(now()/300+x)*1.5*s;ctx.translate(1,-40*s);
  if(turk){ctx.fillStyle='#e30a17';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(w/2,wave,w,0);ctx.lineTo(w,h);ctx.quadraticCurveTo(w/2,h+wave,0,h);ctx.closePath();ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(w*.38,h/2,h*.25,0,7);ctx.fill();ctx.fillStyle='#e30a17';ctx.beginPath();ctx.arc(w*.42,h/2,h*.2,0,7);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?h*.05:h*.125;ctx.lineTo(w*.6+Math.cos(a)*r,h/2+Math.sin(a)*r);}ctx.fill();}
  else{const cols=['#e2483d','#ffd23a','#3da5f5','#5fc03a'];for(let i=0;i<4;i++){ctx.fillStyle=cols[i];ctx.beginPath();ctx.moveTo(i*w/4,0);ctx.lineTo((i+1)*w/4,0);ctx.lineTo((i+.5)*w/4,h*.9+wave);ctx.closePath();ctx.fill();}}
  ctx.restore();}
function drawEventDeco(t){const ev=curEvent();if(!ev||!(ev.flag||ev.bunting))return;
  for(const e of S.ents){if(!['hall','cami1','cami2','cami3','cami4','school'].includes(e.type)||!cellUnlocked(e.gx,e.gy))continue;const r=rectOf(e);if(r)drawFlag(r.x+r.w*.85,r.y+r.h*.55,1.4,!!ev.flag);}
  for(const l of lamps()){const p=iso(l.gx,l.gy);drawFlag(p.x+2,p.y-30,.7,!!ev.flag);}}
const WX=[];
function drawWeather(t){if(S.world==='planet'){WX.length=0;return;}const s=season();if(s==='yaz'){WX.length=0;return;}
  const want=s==='kis'?90:s==='sonbahar'?26:22;ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);
  while(WX.length<want)WX.push({x:Math.random()*W,y:Math.random()*H,v:.4+Math.random()*.8,r:Math.random()*6.28,s:Math.random()});
  const dt=Math.min(50,t-(drawWeather.l||t));drawWeather.l=t;
  for(const p of WX){if(s==='kis'){p.y+=p.v*dt*.06;p.x+=Math.sin(t/900+p.r)*.3;ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.arc(p.x,p.y,1.5+p.s*2.2,0,7);ctx.fill();}
    else{p.y+=p.v*dt*.035;p.x+=Math.sin(t/700+p.r)*.6+.15;p.r+=.02;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);
      ctx.fillStyle=s==='sonbahar'?['#d9732a','#b84d1f','#e8a530'][Math.floor(p.s*3)]:['#ffc2dc','#ffe0ec','#fff'][Math.floor(p.s*3)];ctx.beginPath();ctx.ellipse(0,0,s==='sonbahar'?5:3.5,s==='sonbahar'?2.6:2.2,0,0,7);ctx.fill();ctx.restore();}
    if(p.y>H+10){p.y=-10;p.x=Math.random()*W;}if(p.x>W+10)p.x=-10;if(p.x<-10)p.x=W+10;}
  ctx.restore();}

