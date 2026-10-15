import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { validate, templateDefaults, effective } from '../settings/engine';
import type { SettingsTemplate, Sparse } from '../settings/types';
import type { ValueFormat } from '../settings/style';
import type { BuiltinKindSpec, SlotData, WidgetKindView } from '../kind';
import { STAT_SPARKLINE, STAT_SPARKLINE_KIND } from '../templates/stat-sparkline';
import { STAT_ATTRIBUTES, STAT_ATTRIBUTES_KIND } from '../templates/stat-attributes';
import { PROGRESS, PROGRESS_KIND } from '../templates/progress';
import { GAUGE, GAUGE_KIND } from '../templates/gauge';
import { STATE, STATE_KIND } from '../templates/state';
import { STAT_SPARKLINE_VIEW } from '../views/StatSparklineView';
import { STAT_ATTRIBUTES_VIEW } from '../views/StatAttributesView';
import { PROGRESS_VIEW } from '../views/ProgressView';
import { GAUGE_VIEW, rangesToBands } from '../views/GaugeView';
import { STATE_VIEW, evaluateState } from '../views/StateView';

const KINDS: Array<[BuiltinKindSpec, SettingsTemplate, WidgetKindView]> = [
  [STAT_SPARKLINE_KIND, STAT_SPARKLINE, STAT_SPARKLINE_VIEW],
  [STAT_ATTRIBUTES_KIND, STAT_ATTRIBUTES, STAT_ATTRIBUTES_VIEW],
  [PROGRESS_KIND, PROGRESS, PROGRESS_VIEW],
  [GAUGE_KIND, GAUGE, GAUGE_VIEW],
  [STATE_KIND, STATE, STATE_VIEW],
];

describe.each(KINDS)('template $type', (kind, template) => {
  it('is builtin:<type>@1 with no migrations and the kind points at it', () => {
    expect(template.id).toBe(`builtin:${kind.type}`);
    expect(template.version).toBe(1);
    expect(template.migrations).toEqual([]);
    expect(kind.template).toBe(template);
    expect(template.namespace).toBe('');
  });
  it('validates its own defaults with no issues', () => {
    const defaults = templateDefaults(template);
    const r = validate(template, defaults);
    expect(r.issues).toEqual([]);
    expect(r.values).toEqual(defaults);
  });
  it('every field sits in a declared group and is since 1', () => {
    const groups = new Set(template.groups.map((g) => g.id));
    for (const [k, f] of Object.entries(template.fields)) {
      expect(groups.has(f.group as string), `${k} -> ${f.group}`).toBe(true);
      expect(f.since).toBe(1);
    }
  });
  it('every group has at least one field', () => {
    const used = new Set(Object.values(template.fields).map((f) => f.group));
    for (const g of template.groups) expect(used.has(g.id), g.id).toBe(true);
  });
});

describe('rules', () => {
  it('gauge refuses min >= max and start >= end angle', () => {
    expect(validate(GAUGE, { min: 10, max: 5 }).issues.map((i) => i.path)).toContain('max');
    expect(validate(GAUGE, { startAngle: 90, endAngle: 0 }).issues.map((i) => i.path)).toContain('endAngle');
  });
  it('gauge keeps today\'s inclusive-top boundary and dims when stale', () => {
    expect(templateDefaults(GAUGE).rangeEdges).toBe('to');
    expect(GAUGE.cardDefaults).toEqual({ staleDisplay: 'dim' });
  });
  it('format defaults reproduce today\'s decimals', () => {
    expect(STAT_SPARKLINE.formatDefaults).toEqual({ decimals: 0 });
    expect(STAT_ATTRIBUTES.formatDefaults).toEqual({ decimals: 2 });
    expect(GAUGE.formatDefaults).toEqual({ decimals: 0 });
    expect(STATE.format).toBe(false);
  });
});

const fmt: ValueFormat = { decimals: 0 };
function renderKind(view: WidgetKindView, template: SettingsTemplate, data: Record<string, SlotData | undefined>, stored: Sparse = {}, format: ValueFormat = fmt, extra: { stale?: boolean } = {}) {
  const View = view.View;
  return render(<View settings={effective(template, stored)} format={format} data={data} locale="en" {...extra} />);
}

const series = (vals: number[]): SlotData => ({
  shape: 'series',
  series: [{ name: 's', points: vals.map((v, i) => ({ t: `2026-10-0${i + 1}T00:00:00Z`, v })) }],
});

describe('stat.sparkline view', () => {
  it('shows the latest value and a change badge', () => {
    const { container } = renderKind(STAT_SPARKLINE_VIEW, STAT_SPARKLINE, { series: series([10, 12, 15]) });
    expect(container.querySelector('[data-part="value"]')?.textContent).toBe('15');
    expect(container.querySelector('[data-part="change"]')?.textContent).toBe('▲ 50.0 %');
    expect(container.querySelector('[data-part="area"]')).toBeTruthy();
  });
  it('settings change the line, the fill, the value colour and the badge', () => {
    const { container } = renderKind(STAT_SPARKLINE_VIEW, STAT_SPARKLINE, { series: series([10, 12, 15]) }, {
      layout: 'chart-only', fillOpacity: 0, lineColor: '#ff0000', lineWidth: 3, curve: 'step',
    });
    expect(container.querySelector('[data-part="value"]')).toBeNull();
    expect(container.querySelector('[data-part="area"]')).toBeNull();
    const line = container.querySelector('[data-part="line"]')!;
    expect(line.getAttribute('stroke')).toBe('#ff0000');
    expect(line.getAttribute('stroke-width')).toBe('3');
    expect(line.getAttribute('d')).toContain('H');
    const r = renderKind(STAT_SPARKLINE_VIEW, STAT_SPARKLINE, { series: series([10, 8]) }, {
      showChange: 'delta', increaseIs: 'bad', ranges: [{ to: 9, color: '#00ff00' }],
    });
    const change = r.container.querySelector('[data-part="change"]') as HTMLElement;
    expect(change.textContent).toBe('▼ 2');
    expect(change.style.color).toBe('var(--success)');
    expect((r.container.querySelector('[data-part="value"]') as HTMLElement).style.color).toBe('rgb(0, 255, 0)');
  });
  it('is empty without points', () => {
    expect(STAT_SPARKLINE_VIEW.isEmpty!({}, {})).toBe(true);
    expect(STAT_SPARKLINE_VIEW.isEmpty!({ series: { shape: 'series', series: [] } }, {})).toBe(true);
    expect(STAT_SPARKLINE_VIEW.isEmpty!({ series: series([1]) }, {})).toBe(false);
  });
});

describe('stat.attributes view', () => {
  const record: SlotData = { shape: 'record', record: { serialNo: 'A-1', temp: 21.456, count: 3, online: true, note: null } };
  it('lists every key humanised when no fields are set', () => {
    renderKind(STAT_ATTRIBUTES_VIEW, STAT_ATTRIBUTES, { record }, {}, { decimals: 2 });
    expect(screen.getByText('Serial no')).toBeInTheDocument();
    expect(screen.getByText('21.46')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });
  it('fields, units, decimals, colours, layout and max rows drive the output', () => {
    const { container } = renderKind(STAT_ATTRIBUTES_VIEW, STAT_ATTRIBUTES, { record }, {
      layout: 'grid-2', maxRows: 2, emptyValue: 'n/a', dividers: false,
      fields: [{ key: 'temp', label: 'Temperature', unit: '°C', decimals: 1, color: '#123456' }, { key: 'note' }, { key: 'count' }],
    }, { decimals: 2 });
    expect(container.querySelector('[data-layout="grid-2"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-part="row"]')).toHaveLength(2);
    const v = screen.getByText('21.5 °C');
    expect(v.style.color).toBe('rgb(18, 52, 86)');
    expect(screen.getByText('n/a')).toBeInTheDocument();
    expect(container.querySelector('.border-b')).toBeNull();
  });
  it('exports key,value CSV and is empty without a record', () => {
    const rows = STAT_ATTRIBUTES_VIEW.toCsv!({ record }, effective(STAT_ATTRIBUTES, { fields: [{ key: 'count' }] }), { decimals: 2 });
    expect(rows).toEqual([['key', 'value'], ['count', '3']]);
    expect(STAT_ATTRIBUTES_VIEW.isEmpty!({}, {})).toBe(true);
    expect(STAT_ATTRIBUTES_VIEW.isEmpty!({ record: { shape: 'record', record: {} } }, {})).toBe(true);
  });
});

describe('progress view', () => {
  const value: SlotData = { shape: 'scalar', value: 42 };
  it('shows value of target and a bar', () => {
    const { container } = renderKind(PROGRESS_VIEW, PROGRESS, { value });
    expect(container.querySelector('[data-part="value"]')?.textContent).toBe('42');
    expect(container.querySelector('[data-part="secondary"]')?.textContent).toBe('of 100');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42');
  });
  it('a bound target wins; percent text, colours, thickness and ranges apply', () => {
    renderKind(PROGRESS_VIEW, PROGRESS, { value, target: { shape: 'scalar', value: 84 } }, {
      valueText: 'percent', barColor: '#ff0000', trackColor: '#000000', thickness: 20, showTicks: true,
    });
    expect(screen.getByText('50 %')).toBeInTheDocument();
    const bar = screen.getByRole('progressbar');
    expect(bar.style.height).toBe('20px');
    expect(bar.style.background).toBe('rgb(0, 0, 0)');
    expect((bar.firstElementChild as HTMLElement).style.background).toBe('rgb(255, 0, 0)');
    expect(screen.getByText('84')).toBeInTheDocument();
    const r = renderKind(PROGRESS_VIEW, PROGRESS, { value }, { ranges: [{ from: 40, color: '#00ff00' }] });
    const bars = r.container.querySelector('[role="progressbar"]')!;
    expect((bars.firstElementChild as HTMLElement).style.background).toBe('rgb(0, 255, 0)');
  });
  it('ring layout draws a circle', () => {
    const { container } = renderKind(PROGRESS_VIEW, PROGRESS, { value }, { layout: 'ring', ringSize: 120 });
    expect(container.querySelector('svg')?.getAttribute('width')).toBe('120');
  });
  it('is empty without a number', () => {
    expect(PROGRESS_VIEW.isEmpty!({}, {})).toBe(true);
    expect(PROGRESS_VIEW.isEmpty!({ value: { shape: 'scalar', value: null } }, {})).toBe(true);
  });
});

describe('gauge view', () => {
  const value: SlotData = { shape: 'scalar', value: 72 };
  it('renders a meter with defaults', () => {
    const { container } = renderKind(GAUGE_VIEW, GAUGE, { value }, {}, { decimals: 0, unit: '%' });
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '72');
    expect(container.querySelector('[data-layout="arc"]')).toBeTruthy();
    expect(container.querySelector('[data-part="min"]')?.textContent).toBe('0');
  });
  it('layout, ranges, needle, ticks, min/max and colours drive the drawing', () => {
    const { container } = renderKind(GAUGE_VIEW, GAUGE, { value, max: { shape: 'scalar', value: 200 } }, {
      layout: 'bar-horizontal', needle: true, ticks: 5, showMinMax: false, trackColor: '#111111', thickness: 10,
      ranges: [{ to: 50, color: '#00ff00' }, { from: 50, color: '#ff0000', label: 'Hot' }], rangeTarget: 'bar',
    });
    expect(container.querySelector('[data-layout="bar-horizontal"]')).toBeTruthy();
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuemax', '200');
    expect(screen.getByRole('meter').getAttribute('aria-valuetext')).toContain('Hot');
    expect(container.querySelector('[data-part="bar"]')?.getAttribute('stroke')).toBe('#ff0000');
    expect(container.querySelector('[data-part="track"]')?.getAttribute('stroke')).toBe('#111111');
    expect(container.querySelector('[data-part="needle"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-part="tick"]')).toHaveLength(5);
    expect(container.querySelector('[data-part="min"]')).toBeNull();
    expect(container.querySelector('[data-part="band"]')).toBeNull();
  });
  it('track mode keeps the bar colour and shows bands; donut and value off', () => {
    const { container } = renderKind(GAUGE_VIEW, GAUGE, { value }, {
      layout: 'donut', showValue: false, barColor: '#0000ff', rangeTarget: 'track', ranges: [{ to: 100, color: '#ff0000' }],
    });
    expect(container.querySelector('[data-layout="donut"]')).toBeTruthy();
    expect(container.querySelector('[data-part="bar"]')?.getAttribute('stroke')).toBe('#0000ff');
    expect(container.querySelectorAll('[data-part="band"]')).toHaveLength(1);
    expect(container.querySelector('[data-part="value"]')).toBeNull();
  });
  it('maps ranges to bands and is empty without a value', () => {
    expect(rangesToBands([{ to: 10, color: 'var(--success)' }, { from: 10, color: 'bad;' }])).toEqual([{ to: 10, color: 'var(--success)' }]);
    expect(GAUGE_VIEW.isEmpty!({}, {})).toBe(true);
  });
});

describe('state view', () => {
  const states = [
    { match: 'on', label: 'Running', color: '#00aa00', icon: 'fas fa-check' },
    { gte: 80, label: 'Hot', color: '#ff0000', background: '#ffeeee' },
  ];
  it('first matching rule wins, fallback and unknown otherwise', () => {
    const s = effective(STATE, { states, fallbackLabel: 'Other' });
    expect(evaluateState('ON', s).label).toBe('Running');
    expect(evaluateState(90, s)).toMatchObject({ label: 'Hot', color: '#ff0000', background: '#ffeeee' });
    expect(evaluateState(10, s).label).toBe('Other');
    expect(evaluateState(null, s)).toMatchObject({ label: 'Unknown', unknown: true });
    expect(evaluateState('on', s, true).label).toBe('Unknown');
    expect(evaluateState('on', effective(STATE, { states, staleAsUnknown: false }), true).label).toBe('Running');
  });
  it('renders a badge, and layout / show value / colours change it', () => {
    const { container } = renderKind(STATE_VIEW, STATE, { value: { shape: 'scalar', value: 90 } }, { states });
    const badge = container.querySelector('[data-part="badge"]') as HTMLElement;
    expect(badge.textContent).toBe('Hot');
    expect(badge.style.color).toBe('rgb(255, 0, 0)');
    const r = renderKind(STATE_VIEW, STATE, { value: { shape: 'scalar', value: 90 } }, { states, layout: 'tile', showValue: true });
    expect(r.container.querySelector('[data-layout="tile"]')).toBeTruthy();
    expect(r.container.querySelector('[data-part="value"]')?.textContent).toBe('90');
    const d = renderKind(STATE_VIEW, STATE, { value: { shape: 'scalar', value: 'x' } }, { layout: 'dot', fallbackColor: '#0000ff' });
    expect((d.container.querySelector('[data-part="dot"]') as HTMLElement).style.background).toBe('rgb(0, 0, 255)');
  });
  it('is empty only without an answer', () => {
    expect(STATE_VIEW.isEmpty!({}, {})).toBe(true);
    expect(STATE_VIEW.isEmpty!({ value: { shape: 'scalar', value: null } }, {})).toBe(false);
  });
});
