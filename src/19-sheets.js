/* ================= SHEETS ================= */
let sheetCtx=null,sheetTimer=null;
function openSheet(title,render,head){
  $('sTitle').textContent=title;$('sHead').innerHTML='';
  if(head){for(const[label,fn]of head){const b=document.createElement('button');b.className='btn alt';b.textContent=label;b.onclick=fn;$('sHead').appendChild(b);}}
  sheetCtx=render;render();$('veil').classList.add('on');$('sheet').classList.add('on');hideTalk();sheetOpenedAt=performance.now();
  clearInterval(sheetTimer);sheetSame=0;sheetTimer=setInterval(()=>{if(sheetCtx&&!sheetBusy()&&sheetSame<2)refreshSheet(true);},700);
}
// Kaydırılabilir listelerde parmak biraz kayınca iPhone tıklamayı iptal ediyordu: kısa dokunuşu kendimiz tıklamaya çeviriyoruz
{let tp=null;
 document.addEventListener('pointerdown',ev=>{const b=ev.target.closest('button,[role=button]');tp=b&&!b.disabled?{b,x:ev.clientX,y:ev.clientY,t:performance.now()}:null;},true);
 let lastTap=null;
 document.addEventListener('pointerup',ev=>{if(!tp)return;let{b,x,y,t}=tp;tp=null;
   if(!b.isConnected){const nb=document.elementFromPoint(ev.clientX,ev.clientY);const nb2=nb&&nb.closest('button,[role=button]');if(nb2&&nb2.textContent===b.textContent&&JSON.stringify(nb2.dataset)===JSON.stringify(b.dataset))b=nb2;else return;}
   if(b.disabled)return;
   if(Math.hypot(ev.clientX-x,ev.clientY-y)<18&&performance.now()-t<800&&b.contains(document.elementFromPoint(ev.clientX,ev.clientY)||b)){lastTap={t:performance.now(),x:ev.clientX,y:ev.clientY};b.click();}},true);
 document.addEventListener('click',ev=>{if(ev.isTrusted&&lastTap&&performance.now()-lastTap.t<700&&Math.hypot(ev.clientX-lastTap.x,ev.clientY-lastTap.y)<40){ev.stopImmediatePropagation();ev.preventDefault();}},true);}
// Parmak ekrandayken veya az önce dokunulmuşsa içerik yenilenmez; yoksa butonlar dokunma anında değişip tıklama kayboluyordu
let touchT=0,touching=false;
const sheetBusy=()=>touching||performance.now()-touchT<900;
// Yenilemede sadece değişen satırlar değiştirilir; resimli listeyi her 0,7 sn baştan çizmek telefonu yoruyordu
let sheetSame=0;
function refreshSheet(fromTimer){const real=$('sBody'),st=real.scrollTop,tmp=document.createElement('div');tmp.style.display='none';
  real.parentNode.insertBefore(tmp,real);real.id='';tmp.id='sBody';
  try{sheetCtx();}catch(e){console.warn(e);}finally{tmp.remove();tmp.id='';real.id='sBody';}
  if(tmp.innerHTML===real.innerHTML){if(fromTimer)sheetSame++;real.scrollTop=st;return;}sheetSame=0;
  const a=[...real.childNodes],b=[...tmp.childNodes];
  if(a.length!==b.length)real.replaceChildren(...b);
  else for(let i=0;i<a.length;i++){const x=a[i],y=b[i];if(x.nodeType!==y.nodeType||(x.outerHTML??x.textContent)!==(y.outerHTML??y.textContent))real.replaceChild(y,x);}
  real.scrollTop=st;}
for(const id of['sheet','sBody']){const el=$(id);
  el.addEventListener('pointerdown',()=>{touching=true;touchT=performance.now();},true);
  el.addEventListener('scroll',()=>{touchT=performance.now();},true);}
addEventListener('pointerup',()=>{if(touching){touching=false;touchT=performance.now();}},true);
addEventListener('pointercancel',()=>{touching=false;touchT=performance.now();},true);
function closeSheet(){$('veil').classList.remove('on');$('sheet').classList.remove('on');sheetCtx=null;clearInterval(sheetTimer);}
// Telefonda binaya dokununca pencere açılıyor, aynı dokunuşun ardından gelen tıklama perdeye düşüp pencereyi hemen kapatıyordu
let sheetOpenedAt=0;
$('sClose').onclick=closeSheet;$('veil').onclick=()=>{if(performance.now()-sheetOpenedAt<500)return;closeSheet();};
$('sBody').addEventListener('click',ev=>{const n=ev.target.closest('[data-need]');if(n)goProducer(n.dataset.need);});
function panTo(e,cb){const c=centerOf(e),sx=cam.x,sy=cam.y,t0=performance.now();cam.z=Math.max(cam.z,.85);
  const go=()=>{const k=Math.min(1,(performance.now()-t0)/650),q=1-(1-k)*(1-k);cam.x=sx+(c.x-sx)*q;cam.y=sy+(c.y-sy)*q;if(k<1)requestAnimationFrame(go);else{e.bounce=now();cb&&cb();}};go();}
function goProducer(k){let e=null;
  if(CROPS[k])e=S.ents.find(x=>x.type==='field');
  else{const types=Object.keys(DEF).filter(b=>DEF[b].recipes&&DEF[b].recipes.includes(k));e=S.ents.find(x=>types.includes(x.type));
    if(!e&&types.length){closeSheet();toast(`${ITEMS[k].n} için önce ${DEF[types[0]].name} kurmalısın.`);openShop();return;}}
  if(!e){toast(sourceOf(k));return;}
  closeSheet();panTo(e,()=>{if(CROPS[k]){toast(`${ITEMS[k].n}: boş tarlaya dokun ve ek.`);}else openProd(e);});}
function sourceOf(k){if(CROPS[k])return `${ITEMS[k].n} tarlada yetişir.`;
  const r=RECIPES[k];if(!r)return `${ITEMS[k].n} tren, gemi ve uçak seferlerinden gelir.`;
  const where=Object.keys(DEF).filter(b=>DEF[b].recipes&&DEF[b].recipes.includes(k)).map(b=>DEF[b].name).join(' veya ');
  const inp=Object.entries(r.inp).map(([x,q])=>q+' '+ITEMS[x].n.toLowerCase()).join(' + ');
  return `${ITEMS[k].n}: ${where}’da üretilir${inp?' ('+inp+')':''}.`+(r.lvl>S.lvl?` Seviye ${r.lvl} gerekir.`:'');}
const needHTML=inp=>Object.entries(inp).map(([k,q])=>have(k)<q?`<span class="need miss" data-need="${k}" role="button">${ic(k)} ${ITEMS[k].n} ${have(k)}/${q}</span>`:`<span class="need">${ic(k)} ${have(k)}/${q}</span>`).join('')||'<span class="need">Malzeme gerekmez</span>';
const moveBtn=e=>['Taşı',()=>{closeSheet();startMove(e);}];
const upBtn=e=>UPK.includes(DEF[e.type].kind)&&lv(e)<maxLv(e)?['Yükselt',()=>openUpgrade(e)]:null;
const flipBtn=e=>['↔ Çevir',()=>{e.flip=!e.flip;e.bounce=now();sfx.blip();changed();}];
const NODEMO=['hall','barn','ruin','obstacle'];
const demoBtn=e=>NODEMO.includes(e.type)||!DEF[e.type]?null:['🧨 Yık',()=>openDemolish(e)];
function openDemolish(e){const d=DEF[e.type],back=Math.round((d.price||0)*.25);
  openSheet(d.name+' yıkılsın mı?',()=>{$('sBody').innerHTML=`<p class="sub">Bina tamamen kalkar, yeri boşalır. ${(e.q&&e.q.length)?'<b>Üretimdeki ürünler de kaybolur.</b> ':''}Geri dönüşüm: ${COIN} ${back}.</p>
    <div style="display:flex;gap:8px;justify-content:center"><button class="btn alt" id="dmNo">Vazgeç</button><button class="btn" id="dmYes" style="background:linear-gradient(#ef6a5d,#d9443a)">Yık</button></div>`;
    $('dmNo').onclick=closeSheet;$('dmYes').onclick=()=>{const c=centerOf(e);S.ents=S.ents.filter(x=>x!==e);S.coins+=back;closeSheet();sfx.thud();floatText(c.x,c.y-40,'+'+back,'i_coin');changed();toast(d.name+' yıkıldı');};});}
function openPanel(e){openSheet('Güneş Paneli',()=>{const c=cityNeeds();$('sBody').innerHTML=`<p class="sub">${DEF.panel.desc}</p><div class="stat"><span>Bu panel</span><span>+3 ⚡</span></div><div class="stat"><span>Toplam panel</span><span>${count('panel')}</span></div><div class="stat"><span>Elektrik</span><span style="color:${c.power?'#3a9a2a':'#e2483d'}">${c.supply} / ${c.demand}</span></div>
  <div style="text-align:center;margin-top:8px"><button class="btn" id="pnMore">Bir panel daha · ${priceOf('panel')} ${COIN}</button></div>`;$('pnMore').onclick=()=>startPlace('panel');},heads(e));}
const heads=(e,...x)=>[moveBtn(e),flipBtn(e),upBtn(e),...x,demoBtn(e)].filter(Boolean);
function upCost(e){const d=DEF[e.type],L=lv(e),base=d.price||800;
  if(!d.looks){const items=L===1?{nails:3}:L===2?{nails:6,plank:3}:L===3?{plank:6,steel:3}:{steel:6,gear:4};return {coins:Math.round(base*.6*L),items,lvl:(d.lvl||1)+2*L};}
  const n=L+1,band=Math.ceil(n/3),items=band===1?{nails:1+L}:band===2?{nails:2+L,plank:1+Math.floor(L/2)}:band===3?{plank:L,steel:Math.floor(L/2)}:band===4?{steel:L-3,gear:Math.floor(L/3)}:{gear:L-6,chip:Math.floor(L/4)};
  if(n>=16){delete items.chip;items.gear=L-6;items.crystal=2*(n-15);items.titanium=n-15;}
  if([4,7,10,13,16,19].includes(n))items.usta=1;
  return {coins:Math.round(base*(.5+.4*Math.pow(L,1.5))),items,lvl:(d.lvl||1)+Math.floor(L*2.3)};}
function upEffect(e){const d=DEF[e.type],L=lv(e);const out=[];
  if(d.kind==='barn')out.push(`Ambar kapasitesi ${barnCap(e)} → ${barnCap({...e,lv:L+1})}`);
  if(d.looks){const nl=lookIdxL(d,L+1);if(nl!==lookIdx(e)&&IMG_SRC[d.looks[nl]])out.push(`<span>Yeni görünüş!</span><img src="${IMG_SRC[d.looks[nl]]}" alt="" style="width:120px">`);
    if(d.rl)for(const[r,m]of Object.entries(d.rl))if(m===L+1&&hasIcon(RECIPES[r].out))out.push(`Yeni ürün: ${ic(RECIPES[r].out)} ${ITEMS[RECIPES[r].out].n}`);}
  if(d.looks&&L+1===7&&e.type!=='solar')out.push(`⚡ Bu seviyeden sonra ${d.kind==='house'?2:4} elektrik harcar`);
  if(e.type==='solar')out.push(`⚡ Elektrik üretimi artar`);
  if(d.kind==='prod'){const nx={...e,lv:L+1};if(qMax(nx)>qMax(e))out.push(`Üretim sırası ${qMax(e)} → ${qMax(nx)}`);out.push(`Üretim hızı +%${Math.round((1-lvSpeed(nx))*100)}`);}
  if(d.pop)out.push(`Nüfus ${Math.round(d.pop*(1+.25*(L-1)))} → ${Math.round(d.pop*(1+.25*L))}`);
  if(d.kind==='house'&&d.coins)out.push(`Gelir ${rentOf(d,e)} → ${Math.round(d.coins*(1+.3*L)*(1+joy()/100))}`);
  if(d.joy)out.push(`Mutluluk ${Math.round(d.joy*(1+.3*(L-1)))} → ${Math.round(d.joy*(1+.3*L))}`);
  if(d.energy)out.push(`Enerji ${Math.round(d.energy*(1+.3*(L-1)))} → ${Math.round(d.energy*(1+.3*L))}`);
  if(d.kind==='market')out.push(`Satış fiyatı +%${10*L}`);
  if(d.kind==='helipad'||d.kind==='airport')out.push('Daha gösterişli bir görünüm ve +5 mutluluk');
  return out;}
function openUpgrade(e){const d=DEF[e.type];
  openSheet(d.name+' · Yükselt',()=>{const L=lv(e),MX=maxLv(e);if(L>=MX){$('sBody').innerHTML='<p class="sub">Bu bina en yüksek seviyede.</p>';return;}
    const c=upCost(e),lock=S.lvl<c.lvl,ok=!lock&&S.coins>=c.coins&&canTake(c.items);
    $('sBody').innerHTML=`<div class="stat"><span>Bina seviyesi</span><span>${MX>5?'Sv. '+L+' / '+MX:'★'.repeat(L)+'☆'.repeat(MX-L)}</span></div>
    <div class="sec">Seviye ${L+1} ile</div>${upEffect(e).map(x=>`<div class="stat"><span>${x}</span></div>`).join('')}
    <div class="sec">Gerekenler</div><div class="row"><div class="mid"><div class="d">${lock?'Oyuncu seviyesi '+c.lvl+' gerekir':needHTML(c.items)+' '+COIN+' '+c.coins}</div></div>
    <button class="btn alt" id="doUp" ${ok?'':'disabled'}>Yükselt</button></div>${!lock&&!ok?`<div style="text-align:right"><button class="btn" id="fillUp">Eksikleri tamamla · ${missingGemCost(c.items,c.coins)} ${GEM}</button></div>`:''}
    <p class="sub">Çivi, çelik, dişli ve çip Demirci’de; kereste Değirmen’de yapılır. <b>Usta Belgesi</b> bulmacada her 5 bölümde ve 7. gün ödülünde gelir.</p>`;
    if($('fillUp'))$('fillUp').onclick=()=>{if(fillMissing(c.items,c.coins)){changed();sheetCtx();}};
    $('doUp').onclick=()=>{const c2=upCost(e);if(S.lvl<c2.lvl||S.coins<c2.coins||!canTake(c2.items))return;S.coins-=c2.coins;take(c2.items);e.lv=lv(e)+1;e.bounce=now();
      const cc=centerOf(e);for(let i=0;i<8;i++)PUFFS.push({x:cc.x+(Math.random()-.5)*110,y:cc.y-Math.random()*80,t0:now()-Math.random()*700});
      floatText(cc.x,cc.y-120,'Seviye '+e.lv+'!');if(e.type==='market'&&e.lv>=5&&S.flags&&!S.flags.cart){S.flags.cart=true;const[cx,cy]=findSpot(1,null,'market');S.ents.push({id:S.nextId++,type:'deco',img:'d_cart',gx:cx,gy:cy});setTimeout(()=>toast('🎁 Pazarın büyüdü: meyve arabası hediye!'),600);}gainXP(10*e.lv);sfx.fanfare();if(e.type==='barn')S.cap=Math.max(S.cap,barnCap(e));
      if(has('harbor')&&S.ship.state==='locked')S.ship={state:'here',crates:genCrates(4),back:0};if(has('airport')&&S.plane.state==='locked')S.plane={state:'here',crates:genCrates(6),back:0};S.st.upgrades=(S.st.upgrades||0)+1;closeSheet();questTick();changed();};});}
function bind(sel,fn){$('sBody').querySelectorAll(sel).forEach(b=>b.onclick=()=>fn(b));}

function openPlant(e){
  openSheet('Tarlaya ek',()=>{
    $('sBody').innerHTML='<p class="sub">Ne ekmek istersin?</p>'+Object.entries(CROPS).filter(([k])=>cropOK(k)).map(([k,c])=>{const lock=c.lvl>S.lvl;
      return `<div class="row"><div class="ico">${ic(k)}</div><div class="mid"><div class="t">${ITEMS[k].n}</div>
      <div class="d">${lock?'Seviye '+c.lvl+' gerekir':fmt(c.t*1000)+', '+c.yield+' adet çıkar'}</div></div>
      <button class="btn ${!lock&&S.coins<c.cost?'dis':''}" data-k="${k}" ${lock?'disabled':''}>${c.cost?`<span style="${S.coins<c.cost?'color:#c0392b':''}">${c.cost}</span> `+COIN:'Ücretsiz'}</button></div>`;}).join('')
      +`<div class="row"><div class="mid"><div class="t">Boş tarlaların hepsine ek</div><div class="d">Seçtiğin ürün tüm boş tarlalara ekilir.</div></div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${Object.entries(CROPS).filter(([k,c])=>c.lvl<=S.lvl&&cropOK(k)).map(([k])=>`<button class="btn alt" data-all="${k}">${ic(k)} Hepsine</button>`).join('')}</div>`;
    const noMoney=k=>{const c=CROPS[k];toast(`Altının yetmiyor: ${ITEMS[k].n} ekmek için ${c.cost} altın lazım, sende ${S.coins} var. Sipariş teslim et ya da hasat edip sat.`);sfx.blip&&sfx.blip();};
    const plant=(f,k)=>{const c=CROPS[k];if(S.coins<c.cost)return false;S.coins-=c.cost;const t=now();f.crop={c:k,start:t,end:t+c.t*1000};return true;};
    bind('[data-k]',b=>{if(plant(e,b.dataset.k)){closeSheet();tutEvent('plant');changed();}else noMoney(b.dataset.k);});
    bind('[data-all]',b=>{const k=b.dataset.all;const empty=S.ents.filter(f=>f.type==='field'&&!f.crop).length;let n=0;for(const f of S.ents)if(f.type==='field'&&!f.crop&&plant(f,k))n++;
      if(!n){noMoney(k);return;}closeSheet();toast(n+' tarlaya '+ITEMS[k].n.toLowerCase()+' ekildi'+(n<empty?` · altın bittiği için ${empty-n} tarla boş kaldı`:''));changed();});
  },[moveBtn(e)]);
}
function openProd(e){
  const d=DEF[e.type];
  openSheet(d.name,()=>{
    const t=now();e.q=e.q||[];const cj=curJob(e,t);let h=cj?`<div class="row skip"><div class="mid"><div class="t">${ITEMS[RECIPES[cj.r]?RECIPES[cj.r].out:'bread']?ITEMS[RECIPES[cj.r]?RECIPES[cj.r].out:'bread'].n:''} hazırlanıyor · ${fmt(cj.end-t)}</div></div><button class="btn alt" id="skipJ">Bitir ${skipCost(cj.end-t)} ${GEM}</button></div>`:'';h+='<div class="queue">';
    for(let i=0;i<qMax(e);i++){const j=e.q[i];
      if(!j){h+='<div class="empty"></div>';continue;}const done=t>=j.end;
      h+=`<div class="${done?'done':''}">${ic(RECIPES[j.r].out)}<small>${done?'Hazır':t<j.start?'Sırada':pillTime(j.end-t)}</small></div>`;}
    h+='</div>';
    if(e.q.some(j=>t>=j.end))h+='<p class="sub">Hazır ürünleri almak için binaya dokun.</p>';
    if(d.pen)h+=`<p class="sub">${d.pen==='a_cow'?'İnekler yemle beslenince işçi kız süt sağar.':d.pen==='a_chicken'?'Tavuklar yemlenince yumurtlar.':'Koyunlar havuçla beslenince yünleri kırkılır.'}</p>`;
    for(const k of d.recipes.filter(x=>hasIcon(RECIPES[x].out))){const r=RECIPES[k],need=d.rl?d.rl[k]:0,lock=d.rl?need>lv(e):r.lvl>S.lvl,full=e.q.length>=qMax(e);
      h+=`<div class="row"><div class="ico">${ic(r.out)}</div><div class="mid"><div class="t">${ITEMS[r.out].n}${r.q>1?' ×'+r.q:''}</div>
      <div class="d">${lock?(d.rl?'Bina seviyesi '+need+' gerekir':'Seviye '+r.lvl+' gerekir'):needHTML(r.inp)+' '+fmt(r.t*1000*speedMul()*lvSpeed(e))}</div></div>
      <button class="btn" data-r="${k}" ${lock||full||!canTake(r.inp)?'disabled':''}>${d.pen?'Besle':'Üret'}</button></div>`;}
    $('sBody').innerHTML=h;if($('skipJ'))$('skipJ').onclick=()=>{skipJob(e);sheetCtx();};
    bind('[data-r]',b=>{const r=RECIPES[b.dataset.r];if(!canTake(r.inp)||e.q.length>=qMax(e))return;take(r.inp);
      const t=now(),st=e.q.length?Math.max(t,e.q[e.q.length-1].end):t;e.q.push({r:b.dataset.r,start:st,end:st+Math.round(r.t*1000*speedMul()*lvSpeed(e))});
      tutEvent('produce');changed();});
  },isHarbor(e)?heads(e,['Gemi',()=>{closeSheet();openShip();}]):e.type==='cayocagi'?heads(e,['Tavla',()=>{closeSheet();openTavla();}]):heads(e));
}
function openInfo(e,text){const d=DEF[e.type];openSheet(d.name,()=>{$('sBody').innerHTML=`<p class="sub">${text}</p>${d.pop?`<div class="stat"><span>Nüfus katkısı</span><span>+${d.pop}</span></div>`:''}<div class="stat"><span>Mutluluk bonusu</span><span>+%${joy()}</span></div><div class="stat"><span>Bina seviyesi</span><span>${maxLv(e)>5?'Sv. '+lv(e)+' / '+maxLv(e):'★'.repeat(lv(e))+'☆'.repeat(MAXLV-lv(e))}</span></div>`;},heads(e));}
function openService(e){const d=DEF[e.type];openSheet(d.name,()=>{$('sBody').innerHTML=`<p class="sub">${d.desc||''}</p>
  <div class="stat"><span>Kasabanın mutluluğu</span><span>${joy()} (kiralar +%${joy()})</span></div><div class="stat"><span>Toplam enerji</span><span>${energy()} (üretim %${Math.round((1-speedMul())*100)} hızlı)</span></div>`+(d.show?`<div class="sec">Gösteri</div>
  <div class="row"><div class="mid"><div class="t">${showOn()?'Gösteri sürüyor! '+fmt(S.showUntil-now()):'Horon, zeybek, halay!'}</div><div class="d">${needHTML({ayran:3,simit:3})} · 2 dakika boyunca köylüler oynar, mutluluk +20</div></div>
  <button class="btn alt" id="show" ${showOn()||(!(curEvent()&&curEvent().freeShow)&&!canTake({ayran:3,simit:3}))?'disabled':''}>${curEvent()&&curEvent().freeShow?'Bedava başlat':'Başlat'}</button></div>`:'');
  if(e.type==='school'){hmInit();$('sBody').insertAdjacentHTML('beforeend',`<div class="sec">Ders arası</div><div class="row"><div class="ico">✏️</div><div class="mid"><div class="t">Adam Asmaca</div><div class="d">Öğretmenin kelimesini bul: altın ve yıldız. Üst üste 5 bilene 3 elmas, her 10 bilişte Usta Belgesi. Bugün ${Math.max(0,3-S.hm.plays)} bedava hak.</div></div><button class="btn" id="hmGo">Oyna</button></div>`);$('hmGo').onclick=()=>{closeSheet();openHangman();};}
  if(d.penalty){$('sBody').insertAdjacentHTML('beforeend','<div style="text-align:center;margin-top:10px;display:flex;gap:8px;justify-content:center"><button class="btn" id="goLig">🏆 Köyler Ligi</button><button class="btn alt" id="goPen">⚽ Penaltı at</button></div>');$('goLig').onclick=()=>{closeSheet();openLig();};$('goPen').onclick=()=>{closeSheet();openPenalty();};}
  if(d.kahve){$('sBody').insertAdjacentHTML('beforeend','<div style="text-align:center;margin-top:10px"><button class="btn" id="goTavla">🎲 Tavla oyna</button></div>');$('goTavla').onclick=()=>{closeSheet();openTavla();};}
  if($('show'))$('show').onclick=()=>{const fr=curEvent()&&curEvent().freeShow;if(showOn()||(!fr&&!canTake({ayran:3,simit:3})))return;if(!fr)take({ayran:3,simit:3});S.showUntil=now()+120000;gainXP(15);closeSheet();toast('Davullar çalıyor, gösteri başladı!');changed();};},heads(e));}
function openRoad(x,y){openSheet('Toprak yol',()=>{$('sBody').innerHTML='<p class="sub">Bu yolu kaldırabilirsin.</p><button class="btn alt" id="rmRoad">Yolu kaldır</button>';
  $('rmRoad').onclick=()=>{S.roads=S.roads.filter(p=>!(p[0]===x&&p[1]===y));rebuildRoads();closeSheet();changed();};});}
function openBarn(e){
  openSheet('Ambar',()=>{
    const ks=Object.keys(ITEMS).filter(k=>have(k)>0&&!TOOLS.includes(k)),ts=Object.keys(ITEMS).filter(k=>have(k)>0&&TOOLS.includes(k)),cost={nails:2+S.capLvl*2},cc=100*(S.capLvl+1);
    $('sBody').innerHTML=`<div class="stat"><span>Ürünler</span><span>${invCount()} / ${S.cap}</span></div>`+
      (ks.length?`<div class="inv">${ks.map(k=>`<div><b>${ic(k)}</b><span>${ITEMS[k].n}: ${have(k)}</span></div>`).join('')}</div>`:'<p class="sub">Ambar boş.</p>')+
      `<div class="sec">Alet sandığı · sınırsız, ambarda yer kaplamaz</div>`+
      (ts.length?`<div class="inv">${ts.map(k=>`<div><b>${ic(k)}</b><span>${ITEMS[k].n}: ${have(k)}</span></div>`).join('')}</div>`:'<p class="sub">Henüz alet yok.</p>')+
      `<p class="sub">Ambarı <b>Yükselt</b> ile geliştir: her seviyede +60 yer ve yeni bir görünüş.</p>`;
  },e?heads(e):null);
}
function openHall(e){
  openSheet((S.townName||'Köy')+' Belediyesi',()=>{const p=popTotal(),u=workersUsed();
    $('sBody').innerHTML=`<div class="stat"><span>${ERA_NAME[S.era]} adı</span><span>${S.townName||'-'} <button class="btn ghost" id="renameTown">Değiştir</button></span></div><div class="stat"><span>Çağ</span><span>${ERA_NAME[S.era]}</span></div><div class="stat"><span>Mevsim</span><span>${SEASON_NAME[season()]}${curEvent()?' · 🎉 '+curEvent().n:''}</span></div><div class="stat"><span>Mutluluk</span><span>${joy()}</span></div><div class="stat"><span>Enerji</span><span>${energy()}</span></div><div class="stat"><span>Toplam nüfus</span><span>${p}</span></div><div class="stat"><span>Çalışan işçi</span><span>${u}</span></div>
    <div class="stat"><span>Boştaki işçi</span><span>${p-u}</span></div><div class="stat"><span>Açık bölge</span><span>${S.blocks.length}</span></div>
    ${(()=>{const c=cityNeeds(),r=eraReq(),nx=S.era<4?S.era+1:null;
      return `<div class="sec">Şehir durumu</div><div class="stat"><span>⚡ Elektrik</span><span style="color:${c.power?'#3a9a2a':'#e2483d'}">${c.supply} / ${c.demand} ${c.power?'yeterli':'YETERSİZ: üretim yavaş'}</span></div>
      <div class="stat"><span>🏥 Sağlık</span><span>${c.health?'İyi':'Hastane lazım: mutluluk ve kira düşük'}</span></div><div class="stat"><span>🏫 Eğitim</span><span>${c.school?'İyi':'Okul lazım: kira düşük'}</span></div>
      ${nx?`<div class="sec">${ERA_NAME[nx]} olmak için</div>${r[nx].map(([n,ok])=>`<div class="stat"><span>${ok?'✅':'⬜'} ${n}</span></div>`).join('')}`:''}`;})()}
    <p class="sub">Yeni üretim binaları işçi ister. Daha fazla işçi için kulübe ve konak kur.</p>
    <div class="sec">Çağ vitrini</div><p class="sub">Her çağın gelişmiş hâlini gez. Kendi kaydın etkilenmez.</p>
    <div style="display:flex;gap:6px;flex-wrap:wrap">${[1,2,3,4].map(i=>`<button class="btn alt" data-demo="${i}">${ERA_NAME[i]}</button>`).join('')}</div>
    <div class="sec">Altın nasıl kazanılır?</div>
    <div class="stat"><span>Siparişler: köylülerin istediklerini teslim et</span></div>
    <div class="stat"><span>Kira: evlerin üstünde altın çıkınca dokun</span></div>
    <div class="stat"><span>Tren, gemi, uçak: vagonları doldur, her biri ödeme yapar</span></div>
    <div class="stat"><span>Hikâye görevleri: sol üstteki görev büyük ödül verir</span></div>
    <div class="stat"><span>Pazar: fazla ürünü sat</span></div>
    <div class="stat"><span>Mutluluk ve bina yükseltme kiraları artırır</span></div>`;
    bind('[data-demo]',b=>enterDemo(+b.dataset.demo));if($('renameTown'))$('renameTown').onclick=()=>{closeSheet();askTownName(null,true);};},heads(e));
}
const marketPrice=(e,k)=>Math.max(1,Math.floor(ITEMS[k].v*(.6+.02*(lv(e)-1))));
function openMarket(e){const d=DEF[e.type];
  openSheet(d.name||'Pazar',()=>{
    const ks=Object.keys(ITEMS).filter(k=>have(k)>0&&ITEMS[k].v>0&&!['usta','axe','shovel','pickaxe','hammer'].includes(k));
    const need={};for(const o of S.orders||[])for(const[k,q]of Object.entries(o.items))need[k]=(need[k]||0)+q;
    let h=`<p class="sub">Fazla ürünleri sat. Pazar yükseldikçe fiyatlar artar (şu an değerinin %${Math.round((.6+.02*(lv(e)-1))*100)}’i).</p>`;
    h+=ks.length?ks.map(k=>{const p=marketPrice(e,k),n=have(k),w=need[k]?`<span style="color:var(--berry)">· siparişte ${need[k]} lazım</span>`:'';
      return `<div class="row mkrow"><div class="ico">${ic(k)}</div><div class="mid"><div class="t">${ITEMS[k].n}</div><div class="d">Elinde: ${n} · tanesi ${p} ${COIN} ${w}</div>
        <div class="mkctl"><button class="btn alt mkb" data-d="${k}" data-v="-1">−</button><input type="number" inputmode="numeric" class="mkin" id="mk_${k}" min="1" max="${n}" value="1">
        <button class="btn alt mkb" data-d="${k}" data-v="1">+</button><button class="btn mkb" data-s="${k}">Sat</button><button class="btn alt mkb" data-all="${k}">Hepsi (${n})</button></div></div></div>`;}).join(''):'<p class="sub">Satacak ürün yok.</p>';
    $('sBody').innerHTML=h;
    const sell=(k,q)=>{q=Math.max(0,Math.min(have(k),Math.floor(q)||0));if(!q)return;if(need[k]&&have(k)-q<need[k]&&!sell.ok){sell.ok=1;toast(`${ITEMS[k].n} siparişte lazım; yine de satmak için tekrar bas`);return;}
      sell.ok=0;const p=marketPrice(e,k)*q;take({[k]:q});S.coins+=p;sfx.coin();const c=centerOf(e);floatText(c.x,c.y-60,'+'+p,'i_coin');toast(`${q} ${ITEMS[k].n.toLocaleLowerCase('tr-TR')} satıldı: +${p} altın`);changed();sheetCtx();};
    bind('[data-s]',b=>sell(b.dataset.s,+$('mk_'+b.dataset.s).value));
    bind('[data-all]',b=>sell(b.dataset.all,have(b.dataset.all)));
    bind('[data-d]',b=>{const i=$('mk_'+b.dataset.d);i.value=Math.max(1,Math.min(have(b.dataset.d),(+i.value||1)+(+b.dataset.v)));});
  },heads(e));
}
function openDeco(e){
  openSheet('Süs',()=>{$('sBody').innerHTML=`<p class="sub">Üstteki <b>Taşı</b> ile istediğin yere götür ya da kaldır. Basılı tutup sürükleyerek de taşıyabilirsin.</p><div class="row"><div class="ico"><img class="ic" src="${IMG_SRC[e.img]}" alt=""></div>
    <div class="mid"><div class="t">Kaldır</div><div class="d">Yer açılır, 2 yıldız kazanırsın.</div></div>
    <button class="btn alt" id="rm" ${S.coins<10?'disabled':''}>10 ${COIN}</button></div>`;
    $('rm').onclick=()=>{if(S.coins<10)return;S.coins-=10;gainXP(2);S.ents=S.ents.filter(x=>x!==e);closeSheet();changed();};},[moveBtn(e),flipBtn(e)]);
}
function openObstacle(e){
  const o=OBST[e.img];
  openSheet(o.n,()=>{const ok=have(o.tool)>0;
    $('sBody').innerHTML=`<div class="row"><div class="ico"><img class="ic" src="${IMG_SRC[e.img]}" alt=""></div>
    <div class="mid"><div class="t">Temizle</div><div class="d">${ic(o.tool)} ${ITEMS[o.tool].n} gerekir (elinde ${have(o.tool)}). Ödül: 20 ${COIN}, 5 yıldız.</div></div>
    <button class="btn" id="clr" ${ok?'':'disabled'}>Temizle</button></div>
    ${ok?'':`<p class="sub">${ITEMS[o.tool].n}, Demirci’de yapılır ya da trenden ödül olarak gelir.</p>`}`;
    $('clr').onclick=()=>{if(!have(o.tool))return;take({[o.tool]:1});S.coins+=20;gainXP(5);S.st.cleared++;const c=centerOf(e);floatText(c.x,c.y-40,'+20','i_coin');if(o.gift){for(const[gk,gq]of Object.entries(o.gift))addItem(gk,gq);setTimeout(()=>toast('Kristal kayalardan '+Object.values(o.gift)[0]+' enerji kristali çıktı!'),300);}S.ents=S.ents.filter(x=>x!==e);
      if(Math.random()<.35){addItem('map',1);setTimeout(()=>toast('Kütüğün altından bir harita parçası çıktı!'),300);}questTick();closeSheet();changed();};});
}
function openOrders(){
  openSheet('Siparişler',()=>{
    $('sBody').innerHTML='<div class="orders">'+S.orders.map((o,i)=>{const ok=canTake(o.items);
      return `<div class="order"><div class="who"><img src="${IMG_SRC[o.tea?(IMG_SRC.f_12?'f_12':o.who):o.who]}" alt="">${o.bayram?'🎉 '+o.bayram+' · '+o.folk:o.tea?'Çay siparişi · '+o.folk:PEOPLE[o.who]}</div>
      <div class="items">${Object.entries(o.items).map(([k,q])=>`<span class="it" ${have(k)<q?`data-need="${k}" role="button"`:''}>${ic(k)}<em class="${have(k)<q?'miss':''}">${have(k)}/${q}</em></span>`).join('')}</div>
      <div class="foot"><span class="reward">${COIN} ${o.coins} ⭐ ${o.xp}</span><span><button class="btn ghost" data-skip="${i}">Değiştir</button>
      <button class="btn ${ok?'':'dis'}" data-ok="${i}" aria-disabled="${!ok}">Teslim et</button></span></div></div>`;}).join('')+'</div>';
    bind('[data-ok]',b=>{const i=+b.dataset.ok,o=S.orders[i];if(!canTake(o.items)){const m=Object.entries(o.items).filter(([k,q])=>have(k)<q).map(([k,q])=>(q-have(k))+' '+ITEMS[k].n.toLocaleLowerCase('tr'));toast('Eksik: '+m.join(', ')+'. Kırmızı ürüne dokun, seni üretildiği yere götüreyim.');return;}take(o.items);S.coins+=o.coins;S.st.orders++;sfx.coin();S.orders[i]=genOrder();heliGo();questTick();toast(PEOPLE[o.who]+': Teşekkürler! +'+o.coins+' altın · +'+o.xp+' ⭐');gainXP(o.xp);tutEvent('order');changed();});
    bind('[data-skip]',b=>{S.orders[+b.dataset.skip]=genOrder();changed();});
    while(S.orders.length<orderSlots())S.orders.push(genOrder());
  });
}
function openTrain(){
  if(S.train.state==='locked'){toast('Tren istasyonu seviye 3’te açılır');return;}
  openSheet('Tren',()=>{const t=now();
    if(S.train.state==='away'){const c=skipCost(S.train.back-t);$('sBody').innerHTML=`<p class="sub">Tren yolda. ${fmt(S.train.back-t)} sonra yeni yüklerle döner.</p><div style="text-align:center"><button class="btn alt" id="trSkip">Hemen getir ${c} ${GEM}</button></div>`;$('trSkip').onclick=()=>{if(!spendGems(c))return;S.train.back=now();closeSheet();};return;}
    const all=S.train.wagons.every(w=>w.done);
    $('sBody').innerHTML='<p class="sub">Vagonları doldur, her vagon altın kazandırır. Hepsi dolunca treni gönder; dönüşte alet getirir.</p><div class="wag">'+
      S.train.wagons.map((w,i)=>{const pay=Math.round(ITEMS[w.k].v*w.q*1.2);return `<div class="w ${w.done?'full':''}">${ic(w.k)}<div class="t">${ITEMS[w.k].n}</div>
      <div class="d">${w.done?(w.skipped?'Boş gidiyor':'Yüklendi'):have(w.k)+' / '+w.q}</div>${w.done?'':`<button class="btn" data-w="${i}" ${have(w.k)>=w.q?'':'disabled'}><span>Yükle +${pay}</span></button> <button class="btn ghost" data-skip="${i}">Boş geç</button>`}</div>`;}).join('')+
      `</div><div style="margin-top:14px;text-align:center"><button class="btn alt" id="go" ${all&&!trainAnim?'':'disabled'}>Treni gönder</button></div>`;
    bind('[data-skip]',b=>{const w=S.train.wagons[+b.dataset.skip];if(!w.done){w.done=true;w.skipped=true;changed();}});
    bind('[data-w]',b=>{const w=S.train.wagons[+b.dataset.w];if(w.done||have(w.k)<w.q)return;take({[w.k]:w.q});w.done=true;const pay=Math.round(ITEMS[w.k].v*w.q*1.2);S.coins+=pay;gainXP(3);changed();});
    $('go').onclick=()=>{if(!S.train.wagons.every(w=>w.done))return;
      const pool=['nails','nails','shovel','axe','pickaxe'];const k=pool[Math.floor(Math.random()*pool.length)],q=k==='nails'?3:1;
      addItem(k,q);gainXP(10);S.st.trains++;S.train={state:'away',wagons:[],back:now()+T_TRAIN()};questTick();trainLeave();closeSheet();
      talk('p_balikci',`Tren yola çıktı! Bu seferki hediyen: ${q} ${ITEMS[k].n}. ${has('maglev')?'On':'Otuz'} dakika sonra geri gelir.`,[['Süper',null]]);changed();};
  });
}
function blockCost(){const k=S.blocks.length-3;const it={shovel:Math.min(6,k),nails:2*k};if(k>=4)it.pickaxe=Math.floor(k/2);return {coins:Math.round(250*Math.pow(k,1.3)),items:it,lvl:3+Math.floor((k-1)/2)};}
function canUnlock(key){const[bx,by]=key.split(',').map(Number);if(S.blocks.includes(key))return false;
  return [[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>S.blocks.includes((bx+a)+','+(by+b)));}
function blockHint(key){return LM_AT[key]?`<p class="sub">Bu bulutların altında ${LM[LM_AT[key][0]].n.toLowerCase()} var gibi görünüyor…</p>`:'';}
function openExpand(key){
  if(!canUnlock(key)){toast('Önce bu bölgeye komşu bir alanı aç');return;}
  openSheet('Yeni bölge',()=>{const c=blockCost(),lock=S.lvl<c.lvl,ok=!lock&&S.coins>=c.coins&&canTake(c.items);
    $('sBody').innerHTML=`<p class="sub">Bulutların altındaki ${BS}×${BS} alan adana katılır. İçinden çıkan kütük ve kayaları aletlerle temizlersin.</p>${blockHint(key)}
    <div class="row"><div class="ico"><img class="ic" src="${IMG_SRC.x_sign}" alt=""></div><div class="mid"><div class="d">${lock?'Seviye '+c.lvl+' gerekir':needHTML(c.items)+` <span class="need ${S.coins<c.coins?'miss':''}">${COIN} ${S.coins.toLocaleString('tr-TR')}/${c.coins.toLocaleString('tr-TR')}</span>`}</div></div>
    <button class="btn alt" id="unl" ${lock?'disabled':''}>Aç</button></div>
    ${!lock&&canTake(c.items)&&S.coins<c.coins?`<div class="row"><div class="mid"><div class="t">Altının yetmiyor</div><div class="d">Eksik ${(c.coins-S.coins).toLocaleString('tr-TR')} altını elmasla tamamla</div></div><button class="btn" id="unlGem">${Math.ceil((c.coins-S.coins)/100)} ${GEM}</button></div>`:''}
    <p class="sub">Kürek ve çivi Demirci’de yapılır; tren de ödül olarak getirir.</p>`;
    if($('unlGem'))$('unlGem').onclick=()=>{const c2=blockCost(),miss=c2.coins-S.coins;if(miss<=0)return;if(!spendGems(Math.ceil(miss/100)))return;S.coins+=miss;$('unl').click();};
    $('unl').onclick=()=>{const c2=blockCost();
      if(S.lvl<c2.lvl){toast('Seviye '+c2.lvl+' gerekir');return;}
      if(!canTake(c2.items)){const m=Object.entries(c2.items).filter(([k,q])=>have(k)<q).map(([k,q])=>(q-have(k))+' '+ITEMS[k].n.toLocaleLowerCase('tr-TR'));toast('Eksik: '+m.join(', ')+'. Kırmızı ürüne dokun, seni üretildiği yere götüreyim.');return;}
      if(S.coins<c2.coins){toast(`${(c2.coins-S.coins).toLocaleString('tr-TR')} altın eksik: siparişleri teslim et ya da elmasla tamamla.`);return;}S.coins-=c2.coins;take(c2.items);S.blocks.push(key);seedBlock(key,false);addItem('map',1);gainXP(15);closeSheet();toast('Yeni bölge açıldı! +1 harita parçası');questTick();changed();};});
}
let shopTab=-1;
const SHOPF=['field','road','panel','cottage','bakery','cayocagi','cami1','cowpen','feedmill','market','coop','dairy','balikci','halkoyun','kebapci','mine','smith','sheepfold','school','post','weaving','hospital','stadium','jamfactory','orchard','beehive','solar','helipad'];
function openShop(){
  shopTab=0;ERAS[0].list=S.world==='planet'?PSHOPF:SHOPF.filter(k=>!DEF[k]||!DEF[k].planet);
  openSheet('İnşa et',()=>{const free=popTotal()-workersUsed(),era=ERAS[shopTab];
    let h='';
    if(false)h+=`<p class="sub">${ERA_LOCK[shopTab+1]}</p><button class="btn alt" id="seeEra">Bu çağı vitrinde gör</button>`;
    else h+=`<p class="sub">Boştaki işçi: ${free} · Mutluluk: ${joy()} · Enerji: ${energy()}</p>`+era.list.filter(k=>k==='field'||k==='road'||IMG_SRC[DEF[k].img]).map(k=>{const d=DEF[k],lr=lockReason(d),lock=!!lr,p=priceOf(k),nw=d.workers||0,noW=nw>free,built=d.unique&&count(k)>0;
      const ico=k==='field'?`<img src="${IMG_SRC.f_plot}" alt="">`:k==='road'?`<img src="${IMG_SRC.t_dirt}" alt="" style="border-radius:8px;transform:scale(.8,.5) rotate(45deg)">`:`<img src="${IMG_SRC['th_'+d.img]||IMG_SRC[d.img]}" alt="" loading="lazy" decoding="async">`;
      return `<div class="row"><div class="ico">${ico}</div><div class="mid"><div class="t">${d.name}</div>
      <div class="d">${lock?lr:d.desc+(nw?` ${nw} işçi.`:'')}${!lock&&noW&&!built?' <b style="color:var(--berry)">İşçi yetmiyor</b>':''}</div></div>
      <button class="btn alt" data-b="${k}" ${lock||S.coins<p||noW||built?'disabled':''}>${built?'Kuruldu':p+' '+COIN}</button></div>`;}).join('');
    $('sBody').innerHTML=h;
    bind('[data-tab]',b=>{shopTab=+b.dataset.tab;sheetCtx();});
    if($('seeEra'))$('seeEra').onclick=()=>enterDemo(shopTab+1);
    bind('[data-b]',b=>startPlace(b.dataset.b));
  });
}

