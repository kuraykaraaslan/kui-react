'use client';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * `false` during SSR and hydration, `true` on the client afterwards.
 *
 * Replaces the `const [mounted, setMounted] = useState(false);
 * useEffect(() => setMounted(true), [])` idiom without the extra
 * setState-in-effect render pass.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
