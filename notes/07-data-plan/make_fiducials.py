#!/usr/bin/env python3
"""Print-ready fiducials for Sariya (workstream 7). Not app code.

Run:  python3 -m venv v && v/bin/pip install "opencv-contrib-python-headless>=4.8" pillow numpy
      v/bin/python make_fiducials.py            -> writes ./print/*.pdf and *.png

Everything is drawn at 12 px/mm (304.8 dpi) so every square is an integer
number of pixels and the PDF page is the exact physical size. Tell the print
shop: "print at 100 %, no fit-to-page, no scaling". Verify with a tape after
printing and write the measured size on the back of each card.

One dictionary for everything (DICT_5X5_1000) so the app runs one detector:
  ids   0-359   twenty 20 cm ChArUco cards, 18 markers each (card k = 18k .. 18k+17)
  ids 400-439   the 2 m beam strip, id - 400 = position index, 50 mm pitch
  ids 500-543   the A3 calibration board
  id  600       the hook template (scale marker only)
"""
import os, textwrap, cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont

PX = 12                       # px per mm
DPI = PX * 25.4               # 304.8
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "print")
os.makedirs(OUT, exist_ok=True)
DICT = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_5X5_1000)

def save(img, name):
    """img: uint8 gray or RGB numpy array -> PNG + exact-size PDF."""
    im = Image.fromarray(img)
    im.save(os.path.join(OUT, name + ".png"), dpi=(DPI, DPI))
    im.convert("RGB").save(os.path.join(OUT, name + ".pdf"), resolution=DPI)

def font(size_mm):
    for f in ["/System/Library/Fonts/Helvetica.ttc", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]:
        if os.path.exists(f):
            return ImageFont.truetype(f, int(size_mm * PX))
    return ImageFont.load_default()

# ---------------------------------------------------------------- 1. site cards
SQ, MK, N = 30, 22, 6          # mm square, mm marker, squares per side -> 180 mm board
MARGIN = 10                    # mm -> 200 x 200 mm card
def card(k):
    ids = np.arange(18 * k, 18 * k + 18, dtype=np.int32)
    board = cv2.aruco.CharucoBoard((N, N), float(SQ), float(MK), DICT, ids)
    side = (N * SQ + 2 * MARGIN) * PX
    img = board.generateImage((side, side), marginSize=MARGIN * PX, borderBits=1)
    im = Image.fromarray(img); d = ImageDraw.Draw(im)
    d.text((MARGIN * PX, 1 * PX), f"SARIYA CARD {k:02d}  ids {ids[0]}-{ids[-1]}  sq {SQ} mm  mk {MK} mm  DICT_5X5_1000", fill=0, font=font(4))
    d.text((MARGIN * PX, side - 8 * PX), "site ID: _______  date: _______  pattern width, 6 squares (nominal 180): _____ mm", fill=0, font=font(4))
    return np.array(im), board

for k in range(20):
    img, board = card(k)
    save(img, f"card_{k:02d}")
# detection self-test: shrink card 00 to what the 4K main camera sees at 0.4 / 1.2 / 1.5 m
img, board = card(0)
det = cv2.aruco.CharucoDetector(board)
for dist, gsd in [(0.4, 0.15), (1.0, 0.376), (1.2, 0.45), (1.5, 0.563)]:
    px = int(200 / gsd)
    small = cv2.resize(img, (px, px), interpolation=cv2.INTER_AREA)
    small = cv2.GaussianBlur(small, (0, 0), 1.0)          # ~1 px optical blur
    cc, cid, mc, mid = det.detectBoard(small)
    print(f"card at {dist} m: {px} px wide, marker {MK/gsd:.0f} px, "
          f"{0 if mid is None else len(mid)}/18 markers, {0 if cc is None else len(cc)}/25 corners")

# ---------------------------------------------------------------- 2. beam strip
PITCH, MSZ, W, LEN = 50, 40, 60, 2000     # mm; 40 markers over 2 m
strip = np.full((W * PX, LEN * PX), 255, np.uint8)
for i in range(LEN // PITCH):
    m = cv2.aruco.generateImageMarker(DICT, 400 + i, MSZ * PX, borderBits=1)
    x = (i * PITCH + (PITCH - MSZ) // 2) * PX; y = ((W - MSZ) // 2) * PX
    strip[y:y + MSZ * PX, x:x + MSZ * PX] = m
im = Image.fromarray(strip); d = ImageDraw.Draw(im)
for i in range(LEN // PITCH):
    d.line([(i * PITCH * PX, 0), (i * PITCH * PX, 4 * PX)], fill=0, width=PX // 3)   # tick at exactly i*50 mm from the left end
    d.text(((i * PITCH + 1) * PX, 1 * PX), f"{i*PITCH}", fill=0, font=font(3))
d.line([(0, 0), (0, W * PX)], fill=0, width=PX // 2)                                   # the zero end
for i in range(0, LEN // PITCH, 8):
    d.text(((i * PITCH + 2) * PX, (W - 6) * PX), "<- 0 mm end goes at the column face.  SARIYA STRIP ids 400-439, DICT_5X5_1000, marker 40 mm, pitch 50 mm.  Marker centre = 25 + (id-400) x 50 mm from the 0 end.", fill=0, font=font(2.6))
save(np.array(im), "strip_2m")

# ---------------------------------------------------------------- 3. A3 calibration board
CSQ, CMK = 35, 26
cb = cv2.aruco.CharucoBoard((11, 8), float(CSQ), float(CMK), DICT, np.arange(500, 544, dtype=np.int32))
cimg = cb.generateImage((420 * PX, 297 * PX), marginSize=int(8.5 * PX), borderBits=1)
save(cimg, "calibration_A3")

# ---------------------------------------------------------------- 4. hook template (A4 landscape, 297 x 210)
im = Image.new("L", (297 * PX, 210 * PX), 255); d = ImageDraw.Draw(im)
f = font(4); fs = font(3)
d.text((5 * PX, 3 * PX), "SARIYA HOOK TEMPLATE  lay the stirrup corner on the vertex, legs along the rays; read the tail against the ticks", fill=0, font=f)
def gauge(cx, cy, ang_deg, L, label, ext):
    d.line([(cx, cy), (cx + L * PX, cy)], fill=0, width=PX)
    a = np.deg2rad(180 - ang_deg)
    d.line([(cx, cy), (cx + L * PX * np.cos(a), cy - L * PX * np.sin(a))], fill=0, width=PX)
    d.text((cx + 5 * PX, cy + 2 * PX), label, fill=0, font=f)
    for j, (name, mm) in enumerate(ext):
        t = mm * PX; tx, ty = cx + t * np.cos(a), cy - t * np.sin(a)
        px_, py_ = np.sin(a), np.cos(a)           # unit perpendicular to the ray, pointing right/down
        d.line([(tx - 4 * PX * px_, ty - 4 * PX * py_), (tx + 4 * PX * px_, ty + 4 * PX * py_)], fill=0, width=PX // 2)
        side = 1 if j % 2 == 0 else -1          # alternate sides so labels 5 mm apart never overlap
        d.text((tx + side * 7 * PX * px_, ty + side * 7 * PX * py_), f"{name}: {mm} mm", fill=0, font=fs,
               anchor="lm" if side > 0 else "rm")
gauge(80 * PX, 160 * PX, 135, 100, "135 deg (IS 13920)", [("6d, min 65 (8 or 10 mm)", 65), ("8d/75 variant", 75), ("8d, 10 mm", 80)])
gauge(195 * PX, 160 * PX, 90, 95, "90 deg (IS 456 cl 26.2.2.4b, tail 8d)", [("8d, 8 mm", 64), ("8d, 10 mm", 80)])
mk = cv2.aruco.generateImageMarker(DICT, 600, 30 * PX, borderBits=1)
im.paste(Image.fromarray(mk), (257 * PX, 12 * PX))
d.text((230 * PX, 45 * PX), "id 600, 30 mm (scale)", fill=0, font=fs)
d.text((5 * PX, 195 * PX), "Bengaluru is zone II: a 135 deg hook is required only where the drawing says so. Tail: 8d, at least 75 mm (IS 13920 Amd 1, 2017).", fill=0, font=fs)
save(np.array(im), "hook_template_A4")

# ---------------------------------------------------------------- 5. fault deck (A6 cards)
FAULTS = [
    ("CONTROL", "Change nothing. Scan.", "Expected: all within limits."),
    ("F1 MISSING BAR", "Pull one bar out of the mesh.", "Expected: count 4 of 5; 'outside limits'."),
    ("F2 WIDE SPACING", "Slide one mesh bar so one gap is about 80 mm.", "Expected: '80 +/- 3 mm c/c', limit 65. Tape it."),
    ("F3 END ZONE", "Slide the 2nd cross piece from the left end of the beam into the middle.", "Expected: 'rings at 100; drawing says 50 for first 150 mm. Add 1.'"),
    ("F4 NEAR LIMIT", "Slide one bar so one gap is about 72 mm (limit 65).", "Expected at 0.8 m: 're-scan'. At 0.3 m: a verdict."),
    ("F5 FAR SCAN", "Scan from 0.8 m instead of 0.3 m.", "Expected: wider bands, 're-scan' where within error."),
    ("F6 TORCH OFF", "Turn the phone torch off and shade the mesh with a hand.", "Expected: blur guard rejects frames or asks for light."),
    ("F7 COVER", "Skip the cover reading when the app asks.", "Expected: 'cover: needs a tape reading' (never guessed)."),
    ("F8 THIN BAR", "Weigh the spare 280 mm slab bar as a 10.", "Expected: ~111 g over 280 mm; app says 8 mm class, not 10."),
    ("F9 HALF CARD", "Cover a third of the card with your hand.", "Expected: still measures from the visible corners, or abstains."),
    ("F10 REPLAY", "Send yesterday's signed pack again.", "Expected: rejected, this record was already signed (same hash)."),
    ("F11 NO DRAWING", "Clear the 5-field spec.", "Expected: measurement-only mode, values, no verdict."),
    ("F12 LOWER BARS", "Slide the second bar of the lower layer about 30 mm toward the back.", "Expected: 'lower bars, gap 2: 80 +/- 4', limit 65."),
]
pages = []
for title, action, expect in FAULTS:
    im = Image.new("RGB", (105 * PX, 148 * PX), "white"); d = ImageDraw.Draw(im)
    d.rectangle([3 * PX, 3 * PX, 102 * PX, 145 * PX], outline="black", width=PX // 2)
    d.text((8 * PX, 8 * PX), title, fill="black", font=font(7))
    d.text((8 * PX, 30 * PX), "JUDGE DOES:", fill="black", font=font(4))
    d.multiline_text((8 * PX, 37 * PX), textwrap.fill(action, 30), fill="black", font=font(5), spacing=PX)
    d.text((8 * PX, 90 * PX), "SARIYA SHOULD:", fill="black", font=font(4))
    d.multiline_text((8 * PX, 97 * PX), textwrap.fill(expect, 36), fill="black", font=font(4.2), spacing=PX)
    pages.append(im)
pages[0].save(os.path.join(OUT, "fault_deck_A6.pdf"), resolution=DPI, save_all=True, append_images=pages[1:])

# ---------------------------------------------------------------- 6. one-page props spec (A4 portrait)
im = Image.new("L", (210 * PX, 297 * PX), 255); d = ImageDraw.Draw(im)
lines = [
    (font(9), "DRAWING: demo props (half scale)"),
    (font(5), ""),
    (font(6.5), "SLAB S1  (mesh, both ways)"),
    (font(5), "Bar diameter: 8 mm"),
    (font(5), "Spacing: 50 mm c/c, both directions"),
    (font(5), "Bars: 5 x 5"),
    (font(5), "Single gap limit used by the app: 65 mm"),
    (font(5), ""),
    (font(6.5), "BEAM B2  (top face)"),
    (font(5), "Main bars: 12 mm"),
    (font(5), "Rings: 8 mm"),
    (font(5), "Ring spacing, end zone: 50 mm"),
    (font(5), "End zone length: 150 mm from the left end"),
    (font(5), "Ring spacing, middle: 75 mm"),
    (font(5), "Cover: 25 mm (tape reading)"),
    (font(5), ""),
    (font(6.5), "WEIGH TEST  (IS 1786, 1 m = 0.617 / 0.888 kg)"),
    (font(5), "200 mm of 10 mm: about 123 g"),
    (font(5), "200 mm of 12 mm: about 178 g"),
]
y = 20 * PX
for f_, t in lines:
    d.text((18 * PX, y), t, fill=0, font=f_); y += int(f_.size * 1.7)
save(np.array(im), "spec_A4")

# ---------------------------------------------------------------- 7. half-scale props: card S (100 mm) and a 300 mm strip
SQS, MKS, MARS = 15, 11, 5                       # 6 x 6 squares of 15 mm -> 90 mm pattern, 100 mm card
ids_s = np.arange(360, 378, dtype=np.int32)      # "card 20" in the 18-id blocks
board_s = cv2.aruco.CharucoBoard((N, N), float(SQS), float(MKS), DICT, ids_s)
side_s = (N * SQS + 2 * MARS) * PX
img_s = board_s.generateImage((side_s, side_s), marginSize=MARS * PX, borderBits=1)
im = Image.fromarray(img_s); d = ImageDraw.Draw(im)
d.text((MARS * PX, int(0.8 * PX)), "SARIYA CARD S  ids 360-377  sq 15  mk 11  DICT_5X5_1000", fill=0, font=font(2.2))
d.text((MARS * PX, side_s - int(3.6 * PX)), "pattern width (nominal 90): _____ mm", fill=0, font=font(2.2))
save(np.array(im), "card_S")
det_s = cv2.aruco.CharucoDetector(board_s)
for dist in (0.25, 0.3, 0.5, 0.6, 0.8):
    gsd = 0.376 * dist                                    # mm per px, 4K main camera
    px = int(100 / gsd)
    small = cv2.GaussianBlur(cv2.resize(img_s, (px, px), interpolation=cv2.INTER_AREA), (0, 0), 1.0)
    cc, cid, mc, mid = det_s.detectBoard(small)
    print(f"card S at {dist} m: marker {MKS/gsd:.0f} px, {0 if mid is None else len(mid)}/18 markers, {0 if cc is None else len(cc)}/25 corners")

PS, MS, WS, LS, ID0S = 25, 20, 30, 300, 450       # 12 markers of 20 mm at 25 mm pitch, 30 mm wide, ids 450-461
st = np.full((WS * PX, LS * PX), 255, np.uint8)
for i in range(LS // PS):
    m = cv2.aruco.generateImageMarker(DICT, ID0S + i, MS * PX, borderBits=1)
    x = int(round((i * PS + (PS - MS) / 2) * PX)); y = ((WS - MS) // 2) * PX
    st[y:y + MS * PX, x:x + MS * PX] = m
im = Image.fromarray(st); d = ImageDraw.Draw(im)
for i in range(LS // PS + 1):
    xx = min(i * PS * PX, LS * PX - 1)
    d.line([(xx, 0), (xx, int(2.5 * PX))], fill=0, width=PX // 3)
d.line([(0, 0), (0, WS * PX)], fill=0, width=PX // 2)
d.text((int(1.2 * PX), int(26.2 * PX)), "<- 0 end at the column face. ids 450-461, marker 20, pitch 25. Centre = 12.5 + (id-450) x 25 mm", fill=0, font=font(2.1))
save(np.array(im), "strip_300")
det_m = cv2.aruco.ArucoDetector(DICT)
for dist in (0.25, 0.3, 0.5, 0.8):
    gsd = 0.376 * dist
    sm = cv2.GaussianBlur(cv2.resize(st, (int(st.shape[1] / (PX * gsd)), int(st.shape[0] / (PX * gsd))), interpolation=cv2.INTER_AREA), (0, 0), 1.0)
    c, ids, _ = det_m.detectMarkers(sm)
    n = 0 if ids is None else len(ids)
    err = 0 if ids is None else max(abs(cc[0][:, 0].mean() * gsd - (12.5 + (i - ID0S) * PS)) for cc, i in zip(c, ids.ravel()))
    print(f"strip_300 at {dist} m: {n}/12 markers, max centre error {err:.2f} mm")
print("written to", OUT)
