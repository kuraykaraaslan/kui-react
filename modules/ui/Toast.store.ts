// modules/ui/Toast.store.ts
//
// Thin re-export shim — the real store now lives in
// `./Toast/hooks/useToastStore.ts` and the imperative API in `./Toast/index.tsx`.
// Existing imports such as
//   import { useToastStore, toast } from '@/modules/ui/Toast.store';
// continue to resolve through this barrel.
//
// M1 milestone — see PLANS/26-Toast.md.

export {
  useToastStore,
  getEffectiveDuration,
} from './Toast/hooks/useToastStore';

export { toast } from './Toast/index';

export type {
  ToastItem,
  ToastVariant,
  ToastItemAction,
  ToastOptions,
} from './Toast/types';
