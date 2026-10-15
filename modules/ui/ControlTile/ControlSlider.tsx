'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/libs/utils/cn';
import { useAsyncControl } from '@/libs/hooks/useAsyncControl';
import { ControlTile, type ControlMessages } from './ControlTile';
import { asNumber, formatValue, snapToStep, toRange } from './control-logic';
import { ControlConfirmPrompt, useControlConfirm, type ControlConfirmation, type ControlConfirmMessages, type ControlConfirmMode } from './ControlConfirm';

/** Slider colours. Any CSS colour or a theme token; unset parts use the theme. */
export type ControlSliderColors = {
  main?: string;
  track?: string;
  disabledMain?: string;
  disabledTrack?: string;
};

export type ControlSliderProps = {
  title?: string;
  /** The bound number. */
  value: unknown;
  reported?: unknown;
  /** Written ONCE per gesture (pointer up / keyboard idle / blur), never per step; or after a pause with `commitMode="debounced"`. */
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
  /** Formats every number shown (value, min, max). Overrides `unit` / `decimals`. */
  format?: (value: number) => string;
  /** Formats the "Reported: {value}" line; default `Reported: ${value}`. */
  reportedLabel?: (value: string) => string;
  /** `default`: slider, then min · value · max. `extended`: large value above, icons at both ends. `compact`: one line. */
  layout?: 'default' | 'extended' | 'compact';
  /** Show the current value. Default `true`. */
  showValue?: boolean;
  /** Inline style (font, colour) of the value. */
  valueStyle?: CSSProperties;
  /** Show the minimum and maximum. Default `true`. */
  showTicks?: boolean;
  /** Draw this many evenly spaced marks under the track (2–21). */
  tickMarks?: number;
  colors?: ControlSliderColors;
  /** Icons at the start and end of the track (layout `extended`). */
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** `release` (default): once per gesture. `debounced`: also while dragging, after `debounceMs` without movement. */
  commitMode?: 'release' | 'debounced';
  debounceMs?: number;
  readOnly?: boolean;
  disabled?: boolean;
  /** Why it is disabled; shown in a tooltip. Implies `disabled`. */
  disabledReason?: string;
  /** Draw the tile frame. Default `true`. */
  framed?: boolean;
  timeoutMs?: number;
  messages?: Partial<ControlMessages & ControlConfirmMessages>;
  className?: string;
};

const COMMIT_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown']);
const KEY_IDLE_MS = 400;

/** One gesture commits exactly once: pointer up, keyboard idle, blur, or (debounced) a pause. */
function useGestureCommit(onCommit: (v: number) => void) {
  const latest = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cb = useRef(onCommit);
  useEffect(() => { cb.current = onCommit; });
  const clear = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
  useEffect(() => clear, []);
  const flush = useCallback(() => {
    clear();
    const v = latest.current;
    latest.current = null;
    if (v !== null) cb.current(v);
  }, []);
  const track = (v: number) => { latest.current = v; };
  const later = (ms: number) => { clear(); timer.current = setTimeout(flush, ms); };
  return { track, flush, later };
}

/** ControlSlider — drag moves only the local value; the write happens on release; failure restores the bound value. */
export function ControlSlider({
  title, value, reported, onCommit, min, max, step, unit, decimals = 0, format, reportedLabel = (v) => `Reported: ${v}`,
  layout = 'default', showValue = true, valueStyle, showTicks = true, tickMarks, colors, startIcon, endIcon,
  commitMode = 'release', debounceMs = 500,
  readOnly = false, disabled = false, disabledReason, framed = true, timeoutMs, messages, className,
  confirm = 'none', confirmText,
}: ControlSliderProps) {
  const range = toRange({ min, max, step });
  const bound = asNumber(value);
  const rep = reported === undefined ? undefined : asNumber(reported);
  const ask = useControlConfirm<number>(confirm);
  const ctl = useAsyncControl<number>({ value: bound, reported: rep, commit: (v) => (ask.confirmation.current ? onCommit(v, ask.confirmation.current) : onCommit(v)), timeoutMs });
  const write = (r: { value: number } | undefined) => { if (r) { setDraft(null); ctl.set(r.value); } };
  // The local drag value; it is dropped once the bound value changes underneath it.
  const [dragged, setDraft] = useState<{ v: number; base: number | null } | null>(null);
  const draft = dragged && dragged.base === bound ? dragged.v : null;
  const shown = draft ?? ctl.displayValue ?? range.min;
  const fmt = format ?? ((n: number) => `${formatValue(n, decimals)}${unit ? ` ${unit}` : ''}`);
  const text = fmt(shown);
  const locked = disabled || readOnly || !!disabledReason;
  const pending = ctl.state === 'pending';

  // Without confirmation the draft is dropped as the write starts; with it, the draft stays until accepted or cancelled.
  const gesture = useGestureCommit((v) => write(ask.request(v)));

  const pct = ((shown - range.min) / (range.max - range.min)) * 100;
  const main = (locked ? colors?.disabledMain : undefined) ?? colors?.main ?? 'var(--primary)';
  const track = (locked ? colors?.disabledTrack : undefined) ?? colors?.track ?? 'var(--surface-sunken)';
  const inputStyle = {
    backgroundImage: `linear-gradient(to right, ${main} ${pct}%, ${track} ${pct}%)`,
    '--kui-slider-thumb': main,
  } as CSSProperties;
  const marks = typeof tickMarks === 'number' && tickMarks >= 2 ? Math.min(21, Math.floor(tickMarks)) : 0;

  const slider = (
    <div className="min-w-0 flex-1">
      <input
        type="range"
        aria-label={title || 'Value'}
        aria-valuetext={text}
        aria-busy={pending || undefined}
        min={range.min}
        max={range.max}
        step={range.step}
        value={shown}
        disabled={locked || pending || !!ask.asking}
        onChange={(e) => {
          const v = snapToStep(Number(e.target.value), range);
          setDraft({ v, base: bound });
          gesture.track(v);
          if (commitMode === 'debounced') gesture.later(Math.max(100, debounceMs));
        }}
        onPointerUp={gesture.flush}
        onKeyUp={(e) => { if (COMMIT_KEYS.has(e.key)) gesture.later(commitMode === 'debounced' ? Math.max(100, debounceMs) : KEY_IDLE_MS); }}
        onBlur={gesture.flush}
        style={inputStyle}
        className={cn(
          'h-1.5 w-full cursor-pointer appearance-none rounded-full',
          '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface-base [&::-webkit-slider-thumb]:bg-[var(--kui-slider-thumb)] [&::-webkit-slider-thumb]:shadow',
          '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface-base [&::-moz-range-thumb]:bg-[var(--kui-slider-thumb)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          'disabled:cursor-not-allowed',
          locked && !colors?.disabledMain && 'disabled:opacity-50',
        )}
      />
      {marks > 0 && (
        <div aria-hidden="true" className="mt-1 flex justify-between px-1.5">
          {Array.from({ length: marks }, (_, i) => <span key={i} className="h-1.5 w-px bg-border-strong" />)}
        </div>
      )}
    </div>
  );
  const valueEl = showValue ? (
    <span className="font-semibold tabular-nums text-text-primary" aria-live="off" style={valueStyle}>{text}</span>
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
      reportedText={bound !== null && draft !== null && draft !== bound ? reportedLabel(fmt(bound)) : undefined}
      className={className}
    >
      {layout === 'compact' ? (
        <div className="flex items-center gap-3">
          {slider}
          {valueEl && <span className="shrink-0 text-sm">{valueEl}</span>}
        </div>
      ) : layout === 'extended' ? (
        <div className="space-y-2">
          {valueEl && <div className="text-center text-2xl">{valueEl}</div>}
          <div className="flex items-center gap-3">
            {startIcon && <span aria-hidden="true" className="inline-flex shrink-0 items-center">{startIcon}</span>}
            {slider}
            {endIcon && <span aria-hidden="true" className="inline-flex shrink-0 items-center">{endIcon}</span>}
          </div>
          {showTicks && (
            <div className="flex justify-between text-xs tabular-nums text-text-secondary"><span>{fmt(range.min)}</span><span>{fmt(range.max)}</span></div>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {slider}
          {(showTicks || valueEl) && (
            <div className="flex justify-between text-xs tabular-nums text-text-secondary">
              <span>{showTicks ? fmt(range.min) : null}</span>
              {valueEl}
              <span>{showTicks ? fmt(range.max) : null}</span>
            </div>
          )}
        </div>
      )}
      {ask.asking && confirm !== 'none' && (
        <ControlConfirmPrompt
          mode={confirm}
          confirmText={confirmText}
          onConfirm={(typed) => write(ask.accept(typed))}
          onCancel={() => { ask.cancel(); setDraft(null); }}
          messages={messages}
        />
      )}
    </ControlTile>
  );
}
