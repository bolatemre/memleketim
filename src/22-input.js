/* ================= INPUT ================= */
const ptrs=new Map();let drag=null,pinch=null,moved=false;
let lp=null,dragMove=false;
const MOVABLE=['field','house','prod','barn','hall','market','deco'];
function cancelLP(){if(lp){clearTimeout(lp);lp=null;}}
cv.addEventListener('pointerdown',ev=>{cv.setPointerCapture(ev.pointerId);ptrs.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});
  if(ptrs.size===1){drag={sx:ev.clientX,sy:ev.clientY,cx:cam.x,cy:cam.y};moved=false;
    if(!place){const h=hit(ev.clientX,ev.clientY);if(h&&h.e&&S.ents.includes(h.e)&&MOVABLE.includes(DEF[h.e.type].kind)){const e=h.e;
      lp=setTimeout(()=>{lp=null;dragMove=true;moved=true;closeSheet();hideTalk();place={type:e.type,gx:e.gx,gy:e.gy,move:e,img:e.img,drag:true};
        try{navigator.vibrate&&navigator.vibrate(25);}catch(_){}toast('Sürükle ve bırak');},420);}}}
  else cancelLP();
  if(ptrs.size===2){const[a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),z:cam.z};moved=true;}});
cv.addEventListener('pointermove',ev=>{if(!ptrs.has(ev.pointerId))return;ptrs.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});
  if(pinch&&ptrs.size>=2){const[a,b]=[...ptrs.values()];cam.z=clampZ(pinch.z*Math.hypot(a.x-b.x,a.y-b.y)/pinch.d);return;}
  if(dragMove&&place){const w=s2w(ev.clientX,ev.clientY-30),g=toGrid(w.x,w.y),sz=DEF[place.type].size;place.gx=Math.floor(g.gx-(sz-1)/2);place.gy=Math.floor(g.gy-(sz-1)/2);edgePan(ev.clientX,ev.clientY);return;}
  if(drag){const dx=ev.clientX-drag.sx,dy=ev.clientY-drag.sy;if(Math.abs(dx)+Math.abs(dy)>8){moved=true;cancelLP();}if(moved){cam.x=drag.cx-dx/cam.z;cam.y=drag.cy-dy/cam.z;clampCam();}}});
function edgePan(x,y){const m=50,sp=6/cam.z;if(x<m)cam.x-=sp;if(x>W-m)cam.x+=sp;if(y<m+60)cam.y-=sp;if(y>H-m-80)cam.y+=sp;}
function up(ev){if(!ptrs.has(ev.pointerId))return;ptrs.delete(ev.pointerId);if(ptrs.size<2)pinch=null;cancelLP();
  if(dragMove){dragMove=false;const p=place;if(p){if(!occupied(p.gx,p.gy,DEF[p.type].size,p.move)){p.move.gx=p.gx;p.move.gy=p.gy;p.move.bounce=now();changed();}else toast('Oraya sığmıyor');}place=null;drag=null;return;}
  if(ptrs.size===0){if(!moved)onTap(ev.clientX,ev.clientY);drag=null;}
  else if(ptrs.size===1){const p=[...ptrs.values()][0];drag={sx:p.x,sy:p.y,cx:cam.x,cy:cam.y};}}
cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('wheel',ev=>{ev.preventDefault();cam.z=clampZ(cam.z*(ev.deltaY<0?1.1:.9));},{passive:false});
const clampZ=z=>Math.max(.28,Math.min(1.5*Math.max(1,Math.min(1.7,Math.min(W,H)/420)),z));
function clampCam(){const b=bounds();cam.x=Math.max(b.x0-200,Math.min(b.x1+200,cam.x));cam.y=Math.max(b.y0-200,Math.min(b.y1+200,cam.y));}
function onTap(sx,sy){
  if(place){const w=s2w(sx,sy),g=toGrid(w.x,w.y),sz=DEF[place.type].size;
    place.gx=Math.floor(g.gx-(sz-1)/2);place.gy=Math.floor(g.gy-(sz-1)/2);return;}
  const h=hit(sx,sy);if(!h)return;
  if(h.train){openTrain();return;}
  if(h.ship){openShip();return;}
  if(h.pet){const p=h.pet,r=petRect(p);p.love=now();p.wait=2500;const s=PET_INFO[p.k].say;if(r)floatText(r.x+r.w/2+(cam.x-cam.x),r.y-4,s[Math.floor(Math.random()*s.length)]);sfx.blip();return;}
  if(h.road){openRoad(h.road[0],h.road[1]);return;}
  if(h.block){openExpand(h.block);return;}
  if(h.e)tapEnt(h.e);
}

