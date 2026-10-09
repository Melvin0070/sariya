# Workstream 1: red-team verdict (1 Oct 2026)

**Lanes:**
- `codex.md`: Codex xhigh with live web search, working to the rubric.
- `jury-industry.md`: an Opus jury of engineer, maistry, homeowner, brand, lender and PMAY-G personas.
- `jury-finale.md`: an Opus panel playing the screener and six Finale jurors.
- `physics.md`: Claude's own physics check.

Each lane worked independently of the others. Detail and sources are in the lane files; this page is the synthesis.

## Verdict: WOUNDED (all lanes). The core survives; the pitch as written doesn't.

Measuring bar count and spacing against a card is physically sound, demoable on real steel, and unlike anything else in the field. What fails is everything the spec stacked on top of that.

| | Self-score | Codex | Finale jury | Industry jury | Consensus |
|---|---:|---:|---:|---:|---:|
| Screening /50, as written → rescued | 43 | 33 → 40 | 39 → 42 | – | ~36 → ~41 |
| On-site /100, as written → rescued | ~83 | 58 → 78 | ~63 → ~77 | – | ~61 → ~77 |
| P(shortlist) | – | 65% → 80% | 30% → 45% | – | Too wide to call (see below) |
| P(top 10), if attending | – | 20% → 40% | 35% → 55% | – | ~28% → ~48% |
| P(podium) | – | 5% → 12% | 8% → 20% | – | ~6% → ~16% |
| Product /90 | 61 | – | – | 44 | 44 |

All scores are hypotheses. The two shortlist estimates differ mainly on how many direct-entry slots exist, which only the organisers can answer.

## Kill-shots, ranked by how many lanes found them

1. **The demo leans on the checks the physics can't support (all four lanes).**
   - The weak checks are 10 vs 12 mm diameter, hook angle, cover, and multi-view 3-D.
   - The worst case leaves 0.84 mm between a 10 and a 12 mm envelope, and the three hook angles (90° and 135° seen from above) can look alike.
   - A 2-D view of a 90° bend can read as 135°. Bottom cover is not visible at all.
   - One missed sabotage in front of a cold jury turns the safety instrument into a liability. P(the §3.5 demo runs clean) ≈ 0.2-0.35.
2. **The novelty line is false (all four).** "Japan needs stereo rigs; we need one camera and a card" collapses in a 30-second search.
   - IHI's system reads a plate plus smartphone photos at ±1 mm diameter and ±5 mm spacing.
   - AIJO 配筋王 uses an ordinary tablet camera and follows MLIT's July 2023 digital rebar-measurement guideline. It is NETIS-registered and claims 70% time saved [V, page read].
   - Kentem, Hitachi, Shimizu, Obayashi and Kajima (300+ adopters) sell similar systems.
   - A 2018 Galaxy S7 app paper and a 2026 single-photo paper exist.
3. **The wrong person holds the phone (industry, Codex, Finale).**
   - The maistry is paid by area or by day, and a FAIL costs him a gang-day.
   - He won't sign evidence against himself, and a hostile operator can scan a good patch instead.
4. **The "pour-permit QR" permits nothing (all three juries).**
   - No bank, municipality or supplier asks for one, and it sounds like a BBMP permit.
   - Engineers won't approve remotely: a structural engineer was arrested after the Taratala collapse in June 2026.
   - The approval as designed is signed with the *mason's* key via screen mirroring.
5. **Community App is track-gaming as written (Codex, Finale).** Everything buildable by Eval 2 is a single-user instrument; the community exists only in Tier 3.

**Also:**
- The Babusapalya opener invites "would it have saved them?" It was a G+6 with no approvals and three ignored stop-work notices.
- There is no Indian data on pre-pour defect rates, only anecdotes.
- Brands are already at the pour with free engineers:
  - Ambuja: 31,698 slab castings a year [S];
  - UltraTech Expert Testing Van [V];
  - JSW Cement lists "reinforcement checking" [V].
- The 48-hour scope is unrealistic:
  - Tier 1 is 44-75 person-hours;
  - Tier 2 is +70-150;
  - Tier 3 scores zero.

## Where the lanes disagree, and my call

| Issue | Positions | Call |
|---|---|---|
| Track | Codex: Productivity ("an inspection assistant that improves site engineers' workflow"). Finale: Open Innovation (no relevance risk; keeps the stakes), with Productivity second | **Open Innovation.** Switch to Productivity only if the organisers confirm per-track awards, because Open Innovation also absorbs every FinTech, Education and Health qualifier. **Needs your confirmation.** |
| Stirrup spacing by zone | Codex: marginal (needs a side reference rail and a known zone origin). Finale and physics: sound on a planar face with a card or strip | Keep it in Tier 1 as a planar-face check with a strip fiducial. Put it in the live demo only if rehearsal recall is at least 95%. |
| Sariya vs Mauka | Industry: product 44/90, below Mauka's 57. Codex: the rescued Sariya still beats the current Mauka spec for a cold jury | **Stay with Sariya.** Mauka's 57 is still self-scored, so compare after Mauka's own red team. The "track-gaming" half of the PRODUCT-LENS §6 switch condition is met as written, but the track change makes it moot. |

## The rescue, now in IDEA.md v2

1. **Operator:** the person already paid to check (the owner's engineer or inspector, a builder's QC supervisor, or a brand's technical engineer), scanning the evening before the pour. The mason *hears* the fix: Hindi by default, Kannada, with subtitles.
2. **Live claim:**
   - What's measured: bar count, bar spacing and stirrup spacing by zone, on planar faces, against an engineer-confirmed spec.
   - Every value carries an error band.
   - Each check comes back as "within limits", "outside limits", "needs a tape reading" or "not seen".
   - Never PASS or "safe".
3. **Physical prompts for what a camera can't do,** each written into the signed record:
   - cover by tape;
   - diameter by a 1 m offcut weigh test, plus a close-up estimate that abstains;
   - hooks by a close-up with a template, under a zone-aware rule.
4. **Output:** a signed pre-pour record, plus the engineer's sign-off with *their own* key (two phones, two keys). Office Kit is the engineer's review desk. A replay test replaces the JPEG edit.
5. **Cut:**
   - multi-view triangulation;
   - drawing extraction by an LLM (replaced by a 5-field spec form filled by voice);
   - all of Tier 3;
   - free-form voice Q&A;
   - the Babusapalya opener;
   - the permit QR.
6. **Novelty line:** "Japan's government has accepted camera-based rebar inspection since 2023. Sariya rebuilds it for India's self-built pour: offline on a phone, IS-code rules that abstain, the fix spoken in Hindi or Kannada, and a signed record for the engineer."

## What raises the odds most (three lists merged; overlapping gains, don't sum)

| # | Change | Lanes | Est. gain | Owner |
|---:|---|---|---|---|
| 1 | Cut the live claim to count, spacing and stirrup zones; physical prompts for the rest | all | +8-12 on-site; saves ~90 build hours | WS4, WS5 |
| 2 | **Real-site data from 15-25 Bengaluru pours with tape:** defect prevalence ("N of M slabs had…"), calibrated error bands, a Hough-baseline ablation, one site scan to replay on stage | all | +5 on-site; the strongest screening asset | WS7 |
| 3 | The minimum demo: a pitch kit (mesh on a board, beam segment on a rail, LED panel, hot-spare phone), a deck of robust sabotages, rehearsed failure branches | Finale, Codex | +6 on-site; P(clean run) 0.3 → 0.85 | WS8 |
| 4 | The operator and payer reframe; the steel brand as first payer (a FAIL for missing bars sells steel; brand verification; slab-date leads) | industry, Finale, Codex | +2-4 | WS9 |
| 5 | Open Innovation; a plain first sentence; "sign-off" not "permit"; Tier 1 in the lead | Finale, Codex | +10-15 pp P(shortlist) | WS10 |
| 6 | An honest competition slide: the Japan category plus the Indian substitutes | all | Avoids −3 to −5 | WS3 |
| 7 | Two phones, two keys; the replay test; per-site card IDs; perceptual hashes to catch re-used scans | Finale | +3 | WS5 |
| 8 | Hardware proof on an in-app numbers screen: a live NPU overlay with coverage hints; NPU vs GPU vs CPU; INT8 thin-bar recall; battery and temperature over 40 scans | Finale, Codex | +2-3 | WS5 |
| 9 | On record: one structural engineer, one brand technical engineer, and a mason's voice | all | +4-6 | WS7, WS9 |
| 10 | Questions to the organisers in writing (list below) | Finale, Codex | Gates entry | **Now** |

## Leads for workstreams 2-4, so they don't start cold

**WS2, evidence and news.**
- Nambike Nakshe: Bengaluru's self-certified plan approvals put the risk on the certifying professional, who then needs a record [S].
- The Taratala arrests (June-Sep 2026) [S].
- CRISIL, FY25: housing is 55-57% of cement demand and rural housing 32-34% [S]. This replaces the stale 2018 "55% IHB" line.
- NCRB 2024: 922 of 1,435 collapse cases were residential. Context only; no rebar attribution [S].
- Babusapalya: rods reportedly not properly installed in the foundation per an initial assessment [S], alongside no approvals [S].
- CAG 2025 (UP): completion-photo problems in PMAY-G [V].
- **No Indian study of pre-pour reinforcement defects was found.** Our own site data fills that gap.

**WS3, competitors and alternatives.**
- **Japan:** AIJO 配筋王 [V], IHI [S], Kentem SiteRebar and SiteBox [S/V], Hitachi, Shimizu, Obayashi, Mitsubishi Electric, Kajima, BAIAS; haikin-navi.com compares them [S].
- **Elsewhere:**
  - Korea: SH pilot, Sep 2026 [S];
  - UK: XYZ Reality AR [S];
  - China: rebar-counting apps [S].
- **India substitutes:**
  - brand technical services (Ambuja, UltraTech, JSW Cement, ACC, Dalmia, Bangur, Tata TechLab in 4 cities) [V/S];
  - Tata Superlinks factory-bent 135° stirrups and ReadyBuild cut-and-bend steel [S];
  - Brick&Bolt QASCON (470+ checks, stage-gated payouts) [S];
  - BuildNext [V];
  - Powerplay (35,000 contractors) [S];
  - inspectors: TeamHome ₹4,999 per visit [S], HomeGyan ₹5,999 for handover [V], Nemmadi (12,000+ inspections) [S];
  - Nirixense ReX, a post-pour scanner [V].

**WS4, features.**
- The weigh test (scale-display OCR against the IS 1786 mass bands), which also catches underweight fake TMT.
- A 3x-tele close-up diameter mode.
- A strip fiducial for beams.
- **A 135° hook template card** held in the hook's plane, which removes the 2-D/3-D ambiguity.
- A live coverage overlay, and a coverage map before any "absent" claim.
- Push-to-talk voice commands with subtitles, which also add mic telemetry.
- An in-app numbers screen.
- An engineer's "request another view" loop.
- Rib-mark OCR for brand verification (roadmap).

## Questions for the organisers (send now)
1. Is the Finale direct-entry window still open, and how many direct slots are there?
2. May we use public pretrained weights (AI Hub, Hugging Face) and fine-tune at the event on public data plus our own photos?
3. Are there per-track awards at the Finale?
4. May we bring a small steel mesh and a beam segment into the venue and onto the pitch stage?
5. What is the Finale's Green Light / Red Light timetable?

## Open technical questions (for WS6)
- Which hook extension does the current IS 13920 edition specify, 6d/65 mm or 8d/75 mm? Codex found that the source we cited describes 6d/65 as a *proposal*.
- IS 456 has no spacing tolerance, so who sets it for each project?
