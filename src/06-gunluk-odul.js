/* ================= GÜNLÜK ÖDÜL ================= */
const DAILY=[{coins:100,t:'100 altın'},{items:{nails:3},t:'3 çivi'},{coins:250,t:'250 altın'},{items:{shovel:1,axe:1},t:'Kürek + balta'},{coins:500,t:'500 altın'},{items:{map:1,pickaxe:1},t:'Harita parçası + kazma'},{coins:1200,gems:5,items:{cake:2,usta:1},t:'1200 altın + 5 elmas + Usta Belgesi'}];
const dayKey=d=>{const x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');};
function checkDaily(after){
  if(DEMO){if(after)after();return;}
  const today=dayKey(now()),yest=dayKey(now()-86400000);S.daily=S.daily||{last:null,streak:0};
  if(S.daily.last===today){if(after)after();return;}
  const streak=S.daily.last===yest?S.daily.streak%7+1:1;
  $('dailyDays').innerHTML=DAILY.map((r,i)=>`<div class="dd ${i+1<streak?'got':i+1===streak?'now':''}"><b>${i+1}. gün</b><span>${r.t}</span></div>`).join('');
  $('dailyTitle').textContent=streak>1?`${streak}. gün üst üste! 🎉`:'Hoş geldin!';
  $('dailyBox').classList.add('on');
  $('dailyOk').onclick=()=>{const r=DAILY[streak-1];S.coins+=r.coins||0;S.gems=(S.gems||0)+(r.gems||0);for(const[k,q]of Object.entries(r.items||{}))addItem(k,q);
    S.daily={last:today,streak};$('dailyBox').classList.remove('on');sfx.coin();setTimeout(sfx.coin,140);toast('Günlük ödül: '+r.t);changed();if(after)after();};
}

