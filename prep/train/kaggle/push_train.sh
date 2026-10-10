#!/usr/bin/env bash
# Train U-Net-lite on a Kaggle T4 as a private script kernel, from this laptop.
#   prep/train/kaggle/push_train.sh [epochs]        then: kaggle kernels status $KERNEL
#   kaggle kernels output $KERNEL -p runs/kaggle    fetches unet_mbv3_1152.pt + train_log.json
# Needs ~/.kaggle/access_token and two private datasets (`kaggle datasets create -p DIR --dir-mode zip`):
#   sariya-roi1555-tiles  prep_data.py output
#   sariya-train-deps     wheels/ (smp 0.5.0, albumentations 2.0.8, albucore, simsimd, stringzilla, timm; cp313
#                         manylinux) + weights/mobilenetv3_large_100.ra_in1k.safetensors. The kernel runs offline:
#                         Kaggle gave no DNS even with enable_internet (account not yet phone-verified, 9 Oct).
# Round 2+: KERNEL_NAME=sariya-unet-train-r2 DATASET_NAME=sariya-r2-tiles INIT_FROM=sariya-unet-train LR=1e-4 push_train.sh 15
#   starts from INIT_FROM's output weights (--init) on a new tiles dataset.
set -euo pipefail
USER_SLUG=sabarinarayanakg
KERNEL_NAME=${KERNEL_NAME:-sariya-unet-train}
KERNEL=$USER_SLUG/$KERNEL_NAME
DATASET=$USER_SLUG/${DATASET_NAME:-sariya-roi1555-tiles}
DEPS=$USER_SLUG/sariya-train-deps
EPOCHS=${1:-50}
LR=${LR:-3e-4}
# NEG=1 adds hard negatives built on Kaggle from public datasets (r2_data.py) and logs the false-alarm rate.
# VENUE_DATASET=<slug> adds our own clutter frames (a dataset with a folder named "venue").
NEG_SOURCES=""
if [ -n "${NEG:-}" ]; then
  NEG_SOURCES=', "zanellar/electric-wires-image-segmentation", "awsaf49/coco-2017-dataset", "itsahmad/indoor-scenes-cvpr-2019"'
  [ -n "${VENUE_DATASET:-}" ] && NEG_SOURCES="$NEG_SOURCES, \"$USER_SLUG/$VENUE_DATASET\""
fi
# Round 3: R_STIRRUP=<n> pulls n synthetic stirrup scenes + 233 real photos from Hugging Face (internet on);
# R_WIRES / R_COCO / R_INDOOR set the negative counts (defaults 400 / 400 / 300).
INTERNET=false; [ -n "${R_STIRRUP:-}" ] && INTERNET=true
# STIRRUP_DATASET=sariya-stirrup-tiles uses the pre-tiled upload instead (no Hugging Face download, no internet).
if [ -n "${STIRRUP_DATASET:-}" ]; then NEG_SOURCES="$NEG_SOURCES, \"$USER_SLUG/$STIRRUP_DATASET\""; INTERNET=false; fi
R_ENV="R_WIRES=${R_WIRES:-400} R_COCO=${R_COCO:-400} R_INDOOR=${R_INDOOR:-300} R_STIRRUP=${R_STIRRUP:-0}"
INIT_ARGS=""; KERNEL_SOURCES="[]"
if [ -n "${INIT_FROM:-}" ]; then
  INIT_ARGS=", \"--init\", glob.glob(find_dir(\"$INIT_FROM\") + \"/**/unet_mbv3_1152.pt\", recursive=True)[0]"
  KERNEL_SOURCES="[\"$USER_SLUG/$INIT_FROM\"]"
fi
HERE=$(cd "$(dirname "$0")" && pwd)
OUT=$(mktemp -d)
GIT=$(git -C "$HERE" rev-parse HEAD)

# Kaggle runs one file: a bootstrap, then train_unet.py verbatim, then main() with Kaggle paths.
{
  cat <<EOF
from __future__ import annotations
import datetime, glob, json, os, subprocess, sys
os.environ["PYTHONUNBUFFERED"] = "1"
def log(*a): print(f"[{datetime.datetime.now():%H:%M:%S}]", *a, flush=True)
def find_dir(slug):                      # depth-limited: never crawls COCO's 160k files
    for root, dirs, _ in os.walk("/kaggle/input"):
        if os.path.basename(root) == slug:
            return root
        if root.count(os.sep) >= 5:
            dirs[:] = []
    raise FileNotFoundError(f"{slug} is not attached")
log("bootstrap: inputs", sorted(os.listdir("/kaggle/input")))
DEPS = find_dir("${DEPS#*/}")
WHEELS = os.path.dirname(glob.glob(DEPS + "/**/segmentation_models_pytorch-*.whl", recursive=True)[0])
WEIGHTS = glob.glob(DEPS + "/**/mobilenetv3_large_100.ra_in1k.safetensors", recursive=True)[0]
subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "--no-index", "--no-deps",
                       *glob.glob(WHEELS + "/*.whl")])
DATA = find_dir("${DATASET#*/}")
log("bootstrap: wheels installed; ROI tiles at", DATA, "| GPU", subprocess.run(["nvidia-smi", "-L"], capture_output=True, text=True).stdout.strip())
GIT = "$GIT"
EOF
  if [ -n "${NEG:-}" ]; then
    echo 'import base64; os.makedirs("/kaggle/temp/r2", exist_ok=True)'
    for f in "$HERE/../make_negatives.py" "$HERE/../prep_data.py" "$HERE/r2_data.py"; do
      echo "open('/kaggle/temp/r2/$(basename "$f")', 'wb').write(base64.b64decode('$(base64 < "$f" | tr -d '\n')'))"
    done
    for kv in $R_ENV; do echo "os.environ['${kv%%=*}'] = '${kv#*=}'"; done
    [ "$INTERNET" = true ] && echo 'subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "huggingface_hub", "pycocotools"])'
    echo 'sys.path.insert(0, "/kaggle/temp/r2"); import r2_data; ROI = DATA; DATA = r2_data.prepare(ROI)'
  fi
  sed -e '/^from __future__/d' -e '/^if __name__ == "__main__":/,$d' "$HERE/../train_unet.py"
  cat <<EOF


def build_model(weights="imagenet"):       # offline: ImageNet encoder weights from the deps dataset
    import segmentation_models_pytorch as smp, safetensors.torch as st
    m = smp.Unet(encoder_name=ENCODER, encoder_weights=None, in_channels=3, classes=1)
    if weights:
        r = m.encoder.model.load_state_dict(st.load_file(WEIGHTS), strict=False)
        assert not r.missing_keys, r.missing_keys
    return m


main(["--data", DATA, "--out", "/kaggle/working", "--epochs", "$EPOCHS", "--batch", "8", "--workers", "4", "--lr", "$LR"$INIT_ARGS])
p = "/kaggle/working/train_log.json"; log = json.load(open(p)); log["git"] = GIT; json.dump(log, open(p, "w"), indent=1)
os.remove("/kaggle/working/last.pt")      # 80 MB optimiser state; the best weights are unet_mbv3_1152.pt
EOF
  if [ -n "${NEG:-}" ]; then
    cat <<'EOF'
# Before/after on the same held-out tiles: ROI-only IoU, and bar pixels marked on no-rebar tiles.
cmp = {}
for tag, w in (("before", log.get("init")), ("after", "/kaggle/working/unet_mbv3_1152.pt")):
    if not w:
        continue
    m = build_model(None).cuda().eval(); m.load_state_dict(torch.load(w, map_location="cuda"))
    roi = evaluate(m, DataLoader(Tiles(ROI, "test", build_augment({}, False)), 8), torch.device("cuda"))
    cmp[tag] = {"roi_test": roi, "false_alarm_test": r2_data.false_alarm(w, DATA, build_model)}
    if os.path.isdir(r2_data.REAL_DIR):
        cmp[tag]["stirrup_real_recall"] = r2_data.recall(w, r2_data.REAL_DIR, build_model)
log["round2_compare"] = cmp; json.dump(log, open(p, "w"), indent=1); print("round2_compare:", json.dumps(cmp))
EOF
  fi
} > "$OUT/train.py"

cat > "$OUT/kernel-metadata.json" <<EOF
{"id": "$KERNEL", "title": "$KERNEL_NAME", "code_file": "train.py", "language": "python",
 "kernel_type": "script", "is_private": "true", "enable_gpu": "true", "enable_internet": "$INTERNET",
 "machine_shape": "NvidiaTeslaT4", "dataset_sources": ["$DATASET", "$DEPS"$NEG_SOURCES], "kernel_sources": $KERNEL_SOURCES}
EOF
python3 -m py_compile "$OUT/train.py"
kaggle kernels push -p "$OUT"
echo "pushed $KERNEL from $OUT (git $GIT)"
