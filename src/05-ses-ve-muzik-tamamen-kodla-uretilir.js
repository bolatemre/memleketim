/* ================= SES VE MÜZİK (tamamen kodla üretilir) ================= */
const SND={ctx:null,on:{music:true,sfx:true},cache:{}};
try{const o=JSON.parse(localStorage.getItem('kds-audio')||'{}');if('music'in o)SND.on.music=o.music;if('sfx'in o)SND.on.sfx=o.sfx;}catch(_){}
function saveAudio(){try{localStorage.setItem('kds-audio',JSON.stringify(SND.on));}catch(_){}}
function audioInit(){
  if(SND.ctx){if(SND.ctx.state==='suspended')SND.ctx.resume();return;}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;SND.ctx=new AC();
  const c=SND.ctx;SND.master=c.createGain();SND.master.gain.value=.9;SND.master.connect(c.destination);
  SND.mus=c.createGain();SND.mus.gain.value=SND.on.music?.55:0;SND.mus.connect(SND.master);
  SND.fx=c.createGain();SND.fx.gain.value=SND.on.sfx?1:0;SND.fx.connect(SND.master);
  startMusic();
}
document.addEventListener('pointerdown',audioInit,true);
function pluckBuf(f){const k=Math.round(f);if(SND.cache[k])return SND.cache[k];const c=SND.ctx,sr=c.sampleRate,len=Math.floor(sr*1.6),b=c.createBuffer(1,len,sr),d=b.getChannelData(0);
  const N=Math.max(2,Math.round(sr/f));const ring=new Float32Array(N);for(let i=0;i<N;i++)ring[i]=Math.random()*2-1;
  let p=0;for(let i=0;i<len;i++){const nx=(p+1)%N;const v=.5*(ring[p]+ring[nx])*.996;d[i]=ring[p];ring[p]=v;p=nx;}
  SND.cache[k]=b;return b;}
function pluck(f,t,vol,dest){const c=SND.ctx,s=c.createBufferSource();s.buffer=pluckBuf(f);const g=c.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+1.4);
  const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;s.connect(lp);lp.connect(g);g.connect(dest);s.start(t);s.stop(t+1.5);}
function tone(type,f1,f2,dur,vol,t,dest){const c=SND.ctx;t=t||c.currentTime;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(dest||SND.fx);o.start(t);o.stop(t+dur+.02);}
function noise(dur,vol,t,hp,dest){const c=SND.ctx;t=t||c.currentTime;const b=c.createBuffer(1,Math.floor(c.sampleRate*dur),c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
  const s=c.createBufferSource();s.buffer=b;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=hp||1200;const g=c.createGain();g.gain.value=vol;s.connect(f);f.connect(g);g.connect(dest||SND.fx);s.start(t);}
// Hicaz makamı (Re karar): Re Mi♭ Fa♯ Sol La Si♭ Do Re
const HICAZ=[293.66,311.13,369.99,392,440,466.16,523.25,587.33,659.26];
const MELODY=[[4,2],[5,1],[4,1],[3,2],[2,1],[1,1],[2,2],[3,2],[4,4],[4,1],[5,1],[6,1],[5,1],[4,2],[3,1],[2,1],[1,2],[2,1],[1,1],[0,4],
  [0,1],[1,1],[2,1],[3,1],[4,2],[7,2],[6,1],[5,1],[4,2],[5,1],[4,1],[3,1],[2,1],[3,2],[2,1],[1,1],[0,4]];
function startMusic(){const c=SND.ctx;let next=c.currentTime+.4,i=0,beat=0;const step=.26;
  const drone=c.createOscillator(),dg=c.createGain();drone.type='sine';drone.frequency.value=146.83;dg.gain.value=.035;drone.connect(dg);dg.connect(SND.mus);drone.start();
  // uzay müziği için yankı (eko) hattı
  const dly=c.createDelay(1.5),fb=c.createGain(),wet=c.createGain();dly.delayTime.value=.48;fb.gain.value=.42;wet.gain.value=.55;dly.connect(fb);fb.connect(dly);dly.connect(wet);wet.connect(SND.mus);
  let mode='earth',snext=0,chord=0,spark=0;
  // A minör / F lidyen havasında yavaş akorlar: "uzak, sonsuz" bir uzay sesi
  const PADS=[[220,261.63,329.63,493.88],[174.61,220,261.63,329.63],[261.63,329.63,392,493.88],[164.81,196,246.94,293.66]];
  const SPARK=[659.26,783.99,880,987.77,1174.66,1318.51,1567.98];
  const pad=(f,t0,dur,vol)=>{const o=c.createOscillator(),o2=c.createOscillator(),g=c.createGain(),lp=c.createBiquadFilter();o.type='sine';o2.type='triangle';o.frequency.value=f;o2.frequency.value=f*1.003;
    lp.type='lowpass';lp.frequency.value=1400;g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+dur*.4);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
    o.connect(lp);o2.connect(lp);lp.connect(g);g.connect(SND.mus);g.connect(dly);o.start(t0);o2.start(t0);o.stop(t0+dur+.05);o2.stop(t0+dur+.05);};
  setInterval(()=>{if(!SND.ctx)return;
    const m=(typeof S!=='undefined'&&S&&S.world==='planet')?'space':'earth';
    if(m!==mode){mode=m;next=snext=c.currentTime+.3;drone.frequency.setTargetAtTime(m==='space'?110:146.83,c.currentTime,.8);dg.gain.setTargetAtTime(m==='space'?.05:.035,c.currentTime,.8);}
    if(mode==='space'){if(snext<c.currentTime-.05)snext=c.currentTime+.1;
      while(snext<c.currentTime+.8){const ch=PADS[chord%PADS.length];for(const f of ch)pad(f,snext,6.4,.022);chord++;
        for(let k=0;k<6;k++)if(Math.random()<.45){const f=SPARK[Math.floor(Math.random()*SPARK.length)];tone('sine',f,null,.9,.03,snext+k*.8+.2,dly);tone('triangle',f,null,.6,.012,snext+k*.8+.2,SND.mus);}
        snext+=4.8;}
      return;}
    // uygulama uzun süre arka planda kaldıysa kaçırılan notaları çalmaya çalışma (binlerce nota telefonu donduruyordu)
    if(next<c.currentTime-.05)next=c.currentTime+.1;
    while(next<c.currentTime+.6){const[n,l]=MELODY[i%MELODY.length];
      pluck(HICAZ[n],next,.22,SND.mus);if(l>=2&&Math.random()<.5)pluck(HICAZ[n]/2,next+.01,.08,SND.mus);
      for(let k=0;k<l;k++){const tt=next+k*step,b=(beat+k)%8;if(b===0||b===5)tone('sine',95,55,.22,.16,tt,SND.mus);else if(b===2||b===6)noise(.06,.05,tt,2500,SND.mus);}
      next+=l*step;beat=(beat+l)%8;i++;}},200);}
const sfx={
  pop:()=>SND.ctx&&tone('sine',520,1050,.12,.25),
  coin:()=>{if(!SND.ctx)return;const t=SND.ctx.currentTime;tone('square',1320,null,.08,.08,t);tone('square',1760,null,.16,.08,t+.07);},
  clink:()=>{if(!SND.ctx)return;const t=SND.ctx.currentTime;tone('sine',2650,null,.25,.12,t);tone('sine',3150,null,.2,.07,t+.09);},
  thud:()=>{if(!SND.ctx)return;tone('sine',150,60,.25,.35);noise(.08,.08,null,400);},
  blip:()=>SND.ctx&&tone('triangle',880,1320,.07,.12),
  moo:()=>{if(!SND.ctx)return;const c=SND.ctx,t=c.currentTime,o=c.createOscillator(),f=c.createBiquadFilter(),g=c.createGain();o.type='sawtooth';o.frequency.setValueAtTime(165,t);o.frequency.linearRampToValueAtTime(140,t+.3);o.frequency.linearRampToValueAtTime(105,t+.9);
    f.type='lowpass';f.frequency.setValueAtTime(500,t);f.frequency.linearRampToValueAtTime(900,t+.3);f.frequency.linearRampToValueAtTime(350,t+.9);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.2,t+.12);g.gain.exponentialRampToValueAtTime(.0001,t+1);
    o.connect(f);f.connect(g);g.connect(SND.fx);o.start(t);o.stop(t+1.05);},
  rooster:()=>{if(!SND.ctx)return;const t=SND.ctx.currentTime;tone('sawtooth',520,700,.14,.07,t);tone('sawtooth',700,760,.14,.07,t+.16);tone('sawtooth',760,980,.18,.08,t+.32);tone('sawtooth',980,620,.5,.07,t+.52);},
  dice:()=>{if(!SND.ctx)return;const t=SND.ctx.currentTime;for(let i=0;i<7;i++)noise(.03,.12,t+i*.06+Math.random()*.03,1800);},
  fanfare:()=>{if(!SND.ctx)return;const t=SND.ctx.currentTime;[0,2,4,7].forEach((n,i)=>pluck(HICAZ[n]*2,t+i*.12,.25,SND.fx));}
};
// Gizli kodlar: sadece kodu bilen kullanabilir, cihaz başına bir kez
// Gizli kodlar mağaza sürümünden kaldırıldı (Apple kural 2.3.1)
function setAudio(k,v){SND.on[k]=v;saveAudio();if(SND.ctx){if(k==='music')SND.mus.gain.value=v?.55:0;else SND.fx.gain.value=v?1:0;}soundPill();}
function soundPill(){const el=$('sndPill');if(el)el.textContent=SND.on.music||SND.on.sfx?'🔊':'🔇';}
function openSound(){openSheet('Ses',()=>{$('sBody').innerHTML=`<div class="row"><div class="mid"><div class="t">Müzik</div><div class="d">Hicaz makamında bağlama ezgisi</div></div><button class="btn ${SND.on.music?'':'alt'}" id="tMus">${SND.on.music?'Açık':'Kapalı'}</button></div>
  <div class="row"><div class="mid"><div class="t">Efektler</div><div class="d">Hasat, altın, çay kaşığı, inek, horoz…</div></div><button class="btn ${SND.on.sfx?'':'alt'}" id="tSfx">${SND.on.sfx?'Açık':'Kapalı'}</button></div>`;
  $('tMus').onclick=()=>{audioInit();setAudio('music',!SND.on.music);sheetCtx();};$('tSfx').onclick=()=>{audioInit();setAudio('sfx',!SND.on.sfx);sheetCtx();};});}

