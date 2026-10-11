# Final pitch, 11 Oct 2026: the 3:30 run

Supersedes `demo-script.md` §2 for today. It is built on `Sariya · Grand Finale.pptx`: live slides 1-5, then backups B1-B10 for Q&A. Every on-screen string quoted below is the app's own text (`lib/fix.ts`, `lib/rules.ts`, `lib/pack.ts`).

**Roles.** A speaks and never touches a phone. B runs the scan phone (P1) and the scale, and stays silent. C is the engineer: engineer phone (P2), Office Kit on the laptop, and the third phone (P3). C speaks only during 2:15-2:50.

**The arc**, which is the reason for this order:
1. a concrete scene;
2. the judge acts, because people believe what their own hands did;
3. the phone talks and we stay silent;
4. the judge's own tape proves it;
5. the phone refuses to guess, which reads as honesty;
6. it knows the bar was moved, not missing (the surprise peak);
7. fake steel caught on a kitchen scale (the stakes);
8. two keys, and a replay is rejected (trust);
9. numbers, then an ask that calls back to the opening (the peak-end rule).

Target 3:20, hard stop 3:30. About 45 spoken words per 20 s. If a line runs long, drop its second sentence, never its number.

## The run

| Time | Screen | Who | Words (exact) | Action |
|---|---|---|---|---|
| setup | **Slide 1** | | | Props on the table: the 5 × 5 mesh @ 50 with card S front-left, the beam top face, the 200 mm offcut labelled "12", the scale, the tape, four fault cards face down. |
| 0:00 | **Slide 2** | A | "Tomorrow at seven, a slab is poured in a house in Bengaluru. Tonight its steel is visible. By noon it's under concrete for the life of the house. A missing bar, a wrong size, a stirrup in the wrong place: minutes to fix tonight. After the pour, the only fix is a jackhammer." | Slow. Pause after "jackhammer". |
| 0:20 | **Slide 3** | A | "Japan's government has accepted camera checks of rebar since 2023. We built it for India: one phone, a printed card, offline. *(to the judge)* Pick a card. Do what it says. Don't tell us which." | Hands the judge the four fault cards (F1, F2, F3, F12). |
| 0:30 | slide 3 | A | *(while the judge works)* "These are half-scale props so they'd pass security. The app checks whatever the drawing says; here it's 8 mm bars at 50. Every phone is in airplane mode." | C switches the laptop to the Office Kit mirror of P1. |
| 0:45 | P1 mirror | A | "Scan." Then **silence**. | B scans at about 30 cm. Lines snap onto the bars and gaps show in mm. Lock. |
| 0:55 | P1 mirror | (the phone speaks) | | The verdict appears and the Hindi plays with subtitles. **F1:** "Gap 3 is 100 mm. Drawing says 50 mm. Add 1 bar in gap 3." **F2:** "Gap 3 is 80 mm… Move the bar between gap 3 and gap 4 by 30 mm." **F3 (beam):** "Rings are at 100 mm. Drawing says 50 mm for the first 150 mm. Add 1 ring." |
| 1:05 | frozen frame | A | "The phone drew the gap it measured. Tape it, centre to centre." | The judge tapes the highlighted segment and reads the value aloud. |
| 1:15 | same | A | "Inside the band. The band was on the screen before your tape came out. If the tape disagrees, it goes in the record, not under the rug." | |
| 1:25 | P1 mirror | A | "Now a hard case. Just past the limit, from too far away." | B slides one top bar about 22 mm, so the gaps become ~72 and ~28. B scans from 0.8 m. |
| 1:32 | | (the phone) | | "Move closer (about 30 cm), hold still and lock again." Lock is disabled. |
| 1:36 | | A | "It would rather say 'move closer' than guess." | B scans at 30 cm: "72 ± 5, limit 65: Outside limits." The fix reads "Move the bar … by 22 mm". |
| 1:42 | | A | "Notice what it didn't say. Not 'add steel'. It worked out that a bar was **moved**, and by how much." | **Peak 1.** Let it land: 2 s of silence. |
| **1:50** | | | *Check the clock: behind? Skip the next row.* | |
| 1:50 | P1 mirror | A | "A camera can't tell a 10 from a 12 at arm's length, so we don't pretend. Twenty centimetres of bar on a kitchen scale." | B puts the offcut labelled "12" on the scale; P1 reads the display. |
| 2:00 | | A | "A 12 weighs 178 grams. This one, labelled 12, weighs 123. It's a 10. Fake and underweight steel fails here." | Screen: "This 200 mm piece weighs 123 g: it matches 10 mm steel. Drawing says 12 mm. Stop. Show this to the engineer before the pour." **Peak 2.** |
| 2:15 | P2 mirror | C | "I'm the engineer. I signed the drawing values this morning. The record arrives on my desk, checked against them." | B sends the pack; C opens it on P2, mirrored. The frames, the tape reading and the weigh result are all visible. |
| 2:27 | | C | "My key, not the operator's." | C enters the PIN and approves. The QR appears. |
| 2:33 | | A | "Any phone checks it, offline." | C scans the QR with P3: verified. |
| 2:38 | | C | "Yesterday's record, sent again." | "Rejected: already processed." |
| **2:45** | | | *Check the clock: behind? Cut the replay row next time; at the stage, go straight to the numbers.* | |
| 2:50 | **Slide 4** | A | "On this phone's NPU the model takes 12 milliseconds a frame: 19 times the CPU, and 12.8 sustained for a minute without throttling. AI finds the bars. Maths measures them. Rules decide." | Optional, only if the numbers screen shows it: "[k] of [m] tape checks inside the band." |
| 3:05 | **Slide 5** | A | "Steel brands already send engineers to slab pours. A missing bar found tonight sells their steel and their trust. We're asking for one brand's team for a 60-pour pilot from November, one structural engineer to sign our tolerances, and three iQOO 15s on real sites." | |
| 3:18 | slide 5 | A | "The steel is visible for one evening. Sariya measures and records. The engineer certifies." | Stop. Hands still. Look at the jury. |

Banned words on stage: safe, PASS, permit, certified (for Sariya), tamper-proof, first, "nothing leaves the phone" (the pack does, as a signed file), and "he" or "his" for the mason. "The engineer certifies" is fine: it is the point.

## Clock rules
- **At 1:50, if behind:** skip the weigh test and say one line: "Bar size is weighed, not guessed: it's in the backup."
- **At 2:45, if behind:** skip the replay and go to slide 4.
- **At 3:05, whatever is on screen:** say the ask and the closing line. Never cut the judge's tape check or the PIN approval.
- **If the judge draws F12** (lower layer): the phone says "Lower bars: gap 2…". A adds: "Both directions, bars under bars, with a wider band, and it says so." Then drop the 1:25 hard case to save time and go straight to the weigh test.

## When it breaks
Name it, show the fallback, move on. Never debug on stage.

| What breaks | Say | Do |
|---|---|---|
| Card not detected (glare) | "It's telling us why: glare on the card. That's the honest failure." | B tilts the board and wipes the card, 15 s max. Then play this morning's recorded scan and say so. |
| Wrong count or gap | "That's a miss. It's why the engineer signs and never the phone." | Show the frozen frame, re-scan once at 30 cm, then move to the tape. |
| The tape disagrees | "The tape wins. That goes in the error table tonight." | Read both numbers aloud. Move on. |
| The judge measures the clear gap | "That's the clear gap. Add one bar width, 8, and it's centre to centre, like the drawing." | |
| Shows GPU, not NPU | "It fell back to the GPU on this run; the readiness screen says which. The live loop holds either way." | Quote the NPU figure from slide 4 as measured on this phone. |
| TTS silent | "Subtitles are the main channel; the voice is for the mason." | B taps replay once; otherwise A reads the Hindi subtitle. |
| Office Kit mirror drops | "The desk lost the mirror; the record is on my phone." | C holds P2 up to the jury. The PIN approval still happens. |
| Pack transfer fails | (silence) | Quick Share. If that fails, C opens the identical rehearsal pack and A says "the same pack, sent at rehearsal". |
| P1 overheats or crashes | "Hot spare." | B takes P3 and repeats the scan from the beat that was lost. |
| The judge won't come up | "Then I'll be the judge." | A draws a card and reads it aloud; B applies it. |

## Q&A: two sentences, then the backup slide
| Question | Answer | Show |
|---|---|---|
| What if the model is wrong? | Every number carries a band, with a 5 mm field floor, and a value inside its own band of the limit says re-scan, never outside. Blurred frames are dropped and partly seen bars aren't counted. Only locked, gated evidence reaches the rules. | B3 |
| What's your accuracy? | On our known mesh the geometry reads 50.1, 49.9 and 64.9 mm against 50, 50 and 65. We won't claim real-site accuracy until Pilot A's tape table earns it. | B3, B9 |
| Who pays? | Steel brands first: a missing bar found before the pour sells steel, and the record proves their bar went in right. Cement technical services, builders and inspectors buy per record; lenders buy only the evidence layer, in year 2. | B8 |
| Isn't Japan doing this? | Yes, and that is why we trust the physics: their ministry has accepted it since 2023. Their version is tablets, cloud and QA teams on big sites; ours is one phone, offline, IS rules, a Hindi fix and a two-key record for a self-built house. | B7 |
| Why the card? Why not ARCore or LiDAR? | This phone has no LiDAR and isn't on ARCore's list, and ARCore tracks to centimetres where we need millimetres. The card gives true scale and tilt in every frame; without it the app asks for the tape. | B2 |
| Why the NPU? | The live overlay needs segmentation every frame: 12 ms on the NPU against 235 on the CPU. That is the difference between a live guide and a photo you wait on. | slide 4 |
| Where does the data go? | Measurement, voice and signing run on the phone in airplane mode. A pack leaves only as a signed file to the engineer, over Office Kit, and any phone can verify it offline. | B4 |
| Scan a good cage, pour a bad one? | Tamper-evident, not tamper-proof: edits drop the signature, replays are rejected and the same key can't approve its own capture. The engineer can demand a live re-scan. | B4 |
| What trained the model? | U-Net with a MobileNetV3 encoder (open weights), fine-tuned on public rebar and negative datasets on Kaggle, with timestamped logs and dataset hashes in the repo. The organisers allowed pre-event weights in writing; all app code is from this weekend. | B6 |
| Who set the tolerance? | IS 456 leaves placement tolerance open, so the rulebook proposes one; it is versioned and every verdict records which version it used. Getting a structural engineer to sign it off is our second ask. | B9, slide 5 |

## Pre-flight (T-10 min)
- [ ] All three phones in airplane mode, and Office Kit mirror and transfer **tested in that state**.
- [ ] P2's PIN works. The drawing values were issued this morning. Yesterday's approved pack is staged to resend.
- [ ] Mesh at spec: 5 × 5 @ 50, all gaps 50, card S flat and clean. The beam rings are at spec.
- [ ] Scale zeroed. Offcut labelled "12" (the 10 mm bar). Tape on the table. Four fault cards shuffled.
- [ ] Notifications silenced, brightness 100 %, screen timeout 10 min, P1 cool to the touch.
- [ ] The laptop opens `Sariya · Grand Finale.pptx` on slide 1, from a machine with **DM Sans** installed (or a PDF exported there).
- [ ] The recorded fallback scan from this morning is open in a second window.
- [ ] One full timed run. If it ends past 3:20, cut the 1:25 hard case first.
