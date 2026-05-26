'use client';
import { useCallback, useRef } from 'react';

/**
 * Sync vertical scroll between the left WBS panel and the right timeline
 * area. Horizontal scroll lives only on the timeline body so the panels
 * cannot drift.
 */
export function useScroll() {
  const sideRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const syncing = useRef(false);

  const onTimelineScroll = useCallback(() => {
    if (syncing.current) return;
    const tl = timelineRef.current;
    const side = sideRef.current;
    const header = headerRef.current;
    if (!tl) return;
    syncing.current = true;
    // Mirror vertical scroll into the left WBS panel.
    if (side && side.scrollTop !== tl.scrollTop) {
      side.scrollTop = tl.scrollTop;
    }
    // Mirror horizontal scroll into the sticky header.
    if (header && header.scrollLeft !== tl.scrollLeft) {
      header.scrollLeft = tl.scrollLeft;
    }
    syncing.current = false;
  }, []);

  const onSideScroll = useCallback(() => {
    if (syncing.current) return;
    const tl = timelineRef.current;
    const side = sideRef.current;
    if (!tl || !side) return;
    syncing.current = true;
    if (tl.scrollTop !== side.scrollTop) {
      tl.scrollTop = side.scrollTop;
    }
    syncing.current = false;
  }, []);

  return { sideRef, timelineRef, headerRef, onTimelineScroll, onSideScroll };
}
