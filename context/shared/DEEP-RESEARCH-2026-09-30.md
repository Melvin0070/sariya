# Deep research: what wins, verdicts on our 5 ideas, and a new idea (30 Sep 2026)

Builds on research/A-D, FINAL.md, the Idea Room, 04-final-recommendation.md and cutline/VERDICT.md. New
web research this session covers: Finale site state, TreeHacks 2025/2026, HackMIT 2025, Cal Hacks 12, the
local-AI market, and a full competitive and fact check for the new idea. Scores are my judgment, not the
organisers'. I wrote the new idea, so it needs an independent red team before you commit (see §6).

---

## 0. Blocker: check this before anything else

- **Press coverage says "Applications close on 27 September 2026"** ([itvoice](https://www.itvoice.in/iqoo-announces-indias-phone-first-hackathon-series-challenging-young-innovators-to-build-ai-powered-solutions-for-real-world-problems-on-mobile)). 04-final-recommendation.md saw the same date.
- The site still says "direct online registrations also open", and **the Finale panel is still "not announced"** ([iqoo.reskilll.com](https://iqoo.reskilll.com/), read today).
- Log in to the dashboard (`/register?city=finale`) today and read the "Phase 1 · Idea submission deadline". If it has passed, email sameera@reskilll.com and ask whether late direct entries are accepted.

If the window is closed, this whole document is moot for 2026. The new idea still stands on its own.

---

## 1. What wins: the evidence, compressed

### 1.1 Big-league hackathons (Stanford, MIT, Berkeley, Google, Qualcomm)

| Event | Winner | Pattern |
|---|---|---|
| TreeHacks 2026 (Stanford; 1,000 from 15,000 applicants; $500k) | **Shepherd**: a motorised cane that sees obstacles and *physically steers* a blind user | Physical act, a user with a hard constraint. Judged on creativity, technical complexity and social impact. |
| TreeHacks 2025 | **Hawkwatch**: real-time alerts across many surveillance feeds | Overload of a human operator solved by perception |
| HackMIT 2025 | A team built a **GPU in 24 h** (reported placing); **Marvis** (1st, Mentra track): hands-free AR repair guide on glasses | "That can't be done in a weekend" ambition; physical-task guidance |
| Cal Hacks 12 (2025) | **FaceTimeOS**: FaceTime your Mac and a voice agent drives it | A new bridge between two devices, demoed live |
| Gemma 3n Impact (Dec 2025) | **Gemma Vision**, built with the developer's blind brother | Co-designer on record; form factor shaped around the constraint |
| Gemma 4 Good (Aug 2026) | GEM-4 (VLA robot), Trido, DEMENTOR, CodeBuddy… | "Robust offline fallback", "auditable reasoning", measured WER and tok/s |
| Qualcomm Edge AI BLR (2025) | **GameSense** | Heterogeneous CPU/GPU/NPU compute, real time |
| iQOO city podiums (2026) | Kavach, Anchor, Pune Tree Rakshak, ResQ… | Trust and verification, a deterministic core, a report routed to the actual authority, "0 bytes out" proof |
| Reskilll juries (Meta Llama 2024, Agentic ETH 2025) | CurePharma, CivicFix, ZK-BharatID | Bharat public good, a civic loop, anti-spoofing |

**Seven traits every top winner shows. The new idea is designed against these.**
1. **One act in the physical world** that a judge can watch happen: steer, catch, measure. Not a chat window.
2. **A named user with a hard constraint**, ideally a co-designer on record.
3. **Visible technical ambition.** Judges should think "that shouldn't be possible on this hardware in 48 h".
4. **Stakes.** Lives, money or rights, not convenience.
5. **A deterministic core, with the model perceiving.** It can't hallucinate the verdict, and it abstains when unsure.
6. **Measured proof on stage**: an error table, a latency figure, a judge checking with a tape.
7. **A closed loop into an institution**: the output lands with someone who acts (a municipality, an engineer, a lender).

### 1.2 The iQOO Finale specifically
- Rubric: End product 30 · Novelty+impact 20 · HackTracker creative phone use 15 (camera, voice, on-device AI) · Tech depth 15 · HackTracker Office Kit 10 · Demo 10. "A well-built simple product beats a broken complex one."
- Finale tracks: Mobility, Community App, Smart Living, Productivity, Developer Tools, Open Innovation. **Education, FinTech and Health are gone.**
- City juries were 15 people: about 7 founder/CTOs, 6 enterprise architects or EMs (AWS, Microsoft, Genpact, LTIMindtree…), 2 security leads, nasscom and DevRel. No VCs and no academics. They ask "what happens when X fails", "who pays" and "where does the data go".
- The field arriving at the Finale is crowded with scam shields, pose coaches, health companions, memory apps, blind-navigation aids (SecondSense), crash detection, first aid and code reviewers.
- Organisers of other on-device hackathons found the theme alone produces "AI wrappers where the API provider was now Ollama". Local has to be *necessary*.

### 1.3 The local-AI market and tech (2026)
- On-device AI market: about $13.2B in 2026 at ~22% CAGR (360iResearch). India edge AI: $1.05B (2025) → $7.55B (2033), 28% CAGR (Grand View). India's framing: "affordable, multilingual, mobile, public-service".
- Now practical on the Snapdragon 8 Elite Gen 5:
  - Real-time camera VLMs (FastVLM 0.12 s TTFT).
  - Open-vocabulary detectors (OWLv2/WeDetect) on Qualcomm AI Hub.
  - Gemma 4 E2B with image and audio input (~30 tok/s class).
  - LFM2.5-VL grounding.
  - IndicConformer ASR.
- **What still isn't solved on a phone without LiDAR or ARCore (the iQOO 15 has neither): metric 3-D measurement of thin structures.** That gap is exactly where the new idea's technical depth sits.
- Local wins only when the cloud is structurally wrong: no signal on site, feedback needed within seconds, evidence that must be signed at capture, or zero marginal cost at crore scale.

---

## 2. Verdicts on our five ideas

The screen is scored out of 50: Novelty, Tech impact, Problem choice, Scope fit, Phone-first, 10 points each. On-site is an estimate out of 100. Big-league is out of 10 against the seven traits in §1.1.

| Idea | Screen /50 | On-site /100 | Big-league /10 | Verdict |
|---|---:|---:|---:|---|
| **One-Take (enhanced)** | 32 (6·6·5·5·10) | ~70 | 5 | **Don't enter.** It was submitted at Chennai, and the terms disqualify work "developed for or submitted to another competition"; an "enhanced" version doesn't escape that. The market moved against it too: Meta Edits, CapCut, and YouTube's AI editing (23 Sep 2026). Creator convenience also carries low stakes for this jury. |
| **Sugam** (ramp/door audit) | 39 (8·6·8·8·9) | ~74 | 6 | Best *instrument* instinct of the five, but **the AI isn't load-bearing**: the verdict comes from an accelerometer plus a rulebook, and the models only blur faces and transcribe notes. An AI/ML juror can say "a clinometer app with a PDF", and the "local model at the core" bonus is weak. The payer (NGOs) is thin, and the post-Raturi rules are still drafts. |
| **Akshara / Ek Minute** (reading fluency) | 35 (5·8·8·6·8) | ~74 | 7 | The strongest AI core (constrained alignment). But the **Education track doesn't exist at the Finale**, and **Wadhwani AI's Vachan Samiksha already runs in ~30,000 Gujarat schools with 1.2 lakh teachers** (since Jul 2023), which kills novelty. It also needs children's recordings under consent, and a judge can't be the user. |
| **Drishti** (blind-tester UAT workbench) | 35 (7·7·9·5·7) | ~73 (~78 with fixes) | 6 | Best dated trigger (SC 2025 INSC 599, SEBI 31 Oct). But it rests on untested **platform capture on OriginOS** (a TTS-engine wrapper next to TalkBack) and needs a **blind-tester partner** to be credible live. There's little camera use (−HackTracker), a two-sided product plus a replay agent in 48 h, and BarrierBreak, Incluzza and BrowserStack are in the space. The "juror goes blind" moment is strong. |
| **Cutline → Proof Desk** | 32 (5·6·6·7·8) | ~72 | 4 | Incumbents cover the core (ASCI due diligence, Kofluence, ComplyCheck at ₹299/mo, CreatorIQ), with no dated legal trigger and low stakes. Dropped. |

**How the new learnings move the old ranking.** Every idea is missing at least one of the seven traits:

| Idea | Missing trait |
|---|---|
| One-Take | Stakes; eligibility |
| Sugam | A load-bearing model |
| Akshara | Novelty (an incumbent at scale); a track |
| Drishti | Feasibility and a physical demo |
| Proof Desk | Stakes and novelty |

None has trait 3, visible technical ambition, of the kind that wins TreeHacks or HackMIT.

---

## 3. The new idea: **Sariya** (सरिया, what every Indian mason calls rebar)

> **The steel skeleton of an Indian house is visible for exactly one day. Sariya checks it on a phone
> before the concrete hides it forever.**

The mason sweeps the iQOO 15 over a beam cage or slab mesh for ten seconds before the pour, offline. The phone:
- counts the bars;
- measures spacing and diameter class;
- measures stirrup spacing, including the tight zone near joints;
- finds hooks bent to 90° instead of the seismic 135°;
- flags missing cover blocks.

A versioned rulebook (IS 456:2000, IS 13920:2016, and the house's own drawing) returns **pass, fail or re-scan** for each check, and tells the mason out loud in Kannada or Hindi exactly which bar to fix. An independent engineer approves the signed evidence on a laptop over Office Kit, and the pour gets a permit QR.

Track: **Community App** (it connects masons, independent engineers and homeowners, with the model on-device at the core). Fallback: **Open Innovation**.

### 3.1 Why this problem (all verified this session)
- **Who builds India:** individual house builders drive **55% of India's cement demand** (Tata Steel). Most pour without an engineer on site. Skimping on steel (fewer or thinner bars, wider stirrups, 90° hooks, no cover blocks) is invisible the next morning.
- **The cost:** NCRB records **7,874 deaths in structure collapses in 2020-24**, 1,525 of them in 2024.
  - In Bengaluru, the Finale city, the under-construction Babusapalya building collapsed on 22 Oct 2024 and killed 9. The FIR alleged cheap material was used "to save money", and seven floors were being built on a four-floor permit.
- **Earthquakes:** BIS's 2025 zonation map puts **61% of India's land** in moderate-to-high hazard. That code revision was later withdrawn and IS 1893:2016 reinstated, so cite the map, not the code.
  - The Turkey 2023 collapses were widely documented with **90° hoop hooks and wide hoop spacing** (ACI webinar on reinforcement detailing).
  - IS 13920:2016 requires **135° hooks with a 6d (≥65 mm) extension**, and closer hoop spacing near joints (75-100 mm special confining reinforcement).
- **Government money already pays on photos that prove progress, not quality.** PMAY-G is building **2 crore more rural houses by March 2029** (₹3.06 lakh crore outlay).
  - Instalments are released only on **geotagged stage photos in AwaasApp** (foundation, lintel, roof). A photo proves the stage exists, not that the steel is right.
  - **2.81 lakh rural masons** have been trained in disaster-resilient construction, and nobody checks their work at the pour.
- **Lenders pay on stage inspections too.** Construction loans release tranches after an empanelled engineer's site visit at foundation, plinth, lintel and roof.
- **Fake steel is live news:** 25 tonnes of counterfeit "Super XT 600" TMT were seized in Purulia this month (Sep 2026).

### 3.2 Competition: honest map

| Who | What | Gap Sariya fills |
|---|---|---|
| **Kajima + Mitsubishi Electric Engineering "Field BarR"** (Japan) | AI rebar inspection with **two stereo cameras + a tablet** on a gantry. Cut witness inspection time ~70% (300 → 100 min per cage); rated "A" by MLIT's PRISM programme | Validates the job at the top end. Needs a stereo rig, targets Japanese general contractors, Japanese codes |
| **PIX4Dcatch + DataLabs Modely** (Japan) | Rebar as-built by walking with an **iPhone using LiDAR** + photogrammetry; 850 h saved on a rail job | Needs LiDAR and cloud processing; enterprise |
| Screening Eagle (Profometer, GPR + AI tagging) | Finds rebar **after** the pour with pro hardware | Too late, and costs lakhs |
| CRSI Rebar Reference app, checklist SaaS (SiteSetu etc.) | Reference tables and paper-style checklists | No measurement |
| Academic work (RGB-D spacing, point-cloud segmentation) | Lab results, depth sensors | Not a product; no Indian codes or languages |
| Tata Steel Aashiyana, JSW, UltraTech IHB programmes | Portals and loyalty for home builders and "influencers" (masons, contractors) | **Channel/partner, not competitor.** They want a reason to be on site at the pour |

**Pitch line:** *"Japan's biggest contractors inspect rebar with a stereo rig and a tablet, and their
government rates it A. We do it with one ordinary phone camera, a printed card and the NPU, offline, in
Kannada, for the mason who builds 55% of India."*

Hackathon collision: none of the ~110 iQOO city repos, the 18 city winners, or any of the 12 AI brainstorm sources in our collision test touched construction QA. Expect **0-1 lookalikes** in the Finale field.

### 3.3 The product loop

1. **Spec in (Office Kit).** The engineer or homeowner drags the structural drawing or bar-bending schedule PDF from the laptop to the phone.
   - Gemma 4 E2B (vision) extracts a typed spec per member: bar dia/count/spacing, stirrup dia/spacing, confinement-zone length, hook type, cover.
   - **Every field is confirmed by a human.** Extraction never feeds the verdict unconfirmed.
   - With no drawing, "code-minimum mode" uses IS 456/13920 defaults and labels them as such.
2. **Capture.** The mason drops a printed **Sariya card** (an ArUco board with known geometry and colour patches) on the mesh and sweeps a 10-second video. The card gives true scale and a camera pose on every frame, so no ARCore or LiDAR is needed.
3. **Perceive (NPU).**
   - A thin-structure rebar segmentation model and centreline fitting.
   - Card-anchored multi-view triangulation for 3-D cages; homography for planar slab and footing meshes.
   - Hook keypoints give the angle and extension; a diameter class (8/10/12/16/20 mm) comes from edge width at card scale.
   - Cover-block detection.
4. **Decide (deterministic).** The rulebook compares measurement ± uncertainty against drawing and code: **PASS / FAIL / RE-SCAN**. Re-scan means "within my error of the limit, move closer or use the tape". The model never rules.
5. **Tell (voice, on-device).** For example: *"Beam B2, left end: stirrups at 180 mm, drawing says 100 for the first 600 mm. Add 4. Stirrup 7: hook is 90°, bend it to 135°."* Offending bars glow red on the 144 Hz screen. The mason can ask back by voice (IndicConformer/Gemma 4 audio).
6. **Prove.**
   - Android Keystore/StrongBox signs frames, measurements, rulebook version, time and GPS. The record is tamper-evident, not "proof".
   - The evidence pack goes to the **engineer's laptop over Office Kit**. The engineer overrides or approves with a remote-control click, and the phone issues a **pour-permit QR**.
7. **Community.**
   - Masons build a verified record of passed pours, a work passport that wins jobs; loyalty programmes already reward this audience.
   - One independent engineer can remotely clear 10× more sites.
   - Homeowners and lenders see the evidence.
   - Stretch: OCR of rolled rib marks (brand + grade, e.g. "Fe 550D") against the invoice, to catch fake TMT.

### 3.4 Why it scores, criterion by criterion

| Criterion | Why Sariya earns it |
|---|---|
| Screening: novelty | Zero hackathon collisions. Globally it exists only as Japanese stereo-rig or LiDAR enterprise kit. |
| Screening: problem choice | Deaths, a Bengaluru collapse, 55% of cement demand, a 2-crore-house government programme paying on photos. |
| Screening: phone-first | The laptop can't stand on a rebar mesh. The phone is camera, ruler, voice and signer. |
| End product 30 | A mason can use it at tomorrow's pour. One loop: spec → scan → verdict → fix → permit. |
| Novelty + impact 20 | Life-safety at crore scale; a new capability (metric rebar geometry from one RGB camera). |
| Creative phone use 15 | Camera is the core loop, voice both ways, several NPU models running continuously. |
| Tech depth 15 | Card-anchored multi-view metric geometry without ARCore/LiDAR, thin-structure segmentation, uncertainty-propagating rulebook, on-device document-to-spec, Keystore attestation, heterogeneous CPU/GPU/NPU. |
| Office Kit 10 | Load-bearing: drawings in, evidence out, the engineer's approval is a remote-control click, live mirror during review. |
| Demo 10 | The judge sabotages a real steel cage and the phone catches it; the judge checks with a tape. |

- **Estimated screen: 43/50** (N9 T9 P9 S6 Ph10). Scope becomes about 8 with the tiered build in §3.6.
- **On-site: ~83.** **Big-league: 9/10**, since it has all seven traits.

### 3.5 The four-minute demo (airplane mode throughout)
1. **0:00** One photo: Babusapalya, Oct 2024. *"This mistake was visible for one day."*
2. **0:25** On the table: a 1 m beam cage in real 8/10 mm TMT with binding wire (under ₹1,500 from any hardware shop) and a 60×60 cm slab mesh. **A judge sabotages it in secret:** bends one hook to 90°, slides two stirrups apart, pulls a cover block.
3. **0:50** A teammate sweeps the phone for 10 s. The offending bars turn red, and the phone speaks the fix in Kannada or Hindi and cites the clause.
4. **1:40** **The judge checks with a tape measure; the numbers agree.** Then a bar set right at the limit gets **"Re-scan: within my error"**. An instrument that admits uncertainty is the trust moment.
5. **2:20** Laptop over Office Kit: the engineer reviews the evidence pack and approves, and the phone shows the pour-permit QR. A teammate edits one JPEG in the pack and verification fails live.
6. **3:00** Numbers slide: error table from N real Bengaluru sites (spacing ±x mm, hook-angle accuracy y%, diameter-class accuracy z%), scan latency, battery per scan.
7. **3:30** Who pays: steel/cement IHB programmes (a free service that drives loyalty), construction lenders (tranche verification), PMAY-G block engineers. Then the ask.

### 3.6 Build plan: ambitious, but tiered so it never demos broken
- **Tier 1 (must work by Eval 1):** planar slab mesh with the card, via homography, bar segmentation and centrelines. Outputs are count and spacing, a rulebook verdict with re-scan, voice output, and the Office Kit evidence pack with a Keystore signature.
- **Tier 2 (by Eval 2):** beam/column cages using card-anchored multi-view triangulation. Adds stirrup spacing by zone, hook-angle keypoints, cover-block detection, diameter class, and the drawing-to-spec extractor with a confirm UI.
- **Tier 3 (stretch, the "insanely complex" layer):**
  - a learned metric-depth prior fused with multi-view for card-free scans;
  - rib-mark OCR for steel brand and grade;
  - a slump-cone check by camera at pour time;
  - a mason work-passport network with peer and engineer review;
  - PMAY-G stage-photo export.
- **Red Light hours (phone only):** scan cages, tune thresholds, grow the error table. That keeps camera, NPU and voice telemetry high all weekend.

### 3.7 Before 9 Oct (data and people, not code)
1. Build or buy the demo cage and mesh. Photograph **15-25 real pre-pour sites in Bengaluru** (there are construction sites on every other street) from many angles, with tape ground-truth. This becomes the error table and the training/validation set.
2. Generate a synthetic set as well: Blender procedural cages with domain randomisation, for thin-structure segmentation.
3. **Ask the organisers in writing whether a model trained before the event is allowed**, given that all app code must be written at the event.
   - If no: fine-tune at the event on the laptop during Green Light.
   - The zero-shot fallback is an open-vocabulary detector + ridge/line detection + card geometry.
4. Get one practising structural engineer and one mason on record (quote plus photo, with consent). A Tata Aashiyana, JSW or UltraTech IHB contact is a bonus; never name a partner who hasn't agreed.
5. Pull exact clauses: IS 456 cl. 26.3/26.4 (spacing, cover) and IS 13920:2016 (hoops, hooks, confinement). Have the engineer check the rulebook table.
6. Check the name "Sariya" for trademarks. Alternatives: "Ek Din", "Pakka", "Pour Pass".

### 3.8 Hostile questions and honest answers

| Question | Answer |
|---|---|
| "So you certify my building is safe?" | **No.** It's a pre-pour screening checklist with a published error table; an engineer signs off. It catches what nobody checks today. |
| "Your camera can't tell 10 mm from 12 mm." | At card scale and ~30 cm, one pixel is well under 0.1 mm. We report a class *with confidence*, or re-scan. Show the confusion matrix. |
| "Cover depth is hidden under the mesh." | Correct. We check that cover blocks are present and ask for one tape reading by voice. We don't pretend. |
| "The contractor will never use this." | The homeowner, the lender and the steel brand want it. For the mason it builds a verified track record that wins jobs. |
| "Bengaluru is seismic zone II." | Skimped bar counts, spacing and cover kill buildings everywhere (Babusapalya). Seismic detailing covers the other 61% of India. |
| "Japan already does this." | Yes, with stereo rigs and LiDAR iPhones for general contractors, and MLIT rated it A. That's our proof of value. We do it on one ordinary camera, offline, in Kannada. |
| "Why on-device?" | Basements and villages have no signal. The fix has to happen before the pour crew arrives. Evidence is signed at capture. At 2 crore houses, the marginal cost must be zero. |
| "Isn't the model deciding compliance?" | The model only perceives geometry. A versioned rulebook decides, with uncertainty, and abstains near limits. |

### 3.9 Claims never to make
"Certifies structural safety", "tamper-proof", "replaces the engineer", a partner's name before they agree, "the 2025 seismic code is in force" (it was withdrawn).

---

## 4. Ranking after this pass

| Rank | Idea | Screen | On-site | Big-league | Note |
|---|---|---:|---:|---:|---|
| 1 | **Sariya** (new) | 43 | ~83 | 9 | Needs data collection this week and an independent red team |
| 2 | Sugam | 39 | ~74 | 6 | Fallback if Sariya fails red team; same instrument DNA, weaker AI |
| 3 | Drishti | 35 | ~73-78 | 6 | Only if OriginOS capture works and a blind tester signs on |
| 4 | Akshara | 35 | ~74 | 7 | No Finale track, and Wadhwani at scale |
| 5 | One-Take / Proof Desk | 32 | ~70-72 | 4-5 | Eligibility (One-Take) or incumbents (Proof Desk) |

Sariya takes the good part of each earlier idea and fixes what that idea lacked:

| Earlier idea | Kept in Sariya | Fixed in Sariya |
|---|---|---|
| Sugam | Instrument + rulebook + re-measure | The model is now load-bearing |
| Drishti | Institution loop + signed evidence | A physical, judge-participatory demo |
| Akshara | Model constrained by a known reference (the drawing) | An empty field instead of an incumbent at scale |

## 5. Caveats
- The scores are my judgment calls, and I authored the new idea.
- NCRB 2023 alone wasn't found; the 2020-24 total and the 2024 figure are.
- "90° hooks in Turkey" is documented in engineering reviews, not as the single cause.
- HackMIT 2025's overall winner wasn't confirmed; only Marvis (track 1st) and the GPU team's placing were.

## 6. Next steps
1. **Today:** confirm the Finale direct-entry window (§0).
2. Red-team Sariya with Codex at xhigh using redteam/RUBRIC.md, the way the earlier finalists were, especially accuracy physics, 48-h scope and the pre-trained-model rule.
3. If it survives: site photos and tape ground truth (15-25 sites), the demo cage, an engineer and a mason on record, and the organiser email about pre-trained models.

## Sources
- Event: https://iqoo.reskilll.com/ · https://www.itvoice.in/iqoo-announces-indias-phone-first-hackathon-series-challenging-young-innovators-to-build-ai-powered-solutions-for-real-world-problems-on-mobile · https://community.iqoo.com/in/thread/172581
- Winners: https://stanforddaily.com/2026/02/15/12th-annual-treehacks/ · https://stanforddaily.com/2025/02/18/treehacks-awards-200000-in-prizes-to-students-from-around-the-world/ · https://blog.adafruit.com/2026/09/28/building-a-gpu-in-24-hours-and-winning-hackmit · https://github.com/williamhao99/marvis-hackMIT2025 · https://blog.dylanlu.com/cal-hacks-12/ · research/C-winning-patterns.md (Gemma, Qualcomm, iQOO, Reskilll)
- Market: https://www.360iresearch.com/library/intelligence/on-device-ai · https://www.grandviewresearch.com/horizon/outlook/edge-ai-market/india · https://www.business-standard.com/technology/tech-news/flipkart-counterpoint-research-smartphone-insights-report-2026-market-trend-price-ai-126042900701_1.html
- Sariya competition: https://jp.ibtimes.com/kajima-cuts-osaka-rebar-inspection-time-70-mobile-ai-system-104355 · https://www.mee.co.jp/sales/ict/aihaikin/ · https://cir.nii.ac.jp/crid/1390577133276297088 · https://pix4d-com-preview.netlify.app/blog/cut-rebar-inspection-pix4dcatch/ · https://www.screeningeagle.com/en/inspection/revolutionize-your-rebar-inspection-projects-with-ai-powered-auto-tagging · https://www.mdpi.com/2071-1050/13/22/12509 · https://www.mdpi.com/2075-5309/14/11/3693
- Sariya facts: https://www.tatasteel.com/newsroom/press-releases/india/2018/tata-steel-launches-aashiyana-portal-for-individual-home-builders/ · https://factly.in/four-states-account-for-half-of-indias-building-collapse-deaths/ · https://www.pressreader.com/india/the-hindu-erode-9ww6/20260908/281706916561850 · https://www.outlookindia.com/national/bengaluru-rains-building-collapse-death-toll-search-and-rescue-operations · https://www.insightsonindia.com/2025/11/29/india-revised-earthquake-design-code-2025/ · https://www.concrete.org/portals/0/files/pdf/webinars/ws_F23_Lequesne.pdf · https://www.iitk.ac.in/nicee/IITGN-WB/EQ04.pdf · https://ddnews.gov.in/en/govt-extends-pmay-g-targets-two-crore-additional-rural-houses-by-2029/ · https://www.pib.gov.in/PressReleasePage.aspx?PRID=2074713 · https://pmaygnicin.blog/pmayg-awaasapp-guide-2026/ · https://www.aavas.in/blog/home-construction-loan-disbursement-process · https://www.thestatesman.com/cities/kolkata/25-tonnes-of-fake-super-xt-600-tmt-bars-seized-in-purulia-1503643693.html
- Old-idea checks: https://www.wadhwaniai.org/programs/oral-reading-fluency/ · https://www.disabilityrightsindia.com/2024/11/supreme-court-holds-recommendatory.html
