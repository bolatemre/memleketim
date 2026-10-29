/* ================= HELPERS ================= */
const $=id=>document.getElementById(id);
const now=()=>Date.now();
const have=k=>S.inv[k]||0;
// Aletler (çivi, kürek, kazma, kereste...) ayrı sandıkta durur, ambar yerini doldurmaz
const invCount=()=>Object.entries(S.inv).reduce((a,[k,v])=>a+(TOOLS.includes(k)?0:v),0);
const canTake=inp=>Object.entries(inp).every(([k,q])=>have(k)>=q);
function take(inp){for(const[k,q]of Object.entries(inp)){S.inv[k]-=q;if(S.inv[k]<=0)delete S.inv[k];}}
function addItem(k,q){S.inv[k]=have(k)+q;}
function fmt(ms){const s=Math.max(0,Math.ceil(ms/1000));if(s<60)return s+' sn';const m=Math.floor(s/60),r=s%60;return m+' dk'+(r?' '+r+' sn':'');}
function rand(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
let toastT;function toast(m){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2100);}
const count=type=>{const[f,m]=famOf(type);return S.ents.filter(e=>e.type===f&&lv(e)>=m).length;};
const lv=e=>e.lv||1,MAXLV=5;
const maxLv=e=>{const d=DEF[e.type];return d&&d.maxL?d.maxL:d&&d.looks?MAXL:MAXLV;};
const UPK=['prod','house','service','hall','market','helipad','airport','barn'];
const barnCap=e=>150+(lv(e)-1)*60; // ambar daha geniş başlar, her seviyede +60
function popTotal(){return S.ents.reduce((a,e)=>a+Math.round((DEF[e.type].pop||0)*(1+.25*(lv(e)-1))),0);}
const has=k=>{const[f,m]=famOf(k);return S.ents.some(e=>e.type===f&&lv(e)>=m);};
function joy(){return S.ents.reduce((a,e)=>a+Math.round((DEF[e.type].joy||0)*(1+.3*(lv(e)-1))),0)+(showOn()?20:0)-(cityC.v&&!cityC.v.health?15:0);}
const showOn=()=>S&&S.showUntil&&now()<S.showUntil;
let cityC={t:0,v:null};
function openPower(){openSheet('⚡ Elektrik',()=>{const c=cityNeeds(),prod=S.ents.filter(e=>e.type==='solar'),use=S.ents.filter(e=>{const d=DEF[e.type];return d&&d.looks&&e.type!=='solar'&&lv(e)>=7;});
    $('sBody').innerHTML=`<div class="stat"><span>Üretim</span><span>${c.supply}</span></div><div class="stat"><span>Tüketim</span><span>${c.demand}</span></div>
    <div class="stat"><span>Durum</span><span style="color:${c.power?'#3a9a2a':'#e2483d'}">${c.power?'Yeterli':'YETERSİZ: üretim %30 yavaş'}</span></div>
    <p class="sub">Köyün temel elektriği (12) bedava. Seviye 7 ve üstündeki her bina 4, her ev 2 elektrik harcar. Enerji binası kurup yükselttikçe üretim artar.</p>
    <div class="sec">Üretenler</div>${prod.length?prod.map(e=>`<div class="stat"><span>Enerji · Sv. ${lv(e)}</span><span>+${Math.round((DEF.solar.energy||0)*(1+.3*(lv(e)-1))*1.5)}</span></div>`).join(''):'<p class="sub">Henüz enerji binan yok.</p>'}
    <div class="sec">Tüketenler</div>${use.length?use.map(e=>`<div class="stat"><span>${DEF[e.type].name} · Sv. ${lv(e)}</span><span>−${DEF[e.type].kind==='house'?2:4}</span></div>`).join(''):'<p class="sub">Henüz elektrik harcayan bina yok (seviye 7’den sonra başlar).</p>'}
    <div style="text-align:center;margin-top:10px">${prod.length?'<button class="btn" id="powGo">Enerji binasına git</button>':'<button class="btn" id="powBuild">Enerji binası kur</button>'}</div>`;
    if($('powGo'))$('powGo').onclick=()=>{const e=prod.sort((a,b)=>lv(a)-lv(b))[0];closeSheet();panTo(e,()=>openUpgrade?openUpgrade(e):null);};
    if($('powBuild'))$('powBuild').onclick=()=>{closeSheet();openShop();};});}
function cityNeeds(){const n=performance.now();if(cityC.v&&n-cityC.t<1000)return cityC.v;const pop=popTotal(),supply=12+Math.round(energy()*1.5);let demand=0;
  if(S.world==='planet'){for(const e of S.ents){const d=DEF[e.type];if(!d||!d.planet)continue;if(d.kind==='prod')demand+=4;else if(d.kind==='house')demand+=2;}
    const v={pop,supply,demand,power:supply>=demand,health:true,school:true};cityC={t:n,v};return v;}
  for(const e of S.ents){const d=DEF[e.type];if(d&&d.looks&&lv(e)>=7)demand+=d.kind==='house'?2:4;}
  const v={pop,supply,demand,power:supply>=demand,health:pop<70||has('hospital'),school:pop<45||has('school')};cityC={t:n,v};return v;}
function energy(){return S.ents.reduce((a,e)=>a+Math.round((DEF[e.type].energy||0)*(1+.3*(lv(e)-1))),0);}
const speedMul=()=>(1-Math.min(.4,energy()/100))*(cityNeeds().power?1:1.3); // elektrik yetmezse üretim yavaşlar
const orderMul=()=>(has('helipad')?1.15:1)*(has('drone')?1.25:1);
const orderSlots=()=>3+(has('helipad')?2:0);
const rentOf=(d,e)=>{const c=cityNeeds();return Math.round(d.coins*(1+.3*((e?lv(e):1)-1))*(1+joy()/100)*(c.health?1:.8)*(c.school?1:.85));};
const qMax=e=>DEF[e.type].looks?3+Math.floor((lv(e)-1)/3):3+lv(e)-1;
const lvSpeed=e=>DEF[e.type].looks?Math.max(.5,1-.035*(lv(e)-1)):1-.08*(lv(e)-1);
function workersUsed(){return S.ents.reduce((a,e)=>a+(DEF[e.type].workers||0),0);}
const RING={x0:4,y0:4,x1:20,y1:20};
function cellUnlocked(x,y){return S.blocks.includes(Math.floor((x-OFF)/BS)+','+Math.floor((y-OFF)/BS));}
function priceOf(k){const d=DEF[k];if(k==='road')return 10;if(k==='panel')return Math.min(4000,d.price+200*count('panel'));if(k==='field')return d.price+10*count('field');return Math.round(d.price*(1+.5*count(k)));}
function roomFor(q){return invCount()+q<=S.cap;}
function gainXP(x){
  S.xp+=x;let up=false;
  while(S.xp>=xpNeed(S.lvl)){S.xp-=xpNeed(S.lvl);S.lvl++;S.coins+=20*S.lvl;S.gems=(S.gems||0)+2;up=true;}
  if(up){
    const un=SHOP.filter(k=>DEF[k].lvl===S.lvl).map(k=>DEF[k].name);
    if(S.lvl===3)un.push('Tren İstasyonu','Ada genişletme');
    const cr=Object.entries(CROPS).filter(([k,c])=>c.lvl===S.lvl).map(([k])=>ITEMS[k].n);
    const all=un.concat(cr);
    if(S.lvl>=3&&S.train.state==='locked'){S.train={state:'here',wagons:genWagons(),back:0};trainArrive();}
    sfx.fanfare();levelUpFx(S.lvl,20*S.lvl,all); // pencere açık olsa bile anında görünür
  }
}
function producible(){
  const l=S.world==='planet'?[]:Object.entries(CROPS).filter(([k,c])=>c.lvl<=S.lvl&&cropOK(k)).map(([k])=>k); // gezegende tarla yok
  const rs=[];for(const e of S.ents){const d=DEF[e.type];if(d.recipes)for(const r of d.recipes)if((d.rl?d.rl[r]<=lv(e):RECIPES[r].lvl<=S.lvl)&&hasIcon(RECIPES[r].out))rs.push(RECIPES[r]);}
  // only items whose whole input chain can be made with what the player owns
  let grew=true;while(grew){grew=false;for(const r of rs){if(l.includes(r.out))continue;if(Object.keys(r.inp).every(k=>l.includes(k))){l.push(r.out);grew=true;}}}
  return l.filter(k=>!TOOLS.includes(k));
}
function genOrder(){const eo=eventOrder();if(eo)return eo;
  if(S.world!=='planet'&&S.flags&&S.flags.cargoOut&&Math.random()<.18){const k=['spacebread','bluecheese','spacehoney','alienfruit'][Math.floor(Math.random()*4)],q=1+Math.floor(Math.random()*2);
    return {id:Math.random().toString(36).slice(2),who:'p_piril',items:{[k]:q},coins:Math.round(ITEMS[k].v*q*3.2),xp:12};}const o=genOrder0();const ev=curEvent();if(ev&&ev.bonus)o.coins=Math.round(o.coins*ev.bonus);return o;}
function genOrder0(){
  let pool=producible().sort(()=>Math.random()-.5);if(!pool.length)pool=S.world==='planet'?['water']:['wheat'];
  const n=Math.min(pool.length,1+Math.floor(Math.random()*(S.lvl>=3?3:2)));
  const items={};let val=0;pool.sort((a,b)=>Math.random()<.6?ITEMS[b].v-ITEMS[a].v:0);
  for(let i=0;i<n;i++){const k=pool[i];const raw=CROPS[k];const q=raw?2+Math.floor(Math.random()*3):1+Math.floor(Math.random()*(ITEMS[k].v>40?1:2));items[k]=q;val+=ITEMS[k].v*q;}
  if(has('cayocagi')&&Math.random()<.3&&hasIcon('cay')){const it={cay:2+Math.floor(Math.random()*3)};if(Math.random()<.5)it.oralet=1+Math.floor(Math.random()*2);
    const v=Object.entries(it).reduce((a,[k,q])=>a+ITEMS[k].v*q,0);const f=FOLK[Math.floor(Math.random()*FOLK.length)];
    return {id:Math.random().toString(36).slice(2),who:'p_dede',folk:f.n+' · '+f.r,tea:true,items:it,coins:Math.round((v*1.6+6)*orderMul()),xp:3};}
  const ppl=['p_elif','p_dede','p_firinci','p_zeynep','p_can','p_nine','p_usta','p_balikci'].concat(S.era>=2?PEOPLE2:[]).concat(S.era>=4?['p_piril']:[]);
  const who=ppl[Math.floor(Math.random()*ppl.length)];
  return {id:Math.random().toString(36).slice(2),who,items,coins:Math.round((val*1.4+5)*orderMul()),xp:Math.max(3,Math.round((val/4+S.lvl)*(has('lab')?1.2:1)))};
}
function genCrates(n){const pool=producible().sort(()=>Math.random()-.5);const w=[];
  for(let i=0;i<n;i++){const k=pool[i%pool.length];const q=CROPS[k]?4+Math.floor(Math.random()*4):1+Math.floor(Math.random()*(ITEMS[k].v>60?2:3));w.push({k,q,done:false});}return w;}
function genWagons(){
  const pool=producible().sort(()=>Math.random()-.5);const w=[];
  for(let i=0;i<3;i++){const k=pool[i%pool.length];const q=CROPS[k]?3+Math.floor(Math.random()*3):1+Math.floor(Math.random()*2);w.push({k,q,done:false});}
  return w;
}

