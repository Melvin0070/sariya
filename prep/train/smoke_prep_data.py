#!/usr/bin/env python3
"""Smoke test for prep_data.py: 3 synthetic 1920x1080 site images with polygon bars in COCO form,
three sites (one forced to val, one to test), tiles 1 and 2.  Runs in a temp dir; prints the stats.

  python smoke_prep_data.py
"""
import json
import os
import subprocess
import sys
import tempfile

import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))


def make_dataset(root):
    os.makedirs(root, exist_ok=True)
    images, anns = [], []
    aid = 1
    for i, site in enumerate(("siteA", "siteB", "siteC")):
        name = f"{site}_frame{i:02d}.jpg"
        img = np.full((1080, 1920, 3), 150, np.uint8)
        for x in range(200, 1900, 300):                 # vertical bars as 24 px wide polygons
            cv2.rectangle(img, (x, 0), (x + 24, 1079), (40, 40, 40), -1)
            anns.append({"id": aid, "image_id": i + 1, "category_id": 1, "iscrowd": 0, "bbox": [x, 0, 24, 1080], "area": 24 * 1080,
                         "segmentation": [[x, 0, x + 24, 0, x + 24, 1079, x, 1079]]}); aid += 1
        for y in range(150, 1000, 250):                 # horizontal bars
            cv2.rectangle(img, (0, y), (1919, y + 24), (40, 40, 40), -1)
            anns.append({"id": aid, "image_id": i + 1, "category_id": 1, "iscrowd": 0, "bbox": [0, y, 1920, 24], "area": 24 * 1920,
                         "segmentation": [[0, y, 1919, y, 1919, y + 24, 0, y + 24]]}); aid += 1
        cv2.imwrite(os.path.join(root, name), img)
        images.append({"id": i + 1, "file_name": name, "width": 1920, "height": 1080})
    coco = {"images": images, "annotations": anns, "categories": [{"id": 1, "name": "rebar"}, {"id": 2, "name": "person"}]}
    p = os.path.join(root, "_annotations.coco.json")
    json.dump(coco, open(p, "w"))
    return p


def main():
    with tempfile.TemporaryDirectory() as td:
        coco = make_dataset(os.path.join(td, "export"))
        out = os.path.join(td, "data")
        subprocess.check_call([sys.executable, os.path.join(HERE, "prep_data.py"), "--coco", coco, "--images", os.path.join(td, "export"),
                              "--out", out, "--classes", "rebar", "--tiles", "1", "2", "--val-sites", "siteB", "--test-sites", "siteC"])
        stats = json.load(open(os.path.join(out, "dataset.json")))
        assert stats["images"] == 3
        assert stats["tiles"] == {"train": 5, "val": 5, "test": 5}, stats["tiles"]
        assert stats["sites"] == {"train": ["siteA"], "val": ["siteB"], "test": ["siteC"]}, stats["sites"]
        assert len(stats["sha256"]) == 64
        img = cv2.imread(os.path.join(out, "train", "images", "siteA_frame00_t1_00.png"))
        m = cv2.imread(os.path.join(out, "train", "masks", "siteA_frame00_t1_00.png"), 0)
        m3 = cv2.imread(os.path.join(out, "train", "masks3", "siteA_frame00_t1_00.png"), 0)
        assert img.shape == (640, 1152, 3) and m.shape == (640, 1152)
        assert set(np.unique(m)) == {0, 255} and set(np.unique(m3)) == {0, 1, 2}, (np.unique(m), np.unique(m3))
        assert 0.05 < (m > 0).mean() < 0.5
        assert os.path.exists(os.path.join(out, "augment.json"))
        print("smoke test OK:", stats["tiles"], "mask frac", round(float((m > 0).mean()), 3))


if __name__ == "__main__":
    main()
