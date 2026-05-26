'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBug } from '@fortawesome/free-solid-svg-icons';
import { NODE_VISUALS, type NodeVisual } from '../node-meta';
import type { RuleNodeType } from '../../../types';

export function Palette({ onDragStart, onDragEnd, onDebugChain }: {
  onDragStart: (type: RuleNodeType) => void;
  onDragEnd: () => void;
  onDebugChain: () => void;
}) {
  return (
    <aside className="flex w-48 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface-raised">
      <div className="flex flex-col gap-1 p-3">
        <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-widest text-text-secondary">Node Types</p>
        {(Object.values(NODE_VISUALS) as NodeVisual[]).map((v) => (
          <div key={v.type} draggable onDragStart={() => onDragStart(v.type)} onDragEnd={onDragEnd}
            title={v.description}
            className="flex cursor-grab select-none items-center gap-2.5 rounded-lg border border-border bg-surface-base px-3 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary-subtle active:cursor-grabbing">
            <FontAwesomeIcon icon={v.icon} className={cn('h-3.5 w-3.5 shrink-0', v.iconColor)} aria-hidden="true" />
            <span className="truncate text-xs">{v.displayLabel}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto space-y-2 border-t border-border p-3">
        <button onClick={onDebugChain}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-primary hover:text-primary">
          <FontAwesomeIcon icon={faBug} className="w-3 h-3" aria-hidden="true" /> Debug Chain
        </button>
        <p className="text-[11px] leading-relaxed text-text-secondary">
          Drag nodes onto the canvas.<br />
          Click <span className="font-bold text-primary">●</span> output → <span className="font-bold">○</span> input to wire.<br />
          Click a node to edit its script.
        </p>
      </div>
    </aside>
  );
}
