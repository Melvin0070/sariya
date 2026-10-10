#!/usr/bin/env bash
# Puts the four Qualcomm QAIRT 2.50.0.260828 runtime libraries the NPU path needs into the vision module.
# They are Qualcomm binaries, so they are not committed. Only these files (~22 MB) are read out of the 2.6 GB SDK zip,
# with HTTP range requests, and each one is checked against the hash the app was tested with.
# Usage: scripts/fetch-qnn.sh   (from sariya-expo/; safe to re-run)
set -euo pipefail

cd "$(dirname "$0")/.."
DEST=modules/sariya-vision/android/src/main/jniLibs/arm64-v8a
URL=https://softwarecenter.qualcomm.com/api/download/software/sdks/Qualcomm_AI_Runtime_Community/All/2.50.0.260828/v2.50.0.260828.zip
mkdir -p "$DEST"

python3 -I - "$URL" "$DEST" <<'PY'
import hashlib, os, sys, tempfile, urllib.request, zipfile

url, dest = sys.argv[1], sys.argv[2]
LIB = "qairt/2.50.0.260828/lib/"
WANT = {  # zip entry -> sha256 of the file the app was tested with on the iQOO 15
    LIB + "aarch64-android/libQnnHtp.so": "09e930b6af975bae23bcf6965ac2ce60f6b999aff37cb7eabe9b4d7c1bc3f264",
    LIB + "aarch64-android/libQnnHtpV81Stub.so": "5b0ea1ef9929bdfcdda0d8dfc6ddffdc913fa2be02cf01a1574d644b2e0e0d38",
    LIB + "aarch64-android/libQnnSystem.so": "b30bd9880dc48f6c5349185a7d45b326f8a064b10072e60094354fa23d9a2027",
    LIB + "hexagon-v81/unsigned/libQnnHtpV81Skel.so": "9b7266e38aea818a1caeba5cbfebd9a8cbdba8f25dd82126d9b44ebf4fec4fa0",
}

def sha(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()

todo = {k: v for k, v in WANT.items() if not (os.path.exists(os.path.join(dest, os.path.basename(k))) and sha(os.path.join(dest, os.path.basename(k))) == v)}
if not todo:
    print("All 4 QNN libraries already present and verified.")
    sys.exit(0)

def get(start, end):
    req = urllib.request.Request(url, headers={"Range": f"bytes={start}-{end}"})
    with urllib.request.urlopen(req, timeout=60) as r:
        if r.status != 206:
            sys.exit(f"Server ignored the range request (HTTP {r.status}); download the SDK zip by hand.")
        return r.read(), r.headers["Content-Range"]

size = int(get(0, 0)[1].split("/")[1])

class Remote:  # a seekable file over HTTP ranges, read in 4 MB blocks so zipfile's small reads stay cheap
    BLOCK = 4 << 20
    def __init__(self): self.pos, self.start, self.buf = 0, -1, b""
    def seekable(self): return True
    def tell(self): return self.pos
    def seek(self, off, whence=0):
        self.pos = off if whence == 0 else self.pos + off if whence == 1 else size + off
        return self.pos
    def read(self, n=-1):
        if n < 0: n = size - self.pos
        n = min(n, size - self.pos)
        if n <= 0: return b""
        if not (self.start <= self.pos and self.pos + n <= self.start + len(self.buf)):
            self.start = self.pos
            self.buf = get(self.pos, min(size, self.pos + max(n, self.BLOCK)) - 1)[0]
        out = self.buf[self.pos - self.start:self.pos - self.start + n]
        self.pos += len(out)
        return out

z = zipfile.ZipFile(Remote())
for name, want in todo.items():
    target = os.path.join(dest, os.path.basename(name))
    print(f"Fetching {os.path.basename(name)} ({z.getinfo(name).file_size / 1e6:.1f} MB)…", flush=True)
    fd, tmp = tempfile.mkstemp(dir=dest)
    with os.fdopen(fd, "wb") as out, z.open(name) as src:
        while chunk := src.read(1 << 20):
            out.write(chunk)
    got = sha(tmp)
    if got != want:
        os.remove(tmp)
        sys.exit(f"Hash mismatch for {name}: got {got}, expected {want}. Nothing installed for this file.")
    os.chmod(tmp, 0o644)
    os.replace(tmp, target)
print("Done: QNN libraries verified in", dest)
PY
