const { withAppBuildGradle, withGradleProperties } = require('expo/config-plugins');

// The Qualcomm dispatch and QNN libs must sit unpacked in nativeLibraryDir, and LiteRT maps .tflite assets directly.
// The QNN libs exist for arm64 only, and every other ABI would add ~20 MB of OpenCV alone.
const PROPS = { 'expo.useLegacyPackaging': 'true', reactNativeArchitectures: 'arm64-v8a' };

module.exports = function withSariyaVision(config) {
  config = withGradleProperties(config, (c) => {
    c.modResults = c.modResults.filter((p) => !(p.type === 'property' && p.key in PROPS));
    for (const [key, value] of Object.entries(PROPS)) c.modResults.push({ type: 'property', key, value });
    return c;
  });
  return withAppBuildGradle(config, (c) => {
    if (!c.modResults.contents.includes('noCompress += "tflite"')) {
      c.modResults.contents = c.modResults.contents.replace(/androidResources \{/, 'androidResources {\n        noCompress += "tflite"');
    }
    return c;
  });
};
