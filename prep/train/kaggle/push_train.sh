#!/usr/bin/env bash
# Train U-Net-lite on a Kaggle T4 as a private script kernel, from this laptop.
#   prep/train/kaggle/push_train.sh [epochs]        then: kaggle kernels status $KERNEL
#   kaggle kernels output $KERNEL -p runs/kaggle    fetches unet_mbv3_1152.pt + train_log.json
# Needs ~/.kaggle/access_token and two private datasets (`kaggle datasets create -p DIR --dir-mode zip`):
#   sariya-roi1555-tiles  prep_data.py output
#   sariya-train-deps     wheels/ (smp 0.5.0, albumentations 2.0.8, albucore, simsimd, stringzilla, timm; cp313
#                         manylinux) + weights/mobilenetv3_large_100.ra_in1k.safetensors. The kernel runs offline:
#                         Kaggle gave no DNS even with enable_internet (account not yet phone-verified, 9 Oct).
set -euo pipefail
USER_SLUG=sabarinarayanakg
KERNEL=$USER_SLUG/sariya-unet-train
DATASET=$USER_SLUG/sariya-roi1555-tiles
DEPS=$USER_SLUG/sariya-train-deps
EPOCHS=${1:-50}
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=$(mktemp -d)
GIT=$(git -C "$HERE" rev-parse HEAD)

# Kaggle runs one file: a bootstrap, then train_unet.py verbatim, then main() with Kaggle paths.
{
  cat <<EOF
from __future__ import annotations
import glob, json, os, subprocess, sys
WHEELS = os.path.dirname(glob.glob("/kaggle/input/**/segmentation_models_pytorch-*.whl", recursive=True)[0])
WEIGHTS = glob.glob("/kaggle/input/**/mobilenetv3_large_100.ra_in1k.safetensors", recursive=True)[0]
subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "--no-index", "--no-deps",
                       *glob.glob(WHEELS + "/*.whl")])
DATA = os.path.dirname(glob.glob("/kaggle/input/**/dataset.json", recursive=True)[0])
GIT = "$GIT"
EOF
  sed -e '/^from __future__/d' -e '/^if __name__ == "__main__":/,$d' "$HERE/../train_unet.py"
  cat <<EOF


def build_model(weights="imagenet"):       # offline: ImageNet encoder weights from the deps dataset
    import segmentation_models_pytorch as smp, safetensors.torch as st
    m = smp.Unet(encoder_name=ENCODER, encoder_weights=None, in_channels=3, classes=1)
    if weights:
        r = m.encoder.model.load_state_dict(st.load_file(WEIGHTS), strict=False)
        assert not r.missing_keys, r.missing_keys
    return m


main(["--data", DATA, "--out", "/kaggle/working", "--epochs", "$EPOCHS", "--batch", "8", "--workers", "4"])
p = "/kaggle/working/train_log.json"; log = json.load(open(p)); log["git"] = GIT; json.dump(log, open(p, "w"), indent=1)
os.remove("/kaggle/working/last.pt")      # 80 MB optimiser state; the best weights are unet_mbv3_1152.pt
EOF
} > "$OUT/train.py"

cat > "$OUT/kernel-metadata.json" <<EOF
{"id": "$KERNEL", "title": "sariya-unet-train", "code_file": "train.py", "language": "python",
 "kernel_type": "script", "is_private": "true", "enable_gpu": "true", "enable_internet": "false",
 "machine_shape": "NvidiaTeslaT4", "dataset_sources": ["$DATASET", "$DEPS"]}
EOF
python3 -m py_compile "$OUT/train.py"
kaggle kernels push -p "$OUT"
echo "pushed $KERNEL from $OUT (git $GIT)"
