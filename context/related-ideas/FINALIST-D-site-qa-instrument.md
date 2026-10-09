# FINALIST D: Pour Card and Tap Map — the two site checks still done by ear and by eye

- Status: FINALIST (Session B, 2026-10-04). Not yet red-teamed.
- Built from: cl-05 and fa-16 (tile tap test; reached independently by two sources), cl-11 and fa-07 (rebar pour check; also reached twice). Collision evidence in those files; deep research in research/10-site-qa-deep.md.
- Track: Smart Living (home handover) or Open Innovation.
- One-sentence hook: Tap a tile and the phone hears whether it is hollow; photograph the steel before the pour and the phone checks it against the drawing.

## The seven required fields

| Field | Content |
|---|---|
| Named user, doing a task they already must do | The developer's QA engineer or project-management consultant's site engineer signing the pour card before concrete is poured; and the handover inspector (inspection firm or builder's handover team) tapping tiles in a finished flat. Both are paid to check the contractor. |
| What it plugs into | The pour card / reinforcement checklist, and the snag list in the handover report. |
| Payer and budget owner | Developer's QA head or third-party QA firm (advertised fee up to 1% of project cost, single-vendor listing); home-inspection firms (about Rs 8,000-13,000 per flat). |
| Why now (dated) | Weak. No Indian mandate or dated trigger was found for either check. MahaRERA's quality certificate (2024) is Maharashtra-only. The Karnataka Apartment Bill 2026 passed both houses in Aug 2026 but is not in force and has no handover-inspection duty. Japan created the rebar category with a July 2023 guideline; Tokyu runs a phone-plus-marker system. https://www.tokyu-cnst.co.jp/technology/2740.html |
| What the phone does on-device, and why local | Tap test: classifies each tap as bonded or hollow and builds the floor map with a percentage. Rebar: from a photo with a marker, counts bars and measures spacing and bar-size class against the bar-bending schedule; signs the pour card. Local because rafts, basements and unfinished towers have no signal and both checks need an answer on the spot. |
| Physical act a judge can watch or check | A tile board with hidden voids: the judge taps with a coin and the phone marks the hollow tiles, then the board is turned over to show the voids. A table-top rebar grid with a marker: the judge shifts or removes one bar and the check fails at that spot. |
| Kill criteria for a first pilot | Hollow-tile accuracy below 90% on real floors with site noise (studies show 91.5% in the field and 82% with 75 dB speech [U]); bar-size class wrong more than 1 in 20; engineers will not carry the marker; no developer or inspection firm pays per seat. |

## Oh-wow moment
The judge taps tiles they cannot tell apart and the phone finds the hollow ones; the board is flipped to prove it.

## Physics check
- Tap sound: classification, not measurement; 80-92% realistic on real floors; unprocessed microphone access on the loaner unconfirmed [U]; the floor map depends on tap order because ARCore is not available.
- Rebar: single camera with one marker gives about 3-5 mm on spacing and 1-1.5 mm on diameter (derived), so telling 10 mm from 12 mm bars is marginal; double layers fail without metric depth. The one shipping phone system uses five angled photos and cloud processing.

## What the research took away
The paid inspection market is small: about 690 inspections a year at 1% of Bengaluru handovers, roughly Rs 0.55-0.9 crore. No IS code sets a hollow-tile tolerance, so a percentage has no legal pass mark.

## Hackathon shaping
- On-device: small audio classifier; detector plus homography for rebar; Gemma 4 E2B for the report.
- HackTracker: camera and microphone throughout; Office Kit sends the pour card to the laptop.
- Collision: no city winner; the "machine / site inspection" repo cluster (about 9) does safety and general inspection, not these acts; no phone tap app found in English, Chinese, Japanese or Korean; rebar is crowded in Japan and empty in India.

## Rough self-score (optimistic)
| Pain | Payer | Market | Distribution | Moat | Space | Feasibility | Time to value | Risk | Wow | /90 without Wow | /100 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 6 | 4 | 3 | 5 | 5 | 7 | 6 | 8 | 8 | 9 | 52 | 61 |

## Unverified [U]
Tap-study figures (page blocked); CPWD specification clause; developers' QA budgets; microphone access on the loaner; any practitioner on record.

## Hackathon-rubric note (fresh-context judge, 2026-10-04; notes/hackathon-rubric-scores.md)
Rubric 74/100 as tap plus rebar. The tap map alone scores 76, the highest of all 54 ideas scored. For the hackathon, lead with the tap test and drop or demote the rebar check; first-hour check on the loaner: unprocessed microphone access and how a coin tap records in hall noise. Add a named open model and local-language voice for brownie points (currently 5/10).
