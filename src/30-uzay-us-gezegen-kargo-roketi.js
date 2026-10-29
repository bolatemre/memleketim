/* ================= UZAY: ÜS, GEZEGEN, KARGO ROKETİ ================= */
// ---- Dünya: Uzay Üssü (4 aşama) ----
DEF.spaceport={name:'Uzay Üssü',size:2,kind:'service',looks:['b_us1','b_us2','b_us3','b_us4'],img:'b_us1',stageLooks:true,maxL:4,unique:true,price:60000,lvl:45,era:4,workers:4,
  desc:'Mekiği hazırla, yıldızlara uç! Sonra kargo roketi buradan kalkar.'};
const SPACE_COST=[null,{coins:80000,items:{steel:30,gear:15}},{coins:120000,items:{gear:25,chip:12}},{coins:180000,items:{chip:25,usta:2}}];
OLDMAP.spaceport4=['spaceport',4];
SHOPF.push('spaceport');
// ---- Gezegen ürünleri ----
Object.assign(RECIPES,{
  water:{out:'water',q:2,inp:{},t:45,xp:3,lvl:1}, oxygen:{out:'oxygen',q:1,inp:{algae:1},t:90,xp:5,lvl:1},
  moonwheat:{out:'moonwheat',q:2,inp:{water:1},t:60,xp:4,lvl:1}, algae:{out:'algae',q:2,inp:{water:1},t:75,xp:4,lvl:1},
  crystal:{out:'crystal',q:1,inp:{},t:180,xp:8,lvl:1}, titanium:{out:'titanium',q:1,inp:{crystal:1},t:240,xp:10,lvl:1},
  fuel:{out:'fuel',q:1,inp:{water:3,crystal:1},t:300,xp:12,lvl:1}, spacemilk:{out:'spacemilk',q:1,inp:{algae:2},t:120,xp:6,lvl:1},
  bluecheese:{out:'bluecheese',q:1,inp:{spacemilk:2},t:240,xp:10,lvl:1}, spacebread:{out:'spacebread',q:1,inp:{moonwheat:3,water:1},t:150,xp:8,lvl:1},
  alienfruit:{out:'alienfruit',q:2,inp:{water:2},t:120,xp:6,lvl:1}, spacehoney:{out:'spacehoney',q:1,inp:{alienfruit:2,algae:1},t:240,xp:10,lvl:1},
  calf:{out:'calf',q:1,inp:{feed:6},t:300,xp:10,lvl:45}});
if(DEF.cowpen&&DEF.cowpen.rl){DEF.cowpen.rl.calf=5;DEF.cowpen.recipes=Object.keys(DEF.cowpen.rl);}
// ---- Gezegen binaları ----
const PB=(o)=>Object.assign({size:2,era:4,workers:2,unique:true,planet:true},o);
Object.assign(DEF,{
  plbase:PB({name:'Komuta Üssü',kind:'hall',img:'b_pl_base',pop:16,workers:0,price:0,lvl:1,desc:'Koloninin kalbi.'}),
  plstore:PB({name:'Kargo Deposu',kind:'barn',img:'b_pl_oxy',workers:0,price:0,lvl:1,desc:'Gezegendeki ürünlerin deposu.'}),
  plair:PB({name:'Hava Temizleyici',kind:'prod',img:'b_pl_air',recipes:['oxygen'],o2:20,unique:false,price:15000,lvl:45,desc:'+20 oksijen. Yosundan oksijen tüpü yapar.'}),
  plfusion:PB({name:'Füzyon Reaktörü',kind:'service',img:'b_pl_fusion',energy:20,price:20000,lvl:45,desc:'Koloniye bol elektrik verir.'}),
  plwater:PB({name:'Su Çıkarıcı',kind:'prod',img:'b_pl_water',recipes:['water'],price:12000,lvl:45,desc:'Yer altından su çeker.'}),
  plshield:PB({name:'Kalkan Jeneratörü',kind:'service',img:'b_pl_shield',shield:25,unique:false,price:25000,lvl:45,desc:'+25 kalkan: meteor ve uzaylı fırtınalarına karşı korur.'}),
  plcrystal:PB({name:'Kristal Madeni',kind:'prod',img:'b_pl_crystal',recipes:['crystal'],workers:3,price:20000,lvl:46,desc:'Enerji kristali çıkarır: Dünya binalarını 16+ seviyeye taşır.'}),
  plrobot:PB({name:'Robot Atölyesi',kind:'prod',img:'b_pl_robot',recipes:['titanium','fuel'],workers:3,price:30000,lvl:47,desc:'Titanyum ve roket yakıtı üretir.'}),
  plhabitat:PB({name:'Yaşam Kubbesi',kind:'service',img:'b_pl_habitat',joy:20,price:40000,lvl:47,needHab:true,desc:'Koloniye nefes alan bir yaşam alanı.'}),
  plpod1:PB({name:'Kapsül Ev',kind:'house',img:'b_pl_pod1',pop:6,coins:60,every:60,unique:false,workers:0,price:8000,lvl:47,needHab:true,desc:'+6 nüfus, kira verir.'}),
  plpod2:PB({name:'Çift Katlı Kapsül',kind:'house',img:'b_pl_pod2',pop:10,coins:110,every:60,unique:false,workers:0,price:16000,lvl:49,needHab:true,desc:'+10 nüfus, yüksek kira.'}),
  plhydro:PB({name:'Hidroponik Sera',kind:'prod',img:'b_pl_hydro',recipes:['moonwheat','algae'],price:18000,lvl:47,needHab:true,desc:'Ay buğdayı ve parlayan yosun yetiştirir.'}),
  plbarn:PB({name:'Uzay Ahırı',kind:'prod',img:'b_pl_barn',recipes:['spacemilk'],price:25000,lvl:48,needHab:true,needCalf:2,desc:'Dünya’dan gelen buzağılarla uzay sütü.'}),
  pldairy:PB({name:'Uzay Mandırası',kind:'prod',img:'b_pl_dairy',recipes:['bluecheese'],price:30000,lvl:49,needHab:true,desc:'Mavi peynir: Dünya’da çok değerli.'}),
  plfood:PB({name:'Yemek Yazıcısı',kind:'prod',img:'b_pl_food',recipes:['spacebread'],price:28000,lvl:49,needHab:true,desc:'Uzay ekmeği basar.'}),
  plorchard:PB({name:'Meyve Kubbesi',kind:'prod',img:'b_pl_orchard',recipes:['alienfruit','spacehoney'],price:32000,lvl:50,needHab:true,desc:'Uzaylı meyvesi ve parlayan bal.'}),
  plmarket:PB({...DEF.market,name:'Uzay Pazarı',img:'b_pl_market',price:20000,lvl:50,needHab:true,planet:true,unique:true,era:4,desc:'Fazla ürünleri sat.'}),
  plgate:PB({name:'Işınlanma Kapısı',kind:'service',img:'b_gate',joy:15,workers:1,price:60000,lvl:55,needHab:true,desc:'+15 mutluluk. Koloninin gururu.'})});
const PSHOPF=['road','panel','plair','plfusion','plwater','plshield','plcrystal','plrobot','plhabitat','plpod1','plpod2','plhydro','plbarn','pldairy','plfood','plorchard','plmarket','plgate'];
Object.assign(OBST,{o_crater:{tool:'shovel',w:.95,n:'Krater'},o_meteor:{tool:'pickaxe',w:.85,n:'Göktaşı'},o_crystal:{tool:'pickaxe',w:.85,n:'Kristal kayalar',gift:{crystal:2}},o_bush:{tool:'axe',w:.8,n:'Uzaylı çalısı'}});
Object.assign(DECO,{o_mushroom:{w:.85},o_flowers:{w:.7},o_pond:{w:.9},b_lander:{w:1.1},b_satcenter:{w:1.3}});
CHAPTERS.push('Bölüm 23 · Yıldızlara Doğru','Gezegen · İniş','Gezegen · Yaşam Alanı','Gezegen · Uzay Çiftliği');
const CH_STARS=CHAPTERS.length-4;
// ---- Dünya hikâyesinin devamı: Seviye 42-50 ----
STORY.push(
 {ch:CH_STARS,who:'p_zeynep',title:'Gökyüzüne bakış',intro:'Fırtına geçti ama Pırıl her gece gökyüzüne bakıyor. "Orada bir yerde yaşanabilir bir gezegen var" diyor. Önce şehrimizi güçlendirelim.',goals:[{t:'level',n:42},{t:'coins',n:30000}],reward:{coins:0,xp:500}},
 {ch:CH_STARS,who:'p_piril',title:'Uzay Üssü',intro:'Hesapları yaptım: bir uzay üssü kurabiliriz! Seviye 45’te inşa menüsünde Uzay Üssü açılır.',goals:[{t:'level',n:45},{t:'build',k:'spaceport',n:1}],reward:{coins:20000,xp:600}},
 {ch:CH_STARS,who:'p_piril',title:'Mekik',intro:'Rampa hazır. Şimdi iskeleyi kur, roketi topla ve mekiği rampaya çıkar: Uzay Üssü’nü 4. aşamaya yükselt.',goals:[{t:'build',k:'spaceport4',n:1}],reward:{coins:30000,xp:800}},
 {ch:CH_STARS,who:'p_zeynep',title:'Fırlat!',intro:'Her şey hazır. Uzay Üssü’ne dokun ve "Fırlat"a bas. Bilinmeyen bir gezegen bizi bekliyor!',goals:[{t:'flag',k:'landed',label:'Mekiği fırlat',img:'b_us4'}],reward:{coins:50000,xp:1000},
  outro:'İnişi başardık! {GEZEGEN} artık bizim. Ama hava solunamaz, gece fırtınalar esiyor. Bir koloni kurmalıyız.'});
// ---- Gezegen hikâyesi ----
const PSTORY=[
 {ch:CH_STARS+1,who:'p_piril',title:'Nefes',intro:'{GEZEGEN}’e hoş geldin! İlk iş hava: bir Hava Temizleyici kur.',goals:[{t:'build',k:'plair',n:1}],reward:{coins:15000,xp:400}},
 {ch:CH_STARS+1,who:'p_zeynep',title:'Enerji',intro:'Makineler elektriksiz çalışmaz. Füzyon Reaktörü kur.',goals:[{t:'build',k:'plfusion',n:1}],reward:{coins:15000,xp:400}},
 {ch:CH_STARS+1,who:'p_piril',title:'Su',intro:'Yer altında su buldum! Su Çıkarıcı kur ve 6 su kapsülü üret.',goals:[{t:'build',k:'plwater',n:1},{t:'made',k:'water',n:6}],reward:{coins:15000,xp:450}},
 {ch:CH_STARS+1,who:'p_zeynep',title:'Kalkan',intro:'Gece meteor yağdı! Kalkan Jeneratörü kur, koloniyi koru.',goals:[{t:'build',k:'plshield',n:1}],reward:{coins:20000,xp:500}},
 {ch:CH_STARS+1,who:'p_piril',title:'İlk kargo',intro:'Dünya’dan malzeme lazım. Kargo roketini Dünya’da doldur ve buraya gönder. (🚀 düğmesi)',goals:[{t:'flag',k:'cargoIn',label:'Dünya’dan kargo al',img:'b_cargorocket'}],reward:{coins:20000,xp:500}},
 {ch:CH_STARS+2,who:'p_zeynep',title:'Yaşam alanı',intro:'Yaşam alanı için 40 oksijen ve 25 kalkan lazım. İkinci bir Hava Temizleyici kur.',goals:[{t:'build',k:'plair',n:2},{t:'flag',k:'habitat',label:'Yaşam alanı oluştur',img:'b_pl_habitat'}],reward:{coins:25000,xp:600}},
 {ch:CH_STARS+2,who:'p_piril',title:'Kubbe',intro:'Yaşam alanı oluştu, artık kurabilirsin! Önce Yaşam Kubbesi.',goals:[{t:'build',k:'plhabitat',n:1}],reward:{coins:25000,xp:600}},
 {ch:CH_STARS+2,who:'p_zeynep',title:'Yeni evler',intro:'Dünya’dan gönüllüler geliyor. 2 Kapsül Ev kur.',goals:[{t:'build',k:'plpod1',n:2}],reward:{coins:25000,xp:600}},
 {ch:CH_STARS+2,who:'p_piril',title:'Sera',intro:'Hidroponik Sera kur ve 10 ay buğdayı yetiştir.',goals:[{t:'build',k:'plhydro',n:1},{t:'made',k:'moonwheat',n:10}],reward:{coins:30000,xp:700}},
 {ch:CH_STARS+2,who:'p_zeynep',title:'Kristal',intro:'Kristal Madeni kur ve 5 enerji kristali çıkar. Dünya’daki binalar bununla 16. seviyeye geçecek!',goals:[{t:'build',k:'plcrystal',n:1},{t:'made',k:'crystal',n:5}],reward:{coins:30000,xp:700}},
 {ch:CH_STARS+2,who:'p_piril',title:'Dünya’ya hediye',intro:'Kristalleri kargo roketiyle Dünya’ya gönder.',goals:[{t:'flag',k:'cargoOut',label:'Dünya’ya kargo gönder',img:'i_crystal'}],reward:{coins:35000,xp:800}},
 {ch:CH_STARS+3,who:'p_zeynep',title:'Uzay ahırı',intro:'Dünya’daki Ahır’da 2 buzağı yetiştir, roketle getir ve Uzay Ahırı kur.',goals:[{t:'build',k:'plbarn',n:1}],reward:{coins:35000,xp:800}},
 {ch:CH_STARS+3,who:'p_piril',title:'Mavi peynir',intro:'Uzay Mandırası kur ve 5 mavi peynir yap.',goals:[{t:'build',k:'pldairy',n:1},{t:'made',k:'bluecheese',n:5}],reward:{coins:40000,xp:900}},
 {ch:CH_STARS+3,who:'p_zeynep',title:'Yemek yazıcısı',intro:'Yemek Yazıcısı kur ve 8 uzay ekmeği bas.',goals:[{t:'build',k:'plfood',n:1},{t:'made',k:'spacebread',n:8}],reward:{coins:40000,xp:900}},
 {ch:CH_STARS+3,who:'p_piril',title:'Pazar kuruluyor',intro:'Koloni büyüdü! Meyve Kubbesi ve Uzay Pazarı kur.',goals:[{t:'build',k:'plorchard',n:1},{t:'build',k:'plmarket',n:1}],reward:{coins:50000,xp:1200},
  outro:'{GEZEGEN} artık nefes alan, üreten, gülen bir dünya. Dünya ile gezegen arasında roketler hiç durmuyor. Hikâye burada bitmiyor, sen devam ettikçe büyüyor!'}];
// ---- Dünyalar ----
const WK=['ents','roads','blocks','bs','inv','cap','capLvl','orders','era','pier','quest','train','ship','plane'];
const SHARED_ITEMS=['axe','shovel','pickaxe','hammer','usta'];
const onPlanet=()=>S&&S.world==='planet';
function freshPlanet(){const t=Date.now();
  return {ents:[{id:S.nextId++,type:'plbase',gx:12,gy:9},{id:S.nextId++,type:'plstore',gx:8,gy:9},{id:S.nextId++,type:'deco',img:'b_lander',gx:14,gy:14},
      {id:S.nextId++,type:'obstacle',img:'o_crater',gx:7,gy:16},{id:S.nextId++,type:'obstacle',img:'o_meteor',gx:15,gy:16},{id:S.nextId++,type:'obstacle',img:'o_crystal',gx:8,gy:7},{id:S.nextId++,type:'obstacle',img:'o_bush',gx:15,gy:7},
      {id:S.nextId++,type:'deco',img:'o_mushroom',gx:6,gy:6},{id:S.nextId++,type:'deco',img:'o_pond',gx:17,gy:10},{id:S.nextId++,type:'deco',img:'o_flowers',gx:9,gy:16}],
    roads:[...Array(9).keys()].map(i=>[7+i,12]).concat([...Array(9).keys()].filter(i=>i!==4).map(i=>[11,8+i])),
    blocks:['0,0','0,1','1,0','1,1'],bs:S.bs,inv:{water:4,algae:2},cap:150,capLvl:0,orders:[],era:4,pier:false,quest:{i:0,base:null},
    train:{state:'locked',wagons:[],back:0},ship:{state:'locked',crates:[],back:0},plane:{state:'locked',crates:[],back:0}};}
function switchWorld(to,silent){if(!S.worlds)S.worlds={};const from=S.world||'earth';if(from===to)return;
  const pack={};for(const k of WK)pack[k]=S[k];const sh={};for(const k of SHARED_ITEMS){sh[k]=S.inv[k]||0;delete S.inv[k];}
  S.worlds[from]=pack;const nx=S.worlds[to]||(to==='planet'?freshPlanet():null);if(!nx)return;delete S.worlds[to];
  for(const k of WK)if(nx[k]!==undefined)S[k]=nx[k];for(const[k,v]of Object.entries(sh))if(v)S.inv[k]=v;
  S.world=to;place=null;closeSheet();rebuildRoads();cityC.v=null;
  const c=iso(12,12);cam.x=c.x;cam.y=c.y;
  while(S.orders.length<orderSlots())S.orders.push(genOrder());
  spawnVillagers();spawnVeh();questUI();hud();save();
  if(!silent)toast(to==='planet'?`🪐 ${S.planetName||'Gezegen'}`:`🌍 ${S.townName||'Dünya'}`);}
const otherWorld=()=>S.worlds&&S.worlds[onPlanet()?'earth':'planet'];
const worldInv=w=>(S.world||'earth')===w?S.inv:(S.worlds&&S.worlds[w]?S.worlds[w].inv:null);
const worldEnts=w=>(S.world||'earth')===w?S.ents:(S.worlds&&S.worlds[w]?S.worlds[w].ents:[]);
// ---- Gezegen kuralları: oksijen, kalkan, yaşam alanı ----
function planetMeters(ents){ents=ents||worldEnts('planet');let o2=0,sh=0,pop=0;
  for(const e of ents){const d=DEF[e.type];if(!d)continue;const m=1+.3*((e.lv||1)-1);if(d.o2)o2+=Math.round(d.o2*m);if(d.shield)sh+=Math.round(d.shield*m);if(d.pop)pop+=Math.round(d.pop*(1+.25*((e.lv||1)-1)));}
  return {o2,sh,need:Math.round(pop*1.5),hab:o2>=40&&sh>=25};}
const habitatOK=()=>!!(S.flags&&S.flags.habitat);
function lockReason(d){if(d.lvl>S.lvl)return 'Seviye '+d.lvl+' gerekir';if(d.needHab&&!habitatOK())return 'Önce yaşam alanı: 40 oksijen + 25 kalkan';
  if(d.needCalf&&have('calf')<d.needCalf)return `Dünya’dan ${d.needCalf} buzağı getir (${have('calf')}/${d.needCalf})`;return '';}
function planetTick(){if(!onPlanet())return;const m=planetMeters(S.ents);S.flags=S.flags||{};
  if(m.hab&&!S.flags.habitat){S.flags.habitat=true;save();talk('p_piril','Yaşam alanı oluştu! Artık Yaşam Kubbesi, evler, sera ve uzay çiftliği kurabilirsin.',[['Harika!',null]]);}}
// ---- Kargo roketi ----
const ROCKET_EARTH=[['plank',4,8],['nails',6,12],['steel',3,6],['bread',3,6],['cheese',2,4],['wheat',8,14],['corn',6,10],['milk',3,6],['gear',2,4]];
const ROCKET_PLANET=[['crystal',2,4,'plcrystal'],['titanium',1,3,'plrobot'],['spacebread',1,3,'plfood'],['bluecheese',1,2,'pldairy'],['spacehoney',1,2,'plorchard'],['alienfruit',2,4,'plorchard'],['moonwheat',4,8,'plhydro']];
function spaceportLv(){const e=worldEnts('earth').find(x=>x.type==='spaceport');return e?(e.lv||1):1;}
function rocketSlots(at){const n=Math.min(6,2+spaceportLv()),out=[];const pe=worldEnts('planet');
  let pool;if(at==='earth'){pool=ROCKET_EARTH.slice();const calves=(worldInv('planet')||{}).calf||0;if(!pe.some(e=>e.type==='plbarn')&&calves<2)pool.unshift(['calf',1,1],['calf',1,1]);}
  else pool=ROCKET_PLANET.filter(p=>pe.some(e=>e.type===p[3]));
  if(at==='planet'&&!pool.length)pool=[['water',3,5]];
  const rnd=pool.filter(p=>p[0]!=='calf');
  for(let i=0;i<n;i++){const p=(i<2&&pool[0][0]==='calf')?pool[i]:rnd[Math.floor(Math.random()*rnd.length)];const q=p[1]+Math.floor(Math.random()*(p[2]-p[1]+1));out.push({k:p[0],q,done:false});}
  return out;}
function rocketInit(){if(!S.rocket)S.rocket={at:'earth',state:'dock',to:null,arrive:0,slots:rocketSlots('earth'),cargo:{},fuel:3,n:0,adUsed:false};}
const flightMs=()=>Math.max(12,20-2*(spaceportLv()-1))*60000;
function rocketStatus(){const R=S.rocket;if(!R)return '';if(R.state==='fly')return `🚀 ${fmt(Math.max(0,R.arrive-now()))}`;return R.at==='earth'?'🚀 Dünya’da':'🚀 Gezegende';}
function rocketTick(){const R=S.rocket;if(!R||R.state!=='fly'||now()<R.arrive)return;
  const inv=worldInv(R.to);let val=0;const list=[];
  for(const[k,q]of Object.entries(R.cargo)){if(inv){inv[k]=(inv[k]||0)+q;}val+=(ITEMS[k]?ITEMS[k].v:20)*q;list.push(q+' '+(ITEMS[k]?ITEMS[k].n.toLocaleLowerCase('tr-TR'):k));}
  const coins=Math.round(val*.6+100);S.coins+=coins;gainXP(20+Math.round(val/20));S.flags=S.flags||{};if(R.to==='planet')S.flags.cargoIn=true;else S.flags.cargoOut=true;
  R.at=R.to;R.state='dock';R.to=null;R.cargo={};R.n++;R.adUsed=false;R.slots=rocketSlots(R.at);sfx.fanfare();
  toast(`🚀 Kargo ${R.at==='earth'?'Dünya’ya':(S.planetName||'gezegene')} ulaştı: ${list.join(', ')||'boş'} · +${coins} altın`);changed();}
function openRocket(){rocketInit();const R=S.rocket;const here=(S.world||'earth')===R.at;
  openSheet('🚀 Kargo Roketi',()=>{let h='';
    if(R.state==='fly'){const left=Math.max(0,R.arrive-now());
      h+=`<p class="sub">Roket ${R.to==='planet'?(S.planetName||'gezegene'):'Dünya’ya'} gidiyor.${R.slow?' Kalkan zayıf olduğu için rotadan saptı (+%50 süre).':''}</p><div class="stat"><span>Varış</span><span>${fmt(left)}</span></div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">${!R.adUsed?'<button class="btn" id="rkAd">🎬 Reklamla hemen vardır</button>':''}<button class="btn alt" id="rkSkip">Hemen vardır · ${skipCost(left)} ${GEM}</button></div>`;}
    else{h+=`<p class="sub">Roket ${R.at==='earth'?'Dünya’da':(S.planetName||'gezegende')}. ${here?'Bölmeleri doldur ve fırlat; her dolu bölme altın ve yıldız getirir.':`Yüklemek için ${R.at==='earth'?'Dünya’ya':'gezegene'} geç.`}</p>
      <div class="stat"><span>Yakıt deposu</span><span>⛽ ${R.fuel}${have('fuel')&&here?` · ambarda ${have('fuel')} yakıt <button class="btn alt" id="rkFuel" style="padding:4px 10px">Yükle</button>`:''}</span></div>`;
      h+=R.slots.map((s,i)=>`<div class="row"><div class="ico">${ic(s.k)}</div><div class="mid"><div class="t">${ITEMS[s.k].n} × ${s.q}</div><div class="d">${s.done?'✅ Yüklendi':`Ambarda: ${have(s.k)}`}</div></div>
        ${s.done?'':`<button class="btn ${here&&have(s.k)>=s.q?'':'alt'}" data-slot="${i}" ${here?'':'disabled'}>Yükle</button>`}</div>`).join('');
      const done=R.slots.filter(s=>s.done).length;
      h+=`<div style="text-align:center;margin-top:10px"><button class="btn" id="rkGo" ${here&&done?'':'disabled'}>🚀 Fırlat (${done}/${R.slots.length})</button></div>`;
      if(R.fuel<=0&&here)h+=`<p class="sub" style="text-align:center">Yakıt bitti: gezegendeki Robot Atölyesi’nde roket yakıtı üret ya da <button class="btn alt" id="rkBuyFuel" style="padding:4px 10px">30 ${GEM} ile 1 yakıt</button> <button class="btn alt" id="rkAdFuel" style="padding:4px 10px">🎬 Reklamla 1 yakıt</button></p>`;}
    $('sBody').innerHTML=h;
    $('sBody').querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{const s=R.slots[+b.dataset.slot];if(have(s.k)<s.q){goProducer(s.k);return;}take({[s.k]:s.q});R.cargo[s.k]=(R.cargo[s.k]||0)+s.q;s.done=true;sfx.pop();save();sheetCtx();});
    if($('rkFuel'))$('rkFuel').onclick=()=>{const n=have('fuel');take({fuel:n});R.fuel+=n;save();sheetCtx();};
    if($('rkBuyFuel'))$('rkBuyFuel').onclick=()=>{if(spendGems(30)){R.fuel++;save();sheetCtx();}};
    if($('rkAdFuel'))$('rkAdFuel').onclick=()=>showRewardedAd(()=>{R.fuel++;save();sheetCtx();});
    if($('rkGo'))$('rkGo').onclick=()=>{if(R.fuel<=0){toast('Yakıt yok');return;}R.fuel--;R.to=R.at==='earth'?'planet':'earth';
      const shOK=planetMeters().sh>=25;R.slow=R.to==='planet'&&!shOK;R.arrive=now()+flightMs()*(R.slow?1.5:1);R.state='fly';sfx.fanfare();save();closeSheet();
      spaceFx(R.to==='planet'?'cargoEarth':'cargoPlanet',()=>toast('🚀 Kargo yolda: '+fmt(R.arrive-now())));};
    if($('rkSkip'))$('rkSkip').onclick=()=>{if(spendGems(skipCost(R.arrive-now()))){R.arrive=now();rocketTick();closeSheet();}};
    if($('rkAd'))$('rkAd').onclick=()=>showRewardedAd(()=>{R.adUsed=true;R.arrive=now();rocketTick();closeSheet();});});}
// ---- Uzay Üssü penceresi ----
function openSpaceport(e){const L=lv(e);openSheet('Uzay Üssü',()=>{const st=['Boş rampa','İskele kuruldu','Roket toplanıyor','Mekik hazır'][L-1];
  let h=`<p class="sub">${DEF.spaceport.desc}</p><div class="stat"><span>Aşama</span><span>${L}/4 · ${st}</span></div>`;
  if(L<4){const c=SPACE_COST[L];h+=`<div class="sec">Sonraki aşama</div><div class="row"><div class="mid"><div class="d">${needHTML(c.items)} <span class="need ${S.coins<c.coins?'miss':''}">${COIN} ${c.coins.toLocaleString('tr-TR')}</span></div></div><button class="btn" id="spUp">Yükselt</button></div>`;}
  else if(!S.flags||!S.flags.landed)h+=`<div style="text-align:center;margin-top:12px"><button class="btn" id="spGo" style="font-size:20px;padding:14px 28px">🚀 Fırlat!</button></div>`;
  else h+=`<p class="sub">Mekik ${S.planetName} yolunda. Kargo roketi buradan kalkıyor.</p><div style="text-align:center"><button class="btn" id="spRk">🚀 Kargo roketi</button></div>`;
  $('sBody').innerHTML=h;
  if($('spUp'))$('spUp').onclick=()=>{const c=SPACE_COST[L];if(S.coins<c.coins||!canTake(c.items)){toast('Malzeme ya da altın eksik');return;}S.coins-=c.coins;take(c.items);e.lv=L+1;e.bounce=now();sfx.fanfare();gainXP(200);changed();sheetCtx();};
  if($('spGo'))$('spGo').onclick=()=>{closeSheet();firstLaunch();};
  if($('spRk'))$('spRk').onclick=()=>openRocket();},[moveBtn(e)]);}
// ---- Sahneler ----
// Sahneler tuval üzerinde çiziliyor: rampa yerinde kalır, roket sarsılıp kalkar, duman bulutları büyür, kapsül yavaşlayarak iner, toz kalkar
function spaceFx(kind,done){const fx=document.getElementById('spaceFx');if(!fx){done&&done();return;}
  for(const k of['b_us2','b_lander'])loadImg(k);
  const cv=document.createElement('canvas'),dpr=Math.min(2,devicePixelRatio||1),Wd=innerWidth,Hd=innerHeight;cv.width=Wd*dpr;cv.height=Hd*dpr;cv.style.cssText='position:absolute;inset:0;width:100%;height:100%';
  fx.innerHTML='';fx.appendChild(cv);fx.className='spacefx on';const c=cv.getContext('2d');c.scale(dpr,dpr);
  const DUR={first:10,cargoEarth:3.6,cargoPlanet:3.6,travel:2.2}[kind]||2;const t0=performance.now();const puffs=[];
  const stars=[...Array(120)].map((_,i)=>({x:Math.random()*Wd,y:Math.random()*Hd,r:Math.random()*1.6+.4,p:Math.random()*6}));
  const img=(k,x,y,w,a)=>{const im=IM[k];if(!im)return 0;const h=im.height*w/im.width;c.globalAlpha=a==null?1:a;c.drawImage(im,x-w/2,y-h,w,h);c.globalAlpha=1;return h;};
  const sky=(day)=>{const g=c.createLinearGradient(0,0,0,Hd);g.addColorStop(0,day>0?`rgb(${143*day+11},${211*day+15},${244*day+46})`:'#0b0f2e');g.addColorStop(1,day>0?`rgb(${220*day+42},${240*day+19},${255*day+64})`:'#2a1340');c.fillStyle=g;c.fillRect(0,0,Wd,Hd);
    if(day<.9){for(const s of stars){c.globalAlpha=(1-day)*(.5+.5*Math.abs(Math.sin(s.p+performance.now()/700)));c.fillStyle='#fff';c.fillRect(s.x,s.y,s.r,s.r);}c.globalAlpha=1;}};
  const ground=(planet,gy)=>{c.fillStyle=planet?'#8a3550':'#6fb83d';c.fillRect(0,gy,Wd,Hd-gy);const p=IM[planet?'t_alien':'t_grass'];if(p){const pt=c.createPattern(p,'repeat');c.globalAlpha=planet?.28:.35;c.fillStyle=pt;c.fillRect(0,gy,Wd,Hd-gy);c.globalAlpha=1;}
    c.fillStyle='rgba(0,0,0,.15)';c.fillRect(0,gy,Wd,6);};
  const puff=(k,x,y,s)=>puffs.push({k,x,y,s,b:performance.now(),vx:(Math.random()-.5)*60,vy:-10-Math.random()*25});
  const drawPuffs=()=>{const n=performance.now();for(let i=puffs.length-1;i>=0;i--){const p=puffs[i],a=(n-p.b)/1000;if(a>1.6){puffs.splice(i,1);continue;}
    const w=p.s*(0.5+a*0.7);img(p.k,p.x+p.vx*a,p.y+p.vy*a+w*.35,w,Math.max(0,.85-a/1.9));}};
  // kalkış: rampa sabit, roket sarsılıp hızlanır
  const liftoff=(t,dur,rk,planet,padKey)=>{const gy=Hd*.78,day=planet?0:Math.max(0,1-t/dur*1.4);sky(day);ground(planet,gy);
    if(padKey&&IM[padKey])img(padKey,Wd/2,gy+Wd*.12,Wd*.62);
    const shake=t<.8?Math.sin(t*90)*2:0,up=t<.6?0:Math.pow(t-.6,2)*Hd*.18,rw=rk==='x_launch'?Wd*.34:Wd*.24,ry=gy-Wd*.02-up;
    if(t<dur*.6&&Math.random()<.22)puff(planet?'x_dust':'x_smoke',Wd/2+(Math.random()-.5)*Wd*.4,gy-4,Wd*(.08+Math.random()*.07));
    drawPuffs();img(rk,Wd/2+shake,ry,rw);};
  const fly=(t,dur)=>{sky(0);const k=t/dur,x=-Wd*.45+(Wd*1.9)*(k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2),y=Hd*.45+Math.sin(k*6)*10;img('x_fly',x,y,Wd*.7);};
  const landing=(t,dur)=>{sky(0);const gy=Hd*.78;ground(true,gy);const land=dur*.72,k=Math.min(1,t/land),ease=1-Math.pow(1-k,3),y=-Hd*.1+(gy+Wd*.02- -Hd*.1)*ease;
    drawPuffs();
    if(k<1){img('x_lander',Wd/2,y+Wd*.28,Wd*.42);if(k>.85&&Math.random()<.35)puff('x_dust',Wd/2+(Math.random()-.5)*Wd*.5,gy-2,Wd*(.07+Math.random()*.06));}
    else{if(!landing.hit){landing.hit=1;for(let i=0;i<6;i++)puff('x_dust',Wd/2+(i-2.5)*Wd*.12,gy+2,Wd*(.09+Math.random()*.05));}const b=Math.max(0,1-(t-land)*4)*Math.sin((t-land)*20)*4;img('b_lander',Wd/2,gy+Wd*.12+b,Wd*.5);}};
  landing.hit=0;
  const frame=()=>{const t=(performance.now()-t0)/1000;c.clearRect(0,0,Wd,Hd);
    if(kind==='first'){if(t<3.2)liftoff(t,3.2,'x_launch',false,'b_us2');else if(t<5.6)fly(t-3.2,2.4);else landing(t-5.6,DUR-5.6);}
    else if(kind==='cargoEarth')liftoff(t,DUR,'x_cargo',false,'b_us2');else if(kind==='cargoPlanet')liftoff(t,DUR,'x_cargo',true,null);else fly(t,DUR);
    if(t<DUR)requestAnimationFrame(frame);else{fx.className='spacefx';fx.innerHTML='';done&&done();}};
  requestAnimationFrame(frame);}
function firstLaunch(){sfx.fanfare();spaceFx('first',()=>askPlanetName());}
function askPlanetName(){const sug=['Yeni Anadolu','Kızılelma','Gökbörü','Umut','Yıldızkent','Ay Yıldız','Turan','Nova'];
  openSheet('Gezegenine bir isim ver',()=>{$('sBody').innerHTML=`<p class="sub">Yeni bir dünya keşfettin! Bundan sonra hikâyede hep bu adla anılacak.</p>
    <div class="row"><input id="pnIn" maxlength="18" placeholder="Örn. Yeni Anadolu" style="flex:1;min-width:0;border-radius:12px;border:2px solid var(--panel-edge);padding:10px;font:inherit;background:var(--chip);color:var(--ink)"><button class="btn" id="pnOk">Kondur!</button></div>
    <div class="sug">${sug.map(s=>`<button class="btn alt" data-s="${s}" style="margin:3px">${s}</button>`).join('')}</div>`;
    $('sBody').querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{$('pnIn').value=b.dataset.s;});
    $('pnOk').onclick=()=>{const v=($('pnIn').value||'').trim();if(v.length<2){toast('En az 2 harf');return;}
      S.planetName=v;S.flags=S.flags||{};S.flags.landed=true;rocketInit();closeSheet();switchWorld('planet',true);questTick&&questTick();
      setTimeout(()=>talk('p_piril',`${v}’e hoş geldin! Burası bambaşka: hava solunamaz, gece fırtınalar esiyor. Önce Hava Temizleyici kur. Dünya’ya dönmek için sol alttaki 🌍 düğmesini kullan.`,[['Başlayalım',null]]),500);};},[]);}
function travel(){if(!S.flags||!S.flags.landed)return;const to=onPlanet()?'earth':'planet';spaceFx('travel',()=>switchWorld(to));}
// ---- HUD ----
function spaceHud(){const landed=S.flags&&S.flags.landed;const tb=document.getElementById('travelBtn');if(tb){tb.style.display=landed?'':'none';tb.textContent=onPlanet()?'🌍':'🪐';}
  const rp=document.getElementById('rocketPill');if(rp){rp.style.display=landed&&S.rocket?'':'none';if(S.rocket)rp.querySelector('span').textContent=rocketStatus();}
  const op=document.getElementById('o2Pill'),sp=document.getElementById('shPill');
  if(op&&sp){const on=onPlanet();op.style.display=sp.style.display=on?'':'none';if(on){const m=planetMeters(S.ents);op.querySelector('span').textContent=`🫧 ${m.o2}/${Math.max(40,m.need)}`;sp.querySelector('span').textContent=`🛡️ ${m.sh}`;op.classList.toggle('low',m.o2<Math.max(40,m.need));sp.classList.toggle('low',m.sh<25);}}}
function openPlanetInfo(){const m=planetMeters(S.ents);openSheet(`🪐 ${S.planetName||'Gezegen'}`,()=>{$('sBody').innerHTML=`<div class="stat"><span>🫧 Oksijen</span><span>${m.o2} / ${Math.max(40,m.need)}</span></div><div class="stat"><span>🛡️ Kalkan</span><span>${m.sh} / 25</span></div>
  <div class="stat"><span>Yaşam alanı</span><span>${habitatOK()?'✅ Oluştu':'⬜ 40 oksijen + 25 kalkan gerekli'}</span></div>
  <p class="sub">Hava Temizleyici oksijen, Kalkan Jeneratörü kalkan verir; seviye yükseldikçe ikisi de artar. Nüfus arttıkça daha fazla oksijen gerekir. Kalkan zayıfsa kargo roketi rotadan sapar.</p>`;});}

