"""Round 2 on Kaggle: build hard negatives from attached public datasets, merge with the ROI-1555 tiles, and
measure the false-alarm rate (bar pixels predicted on no-rebar tiles). Called from the push_train.sh bootstrap.

Negatives (every pixel "not bar"): electric-wires photos (cables, the v1 failure), COCO val2017 images that contain
laptop / keyboard / cell phone / remote / mouse / tv, and 300 MIT indoor scenes. Optional: our own clutter video
frames in a dataset with a folder named "venue".
"""
import glob
import hashlib
import json
import os
import subprocess
import sys

H = os.path.dirname(os.path.abspath(__file__))
TMP = "/kaggle/temp"


def _root(marker: str) -> str | None:
    hits = glob.glob(f"/kaggle/input/**/{marker}", recursive=True)
    return hits[0][: -len(marker)].rstrip("/") if hits else None


def _neg(images: str, name: str, *extra: str) -> tuple[str, str] | None:
    out = f"{TMP}/neg/{name}.json"
    subprocess.check_call([sys.executable, f"{H}/make_negatives.py", "--images", images, "--out", out,
                           "--sites", f"{TMP}/neg/sites.csv", "--site-prefix", name, *extra])
    return out, images


def prepare(roi_dir: str) -> str:
    os.makedirs(f"{TMP}/neg", exist_ok=True)
    pairs = []
    wires = _root("train/train/imgs")
    if wires:
        pairs.append(_neg(wires, "wires", "--include", "/imgs/"))
    coco = _root("coco2017/annotations/instances_val2017.json")
    if coco:
        pairs.append(_neg(f"{coco}/coco2017/val2017", "coco", "--coco-ann", f"{coco}/coco2017/annotations/instances_val2017.json",
                          "--coco-cats", "laptop", "keyboard", "cell phone", "remote", "mouse", "tv", "--n", "400"))
    indoor = _root("indoorCVPR_09/Images")
    if indoor:
        pairs.append(_neg(f"{indoor}/indoorCVPR_09/Images", "indoor", "--n", "300", "--group-by-dir"))
    venue = _root("venue")
    if venue:
        pairs.append(_neg(f"{venue}/venue", "venue", "--group-by-dir"))
    args = [sys.executable, f"{H}/prep_data.py", "--out", f"{TMP}/negtiles", "--tiles", "1",
            "--sites", f"{TMP}/neg/sites.csv", "--min-mask-frac", "0"]
    for js, img in pairs:
        args += ["--coco", js, "--images", img]
    subprocess.check_call(args)

    data = f"{TMP}/data"                     # ROI tiles (symlinked) + negatives, one tree for train_unet.py
    neg_names: dict[str, list[str]] = {}
    for src, tag in ((roi_dir, "roi"), (f"{TMP}/negtiles", "neg")):
        for split in ("train", "val", "test"):
            for kind in ("images", "masks", "masks3"):
                os.makedirs(f"{data}/{split}/{kind}", exist_ok=True)
                for f in os.listdir(f"{src}/{split}/{kind}"):
                    os.symlink(f"{src}/{split}/{kind}/{f}", f"{data}/{split}/{kind}/{f}")
                    if tag == "neg" and kind == "images":
                        neg_names.setdefault(split, []).append(f)
    roi_meta = json.load(open(f"{roi_dir}/dataset.json"))
    neg_meta = json.load(open(f"{TMP}/negtiles/dataset.json"))
    meta = {"sha256": hashlib.sha256((roi_meta["sha256"] + neg_meta["sha256"]).encode()).hexdigest(),
            "tiles": {s: len(os.listdir(f"{data}/{s}/images")) for s in ("train", "val", "test")},
            "roi": roi_meta.get("tiles"), "neg": {s: len(v) for s, v in neg_names.items()},
            "neg_sources": [os.path.basename(js) for js, _ in pairs]}
    json.dump(meta, open(f"{data}/dataset.json", "w"), indent=1)
    json.dump(neg_names, open(f"{data}/neg_names.json", "w"))
    os.symlink(f"{roi_dir}/augment.json", f"{data}/augment.json")
    print("round-2 data:", json.dumps(meta))
    return data


def false_alarm(weights: str, data: str, build_model, split: str = "test") -> dict:
    """Share of pixels marked bar on no-rebar tiles, and share of those tiles with any blob >= 0.5 % of the frame."""
    import cv2
    import numpy as np
    import torch
    names = json.load(open(f"{data}/neg_names.json")).get(split, [])
    dev = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    m = build_model(None).to(dev).eval()
    m.load_state_dict(torch.load(weights, map_location=dev))
    mean = np.array([0.485, 0.456, 0.406], np.float32); std = np.array([0.229, 0.224, 0.225], np.float32)
    px = flagged = 0.0
    for n in names:
        rgb = cv2.cvtColor(cv2.imread(f"{data}/{split}/images/{n}"), cv2.COLOR_BGR2RGB)
        x = torch.from_numpy(((rgb / 255.0 - mean) / std).astype(np.float32).transpose(2, 0, 1)[None]).to(dev)
        with torch.no_grad():
            p = (m(x) > 0).float().mean().item()
        px += p; flagged += p >= 0.005
    k = max(len(names), 1)
    return {"tiles": len(names), "bar_pixel_pct": round(100 * px / k, 3), "tiles_flagged_pct": round(100 * flagged / k, 1)}
