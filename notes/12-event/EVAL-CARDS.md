# Checkpoint cards: what we promise, show and say (print one page per checkpoint)

Numbers come from BUILD-PLAN.md §7 (half scale). Roles: **A** presents, **B** operates P1, **C** is the engineer (P2 + laptop), **J** is the evaluator.

Evaluators score the jury lines: end product 30, novelty 20, technical depth 15, demo 10. Each card says how we earn each line.

Finale jury (published on the site, 9 Oct):
- Goutam Kurumella (AWS India)
- Madhav Bissa (nasscom)
- Pradipta Dash (Avashya)
- Siddhant Agarwal (ClickHouse)
- Venkat Ragothaman (Microsoft)
- Vivek Sridhar

Expect architect questions: "what fails?", "where does the data go?", "what needs the NPU?", "who pays?". Checkpoint evaluators may be mentors, not this jury.

Rules for every checkpoint:
- Show only what works. Name what doesn't in one sentence, with the time it lands.
- Every number spoken is on the screen at that moment.
- Never say safe, PASS, certify, permit, tamper-proof or first. Don't quote site statistics (none exist; BUILD-PLAN §8).
- Airplane mode on P1 for the scan. Turn Wi-Fi back on only if the Office Kit mirror needs it, and say so if asked.

---

## CP1: Sat 10:00 (hour 15, scored, no elimination). "The mesh loop"

**Promise:** the phone finds a bar error on real steel, gives a number with an error band, and says the fix in Hindi.

**Must work** (frozen build from 08:30):
- card S detected;
- live NPU overlay;
- count and mean/single-gap spacing per layer with ±;
- a verdict against a typed 5-field spec (8 @ 50);
- the Hindi fix spoken with subtitles;
- an accelerator chip (NPU/GPU, with ms).

**Nice if ready:** a capture-signed record (shown as a chip only).

| s | Who | Say / do | Screen |
|---|---|---|---|
| 0-15 | A | "In a house, this steel is visible for a day; then concrete hides it. Nobody measures it. Sariya does it with one phone and this card, offline. Half-scale props; the app checks whatever the drawing says." | Home, spec "8 @ 50, 5 bars" |
| 15-40 | J / B | "Lift any bar." (F1: T3.) B scans at 0.3 m. | Overlay live → "Count 4, drawing 5. Slot 3 empty. Outside limits." Hindi plays, subtitles |
| 40-65 | J / B | B puts T3 back; J slides T4 to the F2 tick (220). Scan. A: "Tape it, centre to centre." | "Gap 3: 80 ± [band]. Limit 65. Outside." J's tape reads ~80 |
| 65-80 | A | "Too far, and it refuses." B scans from 0.8 m. | "Re-scan: card too small in the frame." |
| 80-90 | A | "Segmentation on the NPU, [x] ms. By 19:00: the beam's end zones, the spec by voice, and the engineer's fingerprint sign-off over Office Kit." | Accelerator chip / numbers |

**If missing:**
- Voice out: "Hindi text now, voice by tonight." Play the pre-rendered WAV if one exists.
- NPU: "GPU today, [x] ms; the NPU compile is the next fix." Show the AI Hub profile if we have it.
- Band: show the value and say "the band comes from tonight's tape checks; it starts at ±5".
- Model mask weak: switch on tap-to-mark (`marked by hand` chip). "Human gives topology, pixels give position."

**Pre-flight (T-10):**
- Mesh at home (all gaps 50 ± 1).
- Card S on T1/T2.
- Torch works; black cloth; no glare from overhead lights in P1's preview.
- Spec entered.
- Volume max; subtitles on.
- P1 > 60 %.
- Tape and gloves on the table.
- Fault ticks visible.

**How it scores:**
- End product: a real loop on real steel.
- Novelty: the judge's own tape.
- Depth: the band and the NPU chip.
- Demo: under 90 s.

**After:** write every remark on the whiteboard; triage it at 11:00.

---

## CP2: Sat 19:00 (hour 24, scored). "The full loop"

**Promise:** drawing in by voice → beam and mesh scanned → fix spoken → signed record on the engineer's desk over Office Kit → fingerprint sign-off on the engineer's own phone.

**Must work** (frozen build from 18:15):
- everything from CP1;
- the beam strip with ring spacing by zone and "add N";
- the spec by voice with read-back (keypad fallback);
- a pack exported from P1 by Office Kit;
- P2 review + BiometricPrompt approval;
- both signature chips.

| s | Who | Say / do | Screen |
|---|---|---|---|
| 0-10 | A | "Full loop, airplane mode." | Aeroplane icon on P1 |
| 10-25 | B | Speaks: "beam, rings 8, 50 at the ends, 75 middle, end zone 150." | Read-back with five chips, confirm |
| 25-45 | J / B | J slides the 2nd ring (75) to the middle (F3). B scans along strip_300. | "Left end: 100 ± [band], drawing 50 for 150 mm. Outside. Add 1." Hindi plays |
| 45-70 | C | "The record comes to my desk." Office Kit transfer of the pack; P2 is mirrored on the laptop; C opens the frame, the tape reading, the band terms | Review screen on the laptop mirror |
| 70-85 | C | "I sign with my key, not the operator's." Fingerprint on P2 | "Capture ✓ Approval ✓" |
| 85-90 | A | "Tonight: replay rejection, the weigh test and the numbers screen from stored scans." | |

**If missing:**
- Office Kit transfer: Quick Share, "same file, other route".
- Countersign: show the capture signature; "second key lands tonight".
- Beam: run the mesh loop; "strip in test, [x]/12 markers found".
- Voice spec: keypad, "voice in by 01:00".

**Pre-flight (T-15):**
- Beam pieces at 25/75/125/200/275.
- strip_300 0 end at the left.
- P2 fingerprint enrolled.
- Office Kit mirror on P2 under 0.5 s.
- Transfer folder empty except today's packs.
- One rehearsal pack signed earlier (for the replay beat at CP3).

**How it scores:**
- End product: "would someone keep using it": the record is the thing the engineer keeps.
- Depth: two keys, canonical JSON, NPU + GPU + CPU split.
- Office Kit: shown as part of the product, not just the build pipe.

---

## CP3: Sun 09:00 (hour 38, final build to 12:00). "The pitch, compressed"

**Promise:** the full demo-script §2 run in about 2 minutes, plus everything that makes it trustworthy.

**Must work:**
- CP2;
- the F4 re-scan at 0.8 m vs outside at 0.3 m;
- the lower-layer fault (F12);
- the weigh test;
- P3 verifies the QR;
- yesterday's pack rejected;
- the numbers screen from stored data;
- the error table.

| s | Beat |
|---|---|
| 0-15 | One-day window; Japan's ministry has accepted camera rebar checks since July 2023; we built it for India's self-built pour, offline. (No site statistic. Use the user's site photo only if it exists, as "we saw it this week".) |
| 15-40 | Evaluator draws F1/F2/F3; scan; verdict; Hindi; tape check |
| 40-55 | F4: 0.8 m → re-scan; 0.3 m → 72 ± [band], limit 65, outside |
| 55-70 | Weigh: 200 mm labelled "12" → ~123 g → 10 mm class ("a 12 weighs ~178") |
| 70-85 | P2 fingerprint → P3 verifies the QR → yesterday's pack: "Rejected: already signed" |
| 85-90 | Numbers: NPU [x] ms vs GPU [y] vs CPU [z]; [n] scans this weekend; "[k] of [m] bench tape checks inside the band" |

**If missing:** say exactly what is cut from the final pitch and why. A clean 60 s beats a broken 90 s.

**Submission (A), right after CP3, by 11:30:**
- repo pushed and public;
- README, PROVENANCE, MODEL_CARD, LICENSES;
- deck PDF;
- video link;
- error-table CSV.

---

## Final pitch (Sun, post-lunch, 3:30)
Use `notes/08-demo/demo-script.md` §2, with the corrections in `ERRATA-2026-10-09.md`:
- no "[N] sites";
- no engineer or mason claims;
- training-provenance line per BUILD-PLAN §8.

Hard cuts are at 1:50 and 2:30. Failure branches are in §3; rehearsal is §7 (Sun 06:30-09:00).

### Status board to show any evaluator who asks "where are you?" (keep it on the whiteboard)
```
Tier 1                         CP1  CP2  CP3
mesh count+spacing+band         ✓
re-scan abstention              ✓
Hindi fix + subtitles           ✓
beam zones + add N                   ✓
voice spec + read-back               ✓
signed record + fingerprint          ✓
Office Kit desk round trip           ✓
weigh test (IS 1786)                      ✓
replay rejection                          ✓
numbers screen (NPU/GPU/CPU)              ✓
error table from tape checks              ✓
```
Tick only what ran on the loaner in front of someone.
