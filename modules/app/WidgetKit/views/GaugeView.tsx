'use client';
import { GaugeChart, type GaugeBand, type GaugeLayout } from '@/modules/ui/Chart/charts/GaugeChart';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle, formatValue, type ColorRange, type RangeEdges } from '../settings/style';
import type { WidgetKindView, WidgetViewProps } from '../kind';

const num = (v: unknown): number | null => {
  const n = typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
};

type S = {
  layout?: GaugeLayout;
  startAngle?: number;
  endAngle?: number;
  min?: number;
  max?: number;
  showMinMax?: boolean;
  minMaxFont?: FontValue;
  minMaxColor?: string;
  ticks?: number;
  showValue?: boolean;
  valueFont?: FontValue;
  valueColor?: string;
  unitTitle?: string;
  needle?: boolean;
  needleColor?: string;
  barColor?: string;
  trackColor?: string;
  thickness?: number;
  roundedCaps?: boolean;
  ranges?: unknown;
  rangeEdges?: RangeEdges;
  rangeTarget?: 'both' | 'bar' | 'track';
  animation?: boolean;
};

/** Colour ranges → gauge bands. An open lower end starts where the previous range ended; an open upper end runs to the top. */
export function rangesToBands(ranges: unknown): GaugeBand[] {
  if (!Array.isArray(ranges)) return [];
  const out: GaugeBand[] = [];
  for (const r of ranges as ColorRange[]) {
    const color = cssColor(r?.color);
    if (!r || typeof r !== 'object' || !color) continue;
    out.push({
      ...(typeof r.from === 'number' ? { from: r.from } : {}),
      to: typeof r.to === 'number' ? r.to : Number.POSITIVE_INFINITY,
      color,
      ...(r.label ? { label: r.label } : {}),
    });
  }
  return out;
}

/**
 * `gauge`: one number on an arc, a donut or a bar. A bound min / max wins over the typed one. The
 * card dims a stale gauge (`$card.staleDisplay: 'dim'`), so the view does not dim it again.
 */
export function GaugeView({ settings, format, data, locale }: WidgetViewProps) {
  const s = settings as S;
  const value = num(data.value?.value);
  const min = num(data.min?.value) ?? num(s.min) ?? 0;
  const rawMax = num(data.max?.value) ?? num(s.max) ?? 100;
  const max = rawMax > min ? rawMax : min + 1;
  // The chart draws a trailing unit smaller beside the number; a leading unit (₺ 12) stays in the text.
  const unitAfter = format.unitPosition !== 'before';
  const scaleFormat = { ...format, unit: undefined };

  return (
    <div className="flex h-full min-h-0 w-full items-center justify-center">
      <GaugeChart
        value={value}
        min={min}
        max={max}
        layout={s.layout ?? 'arc'}
        size="fill"
        bands={rangesToBands(s.ranges)}
        bandEdges={s.rangeEdges ?? 'to'}
        bandDisplay={s.rangeTarget ?? 'both'}
        format={(v) => formatValue(v, unitAfter ? scaleFormat : format, {}, locale)}
        formatScale={(v) => formatValue(v, scaleFormat, {}, locale)}
        unit={unitAfter && format.unit ? format.unit : undefined}
        label={s.unitTitle || undefined}
        needle={!!s.needle}
        needleColor={cssColor(s.needleColor)}
        color={cssColor(s.barColor)}
        trackColor={cssColor(s.trackColor)}
        thickness={s.thickness ?? 16}
        roundedCaps={!!s.roundedCaps}
        ticks={s.ticks ?? 0}
        showMinMax={s.showMinMax !== false}
        showValue={s.showValue !== false}
        startAngle={s.startAngle ?? -135}
        endAngle={s.endAngle ?? 135}
        animate={s.animation !== false}
        valueStyle={fontStyle(s.valueFont)}
        valueColor={cssColor(s.valueColor)}
        scaleStyle={fontStyle(s.minMaxFont)}
        scaleColor={cssColor(s.minMaxColor)}
        ariaLabel={s.unitTitle || 'Gauge'}
      />
    </div>
  );
}

export const GAUGE_VIEW: WidgetKindView = {
  View: GaugeView,
  isEmpty: (data) => data.value?.value === undefined || data.value?.value === null || data.value?.value === '',
};
