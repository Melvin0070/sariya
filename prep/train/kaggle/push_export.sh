#!/usr/bin/env bash
# Export the trained U-Net to .tflite (+ LiteRT AOT for SM8850) on a Kaggle CPU kernel (the Qualcomm SDK is Linux-only).
#   prep/train/kaggle/push_export.sh            then: kaggle kernels output $KERNEL -p export/
# Input: the latest output of sabarinarayanakg/${SRC_KERNEL:-sariya-unet-train} (unet_mbv3_1152.pt). Needs internet (phone-verified).
set -euo pipefail
USER_SLUG=sabarinarayanakg
KERNEL=$USER_SLUG/sariya-unet-export
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=$(mktemp -d)
GIT=$(git -C "$HERE" rev-parse HEAD)

# One file: pip bootstrap, train_unet.py (for build_model), export_litert.py minus its train_unet import, then main().
{
  cat <<EOF
from __future__ import annotations
import glob, os, subprocess, sys
subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "segmentation-models-pytorch==0.5.0", "timm",
                       "litert-torch==0.9.4", "ai-edge-litert==2.2.0", "ai-edge-litert-sdk-qualcomm==2.2.0"])
WEIGHTS = glob.glob("/kaggle/input/**/unet_mbv3_1152.pt", recursive=True)[0]
GIT = "$GIT"
EOF
  sed -e '/^from __future__/d' -e '/^if __name__ == "__main__":/,$d' "$HERE/../train_unet.py"
  sed -e '/^from __future__/d' -e '/^sys.path.insert/d' -e '/^from train_unet import/d' \
      -e '/^if __name__ == "__main__":/,$d' "$HERE/../export_litert.py"
  cat <<'EOF'

import json
try:
    main(["--weights", WEIGHTS, "--out", "/kaggle/working", "--socs", "SM8850"])
except SystemExit as e:
    if e.code not in (0, None):
        raise
except Exception as e:                       # AOT failure must not lose the float .tflite
    print("AOT/export error:", repr(e))
for f in glob.glob("/tmp/*.error"):          # the AOT compiler's reason, otherwise lost with /tmp
    print("==", f); print(open(f, errors="replace").read()[-6000:])
    os.system(f"cp {f} /kaggle/working/aot_{os.path.basename(f)}.txt")
p = "/kaggle/working/export_log.json"
log = json.load(open(p)) if os.path.exists(p) else {}
log["git"] = GIT; log["files"] = sorted(os.listdir("/kaggle/working"))
json.dump(log, open(p, "w"), indent=1); print(json.dumps(log, indent=1))
EOF
} > "$OUT/export.py"

cat > "$OUT/kernel-metadata.json" <<EOF
{"id": "$KERNEL", "title": "sariya-unet-export", "code_file": "export.py", "language": "python",
 "kernel_type": "script", "is_private": "true", "enable_gpu": "false", "enable_internet": "true",
 "kernel_sources": ["$USER_SLUG/${SRC_KERNEL:-sariya-unet-train}"]}
EOF
python3 -m py_compile "$OUT/export.py"
kaggle kernels push -p "$OUT"
echo "pushed $KERNEL from $OUT (git $GIT)"
