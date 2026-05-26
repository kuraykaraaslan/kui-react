'use client';
// modules/ui/Toast/index.tsx
//
// Public surface for the Toast suite.
//
//   <Toaster>     — root region container (mount once at app root)
//   <ToastProvider> — legacy alias kept for back-compat
//   toast()       — imperative API (success/error/warning/info/loading/promise)
//   useToast()    — declarative hook (returns the same API + live queue)
//
// M1 milestone — see PLANS/26-Toast.md.
// TODO M2: variant icons override, custom render slot, action button.
// TODO M3: swipe-to-dismiss, reduced-motion auto-detect, focus management.
// TODO M4: group/persistent toasts, badge counter, promise UX polish.

import { useEffect, useMemo } from 'react';
import { useToastStore, getEffectiveDuration } from './hooks/useToastStore';
import { Region } from './parts/Region';
import type {
  ToastApi,
  ToastItem,
  ToastMessages,
  ToastOptions,
  ToastPosition,
} from './types';

// Re-export types so callers can `import type { ToastPosition } from '@/modules/ui/Toast'`.
export type {
  ToastApi,
  ToastItem,
  ToastItemAction,
  ToastMessages,
  ToastOptions,
  ToastPosition,
  ToastVariant,
  ToastAction,
} from './types';

export { useToastStore, getEffectiveDuration } from './hooks/useToastStore';

// ─── Imperative API ────────────────────────────────────────────────────────
//
// `toast()` callable that doubles as a namespace. `toast('hi')` defaults to
// the info variant; variant helpers (`toast.success(...)`) bypass that.

function _add(item: Omit<ToastItem, 'id'>): string {
  return useToastStore.getState().add(item);
}

function _base(message: string, opts?: ToastOptions): string {
  return _add({ variant: 'info', message, ...opts });
}

const _toast = _base as ToastApi;

_toast.success = (message, opts) => _add({ variant: 'success', message, ...opts });
_toast.error   = (message, opts) => _add({ variant: 'error',   message, ...opts });
_toast.warning = (message, opts) => _add({ variant: 'warning', message, ...opts });
_toast.info    = (message, opts) => _add({ variant: 'info',    message, ...opts });
_toast.loading = (message, opts) => _add({ variant: 'loading', message, ...opts });

_toast.update  = (id, patch) => useToastStore.getState().update(id, patch);
_toast.dismiss = (id) => useToastStore.getState().remove(id);
_toast.clear   = () => useToastStore.getState().clear();

_toast.promise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error:   string | ((err: unknown) => string);
  },
  opts?: ToastOptions,
): string => {
  const id = _add({ variant: 'loading', message: messages.loading, ...opts });
  promise
    .then((data) => useToastStore.getState().update(id, {
      variant: 'success',
      message: typeof messages.success === 'function' ? messages.success(data) : messages.success,
      // Reset to variant default duration when resolving from loading.
      duration: undefined,
    }))
    .catch((err) => useToastStore.getState().update(id, {
      variant: 'error',
      message: typeof messages.error === 'function' ? messages.error(err) : messages.error,
      duration: undefined,
    }));
  return id;
};

export const toast: ToastApi = _toast;

// ─── Declarative hook ──────────────────────────────────────────────────────

/**
 * Returns the imperative API plus reactive access to the toast queue.
 * Components that need to react to queue changes (e.g. a badge counter)
 * should use this hook; otherwise call `toast(...)` directly.
 */
export function useToast() {
  const toasts = useToastStore((s) => s.toasts);
  // Stable identity — the methods on `toast` never change.
  const api = useMemo(() => toast, []);
  return { ...api, toasts };
}

// ─── Toaster (region root) ─────────────────────────────────────────────────

export type ToasterProps = {
  /** Default position for toasts that don't specify their own. */
  position?: ToastPosition;
  /** Maximum concurrent toasts (default 5). Older toasts dismiss FIFO. */
  max?: number;
  /** Tailwind gap unit between stacked toasts (default 2 = 0.5rem). */
  gap?: number;
  /** Skip enter/exit animation. M3 will auto-detect `prefers-reduced-motion`. */
  reducedMotion?: boolean;
  /** Localisable copy. TODO M2: pipe into close button / action labels. */
  messages?: ToastMessages;
};

export function Toaster({
  position = 'top-right',
  max = 5,
  gap = 2,
  reducedMotion = false,
  messages: _messages,
}: ToasterProps = {}) {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);
  const setMax = useToastStore((s) => s.setMax);

  // Sync the configured max into the store so add() can enforce FIFO trim.
  useEffect(() => { setMax(max); }, [max, setMax]);

  // Partition the queue by per-toast position override; render one Region
  // per occupied slot so toasts can target any of the 6 corners.
  const buckets = new Map<ToastPosition, ToastItem[]>();
  for (const t of toasts) {
    const pos = t.position ?? position;
    const bucket = buckets.get(pos);
    if (bucket) bucket.push(t);
    else buckets.set(pos, [t]);
  }

  // Ensure the configured default position always renders so its mount is
  // stable across re-renders (helps tests and snapshots).
  if (!buckets.has(position)) buckets.set(position, []);

  return (
    <>
      {Array.from(buckets.entries()).map(([pos, items]) => (
        <Region
          key={pos}
          position={pos}
          items={items}
          gap={gap}
          reducedMotion={reducedMotion}
          onRemove={remove}
        />
      ))}
    </>
  );
}

// ─── Back-compat aliases ───────────────────────────────────────────────────

/** @deprecated Use `<Toaster />` — kept for back-compat with the pre-split API. */
export const ToastProvider = Toaster;

/** @deprecated Use `<Toaster />` instead. Static region without store wiring. */
export function ToastRegion({
  children,
  position = 'top-right',
  className,
}: {
  children?: React.ReactNode;
  position?: ToastPosition;
  className?: string;
}) {
  // M1 retains the legacy static-region shell so consumers that hand-render
  // toast cards (rare) keep working. New code should mount <Toaster /> once.
  // We forward to <Region> with an empty item list and just render children.
  const positionClass: Record<ToastPosition, string> = {
    'top-right':     'top-4 right-4 items-end',
    'top-left':      'top-4 left-4 items-start',
    'top-center':    'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-right':  'bottom-4 right-4 items-end',
    'bottom-left':   'bottom-4 left-4 items-start',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  };
  return (
    <div
      className={[
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        positionClass[position],
        className ?? '',
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}

/** @deprecated Mount `<Toaster />` and call `toast.success(...)` instead. */
export function Toast({
  variant = 'info',
  message,
  duration,
  onDismiss,
  action,
}: {
  variant?: ToastItem['variant'];
  message: string;
  duration?: number;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
}) {
  // Avoid pulling in the full <ToastItem> rendering path here — the legacy
  // single-shot variant was barely used. Instead we just push the toast into
  // the store and let the Toaster handle it. `onDismiss` runs on auto-cleanup.
  useEffect(() => {
    const id = useToastStore.getState().add({
      variant,
      message,
      duration,
      actions: action
        ? [{ label: action.label, onClick: (d) => { action.onClick(); d(); } }]
        : undefined,
    });

    if (!onDismiss) return;
    const eff = getEffectiveDuration({ variant, duration });
    if (eff === null) return;
    const timer = setTimeout(onDismiss, eff);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
