// A small, safe markdown subset for the `content.markdown` widget. Pure, no React.
//
// Ported from next-boilerplate's content-logic (phase 14): headings, paragraphs, lists, quotes,
// fenced code, `---`, `code`, **strong**, *em*/_em_, [label](target). HTML is not a construct here:
// `<script>` is just text and React escapes it. Link targets go through `resolveLink`; an unsafe
// target keeps its label as plain text.
//
// `{{field}}` placeholders (and `{{param_<key>}}` board parameters) are replaced AFTER parsing, inside text
// nodes only, so a value can never be read as markdown (or as anything but text).

import { resolveLink } from './content-logic';

export type MdInline =
  | { t: 'text'; text: string }
  | { t: 'field'; key: string }
  | { t: 'strong'; children: MdInline[] }
  | { t: 'em'; children: MdInline[] }
  | { t: 'code'; text: string }
  | { t: 'link'; href: string; external: boolean; children: MdInline[] }
  /** `[label](action:<id>)`: a click target the host's `onElementClick(id)` handles. Never an href. */
  | { t: 'action'; id: string; children: MdInline[] };

/** The only shape of an in-text action target: `action:` and a short identifier. */
export const ACTION_TARGET = /^action:([A-Za-z0-9_-]{1,64})$/;

export type MdBlock =
  | { t: 'heading'; level: 1 | 2 | 3 | 4; children: MdInline[] }
  | { t: 'paragraph'; children: MdInline[] }
  | { t: 'ul' | 'ol'; items: MdInline[][] }
  | { t: 'quote'; children: MdInline[] }
  | { t: 'code'; text: string }
  | { t: 'hr' };

export const MARKDOWN_MAX_CHARS = 20_000;

// Placeholders become private-use sentinels before parsing, so no markdown rule can touch them.
const OPEN = '';
const CLOSE = '';
const FIELD_RE = /\{\{\s*([A-Za-z_][\w.-]{0,63})\s*\}\}/g;
const SENTINEL_RE = new RegExp(`${OPEN}([^${CLOSE}]{1,64})${CLOSE}`, 'g');

/** Split a text run into text and field nodes. */
function splitFields(text: string): MdInline[] {
  const out: MdInline[] = [];
  let last = 0;
  for (const m of text.matchAll(SENTINEL_RE)) {
    if (m.index! > last) out.push({ t: 'text', text: text.slice(last, m.index) });
    out.push({ t: 'field', key: m[1] });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ t: 'text', text: text.slice(last) });
  return out;
}

/** Turn sentinels back into their literal `{{key}}` (inside code and link targets). */
const literal = (text: string) => text.replace(SENTINEL_RE, (_, k: string) => `{{${k}}}`);

/** Inline spans. Nesting depth is capped so a pathological string cannot recurse without bound. */
export function parseInline(src: string, depth = 0): MdInline[] {
  const out: MdInline[] = [];
  let i = 0;
  let buf = '';
  const flush = () => { if (buf) { out.push(...splitFields(buf)); buf = ''; } };
  while (i < src.length) {
    const rest = src.slice(i);
    let m: RegExpExecArray | null;
    if (depth < 4 && (m = /^`([^`\n]+)`/.exec(rest))) {
      flush(); out.push({ t: 'code', text: literal(m[1]) }); i += m[0].length; continue;
    }
    if (depth < 4 && (m = /^\*\*([^\n]+?)\*\*/.exec(rest))) {
      flush(); out.push({ t: 'strong', children: parseInline(m[1], depth + 1) }); i += m[0].length; continue;
    }
    // `_em_` only at a word boundary, so snake_case_names stay literal.
    const underscoreOk = i === 0 || !/\w/.test(src[i - 1]);
    if (depth < 4 && (m = (underscoreOk ? /^(?:\*([^*\s][^*\n]*?)\*|_([^_\s][^_\n]*?)_(?!\w))/ : /^\*([^*\s][^*\n]*?)\*/).exec(rest))) {
      flush(); out.push({ t: 'em', children: parseInline(m[1] ?? m[2], depth + 1) }); i += m[0].length; continue;
    }
    if (depth < 4 && (m = /^\[([^\]\n]+)\]\(((?:[^()\n]|\([^()\n]*\))+)\)/.exec(rest))) {
      flush();
      const children = parseInline(m[1], depth + 1);
      const target = literal(m[2]).trim();
      const action = ACTION_TARGET.exec(target);
      const link = action ? null : resolveLink(target);
      if (action) out.push({ t: 'action', id: action[1], children });
      else if (link) out.push({ t: 'link', href: link.href, external: link.external, children });
      else out.push(...children);
      i += m[0].length; continue;
    }
    buf += src[i];
    i += 1;
  }
  flush();
  return out;
}

/** Block structure. Deliberately small: a board card, not a CMS. */
export function parseMarkdown(source: string): MdBlock[] {
  const clean = source
    .slice(0, MARKDOWN_MAX_CHARS)
    .replace(/[]/g, '')
    .replace(FIELD_RE, (_, k: string) => `${OPEN}${k}${CLOSE}`);
  const lines = clean.replace(/\r\n?/g, '\n').split('\n');
  const blocks: MdBlock[] = [];
  let para: string[] = [];
  const flushPara = () => {
    if (para.length) blocks.push({ t: 'paragraph', children: parseInline(para.join(' ')) });
    para = [];
  };
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^```/.test(line)) {
      flushPara();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i += 1; }
      blocks.push({ t: 'code', text: literal(code.join('\n')) });
      continue;
    }
    if (!line.trim()) { flushPara(); continue; }
    let m: RegExpExecArray | null;
    if ((m = /^(#{1,6})\s+(.*)$/.exec(line))) {
      flushPara();
      blocks.push({ t: 'heading', level: Math.min(4, m[1].length) as 1 | 2 | 3 | 4, children: parseInline(m[2].trim()) });
      continue;
    }
    if (/^\s*(?:---+|\*\*\*+)\s*$/.test(line)) { flushPara(); blocks.push({ t: 'hr' }); continue; }
    if (/^>\s?/.test(line)) {
      flushPara();
      const quote: string[] = [line.replace(/^>\s?/, '')];
      while (i + 1 < lines.length && /^>\s?/.test(lines[i + 1])) { i += 1; quote.push(lines[i].replace(/^>\s?/, '')); }
      blocks.push({ t: 'quote', children: parseInline(quote.join(' ')) });
      continue;
    }
    const listKind = /^\s*[-*+]\s+/.test(line) ? 'ul' : /^\s*\d+[.)]\s+/.test(line) ? 'ol' : null;
    if (listKind) {
      flushPara();
      const marker = listKind === 'ul' ? /^\s*[-*+]\s+/ : /^\s*\d+[.)]\s+/;
      const items: MdInline[][] = [parseInline(line.replace(marker, ''))];
      while (i + 1 < lines.length && marker.test(lines[i + 1])) { i += 1; items.push(parseInline(lines[i].replace(marker, ''))); }
      blocks.push({ t: listKind, items });
      continue;
    }
    para.push(line.trim());
  }
  flushPara();
  return blocks;
}
