/* ================= HUD ================= */
function hud(){
  {const m=gameMin(),h=m/60,ez=VAKIT.find(([n,s])=>s>m)||VAKIT[0];$('clock').textContent=(h>=6.5&&h<19.5?'☀️ ':'🌙 ')+hhmm(m);$('clockPill').title='Sıradaki ezan: '+ez[0]+' '+hhmm(ez[1]);}
  $('lvl').textContent=S.lvl;$('coins').textContent=S.coins;if($('gems'))$('gems').textContent=S.gems||0;$('xp').style.width=Math.min(100,S.xp/xpNeed(S.lvl)*100)+'%';
  $('pop').textContent=(popTotal()-workersUsed())+'/'+popTotal();
  if(typeof spaceHud==='function')try{spaceHud();}catch(e){}
  {const g=S.gems||0;if(hud.lg!==undefined&&g>hud.lg){const n=g-hud.lg,pill=$('gems')&&$('gems').closest('div');if(pill){pill.classList.remove('gempop');void pill.offsetWidth;pill.classList.add('gempop');
      const r=pill.getBoundingClientRect(),f=document.createElement('div');f.className='gemfly';f.textContent='+'+n+' 💎';f.style.left=(r.left-8)+'px';f.style.top=(r.top+r.height/2-14)+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),1600);}}hud.lg=g;}
  {const c=cityNeeds(),show=c.demand>0||has('solar')||S.era>=2,p=$('powPill');if(p){p.style.display=show?'':'none';$('pow').textContent=`⚡ ${c.supply}/${c.demand}`;p.classList.toggle('low',!c.power);}}
  const n=S.orders.filter(o=>canTake(o.items)).length;const b=$('ordBadge');b.textContent=n;b.classList.toggle('on',n>0);
}
function migrateV3(o){if(!o||!o.ents)return o;const keep=[],best={};
  for(const e of o.ents){let[f,m]=famOf(e.type);if(!DEF[f]){keep.push(e);continue;}
    if(f!==e.type||DEF[f].looks){const oldLv=Math.max(1,Math.min(5,e.lv||1));e.type=f;e.lv=Math.min(MAXL,Math.max(m,1)+(oldLv-1)*2);}
    if(DEF[f]&&DEF[f].unique){if(best[f]){const b=best[f];if((e.lv||1)>(b.lv||1)){b.lv=e.lv;}continue;}best[f]=e;}
    keep.push(e);}
  o.ents=keep;if(o.gems===undefined)o.gems=25;o.migrated=true;return o;}
// Liman = seviye 8+ Balıkçı, Havalimanı = seviye 10+ Hava Ulaşımı (evrimli binalarda)
const isHarbor=e=>e.type==='harbor'||(e.type==='balikci'&&lv(e)>=8);
const isAirport=e=>e.type==='airport'||(e.type==='helipad'&&lv(e)>=10);
function unlockTransport(){if(S.ship&&S.ship.state==='locked'&&S.ents.some(isHarbor)){S.ship={state:'here',crates:genCrates(4),back:0};if(!DEMO)toast('Kargo gemisi limana yanaştı! Balıkçı’ya dokun.');}
  if(S.plane&&S.plane.state==='locked'&&S.ents.some(isAirport)){S.plane={state:'here',crates:genCrates(6),back:0};if(!DEMO)toast('Kargo uçağı hazır! Hava Ulaşımı’na dokun.');}}
function eraReq(){const fs=S.ents.filter(e=>DEF[e.type]&&DEF[e.type].looks&&e.type!=='hall');const a=fs.length?fs.reduce((s,e)=>s+lv(e),0)/fs.length:0,c=cityNeeds();
  return {2:[['Binaların ortalama seviyesi 4,5',a>=4.5],['Nüfus 35',c.pop>=35],['Cami',has('cami1')]],
    3:[['Binaların ortalama seviyesi 8',a>=8],['Nüfus 80',c.pop>=80],['Okul',has('school')],['Hastane',has('hospital')],['Elektrik yeterli',c.power]],
    4:[['Binaların ortalama seviyesi 12',a>=12],['Nüfus 150',c.pop>=150],['Stadyum',has('stadium')],['Enerji seviye 10',S.ents.some(e=>e.type==='solar'&&lv(e)>=10)],['Elektrik yeterli',c.power]]};}
function townEra(){const r=eraReq();let era=1;for(const k of[2,3,4]){if(r[k].every(x=>x[1]))era=k;else break;}return era;}
function changed(){if(!DEMO){unlockTransport();{const vs=[S.era,has('hospital'),has('post'),Math.floor(popTotal()/45),S.ents.filter(e=>e.type==='field').length>=2,S.ents.filter(e=>e.type==='field').length>=4].join();if(vs!==changed.vs){if(changed.vs!==undefined)spawnVeh();changed.vs=vs;}}const cn=cityNeeds();if(!cn.power&&now()-(changed.pw||0)>300000){changed.pw=now();toast('⚡ Elektrik yetmiyor: Enerji binasını yükselt, yoksa üretim yavaşlar.');}const te=S.world==='planet'?S.era:townEra();if(te>S.era){S.era=te;spawnVillagers();spawnVeh();setTimeout(()=>talk('p_baskan',`${S.townName||'Köyümüz'} büyüdü! Artık bir ${ERA_NAME[te].toLocaleLowerCase('tr')} olduk.`,[['Yaşasın!',null]]),400);}}if(sheetCtx)refreshSheet();hud();saveSoon();}
setInterval(()=>{save();hud();},4000);setInterval(()=>{const m=gameMin(),h=m/60;$('clock').textContent=(curEvent()?'🎉 ':'')+(h>=6.5&&h<19.5?'☀️ ':'🌙 ')+hhmm(m);if(m===360&&!DEMO)sfx.rooster();},1000);
$('clockPill').onclick=()=>{const m=gameMin(),ez=VAKIT.find(([n,s])=>s>m)||VAKIT[0],ev=curEvent();toast((ev?ev.n+' · ':'')+SEASON_NAME[season()]+' · Saat '+hhmm(m)+' · Sıradaki ezan: '+ez[0]+' '+hhmm(ez[1]));};
$('sndPill').onclick=openSound;if($('gemPill'))$('gemPill').onclick=()=>openStore();setTimeout(soundPill,0);document.addEventListener('visibilitychange',save);

