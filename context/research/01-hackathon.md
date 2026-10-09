# Area 1: The hackathon itself (off-site facts and cross-checks)

> **Second pass added 2026-10-03.** An independent second researcher (Codex, gpt-5.6-terra) added findings and corrections in the "Addendum" section at the end of this file. Where the addendum and the body disagree, the addendum is later; check its source-check status.

Research date: 2026-10-03. Scope: everything off the organiser's own pages, plus cross-checks against them. No product ideas.

**Marking.** `[U]` = not verified against a source I could read. Absence of a listing is not proof of absence and is marked `[U]`.

**Method limits (read first).**
- The session's WebSearch budget ran out part-way. I then tried Brave and Bing by direct fetch. Brave started returning a CAPTCHA (not bypassed). Bing returned only generic iQOO pages. Winner and jury coverage therefore leans on direct page fetches, the iQOO community site, and GitHub.
- LinkedIn: some public posts and profiles loaded without login; many returned HTTP 999. X and Instagram were not loaded. GSMArena, 91mobiles, Smartprix, Gadgets360 blocked automated fetches (GSMArena shows a Turnstile check, not bypassed).
- JS-rendered pages (pc.vivoglobal.com, community.iqoo.com) were read with a headless browser, no login.
- GitHub was read with the `gh` CLI. 967 candidate repos created after 2026-07-15 were pulled; 645 mention iQOO plus hackathon terms; 602 of those have a README.

---

## 1. Loaner phone: model and specs

### 1.1 Which phone

**Finding: iQOO 15 (India model `I2501`, SoC `SM8850`, Android 16 / OriginOS 6). Confidence: high for the four city battles. Expected at the Finale, but no source states the Finale device explicitly `[U]`.** The iQOO launch post and the press release name the iQOO 15 for the series as a whole, not event by event. The recaps give the marketing name only; the code `I2501` comes from participants' device readouts.

| Evidence | Source |
|---|---|
| iQOO's own community recap of every city battle says the challenge was "powered by the iQOO 15" | Bengaluru https://community.iqoo.com/in/thread/169162 (1 Sep 2026); Pune https://community.iqoo.com/in/thread/169968 (8 Sep); Chennai https://community.iqoo.com/in/thread/171930 (21 Sep); Hyderabad https://community.iqoo.com/in/thread/173338 (29 Sep) |
| iQOO Connect Official launch post names iQOO 15 | https://community.iqoo.com/in/thread/167130 (17 Aug 2026) |
| Press release coverage names iQOO 15 | https://www.fonearena.com/blog/489783/iqoo-hackathon-2026-hybrid-mobile-development-challenge.html (18 Aug 2026); https://digitalterminal.in/trending/iqoo-announces-40-lakh-hackathon-for-ai-and-mobile-innovators (19 Aug); https://www.itvoice.in/iqoo-announces-indias-phone-first-hackathon-series-challenging-young-innovators-to-build-ai-powered-solutions-for-real-world-problems-on-mobile (18 Aug) |
| Reskilll blog names iQOO 15 | https://reskilll.com/blogs/iqoo-hackathon-2026-india-phone-first-ai-hackathon-iqoo-reskilll/ (21-22 Aug 2026) |
| Participant repo records device as "iQOO 15 (`vivo I2501`)", Android 16, API 36 | https://github.com/aditya-elite/VibeCall-AI |
| Participant repo: "developed and verified on iQOO I2501, Android 16" | https://github.com/Atul-Chahar/KAVACH_IQOO |
| Participant repo: device table "iQOO 15 (hackathon loaner)", `SM8850`, Android 16, OriginOS 6 | https://github.com/Akash-2176/paper-trail |
| Participant repo: "Built for the loaner iQOO 15 ... (SM8850), Hexagon V81 NPU" | https://github.com/toastx/rankqoo |
| Hyderabad recap describes a winner using "the iQOO 15's camera and sensors" | https://community.iqoo.com/in/thread/173338 |
| Two Pune participants (Top 7 teams) write first-hand that each team was handed "3 loaner iQOO 15s" / "the iQOO 15 flagship" | posts shown on a juror's public page, https://in.linkedin.com/in/suyogkale (read 2026-10-03) |
| vivo's Office Kit model table gives Remote PC to the iQOO flagship series only from "≥iQOO 15"; Z and Neo series do not get it. Red Light as the organiser describes it (driving the laptop from the phone) needs that feature | https://pc.vivoglobal.com/#/supportExternal |

Across 645 participant repos, 82 name "iQOO 15"; 8 name iQOO 13, 3 name iQOO 12, 2 name a non-existent "iQOO 15 Pro" (pre-event guesses). One Hyderabad repo says Android 15 (https://github.com/eka1357/SiteSweep_Live); all hands-on measurements say Android 16.

Not confirmed:
- RAM/storage variant of the loaners: no organiser statement `[U]`. Two placed teams report 16 GB from the device itself: Chennai (Jugaad Agent) logs "I2501 (iQOO 15), `ro.soc.model=SM8850`, Android 16 (API 36), 15.6 GB MemTotal" on three phones (https://github.com/Bhavya-Dhoot/Jugaad, `plans/2026-09-12-federated-on-device-learning.md`); Hyderabad (MeshAI) lists "iQOO 15 #1 alone (SM8850, 16 GB)" (https://github.com/prajwal-gunnala/maynards, `docs/measurements.md`). In India 16 GB is sold only as 16+512 (fonearena launch post). So 16+512 is likely for Chennai and Hyderabad; Bengaluru, Pune and the Finale are not evidenced `[U]`. This matters because only the 16 GB + 512 GB version has LPDDR5X Ultra (official footnote, https://www.iqoo.com/in/products/iqoo15).
- Whether the Finale uses the same fleet `[U]`. iQOO India also sells iQOO 15R (Snapdragon 8 Gen 5) (https://www.iqoo.com/in/products.html, https://shop.iqoo.com/in/products/phone), and Google's ARCore list names an iQOO 15T and iQOO 15 Ultra (see 1.3). None of these is linked to the hackathon in any source found.

### 1.2 Spec table (iQOO 15, India)

| Item | Value | Source |
|---|---|---|
| Model number | I2501 (India/global); V2505A (China) | https://www.iserviceindia.in/model/iqoo-15-i2501 ; https://www.smartprix.com/mobiles/iqoo-15-ppd18y5t1bs0 (search snippet; page itself returned 403); participant readouts above |
| India launch | 26 Nov 2025; sale from 1 Dec 2025 | https://www.fonearena.com/blog/469632/iqoo-15-price-india-specifications.html |
| SoC | Qualcomm Snapdragon 8 Elite Gen 5, 3 nm | https://www.iqoo.com/in/products/param/iqoo15 |
| SoC part / GPU | SM8850 (participants); Adreno 840 | https://github.com/Akash-2176/paper-trail ; https://www.fonearena.com/blog/469632/iqoo-15-price-india-specifications.html |
| NPU | Qualcomm Hexagon NPU. "Hexagon V81" is a participant's label `[U]` | https://github.com/toastx/rankqoo |
| Second chip | "Supercomputing Chip Q3" (graphics: frame interpolation, super resolution) | https://www.iqoo.com/in/products/iqoo15 |
| RAM / storage | 12 GB or 16 GB; 256 GB or 512 GB; UFS 4.1; LPDDR5X Ultra on 16+512 | https://www.iqoo.com/in/products/param/iqoo15 ; https://www.iqoo.com/in/products/iqoo15 |
| OS | OriginOS 6 on Android 16 | https://www.iqoo.com/in/products/param/iqoo15 |
| Update policy | 5 Android OS updates, 7 years security | https://www.fonearena.com/blog/469632/iqoo-15-price-india-specifications.html |
| Main camera | 50 MP Sony IMX921, 1/1.56", f/1.88, OIS | https://www.iqoo.com/in/products/param/iqoo15 ; https://www.iqoo.com/in/products/iqoo15 |
| Ultra-wide | 50 MP, 1/2.76", f/2.05 (fonearena: 150 degrees, f/2.0). Sensor name not given officially | same; https://www.fonearena.com/blog/469632/iqoo-15-price-india-specifications.html |
| Telephoto | 50 MP Sony IMX882, 1/1.95", f/2.65, 3x periscope, OIS, up to 100x digital. The India page says "CIPA 4.0 stabilization" for this lens; vivo's China parameter page (V2505A) states OIS on main and periscope | https://www.iqoo.com/in/products/iqoo15 ; https://www.vivo.com.cn/vivo/param/iqoo15 |
| Front | 32 MP, f/2.2, 90 degree FOV | https://www.iqoo.com/in/products/iqoo15 |
| Focal lengths | Official page shows portrait presets 23/35/50/85/100 mm. Native focal length per lens not published `[U]` | https://www.iqoo.com/in/products/iqoo15 |
| Macro / tele-macro | Not stated on official pages `[U]` | https://www.iqoo.com/in/products/param/iqoo15 |
| Video | 8K30, 4K60 rear; 4K60 front (third-party listing). vivo China (V2505A) confirms up to 8K rear and 4K front; frame rates not given there | https://www.cashify.in/iqoo-15-5g-price-in-india ; https://www.vivo.com.cn/vivo/param/iqoo15 |
| Depth sensor / ToF / LiDAR | None listed on the India parameter or overview pages, nor in vivo China's fuller "other sensors" list for V2505A. Treated as absent `[U]` | https://www.iqoo.com/in/products/param/iqoo15 ; https://www.vivo.com.cn/vivo/param/iqoo15 |
| Laser autofocus | Not listed on either page `[U]` | same |
| Microphones | Count and layout not published `[U]`. "Voice recording: supported" | same |
| Speakers / haptics | Dual stereo speakers; dual-axis (X and Z) vibration motor | https://www.iqoo.com/in/products/iqoo15 |
| IR blaster | Present. India e-store sensor list says "Infrared: Supported"; fonearena lists "infrared sensor"; vivo China lists "红外遥控" (infrared remote control) for V2505A. Carrier frequencies and protocols are not published `[U]` | https://shop.iqoo.com/in/product/2067 ; https://www.fonearena.com/blog/469632/iqoo-15-price-india-specifications.html ; https://www.vivo.com.cn/vivo/param/iqoo15 |
| NFC | Supported | https://www.iqoo.com/in/products/param/iqoo15 |
| UWB | Not listed by any source read. Treated as absent `[U]` | same |
| Sensors (official list) | Accelerometer, ambient light, proximity, e-compass, gyroscope, ultrasonic fingerprint | same |
| Barometer | Not in the India sensor list, not in Cashify's list, and not in vivo China's "other sensors" list for V2505A. Treated as absent `[U]`. One winner's code has a `BarometerMonitor` class, which does not prove the sensor exists | https://www.cashify.in/iqoo-15-5g-price-in-india ; https://www.vivo.com.cn/vivo/param/iqoo15 ; https://github.com/GargBhavya-tech/secondsense |
| Colour temperature / flicker sensors | Not in the India list. India page mentions a "triple ambient light sensor". vivo China lists, for V2505A: front colour-temperature sensor, rear colour-temperature sensor, flicker sensor, Hall sensor. Likely the same hardware on I2501, not confirmed for the India unit `[U]`. A participant doc calls this a "colour spectrum sensor" | https://www.iqoo.com/in/products/iqoo15 ; https://www.vivo.com.cn/vivo/param/iqoo15 ; https://github.com/SanTiwari07/Kounter |
| Connectivity | Wi-Fi 7, Bluetooth 6.0, USB-C (3.2 Gen 1 per fonearena), OTG, dual nano SIM | https://www.iqoo.com/in/products/param/iqoo15 ; fonearena |
| Positioning | GPS, GLONASS, Galileo, BeiDou, NavIC, QZSS; L1+L5 | https://www.iqoo.com/in/products/param/iqoo15 ; fonearena |
| Display | 6.85" AMOLED 3168x1440, 144 Hz, 2600 nits HBM, 6000 nits local peak | https://www.iqoo.com/in/products/iqoo15 |
| Battery / charging | 7000 mAh; 100 W wired; 40 W wireless; bypass charging | same |
| Protection / weight | IP68 + IP69; 216-221 g | same; param page |
| Key storage | A participant reports AES and ECDSA keys at StrongBox level on the iQOO 15 `[U]` | https://github.com/yogeshwars-cys/iqoo-hackathon |

### 1.3 ARCore and Depth API

Checked Google's list directly on 2026-10-03: https://developers.google.com/ar/devices

- The Google Play table has rows for "iQOO 13", "iQOO 15R", "iQOO 15T" (all "Supports Depth API"). It has **no row named "iQOO 15" and no row with code I2501**.
- The China table has "V2505A" (the China iQOO 15 model number) and "iQOO 15 Ultra", both "Supports Depth API".
- The same page says over 88% of active devices support the Depth API as of May 2026, and that certified devices are the ones listed.
- **Status: ARCore support on the Indian iQOO 15 (I2501) is not confirmed by Google's list `[U]`.** If ARCore does run, depth would be depth-from-motion, since no ToF sensor is listed. A row "Vivo I2505" exists; a community model database maps `I2505` to the iQOO Z10R 5G, not the iQOO 15 (https://github.com/KHwang9883/MobileModels, `brands/vivo_global_en.md`). Other iQOO rows on the Play table: 3, 9 Pro, 9T, 11, 11s, 12, Neo9S Pro+, Neo10, Neo11, Neo 10R, and Z7s/Z7x/Z9s/Z9s Pro/Z10/Z10R/Z10X/Z11/Z11 Turbo/Z11S/Z11x.

### 1.4 OriginOS 6 AI features on the device

| Feature | What the vendor says | Source |
|---|---|---|
| AI Creation | Rewrite, generate, summarise, grammar-fix inside DocMaster and Notes | https://www.iqoo.com/in/products/iqoo15 |
| AI Captions | Real-time speech-to-text, translation and text summarisation | same |
| AI Season Change | One-tap season change in photos | same |
| Origin Island | Floating hub; "Copy & go" quick actions; "Drag & go" across apps | same |
| Office Kit | Multi-device workspace (see section 2) | same |
| Jovi (via Office Kit) | "Automated AI office assistant"; remote chat channel that can control the PC; supported in India | https://pc.vivoglobal.com/ |
| Region caveat | Vendor footnote: availability of AI features varies by country | https://www.iqoo.com/in/products/iqoo15 |

Whether each feature runs on-device or in the cloud is not stated `[U]`. Whether Gemini Nano / AICore is exposed on the iQOO 15 is not confirmed; one participant lists it in a planned stack `[U]` (https://github.com/Adit-Jain-srm/DevLens).

### 1.5 What participants measured on the loaner (unaudited, from READMEs)

| Claim | Source |
|---|---|
| Gemma 4 E2B on GPU via LiteRT-LM: about 45 tokens/s; model load 1.5 s | https://github.com/Vishaal21/FillByVoice |
| Gemma E2B (2.6 GB) reads a 4-line page in 1.6 s; E4B (3.7 GB) in 5.1 s. Author says no ready-made Gemma NPU build for SM8850, so GPU was used | https://github.com/Fushiguro6286/RedPen |
| Another author says Google publishes an AOT-compiled per-SoC model for `sm8850` (Gemma 3 1B). The two claims conflict `[U]` (Correction 2026-10-03, addendum check: they do not conflict. `litert-community/Gemma3-1B-IT` lists `Gemma3-1B-IT_q4_ekv1280_sm8850.litertlm`, 693.7 MB; the Gemma 4 E2B and E4B repos have no SM8850 file. See 02.) | https://github.com/harshwardhan-kp/smriti |
| SmolLM2-1.7B Q4_K_M on llama.cpp GPU: about 10.5 tok/s end to end. NPU path exported but "not yet confirmed on the phone" | https://github.com/yogeshwars-cys/iqoo-hackathon |
| YOLO + Depth-Anything-V2 on Hexagon NPU via QNN reported "working" on the iQOO 15 | https://github.com/GargBhavya-tech/secondsense |
| Qualcomm GenieX runtime with `qairt` targeted for a VLM and Whisper | https://github.com/Akash-2176/paper-trail |
| AI Hub Genie bundle Qwen3-4B-Instruct-2507 for SM8850 | https://github.com/SaiSrinidhiT/IQOO-Recall |
| Gemma 4 E2B on GPU, FastVLM `sm8850` on NPU, Qwen 0.5B CPU fallback | https://github.com/AkashMedishetty/Saathi |
| MediaPipe LLM path runs on CPU/GPU, not the NPU | https://github.com/SachinKumar-A/IQOO-Edith |

---

## 2. Sponsor tools

### 2.1 vivo Office Kit

Sources: https://pc.vivoglobal.com/ and its "Supported models" and "Connect to PC" views (read 2026-10-03); https://www.iqoo.com/in/products/iqoo15.

| Feature | What it does | Limits |
|---|---|---|
| Screen Mirroring | Phone screen appears on the PC and is driven from the PC. Drag images/files out of the mirrored Albums and File Manager apps. Open and edit phone documents with PC software | Drag-out works in vivo Albums and File Manager ("non-Google apps") |
| Remote PC | Phone controls the Windows or Mac computer remotely: editing, app operation, shutdown; two-way file transfer; keyboard/mouse, touchpad and virtual mouse modes; privacy mode blanks the PC screen | Windows 10+, macOS 10.14.6+. Phone side: vivo X series and iQOO flagship (iQOO 15 and later) |
| Super Clipboard | Shared copy/paste of text and images | macOS 11.0+ for Mac |
| Cross-device file transfer / File EasyShare | Browse phone folders from the PC; transfer files and folders. iQOO says it works even when devices are on different networks if signed in to the same account | No size or format limit is stated by vivo. The organiser page claims "no size limit" |
| Notes sync and handoff | Notes sync across devices; phone can act as camera/scanner for a note being edited on the PC | |
| Task handoff / camera share | Phone camera used by the PC; photos and screenshots sync instantly | Live-streaming mode only on vivo X500 Pro models; camera share depends on third-party app support |
| Screen extension, Infinite collaboration | Phone as second display; one keyboard and mouse across both | vivo X Fold series only. Not available on iQOO 15 |
| Jovi | AI assistant with a remote channel to the PC | iQOO 15 series supported; India is on the supported-region list |

Requirements and mechanics:
- PC app V6.0 or later; phone on OriginOS 6 or later (https://www.iqoo.com/in/products/iqoo15).
- Windows 10 or later; macOS 10.14.6 or later (Apple-silicon and Intel builds); an iPad app exists.
- Connection: sign in to the same vivo/iQOO account on both, same network, phone unlocked; then auto-connect. Scan-to-connect and USB are alternatives. On Windows, Bluetooth plus Wi-Fi can be used.
- vivo warns that mirroring quality and transfer speed "may be affected due to wireless signal interference around the device". vivo does not mention venues; a crowded hall is an inference from that footnote.
- Jovi on a Mac needs macOS 12.0 or later; screen extension on Windows needs Windows 10 version 1903 or later (vivo's supported-models table).
- On the phone, opening Office Kit surfaces vivo PC Suite (`com.vivo.pcsuite.activity.DeviceListActivity`) on the organiser's test unit (https://github.com/saijadhav369/iQOO-HackTracker-by-Reskilll, SETUP-GUIDE.md).
- No public Office Kit SDK or API was found. Participants say the same and stubbed it (https://github.com/DE9856/Codelore) `[U]`.

Direction check: the organiser page describes Red Light as mirroring and driving through Office Kit. vivo documents both directions: Screen Mirroring (PC drives phone) and Remote PC (phone drives PC).

### 2.2 HackTracker

**Lead checked and it holds, with caveats.** Repo: https://github.com/saijadhav369/iQOO-HackTracker-by-Reskilll

Provenance:
- Created 2026-05-22; 50 commits from 2026-04-11 ("Initial release: HackTracker by Reskill") to 2026-05-28. No commits after 28 May. 0 stars, personal account, no licence.
- Three commit identities: `sameerkatte`, `PhantomHAX`, `Sai Jadhav`. The guide points to an upstream `sam25kat/iQOO-HackTracker-by-Reskilll`, which returns 404 (private or removed).
- Android package `com.reskill.hacktracker`. The guide names the production host `hacktracker.reskilll.com`; https://hacktracker.reskilll.com/login returns HTTP 200 with title "HackTracker" (checked 2026-10-03).
- Two more links to the organiser. Reskilll's pilot blog calls the Office Kit score "HackTracker buildScore", the same identifier the repo's `web/lib/scoring.ts` uses. A Pune juror's post thanks "Sameer Katte" among the organising crew, which matches the main commit identity (posts on https://in.linkedin.com/in/suyogkale). Against that: the commit email addresses are not reskilll.com addresses, and nothing on the organiser site links to this repo.
- **Assessment: very likely the real organiser tool as of late May 2026, on a reskilll.com subdomain. It is not an official published spec. It predates the city battles by three months, so weights and signals may have changed `[U]`.**

What the app records (SETUP-GUIDE.md Part 4 and the Kotlin DTOs):

| Signal | How | Notes |
|---|---|---|
| Taps, long presses, scrolls | AccessibilityService events | Counts only; per-app counts are kept |
| Text inputs | `TYPE_VIEW_TEXT_CHANGED` | Counts events, not content; plus keyboard-open seconds |
| App switches, foreground app | Window state changes; one batch per 60 s | App package names are recorded |
| Office Kit time | Seconds the Office Kit window is in the foreground on the phone, matched by window class name (`pcsuite`, `remotecontrol`, `smartoffice`, `officekit`, ...) | This is dwell time, not bytes or actions |
| Camera opens | Fires when the foreground package name contains "camera" | In this version an app using the camera inside its own package would not register `[U for production]` |
| Clipboard events, notifications | Listener counts | Counts only |
| Device vitals | Battery %, battery temperature, RAM, charging state and source, thermal status, thermal headroom, network type, signal, data since boot; heartbeat | |
| Motion / environment | Accelerometer, gyro, magnetometer, light, proximity, step counter, aggregated per 60 s | |
| Performance mode | Polls `is_game_mode`, `game_plus_mode_key`, `bench_mark_mode` | |
| Crashes | Tracker's own crash log and "recovered dirty" restarts | |
| Tamper events | Settings pages opened, ADB toggled, clock drift over 5 s, safe-mode boot, package installed/removed, accessibility disabled | The package allow-list is empty in code, so any install is logged. How organisers treat a team installing its own APK is unknown `[U]` |

No microphone, speech, NPU or model-inference signal exists anywhere in this code. Checked by search over every Kotlin, TypeScript, SQL, XML and Markdown file in the repo: zero hits for microphone, `RECORD_AUDIO`, `AudioRecord`, speech, voice, NPU, NNAPI, TFLite, QNN or inference. The manifest requests no audio or camera permission for tracking (the camera appears only in the organiser's face-photo capture at registration).

Composite "Build Score" in the repo. The weights are in code (`DEFAULT_WEIGHTS` in `web/lib/scoring.ts`) and repeated in `SETUP-GUIDE.md`; positive contributors are min-max normalised across teams and sum to 1.00, penalties are raw count times weight, and the displayed score is floored at 0:

| Contributor | Weight |
|---|---|
| Office Kit minutes | 0.30 |
| Compile spikes (jumps over 50 points in the memory-pressure usage signal between consecutive samples about 25 s apart; `web/app/api/hackathon/[id]/leaderboard/route.ts`) | 0.15 |
| Typing density (text inputs + keyboard seconds) | 0.15 |
| Battery drain rate (% per observed hour; faster drain scores higher) | 0.10 |
| Thermal headroom (maximum `getThermalHeadroom()` seen; the code comment says "higher = closer to throttle = more intense", so a hotter phone scores higher) | 0.10 |
| Hardware redline (samples at thermal status SEVERE or above) | 0.10 |
| Performance-mode minutes | 0.10 |
| Crash count | -0.10 each |
| Idle warnings | -0.10 each |

The guide describes the composite in one line: it "rewards how hard the iQOO hardware is pushed". Weights can be overridden per hackathon by SQL. **How this maps to the published "creative phone use 15% (camera, voice, on-device AI)" and "Office Kit usage 10%" is not public `[U]`.** Camera opens are tracked and shown as a dashboard sort key (`web/components/live-grid.tsx`) but are not in this composite.

Reskilll's own blog gives a different account of the 15%, with no mechanism. It tells entrants that a camera with an on-device vision model earns a high device-usage score, a microphone with an on-device speech model earns more, and NPU inference with sensor data earns the most, and that cloud-only apps miss the whole 15% (https://reskilll.com/blogs/on-device-ai-hackathons-build-local-llms-snapdragon-npu-2026/, 17 Aug 2026). Nothing in the May code measures microphone or NPU use directly. Either the production build changed after May, or the blog is describing indirect effects (battery, heat, memory pressure). Unresolved `[U]`.

Other behaviour in the repo:
- Red Light is "a visible cue only": a thin red strip at the top of the screen and a red notification. Phones are not locked. A Hyderabad team coded around a "HackTracker overlay" at the top of the screen, which matches (https://github.com/eka1357/SiteSweep_Live).
- Idle warning during Red: heartbeat fresh and zero taps in 10 minutes triggers a phone notification and an organiser alert, at most once per 10 minutes per team. It also costs score in the composite. The guide says the scanner runs only while an organiser has the dashboard open, unless a cron job is set up. In code the test counts taps only (`web/lib/idle-scan.ts` sums `event_batches.taps`); scrolls and text inputs do not reset it, and the guide rates tap capture as weaker in custom-rendered apps.
- If provisioned as device-owner, the status bar and quick settings are blocked during Red.
- Organiser passcode gates Accessibility, Usage Access, Device Admin and App Info settings pages.
- **Privacy inconsistency.** The guide's privacy section and the organiser site say no screenshots. The same repo has a screenshot feature (organiser request button, S3 storage, a Screenshots tab) and face-photo capture at team registration. Whether these were used at city battles is unknown `[U]`.

Other statements about HackTracker:
- An iQOO community moderator wrote that Hyderabad judges combined expert evaluation with HackTracker data (https://community.iqoo.com/in/thread/173160, 28 Sep 2026).
- Reskilll blog: "You can't fake it"; 25% comes from device data (https://reskilll.com/blogs/how-to-win-iqoo-city-battles-strategy-guide-phone-first-ai-hackathon/, 17 Aug 2026).
- In the June pilot (section 8) the rubric line was "iQOO Office Kit Usage (25%) — HackTracker buildScore. More phone-bridge time = more points" (https://reskilll.com/blogs/how-to-prepare-for-iqoo-hackathon-2026-a-complete-guide-for-participants/, 29 May 2026).
- No participant write-up describing their actual HackTracker score was found.
- A Hyderabad winner's pre-event notes mention a "Most iQOO Usage" award at city battles (https://github.com/prajwal-gunnala/maynards, `docs/pre-event/handoff/reference/iQOO_Hackathon_Intel.md`). Not on the organiser site `[U]`.

### 2.3 Free AI credits

- Provider: **not named in any source found `[U]`.**
- Reskilll says iQOO provides "the hardware, AI credits, and the phone-first challenge format" (https://reskilll.com/blogs/iqoo-hackathon-2026-india-phone-first-ai-hackathon-iqoo-reskilll/).
- The only amount found is for the June pilot: "$25 free AI credits per team" (https://reskilll.com/blogs/how-to-prepare-for-iqoo-hackathon-2026-a-complete-guide-for-participants/). Not confirmed for city battles or the Finale `[U]`.
- No participant README names the credit provider. Several city repos call OpenRouter or Gemini with their own keys, which proves nothing about the sponsor credits.

### 2.4 Qualcomm

- Kartikey Rawat, Senior Developer Advocate at Qualcomm, was a Bengaluru mentor (organiser site). His public profile centres on edge AI and running on-device AI on Qualcomm hardware; no public post about the event was visible (https://in.linkedin.com/in/carrycooldude).
- iQOO's product page calls the SoC co-engineered by iQOO and Qualcomm (https://www.iqoo.com/in/products/iqoo15).
- No press item or organiser page names Qualcomm as a sponsor or partner of the hackathon `[U]`.
- Participants used Qualcomm AI Hub, GenieX, QNN and ExecuTorch-QNN on the loaner (section 1.5).

### 2.5 Sarvam

- The only link is the organiser FAQ line listing "Sarvam, Gemma, Phi class models".
- No press item, Reskilll blog or iQOO post names Sarvam as partner, mentor or credit provider `[U]`.
- A handful of participant repos call Sarvam APIs or plan Sarvam-1 on device (e.g. https://github.com/Subramanyarao11/pocketqa, https://github.com/Yeswant369/sahayak).

---

## 3. City-round winners and other projects

### 3.1 Official winners (24 of 24 found)

Source for all rows unless noted: the iQOO Connect Official recap threads. Bengaluru https://community.iqoo.com/in/thread/169162 ; Pune https://community.iqoo.com/in/thread/169968 ; Chennai https://community.iqoo.com/in/thread/171930 ; Hyderabad https://community.iqoo.com/in/thread/173338. Every recap says all six teams get a "Wild Card entry" to the Finale. Tracks are not given in the recaps; a track is filled only where a repo states it.

| City | Bucket / place | Team | Project | One line (paraphrased) | Track | Repo | Extra source |
|---|---|---|---|---|---|---|---|
| Bengaluru | WP winner | Tokoti | Tokito Companion | Phone as an AI interface to inspect and debug physical circuits with camera, voice, multimodal AI | `[U]` | not found | |
| Bengaluru | WP 1st RU | ZXRO 77 | Mira.ai | On-device wellness coach giving real-time yoga guidance from vision, voice and memory | `[U]` | https://github.com/ps-swarooppadala/MiraAI2 (probable: 20 commits all on 29 Aug; repo description "iQOO hackathon 2026 Winning Submission"; no README; code has yoga pose assessors, voice output, a memory graph and an `iqoo` build flavour; team not named) `[U]` | |
| Bengaluru | WP 2nd RU | Chai and Code | PhoneOS AI | Phone agent that understands, searches and runs multi-step tasks across apps, files and device functions from natural language | `[U]` | not found. (https://github.com/slendermancodes/PhoneOS is an empty repo created 29 Aug with no commits, description or README; it is a name coincidence, not evidence) | |
| Bengaluru | Student winner | Chole Bhature | SecondSense | Camera, audio and haptics help blind users detect obstacles beyond a white cane, offline | `[U]` | https://github.com/GargBhavya-tech/secondsense (matched on name, description and 29-30 Aug commits; README does not name the team) | |
| Bengaluru | Student 1st RU | Nexus | Anchor | Checks whether the phone's location can be trusted by cross-checking GNSS with sensors and on-device AI | `[U]` | not found | |
| Bengaluru | Student 2nd RU | Smoke Test | Kavach | On-device detection of scam patterns in live conversations; flags risky UPI QR codes and links | FinTech and Commerce (per repo) | https://github.com/Atul-Chahar/KAVACH_IQOO (probable; 51 commits on 29-30 Aug; README names the team "Kavach", not "Smoke Test"; a second repo with the same project name exists, https://github.com/adityashelke04/Kavach-iqoo_hackathon) `[U]` | Juror repost about Team Smoke Test: https://in.linkedin.com/in/pradipta-dash |
| Pune | WP winner | Chord Capital | Jammify | Solo music practice with manual or AI-generated chords and instruments | `[U]` | not found | https://community.iqoo.com/in/thread/170203 |
| Pune | WP 1st RU | Merge Conflicts | Pune Tree Rakshak | Recap: turns citizens into tree-protection watchdogs by combining AI-verified evidence, government data and automated legal reporting. Team member's post adds: point the camera at a tree, AI reads the risk (lean, root damage, disease), a report goes to the municipal corporation (PMC) | `[U]` | not found | https://www.linkedin.com/posts/reuben-anthony07_iqoohackathon-reskilll-hackathon-activity-7502976610359402496-_RLz |
| Pune | WP 2nd RU | Knoxx | DailyFlow | Private on-device memory layer for commitments, requests and deadlines | `[U]` | not found | |
| Pune | Student winner | Redstring | RightPosture | Pose tracking gives live physiotherapy feedback; physios monitor remotely | `[U]` | not found | |
| Pune | Student 1st RU | Kensai | NoCapRX | Genomics, pharmacogenomics, prescription OCR and explainable AI for medication-safety insights to discuss with a clinician | `[U]` | https://github.com/parthsarode0506/NoCapRX (matched on repo name and 5-6 Sep commits; README is titled "PharmaGuard (OnDeviceRx)", says it was built "for the RIFT / iQOO Hackathon tracks", and does not name the team) | |
| Pune | Student 2nd RU | Chanakya | Origo | Motion sensors remember the walk from your car and guide you back, no GPS or camera | `[U]` | not found | |
| Chennai | WP winner | Just Us | Nila | On-device baby monitor: cry detection, movement, safety risks | `[U]` | not found | https://community.iqoo.com/in/thread/171925 |
| Chennai | WP 1st RU | One Man | Nazar | On-device scam protection for messages and calls with a warning before payment | `[U]` | https://github.com/ta1rc/iqoo-Chennai (probable; pre-event prototype dated 8 Sep) `[U]` | |
| Chennai | WP 2nd RU | DHANESHVAR's SQUAD | Assemblix | Camera identifies hardware parts and guides assembly/repair with 3D and voice | `[U]` | not found | |
| Chennai | Student winner | Atreides | Consent-Cam | Camera that detects nearby consent signals and hides faces, on-device | `[U]` | not found | https://community.iqoo.com/in/thread/171302 |
| Chennai | Student 1st RU | Apple | Jugaad Agent | Phone sensors as a predictive-maintenance tool: 13 machine types, 58 faults | `[U]` | https://github.com/Bhavya-Dhoot/Jugaad ; https://github.com/vj-io/jugaad ; pre-event spike https://github.com/black1plague2/jugaad-agent (all three carry the same README, which states 13 machine types and 58 faults; team not named) | |
| Chennai | Student 2nd RU | LeadMillers | Saathi | Offline PCOS symptom tracker with local sharing to family and doctors | HealthTech (per repo) | https://github.com/shaswatnaman/saathi-pcos (README: "Team leadmilers") | |
| Hyderabad | WP winner | Enigma | Ridezz | Rider group safety; falls back from cellular to Wi-Fi/BLE mesh; on-device hazard detection | `[U]` | not found | https://community.iqoo.com/in/thread/173066 |
| Hyderabad | WP 1st RU | The Alchemist | TheraLens | Camera, mic and sensors guide speech and motor exercises for children | `[U]` | not found | |
| Hyderabad | WP 2nd RU | mcLovins | Hush | Phones form an offline listening network to find voices, taps and whistles after disasters | `[U]` | https://github.com/uday-krishna-p/Hush-Iqoo-Hackathon (probable; 100+ commits on 26-27 Sep; two-line README; package `com.hush` with tap, knock, direction-of-arrival and SOS code; team not named) `[U]` | |
| Hyderabad | Student winner | Maynards | MeshAI | Phone and laptop pool memory to run models neither can alone | Developer Tools (per repo) | https://github.com/prajwal-gunnala/maynards (event repo, names the team) ; https://github.com/uvabd17/MeshAI-IQOO (pre-event design repo, 23-24 Sep) | https://community.iqoo.com/in/thread/173160 |
| Hyderabad | Student 1st RU | Congnivista | SenseGuard | Camera and sensors identify medicines and check them against schedules: PASS / WARNING / UNKNOWN | `[U]` | https://github.com/aadityaa0523/senseguard (pre-hardware web prototype, 6-8 Sep; README names Team Congnivista; the event build is not public) | |
| Hyderabad | Student 2nd RU | On N On | EdgePPG | Camera heartbeat detection and optical challenges for liveness in eKYC | `[U]` | https://github.com/sarandevu/TeamON_N_ON (repo name is the team; description "EdgePPG"; created 27 Sep) | |

Counts: 24 winners identified; repos matched for 11. Seven are firm, of which four name the team (Saathi, MeshAI, SenseGuard, EdgePPG) and three rest on project name, dates and matching description (SecondSense, NoCapRX, Jugaad Agent). Four are probable: Mira.ai, Kavach, Nazar, Hush. PhoneOS AI has no usable repo. For SenseGuard and Nazar the public repo is a pre-event prototype, not the build that placed.

Patterns visible in the 24 (facts, not advice): 20 of 24 official descriptions explicitly name a phone sensor or on-device/offline/local AI; the four that do not are PhoneOS AI, Jammify, Pune Tree Rakshak and NoCapRX. Health, body or care appears in 7 (Mira.ai, RightPosture, NoCapRX, Nila, Saathi, TheraLens, SenseGuard). Scam/fraud appears in 3 (Kavach, Nazar, EdgePPG). Assistive or safety appears in 4 (SecondSense, Hush, Ridezz, Consent-Cam). Only 2 are developer-facing (Tokito Companion, MeshAI). Attendance per city: 115, 105, 128, 122 participants.

Other facts from the recaps:
- Venues: WeWork Galaxy (Bengaluru), WeWork EON IT Park (Pune), The Hive OMR (Chennai), The Hive Gachibowli (Hyderabad).
- Pune prize cheques matched the published split (https://community.iqoo.com/in/thread/170203).
- "Special Honour" awards were announced in the press release, but no recipient is named anywhere found `[U]`. No "standout beyond Top 6" Finale slots are named `[U]`.

### 3.2 Other projects on GitHub (for collision testing)

Scale: 645 relevant repos; 116 were created on the four event weekends (Bengaluru 36, Pune 31, Chennai 24, Hyderabad 25). Many others are Phase 1 idea-screening prototypes. Rough keyword clusters over all 645 (regex on description plus README opening; noisy, treat as order of magnitude):

| Cluster | Repos (approx.) | Examples |
|---|---|---|
| Tutor / study / classroom | 50-60 | https://github.com/adarshoff/Slate ; https://github.com/a-145198/edupulse_iqoo |
| Physio / rehab / posture / fitness | 40-60 | https://github.com/RutRaut25/kinesix-ai-edge ; https://github.com/SaiPrashanth1602/ACL-Rehab-AI-Prototype ; https://github.com/Team-LunaIQOO/Duo |
| Scam / fraud / UPI safety | about 37 | https://github.com/AshThe25/RUKO ; https://github.com/manaswini1877/PocketAudit ; https://github.com/Wknd-0424/chetaka ; https://github.com/abhinavyepuri/IQOO_Hackathon ; https://github.com/adityashelke04/Kavach-iqoo_hackathon |
| Phone-side code debugging / review | about 37 | https://github.com/AJAYMYTH/IQOO-Hackathon-2026 ; https://github.com/Gurumurthys1/GLANCE_IQOO ; https://github.com/pavansai20052004-hue/pocketpilot-city-battle-2026 ; https://github.com/Pragnyayelisetti/PatchCam ; https://github.com/Subramanyarao11/pocketqa |
| Disaster / SOS / offline mesh | about 32 | https://github.com/tanishqtadas-ops/LifeLine ; https://github.com/swapnil-1310/sahaayak-offline-emergency-assistant ; https://github.com/harshtakalkar037-boop/disastermesh |
| Voice note / meeting to tasks | about 22 | https://github.com/Saatvick-Y/Distil ; https://github.com/Dharanish99/SunoDo ; https://github.com/neeraj17-p/AirScribe-Studio |
| Navigation / rider / driver | about 22 | https://github.com/inslot2525-ctrl/EyesUp ; https://github.com/CodeWithRJ006/rakshak |
| Personal memory / recall / document search | about 18 | https://github.com/SaiSrinidhiT/IQOO-Recall ; https://github.com/sanjay1046/total-recall ; https://github.com/Nagul55/IQOO-Hackathon ; https://github.com/codewithpraw/Revia |
| Assistive for blind / low vision | about 16 | https://github.com/buvanesh2406/iqoo-hackathon-app ; https://github.com/M-L-Arjun/drishti-ai |
| Bill / receipt / form / document | about 16 | https://github.com/Vishaal21/FillByVoice ; https://github.com/Akash-2176/paper-trail ; https://github.com/Yasaswini-ch/bill-compliance-scanner |
| Medication / prescription | about 15 | https://github.com/sohail9972/IQOO_Hackthon_2026 ; https://github.com/DG10911/marunthu |
| Kirana / shop ledger / shelf | about 13 | https://github.com/ARCHIT3024/ShelfSense ; https://github.com/SanTiwari07/Kounter (Finale entry) ; https://github.com/notsravan/dukaan-saathi |
| Privacy camera / redaction | about 12 | https://github.com/JEN-chad/IQOO-2026-Hackathon ; https://github.com/balapraharsha/obscura-iqoo ; https://github.com/gokulrajmisox/PrivacyFirewall |
| Elderly companion / phone help | about 11 | https://github.com/AkashMedishetty/Saathi ; https://github.com/sharvilmane1216/iqoo-hackathon |
| Machine / site / structural inspection | about 9 | https://github.com/eka1357/SiteSweep_Live ; https://github.com/manasareddycherukupalli-cyber/safetyeye-live |
| Sign language | about 7 | https://github.com/PiSquareLabs/Mudra ; https://github.com/nish1621/SignBridge |
| Phone + laptop co-processor / compute pooling | about 7 | https://github.com/Naga-Balaji/sidecar-iqoo-hackathon ; https://github.com/yogeshwars-cys/iqoo-hackathon |
| Human approval layer for coding agents | about 7 | https://github.com/SRIVASTAVASRIHARSHA/AgentGate ; https://github.com/varunearle/-AgentGate |
| Smart home / IR control | about 3 | https://github.com/muhammedsayeedurrahman/smartlease-edge-chennai ; https://github.com/Rakshi2609/dayloop |

Notable non-winning or unplaced builds made on event weekends:

| City | Repo | What it is |
|---|---|---|
| Bengaluru | https://github.com/DikshitReddy/Arokya---iQoo-Blr-Hackathon | On-device health coach, Gemma 4 E2B on LiteRT-LM; rule engine owns every number |
| Bengaluru | https://github.com/vinodyallur/keelcat-mobile | On-device API-compatibility maintenance for code |
| Bengaluru | https://github.com/Vishallakshmikanthan/Trace | Tamper-resistant on-device evidence capture |
| Bengaluru | https://github.com/Sohan-spec/IQOO_hack | UPI payment verification from merchant notifications |
| Pune | https://github.com/Physics0070/RetinaSight-Android | On-device diabetic retinopathy grading, spoken in 11 languages |
| Pune | https://github.com/zahy294/kinetrak-core | Phone as 6-DOF controller for CAD via Office Kit |
| Pune | https://github.com/h55n/lumi | Multilingual voice-first on-screen guidance |
| Chennai | https://github.com/PiSquareLabs/Mudra | On-device ASL input accelerator (author states they qualified for the Finale; unverified `[U]`) |
| Chennai | https://github.com/SachinKumar-A/IQOO-Edith | Agent turning mail, messages, documents into plans in Tamil/Hindi/English |
| Chennai | https://github.com/toastx/rankqoo | On-device AEO/GEO optimisation engine |
| Chennai | https://github.com/sohail9972/IQOO_Hackthon_2026 | Polypharmacy risk from prescriptions, 13 languages |
| Hyderabad | https://github.com/Vishaal21/FillByVoice | Paper bank form to spoken Hindi/English conversation to filled form |
| Hyderabad | https://github.com/Fushiguro6286/RedPen | On-device handwritten maths checking with Gemma 4 |
| Hyderabad | https://github.com/SOURABREDDY394/twingaze | Hidden-camera finder using phone sensors |
| Hyderabad | https://github.com/rohith-kantipudi7/Real-Play | Offline phone-native physical game engine |
| Hyderabad | https://github.com/prabii/worldjam | Record real sounds; on-device AI turns them into music |
| Hyderabad | https://github.com/Maheswar-Sah00/GOLDENHOUR | Offline stroke screening in three tests |

Public Finale-targeted repos already visible: https://github.com/SanTiwari07/Kounter (kirana delivery audit, IR blaster, Hindi voice), https://github.com/sujay2520/festival-guardian (crowd safety with mesh alerts), https://github.com/Anjali112005/TrustLens-IQOO-HACKATHON (Community App track), https://github.com/sanjuhs/iqoo-focuspilot (Productivity), https://github.com/Sid7on1/BimaxApk.

Devpost: not searched successfully (search budget exhausted). No Devpost page for this event was seen in any result `[U]`.

---

## 4. Participant write-ups: screening, enforcement, judging

### 4.1 Idea-screening form and process

- Registration steps, per a community guide (https://community.iqoo.com/in/thread/167073, 17 Aug 2026): create account and verify email; pick Student or Working Professional; profile (phone, college or employer, city; LinkedIn and GitHub optional); choose one or more city battles and confirm overnight availability; then from the dashboard form a team of 1-3 or go solo, pick a problem statement, and submit a "Phase 1" idea before the dashboard deadline. Registering is not shortlisting.
- Organiser FAQ gives the screening criteria: novelty, tech impact, problem choice, scope fit for the time box, phone-first fit.
- What the form asked, from participant repos (indirect evidence): a "Prototype URL" field (https://github.com/nish1621/SignBridge); a deck in PDF/PPT, a video walkthrough, and a write-up covering description, what makes the team stand out, and prior builds (https://github.com/harshit-codes18/iqoo-hackathon-health-app); a 12-slide Phase 1 deck (https://github.com/WaifuPuller/NodLatch). Exact field list and limits are behind login `[U]`.
- Many teams shipped a working prototype for screening and said the event build would start from zero (e.g. https://github.com/Shaik-Althaf-Techazsure/Iqoo_Pune, https://github.com/Naga-Balaji/sidecar-iqoo-hackathon).
- One Chennai repo description claims qualification "from 13,000+ participants" (https://github.com/PiSquareLabs/Mudra). Two Pune participants independently give "6,500+" registrations or entries for Pune, one adding "2500+ teams", "22 finalists" and a Top 7 that presented to the jury in the student track (posts shown on https://in.linkedin.com/in/suyogkale). No official applicant count was found `[U]`. Official on-floor counts are 105-128 per city. The organiser home page says "1000+ builders" across the four weekends.
- Idea deadlines for city battles fell four to five days before each event: 25 Aug, 1 Sep, 8 Sep, and 22 Sep 23:59:59 IST for Hyderabad, per a Hyderabad winner's pre-event notes that say they were read from the portal (https://github.com/prajwal-gunnala/maynards, `docs/pre-event/handoff/reference/iQOO_Hackathon_Intel.md`, compiled 22 Sep 2026) `[U]`.

### 4.2 Red Light / Green Light enforcement

- One first-hand account of floor enforcement, from a Pune Top 7 student team: during Red, touching the laptop cost marks "on the spot", and the team felt nervous each time they reached for it. How marks were deducted, and by whom, is not described `[U]`. A second Pune participant describes stretches of full laptop access alternating with phone-only stretches, with the phone bridged to the laptop through Office Kit. Both posts are participants' posts shown on a juror's public page because he reacted to them (https://in.linkedin.com/in/suyogkale); the earlier version of this file wrongly attributed the view to the juror.
- The HackTracker repo shows the software side: a red strip and red notification as a cue, idle warnings after 10 tap-free minutes during Red, optional status-bar block. It does not lock the laptop (section 2.2).
- One team's pre-event plan (24 Aug) assumed about 16.5 hours of phone-only time in the 30-hour format and treated battery life as a constraint (https://github.com/shrikargs7-cloud/context_AI). That figure conflicts with the organiser page, which says each city battle ran 55% Red across 19 h of pure build time, about 10.5 h. Use the organiser's figure.

### 4.3 What judges praised

| Who | Signal | Source |
|---|---|---|
| A Pune juror's post, reposted by Suyog Kale. The author names Suyog Kale and Mayur Modi as "fellow jury members", so by elimination it is Ramandeep Chandna | "A great AI demo gets attention. A well-engineered product creates impact." Lists what the jury debated after the pitches: comparing solutions, technical depth and architecture, use of device capabilities, impact and product potential | https://in.linkedin.com/in/suyogkale (read 2026-10-03) |
| Mayur Modi (Pune jury) | A well-engineered AI product creates impact; model sophistication alone does not. Values problem clarity, technical depth, scalability. Not re-read: page returned HTTP 999 on the check. The wording is close to the post above, so this may be the same post `[U]` | https://in.linkedin.com/in/mayur-modi-b1862382 |
| Suyog Kale (Pune jury) | His own posts say only that he enjoyed judging. The "engineered product" line on his page is the repost above, not his words | https://in.linkedin.com/in/suyogkale |
| Lesly Arun Franco (Chennai jury) | Real problems solved with purpose, not novel tech for its own sake; impressed by 30-hour prototypes. Not re-read: HTTP 999 `[U]` | https://in.linkedin.com/in/leslyarun |
| Pradipta Dash (Bengaluru jury) | Reposted about Team Smoke Test; frames his view as a builder's perspective. Not re-read: HTTP 999 `[U]` | https://in.linkedin.com/in/pradipta-dash |
| Community moderator, Bengaluru | Top 10 projects went to a final presentation where teams demonstrated their solutions and answered judges' questions | https://community.iqoo.com/in/thread/169120 |
| Pune participants | Two evaluation rounds with mentors before the final; a Top 7 presented to the jury in the student track (Bengaluru's post says Top 10) | posts shown on https://in.linkedin.com/in/suyogkale |

No public criticism of specific projects was found. No write-up says which behaviours scored well on HackTracker `[U]`.

### 4.4 A participant account

Reuben Anthony (Team Merge Conflicts, Pune WP 1st RU per the official recap; his post says "We won the Pune City Battle") describes 30 continuous hours, a low point near hour 20, and presenting exhausted. No technical detail on HackTracker, Office Kit or credits (https://www.linkedin.com/posts/reuben-anthony07_iqoohackathon-reskilll-hackathon-activity-7502976610359402496-_RLz).

---

## 5. Pre-trained models, converted weights, datasets prepared before the event

**No organiser clarification was found in any public source `[U]`.** The written rules stay as captured: original code during the event; open-source libraries and third-party APIs allowed with attribution; pre-event idea drafting allowed; no pre-built product.

What the evidence shows in practice:

| Evidence | Source |
|---|---|
| Reskilll's own prep advice: research local LLMs, try Phi-3 or Gemma with llama.cpp or MLCChat, and build a small camera + on-device model demo before the hackathon. The models it names are all off-the-shelf pre-trained ones: Phi-3 Mini, Gemma 2B, Llama 3.2 1B/3B, Whisper Tiny, MobileNet/YOLOv8 | https://reskilll.com/blogs/on-device-ai-hackathons-build-local-llms-snapdragon-npu-2026/ ; https://reskilll.com/blogs/iqoo-hackathon-2026-india-phone-first-ai-hackathon-iqoo-reskilll/ |
| The organiser FAQ names pre-trained model families (Sarvam, Gemma, Phi) as the on-device target | captured organiser FAQ |
| Screening itself asked for prototypes, decks and videos made before the event | section 4.1 |
| A Bengaluru student winner ran pre-trained YOLO and Depth-Anything-V2 on the NPU | https://github.com/GargBhavya-tech/secondsense |
| A Chennai student runner-up had a public "pre-event reference spike" a week before, then built during the event. Its README says the classifier heads "ship pretrained on the public MAFAULDA dataset", i.e. a custom model trained by the team on a public dataset | https://github.com/black1plague2/jugaad-agent ; https://github.com/Bhavya-Dhoot/Jugaad |
| A Pune student runner-up's repo README says the app was built "for the RIFT / iQOO Hackathon tracks", which reads as work shared with another hackathon. The Terms list work developed for or submitted to another competition as a disqualifier; the team still placed. Whether organisers knew is unknown `[U]` | https://github.com/parthsarode0506/NoCapRX |
| A Hyderabad student runner-up published a "pre-hardware prototype" three weeks before | https://github.com/aadityaa0523/senseguard |
| A Chennai team openly planned to train its hardest models in the 12 days before the event | https://github.com/muhammedsayeedurrahman/smartlease-edge-chennai |
| Teams interpreted the rule as: reference repos before, fresh event repo after the clock starts | https://github.com/Naga-Balaji/sidecar-iqoo-hackathon ; https://github.com/yogeswar-08/studyloop ; https://github.com/venkatpachala/EdgeCode |

Reading: using pre-trained open models is clearly expected. Pre-converted weights and pre-trained custom models were used by teams that placed, with no public sign of penalty. Pre-collected datasets are not addressed anywhere. The Terms let organisers verify that a project was built inside the window, so a team's own fine-tuned weights and datasets remain a grey area `[U]`. The series contact for a ruling is the address on the organiser site.

---

## 6. Direct-entry registration

- Open as of 2026-10-03: the organiser home page says direct entries are open and links to `/register?city=finale` (login wall; not entered).
- **Deadline: no organiser-published date found on any public page `[U]`.** Two participant documents give 5 Oct 2026, and neither is the organiser's own text:
  - A direct-entry team's submission document states "Submission Deadline: October 5, 2026" for the Phase 1 idea on the portal `https://iqoo.reskilll.com/dashboard/iqoo-finale` (https://github.com/SanTiwari07/Kounter, file `docs/01_pitch/PHASE_1_SUBMISSION_PORTAL.md`). The line has been there unchanged since the file's first commit on 27 Sep 2026; last edit 2 Oct 2026. The document reads as machine-drafted and its "Field 1 … Field n" layout is the team's own.
  - A Hyderabad winner's pre-event notes, compiled 22 Sep 2026 and marked as read from the portal, list idea deadlines per event and give "5 Oct" for the Grand Finale (https://github.com/prajwal-gunnala/maynards, `docs/pre-event/handoff/reference/iQOO_Hackathon_Intel.md`). It fits the pattern of the city deadlines, which fell four to five days before each event.
  - Treat 5 Oct 2026 as probable, not confirmed. No time of day is given for the Finale; Hyderabad's was 23:59:59 IST per the same notes. Whether screening is rolling, and whether slots can fill before the 5th, is unknown `[U]`. Only the logged-in dashboard settles this.
- Listings conflict with the organiser home page, which says Finale direct entries are open. Reskilll's own listing card for "iQOO Hackathon 2026 - City Battles" shows registration end 27 Sep 2026 and "Registration Closed" (https://reskilll.com/allhacks/in/hyderabad). Eventopia shows "Register by 27 Sept 2026" and "Applications closed" (https://eventopia.in/event/iqoo-hackathon-2026). HireToday has two listings: one closing 27 Sep (https://hiretoday.in/competitiondetails/40000169), one closing 11 Oct, which is just the event end date (https://hiretoday.in/competitiondetails/40000153). The 27 Sep date matches the last city battle, so it most likely describes the city-battle window, but no listing says so in terms `[U]`.
- What the Finale form asks: behind login. The Kounter document is organised as title, track, one-line pitch, problem, solution, hardware use, Office Kit architecture, technical stack, demo script, feasibility plan. Those headings are the team's own layout and may not match portal fields `[U]`.
- Press says Finale entrants are city winners plus "shortlisted participants from online registrations" (https://www.itvoice.in/iqoo-announces-indias-phone-first-hackathon-series-challenging-young-innovators-to-build-ai-powered-solutions-for-real-world-problems-on-mobile).
- A WhatsApp group link is on the organiser home page; deadline notices may be there (not joined).

---

## 7. Jury

Finale panel: not announced. City juries below. Profiles come from public LinkedIn pages where they loaded.

| Juror | City | Role | What they work on / care about | Public comment on the event | Source |
|---|---|---|---|---|---|
| Goutam Kurumella | Bengaluru | Head of Startup Solutions Architecture, AWS India | Not loaded `[U]` | none seen | https://www.linkedin.com/in/goutamkurumella/ (HTTP 999) |
| Madhav Bissa | Bengaluru | Program Director, AI, nasscom | Not loaded `[U]` | none seen | https://www.linkedin.com/in/madhavbissa/ (HTTP 999) |
| Pradipta Dash | Bengaluru | Co-founder and CTO, Avashya (enterprise cloud, data, GenAI, voice AI services); about 20 years at Microsoft and Amazon | Cloud platforms, distributed systems, production AI | Reposted a student team's result; "builder's perspective" | https://in.linkedin.com/in/pradipta-dash |
| Siddhant Agarwal | Bengaluru | Developer Relations, ClickHouse; Google Developer Expert (AI/ML) | Real-time analytics, agentic and multi-agent systems, developer communities; runs AgentsNexus and Click-a-thon | none seen | https://in.linkedin.com/in/sidagarwal04 |
| Venkat Ragothaman | Bengaluru | Microsoft, leads Enterprise Security (Windows security) | Hardware security, attestation, confidential computing, post-quantum crypto, security of agentic AI | none seen | https://in.linkedin.com/in/venkr |
| Vivek Sridhar | Bengaluru | CTO, Microsoft for Startups | Cloud, DevOps, AI-assisted development, system design, storytelling for developers | none seen | https://in.linkedin.com/in/vivsridh |
| Mayur Modi | Pune | Head of AI Foundry (MLOps), Swarovski (organiser site wording) | GenAI, agents, RAG, MLOps, production readiness | Engineering quality over model sophistication | https://in.linkedin.com/in/mayur-modi-b1862382 |
| Ramandeep Chandna | Pune | Systems Engineering Manager, AWS and GenAI, EPAM | Not loaded `[U]` | Probable author of the "well-engineered product creates impact" post (section 4.3); profile itself not loaded `[U]` | https://www.linkedin.com/in/ramandeepchandna/ |
| Suyog Kale | Pune | Co-founder, Rover AI (security intelligence / SIEM); ex-Redis | Databases, vector search, AI SOC infrastructure, BFSI | Own posts: glad to judge, nothing on criteria. Reposted the fellow juror's "well-engineered product" post. The comments about the Red/Green format on his page are participants' posts he reacted to | https://in.linkedin.com/in/suyogkale |
| Gokulavan Jayaraman | Chennai | Infosec Lead, Mahindra Group | Not loaded `[U]` | none seen | https://www.linkedin.com/in/gokulavan/ |
| Lesly Arun Franco | Chennai | CTO, Aracor AI (AI for legal and M&A contract work) | Enterprise AI from proof of concept to production; demo-to-deployment gap | Real problems with purpose | https://in.linkedin.com/in/leslyarun |
| Uday Shankar | Chennai | Founder and CEO, Scentric Networks (per organiser site) | Public profile shows a different current employer and little else `[U]` | none seen | https://in.linkedin.com/in/ushankar |
| Amit P. | Hyderabad | Head of AI, 5day.io | Not loaded `[U]` | none seen | https://www.linkedin.com/in/amit-p-2798723/ |
| Krishna Gangadhar | Hyderabad | Senior Principal Architect, Genpact | Data platforms, GenAI in production, failure patterns, LangChain vs LangGraph | none seen | https://in.linkedin.com/in/krishnagangadhar |
| Prabhakar Daley | Hyderabad | Principal Architect, LTIMindtree | Not loaded `[U]` | none seen | https://www.linkedin.com/in/prabhakar-daley-739201100/ |
| Suman Nandamury | Hyderabad | CTO, Colleve | Not loaded `[U]` | none seen | https://www.linkedin.com/in/nandamurysuman/ |

Common thread in the profiles that loaded: enterprise and cloud architects, production AI, security. Few are mobile or on-device specialists; that expertise sat on the mentor bench (Android engineers, the Qualcomm advocate). One juror post, confirmed on re-read and reposted by a second juror, stresses a well-engineered product over an attention-getting demo. The similar comments attributed to Mayur Modi and Lesly Arun Franco could not be re-read (HTTP 999) `[U]`.

---

## 8. Press coverage and earlier iQOO / Reskilll events

### 8.1 Press on the 2026 series

| Date | Outlet | Content | URL |
|---|---|---|---|
| 17 Aug 2026 | Techgenyz | Launch; four cities; Rs 40 lakh | https://techgenyz.com/iqoo-hackathon-2026-city-battles/ |
| 18 Aug 2026 | Fonearena | "First hybrid mobile" hackathon; iQOO 15; Rs 6 lakh per city; Rs 25 lakh Finale pool | https://www.fonearena.com/blog/489783/iqoo-hackathon-2026-hybrid-mobile-development-challenge.html |
| 18 Aug 2026 | IT Voice | Press release text; 12+ mentors; AI credits; evaluation on phone-first execution, AI integration, Office Kit usage, real-world relevance, pitch | https://www.itvoice.in/iqoo-announces-indias-phone-first-hackathon-series-challenging-young-innovators-to-build-ai-powered-solutions-for-real-world-problems-on-mobile |
| 19 Aug 2026 | Digital Terminal | Same release; winner, two runners-up and "Special Honour" per city | https://digitalterminal.in/trending/iqoo-announces-40-lakh-hackathon-for-ai-and-mobile-innovators |
| Aug-Sep 2026 | iQOO community | Launch, per-city announcements and recaps | https://community.iqoo.com/in/thread/167130 and section 3 links |
| Aug 2026 | Reskilll blog | City guides, strategy guide, on-device AI guide | https://reskilll.com/blogs/iqoo-city-battles-2026-india-first-phone-first-ai-hackathon-4-cities/ and related |
| Aug 2026 | Listings | Eventopia, HireToday, YouTube explainer | https://eventopia.in/event/iqoo-hackathon-2026 ; https://hiretoday.in/competitiondetails/40000153 ; https://www.youtube.com/watch?v=5IVmxJiOGOo |

No press report on results was found; results appear only on iQOO's community site and LinkedIn. No executive quote was found in any coverage read.

Prize-pool discrepancy: three different Finale figures are in circulation.
- Rs 25 lakh: the press release as carried by Fonearena ("separate" national pool), IT Voice and Digital Terminal. Four cities at Rs 6 lakh plus Rs 25 lakh is Rs 49 lakh, not Rs 40 lakh. The same IT Voice piece puts Rs 40 lakh "across the four city battles and the Grand Finale" in its sub-headline.
- Rs 16 lakh or less: the organiser home page says each city targets Rs 6 lakh and "the balance of the pool sits with the Grand Finale and special awards", which is Rs 40 lakh minus Rs 24 lakh, shared with special awards. A community member's post states the Rs 24 lakh / Rs 16 lakh split outright (https://community.iqoo.com/in/thread/167067).
- Rs 40 lakh: the official iQOO Connect launch post lists a Rs 6 lakh pool at each city battle and "the ₹40 lakh Grand Finale prize pool" (https://community.iqoo.com/in/thread/167130). This reads as loose wording for the series total.
The organiser FAQ says final numbers are set by iQOO. The organiser site is the most specific source, so Rs 16 lakh including special awards is the working figure; the Finale prize breakdown is unconfirmed `[U]`.

Finale date discrepancy: early iQOO social copy says 10-11 Oct (https://community.iqoo.com/in/thread/167068). The organiser site and later posts say 9-11 Oct.

### 8.2 Earlier events

| Event | Date / place | Facts | Source |
|---|---|---|---|
| iQOO Hackathon 2026 pilot (same Reskilll platform, same HackTracker and Office Kit mechanics) | 6 Jun 2026, COWRKS DLF Cybercity, Gurugram | 8-hour sprint; 80 builders; Red Light 11:00-14:00, Green 14:00-15:30; Top 10 pitches; tracks AgentKit, CampusOS, BrandForge, Open Innovation; Rs 1.8 lakh for top 5; $25 AI credits per team; NDA at check-in; mentors from iQOO engineering and product. Rubric: Office Kit usage 25% (HackTracker), phone-first execution 25%, AI-native build 20%, problem fit 20%, craft and pitch 10% | https://reskilll.com/blogs/how-to-prepare-for-iqoo-hackathon-2026-a-complete-guide-for-participants/ (29 May 2026) |
| A second pilot edition in Bengaluru `[U]` | June 2026 | Reskilll's 21 Aug blog says the "original iQOO Hackathon" earlier in 2026 drew 500+ registrations "across Delhi NCR and Bangalore editions", and mentions earlier "TechQuest" AI mobile workshops in 4 cities. A Hyderabad winner's notes put the Bengaluru pilot at 13-14 Jun, Scaler School of Technology, 30 h. The pilot site https://iqoo-banglore.reskilll.com/ failed with a certificate error and was not read. Its rubric and results are not confirmed | https://reskilll.com/blogs/iqoo-hackathon-2026-india-phone-first-ai-hackathon-iqoo-reskilll/ ; https://github.com/prajwal-gunnala/maynards (`docs/pre-event/handoff/reference/iQOO_Hackathon_Intel.md`) |
| Pilot result | Delhi NCR | A participant README cites a LinkedIn post about a first-place team that ran fully locally. The LinkedIn URL returns 404; unverified `[U]` | https://github.com/Adit-Jain-srm/DevLens |
| iQOO Z-series demo plus hands-on AI workshop (Reskilll listing) | 9 Aug 2026 Pune and Hyderabad; 16 Aug 2026 Bengaluru and Chennai | Product demo by iQOO's product team, then an AI workshop; a feeder for the city battles | https://reskilll.com/allhacks/in/chennai |
| iQOO Connect x PRISMATIC'26 | 10-11 Apr 2026, Easwari Engineering College, Chennai | 24-hour student hackathon, 120+ participants, AI/ML and cybersecurity problems; iQOO was community sponsor, not organiser; no Reskilll link | https://community.iqoo.com/in/thread/150995 ; https://community.iqoo.com/in/thread/150748 |
| Reskilll's other 2026 hackathons | various | Health-a-thon 2026 (Koita Foundation and IIT Bombay), an AI hackathon with Meta Llama in Bengaluru | https://reskilll.com/discover ; https://reskilll.com/allhacks/in/hyderabad |

The pilot matters for two reasons. HackTracker's code and weights date from the pilot period (last commit 28 May, nine days before the 6 Jun pilot). The pilot rubric gave Office Kit usage 25% on its own, scored as "HackTracker buildScore"; the city-battle rubric rebalanced it to 10% and added 15% for creative phone use. So the repo's composite appears to have been built for a rubric in which the whole device share was one "buildScore" labelled Office Kit usage (an inference from the dates and the shared name). That is one reason not to read its weights across to the Finale's 15% line.

---

## [U] items

1. Finale loaner model. iQOO 15 is confirmed for all four city battles; no source states the Finale device.
2. Loaner RAM/storage variant. 16 GB is reported from device readouts by placed teams in Chennai and Hyderabad; no organiser statement; Finale unknown.
3. ARCore and Depth API on the Indian iQOO 15 (I2501). Not on Google's Play-certified list by name or code as of 2026-10-03; the China model V2505A is on the China list.
4. Depth/ToF sensor, laser AF, barometer, UWB: none listed on the India pages or on vivo China's fuller sensor list; treated as absent, not positively confirmed. Colour-temperature and flicker sensors are listed for the China model only. Microphone count, native focal lengths and macro capability unpublished. GSMArena could not be opened (bot check), so its sensor line was not compared.
5. Whether OriginOS 6 AI features run on-device, and whether Gemini Nano / AICore is available on the loaner.
6. How HackTracker data maps to the published 15% and 10% rubric lines. The only code found (last commit 28 May 2026, the June pilot period) scores Office Kit dwell time, typing, compile spikes, battery drain, thermals and performance mode, with penalties for crashes and idle warnings. It has no camera, voice or on-device-AI term. Reskilll's August blog says camera, microphone and NPU use raise the device score but gives no mechanism.
7. Whether the production HackTracker counts in-app camera use, how it treats APK installs and ADB (logged as tamper in the repo), and whether screenshot and face-photo features were used.
8. AI credits provider and amount for city battles and Finale. Only "$25 per team" for the June pilot is documented.
9. Qualcomm and Sarvam formal involvement. Only a Qualcomm employee as mentor and a Sarvam mention in the FAQ are documented.
10. Direct-entry deadline. 5 Oct 2026 comes from two participants' documents (one direct-entry team, one Hyderabad winner's portal notes), not from any public organiser page. No time of day. Reskilll's own listing card shows registration closed on 27 Sep, most likely the city-battle window.
11. Exact Phase 1 form fields and limits (behind login).
12. Organiser position on pre-converted weights, own fine-tuned models and pre-collected datasets. Practice by placed teams suggests tolerance; no written ruling found.
13. Tracks for 21 of 24 winners; repos for 13 of 24 not found; four of the 11 repo matches are probable only (Mira.ai, Kavach, Nazar, Hush), and three of the seven firm ones do not name the team (SecondSense, NoCapRX, Jugaad Agent).
14. Special Honour recipients and any extra Finale slots beyond the 24.
15. Finale prize breakdown (Rs 25 lakh per press, Rs 16 lakh or less per the organiser site's "balance" wording, Rs 40 lakh per the iQOO launch post's loose wording).
16. Profiles of seven jurors whose LinkedIn pages did not load; Finale jury composition. Juror comments attributed to Mayur Modi, Lesly Arun Franco and Pradipta Dash could not be re-read.
17. How Red Light penalties are applied on the floor (one Pune participant says touching the laptop cost marks on the spot) and any participant account of HackTracker scoring.
18. X, Instagram and Devpost were not searched successfully.

---

## Source check (2026-10-03, independent reviewer)

Method: every row below was re-opened on 2026-10-03 with a headless browser (no login) or the `gh` CLI. The HackTracker repo was cloned and read file by file. GSMArena showed a bot check and most LinkedIn profiles returned HTTP 999; neither was bypassed. "Corrected" means the text above was edited in place.

| # | Claim | Source opened | Verdict | Note |
|---|---|---|---|---|
| 1 | Each city recap names the iQOO 15 | community.iqoo.com threads 169162, 169968, 171930, 173338 | confirmed | All four say the challenge was powered by the iQOO 15. None gives a model code |
| 2 | Launch post and press name the iQOO 15 | thread 167130; fonearena 489783; digitalterminal; itvoice; Reskilll blog (21 Aug) | confirmed | Named for the series as a whole. No source names the Finale device |
| 3 | Model code I2501, Android 16, API 36, SM8850 | VibeCall-AI, KAVACH_IQOO, paper-trail, rankqoo READMEs; Jugaad plan file | confirmed | Participant device readouts. SiteSweep_Live alone says Android 15 |
| 4 | Loaner RAM variant unknown | Jugaad plan file; maynards `docs/measurements.md` | corrected | Two placed teams report 16 GB (15.6 GB MemTotal). Organiser silent; Finale unknown |
| 5 | SoC, RAM/ROM, OS, battery, charging, display, NFC, sensor list | iqoo.com/in/products/param/iqoo15 and /products/iqoo15 | confirmed | Matches line by line |
| 6 | Main camera IMX921 1/1.56" f/1.88 OIS; ultra-wide 1/2.76" f/2.05; front 32 MP f/2.2 90° | same | confirmed | Fonearena gives 1/1.49" for the main sensor; official figure kept |
| 7 | Telephoto IMX882 3x periscope with OIS, 100x digital | iqoo.com product page; vivo.com.cn param page | confirmed | India page says CIPA 4.0 stabilisation; China page states OIS on main and periscope |
| 8 | Portrait presets 23/35/50/85/100 mm; native focal lengths unpublished | iqoo.com product page | confirmed | |
| 9 | Macro / tele-macro not stated | both official pages | confirmed | The "15 cm macro" in Kounter's README is unsourced |
| 10 | No ToF / LiDAR / laser AF / barometer / UWB listed | India param page; vivo China param page | confirmed (absence, still `[U]`) | China page's fuller list has none of them either |
| 11 | IR blaster present | shop.iqoo.com/in/product/2067; fonearena 469632; vivo China param page | confirmed | E-store: Infrared supported. China page lists infrared remote control |
| 12 | Colour spectrum sensor unverified | vivo China param page | corrected | China model lists front and rear colour-temperature sensors, a flicker sensor and a Hall sensor. Not listed for India |
| 13 | Microphone count unpublished | both official pages | confirmed | |
| 14 | Video 8K rear / 4K front | vivo China param page | confirmed | Frame rates only from Cashify, not re-opened |
| 15 | GSMArena cross-check | gsmarena.com | could not verify | Bot check on search; no page read |
| 16 | ARCore: no "iQOO 15" or I2501 row; iQOO 13, 15R, 15T listed; V2505A and 15 Ultra on the China table | developers.google.com/ar/devices | confirmed | Depth API line "over 88% as of May 2026" also confirmed |
| 17 | "Vivo I2505" row unidentified | KHwang9883/MobileModels | corrected | I2505 is the iQOO Z10R 5G |
| 18 | OriginOS 6 AI features and region footnote | iqoo.com product page | confirmed | |
| 19 | Office Kit: Remote PC needs Windows 10+ / macOS 10.14.6+ and iQOO 15 or later | pc.vivoglobal.com home and supported-models tabs | confirmed | iQOO Z and Neo series do not get Remote PC |
| 20 | Office Kit: PC app V6.0+, OriginOS 6+ | iqoo.com product page; pc.vivoglobal.com | confirmed | |
| 21 | Office Kit pairing: same account, same network, phone unlocked; scan or USB alternatives; Bluetooth + Wi-Fi on Windows | pc.vivoglobal.com Connect to PC | confirmed | |
| 22 | Office Kit limits: clipboard macOS 11+, screen extension and Infinite collaboration X Fold only, live-streaming X500 Pro only, Jovi in India | pc.vivoglobal.com | confirmed | Added: Jovi on Mac needs macOS 12 |
| 23 | "A crowded venue is the stated risk case" | pc.vivoglobal.com footnote 2 | corrected | vivo names wireless interference only |
| 24 | File transfer across different networks | iqoo.com product page | confirmed | |
| 25 | HackTracker repo dates, 50 commits, three identities, no licence, 0 stars | `gh api` on the repo | confirmed | Created 2026-05-22 UTC; commits 2026-04-11 to 2026-05-28 |
| 26 | Upstream `sam25kat/...` returns 404; production host answers | `gh api`; hacktracker.reskilll.com/login | confirmed | |
| 27 | How official the repo is | repo; Reskilll pilot blog; juror post | confirmed with additions | "buildScore" name and a "Sameer Katte" credit link it to Reskilll. Still not an official spec and five months old |
| 28 | Signals recorded (taps, text counts, app switches, Office Kit dwell, camera opens, vitals, sensors, performance mode, tamper) | SETUP-GUIDE.md Part 4; Kotlin services and DTOs | confirmed | |
| 29 | Office Kit time = window class-name dwell | `HackTrackerAccessibilityService.kt`, `Constants.kt` | confirmed | Patterns: pcsuite, remotecontrol, smartoffice, officekit, office_kit, vivo.office, smart_office |
| 30 | Camera open = foreground package name contains "camera" | `HackTrackerAccessibilityService.kt` line 164 | confirmed | In-app camera use would not register in this version |
| 31 | No microphone / speech / NPU / inference signal | full-repo search, manifest | confirmed | Zero hits in code and in docs |
| 32 | Composite weights 0.30 / 0.15 / 0.15 / 0.10 / 0.10 / 0.10 / 0.10, penalties 0.10 each | `web/lib/scoring.ts` `DEFAULT_WEIGHTS`; SETUP-GUIDE.md | confirmed | In code and in the guide. Added: thermal headroom and battery drain reward a hotter, faster-draining phone |
| 33 | Compile spike = jump over 50 points | `leaderboard/route.ts` | confirmed | Signal is memory pressure, samples about 25 s apart |
| 34 | Red Light is a visible cue only; idle warning after 10 tap-free minutes; device-owner status-bar block | SETUP-GUIDE.md; `web/lib/idle-scan.ts` | confirmed | Idle test counts taps only |
| 35 | Tamper events include ADB toggles and any package install; allow-list empty | SETUP-GUIDE.md Part 5; `Constants.kt` | confirmed | |
| 36 | Privacy inconsistency (screenshots, face photos vs "no screenshots") | repo; notes/site-guide.txt | confirmed | Organiser guide also says no screenshots |
| 37 | Mapping of HackTracker to the 15% and 10% lines is not public | organiser captures; Reskilll on-device blog | confirmed, with addition | Reskilll's blog claims camera, mic and NPU use raise the score; no mechanism given |
| 38 | Moderator: Hyderabad judges combined expert evaluation with HackTracker data | thread 173160 | confirmed | |
| 39 | All 24 winners: team, project, place, bucket | the four recap threads | confirmed | 24 of 24 match |
| 40 | One-line descriptions | the four recap threads | corrected (1) | Pune Tree Rakshak line had details that are in a team member's post, not the recap. PhoneOS AI line tightened |
| 41 | "20 of 24 name a sensor or on-device AI"; attendance 115/105/128/122; venues | recap threads | confirmed | |
| 42 | Pune cheques match the published split | thread 170203 | confirmed | |
| 43 | Repo match: SecondSense | GargBhavya-tech/secondsense | confirmed | Name, description, 29-30 Aug commits. Team not named |
| 44 | Repo match: NoCapRX | parthsarode0506/NoCapRX | confirmed, with caveat | README titled PharmaGuard, cites RIFT and iQOO. Team not named |
| 45 | Repo match: Jugaad Agent (three repos) | Bhavya-Dhoot/Jugaad, vj-io/jugaad, black1plague2/jugaad-agent | confirmed | Identical READMEs; 13 machine types and 58 faults stated |
| 46 | Repo match: Saathi | shaswatnaman/saathi-pcos | confirmed; track added | README names the team and the HealthTech track |
| 47 | Repo match: MeshAI | prajwal-gunnala/maynards, uvabd17/MeshAI-IQOO | confirmed | Team and Developer Tools track named |
| 48 | Repo match: SenseGuard | aadityaa0523/senseguard | confirmed | Names the team; pre-hardware prototype only |
| 49 | Repo match: EdgePPG | sarandevu/TeamON_N_ON | confirmed | |
| 50 | Repo match: Mira.ai, Kavach, Nazar, Hush (probable) | the four repos | confirmed as probable | Kavach has a rival same-name repo created the same day |
| 51 | Repo match: PhoneOS AI (weak) | slendermancodes/PhoneOS | corrected | Empty repo; removed from the matched count (12 → 11) |
| 52 | 645 repos, cluster counts, "82 name iQOO 15" | not re-run | could not verify | 18 cited repos spot-checked and exist as described |
| 53 | Participant measurements in 1.5 | FillByVoice, RedPen, smriti, yogeshwars-cys, secondsense, paper-trail READMEs | confirmed | As quoted; still unaudited claims |
| 54 | Direct entry open; registration behind login | notes/site-home.txt, site-register-city-finale.txt | confirmed | |
| 55 | Phase 1 deadline 5 Oct 2026 | Kounter `PHASE_1_SUBMISSION_PORTAL.md` and its history; maynards intel notes; GitHub code search; two web searches | corrected (strengthened, still `[U]`) | Two participant sources now. No organiser page states it |
| 56 | Listings show 27 Sep as the close date | eventopia; hiretoday 40000169 and 40000153; reskilll.com/allhacks/in/hyderabad | corrected | Reskilll's own card says "Registration Closed"; conflict with the home page flagged |
| 57 | Registration steps guide | thread 167073 | confirmed | Page is marked as possibly AI-generated |
| 58 | Reskilll tells entrants to pre-test models and build a demo before the event | Reskilll on-device blog (17 Aug); Reskilll main blog (21 Aug) | confirmed | |
| 59 | Winners used pre-trained YOLO / Depth-Anything-V2; pre-event spikes and prototypes | secondsense, jugaad, senseguard, smartlease, studyloop, EdgeCode READMEs | confirmed | Added: Jugaad heads pretrained on MAFAULDA; NoCapRX cites another hackathon |
| 60 | No organiser ruling on pre-trained or converted weights | organiser captures | confirmed | Still `[U]` |
| 61 | June pilot: 6 Jun, Gurugram, 8 h, 80 builders, Red 11:00-14:00, Green 14:00-15:30, tracks, Rs 1.8 lakh, $25 credits, NDA | Reskilll prep blog (29 May, modified 7 Aug) | confirmed | |
| 62 | Pilot rubric 25 / 25 / 20 / 20 / 10 | same | confirmed | Office Kit line is described as "HackTracker buildScore" |
| 63 | Only one pilot | Reskilll main blog; maynards notes | corrected | A Bengaluru pilot edition is indicated; details `[U]` |
| 64 | Finale prize: Rs 25 lakh (press) vs Rs 16 lakh (arithmetic) | fonearena, itvoice, digitalterminal; thread 167067; thread 167130; notes/site-home.txt | corrected | Third figure added (Rs 40 lakh in the iQOO launch post); organiser "balance" wording cited |
| 65 | Finale date discrepancy 10-11 Oct vs 9-11 Oct | thread 167068 | confirmed | |
| 66 | Strategy-guide quotes ("can't fake it", 25% from device data) | Reskilll strategy blog (17 Aug) | confirmed | |
| 67 | Jury names and roles for 16 jurors | notes/site-panels-schedule.txt | confirmed, one wording fix | Mayur Modi's title aligned to the organiser's |
| 68 | Juror praise: Suyog Kale on engineered products and on the format | in.linkedin.com/in/suyogkale | corrected | The product line is a fellow juror's post he reposted; the format comments are participants' posts |
| 69 | Juror praise: Mayur Modi, Lesly Arun Franco, Pradipta Dash | LinkedIn | could not verify | HTTP 999 |
| 70 | No first-hand account of Red Light enforcement | posts on in.linkedin.com/in/suyogkale | corrected | One Pune participant reports marks lost for touching the laptop in Red |
| 71 | "About 16.5 hours of phone-only time" | context_AI README; notes/site-home.txt | corrected | A pre-event team estimate; organiser figure is about 10.5 h per city battle |
| 72 | Reuben Anthony's account | LinkedIn post | confirmed | Post says "we won"; recap lists the team as 1st runner-up |
| 73 | Earlier events: Z-series demo and workshop dates | reskilll.com/allhacks/in/chennai and /hyderabad | confirmed | |
| 74 | PRISMATIC'26, Techgenyz, YouTube explainer, Cashify, iserviceindia, Smartprix | not opened or page empty | could not verify | Low impact |

Contradictions with the organiser captures (`notes/site-*.txt`, `research/rubric.md`): none in rubric weights, tracks, schedule, jury lists or rules. Three points needed alignment and are now edited: the Finale prize (organiser site implies Rs 16 lakh or less including special awards), the Red Light hours for city battles (organiser: 55% of 19 h), and the registration status (home page says open; Reskilll's listing card says closed on 27 Sep).

Totals: 74 claims checked; 57 confirmed (several with added detail), 13 corrected, 4 could not be verified.

---

## Addendum (2026-10-03): second pass by an independent researcher (Codex, gpt-5.6-terra, medium effort)

Raw notes: notes/codex-area1.md. These rows were written by a second model with live web search and a budget of about 35 lookups. Status of each row: not yet re-checked unless the "Addendum source check" table below says so.

### New findings

| finding | why it matters | source URL | date |
|---|---|---|---|
| No new, independently verifiable announcement about the direct-entry deadline, registration status, Finale venue, jury, mentors, prize split, or AI-credit provider was returned by the first five targeted public-platform searches. The official iQOO results found were older City-Battle/recap posts, not a new Finale announcement. | This does not resolve the existing report's [U] items; it limits the evidence to the sources already documented there. | https://community.iqoo.com/in/thread/167130 | 2026-08-17 (page date; checked 2026-10-03) |
| The official City-Battle guide explicitly permits additional Finale invitations: “standouts beyond Top 6 can also earn Finale slots.” It does not name recipients, number of places, or selection criteria. | Resolves whether extra slots are permitted, but not the existing report's open question of whether any were actually awarded. | https://iqoo.reskilll.com/guide | checked 2026-10-03 |
| A Chennai City-Battle repository says its project was built on an iQOO 15 and documents `adb push` of a 2 GB model to app-private external storage. This proves a participant's development workflow, not that the organiser allowed ADB or that it affected HackTracker scoring. | It is direct evidence that ADB-based model deployment was used in a City-Battle-associated project; no source found says the team was penalised or rewarded. | https://github.com/PiSquareLabs/mudra | repository checked 2026-10-03 |
| [U] (reviewer could not open the LinkedIn profile page, HTTP 999, 2026-10-03; nothing in this row is verified) A first-hand LinkedIn post from a Chennai Top-25 team says organisers provided AI credits for GPT-4o, Claude Sonnet, and Gemini Pro. It names services, but neither the post nor an organiser page identifies the account, reseller, credit amount, model versions, or terms. | Resolves part of the provider gap: at least these three hosted-model services were reportedly available at Chennai. It does not establish that OpenAI, Anthropic, or Google provided credits directly, or that every City Battle used the same package. | https://in.linkedin.com/in/boggala-porkavi | post surfaced 2026-10-03; event 2026-09-12–13 |
| The current official event page still says direct Finale registrations are open and that Finale jury panel is “not announced.” It provides only Bengaluru, not a venue, and says the final-submission and jury-presentation times are TBC. | Independently corroborates the user-provided status and establishes that a public Finale jury/mentor list and precise venue/time were still absent on the official page at this check. | https://iqoo.reskilll.com/ | checked 2026-10-03 |
| Corrected by the reviewer 2026-10-03 (the cited post was readable without login). One team-member post (Manas Waykole) says team Atomic Diaperz "was awarded an Honorary Mention (4th Place) at the iQOO Hackathon 2026 in Bangalore" for NewsLens, "competing alongside 80 talented participants" over 30 hours. The post is dated **31 Jul 2026**, four weeks before the Bengaluru City Battle of 29–30 Aug 2026, so it cannot be about the City Battle. It most likely refers to the earlier Bengaluru pilot edition noted in section 8, but the post does not say which event [U]. The other two "team-member accounts" were not found or opened [U]. | Does NOT resolve a City-Battle "Special Honour" recipient. It shows only that an earlier Bangalore edition gave a fourth-place honorary mention. | https://www.linkedin.com/posts/manas-waykole_hackathon-artificialintelligence-generativeai-activity-7488898349794975744-yvwn | post surfaced 2026-10-03; Bengaluru battle 2026-08-29–30 |
| The official guide labels the Finale venue only as Bengaluru; City-Battle venue fields on that page remain “TBA.” The guide has no Finale building/address. | The precise Finale venue remains unannounced publicly, rather than merely unfound. | https://iqoo.reskilll.com/guide | checked 2026-10-03 |

### Corrections to the existing report

| claim in report | what the source says | URL |
|---|---|---|
| The existing report treats the Grand Finale prize as an unresolved three-way conflict, including ₹25 lakh in press coverage. | Corrected by the reviewer 2026-10-03: thread 167130 is the iQOO Connect registration announcement (posted 08-17), not a recap, and it does not say "₹40 lakh total". Its wording is "a ₹6 lakh prize pool at each City Battle" and "a shot at the ₹40 lakh Grand Finale prize pool". The hackathon site says the opposite: "A total pool of ₹40,00,000 across the four city battles and the Grand Finale. Each city targets ₹6L, indicative … the balance of the pool sits with the Grand Finale and special awards", and its Finale banner says "₹40,00,000 is still on the table". So the conflict between ₹40 lakh for the Finale alone and ₹40 lakh overall (which would leave about ₹16 lakh) is still open [U]; ₹16 lakh is an inference from the site wording only. | https://community.iqoo.com/in/thread/167130 |
| The existing report leaves “any extra Finale slots beyond the 24” wholly open. | The official guide says standouts beyond the top six “can also earn Finale slots.” This establishes an available route, not that an extra slot was granted. | https://iqoo.reskilll.com/guide |
| The existing report says Special Honour recipients were unknown. | Corrected by the reviewer 2026-10-03: the one account that could be opened is dated 31 Jul 2026 and describes an 80-participant Bangalore event, so it predates the City Battles. Special Honour recipients at the City Battles remain unknown [U]. | https://www.linkedin.com/posts/manas-waykole_hackathon-artificialintelligence-generativeai-activity-7488898349794975744-yvwn |
| A GitHub repository's About field calls its work “iQOO Hackathon National Finals, Chennai.” | That conflicts with the organiser's stated Finale location, Bengaluru (9–11 October). The README itself says the work was completed at the Chennai City Battle, so the About-field label should not be treated as an event-location source. | https://github.com/PiSquareLabs/mudra ; https://community.iqoo.com/in/thread/167130 |
| The existing report says the available HackTracker code contains no microphone/speech/NPU/inference signals. | A participant LinkedIn post claims HackTracker logged “every inference call, token, and thermal reading.” (Reviewer 2026-10-03: post opened and wording confirmed; Prajwal V R, 1 Sep 2026, about the Bengaluru City Battle, where he built FraudSense with a quantised Gemma model via MediaPipe. He does not say how he knows what HackTracker logged.) This is not corroborated by an organiser statement and conflicts with the reviewed code, which the report dates to the pilot. It should be recorded as an unverified participant assertion, not evidence of production behaviour. | https://www.linkedin.com/posts/prajwal-vr_iqoohackathon2026-ondeviceai-buildonphone-activity-7500402095238311936-iek1 |

### [U] items resolved

- Extra Finale slots: the official guide confirms they are possible for standouts beyond the top six. Recipients, count, and criteria remain [U].
- AI credits, partial and [U] (the LinkedIn source could not be opened by the reviewer): a Chennai Top-25 participant identifies GPT-4o, Claude Sonnet, and Gemini Pro as credited tools. Credit provider, allocation, and whether the package applied in other cities remain [U].
- Finale jury announcement status: the official current page labels the Finale panel “not announced.” Names remain [U].
- Special Honour: NOT resolved (reviewer correction 2026-10-03). The Atomic Diaperz / NewsLens post is dated 31 Jul 2026 and so refers to an earlier Bangalore edition, not the 29–30 Aug City Battle. City-Battle Special Honour recipients, award value and any Finale slot remain [U].

### [U] items still open (what you searched)

- Direct-entry deadline / registration status: searched official iQOO community, LinkedIn, Instagram, and X queries for "iQOO Hackathon 2026" plus "Finale". No dated post in the last ten days was returned that answered it.
- Finale jury/mentors, venue, and prize split: the official community results returned announcement and City-Battle recap pages, not a Finale programme or prize-breakdown post.
- AI-credit provider: searched exact provider terms (OpenRouter, Bedrock, Gemini, Sarvam) and GitHub credit/coupon queries; no result identified a City-Battle provider.
- HackTracker / ADB: searched for participant accounts. One Chennai repository documents `adb push`; it has no HackTracker-score or disciplinary outcome. No organiser computation method was found.
- ARCore: searched exact I2501/iQOO 15 ARCore and relevant GitHub terms; no practical-use report was returned.
- Devpost and Special Honour: direct Devpost and Special Honour searches returned no matching coverage or recipient list.
- Finale venue: the current official page says only Bengaluru; no building/address was published there.
- Finale prize split: the current official page specifies ₹6 lakh as the **target** for each City Battle and says the balance of the ₹40 lakh total pool sits with the Grand Finale and special awards (wording corrected by the reviewer 2026-10-03; per-city split shown is ₹3.2 lakh working professionals and ₹2.8 lakh students). It gives no Finale cheque/special-award split.
- HackTracker production telemetry: one participant claims inference-call/token logging, which conflicts with the pilot-era code reviewed in the existing report. Searched LinkedIn participant accounts; no organiser explanation reconciles this.
- Pre-trained custom weights/datasets: the official rules allow open-source libraries/frameworks with attribution and forbid a completed app, but they do not explicitly address model weights or datasets. Searched those exact terms and found no written organiser ruling.
- Direct-entry deadline: searched the exact 5 October date and direct-entry terms. No organiser post established a deadline; third-party/participant posts describe the former City-Battle cutoff (27 September), not a Finale deadline.
- ARCore: Google’s current supported-devices list still omits iQOO 15 / I2501 while listing iQOO 15R and 15T; no hands-on I2501 ARCore report was found. https://developers.google.com/ar/devices

### Addendum source check (2026-10-03, independent reviewer)

Method: official pages opened in a headless browser with no login; the guide line read from the saved capture `notes/site-guide.txt`; GitHub through `gh api`; LinkedIn tried once per URL without logging in. 9 rows checked: 8 opened, 1 could not be opened.

| row | source opened | verdict (confirmed / corrected / could not open) | note |
|---|---|---|---|
| Guide: "standouts beyond Top 6 can also earn Finale slots" | notes/site-guide.txt (saved capture of iqoo.reskilll.com/guide) | confirmed | Full sentence: "Top 6 teams per city advance (three per bucket); standouts beyond Top 6 can also earn Finale slots." No recipients, count or criteria. The live page was not re-fetched |
| Guide: city venues "TBA", no Finale address | notes/site-guide.txt | confirmed | "Venues TBA" for all four City Battles; Bengaluru "hosts the Grand Finale" |
| PiSquareLabs/Mudra: built on iQOO 15 at Chennai City Battle; `adb push` of a ~2 GB model; About field says "National Finals, Chennai" | `gh api repos/PiSquareLabs/mudra` and README | confirmed | README: Qwen2.5-3B-Instruct Q4_K_M GGUF pushed to `/sdcard/Android/data/com.mudraapp/files/models/`; "Built and completed at iQOO City Battles, Chennai, on an iQOO 15". Description: "IQOO Hackathon National Finals, Chennai (Qualified from 13,000+ participants)". Repo created 12 Sep 2026. Says nothing about HackTracker or organiser permission |
| AI credits for GPT-4o, Claude Sonnet, Gemini Pro (Chennai participant) | in.linkedin.com/in/boggala-porkavi | could not open | HTTP 999. Row left [U] |
| Official event page: direct Finale registration open; Finale panel "not announced"; times TBC; Bengaluru only | iqoo.reskilll.com (rendered) | confirmed | "direct online registrations also open"; "Grand Finale, panel not announced"; final-submission cut-off and jury-presentation start "to be confirmed"; results 18:00 |
| NewsLens / Atomic Diaperz as Bengaluru City-Battle Honorary Mention; "three accounts" | linkedin.com post by Manas Waykole (public HTML, no login) | corrected | Post exists and says Honorary Mention (4th place), Bangalore, 80 participants, 30 hours. It is dated 31 Jul 2026 (page metadata and the post ID timestamp agree), before the 29–30 Aug City Battle. Only one account opened |
| Prize: thread 167130 "₹40 lakh total", ₹6 lakh per city | community.iqoo.com/in/thread/167130 (rendered); iqoo.reskilll.com | corrected | Thread says "₹40 lakh Grand Finale prize pool"; site says ₹40,00,000 total across city battles and Finale. Conflict stays open |
| HackTracker "logging every inference call, token, and thermal reading" (participant) | linkedin.com post by Prajwal V R (public HTML, no login) | confirmed as a claim | Wording confirmed, dated 1 Sep 2026. Unverified as fact; no organiser source |
| ARCore list omits iQOO 15 / I2501, lists 15R and 15T | developers.google.com/ar/devices | confirmed | Via page summary; model code I2501 not searched separately |
