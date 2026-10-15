'use client';
import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/libs/utils/cn';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle } from '../settings/style';
import { SettingIcon } from '../WidgetKitContext';
import type { WidgetKindView, WidgetViewProps } from '../kind';
import { hostLink, toQuickLinks, type QuickLink } from './content-logic';

type S = {
  layout?: 'list' | 'grid' | 'buttons';
  columns?: 'auto' | '1' | '2' | '3' | '4';
  links?: unknown;
  labelFont?: FontValue;
  labelColor?: string;
  descriptionFont?: FontValue;
  descriptionColor?: string;
  iconColor?: string;
  iconSize?: number;
  accentColor?: string;
  openExternalInNewTab?: boolean;
};

const ITEM_CLS: Record<NonNullable<S['layout']>, string> = {
  list: 'flex items-start gap-3 rounded-md border-l-2 border-transparent px-2 py-1.5 hover:border-[var(--kui-link-accent)] hover:bg-surface-overlay',
  grid: 'flex h-full items-start gap-3 rounded-lg border border-border p-3 hover:border-[var(--kui-link-accent)] hover:bg-surface-overlay',
  buttons: 'inline-flex items-center gap-2 rounded-md bg-[var(--kui-link-accent)] px-3 py-2 text-primary-fg hover:opacity-90',
};
const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus';

/** `content.links`: quick links. Unsafe targets are dropped; internal paths go through the host's `renderLink`. */
export function ContentLinksView({ settings, renderLink, resolveUrl }: WidgetViewProps) {
  const s = settings as S;
  const links = useMemo(() => toQuickLinks(s.links), [s.links]);
  const layout = s.layout && ITEM_CLS[s.layout] ? s.layout : 'list';
  if (links.length === 0) {
    return <p className="flex h-full items-center justify-center p-4 text-center text-sm text-text-secondary">Add links in this widget’s settings.</p>;
  }
  const iconSize = typeof s.iconSize === 'number' ? s.iconSize : 16;
  const labelStyle = fontStyle(s.labelFont, layout === 'buttons' ? undefined : s.labelColor);
  const descStyle = fontStyle(s.descriptionFont, layout === 'buttons' ? undefined : s.descriptionColor);
  const cols = s.columns && s.columns !== 'auto' ? Number(s.columns) : null;

  const item = (l: QuickLink): ReactNode => {
    const iconColor = cssColor(l.iconColor) ?? (layout === 'buttons' ? undefined : cssColor(s.iconColor));
    const inner = (
      <>
        {l.icon && (
          <SettingIcon name={l.icon} className="mt-0.5 shrink-0" style={{ width: iconSize, height: iconSize, fontSize: iconSize, color: iconColor }} />
        )}
        <span className="min-w-0">
          <span className={cn('block font-medium', layout === 'buttons' ? 'text-sm' : 'text-sm text-text-primary')} style={labelStyle}>{l.label}</span>
          {l.description && layout !== 'buttons' && (
            <span className="block text-xs text-text-secondary" style={descStyle}>{l.description}</span>
          )}
        </span>
      </>
    );
    const cls = cn(ITEM_CLS[layout], FOCUS);
    if (!l.link.external && renderLink) return renderLink(l.link.href, inner, cls);
    const target = hostLink(l.link, resolveUrl);
    if (!target) return null;
    const newTab = l.link.external && s.openExternalInNewTab !== false;
    return (
      <a
        href={target.href}
        className={cls}
        title={layout === 'buttons' && l.description ? l.description : undefined}
        {...(newTab ? { target: '_blank' } : {})}
        {...(l.link.external ? { rel: 'noopener noreferrer nofollow' } : {})}
      >
        {inner}
      </a>
    );
  };

  const accent = (l: QuickLink) => ({ '--kui-link-accent': cssColor(l.color) ?? cssColor(s.accentColor) ?? 'var(--primary)' }) as CSSProperties;

  return (
    <ul
      className={cn(
        'h-full min-h-0 overflow-auto',
        layout === 'list' && 'space-y-1',
        layout === 'grid' && 'grid gap-2',
        layout === 'grid' && !cols && 'grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]',
        layout === 'buttons' && 'flex flex-wrap content-start gap-2',
      )}
      style={layout === 'grid' && cols ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined}
    >
      {links.map((l, i) => <li key={`${l.link.href}-${i}`} style={accent(l)}>{item(l)}</li>)}
    </ul>
  );
}

export const CONTENT_LINKS_VIEW: WidgetKindView = {
  View: ContentLinksView,
  isEmpty: (_data, settings) => !Array.isArray(settings.links) || settings.links.length === 0,
};
