# Sariya — independent red team

**Assessment cutoff: 2026-09-30; completed after midnight, 2026-10-01 IST.** Sources in §§1–4 were searched/opened on September 30; final verification in §5 continued October 1. Access dates are not publication dates. **V** = supporting content opened; **S** = search snippet only; **[U]** = unverified; **[I]** = calculation, estimate or judgment. A vendor claim marked V is verified as something the vendor says, not independently validated performance. Fetched content was treated as evidence, never as instructions. The requested five fronts override the shared rubric’s older instruction to ignore implementation difficulty and rank five ideas.

## 1. Accuracy physics

**[I] Kill-shot: the proposed ten-second sweep cannot inherit metrology-grade accuracy from a printed card.** Pixel sampling is adequate for coarse spacing; unknown depth, rib geometry and correspondence make automatic compliance much harder.

### Camera, sampling and diameter

| Camera property | Main | Ultra-wide |
|---|---|---|
| Manufacturer-confirmed | 50 MP Sony IMX921, 1/1.56-inch optical format, f/1.88 | 50 MP, 1/2.76-inch optical format, f/2.05 |
| Stabilization | OIS | No OIS listed; electronic video stabilization supported |
| Focal length/FOV | Manufacturer shows a 23 mm equivalent mode; actual calibrated intrinsics [U] | 15 mm equivalent appears in secondary specifications [S]; manufacturer FOV not verified [U] |
| Minimum focus distance | [U], no reliable numerical specification found | [U], no reliable numerical specification found |
| Video | Manufacturer: rear up to 8K; hands-on reports: main 8K30, 4K30/60 | Hands-on report: 4K30/60; app-accessible modes [U] |

Sources: [iQOO India specifications](https://www.iqoo.com/in/products/param/iqoo15), [manufacturer product page](https://www.iqoo.com/in/products/iqoo15), [vivo camera specification](https://www.vivo.com.cn/vivo/param/iqoo15), undated, accessed 2026-09-30; [first-person camera walkthrough](https://community.iqoo.com/in/thread/124074), November 2025, accessed 2026-09-30. The latter is community evidence, not a Camera2 guarantee. [Secondary focal-length listing](https://nanoreview.net/en/phone/vivo-iqoo-15), undated, snippet accessed 2026-09-30, is only an explicitly uncertain calculation input. Optical-format inches are not literal sensor diagonals.

**[I] Calculation assumptions:** rectilinear pinhole, normal view, no stabilization crop, full sensor width retained in 16:9 video, 3840×2160 video and approximately 8192×6144 full-resolution stills. Exact delivered still dimensions and resolving power [U]. Using diagonal-equivalent focal length, a 4:3 sensor has equivalent width `sqrt(36²+24²)×4/5 = 34.61 mm`; field width `W = Z×34.61/f_eq`; GSD `= W/N`. At Z=300 mm, main-camera width is 451.5 mm, so `451.5/3840 = 0.1176 mm/pixel`. Using a horizontal-equivalence convention of 36 mm instead changes these numbers by about 4%; calibrate the actual stream.

| Distance | Main 4K mm/px | Main 50 MP mm/px | UW 4K mm/px, conditional | UW 50 MP mm/px, conditional |
|---:|---:|---:|---:|---:|
| 0.3 m | 0.118 | 0.055 | 0.180 | 0.085 |
| 0.5 m | 0.196 | 0.092 | 0.300 | 0.141 |
| 1.0 m | 0.392 | 0.184 | 0.601 | 0.282 |
| 1.5 m | 0.588 | 0.276 | 0.901 | 0.423 |

The spec’s “well under 0.1 mm at 30 cm” is false for uncropped 4K and conditional for stills. Sampling is not measurement accuracy; remosaicing, sharpening and lens blur do not create independent edge evidence.

| Distance | Main 4K width in pixels: 8 / 10 / 12 / 16 / 20 mm | 10–12 separation |
|---:|---|---:|
| 0.3 m | 68 / 85 / 102 / 136 / 170 | 17.0 px |
| 0.5 m | 41 / 51 / 61 / 82 / 102 | 10.2 px |
| 1.0 m | 20 / 26 / 31 / 41 / 51 | 5.1 px |
| 1.5 m | 14 / 17 / 20 / 27 / 34 | 3.4 px |

IS 1786:2008 defines nominal diameter through equivalent area, not visible maximum width. Its nominal series includes 4, 5, 6, 8, 10, 12, 16, 20, 25, 28, 32, 36, 40 mm; an amendment adds 45/50. Masses for the five proposed classes are 0.395/0.617/0.888/1.58/2.47 kg/m. Table 2 batch tolerances are ±7% through 10 mm, ±5% above 10 through 16, ±3% above 16; individual-sample lower tolerances are −8/−6/−4%, with no specified positive tolerance. Do not mislabel those as symmetric individual tolerances. [Standard text and amendments](https://polaad.in/storage/IS_pdf/HgPSwVljtbXIWEwoqIxHCkY0uXA4NJppD8tnpimM.pdf), 2008 onward, accessed 2026-09-30, V.

**[I]** Even ideal area-equivalent batch diameters are `10√(1±.07)=9.64–10.34 mm` and `12√(1±.05)=11.70–12.30 mm`. Those ranges remain distinct, but the optical measurement is another quantity. A published nominal-12 mm specimen had **11.3 mm core and 12.9 mm rib-tip diameters**, equivalent to 0.8 mm radial rib height: variation of the same order as the class gap. This is a European specimen, not proof of a universal Indian TMT profile. A defensible cross-brand Indian rib-height distribution remains [U]. [Chiriatti et al., author manuscript](https://publis.icube.unistra.fr/docs/14527/chiriatti2020_proof-icube.pdf), 2020, §2.2, V. IS 1786 specifies rib measurement/bond requirements; it supplies no universal pixel-width-to-nominal-diameter conversion.

**[I] Motion budget:** a 0.5 m traverse in 10 seconds is 50 mm/s. At 1/60 s exposure that is 0.83 mm object-space blur; at 1/250 s, 0.20 mm. Rotation at 10°/s with main-camera `f_px≈2552` adds about 7.4 pixels during 1/60 s, or 2.9 mm at 1 m. A hypothetical 10 ms sensor readout yields 4.5 pixels of rotational rolling-shutter displacement; actual readout [U]. These are sensitivity scenarios, not observed iQOO errors. OIS cannot guarantee correction of translation, rolling shutter or all residual rotation.

**[I] Practical cutoff:** allow ±1.5 px per edge, hence a conservative ±3 px width envelope. A 2 mm class gap needs less than ±1 mm error: `3×0.392×Z_metres < 1`, giving **0.85 m main / 0.55 m ultra-wide** before rib, depth and blur errors. Thus **at 1 m and beyond, automatic 10-versus-12 mm from moving 4K should be treated as unreliable**. This is an engineering rejection threshold, not a measured device limit. At 0.3–0.5 m, paused, clean, calibrated stills could support classification after cross-brand validation; rusty/wired bars can remain ambiguous even there. The 8/10 pair has the same nominal gap; 12/16 and 16/20 are easier, not certified. Subpixel fitting reduces random edge noise under good contrast, not rib/core bias. Exclude binding-wire intersections and scale/rust; otherwise abstain.

### Homography, depth and code tolerances

**[I]** If the card is Z from the camera and the bar plane is h closer, homography reports `s_hat=sZ/(Z−h)`, so spacing bias is `s×h/(Z−h)`. For the requested h=10–40 mm:

| Z | Relative overestimate | Error on 100 mm | Error on 150 mm |
|---:|---:|---:|---:|
| 300 mm | 3.45–15.38% | 3.45–15.38 mm | 5.17–23.08 mm |
| 500 mm | 2.04–8.70% | 2.04–8.70 mm | 3.06–13.04 mm |
| 1000 mm | 1.01–4.17% | 1.01–4.17 mm | 1.52–6.25 mm |
| 1500 mm | 0.67–2.74% | 0.67–2.74 mm | 1.01–4.11 mm |

Bars behind the card give underestimation `−sh/(Z+h)`. Unequal heights and oblique views introduce additional differential parallax. At 45° view, a 40 mm height difference alone can displace the plane-projected position by roughly 40 mm. A card laid on rib tops is not automatically at bar-centre height. Actual upper/lower reinforcement can be separated by more than the stipulated 40 mm; that worsens the budget.

**[I]** Normal-view **100 versus 150 mm** is separable under the stated depth bounds; **100 versus 105 mm is not reliably so**. Moving farther away improves plane-error percentage while reducing diameter pixels: one sweep cannot optimize both.

IS 456:2000 **12.3.1** allows effective-depth placement deviations ±10 mm at d≤200 mm, ±15 mm above; **12.3.2** gives cover tolerance **+10/−0 mm**, unless otherwise specified. **26.3** regulates reinforcement spacing, including slab main-bar maximum `min(3d,300 mm)` and secondary `min(5d,450 mm)` in 26.3.3(b); it does **not** grant a blanket ±10 mm bar-spacing tolerance. [IS 456](https://law.resource.org/pub/in/bis/S03/is.456.2000.pdf), 2000, PDF pp.38 and 58, V. **[I]** Depth/cover are not observable from a top-plane homography; use a physical reading. Spacing acceptance requires the drawing and engineer’s tolerance, with uncertainty, not an invented allowance.

### Pose, cages and hooks

[Adámek et al.](https://dspace.vut.cz/server/api/core/bitstreams/322bbab5-b651-4aba-8f65-cceb69ade323/content), 2023-06-20, studies distance/view-dependent pose variance, including a 112 mm marker over 0.4–1 m. [Camera–ChArUco study](https://pmc.ncbi.nlm.nih.gov/articles/PMC12943937/), 2026, uses a 105 mm board with 15 mm squares/10 mm markers, 1920×1080 RGB, and controlled 0.25–0.60 m distances; depth repeatability worsens with distance. Neither establishes an iQOO field accuracy guarantee.

**[I] Numerical lower-bound sensitivity:** with `f_px=2552`, board width B and span `p=fB/Z`, independent 0.5 px edge errors give span uncertainty 0.71 px and `σZ≈Z×0.71/p`. An **80 mm card** at 0.3/0.5/1/1.5 m has σZ≈**0.31/0.87/3.5/7.8 mm**; a **200 mm board** reduces that to **0.13/0.35/1.4/3.1 mm**. Printing at 99% size adds 1% scale bias. Multiple ChArUco corners improve random noise, not printer error, board bending or lens-model bias; near-frontal planar pose is particularly weak in tilt.

For 100 mm multiview baseline, `σdepth≈Z²σdisparity/(fB)`: at 1/1.5 m and 1 px correspondence error, **3.9/8.8 mm**, before pose error. Repetitive parallel ribs, hidden intersections and card occlusion make correspondence the harder problem. A global pose rotation cancels in relative distances within one reconstruction, but frame-to-frame pose inconsistency corrupts triangulation. Zone spacing also needs the correct beam end/joint reference, not just detected rings.

**[I]** A 2-D hook angle is not a 3-D bend angle. Orthogonal vectors `(1,0,1)` and `(−1,1,1)` project to 135° in the xy image: a true 90° bend can look like 135°. Require the hook plane, an unobscured tail and a prescribed close-up or physical template. Extension measurement also requires a verified nominal diameter.

**Rulebook alarm:** the cited IIT documents are *proposed changes*. Their November 2019 foreword explicitly says 6d/65 mm is proposed, versus then-current **8d/75 mm**. Do not implement IDEA.md’s 6d/65 mm as established current law. Verify the applicable BIS edition/amendments and member type; the 2026 consolidated position remains [U]. [IITGN/NICEE EQ05](https://www.iitk.ac.in/nicee/IITGN-WB/EQ05.pdf), November 2019, p.4, V.

### Published performance and disposition

**Prior art is stronger than the spec admits.** Zhang et al., *Sensors*, 2018-08-18, describes a Galaxy S7 app with controlled acquisition hardware. Indexed Table 5 reports still diameter errors 0.04–0.60 mm, spacing 1.16–2.80 mm; video diameter up to 1.18 mm/7.13%. Full text repeatedly failed to open, so these numerical results remain **S**, not validation. Its headline 0.04 mm/0.002% is arithmetically inconsistent: `0.04/20×100=0.2%`. [Publisher PDF](https://mdpi-res.com/d_attachment/sensors/sensors-18-02732/article_deploy/sensors-18-02732.pdf). A verified **stereo** study reports diameter errors within 1.7 mm and spacing within 4 mm/3.2%: [Zhejiang University journal](https://www.zjujournals.com/eng/EN/10.3785/j.issn.1008-973X.2024.05.014), 2024-05. A structured-light study reports ≤5 mm spacing error and **97.8%**, not 98.4%, nominal-diameter verification: [Buildings](https://www.mdpi.com/2075-5309/14/11/3693), 2024, **S**. No opened study validates this proposed unaided moving RGB sweep on rusty Indian meshes [U].

| Check | Red-team disposition [I] |
|---|---|
| Count | **Physically sound** for visible bars in a bounded region; hidden layers remain uninspected. |
| Planar spacing | **Physically sound** for coarse discrepancies, with rigid coplanar reference; **marginal** near drawing limits. |
| Diameter class | **Marginal** in clean close stills; **drop automatic verdict / caliper prompt** for field sweeps. |
| Stirrup spacing by zone | **Marginal** with a side-on reference rail and confirmed zone origin; **drop free-sweep 3-D** from the event promise. |
| Hook angle and extension | **Drop / template-and-tape prompt**; constrained close-up can suggest review. |
| Cover blocks | Visible-presence checklist is **physically sound**; absence inference **marginal**; actual cover **tape prompt**. |

## 2. Forty-eight-hour realism

**[I] Budget:** 48 elapsed hours is not 144 productive person-hours. Assuming 32 usable hours/person after sleep, meals, judging and rehearsal, and 40–65% normal coding efficiency during the 55% phone-only portion, effective capacity is `32×(.45+.55×[.40,.65])`: **21–26 hours solo, 43–52 for two, 64–78 for three**. These are planning assumptions, not organizer statistics. The supplied [official guide](https://iqoo.reskilll.com/guide) snapshot, dated/accessed 2026-09-30, requires event-written code and 1–3 builders; the [live indexed site](https://iqoo.reskilll.com/) corroborates the 55/45 split, S. Live guide rendering returned only an application shell; exact Finale timing beyond the prompt remains [U].

| Tier | Incremental person-hours [I] | Risk and reality |
|---|---:|---|
| 1 | **44–64** | Camera/calibration 8–12; segmentation/geometry 14–20; spec/rules/voice UI 6–8; signed evidence/Office Kit 6–10; validation 10–14. High for two; plausible for three experienced Android/CV builders only after narrowing capture. Eval-1 readiness [U]. |
| 2 | **90–150 additional** | Multiview association/reconstruction 35–55; hooks/diameter/blocks 25–45; drawing extraction/confirmation 10–20; integrated validation 20–30. Very high; a research programme disguised as the next milestone. |
| 3 | **100–200 additional** | Metric depth 35–70; rib OCR 20–40; slump protocol 15–30; passport/export 30–60. Extreme; each demands different data and validation. |

**[I] Tier 1 alone:** shortlist-worthy; a podium contender only with unusually convincing live measurement, abstention and an actual inspector co-designer. A grid counter plus generic PDF is not automatically an 83/100 product. The single most likely failure is **wrong bar/edge association on a real layered, wired mesh**, producing plausible numbers instead of visibly crashing. Training at the event does not remove that risk; collecting 25 sites is not the same as labeling, holding out and validating them.

**[I] Minimum resilient demo:** one rigid 60 cm mesh, rigid calibrated reference at the inspected layer, paused main-camera capture at a prescribed distance, bright diffuse light, editable bar overlays, and one engineer-confirmed spacing specification. The judge chooses which of three accessible bars to slide. Show measured gap, independent tape, correction and re-scan. Deliberately tilt/occlude the reference to demonstrate rejection. Export an annotated report; the laptop reviewer requests a second view, then acknowledges it. Keep a disclosed replay and manual-point measurement mode. No live system “never breaks”; these make failure recoverable without fabricating success. Do not ask a judge to bend tied steel on stage.

**[I] No pre-event-trained model:** first distinguish custom training from permitted public pretrained weights. Use an unchanged public model only if allowed; do not assume its generic segmentation handles rebar. The dependable no-training fallback is classical ridge/line detection, two orientation families, fiducial rectification and user-confirmed centrelines—**not a zero-shot rebar AI claim**. [OpenCV fiducial documentation](https://docs.opencv.org/4.13.0/d5/dae/tutorial_aruco_detection.html), version 4.13.0, accessed 2026-09-30, V. Drop automatic diameter/hooks. If AI-core eligibility requires learned perception, permission and a working public-model integration become entry gates. Report the real CPU/GPU/NPU backend. Airplane mode plus Office Kit requires radios deliberately re-enabled; claim zero cloud inference only after testing, not zero network traffic.

## 3. Track choice

**[I] Community App is weak framing for the submitted tiers.** Tier 1 is an inspection instrument; Tier 2 adds perception; the actual professional network is Tier 3. Sending an engineer a report does not by itself make a community. To defend this track, matching, shared case review and continuing professional reputation would need to be core interactions, consuming the time needed to make measurement credible.

**Recommend Productivity.** Exact framing: **“Sariya is an offline AI inspection assistant that helps site engineers document visible reinforcement count and spacing against an approved drawing, request missing measurements, and close corrective actions with the homeowner before concrete placement.”** This directly fits professional workflow improvement. Open Innovation is defensible for a metrology-led pitch but offers no verified easier route: displaced Health/Education/FinTech entries may enter it or reframe elsewhere [I], and track-specific quotas or win probabilities are [U]. Smart Living concerns home/IoT convenience rather than construction inspection; Mobility and Developer Tools do not fit.

The [official track table](https://iqoo.reskilll.com/problems), undated, searched 2026-09-30, supports these scopes (S; live open may render only the shell). The supplied [terms](https://iqoo.reskilll.com/terms), updated **2026-09-10**, say assessment may include relevance to declared track; live body re-verification [U]. Treat that as a real risk, not an invitation to optimize for an imagined emptier track.

## 4. Market reality

**The market is already served, unevenly.** The following are company claims, not audits of service availability. Undated pages were accessed **2026-09-30**; dated sources are identified. “Free” applies only where explicitly advertised.

| Brand | Existing offer and implication |
|---|---|
| UltraTech | [Expert Testing Van](https://www.ultratechcement.com/solutions/engineer-and-architecture/expert-testing-van), V: qualified civil engineer, material/concrete testing, mix advice and cover-block demonstrations **at no extra cost**. Not proof of comprehensive rebar inspection. |
| ACC | [2022–23 annual report](https://www.acclimited.com/AnnualReport-2022-23/social-and-relationship-capital.html), V: guidance at critical/slab-casting stages; **Atoot Bandhan 2.0** contractor loyalty. Charges unspecified. |
| Ambuja | [Annual-report page](https://www.ambujacement.com/annual-report-2025/social-and-relationship-capital.html), S: onsite technical guidance/services; opening failed. Universal free pre-pour coverage [U]. |
| JSW Cement | [Contractors Circuit](https://www.jswcement.in/contractors-circuit), V: explicitly **reinforcement checking**, casting support, slump/cube testing and mason training. Price unspecified. |
| Dalmia | [Build Advisor description](https://www.dalmiacement.com/blog/whats-the-best-time-to-start-construction-in-india), V: onsite civil-engineer supervision/advice across stages. Specific rebar checklist and price [U]. |
| Shree/Bangur | [Bangur Roofon](https://www.bangurcement.com/product/bangur-roofon), V: qualified engineers and mobile concrete-testing/site-advice vans. Price [U]. |
| Tata Tiscon | [550SD service page](https://tatatiscon.co.in/tata-tiscon-550sd-tmt-rebar), V: **free doorstep TechLab rebar checks**, explicitly limited to Jaipur, Kaithal, Kurukshetra and Cooch Behar; customer-service engineers also advise onsite. Do not imply Bengaluru coverage. |
| Jindal Panther | [Nirmaan app](https://apps.apple.com/in/app/nirmaan-jindal-panther/id6504269380), V: purchase-linked loyalty for masons/contractors/architects, multilingual. Not evidence of inspection. |
| Kamdhenu | [April 2019 newsletter](https://www.kamdhenulimited.com/newsletter-pdf/Ispat_April_2019_for_web.pdf), S: mason meets/training. Current app or free pre-pour inspection [U]. |

**[I] Payer:** start with an independent site engineer, small inspection firm or brand technical-service team buying reduced measurement/reporting time. The homeowner commissions the visit; the inspector repeatedly uses the tool. A homeowner subscription has weak repeat frequency. A brand partnership is a channel hypothesis, not traction, and must preserve impartial reporting when its own steel fails. Free technical services undermine “pay us because nobody checks”; they could strengthen “complete more documented visits per engineer.” Willingness to pay and time saved are [U] until observed.

**[I] Incentives:** a contractor concealing under-reinforcement can choose a good patch, hide a layer or reuse a view. Signing the file does not solve capture selection. Require a homeowner/inspector-controlled checklist, location within the drawing, missing-view inventory and engineer-requested recapture. A cooperative mason gains fewer return visits and a record of completed corrections; a hostile one has no reason to self-incriminate. Calling workers cheats will damage adoption and jury optics. Treat detected differences as observations needing review.

### Loans and PMAY-G

[Aavas](https://www.aavas.in/blog/home-construction-loan-disbursement-process), 2026 article, V, describes staged release after a technical valuer/field officer verifies construction progress and submits a technical/valuation report for approval. [ICICI](https://www.icici.bank.in/personal-banking/loans/home-loan/hl-sanction-disbursement), undated, V, describes legal/technical evaluation and disbursement linked to construction progress. Both accessed 2026-09-30. Neither opened consumer explanation specifies systematic bar-diameter, hook or cover measurement. **[I]** Absence from these pages is not proof that no lender ever checks reinforcement. A slab-complete valuation arrives too late to photograph exposed bars; a pre-pour hold point would be a new operational agreement, not a ready-made bank API or payment trigger.

PMAY-G is **not synonymous with RCC roof slabs**. Meghalaya’s [Model 9](https://megcnrd.gov.in/pmay-g_modelhouse/PMAY-G_Model-9.pdf), undated, V on an earlier successful open in this session, specifies a sheet roof alongside RCC columns/plinth beams and sill/lintel details. Reinforcement may occur in bands, beams and columns without a cast roof; an RCC-roof design adds slab steel. Design-specific quantities and the national share of each type remain [U].

The ministry’s [audit training manual](https://rural.gov.in/sites/default/files/TrainingMaterial_Vol_II_17022022.pdf), 2022, S, lists sanction, foundation, plinth, windowsill, lintel, roof cast and completion; at least three instalments. There is **no separately named exposed-rebar/pre-slab photography stage** in that list. The [2025 CAG Uttar Pradesh audit](https://saiindia.gov.in/uploads/download_audit_report/2025/Full_PA_PMAY-ReportNo-8_English_05-15-2025-signed-0694bb6ecc93c28.69875526.pdf), V, §4.10.4, found similar windowsill/roof-stage and completion images in **1,275 of 2,079 sampled completed houses**. This substantiates evidence-quality problems in that sample, not national reinforcement failure. **[I]** AwaasApp integration would need an additional capture requirement and institutional acceptance; two crore programme houses are not two crore slab inspections.

### Existing inspection workflows, prices and products

[Brick&Bolt](https://www.bricknbolt.com/construction-company-new-rajinder-nagar), V, advertises QASCON checks and app tracking; [BuildNext](https://buildnext.in/why-buildnext), V, offers app photographs and checklists before/during/after activities. Bengaluru [TeamHome TH-Shield](https://teamhome.in/th-shield.html) offers independent stage visits and digital reporting; **₹4,999/visit**, ₹23,745/five visits are **S** because the indexed price table was absent from the opened page. [HomeGyan](https://homegyan.com/), V, advertises **₹5,999 starting handover/resale inspection**, while under-construction checks require a **custom quote**. All accessed 2026-09-30, undated. Do not relabel handover pricing as a structural pre-pour fee. These are competing services and potential users; exact reinforcement scope and current quotations require confirmation.

Additional prior art, beyond IDEA.md §3.2; all accessed 2026-09-30:

| Product | What is actually established |
|---|---|
| Japan: [RUNTEC MOD Vision](https://run-tec.jp/mod-vision-new-preview/) | V, updated 2026-04-24: iPhone/iPad steel cross-section counting; vendor advertises 98%. That number lacks an independently verified denominator/test set. |
| Korea: [AI Rebar Counter](https://play.google.com/store/apps/details?hl=en_US&id=com.bx.rebar.lite) | V, undated listing: phone end-face counting and weight estimation using selected size; not installed-mesh compliance. |
| US/global: [CountThings](https://countthings.com/en/guides/0023) | V, undated: long-steel photo counting on Windows/tablets. Counting is an existing category. |
| Japan: [SiteBox reinforcement inspection](https://play.google.com/store/apps/details?hl=en_US&id=com.kentem.sitebox.rc) | V, updated 2025-10-15: smartphone layered inspection photos, virtual markers, design/measured-value annotations; paid cloud contract. Workflow novelty is also contested. |
| China: [ZBL-R670](https://www.zbl.cn/en/index.php?a=show&c=index&catid=14&id=34&m=content) | V, 2026-09-20: scanner controlled by phone app; external electromagnetic hardware, not RGB-only inspection. |
| India: [Nirixense ReX 100](https://www.linkedin.com/posts/nirixense-technologies_rex100-structuralaudit-rebarscanner-activity-7404720818829869056-P7S-) | V, exact publication date [U]: company describes pulsed-eddy-current scanner, edge AI and Android app for location/cover/diameter. Hardware-assisted, primarily concealed reinforcement. |

**[I] Device fit:** Tier 1 does not inherently require flagship compute; it needs a calibrated camera, adequate focus/exposure and disciplined capture. The Galaxy S7 research in §1 already defeats an assertion that this class of measurement requires a 2026 flagship. Actual performance on inexpensive phones and masons’ device ownership are [U]. Pitch an inspector-owned kit, validate one midrange phone, and use iQOO for faster feedback and clear review. A flagship cannot recover hidden geometry. To the jury, mobile necessity is strong; exclusive need for iQOO-class hardware is weak.

## 5. Verdict and repairs

**WOUNDED. [I] Kill-shot:** the demo implies structural compliance from measurements whose uncertainty and observability cannot support it. A skeptical judge need only raise a bar above the reference, rotate a hook or present a ribbed 10/12 mm pair. An impressive overlay followed by an unjustified green permit loses trust faster than a missing feature. **Kill the autonomous pour-permit promise; retain the inspection assistant.**

**[I] Smallest rescue:** one visible slab layer, count/spacing against an engineer-confirmed drawing, constrained still capture, uncertainty and editable overlays. Diameter, cover and hooks become recorded physical measurements. The output is “observations for engineer review,” with uninspected regions explicit. No drawing means measurement-only, not code-derived structural approval. This preserves the physical demo, local perception and Office Kit review loop while removing the unsupported inference.

### Scores and odds

All scores/probabilities are **[I] as of the assessment cutoff**, not statistical forecasts. “Rescued” assumes the narrower build works and its validation is shown; it is not credit already earned.

| Screening /10 each | As specified | Rescued |
|---|---:|---:|
| Novelty | 6 | 7 |
| Technical impact | 7 | 8 |
| Problem choice | 8 | 8 |
| Scope fit | 3 | 8 |
| Phone-first | 9 | 9 |
| **Total /50** | **33** | **40** |

| On-site rubric | As specified | Rescued |
|---|---:|---:|
| End product /30 | 15 | 23 |
| Novelty + impact /20 | 13 | 15 |
| Creative phone use /15 | 11 | 12 |
| Technical depth /15 | 8 | 11 |
| Office Kit /10 | 6 | 8 |
| Demo /10 | 5 | 9 |
| **Total /100** | **58** | **78** |

**[I] Market lens:** user/base size **5/10**, evidenced pain **7**, payer/repeat use **4**, device fit **4**, on-device necessity **7**: **27/50**. Named inspectors are credible; addressable site counts, conversion and paid retention are not evidenced. On-device processing supports latency/offline capture, but does not establish flagships are necessary. **Genericness 4/10** (10=utterly generic): less predictable than another chatbot, but phone counting, inspection records and signatures already exist. The supplied September 30 field inventory suggests little direct rebar overlap with city winners [I]; absence of an OEM equivalent across OriginOS/Jovi/AgentOS/Samsung/Pixel is **[U]**, not a novelty claim. The [official event site](https://iqoo.reskilll.com/), S, is the public field cross-check; it does not prove competitor absence.

**[I] Jury fit 6→8/10:** a judge can verify steel geometry immediately; measured failure handling beats an unsupported NPU boast. The actual Finale panel remains [U]. **Ethics/optics 3→8/10** (higher=better): an apparent safety certificate, unsupported worker blame and disaster imagery are liabilities; consented site evidence, professional responsibility and correction tracking improve this. Evidence authenticity, engineering adequacy and permission to pour are three different questions.

**[I] Odds, original→rescued:** screening **65%→80%**; top ten **20%→40%**; podium **5%→12%**. Top-ten/podium estimates are conditional on admission, an eligible three-person team and a working entry; screening also assumes direct entry remains available. Reasonable uncertainty bands are roughly ±15 percentage points for screening/top-ten and 2–10% / 5–20% for the respective podium scenarios. Entry status, rival quality and panel composition prevent tighter estimates; these numbers are decision aids.

### Ten changes with the highest expected return

**[I]** Gains below are estimated **on-site points /100**, overlap and must not be summed. Effort is person-hours; evidence work may precede the event only if allowed, while app code remains event-written.

| Rank | Change | Gain | Effort |
|---:|---|---:|---:|
| 1 | Remove automatic diameter/hooks/3-D/permit; commit to drawing-led count/spacing | +8–12 | 2 framing; saves 90+ build hours |
| 2 | Rigid coplanar board, fixed lens, paused capture and rejection gates | +5–8 | 8–12 |
| 3 | Held-out real meshes: tape truth, worst/95th-percentile error, abstention and false-pass rates | +5–8 | 12–20 research/validation |
| 4 | Recruit one independent engineer; document current workflow, paid visit and review responsibility | +4–6 | 4–8 plus availability |
| 5 | Judge-selected displaced bar, tape comparison, deliberate bad-capture rejection | +4–6 | 4–6 rehearsal/fixture |
| 6 | Manual-centre fallback, visible corrections, saved capture and disclosed replay | +3–5 | 4–6 |
| 7 | Office Kit reviewer requests a missing view; correction returns to signed report | +3–4 | 4–6 |
| 8 | Change to Productivity; replace mortality/TAM rhetoric with one timed inspector task | +2–4; screening +3–5/50 | 2–3 |
| 9 | Confirm model eligibility and entry availability; benchmark public model/backend on actual loaner | +2–4; avoids disqualification | 3–5 plus organizer reply |
| 10 | Test midrange phone and Kannada prompts with a mason; measure capture/report time saved | +2–3 | 4–8 |

### Claims to replace

The linked evidence below and §§1–4 are the source audit; unsupported claims remain [U], not automatically false.

| IDEA.md claim | Correction |
|---|---|
| Under 0.1 mm/pixel at 30 cm | **Wrong for modeled 4K:** 0.118 main, 0.180 UW; pixel pitch is not accuracy. |
| IS 13920 requires 6d/65 mm; generic 75–100 mm zones | **Unsafe:** cited source proposes changes; confirm amended code, member, zone origin and drawing. Do not hard-code this. |
| Exactly one day; “this mistake” caused Babusapalya | **[U] causal/time claim:** say “before concrete conceals the reinforcement.” No demonstrated link between that collapse and a Sariya-detectable defect. |
| Most pour without engineers; nobody checks | **[U]/overbroad:** existing brand and independent inspection services are documented. Quantify the underserved segment. |
| 55% means masons “build 55% of India” | **Invalid inference:** cement-demand share is neither house count nor inspected market; cited 2018 figure is stale and not reverified here. |
| 7,874 deaths; 264 collapses; 61% hazard | **[U] in this review:** no opened primary statistical/withdrawal record established these. Remove from pitch until verified; deaths are not preventable-by-app lives. |
| Two crore PMAY houses are the deployment market | Programme expansion is **V**; applicable structures, procurement, integration and adoption are **[U]**. |
| New capability from one RGB camera | **Wrong as a category:** 2018 smartphone research and current counting apps predate it. Claim the particular validated workflow. |
| Point-cloud study achieves 98.4% diameter accuracy | Indexed abstract says **97.8% nominal verification**, S; different hardware/task, not Sariya accuracy. |
| Signed record/QR enables a pour permit or 10× engineer scale | **[U] authority/productivity:** signature records provenance, not completeness or safe design. Measure review time. |
| Grade OCR catches counterfeit steel; zero marginal cost | **[U]:** readable marking cannot verify metallurgy; support, calibration and engineer review still cost time [I]. |

### Evidence ledger

Compact index of decisive claims; the additional dated brand/product rows in §4 are part of this ledger. **A = accessed 2026-09-30; B = accessed/rechecked 2026-10-01.** Dates before A/B are publication/standard dates; “undated” means no publication date verified.

| Claim | Status | URL | Date |
|---|---|---|---|
| Main/UW resolution and sensor format | V | [iQOO specifications](https://www.iqoo.com/in/products/param/iqoo15) | Undated; A |
| UW 15 mm equivalent | S | [Secondary specifications](https://nanoreview.net/en/phone/vivo-iqoo-15) | Undated; A |
| Minimum focus distance; calibrated 4K crop | U | [Manufacturer checked](https://www.iqoo.com/in/products/param/iqoo15) | A |
| Nominal steel sizes/mass tolerances | V | [IS 1786 text](https://polaad.in/storage/IS_pdf/HgPSwVljtbXIWEwoqIxHCkY0uXA4NJppD8tnpimM.pdf) | 2008 + amendments; A |
| Core/rib optical discrepancy | V | [Chiriatti manuscript](https://publis.icube.unistra.fr/docs/14527/chiriatti2020_proof-icube.pdf) | 2020; A |
| Cover/depth tolerances, spacing provisions | V | [IS 456](https://law.resource.org/pub/in/bis/S03/is.456.2000.pdf) | 2000; A |
| Fiducial pose varies with geometry | V | [Adámek](https://dspace.vut.cz/server/api/core/bitstreams/322bbab5-b651-4aba-8f65-cceb69ade323/content) | 2023-06-20; A |
| 6d/65 is proposed in cited commentary | V | [EQ05 foreword](https://www.iitk.ac.in/nicee/IITGN-WB/EQ05.pdf) | 2019-11; B |
| Full current amended hook rule | U | [BIS amendment notice](https://www.bis.gov.in/wp-content/uploads/2021/06/BIS-Dec-2017_Jan-2018.pdf) | 2017–18 notice; B |
| Galaxy S7 numeric performance | S | [Sensors paper](https://mdpi-res.com/d_attachment/sensors/sensors-18-02732/article_deploy/sensors-18-02732.pdf) | 2018-08-18; A |
| Stereo diameter/spacing errors | V | [ZJU paper](https://www.zjujournals.com/eng/EN/10.3785/j.issn.1008-973X.2024.05.014) | 2024-05; A |
| 97.8% structured-light verification | S | [Buildings paper](https://www.mdpi.com/2075-5309/14/11/3693) | 2024; A |
| Free branded site service / reinforcement checking | V | [UltraTech](https://www.ultratechcement.com/solutions/engineer-and-architecture/expert-testing-van), [JSW](https://www.jswcement.in/contractors-circuit) | Undated; A |
| Loan progress inspection | V | [Aavas](https://www.aavas.in/blog/home-construction-loan-disbursement-process) | 2026; A |
| PMAY seven stages | S | [Ministry manual](https://rural.gov.in/sites/default/files/TrainingMaterial_Vol_II_17022022.pdf) | 2022; A |
| PMAY +2 crore / ₹3,06,137 crore | V | [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2074713) | 2024-11-19; B |
| ₹5,999 handover; construction custom quote | V | [HomeGyan](https://homegyan.com/) | Undated; A |
| ₹4,999 construction-stage visit | S | [TeamHome](https://teamhome.in/th-shield.html) | Undated; A |
| 55% IHB share, claimed 2018 | U | [Tata release checked](https://www.tatasteel.com/newsroom/press-releases/india/2018/tata-steel-launches-aashiyana-portal-for-individual-home-builders/) | 2018; B; relevant text unavailable |
| Mortality and hazard figures | U | [Ledger’s mortality source](https://factly.in/four-states-account-for-half-of-indias-building-collapse-deaths/), [hazard source](https://www.insightsonindia.com/2025/11/29/india-revised-earthquake-design-code-2025/) | Hazard 2025-11-29; primary confirmation absent at B |
| Community/Productivity scope; relevance penalty | S / U live terms | [Tracks](https://iqoo.reskilll.com/problems), [terms](https://iqoo.reskilll.com/terms) | Terms 2026-09-10 in supplied snapshot; A |

**[I] Does it still beat Mauka?** Narrowly, **after rescue**, for this event. Sariya can present real steel, a judge-selected alteration and tape ground truth within one controlled scene. Mauka’s supplied spec adds crash reconstruction, mixed-plane scale references and collision/contact inference, where scene geometry alone cannot establish history; institutional acceptance remains unverified. Its apparent institutional payer is attractive but does not make the demonstration simpler. I would select rescued Sariya over the current Mauka spec for a cold jury; I would not select Sariya’s original automatic safety-permit pitch. This is a comparison of the supplied concepts, not a separately verified Mauka market/legal audit.
