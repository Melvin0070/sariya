# Issue refresh after pulling 52db88a

Pulled `52db88a` on 10 Oct. The repository now contains `models/seg/v1/unet_mbv3_1152.tflite` (26,935,452 bytes), locally checked SHA-256 `196d279e980b159e88c5a4b60936daeb8f593c9ac45e3fe02c424c614599f7c0`, its PyTorch checkpoint, dataset manifest, training/export logs and [notes/14-model/MODEL-V1.md](https://github.com/Melvin0070/sariya/blob/52db88a/notes/14-model/MODEL-V1.md). Training log records held-out segmentation IoU 0.8466 / F1 0.917; these are pixel-mask metrics, not millimetre measurement accuracy.

The report records iQOO 15 CLI inference averages: NPU burst 12.2 ms, NPU 60-second burst 12.8 ms, GPU 19.8 ms, CPU 234.6 ms. This is prior reported benchmark evidence, not a benchmark rerun in this issue refresh, not p50/p95, and not full camera-to-verdict latency. G0's standalone runtime feasibility is reported passed; Android APK delivery, app backend selection, camera preprocessing parity and G1 tape validation remain open.

Use the portable float model with on-device JIT, matching QAIRT 2.50/v81 runtime libraries, an explicit tested performance mode and persistent compiler cache. Default NPU mode was reported at 73.3 ms; `Accelerator.NPU` alone does not establish 12.2 ms. Cold compile ~53 seconds and cache-hit startup 4–8 seconds need a preparation state. AOT is not a blocker. The committed AOT error is missing `libc++.so.1`; the report's on-device QAIRT 2.47 incompatibility is a separate failure and must not be assumed to explain that file.

## Changed briefs

- B01: Bootstrap the event app and freeze the three-lane contracts
- B02: Integrate exported v1 with QAIRT 2.50, JIT cache and camera parity
- B03: Build the spec form and scan UI against fixture contracts
- B06: Extract and track live bar lines in card coordinates
- B08: Lock measurements with honest uncertainty and pass the tape gate
- B10: Integrate and freeze the first real mesh loop on all three phones
- B17: Validate lower-layer measurements and sustained device behavior
- B18: Expose the bench error table, scan history and truthful numbers
- B19: Prepare the demo scripts, deck and real backup recording
- B20: Freeze, verify and package the release candidate
- B24: Validate the product on real sites with an engineer before a pilot

No issues closed: the new evidence resolves model preparation/runtime feasibility, not the remaining Android and end-to-end acceptance. Owners, milestone targets and dependencies retained.
