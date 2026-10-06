import type { BusiestKey, BusiestRow, CaughtError, ContextFill, ErrorRow, DebugMessage, NodeStats, RunRecord } from './types';

/** `s1/x` and `a/b/x` are shown on the instance block `s1` / `a` of this canvas */
export function rootNode(id: string | null | undefined): string {
  return String(id ?? '').split('/')[0];
}

function outTotal(out: NodeStats['out']): number {
  if (out && typeof out === 'object') return Object.values(out).reduce((a, b) => a + (Number(b) || 0), 0);
  return Number(out) || 0;
}

/** Busiest blocks, biggest first by `key`; blocks that saw nothing are left out. Ties go to more messages in,
 *  then to the id. */
export function busiestRows(nodes: Record<string, NodeStats> | null | undefined, key: BusiestKey): BusiestRow[] {
  const rows: BusiestRow[] = [];
  for (const [id, n] of Object.entries(nodes ?? {})) {
    if (!n) continue;
    const row: BusiestRow = { id, in: Number(n.in) || 0, out: outTotal(n.out), errors: Number(n.errors) || 0, ms: Number(n.avgMs) || 0 };
    if (row.in || row.out || row.errors) rows.push(row);
  }
  return rows.sort((a, b) => (b[key] - a[key]) || (b.in - a.in) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/** width of the bar of a row, 0..100, against the biggest value shown */
export function barPct(value: number, top: number): number {
  return Math.round((100 * value) / Math.max(1, top));
}

/** A cheap signature of the counters, so a host can redraw only when something moved. */
export function statsSignature(nodes: Record<string, NodeStats> | null | undefined, key: string): string {
  return JSON.stringify(Object.values(nodes ?? {}).map((n) => n ?? 0)) + key;
}

/** The same error text on the same block is one row with a count; newest first. Only `error` messages count. */
export function aggregateErrors(items: DebugMessage[] | null | undefined): ErrorRow[] {
  const rows = new Map<string, ErrorRow>();
  for (const x of items ?? []) {
    if (x.kind !== 'error') continue;
    const k = `${x.flow ?? ''}\u0000${x.node}\u0000${x.text ?? ''}`;
    let r = rows.get(k);
    if (!r) rows.set(k, r = { flow: x.flow ?? '', node: x.node, name: x.name ?? '', text: x.text ?? '', count: 0, first: x.ts, last: x.ts });
    r.count++;
    r.first = Math.min(r.first, x.ts);
    r.last = Math.max(r.last, x.ts);
  }
  return [...rows.values()].sort((a, b) => b.last - a.last);
}

/** Errors of the run history that something caught: one row per block, text and catcher. `caught` is the block that
 *  took the error: a catch block, or the block itself when its own error port did. */
export function caughtRows(runs: RunRecord[] | null | undefined): CaughtError[] {
  const rows = new Map<string, CaughtError>();
  for (const run of runs ?? [])
    for (const e of run.errors ?? []) {
      if (!e || e.caught == null || e.caught === '') continue;
      const text = e.message || e.code || '';
      const k = `${e.node} ${text} ${e.caught}`;
      let r = rows.get(k);
      if (!r) rows.set(k, r = { node: e.node, text, caught: e.caught, count: 0, last: run.ts ?? 0 });
      r.count++;
      r.last = Math.max(r.last, run.ts ?? 0);
    }
  return [...rows.values()].sort((a, b) => b.last - a.last);
}

/** Bytes against a limit. No numbers (or a limit of zero), no bar: null. Yellow from 80 percent, red at 100. */
export function fillOf(bytes: number | null | undefined, limit: number | null | undefined): ContextFill | null {
  if (!(Number(limit) > 0) || !(Number(bytes) >= 0)) return null;
  const b = Number(bytes), l = Number(limit);
  const pct = Math.min(100, Math.round((b * 100) / l));
  return { bytes: b, limit: l, pct, tone: pct >= 100 ? 'full' : pct >= 80 ? 'warn' : 'ok' };
}

export function formatBytes(n: number): string {
  return n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${(n / 1024).toFixed(1)} kB`;
}

/** hh:mm:ss of a time in seconds */
export function clock(ts: number | undefined): string {
  const t = new Date((ts ?? 0) * 1000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(t.getHours())}:${p(t.getMinutes())}:${p(t.getSeconds())}`;
}
