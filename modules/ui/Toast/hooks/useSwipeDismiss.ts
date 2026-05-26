// modules/ui/Toast/hooks/useSwipeDismiss.ts
//
// M3 stub — swipe-to-dismiss gesture support (touch + mouse).
// TODO M3: implement pointer tracking, x/y translation, threshold-based
//          dismissal, position-aware swipe direction (left for left-side
//          positions, right for right-side positions, up for `top-*`, etc.).

import type { RefObject } from 'react';

export type SwipeDismissOptions = {
  /** Element to attach pointer listeners to. */
  ref: RefObject<HTMLElement | null>;
  /** Called once the user has swiped past the dismissal threshold. */
  onDismiss: () => void;
  /** Position-aware preferred swipe axis. */
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
  /** Disable the gesture (e.g. for `prefers-reduced-motion`). */
  disabled?: boolean;
};

/**
 * No-op stub. Returns no live handlers — the toast card simply ignores
 * swipe gestures until M3 lands.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useSwipeDismiss(_opts: SwipeDismissOptions): void {
  // TODO M3: implement.
}
