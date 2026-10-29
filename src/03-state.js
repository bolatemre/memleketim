/* ================= STATE ================= */
const KEY='koyden-sehre-v4';
const GAME_NAME='Köyden Şehre';
let S;
function fresh(){
  const t=Date.now();
  const s={coins:200,xp:0,lvl:1,inv:{wheat:6,axe:1},cap:150,capLvl:0,nextId:1,orders:[],tut:0,quest:{i:0,base:null},st:{harvest:{},made:{},orders:0,trains:0,cleared:0},era:1,pier:false,
    blocks:['0,0','0,1','1,0','1,1'],bs:8,train:{state:'locked',wagons:[],back:0},
    ents:[{type:'hall',gx:12,gy:9},{type:'barn',gx:8,gy:9},{type:'bakery',gx:9,gy:13},{type:'cottage',gx:6,gy:13,last:t},
      {type:'station',gx:15,gy:13},
      {type:'field',gx:13,gy:13},{type:'field',gx:14,gy:13},{type:'field',gx:13,gy:14},{type:'field',gx:14,gy:14},
      {type:'obstacle',img:'o_stump',gx:7,gy:16},{type:'obstacle',img:'o_rocks',gx:15,gy:16},{type:'obstacle',img:'o_thorn',gx:8,gy:7},{type:'obstacle',img:'o_log',gx:15,gy:7},
      {type:'deco',img:'d_scarecrow',gx:12,gy:15},{type:'deco',img:'d_well',gx:13,gy:7},
      {type:'ruin',lm:'farm',gx:6,gy:10}]};
  return s;
}
function load(){
  try{const raw=localStorage.getItem(KEY);if(raw)S=JSON.parse(raw);}catch(e){}
  // eski sürümden (ufuk-adasi-v3) gelen kaydı yeni bina ailelerine taşı; ilerleme kaybolmasın
  if(!S||!S.ents){try{const old=localStorage.getItem('ufuk-adasi-v3');if(old){S=migrateV3(JSON.parse(old));localStorage.setItem('ufuk-adasi-v3-yedek',old);}}catch(e){console.warn('taşıma',e);}}
  const isNew=!S||!S.ents;
  if(isNew)S=fresh();
  if(S.gems===undefined)S.gems=25;
  S.ents.forEach(e=>{if(!e.id)e.id=S.nextId++;});
  if(isNew){
    for(const b of S.blocks)seedBlock(b,true);
    for(let i=0;i<40;i++){const x=RING.x0+Math.floor(rand(i*3+7)*16),y=RING.y0+Math.floor(rand(i*5+11)*16);if((x>=6&&x<18&&y>=6&&y<18)||occupied(x,y,1))continue;
      S.ents.push({id:S.nextId++,type:rand(i)<.3?'obstacle':'deco',img:rand(i)<.3?['o_stump','o_rocks','o_thorn','o_log'][i%4]:['d_tree','d_pine','d_bush','d_flowers'][i%4],gx:x,gy:y});}
  }
  if(S.bs!==8){const old=S.blocks.slice(),oldU=(x,y)=>(x>=4&&x<20&&y>=4&&y<20)||old.includes(Math.floor(x/6)+','+Math.floor(y/6));
    const nb=new Set(['0,0','0,1','1,0','1,1']);for(let bx=-3;bx<=6;bx++)for(let by=-3;by<=6;by++)if(oldU(OFF+bx*BS+4,OFF+by*BS+4))nb.add(bx+','+by);
    for(const e of S.ents)nb.add(blockOf(e.gx,e.gy));S.blocks=[...nb];S.bs=8;}
  S.roads=S.roads||[];while(S.orders.length<orderSlots())S.orders.push(genOrder());S.st.ships=S.st.ships||0;S.st.planes=S.st.planes||0;S.era=S.era||1;
  S.ship=S.ship||{state:'locked',crates:[],back:0};S.plane=S.plane||{state:'locked',crates:[],back:0};
  rebuildRoads();
  if(!S.quest.base)startQuest(false);
}
let DEMO=false,REAL=null;
function save(){if(DEMO)return;clearTimeout(save.t);try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function saveSoon(){clearTimeout(save.t);save.t=setTimeout(save,400);}
document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});addEventListener('pagehide',()=>save());

