/* ================= SPRITE RECTS ================= */
function rectOf(e){
  const d=DEF[e.type];
  if(e.type==='ruin'){const k=LM[e.lm].img,im=IM[k],g=GEO[k];if(!im||!g)return null;const s=2*CW/g.tw,b=iso(e.gx+2,e.gy+2);
    return {x:b.x-g.ax*s,y:b.y-g.ay*s,w:im.width*s,h:im.height*s,im,ax:b.x};}
  if(e.type==='deco'||e.type==='obstacle'){const im=IM[e.img];if(!im)return null;const f=(e.type==='deco'?DECO:OBST)[e.img].w;
    const w=CW*f,h=im.height*w/im.width,b=iso(e.gx+.5,e.gy+.5);return {x:b.x-w/2,y:b.y+12-h,w,h,im};}
  const key=imgOf(e),im=IM[key];if(!im)return null;
  if(d.free){const w=CW*d.size*d.free.w*(d.size===1?1:.62),h=im.height*w/im.width,b=iso(e.gx+d.size/2,e.gy+d.size/2);
    return {x:b.x-w/2,y:b.y+HH*d.size*d.free.dy-h,w,h,im};}
  const g=GEO[key];if(!g)return null;const s=d.size*CW/g.tw,b=iso(e.gx+d.size,e.gy+d.size);
  return {x:b.x-g.ax*s,y:b.y-g.ay*s,w:im.width*s,h:im.height*s,im,ax:b.x};
}
function hitRect(r,wx,wy,key,flip){if(flip&&r&&r.ax!=null)wx=2*r.ax-wx;
  if(!r||wx<r.x||wy<r.y||wx>r.x+r.w||wy>r.y+r.h)return false;const m=MASK[key];if(!m)return true;
  const px=Math.floor((wx-r.x)/r.w*m.w),py=Math.floor((wy-r.y)/r.h*m.h);return m.a[py*m.w+px]>60;
}

