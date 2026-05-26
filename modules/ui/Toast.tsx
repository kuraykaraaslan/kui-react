'use client';
// modules/ui/Toast.tsx
//
// Thin re-export shim — the real implementation now lives in the
// directory-style module `./Toast/`. Existing imports such as
//   import { ToastProvider, toast, useToastStore } from '@/modules/ui/Toast';
// continue to resolve through this barrel.
//
// M1 milestone — see PLANS/26-Toast.md.

export {
  Toaster,
  ToastProvider,
  ToastRegion,
  Toast,
  toast,
  useToast,
  useToastStore,
  getEffectiveDuration,
} from './Toast/index';

export type {
  ToastApi,
  ToastItem,
  ToastItemAction,
  ToastMessages,
  ToastOptions,
  ToastPosition,
  ToastVariant,
  ToastAction,
  ToasterProps,
} from './Toast/index';
