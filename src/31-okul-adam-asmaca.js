/* ================= OKUL: ADAM ASMACA ================= */
const HM_WORDS={
 'Köy hayatı':['TARLA','KÖPRÜ','KUYU','AHIR','KÜMES','HARMAN','DEĞİRMEN','BOSTAN','SAMAN','ÇEŞME','KOVAN','ÇOBAN','BAHÇE','TRAKTÖR','PATİKA','BAĞ','AMBAR','MANDIRA','ORAK','TIRPAN'],
 'Yemekler':['SİMİT','ÇORBA','PİLAV','BÖREK','KEBAP','LAHMACUN','BAKLAVA','DOLMA','MANTI','AYRAN','KÜNEFE','GÖZLEME','KÖFTE','HELVA','LOKUM','PEYNİR','REÇEL','TARHANA','PASTIRMA','SUCUK','KAYMAK','PİDE','İSKENDER','KAVURMA'],
 'Meslekler':['FIRINCI','ÇİFTÇİ','BALIKÇI','DOKTOR','ÖĞRETMEN','DEMİRCİ','TERZİ','AŞÇI','HEMŞİRE','POLİS','MARANGOZ','BERBER','PİLOT','KAPTAN','MİMAR','MÜHENDİS','KASAP','ŞOFÖR','ECZACI','İTFAİYECİ','ASTRONOT'],
 'Hayvanlar':['KEDİ','KÖPEK','İNEK','KOYUN','KEÇİ','TAVUK','HOROZ','LEYLEK','KARTAL','TİLKİ','TAVŞAN','KAPLUMBAĞA','ZÜRAFA','PENGUEN','KELEBEK','KİRPİ','SİNCAP','ÖRDEK','HAMSİ','YUNUS','ARSLAN','DEVEKUŞU'],
 'Şehirlerimiz':['RİZE','İZMİR','BURSA','KONYA','ADANA','KAYSERİ','TRABZON','ERZURUM','ANTALYA','EDİRNE','MARDİN','SAMSUN','AMASYA','SİVAS','MALATYA','ESKİŞEHİR','GAZİANTEP','ÇANAKKALE','İSTANBUL','DİYARBAKIR'],
 'Doğa':['DAĞ','ORMAN','NEHİR','DENİZ','BULUT','YAĞMUR','KAR','GÖKKUŞAĞI','ŞELALE','VADİ','YAYLA','ÇİÇEK','PAPATYA','LALE','ÇINAR','SÖĞÜT','ADA','GÖL','FIRTINA','YILDIZ'],
 'Spor ve oyun':['FUTBOL','TAVLA','SATRANÇ','GÜREŞ','KALECİ','PENALTI','HAKEM','STADYUM','KUPA','MADALYA','VOLEYBOL','YÜZME','KOŞU','OKÇULUK','HENTBOL','BASKETBOL'],
 'Ev ve eşya':['MASA','KAPI','PENCERE','HALI','KİLİM','SEMAVER','DEMLİK','BARDAK','KAŞIK','TENCERE','YASTIK','YORGAN','MERDİVEN','DOLAP','AYNA','SOBA']};
const HM_ABC='ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ'.split('');
const hmLen=w=>[...w].length;
function hmPick(){const school=S.ents.find(e=>e.type==='school'),L=school?lv(school):1;
  // okul seviyesi yükseldikçe kelimeler uzar: 1-5 kısa, 6-10 orta, 11+ hepsi (uzunlar daha sık)
  const maxLen=L<=5?5:L<=10?7:20,minLen=L>=11?5:3;const cats=Object.keys(HM_WORDS);
  for(let tries=0;tries<50;tries++){const c=cats[Math.floor(Math.random()*cats.length)],ws=HM_WORDS[c].filter(w=>hmLen(w)<=maxLen&&hmLen(w)>=minLen&&!(S.hm.recent||[]).includes(w));
    if(ws.length){const w=ws[Math.floor(Math.random()*ws.length)];S.hm.recent=[w].concat(S.hm.recent||[]).slice(0,40);return {w,c};}}
  return {w:'SİMİT',c:'Yemekler'};}
function hmInit(){const d=dayKey(now());S.hm=S.hm&&S.hm.day===d?S.hm:{day:d,plays:0,streak:(S.hm&&S.hm.streak)||0,wins:(S.hm&&S.hm.wins)||0,recent:(S.hm&&S.hm.recent)||[]};}
function hmSvg(miss,lost,won){const s='stroke="var(--ink-soft,#8a6a4a)" stroke-width="5" stroke-linecap="round" fill="none"',p=[]; // koyu temada da görünsün diye tema renkleri
  p.push(`<line x1="20" y1="190" x2="120" y2="190" ${s}/><line x1="50" y1="190" x2="50" y2="20" ${s}/><line x1="50" y1="20" x2="130" y2="20" ${s}/><line x1="50" y1="50" x2="80" y2="20" ${s}/><line x1="130" y1="20" x2="130" y2="45" ${s}/>`);
  const f=`stroke="${lost?'#e5533d':'var(--ink,#2b2118)'}" stroke-width="4.5" stroke-linecap="round" fill="none"`;
  if(won){const g='stroke="#2e8b2e" stroke-width="4.5" stroke-linecap="round" fill="none"';// kurtuldu: ipten uzakta, yerde el sallıyor
    p.push(`<circle cx="150" cy="122" r="13" ${g}/><path d="M144 124 q6 6 12 0" ${g}/><line x1="150" y1="135" x2="150" y2="166" ${g}/><line x1="150" y1="145" x2="134" y2="156" ${g}/><line x1="150" y1="145" x2="166" y2="128" ${g}/><line x1="150" y1="166" x2="140" y2="188" ${g}/><line x1="150" y1="166" x2="160" y2="188" ${g}/>`);
    return `<svg viewBox="0 0 180 200" width="150" height="166" aria-label="Kurtuldu">${p.join('')}</svg>`;}
  if(miss>0)p.push(`<circle cx="130" cy="62" r="17" ${f}/>`);if(miss>1)p.push(`<line x1="130" y1="79" x2="130" y2="128" ${f}/>`);
  if(miss>2)p.push(`<line x1="130" y1="92" x2="108" y2="112" ${f}/>`);if(miss>3)p.push(`<line x1="130" y1="92" x2="152" y2="112" ${f}/>`);
  if(miss>4)p.push(`<line x1="130" y1="128" x2="112" y2="160" ${f}/>`);if(miss>5)p.push(`<line x1="130" y1="128" x2="148" y2="160" ${f}/>`);
  return `<svg viewBox="0 0 180 200" width="150" height="166" aria-label="Adam asmaca, ${miss}/6 hata">${p.join('')}</svg>`;}
function openHangman(){hmInit();
  if(S.hm.plays>=3&&!S.hm.paid){openSheet('✏️ Adam Asmaca',()=>{$('sBody').innerHTML=`<p class="sub" style="text-align:center">Bugünkü 3 bedava kelimen bitti. Yarın yine gel, ya da devam et:</p><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn" id="hmAd2">🎬 Reklamla oyna</button><button class="btn alt" id="hmGem2">1 ${GEM} ile oyna</button></div>`;
      $('hmAd2').onclick=()=>showRewardedAd(()=>{S.hm.paid=true;closeSheet();openHangman();});$('hmGem2').onclick=()=>{if(spendGems(1)){S.hm.paid=true;closeSheet();openHangman();}};},[]);return;}
  const G={...hmPick(),got:new Set(),bad:new Set(),done:false,win:false,started:false};const MAXM=6;
  const free=()=>S.hm.plays<3;
  openSheet('✏️ Adam Asmaca',()=>{const letters=[...G.w],miss=G.bad.size,lost=G.done&&!G.win;
    const slots=letters.map(ch=>`<span class="hmc ${G.got.has(ch)||G.done?'on':''} ${G.done&&!G.got.has(ch)?'miss':''}">${G.got.has(ch)||G.done?ch:''}</span>`).join('');
    let h=`<div class="hmtop"><div>${hmSvg(miss,lost,G.done&&G.win)}</div><div class="hminfo"><div class="hmcat">Kategori: <b>${G.c}</b></div><div class="hmlife">Kalan hak: <b>${MAXM-miss}</b> / ${MAXM}</div>
      <div class="hmlife">Seri: <b>${S.hm.streak}</b> 🔥 · Bugün: ${Math.min(3,S.hm.plays)}/3 bedava</div></div></div><div class="hmword">${slots}</div>`;
    if(G.done){h+=`<p class="hmres ${G.win?'win':'lose'}">${G.win?'Bildin! 🎉':'Olmadı… Kelime: <b>'+G.w+'</b>'}</p>${G.reward?`<p class="sub" style="text-align:center">${G.reward}</p>`:''}
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn" id="hmNew">${free()?'Yeni kelime (bedava)':'Yeni kelime'}</button></div>`;}
    else{h+=`<div class="hmkb">${HM_ABC.map(ch=>`<button class="hmk ${G.got.has(ch)?'ok':G.bad.has(ch)?'no':''}" data-ch="${ch}" ${G.got.has(ch)||G.bad.has(ch)?'disabled':''}>${ch}</button>`).join('')}</div>
      <div style="text-align:center;margin-top:8px"><button class="btn alt" id="hmHint">💡 Harf aç · 2 ${GEM}</button></div>`;}
    $('sBody').innerHTML=h;
    const finish=()=>{const left=MAXM-G.bad.size;G.done=true;
      if(G.win){const school=S.ents.find(e=>e.type==='school'),L=school?lv(school):1;const coins=30+L*8+left*10+hmLen(G.w)*3;S.coins+=coins;gainXP(5+hmLen(G.w));S.hm.streak++;S.hm.wins++;
        let extra='';if(S.hm.streak%5===0){S.gems=(S.gems||0)+3;extra+=` · ${GEM} +3 (5’li seri!)`;}if(S.hm.wins%10===0){addItem('usta',1);extra+=' · 🎓 Usta Belgesi';}
        G.reward=`${COIN} +${coins} · ⭐ +${5+hmLen(G.w)}${extra}`;sfx.fanfare();}
      else{S.hm.streak=0;sfx.blip&&sfx.blip();}
      changed();};
    const guess=ch=>{if(G.done)return;if(!G.started){G.started=true;if(S.hm.plays>=3)S.hm.paid=false;S.hm.plays++;save();}
      if(G.w.includes(ch)){G.got.add(ch);sfx.pop();if([...G.w].every(c=>G.got.has(c))){G.win=true;finish();}}
      else{G.bad.add(ch);sfx.thud();if(G.bad.size>=MAXM){G.win=false;finish();}}
      sheetCtx();};
    bind('[data-ch]',b=>guess(b.dataset.ch));
    if($('hmHint'))$('hmHint').onclick=()=>{const rest=[...new Set(G.w)].filter(c=>!G.got.has(c));if(rest.length<2){toast('Son harfi sen bul!');return;}if(!spendGems(2))return;guess(rest[Math.floor(Math.random()*rest.length)]);};
    const again=()=>{closeSheet();openHangman();};
    if($('hmNew'))$('hmNew').onclick=again;
  },[]);
}
// ---- seviye atlama kutlaması: her pencerenin üstünde, anında ----
function levelUpFx(lvl,coins,unlocks){let el=document.getElementById('lvlFx');if(!el){el=document.createElement('div');el.id='lvlFx';el.className='lvlfx';document.body.appendChild(el);el.onclick=()=>el.classList.remove('on');}
  el.innerHTML=`<div class="lvlcard"><div class="lvlstar">⭐<span>${lvl}</span></div><div class="lvlt">Seviye ${lvl}!</div><div class="lvld">${COIN} +${coins} · ${GEM} +2</div>${unlocks.length?`<div class="lvlu">Yeni: ${unlocks.join(', ')}</div>`:''}</div>`;
  el.classList.remove('on');void el.offsetWidth;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),3200);}

/* ---- TEST PANELİ: sadece web sürümünde, bağlantının sonuna #uzaytest eklenince (uygulamada hiç görünmez) ---- */
function testPanel(){if(IS_NATIVE||!/uzaytest/.test(location.hash))return;const b=document.createElement('button');b.id='testBtn';b.textContent='🧪';b.className='travelbtn';b.style.bottom='calc(env(safe-area-inset-bottom,0px) + 180px)';b.style.background='radial-gradient(circle at 30% 30%,#ffb347,#c2410c)';b.style.display='';document.body.appendChild(b);
  b.onclick=()=>openSheet('🧪 Uzay testi',()=>{const R=S.rocket;$('sBody').innerHTML=`<p class="sub">Sadece web test sürümünde görünür.</p>
    <div class="row"><div class="mid"><div class="t">1 · Uzaya hazırla</div><div class="d">Seviye 50, bol altın ve malzeme, Uzay Üssü 4. aşama</div></div><button class="btn" id="tt1">Yap</button></div>
    <div class="row"><div class="mid"><div class="t">2 · Yaşam alanını aç</div><div class="d">Gezegende: temel binaları kur, 40 oksijen + 25 kalkan</div></div><button class="btn" id="tt2">Yap</button></div>
    <div class="row"><div class="mid"><div class="t">3 · Roketi hemen vardır</div><div class="d">${R?rocketStatus():'Roket yok'}</div></div><button class="btn" id="tt3">Yap</button></div>
    <div class="row"><div class="mid"><div class="t">4 · Malzeme ekle</div><div class="d">Bu dünyanın ambarına 30’ar adet (Dünya ya da gezegen ürünleri), 5 buzağı, 10 yakıt</div></div><button class="btn" id="tt4">Yap</button></div>
    <div class="row"><div class="mid"><div class="t">5 · Üretimleri bitir</div><div class="d">Bu dünyadaki bütün üretim ve tarlalar hazır olsun</div></div><button class="btn" id="tt5">Yap</button></div>
    <div class="row"><div class="mid"><div class="t">6 · Her şeyi sıfırla</div><div class="d">Kaydı silip baştan başla</div></div><button class="btn alt" id="tt6">Sıfırla</button></div>`;
    const done=m=>{closeSheet();changed();toast('🧪 '+m);};
    $('tt1').onclick=()=>{if(onPlanet())switchWorld('earth',true);S.lvl=Math.max(S.lvl,50);S.coins+=2000000;S.gems=(S.gems||0)+500;for(const[k,q]of Object.entries({steel:60,gear:60,chip:60,usta:10,plank:60,nails:60,feed:40,wheat:60,milk:30,bread:30,cheese:30,corn:40}))S.inv[k]=(S.inv[k]||0)+q;
      let e=S.ents.find(x=>x.type==='spaceport');if(!e){const[gx,gy]=findSpot(2,null,'spaceport');e={id:S.nextId++,type:'spaceport',gx,gy};S.ents.push(e);}e.lv=4;S.quest.i=Math.max(S.quest.i,STORY.length-1);S.quest.gen=null;S.quest.base=snap();questUI();panTo(e,()=>openSpaceport(e));done('Uzay Üssü hazır: dokun ve Fırlat!');};
    $('tt2').onclick=()=>{if(!S.flags||!S.flags.landed){toast('Önce 1. adımı yapıp fırlat');return;}if(!onPlanet())switchWorld('planet',true);
      for(const t of['plair','plair','plfusion','plwater','plshield'])if(S.ents.filter(x=>x.type===t).length<(t==='plair'?2:1)){const[gx,gy]=findSpot(2,null,t);S.ents.push({id:S.nextId++,type:t,gx,gy});}
      S.flags.habitat=true;done('Yaşam alanı açıldı: dükkânda kubbe, ev, sera…');};
    $('tt3').onclick=()=>{if(!S.rocket){toast('Önce fırlat');return;}if(S.rocket.state==='fly'){S.rocket.arrive=now();rocketTick();}done('Roket vardı');};
    $('tt4').onclick=()=>{const ks=onPlanet()?['water','algae','moonwheat','crystal','titanium','spacemilk','alienfruit','fuel']:['plank','nails','steel','gear','bread','cheese','wheat','corn','milk','crystal','titanium'];
      for(const k of ks)S.inv[k]=(S.inv[k]||0)+30;S.inv.calf=(S.inv.calf||0)+5;S.inv.fuel=(S.inv.fuel||0)+10;S.cap=Math.max(S.cap,2000);done('Malzemeler eklendi');};
    $('tt5').onclick=()=>{const t=now();for(const e of S.ents){if(e.q)for(const j of e.q)j.end=Math.min(j.end,t);if(e.crop)e.crop.end=t;}done('Üretimler hazır: binalara dokunup topla');};
    $('tt6').onclick=()=>{if(confirm('Kayıt silinsin mi?')){localStorage.removeItem(KEY);location.reload();}};});}
m3Bind();penBind();ligBind();adsInit();rcInit();setTimeout(testPanel,500);if($('powPill'))$('powPill').onclick=openPower;load();S.world=S.world||'earth';S.flags=S.flags||{};S.worlds=S.worlds||{};if(S.flags.landed)rocketInit();
setInterval(()=>{try{rocketTick();planetTick();spaceHud();}catch(e){console.warn('uzay',e);}},1000);
if($('travelBtn'))$('travelBtn').onclick=travel;if($('rocketPill'))$('rocketPill').onclick=openRocket;if($('o2Pill'))$('o2Pill').onclick=openPlanetInfo;if($('shPill'))$('shPill').onclick=openPlanetInfo;
{const bn=S.ents.find(e=>e.type==='barn');S.cap=Math.max(S.cap||0,bn?barnCap(bn):150);}resize();if(!DEMO)cam.z=clampZ(.72*Math.max(1,Math.min(1.7,Math.min(W,H)/420)));hud();spawnVillagers();spawnVeh();questUI();
$('quest').onclick=openQuest;setInterval(questUI,1500);
const TOWN_SUG=['Yeşilyurt','Akpınar','Karaağaç','Çamlıca','Güzelyalı','Kocatepe','Sarıçiçek','Bereketli'];
function askTownName(after,rename){const box=$('nameBox'),inp=$('townIn');$('nameTitle').textContent=rename?'Köyün yeni adı':'Köyüne bir isim ver';
  inp.value=rename?(S.townName||''):'';$('townSug').innerHTML=TOWN_SUG.map(n=>`<button class="btn ghost" data-n="${n}">${n}</button>`).join('');
  $('townSug').querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{inp.value=b.dataset.n;});
  $('townOk').onclick=()=>{let v=inp.value.trim().replace(/\s+/g,' ').slice(0,18);if(!v){inp.focus();return;}v=v.charAt(0).toLocaleUpperCase('tr')+v.slice(1);
    S.townName=v;save();box.classList.remove('on');hud();if(after)after();};
  inp.onkeydown=ev=>{if(ev.key==='Enter')$('townOk').click();};
  box.classList.add('on');setTimeout(()=>inp.focus(),300);}
setTimeout(()=>{if(!DEMO){unlockTransport();if(S.xp>=xpNeed(S.lvl))gainXP(0);}},2500);
setTimeout(()=>{if(DEMO)return;const go0=()=>{if(S.tut===0){showTut();}else if(S.quest.i===0&&!S.quest.seen){S.quest.seen=true;showQuestTalk();}};const go=()=>checkDaily(()=>{go0();eventNotice();});if(!S.townName)askTownName(go);else go();},700);
requestAnimationFrame(draw);
window.__S=()=>S;

