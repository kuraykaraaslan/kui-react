'use client';
// Settings → kui Chart props, shared by every chart view: the legend, axis, tooltip and
// threshold packs read the same keys everywhere, so they map to props in one place. Colours
// from settings pass `cssColor()`; an invalid one falls back to the chart's theme token.

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import type { FontValue } from '../../SchemaForm/types';
import type { AxisTextStyle, LegendPosition, LegendValue, ThresholdLine, TooltipMode } from '@/modules/ui/Chart';
import { cssColor, fontStyle, formatValue, type ValueFormat } from '../settings/style';

type S = Record<string, unknown>;

const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v : undefined);

/** Legend props from the legend pack. `auto` = bottom when there are 2 or more entries. */
export function legendProps(s: S, entries: number): {
  showLegend: boolean; legendPosition: LegendPosition; legendValues?: LegendValue[]; legendStyle?: CSSProperties; legendToggle: boolean;
} {
  const mode = typeof s.legend === 'string' ? s.legend : 'auto';
  const show = mode === 'none' ? false : mode === 'auto' ? entries >= 2 : true;
  const position: LegendPosition = mode === 'top' || mode === 'left' || mode === 'right' ? mode : 'bottom';
  const style = fontStyle(s.legendFont as FontValue | undefined, s.legendColor);
  return {
    showLegend: show,
    legendPosition: position,
    legendValues: Array.isArray(s.legendValues) && s.legendValues.length ? (s.legendValues as LegendValue[]) : undefined,
    legendStyle: Object.keys(style).length ? style : undefined,
    legendToggle: true,
  };
}

/** Axis text style from `tickFont` + `tickColor`. */
export function tickStyleOf(s: S): AxisTextStyle | undefined {
  const st = fontStyle(s.tickFont as FontValue | undefined, s.tickColor);
  if (!Object.keys(st).length) return undefined;
  return {
    color: st.color,
    fontSize: typeof st.fontSize === 'string' && st.fontSize.endsWith('px') ? Number.parseFloat(st.fontSize) : st.fontSize,
    fontWeight: st.fontWeight as number | undefined,
    fontFamily: st.fontFamily,
    fontStyle: st.fontStyle,
  };
}

/** Axis props from the axis pack. */
export function axisProps(s: S) {
  return {
    showGrid: s.showGrid !== false,
    gridColor: cssColor(s.gridColor),
    yMin: num(s.yMin),
    yMax: num(s.yMax),
    yLabel: str(s.yLabel),
    xLabel: str(s.xLabel),
    tickStyle: tickStyleOf(s),
  };
}

/** Threshold lines from the thresholds pack. */
export function thresholdLines(raw: unknown): ThresholdLine[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: ThresholdLine[] = [];
  for (const t of raw as S[]) {
    const value = num(t?.value);
    if (value === undefined) continue;
    out.push({
      value,
      label: str(t.label),
      color: cssColor(t.color),
      style: t.style === 'solid' || t.style === 'dotted' ? t.style : 'dashed',
      width: num(t.width),
    });
  }
  return out.length ? out : undefined;
}

export function tooltipModeOf(s: S): TooltipMode {
  return s.tooltip === 'point' || s.tooltip === 'none' ? s.tooltip : 'axis';
}

/** The widget's number text. */
export const formatter = (format: ValueFormat, locale?: string) => (v: number) => formatValue(v, format, {}, locale);

/**
 * The pixel height a chart gets inside the card body: the measured box minus room for a
 * legend above or below it. Falls back to `fallback` before the first measure (and in tests).
 */
export function useChartHeight(reserve = 0, fallback = 220): [RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [h, setH] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => setH(Math.floor(el.getBoundingClientRect().height));
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const usable = h > 0 ? h - reserve : fallback;
  return [ref, Math.max(120, usable)];
}

/** Room a top/bottom legend takes, so the chart plus its legend fit the card. */
export const legendReserve = (show: boolean, position: LegendPosition) => (show && (position === 'top' || position === 'bottom') ? 40 : 0);
