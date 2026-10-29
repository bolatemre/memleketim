#!/usr/bin/env python3
"""index.html'i okunur kaynak dosyalara ayırır:
   src/head.html  (başlık, stiller, gömülü fontlar)
   src/body.html  (arayüz iskeleti)
   src/NN-bolum.js (oyun kodu, bölüm bölüm)
   assets/*.webp|png (oyunun bütün görselleri)
Kullanım: python3 scripts/kaynak-cikar.py index.html"""
import sys, os, re, json, base64, unicodedata
src = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
h = open(src, encoding='utf-8').read()
s = h.rindex('<script>'); e = h.rindex('</script>')
pre, js = h[:s], h[s + len('<script>'):e]
head, body = pre.split('</head>', 1); head += '</head>'
# görseller
m = re.search(r'const IMG_SRC\s*=\s*', js); i = m.end()
imgs, end = json.JSONDecoder().raw_decode(js[i:])
js = js[:i] + '__IMAGES__' + js[i + end:]
os.makedirs('assets', exist_ok=True)
for k, v in imgs.items():
    mime, b64 = v.split(',', 1)
    ext = 'png' if 'png' in mime else 'jpg' if 'jpeg' in mime else 'webp'
    open(f'assets/{k}.{ext}', 'wb').write(base64.b64decode(b64))
# kod: "/* ===== BÖLÜM ===== */" işaretlerinden bölümlere ayır
os.makedirs('src', exist_ok=True)
for f in os.listdir('src'):
    if f.endswith('.js'): os.remove(os.path.join('src', f))
parts = re.split(r'(?m)^(?=/\* =+ )', js)
def slug(t):
    t = unicodedata.normalize('NFKD', t.translate(str.maketrans('çğıöşüÇĞİÖŞÜ', 'cgiosuCGIOSU'))).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:40] or 'baslangic'
for n, p in enumerate(parts):
    mm = re.match(r'/\* =+ (.*?)(?: =+)? \*/', p)
    name = slug(mm.group(1)) if mm else 'baslangic'
    open(f'src/{n:02d}-{name}.js', 'w', encoding='utf-8').write(p)
open('src/head.html', 'w', encoding='utf-8').write(head)
open('src/body.html', 'w', encoding='utf-8').write(body)
print(f'{len(parts)} kod bölümü, {len(imgs)} görsel çıkarıldı')
