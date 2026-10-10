import { bytesToHex } from '@noble/hashes/utils.js';
import { Alert } from 'react-native';
import { CryptoDigestAlgorithm, digest } from 'expo-crypto';

import { FS, Sharing } from './native';

// Office Kit is an external app: Sariya only writes a file and hands it to the system share sheet or a folder the user picks.

const MIME = 'application/json';

function evidenceDir() {
  if (!FS) throw new Error('File storage is missing from this build. Reinstall the current build.');
  const d = new FS.Directory(FS.Paths.document, 'evidence');
  if (!d.exists) d.create();
  return d;
}

export async function hashBytes(bytes: Uint8Array<ArrayBuffer>) {
  return bytesToHex(new Uint8Array(await digest(CryptoDigestAlgorithm.SHA256, bytes)));
}

// Copies a camera capture into app storage and returns its content hash.
export async function keepEvidence(uri: string) {
  const src = new FS!.File(uri);
  const bytes = await src.bytes();
  const hash = await hashBytes(bytes);
  const dst = new FS!.File(evidenceDir(), `${hash}.jpg`);
  if (!dst.exists) {
    dst.create();
    dst.write(bytes);
  }
  return { hash, file: dst.uri };
}

export async function readEvidenceBase64(file: string) {
  return new FS!.File(file).base64();
}

// Writes received evidence and checks it against the hash the operator signed.
export async function storeEvidence(base64: string, hash: string) {
  const dst = new FS!.File(evidenceDir(), `${hash}.jpg`);
  if (!dst.exists) {
    dst.create();
    dst.write(base64, { encoding: 'base64' });
  }
  const actual = await hashBytes(await dst.bytes());
  if (actual !== hash) {
    dst.delete();
    return null;
  }
  return dst.uri;
}

function temp(name: string, text: string) {
  const f = new FS!.File(FS!.Paths.cache, name);
  if (f.exists) f.delete();
  f.create();
  f.write(text);
  return f;
}

export const canShare = () => !!FS && !!Sharing;

// Android's share sheet cannot report whether the file actually went, so the operator confirms it.
export async function shareFile(name: string, text: string, title: string): Promise<boolean> {
  if (!FS || !Sharing) throw new Error('Sharing is missing from this build. Reinstall the current build.');
  const f = temp(name, text);
  await Sharing.shareAsync(f.uri, { mimeType: MIME, dialogTitle: title });
  return confirmSent();
}

export const confirmSent = () =>
  new Promise<boolean>((resolve) =>
    Alert.alert('Did it reach the other phone?', 'Android does not tell Sariya whether Office Kit delivered the file.', [
      { text: 'Not yet', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Yes, sent', onPress: () => resolve(true) },
    ]),
  );

// Returns false when the user closes the folder picker.
export async function saveToFolder(name: string, text: string, mime = MIME) {
  if (!FS) throw new Error('File storage is missing from this build.');
  let dir;
  try {
    dir = await FS.Directory.pickDirectoryAsync();
  } catch {
    return false;
  }
  if (!dir) return false;
  const f = dir.createFile(name, mime);
  f.write(text);
  return true;
}

// The user explicitly chooses one received file; no folder scanning or broad storage permission.
export async function pickText(): Promise<{ name: string; text: string } | null> {
  if (!FS) throw new Error('File storage is missing from this build.');
  const res = await FS.File.pickFileAsync({ mimeTypes: [MIME, 'application/octet-stream', 'text/plain', '*/*'] });
  if (res.canceled) return null;
  return { name: res.result.name, text: await res.result.text() };
}

export async function shareCsv(name: string, text: string) {
  if (!FS || !Sharing) throw new Error('Sharing is missing from this build.');
  const f = temp(name, text);
  await Sharing.shareAsync(f.uri, { mimeType: 'text/csv', dialogTitle: 'Export error table' });
}
