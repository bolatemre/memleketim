/* ================= BİNA AİLELERİ: her bina 15 seviyede köyden teknolojiye evrilir ================= */
const FAM={
 cottage:{name:'Ev',looks:['cottage','house2','townhouse','apart1','apartment','skyscraper','ecotower'],pop:5,lvl:1,price:120,desc:'Nüfus ve kira. Kerpiç evden yeşil kuleye.'},
 hall:{name:'Belediye',looks:['b_townhall','b_bank'],pop:4,desc:'Köyün kalbi.'},
 bakery:{name:'Fırın',looks:['b_firin1','b_firin2','b_firin3','b_firin4','b_firin5','b_firin6','b_firin7','b_firin8','b_firin9'],rl:{bread:1,simit:1,cookie:3,cake:6,pizza:9},lvl:1,price:300,desc:'Tandırdan robotik fırına.'},
 cayocagi:{name:'Çay Ocağı',looks:['b_cayocagi','b_kahvehane','b_cafe'],rl:{cay:1,oralet:1,coffee:5},lvl:2,price:150,joy:4,desc:'Çay, oralet, kahve. Tavla burada.'},
 cami1:{name:'Cami',looks:['b_cami1','b_cami2','b_cami3','b_cami4'],lvl:2,price:500,desc:'Mutluluk ve ezan. Mescitten modern camiye.'},
 cowpen:{name:'Ahır',looks:['b_cowpen'],rl:{milk:1},lvl:2,price:250},
 feedmill:{name:'Değirmen',looks:['b_feedmill','l_mill1'],rl:{cowfeed:1,chickfeed:2,plank:4},lvl:2,price:200,desc:'Hayvan yemi ve kereste.'},
 coop:{name:'Kümes',looks:['b_coop'],rl:{egg:1},lvl:3,price:300},
 dairy:{name:'Mandıra',looks:['dairy','b_creamery'],rl:{ayran:1,cream:3,butter:6,cheese:8},lvl:3,price:400,desc:'Ayran, krema, tereyağı, peynir.'},
 balikci:{name:'Balıkçı',looks:['b_balikci','b_harbor'],rl:{hamsi:1,levrek:2,balikekmek:4,fish:5},lvl:3,price:250,desc:'Balıklar; seviye 7’de liman olur, gemi seferleri başlar.'},
 halkoyun:{name:'Meydan',looks:['b_halkoyun'],lvl:4,price:800,desc:'Halk oyunları ve kültür: mutluluk.'},
 kebapci:{name:'Kebapçı',looks:['b_kasap','b_kebapci','b_pizza'],rl:{meat:1,adana:2,urfa:2,cigkofte:2,lahmacun:4,ciger:4,beyti:6,iskender:7,kunefe:9},lvl:4,price:600,desc:'Etten künefeye 9 lezzet.'},
 mine:{name:'Maden',looks:['b_mine'],rl:{ore:1},lvl:4,price:600},
 smith:{name:'Demirci',looks:['b_smith','b_furniture','b_electronics','b_robotfac'],rl:{nails:1,shovel:2,axe:4,pickaxe:5,steel:7,gear:8,chair:9,sofa:10,copper:10,bulb:11,chip:11,battery:12,phone:13,laptop:14,robot:15},lvl:4,price:600,desc:'Örsten robot fabrikasına.'},
 sheepfold:{name:'Ağıl',looks:['b_sheepfold'],rl:{wool:1},lvl:5,price:500},
 post:{name:'Çarşı',looks:['b_rowshop','b_post'],rl:{notebook:1,letter:3,parcel:5,perfume:7,giftbox:9},lvl:5,price:700,desc:'Defter, mektup, koli, parfüm, hediye.'},
 weaving:{name:'Dokuma',looks:['b_weaving','b_tailor'],rl:{fabric:1,sweater:3,dress:6,jeans:8},lvl:6,price:800,desc:'Kumaştan kot pantolona.'},
 jamfactory:{name:'Konserve Atölyesi',looks:['b_jam','b_juice'],rl:{jam:1,juice:3},lvl:6,price:700,desc:'Reçel ve meyve suyu.'},
 solar:{name:'Enerji',looks:['b_charger','b_solar','b_wind','b_datacenter','b_lab'],lvl:8,price:3000,energy:8,desc:'Enerji arttıkça üretim hızlanır.'},
 barn:{name:'Ambar',looks:['b_ambar1','b_ambar2','b_ambar3','b_ambar4','b_ambar5','b_ambar6','b_ambar7','b_ambar8','b_ambar9','b_ambar10'],price:400,desc:'Ürünlerin deposu. Yükseldikçe kapasitesi artar.'},
 stadium:{name:'Stadyum',looks:['b_stadium'],lvl:6,price:2500,joy:15,desc:'+15 mutluluk. İçinde penaltı oyunu var.'},
 school:{name:'Okul',looks:['b_school'],lvl:5,price:1200,joy:10,desc:'+10 mutluluk. Köyün çocukları okusun.'},
 hospital:{name:'Hastane',looks:['b_hospital'],lvl:7,price:2000,joy:12,desc:'+12 mutluluk. Sağlıklı köy, mutlu köy.'},
 orchard:{name:'Meyve Bahçesi',looks:[],rl:{apple:1,strawberry:3,grapes:5,orange:7},lvl:6,price:400,desc:'Elma, çilek, üzüm, portakal. Fidandan seraya.'},
 beehive:{name:'Arı Kovanı',looks:[],rl:{honey:1},lvl:6,price:500,desc:'Bal. Hasır kovandan akıllı kovana.'},
 helipad:{name:'Hava Ulaşımı',looks:['b_helipad','b_plane','b_airport'],lvl:8,price:2000,desc:'Helikopter siparişleri; seviye 10’da havalimanı ve kargo uçağı.'}
};
const NEWLOOKS2={"halkoyun": ["b_meydan1", "b_meydan2", "b_meydan3", "b_meydan4", "b_meydan5", "b_meydan6", "b_meydan7", "b_meydan8", "b_meydan9", "b_meydan10"], "hospital": ["b_hastane1", "b_hastane2", "b_hastane3", "b_hastane4", "b_hastane5", "b_hastane6", "b_hastane7", "b_hastane8", "b_hastane9", "b_hastane10"], "school": ["b_okul1", "b_okul2", "b_okul3", "b_okul4", "b_okul5", "b_okul6", "b_okul7", "b_okul8", "b_okul9", "b_okul10"], "stadium": ["b_stadyum1", "b_stadyum2", "b_stadyum3", "b_stadyum4", "b_stadyum5", "b_stadyum6", "b_stadyum7", "b_stadyum8", "b_stadyum9", "b_stadyum10"], "solar": ["b_enerji1", "b_enerji2", "b_enerji3", "b_enerji4", "b_enerji5", "b_enerji6", "b_enerji7", "b_enerji8", "b_enerji9", "b_enerji10"], "helipad": ["b_hava1", "b_hava2", "b_hava3", "b_hava4", "b_hava5", "b_hava6", "b_hava7", "b_hava8", "b_hava9", "b_hava10"], "orchard": ["b_bahce1", "b_bahce2", "b_bahce3", "b_bahce4", "b_bahce5", "b_bahce6", "b_bahce7", "b_bahce8", "b_bahce9", "b_bahce10"], "beehive": ["b_kovan1", "b_kovan2", "b_kovan3", "b_kovan4", "b_kovan5", "b_kovan6", "b_kovan7", "b_kovan8", "b_kovan9", "b_kovan10"]};
const NEWLOOKS={"cottage": ["b_ev1", "b_ev2", "b_ev3", "b_ev4", "b_ev5", "b_ev6", "b_ev7", "b_ev8", "b_ev9"], "hall": ["b_belediye1", "b_belediye2", "b_belediye3", "b_belediye4", "b_belediye5", "b_belediye6", "b_belediye7", "b_belediye8", "b_belediye9"], "cayocagi": ["b_cay1", "b_cay2", "b_cay3", "b_cay4", "b_cay5", "b_cay6", "b_cay7", "b_cay8", "b_cay9"], "cami1": ["b_cami1", "b_cami2", "b_cami3", "b_cami4", "b_cami5", "b_cami6", "b_cami7", "b_cami8", "b_cami9"], "cowpen": ["b_ahir1", "b_ahir2", "b_ahir3", "b_ahir4", "b_ahir5", "b_ahir6", "b_ahir7", "b_ahir8", "b_ahir9"], "feedmill": ["b_degirmen1", "b_degirmen2", "b_degirmen4", "b_degirmen5", "b_degirmen7", "b_degirmen8", "b_degirmen9"], "coop": ["b_kumes1", "b_kumes2", "b_kumes3", "b_kumes4", "b_kumes5", "b_kumes6", "b_kumes7", "b_kumes8", "b_kumes9", "b_kumes10"], "dairy": ["b_mandira1", "b_mandira2", "b_mandira3", "b_mandira4", "b_mandira5", "b_mandira6", "b_mandira7", "b_mandira8", "b_mandira9"], "balikci": ["b_balik1", "b_balik2", "b_balik3", "b_balik4", "b_balik5", "b_balik6", "b_balik7", "b_balik8", "b_balik9", "b_balik10", "b_balik11"], "kebapci": ["b_kebap1", "b_kebap2", "b_kebap3", "b_kebap4", "b_kebap5", "b_kebap6", "b_kebap7", "b_kebap8", "b_kebap9", "b_kebap10", "b_kebap11", "b_kebap12"], "mine": ["b_maden1", "b_maden2", "b_maden3", "b_maden4", "b_maden5", "b_maden6", "b_maden7", "b_maden8", "b_maden9"], "smith": ["b_demirci1", "b_demirci2", "b_demirci3", "b_demirci4", "b_demirci5", "b_demirci6", "b_demirci7", "b_demirci8", "b_demirci9"], "sheepfold": ["b_agil1", "b_agil2", "b_agil3", "b_agil4", "b_agil5", "b_agil6", "b_agil7", "b_agil8", "b_agil9", "b_agil10"], "post": ["b_carsi1", "b_carsi2", "b_carsi3", "b_carsi4", "b_carsi5", "b_carsi6", "b_carsi7", "b_carsi8", "b_carsi9"], "weaving": ["b_dokuma1", "b_dokuma2", "b_dokuma3", "b_dokuma4", "b_dokuma5", "b_dokuma6", "b_dokuma7", "b_dokuma8", "b_dokuma9", "b_dokuma10"], "jamfactory": ["b_konserve1", "b_konserve2", "b_konserve3", "b_konserve4", "b_konserve5", "b_konserve6", "b_konserve7", "b_konserve8", "b_konserve9"]};for(const[id,l]of Object.entries(NEWLOOKS))FAM[id].looks=l;for(const[id,l]of Object.entries(NEWLOOKS2))FAM[id].looks=l;
for(const[id,f]of Object.entries(FAM)){const d=DEF[id];Object.assign(d,{name:f.name,looks:f.looks,img:f.looks.find(k=>IMG_SRC[k])||d.img,era:1});
  if(f.rl){d.rl=f.rl;d.recipes=Object.keys(f.rl);d.kind='prod';}
  for(const k of['pop','lvl','price','desc','joy','energy'])if(f[k]!==undefined)d[k]=f[k];
  if(!['cottage','orchard','beehive'].includes(id))d.unique=true;delete d.pen;}
DEF.orchard.workers=0;DEF.beehive.workers=0;
DEF.cowpen.pen='a_cow';DEF.coop.pen='a_chicken';DEF.sheepfold.pen='a_sheep';DEF.cami1.joy=DEF.cami1.joy||10;DEF.halkoyun.joy=12;DEF.halkoyun.show=true;DEF.cayocagi.kahve=true;DEF.stadium.penalty=true;DEF.stadium.kind='service';DEF.stadium.workers=2;for(const k of['school','hospital']){DEF[k].kind='service';DEF[k].workers=Math.min(2,DEF[k].workers||1);DEF[k].size=2;}
DEF.cottage.coins=12;
const MAXL=20,BASEL=15; // 1-15: klasik görünüşler, 16-20: gelecek (2100) görünüşleri
const FUT={cottage:['b_fut_cottage'],bakery:['b_fut_bakery'],cayocagi:['b_fut_cayocagi'],cami1:['b_fut_cami1','b_fut_cami12'],cowpen:['b_fut_cowpen'],feedmill:['b_fut_feedmill'],
  coop:['b_fut_coop'],dairy:['b_fut_dairy','b_fut_dairy2'],balikci:['b_fut_balikci'],kebapci:['b_fut_kebapci'],mine:['b_fut_mine'],smith:['b_fut_smith'],sheepfold:['b_fut_sheepfold'],
  post:['b_fut_post'],weaving:['b_fut_weaving2','b_fut_weaving'],jamfactory:['b_fut_jamfactory'],halkoyun:['b_fut_halkoyun','b_fut_halkoyun2'],hospital:['b_fut_hospital'],
  school:['b_fut_school'],stadium:['b_fut_stadium'],solar:['b_fut_solar'],helipad:['b_fut_helipad'],orchard:['b_fut_orchard'],beehive:['b_fut_beehive'],barn:['b_fut_barn','b_fut_barn2'],hall:['b_fut_hall']};
function lookIdxL(d,L){if(!d||!d.looks)return 0;if(d.stageLooks)return Math.min(d.looks.length-1,L-1);const fn=d.futN||0,base=d.looks.length-fn;
  if(L<=BASEL||!fn)return Math.min(base-1,Math.floor((Math.min(L,BASEL)-1)*base/BASEL));return base+(fn>1&&L>=18?1:0);}
const lookIdx=e=>lookIdxL(DEF[e.type],lv(e));
DEF.market.looks=['b_pazar1','b_pazar2','b_pazar3','b_pazar4','b_pazar5','b_pazar6','b_pazar7','b_pazar8','b_pazar9'];FUT.market=['b_fut_pazar','b_fut_pazar2'];
for(const[id,fl]of Object.entries(FUT))if(DEF[id]&&DEF[id].looks&&!DEF[id].futN){DEF[id].looks=DEF[id].looks.concat(fl);DEF[id].futN=fl.length;}
function imgOf(e){const k=imgOf0(e);if(k&&!IM[k])loadImg(k);return k;}
function imgOf0(e){if(e.type==='deco'||e.type==='obstacle')return e.img;if(e.type==='ruin')return LM[e.lm].img;const d=DEF[e.type];
  if(d.looks){const w=lookIdx(e);let fb=null;for(let i=w;i>=0;i--){const k=d.looks[i];if(!IMG_SRC[k])continue;if(IM[k])return k;loadImg(k);if(!fb)fb=k;}
    for(let i=w+1;i<d.looks.length;i++){const k=d.looks[i];if(IM[k])return k;}return fb||d.img;}return d.img;}
const OLDMAP={house2:['cottage',4],townhouse:['cottage',6],apart1:['cottage',8],apartment:['cottage',10],skyscraper:['cottage',12],ecotower:['cottage',14],
 pizzeria:['bakery',9],kahvehane:['cayocagi',6],cafe:['cayocagi',11],creamery:['dairy',8],furniture:['smith',5],electronics:['smith',9],robotfac:['smith',13],
 tailor:['weaving',8],kasap:['kebapci',1],harbor:['balikci',8],juicefactory:['jamfactory',8],rowshop:['post',1],cami2:['cami1',5],cami3:['cami1',9],cami4:['cami1',13],
 apron:['helipad',6],airport:['helipad',10],drone:['helipad',13],
 wind:['solar',4],charger:['solar',1],datacenter:['solar',10],lab:['solar',13],maglev:['solar',8],bank:['hall',8]};
const famOf=k=>OLDMAP[k]||[k,1];
const cropOK=k=>!!IMG_SRC['c_'+k+'0'];
const SHOP=['field','road','cottage','bakery','cami1','cayocagi','kahvehane','feedmill','cowpen','market','balikci','coop','dairy','halkoyun','kebapci','house2','mine','kasap','smith','sheepfold','creamery','weaving'];
const ERAS=[{n:'Köy',list:SHOP},{n:'Kasaba',list:['cami2','townhouse','orchard','beehive','harbor','cafe','helipad','jamfactory','juicefactory','apart1','school','tailor','rowshop','pizzeria','post']},
  {n:'Şehir',list:['cami3','apartment','bank','hospital','skyscraper','airport','apron','stadium','furniture','electronics']},
  {n:'Teknoloji',list:['cami4','solar','wind','charger','ecotower','datacenter','maglev','drone','lab','robotfac']}];
const ERA_NAME=['','Köy','Kasaba','Şehir','Teknoloji Şehri'];
const ERA_LOCK=['','','Fener yanınca Kasaba çağı başlar.','Kasaba şenliğinden sonra Şehir çağı başlar.','Fırtınanın gerçeği ortaya çıkınca Teknoloji çağı başlar.'];
const DECO={d_cart:{w:.95},d_tree:{w:.95},d_pine:{w:.72},d_bush:{w:.7},d_flowers:{w:.66},d_fence:{w:.8},d_rock:{w:.62},d_well:{w:.68},d_scarecrow:{w:.48}};
const OBST={o_stump:{tool:'axe',w:.9,n:'Ağaç kütüğü'},o_log:{tool:'axe',w:.95,n:'Devrik kütük'},o_rocks:{tool:'pickaxe',w:.9,n:'Kaya yığını'},o_thorn:{tool:'shovel',w:.85,n:'Dikenli çalı'}};
const LM={farm:{n:'Yıkık Çiftlik Evi',img:'l_farm0',d:'Hasan Dede’nin fırtınada yıkılan evi. Hikâye ilerledikçe onarılacak.'},mill:{n:'Yıkık Değirmen',img:'l_mill0',d:'Kanatları kırık eski değirmen. Çivi ve emekle yeniden döner.'},ship:{n:'Martı Gemisi',img:'l_ship',d:'Kaptan Yusuf’un fırtınada karaya oturan gemisi. Ambarında sırlar var.'},light:{n:'Sönmüş Fener',img:'l_light0',d:'Adayı sisten koruyan fener otuz yıldır karanlık.'}};
const LM_AT={'0,-1':['mill',8,2],'2,0':['ship',22,8],'-1,-1':['light',-1,-1]};
const PEOPLE2=['p_baskan','p_postaci','p_pilot','p_ogretmen','p_asci','p_selin'];
const PEOPLE={p_baskan:'Başkan Kemal',p_postaci:'Postacı Ali',p_pilot:'Pilot Defne',p_ogretmen:'Ayla Öğretmen',p_asci:'Aşçı Mert',p_selin:'Selin Hanım',p_karakulak:'Kaptan Karakulak',p_piril:'Pırıl',p_elif:'Elif',p_dede:'Hasan Dede',p_firinci:'Fırıncı Rıza',p_zeynep:'Zeynep',p_can:'Can',p_nine:'Fatma Nine',p_usta:'Demirci Murat',p_balikci:'Kaptan Yusuf'};
const AN={a_cow:{w:50,say:'Möö!'},a_sheep:{w:44,say:'Mee!'},a_chicken:{w:26,say:'Gıt gıdak!'}};
const PEN_SPOTS={a_cow:[[.38,.78],[.58,.86]],a_chicken:[[.66,.74],[.78,.8],[.58,.86]],a_sheep:[[.42,.74],[.6,.8]]};
const ROADS=[];for(let x=6;x<17;x++)ROADS.push([x,12]);for(let y=6;y<18;y++)if(y!==12)ROADS.push([11,y]);
const RAILX=17;
let ROADSET=new Set(ROADS.map(p=>p+''));
const isRoad=(x,y)=>ROADSET.has(x+','+y);
function allRoads(){if(S&&S.world==='planet')return S.roads||[];return S&&S.roads?ROADS.concat(S.roads):ROADS;}
function rebuildRoads(){ROADSET=new Set(allRoads().map(p=>p+''));}
const isRail=(x,y)=>x===RAILX;
// hemzemin geçit: rayın iki yanında da yol varsa araçlar ve köylüler raydan geçebilir
const isCrossing=(x,y)=>S.world!=='planet'&&x===RAILX&&isRoad(x-1,y)&&isRoad(x+1,y)&&cellUnlocked(x,y);
const canDrive=(x,y)=>(isRoad(x,y)||isCrossing(x,y))&&cellUnlocked(x,y);
const trainNear=y=>!!trainAnim; // tren geçerken bariyer iner
const xpNeed=l=>Math.round(25*Math.pow(l,1.3)+20); // seviye başına ~10 (başta) ile ~40 (sonlarda) sipariş
const T_TRAIN=()=>has('maglev')?600000:1800000,T_SHIP=3600000,T_PLANE=10800000;

