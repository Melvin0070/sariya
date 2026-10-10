# Independent build review — 10 Oct 2026

Claude Opus 5.5, high effort. Read-only review; findings are reviewer recommendations, not observed app behavior or automatic scope changes. Parent dispositions are in TEAM-BUILD.md.

I found six problems that would break the demo or the trust claims, plus some stale facts across the files. The best split is three vertical slices with one integrator (Melvin), and the one thing that can't slip is a working bar-segmentation model on the loaner phone.

Scope: I read IDEA, STATE, EVIDENCE, HACKATHON-CONTEXT, BUILD-PLAN, ERRATA, EVAL-CARDS, AR-VISION, tracker-officekit, PREP-PLAN §7 (organiser answers), event-prompts P1–P18, `prep/README` and the train scripts. I made no edits. The Python reference tests (the numeric oracle) pass: 32 of 32. Nothing in the repo shows any app build progress. `build/` is empty and there's no event repo locally.

## Critical path
Model file (.tflite) → G0 NPU check → live segmentation (P4) → geometry and Lock (P5) → G1 tape test → rules verdict (P6) → Hindi fix → CP1. Everything else is off the CP1 path and can be built in parallel against fake data.

- **The model artifact is unproven.** The Kaggle training push was committed Fri 21:50–22:06, so there was no trained model at kickoff. The litert-torch/AOT export was never run (its SDK is Linux-only, `prep/README` §5).
- **The DeepLabV3+ "fallback" doesn't find rebar.** AI Hub's DeepLabV3+ only finds bars if it's re-headed and retrained (vision-stack L98), and nothing shows that happened. The classical Frangi filter is far too slow per frame.
- **So tap-to-mark (P18) is the only guaranteed fallback.** It's scheduled too late (Sun 01:00 in the prompts, Sat 06:00 in BUILD-PLAN).

## Prioritised findings

**P0: break the demo or the trust claims**
1. **The "re-scan" gate depends on the stream, so the Lock path may say "re-scan" at demo distance.**
   - The 45 px threshold (BUILD-PLAN §7) is in 4K-still pixels (f ≈ 2780 px). On the 1080p analysis stream that v4's Lock fuses, f ≈ 1300 px.
   - Card-S marker size: about 48 px at 0.3 m and about 41 px at 0.35 m. So scanning the whole mesh at 0.3–0.35 m gives "re-scan", and the F4 "outside" beat is fragile.
   - Fix: decide what Lock measures from. Either Lock grabs a 4K still (live lines stay display-only, "~"), or the gate becomes a mm-per-pixel limit and the analysis stream goes up to 4:3 at higher resolution. Use 4:3 either way: 16:9 leaves only about 249 mm at 0.3 m.
2. **ARCore conflicts with camera control.** ARCore owns the camera session, so manual focus, exposure lock and the 4K still go (AR-VISION §3, §7). Recommendation: cut G0c from Tier 1. Card-only overlay; ARCore goes on the roadmap.
3. **Lock fusion must not shrink the band by √15.** Consecutive frames from one still pose are correlated. Shrink only the random term (`band_for_mean`), and floor the result at the field floor.
4. **The QR check proves integrity, not who signed.** "Verifies offline with the public key pinned in the record" (event-prompts L56/L487) means anyone can mint a key and sign. It needs an enrolment step: P2's approval public key and P1's capture key get registered on P1 and P3 by QR before any signing. Otherwise the two-key story falls apart under a security juror (Finale jury: Microsoft, AWS).
5. **The perceptual-hash replay guard contradicts the "re-scan" verdict.** P14 rejects any stored scan within Hamming distance 6, so an honest re-scan of an unchanged mesh reads as `REPLAYED_IMAGE`. Moving one bar on a 32×32 hash may also stay under 6. The demo only needs "Rejected: already signed" (EVAL-CARDS CP3), a deterministic check on `recordId`/canonical hash. Keep the perceptual hash as an informational flag only.
6. **Office Kit import probably can't read the files.** Under scoped storage (Android 11+), the app can't list non-media files (json/csv/zip) that another app (Office Kit) dropped into `Documents/Sariya/import` (P13, L529). Use the system file picker with a persisted folder grant, or an "Open with Sariya" intent filter. Export through MediaStore is fine.

**P1: delivery risk**

7. **Crash diagnosis in Red.** In Red, ADB is out by our own default (BUILD-PLAN §1.1) and we don't watch logcat, yet the crash-to-file handler and Doctor screen (P17) land at Sat 06:00, after two Red blocks. Move a minimal crash handler (writes a file, copies to clipboard) into P1.
8. **The model's input contract isn't fixed in P4.** P4 says "Y-plane or RGB"; the export contract is NHWC float 0..255 RGB with ImageNet normalisation inside the graph (`export_litert.py` L8/L144). Add an on-device parity test: one prop still, mask IoU of at least 0.9 against the laptop. Also add a rotation test, since a 90° sensor rotation silently misplaces lines.
9. **F2 leaves a 20 mm gap.** T4 at 220 next to T5 at 240 leaves 12 mm clear, a risk that the two masks merge. The acceptance test must check the count stays 5. The card must be masked out so its edges don't become lines.
10. **The demo has one deterministic margin.** F4: 72 against a limit of 65 is 7 mm of margin. If the in-event error table measures p95 above 7 mm, F4 at 0.3 m flips to "re-scan". Keep F2 (80, 15 mm margin) as the guaranteed "outside" beat.
11. **Melvin is overloaded as lane A.** In BUILD-PLAN that lane has rules, record, Office Kit, replay, integration, release, deck, submission and presenter. Offload the deck and presenting, or cut Office Kit scope.
12. **Settings-page constraint for the loaners:** opening Settings during the build is logged by HackTracker (BUILD-PLAN §1.1). That covers enrolling the fingerprint on P2 and downloading Hindi TTS voice data. If either wasn't done before 19:00 Fri, do it in a Green block and accept the log entry.

**P2: hygiene**

13. **`rules.json` version mismatch.** The file says `rulebook_version 0.1.0`, dated 10-07, but already contains the v0.1.1 tolerances (`tol_local_frac 0.25`). P6 says 0.1.0 and BUILD-PLAN says 0.1.1. Records will carry a misleading rulebook version.
14. **Provenance.** Training commits are timestamped during the event window, including 22:06 inside the Fri 21–00 Red block, from a laptop. Confirm they went through Remote PC and disclose the training timing in PROVENANCE and MODEL_CARD.
15. **The shared debug keystore is committed to a repo that goes public.** That's fine for a debug key; just make sure the release key never lands in it.

## Stale or conflicting facts (BUILD-PLAN wins)
- **ARCore and OS version:** HACKATHON-CONTEXT and PREP-PLAN §0.5 say "not on ARCore list" and OriginOS 6. The loaner has OriginOS 7.0 and ARCore 1.56.
- **Tier 1 scope:** IDEA §7 puts voice spec, two-key record and the Office Kit desk in Tier 1, but IDEA L9 calls it open and BUILD-PLAN's cut ladder puts voice spec at #7.
- **Two timetables:** the event-prompts §1 build order (P7/P8 Sat 03:00, P18 Sun 01:00) disagrees with BUILD-PLAN §4.1. Issues should cite only BUILD-PLAN.
- **Not updated for v4:** EVAL-CARDS CP1 and demo-script lack the AR-lines/Lock beat (STATE says pending).
- **Device score:** the tracker code sums by team; the organiser said it's the average across phones. Plan for the average (every phone active).
- **Lane split:** the BUILD-PLAN lanes put the UI shell with voice (C), which doesn't match the Alwin/Sabari/Melvin skills.
- **Unbuilt claims:** IDEA §3.7 claims face blur and GPS with a mock-location flag, and §9 a >95% diameter close-up. No prompt builds any of these, so keep them out of Q&A.
- **No site statistic exists.** BUILD-PLAN §8 claim rules apply.

## Ownership and handoff contracts
Melvin writes the **C0 contract first (about 45 min, then frozen):**
- the `model/` types plus `LiveFrameResult(ts, gate{ok, reason}, lines[{family, slot, imgP0, imgP1, offsetMm}], approxGapsMm, accel, segMs)` and `LockResult(per-family ZoneResult, nFrames, gate, stillRef)`;
- Python-oracle golden fixtures (CONTROL, F1, F2, F4, F12, F3, the 0.8 m scan) as JSON test resources;
- `FakeFrameSource` and `FakeLock`, so nobody waits on the camera.

| Owner | Issues |
|---|---|
| **Sabari (AI)** | S1 model file plus G0 plus the on-device parity test<br>S2 capture and card detection with a stream-aware gate (P2/P3)<br>S3 live segmentation, then lines, then Lock producing `LockResult` (P4/P5), plus G1 tape test<br>S4 beam strip zones (P11)<br>S5 the error-table data loop with Alwin |
| **Alwin (UI/UX)** | A1 scan screen and line-overlay renderer on `FakeFrameSource`<br>A2 Lock UX and verdict sheet (all 5 verdicts, re-scan reason, tape entry)<br>A3 spoken Hindi fix: system hi-IN TTS first, Piper only if missing, with subtitles<br>A4 tap-to-mark, which feeds S3's geometry API; due before G1<br>A5 review screen sized for the Office Kit mirror<br>A6 numbers and error-table screens |
| **Melvin (integrator)** | M1 repo, keystore, CLAUDE.md, JVM CI, crash handler<br>M2 rules plus the fix action plus the weigh test against the oracle<br>M3 keys with enrolment, signing, QR verify<br>M4 Office Kit pack via file picker / intent<br>M5 "already signed" replay<br>M6 integration APKs, release build, submission |

**Handoffs:**
- Sabari → Melvin: `LockResult`.
- Melvin → Alwin: `List<Finding>` and `FixAction`.
- Melvin owns the canonical bytes (`ScanRecord`).
- Merges happen only at block boundaries.

**Cut line:**
- **CP1:** card-only live lines, Lock, verdict, re-scan, Hindi fix.
- **CP2:** add beam, capture signature, pack, fingerprint countersign.
- **CP3:** add already-signed rejection, weigh test, numbers screen, error table.
- **Cut now:** Gemma (templates give an identical UX), voice spec input (keypad instead), Kannada, ARCore, BBS OCR.
- **Stretch:** the F12 lower-layer band.

**Red/Green constraints on how issues are written:**
- Each issue = one self-contained `docs/prompts/PNN.md` that runs via `go PNN` over Remote PC.
- Acceptance is split into agent-runnable JVM tests plus a 1-minute phone check.
- Device debugging that needs ADB/logcat goes in Green issues.
- APKs reach the phone by Office Kit transfer only. Keep `applicationId` `in.sariya.camera` and the `ScanCameraActivity` launcher.
- No phone goes 10 minutes without a tap, and no charging in Red.

## Missing acceptance tests
1. On-device Lock path: whole mesh at 0.35 m is not "re-scan"; F4 at 0.3 m reads "outside"; at 0.8 m it reads "re-scan".
2. Locked band is at least the field floor and is not divided by √N.
3. F2 counts 5 bars, and the card edges produce zero lines.
4. A pack signed by a foreign key on P3 shows "unknown signer".
5. An honest re-scan after "re-scan" is not flagged as a replay.
6. A file dropped by Office Kit is importable, including after the app is updated.
7. An APK built on a second laptop installs as an update and keeps the approval key.
8. The record's `rulebook_version` matches the asset, and the limit at s=50 is 65.
9. Banned-word scan covers string resources and the Hindi templates (सुरक्षित, पास).
10. Model parity (IoU ≥ 0.9) and rotation alignment on device.
11. Same fixture gives byte-identical canonical JSON.
12. 30 minutes of overlay with the torch on stays at 10 fps or more; log thermal headroom.
13. Full CP flow in airplane mode, with the Office Kit step's network need stated explicitly.
