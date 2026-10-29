/* ================= QUESTS / STORY ================= */
function stat(cat,k,q){S.st[cat][k]=(S.st[cat][k]||0)+q;}
const snap=()=>JSON.parse(JSON.stringify(S.st));
const G={
  harvest:(g,b)=>[(S.st.harvest[g.k]||0)-(b.harvest[g.k]||0),g.n],
  made:(g,b)=>[(S.st.made[g.k]||0)-(b.made[g.k]||0),g.n],
  // tek kurulabilen binalarda (Fırın, Enerji, Çarşı…) birden fazla istenirse görev kilitlenmesin: 1 yeterli
  build:g=>{const d=DEF[famOf(g.k)[0]];return [count(g.k),d&&d.unique?Math.min(1,g.n):g.n];},
  orders:(g,b)=>[S.st.orders-b.orders,g.n],
  trains:(g,b)=>[S.st.trains-b.trains,g.n],
  cleared:(g,b)=>[S.st.cleared-b.cleared,g.n],
  expand:g=>[S.blocks.length-4,g.n],
  block:g=>[S.blocks.includes(g.b)?1:0,1],
  level:g=>[S.lvl,g.n],
  flag:g=>[S.flags&&S.flags[g.k]?1:0,1],
  give:g=>[have(g.k),g.n],
  coins:g=>[S.coins,g.n],
  ships:(g,b)=>[S.st.ships-(b.ships||0),g.n],
  planes:(g,b)=>[S.st.planes-(b.planes||0),g.n]
};
function goalText(g){
  const B=k=>DEF[k].name,I=k=>ITEMS[k].n;
  switch(g.t){case 'harvest':return `${I(g.k)} hasat et`;case 'made':return `${I(g.k)} üret`;case 'build':{const[f,m]=famOf(g.k);return m>1?`${DEF[f].name} seviye ${m}`:`${B(f)} kur`;}
    case 'orders':return 'Sipariş teslim et';case 'trains':return 'Tren gönder';case 'cleared':return 'Engel temizle';case 'expand':return 'Yeni bölge aç';
    case 'block':return g.label;case 'level':return `Seviye ${g.n} ol`;case 'give':return `${I(g.k)} ver`;case 'coins':return 'Altın öde';case 'ships':return 'Kargo gemisi gönder';case 'planes':return 'Kargo uçağı gönder';case 'flag':return g.label;}
}
function goalIcon(g){if(g.t==='flag')return `<img class="ic" src="${IMG_SRC['th_'+g.img]||IMG_SRC[g.img]||IMG_SRC.x_sign}" alt="">`;if(g.k&&ITEMS[g.k])return ic(g.k);if(g.t==='build')return `<img class="ic" src="${IMG_SRC[DEF[g.k].img||'f_plot']||IMG_SRC.x_sign}" alt="">`;
  if(g.t==='coins')return COIN;if(g.t==='level')return `<img class="ic" src="${IMG_SRC.u_star}" alt="">`;if(g.t==='orders')return `<img class="ic" src="${IMG_SRC.u_orders}" alt="">`;
  if(g.t==='trains')return `<img class="ic" src="${IMG_SRC.x_loco}" alt="">`;if(g.t==='ships')return `<img class="ic" src="${IMG_SRC.v_ship}" alt="">`;if(g.t==='planes')return `<img class="ic" src="${IMG_SRC.b_plane}" alt="">`;return `<img class="ic" src="${IMG_SRC.x_sign}" alt="">`;}
function genQuest(){const pool=producible().filter(k=>!CROPS[k]).sort(()=>Math.random()-.5),L=S.lvl;const k=pool[0]||'bread',k2=pool[1]||'milk';
  const ppl=Object.keys(PEOPLE).filter(p=>p!=='p_karakulak');const who=ppl[Math.floor(Math.random()*ppl.length)];
  const goals=[{t:'made',k,n:3+Math.floor(L/6)},{t:'give',k:k2,n:2+Math.floor(L/10)}];
  const extra=[{t:'orders',n:5+Math.floor(L/5)},{t:'trains',n:2}].concat(has('harbor')?[{t:'ships',n:1}]:[]).concat(has('airport')?[{t:'planes',n:1}]:[]);
  goals.push(extra[Math.floor(Math.random()*extra.length)]);
  return {ch:CHAPTERS.length-1,who,title:'Ada görevi',intro:`${PEOPLE[who]} senden yardım istiyor. Ada büyüdükçe işler de büyüyor!`,goals,reward:{coins:150*L,xp:20+L*2,items:Math.random()<.5?{map:1}:{nails:2}}};}
const curStory=()=>S&&S.world==='planet'?PSTORY:STORY;
const curQ=()=>{const ST=curStory();if(S.quest.i<ST.length)return ST[S.quest.i];if(!S.quest.gen){S.quest.gen=genQuest();save();}return S.quest.gen;};
function qProgress(q){return q.goals.map(g=>{const[a,b]=G[g.t](g,S.quest.base);return {g,a:Math.max(0,Math.min(a,b)),b,ok:a>=b};});}
function qDone(q){return q&&qProgress(q).every(p=>p.ok);}
function startQuest(talkNow){S.quest.base=snap();S.quest.seen=false;if(talkNow)setTimeout(showQuestTalk,600);}
function showQuestTalk(){const q=curQ();if(!q)return;S.quest.seen=true;save();talk(q.who,q.intro,[['Görevlere bak',openQuest],['Tamam',null,true]]);}
function questTick(){questUI();}
function questUI(){
  const q=curQ(),el=$('quest');if(!q||DEMO){el.classList.remove('on');return;}
  el.classList.add('on');$('qImg').src=IMG_SRC[q.who];$('qCh').textContent=CHAPTERS[q.ch];$('qTitle').textContent=q.title;
  const pr=qProgress(q),n=pr.filter(p=>p.ok).length;$('qProg').textContent=n+'/'+pr.length;el.classList.toggle('ready',n===pr.length);
}
function openQuest(){
  const q=curQ();if(!q)return;
  openSheet(q.title,()=>{const pr=qProgress(q),done=pr.every(p=>p.ok);
    $('sBody').innerHTML=`<div class="order"><div class="who"><img src="${IMG_SRC[q.who]}" alt="">${PEOPLE[q.who]}</div><p style="margin:0">${TN(q.intro)}</p></div>
    <div class="sec">${CHAPTERS[q.ch]}</div>`+pr.map(p=>`<div class="row"><div class="ico">${goalIcon(p.g)}</div><div class="mid"><div class="t">${goalText(p.g)}</div>
      <div class="d">${p.g.t==='block'&&!p.ok?`<button class="btn alt" data-goto="${p.g.b}" style="padding:6px 12px;font-size:14px">Haritada göster</button> `:''}${p.g.t==='level'||p.g.t==='block'?(p.ok?'Tamam':'Henüz değil'):p.a+' / '+p.b}${p.ok?' ✔':''}</div><div class="prog"><i style="width:${p.b?Math.min(100,p.a/p.b*100):0}%"></i></div></div></div>`).join('')+
    `<div class="row"><div class="mid"><div class="t">Ödül</div><div class="d">${COIN} ${q.reward.coins||0}  ⭐ ${q.reward.xp||0} ${(q.reward.items?Object.entries(q.reward.items).map(([k,v])=>ic(k)+' '+v).join(' '):'')}</div></div>
    <button class="btn" id="qClaim" ${done?'':'disabled'}>Tamamla</button></div>`;
    $('qClaim').onclick=()=>claimQuest();bind('[data-goto]',b=>{closeSheet();focusBlock(b.dataset.goto);});});
}
function claimQuest(){
  const q=curQ();if(!qDone(q))return;
  for(const g of q.goals){if(g.t==='give')take({[g.k]:g.n});if(g.t==='coins')S.coins-=g.n;}
  S.coins+=q.reward.coins||0;for(const[k,v]of Object.entries(q.reward.items||{}))addItem(k,v);
  if(q.fx)EFFECTS[q.fx]();
  closeSheet();gainXP(q.reward.xp||0);
  S.quest.i++;S.quest.gen=null;startQuest(false);changed();questUI();
  const nxt=()=>{if(curQ())showQuestTalk();};
  if(q.outro)setTimeout(()=>talk(q.who,q.outro,[['Devam',nxt]]),400);else setTimeout(nxt,500);
}
function restore(lm,type){const e=S.ents.find(x=>x.type==='ruin'&&x.lm===lm);if(!e)return;e.type=type;delete e.lm;e.bounce=now();if(DEF[type].kind==='house')e.last=now();
  const c=centerOf(e);for(let i=0;i<10;i++)PUFFS.push({x:c.x+(Math.random()-.5)*120,y:c.y-Math.random()*90,t0:now()-Math.random()*800});}
const EFFECTS={
  farm:()=>restore('farm','farmhouse'),
  mill:()=>restore('mill','windmill'),
  pier:()=>{S.pier=true;},
  ship:()=>{const e=S.ents.find(x=>x.lm==='ship');if(e)e.searched=true;},
  light:()=>{restore('light','lighthouse');S.era=2;spawnVillagers();spawnVeh();},
  era3:()=>{S.era=3;spawnVillagers();},
  era4:()=>{S.era=4;spawnVillagers();},
  finale:()=>{S.finale=true;}
};
function openRuin(e){const l=LM[e.lm];openSheet(l.n,()=>{$('sBody').innerHTML=`<div class="row"><div class="ico"><img src="${IMG_SRC[l.img]}" alt=""></div><div class="mid"><div class="d">${l.d}</div></div></div>
  <p class="sub">Sol üstteki hikâye görevlerini takip et; sırası gelince burası canlanacak.</p>`;});}
const CHAPTERS=['','Bölüm 1 · Sisli Ada','Bölüm 2 · Ahırın Sesi','Bölüm 3 · Raylar','Bölüm 4 · Yıkık Değirmen','Bölüm 5 · Kıyıdaki Enkaz','Bölüm 6 · Yünden Yelkene','Bölüm 7 · Fener',
 'Kasaba · Gemiler Dönüyor','Kasaba · Tatlı Hayat','Kasaba · Gökyüzü Yolu','Kasaba · Okul Zili','Kasaba · Kayıp Mektuplar','Kasaba · Büyük Şenlik',
 'Şehir · Işıklar Şehri','Şehir · Şifa','Şehir · Kanatlar','Şehir · Büyük Maç','Şehir · Fırtınanın Gerçeği',
 'Teknoloji · Akıllı Ada','Teknoloji · Fırtına Uyarısı','Teknoloji · Hızlı Raylar','Teknoloji · Büyük Fırtına','Sonsuz Ufuk'];
const STORY=[
 {ch:1,who:'p_elif',title:'Adaya dönüş',intro:'Hoş geldin! Burası {KÖY}, bizim köyümüz. Otuz yıl önce Büyük Fırtına bu adayı sise gömdü. Fener söndü, gemiler gelmez oldu, köy boşaldı. Dedemle birlikte burayı yeniden ayağa kaldıracağız. Önce tarlalara buğday ek ve hasat et.',goals:[{t:'harvest',k:'wheat',n:6}],reward:{coins:50,xp:8},outro:'Toprak hâlâ bereketli! Fırıncı Rıza seni arıyor.'},
 {ch:1,who:'p_firinci',title:'Fırın yeniden yanıyor',intro:'Fırınım yıllardır soğuk durdu evlat. Buğdayı getir, yeniden ekmek kokusu yayılsın köye. Fırına dokun, ekmek pişir.',goals:[{t:'made',k:'bread',n:2}],reward:{coins:60,xp:10},outro:'Mis gibi! Bu kokuyu duyan herkes köye döner, görürsün.'},
 {ch:1,who:'p_elif',title:'İlk siparişler',intro:'Köylüler panoya sipariş bırakmaya başladı. Siparişler düğmesinden bak; teslim ettikçe altın ve yıldız kazanırsın.',goals:[{t:'orders',n:3}],reward:{coins:80,xp:10}},
 {ch:1,who:'p_dede',title:'Dede ile tanışma',intro:'Ben Hasan, Elif’in dedesi. Şu yıkık ev benimdi… Fırtına gecesi çatısı uçtu. Onu sonra düşünürüz; önce köye insan lazım. İki kulübe kur.',goals:[{t:'build',k:'cottage',n:2}],reward:{coins:100,xp:15},outro:'İşte bu! Pencerelerde yeniden ışık var.'},
 {ch:2,who:'p_dede',title:'Yem lazım',intro:'Eskiden bu adada inekler böğürürdü. Hayvanlar için önce yem gerek. Yem Fabrikası kur ve inek yemi üret.',goals:[{t:'level',n:2},{t:'build',k:'feedmill',n:1},{t:'made',k:'cowfeed',n:2}],reward:{coins:120,xp:15}},
 {ch:2,who:'p_elif',title:'Ahırın sesi',intro:'İnek Ahırı kuralım! İnekleri yemle, sütçü kız gelip sağsın.',goals:[{t:'build',k:'cowpen',n:1},{t:'made',k:'milk',n:4}],reward:{coins:150,xp:18},outro:'Duyuyor musun? Möö! Köy canlanıyor.'},
 {ch:2,who:'p_nine',title:'Fatma Nine’nin sofrası',intro:'Ben Fatma, Hasan’ın komşusuyum. Ellerim eskisi gibi değil… Bana biraz süt ve ekmek getirir misin? Sofram boş kalmasın.',goals:[{t:'give',k:'milk',n:4},{t:'give',k:'bread',n:3}],reward:{coins:180,xp:20},outro:'Allah razı olsun. Hasan’ın evini onarırsanız, ben de perdelerini dikerim.'},
 {ch:2,who:'p_can',title:'Pazar kurulsun',intro:'Ben Can! Ana karada pazarlar kalabalık olur. Biz de bir tezgâh kuralım, fazlaları satarız!',goals:[{t:'build',k:'market',n:1},{t:'orders',n:3}],reward:{coins:150,xp:15}},
 {ch:2,who:'p_dede',title:'Eski evim',intro:'Artık evimi onarmanın vakti geldi. 12 buğday, 4 süt ve biraz altın yeter; gerisini köylüler halleder.',goals:[{t:'give',k:'wheat',n:12},{t:'give',k:'milk',n:4},{t:'coins',n:250}],reward:{coins:0,xp:30,items:{map:1}},fx:'farm',
   outro:'Evim! Duvarın arkasında bunu buldum: babamdan kalma bir harita parçası. Adanın kuzeyini, eski değirmeni gösteriyor. Ama yırtık… Diğer parçalar sisin altında olmalı.'},
 {ch:3,who:'p_balikci',title:'Kaptan Yusuf',intro:'Selam! Ben Yusuf, eski kaptanım. Sis yüzünden gemiler yanaşamıyor ama tren hattı hâlâ sağlam. Seviye 3 olunca istasyon açılır; treni doldur ve gönder.',goals:[{t:'level',n:3},{t:'trains',n:1}],reward:{coins:200,xp:20,items:{shovel:1,nails:2}},outro:'Tren dönünce ana karadan haber getirecek. Kürek de hediyem, bulutların altını kazırsın.'},
 {ch:3,who:'p_elif',title:'Kümesin neşesi',intro:'Kümes kuralım, tavuklara yem verip yumurta toplayalım.',goals:[{t:'build',k:'coop',n:1},{t:'made',k:'chickfeed',n:2},{t:'made',k:'egg',n:6}],reward:{coins:200,xp:20}},
 {ch:3,who:'p_firinci',title:'Kurabiye zamanı',intro:'Yumurta varsa kurabiye de var! Çocuklar için kurabiye pişirelim.',goals:[{t:'made',k:'cookie',n:3}],reward:{coins:180,xp:18}},
 {ch:3,who:'p_nine',title:'Mandıra',intro:'Sütten krema yapmayı annem öğretmişti. Mandıra kur, krema çıkaralım.',goals:[{t:'build',k:'dairy',n:1},{t:'made',k:'cream',n:3}],reward:{coins:220,xp:22}},
 {ch:3,who:'p_zeynep',title:'Ana karadan biri',intro:'Merhaba, ben Zeynep! Trenle geldim, mühendisim. Haritanızı gördüm: kuzeyde bir değirmen işaretli. Bulutları açmamız lazım. Kuzeydeki bulutlu bölgeye dokun ve aç.',goals:[{t:'block',b:'0,-1',label:'Kuzeydeki değirmen bölgesini aç'}],reward:{coins:250,xp:25,items:{nails:2}},outro:'İşte orada! Kanatları kırık ama gövdesi sağlam.'},
 {ch:4,who:'p_zeynep',title:'Değirmen için demir',intro:'Değirmeni onarmak için çivi lazım, çivi için de demir. Adanın eski madeni olmalı. Seviye 4’e ulaş.',goals:[{t:'level',n:4}],reward:{coins:200,xp:10}},
 {ch:4,who:'p_usta',title:'Demirci Murat',intro:'Ben Murat. Dedem bu madende çalışırdı. Madeni yeniden açalım, cevher çıkaralım.',goals:[{t:'build',k:'mine',n:1},{t:'made',k:'ore',n:6}],reward:{coins:250,xp:25}},
 {ch:4,who:'p_usta',title:'Örs ve çekiç',intro:'Örsüm paslanmış ama hâlâ iş görür. Demirciyi kur, çivi dövelim.',goals:[{t:'build',k:'smith',n:1},{t:'made',k:'nails',n:6}],reward:{coins:250,xp:25}},
 {ch:4,who:'p_dede',title:'Konak',intro:'Köy kalabalıklaştı, işçilere yer lazım. Bir konak kur.',goals:[{t:'build',k:'house2',n:1}],reward:{coins:200,xp:20}},
 {ch:4,who:'p_zeynep',title:'Kanatlar yeniden',intro:'Değirmeni onaralım! Çivi, buğday ve biraz altın gerekiyor.',goals:[{t:'give',k:'nails',n:8},{t:'give',k:'wheat',n:15},{t:'coins',n:400}],reward:{coins:0,xp:40,items:{map:1}},fx:'mill',
   outro:'Dönüyor! Değirmen artık yem öğütüyor, işçi de istemiyor. Taşın altında ikinci harita parçası vardı: bir gemi ve doğudaki kumsal işaretli.'},
 {ch:5,who:'p_can',title:'Kumsaldaki dev',intro:'Doğu kıyısında kumsala vurmuş kocaman bir gemi gördüm! Bulutları açıp bakalım mı?',goals:[{t:'block',b:'2,0',label:'Doğudaki kumsal bölgesini aç'}],reward:{coins:300,xp:25},outro:'Vay be… Gövdesinde “Martı” yazıyor!'},
 {ch:5,who:'p_balikci',title:'Martı',intro:'Bu benim gemim, Martı… Fırtına gecesi fener sönünce kayalara bindirdik. Etrafını temizleyelim; enkazın çevresi kütük ve kaya dolu.',goals:[{t:'cleared',n:4}],reward:{coins:300,xp:30,items:{map:1}},outro:'Kumların arasında bir harita parçası daha! Sanki biri bunları bilerek saklamış.'},
 {ch:5,who:'p_balikci',title:'Ambarın kapağı',intro:'Ambar kapağı paslanıp kaynamış. İki kazma lazım, Demirci yapar.',goals:[{t:'level',n:5},{t:'give',k:'pickaxe',n:2}],reward:{coins:350,xp:30},fx:'ship',
   outro:'Ambar boş… Fenerin merceğini ana karaya tamire götürüyordum, o da yok. Ama şu sandıkta Hasan’ın eski günlüğü var!'},
 {ch:5,who:'p_dede',title:'Günlük',intro:'Günlüğüm! Fırtına gecesi fener bekçisi merceği korumak için kayalıklardaki fenere geri dönmüştü… ve bir daha dönmedi. Belki mercek hâlâ orada. Önce köyü güçlendirelim: peynirhane kur.',goals:[{t:'build',k:'creamery',n:1},{t:'made',k:'cheese',n:3}],reward:{coins:350,xp:30}},
 {ch:6,who:'p_nine',title:'Kış hazırlığı',intro:'Kış sert geçer bu adada. Koyun ağılı kur, havuç ek, yün kırkalım.',goals:[{t:'build',k:'sheepfold',n:1},{t:'harvest',k:'carrot',n:6},{t:'made',k:'wool',n:6}],reward:{coins:350,xp:30}},
 {ch:6,who:'p_elif',title:'Tezgâh ve mekik',intro:'Dokuma atölyesi kurarsak yünden kumaş dokuruz. Seviye 6’ya ulaş ve atölyeyi kur.',goals:[{t:'level',n:6},{t:'build',k:'weaving',n:1},{t:'made',k:'fabric',n:3}],reward:{coins:400,xp:35}},
 {ch:6,who:'p_balikci',title:'Yeni yelken',intro:'Martı’yı yüzdüremeyiz ama yeni bir iskele ve sandal yaparız. Kumaştan yelken, çivi ve altın lazım.',goals:[{t:'give',k:'fabric',n:3},{t:'give',k:'nails',n:10},{t:'coins',n:600}],reward:{coins:0,xp:40},fx:'pier',outro:'İskele hazır! Batı kıyısında sandalımız bağlı. Fenere denizden de ulaşabiliriz.'},
 {ch:6,who:'p_can',title:'Kazaklar',intro:'Fatma Nine’ye ve bana kazak örer misin? Fenere giderken üşümeyelim!',goals:[{t:'made',k:'sweater',n:2},{t:'give',k:'sweater',n:2}],reward:{coins:500,xp:40}},
 {ch:7,who:'p_zeynep',title:'Kayalıklara',intro:'Fener batıdaki kayalıklarda, en uçta. Oraya kadar bulutları açmalıyız.',goals:[{t:'block',b:'-1,-1',label:'Batıdaki fener bölgesini aç'}],reward:{coins:500,xp:40},outro:'İşte fener… Kulesi çatlamış, sarmaşık sarmış.'},
 {ch:7,who:'p_dede',title:'Haritanın tamamı',intro:'Haritanın parçalarını birleştirirsek bekçinin saklandığı yeri buluruz. Beş parça topla. Engelleri temizledikçe ve bulutları açtıkça parça çıkar.',goals:[{t:'give',k:'map',n:5}],reward:{coins:400,xp:40},outro:'Harita tamam! Fenerin altında gizli bir oda işaretli. Merceği orada saklamışlar!'},
 {ch:7,who:'p_usta',title:'Taş ve demir',intro:'Kuleyi sağlamlaştırmak için çok demir lazım. Cevher, çivi ve kazma getir.',goals:[{t:'give',k:'ore',n:10},{t:'give',k:'nails',n:16},{t:'give',k:'pickaxe',n:2}],reward:{coins:500,xp:45}},
 {ch:7,who:'p_firinci',title:'Fener şenliği',intro:'Fener yanınca büyük bir şenlik yapacağız! Pasta ve tereyağlı ekmek hazırlayalım.',goals:[{t:'made',k:'cake',n:3},{t:'made',k:'butter',n:3}],reward:{coins:500,xp:45}},
 {ch:7,who:'p_zeynep',title:'Ufuk Feneri',intro:'Mercek elimizde, kule sağlam. Son bir gayret: fenerin lambasını yakalım!',goals:[{t:'give',k:'cake',n:2},{t:'give',k:'fabric',n:2},{t:'coins',n:1500}],reward:{coins:0,xp:80},fx:'light',
   outro:'FENER YANDI! Otuz yıllık sis dağılıyor… Ufukta gemiler var! Ada artık sadece bir köy değil. Liman, postane, okul… Kasabaya dönüşme zamanı.'},
 {ch:8,who:'p_balikci',title:'Liman',intro:'Fener yandı, sis kalktı! Ama gemilerin yanaşacağı bir liman yok. Seviye 9’a ulaş ve Balıkçı’yı seviye 8’e yükselt; orası limana dönüşsün, kargo gemisi de yanaşsın.',goals:[{t:'level',n:9},{t:'build',k:'harbor',n:1},{t:'made',k:'fish',n:4}],reward:{coins:800,xp:50},outro:'Limanda yeniden martı sesleri! Bak, iskeleye bir gemi yanaşıyor… kara bayraklı.'},
 {ch:8,who:'p_karakulak',title:'Kara Ada’dan gelen',intro:'Hah! Demek feneri yaktınız. Ben Kaptan Karakulak, Kara Ada’nın sahibi. Bu sulardaki bütün ticaret benimdir. Gemilerinizi göndermeden önce bana sorarsınız!',goals:[{t:'ships',n:1}],reward:{coins:600,xp:40},outro:'Bana sormadan gemi mi gönderdiniz? Göreceğiz bakalım bu cesaret ne kadar sürer…'},
 {ch:8,who:'p_balikci',title:'Karakulak kim?',intro:'Karakulak… Fırtına gecesi onun gemisi de o sulardaydı. O günden beri zenginleşti, bütün adaları avucuna aldı. Ondan bağımsız kalmak için kasabayı büyütelim: iki kasaba evi kur.',goals:[{t:'build',k:'townhouse',n:2}],reward:{coins:700,xp:40}},
 {ch:9,who:'p_nine',title:'Elma bahçeleri',intro:'Gençliğimde bu yamaçlar elma bahçesiydi. Meyve bahçesi kur, elma topla; çocuklar ağaç gölgesinde oynasın.',goals:[{t:'build',k:'orchard',n:2},{t:'made',k:'apple',n:6}],reward:{coins:600,xp:40}},
 {ch:9,who:'p_nine',title:'Arıların vızıltısı',intro:'Elma çiçeği olan yerde arı da olur. Bir arı kovanı kur, bal toplayalım.',goals:[{t:'build',k:'beehive',n:1},{t:'made',k:'honey',n:2}],reward:{coins:600,xp:40}},
 {ch:9,who:'p_asci',title:'Kaçak aşçı',intro:'Merhaba! Ben Mert. Karakulak’ın gemisinde aşçıydım; tayfanın yemeğini bile kısıyordu, ilk limanda kaçtım! Kafe açarsak kasabanın en güzel kahvesini yaparım.',goals:[{t:'level',n:10},{t:'build',k:'cafe',n:1},{t:'made',k:'coffee',n:4}],reward:{coins:900,xp:50},outro:'Kokuyu aldın mı? Bütün kasaba kafeye akın etti!'},
 {ch:9,who:'p_firinci',title:'Çilek reçeli',intro:'Mert’in kahvesinin yanına benim reçelli ekmeğim! Bahçede çilek ve üzüm yetiştir, reçel fabrikası kur.',goals:[{t:'level',n:11},{t:'build',k:'jamfactory',n:1},{t:'made',k:'jam',n:3}],reward:{coins:1000,xp:55}},
 {ch:10,who:'p_pilot',title:'Pervane sesi',intro:'Selam! Ben Defne, pilotum. Ana karadan helikopterle sipariş taşımak istiyorum ama inecek yer yok. Helikopter pisti kurar mısın?',goals:[{t:'build',k:'helipad',n:1},{t:'orders',n:5}],reward:{coins:1000,xp:55},outro:'Artık sipariş panosunda iki yer daha var ve her teslimata helikopter primi ekleniyor!'},
 {ch:10,who:'p_baskan',title:'Yeni başkan',intro:'Merhaba hemşerim! Ben Kemal, ana karadan kasabaya belediye başkanı olarak atandım. Bu kasaba büyüyecek! Önce bulutların altına doğru genişleyelim.',goals:[{t:'expand',n:5}],reward:{coins:1200,xp:60}},
 {ch:10,who:'p_baskan',title:'Taş binalar',intro:'Yeni gelenlere sağlam evler lazım. Bir taş apartman ve bir kasaba evi daha kur.',goals:[{t:'build',k:'apart1',n:1},{t:'build',k:'townhouse',n:3}],reward:{coins:1200,xp:60}},
 {ch:11,who:'p_ogretmen',title:'Okul',intro:'Ben Ayla. Can gibi çocuklar okulsuz kalmasın! Okul kurarsak kasabanın mutluluğu artar, bütün kiralar yükselir.',goals:[{t:'level',n:12},{t:'build',k:'school',n:1}],reward:{coins:1200,xp:60}},
 {ch:11,who:'p_can',title:'Meyve suyu',intro:'Teneffüste herkes meyve suyu istiyor! Portakal yetiştir, meyve suyu fabrikası kur.',goals:[{t:'build',k:'juicefactory',n:1},{t:'made',k:'juice',n:4}],reward:{coins:1200,xp:60}},
 {ch:11,who:'p_ogretmen',title:'Okul kıyafetleri',intro:'Çocukların kıyafetleri eskimiş. Terzi açalım, elbise ve kot dikelim.',goals:[{t:'level',n:13},{t:'build',k:'tailor',n:1},{t:'made',k:'dress',n:2},{t:'made',k:'jeans',n:2}],reward:{coins:1500,xp:70}},
 {ch:12,who:'p_postaci',title:'Postane',intro:'Ben Ali, postacıyım. Ana karadan gelen mektuplar Karakulak’ın gemilerinde kayboluyor! Kendi postanemizi kuralım.',goals:[{t:'level',n:14},{t:'build',k:'post',n:1},{t:'made',k:'notebook',n:3},{t:'made',k:'letter',n:2}],reward:{coins:1500,xp:70}},
 {ch:12,who:'p_postaci',title:'Düşen mektup',intro:'Karakulak’ın tayfası limanda bir mektup düşürdü… Adayı “sahipsiz” gösterip ana karadan satın almaya çalışıyorlar! Başkan’a mektup gönderelim, ana karadaki dostlara da hediye kolisi.',goals:[{t:'give',k:'letter',n:2},{t:'made',k:'parcel',n:2}],reward:{coins:1600,xp:70},outro:'Başkan Kemal mektubu okudu, yüzü bembeyaz oldu. Bu iş ciddi!'},
 {ch:12,who:'p_selin',title:'Avukat Selin',intro:'Ben Selin, ana karada avukatım. Karakulak adayı sahipsiz gösterip satın almak istiyor. Hasan Dede’nin tapusunu bulmalıyız. Harita parçaları eski kayıtların yerini gösterebilir.',goals:[{t:'give',k:'map',n:3},{t:'coins',n:3000}],reward:{coins:0,xp:90},outro:'Tapu bulundu! Hasan Dede’nin evindeki sandığın çift dibindeymiş. Ada resmen sizin. Karakulak’ın planı suya düştü!'},
 {ch:13,who:'p_asci',title:'Pizza fırını',intro:'Bu zaferi kutlamalıyız! Pizzacı açalım, buğday ve peynirle en güzel pizzayı yapayım.',goals:[{t:'build',k:'pizzeria',n:1},{t:'made',k:'pizza',n:3}],reward:{coins:1800,xp:80}},
 {ch:13,who:'p_baskan',title:'Çarşı',intro:'Meydanda dükkânlar açılsın, gemiler mal getirsin götürsün.',goals:[{t:'build',k:'rowshop',n:2},{t:'ships',n:3}],reward:{coins:2000,xp:80}},
 {ch:13,who:'p_baskan',title:'Büyük şenlik',intro:'Tapuyu kutlayalım! Meydanda büyük şenlik: pizza, meyve suyu, reçel, kahve. Herkes davetli… Karakulak bile!',goals:[{t:'level',n:16},{t:'give',k:'pizza',n:3},{t:'give',k:'juice',n:3},{t:'give',k:'jam',n:3},{t:'give',k:'coffee',n:3}],reward:{coins:3000,xp:120},fx:'era3',
   outro:'Ana karadan haber geldi: nüfusu, limanı ve ticaretiyle {KÖY} artık bir ŞEHİR! Apartmanlar, gökdelenler, havalimanı… Yeni çağ başlıyor.'},
 {ch:14,who:'p_selin',title:'Apartmanlar',intro:'Şehre insan akıyor. Apartmanlar yükselmeli.',goals:[{t:'level',n:17},{t:'build',k:'apartment',n:2}],reward:{coins:4000,xp:120}},
 {ch:14,who:'p_selin',title:'Kendi bankamız',intro:'Bir şehrin bankası olmalı. Faiz geliri her beş dakikada kasaya girer.',goals:[{t:'level',n:18},{t:'build',k:'bank',n:1}],reward:{coins:4000,xp:120}},
 {ch:14,who:'p_karakulak',title:'Kara Ada Holding',intro:'Şehir oldunuz ha? Ben de Kara Ada Holding’i kurdum. Paranızı bankanıza değil benim şirketime yatırın… Siparişlerinizi de ben taşırım, yarı fiyatına!',goals:[{t:'orders',n:15}],reward:{coins:4500,xp:130},outro:'Kendi siparişlerinizi kendiniz mi taşıdınız? İnatçı halk… Ama bu daha başlangıç.'},
 {ch:15,who:'p_ogretmen',title:'Şifa',intro:'Şehir büyüdükçe hastaneye ihtiyaç var. Hastane mutluluğu da artırır.',goals:[{t:'level',n:19},{t:'build',k:'hospital',n:1},{t:'expand',n:7}],reward:{coins:5000,xp:140}},
 {ch:15,who:'p_baskan',title:'Gökyüzüne doğru',intro:'{KÖY} için ilk gökdelen! Ana karadan bile görünsün.',goals:[{t:'level',n:20},{t:'build',k:'skyscraper',n:1}],reward:{coins:6000,xp:150}},
 {ch:16,who:'p_pilot',title:'Havalimanı',intro:'Helikopter yetmiyor artık! Havalimanı kuralım, kargo uçağıyla büyük seferler yapalım.',goals:[{t:'level',n:21},{t:'build',k:'airport',n:1},{t:'planes',n:1}],reward:{coins:8000,xp:180}},
 {ch:16,who:'p_pilot',title:'Pist ışıkları',intro:'Havalimanının yanına bir uçak pisti daha kuralım; turistler de uçağı görmeye gelir.',goals:[{t:'build',k:'apron',n:1},{t:'planes',n:2}],reward:{coins:8000,xp:180}},
 {ch:17,who:'p_can',title:'Büyük maç',intro:'Artık lise takımının kaptanıyım! Şehrin bir stadyumu olsa ana karayla maç yapardık!',goals:[{t:'level',n:22},{t:'build',k:'stadium',n:1},{t:'orders',n:20}],reward:{coins:10000,xp:200}},
 {ch:17,who:'p_karakulak',title:'Karanlık tehdit',intro:'Stadyum açılışınız ne güzel olacak… tabii elektrikler kesilmezse! Bütün yük gemileri benim, size mal gelmeyecek!',goals:[{t:'trains',n:3},{t:'ships',n:2}],reward:{coins:9000,xp:200},outro:'Lanet olsun! Kendi treniniz, kendi geminiz… Yine başardınız.'},
 {ch:18,who:'p_balikci',title:'Seyir defteri',intro:'Martı’nın enkazından çıkan eski seyir defterini sonunda okuyabildim… Fırtına gecesi fenere yakıt götüren tekne Karakulak’ınmış. Yakıtı hiç teslim etmemiş! Fener o yüzden söndü. Bunu mahkemeye bildirmeliyiz.',goals:[{t:'level',n:23},{t:'give',k:'letter',n:3},{t:'coins',n:8000}],reward:{coins:0,xp:220},outro:'Mektuplar ana karadaki mahkemeye ulaştı. Karakulak’ı çağırdılar.'},
 {ch:18,who:'p_karakulak',title:'İtiraf',intro:'…Haklısınız. O gece Martı batarsa sigortadan zengin olacaktım. Otuz yıldır her gece o fırtınayı rüyamda görüyorum. Cezamı çekeceğim ama önce bu adaya borcumu ödemek istiyorum. Bana bir şans verin.',goals:[{t:'level',n:24},{t:'give',k:'parcel',n:4}],reward:{coins:15000,xp:260},fx:'era4',
   outro:'Kara Ada’nın bütün gemilerini ve şirketimi size, {KÖY} halkına bağışlıyorum. Zeynep’in büyük projesine harcayın. Bir daha hiçbir fener sönmesin.'},
 {ch:19,who:'p_zeynep',title:'Pırıl',intro:'Sana birini tanıtayım: Pırıl! Yıllardır üzerinde çalıştığım yardımcı robot. Karakulak’ın bağışıyla hayalimi gerçekleştirebiliriz: dünyanın ilk akıllı adası. Önce temiz enerji: bir güneş santrali kur, yanına da güneş panelleri diz.',goals:[{t:'level',n:25},{t:'build',k:'solar',n:1},{t:'build',k:'panel',n:3}],reward:{coins:20000,xp:280}},
 {ch:19,who:'p_piril',title:'Rüzgâr',intro:'Merhaba! Ben Pırıl. Hesaplarıma göre adanın rüzgârı enerji ihtiyacının yüzde altmışını karşılar. Enerji arttıkça bütün üretim hızlanır. Rüzgâr türbini ve şarj istasyonu kurmanı öneririm.',goals:[{t:'level',n:27},{t:'build',k:'wind',n:1},{t:'build',k:'charger',n:1}],reward:{coins:22000,xp:300}},
 {ch:20,who:'p_piril',title:'Kara bulutlar',intro:'Uyarı: Hava modelleri otuz yıl öncekine benzeyen bir fırtına sistemi gösteriyor. Bir veri merkezi kurarsak fırtınayı saniye saniye izleyebiliriz.',goals:[{t:'level',n:29},{t:'build',k:'datacenter',n:1}],reward:{coins:25000,xp:320}},
 {ch:20,who:'p_dede',title:'Dedenin korkusu',intro:'Yine mi fırtına… Bu sefer kimse evsiz kalmasın evlat. Yeşil kuleler kuralım, herkese sıcak kazak dağıtalım.',goals:[{t:'build',k:'ecotower',n:1},{t:'give',k:'sweater',n:4}],reward:{coins:25000,xp:320}},
 {ch:21,who:'p_zeynep',title:'Maglev',intro:'Fırtınadan önce ana karayla bağlantı hızlanmalı. Maglev istasyonu kurarsak tren seferleri üç kat hızlanır.',goals:[{t:'level',n:30},{t:'build',k:'maglev',n:1},{t:'trains',n:5}],reward:{coins:30000,xp:350}},
 {ch:21,who:'p_pilot',title:'Göklerdeki yardımcılar',intro:'Drone merkezi kurarsak siparişleri drone’lar taşır; her teslimat daha kazançlı olur.',goals:[{t:'level',n:31},{t:'build',k:'drone',n:1},{t:'orders',n:30}],reward:{coins:30000,xp:350}},
 {ch:22,who:'p_zeynep',title:'Araştırma',intro:'Son hazırlıklar: araştırma laboratuvarı ve robot fabrikası. Pırıl’ın kardeşleri işçilere yardım edecek.',goals:[{t:'level',n:33},{t:'build',k:'lab',n:1},{t:'build',k:'robotfac',n:1}],reward:{coins:35000,xp:380}},
 {ch:22,who:'p_piril',title:'Erzak',intro:'Fırtına barınakları için erzak hesabı: pasta, pizza, meyve suyu ve bal. Stokları doldurmanı öneririm.',goals:[{t:'level',n:34},{t:'give',k:'cake',n:5},{t:'give',k:'pizza',n:5},{t:'give',k:'juice',n:5},{t:'give',k:'honey',n:5}],reward:{coins:35000,xp:400}},
 {ch:22,who:'p_elif',title:'Fırtına gecesi',intro:'Fırtına geldi! Türbinler dönüyor, fener yanıyor, Pırıl evleri izliyor. Son bir gayret: gemiler ve uçak ana karadan yedek parça getirsin.',goals:[{t:'ships',n:2},{t:'planes',n:1},{t:'coins',n:20000}],reward:{coins:0,xp:600},fx:'finale',
   outro:'Sabah oldu. Fırtına geçti ve ada tek bir ışığını bile kaybetmedi. Dedem fenerin önünde ağlıyor; bu sefer mutluluktan. {KÖY} artık dünyanın en akıllı şehri. Ama ufukta hep yeni bir şey var!'}
];
