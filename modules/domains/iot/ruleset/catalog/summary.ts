import { optionLabel, type ParamValues } from './params';
import type { BlockDecl, ParamSpec } from './types';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** 1500 -> "1.5 s", 90000 -> "1.5 min", 250 -> "250 ms" */
export function formatDurationMs(ms: number): string {
  if (!Number.isFinite(ms)) return String(ms);
  const trim = (n: number) => String(Math.round(n * 100) / 100);
  if (Math.abs(ms) < 1000) return `${trim(ms)} ms`;
  if (Math.abs(ms) < 60_000) return `${trim(ms / 1000)} s`;
  if (Math.abs(ms) < 3_600_000) return `${trim(ms / 60_000)} min`;
  return `${trim(ms / 3_600_000)} h`;
}

/** Short text of a `value` param ({ kind, v }) or any other plain value. */
export function formatValue(value: unknown): string {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'kind' in value) {
    const { kind, v } = value as { kind: unknown; v: unknown };
    if (kind === 'now') return 'now';
    if (kind === 'json') return typeof v === 'string' ? v : JSON.stringify(v);
    return v == null || v === '' ? '—' : String(v);
  }
  if (typeof value === 'object' && value !== null) return JSON.stringify(value);
  return String(value);
}

function formatParam(key: string, spec: ParamSpec | undefined, value: unknown): string {
  if (value == null || value === '') return '—';
  if (spec?.type === 'duration' || /_ms$/.test(key)) return typeof value === 'number' ? formatDurationMs(value) : String(value);
  if (spec?.type === 'enum') return optionLabel(spec, value);
  if (spec?.type === 'bool') return value ? 'on' : 'off';
  if (spec?.type === 'weekdays' && Array.isArray(value)) return value.map((d) => DAY_NAMES[Number(d) - 1] ?? String(d)).join(' ');
  if (spec?.type === 'secret') return '••••';
  if (Array.isArray(value)) return value.map(formatValue).join(', ');
  return formatValue(value);
}

/**
 * The line under the title of a node: the `summary` template of its block with each `${param}` replaced
 * by the value (or the default) of the param, written for people. Empty when the block has no template.
 */
export function summaryOf(decl: Pick<BlockDecl, 'summary' | 'params'> | undefined, config: ParamValues | undefined): string {
  if (!decl?.summary) return '';
  return decl.summary.replace(/\$\{([a-z_0-9]+)\}/gi, (_all, key: string) =>
    formatParam(key, decl.params?.[key], config?.[key] ?? decl.params?.[key]?.default));
}
