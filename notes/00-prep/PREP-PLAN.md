# Sariya: everything to prepare before Fri 9 Oct 17:00 (written 7 Oct 2026)

Synthesis of six research reports (all in this repo, each claim tagged V/S/U with URLs):
- `notes/00-prep/tracker-officekit.md` (HackTracker code, Office Kit, finale timetable, finalists' stacks)
- `notes/05-feasibility/vision-stack.md` (segmentation, NPU toolchain, pre-training, geometry, error bands)
- `notes/05-feasibility/speech-llm-ocr.md` (ASR, TTS, LLM, OCR, prompts)
- `notes/05-feasibility/device-devenv.md` (laptop versions, warm cache, loaner first hour)
- `notes/06-rulebook/rulebook.md` (IS 456 / IS 13920 / IS 1786 typed table, rules.json with 50 rules, Tier-1 verdict pseudocode, 11 engineer ambiguities)
- `notes/07-data-plan/data-and-props.md` + `make_fiducials.py` + `print/` + `sheets/` (sites, fiducials, props BOM)

Rule reminder: app code is written at the event. Everything below is data, models, prints, props, accounts, caches, reference scripts, prompts and rehearsal. The Python reference pipeline is a spec for the Kotlin port, not shipped code.

## 0. Five findings that change the plan

1. **HackTracker only credits "camera" by package name, and Office Kit only when an Office Kit screen is in front on the phone** (organiser's public code, May 2026, V). No mic or NPU signal exists in that code. So: application ID contains `camera` (e.g. `in.sariya.camera`), scan screen class named `ScanCameraActivity`, use **Remote PC (phone drives laptop)** in every Red block, keep all three phones active, never 10 tap-free minutes in Red, never toggle ADB on the loaner (logged as tamper), expect each APK install to be logged. The composite also rewards heat, battery drain and memory spikes, so continuous NPU/GPU work during Red helps. Organiser answers (§7) say the Finale build detects camera, mic and on-device AI for any app and that the device score is the average of the three phones.
2. **The finale timetable is published**: Fri 19:00 kickoff; Red 18.5 h, Green 15.5 h, three scored checkpoints Sat 10:00, Sat 19:00, Sun 09:00; final build to Sun 12:00; longest Green stretch Sun 01:00-06:30. Plan laptop-only work (model conversion, deck) into Green blocks.
3. **Vision decision: 2-class semantic segmentation (U-Net-lite, MobileNetV3 encoder, 1152x640) + classical centreline extraction**, not instance segmentation. Fallbacks: DeepLabV3+-MobileNet from AI Hub (proven 1.6-4.2 ms on this NPU), YOLO26n-seg (AGPL). Weights-free fallback: Frangi ridge filter. The U-Net's NPU latency is unmeasured until the AI Hub profile job runs (task V3).
4. **Speech: IndicConformer int8 CTC via sherpa-onnx (hi, kn, en); Piper for Hindi TTS; Kannada TTS needs a bespoke Indic-TTS FastPitch frontend (3 h) or the system voice; Gemma 4 E2B on GPU via LiteRT-LM** (still no SM8850 NPU build as of today). Number robustness comes from a parser plus read-back, not the decoder.
5. **ARCore does not support the iQOO 15** (India model I2501), so the card is the only scale source. OpenCV 4.14.0 is on Maven Central; LiteRT 2.3.0 and a Qualcomm NPU runtime artifact are on Google Maven/Maven Central (6 Oct 2026). Both NPU delivery routes (Maven artifact and the runtime zip) must be proven on a spare phone before Friday.

## 1. Priority order (if time runs out, do the top of the list)

| # | Item | Why it is first | Owner | Hours |
|---|---|---|---|---|
| 1 | Email organisers (§7) | Gates: pretrained weights, props on stage, Red Light remote-PC rule, tracker signals | A | 0.5 |
| 2 | Prove the NPU path end to end on a spare phone with a public model, then with our model | Highest technical risk; if it fails we need the fallback chosen before Friday | B | 4 |
| 3 | Print card_S, strip_300, F1/F2/F3/F12 fault cards and spec_A4 (photocopy shop, 100 % size) | Needed for site visits tomorrow and every bench test | A | 2 + shop |
| 4 | Site visits with tape (target 15-25; minimum 12) | The only evidence nobody else has; validation set; slide 1 statistic; replay scan | A + C | 2 days |
| 5 | Pre-train the segmentation model on public data; export .tflite; profile | Hour 1 at the event becomes "drop in and verify" | B | 6 (GPU in background) |
| 6 | Build the props (mesh board, beam cage, offcuts, scale) and run the bench accuracy test | Sets the error bands, the demo, and P(clean run) | C | 5 |
| 7 | Speech stack tested on a spare phone (ASR 20-wav regression set, Hindi TTS, Gemma extraction JSON validity) | Second-biggest integration risk | B/C | 4 |
| 8 | Laptop warm cache + throwaway skeleton proved offline on a spare phone | Venue Wi-Fi is the risk; the event project is created from the pinned toml | B | 3 |
| 9 | Reference pipeline in Python (calibration, homography, skeleton, spacing, error band) with unit tests on bench photos | The Kotlin port follows it line by line at the event | B | 3 |
| 10 | Event prompt pack: Gradle snippets, CompiledModel usage, Camera2 lock settings, LLM prompts and schemas, rulebook JSON, module layout | Minimises typing at the event; Claude Code/Codex builds from it | A | 2 |
| 11 | Rulebook reviewed with one structural engineer on record; spacing tolerance set | Jury question "who set the tolerance?" | A | 2 |
| 12 | Demo script v1 with failure branches; props rehearsal with the phone camera app | WS8 | C | 2 |
| 13 | Label 60-100 site frames (SAM-assisted) as the validation set | Error table and the fine-tune at the event | C | 4 |
| 14 | Kannada TTS frontend (Indic-TTS FastPitch + HiFi-GAN ONNX) | Only if 1-13 are done; else system voice + pre-rendered clips | B | 3 |
| 15 | Synthetic cage generator (BlenderProc) | Optional; only if a GPU is idle overnight | B | 2 + render |

## 2. Models: what to train, convert and carry (all on a USB stick under `sariya-models/` with a sha256 MANIFEST)

### 2.1 Vision (details in vision-stack.md §2-4, §7)
- **Accounts today:** Qualcomm ID + AI Hub token (`qai-hub==0.56.0`), Kaggle (GPU), Hugging Face, Roboflow.
- **Data:** ROI-1555 (1,555 real placed-rebar images with masks, no licence stated: pre-train only, email the authors); Roboflow CC-BY placed-mesh sets (open in a browser; the fetcher got 403); our own site frames as validation.
- **Train:** U-Net-lite (segmentation_models_pytorch, MobileNetV3-Large encoder, MIT) 2-class at 1152x640, 1.5-3 h on a T4/P100. Log timestamps and git hash. In the background: DeepLabV3+-MobileNet 2-class (fallback 1) and YOLO26n-seg at 1024 (fallback 2, AGPL).
- **Export and profile:** litert-torch 0.9.4 -> .tflite -> LiteRT AOT for SM8850 (`ai-edge-litert==2.2.0`, `ai-edge-litert-sdk-qualcomm==2.2.0`; no Qualcomm account needed) -> AI Hub profile job for "Snapdragon 8 Elite Gen 5" (per-op compute-unit table is jury evidence). Pass = NPU < 25 ms and no op on CPU; else switch primary to DeepLabV3+. Keep float first; w8a16 only if needed.
- **Carry:** `unet_Qualcomm_SM8850.tflite`, `unet_fallback.tflite`, `deeplabv3p_SM8850.tflite`, `yolo26n_seg.tflite` + QNN context ONNX (for the ORT-QNN 1.29.0 fallback), AI Hub job URLs, training logs.
- **At the event:** fine-tune on the site frames from ImageNet init or from the pre-trained weights (whichever the organisers allow), timestamped; the app loads the newest .tflite.
- **Tier 2 only:** Depth Anything V2 small (Apache, 12-18 ms NPU) for layer separation; a diameter classifier only if 200+ close-ups exist (they will not; the weigh test carries diameter).

### 2.2 Speech, LLM, OCR (details in speech-llm-ocr.md §1, §4)
- ASR: IndicConformer int8 CTC `hi`, `kn`, `en` (~200 MB each) for sherpa-onnx 1.13.8; fallback Indic-Whisper ggml small (181 MiB each) for whisper.cpp; Silero VAD.
- TTS Hindi: Piper `hi_IN-pratham-medium` via sherpa-onnx (check each MODEL_CARD licence). TTS Kannada: Indic-TTS FastPitch+HiFi-GAN int8 ONNX (MIT) with our own frontend, or Google TTS kn-IN offline voice (must be downloaded on the loaner; needs a hotspot), or pre-rendered clips with number slots (render on the laptop before Friday: ten fix sentences + number clips, hi and kn).
- LLM: `gemma-4-E2B-it-gpu.litertlm` (2.01 GB) on GPU via `litertlm-android`; fallback Qwen3-0.6B/1.7B GGUF Q4_0 via llama.cpp with a JSON-schema grammar (same GGUF runs on the Hexagon NPU through GenieX, which is the "upgrade" story for the jury). The LLM does spec extraction to JSON, fix wording, record Q&A, BBS clean-up; never measurement or verdict. Temperature 0, 128 tokens, validator rejects any numeral not in the input.
- OCR: ML Kit text recognition 16.0.1 bundled (Latin + Devanagari) for the BBS table; a classical 7-segment reader for the kitchen scale with ML Kit as second opinion.
- Test set to record before Friday: 20 utterances per language of the five-field sentence by two speakers in a noisy room, 16 kHz, with a CSV of ground truth. This is the hour-1 regression set.

### 2.3 Decisions still open on models
- Whether CTC exports emit digits or number words (test on the spare phone; the parser must handle both).
- Kannada ASR field accuracy in noise (if < 80% in hour 1, default the demo to Indian-English numbers, keep Kannada for the spoken fix).
- Gemma GPU init needs vendor `libOpenCL.so` (vivo normally ships it; verify in hour 1; CPU build is the fallback).

## 3. Laptop and device (details in device-devenv.md)

- **Pins:** Android Studio stable as of today (freeze updates), AGP 9.4.0, Gradle 9.6.0, JDK 17, Build Tools 36.0.0, NDK 28.2.13676358, Kotlin 2.4.20, Compose BOM 2026.09.00, CameraX 1.6.2 (1.7.0-alpha03 if the physical-camera API is needed), OpenCV `org.opencv:opencv:4.14.0`, LiteRT `com.google.ai.edge.litert:litert:2.3.0` + `litert-gpu` + the Qualcomm NPU runtime (`litert-npu-runtime-qualcomm:2.3.0` on Google Maven, and `com.qualcomm.qti:qnn-litert-delegate:2.51.0` on Maven Central; prove which one works), ORT `onnxruntime-android-qnn:1.29.0`, sherpa-onnx-android, litertlm-android, ML Kit 16.0.1. minSdk 29, compileSdk 36.
- **Warm cache:** build a throwaway skeleton once online with every dependency and both variants, then prove `./gradlew --offline assembleDebug installDebug` with Wi-Fi off. Keep `libs.versions.toml`, `settings.gradle.kts`, `gradle-wrapper.properties` in `event-template/` (config, not app code). Mirror on the Windows laptop if there is one. Also warm the emulator image, llama.cpp and sherpa-onnx NDK builds.
- **Throwaway skeleton proves:** CameraX ImageAnalysis + Camera2Interop manual exposure/focus/torch, ChArUco detect on one frame, LiteRT CompiledModel on NPU with GPU fallback and a log of which accelerator ran, StrongBox key with TEE fallback + BiometricPrompt, TTS/ASR language availability probe. Delete it before Friday.
- **Office Kit:** install the macOS (Apple silicon build exists) and Windows clients now; pair with any vivo/iQOO phone if one is reachable; rehearse Remote PC with a full-screen tmux terminal and Super Clipboard. Prepare prompt snippets as files so the phone only sends short commands.
- **Loaner first 60 minutes (Fri 17:00-18:00, before the 19:00 clock):** developer options (watch for the vivo "USB debugging (security settings)" and "Install via USB" toggles and any vivo-account demand; ask organisers at check-in), camera probe (hardware level, physical camera IDs, tele access, manual controls, 4K30), NPU smoke test with the public model then ours, StrongBox check, Hindi/Kannada voice packs on a hotspot, battery whitelisting, add the app to Game Space for bypass charging on stage. Note: enabling ADB is logged by HackTracker; decide with the organisers whether to use USB/wireless debugging at all or install by Office Kit file transfer + Files.
- **Thermals:** GSMArena saw CPU/GPU below 50% after 10 min of stress. Scans are bursts; NPU not GPU for the overlay; serialise ASR -> LLM -> TTS, never concurrent with the camera pipeline.

## 4. Data, fiducials, props (details in data-and-props.md; print PDFs already generated in `notes/07-data-plan/print/`)

- **Fiducials (done, print today):** 20 site cards 200x200 mm (6x6 ChArUco, 30 mm squares, 22 mm markers, DICT_5X5_1000, IDs 0-359), 2 m beam strip (IDs 400-439, marker centre = 25 + (id-400)*50 mm from the 0 end), A3 calibration board (IDs 500-543), A4 135/90 hook template (ID 600), 12-card A6 fault deck. One dictionary, one detector. Self-test: all markers detect at 0.4-1.5 m at 4K pixel scale. Print on 3 mm sunboard matte (~₹1,100 at a signage shop); measure each card's actual pitch with a tape and write it in the card's box.
- **Props: half-scale kit ≈ ₹1,200 + ₹100 printing** (data-and-props.md §3, 9 Oct): 28x28 cm slab, 5 x 5 mesh of 8 mm bars @ 50 both ways, all movable in foam strips; 30 cm beam top face (2 x 12 mm bars, 5 x 8 mm pieces @ 50/75); two 20 cm offcuts and a kitchen scale; card S (100 mm) and strip_300 printed at a photocopy shop. Everything under 30 cm.
- **Site protocol:** two people, 4-6 sites per half-day, leads from steel dealers, construction friends, Tiscon/JSW/UltraTech helplines, Brick&Bolt. Per site: shots at 0.4/0.6/1.0/1.5 m with the card, tape across the exact span, both mesh layers, beam end zones, hook close-ups, cover blocks, a 4K30 sweep; CSV sheets provided (tape ground truth, site metadata, error table, violation rules). "N of M" rules fixed before site 1; Wilson interval ready for Q&A; spacing tolerance +25 mm to be confirmed by the engineer.
- **Bench accuracy test** on the mesh board: 5 distances x 3 tilts x 3 lighting, tape ground truth, run the Python reference pipeline. This produces the first error table and the floor for the ± bands (computed good case ±2.1 mm at 150 mm spacing, 0.8 m; bad case ±6.4 mm with an uncalibrated lens and a sagging card; sweet spot 0.6-1.0 m).
- **Labelling:** Roboflow Smart Polygon or CVAT+SAM, 4-6 min per frame, 60-100 frames before the event (validation + live fine-tune set).
- **Synthetic:** optional; BlenderProc generator overnight if a GPU is idle, else a 2 h OpenCV homography generator. The whiesty set is README-only with no licence.

## 5. Rulebook (notes/06-rulebook/rulebook.md, done from the archive.org scans of the codes plus amendments)
- **Corrections to IDEA.md:** IS 13920:2016 Amendment 1 (2017) makes the hook extension **135° + 8d, not less than 75 mm** (the 2016 print said 6d/65); beam end-zone links are min(d/4, 6 x smallest bar, 100 mm) over 2d, first link within 50 mm, mid-span d/2; cl. 1.1.1 says IS 13920 is "optional in Seismic Zone II" (use that wording, not "advisory"). Bengaluru is Zone II, Z = 0.10 (Annex E verified).
- IS 456: slab main min(3d, 300), distribution min(5d, 300); stirrups min(0.75d, 300); cover Table 16 with +10/-0; Ld formula (Fe500/M20 = 57 phi); lap >= max(Ld, 30 phi); stirrup anchorage 90° + 8 phi / 135° + 6 phi.
- IS 1786 unit mass verified: 8/10/12/16 mm = 0.395/0.617/0.888/1.58 kg/m with non-overlapping tolerance bands, so a 0.2 m offcut (length measured) classifies unambiguously.
- **No spacing tolerance exists in IS 456.** Proposed defaults, all "engineer to confirm": mean spacing <= drawing + max(10 mm, 5 %); any single gap <= drawing + 25 mm; end-zone length -50 mm. On a typical G+1 house the drawing, not the code ceiling, is the binding limit on nearly every Tier-1 check, so this tolerance decision matters more than any clause. Put the 11 ambiguities in front of the structural engineer on Thursday morning.
- Column confinement after Amendment 1 is ambiguous (the amendment text replaced the clause with "6 x smallest bar" only); the app defaults to the stricter print set. Note that 230 mm columns fail the IS 13920 300 mm minimum, a good Zone II talking point.

## 6. Finale timetable and how to use it (V, organiser site bundle)

| Day | Window | Light | Use |
|---|---|---|---|
| Fri | 17:00-19:00 | pre-clock | Loaner first-60-minutes checklist; pair Office Kit; props through security |
| Fri | 19:00-21:00 | Green | Project from the template, model drop-in, NPU verify, camera calibration on the loaner |
| Fri | 21:00-00:00 | Red | Kotlin port of the geometry via Remote PC; phones scanning props |
| Sat | 00:00-03:00 | Green | Voice stack integration, Office Kit file transfer |
| Sat | 03:00-06:00 | Red | Rulebook + verdict UI; one sleeps |
| Sat | 06:00-08:00 | Green | Signing + record; fix whatever broke |
| Sat | 08:00-10:00 | Red | Polish for Eval 1; error table scans |
| Sat | 10:00-11:00 | Eval 1 | Full loop on the mesh (count + spacing + spoken fix) |
| Sat | 11:00-13:00 | Green | Beam strip and zones |
| Sat | 13:00-15:30 | Red | Zones UI; scans |
| Sat | 15:30-16:30 | Green (mentors) | Qualcomm mentor: NPU numbers screen |
| Sat | 16:30-19:00 | Red | Engineer review desk over Office Kit |
| Sat | 19:00-22:00 | Eval 2 | Full loop by hour 27 as promised ("by hour 30") |
| Sat | 22:00-01:00 | Red | Fine-tune log, error table, replay rejection |
| Sun | 01:00-06:30 | Green | Deck, numbers screen, fallbacks; split sleep |
| Sun | 06:30-09:00 | Red | Rehearse demo on the phone; failure branches |
| Sun | 09:00-12:00 | Eval 3 / final build | Freeze, submit repo and assets |
| Sun | post-lunch | Pitch | Mirror over Office Kit; results 18:00 |

Red hours: one person on Remote PC from a phone editing/building on the laptop, one scanning props continuously (camera, mic, NPU), one phone in Office Kit's file browser or running the error-table replay. Never touch the laptop keyboard in Red (a Pune team lost marks on the spot).

## 7. Organiser answers (received 7 Oct, from the user; supersede the May-code assumptions in §0.1)
1. HackTracker at the Finale detects camera, voice and on-device AI for any app, not only by package name. Keep the `camera` package name anyway (free), but the real lever is long in-app camera, microphone and NPU sessions in our own package (on-device ASR in-process, never the Google speech intent).
2. Office Kit: Remote PC (phone drives laptop) counts and is allowed in Red; driving a coding agent on the laptop through it is allowed. The team will use the T3 Chat app for assistance; keep Claude Code/Codex on the laptop via Remote PC as the main path.
3. Sideloading and USB/wireless debugging are allowed.
4. **Device score = team average across the three phones' usage.** A phone idle in a bag drags the team down. Every phone needs a continuous role (scan / Remote PC / error-table replay or Gemma), and they rotate through charging rather than all charging at once.
5. Pre-trained and pre-fine-tuned weights, and labelled photos collected this week, are all allowed. So: do the full fine-tune on site data before Friday, bake the first error table, and carry the final .tflite. Keep a timestamped training log and the live re-fine-tune at the event as an optional second run.
6. Eval blocks are not phone-only; both devices are usable during evals.
7. Steel props on stage: allowed.
8. Loaners have Install via USB enabled and need no vivo account. Still open: the Office Kit laptop client normally wants the same vivo account on both sides; bring the laptops to Fri 17:00 check-in and pair there, and ask whether off-network file transfer works without an account (same Wi-Fi is the fallback).

Still unanswered: the Sunday submission cut-off time; whether the jury list goes up before Friday; how HackTracker behaves if a phone is in airplane mode (it may buffer heartbeats, or it may lose them). Until answered, use airplane mode only during the pitch itself and keep Wi-Fi on while building.

## 7b. Team facts (7 Oct)
- No iQOO 15 in hand. The team has other new Snapdragon flagships plus a spare Android phone. Use the Snapdragon phones for every pre-event test; the NPU path is testable on any SoC in LiteRT's Qualcomm support list (8 Gen 3 / 8 Elite / 8 Elite Gen 5 and others). Note the SoC of each test phone (`adb shell getprop ro.soc.model`). AOT-compiled .tflite files are per-SoC: compile one for the test phone's SoC and one for SM8850, and also keep the plain .tflite for on-device JIT compile. Latency numbers from the test phone are not the loaner's; the AI Hub profile job for 8 Elite Gen 5 is the number to quote until Friday. Camera2 hardware level, tele access and OriginOS behaviour are iQOO-specific and stay on the Friday 17:00 checklist.
- Laptops: MacBooks plus one Windows machine. Warm the Gradle cache on each (caches are not portable across OSes); the Windows machine is the Office Kit backup if the macOS client misbehaves.
- The team has already built T3 Chat as an APK, transferred it by Office Kit and run agents from the loaner. That proves the sideload-by-file-transfer path; keep it as the install route and log each install.

## 8. Two-day schedule for three people (A: logistics + sites + prompts; B: ML + toolchain; C: props + sites + speech tests)

**Tue 7 Oct**
- A: email organisers; leads for sites (dealers, friends, helplines, Brick&Bolt); print run at a signage shop (pickup 16:00); buy BOM steel and hardware; sites 1-5 from 13:30; evening: CSVs, engineer booking for Thu morning.
- B: accounts; downloads (datasets, model files, SDKs); AI Hub compile+profile of public DeepLabV3+ and YOLO26-seg for 8 Elite Gen 5; LiteRT AOT of the same; skeleton app with NPU smoke test on the spare phone; start U-Net training on Kaggle overnight.
- C: sites 1-5 with A (camera + tape); evening: build the mesh board and beam cage, weigh offcuts; download speech models; record the 20-utterance test set.

**Wed 8 Oct**
- A: sites 6-18 (early tying, a pour, a brand engineer's route if one agrees); evening: "N of M" statistic into EVIDENCE.md, slide-1 photo, event prompt pack, STATE.md.
- B: export U-Net, AOT, profile; decide primary vs DeepLabV3+; fallbacks trained; Python reference pipeline with unit tests on bench photos; Gradle offline proof; Office Kit paired and Remote PC rehearsed; LiteRT-LM Gemma extraction test and llama.cpp Qwen fallback on the spare phone.
- C: sites with A in the morning; afternoon bench accuracy test on the mesh board (5 distances x 3 tilts x 3 lights); sherpa-onnx ASR regression on the spare phone; Piper Hindi + system Kannada TTS test; pre-render fallback clips; label 60-100 frames; pack the kit bag; demo script v1.

**Thu 9 Oct (morning buffer):** structural engineer review of rulebook and tolerance (on record); a tenth site if under 12; charge everything; USB stick MANIFEST verified; arrive 17:00 with props.

## 9. What stays out (do not spend time on it before Friday)
Diameter classifier training, hook-angle model, depth model integration, synthetic data beyond a 2 h generator, Kannada TTS frontend unless items 1-13 in §1 are done, deck polish (Sun 01:00-06:30 Green block), the mason passport, any app code.
