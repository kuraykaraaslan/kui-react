'use client';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { clockMs, previewOf } from './format';
import { JsonTree } from './JsonTree';
import { NodeLink } from './parts';
import { filterRuns, framesOf, isProblemRun, markOf, type Frame, type RunRow, type RunStatus, type StatusFilter } from './runs';

/** The words of the panel; a host passes the ones it translates, the rest stay English. */
export type RunsLabels = {
  title: string; empty: string; filterLabel: string; all: string; failed: string; leftOpen: string; dropped: string;
  status: Record<RunStatus, string>;
  back: string; step: string; first: string; prev: string; next: string; last: string;
  trigger: string; input: string; sent: string; nothingSent: string; error: string; outputs: string; actions: string;
  noSteps: string; noBodies: string; showBlock: string; testStep: string;
  frame: (n: number, total: number) => string;
  summary: (steps: number, ms: number) => string;
};

export const DEFAULT_RUNS_LABELS: RunsLabels = {
  title: 'Runs', empty: 'No runs recorded.', filterLabel: 'Show runs', all: 'All runs', failed: 'Failed', leftOpen: 'Left open', dropped: 'Dropped',
  status: { ok: 'OK', error: 'Failed', left_open: 'Left open', dropped: 'Dropped' },
  back: 'All runs', step: 'Step', first: 'First step', prev: 'Previous step', next: 'Next step', last: 'Last step',
  trigger: 'Started with', input: 'In', sent: 'Sent on', nothingSent: 'Sent nothing', error: 'Error', outputs: 'Left the flow', actions: 'It did',
  noSteps: 'This run was kept without its steps; only the blocks it visited are known.',
  noBodies: 'Messages are shown only to people who may debug this flow.', showBlock: 'Show this block', testStep: 'Test with this input',
  frame: (n, total) => `${n} of ${total}`,
  summary: (steps, ms) => `${steps} steps, ${ms} ms`,
};

export type RunsPanelProps = {
  runs: RunRow[];
  /** block id to the name shown for it */
  nodeNames?: Record<string, string>;
  /** the block selected on the canvas: "This block" narrows the list to the runs that went through it */
  selectedNodeId?: string | null;
  /** the host hides message bodies from this viewer: the steps are listed without their messages */
  bodiesHidden?: boolean;
  /** show a block on the canvas */
  onReveal?: (nodeId: string) => void;
  /** what the player is on: the host marks the canvas (null when no run is open) */
  onMark?: (mark: { visited: string[]; current: string | null; failed: string | null } | null) => void;
  /** "Test with this input" on a frame; not given, the button is left out. `step` is 0 for the message that started the run */
  onTestInput?: (run: RunRow, step: number, node: string) => void;
  labels?: Partial<RunsLabels>;
  className?: string;
};

const TONE: Record<RunStatus, string> = {
  ok: 'bg-success-subtle text-success-fg', error: 'bg-error-subtle text-error-fg', left_open: 'bg-warning-subtle text-warning-fg', dropped: 'bg-surface-sunken text-text-secondary',
};

/**
 * The run history of one flow and a player that walks a run step by step (09 §9.5). The list is newest first; a run opens
 * into its steps with what went in and what each step sent, and the host can mark the canvas with the nodes the player has
 * passed. Plain props: the records come from the host, nothing here talks to an engine.
 */
export function RunsPanel({ runs, nodeNames, selectedNodeId, bodiesHidden, onReveal, onMark, onTestInput, labels, className }: RunsPanelProps) {
  const L = { ...DEFAULT_RUNS_LABELS, ...labels, status: { ...DEFAULT_RUNS_LABELS.status, ...labels?.status } };
  const [status, setStatus] = useState<StatusFilter>('all');
  const [thisBlock, setThisBlock] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  const shown = useMemo(() => filterRuns(runs, status, thisBlock ? selectedNodeId : null), [runs, status, thisBlock, selectedNodeId]);
  const open = openId ? runs.find((r) => r.run === openId) ?? null : null;
  const frames = useMemo(() => (open ? framesOf(open) : []), [open]);
  const name = (id: string) => nodeNames?.[id.split('/')[0]] ?? id;

  useEffect(() => {
    if (!onMark) return;
    onMark(open ? markOf(frames, index) : null);
  }, [open, frames, index, onMark]);
  useEffect(() => () => onMark?.(null), []); // eslint-disable-line react-hooks/exhaustive-deps

  function openRun(r: RunRow) {
    setOpenId(r.run);
    setIndex(0);
  }

  if (open) {
    const frame: Frame | undefined = frames[Math.min(index, frames.length - 1)];
    const at = Math.min(index, frames.length - 1);
    const nodeOfFrame = frame ? (frame.kind === 'step' ? frame.step.node : frame.node) : open.trigger.node;
    return (
      <section aria-label={L.title} className={cn('flex h-full min-h-0 flex-col bg-surface-raised', className)}>
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <button type="button" data-testid="runs-back" onClick={() => setOpenId(null)} className="text-sm text-primary hover:underline">← {L.back}</button>
          <span className={cn('ml-auto rounded-full px-2 py-0.5 text-xs font-medium', TONE[open.status])}>{L.status[open.status]}</span>
        </div>
        <div className="border-b border-border px-3 py-2 text-xs text-text-secondary">
          <div className="tabular-nums">{clockMs(open.ts / 1000)} · {L.summary(open.steps?.length ?? open.path.length, open.ms)}</div>
          <div>{open.msgType} · {open.originator.type}:{open.originator.id}</div>
        </div>
        <div className="flex items-center gap-1 border-b border-border px-3 py-1.5" role="group" aria-label={L.step}>
          <PlayBtn label={L.first} disabled={at <= 0} onClick={() => setIndex(0)}>«</PlayBtn>
          <PlayBtn label={L.prev} disabled={at <= 0} onClick={() => setIndex(at - 1)}>‹</PlayBtn>
          <span className="mx-2 text-xs tabular-nums text-text-secondary" data-testid="runs-frame">{L.frame(at + 1, frames.length)}</span>
          <PlayBtn label={L.next} disabled={at >= frames.length - 1} onClick={() => setIndex(at + 1)}>›</PlayBtn>
          <PlayBtn label={L.last} disabled={at >= frames.length - 1} onClick={() => setIndex(frames.length - 1)}>»</PlayBtn>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3 text-xs">
          {!open.steps?.length && <p className="mb-2 rounded-[var(--radius-md)] bg-warning-subtle p-2 text-warning-fg">{L.noSteps}</p>}
          {frame && (
            <div data-testid="runs-step">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <NodeLink title={L.showBlock} onClick={() => onReveal?.(nodeOfFrame)}>{frame.kind === 'trigger' ? `${L.trigger}: ${name(nodeOfFrame)}` : name(nodeOfFrame)}</NodeLink>
                {frame.kind === 'step' && <span className="tabular-nums text-text-secondary">{frame.step.ms} ms</span>}
              </div>
              {bodiesHidden && frame.kind !== 'path' ? <p className="text-text-secondary">{L.noBodies}</p> : (
                <>
                  {frame.kind === 'trigger' && <Block title={L.input}><JsonTree value={frame.in} /></Block>}
                  {frame.kind === 'step' && (
                    <>
                      <Block title={L.input}><JsonTree value={frame.step.in} /></Block>
                      {frame.step.error && <p className="mt-2 font-semibold text-error">{L.error}: {frame.step.error.code}: {frame.step.error.message}</p>}
                      <Block title={frame.step.out.length ? `${L.sent}: ${frame.step.out.map((o) => o.port).join(', ')}` : L.nothingSent}>
                        {frame.step.out.map((o, k) => (
                          <div key={k} className="mb-1.5">
                            <div className="text-text-secondary">{o.port}{o.to.length ? ` → ${o.to.map(name).join(', ')}` : ''}</div>
                            <JsonTree value={o.msg} />
                          </div>
                        ))}
                      </Block>
                    </>
                  )}
                </>
              )}
              {onTestInput && frame.kind !== 'path' && !bodiesHidden && (
                <button type="button" data-testid="runs-test" onClick={() => onTestInput(open, frame.kind === 'trigger' ? 0 : frame.step.i, nodeOfFrame)} className="mt-2 text-primary hover:underline">{L.testStep}</button>
              )}
            </div>
          )}
          {at === frames.length - 1 && open.outputs.length > 0 && !bodiesHidden && (
            <Block title={L.outputs}>{open.outputs.map((o, k) => <div key={k} className="mb-1.5"><div className="text-text-secondary">{name(o.node)}.{o.port}</div><JsonTree value={o.msg} /></div>)}</Block>
          )}
          {at === frames.length - 1 && open.errors.length > 0 && (
            <Block title={L.error}>{open.errors.map((e, k) => <p key={k} className="text-error">{name(e.node)}: {e.code}: {e.message}</p>)}</Block>
          )}
          {at === frames.length - 1 && open.actions.length > 0 && (
            <Block title={L.actions}>{open.actions.map((a, k) => <p key={k}>{name(a.node)}: {a.text}</p>)}</Block>
          )}
        </div>
      </section>
    );
  }

  return (
    <section aria-label={L.title} className={cn('flex h-full min-h-0 flex-col bg-surface-raised', className)}>
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <select aria-label={L.filterLabel} data-testid="runs-filter" value={status} onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="h-9 rounded-[var(--radius-md)] border border-border bg-surface-base px-2 text-sm text-text-primary">
          <option value="all">{L.all}</option>
          <option value="error">{L.failed}</option>
          <option value="left_open">{L.leftOpen}</option>
          <option value="dropped">{L.dropped}</option>
        </select>
        {selectedNodeId && (
          <label className="flex items-center gap-1.5 text-xs text-text-secondary">
            <input type="checkbox" data-testid="runs-this-block" checked={thisBlock} onChange={(e) => setThisBlock(e.target.checked)} />
            {name(selectedNodeId)}
          </label>
        )}
      </div>
      <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-2" data-testid="runs-list">
        {shown.map((r) => (
          <li key={r.run}>
            <button type="button" data-testid="runs-item" data-status={r.status} onClick={() => openRun(r)}
              className={cn('w-full rounded-[var(--radius-md)] border border-border bg-surface-base px-2 py-1.5 text-left text-xs hover:border-primary', isProblemRun(r) && 'border-l-[3px] border-l-error')}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="tabular-nums text-text-secondary">{clockMs(r.ts / 1000)}</span>
                <span className={cn('rounded-full px-1.5 py-0.5 text-[0.6875rem] font-medium', TONE[r.status])}>{L.status[r.status]}</span>
              </div>
              <div className="mt-0.5 text-text-primary">{r.msgType} · {r.originator.type}:{r.originator.id}</div>
              <div className="text-text-secondary">{L.summary(r.steps?.length ?? r.path.length, r.ms)}{r.errors[0] ? ` · ${previewOf(r.errors[0].message)}` : ''}</div>
            </button>
          </li>
        ))}
        {!shown.length && <li className="p-2 text-sm text-text-secondary">{L.empty}</li>}
      </ul>
    </section>
  );
}

function PlayBtn({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-base text-base text-text-primary disabled:opacity-40">
      {children}
    </button>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-2">
      <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-[.08em] text-text-secondary">{title}</p>
      <div className="rounded-[var(--radius-md)] border border-border bg-surface-base p-2">{children}</div>
    </div>
  );
}
