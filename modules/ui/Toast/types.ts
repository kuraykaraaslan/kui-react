// modules/ui/Toast/types.ts
//
// Toast public types. Importable from `@/modules/ui/Toast`.
// M1 milestone — see PLANS/26-Toast.md.

import type { ReactNode } from 'react';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info' | 'loading';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export type ToastItemAction = {
  label: string;
  /** Receives a `dismiss` callback so actions can optionally close the toast. */
  onClick: (dismiss: () => void) => void;
  variant?: 'default' | 'danger';
};

export type ToastItem = {
  id: string;
  variant: ToastVariant;
  message: string;
  title?: string;
  icon?: ReactNode;
  /** ms — undefined = variant default; 0 = persistent */
  duration?: number;
  actions?: ToastItemAction[];
  /** Show the × close button (default: true) */
  closeButton?: boolean;
  /** Per-toast position override (M1) — falls back to <Toaster position>. */
  position?: ToastPosition;
  // TODO M2: render?: (t: ToastItem) => ReactNode — custom card body.
};

/** Options accepted by `toast(message, opts)` and `toast.success(...)` etc. */
export type ToastOptions = Partial<Omit<ToastItem, 'id' | 'variant' | 'message'>>;

/** Customisable copy strings for built-in toaster UI (M2+ extends this). */
export type ToastMessages = {
  dismiss?: string;
  // TODO M2: undo / retry default labels.
};

/** Imperative API surface — keep in sync with `toast` object. */
export type ToastApi = {
  (message: string, opts?: ToastOptions): string;
  success: (message: string, opts?: ToastOptions) => string;
  error:   (message: string, opts?: ToastOptions) => string;
  warning: (message: string, opts?: ToastOptions) => string;
  info:    (message: string, opts?: ToastOptions) => string;
  loading: (message: string, opts?: ToastOptions) => string;
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error:   string | ((err: unknown) => string);
    },
    opts?: ToastOptions,
  ) => string;
  update:  (id: string, patch: Partial<Omit<ToastItem, 'id'>>) => void;
  dismiss: (id: string) => void;
  clear:   () => void;
};

/** @deprecated Pre-directory-split alias. Prefer ToastItemAction. */
export type ToastAction = { label: string; onClick: () => void };
