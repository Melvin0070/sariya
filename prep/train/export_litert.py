#!/usr/bin/env python3
"""PyTorch U-Net -> .tflite (litert-torch) -> LiteRT AOT for a list of Qualcomm SoCs.

  python export_litert.py --weights runs/unet_mbv3_1152/unet_mbv3_1152.pt --out export/ \
      --socs SM8850 SM8750 [--fallback-onnx]

Primary path (Linux, Python 3.12, see requirements.txt):
  1. wrap the model: NHWC uint8-range float input [1, 640, 1152, 3] -> ImageNet normalisation in-graph
     -> U-Net -> sigmoid -> NHWC [1, 640, 1152, 1] probability.  The app feeds raw RGB and thresholds 0.5.
  2. litert_torch.convert(model, sample) -> edge.export("unet_mbv3_1152.tflite")       (float32, CPU/GPU/NPU JIT)
  3. ai_edge_litert.aot.aot_compile(tflite, target=[Qualcomm Target(SM8850), ...])      (NPU AOT)
     -> <out>/unet_mbv3_1152_Qualcomm_SM8850.tflite + a fallback .tflite.  Those two files go into the
     app's assets; CompiledModel.create(..., Accelerator.NPU, Accelerator.GPU) picks the right one.

Fallback path (--fallback-onnx; when litert-torch chokes on an op):
  torch.onnx.export (opset 17, static shapes) -> onnxsim -> onnx2tf -i model.onnx -o tf/ -osd -coion
  -> tf/model_float32.tflite (NHWC), then the same AOT step.  onnx2tf needs tensorflow; see requirements.

Verified against: litert-torch README (convert/export API), LiteRT AOT Colab (aot_compile + export),
litert/python/aot/vendors/qualcomm/target.py (SocModel enum includes SM8850).  The AOT step itself is
not runnable on macOS (the Qualcomm SDK wheel is Linux-only): run this on Colab/Kaggle/Linux.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import subprocess
import sys

import numpy as np
import torch
import torch.nn as nn

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from train_unet import build_model, MEAN, STD  # noqa: E402

H, W = 640, 1152


class AppModel(nn.Module):
    """What the phone runs: raw RGB NHWC in, probability NHWC out."""

    def __init__(self, core: nn.Module):
        super().__init__()
        self.core = core
        self.register_buffer("mean", torch.tensor(MEAN * 255.0).view(1, 3, 1, 1))
        self.register_buffer("std", torch.tensor(STD * 255.0).view(1, 3, 1, 1))

    def forward(self, x_nhwc):
        x = x_nhwc.permute(0, 3, 1, 2)
        x = (x - self.mean) / self.std
        y = torch.sigmoid(self.core(x))
        return y.permute(0, 2, 3, 1)


def load(weights: str) -> nn.Module:
    core = build_model(None)
    core.load_state_dict(torch.load(weights, map_location="cpu"))
    return AppModel(core).eval()


def export_tflite(model: nn.Module, out_path: str) -> str:
    sample = (torch.rand(1, H, W, 3) * 255.0,)
    try:
        import litert_torch as lt
    except ImportError:
        import ai_edge_torch as lt       # the pre-rename package has the same convert/export API
    with torch.no_grad():
        edge = lt.convert(model, sample)
    edge.export(out_path)
    # Numerical check against torch on the same input (CPU interpreter).
    try:
        ref = model(*sample).numpy()
        got = edge(*sample)
        got = got.numpy() if hasattr(got, "numpy") else np.asarray(got)
        print(f"tflite vs torch: max |diff| = {np.abs(got - ref).max():.4f}")
    except Exception as e:                # the edge-model call path differs between releases; non-fatal
        print("skipped tflite/torch comparison:", e)
    return out_path


def export_onnx_fallback(model: nn.Module, out_dir: str, name: str) -> str:
    onnx_path = os.path.join(out_dir, name + ".onnx")
    torch.onnx.export(model, (torch.rand(1, H, W, 3) * 255.0,), onnx_path, opset_version=17,
                      input_names=["image"], output_names=["prob"], dynamo=False)
    try:
        import onnxsim, onnx
        m, ok = onnxsim.simplify(onnx.load(onnx_path))
        if ok:
            onnx.save(m, onnx_path)
    except Exception as e:
        print("onnxsim skipped:", e)
    tf_dir = os.path.join(out_dir, "tf")
    subprocess.check_call(["onnx2tf", "-i", onnx_path, "-o", tf_dir, "-osd", "-coion"])
    cands = [f for f in os.listdir(tf_dir) if f.endswith("float32.tflite")]
    if not cands:
        sys.exit("onnx2tf produced no float32 tflite in " + tf_dir)
    src = os.path.join(tf_dir, cands[0]); dst = os.path.join(out_dir, name + ".tflite")
    os.replace(src, dst)
    return dst


def aot_compile(tflite_path: str, out_dir: str, socs: list[str], name: str) -> dict:
    from ai_edge_litert.aot import aot_compile as aot_lib
    from ai_edge_litert.aot.vendors.qualcomm import target as qnn_target
    valid = [m.name for m in qnn_target.SocModel]
    bad = [s for s in socs if s not in valid]
    if bad:
        sys.exit(f"unknown SoC {bad}; valid: {valid}")
    targets = [qnn_target.Target(soc_model=qnn_target.SocModel[s]) for s in socs]
    result = aot_lib.aot_compile(tflite_path, output_dir=out_dir, target=targets)
    report = {}
    for attr in ("compilation_report",):
        if hasattr(result, attr):
            try:
                report["report"] = result.compilation_report()
                print(report["report"])
            except Exception as e:
                report["report_error"] = str(e)
    if hasattr(result, "export"):
        try:
            result.export(out_dir, model_name=name)
        except TypeError:
            result.export(out_dir)
    report["files"] = sorted(f for f in os.listdir(out_dir) if f.endswith(".tflite"))
    return report


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--weights", required=True)
    ap.add_argument("--out", default="export")
    ap.add_argument("--name", default="unet_mbv3_1152")
    ap.add_argument("--socs", nargs="*", default=["SM8850", "SM8750"],
                    help="SM8850 = iQOO 15; replace SM8750 with the team's test phone SoC (adb shell getprop ro.soc.model)")
    ap.add_argument("--fallback-onnx", action="store_true")
    ap.add_argument("--skip-aot", action="store_true", help="stop after the float .tflite (e.g. on macOS)")
    a = ap.parse_args(argv)
    os.makedirs(a.out, exist_ok=True)
    model = load(a.weights)
    log = {"start": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"), "weights": a.weights,
           "input": ["NHWC", 1, H, W, 3, "float32 0..255 RGB"], "output": ["NHWC", 1, H, W, 1, "probability"], "socs": a.socs}
    path = export_onnx_fallback(model, a.out, a.name) if a.fallback_onnx else export_tflite(model, os.path.join(a.out, a.name + ".tflite"))
    log["tflite"] = path
    print("float tflite:", path)
    if not a.skip_aot:
        log["aot"] = aot_compile(path, a.out, a.socs, a.name)
    log["end"] = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    json.dump(log, open(os.path.join(a.out, "export_log.json"), "w"), indent=1)
    print(json.dumps(log, indent=1))


if __name__ == "__main__":
    main()
