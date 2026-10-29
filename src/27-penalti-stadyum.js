/* ================= PENALTI (Stadyum) ================= */
const PEN={run:false};
const pen$=id=>document.getElementById(id);
function openPenalty(){if(pen$('penTitle'))pen$('penTitle').textContent='⚽ Penaltı';for(const k of['k_bg','k_ready','k_dive1','k_dive2','k_jump','k_hold','k_ball'])loadImg(k);const today=dayKey(now());S.pen=S.pen&&S.pen.day===today?S.pen:{day:today,plays:0};audioInit();
  const free=S.pen.plays<3;
  if(!free&&!S.pen.adOk){if(true){openSheet('Penaltı',()=>{$('sBody').innerHTML=`<p class="sub">Bugünkü 3 bedava maçın bitti.</p><div style="display:flex;gap:8px;justify-content:center"><button class="btn" id="penAd">🎬 Reklam izle, oyna</button><button class="btn alt" id="penGem">1 ${GEM} ile oyna</button></div>`;
      $('penAd').onclick=()=>showRewardedAd(()=>{S.pen.adOk=true;closeSheet();openPenalty();});$('penGem').onclick=()=>{if(spendGems(1)){S.pen.adOk=true;closeSheet();openPenalty();}};});return;}
    if(!spendGems(1))return;}
  if(S.pen.adOk)S.pen.adOk=false;S.pen.plays++;save();
  Object.assign(PEN,{big:false,saveShow:false,shot:0,res:[],phase:'aim',aim:0,pow:0,t0:performance.now(),ball:null,keeper:{x:0,dive:0,dir:0,y:0},msg:'Nişan al: ok ortadayken dokun',flash:0});
  pen$('pen').classList.add('on');penResize();pen$('penEnd').classList.remove('on');penHud();penBoostUI();
  if(!PEN.run){PEN.run=true;requestAnimationFrame(penDraw);}
  if(SND.ctx)tone('sine',2600,2400,.5,.12);}
function closePenalty(){if(PEN.single){const cb=PEN.single;PEN.single=null;PEN.run=false;pen$('pen').classList.remove('on');pen$('penDots').style.visibility='';pen$('penBig').parentNode.style.display='';PEN.mode='pen';cb(false);return;}pen$('pen').classList.remove('on');PEN.run=false;}
function penResize(){const cv=pen$('penCv'),w=Math.min(innerWidth,560),h=Math.min(innerHeight-120,760),dpr=Math.min(2,devicePixelRatio||1);
  cv.style.width=w+'px';cv.style.height=h+'px';cv.width=w*dpr;cv.height=h*dpr;Object.assign(PEN,{W:w,H:h,dpr});}
addEventListener('resize',()=>{if(PEN.run)penResize();});
function penHud(){pen$('penDots').innerHTML=[0,1,2,3,4].map(i=>`<i class="${PEN.res[i]===true?'g':PEN.res[i]===false?'m':''}"></i>`).join('');pen$('penMsg').textContent=PEN.msg;}
// kale geometrisi (ekran koordinatı)
const PBG={w:768,h:1376,gx:130,gy:518,gw:510,gh:227,sx:384,sy:1190};
function penFit(){const s=Math.max(PEN.W/PBG.w,PEN.H/PBG.h),ox=(PEN.W-PBG.w*s)/2,oy=(PEN.H-PBG.h*s)*.35;return {s,ox,oy};}
const PEN_BIG={x:1.35,y:1.25,cost:2};
const penGoal=(base)=>{const g=penGoal0();if(base||!PEN.big)return g;const ground=g.gy+g.gh,cx=g.gx+g.gw/2,gw=g.gw*PEN_BIG.x,gh=g.gh*PEN_BIG.y;return {...g,gx:cx-gw/2,gy:ground-gh,gw,gh};};
const penGoal0=()=>{if(!IM.k_bg){const W=PEN.W,H=PEN.H,gw=W*.78,gh=gw*.36;return {gx:(W-gw)/2,gy:H*.2,gw,gh,sx:W/2,sy:H*.82};}
  const{s,ox,oy}=penFit();return {gx:ox+PBG.gx*s,gy:oy+PBG.gy*s,gw:PBG.gw*s,gh:PBG.gh*s,sx:ox+PBG.sx*s,sy:oy+PBG.sy*s};};
function penDraw(t){if(!PEN.run)return;const cv=pen$('penCv'),c=cv.getContext('2d'),W=PEN.W,H=PEN.H;c.setTransform(PEN.dpr,0,0,PEN.dpr,0,0);
  if(PEN.mode==='1v1'&&IM.k_bg)return draw1v1(t,c,W,H);if(PEN.mode==='save'&&IM.k_bg)return drawSave(t,c,W,H);
  if(IM.k_bg&&IM.k_ready)return penDraw2(t,c,W,H);
  // tribün
  const sky=c.createLinearGradient(0,0,0,H*.22);sky.addColorStop(0,'#1d2b52');sky.addColorStop(1,'#33467a');c.fillStyle=sky;c.fillRect(0,0,W,H*.22);
  for(let r=0;r<6;r++)for(let i=0;i<46;i++){const x=(i+(r%2)*.5)*W/45,y=H*.03+r*H*.028;c.fillStyle=['#e2483d','#ffd23a','#fff','#3da5f5','#5fc03a'][(i*7+r*3)%5];c.globalAlpha=.75;c.beginPath();c.arc(x,y+Math.sin(t/180+i+r)*(PEN.flash&&t-PEN.flash<1500?3:.6),W*.008,0,7);c.fill();}
  c.globalAlpha=1;
  // saha
  const gr=c.createLinearGradient(0,H*.2,0,H);gr.addColorStop(0,'#3f9a34');gr.addColorStop(1,'#2f7d27');c.fillStyle=gr;c.fillRect(0,H*.2,W,H*.8);
  for(let i=0;i<8;i++){if(i%2)continue;const y0=H*.2+i*H*.1,y1=y0+H*.1;c.fillStyle='rgba(255,255,255,.06)';c.fillRect(0,y0,W,H*.1);}
  const{gx,gy,gw,gh}=penGoal();
  c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=3;c.beginPath();c.moveTo(W*.04,gy+gh);c.lineTo(W*.96,gy+gh);c.stroke();
  c.beginPath();c.moveTo(gx-W*.12,gy+gh);c.lineTo(gx-W*.2,gy+gh+H*.3);c.lineTo(gx+gw+W*.2,gy+gh+H*.3);c.lineTo(gx+gw+W*.12,gy+gh);c.stroke();
  const spot={x:W/2,y:H*.82};c.fillStyle='#fff';c.beginPath();c.ellipse(spot.x,spot.y+6,6,3,0,0,7);c.fill();
  // file
  c.save();c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;const shake=PEN.netHit&&t-PEN.netHit<500?Math.sin((t-PEN.netHit)/30)*4*(1-(t-PEN.netHit)/500):0;
  for(let i=0;i<=20;i++){const x=gx+i*gw/20;c.beginPath();c.moveTo(x,gy);c.lineTo(x+shake,gy+gh);c.stroke();}
  for(let j=0;j<=8;j++){const y=gy+j*gh/8;c.beginPath();c.moveTo(gx,y);c.quadraticCurveTo(gx+gw/2,y+shake*2,gx+gw,y);c.stroke();}c.restore();
  c.fillStyle='#fff';c.fillRect(gx-5,gy-5,gw+10,6);c.fillRect(gx-5,gy-5,6,gh+5);c.fillRect(gx+gw-1,gy-5,6,gh+5);
  // kaleci
  const k=PEN.keeper,sp=.0006+PEN.shot*.00015;if(PEN.phase==='aim'||PEN.phase==='power')k.x=Math.sin(t*sp*3)*.35;
  if(PEN.phase==='fly'){const d=Math.min(1,(t-PEN.ball.t0)/380);k.x+=(k.dive-k.x)*.18;k.y=k.jump*Math.sin(d*Math.PI*.8);}
  penKeeper(c,gx+gw/2+k.x*gw/2,gy+gh,gh,k);
  // top
  let bx=spot.x,by=spot.y,br=W*.032;
  if(PEN.ball){const b=PEN.ball,d=Math.min(1,(t-b.t0)/b.dur),e=1-Math.pow(1-d,2);bx=spot.x+(b.tx-spot.x)*e;by=spot.y+(b.ty-spot.y)*e-Math.sin(d*Math.PI)*H*.05*b.loft;br=W*.032*(1-.55*e);
    if(d>=1&&!b.done){b.done=true;penResult();}}
  c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(bx,PEN.ball?by+br*1.2:spot.y+4,br,br*.35,0,0,7);c.fill();
  penBall(c,bx,by,br,t);
  // nişan oku
  if(PEN.phase==='aim'){PEN.aim=Math.sin((t-PEN.t0)*(.0026+PEN.shot*.0005));const ang=PEN.aim*.62;c.save();c.translate(spot.x,spot.y);c.rotate(ang);
    const g=c.createLinearGradient(0,0,0,-H*.3);g.addColorStop(0,'rgba(255,210,58,.95)');g.addColorStop(1,'rgba(255,90,40,.9)');c.fillStyle=g;c.beginPath();c.moveTo(-7,-20);c.lineTo(7,-20);c.lineTo(7,-H*.26);c.lineTo(18,-H*.26);c.lineTo(0,-H*.31);c.lineTo(-18,-H*.26);c.lineTo(-7,-H*.26);c.closePath();c.fill();
    c.strokeStyle='#5a2a00';c.lineWidth=2;c.stroke();c.restore();}
  // güç çubuğu
  if(PEN.phase==='power'){const ph=(t-PEN.t0)*(.0028+PEN.shot*.0004);PEN.pow=(1-Math.cos(ph))/2;const bxp=W*.88,byp=H*.45,bh=H*.32,bw=22;
    const g=c.createLinearGradient(0,byp+bh,0,byp);g.addColorStop(0,'#5fc03a');g.addColorStop(.65,'#ffd23a');g.addColorStop(.85,'#ff8a2c');g.addColorStop(1,'#e2483d');
    c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.roundRect?c.roundRect(bxp-4,byp-4,bw+8,bh+8,10):c.rect(bxp-4,byp-4,bw+8,bh+8);c.fill();c.fillStyle=g;c.fillRect(bxp,byp,bw,bh);
    c.fillStyle='#fff';const yy=byp+bh*(1-PEN.pow);c.beginPath();c.moveTo(bxp-10,yy);c.lineTo(bxp-2,yy-7);c.lineTo(bxp-2,yy+7);c.closePath();c.fill();c.fillRect(bxp,yy-2,bw,4);
    c.save();c.translate(spot.x,spot.y);c.rotate(PEN.aim*.62);c.strokeStyle='rgba(255,210,58,.6)';c.setLineDash([8,8]);c.lineWidth=3;c.beginPath();c.moveTo(0,-20);c.lineTo(0,-H*.3);c.stroke();c.restore();}
  if(PEN.banner&&t-PEN.banner.t0<1200){const d=(t-PEN.banner.t0)/1200,s=d<.15?d/.15*1.15:1.15-(d-.15)*.15;c.save();c.globalAlpha=d>.75?(1-d)/.25:1;c.translate(W/2,H*.5);c.scale(s,s);
    c.font=`800 ${Math.round(W*.13)}px Fredoka,"Trebuchet MS",sans-serif`;c.textAlign='center';c.textBaseline='middle';c.lineWidth=10;c.strokeStyle=PEN.banner.good?'#1d5e12':'#6a1010';c.strokeText(PEN.banner.txt,0,0);c.fillStyle=PEN.banner.good?'#ffd23a':'#fff';c.fillText(PEN.banner.txt,0,0);c.restore();}
  requestAnimationFrame(penDraw);}
function penDraw2(t,c,W,H){const{s,ox,oy}=penFit();c.drawImage(IM.k_bg,ox,oy,PBG.w*s,PBG.h*s);
  const{gx,gy,gw,gh,sx,sy}=penGoal(),ground=gy+gh,gcx=gx+gw/2,B=penGoal(true),kh=B.gh*1.0;
  if(PEN.big){const src={x:100,y:494,w:570,h:262},bx0=B.gx-(PBG.gx-src.x)*s,bw=src.w*s,bh=src.h*s,nw=bw*PEN_BIG.x,nh=bh*PEN_BIG.y,gb=oy+(src.y+src.h)*s;
    c.save();c.shadowColor='rgba(255,215,60,.9)';c.shadowBlur=18;c.drawImage(IM.k_bg,src.x,src.y,src.w,src.h,gcx-nw/2,gb-nh,nw,nh);c.restore();}
  if(PEN.flash&&t-PEN.flash<900){c.fillStyle=`rgba(255,240,150,${.25*(1-(t-PEN.flash)/900)})`;c.fillRect(0,0,W,gy+gh);}
  if(PEN.netHit&&t-PEN.netHit<450){const d=(t-PEN.netHit)/450;c.strokeStyle=`rgba(255,255,255,${.7*(1-d)})`;c.lineWidth=3;c.beginPath();c.ellipse(PEN.ball.tx,PEN.ball.ty,gw*.08*(1+d),gh*.12*(1+d),0,0,7);c.stroke();}
  // kaleci
  const k=PEN.keeper,sp=.0006+PEN.shot*.00015;if(PEN.phase==='aim'||PEN.phase==='power')k.x=Math.sin(t*sp*3)*.35;
  let img=IM.k_ready,flip=false,dw,dh,cx,by;
  if(PEN.phase==='fly'||PEN.phase==='done'){const d=Math.min(1,(t-PEN.ball.t0)/380);k.x+=(k.dive-k.x)*.1;k.y=k.jump*Math.sin(Math.min(1,d*1.2)*Math.PI*.5);
    if(PEN.saveShow){img=IM.k_hold;}
    else if(Math.abs(k.dive)<.22){img=IM.k_jump;}
    else{img=(PEN.ball.height<.4?IM.k_dive2:IM.k_dive1)||IM.k_ready;flip=k.dive<0;}}
  const cxk=gcx+k.x*B.gw/2;
  if(img===IM.k_dive1||img===IM.k_dive2){dw=kh*1.2;dh=img.height*dw/img.width;cx=Math.max(gx+dw*.35,Math.min(gx+gw-dw*.35,cxk));by=Math.max(gy+dh*.95,ground-k.y*B.gh*.5);
    const top=by-dh;PEN.kRect={x:cx-dw/2,y:top,w:dw,h:dh,shrinkX:.16,shrinkY:.18};}
  else{dh=img===IM.k_jump?kh*1.25:kh;dw=img.width*dh/img.height;cx=cxk;by=ground-(img===IM.k_jump?k.y*gh*.3:0);PEN.kRect={x:cx-dw/2,y:by-dh,w:dw,h:dh,shrinkX:.2,shrinkY:.05};}
  c.fillStyle='rgba(0,0,0,.22)';c.beginPath();c.ellipse(cxk,ground+2,dw*.35,gh*.04,0,0,7);c.fill();
  c.save();c.translate(cx,0);if(flip)c.scale(-1,1);c.drawImage(img,-dw/2,by-dh,dw,dh);c.restore();
  if(PEN.mode==='fk'&&IM.k_wall){const wim=IM.k_wall,B0=penGoal(true),wx=sx+(B0.gx+B0.gw/2+PEN.wallX*B0.gw/2-sx)*.55,wy=sy+(B0.gy+B0.gh-sy)*.55,wh=B0.gh*1.25,ww=wim.width*wh/wim.height;
    PEN.wall={x:wx,y:wy,w:ww,h:wh};c.drawImage(wim,wx-ww/2,wy-wh,ww,wh);}
  // top
  let bx=sx,byb=sy,br=W*.05;
  if(PEN.ball){const b=PEN.ball,d=Math.min(1,(t-b.t0)/b.dur),e=1-Math.pow(1-d,2);bx=sx+(b.tx-sx)*e;byb=sy+(b.ty-sy)*e-Math.sin(d*Math.PI)*H*.05*b.loft;br=W*.05*(1-.62*e);
    if(d>=1&&!b.done){b.done=true;penResult();}}
  if(!PEN.saveShow){c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(bx,PEN.ball?byb+br*1.3:sy+br*.8,br*.9,br*.3,0,0,7);c.fill();}
  if(PEN.saveShow){}else if(IM.k_ball){c.save();c.translate(bx,byb);c.rotate(PEN.ball?(t-PEN.ball.t0)/90:0);c.drawImage(IM.k_ball,-br,-br,br*2,br*2);c.restore();}else penBall(c,bx,byb,br,t);
  penOverlay(t,c,W,H,sx,sy);requestAnimationFrame(penDraw);}
function penOverlay(t,c,W,H,sx,sy){
  if(PEN.phase==='aim'){PEN.aim=Math.sin((t-PEN.t0)*(.0018+PEN.shot*.00025));const ang=PEN.aim*.62;c.save();c.translate(sx,sy);c.rotate(ang);
    const g=c.createLinearGradient(0,0,0,-H*.3);g.addColorStop(0,'rgba(255,210,58,.95)');g.addColorStop(1,'rgba(255,90,40,.9)');c.fillStyle=g;c.beginPath();c.moveTo(-7,-28);c.lineTo(7,-28);c.lineTo(7,-H*.24);c.lineTo(18,-H*.24);c.lineTo(0,-H*.29);c.lineTo(-18,-H*.24);c.lineTo(-7,-H*.24);c.closePath();c.fill();
    c.strokeStyle='#5a2a00';c.lineWidth=2;c.stroke();c.restore();}
  if(PEN.phase==='power'){const ph=(t-PEN.t0)*(.0021+PEN.shot*.0002);PEN.pow=(1-Math.cos(ph))/2;const bxp=W*.86,byp=H*.5,bh=H*.32,bw=24;
    const g=c.createLinearGradient(0,byp+bh,0,byp);g.addColorStop(0,'#5fc03a');g.addColorStop(.65,'#ffd23a');g.addColorStop(.85,'#ff8a2c');g.addColorStop(1,'#e2483d');
    c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.roundRect?c.roundRect(bxp-5,byp-5,bw+10,bh+10,12):c.rect(bxp-5,byp-5,bw+10,bh+10);c.fill();c.fillStyle=g;c.fillRect(bxp,byp,bw,bh);
    c.fillStyle='#fff';const yy=byp+bh*(1-PEN.pow);c.beginPath();c.moveTo(bxp-12,yy);c.lineTo(bxp-2,yy-8);c.lineTo(bxp-2,yy+8);c.closePath();c.fill();c.fillRect(bxp,yy-2,bw,4);
    c.save();c.translate(sx,sy);c.rotate(PEN.aim*.62);c.strokeStyle='rgba(255,210,58,.7)';c.setLineDash([8,8]);c.lineWidth=3;c.beginPath();c.moveTo(0,-28);c.lineTo(0,-H*.3);c.stroke();c.restore();}
  if(PEN.banner&&t-PEN.banner.t0<1200){const d=(t-PEN.banner.t0)/1200,s=d<.15?d/.15*1.15:1.15-(d-.15)*.15;c.save();c.globalAlpha=d>.75?(1-d)/.25:1;c.translate(W/2,H*.62);c.scale(s,s);
    c.font=`800 ${Math.round(W*.13)}px Fredoka,"Trebuchet MS",sans-serif`;c.textAlign='center';c.textBaseline='middle';c.lineWidth=10;c.strokeStyle=PEN.banner.good?'#1d5e12':'#6a1010';c.strokeText(PEN.banner.txt,0,0);c.fillStyle=PEN.banner.good?'#ffd23a':'#fff';c.fillText(PEN.banner.txt,0,0);c.restore();}}
function penBall(c,x,y,r,t){const g=c.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r);g.addColorStop(0,'#fff');g.addColorStop(1,'#cfd6dd');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();
  c.fillStyle='#222';const rot=PEN.ball?(t-PEN.ball.t0)/60:0;for(let i=0;i<5;i++){const a=rot+i*Math.PI*2/5;c.beginPath();c.arc(x+Math.cos(a)*r*.62,y+Math.sin(a)*r*.62,r*.2,0,7);c.fill();}
  c.beginPath();c.arc(x,y,r*.24,0,7);c.fill();c.strokeStyle='#555';c.lineWidth=1;c.beginPath();c.arc(x,y,r,0,7);c.stroke();}
function penKeeper(c,x,ground,gh,k){const s=gh/120,lean=k.dive?Math.max(-1,Math.min(1,(k.dive-k.x)*-2+Math.sign(k.dive)*.9)):0;
  c.save();c.translate(x,ground-(k.y||0)*gh*.35);const tilt=PEN.phase==='fly'?Math.sign(k.dive)*Math.min(1.1,Math.abs(k.dive)*1.6):0;c.rotate(tilt);
  c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(0,0,24*s,6*s,0,0,7);c.fill();
  c.fillStyle='#22252b';c.fillRect(-14*s,-38*s,10*s,38*s);c.fillRect(4*s,-38*s,10*s,38*s); // bacaklar
  c.fillStyle='#ff8a00';c.beginPath();c.roundRect?c.roundRect(-20*s,-82*s,40*s,48*s,10*s):c.rect(-20*s,-82*s,40*s,48*s);c.fill(); // forma
  c.fillStyle='#fff';c.font=`700 ${16*s}px Fredoka,sans-serif`;c.textAlign='center';c.fillText('1',0,-52*s);
  const arm=PEN.phase==='fly'?-1:.2+Math.sin(performance.now()/200)*.15;c.strokeStyle='#ff8a00';c.lineWidth=9*s;c.lineCap='round';
  for(const sd of[-1,1]){c.beginPath();c.moveTo(sd*18*s,-74*s);const hx=sd*(30+(arm<0?6:0))*s,hy=arm<0?-112*s:-60*s;c.lineTo(hx,hy);c.stroke();c.fillStyle='#e8f04a';c.beginPath();c.arc(hx,hy,7*s,0,7);c.fill();}
  c.fillStyle='#f1c39b';c.beginPath();c.arc(0,-94*s,13*s,0,7);c.fill();c.fillStyle='#3a2414';c.beginPath();c.arc(0,-99*s,13*s,Math.PI,0);c.fill();
  c.restore();}
function penTap(ev){if(!PEN.run||pen$('penEnd').classList.contains('on'))return;const t=performance.now();
  if(PEN.mode==='1v1'){if(PEN.phase!=='run')return;const p=(t-PEN.t0)/1900;PEN.phase='done';PEN.p=Math.min(1,p);const ok=p>=.55&&p<=.78;PEN.res.push(ok);
    if(ok){PEN.chip=t;PEN.cx=PEN.W/2+(Math.random()<.5?-1:1)*penGoal(true).gw*.3;if(SND.ctx)tone('sine',160,70,.15,.4);setTimeout(()=>{penBanner('GOOOL!',true);sfx.fanfare();},600);}
    else penBanner(p<.55?'Erken vurdun!':'Kaleci kaptı!',false);shotDone(ok);return;}
  if(PEN.mode==='save'){if(PEN.phase==='done'||PEN.tap!==null)return;if(PEN.phase==='wait'){PEN.msg='Bekle… önce o vursun!';penHud();return;}
    const r=pen$('penCv').getBoundingClientRect(),x=ev?(ev.clientX-r.left):PEN.W/2;PEN.tap=x<PEN.W/3?-1:x>PEN.W*2/3?1:0;sfx.blip();return;}
  if(PEN.phase==='aim'){PEN.phase='power';PEN.t0=t;setTimeout(penBoostUI,0);PEN.msg='Güç: yeşil-sarı arası en iyisi, kırmızı dışarı uçar';penHud();sfx.blip();return;}
  if(PEN.phase==='power'){PEN.phase='fly';const{gx,gy,gw,gh}=penGoal();const aim=PEN.aim,pow=PEN.pow;
    const bxh=aim*1.24,tx=gx+gw/2+bxh*gw/2,height=Math.min(1.25,.15+pow*1.05),ty=gy+gh-height*gh;
    PEN.ball={t0:t,dur:520-pow*220,tx,ty,loft:.4+pow*.5,aim,bxh,height};
    if(PEN.mode==='fk'&&PEN.wall){const w=PEN.wall,cross=PEN.ball&&(gx+gw/2+0)&&(penGoal(true).sx+(tx-penGoal(true).sx)*.55);if(Math.abs(cross-w.x)<w.w*.42&&height<.62){PEN.ball.blocked=true;PEN.ball.tx=cross;PEN.ball.ty=w.y-w.h*.55;PEN.ball.dur*=.55;}}
    PEN.saveShow=false;const k=PEN.keeper,skill=.18+PEN.shot*.04+(S.lvl>20?.04:0);const sc=PEN.big?PEN_BIG.x:1,guess=Math.random()<skill?bxh*sc+(Math.random()-.5)*.25:(Math.random()*2-1);k.dive=Math.max(-.9,Math.min(.9,guess));k.jump=Math.min(1,height*1.1);
    if(SND.ctx){tone('sine',140,60,.15,.4);noise(.05,.15,null,800);}PEN.msg='';penHud();}}
function penResult(){const b=PEN.ball,k=PEN.keeper;const inX=Math.abs(b.bxh)<.97&&!b.blocked,inY=b.height<=1.0&&!b.blocked;
  // kalecinin çizildiği yer ile topun gerçekten çakışmasına bakılır (yarım kale genişliği biriminde)
  const kx=k.x,reach=.26+.1*Math.min(1,b.height);let saved;
  if(IM.k_bg&&PEN.kRect){const r=PEN.kRect,x0=r.x+r.w*r.shrinkX,x1=r.x+r.w*(1-r.shrinkX),y0=r.y+r.h*r.shrinkY,y1=r.y+r.h;saved=inX&&inY&&b.tx>x0&&b.tx<x1&&b.ty>y0&&b.ty<y1;}
  else saved=inX&&inY&&Math.abs(kx-b.bxh)<reach&&!(b.height>.85&&Math.abs(b.bxh)>.7);
  if(saved)setTimeout(()=>{PEN.saveShow=true;PEN.keeper.x=PEN.keeper.dive*.5;PEN.keeper.dive=PEN.keeper.x;PEN.keeper.jump=0;},500);
  let goal=inX&&inY&&!saved;PEN.res.push(goal);const t=performance.now();
  if(goal){PEN.netHit=t;PEN.flash=t;PEN.banner={txt:'GOOOL!',good:true,t0:t};if(SND.ctx){noise(.9,.18,null,500);[0,4,7].forEach((n,i)=>pluck(HICAZ[n]*2,SND.ctx.currentTime+i*.1,.25,SND.fx));}}
  else{PEN.banner={txt:b.blocked?'Baraja çarptı!':saved?'Kurtardı!':(inY?'Direk dışı!':'Auttt!'),good:false,t0:t};if(SND.ctx)tone('triangle',300,150,.4,.15);}
  penHud();PEN.shot++;
  if(PEN.single){shotDone(goal);return;}
  setTimeout(()=>{if(!PEN.run)return;if(PEN.shot>=5)return penEnd();PEN.ball=null;PEN.big=false;PEN.saveShow=false;penBoostUI();PEN.keeper={x:0,dive:0,y:0};PEN.phase='aim';PEN.t0=performance.now();PEN.msg=`Atış ${PEN.shot+1}/5 · Kaleci gittikçe ısınıyor`;penHud();},1500);}
function penEnd(){const g=PEN.res.filter(Boolean).length,win=g>=3;let coins=0,gems=0;
  if(win){coins=20+S.lvl*6+g*10;if(g===5)gems=1;S.coins+=coins;S.gems=(S.gems||0)+gems;gainXP(4+g);changed();sfx.fanfare();}
  pen$('penEndTxt').innerHTML=`<h2>${g===5?'Kusursuz!':win?'Kazandın!':'Kaleci kazandı'}</h2><div class="pres">${PEN.res.map(r=>r?'⚽':'❌').join(' ')}</div><p class="sub2">${g} / 5 gol</p>${win?`<p>${COIN} +${coins}${gems?` · ${GEM} +${gems}`:''}</p>`:'<p>En az 3 gol atarsan ödül kazanırsın.</p>'}`;
  const free=S.pen.plays<3;pen$('penAgain').innerHTML=free?'Tekrar (bedava)':`Tekrar · 1 ${GEM}`;pen$('penEnd').classList.add('on');}
function penBoostUI(){const b=pen$('penBig');if(!b)return;b.disabled=PEN.big||PEN.phase!=='aim';b.innerHTML=PEN.big?'🥅 Kale büyüdü!':`🥅 Kaleyi büyüt · ${PEN_BIG.cost} ${GEM}`;pen$('penGems').innerHTML=`${GEM} ${S.gems||0}`;}
function penBig(){if(PEN.big||PEN.phase!=='aim')return;if(!spendGems(PEN_BIG.cost))return;PEN.big=true;PEN.msg='Kale bu atış için büyüdü!';penHud();penBoostUI();sfx.fanfare();}
function penBind(){pen$('penBig').onclick=penBig;pen$('penCv').addEventListener('pointerdown',ev=>{ev.preventDefault();penTap(ev);});pen$('penClose').onclick=closePenalty;pen$('penAgain').onclick=()=>openPenalty();pen$('penBack').onclick=closePenalty;}

