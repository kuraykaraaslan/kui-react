'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '@/modules/ui/Overlays/shared/useFocusTrap';

export { SkipLink, LiveRegion, Announcer } from '@/modules/ui/SkipLink';
export { Tooltip } from '@/modules/ui/Tooltip';

type FocusTrapProps = {
  /** When false the trap is dormant — children render but focus is unmanaged. */
  active?: boolean;
  /** Optional Escape handler. Receives no args; just react and (usually) deactivate. */
  onEscape?: () => void;
  /** Forwarded to the outer wrapper for layout / styling. */
  className?: string;
  children: React.ReactNode;
};

/**
 * Wraps `useFocusTrap` as a drop-in component for app-layer surfaces that own
 * their own DOM container (custom dialogs, inline editors, command-palette
 * style panels). For Modal / Drawer / Popover you usually do not need this —
 * those primitives wire the hook themselves.
 */
export function FocusTrap({ active = true, onEscape, className, children }: FocusTrapProps) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, { active, onEscape });
  return (
    <div ref={ref} tabIndex={-1} className={className}>
      {children}
    </div>
  );
}

type Politeness = 'polite' | 'assertive';

type AnnounceQueue = {
  polite: string;
  assertive: string;
};

const listeners = new Set<(q: AnnounceQueue) => void>();
let queue: AnnounceQueue = { polite: '', assertive: '' };

function setQueue(next: AnnounceQueue) {
  queue = next;
  for (const fn of listeners) fn(next);
}

/**
 * Imperative announcer. Returns a function that pushes a message into a
 * page-level `aria-live` region (one polite + one assertive, mounted by
 * `<AnnouncerOutlet />`). The same string can be re-announced — the region
 * is cleared first so screen readers re-read it.
 *
 *   const announce = useAnnounce();
 *   announce('Saved', 'polite');
 */
export function useAnnounce() {
  return useCallback((message: string, politeness: Politeness = 'polite') => {
    // Clear → set on next tick so identical successive messages still fire.
    setQueue({ ...queue, [politeness]: '' });
    window.setTimeout(() => {
      setQueue({ ...queue, [politeness]: message });
    }, 16);
  }, []);
}

/**
 * Mount once near the root (e.g. in `AppShell`) so `useAnnounce()` has a
 * destination. Renders two visually-hidden live regions via a portal so the
 * outlet is unaffected by parent overflow / transforms.
 */
export function AnnouncerOutlet() {
  const [{ polite, assertive }, setLocal] = useState(queue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    listeners.add(setLocal);
    return () => {
      listeners.delete(setLocal);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {polite}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only">
        {assertive}
      </div>
    </>,
    document.body,
  );
}
