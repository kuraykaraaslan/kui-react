'use client';
import { useState, useEffect, useMemo, useTransition } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export type ComponentStatus = 'stable' | 'beta' | 'deprecated';

export type NavItem = {
  id: string;
  title: string;
  category: string;
  abbr: string;
  href?: string;
  status?: ComponentStatus;
  since?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
  sectionStart?: string;
};

const categoryStyles: Record<string, string> = {
  Atom:     'bg-info-subtle text-info-fg',
  Molecule: 'bg-primary-subtle text-primary',
  Organism: 'bg-success-subtle text-success-fg',
  App:      'bg-warning-subtle text-warning-fg',
  Domain:   'bg-error-subtle text-error-fg',
  Theme:    'bg-secondary text-primary-fg',
};

type NavContentProps = {
  groups: NavGroup[];
  selectedId: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
};

function NavContent({ groups, selectedId, onSelect, collapsed }: NavContentProps) {
  const [rawQuery, setRawQuery] = useState('');
  const [query, setQuery] = useState('');
  const [, startTransition] = useTransition();

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setRawQuery(e.target.value);
    startTransition(() => setQuery(e.target.value));
  }

  const isSearching = query.trim().length > 0;
  const filteredGroups = useMemo(() => {
    if (!isSearching) return groups;
    const q = query.toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query, isSearching]);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    for (const g of groups) {
      if (g.items.some((i) => i.id === selectedId)) {
        initial.add(g.label);
      }
    }
    return initial;
  });

  useEffect(() => {
    const group = groups.find((g) => g.items.some((i) => i.id === selectedId));
    if (group) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedGroups((prev) => {
        if (prev.has(group.label)) return prev;
        const next = new Set(prev);
        next.add(group.label);
        return next;
      });
    }
  }, [selectedId, groups]);

  function toggleGroup(label: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  return (
    <>
      <div
        className={cn(
          'flex items-center border-b border-border shrink-0 h-14',
          collapsed ? 'justify-center px-3' : 'px-5'
        )}
      >
        {collapsed ? (
          <span className="text-sm font-bold text-text-primary select-none">UI</span>
        ) : (
          <div>
            <p className="text-sm font-semibold text-text-primary">UI Showcase</p>
            <p className="text-xs text-text-secondary">Component library</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-3 py-2 border-b border-border">
          <div className="relative">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={rawQuery}
              onChange={handleSearch}
              placeholder="Search components…"
              aria-label="Search components"
              className={cn(
                'w-full rounded-md border border-border bg-surface-base pl-7 pr-3 py-1.5 text-sm text-text-primary',
                'placeholder:text-text-secondary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              )}
            />
          </div>
        </div>
      )}

      <nav aria-label="Component navigation" className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {isSearching && filteredGroups.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-8 text-text-secondary">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5 opacity-40" aria-hidden="true" />
            <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
          </div>
        )}
        {filteredGroups.map((group) => {
          const isExpanded = isSearching || collapsed || expandedGroups.has(group.label);
          const hasActive = group.items.some((i) => i.id === selectedId);
          return (
            <div key={group.label}>
              {!collapsed && group.sectionStart && (
                <div className="flex items-center gap-2 px-3 pt-3 pb-1">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-text-disabled shrink-0">
                    {group.sectionStart}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              )}
              {collapsed && group.sectionStart && (
                <div className="px-2 py-1.5">
                  <div className="h-px bg-border" />
                </div>
              )}
              {collapsed ? null : (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider transition-colors mb-0.5',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                    hasActive
                      ? 'text-text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'
                  )}
                >
                  <span>{group.label}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={cn(
                      'w-3 h-3 transition-transform duration-200',
                      isExpanded ? 'rotate-0' : '-rotate-90'
                    )}
                    aria-hidden="true"
                  />
                </button>
              )}

              {isExpanded && (
                <ul className="space-y-0.5 mb-2" role="list">
                  {group.items.map((item) => {
                    const isActive = selectedId === item.id;
                    const sharedClassName = cn(
                      'w-full flex items-center gap-3 rounded-lg text-sm transition-colors text-left',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                      collapsed ? 'justify-center p-2.5' : 'px-3 py-2',
                      isActive
                        ? 'bg-primary-subtle text-primary font-medium'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay'
                    );
                    const sharedContent = (
                      <>
                        <span
                          className={cn(
                            'flex items-center justify-center rounded-md text-xs font-bold shrink-0',
                            collapsed ? 'w-8 h-8' : 'w-6 h-6',
                            isActive
                              ? 'bg-primary text-primary-fg'
                              : 'bg-surface-sunken text-text-secondary'
                          )}
                        >
                          {item.abbr}
                        </span>
                        {!collapsed && (
                          <>
                            <span className={cn('flex-1 truncate', item.status === 'deprecated' && 'line-through opacity-60')}>
                              {item.title}
                            </span>
                            {item.status && item.status !== 'stable' && (
                              <span
                                className={cn(
                                  'text-[9px] font-bold px-1 py-0.5 rounded uppercase tracking-wide shrink-0',
                                  item.status === 'beta'
                                    ? 'bg-warning-subtle text-warning-fg'
                                    : 'bg-error-subtle text-error-fg'
                                )}
                                aria-label={item.status}
                              >
                                {item.status === 'beta' ? 'β' : 'dep'}
                              </span>
                            )}
                            <span
                              className={cn(
                                'text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0',
                                categoryStyles[item.category] ?? 'bg-surface-sunken text-text-secondary'
                              )}
                            >
                              {item.category}
                            </span>
                          </>
                        )}
                      </>
                    );
                    const isExternal = item.href ? !item.href.startsWith('/') : false;
                    return (
                      <li key={item.id}>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            title={collapsed ? `${item.title} (${item.category})` : undefined}
                            className={sharedClassName}
                          >
                            {sharedContent}
                          </a>
                        ) : (
                          <button
                            type="button"
                            title={collapsed ? `${item.title} (${item.category})` : undefined}
                            aria-current={isActive ? 'page' : undefined}
                            onClick={() => onSelect(item.id)}
                            className={sharedClassName}
                          >
                            {sharedContent}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}


type SidebarProps = NavContentProps & {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function Sidebar({
  groups,
  selectedId,
  onSelect,
  collapsed,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col h-screen sticky top-0 border-r border-border bg-surface-raised transition-all duration-200 shrink-0',
          collapsed ? 'w-14' : 'w-56'
        )}
      >
        <NavContent
          groups={groups}
          selectedId={selectedId}
          onSelect={onSelect}
          collapsed={collapsed}
        />
      </aside>

      {/* Mobile overlay drawer */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-50 transition-opacity duration-200',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onMobileClose}
          aria-hidden="true"
        />
        <aside
          className={cn(
            'absolute left-0 top-0 h-full w-56 bg-surface-raised flex flex-col shadow-xl transition-transform duration-200',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <NavContent
            groups={groups}
            selectedId={selectedId}
            onSelect={(id) => {
              onSelect(id);
              onMobileClose();
            }}
            collapsed={false}
          />
        </aside>
      </div>
    </>
  );
}
