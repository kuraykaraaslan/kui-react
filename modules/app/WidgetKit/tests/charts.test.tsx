import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { effective, templateDefaults, validate } from '../settings/engine';
import type { SettingsTemplate } from '../settings/types';
import type { BuiltinKindSpec, SlotData, WidgetKindView } from '../kind';
import { CHART_LINE, CHART_LINE_KIND } from '../templates/chart-line';
import { CHART_BAR, CHART_BAR_KIND } from '../templates/chart-bar';
import { CHART_AREA, CHART_AREA_KIND } from '../templates/chart-area';
import { CHART_PIE, CHART_PIE_KIND } from '../templates/chart-pie';
import { CHART_SCATTER, CHART_SCATTER_KIND } from '../templates/chart-scatter';
import { CHART_HISTOGRAM, CHART_HISTOGRAM_KIND } from '../templates/chart-histogram';
import { HEATMAP, HEATMAP_KIND } from '../templates/heatmap';
import { CHART_LINE_VIEW } from '../views/LineChartView';
import { CHART_BAR_VIEW } from '../views/BarChartView';
import { CHART_AREA_VIEW } from '../views/AreaChartView';
import { CHART_PIE_VIEW } from '../views/PieChartView';
import { CHART_SCATTER_VIEW } from '../views/ScatterChartView';
import { CHART_HISTOGRAM_VIEW } from '../views/HistogramChartView';
import { HEATMAP_VIEW } from '../views/HeatmapView';
import { applySeriesRules, mergeSeriesSlots, rowsToPieSeries, ruleFor } from '../views/chart-data';

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 480, height: 280, x: 0, y: 0, top: 0, left: 0, right: 480, bottom: 280, toJSON() {} });
});
afterAll(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

const KINDS: Array<[BuiltinKindSpec, SettingsTemplate]> = [
  [CHART_LINE_KIND, CHART_LINE], [CHART_BAR_KIND, CHART_BAR], [CHART_AREA_KIND, CHART_AREA], [CHART_PIE_KIND, CHART_PIE],
  [CHART_SCATTER_KIND, CHART_SCATTER], [CHART_HISTOGRAM_KIND, CHART_HISTOGRAM], [HEATMAP_KIND, HEATMAP],
];

describe('chart templates', () => {
  it.each(KINDS.map(([k, t]) => [k.type, k, t] as const))('%s: id, v1, valid defaults, known groups', (_, kind, t) => {
    expect(t.id).toBe(`builtin:${kind.type}`);
    expect(kind.template).toBe(t);
    expect(t.version).toBe(1);
    expect(t.migrations).toEqual([]);
    expect(validate(t, templateDefaults(t)).issues).toEqual([]);
    const groups = new Set(t.groups.map((g) => g.id));
    for (const [key, f] of Object.entries(t.fields)) {
      expect(f.since, key).toBe(1);
      expect(groups.has(f.group ?? ''), `${kind.type}.${key} → ${f.group}`).toBe(true);
    }
    expect(kind.slots.length).toBeGreaterThan(0);
  });
  it('series charts have a repeatable series slot, export and full-screen buttons', () => {
    for (const k of [CHART_LINE_KIND, CHART_BAR_KIND, CHART_AREA_KIND]) {
      expect(k.slots).toEqual([{ key: 'series', label: 'Series', shape: 'series', required: true, repeatable: true }]);
      expect(k.template.exportable).toBe(true);
      expect(k.template.cardDefaults).toEqual({ buttons: ['fullscreen', 'export'] });
    }
    expect(CHART_HISTOGRAM.formatDefaults).toEqual({ decimals: 1 });
    expect(HEATMAP.formatDefaults).toEqual({ decimals: 1 });
  });
  it('validates series items, colours and min below max', () => {
    const r = validate(CHART_LINE, {
      series: [{ key: '*', color: '#ff0000', lineStyle: 'dashed', width: 3 }, { key: 'temp', color: 'url(x)' }],
      yMin: 10, yMax: 5, curve: 'step',
    });
    expect(r.values.series).toEqual([{ key: '*', color: '#ff0000', lineStyle: 'dashed', width: 3 }, { key: 'temp' }]);
    expect(r.issues.map((i) => i.path)).toEqual(expect.arrayContaining(['series.1.color', 'yMax']));
    expect(validate(CHART_LINE, { curve: 'spiral' }).issues).toHaveLength(1);
    expect(validate(CHART_BAR, { orientation: 'horizontal', valueLabels: 'value', stacked: true }).issues).toEqual([]);
  });
});

const series = (names: string[]): SlotData => ({
  shape: 'series',
  series: names.map((name, k) => ({
    name,
    points: [1, 2, 3, 4].map((d) => ({ t: `2026-10-0${d}T00:00:00Z`, v: d * (k + 1) + 0.5 })),
  })),
});
const table = (rows: Array<Record<string, unknown>>, columns?: SlotData['columns']): SlotData => ({ shape: 'table', rows, columns });

function renderView(view: WidgetKindView, t: SettingsTemplate, data: Record<string, SlotData | undefined>, stored: Record<string, unknown> = {}, format = {}) {
  const View = view.View;
  return render(<View settings={effective(t, stored)} format={{ ...t.formatDefaults, ...format }} data={data} locale="en" />);
}

describe('series chart views', () => {
  it('line: draws one path per series, applies colour / dash / width / step and hides a series until clicked', () => {
    const { container } = renderView(CHART_LINE_VIEW, CHART_LINE, { series: series(['temp', 'hum']) }, {
      curve: 'step',
      series: [{ key: 'temp', color: '#ff0000', lineStyle: 'dashed', width: 4, label: 'T: ${name}' }, { key: 'hum', startHidden: true }],
    });
    const lines = container.querySelectorAll('path[data-line]');
    expect(lines).toHaveLength(1);
    expect(lines[0].getAttribute('stroke')).toBe('#ff0000');
    expect(lines[0].getAttribute('stroke-width')).toBe('4');
    expect(lines[0].getAttribute('stroke-dasharray')).toBeTruthy();
    expect(lines[0].getAttribute('d')).toMatch(/H/);
    expect(screen.getByText('T: temp')).toBeInTheDocument();
    const hum = screen.getByRole('button', { name: /hum/ });
    expect(hum).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(hum);
    expect(container.querySelectorAll('path[data-line]')).toHaveLength(2);
  });
  it('line: legend off, thresholds, axis title, legend values', () => {
    const { container, rerender } = renderView(CHART_LINE_VIEW, CHART_LINE, { series: series(['a', 'b']) }, {
      legend: 'none', thresholds: [{ value: 3, label: 'Limit', color: '#00ff00' }], yLabel: 'Temperature',
    });
    expect(container.querySelector('ul[role="list"]')).toBeNull();
    expect(container.querySelector('[data-threshold="3"] line')?.getAttribute('stroke')).toBe('#00ff00');
    expect(screen.getByText('Limit')).toBeInTheDocument();
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    rerender(<CHART_LINE_VIEW.View settings={effective(CHART_LINE, { legend: 'right', legendValues: ['max'] })} format={{ unit: '°C', decimals: 1 }} data={{ series: series(['a', 'b']) }} locale="en" />);
    expect(screen.getByText('max 4.5 °C')).toBeInTheDocument();
  });
  it('line: auto legend only with 2 or more series; multiple sources merge with renamed duplicates', () => {
    const { container } = renderView(CHART_LINE_VIEW, CHART_LINE, { series: series(['a']) });
    expect(container.querySelector('ul[role="list"]')).toBeNull();
    const merged = mergeSeriesSlots({ series: series(['a']), 'series#2': series(['a']) });
    expect(merged?.series?.map((s) => s.name)).toEqual(['a', 'a (2)']);
  });
  it('bar: horizontal bars with value labels; stacked', () => {
    const { container } = renderView(CHART_BAR_VIEW, CHART_BAR, { series: series(['a']) }, { orientation: 'horizontal', valueLabels: 'value' }, { decimals: 1 });
    const rects = [...container.querySelectorAll('g[data-series] rect')];
    expect(rects).toHaveLength(4);
    // Horizontal: bars share x (the value axis starts at the left) and grow in width.
    expect(new Set(rects.map((r) => r.getAttribute('x'))).size).toBe(1);
    expect(container.querySelectorAll('[data-value-label]')).toHaveLength(4);
    expect([...container.querySelectorAll('[data-value-label]')].map((t) => t.textContent)).toEqual(['1.5', '2.5', '3.5', '4.5']);
    const stacked = renderView(CHART_BAR_VIEW, CHART_BAR, { series: series(['a', 'b']) }, { stacked: true });
    const a = [...stacked.container.querySelectorAll('g[data-series="a"] rect')];
    const b = [...stacked.container.querySelectorAll('g[data-series="b"] rect')];
    // Stacked: same x per category, b sits on top of a.
    expect(a[0].getAttribute('x')).toBe(b[0].getAttribute('x'));
    expect(Number(b[0].getAttribute('y')) + Number(b[0].getAttribute('height'))).toBeCloseTo(Number(a[0].getAttribute('y')), 5);
  });
  it('area: fill opacity follows the fill setting', () => {
    const { container } = renderView(CHART_AREA_VIEW, CHART_AREA, { series: series(['a']) }, { fill: 'solid' });
    expect(container.querySelector('path[data-area]')?.getAttribute('opacity')).toBe('0.6');
    const none = renderView(CHART_AREA_VIEW, CHART_AREA, { series: series(['a']) }, { fill: 'none' });
    expect(none.container.querySelector('path[data-area]')).toBeNull();
  });
  it('isEmpty and CSV', () => {
    expect(CHART_LINE_VIEW.isEmpty!({}, {})).toBe(true);
    expect(CHART_LINE_VIEW.isEmpty!({ series: { shape: 'series', series: [{ name: 'a', points: [] }] } }, {})).toBe(true);
    expect(CHART_LINE_VIEW.isEmpty!({ series: series(['a']) }, {})).toBe(false);
    const csv = CHART_BAR_VIEW.toCsv!({ series: series(['a']) }, {}, {});
    expect(csv[0]).toEqual(['time', 'series', 'value']);
    expect(csv[1]).toEqual(['2026-10-01T00:00:00Z', 'a', '1.5']);
  });
  it('series rules: exact beats *, ${name} labels, per-series unit', () => {
    const rules = [{ key: '*', unit: 'x', label: 'All ${name}' }, { key: 'a', unit: '°C', decimals: 0 }];
    expect(ruleFor('a', rules)).toMatchObject({ unit: '°C', label: 'All ${name}', decimals: 0 });
    const [s] = applySeriesRules([{ id: 'a', name: 'a', data: [] }], rules, { format: { decimals: 2 }, locale: 'en' });
    expect(s.name).toBe('All a');
    expect(s.format!(21.46)).toBe('21 °C');
  });
});

describe('pie view', () => {
  const rows = [{ label: 'A', value: 5 }, { label: 'B', value: 30 }, { label: 'C', value: 10 }, { label: 'D', value: 1 }];
  it('folds past max slices into Other, sorts, pins colours', () => {
    const s = rowsToPieSeries(rows, { label: 'label', value: 'value', max: 3, sort: 'desc', colors: [{ key: 'B', color: '#123456' }] });
    expect(s![0].data.map((p) => [p.x, p.y])).toEqual([['B', 30], ['C', 10], ['Other', 6]]);
    expect(s![0].data[0].color).toBe('#123456');
    const asData = rowsToPieSeries(rows, { label: 'label', value: 'value', sort: 'none' });
    expect(asData![0].data.map((p) => p.x)).toEqual(['A', 'B', 'C', 'D']);
  });
  it('donut-total shows the total; value labels show shares', () => {
    const { container } = renderView(CHART_PIE_VIEW, CHART_PIE, { slices: table(rows) }, { layout: 'donut-total', valueLabels: 'percent', totalLabel: 'All' });
    expect(container.querySelector('[data-center]')?.textContent).toBe('46');
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    const pie = renderView(CHART_PIE_VIEW, CHART_PIE, { slices: table(rows) }, { layout: 'donut' });
    expect(pie.container.querySelector('[data-center]')).toBeNull();
  });
  it('isEmpty and CSV of declared columns', () => {
    expect(CHART_PIE_VIEW.isEmpty!({ slices: table([]) }, effective(CHART_PIE))).toBe(true);
    const csv = CHART_PIE_VIEW.toCsv!({ slices: table(rows, [{ key: 'label', label: 'Label', type: 'text' }, { key: 'value', label: 'Value', type: 'number' }]) }, {}, {});
    expect(csv[0]).toEqual(['label', 'value']);
    expect(csv[1]).toEqual(['A', '5']);
  });
});

describe('scatter view', () => {
  const rows = [{ x: 1, y: 2, g: 'a' }, { x: 2, y: 3, g: 'b' }, { x: 3, y: 1, g: 'a' }];
  it('colours a single group with the point colour and sizes points', () => {
    const { container } = renderView(CHART_SCATTER_VIEW, CHART_SCATTER, { points: table(rows) }, { pointColor: '#abcdef', pointSize: 'lg', xLabel: 'Speed' });
    const dots = container.querySelectorAll('g[data-series] circle');
    expect(dots).toHaveLength(3);
    expect(dots[0].getAttribute('fill')).toBe('#abcdef');
    expect(dots[0].getAttribute('r')).toBe('6');
    expect(screen.getByText('Speed')).toBeInTheDocument();
  });
  it('one series per group, legend in auto mode', () => {
    const { container } = renderView(CHART_SCATTER_VIEW, CHART_SCATTER, { points: table(rows) }, { groupColumn: 'g', groupColors: [{ key: 'b', color: '#111111' }] });
    expect(container.querySelectorAll('g[data-series]')).toHaveLength(2);
    expect(container.querySelector('g[data-series="b"] circle')?.getAttribute('fill')).toBe('#111111');
    expect(screen.getByRole('button', { name: /a/ })).toBeInTheDocument();
  });
  it('isEmpty', () => {
    expect(CHART_SCATTER_VIEW.isEmpty!({ points: table([{ x: 'n/a', y: 1 }]) }, effective(CHART_SCATTER))).toBe(true);
  });
});

describe('histogram view', () => {
  const rows = [1, 2, 2, 3, 3, 3, 4, 9].map((value) => ({ value }));
  it('bins, colours the bars and prints counts', () => {
    const { container } = renderView(CHART_HISTOGRAM_VIEW, CHART_HISTOGRAM, { values: table(rows) }, { bins: 4, barColor: '#00aa00', valueLabels: 'value' });
    const rects = container.querySelectorAll('g[data-series] rect');
    expect(rects).toHaveLength(4);
    expect(rects[0].getAttribute('fill')).toBe('#00aa00');
    expect(container.querySelectorAll('[data-value-label]')).toHaveLength(4);
    expect(screen.getByText('1.0–3.0')).toBeInTheDocument();
  });
  it('CSV is from,to,count; empty without numbers', () => {
    const csv = CHART_HISTOGRAM_VIEW.toCsv!({ values: table(rows) }, effective(CHART_HISTOGRAM, { bins: 2 }), {});
    expect(csv).toEqual([['from', 'to', 'count'], ['1', '5', '7'], ['5', '9', '1']]);
    expect(CHART_HISTOGRAM_VIEW.isEmpty!({ values: table([{ value: 'x' }]) }, effective(CHART_HISTOGRAM))).toBe(true);
  });
});

describe('heatmap view', () => {
  const rows = [{ x: 'Mon', y: '1', value: 10 }, { x: 'Tue', y: '1', value: 50 }, { x: 'Mon', y: '2', value: 90 }];
  it('sequential colour, cell labels', () => {
    const { container } = renderView(HEATMAP_VIEW, HEATMAP, { cells: table(rows) }, { color: '#ff00ff', valueLabels: 'value' });
    const cells = container.querySelectorAll('rect[fill="#ff00ff"]');
    expect(cells).toHaveLength(3);
    expect(container.querySelectorAll('[data-cell-label]')).toHaveLength(3);
    expect(container.querySelector('[data-heat-legend="scale"]')).toBeTruthy();
  });
  it('colour bands with a banded legend', () => {
    const { container } = renderView(HEATMAP_VIEW, HEATMAP, { cells: table(rows) }, {
      scale: 'bands', ranges: [{ to: 50, color: '#00ff00', label: 'Low' }, { from: 50, color: '#ff0000' }],
    });
    expect(container.querySelectorAll('rect[fill="#00ff00"]')).toHaveLength(1);
    expect(container.querySelectorAll('rect[fill="#ff0000"]')).toHaveLength(2);
    expect(screen.getByText('Low')).toBeInTheDocument();
    expect(container.querySelector('[data-heat-legend="bands"]')).toBeTruthy();
  });
  it('legend off, isEmpty, CSV', () => {
    const { container } = renderView(HEATMAP_VIEW, HEATMAP, { cells: table(rows) }, { legend: 'none' });
    expect(container.querySelector('[data-heat-legend]')).toBeNull();
    expect(HEATMAP_VIEW.isEmpty!({}, effective(HEATMAP))).toBe(true);
    expect(HEATMAP_VIEW.toCsv!({ cells: table(rows) }, {}, {})[0]).toEqual(['x', 'y', 'value']);
  });
});
