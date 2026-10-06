'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePause, faFloppyDisk, faTrash } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import { emptyLog, exportFileName, exportText, filterLog, readNew, type DebugLog } from './debug-log';
import { rootNode } from './stats';
import type { DebugKindFilter, DebugMessage } from './types';

export type DebugTabProps = {
  /** the host ring: it keeps every message, also while this tab is paused */
  messages?: DebugMessage[];
  chainId?: string | null;
  nodeNames?: Record<string, string>;
  selectedNodeId?: string | null;
  onReveal?: (nodeId: string) => void;
  /** told what the user did, e.g. to show a toast: 'saved', 'copied' or 'empty' */
  onNotice?: (kind: 'saved' | 'copied' | 'empty', count: number) => void;
};

const KINDS: [DebugKindFilter, string][] = [['all', 'All kinds'], ['problem', 'Errors and warnings'], ['msg', 'Messages only']];

const iconBtn = 'inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-secondary hover:bg-surface-sunken';

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

export function DebugTab({ messages, chainId, nodeNames, selectedNodeId, onReveal, onNotice }: DebugTabProps) {
  const [paused, setPaused] = useState(false);
  const [kind, setKind] = useState<DebugKindFilter>('all');
  const [nodeOnly, setNodeOnly] = useState(false);
  const [log, setLog] = useState<DebugLog>(emptyLog);
  const [cleared, setCleared] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const follow = useRef(true);

  /* read new messages of the host ring; paused reads nothing, resuming reads what came meanwhile */
  const next = readNew(log, messages ?? [], paused);
  if (next !== log) setLog(next);

  const shown = useMemo(() => filterLog(log.items, kind, nodeOnly ? { selected: selectedNodeId ?? null } : undefined), [log, kind, nodeOnly, selectedNodeId]);

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

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <select aria-label="Kind of messages" data-testid="insight-dbg-kind" value={kind} onChange={(e) => setKind(e.target.value as DebugKindFilter)}
          className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-text-primary">
          {KINDS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
        </select>
        <label className="flex items-center gap-1 text-xs text-text-secondary">
          <input type="checkbox" checked={nodeOnly} onChange={(e) => setNodeOnly(e.target.checked)} data-testid="insight-dbg-node" /> Selected block
        </label>
        <span className="flex-1" />
        <button type="button" data-testid="insight-dbg-pause" aria-pressed={paused} aria-label={paused ? 'Resume the messages' : 'Pause the messages'}
          title={paused ? 'Resume the messages' : 'Pause the messages'} onClick={() => setPaused((p) => !p)}
          className={cn(iconBtn, paused && 'border-primary bg-primary-subtle text-primary')}>
          <FontAwesomeIcon icon={faCirclePause} className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <button type="button" data-testid="insight-dbg-save" aria-label="Save the messages as a file" title="Save the messages as a file" onClick={download} className={iconBtn}>
          <FontAwesomeIcon icon={faFloppyDisk} className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <button type="button" data-testid="insight-dbg-clear" aria-label="Clear the messages" title="Clear the messages"
          onClick={() => { setLog((l) => ({ items: [], lastSeq: l.lastSeq })); setCleared((c) => c + 1); }} className={iconBtn}>
          <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      <div
        ref={listRef} role="log" aria-live="polite" data-testid="insight-dbg-list" data-cleared={cleared}
        onScroll={(e) => { const el = e.currentTarget; follow.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24; }}
        className="min-h-0 flex-1 space-y-1.5 overflow-y-auto"
      >
        {shown.length ? shown.map((x) => (
          <div key={x.seq} data-kind={x.kind} className={cn('rounded-md border p-2 text-xs',
            x.kind === 'error' ? 'border-error bg-error-subtle' : x.kind === 'warn' ? 'border-warning bg-warning-subtle' : 'border-border')}>
            <div className="flex items-center gap-2">
              <span className="tabular-nums text-text-secondary">{new Date(x.ts * 1000).toLocaleTimeString()}</span>
              <button type="button" title="Show this block" onClick={() => onReveal?.(rootNode(x.node))} className="truncate font-medium text-text-primary hover:underline">{who(x)}</button>
            </div>
            {x.kind === 'msg'
              ? <pre className="mt-1 whitespace-pre-wrap break-all font-mono text-[11px] text-text-secondary">{x.prop || 'msg'} = {typeof x.msg === 'string' ? x.msg : JSON.stringify(x.msg)}</pre>
              : <p className="mt-1">{x.text}</p>}
          </div>
        )) : <p className="text-xs text-text-secondary">{nodeOnly && !selectedNodeId ? 'Select a block on the canvas.' : 'No messages yet.'}</p>}
      </div>
    </div>
  );
}
