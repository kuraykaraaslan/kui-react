// modules/ui/ColorPicker/hooks/useEyeDropper.ts
//
// TODO M2: wire native `window.EyeDropper` API (Chromium-only). Provide a
//          graceful fallback for Safari/Firefox via html2canvas snapshot.
//
// Currently a stub — exported so the public surface is reserved.

export function useEyeDropper() {
  // TODO M2
  return {
    supported: false as const,
    pick: async (): Promise<string | null> => null,
  };
}
