import type { DebugMessage } from './types';

/** `HH:MM:SS.mmm` in the local time zone, from seconds since the epoch (the router's debug list shows the same) */
export function clockMs(ts: number | undefined): string {
  const t = new Date((ts || 0) * 1000);
  const p = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${p(t.getHours())}:${p(t.getMinutes())}:${p(t.getSeconds())}.${p(t.getMilliseconds(), 3)}`;
}

/** the kind of a value for the type line: `null`, `array[3]`, `object`, `string` … */
export function typeName(v: unknown): string {
  if (v === null || v === undefined) return 'null';
  if (Array.isArray(v)) return `array[${v.length}]`;
  return typeof v;
}

/** an error message without the fields the engine adds (`_msgid`, `_run`, `_hops`, `event`) */
export function plainMsg(v: unknown): unknown {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return v;
  const o: Record<string, unknown> = {};
  for (const k of Object.keys(v)) if (!/^_(msgid|run|hops)$/.test(k) && k !== 'event') o[k] = (v as Record<string, unknown>)[k];
  return o;
}

/** is this message one a person has to look at (an error or a warning) */
export const isProblem = (x: Pick<DebugMessage, 'kind'>) => x.kind === 'error' || x.kind === 'warn';

/** one line of a value for a folded summary: text as it is, anything else as JSON, cut at 80 characters */
export function previewOf(v: unknown): string {
  let s: string;
  try { s = typeof v === 'string' ? v : JSON.stringify(v); } catch { s = String(v); }
  s = s ?? '';
  return s.length > 80 ? `${s.slice(0, 77)}…` : s;
}
