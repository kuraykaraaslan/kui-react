'use client';
import { useState } from 'react';
import { RangeSlider } from '../RangeSlider';
import { useAsyncControl } from '@/libs/hooks/useAsyncControl';
import { ControlTile, type ControlMessages } from './ControlTile';
import { asNumber, formatValue, snapToStep, toRange } from './control-logic';

export type ControlSliderProps = {
  title?: string;
  /** The bound number. */
  value: unknown;
  reported?: unknown;
  /** Written ONCE per gesture (pointer up / keyboard idle / blur), never per step. */
  onCommit: (next: number) => Promise<void>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  decimals?: number;
  /** Formats the "Reported: {value}" line; default `Reported: ${value}`. */
  reportedLabel?: (value: string) => string;
  readOnly?: boolean;
  disabled?: boolean;
  timeoutMs?: number;
  messages?: Partial<ControlMessages>;
  className?: string;
};

/** ControlSlider — drag moves only the local value; the write happens on release; failure restores the bound value. */
export function ControlSlider({
  title, value, reported, onCommit, min, max, step, unit, decimals = 0, reportedLabel = (v) => `Reported: ${v}`,
  readOnly = false, disabled = false, timeoutMs, messages, className,
}: ControlSliderProps) {
  const range = toRange({ min, max, step });
  const bound = asNumber(value);
  const rep = reported === undefined ? undefined : asNumber(reported);
  const ctl = useAsyncControl<number>({ value: bound, reported: rep, commit: onCommit, timeoutMs });
  // The local drag value; it is dropped once the bound value changes underneath it.
  const [dragged, setDraft] = useState<{ v: number; base: number | null } | null>(null);
  const draft = dragged && dragged.base === bound ? dragged.v : null;
  const shown = draft ?? ctl.displayValue ?? range.min;
  const suffix = unit ? ` ${unit}` : '';
  const text = `${formatValue(shown, decimals)}${suffix}`;
  return (
    <ControlTile
      title={title}
      state={ctl.state}
      error={ctl.error}
      readOnly={readOnly}
      onRetry={ctl.retry}
      messages={messages}
      reportedText={bound !== null && draft !== null && draft !== bound ? reportedLabel(`${formatValue(bound, decimals)}${suffix}`) : undefined}
      className={className}
    >
      <RangeSlider
        label={title || 'Value'}
        showValue={false}
        min={range.min}
        max={range.max}
        step={range.step}
        value={shown}
        disabled={disabled || readOnly}
        pending={ctl.state === 'pending'}
        onChange={(v) => setDraft({ v: snapToStep(v, range), base: bound })}
        onCommit={(v) => { const next = snapToStep(v, range); setDraft(null); ctl.set(next); }}
      />
      <div className="flex justify-between text-xs tabular-nums text-text-secondary">
        <span>{range.min}</span>
        <span className="font-semibold text-text-primary" aria-live="off">{text}</span>
        <span>{range.max}</span>
      </div>
    </ControlTile>
  );
}
