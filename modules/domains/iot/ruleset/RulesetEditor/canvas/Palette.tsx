'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { NODE_VISUALS, NODE_GROUPS, type NodeVisual } from '../node-meta';
import type { RuleNodeType } from '../../../types';

export function Palette({ onDragStart, onDragEnd, onAdd, onDebugChain, sheetOpen = false, onCloseSheet }: {
  onDragStart: (type: RuleNodeType) => void;
  onDragEnd: () => void;
  /** click / Enter on an item: add it in the middle of the visible canvas */
  onAdd: (type: RuleNodeType) => void;
  onDebugChain: () => void;
  /** phones: the palette is a bottom sheet over the canvas */
  sheetOpen?: boolean;
  onCloseSheet?: () => void;
}) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const visible = (Object.values(NODE_VISUALS) as NodeVisual[]).filter((v) =>
    !q || v.displayLabel.toLowerCase().includes(q) || v.description.toLowerCase().includes(q));

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
        {NODE_GROUPS.map((g) => {
          const items = visible.filter((v) => v.group === g.id);
          if (!items.length) return null;
          return (
            <div key={g.id} role="group" aria-label={g.label}>
              <p className="mb-1.5 mt-3 px-1 text-[10px] font-semibold uppercase tracking-widest text-text-secondary">{g.label}</p>
              <div className="flex flex-col gap-1">
                {items.map((v) => (
                  <div key={v.type} draggable role="button" tabIndex={0}
                    onDragStart={() => onDragStart(v.type)} onDragEnd={onDragEnd}
                    onClick={() => onAdd(v.type)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onAdd(v.type); } }}
                    title={v.description}
                    aria-label={`Add ${v.displayLabel} node`}
                    className="flex cursor-grab select-none items-center gap-2.5 rounded-lg border border-border bg-surface-base px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus active:cursor-grabbing">
                    <FontAwesomeIcon icon={v.icon} className={cn('h-3.5 w-3.5 shrink-0', v.iconColor)} aria-hidden="true" />
                    <span className="truncate text-xs">{v.displayLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {!visible.length && <p className="mt-3 px-1 text-xs text-text-secondary">No node type matches.</p>}
      </div>
      <div className="space-y-2 border-t border-border p-3 max-md:hidden">
        <button type="button" onClick={onDebugChain}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
          <FontAwesomeIcon icon={faBug} className="w-3 h-3" aria-hidden="true" /> Debug Chain
        </button>
        <p className="text-[11px] leading-relaxed text-text-secondary">
          Drag or click a node type to add it.<br />
          Drag from <span className="font-bold text-primary">●</span> output to <span className="font-bold">○</span> input to wire.<br />
          Click a node to edit it. Select a node or connection and press Delete to remove it.
        </p>
      </div>
    </aside>
  );
}
