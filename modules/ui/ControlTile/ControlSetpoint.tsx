'use client';
import { useId, useState, type CSSProperties } from 'react';
import { cn } from '@/libs/utils/cn';
import { Button } from '../Button';
import { useAsyncControl } from '@/libs/hooks/useAsyncControl';
import { ControlTile, type ControlMessages } from './ControlTile';
import { asNumber, formatValue, snapToStep, toRange, validateSetpoint } from './control-logic';
import { ControlConfirmPrompt, useControlConfirm, type ControlConfirmation, type ControlConfirmMessages, type ControlConfirmMode } from './ControlConfirm';

export type ControlSetpointMessages = {
  apply: string;
  enterNumber: string;
  /** `{min}` and `{max}` are replaced. */
  outOfRange: string;
  /** `{value}` is replaced. */
  current: string;
  /** Stepper buttons' accessible names. */
  decrease: string;
  increase: string;
};

export type ControlSetpointProps = {
  title?: string;
  value: unknown;
  reported?: unknown;
  /** Written when the user presses Apply (or Enter) with a valid number, or presses a stepper button. */
  onCommit: (next: number, confirmation?: ControlConfirmation) => Promise<void>;
  /** Ask before writing: `confirm` asks "Are you sure?"; `typed` also requires `confirmText`. Default `none`. */
  confirm?: ControlConfirmMode;
  /** The text to type when `confirm="typed"`. */
  confirmText?: string;

  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  decimals?: number;
  /** Formats the numbers shown (current value, stepper value). Overrides `unit` / `decimals`. */
  format?: (value: number) => string;
  /** `input` (default): type a number and apply. `stepper`: minus / plus buttons, each press is written. */
  layout?: 'input' | 'stepper';
  /** Show the current (bound) value. Default `true`. */
  showValue?: boolean;
  /** Inline style (font, colour) of the value text (the input, or the stepper's number). */
  valueStyle?: CSSProperties;
  /** Fill of the Apply / stepper buttons. Any CSS colour or a theme token. */
  buttonColor?: string;
  /** Border of the input / stepper box. */
  borderColor?: string;
  readOnly?: boolean;
  disabled?: boolean;
  /** Why it is disabled; shown in a tooltip. Implies `disabled`. */
  disabledReason?: string;
  /** Draw the tile frame. Default `true`. */
  framed?: boolean;
  timeoutMs?: number;
  messages?: Partial<ControlMessages & ControlSetpointMessages & ControlConfirmMessages>;
  className?: string;
};

const DEFAULTS: ControlSetpointMessages = {
  apply: 'Apply',
  enterNumber: 'Enter a number.',
  outOfRange: 'Enter a value between {min} and {max}.',
  current: 'Current: {value}',
  decrease: 'Decrease',
  increase: 'Increase',
};

/** ControlSetpoint — type a number, press Apply or Enter (or step it). A bad entry is a field error and sends nothing. */
export function ControlSetpoint({
  title, value, reported, onCommit, min, max, step, unit, decimals = 0, format, layout = 'input', showValue = true,
  valueStyle, buttonColor, borderColor, readOnly = false, disabled = false, disabledReason, framed = true, timeoutMs, messages, className,
  confirm = 'none', confirmText,
}: ControlSetpointProps) {
  const id = useId();
  const m = { ...DEFAULTS, ...messages };
  const range = toRange({ min, max, step });
  const bound = asNumber(value);
  const rep = reported === undefined ? undefined : asNumber(reported);
  const ask = useControlConfirm<number>(confirm);
  const ctl = useAsyncControl<number>({ value: bound, reported: rep, commit: (v) => (ask.confirmation.current ? onCommit(v, ask.confirmation.current) : onCommit(v)), timeoutMs });
  const write = (r: { value: number } | undefined) => { if (r) { ctl.set(r.value); } };
  const [text, setText] = useState(bound !== null ? String(bound) : '');
  const [prevBound, setPrevBound] = useState(bound);
  const [fieldError, setFieldError] = useState<string | null>(null);
  // A new bound value replaces the typed text (adjusting state during render, not in an effect).
  if (bound !== prevBound) {
    setPrevBound(bound);
    if (bound !== null) setText(String(bound));
  }
  const fmt = format ?? ((n: number) => `${formatValue(n, decimals)}${unit ? ` ${unit}` : ''}`);
  const errId = `${id}-error`;
  const pending = ctl.state === 'pending';
  const locked = disabled || readOnly || !!disabledReason || pending || !!ask.asking;
  const buttonStyle: CSSProperties | undefined = buttonColor ? { background: buttonColor, borderColor: buttonColor } : undefined;
  const boxStyle: CSSProperties | undefined = borderColor ? { borderColor } : undefined;

  const apply = () => {
    const checked = validateSetpoint(text, range);
    if (!checked.ok) {
      setFieldError(checked.reason === 'range'
        ? m.outOfRange.replace('{min}', String(range.min)).replace('{max}', String(range.max))
        : m.enterNumber);
      return;
    }
    setFieldError(null);
    write(ask.request(checked.value));
  };

  const current = ctl.displayValue ?? bound;
  const stepBy = (dir: -1 | 1) => {
    const base = current ?? range.min;
    write(ask.request(snapToStep(base + dir * range.step, range)));
  };

  const currentLine = showValue && bound !== null && (layout === 'input' || (current !== null && current !== bound)) ? (
    <p className="text-xs text-text-secondary">{m.current.replace('{value}', fmt(bound))}</p>
  ) : null;

  return (
    <ControlTile
      title={title}
      state={ctl.state}
      error={ctl.error}
      readOnly={readOnly}
      onRetry={ctl.retry}
      messages={messages}
      framed={framed}
      disabledReason={disabledReason}
      className={className}
    >
      {layout === 'stepper' ? (
        <div className="space-y-1">
          <div className="flex items-center gap-2" role="group" aria-label={title || 'Set point'}>
            <Button
              iconOnly
              aria-label={m.decrease}
              onClick={() => stepBy(-1)}
              disabled={locked || (current !== null && current <= range.min)}
              style={buttonStyle}
              className="h-9 w-9 shrink-0 text-lg leading-none"
            >
              −
            </Button>
            <output
              aria-live="polite"
              className="flex h-9 min-w-0 flex-1 items-center justify-center rounded-md border border-border bg-surface-base px-2 text-base font-semibold tabular-nums text-text-primary"
              style={{ ...boxStyle, ...valueStyle }}
            >
              {current !== null ? fmt(current) : '—'}
            </output>
            <Button
              iconOnly
              aria-label={m.increase}
              onClick={() => stepBy(1)}
              disabled={locked || (current !== null && current >= range.max)}
              style={buttonStyle}
              className="h-9 w-9 shrink-0 text-lg leading-none"
            >
              +
            </Button>
          </div>
          {currentLine}
        </div>
      ) : (
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
              style={{ ...boxStyle, ...valueStyle }}
              className={cn(
                'h-9 w-28 min-w-0 rounded-md border border-border bg-surface-base px-2 text-sm tabular-nums text-text-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus disabled:cursor-not-allowed disabled:opacity-50',
              )}
            />
            {unit && <span className="text-sm text-text-secondary">{unit}</span>}
            <Button type="submit" disabled={locked} loading={pending} style={buttonStyle}>{m.apply}</Button>
          </div>
          {currentLine}
          {fieldError && <p id={errId} role="alert" className="text-xs text-error">{fieldError}</p>}
        </form>
      )}
      {ask.asking && confirm !== 'none' && (
        <ControlConfirmPrompt mode={confirm} confirmText={confirmText} onConfirm={(typed) => write(ask.accept(typed))} onCancel={ask.cancel} messages={messages} />
      )}
    </ControlTile>
  );
}
