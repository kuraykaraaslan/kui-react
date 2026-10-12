'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Ic } from './Ic';
import { faCirclePause, faCopy, faFloppyDisk, faTrash } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import { emptyLog, exportFileName, exportText, filterLog, messageText, readNew, type DebugLog } from './debug-log';
import { clockMs, isProblem, plainMsg, typeName } from './format';
import { JsonTree } from './JsonTree';
import { useMessages } from '../messages';
import { chevron, iconBtn, selectCls } from './parts';
import { rootNode } from './stats';
import type { DebugKindFilter, DebugMessage } from './types';

export type DebugTabProps = {
  /** the host ring: it keeps every message, also while this tab is paused */
  messages?: DebugMessage[];
  chainId?: string | null;
  nodeNames?: Record<string, string>;
  selectedNodeId?: string | null;
  /** the flow that is open: "This flow" shows only its messages (the host ring may hold other flows too) */
  flowId?: string | null;
  onReveal?: (nodeId: string) => void;
  /** told what the user did, e.g. to show a toast: 'saved', 'copied' or 'empty' */
  onNotice?: (kind: 'saved' | 'copied' | 'empty', count: number) => void;
};

/* the router's link and copy buttons inside a card keep the theme's 40 px minimum height; the card is as tall as the router's */
const metaBtn = 'inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] border-0 bg-transparent p-0 font-[inherit] cursor-pointer';

/** Saves the text as a file; where the browser blocks a download it is copied instead. Returns what happened. */
export function saveText(body: string, fileName: string): 'saved' | 'copied' {
  try {
    const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    return 'saved';
  } catch {
    try { void navigator.clipboard?.writeText(body).catch(() => undefined); } catch { /* clipboard blocked */ }
    return 'copied';
  }
}

export function DebugTab({ messages, chainId, nodeNames, selectedNodeId, flowId, onReveal, onNotice }: DebugTabProps) {
  const m = useMessages();
  const kinds: [DebugKindFilter, string][] = [['all', m.insKindAll], ['problem', m.insKindProblem], ['msg', m.insKindMsg]];
  const [paused, setPaused] = useState(false);
  const [kind, setKind] = useState<DebugKindFilter>('all');
  const [source, setSource] = useState<'flow' | 'node' | 'all'>('flow');
  const [log, setLog] = useState<DebugLog>(emptyLog);
  const [cleared, setCleared] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const follow = useRef(true);

  /* read new messages of the host ring; paused reads nothing, resuming reads what came meanwhile */
  const next = readNew(log, messages ?? [], paused);
  if (next !== log) setLog(next);

  const shown = useMemo(
    () => filterLog(log.items, kind, source === 'node' ? { selected: selectedNodeId ?? null } : undefined, source === 'flow' && flowId ? { flowId } : undefined),
    [log, kind, source, selectedNodeId, flowId],
  );

  /* follow the newest while scrolled to the bottom */
  useEffect(() => {
    const el = listRef.current;
    if (el && follow.current) el.scrollTop = el.scrollHeight;
  }, [shown]);

  const who = (x: DebugMessage) => nodeNames?.[rootNode(x.node)] ?? (x.name || x.node);

  function download() {
    const body = exportText(shown, who);
    if (!body) return onNotice?.('empty', 0);
    onNotice?.(saveText(body, exportFileName(chainId)), shown.length);
  }

  function copy(text: string, count: number) {
    void copyText(text).then((ok) => onNotice?.(ok ? 'copied' : 'empty', ok ? count : 0));
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <select aria-label={m.insSourceLabel} data-testid="insight-dbg-source" value={source} onChange={(e) => setSource(e.target.value as 'flow' | 'node' | 'all')}
          className={selectCls} style={{ backgroundImage: chevron }}>
          <option value="flow">{m.insScopeFlow}</option>
          <option value="node">{m.insSelectedBlock}</option>
          <option value="all">{m.insScopeAllFlows}</option>
        </select>
        <select aria-label={m.insKindLabel} data-testid="insight-dbg-kind" value={kind} onChange={(e) => setKind(e.target.value as DebugKindFilter)}
          className={selectCls} style={{ backgroundImage: chevron }}>
          {kinds.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
        <div className="ml-auto flex gap-2">
          <button type="button" data-testid="insight-dbg-pause" aria-pressed={paused} aria-label={paused ? m.insResume : m.insPause}
            title={paused ? m.insResume : m.insPause} onClick={() => setPaused((p) => !p)}
            className={cn(iconBtn, paused && 'border-primary bg-primary-subtle text-primary hover:bg-primary-subtle')}>
            <Ic icon={faCirclePause} />
          </button>
          <button type="button" data-testid="insight-dbg-save" aria-label={m.insSave} title={m.insSave} onClick={download} className={iconBtn}>
            <Ic icon={faFloppyDisk} />
          </button>
          <button type="button" data-testid="insight-dbg-copy-all" aria-label={m.insCopyAll} title={m.insCopyAll} className={iconBtn}
            onClick={() => { const body = exportText(shown, who); if (!body) onNotice?.('empty', 0); else copy(body, shown.length); }}>
            <Ic icon={faCopy} />
          </button>
          <button type="button" data-testid="insight-dbg-clear" aria-label={m.insClear} title={m.insClear}
            onClick={() => { setLog((l) => ({ items: [], lastSeq: l.lastSeq })); setCleared((c) => c + 1); }} className={iconBtn}>
            <Ic icon={faTrash} />
          </button>
        </div>
      </div>
      <div
        ref={listRef} role="log" aria-live="polite" data-testid="insight-dbg-list" data-cleared={cleared}
        onScroll={(e) => { const el = e.currentTarget; follow.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24; }}
        className="min-h-0 flex-1 overflow-y-auto p-2"
      >
        {shown.length ? shown.map((x) => (
          <div key={x.seq} data-kind={x.kind} className={cn(
            'mb-1.5 rounded-[var(--radius-md)] border border-l-[3px] border-border border-l-primary bg-surface-base px-2 pb-2 pt-1.5 text-[0.75rem] leading-normal',
            x.kind === 'error' && 'border-l-error bg-error-subtle', x.kind === 'warn' && 'border-l-warning bg-warning-subtle')}>
            <div className="flex items-baseline justify-between gap-2 text-[0.6875rem] leading-normal text-text-secondary">
              <span className="tabular-nums">{clockMs(x.ts)}</span>
              <button type="button" title={m.insShowBlock} onClick={() => onReveal?.(rootNode(x.node))}
                className={cn(metaBtn, 'ml-auto max-w-[60%] overflow-hidden text-ellipsis text-primary hover:underline')}>{x.flow && flowId && x.flow !== flowId ? `${x.flow} / ${who(x)}` : who(x)}</button>
              <button type="button" data-testid="insight-dbg-copy" aria-label={m.insCopyOne} title={m.insCopyOne} onClick={() => copy(messageText(x, who(x)), 1)}
                className={cn(metaBtn, 'flex-none px-0.5 text-xs font-medium leading-none text-text-secondary hover:text-primary focus-visible:text-primary')}>
                <Ic icon={faCopy} />
              </button>
            </div>
            {isProblem(x)
              ? <div className={cn('mt-1', x.kind === 'error' ? 'font-semibold text-error' : 'text-text-primary')}>{x.text || ''}</div>
              : (
                <div className="mb-1 mt-0.5 text-[0.6875rem] leading-normal text-text-secondary">
                  <span className="font-mono text-[0.875em]">{x.prop || 'msg'}</span> : {x.truncated ? m.insCut(x.size ?? 0) : typeName(x.msg)}
                  {x.topic != null && x.topic !== '' && <span> · {m.insTopic} <span className="font-mono text-[0.875em]">{String(x.topic)}</span></span>}
                </div>
              )}
            {x.kind !== 'warn' && (
              <div className="break-words font-mono text-[0.75rem] leading-[1.45]">
                {x.truncated ? <span className="whitespace-pre-wrap text-success-fg">{String(x.msg)}</span> : <JsonTree value={x.kind === 'error' ? plainMsg(x.msg) : x.msg} />}
              </div>
            )}
          </div>
        )) : (
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border p-4 text-center text-xs text-text-secondary">
            {source === 'node' && !selectedNodeId ? m.insSelectBlock : m.insNoMessages}
          </div>
        )}
      </div>
    </div>
  );
}

/** the clipboard where the browser has it, else a hidden field and `execCommand` (over plain http the clipboard API is missing) */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
  } catch { /* fall through to the field */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.readOnly = true;
    ta.style.cssText = 'position:fixed;top:-100px;left:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch { return false; }
}
