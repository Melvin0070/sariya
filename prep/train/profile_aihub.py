#!/usr/bin/env python3
"""Qualcomm AI Hub: compile (if needed) + profile on "Snapdragon 8 Elite Gen 5 QRD", print per-op compute units.

  pip install qai-hub==0.56.0 && qai-hub configure --api_token <token>     (P1; token in the password manager)
  python profile_aihub.py --model export/unet_mbv3_1152.tflite [--device "Snapdragon 8 Elite Gen 5 QRD"]
  python profile_aihub.py --model runs/unet_mbv3_1152/unet_mbv3_1152.pt --runtime tflite|qnn_dlc|precompiled_qnn_onnx

A .tflite is profiled directly.  A .pt is wrapped (export_litert.AppModel), traced, uploaded, compiled
on the Hub for --runtime, then profiled.  Output: profile_<job>.json with the execution summary,
every layer's compute unit, the job URLs (deck evidence) and a verdict line:
  PASS  all layers on NPU and estimated_inference_time < 25 ms
  WARN  any layer on CPU/GPU (silent fallback: that is the P6 trigger to switch to DeepLabV3+)
Schema per qai_hub 0.56.0 client.py: download_profile() -> {"execution_summary": {...}, "execution_detail": [
  {"name", "type", "compute_unit": "NPU"|"GPU"|"CPU", "execution_time"(us), ...}]}.
"""
from __future__ import annotations

import argparse
import collections
import json
import os
import sys

DEVICE = "Snapdragon 8 Elite Gen 5 QRD"
H, W = 640, 1152


def upload_model(path: str, runtime: str, device, hub):
    if path.endswith(".tflite") or path.endswith(".onnx") or path.endswith(".dlc"):
        return hub.upload_model(path), False
    import torch
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from export_litert import load
    model = load(path)
    traced = torch.jit.trace(model, torch.rand(1, H, W, 3) * 255.0)
    job = hub.submit_compile_job(model=traced, device=device, input_specs={"image": (1, H, W, 3)},
                                 options=f"--target_runtime {runtime}")
    print("compile job:", job.url)
    assert job.wait().success, f"compile failed: {job.url}"
    return job.get_target_model(), job


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--model", required=True)
    ap.add_argument("--device", default=DEVICE)
    ap.add_argument("--runtime", default="tflite", choices=["tflite", "qnn_dlc", "precompiled_qnn_onnx", "onnx"])
    ap.add_argument("--compute-unit", default="npu", help="npu | all; npu forbids fallback so unsupported ops fail loudly")
    ap.add_argument("--budget-ms", type=float, default=25.0)
    ap.add_argument("--out", default="aihub")
    a = ap.parse_args(argv)
    import qai_hub as hub
    os.makedirs(a.out, exist_ok=True)
    devices = hub.get_devices(name=a.device)
    if not devices:
        names = sorted({d.name for d in hub.get_devices() if "Elite" in d.name})
        sys.exit(f"device {a.device!r} not found; Elite devices: {names}")
    device = devices[0]
    model, compile_job = upload_model(a.model, a.runtime, device, hub)
    pjob = hub.submit_profile_job(model=model, device=device, options=f"--compute_unit {a.compute_unit}")
    print("profile job:", pjob.url)
    status = pjob.wait()
    if not status.success:
        sys.exit(f"profile failed ({status}): {pjob.url}")
    prof = pjob.download_profile()
    summ = prof.get("execution_summary", {})
    layers = prof.get("execution_detail", [])
    units = collections.Counter(l.get("compute_unit", "?") for l in layers)
    time_by_unit = collections.defaultdict(int)
    for l in layers:
        time_by_unit[l.get("compute_unit", "?")] += int(l.get("execution_time", 0) or 0)
    off_npu = [l for l in layers if l.get("compute_unit") not in ("NPU", None)]
    est_ms = (summ.get("estimated_inference_time") or 0) / 1000.0
    print(f"\n{a.device}: estimated inference {est_ms:.2f} ms, first load {(summ.get('first_load_time') or 0) / 1000:.0f} ms, "
          f"peak mem {(summ.get('estimated_inference_peak_memory') or 0) / 1e6:.0f} MB")
    print("layers by compute unit:", dict(units), " time (us) by unit:", dict(time_by_unit))
    for l in off_npu:
        print(f"  OFF-NPU  {l.get('compute_unit'):4s} {l.get('type', ''):28s} {l.get('name', '')}  {l.get('execution_time', '')} us")
    verdict = "PASS" if not off_npu and est_ms < a.budget_ms else "WARN"
    print(f"{verdict}: {'all layers on NPU' if not off_npu else f'{len(off_npu)} layers off NPU'}, "
          f"{est_ms:.1f} ms vs budget {a.budget_ms} ms")
    rec = {"model": a.model, "device": a.device, "runtime": a.runtime, "compile_job": getattr(compile_job, "url", None),
           "profile_job": pjob.url, "execution_summary": summ, "units": dict(units), "time_us_by_unit": dict(time_by_unit),
           "off_npu": off_npu, "verdict": verdict, "layers": layers}
    out = os.path.join(a.out, f"profile_{pjob.job_id}.json")
    json.dump(rec, open(out, "w"), indent=1)
    print("saved", out)


if __name__ == "__main__":
    main()
