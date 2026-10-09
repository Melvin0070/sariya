# Sariya: final answers, Phase 1 (5 Oct 2026, deadline 23:59 IST)

Supersedes the field texts in SUBMISSION.md. Character counts checked; no "<" anywhere.

## Before the idea form
- Track / problem statement: **Open Innovation** (fallback: Productivity).
- Team name: `Team Sarpatta`.

## Idea title (72 / 200)
```
Sariya: check a house's steel on one phone, before the concrete hides it
```

## Description (1980 / 2,000)
```
WHAT: Sariya checks the steel in a house before concrete hides it for good. One iQOO phone and a printed marker card, offline, measure bar count, bar spacing and stirrup spacing by zone against the drawing and IS 456, each with an error band, and speak the fix to the mason in Hindi or Kannada.

FOR WHOM: whoever is paid to check the steel the evening before a pour: the owner's site engineer, builder QC, or a steel or cement brand's technical engineer. Today that is a tape, a checklist and WhatsApp photos; nothing is measured or recorded, and a missing bar or wide stirrups at a beam end are invisible once poured. Housing is 55-57% of India's cement demand (CRISIL, FY25).

HOW: the engineer speaks the drawing's numbers; Gemma 4 E2B on the GPU turns them into five typed fields, each confirmed. Lay the card on the steel and scan. An open segmentation model on the Snapdragon NPU finds every bar live, the card gives true scale, and the geometry and rules are plain code, so every verdict is auditable. Near a limit it says "re-scan" instead of guessing. What a camera cannot see, it asks for: a tape reading, or the weight of a 1 m offcut. It speaks: "Beam B2, left end: stirrups at 180, drawing says 100. Add four." The signed record goes to the engineer's laptop over Office Kit for countersigning.

WHY NOW: Japan's ministry has accepted camera rebar checks since July 2023 (5 mm guide on spacing). India's site-QC apps only store photos; cover meters work after the pour.

BUILD, all code at the event, full loop by hour 30: every model is open and ready-made; we fine-tune one and write the glue and rules. 1. count and spacing on a slab mesh; 2. stirrup zones on a beam; 3. voice in, fix out; 4. signed record over Office Kit. Each has a fallback.

DEMO: a judge moves or removes a bar on our steel mesh; the phone finds it and the judge checks with a tape. Too far away, it says "re-scan".

Sariya measures and records. The engineer certifies. It never says "safe".
```

## Video walkthrough URL
Leave empty.

## Prototype URL
Leave empty. The field means "live demo / repo"; anything there before the event reads as a pre-built product.

## Deck
Upload **a PDF**, not the .pptx: the deck uses IBM Plex Sans, IBM Plex Mono and Oswald, none embedded, so a screener without them sees fallback fonts and possible overflow. Export the PDF from `Sariya check the steel before the concrete hides it v2.pptx` on a machine that has those fonts, or open it in Google Slides (all three are Google Fonts) and download as PDF. Check every slide in the PDF before uploading.

## Android proficiency
`Expert / shipped apps` if you have shipped Android apps; otherwise `Intermediate`.

## LLM proficiency
`Deployed local LLMs on-device` if One-Take ran a local model on the iQOO 15; otherwise `Experimented with local LLMs`.

## Prior builds & hackathons (962 / 1,000)
```
iQOO Hackathon 2026, Chennai City Battle: built One-Take, a local AI video-editing agent, on the iQOO 15 (github.com/Melvin0070/One-Take-IQOO-Hackathon). Sariya reuses no code or assets from it or from anything below.

Hackathons: 3+ years competing as a team; won 3+ state-level TinkerHub hackathons and several university-level ones; mentors at others.

Shipped: agentic AI products and production features at Xavier AI, LiveAltLife, Kalvium Labs and Montra Electric.

Open source: PRs to Kueue, the Kubernetes job-queueing project (github.com/kubernetes-sigs/kueue/pull/9885, /9886); contributions to Zerodha OSS.

Own builds:
- Kora: self-hosted, graph-first memory engine for AI agents. github.com/NarayanaSabari/Kora
- amberfork: lines up a failing AI-agent run against a known-good one, locally; starred and used. github.com/Melvin0070/amberfork
- Cutline: AI video-editing agent that turns raw footage into a captioned story with b-roll and publishes it.
```
If the Kueue PRs were merged, write "merged PRs". Put real numbers in place of "starred and used" if you have them.

## What makes you and your team stand out? (979 / 1,000)
```
Why this problem: steel is checked for a day, then concrete hides it forever. At Gurugram's Chintels Paradiso, failed steel was found only after a collapse killed two; last month a house near Ambala fell mid-pour, killing six. Japan accepts camera rebar checks; Indian pours get a tape, if that.

Domain edge: friends who run construction sites gave us the real errors: even stirrups where the drawing wants 100 mm at beam ends, top bars trampled flat, no cover blocks, a 10 mm bar swapped for 12. Each is a minutes-long fix before the pour.

Skills: a team of three that ships agentic AI at work and built a local AI agent on this iQOO 15 at Chennai. We place our own quantized models (segmentation on the NPU, Gemma on the GPU, speech on the CPU) and budget heat and battery. Demo: a judge moves a bar and checks us with a tape.

Prior collab: 3+ years building together, 3+ state-level TinkerHub wins. Sariya survived an adversarial red team; every claim is checked at source.
```
Confirm the four steel errors match what your site friends said, and that the Ambala collapse was in September.

## Checkbox
Tick it. One-Take is disclosed above and not reused; open models, datasets and OpenCV get attributed in the repo.
