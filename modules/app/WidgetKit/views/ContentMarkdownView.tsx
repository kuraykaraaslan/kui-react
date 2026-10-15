'use client';
import { Fragment, useMemo, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/libs/utils/cn';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle, formatValue, type ValueFormat } from '../settings/style';
import { SettingIcon } from '../WidgetKitContext';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { parseMarkdown, type MdInline } from './markdown';
import { hostLink } from './content-logic';
import { Row } from './ui';

type S = {
  layout?: 'plain' | 'callout';
  content?: string;
  calloutStyle?: 'info' | 'success' | 'warning' | 'error' | 'custom';
  calloutColor?: string;
  calloutBackground?: string;
  calloutIcon?: string;
  align?: 'start' | 'center' | 'end';
  verticalAlign?: 'top' | 'center' | 'bottom';
  textSize?: 'sm' | 'md' | 'lg';
  textFont?: FontValue;
  textColor?: string;
  headingFont?: FontValue;
  headingColor?: string;
  linkColor?: string;
  linkUnderline?: 'hover' | 'always';
  padding?: number;
  overflow?: 'scroll' | 'clamp';
  clampLines?: number;
  missingText?: string;
  showRecord?: boolean;
  recordKeys?: unknown;
};

const SIZE = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' } as const;
const ALIGN = { start: 'text-left', center: 'text-center', end: 'text-right' } as const;
const VALIGN = { top: 'justify-start', center: 'justify-center', bottom: 'justify-end' } as const;
/** The callout tones: theme tokens, so light and dark both work. */
const CALLOUT: Record<'info' | 'success' | 'warning' | 'error', { accent: string; background: string }> = {
  info: { accent: 'var(--info)', background: 'var(--info-subtle)' },
  success: { accent: 'var(--success)', background: 'var(--success-subtle)' },
  warning: { accent: 'var(--warning)', background: 'var(--warning-subtle)' },
  error: { accent: 'var(--error)', background: 'var(--error-subtle)' },
};
const MAX_FOOTER = 12;

/** `uptimeHours` / `serial_number` -> "Uptime hours" / "Serial number". */
export function keyLabel(key: string): string {
  const words = key.split('.').pop()!.replace(/[_-]+/g, ' ').replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim().toLowerCase();
  return words ? words[0].toUpperCase() + words.slice(1) : key;
}

/** The footer's keys: the chosen ones, else every scalar of the record (capped). */
export function footerKeys(record: Record<string, unknown>, chosen: unknown): string[] {
  const picked = Array.isArray(chosen) ? chosen.filter((k): k is string => typeof k === 'string' && k !== '') : [];
  if (picked.length) return picked.slice(0, MAX_FOOTER);
  return Object.keys(record)
    .filter((k) => ['string', 'number', 'boolean'].includes(typeof record[k]))
    .slice(0, MAX_FOOTER);
}

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
  /** The links' underline class. */
  underline: string;
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
            className={cn('cursor-pointer rounded-sm text-primary underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus', ctx.underline)}
            style={ctx.linkStyle}
          >
            {children}
          </button>
        );
      }
      case 'link': {
        const cls = cn('rounded-sm text-primary underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus', ctx.underline);
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
  const raw = data.record?.record;
  const record = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : undefined;
  const linkColor = cssColor(s.linkColor);
  const missing = typeof s.missingText === 'string' ? s.missingText : '—';
  const ctx: Ctx = {
    record,
    format,
    missing,
    locale,
    linkStyle: linkColor ? { color: linkColor } : undefined,
    renderLink,
    resolveUrl,
    params: params && typeof params === 'object' ? params : undefined,
    onElementClick,
    underline: s.linkUnderline === 'always' ? 'underline' : 'hover:underline',
  };
  const headingStyle: CSSProperties = fontStyle(s.headingFont, s.headingColor);
  const callout = s.layout === 'callout';
  const tone = s.calloutStyle === 'custom'
    ? { accent: cssColor(s.calloutColor) ?? 'var(--primary)', background: cssColor(s.calloutBackground) ?? 'var(--primary-subtle)' }
    : CALLOUT[s.calloutStyle ?? 'info'] ?? CALLOUT.info;
  const clamp = s.overflow === 'clamp' && typeof s.clampLines === 'number' && s.clampLines >= 1 ? Math.floor(s.clampLines) : null;
  const padding = typeof s.padding === 'number' && s.padding > 0 ? s.padding : undefined;
  const footer = s.showRecord && record ? footerKeys(record, s.recordKeys) : [];

  const text = (
    <div
      className={cn(
        'min-w-0 space-y-2 break-words',
        SIZE[s.textSize ?? 'md'] ?? SIZE.md,
        ALIGN[s.align ?? 'start'] ?? ALIGN.start,
      )}
      style={clamp ? { display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: clamp, overflow: 'hidden' } : undefined}
    >
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'heading': return (
            <p key={i} className={cn('font-semibold leading-snug', b.level <= 2 ? 'text-[1.15em]' : 'text-[1em]')} style={headingStyle}>
              <Inline nodes={b.children} ctx={ctx} />
            </p>
          );
          case 'paragraph': return <p key={i} className="leading-relaxed"><Inline nodes={b.children} ctx={ctx} /></p>;
          case 'quote': return (
            <blockquote key={i} className="border-l-2 border-border pl-3 text-text-secondary">
              <Inline nodes={b.children} ctx={ctx} />
            </blockquote>
          );
          case 'code': return <pre key={i} className="overflow-x-auto rounded-md bg-surface-overlay p-2 text-left font-mono text-xs">{b.text}</pre>;
          case 'hr': return <hr key={i} className="border-border" />;
          case 'ul':
          case 'ol': {
            const List = b.t;
            return (
              <List key={i} className={cn(b.t === 'ul' ? 'list-disc' : 'list-decimal', 'space-y-1 pl-5 text-left marker:text-text-secondary')}>
                {b.items.map((it, j) => <li key={j} className="leading-relaxed"><Inline nodes={it} ctx={ctx} /></li>)}
              </List>
            );
          }
        }
      })}
    </div>
  );

  return (
    <div
      className={cn('flex h-full min-h-0 flex-col text-text-primary', clamp ? 'overflow-hidden' : 'overflow-auto')}
      style={{ ...fontStyle(s.textFont, s.textColor), padding }}
    >
      <div className={cn('flex flex-[1_0_auto] flex-col', VALIGN[s.verticalAlign ?? 'top'] ?? VALIGN.top)}>
        {callout ? (
          <div
            className="flex gap-2.5 rounded-lg border-l-4 p-3"
            style={{ borderLeftColor: tone.accent, background: tone.background }}
          >
            {s.calloutIcon && (
              <SettingIcon name={s.calloutIcon} className="mt-0.5 shrink-0" style={{ width: 16, height: 16, fontSize: 16, color: tone.accent }} />
            )}
            {text}
          </div>
        ) : text}
      </div>
      {footer.length > 0 && record && (
        <div className="mt-3 shrink-0 border-t border-border pt-1">
          {footer.map((k) => (
            <Row key={k} label={keyLabel(k)} value={fieldText(readField(record, k), format, missing, locale)} />
          ))}
        </div>
      )}
    </div>
  );
}

export const CONTENT_MARKDOWN_VIEW: WidgetKindView = {
  View: ContentMarkdownView,
  isEmpty: (_data, settings) => typeof settings.content !== 'string' || settings.content.trim() === '',
};
