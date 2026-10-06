'use client';
import { useId, useState } from 'react';
import { Button } from '../Button';
import { useAsyncControl } from '@/libs/hooks/useAsyncControl';
import { ControlTile, type ControlMessages } from './ControlTile';
import { asNumber, formatValue, toRange, validateSetpoint } from './control-logic';

export type ControlSetpointMessages = {
  apply: string;
  enterNumber: string;
  /** `{min}` and `{max}` are replaced. */
  outOfRange: string;
  /** `{value}` is replaced. */
  current: string;
};

export type ControlSetpointProps = {
  title?: string;
  value: unknown;
  reported?: unknown;
  /** Written when the user presses Apply (or Enter) with a valid number. */
  onCommit: (next: number) => Promise<void>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  decimals?: number;
  readOnly?: boolean;
  disabled?: boolean;
  timeoutMs?: number;
  messages?: Partial<ControlMessages & ControlSetpointMessages>;
  className?: string;
};

const DEFAULTS: ControlSetpointMessages = {
  apply: 'Apply',
  enterNumber: 'Enter a number.',
  outOfRange: 'Enter a value between {min} and {max}.',
  current: 'Current: {value}',
};

/** ControlSetpoint — type a number, press Apply or Enter. A bad entry is a field error and sends nothing. */
export function ControlSetpoint({
  title, value, reported, onCommit, min, max, step, unit, decimals = 0, readOnly = false, disabled = false, timeoutMs, messages, className,
}: ControlSetpointProps) {
  const id = useId();
  const m = { ...DEFAULTS, ...messages };
  const range = toRange({ min, max, step });
  const bound = asNumber(value);
  const rep = reported === undefined ? undefined : asNumber(reported);
  const ctl = useAsyncControl<number>({ value: bound, reported: rep, commit: onCommit, timeoutMs });
  const [text, setText] = useState(bound !== null ? String(bound) : '');
  const [prevBound, setPrevBound] = useState(bound);
  const [fieldError, setFieldError] = useState<string | null>(null);
  // A new bound value replaces the typed text (adjusting state during render, not in an effect).
  if (bound !== prevBound) {
    setPrevBound(bound);
    if (bound !== null) setText(String(bound));
  }
  const errId = `${id}-error`;
  const locked = disabled || readOnly || ctl.state === 'pending';

  const apply = () => {
    const checked = validateSetpoint(text, range);
    if (!checked.ok) {
      setFieldError(checked.reason === 'range'
        ? m.outOfRange.replace('{min}', String(range.min)).replace('{max}', String(range.max))
        : m.enterNumber);
      return;
    }
    setFieldError(null);
    ctl.set(checked.value);
  };

  return (
    <ControlTile title={title} state={ctl.state} error={ctl.error} readOnly={readOnly} onRetry={ctl.retry} messages={messages} className={className}>
      <form className="space-y-1" noValidate onSubmit={(e) => { e.preventDefault(); apply(); }}>
        <div className="flex items-center gap-2">
          <input
            inputMode="decimal"
            aria-label={title || 'Set point'}
            aria-invalid={!!fieldError}
            aria-describedby={fieldError ? errId : undefined}
            value={text}
            disabled={locked}
            onChange={(e) => { setText(e.target.value); setFieldError(null); }}
            className="h-9 w-28 rounded-md border border-border bg-surface-base px-2 text-sm tabular-nums text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:opacity-50"
          />
          {unit && <span className="text-sm text-text-secondary">{unit}</span>}
          <Button type="submit" disabled={locked} loading={ctl.state === 'pending'}>{m.apply}</Button>
        </div>
        {bound !== null && (
          <p className="text-xs text-text-secondary">{m.current.replace('{value}', `${formatValue(bound, decimals)}${unit ? ` ${unit}` : ''}`)}</p>
        )}
        {fieldError && <p id={errId} role="alert" className="text-xs text-error">{fieldError}</p>}
      </form>
    </ControlTile>
  );
}
