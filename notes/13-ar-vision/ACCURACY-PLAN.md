# Measurement accuracy plan — 10 Oct 2026

Proposal, not implemented or validated. No app changes in this session.

## Findings from the current native pipeline
- Fiducial.kt fits image points directly to card-plane mm; no explicit lens calibration/distortion correction or residual/conditioning gate in this path. Card detection accepts four corners; strip detection accepts one marker. These are detection minima, not sufficient measurement-quality guarantees.
- Pipeline.kt maps thresholded segmentation pixels directly through the homography. Segmenter uses 1152 x 640 input; CameraX requests 1920 x 1080 with a resolution fallback.
- Bars.kt uses a common family angle and mask-centroid refinement. Partial masks can bias centres; nonparallel bars need local spacing definitions and independent line fits.
- Both families use the card plane; height differences need validation or compensation. Current findings identify risks, not measured contributions to error.

## Order of work
1. Establish a repeatable baseline: rigid jig with independently measured centre-to-centre gaps, real ribbed steel, 50/75/100/150 mm spacings, both layers. Ground truth must be more accurate than the target; document instrument and repeat readings. Separate count errors from spacing errors.
2. Isolate geometry: a flat target with known distances and manually identified endpoints through the same camera pipeline, then real steel. A geometry failure should be fixed before model tuning.
3. Verify print dimensions in both axes and mount flat. Near-normal view, main camera, no digital zoom, short working distance that fits the zone and resolves markers. Treat working range as provisional until measured.
4. Calibrate each phone main-camera stream with a rigid ChArUco board at varied positions and tilts. Account for actual resolution/crop and focus configuration. Apply consistent distortion correction to marker and bar coordinates. Evaluate held-out distances, not just calibration residual. Avoid double correction if the delivered camera stream is already corrected.
5. Define measurement plane and layer explicitly. Card-on-top is not automatically the centreline plane. Test known offsets; use calibrated pose and known plane offsets where justified, otherwise restrict scope and abstain. For a near-normal pinhole view, relative scale error is approximately height mismatch divided by camera distance: 8/300 is about 2.7%, or 4 mm on a 150 mm gap. Illustrative calculation, not a measured device result.
6. Use AI to propose bar regions, then refine centres from original-resolution image edges across multiple cross-sections. Robustly reject ribs, ties, crossings, shadow boundaries and occlusion. Do not infer observed spacing from nominal drawing spacing. Fit independent lines where needed; report perpendicular/local spacing consistently.
7. Add a precision Lock path using a sharp high-resolution image or short registered burst. Upscaling a low-resolution mask adds no information. Camera mode must have matching calibration. More frames reduce some noise, not print-scale or plane bias.
8. Gate measurement on marker spread, residuals, local resolution, blur/focus, pose conditioning, bar support and temporal agreement. Current scaled marker threshold needs empirical validation. Keep re-scan as a valid outcome.
9. Fine-tune on independently labelled real prop/site imagery selected from failures; split by scene/capture session, not adjacent frames. Score physical measurement errors and counts, not segmentation IoU alone.

## Acceptance experiment
Initial pilot: 3 distances x 3 tilts x 2 lighting conditions x 5 independent repositioned locks = 90 captures of the same jig. This diagnoses failure patterns; it is not evidence of field generalisation. Extend to separate jigs, sessions, phones and real sites. Reserve a holdout before tuning.
Report signed bias, median/95th-percentile/max absolute gap error, exact count rate, re-scan rate, and coverage of the displayed uncertainty band. Report by layer and condition. Do not treat correlated gaps or burst frames as independent trials. Include rejected scans so accuracy cannot hide poor usability.
Proposed controlled-prop target: 95th-percentile absolute spacing error <= 2 mm for accepted scans. Stretch target, not a promise or current result. Retain the existing 5 mm field uncertainty floor until independent evidence supports changing it. Zero count mistakes is a test-set target, never a universal guarantee.

## Reference
OpenCV 4.10 ChArUco calibration: https://docs.opencv.org/4.10.0/da/d13/tutorial_aruco_calibration.html

## Next step
Record the baseline and geometry-only control on the loaner before choosing the first code change. Prioritise print/plane/calibration corrections, then original-image centre refinement and Lock. Real-steel accuracy remains unverified.
