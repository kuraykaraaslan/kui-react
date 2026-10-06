'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { cn } from '@/libs/utils/cn';

export type TabMenuItem =
  | { key: string; label: string; icon?: IconDefinition; disabled?: boolean; title?: string; onSelect: () => void }
  | { key: string; separator: true };

/**
 * The menu of one tab, under the tab (or its "…" button). Arrow keys move, Enter picks, Escape or a click outside
 * closes and gives the focus back to the tab.
 */
export function TabMenu({ anchor, items, onClose }: { anchor: HTMLElement; items: TabMenuItem[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(() => {
    const r = anchor.getBoundingClientRect();
    return { left: Math.max(4, r.left), top: r.bottom };
  });

  useLayoutEffect(() => {
    const el = ref.current;
    const r = anchor.getBoundingClientRect();
    if (el) {
      const w = el.offsetWidth;
      setPos({ left: Math.max(4, Math.min(r.left, window.innerWidth - w - 4)), top: r.bottom });
      el.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus({ preventScroll: true });
    }
  }, [anchor]);

  useEffect(() => {
    function away(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) onClose();
    }
    document.addEventListener('pointerdown', away, true);
    return () => document.removeEventListener('pointerdown', away, true);
  }, [onClose]);

  function close(refocus: boolean) {
    onClose();
    if (refocus) anchor.focus?.();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const its = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? []);
    const at = its.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') { its[(at + 1) % its.length]?.focus(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { its[(at - 1 + its.length) % its.length]?.focus(); e.preventDefault(); }
    else if (e.key === 'Escape') { close(true); e.preventDefault(); }
    else if (e.key === 'Tab') { close(false); }
    e.stopPropagation();
  }

  return createPortal(
    <div ref={ref} role="menu" aria-label="Menu of this tab" data-testid="flow-tabmenu" onKeyDown={onKeyDown}
      className="fixed z-50 min-w-52 rounded-lg border border-border bg-surface-base p-1 shadow-lg"
      style={{ left: pos.left, top: pos.top }}>
      {items.map((it) => 'separator' in it
        ? <div key={it.key} role="separator" className="mx-1.5 my-1 h-px bg-border" />
        : (
          <button key={it.key} type="button" role="menuitem" disabled={it.disabled} title={it.title} data-testid={`flow-tabmenu-${it.key}`}
            onClick={() => { onClose(); it.onSelect(); }}
            className={cn('flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm text-text-primary transition-colors',
              'hover:bg-primary-subtle hover:text-primary focus-visible:bg-primary-subtle focus-visible:text-primary focus-visible:outline-none',
              'disabled:cursor-default disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-text-primary max-sm:py-2.5')}>
            {it.icon && <FontAwesomeIcon icon={it.icon} className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            <span>{it.label}</span>
          </button>
        ))}
    </div>,
    document.body,
  );
}
