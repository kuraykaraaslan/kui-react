'use client';
import { Fragment, useMemo, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/libs/utils/cn';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle } from '../settings/style';
import type { Sparse } from '../settings/types';
import { SettingIcon } from '../WidgetKitContext';
import type { SlotData, WidgetKindView, WidgetViewProps } from '../kind';
import { dataColor, declaredColumns, rawText } from './DataTableView';

type S = {
  timeColumn?: string;
  titleColumn?: string;
  descriptionColumn?: string;
  colorColumn?: string;
  iconColumn?: string;
  layout?: 'timeline' | 'list' | 'compact';
  order?: 'newest' | 'oldest';
  maxItems?: number;
  timeDisplay?: 'relative' | 'time' | 'date' | 'datetime';
  groupByDay?: boolean;
  titleFont?: FontValue;
  titleColor?: string;
  descriptionFont?: FontValue;
  descriptionColor?: string;
  descriptionLines?: number;
  timeFont?: FontValue;
  timeColor?: string;
  markerColor?: string;
  icon?: string;
  lineColor?: string;
};

type Row = Record<string, unknown>;

export interface FeedItem {
  id: string;
  /** Epoch ms, or null when the time cannot be read. */
  at: number | null;
  title: string;
  description: string;
  /** A colour safe for `style`, or undefined (the marker colour applies). */
  color?: string;
  icon?: string;
  row: Row;
}

const ICON_RE = /^[a-z0-9:-]+(?: [a-z0-9:-]+){0,3}$/i;

const parseAt = (raw: unknown): number | null => {
  if (raw === null || raw === undefined || raw === '') return null;
  const at = typeof raw === 'number' ? raw : Date.parse(String(raw));
  return Number.isFinite(at) ? at : null;
};

/**
 * Table rows → feed items in the configured order. A row with no title is skipped (an untitled
 * line says nothing); a row whose time does not parse is kept but always sorts last, so a bad
 * timestamp never hides an event. `max` caps the result (0 = no cap).
 */
export function feedItems(slot: SlotData | undefined, settings: Sparse, max?: number): FeedItem[] {
  const s = settings as S;
  const timeKey = s.timeColumn || 'time';
  const titleKey = s.titleColumn || 'title';
  const items: FeedItem[] = [];
  (slot?.rows ?? []).forEach((row, i) => {
    const title = row[titleKey];
    if (title === null || title === undefined || String(title).trim() === '') return;
    const description = s.descriptionColumn && row[s.descriptionColumn] != null ? String(row[s.descriptionColumn]) : '';
    const icon = s.iconColumn ? row[s.iconColumn] : undefined;
    items.push({
      id: String(i),
      at: parseAt(row[timeKey]),
      title: typeof title === 'object' ? JSON.stringify(title) : String(title),
      description: description.length > 500 ? `${description.slice(0, 497)}…` : description,
      color: s.colorColumn ? dataColor(row[s.colorColumn]) : undefined,
      icon: typeof icon === 'string' && icon.length <= 64 && ICON_RE.test(icon.trim()) ? icon.trim() : undefined,
      row,
    });
  });
  const sign = s.order === 'oldest' ? 1 : -1;
  items.sort((a, b) => {
    if (a.at === null || b.at === null) return a.at === b.at ? 0 : a.at === null ? 1 : -1;
    return sign * (a.at - b.at);
  });
  const cap = max ?? Math.max(1, Math.min(50, Number(s.maxItems) || 10));
  return cap > 0 ? items.slice(0, cap) : items;
}

/** "5 minutes ago" in the viewer's locale. */
export function relativeTime(at: number, now = Date.now(), locale?: string): string {
  const diffSec = Math.round((at - now) / 1000);
  const abs = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (abs < 60) return rtf.format(diffSec, 'second');
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (abs < 86_400) return rtf.format(Math.round(diffSec / 3600), 'hour');
  if (abs < 30 * 86_400) return rtf.format(Math.round(diffSec / 86_400), 'day');
  if (abs < 365 * 86_400) return rtf.format(Math.round(diffSec / (30 * 86_400)), 'month');
  return rtf.format(Math.round(diffSec / (365 * 86_400)), 'year');
}

/** The time as the `timeDisplay` setting asks. */
export function feedTime(at: number, display: S['timeDisplay'] = 'relative', locale?: string, now = Date.now()): string {
  const d = new Date(at);
  switch (display) {
    case 'time': return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    case 'date': return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: d.getFullYear() === new Date(now).getFullYear() ? undefined : 'numeric' });
    case 'datetime': return d.toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    default: return relativeTime(at, now, locale);
  }
}

const dayKey = (at: number | null) => {
  if (at === null) return 'unknown';
  const d = new Date(at);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

export interface FeedMessages { unknownDay: string }

export type DataFeedViewProps = WidgetViewProps & {
  /** Fixed "now" for relative times (tests, snapshots). */
  now?: number;
  messages?: Partial<FeedMessages>;
};

/** `data.feed`: events as a timeline, a list or compact lines. */
export function DataFeedView({ settings, data, locale, now, messages }: DataFeedViewProps) {
  const s = settings as S;
  const items = useMemo(() => feedItems(data.events, settings), [data.events, settings]);
  const layout = s.layout ?? 'timeline';
  const clock = now ?? Date.now();
  const unknownDay = messages?.unknownDay ?? 'Time unknown';
  const lines = typeof s.descriptionLines === 'number' ? s.descriptionLines : 2;

  const titleStyle = fontStyle(s.titleFont, s.titleColor);
  const descStyle: CSSProperties = {
    ...fontStyle(s.descriptionFont, s.descriptionColor),
    ...(lines > 0 ? { display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),
  };
  const timeStyle = fontStyle(s.timeFont, s.timeColor);
  const markerDefault = cssColor(s.markerColor) ?? 'var(--text-disabled)';

  const time = (it: FeedItem, className?: string): ReactNode => it.at === null ? null : (
    <time className={cn('text-xs text-text-secondary', className)} style={timeStyle} dateTime={new Date(it.at).toISOString()}>
      {feedTime(it.at, s.timeDisplay, locale, clock)}
    </time>
  );

  const marker = (it: FeedItem): ReactNode => {
    const color = it.color ?? markerDefault;
    const icon = it.icon ?? s.icon;
    const drawn = icon ? <SettingIcon name={icon} className="text-xs" style={{ color, fontSize: 12, width: 12, height: 12 }} /> : null;
    return drawn
      ? <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-sunken" aria-hidden="true">{drawn}</span>
      : <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden="true" />;
  };

  const entry = (it: FeedItem, last: boolean): ReactNode => {
    if (layout === 'compact') {
      return (
        <li key={it.id} className="flex min-w-0 items-center gap-2 py-0.5" data-feed-item>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: it.color ?? markerDefault }} aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate text-sm text-text-primary" style={titleStyle}>{it.title}</span>
          {time(it, 'shrink-0')}
        </li>
      );
    }
    if (layout === 'list') {
      return (
        <li key={it.id} className="flex gap-3 border-b border-border/50 py-2 last:border-0" data-feed-item>
          {marker(it)}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="min-w-0 break-words text-sm text-text-primary" style={titleStyle}>{it.title}</p>
              {time(it, 'shrink-0')}
            </div>
            {it.description && <p className="break-words text-xs text-text-secondary" style={descStyle}>{it.description}</p>}
          </div>
        </li>
      );
    }
    return (
      <li key={it.id} className="relative flex gap-3 pb-3" data-feed-item>
        {!last && (
          <span className="absolute bottom-0 left-[9px] top-6 w-px bg-border" style={cssColor(s.lineColor) ? { background: cssColor(s.lineColor) } : undefined} aria-hidden="true" />
        )}
        <span className="flex w-5 shrink-0 justify-center">{marker(it)}</span>
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm text-text-primary" style={titleStyle}>{it.title}</p>
          {it.description && <p className="break-words text-xs text-text-secondary" style={descStyle}>{it.description}</p>}
          {time(it)}
        </div>
      </li>
    );
  };

  if (!s.groupByDay) {
    return <ol className={cn('flex flex-col', layout === 'compact' && 'gap-0.5')}>{items.map((it, i) => entry(it, i === items.length - 1))}</ol>;
  }

  const groups: Array<{ key: string; at: number | null; items: FeedItem[] }> = [];
  for (const it of items) {
    const key = dayKey(it.at);
    const g = groups.find((x) => x.key === key);
    if (g) g.items.push(it);
    else groups.push({ key, at: it.at, items: [it] });
  }
  return (
    <div className="flex flex-col gap-2">
      {groups.map((g) => (
        <Fragment key={g.key}>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            {g.at === null ? unknownDay : new Date(g.at).toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })}
          </h4>
          <ol className={cn('flex flex-col', layout === 'compact' && 'gap-0.5')}>
            {g.items.map((it, i) => entry(it, i === g.items.length - 1))}
          </ol>
        </Fragment>
      ))}
    </div>
  );
}

export const DATA_FEED_VIEW: WidgetKindView = {
  View: DataFeedView,
  isEmpty: (data, settings) => feedItems(data.events, settings, 1).length === 0,
  toCsv: (data, settings) => {
    const s = settings as S;
    const keys = [s.timeColumn || 'time', s.titleColumn || 'title', s.descriptionColumn, s.colorColumn, s.iconColumn]
      .filter((k, i, a): k is string => !!k && a.indexOf(k) === i);
    const label = (k: string) => declaredColumns(data.events).find((c) => c.key === k)?.label || k;
    const items = feedItems(data.events, settings, 0);
    return [keys.map(label), ...items.map((it) => keys.map((k) => rawText(it.row[k])))];
  },
};
