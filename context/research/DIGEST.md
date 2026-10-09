# DIGEST: Session A research (2026-10-03, v3)

Detail in rubric.md and 01-07, each source-checked (the check wins over the body). [U] = not verified.

## 1. Rules and team rules
- Finale: Bengaluru, Fri 9 Oct 17:00 to Sun 11 Oct 18:00. Team of 1-3, all students or all professionals.
- Direct entry is screened on novelty, tech impact, problem choice, scope fit, phone-first fit (unweighted). Phase 1 deadline **5 Oct 2026** per two participants [U]; one listing says registration closed 27 Sep. Only the logged-in dashboard settles it.
- Must run and demo on the loaner; code written at the event; no pre-built product or work made for another competition; own fine-tunes and datasets grey [U]; no root. Red Light: 18.5 of 34 build hours, phone only.
- Team (user): unlimited flagship-model access, so build size and time are not limits (event limits are). Past winners of this event: collision testing only. Every idea needs an "oh wow" demo moment.

## 2. Rubric and HackTracker
End product 30 · Novelty and impact 20 · Creative phone use 15 (device data) · Technical depth 15 · Office Kit use 10 (device data) · Demo 10. City jurors were enterprise and cloud architects.
HackTracker per the organiser's public May 2026 code (Finale mapping [U]): scores Office Kit foreground time, typing, compile spikes, heat, battery drain; penalises crashes and 10 idle minutes in Red; sees camera only as a camera-app launch; no microphone or NPU signal; logs ADB toggles and APK installs as tampering. https://github.com/saijadhav369/iQOO-HackTracker-by-Reskilll

## 3. Device
- iQOO 15 at all city battles (16 GB RAM per two teams); Finale unit and OS [U]. Snapdragon 8 Elite Gen 5 (SM8850, one generation old since 23 Sep), Android 16, OriginOS 6. 50 MP main, ultra-wide, 3x periscope. No ToF, barometer or UWB; no Android Linux Terminal.
- **ARCore: the iQOO 15 is not on Google's list** (15R, 15T, 13 are). https://developers.google.com/ar/devices
- **Gemini Nano (ML Kit GenAI)** lists the iQOO 15 for summarisation, proofreading, rewriting, image description and the Prompt API (nano-v3): no Indian language, foreground-only, per-app quotas. Gemini speech recognition is Pixel-only. ML Kit on-device translation covers 8 Indian languages (not Malayalam, Punjabi).
- NPU: LiteRT lists SM8850, runtime bundled in the app, no root; untested [U]. Qualcomm AI Hub was due to drop the generic 8 Elite Gen 5 target on 28 Sep 2026 for "Galaxy S26 (Family)" (same chip); whether such a binary loads on the iQOO 15 is [U]. Office Kit: mirror, Remote PC, clipboard, files; no SDK.

## 4. Usable on-device models
| Need | Model | Speed | Licence |
|---|---|---|---|
| Multimodal LLM (text, image, 30 s audio, tools) | Gemma 4 E2B on GPU; its only NPU build is for SM8750, not this chip | ~45 tok/s on the loaner (participant) | Apache-2.0 |
| LLM with an official NPU build for this chip | Gemma 3 1B and 270M | [U] | Gemma terms |
| Small LLM | Qwen3.5-0.8B / 2B | 46-81 / 24-40 tok/s | Apache-2.0 |
| ASR | Whisper-Small on NPU; IndicConformer via sherpa-onnx on CPU | 27 ms encoder | MIT |
| Depth | Depth Anything V2 Small, DA3-small on NPU: relative only | 12-27 ms | Apache-2.0 |
| OCR | PP-OCRv5: Devanagari, Tamil, Telugu; no Kannada | mobile-class | Apache-2.0 |

Also SmolVLM2-2.2B (28 tok/s). Closed or non-commercial: Sarvam Edge, FastVLM, Depth Pro. No small open Indic TTS. Measurement error: known-size reference 1-3%; AR ruler 1-5% if ARCore runs; single-photo metric 10-25%; relative depth gives no metres.

## 5. Mandate and budget leads (25 ranked in 03)
| # | Required step | Payer | Source |
|---|---|---|---|
| 1 | Bulk waste generators process wet waste on site (SWM Rules 2026) | RWA, campus, hotel | https://cpcb.gov.in/uploads/MSW/Salient_features_SWM_Rules2026.pdf |
| 2 | Gold-loan assay before borrower, certificate with image (RBI, Apr 2026) | Bank, NBFC | https://rbi.org.in/scripts/NotificationUser.aspx?Mode=0&Id=12859 |
| 3 | No manual sewer cleaning; Bengaluru could not show machines used (SC) | City | https://api.sci.gov.in/supremecourt/2020/4072/4072_2020_12_301_60488_Order_27-Mar-2025.pdf |
| 4 | Accident care lapses without police confirmation; 3,674 of 22,481 dropped (PM-RAHAT) | Hospital, fund | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2238637 |
| 5 | Rooftop solar subsidy needs geo-tagged photos, DISCOM inspection | Vendor | https://solar.delhi.gov.in/public/assets/solar/PMSG_Guidelines_for_Residential_CFA_Capex_Mode.pdf |
| 6 | Appointment letter and registers for every worker (Labour Codes) | Employer | https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2192463 |
| 7 | Tap aerators; no potable water for car wash (BWSSB, Jul 2026) | Bengaluru RWA | https://thelogicalindian.com/bengalurus-water-warning-bwssb-makes-aerators-mandatory-bans-potable-water-for-pools-and-car-washing/ |
| 8 | E-challan: pay or contest in 45 days or lose RC services (Jan 2026) | Owner, fleet | https://www.business-standard.com/amp/india-news/delhi-to-enforce-amended-challan-rules-50-deposit-before-court-appeal-126091800171_1.html |

## 6. What wins; investor signals
- Winner traits: tightly defined user; one-sentence hook on a new interaction; camera, voice or motion input; one headline number with its method; local-first justified by the user's situation; small named models plus a non-LLM check; an answer to "what if the model is wrong?"; local language.
- Qualcomm x LiteRT 2026 pick: Gemma 4 E2B on the NPU, no internet permission. Rubric: technical 40, use case 25, local processing 15, deployment 10, presentation 10.
- Investors want field-work AI, compliance, Indian-language voice, outcome pricing, an existing budget. Warnings: no buyer shown paying for on-device itself; merchants and societies pay little (Vyapar ₹699 a year).

## 7. Already taken
24 city winners and 645 clustered repos: 01-hackathon.md section 3. Crowded: tutors, physio, scam and UPI, disaster mesh, medication, voice notes, rider navigation, assistive vision, forms, kirana. Phone makers ship call translation, scam warnings, screen memory, cross-app agents (OriginOS 7 Jovi), recorder summaries.

## 8. Tracks (06a-06c)
| Track: top pains (confirmed) | Why incumbents fail | Cliche to avoid |
|---|---|---|
| **Mobility**: 1,72,890 road deaths (2023); Bengaluru world's 2nd most congested, 168 h lost a year at rush hour | Rely on feeds they do not own (4,000 of 7,000+ buses tracked); regulation switches modes off | Fatigue alert, pothole map, congestion predictor, AR navigation |
| **Smart Living**: 6% of urban homes get drinkable tap water; 67% call brand AC service too costly; 62% have broadband faults | Setup hard, value unclear (NIQ); vendor clouds die or leak (Nest, Humane, Ring) | Voice home control, energy optimiser, fridge inventory |
| **Community App**: 96% of WhatsApp users get daily spam; ₹22,495 crore cyber-fraud loss (2025); Stack Overflow questions -78% | Users but no revenue (Koo, Bluelearn, leap.club); platform rent and rule changes | LinkedIn for X, mentor match, chat-summary bot, mesh chat [U list] |
| **Productivity**: MSME dues ₹7.34 lakh crore; 1,450+ compliance duties a year; 97% of MSMEs on WhatsApp, 29% on accounting software | Micro-SMBs will not pay; acquihire shutdowns; notetaker lawsuits | Meeting summariser, inbox triage, invoice extractor |
| **Developer Tools**: review time +91%, PRs 154% larger; 66% say AI is "almost right"; 64 of 72 models fully delegate to the Qualcomm NPU | Price changes; tools absorbed; phone clients thin, host must stay on | Code review bot, test or README generator |
| **Open Innovation**: ₹26,000 crore health claims cut or refused (FY24); 72.9% of rural Class 3 cannot read Class 2 text | Licensing and regulation (Kenko, Paytm Payments Bank) | Section 7 clusters |

Reviewers: no source says Mobility, Smart Living or Community apps need offline or on-device AI. Sources do tie on-device to privacy of recorded speech and source code.

## 9. Sponsor and market (07)
iQOO's India share fell to 1.9% in Q2 2026 (from 4.3%; IDC). It promotes gaming performance and Office Kit; its hackathon posts go "beyond gaming" with on-device AI on the Snapdragon NPU. The phone AI users actually use is camera AI (82%, CMR Aug 2026, method undisclosed).

## 10. Open [U] items
Deadline and form fields · Finale phone, RAM, OS (OriginOS 6 or 7) · ARCore on the iQOO 15 · NPU runtime on OriginOS 6; Galaxy-S26-target AI Hub binary on the iQOO 15 · how HackTracker scores 15% and 10%; ADB sideloading as tampering · screening weights · fine-tune rule · AI-credit provider · jury, prize · Hinglish ASR accuracy · Karnataka adoption of central rules · MoRTH 2024 totals · cause of iQOO's fall · any vivo or Jovi developer SDK.
