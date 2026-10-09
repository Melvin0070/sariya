#!/usr/bin/env bash
# Benchmark a .tflite on the connected Android phone: CPU, GPU, and NPU (Qualcomm HTP, JIT) in burst mode.
#   prep/train/bench_device.sh models/seg/v1/unet_mbv3_1152.tflite
# Needs adb, the LiteRT CLI (uv pip install litert-cli-nightly; it fetches benchmark_model and the LiteRT
# Qualcomm dispatch/compiler-plugin libs) and QAIRT 2.50.0.260828 unpacked at $QAIRT. The CLI pins QAIRT 2.47,
# whose libQnnSystem (1.11) the current plugin rejects ("minimum supported version is 1.14"), so the NPU
# run pushes the 2.50 libs and calls benchmark_model directly.
set -euo pipefail
MODEL=$1
LITERT=${LITERT:-~/sariya-tools/litert-cli/.venv/bin/litert}
QAIRT=${QAIRT:-~/sariya-tools/qairt250/qairt/2.50.0.260828}
D=/data/local/tmp/litert-cli
export SSL_CERT_FILE=${SSL_CERT_FILE:-$("$(dirname "$LITERT")"/python -c "import certifi; print(certifi.where())")}

"$LITERT" benchmark "$MODEL" --android --cpu --num-runs 30 | grep -E 'Inference \(avg|Peak'
"$LITERT" benchmark "$MODEL" --android --gpu --num-runs 50 | grep -E 'Replacing|Inference \(avg|Peak'
"$LITERT" benchmark "$MODEL" --android --npu --jit --num-runs 1 >/dev/null 2>&1 || true   # pushes the dispatch + plugin libs
for f in libQnnSystem.so libQnnHtp.so libQnnHtpV81Stub.so libQnnHtpPrepare.so libQnnIr.so libQnnSaver.so; do
  adb push -q "$QAIRT/lib/aarch64-android/$f" $D/
done
adb push -q "$QAIRT/lib/hexagon-v81/unsigned/libQnnHtpV81Skel.so" $D/
adb push -q "$MODEL" $D/model.tflite
adb shell "cd $D && mkdir -p jitcache && LD_LIBRARY_PATH=. ADSP_LIBRARY_PATH=. ./benchmark_model --graph=model.tflite \
  --use_npu=true --dispatch_library_path=. --compiler_plugin_library_path=. --compiler_cache_path=$D/jitcache \
  --qualcomm_htp_performance_mode=burst --num_runs=200 2>&1" | grep -E 'Partitioned|initialization|Inference \(avg|Inference \(max'
