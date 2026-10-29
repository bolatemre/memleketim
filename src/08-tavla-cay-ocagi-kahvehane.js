/* ================= TAVLA (Çay Ocağı / Kahvehane) ================= */
const ZAR=['','yek','dü','se','cihar','beş','şeş'],CIFT={1:'Hep yek',2:'Dubara',3:'Dü se',4:'Dört cihar',5:'Dü beş',6:'Düşeş'};
const zarAd=(a,b)=>a===b?CIFT[a]+'!':(ZAR[Math.max(a,b)]+' '+ZAR[Math.min(a,b)]).replace(/^./,c=>c.toLocaleUpperCase('tr'))+'!';
const DIE='⚀⚁⚂⚃⚄⚅';
function openTavla(){
  const today=dayKey(now());S.tavla=S.tavla&&S.tavla.day===today?S.tavla:{day:today,plays:0};
  const G={me:0,op:0,a:[6,5],b:[3,3],msg:'Hacı Osman: “Gel bakalım evlat, üç elde iki alan kazanır!”',rolling:false,done:false};
  const free=()=>S.tavla.plays<3;
  openSheet('Tavla · Hacı Osman',()=>{
    $('sBody').innerHTML=`<p class="sub">${free()?`Bugün ${3-S.tavla.plays} bedava oyun hakkın var.`:(G.adOk?'Reklam hakkın hazır: bu oyun bedava.':'Bedava hakkın bitti: 🎬 reklam izle ya da 2 çay ver.')} Kazanırsan ${40+S.lvl*20} altın.</p>
    <div class="tv"><div><small>Sen</small><b>${G.me}</b><div class="dice">${DIE[G.a[0]-1]}${DIE[G.a[1]-1]}</div></div><div class="vs">—</div><div><small>Hacı Osman</small><b>${G.op}</b><div class="dice">${DIE[G.b[0]-1]}${DIE[G.b[1]-1]}</div></div></div>
    <p class="tvmsg">${G.msg}</p><div style="text-align:center;display:flex;gap:8px;justify-content:center"><button class="btn" id="roll" ${G.rolling?'disabled':''}>${G.done?'Yeni oyun':'Zar at'}</button>${!free()&&!G.adOk&&(G.done||!G.started)&&adsAvailable()?'<button class="btn alt" id="tvAd">🎬 Reklamla oyna</button>':''}</div>`;
    if($('tvAd'))$('tvAd').onclick=()=>showRewardedAd(()=>{G.adOk=true;G.msg='Reklam için teşekkürler! Bu oyun bedava.';sheetCtx();});
    $('roll').onclick=()=>{
      if(G.done){if(!free()&&!G.adOk&&!canTake({cay:2})){toast('Çayın kalmadı: 🎬 reklam izleyerek oynayabilirsin');return;}G.me=0;G.op=0;G.done=false;G.msg='Yeni oyun! Zarlar senin.';G.started=false;sheetCtx();return;}
      if(!G.started){if(!free()){if(G.adOk){G.adOk=false;}else{if(!canTake({cay:2})){toast('Çayın kalmadı: 🎬 reklam izleyerek oynayabilirsin');return;}take({cay:2});}}S.tavla.plays++;G.started=true;save();}
      G.rolling=true;audioInit();sfx.dice();let n=0;const iv=setInterval(()=>{G.a=[1+Math.floor(Math.random()*6),1+Math.floor(Math.random()*6)];G.b=[1+Math.floor(Math.random()*6),1+Math.floor(Math.random()*6)];G.msg='Zarlar dönüyor…';sheetCtx();
        if(++n>=8){clearInterval(iv);G.rolling=false;const sa=(G.a[0]+G.a[1])*(G.a[0]===G.a[1]?2:1),sb=(G.b[0]+G.b[1])*(G.b[0]===G.b[1]?2:1);
          if(sa>sb){G.me++;G.msg=`Sen: “${zarAd(...G.a)}” · eli aldın!`;sfx.pop();}else if(sb>sa){G.op++;G.msg=`Hacı Osman: “${zarAd(...G.b)} Hehe!”`;}else G.msg='Berabere, tekrar at!';
          if(G.me===2){G.done=true;const w=40+S.lvl*20;S.coins+=w;gainXP(6);G.msg=`Kazandın! +${w} altın. Hacı Osman: “Vay, zar bugün sana güldü!”`;sfx.fanfare();changed();}
          if(G.op===2){G.done=true;G.msg='Hacı Osman kazandı: “Bu işin ustası benim evlat, yarın yine gel!”';}
          sheetCtx();}},90);};
  });
}

