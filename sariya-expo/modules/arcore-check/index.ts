import { Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo-modules-core';

type Native = { checkAvailability(): Promise<string>; requestInstall(): Promise<string> };

const native = Platform.OS === 'android' ? requireOptionalNativeModule<Native>('ArcoreCheck') : null;

export type ArStatus = 'supported' | 'install' | 'unsupported' | 'unknown';

// Maps ArCoreApk.Availability names to the three states the UI shows.
export async function checkArCore(): Promise<{ status: ArStatus; raw: string }> {
  if (!native) return { status: 'unknown', raw: Platform.OS === 'android' ? 'MODULE_MISSING' : 'NOT_ANDROID' };
  const raw = await native.checkAvailability();
  if (raw === 'SUPPORTED_INSTALLED') return { status: 'supported', raw };
  if (raw === 'SUPPORTED_APK_TOO_OLD' || raw === 'SUPPORTED_NOT_INSTALLED') return { status: 'install', raw };
  if (raw === 'UNSUPPORTED_DEVICE_NOT_CAPABLE') return { status: 'unsupported', raw };
  return { status: 'unknown', raw };
}

export async function requestArCoreInstall() {
  return native ? native.requestInstall() : 'UNAVAILABLE';
}
