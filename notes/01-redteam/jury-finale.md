# Sariya: hostile screening panel and Finale jury (red team, 30 Sep-1 Oct 2026)

This lane covers the screener and the Finale jury. Physics and market belong to other lanes and appear here only as a juror would raise them.

Tags:
- **[S]**: seen in a search result (URL in §F).
- **[B]**: background belief.
- **[I]**: inference.

All scores are hypotheses.

## Bottom line

| | As written (IDEA.md) | With the rescue (§E) |
|---|---:|---:|
| Screening /50 | 39 | 42 |
| P(shortlist), if the entry is screened | 0.30 | 0.45 |
| On-site /100, expected (range) | ~63 (50-78) | ~77 (68-84) |
| P(top 10), if attending | 0.35 | 0.55 |
| P(podium) | 0.08 | 0.20 |

**Verdict: WOUNDED.** The core holds: count and spacing against a card is physically sound, the stakes are real, and nothing in the field looks like it. Four things are wrong as written:
- the demo leans on the weakest checks;
- the novelty line is false;
- the approval design fails a security question;
- the track reads as gaming.

**Gates outside the idea:**
- The window may be closed (press said 27 Sep).
- "Shortlisted online registrations, three student and three working professional" (guide) may cap direct entries at 6.
- Whether a pre-trained model is allowed is unconfirmed.
- Nobody has asked whether steel is allowed into the venue and onto the pitch stage.

---

## A. The screener (about 2 minutes per entry)

### A.1 The first 30 seconds (track, title, the first lines of "what, for whom, how", a deck flick)

| Shortlist if | Reject if |
|---|---|
| The problem is visceral and plain: "the steel inside a house is visible for one day". | A laundry list that reads as a six-month product: 8 checks, multi-view 3-D, drawing parsing, two languages, attestation, a permit QR, a passport network. |
| Deck slide 1 is a real Bengaluru mesh with the card, a tape, and two bars marked red. | Jargon walls: "IS 13920, 135°, 6d, homography". |
| It's one act (sweep, get a fix list), not a platform. | "Community App" next to an inspection instrument. |
| Nothing like it is in the pile of scam shields and memory apps. | "Permit" sounds statutory, and "certify" is worse. |
| | Claims a CV-literate screener doubts, e.g. "one pixel under 0.1 mm" (B.8). |

### A.2 Scores

| Criterion | As written | Fixed | Hostile reasoning |
|---|---:|---:|---|
| Novelty | 8 | 8 | Unique in the hackathon. But "the camera checks a physical assembly" already won Bengaluru: Tokito, circuit debug [I, from the name]. Japan has shipped the method (B.5). |
| Tech impact | 7 | 8 | The solid checks (count, spacing) are listed next to dubious ones (hooks, diameter at distance, cover), which discounts the lot. |
| Problem choice | 9 | 9 | Deaths, a Bengaluru collapse, PMAY-G paying on photos. The 55% figure is from 2018. |
| Idea/scope fit | 5 | 7 | The form still says 30 h, and three tiers read as over-scope. Lead with Tier 1 plus one Tier-2 check. |
| Phone-first fit | 10 | 10 | A camera on a mesh, offline, with voice. A laptop can't do any of it. |
| **Total** | **39** | **42** | The self-score was 43. |

**P(shortlist):**
- 0.30 as written.
- 0.45 with Open Innovation, a plain first sentence, a real site photo, and Tier 1 in the lead.
- The "team stands out" box should list what is legal before the event: the site set with tape ground truth, the demo cage, an engineer and a mason on record, and prior Android or CV builds. The scope-fit score is a bet on the team.

### A.3 Is Community App track-gaming?
**Yes, as written.**
- The brief wants an app that "connects developers, professionals, or interest groups".
- Everything built by Eval 2 is a single-user instrument, and every community feature (work passport, peer review, engineer network) sits in Tier 3.
- The terms allow "relevance to the declared track" as a criterion (§06).
- The Reskilll juror's first question would be "where's the community?", and the honest answer is "the roadmap".

The label becomes defensible only if the two-role mason→engineer loop (change #4) is in Tier 1. Even then it is a two-party workflow, not a community.

### A.4 Track choice

| Track | Fit | Field | Call |
|---|---|---|---|
| **Open Innovation** | Exact: "any domain, with a local or open source model at the core" | Crowded, since it absorbs Fin/Edu/Health qualifiers. That matters only if awards are per track. | **Recommended** |
| Productivity | Plausible: "improve workflows" (Japan: 300 → 100 min per cage) | Full of memory apps, so Sariya would stand out | Second choice. It undersells the stakes. |
| Community App | Weak without the two-role loop | Thin | Only if Finale awards are per track **and** the loop is in Tier 1 |
| Smart Living / Mobility / Dev Tools | None | — | No |

**Title:** *Sariya: check the steel before the concrete hides it.*

**Framing sentence (no `<`):** *Sariya is an offline steel checker for India's self-built homes: minutes before a slab or beam is poured, the phone is swept over the rebar with a printed card, and an on-device model counts the bars and measures their spacing against the drawing and IS 456, says the fix aloud in Hindi or Kannada, says "re-scan" when it is unsure, and hands the engineer a signed record.*

Ask the organisers whether the "special track awards" in the guide apply at the Finale.

---

## B. The Finale jury: six hostile jurors

The Finale panel is unannounced. Reskilll's blog describes "a 5-person jury drawn from industry" [S] (the context file counted 15 names across city panels, so expect rotating panels), and its own guide picks the Top 10 on "output quality, platform differentiation, robustness, and clarity of architecture" [S]. With five votes, one hostile security or AI juror moves a podium.

### B.1 Scores on the lines each juror owns

| Juror | Line | As written | Rescued | Reason |
|---|---|---:|---:|---|
| Founder/CTO | End product /30 | 17 | 22 | Works on a table, but site performance is unproven and "who holds the phone" is unanswered. |
| | Novelty+impact /20 | 15 | 16 | A homeowner pours about 5 slabs in a lifetime, so retention is doubtful. |
| Enterprise architect | Tech depth /15 | 9 | 11.5 | Degraded modes and the Office Kit transport are unexplained. |
| Security lead | Tech depth /15 | 7 | 11 | The approval is signed by the mason's key, "scan good, pour bad" is open, and the JPEG test only exercises a hash. |
| AI/ML (nasscom) | Novelty+impact /20 | 13 | 16 | Japan's plate-plus-photo method punctures "new capability". |
| | Tech depth /15 | 9 | 11 | No training provenance, no confusion matrix, no abstention rate. |
| Qualcomm DevRel | Phone use /15 (perceived) | 11 | 13 | The camera and NPU really are the product. |
| | Tech depth /15 | 9 | 12 | NPU need is asserted, not measured. |
| Reskilll organiser | Office Kit /10 (perceived) | 5 | 7 | A file copy plus a click on someone else's phone. |
| | Demo /10 | 6 | 8 | High ceiling, low floor. It overruns 5 min as scripted. |

### B.2 Founder/CTO
**Q1. "Who holds the phone at 7 a.m. on pour day, and why would the contractor who skimped run the app that catches him?"**
- "He isn't the operator. Whoever pays for the concrete is: the homeowner, usually on site that day [B], the lender's engineer at the slab-stage visit, or the steel brand's site rep. It takes 10 s and no skill.
- The mason hears the fix because he bends the hook, and a passed record protects an honest mason later.
- The repeat user is the engineer clearing 10-20 sites a day from a desk."

**Q2. "New steel on a clean table. Show me a real Bengaluru slab, your tape readings, your miss rate. And what happens when a slab you passed cracks?"**
- Open the in-app numbers screen: N sites, per-check error with a 95% CI, the miss rate on seeded defects.
- Replay one recorded site sweep on the spot.
- "We never pass a slab. We report measured values with bands, and the engineer signs."

### B.3 Enterprise architect
**Q1. "The card is occluded or kicked mid-sweep and the concrete truck is idling. What's the degraded mode, and what can't you detect?"**
- "Each frame's card pose is checked for reprojection error and plane motion. A moved card invalidates frames; it never silently rescales them.
- No card means no measurement: we fall back to a guided tape checklist, with values entered by voice into the same signed record, so we never block a pour.
- The undetectable case is a bar hidden under another bar. So we report coverage, meaning which bars were seen in at least N frames, and never count an unseen bar."

**Q2. "Office Kit links one person's devices under their vivo account [S; the one-person reading is I]. How does an engineer across town approve over it? Otherwise it's a USB cable."**

IDEA.md's "remote-control click on the mason's phone" fails here. Better answer:
- "Office Kit isn't the transport. The signed pack travels over anything (WhatsApp, a lender portal, Quick Share).
- Office Kit is the engineer's desk: their own phone and laptop, drawings dragged in, 20 packs reviewed on a big screen, the approval signed by their phone's key.
- Hence two phones in the demo."

Keep ready: the rulebook is a signed, versioned file, and every verdict records its hash.

### B.4 Security lead
**Q1. "Your signature proves this phone made these bytes. What stops someone scanning a good cage (yesterday's, the neighbour's, or the same beam as B2 and B3) and pouring a bad one?"**

"Nothing makes it impossible; we make it costly and visible:
- the engineer issues a card per site (unique ArUco ID plus a site code), which must be in every frame;
- the sweep starts from a site anchor tag;
- packs are perceptually hashed, so a cage scanned twice is flagged;
- the engineer can demand a live re-scan of one random member;
- the sign-off binds the pack hash, the card ID and the date.

Tamper-evident, not tamper-proof."

**Q2. "The approval is a click on the mason's phone, so it's signed with the mason's key. Whose key signs what? Where do the faces and the home location go? And isn't the JPEG edit just sha256?"**

"Two devices, two keys:
- The capture key is hardware-backed. Its attestation carries the app digest and the verified-boot state.
- The engineer's approval key sits behind a fingerprint.
- The QR is verified offline against the engineer's pinned public key.
- Nothing leaves the phone unless the homeowner shares it. Frames are cropped to the member and faces blurred on-device. GPS is advisory, with the mock-location flag recorded.
- Our tamper test is a replay: yesterday's valid pack is rejected for today's pour."

Own the limits: hardware-attestation bypasses are documented [S]. C2PA through `c2pa-android`, which supports Keystore/StrongBox signing [S], is optional polish, and only if it integrates in under 3 h.

### B.5 AI/ML lead (nasscom AI)
**Q1. "Japan's IHI consortium measured diameter and spacing from a plate on the bars and ordinary camera, smartphone or drone photos, to ±1.0 mm and ±5 mm, in rain and dark [S]. MLIT issued digital rebar-inspection trial rules in 2023 [S]. What's new? And on your clean table, wouldn't a Hough transform do the 'AI' job?"**
- "The method is proven, which is why we trust the physics.
- What's new is where it runs and who it serves: offline on a phone, live guidance, India's 2 mm size steps and IS 456/13920 rules, the fix spoken in Hindi or Kannada, and a signed record for a lender.
- On the table, Hough works. Here's the ablation on our Bengaluru sites, where binding wire, formwork edges and shadows break it: X and Y for Hough against X′ and Y′ for ours."

**Q2. "What is the model, what trained it, when? Show the 10-vs-12 mm confusion matrix, hooks 90° vs 135° on real sites, and your re-scan rate on clean cages."**

Template (the numbers must be measured):
- YOLOv11-seg from Qualcomm AI Hub (open weights, attributed).
- Fine-tuned at the event on ROI-1555, the synthetic SORD set and Roboflow rebar-seg [S], plus our Bengaluru frames, with a timestamped training log.
- Diameter only in close-up mode; hooks only from 3 or more views; abstain otherwise.
- The re-scan rate on clean members, the false-pass rate on seeded defects, and calibrated bands (95% of tape readings inside the 95% band).

Ultralytics YOLO is AGPL [B]. A product-minded juror may ask; the production answer is an Apache-licensed model.

### B.6 Qualcomm DevRel
**Q1. "Which model needs the NPU? A 10 s clip analysed afterwards runs on the CPU in 20 s."**
- "Post-hoc analysis doesn't need it. Live guidance does.
- AI Hub lists YOLOv11-seg at about 3.3 ms on the 8 Elite Gen 5 NPU [S]. That allows a 30 fps overlay with coverage hints ('bars 1-6 done, move left'), so the first sweep succeeds.
- On the CPU it runs at N fps (measured) and people re-sweep.
- The pipeline is ISP → NPU segmentation → GPU warp and render → CPU for ArUco, RANSAC and the rulebook. Here's the trace."

**Q2. "What did INT8 do to thin-bar recall? And what are the battery and skin temperature after 40 scans on a sunny roof?"**

Measure:
- FP16 vs INT8 recall, and which layers stay at w8a16.
- Battery used and peak temperature over 40 scans.
- "This phone holds about 52% of peak CPU under sustained throttling [S], so we keep the load bursty: 10 s scans, with the display at 60 Hz during capture."

### B.7 Reskilll organiser
**Q1. "Unplug the laptop. What stops?"**
- Honest answer: capture, verdict, voice and signing all keep working, by design, because sites are offline. What stops is the engineer's desk (drawings in, packs on a big screen, approvals from the keyboard). Office Kit is a productivity layer; the phone is the instrument.
- The HackTracker Office Kit line counts usage, so build-time habits move it more than design does:
  - route every test scan to the laptop for error-table analysis;
  - keep the phone mirrored while debugging in Green Light.

**Q2. "Show me the community you built this weekend."**
- Moot under Open Innovation. Under Community App, the only answer is the thin two-role loop.
- Pitch from the phone. The numbers should be an in-app screen computed from the stored signed scans, since entries must "run and pitch on the phone".

### B.8 Do the IDEA.md §3.8 answers survive?

| §3.8 question | Survives? | Better answer |
|---|---|---|
| "You certify it's safe?" | Yes | Add that the screen never shows a member-level PASS: "4 of 6 checks within limits, 2 need tape, engineer to sign". |
| "Can't tell 10 from 12 mm" | **No.** The number is wrong (table below). | "Not from a standing sweep. Diameter is a close-up check: card beside the bar, 20-30 cm, a 50 MP still at about 0.05 mm/px. Japan's trials reported ±1 mm [S], which barely separates our 2 mm steps, so we classify only above 95% confidence; otherwise the phone asks for a vernier reading. Here's the confusion matrix." |
| "Cover depth hidden" | Yes | Blocks are checked where visible (edges, soffits). Depth is a tape reading entered by voice. |
| "Contractor won't use it" | **Partly.** It names who wants it, not who holds the phone. | Founder Q1. |
| "Bengaluru is zone II" | **Partly.** IS 13920 isn't mandatory in zone II [B], so "IS 13920 requires 135°" can be caught in a Bengaluru demo. | "The rulebook is zone-aware. IS 456 checks apply everywhere; IS 13920 checks are required in zones III-V and advisory in zone II." |
| "Japan already does this" | **No.** The premise is false. Japan uses a plate plus ordinary photos (IHI; ±1.0 mm, ±5 mm, 40% labour saved) [S] and has MLIT guidelines [S]; Kentem, Hitachi, Shimizu and BAIAS sell systems [S]. "Stereo rig vs one phone and a card" dies in a 30-second search. | AI/ML Q1: Japan proves the physics; Sariya brings it offline, in voice, under IS codes, to builders with no QA team. |
| "Why on-device?" | Yes | Add live 30 fps guidance, plus privacy (faces, home location). |
| "Model decides?" | Yes | Add the re-scan rate, the false-pass rate and band calibration. |

The "10 vs 12 mm" numbers [I]: main camera 23 mm-equivalent [S], 4K video, 68-74° horizontal field of view.

| Distance | mm per pixel | 10 vs 12 mm gap |
|---|---|---|
| 0.3 m | 0.11-0.12 | 17-19 px |
| 1.0 m | 0.35-0.39 | about 5 px |
| 1.5 m | 0.53-0.59 | 3-4 px |

- A 30 cm frame covers only about 45 cm of steel, so real sweeps happen at 1-1.5 m, before counting ribs, rust and blur.
- India's small sizes step by 2 mm; Japan's D10/D13/D16 step by 3 mm [B].

**Questions §3.8 is missing:**
- The ones above: who holds the phone, scan-good-pour-bad, whose key, training provenance, NPU need, card failure.
- "Would it have saved Babusapalya?" Partly. Initial reports said rods weren't properly installed in the foundation, but the building had 7 floors on a 4-floor permit and no approvals [S].
- "Why Kannada?" Many site crews are interstate migrants [B], so default to Hindi and offer Kannada for owners.

---

## C. 48-hour realism and the demo

### C.1 The tiers
Capacity [I]: 3 people × about 38 working hours ≈ 115 person-hours. About 55% of that is Red Light, where coding means Office Kit Remote PC on a 6.8″ screen at roughly a third of normal speed, which leaves about 75 laptop-equivalent hours plus Red Light time for capture, tuning and rehearsal.

| Tier | Person-hours [I] | Believable in 48 h? | What breaks first |
|---|---:|---|---|
| **1** (planar mesh, homography, segmentation, count and spacing, re-scan, voice, signed pack) | 55-75 | Yes, if the commit history shows it | 1. NPU conversion and quantisation (op support; INT8 on thin bars). Fallback: GPU delegate.<br>2. ArUco loss under glare and blur beyond 1 m.<br>3. Double-counting across frames. Use one card position per ~1 m² patch. |
| **2** (multi-view, stirrup zones, hooks, cover, diameter, drawing-to-spec) | +70-110 | No, not robustly. A full working set invites the "built before the event?" check. | 1. **Hook keypoints:** no labelled data; 3-D angle ambiguity.<br>2. **Multi-view matching:** parallel bars alias.<br>3. **Cover blocks:** occluded.<br>4. **Drawing extraction:** a 2.6 GB model [S] and a confirmed-but-wrong spec failure mode. |
| **3** | n/a | No | Everything. Scores zero. |

The most likely single failure: NPU conversion eats the first Green Light block. Put it on the critical path in hour 1, and get the Finale's Green/Red timetable now.

### C.2 The §3.5 demo, beat by beat

| Time | Beat | What fails [I] |
|---|---|---|
| 0:00 | Babusapalya | "Would it have saved them?" Only partly. A local tragedy the product wouldn't have prevented reads as exploitative. |
| 0:25 | Secret sabotage | TMT won't bend by hand without a bending key (0.25). Wired stirrups need pliers and take over 30 s. Sharp wire ends. Judges improvise: they move the card or swap in a thicker bar. |
| 0:50 | Sweep and verdict | P ≥ 0.5 that at least one of these happens:<br>- the hook is missed or the phone abstains (0.35);<br>- the cover block is missed (0.3);<br>- a false alarm (0.2);<br>- glare off mill scale under stage lights, or a white or patterned table;<br>- near and far bars overlap on the cage;<br>- dead air if processing runs over 5 s;<br>- inaudible Kannada that most jurors can't understand anyway. |
| 1:40 | Tape | The judge measures clear spacing instead of centre-to-centre, or at another point on a hand-tied bar, so readings differ by 10-20 mm (0.15). |
| 1:40 | Re-scan at the limit | Noise tips it to PASS or FAIL, and it looks staged (0.25). |
| 2:20 | Office Kit and JPEG tamper | The link drops in a crowded RF hall (0.15). The laptop isn't on the projector. The security critique is certain. |
| 3:00 | Numbers | N is small, or the figures come from the demo cage (0.3). |
| overall | Seven beats | Runs 5-6 min and gets cut before Office Kit and the numbers (0.5). **P(clean run) ≈ 0.2-0.35.** |

### C.3 The minimum demo that never breaks (3:30)
**Pitch kit** (must be light enough to carry onto a stage):
- a 45×45 cm mesh of 8 mm bars in slotted clips on a matte black board, card fixed;
- a 60 cm cage segment with zip-tied stirrups on a rail;
- a diffuse LED panel;
- gloves;
- a hot-spare phone with the same build and scans.

| Time | Beat |
|---|---|
| 0:00 | Your own site photo from this week, tape in frame: "Drawing said 150, bars were 230. Nobody checked." (Only if true.) |
| 0:20 | The judge draws **one card from a sabotage deck of robust faults**: remove a bar, slide a bar to about 220 mm, or open two end-zone stirrups. Add a pre-bent 90° stirrup swap only if rehearsal recall is at least 95%. |
| 0:45 | 10 s sweep at 50-60 cm with a live coverage overlay. Verdict within 3 s, values shown. Hindi voice, but **subtitles are the primary channel**. |
| 1:25 | Tape: the app draws the exact segment it measured ("212 ± 6 mm c/c"). |
| 1:50 | Physics on show: at 1.2 m "Re-scan: within my error"; at 40 cm, a confident FAIL. |
| 2:15 | Replay a recorded Bengaluru site sweep on-device, in airplane mode. Its flags match that site's tape photo. |
| 2:40 | The engineer's phone is mirrored over Office Kit. Approve with a fingerprint, show the QR, and the mason's phone verifies it. Then replay yesterday's pack: rejected. |
| 3:10 | In-app numbers, one line on who pays, the ask. |

P(clean run) ≈ 0.85-0.9 [I].

### C.4 Failure branches (rehearse the lines)

| If | Then |
|---|---|
| The card isn't found | The app says why ("glare, tilt 10°"). Swap to the spare matte card. After 20 s, run this morning's recorded sweep of the same fixture and say so. |
| The sabotage is missed | "That's a miss. Our site miss rate is X of Y, which is why an engineer signs." Show the frame and re-scan closer. Never argue. |
| False alarm | Show the measured segment and its band. Admit it if it's wrong and move on. |
| Crash or overheating | Switch to the hot spare. |
| Office Kit drops | The approval lives on the engineer's phone anyway. Show it under the document camera. |
| Overrun | Cut the replay attack first, then the site replay. Never cut the tape. |
| Props banned on stage | Lead with the site replay and a rehearsal video. Ask the organisers now. |

---

## D. Genericness and the field

- **Collision:** another construction team ≈ 5-10%, another rebar team ≈ 1-3% [I].
  - Construction-plus-CV hackathon winners are about PPE and safety, not QA (Ironsite 2026 [S]).
  - A default LLM suggests PPE or crack detection, and opening with "construction safety" invites that pattern-match. Open with "before the concrete hides it".
- **Shapes the jury has already seen:**
  - "The camera checks a physical assembly": Tokito, and maybe Assemblix [I].
  - Inspection plus a signed record: SmartLease.
  - An HMAC audit trail: Rakshak.
  - Office Kit plus cryptography: Vault.
  - So the signature is table stakes. Give it 20 s, not a minute.
- **What they'll remember an hour later:**
  1. "A judge broke the steel cage and the phone caught it."
  2. "It said it wasn't sure, and it was right."
  3. One local number ("x of 20 slabs we checked had a defect", if true).
  4. A mason's voice.

  Line: *"Concrete hides mistakes forever. Sariya gets ten seconds before it does."*

---

## E. Verdict

### E.1 Score by rubric line (expected value)

| Line | Max | As written | Rescued | Driver |
|---|---:|---:|---:|---|
| End product | 30 | 17 | 22 | Demo reliability, site evidence, who operates it |
| Novelty+impact | 20 | 14 | 16 | Japan puncture fixed |
| Creative phone use (HackTracker) | 15 | 11 | 12.5 | Camera and NPU all weekend; add push-to-talk commands for mic telemetry |
| Tech depth | 15 | 8.5 | 11.5 | Two-key trust, degraded modes, measured NPU use, ablation |
| Office Kit (HackTracker) | 10 | 6 | 7 | Driven by build-time use |
| Demo | 10 | 6 | 8 | Minimum demo plus branches |
| **Total** | 100 | **~63** | **~77** | Self-score ~83 |

### E.2 Kill-shot
The live "judge sabotages the cage" beat carries End product and Demo, 40 points between them. It rests on the three checks one RGB camera does worst (hook angle, cover blocks, 10 vs 12 mm) and on a Tier-2 multi-view pipeline that nobody makes robust in 48 h with 55% of the time phone-only. One missed sabotage or false alarm in front of a cold jury turns a safety instrument into a liability, and "a well-built simple product beats a broken complex one" does the rest.

A second landmine: the novelty line ("Japan needs stereo rigs") is false, and the AI juror can prove it in 30 s.

### E.3 Smallest rescue
Claim live only what a card and one camera measure reliably:
- bar count;
- spacing;
- stirrup spacing by zone.

Measure these on planar faces: the mesh, and the beam's side face with a clip-on card. Hooks, cover and diameter become close-up checks that abstain or prompt for a tape reading. Around that:
- sabotage deck limited to the measured checks;
- the approval on a second phone with its own key;
- Open Innovation;
- a real-site error table and one site replay.

### E.4 Top 8 changes

| # | Change | Gain | Effort |
|---|---|---|---|
| 1 | Robust-only sabotage deck, pitch kit, lighting, hot spare, replay mode (C.3) | +6 on-site; +10 pp P(top 10) | Low: 1-2 days on props, then rehearsal |
| 2 | "Faces as planes": stirrup spacing by homography on the beam side face; drop multi-view triangulation | +3; frees about 25 person-hours | Negative |
| 3 | 15-25 Bengaluru sites with tape readings. Produces:<br>- defect prevalence;<br>- calibrated error bands;<br>- a Hough ablation;<br>- one replay on stage. | +5 (EP +2, N+I +1, TD +1, Demo +1) | High: 4-5 field days before 9 Oct |
| 4 | Two phones, two keys; offline QR verification; a replay test instead of the JPEG edit; Office Kit as the engineer's desk | +3 (TD +1.5, Office Kit perception +1) | Medium: 8-10 person-hours |
| 5 | Open Innovation; a plain first sentence; "sign-off" not "permit"; Tier 1 in the lead | +10-15 pp P(shortlist) | None |
| 6 | Novelty story: IHI/MLIT prove the physics; the claim is India-specific | Avoids −3 to −5; +1 credibility | Trivial |
| 7 | Operator and payer: the payer's agent scans, the mason hears the fix, the engineer is the repeat user; show minutes per review | +2 EP | Low |
| 8 | Hardware proof: 30 fps NPU overlay with coverage hints; NPU vs GPU vs CPU latency; INT8 recall change; battery and temperature over 40 scans; all on the in-app numbers screen | +2-3 | Medium: 4-6 person-hours |

### E.5 Cut (adds risk, not score)

| Cut | Why |
|---|---|
| All of Tier 3 | Scores zero and reads as vapourware. Roadmap only. |
| Multi-view triangulation | Repetitive thin bars defeat matching. Planar faces do the job. |
| Drawing extraction with Gemma 4 E2B | 2.6 GB, and a confirmed-but-wrong spec failure mode. A 5-field spec form with voice entry covers the demo. |
| Hooks, cover and diameter as live sabotage | Weakest physics. Keep them as abstaining close-up checks. |
| Free-form Kannada voice Q&A | Hall noise and hallucination. Use a command grammar. |
| JPEG-edit tamper test | Demonstrates only sha256. Replace it with replay. |
| Babusapalya as the opener | Invites "would it have saved them?". Use your own site photo. |
| GPS as proof | Mock locations. Keep it advisory and record `isMock`. |

**Claims to change:**
- "new capability from one RGB camera";
- "globally only stereo or LiDAR kit";
- "one pixel under 0.1 mm";
- "engineer approves remotely over Office Kit";
- "pour-permit";
- "10× more sites" (unverified);
- "several NPU models running continuously" (unmeasured).

---

## F. Sources

- **Office Kit** (remote PC from the phone, phone mirroring with control, file transfer, clipboard, vivo account) [S]:
  - https://vivonewsroom.in/how-vivo-office-kit-is-breaking-cross-device-barriers-for-modern-users/
  - https://www.vivoglobal.ph/vivo-x300-series-introduces-seamless-phone-pc-workflow/
  - https://pc.vivoglobal.com/
- **iQOO 15 cameras** (main 50 MP IMX921, 1/1.56″, f/1.88, 23 mm, OIS, 4K60; ultra-wide 15 mm AF; macro crops the main camera) [S]:
  - https://www.gsmarena.com/iqoo_15-review-2905p5.php
  - https://www.fonearena.com/blog/467009/iqoo-15-price-specifications.html
- **iQOO 15 sustained load** (51.7% in a CPU throttle test; over 47 °C under load) [S]:
  - https://www.91mobiles.com/reviews/iqoo-15-review/
  - https://www.notebookcheck.net/Vivo-iQOO-15-Series.1247739.0.html
- **Japanese prior art** [S]:
  - IHI plate and photos, ±1.0 mm and ±5 mm: https://ken-it.world/success/2022/05/automatic-rebar-check.html
  - MLIT 2023: https://www.mlit.go.jp/gobuild/content/001594736.pdf · https://www.mlit.go.jp/tec/content/001619475.pdf
  - Kentem: https://www.kentem.jp/news/20240312_01/
  - Shimizu: https://www.shimztechnonews.com/hotTopics/news/2021/2021-03.html
  - Hitachi: https://www.hitachi-solutions.co.jp/contech/products/rebar_check/
  - BAIAS: https://www.gembaroid.jp/product/baias.html
  - Mitsubishi Electric: https://ken-it.world/it/2021/02/melco-ai-rebar-inspection.html
  - AI Rebar Counter: https://play.google.com/store/apps/details?id=com.bx.rebar.lite
  - ArUco-scaled rebar point cloud (under 1% error): https://ascelibrary.org/doi/abs/10.1061/JCEMD4.COENG-14287
- **Babusapalya** [S]:
  - https://constrofacilitator.com/bengaluru-building-collapse-need-of-adhering-to-civil-engineering-standards/
  - https://www.thenewsminute.com/karnataka/bengaluru-building-collapse-death-toll-rises-to-8-bbmp-suspends-engineer
- **Models and data** [S]:
  - https://huggingface.co/qualcomm/YOLOv11-Segmentation
  - https://huggingface.co/huggingworld/gemma-4-E2B-it-litert-lm
  - https://dev.to/jdshah/what-i-learned-by-dissecting-gemma-4-e2b-itqualcommsm8750litertlm-o85
  - https://huggingface.co/datasets/tsrobcvai/ROI-1555_Rebar_Detection_and_Instance_Segmentation_Dataset
  - https://www.sciencedirect.com/science/article/abs/pii/S0926580524006897
  - https://universe.roboflow.com/roomsegment/rebar-seg
- **Trust** [S]:
  - https://github.com/contentauth/c2pa-android
  - https://blog.google/security/pixel-android-trusted-images-c2pa-content-credentials/
  - https://blog.quarkslab.com/bypassing-android-hardware-attestation.html
- **Jury and format** [S]:
  - https://reskilll.com/blogs/iqoo-hackathon-2026-india-phone-first-ai-hackathon-iqoo-reskilll/
  - https://reskilll.com/blogs/how-to-win-iqoo-city-battles-strategy-guide-phone-first-ai-hackathon/
  - Organiser text: shared/guide.txt, terms.txt, faq.txt
- **Construction-safety hackathon win** [S]: https://www.cs.umd.edu/article/2026/05/cs-majors-build-construction-safety-app-ironsite-hackathon-0
- **Kannada in Google TTS since 2019** [S]: https://newzhook.com/story/siddhalingeshwar-ingalgi-visually-impaired-blind-google-kannada-text-to-speech-android-campaign-accessibility-assistive-technology/. Offline availability is unverified.
- **Background beliefs [B]:**
  - IS 13920 is mandatory only in zones III-V.
  - Ultralytics YOLO is AGPL.
  - Bar-size steps: 2 mm in India, 3 mm in Japan.
  - Migrant site crews.
  - The homeowner is present on pour day.
