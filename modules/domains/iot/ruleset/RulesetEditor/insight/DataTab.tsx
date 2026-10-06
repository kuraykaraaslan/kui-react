'use client';
import { useState } from 'react';
import { FillBar } from './FillBar';
import { fillOf } from './stats';
import type { ContextScope, ContextStore, ContextUsage } from './types';

export type DataTabProps = {
  /** bytes and limit per store, for the store of all flows together; nothing given, no bar */
  context?: Partial<Record<ContextStore, ContextUsage>>;
};

const SCOPES: [ContextScope, string][] = [['flow', 'This flow'], ['global', 'Global'], ['sys', 'System (read only)']];
const STORES: [ContextStore, string][] = [['memory', 'Memory'], ['persist', 'Kept across restarts']];

const selectCls = 'rounded-md border border-border bg-surface px-2 py-1 text-xs text-text-primary';

export function DataTab({ context }: DataTabProps) {
  const [scope, setScope] = useState<ContextScope>('flow');
  const [store, setStore] = useState<ContextStore>('memory');
  const u = context?.[store];
  const fill = scope === 'sys' ? null : fillOf(u?.bytes, u?.limit);
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        <select aria-label="Scope" data-testid="insight-ctx-scope" value={scope} onChange={(e) => setScope(e.target.value as ContextScope)} className={selectCls}>
          {SCOPES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
        {scope !== 'sys' && (
          <select aria-label="Store" data-testid="insight-ctx-store" value={store} onChange={(e) => setStore(e.target.value as ContextStore)} className={selectCls}>
            {STORES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
        )}
      </div>
      {fill ? <FillBar fill={fill} /> : <p className="text-xs text-text-secondary">{scope === 'sys' ? 'The system scope has no limit.' : 'No size numbers from the host.'}</p>}
    </div>
  );
}
