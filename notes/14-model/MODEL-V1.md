# Bar segmentation model v1 (9 Oct 2026)

The one AI model in the camera loop: it marks which pixels are steel bar. Lines, mm and verdicts are maths and rules on top of it (IDEA.md v4).

## What it is
| Item | Value |
|---|---|
| Architecture | U-Net, MobileNetV3-Large-100 encoder (`segmentation_models_pytorch` 0.5.0, encoder `tu-mobilenetv3_large_100`), 6.7 M parameters |
| Input / output | RGB 1152 x 640 → one logit per pixel, bar = sigmoid > 0.5. Export wraps it to NHWC raw 0-255 in, probability out (`prep/train/export_litert.py`) |
| Start weights | ImageNet: timm `mobilenetv3_large_100.ra_in1k` (Apache-2.0) |
| Fine-tune data | ROI-1555 only (below) |
| File | `models/seg/v1/unet_mbv3_1152.pt` (27 MB, PyTorch state dict, sha256 `203ef1f88a5eed65bb5e20cf3285176f6d7b299540a5d7cdfc8e12ce7ec8c4e8`) |

## Data
- **ROI-1555** (Sun, Fan, Shao, *Advanced Engineering Informatics* 65, 103224, 2025; https://huggingface.co/datasets/tsrobcvai/ROI-1555_Rebar_Detection_and_Instance_Segmentation_Dataset). 1,555 real placed-rebar photos with per-bar polygons ("straight", "hoop"), merged into one bar class. **No licence declared:** research and hackathon use with citation; ask the authors before any product use.
- Verified with `prep/train/verify_labelme.py`: 1,555 images, 10,481 bar instances (7,803 straight, 2,680 hoop), 0 errors. Label overlays: `models/seg/v1/roi1555_labels_sheet.jpg`.
- Tiled with `prep/train/prep_data.py --tiles 1`. Split: **train 853, val 271 (scen1), test 427 (scen2 + scen3)**. The two test scenes never appear in training. Manifest with the sha256 of every tile: `models/seg/v1/dataset.json`.
- Not used yet: ConRebSeg (22.6 GB, demolition scenes), Roboflow sets (need an API key), whiesty synthetic (Baidu only), our prop photos (round 2).

## Training (Kaggle, private)
- Kernel `sabarinarayanakg/sariya-unet-train`, version 4, Tesla T4, offline. Pushed from the laptop with `prep/train/kaggle/push_train.sh 50`.
- The kernel runs `train_unet.py` verbatim plus a bootstrap. Libraries and ImageNet weights come from the private dataset `sabarinarayanakg/sariya-train-deps`; data from `sabarinarayanakg/sariya-roi1555-tiles`.
- 50 epochs, batch 8, AdamW 3e-4 one-cycle, Dice + BCE, AMP, thin-bar augmentation (`augment.json`). 17:17-18:17 UTC, 9 Oct (22:47-23:47 IST), git `b5df62c`. Full log: `models/seg/v1/train_log.json`.

## Results
| Split | IoU | F1 |
|---|---|---|
| Val (scen1), best epoch 48 | 0.871 | 0.931 |
| **Test (scen2 + scen3, held out)** | **0.847** | **0.917** |

Visual check (`models/seg/v1/test_sheet.jpg`; green = hit, blue = missed, red = false alarm):
- **Strong:** meshes and cages, IoU 0.89-0.94 per image.
- **Weak:** thin or distant stirrup legs seen side-on, IoU 0.65-0.81. Shiny aluminium rails are sometimes marked as bar. **Keep bare metal out of the demo frame**; round 2 on prop photos should fix most of it.

## Reproduce
```bash
uvx --from 'huggingface_hub[hf_xet]' hf download tsrobcvai/ROI-1555_Rebar_Detection_and_Instance_Segmentation_Dataset --repo-type dataset --local-dir ~/sariya-data/roi1555
uv run prep/train/verify_labelme.py ~/sariya-data/roi1555 1260/img_label scen1/test2017 scen2/test2017 scen3/test2017
# prep_data.py with the four coco/*.json files, --tiles 1, --sites sites.csv, --val-sites scen1, --test-sites scen2 scen3
kaggle datasets create -p ~/sariya-data/roi1555_tiles --dir-mode zip
prep/train/kaggle/push_train.sh 50
kaggle kernels output sabarinarayanakg/sariya-unet-train -p runs/
```

## Lessons
- **Kaggle needs a verified phone.** Until then a GPU job silently runs on CPU, with no internet; the only clue is the `pin_memory ... no accelerator` warning. Check with `kaggle kernels logs -f`.
- **The M5 laptop (16 GB) trains at 6 img/s, batch 2 at most.** Batch 8 needs ~13 GB and swaps. `train_unet.py` has no MPS path, so on a Mac it silently uses the CPU. The T4 does ~12 img/s (limited by CPU augmentation).
- **ROI-1555 restarts file names in every folder.** `prep_data.py` now keeps sub-folders in tile names (fixed 9 Oct).

## Disclosure line (for the README and the jury)
"Segmentation: U-Net with a MobileNetV3 encoder, ImageNet weights (timm, Apache-2.0), fine-tuned on ROI-1555 (Sun et al. 2025, cited) on a Kaggle T4. Timestamped log, dataset hash and git hash in `models/seg/v1/`."

## Export and on-device benchmark
See §Benchmark below (filled after the export run).
