# Workstream 8: demo script v1 (7 Oct 2026)

For the Sunday pitch (3:30, cold jury of ~5) and the three checkpoints. Written for 3 a.m. reading: short lines, one job per line.

Sources: IDEA.md §6 (beats), §9-10 (answers, banned claims); VERDICT.md (minimum demo); jury-finale.md §C.3-C.4; data-and-props.md §2-3 (props, fiducials, fault deck); rulebook.md §D-E (verdict logic, fixture values); PREP-PLAN.md §0, §3, §6.

Roles used throughout:
- **A** = presenter (speaks, holds the clock).
- **B** = operator (holds P1, scans, weighs, tapes with the judge).
- **C** = engineer (holds P2, runs the laptop and Office Kit; never touches the laptop in a Red block, including the Sun 06:30-09:00 rehearsal).
- **J** = the judge who volunteers.

Phones (all three are iQOO 15 loaners; the device score is the team average, so all three stay on and in-app):
- **P1 operator phone.** Release build. Capture key. Airplane mode. Does every scan.
- **P2 engineer phone.** Same build. Approval key behind C's enrolled fingerprint. Mirrored on the laptop over Office Kit.
- **P3 verify phone and hot spare.** Same build, same rehearsal scans loaded. Verifies the sign-off QR at 2:50. Takes over from P1 on any crash.

Three decisions flagged for other owners (do not skip; each changes a line in the script):
1. **F4 "near limit" is a gap of about 72 mm on the half-scale mesh (spec 8 @ 50, single-gap limit 65 = 50 + max(15 mm, 25 %)).** Sliding one bar widens one gap and narrows the next, so the *mean* does not move; only DWG-SPACING-LOCAL fires. At 0.3 m: 72 ± 3 (±5 until the floor is measured) → 67-77, outside. At 0.8 m card S's markers are under ~45 px and the app abstains: "re-scan, too far". Rulebook owner: report DWG-SPACING-LOCAL as a plain **outside** on the fixture, not "advisory". Vision owner: confirm the 0.3 m band at the bench test.
2. **The stage weigh test uses the 20 cm 10 mm offcut labelled "12".** Length measured to the mm and written on the label; the app's default is 200 mm. Scale reads about 123 g → 10 mm class (a 12 would be 178 g; IS 1786 individual bands at 0.2 m: 10 mm 114-132 g, 12 mm 167-186 g). The F8 deck card weighs the spare 280 mm slab bar (~111 g, 8 mm class).
3. **Office Kit under airplane mode is untested.** Test on Thu: does the mirror survive airplane mode with Wi-Fi re-enabled on a laptop-hosted network with no internet? If yes: all phones airplane + Wi-Fi, status bar shows the aeroplane. If no: P1 (the instrument) stays in full airplane mode with Bluetooth on; P2 (the desk) keeps Wi-Fi for the mirror; the pack goes P1 → P2 by Quick Share over Bluetooth (rehearse; a 2 MB pack takes about 5 s). Say which one we did if asked.

---

## 1. Stage setup and pre-flight

### 1.1 Stage layout (text diagram; jury faces the table from the front)

```
                 PROJECTOR / TV  <── HDMI ── LAPTOP (C)   Office Kit mirror of P2; deck as backup
                                               │
   ┌───────────────────────────────────────────┴────────────────────────────────────┐
   │                               TABLE (1.8 m, black cloth)                       │
   │                                                                                 │
   │                                                                                 │
   │   SLAB 28x28, 5x5 @50 (half scale)   BEAM TOP FACE 30 cm (half scale)         │
   │   card S (100 mm) front-left          2 x 12 mm bars + 5 cross pieces          │
   │                                       strip_300 (IDs 450-461) along the centre │
   │                                                                                 │
   │   KITCHEN SCALE      TAPE (mm)     4-CARD STAGE DECK (F1 F2 F3 F12, face down)     │
   │   + 2 offcuts 20 cm                + 12-card full deck (for Q&A)               │
   │   10"12" / 12                                                                   │
   │                                                                                 │
   │   P1 (B, in hand)     P2 (C, on a stand, fingerprint up)     P3 (A's pocket)   │
   │   USB-C to 65 W (Game Space bypass)                                             │
   └─────────────────────────────────────────────────────────────────────────────────┘
        A (front-left, speaks)        J (judge, front-right, invited to the table)
```

Notes:
- Mesh board flat on the table, long side towards the jury. Card S is the demo card: pattern width measured and written in the box. Say once: "half-scale props; the app reads whatever the drawing says".
- Beam top face (half scale): two 12 mm bars 300 mm long, 75 mm apart; five 8 mm cross pieces (125 mm) at 25, 75, 125 mm from the left end (end zone 150 @ 50) and 200, 275 (mid @ 75), Blu-Tack under each crossing; strip_300 along the centreline, 0 end at the left end. Tape ticks on the cloth beside the home positions so resets are exact.
- Light: phone torch only. Check once from P1's preview that the card shows no glare from the hall lights; tilt the board slightly if it does.
- P2 on a small stand facing the jury, so the fingerprint press is visible.
- Laptop angled so A can read the mirror without turning.
- Nothing white or patterned on the table. Mill scale glare under stage lights is the top vision risk.

### 1.2 Packing list (minimal kit, data-and-props.md §3)

| # | Item | Qty | Check |
|---|---|---|---|
| 1 | Slab board 28x28 (black cloth, 4 foam strips), 5 bottom + 5 top 8 mm bars @50, all movable, + 1 spare | 1 | eight gaps 50 ± 1 |
| 2 | Beam top face: 2 x 12 mm bars 300 mm, 5 x 8 mm pieces 125 mm, Blu-Tack | 1 | pieces at 25/75/125/200/275 |
| 3 | Card S (100 mm) | 1 | pattern width written (nominal 90) |
| 4 | strip_300 | 1 | 10 pitches measured (nominal 250) |
| 6 | Fault cards F1, F2, F3, F12 (paper, handwritten is fine) + one-page spec | 4+2 | |
| 7 | Offcuts 200 mm: 10 mm labelled "12", real 12 mm | 2 | about 123 / 178 g |
| 8 | Kitchen scale + spare battery | 1 | reads 0 |
| 9 | Steel tape (mm), masking tape, marker, Blu-Tack | | |
| 10 | Black cloth (table) | 1 | |
| 11 | Gloves for J | 1 pair | |
| 12 | Laptop (Office Kit paired with P1 and P2) + charger; Windows laptop backup | 2 | |
| 13 | 65 W charger, USB-C hub, 3 cables; HDMI + USB-C adapter | | test on the venue projector |
| 14 | USB stick: release APK, rehearsal packs, pre-rendered TTS WAVs | 1 | sha256 MANIFEST |

### 1.3 Pre-flight, in order (Sun, after the final build, T-60 to T-2 min)

| T | Step | Done |
|---|---|---|
| -60 | Release build installed on P1, P2, P3; same version string on the numbers screen of each | |
| -60 | 08:10 rehearsal scans of F1/F2/F3 present on P1 and P3 (the recorded-scan fallback, §3 row 1); open one, close | |
| -60 | Yesterday's signed pack (card S, rehearsal) on P1 for the replay-rejection beat; its hash already in the laptop's seen-list | |
| -55 | Fingerprint enrolled on P2 for C; test BiometricPrompt once; no screen lock timeout under 10 min | |
| -50 | Battery: P1 ≥ 80 %, P2 ≥ 60 %, P3 ≥ 80 %, laptop ≥ 70 %. P1 on wall power through Game Space bypass (Game sidebar > bypass charging); confirm the "bypass" toast; phone must not be warm | |
| -45 | Battery whitelisting on all three: High background power allowed, Autostart on, Not optimised, app locked in Recents | |
| -40 | Office Kit: laptop paired with P2 (mirror on) and P1 (file transfer tested). Mirror latency under 0.5 s. Switch P2 → P1 → P2 once | |
| -35 | TTS: play the Hindi fix line on P1 through the speaker at hall volume; subtitles visible from 3 m. Pre-rendered WAVs present as fallback | |
| -30 | ASR: say "cover twenty" into P1; read-back shows 20 | |
| -30 | Fonts: Devanagari and Kannada render in the app subtitles, on the laptop deck, and in the mirrored review screen | |
| -25 | Scan the control mesh from 0.3 m: all within limits, card found in under 1 s, accelerator shows NPU on the numbers screen | |
| -20 | Do F2 once (slide, scan, slide back) and F4 at 0.8 m then 0.3 m (re-scan, then outside). Reset the mesh to 50 c/c | |
| -15 | Beam: slide the 2nd cross piece into the middle (F3), scan, "add 1". Reset to 25/75/125/200/275 | |
| -10 | Scale on, reads 0, weigh the "12" offcut: about 123 g | |
| -8 | Numbers screen: scan count and battery read sensibly; nothing says 0 | |
| -5 | Silence notifications on all three phones; brightness 100 %; auto-rotate off; screen timeout 10 min | |
| -2 | **Airplane mode** on P1, P2, P3 (then Wi-Fi/Bluetooth back on as decided in flag 3). Show the aeroplane icon to the jury at 0:40. Not before T-2: HackTracker heartbeat behaviour in airplane mode is unanswered | |
| -1 | Stage deck (F1, F2, F3, F12) shuffled face down; mesh at 50 c/c both ways, 5 x 5; beam at 50/75; gloves on the table for J | |

---

## 2. The 3:30 script

Rules of the run:
- A never touches a phone. B never speaks unless asked. C speaks only at 2:30-3:00.
- The clock starts when A says the first word. Hard cuts: at 3:00 skip to the ask whatever is on screen.
- Every number spoken on stage must be on the screen at the same moment.
- Never say PASS, safe, certify, permit, tamper-proof, first, or any name from IDEA.md §10.

| Time | Who | Exact words | P1 screen | Laptop mirror (P2) | Judge | Audience must see |
|---|---|---|---|---|---|---|
| 0:00 | A | "In an Indian house this steel is visible for a day, maybe two. Then the concrete covers it for good, and in most self-built homes nobody measures it first. Japan's government has accepted camera checks of rebar since 2023. We built that for India, on one phone, offline. These are half-scale props so they fit through security; the app checks whatever the drawing says." | idle, Sariya home | Problem slide: steel before the pour, the same slab after the pour | listens | The one-day window |
| 0:20 | A | "Sariya is a phone and a printed card. The engineer scans the evening before the pour. It counts, it measures, it says when it is not sure, and it tells the mason what to fix, in his language. Nothing leaves the phone." | home | photo stays | | |
| 0:30 | A | "[J's name], pick a card. Do what it says. Don't tell us which." *(hands gloves)* | home | photo stays | Draws one of F1 / F2 / F3, does it: pulls a bar, slides a bar to open one gap to ~80 (either layer), or slides the 2nd end-zone ring into mid-span | The judge touching the steel |
| 0:45 | A | "Airplane mode. Scan." | B taps Scan; live overlay; coverage bar "bars 1-5 seen"; aeroplane icon in the status bar | **switch mirror to P1** (if two-phone mirror works; else jury watches P1 and the laptop stays on the photo) | steps back | The overlay drawing on live steel, the coverage ticking |
| 0:55 | A | (silent; lets the phone speak) | Verdict card: e.g. "Gap 3: **80 ± [band] mm**. Drawing 50. Outside limits." (band = 5 mm floor until P16 measures one) Hindi audio plays; subtitles Hindi + English | same | | Hindi voice, subtitles, the band |
| 1:05 | A | "The phone drew the gap it measured. Tape it, centre to centre." | the measured segment highlighted on the frozen frame | same | Tapes the drawn segment, reads it aloud: "about 80" | The tape and the screen agree inside the band |
| 1:20 | A | "Inside the band. If the tape had said 90, the phone would have been wrong, and it would say so in its record." *(for F1: "Four bars, drawing says five, it says which slot is empty." For F3: "It found a 100 millimetre gap in the first 150 millimetres, where the drawing says 50, and said add one ring.")* | verdict stays | same | | |
| 1:25 | A | "Now the hard case. [B] opens a gap to 72: just past the limit. Scan from far away." | B slides bar; scans from 0.8 m | same | watches | |
| 1:35 | A | (silent) | "**Re-scan**: too far to be sure." Hindi: "Pakka nahin keh sakta, paas se scan karo." | same | | The phone refusing to decide |
| 1:40 | A | "It would rather say 're-scan' than guess. Closer." | B scans at 0.3 m: "72 ± [band], limit 65. Outside limits." | same | | The same bar, two distances, one honest answer |
| 1:50 | A | "Both directions. [B], slide a bar in the lower layer." | B slides B2 back 30 mm (F12) and scans at 0.3 m: "Lower bars: gap 2 is 80 ± 4, limit 65. Outside." Hindi plays | **mirror back to P2** during this beat (C does it) | | The second direction caught, bars under bars |
| 2:05 | A | "Bars it can only see through the gaps, measured with a wider band, and it says so." | lower-layer verdict with its band | | | |
| 2:10 | A | "A camera cannot tell a 10 from a 12 millimetre bar at arm's length. So we don't. Twenty centimetres of bar, a kitchen scale." | B puts the offcut labelled "12" on the scale; P1 photographs the display | | reads the scale: "123" | 123 g on the scale and on the phone |
| 2:20 | A | "Twenty centimetres of a 12 weighs 178 grams. This one, labelled 12, weighs 123. It's a 10. Mislabelled, underweight or fake steel fails here, not in the photo." | "Offcut 200 mm, 123 g: 10 mm class (0.617 kg/m; 12 mm = 0.888). Needs engineer." | | | |
| 2:30 | C | "I'm the engineer. The record arrives on my desk." *(taps Review on P2)* | B sends the pack (Office Kit transfer or Quick Share) | P2 mirrored: record list; opens today's pack; the 80 frame, the tape reading, the weigh photo, "4 within, 2 outside, 1 needs tape" | | The engineer reading the actual frames |
| 2:40 | C | "I sign with my own key, not the operator's." *(presses fingerprint on P2)* | | BiometricPrompt, then "Signed by [C], 11 Oct, 14:0x. Pack hash …a3f1." QR appears | | The fingerprint press on the engineer's phone |
| 2:48 | A | "The mason's phone checks it, offline." | | | | P3 scans the QR: "Valid. Engineer [C]. Card S. Today." |
| 2:52 | C | "Now yesterday's record, sent again." *(opens it)* | B sends yesterday's pack | "**Rejected**: this record was already signed on 10 Oct." | | The rejection |
| 3:00 | A | "The numbers. Segmentation on the NPU: [__] ms; on the GPU [__]; CPU [__]. [__] scans this weekend, [__] % battery, phone never above [__] °C. Our bands, checked against the tape on our props: [__] of [__] inside." | Numbers screen (computed from stored signed scans) | mirror P2's numbers screen or the same on the deck | | Measured, not claimed |
| 3:15 | A | "Who pays: the steel and cement brands who already send free engineers to slab pours. A missing bar sells steel; a signed record sells trust. We want one brand's technical team in Bengaluru for a 60-pour pilot from November. The steel is visible for a day. We give the engineer that day." | home | last slide: the ask | | |
| 3:30 | | stop | | | | |

Spoken-word budget: about 45 words per 20 s. If a line runs long, drop the second sentence, never the number.

Hard cuts if behind the clock (check at 1:50 and 2:30):
- Behind at 1:50: skip the lower-layer beat.
- Behind at 2:30: cut the replay rejection (2:52). Never cut the tape or the fingerprint.
- Behind at 3:00: say only "NPU [__] ms, [__] scans this weekend" and the ask.

---

## 3. Failure branches

Each line rehearsed aloud on Sunday morning. The rule: name it, show the fallback, move on. Never argue with the judge, never debug on stage.

| What goes wrong | Who | Say exactly | Do |
|---|---|---|---|
| Card not detected (glare, tilt) | A | "It's telling us why: glare on the card. That's the honest failure." | B tilts the board away from the hall light and wipes the card. 15 s max. Then run this morning's recorded scan of the same fault and say "this is the 08:10 rehearsal scan of this same board". |
| Overlay shows GPU, not NPU | A | "The NPU path fell back to the GPU on this run; the numbers screen shows both. Live guidance holds either way." | Continue. Numbers screen at 3:00 quotes the measured NPU figure from the AI Hub profile and says "profile job", not "this run". |
| Wrong count or wrong gap (a miss) | A | "That's a miss. On our bench tape checks the miss rate is [X] of [Y]; that is why the engineer signs and never the phone." | B shows the frozen frame and the coverage map, re-scans from 0.3 m once. Whatever it says, A moves to the tape beat. |
| False alarm on a control gap | A | "It flagged a gap the tape says is fine. The band was wrong there; it goes in the error table tonight." | Tape the flagged gap with J, show both numbers, move on. |
| ASR mishears the number (tape reading by voice) | B | (nothing) | Read-back shows the wrong number; B taps the number field and types it. A: "Voice is a convenience; the typed value is what is signed." |
| TTS silent | A | "Subtitles are the primary channel; the voice is for the mason." | B taps the speaker icon once (replays the pre-rendered WAV). If still silent, A reads the subtitle in Hindi. |
| Office Kit mirror drops | C | "The desk lost the mirror; the record is on my phone." | C holds P2 up to the jury and to the laptop webcam (Photo Booth full screen is the fallback mirror). The fingerprint still happens on P2. |
| Office Kit file transfer fails | B | (nothing) | Quick Share over Bluetooth. If that fails: C opens the identical rehearsal pack already on P2 and A says "this is the same pack, transferred at rehearsal". |
| P1 thermal or crash | A | "Hot spare." | A hands P3 to B. Same build, same files. Lost beat is repeated from the scan, not from the top. |
| Verdict takes over 5 s | A | fills the air once: "It is picking the sharpest frames and fitting the card." | At 8 s, B cancels and re-scans at 0.3 m. At the second failure, go to the recorded scan. |
| Judge picks an unsupported fault (moves the card, swaps a bar size, bends a hook) | A | "Good one. Diameter and hooks are close-up checks with a template, not this scan; here is what this scan says about what it can see." | Scan anyway. If the card moved: the app says "card moved during scan" and B puts it back. Then do F2 yourself and continue. |
| Judge tapes clear spacing, not centre-to-centre, and gets 72 vs 80 | A | "He measured the clear gap; add one bar width, 8, and it's 80. The phone measures centre to centre, like the drawing." | Nothing else. |
| Judge refuses to come up | A | "Then I'll be the judge." | A draws the card and reads it aloud; B applies it. |
| Projector dies | A | continues | C turns the laptop to the jury; printed spec page on the table. |
| Steel refused at the stage door | A | "Our board stayed at security, so this is the rehearsal video." | Play the 08:00 rehearsal video on the laptop; do the weigh test on video. |
| Over time, cut off at 3:00 | A | "The ask: one brand's technical team, a 60-pour pilot from November." | Stop. |

---

## 4. Checkpoint demos (90 s each)

The evaluators at checkpoints are not the final jury. Show what works; name what doesn't in one sentence; never show a feature that half works.

### Sat 10:00, Eval 1 (hour 15): the mesh loop
Must work: card detected on the mesh; count and mean spacing with a band; one verdict against a typed 5-field spec; the fix spoken in Hindi with subtitles; accelerator name on screen; a capture-signed record if ready (EVAL-CARDS.md CP1).

| s | Beat |
|---|---|
| 0-15 | "The steel is visible for a day. Sariya measures it with a card." Show the mesh. |
| 15-45 | Pull one bar (F1). Scan at 0.3 m. "4 of 5, outside limits." Hindi line plays. |
| 45-70 | Open one gap to 80 (F2). Scan. "80 ± [band]". Tape it in front of them. |
| 70-90 | Numbers screen: NPU ms, scans so far. "By 19:00: beam zones, voice in, signed record, the engineer's desk over Office Kit." |

If missing: voice → "the fix is text today, Hindi voice by tonight"; NPU → "GPU today; NPU compile is running, here is the AI Hub profile"; band → show the raw value and say the band comes from the bench error table at 15:30.

### Sat 19:00, Eval 2 (hour 24): the full loop
Must work: everything from Eval 1, plus the beam strip with stirrup spacing by zone; the spec entered by voice with read-back; a signed pack on P1; the pack opened on the laptop over Office Kit; the engineer's sign-off on P2.

| s | Beat |
|---|---|
| 0-10 | "Full loop, offline." Airplane icon. |
| 10-30 | Voice: "beam, 8 mm rings, 50 at the ends, 75 mid, end zone 150." Read-back on screen, confirm. |
| 30-55 | Slide the 2nd ring into mid-span (F3). Scan the beam along the strip. "Left end: 100, drawing 50 for 150 mm. Add 1." Hindi. |
| 55-80 | Pack lands on the laptop (Office Kit). C opens it, reviews the frame, signs on P2 with a fingerprint. |
| 80-90 | "Tonight: the replay rejection, the re-scan rule at the limit, and the numbers screen from stored scans." |

If missing: Office Kit → show the pack on P2 and say the desk is being wired; sign-off → show the capture signature and say the second key lands tonight; beam → do the mesh loop and say the strip is in test with [X] % marker recall.

### Sun 09:00, Eval 3 (hour 38): the pitch, compressed
Must work: the whole §2 run, including re-scan at 0.8 vs 0.3 m, the lower-layer fault, the weigh test, the replay rejection, the numbers screen. This is rehearsal run 7 with an audience.

| s | Beat |
|---|---|
| 0-15 | One-day window + Japan line. No site statistic (none exists); the user's own site photo only if it was taken, said as "we saw it this week". |
| 15-40 | Evaluator draws F1/F2/F3. Scan. Verdict, Hindi. Tape. |
| 40-55 | F4 at 0.8 m: re-scan. At 0.3 m: outside. |
| 55-75 | Weigh the "12": 123 g over 200 mm, 10 mm class. |
| 75-90 | Sign-off on P2 with fingerprint; yesterday's pack rejected; numbers screen. |

If missing: say exactly what is cut from the final pitch and why; a clean 60 s beats a broken 90 s.

---

## 5. Q&A card (15 hostile questions, two sentences each)

Print this on one A4, keep it under the laptop. Extends IDEA.md §9; the §9 answers still apply.

| # | Question | Answer |
|---|---|---|
| 1 | What trained the model, and when? | Open segmentation weights, attributed in the repo, [fine-tuned on public rebar images plus photos of our own props, with a timestamped training log | used as pre-trained: say which is true]. The organisers allowed pre-event weights in writing; every line of app code is from this weekend, and the git log shows it. |
| 2 | Isn't this built to please the tracker? | The camera, the microphone and the NPU are the product, not a garnish: the overlay needs 30 fps segmentation, the mason gets a voice, the engineer talks the spec in. We did not add a feature for the tracker; we picked a problem the phone's sensors can solve. |
| 3 | Why not ARCore or LiDAR? | This phone has no LiDAR, no ToF, and is not on ARCore's supported list, so there is no metric depth to borrow. A printed card is cheaper than any sensor, works on any phone, and the engineer already carries paper. |
| 4 | Why the card at all? Why not just the camera? | A single camera has no scale; the card gives scale and tilt from 25 known corners in every frame. Without the card the app does not measure, it asks for the tape, and says so. |
| 5 | Japan does this already. | Yes, and their ministry has accepted camera-based rebar measurement since July 2023, which is why we trust the physics. What is new is where it runs and whom it serves: offline on one phone, IS 456 and IS 13920 rules that say re-scan when unsure, the fix in Hindi or Kannada, and a signed record for a house with no QA team. |
| 6 | Who pays? | Steel and cement brands first: they already send free technical engineers to slab pours, and a missing bar found before the pour sells steel and brand trust. Builders and inspectors pay per site after that; lenders buy only the record. |
| 7 | What if the mason refuses? | He does not hold the phone; the person paid to check does, and the mason hears the fix in his own language with the number. A signed record of the correction protects the honest mason later. |
| 8 | Where does the data go? | Nowhere unless the owner shares it; faces are blurred on the phone, frames are cropped to the steel, GPS is advisory with the mock-location flag recorded. The pack is a signed file the owner can hand to anyone. |
| 9 | Bengaluru is Zone II. | The rulebook is zone-aware: IS 456 applies everywhere, IS 13920 is required in Zones III-V and "optional" in Zone II, and the drawing always wins. Every rule on screen carries its clause and its severity. |
| 10 | Who decided the tolerance? | IS 456 gives no placement tolerance, so we proposed mean spacing within drawing plus the larger of 10 mm or 5 %, and any single gap within the larger of 15 mm or 25 %, and a project's own engineer confirms or changes it. It is a versioned file; a project can change it, and every verdict records which version it used. |
| 11 | What does the LLM do? | It turns the spoken spec into five typed fields with a read-back, and words the fix for the mason. It never measures and never decides; a validator rejects any number the engineer did not say. |
| 12 | AGPL and licences? | Every model and library is listed with its licence in the repo; the segmentation weights we ship are [Apache / AGPL, say which]. If the AGPL path is the one on the phone, the production swap is DeepLabV3+-MobileNet, which we also profiled on this chip. |
| 13 | What happens offline? What stops when I unplug the laptop? | Capture, measurement, voice and signing all run on the phone; the demo was in airplane mode. What stops is the engineer's desk: big-screen review and the second signature, which wait until the engineer is back on Office Kit or receives the pack any other way. |
| 14 | What is your accuracy, in one number? | On the bench at 0.25-0.5 m the spacing band is about ± [__] mm at 50 c/c on half-scale props. Site validation with a brand's engineers is the next step. Diameter is not a camera claim at all; it is a kitchen scale. |
| 15 | Cost per site? | The card is about ₹90 printed and lasts the site; the phone is already in the engineer's pocket; the scan takes ten minutes. For a brand it replaces nothing and adds a signed report to a visit they already pay for. |

Reserve answers (one line each):
- "Would it have saved Babusapalya?" Partly at most; the building had no approvals. We build for owners who want to build right.
- "Can you tell 10 from 12?" Not from a standing sweep; we weigh a 20 cm offcut.
- "Scan a good cage, pour a bad one?" Card per site, re-used scan detection, and the engineer can demand a live re-scan. Tamper-evident, not tamper-proof.
- "Why Hindi first?" Most crews are migrant; Kannada is a tap away for the owner.

---

## 6. Fault deck mapping (for pre-rendering the TTS lines)

Spec on stage (half-scale props): mesh 8 mm @ 50 c/c both ways, 5 x 5 bars, on the 28 x 28 cm board; single-gap limit 65 in each direction (50 + max(15 mm, 25 %)); beam 8 mm rings @ 50 for the first 150 mm, 75 mid (pieces at 25/75/125/200/275 on 300 mm bars). Band values are the bench expectation at 0.3 m; replace with measured ones.

Site vocabulary used in Hindi: सरिया = bar, रिंग = stirrup, गैप = gap, कवर = cover, ड्राइंग = drawing. Numbers are spoken in Hindi words. Render every line with Piper `hi_IN-pratham-medium` on the laptop as `tts/hi/F__.wav`; keep the number slots as separate clips as well (speech-llm-ocr.md §4 item 8). English and Kannada subtitles come from the same table; Kannada audio uses the system voice or the FastPitch build if it lands.

| Card | Judge does | App verdict (screen) | Hindi (Devanagari) | Hindi (transliterated) | English subtitle |
|---|---|---|---|---|---|
| CONTROL | nothing | 5 x 5 bars, mean 50 ± 2. 4 within, 0 outside. | सब नाप सीमा के अंदर हैं। कोई बदलाव नहीं। | Sab naap seema ke andar hain. Koi badlaav nahin. | All readings within limits. No change. |
| F1 missing bar | pulls one of 5 | Count 4, drawing 5. Outside. Slot 3 empty. | पाँच में से चार सरिया मिले। तीसरी जगह खाली है। एक सरिया और लगाओ। | Paanch mein se chaar sariya mile. Teesri jagah khaali hai. Ek sariya aur lagao. | 4 of 5 bars found. Slot 3 is empty. Add one bar. |
| F2 wide gap | slides one bar to open a gap of ~80 | Gap 3: 80 ± [band], limit 65. Outside. | तीसरा गैप अस्सी मिलीमीटर है। ड्राइंग में पचास है। इस सरिया को अंदर खिसकाओ। | Teesra gap assi millimetre hai. Drawing mein pachaas hai. Is sariya ko andar khiskao. | Gap 3 is 80 mm. Drawing says 50. Slide this bar in. |
| F3 end zone | slides the 2nd cross piece from the left end into the middle | Beam B2 left end: 100 ± [band], drawing 50 over 150. Outside. Add 1. | बीम बी-दो, बायाँ सिरा: रिंग सौ पर हैं। ड्राइंग में पहले डेढ़ सौ मिलीमीटर तक पचास है। बीच में एक रिंग और डालो। | Beam B-do, bayan sira: ring sau par hain. Drawing mein pehle dedh sau millimetre tak pachaas hai. Beech mein ek ring aur daalo. | Beam B2, left end: rings at 100. Drawing says 50 for the first 150 mm. Add 1 ring in between. |
| F4 near limit (72, see flag 1) | slides one bar to open a gap of ~72 | At 0.8 m: **re-scan** (card too small in the frame). At 0.3 m: 72 ± [band], limit 65. Outside. | (0.8 m) पक्का नहीं कह सकता। पास से दोबारा स्कैन करो। (0.3 m) गैप बहत्तर है, सीमा पैंसठ। इस सरिया को थोड़ा अंदर करो। | (0.8 m) Pakka nahin keh sakta. Paas se dobara scan karo. (0.3 m) Gap bahattar hai, seema painsath. Is sariya ko thoda andar karo. | (0.8 m) I can't be sure. Re-scan from closer. (0.3 m) Gap is 72, limit 65. Move this bar in a little. |
| F5 far scan | scans control from 0.8 m | Re-scan: card too small in the frame; no values shown as sure. | कार्ड बहुत छोटा दिख रहा है। पास से स्कैन करो। | Card bahut chhota dikh raha hai. Paas se scan karo. | The card is too small in the frame. Scan from closer. |
| F6 torch off | covers the torch | Blur guard: "Too dark. Torch on." No verdict. | रोशनी कम है। टॉर्च चालू करो। | Roshni kam hai. Torch chaalu karo. | Light is low. Turn the torch on. |
| F7 cover | skips the cover reading | Cover: **needs a tape reading**. Never guessed. | कवर कैमरे से नहीं दिखता। टेप से नापकर बोलो। | Cover camera se nahin dikhta. Tape se naapkar bolo. | Cover can't be seen by the camera. Measure with the tape and say it. |
| F8 thin bar (deck: 10 → 8; stage: "12" → 10) | swaps the offcut | Deck: spare 280 mm slab bar, 111 g over 280 mm, 8 mm class, not 10. Stage: 123 g over 200 mm, 10 mm class, not 12. | बीस सेंटीमीटर, वज़न एक सौ तेईस ग्राम। यह दस मिलीमीटर है, बारह नहीं। इंजीनियर को दिखाओ। *(deck: अट्ठाईस सेंटीमीटर, वज़न एक सौ ग्यारह ग्राम। यह आठ मिलीमीटर है, दस नहीं।)* | Bees centimetre, vazan ek sau teis gram. Yeh das millimetre hai, baarah nahin. Engineer ko dikhao. *(deck: Atthaaees centimetre, vazan ek sau gyaarah gram. Yeh aath millimetre hai, das nahin.)* | 20 cm, 123 g. This is a 10 mm bar, not 12. Show the engineer. *(deck: 111 g over 28 cm, 8 mm, not 10.)* |
| F9 half card | covers a third of the card | Measures from the visible corners if ≥ 12; else "card not fully visible". | कार्ड पूरा नहीं दिख रहा। हाथ हटाओ। | Card poora nahin dikh raha. Haath hatao. | Card is not fully visible. Move your hand. |
| F10 replay | sends yesterday's pack | **Rejected**: this record was already signed on 10 Oct. (laptop, English) | यह रिकॉर्ड पहले ही साइन हो चुका है। आज का नया स्कैन करो। | Yeh record pehle hi sign ho chuka hai. Aaj ka naya scan karo. | This record was already signed. Do a fresh scan today. |
| F11 no drawing | clears the spec | Measurement-only: 5 bars, gaps 49 / 51 / 50 / 50 ± 2. No verdict. | ड्राइंग नहीं है। सिर्फ नाप: पाँच सरिया, गैप करीब पचास। | Drawing nahin hai. Sirf naap: paanch sariya, gap kareeb pachaas. | No drawing. Values only: 5 bars, gaps about 50. |
| F12 lower bars | slides bottom bar B2 back by 30 mm | Lower bars: gap 2 is 80 ± 4, limit 65. Outside. | नीचे की सरिया: दूसरा गैप अस्सी है। ड्राइंग में पचास है। इस सरिया को वापस खिसकाओ। | Neeche ki sariya: doosra gap assi hai. Drawing mein pachaas hai. Is sariya ko vaapas khiskao. | Lower bars: gap 2 is 80. Drawing says 50. Slide this bar back. |

Number clips to render in Hindi (slot fallback): every integer 0-100 (Hindi 11-99 are irregular words and cannot be joined from tens + units); 100 and 200; "millimetre", "gram", "ek sau", "dedh sau". Have a native speaker check "assi" (80), "bahattar" (72), "painsath" (65), "pachaas" (50), "dedh sau" (150), "ek sau teis" (123), "ek sau athhattar" (178), "ek sau gyaarah" (111), "bees centimetre", "atthaaees centimetre".

---

## 7. Rehearsal plan, Sun 06:30-09:00

Everything else is frozen by 06:30 except the numbers screen values. One stopwatch on P3, large, visible to A (06:30-09:00 is a Red block: nobody touches a laptop; the mirror is started and switched from the phones). C logs every run in a four-column sheet: run, time, what broke, fix.

| Time | Run | Who is J | Goal |
|---|---|---|---|
| 06:30-06:45 | 0, walk-through, untimed | nobody | Props set, pre-flight §1.3 from -60 to -5, mirror switch P2→P1→P2 timed |
| 06:45-06:55 | 1, full, timed | C | First timing. Expect 4:15. Mark every line that ran long. |
| 06:55-07:05 | 2, full, timed | C | Target 3:45. A cuts words, not beats. |
| 07:05-07:15 | 3, full, timed | B (A scans) | Target 3:30. Proves A can scan if B is out. |
| 07:15-07:40 | Failure drills, §3, one at a time | C triggers | Card glare (tilt the board), TTS muted, mirror dropped (kill Wi-Fi), P1 "crash" (swap to P3), judge moves the card, judge tapes clear spacing. Each recovery line said aloud, recovery under 20 s. |
| 07:40-07:50 | 4, full, timed, with one drill injected unannounced by C | a stranger if any team member nearby will play; else C | Target 3:30 with a recovery inside it. |
| 07:50-08:00 | Q&A, §5, rapid fire | B and C ask, A answers | Each answer under 15 s. Swap: A asks, C answers 6, 9, 10, 13. |
| 08:00-08:10 | 5, full, timed, video recorded on P3 | C | This recording is the fallback if steel is refused at the stage door or the live scan dies twice. |
| 08:10-08:20 | Reset and re-scan all three stage faults; save these as the "08:10 rehearsal scans" on P1 and P3 | | These are the recorded scans named in §3 row 1. |
| 08:20-08:30 | 6, full, timed, nobody speaks except A; B and C in silence | C | Proves the run does not need commentary from B or C. |
| 08:30-08:45 | Pack the kit (§1.2), charge P1 and P3 to 100 %, laptop to 100 % | | |
| 08:45-09:00 | Walk to Eval 3; set up in under 5 min, timed | | Setup time is part of the demo score. |

Pass criteria before Eval 3: three consecutive runs under 3:35 with no unplanned recovery; every failure branch recovered under 20 s; A has the §5 card memorised to the point of not looking at it.

After the Eval 3 feedback (10:00-12:00): one more full run with the evaluator's comments applied, then freeze. No new words after 12:00; only numbers on the numbers screen may change.
