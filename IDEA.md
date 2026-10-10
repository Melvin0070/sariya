# Sariya: idea as of 9 Oct 2026 (v4, live AR camera)

This is the working spec. Log every change in STATE.md.
- **As built, 10 Oct (06:50):** the Expo app (`sariya-expo/`) runs segmentation model **v2** live on the iQOO NPU through the local module `modules/sariya-vision` (CameraX, LiteRT 2.3, OpenCV 4.10 ChArUco/ArUco, pre-compiled QAIRT 2.50 model: loads in ~120 ms, 18-21 ms per inference, ~65 ms per frame end to end). Card S and strip_300 are detected live. Geometry matches truth to 0.3 mm on a synthetic card-S mesh with v1 weights; v2 marks no bars on that image (known recall gap, round 3 in training). **Not yet shown:** tape accuracy on real steel (G1), v2 on the props. Model rounds swap by build property (`-Psariya.model=vN`). Earlier evidence: [MODEL-V1](notes/14-model/MODEL-V1.md), [MODEL-V2](notes/14-model/MODEL-V2.md).
- **10 Oct 07:45:** the engineer issues signed drawing values to the operator; approval and key trust use an app PIN (no fingerprint on the loaners); **beam is "coming soon"** in the build (slab only), so beam beats are out of the demo until it is re-enabled.
- **v4 (9 Oct, at the event), the team's vision:** a live AR measuring camera. Detail, comparison with v3 and the loaner check: `notes/13-ar-vision/AR-VISION.md`.
  - When the camera sees a bar, it draws a line on that bar in real time; the card gives the scale, so the gaps between lines show live in mm.
  - Live numbers are approximate ("~50 mm"); **Lock** (~1.2 s of steady, sharp frames fused, typically 15-18) gives the value with its band, and only a locked value gets a verdict.
  - **The card measures and anchors.** ARCore was dropped on 10 Oct (the Viro AR view had no torch or capture); the overlay is drawn from the card pose every frame, so it needs the card in view.
  - AI does one job: bar pixels on the NPU, every frame. Card pose, lines, mm and the verdict are maths and rules. Pitch line: "AI finds the bars, maths measures them, rules decide."
  - **10 Oct execution:** [TEAM-BUILD.md](notes/12-event/TEAM-BUILD.md) assigns Alwin UI/UX, Sabari vision/AI and Melvin rules/trust/integration. Retain the full-loop target with explicit gates: typed spec + Hindi output first, voice input conditional, signed review targeted at CP2. Tap-to-mark is ready before CP1; ARCore, BBS import and LLM wording are optional. Issues define the fallback without pretending the automatic feature is complete.
- **v1 (30 Sep):** `context/shared/DEEP-RESEARCH-2026-09-30.md` §3.
- **Why v2 differs:** `notes/01-redteam/VERDICT.md`.
- **v3 (5 Oct), for the Phase 1 submission:** `SUBMISSION.md`, `SUBMISSION_DECK.md`, `notes/10-submission/`. Changes from v2:
  - **Tier 1 is four items:** count and spacing on a slab mesh; stirrup spacing by zone on a beam; voice in and spoken fix out; a signed record reviewed and signed on the laptop over Office Kit. Two-key detail, anti-reuse hashing and payers are deck or roadmap material, not submission text.
  - **Compute split:** open segmentation model on the Snapdragon NPU through LiteRT (SM8850 is listed as supported); Gemma 4 E2B on the GPU (no NPU build exists for this chip) turns the spoken drawing numbers into five typed, confirmed fields and words the fix; IndicConformer on the CPU for Hindi and Kannada speech; geometry and rules in plain code.
  - **Model licence:** Ultralytics YOLO segmentation is the only path with measured numbers on this chip (about 2 ms inference; 17 ms end to end) but is AGPL-3.0. Acceptable for a public hackathon repo; for a product use DeepLabV3+-MobileNet or RTMDet-Ins-tiny. Decide in hour 1 by thin-bar quality.
  - **Office Kit is two-way:** bar schedule from laptop to phone; signed records and review from phone to laptop.
  - **Rulebook corrections:** IS 456 cl. 26.3.3(b) secondary bars are 5d or 300 mm (Amendment 3, 2007), not 450. IS 13920 cl. 6.3.5 (beam ends over 2d: least of d/4, 6 bar diameters, 100 mm) is advisory in Bengaluru, which is Zone II.
  - **Pitch line corrected:** "Japan's construction ministry has accepted camera-based rebar measurement since July 2023 (count, diameter, spacing; 5 mm guide on spacing)". The ministry's guideline itself admits adjacent bar sizes cannot always be told apart, which supports our weigh test.
  - **Named user for the pitch:** the site engineer the evening before the pour; after the event, the brand technical engineer first.
  - **Track: Open Innovation** (all three screening reviewers).

> **The steel inside an Indian house is visible for a day or two, then the concrete hides it for good.
> Sariya checks it with one phone and a printed card, offline.**

**Who does what** (clarified 10 Oct):
- **The designer** (structural engineer) writes the drawing and the bar-bending schedule. Sariya never creates them; their values are the spec.
- **The operator scans:** the person on site the evening before the pour who is paid to check the steel. That is:
  - the site engineer or supervisor;
  - the owner's inspector;
  - a builder's QC supervisor; or
  - a steel or cement brand's technical engineer.
- **The engineer approves:** the responsible engineer (usually the designer, or the owner's engineer), who takes the liability and usually can't be at every pour. They send the drawing values and sign off from their desk.
- **The mason** ties and fixes the steel, and hears the fix. They never hold the phone.

**What the phone does:**
- draws a live line on every bar it sees, with the mm between them, anchored to the printed card;
- counts the bars;
- measures bar spacing, and stirrup spacing by zone, with an error band on every number;
- says **"re-scan"** when a value is within its own error of the limit;
- prompts for the few readings a camera can't take (cover by tape, diameter by weighing an offcut, hooks by template) and records them;
- speaks the fix to the mason in Hindi or Kannada, with subtitles.

**Sign-off:** the engineer reviews the signed record on the laptop over Office Kit and signs off with their own key.

**Track: Open Innovation** (chosen by all three screening reviewers on 4 Oct; still yours to confirm).
- Switch to Productivity if the Finale turns out to have per-track awards.
- Community App is dropped: the "community" would exist only in the roadmap.

## 1. Why this problem
- **Nobody measures the steel before the pour** on most self-built houses. The common errors are all invisible afterwards:
  - uniform stirrups that ignore the tight end zones;
  - missing or substituted bars;
  - no cover blocks;
  - top steel trampled flat, or missing over supports and cantilevers.

  "Most pour without an engineer" is unmeasured [U]. The 15-25-site survey was dropped on 8 Oct (no access); one team site visit on 9 Oct is user-reported only [U]. **No "N of M" statistic exists: never quote one** (notes/12-event/BUILD-PLAN.md §8).
- **Scale.** Housing is 55-57% of India's cement demand, and rural housing alone is 32-34% (CRISIL, FY25) [S]. This replaces the stale 2018 "IHB = 55%" line.
- **Liability is moving onto professionals.**
  - Bengaluru's Nambike Nakshe lets registered architects and engineers self-certify plans, so the certifier carries the risk [S].
  - A structural engineer was arrested after the Taratala (Kolkata) collapse in June 2026 [S].
  - A dated, signed pre-pour record protects the honest engineer, and the mason who fixed what he was told.
- **Context, never causation.** NCRB 2024 recorded 1,435 structure-collapse cases and 1,525 deaths, 922 of the cases residential [S]. NCRB doesn't attribute them to reinforcement, so never imply it.
- **Seismic.** IS 13920 ductile detailing is required in zones III-V [S]. The 2025 BIS map (61% of land moderate-to-high hazard) came with a code revision that was withdrawn [S]. Cite the map, not the code.
- **Fake steel.** A fake bar of the right diameter passes every geometry check. Fake TMT therefore belongs under the weigh-test and brand-verification features, not under "why this problem".
- **Everything here gets re-verified in workstream 2.** Items marked [S] have been seen only in search snippets.

## 2. Competition and alternatives (honest)

| Who | What | Gap Sariya fills |
|---|---|---|
| **Japan:** IHI, AIJO 配筋王, Kentem, Hitachi, Shimizu, Obayashi, Mitsubishi Electric, Kajima (300+ adopters) | Camera-based rebar inspection accepted under MLIT's 2023 digital-measurement guideline:<br>- **IHI:** a plate plus tablet or phone photos, ±1 mm diameter, ±5 mm spacing;<br>- **AIJO:** an ordinary tablet camera, 70% time saved [V];<br>- stereo and LiDAR at the high end | Proves the physics and the category. Built for Japanese codes, contractors and language, on tablets or PC and cloud workflows. None of it serves India's self-built pour |
| **Research:** a 2018 Galaxy S7 app (*Sensors*); 2026 single-photo spacing (5.12 mm MAE); RGB-D and stereo work (1-2 mm) | Lab results | Not a product; no IS codes, no abstention, no workflow |
| **Brand technical services:** Ambuja, UltraTech, ACC, JSW Cement, Dalmia, Bangur, Tata Tiscon | Free engineers at slab casting (Ambuja: 31,698 sites in a year [S]; JSW Cement lists reinforcement checking [V]) | Human, unmeasured, unrecorded, with limited reach. **Our first customer and partner:** Sariya multiplies their engineers |
| **Prefab:** Tata Superlinks (factory-bent 135° stirrups), ReadyBuild cut-and-bend | Removes bending errors at source | Doesn't check placement: count, spacing, cover |
| **Organised builders and site apps:** Brick&Bolt QASCON (470+ checks, stage-gated payouts), BuildNext, Powerplay (35,000 contractors) | Checklists, photos, stage payments | No measurement. Potential customers |
| **Home inspectors:** TeamHome (₹4,999/visit), HomeGyan, Nemmadi (12,000+ inspections) | Mostly handover and resale snagging | Not at the pour. Could use Sariya as their field tool |
| **Post-pour scanners:** Screening Eagle Profometer, Nirixense ReX | Eddy-current or GPR hardware in cast concrete | Too late; costly hardware |

**Pitch line:** *"Japan's government has accepted camera-based rebar inspection since 2023. We rebuilt it for India's
self-built pour: offline on one phone, IS-code rules that say 're-scan' when unsure, the fix spoken in Hindi or
Kannada, and a signed record for the engineer."*

**Hackathon collision:** still low. Another construction team is ~5-10% likely, another rebar team ~1-3% [I].

## 3. The product loop
1. **Spec in.** The engineer, not the operator, sets the values the steel is checked against. As built (10 Oct): the engineer's phone signs the drawing values and sends them to the operator over Office Kit. The operator's phone accepts them only from an enrolled engineer key and opens a new inspection. Changing any value drops the signature, and the review then says "typed on site". If the operator types the spec on site (the fallback), the engineer must also tick "the drawing values match my drawing" before approving. Values that differ from what was signed block approval. The spec is a 5-field spec per member, by voice or form:
   - bar diameter;
   - bar count or spacing;
   - stirrup diameter;
   - stirrup spacing at the end zone and at mid-span;
   - end-zone length.

   Alternatively, photograph the bar-bending schedule table and confirm every field. With no drawing, the app runs in **measurement-only mode**: values, no code verdict.
2. **Capture, the evening before the pour.**
   - A rigid ChArUco card with a per-site ID goes on each slab patch, and a printed marker strip goes along each beam.
   - Stop and hold at the critical zones: beam ends, mid-span, cantilevers, and 2-3 slab patches.
   - Blurred frames are dropped: each frame's sharpness is compared with the sharpest recent frame of the same scan (no fixed threshold to calibrate). Torch on.
   - A live AR overlay draws a line on each bar with the gap in mm ("~50"),. Bars the model only partly sees (usually under the card) show dashed and are never counted; they turn a short count or a wide gap into re-scan.
3. **Measure, on-device.**
   - The pipeline, on every preview frame: rebar segmentation on the NPU → mask warped to the card plane → bar lines from a profile → back onto the image. Planar faces only (the slab's top layer; a beam's top or side face).
   - **Lock** when the phone and observed bars are still: ~15 consistent frames fused into one value with its band. Only immutable locked values reach the rulebook. Keep systematic uncertainty and the initial 5 mm field floor; do not divide the whole band by the square root of frame count. Validate the actual stream/calibration, rather than applying the old 4K pixel threshold unchanged to preview frames. If preview quality is insufficient, use a validated high-resolution capture for Lock and record that measurement mode explicitly.
   - Outputs: count, spacing, and stirrup spacing by zone, each ± a band.
   - Plus a coverage map per lock (frame footprint, card or strip, bars used, partly seen bars, in card mm), signed with the record.
4. **Prompt for what a camera can't do,** and record each reading:
   - **Cover:** a tape reading entered by voice.
   - **Diameter:** a close-up still that abstains when unsure, backed by a 20 cm offcut on a kitchen scale. IS 1786 mass bands separate a 10 from a 12 mm bar (123 vs 178 g per 20 cm; 0.62 vs 0.89 kg/m) and catch underweight steel.
   - **Hooks:** a close-up against a 135° template card, applied only where the drawing or the seismic zone requires it.
5. **Decide (deterministic).** A versioned rulebook:
   - the drawing comes first;
   - IS 456 applies everywhere;
   - IS 13920 is required in zones III-V and "optional in Seismic Zone II" (cl. 1.1.1). Hook extension after Amendment 1 (2017): 135° + 8d, not less than 75 mm (`notes/06-rulebook/rulebook.md`).

   Each check returns **within limits**, **outside limits**, **needs a tape reading** or **not seen**. Never "PASS" or "safe".
6. **Tell.** For example: *"Beam B2, left end: stirrups at 180, drawing says 100 for the first 600 mm. Add 2."* (6 links needed at 100 c/c, 4 found at 180)
   - Default Hindi (demo); Kannada one tap away. (The site visits that were to decide this were dropped.)
   - Subtitles always.
   - A small push-to-talk command set, not free-form chat.
7. **Record and sign off.**
   - **Two phones, two keys.** As built: one Ed25519 key per phone, stored in SecureStore (encrypted at rest by Android Keystore). Signing runs in app code, not inside the Keystore, so never say "hardware-backed signing". Approval on the engineer's phone, and trusting another phone's key, is gated by an app PIN set at setup (salted hash in SecureStore; 5 wrong tries lock it for 30 s). It replaced the fingerprint prompt on 10 Oct because the loaners have no fingerprint enrolled. A device-bound biometric key is the product version. If the engineer scans the site themselves, approval still needs a second phone: the same key can't approve its own capture. Enrol public-key fingerprints on verifier devices explicitly; a key embedded in a pack is not automatically trusted and does not prove professional credentials.
   - **Immutable evidence:** capture binds the exact locked measurements, spec revision, rule/model/calibration versions and evidence-image hashes. Approval binds that capture payload; edits create a new revision.
   - **Anti-reuse:** reject duplicate approval of an already processed record/hash. Perceptual similarity can flag a possible reused image for review, but must not block a legitimate new scan of unchanged steel. The one demo card does not establish a unique site or physical-scene liveness; registered per-site cards remain a product extension.
   - **Privacy:** local storage and deliberate export in the event build; use consented prop imagery. Face redaction, GPS/mock-location recording and field retention controls remain post-event work, not implemented claims.
   - **Office Kit is the engineer's desk:** review the engineer-phone screen on the laptop; move packs and requests for another view through Office Kit files. Sariya opens received files through Android's document picker. The sign-off QR verifies offline against enrolled keys, with the full pack available when evidence inspection is needed.
8. **Where it plugs in** (roadmap, not built at the event):
   - brand programmes: more sites per technical engineer, rib-mark brand verification, slab-date leads;
   - builders' stage-gated payouts;
   - lender tranche visits, which cost ₹750-1,500 each today;
   - home inspectors.

## 4. Users and payers
- **Operator (on site, scans):** the site engineer or supervisor, the owner's inspector, a builder's QC supervisor, or a brand technical engineer. Never the mason who tied the steel: the mason hears the fix and keeps a record of the corrections made.
- **Engineer (usually remote, approves):** the responsible engineer, usually the designer or the owner's engineer. They issue the drawing values and sign off with their own key from the Office Kit desk, so they need not travel to every pour.
- **Payers, ranked:**
  1. **Steel brands.** A FAIL for missing bars sells steel; the scan also verifies their brand on site and generates slab-date leads.
  2. **Cement brands' technical services.** The free slab-casting visit becomes a branded, signed report.
  3. **Builders and inspectors,** at a per-site price.
  4. **Homeowners,** through a service rather than an app.
  5. **Lenders** buy the evidence layer only.
  6. **PMAY-G** is an impact footnote.

## 5. Scores (red-team consensus; all hypotheses)

| | v1 as written | v2 |
|---|---:|---:|
| Screening /50 | ~36 | ~41 |
| On-site /100 | ~61 | ~77 |
| P(top 10), if attending | ~28% | ~48% |
| P(podium) | ~6% | ~16% |

Product lens: 44/90 (industry jury; the v1 self-score was 61).

## 6. The demo (3:30, airplane mode; workstream 8 refines it)

| Time | Beat |
|---|---|
| 0:00 | The one-day window: the steel is visible for a day, then hidden. Japan has accepted camera checks since 2023; we built it for India. "Half-scale props; the app checks whatever the drawing says." |
| 0:20 | A judge draws one card from a deck of robust faults and applies it: remove a mesh bar, open a gap to ~80 mm (drawing 50), or move an end-zone stirrup into mid-span. |
| 0:45 | Scan at about 30 cm: a line snaps onto every bar with the live gap in mm. The judge slides one bar and its line and number follow. Lock: the verdict arrives within 3 s, with values, spoken in Hindi and subtitled. |
| 1:05 | The judge tapes the exact segment the app drew: "80 ± 5 mm c/c" (5 mm field floor until the tape table justifies less). |
| 1:25 | Honesty on show: from 0.8 m the phone says "re-scan, too far"; at 30 cm, a confident "outside limits" (72 vs limit 65). |
| 1:50 | Both directions: a lower-layer bar is moved; the app catches it through the gaps, with a wider band. |
| 2:10 | Weigh test: a 20 cm offcut labelled "12" weighs 123 g, so it is a 10 (a 12 would be 178 g). |
| 2:30 | The engineer's phone, mirrored on the laptop over Office Kit, signs off with a fingerprint. The mason's phone verifies the QR. Then yesterday's pack is replayed and rejected. |
| 3:10 | The in-app numbers screen (computed from the stored signed scans), who pays, and the ask. |

**Pitch kit:**
- half-scale props (every distance halved, real 8 and 12 mm steel; the app reads the spec): a 28×28 cm, 5×5 slab mesh at 50 c/c both ways, every bar movable;
- a 30 cm beam top face (two 12 mm bars and five cross pieces) laid flat;
- two 20 cm offcuts and a kitchen scale;
- gloves;
- a hot-spare phone.

Full minimal kit: `notes/07-data-plan/data-and-props.md` §3.

**Before the event:** ask the organisers whether steel props are allowed on stage.

## 7. Build plan (48 h). Event-time plan: notes/12-event/BUILD-PLAN.md (block-by-block, gates, half-scale constants)
- **Tier 1 (mesh loop + spoken Hindi fix by Eval 1; beam zones, voice spec, two-key record and Office Kit desk by Eval 2; see notes/12-event/EVAL-CARDS.md), about 55-75 person-hours:**
  - the live AR line overlay with mm labels and Lock (card-anchored);
  - planar count and spacing with the card;
  - stirrup zones on a beam face, using the strip;
  - the physical prompts;
  - the rulebook, with bands and abstention;
  - voice;
  - the two-key record;
  - the Office Kit review desk.
- **Tier 2 (only if Tier 1 is solid):**
  - close-up diameter class, with abstention;
  - the hook-template check;
  - NPU vs GPU vs CPU, battery and temperature numbers on the numbers screen.
- **Roadmap only, never built at the event:** card-free depth, rib-mark OCR, slump check, work passport, AwaasApp export, drawing extraction by an LLM.
- **Runtime (done 10 Oct):** the pre-compiled SM8850 file from the device JIT cache loads in ~120 ms, so the ~53 s cold compile never happens on the iQOO; other phones fall back to GPU, then CPU, and the readiness screen says which and why. QAIRT 2.50 libs are git-ignored and copied in per laptop (`sariya-expo/README.md`).
- **Red Light hours:** each phone alternates Office Kit Remote PC (driving the agent) and scanning the props with tape checks (camera, mic, NPU), which grows the error table (BUILD-PLAN §1.3).

## 8. Before 9 Oct (data and people, not code). Historical: superseded by notes/12-event/BUILD-PLAN.md; items 2 and 4 did not happen
1. Send the organiser questions (VERDICT.md):
   - the entry window and the number of direct slots;
   - public pretrained weights and fine-tuning at the event;
   - per-track awards;
   - steel props on stage;
   - the Green/Red Light timetable.
2. Visit 15-25 Bengaluru pre-pour sites with a tape. Record:
   - defect prevalence;
   - error bands per check;
   - the contract form;
   - who was present;
   - whether a brand engineer or the owner's engineer came.
3. Build the pitch kit.
4. Get on record, with consent: one structural engineer, one brand technical engineer, one mason.
5. Rulebook:
   - ~~confirm the IS 13920 hook extension~~ answered 7 Oct: 8d / 75 mm after Amendment 1 (2017);
   - set the spacing tolerance with the engineer, since IS 456 gives none.
6. Name check (workstream 11).

## 9. Hostile questions and honest answers

| Question | Answer |
|---|---|
| "So you certify my building is safe?" | No. It measures what's visible and records it, for example "4 of 6 checks within limits, 2 need a tape reading". The engineer signs. |
| "Japan already does this." | Yes. MLIT has accepted camera-based rebar inspection since 2023, which is why we trust the physics. What's new is where it runs and whom it serves: offline on a phone, IS codes, 2 mm size steps, Hindi and Kannada, and a pre-pour record for self-built homes with no QA team. |
| "Can you tell 10 mm from 12 mm?" | Not from a standing sweep, and we don't pretend to. We take a close-up still at 20-30 cm and classify only above 95% confidence. Otherwise we use the scale: 20 cm of 10 mm weighs about 123 g, of 12 mm about 178 g, which also catches underweight steel. |
| "Who holds the phone?" | The person paid to check: the owner's engineer or inspector, the builder's QC, or the brand's technical engineer. Never the mason who tied it; he hears the fix. |
| "Scan a good cage, pour a bad one?" | Duplicate signed records are rejected; similar images can be flagged for review. Neither proves the physical scene or what is eventually poured. The engineer can request another view. Per-site card registration is a product extension. Tamper-evident, not tamper-proof. |
| "Whose key signs the approval?" | Two phones, two keys: the capture key on the operator's phone, the approval key on the engineer's, behind their PIN. |
| "Who sets the spec? Couldn't the operator type a looser one?" | The engineer signs the drawing values on their own phone and sends them to the operator. If the operator changes one, the review shows "typed on site" and the engineer must confirm it against the drawing. Values that differ from what the engineer signed block approval. |
| "Bengaluru is zone II." | The rulebook is zone-aware. IS 456 applies everywhere; IS 13920 is required in zones III-V and "optional in Seismic Zone II" (cl. 1.1.1). The drawing wins. |
| "Why on-device, and why the NPU?" | Sites are offline, and 30 fps live guidance needs the NPU (AI Hub lists ~2-4 ms for segmentation models on the 8 Elite Gen 5 [S]; we show the latency measured on this loaner). Plus privacy (faces, home location) and zero marginal cost. We show measured NPU, GPU and CPU numbers. |
| "What trained the model, and when?" | Public weights, attributed; [fine-tuned on public rebar sets plus photos of our own props, timestamped log in the repo] or [used as pre-trained]: say which is true. No site frames exist. |
| "Would it have saved Babusapalya?" | Partly at most. Rods were reportedly badly installed, but the building also had no approvals. We build for owners who want to build right. |
| "Cover depth is hidden." | Yes. Side cover is visible on beams; bottom cover is a tape reading entered by voice. |

## 10. Claims never to make
- "Certifies structural safety", "PASS" for a member, "pour permit", "tamper-proof", "replaces the engineer".
- "One engineer clears 10× more sites" (unmeasured).
- "A new capability", "the first to measure rebar with one camera", "globally only stereo or LiDAR", "one pixel is well under 0.1 mm".
- "The 2025 seismic code is in force".
- A partner's name before they agree.
- Calling masons cheats.
- Any link between Babusapalya and reinforcement as its cause.
