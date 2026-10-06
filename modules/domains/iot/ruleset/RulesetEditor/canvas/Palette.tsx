'use client';
import { useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faLayerGroup, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { paletteGroups } from '../../catalog/palette';
import type { Catalog } from '../../catalog/types';
import { lookOf } from '../block-visual';

export function Palette({ catalog, onDragStart, onDragEnd, onAdd, onDebugChain, onNewSubflow, addProblem, sheetOpen = false, onCloseSheet }: {
  catalog: Catalog;
  onDragStart: (type: string) => void;
  onDragEnd: () => void;
  /** click / Enter on an item: add it in the middle of the visible canvas */
  onAdd: (type: string) => void;
  onDebugChain: () => void;
  /** offer to make a new subflow */
  onNewSubflow?: () => void;
  /** why a block cannot be added right now (a second subflow input, a subflow that would hold itself), or null */
  addProblem?: (type: string) => string | null;
  /** phones: the palette is a bottom sheet over the canvas */
  sheetOpen?: boolean;
  onCloseSheet?: () => void;
}) {
  const [query, setQuery] = useState('');
  const groups = useMemo(() => paletteGroups(catalog, query), [catalog, query]);

  return (
    <aside aria-label="Node palette"
      className={cn('flex w-48 shrink-0 flex-col overflow-hidden border-r border-border bg-surface-raised',
        'max-md:absolute max-md:inset-x-0 max-md:bottom-0 max-md:z-40 max-md:max-h-[65%] max-md:w-auto max-md:rounded-t-xl max-md:border-r-0 max-md:border-t max-md:shadow-xl max-md:transition-transform motion-reduce:transition-none',
        sheetOpen ? 'max-md:translate-y-0' : 'max-md:translate-y-[105%]')}>
      <div className="px-3 pt-3 pb-1">
        <div className="mb-2 flex items-center justify-between px-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary">Node Types</p>
          {onCloseSheet && (
            <button type="button" onClick={onCloseSheet} aria-label="Close palette"
              className="rounded p-1 text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus md:hidden">
              <FontAwesomeIcon icon={faXmark} className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
        <label className="relative block">
          <span className="sr-only">Search node types</span>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-secondary" aria-hidden="true" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…"
            className="w-full rounded-lg border border-border bg-surface-base py-1.5 pl-7 pr-2 text-xs text-text-primary outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20" />
        </label>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {groups.map((g) => (
          <div key={g.id} role="group" aria-label={g.label}>
            <p className="mb-1.5 mt-3 px-1 text-[10px] font-semibold uppercase tracking-widest text-text-secondary">{g.label}</p>
            <div className="flex flex-col gap-1">
              {g.blocks.map((block) => {
                const look = lookOf(block);
                const problem = addProblem?.(block.type) ?? null;
                return (
                  <div key={block.type} draggable={!problem} role="button" tabIndex={0}
                    aria-disabled={problem ? true : undefined}
                    onDragStart={() => !problem && onDragStart(block.type)} onDragEnd={onDragEnd}
                    onClick={() => !problem && onAdd(block.type)}
                    onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !problem) { e.preventDefault(); onAdd(block.type); } }}
                    title={problem ?? block.description ?? block.title}
                    aria-label={`Add ${block.title} node`}
                    className={cn('flex select-none items-center gap-2.5 rounded-lg border border-border bg-surface-base px-3 py-2 text-sm font-medium text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                      problem ? 'cursor-not-allowed opacity-50' : 'cursor-grab hover:border-primary hover:bg-primary-subtle active:cursor-grabbing')}>
                    <FontAwesomeIcon icon={look.icon} className={cn('h-3.5 w-3.5 shrink-0', look.iconColor)} aria-hidden="true" />
                    <span className="truncate text-xs">{block.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {!groups.length && <p className="mt-3 px-1 text-xs text-text-secondary">No node type matches.</p>}
      </div>
      <div className="space-y-2 border-t border-border p-3 max-md:hidden">
        {onNewSubflow && (
          <button type="button" onClick={onNewSubflow}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
            <FontAwesomeIcon icon={faLayerGroup} className="h-3 w-3" aria-hidden="true" /> New subflow…
          </button>
        )}
        <button type="button" onClick={onDebugChain}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
          <FontAwesomeIcon icon={faBug} className="w-3 h-3" aria-hidden="true" /> Debug Chain
        </button>
        <p className="text-[11px] leading-relaxed text-text-secondary">
          Drag or click a node type to add it.<br />
          Drag from <span className="font-bold text-primary">●</span> output to <span className="font-bold">○</span> input to wire.<br />
          Click a node to edit it. Shift or Ctrl click adds to the selection. Select and press Delete to remove.
        </p>
      </div>
    </aside>
  );
}
