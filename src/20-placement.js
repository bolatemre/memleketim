/* ================= PLACEMENT ================= */
function findSpot(sz,ig,type){const g=toGrid(cam.x,cam.y);let ax=g.gx-sz/2,ay=g.gy-sz/2;
  // aynı türden binalar (ev evlerin, tarla tarlaların yanına) varsa onların yanına koy
  if(type){const d=DEF[type],same=S.ents.filter(e=>e.type===type||(d.kind==='house'&&DEF[e.type].kind==='house'));
    if(same.length){let best=null,bd=1e9;for(const e of same){const q=(e.gx-ax)**2+(e.gy-ay)**2;if(q<bd){bd=q;best=e;}}ax=best.gx;ay=best.gy;}}
  const field=type==='field',roadAdj=(x,y)=>{for(let i=-1;i<=sz;i++)if(isRoad(x+i,y-1)||isRoad(x+i,y+sz)||isRoad(x-1,y+i)||isRoad(x+sz,y+i))return true;return false;};
  let best=null,bs=1e9;const cx=Math.round(ax),cy=Math.round(ay);
  for(let dx=-14;dx<=14;dx++)for(let dy=-14;dy<=14;dy++){const x=cx+dx,y=cy+dy;if(occupied(x,y,sz,ig))continue;
    let s=Math.hypot(dx,dy);if(!field&&!roadAdj(x,y))s+=4;if(s<bs){bs=s;best=[x,y];}}
  if(best)return best;
  for(let r=0;r<30;r++)for(let dx=-r;dx<=r;dx++)for(let dy=-r;dy<=r;dy++)if(!occupied(cx+dx,cy+dy,sz,ig))return[cx+dx,cy+dy];return[cx,cy];}
function panToCell(gx,gy,sz){const p=iso(gx+sz/2,gy+sz/2),sx=cam.x,sy=cam.y,ty=p.y-20,t0=performance.now();
  const go=()=>{const k=Math.min(1,(performance.now()-t0)/500),q=1-(1-k)*(1-k);cam.x=sx+(p.x-sx)*q;cam.y=sy+(ty-sy)*q;if(k<1)requestAnimationFrame(go);};go();}
function startPlace(type){closeSheet();const sz=DEF[type].size,[gx,gy]=findSpot(sz,null,type);place={type,gx,gy};imgOf({type,gx,gy,lv:1});panToCell(gx,gy,sz);barOn();toast('Yeşil alan uygunsa ✓’ye bas; başka yer için haritaya dokun');}
function startMove(e){if(e.type==='station'){toast('İstasyon raylara bağlı, taşınamaz');return;}place={type:e.type,gx:e.gx,gy:e.gy,move:e,img:e.img};barOn();toast('Yeni yer için haritaya dokun');}
function barOn(){$('placeBar').classList.add('on');$('dock').style.visibility='hidden';hideTalk();}
function endPlace(){place=null;$('placeBar').classList.remove('on');$('dock').style.visibility='';}
$('pNo').onclick=endPlace;
$('pYes').onclick=()=>{if(!place)return;const d=DEF[place.type];
  if(occupied(place.gx,place.gy,d.size,place.move)){toast('Burası dolu, başka yer seç');return;}
  if(place.move){place.move.gx=place.gx;place.move.gy=place.gy;place.move.bounce=now();endPlace();changed();return;}
  const p=priceOf(place.type);if(S.coins<p){toast('Yeterli altın yok');return;}
  if(d.kind==='road'){S.coins-=p;S.roads.push([place.gx,place.gy]);rebuildRoads();sfx.thud();const keep=place.type,cur=[place.gx,place.gy],prev=place.prevCell;
    let dir=prev&&Math.abs(cur[0]-prev[0])+Math.abs(cur[1]-prev[1])===1?[cur[0]-prev[0],cur[1]-prev[1]]:(place.dir||[1,0]);
    let nx=null;for(const c of[dir,[dir[1],dir[0]],[-dir[1],-dir[0]]]){const x=cur[0]+c[0],y=cur[1]+c[1];if(!occupied(x,y,1)){nx=[x,y];dir=c;break;}}
    endPlace();changed();
    // yol modunda kal: sıradaki kare otomatik önerilir, ✗ ile çıkılır
    if(S.coins>=priceOf(keep)){place={type:keep,gx:nx?nx[0]:cur[0],gy:nx?nx[1]:cur[1],prevCell:cur,dir};barOn();if(!nx)toast('Yol burada bitiyor: devam için haritaya dokun, bitirmek için ✗');}
    else toast('Altın bitti, yol yapımı durdu');return;}
  S.coins-=p;const e={id:S.nextId++,type:place.type,gx:place.gx,gy:place.gy};if(d.kind==='house')e.last=now();
  if(d.needCalf)take({calf:d.needCalf});
  S.ents.push(e);e.bounce=now();sfx.thud();const c=centerOf(e);floatText(c.x,c.y-60,'-'+p,'i_coin');gainXP(d.kind==='field'?1:5);endPlace();
  if(e.type==='harbor'&&S.ship.state==='locked')S.ship={state:'here',crates:genCrates(4),back:0};
  if(e.type==='airport'&&S.plane.state==='locked')S.plane={state:'here',crates:genCrates(6),back:0};
  if(d.kind==='helipad')while(S.orders.length<orderSlots())S.orders.push(genOrder());
  questTick();changed();};
$('bM3').onclick=()=>openM3();$('bShop').onclick=openShop;$('bOrders').onclick=openOrders;$('bBarn').onclick=()=>openBarn(null);
$('popPill').onclick=()=>{const h=S.ents.find(e=>e.type==='hall');if(h)openHall(h);};

