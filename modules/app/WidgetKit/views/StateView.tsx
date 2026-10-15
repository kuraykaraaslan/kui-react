'use client';
import type { CSSProperties } from 'react';
import { cn } from '@/libs/utils/cn';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle } from '../settings/style';
import type { Sparse } from '../settings/types';
import { SettingIcon } from '../WidgetKitContext';
import type { WidgetKindView, WidgetViewProps } from '../kind';

type Rule = { match?: string; gte?: number | null; lte?: number | null; label?: string; color?: string; background?: string; icon?: string };

type S = {
  layout?: 'badge' | 'dot' | 'tile' | 'icon';
  iconSize?: number;
  states?: unknown;
  fallbackLabel?: string;
  fallbackColor?: string;
  fallbackBackground?: string;
  fallbackIcon?: string;
  labelFont?: FontValue;
  showValue?: boolean;
  valueFont?: FontValue;
  valueColor?: string;
  staleAsUnknown?: boolean;
  unknownLabel?: string;
};

const asNumber = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

const isBlank = (v: unknown) => v === null || v === undefined || v === '';

function ruleMatches(rule: Rule, value: unknown): boolean {
  if (!isBlank(rule.match)) {
    const a = asNumber(rule.match);
    const b = asNumber(value);
    if (a !== null && b !== null) return a === b;
    return String(rule.match).toLowerCase() === String(value).toLowerCase();
  }
  if (isBlank(rule.gte) && isBlank(rule.lte)) return false;
  const n = asNumber(value);
  if (n === null) return false;
  if (typeof rule.gte === 'number' && n < rule.gte) return false;
  if (typeof rule.lte === 'number' && n > rule.lte) return false;
  return true;
}

export interface StateOutcome {
  label: string;
  color: string;
  background?: string;
  icon?: string;
  matched: boolean;
  unknown: boolean;
}

/**
 * First matching rule wins, otherwise the fallback. A missing value (or, when asked, a stale one)
 * is "unknown" in a neutral colour, never the fallback's.
 */
export function evaluateState(value: unknown, settings: Sparse, stale = false): StateOutcome {
  const s = settings as S;
  const neutral = 'var(--text-secondary)';
  if (isBlank(value) || (stale && s.staleAsUnknown !== false)) {
    return { label: s.unknownLabel || 'Unknown', color: neutral, matched: false, unknown: true };
  }
  const rules = (Array.isArray(s.states) ? (s.states as Rule[]) : []).filter((r) => r && typeof r === 'object');
  const hit = rules.find((r) => ruleMatches(r, value));
  if (hit) {
    return {
      label: hit.label || String(value),
      color: cssColor(hit.color) ?? neutral,
      background: cssColor(hit.background),
      icon: hit.icon || undefined,
      matched: true,
      unknown: false,
    };
  }
  return {
    label: s.fallbackLabel || String(value),
    color: cssColor(s.fallbackColor) ?? neutral,
    background: cssColor(s.fallbackBackground),
    icon: s.fallbackIcon || undefined,
    matched: false,
    unknown: false,
  };
}

const tint = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

/** `state`: the value mapped to a labelled, coloured badge, dot, tinted tile or big icon. */
export function StateView({ settings, data, stale }: WidgetViewProps) {
  const s = settings as S;
  const raw = data.value?.value;
  const out = evaluateState(raw, settings, stale);
  const layout = s.layout ?? 'badge';
  const iconSize = s.iconSize ?? 32;
  const bg = out.background ?? tint(out.color, 14);
  const labelStyle: CSSProperties = { ...fontStyle(s.labelFont), color: out.color };
  const valueLine = s.showValue && !isBlank(raw) && !out.unknown ? (
    <span className="text-xs tabular-nums text-text-secondary" style={fontStyle(s.valueFont, s.valueColor)} data-part="value">{String(raw)}</span>
  ) : null;
  const staleNote = stale ? <span className="sr-only"> (stale)</span> : null;
  const icon = (size: number) => out.icon
    ? <SettingIcon name={out.icon} style={{ width: size, height: size, fontSize: size, color: out.color }} />
    : null;

  let body: React.ReactNode;
  if (layout === 'dot') {
    body = (
      <span className="inline-flex items-center gap-2 text-base font-medium" style={labelStyle} data-part="label">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: out.color }} data-part="dot" aria-hidden="true" />
        {out.label}{staleNote}
      </span>
    );
  } else if (layout === 'icon') {
    body = (
      <>
        <span className="flex items-center justify-center" aria-hidden="true" data-part="icon">
          {icon(iconSize) ?? <span className="rounded-full" style={{ width: iconSize, height: iconSize, background: out.color }} />}
        </span>
        <span className="text-sm font-medium" style={labelStyle} data-part="label">{out.label}{staleNote}</span>
      </>
    );
  } else if (layout === 'tile') {
    return (
      <div
        className="flex h-full min-h-0 flex-col items-center justify-center gap-2 rounded-lg p-3 text-center"
        style={{ background: bg }}
        role="status"
        aria-live="polite"
        data-layout="tile"
      >
        {icon(iconSize)}
        <span className="text-lg font-semibold" style={labelStyle} data-part="label">{out.label}{staleNote}</span>
        {valueLine}
      </div>
    );
  } else {
    body = (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium"
        style={{ ...labelStyle, background: bg }}
        data-part="badge"
      >
        {icon(14)}
        {out.label}{staleNote}
      </span>
    );
  }

  return (
    <div className={cn('flex h-full min-h-0 flex-col items-center justify-center gap-1 py-2')} role="status" aria-live="polite" data-layout={layout}>
      {body}
      {valueLine}
    </div>
  );
}

export const STATE_VIEW: WidgetKindView = {
  View: StateView,
  // A bound slot answering null is "unknown", a state of its own; only a missing answer is empty.
  isEmpty: (data) => !data.value || data.value.value === undefined,
};
