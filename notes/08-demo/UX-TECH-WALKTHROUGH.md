# Sariya: the UX with the tech under each step (10 Oct 2026)

**10 Oct 07:45 build changes:** (1) the engineer approves, and every phone trusts another phone's key, with an **app PIN** set at setup (salted hash in SecureStore; 5 wrong tries lock it for 30 s), not a fingerprint: the loaners have none enrolled. Read every "fingerprint" below as "PIN". (2) **Beam is "coming soon"** in the build: cut F3 and every beam beat; the stage deck is F1, F2, plus F12 only if validated. (3) The engineer sends the drawing values from P2 before the run (pre-flight T-50).

For the presenter and operator. Each step: what the jury sees, what the phone does, the line to say.
Numbers are the half-scale stage values from BUILD-PLAN §7. Stage order and timing: demo-script.md §2.

**Before you rehearse:** this describes the designed flow (IDEA.md v4, ux-flows.html). STATE.md still records no app
source in this repo, so every screen here is "designed", not "confirmed built". Demo only what runs on P1 today; for
anything else, say the one-line omission.

## The model in one breath

> "AI finds the bars, maths measures them, rules decide."

```
camera frame ──► card found? (OpenCV ChArUco, CPU)          ──► scale + tilt (homography, mm per pixel)
             └─► bar pixels (U-Net on the NPU, 12 ms)        ──► lines + gaps in card-plane mm (maths)
                                                             ──► Lock: ~15 still frames fused, value ± band
                                                             ──► rulebook (JSON, deterministic) ──► verdict
                                                             ──► Hindi sentence (template + TTS) ──► mason
                                                             ──► signed record ──► Office Kit ──► engineer signs
```

Only one stage is AI. Every number the jury sees comes from geometry, and every verdict from a versioned rule file.

Devices:

| Device | Who | Holds |
|---|---|---|
| P1 | operator (B) | capture key; does every scan |
| P2 | engineer (C) | approval key behind a fingerprint; mirrored to the laptop |
| P3 | verifier and hot spare | the enrolled public keys; checks the QR |
| Laptop | engineer's desk | no key, no backend: an Office Kit mirror and file mover |

---

## Step 0: first launch and readiness (all phones, before the jury)

**Sees:** a readiness screen ("model compiling…" then "NPU ready"), mic/camera status, then key enrolment: each phone
shows a key QR and scans the others, confirmed by fingerprint.

**Tech:**
- The model is `unet_mbv3_1152.tflite`: U-Net, MobileNetV3 encoder, 6.7 M params, float32, input 1152×640 RGB, output
  per-pixel bar probability (> 0.5 = bar). Trained on ROI-1555 (1,555 real rebar photos); held-out test IoU 0.847.
- Runs through LiteRT on the Hexagon NPU (QAIRT 2.50, HTP v81) in burst mode. The first JIT compile takes ~53 s; the
  compiled graph is cached, so later starts take 4-8 s. That is why the readiness screen exists.
- Fallback order: NPU → GPU (19.8 ms) → CPU (235 ms). The screen shows which one actually ran.
- Keys: each phone makes an Ed25519 key pair, stored in SecureStore (encrypted at rest by Android Keystore; signing runs in app code). The private key never leaves the phone. Enrolment swaps only
  public-key fingerprints by QR. A key that arrives inside a file is never trusted on its own.

**Say (if asked):** "First launch compiles the model for this NPU once; after that it's cached."

## Step 1: spec in (P2 issues, P1 opens)

**Who:** the engineer sets the bar, not the person being checked. On P2: Send drawing values → pick slab/beam, member name, fields (empty = not on drawing) → sign and send over Office Kit. On P1: Drawing values from the engineer → the signature is checked against the enrolled engineer key → a new inspection opens with those values. Typing on P1 (below) is the fallback; the review flags it.

**Sees:** pick Slab or Beam, then five fields. Slab: bar diameter, count and spacing each way. Beam: stirrup diameter,
end-zone spacing, mid spacing, end-zone length. Optional hold-to-talk: "rings 8, 50 at the end, 75 middle, end zone
150", every field read back. Confirm creates a spec revision. No drawing means measurement-only mode (values, no
verdict).

**Tech:**
- Typed values become an immutable `SpecRevision` with an ID; any later edit is a new revision.
- Voice (if built): offline Hindi/English ASR (IndicConformer via sherpa-onnx on the CPU) → a number parser that snaps
  to legal values (bar dia {6,8,10,12,16,20,25,32}; spacing 25-400 step 5; end zone 100-1500 step 25). Doubtful values
  stay unconfirmed. An LLM, if present, may only fill fields; a validator rejects any number the engineer didn't say.

**Stage spec:** slab 8 mm @ 50 c/c both ways, 5×5. Beam rings 8 mm @ 50 over the first 150 mm, 75 mid.

**Say:** "The drawing comes first. The app checks whatever the drawing says."

## Step 2: live scan (P1)

**Sees:** card S on the mesh, torch on, phone at ~30 cm. A line snaps onto each bar, with "~50 mm" between lines. The
judge slides a bar: its line and number follow live. A coverage strip shows which bars were seen.

**Tech, per frame:**
1. **Card:** OpenCV finds the ChArUco card (6×6, 15 mm squares, ArUco DICT_5X5_1000, ids 360-377). It needs ≥ 12 corners.
2. **Scale:** a homography maps image pixels to millimetres on the card plane. The card is printed at a known size, so
   this replaces depth: one camera has no scale until the card gives it. The full pose (PnP) is used only to check tilt.
3. **Bars:** the frame goes to the U-Net on the NPU (~12 ms) → a bar-pixel mask.
4. **Lines:** the mask is warped onto the card plane (the card area masked out); summing pixels along each bar
   direction gives a 1-D profile whose peaks are bar centrelines, in mm. No Hough transform is needed (< 5 ms).
5. **Gaps** = the differences between neighbouring peak positions, centre to centre, like the drawing.
6. **Draw:** the inverse homography puts the lines back onto the preview. Bars are tracked by slot in mm, with a median
   across frames, so lines stay glued to the steel when the phone moves.

The "~" means a single frame: guidance, never a verdict.

**Manual mode (fallback):** if detection is shaky, the operator taps the bars on a frozen frame. The same card scale,
gates and band apply, and the record is labelled "human-marked".

**Say:** "The card gives the scale; the AI only finds the steel."

## Step 3: Lock (P1)

**Sees:** hold still → "Locking…" → the frame freezes with "80 ± 5 mm c/c" drawn on the exact gap.

**Tech:**
- Lock fires when the gyro says the phone is still and ~15 consecutive frames agree. They are fused (median) into one
  value.
- **Band** = max(model 2σ, field floor). The model 2σ combines centreline noise, mask-edge bias, card scale,
  out-of-plane height, tilt and lens error in quadrature. The field floor is 5 mm until tape checks measure it (95th
  percentile of |app − tape|). Fusing frames doesn't shrink systematic error, so the band isn't divided by √15.
- **Abstention gates ("re-scan" plus a reason in words):** < 12 corners; tilt > 25°; distance outside 0.2-1.3 m; card
  marker < 45 px (card S beyond ~0.65 m); blur; a bar < 80 % continuous; or the value within its own band of the limit.
- The output is an immutable `LockResult`: values, band terms, frame IDs, an evidence image hash, and spec, model and
  calibration hashes. Only this object can reach the rules.

**Say:** "Live numbers guide. Only a locked value gets a verdict."

## Step 4: verdict (P1)

**Sees:** a verdict sheet, one line per check, each with one of five answers: within limits / outside limits /
re-scan / needs a tape reading / not seen. The failing gap is highlighted on the frozen frame. There is no overall
badge, and never "PASS" or "safe".

**Tech:** `rules.json` v0.1.1, plain deterministic code. IS 456 gives no placement tolerance, so the proposed values
(engineer to confirm) are:
- mean spacing ≤ spec + max(10 mm, 5 %) → **60**;
- any single gap ≤ spec + max(15 mm, 25 %) → **65** (rule DWG-SPACING-LOCAL);
- count = drawing count.

A value is "outside" only if its whole band clears the limit:
- F2: 80 ± 5 → 75-85, all above 65 → **outside**.
- F4 at 0.3 m: 72 ± 5 → 67-77 → **outside**. At 0.8 m the marker is ~35 px (< 45) → **re-scan, too far**.
- If the band straddled 65 → **re-scan**, never a guess.

Zone awareness: Bengaluru is Zone II, so IS 13920 rows are advisory there; the drawing always wins. Each finding
carries its rule ID, clause, version and exact numbers.

## Step 5: the spoken fix (P1 → the mason)

**Sees and hears:** Hindi audio plus Hindi and English subtitles, with stop and repeat buttons. F2: "Teesra gap assi
millimetre hai. Drawing mein pachaas hai. Is sariya ko andar khiskao."

**Tech:** The sentence is a template filled from the `Finding`'s exact numbers. Neither the UI nor any model recomputes
the decision. TTS is Piper `hi_IN` offline, with pre-rendered WAVs as fallback. Hindi numbers 11-99 are irregular
words, so every integer 0-100 is its own clip. Subtitles are the primary channel; audio is for the mason.

**Say:** "The mason never holds the phone. He hears the fix, with the number."

## Step 6: what the camera can't see (P1)

**Sees:** prompts for:
- cover, by tape (spoken or typed, with read-back);
- an offcut on a kitchen scale;
- the hook, against a 135° template.

**Tech, the weigh test:** steel mass per metre = d²/162 kg/m.

| Bar | Per metre | 200 mm offcut | IS 1786 band (200 mm) |
|---|---|---|---|
| 10 mm | 0.617 kg/m | ≈ 123 g | 114-132 g |
| 12 mm | 0.888 kg/m | ≈ 178 g | 167-186 g |

The "12" offcut weighs 123 g, so it is a 10 (or underweight steel). Each manual reading is recorded with its source and
creates a new revision.

**Say:** "A camera can't tell a 10 from a 12 at arm's length, so we don't pretend. Twenty centimetres, a kitchen scale."

## Step 7: beam stirrup zones (P1, CP2 scope)

**Sees:** strip_300 laid along the beam; the app draws the 0 origin, ticks, end zone (0-150) and mid zone, and the
stirrups found in each.

**Tech:**
- The strip carries ArUco ids 450-461, 25 mm pitch; marker centre at 12.5 + (id − 450) × 25 mm from the left end.
  Whichever markers are visible give scale and position along the beam, so the frame needn't show the whole beam.
- Stirrups are bucketed by zone and each zone gets its own rule.
- F3 (2nd ring slid to ~180 mm): end-zone gap 100 vs 50 → "add 1 ring". Spoken: "Beam B-do, bayan sira…".

## Step 8: sign and send the capture (P1 → laptop → P2)

**Sees:** "Sign record" → a `.sariya.json` pack is sent by Office Kit file transfer → P2 opens it from Android's system
file picker.

**Tech:**
- `ScanRecord` = a canonical payload: locked values and bands, spec revision, rule/model/calibration versions, image
  hashes and manual readings. P1 signs it with its device key.
- P2 checks the hashes and the signature against the enrolled P1 key before showing anything. Corrupt or unknown-signer
  packs disable Approve.

## Step 9: engineer review and approval (P2, mirrored on the laptop)

**Sees, on the big screen:** the frozen overlay, the drawing values, each value ± band with its source, missing checks,
the signer and the revision. Then **Approve** with a fingerprint, or "request another view" of a named zone.

**Tech:**
- The fingerprint prompt gates approval on P2, which signs with its own, separate key. It signs the exact capture payload hash, not an editable
  screen.
- The approval file returns to P1 by Office Kit and attaches only to the capture it signed. A sign-off QR appears.
- Office Kit is the engineer's desk: a mirror plus file transport. The laptop holds no key.

**Say (C):** "I sign with my own key, not the operator's."

## Step 10: offline verify (P3)

**Sees:** P3 scans the QR → "Valid. Engineer C. Card S. Today."

**Tech:** the QR carries the approval signature and the record hash. P3 checks them against the enrolled engineer
public key. No network is involved.

## Step 11: replay rejection (P2)

**Sees:** yesterday's pack sent again → "Rejected: this record was already signed on 10 Oct."

**Tech:**
- A list of processed record hashes blocks double approval.
- An edited spec or photo changes the hash, so the old signature fails.
- A fresh scan of unchanged steel is allowed, at most with a similarity warning.
- This is tamper-evident, not tamper-proof, and it doesn't prove which physical slab was scanned.

## Step 12: the numbers screen (any phone)

**Sees:** NPU/GPU/CPU latency (p50/p95, plus the backend actually used), scan count, battery and temperature, and the
error table (app vs tape, residual, band, abstentions).

**Tech:** every value is computed from stored samples; missing data shows as "no data", never 0. The 12.2 / 19.8 /
235 ms figures are the standalone `benchmark_model` run (model only, no pre/post-processing): call them "benchmark"
unless the app's own timings are on screen.

---

## Stage run (3:30) mapped to the steps

| Time | Beat | Steps |
|---|---|---|
| 0:00 | One-day window; Japan has accepted camera checks since 2023; half-scale props | — |
| 0:30 | Judge draws F1/F2/F3, applies it | — |
| 0:45 | Airplane mode, scan, lines follow the steel, Lock | 2-3 |
| 0:55 | Verdict + Hindi fix | 4-5 |
| 1:05 | Judge tapes the exact drawn segment, centre to centre | 3 |
| 1:25 | F4: 0.8 m → re-scan; 0.3 m → outside | 3-4 |
| 1:50 | F12 lower layer (**only if validated**; otherwise skip) | 2-4 |
| 2:10 | Weigh the "12": 123 g → 10 mm class | 6 |
| 2:30 | Pack to P2, review on the laptop, fingerprint approve | 8-9 |
| 2:48 | P3 verifies the QR offline | 10 |
| 2:52 | Yesterday's pack rejected | 11 |
| 3:00 | Numbers screen, who pays, the ask (one brand, 60-pour pilot from November) | 12 |

Cuts if late: skip the lower layer at 1:50; skip the replay at 2:30. Never cut the tape or the fingerprint.

## Lines in the old Q&A card that are now wrong: don't say them

- demo-script §5 Q3 and Q8 were corrected on 10 Oct (ARCore dropped from the build; no face-blur/GPS claim). Earlier note: ARCore 1.56 installed from Play on 9 Oct. Say
  instead: "ARCore tracks to centimetres; spacing needs millimetres, so the card measures and ARCore at most anchors the
  overlay."
- demo-script §5 Q8 "faces are blurred, GPS advisory": not implemented. Say instead: "Everything stays on the phone; a
  pack leaves only when someone exports it."
- The UX-flows example "stirrups at 180… first 600 mm, add 2" is full-scale. On stage, F3 is "100, drawing 50 over
  150, add 1".
- Quote any band only as it appears on screen.

## Five probes, one line each

- **Why the card?** One camera has no scale; 25 known corners give scale and tilt in every frame.
- **Why the NPU?** Live lines need every frame segmented: NPU 12 ms vs CPU 235 ms, offline, with no data leaving the
  phone.
- **What does AI decide?** Nothing. It marks bar pixels; geometry measures and a versioned rule file decides.
- **Accuracy?** A band on every number, floored at 5 mm until our tape table says otherwise; inside the band of the
  limit, it says re-scan.
- **Who signs?** The engineer, on their own phone, with their own key behind a fingerprint. The phone never says safe.
