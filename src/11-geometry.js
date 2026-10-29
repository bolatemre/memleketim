/* ================= GEOMETRY ================= */
const iso=(gx,gy)=>({x:(gx-gy)*HW,y:(gx+gy)*HH});
const toGrid=(wx,wy)=>({gx:(wy/HH+wx/HW)/2,gy:(wy/HH-wx/HW)/2});
const cv=$('c'),ctx=cv.getContext('2d');
let W=0,H=0,DPR=1;
const cam={x:0,y:768,z:.55};
function resize(){W=innerWidth;H=innerHeight;DPR=Math.min(DPR_CAP,devicePixelRatio||1,Math.sqrt(2.3e6/(W*H)));DPR=Math.max(1,DPR);cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);}
addEventListener('resize',resize);
const s2w=(sx,sy)=>({x:(sx-W/2)/cam.z+cam.x,y:(sy-H/2)/cam.z+cam.y});
const w2s=(wx,wy)=>({x:(wx-cam.x)*cam.z+W/2,y:(wy-cam.y)*cam.z+H/2});
function occupied(gx,gy,size,ignore){
  for(let x=gx;x<gx+size;x++)for(let y=gy;y<gy+size;y++){if(!cellUnlocked(x,y)||isRoad(x,y)||isRail(x,y))return true;}
  return S.ents.some(e=>{if(e===ignore)return false;const s=DEF[e.type].size;return gx<e.gx+s&&gx+size>e.gx&&gy<e.gy+s&&gy+size>e.gy;});
}
function seedBlock(b,initial){
  const[bx,by]=b.split(',').map(Number);let i=(bx*7+by*13+1000)*50,obs=0,dec=0;const i0=i;
  const PL=S.world==='planet';
  if(!PL&&LM_AT[b]&&!S.ents.some(e=>e.lm===LM_AT[b][0])){const[lm,x,y]=LM_AT[b];S.ents.push({id:S.nextId++,type:'ruin',lm,gx:x,gy:y});}
  const wantO=initial?0:4+Math.floor(rand(i)*3),wantD=initial?5:5;
  while((obs<wantO||dec<wantD)&&i<i0+600){i++;
    const x=OFF+bx*BS+Math.floor(rand(i*3+1)*BS),y=OFF+by*BS+Math.floor(rand(i*7+5)*BS);
    if(occupied(x,y,1))continue;
    if(obs<wantO){const ok=PL?['o_crater','o_meteor','o_crystal','o_bush']:Object.keys(OBST).slice(0,4);const k=ok[Math.floor(rand(i+9)*4)];S.ents.push({id:S.nextId++,type:'obstacle',img:k,gx:x,gy:y});obs++;}
    else{const ks=PL?['o_mushroom','o_flowers','o_pond','o_mushroom','o_flowers']:['d_tree','d_pine','d_bush','d_flowers','d_rock','d_tree'];
      if(initial){const edge=x<6||x>17||y<6||y>17;if(!edge)continue;}
      S.ents.push({id:S.nextId++,type:'deco',img:ks[Math.floor(rand(i+3)*ks.length)],gx:x,gy:y});dec++;}
  }
}

const blockOf=(x,y)=>Math.floor((x-OFF)/BS)+','+Math.floor((y-OFF)/BS);
function blockList(){return S.blocks.map(k=>k.split(',').map(Number));}
function fogBlocks(){const set=new Set();for(const[bx,by]of blockList())for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const k=(bx+a)+','+(by+b);if(!S.blocks.includes(k))set.add(k);}return [...set].map(k=>k.split(',').map(Number));}
function bounds(){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;const pts=[];
  for(const[bx,by]of blockList()){const a=OFF+bx*BS,b=OFF+by*BS;pts.push([a,b],[a+BS,b],[a,b+BS],[a+BS,b+BS]);}
  for(const[gx,gy]of pts){const p=iso(gx,gy);x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y);}return {x0,x1,y0,y1};}
