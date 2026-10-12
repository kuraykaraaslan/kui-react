'use client';
import { useState } from 'react';
import { useMessages } from '../messages';

/** most children of one object or array that are drawn; the rest is counted ("… 12 more") */
export const TREE_MAX_CHILDREN = 200;

const LEAF: Record<string, string> = {
  string: 'whitespace-pre-wrap text-success-fg',
  number: 'text-info',
  boolean: 'text-warning-fg',
  null: 'text-text-disabled',
};

function Label({ name }: { name: string | number | null | undefined }) {
  return name == null ? null : <><span className="font-semibold text-text-primary">{String(name)}</span>: </>;
}

/**
 * A message value as the router's debug tab draws it: objects and arrays fold open, a key is bold, strings, numbers,
 * booleans and `null` have their own colours, a folded object shows the first three keys. The first level is open
 * when it has at most eight keys. Children are drawn only once a fold has been opened, so a large message stays cheap.
 * Everything is text, never HTML.
 */
export function JsonTree({ value, name, depth = 0 }: { value: unknown; name?: string | number | null; depth?: number }) {
  const m = useMessages();
  if (value === null || value === undefined || typeof value !== 'object') {
    const kind = value === null || value === undefined ? 'null' : typeof value === 'string' ? 'string' : typeof value === 'number' ? 'number' : 'boolean';
    const text = typeof value === 'string' ? `"${value}"` : String(value ?? 'null');
    return <div><Label name={name} /><span className={LEAF[kind]}>{text}</span></div>;
  }
  const arr = Array.isArray(value);
  const keys = Object.keys(value);
  const head = arr ? `array[${value.length}]` : keys.length ? 'object' : '{ }';
  const entries: [string | number, unknown][] = arr ? value.map((x, i) => [i, x]) : keys.map((k) => [k, (value as Record<string, unknown>)[k]]);
  return <Fold name={name} head={head} peek={!arr && keys.length ? ` { ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? ', …' : ''} }` : ''} open={depth === 0 && keys.length <= 8}>
    {entries.slice(0, TREE_MAX_CHILDREN).map(([k, x]) => <JsonTree key={k} value={x} name={k} depth={depth + 1} />)}
    {keys.length > TREE_MAX_CHILDREN && <div className="text-xs text-text-secondary">{m.insMore(keys.length - TREE_MAX_CHILDREN)}</div>}
  </Fold>;
}

function Fold({ name, head, peek, open, children }: { name?: string | number | null; head: string; peek: string; open: boolean; children: React.ReactNode }) {
  const [filled, setFilled] = useState(open);
  return (
    <details open={open} onToggle={(e) => { if ((e.currentTarget as HTMLDetailsElement).open) setFilled(true); }}>
      <summary className="cursor-pointer list-none before:inline-block before:w-[.9rem] before:text-text-secondary before:transition-transform before:duration-150 before:content-['▸'] [&::-webkit-details-marker]:hidden [[open]>&]:before:rotate-90">
        <Label name={name} />
        <span className="italic text-text-secondary">{head}</span>
        {peek && <span className="text-text-disabled">{peek}</span>}
      </summary>
      {filled && <div className="ml-1 border-l border-dashed border-border pl-4">{children}</div>}
    </details>
  );
}
