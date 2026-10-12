'use client';
import { useState } from 'react';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import { FillBar } from './FillBar';
import { Ic } from './Ic';
import { JsonTree } from './JsonTree';
import { useMessages } from '../messages';
import { btnCls, chevron, iconBtn, selectCls } from './parts';
import { clock, fillOf } from './stats';
import { previewOf } from './format';
import type { ContextScope, ContextStore, ContextUsage, EventRecord } from './types';

export type DataTabProps = {
  /** what happened lately, newest first; none given, the list says there are no events */
  events?: EventRecord[];
  /** turns an event into a trigger block; not given (a flow that cannot be changed), the buttons are left out */
  onUseAsTrigger?: (event: EventRecord) => void;
  /** bytes and limit per store, for the store of all flows together; nothing given, no bar */
  context?: Partial<Record<ContextStore, ContextUsage>>;
  /** the keys the host read for the chosen scope and store; `undefined` while it loads */
  contextKeys?: Record<string, unknown>;
  /** the host's text when it could not read them */
  contextError?: string;
  /** false until the flow has been saved: a flow's own context has no home before that */
  flowSaved?: boolean;
  /** may the user change and delete keys (the administrator, and never the system scope) */
  canEditContext?: boolean;
  /** told when the scope or store changes, on a reload and when Context is opened: read the keys again */
  onContextLoad?: (scope: ContextScope, store: ContextStore) => void;
  /** the user wants to change the value of a key: the host asks for the new value */
  onContextEdit?: (key: string, value: unknown, scope: ContextScope, store: ContextStore) => void;
  /** the user wants to delete a key: the host asks to confirm */
  onContextDelete?: (key: string, scope: ContextScope, store: ContextStore) => void;
  /** the part that is open first */
  defaultSegment?: 'events' | 'context';
};

const seg = 'inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-[var(--radius-md)] border px-2 py-1.5 text-xs leading-normal transition-colors';
const small = 'px-2 py-0.5 text-[0.6875rem] leading-[1.25]';

export function DataTab({ events, onUseAsTrigger, context, contextKeys, contextError, flowSaved = true, canEditContext, onContextLoad, onContextEdit, onContextDelete, defaultSegment = 'events' }: DataTabProps) {
  const m = useMessages();
  const scopes: [ContextScope, string][] = [['flow', m.insScopeFlow], ['global', m.insScopeGlobal], ['sys', m.insScopeSys]];
  const stores: [ContextStore, string][] = [['memory', m.insStoreMemory], ['persist', m.insStorePersist]];
  const [part, setPart] = useState<'events' | 'context'>(defaultSegment);
  const [scope, setScope] = useState<ContextScope>('flow');
  const [store, setStore] = useState<ContextStore>('memory');
  const u = context?.[store];
  const fill = scope === 'sys' ? null : fillOf(u?.bytes, u?.limit);
  const open = (p: 'events' | 'context') => { setPart(p); if (p === 'context') onContextLoad?.(scope, store); };
  const keys = contextKeys && Object.entries(contextKeys);
  const note = 'mb-4 text-xs leading-normal text-text-secondary';
  return (
    <div>
      <div className="mb-2 flex gap-1">
        {([['events', m.insSegEvents], ['context', m.insSegContext]] as const).map(([id, text]) => (
          <button key={id} type="button" data-testid={`insight-data-${id}`} aria-pressed={part === id} onClick={() => open(id)}
            className={cn(seg, part === id ? 'border-primary bg-primary-subtle text-primary' : 'border-border bg-surface-base text-text-secondary')}>{text}</button>
        ))}
      </div>

      {part === 'events' && (
        <>
          <p className={note}>{m.insEventsHint}</p>
          {events?.length ? (
            <div data-testid="insight-events">
              {events.map((e) => (
                <div key={e.seq} className="mb-1.5 rounded-[var(--radius-md)] border border-border bg-surface-base px-2 py-1.5">
                  <div className="flex items-center justify-between gap-2 text-[0.6875rem] leading-normal text-text-secondary">
                    <span className="tabular-nums">{clock(e.ts)}</span>
                    <span className="font-mono text-[0.875em]">{`${e.source}/${e.kind}`}</span>
                    <span className="flex-1" />
                    {onUseAsTrigger && <button type="button" data-testid="insight-event-use" onClick={() => onUseAsTrigger(e)} className={cn(btnCls, small)}>{m.insUseTrigger}</button>}
                  </div>
                  <details className="mt-0.5">
                    <summary className="cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-text-secondary">{previewOf(e.data)}</summary>
                    <div className="break-words font-mono text-xs leading-[1.45]"><JsonTree value={e.data} depth={1} /></div>
                  </details>
                </div>
              ))}
            </div>
          ) : <p className={note}>{m.insNoEvents}</p>}
        </>
      )}

      {part === 'context' && (
        <>
          <div className="flex flex-wrap items-center gap-2 py-1.5">
            <select aria-label={m.insScope} data-testid="insight-ctx-scope" value={scope} style={{ backgroundImage: chevron }} className={selectCls}
              onChange={(e) => { const v = e.target.value as ContextScope; setScope(v); onContextLoad?.(v, store); }}>
              {scopes.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
            </select>
            {scope !== 'sys' && (
              <select aria-label={m.insStore} data-testid="insight-ctx-store" value={store} style={{ backgroundImage: chevron }} className={selectCls}
                onChange={(e) => { const v = e.target.value as ContextStore; setStore(v); onContextLoad?.(scope, v); }}>
                {stores.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
              </select>
            )}
            <button type="button" data-testid="insight-ctx-reload" aria-label={m.insReload} title={m.insReload} onClick={() => onContextLoad?.(scope, store)} className={iconBtn}>
              <Ic icon={faRotate} />
            </button>
          </div>
          {fill && <FillBar fill={fill} />}
          {contextError ? <p className="mt-1 text-text-primary">{contextError}</p>
            : !keys ? <p className={note}>{scope === 'flow' && !flowSaved ? m.insSaveFirst : m.insLoading}</p>
            : !keys.length ? <p className={note}>{m.insNothingStored}</p>
            : (
              <div data-testid="insight-ctx">
                {keys.map(([k, v]) => (
                  <div key={k} className="mb-1.5 rounded-[var(--radius-md)] border border-border bg-surface-base px-2 py-1.5">
                    <div className="flex items-center justify-between gap-2 text-[0.6875rem] leading-normal text-text-secondary">
                      <span className="font-mono text-[0.875em]">{k}</span>
                      <span className="flex-1" />
                      {canEditContext && scope !== 'sys' && (
                        <>
                          <button type="button" data-testid="insight-ctx-edit" onClick={() => onContextEdit?.(k, v, scope, store)} className={cn(btnCls, small)}>{m.insChange}</button>
                          <button type="button" data-testid="insight-ctx-delete" onClick={() => onContextDelete?.(k, scope, store)}
                            className={cn(btnCls, small, 'border-error bg-error text-white hover:bg-error')}>{m.insDeleteKey}</button>
                        </>
                      )}
                    </div>
                    <div className="break-words font-mono text-xs leading-[1.45]"><JsonTree value={v} /></div>
                  </div>
                ))}
              </div>
            )}
          {!canEditContext && scope !== 'sys' && <p className={note}>{m.insAdminOnly}</p>}
        </>
      )}
    </div>
  );
}
