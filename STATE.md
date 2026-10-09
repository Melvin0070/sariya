# Sariya session state

## Status (9 Oct 2026, 23:55): base segmentation model v1 trained
- **Data:** ROI-1555 downloaded and verified (1,555 images, 10,481 bar instances, 0 errors; `prep/train/verify_labelme.py`), tiled by `prep_data.py`: train 853 / val 271 (scen1) / test 427 (scen2+3). Not used: ConRebSeg (22.6 GB, demolition scenes; index checked: 41,237 ExposedBars masks), Roboflow (needs a key), whiesty (Baidu only).
- **Training:** Kaggle T4, private kernel `sabarinarayanakg/sariya-unet-train` v4, pushed by `prep/train/kaggle/push_train.sh` (offline: wheels + timm `mobilenetv3_large_100.ra_in1k` in the private dataset `sariya-train-deps`). 50 epochs, 17:17-18:17 UTC, git `b5df62c`, ~70 s per epoch.
- **Result:** best val IoU 0.871 / F1 0.931 (epoch 48); **held-out test IoU 0.847 / F1 0.917**. Weights at `~/sariya-data/runs/base_v1/unet_mbv3_1152.pt` (27 MB, sha256 203ef1f8…). Misses: thin or distant stirrup legs; false positives: shiny aluminium rails. Keep bare metal out of the demo frame.
- **Speeds:** M5 trains at 6 img/s at batch 2 max (16 GB RAM, swap full); the T4 at ~12 img/s, CPU-augmentation bound.
- **Kaggle:** GPU and internet came only after phone verification; before that, jobs ran CPU-only without a warning. The Colab CLI (`google-colab-cli`) is installed but not signed in.
- **Export and benchmark (10 Oct, 01:15):** `models/seg/v1/unet_mbv3_1152.tflite` (float, exact parity with PyTorch). On the iQOO 15: **NPU 12.2 ms in burst mode** (all 160 layers on the HTP; 12.8 ms sustained over 60 s, no throttling), GPU 19.8 ms, CPU 235 ms. **Gate G0 (< 25 ms on the NPU) passes.** The NPU needs QAIRT 2.50 libs (the CLI's pinned 2.47 is rejected), burst mode and a JIT cache (first compile 53 s, cached 4-8 s). SM8850 AOT failed for the same QAIRT reason; JIT makes it optional. Full report: `notes/14-model/MODEL-V1.md`.
- **Next:** prop photos for round 2; lane B wires `Accelerator.NPU` + burst + cache into P1/P4.

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
