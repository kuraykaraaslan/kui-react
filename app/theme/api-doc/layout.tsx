'use client';
import { useState, useMemo } from 'react';
import { cn } from '@/libs/utils/cn';
import { AppShell } from '@/modules/app/AppShell';
import { ServerSelector } from '@/modules/domains/api-doc/ServerSelector';
import { HttpMethodBadge } from '@/modules/domains/api-doc/HttpMethodBadge';
import { SecuritySchemeBadge } from '@/modules/domains/api-doc/SecuritySchemeBadge';
import { Badge } from '@/modules/ui/Badge';
import { SearchBar } from '@/modules/ui/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faTag, faChevronRight, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { SAMPLE_SPEC } from './api-doc.data';
import type { PathItem } from '@/modules/domains/api-doc/types';
import { SkipLink } from '@/modules/ui/SkipLink';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'neutral' | 'info'> = {
  ACTIVE:     'success',
  DRAFT:      'warning',
  DEPRECATED: 'error',
  SUNSET:     'neutral',
};

type TagEntry = { path: string; operationId: string; method: string; summary?: string | null };
type TagMap   = Map<string, TagEntry[]>;

function buildTagMap(paths: PathItem[]): TagMap {
  const map: TagMap = new Map();
  for (const pathItem of paths) {
    for (const op of pathItem.operations ?? []) {
      const tags = op.tags?.length ? op.tags : ['Default'];
      for (const tag of tags) {
        if (!map.has(tag)) map.set(tag, []);
        map.get(tag)!.push({ path: pathItem.path, operationId: op.operationId, method: op.method, summary: op.summary });
      }
    }
  }
  return map;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function ApiDocLayout({ children }: { children: React.ReactNode }) {
  const [query, setQuery]           = useState('');
  const [activeTag, setActiveTag]   = useState<string | null>(null);
  const [collapsed, setCollapsed]   = useState<Set<string>>(new Set());

  const tagMap = useMemo(() => buildTagMap(SAMPLE_SPEC.paths), []);

  const filteredTagMap = useMemo<TagMap>(() => {
    if (!query.trim()) return tagMap;
    const q = query.toLowerCase();
    const out: TagMap = new Map();
    for (const [tag, entries] of tagMap) {
      const matches = entries.filter(
        (e) => e.path.toLowerCase().includes(q) || e.summary?.toLowerCase().includes(q) || e.method.toLowerCase().includes(q),
      );
      if (matches.length) out.set(tag, matches);
    }
    return out;
  }, [tagMap, query]);

  const securitySchemes = SAMPLE_SPEC.components?.securitySchemes
    ? Object.entries(SAMPLE_SPEC.components.securitySchemes)
    : [];

  function toggleTag(tag: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function handleTagClick(tag: string) {
    setActiveTag(tag);
    scrollToId(`tag-${tag}`);
  }

  function handleEndpointClick(tag: string, operationId: string) {
    setActiveTag(tag);
    scrollToId(`op-${operationId}`);
  }

  /* ── Sidebar ── */
  const sidebar = (
    <div className="flex flex-col w-72 h-full">
      {/* Server selector */}
      <div className="px-3 pt-3 pb-3 border-b border-border shrink-0">
        <ServerSelector servers={SAMPLE_SPEC.servers} />
      </div>

      {/* Security schemes */}
      {securitySchemes.length > 0 && (
        <div className="px-3 py-2.5 border-b border-border shrink-0">
          <p className="text-[10px] font-semibold text-text-disabled uppercase tracking-widest mb-1.5">Security</p>
          <div className="flex flex-wrap gap-1.5">
            {securitySchemes.map(([name, scheme]) => (
              <SecuritySchemeBadge key={name} type={scheme.type} name={name} size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-3 py-2.5 border-b border-border shrink-0">
        <SearchBar
          id="api-nav-search"
          placeholder="Filter endpoints…"
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
        />
      </div>

      {/* Tag nav */}
      <nav aria-label="API endpoints" className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {filteredTagMap.size === 0 && (
          <p className="px-3 py-6 text-xs text-text-disabled text-center">No results for &quot;{query}&quot;</p>
        )}

        {[...filteredTagMap.entries()].map(([tag, entries]) => {
          const isCollapsed = collapsed.has(tag);
          const tagDef = SAMPLE_SPEC.tags.find((t) => t.name === tag);
          const isActive = activeTag === tag;

          return (
            <div key={tag}>
              {/* Tag header */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={cn(
                    'flex-1 flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-xs font-semibold',
                    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                    isActive
                      ? 'bg-primary-subtle text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
                  )}
                >
                  <FontAwesomeIcon icon={faTag} className="w-3 h-3 shrink-0" aria-hidden="true" />
                  <span className="flex-1 uppercase tracking-wider">{tag}</span>
                  <Badge variant="neutral" size="sm">{entries.length}</Badge>
                </button>

                <button
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-label={isCollapsed ? `Expand ${tag}` : `Collapse ${tag}`}
                  className={cn(
                    'flex items-center justify-center w-6 h-6 rounded text-text-disabled',
                    'hover:text-text-primary hover:bg-surface-overlay transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                  )}
                >
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className={cn('w-3 h-3 transition-transform', !isCollapsed && 'rotate-90')}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* Tag description tooltip-style */}
              {!isCollapsed && tagDef?.description && (
                <p className="px-2 pb-1 text-[10px] text-text-disabled leading-tight line-clamp-2 ml-5">
                  {tagDef.description}
                </p>
              )}

              {/* Endpoint list */}
              {!isCollapsed && (
                <ul className="mt-0.5 mb-1 space-y-0.5 pl-1">
                  {entries.map((entry) => (
                    <li key={entry.operationId}>
                      <button
                        type="button"
                        onClick={() => handleEndpointClick(tag, entry.operationId)}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left',
                          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                          'text-text-secondary hover:bg-surface-overlay hover:text-text-primary group',
                        )}
                      >
                        <HttpMethodBadge method={entry.method as never} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-mono text-[11px]">{entry.path}</p>
                          {entry.summary && (
                            <p className="truncate text-[10px] text-text-disabled leading-tight group-hover:text-text-secondary">
                              {entry.summary}
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer links */}
      <div className="px-3 py-3 border-t border-border shrink-0 space-y-1">
        {SAMPLE_SPEC.info.termsOfService && (
          <a
            href={SAMPLE_SPEC.info.termsOfService}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-text-disabled hover:text-text-primary transition-colors"
          >
            <FontAwesomeIcon icon={faUpRightFromSquare} className="w-2.5 h-2.5" aria-hidden="true" />
            Terms of Service
          </a>
        )}
        {SAMPLE_SPEC.info.contact?.url && (
          <a
            href={SAMPLE_SPEC.info.contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-text-disabled hover:text-text-primary transition-colors"
          >
            <FontAwesomeIcon icon={faUpRightFromSquare} className="w-2.5 h-2.5" aria-hidden="true" />
            Support
          </a>
        )}
      </div>
    </div>
  );

  /* ── Logo (sidebar header) ── */
  const logo = (
    <div className="flex items-center gap-2.5 min-w-0 w-72 px-0">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-fg font-bold text-xs shrink-0 select-none">
        API
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate leading-tight">
          {SAMPLE_SPEC.info.title}
        </p>
        <p className="text-[10px] text-text-disabled font-mono leading-tight">v{SAMPLE_SPEC.info.version}</p>
      </div>
      <Badge variant={STATUS_VARIANT[SAMPLE_SPEC.status] ?? 'neutral'} size="sm" className="shrink-0">
        {SAMPLE_SPEC.status}
      </Badge>
    </div>
  );

  /* ── Topbar ── */
  const topbar = (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {/* Mobile title */}
      <div className="flex items-center gap-2 lg:hidden min-w-0">
        <FontAwesomeIcon icon={faBook} className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold text-text-primary truncate">{SAMPLE_SPEC.info.title}</span>
      </div>

      {/* Desktop search */}
      <div className="hidden lg:flex flex-1 max-w-xs">
        <SearchBar
          id="api-topbar-search"
          placeholder="Filter endpoints…"
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
        />
      </div>

      {/* Right: version info */}
      <div className="ml-auto flex items-center gap-3 shrink-0">
        <span className="hidden sm:block text-xs font-mono text-text-disabled">
          OpenAPI {SAMPLE_SPEC.openapi}
        </span>
        <Badge variant={STATUS_VARIANT[SAMPLE_SPEC.status] ?? 'neutral'} size="sm">
          {SAMPLE_SPEC.status}
        </Badge>
        {SAMPLE_SPEC.info.contact?.email && (
          <a
            href={`mailto:${SAMPLE_SPEC.info.contact.email}`}
            className="hidden md:block text-xs text-text-secondary hover:text-primary transition-colors"
          >
            {SAMPLE_SPEC.info.contact.name ?? SAMPLE_SPEC.info.contact.email}
          </a>
        )}
      </div>
    </div>
  );

  return (
    <>
      <SkipLink />
      <AppShell
        logo={logo}
        sidebar={sidebar}
        topbar={topbar}
        mobileSidebarTitle="API Navigation"
      >
        {children}
      </AppShell>
    </>
  );
}
