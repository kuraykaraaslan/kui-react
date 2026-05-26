'use client';
// ─── useSnooze — M3 stub ─────────────────────────────────────────────────────
// M3 will let users snooze individual notifications (1h / 4h / tomorrow /
// next week / custom). For M1 this is intentionally a no-op so the public
// hook surface is stable across milestones.

// TODO M3: track snoozedUntil locally + call props.onSnooze(id, until).
export function useSnooze() {
  return {
    snooze: (_id: string, _until: Date) => {
      /* no-op until M3 */
    },
  };
}
