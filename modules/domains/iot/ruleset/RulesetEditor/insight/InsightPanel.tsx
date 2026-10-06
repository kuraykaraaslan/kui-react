'use client';
import { useId, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { BusiestTab } from './BusiestTab';
import { DataTab, type DataTabProps } from './DataTab';
import { DebugTab, type DebugTabProps } from './DebugTab';
import { ErrorsTab } from './ErrorsTab';
import { aggregateErrors } from './stats';
import type { NodeStats, RunRecord } from './types';

export type InsightTabId = 'debug' | 'busiest' | 'errors' | 'data';

export type InsightPanelProps = DataTabProps & Pick<DebugTabProps, 'messages' | 'chainId' | 'nodeNames' | 'selectedNodeId' | 'onReveal' | 'onNotice'> & {
  /** counters per block id, supplied by the host (a subflow inner block is `instance/inner`) */
  nodeStats?: Record<string, NodeStats>;
  /** the run history, for the errors something caught */
  runs?: RunRecord[];
  defaultTab?: InsightTabId;
  className?: string;
};

const TABS: [InsightTabId, string][] = [['debug', 'Debug'], ['busiest', 'Busiest'], ['errors', 'Errors'], ['data', 'Data']];

/** A standalone side panel the host places next to the editor: Debug, Busiest, Errors and Data. It is driven by
 *  props; `onReveal(nodeId)` is called with the block on the canvas to select and show (call the editor's select /
 *  reveal there). */
export function InsightPanel(p: InsightPanelProps) {
  const [tab, setTab] = useState<InsightTabId>(p.defaultTab ?? 'debug');
  const uid = useId();
  const errCount = aggregateErrors(p.messages).length;
  return (
    <aside aria-label="Runtime insight" className={cn('flex h-full min-h-0 flex-col rounded-xl border border-border bg-surface', p.className)}>
      <div role="tablist" className="flex gap-1 border-b border-border p-1.5">
        {TABS.map(([id, label]) => (
          <button
            key={id} type="button" role="tab" id={`${uid}-${id}`} aria-selected={tab === id} aria-controls={`${uid}-panel`} data-testid={`insight-tab-${id}`}
            onClick={() => setTab(id)}
            className={cn('rounded-md px-2.5 py-1 text-xs font-medium', tab === id ? 'bg-primary-subtle text-primary' : 'text-text-secondary hover:bg-surface-sunken')}
          >
            {label}
            {id === 'errors' && errCount > 0 && <span data-testid="insight-err-count" className="ml-1 rounded-full bg-error px-1.5 text-[10px] text-white">{errCount > 99 ? '99+' : errCount}</span>}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-${tab}`} className="min-h-0 flex-1 overflow-y-auto p-2.5">
        {tab === 'debug' && <DebugTab messages={p.messages} chainId={p.chainId} nodeNames={p.nodeNames} selectedNodeId={p.selectedNodeId} onReveal={p.onReveal} onNotice={p.onNotice} />}
        {tab === 'busiest' && <BusiestTab nodeStats={p.nodeStats} nodeNames={p.nodeNames} onReveal={p.onReveal} selectedNodeId={p.selectedNodeId} />}
        {tab === 'errors' && <ErrorsTab messages={p.messages} runs={p.runs} nodeStats={p.nodeStats} nodeNames={p.nodeNames} onReveal={p.onReveal} />}
        {tab === 'data' && <DataTab context={p.context} />}
      </div>
    </aside>
  );
}
