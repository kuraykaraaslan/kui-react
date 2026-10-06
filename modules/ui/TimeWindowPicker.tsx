'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';

/**
 * TimeWindowPicker — relative presets ("1h", "7d"), an absolute UTC range, and the
 * interval / aggregation that go with a window (phase 9 §9.7). Day-granularity
 * `DateRangePicker` has no presets or times; this is the dashboard / telemetry variant.
 * The value type is structural, so it carries no dashboard import.
 */

export type TimeWindowValue =
  | { mode: 'relative'; last: string; interval?: string; aggregation?: string; timezone?: string }
  | { mode: 'absolute'; from: string; to: string; interval?: string; aggregation?: string; timezone?: string };

const DEFAULT_PRESETS = ['15m', '1h', '6h', '24h', '7d', '30d', '90d', '365d'];
const DEFAULT_INTERVALS = ['auto', '1m', '5m', '1h', '1d'];
const DEFAULT_AGGREGATIONS = ['avg', 'min', 'max', 'sum', 'count', 'none'];

/** `2026-10-06T12:00:00.000Z` → `2026-10-06T12:00` for a `datetime-local` input (UTC). */
const toInput = (iso: string): string => iso.slice(0, 16);
const fromInput = (v: string): string => new Date(`${v}:00.000Z`).toISOString();

export type TimeWindowMessages = {
  label: string;
  presets: string;
  custom: string;
  from: string;
  to: string;
  interval: string;
  intervalAuto: string;
  /** `{value}` is replaced. */
  intervalValue: string;
  aggregation: string;
  /** `{value}` is replaced. */
  aggregationValue: string;
};

export const DEFAULT_TIME_WINDOW_MESSAGES: TimeWindowMessages = {
  label: 'Time window',
  presets: 'Quick ranges',
  custom: 'Custom',
  from: 'From (UTC)',
  to: 'To (UTC)',
  interval: 'Interval',
  intervalAuto: 'Interval: auto',
  intervalValue: 'Interval: {value}',
  aggregation: 'Aggregation',
  aggregationValue: 'Aggregate: {value}',
};

const field = 'h-8 rounded-md border border-border bg-surface-base px-2 text-sm text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus';

export function TimeWindowPicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  intervals = DEFAULT_INTERVALS,
  aggregations = DEFAULT_AGGREGATIONS,
  allowAbsolute = true,
  showInterval = true,
  showAggregation = true,
  className,
  idPrefix = 'tw',
  messages,
}: {
  value: TimeWindowValue | null;
  onChange: (next: TimeWindowValue) => void;
  presets?: string[];
  intervals?: string[];
  aggregations?: string[];
  allowAbsolute?: boolean;
  showInterval?: boolean;
  showAggregation?: boolean;
  className?: string;
  idPrefix?: string;
  /** Visible and accessible text; every key is optional. */
  messages?: Partial<TimeWindowMessages>;
}) {
  const m = { ...DEFAULT_TIME_WINDOW_MESSAGES, ...messages };
  const [absolute, setAbsolute] = useState(value?.mode === 'absolute');
  const extras = value ? { interval: value.interval, aggregation: value.aggregation, timezone: value.timezone } : {};
  const set = (patch: Partial<Pick<TimeWindowValue, 'interval' | 'aggregation'>>) => {
    const base: TimeWindowValue = value ?? { mode: 'relative', last: presets.includes('24h') ? '24h' : presets[0] };
    onChange({ ...base, ...patch } as TimeWindowValue);
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)} role="group" aria-label={m.label}>
      <div className="inline-flex overflow-hidden rounded-md border border-border" role="radiogroup" aria-label={m.presets}>
        {presets.map((p) => {
          const active = value?.mode === 'relative' && value.last === p && !absolute;
          return (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => { setAbsolute(false); onChange({ mode: 'relative', last: p, ...extras } as TimeWindowValue); }}
              className={cn(
                'h-8 px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus',
                active ? 'bg-primary text-primary-fg' : 'bg-surface-base text-text-secondary hover:bg-surface-sunken',
              )}
            >
              {p}
            </button>
          );
        })}
        {allowAbsolute && (
          <button
            type="button"
            role="radio"
            aria-checked={absolute}
            onClick={() => {
              setAbsolute(true);
              if (value?.mode !== 'absolute') {
                const to = new Date(); to.setMinutes(0, 0, 0);
                onChange({ mode: 'absolute', from: new Date(to.getTime() - 24 * 3_600_000).toISOString(), to: to.toISOString(), ...extras } as TimeWindowValue);
              }
            }}
            className={cn(
              'h-8 px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus',
              absolute ? 'bg-primary text-primary-fg' : 'bg-surface-base text-text-secondary hover:bg-surface-sunken',
            )}
          >
            {m.custom}
          </button>
        )}
      </div>

      {absolute && value?.mode === 'absolute' && (
        <div className="flex items-center gap-1.5">
          <input
            id={`${idPrefix}-from`}
            type="datetime-local"
            aria-label={m.from}
            className={field}
            value={toInput(value.from)}
            max={toInput(value.to)}
            onChange={(e) => e.target.value && onChange({ ...value, from: fromInput(e.target.value) })}
          />
          <span aria-hidden="true" className="text-text-secondary">–</span>
          <input
            id={`${idPrefix}-to`}
            type="datetime-local"
            aria-label={m.to}
            className={field}
            value={toInput(value.to)}
            min={toInput(value.from)}
            onChange={(e) => e.target.value && onChange({ ...value, to: fromInput(e.target.value) })}
          />
        </div>
      )}

      {showInterval && (
        <select
          aria-label={m.interval}
          className={field}
          value={value?.interval ?? 'auto'}
          onChange={(e) => set({ interval: e.target.value })}
        >
          {intervals.map((i) => (
            <option key={i} value={i}>
              {i === 'auto' ? m.intervalAuto : m.intervalValue.replace('{value}', i)}
            </option>
          ))}
        </select>
      )}
      {showAggregation && (
        <select
          aria-label={m.aggregation}
          className={field}
          value={value?.aggregation ?? 'avg'}
          onChange={(e) => set({ aggregation: e.target.value })}
        >
          {aggregations.map((a) => (
            <option key={a} value={a}>{m.aggregationValue.replace('{value}', a)}</option>
          ))}
        </select>
      )}
    </div>
  );
}
