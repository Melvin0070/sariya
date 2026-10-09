"""Write a synthetic slab scene + intrinsics + spec into ref_pipeline/samples/ and run the CLI on it.

  python -m ref_pipeline.make_samples       -> samples/slab_synthetic.png, intrinsics_synthetic_4k.json,
                                               spec_slab.json, slab_synthetic_result.json, slab_synthetic_overlay.png
The real cage stills from P9 replace these; the spec and intrinsics layouts stay the same.
"""
import json, os
import cv2, numpy as np
from .tests import synth
from .tests.test_pipeline_slab import PPMM, XS, YS, CARD_ORIGIN, ZONE, N_X_IN_ZONE
from .run_one import main as run_main

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "samples")
os.makedirs(OUT, exist_ok=True)
canvas = synth.blank_canvas(1300, 760, PPMM)
for x in XS:
    synth.draw_bar(canvas, PPMM, (x, 0), (x, 760), 10)
for y in YS:
    synth.draw_bar(canvas, PPMM, (0, y), (1300, y), 10)
synth.paste_card(canvas, PPMM, 3, tuple(CARD_ORIGIN))
K = synth.K_of(); R = synth.rot(tilt_x_deg=8.0, roll_deg=3.0); C = synth.camera_looking_at((600, 350), 800.0, R)
img, _ = synth.project_canvas(canvas, PPMM, K, R, C)
cv2.imwrite(os.path.join(OUT, "slab_synthetic.png"), img)
json.dump({"capture_mode": "synthetic_4k", "image_size": [3840, 2160], "K": K.tolist(), "dist": [0, 0, 0, 0, 0], "rms_px": 0.0,
           "note": "synthetic pinhole, f=2662 px (iQOO 15 main camera estimate); replace with calibrate.py output"},
          open(os.path.join(OUT, "intrinsics_synthetic_4k.json"), "w"), indent=1)
json.dump({"member": "slab", "fiducial": "card", "zone_mm": ZONE, "bar_dia_mm": 10, "polarity": "auto", "main_axis": "y",
           "n_spec": {"main": 6, "dist": N_X_IN_ZONE}, "s_spec": {"main": 150, "dist": 120}, "d": 101, "D": 125,
           "dia": {"main": 10, "dist": 10}, "hysd": True, "zone": "II", "apply_13920": False,
           "_doc": "zone_mm is in CARD mm (origin = top-left chess corner, x right, y down on the print)"},
          open(os.path.join(OUT, "spec_slab.json"), "w"), indent=1)
json.dump({"member": "beam", "fiducial": "strip", "bar_dia_mm": 8, "polarity": "auto", "min_len_mm": 120,
           "s_spec_end": 100, "s_spec_mid": 150, "d": 409, "dia_long_min": 16, "L_end_spec": 600, "faces_mm": [0, 1800],
           "zone": "II", "apply_13920": False,
           "_doc": "faces_mm = column faces in STRIP mm (strip origin at its left end); links are the family crossing the strip"},
          open(os.path.join(OUT, "spec_beam.json"), "w"), indent=1)
run_main(["--image", os.path.join(OUT, "slab_synthetic.png"), "--intrinsics", os.path.join(OUT, "intrinsics_synthetic_4k.json"),
          "--spec", os.path.join(OUT, "spec_slab.json")])
