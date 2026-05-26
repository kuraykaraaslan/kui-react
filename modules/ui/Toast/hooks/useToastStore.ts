// modules/ui/Toast/hooks/useToastStore.ts
//
// Zustand store backing the imperative `toast()` API and the declarative
// `useToast()` hook. M1 milestone — see PLANS/26-Toast.md.

import { create } from 'zustand';
import type { ToastItem, ToastVariant } from '../types';

/** Per-variant default auto-dismiss (ms). `null` = persistent. */
const VARIANT_DURATION: Record<ToastVariant, number | null> = {
  success: 5000,
  info:    5000,
  warning: 5000,
  error:   null,   // persistent — user must dismiss / be replaced via promise()
  loading: null,   // persistent — resolves via toast.promise / toast.update
};

/**
 * Resolve the effective duration for a queued toast.
 * - `duration === 0`  → persistent
 * - `duration` set    → use as-is
 * - otherwise         → variant default
 */
export function getEffectiveDuration(
  item: Pick<ToastItem, 'variant' | 'duration'>,
): number | null {
  if (item.duration === 0) return null;
  if (item.duration !== undefined) return item.duration;
  return VARIANT_DURATION[item.variant];
}

type ToastStore = {
  toasts: ToastItem[];
  add:    (item: Omit<ToastItem, 'id'>) => string;
  update: (id: string, patch: Partial<Omit<ToastItem, 'id'>>) => void;
  remove: (id: string) => void;
  clear:  () => void;
  /**
   * Maximum number of concurrent toasts kept in the queue. When the queue
   * grows past this, the oldest entries are dropped (FIFO).
   */
  max: number;
  setMax: (max: number) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  max: 5,
  add: (item) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    set((s) => {
      const next = [...s.toasts, { closeButton: true, ...item, id }];
      // Trim oldest while we're over capacity (FIFO).
      while (next.length > s.max) next.shift();
      return { toasts: next };
    });
    return id;
  },
  update: (id, patch) =>
    set((s) => ({
      toasts: s.toasts.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
  setMax: (max) => set({ max: Math.max(1, max) }),
}));
