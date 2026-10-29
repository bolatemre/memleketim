/* ================= BULMACA: Şekerci · 450 bölüm ================= */
const M3={N:8,maxLv:450,busy:false,g:null,lv:1,candyImg:[],icons:['i_wheat','i_corn','i_carrot','i_egg','i_milk','i_simit']};
const CANDY=[['#ff6b7d','#c4123a'],['#ffb347','#d9620b'],['#ffe55c','#c99a06'],['#76e383','#1f9d3a'],['#62bdff','#1660c9'],['#c98bff','#7a2dc9']];
function m3rng(seed){let s=seed*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280;};}
function m3CandyPath(c,t,R){c.beginPath();
  if(t===0)c.ellipse(0,0,R,R*.72,-.35,0,7);
  else if(t===1){for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;c.lineTo(Math.cos(a)*R,Math.sin(a)*R*.92);}c.closePath();}
  else if(t===2){c.moveTo(0,-R);c.bezierCurveTo(R*.9,-R*.1,R*.9,R*.85,0,R*.9);c.bezierCurveTo(-R*.9,R*.85,-R*.9,-R*.1,0,-R);}
  else if(t===3){const r=R*.35,s=R*.82;c.moveTo(-s+r,-s);c.arcTo(s,-s,s,s,r);c.arcTo(s,s,-s,s,r);c.arcTo(-s,s,-s,-s,r);c.arcTo(-s,-s,s,-s,r);c.closePath();}
  else if(t===4)c.arc(0,0,R*.9,0,7);
  else{for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?R*.55:R;c.lineTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();}}
function m3Candy(c,t,R){const[lt,dk]=CANDY[t];const g=c.createRadialGradient(-R*.35,-R*.4,R*.1,0,0,R*1.1);g.addColorStop(0,'#ffffff');g.addColorStop(.18,lt);g.addColorStop(1,dk);
  c.save();c.shadowColor='rgba(0,0,0,.25)';c.shadowBlur=R*.25;c.shadowOffsetY=R*.12;m3CandyPath(c,t,R);c.fillStyle=g;c.fill();c.restore();
  m3CandyPath(c,t,R);c.lineWidth=Math.max(1.5,R*.08);c.strokeStyle=dk;c.stroke();
  c.save();m3CandyPath(c,t,R);c.clip();c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-R*.3,-R*.42,R*.42,R*.2,-.5,0,7);c.fill();
  if(t===3){c.fillStyle='rgba(255,255,255,.75)';for(let i=0;i<9;i++){c.beginPath();c.arc(Math.sin(i*7)*R*.55,Math.cos(i*5)*R*.55,R*.05,0,7);c.fill();}}c.restore();}
function m3Icons(){for(let t=0;t<6;t++)M3.candyImg[t]=IMG_SRC[M3.icons[t]];
  const cv=document.createElement('canvas');cv.width=cv.height=96;const c=cv.getContext('2d');m3Ice(c,4,4,88,2);M3.iceImg=cv.toDataURL();}
function m3Ice(c,x,y,s,n){c.save();c.fillStyle=n>1?'rgba(120,190,255,.75)':'rgba(170,220,255,.6)';c.beginPath();c.roundRect?c.roundRect(x,y,s,s,s*.18):c.rect(x,y,s,s);c.fill();
  c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=Math.max(1.5,s*.04);c.beginPath();c.moveTo(x+s*.15,y+s*.3);c.lineTo(x+s*.35,y+s*.15);c.moveTo(x+s*.6,y+s*.85);c.lineTo(x+s*.85,y+s*.6);c.stroke();
  if(n>1){c.strokeStyle='rgba(255,255,255,.6)';c.strokeRect(x+s*.12,y+s*.12,s*.76,s*.76);}c.restore();}
const SHAPES=[null,
 (x,y)=>(x<2||x>5)&&(y<2||y>5)?false:true, // köşeler oyuk
 (x,y)=>!((x===3||x===4)&&(y===3||y===4)), // ortada delik
 (x,y)=>Math.abs(x-3.5)+Math.abs(y-3.5)<=5, // elmas
 (x,y)=>!(y===4&&(x===0||x===7))&&!(x===4&&y===0), // kenar oyukları
 (x,y)=>(x>=2&&x<=5)||(y>=2&&y<=5)]; // artı
function m3Level(L){const r=m3rng(L*7919+13);const colors=L<10?4:L<35?5:6;
  let moves=Math.max(15,30-Math.floor(L/22)+Math.floor(r()*5));const boss=L%10===0;if(boss)moves+=3;
  const feats=['collect'];if(L>=6)feats.push('ice');if(L>=12)feats.push('stone');if(L>=18)feats.push('ice');if(L>=45)feats.push('drop');
  const main=feats[L%feats.length];let second=boss&&feats.length>1?feats[(L+1)%feats.length]:null;
  if(!second&&L>=10&&main!=='ice'&&r()<.4)second='ice'; /* buz kırma artık çok daha sık */
  const has=f=>main===f||second===f;
  const goals={};const nG=main==='collect'?(L<6?1:L<30?2:3):(L>40&&r()<.5?1:0);
  const types=[...Array(colors).keys()].sort(()=>r()-.5).slice(0,nG);for(const t of types)goals[t]=Math.min(50,9+Math.floor(L*.13)+Math.floor(r()*6));
  const stones=has('stone')?Math.min(14,2+Math.floor(L/28)+Math.floor(r()*3)):0;if(stones)goals.stone=stones;
  const ice=has('ice')?Math.min(40,(main==='ice'?8:5)+Math.floor(L/9)+Math.floor(r()*6)):0;const ice2=L>=90&&has('ice')?Math.floor(ice*.4):0;if(ice)goals.ice=ice+ice2;
  const drops=has('drop')?Math.min(4,1+Math.floor(L/90)):0;if(drops)goals.drop=drops;
  const shape=L>=60&&r()<.55?1+Math.floor(r()*(SHAPES.length-1)):0;
  if(!Object.keys(goals).length)goals[0]=12;
  return {L,colors,moves,goals,stones,ice,ice2,drops,shape,boss};}
function m3Reward(L){const first=L>(S.m3.best||0);if(!first)return {coins:3,items:{},gems:0,first};
  const it={},pool=['nails','nails','plank','shovel','pickaxe','axe','map'];if(S.lvl>=16)pool.push('steel');
  if(L%5===0)it.usta=1;if(L%10===0||Math.random()<.3){const k=pool[Math.floor(Math.random()*pool.length)];it[k]=(it[k]||0)+(k==='nails'?2:1);}
  return {coins:15+Math.floor(L/3)+(L%10===0?50:0),items:it,gems:L%10===0?3:0,first};}
const m3$=id=>document.getElementById(id);
function openM3(){S.m3=S.m3||{best:0,stars:{}};audioInit();if(!M3.candyImg.length)m3Icons();m3$('m3').classList.add('on');m3Map();}
function closeM3(){m3$('m3').classList.remove('on');M3.run=false;hud();}
function m3Map(){M3.run=false;m3$('m3end').classList.remove('on');m3$('m3play').style.display='none';const m=m3$('m3map');m.style.display='block';
  const cur=Math.min(M3.maxLv,(S.m3.best||0)+1);let h='';
  for(let L=1;L<=M3.maxLv;L++){const st=S.m3.stars[L]||0,lock=L>cur,d=m3Level(L);const tag=d.ice?'🧊':d.drops?'🪙':d.stones?'🪨':'';
    h+=`<button class="lv ${lock?'lock':''} ${L===cur?'cur':''} ${L%10===0?'boss':''}" data-l="${L}" ${lock?'disabled':''}><b>${L}</b><i>${lock?'🔒':'★'.repeat(st)+'☆'.repeat(3-st)}</i>${tag&&!lock?`<u>${tag}</u>`:''}</button>`;}
  m3$('m3lv').innerHTML=h;m3$('m3prog').textContent=`${S.m3.best||0} / ${M3.maxLv} bölüm · Her 5 bölümde Usta Belgesi, her 10’da 💎`;
  m3$('m3lv').querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>m3Start(+b.dataset.l));
  setTimeout(()=>{const c=m3$('m3lv').querySelector('.cur');if(c)c.scrollIntoView({block:'center'});},30);}
let m3id=0;
const m3tile=(t,s)=>({t,s:s||null,id:++m3id,x:0,y:-2,scale:1,dying:0});
const playable=(x,y)=>x>=0&&y>=0&&x<M3.N&&y<M3.N&&M3.mask[y][x];
function m3GoalIcon(k){return k==='stone'?IMG_SRC.o_rocks:k==='ice'?M3.iceImg:k==='drop'?IMG_SRC.i_coin:M3.candyImg[k];}
function m3Start(L){const def=m3Level(L);Object.assign(M3,{adUsed:false,lv:L,def,moves:def.moves,got:{},sel:null,busy:false,score:0,combo:0,parts:[],texts:[],hammer:false,shuffleUsed:false,extraUsed:false,idle:performance.now(),hint:null,shake:0,dropsLeft:def.drops});
  const need=Object.entries(def.goals).reduce((a,[k,b])=>a+(k==='drop'?b*8:b),0);M3.stars=[need*160,need*280,need*420];
  m3$('m3map').style.display='none';m3$('m3play').style.display='flex';m3$('m3end').classList.remove('on');
  const N=M3.N,r=m3rng(L*31+7),sh=SHAPES[def.shape];M3.mask=[...Array(N)].map((_,y)=>[...Array(N)].map((_,x)=>sh?sh(x,y):true));
  M3.ice=[...Array(N)].map(()=>Array(N).fill(0));const g=[...Array(N)].map(()=>Array(N).fill(null));
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!M3.mask[y][x])continue;let t;do{t=Math.floor(Math.random()*def.colors);}while((x>1&&g[y][x-1]&&g[y][x-1].t===t&&g[y][x-2]&&g[y][x-2].t===t)||(y>1&&g[y-1][x]&&g[y-1][x].t===t&&g[y-2][x]&&g[y-2][x].t===t));
    const tl=m3tile(t);tl.x=x;tl.y=y-N-1-Math.random()*.6;g[y][x]=tl;}
  const cells=[];for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(M3.mask[y][x])cells.push([x,y]);
  const lower=cells.filter(([x,y])=>y>=2).sort(()=>r()-.5);
  for(const[x,y]of lower.slice(0,def.stones))g[y][x]={stone:1,id:++m3id,x,y:y-N-1,scale:1,dying:0,t:-9};
  const iceCells=cells.filter(([x,y])=>y>=Math.max(1,N-1-Math.ceil(def.ice/6))).sort(()=>r()-.5).slice(0,def.ice);let i2=def.ice2;
  for(const[x,y]of iceCells){M3.ice[y][x]=i2>0?2:1;if(i2>0)i2--;}
  if(def.drops){const tops=cells.filter(([x,y])=>y===Math.min(...cells.filter(c=>c[0]===x).map(c=>c[1])));for(let i=0;i<Math.min(2,def.drops);i++){const[x,y]=tops[Math.floor(r()*tops.length)];if(g[y][x]&&!g[y][x].stone){g[y][x].drop=true;g[y][x].t=-5;}}M3.dropsLeft=def.drops-g.flat().filter(t=>t&&t.drop).length;}
  M3.g=g;m3Hud();m3Resize();if(!M3.run){M3.run=true;requestAnimationFrame(m3Draw);}
  if(!m3HasMove())m3Shuffle();m3Intro();}
function m3Intro(){const d=M3.def,box=m3$('m3end');const lbl={stone:'kaya kır',ice:'buzu kır',drop:'altını aşağı indir'};
  m3$('m3endTxt').innerHTML=`<h2>Bölüm ${M3.lv}</h2>${d.boss?'<p class="boss">🔥 Büyük bölüm</p>':''}<p class="sub2">Hedef</p><div class="igoals">${Object.entries(d.goals).map(([k,n])=>`<span><img src="${m3GoalIcon(k)}" alt=""><b>${n}</b><small>${lbl[k]||'topla'}</small></span>`).join('')}</div><p class="sub2">${d.moves} hamle</p>`;
  m3$('m3btns').innerHTML='<button class="btn" id="m3go">Oyna</button>';box.classList.add('on');m3$('m3go').onclick=()=>{box.classList.remove('on');M3.idle=performance.now();};}
function m3Hud(){const d=M3.def;m3$('m3title').textContent=`Bölüm ${M3.lv}${d.boss?' · Büyük bölüm':''}`;m3$('m3moves').textContent=M3.moves;
  m3$('m3goals').innerHTML=Object.entries(d.goals).map(([k,n])=>{const have=M3.got[k]||0,ok=have>=n;return `<span class="g ${ok?'ok':''}"><img src="${m3GoalIcon(k)}" alt="">${ok?'✓':Math.max(0,n-have)}</span>`;}).join('');
  m3$('m3score').textContent=M3.score.toLocaleString('tr');const p=Math.min(1,M3.score/M3.stars[2]);m3$('m3sbar').style.width=(p*100)+'%';
  m3$('m3s1').classList.toggle('on',M3.score>=M3.stars[0]);m3$('m3s2').classList.toggle('on',M3.score>=M3.stars[1]);m3$('m3s3').classList.toggle('on',M3.score>=M3.stars[2]);
  m3$('m3s1').style.left=(M3.stars[0]/M3.stars[2]*100)+'%';m3$('m3s2').style.left=(M3.stars[1]/M3.stars[2]*100)+'%';
  m3$('m3ham').classList.toggle('on',M3.hammer);m3$('m3ham').querySelector('small').textContent=have('nails')+' çivi';m3$('m3shf').disabled=M3.shuffleUsed;}
function m3Resize(){const cv=m3$('m3cv'),wrap=m3$('m3board');const sz=Math.min(wrap.clientWidth,wrap.clientHeight,560);const dpr=Math.min(2,devicePixelRatio||1);
  cv.style.width=sz+'px';cv.style.height=sz+'px';cv.width=sz*dpr;cv.height=sz*dpr;M3.sz=sz;M3.dpr=dpr;}
addEventListener('resize',()=>{if(m3$('m3')&&m3$('m3').classList.contains('on')&&M3.g)m3Resize();});
function m3DrawNazar(c,x,y,R){const L=[['#0d2e7a',1],['#ffffff',.72],['#6fc3ff',.5],['#0b0f1a',.24]];for(const[col,f]of L){c.fillStyle=col;c.beginPath();c.arc(x,y,R*f,0,7);c.fill();}
  c.fillStyle='rgba(255,255,255,.8)';c.beginPath();c.arc(x-R*.35,y-R*.4,R*.14,0,7);c.fill();}
function m3Draw(t){if(!M3.run)return;const cv=m3$('m3cv'),c=cv.getContext('2d'),N=M3.N,cs=M3.sz/N;c.setTransform(M3.dpr,0,0,M3.dpr,0,0);c.clearRect(0,0,M3.sz,M3.sz);
  const sk=M3.shake&&t-M3.shake<300?(1-(t-M3.shake)/300)*6:0;if(sk)c.translate((Math.random()-.5)*sk,(Math.random()-.5)*sk);
  const g=M3.g;if(!g)return requestAnimationFrame(m3Draw);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!M3.mask[y][x])continue;c.fillStyle=(x+y)%2?'rgba(60,40,110,.55)':'rgba(80,55,140,.55)';c.beginPath();c.roundRect?c.roundRect(x*cs+1.5,y*cs+1.5,cs-3,cs-3,cs*.16):c.rect(x*cs,y*cs,cs,cs);c.fill();
    if(M3.ice[y][x])m3Ice(c,x*cs+2,y*cs+2,cs-4,M3.ice[y][x]);}
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const tl=g[y][x];if(!tl)continue;tl.x+=(x-tl.x)*.3;const vy=(y-tl.y);tl.y+=vy>0?Math.min(vy,.18+vy*.12):vy*.3;if(Math.abs(tl.x-x)<.01)tl.x=x;if(Math.abs(tl.y-y)<.01)tl.y=y;}
  const all=[];for(const row of g)for(const tl of row)if(tl)all.push(tl);for(const tl of M3.dyingList||[])all.push(tl);
  c.save();c.beginPath();for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(M3.mask[y][x])c.rect(x*cs,y*cs,cs,cs);c.clip();
  for(const tl of all){let sc=tl.scale;if(tl.dying){const d=(t-tl.dying)/200;if(d>=1)continue;sc=1+d*.3;c.globalAlpha=1-d;}
    const cx=(tl.x+.5)*cs,cy=(tl.y+.5)*cs,R=cs*.4*sc;
    const sel=M3.sel&&g[M3.sel[1]]&&g[M3.sel[1]][M3.sel[0]]===tl;
    c.save();c.translate(cx,cy);if(sel){const k=1.1+.05*Math.sin(t/110);c.scale(k,k);}
    if(tl.stone){const im=IM.o_rocks;if(im)c.drawImage(im,-R*1.1,-R,R*2.2,R*2);}
    else if(tl.drop){const im=IM.i_coin;if(im){c.rotate(Math.sin(t/300)*.15);c.drawImage(im,-R,-R,R*2,R*2);}}
    else if(tl.s==='nazar'){m3DrawNazar(c,0,0,R*1.05);c.strokeStyle='rgba(255,255,255,'+(.5+.5*Math.sin(t/200))+')';c.lineWidth=3;c.beginPath();c.arc(0,0,R*1.12,0,7);c.stroke();}
    else{if(tl.s==='bomb'){c.fillStyle='rgba(255,140,40,'+(.35+.25*Math.sin(t/150))+')';c.beginPath();c.arc(0,0,R*1.08,0,7);c.fill();}
      const im=IM[M3.icons[tl.t]];if(im){const s=R*2.1/Math.max(im.width,im.height);c.save();c.shadowColor='rgba(0,0,0,.3)';c.shadowBlur=R*.2;c.shadowOffsetY=R*.1;c.drawImage(im,-im.width*s/2,-im.height*s/2,im.width*s,im.height*s);c.restore();}
      if(tl.s==='h'||tl.s==='v'){c.strokeStyle='rgba(255,255,255,.92)';c.lineWidth=R*.15;c.lineCap='round';for(const o of[-.45,0,.45]){c.beginPath();if(tl.s==='h'){c.moveTo(-R*.85,o*R);c.lineTo(R*.85,o*R);}else{c.moveTo(o*R,-R*.85);c.lineTo(o*R,R*.85);}c.stroke();}}
      if(tl.s==='bomb'){const d=IM.i_davul;if(d)c.drawImage(d,R*.15,R*.15,R*.85,R*.85);}}
    c.restore();c.globalAlpha=1;}
  c.restore();
  if(M3.dyingList)M3.dyingList=M3.dyingList.filter(tl=>t-tl.dying<220);
  for(const f of M3.fx||[]){const d=(t-f.t0)/350;if(d>1)continue;c.globalAlpha=1-d;c.fillStyle='#fff8c8';if(f.row!=null)c.fillRect(0,(f.row+.35)*cs,M3.sz,cs*.3);if(f.col!=null)c.fillRect((f.col+.35)*cs,0,cs*.3,M3.sz);
    if(f.bx!=null){c.beginPath();c.arc((f.bx+.5)*cs,(f.by+.5)*cs,cs*(1+d*1.5),0,7);c.fill();}c.globalAlpha=1;}
  for(const p of M3.parts||[]){const d=(t-p.t0)/650;if(d>1)continue;const px=p.x+p.vx*d*cs,py=p.y+p.vy*d*cs+d*d*cs*.9;c.globalAlpha=1-d;c.fillStyle=p.col;c.beginPath();
    if(p.star){for(let i=0;i<10;i++){const a=i*Math.PI/5,r=i%2?cs*.04:cs*.1;c.lineTo(px+Math.cos(a)*r,py+Math.sin(a)*r);}}else c.arc(px,py,cs*.07*(1-d*.5),0,7);c.fill();}
  c.globalAlpha=1;if(M3.parts)M3.parts=M3.parts.filter(p=>t-p.t0<650);
  for(const p of M3.texts||[]){const d=(t-p.t0)/(p.big?1100:700);if(d>1)continue;const s=p.big?(d<.2?d/.2*1.2:1.2-(d-.2)*.2):1;c.save();c.globalAlpha=d>.7?(1-d)/.3:1;c.translate(p.x,p.y-d*(p.big?20:cs*.8));c.scale(s,s);
    c.font=`800 ${p.big?Math.round(cs*.9):Math.round(cs*.38)}px Fredoka,"Trebuchet MS",sans-serif`;c.textAlign='center';c.textBaseline='middle';c.lineWidth=p.big?8:5;c.strokeStyle=p.big?'#5a1d7a':'rgba(60,30,10,.8)';c.strokeText(p.txt,0,0);
    c.fillStyle=p.big?'#ffd23a':'#fff';c.fillText(p.txt,0,0);c.restore();}
  if(M3.texts)M3.texts=M3.texts.filter(p=>t-p.t0<(p.big?1100:700));
  if(!M3.busy&&!m3$('m3end').classList.contains('on')&&performance.now()-M3.idle>5000){const h=M3.hint||(M3.hint=m3FindMove());if(h){const k=(Math.sin(t/160)+1)/2;c.strokeStyle=`rgba(255,255,255,${.4+.6*k})`;c.lineWidth=4;
    for(const[x,y]of h){c.beginPath();c.arc((x+.5)*cs,(y+.5)*cs,cs*.46,0,7);c.stroke();}}}
  if(M3.hammer){c.strokeStyle='rgba(255,210,58,.9)';c.lineWidth=6;c.strokeRect(3,3,M3.sz-6,M3.sz-6);}
  requestAnimationFrame(m3Draw);}
const m3sleep=ms=>new Promise(r=>setTimeout(r,ms));
const m3col=tl=>tl&&!tl.stone&&!tl.drop&&tl.s!=='nazar'?tl.t:-1;
function m3Runs(g){const N=M3.N,runs=[];
  for(let y=0;y<N;y++){let x=0;while(x<N){const t=m3col(g[y][x]);let e=x+1;while(e<N&&t>=0&&m3col(g[y][e])===t)e++;if(t>=0&&e-x>=3)runs.push({dir:'h',t,cells:[...Array(e-x).keys()].map(i=>[x+i,y])});x=e;}}
  for(let x=0;x<N;x++){let y=0;while(y<N){const t=m3col(g[y][x]);let e=y+1;while(e<N&&t>=0&&m3col(g[e][x])===t)e++;if(t>=0&&e-y>=3)runs.push({dir:'v',t,cells:[...Array(e-y).keys()].map(i=>[x,y+i])});y=e;}}
  return runs;}
function m3Swap(a,b){const g=M3.g,t=g[a[1]][a[0]];g[a[1]][a[0]]=g[b[1]][b[0]];g[b[1]][b[0]]=t;}
function m3FindMove(){const N=M3.N,g=M3.g;for(let y=0;y<N;y++)for(let x=0;x<N;x++){const tl=g[y][x];if(!tl||tl.stone)continue;
  for(const[dx,dy]of[[1,0],[0,1]]){const nx=x+dx,ny=y+dy;if(!playable(nx,ny)||!g[ny][nx]||g[ny][nx].stone)continue;if(tl.s==='nazar'||g[ny][nx].s==='nazar')return[[x,y],[nx,ny]];m3Swap([x,y],[nx,ny]);const ok=m3Runs(g).length>0;m3Swap([x,y],[nx,ny]);if(ok)return[[x,y],[nx,ny]];}}return null;}
const m3HasMove=()=>!!m3FindMove();
function m3Shuffle(){const g=M3.g;let tries=0;do{const pool=[];for(const row of g)for(const tl of row)if(tl&&!tl.stone&&!tl.drop&&!tl.s)pool.push(tl.t);pool.sort(()=>Math.random()-.5);
    let i=0;for(const row of g)for(const tl of row)if(tl&&!tl.stone&&!tl.drop&&!tl.s)tl.t=pool[i++];tries++;}while((m3Runs(g).length||!m3HasMove())&&tries<80);}
async function m3Try(a,b){if(M3.busy||M3.moves<=0)return;if(!playable(...a)||!playable(...b))return;M3.idle=performance.now();M3.hint=null;M3.combo=0;const g=M3.g,A=g[a[1]][a[0]],B=g[b[1]][b[0]];if(!A||!B||A.stone||B.stone)return;
  M3.busy=true;M3.sel=null;m3Swap(a,b);await m3sleep(170);
  if(A.s==='nazar'||B.s==='nazar'){M3.moves--;m3Hud();const clr=new Set();
    if(A.s==='nazar'&&B.s==='nazar'){for(let y=0;y<M3.N;y++)for(let x=0;x<M3.N;x++)if(playable(x,y))clr.add(x+','+y);}
    else{const other=A.s==='nazar'?B:A,naz=A.s==='nazar'?A:B;for(let y=0;y<M3.N;y++)for(let x=0;x<M3.N;x++){const tl=g[y][x];if(tl===naz||(tl&&tl.t===other.t&&other.t>=0)){if(tl!==naz&&other.s&&!tl.s)tl.s=other.s==='bomb'?'bomb':(Math.random()<.5?'h':'v');clr.add(x+','+y);}}}
    sfx.fanfare();M3.shake=performance.now();await m3Clear(clr,new Map());await m3Cascade();M3.busy=false;m3Check();return;}
  const runs=m3Runs(g);if(!runs.length){m3Swap(a,b);if(SND.ctx)tone('square',180,120,.12,.08);await m3sleep(170);M3.busy=false;return;}
  M3.moves--;m3Hud();await m3Resolve(runs,[b,a]);await m3Cascade();M3.busy=false;m3Check();}
async function m3Resolve(runs,origin){const clr=new Set(),make=new Map();const key=([x,y])=>x+','+y;
  for(const h of runs.filter(r=>r.dir==='h'))for(const v of runs.filter(r=>r.dir==='v'&&r.t===h.t)){const inter=h.cells.find(c=>v.cells.some(d=>d[0]===c[0]&&d[1]===c[1]));if(inter){make.set(key(inter),{t:h.t,s:'bomb'});h.used=v.used=true;}}
  for(const r of runs){r.cells.forEach(c=>clr.add(key(c)));if(r.used)continue;
    if(r.cells.length>=4){const o=origin&&origin.find(o=>r.cells.some(c=>c[0]===o[0]&&c[1]===o[1]));const at=o||r.cells[Math.floor(r.cells.length/2)];
      make.set(key(at),r.cells.length>=5?{t:-1,s:'nazar'}:{t:r.t,s:r.dir==='h'?'h':'v'});}}
  await m3Clear(clr,make);}
async function m3Clear(clr,make){const g=M3.g,N=M3.N;const queue=[...clr];const done=new Set();M3.fx=M3.fx||[];
  const hitStone=(x,y)=>{const s=g[y]&&g[y][x];if(s&&s.stone){g[y][x]=null;s.dying=performance.now();M3.dyingList=(M3.dyingList||[]).concat(s);M3.got.stone=(M3.got.stone||0)+1;M3.score+=200;}};
  const crackIce=(x,y)=>{if(M3.ice[y]&&M3.ice[y][x]>0){M3.ice[y][x]--;M3.got.ice=(M3.got.ice||0)+1;M3.score+=100;const cs=M3.sz/N;for(let i=0;i<4;i++){const a=Math.random()*6.28;M3.parts.push({x:(x+.5)*cs,y:(y+.5)*cs,vx:Math.cos(a)*.8,vy:Math.sin(a)*.8-.4,col:'#dff3ff',t0:performance.now()});}}};
  while(queue.length){const k=queue.shift();if(done.has(k))continue;done.add(k);const[x,y]=k.split(',').map(Number);if(!playable(x,y))continue;const tl=g[y][x];if(!tl)continue;
    if(tl.stone){hitStone(x,y);continue;}if(tl.drop)continue;
    for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(!clr.has((x+dx)+','+(y+dy)))hitStone(x+dx,y+dy);
    if(make.has(k)&&!tl.s){const m=make.get(k);tl.t=m.t;tl.s=m.s;tl.scale=1.3;setTimeout(()=>tl.scale=1,220);crackIce(x,y);continue;}
    if(tl.s==='h'){for(let i=0;i<N;i++)queue.push(i+','+y);M3.fx.push({row:y,t0:performance.now()});if(SND.ctx)tone('sawtooth',300,1200,.25,.06);}
    if(tl.s==='v'){for(let i=0;i<N;i++)queue.push(x+','+i);M3.fx.push({col:x,t0:performance.now()});if(SND.ctx)tone('sawtooth',300,1200,.25,.06);}
    if(tl.s==='bomb'){for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)queue.push((x+i)+','+(y+j));M3.fx.push({bx:x,by:y,t0:performance.now()});sfx.thud();M3.shake=performance.now();}
    if(tl.s==='nazar'){const tt=Math.floor(Math.random()*M3.def.colors);for(let j=0;j<N;j++)for(let i=0;i<N;i++)if(g[j][i]&&g[j][i].t===tt)queue.push(i+','+j);}
    if(tl.t>=0)M3.got[tl.t]=(M3.got[tl.t]||0)+1;M3.score+=60*(1+M3.combo)+(tl.s?200:0);crackIce(x,y);
    const cs=M3.sz/N,col=tl.t>=0?CANDY[tl.t][0]:'#fff';for(let i=0;i<6;i++){const a=Math.random()*6.28,v=.6+Math.random()*.9;M3.parts.push({x:(x+.5)*cs,y:(y+.5)*cs,vx:Math.cos(a)*v,vy:Math.sin(a)*v-.6,col,star:i===0,t0:performance.now()});}
    g[y][x]=null;tl.dying=performance.now();M3.dyingList=(M3.dyingList||[]).concat(tl);}
  M3.combo++;if(SND.ctx)tone('sine',420*Math.pow(1.12,Math.min(8,M3.combo)),880*Math.pow(1.12,Math.min(8,M3.combo)),.14,.25);
  const words=['','','Güzel!','Harika!','Süper!','Maşallah!','Bravo!'];if(M3.combo>=2)M3.texts.push({txt:words[Math.min(6,M3.combo)],x:M3.sz/2,y:M3.sz/2,t0:performance.now(),big:true});
  m3Hud();await m3sleep(210);m3Fall();await m3sleep(320);await m3CollectDrops();}
function m3Fall(){const g=M3.g,N=M3.N;for(let x=0;x<N;x++){const col=[];for(let y=0;y<N;y++)if(M3.mask[y][x])col.push(y);if(!col.length)continue;
    const tiles=col.map(y=>g[y][x]).filter(Boolean);for(const y of col)g[y][x]=null;
    let i=col.length-1;for(let k=tiles.length-1;k>=0;k--){g[col[i]][x]=tiles[k];i--;}
    let n=1;for(;i>=0;i--){let tl;if(M3.dropsLeft>0&&Math.random()<.12){tl=m3tile(-5);tl.drop=true;M3.dropsLeft--;}else tl=m3tile(Math.floor(Math.random()*M3.def.colors));tl.x=x;tl.y=col[0]-n;n++;g[col[i]][x]=tl;}}}
async function m3CollectDrops(){let any=false;const g=M3.g,N=M3.N;for(let x=0;x<N;x++){let by=-1;for(let y=N-1;y>=0;y--)if(M3.mask[y][x]){by=y;break;}
    if(by>=0&&g[by][x]&&g[by][x].drop){const tl=g[by][x];g[by][x]=null;tl.dying=performance.now();M3.dyingList=(M3.dyingList||[]).concat(tl);M3.got.drop=(M3.got.drop||0)+1;M3.score+=1000;any=true;sfx.coin();
      const cs=M3.sz/N;M3.texts.push({txt:'+1000',x:(x+.5)*cs,y:(by+.5)*cs,t0:performance.now()});}}
  if(any){m3Hud();await m3sleep(150);m3Fall();await m3sleep(300);}}
async function m3Cascade(){let guard=0;while(guard++<30){const runs=m3Runs(M3.g);if(!runs.length)break;await m3Resolve(runs,null);}if(!m3HasMove()){m3Shuffle();toast('Şekerler karıştırıldı');}}
function m3Done(){return Object.entries(M3.def.goals).every(([k,n])=>(M3.got[k]||0)>=n);}
function m3Check(){if(m3Done())return m3End(true);if(M3.moves<=0)return m3End(false);}
async function m3Bonus(){M3.busy=true;M3.texts.push({txt:'Bonus!',x:M3.sz/2,y:M3.sz/2,t0:performance.now(),big:true});
  while(M3.moves>0){M3.moves--;M3.score+=300;const N=M3.N,x=Math.floor(Math.random()*N),y=Math.floor(Math.random()*N),cs=M3.sz/N;
    M3.texts.push({txt:'+300',x:(x+.5)*cs,y:(y+.5)*cs,t0:performance.now()});if(SND.ctx)tone('triangle',700+Math.random()*500,1400,.1,.15);m3Hud();await m3sleep(110);}
  M3.busy=false;}
async function m3End(win){const L=M3.lv,box=m3$('m3end');if(win&&M3.moves>0)await m3Bonus();
  m3$('m3btns').innerHTML='<button class="btn alt" id="m3toMap">Bölümler</button><button class="btn alt" id="m3retry">Tekrar</button><button class="btn" id="m3next">Sonraki</button>';
  m3$('m3toMap').onclick=()=>m3Map();m3$('m3retry').onclick=()=>m3Start(M3.lv);m3$('m3next').onclick=()=>m3Start(M3.lv+1);
  if(win){const st=M3.score>=M3.stars[2]?3:M3.score>=M3.stars[1]?2:1,rw=m3Reward(L);S.m3.stars[L]=Math.max(S.m3.stars[L]||0,st);if(rw.first)S.m3.best=L;
    S.coins+=rw.coins;S.gems=(S.gems||0)+rw.gems;for(const[k,q]of Object.entries(rw.items))addItem(k,q);changed();sfx.fanfare();
    const its=Object.entries(rw.items).map(([k,q])=>`<span class="rw">${ic(k)} ${q} ${ITEMS[k].n}</span>`).join('')+(rw.gems?`<span class="rw">${GEM} ${rw.gems}</span>`:'');
    m3$('m3endTxt').innerHTML=`<h2>Bölüm ${L} tamam!</h2><div class="stars">${[1,2,3].map(i=>`<span class="st ${i<=st?'on':''}" style="animation-delay:${i*.25}s">★</span>`).join('')}</div><p class="sub2">Puan: ${M3.score.toLocaleString('tr')}</p><p>${COIN} +${rw.coins}${its?'<br>'+its:''}${rw.first?'':'<br><small>Tekrar oynamanın ödülü az olur.</small>'}</p>`;
    m3$('m3next').style.display=L<M3.maxLv?'':'none';}
  else{const left=Object.entries(M3.def.goals).filter(([k,n])=>(M3.got[k]||0)<n).map(([k,n])=>`<span><img src="${m3GoalIcon(k)}" alt=""><b>${n-(M3.got[k]||0)}</b></span>`).join('');
    m3$('m3endTxt').innerHTML=`<h2>Hamlen bitti!</h2><p class="sub2">Az kaldı! Eksikler:</p><div class="igoals">${left}</div>`;m3$('m3next').style.display='none';
    m3$('m3btns').insertAdjacentHTML('afterbegin',(adsAvailable()&&!M3.adUsed?`<button class="btn" id="m3ad">🎬 +5 hamle</button>`:'')+`<button class="btn alt" id="m3gem">+5 hamle · 9 ${GEM}</button>`+(M3.extraUsed?'':`<button class="btn alt" id="m3extra" ${S.coins<100?'disabled':''}>+5 · 100 ${COIN}</button>`));
    const cont=()=>{M3.moves+=5;m3Hud();box.classList.remove('on');M3.idle=performance.now();};
    m3$('m3gem').onclick=()=>{if(!spendGems(9))return;cont();};
    if(m3$('m3ad'))m3$('m3ad').onclick=()=>showRewardedAd(()=>{M3.adUsed=true;cont();});
    if(m3$('m3extra'))m3$('m3extra').onclick=()=>{if(S.coins<100)return;S.coins-=100;changed();M3.extraUsed=true;cont();};}
  box.classList.add('on');}
function m3Cell(ev){const r=m3$('m3cv').getBoundingClientRect(),cs=M3.sz/M3.N;const x=Math.floor((ev.clientX-r.left)/cs),y=Math.floor((ev.clientY-r.top)/cs);return x>=0&&y>=0&&x<M3.N&&y<M3.N?[x,y]:null;}
function m3Bind(){const cv=m3$('m3cv');let start=null,sp=null;
  cv.addEventListener('pointerdown',async ev=>{ev.preventDefault();const c0=m3Cell(ev);
    if(M3.hammer&&c0&&!M3.busy&&playable(...c0)){M3.hammer=false;take({nails:1});changed();M3.busy=true;M3.combo=0;sfx.thud();await m3Clear(new Set([c0[0]+','+c0[1]]),new Map());await m3Cascade();M3.busy=false;m3Hud();m3Check();return;}
    start=c0;sp=[ev.clientX,ev.clientY];});
  cv.addEventListener('pointermove',ev=>{if(!start||!sp)return;const dx=ev.clientX-sp[0],dy=ev.clientY-sp[1],th=M3.sz/M3.N*.35;if(Math.abs(dx)<th&&Math.abs(dy)<th)return;
    const b=Math.abs(dx)>Math.abs(dy)?[start[0]+Math.sign(dx),start[1]]:[start[0],start[1]+Math.sign(dy)];const a=start;start=null;if(playable(...b))m3Try(a,b);});
  cv.addEventListener('pointerup',ev=>{if(!start)return;const c=start;start=null;if(M3.sel&&Math.abs(M3.sel[0]-c[0])+Math.abs(M3.sel[1]-c[1])===1){const a=M3.sel;M3.sel=null;m3Try(a,c);}else M3.sel=c;});
  m3$('m3close').onclick=closeM3;m3$('m3back').onclick=()=>{if(M3.busy)return;m3Map();};
  m3$('m3ham').onclick=()=>{if(M3.busy)return;if(!M3.hammer&&have('nails')<1){toast('Çekiç için 1 çivi gerekir');return;}M3.hammer=!M3.hammer;m3Hud();};
  m3$('m3shf').onclick=async()=>{if(M3.busy||M3.shuffleUsed)return;M3.shuffleUsed=true;M3.busy=true;m3Shuffle();sfx.dice();m3Hud();await m3sleep(300);M3.busy=false;};}

