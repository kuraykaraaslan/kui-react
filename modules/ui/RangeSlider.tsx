'use client';
import { cn } from '@/libs/utils/cn';
import { useId } from 'react';

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
  onChange: (value: number) => void;
};

type RangeProps = BaseProps & {
  range: true;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

type RangeSliderProps = SingleProps | RangeProps;

export function RangeSlider(props: RangeSliderProps) {
  const { label, hint, min = 0, max = 100, step = 1, disabled, showValue = true, className } = props;
  const id = useId();
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
        disabled={disabled}
        aria-describedby={hintId}
        onChange={(e) => props.onChange(Number(e.target.value))}
        style={{ backgroundImage: `linear-gradient(to right, var(--primary) ${pct}%, var(--surface-sunken) ${pct}%)` }}
        className={cn('h-1.5 w-full appearance-none rounded-full', THUMB_CLASSES)}
      />
      {hint && <p id={hintId} className="text-xs text-text-secondary">{hint}</p>}
    </div>
  );
}
