'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAt } from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@/modules/ui/Avatar';

export type MentionPickerUser = {
  id: string;
  name: string;
  handle?: string;
  avatarUrl?: string | null;
  subtitle?: string;
};

export type MentionPickerProps = {
  users: MentionPickerUser[];
  query?: string;
  open?: boolean;
  position?: { top: number; left: number };
  maxItems?: number;
  emptyMessage?: string;
  onSelect: (user: MentionPickerUser) => void;
  onCancel?: () => void;
  filter?: (user: MentionPickerUser, query: string) => boolean;
  className?: string;
};

function defaultFilter(user: MentionPickerUser, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    user.name.toLowerCase().includes(q) ||
    (user.handle ?? '').toLowerCase().includes(q)
  );
}

export function MentionPicker({
  users,
  query = '',
  open = true,
  position,
  maxItems = 6,
  emptyMessage = 'No matching users',
  onSelect,
  onCancel,
  filter = defaultFilter,
  className,
}: MentionPickerProps) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const filtered = useMemo(
    () => users.filter((u) => filter(u, query)).slice(0, maxItems),
    [users, query, filter, maxItems],
  );

  const safeActive = filtered.length === 0 ? 0 : Math.min(active, filtered.length - 1);

  useEffect(() => {
    itemRefs.current[safeActive]?.scrollIntoView({ block: 'nearest' });
  }, [safeActive]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => (filtered.length ? (a + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => (filtered.length ? (a - 1 + filtered.length) % filtered.length : 0));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (filtered.length > 0) {
          e.preventDefault();
          const idx = Math.min(safeActive, filtered.length - 1);
          onSelect(filtered[idx]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel?.();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, safeActive, onSelect, onCancel]);

  useEffect(() => {
    if (!open || !onCancel) return;
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onCancel?.();
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open, onCancel]);

  if (!open) return null;

  const style: React.CSSProperties | undefined = position
    ? { position: 'absolute', top: position.top, left: position.left }
    : undefined;

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label="Users to mention"
      style={style}
      className={cn(
        'z-50 w-72 rounded-lg border border-border bg-surface-raised shadow-lg overflow-hidden',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-text-secondary">
        <FontAwesomeIcon icon={faAt} className="w-3 h-3 text-text-disabled" aria-hidden="true" />
        <span className="font-medium">
          {query ? `"${query}"` : 'Mention…'}
        </span>
      </div>
      {filtered.length === 0 ? (
        <p className="px-3 py-4 text-sm text-center text-text-secondary">{emptyMessage}</p>
      ) : (
        <ul className="max-h-64 overflow-y-auto py-1">
          {filtered.map((user, i) => {
            const isActive = i === safeActive;
            return (
              <li
                key={user.id}
                ref={(node) => {
                  itemRefs.current[i] = node;
                }}
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(user);
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors',
                  isActive ? 'bg-surface-overlay' : 'hover:bg-surface-overlay',
                )}
              >
                <Avatar src={user.avatarUrl ?? undefined} name={user.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                  <p className="text-xs text-text-secondary truncate">
                    {user.handle ? `@${user.handle}` : user.subtitle ?? ''}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
