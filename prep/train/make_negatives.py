#!/usr/bin/env python3
"""Hard negatives: write a COCO json with images and no annotations (every pixel = "not bar") for prep_data.py.

  python make_negatives.py --images DIR --out neg.json --sites sites.csv --site-prefix wires [--n 400]
      [--coco-ann instances_val2017.json --coco-cats laptop keyboard "cell phone" remote mouse tv] [--group-by-dir]
      [--video clip.mp4 --every-s 0.5 --frames-dir DIR --block-s 10]

Images are picked from DIR (recursive, jpg/png), optionally filtered to COCO images containing --coco-cats, then
sampled to --n with a fixed seed. --video first extracts a frame every --every-s seconds into --frames-dir.
Sites decide the train/val/test split in prep_data.py: one site per image, per sub-folder (--group-by-dir), or per
--block-s seconds of video, so near-duplicate frames never straddle splits. Rows are appended to --sites.
"""
import argparse
import csv
import json
import os
import random

import cv2


def extract(video: str, every_s: float, out_dir: str) -> list[tuple[str, float]]:
    os.makedirs(out_dir, exist_ok=True)
    cap = cv2.VideoCapture(video)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    step, i, out = max(1, round(every_s * fps)), 0, []
    stem = os.path.splitext(os.path.basename(video))[0]
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        if i % step == 0:
            t = i / fps
            p = os.path.join(out_dir, f"{stem}_{int(t * 1000):07d}.jpg")
            cv2.imwrite(p, frame, [cv2.IMWRITE_JPEG_QUALITY, 92])
            out.append((p, t))
        i += 1
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--images", required=True, help="root the COCO file_names are relative to")
    ap.add_argument("--out", required=True)
    ap.add_argument("--sites", required=True)
    ap.add_argument("--site-prefix", required=True)
    ap.add_argument("--n", type=int, default=0, help="sample this many (0 = all)")
    ap.add_argument("--include", default="", help="keep only paths containing this (e.g. /imgs/ to skip mask files)")
    ap.add_argument("--coco-ann")
    ap.add_argument("--coco-cats", nargs="*", default=[])
    ap.add_argument("--group-by-dir", action="store_true")
    ap.add_argument("--video", nargs="*", default=[])
    ap.add_argument("--every-s", type=float, default=0.5)
    ap.add_argument("--block-s", type=float, default=10.0)
    a = ap.parse_args()

    site_of: dict[str, str] = {}
    if a.video:
        for v in a.video:
            for p, t in extract(v, a.every_s, a.images):
                site_of[p] = f"{a.site_prefix}_{os.path.basename(v)}_{int(t // a.block_s)}"
        paths = sorted(site_of)
    else:
        paths = sorted(os.path.join(r, f) for r, _, fs in os.walk(a.images) for f in fs
                       if f.lower().endswith((".jpg", ".jpeg", ".png")))
    paths = [p for p in paths if a.include in p]
    if a.coco_ann:
        c = json.load(open(a.coco_ann))
        want = {k["id"] for k in c["categories"] if k["name"] in a.coco_cats}
        keep = {im["file_name"] for im in c["images"]
                if im["id"] in {x["image_id"] for x in c["annotations"] if x["category_id"] in want}}
        paths = [p for p in paths if os.path.basename(p) in keep]
    if a.n and len(paths) > a.n:
        paths = sorted(random.Random(0).sample(paths, a.n))

    images, rows = [], []
    for i, p in enumerate(paths, 1):
        h, w = cv2.imread(p).shape[:2]
        rel = os.path.relpath(p, a.images)
        images.append({"id": i, "file_name": rel, "width": w, "height": h})
        site = site_of.get(p) or (f"{a.site_prefix}_{os.path.dirname(rel)}" if a.group_by_dir
                                  else f"{a.site_prefix}_{os.path.splitext(rel)[0]}")
        rows.append([rel, site])
    json.dump({"images": images, "annotations": [], "categories": [{"id": 1, "name": "bar"}]}, open(a.out, "w"))
    with open(a.sites, "a", newline="") as f:
        csv.writer(f).writerows(rows)
    print(f"{a.out}: {len(images)} negative images, {len({r[1] for r in rows})} sites")


if __name__ == "__main__":
    main()
