/* ================= EZAN ================= */
const VAKIT=[['Sabah',330],['Öğle',750],['İkindi',945],['Akşam',1140],['Yatsı',1245]];
const MINARE={b_cami1:{x:.31,top:.17,base:.55},b_cami2:{x:.75,top:.19,base:.6},b_cami3:{x:.86,top:.14,base:.6},b_cami4:{x:.79,top:.13,base:.6}};
let lastEzan=null;
function ezanNow(m){for(const[n,s]of VAKIT){const d=m-s;if(d>=0&&d<36)return {n,d};}return null;}
function drawEzan(t){
  const m=gameMin(),ez=ezanNow(m);const minOf=e=>{const k=imgOf(e);let m=MINARE[k];if(!m){const g=GEO[k];m=g&&g.tip?{x:g.tip.x,top:g.tip.y+.1,base:.55}:null;}return m&&e.flip?{...m,x:1-m.x}:m;};
  const camis=S.ents.filter(e=>e.type==='cami1'&&minOf(e)&&cellUnlocked(e.gx,e.gy));
  if(!ez){lastEzan=null;return;}
  if(camis.length&&lastEzan!==ez.n){lastEzan=ez.n;toast('🕌 '+ez.n+' ezanı okunuyor');}
  const sec=ez.d+(now()%1000)/1000; // 0-36 s
  for(const e of camis){const r=rectOf(e);if(!r)continue;const mn=minOf(e),x=r.x+r.w*mn.x,top=r.y+r.h*mn.top,base=r.y+r.h*mn.base;
    let y;if(sec<7)y=base+(top-base)*(sec/7);else if(sec<29)y=top;else y=top+(base-top)*Math.min(1,(sec-29)/7);
    const im=IM.f_10;if(im){const w=11,h=im.height*w/im.width;ctx.drawImage(im,x-w/2,y-h,w,h);}
    if(sec>=7&&sec<29){ctx.save();ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=2;
      for(let i=0;i<3;i++){const ph=((sec-7)*1.3+i/3)%1,rad=10+ph*80;ctx.globalAlpha=(1-ph)*.8;ctx.beginPath();ctx.arc(x,y-8,rad,-Math.PI*.85,-Math.PI*.15);ctx.stroke();ctx.beginPath();ctx.arc(x,y-8,rad,Math.PI*1.15,Math.PI*1.85);ctx.stroke();}
      ctx.restore();
      const s=w2s(x,y-20);ctx.save();ctx.setTransform(DPR,0,0,DPR,0,0);ctx.font='600 12px Fredoka,"Trebuchet MS",sans-serif';const txt='Allahu Ekber, Allahu Ekber…',tw=ctx.measureText(txt).width+18;
      ctx.fillStyle='rgba(255,250,240,.92)';rr(s.x-tw/2,s.y-34,tw,24,10);ctx.fill();ctx.fillStyle='#4a2e17';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,s.x,s.y-22);ctx.restore();}}
}
/* vehicles */
const VEH=[];
// Araçlar: her biri önden ve arkadan görünüşe sahip; hangi aracın çıkacağı köyün durumuna bağlı
const VTYPE={rover:{w:50,sp:.5},tractor:{w:38,sp:.55},pickup:{w:44,sp:.9},dolmus:{w:48,sp:1},bus:{w:62,sp:.9},taxi:{w:40,sp:1.25},car:{w:40,sp:1.15},amb:{w:46,sp:1.6},fire:{w:58,sp:1.2},van:{w:48,sp:1}};
function spawnVeh(){VEH.length=0;if(S.world==='planet'){const rs=allRoads().filter(p=>cellUnlocked(p[0],p[1]));if(rs.length)for(let i=0;i<2;i++){const c=rs[Math.floor(rand(i*11+4)*rs.length)];VEH.push({type:'veh',k:'rover',cx:c[0]+.5,cy:c[1]+.5,tx:c[0]+.5,ty:c[1]+.5,prev:null,dir:[0,1]});}return;}
  const pop=popTotal(),era=S.era,fields=S.ents.filter(e=>e.type==='field').length,ks=[];
  if(DEMO){ks.push(...[['tractor','pickup'],['tractor','pickup','dolmus','dolmus'],['dolmus','bus','taxi','car','car','amb','van'],['bus','bus','taxi','taxi','car','car','amb','fire','van']][era-1]||[]);}
  else{if(fields>=2&&era<=3)ks.push('tractor');if(fields>=4||era>=2)ks.push('pickup');
    if(era>=2)ks.push('dolmus');if(era>=2&&pop>=60)ks.push('dolmus');
    if(era>=3||pop>=90)ks.push('bus');if(era>=3){for(let i=0;i<Math.min(4,Math.floor(pop/45));i++)ks.push(i%2?'car':'taxi');ks.push('fire');}
    if(has('post'))ks.push('van');if(has('hospital'))ks.push('amb');}
  const roads=allRoads().filter(p=>cellUnlocked(p[0],p[1]));if(!roads.length)return;
  ks.slice(0,11).forEach((k,i)=>{const c=roads[Math.floor(rand(i*11+4)*roads.length)];VEH.push({type:'veh',k,cx:c[0]+.5,cy:c[1]+.5,tx:c[0]+.5,ty:c[1]+.5,prev:null,dir:[0,1]});});}
function stepVeh(t){const dt=Math.min(100,t-(stepVeh.l||t));stepVeh.l=t;
  for(const v of VEH){const dx=v.tx-v.cx,dy=v.ty-v.cy,d=Math.hypot(dx,dy),s=((VTYPE[v.k]||{}).sp||1.1)*dt/1000;
    if(d<=s){v.cx=v.tx;v.cy=v.ty;const fx=Math.floor(v.cx),fy=Math.floor(v.cy);
      let o=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[fx+a,fy+b]).filter(([x,y])=>canDrive(x,y));const np=o.filter(p=>!v.prev||p[0]!==v.prev[0]||p[1]!==v.prev[1]);if(np.length)o=np;
      if(o.length){const p=v.next&&o.some(q=>q[0]===v.next[0]&&q[1]===v.next[1])?v.next:o[Math.floor(Math.random()*o.length)];
        if(isCrossing(p[0],p[1])&&!isCrossing(fx,fy)&&trainNear(p[1])){v.next=p;v.dir=[p[0]-fx,p[1]-fy];continue;} // bariyerde bekle
        v.next=null;v.prev=[fx,fy];v.tx=p[0]+.5;v.ty=p[1]+.5;v.dir=[p[0]-fx,p[1]-fy];}
      else{v.stuckN=(v.stuckN||0)+1;if(v.stuckN>3){const rs=allRoads().filter(([x,y])=>canDrive(x,y)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>canDrive(x+a,y+b)));if(rs.length){const c=rs[Math.floor(Math.random()*rs.length)];v.cx=v.tx=c[0]+.5;v.cy=v.ty=c[1]+.5;v.prev=null;v.stuckN=0;}}}}
    else{v.cx+=dx/d*s;v.cy+=dy/d*s;}
    v.gx=v.cx-.25;v.gy=v.cy-.25;}}
const vehImg=v=>{if(v.k==='rover'){const d=v.dir||[0,1],k=(d[0]<0||d[1]<0)?'v_rover_b':'v_rover_f';return IM[k];}if(!VTYPE[v.k]||v.k==='van')return IM['v_'+v.k]||IM[v.k];const d=v.dir||[0,1],back=d[0]<0||d[1]<0;return IM[`veh_${v.k}_${back?'b':'f'}`];};
function vehRect(v){const im=vehImg(v);if(!im)return null;const w=(VTYPE[v.k]||{w:48}).w,h=im.height*w/im.width,dr=v.dir||[1,0],p=iso(v.cx-dr[1]*.2,v.cy+dr[0]*.2);return {x:p.x-w/2,y:p.y-h+8,w,h,im};}
function drawVeh(v,t){const r=vehRect(v);if(!r)return;const dir=v.dir||[0,1];
  /* resimler sol-aşağı (ön) ve sağ-yukarı (arka) bakıyor; x ekseninde giderken aynala */
  const flip=dir[0]!==0;const bob=Math.sin(t/90)*.5;
  ctx.save();ctx.fillStyle='rgba(20,30,10,.22)';ctx.beginPath();ctx.ellipse(r.x+r.w/2,r.y+r.h-4,r.w*.42,r.w*.13,0,0,7);ctx.fill();
  ctx.translate(r.x+r.w/2,r.y+r.h+bob);ctx.scale(flip?-1:1,1);ctx.drawImage(r.im,-r.w/2,-r.h,r.w,r.h);
  if(v.k==='amb'&&Math.floor(t/250)%2===0){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(-r.w*.05,-r.h*.92,0,-r.w*.05,-r.h*.92,r.w*.35);g.addColorStop(0,'rgba(80,150,255,.9)');g.addColorStop(1,'rgba(80,150,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(-r.w*.05,-r.h*.92,r.w*.35,0,7);ctx.fill();}
  ctx.restore();}
/* helicopter */
let heliT=0;
function heliGo(){if(has('helipad'))heliT=now();}
function drawHeli(r,t){const d=(t-heliT)/1000;const x0=r.x+r.w*.5,y0=r.y+r.h*.66,w=62;let dx=0,dy=0,a=1;
  if(heliT&&d<9){const p=d<4.5?d/4.5:(9-d)/4.5,e=p*p;dx=e*380;dy=-e*420;a=1-Math.max(0,e-.7)/.3;}
  const im=IM.v_heli;if(!im)return;const h=im.height*w/im.width;
  if(dy<-2){ctx.fillStyle='rgba(20,30,10,.18)';ctx.beginPath();ctx.ellipse(x0,y0-4,22,7,0,0,7);ctx.fill();}
  ctx.save();ctx.globalAlpha=Math.max(0,a);ctx.translate(x0+dx,y0+dy+(dy<-2?Math.sin(t/120)*2:0));ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();}
/* cargo ship */
let planeAnim=null;
function drawPlane(r,t){const im=IM.v_plane;if(!im||S.plane.state==='locked')return;const bx=r.x+r.w*.74,by=r.y+r.h*.86;let k=0,show=S.plane.state==='here';
  if(planeAnim){const d=Math.min(1,(t-planeAnim.t0)/5000);if(d>=1){planeAnim=null;}else{show=true;const e=d*d;k=planeAnim.leave?e:1-(1-(1-d)*(1-d));if(!planeAnim.leave)k=(1-d)*(1-d);}}
  if(!show)return;const w=78*(1+k*.6),h=im.height*w/im.width;
  ctx.save();ctx.globalAlpha=1-Math.max(0,k-.75)*4;ctx.translate(bx+k*700,by-k*520);if(planeAnim&&planeAnim.leave){ctx.scale(-1,1);ctx.rotate(-.18);}else ctx.rotate(-k*.15);ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();}
let skyPlane=null;
function drawSky(t){if(!IM.v_plane||!S.ents.some(e=>isAirport(e)))return;if(!skyPlane||t-skyPlane.t0>14000){if(!skyPlane||Math.random()<.004){const b=bounds();skyPlane={t0:t,x0:b.x0-300,y0:b.y0+(b.y1-b.y0)*(.2+Math.random()*.5)};}else return;}
  const d=(t-skyPlane.t0)/14000,b=bounds(),im=IM.v_plane,w=90,h=im.height*w/im.width;ctx.save();ctx.globalAlpha=.95;ctx.translate(skyPlane.x0+(b.x1-b.x0+600)*d,skyPlane.y0-d*260);ctx.scale(-1,1);ctx.rotate(-.12);ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();} // burnu gittiği yöne baksın
let shipAnim=null;
function shipPos(r,t){const base={x:r.x+r.w*.2,y:r.y+r.h*.86};if(S.ship.state==='locked')return null;
  if(shipAnim){const d=Math.min(1,(t-shipAnim.t0)/4000);if(d>=1){const l=shipAnim.leave;shipAnim=null;if(l)return null;}
    const e=shipAnim.leave?d*d:1-(1-d)*(1-d),k=shipAnim.leave?e:1-e;return {x:base.x-k*420,y:base.y+k*210,a:1-k};}
  return S.ship.state==='here'?{...base,a:1}:null;}
function drawShip(r,t){const p=shipPos(r,t),im=IM.v_ship;if(!p||!im)return;const w=86,h=im.height*w/im.width;
  ctx.save();ctx.globalAlpha=p.a;ctx.translate(p.x,p.y+Math.sin(t/700)*2);ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();}
function shipHit(w){const e=S.ents.find(isHarbor);if(!e||S.ship.state!=='here')return false;const r=rectOf(e);if(!r)return false;const p=shipPos(r,now());if(!p)return false;
  return Math.abs(w.x-p.x)<46&&w.y<p.y&&w.y>p.y-60;}
function checkShip(t){if(S.ship.state==='away'&&t>=S.ship.back){S.ship={state:'here',crates:genCrates(4),back:0};shipAnim={t0:t,leave:false};save();}
  if(S.plane.state==='away'&&t>=S.plane.back){S.plane={state:'here',crates:genCrates(6),back:0};planeAnim={t0:t,leave:false};save();toast('Kargo uçağı havalimanına indi!');}}
function cargoPanel(title,obj,intro,go,payMul){
  openSheet(title,()=>{const t=now();
    if(obj().state==='away'){$('sBody').innerHTML=`<p class="sub">Yolda. ${fmt(obj().back-t)} sonra döner.</p>`;return;}
    const cr=obj().crates,all=cr.every(w=>w.done);
    $('sBody').innerHTML=`<p class="sub">${intro}</p><div class="wag">`+cr.map((w,i)=>{const pay=Math.round(ITEMS[w.k].v*w.q*payMul);return `<div class="w ${w.done?'full':''}">${ic(w.k)}<div class="t">${ITEMS[w.k].n}</div>
      <div class="d">${w.done?(w.skipped?'Boş gidiyor':'Yüklendi'):have(w.k)+' / '+w.q}</div>${w.done?'':`<button class="btn" data-w="${i}" ${have(w.k)>=w.q?'':'disabled'}><span>Yükle +${pay}</span></button> <button class="btn ghost" data-skip="${i}">Boş geç</button>`}</div>`;}).join('')+
      `</div><div style="margin-top:14px;text-align:center"><button class="btn alt" id="go" ${all?'':'disabled'}>Yola çıkar</button></div>`;
    bind('[data-skip]',b=>{const w=cr[+b.dataset.skip];if(!w.done){w.done=true;w.skipped=true;changed();}});
    bind('[data-w]',b=>{const w=cr[+b.dataset.w];if(w.done||have(w.k)<w.q)return;take({[w.k]:w.q});w.done=true;S.coins+=Math.round(ITEMS[w.k].v*w.q*payMul);gainXP(4);changed();});
    $('go').onclick=()=>{if(!obj().crates.every(w=>w.done))return;go();closeSheet();questTick();changed();};});
}
function giftTools(n){const pool=['nails','nails','shovel','axe','pickaxe','map'];const got={};for(let i=0;i<n;i++){const k=pool[Math.floor(Math.random()*pool.length)];got[k]=(got[k]||0)+1;addItem(k,1);}
  return Object.entries(got).map(([k,q])=>q+' '+ITEMS[k].n).join(', ');}
function openShip(){unlockTransport();if(S.ship.state==='locked'){toast('Kargo gemisi için Balıkçı’yı seviye 8’e yükselt (liman olur).');return;}
  cargoPanel('Kargo gemisi',()=>S.ship,'Gemi ambarını doldur. Gemi ana karaya gider, 1 saat sonra alet ve harita parçalarıyla döner.',()=>{
    const g=giftTools(3);gainXP(20);S.st.ships++;S.ship={state:'away',crates:[],back:now()+T_SHIP};shipAnim={t0:now(),leave:true};
    talk('p_balikci',`Gemi demir aldı! Dönüşte getireceği: ${g}.`,[['Harika',null]]);},1.3);}
function openPlane(){if(S.plane.state==='locked'){toast('Havalimanı hazırlanıyor');return;}
  cargoPanel('Kargo uçağı',()=>S.plane,'Altı kargo bölmesini doldur. Uçak 3 saatlik sefere çıkar; büyük ödül ve nadir aletler getirir.',()=>{
    const g=giftTools(5);S.coins+=800;gainXP(50);S.st.planes++;S.plane={state:'away',crates:[],back:now()+T_PLANE};planeAnim={t0:now(),leave:true};
    talk('p_pilot',`Kalkış izni alındı! +800 altın. Dönüşte: ${g}.`,[['İyi uçuşlar',null]]);},1.5);}
/* train */
function railRange(){let a=1e9,b=-1e9;for(const[bx,by]of blockList())if(Math.floor((RAILX-OFF)/BS)===bx){a=Math.min(a,OFF+by*BS);b=Math.max(b,OFF+by*BS+BS-1);}return [a,b];}
let trainAnim=null; // {from,to,t0,dur}
const TRAIN_STOP=14.6;
function trainArrive(){trainAnim={from:railRange()[0]-4,to:TRAIN_STOP,t0:now(),dur:4500};}
function trainLeave(){trainAnim={from:TRAIN_STOP,to:railRange()[1]+6,t0:now(),dur:4500,leave:true};}
function trainPos(t){
  if(trainAnim){const d=Math.min(1,(t-trainAnim.t0)/trainAnim.dur),e=trainAnim.leave?d*d:1-(1-d)*(1-d);
    const y=trainAnim.from+(trainAnim.to-trainAnim.from)*e;if(d>=1){const l=trainAnim.leave;trainAnim=null;if(l)return null;}return y;}
  return S.train.state==='here'?TRAIN_STOP:null;
}
function trainParts(t){
  const y=trainPos(t);if(y===null)return[];const parts=[{type:'train',k:'x_loco',gx:RAILX,gy:y-.5}];
  for(let i=0;i<3;i++)parts.push({type:'train',k:'x_wagon',gx:RAILX,gy:y-1.6-i*1.15,wi:i});return parts;
}
function drawTrainPart(p,t){
  const c=iso(RAILX+.5,p.gy+.5),im=IM[p.k];if(!im)return;const w=p.k==='x_loco'?78:70,h=im.height*w/im.width;
  const rg=railRange(),fade=p.gy<rg[0]?Math.max(0,1+(p.gy-rg[0])/3):p.gy>rg[1]?Math.max(0,1-(p.gy-rg[1])/3):1;
  ctx.save();ctx.globalAlpha=fade;ctx.translate(c.x,c.y+10);ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();
  if(p.k==='x_wagon'&&S.train.state==='here'&&!trainAnim){const wg=S.train.wagons[p.wi];if(wg){const ii=IM['i_'+wg.k];
    if(ii){const s=26/Math.max(ii.width,ii.height);ctx.globalAlpha=wg.done?1:.55;ctx.drawImage(ii,c.x-ii.width*s/2,c.y-h*.75-ii.height*s/2+10,ii.width*s,ii.height*s);ctx.globalAlpha=1;}
    if(wg.done){ctx.fillStyle='#5fc03a';ctx.beginPath();ctx.arc(c.x+14,c.y-h*.8+10,7,0,7);ctx.fill();}}}
}

let place=null;
function depth(e){return e.gx+e.gy+DEF[e.type].size;}
// Donma önleme: bir karede hata olsa bile döngü durmaz; tam ekran oyun açıkken köy çizilmez; yavaş cihazda çözünürlük düşer
let DPR_CAP=2,frameAvg=16,frameLast=0,drawErr=0;
const overlayOpen=()=>['m3','lig','pen'].some(id=>{const el=document.getElementById(id);return el&&el.classList.contains('on');});
function draw(){requestAnimationFrame(draw);if(document.hidden||overlayOpen())return;
  const pn=performance.now();if(frameLast){frameAvg=frameAvg*.97+Math.min(100,pn-frameLast)*.03;if(frameAvg>36&&DPR_CAP>1.25&&pn-(draw.adj||0)>4000){DPR_CAP-=.25;draw.adj=pn;resize();}}frameLast=pn;
  try{drawFrame();}catch(e){if(drawErr++<3)console.warn('çizim hatası',e);}}
function drawZoomLabels(){if(cam.z>.5)return;const k=1/cam.z,a=Math.min(1,(.5-cam.z)/.08);
  const vx0=cam.x-W/2/cam.z,vx1=cam.x+W/2/cam.z,vy0=cam.y-H/2/cam.z,vy1=cam.y+H/2/cam.z;ctx.save();ctx.globalAlpha=a;
  for(const e of S.ents){const d=DEF[e.type];if(!d||!d.looks||e.type==='cottage')continue;const r=rectOf(e);if(!r||r.x>vx1||r.x+r.w<vx0||r.y>vy1||r.y+r.h<vy0)continue;
    const out=d.rl?RECIPES[Object.keys(d.rl)[0]]&&RECIPES[Object.keys(d.rl)[0]].out:null,im=out?IM['i_'+out]:null,nm=d.name,lvT=' '+lv(e);
    ctx.font=`700 ${13*k}px Fredoka,sans-serif`;const tn=ctx.measureText(nm).width,tl=ctx.measureText(lvT).width,tw=tn+tl,pw=tw+(im?26*k:0)+16*k,ph=24*k,x=r.x+r.w/2-pw/2,y=r.y+r.h*.18-ph;
    ctx.fillStyle='rgba(40,25,10,.78)';ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,pw,ph,ph/2):ctx.rect(x,y,pw,ph);ctx.fill();
    if(im)ctx.drawImage(im,x+6*k,y+3*k,18*k,18*k);ctx.fillStyle='#fff';ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillText(nm,x+(im?28*k:8*k),y+ph/2+k);
    ctx.fillStyle='#ffd23a';ctx.fillText(lvT,x+(im?28*k:8*k)+tn,y+ph/2+k);}
  ctx.restore();}
function drawFrame(){
  const t=now();
  ctx.setTransform(DPR*cam.z,0,0,DPR*cam.z,DPR*(W/2-cam.x*cam.z),DPR*(H/2-cam.y*cam.z));
  drawSea(t);drawGround(t);
  stepVillagers(t);checkTrain(t);
  CLOUDS=cloudsList();
  stepVeh(t);checkShip(t);
  stepPets(t);
  const list=S.ents.concat(VILL,VEH,CLOUDS,trainParts(t),lamps(),PETS);
  if(place)list.push({type:place.type,gx:place.gx,gy:place.gy,img:place.img,ghost:true});
  list.sort((a,b)=>depth(a)-depth(b));
  const vx0=cam.x-W/2/cam.z-260,vx1=cam.x+W/2/cam.z+260,vy0=cam.y-H/2/cam.z-160,vy1=cam.y+H/2/cam.z+520;
  for(const e of list){
    if(e.gx!==undefined&&!e.ghost&&e.type!=='cloud'){const q=iso(e.gx+.5,e.gy+.5);if(q.x<vx0||q.x>vx1||q.y<vy0||q.y>vy1)continue;}
    const d=DEF[e.type];
    if(e.ghost){const ok=!occupied(e.gx,e.gy,d.size,place.move);diamond(e.gx,e.gy,d.size,d.size);ctx.fillStyle=ok?'rgba(120,255,120,.45)':'rgba(255,80,80,.5)';ctx.fill();
      if(d.kind==='road'){diamond(e.gx,e.gy,1,1);ctx.fillStyle=pat('t_dirt',260)||'#b9875a';ctx.fill();}
      else if(d.kind==='field')drawField(e,t);else{const r=rectOf(e);if(r)drawSprite(r,1,.8,e.flip);}continue;}
    if(place&&place.move===e)continue;
    if(S.ents.includes(e)&&!cellUnlocked(e.gx,e.gy))continue;
    switch(d.kind){
      case 'cloud':drawCloud(e,t);break;
      case 'sign':drawSign(e,t);break;
      case 'train':drawTrainPart(e,t);break;
      case 'veh':drawVeh(e,t);break;
      case 'lamp':drawLamp(e,t);break;
      case 'pet':drawPet(e,t);break;
      case 'villager':{const r=villRect(e);if(r){ctx.fillStyle='rgba(30,40,10,.22)';ctx.beginPath();ctx.ellipse(r.x+r.w/2,r.y+r.h-2,r.w*.3,r.w*.1,0,0,7);ctx.fill();
        const rc=e.react&&t-e.react.t0<3400?(t-e.react.t0):-1;
        if(rc<0&&showOn()){const i=e.cx*3+e.cy;ctx.save();ctx.translate(r.x+r.w/2,r.y+r.h-Math.abs(Math.sin(t/160+i))*9);ctx.rotate(Math.sin(t/220+i)*.16);drawWalker(r.im,0,0,r.w,Math.sin(t/160+i)*1.2,Math.sin(t/900+i)>0);ctx.restore();}
        else if(rc<0){const ph=e.moving?(e.ph||0):0,alt=IM[e.k+'b'];const im=alt&&e.moving&&Math.abs(Math.floor((ph-Math.PI/2)/Math.PI))%2===1?alt:r.im;drawWalker(im,r.x+r.w/2,r.y+r.h,r.h*im.width/im.height,ph,e.flip);}
        else{const spin=1,wave=rc<2200?Math.sin(rc/90)*.06:0,hop=0;
          ctx.save();ctx.translate(r.x+r.w/2,r.y+r.h+hop);ctx.rotate(wave);ctx.scale(spin||.05,1);drawWalker(r.im,0,0,r.w,0,e.flip);ctx.restore();
          if(rc<2600){ctx.save();ctx.font='18px "Apple Color Emoji","Segoe UI Emoji",sans-serif';ctx.textAlign='center';ctx.translate(r.x+r.w*(e.flip?.1:.9),r.y+r.h*.18+hop);ctx.rotate(Math.sin(rc/90)*.5);ctx.fillText('👋',0,0);ctx.restore();}}}break;}
      case 'field':drawField(e,t);break;
      default:{const r=rectOf(e);if(!r)break;drawSprite(r,bounceK(e,t),1,e.flip);drawBuildingExtras(e,r,t);smoke(e,t);
        if(lv(e)>1){const x=r.x+r.w*.18,y=r.y+r.h*.3;ctx.fillStyle='#ffcf3a';star(x,y,15);ctx.fillStyle='#7a4a00';ctx.font='700 13px Fredoka,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(lv(e),x,y+1);}}
    }
  }
  drawZoomLabels();drawPuffs(t);drawEventDeco(t);drawSky(t);drawQArrow(t);QARROW=null;
  drawNight(t);drawEzan(t);drawWeather(t);
  for(const e of S.ents){if(DEF[e.type].kind==='prod'||DEF[e.type].kind==='house')drawBubble(e,t);}
  drawFloats(t);
  drawTimers(t);
  drawSpeech(t);
}
/* screen-space timers */
function pillTime(ms){const s=Math.max(0,Math.ceil(ms/1000));if(s<60)return s+' sn';return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function timerAt(wx,wy,ms,p){
  const s=w2s(wx,wy);if(s.x<-60||s.y<-40||s.x>W+60||s.y>H+40)return;const w=58,x=s.x-w/2,y=s.y;
  ctx.fillStyle='rgba(45,30,15,.78)';rr(x,y,w,30,9);ctx.fill();
  ctx.fillStyle='#fff';ctx.font='600 13px Fredoka,"Trebuchet MS",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(pillTime(ms),s.x,y+10);
  ctx.fillStyle='rgba(255,255,255,.25)';rr(x+6,y+20,w-12,5,2.5);ctx.fill();ctx.fillStyle='#ffc93a';rr(x+6,y+20,(w-12)*Math.max(.04,Math.min(1,p)),5,2.5);ctx.fill();
}
function drawTimers(t){
  ctx.setTransform(DPR,0,0,DPR,0,0);if(cam.z<.45)return;
  for(const e of S.ents){
    if(e.type==='field'&&e.crop&&t<e.crop.end){const c=iso(e.gx+.5,e.gy+.5);timerAt(c.x,c.y-58,e.crop.end-t,(t-e.crop.start)/(e.crop.end-e.crop.start));}
    else if(e._bub&&e._bub.job){const j=e._bub.job;timerAt(e._bub.x,e._bub.y+e._bub.R+12,j.end-t,(t-j.start)/(j.end-j.start));}
  }
  for(const e of S.ents)if(e._pl)timerAt(e._pl.x,e._pl.y+34,e._pl.ms,e._pl.p);
  for(const e of S.ents)if(isHarbor(e)&&S.ship.state==='away'&&S.ship.back>t){const r=rectOf(e);if(r)timerAt(r.x+r.w*.25,r.y+r.h*.6,S.ship.back-t,1-(S.ship.back-t)/T_SHIP);}
  if(S.train.state==='away'&&S.train.back>t){const c=iso(RAILX+.5,TRAIN_STOP);timerAt(c.x,c.y-40,S.train.back-t,1-(S.train.back-t)/T_TRAIN());}
}
function checkTrain(t){if(S.train.state==='away'&&t>=S.train.back){S.train={state:'here',wagons:genWagons(),back:0};trainArrive();save();}}

