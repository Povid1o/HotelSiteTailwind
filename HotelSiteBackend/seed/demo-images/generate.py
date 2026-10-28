"""
Рисует иллюстрации-заглушки для демо-данных (python3 generate.py).
Нужен Pillow. Картинки — условные, это не фотографии: замените их своими в админке.
"""
import math, random, os
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.dirname(os.path.abspath(__file__))
W, H = 1600, 1000

def hx(c):
    c = c.lstrip('#'); return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
def mix(a, b, t):
    a, b = hx(a) if isinstance(a, str) else a, hx(b) if isinstance(b, str) else b
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def gradient(w, h, top, bottom):
    im = Image.new('RGB', (w, h)); d = ImageDraw.Draw(im)
    for y in range(h): d.line([(0, y), (w, y)], fill=mix(top, bottom, y / max(1, h - 1)))
    return im

def glow(im, xy, r, color, strength=1.0):
    layer = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
    x, y = xy
    d.ellipse([x - r, y - r, x + r, y + r], fill=hx(color) + (int(255 * strength),))
    layer = layer.filter(ImageFilter.GaussianBlur(r / 2.2))
    im.paste(layer, (0, 0), layer)

PALETTES = {
    'dawn':  dict(sky=('#F3C9A8', '#F7E6D0'), sun='#FFF1D6', sea=('#9FB7B5', '#6E9A9A'), hills=['#8FA68F', '#5E8272', '#3B6A5A', '#1F4D4A'], vine='#173C39'),
    'noon':  dict(sky=('#8FB8CC', '#E3EEF0'), sun='#FFFFFF', sea=('#5E9CAE', '#2F7388'), hills=['#A5BFA0', '#6F9A78', '#44795F', '#1F4D4A'], vine='#173C39'),
    'dusk':  dict(sky=('#5B4A7A', '#F0A56B'), sun='#FFD9A0', sea=('#7A6A8E', '#C9805F'), hills=['#7C6F8A', '#55607A', '#34504F', '#1A3A3A'], vine='#102A2A'),
    'gold':  dict(sky=('#E9B36B', '#FBE7B8'), sun='#FFF6DA', sea=('#C7B084', '#A89268'), hills=['#C9B97A', '#98A36A', '#5E8272', '#2F5A47'], vine='#1F4538'),
    'cool':  dict(sky=('#B9C9D3', '#E9EEF0'), sun='#FFFFFF', sea=('#8FA6B3', '#6A8798'), hills=['#B0BDB8', '#86A097', '#557A70', '#2C5A55'], vine='#1F4540'),
}

def terraces(pal='dawn', seed=1, sun=(0.7, 0.34), lights=False, size=(W, H)):
    rnd = random.Random(seed); w, h = size; p = PALETTES[pal]
    im = gradient(w, h, *p['sky'])
    glow(im, (w * sun[0], h * sun[1]), h * 0.32, p['sun'], .85)
    d = ImageDraw.Draw(im)
    d.ellipse([w * sun[0] - 46, h * sun[1] - 46, w * sun[0] + 46, h * sun[1] + 46], fill=hx(p['sun']))
    sea_top = int(h * 0.5)
    sea = gradient(w, int(h * 0.12), *p['sea']); im.paste(sea, (0, sea_top))
    d = ImageDraw.Draw(im)
    for i in range(26):
        y = sea_top + rnd.randint(4, int(h * 0.12) - 4); x = rnd.randint(0, w); l = rnd.randint(30, 160)
        d.line([(x, y), (x + l, y)], fill=mix(p['sea'][0], '#FFFFFF', .5), width=2)
    bases = [0.56, 0.66, 0.76, 0.9]
    for k, (base, col) in enumerate(zip(bases, p['hills'])):
        amp, f, ph = h * (0.05 + k * .018), 1.3 + rnd.random() * 1.4, rnd.random() * 6
        pts = [(x, h * base + amp * math.sin(x / w * math.pi * f + ph)) for x in range(0, w + 8, 8)]
        d.polygon(pts + [(w, h), (0, h)], fill=hx(col))
        if k >= 2:  # террасы: ряды лозы вдоль склона
            rows = 9 if k == 2 else 13
            for r in range(rows):
                off = r * (h * (0.9 - base + .08) / rows) * (1.0 if k == 3 else .75) + 6
                line = [(x, y + off) for x, y in pts if y + off < h]
                if len(line) > 2:
                    d.line(line, fill=mix(col, p['vine'], .75), width=3 + k)
                    for x, y in line[::3]:
                        d.ellipse([x - 3, y - 3 - k, x + 3, y + 1], fill=mix(col, '#FFFFFF', .16))
    if lights:
        for i in range(34):
            x = 80 + i * (w - 160) / 33; y = h * .12 + 26 * math.sin(i / 33 * math.pi * 2.2) + (i % 2) * 6
            glow(im, (x, y), 20, '#FFD27A', .9)
        d = ImageDraw.Draw(im)
        for i in range(34):
            x = 80 + i * (w - 160) / 33; y = h * .12 + 26 * math.sin(i / 33 * math.pi * 2.2) + (i % 2) * 6
            d.ellipse([x - 5, y - 5, x + 5, y + 5], fill='#FFF0C2')
    return im

def barrels(pal='dark', size=(W, H)):
    w, h = size
    im = gradient(w, h, '#2A1F1C', '#5B3A2B'); d = ImageDraw.Draw(im)
    glow(im, (w * .5, h * .25), h * .4, '#F2B36B', .55); d = ImageDraw.Draw(im)
    for i in range(7): d.arc([i * w / 6 - w / 6, -h * .25, i * w / 6 + w / 6, h * .45], 180, 360, fill=hx('#7A5440'), width=6)
    d.rectangle([0, h * .78, w, h], fill=hx('#2B1D18'))
    for row, (y, rad, n, tone) in enumerate([(h * .52, h * .15, 6, '#8A5A3C'), (h * .74, h * .2, 4, '#A36A44')]):
        for i in range(n):
            cx = (i + .5) * w / n; ry = rad
            d.ellipse([cx - rad * 1.15, y - ry, cx + rad * 1.15, y + ry], fill=hx(tone), outline=hx('#3B261A'), width=4)
            for t in (-.55, -.2, .2, .55):
                d.line([(cx + t * rad * 1.1, y - ry * .96), (cx + t * rad * 1.1, y + ry * .96)], fill=hx('#6B4430'), width=3)
            for t in (-.62, .62):
                d.arc([cx - rad * 1.15, y - ry, cx + rad * 1.15, y + ry], 0, 360, fill=hx('#2A1B14'), width=4)
            d.ellipse([cx - 14, y - 14, cx + 14, y + 14], fill=hx('#3B261A'))
    return im.filter(ImageFilter.GaussianBlur(.8))

def tanks(size=(W, H)):
    w, h = size
    im = gradient(w, h, '#CFD8D6', '#9FB0AD'); d = ImageDraw.Draw(im)
    d.rectangle([0, h * .8, w, h], fill=hx('#7E8F8B'))
    for i in range(5):
        cx = (i + .5) * w / 5; tw = w * .13; top = h * (.22 + (i % 2) * .05)
        for x in range(int(cx - tw), int(cx + tw)):
            t = abs(x - cx) / tw; d.line([(x, top), (x, h * .8)], fill=mix('#EEF3F2', '#7F9894', t ** 1.4))
        d.ellipse([cx - tw, top - 30, cx + tw, top + 30], fill=hx('#E7EEEC'), outline=hx('#9DB0AC'), width=3)
        for yy in (.36, .58):
            d.line([(cx - tw, h * yy), (cx + tw, h * yy)], fill=hx('#6D8782'), width=4)
        d.rectangle([cx - 8, h * .8, cx + 8, h * .86], fill=hx('#5C706C'))
    return im

def glasses(bg=('#3A2A2D', '#6B3E47'), wine=('#7A1F3A', '#D9C27A', '#B3445A'), size=(W, H), plates=False):
    w, h = size
    im = gradient(w, h, *bg)
    rnd = random.Random(5)
    for i in range(18):
        glow(im, (rnd.randint(0, w), rnd.randint(0, int(h * .55))), rnd.randint(50, 110), '#F6C98A', .3)
    d = ImageDraw.Draw(im)
    d.rectangle([0, h * .72, w, h], fill=mix(bg[1], '#000000', .25))
    for i, col in enumerate(wine):
        cx = w * (.28 + i * .22); top = h * .22; bowl = h * .22
        d.ellipse([cx - 90, top, cx + 90, top + bowl * 1.5], fill=mix('#FFFFFF', bg[0], .8), outline=mix('#FFFFFF', bg[1], .5), width=3)
        d.pieslice([cx - 84, top + bowl * .5, cx + 84, top + bowl * 1.5 - 4], 0, 180, fill=hx(col))
        d.rectangle([cx - 4, top + bowl * 1.5 - 4, cx + 4, h * .72], fill=mix('#FFFFFF', bg[1], .55))
        d.ellipse([cx - 80, h * .72 - 10, cx + 80, h * .72 + 14], fill=mix('#FFFFFF', bg[1], .6))
        d.line([(cx - 55, top + 25), (cx - 62, top + bowl)], fill=(255, 255, 255), width=4)
    if plates:
        for cx in (w * .3, w * .7):
            d.ellipse([cx - 150, h * .76, cx + 150, h * .94], fill=hx('#F2EEE6'), outline=hx('#C9C0AE'), width=4)
    return im.filter(ImageFilter.GaussianBlur(.6))

def grapes(bg=('#C9D6BD', '#7FA08F'), berry='#4B2A4C', seed=3, size=(W, H)):
    w, h = size; rnd = random.Random(seed)
    im = gradient(w, h, *bg); d = ImageDraw.Draw(im)
    for i in range(14):
        x, y = rnd.randint(0, w), rnd.randint(0, int(h * .5)); s = rnd.randint(120, 260)
        d.polygon([(x, y), (x + s, y + s * .4), (x + s * .6, y + s), (x - s * .2, y + s * .5)], fill=mix(bg[1], '#1F4D4A', rnd.random() * .5))
    cx, cy = w * .5, h * .38
    for row in range(8):
        n = 8 - row; y = cy + row * 62
        for i in range(n):
            x = cx + (i - (n - 1) / 2) * 76 + rnd.randint(-6, 6)
            d.ellipse([x - 40, y - 40, x + 40, y + 40], fill=mix(berry, '#000000', rnd.random() * .25), outline=mix(berry, '#000000', .45), width=2)
            d.ellipse([x - 22, y - 28, x - 4, y - 14], fill=mix(berry, '#FFFFFF', .45))
    d.line([(cx, cy - 40), (cx + 18, cy - 130)], fill=hx('#5C4033'), width=14)
    return im.filter(ImageFilter.GaussianBlur(.7))

def portrait(seed=1, size=(800, 1000)):
    w, h = size
    im = gradient(w, h, '#C9D6BD', '#E9DCC4'); rnd = random.Random(seed)
    for i in range(10): glow(im, (rnd.randint(0, w), rnd.randint(0, h // 2)), rnd.randint(40, 90), '#FFFFFF', .35)
    d = ImageDraw.Draw(im)
    d.ellipse([w * .22, h * .62, w * .78, h * 1.2], fill=hx('#2C4A47'))
    d.rectangle([w * .43, h * .5, w * .57, h * .66], fill=hx('#D9B79A'))
    d.ellipse([w * .33, h * .22, w * .67, h * .58], fill=hx('#E2C2A6'))
    d.pieslice([w * .31, h * .18, w * .69, h * .46], 180, 360, fill=hx('#4A3A32'))
    return im.filter(ImageFilter.GaussianBlur(1))

def bottle(color='#4B1D2F', label='#F2E8D4', size=(600, 840)):
    w, h = size
    im = gradient(w, h, '#EEE6D8', '#D9CDB8'); d = ImageDraw.Draw(im)
    cx = w / 2
    d.rectangle([cx - 28, h * .1, cx + 28, h * .36], fill=hx(color)); d.rounded_rectangle([cx - 90, h * .32, cx + 90, h * .92], radius=34, fill=hx(color))
    d.rectangle([cx - 30, h * .06, cx + 30, h * .13], fill=hx('#2B2220'))
    d.rectangle([cx - 90, h * .52, cx + 90, h * .76], fill=hx(label))
    d.line([(cx - 60, h * .6), (cx + 60, h * .6)], fill=hx('#1F4D4A'), width=5); d.line([(cx - 40, h * .66), (cx + 40, h * .66)], fill=hx('#C7774D'), width=4)
    d.line([(cx - 64, h * .36), (cx - 64, h * .88)], fill=mix(color, '#FFFFFF', .35), width=6)
    return im


def room(seed=1, wall=('#EDE3D2', '#D9C9AE'), head='#6B7F6A', pal='dawn', size=(W, H)):
    w, h = size
    im = gradient(w, h, *wall); d = ImageDraw.Draw(im)
    view = terraces(pal, seed, size=(int(w * .46), int(h * .5)))
    x0, y0 = int(w * .27), int(h * .1)
    d.rectangle([x0 - 14, y0 - 14, x0 + view.size[0] + 14, y0 + view.size[1] + 14], fill=hx('#F8F4EA'))
    im.paste(view, (x0, y0)); d = ImageDraw.Draw(im)
    d.line([(x0 + view.size[0] // 2, y0), (x0 + view.size[0] // 2, y0 + view.size[1])], fill=hx('#F8F4EA'), width=8)
    d.rectangle([0, h * .78, w, h], fill=hx('#B8956B'))
    d.rounded_rectangle([w * .16, h * .46, w * .84, h * .66], radius=18, fill=hx(head))
    d.rounded_rectangle([w * .12, h * .6, w * .88, h * .84], radius=26, fill=hx('#F4EFE4'), outline=hx('#D3C8B2'), width=4)
    d.rounded_rectangle([w * .12, h * .72, w * .88, h * .84], radius=26, fill=hx('#E2D6C0'))
    for cx in (.3, .7):
        d.rounded_rectangle([w * (cx - .1), h * .55, w * (cx + .1), h * .65], radius=22, fill=hx('#FFFFFF'), outline=hx('#D3C8B2'), width=3)
    d.rectangle([w * .92, h * .5, w * .925, h * .72], fill=hx('#5A4636')); glow(im, (w * .925, h * .47), 90, '#FFD9A0', .8)
    d = ImageDraw.Draw(im); d.ellipse([w * .905, h * .44, w * .945, h * .5], fill=hx('#FFF1D2'))
    return im.filter(ImageFilter.GaussianBlur(.5))

def dish(kind='starter', size=(1000, 750)):
    w, h = size
    im = gradient(w, h, '#CDB99B', '#A68B68'); d = ImageDraw.Draw(im)
    cx, cy = w / 2, h * .52
    d.ellipse([cx - 330, cy - 250, cx + 330, cy + 250], fill=hx('#F4F0E8'), outline=hx('#D8D0BE'), width=6)
    d.ellipse([cx - 250, cy - 185, cx + 250, cy + 185], fill=hx('#EAE4D6'))
    if kind == 'starter':
        for i in range(7):
            a = i / 7 * math.pi * 2; x, y = cx + 110 * math.cos(a), cy + 70 * math.sin(a)
            d.ellipse([x - 52, y - 40, x + 52, y + 40], fill=hx('#C98A6B' if i % 2 else '#D9A98C'), outline=hx('#A86A4C'), width=3)
        d.ellipse([cx - 40, cy - 30, cx + 40, cy + 30], fill=hx('#F2C94C'))
    elif kind == 'main':
        d.rounded_rectangle([cx - 190, cy - 90, cx + 60, cy + 90], radius=50, fill=hx('#7A3E2C'), outline=hx('#5A2A1E'), width=4)
        for i in range(3): d.line([(cx - 150 + i * 70, cy - 60), (cx - 120 + i * 70, cy + 60)], fill=hx('#4A1F16'), width=6)
        for i in range(6): d.ellipse([cx + 40 + (i % 3) * 38, cy - 70 + (i // 3) * 80, cx + 90 + (i % 3) * 38, cy - 20 + (i // 3) * 80], fill=hx('#4F7A4A'))
    elif kind == 'dessert':
        d.polygon([(cx - 150, cy + 80), (cx + 150, cy + 80), (cx + 20, cy - 110)], fill=hx('#4A2A1F'), outline=hx('#2E1A12'))
        d.polygon([(cx - 150, cy + 80), (cx + 150, cy + 80), (cx + 130, cy + 40), (cx - 130, cy + 40)], fill=hx('#C98A5A'))
        for i in range(4): d.ellipse([cx - 120 + i * 80, cy - 140 + (i % 2) * 20, cx - 70 + i * 80, cy - 90 + (i % 2) * 20], fill=hx('#B3304A'))
    else:
        d.polygon([(cx - 150, cy - 160), (cx + 150, cy - 160), (cx + 10, cy + 20)], fill=hx('#F5E8C0'), outline=hx('#D8C58A'))
        d.polygon([(cx - 120, cy - 120), (cx + 120, cy - 120), (cx + 8, cy)], fill=hx('#E58A3A'))
        d.rectangle([cx - 6, cy + 20, cx + 6, cy + 150], fill=hx('#E9E2D0')); d.ellipse([cx - 90, cy + 140, cx + 90, cy + 170], fill=hx('#E9E2D0'))
    return im.filter(ImageFilter.GaussianBlur(.6))

def save(im, name, q=84):
    im.convert('RGB').save(os.path.join(OUT, name + '.jpg'), quality=q, optimize=True)

if __name__ == '__main__':
    S = {
        'home_hero': terraces('dawn', 11, (.72, .3)),
        'why_1': terraces('noon', 12, (.3, .25), size=(1000, 1250)),
        'why_2': terraces('gold', 13, (.6, .3), size=(1000, 800)),
        'winery_teaser': terraces('gold', 14, (.25, .3)),
        'gal_1': terraces('dawn', 21, (.5, .3)), 'gal_2': barrels(), 'gal_3': glasses(), 'gal_4': terraces('dusk', 22, (.3, .45), lights=True),
        'gal_5': grapes(), 'gal_6': tanks(), 'gal_7': terraces('cool', 23, (.8, .25)),
        'vinery_hero': terraces('noon', 31, (.62, .26)), 'intro_1': terraces('gold', 32, (.4, .3), size=(1000, 1250)), 'intro_2': terraces('dawn', 33, (.7, .3), size=(1000, 800)),
        'stage_harvest': grapes(), 'stage_ferment': tanks(), 'stage_aging': barrels(), 'stage_bottling': glasses(),
        'winemaker': portrait(4),
        'hotel_hero': terraces('dusk', 41, (.55, .42)), 'restaurant_hero': glasses(plates=True), 'events_hero': terraces('dusk', 42, (.3, .45), lights=True), 'shop_hero': glasses(('#2C1F24', '#5A2E3C')),
        'news_harvest': grapes(('#E6D3A8', '#B79A5A'), '#5A2E4E', 7), 'news_winter': terraces('cool', 51, (.7, .3)), 'news_jazz': terraces('dusk', 52, (.3, .45), lights=True),
        'news_menu': glasses(plates=True), 'news_cellar': barrels(), 'news_run': terraces('dawn', 53, (.5, .35)), 'news_room': terraces('gold', 54, (.2, .3)), 'news_blend': glasses(('#2B3A36', '#4F6B5E'), ('#7A1F3A', '#C9C98A', '#D98F8F')),
        'ev_blend': glasses(('#2B3A36', '#4F6B5E'), ('#7A1F3A', '#C9C98A', '#D98F8F')), 'ev_breakfast': terraces('gold', 61, (.4, .3)), 'ev_run': terraces('dawn', 62, (.6, .35)), 'ev_yoga': terraces('dawn', 63, (.3, .4)),
        'ev_sparkling': glasses(('#3A3320', '#7A6A3A'), ('#E3D7A4', '#F2E6B8', '#E3D7A4')), 'ev_winter': terraces('cool', 64, (.7, .3)), 'ev_cinema': terraces('dusk', 65, (.5, .5), lights=True), 'ev_gift': glasses(('#2C1F24', '#6B3E47')),
    }
    ROOMS = {
        'room_1': room(1, ('#EDE3D2', '#D9C9AE'), '#6B7F6A', 'dawn'), 'room_2': room(2, ('#E6DCCB', '#CDBB9C'), '#8A5A4A', 'dusk'),
        'room_3': room(3, ('#E4E8E0', '#BFCABB'), '#2F5A47', 'noon'), 'room_4': room(4, ('#F0E6D8', '#DCC9AE'), '#B3704F', 'gold'), 'room_5': room(5, ('#E9E4DA', '#CFC7B5'), '#556B7A', 'cool'),
        'view_1': terraces('dawn', 71, (.6, .3)), 'view_2': terraces('dusk', 72, (.4, .4)), 'view_3': terraces('noon', 73, (.3, .25)), 'view_4': terraces('gold', 74, (.7, .3)), 'view_5': terraces('cool', 75, (.5, .3)),
        'dish_starter': dish('starter'), 'dish_main': dish('main'), 'dish_dessert': dish('dessert'), 'dish_drink': dish('drink'),
    }
    S.update(ROOMS)
    for name, im in S.items(): save(im, name)
    for name, col in {'wine_sauvignon': '#9DA95A', 'wine_riesling': '#C9B85A', 'wine_syrah': '#3F1B2E', 'wine_rose': '#C46A78', 'wine_merlot': '#5A1F32', 'wine_chardonnay': '#B8A24A'}.items():
        save(bottle(col), name)
    print('готово:', len(S) + 6)
