# Sariya: Phase 1 submission, ready to paste (written 5 Oct 2026)

**Deadline: tonight, 5 Oct 2026, 23:59 IST.** Nothing has been submitted; the agent did not sign in. Only the team leader can submit, and the entry can be re-saved until the deadline.

Form rules (read from the site's own code; details in `notes/10-submission/registration-form-fields.md`): title 5-200 characters; description 50-2,000 characters; a deck is required (PDF or PPT up to 25 MB, or a link); never type the "<" character.

## Steps before the idea form
| Step | Enter |
|---|---|
| Sign in | https://iqoo.reskilll.com/register?city=finale (your Chennai account, same category as before) |
| Register | Tick Grand Finale and "I can attend" (48 hours on site, overnight) |
| Team | 1-3 people, all students or all working professionals. Name: 3-30 characters, letters, digits and spaces only, for example `Team Sariya` |
| Problem statement | Pick **Open Innovation** (any domain, "with a local or open-source model at the core"). All three screening reviewers chose this track for Sariya. If the list has no Open Innovation statement, pick Productivity |

## Idea title (72 characters)
```
Sariya: check a house's steel on one phone, before the concrete hides it
```
Shorter alternative (52 characters): `Sariya: check the steel before the concrete hides it`

## Description, recommended: WHAT / FOR WHOM / HOW layout (1,957 characters; limit 2,000)
Mirrors the form hint "What are you building, for whom, and how?" so a screener can scan it.
```
WHAT: Sariya checks the steel in a house before concrete hides it for good. One iQOO phone and a printed marker card, offline, measure bar count, bar spacing and stirrup spacing by zone against the drawing and IS 456, each with an error band, and speak the fix to the mason in Hindi or Kannada.

FOR WHOM: whoever is paid to check the steel the evening before a pour: the owner's site engineer, builder QC, or a steel or cement brand's technical engineer. Today that is a tape, a checklist and WhatsApp photos; nothing is measured or recorded, and a missing bar or wide stirrups at a beam end are invisible once poured. Housing is 55-57% of India's cement demand (CRISIL, FY25).

HOW: the engineer speaks the drawing's numbers; Gemma 4 E2B on the GPU turns them into five typed fields, each confirmed. Lay the card on the steel and scan. An open segmentation model on the Snapdragon NPU finds every bar live, the card gives true scale, and the geometry and rules are plain code, so every verdict is auditable. Near a limit it says "re-scan" instead of guessing. What a camera cannot see, it asks for: a tape reading, or the weight of a 1 m offcut (10 mm is 0.62 kg/m, 12 mm is 0.89). It speaks: "Beam B2, left end: stirrups at 180, drawing says 100. Add four." The signed record goes to the engineer's laptop over Office Kit for countersigning; replays are rejected.

WHY NOW: Japan's construction ministry has accepted camera-based rebar measurement since July 2023 (5 mm guide on spacing). We found no phone tool for India's pours.

48-HOUR BUILD, all code written at the event: 1. count and spacing on a slab mesh; 2. stirrup spacing by zone on a beam; 3. voice in, spoken fix out; 4. signed record and laptop sign-off over Office Kit.

DEMO: a judge moves or removes a bar on our steel mesh; the phone finds it and the judge checks with a tape. Too far away, it says "re-scan".

Sariya measures and records. The engineer certifies. It never says "safe".
```

## Description, earlier prose version (1,956 characters)
```
The steel inside an Indian house is visible for a day or two, then concrete hides it. On most self-built homes nobody measures it. Sariya lets the site engineer check it the evening before the pour with one iQOO phone and a printed marker card, offline.

How it works: the engineer speaks the drawing's numbers, lays the card on the steel and scans. An open segmentation model on the Snapdragon NPU finds every bar live; the card gives true scale. The phone reports bar count, bar spacing and stirrup spacing near beam ends, each with its error band, and checks them against the drawing and IS 456. Near a limit it says "re-scan" instead of guessing. For what a camera cannot see (cover, diameter, hooks) it asks for a tape reading or the weight of a 1 m offcut (10 mm is 0.62 kg/m, 12 mm is 0.89) and records it. It speaks the fix to the mason in Hindi or Kannada: "Beam B2, left end: stirrups at 180, drawing says 100. Add four."

Japan's construction ministry has accepted camera-based rebar measurement since July 2023, with a 5 mm guide on spacing. We found no phone tool for it in India, where housing is 55-57% of cement demand (CRISIL, FY25).

48-hour build, all code written at the event:
1. Bar count and spacing on a slab mesh.
2. Stirrup spacing by zone on a beam.
3. Voice in, spoken fix out.
4. A signed record the engineer countersigns on the laptop over Office Kit; replays are rejected.

Open models, attributed; a short fine-tune on public rebar images, with classical line detection as the fallback. Segmentation on the NPU with timings on screen; Gemma 4 E2B on the GPU for voice; geometry and rules are plain code, so every verdict is auditable. Airplane mode throughout.

Demo: a judge moves or removes a bar on a steel mesh we bring. The phone finds it and draws the measurement; the judge checks it with a tape. From too far away, the phone says "re-scan".

Sariya measures and records. The engineer certifies. It never says "safe".
```

## Video walkthrough URL (optional)
Leave empty unless you have real site footage: a phone filming steel before a pour with a tape in frame. Never a mocked-up app; code may only be written at the event.

## Prototype URL (optional)
Leave empty. Nothing is built, by rule.

## Deck / document (required)
You are making the deck yourself. The form needs a PDF or PPT up to 25 MB, or a link. Content you can reuse is in `SUBMISSION_DECK.html` (nine slides) and its export `SUBMISSION_DECK.pdf`; both still show a team placeholder on slide 9. Whatever you build, keep it consistent with the description above: four build items, the same numbers, and the limits stated plainly.

## Android proficiency and LLM proficiency
Choose truthfully. Options: `No Android experience` / `Basic` / `Intermediate` / `Expert / shipped apps`, and `No LLM experience` / `Cloud APIs only` / `Experimented with local LLMs` / `Deployed local LLMs on-device`. If you built on the iQOO 15 at the Chennai battle, "Deployed local LLMs on-device" is fair only if a local model actually ran in that build.

## Prior builds & hackathons (optional; first 1,000 characters kept; "helps shortlisting")
Recommended, from the team's real record (967 characters with brackets; keep filled brackets short or delete them):
```
iQOO Hackathon 2026, Chennai City Battle: built One-Take, a local AI video-editing agent, on the iQOO 15 (github.com/Melvin0070/One-Take-IQOO-Hackathon). Sariya reuses no code or assets from it.

Hackathons: 3+ years competing as one team; won 3+ state-level TinkerHub hackathons [names, years] and several university-level ones; mentored at others.

Shipped: agentic AI products and production features at Xavier AI, LiveAltLife, Kalvium Labs and Montra Electric.

Open source: contributions to Kubeflow and Zerodha projects [PR links].

Built:
- Kora: graph-first memory engine for AI agents, self-hosted, Apache 2.0. github.com/NarayanaSabari/Kora
- amberfork: aligns a failing AI-agent run against a known-good run, locally. github.com/Melvin0070/amberfork
- Cutline: AI video-editing agent; turns raw footage into a captioned story with b-roll and publishes it [link]
- velvet: self-hosted ticketing and work log for small teams. github.com/NarayanaSabari/velvet
```

Earlier template:
Keep only what is true. Do not say finalist or winner unless you were.
```
Shortlisted for the iQOO Hackathon 2026 Chennai City Battle (12-13 Sep) through this same idea screening. There we built [One-Take: one line on what it does] on the iQOO 15 in 30 hours, including the phone-only Red Light hours and Office Kit. [Result you actually earned.] Sariya is a new idea: no code or assets from that build are reused, and every line will be written at the Finale from an empty repo. [Other builds, one line each, with links.]
```

## What makes you and your team stand out? (optional; first 1,000 characters kept)
Recommended (5 Oct, latest; 976 characters). Leads with why this problem: the specific errors, the one-day window, then the team. The four errors are attributed to the team's construction friends, so confirm they match what the friends said:
```
Why this problem: friends who run construction sites told us what goes wrong in the steel: stirrups spaced evenly where the drawing wants 100 mm at beam ends, top bars over supports trampled flat, no cover blocks, a 10 mm bar swapped for 12. Each takes minutes to fix the evening before the pour, and is invisible forever after it. At Gurugram's Chintels Paradiso, failed steel was found only after a collapse killed two; last month a house near Ambala fell mid-pour, killing six. Japan accepts camera rebar checks; India's pours get a tape, if that.

Team: three Kotlin-first Android engineers who ship agentic AI, with 3+ years and 3+ state-level TinkerHub wins together, and a local AI agent already built on this iQOO 15 at Chennai. We quantize and place our own models (segmentation on the NPU, Gemma on the GPU, speech on the CPU), plan for heat, battery and the phone-only hours, and our scan says "re-scan" rather than guess. The idea survived an adversarial red team.
```

Older versions:
Recommended (5 Oct, final; 976 characters). Collapses are stated as events only; neither cause is known, so never say they were caused by steel errors:
```
Skills: three Kotlin-first Android engineers who ship agentic AI and built a local AI agent on this exact iQOO 15 at Chennai. We quantize and place our own models: segmentation on the NPU, Gemma on the GPU, speech on the CPU.

Homework done: Sariya survived an adversarial red team and a six-idea comparison. Every claim is checked at source.

Built for the demo hall: thermal and battery budgets, the phone-only hours, a kill-switch per feature, and a scan that says "re-scan" rather than guess.

Domain edge: friends at construction companies tell us the steel check before a pour is a tape and a WhatsApp photo, if it happens at all.

Why this problem: at Gurugram's Chintels Paradiso, corroded steel was found only after a collapse killed two, and last month a house near Ambala fell while its slab was being cast (6 dead). Once concrete covers the steel, nobody can check it.

Prior collab: 3+ years building and winning together, including 3+ state-level TinkerHub wins.
```

Previous draft:
```
Skills: three Kotlin-first Android engineers who ship agentic AI at work and already built a local AI agent on this exact iQOO 15 at Chennai. We quantize and place our own models: segmentation on the NPU, Gemma on the GPU, speech on the CPU, timings on screen.

Homework done: Sariya survived an adversarial red team and a six-idea comparison. We checked every claim at source: Japan's 2023 rebar guideline, IS 456 limits, which models run on this chip's NPU.

Built for the demo hall, not the lab: thermal and battery budgets, the phone-only hours, a kill-switch per feature, and a scan that says "re-scan" rather than guess. The demo is a judge moving a bar on our mesh and checking us with a tape.

Domain edge: [we taped the steel at N Bengaluru pre-pour sites; M had a violation.]

Why this problem: [one true personal line.]

Prior collab: 3+ years building and winning together, including 3+ state-level TinkerHub wins.
```

Previous draft:
```
Skills: we ship agentic AI for a living (Xavier AI, LiveAltLife, Kalvium Labs, Montra Electric) and have already built a local AI agent on this exact iQOO 15 at the Chennai City Battle, so we know the device, its NPU path, the phone-only hours and Office Kit. We build with frontier coding models, so the four promised items are our floor: next come reading the bar schedule from a photo and a pour log for the whole house.

Prior collaboration: we have built and won together for 3+ years, including 3+ state-level TinkerHub wins.

Domain edge: [we taped the steel at N Bengaluru pre-pour sites; M had at least one violation; those photos are our test set.]

Why this problem: [one true personal line.] Once concrete is poured, a missing bar is hidden for good, and today the only check is a tape and a WhatsApp photo. We publish what the phone cannot do, and it says "re-scan" rather than guess.
```

No-facts-needed version (847 characters; every line true as long as you built at Chennai):
```
We have already built on this exact iQOO 15 under these rules at the Chennai City Battle, so we know what the phone-only hours, the NPU path and Office Kit demand, and we won't lose hour one to setup. We build with frontier coding models, so the four promised items are our floor, not our ceiling: once they are solid we add reading the bar schedule from a photo and a pour log for the whole house.

Why this problem: steel is the one part of a house that is checked for a day and then hidden forever, and today that check is a tape and a WhatsApp photo. Japan already accepts camera-based rebar measurement; we want India's site engineers to have it on a phone they already own.

We are honest about limits: the phone does not judge bar diameter or cover from a scan, and it says "re-scan" whenever a reading is within its own error of the limit.
```

Earlier template:
Replace the brackets; delete any sentence that is not true. If you have no site data yet, delete the second sentence instead of guessing a number.
```
We have already built on this exact phone under these rules at the Chennai City Battle, so we know what the phone-only hours and Office Kit demand. We write code with frontier coding models, so the four promised items are our floor, not our ceiling: once they are solid we add reading the bar schedule from a photo, reading the scale for the weigh test, and a pour log for the whole house. [We have taped the steel at N Bengaluru pre-pour sites this month and bring those measurements as our test set.] We publish what the phone cannot do: it does not judge bar diameter or cover from a scan, and it says "re-scan" when a reading is within its own error. [Teammate: Android and camera. Teammate: model conversion and on-device inference. Advisor: structural engineer, named with consent.]
```

## Checkbox
"I confirm this idea is our team's original work and any pre-existing components are disclosed." True for Sariya as planned: open models, public datasets and OpenCV are third-party components to attribute in the repo. One-Take must not be reused (the terms bar work built for another competition).

## Email to the organisers (draft; you send it)
To: sameera@reskilll.com
```
Subject: Grand Finale direct entry (Sariya): five rule questions

Hello,

We are entering the Grand Finale directly and want to stay inside the rules. Could you confirm:

1. May we start from public pretrained model weights and fine-tune them at the event, on public datasets plus photos and tape measurements we collected ourselves beforehand?
2. May we bring demo props into the venue and onto the stage: a 45 cm steel mesh, a short beam cage, printed marker cards and a tape measure?
3. Does HackTracker count camera, microphone and on-device model use inside our own app, and is installing our own debug builds on the loaner phone treated as normal?
4. Are there per-track awards at the Finale?
5. Which phone model, RAM and OS version will the Finale loaners be?

Thank you,
[Name], [team name]
```

## What changed from IDEA.md v2 for this submission (v3)
| Change | Why |
|---|---|
| Plain title and a first paragraph with one pictured user and moment | All three screening reviewers asked for it; the model was "several clicks deep" |
| Description cut to four Tier-1 items; payers, two-key detail, anti-reuse and roadmap moved to the deck or dropped | Scope fit was Sariya's lowest screening score (5, 5, 6 of 10) |
| Compute split stated: segmentation on the NPU, Gemma 4 E2B on the GPU, geometry and rules in code | Technical depth and "open model at the core"; no NPU build of Gemma 4 E2B exists for this chip |
| Spec entered by voice and parsed by Gemma 4 E2B into five typed fields, each confirmed | Gives the language model real work and adds microphone use, without letting it decide a number |
| Japan claim worded as "accepted since July 2023, 5 mm guide on spacing" | Verified by opening the ministry PDF |
| Collapse statistics and the "most houses" claim kept out of the description | No source attributes collapses to steel; no Indian defect-rate data exists |
| Rulebook: slab secondary bars 5d or 300 mm; IS 13920 beam-end rule advisory in Bengaluru (Zone II) | Corrections from the fact-check |
| Office Kit made two-way: drawing numbers and bar schedule go laptop to phone; the signed record and review go phone to laptop | Office Kit scored 5-7 of 10 with reviewers when it only carried a report |

## Claims never to make (submission, deck and pitch)
- "Safe", "certified", "pass", "pour permit", "replaces the engineer", "tamper-proof".
- "First in the world" or "only stereo and LiDAR exist". Japan ships this; say so first.
- "Most houses are built without an engineer" (unmeasured), any link between a named collapse and its steel.
- "IS 13920 is mandatory in Bengaluru" (Zone II), "the 2025 seismic code is in force" (withdrawn March 2026).
- "Gemma runs on the NPU" (GPU on this chip), "3 ms segmentation" unless measured on the loaner.
- Any accuracy number not measured by the team; any partner or engineer named without consent.
- "Tells 10 mm from 12 mm bars from a scan." It does not; the scale does.
