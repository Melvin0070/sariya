# Close the pour loop, price the pour

Sariya's biggest gap is not a better single scan. It lacks the loop around the scan that a multi-site engineer lives in: a **queue of pours sorted by casting time**, a **conditional decision** (approve, fix and re-scan, not approved), a **report that travels on WhatsApp**, and **spec reuse floor to floor**. Every serious field-QA app ships those as table stakes. None measures steel, and none sorts approvals by pour time, so Sariya can add them today on top of what it already has (signed packs, two keys, the "Ask for another view" request, Office Kit transport). On the jury: **no source confirms the iQOO CEO, Nipun Marya, is on the Finale jury.** The jury published on 9 Oct (STATE.md) does not list him, so his presence is user-reported only. If he is there, he will judge story and brand fit. The event's own stated purpose, "demanding professional workflows" on a phone, is the frame to pitch into, backed by measured numbers from this phone. On business: the brand-seat model in `notes/09-gtm/gtm.md` caps out at about ₹12-19 Cr a year. The unit that scales is the **signed pour record** (about 5-12 million RCC slab pours a year in India, our estimate). So price per record: steel brands sponsor it, and professionals resell it to owners. Insurers and lenders are the Year-2 expansion that lifts the price per record.

## Do today: five build items that fit the remaining day and the demo

These reuse existing code paths. The app already has: auto-Lock with haptics; a signed "Ask for another view" request that selects checks and creates a new revision; "Approve with PIN"; pack and CSV export through `expo-sharing`; and an NPU timing screen. It has no site or pour-time field, no project view and no PDF.

| # | Build | Why it scores | Cost | Demo beat |
|---|---|---|---|---|
| 1 | **Pour inbox on the engineer's home screen.** Add `site` and `pourAt` to a new inspection. Group received records by site, sort by pour time, and give each a status chip: awaiting scan / ready for review / view requested / approved. Any record outside limits gets a red chip. | Answers "would someone keep using it" (30% of the score) for a multi-site engineer. No vendor found sorts approvals by pour time (U). | S | About 15 s: three sites, one red. Use real scans of the prop under 2-3 site IDs, labelled as such, never seeded rows. |
| 2 | **Make the fix loop visible.** Relabel the decision three ways: approve / fix and re-scan / not approved. On the re-scanned check, show "was 80 → now 50 mm, closed" across revisions. | Closes the loop on stage: sabotage → flag → engineer asks for a fix → re-scan → sign. Mirrors Fieldwire's "Approved as noted" and the "correction required" state in pre-pour checklists (S). | S | The judge fixes the bar, re-scans, and the item closes. |
| 3 | **One-tap PDF to WhatsApp** through the share sheet. Header: site, slab, time, card ID, record hash. A drawing vs measured ± band table. Both signers, and an offline verify QR. Log shooting conditions per Lock automatically (distance and tilt from the card pose, torch on or off). | WhatsApp is where Indian approvals live today, and it is not auditable (V/S). Japan's MLIT trial guideline requires the report to be generated from design values and shooting conditions to be recorded (V). | S-M. `expo-print` is a small official Expo package but needs a native rebuild; otherwise render HTML to an image | About 10 s: tap share and WhatsApp opens. Don't send to a real contact on stage. |
| 4 | **Copy the signed spec to the next slab or floor.** Duplicate it with a new floor ID; the engineer re-signs with the PIN. | Second-week use, the strongest retention signal. Dalux and Procore treat template reuse as core (S). | S | About 5 s: "Ground floor signed; first floor in one tap." |
| 5 | **Measured endurance tiles on the numbers screen.** The NPU ms (already shown), battery temperature and battery % per Lock over a 30-Lock run, extrapolated to "locks per charge", and "0 bytes sent". | The CEO lever (see the jury section), and evidence for the 15% "creative phone use" score. Only measured numbers; no iQOO marketing figures. | S if read through the existing native module (U) | Shown in the 3:10 numbers beat. |

Zero-cost narration: call the operator role "delegated to Ravi, junior engineer". Indian supervision practice is "present or delegate for each pour" ([StudioMatrx](https://www.studiomatrx.org/guides/site-supervision-checklist-india), V). Items 1-4 together add about 40 s to the 3:30 demo (IDEA.md §6), so trim the weigh beat or the lower-layer beat to fit.

## Recommended business model

Sell **one unit, the signed pour record**, rather than seats. This changes `gtm.md`, where seats were the lead. Steel brands (then cement brands) **sponsor records for their customers at about ₹99-149 each**, as a marketing and lead cost. They get the slab date 24-48 h ahead, an on-site brand check, and a branded report in the owner's hand. Where no brand sponsors, **architects and engineers buy records at about ₹199-299 and resell them to the owner as a client-facing pre-pour report at ₹1,000+**. The pitch to them is "protect your signature and bill for it", not "save visits", because visits are how many of them get paid. Brand field forces keep a seat contract that **includes a monthly record quota with per-record overage**, so the seat ceiling becomes a floor. From Year 2, the same record is sold as evidence to **inherent-defects insurers and housing lenders**. Insurers already make technical inspection a mandatory underwriting step, and NHB has told housing finance companies to tie disbursement to construction stages. The realistic exit is acquisition by, or embedding in, a steel-led materials platform, the way JSW One absorbed BuildNext. All prices are hypotheses for the pilot to test. Call the product a "signed pour record", not a "verified pour": "verified" reads as a safety claim, which IDEA.md §10 forbids.

## Multi-site engineers need a pour inbox, not a sharper single scan

Indian practice is already **one consultant visit per slab before the pour**. A G+2 house needs about **25-35 supervision visits over 12-18 months**, and supervision costs 1-3% of construction cost ([StudioMatrx](https://www.studiomatrx.org/guides/site-supervision-checklist-india), V). The trigger is the contractor's call announcing the casting time ([CivilSuccessOnline](https://civilsuccessonline.com/checklist-of-slab-done-by-client-engineer-contractor-before-casting/), S). The approval itself travels as a WhatsApp photo or a phone call. Vendors marketing against this habit say chat approvals "are not auditable" and leave no open items ([Onsite](https://onsiteteams.com/whatsapp-construction-management/), V; [Velora](https://velora.ai/blog/whatsapp-construction-site-reporting/), S). For an engineer with many live sites, the binding constraint is **casting dates that cluster on the same evening** (U). Sariya's product slot is therefore "approve remotely, with numbers, from a queue".

Field-QA products have converged on the same basics:
- **Status-based approval:** Fieldwire's "Approved / Approved as noted / Not approved" ([Fieldwire help](https://help.fieldwire.com/hc/en-us/articles/360021924912), S).
- **Company template libraries copied into projects:** [Dalux](https://support.dalux.com/hc/articles/5212652832284) and [Procore](https://procoretest.skilljar.com/path/quality-safety-premier-general-contractor/inspections-tool-gc) (S).
- **One-click PDF reports, offline capture and digital signatures:** [PlanRadar](https://www.getapp.com/construction-software/a/planradar/) (S).
- **First-time pass rate at company level:** Procore's newest metric shows the share of items passing on first inspection, with a trend, at company and project level ([Procore](https://www.procore.com/fr-ca/whats-new/track-inspection-quality-with-new-pass-rate-insight), V).

In India, Brick&Bolt pushes automated weekly reports to owners and releases escrow only after stage approval ([Brick&Bolt](https://customer.bricknbolt.com/features/), S). QualMann lets a construction manager "approve contractor's call for inspection" with digital signatures and PDF records ([GEM Engserv](https://gemengserv.com/construction-technology/digital-quality-control-app), S). **None of them measures steel, and none sorts an approval inbox by pour time** (U, absence in search). That leaves four differentiators open to Sariya:
- measured deltas against the drawing inside the inbox;
- "re-scan" as a first-class approval state;
- a two-key signature that verifies offline;
- a contractor pass rate computed from measurements rather than opinion.

Japan's regulator has, in effect, written Sariya's on-site feature list. MLIT's March 2023 trial guideline for image-based rebar inspection requires:
- automatic judgement of diameter and spacing, plus a **data-tamper-prevention function** (§2.1(4));
- software that runs "from design-value input to creating the inspection report" (§2.1(2));
- a stated tape cross-check frequency, such as once per member type (§1.3);
- shooting conditions (location, distance, weather) that "must always be recorded";
- photos organised so each measurement location is identifiable (§4.1(2));
- remote review by the supervising officer (§5).

All of these are in the [MLIT PDF](https://www.mlit.go.jp/gobuild/content/001594736.pdf) (V). Japanese products compete on that record layer, not on measurement:
- AR apps on LiDAR iPads that auto-generate the report ([Zaikei/Modely](https://www.zaikei.co.jp/releases/2462027/), V; [@Press/Ecomott](https://www.atpress.ne.jp/news/311114), V);
- J-COMSIA certification for tamper detection and chalkboard-data linkage ([J-COMSIA](https://www.jcomsia.org/kokuban/software/), S).

Sariya's honest deviation is diameter. It routes diameter to the weigh test instead of judging it from images, so present that as a deliberate choice. The guideline's spacing tolerance is also worth bringing to the rulebook. It adopts AIJ's rule (spacing within 20% of pitch, and the average must not exceed the design value) ([MLIT PDF](https://www.mlit.go.jp/gobuild/content/001594736.pdf), V). It is a citable tolerance where IS 456 gives none, but a practising engineer must confirm it for Indian use.

| Rank | Feature | When | Note |
|---|---|---|---|
| 1 | Pour inbox by site and pour time | **Today** | Do-today #1 |
| 2 | Three-way decision and fix-verified re-scan | **Today** | Do-today #2 (request plumbing exists) |
| 3 | PDF report via share sheet, chalkboard header, verify QR, shooting-conditions log | **Today** | Do-today #3 |
| 4 | Copy spec to next floor | **Today** | Do-today #4 |
| 5 | Per-building floor history | Today, almost free | Filter records by site inside #1 |
| 6 | Per-member tape witness that auto-builds the on-phone error table | Today if time allows | Reuses the tape-entry field; follows MLIT's once-per-member-type rule |
| 7 | Hash-chained site log (each record carries the previous record's hash) | After | A cheap field plus a check, but adds demo surface; the liability story for Nambike Nakshe self-certifiers |
| 8 | Contractor scorecard (first-time within-limits rate) | After | Needs real records; seeded numbers invite a "mock-up" charge; keep it private to the engineer (IDEA.md §10: never call masons cheats) |
| 9 | Evening-before local reminder (T-12 h) | After | S locally, but low demo impact; cross-device push needs a backend |
| 10 | Push-to-talk code-mixed commands with read-back | After unless ASR is already in | In a study of 30 emergent Indian smartphone users, 28 preferred voice search, most used Hindi-English code-mix, misrecognition forced retries, and low-literate users checked the text before acting ([Microsoft Research, COMPASS '22](https://www.microsoft.com/en-us/research/wp-content/uploads/2022/05/compass22-34-taps.pdf), V); on-device and read-back are both required |
| 11 | BBS-table OCR to pre-fill the spec | After | Most useful AI feature post-event; too risky live |
| 12 | Homeowner verify link, drawing pins, pour calendar, mason points via brand loyalty apps, face blur | After | Need a backend, a brand partner or more data |

Two cautions follow from the evidence. First, on-device LLM wording is cheap: Llama 3.2 1B runs at about 64 tok/s on the 8 Elite Gen 5 ([Qualcomm AI Hub](https://huggingface.co/qualcomm/Llama-v3.2-1B-Instruct), S). But a hallucinated number in a signed record is a kill-shot. If an LLM is used at all, it only rephrases a template whose numbers are filled in deterministically and checked before text-to-speech. Second, gamification for engineers has no supporting evidence. The retention loop is the record outliving the pour, not streaks.

## Pitch the iQOO CEO on a professional who needs a flagship

**Flag: no source confirms Nipun Marya judges the Finale.** The published Finale jury is Goutam Kurumella (AWS), Madhav Bissa (nasscom), Pradipta Dash (Avashya), Siddhant Agarwal (ClickHouse), Venkat Ragothaman (Microsoft) and Vivek Sridhar (STATE.md, 9 Oct). Treat his presence as user-reported and never mention it in public material.

Marya has been iQOO India's CEO since December 2021, after about five years as vivo India's brand-strategy director ([afaqs](https://www.afaqs.com/people-spotting/iqoo-india-appoints-nipun-marya-as-chief-executive-officer), V). Digit still calls him CEO on 8 Oct 2026, in a story about his SQL-styled flagship teaser ([Digit](https://www.digit.in/news/mobile-phones/iqoo-teases-new-flagship-launch-in-india-is-it-iqoo-16.html), V/S). His public themes give the pitch its hooks:
- He has said "the majority don't play games" and named "white-collar professionals, students, or video editors" as targets ([Smartprix](https://www.smartprix.com/bytes/iqoos-ceo-told-us-about-iqoo-15-chip-originos-6-software-and-ai-plans/), S).
- He tells teams to "always start with the consumer" and warns against trending tech without consumer relevance ([Exhibit](https://www.exhibit.tech/interviews/leaders/nipun-marya-ceo-iqoo-interview-exhibit/), S).

The hackathon's own stated purpose is to show iQOO phones handling **"demanding professional workflows"** through performance, cooling and battery endurance on long tasks ([mediainfoline](https://www.mediainfoline.com/brand/iqoo-announces-indias-phone-first-hackathon-series-challenging-young-innovators-to-build-ai-powered-solutions), S). His business context sharpens the ask. Counterpoint data as reported has iQOO's India share falling from **4.4% to 1.7%** between Q2 2025 and Q2 2026 ([TechnoSports](https://technosports.co.in/indias-smartphone-market-10-in-q2-2026/?amp=1), S). An ₹86k flagship needs reasons to buy beyond gaming. Never say the share number aloud, but a professional segment story lands on a real need (U).

| iQOO 15 claim ([official page](https://www.iqoo.com/in/products/iqoo15), V) | Honest Sariya lever | Caveat to say first |
|---|---|---|
| 8 Elite Gen 5 NPU, 8K VC cooling | Sustained-run chart from our own runs: NPU latency (v3 at 12.1 ms) and temperature across 30+ consecutive Locks | Our curve, not iQOO's numbers |
| 7,000 mAh battery | Battery % per Lock, extrapolated to locks per charge | Extrapolated, not a measured full day |
| 2,600 nits global, 6,000 local | Error band and "re-scan" readable outdoors | 1,000 nits is the manual full-screen figure |
| IP68 + IP69 | Survives a dusty deck | iQOO says it is not a professional water-resistant phone; never splash the loaner |
| Battery range -20 to 40 °C | Pre-pour checks happen in the evening anyway | Volunteer this limit before he asks |
| Q3 chip, OriginOS AI Captions | Not used | Don't claim them |

The pitch arc for a brand-first juror:
1. **Open on his own words:** "Most iQOO buyers don't game, as you've said. Here is a professional for whom this phone's performance is the job."
2. **One person, one physical moment:** the engineer, a slab, a wrong gap found the evening before the pour, taped on stage to match the phone, then an honest "re-scan" from too far.
3. **The phone as hero, in measured tiles** (do-today #5), with Office Kit as the engineer's desk in one sentence.
4. **Tie the business to the chip:** "zero marginal compute" is the one honest place where the phone is the business model, because inference never touches a GPU cloud (U).
5. **Close with a question back:** would iQOO co-market a field kit (a printed card and a case) through a steel brand's home-builder programme? Label it an idea. No iQOO B2B channel was found, so it stays out of revenue.

Avoid:
- "safe", "certified", "approved", "permit" and "replaces the engineer";
- clause numbers and homography jargon (keep them for the technical jurors);
- unsourced headcounts of site engineers (none exists);
- "Make in India" through iQOO (unverified);
- any mention of the market-share slide or the iQOO 16 rumours.

## Price the signed pour: an ₹8M-slab market, not a 6,000-seat one

`gtm.md`'s Year-3 brand-seat plan reaches about ₹4.9 Cr and is capped by the size of brand field forces (5,000-8,000 seats, so about ₹12-19 Cr a year at ₹2,000 a month). That makes it a good wedge for a small company. The pour is the unit that scales. India publishes no national building-permit series, so the sizing below is our arithmetic [H] from public anchors:
- about **9.2 million new housing units in 2023**, growing about 4%/yr ([Freedonia](https://www.freedoniagroup.com/press-releases/new-housing-construction-in-india-forecast-to-rise-over-4-annually-through-2028), S);
- a PMAY-G target of **32.9 lakh houses in FY2025-26** ([NBMCW](https://www.nbmcw.com/news/government-targets-4-95-cr-houses-under-pmay-g.html), S);
- cement volume **up 8.6% in FY2026** ([ICRA](https://www.icra.in/Research/ViewResearchReport/production-volumes-up-by-8-6-yoy-in-fy2026/6893), V), with housing at 55-57% of demand (CRISIL, already in EVIDENCE.md).

| Layer [H] | Basis | Size |
|---|---|---|
| Slab pours (TAM) | ~10M units/yr, minus scheme houses, ÷ units per building, × RCC share × 1.5-2.5 slabs, plus PMAY-G roof casts; consistent with cement tonnage | **~5-12M/yr, central ~8M** |
| Software TAM | 8M × ₹250 per record | **~₹200 Cr/yr** |
| SAM | Urban and peri-urban houses with a registered professional on the plan (~15-20% of pours) plus the brand-programme seat ceiling | **~₹40-60 Cr/yr** |
| Bengaluru beachhead | ~10k Nambike Nakshe sanctions × ~2.5 slabs, plus other sanctioned houses | **~25-50k pours/yr** |
| SOM, Year 3 | 2 brands sponsoring 1-1.5 lakh records + seats + 5-10k professional records | **~₹3-5 Cr** (matches gtm.md) |

The conclusion founders on the jury will reach on their own: **India-only measurement software tops out near ₹50 Cr a year.** Venture scale needs the evidence layer priced on what it de-risks, export to markets with the same RCC practice, or a take on services, because owners pay ₹3,000-5,000 for a human check today [H]. The market evidence points the same way. Indian contractor SaaS monetises badly: Powerplay reported FY24 revenue of ₹4.39 Cr against a ₹31.9 Cr loss, and a 2025 round at a valuation 57% below 2022 ([Techleap](https://finder.techleap.nl/news/feed/powerplay-raises-2m-amid-57-valuation-drop), S). Value accrues to materials commerce instead. JSW One posted FY26 revenue of ₹5,743 Cr and filed for an IPO ([Inc42](https://inc42.com/buzz/ipo-bound-jsw-ones-fy26-loss-narrows-51-yoy-to-%E2%82%B9107-cr-revenue-jumps-45/), S), and it bought BuildNext, a loss-making home-construction platform with about ₹18 Cr of FY25 operating income ([Venture Intelligence](https://news.ventureintelligence.com/ma/ipo-bound-b2b-e-commerce-platform-jsw-one-acquires-project-mgmt-co.-buildnext), S). Sariya should therefore be built as the trust instrument a steel brand or materials platform embeds or buys.

Three channels are new relative to `gtm.md`:
- **Inherent-defects insurance:** HDFC Ergo prices cover at up to 1% of project cost ([Business Insurance](https://www.businessinsurance.com/indian-insurer-launches-property-insurance-policy-covering-structural-defects/), S), and Actuaries India lists technical inspection as mandatory for underwriting ([Actuaries India](https://actuariesindia.org/sites/default/files/inline-files/RERAActneed.pdf), S).
- **Housing lenders:** an NHB advisory of 20 Nov 2025 tells housing finance companies to link individual-loan disbursement to construction stages ([NHB](https://www.nhb.org.in/wp-content/uploads/2026/05/15.-Disbursement-of-Housing-Loan-to-individuals-linked-to-the-stages-of-construction_November-20-2025.pdf), S; the scanned PDF itself was not read).
- **RERA developers:** they carry 5-year structural-defect liability under Section 14(3) ([Housing.com](https://housing.com/news/what-is-builder-warranty-under-rera), S).

On the professional side, liability is rising. After the June 2026 Taratala collapse, police arrested the structural engineer and the supervisor ([The Hans India](https://www.thehansindia.com/kolkata/kolkata-civic-engineer-held-in-taratala-warehouse-collapse-case-total-arrests-rise-to-7-1121110), S). A consultant charging ₹8,000-15,000 to review slab execution ([comaron](https://www.comaron.com/blog/construction-quality-inspection-checklist-homeowners-2026), S) can absorb a ₹249 record at under 4% of the fee [H]. Two limits apply: no evidence was found that any Indian insurer prices premiums down for documented checks, and a signed record is also evidence against its signer. Sell through the owner's demand, not to the engineer cold.

| Model [H] | Ceiling (India) | Verdict |
|---|---|---|
| **Per signed record**, brand-sponsored (₹99-149) or professional-resold (₹199-299) | Scales with pours, ₹30-200 Cr | **Lead** |
| Brand field-force seats (gtm.md) | ₹12-19 Cr hard cap | Keep as wrapper with record quotas |
| SaaS seats for consultants (₹499-999/month) | ₹10-30 Cr | Test against a ₹2,000-5,000 per-project pack in pilot C |
| Insurer and lender evidence API | Small now, large if it becomes standard | Year 2+, after the error table exists |
| Owning the inspectors (marketplace) | ₹100 Cr+ GMV | Services margins; no |
| PMAY | Lumpy grants; no pre-pour stage exists | Impact footnote |

Unit economics hinge on people, not compute. Cloud, signing and storage cost ₹1-2 per record. But at `gtm.md`'s assumed one support and rulebook engineer per 2,000 sites, support costs about **₹140 per pour**, which leaves a ₹249 record at roughly 36% gross margin. At one per 20,000 sites, through self-serve onboarding and brand-run first-line support, margin reaches about **87%** [H]. The monetisation path follows from that:
- **Pilots (Q4 2026):** free, as in `gtm.md` §3, but every record is priced on paper.
- **Year 1:** one brand sponsoring records in Bengaluru, plus self-serve professional records.
- **Year 2:** a national brand contract with quotas, and the first insurer or lender evidence pilot.
- **Year 3:** record acceptance by a lender, insurer or the city authority (the network-effect moat), and white-label inside a materials platform.

## Conclusion

The research shifts Sariya's centre of gravity from the camera to the **record and the queue around it**. The scan is the acquisition hook. The inbox, the closed fix and the forwarded PDF are what make a multi-site engineer come back, and they are what a jury scoring "would someone keep using it" can see in 40 seconds. The same object, one signed pour record, is also the right pricing unit, the thing insurers and lenders could one day accept, and the asset a steel platform would buy. Building the four loop features today therefore improves the demo, the retention story and the business slide at once.

The unknowns now sit in the field, not on the web. No source counts concurrent sites per consultant, how often owners or lenders would ask for a record, or whether insurers would credit one. Each is a pilot question, and the error table from tape-checked pours (G1, not yet shown) gates every claim beyond the demo. For the CEO, if he is there at all, the winning move is restraint: measured tiles from this phone, its limits stated first, and a question back rather than a market-size number nobody can source.
