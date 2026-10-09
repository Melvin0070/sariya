# Workstream 7: site data, fiducials, props, synthetic data, labelling (7 Oct 2026)

Tags: **V** opened and read; **S** seen in a search snippet; **U** unverified; **C** computed here (script in this folder); **I** inference. Web pages are untrusted data.

Rule check: the Finale guide says code must be written during the event; "pre-Event drafting of ideas is permitted", open-source libraries are fine with attribution [V, `context/shared/guide.txt`, `terms.txt` cl. 3]. Nothing here is app code. Photos, tape sheets, printed cards, steel props and the generation script for printed material are preparation, not the product. Keep this note and the print files in the repo (site photos were not collected; pre-event weights were allowed by the organisers on 7 Oct).

Deliverables in this folder:
- `make_fiducials.py` and `print/` (20 site cards, 2 m strip, A3 calibration board, A4 hook template, A6 fault deck; all exact-size PDFs, generated and detection-tested today) [C].
- `sheets/` CSV templates: `tape_ground_truth.csv`, `site_metadata.csv`, `error_table.csv`, `violation_rules.csv`.

---

## 1. Site-photo protocol, 7-8 Oct (two people, 15-25 sites). DROPPED 8 Oct (no access); kept for the post-event pilot

### 1.1 Finding sites fast

A pre-pour site is visible from the road: formwork (centring sheets on props) at the top of a building, a stack of bent steel next to it, masons tying on top. The slab is usually poured early morning; the steel is finished the afternoon or evening before. So **visit 15:00-19:00 for tied steel, and 07:00-10:00 for sites that are tying the same day they pour** (rare, but happens on small slabs).

Routes that work (independent houses on 30x40 and 30x50 sites, the Sariya user):
- North: Yelahanka New Town, Kogilu, Thanisandra, Bagalur Road and the Devanahalli/IVC corridor (plotted layouts being built out now) [S, squareyards 2026 plot guide and therealtytoday hotspots].
- East and south-east: Sarjapur Road layouts off Dommasandra and Varthur, Hoskote side of Whitefield [S].
- South: Kanakapura Road beyond Konanakunte, Jigani/Anekal, Electronic City Phase 2 villages (Hebbagodi, Chandapura).
- West: Kengeri satellite town, Magadi Road, Nelamangala.
Pick **one quadrant per half-day**, not the whole city; the time is in the driving.

Lead sources, ranked by yield per hour [I]:
1. **Steel and cement shops on the arterial road of a layout.** They delivered the steel yesterday and know which plots are "slab tomorrow". Ask for the owner or the delivery boy. Buy something (binding wire, cover blocks; you need them anyway) before asking.
2. **Centring (formwork) contractors and RMC transit-mixer drivers** parked at a site: they have tomorrow's pour list.
3. **Tata Tiscon dealers** via https://tatatiscon.co.in/dealer-locator (state, district, pincode search; helpline 1800-108-8282) [V page opened]. Ask whether a Tiscon customer-service engineer visits sites in the area and whether you can tag along.
4. **Cement technical services**: UltraTech 1800 210 3311 (IVRS: 1 home builder, 2 contractor, 3 engineer) [S]; JSW Cement 1800 266 2661, Mon-Sat 10-18, Contractors' Circuit lists "reinforcement checking" and "technical support at slab casting" [S/V, jswcement.in/contractors-circuit]; Ambuja 1800 22 3010, site visits at major concreting [S]. Ask for the Bengaluru territory technical engineer and one slab visit. This is also the GTM contact (workstream 9).
5. **Brick&Bolt** +91 7505 205 205, support@bricknbolt.com, Ashok Nagar HQ [S]. A site engineer who will let you photograph one of their slabs is worth two random sites (you get a drawing and a contract form).
6. Friends in construction (the stand-out box says the team has them): one WhatsApp message today asking for "any slab being tied tomorrow".

Do not use Nambike Nakshe or BBMP data to find sites; it is slow and irrelevant for a two-day sweep.

### 1.2 On arrival (script)

Who to talk to: the mason-in-charge (maistry) first, then the owner if present. Never climb without asking. Carry a hard hat each (₹150, hardware shop), closed shoes, and the printed consent card.

Hindi/Kannada opener (say it, do not read it):
> "Namaste. Hum engineering students hain, Bengaluru ke ek hackathon ke liye. Hum steel ki photo lete hain, phone se spacing naapne wala app bana rahe hain. Sirf steel ki photo, aapke chehre ki nahi. 15 minute. Aapka naam ya plot number kahin nahi aayega. Theek hai?"
> (Kannada) "Namaskara. Naavu engineering vidyarthigalu, hackathon-ge. Steel-na photo thogolthivi, phone-nalli spacing alathe maadoke app maadthidivi. Steel photo maatra, mukha alla. Hadinaidu nimisha. Hesaru, plot number yellu baralla. Aagutta?"

Consent wording (printed card, English on one side, Kannada and Hindi on the other; signature optional, a thumbs-up on video is fine):
> We are photographing the reinforcement steel on this site for a student software project. We will not photograph faces on purpose and will blur any that appear. We will not record names, plot numbers or addresses; the site gets a code. The photos may appear in a hackathon demo and a public code repository. You can say no, and you can ask us to delete the photos at any time: [team phone number].

DPDP Act 2023 note: photos of steel are not personal data; faces and plot addresses are. Blurring faces and keeping only a site code keeps us out of scope [I; the Act's text is at the MeitY site, not re-read today]. Also do not photograph the drawing's title block (owner name): photograph the schedule table only.

Questions to ask while the other person shoots (goes into `site_metadata.csv`):
- Is there a drawing or bar-bending schedule? May we photograph the table (not the name block)?
- Who checked the steel today? Did an engineer come, or will one come before the pour? A cement or steel company engineer?
- Which brand of steel (read the rib mark or the bundle tag; ask only if unreadable)?
- Contract form: labour-only, labour plus material, or turnkey? Who buys the steel?
- What language does the crew prefer for instructions (Hindi, Kannada, Telugu, Bengali, Odia)? The crew's origin decides the default voice language.
- When is the pour? Could we come back at the pour to photograph the RMC slip (a date stamp for the record)?

### 1.3 Shot list per site (30-40 minutes, two people)

Phone settings: main camera, 4K60 video and full-resolution stills, torch available, HDR off if it can be turned off, exposure locked by tap-and-hold, **zoom locked at 1x** (digital zoom changes the intrinsics). Use the iQOO 15 if a loaner is already in hand; otherwise the team's own phone, and note the model, since the model trained at the event will see iQOO frames. Same framing on both phones if both are available.

Place: card lies flat on the top layer of bars, printed side up, one corner at a tied intersection; strip lies along the top of a beam's stirrups, 0 mm at the support face.

Per **slab patch** (2-3 patches per slab: one mid-panel, one at a support, one at a cantilever if any):
| # | Shot | Why |
|---|---|---|
| 1 | Wide context still from 2-3 m: the whole slab with the card visible | coverage map, site replay |
| 2 | Stills straight down at **0.4, 0.6, 1.0, 1.5 m** above the card, torch off | the distance-vs-error curve for the error table |
| 3 | The same four distances, torch on | low-light branch |
| 4 | Two oblique stills at ~30 deg off vertical at 0.6 m | homography robustness |
| 5 | **Tape across the exact span**: lay the tape from the centre of bar 1 to the centre of bar 6 in each direction, still at 0.6 m with the tape readable (zoom crop later) | ground truth; this photo is also the demo opener |
| 6 | 4K60 "stop-and-hold" video: 10 s at 0.6 m, slow 3-station pan across the patch, torch on | the gyro-sharpness selector test; training frames |
| 7 | Bottom layer: one still angled so the lower bars show through the gaps, plus a tape on the lower layer where a hand fits | the layer-model bias check (physics.md) |
| 8 | Cover blocks: one still at 0.3 m of a cover block under the bottom bar, one of a run without blocks if any | cover-block presence detection |
| 9 | Laps: one still of each visible lap with the tape along it | lap-length table |
| 10 | Top steel over the support/cantilever: still with the tape | "trampled top steel" class |

Per **beam** (every beam end you can reach, up to 4 per site):
| # | Shot | Why |
|---|---|---|
| 11 | Strip along the top of the stirrups from the support face; stills at 0.5 and 1.0 m looking down, torch on and off | stirrup spacing by zone |
| 12 | Tape from the support face along the same line, still; a second still with the tape across any two stirrups that look wrong | ground truth |
| 13 | Side-face still at 0.4 m of the stirrup leg against the shuttering, tape in frame | side-cover check |
| 14 | **Hook close-up**: two stirrup corners at 0.2-0.3 m, one straight-on and one oblique, hook template laid beside if the corner is reachable | hook class |
| 15 | Bottom bars: still from the beam end looking along the cage | "count what is visible" test |

Per **site** once:
| # | Shot | Why |
|---|---|---|
| 16 | Steel bundle tag or rib mark close-up (brand, grade) | brand field; rib-mark OCR roadmap |
| 17 | Drawing/schedule table (no name block) | drawing values |
| 18 | One offcut of at least 0.2 m on the kitchen scale if the site has offcuts (ask; tape its length, weigh, do not take) | weigh-test ground truth |
| 19 | 20 s walking video of the whole floor, no card | coverage, site replay |

File naming: `S07_SL1_d060_torch1_IMG_1234.jpg` is too much to type on site. Instead: keep the phone's names and fill `photo_ids` in the CSV from the last four digits, one row per tape reading. Transfer to the laptop every evening into `data/sites/S07/` with the CSV; back up to a second disk.

### 1.4 Tape ground truth: how to read it

- Spacing: centre to centre over **five gaps**, divide by five. Record the single 5-gap reading in mm, not the average; the sheet does the division. A 5-gap reading on a steel tape held by one person is good to ±3 mm [I]; the per-gap value is then ±1 mm. That is finer than the app's band, which is the point.
- Count: count twice, two people.
- Stirrup spacing: tape from the support face; write the position of each stirrup's centre for the first eight stirrups (one row per stirrup, `check=stirrup_pos`), then one reading per 5 gaps mid-span.
- Cover: the gap from the stirrup leg to the shuttering, in mm, at two points per beam. Bottom cover: the cover-block height, if present.
- Lap: tape along the overlap.
- Diameter: the rib mark or tag says the brand and size; measure one bar with a vernier if a hand fits (₹250 digital vernier, optional).

`sheets/tape_ground_truth.csv` columns: `site_id, member_id, member_type, layer, check, span_from_bar, span_to_bar, n_bars_in_span, tape_mm, tape_reader, photo_ids, note`.

### 1.5 Per-site metadata

`sheets/site_metadata.csv` columns: site_id, date, time_arrived, time_left, gps_lat, gps_lon, area, building_type, floor_being_cast, member_types_present, pour_planned, drawing_available, drawing_photo_id, drawing_slab_dia_mm, drawing_slab_spacing_mm, drawing_beam_main_dia_mm, drawing_stirrup_dia_mm, drawing_stirrup_endzone_mm, drawing_stirrup_midspan_mm, steel_brand_on_tag, steel_brand_claimed, who_present, engineer_visited_before_pour, brand_engineer_expected, contract_form, crew_language, consent_given_by, consent_faces, contact_for_followup, card_ids_used, strip_used, light_condition, weather, n_members_checked, n_violations, violation_list, notes.

GPS stays in the sheet, never in the deck; the deck says "N sites in four Bengaluru zones".

### 1.6 The "N of M sites had at least one violation" statistic

This number goes on slide 1, so it must survive a hostile question.
1. **Rules fixed before the first site** (`sheets/violation_rules.csv`): nine checks, each with the clause and the "counts if" line. Spacing tolerance is ours (single gap + max(15 mm, 25 %) over the drawing; mean + max(10 mm, 5 %)) because IS 456 gives none [V, EVIDENCE.md]; say so on the slide footnote.
2. **Every site gets the same minimum set**: 2 slab patches (both directions), 2 beam ends, cover blocks, and the drawing question. If a site cannot give the minimum set, it is "partial" and is excluded from M, not counted as clean.
3. **Tape only.** The statistic is from the tape sheet, not from the app, so it is independent of the model.
4. **With no drawing**, only code-limit checks count (spacing above the IS 456 maximum, no cover blocks, lap shorter than 50d). Report the two groups separately: "with drawing: N1 of M1 off the drawing; without drawing: N2 of M2 outside the code".
5. **Report a range, not a point.** For M = 20 and N = 12, the 95% Wilson interval is 39-78%. Put "12 of 20 sites (we checked every one with a tape)" on the slide and keep the interval for the Q&A.
6. Keep the photo with the tape for each counted violation; that is the slide-1 image and the jury's spot-check.
7. Never name a site, a mason or a brand next to a violation.

### 1.7 Realistic plan

Two people, one car or bike, two half-days each day. Driving between sites in the periphery is 15-25 minutes; a site is 30-40 minutes. That is **4-6 sites per half-day, 16-22 in two days if two leads per half-day pan out**. Budget: fuel ₹1,000, tea and biscuits for crews ₹500, hard hats ₹300.

Fallback if the day yields fewer than 6 sites: a single builder (Brick&Bolt, or a friend's contractor) with three slabs in the same week gives three sites and a drawing each.

---

## 2. Fiducials: design and printing (HISTORICAL full-scale kit, not printed; the demo kit is §3: card S + strip_300)

All generated by `make_fiducials.py` (OpenCV 5.0.0 contrib, Pillow; also runs on 4.8+ since the `CharucoBoard` class API is the same from 4.7) [C]. Everything uses **one dictionary, `DICT_5X5_1000`**, so the app runs one detector pass; ID ranges tell the objects apart.

| Object | IDs | Geometry | File |
|---|---|---|---|
| Site card k (k = 0..19) | 18k .. 18k+17 | 6x6 ChArUco, 30 mm squares, 22 mm markers, 10 mm margin; **200 x 200 mm** | `print/card_kk.pdf` |
| Beam strip | 400-439 | 40 markers of 40 mm at 50 mm pitch; **2000 x 60 mm**; marker centre = 25 + (id-400) x 50 mm from the 0 end, which goes at the column face; ticks every 50 mm | `print/strip_2m.pdf` |
| Calibration board | 500-543 | 11x8 ChArUco, 35 mm squares, 26 mm markers; **A3 420 x 297 mm** | `print/calibration_A3.pdf` |
| Hook template | 600 (30 mm, scale only) | 135 and 90 deg gauges with tail ticks at 65/75/80 and 64/80 mm; **A4 landscape** | `print/hook_template_A4.pdf` |
| Fault deck | none | 12 A6 cards | `print/fault_deck_A6.pdf` |

### 2.1 Why these numbers

- Detection needs a marker of roughly 30 px for the code and 50 px for a usable pose [S, OpenCV DetectorParameters docs and the ArUco paper's canonical-size note]. The 4K main camera gives 0.15 mm/px at 0.4 m and 0.45 mm/px at 1.2 m (physics.md). A 22 mm marker is therefore 147 px at 0.4 m and 49 px at 1.2 m [C].
- Self-test in the script: card 00 shrunk to the pixel size the camera would see and blurred 1 px, then run through `CharucoDetector`: **18/18 markers and 25/25 corners at 0.4, 1.0, 1.2 and 1.5 m** [C]. Real print, glare and oblique views will be worse; expect 1.5 m to be the practical ceiling, which matches the "re-scan at 1.2 m" demo beat.
- 5x5 bits rather than 4x4: 7 cells per marker including the border, 3.1 mm per cell on the card, 7 px at 1.2 m; false-positive rate is lower than 4x4 at a cost of nothing we can measure. 1000 IDs give room for 20 unique cards plus strip and board without collision.
- 25 ChArUco corners per card give the homography; a single 10 cm ArUco marker is ±5-10 mm at 1 m (physics.md), the board is far better.
- The per-site ID is the **card number** (its 18 IDs are unique). The app stores card number + date + first-use hash; a second site with the same card the same day is flagged. Write the site code in the pen box on the card as well. Twenty cards cover 20 sites and the demo; the fault deck's "replay" card uses card 19.

### 2.2 Generation (the exact snippet)

```python
import cv2, numpy as np
PX = 12                                   # px per mm -> 304.8 dpi, integer-pixel squares
D = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_5X5_1000)

# site card k: 6x6 squares of 30 mm, 22 mm markers, ids 18k..18k+17, 10 mm margin -> 200 mm
k = 0
board = cv2.aruco.CharucoBoard((6, 6), 30.0, 22.0, D, np.arange(18*k, 18*k+18, dtype=np.int32))
img = board.generateImage((200*PX, 200*PX), marginSize=10*PX, borderBits=1)
cv2.imwrite(f"card_{k:02d}.png", img)      # then Pillow: Image.fromarray(img).save("card.pdf", resolution=304.8)

# strip marker i at position i*50 mm
m = cv2.aruco.generateImageMarker(D, 400 + i, 40*PX, borderBits=1)

# detection (what the app will do), same board object:
det = cv2.aruco.CharucoDetector(board)
charuco_corners, charuco_ids, marker_corners, marker_ids = det.detectBoard(gray)
```

Full script: `make_fiducials.py` (run it again if the sizes change; it rewrites `print/`). The online generator at calib.io works too but defaults to a legacy ChArUco pattern; OpenCV 4.6+ boards start with a black square at the origin, and `setLegacyPattern(True)` exists for old boards [S, OpenCV docs]. Use our files, not an online one, so the app's board object matches the print.

### 2.3 Printing (Bengaluru, today)

Where: any signage shop ("flex and sunboard printing", Chickpet, SP Road, Jayanagar 4th Block, Koramangala 5th Block; Printo stores do posters and acrylic but their site does not list sunboard [V, printo.in opened]; a signage shop is faster and cheaper). Indicative: print + lamination + mounting on 3 mm sunboard ₹170-215 per sq ft [S, Printo estimator pages]; matte lamination alone ₹22 per sq ft [S]; star flex ₹15-20 per sq ft [S, indiamart Bengaluru listings].

What to ask for, in order:
1. "Print this PDF **at 100 %, actual size, no fit-to-page**. The card is exactly 200 x 200 mm." Show the PDF page size on your phone.
2. Site cards: **4 copies now** (demo plus three field cards), the rest later if needed: eco-solvent or UV print on self-adhesive vinyl, **matte lamination** (glare off the torch kills markers), mounted on **3 mm sunboard** (PVC foam board). Acrylic is heavier and glossy; skip it. Ask them to cut square with a 2 mm safe margin, not through the black border.
3. Strip: 2000 x 60 mm on **star flex (350-510 gsm) with matte lamination**, or self-adhesive vinyl stuck to a 2 m roll of 40 mm thick PVC/HDPE strip if they have one; flex rolls up and drapes onto the stirrups, which is fine because scale is local to each marker pair. Ask for two copies.
4. Calibration board: A3 on 3 mm sunboard, matte, flat (no bubbles: the corners are the measurement).
5. Hook template: A4 on 3 mm sunboard, or on 300 gsm card laminated.
6. Fault deck: 12 A6 cards on 300 gsm, matte, corners rounded; or print at home and cut.
7. Consent card: A5, two-sided, 300 gsm, 2 copies (text in section 1.2; add Kannada and Hindi yourself).

After printing, **measure every card with the tape** (two edges of the chess pattern, 180 mm nominal) and write the value in the box on the card. Any scale error goes straight into the error band: 1 mm on 180 mm is 0.55 %, which is 0.8 mm on a 150 mm spacing. Do the same for the strip: 10 pitches = 500 mm nominal; record the measured value per copy. Flex can be 0.5-1 % off [I].

Budget: cards 4 x 0.43 sq ft x ₹200 ≈ ₹350; strip 2 x 1.3 sq ft ≈ ₹100 on flex; A3 board ≈ ₹300; template ≈ ₹150; deck and consent ≈ ₹200. **About ₹1,100.** Same-day at a signage shop if you arrive before 14:00.

### 2.4 Camera calibration plan (not app code; a calibration file is data)

- Demo (9 Oct): 25-30 stills of card S at 0.25-0.5 m (`calibrate.py --card 20 --square-mm <measured/6>`). Full-scale original: 30-40 stills of the A3 board filling 30-70 % of the frame, tilted up to 40 deg, at 0.3-1.0 m, in the exact capture mode (4K video frame grabs **and** full-res stills, separately; the two modes have different crops). Use the loaner on 9 Oct evening before the clock if hand-over allows; otherwise the team's phone for the site data now, and recalibrate the loaner during Green Light hour 1 (a 10-minute job).
- OIS moves the lens group and changes the principal point slightly frame to frame [I]; the card homography absorbs most of it because scale comes from the card in each frame, not from the intrinsics. Calibrate anyway for undistortion.
- Store as `calib_<phone>_<mode>.json` with reprojection error; the numbers screen can show it.

---

## 3. Demo props: half-scale kit (9 Oct)

Rule: as small as possible while every demo beat still works. Every distance is half of a real house (8 mm bars at 50 mm instead of 100); the app reads the spec, so it checks a half-scale mesh exactly as it checks a real one. Say so on stage: "half-scale props; the app reads whatever the drawing says". Bar sizes stay real (8 and 12 mm), so the weigh test and the steel are genuine.

| # | Item | Spec | Qty | Approx ₹ |
|---|---|---|---|---|
| 1 | 8 mm TMT | about 4 m, cut into **11 x 280 mm** (slab: 5 + 5 + 1 spare) and **5 x 125 mm** (beam rings) | ~1.6 kg | 130 |
| 2 | 12 mm TMT | **2 x 300 mm** (beam) + **1 x 200 mm** (offcut) | ~0.7 kg | 60 |
| 3 | 10 mm TMT | **1 x 200 mm** scrap piece, labelled "12" | 1 | 15 |
| 4 | Board | **280 x 280 mm**, plywood or any stiff flat board | 1 | 80 |
| 5 | Black cloth | matte cotton, 1 m | 1 | 150 |
| 6 | EVA foam sheet 10 mm | strips 280 x 20 mm: one layer left/right, two layers front/back | 1 small sheet | 80 |
| 7 | Small items | double-sided tape, masking tape, marker, Blu-Tack | | 120 |
| 8 | Kitchen scale | 1 g resolution | 1 | 300 |
| 9 | Steel tape, mm | | 1 | 150 |
| 10 | Gloves | one pair (judge) | 1 | 100 |
| | **Total** | | | **≈ ₹1,200** + printing ≈ ₹100 |

Printing (all small; any photocopy shop): **`card_S.pdf`** (100 x 100 mm) and **`strip_300.pdf`** (300 x 30 mm) at **100 % size** on thick matte paper or card, stuck flat onto cardboard with matte (not glossy) lamination or none; **fault cards** F1, F2, F3, F12 and **`spec_A4.pdf`** on plain paper. After printing: card pattern 90 mm, strip 10 ticks 250 mm; write the measured values on them. The 200 mm card and 2 m strip are not needed.

Everything is under 30 cm: the kit fits a laptop backpack.

### 3.1 Slab: 5 x 5 mesh at 50 mm, 280 x 280 mm

X from the left edge, Y from the back edge (away from the jury), mm.

```
            X:   0  40   90   140  190  240 280
   Y=0     ┌──────────────────────────────────┐  back edge
           │▓▓▓▓▓▓▓ foam (top bars), 2 layers ▓│
   Y=40    │▓══╪════╪════╪════╪════╪═════════▓│  B1
   Y=90    │▓══╪════╪════╪════╪════╪═════════▓│  B2   bottom layer, ends in
   Y=140   │▓══╪════╪════╪════╪════╪═════════▓│  B3   the left/right foam
   Y=190   │▓┌─┼────┼─┐══╪════╪════╪═════════▓│  B4
           │▓│ CARD S │  │    │    │         ▓│
   Y=240   │▓└═╪════╪═┘══╪════╪════╪═════════▓│  B5
           │▓▓▓▓▓▓▓ foam (top bars), 2 layers ▓│
   Y=280   └──────────────────────────────────┘  front edge (jury side)
                T1   T2   T3   T4   T5   ← top layer, ends in the front/back foam
```

| Part | Position |
|---|---|
| Board | 280 x 280, wrapped in the black cloth |
| Foam strips | 20 mm wide on all four edges: one 10 mm layer left/right (bottom bars), two layers (20 mm) front/back (top bars sit ~8 mm higher) |
| Bottom bars B1-B5 (8 mm, 280 mm) | Y = 40 / 90 / 140 / 190 / 240, ends pressed into the left/right foam |
| Top bars T1-T5 (8 mm, 280 mm) | X = 40 / 90 / 140 / 190 / 240, resting on the bottom bars, ends pressed into the front/back foam |
| Card S (100 mm) | front-left, resting on T1 and T2: X ≈ 15-115, Y ≈ 155-255. No fault moves T1, T2, B4 or B5 |
| Ticks (masking tape) | front face: top bars home 40/90/140/190/240, "F4" at 212, "F2" at 220. Left face: bottom bars home 40/90/140/190/240, "F12" at 60 |

Spec: 8 mm @ 50 c/c both ways, 5 x 5. Single-gap limit 65 (50 + max(15 mm, 25 %)); mean limit 60.

| Card | Move | Result |
|---|---|---|
| CONTROL | nothing | both directions: gaps 50/50/50/50 |
| F1 | lift T3 | 4 of 5, slot 3 empty |
| F2 | slide T4 from 190 to 220 | top gaps 50/50/80/20: "gap 3: 80 ± 5, limit 65" (± is the 5 mm floor until P16 measures one) |
| F4 | slide T4 to 212 | top gap 72: re-scan at 0.8 m (card S too small in the frame), outside at 0.3 m |
| F12 | slide B2 from 90 back to 60 | lower gaps 20/80/50/50: "lower bars, gap 2: 80 ± 4" |

Scan distance: whole mesh at 0.3-0.35 m (the 200 mm bar grid fits the ~244 mm short side at 0.3 m; the measurement zone is the bar grid ±10 mm, i.e. 30-250 mm, never the board edge, or every rule reads "not seen"); single-gap checks at 0.25-0.3 m. Re-scan rule for the demo: card markers under ~45 px (card S beyond ~0.65 m) means "too far, re-scan".

Build (about 30 minutes): wrap the board, stick the foam, lay B1-B5, lay T1-T5, check all eight gaps at 50 ± 1, place the card, put the ticks on.

### 3.2 Beam (top face, half scale)

- Two 12 mm bars, 300 mm, parallel, 75 mm apart, flat on the cloth.
- Five 8 mm pieces, 125 mm, across them at **25 / 75 / 125** mm from the left end (end zone 150 mm @ 50) and **200 / 275** (middle @ 75), a dab of Blu-Tack under each crossing.
- `strip_300` along the centreline on top of the pieces, 0 end at the left end.
- Spec: rings 8 mm @ 50 for the first 150 mm, @ 75 in the middle.
- F3: slide the second piece (75) into the middle (~180, tick it; at 190 it nearly touches the 200 piece) → end-zone gap 100, "add 1".

### 3.3 Weigh test

Two 200 mm offcuts: 10 mm labelled "12" (~123 g) and a real 12 mm (~178 g); IS 1786 individual bands at 0.2 m: 10 mm 114-132 g, 12 mm 167-186 g. Length measured to the mm and written on each label. F8 deck card: the spare 280 mm slab bar (~111 g, 8 mm class).

---

## 4. Synthetic data plan

Existing work:
- **whiesty/synthetic-datasets-for-rebar** (GitHub): 2,500 PNG images at 1280 x 720 with PNG masks and YAML labels, download only via Baidu Pan (code wtiy), no code, no licence, last push Nov 2022 [V, README read via `gh`]. Not usable from India without a Baidu account; treat as a reference of what a BIM-rendered rebar dataset looks like.
- Buildings 2023, 13(3):585, "Synthetic datasets for rebar instance segmentation using Mask R-CNN": BIM plus rendering software, no manual labelling; mixed real + synthetic beat either alone [S, abstract only; mdpi.com returned 403].
- IAARC 2024 "A synthetic data generation pipeline for point-cloud-based rebar segmentation": a fully parameterised rebar generator with domain randomisation, 92.1 mAP on real data for point clouds [S].
- Roboflow Universe has several small public rebar segmentation sets (rebar-panoptic-segmentation, rebar-seg, rebar_dataset-segsm, CC BY 4.0; RebarSegH/HV with 60-144 images) [S]; the pages returned 403 to our fetch, so check the image counts and whether they are placed cages or bundle ends in a browser before relying on them.
- BlenderProc 2 (DLR, GPL-3) renders with perfect instance masks and depth; it is the standard pipeline [S].

Recommendation: **a small BlenderProc generator written this week (it is a data tool, not the app), 1,500-3,000 images, plus the 2D OpenCV generator as the fallback**. The event model is then trained on: prop photos + synthetic (many) + Roboflow public sets (attributed); no site frames exist.

### 4.1 Blender/BlenderProc procedural cage

Scene: a ground plane (formwork texture: plywood, steel centring sheet, rusted), a slab mesh or beam cage of cylinders, the Sariya card and strip as textured planes placed on the top bars, cover blocks as small cubes, a camera 0.3-1.6 m above looking down with jitter, a sun or area light plus an optional "torch" point light at the camera.

Randomise:
- bar diameter 8/10/12/16 mm (cylinder radius), rib geometry as a displacement or bump texture, rust/oil material mix;
- spacing 90-300 mm per direction, with per-bar jitter ±15 mm and 0-2 missing or doubled bars;
- two layers with a 15-45 mm gap, chairs, bottom-layer offset;
- beam: 4-6 longitudinal bars, stirrup pitch 75-250 mm in up to three zones, hook type 90/135, stirrup tilt;
- card pose (flat on top bars, ±5 deg tilt, 0-30 % occlusion by a hand or a bar), strip sag;
- camera height, 0-35 deg tilt, roll, focal length matching the iQOO main camera (71.6 deg HFOV), rolling-shutter-free;
- light: sun elevation, overcast, torch on/off, shadows from the formwork props, 0-1.5 px motion blur;
- background clutter: tools, wire coils, sand, people's feet, the tape itself (so the model ignores it).

Outputs per image: RGB (1280 x 720 or 1920 x 1080), instance mask per bar and per stirrup, class map (bar, stirrup, card, cover block, tape), and a JSON with the true centre-line positions in the card plane, true spacings, true count, true stirrup positions, camera pose and intrinsics. That JSON is the spacing ground truth for a regression check, not just for segmentation.

Render budget on a laptop [I, no clean benchmark found; the search gave only unrelated Cycles numbers]: Eevee at 1280 x 720 is roughly 1-3 s per frame on an M-series Mac or a laptop RTX; Cycles at 64 samples with denoising is 10-30 s. **Eevee, 2,000 frames, one overnight run.** Add 200 Cycles frames for a realism check. If Blender is not installed on the laptop by the evening of 7 Oct, skip to 4.2.

### 4.2 The 2D OpenCV generator (two hours to write, 1,000 images per minute)

Draw the card plane first: a homography from a random camera pose turns a metric layout (bars as thick anti-aliased lines with a rib texture strip, stirrups as rectangles, the card image warped with the same homography) into the image; the bottom layer uses a second homography at a depth offset; shade with a random gradient, add Perlin noise background, random shadows (dark polygons), Gaussian blur 0-2 px, JPEG artefacts, torch vignette. Masks come free from drawing the same primitives into a label image. Ground truth is the metric layout.

It will not teach rib appearance or real rust; it will teach the geometry prior (parallel families of thick lines under a homography with a card) and it makes the thin-bar recall of an INT8 model testable on the first morning.

### 4.3 Attribution line for the repo

"Synthetic images rendered with BlenderProc (GPL-3, DLR-RM) from our own generator; public rebar images from Roboflow Universe (CC BY 4.0, authors listed in DATA.md); site photos ours, faces blurred, consent recorded."

---

## 5. Labelling plan for site photos

Tool: **Roboflow Annotate with Smart Polygon** (SAM in the browser, one click per bar; free tier) for speed, or **CVAT with the SAM interactor** if the images must stay off a US server (they can; faces are blurred and there is no address). Label Studio works but has no comparable one-click SAM out of the box. Roboflow's own forum warns of 2-60 s SAM delays per image on large uploads; downscale to 1920 px long side before upload [S].

Time per image [S for the generic numbers, I for rebar]: a bounding box 12-15 s, a manual polygon mask over 2 minutes, SAM-assisted 40-60 % faster. A mesh frame has 10-14 bars plus a card: **4-6 minutes per image with Smart Polygon**, 10-15 manual. Thin bars under oblique light are where SAM fails; expect one manual fix per image.

Classes (keep to five): `bar_top`, `bar_bottom`, `stirrup`, `card`, `cover_block`. Tape, hands and tools are background. Do not label diameter; it comes from the weigh test and the close-up classifier later.

DROPPED (no site visits). Original plan: before the event, **60-100 labelled frames** (two people, two evenings, 6-8 hours total), chosen for diversity: every site, every distance, torch on and off, both slab and beam, 20 % oblique. The export (YOLO-seg or COCO) is a data file; the training happens at the event. Everything else (the 4K60 video) stays unlabelled; the model's own predictions can pseudo-label frames during Red Light hours if there is time.

Error-table template (`sheets/error_table.csv`): `site, member, check, app_value, app_band, tape_value, distance, lighting, pass_abstain, notes`. One row per (site, member, check, distance, lighting). The numbers screen reads this file: mean absolute error per check, band coverage (share of rows where |app - tape| is within the band; target above 90 %), abstention rate by distance.

---

## 6. Hour-by-hour, 7-8 Oct

Two people, A (driver, talker, metadata sheet) and B (camera, tape, ground-truth sheet). Swap roles each site. Sunset is about 18:05.

**Wed 7 Oct**
| Time | A | B |
|---|---|---|
| 09:00 | Email organisers (props, pretrained weights, timetable) and Brick&Bolt; WhatsApp construction friends for "slab tomorrow" leads; call Tiscon 1800-108-8282 and JSW 1800 266 2661 for a Bengaluru technical engineer | Run `make_fiducials.py`, check the PDFs, go to a signage shop (SP Road or Jayanagar) with the PDFs on a stick: 4 cards, 2 strips, A3 board, template, deck, consent cards; ask for 16:00 pickup |
| 10:30 | Steel dealer in the chosen quadrant: buy the BOM steel (cut list on paper), binding wire, cover blocks; ask the shop for today's "slab tomorrow" sites | Amazon/hardware: scale, tape x2, LED panel, tripod clamp, gloves, hard hats, kit bag; print consent cards at home if the shop is slow |
| 12:30 | Lunch; load the sheets on both phones (Google Sheets offline or a notes app) | Same |
| 13:30-18:30 | **Sites 1-5** in the first quadrant (afternoon tying); leads from the dealer and friends | Shooting per section 1.3; tape sheet |
| 16:00 | (one of you) collect the prints; measure every card and strip with the tape; write the values on them | |
| 19:30 | Transfer photos to the laptop, back up; fill CSVs; note what went wrong in the protocol | Build the mesh board (fix the bottom bars, stick the foam strips) and the beam cage; weigh the three offcuts and photograph the scale |
| 21:30 | Install Blender + BlenderProc; start the generator (or write the OpenCV one) | Start labelling 20 frames in Roboflow; measure minutes per frame |

**Thu 8 Oct**
| Time | A | B |
|---|---|---|
| 07:00-10:00 | **Sites 6-9**: early-morning tying and one pour (photograph the RMC slip) in a second quadrant | |
| 10:30 | Call the brand technical engineer or Brick&Bolt back; try to join one of their visits in the afternoon | Label 20 more frames; check the overnight synthetic render |
| 13:00-18:30 | **Sites 10-18** in a third quadrant, or the brand engineer's route | |
| 19:00 | Fill CSVs; compute "N of M" from the tape sheet; pick the slide-1 photo (tape in frame, violation visible, no face, no address) | Calibrate the team phone with the A3 board (both modes); dry-run the demo on the mesh board with the card at 0.4/0.6/1.0/1.5 m with the phone's own camera app |
| 21:00 | Write the site statistics into EVIDENCE.md (status V, our own data) and the open items into STATE.md | Label to 60-100 frames; export; pack the kit bag; charge everything |

(Historical; did not happen.) **Fri 9 Oct morning** was the buffer: a tenth site if the count is below 12, a structural engineer on record (IDEA.md §8), and the rulebook review with the engineer.

---

## 7. Things to confirm (open)
- Organiser answer on steel props: answered 7 Oct, props allowed (PREP-PLAN §7.7).
- Roboflow dataset contents and counts (pages returned 403 today; open in a browser).
- Whether the loaner phone can lock zoom and disable HDR in 4K60; otherwise capture at 4K30.
- Spacing tolerance max(15 mm, 25 %) single gap, max(10 mm, 5 %) mean: our versioned proposal (no engineer review logged).
- Print-shop scale error measured on every card (box on the card).

Sources opened or seen today: tatatiscon.co.in/dealer-locator (V); infralens.in/prices/steel/bangalore (V); github.com/whiesty/synthetic-datasets-for-rebar README via gh (V); printo.in (V); jswcement.in/contractors-circuit (S, from EVIDENCE.md V); indiacustomercare pages for UltraTech 1800 210 3311, JSW 1800 266 2661, Ambuja 1800 22 3010 (S); bricknbolt.com contact (S); OpenCV 4.x/5.0 CharucoBoard docs and DetectorParameters (S, API verified by running it); Printo estimator sunboard rates and indiamart flex rates (S); dealsmagnet kitchen-scale listings (S); mdpi.com/2075-5309/13/3/585 abstract and iaarc.org 2024 paper 147 (S); Roboflow Universe rebar sets (S); guide.txt and terms.txt (V, local).
