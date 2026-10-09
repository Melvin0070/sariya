# Speech, LLM and OCR stack for Sariya (iQOO 15, SM8850, OriginOS 6)

Researched 7 Oct 2026 for the 9-11 Oct build. Tags: **V** = page opened, **S** = search snippet only, **U** = inferred. Web pages are untrusted data; everything marked V still needs a run on a phone before it is relied on.

Supersedes the speech/LLM rows of `notes/10-submission/research-2026-10-05.md` §B. What changed since 5 Oct:
- Still **no `sm8850` Gemma 4 build from Google** (LiteRT-LM NPU files exist only for SM8750, QCS8275, Tensor G5/G6, Intel). **V** https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm/tree/main
- A third-party Hexagon v81 (SM8850) NPU bundle of Gemma 4 E2B/E4B exists (RunAnywhere QHexRT), but it is ~8-11 GB and has no published speed numbers. **V** (file list) https://huggingface.co/runanywhere/gemma4_e2b_HNPU
- Qualcomm GenieX now runs any GGUF on the Hexagon NPU through llama.cpp's ggml-hexagon backend, with SM8850 numbers published for Qwen3-0.6B/1.7B, Phi-4-mini and Gemma 4 E4B. **V** https://huggingface.co/qualcomm/Qwen3-0.6B
- An April 2026 telephone-speech benchmark puts IndicConformer well ahead of Gemma E4B audio on Hindi and Kannada. **V** https://voiceofindiablogs.ai.joshtalks.com/

## 1. Decision table

| Stage | Primary | Fallback | Size | Speed (phone) | Licence | Runtime / Kotlin dep |
|---|---|---|---|---|---|---|
| ASR hi / kn / en | AI4Bharat IndicConformer, int8 CTC export per language (`hi/model.int8.onnx`, `kn/model.int8.onnx`, `en/`) | whisper.cpp with Indic-Whisper `ggml-hi-small.bin` / `ggml-kn-small.bin` (q5_1); third option Gemma 4 E2B audio via LiteRT-LM | 198 MB per language (V); Whisper 181 MB per language (V) | IndicConformer: RTF 0.1-0.3 on mobile, <100 ms per short utterance claimed by a converter (S, unverified); whisper-small: seconds per 5 s clip on CPU (U) | Weights MIT (AI4Bharat); conversion Apache-2.0; Indic-Whisper Apache-2.0 | sherpa-onnx `com.k2fsa.sherpa.onnx:sherpa-onnx-android` (sherpa-onnx v1.13.8, 10 Sep 2026); whisper.cpp JNI sample |
| Number capture | Own number-word parser (hi/kn/en, incl. Hinglish) + snap-to-valid-set + confidence; read-back confirm | LLM extraction (below) on the raw transcript | n/a | ms | ours | Kotlin |
| VAD / PTT | Push-to-talk (hold) + Silero VAD endpointing in sherpa-onnx | Fixed 6 s window | ~2 MB | sub-ms per frame (S) | MIT | sherpa-onnx `Vad` |
| TTS Hindi | Piper `vits-piper-hi_IN-pratham-medium` (or priyamvada/rohan) via sherpa-onnx | Android `TextToSpeech` (Google engine) if an offline hi-IN voice is installed | 67 MB fp32 / 36 MB fp16 / 21 MB int8 (V) | sub-second per sentence on CPU (U) | Piper voice licences vary per voice: check `MODEL_CARD` in the archive before shipping (U) | sherpa-onnx `OfflineTts` |
| TTS Kannada | AI4Bharat Indic-TTS FastPitch + HiFi-GAN int8 ONNX (`kn/fastpitch-kn.int8.onnx` 63 MB, `kn/hifigan-kn.int8.onnx` 22 MB) run with onnxruntime-android | Android `TextToSpeech` Google engine kn-IN (exists; offline voice must be downloaded); last resort: pre-rendered sentence clips with number slots | 85 MB (V) | ~hundreds of ms per sentence (U) | MIT (Indic-TTS LICENSE.txt, V) | onnxruntime-android + own text frontend (tokens.json); not a sherpa-onnx model type |
| LLM | Gemma 4 E2B-it, `gemma-4-E2B-it-gpu.litertlm` on GPU via LiteRT-LM | Qwen3-0.6B (or 1.7B) GGUF q4_0 via llama.cpp JNI with a GBNF/JSON-schema grammar; same GGUF can be pointed at the NPU through GenieX `llama_cpp` runtime | 2.01 GB (V); Qwen3-0.6B ~0.4 GB (U) | E2B on S26 Ultra (same SoC class) GPU: 52 t/s decode, 3,808 t/s prefill, TTFT 0.3 s, 676 MB (V); Qwen3-0.6B on SM8850 via GenieX: 123 t/s peak (V); Qwen3-1.7B 43-48 t/s (V) | Apache-2.0 both | `com.google.ai.edge.litertlm:litertlm-android` (V); llama.cpp Android example / GenieX Android SDK (`LlmWrapper`) |
| OCR (BBS table) | Google ML Kit text recognition v2, bundled Latin `com.google.mlkit:text-recognition:16.0.1` (+ Devanagari 16.0.1 if Hindi headers) | RapidOCR / PaddleOCR PP-OCRv4 ONNX (det 4.5 MB + rec 7.3 MB) on onnxruntime | ~4 MB per script per ABI (V) | ~100-300 ms per frame on CPU (U) | ML Kit terms (on-device, metrics phoned home, disclose); PaddleOCR Apache-2.0 | ML Kit Gradle dep; onnxruntime-android |
| OCR (kitchen scale, 7-segment) | Classical: guided ROI box, grayscale, Otsu/adaptive threshold, morphology, connected components, 7-zone segment sampling, digit lookup, 3-frame vote | ML Kit Latin as second opinion (it often reads 7-segment digits but drops decimal points) | 0 | <10 ms | ours (OpenCV Apache-2.0) | OpenCV Android or pure Kotlin |

Not chosen and why:
- **Qualcomm AI Hub Whisper (NPU)**: Whisper-Small encoder 51 ms, Large-V3-Turbo encoder 302 ms on SM8850 (V), but the AI Hub export is the English-biased `whisper-small` checkpoint, needs the Qualcomm Voice AI SDK from Package Manager, and the WhisperKit Android wrapper is archived since Jan 2026 (V). Too much integration risk for a worse Indic model.
- **Gemma 4 E2B/E4B audio input** as primary ASR: 30 s clips at 16 kHz, 25 tokens per second of audio (V), but Gemma E4B scored 11.2 % Hindi / 34.8 % Kannada OI-WER against IndicConformer's 8.2 % / 21.4 % on the Voice of India telephone benchmark (V). Keep as the "LLM hears you" demo branch, not the primary.
- **Sarvam Saaras v4 / Bulbul v3**: API-only, not open weights (V, docs.sarvam.ai). Sarvam's open releases are text LLMs (30B/105B), unusable here.
- **SraVaani 1.0 (IISc/ARTPARK)**: MIT, 430M FastConformer TDT-CTC, 900 MB fp16, Hindi 12.4 % / Kannada 27.4 % WER (V). ONNX is on a Google Drive link, not in sherpa-onnx format; sherpa-onnx does run NeMo TDT-CTC (parakeet) so a conversion is plausible but untested (U). Backup only if IndicConformer Kannada disappoints.
- **Moonshine**: English plus ar/zh/ja/ko/uk/vi, no Hindi or Kannada (S). **Parakeet**: en and ja builds only in sherpa-onnx (V). **SenseVoice / Dolphin**: no Indic (V).
- **sherpa-onnx keyword spotting**: only zh/en models (V); the hotword biasing feature needs a transducer and `modified_beam_search`; the available IndicConformer exports are CTC, so no hotwords (V). Number robustness therefore comes from the parser and the read-back, not the decoder.
- **MMS Kannada TTS**: CC-BY-NC 4.0 (V). Avoid; the hackathon deck says "product".
- **Kokoro**: sherpa-onnx builds are zh+en only (V); upstream has Hindi voices but no Kannada (V). Piper covers Hindi more cheaply.
- **Indic Parler-TTS**: Apache-2.0 and good, but a Flan-T5 + MusicGen-style decoder (S), too heavy for a phone build weekend. Use it on the laptop to pre-render demo clips if needed.
- **NPU LLM via AI Hub Genie (qairt)**: Llama 3.2 3B w4a16 30 t/s, TTFT 0.07-2.3 s on SM8850 (V) but Llama licence plus Qualcomm Generative AI terms and a per-chipset context-binary bundle. Qwen3/Phi-4-mini AI Hub pages for SM8850 show only the `GENIEX_LLAMACPP` (GGUF) runtime, so the NPU path for them is the same llama.cpp Hexagon backend we would use as fallback anyway.

## 2. What the LLM does (at the core, never on the measurement path)

Judge-ready answer: "The LLM is the interface layer. It turns speech into a typed spec, words the fix for the mason in his language, and answers questions about the record. Every number it emits is validated against a closed set and read back for confirmation. Measurements and verdicts come from geometry and a versioned rulebook; the LLM never touches them."

1. **Spec extraction** (speech → five typed fields). Input: ASR transcript (native script, maybe Hinglish) plus the parser's candidate values. Output: JSON against the schema in §6.1. Deterministic validation runs after it; mismatches go to read-back.
2. **Fix wording** (finding JSON → one sentence in hi/kn/en, subtitle text and TTS text). Input is a rulebook result object. The LLM may only restate numbers that are in the input; the validator rejects any numeral not present in the finding.
3. **Record Q&A** (engineer asks "why is B2 left end outside limits?"). Context is the signed record JSON; answers must cite the field. Offline, on the engineer's phone or the Office Kit laptop.
4. **BBS table clean-up** (OCR lines → the same spec schema, one row per member). Every row still gets the confirm screen.

Rules: temperature 0; max 128 output tokens for tasks 1, 2, 4; a regex gate that strips anything outside the first JSON object; the UI never shows an LLM number without the confirm step. If the LLM is unavailable (load failure, thermal), tasks 1 and 2 fall back to the rule-based parser and sentence templates with no loss of function.

## 3. Evidence per stage

### 3.1 ASR
- IndicConformer: Conformer-L 120M, hybrid CTC-RNNT, 16 kHz mono, MIT, 22 languages; per-language models (V) https://github.com/AI4Bharat/IndicConformerASR . Official weights on HF are gated (agree-to-terms), e.g. https://huggingface.co/ai4bharat/indicconformer_stt_hi_hybrid_ctc_rnnt_large (S).
- sherpa-onnx-ready exports: `parismitaglobalsolutions/indicconformer-sherpa-onnx`, folders `hi/`, `kn/`, `en/`, `hi-hinglish-swift`, `hi-hinglish-apex`, `whisper-multilingual-*`; `hi/model.int8.onnx` 197.6 MB, `kn/model.int8.onnx` 197.6 MB, "int8, CTC-masked, sherpa-onnx compatible", loaded with `OfflineRecognizer.from_nemo_ctc()`; weights MIT, conversion Apache-2.0 (V) https://huggingface.co/parismitaglobalsolutions/indicconformer-sherpa-onnx . Older 8-language conversion with claimed RTF 0.1-0.3 on mobile: https://huggingface.co/meetsync/indic-conformer-onnx-sherpa (V, numbers are the uploader's claim).
- Benchmarks: Voice of India (Apr 2026, 536 h unscripted telephone speech, OI-WER): IndicConformer hi 8.2 / kn 21.4; Gemma E4B hi 11.2 / kn 34.8; Sarvam Saarika 2.5 hi 6.2 / kn 16.4 (V) https://voiceofindiablogs.ai.joshtalks.com/ . Vistaar: IndicWhisper average hi 13.6, kn 18.3 WER (S) https://github.com/AI4Bharat/vistaar . SraVaani: hi 12.4, kn 27.4 (V) https://huggingface.co/ARTPARK-IISc/SraVaani-1.0 .
- Indic-Whisper ggml for whisper.cpp: hi, kn, ta, te, gu small q5_1, ~181 MiB each, monolingual, Apache-2.0, fine-tunes by vasista22 (V) https://huggingface.co/ukta-app/indic-whisper-ggml .
- Gemma 4 audio: E2B/E4B/12B, 30 s max, 16 kHz, 25 tokens per audio second, "multilingual" with no language list (V) https://ai.google.dev/gemma/docs/capabilities/audio .
- Numbers: IndicConformer's docs say nothing about digits versus number words (V). AI4Bharat's ITN (indic-punct) covers hi and kn but is a WFST/NeMo Python stack, not Android (V) https://github.com/AI4Bharat/indic-punct . Expect spoken forms ("बारह", "ಹನ್ನೆರಡು", "twelve", "one fifty") and Hinglish digits in Latin script from the hinglish models. Write the parser (§5).
- sherpa-onnx: v1.13.8 released 10 Sep 2026 (V, GitHub releases); Android AAR on Maven Central as `com.k2fsa.sherpa.onnx:sherpa-onnx-android` (S) https://central.sonatype.com/artifact/com.k2fsa.sherpa.onnx/sherpa-onnx-android ; Silero VAD and keyword spotting supported, KWS models zh/en only (V) https://k2-fsa.github.io/sherpa/onnx/kws/index.html ; hotwords need transducer + modified_beam_search (V) https://k2-fsa.github.io/sherpa/onnx/hotwords/index.html .
- Qualcomm AI Hub Whisper: whisper-small encoder 50.8 ms / decoder 7.4 ms on SM8850, QAIRT 2.50, Voice AI SDK via Package Manager (V) https://huggingface.co/qualcomm/Whisper-Small ; large-v3-turbo encoder 302 ms (V) https://huggingface.co/qualcomm/Whisper-Large-V3-Turbo ; WhisperKit Android archived 24 Jan 2026, successor `argmax-sdk-kotlin` (V) https://github.com/argmaxinc/WhisperKitAndroid .

### 3.2 TTS
- Piper Hindi voices pratham, priyamvada, rohan (medium) in sherpa-onnx `tts-models` release: `vits-piper-hi_IN-pratham-medium.tar.bz2` 67.2 MB, `-fp16` 36 MB, `-int8` 21 MB (V, release asset list via gh) https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models ; source voices https://huggingface.co/rhasspy/piper-voices/tree/main/hi/hi_IN (V). No Kannada in Piper (V).
- No Kannada TTS of any kind in the sherpa-onnx release (asset grep for kan/kn found only a Gujarati mimic3 voice) (V).
- AI4Bharat Indic-TTS: 13 languages incl. Hindi and Kannada, FastPitch + HiFi-GAN, MIT (V) https://github.com/AI4Bharat/Indic-TTS . int8 ONNX exports with tokens.json: `kn/fastpitch-kn.int8.onnx` 63.2 MB, `kn/hifigan-kn.int8.onnx` 22.1 MB, `kn/sample-kn.wav`; FastPitch export needs the dynamo exporter (V) https://huggingface.co/RaunakSaha/echobharat-models . Running it means writing the text-to-token frontend and two ORT sessions ourselves; budget 3 h and do it before the event.
- Meta MMS kan: CC-BY-NC 4.0, 36M params (V) https://huggingface.co/facebook/mms-tts-kan .
- Android system TTS: Google "Speech Recognition & Synthesis" lists Kannada (India) and Hindi (India); voice data is installed per language (V) https://en.wikipedia.org/wiki/Speech_Recognition_%26_Synthesis ; TalkBack language list also shows both (V) https://support.google.com/accessibility/android/answer/11101402 . Check offline availability in code: `tts.isLanguageAvailable(Locale("kn","IN"))` must not be `LANG_MISSING_DATA`, and pick a voice from `tts.voices` with `isNetworkConnectionRequired == false` (V, API reference). Whether vivo's OriginOS 6 ships Google's engine, or its own, with Kannada data is **unverified** (searched, nothing found): test on the loaner in hour 1 and on any vivo/iQOO phone before.

### 3.3 LLM
- LiteRT-LM Android: `implementation("com.google.ai.edge.litertlm:litertlm-android:latest.release")`; `Engine(EngineConfig(modelPath=…))`, `engine.initialize()` can take ~10 s; backends CPU, GPU (needs `libOpenCL.so`), NPU (needs `nativeLibraryDir`, SoC list not given); `AudioFile`/`AudioBytes` inputs via `audioBackend`; tool calling via `@Tool` annotations; thinking budget; speculative decoding flag (V) https://developers.google.com/edge/litert-lm/android . Constrained decoding for structured output is announced for LiteRT-LM (V, InfoQ 5 Jun 2026 https://infoq.com/news/2026/06/google-litertlm-gemma4 ) but the Android API page does not document it (V): find the Kotlin entry point in the v0.18 repo before relying on it, else validate in code.
- Gemma 4 E2B files: `gemma-4-E2B-it-gpu.litertlm` 2.01 GB, `gemma-4-E2B-it.litertlm` 2.59 GB, NPU builds only `_qualcomm_sm8750` (3.02 GB), `_qualcomm_qcs8275`, Tensor G5/G6, Intel LNL/PTL (V). S26 Ultra (SM8850-class) benchmarks: CPU 46.9 t/s decode, 1.7 GB; GPU 52.1 t/s decode, 3,808 t/s prefill, TTFT 0.3 s, 676 MB (V) https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm . E4B repo: no NPU builds at all (V). Apache-2.0; audio input on E2B/E4B/12B (V).
- Qualcomm GenieX: two runtimes, `llama_cpp` (any GGUF on NPU/GPU/CPU via the ggml-hexagon backend) and `qairt` (AI Hub context binaries, NPU only); Android classes `LlmWrapper`, `VlmWrapper`, `ModelManagerWrapper`; chipset ids SM8750 / SM8850 (V) https://geniex.aihub.qualcomm.com/en/run/android/api-reference.md . No structured-output feature documented (V).
- SM8850 numbers (AI Hub, Galaxy S26 "8 Elite Gen 5 for Galaxy"): Qwen3-0.6B GENIEX_LLAMACPP q4_0 123 t/s peak, TTFT 0.13-0.52 s at 512 ctx (V); Qwen3-1.7B 43-48 t/s at 512 ctx (V) https://huggingface.co/qualcomm/Qwen3-1.7B ; Phi-4-mini 21-23 t/s, MIT (V) https://huggingface.co/qualcomm/Phi-4-Mini-Instruct ; Gemma-4-E4B q4_0 17-18 t/s (V) https://huggingface.co/qualcomm/Gemma-4-E4B-it ; Llama 3.2 3B GENIE w4a16 30.1 t/s, GENIEX_QAIRT 17.8 t/s (V) https://huggingface.co/qualcomm/Llama-v3.2-3B-Instruct .
- llama.cpp ggml-hexagon backend merged (PR 16547), v73/v75/v79/v81, Q4_0/Q8_0/MXFP4, experimental (S) https://app.semanticdiff.com/gh/ggml-org/llama.cpp/pull/16547/overview . llama.cpp has GBNF grammars and JSON-schema-to-grammar built in (U, long-standing feature).
- RunAnywhere QHexRT v81 bundles for Gemma 4 E2B: `gemma4_dec_i8.bin` 1.88 GB, `gemma4_ple_table_f16.bin` 4.70 GB, embed/lmhead 0.8 GB each, audio encoder 0.6 GB, vision 0.38 GB (V, file list). Apache-2.0, no speed or phone data on the card (V). Interesting for "NPU LLM" bragging, too big and unproven for the weekend; try only if everything else is done.

### 3.4 OCR
- ML Kit text recognition v2: bundled Latin `com.google.mlkit:text-recognition:16.0.1`, Devanagari `com.google.mlkit:text-recognition-devanagari:16.0.1`; about 4 MB per script per architecture; statically linked, works offline (V) https://developers.google.com/ml-kit/vision/text-recognition/v2/android . Terms: inference is on-device, but the SDK contacts Google for updates and sends performance metrics; disclose it in the app listing; no attribution notice required, no hackathon or commercial restriction found (V) https://developers.google.com/ml-kit/terms . For the airplane-mode demo this is fine: the metrics call just fails.
- Qualcomm AI Hub EasyOCR: detector 79 MB + recognizer 15 MB, 15.8 + 11.2 ms on SM8850 NPU, Apache-2.0 (V) https://huggingface.co/qualcomm/EasyOCR ; TrOCR small 320x320, 4.7 + 1.1 ms (S). Both need the QNN delegate path; more work than ML Kit for no gain on a printed table.
- PaddleOCR/RapidOCR ONNX: PP-OCRv4 det 4.5 MB, cls 0.6 MB, en rec 7.3 MB, Apache-2.0 (S) https://huggingface.co/xberg-io/paddleocr-onnx-models .
- Seven-segment: ssocr (classical thresholding, k-means threshold, dilation/erosion) is the reference approach; a tonometer study compared Tesseract against ssocr on 374 phone photos (S) https://www.unix-ag.uni-kl.de/~auerswal/ssocr/ssocr-manpage.html , https://fruct.org/publications/volume-15/acm15/files/Tim.pdf . Reflections off the scale's glass and LCD polarisation are the practical failures (U): the ROI guide box, torch off, and a 3-frame vote handle most of it.

### 3.5 Audio capture
- `AudioRecord` with `MediaRecorder.AudioSource.VOICE_RECOGNITION`, 16 kHz mono PCM16; attach `NoiseSuppressor.create(sessionId)` and `AutomaticGainControl` when `isAvailable()`; call `getEnabled()` to see whether the platform already inserted NS for that source (V) https://developer.android.com/reference/android/media/audiofx/NoiseSuppressor . CDD requires a flat 100 Hz-4 kHz response for VOICE_RECOGNITION (S).
- RNNoise lives in AOSP `external/rnnoise` (V) and has arm64 JNI wrappers (S); DTLN is <1M params and real-time (S). Use RNNoise only if the hall test shows the platform NS is not enough; it adds a 48 kHz resample step.
- Silero VAD v5 ~2 MB, ONNX, sub-ms per frame (S); sherpa-onnx wraps it (`sherpa-onnx-vad-with-offline-asr`) (V).

## 4. Pre-event checklist (by 8 Oct evening; files on the USB stick under `sariya-models/`)

Download and verify (sha256 noted in `MANIFEST.txt`):
1. `asr/hi/model.int8.onnx`, `asr/hi/tokens.txt`, same for `kn/`, `en/`, and `hi-hinglish-swift/` from https://huggingface.co/parismitaglobalsolutions/indicconformer-sherpa-onnx (~200 MB each; hinglish ~150 MB to 1 GB, take the small one).
2. `asr-fallback/ggml-hi-small.bin`, `ggml-kn-small.bin` from https://huggingface.co/ukta-app/indic-whisper-ggml (181 MiB each).
3. `vad/silero_vad.onnx` from the sherpa-onnx `asr-models` release.
4. `tts/hi/vits-piper-hi_IN-pratham-medium.tar.bz2` and `-int8` from https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models (also priyamvada for a female voice; read each `MODEL_CARD` for the licence).
5. `tts/kn/fastpitch-kn.int8.onnx`, `hifigan-kn.int8.onnx`, `fastpitch-kn.tokens.json`, `sample-kn.wav` from https://huggingface.co/RaunakSaha/echobharat-models/tree/main/kn ; same for `hi/` as a Piper backup.
6. `llm/gemma-4-E2B-it-gpu.litertlm` (2.01 GB) and `gemma-4-E2B-it.litertlm` (2.59 GB, CPU) from https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm .
7. `llm-fallback/Qwen3-0.6B-Q4_0.gguf` and `Qwen3-1.7B-Q4_0.gguf` (from the Qwen or a GGUF mirror on HF; or the `qualcomm/Qwen3-0.6B` GENIEX export, which is the same GGUF).
8. Pre-rendered demo audio: the ten demo fix sentences in hi and kn as WAV (render on the laptop with Indic-TTS or Indic Parler-TTS), plus number clips 0-9, 10-100 by tens, 100-1000 by hundreds in both languages for slot concatenation. This is the stage fallback if every on-device TTS fails.
9. Gradle cache warm: `com.k2fsa.sherpa.onnx:sherpa-onnx-android` (latest on Maven Central), `com.google.ai.edge.litertlm:litertlm-android`, `com.google.mlkit:text-recognition:16.0.1`, `com.google.mlkit:text-recognition-devanagari:16.0.1`, `com.microsoft.onnxruntime:onnxruntime-android`, OpenCV Android AAR. Also clone llama.cpp and the sherpa-onnx `android` examples; build both once so the NDK and CMake are cached.
10. Test wavs: 20 utterances per language of the five-field sentence recorded by two speakers on a phone in a noisy room (fan, TV, street), 16 kHz. Ground truth in a CSV. This is the hour-1 regression set.

Test on a spare Android phone (any arm64, 8 GB+):
- sherpa-onnx `OfflineRecognizer` with the hi and kn CTC models on the 20 wavs: WER, number-field accuracy after the parser, RTF. Note whether numerals come out as digits, native words or Latin words.
- Piper hi and Indic-TTS kn synthesis of three fix sentences; listen with a native speaker; check number pronunciation ("150" as "एक सौ पचास", "ನೂರ ಐವತ್ತು").
- LiteRT-LM Gemma 4 E2B GPU load time, memory, and the extraction prompt on 20 transcripts; measure JSON validity rate. If a constrained-decoding API exists in v0.18, use it; else keep the validator.
- llama.cpp Android with Qwen3-0.6B Q4_0 and the JSON-schema grammar: speed and validity.
- ML Kit on three photographed BBS tables; classical 7-segment reader on 30 photos of the kitchen scale at 0.6, 0.9 and 1.2 kg, with and without reflections.
- Android TTS: `isLanguageAvailable(kn-IN)` and `voices` on the spare phone and on any vivo/iQOO you can borrow.

## 5. Robust number capture

Three layers, cheapest first:
1. **Parser** (Kotlin, no model): tokenise the transcript; map number words in hi (एक…सौ, डेढ़ सौ = 150), kn (ಒಂದು…ನೂರು), en and Hinglish ("barah", "ek sau pachas", "one fifty") to integers; handle "at 100 and 150", "100/150", "100 to 150", "@". Attach each integer to the nearest field keyword (dia/डाया/ವ್ಯಾಸ, spacing/गैप/ಅಂತರ, stirrup/रिंग/ಸ್ಟಿರಪ್, end/end zone/छोर) by order of appearance; default order is the sentence template (dia, spacing, stirrup dia, stirrup spacing end, stirrup spacing mid, end-zone length).
2. **Snap to the valid set** with a confidence: dia ∈ {6, 8, 10, 12, 16, 20, 25, 32}; stirrup dia ∈ {6, 8, 10}; spacings 50-400 in steps of 5; end-zone 300-1500 in steps of 50. A value that snaps by more than one step, or a field with two candidates, is flagged "ask".
3. **LLM extraction** (§6.1) when the parser is unsure or the sentence is free-form. Its output goes through the same snap-and-flag step.

Then **confirm-by-read-back**, always.

## 6. Prompts and schemas

### 6.1 Spec extraction (task 1)
System: "You convert a site engineer's spoken reinforcement spec into JSON. Output only JSON matching the schema. Use null for anything not said. Do not guess units; all lengths are millimetres. Numbers may be spoken in Hindi, Kannada or English words."

User: `transcript: "<ASR text>"` plus `parser_candidates: {...}` (so the LLM sees the parser's reading and only corrects obvious misreads).

Schema (JSON Schema, also the GBNF source for llama.cpp):
```json
{
  "type": "object",
  "required": ["bar_dia_mm", "bar_spacing_mm", "stirrup_dia_mm", "stirrup_spacing_end_mm", "stirrup_spacing_mid_mm", "end_zone_mm", "language", "unsure_fields"],
  "properties": {
    "bar_dia_mm":             {"type": ["integer", "null"], "enum": [6, 8, 10, 12, 16, 20, 25, 32, null]},
    "bar_count":              {"type": ["integer", "null"], "minimum": 2, "maximum": 20},
    "bar_spacing_mm":         {"type": ["integer", "null"], "minimum": 50, "maximum": 400},
    "stirrup_dia_mm":         {"type": ["integer", "null"], "enum": [6, 8, 10, null]},
    "stirrup_spacing_end_mm": {"type": ["integer", "null"], "minimum": 50, "maximum": 400},
    "stirrup_spacing_mid_mm": {"type": ["integer", "null"], "minimum": 50, "maximum": 400},
    "end_zone_mm":            {"type": ["integer", "null"], "minimum": 300, "maximum": 1500},
    "language":               {"type": "string", "enum": ["hi", "kn", "en"]},
    "unsure_fields":          {"type": "array", "items": {"type": "string"}}
  },
  "additionalProperties": false
}
```
Two few-shot examples in the prompt, one Hindi ("बार डाया बारह, स्पेसिंग एक सौ पचास, रिंग आठ, सौ और डेढ़ सौ, एंड ज़ोन छह सौ") and one Kannada. Expected output for the English line in the brief: `{"bar_dia_mm":12,"bar_spacing_mm":150,"stirrup_dia_mm":8,"stirrup_spacing_end_mm":100,"stirrup_spacing_mid_mm":150,"end_zone_mm":600,"language":"en","unsure_fields":[]}`.

### 6.2 Fix wording (task 2)
System: "You write one short instruction for a mason, in the requested language, from a structured finding. Use only the numbers in the finding. Do not add advice, do not say safe, unsafe, pass or fail. Plain words, no jargon beyond 'stirrup' (रिंग / ಸ್ಟಿರಪ್). Output JSON only."

Input:
```json
{"member":"B2","zone":"left end","check":"stirrup_spacing_end","measured_mm":180,"band_mm":12,"required_mm":100,"required_source":"drawing","zone_length_mm":600,"action":{"type":"add_stirrups","count":4},"language":"hi"}
```
Output schema: `{"say": string, "subtitle": string, "numbers_used": integer[]}`. The validator checks `numbers_used` ⊆ numbers in the input and that `say` contains no digits outside that set. Reference output: "बीम B2, बायाँ सिरा: रिंग 180 पर हैं, ड्राइंग में पहले 600 मिमी तक 100 चाहिए। 4 रिंग और डालें।"

Template fallback (no LLM): per check type and language, a sentence with slots, e.g. kn: "ಬೀಮ್ {member}, {zone}: ಸ್ಟಿರಪ್ {measured} ಮಿಮೀ ಅಂತರದಲ್ಲಿವೆ, ಡ್ರಾಯಿಂಗ್ ಪ್ರಕಾರ ಮೊದಲ {zone_length} ಮಿಮೀ ವರೆಗೆ {required} ಬೇಕು. {count} ಸ್ಟಿರಪ್ ಸೇರಿಸಿ." Have a native speaker fix all templates before the event.

### 6.3 Record Q&A (task 3)
System: "Answer questions about this inspection record using only the record. Cite the field path you used, e.g. members[1].checks[2]. If the record does not contain the answer, say so. Never state that a structure is safe or approved." Context: the record JSON (trimmed to the member asked about to stay under ~1,500 tokens). Max 150 tokens output.

## 7. Confirm-by-read-back UX

1. Hold the mic button; a level meter and the VAD state show. Release or 1.2 s of silence ends the utterance (hard cap 12 s).
2. Transcript appears in the spoken script with the parsed numbers highlighted; each of the five fields is a chip: green (parsed and in set), amber (snapped or LLM-corrected), red (missing).
3. The phone reads back, in the same language, only the field values: "डाया 12, स्पेसिंग 150, रिंग 8, 100 और 150, एंड ज़ोन 600. ठीक?" (kn and en variants). Subtitles mirror it.
4. Commands (push-to-talk, closed set, matched by the parser with the ASR): "ठीक / ಸರಿ / ok", "नहीं / ಇಲ್ಲ / no", "फिर से / ಮತ್ತೆ / again", and "<field> <value>" to patch one field. Any amber or red chip blocks "ok" until tapped or patched.
5. A tap on a chip opens a number pad; voice is never the only path.
6. The confirmed spec is written with `source: "voice"`, the raw transcript, the parser output and the LLM output (if used), so the record shows what was heard.

## 8. At-event hour-1 checks on the loaner iQOO 15

1. `adb shell getprop ro.board.platform` and `ro.hardware` (expect `sun`/`kalama`-style name for SM8850; the device agent's note has the exact string), RAM, free storage (need ~6 GB for models).
2. Push the model folder with `adb push` to app-private storage; time it.
3. sherpa-onnx hi and kn recognizers on the 20-wav set: RTF with 2 and 4 threads, number-field accuracy. Pass bar: ≥ 90 % of fields correct after the parser on the clean set.
4. Live mic test in the hall with `VOICE_RECOGNITION` source, NS on and off; log `NoiseSuppressor.isAvailable()` and `getEnabled()`.
5. Android TTS: engine list, `isLanguageAvailable` for hi-IN and kn-IN, offline voices. If kn-IN offline is present, note it as a second TTS path.
6. Piper hi and Indic-TTS kn synth of one sentence each: latency and audio out through the speaker at hall volume.
7. LiteRT-LM Gemma 4 E2B GPU: `initialize()` time, first extraction latency, peak memory (`dumpsys meminfo`), thermal after 20 extractions. If GPU init fails (vendor `libOpenCL.so` missing), try the CPU `.litertlm`, then the Qwen3 GGUF path.
8. llama.cpp Qwen3-0.6B Q4_0 with grammar: t/s on CPU; if the ggml-hexagon build is ready, compare on NPU.
9. ML Kit on a photographed BBS table under hall light; 7-segment reader on the scale with a 0.2 m offcut.
10. Camera2: which rear lenses are exposed to third-party apps (owned by the vision agent, but the scale OCR needs a close-focus lens).

## 9. Open risks

- **IndicConformer Kannada accuracy in noise** (21-27 % WER on benchmarks, V): the five-field sentence is short and number-dense, so field accuracy may be worse than WER suggests. Mitigation: parser snap-set, read-back, keypad. If hour-1 is below 80 % on kn, switch the default to Indian English numbers for the demo and keep Kannada for the mason-facing TTS.
- **Number form unknown** (digits vs words vs Latin) for the CTC exports (V: undocumented). The parser handles all three; test before the event.
- **Kannada TTS integration is bespoke** (FastPitch frontend, two ORT sessions). If it is not working by 8 Oct evening, the demo uses pre-rendered clips and the system voice; say so honestly if asked.
- **Piper voice licences** are per-voice (U); confirm from each MODEL_CARD before the repo goes public.
- **Gemma 4 E2B on GPU needs vendor OpenCL** (V: `libOpenCL.so` requirement). vivo phones normally expose it (U). CPU build is the fallback at ~47 t/s (V, S26 Ultra), fine for 128-token outputs but 1.7 GB RAM.
- **No first-party SM8850 NPU LLM**. The honest line for the jury: "the segmentation model runs on the NPU; the LLM runs on the GPU because Google has not shipped a Gen 5 NPU build yet; the GGUF path through Qualcomm's Hexagon backend is the upgrade."
- **LiteRT-LM structured output** is announced (V) but not visible in the Android API doc (V). Do not promise it; validate in code.
- **ML Kit phones home for metrics** (V). Airplane mode makes that moot on stage; disclose in the listing.
- **Thermals**: ASR on CPU, TTS on CPU, LLM on GPU and segmentation on NPU in one session. Serialise: ASR → LLM → TTS, never concurrent with the camera pipeline; drop LLM to the 0.6B model if the frame rate of the overlay falls.
- **Hall noise**: a 60-80 dB hall with reverberation is harsher than a site. Push-to-talk with the phone 15 cm from the mouth, plus the platform NS, is the plan; RNNoise is the extra lever, untested on this SoC.
