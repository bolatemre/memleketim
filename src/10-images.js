/* ================= IMAGES ================= */
const IM={},MASK={},GEO={},LOADING={};
// Bina evrim görselleri (yüzlercesi) sadece gerektiğinde açılır; hepsini birden açmak telefonu yavaşlatıyordu
const LAZY=k=>k.startsWith('b_')||k.startsWith('k_')||k.startsWith('fp_')||k.startsWith('lg_')||/^f[kst]_/.test(k)||['cottage','house2','townhouse','apart1','apartment','skyscraper','ecotower','dairy','bakery','barn'].includes(k);
function loadImg(k){if(IM[k]||LOADING[k]||!IMG_SRC[k])return;LOADING[k]=1;const src=IMG_SRC[k];
  const im=new Image();im.onload=()=>{
    if(k[0]==='t'){IM[k]=im;return;}
    const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
    const d=x.getImageData(0,0,c.width,c.height).data,a=new Uint8Array(c.width*c.height);
    for(let i=0;i<a.length;i++)a[i]=d[i*4+3];
    MASK[k]={w:c.width,h:c.height,a};
    // tile geometry: left/right extent, row of left corner
    let L=c.width,Rr=0;for(let y=0;y<c.height;y++)for(let x2=0;x2<c.width;x2++)if(a[y*c.width+x2]>128){if(x2<L)L=x2;if(x2>Rr)Rr=x2;}
    let ly=0;for(let y=0;y<c.height;y++)if(a[y*c.width+Math.min(c.width-1,L+2)]>128){ly=y;break;}
    const tw=Rr-L;GEO[k]={ax:(L+Rr)/2,ay:ly+tw/4,tw};
    // kalın kaideli yeni görseller: genişliği sadece alt kısımdan (kaide) ölç, kaidenin en alt köşesini zemindeki karonun alt köşesine oturt → yola/komşuya taşmaz
    if(/^b_(fut_|pl_|us\d|gate|cargorocket|satcenter|panel)/.test(k)){let L2=c.width,R2=0,mY=0;const y0=Math.floor(c.height*.6);
      for(let y=0;y<c.height;y++)for(let x2=0;x2<c.width;x2++)if(a[y*c.width+x2]>128){if(y>mY)mY=y;if(y>=y0){if(x2<L2)L2=x2;if(x2>R2)R2=x2;}}
      const t2=R2-L2;if(t2>c.width*.5)GEO[k]={ax:(L2+R2)/2,ay:mY-t2*.02,tw:t2};}
    if(/^b_cami\d/.test(k)){let ty=0;outer:for(let y=0;y<c.height;y++)for(let x2=0;x2<c.width;x2++)if(a[y*c.width+x2]>128){ty=y;GEO[k].tip={x:x2/c.width,y:y/c.height};break outer;}}
    if(/^(f[kst]?|w)_/.test(k)){let s=0,n=0;for(let y=Math.floor(c.height*.8);y<c.height;y++)for(let x2=0;x2<c.width;x2++)if(a[y*c.width+x2]>128){s+=x2;n++;}im._lc=n?s/n/c.width:.5;let s2=0,n2=0;for(let y=Math.floor(c.height*.15);y<c.height*.55;y++)for(let x2=0;x2<c.width;x2++)if(a[y*c.width+x2]>128){s2+=x2;n2++;}im._tc=n2?s2/n2/c.width:.5;}
    IM[k]=im;
  };im.src=src;
}
for(const k of Object.keys(IMG_SRC))if(!LAZY(k))loadImg(k);

