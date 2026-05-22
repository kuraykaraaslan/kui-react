'use client';
import { useState, useMemo } from 'react';
import { cn } from '@/libs/utils/cn';
import { CopyButton } from './CopyButton';
import type { ControlDef, PlaygroundDef } from '../data/showcase.types';

const DOT_GRID: React.CSSProperties = {
  backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
};

function initValues(controls: ControlDef[]): Record<string, unknown> {
  return Object.fromEntries(controls.map((c) => [c.key, c.default]));
}

function ControlInput({
  control,
  value,
  onChange,
}: {
  control: ControlDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const inputBase = cn(
    'w-full rounded-md border border-border bg-surface-base px-2.5 py-1.5 text-sm text-text-primary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-secondary select-none">
        {control.label}
      </label>

      {control.type === 'select' && (
        <select
          className={inputBase}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        >
          {control.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      )}

      {control.type === 'boolean' && (
        <button
          type="button"
          role="switch"
          aria-checked={value as boolean}
          onClick={() => onChange(!(value as boolean))}
          className={cn(
            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
            'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            value ? 'bg-primary' : 'bg-surface-sunken',
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
              value ? 'translate-x-4' : 'translate-x-0',
            )}
          />
        </button>
      )}

      {control.type === 'text' && (
        <input
          type="text"
          className={inputBase}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {control.type === 'number' && (
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={control.min ?? 0}
            max={control.max ?? 100}
            step={control.step ?? 1}
            value={value as number}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="text-xs font-mono text-text-secondary w-8 text-right tabular-nums">
            {value as number}
          </span>
        </div>
      )}
    </div>
  );
}

export function PropsEditor({ controls, render, generateCode }: PlaygroundDef) {
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    initValues(controls),
  );

  const set = (key: string, v: unknown) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const code = useMemo(
    () =>
      generateCode
        ? generateCode(values)
        : JSON.stringify(values, null, 2),
    [values, generateCode],
  );

  return (
    <div className="bg-surface-raised border border-border rounded-xl overflow-hidden mb-4">
      {/* header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-surface-overlay">
        <div className="flex items-center gap-2">
          <span className="text-text-disabled text-xs select-none" aria-hidden="true">⠿</span>
          <span className="text-sm font-semibold text-text-primary">Props Editor</span>
          <span className="text-xs text-text-secondary bg-primary-subtle text-primary px-2 py-0.5 rounded-full font-medium">
            Interactive
          </span>
        </div>
        <button
          type="button"
          onClick={() => setValues(initValues(controls))}
          className={cn(
            'px-2.5 py-1 text-xs rounded-md font-medium transition-colors',
            'bg-surface-overlay text-text-secondary hover:text-text-primary hover:bg-surface-sunken',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
          )}
        >
          Reset
        </button>
      </div>

      {/* body: preview + controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* preview pane */}
        <div
          className="lg:col-span-2 flex items-center justify-center p-10 min-h-48"
          style={DOT_GRID}
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            {render(values)}
          </div>
        </div>

        {/* controls pane */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-80 lg:max-h-none">
          {controls.map((control) => (
            <ControlInput
              key={control.key}
              control={control}
              value={values[control.key]}
              onChange={(v) => set(control.key, v)}
            />
          ))}
        </div>
      </div>

      {/* code bar */}
      <div className="flex items-center gap-4 border-t border-border bg-surface-sunken px-4 py-3">
        <pre className="flex-1 text-sm font-mono text-text-primary overflow-x-auto whitespace-pre">
          <code>{code}</code>
        </pre>
        <CopyButton code={code} />
      </div>
    </div>
  );
}
