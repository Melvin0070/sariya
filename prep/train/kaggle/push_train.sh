#!/usr/bin/env bash
# Train U-Net-lite on a Kaggle T4 as a private script kernel, from this laptop.
#   prep/train/kaggle/push_train.sh [epochs]        then: kaggle kernels status $KERNEL
#   kaggle kernels output $KERNEL -p runs/kaggle    fetches unet_mbv3_1152.pt + train_log.json
# Needs ~/.kaggle/access_token, a phone-verified account (GPU + internet), and the private dataset
# sabarinarayanakg/sariya-roi1555-tiles (prep_data.py output, uploaded with `kaggle datasets create`).
set -euo pipefail
USER_SLUG=sabarinarayanakg
KERNEL=$USER_SLUG/sariya-unet-train
DATASET=$USER_SLUG/sariya-roi1555-tiles
EPOCHS=${1:-50}
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=$(mktemp -d)
GIT=$(git -C "$HERE" rev-parse HEAD)

# Kaggle runs one file: a bootstrap, then train_unet.py verbatim, then main() with Kaggle paths.
{
  cat <<EOF
from __future__ import annotations
import glob, json, os, subprocess, sys
subprocess.check_call([sys.executable, "-m", "pip", "install", "-q",
                       "segmentation-models-pytorch==0.5.0", "albumentations==2.0.8", "timm"])
DATA = os.path.dirname(glob.glob("/kaggle/input/**/dataset.json", recursive=True)[0])
GIT = "$GIT"
EOF
  sed -e '/^from __future__/d' -e '/^if __name__ == "__main__":/,$d' "$HERE/../train_unet.py"
  cat <<EOF

main(["--data", DATA, "--out", "/kaggle/working", "--epochs", "$EPOCHS", "--batch", "8", "--workers", "4"])
p = "/kaggle/working/train_log.json"; log = json.load(open(p)); log["git"] = GIT; json.dump(log, open(p, "w"), indent=1)
os.remove("/kaggle/working/last.pt")      # 80 MB optimiser state; the best weights are unet_mbv3_1152.pt
EOF
} > "$OUT/train.py"

cat > "$OUT/kernel-metadata.json" <<EOF
{"id": "$KERNEL", "title": "sariya-unet-train", "code_file": "train.py", "language": "python",
 "kernel_type": "script", "is_private": "true", "enable_gpu": "true", "enable_internet": "true",
 "machine_shape": "NvidiaTeslaT4", "dataset_sources": ["$DATASET"]}
EOF
python3 -m py_compile "$OUT/train.py"
kaggle kernels push -p "$OUT"
echo "pushed $KERNEL from $OUT (git $GIT)"
