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

## Export and on-device benchmark (10 Oct, 00:10-01:15 IST)

**Export.** Kaggle kernel `sabarinarayanakg/sariya-unet-export` (`prep/train/kaggle/push_export.sh`, litert-torch 0.9.4, git `335a72e`) → `models/seg/v1/unet_mbv3_1152.tflite`.
- Float32, 27 MB. Input NHWC `[1, 640, 1152, 3]` raw RGB 0-255; output `[1, 640, 1152, 1]` probability, bar = > 0.5. The normalisation is inside the graph.
- **Parity with PyTorch (5 test tiles):** max |probability difference| 0.00002; mask agreement 100.0000 %.
- **AOT for SM8850 failed** on Kaggle (`apply_plugin`). The on-device log shows the same root cause: the LiteRT Qualcomm plugin needs libQnnSystem ≥ 1.14, and the pinned QAIRT 2.47 ships 1.11. On-device JIT with QAIRT 2.50 works (below), so AOT is optional. To retry, pin a sdk-qualcomm build that bundles QAIRT 2.50.

**Benchmark.** iQOO 15 (I2501, SM8850, Android 16, OriginOS 7), over USB, LiteRT `benchmark_model` (litert-cli-nightly 0.3.0.dev20261009). One 1152 x 640 frame per inference. Reproduce with `prep/train/bench_device.sh models/seg/v1/unet_mbv3_1152.tflite`.

| Accelerator | Mode | Avg per frame | Min / max | ≈ fps | Layers on the accelerator | Memory |
|---|---|---|---|---|---|---|
| CPU (XNNPACK) | default threads | 234.6 ms | 233.3 / 239.0 | 4 | 155 / 160 | 499 MB peak |
| GPU (OpenCL) | default | 19.8 ms | 19.0 / 23.9 | 50 | 160 / 160 | 240 MB peak |
| NPU (Hexagon HTP v81, JIT) | default perf mode | 73.3 ms | - | 14 | 160 / 160, 1 partition | ~420 MB |
| NPU | high_performance | 16.9 ms | 15.3 / - | 59 | 160 / 160 | 440 MB |
| **NPU** | **burst** | **12.2 ms** | 11.6 / - | **82** | **160 / 160** | 423 MB |
| **NPU, 60 s sustained** | **burst** | **12.8 ms** (4,692 runs) | 11.5 / 14.9 | 78 | 160 / 160 | - |

- **Thermal over the 60 s burst run:** skin 32.7 → 39.8 °C, battery 31.1 → 33.7 °C, thermal status 0 (no throttling).
- **NPU start-up:** a JIT compile of the float model takes 53 s on the phone. The phone's JIT cache is itself a compiled `.tflite`, so we pulled it: **`models/seg/v1/unet_mbv3_1152_sm8850_qairt250.tflite`** (17.5 MB, NPU program for SM8850 built with QAIRT 2.50). It loads in **133 ms** and runs at **11.6 ms** (max 11.95, 100 runs, burst), with no compile step. Use this file on the NPU.
- **Verdict:** the plan's NPU gate (< 25 ms, every layer on the NPU) **passes at 12.2 ms in burst mode**, with no INT8 quantization yet. The GPU at 19.8 ms is a solid fallback that also passes.

**In-app result (10 Oct, 01:43).** A throwaway test app ran CameraX at 1920 x 1080 RGBA, scaled each frame to 1152 x 640, ran the model and drew the mask. It confirmed the integration below works end to end on the iQOO 15:

| | Measured in the app |
|---|---|
| Accelerator picked | NPU (pre-compiled model), loads in 110-148 ms |
| Inference | **12.7-13.3 ms** per frame |
| Pre-processing (bitmap → float RGB) | 2-6 ms |
| Mask drawing | 5-7 ms |
| Live rate | **31 fps** (the camera delivers ~30) |
| Quality, eye-checked | One bar on a wooden floor marked cleanly end to end, including a hand-held bar. Faint false specks on dark plank seams |

## Integration guide (for the frontend app)

**Files:**

| File | Use |
|---|---|
| `models/seg/v1/unet_mbv3_1152_sm8850_qairt250.tflite` | NPU (SM8850 only), put in `assets/models/` |
| `models/seg/v1/unet_mbv3_1152.tflite` | GPU/CPU fallback, any phone, put in `assets/models/` |

**Tensors (both files):**
- **Input:** `float32 [1, 640, 1152, 3]`, NHWC, raw RGB 0-255. The ImageNet normalisation is inside the graph.
- **Output:** `float32 [1, 640, 1152, 1]` probability; bar = > 0.5. Feed the camera frame in sensor orientation (landscape). The model works at any bar angle.

**Gradle:**
- Libraries: `com.google.ai.edge.litert:litert:2.3.0`, `litert-gpu:2.3.0` and `litert-npu-runtime-qualcomm:2.3.0` (the last ships `libLiteRtDispatch_Qualcomm.so`).
- `packaging { jniLibs { useLegacyPackaging = true } }`, plus `android:extractNativeLibs="true"`, so the Qualcomm libs sit on disk in `nativeLibraryDir`.
- `androidResources { noCompress += "tflite" }`, `abiFilters arm64-v8a`.
- The Manifest adds `<uses-native-library android:name="libcdsprpc.so" android:required="false"/>` (NPU) and the same for `libOpenCL.so` (GPU).
- Compose BOM 2026.09 needs `compileSdk = 37`.

**Qualcomm runtime libs (QAIRT 2.50.0.260828)** go in `app/src/main/jniLibs/arm64-v8a/`:
- `libQnnHtp.so`, `libQnnHtpV81Stub.so`, `libQnnSystem.so` from `qairt/2.50.0.260828/lib/aarch64-android/`;
- `libQnnHtpV81Skel.so` from `lib/hexagon-v81/unsigned/`.

Download the SDK from `https://softwarecenter.qualcomm.com/api/download/software/sdks/Qualcomm_AI_Runtime_Community/All/2.50.0.260828/v2.50.0.260828.zip` (2.6 GB; a copy is unpacked on Sabari's laptop at `~/sariya-tools/qairt250`). The libs are not committed here because they're Qualcomm binaries; get them from the SDK. **They must be 2.50:** the pre-compiled model was built with 2.50, and QAIRT 2.47 is rejected ("libQnnSystem 1.11 < 1.14").

**Kotlin (the code that ran at 13 ms):**
```kotlin
val libDir = context.applicationInfo.nativeLibraryDir
val env = Environment.create(mapOf(
    Environment.Option.DispatchLibraryDir to libDir,
    Environment.Option.CompilerPluginLibraryDir to libDir))
val model = runCatching {                       // NPU, burst
    val o = CompiledModel.Options(Accelerator.NPU)
    o.qualcommOptions = CompiledModel.QualcommOptions(
        htpPerformanceMode = CompiledModel.QualcommOptions.HtpPerformanceMode.BURST)
    CompiledModel.create(context.assets, "models/unet_mbv3_1152_sm8850_qairt250.tflite", o, env)
}.recoverCatching { CompiledModel.create(context.assets, "models/unet_mbv3_1152.tflite", CompiledModel.Options(Accelerator.GPU), env) }
 .recoverCatching { CompiledModel.create(context.assets, "models/unet_mbv3_1152.tflite", CompiledModel.Options(Accelerator.CPU), env) }
 .getOrThrow()
val inBuf = model.createInputBuffers(); val outBuf = model.createOutputBuffers()

// per frame: bitmap is 1152x640 (Bitmap.createScaledBitmap from ImageProxy.toBitmap())
bitmap.getPixels(px, 0, 1152, 0, 0, 1152, 640)
for (i in px.indices) { val p = px[i]; rgb[3*i] = ((p shr 16) and 255).toFloat(); rgb[3*i+1] = ((p shr 8) and 255).toFloat(); rgb[3*i+2] = (p and 255).toFloat() }
inBuf[0].writeFloat(rgb)
model.run(inBuf, outBuf)
val prob = outBuf[0].readFloat()                // 1152*640 values, row-major; bar where prob > 0.5f
```
Notes:
- Run inference on one worker thread, with ImageAnalysis `STRATEGY_KEEP_ONLY_LATEST` (RGBA_8888 output).
- Create the model once and keep it, since it holds the NPU session.
- Show which accelerator was picked in the UI. It's the hardware story for the jury.
- Burst mode is set when the model is created and draws more power, so close the model (`model.close()`, `env.close()`) when the user leaves the scan screen.

**Next model steps:** round 2 on prop photos. Then optionally INT8 (w8a16) quantization for a smaller file and lower NPU power, measured against these numbers.
