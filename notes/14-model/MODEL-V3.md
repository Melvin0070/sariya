# Bar segmentation model v3: round 3, more bar images (10 Oct 2026)

**Status: best model so far, recommended for the app.** It keeps v2's rejection of cables, keyboards and screen text, and gets back (slightly above) v1's accuracy on real rebar.

**Not yet confirmed on the half-scale props at the venue.** Check the mesh and the rusty bars on the phone before relying on it. If it misses them, fall back to v1.

## What changed from v2
- **Start:** v2 weights (`--init`), 12 epochs, lr 1e-4, batch 8.
- **Run:** Kaggle T4, kernel `sabarinarayanakg/sariya-unet-train-r3c`, git `caea715`. Training ran 02:52-03:52 UTC on 10 Oct (08:22-09:22 IST). The job had sat queued from 06:04 IST behind two orphaned sessions; see "Lessons".
- **New positives:** 2,500 synthetic stirrup scenes sampled (seed 0) from `train_syn/val2017` of **`tsrobcvai/Synthetic_Dataset_for_Stirrup_Rebar_Segmentation`** (Sun, Han, Rusinkiewicz, Shao, *Automation in Construction* 2025; no licence declared).
  - They vary colour, lighting, background and distractors. Straight segments are labelled; bends are not, which also helps teach "curved ≠ bar".
  - They were tiled on the laptop as JPEG (images) and PNG (masks), then uploaded as the private dataset `sabarinarayanakg/sariya-stirrup-tiles`: 1,732 train / 408 val / 360 test.
- **The same set's 233 real photos are test only, scored by recall.** Only their top bars are labelled.
- **Negatives:** wires 400, COCO desk objects 200 (was 400), MIT indoor 200 (was 300).
- **Dropped:** SORD (`bugwei/synthetic_on-site_rebar_data`, CC BY-NC). Its background cages and rusty bars are unlabelled, which would teach "rusty bar = not bar".
- **Totals:** train 3,122 / val 796 / test 933 tiles.

## Results (the same held-out sets for all models)
| Test | v1 | v2 | **v3** |
|---|---|---|---|
| ROI-1555 test IoU (threshold 0.5) | 0.846 | 0.811 | **0.851** |
| ROI precision / recall at 0.3 | 0.876 / 0.951 | 0.930 / 0.870 | **0.921 / 0.919** |
| No-rebar tiles with any bar (146 tiles in r3; 211 in r2) | 80.1 % | 0.0 % | **0.0 %** |
| Recall on 233 real stirrup photos | - | 0.873 | **0.910** |
| NPU latency (iQOO 15, burst, all 160 ops on the HTP) | 12.2 ms | 11.6 ms | **12.1 ms** |

- **Threshold sweep:** v3 is flat on the ROI test (IoU 0.848-0.852 for thresholds 0.3-0.6). **The app uses 0.3** for the most recall (missed bars are the bigger demo risk); precision stays at 0.92.
- **Training curve:** val IoU on the mixed val set rose 0.762 → 0.827 (best epoch 11 of 12). Not comparable to earlier rounds: that val set now includes synthetic scenes with unlabelled bends, plus no-rebar tiles.

## Files (`models/seg/v3/`)
| File | sha256 (first 16) |
|---|---|
| `unet_mbv3_1152.pt` | - |
| `unet_mbv3_1152.tflite` (float, GPU/CPU) | 26f6324ab4c4eaee |
| `unet_mbv3_1152_sm8850_qairt250.tflite` (NPU, from the on-device JIT cache, QAIRT 2.50) | 02ea7d35912cbc98 |
| `train_log.json` (includes `round2_compare`: v2 = before, v3 = after), `export_log.json` | - |

- **In the Expo app:**
  ```bash
  cd sariya-expo/android && ./gradlew :app:assembleRelease -Psariya.model=v3 -Psariya.threshold=0.3
  ```
- **Built and installed (10 Oct, 09:42):** a release APK built this way runs on the iQOO 15 loaner. Readiness shows NPU at about 18-25 ms per frame in the app loop, and card S was detected (25 corners).
- **Fallback:** a v1 build of the same app is at `/tmp/sariya-app-v1.apk` on Sabari's laptop.

## Reproduce
```bash
# data (once): download the 2,500-image sample + 233 real photos, tile, upload
#   (anonymous HF is ~1-1.5 files/s, so this takes ~30 min; the upload as JPEG is 557 MB)
NEG=1 R_STIRRUP=2500 R_COCO=200 R_INDOOR=200 STIRRUP_DATASET=sariya-stirrup-tiles \
  KERNEL_NAME=sariya-unet-train-r3c INIT_FROM=sariya-unet-train-r2 LR=1e-4 prep/train/kaggle/push_train.sh 12
SRC_KERNEL=sariya-unet-train-r3c prep/train/kaggle/push_export.sh
# NPU file: benchmark_model --use_npu --compiler_cache_path on the phone, pull the cached .tflite
```

## Lessons from this round
- **Deleting a Kaggle notebook does not stop its session.**
  - Two deleted runs (r3, r3b) kept both batch GPU slots.
  - So r3c sat queued for ~2 h 20 min while its status read RUNNING.
  - Stop sessions in the browser instead: profile → View Active Events.
- **HF throttles anonymous downloads to ~1 file/s.** Pre-tile locally and upload as a Kaggle dataset, with JPEG images (6x smaller than PNG).
- **Find datasets by slug, not by crawling `/kaggle/input`.** Crawling COCO's 160k files cost ~10 min per round, and "the first `dataset.json`" picked the wrong folder once the stirrup tiles were attached.
- **The live log (`kernels logs -f`) is unreliable.** Use the timestamped lines, which now print every 50 steps; they arrive once the stream recovers.
