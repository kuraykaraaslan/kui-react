'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type ContextMenuItem =
  | { kind: 'item'; label: string; icon?: IconDefinition; danger?: boolean; disabled?: boolean; onSelect: () => void }
  | { kind: 'separator' };

/** Right-click / long-press menu, positioned inside its container (x, y in the
 *  container's pixels). Arrow keys move, Enter picks, Escape or a click outside closes. */
export function ContextMenu({ x, y, items, onClose }: {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });

  /* keep it inside the container */
  useLayoutEffect(() => {
    const el = ref.current, parent = el?.parentElement;
    if (!el || !parent) return;
    const pw = parent.clientWidth, ph = parent.clientHeight;
    setPos({
      x: x + el.offsetWidth > pw - 4 ? Math.max(4, pw - el.offsetWidth - 4) : x,
      y: y + el.offsetHeight > ph - 4 ? Math.max(4, ph - el.offsetHeight - 4) : y,
    });
    el.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus({ preventScroll: true });
  }, [x, y]);

  useEffect(() => {
    function away(e: PointerEvent) { if (!ref.current?.contains(e.target as Node)) onClose(); }
    document.addEventListener('pointerdown', away, true);
    return () => document.removeEventListener('pointerdown', away, true);
  }, [onClose]);

  function onKeyDown(e: React.KeyboardEvent) {
    const its = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') ?? []);
    const i = its.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'ArrowDown') { its[(i + 1) % its.length]?.focus(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { its[(i - 1 + its.length) % its.length]?.focus(); e.preventDefault(); }
    else if (e.key === 'Escape') { onClose(); e.preventDefault(); }
    e.stopPropagation();
  }

  return (
    <div ref={ref} role="menu" onKeyDown={onKeyDown} onPointerDown={(e) => e.stopPropagation()}
      className="absolute z-50 min-w-52 rounded-lg border border-border bg-surface-base p-1 shadow-lg"
      style={{ left: pos.x, top: pos.y }}>
      {items.map((it, i) => it.kind === 'separator'
        ? <div key={`sep-${i}`} role="separator" className="mx-1.5 my-1 h-px bg-border" />
        : (
          <button key={it.label} type="button" role="menuitem" disabled={it.disabled}
            onClick={() => { onClose(); it.onSelect(); }}
            className={cn('flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors focus-visible:outline-none disabled:cursor-default disabled:opacity-45 sm:py-1.5 max-sm:py-2.5',
              it.danger
                ? 'text-error hover:bg-error-subtle focus-visible:bg-error-subtle'
                : 'text-text-primary hover:bg-primary-subtle hover:text-primary focus-visible:bg-primary-subtle focus-visible:text-primary')}>
            {it.icon && <FontAwesomeIcon icon={it.icon} className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            <span>{it.label}</span>
          </button>
        ))}
    </div>
  );
}
