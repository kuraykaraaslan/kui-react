'use client';
import type { CSSProperties } from 'react';
import { cn } from '@/libs/utils/cn';
import { Progress } from '@/modules/ui/Progress';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle, formatValue, rangeFor, type RangeEdges } from '../settings/style';
import type { WidgetKindView, WidgetViewProps } from '../kind';

const num = (v: unknown): number | null => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
};

type S = {
  layout?: 'bar-labelled' | 'bar' | 'ring';
  target?: number;
  valueText?: 'value' | 'percent' | 'both' | 'none';
  valueFont?: FontValue;
  valueColor?: string;
  barColor?: string;
  trackColor?: string;
  thickness?: number;
  roundedEnds?: boolean;
  ringSize?: number;
  ranges?: unknown;
  rangeEdges?: RangeEdges;
  showTicks?: boolean;
  ticksFont?: FontValue;
  ticksColor?: string;
};

/**
 * `progress`: a bound number against a target. A bound target wins over the typed one. A zero or
 * negative target has no percentage: the number still shows, only the bar goes.
 */
export function ProgressView({ settings, format, data, locale }: WidgetViewProps) {
  const s = settings as S;
  const value = num(data.value?.value);
  const target = num(data.target?.value) ?? num(s.target);
  const pct = value !== null && target !== null && target > 0 ? Math.min(100, Math.max(0, (value / target) * 100)) : null;
  const layout = s.layout ?? 'bar-labelled';
  const mode = s.valueText ?? 'value';
  const barColor = cssColor(rangeFor(value, s.ranges, s.rangeEdges ?? 'from')?.color) ?? cssColor(s.barColor) ?? 'var(--primary)';
  const trackColor = cssColor(s.trackColor) ?? 'var(--surface-overlay)';
  const thickness = s.thickness ?? 8;
  const rounded = s.roundedEnds !== false;

  const valueStr = formatValue(value, format, {}, locale);
  const targetStr = target !== null ? formatValue(target, format, {}, locale) : null;
  const pctStr = pct !== null ? `${formatValue(pct, { decimals: 0 }, {}, locale)} %` : null;
  const main = mode === 'percent' ? (pctStr ?? valueStr) : valueStr;
  const secondary = mode === 'percent' || mode === 'none' ? null
    : [targetStr !== null ? `of ${targetStr}` : null, mode === 'both' ? pctStr : null].filter(Boolean).join(' · ') || null;
  const valueStyle: CSSProperties = fontStyle(s.valueFont, s.valueColor);
  const aria = `${valueStr}${targetStr !== null ? ` of ${targetStr}` : ''}`;

  const text = mode === 'none' ? null : (
    <div className="flex min-w-0 items-baseline justify-between gap-2">
      <span className="text-xl font-bold tabular-nums text-text-primary" style={valueStyle} data-part="value">{main}</span>
      {secondary && <span className="text-xs text-text-secondary" data-part="secondary">{secondary}</span>}
    </div>
  );

  if (layout === 'ring') {
    return (
      <div className="flex h-full min-h-0 items-center justify-center">
        <Progress
          shape="circle"
          value={pct ?? 0}
          diameter={s.ringSize ?? 96}
          thickness={thickness}
          color={barColor}
          trackColor={trackColor}
          rounded={rounded}
          showLabel={mode !== 'none'}
          label={aria}
          labelContent={
            <span className="flex flex-col items-center leading-tight">
              <span className="text-base font-bold" style={valueStyle} data-part="value">{main}</span>
              {secondary && <span className="text-[10px] font-normal text-text-secondary" data-part="secondary">{secondary}</span>}
            </span>
          }
        />
      </div>
    );
  }

  const bar = pct !== null ? (
    <Progress value={pct} color={barColor} trackColor={trackColor} thickness={thickness} rounded={rounded} label={aria} className="min-w-0 flex-1" />
  ) : null;
  const ticks = s.showTicks && pct !== null ? (
    <div className="mt-1 flex justify-between text-[10px] tabular-nums text-text-secondary" style={fontStyle(s.ticksFont, s.ticksColor)} data-part="ticks">
      <span>{formatValue(0, format, {}, locale)}</span>
      <span>{targetStr}</span>
    </div>
  ) : null;

  if (layout === 'bar') {
    return (
      <div className="flex h-full min-h-0 flex-col justify-center" data-layout="bar">
        <div className={cn('flex items-center gap-3')}>
          {bar}
          {mode !== 'none' && (
            <span className="shrink-0 text-sm font-semibold tabular-nums text-text-primary" style={valueStyle} data-part="value">
              {main}{secondary ? <span className="ml-1 text-xs font-normal text-text-secondary">{secondary}</span> : null}
            </span>
          )}
        </div>
        {ticks}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col justify-center" data-layout="bar-labelled">
      {text}
      {bar && <div className="mt-2 flex">{bar}</div>}
      {ticks}
    </div>
  );
}

export const PROGRESS_VIEW: WidgetKindView = {
  View: ProgressView,
  isEmpty: (data) => num(data.value?.value) === null,
};
