'use client';
import { Fragment } from 'react';

/**
 * The markdown of a block's help text, drawn as React elements: headings, paragraphs, lists, tables, fenced code,
 * `code`, **bold** and *italic*. Nothing else is read, and every piece of text goes in as a text node, never as HTML, so
 * a help text (or a copied tooltip, TB's old defect) cannot inject markup. The router editor has the same subset.
 */

type Inline = string | { code: string } | { strong: string } | { em: string };

function inlineParts(text: string): Inline[] {
  const out: Inline[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    out.push(t[0] === '`' ? { code: t.slice(1, -1) } : t.startsWith('**') ? { strong: t.slice(2, -2) } : { em: t.slice(1, -1) });
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Inlines({ text }: { text: string }) {
  return (
    <>
      {inlineParts(text).map((p, i) => {
        if (typeof p === 'string') return <Fragment key={i}>{p}</Fragment>;
        if ('code' in p) return <code key={i} className="rounded bg-surface-sunken px-1 font-mono text-[0.85em]">{p.code}</code>;
        if ('strong' in p) return <strong key={i}>{p.strong}</strong>;
        return <em key={i}>{p.em}</em>;
      })}
    </>
  );
}

type Block =
  | { kind: 'heading'; level: 3 | 4; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'code'; text: string };

const cellsOf = (line: string) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

/** the blocks of a markdown text, in order */
export function parseMarkdown(md: string): Block[] {
  const lines = String(md ?? '').replace(/\r/g, '').split('\n');
  const out: Block[] = [];
  let para: string[] = [];
  let list: string[] | null = null;
  let table: { head: string[]; rows: string[][] } | null = null;
  let code: string[] | null = null;
  const flush = () => {
    if (para.length) { out.push({ kind: 'paragraph', text: para.join(' ') }); para = []; }
    if (list) { out.push({ kind: 'list', items: list }); list = null; }
    if (table) { out.push({ kind: 'table', ...table }); table = null; }
  };
  for (const l of lines) {
    if (code) {
      if (/^```/.test(l)) { out.push({ kind: 'code', text: code.join('\n') }); code = null; } else code.push(l);
      continue;
    }
    if (/^```/.test(l)) { flush(); code = []; continue; }
    let m: RegExpExecArray | null;
    if ((m = /^(#{1,4})\s+(.*)$/.exec(l))) { flush(); out.push({ kind: 'heading', level: m[1].length === 1 ? 3 : 4, text: m[2] }); continue; }
    if ((m = /^\s*[-*]\s+(.*)$/.exec(l))) {
      if (para.length || table) flush();
      (list ??= []).push(m[1]);
      continue;
    }
    if (/^\s*\|/.test(l)) {
      if (para.length || list) flush();
      const cells = cellsOf(l);
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
      if (!table) table = { head: cells, rows: [] }; else table.rows.push(cells);
      continue;
    }
    if (!l.trim()) { flush(); continue; }
    if (list || table) flush();
    para.push(l.trim());
  }
  if (code) out.push({ kind: 'code', text: code.join('\n') });
  flush();
  return out;
}

/** the first paragraph as plain text (the marks taken off), for a hover hint; empty when there is none */
export function firstParagraph(md: string): string {
  const p = parseMarkdown(md).find((b): b is Extract<Block, { kind: 'paragraph' }> => b.kind === 'paragraph');
  return p ? inlineParts(p.text).map((x) => (typeof x === 'string' ? x : 'code' in x ? x.code : 'strong' in x ? x.strong : x.em)).join('') : '';
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      {parseMarkdown(text).map((b, i) => {
        switch (b.kind) {
          case 'heading': return b.level === 3
            ? <h3 key={i} className="mb-1.5 mt-3 text-sm font-semibold text-text-primary first:mt-0"><Inlines text={b.text} /></h3>
            : <h4 key={i} className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-text-secondary first:mt-0"><Inlines text={b.text} /></h4>;
          case 'paragraph': return <p key={i} className="mb-2 text-xs leading-relaxed text-text-primary"><Inlines text={b.text} /></p>;
          case 'list': return <ul key={i} className="mb-2 list-disc space-y-0.5 pl-5 text-xs leading-relaxed text-text-primary">{b.items.map((it, k) => <li key={k}><Inlines text={it} /></li>)}</ul>;
          case 'table': return (
            <div key={i} className="mb-2 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead><tr>{b.head.map((c, k) => <th key={k} className="border-b border-border py-1 pr-3 font-semibold"><Inlines text={c} /></th>)}</tr></thead>
                <tbody>{b.rows.map((r, k) => <tr key={k}>{r.map((c, j) => <td key={j} className="border-b border-border py-1 pr-3 align-top"><Inlines text={c} /></td>)}</tr>)}</tbody>
              </table>
            </div>
          );
          case 'code': return <pre key={i} className="mb-2 overflow-x-auto rounded-md bg-surface-sunken p-2 font-mono text-[11px] leading-relaxed text-text-primary">{b.text}</pre>;
        }
      })}
    </div>
  );
}
