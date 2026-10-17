'use client';
import { cn } from '@/libs/utils/cn';
import { groupByOrder } from '@/libs/utils/orderItems';
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from './Overlays/shared/useFocusTrap';
import { usePortal } from './Overlays/shared/usePortal';

export type DropdownMenuItem = {
  type?: 'item';
  /** Stable id: the React key, `data-item-id`, and the key `mergeMenuItems` replaces by. */
  id?: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  /** Renders the item as a link. A disabled item never navigates. */
  href?: string;
  danger?: boolean;
  disabled?: boolean;
  /** Why the item is disabled: shown under the label and as its tooltip while `disabled`. */
  disabledReason?: string;
  /** Leave the item out (a contribution the viewer may not use). */
  hidden?: boolean;
  /** Position, like CSS `order`: missing counts as 0, ties keep array order. */
  order?: number;
  /** Items of a group sit together; groups are split by a separator and ranked by their lowest `order`. */
  group?: string;
};

export type DropdownSeparator = { type: 'separator'; id?: string; hidden?: boolean };

export type DropdownItem = DropdownMenuItem | DropdownSeparator;

function isEntry(item: DropdownItem): item is DropdownMenuItem {
  return item.type !== 'separator';
}

/** Drops leading, trailing and doubled separators (left behind by hidden items). */
function tidySeparators(items: DropdownItem[]): DropdownItem[] {
  const out: DropdownItem[] = [];
  for (const item of items) {
    if (!isEntry(item) && (out.length === 0 || !isEntry(out[out.length - 1]))) continue;
    out.push(item);
  }
  while (out.length && !isEntry(out[out.length - 1])) out.pop();
  return out;
}

/**
 * The items a menu shows, in the order it shows them. Hidden items are left out. When any
 * item sets `group` or `order`, items are laid out by group (a separator between groups,
 * explicit separators ignored); otherwise the list keeps its own order and separators.
 */
export function arrangeMenuItems(items: readonly DropdownItem[]): DropdownItem[] {
  const visible = items.filter((item) => !item.hidden);
  const grouped = visible.some((item) => isEntry(item) && (item.group !== undefined || item.order !== undefined));
  if (!grouped) return visible.length === items.length ? visible : tidySeparators(visible);
  const out: DropdownItem[] = [];
  groupByOrder(visible.filter(isEntry), (item) => item.group).forEach((group, index) => {
    if (index > 0) out.push({ type: 'separator', id: `group:${group.group ?? ''}` });
    out.push(...group.items);
  });
  return out;
}

/**
 * Adds contributed items to a base list. An extra item whose `id` matches a base item
 * replaces it in place; the rest are appended (then placed by `arrangeMenuItems`).
 */
export function mergeMenuItems(base: readonly DropdownItem[], extra: readonly DropdownItem[] = []): DropdownItem[] {
  const byId = new Map<string, DropdownItem>();
  for (const item of extra) if (item.id) byId.set(item.id, item);
  const replaced = new Set<string>();
  const out = base.map((item) => {
    const next = item.id ? byId.get(item.id) : undefined;
    if (!next || !item.id) return item;
    replaced.add(item.id);
    return next;
  });
  for (const item of extra) if (!item.id || !replaced.has(item.id)) out.push(item);
  return out;
}

type Anchor = { bottom: number; left: number; right: number };

export function DropdownMenu({
  trigger,
  items,
  header,
  align = 'left',
  portal = false,
  className,
}: {
  trigger: React.ReactNode;
  items: DropdownItem[];
  header?: React.ReactNode;
  align?: 'left' | 'right';
  /**
   * Render the open menu in `document.body` with fixed positioning, so a scrolling or
   * clipping parent (a table's overflow wrapper) cannot cut it off.
   */
  portal?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const portalTarget = usePortal();
  const shown = useMemo(() => arrangeMenuItems(items), [items]);

  useFocusTrap(menuRef, { active: open, onEscape: () => setOpen(false) });

  const place = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) setAnchor({ bottom: rect.bottom, left: rect.left, right: rect.right });
  }, []);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (containerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    if (portal) {
      window.addEventListener('resize', place);
      window.addEventListener('scroll', place, true);
    }
    return () => {
      document.removeEventListener('mousedown', onOutside);
      if (portal) {
        window.removeEventListener('resize', place);
        window.removeEventListener('scroll', place, true);
      }
    };
  }, [open, portal, place]);

  const toggle = () => {
    if (!open && portal) place();
    setOpen((p) => !p);
  };

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

  const floating = portal && portalTarget !== null && anchor !== null;
  const menu = open && (
    <div
      ref={menuRef}
      role="menu"
      className={cn(
        floating
          ? 'fixed z-[60] min-w-[10rem] rounded-lg border border-border bg-surface-raised shadow-lg py-1'
          : 'absolute z-[60] mt-1 min-w-[10rem] rounded-lg border border-border bg-surface-raised shadow-lg py-1',
        !floating && (align === 'right' ? 'right-0' : 'left-0')
      )}
      style={
        floating && anchor
          ? align === 'right'
            ? { top: anchor.bottom + 4, right: document.documentElement.clientWidth - anchor.right }
            : { top: anchor.bottom + 4, left: anchor.left }
          : undefined
      }
    >
      {header && (
        <div className="border-b border-border mb-1">
          {header}
        </div>
      )}
      {shown.map((item, i) => {
        const key = item.id ?? i;
        if (item.type === 'separator') {
          return <div key={key} role="separator" className="my-1 border-t border-border" />;
        }
        const reasonId = item.disabled && item.disabledReason ? `${menuId}-reason-${i}` : undefined;
        const itemClassName = cn(
          'flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
          'focus-visible:outline-none focus-visible:bg-surface-overlay',
          item.danger
            ? 'text-error hover:bg-error-subtle'
            : 'text-text-primary hover:bg-surface-overlay',
          item.disabled && 'opacity-50 cursor-not-allowed'
        );
        const body = (
          <>
            {item.icon && <span aria-hidden="true">{item.icon}</span>}
            {reasonId ? (
              <span className="flex min-w-0 flex-col">
                <span>{item.label}</span>
                <span id={reasonId} className="text-xs text-text-secondary">{item.disabledReason}</span>
              </span>
            ) : (
              item.label
            )}
          </>
        );
        const select = () => { item.onClick?.(); setOpen(false); };
        if (item.href && !item.disabled) {
          return (
            <a key={key} role="menuitem" href={item.href} data-item-id={item.id} onClick={select} className={itemClassName}>
              {body}
            </a>
          );
        }
        return (
          <button
            key={key}
            role="menuitem"
            type="button"
            disabled={item.disabled}
            data-item-id={item.id}
            title={reasonId ? item.disabledReason : undefined}
            aria-label={reasonId ? item.label : undefined}
            aria-describedby={reasonId}
            onClick={select}
            className={itemClassName}
          >
            {body}
          </button>
        );
      })}
    </div>
  );

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <div onClick={React.isValidElement(trigger) ? undefined : toggle}>
        {triggerNode}
      </div>
      {menu && floating && portalTarget ? createPortal(menu, portalTarget) : menu}
    </div>
  );
}
