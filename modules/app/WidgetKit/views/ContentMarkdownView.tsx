'use client';
import { Fragment, useMemo, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/libs/utils/cn';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle, formatValue, type ValueFormat } from '../settings/style';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { parseMarkdown, type MdInline } from './markdown';
import { hostLink } from './content-logic';

type S = {
  layout?: 'plain' | 'callout';
  content?: string;
  calloutColor?: string;
  calloutBackground?: string;
  align?: 'start' | 'center' | 'end';
  textSize?: 'sm' | 'md' | 'lg';
  textFont?: FontValue;
  textColor?: string;
  headingColor?: string;
  linkColor?: string;
  missingText?: string;
};

const SIZE = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' } as const;
const ALIGN = { start: 'text-left', center: 'text-center', end: 'text-right' } as const;

/** A record value by key (`a.b` reads nested objects). */
function readField(record: Record<string, unknown>, key: string): unknown {
  let cur: unknown = record;
  for (const part of key.split('.')) {
    if (!cur || typeof cur !== 'object' || Array.isArray(cur)) return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return cur;
}

/** A record value as text: numbers through `$format`; anything not a scalar is missing. */
export function fieldText(value: unknown, format: ValueFormat, missing: string, locale?: string): string {
  if (typeof value === 'number') return Number.isFinite(value) ? formatValue(value, format, {}, locale) : missing;
  if (typeof value === 'string') return value === '' ? missing : value;
  if (typeof value === 'boolean') return String(value);
  return missing;
}

type Ctx = {
  record?: Record<string, unknown>;
  format: ValueFormat;
  missing: string;
  locale?: string;
  linkStyle?: CSSProperties;
  renderLink?: WidgetViewProps['renderLink'];
  resolveUrl?: WidgetViewProps['resolveUrl'];
  params?: Record<string, unknown>;
  onElementClick?: WidgetViewProps['onElementClick'];
};

/** A `{{key}}` placeholder's text: `param_<name>` reads board params, anything else the record. Unbound = literal. */
function placeholder(key: string, ctx: Ctx): string {
  if (key.startsWith('param_')) {
    return ctx.params ? fieldText(ctx.params[key.slice(6)], ctx.format, ctx.missing, ctx.locale) : `{{${key}}}`;
  }
  return ctx.record ? fieldText(readField(ctx.record, key), ctx.format, ctx.missing, ctx.locale) : `{{${key}}}`;
}

function Inline({ nodes, ctx }: { nodes: MdInline[]; ctx: Ctx }): ReactNode {
  return nodes.map((n, i): ReactNode => {
    switch (n.t) {
      case 'text': return <Fragment key={i}>{n.text}</Fragment>;
      // A record value is always a text node: React escapes it, it is never parsed.
      case 'field': return (
        <Fragment key={i}>{placeholder(n.key, ctx)}</Fragment>
      );
      case 'strong': return <strong key={i}><Inline nodes={n.children} ctx={ctx} /></strong>;
      case 'em': return <em key={i}><Inline nodes={n.children} ctx={ctx} /></em>;
      case 'code': return <code key={i} className="rounded bg-surface-overlay px-1 py-0.5 font-mono text-[0.85em]">{n.text}</code>;
      case 'action': {
        // Only clickable when the host handles element clicks; otherwise just its text, never an inert-looking control.
        const children = <Inline nodes={n.children} ctx={ctx} />;
        if (!ctx.onElementClick) return <Fragment key={i}>{children}</Fragment>;
        const onClick = ctx.onElementClick;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onClick(n.id)}
            className="cursor-pointer rounded-sm text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            style={ctx.linkStyle}
          >
            {children}
          </button>
        );
      }
      case 'link': {
        const cls = 'rounded-sm text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';
        const children = <Inline nodes={n.children} ctx={ctx} />;
        if (!n.external && ctx.renderLink) {
          return <span key={i} style={ctx.linkStyle}>{ctx.renderLink(n.href, children, cls)}</span>;
        }
        const href = hostLink({ href: n.href, external: n.external }, ctx.resolveUrl)?.href;
        if (!href) return <Fragment key={i}>{children}</Fragment>;
        return (
          <a
            key={i}
            href={href}
            className={cls}
            style={ctx.linkStyle}
            {...(n.external ? { target: '_blank', rel: 'noopener noreferrer nofollow' } : {})}
          >
            {children}
          </a>
        );
      }
    }
  });
}

/** `content.markdown`: author-written text from a parsed node tree, never an HTML string. */
export function ContentMarkdownView({ settings, format, data, locale, renderLink, resolveUrl, params, onElementClick }: WidgetViewProps) {
  const s = settings as S;
  const content = typeof s.content === 'string' ? s.content : '';
  const blocks = useMemo(() => parseMarkdown(content), [content]);
  const record = data.record?.record;
  const linkColor = cssColor(s.linkColor);
  const ctx: Ctx = {
    record: record && typeof record === 'object' ? record : undefined,
    format,
    missing: typeof s.missingText === 'string' ? s.missingText : '—',
    locale,
    linkStyle: linkColor ? { color: linkColor } : undefined,
    renderLink,
    resolveUrl,
    params: params && typeof params === 'object' ? params : undefined,
    onElementClick,
  };
  const headingStyle: CSSProperties | undefined = cssColor(s.headingColor) ? { color: cssColor(s.headingColor) } : undefined;
  const callout = s.layout === 'callout';

  return (
    <div
      className={cn(
        'h-full min-h-0 space-y-2 overflow-auto break-words text-text-primary',
        SIZE[s.textSize ?? 'md'] ?? SIZE.md,
        ALIGN[s.align ?? 'start'] ?? ALIGN.start,
        callout && 'rounded-md border-l-4 border-info bg-info-subtle p-3',
      )}
      style={{
        ...fontStyle(s.textFont, s.textColor),
        ...(callout && cssColor(s.calloutColor) ? { borderLeftColor: cssColor(s.calloutColor) } : {}),
        ...(callout && cssColor(s.calloutBackground) ? { background: cssColor(s.calloutBackground) } : {}),
      }}
    >
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'heading': return (
            <p key={i} className={cn('font-semibold', b.level <= 2 ? 'text-[1.15em]' : 'text-[1em]')} style={headingStyle}>
              <Inline nodes={b.children} ctx={ctx} />
            </p>
          );
          case 'paragraph': return <p key={i}><Inline nodes={b.children} ctx={ctx} /></p>;
          case 'quote': return (
            <blockquote key={i} className="border-l-2 border-border pl-3 text-text-secondary">
              <Inline nodes={b.children} ctx={ctx} />
            </blockquote>
          );
          case 'code': return <pre key={i} className="overflow-x-auto rounded bg-surface-overlay p-2 text-left font-mono text-xs">{b.text}</pre>;
          case 'hr': return <hr key={i} className="border-border" />;
          case 'ul':
          case 'ol': {
            const List = b.t;
            return (
              <List key={i} className={cn(b.t === 'ul' ? 'list-disc' : 'list-decimal', 'space-y-0.5 pl-5 text-left')}>
                {b.items.map((it, j) => <li key={j}><Inline nodes={it} ctx={ctx} /></li>)}
              </List>
            );
          }
        }
      })}
    </div>
  );
}

export const CONTENT_MARKDOWN_VIEW: WidgetKindView = {
  View: ContentMarkdownView,
  isEmpty: (_data, settings) => typeof settings.content !== 'string' || settings.content.trim() === '',
};
