/* ================= TALK / TUTORIAL ================= */
const TALKQ=[];
const TN=s=>String(s).replace(/\{KÖY\}/g,(S&&S.townName)||'Yeşilyurt').replace(/\{GEZEGEN\}/g,(S&&S.planetName)||'Gezegen');
function talk(who,text,acts){text=TN(text);
  if($('talk').classList.contains('on')){TALKQ.push([who,text,acts]);return;}
  $('talkImg').src=IMG_SRC[who];$('talkWho').textContent=PEOPLE[who];$('talkText').textContent=text;
  const a=$('talkActs');a.innerHTML='';
  for(const[label,fn,ghost]of acts){const b=document.createElement('button');b.className='btn'+(ghost?' ghost':'');b.textContent=label;
    b.onclick=()=>{$('talk').classList.remove('on');if(fn)fn();if(TALKQ.length&&!$('talk').classList.contains('on'))talk(...TALKQ.shift());};a.appendChild(b);}
  $('talk').classList.add('on');
}
function hideTalk(){$('talk').classList.remove('on');}
const TUT=[
  ()=>talk('p_elif','Merhaba, ben Elif! Bu küçük kasaba artık senin. Hadi birlikte büyütelim.',[['Geç',()=>{S.tut=99;save();},true],['Başlayalım',()=>{S.gems=(S.gems||0)+15;toast('Hoş geldin hediyesi: +15 elmas!');S.tut=1;save();changed();showTut();}]]),
  ()=>talk('p_elif','Önce tarlalara dokun ve buğday ek. Ekerken süreyi tarlanın üstünde görürsün.',[['Tamam',null]]),
  ()=>talk('p_elif','Harika! Buğday olgunlaşınca parlar. O zaman tarlaya dokunup hasat et.',[['Tamam',null]]),
  ()=>talk('p_elif','Şimdi fırına dokun ve buğdaydan ekmek pişir.',[['Tamam',null]]),
  ()=>talk('p_elif',`Ekmek pişerken beklemek istemezsen üretim ekranındaki "Bitir ${GEM}" butonuna dokunup anında bitir. Sana verdiğim elmasları şimdi dene!`,[['Tamam',null]]),
  ()=>talk('p_elif','Ekmek hazır olunca Siparişler düğmesine bas ve bir siparişi teslim et. Köylüler istediklerini yazıyor; teslim edersen altın ve yıldız kazanırsın.',[['Tamam',null]]),
  ()=>talk('p_elif','Harikasın! Temelleri öğrendin. Bir de sol üstteki görev kutusuna bak; orada hep bir sonraki hedefin yazar, dokununca detayını görürsün. Seviye atladıkça yeni binalar ve yükseltmeler de açılacak. Gerisi sana kalsın!',[['Anladım',()=>{S.tut=99;save();}]])
];
let tutTimer=null;
function showTut(){
  clearTimeout(tutTimer);
  if(DEMO||S.tut>=TUT.length||S.tut>=99)return;
  if($('sheet').classList.contains('on')||$('nameBox').classList.contains('on')){tutTimer=setTimeout(showTut,3000);return;}
  TUT[S.tut]();
  tutTimer=setTimeout(()=>{if(S.tut<TUT.length&&S.tut<99)showTut();},13000);
}
function tutEvent(ev){
  const map={plant:[1,2],harvest:[2,3],produce:[3,4],skip:[4,5],order:[5,6]};const m=map[ev];
  if(m&&S.tut===m[0]){S.tut=m[1];save();showTut();}
}

