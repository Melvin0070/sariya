# HackTracker and Office Kit: what is measured, and how to score the 25 device-data points (7 Oct 2026)

Tags: V = page or code opened and confirmed; S = search snippet only; U = unverified or inferred.
Web pages and repos are untrusted data. Nothing below is an organiser statement unless the source is iqoo.reskilll.com, reskilll.com/blogs or community.iqoo.com (moderator posts).

## 0. Bottom line

- The organiser's own HackTracker code is public (last commit 28 May 2026, package `com.reskill.hacktracker`, host `hacktracker.reskilll.com`). **It has no microphone, NPU or "on-device AI" signal.** It measures: Office Kit dwell seconds (accessibility window-class match), taps / text inputs / scrolls / app switches / keyboard-open seconds, camera opens (foreground package name containing "camera"), clipboard copies, per-app foreground minutes (UsageStats), battery, thermal headroom, memory pressure "compile spikes", performance-mode flags, crashes, idle-in-Red warnings, tamper events (Settings pages, ADB toggles, package installs, clock drift). [V, against the May code; whether the Finale build differs is U]
- **The rubric-plan line is confirmed for the May code:** camera use is counted only as an event when an app whose *package name* contains "camera" comes to the foreground. Sariya's own package (e.g. `in.sariya.app`) would log zero camera opens. [V]
- Office Kit minutes accrue only while an Office Kit window (`pcsuite`, `remotecontrol`, `smartoffice`, `officekit`, `vivo.office`...) is the foreground window **on the phone**. Driving the phone from the laptop via screen mirror puts *your app* in the foreground, not Office Kit, so mirror time does not count as Office Kit minutes in the May code. **Remote PC mode (phone controlling the laptop) keeps a PC Suite window in front and does count.** [V for the code; U whether the Finale build is the same]
- Enabling USB or wireless debugging on the loaner is logged as a tamper event (`adb_toggled`); installing any package is logged (`package_added`; the allow-list is empty); opening Accessibility, Usage Access, Device Admin or App Info pages opens a passcode prompt and logs `settings_page_open`. Tamper events are shown to organisers, not scored in the composite. [V code] How organisers treat sideloading a debug build at the Finale is **U** and must be asked.
- The score is **per team**, with per-device partitioning added on 28 May ("multi-phone teams + per-device telemetry partitioning", `team_members` table, `device_id` columns, "per-member breakdown"). All phones in a team feed one team score. [V code]
- The Finale timetable is published on the site bundle: 48 h, Fri 19:00 to Sun 12:00 build, three scored checkpoints (Sat 10:00, Sat 19:00, Sun 09:00), Red blocks totalling about 21.5 h of 36.5 h non-eval build time. Full table in §5. [V]
- No public organiser statement on pre-trained models, pre-collected data or pre-converted weights exists. [V: searched guide, FAQ, terms, blogs, bundle]

## 1. Findings: HackTracker

### 1.1 Provenance
| Item | Finding | Tag | Source |
|---|---|---|---|
| Repo | `saijadhav369/iQOO-HackTracker-by-Reskilll`; 50 commits; last 2026-05-28 by `PhantomHAX` ("accessibility self-heal; export: per-member breakdown + leaderboard scope"). Cloned and read 7 Oct. | V | https://github.com/saijadhav369/iQOO-HackTracker-by-Reskilll |
| Package | `com.reskill.hacktracker`; app label "HackTracker by Reskill" | V | repo `android/app` |
| Production host | https://hacktracker.reskilll.com/login returns a Next.js page titled "HackTracker", description "Hackathon device usage tracker and admin dashboard" (checked 7 Oct 2026, nginx 1.18) | V | curl |
| Organiser link | Site says loaners arrive "with HackTracker pre-installed and Office Kit already paired"; "HackTracker captures counts and durations only (no keystrokes, screenshots, or browsing)". Reskilll blog uses the same identifier `buildScore` as `web/lib/scoring.ts`. | V | https://iqoo.reskilll.com/guide ; https://reskilll.com/blogs/how-to-prepare-for-iqoo-hackathon-2026-a-complete-guide-for-participants/ |
| Hyderabad | Moderator recap: "Judges combined expert evaluation with data insights from HackTracker" (28 Sep 2026) | V | https://community.iqoo.com/in/thread/173160 |
| No APK, Play listing, docs page or participant score write-up exists publicly | Searched; nothing found | V (absence) | - |
| Caveat | Code predates the city battles by 3 months and was written for the June pilot rubric ("Office Kit usage 25%, HackTracker buildScore"). The city/Finale rubric split that into 15% creative phone use + 10% Office Kit. How the composite maps to the two lines is not public. | U | https://reskilll.com/blogs/how-to-prepare-for-iqoo-hackathon-2026-a-complete-guide-for-participants/ |

### 1.2 What the May code measures (all V, file paths in the repo)
| Signal | Mechanism | Notes for Sariya |
|---|---|---|
| Office Kit seconds | `HackTrackerAccessibilityService.kt`: on `TYPE_WINDOW_STATE_CHANGED`, if `className` contains any of `OFFICE_KIT_CLASS_PATTERNS` = `pcsuite, remotecontrol, smartoffice, officekit, office_kit, vivo.office, smart_office` (case-insensitive), a dwell window opens; closes on the next non-IME, non-SystemUI window. Batched every 60 s as `office_kit_seconds`. Confirmed activity on the test unit: `com.vivo.pcsuite.activity.DeviceListActivity`. | Counts only while an Office Kit screen is in front on the phone. Screen mirroring from the laptop leaves your app in front. Remote PC (phone drives laptop) should keep a `pcsuite`/`remotecontrol` activity in front. |
| Camera opens | Same service: when the foreground package changes and `packageName.contains("camera", ignoreCase = true)`, POST `camera/event` (`event_type: camera_open`). Dashboard shows "Camera N OPENS" and a Camera sort; exports count `cameraOpens`. **Not in the composite.** | Only the system camera (`com.android.camera`, vivo camera) or a third-party app with "camera" in its package name registers. In-app CameraX use in `in.sariya.app` registers nothing. |
| Taps, long-presses, scrolls, text-changed events, app switches, notifications | Accessibility events, counted per app; "Counts events, NOT content". Taps are "Lower on custom-rendered apps". | Compose/Flutter surfaces may under-count taps. Idle detection uses taps only. |
| Keyboard seconds | IME window open time | Typing density = text inputs + keyboard seconds (weight 0.15) |
| Clipboard events | `ClipboardManager.OnPrimaryClipChangedListener`; POST `clipboard/event`; counts only. | Each copy on the phone is an event (Super Clipboard copies on the laptop side are not seen). Not in the composite. |
| App usage minutes | `UsageStatsManager.queryUsageStats(INTERVAL_BEST, last 5 min)` every 5 min; per-package foreground time and label; dashboard pie chart. | This is how organisers can see which app you were in. |
| Vitals | 2 s heartbeat; battery %, charging type, network type, memory, `PowerManager.getThermalHeadroom(10)`, thermal status, `is_game_mode`/`game_plus_mode_key`/`bench_mark_mode` settings ("Performance mode minutes") | Composite rewards drain rate, headroom, SEVERE samples, performance-mode minutes |
| Compile spikes | Server counts jumps > 50 points in memory-pressure between consecutive ~25 s samples | Any heavy on-device work (model load, inference bursts) produces these |
| Crashes | Uncaught-exception handler plus dirty-exit recovery; penalty 0.10 each | Crashes of *any* app are not tracked, only HackTracker's own process; a crashing Sariya build is not a tracker penalty (U: the handler is HackTracker's own) |
| Idle warnings | During Red: heartbeat fresh and 0 taps in 10 min; push "Idle during Red light — Pick up the phone."; penalty 0.10 each; dedupe 10 min | Taps only; scrolling and typing do not reset it |
| Tamper | `settings_page_open`, `adb_toggled` (observer on `Settings.Global.ADB_ENABLED`), `time_drift`, `safe_mode_boot`, `package_added`, `package_removed` (allow-list empty: "every package change during the hackathon is treated as unexpected and logged"), `accessibility_disabled` | Shown as a red badge to organisers. Not in the composite. Sideloading your debug APK every build will log an event each time. |
| Screenshots and face photos | Organiser-requested screenshot via MediaProjection to S3; selfie plus IMEI at registration | Contradicts the site's "no screenshots" line. Whether used at city battles: U |
| Red Light | A 4 dp red strip plus red notification: "visible cue, NOT phone enforcement". Device-owner provisioning can block status bar and quick settings during Red. | A Hyderabad repo padded its HUD below the "HackTracker overlay" (https://github.com/eka1357/SiteSweep_Live) |

### 1.3 Composite "Build Score" (`web/lib/scoring.ts`, V)
Positive contributors min-max normalised across teams, weights: Office Kit minutes 0.30, compile spikes 0.15, typing density 0.15, battery drain rate 0.10, thermal headroom 0.10, hardware redline 0.10, performance-mode minutes 0.10. Penalties: crash count -0.10 each, idle warnings -0.10 each. Floored at 0. Weights overridable per hackathon by SQL. Alternate tabs: Most Active, Most Office Kit, Most Resilient. The site's Finale schedule lists a "Most iQOO Usage award" at city awards ("Winners per bucket, special honours, Most iQOO Usage award") [V, site bundle], which matches this leaderboard.

**What is not measured anywhere in the code:** microphone use, RECORD_AUDIO AppOps, NPU/QNN/NNAPI/LiteRT activity, model runtimes, specific SDKs, keystroke content. [V] The Reskilll blog's claims ("Camera + on-device vision model = high device usage score", "Microphone + on-device speech model = more points", "NPU inference + sensor data = maximum device engagement", https://reskilll.com/blogs/on-device-ai-hackathons-build-local-llms-snapdragon-npu-2026/) either describe a newer build or indirect effects (heat, drain, memory spikes). **U; email question 1.**

### 1.4 Per team or per phone
`0013_multi_phone_teams.sql`: `team_members(team_id, device_id, slot, member_name)`, `device_id` added to `app_usage`, `camera_events`, `clipboard_events` and three more tables; export has "per-member breakdown". Scoring aggregates by `teamId`. So: one score per team, summed across the team's phones. [V code] Implication: three phones all working count three times; a phone left in a bag during Red can trigger an idle warning for the team (the scan is per team heartbeat; U whether it is per device after 0013).

## 2. Findings: Office Kit

| Item | Finding | Tag | Source |
|---|---|---|---|
| Name | "Office Kit" (vivo PC Suite on the phone, `com.vivo.pcsuite`); Mac/Windows app from pc.vivoglobal.com. "Quantum Suite" and "vivo Connect" are not the product name. | V | https://pc.vivoglobal.com/ ; HackTracker `Constants.kt` |
| Laptop OS | "Windows 10 or later · macOS 10.14.6 or later" (organiser site); vivo bundle strings: Windows 10 version 1903 or later; separate Mac downloads for "Apple chip" and "Intel" (so Apple silicon is native); Super Clipboard needs macOS 11.0+; Jovi on Mac needs macOS 12+. PC app V6.0.0+, phone OriginOS 6.0+. | V | iqoo.reskilll.com bundle `Os` object; pc.vivoglobal.com JS strings; https://www.iqoo.com/in/products/iqoo15 |
| Features on iQOO 15 | Screen Mirroring (laptop drives phone; drag files out of vivo Albums and File Manager, "non-Google apps"); Remote PC (phone drives Windows/Mac: "virtual mouse and touchpad controls, along with Privacy Mode" which blanks the PC screen; open files, use apps, power off); Super Clipboard (text and images both ways); cross-device file transfer and folder browse ("no file size or format restrictions", works off-network when signed in to the same account); Task handoff / notes sync; phone camera as scanner for a PC note. Screen extension and "Infinite collaboration" are X Fold only. | V | https://vivonewsroom.in/how-vivo-office-kit-is-breaking-cross-device-barriers-for-modern-users/ ; https://community.iqoo.com/in/thread/126712 ; https://community.iqoo.com/in/thread/128224 |
| Organiser's four named features | "Screen mirror ... Shared clipboard ... File transfer ... Remote control: Laptop keyboard and trackpad driving the phone. Type into the device at full speed during Red Light." | V | iqoo.reskilll.com bundle |
| Can the phone remote-control the laptop? | Yes: Remote PC. vivo documents keyboard/mouse, touchpad and virtual-mouse modes. The organiser's text describes the other direction; nothing in the rules forbids Remote PC. Whether floor staff treat "typing into the laptop through the phone" as allowed in Red is **U** (a Pune team reported losing marks "on the spot" for touching the laptop; see §3). | V/U | as above; https://in.linkedin.com/in/suyogkale (participant posts) |
| Connection | Same vivo/iQOO account on both, same Wi-Fi, phone unlocked; QR scan or USB alternative; vivo warns of "wireless signal interference". | V | pc.vivoglobal.com ; iqoo community 128224 |
| ADB alongside Office Kit | No vivo statement either way. HackTracker logs ADB enable as tamper (`adb_toggled`) and, if device-owner, sets ADB to 0. Expect USB debugging to be off and watched. | V (tracker) / U (policy) | repo |
| SDK or API | None public. Participants stubbed it (Codelore) or "used as the phone-laptop bridge during the event; our code does not call it" (MeshAI). | V | https://github.com/prajwal-gunnala/maynards |
| Known limits | Mirror drag-out only from vivo apps; latency and quality depend on Wi-Fi; no hands-on latency figures found. | S/U | - |

## 3. Findings: finalists' stacks and Red Light practice

City winners and repos (team names V from community.iqoo.com recaps: Bengaluru https://community.iqoo.com/in/thread/169162, Pune 169968, Chennai 171925/171302, Hyderabad 173066/173160/173338; repo matches mostly U, from the earlier research file):

| Team / project | Stack and models | Office Kit / Red Light note | Tag |
|---|---|---|---|
| SecondSense (BLR student winner) | Kotlin; YOLO + Depth-Anything-V2 on Hexagon via QNN, TFLite fallback, Gemma-3-1B via MediaPipe; thermal governor | - | V https://github.com/GargBhavya-tech/secondsense |
| Kavach (BLR student 2nd RU) | repo exists | - | S https://github.com/hardik-mittal-18/IQOO-Hackathon-Kavach |
| MeshAI / Maynards (HYD student winner) | Kotlin + Compose, Rust agent on laptop, llama.cpp; Qwen3-8B 11.8 tok/s on phone; Qwen3-Coder-30B split across laptop + 2 phones | "vivo Office Kit: used as the phone-laptop bridge during the event; our code does not call it"; pre-event intel notes a "Most iQOO Usage" award | V https://github.com/prajwal-gunnala/maynards |
| Nadaka (HYD, placing unknown) | YOLOX int8 NPU, Depth Anything V2 FP16 NPU via LiteRT QNN delegate; Qwen3-VL on llama.cpp; Gemma 4 E2B via LiteRT-LM on GPU; YAMNet; ML Kit OCR | - | V https://github.com/aadityaa0523/iqoo-Hyderabad |
| ResQ (HYD) | Flutter 3.44, flutter_gemma 1.3.0, Gemma 4 E2B via LiteRT-LM; Android STT | "built and tested on iQOO device using Red Light blocks for on-phone-only work" | V https://github.com/kishore-code-create/resq-iqoo2026 |
| Sidecar (HYD, Productivity) | React Native + ExecuTorch, Llama 3.2 3B int4, Whisper, ML Kit OCR; ONNX Runtime + QNN planned | Office Kit clipboard as the whole interface: copy on laptop, answer back on clipboard in ~2 s; file transfer for PDFs; airplane mode, "live byte counter reading zero" | V https://github.com/Naga-Balaji/sidecar-iqoo-hackathon |
| SiteSweep (HYD) | CameraX ~5 fps, 2.7 MB MobileNet uint8 TFLite via LiteRT/NNAPI | HUD padded under "HackTracker overlay"; "Vivo Office Kit Export" bundle for drag-and-drop handoff | V https://github.com/eka1357/SiteSweep_Live |
| Jugaad Agent (CHE student 1st RU) | logs iQOO 15 I2501, SM8850, Android 16, 15.6 GB RAM | - | S https://github.com/Bhavya-Dhoot/Jugaad |
| Other measured numbers | Gemma 4 E2B on GPU via LiteRT-LM ~45 tok/s (FillByVoice); E2B reads a 4-line page in 1.6 s (RedPen); no Gemma 4 SM8850 NPU build, Gemma3-1B has one; MediaPipe LLM is CPU/GPU only | - | S (READMEs, from research/01-hackathon.md §1.5) |

Red Light practice found:
- Floor enforcement: a Pune Top-7 student team says touching the laptop in Red cost marks "on the spot"; another Pune participant describes alternating full-laptop and phone-only stretches with the phone bridged through Office Kit. [S, participant posts surfaced on https://in.linkedin.com/in/suyogkale]
- Pre-event plans assumed ~16.5 h phone-only in 30 h (context_AI); organiser figure is 55% of build time. [S]
- No post-mortem found describing Termux, Claude Code or Codex driven from the phone, or coding the laptop via Remote PC. [V absence]
- "Most iQOO Usage" award: in the organiser's city schedule text and a winner's pre-event notes; no public winner of it named. [V/U]

## 4. Findings: rules on pre-trained models, pre-collected data, prior code

- Guide (V, https://iqoo.reskilll.com/guide): "Original work only: code written during the event window. No shipping a pre-built product." "Open-source libraries and frameworks are fine with attribution; carrying in a completed app is not." "Organisers may verify a project was built inside the event window." "A local or open-source model at the core earns brownie points."
- FAQ Q7 (V): "On-device inference targets the Snapdragon NPU (Sarvam, Gemma, Phi class models)."
- Terms (V, earlier scrape): work "developed for or submitted to another competition" disqualifies.
- Blogs (V): recommend Phi-3, Gemma 2B, Whisper Tiny, llama.cpp, MLCChat; no rule on fine-tuned weights or datasets.
- **No statement on models trained or fine-tuned before the event, converted/quantised weights, or pre-collected data.** Observed practice: pre-event prototype repos exist for placed teams (SenseGuard 6-8 Sep web prototype; Nazar 8 Sep; Jugaad spike; MeshAI design repo 23-24 Sep) with no public penalty. [V repos; U that organisers saw them]
- Site bundle: Finale `submissionDeadline: 2026-10-05T23:59:59+05:30`, `shortlistAnnouncedAt: 2026-10-06T19:15:00+05:30`. [V]

## 5. Findings: Hyderabad results and the Finale

Hyderabad (26-27 Sep, The Hive Gachibowli, 122 participants) [V, https://community.iqoo.com/in/thread/173338, 173066, 173160]:
- WP: 1 Enigma / Ridezz (rider group safety, cellular to Wi-Fi/BLE mesh, on-device hazard detection); 2 The Alchemist / TheraLens (camera, mic, sensors for children's speech and motor therapy); 3 mcLovins / Hush (phones as an offline rescue listening network).
- Students: 1 Maynards / MeshAI (phone + laptop pooled inference); 2 Congnivista / SenseGuard (camera and sensors verify medicines against schedules); 3 On N On / EdgePPG (camera heartbeat liveness for eKYC).
- Jury (site bundle, V): Amit P. (Head of AI, 5day.io), Krishna Gangadhar (Sr Principal Architect, Genpact), Prabhakar Daley (Principal Architect, LTIMindtree), Suman Nandamury (CTO, Colleve).

Grand Finale (site bundle, V; venue "TBA, Bengaluru"; jury not announced: "Mentors and jury are confirmed city by city. The ... lineup goes up here the moment it is locked."):

Agenda: Fri 17:00 registration and device distribution; Fri 19:00 kickoff ("48-hour clock starts. Keynote, jury and mentor intros, Green/Red format and the Office Kit teach-in"); Sat 10:00 Checkpoint 1; Sat 19:00 Checkpoint 2; Sun 09:00 Checkpoint 3 ("Final scored checkpoint before submissions close"); Sun TBC submission cut-off; Sun TBC jury presentations ("Post-lunch. Live pitch to the full jury, demo on the iQOO hardware"); Sun 18:00 results.

Light timetable (`Xx` array in the bundle):

| Day | Window | Light | h |
|---|---|---|---|
| Fri | 19:00-21:00 | Green | 2 |
| Fri | 21:00-00:00 | Red | 3 |
| Sat | 00:00-03:00 | Green | 3 |
| Sat | 03:00-06:00 | Red | 3 |
| Sat | 06:00-08:00 | Green | 2 |
| Sat | 08:00-10:00 | Red | 2 |
| Sat | 10:00-11:00 | Eval 1 | 1 |
| Sat | 11:00-13:00 | Green | 2 |
| Sat | 13:00-15:30 | Red | 2.5 |
| Sat | 15:30-16:30 | Green (mentor round) | 1 |
| Sat | 16:30-19:00 | Red | 2.5 |
| Sat | 19:00-22:00 | Eval 2 | 3 |
| Sat | 22:00-01:00 | Red | 3 |
| Sun | 01:00-06:30 | Green | 5.5 |
| Sun | 06:30-09:00 | Red | 2.5 |
| Sun | 09:00-12:00 | Eval 3 / final build | 3 |

Red 18.5 h, Green 15.5 h, Eval 7 h (Eval blocks are also build time: "final build to 12:00"). The longest Green stretch is Sun 01:00-06:30; the longest Red stretch is Sat 22:00-01:00. Published prize line: "Rs 16L+ sits with the Grand Finale" (blog) versus "₹25 lakh" (press). [V both; conflicting]

## 6. How to maximise the 25 device-data points

Assume the Finale build is the May code plus unknown changes. Design so that every plausible signal moves in your favour, and ask the organisers the questions in §8 on Friday evening at the teach-in.

Office Kit (10%):
1. **Use Remote PC, not only mirror, during every Red block.** In the May code only a foreground Office Kit window on the phone accrues `office_kit_seconds`. Remote PC keeps the phone inside PC Suite while you type on the laptop through it. Mirror leaves your app in front. Do both, but log Remote PC minutes as your floor.
2. Keep one phone parked in an Office Kit screen (file browser, Remote PC) whenever it is not being used for scans. Team minutes sum across devices.
3. Make Office Kit part of the product loop, not just the build loop: bar schedule laptop to phone (file transfer), signed record phone to laptop (file transfer), engineer review on the laptop over mirror, clipboard for the 12-char record hash and the engineer's sign-off code. Each copy on the phone is a clipboard event; each transfer is Office Kit dwell.
4. Open Office Kit on the phone at every Red transition and leave it open across the 60 s batch boundary; a window that closes before a batch flushes still counts (the service adds the open interval at flush).
5. Demo over mirror in all three checkpoints and the final pitch.

Creative phone use (15%):
6. **Camera opens are counted by package name.** Choose an application ID that contains `camera`, e.g. `in.sariya.camera` or `in.sariya.rebarcamera`. This is legitimate (the app is a camera instrument) and costs nothing. Also launch the system camera for reference photos of every prop and every site replay (each launch is a counted camera open). Ask question 2 anyway.
7. Make the in-app scan screen a separate Activity whose class name also contains "Camera" (e.g. `ScanCameraActivity`), in case a newer build matches on className like the Office Kit check.
8. Keep the camera session long and frequent: continuous preview with live bar detection while the user frames, not a single still. Each scan of the demo cage during Red hours is both product testing and telemetry.
9. Microphone: there is no mic signal in the May code, but the blog promises points for it. Use the mic in every scan (spoken drawing numbers, tape readings, "re-scan" confirmation) so that if the Finale build reads AppOps `RECORD_AUDIO` or privacy-indicator events, you have hours of it. Keep an on-device ASR session (IndicConformer) rather than the system speech intent, which would attribute mic use to Google's package.
10. NPU and heat: the composite rewards thermal headroom, SEVERE thermal samples, battery drain and memory-pressure spikes ("rewards how hard the iQOO hardware is pushed"). Run the segmentation model on every preview frame on the NPU, Gemma 4 E2B on the GPU for the spoken fix, and the error-table build (hundreds of synthetic frames) during Red. Do not charge the phone during Red if the team can afford it (drain rate is scored; charging state is reported). Do not enable game or performance modes manually unless an organiser says it is allowed (it is a watched settings key, and Settings pages trigger the passcode gate).
11. Taps and typing: the idle scan counts taps only. During Red, never leave a phone untouched for 10 minutes; scanning, voice and typing notes on the phone all help. Prefer native View-based buttons or Compose with semantics so taps register as `TYPE_VIEW_CLICKED` (the guide says custom-rendered apps under-count).
12. Avoid tamper noise: do not toggle USB/wireless debugging on the loaner; do not open Accessibility or Usage Access settings; expect each APK install to be logged, and tell the organisers in advance that you will sideload builds N times via Office Kit file transfer (question 4). Use a stable applicationId so updates are "app updates" (ignored by the tamper filter) rather than new packages.
13. Crashes: only HackTracker's own crashes are penalised in the code, but a crashing app during a checkpoint costs jury points. Catch exceptions in the camera and model paths.
14. Keep all three loaner phones active: one scanning, one in Remote PC, one running the error-table or Gemma. Team score sums devices.
15. Keep a team log (time, phone, what ran) so the pitch can state "camera open 6 h 40 min, NPU inference 31,000 frames, Office Kit 9 h" from your own numbers in case the tracker export is shown.

## 7. Red Light workflow recommendation

- **Before Friday 19:00 (Green):** pair all phones with the laptop; install Office Kit for Apple silicon; verify Remote PC, Super Clipboard and file transfer; sideload the skeleton app once; set a stable applicationId containing `camera`.
- **Each Red block:** one person on Remote PC from a phone, editing and building on the laptop (Android Studio or Gradle CLI through the mirrored desktop; a terminal window at large font is the most usable); the build output `.apk` moves phone-ward by Office Kit file transfer and is installed from Files. Second phone scans props continuously (camera, mic, NPU). Third phone runs long jobs (error-table replay, Gemma prompts) or sits in Office Kit's file browser.
- Keep Claude Code / Codex running on the laptop; drive it through Remote PC. Keyboard input through Remote PC is the slow part, so prepare prompts and commands as snippets on the phone and paste them through Super Clipboard.
- Do not touch the laptop keyboard during Red; the Pune report says marks were cut on the spot.
- **Each Green block:** everything that needs the laptop directly: model conversion, synthetic data, deck. Green blocks are short (2-3 h) except Sun 01:00-06:30, which is also the sleep window: split the team so one person uses it.
- Charge phones in Green blocks only, if the team accepts the drain-rate trade-off; otherwise charge continuously and ignore the 0.10 drain weight.
- Never leave a phone idle in Red: 10 tap-free minutes raises an organiser alert.

## 8. Open questions for sameera@reskilll.com (send 7 Oct)

1. How does HackTracker at the Finale score "camera, voice, on-device AI"? Does it read camera and microphone use from Android privacy indicators or AppOps for any app, or only from the foreground package? Does it detect NPU use at all?
2. Our app is a camera instrument. Will in-app camera use (CameraX inside our own package) count, or only the system camera? May we name the package with "camera" in it?
3. Office Kit: does "usage" count mirror time (laptop driving the phone) when another app is in front, or only time inside the Office Kit screens on the phone? Does Remote PC (phone driving the laptop) count, and is it allowed during Red?
4. We will sideload debug builds many times by Office Kit file transfer. Each install is logged by HackTracker as a package change. Please confirm this is expected and not treated as tampering. Is USB or wireless debugging allowed at any point?
5. Is the device-data score per team (summed across the team's phones) or per phone averaged?
6. Pre-trained models: we will use open weights (segmentation, Gemma 4 E2B, IndicConformer) converted and quantised before the event, and labelled photos collected this week for the error table. Is a model fine-tuned before the event allowed if the training code and data are disclosed?
7. Finale: confirm the light timetable on the site (Fri 21:00 first Red; Sun 09:00-12:00 final build), the submission cut-off time, and whether Eval blocks are phone-only.
8. Will the Finale jury be published before Friday?

## 9. Sources opened (V)
- https://iqoo.reskilll.com/ (SPA; content read from `/assets/index-CuUjwVRQ.js`): rubric, Office Kit block, city and finale schedules, light timetables, jury lists, dates
- https://iqoo.reskilll.com/guide ; faq.txt (local scrape)
- https://github.com/saijadhav369/iQOO-HackTracker-by-Reskilll (cloned; `SETUP-GUIDE.md`, `web/lib/scoring.ts`, `android/.../HackTrackerAccessibilityService.kt`, `Constants.kt`, `TrackingForegroundService.kt`, `web/lib/db/migrations/0013_multi_phone_teams.sql`)
- https://hacktracker.reskilll.com/login
- https://reskilll.com/blogs/how-to-win-iqoo-city-battles-strategy-guide-phone-first-ai-hackathon/ ; .../how-to-prepare-for-iqoo-hackathon-2026-a-complete-guide-for-participants/ ; .../iqoo-city-battles-vs-regular-hackathons-whats-different-how-to-prepare/ ; .../on-device-ai-hackathons-build-local-llms-snapdragon-npu-2026/ ; .../iqoo-hackathon-2026-india-phone-first-ai-hackathon-iqoo-reskilll/ ; https://blogs.reskilll.com/iqoo-city-battles-grand-finale-48-hour-national-championship-bengaluru-oct-2026/
- https://community.iqoo.com/in/thread/169162 , /169968 , /173066 , /173160 , /173338 , /126712 , /119930 , /128224 , /167130 , /168552
- https://pc.vivoglobal.com/ (JS bundle strings) ; https://vivonewsroom.in/how-vivo-office-kit-is-breaking-cross-device-barriers-for-modern-users/ ; https://www.iqoo.com/in/products/iqoo15
- Repos: prajwal-gunnala/maynards, aadityaa0523/iqoo-Hyderabad, kishore-code-create/resq-iqoo2026, Naga-Balaji/sidecar-iqoo-hackathon, eka1357/SiteSweep_Live, GargBhavya-tech/secondsense, SanTiwari07/Kounter, Viraj281105/SeedheBol (issue 8), tanishque-rangu/hack-tracker (unrelated planner app)
- Not reachable: LinkedIn profile pages (HTTP 999); iqoo-dev.reskilll.com (SPA shell only)
