# Sariya: evidence ledger

## Execution refresh — 10 Oct 2026, about 00:20 IST

- **V (live organiser site):** Finale Red/Green and CP1/CP2/CP3 times still match BUILD-PLAN; submission cutoff remains TBC. Rubric remains 30/20/15/15/10/10. Read the Finale `Xx` timetable, not the city `Qx` array, in [the live site bundle](https://iqoo.reskilll.com/assets/index-B_APmUMd.js); [organiser site](https://iqoo.reskilll.com/).
- **Recorded organiser answer, not newly independently verified:** PREP-PLAN §7 says scores average the three phones, Remote PC agents/sideloading are allowed and Finale detects camera/mic/AI. The May tracker implementation cannot establish the deployed Finale weights; do not claim heat/drain/artificial activity earns a known score.
- **V (primary docs):** Android [document-picker access](https://developer.android.com/training/data-storage/shared/documents-files) supports received Office Kit packs through user-selected URIs. The app cannot assume arbitrary raw-folder access to another app's received documents.
- **V (primary docs):** [ARCore camera sharing](https://developers.google.com/ar/develop/java/camera-sharing) requires explicit session/camera integration. On this loaner, required stream/control compatibility remains untested; installation alone is insufficient evidence for our measurement flow.
- **V (repo inspection):** the generated rules JSON had v0.1.1 numerical tolerances but a v0.1.0 header. Metadata corrected to v0.1.1/date 9 Oct; numeric rules unchanged. This is version consistency, not engineer approval of the proposed tolerances.
- **U (build state):** no event Android app or proven exported model was found in this planning checkout. This does not prove that the team has not built one elsewhere. B01/B02 in the issue board explicitly inventory actual repo/APK/model progress.

Current execution and research dispositions: [TEAM-BUILD.md](notes/12-event/TEAM-BUILD.md). Older ledger rows below retain their dated provenance; use the newer build/device notes where superseded.

**Status legend:**
- **V**: verified by an opened source.
- **S**: seen only in a search result; re-open it before it goes on a slide.
- **U**: unverified.
- **X**: refuted or unsafe; don't use.

Updated 5 Oct: see `notes/10-submission/research-2026-10-05.md` for items re-opened on 4-5 Oct (it supersedes the rows below where they differ: MLIT guideline now V; CRISIL housing share now V; IS 456 cl. 26.3.3(b) secondary bars are 5d or 300 mm after Amendment 3; Bengaluru is Zone II; Kajima's 300+ companies refers to its earlier portable system). Updated 1 Oct by the red team. Lane files in `notes/01-redteam/` hold the full source lists.

## Problem and stakes

| Claim | Status | Source / note |
|---|---|---|
| ~~IHB drive 55% of India's cement demand~~ | X as worded | The 2018 Tata Steel release couldn't be re-read. Use the CRISIL line below |
| Housing is 55-57% of India's cement demand; rural housing is 32-34% (FY25) | S | CRISIL report in JSW Cement's offer document: https://www.jswcement.in/pdf/offer-documents/CRISIL_Industry_Report_Final-Signed.pdf |
| NCRB 2024: 1,435 collapse cases, 1,525 deaths; 922 cases residential; 7,874 deaths in 2020-24 | S | https://factly.in/four-states-account-for-half-of-indias-building-collapse-deaths/. Context only: no rebar attribution, and the figures include old buildings, bridges and more |
| 264 building collapses so far in 2026 | U | ETV Bharat (Hindi). Don't use |
| Babusapalya, 22 Oct 2024: 9 dead | S | Deccan Herald |
| Babusapalya: G+6 with no approvals; 3 BBMP stop-work notices ignored; "cheap material" alleged in a labourer's complaint | S | https://www.deccanherald.com/opinion/editorial/ruins-of-a-systemic-collapse-3249739 · https://www.tribuneindia.com/news/india/bengaluru-building-collapse-6-more-bodies-recovered-owner-contractor-taken-into-custody |
| Babusapalya: rods reportedly not properly installed in the foundation (initial assessment) | S | https://constrofacilitator.com/bengaluru-building-collapse-need-of-adhering-to-civil-engineering-standards/ |
| ~~Babusapalya caused by a steel mistake "visible for one day"~~ | X | Causation unsupported. Don't open with it |
| Two-thirds of upcoming Bengaluru properties lack approval | S | Deccan Herald headline: https://www.deccanherald.com/india/karnataka/bengaluru/two-thirds-of-upcoming-properties-in-b-luru-lack-approval-3355470 |
| Nambike Nakshe: BBMP-registered professionals self-certify plans (up to 4 units, plots up to 50×80 ft) | S | https://www.business-standard.com/india-news/karnataka-launches-online-building-plan-approval-process-in-bbmp-limits-124090201037_1.html |
| Taratala (Kolkata) collapse, June 2026: structural engineer and supervisor arrested; a civic engineer held in Sep | S | https://thecsrjournal.in/kolkata-warehouse-collapse-leads-arrests-engineer-supervisor · https://www.thehawk.in/news/india/kolkata-civic-engineer-held-in-taratala-warehouse-collapse-case-total-arrests-rise-to-7 |
| BIS 2025 zonation map: 61% of land in moderate-to-high hazard; the revised IS 1893 was withdrawn | S | https://www.insightsonindia.com/2025/11/29/india-revised-earthquake-design-code-2025/. Codex couldn't open a primary source |
| Turkey 2023: 90° hoop hooks and wide hoop spacing in damaged buildings | S | https://www.concrete.org/portals/0/files/pdf/webinars/ws_F23_Lequesne.pdf |
| PMAY-G: 2 crore more houses by Mar 2029, ₹3,06,137 cr outlay | V | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2074713 |
| PMAY-G: seven stages (sanction, foundation, plinth, windowsill, lintel, roof cast, completion), at least 3 instalments. "Roof cast" is photographed after the pour; there is no pre-pour stage | S | https://rural.gov.in/sites/default/files/TrainingMaterial_Vol_II_17022022.pdf · https://rh.odisha.gov.in/guidelines/PMAY(G)_guidelines.pdf |
| CAG 2025 (UP): similar windowsill/roof and completion images in 1,275 of 2,079 sampled "completed" houses | V | https://saiindia.gov.in/uploads/download_audit_report/2025/Full_PA_PMAY-ReportNo-8_English_05-15-2025-signed-0694bb6ecc93c28.69875526.pdf §4.10.4 |
| Lenders release tranches after a valuer or field officer checks **progress and value**, not reinforcement | V | https://www.aavas.in/blog/home-construction-loan-disbursement-process · https://www.icici.bank.in/personal-banking/loans/home-loan/hl-sanction-disbursement |
| Aptus technical-visit fee: ₹1,500 + GST first, ₹750 + GST after | S | https://aptusindia.s3.amazonaws.com/Aptus+HFC+MITC+(English).pdf |
| 25 t of counterfeit "Super XT 600" TMT seized in Purulia, Sep 2026 | S | https://www.thestatesman.com/cities/kolkata/25-tonnes-of-fake-super-xt-600-tmt-bars-seized-in-purulia-1503643693.html. Supports the weigh test and brand verification, not the geometry checks |
| "Rebar placement errors ≈30% of structural concrete deficiencies" (attributed to CRSI) | U | Don't use |
| Indian data on pre-pour reinforcement defect rates | U (none found) | **Produce it ourselves:** 15-25 Bengaluru sites with a tape (workstream 7) |

## Codes and physics

| Claim | Status | Source |
|---|---|---|
| IS 456 cl. 12.3.1: placement tolerance ±10 mm (effective depth ≤200 mm), ±15 mm above; cl. 12.3.2: cover +10/−0 mm. No general tolerance on bar spacing | V | https://law.resource.org/pub/in/bis/S03/is.456.2000.pdf |
| IS 456 cl. 26.3.3(b): slab main bars at most min(3d, 300 mm); secondary at most min(5d, 450 mm) | V | Same |
| IS 456 cl. 26.2.2.4(b): stirrup anchorage by a 90° bend + 8φ, 135° + 6φ, or 180° + 4φ | S | https://limitstatelessons.blogspot.com/2015/12/Anchorage-at-ends-of-stirrups.html |
| IS 13920:2016 is mandatory in zones III-V and not in zone II (Bengaluru) | S | https://testbook.com/question-answer/as-per-is-13920-ductile-detailing-is-not-mandato--607ad3536ad3ab79164b28fd. Confirm the scope clause in workstream 6 |
| IS 13920 hook extension: "6d (≥65 mm)" | U | The IITGN/NICEE source calls 6d/65 mm *proposed*, versus 8d/75 mm then current (https://www.iitk.ac.in/nicee/IITGN-WB/EQ05.pdf). Resolve in workstream 6 |
| IS 1786 unit mass: 8/10/12/16/20 mm = 0.395/0.617/0.888/1.58/2.47 kg/m. Batch tolerance ±7% (up to 10 mm), ±5% (above 10 up to 16), ±3% (above 16) | V | https://polaad.in/storage/IS_pdf/HgPSwVljtbXIWEwoqIxHCkY0uXA4NJppD8tnpimM.pdf |
| iQOO 15 cameras: main 50 MP IMX921, 1/1.56", ~23-24 mm equivalent, OIS; ultra-wide 50 MP, 15 mm; 3x tele 50 MP, OIS; 4K60, 8K30 | V/S | https://www.iqoo.com/in/products/param/iqoo15 (V) · https://www.gsmarena.com/vivo_iqoo_15_5g-14198.php (S) |
| Loaner over ADB (9 Oct): I2501, SM8850, Android 16, OriginOS 7.0; main camera 5.56 mm, 8.19 x 6.14 mm sensor, Camera2 level 3, manual sensor + RAW, min focus 0.10 m; tele min focus 0.65 m; no ToF or depth sensor | V (device) | `notes/13-ar-vision/AR-VISION.md` §5 |
| ARCore on the iQOO 15: absent from Google's web list, but Play installed Google Play Services for AR 1.56.262080393 on the loaner (replacing `ARCoreStub0`), so it is certified. Session and Depth API untested | V (device) / U | https://developers.google.com/ar/devices (fetched 9 Oct) · `notes/13-ar-vision/AR-VISION.md` §3. Supersedes "not supported" in `context/research/02-ondevice-ai.md` and `DIGEST.md` |
| Ground sample distance, main camera in 4K: 0.11-0.12 mm/px at 0.3 m; 0.19 at 0.5 m; 0.38 at 1 m | V (computed) | `notes/01-redteam/physics.md`, `codex.md` §1 |
| ~~"At ~30 cm one pixel is well under 0.1 mm"~~ | X | True only for 50 MP stills |
| A single oblique photo gives 5.12 mm MAE on rebar spacing (CACAIE 2026) | S | https://www.sciencedirect.com/science/article/pii/S1093968726012429 |
| Galaxy S7 rebar app (Sensors 2018): diameter errors 0.04-0.60 mm and spacing 1.16-2.80 mm from stills | S | https://mdpi-res.com/d_attachment/sensors/sensors-18-02732/article_deploy/sensors-18-02732.pdf |
| Stereo: diameter within 1.7 mm, spacing within 4 mm | V | https://www.zjujournals.com/eng/EN/10.3785/j.issn.1008-973X.2024.05.014 |
| Structured light: 97.8% nominal-diameter verification (not 98.4%) | S | https://www.mdpi.com/2075-5309/14/11/3693 |
| YOLOv11-seg at ~3.3 ms on the 8 Elite Gen 5 NPU (Qualcomm AI Hub) | S | https://huggingface.co/qualcomm/YOLOv11-Segmentation |

## Competition and alternatives

| Who | Status | Source |
|---|---|---|
| AIJO 配筋王 (Comsys): tablet-camera AI rebar inspection, no special imaging equipment, compliant with MLIT's July 2023 digital-measurement guideline, NETIS CB-240002-A, ~70% time saved | V (page read 1 Oct) | https://solution.comjo-aijo.com/aijo-hiking/ |
| IHI consortium: plate + camera, smartphone or drone photos; ±1.0 mm diameter, ±5 mm spacing; ~40% labour saved | S | https://ken-it.world/success/2022/05/automatic-rebar-check.html |
| MLIT 2023 digital rebar-inspection guidelines | S | https://www.mlit.go.jp/tec/content/001619475.pdf |
| Kentem SiteRebar (stereo, D10-D51, spacing ±5 mm) and SiteBox (smartphone inspection photos) | S / V | https://www.kentem.jp/news/20240312_01/ · https://play.google.com/store/apps/details?hl=en_US&id=com.kentem.sitebox.rc |
| Kajima + Mitsubishi Electric Engineering: stereo + tablet; 300 → 100 min per cage; 300+ adopting companies | V | https://jp.ibtimes.com/kajima-cuts-osaka-rebar-inspection-time-70-mobile-ai-system-104355 |
| PIX4Dcatch + DataLabs Modely: iPhone LiDAR rebar as-built | V | https://pix4d-com-preview.netlify.app/blog/cut-rebar-inspection-pix4dcatch/ |
| Korea: SH public-housing pilot of AI + 3D-camera rebar judging (Sep 2026); UK: XYZ Reality AR pre-pour verification | S | https://m.news.nate.com/view/20260916n21891 · https://www.xyzreality.com/resources/rebar-verification-with-ar-pre-pour |
| Rebar-counting apps (bundle ends): Shanghai Construction Group, AI Rebar Counter, CountThings, RUNTEC MOD Vision | S / V | Listed in `codex.md` §4 and `jury-industry.md` §4 |
| UltraTech Expert Testing Van: a civil engineer, testing and cover-block demos at no extra cost | V | https://www.ultratechcement.com/solutions/engineer-and-architecture/expert-testing-van |
| JSW Cement Contractors Circuit: reinforcement checking, casting support, slump/cube tests, mason training | V | https://www.jswcement.in/contractors-circuit |
| Ambuja: slab-casting guidance/supervision at 31,698 sites in a year | S | https://www.ambujacement.com/annual-reports2022/relationship-capital.html |
| Tata Tiscon: free doorstep TechLab rebar checks (Jaipur, Kaithal, Kurukshetra, Cooch Behar only); 100+ customer-service engineers; Superlinks 135°/65 mm stirrups; ReadyBuild cut-and-bend | V / S | https://tatatiscon.co.in/tata-tiscon-550sd-tmt-rebar · https://tatatiscon.co.in/ultima-stirrups-superlinks |
| Brick&Bolt QASCON: 470+ checks, stage-verified contractor payments, 10,000+ homes | S | https://www.bricknbolt.com/construction-company-bengaluru |
| Powerplay: 35,000 contractors, photo/checklist QC | S | https://inc42.com/buzz/powerplay-raises-5-2-mn-led-by-accel-partners-and-surge/ |
| Bengaluru inspectors: TeamHome ₹4,999 per construction-stage visit (S); HomeGyan ₹5,999 handover (V); Nemmadi 12,000+ inspections (S) | S / V | https://teamhome.in/th-shield.html · https://homegyan.com/ · https://nemmadi.in/about-us/ |
| Nirixense ReX: an Indian eddy-current scanner with an Android app, for cast concrete | V | `codex.md` §4 |
| An Indian phone-based pre-pour rebar *measurement* product | None found (absence of evidence) | ~6 searches (industry lane) |

## Hackathon
| Claim | Status | Source |
|---|---|---|
| The Finale jury is 5 people from product, AI/ML and the Reskilll network; panel not announced as of 1 Oct | V (site read 1 Oct) | https://iqoo.reskilll.com/ |
| Office Kit pairs one person's phone and laptop under one vivo account | S | https://vivonewsroom.in/how-vivo-office-kit-is-breaking-cross-device-barriers-for-modern-users/ |
| Hyderabad city results | U (not public as of 1 Oct) | |

## Must verify or obtain before 9 Oct
- [x] The Finale direct-entry window is open until 5 Oct 2026 23:59 IST (site code, 4 Oct). Number of direct slots still unknown
- [ ] Are public pretrained weights allowed, and is fine-tuning at the event OK? (in writing)
- [ ] Are there per-track awards at the Finale? Are steel props allowed on stage? What is the Green/Red timetable?
- [ ] The IS 13920 hook extension in the current edition, and its scope clause. A structural engineer should check the rulebook table
- [ ] Defect prevalence and per-check error bands from 15-25 Bengaluru pre-pour sites
- [ ] One structural engineer, one brand technical engineer and one mason on record, with consent
- [ ] Re-open the [S] items above before they go on a slide (workstream 2)
- [ ] Trademark and app-store check on "Sariya"

| Satya Niketan (Delhi) PG hostel collapse, 6 Sep 2026: ~50-year-old five-storey building converted to a student PG, renovation and basement work (a wall being removed) under way, area waterlogged; 7 dead; owner arrested; 5 MCD officials suspended; Delhi HC ordered checks of private hostels. Cause under investigation; NOT a new-build or reinforcement case | V (opened 5 Oct) | https://www.outlookindia.com/national/delhi-building-collapse-how-a-50-year-old-structure-became-a-student-hostel · https://indianexpress.com/article/cities/delhi/first-big-action-after-delhi-hostel-collapse-five-mcd-officials-suspended-10866809/ (headline). Event only |

## Problem-slide news bank (checked 5 Oct 2026)
| Claim | Grade | Source | Use |
|---|---|---|---|
| Chintels Paradiso, Gurugram: Tower D collapse on 10 Feb 2022 killed 2. Audits including IIT Delhi found widespread corrosion of the reinforcement steel in several towers, linked to chlorides embedded in the concrete during construction. Haryana RERA order of 30 Mar 2026: more than Rs 4 crore to one buyer | V (opened) | https://realty.economictimes.indiatimes.com/news/rera/haryana-rera-orders-chintels-india-to-pay-4-crore-to-homebuyer-for-unsafe-construction/130048779 | The best "the steel was the problem" Indian case. It is corrosion, not placement; tie it to cover, not to spacing |
| Ambala (Dhulkot), 27 Sep 2026: an under-construction three-storey building collapsed while the roof slab was being cast; 6 dead. FIR includes culpable homicide and negligent construction. Plans not approved; officials visited after complaints but took no action; SIT ordered | V (opened) | https://theprint.in/india/toll-in-ambala-building-collapse-climbs-to-six-cm-announces-ex-gratia-of-rs-5-lakh/3056136/ | "Nobody checks at the pour." The cause is unknown, and failures during casting are often formwork, which Sariya does not check. Never say steel |
| Taratala (Kolkata) under-construction warehouse, June 2026: 16 dead | S (headline and snippet) | https://www.thestatesman.com/bengal/kolkata-death-toll-in-taratala-under-construction-warehouse-collapse-rises-to-16-probe-intensifies-1503610490.html | With the arrests row above: liability falls on engineers |
| The Week opinion, 29 Sep 2026: "India has rules, but why does structural safety still fail?" | S (headline) | https://www.theweek.in/news/india/2026/09/29/satya-niketan-building-collapse-india-has-rules-but-why-does-structural-safety-still-fail.html | Opinion; quote as such |
| Nigeria: suspected substandard iron rods blamed for repeated Lagos collapses (legislators, steel union, 2024-26) | S (headlines) | https://saharareporters.com/2026/02/04/nigerian-steel-union-laments-circulation-substandard-iron-rods-amid-building-collapses | Only for the international market; not India |

| Small/mid-size site visit, 9 Oct 2026: no pre-pour reinforcement check; a few bars observed mis-spaced. Engineer visits quoted on site at ₹5,000-10,000 each (published range ₹5,000-30,000, aecord blog [S]); the crew said any deviation from the drawing is corrected and only the engineer clears the pour, yet the errors seen were ones they agreed the engineer would reject | U (user-reported, first-hand) | Team site visit. Needs: count of sites, photos with a tape in frame, measured vs drawing values, before it goes on a slide | Opening slide if photos exist |
