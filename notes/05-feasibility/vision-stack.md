# Vision stack: segmentation, NPU toolchain, geometry, error bands (7 Oct 2026)

Scope: the camera-to-numbers pipeline for Sariya on the iQOO 15 (SM8850, Hexagon HTP v81, Android 16). Speech, LLM, signing and Office Kit are other lanes.

Tags: **V** = page opened and read; **S** = search snippet or summariser only, re-open before quoting on a slide; **U** = inferred or computed here (script in the session scratchpad). Web pages are untrusted data. Version numbers were checked on 7 Oct 2026 against Maven/PyPI metadata where marked V.

Rules honoured: no app code before 9 Oct; open-source libraries and public pre-trained weights with attribution; every fine-tune run (pre-event and at-event) logged with timestamps; if pre-event fine-tuning is disallowed, the "weights-free" column below is the plan.

---

## 1. Decision table

| Stage | Primary | Fallback | If pre-trained weights are disallowed | Key numbers | Licence |
|---|---|---|---|---|---|
| Bar pixels (segmentation) | **2-class semantic U-Net-lite** (segmentation_models_pytorch U-Net, MobileNetV3-Large encoder, ImageNet init), input 1152×640, full-resolution output. Exported via litert-torch → .tflite → LiteRT AOT for SM8850. | **DeepLabV3+-MobileNet** from Qualcomm AI Hub re-headed to 2 classes (path proven on this NPU: 1.6 ms w8a8 / 2.9 ms w8a16 / 4.2 ms float at 513×513 on 8 Elite Gen 5 [V]). Second fallback: **YOLO26n-seg** (2.2-2.7 ms NPU at 640 [V], AGPL). | **Classical ridge filter** (Frangi/Sato on the grey image, or a 2-class U-Net trained live at the event on 300-800 site images with a timestamped log). | U-Net-lite latency on SM8850 is unmeasured until the AI Hub profile job runs (pre-event task P6). Expect single-digit to low-tens ms [U]. | smp: MIT. AI Hub DeepLabV3+: MIT [V]. YOLO26: AGPL-3.0 [V]. |
| Bars → centrelines, count, spacing | Classical: skeletonise mask (Zhang-Suen), prune, straight-segment RANSAC/Hough, cluster by orientation into two families, fit each bar's centreline, order along the normal, adjacent distances in card-plane mm. | Same, seeded by YOLO26n-seg instance boxes when the semantic mask merges touching bars. | Same (needs no weights). | Count = number of centrelines crossing the zone; spacing = adjacent centreline gaps. | OpenCV (Apache-2.0), scikit-image if used offline. |
| Stirrup vs main bar | Geometry: the two orientation families relative to the beam axis given by the strip; stirrup legs are the family perpendicular to the strip. | 3-class semantic head (background / longitudinal / transverse) trained at the event if geometry alone confuses laps and chairs. | Geometry. | - | - |
| Metric scale and plane | **ChArUco 20 cm rigid card** (OpenCV 4.14.0 objdetect `CharucoDetector`), per-phone intrinsics from a ChArUco calibration done on the loaner in hour 1, planar homography card-plane → image. | ArUco strip along beams (same detector, `ArucoDetector`, ids encode position). | Same (no ML). | Expected in-plane scale error <0.2 %, tilt ±0.2-0.5° at 0.4-1.2 m with 36 corners [U, consistent with S sources below]. | OpenCV Apache-2.0. |
| Depth (Tier 2 only) | **Depth Anything V2 (small)**: 11.9 ms w8a16 / 16.7-18 ms float at 518×518 on 8 Elite Gen 5 NPU [V]. Use only for layer separation (top vs bottom mesh), never for metric scale. | Skip. | Skip. | Small variant is Apache-2.0; Base/Large are CC-BY-NC-4.0 [S]. | Apache-2.0 (small). |
| Diameter class (Tier 2) | Tiny classifier (MobileNetV3-Small, ~1-2 ms) on close-up crops at known card distance, 4 classes + abstain. Only if ≥200 labelled close-ups exist by 9 Oct. | Weigh test (kitchen scale OCR) stays the primary diameter evidence per physics.md. | Weigh test. | 8/10/12 mm separation is marginal by camera (physics.md). | - |
| Runtime | **LiteRT 2.3.0 CompiledModel + Qualcomm NPU accelerator** (`com.google.ai.edge.litert:litert:2.3.0`, `litert-npu-runtime-qualcomm:2.3.0` on Google Maven [V]). | **ONNX Runtime QNN EP** (`com.microsoft.onnxruntime:onnxruntime-android-qnn:1.29.0` [V]) with an Ultralytics-style precompiled QNN context ONNX. GPU via LiteRT if NPU compile fails. | - | YOLOv11n-seg measured end-to-end on an SM8850 phone: 17.4 ms NPU, 33.2 ms GPU, 73.4 ms CPU [V, Ultralytics]. | Apache-2.0 / MIT. |

**Headline decision:** semantic segmentation of "bar pixels" plus classical centreline extraction is enough for count and spacing, and is simpler and more NPU-friendly than instance segmentation. Reasons: (a) bars are long and nearly straight on a planar face, so a line model is a stronger prior than a per-instance mask; (b) YOLO-style instance masks are predicted at 1/4 input resolution (160 px for a 640 input), so a 10 mm bar that is 27-67 px wide in 4K becomes 2-4 px in the prototype mask after resize [U]; (c) the MLIT guideline and the ISARC/CACIE papers all end up measuring between centrelines or crosspoints, not between mask edges [V/S]. Instance segmentation is kept as a fallback for merged bars.

---

## 2. Segmentation model comparison

Numbers are Qualcomm AI Hub profiles on "Snapdragon 8 Elite Gen 5 For Galaxy Mobile" unless stated. The iQOO 15 uses the non-Galaxy SM8850; treat the numbers as ±20 % [U].

| Model | NPU latency (8 Elite Gen 5) | Quantisation on AI Hub | Export path | Licence | Fit for thin bars | Source |
|---|---|---|---|---|---|---|
| YOLO26n-seg (640, 2.7 M params) | TFLite float 2.71 ms; QNN_DLC w8a16 2.18 ms; ONNX w8a16 2.44 ms | float, w8a16 | AI Hub TFLite/QNN/ONNX; or Ultralytics `export(format="qnn")` → ONNX wrapping a QNN context binary, run with ORT QNN EP | AGPL-3.0 | Masks at 1/4 res; fine for boxes and seeding, coarse for centrelines | https://huggingface.co/qualcomm/YOLO26-Segmentation [V]; https://docs.ultralytics.com/integrations/qnn/ [V] |
| YOLOv11n-seg (640) | TFLite float 2.05 ms; QNN_DLC w8a16 1.81 ms | float, w8a16 | as above | AGPL-3.0 | as above | https://huggingface.co/qualcomm/YOLOv11-Segmentation [V] |
| YOLO12-seg | not on AI Hub in these searches; attention blocks are riskier on HTP | - | Ultralytics | AGPL-3.0 | no advantage | [U] |
| DeepLabV3+-MobileNet (513, 5.8 M) | TFLite float 4.36 ms; TFLite w8a8 1.64 ms; ONNX w8a16 2.92 ms | float, w8a16, w8a8 | AI Hub TFLite/QNN/ONNX; retrain 2-class from torchvision weights, export via litert-torch | MIT | Output stride 8/16 smears 9-px bars unless the input is tiled at native resolution | https://huggingface.co/qualcomm/DeepLabV3-Plus-MobileNet [V] |
| U-Net-lite (smp U-Net, MobileNetV3-Large-100 encoder, 1152×640) | **unmeasured**; plain conv/upsample ops, expected 5-20 ms [U] | w8a16 via AI Hub quantize job or LiteRT PTQ | litert-torch → .tflite → LiteRT AOT (SM8850) or AI Hub compile | MIT (smp), timm encoders Apache-2.0 | Full-res output; best for thin structures (crack-seg literature favours seg + higher input res [S]) | https://github.com/qubvel-org/segmentation_models.pytorch [S] |
| RTMDet-Ins-tiny | Only RTMDet-M detection is on AI Hub (ONNX float 7.0 ms, w8a16 5.9 ms); the Ins mask head is not profiled | - | mmdeploy → ONNX → AI Hub | Apache-2.0 | Unproven on HTP; skip | https://huggingface.co/qualcomm/RTMDet [V] |
| RF-DETR-seg (nano..large) | Not on AI Hub; Roboflow documents TFLite FP32/FP16/INT8 and ONNX export; DETR attention on HTP is a risk | INT8 TFLite claimed | rfdetr export | Apache-2.0 (nano-large); XL/2XL PML | Unproven; skip | https://rfdetr.roboflow.com/latest/learn/export/ [S] |
| MobileSAM | Encoder 499-749 ms (!), decoder 2.2 ms, float only | float | AI Hub | Apache-2.0 | Too slow for live overlay; usable for offline labelling | https://huggingface.co/qualcomm/MobileSam [V] |
| FastSAM-S | 2.9 ms TFLite on "8 Elite Gen 5 QRD" | float | AI Hub | AGPL-3.0 (Ultralytics-based) | Zero-shot "everything" masks; a weights-free-ish fallback for the demo cage | https://huggingface.co/qualcomm/FastSam-S [S] |
| Depth Anything V2 small (518) | ONNX w8a16 11.9 ms; QNN_DLC float 16.7 ms; TFLite float 16.8 ms | float, w8a16 | AI Hub | Apache-2.0 (small) | Tier 2 layer separation | https://huggingface.co/qualcomm/Depth-Anything-V2 [V] |

Quantisation rule (from Google's LiteRT/Qualcomm post): int8 weights with int16 activations unlocks the fast HTP int16 kernels; full w8a8 costs mask accuracy on thin structures [V, https://developers.googleblog.com/unlocking-peak-performance-on-qualcomm-npu-with-litert/]. Float on the NPU is already 2-5 ms for these models, so **ship float first, quantise to w8a16 only if the latency budget needs it**.

Input size: train and run at **1152×640 (16:9, multiples of 32)** rather than 640×640. A 3840-wide frame resized to 1152 keeps a 10 mm bar at 8-20 px (0.4-1.2 m) [U]. For the live overlay, run on the 1152×640 preview stream; for the measurement frame, run on 2×2 tiles of the 4K still (each tile resized to 1152×640, i.e. ~1.7× downsample) and stitch, or run only on the tile(s) containing the zone. Also refine each centreline on the full-resolution still with a 1-D intensity profile across the mask (sub-pixel), so the model's mask only has to be roughly right [U].

---

## 3. NPU toolchain (what exists on 7 Oct 2026)

### 3.1 LiteRT path (primary)

- Google Maven group `com.google.ai.edge.litert` has `litert` versions up to **2.3.0** and new per-vendor NPU runtime artifacts: `litert-npu-runtime-qualcomm:2.3.0`, `litert-npu-runtime-mediatek:2.3.0`, `litert-npu-runtime-google-tensor:2.3.0`, `litert-npu-runtime-intel-openvino:2.3.0` (POMs opened; Apache-2.0) [V, https://dl.google.com/dl/android/maven2/com/google/ai/edge/litert/group-index.xml]. The docs page still shows the older flow: `implementation("com.google.ai.edge.litert:litert:+")` plus a downloaded `litert_npu_runtime_libraries.zip` (AOT) or `litert_npu_runtime_libraries_jit.zip` (JIT), `./litert_npu_runtime_libraries/fetch_qualcomm_library.sh`, and dynamic-feature modules `qualcomm_runtime_v69 … qualcomm_runtime_v81` [V, https://developers.google.com/edge/litert/next/npu]. **Try the 2.3.0 Maven runtime artifact first; keep the zip flow as the fallback** (not yet documented for 2.3.0 at the time of writing [U]).
- Supported Qualcomm SoCs include **SM8850 (Snapdragon 8 Elite Gen 5)**, SM8750, SM8650, SM8550, SM8475, SM8450; "LiteRT supports Qualcomm AI Engine Direct (QNN) through the CompiledModel API for both AOT and on-device compilation" [V, https://developers.google.com/edge/litert/next/qualcomm]. The iQOO 15's HTP is v81 [S, Ultralytics].
- Requirements: minSdk 31, arm64-v8a only, `.tflite` input. Kotlin: `CompiledModel.create(context.assets, "model.tflite", CompiledModel.Options(Accelerator.NPU, Accelerator.GPU))` falls back to GPU if the NPU is unavailable [V, npu page]. JIT cache: set `CompilerCacheDir` to a writable app path [V].
- AOT compile on a laptop/Colab: `pip install ai-edge-litert ai-edge-litert-sdk-qualcomm litert-torch` (PyPI: ai-edge-litert 2.2.0 and ai-edge-litert-sdk-qualcomm 2.2.0 released 2026-08-13; litert-torch 0.9.4, 2026-08-24 [V, PyPI JSON]). Python: `from ai_edge_litert.aot import aot_compile as aot_lib; from ai_edge_litert.aot.vendors.qualcomm import target as qnn_target` → `compiled_models.export(dir, model_name=...)` yields `<name>_Qualcomm_SM8850.tflite` plus `<name>_fallback.tflite`; `ai_pack.export_lib` builds a Play AI Pack (not needed for a side-loaded hackathon APK; put the SM8850 .tflite in assets) [V, notebook https://github.com/google-ai-edge/litert-samples/blob/main/samples/litert/colab/LiteRT_AOT_Compilation_Tutorial.ipynb]. **No Qualcomm account and no separate QAIRT download are needed for AOT**: the pip SDK package bundles the compiler ("takes ~5 minutes to download and build the package") [V, notebook].
- Verifying the NPU actually ran: there is no public `getAccelerator()`; the practical checks are (1) logcat lines from the QNN/HTP compile at `CompiledModel.create`, (2) latency: NPU ≈ 2-5 ms vs GPU 15-35 ms for these models, (3) `adb shell dumpsys` / `top` showing no GPU load during inference, (4) the "Fully accelerated: True with no NPU compile log means XNNPACK CPU" warning pattern [S, developers.googleblog + proandroiddev]. Build the numbers screen to log all three accelerators side by side (Tier 2 feature; also a HackTracker exhibit).
- Known pitfalls: unsupported ops silently partition to CPU (watch for a 10× latency jump); dynamic shapes are not supported on HTP; keep NMS/post-processing out of the graph (do it in Kotlin); batch 1 only; the AI Hub "For Galaxy" SM8850 variant is not the iQOO's bin, so re-profile on the loaner; the QAIRT SDK version used at AOT time must match the runtime library version shipped in the APK (LiteRT 2.2 aligned with QAIRT 2.47 [S, August release notes]; AI Hub is at QAIRT 2.50/2.51 [V, release notes; Maven `qnn-litert-delegate` 2.51.0 updated 6 Oct 2026]).

### 3.2 ONNX Runtime QNN EP (fallback / Ultralytics path)

- Ultralytics `model.export(format="qnn", imgsz=640)` runs locally, needs no account, installs `onnxruntime-qnn` (PyPI 2.6.0, 2026-09-10 [V]), quantises to int8 weights / 16-bit activations with calibration data, and emits `<model>_qnn.onnx` = ONNX wrapping a precompiled QNN HTP context binary; measured on a Xiaomi 17 (SM8850): YOLO26n-seg 17.4 ms NPU end to end [V, https://docs.ultralytics.com/integrations/qnn/]. The HTP architecture must match the phone (v81 for SM8850; Ultralytics' example uses `name="73"`, so set the SM8850 value) [S].
- Android runtime: `com.microsoft.onnxruntime:onnxruntime-android-qnn` latest **1.29.0** (Maven metadata updated 2026-08-12 [V]); Qualcomm also publishes `com.qualcomm.qti:onnxruntime-android-qnn:2.6.0` [S]. Session options: `ep.context_enable=1`, `ep.context_embed_mode=1`; set `session.disable_cpu_ep_fallback=1` so an op falling to CPU raises instead of silently running slow; no dynamic shapes, no Loop/If [V, https://onnxruntime.ai/docs/execution-providers/QNN-ExecutionProvider.html].
- Why fallback not primary: two runtimes in one app, a context binary pinned to one QAIRT version, and the research note's warning about silent CPU fallback.

### 3.3 Qualcomm AI Hub (profiling and a second compile path)

- Free with a Qualcomm ID; `pip install qai-hub` (0.56.0, 2026-09-28 [V]) then `qai-hub configure --api_token …`; `qai-hub-models` 0.63.0 (2026-09-23 [V]) carries the model recipes above. Device strings seen on model pages: "Snapdragon 8 Elite Gen 5 QRD" and "Snapdragon 8 Elite Gen 5 For Galaxy Mobile" [V]. Release notes: LiteRT 2.2.0 and QAIRT 2.50 as of 14 Sep 2026; Galaxy S26 family added, S25 being removed [V, https://workbench.aihub.qualcomm.com/docs/hub/release_notes.html]. No stated job quota on the pages opened; assume a few dozen jobs per day is fine [U].
- Use it for: `hub.submit_compile_job(model, device, options="--target_runtime tflite")` and `submit_profile_job` to get NPU latency and the per-op compute-unit breakdown (this is how we prove no CPU fallback before the event); `submit_quantize_job` for w8a16. Keep the job URLs as evidence for the deck.

### 3.4 MediaPipe / TFLite QNN delegate

- The old TFLite QNN delegate (`com.qualcomm.qti:qnn-litert-delegate`, 2.51.0 on Maven Central [V]) is the path Qualcomm's own LiteRT docs still show (`backend_type: htp`, `libQnnTFLiteDelegate.so`) [V, docs.qualcomm.com 80-70029-15B]. Google says the new accelerator replaces it [S]. Do not start here; it is the third fallback if CompiledModel NPU fails on the loaner.
- MediaPipe Tasks image segmenter is CPU/GPU only and adds nothing here.

---

## 4. Pre-training and data plan

### 4.1 Public data (check licences before training)

| Set | What | Licence | Use | Source |
|---|---|---|---|---|
| ROI-1555 (HF, tsrobcvai) | 1,555 real placed-rebar images, 1080×1920 to 1647×2160, boxes + pixel masks, straight and hoop (stirrup) classes, 586 MB; paper: Sun, Fan, Shao, *Advanced Engineering Informatics* 2025 | **none declared** on the page [V] | Pre-train only, with citation; email the authors for terms before any product use | https://huggingface.co/datasets/tsrobcvai/ROI-1555_Rebar_Detection_and_Instance_Segmentation_Dataset |
| whiesty synthetic | 2,500 synthetic mesh images 1280×720 with PNG masks + YAML; Baidu-only download, no licence [V] | none | Only if downloadable from India; low priority | https://github.com/whiesty/synthetic-datasets-for-rebar |
| Roboflow Universe sets (expo2 `rebar_new`, `rebar_new_layers`, roomsegment `rebar-seg` 701 imgs, rebartest RebarSegH/H2/HV 60-144 imgs, yowli rebar-panoptic) | Small instance-seg sets, mixed bundle-end and placed mesh | CC BY 4.0 shown in snippets [S]; Roboflow returned 403 to the fetcher, open in a browser | Add the placed-mesh ones; drop bundle-end sets | https://universe.roboflow.com/expo2/rebar_new-zsu8p ; https://universe.roboflow.com/roomsegment/rebar-seg |
| ConRebSeg | 14,805 RGB images, exposed-rebar / person / car / truck semantic labels (DTU) | check | Exposed rebar in demolition, not pre-pour; skip unless short of negatives | https://orbit.dtu.dk/en/publications/segmentation-dataset-for-reinforced-concrete-construction [S] |
| SORD (NTU) | 25,287 synthetic on-site rebar images from BIM, Autom. Constr. 2024 (10.1016/j.autcon.2024.105953); 3× AP gain over real-only | availability unknown | Email the authors; do not plan on it | [S] |
| RebarDSC / bundle-end sets | Bundle cross-sections | - | Not our task | - |

Target for 9 Oct: ROI-1555 + the CC-BY Roboflow placed-mesh sets + ~~our own 15-25 Bengaluru sites~~ (site set DROPPED 8 Oct; validation = tape-checked prop scans at the event) (workstream 7 protocol: 4K stills at 0.4/0.8/1.2 m with the card in frame, tape ground truth for every spacing in the zone, close-ups at 0.3 m for diameter). Our own images are the validation set; public data is training only. Label our images with the MobileSAM-/FastSAM-assisted polygon tool of choice (CVAT or Roboflow free tier), 150-300 images is enough for a semantic fine-tune [U].

### 4.2 Training recipe (single GPU, a few hours)

- Hardware: Kaggle free (P100 16 GB or 2×T4, ~30 GPU-h/week, 12 h sessions) or Colab free T4 (12 h cap, no guarantee); Colab Pro / a cloud L4 is ₹1-2k for the whole plan [S, hivenet/aimultiple]. Budget: ₹0-2,000.
- U-Net-lite: smp `Unet(encoder_name="timm-mobilenetv3_large_100", encoder_weights="imagenet", classes=1)`, input 1152×640, loss = Dice + BCE (+ optional clDice/topology term for connectivity), AdamW 3e-4, 40-60 epochs, batch 8 at fp16 → ~1.5-3 h on a T4 for ~3k images [U]. Export: `litert_torch.convert` (or `ai_edge_torch`) → .tflite → AOT for SM8850 → profile on AI Hub.
- DeepLabV3+ fallback: torchvision `deeplabv3_mobilenet_v3_large` re-headed, same loss, 513 or 1024 input; AI Hub recipe `qai_hub_models.models.deeplabv3_plus_mobilenet` gives the export script.
- YOLO26n-seg fallback: Ultralytics 8.4.174 (6 Oct 2026, AGPL [V]); `yolo segment train data=rebar.yaml model=yolo26n-seg.pt imgsz=1024 epochs=60 batch=8 overlap_mask=False mask_ratio=2 rect=True` → ~2-3 h on a T4 [U]. Predict with `retina_masks=True` [S].
- Augmentation for thin bars: random scale 0.5-1.5 (distance), ±15° rotation, perspective warp (±5 %), motion blur 3-9 px (physics.md blur table), brightness/contrast and colour-temperature jitter (torch and daylight), shadows (random polygon darkening), JPEG compression, copy-paste of bars on concrete/plywood backgrounds; **no horizontal/vertical flips without also flipping labels for the orientation classes**; mosaic off at the end (last 10 epochs) because it breaks the bar-length prior [U].
- Separate tiny classifiers: (a) diameter class, only if ≥200 close-ups per class exist (unlikely by 9 Oct; keep as an at-event stretch); (b) stirrup-vs-main: not a classifier, use orientation relative to the strip; a 3-class semantic head is the fallback.

### 4.3 Synthetic route (optional, 1 day)

- BlenderProc2 (GPL-3.0; COCO annotation writer; GPL only covers the generator, not the images) [V, https://github.com/DLR-RM/BlenderProc]. Procedural cage: parametrised beam (b×D, n main bars, stirrup pitch per zone, hook type) and slab mesh (pitch x/y, two layers, chairs), PBR steel with ribs, plywood/concrete/soil backgrounds, HDRI sun, a textured ChArUco card. 2,000 renders at 1152×640 ≈ 2-4 GPU-hours. Literature: BIM-rendered masks improved Mask R-CNN over real-only [S, MDPI Buildings 13(3):585]; synthetic point-cloud pipeline reached 92.1 mAP real [S, IAARC 147].
- Cheaper 2-D route (2 hours): draw bars as anti-aliased ribbed lines on real site background crops with perspective warps and shadows; good enough to pre-train the U-Net before real fine-tuning [U].

### 4.4 Image size decision

1152×640 for the model (see §2); 4K stills for the measurement with tile inference and full-res sub-pixel refinement. Rationale: at 1.0 m a 10 mm bar is 27 px in 4K, 8 px at 1152, 2 px in a YOLO prototype mask [U]. A full 1024-square input gives no benefit on a 16:9 sensor.

---

## 5. Geometry stack

### 5.1 OpenCV on Android

- Maven Central `org.opencv:opencv` latest **5.0.0** (metadata updated 2026-07-21 [V]); 4.13.0 released 22 Jan 2026 [S] and also on Maven Central; Android AARs have been on Maven Central since 4.9.0 [S, opencv.org]. **Pin 4.14.0** (settled 7 Oct; was 4.13.0) (the 5.0 Java API has renamed modules [S]; the team's and the LLM's muscle memory is 4.x). ArUco/ChArUco live in `org.opencv.objdetect` (`ArucoDetector`, `CharucoBoard`, `CharucoDetector.detectBoard`, `CharucoBoard.matchImagePoints`, then `Calib3d.solvePnP`) since 4.7 [S, javadoc 4.13.0 listings; the page itself returned 403 to the fetcher].

### 5.2 Card design (20 cm rigid)

- Board: **8×8 squares of 22 mm** (176 mm active, 12 mm quiet border, 200 mm total), markers 15 mm (0.68 of the square), dictionary **DICT_4X4_50** (largest Hamming distance per bit, best far-range decode [S, pyimagesearch]); 49 interior corners, 32 markers. Per-site ID: the board's marker ids are an offset block (site k uses ids 32k…32k+31 from DICT_4X4_1000), so a scan from another site's card fails to match, plus a printed human-readable site code [U].
- Pixel budget on the iQOO 15 main camera (f ≈ 2662 px at 4K, 71.6° HFOV) [U]: 22 mm square = 146 px at 0.4 m, 73 px at 0.8 m, 49 px at 1.2 m; a 4×4 marker bit is 9-27 px, comfortably decodable (rule of thumb ≥3-4 px per bit). The full card spans 1331 px at 0.4 m and 444 px at 1.2 m.
- Material: 3 mm aluminium-composite or acrylic with a matte laminate (no gloss: the torch will specular). Add four 10 mm drilled holes with binder-wire ties so the card sits flat on the top bars, and a 20 mm foam strip underneath so it rests on bar crowns, not in the gaps. Print at 600 dpi and measure the printed square pitch with a vernier: the board constructor takes the measured value.
- Strip for beams: 2 m vinyl banner, 60 mm wide, ArUco DICT_4X4_250 markers 40 mm with 20 mm gaps (33 markers; id = position index), rigid 300 mm backing segments hinged with tape so it lies on the stirrup tops along the beam. Detect with `ArucoDetector`, build a `Board` object with each marker's known x-offset, same homography maths. Expect ±1-2 mm along the strip from print and lay tolerance; it carries scale, the card carries the plane [U].

### 5.3 Calibration and capture discipline (the real accuracy levers)

- Per-phone intrinsics: 20-30 frames of the same card at the capture resolution and lens, `Calib3d.calibrateCamera` on matched ChArUco points, reprojection RMS target <0.3 px. **Intrinsics change with the capture mode (binning, crop, video vs still) and with focus distance**; calibrate in the exact mode used for measurement [U]. Do the calibration on the loaner in hour 1 (it is a measurement, not app code; a Python script with the frames also works).
- Lock the lens: Camera2 `CONTROL_AF_MODE_OFF` with a fixed `LENS_FOCUS_DISTANCE` per station distance (focus breathing shifts the effective focal length by ~1-3 % on phone modules [U]); turn OIS off if `LENS_OPTICAL_STABILIZATION_MODE_OFF` is exposed (OIS moves the principal point). If the iQOO exposes only one rear lens to third parties (research note B: unverified), the plan still holds on the main camera.
- Homography not PnP for the measurement: with the card plane as the measurement plane, `getPerspectiveTransform`/`findHomography` from the ChArUco corners (≥12 corners seen, RANSAC) maps image → card-plane mm. Use the full PnP pose only for the tilt check and the out-of-plane correction.
- Evidence on accuracy from phones/webcams: a 1080p webcam with 15 cm 6×6 markers gave angle RMSE 0.36° at 1.33 m with one marker and 0.07-0.16° with 5-7 markers; position error fell from tens of cm (single marker, 3 m) to ~3-4 cm with 7 markers [V, https://arxiv.org/html/2509.17345]. Marker-based pinhole measurement reached 2.3 mm deviation at up to 1.4 m [S, scitepress 2021]. ISARC 2024 (YOLOv8-pose crosspoints + RGB-D at 0.3 m, 124 images, 8 mm bars) reported 2.65 mm average spacing error and showed 8 mm bars fragmenting at longer distances [V, PDF text]. The 2026 single-oblique-photo paper reports 5.12 mm MAE [S, sciencedirect S1093968726012429; the page returned 403]. The MLIT guideline's image-vs-tape spacing guide is ±5 mm [V, research note]. No source gives a phone + ChArUco figure at 0.5 m: **measure our own on the demo cage (pre-event task P9)**.

### 5.4 Depth (Tier 2)

Depth Anything V2 small at 11.9-18 ms on the NPU [V] gives relative depth; after a per-frame scale/shift fit to the card corners it separates the top and bottom mesh layers and flags "bar not in card plane" for the error band. It never sets the scale.

---

## 6. Error-band method (the "error table" on the phone)

Per measured spacing **s** between two adjacent bar centrelines on the card plane, at camera distance **H** (from the card pose), combine six independent terms in quadrature and report ±2σ, floored by the field-calibrated residual:

| Term | Formula | Inputs | Typical at s = 150 mm, H = 0.8 m |
|---|---|---|---|
| Centreline localisation (random) | √2 · GSD · σ_px / √n | GSD = H / f_px (mm/px), σ_px ≈ 1 px of mask edge noise, n ≈ 20 samples along the bar | 0.10 mm |
| Mask edge bias (systematic, ribs/shadow) | √2 · GSD · b_px | b_px ≈ 0.5 px, estimated from the calibration cage | 0.21 mm |
| Card scale | s · (σ_c / L_px) · √(2 / m) | σ_c ≈ 0.2 px corner error, L_px = card span in px, m = corners used | 0.02 mm |
| Out-of-plane offset | s · σ_z / H | σ_z = uncertainty of the bar's height below the card plane (5 mm if the card sits on the bar crowns; 15 mm if it sags) | 0.94 mm (σ_z = 5) / 2.8 mm (σ_z = 15) |
| Pose tilt | s · δθ · (x_off / H) | δθ ≈ 0.3° card-plane tilt error, x_off = distance of the bar from the card centre (0.3 m) | 0.29 mm |
| Lens residual | s · ε_lens | ε_lens = 0.2 % calibrated, 1 % uncalibrated | 0.30 mm / 1.5 mm |
| **Total (2σ)** | 2 · √Σ | | **±2.1 mm** (good case); **±6.4 mm** (uncalibrated lens + sagging card) |

Computed values [U, scratchpad script]: good case at s = 150 mm gives ±4.0 mm at 0.4 m, ±2.7 at 0.6, ±2.1 at 0.8, ±1.8 at 1.0, ±1.6 at 1.2 (the out-of-plane term dominates and shrinks with H, while blur and pixel size grow; 0.6-1.0 m is the sweet spot for the 200 mm card; the half-scale demo with card S runs at 0.25-0.5 m and abstains beyond ~0.65 m). At s = 100 mm the good-case band is ±1.4 mm; at 200 mm ±2.8 mm. A bottom-layer bar 20 mm below the card plane, uncorrected, biases s by 3.75 mm at 0.8 m (so correct it from the known bar diameters, or report the layer as "needs tape").

Rules for the table:
1. Report band = max(2σ model, field floor). The **field floor** is the 95th percentile of |app − tape| from tape-checked scans of the half-scale props (P16; no site set exists) (physics.md expects 3-6 mm; the literature says 2.7-5 mm). Until measured, show ±5 mm.
2. **Abstain ("re-scan")** when: fewer than 12 ChArUco corners matched, card tilt > 25°, H > 1.3 m or < 0.2 m, median card marker side < 45 px (card S beyond ~0.65 m), sharpness (variance of Laplacian) below the station threshold, the two centrelines are not both ≥ 80 % continuous within the zone, or |s − limit| < band (the measurement cannot separate "within" from "outside").
3. Count has no band; it has a coverage statement: "n bars seen; the zone edges were/weren't in frame".
4. Store every term with the measurement in the signed record so the engineer can see why the band is what it is.

This is the method to defend to the jury: every term is a one-line formula with a measurable input, and the floor comes from tape.

---

## 7. Pre-event checklist (7-8 Oct; everything here is data, accounts, scripts and training, not app code)

| # | Task | Time | Output |
|---|---|---|---|
| P1 | Accounts: Qualcomm ID → AI Hub API token (`pip install qai-hub==0.56.0; qai-hub configure`); Kaggle (phone-verified for GPU); Hugging Face token; Roboflow free | 30 min | tokens in a password manager, not in the repo |
| P2 | Downloads: ROI-1555 (586 MB); Roboflow CC-BY placed-mesh sets (export COCO); OpenCV 4.14.0 Android AAR coordinates noted; Ultralytics 8.4.174; `ai-edge-litert==2.2.0 ai-edge-litert-sdk-qualcomm==2.2.0 litert-torch==0.9.4` in a venv (note the ~5 min SDK build) | 1 h | a `requirements-prep.txt` with pins |
| P3 | Prove the NPU path with a public model: AI Hub compile + profile `deeplabv3_plus_mobilenet` and `yolo26_seg` for "Snapdragon 8 Elite Gen 5 QRD" (TFLite float and w8a16), save job URLs and the per-op compute-unit table; LiteRT AOT-compile the same .tflite for SM8850 with the Colab notebook flow; keep `*_Qualcomm_SM8850.tflite` + `*_fallback.tflite` | 2 h | proof-of-path folder with job links (jury evidence) |
| P4 | Dataset prep script: COCO → binary masks (and 3-class orientation masks derived from mask principal axis), 1152×640 rect tiles, split by site, augmentation config | 2 h | `prep_data.py` |
| P5 | Train U-Net-lite (smp) on public data; log start/end timestamps and git hash | 2-3 h GPU (background) | `unet_mbv3_1152.pt`, metrics, log |
| P6 | Export U-Net to .tflite via litert-torch, AOT for SM8850, AI Hub profile; if latency > 25 ms or any op on CPU, switch primary to DeepLabV3+ | 1.5 h | the .tflite that will be dropped into assets at the event; decision recorded in STATE.md |
| P7 | Train the fallbacks in the background: DeepLabV3+-MobileNet 2-class; YOLO26n-seg at 1024 (AGPL noted) | 3 h GPU | weights + logs |
| P8 | Card and strip artwork: generate with `cv2.aruco.CharucoBoard((8,8),0.022,0.015,DICT_4X4_50).generateImage`, site-id offsets, 600 dpi PDF; print on 3 mm ACP/acrylic matte; vernier the pitch; 2 m strip on vinyl + rigid segments | 2 h + print shop | 3 cards, 2 strips, measured pitches |
| P9 | Bench accuracy test on the demo cage (workstream 7 BOM): 5 distances × 3 tilts × 3 lighting, tape ground truth; run the Python reference pipeline (ChArUco homography + skeleton + line fit) on the stills | 3 h | field-floor numbers for §6; the first error table |
| P10 | (DROPPED 8 Oct) Site photos: 15-25 pre-pour sites per workstream 7, with the card; label 150-300 frames (SAM-assisted) as the validation set | 2 days, parallel | validation set + the problem statistic |
| P11 | Python reference pipeline (allowed: not app code): calibration script, homography + skeleton + spacing, error-band calculator; this is the spec the Kotlin port follows at the event | 3 h | `ref_pipeline/` with unit tests on the cage images |
| P12 | Write the at-event prompts: model conversion commands, Gradle snippets (litert 2.3.0 + litert-npu-runtime-qualcomm 2.3.0; OpenCV 4.14.0; ORT-QNN 1.29.0 as backup), CompiledModel usage, Camera2 lock settings | 1 h | `notes/05-feasibility/event-prompts.md` |

Total: ~18 h of desk work plus GPU time in the background; fits 7-8 Oct with two people.

---

## 8. At-event hour-1 checklist (9 Oct)

1. Loaner probe (15 min): `adb shell getprop ro.soc.model` (expect SM8850), Camera2 characteristics dump (which rear lenses are exposed, 4K still/video modes, AF/OIS controls, `INFO_SUPPORTED_HARDWARE_LEVEL`), free storage, thermal state API presence.
2. (after 19:00, prompt P1) NPU smoke test (20 min): new project with `litert:2.3.0` + `litert-npu-runtime-qualcomm:2.3.0`, minSdk 31, arm64-v8a; load `deeplabv3_plus_mobilenet_Qualcomm_SM8850.tflite` from P3; log `CompiledModel.create` time and 50-run latency on NPU / GPU / CPU. Pass = NPU < 10 ms and the compile log shows QNN. If the Maven runtime artifact fails, switch to the zip + `qualcomm_runtime_v81` module flow; if that fails, ORT-QNN 1.29.0 with the P3 context ONNX; if that fails, LiteRT GPU and record the fact.
3. Drop in our model (10 min): the P6 .tflite; same latency log; visual check on one cage still.
4. Camera calibration on the loaner (15 min): 25 frames of card A at the measurement mode and locked focus, run the P11 calibration script on a laptop, store intrinsics JSON in assets with the capture-mode name.
5. First measurement (10 min): one cage still → Kotlin port of the homography + spacing path (ported from P11), compare to tape; the delta starts the event error table.
6. Start the timestamped fine-tune log: if the organisers disallow pre-event weights, kick off the U-Net training on the event laptop/Colab from ImageNet init on public sets + prop photos (≈1.5 h) and record start time, dataset hash and git hash; the app loads whichever .tflite is newest.
7. Thermal baseline (5 min): 5 minutes of continuous NPU inference with the torch on; log skin temperature and frame time; this sets the station-burst length.

---

## 9. Open risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| U-Net-lite has an op that falls to CPU on HTP (e.g. a resize mode) | medium | P6 profile catches it; swap bilinear for nearest + conv, or go to DeepLabV3+ |
| LiteRT 2.3.0 Maven NPU runtime does not match the docs' zip flow on this phone | medium | both flows prepared; ORT-QNN third |
| iQOO 15 exposes only the main camera and no AF/OIS lock to third-party apps | medium | main camera is the plan; without a focus lock, calibrate at the two station distances and interpolate; widen the lens term to 1 % |
| AI Hub "For Galaxy" numbers differ from the iQOO bin | high (but small) | re-profile on the loaner in hour 1 |
| ROI-1555 licence unstated | medium | pre-training only, cited; ask the authors; the product trains on its own data |
| AGPL (Ultralytics, FastSAM) in a closed product | certain if used | keep them as fallbacks; the primary stack is MIT/Apache |
| Thin bars fragment at > 1 m (ISARC saw it for 8 mm at 0.3 m with RGB-D) | medium | stations at 0.6-1.0 m (half-scale demo: 0.25-0.5 m); tile inference; continuity check triggers re-scan |
| Card plane vs bar plane offset is the biggest error term | certain | card rests on bar crowns with a spacer; known-diameter layer correction; report σ_z |
| Specular steel under the torch | medium | matte card; exposure lock; augmentation with highlights |
| Pre-trained weights disallowed on the day | low-medium | ImageNet-init U-Net trained live from public sets + prop photos, timestamped; classical ridge filter as the zero-weights path |
| Diameter classifier has no training data by 9 Oct | high | it stays Tier 2; the weigh test carries diameter |

---

## Sources opened or seen (untrusted data; re-open before quoting on a slide)

- https://developers.google.com/edge/litert/next/npu [V]
- https://developers.google.com/edge/litert/next/qualcomm [V]
- https://developers.googleblog.com/unlocking-peak-performance-on-qualcomm-npu-with-litert/ [V]
- https://github.com/google-ai-edge/litert-samples/blob/main/samples/litert/colab/LiteRT_AOT_Compilation_Tutorial.ipynb [V, raw]
- https://dl.google.com/dl/android/maven2/com/google/ai/edge/litert/group-index.xml and the 2.3.0 POMs [V]
- https://developers.google.com/edge/litert/releases/litert_aug [V]
- https://pypi.org/pypi/{ai-edge-litert,ai-edge-litert-sdk-qualcomm,litert-torch,qai-hub,qai-hub-models,onnxruntime-qnn}/json [V]
- https://docs.ultralytics.com/integrations/qnn/ [V]; https://pypi.org/project/ultralytics/ [V]
- https://onnxruntime.ai/docs/execution-providers/QNN-ExecutionProvider.html [V]; Maven metadata for onnxruntime-android-qnn [V]
- https://huggingface.co/qualcomm/{YOLO26-Segmentation,YOLOv11-Segmentation,DeepLabV3-Plus-MobileNet,Depth-Anything-V2,MobileSam,RTMDet} [V]; FastSam-S [S]
- https://workbench.aihub.qualcomm.com/docs/hub/release_notes.html [V]
- https://docs.qualcomm.com/bundle/publicresource/80-70029-15B/topics/run-a-litert-model-using-delegate.md [V]
- https://huggingface.co/datasets/tsrobcvai/ROI-1555_Rebar_Detection_and_Instance_Segmentation_Dataset [V]; https://github.com/whiesty/synthetic-datasets-for-rebar [V]
- Roboflow Universe rebar sets [S, 403 to the fetcher]; ConRebSeg [S]; SORD [S]
- https://repo1.maven.org/maven2/org/opencv/opencv/maven-metadata.xml [V]; OpenCV 4.13.0 release date [S]; OpenCV ChArUco tutorial/javadoc [S, 403]
- https://arxiv.org/html/2509.17345 [V]; https://www.iaarc.org/publications/fulltext/008_ISARC_2024_Paper_235.pdf [V, text extracted]; MDPI Buildings 13(3):585 [S]; IAARC 147 synthetic point cloud [S]; sciencedirect S1093968726012429 [S]
- https://github.com/DLR-RM/BlenderProc [V]
- https://rfdetr.roboflow.com/latest/learn/export/ [S]; Depth Anything V2 licences [S]
- Colab/Kaggle free GPU limits [S, hivenet.com, aimultiple.com]
