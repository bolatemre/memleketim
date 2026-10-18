# index.html içindeki görsellerden uygulama ikonu (Trakyalı Hüsnü + Köy Camii) ve açılış ekranı üretir.
import base64, io, json, os
from PIL import Image, ImageDraw, ImageFilter
h = open('www/index.html', encoding='utf-8').read()
i = h.index('const IMG_SRC = ') + len('const IMG_SRC = ')
SRC, _ = json.JSONDecoder().raw_decode(h[i:])
def img(k): return Image.open(io.BytesIO(base64.b64decode(SRC[k].split(',', 1)[1]))).convert('RGBA')
HUSNU, CAMI = img('f_1'), img('b_cami1')
def scene(S):
    im = Image.new('RGB', (S, S)); d = ImageDraw.Draw(im)
    for y in range(S):
        t = y / S
        d.line([(0, y), (S, y)], fill=(int(255*(1-t)+230*t), int(190*(1-t)+110*t), int(90*(1-t)+60*t)))
    im = im.convert('RGBA')
    g = Image.new('RGBA', (S, S), (0, 0, 0, 0)); r = S*.39
    ImageDraw.Draw(g).ellipse([S*.5-r, S*.39-r, S*.5+r, S*.39+r], fill=(255, 240, 170, 170))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(r*.35)))
    def put(spr, w, cx, by):
        w = int(w); hh = int(spr.height*w/spr.width); s = spr.resize((w, hh), Image.LANCZOS)
        sh = Image.new('RGBA', (S, S), (0, 0, 0, 0)); blk = Image.new('RGBA', s.size, (20, 20, 40, 255))
        blk.putalpha(s.split()[3].point(lambda a: int(a*.35)))
        sh.alpha_composite(blk, (int(cx-w/2)+int(S*.012), int(by-hh)+int(S*.02)))
        im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(S*.016)))
        im.alpha_composite(s, (int(cx-w/2), int(by-hh)))
    put(CAMI, S*.586, S*.723, S*.9375)
    put(HUSNU, S*.586, S*.39, S*.977)
    return im.convert('RGB')
os.makedirs('assets', exist_ok=True)
scene(1024).save('assets/icon-only.png')
sp = scene(1366).resize((2732, 2732), Image.LANCZOS)
sp.save('assets/splash.png'); sp.save('assets/splash-dark.png')
print('ikon ve açılış ekranı hazır')
