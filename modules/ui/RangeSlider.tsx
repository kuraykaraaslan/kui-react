'use client';
import { cn } from '@/libs/utils/cn';
import { useCallback, useEffect, useId, useRef } from 'react';

const THUMB_CLASSES =
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface-base [&::-webkit-slider-thumb]:shadow ' +
  '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface-base [&::-moz-range-thumb]:bg-primary ' +
  'focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed';

type BaseProps = {
  label?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  className?: string;
};

type SingleProps = BaseProps & {
  range?: false;
  value: number;
  /** Fires on every step while dragging (for the live label). */
  onChange: (value: number) => void;
  /**
   * Fires once with the final value: on pointer up, after `commitIdleMs` of keyboard idle,
   * and on blur — never per step. Use it for slow writes (a device, a server setting).
   */
  onCommit?: (value: number) => void;
  /** An asynchronous write is in flight: the thumb is disabled and `aria-busy` is set. */
  pending?: boolean;
  /** Keyboard idle time before `onCommit` fires. Default = 400. */
  commitIdleMs?: number;
};

type RangeProps = BaseProps & {
  range: true;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

type RangeSliderProps = SingleProps | RangeProps;

const COMMIT_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown']);

/** Commit-on-release for the single slider: dedupes so one gesture commits exactly once. */
function useCommitOnRelease(onCommit: ((v: number) => void) | undefined, idleMs: number) {
  const latest = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cb = useRef(onCommit);
  useEffect(() => { cb.current = onCommit; });
  const clear = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
  const flush = useCallback(() => {
    clear();
    const v = latest.current;
    latest.current = null;
    if (v !== null) cb.current?.(v);
  }, []);
  useEffect(() => clear, []);
  const track = (v: number) => { latest.current = v; };
  const afterKey = () => { clear(); timer.current = setTimeout(flush, idleMs); };
  return { track, flush, afterKey };
}

export function RangeSlider(props: RangeSliderProps) {
  const { label, hint, min = 0, max = 100, step = 1, disabled, showValue = true, className } = props;
  const id = useId();
  const single = props.range ? null : props;
  const commit = useCommitOnRelease(single?.onCommit, single?.commitIdleMs ?? 400);
  const hintId = hint ? `${id}-hint` : undefined;

  if (props.range) {
    const [lo, hi] = props.value;
    const pctLo = ((lo - min) / (max - min)) * 100;
    const pctHi = ((hi - min) / (max - min)) * 100;

    return (
      <div className={cn('space-y-2', className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between text-sm">
            {label && <span className="font-medium text-text-primary">{label}</span>}
            {showValue && <span className="tabular-nums text-text-secondary">{lo} – {hi}</span>}
          </div>
        )}
        <div className="relative h-5" aria-describedby={hintId}>
          <div className="pointer-events-none absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-surface-sunken" />
          <div
            className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
            style={{ left: `${pctLo}%`, right: `${100 - pctHi}%` }}
          />
          <input
            type="range"
            aria-label={label ? `${label} minimum` : 'Minimum value'}
            min={min}
            max={max}
            step={step}
            value={lo}
            disabled={disabled}
            onChange={(e) => props.onChange([Math.min(Number(e.target.value), hi), hi])}
            className={cn('pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto', THUMB_CLASSES)}
          />
          <input
            type="range"
            aria-label={label ? `${label} maximum` : 'Maximum value'}
            min={min}
            max={max}
            step={step}
            value={hi}
            disabled={disabled}
            onChange={(e) => props.onChange([lo, Math.max(Number(e.target.value), lo)])}
            className={cn('pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto', THUMB_CLASSES)}
          />
        </div>
        {hint && <p id={hintId} className="text-xs text-text-secondary">{hint}</p>}
      </div>
    );
  }

  const pct = ((props.value - min) / (max - min)) * 100;
  return (
    <div className={cn('space-y-2', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <label htmlFor={id} className="font-medium text-text-primary">{label}</label>}
          {showValue && <span className="tabular-nums text-text-secondary">{props.value}</span>}
        </div>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={props.value}
        disabled={disabled || props.pending}
        aria-busy={props.pending || undefined}
        aria-describedby={hintId}
        onChange={(e) => { const v = Number(e.target.value); commit.track(v); props.onChange(v); }}
        onPointerUp={props.onCommit ? commit.flush : undefined}
        onKeyUp={props.onCommit ? (e) => { if (COMMIT_KEYS.has(e.key)) commit.afterKey(); } : undefined}
        onBlur={props.onCommit ? commit.flush : undefined}
        style={{ backgroundImage: `linear-gradient(to right, var(--primary) ${pct}%, var(--surface-sunken) ${pct}%)` }}
        className={cn('h-1.5 w-full appearance-none rounded-full', THUMB_CLASSES)}
      />
      {hint && <p id={hintId} className="text-xs text-text-secondary">{hint}</p>}
    </div>
  );
}
