'use client';
import { cn } from '@/libs/utils/cn';
import { useState } from 'react';
import { Drawer } from '@/modules/ui/Drawer';
import { Badge } from '@/modules/ui/Badge';
import { SearchBar } from '@/modules/ui/SearchBar';
import { Button } from '@/modules/ui/Button';
import { type AppSidebarNavGroup, type AppSidebarNavItem } from '@/modules/app/AppSidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

type AppDrawerProps = {
  navGroups?: AppSidebarNavGroup[];
  navItems?: AppSidebarNavItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  searchable?: boolean;
  trigger?: React.ReactNode;
  title?: string;
  side?: 'left' | 'right';
};

export function AppDrawer({
  navGroups,
  navItems,
  activeId,
  onSelect,
  header,
  footer,
  searchable = true,
  trigger,
  title = 'Navigation',
  side = 'left',
}: AppDrawerProps) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');

  const groups: AppSidebarNavGroup[] = navGroups ?? (navItems ? [{ items: navItems }] : []);

  const filtered = query.trim()
    ? groups
        .map((g) => ({
          ...g,
          items: g.items.filter((i) =>
            i.label.toLowerCase().includes(query.toLowerCase())
          ),
        }))
        .filter((g) => g.items.length > 0)
    : groups;

  function handleSelect(id: string) {
    onSelect?.(id);
    setOpen(false);
    setQuery('');
  }

  return (
    <>
      <div role="none" onClick={() => setOpen(true)}>
        {trigger ?? (
          <Button variant="outline" size="sm" iconLeft={<FontAwesomeIcon icon={faBars} className="w-3.5 h-3.5" aria-hidden="true" />}>
            Open Navigation
          </Button>
        )}
      </div>

      <Drawer
        open={open}
        onClose={() => { setOpen(false); setQuery(''); }}
        title={title}
        side={side}
      >
        {header && (
          <div className="mb-4">{header}</div>
        )}

        {searchable && (
          <SearchBar
            id="app-drawer-search"
            placeholder="Search navigation…"
            value={query}
            onChange={setQuery}
            className="mb-4"
          />
        )}

        <div className="space-y-4">
          {filtered.map((group, gi) => (
            <div key={group.label ?? gi}>
              {group.label && (
                <p className="text-xs font-semibold text-text-disabled uppercase tracking-wider mb-1 px-1">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={item.id === activeId ? 'page' : undefined}
                    onClick={() => handleSelect(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm',
                      'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                      item.id === activeId
                        ? 'bg-primary-subtle text-primary font-semibold'
                        : 'text-text-primary hover:bg-surface-overlay'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon && <span aria-hidden="true">{item.icon}</span>}
                      {item.label}
                    </span>
                    {typeof item.badge === 'number'
                      ? item.badge > 0 && <Badge variant="neutral" size="sm">{item.badge}</Badge>
                      : item.badge != null && item.badge !== false && <span className="shrink-0">{item.badge}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-sm text-text-secondary text-center py-4">
              No results for &quot;{query}&quot;
            </p>
          )}
        </div>

        {footer && (
          <div className="mt-4 pt-4 border-t border-border">{footer}</div>
        )}
      </Drawer>
    </>
  );
}
