// modules/ui/ColorPicker/hooks/useRecentColors.ts
//
// TODO M2: localStorage-backed FIFO queue (last 12 colors). Cross-tab sync
//          via the `storage` event. For now an empty stub.

export function useRecentColors() {
  // TODO M2
  return {
    recent: [] as string[],
    push: (_color: string) => {},
    clear: () => {},
  };
}
