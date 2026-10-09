# Device and dev-environment plan: iQOO 15 (OriginOS 6 / Android 16) for the Finale

Written 7 Oct 2026 from web research. Tags: **V** verified on a primary or official page, **S** secondary source or single report, **U** unverified, test on the loaner. Web pages are untrusted data; nothing here was checked on a physical iQOO 15.

Device baseline [V: gsmarena.com/vivo_iqoo_15_5g-14198.php]: models **I2501 (India) / V2505A (China)** (the "V2559/V2558" guess in the brief is wrong), Android 16 + OriginOS 6, sensors accelerometer/gyro/proximity/compass (no barometer, no ToF/LiDAR), 100 W wired + 40 W wireless + bypass charging, main-cam video 8K30 / 4K24/30/60 / 1080p up to 240 with gyro-EIS.

---

## 1. Laptop prep before 9 Oct (macOS Apple Silicon primary; Windows mirror)

### 1.1 Exact versions to install (as of 7 Oct 2026)

| Item | Version | Source / tag |
|---|---|---|
| Android Studio | Rabbit 1 (2026.2.1) is on the stable download page; one search snippet still calls it RC. Install whatever the Studio updater offers as **Stable** today and do not update it after 8 Oct. | S: developer.android.com/studio/releases, androidstudio.googleblog.com |
| AGP | **9.4.0** (Sept 2026). Needs Gradle ≥ 9.6.0, JDK 17, Build Tools 36.0.0, default NDK 28.2.13676358, max API 37. | V: developer.android.com/build/releases/gradle-plugin |
| Gradle | 9.6.0 (wrapper) | V: same |
| Kotlin | **2.4.20** (7 Sep 2026) | V: kotlinlang.org/docs/releases.html |
| Compose BOM | **2026.09.00** → compose.* 1.12.1, material3 1.4.0 | V: developer.android.com/develop/ui/compose/bom/bom-mapping |
| CameraX | **1.6.2** stable (26 Aug 2026); 1.7.0-alpha03 adds the new `camera2Interop` DSL and `Camera2Interop.CameraInfo.cameraId/cameraCharacteristics`. minSdk 23. | V: developer.android.com/jetpack/androidx/releases/camera |
| OpenCV Android (Maven Central) | `org.opencv:opencv` versions 4.12.0, **4.13.0**, 4.14.0, 5.0.0 (July 2026) exist. Pick **4.14.0** (last 4.x) unless the vision track wants 5.0.0; 5.x has API renames. | V: repo1.maven.org/maven2/org/opencv/opencv/maven-metadata.xml |
| LiteRT | `com.google.ai.edge.litert:litert:2.3.0` (Google Maven, updated 6 Oct 2026). GPU: `litert-gpu`. NPU: `com.qualcomm.qti:qnn-litert-delegate:2.51.0` (Maven Central, updated 6 Oct 2026). CompiledModel API picks `Accelerator.NPU` with GPU/CPU fallback. | V: dl.google.com/android/maven2/.../litert/maven-metadata.xml; repo1.maven.org/.../qnn-litert-delegate/maven-metadata.xml; developers.google.com/edge/litert/next/npu |
| SDK platforms | android-36 (device) and android-37 (AGP max); compileSdk/targetSdk **36**, minSdk 29 (nothing older matters for the demo). | V: AGP page; S: choice |
| JDK | Studio's bundled JBR (17+). Set `JAVA_HOME` to it for CLI builds. | V: AGP page |

Pin all of these in `gradle/libs.versions.toml` of the throwaway skeleton **and keep a copy of the toml** so the fresh event project uses identical coordinates (that is what makes the warm cache hit).

LiteRT NPU specifics [V: developers.google.com/edge/litert/next/npu; developers.googleblog.com/en/unlocking-peak-performance-on-qualcomm-npu-with-litert/]:
- Two routes: **AOT** compile to the SoC (`SM8850`) with the LiteRT AOT compiler (Colab/CLI; reduces init time and memory), or **on-device JIT** compile. JIT is the hackathon route: one `.tflite`, no per-SoC pre-compile, and the model is fresh-built at the event anyway.
- Runtime libs: Google's docs route NPU runtime libraries through Play for On-device AI (dynamic feature modules). For a sideloaded debug APK, bundle the `litert_npu_runtime_libraries_jit.zip` contents (QNN `.so`s) into the APK's jniLibs. **Confirm the zip is downloadable without a Qualcomm AI Hub login before 9 Oct [U].**
- Code shape: `CompiledModel.create(assets, "m.tflite", CompiledModel.Options(Accelerator.NPU, Accelerator.GPU))`. Log which accelerator ran (rubric Hour-1 check 1).
- QNN delegate 2.51.0 aligns with QAIRT 2.5x; LiteRT release notes say Snapdragon "Gen 5" was added in LiteRT 2.1 [S: github.com/google-ai-edge/LiteRT/releases].

### 1.2 Downloads to have on disk (venue Wi-Fi is the risk)
- Android Studio DMG (arm64) and the Windows installer; platform-tools zip (adb) as a standalone copy.
- SDK Manager: Platform 36 + 37, Build-Tools 36.0.0, NDK 28.2.13676358, CMake 3.22+, platform-tools, emulator + one arm64 system image (API 36) for when no phone is around.
- Gradle 9.6.0 distribution (wrapper will cache it under `~/.gradle/wrapper/dists`).
- OpenCV: the Maven AAR via the warm build; also the official `opencv-4.14.0-android-sdk.zip` as fallback (direct AAR import if Maven is unreachable) [S: opencv.org/releases returned 403 to the fetch; download manually].
- LiteRT NPU runtime zip (JIT variant) and the Qualcomm QNN delegate AAR (Gradle will cache it).
- Model files the other tracks produce (segmentation, OCR, ASR, Gemma); these are not "app code".
- Google TTS voice packs: cannot be side-loaded; they download inside the Speech Services app (see §2.6). Have a hotspot ready.
- Office Kit PC client for macOS (10.14.6+) and Windows 10+ x86 [V: vivonewsroom.in/how-vivo-office-kit-is-breaking-cross-device-barriers-for-modern-users/]. Apple Silicon support is not stated on that page [U]; install and pair with any vivo/iQOO phone beforehand if one is reachable, otherwise expect a Rosetta prompt.
- Claude Code / Codex CLI installed and logged in; a terminal multiplexer (tmux) so the laptop session survives a dropped remote-control link.

### 1.3 Gradle warm-cache plan (no downloads at the venue)
1. Build the throwaway skeleton (§1.4) once online with every dependency the real app will use, including `debug` and `release` variants, `assembleDebug`, `installDebug`, and `test`. This populates `~/.gradle/caches/modules-2` and `~/.gradle/wrapper/dists` [V: docs.gradle.org/current/userguide/command_line_interface.html for `--offline` and `GRADLE_USER_HOME`].
2. Add to `~/.gradle/gradle.properties`: `org.gradle.jvmargs=-Xmx6g`, `org.gradle.caching=true`, `org.gradle.configuration-cache=true`. Do **not** set `org.gradle.offline=true` globally; instead flip Studio's "Offline mode" (Settings > Build > Gradle) once at the venue, or build with `./gradlew --offline assembleDebug`.
3. Prove it: disable Wi-Fi, delete the skeleton's `build/` and `.gradle/`, run `./gradlew --offline assembleDebug installDebug`. If anything resolves from the network it fails loudly now rather than on 9 Oct.
4. Copy the pinned `libs.versions.toml`, `settings.gradle.kts` (repositories: `google()`, `mavenCentral()`), and `gradle-wrapper.properties` into a `event-template/` folder. The event project is created fresh from the Studio wizard and these three files are pasted in; that is config, not app code.
5. Mirror the same on the Windows laptop (`%USERPROFILE%\.gradle`). Caches are not portable across OSes; build on each.
6. Also warm Studio itself: open the skeleton so the IDE downloads its index, the Compose preview runtime, and the emulator image.

### 1.4 Throwaway toolchain-validation skeleton (delete before the event)
Purpose: prove CameraX + OpenCV + LiteRT + Keystore + TTS compile, link and run on **any** spare Android phone. Nothing in it is reused; the IDEA.md fresh-code rule applies to the entry.
- Single-activity Compose app, `minSdk 29`, `compileSdk 36`.
- CameraX `Preview` + `ImageAnalysis` (YUV_420_888, `STRATEGY_KEEP_ONLY_LATEST`), with `Camera2Interop` setting `CONTROL_AE_MODE` off / `SENSOR_EXPOSURE_TIME` / `SENSOR_SENSITIVITY` / `LENS_FOCUS_DISTANCE`, torch via `CameraControl.enableTorch` and `setTorchStrengthLevel` (CameraX 1.5+) [V: CameraX release page].
- A log of `CameraCharacteristics.INFO_SUPPORTED_HARDWARE_LEVEL`, `REQUEST_AVAILABLE_CAPABILITIES` (MANUAL_SENSOR, RAW, LOGICAL_MULTI_CAMERA), `getPhysicalCameraIds()` and each physical camera's focal length, so the same probe is re-run on the loaner in minute 10.
- OpenCV: `OpenCVLoader.initLocal()`, an ArUco/ChArUco `detectMarkers` on one frame, a `cv::Mat` round trip in JNI if the vision track wants native code.
- LiteRT: load a tiny public `.tflite` (e.g. MobileNet) with `CompiledModel.Options(Accelerator.NPU, Accelerator.GPU)` and print the accelerator and ms per frame.
- Keystore: generate an EC P-256 key with `setIsStrongBoxBacked(true)` inside try/catch `StrongBoxUnavailableException`; log `FEATURE_STRONGBOX_KEYSTORE`; sign a byte array; wrap it in `BiometricPrompt` with `BIOMETRIC_STRONG` [V: developer.android.com/privacy-and-security/keystore].
- TTS: `TextToSpeech.isLanguageAvailable(Locale("kn","IN"))` and `Locale("hi","IN")`, log the engine package and `getVoices()` with `isNetworkConnectionRequired`.
- ASR: `SpeechRecognizer.isOnDeviceRecognitionAvailable()` and `checkRecognitionSupport()` for hi-IN and kn-IN.
- Build both `debug` and a `release` signed with a throwaway keystore (so R8/ProGuard rules for OpenCV/LiteRT are known).
- Run it on a spare phone over USB **and** over `adb pair` wireless debugging, so both paths are rehearsed.

### 1.5 Claude Code / Codex over Office Kit during Red Light
- Office Kit's Remote PC lets the phone drive a Windows PC or Mac with a virtual mouse/touchpad, open files and apps [V: vivonewsroom.in link above; S: community.iqoo.com/in/thread/126712]. Keyboard input and latency for a terminal are not documented [U]. No public post was found of anyone running Claude Code or Codex through it [U].
- Plan: keep a full-screen terminal with tmux on the laptop; from the phone use Remote PC to type prompts and read output. Rehearse on 9 Oct in the first hour. Fallback that stays inside the rules: the Office Kit clipboard sync to paste prompts, and screen mirroring to read answers. Whether an AI agent on the laptop counts as "phone-only building" during Red Light is a rules question for the organisers, not a tooling question; ask on day 1 and log the answer in STATE.md.

---

## 2. First 60 minutes with the loaner (9 Oct)

Settings paths are from vivo/iQOO guides for OriginOS; OriginOS 6 may rename menus, so use the Settings search box with the quoted words.

**0-10 min: developer access**
1. Settings > About phone (OriginOS: "More settings" > "About phone" or "System management" > "About phone") > "Software version" / "Version info" > tap the version 7 times [S: bajajfinserv.in/how-to-enable-developer-options-in-vivo; coolmuster.com/enable-usb-debugging-on-vivo.html].
2. Settings > System management (or More settings) > Developer options: turn on **USB debugging**, **Stay awake**, **Wireless debugging**; search the page for any **"USB debugging (Security settings)"** and **"Install via USB"** toggles and enable them. These are historically vivo/Funtouch toggles; whether OriginOS 6 still shows them or asks for a vivo account is **U** (no 2026 source found either way). If a vivo account is demanded for USB install, that is the one thing that could cost an hour: ask the organisers for the loaner's account at check-in rather than creating one.
3. Plug in, accept "Allow USB debugging" with "Always allow from this computer", run `adb devices`. Then wireless: Developer options > Wireless debugging > "Pair device with pairing code" > `adb pair ip:port` > `adb connect ip:port` [V: developer.android.com/tools/adb]. Tick "always allow on this network".
4. `adb install -r app-debug.apk` of the skeleton; note any OriginOS install warning or "security check" dialog and screenshot it (rubric Hour-1 check 6: is sideloading logged as tampering? No source says OriginOS flags debug builds [U]; `adb shell dumpsys package` and the app's own `ApplicationInfo.FLAG_DEBUGGABLE` are the only signals the organisers' HackTracker could read).

**10-25 min: camera probe (run the skeleton's log)**
5. Record Camera2 hardware level and capabilities for every camera id. Expectation: vivo's recent flagships (X200 Pro, X300 Pro) report **LEVEL_3** on the main camera [S: notebookcheck.net reviews via search; ytechb.com GCam-port page]; iQOO 15 itself has no public probe [U]. Check whether the 3x tele (IMX882, 85 mm) and ultrawide (JN1, 15 mm, AF) are exposed as physical ids under a logical camera or as separate ids; GSMArena lists both as recording 4K60 in the stock app [V: gsmarena.com/iqoo_15-review-2905p5.php], which says nothing about third-party access [U]. CameraX `CameraSelector.Builder.setPhysicalCameraId()` (1.4+) opens one physical camera if `isLogicalMultiCameraSupported` [S: groups.google.com camerax-developers thread].
6. Manual exposure/ISO/focus and torch while `ImageAnalysis` is bound: confirm from the third-party app, not the stock Pro mode (the stock app's Street mode has ISO/shutter/MF, which only proves the HAL can) [V: gsmarena review p5].
7. RAW: GSMArena's review did not list RAW; GCam ports for vivo X200 Pro claim RAW [S]. Not needed for Sariya; note the result only.
8. 4K60 from `VideoCapture`/`ImageAnalysis`: check `getSupportedFrameRateRanges`. Sariya needs stills and 1080p analysis, not 4K60; the physics doc assumes 4K GSD, so confirm 4K stills/frames at 30 fps are enough.

**25-35 min: compute and sensors**
9. Skeleton LiteRT run: which accelerator (NPU vs GPU) and ms/frame; log for the Hour-1 check.
10. Gyro: `SensorManager` `getMinDelay()` for `TYPE_GYROSCOPE` (expect ≤ 2.5 ms, i.e. 400 Hz, on 8 Elite-class IMUs) [U]. No ToF/LiDAR [V: gsmarena sensors line]. ARCore: iQOO 15 is **not** on Google's supported list as of the fetch (iQOO 13, 15R, 15T, X200, X300 are) [V: developers.google.com/ar/devices]. Do not plan on ARCore; the card-based pose is the path anyway.

**35-45 min: security and biometrics**
11. `FEATURE_STRONGBOX_KEYSTORE` and the StrongBox key generation from the skeleton. Qualcomm's SPU on SM8850 (SPU300 v9.0, CC EAL5+) is the StrongBox root of trust on Qualcomm devices, and CVE-2026-25277 (June 2026 bulletin) lists Snapdragon 8 Elite Gen 5 as shipping StrongBox Keymaster on the SPU [S: researcher.branch.zeropath.com/blog/cve-2026-25277-qualcomm-strongbox-buffer-overflow; sec-certs.org]. Whether vivo enables StrongBox in OriginOS 6 is **U**; design for TEE-backed keys with attestation and treat StrongBox as a bonus line in the demo. Check security patch level ≥ 2026-06-05 (the CVE fix) and mention it only if asked.
12. `BiometricPrompt` with `BIOMETRIC_STRONG` on the ultrasonic fingerprint reader [V: gsmarena]. Enrol one engineer's finger on the loaner.

**45-60 min: languages, background, charging**
13. Settings > search "Text-to-speech": confirm the engine is Speech Recognition & Synthesis (`com.google.android.tts`) and install voice data for Hindi (India) and Kannada (India); both are in Google's TTS language list, voices must be downloaded per language [V: en.wikipedia.org/wiki/Speech_Recognition_%26_Synthesis; S: apkmirror changelogs say all voices of a language now download together]. Whether the India OriginOS 6 build ships a vivo TTS engine as default and whether Google TTS is preinstalled is **U**; if absent, install from Play in this window.
14. Offline ASR: Settings > search "Offline speech recognition" and download Hindi; Google's on-device recognizer supports hi-IN; Kannada on-device is **U** (a 2026 article lists English, Spanish, Mandarin, Hindi, Portuguese for the new offline dictation) [S: dev.to and aidevsetup.com articles via search]. Number recognition in hall noise is Sariya's only ASR need; if Kannada on-device is missing, numbers in Hindi/English plus on-screen tap input is the fallback.
15. Background/battery whitelisting for the app: Settings > Battery > "High background power consumption" (allow), Settings > More settings > Applications > Autostart (allow), long-press app icon > App info > Battery > "Not optimized", and lock the app in Recents [V: dontkillmyapp.com/vivo; bbs.vivo.com/in/thread/11952]. Needed so a long scan, TTS and the signing step survive a screen-off.
16. Charging: 100 W to full in 52 min, 60% in 30 min [V: gsmarena review p3]. Bypass charging exists but lives in the Game sidebar (Ultra Game Mode) and only for apps added to Game Space [S: community.iqoo.com/in/thread/131059]. Try adding Sariya to Game Space on day 1 so the stage demo runs on wall power without battery heat.

---

## 3. Risks and mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| OriginOS 6 blocks `adb install` until a vivo account signs in (historic Funtouch behaviour) [U] | medium | Ask organisers at check-in for the loaner's account or a pre-unlocked unit; keep Play-less fallback: "Install via USB" + "Install unknown apps" for Files app, then push the APK over Office Kit file transfer and install from the phone. |
| Venue Wi-Fi: no Gradle, no voice packs | high | §1.3 offline build proven on 8 Oct; download voice packs on a laptop hotspot in minute 45. |
| Tele/ultrawide not exposed to third-party apps | medium | Physics doc already allows the main camera; tele-diameter mode becomes a stretch feature. Decide by minute 25. |
| No manual exposure from `ImageAnalysis` (HAL ignores Camera2Interop) | low-medium | Use AE lock + torch + gyro-gated capture; blur budget in physics.md assumes 1/250 s, verify with `SENSOR_EXPOSURE_TIME` in the result metadata. |
| LiteRT NPU runtime libs need Play delivery or an AI Hub login [U] | medium | Bundle JIT runtime `.so`s in jniLibs; if NPU fails, `Accelerator.GPU` fallback is automatic, and the rubric check only asks you to log which ran. |
| Thermal throttling: GSMArena saw CPU and GPU fall below 50% after ~10 min of stress; iQOO's own test showed 63% Wild Life Extreme stability and 90% CPU-throttle stability [V: m.gsmarena.com/iqoo_15-review-2905p4.php; S: community.iqoo.com/in/thread/128910] | medium during a 5-min demo, high during 48 h of model runs | Scans are short bursts; run inference on NPU not GPU; use bypass charging on stage; keep the phone off the charger pad during the demo (40 W wireless adds heat). |
| StrongBox unavailable on vivo | medium | try/catch fallback to TEE; wording in the pitch: "hardware-backed key with attestation", never "secure element". |
| Kannada on-device ASR missing | medium-high | Hindi/English numbers plus tap entry; Kannada stays on the TTS (output) side, which is supported. |
| Office Kit remote control is too laggy for a terminal | medium | tmux + clipboard sync; pre-write the prompts as files so the phone only sends short commands. |
| Debug build flagged by HackTracker | low | Install the signed `release` build for the final demo; keep debug for development. |
| Android Studio updates itself to an RC on 8 Oct | low | Turn off "Check for updates" after install; keep the DMG. |

---

## 4. Open questions for the organisers (ask on 9 Oct, log in STATE.md)
1. Are loaners pre-signed into a vivo account, and is "Install via USB" already enabled?
2. Does an AI coding agent on the laptop, driven through Office Kit, count as phone-only building in Red Light?
3. Which iQOO model was loaned at the city battles (Reskilll pages only say "flagship iQOO phone") [V: blogs.reskilll.com city-battle pages]; any known camera or adb issues reported by August-September participants? (No public participant reports were found [U].)
4. Does HackTracker read the installed build's debuggable flag or install source?

## Sources (fetched 7 Oct 2026)
- developer.android.com/build/releases/gradle-plugin; developer.android.com/studio/releases; androidstudio.googleblog.com
- kotlinlang.org/docs/releases.html; developer.android.com/develop/ui/compose/bom/bom-mapping; developer.android.com/jetpack/androidx/releases/camera
- repo1.maven.org/maven2/org/opencv/opencv/maven-metadata.xml; dl.google.com/android/maven2/com/google/ai/edge/litert/litert/maven-metadata.xml; repo1.maven.org/maven2/com/qualcomm/qti/qnn-litert-delegate/maven-metadata.xml
- developers.google.com/edge/litert/next/npu; developers.google.com/edge/litert/android/npu/overview; developers.googleblog.com/en/unlocking-peak-performance-on-qualcomm-npu-with-litert/; github.com/google-ai-edge/LiteRT/releases
- docs.gradle.org/current/userguide/command_line_interface.html; developer.android.com/tools/adb; developer.android.com/studio/debug/dev-options; developer.android.com/privacy-and-security/keystore
- gsmarena.com/vivo_iqoo_15_5g-14198.php; m.gsmarena.com/iqoo_15-review-2905p3.php, -2905p4.php, -2905p5.php
- community.iqoo.com/in/thread/128910 (stress test), /131059 (bypass charging), /126712 (Office Kit); vivonewsroom.in/how-vivo-office-kit-is-breaking-cross-device-barriers-for-modern-users/
- developers.google.com/ar/devices; dontkillmyapp.com/vivo; bbs.vivo.com/in/thread/11952
- bajajfinserv.in/how-to-enable-developer-options-in-vivo; coolmuster.com/enable-usb-debugging-on-vivo.html
- researcher.branch.zeropath.com/blog/cve-2026-25277-qualcomm-strongbox-buffer-overflow; sec-certs.org/cc/711f968775366d9d/
- en.wikipedia.org/wiki/Speech_Recognition_%26_Synthesis; groups.google.com/a/android.com/g/camerax-developers/c/BsXJGFjGFQg
- blogs.reskilll.com/iqoo-city-battles-bengaluru-phone-first-ai-hackathon-aug-2026/; blogs.reskilll.com/iqoo-hackathon-2026-india-phone-first-ai-hackathon-iqoo-reskilll/
