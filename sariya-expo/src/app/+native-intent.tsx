// "Open with Sariya" hands over a content:// URI, which is not a route; send it to the screen that checks received files.
export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  return path.startsWith('content://') ? `/received?uri=${encodeURIComponent(path)}` : path;
}
