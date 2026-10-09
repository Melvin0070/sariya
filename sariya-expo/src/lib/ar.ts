import { Camera } from 'expo-camera';
import { Platform } from 'react-native';

import { checkArCore, requestArCoreInstall, type ArStatus } from '../../modules/arcore-check';

export type DeviceReport = { ar: Exclude<ArStatus, 'unknown'>; raw: string; camera: boolean };

// ARCore status from the native ArCoreApk check, falling back to ViroReact's own check.
export async function checkDevice(): Promise<DeviceReport> {
  const cam = await Camera.requestCameraPermissionsAsync().catch(() => ({ granted: false }));
  let { status, raw } = await checkArCore().catch(() => ({ status: 'unknown' as ArStatus, raw: 'ERROR' }));

  if (status === 'unknown' && Platform.OS !== 'web') {
    try {
      const { isARSupportedOnDevice } = await import('@reactvision/react-viro');
      const r = await isARSupportedOnDevice();
      status = r.isARSupported ? 'supported' : 'unsupported';
      raw = `VIRO_${r.isARSupported ? 'SUPPORTED' : 'UNSUPPORTED'}`;
    } catch {
      status = 'unsupported';
    }
  }
  return { ar: status === 'unknown' ? 'unsupported' : status, raw, camera: cam.granted };
}

export const installArCore = requestArCoreInstall;

export const AR_COPY = {
  supported: { title: 'ARCore ready', body: 'Full AR scan with live bar lines and distance lock.' },
  install: { title: 'Install ARCore', body: 'This phone supports AR. Get "Google Play Services for AR" to turn it on.' },
  unsupported: { title: 'Card-only mode', body: 'This phone has no ARCore. Sariya measures from the printed card alone.' },
  unknown: { title: 'Checking…', body: 'Looking for ARCore on this phone.' },
} as const;
