# Team vision: a live AR measuring camera (9 Oct 2026, 20:05 IST)

Source: the team's vision stated at the event, compared against IDEA.md v3, plus an on-device check of the loaner over ADB.

## 1. The vision in one line
A camera app. When it sees a bar, it draws a line on that bar in real time. The printed card gives the scale, so the gaps and lengths between the lines are shown live in mm.

## 2. Comparison with v3

| Area | v3 | Team vision | Verdict |
|---|---|---|---|
| Camera app | Scan screen with a live preview | Camera app for capture | Same |
| What is drawn on the bars | Mask blob at 30 % alpha | **A line on each bar** | Upgrade. More legible; reads as AR |
| When numbers appear | After a hold-still still capture | **Live** | Upgrade, with a Lock step (§4) |
| Card | Scale for spacing | Scale for length | Same. Spacing, end-zone length and lap length work. Full bar length and diameter don't |
| AR | Not named | AR | Hybrid: the card measures, ARCore anchors (§3) |
| Diameter | Weigh test | Not mentioned | Keep the weigh test (physics.md: a 10 vs 12 mm call is marginal by camera) |
| Voice, Hindi fix, signed record | Tier 1 | Not mentioned | Open: the team decides (STATE.md) |

## 3. ARCore on the loaner (checked over ADB, 9 Oct 19:55-20:05)
- Google's web list (developers.google.com/ar/devices, fetched 9 Oct) does **not** list the plain iQOO 15 (I2501). It lists the iQOO 15R, 15T and 15 Ultra.
- The phone shipped with `/system/app/ARCoreStub0` (versionCode 0), a placeholder.
- After a Google account was signed in, Play Store installed **Google Play Services for AR 1.56.262080393** (20:02:21, installer `com.android.vending`). Play serves the real package only to certified devices, so **ARCore is supported on this phone.** The web list is stale.
- Still untested (hour-1 probe): `ArCoreApk.checkAvailability`, a session start, `isDepthModeSupported`, and the CPU-image camera configs ARCore offers.

**Use:**

| Job | Card (marker-based AR) | ARCore |
|---|---|---|
| Accuracy | ±2-5 mm (vision-stack §6) | ±1-5 cm (context/research/02-ondevice-ai.md). Too coarse for 50 mm spacing |
| Lines stay put when the card leaves the frame | No | Yes |
| Camera control (locked focus, exposure, 4K still) | Full | Limited; ARCore owns the session |
| Depth | None | Depth API, if supported |

**Decision:** the card measures; ARCore only anchors the overlay and the coverage map, and only if the probe passes. If it fails, card-only AR keeps the vision intact. Never quote an ARCore distance as a measurement.

## 4. Live pipeline (per preview frame, about 1080p)

| Step | AI? | Estimate |
|---|---|---|
| Card detection (ChArUco, OpenCV) | No | 10-25 ms CPU [U] |
| Bar pixels (segmentation on the NPU) | **Yes, the only AI in the loop** | 2-25 ms [vision-stack §1] |
| Lines: warp the mask to the card plane, sum along the bar direction, take peaks | No | < 5 ms [U] |
| Inverse homography and drawing | No | negligible |
| **Total** | | ~15-25 fps [U]; target ≥ 10 fps |

- Bars are tracked in card-plane mm, not screen pixels, so the lines stay stuck to the bars as the phone moves, and smoothing across frames is a median per bar slot.
- Mask out the card itself so its edges don't become lines.
- Live numbers show as "~50 mm". **Lock** fires when the gyro is still: about 15 frames are fused into one value with its band, and only a locked value gets a verdict.
- The rulebook verdict stays deterministic. AI never decides "within" or "outside".

Pitch line: **"AI finds the bars, maths measures them, rules decide."**

## 5. Loaner facts (ADB, 9 Oct)

| Item | Value |
|---|---|
| Model / SoC / OS | I2501 (PD2505F_EX_A_16.0.24.1.W30), SM8850 (`canoe`), Android 16 (API 36), OriginOS 7.0 |
| Main camera | 5.56 mm focal length, 8.19 x 6.14 mm sensor, 4096 x 3072 (8192 x 6144 max-res mode), Camera2 level 3, manual sensor + RAW, OIS, minimum focus 10 diopters (0.10 m) |
| Tele | 13.85 mm, minimum focus 1.54 diopters (**0.65 m**): unusable at 0.25-0.35 m |
| Ultra-wide | 2.31 mm, minimum focus 0.035 m |
| Depth / ToF | None |
| IMU | ST lsm6dsvx accelerometer, vivo gyro, game rotation vector |
| NPU access | `libcdsprpc.so`, `libQnnSampleOpPackage.so` in /vendor/lib64 |
| RAM / storage | 15.6 GB / 444 GB free |
| Other | HackTracker overlay running; Play Store and GMS present; a team Google account is now signed in (sign it out before returning the phone) |

Main-camera focal length in pixels ≈ 5.56 / 8.192 × 4096 ≈ 2,780 px at full width [U]; calibrate anyway (G0b).

## 6. Build-plan deltas (applied to BUILD-PLAN.md §0 and §6)
- **G0c, Fri 20:45 (B, 20 min max):** an ARCore probe: availability, session start, depth support, camera configs. Fail: card-only AR, no further time.
- **P4:** the overlay draws per-bar lines; the mask becomes a debug toggle.
- **P5:** the geometry runs on live preview frames at ≥ 10 fps (card-plane profile), plus Lock (multi-frame fusion with the band). Zhang-Suen and Hough stay only as a fallback if the profile method fails G1.
- **CP1 promise:** lines on each bar with live mm, Lock, a verdict, and the Hindi fix if voice is kept.
- **Demo beat:** a judge moves a bar, and its line and number follow live; then Lock and tape.
- **Claims:** say "AR overlay anchored to a printed card"; never "ARCore measures". Accuracy only from the error-table screen.

## 7. Risks
- Jitter or false lines from shadows, tie wire, chairs and the card edge: card mask, per-slot median, minimum line length.
- Crossing families on the mesh (top and bottom layers): two orientation families, as in P5.
- Thermals: continuous NPU, camera and torch. Log `getThermalHeadroom`.
- ARCore and Camera2 conflict: ARCore owns the camera, so a 4K still for the record may need the session paused. Card-only is the fallback.
