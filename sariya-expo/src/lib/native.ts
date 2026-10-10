// Native modules added on 10 Oct. An older dev build lacks them, so each loads optionally and the UI says when one is missing.

function optional<T>(load: () => T): T | null {
  try {
    return load();
  } catch {
    return null;
  }
}

/* eslint-disable @typescript-eslint/no-require-imports */
export const FS = optional(() => require('expo-file-system') as typeof import('expo-file-system'));
export const SecureStore = optional(() => require('expo-secure-store') as typeof import('expo-secure-store'));
export const Speech = optional(() => require('expo-speech') as typeof import('expo-speech'));
export const LocalAuth = optional(() => require('expo-local-authentication') as typeof import('expo-local-authentication'));
export const Sharing = optional(() => require('expo-sharing') as typeof import('expo-sharing'));
/* eslint-enable @typescript-eslint/no-require-imports */
