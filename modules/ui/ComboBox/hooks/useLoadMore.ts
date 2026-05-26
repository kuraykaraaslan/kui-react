'use client';
// useLoadMore — IntersectionObserver-backed sentinel hook.
// Caller passes a sentinel ref + onLoadMore; hook fires onLoadMore once per
// intersection event while not already loading. Errors are swallowed silently
// (caller is expected to surface them via onSearch failure semantics).

import { useEffect, useRef, useState } from 'react';
import type { LoadMoreFn, ComboBoxOption } from '../types';

export function useLoadMore(
  open: boolean,
  sentinelRef: React.RefObject<HTMLElement | null>,
  onLoadMore: LoadMoreFn | undefined,
  onAppend: (next: ComboBoxOption[]) => void
) {
  const [loadingMore, setLoadingMore] = useState(false);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!open || !onLoadMore) return;
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || inFlightRef.current) return;

        inFlightRef.current = true;
        setLoadingMore(true);
        Promise.resolve(onLoadMore())
          .then((next) => {
            if (next && next.length > 0) onAppend(next);
          })
          .catch(() => { /* swallow — see header */ })
          .finally(() => {
            inFlightRef.current = false;
            setLoadingMore(false);
          });
      },
      { root: node.closest('[data-combobox-list]') ?? null, rootMargin: '40px' }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [open, onLoadMore, onAppend, sentinelRef]);

  return loadingMore;
}
