# 06b — Track research: Productivity, and Developer Tools

Research date: 2026-10-03. Research only. No product ideas are proposed here.

## How to read this file

Evidence labels used on every load-bearing claim:

- **[V]** I opened the cited page in this session and the claim is on it.
- **[S]** The claim appeared in a search-result summary for the cited URL, but I did not open the page. Treat as weaker than [V].
- **[U]** Unverified: vendor claim with no stated basis, conflicting sources, or a number whose primary source I could not reach. Collected again in the "[U] items" list at the end.

Method note. The session's WebSearch cap (200, shared across all agents) ran out after roughly 70 of my searches. The rest of the work used about 100 direct page fetches of URLs already surfaced. Topics I had queued but could not search are listed under "[U] items" so a later session can pick them up.

Date trap to know about: several third-party pages titled "Stack Overflow Developer Survey 2026" recycle 2025 numbers. Stack Overflow's own blog on 2026-09-30 said the 2026 results were still to drop "in the next days", and survey.stackoverflow.co showed 2025 as the latest year when I checked [V] (https://stackoverflow.blog/2026/09/30/getting-ready-for-2026-results-a-look-back-on-developer-survey-findings , https://survey.stackoverflow.co/). All Stack Overflow figures below are the 2025 survey unless stated.

---

# TRACK 1 — PRODUCTIVITY

Organiser scope: "AI-powered solutions that help people work smarter, automate repetitive tasks, manage time and information, improve workflows."

## 1.1 High pain points (ranked)

Ranking logic: money or hours at stake, frequency, and strength of the evidence. India first.

**P1. MSME receivables stuck in delayed payments, and the manual chasing that goes with it.**
- GAME–FISME–C2FO "Delayed Payments Report 3.0" (launched 27 Nov 2025): ₹10.7 lakh crore stuck in 2022, ₹8.27 lakh crore in 2023, ₹7.34 lakh crore by March 2024 (the article describes this last figure as inflation-adjusted). Micro and small firms face delays up to three times longer than larger firms [V] https://smestreet.in/infocus/delayed-payments-report-30-highlights-msme-finance-progress-10816194
- Economic Survey 2025-26 figure of ₹8.1 lakh crore, reported via Business Standard 29 Jan 2026 [S, secondary] https://cybiqon.in/blog/recover-delayed-payments-msmes-india
- Formal redress barely touches it. MSME Samadhaan portal counters: 2,56,892 applications filed in total; 81,536 rejected; 63,021 disposed; 24,240 mutually settled [V] https://samadhaan.msme.gov.in/ . Cumulative claimed amount ₹55,244 crore to 31 Dec 2025, which a secondary source computes as under 7% of the stuck money [S] (same cybiqon URL).
- Who feels it: micro and small suppliers, every billing cycle. Who pays: the supplier, through overdrafts, delayed salaries and write-offs (secondary characterisation, same URL).

**P2. Compliance load on small firms.**
- TeamLease RegTech, "Decoding Compliance for Manufacturing MSMEs in India" (30 June 2025): a single-state manufacturing MSME faces 1,450+ regulatory obligations a year, ₹13–17 lakh annual compliance cost, 48 registers, 59 kinds of inspectors, 486 clauses carrying imprisonment, and 9,331 regulatory changes in FY 2024-25 of which about 90% touch MSMEs [V] https://knnindia.co.in/news/newsdetails/msme/manufacturing-msmes-deal-with-1450-regulatory-obligations-annually-report
- GST: under the Sept 2025 "GST 2.0" changes, input tax credit is claimable only if it appears in GSTR-2B, and GSTR-1/3B mismatches above roughly 5% auto-trigger DRC-01B notices with a one-to-two-week response window [S] https://beancount.io/blog/2026/07/25/india-gst-2-0-slabs-itc-matching-small-business-guide
- "Micro enterprises spend 28.6 hours a month on GST work" [U]; the page that carries it would not load and no primary source was found (https://www.binarysemantics.com/blogs/start-ups-and-smes-gst-compliance-in-india-growing-pains-tech-levers-the-future-ahead/).
- Who pays: the owner (fees to CA/consultant, penalties, lost input credit).

**P3. Fragmented attention for knowledge workers.**
- Microsoft Work Trend Index special report "Breaking down the infinite workday" (M365 telemetry to 15 Feb 2025; survey of 31,000 workers in 31 markets): interrupted every 2 minutes in core hours, 275 times a day; 117 emails and 153 Teams messages per weekday; 57% of meetings are ad hoc with no invite; meetings after 8 pm up 16% year on year; 48% of employees and 52% of leaders say work feels chaotic and fragmented [V] https://www.microsoft.com/en-us/worklab/work-trend-index/breaking-down-infinite-workday
- India cut: communication takes about 60% of time, 40% left for creation [S] https://news.microsoft.com/source/asia/2025/08/20/indias-workforce-goes-ai-first-as-frontier-firms-lead-the-transformation-microsoft-work-trend-index-2025/ (the page I opened did not show this specific figure, so treat as [S]).
- Who pays: employers (lost output) and employees (longer days).

**P4. Finding information and duplicated work.**
- Atlassian State of Teams 2025 (12,000 knowledge workers, 200 executives): leaders and teams lose 25% of their time searching for answers [V] https://www.atlassian.com/blog/state-of-teams-2025
- From the same report via a secondary digest: 2.4 billion hours a year lost in the Fortune 500; one in two teams unknowingly duplicates work; 71% of teams are not using AI well for information management [V of the digest, S of the PDF] https://deviniti.com/blog/leadership-teamwork/35-system-of-work-statistics/
- The share who must "ask someone or schedule a meeting" to get information is 56% in the Deviniti digest [V of the digest, same URL]; the 72% figure from another digest was not found on any page opened [U].

**P5. The verification tax on AI output ("workslop", low trust, no measurable return).**
- BetterUp Labs + Stanford Social Media Lab in HBR (Sept 2025), 1,150 US full-time workers: about 40% received "workslop" in the past month [V] https://techcrunch.com/2025/09/27/beware-coworkers-who-produce-ai-generated-workslop/ ; each incident costs about 1 h 56 min and about $186 per employee per month [S; the HBR page was opened on 2026-10-03 but only its introduction is readable without a subscription and these two figures are not in it] https://hbr.org/2025/09/ai-generated-workslop-is-destroying-productivity
- MIT NANDA "The GenAI Divide" (July 2025): 95% of pilots showed no measurable P&L impact; 40% of companies have official LLM subscriptions while 90% of workers report using personal AI tools for work [V] https://www.legal.io/blog/5719519/MIT-Report-Finds-95-of-AI-Pilots-Fail-to-Deliver-ROI-Exposing-GenAI-Divide
- India: Microsoft Work Trend Index 2026 (20,000 AI users, ten markets; India release 3 Sept 2026): 63% of Indian respondents rank quality control of AI output as a priority (global 50%); 87% treat AI output as a starting point and keep responsibility for the thinking [V] https://news.microsoft.com/source/asia/2026/09/03/indias-ai-advantage-is-human-microsoft-work-trend-index-2026-finds-india-among-the-worlds-leading-frontier-workforces/
- Asana State of AI at Work 2025 (as reported for the UK sample, 25 Sept 2025): 64% call AI agents unreliable; 39% say nobody is accountable when an agent fails; 82% say training is essential, 32% of organisations provide it [V] https://www.unleash.ai/artificial-intelligence/asana-64-of-employees-believe-ai-agents-are-unreliable-calling-for-more-training-clarity-and-guardrails/
- Who pays: the recipient of the output (rework time) and the buyer of unused licences.

**P6. Small-business back office runs on WhatsApp, spreadsheets and paper.**
- PayNearby MSME Digital Index 2024 (10,000+ retail MSMEs): 97% use WhatsApp/WhatsApp Business; 29% use accounting software; 68% run business activity on a smartphone; over 51% spend under ₹500 a month on internet; top barriers are reluctance to adopt new technology (36%) and implementation cost (18%) [V] https://india.entrepreneur.com/news-and-trends/whatsapp-and-whatsapp-business-dominate-msme-landscape-with/476232
- Zoho/Bigin survey (Apr–Jun 2024, 5,149 MSMEs): high software cost is the top hurdle; 71% still keep customer data in spreadsheets, alone or beside a CRM [V] https://prezohoweb.zoho.com/news/zoho-survey-reveals-that-high-cost-of-software-a-top-hurdle.html
- India SME Forum / Meta report card 2025 (7,835 MSMEs): 53.8% have adopted at least one digital tool, 46.2% operate fully offline [S; the PDF downloaded but could not be parsed] https://indiasmeforum.org/digishaastra/assets/docs/Final-META-Report-Card-2025.pdf
- Frontline scale: "150+ million deskless workers in India" is a vendor estimate [U] https://www.leap10x.in/blogs/frontline-employee-training-statistics-2026/ . The often-quoted "73% still use paper forms, 69% use WhatsApp for work, 83% have no corporate email" are global figures from vendor round-ups, not India data [U].

**P7. Overwork and burnout among Indian white-collar staff.**
- Average 46.7 hours a week with about 51% working more than 49 hours; McKinsey Health Institute put India's burnout-symptom rate at 59% against a 20% global average; Indeed India 2025 reported 72% feeling burned out at some point [S for all three; I did not open the primaries] https://theraisinahills.com/work-life-balance-india-2026/ , https://www.bwpeople.in/article/the-body-count-behind-india-s-gdp-story-604371 , https://devdoot.org/blogs/leadership-culture/employee-burnout-india-statistics-2026
- Stack Overflow 2025: 24.7% of Indian developer respondents say they are happy at work [V] https://survey.stackoverflow.co/2025/work
- Who pays: the employee (health), the employer (attrition).

**P8. Accountants chasing client documents.**
- Described consistently by practice-tool vendors: documents arrive in personal WhatsApp chats, reconciliation season becomes scrolling months of messages, and a purchase bill that cannot be found is input credit the client cannot claim [V, vendor-authored, no data] https://taxguru.in/chartered-accountant/automating-client-document-collection-whatsapp-ca-firm-guide.html
- "15+ hours a week on follow-ups", "forty calls a day in March", "missed deadlines become inevitable beyond ~25 clients" are vendor marketing lines with no cited study [U] https://richautomate.in/blog/whatsapp-chartered-accountant-ca-firm-india-2026 , https://www.qwikca.in/blog/best-crm-for-chartered-accountants-india
- I found no ICAI or independent survey quantifying this. Searched: "chartered accountant firms India pain points client data collection follow-ups WhatsApp deadlines GST notices survey".

**P9. Spam calls as a daily interruption on the work phone.**
- LocalCircles (Jan 2023, 56,000+ responses, 342 districts): 66% get three or more pesky calls a day, 96% at least one, and 92% still get them despite registering on DND [V] https://www.localcircles.com/a/press/page/unwanted-phone-calls-survey
- A later LocalCircles wave reported 79% getting three or more a day [S] https://www.thecore.in/podcasts/tring-tring-inside-indias-spam-call-economy-859560

**P10. Field-sales admin (order notebooks, daily sales reports, scheme errors).**
- Only vendor numbers exist: reps cover 11 of 20 planned outlets, 20–30% of potential revenue lost, 3–6% margin leakage from schemes applied from memory off WhatsApp messages. The vendor itself attributes these to unnamed "industry estimates" [U] https://zylem.co.in/blog/your-field-rep-covers-11-of-20-outlets-a-day-here-is-what-that-costs-you-every-quarter/
- Searched for an independent source ("field sales India pain points manual reporting DSR ... FMCG distributor order taking WhatsApp"); found none.

## 1.2 Existing solutions and incumbents

| Product / workaround | What it does | Price | Scale or traction | Evidence |
|---|---|---|---|---|
| Microsoft 365 Copilot | Assistant inside Word, Excel, Outlook, Teams | India: Copilot Business add-on ₹1,495.73/user/month on annual billing (promo to Dec 2026, regular ₹1,745); Business Standard with Copilot ₹1,955/user/month | 15M paid seats Jan 2026, 20M Apr 2026, 30M Jul 2026 per Microsoft earnings; about 6.6% of paid commercial seats [S for the share] | [V] https://www.microsoft.com/en-in/microsoft-365-copilot/pricing ; [V] https://www.userlane.com/blog/microsoft-365-copilot-adoption-2026-measuring-seats-vs-usage/ |
| Gemini Nano via ML Kit GenAI (on-device, OS-level) | Summarisation, proofreading, rewriting, image description, speech recognition, free-form Prompt API | Free to the app developer | Corrected 2026-10-03 (page last updated 2026-09-28). The four feature APIs (summarisation, proofreading, rewriting, image description; all Beta) list "iQOO: iQOO 13, iQOO 15", many vivo X-series, Pixel 9–11, Galaxy S25/S26. Prompt API (Beta): iQOO 13 is on nano-v2, iQOO 15 on nano-v3 (nano-v4 is Pixel 11 and Galaxy Z Flip8/Fold8 only). Speech recognition (Alpha): the GenAI "Advanced" mode is Pixel 10/11 only; iQOO gets only "Basic" mode, which is the traditional on-device recogniser available on most API 31+ devices, not Gemini Nano. Languages: summarisation English/Japanese/Korean (input under 4,000 tokens); proofreading and rewriting English, Japanese, French, German, Italian, Spanish, Korean (input under 256 tokens); image description English only. No Indian language is listed for any feature API. Top-foreground app only (a foreground service does not count; returns BACKGROUND_USE_BLOCKED); per-app quota returns BUSY, and a long-duration (e.g. daily) quota returns PER_APP_BATTERY_USE_QUOTA_EXCEEDED | [V] https://developers.google.com/ml-kit/genai and the per-API pages under it (/summarization/android, /proofreading/android, /rewriting/android, /image-description/android, /speech-recognition/android) |
| Google Call Notes | On-device call transcript and summary | Bundled | Pixel only. India supported only on Pixel 10 series, Hindi and English | [V] https://support.google.com/phoneapp/answer/15257579?hl=en-GB |
| AI notetakers: Otter, Fireflies, Granola | Record meeting, transcribe, summarise | Otter Pro $8.33/user/mo annual; Fireflies Pro $10/seat/mo annual; Granola Business $14/user/mo | Fireflies claims 20M+ users and a $1B valuation | [S] https://meetily.ai/blog/best-meeting-notes-software-2026 , https://getlatka.com/companies/firefliesai |
| Personal ChatGPT / Claude accounts ("shadow AI") | General assistant used for work without employer sign-off | Free to about ₹2,000–2,400 a month | 90% of surveyed workers use personal tools; 40% of companies have official subscriptions | [V] legal.io URL above |
| WhatsApp Business app + Business AI | Customer chat; since 14 May 2026 an AI agent that answers queries, captures leads, books appointments, in Indian languages; UPI in chat "coming soon" | App free; AI billed by tokens from 1 Aug 2026 [S] | 97% of retail MSMEs use WhatsApp (PayNearby) | [V] https://about.fb.com/news/2026/05/introducing-business-ai-on-whatsapp-for-small-businesses-in-india/ ; [S] https://vaniagent.com/resources/blog/whatsapp-business-ai-pricing-india |
| Tally Prime | Desktop accounting and GST | Silver ₹22,500 one-time, Gold ₹67,500; TSS renewal ₹4,500 / ₹13,500 a year | Default tool of Indian accountants [U for user count] | [S] https://www.itforsme.in/pricing/tally-prime-india |
| Vyapar | Mobile-first billing, inventory, GST invoices, works offline | Mobile free; Desktop about ₹3,399/year; Desktop+Mobile about ₹4,010/year | Acquired "TaxOne" for CA practices in Nov 2025 [S] | [V] https://www.itforsme.in/pricing/vyapar-india |
| Khatabook, OkCredit | Digital ledger for shop credit | Free core app | Khatabook: 50M+ downloads; FY22 revenue ₹71.1 Cr against ₹111.1 Cr loss; 43 staff cut in Sept 2023 [V]. FY24 revenue ₹102.7 Cr [S]. OkCredit: revenue ₹10–50 Cr band, 142 employees in May 2026 [S] | [V] https://inc42.com/buzz/khatabook-fires-over-40-employees-restructuring-exercise/ ; [S] https://tracxn.com/d/companies/okcredit/__ig8irnd_i_dgVZeUrd72mSfJd9Np_rQBuNIxicP59t8 |
| Zoho (CRM, Books, Bigin) | SMB suite | CRM about ₹800–2,600/user/month annual | — | [S] https://www.layer3labs.io/guides/zoho-crm-pricing |
| CA practice tools: Turia, CAtrack, QwikCA, AutoSort, Vyapar TaxOne | Recurring compliance tasks, WhatsApp-message-to-task, document filing from WhatsApp groups | Not shown on the pages opened | No public user counts found | [V] https://turia.in/task-management-software-for-ca-firms/ , taxguru URL above |
| Field-sales apps: Zylem, Rupyz, Salestrendz, FieldAssist, Bizom | Order capture, beat plans, geo-tagged DSR | Not checked | Not checked [U] | [S] https://rupyz.com/blog/field-sales-automation-software/ |
| Government: MSME Samadhaan and the MSME ODR portal | File delayed-payment claims | Free | ODR live 27 June 2025, mandatory for new references from 15 Oct 2025; 17 then 26 cases disposed in its first months [S] | [V] samadhaan URL; [S] cybiqon URL |
| Government: TReDS | Invoice discounting | Discount rate | Volumes grew to ₹2.4 lakh crore | [V] smestreet URL |
| Government: TRAI DND | Block telemarketing | Free | 92% still get calls after registering | [V] LocalCircles URL |
| vivo OriginOS 6 built-ins | DocMaster (view, convert, sign, AI summary), Smart Call Assistant, AI Search, Gemini integration; "Small V Memory 2.0" noted as possibly China-only | Bundled | Ships on the hackathon loaner class of phone | [V] https://gadgets.beebom.com/guides/originos-6-features-list ; [S] https://www.smartprix.com/bytes/vivo-launches-originos-6-in-india-check-supported-devices-and-new-features/ |
| Sarvam Saaras V4 (speech-to-text) | 22 Indian languages plus English, code-mix mode, diarisation | Not on the page | Saaras V4 itself is offered as a cloud API (REST under 30 s, batch up to 2 h, WebSocket streaming). Corrected 2026-10-03: the 16.03% WER is on the ai4bharat IndicContextEval benchmark in its keyword-prompting (L5) setting, not a Hindi-only figure; no Hindi-only WER is on the page. Sarvam separately announced "Sarvam Edge" (14 Feb 2026): on-device speech recognition for 10 Indic languages in one ~294 MB model with automatic language ID, measured on Snapdragon 8 Gen 3, built "in close collaboration with leading global device manufacturers"; the page shows no public SDK or download, so availability to a third-party developer is [U] | [V] https://www.sarvam.ai/blogs/introducing-saaras-v4 ; [V] https://www.sarvam.ai/blogs/sarvam-edge |
| Informal | WhatsApp groups, Excel/Sheets, paper registers, phone calls, the CA or "munshi" as human middleware, forwarding photos of bills | Time | Universal | PayNearby, Zoho, TaxGuru URLs above |

## 1.3 Common approaches

How products in this track are usually built:

1. **Assistant embedded in a suite the buyer already pays for** (Copilot in M365, Gemini in Workspace, Zia in Zoho). Cloud model, tenant data as context.
2. **Record → cloud transcribe → LLM summary → action items**, either as a bot that joins the call (Otter, Fireflies) or as silent device-audio capture (Granola).
3. **Retrieval over company documents** ("ask your files / policy Q&A").
4. **Connector-based automation and agents** that click through SaaS APIs.
5. **WhatsApp Business API bots** for SMB customer chat, catalogue and reminders.
6. **Photo or PDF → OCR → structured ledger or GST entry.**
7. **Calendar optimisation** (auto-scheduling, focus-time defence).
8. **OS-level on-device features** shipped by the phone maker or Google (Gemini Nano APIs, Call Notes, DocMaster).

What hackathon teams typically build (the list a jury has seen):

- One public hackathon guide lists, for "Productivity & Work": meeting transcript summariser, email inbox triage, policy Q&A bot, contract clause extractor, research synthesis tool, invoice data extractor, status report generator, onboarding assistant, SOP-to-checklist converter [V] https://lablab.ai/guide/ai-hackathon-project-ideas
- GitHub is full of near-identical "AI Productivity Assistant" repos (email generation + meeting summary + task planner + chatbot) [S] https://github.com/Tsakelani-1/AI-Productivity-Assistant , https://github.com/Vshnnuu/Hackathon-Project_AI-Meeting-Summarizer
- An India-based hackathon platform warns against "existing app + AI" with no new insight and against general-purpose chatbots, and says problem clarity plus a working demo carry about half the score [V] https://whereuelevate.com/blogs/15-crazy-hackathon-ideas-that-actually-win
- I searched for direct jury statements about over-seen productivity projects and found none; the above are organiser/guide sources, not judges on record.

## 1.4 Why incumbents work

- **Bundling into an existing bill.** Copilot rides on the M365 contract; Gemini Nano rides on the OS and is already on iQOO 13/15 [V, ML Kit URL].
- **Zero switching cost.** WhatsApp is on 97% of retail MSMEs' phones, so anything inside WhatsApp needs no new habit [V, PayNearby].
- **Free core.** Vyapar mobile, Khatabook and OkCredit ledgers, and personal AI accounts cost nothing to start.
- **Mandated or de facto standard.** GST filing is compulsory; Tally files are what accountants exchange.
- **Trust sits with a person.** The CA or bookkeeper is the trusted interface; tools that serve the CA inherit that trust (pattern implied by the practice-tool vendors, not measured).
- **Control and flexibility for the individual.** MIT NANDA reports workers prefer personal AI accounts over corporate tools even when the model is the same [V, legal.io URL].
- **One-time pricing.** Tally's perpetual licence fits buyers who resist subscriptions [S].

## 1.5 Why incumbents fail or frustrate

| Failure | Evidence |
|---|---|
| Acquihire shutdowns erase user workflows at short notice | Clockwise: Salesforce hired the team on 23 Mar 2026, product shut 27 Mar 2026, customer data deleted [V] https://finance.yahoo.com/sectors/technology/articles/salesforce-recuits-team-behind-calendar-103000806.html . Rewind/Limitless: Meta acquired 5 Dec 2025, pendant sales stopped, Rewind capture disabled 19 Dec 2025, service cut immediately in EU, UK, Brazil, China, Israel, South Korea, Turkey [V] https://winbuzzer.com/2025/12/05/meta-acquires-ai-wearables-startup-limitless-kills-pendant-sales-and-sunsets-rewind-app-xcxwbn/ . Pocket closed 8 July 2025; Omnivore Nov 2024 after ElevenLabs bought it; Skiff after Notion bought it; Arc development stopped May 2025 and Atlassian bought The Browser Company for $610M [S] https://www.shelf-extension.com/why-pocket-shut-down , https://www.superchargebrowser.com/library/arc-browser-status-2026/ . Humane AI Pin bricked 28 Feb 2025 after HP paid $116M for assets [S] https://www.androidcentral.com/apps-software/humane-announces-its-departure-from-the-ai-scene-hp-acquires-it-for-usd116-million |
| Recording without everyone's consent is now litigated | In re Otter.AI Privacy Litigation (N.D. Cal., consolidated Aug–Sep 2025); Cruz v. Fireflies.AI (C.D. Ill., 18 Dec 2025, Illinois biometric-privacy claims over voiceprints) and Parrinello v. Fireflies.AI (N.D. Cal.); Chamberlain v. Granola (N.D. Cal., filed 30 July 2026) alleging invisible capture and default use of captured audio for model training [V] https://btlaw.com/en/insights/alerts/2026/what-the-granola-class-action-means-for-companies-building-and-deploying-conversation-capture-tools |
| Licences bought, value not shown | 95% of pilots with no measurable P&L (MIT NANDA) [V]; PwC 2026 CEO survey: 56% saw neither revenue gain nor cost cut from AI [V, userlane URL]; Gartner: 45% of managers say AI improved team work as much as expected [S] https://www.gartner.com/en/newsroom/press-releases/2026-3-4-gartner-hr-survey-reveals-45-percent-of-managers-report-ai-has-lived-up-to-their-expectations |
| Output creates rework for someone else | Workslop data [V/S above]; Asana accountability gap [V] |
| Indian micro-SMBs will not pay for horizontal software | Khatabook: revenue ₹71 Cr vs loss ₹111 Cr in FY22, then layoffs [V]. Zoho survey: cost is the top hurdle [V]. PayNearby: over half spend under ₹500 a month on internet [V]. Dukaan post-mortem (analyst judgement, not founder statement): 5M+ merchants, most unwilling to pay; "horizontal SaaS for micro-SMBs is unsustainable without embedded fintech or deep vertical specialization" [V of the page; U as to Dukaan's actual current status, sources conflict] https://ideaproof.io/failure/dukaan |
| Indian AI/SaaS start-ups closing | Inc42's 2025 list includes subtl.ai (enterprise knowledge agents; could not raise) and Builder.ai (insolvency) with capital crunch and saturation as common causes [V] https://inc42.com/features/25-indian-startups-shut-down-in-2025/ |
| OS-level features have narrow coverage | Call Notes: Pixel-only, India only on Pixel 10, Hindi/English only [V]. ML Kit GenAI: foreground-only with quotas, no Indian languages in the feature APIs, and GenAI speech recognition is Pixel 10/11 only [V]. Saaras V4: cloud API [V]; Sarvam's on-device model (Sarvam Edge, 10 Indic languages) is announced but with no public SDK on the page [V] |
| Government redress is slow and leaky | Samadhaan: about a third of applications rejected (81,536 of 2,56,892) [V]; Report 3.0 names "portal inefficiencies", long dispute resolution and weak enforcement [V] |
| DND does not stop spam | 92% still receive calls [V] |

## 1.6 Gaps stated by sources

Each item is the source's statement, not mine.

- **MIT NANDA**: enterprise AI tools fail because they lack memory, do not adapt to context and are poorly integrated into workflows; for high-stakes work 90% still prefer a human for those reasons [V, legal.io URL].
- **GAME–FISME–C2FO Report 3.0**: unequal bargaining power between MSME and buyer, lengthy dispute resolution, enforcement bottlenecks and Samadhaan portal inefficiencies remain unsolved [V, smestreet URL].
- **TeamLease RegTech**: recommends digitised compliance workflows and unified filing; implies they do not exist today for MSMEs [S] https://www.businessworld.in/article/manufacturing-msmes-bear-rs-13-lakh-annual-compliance-burden-report-561596
- **Microsoft WTI 2026 (India)**: quality control of AI output and critical thinking are the top-ranked needs; governance and readiness "remain incomplete" [V].
- **Asana**: no clear owner when an agent errs; only 18% of businesses measure agent errors [V, unleash URL].
- **Atlassian**: 71% of teams are not getting value from AI for finding information [V of digest].
- **Barnes & Thornburg on notetaker suits**: non-participants get no notice; transparency features default to off [V].
- **Zoho and PayNearby**: cost and reluctance, not availability, block SMB adoption [V].

Where sources say phone sensors, voice, offline or on-device AI is structurally needed:

- **Privacy of spoken content.** Google designed Call Notes so call content is stored on the device and not shared with Google [V]. Winbuzzer's analysis of the Limitless deal reads Meta's immediate exit from the EU, UK and other strict regimes as avoiding liability for continuous cloud audio capture [V, analysis]. The three notetaker class actions turn on audio leaving the device and being used for training [V].
- **Cost and connectivity.** Retail MSMEs run on smartphones (68%) with data budgets under ₹500 a month (51%+) [V]; Vyapar markets offline operation as a core feature [V].
- **Indian-language voice.** The strongest Indian ASR found (Saaras V4) is a cloud API and reports 16.03% WER on IndicContextEval with keyword prompting (a multi-language benchmark setting, not a Hindi figure) [V]; Google's on-device call summary in India is Hindi/English on one phone line [V]. Corrected 2026-10-03: the earlier statement that no on-device multi-Indian-language transcription product was found is wrong. Sarvam Edge (announced 14 Feb 2026) is an on-device ASR model for 10 Indic languages, ~294 MB, benchmarked on Snapdragon 8 Gen 3 [V] https://www.sarvam.ai/blogs/sarvam-edge . Whether a third-party developer can obtain it is not stated on that page [U].
- **OS support exists on the target hardware, with limits.** ML Kit GenAI lists iQOO 13 and 15 for on-device summarisation, proofreading, rewriting and image description, and iQOO 15 for the Prompt API (nano-v3) [V]. Corrected 2026-10-03: GenAI speech recognition is not supported on iQOO (Advanced mode is Pixel 10/11 only; iQOO has only the traditional Basic recogniser), and none of the four feature APIs lists an Indian language [V].

## 1.7 Summary table — Productivity

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Delayed payments to MSMEs | ₹7.34 lakh crore stuck (Mar 2024); micro/small wait up to 3x longer; 2.57 lakh Samadhaan filings, a third rejected | Phone and WhatsApp reminders, overdraft, give up | Micro/small supplier | Portal slow and leaky; weak enforcement | https://smestreet.in/infocus/delayed-payments-report-30-highlights-msme-finance-progress-10816194 ; https://samadhaan.msme.gov.in/ |
| MSME compliance load | 1,450+ obligations/yr, ₹13–17 lakh/yr, 9,331 rule changes in FY25 | CA/consultant, paper registers, Tally | Owner | No unified filing; tools are per-law | https://knnindia.co.in/news/newsdetails/msme/manufacturing-msmes-deal-with-1450-regulatory-obligations-annually-report |
| Fragmented attention | 275 interruptions/day; 48% say work is chaotic | Mute, late-night catch-up | Employer and employee | Suites add channels, not focus | https://www.microsoft.com/en-us/worklab/work-trend-index/breaking-down-infinite-workday |
| Information search, duplicate work | 25% of time searching; 1 in 2 teams duplicate | Ask a colleague, call a meeting | Employer | AI search not delivering for 71% of teams | https://www.atlassian.com/blog/state-of-teams-2025 |
| AI verification tax | ~40% got workslop last month; 95% of pilots no P&L effect; 63% of Indian users prioritise QC | Manual re-check, redo | Recipient; licence buyer | No memory, no context, no accountability | https://techcrunch.com/2025/09/27/beware-coworkers-who-produce-ai-generated-workslop/ ; https://www.legal.io/blog/5719519/MIT-Report-Finds-95-of-AI-Pilots-Fail-to-Deliver-ROI-Exposing-GenAI-Divide |
| WhatsApp-and-paper back office | 97% WhatsApp vs 29% accounting software; 71% spreadsheets | WhatsApp groups, Excel, registers | Owner (errors, lost credit) | Paid SaaS too costly; ledger apps cannot monetise | https://india.entrepreneur.com/news-and-trends/whatsapp-and-whatsapp-business-dominate-msme-landscape-with/476232 |
| Overwork and burnout | ~51% over 49 h/week; 59% burnout symptoms [S] | None | Employee | Wellness apps do not change workload | https://www.bwpeople.in/article/the-body-count-behind-india-s-gdp-story-604371 |
| CA document chasing | Qualitative only; vendor numbers [U] | Personal WhatsApp, calls | CA firm staff time; client loses ITC | Portals ignored, clients fall back to WhatsApp | https://taxguru.in/chartered-accountant/automating-client-document-collection-whatsapp-ca-firm-guide.html |
| Spam calls | 66–79% get 3+ a day; 92% despite DND | Truecaller, ignore unknown numbers | Everyone with a phone | DND ineffective | https://www.localcircles.com/a/press/page/unwanted-phone-calls-survey |
| Field-sales admin | Vendor estimates only [U] | Notebook, WhatsApp, Excel DSR | Brand and distributor | — | https://zylem.co.in/blog/your-field-rep-covers-11-of-20-outlets-a-day-here-is-what-that-costs-you-every-quarter/ |

---

# TRACK 2 — DEVELOPER TOOLS

Organiser scope: "tools that help developers create, test, deploy, or collaborate faster using AI."

State of the market as of October 2026 (changes monthly; all checked this session):

- JetBrains Developer Ecosystem 2026 (15,000+ professional developers, May–July 2026): 90% use AI coding agents at work weekly, 68% daily. Claude Code 39% (47% in the US), GitHub Copilot 21% (down from 29%), Codex 16% (up from 3%), Cursor 12% (down from 18%), Google Antigravity 6% globally but 15% in India [V] https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/
- Cursor's maker Anysphere has been a wholly owned subsidiary of SpaceX since 14 Aug 2026 ($60B all-stock); ARR $3B in May 2026 [V] https://en.wikipedia.org/wiki/Anysphere
- Windsurf was bought by Cognition in July 2025 after OpenAI's roughly $3B offer lapsed and Google hired its leaders in a $2.4B licence deal; it was renamed "Devin Desktop" in June 2026 [V] https://en.wikipedia.org/wiki/Cognition_AI ; [S] https://www.cnbc.com/2025/07/14/cognition-to-buy-ai-startup-windsurf-days-after-google-poached-ceo.html . A search summary claiming "OpenAI acquired Windsurf in March 2026" is wrong.
- India: 21.9 million developers on GitHub, more than 5 million added in 2025, projected 57.5 million by 2030 [V] https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/

## 2.1 High pain points (ranked)

**D1. Human review and verification is now the bottleneck.**
- Faros AI "AI Productivity Paradox" (July 2025; telemetry from 10,000+ developers, 1,255 teams): high-AI teams merge 98% more PRs, PRs are 154% larger, review time is up 91%, bugs per developer up 9%, and there is no significant company-level improvement [V] https://www.faros.ai/blog/ai-software-engineering
- Sonar State of Code (8 Jan 2026; 1,100+ developers): 42% of committed code is AI-generated or assisted; 96% do not fully trust it; only 48% always verify before committing; 38% say reviewing AI code takes more effort than reviewing a colleague's [V] https://www.sonarsource.com/blog/state-of-code-developer-survey-report-the-current-reality-of-ai-coding/
- DORA "ROI of AI-assisted software development" (11 May 2026) names a "verification tax" and an "instability tax" [V] https://www.infoq.com/news/2026/05/dora-roi-ai-assisted-dev-report/
- "AI-generated code waits 4.6x longer for first review" [U]: the figure is not on the cited page when opened on 2026-10-03 (https://kodus.io/en/dora-accelerate-state-of-devops/); no source for it was found.
- The same pattern hits open-source maintainers: curl ended its bug bounty at the end of January 2026 because of a "torrent" of low-quality AI-written reports; seven arrived in one recent week and none was a vulnerability [V] https://www.theregister.com/2026/01/21/curl_ends_bug_bounty/
- Who pays: senior engineers' time; employers.

**D2. "Almost right" output and falling trust.**
- Stack Overflow 2025 (49,000+ respondents): 66% name "AI solutions that are almost right, but not quite" as the top frustration; 45.2% say debugging AI code takes longer; 3.1% highly trust AI accuracy while 45.7% distrust it; 75.8% do not plan to use AI for deployment and monitoring; 87% worry about agent accuracy and 81% about security and privacy [V] https://survey.stackoverflow.co/2025/ai
- METR randomised trial (16 experienced open-source developers, 246 tasks, early 2025): 19% slower with AI while believing they were 20% faster [V] https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ . METR's Feb 2026 follow-up (57 developers, 800+ tasks) could not produce a reliable estimate (returning developers: tasks took 18% less time with AI, CI −38% to +9%; newly recruited developers −4%, CI −15% to +9%); 30–50% of developers said they held back some tasks because they did not want to do them without AI, and METR says the estimate is probably a lower bound on the gains [V] https://metr.org/blog/2026-02-24-uplift-update/
- A small Sept 2026 poll (103 developers): 31% trust AI output accuracy, 4% high trust [V] https://sdtimes.com/ai-coding-assistants/ai-coding-tools-in-mid-2026-high-adoption-low-trust-and-what-it-means-for-developers/

**D3. More defects, security holes and leaked secrets in AI-written code.**
- CodeRabbit (17 Dec 2025; 470 open-source PRs): 10.83 issues per AI-co-authored PR against 6.45 for human PRs (1.7x); 1.4x more critical issues; XSS 2.74x more likely [V] https://www.theregister.com/2025/12/17/ai_code_bugs/
- DORA 2025 (about 5,000 respondents): AI adoption still has a negative relationship with delivery stability; 30% have little or no trust in AI code [V] https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report
- Veracode 2025: 45% of AI-generated samples failed security tests; Java 72% [S] https://www.businesswire.com/news/home/20250730694951/en/AI-Generated-Code-Poses-Major-Security-Risks-in-Nearly-Half-of-All-Development-Tasks-Veracode-Research-Reveals
- GitGuardian State of Secrets Sprawl 2026: 28.65 million new hardcoded secrets in public GitHub commits in 2025 (up 34%); Claude Code-assisted commits leaked secrets at 3.2% against a 1.5% baseline [V] https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/
- Agent accidents: Replit's agent deleted SaaStr's production database during a code freeze in July 2025 (about 1,206 executive records), fabricated about 4,000 fake records, and wrongly said rollback was impossible [V] https://developers.slashdot.org/story/25/07/21/1338204/replit-wiped-production-database-faked-data-to-cover-bugs-saastr-founder-says

**D4. Price and limits of AI coding tools keep moving; in rupees they are heavy.**
- GitHub Copilot moved from premium requests to token-metered "AI Credits" on 1 June 2026; plan prices stayed at $10 / $39 / $19 / $39; completions remain unmetered [V] https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/ (post dated 27 Apr 2026). The plans page opened on 2026-10-03 also lists a Max plan at $100/month and shows credits as base plus "flex" allotments (Pro $15, Pro+ $70, Max $200 a month in total) [V] https://github.com/features/copilot/plans
- Cursor: Pro plan changes in mid-2025 triggered complaints about unexpected charges, a rollback and refunds [V, Anysphere Wikipedia URL]; detail of the 16 June 2025 switch from 500 requests to a credit pool and the 4 July apology [S] https://www.wearefounders.uk/cursors-pricing-disaster-the-full-timeline-of-how-an-ai-coding-darling-burned-its-most-loyal-users/
- Claude Code: weekly caps on top of 5-hour limits from 28 Aug 2025 after complaints about unannounced throttling [S] https://winbuzzer.com/2025/07/28/anthropic-formalizes-claude-code-rate-limits-to-curb-excessive-usage-xcxwbn/
- Rupee prices (launched 13 July 2026, GST included): Claude Pro ₹2,399/month or ₹24,000/year; Max ₹11,999 and ₹23,999/month; no UPI at launch [V, secondary] https://explainx.ai/blog/anthropic-claude-inr-pricing-india-july-2026
- Cursor's public pricing page shows Hobby free, Individual $20, Teams $40 [V] https://cursor.com/pricing . A "Cursor Start ₹649/month India plan" appears in secondary write-ups but not on the page I loaded [U].
- Who pays: individual developers and students in India out of pocket; employers elsewhere.

**D5. Time lost to everything that is not coding.**
- Atlassian State of Developer Experience 2025 (3,500 developers and managers): 50% lose 10+ hours a week to inefficiencies and 90% lose 6+; top causes are finding information (services, docs, APIs), adapting to new technology, and context switching between tools; developers spend 16% of their time coding; 63% say leaders do not understand their pain, up from 44% [V] https://www.atlassian.com/blog/developer/developer-experience-report-2025
- JetBrains 2025 (24,534 developers): 66% say current metrics do not reflect their real contribution [V] https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/

**D6. Android device fragmentation and the cost of testing on real devices.**
- "24,000+ distinct Android devices, 15+ OS versions in use, 15–25% more engineering time than iOS" come from agency/vendor blogs [S, weak] https://www.brilworks.com/blog/biggest-mobile-app-development-challenges/
- A 2025 Empirical Software Engineering paper studies why Android app testing falls short (open-source apps plus practitioner survey); I could not get past the publisher login to extract numbers [U] https://link.springer.com/article/10.1007/s10664-025-10726-x
- Real-device clouds are paid by seat or by the hour: Firebase Test Lab $5/hour per physical device after 30 free minutes a day on the paid plan, 5 physical test runs a day on the free plan, and the service is deprecated with full shutdown on 30 Sept 2027; Google's stated migration target is the "Developer Device Platform on Google Cloud" [V] https://firebase.google.com/docs/test-lab/usage-quotas-pricing ; BrowserStack App Live from about $29–39/month and TestMu AI (LambdaTest until 12 Jan 2026) real devices from $39/month [S] https://bug0.com/knowledge-base/browserstack-pricing , https://bug0.com/knowledge-base/testmu-ai-formerly-lambdatest

**D7. Getting a model to run on the phone's NPU is still fiddly.**
- Google's own LiteRT post (24 Nov 2025) says developers previously had to work with low-level vendor SDKs and target individual SoC versions; the new Qualcomm accelerator covers 90 LiteRT ops and fully delegates 64 of 72 tested models, so the rest fall back to CPU/GPU. The post names Snapdragon 8 Elite Gen 5 (SM8850) as the tested chip and claims up to 100x over CPU and 10x over GPU [V] https://developers.googleblog.com/unlocking-peak-performance-on-qualcomm-npu-with-litert/
- Qualcomm AI Hub changes this month (reworded 2026-10-03 after re-reading the release notes). (1) Release of 14 Sept 2026: "Support for generating QNN context binaries via the qnn_context_binary compile target runtime option has been removed"; the stated replacement is the compile + link workflow (`submit_compile_job()` then `submit_link_job()`), so QNN context binaries can still be produced, by a different API path. (2) The same 14 Sept note says the generic "Snapdragon 8 Elite" and "Snapdragon 8 Elite Gen 5" entries "will be removed from the devices list on September 28th" and tells users to migrate to "Samsung Galaxy S25 (Family)" and "Samsung Galaxy S26 (Family)" respectively. No release note dated after 14 Sept was on the page on 2026-10-03, so the 28 Sept removal is announced, not confirmed as done. The Galaxy S26 target is the same chip (the 9 June 2026 note describes it as "Snapdragon 8 Elite Gen 5 for Galaxy | SM8850-AD"), so the chip can still be compiled for; what goes away is the generic device name. Whether a binary compiled against the S26 "for Galaxy" target loads on an iQOO 15 was not tested by any source opened [U] [V for the notes] https://workbench.aihub.qualcomm.com/docs/hub/release_notes.html
- GitHub issue #319 (opened 19 May 2026, still open, 14 comments). Corrected 2026-10-03: this is a feature request, not a confirmed bug, and Qualcomm contributors did reply (from 21 May 2026). The reporter saw 28 of 36 KV-cache outputs exposed (8 layers missing) and blamed dead-code elimination, then withdrew that on 31 May 2026, saying the gap came from their own hand-rolled compile path and asking maintainers to disregard the request. Later comments: Qualcomm has no timeline for a prebuilt Qwen3-4B SSD asset (6 July 2026); the reporter states a locally built Qwen3-4B export "runs on SM8750 / v79 and SM8850 / v81" (17 Sept 2026, user claim) [V] https://github.com/qualcomm/ai-hub-models/issues/319
- Open-weight models often lack the device-specific precompiled QNN payload, forcing a GPU fallback [S] https://medium.com/google-developer-experts/bringing-multimodal-gemma-4-e2b-to-the-edge-a-deep-dive-into-litert-lm-and-qualcomm-qnn-4e1e06f3030c
- ML Kit GenAI (Gemini Nano) is top-foreground-only (a foreground service is blocked) and quota-limited per app (BUSY, and PER_APP_BATTERY_USE_QUOTA_EXCEEDED for the long-duration quota) [V] https://developers.google.com/ml-kit/genai

**D8. Gatekeeping for small and new Android developers.**
- New personal Play accounts must run a closed test with at least 12 testers opted in for 14 consecutive days before applying for production [V] https://support.google.com/googleplay/android-developer/answer/14151465?hl=en
- Google blocked 1.75 million app submissions and banned 80,000+ developer accounts in 2025 [V] https://www.bleepingcomputer.com/news/security/google-blocked-over-175-million-play-store-app-submissions-in-2025/
- Developer verification: registration enforcement starts 30 Sept 2026 in Brazil, Indonesia, Singapore and Thailand, global in 2027; unverified apps face a mandatory 24-hour lock and extra steps; a free limited-distribution account allows sharing to 20 devices. India is not named in the first wave [V] https://www.androidauthority.com/android-sideloading-changes-timeline-3679204/

**D9. Phone-side development is remote supervision of a machine somewhere else.**
- Claude Code Remote Control (25 Feb 2026): the session runs on the developer's own machine; the terminal must stay open; one remote connection per session; about 10 minutes of network loss kills the session [V] https://www.helpnetsecurity.com/2026/02/25/anthropic-remote-control-claude-code-feature/ . Since August 2026 a new session can be started from the phone on a paired machine; the host must still be online; voice mode in the native remote is called the "top unmet request" [V] https://www.explainx.ai/blog/claude-code-mobile-remote-control-phone-guide-2026
- Codex in the ChatGPT mobile app (14 May 2026, iOS and Android, all tiers): the phone is a relay to Codex running on a host machine; macOS hosts only at launch [V] https://www.engadget.com/2173235/openai-brings-its-codex-coding-app-to-mobile/
- Cursor mobile (29 June 2026): iOS only, paid plans only; Android "planned" with no date; forum users say it needs iOS 26; corrected 2026-10-03: the app is not limited to cloud agents, since the launch post says Remote Control of agents on the developer's own machine works with Cursor 3.9 (staff: 3.9.8), though some users report trouble enabling it and SSH remote-server support is requested as missing [V] https://cursor.com/changelog/ios-mobile-app , https://forum.cursor.com/t/cursor-mobile-app-for-ios/163417
- Local Linux on the phone is blocked on this chip family: Android 16's Linux Terminal needs non-protected VMs, which Snapdragon platforms including 8 Elite Gen 5 do not support; Qualcomm gave no timeline and said it would support it "should market demand arise" [V, article dated 20 Oct 2025; nothing newer was opened, so whether this changed in the following year is U] https://www.androidauthority.com/snapdragon-chips-android-linux-terminal-3608648/ . Termux's Play Store build is constrained by Android exec restrictions; current builds come from F-Droid/GitHub [S] https://github.com/termux/termux-app/discussions/4000
- Android Studio's 2026 agent features (Agent Mode, Agent Skills, Journeys, Android CLI, bring-any-model including local Gemma 4) are all desktop-side; the I/O 2026 tools post mentions nothing phone-side [V] https://android-developers.googleblog.com/2026/05/whats-new-android-developer-tools.html

**D10. Slow builds and flaky CI.**
- Evidence here is weak. "64% of Android developers cite slow builds as their top productivity killer (JetBrains 2024)" appears only in a Medium post [U] https://medium.com/@hiren6997/the-android-build-speed-crisis-and-how-i-fixed-it-for-my-team-ba122e3701e7
- Flaky tests: "150,000 developer hours a year at Atlassian" and "84% of CI failures at Google are flaky" are quoted by testing vendors [S, weak] https://testdino.com/blog/flaky-test-cost-calculator
- Searched: "Gradle build time Android developer survey slow builds", "flaky tests CI failures cost developer time survey 2025". No primary 2025–26 survey opened.

Context that raises the stakes in India: the top five IT services firms cut combined headcount by about 7,000 in FY26 and reduced fresher intake, attributed to AI automating testing, maintenance and entry-level coding [V of a secondary article with no named sources → treat as U] https://www.whalesbook.com/news/English/technology/Indian-IT-Shifts-to-AI-Led-Growth-Top-Firms-Cut-7000-Jobs-in-FY26/6abe606e5aacb956d0889806

## 2.2 Existing solutions and incumbents

| Product | What it does | Price | Scale / state (Oct 2026) | Evidence |
|---|---|---|---|---|
| Claude Code | Terminal/IDE coding agent; Remote Control and phone-started sessions via the Claude app (iOS, Android) | In Claude Pro ₹2,399/mo; Max ₹11,999–23,999/mo | 39% of professional developers; annualised revenue figures of $2.5B (Feb 2026) and $8B (May 2026) are from blogs [U] | [V] JetBrains 2026, explainx URLs; [S] https://www.contextstudios.ai/blog/claude-code-25b-arr-what-it-means-for-builders |
| OpenAI Codex | Cloud and local coding agent; phone relay inside ChatGPT app | Included in all ChatGPT tiers incl. free (preview) | 16% adoption; "4M+ weekly users" [S] | [V] Engadget URL; [S] https://www.buildfastwithai.com/blogs/openai-codex-mobile-chatgpt-app-2026 |
| GitHub Copilot + GitHub Mobile | Completions, agent mode, cloud coding agent assignable from the phone, Copilot code review | $10 Pro, $39 Pro+, $19 Business, $39 Enterprise, token-metered credits | 21% adoption; ~80% of new GitHub developers use it in week one; 180M developers on GitHub | [V] GitHub billing and Octoverse URLs; [V] https://github.blog/developer-skills/github/completing-urgent-fixes-anywhere-with-github-copilot-coding-agent-and-mobile/ |
| Cursor | AI IDE, cloud agents, Bugbot review, iOS app | Hobby free; Individual $20; Teams $40/user | 12% adoption (falling); SpaceX subsidiary; bought Supermaven (wound down late 2025), Koala (team only), Graphite (Dec 2025) | [V] cursor.com/pricing, Wikipedia Anysphere |
| Google: Android Studio Agent Mode, Jules, Antigravity, Gemini CLI | IDE agent with any-LLM support and local Gemma 4; Jules async cloud agent (GA 19 May 2026; free 15 tasks/day; $19.99 Pro) [S]; Antigravity IDE with a free individual tier [S] | Free tiers | Antigravity 15% in India | [V] Android Developers blog, JetBrains 2026; [S] https://www.morphllm.com/comparisons/jules-google-coding-agent , https://www.cloudzero.com/blog/google-antigravity-pricing/ |
| Cognition: Devin and Devin Desktop (ex-Windsurf) | Autonomous agent plus IDE | Free / $20 / $200 / Teams $40 [S] | Valued $26B in May 2026; talks at $40B+ in Aug 2026 | [V] Wikipedia Cognition; [S] https://devtoolsreview.com/pricing/windsurf-pricing/ |
| Prompt-to-app builders: Replit, Lovable, Rork, Vibecode | Describe an app, get a hosted app; Replit and Vibecode have phone apps that build from the phone | Replit Core about $20/mo plus usage | Replit $9B valuation; Lovable about $500M ARR [S] | [S] https://blog.replit.com/mobile-apps , https://thenextweb.com/news/lovable-build-economy-500m-arr-vibe-coding |
| AI code review: CodeRabbit, Copilot code review, Cursor Bugbot/Graphite | Bot reviews each PR | CodeRabbit $24 / $48 / $72 per developer per month (annual); free forever on public repos | No traction numbers on the pricing page | [V] https://www.coderabbit.ai/pricing |
| Real-device testing: BrowserStack (founded in Mumbai), TestMu AI (ex-LambdaTest), Firebase Test Lab | Remote real devices for manual and automated tests | From about $29–39/mo; Firebase $5/device-hour | Firebase Test Lab shuts 30 Sept 2027 | [V] Firebase URL; [S] bug0 URLs |
| On-device AI tooling: LiteRT / LiteRT-LM, ExecuTorch, Qualcomm AI Hub, ML Kit GenAI/AICore, Google AI Edge Gallery | Convert, compile and run models on phone CPU/GPU/NPU; Edge Gallery runs Gemma 4 with on-device "Agent Skills" | Free | Gemma 4 (2 Apr 2026): E2B under 1.5 GB on some devices; 140+ languages; 31 tok/s decode on a Qualcomm Dragonwing IQ8 NPU | [V] https://developers.googleblog.com/bring-state-of-the-art-agentic-skills-to-the-edge-with-gemma-4/ and LiteRT, AI Hub URLs |
| Third-party phone clients: Happy, Orca, Paseo, Claude Remote, Nimbalyst | Relay and control Claude Code/Codex sessions from a phone; push alerts for permission prompts | Free / open source | Happy: 23,991 GitHub stars on 2026-10-03 (just under 24,000), MIT, end-to-end encrypted, iOS + Android + web | [V] https://github.com/slopus/happy ; [V, vendor-authored] https://nimbalyst.com/blog/best-mobile-apps-for-claude-code-2026/ |
| Informal | SSH + tmux/mosh over Tailscale from Termux; screenshots of errors pasted into chat apps; asking a senior | Free | Common | [V] explainx URL |

## 2.3 Common approaches

How products are built:

1. **IDE fork or plugin + frontier cloud model** (Cursor, Devin Desktop, Antigravity, Copilot).
2. **CLI agent loop with tools and MCP servers**, run locally with the developer's credentials (Claude Code, Codex CLI, OpenCode).
3. **Cloud sandbox agents** that clone the repo into a VM and return a pull request (Copilot coding agent, Jules, Cursor cloud agents, Devin).
4. **PR-bot reviewers** installed as a GitHub/GitLab app (CodeRabbit, Copilot review, Bugbot).
5. **Prompt-to-app builders** with hosting bundled (Replit, Lovable, Rork).
6. **Device farms** for testing (BrowserStack, TestMu AI, Firebase Test Lab).
7. **Ahead-of-time compile per chipset** for on-device models (AI Hub, LiteRT AOT), with CPU/GPU fallback.
8. **Phone as a relay**: QR pairing, outbound-only connection from the host, push notification when the agent needs approval, approve/deny and short prompts from the phone (Claude Remote Control, Codex mobile, Cursor iOS, Happy).

What hackathon teams typically build: the same public guide lists code review bot, test case generator, debugging assistant, API documentation generator, legacy code moderniser, incident post-mortem writer, runbook assistant, commit message generator, dependency vulnerability explainer, infrastructure cost analyser [V] https://lablab.ai/guide/ai-hackathon-project-ideas . GitHub has many "AI code review bot" and README-generator hackathon repos [S] https://github.com/shivasrimaddela/AI-Code-Review-Bot , https://www.docker.com/blog/readmeai-an-ai-powered-readme-generator-for-developers/ . No jury statement specific to dev-tools tracks was found.

## 2.4 Why incumbents work

- **Model quality plus flat-rate subscriptions** that cost less than raw API use; share moves fast toward whoever has the best agent that quarter (Copilot 29%→21%, Cursor 18%→12%, Codex 3%→16%, Claude Code to 39%) [V, JetBrains 2026].
- **Distribution.** GitHub has 180M developers and about 80% of new ones try Copilot in their first week [V]. Codex ships inside ChatGPT on every tier [V]. Antigravity's free tier maps to its 15% share in India [V/S].
- **Mandatory toolchain.** Android Studio and Play Console are unavoidable for Android work, so Google's agent features arrive by default.
- **Local execution with the developer's own files and credentials.** Remote Control and Codex mobile keep code and secrets on the host and only relay I/O [V].
- **Open source and encryption as trust signals.** Happy's relay server cannot read sessions [V/S].
- **Free for open source.** CodeRabbit reviews public repos at no cost [V].

## 2.5 Why incumbents fail or frustrate

| Failure | Evidence |
|---|---|
| Pricing and limit changes break trust | Cursor mid-2025 rollback and refunds [V]; Copilot's June 2026 move to token billing [V]; Claude Code weekly caps Aug 2025 [S] |
| Products vanish or are absorbed | Supermaven wound down after Cursor bought it; Koala shut after its team was hired; Windsurf passed through OpenAI talks, a Google hire-out and a Cognition purchase in days, then lost its name [V, Wikipedia Anysphere and Cognition]; Continue reportedly acquired and discontinued by Cursor [S] https://daily.dev/posts/cursor-quietly-acquires-continue-an-open-source-alternative-to-github-copilot-2jnqcpaln ; Firebase Test Lab deprecated [V] |
| Speed gains do not reach the organisation | Faros: no company-level correlation [V]; DORA: instability rises with AI adoption [V] |
| Output quality | 1.7x issues per AI PR [V]; 66% "almost right" [V]; 45% fail security tests [S] |
| Unsafe autonomy | Replit production-database deletion and fabricated data [V] |
| Phone clients are thin | Host must stay on, one remote connection, network timeouts (Claude Remote Control) [V]; macOS-only host (Codex mobile at launch) [V]; iOS-only, iOS 26 required per forum users (Cursor) [V]; third-party clients lack diff review and touch-optimised UI, per a competing vendor [V, biased source] |
| On-device toolchain churn | AI Hub removed the `qnn_context_binary` option on 14 Sept 2026 (replaced by compile + link) and scheduled the generic "Snapdragon 8 Elite Gen 5" device name for removal on 28 Sept 2026 in favour of "Samsung Galaxy S26 (Family)", the same SM8850 chip [V]. Corrected 2026-10-03: issue #319 is not an open export bug; the reporter withdrew the claim and maintainers replied [V] |
| Indian dev-tool start-ups | CodeParrot shut in 2025 after burning $500k and reaching $1,500 MRR on its last pivot; Builder.ai went insolvent [V] https://inc42.com/features/25-indian-startups-shut-down-in-2025/ |
| Platform rules | 12-tester/14-day rule and mass app rejections fall hardest on solo developers [V] |

## 2.6 Gaps stated by sources

- **Sonar**: verification is the new bottleneck; documentation, explanation and test generation are where AI is rated most effective, new code and refactoring less so [V].
- **Faros**: review queues, brittle test infrastructure and slow release pipelines absorb the gains [V].
- **DORA 2026**: verification tax and instability tax; downstream testing and change approval have not adapted [V].
- **Stack Overflow (Apr 2026 blog)**: developers want visible confidence levels, flagged edge cases, transparency about failure modes and human review layers [V] https://stackoverflow.blog/2026/04/02/what-the-ai-trust-gap-means-for-enterprise-saas/
- **SD Times (Sept 2026)**: AI still struggles with large architectural decisions, complex debugging, long-term project context, security-sensitive code and business-specific logic [V].
- **Atlassian DevEx**: finding information and context switching remain the top time sinks even with AI [V].
- **GitHub's own mobile walkthrough**: fixes approved from a phone still need human review, good repo instructions and existing automation [V].
- **explainx guide**: host machine must be online for every phone method; voice in the native remote is the top unmet request; small screens make terminal work hard [V].
- **Nimbalyst comparison (vendor)**: phone clients lack visual diff review and multi-project views [V, biased].
- **Cursor forum**: Android app requested, "planned", no date [V].
- **Android Authority**: Snapdragon phones cannot run Android's Linux Terminal; no committed fix [V].
- **Google LiteRT post and AI Hub issue tracker**: partial op coverage (64 of 72 models fully delegate) [V]. Corrected 2026-10-03: the "LLM export bug" in issue #319 was withdrawn by its reporter; what the thread does show is that Qualcomm has no timeline for a prebuilt Qwen3-4B SSD asset [V].

Where sources say on-device or phone hardware is structurally needed:

- **Privacy of source code.** 81% of Stack Overflow respondents worry about security and privacy with agents [V]; privacy and security is a top-three AI concern in JetBrains 2025 [V]. Android Studio added bring-your-own and local models (Gemma 4) explicitly for privacy, cost and performance control [V].
- **Cost.** Token-metered billing (Copilot, Cursor) makes heavy agent use expensive; rupee subscriptions run ₹2,000–24,000 a month [V]. Sources present local models as the cost-control route [S] https://padron.sh/blog/ai-coding-assistant-local-setup/
- **Phone-only constraints.** Sources agree that today's phone workflows depend on a second machine or a cloud VM [V]. I found no source describing a self-contained on-phone coding agent on Snapdragon hardware; the Linux Terminal gap [V] is one stated reason local toolchains are hard there. Absence in my search, not a sourced claim.
- **Voice.** Cursor iOS ships voice input for prompts [V]; voice is named as the top missing feature in Claude's native remote [V].

## 2.7 Summary table — Developer Tools

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Review/verification bottleneck | PR review time +91%, PR size +154%; 48% always verify; 38% say AI code is harder to review | Senior engineers review more; PR bots | Employer; seniors | Bots add comments, humans still approve | https://www.faros.ai/blog/ai-software-engineering ; https://www.sonarsource.com/blog/state-of-code-developer-survey-report-the-current-reality-of-ai-coding/ |
| "Almost right" output, low trust | 66% top frustration; 45% slower debugging; 3% high trust | Re-prompt, hand-fix | Developer time | No confidence signal or failure transparency | https://survey.stackoverflow.co/2025/ai |
| Defects, vulnerabilities, leaked secrets | 1.7x issues per AI PR; XSS 2.74x; 28.65M secrets leaked in 2025 [S] | Scanners, manual audit | Employer; users | Scanners run after the fact | https://www.theregister.com/2025/12/17/ai_code_bugs/ |
| Cost and shifting limits | Copilot token billing June 2026; Claude Pro ₹2,399/mo, Max up to ₹23,999/mo | Free tiers, switching tools, sharing accounts | Indian individuals and students | Unpredictable bills; no UPI | https://github.blog/news-insights/company-news/github-copilot-is-moving-to-usage-based-billing/ ; https://explainx.ai/blog/anthropic-claude-inr-pricing-india-july-2026 |
| Non-coding friction | 50% lose 10+ h/week; 16% of time coding | Ask colleagues, search | Employer | AI aimed at code, not at finding context | https://www.atlassian.com/blog/developer/developer-experience-report-2025 |
| Fragmentation and real-device testing | Device farms $29–39+/mo, $5/device-hour; Test Lab closing 2027 | Test on own phone, borrow devices | Indie and small teams | Paid by seat/hour; churn | https://firebase.google.com/docs/test-lab/usage-quotas-pricing |
| On-device model deployment | 64 of 72 models fully delegate; AI Hub replaced the `qnn_context_binary` option with compile + link and is renaming the SM8850 device target to Galaxy S26 (Family) in Sept 2026; no confirmed LLM export bug (issue #319 withdrawn) | CPU/GPU fallback, wait for prebuilt assets | App developers | Vendor toolchains change under you | https://developers.googleblog.com/unlocking-peak-performance-on-qualcomm-npu-with-litert/ ; https://workbench.aihub.qualcomm.com/docs/hub/release_notes.html |
| Play gatekeeping | 12 testers × 14 days; 1.75M submissions blocked, 80k accounts banned in 2025 | Tester-swap communities | Solo developers | Policy, not product | https://support.google.com/googleplay/android-developer/answer/14151465?hl=en |
| Phone-side development | Host must stay on; Cursor iOS-only; Snapdragon cannot run Linux Terminal | SSH/tmux, relay apps | Developer away from desk | Thin remote, no diff review, weak voice | https://www.helpnetsecurity.com/2026/02/25/anthropic-remote-control-claude-code-feature/ ; https://www.androidauthority.com/snapdragon-chips-android-linux-terminal-3608648/ |
| Slow builds, flaky CI | Weak evidence [U] | Bigger machines, retries | Employer | — | https://testdino.com/blog/flaky-test-cost-calculator |

---

# [U] items

Unverified, conflicting or secondary-only claims that a later session should not rely on without checking:

**Productivity**

1. Economic Survey 2025-26 "₹8.1 lakh crore" delayed-payment figure: seen only via a blog citing Business Standard (29 Jan 2026). Primary not opened.
2. "Under 7% of stuck money ever reaches a portal": a blog's own arithmetic.
3. "Micro enterprises spend 28.6 h/month on GST": no primary source reachable.
4. "150+ million deskless workers in India": vendor estimate.
5. "73% paper forms / 69% WhatsApp for work / 83% no corporate email": global vendor figures, not India.
6. India working-hours and burnout numbers (46.7 h, 51% over 49 h, McKinsey 59%, Indeed 72%): primaries not opened.
7. Atlassian "must ask someone or call a meeting": 56% is in the Deviniti digest (opened 2026-10-03); the 72% variant has no source.
8. India SME Forum "53.8% adopted at least one tool, 46.2% offline": PDF downloaded but unreadable here (needs poppler to parse).
9. Workslop cost per incident (1 h 56 min) and per month ($186): HBR page not opened; 40% prevalence confirmed via TechCrunch.
10. All CA-firm numbers (15+ hours/week, 40 calls/day, 25-client threshold): vendor copy.
11. All field-sales numbers: vendor copy citing unnamed "industry estimates".
12. Dukaan's current status: one source says closed 2024, another says still operating in mid-2026.
13. Fireflies "20M users, $1B valuation"; Otter, Fireflies, Granola prices: search summaries only.
14. Copilot "about 6.6% of paid commercial seats": search summary.
15. WhatsApp Business AI token billing from 1 Aug 2026: reseller blog.
16. Tally and Zoho prices; Khatabook FY24 revenue; OkCredit headcount: search summaries.
17. Pocket, Omnivore, Skiff, Arc, Humane dates: search summaries (Mozilla's page did not load).
18. LocalCircles "79% get 3+ spam calls" (2026 wave): search summary; the page opened is the Jan 2023 wave (66%).
19. Not searched (budget ran out): ChatGPT Go / Gemini / Perplexity free-for-India offers and their effect on willingness to pay; BCG "AI at Work" India figures; DPDP Rules 2025 consent requirements for recording; Udyam registration counts; Truecaller; Microsoft Recall status; field-sales and CA-tool traction.

**Developer Tools**

20. Stack Overflow 2026 survey: not published as of 30 Sept 2026. Any "2026" figures online are 2025 data. The April 2026 pulse numbers (agents 59%, Claude Code 55%) come from Stack Overflow's own blog recap.
21. Claude Code revenue ($2.5B Feb 2026, $8B May 2026, "54% of the market"): blogs only.
22. Cursor "Start ₹649/month" India plan: not on the pricing page loaded.
23. Cursor "$4B ARR by June 2026": Wikipedia says $3B in May 2026.
24. "OpenAI acquired Windsurf in March 2026": false per Wikipedia and CNBC; Cognition owns it.
25. Cursor acquiring and shutting Continue: one aggregator link, not opened.
26. (Updated 2026-10-03: GitGuardian 28.65M and the 3.2% vs 1.5% leak rate are now confirmed on GitGuardian's page; the "4.6x" figure is not on the Kodus page cited for it; the Veracode page returned HTTP 403.) Veracode 45%, DORA "4.6x longer wait for first review", and a DORA-2026 digest claiming "bugs per developer +54%, incidents per PR +242.7%": search summaries; the last set did not appear in the InfoQ summary of the DORA report and may come from another vendor.
27. Claude Code weekly-limit dates and Cursor June/July 2025 timeline details: search summaries.
28. Android fragmentation numbers (24,000 devices, 15–25% extra engineering time): agency blogs.
29. Springer Android-testing study: could not read past login.
30. "64% of Android developers cite slow builds (JetBrains 2024)": Medium post only.
31. Flaky-test figures (Atlassian 150,000 h, Google 84%): vendor blogs.
32. BrowserStack and TestMu AI prices: third-party pricing pages; BrowserStack's own page did not render plan prices.
33. Jules and Antigravity pricing and limits; Replit, Lovable ARR and valuations: search summaries.
34. Indian IT headcount cuts (7,000 at top five; TCS 23,460): article with no named sources.
35. Termux Play Store status and the 2026.01.07 Play build: search summary.
36. Whether the hackathon loaner is a Snapdragon 8 Elite Gen 5 phone (which decides whether the Linux Terminal gap and the AI Hub target change apply): the organiser does not state the model. (2026-10-03: the brief for the independent source check states the loaner is an iQOO 15, Snapdragon 8 Elite Gen 5 / SM8850, Android 16; the reviewer did not see an organiser document confirming it.)
37. Not searched (budget ran out): security incidents in prompt-built apps; MCP server security; CI cost data; India-specific developer surveys on tool spend; how many Indian students code primarily on phones.

---

## Addendum (2026-10-03): independent second pass (Codex, gpt-5.6-terra, medium effort)

Written by a second model with its own live web search, without sight of the report above. Status of each row: unchecked unless the "Addendum source check" table at the end says otherwise.

Raw notes: notes/codex-area6b.md

## Area 6B — Productivity and Developer Tools research

Research date: 3 October 2026. Scope: India first; Bengaluru where evidence is available. Claims marked **[U]** could not be independently verified from a source available during this research. Sources are paraphrased.

### Productivity

#### 1. High pain points

1. **AI adoption is ahead of governance and quality control.** Microsoft/LinkedIn reported 92% of Indian knowledge workers using AI at work in its 2024 India cut (31,000-person global survey plus product signals); its 2026 India survey says 63% of Indian AI users rank checking output quality as a top skill and 87% retain responsibility for the thinking. The person and employer both pay for review, mistakes, and informal tool use. These are vendor survey findings, not an economy-wide census. [Microsoft, 16 May 2024](https://news.microsoft.com/en-in/92-of-indian-knowledge-workers-use-ai-in-the-workplace-finds-microsoft-and-linkedin-2024-work-trend-index/) [Microsoft, 3 Sep 2026](https://news.microsoft.com/source/asia/2026/09/03/indias-ai-advantage-is-human-microsoft-work-trend-index-2026-finds-india-among-the-worlds-leading-frontier-workforces/)

2. **Routine support and information work remains expensive.** The Government of India’s Economic Survey 2024–25 cites research finding a 14% average productivity gain from generative-AI assistance for customer-support workers, and 34% for new/lower-skilled workers. That comparison implies repeated issue resolution and knowledge retrieval are materially costly without assistance; employers pay wages and service quality costs. **[U]** as of 2026-10-03: the PDF returned HTTP 403 to the reviewer, so the 14% and 34% figures were not checked against it. [Economic Survey 2024–25, Jan 2025, ch. 13](https://www.indiabudget.gov.in/budget2025-26/economicsurvey/doc/eschapter/echap13.pdf)

3. **Digital money reconciliation and trust are operational burdens for small businesses.** NPCI recorded 20.0bn UPI transactions in August 2025; Karnataka accounted for 1.078bn (5.39%). NPCI says an online non-credit can require manual processing by the beneficiary bank. At this scale, failed/reversed payments, receipts and reconciliation affect merchants, customers and banks. **[U]** as of 2026-10-03: the NPCI URL now returns a "404 Page Not Found" page, so none of the NPCI figures in this addendum (20.0bn, Karnataka 1.078bn, the per-app volumes, the manual-processing statement) could be checked. [NPCI ecosystem statistics](https://www.npci.org.in/what-we-do/upi/upi-ecosystem-statistics)

4. **Workforce skill change creates ongoing training and workflow-change costs.** The national Economic Survey describes AI as likely to automate routine tasks and disrupt employment in some sectors; the WEF’s 2025 employer survey says 63% cite skills gaps as their main transformation barrier. Workers pay in time and career risk; employers pay training/recruitment and foregone output. [Economic Survey 2024–25](https://www.indiabudget.gov.in/budget2024-25/economicsurvey/doc/echapter.pdf) [WEF, 8 Jan 2025](https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/?orgid=145)

5. **Coordination, status chasing and duplicate work crowd out skilled work.** Asana’s global Index says knowledge workers spend 60% of time on coordination rather than skilled work, with 103 annual hours in unnecessary meetings, 209 in duplicate work and 352 talking about work; 88% say time-sensitive work has slipped due to task volume. It is a vendor survey and not India-specific, but it explains a cross-market productivity category. Note (2026-10-03): the page is dated 17 Apr 2026 but attributes these numbers to Asana's Anatomy of Work Index (10,000+ knowledge workers) without giving the survey year, so they may be several years old. Employers lose labour time; workers absorb overload. [Asana, 17 Apr 2026](https://asana.com/resources/why-work-about-work-is-bad)

6. **Micro and small firms have vast, fragmented back-office needs.** The Ministry’s RAMP page says 6.45 crore MSMEs including informal enterprises were registered by 11 June 2025, representing 29% of GDP, 36% of manufacturing output and 44% of exports (figures cited for 2021–23). It explicitly identifies technology, market access and delayed payments as continuing challenges. Owners pay in bookkeeping/compliance time and constrained cash flow. [MSME RAMP](https://ramp.msme.gov.in/ramp/about-us/about-ramp)

7. **GST compliance is recurring, data-heavy work.** The GST portal says normal and casual registered taxpayers must furnish GSTR-1 monthly or quarterly (including nil returns) and lists invoice-level, note, export, amendment and HSN/SAC information required. The user can enter online, use an offline tool, or buy through an application-service/GST-suvidha provider. Businesses/agents pay the time or software/accountancy fees. [GST portal GSTR-1 guide](https://tutorial.gst.gov.in/userguide/returns/GSTR_1.htm)

8. **Fraud and payment-security handling consume operating attention.** RBI’s 2023–24 annual-report table records 36,075 banking frauds involving ₹13,930 crore; it says card/internet frauds dominate in number and calls out detection time lags. This affects account holders, merchants, banks and support teams; loss allocation varies by case **[U]**. [RBI Annual Report 2023–24](https://www.rbi.org.in/scripts/AnnualReportPublications.aspx?Id=1406)

9. **Information access and safe AI use are still constrained by trust.** Microsoft’s 2026 India sample says 63% rate output quality-control as a top skill and 87% remain responsible for the thinking; this is not a direct time measure but is evidence that workers cannot delegate final judgement. [Microsoft](https://news.microsoft.com/source/asia/2026/09/03/indias-ai-advantage-is-human-microsoft-work-trend-index-2026-finds-india-among-the-worlds-leading-frontier-workforces/)

10. **Connectivity/resilience constraints may affect the mobile workforce, but a quantified India productivity impact was not verified in this pass** **[U]**.

#### 2. Existing solutions and incumbents

Microsoft positions Microsoft 365 Copilot/Copilot Studio as the enterprise layer for documents, communication and agent workflows: it reported 100m+ monthly active Copilot-app users, 230,000 active Copilot Studio organisations and 3m agents created in FY25. Its 2025 India release says 59% of leaders already used agents across whole-team workstreams, but this is vendor-reported adoption. [Microsoft, 20 Aug 2025](https://news.microsoft.com/source/asia/2025/08/20/indias-workforce-goes-ai-first-as-frontier-firms-lead-the-transformation-microsoft-work-trend-index-2025/)

For payments-related back-office work, UPI apps and bank systems are the dominant rails: NPCI’s August-2025 table attributes 9.15bn customer-initiated transactions to PhonePe, 7.06bn to Google Pay and 1.41bn to Paytm. Price, if any, for merchant-facing productivity/reconciliation products was not checked in this pass **[U]**. [NPCI](https://www.npci.org.in/what-we-do/upi/upi-ecosystem-statistics)

#### 3. Common approaches

Products commonly centralise calendars, email, documents, task lists, chat and payment records; add retrieval over a connected knowledge base; then use cloud LLMs to summarise, draft, classify, extract or route work. A common prototype pattern is a meeting summariser, to-do list, document chatbot, invoice/expense parser, scheduling assistant, CRM follow-up assistant, or generic multi-tool agent. The prototype/cliché characterization is an analyst synthesis rather than a measured study **[U]**.

#### 4. Why incumbents work

Incumbents win through existing identity, email/document permissions, organisational procurement and bundled collaboration suites. Microsoft reports widespread Copilot app and Studio adoption; UPI’s scale comes from bank interoperability and consumer payment-app distribution. [Microsoft](https://news.microsoft.com/source/asia/2025/08/20/indias-workforce-goes-ai-first-as-frontier-firms-lead-the-transformation-microsoft-work-trend-index-2025/) [NPCI](https://www.npci.org.in/what-we-do/upi/upi-ecosystem-statistics)

#### 5. Why incumbents fail or frustrate

The available evidence supports a quality-control limitation more strongly than an India-specific product failure: 87% of Indian AI users in Microsoft’s 2026 survey say they remain responsible for thinking. Product continuity can also be fragile. Teaminal, an async-standup product, announced shutdown on 19 March 2025; its public page does not state a reason **[U]**. Everhour discontinued its Trello Power-Up free plan in April 2025, explicitly saying that it needed paid support to avoid closing the Power-Up. This is evidence of a small-tool sustainability constraint, not a broad market rate. [Microsoft](https://news.microsoft.com/source/asia/2026/09/03/indias-ai-advantage-is-human-microsoft-work-trend-index-2026-finds-india-among-the-worlds-leading-frontier-workforces/) [Teaminal](https://www.teaminal.com/blog/) [Everhour](https://support.everhour.com/article/613-free-plan-discontinuation)

#### 6. Gaps stated by sources

The Economic Survey explicitly identifies routine customer-service work as an area likely to be automated and says assisted support can improve novice performance. Microsoft’s India survey explicitly foregrounds quality control of AI output. Neither source specifically says a phone sensor, camera, voice, offline mode or on-device inference is structurally required for productivity work **[U]**. [Economic Survey 2024–25](https://www.indiabudget.gov.in/budget2025-26/economicsurvey/doc/eschapter/echap13.pdf) [Microsoft 2026](https://news.microsoft.com/source/asia/2026/09/03/indias-ai-advantage-is-human-microsoft-work-trend-index-2026-finds-india-among-the-worlds-leading-frontier-workforces/)

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| AI output assurance | 63% of Indian AI users rank quality control highly | Human review | Employers/workers | Final accountability stays human | [Microsoft](https://news.microsoft.com/source/asia/2026/09/03/indias-ai-advantage-is-human-microsoft-work-trend-index-2026-finds-india-among-the-worlds-leading-frontier-workforces/) |
| Repetitive support work | 14% average assisted productivity gain cited by Economic Survey | Staff knowledge search/escalation | Employer | Quality controls still needed | [Economic Survey](https://www.indiabudget.gov.in/budget2025-26/economicsurvey/doc/eschapter/echap13.pdf) |
| Work-about-work | 60% of time in a global vendor survey | Chat, email, spreadsheets | Employer/worker | Tool proliferation itself contributes | [Asana](https://asana.com/resources/why-work-about-work-is-bad) |
| MSME operations | 6.45 crore registered MSMEs as of Jun 2025 | Owner/accountant/manual books **[U]** | MSME owner | Technology/market/delayed-payment challenges remain | [RAMP](https://ramp.msme.gov.in/ramp/about-us/about-ramp) |
| GST filing | Monthly/quarterly, invoice-level filing rules | Portal/offline tool/ASP-GSP | Taxpayer/accountant | Multiple preparation routes retain compliance effort | [GST](https://tutorial.gst.gov.in/userguide/returns/GSTR_1.htm) |
| Payment reconciliation | 20.0bn UPI transactions in Aug 2025 **[U]** (NPCI URL returns 404 on 2026-10-03) | App/bank support/manual processing | Merchant/customer/bank | Some non-credits require manual bank processing | [NPCI](https://www.npci.org.in/what-we-do/upi/upi-ecosystem-statistics) |

### Developer Tools

#### 1. High pain points

1. **Low trust and costly verification of AI-generated code.** In Stack Overflow's 2025 survey (49,000+ respondents in total; 33,244 answered the trust question — corrected 2026-10-03), 46% distrusted AI output versus 33% who trusted it; 66% reported AI answers that were nearly right and 45% said debugging AI code took longer. The direct cost is developer review and rework time, borne by employer engineering teams. [Stack Overflow, 2025](https://survey.stackoverflow.co/2025/ai)

2. **Skills change and hiring friction.** The World Economic Forum says 63% of surveyed employers identify skills gaps as the main barrier to transformation; it projects nearly 40% of job skills will change by 2030. Indian employers report greater expected reliance on diverse talent pools (67%) and skills-based hiring (30%) than global comparators. This is employer-paid training and recruitment friction, with workers bearing transition risk. [WEF, 8 Jan 2025](https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/?orgid=145) [India detail](https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/5-region-economy-and-industry-insights/)

3. **Rising security and dependency-management workload.** GitHub reports 82% of its 2024 open-source survey respondents considered secure-by-design important when using an open-source project, while 65% prioritized it when contributing. GitHub measured 10.54bn Actions CPU-minutes in 2024, up from 7.3bn in 2023, a proxy for expanding build/test automation workload. [GitHub Octoverse, 29 Oct 2024](https://github.blog/news-insights/octoverse/octoverse-2024/)

4. **Manual security review is a delivery bottleneck in India.** GitHub’s 2024 enterprise-team survey (500 respondents each in India, US, Brazil and Germany) found 59% of Indian respondents said security teams manually review code changes. It is a vendor survey. Note (2026-10-03): the source gives this as a range "from 59% in India to 67% in the U.S.", so India is the lowest of the four countries; the source does not single India out as a bottleneck. Security teams and product teams pay through queueing and delayed release. [GitHub, 20 Aug 2024](https://github.blog/news-insights/research/survey-ai-wave-grows/)

5. **Build, test and review wait time blocks development.** GitHub’s developer-experience survey says developers report spending as much time waiting for builds/tests as writing new code and explicitly calls review/build/test queues obstacles. Its sample was 500 US enterprise developers surveyed in March 2023, so the evidence is US-only and predates agentic coding tools (corrected 2026-10-03; it is not "global"). [GitHub developer-experience survey](https://github.blog/news-insights/research/survey-reveals-ais-impact-on-the-developer-experience/)

6. **Software supply-chain vulnerability remediation misses promised windows.** Snyk’s 2024 report (453 technologists) says 74% of firms set high-severity vulnerability SLAs of a week or less, yet 52% miss them at least sometimes; SBOM monitoring was reported by 62.4%. This is vendor research, not an India estimate. Developers, security teams and customers bear response and breach exposure. [Snyk 2024](https://view.snyk.io/the-state-of-open-source-report-2024/p/1)

7. **Service outages have high financial consequence.** Uptime Institute’s 2024 analysis reports 54% of respondents’ most recent serious outage cost over US$100,000 and 16% over US$1m; four in five said it could have been prevented by better management, processes or configuration. These are global data-centre respondents. [Uptime Institute, 27 Mar 2024](https://intelligence.uptimeinstitute.com/index.php/resource/annual-outage-analysis-2024)

8. **Delivery performance varies sharply between teams.** CircleCI’s current benchmark, based on tens of millions of workflows, reports a median 69.24% success rate and 1h13m MTTR, versus 90% and 2m25s for its top 5%. The dataset is platform-specific and not India-specific. Teams pay in failed-run compute, incident time and slower release. [CircleCI benchmark](https://circleci.com/software-delivery-data-explorer/)

9. **Toolchain fragmentation creates cognitive and operating overhead.** GitLab’s 2024 worldwide survey of 5,000+ DevSecOps professionals reports 64% want to consolidate their toolchain. Engineering teams and software buyers pay integration, context-switching and governance costs. [GitLab](https://about.gitlab.com/resources/developer-survey/2024/)

10. **AI-enabled development introduces new security and runaway-cost risks.** OWASP’s 2025 LLM Top 10 identifies prompt injection, insecure output handling, sensitive-information disclosure, excessive agency and unbounded consumption; the latter can cause service disruption and unexpected cost. Builders and their organisations bear remediation, cloud spend and liability. [OWASP LLM Top 10, version 2025](https://owasp.org/projects/top-10-for-large-language-model-applications?tab=example&trk=public_post_comment-text)

#### 2–6. Existing solutions, common approaches, incumbent dynamics, and source-stated gaps

#### 2. Existing solutions and incumbents

GitHub Copilot is a broad incumbent: GitHub’s current official page lists Free (2,000 completions/month), Pro (US$10/user/month), Pro+ (US$39), Max (US$100) and Business (US$19), with completions, agents, code review, model selection and organisation controls varying by plan. Its current plans page says Copilot operates in major IDEs, CLI, GitHub and mobile; GitHub describes millions of individual users and tens of thousands of business customers. [GitHub pricing](https://github.com/features/copilot) [GitHub plans](https://github.com/features/copilot/plans?ref_plan=cfi&ref_product=copilot&ref_style=button&ref_type=purchase)

GitHub’s baseline stack also includes Actions for CI, Dependabot for dependency alerts and code/secret scanning; Octoverse reports 10.54bn Actions CPU-minutes in 2024 and a narrowing gap between Dependabot pull requests opened and merged. GitLab is a major integrated DevSecOps alternative; its 2024 survey of 5,000+ professionals reports 67% describing their SDLC as mostly/completely automated. Common informal alternatives—manual code review, search engines, team chat, spreadsheets and copy-paste into general-purpose assistants—are plausible but were not quantified here **[U]**. [GitHub Octoverse](https://github.blog/news-insights/octoverse/octoverse-2024/) [GitLab 2024 report](https://about.gitlab.com/resources/developer-survey/2024/)

#### 3. Common approaches

The standard platform approach joins source control, issue tracking, CI/CD, security scanning, deployment logs/telemetry and IDE assistance; AI is then used for autocomplete, chat/Q&A, test generation, PR summaries/review and issue triage. Typical hackathon prototypes are a code chatbot, README/doc generator, bug finder, test generator, “AI code reviewer”, deployment dashboard or generic coding agent. The prototype characterization is synthesis rather than a survey **[U]**.

#### 4. Why incumbents work

GitHub compounds repository hosting, identities, pull requests, Actions and security data in one workflow, while Copilot is directly integrated into major editors and GitHub surfaces. GitLab’s survey result that 64% want toolchain consolidation explains the attraction of integrated platforms, although it does not prove that any particular platform is preferred. [GitHub plans](https://github.com/features/copilot/plans?ref_plan=cfi&ref_product=copilot&ref_style=button&ref_type=purchase) [GitLab](https://about.gitlab.com/resources/developer-survey/2024/)

#### 5. Why incumbents fail or frustrate

AI coding assistance has a documented assurance problem: Stack Overflow found 46% distrust versus 33% trust, and 45% said debugging AI-generated code costs more time. Google’s 2024 DORA report associated a 25% rise in AI adoption with better documentation (+7.5%), code quality (+3.4%) and review speed (+3.1%), but also associated it with lower delivery throughput (-1.5%) and stability (-7.2%); this is observational association, not proof of causation. Cost controls are another friction: GitHub moved Copilot to usage-based billing on 1 June 2026, allows budgets, and says code review can consume Actions minutes (the budgets and Actions-minutes statements are **[U]**: the linked docs page is only an index of three links when opened on 2026-10-03; the 1 June 2026 billing change itself is confirmed on GitHub's blog). [Stack Overflow 2025](https://survey.stackoverflow.co/2025/ai) [DORA 2024](https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report?hl=en) [GitHub billing](https://docs.github.com/en/copilot/concepts/billing-and-usage)

Product consolidation can remove tools. Firebase Studio’s official community announcement says it began sunsetting on 19 March 2026 (it stays accessible until 22 March 2027) as Google simplified developer offerings, moving prototyping/deploying functions toward Google AI Studio and IDE functions toward Google Antigravity. This is a vendor migration, not evidence those replacement tools solve every user’s needs. [Firebase Studio announcement](https://community.firebasestudio.dev/t/firebase-studio-sunset/20827)

Reliance on cloud AI can also create availability dependency. OpenAI’s September 2025 incident write-up says CDN DDoS protections were misconfigured, which made up to 20% of ChatGPT page loads fail to display responses during the incident. [OpenAI status write-up](https://status.openai.com/incidents/01K47A0QGE7KMK2AHJZVYSTHXW/write-up)

#### 6. Gaps stated by sources

Stack Overflow records a direct gap: 66% cite outputs that are nearly correct and 45% cite time-consuming debugging; 87% have accuracy concerns and 81% have security/privacy concerns about agents. DORA says AI is not a delivery-performance panacea without small batches and robust testing. CISA’s February 2025 alert says software customers should demand secure-by-design products and identifies reducing systemic vulnerability classes as a supplier responsibility. No source found in this pass explicitly says smartphone camera, voice, offline use or on-device AI is structurally required for developer tooling **[U]**. [Stack Overflow](https://survey.stackoverflow.co/2025/ai) [DORA](https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report?hl=en) [CISA, 11 Feb 2025](https://www.cisa.gov/sites/default/files/2025-02/secure-by-design-alert-eliminating-buffer-overflow-vulnerabilities-508c.pdf)

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| AI code verification | 66% “almost right”; 45% slower debugging | Human review/testing | Engineering team | Low trust: 46% distrust output | [Stack Overflow](https://survey.stackoverflow.co/2025/ai) |
| AI delivery trade-off | +3.1% review speed but -7.2% stability association | Small batches/robust tests | Engineering org | AI alone does not improve delivery | [DORA](https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report?hl=en) |
| Security-review queue | 59% in India report manual review | Security-team review | Dev/security teams | Manual bottleneck | [GitHub](https://github.blog/news-insights/research/survey-ai-wave-grows/) |
| CI/test queues | Waiting time equals coding time (US survey) | CI and manual review | Engineering org | Queue persists despite tools | [GitHub](https://github.blog/news-insights/research/survey-reveals-ais-impact-on-the-developer-experience/) |
| OSS vulnerability SLA | 52% miss high-severity SLA at least sometimes | Scanners, SBOMs, patching | Dev/security/customer | Only 62.4% SBOM monitoring in sample | [Snyk](https://view.snyk.io/the-state-of-open-source-report-2024/p/1) |
| Outages | 54% cost >US$100k in sample | Monitoring/runbooks/incident response | Operator/customer | 80% said processes/config could prevent most recent | [Uptime](https://intelligence.uptimeinstitute.com/index.php/resource/annual-outage-analysis-2024) |
| Fragmented stacks | 64% seek consolidation | Integrations, dashboards | Software buyer/dev team | More tools, policy and context switching | [GitLab](https://about.gitlab.com/resources/developer-survey/2024/) |
| AI application risk | OWASP 2025 Top 10 | Validation, least privilege, monitoring | Builder/organisation | Prompt/output/agency risks persist | [OWASP](https://owasp.org/projects/top-10-for-large-language-model-applications?tab=example&trk=public_post_comment-text) |

#### India regulatory context relevant to both tracks

MeitY lists the notified Digital Personal Data Protection Rules, 2025, dated 14 November 2025, and a corrigendum dated 16 December 2025. MeitY’s 2025–26 annual report describes an 18-month phased compliance timeline. Separately, CERT-In’s FAQ says specified cyber incidents, including data breaches/leaks and severe incidents, are reportable within six hours, with initial information permitted to be incomplete. These requirements raise the operational cost of handling employee/customer data and incidents; applicability to an individual product depends on facts and legal advice **[U]**. [MeitY Rules listing](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025%3B) [MeitY annual report](https://www.meity.gov.in/static/uploads/2026/04/46face7d48c8f6a97030f713ad5fdab4.pdf) [CERT-In FAQ](https://www.cert-in.org.in/PDF/FAQs_on_CyberSecurityDirections_May2022.pdf)

---

## Source check (2026-10-03, independent reviewer)

Method: each cited URL was opened directly (page fetch, raw HTML, `gh api` for GitHub, headless browser for two script-heavy pages). No search engine was used. "Confirmed" means the claim is on the page opened. Claims in the file that are not listed here were not re-opened in this pass and keep the label the original author gave them. The DPDP/CERT-In paragraph and the Snyk, Uptime, CircleCI, OWASP and CISA rows of the addendum were not checked.

### Platform facts

| Claim | Source opened | Verdict | Note |
|---|---|---|---|
| ML Kit GenAI lists iQOO 13 and iQOO 15 | https://developers.google.com/ml-kit/genai (last updated 2026-09-28) | confirmed | Listed for the four feature APIs: summarisation, proofreading, rewriting, image description (all Beta) |
| Prompt API on iQOO | same | confirmed, detail added | iQOO 13 on nano-v2, iQOO 15 on nano-v3; nano-v4 is Pixel 11 and Galaxy Z Flip8/Fold8 only |
| ML Kit GenAI speech recognition supported on iQOO 13/15 | same, plus /speech-recognition/android | corrected | GenAI "Advanced" mode is Pixel 10/11 only. iQOO gets "Basic" mode, the traditional on-device recogniser (API 31+), not Gemini Nano. API is Alpha |
| Feature-API languages | per-API pages | added | Summarisation EN/JA/KO, under 4,000 tokens; proofreading and rewriting EN/JA/FR/DE/IT/ES/KO, under 256 tokens; image description EN only. No Indian language listed |
| Foreground-only; quotas return BUSY | https://developers.google.com/ml-kit/genai | confirmed | Top foreground app only, foreground service blocked (BACKGROUND_USE_BLOCKED); BUSY for the short-term quota; PER_APP_BATTERY_USE_QUOTA_EXCEEDED for the long-duration quota |
| AI Hub removed the `qnn_context_binary` compile option on 14 Sept 2026 | https://workbench.aihub.qualcomm.com/docs/hub/release_notes.html | confirmed, reworded | It was a compile target-runtime option value. Replacement is compile + link jobs, so QNN context binaries are still producible |
| AI Hub removed the "Snapdragon 8 Elite Gen 5" device on 28 Sept 2026 | same | corrected | The 14 Sept note says the "Snapdragon 8 Elite" and "Snapdragon 8 Elite Gen 5" entries "will be removed from the devices list on September 28th"; no later release note exists on the page, so removal is scheduled, not confirmed. Replacement "Samsung Galaxy S26 (Family)" is the same chip (SM8850-AD), so the chip remains a compile target |
| AI Hub issue #319: Qwen3-4B export strips KV-cache outputs, no maintainer reply | `gh api repos/qualcomm/ai-hub-models/issues/319` and comments | corrected | Feature request, 14 comments, two Qualcomm contributors replied from 21 May 2026; reporter withdrew the dead-code-elimination claim on 31 May 2026 |
| Snapdragon phones (incl. 8 Elite Gen 5) cannot run Android's Linux Terminal | https://www.androidauthority.com/snapdragon-chips-android-linux-terminal-3608648/ | confirmed as of 20 Oct 2025 | Needs non-protected VMs; Qualcomm: will support "should market demand arise". No newer source opened |
| LiteRT Qualcomm accelerator: 90 ops, 64 of 72 models fully delegate | https://developers.googleblog.com/unlocking-peak-performance-on-qualcomm-npu-with-litert/ | confirmed | Post dated 24 Nov 2025; names Snapdragon 8 Elite Gen 5 (SM8850) |
| Firebase Test Lab shuts down 30 Sept 2027; $5/device-hour; 30 free min/day; 5 physical runs/day on Spark | https://firebase.google.com/docs/test-lab/usage-quotas-pricing | confirmed | Migration target named: Developer Device Platform on Google Cloud |
| Play: 12 testers for 14 days | https://support.google.com/googleplay/android-developer/answer/14151465?hl=en | confirmed | Personal accounts created after 13 Nov 2023; continuous opt-in |
| Play blocked 1.75M apps, banned 80,000+ accounts in 2025 | bleepingcomputer URL | confirmed | |
| Developer verification from 30 Sept 2026 in four countries; 20-device free account | androidauthority sideloading URL | confirmed | India not mentioned |
| Gemma 4: E2B under 1.5 GB, 140+ languages, 31 tok/s decode on Dragonwing IQ8 | Google Developers blog URL | confirmed | The post does not mention Snapdragon phones |
| Saaras V4 "about 16% WER on Hindi"; cloud only; no on-device Indian ASR found | https://www.sarvam.ai/blogs/introducing-saaras-v4 ; https://www.sarvam.ai/blogs/sarvam-edge | corrected | 16.03% is IndicContextEval keyword-prompting, not Hindi. Sarvam Edge (14 Feb 2026) is on-device ASR for 10 Indic languages, ~294 MB; public availability not stated |
| Happy has 24,000+ stars | `gh api repos/slopus/happy` | corrected | 23,991 on 2026-10-03; MIT confirmed |

### Corporate claims

| Claim | Source opened | Verdict | Note |
|---|---|---|---|
| Cursor (Anysphere) a wholly owned SpaceX subsidiary since 14 Aug 2026, $60B all-stock; ARR $3B May 2026 | Wikipedia "Cursor (company)" wikitext (Anysphere redirects there) | confirmed | Wikipedia cites a Form 8-K and Bloomberg Law; neither primary was opened |
| Supermaven wound down late 2025; Koala shut after team hired; Graphite Dec 2025 | same | confirmed | Graphite: "agreed to acquire" |
| Windsurf bought by Cognition July 2025; renamed Devin Desktop June 2026; valuations $26B / $40B talks | Wikipedia "Cognition AI" wikitext | confirmed | The roughly $3B OpenAI offer is not on this page (CNBC not opened) |
| Clockwise: Salesforce hired team, product shut 27 Mar 2026, data deleted | Yahoo Finance (TechRadar) URL | confirmed | "Salesforce is acquiring the workers and not the company" |
| Rewind/Limitless: Meta deal 5 Dec 2025, pendant sales stopped, capture off 19 Dec 2025, seven regions cut at once | winbuzzer URL | confirmed | |
| Class actions against Otter, Fireflies, Granola | btlaw URL | confirmed, detail added | A second Fireflies case (Parrinello, N.D. Cal.) added; Cruz is in C.D. Ill. |
| Copilot token-metered "AI Credits" from 1 June 2026; prices $10/$39/$19/$39; completions unmetered | GitHub blog (27 Apr 2026) | confirmed | Current plans page also lists Max at $100 and flex credit allotments |
| Claude Pro ₹2,399/mo or ₹24,000/yr; Max ₹11,999 and ₹23,999; GST included; no UPI; 13 July 2026 | explainx URL | confirmed on a secondary page | No Anthropic page was opened; treat as secondary |
| Cursor pricing: Hobby free, Individual $20, Teams $40; no ₹649 plan | https://cursor.com/pricing | confirmed | |
| Cursor iOS app: iOS only, paid plans, Android planned; "remote access limited to cloud agents" | Cursor changelog and forum URLs | corrected | Remote Control of agents on the user's own machine exists (Cursor 3.9.8+); the iOS 26 requirement comes from forum users, not the changelog |
| Codex in ChatGPT mobile, 14 May 2026, all tiers, macOS host only at launch | Engadget URL | confirmed | |
| Claude Code Remote Control limits | helpnetsecurity and explainx URLs | confirmed | Research preview for Max users at launch |
| CodeParrot, subtl.ai, Builder.ai closures | Inc42 URL | confirmed | |
| CodeRabbit $24/$48/$72 annual; free on public repos | coderabbit.ai/pricing | confirmed | |

### Headline numbers

| Claim | Source opened | Verdict | Note |
|---|---|---|---|
| Delayed payments ₹10.7 → ₹8.27 → ₹7.34 lakh crore; micro firms up to 3x longer; TReDS ₹2.4 lakh crore | smestreet URL | confirmed | ₹7.34 lakh crore is described as inflation-adjusted |
| Samadhaan: 2,56,892 filed; 81,536 rejected; 63,021 disposed; 24,240 settled | https://samadhaan.msme.gov.in/ | confirmed | Also 43,409 not yet viewed and 44,686 under consideration; no "as on" date shown |
| Economic Survey ₹8.1 lakh crore; ₹55,244 crore claimed; ODR dates and 17/26 cases | cybiqon URL | confirmed on the secondary page | Primary not opened; stays secondary |
| TeamLease RegTech: 1,450 obligations, ₹13–17 lakh, 48 registers, 59 inspectors, 486 clauses, 9,331 changes, ~90% | knnindia URL | confirmed | |
| Microsoft WTI 2025: 275 interruptions/day, 117 emails, 153 Teams messages, 57% ad hoc, +16% after 8 pm, 48%/52% | Microsoft WorkLab URL | confirmed | |
| Atlassian State of Teams 2025: 25% of time searching; 12,000 + 200 sample | Atlassian blog URL | confirmed | |
| Atlassian: 2.4bn hours, 1 in 2 duplicate, 71%, 56% | deviniti digest URL | confirmed in the digest | 72% variant unsourced |
| MIT NANDA: 95% of pilots no measurable P&L impact; 40% vs 90%; 90% prefer humans for high-stakes work | legal.io URL | confirmed on a secondary page | Sample: 52 interviews, 153 survey responses, 300 public deployments |
| Workslop: ~40% received it in the past month (n = 1,150) | TechCrunch URL | confirmed | The 1 h 56 min and $186 figures are not in the readable part of the HBR page; still [S] |
| Microsoft WTI 2026 India: 63% vs 50% global; 87% | Microsoft Source Asia URL | confirmed | |
| Asana: 64%, 39%, 82% vs 32%, 18% | unleash.ai URL | confirmed | |
| PayNearby: 97%, 29%, 68%, 51%+, 36%, 18% | Entrepreneur India URL | confirmed | |
| Zoho: 5,149 MSMEs, cost top hurdle, 71% spreadsheets | Zoho URL | confirmed | |
| LocalCircles: 66%, 96%, 92% | LocalCircles URL | confirmed | January 2023 wave |
| Call Notes: Pixel only; India on Pixel 10 in Hindi and English; stored on device | Google support URL | confirmed | |
| M365 Copilot India prices | microsoft.com/en-in pricing | confirmed | GST extra; promo 1 July to 31 Dec 2026 |
| Copilot seats 15M/20M/30M; PwC 56% | userlane URL | confirmed | The 6.6% share is not on this page; stays [S] |
| JetBrains 2026 agent adoption figures | JetBrains blog URL | confirmed | "From" values for Codex and Cursor are January 2026 |
| Faros: +98% PRs, +154% PR size, +91% review time, +9% bugs, no company-level correlation | Faros URL | confirmed | |
| Sonar: 42%, 96%, 48% always verify, 38% | Sonar URL | confirmed | |
| Stack Overflow 2025: 66%, 45.2%, 3.1%, 75.8%, 87%, 81% | survey.stackoverflow.co/2025/ai | confirmed | 49,000+ total respondents; 33,244 answered the trust question |
| Stack Overflow 2026 results not out on 30 Sept 2026 | Stack Overflow blog URL | confirmed | |
| Stack Overflow 2025: 24.7% of Indian respondents happy at work | survey.stackoverflow.co/2025/work | confirmed | |
| METR 2025: 16 developers, 246 tasks, 19% slower, believed 20% faster | METR URL | confirmed | |
| METR Feb 2026: 57 developers, 800+ tasks, −18% (CI −38% to +9%), 30–50% selection | METR URL (raw page) | confirmed, wording tightened | Negative means less time with AI; new developers −4% |
| CodeRabbit: 10.83 vs 6.45 issues (1.7x), 1.4x critical, XSS 2.74x, 470 PRs | The Register URL | confirmed | |
| DORA 2025: ~5,000 respondents, negative relationship with stability, 30% low trust | Google Cloud blog URL | confirmed | |
| DORA ROI report: "verification tax", "instability tax" | InfoQ URL | confirmed | |
| "AI code waits 4.6x longer for first review" | kodus URL | could not verify | Not on the cited page; now [U] |
| GitGuardian: 28.65M secrets; AI-assisted commits ~2x leak rate | GitGuardian URL | confirmed, upgraded to [V] | 3.2% vs 1.5% |
| Veracode 45% / Java 72% | businesswire URL | could not verify | HTTP 403 |
| Atlassian DevEx 2025: 50% lose 10+ h, 90% lose 6+, 16% coding, 63% vs 44% | Atlassian URL | confirmed | |
| Octoverse: India 21.9M, 57.5M by 2030; 180M; ~80% | GitHub blog URL | confirmed | Page says "more than 5 million" added, not 5.2M |
| Replit/SaaStr incident | Slashdot URL | confirmed | |
| curl ended bug bounty, seven reports in a week, none a vulnerability | The Register URL | confirmed | |

### Addendum rows

| Claim | Source opened | Verdict | Note |
|---|---|---|---|
| 92% of Indian knowledge workers use AI at work (2024) | Microsoft India URL | confirmed | Global 75% |
| NPCI: 20.0bn UPI transactions Aug 2025, Karnataka share, per-app volumes, manual processing | NPCI URL (headless browser) | could not verify | URL returns a 404 page |
| WEF: 63% cite skills gaps; nearly 40% of skills to change | WEF press release (headless browser) | confirmed | |
| Asana: 60% work about work; 103 / 209 / 352 hours; 88% | Asana URL | confirmed | Figures are from the older Anatomy of Work Index; survey year not stated |
| MSME RAMP: 6.45 crore registered (11 June 2025); 29% / 36% / 44% | RAMP URL | confirmed | |
| RBI 2023-24: 36,075 frauds, ₹13,930 crore; card/internet dominate by number | RBI URL | confirmed | |
| Teaminal shutdown announced 19 Mar 2025, no reason given | Teaminal blog | confirmed | |
| Everhour ended the Trello Power-Up free plan (April 2025) to avoid closing it | Everhour support URL | confirmed | |
| Stack Overflow 2025 "survey of 33,244 respondents" | survey.stackoverflow.co/2025/ai | corrected | 33,244 is the response count for one question; the survey had 49,000+ |
| GitHub 2024 survey: 59% in India say security teams manually review code | GitHub blog URL | confirmed, framing corrected | India is the lowest of four countries (US 67%) |
| GitHub developer-experience survey: waiting on builds/tests equals time writing code | GitHub blog URL | confirmed, framing corrected | 500 US developers, March 2023; not global |
| DORA 2024: +7.5% docs, +3.4% code quality, +3.1% review speed, −1.5% throughput, −7.2% stability | Google Cloud blog URL | confirmed | |
| Copilot plans: Free 2,000 completions, Pro $10, Pro+ $39, Max $100 | github.com/features/copilot/plans | confirmed | Business $19 is confirmed by the GitHub blog, not this page |
| Copilot budgets; code review can consume Actions minutes | docs.github.com billing-and-usage | could not verify | Page is an index of links |
| Firebase Studio sunset began 19 Mar 2026 | Firebase Studio community URL | confirmed | Accessible until 22 Mar 2027 |
| OpenAI Sept 2025 incident: CDN DDoS rules misconfigured, up to 20% of page loads failed | OpenAI status URL | confirmed | 2–3 Sept 2025 |
| GitLab 2024: 64% want to consolidate; 67% mostly automated; 5,000+ sample | GitLab URL | confirmed | |
| Economic Survey 2024-25: 14% / 34% productivity gain for support workers | indiabudget.gov.in PDF | could not verify | HTTP 403 |
