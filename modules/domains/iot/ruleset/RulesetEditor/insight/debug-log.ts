import type { DebugKindFilter, DebugMessage } from './types';

/** The panel keeps the last this many messages. */
export const RING_MAX = 300;

export type DebugLog = { items: DebugMessage[]; lastSeq: number };

export const emptyLog: DebugLog = { items: [], lastSeq: 0 };

/** Read what the host ring holds beyond `lastSeq`. While paused nothing is read, so the log stays as it is; the host
 *  ring keeps the messages and the next read after resuming picks them up. */
export function readNew(log: DebugLog, ring: DebugMessage[], paused: boolean, max = RING_MAX): DebugLog {
  if (paused) return log;
  const fresh = ring.filter((x) => x.seq > log.lastSeq);
  if (!fresh.length) return log;
  const lastSeq = fresh.reduce((m, x) => Math.max(m, x.seq), log.lastSeq);
  return { items: log.items.concat(fresh).slice(-max), lastSeq };
}

/** Does the message pass the kind filter (and, when `nodeOnly` is set, the selected block)? */
export function wantMessage(x: DebugMessage, kind: DebugKindFilter, nodeOnly?: { selected: string | null }): boolean {
  if (nodeOnly && x.node !== nodeOnly.selected) return false;
  const bad = x.kind === 'error' || x.kind === 'warn';
  return kind === 'all' || (kind === 'problem' ? bad : !bad);
}

export function filterLog(items: DebugMessage[], kind: DebugKindFilter, nodeOnly?: { selected: string | null }): DebugMessage[] {
  return items.filter((x) => wantMessage(x, kind, nodeOnly));
}

/** One message as text: "time  block  topic" and its value as JSON. */
export function messageText(x: DebugMessage, who?: string): string {
  const head = [new Date((x.ts || 0) * 1000).toISOString(), who ?? (x.name || x.node), x.topic != null && x.topic !== '' ? `topic ${x.topic}` : '']
    .filter((s) => s).join('  ');
  let body: string;
  if (x.kind === 'error' || x.kind === 'warn') body = x.text ?? '';
  else if (x.truncated || typeof x.msg === 'string') body = String(x.msg);
  else {
    try { body = JSON.stringify(x.msg, null, 2) ?? String(x.msg); } catch { body = String(x.msg); }
  }
  return `${head}\n${x.prop || 'msg'} = ${body}`;
}

/** The whole file: what the filters show, blank line between messages. Empty string when nothing shows. */
export function exportText(items: DebugMessage[], who?: (x: DebugMessage) => string): string {
  if (!items.length) return '';
  return items.map((x) => messageText(x, who?.(x))).join('\n\n') + '\n';
}

export function exportFileName(chainId: string | null | undefined): string {
  return `debug-${chainId || 'flow'}.txt`;
}
