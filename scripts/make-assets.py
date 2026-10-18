# index.html içindeki Köy Camii görselinden uygulama ikonu ve açılış ekranı üretir.
import base64, io, json, os, re, sys
from PIL import Image, ImageDraw, ImageFilter
src = 'www/index.html'
h = open(src, encoding='utf-8').read()
i = h.index('const IMG_SRC = ') + len('const IMG_SRC = ')
obj, _ = json.JSONDecoder().raw_decode(h[i:])
cami = Image.open(io.BytesIO(base64.b64decode(obj['b_cami1'].split(',', 1)[1]))).convert('RGBA')
os.makedirs('assets', exist_ok=True)
def icon(S):
    im = Image.new('RGB', (S, S)); d = ImageDraw.Draw(im)
    for y in range(S):
        t = y / S
        d.line([(0, y), (S, y)], fill=(int(255*(1-t)+120*t), int(190*(1-t)+190*t), int(110*(1-t)+120*t)))
    g = Image.new('RGBA', (S, S), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    gd.ellipse([S*.58, S*.08, S*.98, S*.48], fill=(255, 232, 150, 150)); g = g.filter(ImageFilter.GaussianBlur(S*.05))
    im = Image.alpha_composite(im.convert('RGBA'), g)
    w = int(S*.86); c = cami.resize((w, int(cami.height*w/cami.width)), Image.LANCZOS)
    im.alpha_composite(c, ((S-w)//2, int(S*.94)-c.height))
    return im.convert('RGB')
icon(1024).save('assets/icon-only.png')
S = 2732; sp = Image.new('RGBA', (S, S), (92, 192, 221, 255))
w = 1000; c = cami.resize((w, int(cami.height*w/cami.width)), Image.LANCZOS)
sp.alpha_composite(c, ((S-w)//2, (S-c.height)//2))
sp.convert('RGB').save('assets/splash.png'); sp.convert('RGB').save('assets/splash-dark.png')
print('ikon ve açılış ekranı hazır')
