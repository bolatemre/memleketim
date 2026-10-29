/* ================= DRAW: WORLD ================= */
const PAT={};
function pat(k,P,ox,oy){const im=IM[k];if(!im)return null;if(!PAT[k])PAT[k]=ctx.createPattern(im,'repeat');const p=PAT[k];
  if(p.setTransform)p.setTransform(new DOMMatrix([HW/P,HH/P,-HW/P,HH/P,ox||0,oy||0]));return p;}
function diamond(gx,gy,w,h){const a=iso(gx,gy),b=iso(gx+w,gy),c=iso(gx+w,gy+h),d=iso(gx,gy+h);
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();}
const WATERDECO=[{k:'d_lily',g:[-8.5,14],w:84},{k:'d_lily',g:[9,-8.4],w:70},{k:'d_lily',g:[32.4,19],w:76},{k:'d_boat',g:[32.6,6],w:100},{k:'d_lily',g:[18,32.3],w:66},{k:'l_pier',g:[4.6,15.2],w:150,pier:true}];
function drawSea(t){
  const a=s2w(0,0),b=s2w(W,H);
  if(S.world==='planet'){const g=ctx.createLinearGradient(0,a.y,0,b.y);g.addColorStop(0,'#0b0f2e');g.addColorStop(1,'#2a1340');ctx.fillStyle=g;ctx.fillRect(a.x,a.y,b.x-a.x,b.y-a.y);
    for(let i=0;i<140;i++){const x=a.x+((i*977)%1000)/1000*(b.x-a.x),y=a.y+((i*571)%1000)/1000*(b.y-a.y),r=(i%3)+1;ctx.globalAlpha=.4+.6*Math.abs(Math.sin(t/900+i));ctx.fillStyle=i%7?'#fff':'#9ff3ff';ctx.fillRect(x,y,r,r);}ctx.globalAlpha=1;return;}ctx.fillStyle='#4db6d4';ctx.fillRect(a.x,a.y,b.x-a.x,b.y-a.y);
  const p=pat('t_water',300,Math.sin(t/4000)*20,t*0.006%10000);
  if(p){ctx.fillStyle=p;ctx.globalAlpha=.85;ctx.fillRect(a.x,a.y,b.x-a.x,b.y-a.y);ctx.globalAlpha=1;}
  for(const d of WATERDECO){const im=IM[d.k];if(!im)continue;if(d.pier&&!S.pier)continue;if(S.blocks.includes(blockOf(d.g[0],d.g[1])))continue;
    if(!d.pier&&fogBlocks().some(([bx,by])=>bx+','+by===blockOf(d.g[0],d.g[1])))continue;const c=iso(d.g[0],d.g[1]),h=im.height*d.w/im.width,bob=d.k==='d_boat'?Math.sin(t/700)*3:0;
    ctx.save();ctx.translate(c.x,c.y+bob);if(d.k==='d_boat')ctx.rotate(Math.sin(t/900)*.04);ctx.drawImage(im,-d.w/2,-h/2,d.w,h);ctx.restore();}
}
function drawGround(t){
  const M=.8,T=40,bl=blockList().sort((a,b)=>a[0]+a[1]-b[0]-b[1]);
  const regs=bl.map(([bx,by])=>({x:OFF+bx*BS,y:OFF+by*BS,w:BS,h:BS})).sort((a,b)=>(a.x+a.y+a.w)-(b.x+b.y+b.w));
  // fog banks over the sea for neighbouring blocks
  for(const[bx,by]of fogBlocks()){diamond(OFF+bx*BS,OFF+by*BS,BS,BS);ctx.fillStyle=S.world==='planet'?'rgba(120,60,140,.35)':'rgba(236,244,250,.55)';ctx.fill();}
  for(const g of regs){const x0=g.x-M,y0=g.y-M,s=g.w+2*M,r=iso(x0+s,y0),b=iso(x0+s,y0+s),l=iso(x0,y0+s);
    const PL=S.world==='planet';ctx.fillStyle=PL?'#5a2335':'#8b5a34';ctx.beginPath();ctx.moveTo(l.x,l.y);ctx.lineTo(b.x,b.y);ctx.lineTo(b.x,b.y+T);ctx.lineTo(l.x,l.y+T);ctx.fill();
    ctx.fillStyle=PL?'#3e1726':'#6f4524';ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(r.x,r.y);ctx.lineTo(r.x,r.y+T);ctx.lineTo(b.x,b.y+T);ctx.fill();
    ctx.fillStyle=PL?'#7a3550':'#e0b268';ctx.beginPath();ctx.moveTo(l.x,l.y);ctx.lineTo(b.x,b.y);ctx.lineTo(r.x,r.y);ctx.lineTo(r.x,r.y+7);ctx.lineTo(b.x,b.y+7);ctx.lineTo(l.x,l.y+7);ctx.fill();
    diamond(x0,y0,s,s);ctx.fillStyle=PL?'#6b2a40':(pat('t_sand',320)||'#efc274');ctx.fill();}
  for(const g of regs){diamond(g.x-.02,g.y-.02,g.w+.04,g.h+.04);if(S.world==='planet'){ctx.fillStyle='#8a3550';ctx.fill();const pp=pat('t_alien',900);if(pp){ctx.globalAlpha=.45;ctx.fillStyle=pp;ctx.fill();ctx.globalAlpha=1;}}else{ctx.fillStyle=pat('t_grass',230)||'#73b83d';ctx.fill();}}
  {const tn=S.world==='planet'?null:SEASON_TINT[season()];if(tn)for(const g of regs){diamond(g.x,g.y,g.w,g.h);ctx.fillStyle=tn;ctx.fill();}}
  for(const[x,y]of allRoads()){if(!cellUnlocked(x,y))continue;diamond(x,y,1,1);ctx.fillStyle=pat('t_dirt',260)||'#b9875a';ctx.fill();}
  // rails
  const ry=S.world==='planet'?[1,0]:railRange();
  for(let y=ry[0];y<=ry[1];y++){if(!cellUnlocked(RAILX,y))continue;const a=iso(RAILX+.5,y),c=iso(RAILX+.5,y+1);const X=isCrossing(RAILX,y);
    if(X){diamond(RAILX,y,1,1);ctx.fillStyle=pat('t_dirt',200)||'#c9a46a';ctx.fill();ctx.fillStyle='rgba(120,80,40,.35)';for(let k=0;k<5;k++){const p=iso(RAILX+.1+k*.18,y+.08),q=iso(RAILX+.1+k*.18,y+.92),p2=iso(RAILX+.22+k*.18,y+.92),q2=iso(RAILX+.22+k*.18,y+.08);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineTo(p2.x,p2.y);ctx.lineTo(q2.x,q2.y);ctx.fill();}}
    ctx.strokeStyle='#7a4b27';ctx.lineWidth=7;if(!X)for(let k=0;k<4;k++){const p=iso(RAILX+.18,y+(k+.5)/4),q=iso(RAILX+.82,y+(k+.5)/4);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
    ctx.strokeStyle='#8f99a3';ctx.lineWidth=3.5;for(const o of[.3,.7]){const p=iso(RAILX+o,y),q=iso(RAILX+o,y+1);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
    if(X){const down=!!trainAnim,tm=performance.now();for(const[bx,by,side]of[[RAILX-.08,y+.05,-1],[RAILX+1.08,y+.95,1]]){const b=iso(bx,by);
      ctx.fillStyle='#555';ctx.fillRect(b.x-2,b.y-26,4,26);const L=34,ang=down?0:-1.25;ctx.save();ctx.translate(b.x,b.y-22);ctx.rotate(side>0?Math.PI-ang:ang);
      for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#fff':'#e2483d';ctx.fillRect(i*L/5,-2.5,L/5,5);}ctx.restore();
      if(down&&Math.floor(tm/350)%2){ctx.fillStyle='#ff3b30';ctx.beginPath();ctx.arc(b.x,b.y-28,3.5,0,7);ctx.fill();}}}}
  if(place){ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1.5;
    for(const[bx0,by0]of bl){const bx=bx0+OFF/BS,by=by0+OFF/BS;for(let i=0;i<=BS;i++){let a=iso(bx*BS+i,by*BS),b2=iso(bx*BS+i,by*BS+BS);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b2.x,b2.y);ctx.stroke();a=iso(bx*BS,by*BS+i);b2=iso(bx*BS+BS,by*BS+i);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b2.x,b2.y);ctx.stroke();}}}
}
function drawField(e,t){
  const plot=IM.f_plot,ce=iso(e.gx+.5,e.gy+.5);
  if(plot){const w=CW*.98,hh=(w/2)*(plot.height/148);ctx.drawImage(plot,ce.x-w/2,ce.y-hh*(75/152),w,hh);}
  if(!e.crop)return;
  const gr=Math.min(1,(t-e.crop.start)/(e.crop.end-e.crop.start)),ripe=gr>=1;
  const im=IM['c_'+e.crop.c+(gr>=.7?'1':'0')];if(!im)return;
  const sc=gr<.7?.55+.45*(gr/.7):1,w=CW*.92*sc,hh=im.height*w/im.width;
  ctx.save();if(gr>=.7&&!ripe)ctx.filter='hue-rotate(35deg) saturate(.75)';
  const sw=ripe?Math.sin(t/450+e.gx)*0.025:0;ctx.translate(ce.x,ce.y+hh*.18);ctx.transform(1,0,sw,1,0,0);ctx.drawImage(im,-w/2,-hh,w,hh);ctx.restore();
  if(ripe){const k=(Math.sin(t/180+e.gx)+1)/2;ctx.fillStyle='rgba(255,255,255,'+(.4+.6*k)+')';star(ce.x+16,ce.y-44,4+3*k);}
}
function star(x,y,r){ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=i%2?r*.35:r;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}ctx.fill();}
function bounceK(e,t){if(!e.bounce)return 1;const d=(t-e.bounce)/320;if(d>1)return 1;return 1+Math.sin(d*Math.PI)*.06*(1-d);}
function drawSprite(r,k,alpha,flip){ctx.save();ctx.globalAlpha=alpha||1;const cx=flip&&r.ax!=null?r.ax:r.x+r.w/2;ctx.translate(cx,r.y+r.h);ctx.scale((flip?-1:1)*(2-k),k);ctx.drawImage(r.im,r.x-cx,-r.h,r.w,r.h);ctx.restore();}
function drawSmall(key,x,y,w,flip,bob){const im=IM[key];if(!im)return;const h=im.height*w/im.width;ctx.save();ctx.translate(x,y+(bob||0));if(flip)ctx.scale(-1,1);ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();}
function running(e,t){return e.q&&e.q.length&&t<e.q[e.q.length-1].end&&t>=e.q[0].start;}
function curJob(e,t){if(!e.q)return null;return e.q.find(j=>t<j.end)||null;}
function drawBuildingExtras(e,r,t){
  const d=DEF[e.type];
  if(d.pen&&imgOf(e)===d.oldPen){const busy=!!curJob(e,t);
    if(e.type==='cowpen'&&busy&&IM.x_trough)drawSmall('x_trough',r.x+r.w*.62,r.y+r.h*.72,42);
    PEN_SPOTS[d.pen].forEach(([fx,fy],i)=>{const bob=Math.sin(t/600+i*2)*1.2;drawSmall(d.pen,r.x+r.w*fx,r.y+r.h*fy,AN[d.pen].w,Math.floor(t/4000+i)%2===0,bob);});}
  if(d.worker&&curJob(e,t)){const bob=e.type==='smith'?-Math.abs(Math.sin(t/160))*4:Math.sin(t/300)*1.5;
    const x=r.x+r.w*.24,y=r.y+r.h*.97;drawSmall(d.worker,x,y,32,false,bob);
    if(d.worker==='w_milkmaid'&&e.type==='cowpen')drawSmall('x_bucket',x+20,y,18);}
  if(e.type==='station'&&S.train.state==='locked'){drawSmall('x_lock',r.x+r.w*.5,r.y+r.h*.55,34);}
  if(d.kind==='helipad')drawHeli(r,t);
  if(isHarbor(e))drawShip(r,t);
  if(isAirport(e))drawPlane(r,t);
  if(isAirport(e)&&S.plane.state==='away'){const x=r.x+r.w*.5,y=r.y+r.h*.15;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,22,0,7);ctx.fill();drawSmall('i_parcel',x,y+12,26);
    const p=1-(S.plane.back-t)/T_PLANE;e._pl={x,y,p,ms:S.plane.back-t};}
  else e._pl=null;
}
const PUFFS=[];
function smoke(e,t){if((e.type!=='bakery'&&e.type!=='smith')||!curJob(e,t))return;
  if(!e._ps||t-e._ps>420){e._ps=t;const r=rectOf(e);if(r)PUFFS.push({x:r.x+r.w*(e.type==='bakery'?.78:.7),y:r.y+r.h*(e.type==='bakery'?.12:.32),t0:t});}}
function drawPuffs(t){for(let i=PUFFS.length-1;i>=0;i--){const p=PUFFS[i],d=(t-p.t0)/2200;if(d>1){PUFFS.splice(i,1);continue;}
  ctx.fillStyle='rgba(255,255,255,'+(.75*(1-d))+')';ctx.beginPath();ctx.arc(p.x+d*18+Math.sin(d*6)*4,p.y-d*60,7+d*14,0,7);ctx.fill();}}
function bubbleFor(e,t){
  const d=DEF[e.type];
  if(d.kind==='prod'&&e.q&&e.q.length){const done=e.q.filter(j=>t>=j.end);if(done.length)return {icon:'i_'+RECIPES[done[0].r].out,p:1,done:true,n:done.length};
    const j=curJob(e,t);if(j&&t>=j.start)return {icon:'i_'+RECIPES[j.r].out,p:(t-j.start)/(j.end-j.start),done:false,job:j};}
  if(d.kind==='house'){const end=(e.last||0)+d.every*1000;if(t>=end)return {icon:'i_coin',p:1,done:true};}
  return null;
}
function drawBubble(e,t){
  const b=bubbleFor(e,t);e._bub=null;if(!b)return;const r=rectOf(e);if(!r)return;
  const x=r.x+r.w*.52,y=r.y+r.h*.12+(b.done?Math.sin(t/220)*4:0),R=22;
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,R,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(x-7,y+R-3);ctx.lineTo(x,y+R+9);ctx.lineTo(x+7,y+R-3);ctx.fill();
  if(!b.done){ctx.strokeStyle='#f2a21c';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,R-3,-Math.PI/2,-Math.PI/2+b.p*Math.PI*2);ctx.stroke();}
  else{ctx.strokeStyle='#5fc03a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,R-2,0,7);ctx.stroke();}
  const im=IM[b.icon];if(im){const s=30/Math.max(im.width,im.height);ctx.globalAlpha=b.done?1:.8;ctx.drawImage(im,x-im.width*s/2,y-im.height*s/2,im.width*s,im.height*s);ctx.globalAlpha=1;}
  if(b.n>1){ctx.fillStyle='#e2483d';ctx.beginPath();ctx.arc(x+R-2,y-R+4,10,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.font='700 13px Fredoka,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(b.n,x+R-2,y-R+5);}
  e._bub={x,y,R,job:b.job};
}
const FLOATS=[];
function floatText(wx,wy,txt,icon){FLOATS.push({x:wx,y:wy,txt,icon,t0:now()});}
function drawFloats(t){
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='700 24px Fredoka,"Trebuchet MS",sans-serif';
  for(let i=FLOATS.length-1;i>=0;i--){const f=FLOATS[i],d=(t-f.t0)/1300;if(d>1){FLOATS.splice(i,1);continue;}
    const y=f.y-d*50;ctx.globalAlpha=1-d*d;ctx.lineWidth=5;ctx.strokeStyle='rgba(60,35,10,.8)';ctx.strokeText(f.txt,f.x,y);ctx.fillStyle='#fff';ctx.fillText(f.txt,f.x,y);
    const im=f.icon&&IM[f.icon];if(im){const tw=ctx.measureText(f.txt).width,s=30/Math.max(im.width,im.height);ctx.drawImage(im,f.x+tw/2+2,y-im.height*s/2,im.width*s,im.height*s);}}
  ctx.globalAlpha=1;
}
/* clouds over locked blocks */
function cloudsList(){
  const l=[];
  for(const[bx,by]of fogBlocks()){const key=bx+','+by;
    for(let i=0;i<6;i++){const s=(bx+50)*31+(by+50)*17+i,gx=OFF+bx*BS+1+rand(s)*(BS-2),gy=OFF+by*BS+1+rand(s+50)*(BS-2);if(cellUnlocked(Math.floor(gx),Math.floor(gy))||cellUnlocked(Math.floor(gx)+1,Math.floor(gy)+1))continue;l.push({type:'cloud',gx,gy,r:46+rand(s+9)*30,ph:s});}
    if(canUnlock(key))l.push({type:'sign',gx:OFF+bx*BS+BS/2-.5,gy:OFF+by*BS+BS/2-.5,block:key});}
  return l;
}
let CLOUDS=[];
function drawCloud(c,t){
  const p=iso(c.gx,c.gy),dx=Math.sin(t/3000+c.ph)*6,r=c.r;
  for(const[ox,oy,rr]of[[-.6,0,.62],[.55,.05,.66],[0,-.35,.78],[.15,.18,.7]]){
    const x=p.x+dx+ox*r,y=p.y-r*.4+oy*r,R=rr*r;const g=ctx.createRadialGradient(x-R*.3,y-R*.4,R*.1,x,y,R);
    g.addColorStop(0,'#ffffff');g.addColorStop(.7,'#f2f6fa');g.addColorStop(1,'rgba(214,226,238,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,7);ctx.fill();}
}
function questBlock(){const q=curQ();if(!q)return null;const g=q.goals.find(g=>g.t==='block'&&!S.blocks.includes(g.b));return g?g.b:null;}
function focusBlock(key){const[bx,by]=key.split(',').map(Number),p=iso(OFF+bx*BS+BS/2,OFF+by*BS+BS/2);
  const sx=cam.x,sy=cam.y,t0=now();cam.z=Math.min(cam.z,.5);const go=()=>{const k=Math.min(1,(now()-t0)/700),e=1-(1-k)*(1-k);cam.x=sx+(p.x-sx)*e;cam.y=sy+(p.y-sy)*e;if(k<1)requestAnimationFrame(go);};go();
  toast('Bulutlu bölgeye dokunup açabilirsin');}
function drawSign(s,t){const p=iso(s.gx+.5,s.gy+.5);
  if(s.block===questBlock())QARROW={x:p.x,y:p.y};
  drawSmall('x_sign',p.x,p.y+10,70);drawSmall('x_lock',p.x,p.y-58+Math.sin(t/400)*3,36);}
let QARROW=null;
function drawQArrow(t){if(!QARROW)return;const p=QARROW;{const k=(Math.sin(t/260)+1)/2;ctx.save();ctx.strokeStyle=`rgba(255,214,60,${.5+.5*k})`;ctx.lineWidth=6;ctx.beginPath();ctx.ellipse(p.x,p.y+8,70+k*14,35+k*7,0,0,7);ctx.stroke();
    const ay=p.y-150-k*18;ctx.fillStyle='#ffd23a';ctx.strokeStyle='#7a4a00';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(p.x-26,ay);ctx.lineTo(p.x+26,ay);ctx.lineTo(p.x+26,ay+30);ctx.lineTo(p.x+44,ay+30);ctx.lineTo(p.x,ay+70);ctx.lineTo(p.x-44,ay+30);ctx.lineTo(p.x-26,ay+30);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}}
/* animals in pens handled in extras; villagers walk roads */
const VILL=[];
function spawnVillagers(){
  setTimeout(spawnPets,0);VILL.length=0;
  if(S.world==='planet'){const rs=allRoads().filter(p=>cellUnlocked(p[0],p[1]));if(!rs.length)return;const n=Math.min(12,Math.max(4,Math.floor(popTotal()/3)));
    for(let i=0;i<n;i++){const c=rs[Math.floor(rand(i*5+2)*rs.length)],k='fa_'+(1+i%5);VILL.push({type:'villager',k,who:FOLK[i%FOLK.length],cx:c[0]+.5,cy:c[1]+.5,tx:c[0]+.5,ty:c[1]+.5,prev:null,wait:rand(i)*2000});}return;}const kinds=S.era>=2?['w_farmer','w_post','w_shopper','w_kid','w_builder','w_milkmaid','w_crate','w_smith']:['w_farmer','w_crate','w_milkmaid','w_smith','w_farmer','w_crate'];const n=Math.min(16,Math.max(6,Math.floor(popTotal()/3)));
  const rs=allRoads().filter(p=>cellUnlocked(p[0],p[1])&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>isRoad(p[0]+a,p[1]+b))),cnt=DEMO?Math.min(18,8+S.era*3):n;
  for(let i=0;i<cnt;i++){const c=rs[Math.floor(rand(i*5+2)*rs.length)];const pref=S.era>=4?'ft':S.era>=3?'fs':S.era>=2?'fk':'f',fk0=FOLK_IMG[FOLK[i%FOLK.length].n],fk=fk0&&IMG_SRC[fk0.replace(/^f_/,pref+'_')]?fk0.replace(/^f_/,pref+'_'):fk0;
    if(IMG_SRC[fk])loadImg(fk);
    VILL.push({type:'villager',k:IMG_SRC[fk]?fk:kinds[i%kinds.length],who:FOLK[i%FOLK.length],cx:c[0]+.5,cy:c[1]+.5,tx:c[0]+.5,ty:c[1]+.5,prev:null,wait:rand(i)*2000});}
}
let lastT=0;
function stepVillagers(t){
  const dt=Math.min(100,t-(lastT||t));lastT=t;
  for(const v of VILL){
    if(showOn()){v.moving=false;continue;}
    if(v.wait>0){v.wait-=dt;v.moving=false;}
    else{const dx=v.tx-v.cx,dy=v.ty-v.cy,d=Math.hypot(dx,dy),s=.42*dt/1000;
      if(d<=s){v.cx=v.tx;v.cy=v.ty;const fx=Math.floor(v.cx),fy=Math.floor(v.cy);
        let opts=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[fx+a,fy+b]).filter(([x,y])=>canDrive(x,y)&&!(isCrossing(x,y)&&trainAnim));
        if(!opts.length){v.stuck=(v.stuck||0)+1;v.wait=1200;
          if(v.stuck>2||!isRoad(fx,fy)){const rs=allRoads().filter(([x,y])=>cellUnlocked(x,y)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>isRoad(x+a,y+b)&&cellUnlocked(x+a,y+b)));
            if(rs.length){const c=rs[Math.floor(Math.random()*rs.length)];v.cx=v.tx=c[0]+.5;v.cy=v.ty=c[1]+.5;v.prev=null;v.stuck=0;v.fadeIn=now();}}}
        else{v.stuck=0;const np=opts.filter(o=>!v.prev||o[0]!==v.prev[0]||o[1]!==v.prev[1]);if(np.length)opts=np;
        if(Math.random()<.15)v.wait=800+Math.random()*2500;
        const o=opts[Math.floor(Math.random()*opts.length)];v.prev=[fx,fy];v.tx=o[0]+.5;v.ty=o[1]+.5;v.flip=((v.tx-v.cx)-(v.ty-v.cy))<0;}}
      else{v.cx+=dx/d*s;v.cy+=dy/d*s;v.moving=true;v.ph=(v.ph||0)+s*17;}}
    v.gx=v.cx-.25;v.gy=v.cy-.25;
  }
}
function drawWalker(im,x,y,w,ph,flip){
  // stride animation: lower body rows are stretched/squeezed around the legs' centre (no clipping, so no extra leg)
  const iw=im.width,ih=im.height,sc=w/iw,h=ih*sc,top=-h,hip=.62,lc=im._lc||.5;
  const s=ph?Math.cos(2*ph):1,bob=ph?-(1-s)/2*3.2:0,lean=ph?Math.sin(2*ph)*.012:0;
  ctx.save();ctx.translate(x,y+bob);if(flip)ctx.scale(-1,1);ctx.translate((.5-(im._tc||.5))*w,0);
  const hy=Math.floor(ih*hip),cx=(lc-.5)*w,step=Math.max(1,Math.round(1.5/sc));
  for(let yy=hy;yy<ih;yy+=step){const k=(yy-hy)/(ih-hy),f=1+.32*s*k*k*(3-2*k);
    ctx.drawImage(im,0,yy,iw,step,cx+(-w/2-cx)*f,top+yy*sc,w*f,step*sc+.6);}
  ctx.save();ctx.rotate(lean);ctx.drawImage(im,0,0,iw,hy+1,-w/2,top,w,(hy+1)*sc);ctx.restore();
  ctx.restore();
}
/* Türk köylüler: bölge, isim ve tatlı-sert tepkiler */
const FOLK=[
 {n:'Hüsnü',r:'Trakyalı',lines:['Abe ne dürtüyon, işim var!','Akşama ciğer tava, gel abe!','Şöyle bi çiftetelli oynamak lazım şimdi!','Abe bu kasaba Edirne gibi oldu be!','Ayy kuzum, keyfim yerinde bugün!'],annoyed:['Abe yeter, gıdıklanıyom!','Abe bi rahat bırak ya!']},
 {n:'Temel',r:'Karadenizli',lines:['Uşağum, durdurma beni, çay demleniyi!','Ula hamsisiz sofra sofra midur?','Ha bu tren de bizum kemençe gibi hızli!','Daa ne bakaysun? Selam ver da!','Yağmur yağmadan işleri bitirelum!'],annoyed:['Ula yeter, başum döndi!','Dürtme da, horon tepecağum şimdi!']},
 {n:'Efe Mehmet',r:'Egeli',lines:['Gız naapıyon gülüm?','Hee, zeytinyağlıyı yemeden gitme bak!','Boşver efem, keyfine bak gari!','Napcan acele, otur bi çay iç gari.','Ebe gar, ne güzel güneş var bugün!'],annoyed:['Gari yeter, sinirlendirme beni!','Hee hee, anladık, sevdin beni!']},
 {n:'Memo',r:'Doğulu',lines:['Eheey, ne diyisin?','Eheey, ne diyisin? Gel otur bakalım!','Lo kardaş, gel bir çay iç, ayıptır!','Bu soğuk mu? Erzurum’da buna bahar deriz!','Hele bir dur, kahvaltı ettin mi?','Cağ kebabı olmadan iş yürümez lo!','Bu kasaba Van kahvaltısı gibi zengin oldu!'],annoyed:['Lo yeter, dürtme!','Hele hele, gene mi sen?']},
 {n:'Ramazan',r:'Adanalı',lines:['Nörüyon la gobel?','Nörüyon la gobel, gel bi kebap ye!','Ne diyon la!','Bu sıcakta yumurta pişer valla!','Acı biber olmadan yemek yenir mi la?','Adana’da bi kebap yesen aklın gider la!','Gel bi şalgam iç, kendine gel!'],annoyed:['La yeter, sinirlenecem!','Dürtme la, dürtme!']},
 {n:'Hacı Osman',r:'Kayserili',lines:['Hele bi dur, bu işten kâr çıkar mı?','Kayseri’de olsa bu arsayı çoktan satmıştık!','Mantıyı kaşığa kırk tane sığdırmazsan olmaz!','Acele işe şeytan karışır, yavaş!','Pastırma ile yumurta yaptın mı hiç?'],annoyed:['Her dürttüğünde bir lira yazıyom ha!','Bedava değil bu ilgi!']},
 {n:'Fadime',r:'Rizeli',lines:['Çay toplamaya gidiyorum, gelir misun?','Ula bu kasabanın havası güzel ha!','Kuymak yapacağum, aç mısun?'],annoyed:['Ula dürtme beni, düşeceğum!']},
 {n:'Fatoş',r:'Trakyalı',lines:['Abe çiftetelli başlasın, durma!','Kırklareli’nin kızıyım ben, oynamadan durmam!','Abe bu akşam düğün var, gelmeyen küser!'],annoyed:['Abe ayağıma bastın, oyun bozuldu!']},
 {n:'Gülizar',r:'Vanlı',lines:['Eheey, ne diyisin bacım?','Van kahvaltısına gel, otlu peynir var!','Lo bacım, bu elbiseyi annem dikti!','Kahvaltı otuz çeşit olmazsa kahvaltı mı olur?'],annoyed:['Hele dur, elbisem buruşacak!']},
 {n:'Simitçi Cemal',r:'İstanbullu',lines:['Simiiit! Taze simiiit!','Çayın yanına simit şart abi!','Martılara kaptırma ha, sıkı tut!'],annoyed:['Abi tepsi düşecek, yapma!']},
 {n:'Çaycı Ali',r:'Ocakçı',lines:['Nörüyon la gobel, çay söyleyim mi?','Çaylar benden abi!','Tavşan kanı demledim, iç de gör!','Oralet mi alırdın, çay mı?'],annoyed:['Abi bardaklar devrilecek, dur!']},
 {n:'Ayşe Nine',r:'İzmirli',lines:['Boyoz aldın mı bugün, yavrum?','Kordon’da yürüsek şimdi ne güzel olurdu!','Gevrek değil o, simit dersen küserim!'],annoyed:['Yavrum yeter, başım döndü!']}
];
const FOLK_IMG={'Hüsnü':'f_1','Fatoş':'f_2','Temel':'f_3','Fadime':'f_4','Efe Mehmet':'f_5','Ayşe Nine':'f_6','Memo':'f_7','Gülizar':'f_8','Ramazan':'f_9','Hacı Osman':'f_10','Simitçi Cemal':'f_11','Çaycı Ali':'f_12'};
function drawSpeech(t){
  for(const v of VILL){if(!v.react||t-v.react.t0>3400)continue;const r=villRect(v);if(!r)continue;
    const s=w2s(r.x+r.w/2,r.y-6);const a=Math.min(1,(3400-(t-v.react.t0))/300);ctx.globalAlpha=a;
    ctx.font='600 13px Fredoka,"Trebuchet MS",sans-serif';const words=v.react.text.split(' ');const lines=[];let cur='';
    for(const w of words){const tt=cur?cur+' '+w:w;if(ctx.measureText(tt).width>170&&cur){lines.push(cur);cur=w;}else cur=tt;}lines.push(cur);
    const head=v.who.n+' · '+v.who.r;ctx.font='700 11px Fredoka,"Trebuchet MS",sans-serif';
    let bw=ctx.measureText(head).width;ctx.font='600 13px Fredoka,"Trebuchet MS",sans-serif';for(const l of lines)bw=Math.max(bw,ctx.measureText(l).width);bw+=20;
    const bh=24+lines.length*17,bx=Math.max(6,Math.min(W-bw-6,s.x-bw/2)),by=s.y-bh-12;
    ctx.fillStyle='#fffaf0';ctx.strokeStyle='#b7773f';ctx.lineWidth=2;rr(bx,by,bw,bh,12);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(s.x-7,by+bh-1);ctx.lineTo(s.x,by+bh+9);ctx.lineTo(s.x+7,by+bh-1);ctx.fill();
    ctx.fillStyle='#8a6545';ctx.font='700 11px Fredoka,"Trebuchet MS",sans-serif';ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(head,bx+10,by+6);
    ctx.fillStyle='#4a2e17';ctx.font='600 13px Fredoka,"Trebuchet MS",sans-serif';lines.forEach((l,i)=>ctx.fillText(l,bx+10,by+21+i*17));ctx.globalAlpha=1;}
}
function villRect(v){const im=IM[v.k];if(!im)return null;const w=32,h=im.height*w/im.width;
  // köylüler yolun kenarından (kaldırımdan) yürür, araçlarla iç içe geçmez; şerit değişimi yumuşak
  const dx=Math.sign(v.tx-v.cx),dy=Math.sign(v.ty-v.cy);if(dx||dy){v.ox=(v.ox||0)+((dy*.3)-(v.ox||0))*.08;v.oy=(v.oy||0)+((-dx*.3)-(v.oy||0))*.08;}
  const p=iso(v.cx+(v.ox||0),v.cy+(v.oy||0));return {x:p.x-w/2,y:p.y-h+4,w,h,im};}
