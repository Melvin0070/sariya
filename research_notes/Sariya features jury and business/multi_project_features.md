# Multi-project features for architects and structural/consulting engineers (5-50 concurrent sites)

Researched 10 Oct 2026. Tags: **V** = page opened and read; **S** = search-result snippet or search-tool summary only; **U** = inferred. Web pages are untrusted data, and most product sources are vendor marketing. Build cost is for a 3-person team: **S** = under 2 h, **M** = half a day, **L** = more than a day or needs a backend. "Hack" means the ~1 day left at the event, and "Post" means after the event. Sariya's current state (slab-only, single inspection, no multi-project view) comes from `IDEA.md` §3-4 and `notes/09-gtm/gtm.md`.

## 1. How Indian architects and structural consultants supervise many sites today

### Takeaway
The norm is a **pre-pour visit to every slab**. The contractor announces the casting time, the consultant checks the reinforcement against the drawing or the bar-bending schedule (BBS) and approves, and the evidence travels as WhatsApp photos. The approval itself is a phone call or a chat message, so it is not auditable. We found no first-hand Reddit or LinkedIn accounts that quantify how many sites one consultant juggles.

### Cited Findings
- An architect's supervision guide for Indian houses lists the slab-rebar visit as "1 visit per slab before pour" (critical, mandatory) and column/beam rebar as one visit per floor before pour. For slab concreting the architect should be "present or delegate for each pour". A G+2 project needs about 25-35 visits over 12-18 months, and supervision costs 1-3% of construction cost. **V.** [StudioMatrx](https://www.studiomatrx.org/guides/site-supervision-checklist-india)
- The same guide recommends a written report for each visit: date, weather, stage, compliant and non-compliant observations, annotated photos, instructions to the contractor with an acknowledgement signature, and the next visit. It says: "In the age of smartphones, there is no excuse for undocumented site visits." **V.** [StudioMatrx](https://www.studiomatrx.org/guides/site-supervision-checklist-india)
- A 2011 draft fee-and-scope document from the Indian Society of Structural Engineers (ISSE) lists two visits during foundation work and **one visit per slab**. It is an old draft, so its current status is unknown. **S.** [ISSE journal draft](https://isse.org.in/wp-content/uploads/2021/09/feedraft-1.pdf)
- Indian checklists say: "Check the reinforcement details with bar bending schedule and get an approval from structural consultant" before placing concrete. **S.** [Gharpedia](https://www.gharpedia.com/blog/things-check-before-concreting-beam-slab/)
- "The starting time of slab casting shall be informed by the contractor to the Consultant". The trigger is a notice from the contractor, not the consultant's own calendar. **S.** [CivilSuccessOnline](https://civilsuccessonline.com/checklist-of-slab-done-by-client-engineer-contractor-before-casting/)
- The formal gate in method statements is a final pre-pour inspection and **permit-to-pour or hold-point release** recorded by the engineer. **S.** [Quollnet method statement](https://quollnet.com/methods/method-statement-pouring-leveling-and-finishing-concrete-for-suspended-structura)
- WhatsApp is the default channel for site photos and approvals in India. What breaks: approvals leave no formal record (they sit in another group or in an unsaved voice note), revised drawings are missed, "There is no such thing as an open item on WhatsApp", and retrieval means scrolling months of chat. This is vendor marketing for Onsite with illustrative cost figures that are internally inconsistent. **V.** [Onsite blog](https://onsiteteams.com/whatsapp-construction-management/)
- Uncaptioned WhatsApp photos are called the main source of wasted effort, and in-chat approvals "are not auditable". The fix suggested is to record the request, the files, the approver and a timestamp. This is a vendor blog. **S.** [Velora blog](https://velora.ai/blog/whatsapp-construction-site-reporting/)
- Bengaluru's Nambike Nakshe lets registered architects and engineers who are empanelled with BBMP "self-declare" plans for plots up to 50×80 ft and up to four units. BBMP engineers visit only to check deviations during construction. None of the sources defines the professional's liability. **S.** [Deccan Herald](https://deccanherald.com/india/karnataka/bengaluru/nambike-nakshe-rolled-out-across-city-3174333), [Housing.com](https://housing.com/news/bbmp-rolls-out-scheme-to-simplify-building-plan-approvals). Per the repo's GTM notes, there were about 9,000 sanctions in 2025 and about 10,000 are expected in 2026. **S** (`notes/09-gtm/gtm.md` row 8).
- The repo's GTM notes put a structural engineer's site visit at ₹5,000-30,000. **S** (`notes/09-gtm/gtm.md` §2).

### Inferences
- **U.** For a consultant with 5-50 live sites, the binding constraint is **slab-casting dates clustering**. Several contractors call for the same evening, and the consultant either travels, delegates to a junior, or approves from WhatsApp photos. Sariya's product slot is "approve remotely, with numbers, from a queue".
- **U.** Consultants are paid per visit (ISSE scope; ₹5,000-30,000 per visit), so remote approval can **cannibalise visit fees**. Pitch it as covering the pours they cannot reach and protecting the signature (liability), not as replacing visits. The self-certifying Nambike Nakshe professional is the clearest buyer of the liability story.
- **U.** The contractor's call announcing the casting time is the natural event to model. In product terms it is a pour request with a site, a member, a planned time and the operator.

### Gaps
- No first-hand Reddit (r/india, r/civilengineering) or LinkedIn threads were found that quantify sites per consultant, how far ahead the call comes, or how often approval is given purely on WhatsApp photos. Search returned only checklist blogs. Close this with 5 phone interviews with Bengaluru consultants.
- No data on how often Indian consultants delegate pre-pour checks to juniors, or how long that takes.
- No Council of Architecture or Karnataka circular on construction-stage duties under Nambike Nakshe was found.

## 2. What field/QA apps ship for multi-project oversight

### Takeaway
Most products ship **status-based approval on inspection forms, company-level template libraries copied into projects, scheduled inspections with reminders, one-click PDF reports, and offline capture**. A true cross-project **portfolio** view is rare and mostly analytics (Procore's company-level pass rate, SafetyCulture completion across sites). We found no product with a pour-specific approval inbox across sites, and none that *measures* steel. Indian apps (Powerplay, Onsite, Brick&Bolt) focus on progress, materials and payments, plus homeowner-facing reports.

### Cited Findings
**Approval states**
- **Fieldwire:** an Inspection Request form can be set to "Approved", "Approved as noted" or "Not approved". Form statuses are customisable. Each status can send an email to a chosen distribution list, and the form assignee gets an email and in-app notification 48 h before the due date. **S.** [Fieldwire help](https://help.fieldwire.com/hc/en-us/articles/360021924912); the page returned 403 when fetched. [Fieldwire changelog](https://fieldwire.com/changelog), [custom task statuses](https://www.fieldwire.com/blog/fieldwire-announces-custom-task-statuses/)
- **QualMann (GEM Engserv, India):** a construction manager can "Approve contractor's call for inspection" for RCC, finishing and MEP work at pre-, during and post-stages. Checklists are signed digitally in the app, PDF approval records are generated on demand, and payment follows approved tasks. Claimed clients are Godrej Properties, Oberoi Realty and AFCONS (vendor claim). **S.** [GEM Engserv](https://gemengserv.com/construction-technology/digital-quality-control-app)
- A pre-pour checklist builder recommends a pass/fail/not-applicable result on each item, routed to "ready to pour", "correction required" or "on hold", because one overall approval box hides the open correction. **S.** [Makeform](https://www.makeform.ai/tools/ai-pre-pour-inspection-checklist-generator)
- The standard pour card carries the project, drawings, pour location, grade and quantity, and sign-off by the **contractor and the engineer representative**. **S.** [Sitemate pour card](https://sitemate.com/za/templates/quality/forms/concrete-pour-card-template/)

**Company-level templates and reuse**
- **Dalux:** a company-level Field library holds checklist templates in folders that are added to projects. A template can be imported from another project, generated from a PDF, or locked against project edits. An inspection plan can be created from scratch, copied from another project or from the company profile, or imported from Excel. **S.** [Dalux Field library](https://support.dalux.com/hc/en-us/articles/11270126331932-Field-library), [Dalux inspection plans](https://support.dalux.com/hc/articles/5212652832284)
- **Procore:** company-level inspection templates are added to a project and tailored. Inspection schedules (template, location, first due date, frequency, assignees) are viewed in the project's Inspections tool. We found no company-wide schedule view. **S.** [Procore inspection schedules](https://support.procore.com/products/online/user-guide/project-level/inspections/tutorials/view-inspection-schedules), [Procore training](https://procoretest.skilljar.com/path/quality-safety-premier-general-contractor/inspections-tool-gc)

**Portfolio analytics**
- **Procore** launched an "Inspection Line Item Pass Rate" insight on 21 April (2026 per the search snippet) "at both the Company and Project levels". It shows the share of items passing on **first inspection** with a six-month trend, compares against company and industry benchmarks, and finds the projects or items with the highest deficiency rates. **V.** [Procore what's new](https://www.procore.com/fr-ca/whats-new/track-inspection-quality-with-new-pass-rate-insight)
- **SafetyCulture:** one schedule can cover multiple sites (a sub-schedule per site), with assignment to users, groups or site members. Its completion view runs "across sites within a schedule to spot trends". Assignment governs completion; there is no separate approval step. **S.** [SafetyCulture help](https://help.safetyculture.com/en-US/000036/), [SafetyCulture help 003102](https://help.safetyculture.com/003102)

**Reports, offline and sign-off**
- **PlanRadar:** unlimited projects on its plans, statistics dashboards, one-click export of all defects to a report template filterable by contractor or defect type (PDF or Excel), and existing report templates uploaded as fillable PDFs. Offline mode on iOS, Android and Windows, plus digital signatures for approvals. A customer cut defect reporting from up to 2 h to about 10 min. **S.** [GetApp PlanRadar](https://www.getapp.com/construction-software/a/planradar/), [PlanRadar case](https://planradar.com/?p=458047)

**Indian apps**
- **Brick&Bolt** customer app: real-time progress, inspection reports, the work and payment schedule, "automated weekly reports" sent to the customer, and timestamped photos and deviation logs. QASCON maps quality checks to tasks across stages to "capture the proof of quality". Escrow releases payment "only after stage completion & approval". Check counts conflict: 470+ per floor vs 1,153 stage-wise. **S.** [Brick&Bolt customer features](https://customer.bricknbolt.com/features/), [Brick&Bolt Bengaluru](https://www.bricknbolt.com/best-construction-company-bangalore)
- **digiQC:** customisable mobile checklists with photos, plus a web dashboard that gives managers "instant notifications of quality discrepancies". Named Indian users are Shivalik Group and Kavisha Group. **S.** [datadrivenaec digiQC](https://datadrivenaec.com/tools/digiqc)
- **Onsite:** material requests carry submitter, approver, timestamps and status. Daily progress reports record date, quantity, BOQ item and submitter. The article does not describe a multi-project dashboard explicitly. **V.** [Onsite blog](https://onsiteteams.com/whatsapp-construction-management/)
- **Powerplay:** described by its investor as a "mobile-first, vernacular construction site management app". It claims 85,000+ projects and 40,000 contractors, and added embedded credit in Hyderabad in March 2026. **S.** [Surge](https://surge.peakxv.com/companies/powerplay), [NBMCW](https://www.nbmcw.com/news/powerplay-backs-hyderabads-construction-growth-with-software-linked-credit.html). An August 2025 down-round report gives a ₹258 Cr valuation (down from ₹600 Cr) and FY24 revenue of ₹4.39 Cr; this is secondary. **S.** [Realty n More](https://realtynmore.com/?p=108953)

**Reality capture (Buildots, OpenSpace)**
- **Buildots** raised $130M in September 2026 and pitches "portfolio-level risks" across sites. **OpenSpace** pitches dashboards for "owners, executives, and field teams" and bought Disperse in October 2025. Neither source documents a cross-project view in detail. **S.** [Pulse2](https://pulse2.com/buildots-raises-130-million/amp/), [Buildots one-pager](https://innovation.technion.ac.il/wp-content/uploads/2025/07/Executive_Summary_one_pager_BUIDOTS.pdf), [OpenSpace GC](https://www.openspace.ai/solutions/general-contractors/)

### Inferences
- **U.** The table stakes, which every serious app ships, are: a list of projects or sites, reusable templates, assignment, approval states, reminders, PDF reports, timestamped photos, and offline capture. A jury member who uses Procore, Fieldwire or Powerplay will expect at least a site list, approval states and a shareable report.
- **U.** These are the differentiators open to Sariya, because nobody we found ships them:
  1. measured values with an error band in place of tick boxes;
  2. an approval inbox ordered by pour time, where each item shows **drawing vs measured** deltas;
  3. a two-key signature that verifies offline;
  4. a contractor's first-time pass rate computed from **measurements**, not inspector opinion (this is Procore's newest metric, applied to steel).
- **U.** "Approved as noted" (Fieldwire) and "correction required" (Makeform) map directly to Sariya's real-world flow: approve once the 2 stirrups are added and B2's left end is re-scanned. A single approve button misses this.

### Gaps
- We could not open Fieldwire or Capterra pages (403), so the Fieldwire details are from snippets.
- We did not check Raken, Bridgit, DroneDeploy, Kryzen, Highrise, Projectsbook, BuildNext's client app, or the ACC/BIM 360 portfolio features, for lack of time. Their multi-project specifics remain unverified.
- No vendor documented a cross-project **pour calendar** or an inbox sorted by pour time. This could mean a gap in the market, or weak demand. Unknown.

## 3. Ranked candidate features for the multi-site engineer, and table stakes vs differentiators

### Takeaway
In one hackathon day, the highest-value additions reuse what Sariya already has (signed packs over Office Kit, engineer and operator keys, signed specs):
1. a **pour inbox / portfolio board** on the engineer side, sorted by pour time with a readiness status per site;
2. a **three-way decision**: approve / approve with fix + targeted re-scan / reject;
3. **copy a signed spec to the next floor**;
4. a **PDF report shared to WhatsApp**.

Contractor scorecards, calendars, BBS OCR, drawing pins and verifiable cloud links are post-event work.

### Cited Findings
The evidence for each feature is cited in §1-2 and repeated in the table. Additional anchors:
- Clients of Indian design-build firms already expect homeowner-facing reports: Brick&Bolt sends "automated weekly reports" and shows inspection reports and deviation logs. **S.** [Brick&Bolt](https://customer.bricknbolt.com/features/)
- Procore's newest company-level metric is the first-time pass rate with trend and the worst projects. **V.** [Procore](https://www.procore.com/fr-ca/whats-new/track-inspection-quality-with-new-pass-rate-insight)
- Procore and Dalux both treat template reuse across projects as core. **S.** [Dalux](https://support.dalux.com/hc/articles/5212652832284), [Procore training](https://procoretest.skilljar.com/path/quality-safety-premier-general-contractor/inspections-tool-gc)

### Inferences: ranked feature table (all ranks are U, hypotheses)

| # | Feature | User problem (multi-site engineer) | Evidence it matters | Hack cost / Post cost | In a 3-5 min demo? |
|---|---|---|---|---|---|
| 1 | **Pour inbox / portfolio board**: every site with its next pour time and a status chip (awaiting scan / ready for review / fix requested / signed), sorted by pour time; a red chip for anything outside limits | Three contractors call for the same evening; which needs me first? | Contractor tells the consultant the casting time [S CivilSuccessOnline]; status-driven approvals in Fieldwire [S]; "ready to pour / correction required / on hold" [S Makeform]; QualMann approves "contractor's call for inspection" [S]; company-level views in Procore and SafetyCulture [V/S]. No vendor found sorts by pour time [U] | **S** (a list over received packs keyed by site ID and planned pour time) / M with sync | **Yes, about 15 s.** Open the engineer desk on the Office Kit laptop with 3 sites, one red. Use real scans of the demo cage under 2-3 site IDs, labelled as such, not fake rows |
| 2 | **Approve / approve with fix + targeted re-scan / reject**: the engineer ticks the failed member and zone, and the operator's phone gets "re-scan B2 left end after adding 2 stirrups" | The real decision is conditional; a binary approve hides the open fix | Fieldwire "Approved as noted" / "Not approved" [S]; per-item results, "correction required" [S Makeform]; Indian reports carry instructions with the contractor's acknowledgement [V StudioMatrx] | **S-M** / S | **Yes.** It closes the loop on stage: sabotage → flag → engineer requests re-scan → fix → sign. Strongest "would keep using" moment |
| 3 | **Copy spec to next floor (typical floor)**: duplicate a signed spec with a new floor or slab ID; the engineer re-signs in one tap; differences highlighted | The engineer re-enters the same 5 fields for each floor and each site | Dalux copies inspection plans from another project or the company library [S]; Procore company templates → project [S]; 1 visit per slab per floor [V StudioMatrx] | **S** / S | **Yes, 5 s.** "First floor is signed; second floor in one tap" |
| 4 | **PDF report with the engineer's letterhead, shared via the Android share sheet (WhatsApp)**: measured values, bands, the fix, both signatures, and a QR to verify | The owner and contractor live in WhatsApp; a PDF with a QR is something they forward and keep | WhatsApp is the de facto channel and its approvals are unauditable [V Onsite; S Velora]; PlanRadar one-click PDF and fillable templates [S]; QualMann PDF approval records [S]; Brick&Bolt weekly owner reports [S]; StudioMatrx report fields [V] | **S-M** (on-device PDF; letterhead is an image plus a name) / S | **Yes, about 10 s.** Tap share; WhatsApp opens with the PDF. Don't send to a real contact on stage |
| 5 | **Floor-by-floor history per building**: a timeline of signed records per site, plus the chain of fixes | "What did we find on the 1st-floor slab?"; handover; disputes | Brick&Bolt timestamped photos and deviation logs [S]; per-visit written reports [V StudioMatrx] | **S** (filter existing records by site) / M | Brief glance (part of #1) |
| 6 | **Liability log / hash-chained site record**: each record carries the previous record's hash; an export proves nothing was removed | Self-certifying professionals carry the risk; disputes after a crack | WhatsApp approvals "not auditable" [S Velora; V Onsite]; Nambike Nakshe self-declaration [S]; Brick&Bolt escrow ties payment to approval [S]; Taratala arrests [S, gtm.md] | **S** (a prev-hash field plus a check) / M | Yes, as part of the replay or tamper test already in the demo |
| 7 | **Delegate to a junior engineer**: the engineer issues the signed spec to a named junior's enrolled key; the junior scans; the senior signs | "Present or delegate for each pour" | Delegation named in Indian supervision practice [V StudioMatrx]; assignment to users or groups in SafetyCulture and Procore [S] | **Already mostly built** (operator key) — reframe in the UI as "delegated to Ravi (junior)" / S | Yes, by narration: rename the operator role in the demo |
| 8 | **Evening-before reminder**: a local notification at a set time before a planned pour ("Site 3: pour 7 am; scan not received") | Missed pours: the contractor pours before anyone checks | Fieldwire 48 h pre-due notifications [S]; spec notice periods of 48 h [S, US spec]; the contractor's notice in Indian practice [S] | **S** for local scheduled notifications (offline) / **L** for cross-device push (needs a backend) | Possible (trigger one live), low impact; keep to a line |
| 9 | **Contractor / mason scorecard**: first-time within-limits rate per contractor and their repeat errors ("stirrup gap at beam ends in 3 of 5 slabs") | Which contractor do I watch and which do I trust; feedback for the brand's training | Procore company-level first-time pass rate with trend (Apr 2026) [V]; PlanRadar filters defects by contractor [S] | M (needs a contractor field on the record plus aggregation) / M | Only with real records. Seeded numbers on stage risk a "mock-up" accusation [U]. **Post-event**, but state it as the roadmap; it is the strongest retention story |
| 10 | **Pour calendar across sites** | Plan the week's visits | SafetyCulture multi-site schedules [S]; Procore schedules (project-level) [S] | M / M | Weak; the inbox (#1) covers it. Skip at the hackathon |
| 11 | **BBS photo import (OCR)** | Spec entry from the BBS table the consultant already issues | Indian practice checks against the BBS [S Gharpedia; V StudioMatrx]. Already in IDEA §3 as an alternative | L / M | Risky live; post-event |
| 12 | **Drawing PDF with member pins** | Locate a record on the plan | PlanRadar and Fieldwire pin issues on plans [S] | L / M-L | No; post-event |
| 13 | **Read-only homeowner link that verifies online** | Owner or lender verifies without the app | Brick&Bolt owner app [S]; lender evidence layer (gtm.md) | L (backend, hosting, privacy) / M | No at the event; the offline QR from #4 is the event-time substitute |
| 14 | **Hindi/Kannada UI strings for operator screens** (voice already exists) | Supervisors and junior engineers in vernacular | Powerplay's "vernacular" positioning [S Surge] | S-M / S | Optional toggle |

**Table stakes for Sariya's persona** (expected; their absence costs credibility rather than adding points) [U]:
- a site list;
- approval states;
- a shareable PDF;
- timestamped photos;
- offline capture (already present).

**Differentiators** (nobody found ships these) [U]:
- measured deltas vs the drawing inside the approval inbox;
- abstention ("re-scan") as an approval state;
- an offline-verifiable two-key signature;
- contractor pass rates from measurements.

**Recommended hackathon cut (U):** #1 + #2 + #3 + #4, roughly 1 working day for 3 people, all reusing existing records, keys and Office Kit transport. #5-#7 come almost free inside them. Demo order: the inbox shows 3 sites → open the red one → "approve with fix, re-scan B2 left" → the operator re-scans → sign → share the PDF → copy the spec to the next floor. That adds about 40 s to the current 3:30 demo, so trim elsewhere.

### Gaps
- No user research was found that ranks these features for Indian consultants specifically. The ranking is inference from product convergence plus Indian practice.
- There is no evidence on whether consultants would let contractors see scorecards (a political risk).
- There is no data on how many concurrent sites a typical Bengaluru consultant handles. "5-50" is the brief's assumption, not a finding.

## 4. Retention drivers for construction field apps in India

### Takeaway
The evidence is thin and mostly from vendors. It points to **riding WhatsApp rather than replacing it**, mobile-first vernacular UX, offline capture, and tying the app to **money flow** (payments, escrow, credit), which is what Powerplay and Brick&Bolt have converged on. For Sariya, the sticky loop is the signed record the owner keeps and the per-site history the engineer needs for liability, not the scan alone.

### Cited Findings
- Powerplay is positioned as "mobile-first, vernacular" [S Surge](https://surge.peakxv.com/companies/powerplay). It has moved into embedded procurement credit "into the daily workflows of builders and contractors" (March 2026) [S NBMCW](https://www.nbmcw.com/news/powerplay-backs-hyderabads-construction-growth-with-software-linked-credit.html). A reported 2025 down round and FY24 revenue of ₹4.39 Cr against a ₹31.92 Cr loss suggest that SaaS-only monetisation of Indian contractors is hard [S Realty n More](https://realtynmore.com/?p=108953).
- Brick&Bolt ties stage approval to escrow payment release and pushes weekly reports to the owner. **S.** [Brick&Bolt](https://customer.bricknbolt.com/features/), [Brick&Bolt Pune](https://www.bricknbolt.com/best-construction-company-pune)
- QualMann ties payment to approved tasks ("Pay only for completed and approved tasks"). **S.** [GEM Engserv](https://gemengserv.com/construction-technology/digital-quality-control-app)
- Vendor commentary calls offline capture with auto-sync "a must" for basements and remote stretches. **S.** [Powerplay blog](https://www.getpowerplay.in/resources/blogs/how-a-construction-management-app-supercharges-productivity-for-indian-site-engineers/). PlanRadar advertises offline on all platforms. **S.** [GetApp](https://www.getapp.com/construction-software/a/planradar/)
- Indian vendors (Onsite, Velora, SiteSetu) all market against WhatsApp, which shows it is the incumbent habit. **V/S.** [Onsite](https://onsiteteams.com/whatsapp-construction-management/), [SiteSetu](https://sitesetu.app/blog/whatsapp-alternatives-construction-teams), [Velora](https://velora.ai/)
- Powerplay's Capterra rating is 4.5 from 8 reviews (mostly 2022-23). Praise centres on support. Complaints are app/web inconsistency, missing delete options, cost, and limited visualisation. **S.** [Capterra](https://www.capterra.com/p/268357/Powerplay/reviews/); the page returned 403 when fetched.

### Inferences
- **U.** For Sariya, retention comes from three things:
  1. **the record outliving the pour**: per-building history, and a PDF the owner forwards;
  2. **a stage payout or brand programme requiring it**: builders' escrow and brands' technical-service KPIs;
  3. **the multi-site inbox making the engineer's evening shorter**.

  The scan is the acquisition hook; the inbox and the history are the retention loop.
- **U.** Share *into* WhatsApp (PDF plus a verify QR) rather than building chat. Every Indian competitor that fights WhatsApp still has to describe it as the incumbent.
- **U.** For the jury's "would someone keep using it" criterion (30%), the strongest answer is a visible second-week use: floor 2 copied from floor 1, the inbox across 3 sites, and the history of fixes. A better single scan does not answer it.

### Gaps
- We found no independent retention or adoption data (DAU/MAU, churn) for Powerplay, Onsite or others, and no Play Store review corpus was read (Play Store pages were not fetched).
- No evidence on whether Hindi or Kannada **UI** (as opposed to voice output) changes adoption among engineers, who often work in English.
