// modules/ui/DiffViewer/hooks/useScrollSync.ts
//
// Bidirectional horizontal+vertical scroll sync between two refs. Used by
// the split-view variant so the old/new panes track together.
//
// Implementation: each scroll handler temporarily marks the *target* pane
// as the active scroller so the mirrored update doesn't bounce back and
// re-trigger the source pane's handler.

import { useEffect } from 'react';

export function useScrollSync(
  leftRef: React.RefObject<HTMLElement | null>,
  rightRef: React.RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    let suppress = false;

    const sync = (source: HTMLElement, target: HTMLElement) => () => {
      if (suppress) return;
      suppress = true;
      target.scrollTop = source.scrollTop;
      target.scrollLeft = source.scrollLeft;
      // Release on the next frame — by then both handlers have settled.
      requestAnimationFrame(() => { suppress = false; });
    };

    const onLeft = sync(left, right);
    const onRight = sync(right, left);
    left.addEventListener('scroll', onLeft, { passive: true });
    right.addEventListener('scroll', onRight, { passive: true });
    return () => {
      left.removeEventListener('scroll', onLeft);
      right.removeEventListener('scroll', onRight);
    };
  }, [leftRef, rightRef]);
}
