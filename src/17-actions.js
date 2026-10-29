/* ================= ACTIONS ================= */
function centerOf(e){const s=DEF[e.type].size;return iso(e.gx+s/2,e.gy+s/2);}
function tapEnt(e){
  const d=DEF[e.type],t=now();e.bounce=t;const c=centerOf(e);
  switch(d.kind){
    case 'villager':{sfx.blip();const w=e.who,again=e.react&&t-e.react.t0<6000;e.taps=again?(e.taps||0)+1:0;
      const text=e.taps>=2?w.annoyed[Math.floor(Math.random()*w.annoyed.length)]:w.lines[Math.floor(Math.random()*w.lines.length)];
      e.react={t0:t,text};e.wait=3400;e.moving=false;return;}
    case 'field':
      if(!e.crop){openPlant(e);return;}
      if(t<e.crop.end){const left=e.crop.end-t,c=skipCost(left);openSheet('Tarla',()=>{$('sBody').innerHTML=`<div class="row"><div class="ico">${ic(e.crop.c)}</div><div class="mid"><div class="t">${ITEMS[e.crop.c].n} büyüyor</div><div class="d">${fmt(e.crop.end-now())} kaldı</div></div><button class="btn alt" id="grow">Hemen yetiştir ${c} ${GEM}</button></div>`;$('grow').onclick=()=>{if(!spendGems(c))return;e.crop.start-=e.crop.end-now();e.crop.end=now();closeSheet();tutEvent('skip');changed();};});return;}
      {const cr=CROPS[e.crop.c];if(!roomFor(cr.yield)){barnFull();return;}
       addItem(e.crop.c,cr.yield);stat('harvest',e.crop.c,cr.yield);sfx.pop();floatText(c.x,c.y-30,'+'+cr.yield,'i_'+e.crop.c);gainXP(cr.xp);e.crop=null;tutEvent('harvest');
       // harvest neighbours that are ripe too
       let n=0;for(const f of S.ents)if(f.type==='field'&&f.crop&&t>=f.crop.end&&roomFor(CROPS[f.crop.c].yield)){const q=CROPS[f.crop.c].yield;addItem(f.crop.c,q);stat('harvest',f.crop.c,q);gainXP(CROPS[f.crop.c].xp);const fc=centerOf(f);floatText(fc.x,fc.y-30,'+'+q,'i_'+f.crop.c);f.crop=null;n++;}
       questTick();changed();}
      return;
    case 'prod':{
      const done=(e.q||[]).filter(j=>t>=j.end);
      if(done.length){let got=0;for(const j of done){const r=RECIPES[j.r];if(!roomFor(r.q)){barnFull();break;}addItem(r.out,r.q);stat('made',r.out,r.q);(r.out==='milk'?sfx.moo:(r.out==='cay'||r.out==='oralet')?sfx.clink:sfx.pop)();gainXP(r.xp);floatText(c.x,c.y-100-got*28,'+'+r.q,'i_'+r.out);got++;e.q.splice(e.q.indexOf(j),1);}
        if(got){questTick();changed();return;}}
      openProd(e);return;}
    case 'house':{const end=(e.last||0)+d.every*1000;
      if(t>=end){const r=rentOf(d,e);S.coins+=r;sfx.coin();e.last=t;gainXP(1);floatText(c.x,c.y-110,'+'+r,'i_coin');changed();}
      else openInfo(e,`${d.pop?'Kira':'Gelir'}: ${fmt(end-t)} sonra ${rentOf(d,e)} ${COIN}`);return;}
    case 'service':if(e.type==='spaceport'){openSpaceport(e);return;}openService(e);return;
    case 'panel':openPanel(e);return;
    case 'helipad':if(isAirport(e)){openSheet(DEF[e.type].name,()=>{$('sBody').innerHTML='<p class="sub">Havalimanın hazır. Kargo uçağını yükleyip gönder.</p><div style="text-align:center"><button class="btn" id="goPlane">✈️ Kargo uçağı</button></div>';$('goPlane').onclick=()=>{closeSheet();openPlane();};},heads(e));return;}openService(e);return;
    case 'airport':openPlane();return;
    case 'barn':openBarn(e);return;
    case 'hall':openHall(e);return;
    case 'market':openMarket(e);return;
    case 'station':openTrain();return;
    case 'deco':openDeco(e);return;
    case 'obstacle':openObstacle(e);return;
    case 'ruin':openRuin(e);return;
    case 'monument':openSheet(d.name,()=>{$('sBody').innerHTML='<p class="sub">Ufuk Feneri yeniden yanıyor. Sis dağıldı, gemiler adaya dönüyor.</p>';});return;
  }
}
function barnFull(){toast('Ambar dolu. Ambarı yükselt ya da ürün sat.');}

