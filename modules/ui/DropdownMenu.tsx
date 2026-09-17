'use client';
import { cn } from '@/libs/utils/cn';
import React, { useEffect, useRef, useState } from 'react';

export type DropdownItem =
  | { type?: 'item'; label: string; icon?: React.ReactNode; onClick?: () => void; danger?: boolean; disabled?: boolean }
  | { type: 'separator' };

export function DropdownMenu({
  trigger,
  items,
  header,
  align = 'left',
  className,
}: {
  trigger: React.ReactNode;
  items: DropdownItem[];
  header?: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = () => setOpen((p) => !p);

  // aria-haspopup/aria-expanded belong on the trigger's own interactive
  // element (a real <button> in every current usage) — a plain wrapping
  // <div> has an implicit "generic" role, which doesn't support those
  // attributes at all (axe: aria-allowed-attr, critical). Clone them onto
  // the trigger when it's a single element; the wrapper's onClick still
  // works either way since the click bubbles up from the real trigger.
  type TriggerProps = {
    onClick?: (e: React.MouseEvent) => void;
    'aria-haspopup'?: React.AriaAttributes['aria-haspopup'];
    'aria-expanded'?: boolean;
  };
  const triggerNode = React.isValidElement<TriggerProps>(trigger)
    ? React.cloneElement(trigger, {
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        onClick: (e: React.MouseEvent) => {
          trigger.props.onClick?.(e);
          toggle();
        },
      })
    : trigger;

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <div onClick={React.isValidElement(trigger) ? undefined : toggle}>
        {triggerNode}
      </div>
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-[60] mt-1 min-w-[10rem] rounded-lg border border-border bg-surface-raised shadow-lg py-1',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {header && (
            <div className="border-b border-border mb-1">
              {header}
            </div>
          )}
          {items.map((item, i) => {
            if (item.type === 'separator') {
              return <div key={i} role="separator" className="my-1 border-t border-border" />;
            }
            return (
              <button
                key={i}
                role="menuitem"
                type="button"
                disabled={item.disabled}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                  'focus-visible:outline-none focus-visible:bg-surface-overlay',
                  item.danger
                    ? 'text-error hover:bg-error-subtle'
                    : 'text-text-primary hover:bg-surface-overlay',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {item.icon && <span aria-hidden="true">{item.icon}</span>}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
