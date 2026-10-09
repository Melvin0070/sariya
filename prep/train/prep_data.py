#!/usr/bin/env python3
"""COCO / Roboflow-COCO export -> binary bar masks, 1152x640 tiles, site-wise split, augmentation config.

  python prep_data.py --coco export/_annotations.coco.json --images export/ --out data/ \
      [--classes rebar bar stirrup] [--tiles 1 2] [--site-regex '^([A-Za-z0-9]+)_'] [--sites sites.csv]

Also accepts several --coco/--images pairs (public sets + our own).  Output:
  data/{train,val,test}/images/*.png     RGB tiles, 1152x640
  data/{train,val,test}/masks/*.png      0/255 bar mask
  data/{train,val,test}/masks3/*.png     0 bg / 1 longitudinal (within 45 deg of image x) / 2 transverse
  data/dataset.json                      counts, sites per split, sha256 over every tile (train_unet logs it)
  data/augment.json                      the thin-bar augmentation config train_unet.py builds its pipeline from

Site-wise split: the site id comes from the file name (regex group 1) or a CSV (filename,site); a site
hash decides the split so re-running never leaks a site across splits.  Our own site photos should
be forced to val/test with --val-sites / --test-sites.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import sys

import cv2
import numpy as np

TILE_W, TILE_H = 1152, 640

AUGMENT = {
    "_doc": "Thin-bar augmentation (vision-stack.md 4.2). Built into an albumentations Compose by train_unet.py. "
            "Flips are allowed for the binary mask only; masks3 orientation classes would need label swapping.",
    "input": [TILE_H, TILE_W],
    "random_scale": {"scale_limit": [-0.5, 0.5], "p": 0.7},
    "rotate": {"limit": 15, "p": 0.7},
    "perspective": {"scale": [0.02, 0.05], "p": 0.4},
    "motion_blur": {"blur_limit": [3, 9], "p": 0.4},
    "brightness_contrast": {"brightness_limit": 0.3, "contrast_limit": 0.3, "p": 0.8},
    "colour_temperature": {"r_shift": 20, "g_shift": 10, "b_shift": 25, "p": 0.5},
    "specular_highlights": {"n": [1, 6], "radius_px": [6, 40], "strength": [0.3, 0.9], "p": 0.5},
    "shadow": {"p": 0.4},
    "jpeg": {"quality": [55, 95], "p": 0.4},
    "hflip": {"p": 0.5},
    "vflip": {"p": 0.2},
    "mosaic_off_last_epochs": 10,
}


def site_of(fname: str, regex: str, table: dict[str, str]) -> str:
    if fname in table:
        return table[fname]
    m = re.match(regex, os.path.basename(fname))
    return m.group(1) if m else "unknown"


def split_of(site: str, ratios=(0.7, 0.15, 0.15), force: dict[str, str] | None = None) -> str:
    if force and site in force:
        return force[site]
    h = int(hashlib.sha1(site.encode()).hexdigest(), 16) % 1000 / 1000.0
    return "train" if h < ratios[0] else ("val" if h < ratios[0] + ratios[1] else "test")


def _poly_angle_deg(poly: np.ndarray) -> float:
    q = poly - poly.mean(axis=0)
    w, v = np.linalg.eigh(q.T @ q)
    d = v[:, 1]
    return float(np.degrees(np.arctan2(d[1], d[0])) % 180.0)


def instance_masks(ann: dict, h: int, w: int) -> np.ndarray | None:
    seg = ann.get("segmentation")
    if not seg:
        return None
    if isinstance(seg, dict):                                   # RLE (Roboflow "iscrowd" or SAM exports)
        from pycocotools import mask as mu
        rle = mu.frPyObjects(seg, h, w) if isinstance(seg["counts"], list) else seg
        return mu.decode(rle).astype(bool)
    m = np.zeros((h, w), np.uint8)
    for p in seg:
        pts = np.round(np.asarray(p, np.float64).reshape(-1, 2)).astype(np.int32)
        if len(pts) >= 3:
            cv2.fillPoly(m, [pts], 1)
    return m.astype(bool)


def tiles_of(img: np.ndarray, n: int):
    """n x n grid of crops, each letterboxed to TILE_W x TILE_H without aspect distortion."""
    h, w = img.shape[:2]
    for i in range(n):
        for j in range(n):
            y0, y1 = i * h // n, (i + 1) * h // n
            x0, x1 = j * w // n, (j + 1) * w // n
            yield f"t{n}_{i}{j}", (x0, y0, x1, y1)


def letterbox(img: np.ndarray, interp) -> np.ndarray:
    h, w = img.shape[:2]
    s = min(TILE_W / w, TILE_H / h)
    nw, nh = int(round(w * s)), int(round(h * s))
    r = cv2.resize(img, (nw, nh), interpolation=interp)
    out = np.zeros((TILE_H, TILE_W) + img.shape[2:], img.dtype)
    y0, x0 = (TILE_H - nh) // 2, (TILE_W - nw) // 2
    out[y0:y0 + nh, x0:x0 + nw] = r
    return out


def process(coco_path, img_dir, out, classes, tiles, site_regex, site_table, force, stats, min_mask_frac):
    coco = json.load(open(coco_path))
    cat_ok = {c["id"] for c in coco["categories"] if not classes or c["name"].lower() in classes}
    anns = {}
    for a in coco["annotations"]:
        if a["category_id"] in cat_ok:
            anns.setdefault(a["image_id"], []).append(a)
    for im in coco["images"]:
        path = os.path.join(img_dir, im["file_name"])
        img = cv2.imread(path, cv2.IMREAD_COLOR)
        if img is None:
            print("skip (unreadable):", path, file=sys.stderr)
            continue
        h, w = img.shape[:2]
        mask = np.zeros((h, w), np.uint8)
        mask3 = np.zeros((h, w), np.uint8)
        for a in anns.get(im["id"], []):
            m = instance_masks(a, h, w)
            if m is None:
                continue
            mask[m] = 255
            seg = a["segmentation"]
            if isinstance(seg, list) and seg and len(seg[0]) >= 6:
                ang = _poly_angle_deg(np.asarray(seg[0], np.float64).reshape(-1, 2))
                mask3[m] = 1 if min(ang, 180 - ang) <= 45 else 2
            else:
                mask3[m] = 1
        site = site_of(im["file_name"], site_regex, site_table)
        split = split_of(site, force=force)
        stats["sites"].setdefault(split, set()).add(site)
        base = os.path.splitext(os.path.basename(im["file_name"]))[0]
        for n in tiles:
            for tag, (x0, y0, x1, y1) in tiles_of(img, n):
                mt = mask[y0:y1, x0:x1]
                if mt.mean() / 255.0 < min_mask_frac and split == "train":
                    stats["dropped_empty"] += 1
                    continue
                name = f"{base}_{tag}.png"
                cv2.imwrite(os.path.join(out, split, "images", name), letterbox(img[y0:y1, x0:x1], cv2.INTER_AREA))
                cv2.imwrite(os.path.join(out, split, "masks", name), letterbox(mt, cv2.INTER_NEAREST))
                cv2.imwrite(os.path.join(out, split, "masks3", name), letterbox(mask3[y0:y1, x0:x1], cv2.INTER_NEAREST))
                stats["tiles"][split] = stats["tiles"].get(split, 0) + 1
        stats["images"] += 1


def dataset_sha256(out: str) -> str:
    h = hashlib.sha256()
    for split in ("train", "val", "test"):
        for kind in ("images", "masks"):
            d = os.path.join(out, split, kind)
            for f in sorted(os.listdir(d)):
                h.update(f.encode())
                with open(os.path.join(d, f), "rb") as fh:
                    h.update(fh.read())
    return h.hexdigest()


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--coco", action="append", required=True)
    ap.add_argument("--images", action="append", required=True, help="image dir matching each --coco")
    ap.add_argument("--out", required=True)
    ap.add_argument("--classes", nargs="*", default=[], help="category names counted as bar (default all)")
    ap.add_argument("--tiles", nargs="*", type=int, default=[1, 2], help="grid sizes: 1 = whole frame, 2 = 2x2")
    ap.add_argument("--site-regex", default=r"^([A-Za-z0-9]+)_")
    ap.add_argument("--sites", default=None, help="CSV filename,site")
    ap.add_argument("--val-sites", nargs="*", default=[])
    ap.add_argument("--test-sites", nargs="*", default=[])
    ap.add_argument("--min-mask-frac", type=float, default=0.002, help="drop train tiles with fewer bar pixels than this")
    a = ap.parse_args(argv)
    if len(a.coco) != len(a.images):
        sys.exit("--coco and --images must pair up")
    table = {}
    if a.sites:
        with open(a.sites) as f:
            for row in csv.reader(f):
                if len(row) >= 2:
                    table[row[0]] = row[1]
    force = {s: "val" for s in a.val_sites} | {s: "test" for s in a.test_sites}
    for split in ("train", "val", "test"):
        for kind in ("images", "masks", "masks3"):
            os.makedirs(os.path.join(a.out, split, kind), exist_ok=True)
    stats = {"images": 0, "tiles": {}, "sites": {}, "dropped_empty": 0}
    for c, d in zip(a.coco, a.images):
        process(c, d, a.out, {x.lower() for x in a.classes}, a.tiles, a.site_regex, table, force, stats, a.min_mask_frac)
    stats["sites"] = {k: sorted(v) for k, v in stats["sites"].items()}
    stats["sha256"] = dataset_sha256(a.out)
    stats["tile_size"] = [TILE_W, TILE_H]
    stats["sources"] = [{"coco": c, "images": d} for c, d in zip(a.coco, a.images)]
    with open(os.path.join(a.out, "dataset.json"), "w") as f:
        json.dump(stats, f, indent=1)
    with open(os.path.join(a.out, "augment.json"), "w") as f:
        json.dump(AUGMENT, f, indent=1)
    print(json.dumps({k: stats[k] for k in ("images", "tiles", "sites", "dropped_empty", "sha256")}, indent=1))


if __name__ == "__main__":
    main()
