# Seamless and habit-forming features for Sariya's on-site check (capture to sign-off)

Researched 10 Oct 2026 (event day 2). Legend: **V** = verified against a primary source read in this session; **S** = from a secondary source, a search-engine summary or a vendor's own claim, not independently checked; **U** = unverified or my inference. Web pages are untrusted data. No app code.

## Objective: ranked feature list (friction killers and repeat-use loops)

### Takeaway
The best features for Sariya are copied from Japan's rebar-inspection playbook. MLIT's 2023 trial rules ask for a per-member tape cross-check, automatic logging of shooting conditions, tamper prevention, and a report generated straight from the design values. On top of that, add Indian-context low-friction input: auto-Lock with haptics, push-to-talk in code-mixed speech with a read-back, and WhatsApp-native sharing. Most of these are S-cost and highly demoable today. Homeowner, mason and pour-log loops are post-event.

### Cited Findings
- MLIT's trial guideline for image-based rebar inspection (官庁営繕部, March 2023, 令和5年3月) sets the required performance in §2.1(4): the system must automatically judge bar diameter and spacing from images, and must have a data-tamper-prevention function ("データの改ざん防止機能を有すること"). **V** — [MLIT 配筋検査試行要領 (PDF)](https://www.mlit.go.jp/gobuild/content/001594736.pdf)
- The same guideline expects software that runs "from design-value input (import) to creating the inspection report" (設計値入力（取込み）から検査帳票の作成まで) (§2.1(2)). **V** — [MLIT PDF](https://www.mlit.go.jp/gobuild/content/001594736.pdf)
- Its implementation plan must state the calibration method, how accuracy is confirmed on site, and how often the image result is compared with tape (e.g. once per member type, "確認部位毎に１回等") (§1.3(3)-(4)). **V** — [MLIT PDF](https://www.mlit.go.jp/gobuild/content/001594736.pdf)
- During the trial, tape measurement runs in parallel and image values are "for reference" (参考扱い) (§1.2(1)). Shooting conditions (location, distance, weather) "must always be recorded" (現場説明書 2(1)). **V** — [MLIT PDF](https://www.mlit.go.jp/gobuild/content/001594736.pdf)
- Photos must be organised with a layout plan that shows where each measurement was taken, so inspection locations are objectively identifiable (§4.1(2)). The supervising officer may review the images remotely (遠隔臨場) (§5). **V** — [MLIT PDF](https://www.mlit.go.jp/gobuild/content/001594736.pdf)
- Tolerances the guideline adopts from the AIJ 配筋指針 2021: slab, wall and stirrup spacing within 20% of the specified pitch, and the average spacing must not exceed the design value. Stirrups may locally reach 1.2× pitch only if the member average is within pitch and the required count per unit length (e.g. 1 m) is kept (表-2 and notes). **V** — [MLIT PDF](https://www.mlit.go.jp/gobuild/content/001594736.pdf)
- Raken markets voice-to-text for field notes that attach to the day's report. Capterra reviewers called voice input "spotty" and said it can't be used in loud environments. **S** — [Raken notes feature](https://www.rakenapp.com/features/notes); [Capterra Raken reviews p.9](https://www.capterra.com/p/153591/RAKEN/reviews/?page=9); [Capterra p.10](https://www.capterra.com/p/153591/RAKEN/reviews/?page=10)
- In a Microsoft Research study of 30 emergent Indian smartphone users:
  - 28/30 preferred voice search;
  - 20/30 sent WhatsApp voice messages;
  - most used Hindi-English code-mix;
  - the mic often misrecognised them, forcing retries;
  - low-literate users checked the transcribed text before acting;
  - cloud voice failed on slow internet;
  - 22/30 shared phones.

  **V** — [Gupta et al., COMPASS '22, "Sophistication with Limitation"](https://www.microsoft.com/en-us/research/wp-content/uploads/2022/05/compass22-34-taps.pdf)

### Inferences (the ranked list; cost = S under 3 h today, M a half to full day, L post-event; rubric: W = works/useful/keep using 30%, C = creative phone use 15%, N = novelty/impact 20%, T = technical depth 15%, O = Office Kit 10%, D = demo 10%)

| # | Feature | Problem it kills | Evidence | Cost (event / post) | Lifts | Demo-ability |
|---|---|---|---|---|---|---|
| 1 | **Hands-free auto-Lock with a haptic "tick" and audio cue.** Lock fires on gyro stillness plus a consistent bar count, with no tap. One strong buzz means locked, a double buzz means re-scan. Volume key as a physical shutter fallback. | Gloved or dirty hands, one hand holding the card or a bar, and the screen hard to read in sun. | Capacitive screens fail with gloves; large targets and hardware buttons recommended (practitioner/patent, **S**). ML Kit's document scanner defaults to auto-capture (**S**). The MLIT flow expects automated judgement (**V**). | S (Lock exists; add a vibration pattern and a volume-key listener) | W, D, C | Very high: the judge sees the hand never touch the screen |
| 2 | **Per-member tape witness:** one tape reading per zone type, saved next to the camera value, auto-building the on-phone error table. | Trust, and the "is the camera right?" question. | The MLIT trial needs a stated tape-comparison frequency, once per member type (**V**). Image values are reference-only during the trial (**V**). | S (a tape-entry field already exists for cover; reuse it) | T, W, N | High: it is the existing tape beat, now logged as data |
| 3 | **Digital chalkboard (電子小黒板) on every evidence frame:** site, member, zone, drawing value, measured ± band, time, card ID and record hash burned in. Shooting conditions (distance from card pose, tilt, torch on/off, thermal headroom, model and rule versions) logged automatically. | Paper chalkboards, plus an Office Kit reviewer who can't tell which frame is which zone. | J-COMSIA certifies tamper detection (信憑性確認) and chalkboard-information linkage for Japanese construction-photo apps (**S**). MLIT requires recorded conditions and location-identifiable photos (**V**). | S-M | O, W, T | High: the engineer on the laptop sees the stamped frame |
| 4 | **One-tap offline report:** a PDF (drawing value vs measured vs band vs state) plus a 20-40 s Hindi/Kannada voice note, sent through the Android share sheet to WhatsApp or Office Kit, with a verify QR. | Report writing; WhatsApp is the de facto channel. | Japanese vendors (Modely, Ecomott) auto-generate the report (帳票) right after measurement (**S**). Powerplay's pitch is replacing WhatsApp forms and photos (**S**). SafetyCulture builds only PDF reports offline (**S**). 20/30 users send WhatsApp voice notes (**V**). | M (PDF from a template; the voice note reuses TTS of the spoken fix) | W, O, D | High |
| 5 | **Push-to-talk code-mixed commands with read-back:** "B2 left end, cover 25" → on-screen text plus a spoken read-back → confirm. A small fixed grammar, numbers first. | Typing on site, noise, and low literacy among crew. | Code-mix, retries, and checking text before acting (**V**, COMPASS '22). Raken voice is spotty in noise (**S**). On-device ASR avoids the internet dependency COMPASS found (**V**). | M if ASR is not yet in; S if it is (IDEA keeps voice in Tier 1) | C, W | Medium-high (noise on stage is a risk; keep a tap fallback) |
| 6 | **"Fix verified" re-scan:** the failing zone becomes an open item. After the mason's fix, re-scan just that zone. The record shows "was 180 → now 100, closed", signed as a new revision. | The loop dies after the bad news. Closing it is what an engineer approves. | Fieldwire and PlanRadar are built around punch or defect lists (**S**). IDEA §3.7 already makes edits new revisions (internal). | S-M | W, N, D | Very high: the judge fixes the bar, re-scans, and the item closes |
| 7 | **Field-robust display and power:** sun mode (black on white, at least 7:1 contrast, 2× numerals), auto-torch on low light, and a thermal governor (drop to about 10 fps and say why when headroom is low), with the readout on the numbers screen. | Glare, evening dusk (the scan is the evening before the pour), and NPU+camera+torch heat. | Practitioner guidance only: 7:1 contrast, light backgrounds (**S**). AR-VISION §7 already flags thermals (internal). | S | W, C, T | Medium |
| 8 | **Pour log and pre-pour reminder:** a per-site timeline of pours, members checked, open items, and a local notification at T-12 h ("pour tomorrow: 2 zones not scanned"). Post-event: a WhatsApp utility template. | Forgetting the window; the steel is hidden the next morning. | WhatsApp Business utility messages cost about ₹0.115-0.145 each in India in 2026 (sources conflict, **S**). Powerplay and Onsite sell daily progress reports and diaries (**S**). | S (local) / M (WhatsApp) | W ("keep using") | Medium (show the timeline screen) |
| 9 | **Homeowner share card:** "what was checked, what wasn't, who signed", with a verify QR; no app needed. | The homeowner who pays has no visibility. | Brick & Bolt's customer app shows stage-wise inspection reports and ties escrow payments to verified stages (vendor, **S**). | M / post | N, W | Medium |
| 10 | **BBS/drawing-table OCR** to pre-fill the 5-field spec. | Typing the spec. | Sarvam showed on-device Vision OCR (demo on a MacBook, **V**). IDEA already lists "photograph the bar-bending schedule". | M-L; roadmap | C, W | Medium |
| 11 | **Mason corrections record via brand loyalty apps** (instead of a standalone "work passport"). | The mason's incentive to accept fixes. | Captain Steel's mason app scans QR codes on TMT bundles for points; JSW runs Heroes Club and Privilege Club (**S**). The work passport is unevidenced (STATE.md). | L, post-event | N (business) | Low |
| 12 | **On-device face blur** before export. | Privacy of crew and family in frames. | Standard on-device face detection (**U**, not researched here). IDEA §3.7 keeps it post-event. | S-M / post | W, T | Low |

- Cut or defer: streaks and gamification for engineers. I found no evidence they work for professional inspectors **U**. "Pours checked this month" on the pour log covers it.
- The two Tier-1 beats that most raise the "would someone keep using it" score for least cost are #1 and #6 (**U**, judgement). #3 is the cheapest visible Office Kit gain.

### Gaps
- No rigorous field study of gloved or sunlight phone use on construction sites was found. The guidance above is practitioner opinion.
- No Indian Play Store review mining was done for Powerplay or Onsite. Their offline and voice support is unconfirmed.
- No site validation of whether Bengaluru crews prefer Hindi or Kannada (STATE.md open question).

## Friction killers on site (one-handed, gloves, voice, sunlight, torch, offline, battery, haptics, typing)

### Takeaway
No major field app was found to advertise glove mode or one-handed use. The Western tools win on offline sync and quick photo plus voice notes, and their known weak spots are voice in noise and sync on big jobs. For India, voice is the main input, but it must work offline, accept code-mix, and read back what it heard.

### Cited Findings
- SafetyCulture works offline only for templates and inspections already downloaded. Offline, notifications wait for connectivity, asset profiles are unavailable, and only PDF reports can be generated. **S** — [SafetyCulture help](https://help.safetyculture.com/en-US/002907/); [help 000065](https://help.safetyculture.com/en-US/000065)
- One third-party listing reports SafetyCulture crashes and freezes during long inspection sessions. **S** — [Marlvel report](https://marlvel.ai/apps/safetyculture-iauditor)
- Fieldwire works offline; reviewers like its markup and photo-on-task flow but note markup quirks on some tablets. PlanRadar offers QR scanning, geotagging and multilingual support. Neither advertises glove or one-handed modes, and G2 marks their offline and photo features "not enough data". **S** — [SelectHub](https://www.selecthub.com/construction-management-software/fieldwire-vs-planradar/); [RFP.wiki](https://www.rfp.wiki/vendors/planradar/fieldwire); [G2](https://www.g2.com/compare/dalux-vs-planradar-vs-fieldwire-by-hilti)
- Raken: a superintendent can narrate the day. The vendor claims reports take under 5 minutes against 40+ on paper; an independent review repeats the claim. **S** — [Contractor ToolStack](https://contractortoolstack.com/software/raken/)
- Capacitive touch fails with gloves, so practitioners recommend large targets, hardware buttons, at least 7:1 contrast and light backgrounds. An app cannot set the screen brightness itself. **S** (practitioner blogs and a patent, not studies) — [Glance guide](https://thisisglance.com/learning-centre/how-should-i-design-apps-for-construction-workers); [Apario blog](https://blog.apario.net/on-writing-software-for-people-who-work-outside); [USPTO patent 9746930](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9746930)
- Indian site apps:
  - Powerplay is vernacular and mobile-first, and pitches replacing WhatsApp coordination. In its Prabhu Realities case study, WhatsApp updates were "cumbersome" and paper forms were left on site. **S** (vendor) — [Powerplay case study](https://www.getpowerplay.in/resources/case-studies/saves-40-hours-a-month-using-powerplay/); [PeakXV profile](https://surge.peakxv.com/companies/powerplay)
  - Onsite offers GPS attendance, geo-fenced zones, geotagged photos, DPRs and snag lists; its offline support is unconfirmed. **S** — [Capterra India: Onsite](https://www.capterra.in/software/1049107/onsite)
  - BuildnManage claims offline use and multiple Indian languages. **S** — [AppFollow: BuildnManage](https://appfollow.io/ios/buildnmanage/1378822083?country=us)
- India HCI: voice is preferred for search and messaging; code-mixed Hindi-English is the norm; misrecognition forces retries and loud speech; cloud voice fails on slow internet; low-literate users check the text output; 22/30 share phones (so per-user PIN and keys matter). **V** — [COMPASS '22 paper](https://www.microsoft.com/en-us/research/wp-content/uploads/2022/05/compass22-34-taps.pdf)
- An Indian construction digitalisation survey (162 professionals) groups barriers into five themes:
  - finance and resources;
  - culture and organisation;
  - regional disparities;
  - data security and privacy;
  - awareness and capacity.

  Smaller firms adopt more slowly. **S** (abstract only) — [Dauda et al., Leeds Beckett eprint](https://eprints.leedsbeckett.ac.uk/id/eprint/10947)
- An IIT Guwahati study designed icon-based mobile GUIs for construction users from field studies. **S** — [Yammiyavar & Kate (IFIP)](https://dl.ifip.org/index.html/db/conf/ifip13/hwid2009/YammiyavarK09.pdf)

### Inferences
- Sariya's offline-first design is already ahead of SafetyCulture's offline limits: it measures, decides, signs and generates the PDF all offline. Say this on the competitor slide **U**.
- The MLIT "record conditions" rule plus card-pose geometry means distance and tilt can be logged for free on every Lock. That turns abstention ("too far") into evidence rather than an excuse **U**.
- Phone sharing (22/30) supports the PIN-gated per-phone key. It also argues against assuming one phone means one person in the record. Phrase it as "signed by the key on this phone" **U**.

### Gaps
- No HCI study of Indian construction site engineers or supervisors specifically was found.
- Haptics: no source found on vibration-confirmation efficacy in construction apps. The recommendation is a design inference.

## Repeat-use loops (pour log, mason record, homeowner link, WhatsApp, fix re-scan, scorecards, reports, reminders)

### Takeaway
Repeat use in Indian construction is already driven by two proven loops:
- stage-gated payments: Brick & Bolt escrow, and lender tranches in IDEA §3.8;
- brand loyalty points: steel and cement mason apps with QR scans.

Sariya should plug its signed record into those loops rather than invent streaks. The closed "fix verified" item is the loop's atomic unit.

### Cited Findings
- Brick & Bolt advertises 470+ QASCON checks (one page says 1153+, which conflicts) and stage-wise inspections by a site engineer shared through the customer app. It also says payments are released only after each verified stage, via escrow. **S** (vendor) — [Brick & Bolt Ayappakkam page](https://www.bricknbolt.com/construction-company-ayappakkam); [Brick & Bolt remote monitoring](https://answers.bricknbolt.com/task/blog/home-construction-companies-india-remote-project-monitoring)
- Captain Steel's Jeevansaathi app: masons scan the unique QR on each Captain TMT bundle to earn points. **S** — [Captain Steel Jeevansaathi](https://jeevansaathi.captainsteel.com/)
- JSW Heroes Club (cement) is a loyalty programme for masons, engineers, contractors and architects: punch sales, redeem points, direct bank transfer. JSW Privilege Club (steel) offers regional rankings, but the scheme found covers roofing sheets, not TMT. **S** — [JSW Cement Contractors' Circuit](https://www.jswcement.in/contractors-circuit); [JSW Neosteel Privilege Club](https://www.jswneosteel.in/privilege-club)
- An anonymised cement mason programme reports +186% masons registered and +326% bags sold after launch. **S** (unnamed company, vendor case study) — [mjunction PDF](https://www.mjunction.in/wp-content/uploads/2018/12/Masons-Loyalty-Program-for-a-Cement-Major.pdf)
- UltraTech reports engaging 2M+ masons and contractors and training 90,000 in 2021 (skilling, not a loyalty app). **S** — [UltraTech skill-building](https://www.ultratechcement.com/about-us/media/features/ultratech-cement-s-skill-building-program)
- WhatsApp Business API utility messages in India (2026), with conflicting sources:
  - ₹0.145 per message (AiSensy) and ₹0.115 (Authkey);
  - about $0.0014 (Message Central);
  - AiSensy says service messages become chargeable from 1 Oct 2026, with 1,000 free per month (unconfirmed by Meta).

  **S** — [AiSensy Jan 2026](https://m.aisensy.com/blog/whatsapp-api-new-pricing/); [Authkey](https://authkey.io/blogs/?p=1840); [Message Central](https://www.messagecentral.com/blog/whatsapp-business-api-pricing-2026); [AiSensy Oct 2026](https://m.aisensy.com/blog/whatsapp-service-message-pricing-update/)
- SendStatus turns WhatsApp field updates into AI-polished client reports. It is US-oriented, and its reports are not tamper-evident. **S** — [Trustpilot SendStatus](https://ca.trustpilot.com/review/sendstatus.co)
- Byggnet Verify brands construction documents with a unique QR plus a photo and message. **S** — [AppFollow Byggnet Verify](https://apps.appfollow.io/ios/byggnet-verify/470519373?country=us)
- No Indian app was found that gives homeowners a WhatsApp-shared, verifiable QR of construction checks. **S** (absence in search) — [search context: QR TIGER construction](https://www.qrcode-tiger.com/hi/qr-codes-in-construction)

### Inferences
- **Order of loops, by evidence:**
  1. Fix-verified items: they close inside one evening, are demoable, and every engineer approval needs them.
  2. The pour log with a T-12 h local reminder.
  3. The homeowner share card, which mirrors Brick & Bolt's stage reports for the self-build market.
  4. A mason record routed through steel-brand loyalty apps (points for "fix closed"), post-event and only with a brand partner.

  (**U**)
- Contractor scorecards (e.g. "% of zones within limits on first scan") are a natural by-product of the pour log, but they risk the "calling masons cheats" optics (IDEA §10). Make them private to the engineer by default **U**.
- WhatsApp: use the Android share sheet (free, no API) at the event. Put a verify QR in the PDF so the forwarded file is self-verifying offline against enrolled keys. A Business API reminder costs about ₹0.12 a message, so it is cheap at brand-programme scale **U**.

### Gaps
- No evidence was found that Indian homeowners would open a verification link. This needs the site visits.
- No data was found on repeat-use or retention for construction QC apps in India.

## Trust UX (abstention phrasing, visible error bands, "what the camera can't see")

### Takeaway
Japan's regulator built trust in image measurement with three rules: use the tape alongside the camera during adoption, record shooting conditions, and judge by averages within a ±20% pitch band. Sariya can show the same scaffolding in its UI. "Re-scan" then reads as the system following the method, not failing.

### Cited Findings
- MLIT: image values are "reference" during the trial and must be compared with tape. Performance must be shown to be at least equal to tape (従来のスケール等での計測と同等以上の精度) (§2.2(1)). **V** — [MLIT PDF](https://www.mlit.go.jp/gobuild/content/001594736.pdf)
- MLIT notes that some members are hard to photograph or lose accuracy, so measurement locations are agreed with the supervising officer in advance (§1.2(2)). Cover and lap length are image-measured only by agreement (§3.3(1)). **V** — [MLIT PDF](https://www.mlit.go.jp/gobuild/content/001594736.pdf)
- Japanese vendor accuracy claims:
  - Nihon Koatsu's AI rebar system on a tablet: average-spacing error within ±5 mm in 100% of cases.
  - Satokogyo presented an on-site accuracy study of a smart-device rebar AI at JSCE 2024.

  **S** (vendor claims; the JSCE full text is behind a login) — [Nihon Koatsu PDF](https://www.nihonkoatsu.co.jp/wp-content/themes/nihonkoatsu/images/technology/aitekkin.pdf); [JSCE 2024 VI-509](https://pub.confit.atlas.jp/en/event/jsce2024/presentation/VI-509)
- A legal commentary notes that traditional inspection samples rebar spacing rather than measuring every bar. **S** — [Dallas Gerstle Snelson](https://www.gstexlaw.com/artificial-intelligence-in-construction-quality-control/)

### Inferences
- **Phrasing to adopt** (**U**):
  - "Re-scan: 0.8 m is too far for a ±5 mm reading. Move to 30 cm." (cause plus action, never just "error");
  - "Needs a tape reading: cover can't be seen";
  - "Not seen: 2 bars under the card".
- Show the band as a bar against the drawing's limit, not as "±" text alone.
- Add a fixed "camera can't see" checklist card (cover, diameter, hooks, lap, bottom layer when occluded). Each item is ticked off by a tape, weigh or template entry.
- **Averaging rule:** the AIJ/MLIT rule (average ≤ design; locally ≤ 1.2× pitch for stirrups, provided the count per metre holds) is a ready-made, citable tolerance for a field where IS 456 gives none. It is a candidate for the rulebook's spacing tolerance, but a practising engineer must confirm it for Indian use (**U**; cross-ref STATE.md open question "who sets the spacing tolerance").

### Gaps
- No user study was found on how inspectors react to abstention or "re-scan" outputs.

## On-device AI that fits the Snapdragon 8 Elite Gen 5 NPU and raises "creative phone use"

### Takeaway
Realistic on the phone in 2026:
- Indic ASR at about 74-120M parameters, run through ONNX/sherpa or a vendor SDK;
- small TTS;
- 1B-class LLMs at about 50-65 tok/s;
- auto-capture document scanning.

The safest high-value use of an LLM is phrasing, not deciding. Keep verdicts deterministic and use a template plus TTS for the voice note, with the LLM optional.

### Cited Findings
- Sarvam Edge (14 Feb 2026), each figure as given by Sarvam:
  - ASR: 74M parameters, about 294 MB at FP16, 10 Indic languages, under 300 ms to first token and RTF about 0.12 on a Snapdragon 8 Gen 3;
  - TTS: 24M parameters, about 60 MB, 260 ms to first audio on an S25 Ultra;
  - translation: about 150M parameters, about 30 tok/s.

  The page doesn't list the languages (so Kannada is unconfirmed) or state licensing terms for third-party Android apps. **V** (vendor's own figures) — [Sarvam Edge blog](https://www.sarvam.ai/blogs/sarvam-edge/)
- AI4Bharat IndicConformer Hindi: a 120M-parameter conformer-L with a hybrid CTC-RNNT decoder, gated on Hugging Face. The open-source Android app Uktam.ai runs IndicConformer offline through sherpa-onnx. **S** — [HF IndicConformer hi](https://huggingface.co/ai4bharat/indicconformer_stt_hi_hybrid_ctc_rnnt_large); [Uktam GitHub](https://github.com/ashb155/uktam)
- A third-party GGUF port of IndicConformer reports WER of 13.5% (Kathbath Hindi) and 15.2% (FLEURS Hindi), measured on a desktop GPU and CPU, not a phone. **S** — [IndicConformer-GGUF](https://huggingface.co/Singla0009/IndicConformer-GGUF)
- Qualcomm AI Hub, Llama 3.2 1B Instruct at w4a16: about 64 tok/s on the 8 Elite Gen 5 QRD and about 53.6 tok/s on the 8 Elite. Llama 3 8B: about 16.4 tok/s on the 8 Elite Gen 5. **S** (search summary of the model cards) — [HF qualcomm/Llama-v3.2-1B-Instruct](https://huggingface.co/qualcomm/Llama-v3.2-1B-Instruct); [HF qualcomm/Llama-v3-8B-Instruct](https://huggingface.co/qualcomm/Llama-v3-8B-Instruct)
- The AI Hub page for Whisper large-v3-turbo (quantized) says it is "currently not supported on any Mobile chipset". **S** — [AI Hub Whisper large-v3-turbo](https://aihub.qualcomm.com/mobile/models/whisper_large_v3_turbo_quantized)
- Google says Gemma 3n runs in 2-3 GB of RAM with text, image, audio and video input, and was co-designed with Qualcomm, MediaTek and Samsung. LiteRT added Qualcomm NPU support, and LiteRT-LM runs Gemma 4 on mobile (May 2026). No source confirmed Gemma 3n on a Qualcomm NPU through LiteRT. **S** — [Google Dev Blog: LiteRT NPU](https://developers.googleblog.com/building-real-world-on-device-ai-with-litert-and-npu/); [BGR on Gemma 3n](https://bgr.com/tech/gemma-3n-is-googles-powerful-open-source-ai-that-can-run-on-phones/)
- Ahead-of-time compilation is preferred because on-device compilation of large models "can take over a minute". This matches Sariya's own experience: a ~53 s cold compile avoided with a pre-compiled SM8850 file. **S** — [Google/MediaTek LiteRT post](https://developers.googleblog.com/en/mediatek-npu-and-litert-powering-the-next-generation-of-on-device-ai/); IDEA §7 (internal)
- ML Kit Document Scanner: on-device, auto-capture by default, edge detection and crop. It needs no camera permission in the app, but its UI is fixed and it does no OCR. **S** — [ML Kit doc scanner](https://developers.google.com/ml-kit/vision/doc-scanner)

### Inferences
- **For HackTracker telemetry** (creative phone use, 15%), keep these active in the main loop:
  - camera;
  - NPU segmentation;
  - IMU (Lock);
  - torch;
  - haptics;
  - mic (push-to-talk);
  - speaker (TTS).

  Each is cheap and shows up as real device activity (**U**: how HackTracker weights each sensor is unknown).
- **The LLM is optional:**
  - a 1B model at about 60 tok/s could turn the record into a 60-word Hindi/Kannada voice-note script in about 2 s (**U**, from the AI Hub numbers);
  - but hallucinated numbers in a signed record are a kill-shot;
  - so if used, use it only to rephrase a template whose numbers are filled in deterministically, then check the numbers in the output against the record before TTS.
- BBS-table OCR is the most useful post-event AI feature: it removes the typing of the 5-field spec. It is not worth risking today.
- Whisper-large is not a fit on mobile NPUs per AI Hub. Prefer IndicConformer or Sarvam-class models for Hindi and Kannada ASR **U**.

### Gaps
- No published Hindi or Kannada ASR latency was found for the Snapdragon 8 Elite Gen 5 specifically.
- Kannada coverage of Sarvam Edge is unconfirmed, and so is its licensing for hackathon or commercial use.
- No on-device OCR benchmark was found for Indic or table text on Snapdragon.

## What comparable rebar-inspection apps abroad offer beyond measurement

### Takeaway
Japanese products compete on the record, not the measurement:
- an automatic inspection report (帳票) generated from design values;
- electronic chalkboard data linked to each photo;
- J-COMSIA-certified tamper detection;
- cloud or remote review (遠隔臨場).

Almost all use iPad LiDAR or stereo, so Sariya's real differentiators are offline Android, RGB with a card, India's codes, Hindi and Kannada, and two-key signing.

### Cited Findings
- AIJO 配筋王 (announced 7 Aug 2026, per a search summary):
  - reportedly passed three J-COMSIA certifications;
  - uses the iPad Pro's LiDAR point cloud;
  - links chalkboard information (project, station, member) with the measured results;
  - keeps measurements as a layer on the construction photo.

  **S** (the exact source URL was not confirmed; the likely source is a PR on dime.jp, not fetched) — [dime.jp PR (unverified)](https://dime.jp/company_news/detail/?pr=2663812)
- J-COMSIA certifies construction-photo software for "credibility confirmation (tamper detection)" and for "chalkboard information linkage". Kuraemon and 電子小黒板PhotoManager claim to have passed. Prefectures (Yamaguchi, Ibaraki) require a credibility check at photo delivery, or the supervisor's approval to use an electronic chalkboard. **S** — [J-COMSIA list](https://www.jcomsia.org/kokuban/software/); [Kuraemon PDF](https://kuraemon.com/faq/download/Kuraemon_credibility_check.pdf); [Ibaraki PDF](https://www.pref.ibaraki.jp/doboku/eizen/kikaku/documents/syokokuban_eizen.pdf); [Yamaguchi PDF](https://www.pref.yamaguchi.lg.jp/uploaded/attachment/202674.pdf)
- Actio's Modely (9 May 2024): select the area on screen, and pass/fail, report creation and report sending all complete on site. It works with "LiDAR iPads and iPhones" or laser scanners, checks lap joints and spacer counts, and exports 3D. NETIS CB-230008-A. **V** (press release read) — [Zaikei release](https://www.zaikei.co.jp/releases/2462027/)
- Ecomott × Muramoto 配筋検査ARアプリ (24 May 2022): an 11-inch iPad Pro using LiDAR, which saves values and images, uploads them to a cloud dashboard over Wi-Fi, and exports a PDF report that combines the design drawing with the results. It made no accuracy claim at launch. **V** (press release read) — [@Press](https://www.atpress.ne.jp/news/311114)
- A NETIS field trial (2023) reviewed point clouds, 3D models and reports in the cloud to complete the inspection without a site visit. The estimated labour cost for 50 inspections a year fell from ¥1.6M to ¥0.15M. **S** (search summary of the MLIT Chubu PDF) — [MLIT Chubu NETIS PDF](https://www.cbr.mlit.go.jp/architecture/netis/matching/siryou/230329_01.pdf)
- Japan's Digital Agency pilots for building-code interim inspections captured point clouds and 3D models, extracted measurements automatically and auto-filled report forms. Maeda Corp. overlaid 360° camera captures on structural BIM for remote review. **S** — [Digital Agency report (Dec 2023)](https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/f71d0df6-2415-43d5-bd73-5b7d762cd5f3/35781a3b/20231226_policies_committeetechnology-verificationtype9_report_04.pdf); [summary (Mar 2024)](https://www.digital.go.jp/assets/contents/node/basic_page/field_ref_resources/f71d0df6-2415-43d5-bd73-5b7d762cd5f3/54cb301d/20240329_policies_committeetechnology-verificationtype9_2_summary_03.pdf)
- Fukui Computer's musasi links rebar data to report creation through XML import and export. **S** — [Fukui Computer manual](https://www.fukuicompu.co.jp/mnl/musasi/ver24/mnl/manual/haikinkensa.pdf)
- Academic work:
  - ISARC 2024 (Hunan University): an RGB-D camera with YOLOv8 keypoints at rebar crossings gives a 2.65 mm mean spacing error and handles double-layer mats.
  - Korea University (Earthquake and Structures, 2025): smartphone photogrammetry gave 97% accuracy for length and spacing and distinguished D10 from D13 in the lab.
  - DVNet (2024): real-time placement evaluation with 88.6% precision and 89.3% recall.
  - Sensors (2018): a real-time smartphone system.

  **S** (abstracts only) — [ISARC 2024 paper](https://www.iaarc.org/publications/fulltext/008_ISARC_2024_Paper_235.pdf); [Korea Univ.](https://pure.korea.ac.kr/en/publications/development-of-an-image-based-automatic-reinforcement-modeling-an/); [DVNet, DOAJ](https://doaj.org/article/e870baa46a8f443ea27c17cb71e6a55d); [Sensors 2018](https://www.mdpi.com/1424-8220/18/8/2732)

### Inferences
- **Features to borrow, in order:**
  1. The chalkboard-on-photo record.
  2. Tamper detection stated as a requirement, which Sariya meets with signed hashes; say "tamper-evident", never "tamper-proof".
  3. A design-value → measure → report pipeline in one tap.
  4. Remote review: the Office Kit desk is Sariya's 遠隔臨場.

  (**U**)
- Pitch line, consistent with IDEA §9: "Japan's regulator wrote the checklist for camera rebar inspection in 2023: auto-judge diameter and spacing, prevent tampering, generate the report, cross-check with tape. We built that list for an offline Android phone and Indian codes." (**U**: wording. Note that §2.1 asks for automatic diameter judgement, which Sariya deliberately routes to the weigh test. Present that as an honest deviation.)
- Sariya cannot claim J-COMSIA-style certification. India has no equivalent scheme found (**U**).

### Gaps
- The AIJO 配筋王 primary source was not fetched and its date was not confirmed.
- MLIT's newer (2024-2026) revisions of the digital rebar guidelines under i-Construction 2.0 were not checked; only the March 2023 官庁営繕 trial guideline was read.
- No China or Korea commercial rebar-inspection apps were identified in this pass.
- Buildots, Doxel and DroneDeploy were not researched; they are progress-monitoring tools, not pre-pour rebar QC.
