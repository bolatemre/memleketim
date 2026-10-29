/* ================= HIT ================= */
function hit(sx,sy){
  const w=s2w(sx,sy);
  for(const e of S.ents){if(e._bub){const dx=w.x-e._bub.x,dy=w.y-e._bub.y;if(dx*dx+dy*dy<(e._bub.R+6)**2)return {e};}}
  if(shipHit(w))return {ship:true};
  for(const p of PETS){const r=petRect(p);if(r&&w.x>r.x-6&&w.x<r.x+r.w+6&&w.y>r.y-6&&w.y<r.y+r.h+6)return {pet:p};}
  for(const v of VILL.concat(VEH)){const r=v.type==='veh'?vehRect(v):villRect(v);if(r&&w.x>r.x&&w.x<r.x+r.w&&w.y>r.y&&w.y<r.y+r.h)return {e:v};}
  // train
  for(const p of trainParts(now())){const c=iso(RAILX+.5,p.gy+.5);if(Math.abs(w.x-c.x)<40&&w.y<c.y+14&&w.y>c.y-70)return {train:true};}
  const list=S.ents.slice().sort((a,b)=>depth(b)-depth(a));
  for(const e of list){const d=DEF[e.type];
    if(d.kind==='field'){const g=toGrid(w.x,w.y),g2=toGrid(w.x,w.y+20);
      if((g.gx>=e.gx&&g.gx<e.gx+1&&g.gy>=e.gy&&g.gy<e.gy+1)||(e.crop&&g2.gx>=e.gx&&g2.gx<e.gx+1&&g2.gy>=e.gy&&g2.gy<e.gy+1))return {e};continue;}
    if(!cellUnlocked(e.gx,e.gy))continue;
    const r=rectOf(e);if(hitRect(r,w.x,w.y,imgOf(e),e.flip))return {e};
  }
  const g=toGrid(w.x,w.y),gx=Math.floor(g.gx),gy=Math.floor(g.gy);
  if(S.roads.some(p=>p[0]===gx&&p[1]===gy))return {road:[gx,gy]};
  if(!cellUnlocked(gx,gy)&&canUnlock(blockOf(gx,gy)))return {block:blockOf(gx,gy)};
  return null;
}

