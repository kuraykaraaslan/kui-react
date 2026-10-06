'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import type { FieldOption, FieldSchema } from '../types';
import type { FieldOverrides } from '../schema-form.context';

export const controlCls =
  'w-full px-3 py-2 rounded-md text-sm bg-surface-raised text-text-primary border border-border ' +
  'placeholder:text-text-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ' +
  'disabled:opacity-50';

const optVal = (o: FieldOption): string => (typeof o === 'string' ? o : o.value);
const optLabel = (o: FieldOption): string => (typeof o === 'string' ? o : o.label);

export interface FieldControlProps {
  id: string;
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
  overrides?: FieldOverrides;
  /** Reports a JSON parse problem for `json` fields (the value is not updated then). */
  onJsonError?: (hasError: boolean) => void;
  depth?: number;
  invalid?: boolean;
  describedBy?: string;
}

/** The input for one field. Pure presentation: values go in, `onChange` comes out. */
export function FieldControl(props: FieldControlProps) {
  const { id, field, value, onChange, overrides, invalid, describedBy } = props;
  const Override = overrides?.[field.type];
  if (Override) return <Override id={id} field={field} value={value} onChange={onChange} />;

  const aria = { 'aria-invalid': invalid || undefined, 'aria-describedby': describedBy } as const;
  const str = (value ?? field.value ?? '') as string;

  switch (field.type) {
    case 'text':
    case 'url':
      return (
        <input id={id} type={field.type} value={str} placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)} className={controlCls} {...aria} />
      );
    case 'date':
      return <input id={id} type="date" value={str} onChange={(e) => onChange(e.target.value)} className={controlCls} {...aria} />;
    case 'datetime':
      return <input id={id} type="datetime-local" value={str} onChange={(e) => onChange(e.target.value)} className={controlCls} {...aria} />;
    case 'textarea':
      return (
        <textarea id={id} rows={3} value={str} placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)} className={cn(controlCls, 'resize-y')} {...aria} />
      );
    case 'number':
      return (
        <input id={id} type="number" min={field.min} max={field.max} step={field.step}
          value={typeof value === 'number' ? value : typeof field.value === 'number' && value === undefined ? field.value : ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
          className={controlCls} {...aria} />
      );
    case 'boolean':
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-text-secondary">
          <input id={id} type="checkbox" checked={Boolean(value ?? field.value ?? false)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded accent-primary focus-visible:ring-2 focus-visible:ring-border-focus" {...aria} />
          {field.placeholder || 'Enabled'}
        </label>
      );
    case 'select':
      return (
        <select id={id} value={str} onChange={(e) => onChange(e.target.value)} className={controlCls} {...aria}>
          {!field.required && <option value="">-</option>}
          {(field.options ?? []).map((o) => <option key={optVal(o)} value={optVal(o)}>{optLabel(o)}</option>)}
        </select>
      );
    case 'multi-select':
      return <MultiSelectControl {...props} />;
    case 'color':
      return <ColorControl {...props} />;
    case 'json':
      return <JsonControl {...props} />;
    case 'repeater':
      return <RepeaterControl {...props} />;
    case 'rich-text':
      return (
        <textarea id={id} rows={6} value={str} placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)} className={cn(controlCls, 'font-mono text-xs')} {...aria} />
      );
    case 'link':
    case 'background':
    case 'media':
      // Compound app-bound values with no renderer here: edit the raw JSON.
      return <JsonControl {...props} />;
    default:
      // icon, img, symbol, color-token, remote-select ...: degrade to a text
      // input instead of crashing; the host plugs a real picker in via overrides.
      return (
        <input id={id} type="text" value={typeof value === 'string' ? value : ''} placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)} className={controlCls} {...aria} />
      );
  }
}

function MultiSelectControl({ id, field, value, onChange }: FieldControlProps) {
  const current = Array.isArray(value) ? (value as string[]) : [];
  const options = field.options ?? [];
  const toggle = (v: string) => onChange(current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
  if (options.length === 0) {
    return (
      <input id={id} type="text" value={current.join(', ')} placeholder={field.placeholder || 'Comma separated'}
        onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} className={controlCls} />
    );
  }
  return (
    <div id={id} role="group" className="flex flex-wrap gap-x-4 gap-y-1.5">
      {options.map((o) => (
        <label key={optVal(o)} className="inline-flex items-center gap-1.5 text-sm text-text-secondary cursor-pointer">
          <input type="checkbox" checked={current.includes(optVal(o))} onChange={() => toggle(optVal(o))}
            className="h-4 w-4 rounded accent-primary" />
          {optLabel(o)}
        </label>
      ))}
    </div>
  );
}

function ColorControl({ id, value, field, onChange }: FieldControlProps) {
  const hex = typeof value === 'string' ? value : typeof field.value === 'string' ? field.value : '';
  const swatch = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#000000';
  return (
    <div className="flex items-center gap-2">
      <input type="color" aria-label={`${field.label} picker`} value={swatch}
        onChange={(e) => onChange(e.target.value)} className="h-9 w-12 rounded border border-border bg-transparent p-0.5" />
      <input id={id} type="text" value={hex} placeholder="#rrggbb" onChange={(e) => onChange(e.target.value)} className={controlCls} />
    </div>
  );
}

function JsonControl({ id, value, field, onChange, onJsonError, invalid }: FieldControlProps) {
  const [raw, setRaw] = useState<string>(() => {
    const v = value ?? field.value;
    return v === undefined ? '' : JSON.stringify(v, null, 2);
  });
  const [bad, setBad] = useState(false);
  return (
    <>
      <textarea id={id} rows={5} value={raw} spellCheck={false} placeholder={field.placeholder || '{ }'}
        aria-invalid={bad || invalid || undefined}
        onChange={(e) => {
          const text = e.target.value;
          setRaw(text);
          if (!text.trim()) { setBad(false); onJsonError?.(false); onChange(undefined); return; }
          try { const parsed = JSON.parse(text); setBad(false); onJsonError?.(false); onChange(parsed); }
          catch { setBad(true); onJsonError?.(true); }
        }}
        className={cn(controlCls, 'font-mono text-xs', bad && 'border-error')} />
      {bad && <p role="alert" className="mt-1 text-xs text-error">Invalid JSON</p>}
    </>
  );
}

type Row = Record<string, unknown>;

function RepeaterControl({ id, field, value, onChange, overrides, depth = 0 }: FieldControlProps) {
  const sub = field.fields ?? {};
  const items: Row[] = Array.isArray(value) ? (value as Row[]) : [];
  const set = (i: number, k: string, v: unknown) => onChange(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const move = (i: number, d: -1 | 1) => {
    const t = i + d;
    if (t < 0 || t >= items.length) return;
    const next = [...items];
    [next[i], next[t]] = [next[t], next[i]];
    onChange(next);
  };
  const add = () => onChange([...items, Object.fromEntries(
    Object.entries(sub).map(([k, f]) => [k, f.type === 'repeater' ? [] : f.value ?? (f.type === 'boolean' ? false : '')]),
  )]);
  const btn = 'px-1.5 py-0.5 text-xs rounded text-text-secondary hover:text-text-primary disabled:opacity-30 focus-visible:ring-2 focus-visible:ring-border-focus';
  const title = (it: Row, i: number) => {
    for (const [k, f] of Object.entries(sub)) if (['text', 'url', 'select'].includes(f.type) && it[k]) return String(it[k]);
    return `Item ${i + 1}`;
  };
  return (
    <div id={id} className="space-y-2">
      {items.map((it, i) => (
        <details key={i} open={i === items.length - 1} className="rounded-lg border border-border">
          <summary className="flex items-center justify-between px-3 py-2 cursor-pointer select-none bg-surface-overlay">
            <span className="text-xs font-medium text-text-secondary truncate">{title(it, i)}</span>
            <span className="flex gap-0.5">
              <button type="button" className={btn} disabled={i === 0} aria-label="Move up" onClick={(e) => { e.preventDefault(); move(i, -1); }}>Up</button>
              <button type="button" className={btn} disabled={i === items.length - 1} aria-label="Move down" onClick={(e) => { e.preventDefault(); move(i, 1); }}>Down</button>
              <button type="button" className={cn(btn, 'hover:text-error')} aria-label="Remove item" onClick={(e) => { e.preventDefault(); onChange(items.filter((_, j) => j !== i)); }}>Remove</button>
            </span>
          </summary>
          <div className="p-3 space-y-3 border-t border-border">
            {Object.entries(sub).map(([k, f]) => {
              const cid = `${id}-${i}-${k}`;
              if (f.type === 'repeater' && depth >= 1) return null; // nesting is capped at two levels
              return (
                <div key={k}>
                  <label htmlFor={cid} className="block mb-1 text-[11px] text-text-secondary">{f.label}</label>
                  <FieldControl id={cid} field={f} value={it[k]} onChange={(v) => set(i, k, v)} overrides={overrides} depth={depth + 1} />
                </div>
              );
            })}
          </div>
        </details>
      ))}
      <button type="button" onClick={add}
        className="w-full py-2 text-xs rounded-md border border-dashed border-border text-text-secondary hover:text-text-primary hover:border-border-strong focus-visible:ring-2 focus-visible:ring-border-focus">
        Add item
      </button>
    </div>
  );
}
