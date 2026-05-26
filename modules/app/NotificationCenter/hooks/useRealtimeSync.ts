'use client';
// ─── useRealtimeSync — M4 stub ───────────────────────────────────────────────
// M4 will subscribe to a WebSocket / SSE adapter and push new notifications
// into the store. For M1 this hook is a no-op placeholder so the public API
// can stay stable across milestones.

// TODO M4: open WS/SSE connection, parse messages, emit to a subscriber list,
//          surface "live" badge + optionally trigger toast preview.
export function useRealtimeSync(_options?: { url?: string; protocol?: 'ws' | 'sse' }) {
  return {
    status: 'idle' as 'idle' | 'connecting' | 'open' | 'closed',
  };
}
