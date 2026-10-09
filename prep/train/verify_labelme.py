#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = ["numpy", "opencv-python-headless"]
# ///
"""Verify a LabelMe-polygon rebar set (ROI-1555) and write one COCO file per folder for prep_data.py.

  uv run prep/train/verify_labelme.py ~/sariya-data/roi1555 1260/img_label scen1/test2017 scen2/test2017 scen3/test2017

Checks per image: the jpg decodes, its size matches imageWidth/imageHeight, every polygon has >= 3 points
inside the image and non-zero area, and the label is known.  Writes <root>/coco/<folder>.json,
<root>/verify_report.json and <root>/verify_sheet.jpg (12 random overlays).  Exits 1 on any hard error.
"""
import json
import random
import sys
from collections import Counter
from pathlib import Path

import cv2
import numpy as np

LABELS = {"straight": 1, "hoop": 2}


def check_folder(root: Path, rel: str, report: dict, samples: list) -> None:
    d = root / rel
    images, anns, errors = [], [], []
    labels, per_img, sizes = Counter(), [], Counter()
    for i, jf in enumerate(sorted(d.glob("*.json")), 1):
        lm = json.loads(jf.read_text())
        img_path = jf.with_suffix(".jpg")
        img = cv2.imread(str(img_path))
        if img is None:
            errors.append(f"{jf.name}: image missing or undecodable")
            continue
        h, w = img.shape[:2]
        if (lm.get("imageWidth"), lm.get("imageHeight")) != (w, h):
            errors.append(f"{jf.name}: json size {lm.get('imageWidth')}x{lm.get('imageHeight')} != image {w}x{h}")
        sizes[f"{w}x{h}"] += 1
        images.append({"id": i, "file_name": f"{rel}/{img_path.name}", "width": w, "height": h})
        # Labels are "<class>-<instance>" (e.g. straight-3); several polygons with one label are one bar.
        groups: dict[str, list] = {}
        for s in lm.get("shapes", []):
            lab, pts = s.get("label", ""), np.asarray(s.get("points", []), dtype=np.float64)
            if lab.split("-")[0] not in LABELS:
                errors.append(f"{jf.name}: unknown label {lab!r}")
                continue
            if s.get("shape_type", "polygon") != "polygon" or len(pts) < 3:
                errors.append(f"{jf.name}: {lab} is not a polygon with >= 3 points")
                continue
            if (pts < -1).any() or (pts[:, 0] > w + 1).any() or (pts[:, 1] > h + 1).any():
                errors.append(f"{jf.name}: {lab} polygon leaves the image")
            if cv2.contourArea(pts.astype(np.float32)) <= 0:
                errors.append(f"{jf.name}: {lab} polygon has zero area")
                continue
            groups.setdefault(lab, []).append(pts)
        for lab, polys in groups.items():
            allp = np.vstack(polys)
            x, y = allp.min(0)
            bw, bh = allp.max(0) - allp.min(0)
            cls = lab.split("-")[0]
            anns.append({"id": len(anns) + 1, "image_id": i, "category_id": LABELS[cls], "iscrowd": 0,
                         "area": float(sum(cv2.contourArea(p.astype(np.float32)) for p in polys)),
                         "bbox": [float(x), float(y), float(bw), float(bh)],
                         "segmentation": [p.ravel().tolist() for p in polys]})
            labels[cls] += 1
        n = len(groups)
        if n == 0:
            errors.append(f"{jf.name}: no rebar polygons")
        per_img.append(n)
        samples.append((img_path, lm))
    out = root / "coco" / (rel.replace("/", "_") + ".json")
    out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps({"images": images, "annotations": anns,
                               "categories": [{"id": v, "name": k} for k, v in LABELS.items()]}))
    report[rel] = {"images": len(images), "instances": dict(labels), "errors": errors,
                   "instances_per_image": {"min": min(per_img, default=0), "median": int(np.median(per_img or [0])),
                                           "max": max(per_img, default=0)},
                   "sizes_top5": sizes.most_common(5), "coco": str(out)}


def contact_sheet(samples: list, out: Path, n: int = 12) -> None:
    tiles = []
    for img_path, lm in random.Random(0).sample(samples, min(n, len(samples))):
        img = cv2.imread(str(img_path))
        over = img.copy()
        for s in lm["shapes"]:
            colour = (0, 255, 0) if s["label"].startswith("straight") else (0, 0, 255)
            cv2.fillPoly(over, [np.asarray(s["points"], np.int32)], colour)
        img = cv2.addWeighted(img, 0.55, over, 0.45, 0)
        img = cv2.resize(img, (480, int(480 * img.shape[0] / img.shape[1])))
        img = cv2.copyMakeBorder(img, 0, max(0, 640 - img.shape[0]), 0, 0, cv2.BORDER_CONSTANT)[:640]
        cv2.putText(img, img_path.parent.parent.name + "/" + img_path.name, (8, 24), 0, 0.6, (255, 255, 255), 2)
        tiles.append(img)
    while len(tiles) % 4:
        tiles.append(np.zeros_like(tiles[0]))
    cv2.imwrite(str(out), np.vstack([np.hstack(tiles[i:i + 4]) for i in range(0, len(tiles), 4)]))


if __name__ == "__main__":
    root, folders = Path(sys.argv[1]).expanduser(), sys.argv[2:]
    report, samples = {}, []
    for rel in folders:
        check_folder(root, rel, report, samples)
    (root / "verify_report.json").write_text(json.dumps(report, indent=1))
    contact_sheet(samples, root / "verify_sheet.jpg")
    total_err = 0
    for rel, r in report.items():
        total_err += len(r["errors"])
        print(f"{rel}: {r['images']} images, {r['instances']}, per image {r['instances_per_image']}, "
              f"sizes {r['sizes_top5'][:2]}, errors {len(r['errors'])}")
        for e in r["errors"][:5]:
            print("   ", e)
    print(f"total images {sum(r['images'] for r in report.values())}, errors {total_err}")
    sys.exit(1 if total_err else 0)
