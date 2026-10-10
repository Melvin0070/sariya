# Welcome to your Expo app 👋

## Run Sariya on the connected iQOO (macOS)

This app uses native modules (camera, secure store, fingerprint, speech, sharing) and requires its own development build.

```bash
npm ci
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export ANDROID_HOME="$HOME/Library/Android/sdk"
npx expo run:android --device I2501
```

For subsequent JavaScript/TypeScript work, keep the phone connected over USB:

```bash
adb reverse tcp:8081 tcp:8081
npx expo start --dev-client --localhost
```

Press `a` to open the installed app. Fast Refresh applies saved source changes.
Rebuild after changing native modules or native configuration. Use Java 17 on
this Mac: Android Studio's bundled Java 25 failed the native CMake configuration.

Live scan readings come from the local module `modules/sariya-vision` (CameraX + LiteRT 2.3 + OpenCV 4.10):
card S / strip_300 pose by ChArUco/ArUco, bar mask by segmentation **model v2** (`models/seg/v2`, threshold 0.3,
copied into the APK at build time), bars as one parallel family in card mm. Locks are `AUTO` with the model,
accelerator and inference time recorded. "By hand" marking stays as the fallback.

NPU (iQOO 15 / SM8850 only) needs four QAIRT **2.50.0.260828** libraries in
`modules/sariya-vision/android/src/main/jniLibs/arm64-v8a/` (git-ignored, Qualcomm binaries):
`libQnnHtp.so`, `libQnnHtpV81Stub.so`, `libQnnSystem.so` from `lib/aarch64-android/` and `libQnnHtpV81Skel.so`
from `lib/hexagon-v81/unsigned/` of the QAIRT SDK zip. Without them the app falls back to GPU, then CPU; the
readiness screen says which and why.

Blurred frames are dropped (sharpness relative to the sharpest recent frame). Every lock stores a coverage map in card mm.
Bars the model only partly sees (usually under the card) are reported as *partly seen*: dashed amber live and on
the evidence photo, never counted, and they turn a short count or a wide gap into **re-scan** instead of "outside".

**New model round:** drop `unet_mbv3_1152.tflite` (+ `unet_mbv3_1152_sm8850_qairt250.tflite` for the NPU) into
`models/seg/vN/`, then build with `-Psariya.model=vN -Psariya.threshold=0.x` (default v2 / 0.3). Missing NPU file =
GPU fallback. The readiness screen shows the model and accelerator.

**Release APK** (arm64 only, debug-signed for sideloading):

```bash
cd android && ./gradlew :app:assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`. Bar-geometry unit tests: `./gradlew :sariya-vision:testDebugUnitTest`.

After changing native modules or `app.json` plugins, run `npx expo prebuild --platform android --clean`
before `run:android`.

Flow map: setup (role, name, readiness) → enrol phones (key QR) → operator: new → spec →
scan/lock → readings → checks → fix (Hindi/Kannada audio + subtitles) → sign → send pack via
Office Kit → open approval/request → sign-off QR. Engineer: open pack → review → fingerprint
approve or ask for another view → send back. Verifier: scan sign-off QR offline.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
