#!/usr/bin/env python3
"""src/ ve gorseller/ klasörlerinden tek dosyalık oyunu (index.html) üretir.
Kullanım: python3 scripts/derle.py [çıktı.html]"""
import sys, os, json, base64, glob
out = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
imgs = {}
for f in sorted(glob.glob('gorseller/*')):
    k, ext = os.path.splitext(os.path.basename(f)); ext = ext[1:]
    mime = {'png': 'image/png', 'jpg': 'image/jpeg', 'webp': 'image/webp'}.get(ext)
    if mime: imgs[k] = f'data:{mime};base64,' + base64.b64encode(open(f, 'rb').read()).decode()
js = ''.join(open(f, encoding='utf-8').read() for f in sorted(glob.glob('src/*.js')))
js = js.replace('__IMAGES__', json.dumps(imgs, separators=(', ', ': ')), 1)
head = open('src/head.html', encoding='utf-8').read(); body = open('src/body.html', encoding='utf-8').read()
h = head + body + '<script>' + js + '</script>\n</body>\n</html>\n'
open(out, 'w', encoding='utf-8').write(h)
print(f'{out}: {len(h)/1e6:.1f} MB, {len(imgs)} görsel')
