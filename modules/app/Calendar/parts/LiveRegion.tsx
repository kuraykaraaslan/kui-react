'use client';
import { useEffect, useState } from 'react';

type LiveRegionProps = {
  /** Latest message. Each new value pushes an announcement to the screen reader. */
  message: string;
};

/**
 * Single ARIA live region for the calendar. polite + atomic so SRs read
 * each nav change once. Visually hidden via Tailwind's `sr-only`.
 *
 * The two-state ping-pong is the well-known workaround for SRs that
 * otherwise skip identical sequential messages.
 */
export function LiveRegion({ message }: LiveRegionProps) {
  const [regions, setRegions] = useState({ a: '', b: '', alt: false });

  useEffect(() => {
    if (!message) return;
    // The text has to land in the DOM *after* the live region is mounted for
    // screen readers to announce it, so this update is deliberately post-commit.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- live-region announcements must be post-mount DOM changes
    setRegions((r) => (r.alt ? { ...r, b: message, alt: false } : { ...r, a: message, alt: true }));
  }, [message]);

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{regions.a}</div>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{regions.b}</div>
    </>
  );
}
