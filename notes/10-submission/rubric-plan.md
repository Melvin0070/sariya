# Sariya: where each rubric point comes from (5 Oct 2026)

Screening factors first (they decide entry), then the on-site rubric. Reviewer scores are from three fresh screening reviewers on 4 Oct (files in this folder).

## Screening (novelty, tech impact, problem choice, scope fit, phone-first fit)
| Factor | Reviewer scores | What the submission does about it |
|---|---|---|
| Novelty | 8, 8, 9 | Names Japan first, then what is new for India. No city winner is in construction |
| Tech impact | 8, 8, 9 | The model does the measuring; compute split is stated (NPU, GPU, CPU) |
| Problem choice | 7, 7, 8 | One pictured moment; housing share of cement; no collapse statistics |
| Scope fit | 5, 5, 6 (the weak one) | Four numbered Tier-1 items; everything else cut or moved to the deck; fallbacks per tier in the deck |
| Phone-first fit | 9, 9, 9 | Camera is the instrument; voice in and out; offline; Office Kit two-way |

## On-site rubric
| Criterion | Weight | Plan |
|---|---|---|
| End product quality | 30 | A complete loop on real steel: drawing in, scan, verdict with error band, spoken fix, signed record, engineer's sign-off. "Would someone keep using it": a pour log per house (every member scanned, dated) that the engineer keeps |
| Novelty and impact | 20 | Honest competition slide; "re-scan" abstention as the memorable moment; a judge checks the number with a tape |
| Creative phone use (device data) | 15 | Camera in every scan, torch, gyro picks sharp frames, microphone for drawing numbers and tape readings, on-device models all weekend. During phone-only hours, scan the props repeatedly to grow the error table. The public tracker code counted camera use only when an app with "camera" in its package name was in front [U]: also take reference photos with the system camera, and ask the organisers (email question 3) |
| Technical depth | 15 | NPU segmentation with a measured NPU / GPU / CPU table on a numbers screen; int8 weights with int16 activations; error propagation from pixel to millimetre; versioned rulebook; hardware-backed signing; replay rejected |
| Office Kit (device data) | 10 | Two-way use: bar schedule laptop to phone; signed records phone to laptop; review and sign-off on the laptop; build and debug through Office Kit remote control in phone-only hours; mirror for every demo |
| Demo and presentation | 10 | Judge-placed fault; tape check; "re-scan" from 1.2 m; one site replay if real site data exists; rehearsed failure branches (tap-to-mark fallback) |
| Brownie points | - | Open models at the core, attributed: open segmentation weights on the NPU, Gemma 4 E2B on the GPU, IndicConformer on the CPU, OpenCV. Airplane mode throughout |

## Hour-1 checks on the loaner
1. Segmentation model compiles and runs on the NPU through LiteRT; log which accelerator actually ran.
2. Thin-bar mask quality after quantisation against float.
3. Camera2 level, manual focus and torch from a third-party app; main camera only is assumed.
4. Hindi and Kannada offline voices installed; number recognition in hall noise.
5. Gemma 4 E2B loads on the GPU; speed.
6. Whether sideloading a debug build is logged as tampering.
