/* ================= ELMAS VE MAĞAZA (test modu) ================= */
// Mağaza uygulamasında (iOS/Android) sahte ödeme ve sahte reklam GÖSTERİLMEZ (mağaza kuralı). Web sürümünde test modu açık kalır.
const IS_NATIVE=!!(window.Capacitor&&(window.Capacitor.isNativePlatform?window.Capacitor.isNativePlatform():window.Capacitor.platform&&window.Capacitor.platform!=='web'));
// Telefonda her zaman gerçek mağaza (TestFlight'ta Apple'ın ücretsiz deneme ödemesiyle çalışır); test satın alma sadece web sürümünde
Object.defineProperty(window,'TEST_STORE',{get:()=>!IS_NATIVE});
const GEM=`<i class="ic ic-i_gem" role="img" aria-label="elmas"></i>`;
const skipCost=ms=>Math.max(1,Math.ceil(ms/120000));
function spendGems(n){if((S.gems||0)<n){toast('Elmasın yetmiyor');openStore();return false;}S.gems-=n;changed();return true;}
const GEMPACKS=[{id:'g1',g:80,price:'₺49,99'},{id:'g2',g:500,price:'₺249,99',tag:'Popüler'},{id:'g3',g:1200,price:'₺499,99',tag:'En avantajlı'}];
const STARTER={id:'starter',g:150,coins:2000,items:{usta:3,nails:10},price:'₺79,99'};
const GOLDPACKS=[{g:10,c:1000},{g:50,c:6000},{g:100,c:15000}];
function openStore(){openSheet('Mağaza',()=>{const today=dayKey(now()),ads=S.ads&&S.ads.day===today?S.ads.n:0;
  let h=TEST_STORE?`<div class="testbar">TEST MODU · Ödeme alınmaz, sadece sen görürsün</div>`:'';
  h+=`<div class="stat"><span>Elmasın</span><span>${GEM} ${S.gems||0}</span></div>`;
  if(!S.starter)h+=`<div class="row starter"><div class="ico"><img class="ic" src="${IMG_SRC.i_usta}" alt=""></div><div class="mid"><div class="t">Başlangıç Paketi · tek sefer</div><div class="d">${GEM} 150 · ${COIN} 2000 · 3 Usta Belgesi · 10 çivi</div></div><button class="btn" data-buy="starter">${STARTER.price}</button></div>`;
  h+=`<div class="sec">Elmas</div>`+GEMPACKS.map(p=>`<div class="row"><div class="ico"><img class="ic" src="${IMG_SRC.i_gem}" alt=""></div><div class="mid"><div class="t">${p.g} elmas ${p.tag?`<small class="tag">${p.tag}</small>`:''}</div><div class="d">Hızlandırma, ekstra hamle, eksik malzeme</div></div><button class="btn" data-buy="${p.id}">${p.price}</button></div>`).join('');
  if(!TEST_STORE)h+=`<div style="text-align:center;margin-top:6px"><button class="btn ghost" id="rcRestore" style="font-size:13px">Satın almaları geri yükle</button></div>`;
  if(adsAvailable())h+=`<div class="row"><div class="ico">🎬</div><div class="mid"><div class="t">Reklam izle</div><div class="d">+3 elmas · bugün ${5-ads} hakkın kaldı</div></div><button class="btn alt" id="adBtn" ${ads>=5?'disabled':''}>İzle</button></div>`;
  h+=`<div class="sec">Altın</div>`+GOLDPACKS.map((p,i)=>`<div class="row"><div class="ico">${COIN}</div><div class="mid"><div class="t">${p.c.toLocaleString('tr')} altın</div></div><button class="btn alt" data-gold="${i}" ${(S.gems||0)<p.g?'disabled':''}>${p.g} ${GEM}</button></div>`).join('');
  h+=`<p class="sub">Elmas nereden gelir: her seviye atlayışta +2, bulmacada her 10 bölümde +3, 7. gün ödülünde +5${TEST_STORE?', reklam izleyerek veya satın alarak':''}.</p>`;
  $('sBody').innerHTML=h;
  bind('[data-buy]',b=>buyPack(b.dataset.buy));bind('[data-gold]',b=>{const p=GOLDPACKS[+b.dataset.gold];if(!spendGems(p.g))return;S.coins+=p.c;sfx.coin();toast('+'+p.c+' altın');changed();sheetCtx();});
  if($('adBtn'))$('adBtn').onclick=()=>showRewardedAd(()=>{const d=dayKey(now());S.ads=S.ads&&S.ads.day===d?S.ads:{day:d,n:0};S.ads.n++;S.gems=(S.gems||0)+3;sfx.coin();toast('+3 elmas');changed();openStore();});
  if($('rcRestore'))$('rcRestore').onclick=()=>rcRestore();
  rcShowPrices();});}
/* ---------- SATIN ALMA (RevenueCat) ---------- */
// Ürün kimlikleri App Store Connect / Google Play Console'daki gerçek IAP ürün ID'leriyle birebir aynı olmalı.
const RC_PRODUCT_ID={g1:'gems_80',g2:'gems_500',g3:'gems_1200',starter:'starter_pack'};
const RC={ready:false,initing:false,offerings:null,err:''};
function rcPlugin(){const C=window.Capacitor;if(!C)return null;if(C.Plugins&&C.Plugins.Purchases)return C.Plugins.Purchases;
  if(C.registerPlugin)try{const p=C.registerPlugin('Purchases');if(p)return p;}catch(e){}
  // AdMob'daki gibi: JS köprüsü yoksa doğrudan yerel köprüyü kullan
  if(C.nativePromise){const call=(m,o)=>C.nativePromise('Purchases',m,o||{});return {configure:o=>call('configure',o),getOfferings:()=>call('getOfferings'),getProducts:o=>call('getProducts',o),
    purchasePackage:o=>call('purchasePackage',o),purchaseStoreProduct:o=>call('purchaseStoreProduct',o),restorePurchases:()=>call('restorePurchases')};}
  return null;}
async function rcInit(){if(!IS_NATIVE||RC.ready||RC.initing)return;const P=rcPlugin();if(!P){RC.err='RevenueCat eklentisi bulunamadı';return;}
  RC.initing=true;
  try{
    // Public API Key: RevenueCat panelinden alınır, platforma göre farklıdır.
    const plat=window.Capacitor.getPlatform();
    const apiKey=plat==='ios'?'appl_hucRofDBxUqIZsVRaarYGlMLLZH':'goog_emjJVuNkVldiRAWNpOZnuSWrNmR';
    await P.configure({apiKey});
    RC.p=P;RC.ready=true;RC.err='';
  }catch(e){RC.err=String(e&&e.message||e);console.warn('RevenueCat başlatılamadı',e);}
  RC.initing=false;}
async function rcGetOfferings(){if(!RC.ready)await rcInit();if(!RC.ready)return null;
  try{const r=await RC.p.getOfferings();RC.offerings=r.current||null;return RC.offerings;}catch(e){RC.err=String(e&&e.message||e);return null;}}
const rcCancelled=e=>!!e&&(e.userCancelled||String(e.code)==='1'||e.code==='PURCHASE_CANCELLED_ERROR'||/cancel/i.test(String(e.message||'')));
let RC_PRODUCTS=null;
async function rcProducts(){if(RC_PRODUCTS)return RC_PRODUCTS;if(!RC.ready)await rcInit();if(!RC.ready)return null;
  try{const r=await RC.p.getProducts({productIdentifiers:Object.values(RC_PRODUCT_ID),type:'NON_SUBSCRIPTION'});RC_PRODUCTS=(r&&r.products)||[];return RC_PRODUCTS;}catch(e){RC.err=String(e&&e.message||e);return null;}}
// Mağazadaki gerçek, yerel para birimindeki fiyatı düğmelere yaz
async function rcShowPrices(){if(TEST_STORE||!IS_NATIVE)return;const ps=await rcProducts();if(!ps)return;
  for(const[id,pid]of Object.entries(RC_PRODUCT_ID)){const pr=ps.find(x=>x.identifier===pid),b=document.querySelector(`[data-buy="${id}"]`);if(pr&&b)b.textContent=pr.priceString;}}
async function rcPurchase(productId){if(RC.busy)return null;if(!RC.ready)await rcInit();if(!RC.ready){toast('Mağazaya bağlanılamadı, biraz sonra tekrar dene');return null;}
  RC.busy=true;
  try{
    const offerings=RC.offerings||await rcGetOfferings();
    const pkg=offerings&&offerings.availablePackages&&offerings.availablePackages.find(x=>x.product.identifier===productId);
    if(pkg)return await RC.p.purchasePackage({aPackage:pkg});
    // ürün bir Offering'e eklenmemiş olsa bile doğrudan mağazadan satın al
    const ps=await rcProducts(),pr=ps&&ps.find(x=>x.identifier===productId);
    if(!pr){toast('Ürün mağazada bulunamadı: '+productId);return null;}
    return await RC.p.purchaseStoreProduct({product:pr});
  }catch(e){
    if(rcCancelled(e))return null; // kullanıcı iptal etti, hata gösterme
    toast('Satın alma tamamlanamadı, tekrar dene');console.warn('RevenueCat satın alma hatası',e);return null;
  }finally{RC.busy=false;}}
async function rcRestore(){if(!RC.ready)await rcInit();if(!RC.ready)return;
  try{const info=await RC.p.restorePurchases();toast('Geçmiş satın almalar geri yüklendi');return info;}
  catch(e){toast('Geri yükleme başarısız');console.warn(e);}}

function buyPack(id){const p=id==='starter'?STARTER:GEMPACKS.find(x=>x.id===id);if(!p)return;
  if(TEST_STORE){
    S.gems=(S.gems||0)+p.g;if(p.coins)S.coins+=p.coins;for(const[k,q]of Object.entries(p.items||{}))addItem(k,q);if(id==='starter')S.starter=true;
    sfx.fanfare();toast(`Test satın alma: +${p.g} elmas`);changed();sheetCtx();return;
  }
  const productId=RC_PRODUCT_ID[id];if(!productId){toast('Ürün tanımlı değil');return;}
  rcPurchase(productId).then(res=>{
    if(!res)return; // iptal edildi ya da hata (zaten toast gösterildi)
    S.gems=(S.gems||0)+p.g;if(p.coins)S.coins+=p.coins;for(const[k,q]of Object.entries(p.items||{}))addItem(k,q);if(id==='starter')S.starter=true;
    sfx.fanfare();toast(`Satın alındı: +${p.g} elmas`);changed();sheetCtx();
  });}
/* ---------- ÖDÜLLÜ REKLAM (AdMob) ---------- */
const ADS={ready:false,ios:'ca-app-pub-6236520075152909/2429015849',android:'ca-app-pub-6236520075152909/2469166410',busy:false}; // Köyden Şehre ödüllü reklam birimleri
function admobPlugin(){const C=window.Capacitor;if(!C)return null;if(C.Plugins&&C.Plugins.AdMob)return C.Plugins.AdMob;if(C.registerPlugin)try{const p=C.registerPlugin('AdMob');if(p)return p;}catch(e){}
  if(C.nativePromise){const call=(m,o)=>C.nativePromise('AdMob',m,o||{});return {initialize:o=>call('initialize',o),prepareRewardVideoAd:o=>call('prepareRewardVideoAd',o),showRewardVideoAd:()=>call('showRewardVideoAd'),
    addListener:async(ev,cb)=>{if(C.addListener)return C.addListener('AdMob',ev,cb);return {remove(){}};}};}return null;}
const nativePlugins=()=>{const C=window.Capacitor;try{return (C.PluginHeaders||[]).map(p=>p.name).join(', ');}catch(e){return '';}};
async function adsInit(){if(!IS_NATIVE||ADS.ready||ADS.initing)return;const P=admobPlugin();if(!P){ADS.err='AdMob eklentisi bulunamadı ('+(nativePlugins()||'eklenti listesi boş')+')';return;}
  ADS.initing=true;try{await P.initialize({requestTrackingAuthorization:true,initializeForTesting:false});ADS.p=P;ADS.ready=true;ADS.err='';
    // AB/İngiltere kullanıcıları için Google'ın zorunlu reklam izni (GDPR) formu; AdMob'da "Gizlilik ve mesajlaşma" mesajı açıksa gösterilir
    try{const ci=await P.requestConsentInfo();if(ci&&ci.isConsentFormAvailable&&String(ci.status).toUpperCase()==='REQUIRED')await P.showConsentForm();}catch(e){}}catch(e){ADS.err=String(e&&e.message||e);console.warn('reklam başlatılamadı',e);}ADS.initing=false;}
// Reklam düğmeleri cihazda her zaman görünür; hazır değilse basınca yeniden denenir
const adsAvailable=()=>true;
async function showRewardedAd(onReward){if(ADS.busy)return;if(!IS_NATIVE){watchAd(onReward);return;}
  if(!ADS.ready){await adsInit();if(!ADS.ready){toast('Reklam şu an yüklenemedi, biraz sonra tekrar dene');return;}}
  ADS.busy=true;let rewarded=false;
  try{const plat=window.Capacitor.getPlatform();await ADS.p.prepareRewardVideoAd({adId:plat==='ios'?ADS.ios:ADS.android});
    const h=await ADS.p.addListener('onRewardedVideoAdReward',()=>{rewarded=true;});const r=await ADS.p.showRewardVideoAd();if(r)rewarded=true;try{h.remove();}catch(e){}}
  catch(e){ADS.err=String(e&&e.message||e);toast('Reklam şu an yok (yeni reklam birimleri ilk saatlerde boş dönebilir). Biraz sonra tekrar dene.');}
  ADS.busy=false;if(rewarded){onReward();}}
function watchAd(done){const o=document.createElement('div');o.className='adov';let n=3;o.innerHTML=`<div><b>Reklam</b><p>Burada gerçek bir reklam gösterilecek.</p><span id="adN">${n}</span></div>`;document.body.appendChild(o);
  const iv=setInterval(()=>{n--;const el=document.getElementById('adN');if(el)el.textContent=n;if(n<=0){clearInterval(iv);o.remove();done();}},1000);}
function missingGemCost(items,coins){let g=0;for(const[k,q]of Object.entries(items||{})){const m=Math.max(0,q-have(k));if(m)g+=m*(TOOLS.includes(k)?(k==='usta'?15:3):Math.max(1,Math.ceil((ITEMS[k].v||5)/15)));}
  g+=Math.ceil(Math.max(0,(coins||0)-S.coins)/100);return g;}
function fillMissing(items,coins){const g=missingGemCost(items,coins);if(!g||!spendGems(g))return false;for(const[k,q]of Object.entries(items||{})){const m=Math.max(0,q-have(k));if(m)addItem(k,m);}S.coins=Math.max(S.coins,coins||0);return true;}
function skipJob(e){const t=now(),j=curJob(e,t);if(!j)return;const left=j.end-t,c=skipCost(left);if(!spendGems(c))return;for(const k of e.q)if(k.end>=j.end){k.end-=left;if(k.start)k.start-=left;}sfx.pop();tutEvent('skip');changed();}

