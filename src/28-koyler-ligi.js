/* ================= KÖYLER LİGİ ================= */
const LT=[{n:null,b:0},{n:'Karadeniz Hamsispor',b:1},{n:'Rize Çayspor',b:2},{n:'Erciyes Dağspor',b:3},{n:'Amasya Elmaspor',b:4},{n:'Değirmenspor',b:5},{n:'Ballıca Arıspor',b:6},{n:'Ayvalık Zeytinspor',b:7}];
const OURS=['Kaleci Necmi','Kayserili Mehmet','Fırıncı Rıza','Hüsnü','Temel']; // 0 kaleci, 1-2 defans, 3 orta saha, 4 forvet
const lteam=i=>i===0?((S.townName||'Köyümüz')+'spor'):LT[i].n;
const lbadge=i=>IMG_SRC['lg_badge'+LT[i].b];
const LIG_WAIT=2*3600*1000,LIG_SKIP=2;
const lg$=id=>document.getElementById(id);
function ligFixtures(){const t=[0,1,2,3,4,5,6,7],R=[];for(let r=0;r<7;r++){const m=[];for(let i=0;i<4;i++)m.push(r%2?[t[7-i],t[i]]:[t[i],t[7-i]]);R.push(m);t.splice(1,0,t.pop());}
  return R.concat(R.map(m=>m.map(([h,a])=>[a,h])));} // çift devreli: ilk yarının rövanşları
const LIG_ROUNDS=14;
function ligNew(season){const r=m3rng((season||1)*977+7);return {season:season||1,round:0,next:0,trophies:S.lig?S.lig.trophies||0:0,
  str:LT.map((_,i)=>i===0?0:Math.round(38+r()*30+(season-1)*4)),fx:ligFixtures(),tab:LT.map(()=>({o:0,g:0,b:0,m:0,a:0,y:0}))};}
function ligInit(){if(!S.lig||!S.lig.fx||S.ligV!==2){S.lig=ligNew(1);S.lig.trophies=0;S.ligV=2;save();}
  if(S.lig.fx.length<LIG_ROUNDS){S.lig.fx=S.lig.fx.concat(S.lig.fx.map(m=>m.map(([h,a])=>[a,h])));save();} // eski tek devreli sezonu uzat
  S.lig.cups=S.lig.cups||0;}
const ourStr=()=>{const st=S.ents.find(e=>e.type==='stadium');return 42+(st?lv(st)*3:0)+Math.min(20,S.lvl*.5);};
const ligPts=t=>t.g*3+t.b;
function ligOrder(){return LT.map((_,i)=>i).sort((a,b)=>{const A=S.lig.tab[a],B=S.lig.tab[b];return ligPts(B)-ligPts(A)||(B.a-B.y)-(A.a-A.y)||B.a-A.a;});}
function ligRecord(h,a,gh,ga){const T=S.lig.tab;for(const[i,f,ag]of[[h,gh,ga],[a,ga,gh]]){const t=T[i];t.o++;t.a+=f;t.y+=ag;if(f>ag)t.g++;else if(f===ag)t.b++;else t.m++;}}
function ligSimGoals(sa,sb){let g=0;const p=.9+(sa-sb)/60;for(let i=0;i<5;i++)if(Math.random()<p*.3)g++;return g;}
function openLig(){ligInit();audioInit();for(const k of['k_ball','fp_g_d1','fp_g_d2','fp_g_d3','fp_g_d4','fp_b_d1','fp_b_d2','fp_b_d3','fp_b_d4','lg_pitch','fp_g_run1','fp_g_run2','fp_g_kick','fp_g_cel','fp_b_run1','fp_b_run2','fp_b_kick','fp_b_cel','fp_g_gk','fp_b_gk','lg_trophy'])loadImg(k);
  lg$('lig').classList.add('on');ligTable();}
function closeLig(){lg$('lig').classList.remove('on');LM_.run=false;ligCrowd(false);hud();}
function ligOpp(){const m=S.lig.fx[S.lig.round].find(p=>p.includes(0));return m[0]===0?m[1]:m[0];}
function ligTable(){LM_.run=false;lg$('ligMatch').style.display='none';lg$('ligHome').style.display='block';const L=S.lig;
  lg$('ligTitle').textContent=`🏆 Köyler Ligi · Sezon ${L.season}`;
  const ord=ligOrder();let h=`<table class="ltab"><tr><th></th><th>Takım</th><th>O</th><th>G</th><th>B</th><th>M</th><th>Av</th><th>P</th></tr>`;
  ord.forEach((i,k)=>{const t=L.tab[i];h+=`<tr class="${i===0?'me':''}"><td>${k+1}</td><td><img src="${lbadge(i)}" alt="">${lteam(i)}</td><td>${t.o}</td><td>${t.g}</td><td>${t.b}</td><td>${t.m}</td><td>${t.a-t.y>0?'+':''}${t.a-t.y}</td><td><b>${ligPts(t)}</b></td></tr>`;});
  h+='</table>';
  if(L.round>=LIG_ROUNDS){h+=cupHTML(ord);}
  else{const o=ligOpp(),wait=Math.max(0,L.next-now());
    const home=L.fx[L.round].find(p=>p.includes(0))[0]===0;
    h+=`<div class="lnext"><small>${L.round+1}. hafta / ${LIG_ROUNDS} · ${L.round<7?'İlk yarı':'İkinci yarı'} · ${home?'🏠 İç saha':'🚌 Deplasman'}</small><div class="vs"><span><img src="${lbadge(0)}" alt="">${lteam(0)}</span><b>vs</b><span><img src="${lbadge(o)}" alt="">${lteam(o)}</span></div>
      <p class="sub">Takım gücü: <b>${Math.round(ourStr())}</b> · Rakip: <b>${L.str[o]}</b>. Stadyumu yükselttikçe takımın güçlenir.</p>
      ${wait>0?`<p>Sonraki maç ${fmt(wait)} sonra</p>${adsAvailable()?'<button class="btn" id="ligAd">🎬 Reklam izle, şimdi oyna</button> ':''}<button class="btn alt" id="ligSkip">Şimdi oyna · ${LIG_SKIP} ${GEM}</button>`:'<button class="btn" id="ligPlay">⚽ Maça çık</button>'}</div>`;}
  h+=`<p class="sub">Lig şampiyonlukları: ${'🏆'.repeat(L.trophies)||'henüz yok'} · Türkiye Kupaları: ${'🥇'.repeat(L.cups||0)||'henüz yok'}<br>Lig şampiyonuna ${GEM} 10 + Usta Belgesi. Sezon sonunda ilk 4 takım Türkiye Kupası’nda yarışır.</p>`;
  lg$('ligHome').innerHTML=h;
  if(lg$('ligPlay'))lg$('ligPlay').onclick=()=>ligStart();cupBind();
  if(lg$('ligAd'))lg$('ligAd').onclick=()=>showRewardedAd(()=>{S.lig.next=0;save();ligStart();});
  if(lg$('ligSkip'))lg$('ligSkip').onclick=()=>{if(spendGems(LIG_SKIP)){S.lig.next=0;ligStart();}};
  if(lg$('ligNewS'))lg$('ligNewS').onclick=()=>{S.lig=ligNew(S.lig.season+1);save();ligTable();};}
/* ---------- maç ekranı ---------- */
const LM_={run:false};
// [x,y,rol] 0=kale üstü (rakip kalesi), 1=bizim kale
const FORM=[[.5,.95,'gk'],[.25,.78],[.75,.78],[.38,.6],[.62,.42]];
const PF={x0:112,x1:660,y0:272,y1:1126};
const fieldImg=(x,y)=>({x:PF.x0+(PF.x1-PF.x0)*x,y:PF.y0+(PF.y1-PF.y0)*y});
function ligStart(oppArg,ctx){const o=oppArg!==undefined?oppArg:ligOpp();Object.assign(LM_,{ctx:ctx||'lig',camX:384,run:true,opp:o,min:0,sc:[0,0],paused:false,ended:false,log:[],cel:0,lt:0,camY:fieldImg(.5,.5).y,spd:1,ht:false,simT:0,banner:null,conf:[],stats:{pos:[0,0],sh:[0,0],ps:[0,0],goals:[],cards:0},
  ball:{x:.5,y:.5,vx:0,vy:0,h:0,vh:0,mode:'hold',holder:null,lastSide:0},nextAct:0,subs:0,rsub:false});
  const types=['pen','fk','1v1','save','save','1v1','fk'].sort(()=>Math.random()-.5),n=4,mins=[...Array(n)].map((_,i)=>Math.round(12+i*20+Math.random()*12));
  LM_.moments=mins.map((m,i)=>({m,type:types[i],done:false}));if(!LM_.moments.some(m=>m.type==='save'))LM_.moments[1].type='save';
  LM_.pl=[];for(const side of[0,1])FORM.forEach((f,i)=>{const by=side?1-f[1]:f[1];LM_.pl.push({side,i,gk:!!f[2],bx:side?1-f[0]:f[0],by,x:f[0],y:by,flip:side===1,step:0,dist:0});});
  LM_.ball.holder=LM_.pl.find(p=>p.side===0&&p.i===4);for(const p of LM_.pl){p.sta=1;p.name=p.side===0?(OURS[p.i]||'Can'):(RIVALS[p.i]||'Ali');}
  lg$('ligHome').style.display='none';lg$('ligMatch').style.display='flex';ligResize();ligScore();ligSay(`Hakem düdüğü çaldı! ${lteam(0)} ile ${lteam(o)} karşı karşıya.`);
  ligWhistle(1);ligCrowd(true);lg$('ligSpd').textContent='⏩ 2x';LM_.used=[];ligSubBtn();lg$('ligSubP').classList.remove('on');LM_.lt=performance.now();requestAnimationFrame(ligDraw);}
const RIVALS=['Ahmet','Mustafa','Hasan','Murat','Kemal'];
const plName=p=>p?(p.name||(p.side===0?(OURS[p.i]||'Can'):RIVALS[p.i]||'Ali')):'';
function ligWhistle(n){if(!SND.ctx)return;const t=SND.ctx.currentTime;for(let i=0;i<n;i++){tone('sine',2700,2500,i===n-1&&n>1?.7:.28,.12,t+i*.38);tone('sine',3100,2900,i===n-1&&n>1?.7:.28,.05,t+i*.38);}}
// tribün uğultusu: atak kaleye yaklaştıkça yükselir
function ligCrowd(on){if(!SND.ctx)return;const c=SND.ctx;if(on&&!LM_.crowd){const b=c.createBuffer(1,c.sampleRate*2,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
    const s=c.createBufferSource();s.buffer=b;s.loop=true;const f=c.createBiquadFilter();f.type='bandpass';f.frequency.value=700;f.Q.value=.6;const g=c.createGain();g.gain.value=.02;s.connect(f);f.connect(g);g.connect(SND.fx);s.start();LM_.crowd={s,g};}
  if(!on&&LM_.crowd){try{LM_.crowd.s.stop();}catch(e){}LM_.crowd=null;}}
const BENCH=['Cemil','Bayram','Selim'];
function openSubs(){if(!LM_.run||LM_.ended||LM_.paused)return;LM_.paused=true;LM_.subSel=null;LM_.used=LM_.used||[];renderSubs();lg$('ligSubP').classList.add('on');}
function closeSubs(){lg$('ligSubP').classList.remove('on');LM_.paused=false;LM_.lt=performance.now();}
function renderSubs(){const ours=LM_.pl.filter(p=>p.side===0&&!p.gk),left=3-LM_.subs,bench=BENCH.filter(n=>!LM_.used.includes(n));
  const bar=v=>`<i class="sta"><b style="width:${Math.round(v*100)}%;background:${v>.6?'#5fc03a':v>.35?'#f2b632':'#e2483d'}"></b></i>`;
  lg$('ligSubTxt').innerHTML=`<h2>🔄 Oyuncu değişikliği</h2><p class="sub2">Kalan hak: <b>${left}</b> · Yorulan oyuncu yavaşlar, topu daha kolay kaptırır.</p>
   <p class="sub2">1) Çıkacak oyuncu</p><div class="subl">${ours.map((p,i)=>`<button class="subb ${LM_.subSel===i?'on':''}" data-p="${i}">${plName(p)}${bar(p.sta)}</button>`).join('')}</div>
   <p class="sub2">2) Girecek oyuncu (yedek)</p><div class="subl">${bench.map(n=>`<button class="subb" data-b="${n}" ${LM_.subSel===null||left<=0?'disabled':''}>${n}${bar(1)}</button>`).join('')||'<small>Yedek kalmadı</small>'}</div>`;
  lg$('ligSubTxt').querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{LM_.subSel=+b.dataset.p;renderSubs();});
  lg$('ligSubTxt').querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{const p=ours[LM_.subSel];if(!p||left<=0)return;const old=plName(p);p.name=b.dataset.b;p.sta=1;LM_.subs++;LM_.used.push(b.dataset.b);
    ligSay(`🔄 Değişiklik: ${old} çıktı, ${p.name} oyuna girdi.`);sfx.blip();closeSubs();ligSubBtn();});}
function ligSubBtn(){const b=lg$('ligSub');if(!b)return;b.textContent=`🔄 ${3-LM_.subs}`;b.disabled=LM_.subs>=3;b.classList.toggle('warn',LM_.pl.some(p=>p.side===0&&!p.gk&&p.sta<.4)&&LM_.subs<3);}
function ligBanner(txt,sub){LM_.banner={txt,sub,t0:performance.now()};}
function ligResize(){const cv=lg$('ligCv'),box=lg$('ligBox'),w=box.clientWidth,h=box.clientHeight,dpr=Math.min(2,devicePixelRatio||1);
  cv.style.width=w+'px';cv.style.height=h+'px';cv.width=w*dpr;cv.height=h*dpr;Object.assign(LM_,{W:w,H:h,dpr,s:w/470});if(LM_.camX===undefined)LM_.camX=384;}
addEventListener('resize',()=>{if(LM_.run)ligResize();});
function ligScore(){if(lg$('ligProg'))lg$('ligProg').style.width=(Math.min(90,LM_.min)/90*100)+'%';lg$('ligSB').innerHTML=`<span><img src="${lbadge(0)}" alt="">${LM_.sc[0]}</span><b>${Math.min(90,Math.floor(LM_.min))}'</b><span>${LM_.sc[1]}<img src="${lbadge(LM_.opp)}" alt=""></span>`;}
function ligSay(s){LM_.log.unshift(s);lg$('ligCom').innerHTML=LM_.log.slice(0,3).map((x,i)=>`<p style="opacity:${1-i*.3}">${x}</p>`).join('');}
const LM_scr=(x,y)=>{const q=fieldImg(x,y);return {x:(q.x-LM_.camX)*LM_.s+LM_.W/2,y:(q.y-LM_.camY)*LM_.s+LM_.H/2};};
const oppStr=()=>S.lig.str[LM_.opp];
function ligDraw(t){if(!LM_.run)return;const cv=lg$('ligCv'),c=cv.getContext('2d');c.setTransform(LM_.dpr,0,0,LM_.dpr,0,0);
  const dt=Math.min(50,t-(LM_.lt||t));LM_.lt=t;
  try{
  if(!LM_.paused&&!LM_.ended){const sdt=dt*LM_.spd;LM_.simT+=sdt;LM_.min=Math.min(90,LM_.min+sdt/1000*2.2);ligScore();ligStep(sdt,LM_.simT);
    if(!LM_.ht&&LM_.min>=45){LM_.ht=true;LM_.paused=true;ligWhistle(2);ligSay(`Devre arası. Skor ${LM_.sc[0]}-${LM_.sc[1]}.`);ligBanner('DEVRE ARASI',`${LM_.sc[0]} - ${LM_.sc[1]}`);
      setTimeout(()=>{if(!LM_.run)return;for(const p of LM_.pl){p.x=p.bx;p.y=p.by;}Object.assign(LM_.ball,{x:.5,y:.5,vx:0,vy:0,h:0,vh:0,shotGoal:false,mode:'hold',holder:LM_.pl.find(p=>p.side===1&&p.i===4)});LM_.paused=false;LM_.lt=performance.now();ligWhistle(1);ligSay('İkinci yarı başladı!');},2200);}
    if(LM_.crowd){const b=LM_.ball,close=1-Math.min(1,Math.min(b.y,1-b.y)*3.2);LM_.crowd.g.gain.setTargetAtTime(.012+.05*close,SND.ctx.currentTime,.3);}
    if(!LM_.rsub&&LM_.min>62+Math.random()*8){LM_.rsub=true;const p=LM_.pl.filter(q=>q.side===1&&!q.gk).sort((a,b2)=>a.sta-b2.sta)[0];const old=plName(p);p.name=['Yusuf','Emin','Tarık'][Math.floor(Math.random()*3)];p.sta=1;ligSay(`🔄 ${lteam(LM_.opp)} değişiklik yaptı: ${old} çıktı, ${p.name} girdi.`);}
    if(!LM_.tiredWarn&&LM_.subs<3){const tp=LM_.pl.find(q=>q.side===0&&!q.gk&&q.sta<.38);if(tp){LM_.tiredWarn=true;ligSay(`⚠️ ${plName(tp)} yoruldu. 🔄 ile değişiklik yapabilirsin.`);}}
    if(Math.floor(LM_.simT/1000)!==LM_.lastSubUi){LM_.lastSubUi=Math.floor(LM_.simT/1000);ligSubBtn();}
    if(Math.random()<dt/1000*.012){const p=LM_.pl.filter(q=>!q.gk)[Math.floor(Math.random()*8)];LM_.stats.cards++;ligSay(`🟨 Sarı kart: ${plName(p)} (${p.side===0?lteam(0):lteam(LM_.opp)})`);}
    const mo=LM_.moments.find(m=>!m.done&&LM_.min>=m.m);if(mo)ligMoment(mo);
    if(LM_.min>=90){LM_.ended=true;ligSay('Hakem son düdüğü çaldı! Maç bitti.');ligWhistle(3);ligBanner('MAÇ SONU',`${LM_.sc[0]} - ${LM_.sc[1]}`);setTimeout(ligEnd,1800);}}
  // kamera topu takip eder (gökyüzü ve tribün dışarıda kalır)
  const b=LM_.ball,bq0=fieldImg(b.x,b.y),half=LM_.H/2/LM_.s,halfW=LM_.W/2/LM_.s;LM_.camY+=(bq0.y-LM_.camY)*Math.min(1,dt/400);LM_.camX+=(bq0.x-LM_.camX)*Math.min(1,dt/500);
  LM_.camY=Math.max(PF.y0-90+half,Math.min(PF.y1+90-half,LM_.camY));LM_.camX=Math.max(PF.x0-40+halfW,Math.min(PF.x1+40-halfW,LM_.camX));if(PF.x1-PF.x0+80<2*halfW)LM_.camX=384;
  if(IM.lg_pitch){c.drawImage(IM.lg_pitch,(0-LM_.camX)*LM_.s+LM_.W/2,(0-LM_.camY)*LM_.s+LM_.H/2,768*LM_.s,1376*LM_.s);}else{c.fillStyle='#3c9a33';c.fillRect(0,0,LM_.W,LM_.H);}
  const ph=s=>Math.floor(s)%2;
  for(const p of [...LM_.pl].sort((a,b2)=>a.y-b2.y)){const q=LM_scr(p.x,p.y),team=p.side?'b':'g',running=p.spd>.0006;
    const cel=LM_.cel&&t-LM_.cel<1800&&LM_.celSide===p.side;
    let k=p.gk?`fp_${team}_gk`:cel?`fp_${team}_cel`:(p.kick&&t-p.kick<200?`fp_${team}_kick`:(IM[`fp_${team}_d1`]?`fp_${team}_d${running?1+Math.floor(p.step*1.4)%4:1}`:`fp_${team}_run${running&&ph(p.step)?2:1}`));
    const im=IM[k];if(!im)continue;const h=(p.gk?62:66)*LM_.s,w=im.width*h/im.height,bob=running&&!p.gk?Math.abs(Math.sin(p.step*Math.PI))*3*LM_.s:0,jump=cel?Math.abs(Math.sin(t/160))*8*LM_.s:0;
    c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(q.x,q.y,w*.3,h*.07,0,0,7);c.fill();
    c.save();c.translate(q.x,q.y-bob-jump);if(p.flip&&!p.gk)c.scale(-1,1);c.drawImage(im,-w/2,-h,w,h);c.restore();}
  const bq=LM_scr(b.x,b.y),br=8*LM_.s,lift=(b.h||0)*1400*LM_.s;
  c.fillStyle='rgba(0,0,0,.28)';c.beginPath();c.ellipse(bq.x,bq.y,br*.9,br*.35,0,0,7);c.fill();
  const bsp=Math.hypot(b.vx||0,b.vy||0);if(bsp>.0007){for(let i=1;i<=3;i++){const q2=LM_scr(b.x-b.vx*i*22,b.y-b.vy*i*22);c.fillStyle=`rgba(255,255,255,${.18-i*.05})`;c.beginPath();c.arc(q2.x,q2.y-br-lift,br*(1-i*.15),0,7);c.fill();}}
  c.save();c.translate(bq.x,bq.y-br-lift);c.rotate(b.rot||0);if(IM.k_ball)c.drawImage(IM.k_ball,-br,-br,br*2,br*2);else{c.fillStyle='#fff';c.beginPath();c.arc(0,0,br,0,7);c.fill();c.fillStyle='#222';c.beginPath();c.arc(0,0,br*.35,0,7);c.fill();}c.restore();
  // topu süren oyuncunun adı
  if(b.holder&&b.mode==='hold'&&!b.holder.gk){const q=LM_scr(b.holder.x,b.holder.y),nm=plName(b.holder);c.font=`700 ${Math.round(11*LM_.s)}px Fredoka,sans-serif`;const tw=c.measureText(nm).width+12*LM_.s;
    c.fillStyle=b.holder.side===0?'rgba(30,120,50,.88)':'rgba(30,60,160,.88)';const y=q.y-74*LM_.s;c.beginPath();c.roundRect?c.roundRect(q.x-tw/2,y-9*LM_.s,tw,18*LM_.s,9*LM_.s):c.rect(q.x-tw/2,y-9*LM_.s,tw,18*LM_.s);c.fill();
    c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';c.fillText(nm,q.x,y+1);}
  // konfeti
  for(const p of LM_.conf){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.0006*dt;p.r+=.01*dt;c.save();c.translate(p.x,p.y);c.rotate(p.r);c.fillStyle=p.c;c.fillRect(-4,-2,8,4);c.restore();}
  LM_.conf=LM_.conf.filter(p=>p.y<LM_.H+20);
  // büyük yazı (GOL / DEVRE ARASI / MAÇ SONU)
  const bn=LM_.banner;if(bn){const d=(t-bn.t0)/2000;if(d<1){const s=d<.12?d/.12*1.15:1.15-Math.min(.15,(d-.12)*.5);c.save();c.globalAlpha=d>.8?(1-d)/.2:1;
      c.fillStyle='rgba(0,0,0,.35)';c.fillRect(0,LM_.H*.38,LM_.W,LM_.H*.2);c.translate(LM_.W/2,LM_.H*.46);c.scale(s,s);c.textAlign='center';c.textBaseline='middle';
      let fs=Math.round(LM_.W*.14);c.font=`800 ${fs}px Fredoka,sans-serif`;const mw=c.measureText(bn.txt).width;if(mw>LM_.W*.88){fs=Math.floor(fs*LM_.W*.88/mw);c.font=`800 ${fs}px Fredoka,sans-serif`;}c.lineWidth=10;c.strokeStyle='#14451d';c.strokeText(bn.txt,0,0);c.fillStyle='#ffd23a';c.fillText(bn.txt,0,0);
      if(bn.sub){c.font=`700 ${Math.round(LM_.W*.055)}px Fredoka,sans-serif`;c.lineWidth=6;c.strokeText(bn.sub,0,LM_.W*.11);c.fillStyle='#fff';c.fillText(bn.sub,0,LM_.W*.11);}c.restore();}else LM_.banner=null;}
  }catch(e){console.warn('maç',e);}
  requestAnimationFrame(ligDraw);}
// ---- oyuncu hareketi: hız + yorgunluk ----
function movePl(p,tx,ty,sp,dt){sp*=.72+.28*(p.sta??1);const dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy),m=Math.min(d,sp*dt);if(d>1e-4){p.x+=dx/d*m;p.y+=dy/d*m;if(Math.abs(dx)>.002)p.flip=dx<0;}
  p.spd=m/dt;p.step+=m*55;if(!p.gk)p.sta=Math.max(.15,(p.sta??1)-dt*(m>0?.0000105:.000003));}
function nearest(arr,p){let b=null,bd=9;for(const q of arr){const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;b=q;}}return b;}
// ---- top fiziği: hız, sürtünme, yükseklik; top sürme = topa küçük dokunuşlar ----
const FRIC=.0021,CTRL=.024;
function kickBall(p,vx,vy,lift){const B=LM_.ball;B.vx=vx;B.vy=vy;B.vh=lift||0;B.holder=null;B.mode='free';B.last=p;B.lastSide=p.side;p.kick=performance.now();B.noCtrl=performance.now()+180;}
function ligStep(dt,t){const B=LM_.ball,pl=LM_.pl,goalY=s=>s===0?.0:1;
  const att=B.holder?B.holder.side:B.lastSide;if(att===0||att===1)LM_.stats.pos[att]+=dt;
  // top hareketi
  const f=Math.exp(-FRIC*dt*(B.h>0?.25:1));B.x+=B.vx*dt;B.y+=B.vy*dt;B.vx*=f;B.vy*=f;
  if(B.h>0||B.vh){B.vh-=.0000032*dt;B.h=Math.max(0,(B.h||0)+B.vh*dt);if(B.h===0)B.vh=0;}
  B.rot=(B.rot||0)+Math.hypot(B.vx,B.vy)*dt*60;
  if(B.x<.02||B.x>.98){B.x=Math.max(.02,Math.min(.98,B.x));B.vx*=-.4;}
  // kale çizgisi
  for(const s of[0,1]){const gy=goalY(s);if((s===0&&B.y<.015)||(s===1&&B.y>.985)){const inGoal=Math.abs(B.x-.5)<.085&&B.h<.05;
    if(inGoal&&B.shotGoal&&B.lastSide===s){B.shotGoal=false;ligGoal(s,`${plName(B.last)} ağları sarstı!`,plName(B.last));return;}
    const gk=pl.find(p=>p.gk&&p.side!==s);B.x=.5;B.y=s===0?.06:.94;B.vx=B.vy=0;B.h=0;B.holder=gk;B.mode='hold';B.shotGoal=false;if(Math.random()<.5)ligSay('Top auta çıktı, kaleci oyunu başlatıyor.');}}
  // kontrol: yavaşlayan topa en yakın oyuncu sahip olur
  const spd=Math.hypot(B.vx,B.vy);
  if(!B.holder&&performance.now()>(B.noCtrl||0)&&B.h<.02){const n=nearest(pl,B);const d=n?Math.hypot(n.x-B.x,n.y-B.y):1;
    if(n&&d<CTRL&&(spd<.0009||n.gk||n.side!==B.lastSide)){const intercept=n.side!==B.lastSide;B.holder=n;B.mode='hold';B.vx*=.2;B.vy*=.2;B.shotGoal=false;
      if(intercept&&B.last&&Math.random()<.6)ligSay(n.gk?`${plName(n)} topu kucakladı.`:`${plName(n)} araya girdi, top bizde${n.side===0?'!':' değil.'}`.replace(' top bizde değil.',' topu kaptı.'));}}
  const H=B.holder;
  // oyuncular
  for(const p of pl){let tx=p.bx,ty=p.by,sp=.00011;const own=(H&&H.side===p.side)||(!H&&B.lastSide===p.side);
    if(p.gk){tx=.5+(B.x-.5)*.4;ty=p.by;sp=.00009;if(!H&&B.lastSide!==p.side&&spd>.0006){tx=B.x+B.vx*120;sp=B.shotGoal?.00005:.00028;}}
    else if(p===H){const dir=p.side===0?-1:1;tx=p.x+(.5-p.x)*.2+Math.sin(t/600+p.i*2)*.05;ty=p.y+dir*.08;sp=.000095;}
    else if(!H&&p===nearest(pl.filter(q=>!q.gk&&q.side===p.side),{x:B.x+B.vx*250,y:B.y+B.vy*250})){tx=B.x+B.vx*250;ty=B.y+B.vy*250;sp=.00013;}
    else{const shift=own?(p.side===0?-.16:.16):(p.side===0?.06:-.06);tx=p.bx+(B.x-.5)*.4;ty=p.by+shift+(B.y-.5)*.3;}
    if(H&&!p.gk&&p.side!==H.side&&p===nearest(pl.filter(q=>q.side===p.side&&!q.gk),H)){tx=H.x;ty=H.y+(p.side===0?.025:-.025);sp=.000105;}
    movePl(p,Math.max(.03,Math.min(.97,tx)),Math.max(.03,Math.min(.97,ty)),sp,dt);}
  if(!H)return;
  // top sürme: top ayaktan uzaklaşınca küçük bir dokunuşla öne it
  const dir=H.side===0?-1:1,fx=H.x+(H.flip?-.008:.008),fy=H.y+dir*.006,bd=Math.hypot(B.x-fx,B.y-fy);
  if(H.gk){B.x=H.x;B.y=H.y+dir*.01;}
  else if(bd<.014&&spd<.00006){const ang=Math.atan2(dir*1,(.5-H.x)*.6+Math.sin(t/600+H.i*2)*.4);const v=(.032+.012*Math.random())*FRIC;B.vx=Math.cos(ang)*v*.6;B.vy=Math.sin(ang)*v;H.kick=performance.now();}
  else if(bd>.07){B.holder=null;B.mode='free';B.lastSide=H.side;B.last=H;}
  // karar: pas, şut, çalım kaybı
  if(t>LM_.nextAct){LM_.nextAct=t+600+Math.random()*900;const ad=(H.side===0?ourStr()-oppStr():oppStr()-ourStr())/250;
    const near=nearest(pl.filter(q=>q.side!==H.side&&!q.gk),H),dd=near?Math.hypot(near.x-H.x,near.y-H.y):1;
    if(H.gk){const m=pl.filter(q=>q.side===H.side&&!q.gk);ligPass(H,m[Math.floor(Math.random()*m.length)]);return;}
    if(dd<.032&&Math.random()<.42-ad){kickBall(near,(Math.random()-.5)*.0004,(near.side===0?-1:1)*.0003);near.kick=performance.now();if(Math.random()<.5)ligSay(`${plName(near)} topu ayağından aldı!`);return;}
    const toGoal=H.side===0?H.y:1-H.y;
    if(toGoal<.24){const goal=Math.random()<.07+ad;const tx=.5+(goal?(Math.random()<.5?-1:1)*.06:(Math.random()-.5)*.1),ty=goalY(H.side);
      const dx=tx-B.x,dy=ty-B.y,d=Math.hypot(dx,dy),v=.0019;kickBall(H,dx/d*v,dy/d*v,goal?.0004:.0002);B.shotGoal=goal;LM_.stats.sh[H.side]++;ligSay(`${plName(H)} şut çekti!`);return;}
    if(dd<.08||Math.random()<.4){const mates=pl.filter(q=>q.side===H.side&&!q.gk&&q!==H).sort((a,b2)=>(H.side===0?a.y-b2.y:b2.y-a.y));ligPass(H,mates[Math.floor(Math.random()*Math.min(3,mates.length))]);}}}
function ligPass(from,to){const B=LM_.ball;if(!to)return;LM_.stats.ps[from.side]++;
  if(Math.random()<.18)ligSay([`${plName(from)} pası ${plName(to)}'ya bıraktı.`,`${plName(from)} kanada açtı.`,`Güzel bir pas: ${plName(from)} → ${plName(to)}`,`${plName(from)} oyunu geriden kuruyor.`][Math.floor(Math.random()*4)]);
  const lead=to.side===0?-.04:.04,tx=to.x,ty=to.y+lead,dx=tx-B.x,dy=ty-B.y,d=Math.hypot(dx,dy);
  // sürtünmeyle tam hedefe varacak hız: d = v/FRIC
  const v=Math.min(.0024,d*FRIC*1.08+.00012),air=d>.32;kickBall(from,dx/d*v,dy/d*v,air?.00055:0);}
function ligGoal(side,msg,who){LM_.sc[side]++;LM_.cel=performance.now();LM_.celSide=side;ligScore();ligSay('⚽ '+msg);
  const sc=LM_.pl.filter(p=>p.side===side&&!p.gk)[Math.floor(Math.random()*4)],nm=who||plName(sc);
  LM_.stats.goals.push({side,min:Math.max(1,Math.floor(LM_.min)),nm});ligBanner(side===0?'GOOOL!':'Gol yedik…',`${nm} ${Math.max(1,Math.floor(LM_.min))}'`);
  if(side===0)for(let i=0;i<70;i++)LM_.conf.push({x:Math.random()*LM_.W,y:-20-Math.random()*LM_.H*.4,vx:(Math.random()-.5)*.08,vy:.05+Math.random()*.15,r:Math.random()*6,c:['#ffd23a','#5fc03a','#fff','#e2483d','#3da5f5'][i%5]});
  if(side===0){sfx.fanfare();if(SND.ctx)noise(.9,.15,null,500);}else if(SND.ctx)tone('triangle',300,150,.4,.12);
  setTimeout(()=>{if(!LM_.run)return;for(const p of LM_.pl){p.x=p.bx;p.y=p.by;}Object.assign(LM_.ball,{x:.5,y:.5,vx:0,vy:0,h:0,vh:0,shotGoal:false,mode:'hold',holder:LM_.pl.find(p=>p.side===1-side&&p.i===4)});},1600);}

const MOMENT_TXT={pen:['Ceza sahasında düşürüldü! Hakem penaltı noktasını gösterdi!','penaltı'],fk:['Ceza sahası önünde faul! Serbest vuruş bizim.','serbest vuruş'],
  '1v1':['Hüsnü derin pası attı, Temel kaleciyle karşı karşıya!','karşı karşıya'],save:['Rakip tehlikeli geliyor… şut çekecek! Kalede sen varsın!','kurtarış']};
function ligMoment(mo){mo.done=true;LM_.paused=true;ligSay('⚠️ '+MOMENT_TXT[mo.type][0]);
  setTimeout(()=>openShot(mo.type,ok=>{LM_.paused=false;LM_.lt=performance.now();
    if(mo.type==='save'){if(ok)ligSay('Müthiş kurtarış! Kalemiz gole kapalı!');else{const nm=RIVALS[3+Math.floor(Math.random()*2)];ligGoal(1,`${nm} şutunu çıkardı, ağlar havalandı.`,nm);}}
    else{const fw=LM_.pl.filter(p=>p.side===0&&!p.gk).sort((a,b)=>a.by-b.by);const nm=plName(mo.type==='fk'?(fw[1]||fw[0]):fw[0]);if(ok)ligGoal(0,`${nm} ${mo.type==='pen'?'penaltıyı':mo.type==='fk'?'serbest vuruşu':'pozisyonu'} gole çevirdi!`,nm);else ligSay('Olmadı… fırsat kaçtı.');}
    if(!LM_.run)return;}),1300);}
function ligEnd(){if(!LM_.run)return;LM_.run=false;if(LM_.ctx==='cup')return cupMatchEnd();const o=LM_.opp,[a,b]=LM_.sc,L=S.lig;ligRecord(0,o,a,b);
  for(const[h,w]of L.fx[L.round])if(h!==0&&w!==0){ligRecord(h,w,ligSimGoals(L.str[h],L.str[w]),ligSimGoals(L.str[w],L.str[h]));}
  L.round++;L.next=now()+LIG_WAIT;
  const res=a>b?'win':a===b?'draw':'loss',coins=res==='win'?60+S.lvl*8:res==='draw'?25+S.lvl*3:10;S.coins+=coins;gainXP(res==='win'?12:res==='draw'?6:3);
  let extra='';
  if(L.round>=LIG_ROUNDS){const pos=ligOrder().indexOf(0)+1;extra=pos<=4?'<p>🥇 Türkiye Kupası’na kaldık!</p>':'';if(pos===1){L.trophies++;S.gems=(S.gems||0)+10;addItem('usta',1);extra=`<p>🏆 <b>ŞAMPİYON OLDUK!</b> ${GEM} +10 · Usta Belgesi</p>`+extra;sfx.fanfare();}
    else extra=`<p>Sezonu ${pos}. sırada bitirdin.</p>`+extra;}
  changed();
  lg$('ligEndTxt').innerHTML=`<h2>${res==='win'?'Kazandık!':res==='draw'?'Berabere':'Kaybettik'}</h2><div class="vs"><span><img src="${lbadge(0)}" alt="">${a}</span><b>-</b><span>${b}<img src="${lbadge(o)}" alt=""></span></div><p>${COIN} +${coins}</p>${extra}`;
  ligStatsHTML();
  lg$('ligEnd').classList.add('on');}
function ligStatsHTML(){
  const st=LM_.stats,ps=st.pos[0]+st.pos[1]||1,poss=Math.round(st.pos[0]/ps*100);ligCrowd(false);
  const gl=st.goals.map(g=>`<span class="${g.side===0?'me':''}">⚽ ${g.nm} ${g.min}'</span>`).join('');
  lg$('ligEndTxt').insertAdjacentHTML('beforeend',`${gl?`<div class="lgoals">${gl}</div>`:''}<table class="lstat"><tr><td>%${poss}</td><th>Topla oynama</th><td>%${100-poss}</td></tr><tr><td>${st.sh[0]}</td><th>Şut</th><td>${st.sh[1]}</td></tr><tr><td>${st.ps[0]}</td><th>Pas</th><td>${st.ps[1]}</td></tr></table>`);
  lg$('ligEnd').classList.add('on');}
/* ---------- TÜRKİYE KUPASI (sezon sonu, ilk 4 takım) ---------- */
function cupInit(){const L=S.lig;if(L.cup)return;const o=ligOrder();L.cup={semis:[[o[0],o[3]],[o[1],o[2]]],sr:[null,null],final:null,fr:null,champ:null};save();}
function cupSim(h,a){const L=S.lig;let gh=ligSimGoals(L.str[h]||ourStr(),L.str[a]||ourStr()),ga=ligSimGoals(L.str[a]||ourStr(),L.str[h]||ourStr()),pen=null,w=gh>ga?h:a;
  if(gh===ga){let p1=3+Math.floor(Math.random()*3),p2=3+Math.floor(Math.random()*3);if(p1===p2)p1++;pen=`${p1}-${p2}`;w=p1>p2?h:a;}return {h,a,gh,ga,pen,w};}
function cupAdvance(){const C=S.lig.cup;
  C.semis.forEach((m,i)=>{if(!C.sr[i]&&!m.includes(0))C.sr[i]=cupSim(m[0],m[1]);});
  if(C.sr[0]&&C.sr[1]&&!C.final)C.final=[C.sr[0].w,C.sr[1].w];
  if(C.final&&!C.fr&&!C.final.includes(0))C.fr=cupSim(C.final[0],C.final[1]);
  if(C.fr&&C.champ===null){C.champ=C.fr.w;}
  save();}
const cupRes=r=>`<div class="cres">${r?`<b>${r.gh}-${r.ga}</b>${r.pen?`<small>pen. ${r.pen}</small>`:''}`:'<small>oynanmadı</small>'}</div>`;
const cupRow=(m,r,lbl)=>`<div class="cuprow"><em class="clbl">${lbl}</em><span class="${r&&r.w===m[0]?'w':''}"><img src="${lbadge(m[0])}" alt="">${lteam(m[0])}</span>${cupRes(r)}<span class="${r&&r.w===m[1]?'w':''}">${lteam(m[1])}<img src="${lbadge(m[1])}" alt=""></span></div>`;
function cupHTML(ord){cupInit();const L=S.lig,C=L.cup,pos=ord.indexOf(0)+1;cupAdvance();
  let h=`<div class="lnext cup"><h3>🥇 Türkiye Kupası</h3><p class="sub">Ligi ${pos}. bitirdin. ${pos<=4?'Kupadasın!':'İlk 4’e giremedin; kupayı izliyorsun.'} Berabere biten maçta seri penaltılara gidilir.</p>`;
  h+=cupRow(C.semis[0],C.sr[0],'Yarı final 1')+cupRow(C.semis[1],C.sr[1],'Yarı final 2');
  if(C.final)h+=cupRow(C.final,C.fr,'Final');
  const mySemi=C.semis.findIndex(m=>m.includes(0)),wait=Math.max(0,L.next-now());
  let opp=null,stage=null;
  if(mySemi>=0&&!C.sr[mySemi]){opp=C.semis[mySemi].find(x=>x!==0);stage='Yarı finale';}
  else if(C.final&&C.final.includes(0)&&!C.fr){opp=C.final.find(x=>x!==0);stage='Finale';}
  if(opp!==null)h+=wait>0?`<p>Sonraki maç ${fmt(wait)} sonra</p>${adsAvailable()?'<button class="btn" id="cupAd">🎬 Reklam izle, şimdi oyna</button> ':''}<button class="btn alt" id="cupSkip">Şimdi oyna · ${LIG_SKIP} ${GEM}</button>`:`<button class="btn" id="cupPlay" data-o="${opp}">⚽ ${stage} çık</button>`;
  if(C.champ!==null)h+=`<p class="champ">🏆 Kupa şampiyonu: <img src="${lbadge(C.champ)}" alt=""> <b>${lteam(C.champ)}</b></p><button class="btn" id="ligNewS">Yeni sezona başla</button>`;
  return h+'</div>';}
function cupBind(){const p=lg$('cupPlay');if(p)p.onclick=()=>ligStart(+p.dataset.o,'cup');
  const ca=lg$('cupAd');if(ca)ca.onclick=()=>showRewardedAd(()=>{S.lig.next=0;save();ligTable();});
  const s=lg$('cupSkip');if(s)s.onclick=()=>{if(spendGems(LIG_SKIP)){S.lig.next=0;ligTable();}};
  const n=lg$('ligNewS');if(n)n.onclick=()=>{const tr=S.lig.trophies,cu=S.lig.cups;S.lig=ligNew(S.lig.season+1);S.lig.trophies=tr;S.lig.cups=cu;save();ligTable();};}
function shotPromise(mode){return new Promise(res=>openShot(mode,ok=>res(ok)));}
async function cupShootout(){let us=0,them=0,i=0;ligSay('Seri penaltılar başlıyor!');ligBanner('SERİ PENALTILAR','');await m3sleep(1500);
  while(true){i++;const ok=await shotPromise('pen');if(ok)us++;const rv=Math.random()<.68;if(rv)them++;
    ligSay(`Penaltılar ${us}-${them} (${i}. atış: biz ${ok?'⚽':'❌'} · rakip ${rv?'⚽':'❌'})`);ligBanner(`${us} - ${them}`,'Seri penaltılar');await m3sleep(1300);
    if(i>=5&&us!==them)break;if(i<5&&(us>them+(5-i)||them>us+(5-i)))break;if(i>=10&&us!==them)break;if(i>=12){us++;break;}}
  return [us,them];}
async function cupMatchEnd(){const C=S.lig.cup,o=LM_.opp,[a,b]=LM_.sc;let pen=null,w=a>b?0:o;
  if(a===b){LM_.run=true;requestAnimationFrame(ligDraw);LM_.paused=true;const[p1,p2]=await cupShootout();LM_.run=false;pen=`${p1}-${p2}`;w=p1>p2?0:o;}
  const r={h:0,a:o,gh:a,ga:b,pen,w};const si=C.semis.findIndex(m=>m.includes(0)&&m.includes(o));
  if(si>=0&&!C.sr[si])C.sr[si]=r;else C.fr=r;
  S.lig.next=now()+LIG_WAIT;cupAdvance();
  let extra='';const fin=C.fr===r;
  if(w===0){const coins=fin?400+S.lvl*20:150+S.lvl*8;S.coins+=coins;extra=`<p>${COIN} +${coins}</p>`;
    if(fin){S.lig.cups=(S.lig.cups||0)+1;S.gems=(S.gems||0)+3;addItem('usta',2);extra+=`<p>🥇 <b>TÜRKİYE KUPASI BİZİM!</b> ${GEM} +3 · 2 Usta Belgesi</p>`;sfx.fanfare();}
    else extra+='<p>Finale çıktık!</p>';}
  else{if(fin){S.gems=(S.gems||0)+1;extra=`<p>Finalde kaybettik. Teselli: ${GEM} +1</p>`;}else extra='<p>Kupaya yarı finalde veda ettik.</p>';}
  gainXP(w===0?15:5);changed();
  lg$('ligEndTxt').innerHTML=`<h2>${w===0?(fin?'Kupa Bizim!':'Kazandık!'):'Elendik'}</h2><div class="vs"><span><img src="${lbadge(0)}" alt="">${a}</span><b>-</b><span>${b}<img src="${lbadge(o)}" alt=""></span></div>${pen?`<p>Seri penaltılar: <b>${pen}</b></p>`:''}${extra}`;
  ligStatsHTML();lg$('ligEnd').classList.add('on');}
/* ---------- kritik anlar (penaltı ekranını kullanır) ---------- */
function openShot(mode,cb){for(const k of['k_bg','k_ready','k_dive1','k_dive2','k_jump','k_hold','k_ball','k_wall','k_rush','k_shooter','k_striker'])loadImg(k);
  Object.assign(PEN,{mode,single:cb,big:false,saveShow:false,shot:mode==='fk'?1:2,res:[],phase:'aim',aim:0,pow:0,t0:performance.now(),ball:null,keeper:{x:0,dive:0,y:0},flash:0,banner:null,wallX:(Math.random()-.5)*.6,
    msg:{pen:'Penaltı! Nişan al ve vur',fk:'Serbest vuruş: barajın üstünden aşırt (biraz güçlü vur)', '1v1':'Kaleci üstüne geliyor: yeşil alanda dokun!',save:'Kalecisin! Top hangi yöne giderse o tarafa dokun'}[mode]});
  if(mode==='1v1')Object.assign(PEN,{phase:'run'});if(mode==='save')Object.assign(PEN,{phase:'wait',kickAt:performance.now()+700+Math.random()*900,zone:[-1,0,1][Math.floor(Math.random()*3)],tap:null});
  pen$('penTitle').textContent={pen:'⚽ Penaltı',fk:'🎯 Serbest vuruş','1v1':'🏃 Karşı karşıya',save:'🧤 Kurtarış'}[mode];
  pen$('pen').classList.add('on');pen$('penEnd').classList.remove('on');penResize();pen$('penDots').style.visibility='hidden';penHud();penBoostUI();
  pen$('penBig').parentNode.style.display=mode==='pen'||mode==='fk'?'flex':'none';
  if(!PEN.run){PEN.run=true;requestAnimationFrame(penDraw);}}
function shotDone(goal){const cb=PEN.single;setTimeout(()=>{PEN.run=false;PEN.single=null;PEN.mode='pen';pen$('pen').classList.remove('on');pen$('penDots').style.visibility='';pen$('penBig').parentNode.style.display='';if(cb)cb(goal);},1500);}
function draw1v1(t,c,W,H){const{s,ox,oy}=penFit();c.drawImage(IM.k_bg,ox,oy,PBG.w*s,PBG.h*s);const{gx,gy,gw,gh,sx,sy}=penGoal(true),ground=gy+gh;
  const T=1900,p=PEN.phase==='run'?Math.min(1,(t-PEN.t0)/T):PEN.p;if(PEN.phase==='run'&&p>=1){PEN.phase='done';PEN.p=1;penBanner('Kaleci kaptı!',false);PEN.res.push(false);shotDone(false);}
  const kim=IM.k_rush,ky=ground+(sy-60*s-ground)*p*.8,kh=gh*(1+p*1.6),kw=kim?kim.width*kh/kim.height:0;
  // striker (arkadan)
  const st=IM.k_striker,sh=H*.32,sw=st?st.width*sh/st.height:0;
  if(kim){c.save();c.drawImage(kim,W/2-kw/2,ky-kh,kw,kh);c.restore();}
  if(PEN.chip){const d=Math.min(1,(t-PEN.chip)/600),bx=W/2+(PEN.cx-W/2)*d,by=H*.86+(gy+gh*.35-H*.86)*d-Math.sin(d*Math.PI)*H*.25,br=W*.05*(1-.6*d);if(IM.k_ball)c.drawImage(IM.k_ball,bx-br,by-br,br*2,br*2);}
  if(st)c.drawImage(st,W/2-sw/2,H-sh-4,sw,sh);
  if(!PEN.chip&&IM.k_ball){const br=W*.055;c.drawImage(IM.k_ball,W/2-br,H-4-sh*.13-br,br*2,br*2);}
  // zamanlama çubuğu
  const bw=W*.7,bx0=(W-bw)/2,by0=H*.08;c.fillStyle='rgba(0,0,0,.45)';c.fillRect(bx0-4,by0-4,bw+8,26);c.fillStyle='#e2483d';c.fillRect(bx0,by0,bw,18);c.fillStyle='#5fc03a';c.fillRect(bx0+bw*.55,by0,bw*.23,18);
  c.fillStyle='#fff';c.fillRect(bx0+bw*p-3,by0-6,6,30);
  penOverlay(t,c,W,H,sx,sy);requestAnimationFrame(penDraw);}
function drawSave(t,c,W,H){const{s,ox,oy}=penFit();c.drawImage(IM.k_bg,ox,oy,PBG.w*s,PBG.h*s);const{gy,gh,sx,sy}=penGoal(true);
  const sh=IM.k_shooter,shh=gh*1.5,shw=sh?sh.width*shh/sh.height:0;const sy0=gy+gh*1.15-shh*.2,fx=W/2+shw*.18,fy=sy0+shh*.9;if(sh)c.drawImage(sh,W/2-shw/2,sy0,shw,shh);
  if(t<PEN.kickAt&&IM.k_ball){const br=W*.028;c.drawImage(IM.k_ball,fx-br,fy-br,br*2,br*2);}
  c.fillStyle='rgba(0,0,0,.18)';c.fillRect(0,H*.55,W/3,H*.45);c.fillRect(W*2/3,H*.55,W/3,H*.45);
  if(t>=PEN.kickAt){const d=Math.min(1,(t-PEN.kickAt)/620),x0=fx,y0=fy,tx=W/2+PEN.zone*W*.36,ty=H*.8,bx=x0+(tx-x0)*d,by=y0+(ty-y0)*d-Math.sin(d*Math.PI)*H*.06,br=W*(.028+.085*d);
    if(PEN.phase==='wait'){PEN.phase='fly';if(SND.ctx)tone('sine',140,60,.15,.4);}
    if(!PEN.saveShow&&IM.k_ball)c.drawImage(IM.k_ball,bx-br,by-br,br*2,br*2);
    if(d>=1&&PEN.phase==='fly'){PEN.phase='done';const ok=PEN.tap===PEN.zone;PEN.res.push(ok);PEN.saveShow=ok;penBanner(ok?'Kurtardın!':'Gol oldu…',ok);if(ok)sfx.fanfare();shotDone(ok);}}
  if(PEN.tap!==null){const gx2=W/2+PEN.tap*W*.33,gy2=H*.8;c.fillStyle='rgba(255,220,60,.85)';c.beginPath();c.arc(gx2-26,gy2,24,0,7);c.arc(gx2+26,gy2,24,0,7);c.fill();c.strokeStyle='#8a5a00';c.lineWidth=3;c.stroke();}
  penOverlay(t,c,W,H,sx,sy);requestAnimationFrame(penDraw);}
function penBanner(txt,good){PEN.banner={txt,good,t0:performance.now()};}

function ligBind(){lg$('ligClose').onclick=closeLig;lg$('ligSub').onclick=openSubs;lg$('ligSubBack').onclick=closeSubs;lg$('ligSpd').onclick=()=>{LM_.spd=LM_.spd===1?2:1;lg$('ligSpd').textContent=LM_.spd===1?'⏩ 2x':'▶️ 1x';};lg$('ligBack2').onclick=()=>{lg$('ligEnd').classList.remove('on');ligTable();};}

