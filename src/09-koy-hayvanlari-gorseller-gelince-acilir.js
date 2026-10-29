/* ================= KÖY HAYVANLARI (görseller gelince açılır) ================= */
const PETS=[];
const PET_INFO={a_cat:{w:30,sp:.32,say:['Miyav!','Mırrr…','Miyaaav!']},a_dog:{w:36,sp:.4,say:['Hav hav!','Hav!','Vuf!']},a_stork:{w:46,say:['Lak lak!','Lak lak lak!']},
  a_alien1:{w:30,sp:.3,say:['Blip!','Glup glup!','Merhaba dünyalı!']},a_alien2:{w:28,sp:.36,say:['Zıp!','Vıııı!','Bip bop!']},a_robot:{w:30,sp:.45,say:['Görev alındı!','Bip! Oksijen normal.','Pırıl burada!']}};
function spawnPets(){PETS.length=0;if(DEMO&&false)return;const cells=[];for(const[x,y]of allRoads())if(cellUnlocked(x,y))cells.push([x,y]);if(!cells.length)return;
  const add=(k,n)=>{if(!IMG_SRC[k])return;for(let i=0;i<n;i++){const c=cells[Math.floor(Math.random()*cells.length)];PETS.push({type:'pet',k,cx:c[0]+.5,cy:c[1]+.5,tx:c[0]+.5,ty:c[1]+.5,wait:Math.random()*3000});}};
  if(S.world==='planet'){add('a_alien1',2);add('a_alien2',1);add('a_robot',1);return;}
  add('a_cat',2);add('a_dog',1);
  if(IMG_SRC.a_stork){for(const e of S.ents.filter(e=>['hall','cami1','farmhouse','cottage'].includes(e.type)).slice(0,2))PETS.push({type:'pet',k:'a_stork',on:e,gx:e.gx,gy:e.gy,cx:e.gx+1,cy:e.gy+1});}}
function stepPets(t){const dt=Math.min(100,t-(stepPets.l||t));stepPets.l=t;
  for(const p of PETS){if(p.on){p.gx=p.on.gx;p.gy=p.on.gy+.6;continue;}
    if(p.wait>0){p.wait-=dt;p.moving=false;}else{const dx=p.tx-p.cx,dy=p.ty-p.cy,d=Math.hypot(dx,dy),s=PET_INFO[p.k].sp*dt/1000;
      if(d<=s){p.cx=p.tx;p.cy=p.ty;p.wait=1500+Math.random()*5000;const fx=Math.floor(p.cx),fy=Math.floor(p.cy);
        const o=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1]].map(([a,b])=>[fx+a,fy+b]).filter(([x,y])=>cellUnlocked(x,y)&&(isRoad(x,y)||!occupied(x,y,1)));
        if(o.length){const c=o[Math.floor(Math.random()*o.length)];p.tx=c[0]+.3+Math.random()*.4;p.ty=c[1]+.3+Math.random()*.4;p.flip=((p.tx-p.cx)-(p.ty-p.cy))<0;}}
      else{p.cx+=dx/d*s;p.cy+=dy/d*s;p.moving=true;p.ph=(p.ph||0)+s*30;}}
    p.gx=p.cx-.25;p.gy=p.cy-.25;}}
function petRect(p){const im=IM[p.k];if(!im)return null;const w=PET_INFO[p.k].w,h=im.height*w/im.width;
  if(p.on){const r=rectOf(p.on);if(!r)return null;return {x:r.x+r.w*.42-w/2,y:r.y+r.h*.08-h*.55,w,h,im};}
  const q=iso(p.cx,p.cy);return {x:q.x-w/2,y:q.y-h+4,w,h,im};}
function drawPet(p,t){const r=petRect(p);if(!r)return;const hop=p.moving?-Math.abs(Math.sin(p.ph||0))*2:0,bob=p.on?Math.sin(t/700)*1.5:0;
  ctx.save();if(!p.on){ctx.fillStyle='rgba(30,40,10,.2)';ctx.beginPath();ctx.ellipse(r.x+r.w/2,r.y+r.h-2,r.w*.32,r.w*.1,0,0,7);ctx.fill();}
  ctx.translate(r.x+r.w/2,r.y+r.h+hop+bob);if(p.flip)ctx.scale(-1,1);ctx.drawImage(r.im,-r.w/2,-r.h,r.w,r.h);ctx.restore();
  if(p.love&&t-p.love<1400){const d=(t-p.love)/1400;ctx.globalAlpha=1-d;ctx.font='18px "Apple Color Emoji","Segoe UI Emoji",sans-serif';ctx.textAlign='center';ctx.fillText('❤️',r.x+r.w/2,r.y-6-d*30);ctx.globalAlpha=1;}}

