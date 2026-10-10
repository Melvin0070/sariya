import { requireNativeView } from 'expo';
import { requireOptionalNativeModule } from 'expo-modules-core';
import type { ComponentType, Ref } from 'react';
import { Platform, type ViewProps } from 'react-native';

export type Pt2 = [number, number];

// seg: upright image px; mm: the same centreline in plane mm.
export type VisionBar = { pos: number; seg: [number, number, number, number]; mm: [number, number, number, number]; support: number };

// One analysed camera frame. Pixels are in the upright frame (w x h), the same frame a freeze saves.
export type VisionFrame = {
  w: number;
  h: number;
  model: string;
  modelSha: string;
  accel: 'NPU' | 'GPU' | 'CPU' | 'none';
  inferMs: number;
  frameMs: number;
  modelError?: string | null;
  minMarkerPx: number;
  pose: null | { kind: 'card' | 'strip'; points: number; markerPx: number; pxPerMm: number; outline: Pt2[]; outlineMm: Pt2[]; footprintMm: Pt2[] };
  bars: VisionBar[];
  // Bar-length candidates too little of which was seen (under the card, blurred): never counted, they trigger re-scan.
  weak: VisionBar[];
  angle?: number | null;
  maskPts: number;
  sharp: number; // Laplacian variance, comparable only within one scan
};

export type VisionStatus = {
  ok: boolean;
  opencv: boolean;
  model: string;
  modelSha: string;
  threshold: number;
  accel: string;
  loadMs: number;
  inferMs: number;
  error?: string | null;
  npuError?: string | null;
};

export type Frozen = { uri: string; w: number; h: number; frame: VisionFrame };

export type VisionViewRef = { freeze(): Promise<Frozen> };

export type VisionViewProps = ViewProps & {
  ref?: Ref<VisionViewRef>;
  active: boolean;
  torch: boolean;
  marker: 'card' | 'strip';
  axis: 'x' | 'y';
  barDia: number;
  minLenMm: number;
  onFrame?: (e: { nativeEvent: VisionFrame }) => void;
  onReady?: () => void;
  onError?: (e: { nativeEvent: { message: string } }) => void;
};

type Native = {
  status(): Promise<VisionStatus>;
  analyzePhoto(path: string, marker: 'card' | 'strip', axis: 'x' | 'y', barDia: number, minLenMm: number): Promise<VisionFrame>;
};

const native = Platform.OS === 'android' ? requireOptionalNativeModule<Native>('SariyaVision') : null;

// Null when this build has no vision module (web, iOS, or a dev client built before it was added).
export const VisionView: ComponentType<VisionViewProps> | null = native ? requireNativeView<VisionViewProps>('SariyaVision') : null;

export async function visionStatus(): Promise<VisionStatus | null> {
  return native ? native.status() : null;
}

// The live pipeline on a saved upright photo (site photo replay, bench checks).
export async function analyzePhoto(path: string, marker: 'card' | 'strip', axis: 'x' | 'y', barDia: number, minLenMm: number): Promise<VisionFrame | null> {
  return native ? native.analyzePhoto(path, marker, axis, barDia, minLenMm) : null;
}
