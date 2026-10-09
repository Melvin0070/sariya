# Bar segmentation model v2: round 2, hard negatives (10 Oct 2026)

**Status: experimental. v1 stays the default for the app.**
- **What v2 fixed:** v1's false alarms on cables, keyboards and screen text.
- **What v2 broke:** it now misses real bars at the venue (rusty bars on a wooden desk).
- **Next:** round 3 adds venue bar photos (positives).

## What changed from v1
- **Start:** v1 weights (`--init`), 15 epochs, lr 1e-4, Kaggle T4. Kernel `sabarinarayanakg/sariya-unet-train-r2` v2, git `ba13987`, 21:24-21:54 UTC on 9 Oct (02:54-03:24 IST on 10 Oct).
- **Data:** ROI-1555 tiles (853 / 271 / 427, unchanged) plus **hard negatives** built on Kaggle by `prep/train/kaggle/r2_data.py`. Every negative pixel is "not bar":

| Negative source (attached directly on Kaggle) | Images | Licence |
|---|---|---|
| `zanellar/electric-wires-image-segmentation` (cables), seeded sample | 400 of 28,646 | unknown, train-only, private |
| COCO val2017 images with laptop / keyboard / cell phone / remote / mouse / tv (`awsaf49/coco-2017-dataset`) | 400 | CC-BY (annotations); Flickr image terms |
| MIT Indoor Scenes (`itsahmad/indoor-scenes-cvpr-2019`), 59 room types | 300 | DbCL-1.0 |

- **Totals:** train 1,581 (853 rebar + 728 negative), val 432 (271 + 161), test 638 (427 + 211).

## Results (the same held-out tiles for both)
| | v1 | v2 |
|---|---|---|
| No-rebar test tiles with any bar detected (211 tiles) | 80.1 % | **0.0 %** |
| Pixels marked bar on those tiles | 3.30 % | 0.002 % |
| ROI-1555 test IoU at 0.5 | **0.846** | 0.811 |
| Precision / recall at 0.5 | 0.900 / 0.934 | **0.942** / 0.853 |
| Precision / recall at 0.3 (v2's app threshold) | 0.876 / 0.951 | 0.930 / 0.870 |

**On the phone** (iQOO 15, test app, NPU 13 ms, 30 fps). Screenshots are in `models/seg/v2/phone_*.jpg`:
- **Desk clutter, no bars:** v1 marks the black cables, keyboard edges and laptop screen text (4.9 % of pixels). v2 marks **nothing** (0.0 %).
- **Two rusty 8-10 mm bars on a wooden desk, ~30-40 cm away:** v1 finds the left bar but misses the right one, and also marks a white cable. v2 finds only parts of the left bar. When the phone is moved closer (bars wider in pixels), both improve.
- **Diagnosis:** two gaps.
  - **Look:** ROI-1555 has almost no orange, rusty bars on warm wood.
  - **Over-correction:** in round 2 every desk-like image was a negative, so v2 learned "objects on a desk are not bars".
  - **Fix:** venue positives (our bars, on our tables, near cables), ideally more public rebar sets with varied colour and background.

## Files (`models/seg/v2/`)
| File | sha256 (first 12) |
|---|---|
| `unet_mbv3_1152.pt` | 5e3c1f9dfb3b |
| `unet_mbv3_1152.tflite` (float; parity with PyTorch: max diff 0.00002, masks 100 % equal) | 7ad05e742fad |
| `unet_mbv3_1152_sm8850_qairt250.tflite` (NPU, from the on-device JIT cache): 160/160 ops on the HTP, **11.6 ms**, loads in 115 ms | 3ddf5bbf44e3 |
| `train_log.json` (includes `round2_compare`), `export_log.json` | - |

Same tensors and integration as v1 (`MODEL-V1.md`, Integration guide). **If you try v2, use a threshold of 0.3, not 0.5.**

## Reproduce
```bash
NEG=1 KERNEL_NAME=sariya-unet-train-r2 INIT_FROM=sariya-unet-train LR=1e-4 prep/train/kaggle/push_train.sh 15
SRC_KERNEL=sariya-unet-train-r2 prep/train/kaggle/push_export.sh
```
- **The first r2 attempt wasted ~30 min:** it read all 28,646 wire images. Wires are now capped at 400.
- **The NPU file comes from the on-device JIT cache:** `benchmark_model --use_npu --compiler_cache_path` with the QAIRT 2.50 libs (`prep/train/bench_device.sh`).
