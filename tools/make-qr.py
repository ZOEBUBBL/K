#!/usr/bin/env python3
"""
Generate the sticker QR at print resolution.

    pip install qrcode pillow
    python3 tools/make-qr.py HTTPS://YOURNAME.GITHUB.IO

Why the shouting: QR has a compact alphanumeric encoding mode that only covers
A-Z, 0-9 and a few symbols. Domains are case-insensitive, so an ALL-CAPS root
URL packs into a smaller symbol than the same address in lowercase — which
means fatter modules at the same printed size, which means it scans. Paths ARE
case-sensitive, so only do this when there's nothing after the domain.

Error correction M is the default here, not H. H is for labels that get
scuffed, curved or partly obscured; a flat vinyl sticker doesn't need it, and
M buys you a smaller symbol.

    --ec H     if you want maximum robustness and can afford the size
    --check    decode the result to prove it works
"""
import sys, argparse, qrcode
from qrcode.constants import ERROR_CORRECT_L, ERROR_CORRECT_M, ERROR_CORRECT_Q, ERROR_CORRECT_H

LEVELS = {'L': ERROR_CORRECT_L, 'M': ERROR_CORRECT_M,
          'Q': ERROR_CORRECT_Q, 'H': ERROR_CORRECT_H}

p = argparse.ArgumentParser()
p.add_argument('url')
p.add_argument('out', nargs='?', default='qr.png')
p.add_argument('--ec', default='M', choices=list(LEVELS))
p.add_argument('--px', type=int, default=1200)
p.add_argument('--sticker-width-in', type=float, default=3.0)
p.add_argument('--qr-fraction', type=float, default=0.24,
               help='QR width as a fraction of the artwork width')
p.add_argument('--check', action='store_true')
a = p.parse_args()

qr = qrcode.QRCode(error_correction=LEVELS[a.ec], border=3)
qr.add_data(a.url)
qr.make(fit=True)
total = qr.modules_count + 6

img = qr.make_image(fill_color=(26, 12, 30), back_color=(238, 230, 214))
img = img.convert('RGB').resize((a.px, a.px), 0)   # NEAREST — keep edges crisp
img.save(a.out)

qr_mm  = a.sticker_width_in * 25.4 * a.qr_fraction
mod_mm = qr_mm / total

print(f"wrote {a.out}")
print(f"  {a.url}")
print(f"  version {qr.version}, {qr.modules_count} modules ({total} with quiet zone), EC {a.ec}")
print(f"  at {a.sticker_width_in}in sticker with QR at {a.qr_fraction:.0%} of width:")
print(f"    QR prints {qr_mm:.1f}mm wide, each module {mod_mm:.2f}mm")
if mod_mm < 0.40:
    print("    TOO SMALL — shorten the URL, lower --ec, raise --qr-fraction, or print bigger")
elif mod_mm < 0.50:
    print("    MARGINAL — it'll scan, but slowly. Buy yourself more margin if you can.")
else:
    print("    FINE")
print("  Keep the pale quiet zone around it. That border is what makes it findable.")

if a.check:
    try:
        import cv2, numpy as np
        from PIL import Image
        got, _, _ = cv2.QRCodeDetector().detectAndDecode(
            cv2.cvtColor(np.array(Image.open(a.out)), cv2.COLOR_RGB2BGR))
        print(f"  decode check: {'OK' if got == a.url else 'FAILED -> ' + repr(got)}")
    except ImportError:
        print("  decode check skipped (pip install opencv-python-headless)")
