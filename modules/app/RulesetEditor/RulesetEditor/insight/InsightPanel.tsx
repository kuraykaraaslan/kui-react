'use client';
import { useId, useState } from 'react';
import { Ic } from './Ic';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBug, faGaugeHigh, faTableList, faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import { MessagesProvider, useMergedMessages, useMessages, type EditorMessages } from '../messages';
import { BusiestTab } from './BusiestTab';
import { DataTab, type DataTabProps } from './DataTab';
import { DebugTab, type DebugTabProps } from './DebugTab';
import { ErrorsTab } from './ErrorsTab';
import { aggregateErrors } from './stats';
import type { NodeStats, RunRecord } from './types';

export type InsightTabId = 'debug' | 'busiest' | 'errors' | 'data';

export type InsightPanelProps = DataTabProps & Pick<DebugTabProps, 'messages' | 'chainId' | 'nodeNames' | 'selectedNodeId' | 'flowId' | 'onReveal' | 'onNotice'> & {
  /** counters per block id, supplied by the host (a subflow inner block is `instance/inner`) */
  nodeStats?: Record<string, NodeStats>;
  /** the run history, for the errors something caught */
  runs?: RunRecord[];
  defaultTab?: InsightTabId;
  /** shows the close button at the end of the tab strip (the router's side bar has one); the host hides the panel */
  onClose?: () => void;
  /** the words of the panel, to translate it (named apart: `messages` is the debug messages here); see `EditorMessages` */
  uiMessages?: Partial<EditorMessages>;
  className?: string;
};

/** A standalone side panel the host places next to the editor: Debug, Busiest, Errors and Data. It is driven by
 *  props; `onReveal(nodeId)` is called with the block on the canvas to select and show (call the editor's select /
 *  reveal there). */
export function InsightPanel(p: InsightPanelProps) {
  const m = useMergedMessages(p.uiMessages);
  return <MessagesProvider value={m}><InsightBody {...p} /></MessagesProvider>;
}

const ICONS: Record<InsightTabId, IconDefinition> = { debug: faBug, errors: faTriangleExclamation, data: faTableList, busiest: faGaugeHigh };

function InsightBody(p: InsightPanelProps) {
  const m = useMessages();
  /* the order of the router's side bar: Debug, Errors, Data, Busiest */
  const tabs: [InsightTabId, string][] = [['debug', m.insTabDebug], ['errors', m.insTabErrors], ['data', m.insTabData], ['busiest', m.insTabBusiest]];
  const [tab, setTab] = useState<InsightTabId>(p.defaultTab ?? 'debug');
  const uid = useId();
  const errCount = aggregateErrors(p.messages).length;
  /* messages that came while another tab was open, counted on the Debug tab until it is opened (as the router does) */
  const lastSeq = (p.messages ?? []).reduce((n, x) => Math.max(n, x.seq), 0);
  const [seenSeq, setSeenSeq] = useState(lastSeq);
  if (tab === 'debug' && seenSeq !== lastSeq) setSeenSeq(lastSeq);
  const unseen = tab === 'debug' ? 0 : (p.messages ?? []).filter((x) => x.seq > seenSeq).length;
  const counts: Partial<Record<InsightTabId, { n: number; error?: boolean }>> = { debug: { n: unseen }, errors: { n: errCount, error: true } };
  return (
    <aside aria-label={m.insPanel} className={cn('flex h-full min-h-0 flex-col overflow-hidden border-l border-border bg-surface-raised', p.className)}>
      <div role="tablist" className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-border px-2 pt-1.5">
        {tabs.map(([id, label]) => {
          const on = tab === id, count = counts[id];
          return (
            <button
              key={id} type="button" role="tab" id={`${uid}-${id}`} aria-selected={on} aria-controls={`${uid}-panel`} data-testid={`insight-tab-${id}`}
              title={label} aria-label={label} onClick={() => setTab(id)}
              className={cn('-mb-px inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-t-[var(--radius-md)] border px-2.5 py-2 text-[0.8125rem] font-semibold leading-normal focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-focus',
                on ? 'border-border border-b-surface-raised bg-surface-raised text-primary' : 'border-transparent bg-transparent text-text-secondary hover:text-text-primary')}
            >
              <Ic icon={ICONS[id]} size=".8rem" />
              {on && <span>{label}</span>}
              {count && count.n > 0 && (
                <span data-testid={id === 'errors' ? 'insight-err-count' : 'insight-dbg-count'}
                  className={cn('min-w-[1.1rem] rounded-full px-[.3rem] text-center text-[0.625rem] leading-[1.1rem] text-primary-fg', count.error ? 'bg-error' : 'bg-primary')}>{count.n > 99 ? '99+' : count.n}</span>
              )}
            </button>
          );
        })}
        <span className="flex-1" />
        {p.onClose && (
          <button type="button" data-testid="insight-close" aria-label={m.panelClose} title={m.panelClose} onClick={p.onClose}
            className="inline-flex h-9 min-h-9 w-9 min-w-9 flex-none items-center justify-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface-base p-1 text-sm font-medium leading-[1.25] text-text-primary hover:bg-surface-overlay focus-visible:outline-2 focus-visible:outline-border-focus">
            <Ic icon={faXmark} />
          </button>
        )}
      </div>
      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-${tab}`} className="flex min-h-0 flex-1 flex-col">
        {tab === 'debug' && <DebugTab messages={p.messages} chainId={p.chainId} nodeNames={p.nodeNames} selectedNodeId={p.selectedNodeId} flowId={p.flowId} onReveal={p.onReveal} onNotice={p.onNotice} />}
        {tab !== 'debug' && (
          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-2 text-xs leading-normal">
            {tab === 'busiest' && <BusiestTab nodeStats={p.nodeStats} nodeNames={p.nodeNames} onReveal={p.onReveal} selectedNodeId={p.selectedNodeId} />}
            {tab === 'errors' && <ErrorsTab messages={p.messages} runs={p.runs} nodeStats={p.nodeStats} nodeNames={p.nodeNames} onReveal={p.onReveal} />}
            {tab === 'data' && <DataTab events={p.events} onUseAsTrigger={p.onUseAsTrigger} context={p.context} contextKeys={p.contextKeys} contextError={p.contextError} flowSaved={p.flowSaved} canEditContext={p.canEditContext} onContextLoad={p.onContextLoad} onContextEdit={p.onContextEdit} onContextDelete={p.onContextDelete} defaultSegment={p.defaultSegment} />}
          </div>
        )}
      </div>
    </aside>
  );
}
