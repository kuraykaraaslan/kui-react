'use client';
import type { CSSProperties } from 'react';
import { cn } from '@/libs/utils/cn';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle, formatValue, rangeFor, type RangeEdges } from '../settings/style';
import { SettingIcon } from '../WidgetKitContext';
import type { WidgetKindView, WidgetViewProps } from '../kind';

const num = (v: unknown): number | null => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
};

type S = {
  layout?: 'stacked' | 'inline' | 'centered' | 'compact';
  autoScale?: boolean;
  valueFont?: FontValue;
  valueColor?: string;
  label?: string;
  labelFont?: FontValue;
  labelColor?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  iconBackground?: string;
  ranges?: unknown;
  rangeEdges?: RangeEdges;
  rangeTarget?: 'value' | 'icon' | 'background';
  compareAs?: 'percent' | 'delta' | 'value';
  increaseIs?: 'good' | 'bad' | 'neutral';
  showArrow?: boolean;
  compareLabel?: string;
  upColor?: string;
  downColor?: string;
};

/** The comparison line: change against the `compare` slot, coloured by what an increase means. */
export function comparison(value: number | null, compare: number | null, s: S, format: WidgetViewProps['format'], locale?: string) {
  if (value === null || compare === null) return null;
  const diff = value - compare;
  const up = diff > 0;
  const good = s.increaseIs === 'neutral' || diff === 0 ? null : (up ? s.increaseIs === 'good' : s.increaseIs === 'bad');
  let text: string;
  if (s.compareAs === 'value') text = formatValue(compare, format, {}, locale);
  else if (s.compareAs === 'delta') text = `${diff > 0 ? '+' : ''}${formatValue(diff, format, {}, locale)}`;
  else if (compare === 0) return null;
  else text = `${diff > 0 ? '+' : ''}${formatValue((diff / Math.abs(compare)) * 100, { decimals: 1 }, {}, locale)} %`;
  const arrow = s.showArrow === false || diff === 0 ? '' : up ? '▲ ' : '▼ ';
  const color = good === null ? undefined : cssColor(good ? s.upColor : s.downColor);
  return { text: `${arrow}${text}`, color };
}

/** `stat.value`: the number, its label, an optional icon and comparison; no frame of its own. */
export function StatValueView({ settings, format, data, locale }: WidgetViewProps) {
  const s = settings as S;
  const value = num(data.value?.value);
  const range = rangeFor(value, s.ranges, s.rangeEdges ?? 'from');
  const rangeColor = cssColor(range?.color);
  const target = s.rangeTarget ?? 'value';
  const layout = s.layout ?? 'stacked';
  const cmp = comparison(value, num(data.compare?.value), s, format, locale);

  const valueStyle: CSSProperties = {
    ...(s.autoScale !== false ? { fontSize: 'clamp(1.25rem, min(16cqi, 42cqb), 3.5rem)' } : {}),
    ...fontStyle(s.autoScale !== false ? undefined : s.valueFont, s.valueColor),
    ...(rangeColor && target === 'value' ? { color: rangeColor } : {}),
  };
  const iconSize = s.iconSize ?? 28;
  const icon = s.icon ? (
    <span className="flex shrink-0 items-center justify-center rounded-xl"
      style={{
        width: iconSize * 1.6, height: iconSize * 1.6,
        background: cssColor(s.iconBackground) ?? (s.iconBackground === undefined ? 'var(--primary-subtle)' : undefined),
      }}>
      <SettingIcon name={s.icon} style={{
        width: iconSize, height: iconSize, fontSize: iconSize,
        color: (rangeColor && target === 'icon' ? rangeColor : undefined) ?? cssColor(s.iconColor),
      }} />
    </span>
  ) : null;
  const text = (
    <span className="font-bold tabular-nums leading-none" style={valueStyle}>{formatValue(value, format, {}, locale)}</span>
  );
  const label = s.label ? (
    <span className="text-xs text-text-secondary" style={fontStyle(s.labelFont, s.labelColor)}>{s.label}</span>
  ) : null;
  const delta = cmp ? (
    <span className="text-xs font-medium text-text-secondary" style={{ color: cmp.color }}>
      {cmp.text}{s.compareLabel ? <span className="ml-1 font-normal text-text-secondary">{s.compareLabel}</span> : null}
    </span>
  ) : null;

  const bg: CSSProperties | undefined = rangeColor && target === 'background'
    ? { background: `color-mix(in srgb, ${rangeColor} 16%, transparent)` } : undefined;

  if (layout === 'compact') {
    return (
      <div className="flex h-full items-center gap-3 rounded-lg" style={bg}>
        {icon}
        {label && <span className="min-w-0 flex-1 truncate">{label}</span>}
        <span className="ml-auto flex items-baseline gap-2">{text}{delta}</span>
      </div>
    );
  }
  return (
    <div
      className={cn(
        'flex h-full min-h-0 gap-3 rounded-lg',
        layout === 'inline' ? 'flex-row items-center' : 'flex-col',
        layout === 'centered' && 'items-center justify-center text-center',
        layout === 'stacked' && 'relative justify-between',
      )}
      style={bg}
    >
      {layout === 'stacked' ? (
        <>
          {/* The icon sits in the corner and takes no row, so a short card still has room for the number. */}
          {icon && <span className="absolute right-0 top-0">{icon}</span>}
          <div className="min-w-0" style={icon ? { paddingRight: iconSize * 1.6 + 8 } : undefined}>{label}</div>
          <div className="flex flex-col gap-1">{text}{delta}</div>
        </>
      ) : (
        <>
          {icon}
          <div className={cn('flex min-w-0 flex-col gap-1', layout === 'centered' && 'items-center')}>{text}{label}{delta}</div>
        </>
      )}
    </div>
  );
}

export const STAT_VALUE_VIEW: WidgetKindView = {
  View: StatValueView,
  isEmpty: (data) => data.value?.value === undefined || data.value?.value === null,
};
