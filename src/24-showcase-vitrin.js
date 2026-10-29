/* ================= SHOWCASE (VİTRİN) ================= */
const SHOW={
 1:['cami1','cayocagi','balikci','halkoyun','kebapci','kasap','bakery','cowpen','coop','feedmill','cottage','dairy','house2','sheepfold','mine','smith','creamery','weaving','cottage','house2','cowpen','coop'],
 2:['cami2','townhouse','cafe','kebapci','cayocagi','apart1','jamfactory','school','juicefactory','rowshop','helipad','tailor','pizzeria','post','townhouse','apart1','bakery','cowpen','dairy','harbor','rowshop'],
 3:['cami3','apartment','skyscraper','kebapci','bank','hospital','apron','furniture','electronics','skyscraper','apartment','apart1','cafe','pizzeria','post','school','helipad','harbor','townhouse','skyscraper','apartment'],
 4:['cami4','ecotower','solar','cayocagi','wind','datacenter','charger','maglev','drone','lab','robotfac','skyscraper','ecotower','apartment','solar','wind','hospital','bank','electronics','furniture','helipad','harbor','school','ecotower','wind']};
function buildShowcase(era){
  const t=Date.now(),rr=(i)=>rand(i*7.31+era*13.7);
  const s={coins:[0,5200,48000,560000,9800000][era],xp:0,lvl:[0,8,16,24,35][era],inv:{wheat:40,corn:30,milk:20,egg:20,bread:10,nails:30,plank:20,steel:10,gear:8,shovel:5,axe:5,pickaxe:5},
    cap:999,capLvl:5,nextId:1,orders:[],quest:{i:999,base:{}},st:{harvest:{},made:{},orders:0,trains:0,cleared:0,ships:0,planes:0},era,pier:true,roads:[],
    train:{state:'here',wagons:[],back:0},ship:{state:'locked',crates:[],back:0},plane:{state:'locked',crates:[],back:0},ents:[],blocks:[]};
  const NBk=era>=3?5:4,lo=-4,hi=OFF+(NBk-1)*BS;s.bs=8;for(let bx=-1;bx<NBk-1;bx++)for(let by=-1;by<NBk-1;by++)s.blocks.push(bx+','+by);
  S=s;ROADSET=new Set();
  const add=(type,gx,gy,o)=>{const e=Object.assign({id:S.nextId++,type,gx,gy},o||{});S.ents.push(e);return e;};
  add('hall',12,9,{lv:Math.min(5,era+1)});add('barn',8,9);add('station',15,13);add('farmhouse',6,10,{last:t-200000});add('windmill',8,2);add('lighthouse',2,2);add('ruin',20,8,{lm:'ship'});
  const N2=NBk*BS;
  for(let y=lo;y<hi;y++)for(let x=lo;x<hi;x++){if((x%5===0||y%5===0)&&!occupied(x,y,1))S.roads.push([x,y]);}
  rebuildRoads();
  const used=new Set();let k=0;const L=['cottage','bakery','cayocagi','cami1','cowpen','dairy','coop','sheepfold','feedmill','mine','smith','weaving','kebapci','balikci','jamfactory','post','halkoyun','solar','helipad','cottage','cottage','cottage','cottage'],lvRange=[[1,1],[1,3],[4,7],[8,11],[12,15]][era];
  const mk=(type,x,y)=>{const d=DEF[type];const e=add(type,x,y,{lv:d.looks?lvRange[0]+Math.floor(rr(x*31+y)*(lvRange[1]-lvRange[0]+1)):Math.min(5,era+1)});
    if(d.kind==='prod'&&d.recipes){const rcs=d.recipes.filter(r=>RECIPES[r].lvl<=s.lvl);const r=rcs[Math.floor(rr(x+y*3)*rcs.length)]||d.recipes[0];const T=RECIPES[r].t*1000,st=t-rr(x*5+y)*T*1.3;e.q=[{r,start:st,end:st+T}];}
    if(d.kind==='house')e.last=t-rr(x*9+y)*d.every*1300;if(d.unique)used.add(type);return e;};
  if(era>=3){for(const big of['airport','stadium']){let done=false;for(let y=lo+1;y<hi-3&&!done;y++)for(let x=lo+1;x<hi-3&&!done;x++)if(!occupied(x,y,3)){mk(big,x,y);done=true;}}}
  for(let y=lo;y<hi-1;y++)for(let x=lo;x<hi-1;x++){if(occupied(x,y,2))continue;let type=null;
    for(let tries=0;tries<L.length;tries++){const c=L[k++%L.length];if(DEF[c].unique&&used.has(c))continue;if(!IMG_SRC[DEF[c].img])continue;type=c;break;}if(type)mk(type,x,y);}
  const crops=Object.keys(CROPS).filter(c=>CROPS[c].lvl<=s.lvl);
  for(let y=lo;y<hi;y++)for(let x=lo;x<hi;x++){if(occupied(x,y,1))continue;const r=rr(x*13+y*7);
    if(era>=2&&r<.25)mk(r<.15?'orchard':'beehive',x,y);
    else if(r<.75){const c=crops[Math.floor(rr(x+y*11)*crops.length)],T=CROPS[c].t*1000,st=t-rr(x*3+y*17)*T*1.4;add('field',x,y,{crop:{c,start:st,end:st+T}});}
    else add('deco',x,y,{img:['d_tree','d_pine','d_bush','d_flowers'][Math.floor(r*40)%4]});}
  if(has('harbor'))S.ship={state:'here',crates:genCrates(4),back:0};
  if(has('airport'))S.plane={state:'here',crates:genCrates(6),back:0};
  S.train={state:'here',wagons:genWagons(),back:0};
  while(S.orders.length<orderSlots())S.orders.push(genOrder());
  return S;
}
let demoHeli=null;
function enterDemo(era){
  closeSheet();hideTalk();endPlace();
  if(!DEMO){REAL=S;DEMO=true;}
  buildShowcase(era);trainAnim=null;shipAnim=null;planeAnim=null;
  spawnVillagers();spawnVeh();questUI();hud();
  const b=bounds();cam.x=(b.x0+b.x1)/2;cam.y=(b.y0+b.y1)/2;cam.z=era>=3?.3:.36;
  $('demo').classList.add('on');document.querySelectorAll('#demo [data-era]').forEach(x=>x.classList.toggle('on',+x.dataset.era===era));
  clearInterval(demoHeli);demoHeli=setInterval(()=>{if(DEMO)heliGo();},11000);heliGo();
  toast(ERA_NAME[era]+' vitrini');
}
function exitDemo(){
  if(!DEMO)return;closeSheet();DEMO=false;S=REAL;REAL=null;clearInterval(demoHeli);
  rebuildRoads();trainAnim=null;shipAnim=null;planeAnim=null;spawnVillagers();spawnVeh();questUI();hud();
  const p=iso(12,12);cam.x=p.x;cam.y=p.y;cam.z=.55;$('demo').classList.remove('on');
}
document.querySelectorAll('#demo [data-era]').forEach(b=>b.onclick=()=>enterDemo(+b.dataset.era));
$('demoExit').onclick=exitDemo;
