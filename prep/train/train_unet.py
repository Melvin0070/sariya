#!/usr/bin/env python3
"""U-Net-lite (segmentation_models_pytorch U-Net, MobileNetV3-Large-100 encoder, ImageNet init) on the
prep_data.py tiles.  Dice + BCE, AMP, AdamW.  Every run is logged to train_log.json with start/end
timestamps, git hash and dataset sha256 (the organisers' fine-tune audit trail).

  python train_unet.py --data data/ --out runs/unet_mbv3_1152 --epochs 50 --batch 8 [--resume ckpt.pt]

Model contract (the export and the Kotlin side rely on it):
  input  float32 NCHW [1, 3, 640, 1152], RGB, ImageNet mean/std normalised (export_litert.py folds the
         normalisation into the graph and switches to NHWC so the app feeds raw 0..255 RGB)
  output float32 [1, 1, 640, 1152] logits; bar = sigmoid > 0.5   ("2 classes" = bar / background, one logit)
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import subprocess
import sys
import time

import cv2
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

ENCODER = "tu-mobilenetv3_large_100"      # smp 0.5 maps the old "timm-mobilenetv3_large_100" name to this
MEAN = np.array([0.485, 0.456, 0.406], np.float32)
STD = np.array([0.229, 0.224, 0.225], np.float32)


def git_hash() -> str:
    try:
        return subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=os.path.dirname(os.path.abspath(__file__)),
                                       stderr=subprocess.DEVNULL, text=True).strip()
    except Exception:
        return "no-git"


def now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")


# ----------------------------------------------------------------------------- augmentation
class SpecularHighlights:
    """Torch-lit steel: a few soft bright blobs on the image only (mask untouched)."""

    def __init__(self, n=(1, 6), radius=(6, 40), strength=(0.3, 0.9), p=0.5):
        self.n, self.r, self.s, self.p = n, radius, strength, p

    def __call__(self, image, **kw):
        if np.random.rand() > self.p:
            return image
        h, w = image.shape[:2]
        layer = np.zeros((h, w), np.float32)
        for _ in range(np.random.randint(self.n[0], self.n[1] + 1)):
            r = np.random.randint(self.r[0], self.r[1] + 1)
            cx, cy = np.random.randint(0, w), np.random.randint(0, h)
            blob = np.zeros((h, w), np.float32)
            cv2.circle(blob, (cx, cy), r, 1.0, -1)
            layer = np.maximum(layer, cv2.GaussianBlur(blob, (0, 0), r / 2) * np.random.uniform(*self.s))
        out = image.astype(np.float32) + layer[:, :, None] * 255.0
        return np.clip(out, 0, 255).astype(np.uint8)


def build_augment(cfg: dict, train: bool):
    import albumentations as A
    if not train:
        return A.Compose([])
    return A.Compose([
        A.RandomScale(scale_limit=tuple(cfg["random_scale"]["scale_limit"]), p=cfg["random_scale"]["p"]),
        A.Rotate(limit=cfg["rotate"]["limit"], border_mode=cv2.BORDER_REFLECT_101, p=cfg["rotate"]["p"]),
        A.Perspective(scale=tuple(cfg["perspective"]["scale"]), p=cfg["perspective"]["p"]),
        A.PadIfNeeded(cfg["input"][0], cfg["input"][1], border_mode=cv2.BORDER_REFLECT_101),
        A.RandomCrop(cfg["input"][0], cfg["input"][1]),
        A.MotionBlur(blur_limit=tuple(cfg["motion_blur"]["blur_limit"]), p=cfg["motion_blur"]["p"]),
        A.RandomBrightnessContrast(cfg["brightness_contrast"]["brightness_limit"], cfg["brightness_contrast"]["contrast_limit"],
                                   p=cfg["brightness_contrast"]["p"]),
        A.RGBShift(cfg["colour_temperature"]["r_shift"], cfg["colour_temperature"]["g_shift"], cfg["colour_temperature"]["b_shift"],
                   p=cfg["colour_temperature"]["p"]),
        A.Lambda(image=SpecularHighlights(tuple(cfg["specular_highlights"]["n"]), tuple(cfg["specular_highlights"]["radius_px"]),
                                          tuple(cfg["specular_highlights"]["strength"]), cfg["specular_highlights"]["p"]), name="specular"),
        A.RandomShadow(p=cfg["shadow"]["p"]),
        A.ImageCompression(quality_range=tuple(cfg["jpeg"]["quality"]), p=cfg["jpeg"]["p"]),
        A.HorizontalFlip(p=cfg["hflip"]["p"]),
        A.VerticalFlip(p=cfg["vflip"]["p"]),
    ])


class Tiles(Dataset):
    def __init__(self, root: str, split: str, aug):
        self.img_dir, self.mask_dir = os.path.join(root, split, "images"), os.path.join(root, split, "masks")
        self.names = sorted(os.listdir(self.img_dir))
        self.aug = aug

    def __len__(self):
        return len(self.names)

    def __getitem__(self, i):
        n = self.names[i]
        img = cv2.cvtColor(cv2.imread(os.path.join(self.img_dir, n), cv2.IMREAD_COLOR), cv2.COLOR_BGR2RGB)
        m = (cv2.imread(os.path.join(self.mask_dir, n), cv2.IMREAD_GRAYSCALE) > 127).astype(np.uint8)
        r = self.aug(image=img, mask=m)
        img, m = r["image"], r["mask"]
        x = ((img.astype(np.float32) / 255.0 - MEAN) / STD).transpose(2, 0, 1)
        return torch.from_numpy(np.ascontiguousarray(x)), torch.from_numpy(m[None].astype(np.float32))


# ----------------------------------------------------------------------------- model / loss
def build_model(weights: str | None = "imagenet"):
    import segmentation_models_pytorch as smp
    return smp.Unet(encoder_name=ENCODER, encoder_weights=weights, in_channels=3, classes=1)


class DiceBCE(nn.Module):
    def __init__(self):
        super().__init__()
        import segmentation_models_pytorch as smp
        self.dice = smp.losses.DiceLoss(mode="binary", from_logits=True)
        self.bce = nn.BCEWithLogitsLoss()

    def forward(self, logits, target):
        return self.dice(logits, target) + self.bce(logits, target)


@torch.no_grad()
def evaluate(model, loader, device):
    model.eval()
    inter = union = tp = fp = fn = 0.0
    for x, y in loader:
        x, y = x.to(device, non_blocking=True), y.to(device, non_blocking=True)
        with torch.autocast(device_type=device.type, enabled=device.type == "cuda"):
            p = (model(x) > 0).float()
        inter += (p * y).sum().item(); union += ((p + y) > 0).float().sum().item()
        tp += (p * y).sum().item(); fp += (p * (1 - y)).sum().item(); fn += ((1 - p) * y).sum().item()
    iou = inter / max(union, 1); f1 = 2 * tp / max(2 * tp + fp + fn, 1)
    return {"iou": round(iou, 4), "f1": round(f1, 4)}


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--data", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--epochs", type=int, default=50)
    ap.add_argument("--batch", type=int, default=8)
    ap.add_argument("--lr", type=float, default=3e-4)
    ap.add_argument("--workers", type=int, default=4)
    ap.add_argument("--resume", default=None)
    ap.add_argument("--no-pretrained", action="store_true", help="ImageNet init off (if the organisers disallow public weights)")
    ap.add_argument("--init", default=None, help="start from these U-Net weights (a previous round's unet_mbv3_1152.pt)")
    ap.add_argument("--seed", type=int, default=0)
    a = ap.parse_args(argv)
    os.makedirs(a.out, exist_ok=True)
    torch.manual_seed(a.seed); np.random.seed(a.seed)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    ds_meta = json.load(open(os.path.join(a.data, "dataset.json")))
    aug_cfg = json.load(open(os.path.join(a.data, "augment.json")))
    log = {"start": now(), "end": None, "git": git_hash(), "dataset_sha256": ds_meta["sha256"], "dataset": ds_meta.get("tiles"),
           "args": vars(a), "encoder": ENCODER, "pretrained": "imagenet" if not a.no_pretrained else "none",
           "device": str(device), "torch": torch.__version__, "python": sys.version.split()[0], "epochs": []}
    log_path = os.path.join(a.out, "train_log.json")
    json.dump(log, open(log_path, "w"), indent=1)          # written at start so an aborted run is still on record

    train = DataLoader(Tiles(a.data, "train", build_augment(aug_cfg, True)), a.batch, shuffle=True, num_workers=a.workers,
                       pin_memory=True, drop_last=True)
    val = DataLoader(Tiles(a.data, "val", build_augment(aug_cfg, False)), a.batch, num_workers=a.workers, pin_memory=True)
    model = build_model(None if (a.no_pretrained or a.init) else "imagenet").to(device)
    if a.init:
        model.load_state_dict(torch.load(a.init, map_location=device))
        log["init"] = a.init
    opt = torch.optim.AdamW(model.parameters(), lr=a.lr, weight_decay=1e-4)
    sched = torch.optim.lr_scheduler.OneCycleLR(opt, max_lr=a.lr, total_steps=a.epochs * max(len(train), 1), pct_start=0.1)
    scaler = torch.amp.GradScaler(enabled=device.type == "cuda")
    loss_fn = DiceBCE()
    start_ep, best = 0, -1.0
    if a.resume:
        ck = torch.load(a.resume, map_location=device)
        model.load_state_dict(ck["model"]); opt.load_state_dict(ck["opt"]); start_ep = ck["epoch"] + 1; best = ck.get("best", -1.0)

    for ep in range(start_ep, a.epochs):
        model.train(); t0 = time.time(); tot = 0.0
        for x, y in train:
            x, y = x.to(device, non_blocking=True), y.to(device, non_blocking=True)
            with torch.autocast(device_type=device.type, enabled=device.type == "cuda"):
                loss = loss_fn(model(x), y)
            opt.zero_grad(set_to_none=True)
            scaler.scale(loss).backward(); scaler.step(opt); scaler.update(); sched.step()
            tot += loss.item()
        m = evaluate(model, val, device) if len(val) else {"iou": None, "f1": None}
        rec = {"epoch": ep, "loss": round(tot / max(len(train), 1), 4), **m, "sec": round(time.time() - t0, 1), "time": now()}
        log["epochs"].append(rec); print(rec)
        torch.save({"model": model.state_dict(), "opt": opt.state_dict(), "epoch": ep, "best": best}, os.path.join(a.out, "last.pt"))
        if m["iou"] is not None and m["iou"] > best:
            best = m["iou"]
            torch.save(model.state_dict(), os.path.join(a.out, "unet_mbv3_1152.pt"))
            log["best"] = {"epoch": ep, **m}
        json.dump(log, open(log_path, "w"), indent=1)
    log["end"] = now()
    if len(val):
        log["test"] = evaluate(model, DataLoader(Tiles(a.data, "test", build_augment(aug_cfg, False)), a.batch), device) \
            if os.listdir(os.path.join(a.data, "test", "images")) else None
    json.dump(log, open(log_path, "w"), indent=1)
    print("done:", log_path)


if __name__ == "__main__":
    main()
