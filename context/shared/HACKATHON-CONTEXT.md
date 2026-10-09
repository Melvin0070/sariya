# iQOO Hackathon 2026 Grand Finale: the facts every session needs

Condensed from ~/Desktop/iqoo-finale-ideation (research/A-D, site scrape, DEEP-RESEARCH, PRODUCT-LENS).
Re-verify anything marked [verify] before it goes on a slide.

## Event
- **Grand Finale:** Bengaluru, **9-11 Oct 2026**, 48 h, Friday evening to Sunday evening. The field is the top 6 from each of 4 cities (24 teams) plus screened direct entries. Prize pool: ₹25 lakh.
- **Direct-entry status [verify today]:**
  - Press (itvoice) says applications closed on 27 Sep 2026.
  - The site still says "direct online registrations also open".
  - Check the dashboard at iqoo.reskilll.com/register?city=finale, or email sameera@reskilll.com.
- **Screening:** direct entries are screened like city entries, on novelty, tech impact, problem choice, idea/scope fit (the form says 30 h; the Finale is 48 h) and phone-first fit.
- **The form asks for:**
  - track;
  - title ("short, punchy");
  - "What are you building, for whom, and how?";
  - a deck or doc (required, PDF/PPT up to 25 MB);
  - optional video and repo;
  - Android and LLM proficiency;
  - prior builds;
  - "what makes the team stand out";
  - an originality disclosure.
- The server rejects the `<` character in the title and description.
- **Finale tracks:** Mobility, Community App (Finale-only: "connects developers, professionals, or interest groups, with AI (preferred on device) at the core"), Smart Living, Productivity, Developer Tools, Open Innovation. **FinTech, Education and Health are dropped.**

## Rubric (on-site)

| Criterion | Scored by | Weight |
|---|---|---:|
| End product quality: works, useful, would someone keep using it | Jury | 30 |
| Novelty and impact | Jury | 20 |
| Creative phone use: camera, voice, on-device AI | HackTracker device data | 15 |
| Technical depth: architecture, code quality, robustness, real use of hardware | Jury | 15 |
| Office Kit usage: counts and durations | HackTracker device data | 10 |
| Demo: 3-5 min, on the iQOO phone | Jury | 10 |

- "A well-built simple product beats a broken complex one."
- The jury "sees your demo cold at the end".
- A local or open-source model at the core earns brownie points.

## Format and rules
- **Red Light:** 55% of build time is phone-only; the laptop is reachable only through Office Kit (screen mirror, clipboard, file transfer, remote control).
- **Green Light:** both devices.
- Eval rounds feed a Top 10, then a final pitch.
- **All code is written at the event.** Open-source libraries and models are fine with attribution.
  - Pre-collected data and research are treated as allowed by past teams.
  - **A model trained before the event: ask the organisers in writing.**
- **Terms:** work "developed for or submitted to another competition" leads to disqualification. That rules out One-Take and Blueprint.
- Teams are 1-3 people, all students or all working professionals.

## Device
- Loaner: iQOO 15, Snapdragon 8 Elite Gen 5, 12 or 16 GB RAM, OriginOS 6 (Android 16), 7,000 mAh battery, 2K/144 Hz display.
- **No LiDAR/ToF, no UWB, no barometer, and not on ARCore's supported list.** Metric measurement needs a fiducial, a known-size object, or learned depth.
- Office Kit pairs with x86 Windows or macOS laptops.

## Jury
- **The Finale panel is not announced.**
- City panels (15 people): ~7 founder/CTOs; ~6 enterprise architects or EMs (AWS, Microsoft, Genpact, LTIMindtree, EPAM, Swarovski); 2 security leads (Microsoft, Mahindra); nasscom AI; DevRel (ClickHouse).
- Mentors include Qualcomm DevRel (Kartikey Rawat).
- Expect questions like "what happens when X fails?", "who pays?", "where does the data go?", "what needs the NPU?".

## What already exists in the field (don't look like these)
- **City winners:**

  | City | Winners |
  |---|---|
  | Bengaluru | Tokito (circuit debug), Mira.ai (yoga), PhoneOS AI (agent), SecondSense (blind obstacles), Anchor (GPS integrity), Kavach (scam calls) |
  | Pune | Jammify, Pune Tree Rakshak (civic report to PMC), DailyFlow, RightPosture, NoCapRX, Origo |
  | Chennai | Nila (baby monitor), Nazar (scam), Assemblix, Consent-Cam, Jugaad Agent, Saathi |
  | Hyderabad | Results not public yet |

- **Other repos seen:** Rakshak (2W crash detection + Gemma + HMAC audit, Hyderabad), ResQ (offline first aid), SmartLease (move-out inspection + signed PDF), Vault (phone as secure co-processor over the Office Kit clipboard), six screenshot-memory apps, code reviewers.
- **AI-brainstorm attractors to avoid:** meetup radars, scam shields, station-announcement listeners, last-50 m trails, home sound sentinels, flood depth, NPU benchmarks, bus-board readers, IR remotes, teach-once guides.

## What wins: 7 traits (TreeHacks, HackMIT, Cal Hacks, Gemma challenges, Qualcomm, iQOO cities, Reskilll)
1. One physical-world act a judge can watch.
2. A named user with a hard constraint; a co-designer on record.
3. Visible technical ambition ("shouldn't be possible on this hardware in 48 h").
4. Stakes: lives, money, rights.
5. A deterministic core; the model perceives; it abstains when unsure.
6. Measured proof on stage: an error table, a judge checking with a tape, "0 bytes out".
7. A closed loop into an institution (engineer, police, insurer, municipality).

Reskilll juries repeatedly reward **trust and verification / anti-fraud** and **civic reports routed to a real authority**.

## On-device tech (2026) worth knowing
- **Gemma 4 E2B/E4B:** image + audio in, tool calling; ~30 tok/s class on the NPU; LiteRT-LM.
- **Real-time camera VLMs:** FastVLM-0.5B at 0.12 s TTFT on the 8 Elite Gen 5 NPU via LiteRT QNN; LFM2.5-VL-3B for grounding at 20 tok/s.
- **Qualcomm AI Hub:** YOLO ~1.6 ms, OWLv2/WeDetect open-vocab detectors, depth models.
- **GenieX:** Qualcomm's open-source runtime for NPU LLMs.
- **Voice:** AI4Bharat IndicConformer (22 languages, MIT); Gemma 4 audio ASR (Indic quality unverified).
- **Evidence signing:** Android Keystore/StrongBox key attestation.

## Codex partner
`codex exec -m gpt-6-astra` (the config's default effort is low; pass high for research, xhigh for red team). Past runs hit usage limits, so keep prompts scoped.

## Deeper sources
- ~/Desktop/iqoo-finale-ideation/research/A-ondevice-tech.md, B-india-market.md, C-winning-patterns.md, D-sponsor-whitespace.md
- shared/DEEP-RESEARCH-2026-09-30.md
- shared/PRODUCT-LENS-2026-09-30.md
- shared/REDTEAM-RUBRIC.md
- shared/faq.txt, guide.txt, terms.txt
