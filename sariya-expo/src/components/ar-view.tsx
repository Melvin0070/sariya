import { ViroARScene, ViroARSceneNavigator, ViroTrackingStateConstants } from '@reactvision/react-viro';
import { CameraView } from 'expo-camera';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';

// Viro scenes are created by the navigator, so tracking state is passed through a module-level callback.
const bridge = { onTracking: (_ok: boolean) => {} };

function TrackingScene() {
  return <ViroARScene onTrackingUpdated={(state) => bridge.onTracking(state === ViroTrackingStateConstants.TRACKING_NORMAL)} />;
}

export function ArCamera({ ar, torch, onTrackingChange }: { ar: boolean; torch: boolean; onTrackingChange: (ok: boolean) => void }) {
  useEffect(() => {
    bridge.onTracking = onTrackingChange;
  }, [onTrackingChange]);
  if (ar) {
    return <ViroARSceneNavigator style={StyleSheet.absoluteFill} autofocus initialScene={{ scene: TrackingScene as never }} />;
  }
  // Card-only mode: plain camera, pose comes from the printed card alone.
  return <CameraView style={StyleSheet.absoluteFill} facing="back" enableTorch={torch} onCameraReady={() => onTrackingChange(true)} />;
}
