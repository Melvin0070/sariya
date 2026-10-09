# Event prompt pack: Sariya app build, Fri 9 Oct 19:00 to Sun 11 Oct 12:00 (written 7 Oct 2026)

Everything here is config, schemas, signatures-as-text and prompts for Claude Code / Codex. No app source. The fresh-code rule (IDEA.md v3, guide: "code written during the event window") applies to everything the prompts produce.

Inputs this pack assumes exist on the USB stick (`sariya-models/`, sha256 `MANIFEST.txt`; PREP-PLAN §2):
- `seg/unet_Qualcomm_SM8850.tflite`, `seg/unet_fallback.tflite`, `seg/deeplabv3p_SM8850.tflite`, `seg/yolo26n_seg.tflite` (vision-stack §2, §3.1)
- `asr/{hi,kn,en}/model.int8.onnx` + `tokens.txt`, `vad/silero_vad.onnx` (speech-llm-ocr §4)
- `tts/hi/vits-piper-hi_IN-pratham-medium/` (speech-llm-ocr §3.2); `tts/kn/fastpitch-kn.int8.onnx`, `hifigan-kn.int8.onnx`, `tokens.json` (optional, only if the frontend was finished on 8 Oct)
- `llm/gemma-4-E2B-it-gpu.litertlm` (2.01 GB), `llm/gemma-4-E2B-it.litertlm` (CPU, 2.59 GB) (speech-llm-ocr §3.3)
- `calib/intrinsics_<mode>.json` (made in hour 1, vision-stack §8.4), `rules/rules.json` (rulebook §B), `fiducials/` PDFs (data-and-props, `make_fiducials.py`)
- `prep/ref_pipeline/` Python with unit tests on bench photos (PREP-PLAN §1 item 9): the Kotlin port follows it line by line
- `event-template/` with `libs.versions.toml`, `settings.gradle.kts`, `gradle-wrapper.properties` (device-devenv §1.3 step 4)

Fiducial facts the code must match (`notes/07-data-plan/make_fiducials.py`, which supersedes vision-stack §5.2's 8x8 / DICT_4X4 draft): **one dictionary, DICT_5X5_1000**. Site cards: 6x6 ChArUco, 30 mm squares, 22 mm markers, 180 mm board, card k uses ids 18k..18k+17 (k = 0..19). Beam strip: ids 400-439, 40 mm markers, 50 mm pitch, marker centre at `25 + (id - 400) * 50` mm from the strip's 0 end (laid at the column face); use the full strip `Board` geometry from `prep/ref_pipeline/fiducials.py`. Calibration board: 11x8, ids 500-543. **Demo props are half scale (9 Oct, data-and-props.md §3):** card S = 6x6 ChArUco, 15 mm squares, 11 mm markers, 90 mm pattern, ids 360-377 (registry entry `{card: 20}`); strip_300 = ids 450-461, 20 mm markers, 25 mm pitch, 30 mm wide, marker centre at `12.5 + (id - 450) * 25` mm from the 0 end. Abstain on pixel size, not metres: re-scan when the card's markers are under ~45 px (card S beyond ~0.65 m). Demo spec: slab 8 @ 50 both ways (single-gap limit 65), beam rings @ 50 for 150 mm, 75 mid. Hook template: id 600, 30 mm. Each printed card's measured pattern width (6 squares, nominal 180 mm) is written in its box; square pitch = width / 6, typed into `fiducials/cards.json` at hour 1.

---

## 1. Module and package layout

One Gradle module (`:app`), `applicationId = "in.sariya.camera"` (tracker-officekit §6 item 6: the May HackTracker counts camera opens by package name containing "camera"). One module because 48 h does not pay for inter-module API boundaries; the packages below are the boundaries, enforced by convention: a package may import only from the packages listed under "depends on".

Root package `in.sariya.camera`. Shared value types live in `in.sariya.camera.model` (not a listed package, but every package may import it): `Spec`, `Measurement`, `ZoneResult`, `Finding`, `ScanRecord`, `Verdict`.

```text
in.sariya.camera
  model/        shared data classes (kotlinx.serialization)
  capture/      CameraX + Camera2Interop, frame selection, gyro, torch
  fiducial/     ChArUco card / ArUco strip detection, intrinsics, homography
  segment/      LiteRT CompiledModel (NPU -> GPU -> CPU), mask output, latency log
  geometry/     mask -> centrelines -> count, spacing, zones, error band
  rules/        rules.json loader, verdict engine, abstention, fix action
  voice/        AudioRecord, sherpa-onnx ASR + VAD, number parser, TTS (Piper hi, system kn), read-back
  llm/          LiteRT-LM Gemma 4 E2B: spec extraction, fix wording, record Q&A; validators; template fallback
  record/       canonical JSON, Keystore EC key, BiometricPrompt, signing, QR, perceptual hash, replay check
  officekit/    export/import folder conventions, bar-schedule import, review pack, countersign
  numbers/      per-frame latency ring buffer, battery/thermal sampler, scan counters, NPU/GPU/CPU bench
  ui/           Compose screens; ScanCameraActivity (class name contains "Camera"), ReviewActivity, NumbersActivity
```

**model.** Plain `@Serializable` data classes, no logic. `Spec(memberId, memberType: MemberType, barDiaMm: Int?, barCount: Int?, barSpacingMm: Int?, stirrupDiaMm: Int?, stirrupSpacingEndMm: Int?, stirrupSpacingMidMm: Int?, endZoneMm: Int?, source: SpecSource, rawTranscript: String?)`. `Measurement(value: Double, u: Double, coverageOk: Boolean, nSamples: Int, terms: Map<String, Double>)` (the six error-band terms from vision-stack §6 go in `terms`). `Verdict { WITHIN, OUTSIDE, RESCAN, NEEDS_TAPE, NOT_SEEN }` (rulebook §B). `Finding(ruleId, member, zone, check, measuredMm, bandMm, requiredMm, requiredSource, zoneLengthMm, action: FixAction?, severity, verdict)`. `ScanRecord(recordId, siteCardIds: List<Int>, capturedAt, spec, zones: List<ZoneResult>, findings: List<Finding>, images: List<ImageRef>, phash: List<String>, deviceInfo, modelInfo, captureSignature: Signature?, approvalSignature: Signature?)`.

**capture.** Owns the camera for the lifetime of `ScanCameraActivity`: `Preview` + `ImageAnalysis` (YUV_420_888, `STRATEGY_KEEP_ONLY_LATEST`, target 1920x1080 for the overlay) + `ImageCapture` (4K JPEG, the measurement still). Camera2Interop: AE lock after a 1 s settle, `CONTROL_AF_MODE_OFF` + `LENS_FOCUS_DISTANCE` per station (0.6 m / 0.9 m), OIS off if exposed, torch via `CameraControl.enableTorch(true)` (device-devenv §1.4; vision-stack §5.3). Gyro gate: `SensorManager` TYPE_GYROSCOPE at fastest rate, a frame is "still" when |omega| < 0.15 rad/s for the 80 ms before the frame timestamp; sharpness = variance of Laplacian on the centre 512x512 of the Y plane. Interface: `interface FrameSource { val frames: Flow<AnalysisFrame> }`, `data class AnalysisFrame(val y: ByteBuffer, val width: Int, val height: Int, val rotationDeg: Int, val timestampNs: Long, val sharpness: Double, val gyroStill: Boolean, val exposureNs: Long?, val iso: Int?)`, `suspend fun captureStill(): StillFrame` (`StillFrame(jpegBytes, width, height, exif, timestampNs, focusDistance, exposureNs)`), `fun setStation(station: Station)` (`Station(focusDistanceDiopters: Float, torch: Boolean)`). Depends on: model.

**fiducial.** `class CardDetector(intrinsics: Intrinsics, cards: CardRegistry)`; `fun detect(gray: Mat): CardPose?` where `CardPose(cardId: Int, siteCardIndex: Int, cornersImg: List<PointF>, cornersBoard: List<PointF>, nCorners: Int, homographyImgToMm: Mat, tiltDeg: Double, distanceM: Double, reprojRms: Double)`. `class StripDetector(intrinsics)`; `fun detect(gray: Mat): StripPose?` with `StripPose(markers: List<StripMarker>, axisDirImg: PointF, homographyImgToMm: Mat, nMarkers: Int)` where `positionMm = (id - 400) * 50`. `fun Intrinsics.load(assets, modeName): Intrinsics` from `calib/intrinsics_<mode>.json` (fx, fy, cx, cy, dist[5], width, height, modeName). Everything in OpenCV `org.opencv.objdetect.CharucoDetector` / `ArucoDetector`, `Calib3d.findHomography` with RANSAC on >= 12 corners (abstain below that, vision-stack §6 rule 2). Depends on: model.

**segment.** `class BarSegmenter(context, modelAsset: String, prefer: List<Accelerator>)`; `fun run(frame: AnalysisFrame or Bitmap 1152x640): MaskResult` where `MaskResult(mask: ByteArray /* 0/255, 1152x640 */, inferMs: Double, preMs: Double, postMs: Double, accelerator: AcceleratorUsed /* NPU, GPU, CPU */)`. `fun runTiled(still: Bitmap 4K): MaskResult` (2x2 tiles, vision-stack §2 input-size note). `val latencyLog: Flow<LatencySample>` consumed by `numbers`. Creation order: `CompiledModel.Options(Accelerator.NPU, Accelerator.GPU)` then GPU-only then CPU; the one that succeeded is recorded and shown in the UI chip (vision-stack §3.1, §8.2). Depends on: model, capture (frame types).

**geometry.** The Kotlin port of `prep/ref_pipeline`. `fun extractCentrelines(mask, homography, axisHint: PointF?): List<Centreline>` (skeletonise, prune < 40 px, Hough/RANSAC straight segments, cluster into two orientation families, fit each bar as a line in card-plane mm, sub-pixel refine on the full-res still via a 1-D intensity profile across the mask). `fun countAndSpacing(lines: List<Centreline>, family: Family, zoneMm: RectF): ZoneResult` where `ZoneResult(family, count: Measurement, spacingMean: Measurement, spacingMax: Measurement, gapsMm: List<Double>, coverage: Coverage, positionsMm: List<Double>)`. `fun beamZones(stirrupPositionsMm: List<Double>, endZoneMm: Double, beamLengthMm: Double): BeamZones(left: ZoneResult, mid: ZoneResult, right: ZoneResult, firstLinkOffsetMm: Measurement, closeZoneLengthMm: Pair<Measurement, Measurement>)`. `fun errorBand(spacingMm, distanceM, fPx, nSamples, nCorners, cardSpanPx, sigmaZmm, tiltErrDeg, xOffM, lensEps): BandTerms` (the six-term quadrature table in vision-stack §6; `band = max(2 sigma, fieldFloor)`, floor 5 mm until measured). Depends on: model, fiducial (poses).

**rules.** `class Rulebook(json: String)` loads `rules.json` (rulebook §B, version 0.1.0); `fun evaluateSlabPatch(patch: ZoneResult x2, spec: Spec, ctx: Context): List<Finding>`; `fun evaluateBeam(zones: BeamZones, spec, ctx): List<Finding>`; `fun compare(meas: Measurement, op: Op, limit: Double, tol: Double): Verdict` exactly as the pseudocode in rulebook §D (abstain when |value - L| < u). `fun fixAction(finding): FixAction?` (`extra_links = ceil(L_end / s_spec) - count_in_zone`). `fun memberSummary(findings): String` ("3 within limits, 1 outside, 0 advisory, 1 re-scan, 1 needs a tape reading, 0 not seen"; never "PASS"). `Context(zone: String, apply13920: Boolean, params: Map<String, Double>, tol: Tolerances)`. Depends on: model, geometry (types only).

**voice.** `class Asr(context, lang: Lang)` wrapping sherpa-onnx `OfflineRecognizer` (NeMo CTC) and `Vad` (Silero): `suspend fun listen(maxMs: Int = 12_000): Utterance(text: String, lang, pcm16: ShortArray, rtf: Double)` on push-to-talk hold, endpoint on release or 1.2 s silence (speech-llm-ocr §7). `object NumberParser { fun parse(text: String, lang: Lang): ParsedSpec(fields: Map<Field, Candidate>, unsure: Set<Field>) }` (hi/kn/en/Hinglish number words, keyword attachment, snap-to-valid-set; speech-llm-ocr §5). `class Tts(context)`: `suspend fun speak(text: String, lang: Lang): TtsResult(engine: "piper"|"system"|"clip", ms)`; Hindi via sherpa-onnx `OfflineTts` Piper, Kannada via Android `TextToSpeech` kn-IN offline voice, pre-rendered clip fallback. `fun readBack(spec: Spec, lang): String`. `class Commands { fun match(text, lang): Command? }` closed set: ok / no / again / `<field> <value>`. Audio: `AudioRecord` `VOICE_RECOGNITION`, 16 kHz mono, `NoiseSuppressor` + `AutomaticGainControl` if available (speech-llm-ocr §3.5). Depends on: model.

**llm.** `class Llm(context, modelPath: String, backend: Backend)` wrapping LiteRT-LM `Engine`; `suspend fun extractSpec(transcript: String, parserCandidates: ParsedSpec, lang): Result<SpecJson>`; `suspend fun wordFix(finding: Finding, lang): Result<FixText(say, subtitle, numbersUsed)>`; `suspend fun askRecord(question, recordJson): String`. `object Validators { fun specJson(raw: String): SpecJson? ; fun fixText(raw: String, finding: Finding): FixText? }` implement the schemas and the "no numeral not in the input" gate (speech-llm-ocr §6). `object Templates { fun fix(finding, lang): FixText }` is the no-LLM path and must produce identical structure. Temperature 0, max 128 tokens, first-JSON-object regex gate. Depends on: model, voice (ParsedSpec).

**record.** `object Canonical { fun json(record: ScanRecord): ByteArray }` (RFC 8785-style: sorted keys, no whitespace, UTF-8, numbers as shortest round-trip). `class Signer(alias: String)`: `fun ensureKey(): KeyInfo(strongBox: Boolean, attestationChain: List<ByteArray>?)` (EC P-256, `setIsStrongBoxBacked(true)` in try/catch `StrongBoxUnavailableException`, `setUserAuthenticationRequired(true)` for the approval key only); `suspend fun sign(bytes, biometric: Boolean, activity): Signature(alg = "ES256", sigDer: ByteArray, keyId: String, signedAt)`. `object Qr { fun encode(record, sig): String; fun verify(payload): VerifyResult }` (payload = recordId, sha256(canonical), keyId, sig, 2-key flags; verifies offline with the public key pinned in the record). `object PHash { fun dct64(bitmap): String; fun hamming(a, b): Int }`. `class ReplayGuard(db)`: `fun check(record): ReplayVerdict(ok: Boolean, reason: String?)` rejects a card id not registered to this site, a phash within Hamming 6 of any stored scan from a different record, a `capturedAt` older than the previous accepted record for the same member. Storage: Room or a JSON directory under `filesDir/records/`. Depends on: model.

**officekit.** No SDK exists (tracker-officekit §2); this package is file conventions. `object Paths { val export = "Documents/Sariya/export"; val import = "Documents/Sariya/import"; val review = "Documents/Sariya/review" }` under `MediaStore` (visible in the phone's Files app and therefore in Office Kit's file browser). `fun exportPack(record): File` writes `<recordId>.sariya.zip` (canonical JSON, signature, 4K still, overlay PNG, error-band terms, `README.txt`). `fun importBarSchedule(): List<Spec>` reads `*.bbs.json` or `*.csv` from `import/` (laptop -> phone). `fun exportReviewRequest(record, note): File` and `fun importCountersign(): List<ApprovalSignature>` (engineer's phone -> laptop -> operator phone). Depends on: model, record.

**numbers.** `object Telemetry`: `fun latency(sample: LatencySample(stage: "seg"|"fiducial"|"geometry"|"asr"|"llm"|"tts", ms, accelerator))`, ring buffer 10,000; `fun scanCounted(kind)`; `fun snapshot(): Numbers(perStageP50P95: Map, perAcceleratorMs: Map, framesInferred: Long, scans: Int, batteryPctStart, batteryPctNow, thermalHeadroom: Float, thermalStatus: Int, skinTempC: Float?, sessionMinutes)`. `suspend fun bench(model, nRuns = 50): BenchRow(accelerator, createMs, p50Ms, p95Ms)` for NPU, GPU, CPU in turn (vision-stack §8.2). Persisted to `filesDir/numbers.json` every minute so the pitch reads from stored data. Depends on: model, segment.

**ui.** Compose. Activities: `ScanCameraActivity` (scan screen; class name contains "Camera"; it is the launcher activity so the app's foreground time is camera time), `SpecActivity` (voice/form spec entry), `ReviewActivity` (findings, countersign, QR), `NumbersActivity` (NPU/GPU/CPU table, battery, thermal, error table). Prefer `Button`/`IconButton` with `Modifier.semantics { role = Role.Button }` so taps emit `TYPE_VIEW_CLICKED` (tracker-officekit §6 item 11). Depends on: everything.

### Build order mapped to the finale timetable (PREP-PLAN §6)

| Window | Light | Prompts | Package(s) | Checkpoint gate |
|---|---|---|---|---|
| Fri 17:00-19:00 | pre-clock | hour-1 checklist (§4) | - | NPU smoke test passes on the loaner (vision-stack §8.2) |
| Fri 19:00-21:00 | Green | P1, P2 | skeleton, segment (smoke), capture | `in.sariya.camera` installed; accelerator line in logcat says NPU; preview at 30 fps |
| Fri 21:00-00:00 | Red (Remote PC) | P3, P4 | fiducial, segment (full) | card detected at 0.4-1.2 m; mask overlay live on NPU |
| Sat 00:00-03:00 | Green | P5, P6 | geometry, rules | mesh count + spacing within tape ± band; verdict with abstention |
| Sat 03:00-06:00 | Red | P7, P8 | voice, llm | spoken spec -> five chips -> read-back; Gemma JSON validity >= 90 % on the 20-wav set |
| Sat 06:00-08:00 | Green | P9, P10 | voice (TTS), record | Hindi fix spoken with subtitles; signed record + QR |
| Sat 08:00-10:00 | Red | P17 (crash guards), polish | ui | no crash in 20 consecutive scans of the mesh |
| **Sat 10:00-11:00** | **Eval 1** | - | - | **Full loop on the mesh: count + spacing + spoken fix + signed record** |
| Sat 11:00-13:00 | Green | P11 | geometry (beam), fiducial (strip) | strip detected; stirrup positions along the beam |
| Sat 13:00-15:30 | Red | P11 UI, scans | ui, rules (beam) | zones verdict on the 60 cm beam |
| Sat 15:30-16:30 | Green (mentors) | P15 | numbers | NPU/GPU/CPU table shown to the Qualcomm mentor |
| Sat 16:30-19:00 | Red | P12, P13 | record (countersign), officekit | engineer countersign over Office Kit; export/import round trip |
| **Sat 19:00-22:00** | **Eval 2** | - | - | **Full loop incl. beam zones and two-key sign-off** |
| Sat 22:00-01:00 | Red | P14, P16 | record (replay), ui (error table) | yesterday's pack rejected; error table from stored scans |
| Sun 01:00-06:30 | Green | P18, deck, fallbacks | all | tap-to-mark fallback works with the model disabled |
| Sun 06:30-09:00 | Red | rehearsal only | - | demo script run three times on the phone |
| **Sun 09:00-12:00** | **Eval 3 / freeze** | - | - | release build signed; repo and assets submitted |

---

## 2. Gradle snippets

Version sources: device-devenv §1.1 (AGP, Gradle, Kotlin, Compose BOM, CameraX, OpenCV 4.14.0, LiteRT 2.3.0, qnn-litert-delegate 2.51.0, SDK levels), vision-stack §3.1-3.2 (`litert-npu-runtime-qualcomm:2.3.0`, ORT-QNN 1.29.0), speech-llm-ocr §1 and §3 (sherpa-onnx 1.13.8, litertlm-android, ML Kit 16.0.1, onnxruntime-android). Where a note says "latest.release", the warm-cache build on 8 Oct resolves the number; write the resolved number into the toml before Friday so `--offline` hits.

Two conflicts to settle at the warm-cache build, not at the event:
- OpenCV: device-devenv §1.1 says 4.14.0 (last 4.x), vision-stack §5.1 says 4.13.0. Use **4.14.0** (this brief); the objdetect ArUco API is the same in both.
- minSdk: this brief says 29; vision-stack §3.1 says the LiteRT NPU path requires minSdk 31. Keep **29** in the toml and add `tools:overrideLibrary` only if the manifest merger complains; the loaner is API 36 so nothing below 31 ever runs.

### 2.1 `gradle/libs.versions.toml`

```toml
[versions]
agp = "9.4.0"                       # device-devenv §1.1
kotlin = "2.4.20"                   # device-devenv §1.1
ksp = "2.4.20-1.0.30"               # match Kotlin; confirm at warm-cache build
composeBom = "2026.09.00"           # device-devenv §1.1
activityCompose = "1.12.0"          # confirm at warm-cache build
camerax = "1.6.2"                   # device-devenv §1.1
opencv = "4.14.0"                   # device-devenv §1.1 (Maven Central org.opencv:opencv)
litert = "2.3.0"                    # device-devenv §1.1, vision-stack §3.1
litertNpuQualcomm = "2.3.0"         # vision-stack §3.1 (Google Maven)
qnnLitertDelegate = "2.51.0"        # device-devenv §1.1 (third fallback only)
ortQnn = "1.29.0"                   # vision-stack §3.2 (second fallback)
ort = "1.23.0"                      # speech-llm-ocr §1 (Indic-TTS kn only); confirm number at warm-cache build
sherpaOnnx = "1.13.8"               # speech-llm-ocr §3.1
litertlm = "0.18.0"                 # speech-llm-ocr §3.3 says latest.release; pin the resolved number on 8 Oct
mlkitText = "16.0.1"                # speech-llm-ocr §3.4
biometric = "1.2.0"                 # confirm at warm-cache build
room = "2.8.0"                      # confirm at warm-cache build
serialization = "1.9.0"             # confirm at warm-cache build
coroutines = "1.10.2"               # confirm at warm-cache build
zxing = "3.5.3"                     # QR encode/decode; zero transitive deps
junit = "4.13.2"

[libraries]
compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
compose-ui = { group = "androidx.compose.ui", name = "ui" }
compose-material3 = { group = "androidx.compose.material3", name = "material3" }
compose-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
camerax-core = { group = "androidx.camera", name = "camera-core", version.ref = "camerax" }
camerax-camera2 = { group = "androidx.camera", name = "camera-camera2", version.ref = "camerax" }
camerax-lifecycle = { group = "androidx.camera", name = "camera-lifecycle", version.ref = "camerax" }
camerax-view = { group = "androidx.camera", name = "camera-view", version.ref = "camerax" }
opencv = { group = "org.opencv", name = "opencv", version.ref = "opencv" }
litert = { group = "com.google.ai.edge.litert", name = "litert", version.ref = "litert" }
litert-gpu = { group = "com.google.ai.edge.litert", name = "litert-gpu", version.ref = "litert" }
litert-npu-qualcomm = { group = "com.google.ai.edge.litert", name = "litert-npu-runtime-qualcomm", version.ref = "litertNpuQualcomm" }
qnn-litert-delegate = { group = "com.qualcomm.qti", name = "qnn-litert-delegate", version.ref = "qnnLitertDelegate" }
ort-qnn = { group = "com.microsoft.onnxruntime", name = "onnxruntime-android-qnn", version.ref = "ortQnn" }
ort = { group = "com.microsoft.onnxruntime", name = "onnxruntime-android", version.ref = "ort" }
sherpa-onnx = { group = "com.k2fsa.sherpa.onnx", name = "sherpa-onnx-android", version.ref = "sherpaOnnx" }
litertlm = { group = "com.google.ai.edge.litertlm", name = "litertlm-android", version.ref = "litertlm" }
mlkit-text-latin = { group = "com.google.mlkit", name = "text-recognition", version.ref = "mlkitText" }
mlkit-text-devanagari = { group = "com.google.mlkit", name = "text-recognition-devanagari", version.ref = "mlkitText" }
biometric = { group = "androidx.biometric", name = "biometric", version.ref = "biometric" }
room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }
kotlinx-serialization-json = { group = "org.jetbrains.kotlinx", name = "kotlinx-serialization-json", version.ref = "serialization" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }
zxing-core = { group = "com.google.zxing", name = "core", version.ref = "zxing" }
junit = { group = "junit", name = "junit", version.ref = "junit" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

Not in the toml on purpose: ORT-QNN and `qnn-litert-delegate` are declared but only wired in if P2's smoke test falls through to them (two runtimes in one APK is a size and a `.so` collision risk, vision-stack §3.2). ML Kit Devanagari only if the BBS photo has Hindi headers.

### 2.2 `settings.gradle.kts`

```kotlin
pluginManagement {
    repositories { google(); mavenCentral(); gradlePluginPortal() }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories { google(); mavenCentral() }
}
rootProject.name = "sariya"
include(":app")
```

`gradle/wrapper/gradle-wrapper.properties`: `distributionUrl=https\://services.gradle.org/distributions/gradle-9.6.0-bin.zip` (device-devenv §1.1). `gradle.properties`: `org.gradle.jvmargs=-Xmx6g`, `org.gradle.caching=true`, `org.gradle.configuration-cache=true`, `android.useAndroidX=true` (device-devenv §1.3 step 2). Build at the venue with `./gradlew --offline assembleDebug`.

### 2.3 `app/build.gradle.kts`

```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)
    alias(libs.plugins.ksp)
}

android {
    namespace = "in.sariya.camera"
    compileSdk = 36                                   // device-devenv §1.1

    defaultConfig {
        applicationId = "in.sariya.camera"            // tracker-officekit §6 item 6
        minSdk = 29
        targetSdk = 36
        versionCode = 1
        versionName = "0.1-finale"
        ndk { abiFilters += listOf("arm64-v8a") }     // vision-stack §3.1: NPU path is arm64 only
    }

    signingConfigs {
        create("finale") {                            // throwaway keystore made on 8 Oct, kept outside the repo
            storeFile = file(System.getenv("SARIYA_KEYSTORE") ?: "../keys/finale.jks")
            storePassword = System.getenv("SARIYA_KS_PASS") ?: ""
            keyAlias = "sariya"
            keyPassword = System.getenv("SARIYA_KS_PASS") ?: ""
        }
    }

    buildTypes {
        debug { isMinifyEnabled = false }
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("finale")
        }
    }

    buildFeatures { compose = true }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlin { jvmToolchain(17) }

    packaging {
        jniLibs {
            useLegacyPackaging = true                 // extract .so to disk: QNN/HTP libs are dlopen'ed by path
            // Two OpenCV-like duplicates can appear via ORT + sherpa; keep the first.
            pickFirsts += listOf(
                "lib/arm64-v8a/libc++_shared.so",
                "lib/arm64-v8a/libonnxruntime.so"
            )
            keepDebugSymbols += listOf("lib/arm64-v8a/libQnn*.so", "lib/arm64-v8a/libLiteRt*.so")
        }
        resources {
            excludes += listOf("META-INF/LICENSE*", "META-INF/NOTICE*", "META-INF/*.kotlin_module", "META-INF/versions/9/OSGI-INF/**")
        }
    }

    androidResources {
        // Keep models uncompressed so CompiledModel and sherpa can mmap them from assets.
        noCompress += listOf("tflite", "onnx", "litertlm", "json", "txt", "bin")
    }

    // If the Maven NPU runtime fails and the JIT zip flow is used instead (vision-stack §3.1):
    // sourceSets["main"].jniLibs.srcDirs("src/main/jniLibs")  and copy the zip's arm64-v8a/*.so there.
}

dependencies {
    implementation(platform(libs.compose.bom))
    implementation(libs.compose.ui)
    implementation(libs.compose.material3)
    implementation(libs.compose.tooling.preview)
    implementation(libs.activity.compose)

    implementation(libs.camerax.core)
    implementation(libs.camerax.camera2)
    implementation(libs.camerax.lifecycle)
    implementation(libs.camerax.view)

    implementation(libs.opencv)

    implementation(libs.litert)
    implementation(libs.litert.gpu)
    implementation(libs.litert.npu.qualcomm)
    // implementation(libs.ort.qnn)             // second fallback only (vision-stack §3.2)
    // implementation(libs.qnn.litert.delegate) // third fallback only (vision-stack §3.4)

    implementation(libs.sherpa.onnx)
    implementation(libs.litertlm)
    implementation(libs.mlkit.text.latin)
    // implementation(libs.mlkit.text.devanagari)
    // implementation(libs.ort)                 // only if the Kannada Indic-TTS frontend shipped

    implementation(libs.biometric)
    implementation(libs.room.runtime)
    implementation(libs.room.ktx)
    ksp(libs.room.compiler)
    implementation(libs.kotlinx.serialization.json)
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.zxing.core)

    testImplementation(libs.junit)
}
```

Models larger than ~100 MB (ASR 198 MB each, Gemma 2.01 GB) do not go in assets: the APK would exceed what Office Kit file transfer and the installer tolerate comfortably. They are pushed once to `filesDir/models/` (`adb push` or Office Kit file transfer + an in-app "import models from Downloads" button that moves the folder). The segmentation `.tflite` (< 20 MB) and `rules.json` do go in assets.

### 2.4 `app/proguard-rules.pro` (release build only)

```text
# OpenCV: JNI entry points and the loader
-keep class org.opencv.** { *; }
-keepclassmembers class org.opencv.** { native <methods>; }

# LiteRT (CompiledModel, accelerators, NPU runtime loader) and LiteRT-LM
-keep class com.google.ai.edge.litert.** { *; }
-keep class com.google.ai.edge.litertlm.** { *; }
-keepclassmembers class com.google.ai.edge.** { native <methods>; }
-dontwarn com.google.ai.edge.**

# Qualcomm QNN delegate / runtime (if wired in)
-keep class com.qualcomm.qti.** { *; }
-dontwarn com.qualcomm.qti.**

# ONNX Runtime (if wired in)
-keep class ai.onnxruntime.** { *; }
-dontwarn ai.onnxruntime.**

# sherpa-onnx: JNI classes are looked up by name from C++
-keep class com.k2fsa.sherpa.onnx.** { *; }
-keepclassmembers class com.k2fsa.sherpa.onnx.** { *; }

# ML Kit
-keep class com.google.mlkit.** { *; }
-dontwarn com.google.mlkit.**

# kotlinx.serialization: keep serializers and @Serializable classes in model/
-keepattributes *Annotation*, InnerClasses
-keep,includedescriptorclasses class in.sariya.camera.model.**$$serializer { *; }
-keepclassmembers class in.sariya.camera.model.** { *** Companion; }
-keepclasseswithmembers class in.sariya.camera.model.** { kotlinx.serialization.KSerializer serializer(...); }

# Room
-keep class * extends androidx.room.RoomDatabase

# Keep the Activity names: HackTracker may match on class names containing "Camera"
-keepnames class in.sariya.camera.ui.ScanCameraActivity
-keepnames class in.sariya.camera.ui.*Activity
```

### 2.5 `AndroidManifest.xml` essentials (text, not a file)

Permissions: `CAMERA`, `RECORD_AUDIO`, `USE_BIOMETRIC`, `HIGH_SAMPLING_RATE_SENSORS` (gyro at full rate), `FOREGROUND_SERVICE` + `FOREGROUND_SERVICE_CAMERA` only if a scan must survive screen-off (prefer keeping the screen on with `FLAG_KEEP_SCREEN_ON`). `uses-feature android:name="android.hardware.camera.any"`, `android.hardware.strongbox_keystore` with `required="false"`. `android:largeHeap="true"` (Gemma on GPU plus a 4K still). Launcher activity: `.ui.ScanCameraActivity`, `android:screenOrientation="portrait"`, `android:configChanges="orientation|screenSize"`. `uses-native-library android:name="libOpenCL.so" android:required="false"` (LiteRT-LM GPU backend needs the vendor OpenCL, speech-llm-ocr §3.3). No `INTERNET`.

---

## 3. Claude Code prompts, in build order

How to use: paste one prompt per Claude Code session (or Codex task) from the phone over Remote PC. Each prompt is self-contained. The agent is told to read `CLAUDE.md` in the event repo, which carries the module layout from §1 and these three standing rules: (1) every stage logs `stage, ms, accelerator` through `numbers.Telemetry`; (2) no network calls, no `INTERNET` permission; (3) the words "PASS", "safe", "certify", "permit" never appear in UI strings (rulebook §G, IDEA.md §10).

HackTracker-friendly behaviours (tracker-officekit §6; PREP-PLAN §0.1, §7.1): every prompt below states which of these it must preserve:
- **H1 long camera sessions:** `ScanCameraActivity` is the launcher, keeps the camera bound and the preview running while the user is on the scan screen, including during voice and verdict; no "snap a photo and leave".
- **H2 in-process mic:** `AudioRecord` inside our package; never the `RecognizerIntent` or system speech UI.
- **H3 NPU on every preview frame:** the segmenter runs on each analysis frame that passes the gyro gate (at least 10-15 fps), not only on the still.
- **H4 Activity names contain "Camera":** `ScanCameraActivity`, and the package stays `in.sariya.camera` across all builds (an update, never a new package).

---

### P1. Project skeleton and NPU smoke test with accelerator logging (Fri 19:00)

Build: a single-module Compose app from `event-template/` (`libs.versions.toml`, `settings.gradle.kts`, wrapper) with `applicationId in.sariya.camera`, `minSdk 29`, `compileSdk 36`, `abiFilters arm64-v8a`, the packaging and R8 rules in §2. Packages: create the empty package directories from §1 plus `model/` with `Verdict`, `Measurement`, `Spec`, `Finding`, `ScanRecord` as `@Serializable` data classes exactly as described in §1. Launcher activity `ui/ScanCameraActivity` showing a placeholder and a "Run NPU smoke test" button.

Smoke test in `segment/BarSegmenter`: load `assets/models/seg_sm8850.tflite` (copied from `seg/unet_Qualcomm_SM8850.tflite`; also try `seg_fallback.tflite`) with `CompiledModel.create(context.assets, name, CompiledModel.Options(Accelerator.NPU, Accelerator.GPU))`, set `CompilerCacheDir` to `cacheDir/litert`. Run 50 inferences on a zero tensor and a bench image; record create-ms, p50, p95. Then do the same with `Options(Accelerator.GPU)` and `Options(Accelerator.CPU)`. Decide `AcceleratorUsed` from: the options that succeeded, plus a logcat scan is not possible in-process, so additionally classify by latency (NPU if p50 < 10 ms with the NPU option; otherwise label "NPU option accepted, latency suggests GPU/CPU partition" and show it as a warning, vision-stack §3.1 "verifying").

Files: `app/build.gradle.kts`, `gradle/libs.versions.toml`, `settings.gradle.kts`, `proguard-rules.pro`, `AndroidManifest.xml`, `model/*.kt`, `segment/BarSegmenter.kt`, `segment/AcceleratorUsed.kt`, `numbers/Telemetry.kt` (ring buffer and `snapshot()` only), `ui/ScanCameraActivity.kt`, `CLAUDE.md`.

Acceptance: `./gradlew --offline assembleDebug` succeeds; APK installs on the loaner via Office Kit file transfer + Files; the smoke screen shows three rows (NPU, GPU, CPU) with create-ms/p50/p95; the NPU row is < 10 ms for DeepLabV3+ or < 25 ms for the U-Net (vision-stack §7 P6 threshold). If the NPU row fails to create: try the JIT zip `.so`s in `jniLibs`; then ORT-QNN; then GPU and record the fact.

Log: `Telemetry.bench` rows to `filesDir/numbers.json` with timestamp, model file name, SoC (`Build.SOC_MODEL`), and the exception message if a backend failed. Write the three numbers into STATE.md by hand.

HackTracker: H4 (names), H1 (the smoke screen is inside `ScanCameraActivity`).

---

### P2. CameraX analysis pipeline with Camera2Interop lock, torch, gyro-gated sharp frames (Fri 19:45)

Build: `capture/CameraSession` bound to `ScanCameraActivity` lifecycle: `Preview` into a `PreviewView`, `ImageAnalysis` YUV_420_888 at 1920x1080 `KEEP_ONLY_LATEST` with `setOutputImageRotationEnabled(false)`, `ImageCapture` at the largest 16:9 JPEG (4K) with `CAPTURE_MODE_MAXIMIZE_QUALITY`. `Camera2Interop.Extender` on the analysis and capture builders: `CONTROL_AE_MODE` on with `CONTROL_AE_LOCK` set after 1 s, `CONTROL_AF_MODE_OFF`, `LENS_FOCUS_DISTANCE` from `Station` (1/0.6 m and 1/0.9 m diopters), `LENS_OPTICAL_STABILIZATION_MODE_OFF` if in the available modes, `CONTROL_VIDEO_STABILIZATION_MODE_OFF`. Read back `SENSOR_EXPOSURE_TIME`, `SENSOR_SENSITIVITY`, `LENS_FOCUS_DISTANCE` from each `CaptureResult` via `Camera2CameraInfo`/`setSessionCaptureCallback` and attach them to `AnalysisFrame`. Torch via `CameraControl.enableTorch(true)` on station start. Gyro gate: `TYPE_GYROSCOPE` at `SENSOR_DELAY_FASTEST`, ring buffer of (timestamp, |omega|); `gyroStill = max |omega| over [t-80 ms, t] < 0.15 rad/s`. Sharpness: variance of Laplacian on the centre 512x512 of the Y plane via OpenCV (`OpenCVLoader.initLocal()` once in `Application.onCreate`). Expose `frames: Flow<AnalysisFrame>` and `suspend fun captureStill(): StillFrame`. A probe function logs `INFO_SUPPORTED_HARDWARE_LEVEL`, `REQUEST_AVAILABLE_CAPABILITIES`, physical camera ids, focal lengths, and `getSupportedFrameRateRanges` (device-devenv §2 steps 5-8).

Files: `capture/CameraSession.kt`, `capture/AnalysisFrame.kt`, `capture/GyroGate.kt`, `capture/Sharpness.kt`, `capture/CameraProbe.kt`, `SariyaApp.kt` (Application), `ui/ScanCameraActivity.kt` (PreviewView + an HUD showing fps, sharpness, gyroStill, exposure, focus distance, accelerator chip).

Acceptance: 30 fps preview for 10 minutes without a drop in the HUD; moving the phone turns `gyroStill` false within 100 ms; the HUD exposure stays constant after lock while a hand passes over the lens; `captureStill()` returns a 4K JPEG in < 700 ms; the probe log is saved to `filesDir/probe.json`.

Log: per-frame `sharpness`, `gyroStill`, `exposureNs` sampled every 30th frame to Telemetry; the probe JSON.

HackTracker: H1 (camera stays bound while the screen is on; `FLAG_KEEP_SCREEN_ON`), H4.

---

### P3. ChArUco card and ArUco strip detection, intrinsics, homography (Fri 21:00, Red)

Build: `fiducial/` mirroring `prep/ref_pipeline/fiducial.py` function by function (read it first; same names, same order of operations). Dictionary `DICT_5X5_1000`. `CardRegistry` loads `assets/fiducials/cards.json` (`[{card: 0, ids: [0..17], squareMm: 30.0 measured, markerMm: 22.0}, ...]`). `CardDetector.detect(gray)`: `ArucoDetector.detectMarkers` once per frame; group detected ids by card; for the card with most markers build `CharucoBoard((6,6), squareMm, markerMm, dict, ids)` and `CharucoDetector.detectBoard`; if `nCorners >= 12`, `findHomography(imgCorners, boardMm, RANSAC, 2.0 px)`; `solvePnP` on the same points with the intrinsics for `tiltDeg` and `distanceM`; reprojection RMS from the homography. `StripDetector.detect(gray)`: markers with ids 400-439; `boardMm = ((id-400)*50, 0)` for the marker centre and the four corners offset ±20 mm; homography from >= 4 markers; `axisDirImg` from the line fit through marker centres. `Intrinsics.load` reads `assets/calib/intrinsics_<modeName>.json` where modeName is the capture mode string the loaner probe produced (e.g. `main_4k_still_f0.6`); undistort points before the homography (`Calib3d.undistortPoints`). Overlay: draw detected corners and the card outline on the HUD.

Files: `fiducial/CardDetector.kt`, `fiducial/StripDetector.kt`, `fiducial/Intrinsics.kt`, `fiducial/CardRegistry.kt`, `fiducial/Poses.kt`, `ui/overlay/FiducialOverlay.kt`, test `fiducial/CardDetectorTest.kt` using the bench stills in `src/test/resources/bench/` with the expected corner counts from `ref_pipeline`'s test fixtures.

Acceptance: card detected with >= 20 corners at 0.4, 0.8 and 1.2 m on the loaner (make_fiducials.py self-test expects 25 corners at 4K); `tiltDeg` within 2° of a protractor at 0°, 15°, 30°; the homography maps the card's opposite corners to 180 ± 0.5 mm; the strip gives `positionMm` for every visible marker and the fit line residual < 1.5 mm; unit test passes on the bench stills with the same corner ids as the Python.

Log: `fiducial` stage ms, nCorners, tiltDeg, distanceM, reprojRms per frame to Telemetry.

HackTracker: H3 is not yet in play (the segmenter joins in P4); H1 holds.

---

### P4. LiteRT segmentation on every preview frame, GPU fallback, per-frame latency log (Fri 22:30, Red)

Build: extend `segment/BarSegmenter` from P1 into the live path. Pre-processing: Y-plane (or RGB if the model was trained RGB; check `seg/README.txt`) letterboxed to 1152x640 float32 NHWC normalised as the training script did; post-processing: argmax or sigmoid > 0.5 to a 0/255 `ByteArray`; all in Kotlin with pre-allocated buffers (no per-frame allocation). `runTiled(still)` for the 4K still: 2x2 tiles each resized to 1152x640 then stitched back to still resolution with nearest upsampling. Scheduling: a single-thread `Dispatchers` executor; drop frames while busy; run only frames with `gyroStill && sharpness > threshold` for the overlay, but keep a 5 fps "heartbeat" inference regardless so the NPU is never idle while the scan screen is up. Fallback chain at startup: NPU+GPU options -> GPU -> CPU, each in try/catch, the winner shown as a chip ("NPU 4.1 ms"). Mask overlay on the HUD at 30 % alpha.

Files: `segment/BarSegmenter.kt`, `segment/PrePost.kt`, `segment/Scheduler.kt`, `ui/overlay/MaskOverlay.kt`.

Acceptance: overlay follows the mesh board at >= 10 fps on the NPU; p50 inference < 25 ms, pre+post < 8 ms; no allocation churn (`Debug.getNativeHeapAllocatedSize` stable over 5 min); pulling the model file name to a non-existent asset produces a clean "model missing" chip, not a crash; the thermal headroom (`PowerManager.getThermalHeadroom(10)`) after 10 minutes of continuous overlay is logged.

Log: every inference: `seg, preMs, inferMs, postMs, accelerator, inputW, inputH` to Telemetry (this is the data for the numbers screen and the HackTracker exhibit).

HackTracker: H3 (every gated frame plus a 5 fps floor), H1.

---

### P5. Centreline extraction, count, spacing, zones (Sat 00:00, Green)

Build: `geometry/` as the line-by-line port of `prep/ref_pipeline/geometry.py`. Steps: mask -> morphological open 3x3 -> Zhang-Suen thinning (`Ximgproc.thinning` if the OpenCV contrib module is present in the AAR, else implement Zhang-Suen on the ByteArray) -> prune branches < 40 px -> probabilistic Hough (`Imgproc.HoughLinesP`) or RANSAC line segments -> cluster segments into two orientation families by angle (k = 2 on the doubled angle) -> for each family, merge collinear segments into bars (gap < 25 px, lateral < 6 px) -> transform the bar endpoints to card-plane mm through the homography -> order bars along the family normal -> `gapsMm` between adjacent bar centrelines -> `count`, `spacingMean`, `spacingMax` with `Measurement.u` from `errorBand`. Sub-pixel refinement: for each bar, sample 20 cross-profiles on the full-resolution still, fit a parabola to the intensity minimum (or maximum, steel is brighter under torch), re-fit the line. Coverage: a bar counts only if >= 80 % of its length inside the zone rectangle is covered by mask; `coverageOk` if the zone's four edges are inside the frame and the card plane. `beamZones`: project stirrup family (the family perpendicular to the strip axis) to the strip coordinate, giving `positionsMm`; split at `endZoneMm` from each beam end; `firstLinkOffsetMm` = first position from the end; `closeZoneLengthMm` = position of the last link whose preceding gap is within the end spacing + tolerance.

`errorBand` implements the six-term table in vision-stack §6 with inputs: `GSD = H / f_px`, `sigma_px 1.0`, `n` samples, `b_px 0.5`, `sigma_c 0.2`, `L_px` card span, `m` corners, `sigma_z` 5 mm (card on crowns) or 15 mm (user toggles "card sagging"), `delta_theta 0.3°`, `x_off`, `eps_lens 0.002` calibrated / 0.01 if `intrinsics.modeName == "uncalibrated"`. `band = max(2 * sqrt(sum sq), fieldFloorMm)`; `fieldFloorMm` read from `assets/calib/field_floor.json` (default 5.0 until the bench test writes it).

Files: `geometry/Skeleton.kt`, `geometry/Lines.kt`, `geometry/Families.kt`, `geometry/Spacing.kt`, `geometry/BeamZones.kt`, `geometry/ErrorBand.kt`, `geometry/Coverage.kt`, tests `geometry/*Test.kt` with the `ref_pipeline` fixture masks and expected gaps (tolerance 0.5 mm against the Python output).

Acceptance: on the mesh board at 0.8 m, count matches the tape count on 10 of 10 scans; `spacingMean` within the band of the tape mean on 9 of 10; the band shows ±2-3 mm on the bench good case and widens when "card sagging" is toggled; a bar partly out of frame is excluded and `coverageOk` becomes false; unit tests match the Python to 0.5 mm.

Log: `geometry` stage ms, nBars per family, gaps, band terms per scan to Telemetry and into the `ScanRecord` (`Measurement.terms`).

HackTracker: H1 (the scan screen stays on the camera while geometry runs on a worker).

---

### P6. Error band, rulebook verdict, abstention (Sat 01:30, Green)

Build: `rules/Rulebook` loading `assets/rules/rules.json` (rulebook §B, `rulebook_version 0.1.0`); a tiny expression evaluator for `limit` and `tol` strings over `inputs` and `params_default` (support `min`, `max`, `*`, `/`, `+`, `-`, parentheses, `if ... else`, identifier lookup; nothing else). `compare()` exactly per rulebook §D pseudocode including the count branch. `evaluateSlabPatch` and `evaluateBeam` as in §D, with `apply13920 = zone in {III,IV,V} || drawingInvokes13920 || engineerToggle`, severity "A" in Zone II. `memberSummary` string. `fixAction` for `DWG-SPACING-MEAN` outside on a beam end: `extra = ceil(L_end / s_spec) - countInZone`; for slab count short: `add_bars = n_spec - n_meas`; for spacing on a slab: `respace`. Verdict screen in `ui/VerdictSheet`: one row per finding with the rule id, clause, measured ± band, limit, verdict chip; `RESCAN` rows show "re-scan: within my error" and a button that reopens the station with the closer focus distance; `NEEDS_TAPE` rows show the tape-entry field (voice or keypad). Zone lookup from `zones_annexE` by city name typed once per site; default Bengaluru -> II.

Files: `rules/Rulebook.kt`, `rules/Expr.kt`, `rules/Compare.kt`, `rules/Evaluate.kt`, `rules/FixAction.kt`, `ui/VerdictSheet.kt`, tests `rules/CompareTest.kt` (the worked numbers in rulebook §D: 230x450 beam -> IS 456 ceiling 300, IS 13920 end 96 with 16 mm bars, 72 with 12 mm; mid 204; slab 125 mm 8@150 -> 300/300/335) and `rules/ExprTest.kt`.

Acceptance: the fault-deck card "F3 END ZONE" (2nd ring moved into mid-span, end-zone gap ~200 mm) yields `DWG-SPACING-MEAN[left] OUTSIDE` with action add 1 on the 60 cm beam when the spec is 100/150/300; the 5 x 5 mesh (spec 8 @ 100 both ways) reports both orientation families separately, the lower family with the known-diameter layer correction and a wider band; fault F12 (a lower bar moved 50 mm) yields `DWG-SPACING-LOCAL[lower] OUTSIDE`; the mesh with one top gap opened to ~150 mm yields `DWG-SPACING-LOCAL OUTSIDE` and `DWG-SPACING-MEAN` either `WITHIN` or `RESCAN` depending on the band; a scan at 1.3 m yields `RESCAN` on every spacing rule; no string in `rules/` or `ui/VerdictSheet` contains "PASS", "safe", "fail", "certify".

Log: findings list to the `ScanRecord`; `rules` stage ms (should be < 5 ms).

HackTracker: H1 (verdict sheet is a bottom sheet over the live preview, the camera stays bound).

---

### P7. Spec entry with voice: sherpa-onnx IndicConformer, push-to-talk, Silero VAD, parser, read-back (Sat 03:00, Red)

Build: `voice/AudioInput` (`AudioRecord`, `VOICE_RECOGNITION`, 16 kHz mono PCM16, 20 ms buffers, `NoiseSuppressor`/`AutomaticGainControl` attached if `isAvailable()`, log `getEnabled()`). `voice/Asr`: sherpa-onnx `OfflineRecognizer` built with `OfflineRecognizerConfig(modelConfig = OfflineModelConfig(nemo = OfflineNemoEncDecCtcModelConfig(model = "<filesDir>/models/asr/<lang>/model.int8.onnx"), tokens = ".../tokens.txt", numThreads = 4, provider = "cpu"))`, one recognizer per language created lazily and kept; `Vad` with `SileroVadModelConfig(model = ".../vad/silero_vad.onnx", threshold = 0.5, minSilenceDuration = 1.2f, minSpeechDuration = 0.25f)`. Push-to-talk: `listen()` starts on press, ends on release or 1.2 s of VAD silence, hard cap 12 s; returns `Utterance`. `voice/NumberParser`: tokenise; number-word tables for hi (एक..सौ, हज़ार, डेढ़ सौ = 150, ढाई सौ = 250), kn (ಒಂದು..ನೂರು, ಸಾವಿರ), en and Hinglish Latin ("barah", "ek sau pachas", "one fifty", "hundred and fifty"); compound rules (tens + units, "सौ" multiplier, "and"); keyword attachment (dia/डाया/ವ್ಯಾಸ, spacing/गैप/स्पेसिंग/ಅಂತರ, stirrup/रिंग/ಸ್ಟಿರಪ್, end/एंड/छोर, mid/बीच, zone/ज़ोन); default order dia, spacing, stirrup dia, stirrup end, stirrup mid, end-zone; snap sets per speech-llm-ocr §5 (dia {6,8,10,12,16,20,25,32}, stirrup dia {6,8,10}, spacing 50-400 step 5, end-zone 300-1500 step 50); any snap > 1 step or two candidates -> `unsure`. `ui/SpecScreen`: mic button (hold), level meter, VAD state, transcript in native script with parsed numbers highlighted, five chips (green/amber/red per speech-llm-ocr §7), tap a chip -> number pad, "Read back" plays `readBack(spec)` text through `Tts` (P9; until then show the text), commands ok / no / again / `<field> <value>`. Confirmed spec stored with `source = VOICE`, raw transcript, parser output.

Files: `voice/AudioInput.kt`, `voice/Asr.kt`, `voice/Vad.kt`, `voice/NumberParser.kt`, `voice/Commands.kt`, `voice/ReadBack.kt`, `ui/SpecScreen.kt`, `ui/SpecActivity.kt`, tests `voice/NumberParserTest.kt` with the 20-utterance CSV per language (`src/test/resources/asr/<lang>/truth.csv`) run against stored transcripts (`transcripts_<lang>.txt`, produced once on the phone by a debug button that batch-recognises the wavs and writes the file).

Acceptance: on the 20-wav set, field accuracy after the parser >= 90 % for hi and en, >= 80 % for kn (speech-llm-ocr §8 item 3); RTF < 0.3 with 4 threads; a hall-noise live utterance of the five-field sentence fills five chips; any amber/red chip blocks "ok"; keypad path works with the mic denied.

Log: `asr` stage ms, RTF, lang, nChars, parser `unsure` set per utterance to Telemetry; NS `isAvailable/getEnabled` once.

HackTracker: H2 (our `AudioRecord`, in-process sherpa; never `RecognizerIntent`), H1 (`SpecScreen` is a sheet on the scan screen or `SpecActivity` opened from it; if an Activity, keep it short and return to the camera).

---

### P8. Gemma 4 E2B extraction and fix wording with schemas and validator (Sat 04:30, Red)

Build: `llm/Llm` wrapping LiteRT-LM: `Engine(EngineConfig(modelPath = "<filesDir>/models/llm/gemma-4-E2B-it-gpu.litertlm", backend = Backend.GPU, maxNumTokens = 1024))`, `initialize()` on a background thread at app start with a 30 s timeout, status chip "LLM: GPU ready 9.8 s" / "LLM: CPU" / "LLM: off, templates". If GPU init throws (missing `libOpenCL.so`), retry with the CPU `.litertlm`; if that fails, `Llm.available = false` and `Templates` take over with no UI change. Sessions: one `Conversation`/session per task with `temperature = 0`, `topK = 1`, `maxOutputTokens = 128`. Prompts as string constants from speech-llm-ocr §6.1 (system + two few-shots, hi and kn) and §6.2; user message `transcript: "<text>"\nparser_candidates: <json>`. `Validators.specJson`: regex-extract the first `{...}` balanced object; parse with kotlinx; enforce the schema (required keys, enums, ranges, `additionalProperties: false`, `language` in {hi,kn,en}); then the same snap-and-flag as the parser. `Validators.fixText`: parse `{say, subtitle, numbers_used}`; every integer in `say` and `subtitle` must be in the finding's numbers set {measured, required, zoneLength, action.count, band}; `numbers_used` ⊆ that set; reject "safe/unsafe/pass/fail/सुरक्षित/ಸುರಕ್ಷಿತ" substrings. `Templates.fix` per check type and language with slots (speech-llm-ocr §6.2 kn example; hi: "बीम {member}, {zone}: रिंग {measured} पर हैं, ड्राइंग में पहले {zone_length} मिमी तक {required} चाहिए। {count} रिंग और डालें।"). Serialise LLM calls behind a `Mutex`; never run while `captureStill()` or `runTiled` is in flight (speech-llm-ocr §9 thermals).

Schemas to embed as `assets/llm/spec.schema.json` and `assets/llm/fix.schema.json`, copied verbatim from speech-llm-ocr §6.1 and the `{say, subtitle, numbers_used}` output schema.

Files: `llm/Llm.kt`, `llm/Prompts.kt`, `llm/Validators.kt`, `llm/Templates.kt`, `llm/SpecJson.kt`, tests `llm/ValidatorsTest.kt` (20 stored Gemma outputs incl. 5 malformed; the reference output for the English five-field line in §6.1 must round-trip) and `llm/TemplatesTest.kt`.

Acceptance: on the 20 stored transcripts per language, JSON validity >= 90 % and field agreement with the parser >= 95 % where the parser was sure; first extraction latency < 2 s on GPU after warm-up; `wordFix` for the F3 END ZONE finding returns the hi reference sentence or an equivalent that passes the validator; killing the LLM (debug toggle) leaves the UX identical via templates; peak RSS logged after 20 extractions (`Debug.getPss`).

Log: `llm` stage ms (prefill + decode), tokens out, backend, validator pass/fail reason to Telemetry.

HackTracker: H2/H3 unaffected; keep the camera bound (H1) while the LLM runs (GPU and NPU are different units; the segmenter's 5 fps heartbeat continues).

---

### P9. TTS Hindi (Piper via sherpa-onnx) and Kannada (system TTS), subtitles (Sat 06:00, Green)

Build: `voice/Tts`: Hindi via sherpa-onnx `OfflineTts(OfflineTtsConfig(model = OfflineTtsModelConfig(vits = OfflineTtsVitsModelConfig(model = "<filesDir>/models/tts/hi/hi_IN-pratham-medium.onnx", tokens = ".../tokens.txt", dataDir = ".../espeak-ng-data"), numThreads = 2)))`, `generate(text, sid = 0, speed = 0.95f)` -> PCM float -> `AudioTrack` at the model's sample rate; Kannada via `TextToSpeech` with `Locale("kn","IN")`, pick a `Voice` with `isNetworkConnectionRequired == false`, `QUEUE_FLUSH`, `UtteranceProgressListener` for the subtitle sync; if `isLanguageAvailable` returns `LANG_MISSING_DATA`, fall back to pre-rendered clips in `assets/tts/clips/kn/<template_id>.wav` with number-slot concatenation from `assets/tts/clips/kn/num_<n>.wav` (speech-llm-ocr §4 item 8). Number pronunciation: convert integers to words before Piper ("150" -> "एक सौ पचास") using the parser's tables in reverse. `speak()` returns the engine used and ms. Subtitles: `ui/SubtitleBar` shows `subtitle` from `FixText` in the chosen script for the duration of playback plus 2 s; always shown, even when audio fails. Mutex with ASR (never record while speaking). Language default per site from the spec screen (hi/kn toggle), persisted.

Files: `voice/Tts.kt`, `voice/NumberWords.kt`, `voice/ClipTts.kt`, `ui/SubtitleBar.kt`, test `voice/NumberWordsTest.kt` (0-9, 10-100 by tens, 125, 135, 150, 152, 225, 300, 1000 in hi and kn).

Acceptance: the F3 END ZONE hi sentence plays in < 1.2 s from `speak()` to first sample at hall volume; kn plays through the system voice or clips; subtitle appears in sync; a native speaker confirms the number pronunciation on three sentences; engine name and ms appear in Telemetry.

Log: `tts` stage ms, engine, lang, nChars.

HackTracker: H1 (TTS plays over the scan screen), H2 (audio out does not release the mic session object; it is re-opened for the next PTT).

---

### P10. Signed record: Keystore EC key, StrongBox try/catch, BiometricPrompt, canonical JSON, QR with the signature (Sat 06:45, Green)

Build: `record/Canonical.json(record)`: sorted keys recursively, no whitespace, UTF-8, doubles formatted with the shortest round-trip (`Double.toString` is not stable for all values; use a fixed 3-decimal formatting for mm values and integers elsewhere), `ByteArray` fields base64url. `record/Signer`: `KeyGenParameterSpec.Builder(alias, PURPOSE_SIGN).setDigests(DIGEST_SHA256).setAlgorithmParameterSpec(ECGenParameterSpec("secp256r1")).setAttestationChallenge(recordIdBytes)`; first attempt `.setIsStrongBoxBacked(true)` inside try/catch `StrongBoxUnavailableException`, record `strongBox: Boolean`; the **capture key** alias `sariya.capture` has no user-auth requirement; the **approval key** alias `sariya.approve` sets `setUserAuthenticationRequired(true)` + `setUserAuthenticationParameters(0, AUTH_BIOMETRIC_STRONG)` and is signed through `BiometricPrompt` with a `CryptoObject(Signature)`. `sign()` -> `Signature(alg "ES256", sigDer, keyId = sha256(publicKeyDer).take(16) hex, signedAt, strongBox, attestationChain)`. `ScanRecord` gets `captureSignature` on save; `approvalSignature` in P12. `record/Qr.encode`: payload `SARIYA1|<recordId>|<sha256 canonical hex>|<keyId>|<base64url sig>|<flags: c, ca>` as a ZXing QR (version auto, EC level M); `Qr.verify(payload, publicKeyDer)` recomputes nothing about the image, only verifies the signature over the hash with the embedded public key from the record copy on the verifying phone (the verifying phone has the record via Office Kit or the QR carries a URL-free pointer to the pack). Store records as `filesDir/records/<recordId>.json` plus the still and overlay PNGs; Room table for `(recordId, siteCardIds, capturedAt, member, phash)` for P14.

Files: `record/Canonical.kt`, `record/Signer.kt`, `record/Qr.kt`, `record/RecordStore.kt`, `record/Db.kt`, `ui/RecordScreen.kt` (summary, QR, "Sign capture" button, StrongBox/TEE chip), tests `record/CanonicalTest.kt` (two records with permuted key order produce identical bytes) and `record/QrTest.kt` (round-trip verify, and a flipped bit fails).

Acceptance: a scan produces a record whose capture signature verifies on the same phone and on the second phone after Office Kit transfer; the chip reads "StrongBox" or "TEE (StrongBox unavailable)" according to the exception; editing one measured value in the JSON makes verify fail; the QR scans with the stock camera app into a `SARIYA1|...` string.

Log: `sign` ms, strongBox flag, attestation chain length, biometric result.

HackTracker: H1 (RecordScreen opens as a sheet over the scan screen; the camera remains bound), H4.

---

### P11. Beam strip, stirrup positions and zone verdict on the beam face (Sat 11:00, Green; UI in the 13:00 Red)

Build: wire `StripDetector` (P3) and `beamZones` (P5) into the scan flow: when the strip is visible and the member type is `BEAM`, the family perpendicular to `axisDirImg` is the stirrup family; project each stirrup centreline's intersection with the strip line into strip mm; `BeamZones` with `endZoneMm` from the spec (default `2 * d`, rulebook §D); `Rulebook.evaluateBeam`. The 60 cm bench beam is one end zone (300 mm) plus part of mid-span: add a "beam end: left/right/both ends visible" selector and a "beam length mm" field so `closeZoneLengthMm` is bounded. HUD: tick marks on the strip at each stirrup with the gap value in mm, red where a gap exceeds the zone limit + tol. Verdict sheet rows for `DWG-SPACING-MEAN[left]`, `DWG-ENDZONE-LEN`, `IS456-BEAM-LINK-SMAX`, and the IS 13920 rows marked advisory in Zone II.

Files: `geometry/BeamZones.kt` (extend), `ui/overlay/StripOverlay.kt`, `ui/BeamSetupSheet.kt`, `rules/Evaluate.kt` (extend), tests `geometry/BeamZonesTest.kt` (positions [50, 150, 250, 400, 550] with endZone 300 -> end mean 100, first 50, mid 150; F3 positions [50, 250, 380, 400, 550] -> end mean 200, add 1; half-scale demo: [25, 75, 125, 200, 275] with endZone 150 -> end mean 50, mid 75; F3 [25, 125, 190, 200, 275] -> end mean 100, add 1).

Acceptance: fault F3 (2nd ring moved into mid-span, end gap ~200) -> "outside, add 1" spoken in hi; sliding them back -> within; the strip at 30° to the camera axis still yields positions within ±3 mm of the tape; without the strip the beam flow says "strip not seen" and offers the tap-to-mark fallback (P18).

Log: `geometry` beam ms, nStirrups, positions, zone means and bands.

HackTracker: H1, H3 (the strip view is the same camera session).

---

### P12. Engineer review and countersign flow (Sat 16:30, Red)

Build: `ui/ReviewActivity` opened from a review pack file (`officekit/Paths.review`): lists records, shows each finding with the still, overlay, band terms (a "why this band" expander with the six terms), the capture signature status, and buttons "Request another view" (writes `<recordId>.request.json` with a free-text note and the member/zone) and "Sign off" which signs the canonical JSON **plus** the capture signature bytes with the approval key behind `BiometricPrompt` (BIOMETRIC_STRONG). The approval signature is written back into the record as `approvalSignature` and a second QR (`flags = ca`) is shown. On the operator phone, importing the countersigned record updates the stored copy only if both signatures verify and `recordId` matches. The review screen is designed for Office Kit screen mirror on the laptop (large type, no hover, no drag).

Files: `ui/ReviewActivity.kt`, `ui/ReviewScreen.kt`, `ui/BandTermsCard.kt`, `record/Signer.kt` (approval path), `record/Approval.kt`, `officekit/ReviewPack.kt`, tests `record/ApprovalTest.kt` (approval over a tampered capture signature fails).

Acceptance: engineer phone, mirrored on the laptop, signs off with a fingerprint; the operator phone imports the countersigned record and shows two green signature chips; the mason's phone (third loaner) scans the QR and shows "capture + approval verified, 3 within, 1 outside, 1 re-scan"; a record whose capture signature was altered cannot be countersigned.

Log: `approve` ms, biometric result, both keyIds.

HackTracker: H4 (`ReviewActivity` is in-package); during Red keep this phone in Office Kit's mirror/file screens between actions (tracker-officekit §6 items 1-3).

---

### P13. Office Kit file transfer conventions: export folder, bar-schedule import (Sat 17:30, Red)

Build: `officekit/Paths` creating `Documents/Sariya/{export,import,review}` via `MediaStore.Downloads`/`MediaStore.Files` with `RELATIVE_PATH` (scoped storage, no legacy permission), so the folders appear in the Files app and Office Kit's file browser. `exportPack(record)`: `<recordId>.sariya.zip` containing `record.json` (canonical), `record.sig.json` (both signatures, public keys, attestation chain), `still.jpg`, `overlay.png`, `terms.json`, `README.txt` (what each file is, how to verify with the QR string; no claims language). `importBarSchedule()`: polls `import/` on screen resume for `*.bbs.json` (array of `Spec`) or `*.csv` (header `member,type,bar_dia_mm,bar_count,bar_spacing_mm,stirrup_dia_mm,stirrup_spacing_end_mm,stirrup_spacing_mid_mm,end_zone_mm`); every imported row still goes through the confirm screen with `source = BBS_IMPORT`. `importCountersign()` from `review/`. A "Transfers" screen listing export/import/review contents with timestamps. Optional: ML Kit Latin OCR on a photographed BBS table -> rows -> the same import path (`source = BBS_OCR`), only if time allows; each row confirmed.

Files: `officekit/Paths.kt`, `officekit/ExportPack.kt`, `officekit/Import.kt`, `officekit/ReviewPack.kt`, `ui/TransfersScreen.kt`, `README-transfer.txt` template under `assets/officekit/`.

Acceptance: laptop -> phone: drop `site07.bbs.json` into `import/` via Office Kit, the Transfers screen shows it within 5 s, confirm screen shows the rows; phone -> laptop: export a pack, open it on the laptop, the `record.json` sha256 equals the hash in the QR string; engineer phone -> laptop -> operator phone countersign round trip works with the three loaners.

Log: transfer events (kind, bytes, ms) to Telemetry; these feed the pitch line "N packs over Office Kit".

HackTracker: Office Kit minutes accrue only with an Office Kit screen in front on the phone (tracker-officekit §1.2); every transfer is done from the phone's Office Kit file browser, not from the laptop side alone.

---

### P14. Replay rejection by per-site card ID and perceptual hash (Sat 22:00, Red)

Build: `record/PHash.dct64(bitmap)`: grey, resize 32x32, DCT (OpenCV `Core.dct`), top-left 8x8 minus DC, median threshold -> 64-bit hex; computed on the still and on the overlay-free crop of the card region removed (so the hash is of the steel, not the card). `record/ReplayGuard.check(record)`: (1) `siteCardIds` must all belong to the site registered in `SiteSetup` (card k -> ids 18k..18k+17; the site registers 1-3 cards at setup); (2) Hamming distance of each new phash to all stored phashes from other `recordId`s < 6 -> `REPLAYED_IMAGE`; (3) `capturedAt` earlier than the latest accepted record for the same member -> `STALE`; (4) a record imported from a pack whose `deviceInfo.androidId` differs from the signing key's record -> `FOREIGN_DEVICE` (informational). Verdict shown as a red banner on the record and written into the record as `replayCheck`. Debug action "Replay yesterday's pack" that imports a stored pack to demonstrate the rejection.

Files: `record/PHash.kt`, `record/ReplayGuard.kt`, `ui/SiteSetupScreen.kt`, `ui/ReplayBanner.kt`, tests `record/PHashTest.kt` (same image re-encoded at JPEG 70 -> distance <= 3; a different mesh -> >= 15) and `record/ReplayGuardTest.kt`.

Acceptance: re-importing yesterday's pack shows `REPLAYED_IMAGE` and the countersign button is disabled; scanning with card 03 at a site registered for card 07 shows `WRONG_CARD`; a fresh scan of the same mesh after moving a bar passes (distance > 6).

Log: hamming distances and the reason string.

HackTracker: H1, H4; the replay demo phone is a continuous-use role in Red (tracker-officekit §7).

---

### P15. Numbers screen: NPU/GPU/CPU table, battery and thermal over N scans, scan counts (Sat 15:30, mentor Green)

Build: `numbers/Sampler` every 30 s: `BatteryManager` level and `BATTERY_PROPERTY_CURRENT_NOW`, `PowerManager.getThermalHeadroom(10)` and `getCurrentThermalStatus()`, `HardwarePropertiesManager` skin temperature if permitted (else null), process PSS, timestamp; persisted to `filesDir/numbers.json`. `numbers/Bench.run(model)`: 50 runs each on NPU, GPU, CPU with the same input (P1 logic, now a button). `ui/NumbersActivity`: table 1: stage p50/p95 ms per accelerator from Telemetry (seg, fiducial, geometry, asr, llm, tts); table 2: bench rows; table 3: session counters (frames inferred on NPU, scans, records signed, packs exported, voice utterances, minutes with the camera bound); chart: battery % and thermal headroom over the last 2 h; a one-line provenance footer (model file name, sha256 first 8, training log timestamp, rulebook version). Every number is read from stored data, never typed.

Files: `numbers/Sampler.kt`, `numbers/Bench.kt`, `numbers/Store.kt`, `ui/NumbersActivity.kt`, `ui/NumbersScreen.kt`.

Acceptance: after 30 minutes of scanning, the screen shows three accelerator rows with NPU < GPU < CPU latency; battery and headroom lines have >= 60 points; counters are non-zero and match the Telemetry ring buffer; the screen renders with `numbers.json` deleted (empty state, no crash).

Log: the screen is the log.

HackTracker: `NumbersActivity` runs on the third phone during Red as its continuous role; the bench button is a legitimate way to keep the NPU/GPU busy on a phone that is otherwise idle (tracker-officekit §6 item 10).

---

### P16. Error-table screen (Sat 23:00, Red)

Build: `ui/ErrorTableScreen` reading all stored records that have a `tapeMm` field (entered by voice or keypad on the verdict sheet's "tape check" action, P6): rows per (distance bucket 0.4/0.6/0.8/1.0/1.2 m, lighting tag, member type) with n, mean |app - tape|, p95 |app - tape|, mean band, "band covered the error" fraction. A "field floor" button writes the p95 into `filesDir/calib/field_floor.json` (overriding the asset default; P5 reads this path first) and shows the before/after. Export the table as CSV to `Documents/Sariya/export/error_table.csv`. Seed rows from the pre-event bench CSV (`assets/calib/bench_error_table.csv`, from the 8 Oct bench test) shown in a separate "pre-event" section with its date.

Files: `ui/ErrorTableScreen.kt`, `numbers/ErrorTable.kt`, `record/TapeEntry.kt`, test `numbers/ErrorTableTest.kt`.

Acceptance: 20 tape-checked scans across three distances produce a table; p95 at 0.8 m is <= 5 mm on the mesh board; the floor button changes the band shown on the next scan; the CSV opens on the laptop over Office Kit.

Log: floor changes with timestamp into `numbers.json`.

HackTracker: the tape-check loop (scan, tape, voice entry) is the Red-block routine for the scanning phone (H1, H2, H3 together).

---

### P17. Crash guards and recovery (Sat 08:00, Red, before Eval 1; revisit Sun 01:00)

Build: `Thread.setDefaultUncaughtExceptionHandler` that writes the stack to `filesDir/crash/<ts>.txt` and restarts `ScanCameraActivity` via `AlarmManager` in 500 ms; every model and camera call wrapped: segmenter create/run (fallback chain, then "model off" chip and the tap-to-mark path), `CameraSession.bind` (retry twice with 1 s backoff, then a "camera busy" screen with a retry button; never finish the Activity), ASR/TTS/LLM init (feature off, UI unchanged), file I/O (toast and continue), `BiometricPrompt` errors (lockout -> show the message, keep the record unsigned). Watchdog: if no analysis frame arrives for 3 s while bound, rebind. Memory: release the 4K still bitmaps after `runTiled`; `onTrimMemory` drops the LLM engine first, the ASR recognisers second, never the segmenter. A hidden "Doctor" screen listing: accelerator, model file, intrinsics mode, ASR langs loaded, TTS engines, LLM backend, StrongBox flag, last crash file.

Files: `SariyaApp.kt` (handler), `capture/CameraSession.kt` (watchdog), `segment/BarSegmenter.kt` (guards), `ui/DoctorScreen.kt`, `util/Guard.kt` (`inline fun <T> guarded(stage: String, fallback: T, block: () -> T): T` that logs to Telemetry).

Acceptance: a monkey run (`adb shell monkey -p in.sariya.camera --throttle 50 2000`, done on the spare phone, not the loaner) produces no crash file; renaming the model asset, denying the mic, and revoking the camera permission mid-scan each show a chip or screen and the app keeps running; 20 consecutive scans with voice and TTS leave PSS below 1.5 GB with the LLM loaded.

Log: every guarded failure as `guard, stage, exceptionClass, message`.

HackTracker: a crash of our app is not a tracker penalty (tracker-officekit §1.2) but an idle phone is; the restart-in-500-ms keeps the phone active and the camera bound (H1).

---

### P18. Tap-to-mark fallback (Sun 01:00, Green)

Build: when the segmenter is off, the mask is empty in the zone, or the user taps "mark bars", `ui/TapToMarkOverlay` lets the user tap each bar once along a guide line drawn across the zone (and tap each stirrup along the strip for beams); taps are snapped to the nearest ridge in the full-res still within 12 px using the 1-D intensity profile from P5 (so the human gives topology and the pixels give position); the same `geometry.countAndSpacing` and `Rulebook` run on the resulting centrelines, with the `Measurement.terms` adding a `manual_mark` term of 1.0 px sigma and `source = TAP` on the `ZoneResult`; the verdict sheet shows "marked by hand" on every row. Also usable to correct a merged pair (tap to split) or a false bar (long-press to delete) when the model ran.

Files: `ui/TapToMarkOverlay.kt`, `geometry/ManualLines.kt`, `geometry/RidgeSnap.kt`, test `geometry/RidgeSnapTest.kt`.

Acceptance: with the model disabled in Doctor, a full mesh verdict with spoken fix and a signed record (marked `source: TAP`) completes in under 90 s; tap positions snap visibly onto the bars; the band on a tap-marked scan is wider than the model's for the same still.

Log: `manual` marks count, snap distances.

HackTracker: H1 (the overlay sits on the still inside `ScanCameraActivity`; the preview resumes on dismiss), H3 (the 5 fps heartbeat continues even when the overlay is used).

---

Prompts not numbered because they are small follow-ons the agent does inside the ones above: the close-up diameter abstain still and the weigh-test entry (offcut length field, default 200 mm, editable; kg/m = mass / length) with IS 1786 bands (`rules.json` `IS1786-DIA-BANDS`; Tier 2; attach to P6's "needs tape" rows only if Tier 1 is green by Sat 13:00); the hook-template close-up (Tier 2, same condition); ML Kit BBS OCR (inside P13, optional).

---

## 4. Hour-1 checklist for the loaner, and the Red-block opening routine

### 4.1 Fri 17:00-18:00: one runnable list (device-devenv §2; vision-stack §8; speech-llm-ocr §8; PREP-PLAN §7)

Run top to bottom on each of the three loaners; write results into `STATE.md` as you go. Lines starting with `$` run on the laptop (adb is allowed, PREP-PLAN §7 item 3); note that enabling ADB is logged, which the organisers said is fine.

```text
00  Collect loaners; photograph IMEI stickers; label phones A (scan), B (Remote PC), C (review/replay).
01  Settings > About phone > tap version x7 > Developer options: USB debugging ON, Wireless debugging ON, Stay awake ON; "Install via USB" ON if shown.
02  $ adb devices                                  # accept "always allow"
03  $ adb shell getprop ro.soc.model ro.board.platform ro.build.version.security_patch   # expect SM8850
04  $ adb shell dumpsys meminfo | head -5 ; adb shell df -h /data                         # need >= 6 GB free
05  $ adb install -r skeleton-probe.apk  (P1 build from the spare phone, or the throwaway probe)  -> run "NPU smoke test"
06  Record: NPU create ms, p50, p95; GPU p50; CPU p50. PASS = NPU < 10 ms (DeepLabV3+) / < 25 ms (U-Net). FAIL -> jniLibs zip flow -> ORT-QNN -> GPU; write the outcome.
07  Run "Camera probe": hardware level, physical ids, focal lengths, AF/OIS modes, 4K still size, frame-rate ranges -> filesDir/probe.json; $ adb pull.
08  Calibration: 25 stills of the A3 board (ids 500-543) at 0.5-1.0 m with focus locked at the station distance; $ adb pull; run prep/ref_pipeline/calibrate.py -> intrinsics_<mode>.json (RMS < 0.3 px); copy into app/src/main/assets/calib/.
09  Measure the printed square pitch of cards 00-02 and the strip with the vernier; write cards.json.
10  First measurement: one still of the mesh board with card 00 through ref_pipeline -> compare with tape; write the delta as error-table row 1.
11  $ adb push sariya-models/asr sariya-models/vad sariya-models/tts sariya-models/llm /sdcard/Download/sariya-models/   (or Office Kit file transfer); the app's "import models" moves them to filesDir/models/.
12  Run the ASR regression (debug button) on the 20 wavs for hi, kn, en: field accuracy, RTF, digits-vs-words. kn < 80 % -> default demo language en for spec entry, kn for TTS.
13  Settings > search "Text-to-speech": engine, hi-IN and kn-IN voice data; download offline voices on the laptop hotspot if missing. In-app: isLanguageAvailable(kn-IN), voices with isNetworkConnectionRequired == false.
14  LLM: Gemma GPU initialize() time and first extraction; if OpenCL init fails -> CPU .litertlm -> templates. Record PSS.
15  StrongBox: generate sariya.capture; record strongBox true/false; enrol the engineer's finger on phone C; BiometricPrompt test sign.
16  Mic: live PTT in the hall, NS available/enabled, one five-field sentence -> five chips.
17  Thermal baseline: 5 min continuous overlay with torch; log headroom and frame time; set the station burst length.
18  Battery whitelisting: Battery > High background power (allow), Autostart (allow), App info > Battery > Not optimised; lock the app in Recents; add the app to Game Space for bypass charging (device-devenv §2 items 15-16).
19  Office Kit: pair all three phones with the MacBook (and the Windows mirror); test Remote PC (open a full-screen tmux terminal), Super Clipboard both ways, file transfer both ways; time a 50 MB APK transfer.
20  Install the P1 APK on all three phones via Office Kit transfer + Files (log the install path for the organisers); confirm the package is in.sariya.camera on all three.
21  Charge all three to 100 %; props through security; sit down by 18:50.
```

### 4.2 First 15 minutes of every Red block

```text
T-2   Green ends: laptop stays on, tmux session "sariya" with three windows: agent (Claude Code / Codex), build (./gradlew --offline), logs (adb logcat -s Sariya:I Telemetry:I). Hands off the laptop keyboard from now on.
T+0   Phone B: open Office Kit > Remote PC; full-screen the tmux window; type "clear" to prove input works. Phone B stays in Remote PC the whole block (Office Kit minutes accrue only with an Office Kit screen in front; tracker-officekit §1.2).
T+1   Phone A: open Sariya (ScanCameraActivity), torch on, card 00 on the mesh board; start the tape-check loop (scan, tape, voice entry) and keep going: this is camera + mic + NPU for the whole block.
T+2   Phone C: role for this block (written on the whiteboard): ReviewActivity over Office Kit mirror, Replay demo, NumbersActivity bench loop, or Transfers screen. Never idle 10 minutes (idle warning is taps-only, tracker-officekit §1.2).
T+3   Charging rotation: exactly one phone on the charger at a time, 30 minutes each, order A -> C -> B; the phone on the charger still runs its role (phone B charges while in Remote PC). No phone goes below 25 %.
T+5   Phone B through Remote PC: paste the block's prompt file (prepared in Green as prompts/PNN.md on the laptop; Super Clipboard for short edits) into the agent window; start the build in window 2.
T+8   APK path: build output -> Office Kit file transfer to phone A -> install from Files (an update of the same package, never a new applicationId).
T+10  Whiteboard: block start time, phone roles, battery %, which prompt is running, the one acceptance check that gates the next checkpoint.
T+15  First sanity scan on the new build on phone A; if it crashes, phone A goes back to the previous APK (kept in Download/apk-prev/) and the crash file goes to the agent.
Every 60 min: swap the charger; note Telemetry counters (frames inferred, scans) on the whiteboard for the pitch.
```

---

## 5. Honest-answers cheat sheet for the jury

**The model.** A 2-class semantic segmentation net (U-Net-lite on a MobileNetV3-Large encoder, 1152x640 input) that labels bar pixels; everything after that is classical geometry: skeleton, line fit, homography to the card plane, adjacent-gap statistics. If hour 1 showed the U-Net partitioning to CPU, we run DeepLabV3+-MobileNet from Qualcomm AI Hub re-headed to 2 classes, and we say which one is in the APK (vision-stack §1, §2; the Doctor screen shows the file name and hash).

**The NPU.** Segmentation runs through LiteRT 2.3.0's CompiledModel API with the Qualcomm NPU accelerator on the Hexagon HTP; the numbers screen shows the same model on NPU, GPU and CPU side by side, measured on this phone during the event (vision-stack §3.1, §8). We cannot call an API that says "this ran on the NPU"; we show the compile log, the latency gap (single-digit ms vs tens on GPU) and the AI Hub per-op compute-unit table from the pre-event profile job. If an op fell back, the chip says so.

**The LLM.** Gemma 4 E2B on the GPU through LiteRT-LM, because Google has not shipped a Snapdragon 8 Elite Gen 5 NPU build; the GGUF path through Qualcomm's Hexagon llama.cpp backend is the upgrade and we have not measured it (speech-llm-ocr §3.3, §9). The LLM only turns speech into five typed fields, words the fix, and answers questions about the record; every number it emits is validated against the input and read back. Measurements and verdicts never pass through it; switch it off in Doctor and the app behaves identically on templates.

**Speech.** AI4Bharat IndicConformer (MIT) int8 CTC per language via sherpa-onnx on the CPU, push-to-talk with Silero VAD; number robustness comes from our parser and the read-back, not the decoder (speech-llm-ocr §1, §5). Kannada ASR is the weakest link (21-27 % WER on public benchmarks); if it under-performs in the hall we take spec numbers in English and keep Kannada for the spoken fix. Hindi TTS is Piper; Kannada is the system voice or pre-rendered clips, and we say which one you heard.

**Licences.** App code: ours, written this weekend, MIT. Libraries: OpenCV, LiteRT, LiteRT-LM, sherpa-onnx, ONNX Runtime (Apache-2.0); segmentation_models_pytorch and IndicConformer weights (MIT); Gemma 4 (Apache-2.0); ML Kit under Google's terms (on-device inference, metrics calls disclosed; airplane mode on stage). Not in the primary stack because of AGPL: Ultralytics YOLO and FastSAM; they are fallbacks only, named as such (vision-stack §1, §9; speech-llm-ocr §1). Piper voice licences are per voice and checked in each MODEL_CARD.

**Training provenance.** Pre-trained on ImageNet (encoder) and public rebar sets (ROI-1555, cited; CC-BY Roboflow placed-mesh sets), fine-tuned before the event on frames from the Bengaluru sites we visited this week, which the organisers allowed in writing on 7 Oct (PREP-PLAN §7 item 5). Every run has a timestamped log with the dataset hash and git hash in the repo; the at-event re-fine-tune, if we ran it, is the second entry. Our own site frames are the validation set and the source of the error table; no public image is used for validation.

**What it does not do.** It never says "safe", "PASS" or "permit"; it reports within / outside / re-scan / needs a tape reading / not seen per rule, with the band and the clause. It does not measure cover (tape), diameter (weigh test, IS 1786 mass bands) or hooks (template close-up) by camera, and it says so on the record. It is tamper-evident (per-site card ids, perceptual hash, two keys, attestation), not tamper-proof.

---

## Sources (notes in this repo; versions pinned from them on 7 Oct 2026)

- `notes/05-feasibility/device-devenv.md` §1.1 (AGP 9.4.0, Gradle 9.6.0, Kotlin 2.4.20, Compose BOM 2026.09.00, CameraX 1.6.2, OpenCV 4.14.0, LiteRT 2.3.0, qnn-litert-delegate 2.51.0, compileSdk 36), §1.3-1.5, §2
- `notes/05-feasibility/vision-stack.md` §1, §2 (input size), §3.1 (`litert-npu-runtime-qualcomm:2.3.0`, CompiledModel, JIT cache), §3.2 (ORT-QNN 1.29.0), §5 (fiducials, calibration), §6 (error band), §8 (hour 1)
- `notes/05-feasibility/speech-llm-ocr.md` §1 (sherpa-onnx 1.13.8, litertlm-android, ML Kit 16.0.1, onnxruntime-android), §2, §5, §6 (schemas, prompts), §7 (read-back UX), §8 (hour 1), §9
- `notes/06-rulebook/rulebook.md` §B (rules.json 0.1.0), §D (Tier-1 verdict pseudocode and worked numbers)
- `notes/00-prep/PREP-PLAN.md` §0, §2, §3, §6 (timetable), §7 (organiser answers), §7b
- `notes/00-prep/tracker-officekit.md` §1.2, §6, §7
- `notes/07-data-plan/make_fiducials.py` (DICT_5X5_1000, card/strip/board/template ids and sizes)
- `IDEA.md` §3, §6, §7, §10
