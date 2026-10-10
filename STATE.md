# Sariya session state

## Session note (10 Oct): "Open with Sariya"
- Android VIEW intent filter for `content://` files typed `application/json` or `application/octet-stream` (`app.json` → prebuild). `src/app/+native-intent.tsx` rewrites the URI to `/received?uri=…`, which reads it with `readText` and runs the same `receive()` checks; the root layout keeps `(tabs)` underneath for a cold open.
- Release APK (v3 / 0.3) built from this tree, including the scan result drawer, and installed in place on the iQOO with data kept (Gradle needs `JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home`). `query-activities` lists Sariya for a JSON file. Not yet tried by hand from Files, WhatsApp or Office Kit (phone was locked). Any JSON file now offers Sariya; non-Sariya files get "Not a Sariya file".

## Session note (10 Oct): scan result drawer
- Replaced the bouncing spring entrance with a 280 ms cubic ease-out slide; dismissal and cancelled drags also use timing without bounce.
- The fixed handle area now supports pulling down to re-scan, with a visible Re-scan button for every result. Both reopen the same target in place, reset the live feed and temporary tape UI, and supersede the old measurement while retaining history.
- Typecheck, Expo lint and diff whitespace checks pass. No new dependencies or product scope change. Next: verify dragging, cancelled drags, findings scrolling and repeated locks on the iQOO; this session did not rebuild/install the APK or verify the gesture on hardware.

## Session note (10 Oct, ~14:40): UI/UX pass (Uber × Swiggy)
- **Design system** in `sariya-expo/src/components/ui.tsx`:
  - New pieces: tokens (`C`, `SHADOW`, `SPRING`), `Num` (tabular numerals), `Press` (scale plus haptic, built on Animated.View responders because NativeWind won't style an animated Pressable), `Enter`, `Illo`, `Meter`, `Segmented`, `ActionBar` (the "View cart" bar), `Skeleton`, `Details`.
  - The old SVG `art.tsx` is deleted.
  - Brief: `notes/15-ui/UX-PLAN.md`; research: `notes/15-ui/DESIGN-RESEARCH.md`.
- **Art:** 13 clay illustrations plus a hero photo, generated with Codex image_gen and stored as 512 px webp in `assets/images/gen/` (580 KB total). The new orange rebar-grid launcher icon and splash replace Expo's; this needed `expo prebuild` (no clean).
- **UX cuts:**
  - Home: the duplicate "New inspection" bar is gone; a "Continue" card resumes the last-opened draft; start tiles are illustrated.
  - New check: the kind picker is hidden when Home already chose the kind.
  - Drawing values: a standard bar size advances on one tap; "Start over" is dropped.
  - Every screen shows at most one Notice.
  - Hashes, keys, engine and frame counts are folded into Details.
  - Checks is an order-tracking screen (progress, timeline, a tappable "outside limits · show the fix" banner, a sticky next-step bar).
  - PIN is a glove-size keypad sheet; signing ends on a success state.
- **Perf:** a stable `useStore` subscription (it used to resubscribe on every render); native-stack `ios_from_right` transitions.
- **Phone:** the debug dev client (model v3 / 0.3, new icon) is installed for hot reload with Metro. **Rebuild the release APK (`-Psariya.model=v3 -Psariya.threshold=0.3`) before the demo.**
- **Not checked on the device:** the engineer Review, Received, Issue and verifier QR screens (no received pack on the phone). The phone's role and name were changed mid-session (Engineer/Operator "Melly"), not by the agents.
- Nothing is committed yet.

## Session note (10 Oct, ~11:40): live scan UX and speed (`e4b2f1d`, `1f2114c`)
- **Native (sariya-vision):**
  - only mask points within 400 mm of the card are measured, which cuts cables and far clutter;
  - bar geometry no longer uses boxed numbers and tries at most 40 candidates;
  - no per-frame Bitmap, and a buffer swap replaces the freeze copy;
  - Aruco3 card search;
  - the frame log has per-stage timings (`fid= infer= bars= total=`), and the payload adds `luma`, `fidMs`, `barsMs` and `mmToUp`.
- **Scan screen:**
  - a `LiveFeed` store means only the overlay and readout re-render per frame;
  - bars are smoothed across frames in card mm and redrawn with the newest pose;
  - gap labels are green, amber or red against the drawing, using the Lock limit;
  - the headline reads "N of M bars · X mm widest";
  - halos make lines and labels readable on steel;
  - the header shows the real model, accelerator and ms.
  - Test: `bun test src/lib/live.test.ts`.
- **Measured on the iQOO (v3, 0.3):**
  - with the card in view, 5 of 5 bars in 9 of 10 sampled frames;
  - frame about 105 ms (bars 8 ms, model 20 ms), so the card search (70-80 ms) is now the bottleneck;
  - 75 of 85 sampled frames had no card, so finding the card is the biggest UX loss.
- **Open:**
  - false bars on non-steel: raise the threshold to 0.5, add a width/straightness/persistence check per bar, and fine-tune on venue negatives only if needed;
  - placement guide and auto-lock;
  - A/B Aruco3 on/off for card detection;
  - tape error table on the props.

## Status (10 Oct 2026, 09:55, model lane): v3 trained, in the app, recommended
- **v3** is in `models/seg/v3/` (`8aa92ef`); report: `notes/14-model/MODEL-V3.md`. It was trained from v2 plus 2,500 synthetic stirrup scenes.

  | | v1 | v2 | v3 |
  |---|---|---|---|
  | ROI test IoU | 0.846 | 0.811 | **0.851** |
  | False alarms (no-rebar tiles) | 80 % | 0 % | **0 %** |
  | Real-stirrup recall | - | 0.873 | **0.910** |
  | NPU | 12.2 ms | 11.6 ms | **12.1 ms** |

- **Expo app:** a release build with `-Psariya.model=v3 -Psariya.threshold=0.3` is installed on the iQOO (`…001UZ`). Model hashes are verified, it runs on the NPU, and card S is detected.
  - **Still to check:** v3 on the half-scale mesh and the rusty bars (the teammate's earlier replay showed v2 at 0 % there).
  - **Fallback if it misses:** `/tmp/sariya-app-v1.apk` (v1, 0.5), installed with `adb install -r`, keeping data.
- **Recommendation:** make v3 / 0.3 the module default once the prop check passes. That's a one-line change in the sariya-vision `build.gradle`, owned by the app lane.
- **Round 4** (if the props still fail): venue photos of our bars (positives) plus venue clutter (negatives), starting from v3.

## Session note (10 Oct, ~10:00): evaluation deck
- Wrote `deck/eval-deck.html` (7 slides, images embedded; source with placeholders in `deck/eval-deck.src.html`), published as a private artifact: title, site visit, Japan's prior validation, what we built, model research, NPU/GPU/CPU benchmark, fine-tuning v1-v3.
- **Site visit detail added (user-reported, 9 Oct, one site):** engineer visits quoted at ₹5,000-10,000 each, so small/mid houses skip them; the crew insisted any deviation from the drawing gets corrected and only the engineer clears the pour, yet the user saw errors the crew agreed the engineer would reject. Deck labels it "one site, not a statistic".
- Next: G1 tape gate before Eval 2; update the deck's status chips once beam or tape results land.

## Session note (10 Oct, ~09:00): one UI for engineer and operator
- Engineer "Send drawing values" now uses the operator's flow: member + name, then one value at a time on the keypad, then the check list (`components/member-pick.tsx`, `components/spec-form.tsx`). "No drawing" stays operator-only.
- Record (P1) and review (P2) share the evidence list, the sign-off QR card and a Drawing section (`components/record-parts.tsx`); both read Checks → Evidence → Drawing.
- **Decision:** every signature others trust asks for the PIN: capture signing (P1) and issuing drawing values (P2) now join approval and key trust. Demo adds one PIN entry on P1 at signing.

## Session note (10 Oct, ~08:30): end-to-end explainer
- Wrote `notes/08-demo/END-TO-END.html` (published as a private artifact): roles, the 9-stage loop as built, every scenario in rules/pack/measure, user stories, design rationale, the 3:30 demo updated for PIN + slab-only, failure branches, open risks. No spec or code changes.
- Found while writing: P2 shows the sign-off QR right after approval, so the stage QR beat needs no transfer back to P1. P3 can't be both verifier and hot spare (one role per phone), so a spare operator phone must be set up in pre-flight. demo-script.md still says fingerprint/BiometricPrompt and lists F3/F12.
- Next: G1 tape gate on the prop, v2 vs v1 on the prop, two-phone run of spec → approve → QR → replay before Eval 2 (19:00).

## Session note (10 Oct, 07:30): roles clarified, engineer-issued spec
- **Roles (decision):** the designer writes the drawing/BBS (the spec source); the **operator** is the on-site checker (site engineer/supervisor, inspector, builder QC, brand technical engineer); the **engineer** is the responsible engineer, usually remote, who issues the drawing values and approves; the mason hears the fix. IDEA.md "Who does what", §3.1, §4 and §9 updated; demo line 0:20 no longer says "the engineer scans".
- **Gap fixed in the app:** the operator used to type the spec they are checked against. Now P2 → Send drawing values (`app/issue.tsx`) signs a `sariya.spec/1` file; P1 → Drawing values from the engineer accepts it only from an enrolled engineer key and opens a new inspection (same file twice = same inspection). Editing a value drops the signature. Review shows *issued by you · unchanged* (pass), *typed on site* / *issued by another engineer* (extra tick "the drawing values match my drawing" required), or *differ from the issued ones* (approval blocked). The capture hash already covers the spec, so no format change to captures/approvals.
- **Verified:** typecheck, lint; scratch two-phone bun test (19 assertions: issue → receive → dedupe, tamper, unknown key, wrong role, incomplete values, capture round trip shows "mine", forged values show "changed"); mutation-checked. **Not yet tried on two phones.** Dev client relaunched on the iQOO against Metro (app data was cleared: setup screen, camera permission not granted).
- **Stale claims fixed:** IDEA §3.7 and the UX walkthrough no longer say Keystore signs (Ed25519 in SecureStore, signing in JS); pack is `.sariya.json`; demo-script Q3 (ARCore) and Q8 (face blur/GPS) rewritten; new Q8b "who sets the spec"; pre-flight T-50 issues the stage spec from P2.
- **07:45, PIN instead of fingerprint (user):** approval and key trust now ask for an app PIN set at setup (`lib/pin.ts`, `components/pin-prompt.tsx`; salted SHA-256 in SecureStore, 5 wrong tries → 30 s lock). Fingerprint code and `expo-local-authentication` removed (the next native build drops it; the current dev client still carries it, harmless). Scratch PIN test passes (13 assertions, incl. no plaintext stored and lockout).
- **07:45, beam disabled (user):** `COMING_SOON = ['beam']` in `lib/spec.ts`; beam tiles on home, new inspection and the engineer's spec screen show "Coming soon" and can't be picked; a beam spec file is refused. Demo docs: F3 and beam beats cut; stage deck F1, F2 (+F12 if validated).
- **Is the remote-engineer flow how India works?** Our understanding, not verified with an engineer [U]: organised projects use a pre-pour checklist or pour card signed by the site engineer and the consultant/PMC, which this mirrors. Self-built houses mostly have no pre-pour sign-off; the drawing goes to the contractor on paper or WhatsApp, and the engineer rarely visits. A signed digital spec is a new behaviour there, not an existing one. Confirm with one engineer before pitching it as current practice.
- **Open:** solo engineer on site still needs a second phone (same key can't approve its own capture). Two-phone device test of the issue flow and PIN prompts. Re-enable beam after G1 on the beam prop.

## Session note (10 Oct, 07:10): UI pass (Uber-style, decluttered)
- **Nav:** 3 tabs (Inspect/Review/Verify, Records, Settings) in the floating pill bar; Numbers and "How to check steel" moved under Settings (`/numbers`, new `/guide`). Verifier has no Records tab.
- **Kit (`components/ui.tsx`):** `Outline` → `Group` (card of rows), new `Sub`, `TextBtn`, `IconBtn`, `KV`, `Hairline`; TopBar shows record context as a small line above the title. One primary button per footer, secondary actions as text buttons.
- **Screens:** home keeps hero + "New inspection" bar + slab/beam tiles + guide cards, one "In progress" list (engineer-reply row only when something is waiting); checks split Camera / By hand with a progress bar, discard moved to a top-right icon; scan hides the empty "—" readout, engine (NPU ms) moved into the label card; lock sheet uses rows; sign has a "Signed" success state; record/review lead with the record name, fewer notices, safety disclaimer kept on sign, QR and review.
- **Fix:** draft status "n of 6 checked" no longer counts checks still waiting for a tape/scale reading.
- **Verified:** typecheck + lint clean; debug dev client installed on the iQOO (replaces the release APK; rebuild release before the demo). Phone has 3 empty "S1" drafts from this session.
- **Next:** user review of the look; then fix/review screens on device with a real outside finding; release build.

## Session note (10 Oct, 06:55): blur gate, coverage map, saved timings, docs, commit
- **Pulled** caea715 (round 3 prep only, no new model).
- **Blur:** native Laplacian-variance sharpness per frame; live status "Blurred: hold still" when a frame is under 60 % of the sharpest of the last 30; Lock keeps only frames at ≥ 70 % of the sharpest in its window and the re-scan reason counts the blurred ones. Relative, so no camera-specific threshold.
- **Coverage map:** every lock (auto and by hand) stores frame footprint, card/strip outline, bars used and partly seen bars in card mm; signed with the capture and drawn under the evidence on the record and engineer review screens.
- **Timings** buffered per frame and saved to the store when the scan screen closes (5,000 per accelerator); Numbers tab p50/p95 now survive restarts.
- **Docs:** IDEA.md (as-built line, Lock, ARCore dropped, blur, partly seen, coverage, demo beat now "± 5 mm", runtime), demo-script too-far gate, TEAM-BUILD "As built" block telling Sabari not to re-implement runtime/geometry.
- **Verified:** typecheck, lint, 3 JVM + 5 bun tests; release APK installed and launched on the iQOO (Numbers tab reads stored data, no crash on old state).
- **Open (needs people + props):** G1 tape gate; too-far distance at 0.6/0.8 m; v2 (or round 3) on the props; by-hand freeze on device; two-phone sign-off.

## Session note (10 Oct, 06:25): partly seen bars, release build, model swap
- **Under-card misses:** bar continuity now ignores the card's shadow (card + max(10, 1.5·dia) mm) and the other family's crossings (blurred crossing pixels made gaps between bars look like bars). Accept ≥ 0.5, report 0.2-0.5 as **partly seen** (`weak`). On the synthetic v1 mask: 3 bars found, the 2 under-card bars come out as partly seen, crossing noise 0.
- **Re-scan, not false "outside":** locks carry fused `weak` positions (seen in ≥ 30 % of locked frames, not on a counted bar). Count short + any partly seen → re-scan; a wide gap holding a partly seen bar → re-scan, no "add a bar" fix. Dashed amber lines live and on the evidence; live hint "Turn the phone so the bars run up the screen" when bars cross the short side (less visible length).
- **Tests:** 3 JVM unit tests on Bars.kt (`:sariya-vision:testDebugUnitTest`; mutation-checked: removing the crossing exclusion fails one); 5 scratch bun tests on the re-scan rules pass.
- **Build:** arm64-only via the module's config plugin, consumer keep-rules for OpenCV/LiteRT, model version + threshold as one build property (`-Psariya.model=vN -Psariya.threshold=x`, default v2/0.3; unknown version fails the build). **Release APK 107 MB** built and run on the iQOO: model v2 on NPU 18 ms, loads 121 ms; live scan runs; strip_300 detected live. Strip prompt now says "Find strip_300".
- **Model-team ask (round 3):** positives with card S / strip_300 lying on the bars, labelled right up to the card edge (the card itself = not bar); cheap version: paste the printed card onto ROI-1555 tiles and mask the occluded pixels. Plus rusty bars on warm wood/concrete. v2 marks 0 % on a synthetic card-S mesh where v1 marks 9.5 %.
- **Later (06:40):** screens with no open record now redirect home instead of rendering blank (process death could strand the user on a black scan screen); the fix screen keeps a one-frame blank while it closes. Locks and the readiness row carry the model sha (`seg v2 7ad05e742fad · NPU · n ms`, from the build).
- **Open:** by-hand freeze not re-tested on device; G1 tape gate (10 tape-checked scans, 8/10 in band) not run; no blur/sharpness, distance or tilt gate (marker-px only, threshold scaled from 4K, unvalidated on the 1080p stream); no lens undistortion or calibration; no out-of-plane term for the lower layer; coverage map not built; timings are in memory only; two-phone path untested.

## Session note (10 Oct, 05:50): model v2 connected to the Expo app (live, on the NPU)
- **Pulled** `origin/main` (75501c0: v2 model + round 3 prep); local uncommitted work kept, STATE.md conflict merged by hand.
- **Built** `sariya-expo/modules/sariya-vision` (local Expo module): CameraX 1.6 preview + analysis at 1920x1080, OpenCV 4.10 ChArUco (card S, ids 360-377) / ArUco (strip_300, ids 450-461) homography, LiteRT 2.3 model v2 (NPU precompiled file, else GPU, else CPU; threshold 0.3), bars as one parallel family in plane mm (angle search near the card axis, offset-histogram peaks, length + continuity gates, card region excluded). Scan screen now shows live model lines, gaps and "MODEL V2 · NPU n MS"; Lock fuses ~1.2 s of frames (modal count, per-bar median, band = scatter + mask-edge + 1 % scale, floor 5 mm) and saves the analysed frame as evidence with the model's own lines. Simulated engine removed; old `simulated` locks still labelled.
- **NPU libs:** the 4 QAIRT 2.50.0.260828 `.so` files were pulled from Qualcomm's SDK zip by HTTP range (22 MB, not the 2.6 GB) into the module's git-ignored `jniLibs/`. Each teammate must copy them in (README).
- **Verified on the iQOO 15:** readiness row "Model v2 on NPU: 21 ms a frame, loaded in 134 ms"; live loop ~65 ms/frame (~15 fps) with model 20-21 ms; real printed card S detected live (25/25 corners, outline aligned on screen); v2 marks no bars on the wooden desk (correct). Synthetic card-S mesh (known truth) via photo replay: **v2 marks 0 % bar pixels** (also 0 on the Mac float model: v2's known recall loss on rusty bars on warm backgrounds); with v1 weights the same app geometry gives gaps 50.1 / 49.9 / 64.9 mm vs truth 50 / 50 / 65.
- **Compat fixes:** LiteRT 2.3.0 ships Kotlin 2.4 metadata vs Expo 57's Kotlin 2.1 → `-Xskip-metadata-version-check` scoped to the module. PreviewView needed `shouldUseAndroidLayout` (black preview otherwise). Capture packs now pin `liveEngine` per capture so records signed by the old build (`simulated`) still verify.
- **Open:** (1) test v2 on the real prop mesh before the demo; if it misses bars, swap `models/seg/v2` → `v1` in the module's build.gradle (one line) or use round 3. (2) A missed bar currently reads as a short count ("outside"), not "re-scan": consider gating count on mask coverage. (3) Tilt/distance gates need intrinsics (not yet). (4) Debug APK 119 MB arm64-only; release build should restrict ABIs to arm64-v8a. Nothing committed.

## Status (10 Oct 2026, 08:30, model lane): round 3 still training; switch the app to v1 for CP1
- **Round 3** = v2 + 2,500 synthetic stirrup scenes (`tsrobcvai/Synthetic_Dataset_for_Stirrup_Rebar_Segmentation`, uploaded as JPEG tiles to the private dataset `sariya-stirrup-tiles`) + negatives (400 wires, 200 COCO desk, 200 indoor); 12 epochs.
  - Kaggle kernel `sabarinarayanakg/sariya-unet-train-r3c`, pushed 06:04. Still RUNNING at 08:30, ~60 min past the estimate.
  - Its live log never streamed to the CLI. When it finishes: `kaggle kernels output sabarinarayanakg/sariya-unet-train-r3c -p runs/r3`, then read `train_log.json` → `round2_compare`. That holds ROI IoU, the false-alarm rate, and stirrup-real recall, for v2 vs v3.
- **CP1 at 10:00: switch the Expo app from v2 to v1.**
  - **Why:** the 05:50 note above shows v2 marks 0 % bar pixels on the card-S mesh replay, while v1 gives gaps of 50.1 / 49.9 / 64.9 mm vs the truth 50 / 50 / 65.
  - **How:** one line, `models/seg/v2` → `v1` in the sariya-vision module's build.gradle.
  - **Safety net for v1's false lines on cables and screens:** the card zone and the straightness filter.
- **Data sources checked:**
  - **Dropped SORD** (`bugwei/synthetic_on-site_rebar_data`, CC BY-NC): background and rusty bars are left unlabelled, which would teach "rusty bar = not bar".
  - **Real stirrup photos:** only the top bars are labelled, so they are scored by recall only and never trained on.
- **Kaggle lessons (9-10 Oct):**
  - Without phone verification, GPU jobs silently run on CPU with no internet.
  - **Deleting a notebook does not stop its running session.** A leftover session (round 3b) still blocks the second GPU slot ("Maximum batch GPU session count of 2"). Stop it in the browser: profile → View Active Events.
  - The CLI live log (`kernels logs -f`) gave 500s or nothing for script jobs; the stored log works after the job ends.
  - Anonymous Hugging Face downloads are throttled to ~1-1.5 files/s, so 2,733 files take ~30-45 min. Pre-tile and upload instead.
  - Upload from the venue runs at ~1-4 MB/s. JPEG tiles are ~6x smaller than PNG.
  - Datasets are found by slug, not by crawling `/kaggle/input` (COCO has 160k files). The old crawl also risked picking the wrong `dataset.json`.

## Status (10 Oct 2026, 04:10): model v2 (hard negatives), v1 stays default
- **v2** is in `models/seg/v2/`; report: `notes/14-model/MODEL-V2.md`. It was fine-tuned from v1 with 1,100 public no-rebar images (wires, COCO desk objects, indoor scenes), built directly on Kaggle.
  - **Fixed:** false alarms on no-rebar tiles fell from 80 % to 0 %. On the phone, cables, keyboards and screen text are ignored.
  - **Broke:** ROI test IoU fell from 0.846 to 0.811, and on the phone v2 misses rusty bars on a wooden desk. v1 misses one of the two as well.
- **Decision:** v1 stays the default for the frontend; v2 is experimental (threshold 0.3). Round 3 adds **more bar images**: public rebar sets plus venue bar photos, so both failures are fixed together.
- **Test app** (local, `~/Developer/narayana/sariya-app`, not pushed) now bundles v1 and v2 with on-screen switches (model, zoom 1x / 1.7x centre crop). Use it for side-by-side checks at the venue.

## Session note (10 Oct, 05:10): end-to-end UX flows rebuilt in `sariya-expo/`
- **Done:** every screen of ux-flows.html / UX-TECH-WALKTHROUGH steps 0-12 now exists in the Expo app, in the existing Uber-style kit. Roles per phone (operator / engineer / verifier) chosen at setup; readiness screen checks camera, Hindi/Kannada TTS voices, fingerprint, signing key and storage for real.
- **Operator:** member (slab, beam) → spec (type each value, DEMO PROP preset, or measure-only; "not on drawing" never borrows a default; edits make a new spec rev and clear fresh locks) → scan (live ~mm, Lock with progress, frozen evidence photo with gap labels, re-scan with a written reason) → manual tap-to-mark (4 card/strip corners + bars, homography, same gates, MARKED BY HAND) → readings by hand (cover tape, 200 mm weigh test with IS 1786 bands, 135° hook only if the drawing asks) → checks sheet (five answers, no overall badge) → fix (Hindi/Kannada/English subtitles, offline system TTS, auto-play, stop/repeat, "audio unavailable" state) → sign (Ed25519 key in SecureStore) → send pack (.sariya.json via share sheet; Office Kit is a share target on the iQOO) → open approval or review request → sign-off QR; new revision for requested views or rescans.
- **Engineer:** open pack from the file picker → hash, signature and every photo hash checked; unknown signer = view-only; same key = blocked; replay = "already processed" → review desk → "I reviewed" + fingerprint approve, or signed request for another view → send back. **Verifier:** scan sign-off QR offline against enrolled keys. Numbers tab: lock counts by source, abstentions, error table from tape rows (simulated rows excluded), CSV export, NPU/GPU/CPU "no data".
- **Removed (complexity, no value):** Viro AR view and dependency (ARCore only anchors; the Viro view had no torch or capture), column/footing/other members, seeded fake records, fixed-PIN "engineers". `modules/arcore-check` is left in place but unused.
- **Verified:** typecheck + lint clean; scratch bun tests of the rulebook (CONTROL, F1, F2, F4 incl. re-scan band, beam F3 "add 1", weigh test, measure-only) and the two-phone trust loop (tamper, photo swap, replay, unknown keys, QR forgery, revision isolation) pass. Dev client rebuilt (prebuild --clean) and installed on the iQOO; operator flow driven on device through scan, lock, manual mark, readings, Hindi fix, sign and share sheet.
- **Open:** live values remain simulated until `useLive()` in `src/lib/measure.ts` is replaced by the real pipeline. The two-phone engineer/verifier path is tested in code, not yet on two phones. The loaner has **no fingerprint enrolled** (engineer phone needs one). Device holds this session's test records (Slab S1 rev 1/2); clear app data before the demo. Hindi/Kannada wording still needs a native speaker. Nothing committed.

## Session note (10 Oct): Expo app merged and device build
- User clarified the app is on `origin/expo-app`; removed Expo Go and its downloaded APK at their request.
- Merged `origin/expo-app` into local `main` with merge commit `93971f0`; existing uncommitted research/document changes preserved. App source is `sariya-expo/`.
- Installed locked npm dependencies; TypeScript and Expo lint pass. Android development build succeeded using existing Homebrew Java 17 (bundled Java 25 failed CMake configuration). Installed `in.sariya.app` and verified the Records screen renders on the iQOO.
- Metro remains running on localhost:8081 with USB forwarding and the development client connected. Restart/build commands added to `sariya-expo/README.md`. Merge and device README pushed to GitHub main; pulled and verified synchronized at `83d4672` (10 Oct). Remote commit `4e37f7f` was merged first; pre-existing uncommitted work remains local.
- Device check initially said install ARCore, then resolved to Ready; installed Google Play Services for AR is 1.56.262080393. No AR camera session was validated.
- Current measurement values are simulated by `src/lib/mock-measure.ts`; next development step is integrating/validating the real vision pipeline. Existing seeded records are demo data.

## Status (9 Oct 2026, 23:55): base segmentation model v1 trained
- **Data:** ROI-1555 downloaded and verified (1,555 images, 10,481 bar instances, 0 errors; `prep/train/verify_labelme.py`), tiled by `prep_data.py`: train 853 / val 271 (scen1) / test 427 (scen2+3). Not used: ConRebSeg (22.6 GB, demolition scenes; index checked: 41,237 ExposedBars masks), Roboflow (needs a key), whiesty (Baidu only).
- **Training:** Kaggle T4, private kernel `sabarinarayanakg/sariya-unet-train` v4, pushed by `prep/train/kaggle/push_train.sh` (offline: wheels + timm `mobilenetv3_large_100.ra_in1k` in the private dataset `sariya-train-deps`). 50 epochs, 17:17-18:17 UTC, git `b5df62c`, ~70 s per epoch.
- **Result:** best val IoU 0.871 / F1 0.931 (epoch 48); **held-out test IoU 0.847 / F1 0.917**. Weights at `~/sariya-data/runs/base_v1/unet_mbv3_1152.pt` (27 MB, sha256 203ef1f8…). Misses: thin or distant stirrup legs; false positives: shiny aluminium rails. Keep bare metal out of the demo frame.
- **Speeds:** M5 trains at 6 img/s at batch 2 max (16 GB RAM, swap full); the T4 at ~12 img/s, CPU-augmentation bound.
- **Kaggle:** GPU and internet came only after phone verification; before that, jobs ran CPU-only without a warning. The Colab CLI (`google-colab-cli`) is installed but not signed in.
- **Export and benchmark (10 Oct, 01:15):** `models/seg/v1/unet_mbv3_1152.tflite` (float, exact parity with PyTorch). On the iQOO 15: **NPU 12.2 ms in burst mode** (all 160 layers on the HTP; 12.8 ms sustained over 60 s, no throttling), GPU 19.8 ms, CPU 235 ms. **Gate G0 (< 25 ms on the NPU) passes.** The NPU needs QAIRT 2.50 libs (the CLI's pinned 2.47 is rejected), burst mode and a JIT cache (first compile 53 s, cached 4-8 s). SM8850 AOT failed for the same QAIRT reason; JIT makes it optional. Full report: `notes/14-model/MODEL-V1.md`.
- **Pre-compiled NPU model** `models/seg/v1/unet_mbv3_1152_sm8850_qairt250.tflite` (pulled from the phone's JIT cache): loads in 133 ms, 11.6 ms per frame. A test app (local only, `~/Developer/narayana/sariya-app`, not pushed) ran it live: **NPU 13 ms, 31 fps**. The frontend teammate integrates the model into their app using `notes/14-model/MODEL-V1.md` § Integration guide.
- **Open:** the prep repo `Melvin0070/sariya` is public and now holds the v1 weights plus two ROI-1555 photo sheets (`models/seg/v1/*_sheet.jpg`; the dataset declares no licence). Decide whether to keep them public.
- **Next:** prop photos for round 2.

## Session note (10 Oct): UX + tech demo walkthrough
- Wrote `notes/08-demo/UX-TECH-WALKTHROUGH.md`: steps 0-12 (readiness → spec → live scan → Lock → verdict → Hindi fix → physical readings → beam → sign → review/approve → verify → replay → numbers), the tech under each, and the 3:30 run mapped to steps.
- Flagged stale lines in demo-script §5: Q3 (ARCore "not supported"; it installed 9 Oct) and Q8 (face blur/GPS, not implemented). Not yet edited in demo-script.md.
- No spec or stack decisions changed. Every screen is still "designed", not confirmed built.

## Status (10 Oct 2026): assigned end-to-end build issues published

- **GitHub control (deleted 10 Oct):** all 27 issues (#1 control, #2-#27 = B01-B26) were closed as not planned, then deleted at the user's request; local copies in `notes/12-event/issue-pack/` and all links now point there. Originally created and verified **27 open issues**: control + 22 baseline implementation/integration/release tasks + 3 optional tasks + 1 post-event product-validation task. All have real owners, phase milestones, linked dependencies, acceptance/device checks and Claude Code/Codex briefs. Nothing is marked implemented merely because a deadline passed.
- **Owners:** Alwin (`AlwinSunil`) UI/UX, speech, review screens and demo assets; Sabari (`NarayanaSabari`) AI/vision, calibrated geometry and device QA; Melvin (`Melvin0070`) rules, signing/transport and integration. Collaborator handles and display names verified through GitHub. Melvin is treated as the third owner based on the three-member repo; no separate app repo was supplied.
- **Current execution:** `notes/12-event/TEAM-BUILD.md`; offline issue copies/index, data manifest, independent reviews and interactive board in `notes/12-event/issue-pack/`. All issue bodies and the full control plan are already on GitHub; local document edits are not committed/pushed by this session.
- **Reviews:** delegated Claude Opus 5.5 for architecture/trust/critical path, then Claude Fable 5.1 for the concrete UX/dependency schedule. Findings incorporated and dispositions recorded. No extra app implementation agents were started.
- **Live research:** organiser site bundle checked around 00:20 IST. Remaining Red/Green blocks, rubric and checkpoint times unchanged; submission cutoff still TBC. Android camera transforms, shared camera, document access, NPU deployment and thermals reopened as primary sources. Browser snapshots timed out twice; site bundle read directly instead.
- **Checks:** all 26 child assignees, milestones, labels, dependency URLs and the control index verified against GitHub; issue graph has no cycles; referenced local source paths exist; `git diff --check` passes. Only rule JSON metadata changed, not numerical values. No Android build was claimed or performed.

## Decisions (10 Oct, build issue session)

- Preserve v4 live lines + approximate mm + explicit Lock. Freeze stream/transform/evidence contracts early; the old 45 px threshold is a 4K reference, not an unconditional preview threshold. Correlated frames cannot shrink systematic error. The initial field floor remains 5 mm until measured.
- Keep the full-loop target with gated voice input; typed entry/Hindi output first. Build manual marking before CP1. If B01 finds no app already underway, plan manual CP1 and accept automatic mode only after its measured gate. Do not pretend 8.5 hours of serial vision work fits the remaining pre-CP1 freeze window.
- Enrol trusted device-key fingerprints explicitly; signing binds immutable locked evidence/spec/version hashes. Approval uses the second phone/key and binds the capture payload. Use Android document URIs for Office Kit files. Perceptual similarity warns; deterministic record/hash duplicate protection must allow legitimate rescans.
- Alwin also owns enrolment/P3 verification screens, beam overlays and tape-entry UI. B25 owns CP2 integration; B20 creates the candidate and B26 verifies the final APK/rehearsal/submission. Deck/video moved off Melvin to Alwin.
- ARCore/BBS/Kannada/LLM remain optional; field validation, credential identity/revocation and privacy extensions are post-event. No unsupported face-redaction/GPS/liveness claim in the event scope. Proposed rule tolerances still need an engineer; corrected generated asset header to v0.1.1 to match its existing values.
- Red work uses Office Kit from phones; current scoring weights are not independently known. Useful capture/review/testing, healthy thermals, charging and rest replace old heat/drain/artificial-tapping advice. No tracker alteration or synthetic activity tasks were created.

## Open questions and next step (10 Oct)

- **Start:** Melvin B01/#2; Sabari B02/#3 artifact audit; Alwin B03/#4 UI/spec preparation. B01 first inventories any existing app/repo/APK so the team does not rebuild completed work. Then follow control issue #1.
- Unknown: app work in another repo, actual exported/trained model and phone runtime, measured prints, configured fingerprint/offline voice, floor cutoff and Red-specific ADB permission. Time elapsed does not answer any of these.
- The repo still contains no event Android app source. This session created the work queue and design corrections only, preserving pre-existing STATE.md edits.

## Status (9 Oct 2026, 20:05): v4, the team's live AR camera vision
- **IDEA.md is now v4.** A camera app that draws a live line on every bar, with the mm between them from the card, and a Lock step for the verdict. Comparison and design: `notes/13-ar-vision/AR-VISION.md`.
- **ARCore, checked on the loaner over ADB:** Google's web list omits the iQOO 15 (I2501), but Play installed ARCore 1.56 after sign-in, so it is certified. Session and Depth API are untested (gate G0c).
- **Loaner facts** (EVIDENCE.md): main camera Camera2 level 3, focus down to 0.10 m; the tele can't focus under 0.65 m; no ToF; the NPU runtime libs are present; HackTracker is running.
- **BUILD-PLAN.md:** §0 item 1 and the CP1 row now include AR lines and Lock; gate G0c (ARCore probe, 20 min max) was added. EVAL-CARDS.md CP1 script and demo-script.md are not yet updated for the "judge slides a bar" beat.

## Decisions (9 Oct, 20:05)
| Change | Reason |
|---|---|
| Live per-bar AR lines with mm labels; Lock fuses ~15 frames; only locked values get a verdict | The team's vision; live single frames are noisier than a fused value |
| The card measures; ARCore only anchors the overlay and coverage map, and only if G0c passes | ARCore tracks to ±1-5 cm, too coarse for 50 mm spacing; the card gives ±2-5 mm |
| AI does one job: NPU bar segmentation on every frame. Card pose, lines, mm and the verdict stay maths and rules | Auditable numbers; "AI finds the bars, maths measures them, rules decide" |
| Lines from a card-plane profile of the mask; Zhang-Suen and Hough only as a fallback | < 5 ms per frame, and bars are tracked in card mm, so the overlay doesn't jitter as the phone moves |
| No sideloading on the loaner; ARCore came from Play | HackTracker is running; sideloading as tampering was an open question |

## Open questions (9 Oct, 20:05)
- Does the team keep voice, the Hindi fix and the signed record in Tier 1, or go camera-first?
- G0c: does an ARCore session run alongside the needs of the 4K still (ARCore owns the camera)?
- Sign the team Google account out of the loaner before returning it.

## Next step (9 Oct, 20:05)
B runs G0 (NPU) by 20:15, then G0c (ARCore probe) by 20:45. P4 draws lines instead of the mask; P5 runs live with Lock. Update EVAL-CARDS CP1 and demo-script.md with the AR beat.

## Session note (9 Oct): build-flow walkthrough requested
- Explained the user journey from drawing/spec entry through camera capture, on-device measurement, deterministic rule checks, spoken correction, and signed Office Kit review.
- No product or stack decisions changed; the current implementation sequence and fallback gates remain in `notes/12-event/BUILD-PLAN.md`.
- Next step remains the event kickoff sequence below.

## Status (9 Oct 2026, 18:00): event build plan ready, plan cross-checked
- **Event plan:** `notes/12-event/BUILD-PLAN.md`. It covers:
  - Red/Green rules and how the phones score;
  - lanes A/B/C;
  - the block-by-block plan with sleep in Green only;
  - gates G0-G5;
  - half-scale constants (§7, the single source);
  - claims;
  - the submission kit;
  - kickoff questions.
- **Checkpoint cards:** `notes/12-event/EVAL-CARDS.md`. CP1 = mesh loop + Hindi fix; CP2 = + beam, voice spec, Office Kit sign-off; CP3 = the full pitch.
- **Cross-check:** `notes/12-event/ERRATA-2026-10-09.md`. The worst find was the single-gap tolerance, a flat 25 mm: every half-scale stage fault read "re-scan", never "outside". It is now max(15, 25 %), in rulebook v0.1.1 with `rules.json` regenerated.
- **Reference pipeline** (prep code, before the clock) now knows card S and strip_300, has a marker-pixel abstention gate, and a 0.2 m minimum distance. 32 tests pass, including 7 half-scale ones.
- **Live site, 17:25:** timetable and rubric unchanged. Finale jury published: Goutam Kurumella (AWS), Madhav Bissa (nasscom), Pradipta Dash (Avashya), Siddhant Agarwal (ClickHouse), Venkat Ragothaman (Microsoft), Vivek Sridhar. Submission cut-off still TBC. Sat 13:00-15:30 is labelled "laptops closed".

## Decisions (9 Oct)
| Change | Reason |
|---|---|
| Eval 1 = mesh loop + Hindi fix + accelerator chip; signed record only if ready | Three files defined Eval 1 differently; the cards pick the smallest honest promise |
| App code written fresh from the prompt text; the Python is a test oracle only | A line-by-line port of pre-event code reads as pre-built work |
| No APK on the loaners before 19:00; Red-block APKs go by Office Kit file transfer only | Fresh-code rule; Red = Office Kit is the only phone-laptop route |
| Sleep in Green or eval blocks only; every phone alternates Remote PC and app scanning in Red | Device score is the per-phone average; idle-in-Red warnings are penalised |
| Shared debug keystore in the event repo | Different laptop keys break APK updates, and an uninstall wipes the approval key |
| Single-gap tolerance max(15 mm, 25 %), severity M | A flat 25 mm breaks the half-scale demo |
| Pitch ask = one brand, a 60-pour pilot from November | Matches gtm.md |

## Open questions (9 Oct)
- Ask at kickoff:
  - the submission cut-off time;
  - wireless ADB in Red;
  - one Remote PC per phone/laptop pair;
  - whether `docs/` with pre-event design docs may stay in the repo;
  - HackTracker in airplane mode.
- Status of the pre-event assets (BUILD-PLAN §3.1): trained .tflite, AI Hub profile, ASR/TTS/LLM files, warm Gradle cache, wav set. Fill this in before 19:00.

## Next step (9 Oct)
At 19:00, follow BUILD-PLAN §4.1:
- A sets up the repo by 19:25;
- B runs P1 + G0 by 20:15;
- C writes the parser and number words.

Write the Red prompt files before 21:00.


## Status (7 Oct 2026): SHORTLISTED for the Grand Finale
- Sariya was shortlisted. Event: Fri 9 Oct 17:00 check-in, 19:00 kickoff, to Sun 11 Oct 18:00 results, Bengaluru.
- Workspace moved to `~/Desktop/sariya` (copied from `iqoo-finale-ideation/sariya`; originals untouched). Shared context now lives in `context/`.
- Next: finale prep, 7-9 Oct. Pending workstreams: 5 feasibility plan, 6 rulebook, 7 data plan and demo props, 8 demo script, 9 GTM, 11 name. App code still waits for the event (fresh-code rule); `build/` is empty on purpose.

## Status (7 Oct 2026, evening): finale prep plan written
- Master plan: `notes/00-prep/PREP-PLAN.md` (priority list, model plan, laptop/device prep, data and props, rulebook, finale timetable, organiser email, two-day schedule for three people).
- Six research reports, all claims tagged V/S/U with URLs: `notes/00-prep/tracker-officekit.md`, `notes/05-feasibility/{vision-stack,speech-llm-ocr,device-devenv}.md`, `notes/06-rulebook/rulebook.md`, `notes/07-data-plan/data-and-props.md` (+ `make_fiducials.py`, print-ready PDFs in `print/`, CSV sheets in `sheets/`).
- Workstreams 5-9 and 11 are done as documents: `notes/08-demo/demo-script.md`, `notes/09-gtm/gtm.md`, `notes/11-name/name-check.md`, `notes/05-feasibility/event-prompts.md` (module layout, Gradle pins, 18 build prompts, hour-1 list, jury cheat sheet). `prep/` holds the Python reference pipeline (25 tests pass; the Kotlin port mirrors it) and the training/export/profile scripts (`prep/README.md`). None of it is app code.

## Decisions (7 Oct)
| Change | Reason |
|---|---|
| Application ID will contain "camera"; scan screen class named with "Camera"; Remote PC (phone drives laptop) in every Red block | The organiser's public HackTracker code (May 2026) credits camera use only by foreground package name and Office Kit only while an Office Kit screen is in front on the phone; no mic or NPU signal exists in that code. Confirmed with the organisers by email (pending) |
| Vision primary: 2-class semantic U-Net-lite (MobileNetV3 encoder, 1152x640) + classical centrelines; fallbacks DeepLabV3+-MobileNet (AI Hub), YOLO26n-seg (AGPL), Frangi ridge filter | Instance masks are quarter-resolution; thin bars become 2-4 px. Semantic + line fit matches how MLIT and the papers measure |
| Speech: IndicConformer CTC via sherpa-onnx; Piper Hindi TTS; Kannada via Indic-TTS ONNX or system voice or pre-rendered clips; Gemma 4 E2B on GPU, Qwen3-0.6B GGUF fallback | Benchmarks and licences in speech-llm-ocr.md; still no SM8850 NPU Gemma build |
| Rulebook: IS 13920 hook extension is 8d / 75 mm (Amendment 1, 2017); "optional in Zone II" wording; spacing tolerance defaults proposed, engineer to confirm | Primary texts opened on archive.org. IDEA.md §3.5 and §8 updated |
| Fiducials: one dictionary (DICT_5X5_1000) with ID ranges for cards, strip, calibration board, template | One detector in the app; PDFs generated and self-tested |

## Open questions (7 Oct, added)
- ~~Organiser email~~ answered 7 Oct (PREP-PLAN.md §7): tracker detects camera/mic/NPU for any app; Remote PC counts and is allowed in Red; sideloading and ADB allowed; device score is the average of the three phones; pre-trained and pre-fine-tuned weights and this week's labelled photos allowed; evals are not phone-only; steel props allowed; Install via USB enabled, no vivo account. Still open: submission cut-off time, jury list, HackTracker behaviour in airplane mode, Office Kit account requirement on the laptop side.
- Whether the LiteRT NPU runtime arrives via the Maven artifact or the runtime zip on a sideloaded APK; prove on a spare phone before Friday.
- U-Net-lite NPU latency (AI Hub profile job pending); switch to DeepLabV3+ if > 25 ms or any op on CPU.
- vivo account / "Install via USB" demand on OriginOS 6; ask at check-in.
- Spacing tolerance and the 11 rulebook ambiguities: structural engineer, Thursday morning.

## Next step (7 Oct)
Work PREP-PLAN.md §1 in order: send the organiser email, prove the NPU path on a spare phone, print the fiducials, start site visits, start the pre-training run. Then WS8 (demo script) and WS9 (GTM) as documents during the Sunday 01:00-06:30 Green block at the latest.

## Status (5 Oct 2026)
- **Workstream 10 (submission kit) is done, ahead of the queue, because the Phase 1 deadline is tonight: 5 Oct 2026, 23:59 IST** (read from the organiser's site code; `notes/10-submission/registration-form-fields.md`). The direct-entry window is open until then.
- **Files:** `SUBMISSION.md` (title, 1,925-character description, team-box templates, organiser email), `SUBMISSION_DECK.html` (source) and `SUBMISSION_DECK.pdf` (nine landscape slides), `notes/10-submission/` (fact-check and stack check, rubric plan, six-idea comparison and the Sariya-versus-Sugam screening reviews in `reviews/`).
- **Independent scores (fresh reviewers, 4 Oct):** in a six-idea comparison Sariya ranked first with all three reviewers (product 47.3 of 90, rubric 72.0 of 100). Against Sugam on screening only: 37, 37, 41 of 50 against 35, 35, 38. Scope fit is the weak factor (5, 5, 6).
- **IDEA.md is now v3** (submission version). Nothing was submitted and nobody was contacted by the agent.

## Status (1 Oct 2026)
- **Workstream 1 (red team) is done.** Verdict: **WOUNDED** from all lanes. Synthesis in `notes/01-redteam/VERDICT.md`.
  - The core survives: count and spacing against a card on real steel.
  - The v1 pitch doesn't.
- **IDEA.md is now v2.** The red team's rescue is applied; v1 lives in `context/shared/DEEP-RESEARCH-2026-09-30.md` §3.
- **EVIDENCE.md** was re-graded: V/S/U statuses, new X (refuted) rows, and competitor and market rows added.
- **Consensus scores, v1 → v2 (hypotheses):**

  | | v1 | v2 |
  |---|---:|---:|
  | Screening /50 | ~36 | ~41 |
  | On-site /100 | ~61 | ~77 |
  | P(podium) | ~6% | ~16% |

  Product lens: 44/90 (self-score was 61).
- **Blocker (unchanged):** is the Finale direct-entry window open, and how many direct slots are there? The public site shows no deadline, the panel is still unannounced, and only the dashboard or an email will tell.

## Decisions
- 2026-09-30: workstream order is 1 red team → 2 evidence → 3 competitors and alternatives → 4 features → 5 feasibility → 6 rulebook → 7 data plan → 8 demo → 9 GTM → 10 shortlisting and submission kit → 11 name. Items 2-4 are new; the old 2-8 became 5-11. The submission kit may jump the queue.
- **2026-10-01, from the red team (applied to IDEA.md v2):**

  | Change | Reason |
  |---|---|
  | The operator is the person paid to check (owner's engineer or inspector, builder QC, brand technical engineer), scanning the evening before the pour. The mason hears the fix | A FAIL incriminates the mason and costs him a gang-day |
  | The live claim is count, spacing and stirrup spacing by zone on planar faces, with error bands and abstention | These are the only checks the physics supports |
  | Diameter, cover and hooks become physical prompts: weigh test, tape, template | A 10/12 mm envelope gap of ~0.84 mm; the 2-D hook ambiguity; bottom cover can't be seen |
  | Cut the "pour-permit QR"; add two phones and two keys (the engineer signs with their own key); Office Kit is the engineer's review desk; a replay test replaces the JPEG edit | The permit permits nothing; the old approval was signed with the mason's key |
  | Cut multi-view triangulation, the drawing-extraction LLM, all of Tier 3, free-form voice chat, and the Babusapalya opener | Risk without score; 48-h capacity |
  | Rewrite the novelty line: "Japan's MLIT has accepted camera-based rebar inspection since 2023; we rebuilt it for India's self-built pour" | The v1 line was false (AIJO 配筋王 verified; IHI, Kentem and more) |
  | Stay with Sariya over Mauka for now | Codex judges the rescued Sariya still better for a cold jury; Mauka's 57/90 is self-scored. Re-compare after Mauka's own red team |

- **Provisional, needs the user:** track = **Open Innovation**. Codex recommended Productivity and the Finale jury Open Innovation, and both call Community App track-gaming. Switch to Productivity if the Finale has per-track awards.

## Open questions
- **For the organisers (send now):**
  - the entry window and the number of direct slots;
  - public pretrained weights, and fine-tuning at the event;
  - per-track awards;
  - steel props on stage;
  - the Finale Green/Red timetable.
- **For the rulebook (workstream 6):**
  - the IS 13920 hook extension in the current edition (6d/65 mm or 8d/75 mm) and its scope clause;
  - who sets the spacing tolerance (IS 456 gives none).
- **For the site visits:**
  - defect prevalence and error bands;
  - contract form;
  - who is present at the pour;
  - whether a brand engineer comes;
  - whether the crew prefers Hindi or Kannada.
- The mason "work passport" is unevidenced (hiring runs on referrals). It stays on the roadmap only.

## Next step (5 Oct)
For the user, today: (1) open `SUBMISSION_DECK.pdf`, add team names, rebuild; (2) sign in, register for the Grand Finale, create the team, lock Open Innovation, paste from `SUBMISSION.md`, upload the deck, submit before 23:59 IST; (3) send the organiser email. Then 6-8 Oct: site visits with a tape (workstream 7), one structural engineer on record, build the pitch kit, and workstreams 5-6 (feasibility plan, rulebook) using `notes/10-submission/research-2026-10-05.md`.

## Earlier next step (1 Oct)
Workstream 2 (why-now evidence and news). It starts from the leads in VERDICT.md, re-opens every [S] claim before it goes on a slide, and hunts for:
- fresher Karnataka triggers;
- any Indian study of reinforcement defects.

## Log
- 2026-09-30: folder created; spec, evidence and brief written.
- 2026-09-30: workstreams re-planned (CLAUDE.md). Added 2 why-now evidence, 3 competitors and alternatives, 4 feature sharpening; the old 2-8 are now 5-11, and the submission kit also covers shortlisting. Workstream 1 (red team) started: Codex xhigh, a two-lane Opus jury (industry, Finale) and a physics lane, all in notes/01-redteam/.
- 2026-10-01: workstream 1 done.
  - Lane files: codex.md, jury-industry.md, jury-finale.md, physics.md.
  - Synthesis: VERDICT.md.
  - IDEA.md rewritten to v2, EVIDENCE.md re-graded, and CLAUDE.md's one-liner and workstreams 5, 8 and 9 aligned with v2.
  - Verified personally: AIJO 配筋王 (MLIT July 2023 guideline, NETIS). The public site still shows no deadline and no Finale panel.
- 2026-10-05: workstream 10 done (see Status). Fact-check and stack check by two fresh sub-agents (`notes/10-submission/research-2026-10-05.md`). Corrections applied: IS 456 secondary-bar limit is 300 mm; Bengaluru is Zone II; Gemma 4 E2B has no NPU build for SM8850; MLIT guideline confirmed by opening the PDF. Decisions: Tier 1 cut to four items; compute split stated; Office Kit two-way; collapse statistics kept out of the submission; track Open Innovation. Still open: organiser answers (pretrained weights and fine-tuning, props, tracker), site data, an engineer on record, Camera2 level and Kannada voice on the loaner, model licence choice.
- 2026-10-05: deck rebuilt as nine landscape slides (HTML source, PDF export; no overflow, three slides checked by eye). Folder tidied: the earlier portrait document version moved to `_archive/`; the six comparison reviews moved to `notes/10-submission/reviews/`. AGENTS.md and CLAUDE.md are identical on purpose (one per coding tool) and were left. Nothing was deleted.
- 2026-10-05: description A/B-tested with two fresh screeners (core-only against core plus three stretch features). Both chose core-only (41 and 40 of 50 against 40 and 39); the stretch list read as scope creep. Final description (notes/10-submission/description-FINAL.txt, 1,956 characters) is core-only plus their edits: countersign and replay rejection, the offcut weight numbers, a named fallback (classical line detection), timings on screen, 'a steel mesh we bring'. Stretch features moved to the team box, with the note that the team builds with frontier coding models. The user will make the deck themselves; SUBMISSION_DECK.html/.pdf are reference content only.
- 2026-10-05: title sharpened ("a house's steel on one phone") and description restructured as WHAT / FOR WHOM / HOW / WHY NOW / BUILD / DEMO to mirror the form hint (1,957 characters, no "<"). Prose version kept in SUBMISSION.md.
- 2026-10-05: stand-out box rewritten to the field hint (skills / domain edge / why this problem / prior collaboration), plus a version that needs no new facts. Both in SUBMISSION.md.
- 2026-10-05: prior-builds box rewritten from the user's draft (Chennai/One-Take first, under 1,000 characters, originality line); stand-out box updated with real team facts (TinkerHub wins, AI-company work).
- 2026-10-05: stand-out box merged with the strengths of the team's One-Take Chennai answer (technical depth, homework done, built for the demo hall).
- 2026-10-05: stand-out box finalised (966 characters) with the user's 'friends in construction' line and two September collapses as events only. Satya Niketan checked: old building under renovation, cause unknown, not a steel case; logged in EVIDENCE.md.
- 2026-10-05: news bank for the problem slide added to EVIDENCE.md (Chintels: IIT Delhi found corroded reinforcement [V]; Ambala collapsed during the pour, 6 dead [V]; Taratala 16 dead [S]). Ambala toll corrected from 4 to 6 in the stand-out text.
- 2026-10-05: stand-out 'Why this problem' now uses Chintels (steel corrosion, IIT Delhi) and Ambala (mid-pour) instead of Satya Niketan (not a steel case).
- 2026-10-05: stand-out box rewritten to lead with 'why this problem' (four specific steel errors from construction friends, the one-day window, Chintels and Ambala, Japan contrast), then the team. 976 characters.

- 2026-10-05: Final audit. FINAL-ANSWERS.md holds every field (supersedes SUBMISSION.md texts); DESCRIPTION_v4.txt adds "full loop by hour 30" and ready-made models. Deck v2 (deck/Sariya check the steel before the concrete hides it v2.pptx): slide 7 "re-measured" made future tense and "zero bytes leave the phone" replaced (Office Kit sends records); slide 10 and 14 add Chennai/TinkerHub proof; mason pronouns neutral. Fonts (IBM Plex Sans/Mono, Oswald) are not embedded: upload a PDF.

- 2026-10-07: shortlisted. Workspace set up at ~/Desktop/sariya with context/ (shared, research, related ideas, comparison prompts, Mauka IDEA, ideation STATE), deck/ and an empty build/.
- 2026-10-07: workstream 7 (data and props) written: `notes/07-data-plan/data-and-props.md` (site protocol and shot list, consent wording, "N of M" statistic rules, fiducial design, print specs, props BOM ≈ ₹8,500, synthetic and labelling plans, hour-by-hour 7-8 Oct). `make_fiducials.py` generated and detection-tested the print files in `notes/07-data-plan/print/` (20 site cards 200 mm, 2 m strip, A3 calibration board, A4 hook template, A6 fault deck; one dictionary DICT_5X5_1000 with ID ranges). CSV sheets in `notes/07-data-plan/sheets/`. Open: organiser answer on steel props through security (email today); Roboflow rebar set contents; spacing tolerance (+25 mm) to confirm with the engineer.
- 2026-10-07: six research agents (tracker/Office Kit, vision stack, speech/LLM/OCR, device dev-env, rulebook, data and props) run; PREP-PLAN.md written; IDEA.md rulebook lines corrected (8d/75 mm; optional in Zone II).
- 2026-10-07: organiser answers logged in PREP-PLAN.md §7; decision: full fine-tune on site data before the event (allowed), every phone gets a continuous role because the score is a per-phone average.
- 2026-10-07: team facts logged (spare Android phone, MacBooks + one Windows, other Snapdragon flagships available for pre-event tests, no iQOO 15 in hand, T3 Chat APK already sideloaded via Office Kit). Score clarified as the team average across phones.
- 2026-10-07: WS8 demo script, WS9 GTM, WS11 name check, event prompt pack and prep/ reference pipeline + training scripts written by four agents. Name: keep Sariya, 'Sariya Check' where uniqueness matters; getsariya.com and sariyacheck.com free; ipindia search still to run by hand (OTP). Demo: near-limit fault card must be ~180 mm not 160. Prompt pack conflicts settled: OpenCV 4.14.0, minSdk 31.
- 2026-10-07: demo beam prop fixed: the 600 mm cage could not hold a 600 mm end zone plus mid-span. Option (a) chosen: spec end zone 300 mm @ 100, mid @ 150; rings at 50/150/250/400/550 mm (first ring 50 mm from the face, IS 13920 cl. 6.3.5.1), 5 spares. F3 is now "slide the 2nd ring into mid-span" -> "rings at 200, drawing 100 for 300 mm, add 1" (Hindi line rewritten). Updated: demo-script.md (layout, packing, rehearsal, script, Eval 2, §6 table), data-and-props.md BOM row 8, PREP-PLAN.md props line, event-prompts.md P5/P11 acceptance and test positions, IDEA.md §6, make_fiducials.py. Fault deck regenerated (F3 new; F4 corrected to 180/175 as the demo script already required); hook template footer now says 8d/75 mm. Card and strip PDFs left byte-identical.
- 2026-10-07: demo mesh shrunk to 45 x 45 cm (IDEA.md already said 45; the props list had drifted to 60, where F1's 6 bars @ 150 = 750 mm could not fit). Demo slab spec is now 8 mm @ 100 c/c, 5 bars, single-gap limit 125. F1 = 4 of 5; F2 opens one gap to ~150 ("152 ± 5"); F4 near limit ~135 (re-scan at 1.2 m, outside at 0.5 m; 130 would touch the limit with the ±5 floor). Board: 5 fixed bottom bars, top bars pressed into EVA foam on battens instead of 25 mm saw slots (slots could not make 135/150 gaps). Bars cut to 0.45 m. Updated demo-script.md (flag 1, layout, packing, pre-flight, script, failure table, Eval 1, §6 table and Hindi lines), data-and-props.md (BOM rows 1 and 7, notes, organiser email), PREP-PLAN.md, event-prompts.md, IDEA.md §6; fault deck regenerated (F1, F2, F4); other print files unchanged. Not changed: rulebook.md §E fixture notes still describe a real 8 @ 150 slab for the engineer to confirm; the slide-1 site photo line (150 vs 230) is about a real site.
- 2026-10-08: weigh-test offcuts shortened from 1 m to 50 cm (rulebook already proposed ≥ 0.5 m; at 0.5 m a 3 mm length error is 0.6 %, inside the IS 1786 individual tolerance). Expected readings 198 / 309 / 444 g for 8 / 10 / 12 mm; app takes length (default 500 mm). Stage line: "half a metre of a 12 weighs 444 g; this one, labelled 12, weighs 309; it's a 10". Updated demo-script.md (flag 2, layout, packing, pre-flight, 2:10-2:20 beat, Eval 3, F8 row and Hindi lines, number-check list), data-and-props.md (BOM rows 1-3, cut-length and weigh notes, site shot 18, stale "saw the slots"), IDEA.md §3.4 and §9, rulebook.md (DIA-BANDS, ambiguity 9), PREP-PLAN.md, speech-llm-ocr.md, event-prompts.md (length field); fault deck F8 regenerated, other prints unchanged. Also 8 Oct: site visits dropped by the user (no access); demo/plan rewrite for that still pending the user's go-ahead.
- 2026-10-08: slab mesh build sheet written (data-and-props.md §3.1): 4 fixed bottom bars at Y 75-375 (not 5, so they clear the foam), 5 top bars at X 25-425, foam strips front and back, card on the front half, position ticks on the front face, F2 = T4 to 375, F4 = T4 to 360. BOM now 10 x 0.45 m of 8 mm.
- 2026-10-08: build-sheet fix: card moved to X 5-205 (on T1 and T2). The first layout put its edges exactly on T2 and T4 and over T4, the bar F2/F4 slide, so a judge would have shifted the card.
- 2026-10-08: weigh-test offcuts shortened again, 50 cm -> 30 cm (user's call). Expected 119 / 185 / 266 g for 8 / 10 / 12 mm; IS 1786 individual bands at 0.3 m do not overlap (10 mm 170-198 g, 12 mm 251-280 g). Error at 30 cm: 3 mm length = 1 %, 1 g scale = 0.4-0.8 %; fine for size class, thinner margin for slight underweight. App length default 300 mm. Same files as the 50 cm change updated; fault deck F8 regenerated. Bars for the mesh stay 450 mm (user reverted the size question).
- 2026-10-08: cover blocks placed: they were in the BOM (20 pcs) but on no prop. Now 4 x 25 mm under the beam cage (two per end, on the wooden blocks) + 2 spare; slab prop has none (bars fixed to the board). F7 = remove the beam's cover blocks; fault deck regenerated.
- 2026-10-08: props cut to a minimal kit (user: simplify, a bit more care on the slab). data-and-props.md §3 rewritten: slab = cloth-wrapped 45x45 board, 2 fixed bottom bars, 5 movable top bars @ 100 on foam strips; beam = top face only (2 x 12 mm 700 mm + 5 x 8 mm 250 mm cross pieces on Blu-Tack, strip along the centre); 2 x 30 cm offcuts; ≈ ₹1,700 + ₹700 printing. Dropped: LED panel, tripod, hook template, card 19 (replay uses card 01), cover blocks, bent stirrups, wooden blocks, 8 mm offcut. Demo script packing list, layout and F6/F7/F10 updated; fault deck regenerated; IDEA.md pitch kit and PREP-PLAN updated. Card and strip need no change for steel sizes.
- 2026-10-08: F8 deck card now uses the spare 450 mm 8 mm slab bar (~178 g) since the 8 mm offcut was dropped; deck regenerated.
- 2026-10-08: printing cut to one site card (00) and one strip. Calibration on card 00 (A3 board optional); replay rejection by hash, no second card; fault cards F1-F3 only, paper or handwritten.
- 2026-10-08: print audit. Fixed in make_fiducials.py and regenerated: (1) fault-card text ran off the A6 card (no wrapping) — now wrapped, widest line 77 of 102 mm; (2) strip said position = (id-400)*50 but marker centres are at 25 + (id-400)*50 from the 0 end — strip now has 50 mm ticks, a marked 0 end ("goes at the column face") and the correct formula; docs (data-and-props, PREP-PLAN, event-prompts) and the unused prep helper strip_position_mm corrected; prep's strip_board geometry was already right; (3) card box now reads "pattern width, 6 squares (nominal 180)"; (4) F10 text no longer mentions card ID; (5) new spec_A4.pdf (one-page props drawing). Verified: PDF page sizes exact (card 200x200, strip 2000x60, A6, A3); card 18/18 markers and 25/25 corners at 0.4-1.5 m; strip 40/40 markers with centre error under 0.5 mm at 0.4-1.2 m. Card and strip are independent of the steel sizes.
- 2026-10-08: slab prop is now a proper 5 x 5 mesh on a 500 x 500 board (user): both layers at 50-450 mm, all ten bars movable in foam strips on four edges, card front-left on T1/T2, no U-nails. New fault F12 (lower bar B2 slid 50 mm back: "lower bars, gap 2: 150 ± 6"); stage deck is F1, F2, F3, F12. F2 = T4 to 400, F4 = T4 to 385. Bars cut 11 x 500 mm (one 12 m bar still covers all 8 mm). F8 uses the 500 mm spare (~198 g). Updated data-and-props §3/§3.1, demo-script (layout, packing, pre-flight, spec line, F8, new F12 row with Hindi), fault deck + spec page regenerated, IDEA pitch kit, PREP-PLAN, event-prompts acceptance (both families, lower-layer correction).
- 2026-10-08: slab foam heights fixed: front/back strips are two 10 mm layers (20 mm) because the top bars rest on the bottom bars about 8 mm up; with 10 mm everywhere their ends would float above the foam.
- 2026-10-09: props made half scale (user: as small as possible, still demoable). Every distance halved, real 8/12 mm steel: slab 280 x 280, 5 x 5 @ 50 both ways (single-gap limit 65 = 50 + max(15, 25 %)); beam top face 300 mm, rings @ 50 for 150 mm, 75 mid; offcuts 200 mm (123 / 178 g); spare slab bar 280 mm for F8 (~111 g). New prints: card_S (100 mm, ids 360-377) and strip_300 (ids 450-461, 25 mm pitch); self-tests: card S 18/18 markers at 0.25-0.8 m, strip 12/12 with centre error ≤ 0.3 mm; a 0.5 mm placement bug in the first strip_300 draft fixed. Re-scan beat now abstains on pixel size (card S beyond ~0.65 m) instead of band width. Fault deck and spec page regenerated. Updated data-and-props §3, demo-script (flags, layout, packing, pre-flight, script beats, evals, Q14, §6 table and Hindi lines, number list), IDEA pitch kit, PREP-PLAN, event-prompts (fiducial facts, pixel-based abstention, beam test positions), rulebook tolerance proposal. Kit ≈ ₹1,300 incl. printing; everything under 30 cm.
- 2026-10-09: demo rewritten for half scale and no site visits: opening is the one-day window + Japan + "half-scale props, the app checks whatever the drawing says"; the site-replay beat is replaced by the lower-layer fault (F12, "both directions"); numbers screen and Q&A quote bench (prop) accuracy and name site validation as the next step; IDEA §6 demo table rewritten; offcut references set to 0.2 m everywhere (app default length 200 mm). Submitted texts (SUBMISSION.md, FINAL-ANSWERS.md, DESCRIPTION_v4.txt) left as submitted.
- 2026-10-09: user visited a small/mid-size construction site and reports that reinforcement is not checked before the pour there and that a few bars were mis-measured (user-reported; number of sites, photos and measured values still to be captured for the opening slide).
- 2026-10-09: event build plan, checkpoint cards and errata written (notes/12-event/). The 97-item audit was applied across IDEA, PREP-PLAN, event-prompts, vision-stack, speech-llm-ocr, device-devenv, rulebook, data-and-props, demo-script, gtm and prep/README. Reference pipeline fixed for half scale (tolerance, gates, card S, strip_300); 32 tests pass. Live site checked: jury published, cut-off TBC.

- 2026-10-09: Synced local main to origin/main at b5df62c (four commits: v4 AR vision and training preparation updates). Preserved the local build-flow walkthrough note while resolving a STATE.md overlap. No product decisions changed; open questions and next steps remain in the 20:05 status above.

- 2026-10-10: Team workflow question: user is considering splitting end-to-end app issues among three people (UI/UX, AI, backend/integration) after model training. Recommendation: keep three owners, but split by vertical user-visible slices with package boundaries and a named integrator; validate the trained model artifact and establish the thin end-to-end mesh path first. Avoid three isolated lanes that meet only at the end. No assignment or scope decision made in this session.
- 2026-10-10: Synced local `main` fast-forward to `origin/main` at `ba13987` (three commits: SM8850 precompiled NPU model and integration notes; round-2 hard-negative data/training updates; wire-negative cap). Preserved all pre-existing working-tree edits and untracked files through the update. No product decisions changed.

- 2026-10-10: Prepared a copy-paste UI mockup prompt for the current slab-only flow: operator capture, uncertainty/re-scan, manual readings, spoken fixes, engineer review and PIN sign-off. Preserves the decluttered visual direction and separates illustrative data from validated results. No product scope changes. Next: generate mockups and choose the visual direction; device/tape validation remains open.

- 2026-10-10: Dedicated research on missing features (multi-project engineers/architects), the iQOO CEO as a possible juror, and the business model: `reports/Sariya features jury and business.md` (notes in `research_notes/Sariya features jury and business/`). Proposals, not yet adopted: (1) build today: pour inbox sorted by pour time, approve / fix and re-scan / not approved with "was → now", one-tap PDF to WhatsApp with verify QR, copy signed spec to next floor, measured endurance tiles (NPU ms, battery temp and %, 0 bytes out); (2) lead pricing per signed pour record (brand-sponsored ₹99-149, engineer-bought ₹199-299) with seats as the enterprise wrapper, because brand seats cap near ₹12-19 Cr/yr; insurers and lenders Year 2+; (3) CEO pitch on "most buyers don't game: here is a professional who needs this phone". Open: no source confirms Nipun Marya on the Finale jury (user-reported; 9 Oct list doesn't name him). IDEA.md not changed pending the team's decision.
- 2026-10-10 15:30: Built the pour inbox and the fix loop (user's call, from the research report). App changes: `lib/pour.ts` (pour presets and labels), `lib/inbox.ts` (inbox grouping), `components/fix-loop.tsx`, `brief`/`fixDelta` in `lib/rules.ts`; site and planned pour on `Inspection` and `SpecPayload` (optional, so older signed specs and captures still verify); the engineer keeps the specs it issued (`issued`) so unanswered ones show as "awaiting scan"; review's "Ask for another view" became "Fix and re-scan" with prefilled checks and fix text; FixLoop on review, operator record and draft summary. tsc and lint clean; a bun smoke test of the inbox order and fix deltas passes; **not yet run on the iQOO**. Built on top of the uncommitted UI work from the "APK update and UI/UX work" session; nothing committed. Demo: issue 2-3 specs with different sites and pour times so the inbox shows real rows, not seeded ones.
- 2026-10-10: Fixed the two screenshot-reported UI defects: summary timeline connectors now share the circles' centered column, with opaque pending/active circles hiding the line; manual-reading actions now split the row equally so “Not visible” has room for its full label. Typecheck and Expo lint pass. No product scope change. Next: confirm both layouts on the iQOO; device visual verification remains open.
- 2026-10-10: Rebuilt the Android release APK from the current local working tree, including the timeline and “Not visible” fixes, and installed it in place on connected iQOO I2501 (`10BFAX1C230010U`, package `in.sariya.app`). Installation succeeded and MainActivity launched; existing app data retained by `adb install -r`. Expo prebuild, release build, typecheck and lint succeeded. Next: on-phone flow/layout check and real-steel validation remain open.
- 2026-10-10: Switched the default app model from v2 to v3 at threshold 0.3, per user request and MODEL-V3.md. Updated README and current spec; built and installed the release on iQOO `10BFAX1C230010U` in place and launched it. Verified both packaged model hashes against the v3 sources (float `26f6324ab4c4eaee`, NPU `02ea7d35912cbc98`); release build, typecheck and lint pass. Next: check live NPU readiness and detection on venue props; this installation does not establish prop accuracy.
- 2026-10-10: At the user's explicit request, cleared Sariya's app data, uninstalled it, and freshly installed the latest v3 release on iQOO `10BFAX1C230010U`. Cleared data once more after installation to remove any restored state, then launched MainActivity successfully. Local records, settings and app keys reset; next step is fresh onboarding and key enrolment.
- 2026-10-10: Publishing all current app, artwork, demo/deck, research and documentation changes to main at the user's request, including the UI refresh, pour inbox/fix loop and v3 default. Release build, typecheck and lint already passed for this working tree; changed-file secret-pattern and oversized-file checks found no flags. Integrating newer origin/main commits before pushing.

- 2026-10-10: Main integration resolved overlapping scan changes by retaining the UI refresh alongside upstream LiveFeed isolation, smoothed overlays, gap colours, live engine readout and native speed improvements. Kept Bun-only tests outside the Expo application typecheck (they run separately with Bun). Both session histories retained.

- 2026-10-10: Team sync check: local main and origin/main were already identical at d193cd1, with a clean working tree; pull confirmed no incoming changes. Publishing this session log to keep the shared history current. No product decisions changed; next: teammates pull main before continuing work. Device validation remains open.
