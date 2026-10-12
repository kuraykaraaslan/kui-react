'use client';
import { useCallback, useEffect, useRef } from 'react';

/**
 * A guard against losing a change by leaving the page. While `active`, closing the tab or reloading asks the browser
 * to confirm (`beforeunload`; the browser shows its own text, not ours), and `confirmLeave()` asks for a page's own
 * links (the flow list, a breadcrumb, a flow tab that leaves the page): true when it is fine to go. Not active, it
 * does nothing, so a host switches it on only while a change is not yet kept anywhere (the server draft).
 */
export function useLeaveGuard(active: boolean, message: string): { active: boolean; confirmLeave: () => boolean } {
  useEffect(() => {
    if (!active) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [active]);
  const latest = useRef({ active, message });
  useEffect(() => { latest.current = { active, message }; });
  const confirmLeave = useCallback(() => !latest.current.active || window.confirm(latest.current.message), []);
  return { active, confirmLeave };
}
