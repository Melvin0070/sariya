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


STIRRUP = "tsrobcvai/Synthetic_Dataset_for_Stirrup_Rebar_Segmentation"   # Sun et al. 2025; no licence declared
REAL_DIR = f"{TMP}/realtiles"


def _stirrup(n_syn: int) -> None:
    """Round 3 positives (needs internet): n_syn synthetic stirrup scenes (varied colour, light, background,
    distractors; straight segments labelled, bends not) + the 233 real stirrup photos as a val/test split."""
    pre = _root("postiles/dataset.json")          # sariya-stirrup-tiles: the same sample, tiled on the laptop
    if pre:
        os.symlink(f"{pre}/postiles", f"{TMP}/postiles"); os.symlink(f"{pre}/realtiles", REAL_DIR)
        return
    import random
    from huggingface_hub import hf_hub_download, snapshot_download   # anonymous HF: ~1 file/s, ~45 min for 2,733 files
    d = f"{TMP}/stirrup"
    ann = json.load(open(hf_hub_download(STIRRUP, "train_syn/annotations/instances_val2017.json", repo_type="dataset", local_dir=d)))
    ims = random.Random(0).sample(ann["images"], n_syn)
    keep = {im["id"] for im in ims}
    json.dump({"images": ims, "annotations": [a for a in ann["annotations"] if a["image_id"] in keep],
               "categories": ann["categories"]}, open(f"{d}/syn.json", "w"))
    del ann
    snapshot_download(STIRRUP, repo_type="dataset", local_dir=d, max_workers=16,
                      allow_patterns=[f"train_syn/val2017/{im['file_name']}" for im in ims] + ["test_real/imgs_labels/*"])
    with open(f"{d}/syn_sites.csv", "w") as f:
        f.writelines(f"{im['file_name']},stsyn_{im['file_name']}\n" for im in ims)
    subprocess.check_call([sys.executable, f"{H}/prep_data.py", "--coco", f"{d}/syn.json", "--images", f"{d}/train_syn/val2017",
                           "--out", f"{TMP}/postiles", "--tiles", "1", "--sites", f"{d}/syn_sites.csv"])
    real = f"{d}/test_real/imgs_labels"           # LabelMe polygons "straight_N" -> COCO, sites A/B -> val/test
    images, anns, rows = [], [], []
    for i, jf in enumerate(sorted(glob.glob(f"{real}/*.json")), 1):
        lm = json.load(open(jf))
        name = os.path.basename(jf)[:-5] + ".jpg"
        images.append({"id": i, "file_name": name, "width": lm["imageWidth"], "height": lm["imageHeight"]})
        for s in lm["shapes"]:
            if len(s["points"]) >= 3:
                pts = [c for p in s["points"] for c in p]
                anns.append({"id": len(anns) + 1, "image_id": i, "category_id": 1, "iscrowd": 0, "segmentation": [pts],
                             "area": 0.0, "bbox": [0, 0, 0, 0]})
        rows.append(f"{name},streal_{'A' if i % 2 else 'B'}\n")
    json.dump({"images": images, "annotations": anns, "categories": [{"id": 1, "name": "bar"}]}, open(f"{d}/real.json", "w"))
    open(f"{d}/real_sites.csv", "w").writelines(rows)
    # Only the top bars are labelled in these photos, so they never enter train/val; scored by recall only.
    subprocess.check_call([sys.executable, f"{H}/prep_data.py", "--coco", f"{d}/real.json", "--images", real, "--out", REAL_DIR,
                           "--tiles", "1", "--sites", f"{d}/real_sites.csv", "--test-sites", "streal_A", "streal_B"])


def prepare(roi_dir: str) -> str:
    # Counts per source; round 2 defaults. Round 3 sets R_STIRRUP (positives) and trims the desk negatives.
    n = {k: int(os.environ.get(f"R_{k.upper()}", v)) for k, v in
         (("wires", 400), ("coco", 400), ("indoor", 300), ("stirrup", 0))}
    os.makedirs(f"{TMP}/neg", exist_ok=True)
    pairs = []
    wires = _root("train/train/imgs")
    if wires and n["wires"]:
        pairs.append(_neg(wires, "wires", "--include", "/imgs/", "--n", str(n["wires"])))   # 28,646 in the set
    coco = _root("coco2017/annotations/instances_val2017.json")
    if coco and n["coco"]:
        pairs.append(_neg(f"{coco}/coco2017/val2017", "coco", "--coco-ann", f"{coco}/coco2017/annotations/instances_val2017.json",
                          "--coco-cats", "laptop", "keyboard", "cell phone", "remote", "mouse", "tv", "--n", str(n["coco"])))
    indoor = _root("indoorCVPR_09/Images")
    if indoor and n["indoor"]:
        pairs.append(_neg(f"{indoor}/indoorCVPR_09/Images", "indoor", "--n", str(n["indoor"]), "--group-by-dir"))
    if n["stirrup"]:
        _stirrup(n["stirrup"])
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
    trees = [(roi_dir, "roi"), (f"{TMP}/negtiles", "neg")]
    if n["stirrup"]:
        trees += [(f"{TMP}/postiles", "stirrup_syn")]
    for src, tag in trees:
        for split in ("train", "val", "test"):
            for kind in ("images", "masks", "masks3"):
                os.makedirs(f"{data}/{split}/{kind}", exist_ok=True)
                for f in os.listdir(f"{src}/{split}/{kind}"):
                    dst = f if tag == "roi" else f"{tag}_{f}"   # COCO and stirrup both use 000000000123.jpg names
                    os.symlink(f"{src}/{split}/{kind}/{f}", f"{data}/{split}/{kind}/{dst}")
                    if tag == "neg" and kind == "images":
                        neg_names.setdefault(split, []).append(dst)
    metas = {tag: json.load(open(f"{src}/dataset.json")) for src, tag in trees}
    meta = {"sha256": hashlib.sha256("".join(m["sha256"] for m in metas.values()).encode()).hexdigest(),
            "tiles": {s: len(os.listdir(f"{data}/{s}/images")) for s in ("train", "val", "test")},
            **{tag: m.get("tiles") for tag, m in metas.items()}, "counts": n,
            "neg_sources": [os.path.basename(js) for js, _ in pairs]}
    json.dump(meta, open(f"{data}/dataset.json", "w"), indent=1)
    json.dump(neg_names, open(f"{data}/neg_names.json", "w"))
    os.symlink(f"{roi_dir}/augment.json", f"{data}/augment.json")
    print("round data:", json.dumps(meta))
    return data


def recall(weights: str, tile_dir: str, build_model, split: str = "test") -> dict:
    """Share of labelled bar pixels the model marks (labels may be incomplete, so no precision/IoU)."""
    import cv2
    import numpy as np
    import torch
    dev = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    m = build_model(None).to(dev).eval()
    m.load_state_dict(torch.load(weights, map_location=dev))
    mean = np.array([0.485, 0.456, 0.406], np.float32); std = np.array([0.229, 0.224, 0.225], np.float32)
    hit = tot = 0
    for n in sorted(os.listdir(f"{tile_dir}/{split}/images")):
        rgb = cv2.cvtColor(cv2.imread(f"{tile_dir}/{split}/images/{n}"), cv2.COLOR_BGR2RGB)
        gt = cv2.imread(f"{tile_dir}/{split}/masks/{n}", cv2.IMREAD_GRAYSCALE) > 127
        x = torch.from_numpy(((rgb / 255.0 - mean) / std).astype(np.float32).transpose(2, 0, 1)[None]).to(dev)
        with torch.no_grad():
            p = (m(x) > 0)[0, 0].cpu().numpy()
        hit += int((p & gt).sum()); tot += int(gt.sum())
    return {"tiles": len(os.listdir(f"{tile_dir}/{split}/images")), "recall": round(hit / max(tot, 1), 4)}


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
