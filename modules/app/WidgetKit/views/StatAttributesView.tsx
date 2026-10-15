'use client';
import { cn } from '@/libs/utils/cn';
import type { FontValue } from '../../SchemaForm/types';
import { cssColor, fontStyle, formatValue, type ValueFormat } from '../settings/style';
import type { Sparse } from '../settings/types';
import type { WidgetKindView, WidgetViewProps } from '../kind';

type FieldRow = { key?: string; label?: string; unit?: string; decimals?: number; color?: string };

type S = {
  layout?: 'list' | 'grid-2' | 'grid-3';
  fields?: unknown;
  labelFont?: FontValue;
  labelColor?: string;
  valueFont?: FontValue;
  valueColor?: string;
  maxRows?: number;
  emptyValue?: string;
  dividers?: boolean;
  dividerColor?: string;
};

export interface AttributeRow { key: string; label: string; value: string; color?: string }

/** `last_seen_at` / `lastSeenAt` → `Last seen at`. */
export function humanizeKey(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_\-.]+/g, ' ').trim();
  const lower = spaced.toLowerCase();
  return lower ? lower.charAt(0).toUpperCase() + lower.slice(1) : key;
}

/**
 * A record → label / value rows. With configured fields only those are shown, in that order, and a
 * missing key shows the empty text (a configured row must not silently disappear). With none every
 * key is shown. An integer prints without decimals unless the field sets them (as before).
 */
export function attributeRows(record: Record<string, unknown> | undefined, settings: Sparse, format: ValueFormat, locale?: string): AttributeRow[] {
  if (!record) return [];
  const s = settings as S;
  const empty = typeof s.emptyValue === 'string' ? s.emptyValue : '—';
  const configured = (Array.isArray(s.fields) ? (s.fields as FieldRow[]) : [])
    .filter((f) => f && typeof f.key === 'string' && f.key.trim() !== '');
  const source: FieldRow[] = configured.length ? configured : Object.keys(record).map((key) => ({ key }));
  const max = Math.max(1, Number(s.maxRows) || 20);
  return source.slice(0, max).map((f) => {
    const key = (f.key as string).trim();
    const raw = record[key];
    let value: string;
    if (raw === null || raw === undefined || raw === '') value = empty;
    else if (typeof raw === 'boolean') value = raw ? 'Yes' : 'No';
    else if (typeof raw === 'number') {
      value = Number.isFinite(raw)
        ? formatValue(raw, format, {
          ...(typeof f.unit === 'string' && f.unit ? { unit: f.unit } : {}),
          decimals: typeof f.decimals === 'number' ? f.decimals : Number.isInteger(raw) ? 0 : format.decimals,
        }, locale)
        : empty;
    } else if (typeof raw === 'object') {
      const json = JSON.stringify(raw);
      value = json.length > 120 ? `${json.slice(0, 117)}…` : json;
    } else value = f.unit ? `${String(raw)} ${f.unit}` : String(raw);
    return {
      key,
      label: typeof f.label === 'string' && f.label.trim() ? f.label.trim() : humanizeKey(key),
      value,
      ...(cssColor(f.color) ? { color: cssColor(f.color) } : {}),
    };
  });
}

const GRID: Record<NonNullable<S['layout']>, string> = {
  list: 'grid-cols-1',
  'grid-2': 'grid-cols-2',
  'grid-3': 'grid-cols-3',
};

/** `stat.attributes`: a record as label / value rows, in a list or a grid. */
export function StatAttributesView({ settings, format, data, locale }: WidgetViewProps) {
  const s = settings as S;
  const rows = attributeRows(data.record?.record, settings, format, locale);
  const layout = s.layout ?? 'list';
  const list = layout === 'list';
  const dividers = s.dividers !== false;
  const divider = cssColor(s.dividerColor);
  const labelStyle = fontStyle(s.labelFont, s.labelColor);
  const valueStyle = fontStyle(s.valueFont, s.valueColor);

  return (
    <dl className={cn('grid text-sm', GRID[layout] ?? GRID.list, !list && 'gap-x-4')} data-layout={layout}>
      {rows.map((r, i) => (
        <div
          key={`${r.key}-${i}`}
          className={cn(
            'min-w-0 py-1.5',
            list ? 'flex items-baseline justify-between gap-4' : 'flex flex-col gap-0.5',
            dividers && 'border-b border-border/50 last:border-b-0',
          )}
          style={dividers && divider ? { borderColor: divider } : undefined}
          data-part="row"
        >
          <dt className="truncate text-text-secondary" style={labelStyle}>{r.label}</dt>
          <dd
            className={cn('min-w-0 break-words font-medium tabular-nums text-text-primary', list && 'text-right')}
            style={{ ...valueStyle, ...(r.color ? { color: r.color } : {}) }}
          >
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export const STAT_ATTRIBUTES_VIEW: WidgetKindView = {
  View: StatAttributesView,
  isEmpty: (data) => {
    const rec = data.record?.record;
    return !rec || Object.keys(rec).length === 0;
  },
  toCsv: (data, settings, format) => [
    ['key', 'value'],
    ...attributeRows(data.record?.record, settings, format).map((r) => [r.key, r.value]),
  ],
};
