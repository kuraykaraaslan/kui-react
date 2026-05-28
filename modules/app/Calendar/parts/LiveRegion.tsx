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
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [alt, setAlt] = useState(false);

  useEffect(() => {
    if (!message) return;
    if (alt) {
      setB(message);
      setAlt(false);
    } else {
      setA(message);
      setAlt(true);
    }
  }, [message]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{a}</div>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{b}</div>
    </>
  );
}
