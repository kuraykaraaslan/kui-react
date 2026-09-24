'use client';
import { useCallback, useSyncExternalStore } from 'react';

/**
 * Resolves the portal mount target for an overlay.
 *
 * - Defaults to `document.body`.
 * - Accepts an explicit `Element` or a CSS selector string.
 * - Returns `null` on the server / before hydration so callers can
 *   conditionally skip `createPortal`.
 */

const subscribeNoop = () => () => {};
const getServerNode = () => null;

export function usePortal(target?: Element | string | null): Element | null {
  const getNode = useCallback((): Element | null => {
    if (typeof document === 'undefined') return null;
    if (target instanceof Element) return target;
    if (typeof target === 'string') return document.querySelector(target);
    return document.body;
  }, [target]);

  return useSyncExternalStore(subscribeNoop, getNode, getServerNode);
}
