# Three-person build board — 10 Oct 2026

Execution plan for IDEA.md v4. The GitHub issues were closed as not planned and deleted on 10 Oct; `issue-pack/` (CONTROL.md, B01-B26) is now the only copy of the work queue. **No app source was written in this session.** Status starts unverified, not done: this checkout contains research, training preparation and reference code, but no Android app. B01 must link any app work already underway before creating a new scaffold.

### As built — 10 Oct 06:50 (read this first)

**B02 runtime integration is done, in the Expo app** (`sariya-expo/`, not a Kotlin/Compose scaffold): `modules/sariya-vision` runs model v2 live on the NPU with ChArUco/strip pose, bar geometry, partly-seen abstention, blur rejection, Lock fusion and a signed coverage map. Release APK builds arm64-only (107 MB). Sabari: do not re-implement the runtime or geometry; the remaining vision work is **G1 on the props** (10 tape-checked scans, 8/10 in band), the too-far gate distance at 0.6/0.8 m, and model rounds (`-Psariya.model=vN -Psariya.threshold=x`). Details: `STATE.md` session notes of 10 Oct and `sariya-expo/README.md`.

**Every laptop, once after pulling (before building):** the NPU path needs four Qualcomm QAIRT 2.50 libraries that are not in git.

```bash
cd sariya-expo && scripts/fetch-qnn.sh
```

It reads only those files (~22 MB, ~30 s) from Qualcomm's SDK zip, checks each hash and installs them into `modules/sariya-vision/android/src/main/jniLibs/arm64-v8a/`; re-running is a no-op. Without them the build silently runs on GPU: after installing, Device → Role, name and readiness must say **"Model v2 (7ad05e742fad) on NPU"**. The same files serve every model round exported with QAIRT 2.50.

### Earlier progress — pulled 52db88a (10 Oct)

**The model-preparation blocker is cleared.** `models/seg/v1/unet_mbv3_1152.tflite` is committed (26,935,452 bytes; checked SHA-256 `196d279e980b159e88c5a4b60936daeb8f593c9ac45e3fe02c424c614599f7c0`). Training/export logs and [MODEL-V1](../14-model/MODEL-V1.md) report ROI-1555 test IoU 0.8466/F1 0.917 and five-tile PyTorch/TFLite parity. These are segmentation/export results, not tape accuracy or Android camera parity.

The device report records **NPU burst 12.2 ms average**, 12.8 ms over 60 seconds, GPU 19.8 ms and CPU 234.6 ms. G0 standalone runtime feasibility is reported passed. These results were not rerun during this refresh; they exclude preprocessing, capture, geometry and UI. Default NPU was 73.3 ms, so performance mode matters. B02 now integrates this model into the APK using compatible QAIRT 2.50/v81 libraries, explicit measured mode and a persistent JIT cache. First compile ~53 s versus cached startup 4–8 s needs visible readiness UX. Android integration and G1 remain open.

Use the float model and JIT; **AOT is optional**. The committed AOT log shows missing `libc++.so.1`; separately, the device report describes QAIRT 2.47 incompatibility. Do not conflate these failures or spend the checkpoint window rebuilding AOT. Prop adaptation and INT8 are optional after measured baseline failures and need fresh held-out validation. Dataset/weight/runtime distribution terms remain a release/product task, not a cleared permission claim.

No issue is closed on this evidence alone. All assignments, dependencies and checkpoint targets remain; B02 is narrowed from training/export discovery to APK integration and camera parity. [Refresh notes](issue-pack/REFRESH-52db88a.md) record the changed briefs.

This plan supersedes BUILD-PLAN §2 lane ownership and its elapsed Friday tasks. BUILD-PLAN §7 remains the source for physical demo dimensions, subject to the stream-aware gate correction below. The live organiser timetable was checked at about 00:20 IST on Saturday 10 Oct; the clock is already running. Do not schedule a fresh Friday kickoff or claim completed gates from elapsed time.

## Owners and practical load

- **Alwin — `AlwinSunil`:** the complete UI/UX, manual-mark fallback, Hindi output, gated voice input, review desk, history/numbers, deck and video. Seven baseline issues, about **13.5 focused person-hours**.
- **Sabari — `NarayanaSabari`:** model artifact/runtime, capture/card calibration, live bar geometry, Lock uncertainty, beam, lower-layer validation, hardware evidence and independent final rehearsal. Seven baseline issues, about **14 focused person-hours**.
- **Melvin — `Melvin0070`:** shared contracts/build setup, deterministic rules, immutable records, enrolled signing keys, Office Kit transport, replay policy, both checkpoint integrations and release. Eight baseline issues, about **14.75 focused person-hours**.

These are agent-assisted planning estimates, not promises or elapsed wall time. They exclude meals, some device contention and unexpected model export work. Keep roughly one third of available awake time for integration, tape checks and failures. Model training can take hours independently. If starting from zero now, the complete automatic CP1 path is over budget; use the explicit recovery gate below. The issue count is balanced by estimated work and handoffs, not equal counts.

Human owners remain accountable. Use Claude Code or Codex on each person's laptop; **one active implementation issue per owner**, one branch/worktree per issue. Other agents may review that branch, but must not simultaneously change its files. Tool choice is a workflow suggestion, not a measured model ranking: Fable/Opus for Alwin's UI iteration, Opus/Codex for geometry and trust implementation, the other available model for a narrow acceptance review. Quota exhaustion is a handoff, not a redesign.

Melvin owns `model/`, root Gradle/manifest, integration wiring and shared schema changes. Alwin owns all `ui/` packages, including review and overlay rendering. Sabari owns camera/vision services and geometry, including a small manual-measurement adapter. Alwin owns speech templates/parser/UI; Sabari advises on ASR artifacts only after the vision gate. Melvin owns rule and signed-record services. Shared data types are frozen after B01; changes require the affected owner's explicit handoff.

## Order and handoffs

Start **B01 (Melvin), B02 v1 APK/runtime integration (Sabari), B03 screen/flow preparation (Alwin)** together. Model training/export and standalone runtime feasibility are already reported; do not repeat them as prerequisites. B02's app integration and B03's app code need the B01 scaffold; artifact checks and fixtures do not.

Automatic mesh path: B01 → B02/B04 → B06 → B08; in parallel B03/B07 (screens), B05 (rules), B09 (spoken fix). They meet at **B10**, the CP1 integration gate. Fake providers unblock UI development but never satisfy real device acceptance.

Manual CP1 recovery: **B01 + B03 + B04 calibrated frozen image + B05 + B07 manual topology + B09 → B10**. B04 must expose the minimal pixel-to-card geometry and conservative band contract needed by B07 without requiring the learned model. B02/B06/B08 remain open if automatic acceptance is unproven; record the fallback in B10. Missing calibration/card coverage cannot be bypassed by manual marking.

After the mesh gate: Sabari builds B11 beam; Melvin builds B12 capture record/keys then B14 transfer/approval; Alwin builds B13 review against their adapters, then gated B15 voice input. B12 can start with a canonical fixture before B08 is integrated, but cannot be accepted without real Lock evidence.

**B25 owns CP2 integration and its 18:15 freeze.** Then B16 duplicate protection, B17 hardware/lower-layer evidence, B18 history/numbers, B19 demo assets and B20 release candidate. **B26 owns final-candidate rehearsal and submission receipt**, with Sabari leading QA and Melvin submitting. B18 uses capture records/bench rows; test observations need no engineer countersign. B21 BBS import, B22 ARCore and B23 Kannada/LLM are optional and never dependencies of baseline release. B24 is post-event real-product validation.

### Shared contracts frozen in B01

- `SpecRevision`: member/site context, source/confirmed fields, units, revision ID; no missing field becomes a default code requirement.
- `AnalysisFrame`: ID/time, actual dimensions/crop/rotation, effective intrinsics/calibration and ownership/lifetime rules for image buffers.
- `LiveFrameResult`: card ID, timestamp, gate reasons, family/slot lines, coordinate transforms, approximate gaps and actual accelerator. No verdict.
- `LockResult`: immutable spec revision, accepted frame IDs/time range, evidence image/hash, measurement mode, count/gaps/coverage, uncertainty terms/floor, model/calibration hashes. Only this can reach rules.
- `Finding/FixAction`: verdict, source, applicable limit, rule ID/version/hash and exact numbers to display/speak. UI, ASR and LLM never recompute the rule decision.
- `ScanRecord`: versioned canonical payload, image manifest, capture signature and separate approval envelope. Approval signs the exact capture, not an editable view model.
- `TelemetrySample`: stage/backend/mode/device/model IDs, measured timings and denominators. Separate real/manual/synthetic/duplicate data.
- Review/transfer/approval/verification states and `ReviewRequest` adapters: frozen with fake cases in B01 so Alwin can build enrolment, verification and request UI without waiting for signing. Requests reference the original capture and link a subsequent new scan; they never mutate it.

Sabari publishes **LOCK-MODE before B06/B07 implementation**, including stream, transform, image source and gate metrics. If B01 finds no existing app, manual measurement is the planned CP1 baseline; automatic mode is an upgrade only after measured G1 before the 06:00 selection gate. This avoids scheduling an 8.5-hour sequential automatic build into the remaining pre-freeze window.

Every issue body includes outcome, scope boundary, dependencies, meaningful tests, loaner check, fallback/timebox and source references. “Done” means reviewed, merged into the integration branch and verified at its stated level with evidence. Attach commit/APK hash, test output and short device result. Never tick a phone test based on a simulator or fixture.

## Rebased event schedule (IST)

The table is a target, conditional on the first 15-minute inventory. Completed work should be linked and skipped. Sleeping teammates are not required for a handoff; write the current artifact/branch/next action before resting.

| Remaining block | Melvin | Sabari | Alwin | Gate |
|---|---|---|---|---|
| Sat 00:00–03:00, Green (already underway) | B01 contracts/build/diagnostics, then B05 rules | B02 integrate existing v1 + QAIRT/JIT/cache; B04 calibrated capture/manual adapter | B03 typed spec, model readiness + B07 fixture/manual UI | By 03:00: one APK, agreed interfaces, app runtime status and calibrated capture path diagnosed |
| Sat 03:00–06:00, Red | Finish rules, integration wiring; begin record schema only if core wiring is stable | B06/B08 automatic path and tape checks within remaining budget | B07 Lock/manual states, B09 Hindi output | At 06:00: select proven automatic path or explicitly manual CP1; no new optional runtime |
| Sat 06:00–08:00, Green | B10 integrate/fix seams; distribute one APK | Handoff evidence, rest if core gate is stable; otherwise fix only blocking geometry | B09 end-to-end, UX recovery; owner coordinates rest after handoff | CP1 candidate built and tested |
| Sat 08:00–10:00, Red | Freeze at 08:30; rehearse/present | Tape/operator checks | Engineer role, Hindi/subtitles, manual recovery | Three clean 90-second CP1 runs |
| Sat 10:00–11:00, CP1 | Present, record feedback | Operate | Observe/review; shared rest after slot if available | Show only implemented scope |
| Sat 11:00–13:00, Green | B12 signing/key enrolment | B11 beam | B13 review UI against adapters; B15 only if ready | Capture record + beam candidate |
| Sat 13:00–15:30, Red | B14 transport/countersign | Beam tape checks and geometry fixes | Review/transfer UX; gated B15 | First real P1→P2→P1 round trip |
| Sat 15:30–16:30, Green | Merge; inspect signing failures | Runtime measurements/mentor help if available | Device UI verification | Integration candidate on all phones |
| Sat 16:30–19:00, Red | G4 at 17:30; freeze CP2 18:15 | Beam/mesh stress checks | CP2 rehearsal | Two-key Office Kit flow or named omission |
| Sat 19:00–22:00, CP2 | Present; B16 after feedback | B17 evidence; rest after presentation | B18 screen wiring; rest after presentation | Prioritise defects, not scope growth |
| Sat 22:00–Sun 01:00, Red | B16 duplicate protection, release checklist | Finish B17, remaining bench rows | B18/B19, physical readings and failure drills | **01:00 feature freeze**; optional issues deferred |
| Sun 01:00–06:30, Green | B20 packaging/provenance + protected rest | Release runtime verification + protected rest | B19 deck/video + protected rest | Final APK + backup + evidence; preserve key continuity |
| Sun 06:30–09:00, Red | Rehearse from the phone | Operate, tape | Engineer, verify, fallback video | Three complete runs ≤3:35 |
| Sun 09:00–12:00, CP3/final | Confirm submission receipt | Verify final numbers only | Upload final deck/video | Internal submit by 11:30, or 30 min before an earlier announced cutoff |

**Rest:** reserve staggered Green/eval rest and a protected overnight block; write an actual rota after B01 inventory. The original plan's sleep times may already be missed. If the work no longer fits rested capacity, cut optional scope and use the fallback; do not assume three people code continuously. Pair the active phones to real work and keep batteries ready; do not tap a sleeping teammate's phone merely to simulate activity.

**Cut order:** ARCore/BBS/LLM/Kannada first; then unproven voice input, unvalidated lower-layer claims and optional benchmark backends. Protect typed mesh measurement, honest abstention, Hindi output where working, capture evidence and the existing signed-review commitment. If signing/beam still fail, state the missing feature and show the proven loop. Do not silently redefine an incomplete issue as done.

## Red/Green and HackTracker

The [live organiser site](https://iqoo.reskilll.com/) still lists Red as phone-only through Office Kit, the same remaining blocks and CP times, and a TBC submission cutoff. Rubric remains product 30, novelty 20, creative phone use 15, depth 15, Office Kit 10, demo 10. Schedule source inspected: [current site bundle](https://iqoo.reskilll.com/assets/index-B_APmUMd.js), `Xx` (Finale; `Qx` is city schedule) and `Jx` (rubric). Floor instructions override the published timetable.

The [recorded organiser answers](../00-prep/PREP-PLAN.md#7-organiser-answers-received-7-oct-from-the-user-supersede-the-may-code-assumptions-in-01) say Remote PC/coding agents and sideloading/debugging are allowed, evals are not phone-only and scores average across three phones. These are user-reported organiser answers, not a newly verified email. Red-specific ADB remains unconfirmed: default to Office Kit for every phone/laptop link in Red.

- Before Green ends: cache dependencies/assets, save the next issue body as `docs/prompts/Bxx.md`, open the agent session, prepare export/previous-APK folders and write a handoff.
- In Red: phone → Office Kit Remote PC → Claude Code/Codex on the laptop. APK/log files move through Office Kit; install from Files. No direct laptop keyboard/trackpad, SSH or alternate remote-control app. T3 Chat may help think, not bypass the Office Kit control route.
- Three real jobs: engineering/control, capture+tape validation, review/voice/verification. Rotate jobs as dependencies change. Capture, review and every useful scan should contribute evidence. Do not fabricate interactions, hold a file browser open solely for minutes, create heat or consume battery solely for an inferred score.
- Track our actual scan/inference/voice events; keep a human Office Kit work log with phone/time/action if useful. We do not have the live organiser scoring implementation. The May public code's exact weights, package-name heuristics, sum-vs-average and thermal incentives are historical observations, not current scoring requirements.
- Charge when needed and reduce workload under thermal pressure; diagnostic collection should support real development. Rest and a reliable demo take priority over artificial activity. Keep network on for tracker operation during building; test offline inference deliberately, and document local Wi-Fi used by Office Kit.
- Settings/biometric setup uses the permitted Green/floor process; never disable or work around HackTracker. A logged expected install is not evidence of prohibited tampering by itself.

### Agent handoff prompt (save alongside each issue)

> Read AGENTS.md, IDEA.md and the control issue, then implement only Bxx. You are not alone in the codebase: preserve other owners' changes. Use the designated issue branch/worktree and package boundary. Ask the owner before changing frozen model contracts/root build files. Use fixtures for development but never claim they are real scans. Implement the smallest complete path, run the listed meaningful tests and a build, then report commit, files, acceptance evidence, device checks still needed and blockers. App code must be fresh event work; prep/ref_pipeline is only a numeric oracle, not code to copy or port line by line. Do not publish/merge another owner's branch or change scope automatically. During Red, every laptop action must be driven through Office Kit.

## Review dispositions and corrected assumptions

[Opus review](issue-pack/OPUS-REVIEW.md) was an independent architecture/delivery pass. Accepted: early manual fallback, correct model tensor contract/parity, stream-aware quality gate, correlated uncertainty, explicit key enrolment, immutable capture/approval binding, SAF import, duplicate-vs-similarity distinction, early diagnostics, F2 close-bar test and actual runtime/provenance evidence. The generated rule asset header is corrected to v0.1.1 without changing its numerical rules.

Did not adopt wholesale: cutting voice input from the product, declaring all ARCore camera controls impossible, treating every training commit in Red as misconduct, or deliberately avoiding charging. Voice remains a timeboxed CP2 target; ARCore is optional and tested using supported camera ownership; git timestamps do not reveal whether work was driven through Remote PC. Current thermal guidance supports adapting workload, not seeking heat.

[Fable review](issue-pack/FABLE-REVIEW.md) checked the concrete first draft for UX, dependency and workload gaps. Accepted: explicit B25 CP2 gate; B26 final-APK rehearsal after B20 candidate; early review-state contracts; Alwin ownership of key enrolment, P3 verification, beam overlays and tape-entry UI; an actual review-request artifact; a named Lock-mode decision; manual-first recovery if starting from zero; and useful G1 fault discrimination, not coverage satisfied by an arbitrarily wide band. Kept Melvin as the single record-policy owner to avoid simultaneous edits; assigned independent final QA to Sabari and assets to Alwin. Gate times live here and are repeated in issues as current targets; replan centrally if floor timings change.

Key engineering sources reopened 10 Oct:

- [CameraX transforms](https://developer.android.com/media/camera/camerax/transform-output): map analysis coordinates to preview explicitly. B04/B06/B07 own transform fidelity.
- [ARCore camera sharing](https://developers.google.com/ar/develop/java/camera-sharing): shared camera/session lifecycle is an explicit integration, not two independent owners. B22 must prove its actual capture configuration.
- [LiteRT NPU deployment](https://developers.google.com/edge/litert/next/npu): AOT/JIT and native runtime delivery must be validated for the sideloaded offline APK. B02 verifies actual artifacts and backend, not an assumed Maven pin.
- [Android document access](https://developer.android.com/training/data-storage/shared/documents-files): use a user-selected document URI for received packs. B14 handles persistence/revocation.
- [Android thermal API](https://developer.android.com/games/optimize/adpf/thermal): use measured thermal signals to adapt work. B17 logs degradation rather than treating it as a scoring objective.

Open items for B01/the team: app repo/current progress; APK-level NPU packaging/performance and camera parity (export and standalone phone benchmark are now reported); measured print dimensions; biometric/voice assets; floor cutoff; Red-specific ADB/alternate-transport permissions. No Android app source is present in this checkout.

## Published issue index

Generated after GitHub creation in `issue-pack/INDEX.md`; each child has one real assignee, phase milestone, linked dependencies and a copyable agent brief. The control issue holds the complete table and this execution plan so teammates need not wait for these local documents to be pushed.
