'use client';
import { useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { barPct, busiestRows, rootNode } from './stats';
import type { BusiestKey, NodeStats } from './types';

const SORTS: [BusiestKey, string][] = [['in', 'Messages in'], ['ms', 'Mean time'], ['errors', 'Errors']];
const TOP = 30;

export type BusiestTabProps = {
  nodeStats?: Record<string, NodeStats>;
  /** names of the blocks on the canvas by id; a subflow inner block `s1/x` is named after the instance `s1` */
  nodeNames?: Record<string, string>;
  onReveal?: (nodeId: string) => void;
  selectedNodeId?: string | null;
};

export function BusiestTab({ nodeStats, nodeNames, onReveal, selectedNodeId }: BusiestTabProps) {
  const [key, setKey] = useState<BusiestKey>('in');
  const rows = useMemo(() => busiestRows(nodeStats, key).slice(0, TOP), [nodeStats, key]);
  const top = Math.max(1, ...rows.map((r) => r[key]));
  return (
    <div>
      <div role="group" aria-label="Sort by" className="mb-2 flex flex-wrap gap-1">
        {SORTS.map(([k, t]) => (
          <button
            key={k} type="button" data-testid={`insight-perf-${k}`} aria-pressed={k === key} onClick={() => setKey(k)}
            className={cn('rounded-md border px-2 py-1 text-xs font-medium',
              k === key ? 'border-primary bg-primary-subtle text-primary' : 'border-border text-text-secondary hover:bg-surface-sunken')}
          >{t}</button>
        ))}
      </div>
      {rows.length ? (
        <table data-testid="insight-perf-rows" className="w-full text-xs">
          <thead>
            <tr className="text-left text-text-secondary">
              {['Block', 'In', 'Out', 'Errors', 'ms'].map((h, i) => <th key={h} className={cn('py-1 font-medium', i && 'text-right')}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const root = rootNode(r.id);
              return (
                <tr key={r.id} data-selected={root === selectedNodeId || undefined} className={cn('border-t border-border', root === selectedNodeId && 'bg-primary-subtle')}>
                  <td className="py-1 pr-2">
                    <button type="button" title="Show this block" onClick={() => onReveal?.(root)} className="max-w-full truncate text-left font-medium text-text-primary hover:underline">
                      {nodeNames?.[root] ?? root}
                    </button>
                    <span aria-hidden="true" className="mt-0.5 block h-1 rounded-full bg-surface-sunken">
                      <span className="block h-full rounded-full bg-primary" style={{ width: `${barPct(r[key], top)}%` }} />
                    </span>
                  </td>
                  <td className="py-1 text-right tabular-nums">{r.in}</td>
                  <td className="py-1 text-right tabular-nums">{r.out}</td>
                  <td className="py-1 text-right tabular-nums">{r.errors ? <span className="font-semibold text-error">{r.errors}</span> : '0'}</td>
                  <td className="py-1 text-right tabular-nums">{r.ms ? r.ms.toFixed(1) : '–'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : <p className="text-xs text-text-secondary">No block has handled a message yet.</p>}
    </div>
  );
}
