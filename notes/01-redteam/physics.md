# Accuracy physics: can one phone camera and a card do this? (Claude lane, 30 Sep 2026)

Tags: [S] seen in a search result (URL given), [C] computed here (script in the session scratchpad), [I] inference.

## Verdict per check

| Check | Verdict | Why |
|---|---|---|
| Bar count, slab mesh | **Sound** | Top layer fully visible; bottom layer visible through the gaps. |
| Bar count, beam bottom bars | **Marginal** | Corner bottom bars hide under the top bars when you look down into the formwork. Count what's visible, then prompt for the rest. |
| Spacing, slab bars and stirrups | **Sound** | Expected error ±3-6 mm, while the decisions that matter are 25-50 mm apart (100 vs 150 vs 200). Published single-photo work reports 5.12 mm MAE. |
| Stirrup spacing by zone (beam ends) | **Sound, with a strip fiducial** | The stirrup top legs lie in the card's plane when the card sits on the cage, so it's planar. A beam is longer than one frame, so it needs a strip or several cards. |
| Diameter class 16/20 vs 8/10/12 | **Sound** | Gaps of 4 mm or more. |
| Diameter class 8 vs 10 vs 12 | **Marginal** | Worst-case rib envelope plus mass tolerance leaves 0.84 mm between a 10 and a 12, which allows only ~3.4% total scale error. It works only on still frames, closer than 0.5 m (or with the 3x tele), and with depth corrected. |
| Underweight "12 mm" bars (fake/under-rolled TMT) | **Not by camera** | A 5-10% mass shortfall is only 0.25-0.5 mm of diameter. Use a weigh test (below). |
| Hook angle, 90 vs 135 | **Sound only as a per-hook close-up; marginal inside a sweep. Code-dependent.** | From directly above, a 90° hook with a horizontal tail and a 135° hook look alike, so the check needs an oblique view or triangulation. **IS 456 allows 90° + 8φ; IS 13920 (135°) is mandatory only in zones III-V, and Bengaluru is zone II.** |
| Cover: side cover in beams | **Sound** | From above you can see the gap between the stirrup and the side shuttering. |
| Cover: bottom cover | **Not observable** | Hidden under the mesh. Detect whether cover blocks are present (marginal: an absence claim needs a coverage proof), and prompt for one tape reading. |

## Numbers

iQOO 15 cameras [S: gsmarena.com/vivo_iqoo_15_5g-14198.php, 91mobiles.com/iqoo-15-price-in-india]:
- **Main:** 50 MP Sony IMX921, 1/1.56", 24 mm equivalent, OIS.
- **Tele:** 50 MP IMX882, 3x (85 mm equivalent), OIS.
- **Ultra-wide:** 15 mm equivalent.
- **Video:** 4K at 24/30/60 fps and 8K at 30.

Derived [C]: main f = 5.66 mm (HFOV 71.6°); tele f = 16.0 mm (HFOV 23.0°).

Ground sample distance, in mm per pixel [C]:

| Distance | Main, 4K | Main, 12.5 MP binned | Main, 50 MP | Tele, 4K |
|---|---|---|---|---|
| 0.3 m | 0.113 | 0.106 | 0.053 | 0.032 |
| 0.5 m | 0.188 | 0.177 | 0.088 | 0.053 |
| 1.0 m | 0.376 | 0.354 | 0.177 | 0.106 |
| 1.5 m | 0.563 | 0.530 | 0.265 | 0.159 |

- **Pixel resolution isn't the bottleneck.** At 1 m in 4K, a 10 mm bar is 27 px wide and a 12 mm bar 32 px. The limits are scale (depth), blur, and what "diameter" means on a ribbed bar.
- **The IDEA.md line "at ~30 cm one pixel is well under 0.1 mm"** is only true for 50 MP stills. 4K at 30 cm gives 0.113 mm. Replace it with: "at 50 cm, 4K resolves 0.19 mm per pixel; a 10 and a 12 mm bar are 53 and 64 pixels wide."

**Diameter.** Nominal diameter is not the silhouette width. Transverse ribs add roughly 8-14% to the envelope [I: rib height ~0.04-0.07d assumed; IS 1786 specifies rib area, not a single height]. IS 1786 mass tolerance is ±7% for 8-10 mm and ±5% for 12-16 mm [S: trybuildcalc.com/knowledge/steel/tmt-bar-weight-chart]. That means:
- a 10 mm bar can weigh 0.574-0.660 kg/m;
- a 12 mm bar can weigh 0.844-0.933 kg/m.

Envelope width ranges [C]:

| Nominal | Envelope width |
|---|---|
| 8 mm | 8.3-9.4 mm |
| 10 mm | 10.4-11.8 mm |
| 12 mm | 12.6-14.0 mm |
| 16 mm | 16.9-18.7 mm |

**Weigh test (the better diameter check).** Put a 1 m offcut on a ₹500 kitchen scale and have the phone read the display.
- 10 vs 12 mm is 0.66 vs 0.84 kg/m. That's unambiguous, and it catches underweight fake TMT, which the camera never will.
- The reading goes into the signed pack. This turns the weakest camera check into the strongest anti-fraud check.

**Out-of-plane bias with a card-plane homography** [C]. A bar that sits Δz below the card at camera height H shrinks by Δz/(H+Δz):

| Camera height | Card on top of the top bars | A bottom layer ~19 mm down | Up to 40 mm down |
|---|---|---|---|
| 0.5 m | 1.4% (2 mm on 150) | 3.7% (5.5 mm) | 7.4% (11 mm) |
| 1.0 m | 0.7% | 1.9% | 3.8% |

- For spacing this is correctable with a layer model (the bar diameters are known), or it disappears with triangulation.
- For diameter, it alone can consume the 3.4% budget. Diameter needs triangulated depth.

**Triangulation from the sweep** [C]. Depth precision is 0.2-0.6 mm at 0.5 m with a 150 mm baseline and 0.3-1 px disparity error. **Card pose error dominates, not matching.**
- ArUco: roughly ±5-10 mm and ±0.5° at 1 m for a single 10 cm marker [S: zbotic.in blog; low-grade source].
- A ChArUco board with many corners at 0.5 m is far better, and multiple markers cut the maximum error [S: arxiv.org/pdf/2509.17345].
- Target: a rigid 20 cm ChArUco card, not a paper sheet sagging between bars.

**Motion blur, which the "10 s sweep" ignores** [C]. At a hand speed of 0.25 m/s:

| Exposure | Blur |
|---|---|
| 1/60 s (shade, early morning, inside formwork) | 4.2 mm |
| 1/250 s | 1.0 mm |
| 1/1000 s | 0.25 mm |

- Blur across a bar inflates its width one for one, so diameter must come from still frames.
- Rolling-shutter shear while panning adds 2-3% to spacing along the pan direction [I].
- **Fix:** "stop-and-hold" stations. The gyro picks the sharpest frames, and each station takes a burst of stills plus the continuous torch.

**Coverage.** With the card in frame, one view at 0.5 m covers about 0.72 × 0.41 m (4K 16:9). A 3 × 4 m slab panel would need about 40 such views.
- **"Ten seconds for the whole slab" isn't physical at diameter-grade resolution.** Spacing at 1 m covers 1.44 × 0.81 m per view, about 10 views.
- **Fix:** an inspection protocol, not a full as-built. Scan the critical zones:
  - beam ends (the confinement zones);
  - cantilever top steel;
  - laps;
  - 2-3 slab patches.
- **Also a printed "Sariya strip":** a 2 m roll of ChArUco markers whose IDs encode position. Laid along a beam, it gives continuous scale for stirrup spacing by zone.

## Literature: it has been done in labs, never as a product
| Work | Setup | Result |
|---|---|---|
| Remote rebar spacing from one oblique photo (Computer-Aided Civil and Infrastructure Eng., 2026) | Single photo, estimated camera pose, a scale reference | MAE 5.12 mm on spacing and length [S: sciencedirect.com/science/article/pii/S1093968726012429] |
| RGB-D + YOLO segmentation (ISARC 2024) | Depth camera, 0.7 m | MAE 1.98 mm [S: iaarc.org 2024 ISARC proceedings] |
| YOLOv8-GB binocular | Stereo, ~1 m, tilt under 15° | MAE 1.12 mm [S: sciencedirect.com/science/article/abs/pii/S0263224124021638] |
| Point-cloud diameter classification | Laser scan | Needs ≥10 pts/cm² for D10-D20; small diameters are the weak class [S: sciencedirect.com/science/article/abs/pii/S0926580520310566] |
| Rebar size from bundle ends (CNN + homography, Buildings 2021) | Bundle cross-sections, not placed bars | Size + count [V: api.semanticscholar.org abstract] |
| Hook angle by computer vision | None found | [S: absence in two searches]. A novelty point, and a data risk: no public dataset. |

- **Implication for the pitch:** the claim "metric rebar geometry from one RGB camera is a new capability" is **false as research** (see the 2026 single-photo paper). It's true as an **on-device, offline, code-checking product**.
- **Reframe:** "Labs have shown single-camera spacing at ~5 mm; nobody has put it on a phone that works offline, abstains near the limit, and checks it against the house's drawing."

## Changes this forces in IDEA.md
1. "Sweeps for 10 seconds" → "scans each critical zone in a few seconds, holding still at each station". Keep "under 2 minutes per beam" only once it has been measured.
2. Diameter class: camera for 16/20 vs 8-12; for 8/10/12, a camera estimate *with abstention* plus the weigh test. Put the weigh test into the fake-TMT story.
3. Hooks: "90° where the drawing (or IS 13920 in zones III-V) requires 135°". Never call a 90° hook a code violation in Bengaluru by default. The demo narration must cite the drawing.
4. Cover: "side cover measured; bottom cover blocks detected where visible, one tape reading prompted".
5. No spacing tolerance is written into IS 456 (cl. 12.3 covers effective depth ±10/15 mm and cover +10/0 mm) [S: testbook.com / nfrlyconstruction.org IS 456 PDF]. The rulebook needs an engineer-set spacing tolerance per project (workstream 6).
6. The Q&A answer "one pixel is well under 0.1 mm" gets the replacement line under "Numbers" above.

## Features this suggests (for workstream 4)
- **Tele-camera diameter mode:** 3.5× finer pixels from a standing position, so nobody has to crouch over the mesh.
- **Gyro-gated stop-and-hold capture** with the torch on, plus a burst of stills per station.
- **A Sariya strip fiducial** for beams, and a rigid ChArUco card for patches.
- **A weigh test** (scale-display OCR, IS 1786 unit-mass bands), signed into the pack.
- **A zone-aware rulebook:** seismic zone and drawing hook type decide the 90/135 rule.
- **A critical-zone inspection protocol:** beam ends, cantilever top steel, laps, and random slab patches, with a coverage map that proves each zone was seen before any "absent" verdict.
