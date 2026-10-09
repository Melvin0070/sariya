# prep/ — pre-event reference code (not app code)

Everything here is tooling and the executable spec the Kotlin app follows at the event (9-11 Oct).
No Android code lives here. Two packages:

- `ref_pipeline/` — Python reference for the camera-to-numbers path: calibration, card/strip pose,
  classical bar mask, centrelines, error band, Tier-1 verdicts, one-shot CLI. 25 synthetic unit tests.
- `train/` — dataset prep, U-Net-lite training, `.tflite` export + LiteRT AOT, AI Hub profiling.

Plane convention used everywhere (the Kotlin port must keep it): **card mm** = OpenCV board frame,
x right, y down on the print, origin at the chess pattern's top-left corner (the 200 mm card runs
−10..190; card S runs −5..95). **Strip_300 mm** = same convention, y 0..30. **Strip mm** = origin at the strip's left end, x along the strip, y down (0..60).
Zones, link positions, bar offsets and spec files are all in that frame.

## 0. Setup (10 min)

```bash
cd prep
python3 -m venv .venv && .venv/bin/pip install opencv-contrib-python-headless numpy scikit-image pillow pytest
.venv/bin/python -m pytest ref_pipeline/tests -q      # 25 passed in ~8 s on an M-series Mac
```
That is enough for everything in `ref_pipeline/` and for `train/prep_data.py`. Training and export need a
Linux box with Python 3.12 and `train/requirements.txt` (pins checked on PyPI 7 Oct 2026; torch is held at
2.13.0 because litert-torch 0.9.4 requires `torch<2.14`).

## 1. Order of operations, with time

| # | Step | Command | Time | Output |
|---|---|---|---|---|
| 1 | Regenerate `rules.json` after any rulebook edit | `.venv/bin/python -m ref_pipeline.extract_rules` | 1 s | `ref_pipeline/rules.json` (50 rules, v0.1.0) |
| 2 | Calibrate a phone in its measurement mode (25-30 stills of the A3 board, or of card S for the half-scale demo with `--card 20 --square-mm <measured/6>`, 30-70 % fill, tilts to 40°, locked focus) | `.venv/bin/python -m ref_pipeline.calibrate FRAMES/ --mode iqoo15_main_4k_still_f0.8 -o intrinsics.json` | 1 min | `intrinsics.json` (K, dist with k3 fixed, RMS; target < 0.3 px) |
| 3 | Measure one still | `.venv/bin/python -m ref_pipeline.run_one --image x.jpg --intrinsics intrinsics.json --spec spec.json` | 3-4 s per 4K frame | `x_result.json`, `x_overlay.png` |
| 4 | Bench accuracy on the demo cage (P9): 5 distances × 3 tilts × 3 lights, tape truth | loop step 3; collect `families.*.spacings_mm` vs tape | 3 h | the field floor (95th pct of \|app − tape\|) → `band.field_floor_mm` in every spec |
| 5 | Dataset prep | `python train/prep_data.py --coco roi1555/_annotations.coco.json --images roi1555/ --out data/ --classes rebar straight hoop --tiles 1 2 --val-sites <public-source-a> --test-sites <public-source-b>   # no site photos exist; split public data by source` | 10-20 min for ~3k images | `data/{train,val,test}/{images,masks,masks3}`, `dataset.json` (sha256), `augment.json` |
| 6 | Train U-Net-lite (Kaggle/Colab T4) | `python train/train_unet.py --data data/ --out runs/unet --epochs 50 --batch 8` | 1.5-3 h GPU | `runs/unet/unet_mbv3_1152.pt`, `train_log.json` (start/end, git hash, dataset sha256, per-epoch IoU) |
| 7 | Export + AOT for the SoCs | `python train/export_litert.py --weights runs/unet/unet_mbv3_1152.pt --out export/ --socs SM8850 <test-phone-soc>` | 10 min (+5 min first SDK build) | `export/unet_mbv3_1152.tflite` (float, any accelerator) + `unet_mbv3_1152_Qualcomm_SM8850.tflite` + fallback |
| 8 | Prove no CPU fallback | `qai-hub configure --api_token …; python train/profile_aihub.py --model export/unet_mbv3_1152.tflite` | 5-15 min queue | `aihub/profile_<job>.json`, job URL for the deck, PASS/WARN line (budget 25 ms) |
| 9 | Smoke-test the prep script any time | `.venv/bin/python train/smoke_prep_data.py` | 5 s | prints `smoke test OK` |

`ref_pipeline/make_samples.py` writes a synthetic 4K slab scene, intrinsics and both spec layouts into
`ref_pipeline/samples/` and runs the CLI on it; use those files as the templates for the real cage stills.

## 2. What each module does and what the Kotlin port mirrors

| File | Function | Port notes |
|---|---|---|
| `fiducials.py` | Board objects: card k = `CharucoBoard((6,6), 30, 22, DICT_5X5_1000, ids 18k..18k+17)`, strip `Board` with 40 markers (ids 400-439, 40 mm, 50 mm pitch, marker i TL at x = 50i+5, y = 10), A3 calib board ids 500-543; card S = card 20 (ids 360-377, 15/11 mm); `strip300_board` (ids 450-461, 20 mm, 25 mm pitch) | Build the same objects with the *measured* square / pitch of the print. `DetectorParameters.cornerRefinementMethod = CORNER_REFINE_SUBPIX` is what makes the 0.2 px corner term true. |
| `calibrate.py` | `calibrateCamera` on matched ChArUco points, **`CALIB_FIX_K3`**, per-frame RMS, mode name in the JSON | Hour-1 task; the app refuses an intrinsics file whose `capture_mode` is not the shooting mode. |
| `card_pose.py` | Undistorted grey → `detectMarkers` (card k from ids) → `CharucoDetector.detectBoard` → `matchImagePoints` → `findHomography(img, obj_xy, RANSAC 3 px if ≥12 pts)` → `solvePnP(IPPE)` for tilt/distance only | **Measurement uses the homography; PnP only gates.** `tilt_deg` = plane normal vs optical axis (not the viewing ray; a flat card at the image corner is fine). `distance_m` = z-depth of the fiducial (sets the GSD). For the strip only the along-strip tilt is trusted; `tilt_across_deg` is reported but never gated. |
| `segment_classical.py` | Frangi (σ = 0.25/0.35/0.5 × bar width) + Otsu hysteresis on a 1920-wide copy, fiducial polygon blanked, border blanked | Stand-in for the U-Net; the mask contract is identical (bool full-res, fiducial blanked). |
| `centrelines.py` | skeleton → prune spurs (bar-width px) → **RANSAC in plane mm** (tol 2 mm, keep if extent ≥ `min_len_mm` (150 real sites, 80 half-scale props) and ≥ 50 % continuous) → families by angle (≤ 30° of x / y) → merge collinear fragments (1.5 × bar dia) → offsets along the family normal at the zone centre → adjacent spacings; count = bars crossing the zone; optional sub-pixel refinement from the full-res intensity profile | Normal is oriented +x for bars along y (so beam link positions = strip mm) and +y for bars along x. Zone continuity < 80 % on either bar of a gap flags that spacing for re-scan. |
| `error_band.py` | The six-term quadrature, ±2σ, floored at `field_floor_mm` (5 mm until P9); `band_for_mean` shrinks only the random term | Reproduces the doc's table: ±2.1 mm good case at 150 mm / 0.8 m, ±6.4 mm bad case. |
| `verdict.py` | `compare()` transcribed from rulebook §D; `check_slab_patch`, `check_beam`, `member_summary` (never "pass"); `Measurement.absent()` → needs_tape, `.unseen()` → not_seen (coverage checked first) | Keep `compare()` byte-equivalent; it is what the F4 "near limit" card exercises. Beam close-zone length = face to the midpoint of the first gap wider than spec + tol (convention for the engineer, rulebook C6). |
| `run_one.py` | Gates (≥12 corners / ≥2 strip markers, tilt ≤ 25°, 0.2 ≤ H ≤ 1.3 m, card/strip marker ≥ 45 px, sharpness) → GSD → mask → families → bands → verdicts → overlay | The order of operations for the app's measurement frame. |

## 3. Fault-deck behaviour already covered by tests

F1 missing bar → `DWG-COUNT outside`; F4 near limit (full scale) → `DWG-SPACING-MEAN rescan`; half scale (`test_pipeline_halfscale.py`): F2/F4/F12 → `DWG-SPACING-LOCAL outside` at 0.3 m, re-scan at 0.8 m by marker size, beam F3 → left end outside; F5/F9 → gates abstain
(`abstain` list in the JSON); F7 cover and missing `D` → `needs_tape`; right beam end out of frame →
`not_seen`; IS 13920 rules become advisory in Zone II.

## 4. What goes on the USB stick

```
prep/ref_pipeline/            whole package incl. rules.json, samples/, tests/
prep/train/                   scripts + requirements.txt + train_log.json of every run (audit trail)
export/*.tflite               unet_mbv3_1152.tflite, unet_mbv3_1152_Qualcomm_SM8850.tflite, *_fallback.tflite
export/export_log.json        input/output contract (NHWC float 0..255 RGB in, NHWC probability out)
aihub/profile_*.json          AI Hub evidence (job URLs, per-op compute units)
intrinsics_*.json             one per phone × capture mode (from calibrate.py)
notes/07-data-plan/print/     the card / strip / calibration PDFs that match fiducials.py
data/ours/                    prop photos + tape sheets from the event (no site photos exist)
```

## 5. Known limits / unverified

- Verified on this Mac (7 Oct): all 25 `ref_pipeline` tests; `prep_data.py` smoke test; `train_unet.py` one CPU
  epoch on the smoke tiles (encoder `tu-mobilenetv3_large_100`, Dice+BCE, augmentation pipeline, checkpoint and
  `train_log.json` written); `export_litert.AppModel` forward and the `torch.onnx.export` step of the fallback
  (205-node graph passes `onnx.checker`). Not run: litert-torch conversion, AOT, onnx2tf, AI Hub jobs.
- `export_litert.py` and the AOT call were written against the litert-torch README, the LiteRT AOT Colab
  and `litert/python/aot/vendors/qualcomm/target.py`, not run: the Qualcomm SDK wheel is Linux-only.
  `aot_compile(...)` returns a `CompilationResult`; the script tolerates both `export(dir, model_name=)`
  and `export(dir)` and lists the `.tflite` files it finds.
- `profile_aihub.py` needs an AI Hub token; the result schema (`execution_detail[].compute_unit`) was read
  from the qai-hub 0.56.0 client source.
- The classical mask was validated on synthetic bars only; real ribbed steel under a torch is the U-Net's job.
- Synthetic calibration recovers f within 0.1 % with zero distortion; real lens residuals set `eps_lens`.
