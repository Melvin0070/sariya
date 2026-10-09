# Sariya: Finale build plan, Fri 9 Oct 19:00 to Sun 11 Oct 12:00

Written 9 Oct, 17:30-18:30 IST. **This file supersedes the timetable in PREP-PLAN.md §6 and in event-prompts.md §1.** If two files disagree on a demo number, §7 below is the single source.

Live site checked 9 Oct, 17:25: the timetable and rubric are unchanged. The Finale jury is now published, and the submission cut-off is still "TBC" (see §10).

---

## 0. One page

**What we ship by Sun 12:00 (Tier 1, in build order):**
1. The mesh loop: card S on the half-scale mesh, NPU overlay live, count and spacing per layer with a ± band, a verdict against a 5-field spec, and "re-scan" when the card is too small in the frame.
2. The beam: strip_300 along the beam top face, ring spacing by zone, and "add N".
3. Voice: the spec spoken with read-back, and the fix spoken in Hindi with subtitles.
4. The weigh test: offcut length and grams typed or spoken, then the IS 1786 class. It is cheap, needs no camera, and is a pitch beat.
5. The record: capture signature on P1, pack sent over Office Kit, the engineer signs with a fingerprint on P2, P3 verifies the QR, and yesterday's pack is rejected.
6. The numbers screen: NPU, GPU and CPU latency plus scan counters, read from stored data.

**Every checkpoint shows something real.** Details are in `EVAL-CARDS.md`.

| Checkpoint | Hour | Promise |
|---|---|---|
| CP1, Sat 10:00 (scored, no elimination) | 15 | The mesh loop with a spoken Hindi fix |
| CP2, Sat 19:00 (scored) | 24 | Plus the beam, voice spec, and pack + fingerprint sign-off over Office Kit |
| CP3, Sun 09:00 (final build to 12:00) | 38 | The full pitch run, plus replay rejection, weigh test and numbers screen |
| Pitch, Sun after lunch | - | demo-script.md §2 (3:30) |

**Three rules that override everything:**
- **Red Light means hands off every laptop.** The laptop is reached only through Office Kit on the phone (§1).
- **Fresh code.** The repo starts after 19:00. Nothing from `prep/` is copied into or translated line by line into `app/`; the agents write from the algorithm text in `docs/prompts/`, and the Python only produces expected numbers on the laptop (a test oracle). Data, weights, prints and design docs are disclosed (§9).
- **Claims.** No site statistic, no engineer endorsement, no "safe" or "PASS" (§8).

---

## 1. Red and Green Light: the rules we play by, and how each scores

Sources: the organiser guide ("Red Light = iQOO phone only via Office Kit"), the home page ("During Red Light the laptop is closed as a build machine, so Office Kit is the only route between the two"), the organiser answers of 7 Oct (PREP-PLAN §7: Remote PC is allowed and counts, a coding agent driven through it is allowed, and eval blocks are not phone-only), and the HackTracker code (tracker-officekit.md §1).

### 1.1 In every Red block (Fri 21-00, Sat 03-06, 08-10, 13-15:30, 16:30-19, 22-01, Sun 06:30-09)

| Do | Don't |
|---|---|
| Reach the laptop **only** through Office Kit on your phone: Remote PC to type into tmux and Claude Code, file transfer for APKs and logs, and Super Clipboard for prompts | Touch any laptop's keyboard, trackpad or lid, including the Windows backup. Lids stay open, screens on, and laptops on wall power from before the Red starts |
| Get APKs to the phone by Office Kit file transfer, then install from Files (same package, so it is an update) | Use `adb install` or `adb logcat` over Wi-Fi or USB in Red. ADB is a laptop link outside Office Kit; use it in Green only, unless an organiser says otherwise at kickoff (§10, Q2) |
| Use T3 Chat on the phone as a thinking surface: draft prompts, check Hindi wording, read a stack trace pasted through the clipboard | Use T3 Chat, a web UI or SSH to *control the laptop*. Only Office Kit may touch the laptop |
| Keep every phone active: none goes 10 minutes without a tap. Tap the app at least every 8 minutes (§1.3) | Leave a phone in a bag, asleep, or on a charger with the screen off |
| Run the app's camera, mic and NPU continuously on whichever phone isn't in Remote PC (scan loop, §1.3) | Open Settings > Accessibility, Usage access or Device admin (passcode prompt, logged). Do all settings before 19:00 |
| Sleep only in Green or eval blocks (§4.2) | Sleep in Red: your phone goes idle and drags down the team average |

### 1.2 In Green and eval blocks
Both devices are allowed, and the organisers say eval blocks are not phone-only. Use them for work the laptop does best: integration merges, `adb logcat` debugging, model swaps, the release build, the deck. **Write the next Red block's prompt files before every Green block ends** (§2.4). Charge phones here, one at a time.

### 1.3 What the phones are scored on, and the routine that earns it
The device score is the **average across the three phones** (organiser answer). The May-2026 tracker code weights:
- Office Kit foreground minutes: 0.30;
- memory-pressure "compile spikes": 0.15;
- typing density: 0.15;
- battery drain, thermal headroom, redline and performance-mode minutes: 0.10 each;
- −0.10 for each idle-in-Red warning, and −0.10 for each HackTracker crash.

The organisers say the Finale build also detects camera, mic and on-device AI in any app.

Each person's phone alternates between two modes for the whole Red block:
- **Office Kit mode:** Remote PC on your own laptop. Send the next command, read the agent's output, start a build. Office Kit is in the foreground, so its minutes accrue.
- **Instrument mode:** while the agent works (typically 5-20 minutes), switch to Sariya (`ScanCameraActivity`). Torch on, scan the mesh or beam, speak a tape reading, let the fix play. This exercises the camera, mic and NPU, and every scan is also a test of the new build and an error-table row.
- Switch every ~5-10 minutes. Both modes involve taps, so there are no idle warnings.

Don't charge in Red; drain rate is scored. Never let a phone fall below 25 %; if it does, charge it while it stays in use. Keep the app's 5 fps NPU heartbeat on (prompt P4).

---

## 2. Team, tools and repo

### 2.1 Lanes. Each person owns packages, so merges don't collide.

| Who | Build lane (event-prompts §1 packages) | Prompts | Demo role (demo-script) |
|---|---|---|---|
| **A** | Trust and desk: `rules/`, `record/`, `officekit/`, review UI, replay; repo owner and integrator; deck, organiser liaison | P6, P10, P12, P13, P14 | Presenter |
| **B** | Vision: `capture/`, `fiducial/`, `segment/`, `geometry/`, `numbers/`, tap-to-mark | P1, P2, P3, P4, P5, P11, P15, P18 | Operator (P1 phone) |
| **C** | Voice and app: `voice/`, `llm/`, UI shell, verdict sheet, crash guards, error table, weigh-test entry; props and rehearsal fixtures | P7, P8, P9, P16, P17, weigh test | Engineer (P2 phone, laptop) |

`model/` belongs to B for the first 30 minutes (P1), then it is frozen. Any change to it is announced aloud and merged by A.

### 2.2 Tools
- **Claude Code (Max plan, one per laptop): the builder.** Opus. Run two or three sessions per laptop, each in its own git worktree (`../sariya-<lane>-<task>`), so one waits on a build while another codes. Before the first Red, set a project permission allowlist so prompts don't stall in Red: `./gradlew *`, `git *`, file edits inside the repo. No web fetches are needed.
- **Codex (Plus plan): reviewer and fallback, not the main builder.** The Plus quota is small. Use it for:
  - one review pass per lane before each checkpoint freeze ("review this diff against prompt PNN's acceptance list");
  - the geometry, rules and signing unit tests as a second opinion;
  - the takeover if a Claude session hits its limit.
- **T3 Chat on the phones: the Red-Light thinking surface** (§1.1). It doesn't touch the laptop.

### 2.3 Repo setup, Fri 19:00-19:25 (A)
1. Create `sariya` from `event-template/` (toml, settings, wrapper are config only). **The first commit is after 19:00**, and the timestamps are the provenance. Push to a private GitHub repo and make it public at submission.
2. **One shared debug keystore**, `keys/sariya-debug.jks`, committed, with `signingConfigs.debug` pointing at it. Otherwise each laptop signs with its own `~/.android/debug.keystore`, the phones refuse the "update", and uninstalling wipes the Keystore keys and stored records. Keep the release keystore out of git.
3. Copy into the repo:
   - `rules.json` → `app/src/main/assets/rules/` (data);
   - the half-scale spec JSONs (§7);
   - `docs/` holding the event-prompts.md prompts split into `docs/prompts/P01.md` … `P18.md`, plus §7 of this file.

   Don't copy `prep/` code.
4. Write `CLAUDE.md` in the event repo with:
   - the module layout (event-prompts §1);
   - the standing rules: Telemetry on every stage, no `INTERNET` permission, none of the words PASS, safe, certify, permit or fail in UI strings;
   - the §7 constants;
   - the shortcut **`go PNN` = read `docs/prompts/PNN.md` and do it, run the unit tests, build `assembleDebug`, copy the APK to `~/Sariya-out/`, and reply with a 5-line summary.** In Red this turns a whole prompt into six characters typed over Remote PC.
5. Branches: `lane/a`, `lane/b`, `lane/c`. A merges to `main` at every block boundary, and integration APKs are built from `main` only. Commit and push at least every 30 minutes.

### 2.4 Office Kit setup (do this before 19:00)
- Pair each phone with its owner's laptop (for Remote PC), and also pair P2 with the demo laptop (C's) for mirroring.
- Per laptop, run `caffeinate -dimsu` in a tmux window (on Windows: power plan "never sleep"), disable the lock screen, and set terminal font size to 20+.
- Use a tmux session `sariya` with these windows:
  - `agent` for Claude Code;
  - `build`;
  - `out` (`ls -t ~/Sariya-out`);
  - `codex`.
- Set the Office Kit file-transfer folder to `~/Sariya-out` on the laptop and `Download/Sariya/apk` on the phone.
- Keep the previous APK in `Download/Sariya/apk-prev/`.

---

## 3. Pre-clock, Fri 17:00-19:00: no app code

### 3.1 Status board: fill this in now, because it decides the branches in §6

| Asset | Expected location | Have it? | If missing |
|---|---|---|---|
| Segmentation `.tflite` (U-Net SM8850, fallback, DeepLabV3+) | USB `sariya-models/seg/` | ☐ | P1 falls back to the AI Hub DeepLabV3+ download, then the classical Frangi mask (`segment_classical` logic) for CP1 |
| AI Hub profile job URL | | ☐ | Quote the on-phone bench only |
| ASR hi/kn/en int8 + VAD | `sariya-models/asr`, `vad` | ☐ | Keypad entry first; voice spec moves to CP2 |
| Piper Hindi voice + pre-rendered fix WAVs | `sariya-models/tts` | ☐ | System Hindi TTS; render WAVs on the laptop in the first Green |
| Gemma 4 E2B `.litertlm` (2 GB) | `sariya-models/llm` | ☐ | Templates only. The UX is identical by design (P8) |
| Warm Gradle cache / `--offline` build proven | each laptop | ☐ | Online build on venue Wi-Fi or a phone hotspot in the first Green |
| 20-utterance wav set per language | | ☐ | Record 5 utterances × 2 voices per language at 19:00 (C) |
| Props: mesh 280 mm, beam 300 mm, offcuts, scale, tape, gloves, cloth | bag | ☐ | |
| Prints: card S (pattern width measured), strip_300 (10 pitches measured), F1/F2/F3/F12, spec_A4 | bag | ☐ | Reprint at a shop. Handwritten fault cards are fine |
| Bench error-table CSV from 8 Oct | | ☐ | Floor stays at 5 mm until the in-event tape loop produces one (P16) |

### 3.2 Loaner checklist (event-prompts §4.1, minus anything that is our code)
- Do on each phone:
  - label the phones P1, P2, P3;
  - developer options: USB debugging, Install via USB, Stay awake;
  - note the SoC (`getprop ro.soc.model`) and free storage;
  - battery whitelisting (High background power, Autostart, Not optimised);
  - Game Space bypass charging;
  - Hindi and Kannada TTS voice data downloaded (phone hotspot);
  - Office Kit pairing (§2.4);
  - push the model folder to `Download/sariya-models/` (data, not code; this takes minutes for 2 GB, so start it first).
- **Don't** install a pre-built probe APK. The NPU smoke test is P1, after 19:00.
- Calibration stills can be shot now with the stock camera, because photos are data. Take 25 stills of card S (or the A3 board if printed) at 0.25-0.5 m with tilts and 1x zoom. The intrinsics come from the app's own capture mode in the first Green; see §6, G0.
- Ask the kickoff questions (§10) at check-in.

---

## 4. Block-by-block plan

### 4.1 Timetable (organiser timetable; checked live 9 Oct, 17:25)

| Block | Light | A (trust and desk) | B (vision) | C (voice and app) | Gate at block end |
|---|---|---|---|---|---|
| **Fri 19:00-21:00** | Green | Repo, keystore, CLAUDE.md, `docs/prompts` (19:00-19:25). P6 rules engine as pure Kotlin with JVM tests (the §7 worked numbers) | P1 skeleton + NPU smoke on P1 (G0 by 20:15). P2 camera session, then the in-app calibration capture → intrinsics | P7 NumberParser + P9 NumberWords as pure Kotlin with tests (snap sets from §7). Voice data checks on phones; record wavs if missing | `main` builds; v0.1 on all three phones; the accelerator chip shows NPU, or GPU is recorded; Red prompt files written |
| **Fri 21:00-00:00** | Red | `go P10` (canonical JSON, keys, biometric, QR), then the verdict sheet bound to P6. Instrument mode: test sign + fingerprint on P2 | `go P03` (card S, strip_300 per §7), then `go P04` (live mask overlay, NPU on every gated frame plus the 5 fps heartbeat). Instrument mode: scan the mesh at 0.25-0.65 m | `go P07` (sherpa ASR + VAD + spec sheet), then `go P08` (Gemma + validators + templates). Instrument mode: speak the five-field sentence | Card S found at 0.3 m with ≥ 20 corners; overlay ≥ 10 fps; five chips filled from voice or keypad |
| **Sat 00:00-03:00** | Green | Integration I1: merge, `adb logcat` sweep, fix seams. **C sleeps 00:30-03:00** | `go P05` geometry. Then the half-scale **tape test**: 5 scans each at 0.25 / 0.3 / 0.35 m, compared with tape → `bench_error_table.csv`, field floor | (asleep from 00:30) | **G1:** count 5/5 and spacing within band vs tape on ≥ 8/10 scans. Else, promote P18 tap-to-mark for CP1 |
| **Sat 03:00-06:00** | Red | `go P13` (export pack, BBS import, Transfers screen), start of P12 | Geometry fixes from G1; abstention by marker pixel size (§7); lower-layer family with the wider band (F12) | `go P09` (Piper Hindi, kn system voice / clips, subtitles), the fix templates for F1/F2/F4/F12 | A scan produces a verdict and a spoken Hindi fix end to end on `main` |
| **Sat 06:00-08:00** | Green | Integration I2 = **CP1 candidate**. **B sleeps 06:00-08:00** | (asleep) | `go P17` crash guards + Doctor screen; `go P18` tap-to-mark if G1 failed | **CP1 build frozen at 08:30** |
| **Sat 08:00-10:00** | Red | CP1 card rehearsal ×5 (A speaks), fix list to agents (blockers only) | Error-table scans with the tape (P1) | Weigh-test entry + IS 1786 bands (small; P6 has the rules) | CP1 run under 90 s, 3 times clean |
| **Sat 10:00-11:00** | **CP1** | Present (`EVAL-CARDS.md`, CP1) | Operate | Engineer / laptop | Write down every evaluator remark |
| **Sat 11:00-13:00** | Green | **A sleeps 11:00-13:00** | `go P11` beam: strip_300 positions, zones, "add N" | Verdict sheet polish; the weigh test on the verdict sheet; P16 error-table screen | Beam F3 → "outside, add 1" on the bench |
| **Sat 13:00-15:30** | Red ("laptops closed") | `go P12` review + countersign (approval key behind BiometricPrompt) | Beam UI (strip ticks, gap labels), F3 scans | P16 error table, voice spec for the beam sentence (end zone 150) | Countersign verifies on P1 |
| **Sat 15:30-16:30** | Green, mentors | Ask the Qualcomm mentor (Kartikey Rawat) to look at the NPU table | `go P15` numbers screen + NPU/GPU/CPU bench | Merge, I3 | Numbers screen shows three accelerator rows |
| **Sat 16:30-19:00** | Red | `go P14` replay guard (phash, card ids, STALE). Office Kit round trip on P1 → laptop → P2 | Bench hardening: glare, tilt, F9 half card | **CP2 build frozen at 18:15**; CP2 card rehearsal ×3 | CP2 run under 90 s |
| **Sat 19:00-22:00** | **CP2** (both devices) | Present, then fixes from feedback | Fixes | Fixes; **B or C sleeps ~20:00-22:00 after presenting** (whoever isn't on the next fix) | Feedback triaged into "do before 01:00" and "never" |
| **Sat 22:00-01:00** | Red | Three-phone flow (P1 capture → P2 sign → P3 verify → replay rejected) rehearsed ×3 | Error-table scans at 3 distances (P16 rows), F4 re-scan beat | Kannada path; the "no drawing" measurement-only mode (F11); TTS WAV fallback button | **G5, 01:00: feature freeze** |
| **Sun 01:00-06:30** | Green | **A sleeps 01:00-04:30.** Then the deck (9 slides), README, MODEL_CARD, PROVENANCE, LICENSES | Release build (R8 rules from event-prompts §2.4) on all phones at 03:00; **B sleeps 03:30-06:30** | **C sleeps 01:00-03:30.** Then fill the numbers screen from stored data, record the backup video of the demo at ~05:30 | Release APK on P1-P3; repo README done |
| **Sun 06:30-09:00** | Red | demo-script §7 rehearsal plan (runs 0-6, failure drills) | Operator in the runs | Engineer in the runs | Three runs under 3:35 in a row |
| **Sun 09:00-12:00** | **CP3** / final build | Present CP3. **Submit repo + assets by 11:30** (or 30 min before the announced cut-off) | Only numbers may change | Upload the video and deck PDF | Submitted; repo frozen |

### 4.2 Sleep (Green or eval blocks only)

| Person | Sleep | Total |
|---|---|---|
| A | Sat 11:00-13:00, Sun 01:00-04:30 | 5.5 h |
| B | Sat 06:00-08:00, ~Sat 20:00-22:00 or 22:00 handover, Sun 03:30-06:30 | 5-7 h |
| C | Sat 00:30-03:00, Sun 01:00-03:30 | 5 h |

In a Red block every phone stays with an awake person. If someone must sleep in Red, a teammate taps that phone every 8 minutes and keeps its NumbersActivity bench running. Avoid this.

### 4.3 Every Red block, minute 0-15 (event-prompts §4.2, adapted to three laptops)
- **T-5 (Green):** each laptop has tmux running, caffeinate on, the APK folder clean, and the agent window idle at a prompt. Hands off.
- **T+0:** each phone opens Office Kit → Remote PC → its own laptop, then types `go PNN` for its first prompt.
- **T+2:** switch to Sariya: torch on, scan loop (instrument mode).
- **T+10:** whiteboard update: block start, each phone's prompt, battery %, the one gate for this block.
- **Every APK:** Office Kit transfer → install from Files → one sanity scan. If it crashes, reinstall from `apk-prev/` and paste the crash file (`Doctor` → copy) into the agent through the clipboard.

---

## 5. Checkpoint expectations
See `EVAL-CARDS.md`. Each card has:
- the promise;
- what must work;
- the 90-second script with the half-scale numbers;
- the "if missing" lines;
- the 10-minute pre-flight;
- what the evaluator scores, and how we earn it.

---

## 6. Decision gates and fallback ladders

| Gate | When | Test | Pass | Fail → do this, and don't look back |
|---|---|---|---|---|
| **G0 NPU** | Fri 20:15 | P1 smoke: create + 50 runs, 3 accelerators | NPU p50 < 25 ms (U-Net) or < 10 ms (DeepLabV3+) | Try the JIT `.so` zip in `jniLibs` (15 minutes max), then GPU. Write it on the numbers screen as it is. Never spend more than 45 minutes here |
| **G0b intrinsics** | Fri 20:45 | Calibrate from 25 stills of card S in the app's 4K still mode (laptop runs `prep/ref_pipeline/calibrate.py --card 20 --square-mm <measured/6>` as a tool, not app code; `card_board(20)` already yields ids 360-377) | RMS < 0.5 px | Use EXIF focal length × sensor; the band uses `eps_lens 0.01` (uncalibrated) and says so |
| **G1 geometry** | Sat 02:00 | 10 tape-checked scans of the control mesh at 0.3 m | count 10/10, spacing in band 8/10 | P18 tap-to-mark becomes the CP1 path ("marked by hand" chip); the model path keeps running for the overlay |
| **G2 voice** | Sat 06:00 | Spec by voice on 5 tries in the hall | 4/5 chips correct after read-back | Keypad spec; TTS-out stays (WAVs) |
| **G3 LLM** | Sat 06:00 | Gemma GPU init + JSON validity | init < 30 s, ≥ 90 % valid | Templates only (identical UX). Say "LLM off" if asked |
| **G4 desk** | Sat 17:30 | P1 → Office Kit → laptop → P2 sign → P1 import | both signature chips green | Sign on P2 with the pack moved by Quick Share; the mirror still shows the desk |
| **G5 freeze** | Sun 01:00 | - | - | After this, only bug fixes, numbers, deck and repo hygiene |

Ladder order (cut from the bottom up). The 3-phone flow, the replay rejection and the weigh test are pitch beats, so cut them last.

1. Mesh loop.
2. Spoken Hindi fix.
3. Signed record + fingerprint.
4. Beam zones.
5. Weigh test.
6. Replay rejection.
7. Voice spec.
8. Numbers screen.
9. Kannada.
10. LLM wording.
11. Lower-layer band.
12. BBS import.

---

## 7. Half-scale constants: the single source for every number (supersedes older files)

| Item | Value |
|---|---|
| Card S | 6x6 ChArUco, 15 mm squares, 11 mm markers, pattern 90 mm (measured value written on the card; pitch = measured/6), DICT_5X5_1000, **ids 360-377**, registry `card: 20`. `prep/ref_pipeline` recognises card S (card 20) and strip_300 automatically since 9 Oct |
| strip_300 | ids **450-461**, 20 mm markers, 25 mm pitch, 30 mm wide; marker centre at **12.5 + (id − 450) × 25 mm** from the 0 end (the beam's left end). Not ids 400-439 or 50 mm (that is the full-scale 2 m strip) |
| Scan distance | Whole mesh 0.3-0.35 m; single gap 0.25-0.3 m. Distance gate 0.2-1.3 m, plus the marker-size gate below (the reference pipeline's defaults were changed to this on 9 Oct) |
| Abstention | Re-scan when the median card-S marker side is under **45 px in the 4K still** (≈ 0.65 m). The F4 far scan is at 0.8 m (~35 px → re-scan) |
| Line minimum | `min_len_mm` **80** (beam cross pieces are 125 mm; the Python default of 150 would drop them) |
| Measurement zone | The bar grid ±10 mm (card-S frame: `samples/spec_slab_half.json`), never the board edge: at 0.3 m the frame's short side is ~244 mm, and a zone that leaves the frame fails coverage, so every rule reads "not seen" |
| Focus stations | `LENS_FOCUS_DISTANCE` 0.3 m and 0.5 m (3.33 and 2.0 diopters) for the props, not 0.6/0.9 m |
| Single-gap tolerance | **max(15 mm, 25 % of spec)** (rulebook v0.1.1, 9 Oct). Before 9 Oct, `rules.json` had a flat 25 mm, so every stage fault read "re-scan" instead of "outside". Copy the **regenerated** `rules.json` (v0.1.1, `tol_local_frac` 0.25, DWG-SPACING-LOCAL severity M) |
| Slab spec | 8 mm @ 50 c/c both ways, 5 x 5, top bars T1-T5 at X 40/90/140/190/240, bottom bars B1-B5 at Y 40/90/140/190/240 |
| Slab limits | Mean ≤ 50 + max(10, 5 %) = **60**; any single gap ≤ 50 + max(15, 25 %) = **65**; count = 5. Verified on synthetic half-scale scenes (`prep/ref_pipeline/tests/test_pipeline_halfscale.py`): CONTROL within; F2 80.0, F4 71.9, F12 79.9 → outside; F4 at 0.8 m → re-scan (36 px); beam F3 left end 100 → outside |
| Beam spec | Rings 8 mm @ **50 over the first 150 mm**, **75 mid**; pieces at 25/75/125/200/275 on 300 mm 12 mm bars; end-zone limit mean 60, single 65; mid mean 85, single ≈ 94 (75 + 18.75) |
| Faults | F1 lift T3 → count 4/5, slot 3. F2 T4 190→220 → gap 80 (limit 65). F4 T4 → 212 → gap 72: re-scan at 0.8 m, outside at 0.3 m. F12 B2 90→60 → lower gap 80. F3 beam piece 75→~180 (tick it; at 190 it nearly touches the 200 piece and the masks merge) → end gap 100, 2 links in 150 mm, **add 1** |
| Band | Field floor 5 mm until the in-event tape loop measures p95 (P16 writes `field_floor.json`). Stage lines say "± [band on screen]", never a number that isn't on the screen |
| Spoken spec snap sets | dia {6,8,10,12,16,20,25,32}; stirrup dia {6,8,10}; spacing **25-400 step 5**; **end zone 100-1500 step 25** (speech-llm-ocr §5 and the spec schema say 300-1500, which rejects the half-scale "end zone 150": change both) |
| Weigh test | 200 mm offcuts: 10 mm ≈ 123 g (IS 1786 band 114-132), 12 mm ≈ 178 g (167-186); app default length 200 mm, editable. F8 deck card: the spare 280 mm 8 mm bar ≈ 111 g |
| Zone | Bengaluru = Zone II: IS 13920 rows "optional in Zone II", severity advisory; the drawing wins |

The full-scale numbers (100 mm, 60 cm beam, 0.8/1.2 m, card 00, 400-439) stay valid only for the roadmap and the real-site story. Every prompt that quotes them for acceptance is overridden by this table (`ERRATA-2026-10-09.md` §1 lists what changed).

---

## 8. Claims, given what is true today

- **Site evidence is one user-reported visit** (EVIDENCE.md, U).
  - Allowed, only with photos: "We visited a site this week: no one measured the steel before the pour."
  - Not allowed: "N of M sites", "our site validation set", "Bengaluru site frames", "site replay".
- **Engineer and mason:** no review or interview is logged. Don't say "a structural engineer reviewed our tolerance" or "the mason we spoke to". Say instead: "IS 456 gives no placement tolerance; we proposed one, it is a versioned file, and a project's engineer sets it."
- **Training provenance:** say exactly what ran ("public rebar images + photos of our props, timestamped log"), or "pre-trained open weights, not fine-tuned", or "classical ridge filter, no learned weights", whichever is true at CP3.
- **Accuracy:** only numbers from the error-table screen, labelled "bench, half-scale props, N tape checks".
- **Never:** safe, PASS, certify, permit, tamper-proof, first, "replaces the engineer", the Babusapalya causal link, a partner's name.

---

## 9. Submission kit (A, Sun 01:00-11:30)

| Item | Content |
|---|---|
| Repo README | One-line pitch, the loop diagram, how to build, how to run the demo, the tier list (what works and what is cut), licences |
| `PROVENANCE.md` | Written in the event window (git log). Prepared before 19:00 Fri, disclosed: design docs (`docs/`), the IS-code rule table (`rules.json`), printed fiducials and their generator, the Python reference prototype (in this planning repo only, not in the app), model weights and training logs, props. Organisers allowed pre-trained / pre-fine-tuned weights and this week's photos in writing (7 Oct) |
| `MODEL_CARD.md` | Which segmentation file ships; its sha256; base weights and licence; training data and dates; the measured NPU/GPU/CPU ms; known failure modes (glare, sagging card, lower layer) |
| `LICENSES.md` | OpenCV, LiteRT, LiteRT-LM, sherpa-onnx (Apache-2.0); IndicConformer, smp (MIT); Gemma terms; Piper voice card; ML Kit terms; any AGPL fallback named |
| Deck PDF | 9 slides from SUBMISSION_DECK structure, updated for half scale and today's evidence (§8) |
| Video | The Sun ~05:30 or 08:00 rehearsal recording: real props, a tape check, a real app. No mock-ups |
| Error table CSV | Exported from the app (P16) |

---

## 10. Ask at check-in or kickoff (log the answers in STATE.md)

1. **Submission cut-off time** (site: "TBC, before jury presentations"), and the jury-presentation slot order.
2. In Red, may **wireless ADB** stay connected (install and logcat), or is Office Kit file transfer the only route? Our default is Office Kit only.
3. With three laptops, may **each phone Remote-PC its own laptop** in Red? Our plan assumes yes.
4. Do checkpoint blocks count as Green for laptop use? (Answered 7 Oct: not phone-only. Re-confirm on the floor.)
5. May we keep our pre-event design docs and Python reference prototype in a `docs/` / `research/` folder, disclosed, while all app code is written in the window?
6. HackTracker in airplane mode on stage: are heartbeats buffered, or lost?
7. The Office Kit laptop client's vivo-account requirement, and off-network transfer.

---

## 11. Top risks

| Risk | Early sign | Response |
|---|---|---|
| NPU path fails on the loaner | G0 | GPU fallback, stated honestly; AI Hub profile as evidence |
| Glare on card S or mill scale under hall lights | First scans in Red 1 | Matte card, tilt the board, torch on, black cloth; abstain with a reason on screen |
| Debug-key mismatch between laptops | First install from a second laptop fails | Shared keystore (§2.3). Never uninstall on P2 (it holds the approval key) |
| Remote PC too slow for Claude Code | Red 1, first 10 minutes | `go PNN` convention + Super Clipboard; one person drives two lanes |
| Claude usage limit mid-Red | Agent stops | Codex in the `codex` tmux window takes the same prompt file |
| Merge conflicts at integration | I1 | Lane-owned packages; `model/` frozen after P1; A merges only at block boundaries |
| Phone idle in Red | Tracker push "Idle during Red light" | 8-minute tap rule; instrument mode while agents run |
| Thermal throttling after hours of overlay | Headroom on the numbers screen | 5 fps heartbeat, not 30; serialise ASR → LLM → TTS; one phone charges at a time |
| Kannada ASR weak in hall noise | G2 | English numbers for the spec; Kannada TTS out only |
| Overclaiming in Q&A | - | §8; the demo-script Q&A card is corrected (ERRATA §3) |
