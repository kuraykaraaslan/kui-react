import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GaugeChart, HeatmapChart, LineChart, AreaChart, BarChart, PieChart, DonutChart, ScatterChart } from './index';
import { stepPath, continuePath, dashArray, resolveDomain, seriesStats } from './charts/_helpers';

// jsdom has no layout: give the ResponsiveContainer a width so charts draw.
beforeAll(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} });
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 480, height: 240, x: 0, y: 0, top: 0, left: 0, right: 480, bottom: 240, toJSON() {} });
});
afterAll(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('GaugeChart', () => {
  it('is a meter with value, range and band name', () => {
    render(<GaugeChart value={72} min={0} max={100} unit="%" bands={[{ to: 50, tone: 'success' }, { to: 100, tone: 'error' }]} />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
    expect(meter).toHaveAttribute('aria-valuenow', '72');
    expect(meter.getAttribute('aria-valuetext')).toContain('error');
  });
  it('clamps the arc but keeps the real value in the text', () => {
    render(<GaugeChart value={250} max={100} />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '100');
    expect(meter.getAttribute('aria-valuetext')).toContain('250');
  });
  it('shows no value and the stale hint when asked', () => {
    render(<GaugeChart value={null} stale />);
    expect(screen.getByRole('meter')).not.toHaveAttribute('aria-valuenow');
    expect(screen.getByText('stale')).toBeInTheDocument();
  });
});

const day = (n: number) => `2026-10-0${n}T00:00:00Z`;
const series = [{ id: 'a', name: 'A', data: [{ x: day(1), y: 1 }, { x: day(2), y: 3 }, { x: day(3), y: 2 }] }];

describe('time axis', () => {
  it('Line and Area render through xAxis="time" and the xScale alias', () => {
    const { container, rerender } = render(<LineChart series={series} xAxis="time" />);
    expect(container.querySelector('svg')).toBeTruthy();
    rerender(<AreaChart series={series} xScale="time" />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
  it('stacked Bar and Area render', () => {
    const two = [...series, { id: 'b', name: 'B', data: [{ x: day(1), y: 2 }, { x: day(2), y: 1 }, { x: day(3), y: 1 }] }];
    const { container, rerender } = render(<BarChart series={two} stacked />);
    expect(container.querySelector('svg')).toBeTruthy();
    rerender(<AreaChart series={two} stacked />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

describe('zoom reset label', () => {
  it('is not shown until zoomed', () => {
    render(<LineChart series={series} xAxis="time" resetZoomLabel="Reset" />);
    expect(screen.queryByText('Reset')).toBeNull();
  });
});

describe('HeatmapChart', () => {
  it('renders without crashing for sparse cells', () => {
    const { container } = render(<HeatmapChart cells={[{ x: 'Mon', y: '1', value: 1 }, { x: 'Tue', y: '2', value: null }]} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

const cats = [
  { id: 'a', name: 'A', data: [{ x: 'Mon', y: 1 }, { x: 'Tue', y: 3 }, { x: 'Wed', y: 2 }] },
  { id: 'b', name: 'B', data: [{ x: 'Mon', y: 2 }, { x: 'Tue', y: 1 }, { x: 'Wed', y: 4 }] },
];

describe('helpers for the settings surface', () => {
  it('step paths retrace in reverse; dash patterns; domains; stats', () => {
    expect(stepPath([{ x: 0, y: 0 }, { x: 10, y: 5 }])).toBe('M0 0 H10 V5');
    expect(stepPath([{ x: 10, y: 5 }, { x: 0, y: 0 }], 'before')).toBe('M10 5 V0 H0');
    expect(continuePath([{ x: 1, y: 2 }, { x: 3, y: 4 }], 'linear', 'after')).toBe('L1 2 L3 4');
    expect(dashArray('solid')).toBeUndefined();
    expect(dashArray('dotted', 2)).toBe('0 4');
    expect(resolveDomain({ min: 0, max: 10 }, { thresholds: [{ value: 15 }] })).toEqual({ min: 0, max: 15 });
    expect(resolveDomain({ min: 0, max: 10 }, { min: 2, max: 8, thresholds: [{ value: 15 }] })).toEqual({ min: 2, max: 8 });
    expect(seriesStats(cats[0])).toEqual({ latest: 2, min: 1, max: 3, avg: 2, total: 6 });
  });
});

describe('Line / Area settings props', () => {
  it('per-series stroke style, width, points and step curve', () => {
    const styled = [{ ...cats[0], lineStyle: 'dashed' as const, strokeWidth: 5, showPoints: true }, cats[1]];
    const { container } = render(<LineChart series={styled} curve="step" />);
    const lines = container.querySelectorAll('path[data-line]');
    expect(lines[0].getAttribute('stroke-dasharray')).toBe('15 10');
    expect(lines[0].getAttribute('stroke-width')).toBe('5');
    expect(lines[0].getAttribute('d')).toContain('H');
    expect(lines[1].getAttribute('stroke-dasharray')).toBeNull();
    expect(container.querySelectorAll('g[data-series="a"] circle[data-point]')).toHaveLength(3);
  });
  it('a hidden series is toggled from the legend', () => {
    const { container } = render(<LineChart series={[cats[0], { ...cats[1], hidden: true }]} />);
    expect(container.querySelectorAll('path[data-line]')).toHaveLength(1);
    const b = screen.getByRole('button', { name: 'B' });
    expect(b).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(b);
    expect(container.querySelectorAll('path[data-line]')).toHaveLength(2);
    expect(b).toHaveAttribute('aria-pressed', 'true');
  });
  it('legend position, values and style; plain list by default', () => {
    const { container, rerender } = render(<LineChart series={cats} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(container.firstElementChild?.lastElementChild?.tagName).toBe('UL');
    rerender(<LineChart series={cats} legendPosition="top" legendValues={['latest', 'max']} legendStyle={{ color: 'rgb(1, 2, 3)' }} yFormat={(v) => `${v} u`} />);
    expect(container.firstElementChild?.firstElementChild?.tagName).toBe('UL');
    expect(screen.getByText('2 u · max 3 u')).toBeInTheDocument();
    expect((container.querySelector('ul') as HTMLElement).style.color).toBe('rgb(1, 2, 3)');
  });
  it('fixed y bounds, axis titles, thresholds, grid colour and tick style', () => {
    const { container } = render(
      <AreaChart series={cats} yMin={0} yMax={100} yLabel="Load" xLabel="Day" gridColor="#123456"
        tickStyle={{ color: '#654321', fontSize: 13 }} thresholds={[{ value: 80, label: 'Max', color: '#ff0000', style: 'solid' }]} />,
    );
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Load')).toBeInTheDocument();
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(container.querySelector('[data-threshold="80"] line')?.getAttribute('stroke')).toBe('#ff0000');
    expect(container.querySelector('line[stroke="#123456"]')).toBeTruthy();
    expect(screen.getByText('Mon').getAttribute('fill')).toBe('#654321');
  });
  it('time axis takes the same props and a time zone', () => {
    const { container } = render(<LineChart series={series} xAxis="time" curve="linear" thresholds={[{ value: 2 }]} timeZone="UTC" legendPosition="right" />);
    expect(container.querySelector('[data-threshold="2"]')).toBeTruthy();
    expect(container.querySelector('path[data-line]')?.getAttribute('d')).toMatch(/L/);
  });
  it('fill opacity per series; a line with fillOpacity gets an area', () => {
    const { container } = render(<LineChart series={[{ ...cats[0], fillOpacity: 0.5 }]} />);
    expect(container.querySelector('path[data-area]')?.getAttribute('opacity')).toBe('0.5');
  });
});

describe('BarChart settings props', () => {
  it('horizontal orientation and value labels', () => {
    const { container } = render(<BarChart series={[cats[0]]} orientation="horizontal" showValues yFormat={(v) => `${v}%`} />);
    const rects = [...container.querySelectorAll('g[data-series] rect')];
    expect(new Set(rects.map((r) => r.getAttribute('x'))).size).toBe(1);
    expect([...container.querySelectorAll('[data-value-label]')].map((t) => t.textContent)).toEqual(['1%', '3%', '2%']);
  });
  it('vertical thresholds on horizontal bars', () => {
    const { container } = render(<BarChart series={[cats[0]]} orientation="horizontal" thresholds={[{ value: 2 }]} />);
    const l = container.querySelector('[data-threshold="2"] line')!;
    expect(l.getAttribute('x1')).toBe(l.getAttribute('x2'));
  });
});

describe('Pie / Donut settings props', () => {
  const pie = [{ id: 'p', name: 'p', data: [{ x: 'A', y: 30 }, { x: 'B', y: 10 }] }];
  it('slice labels, legend values, centre on/off', () => {
    const { container, rerender } = render(<PieChart series={pie} labels="percent" legendValue="value" valueFormat={(v) => `${v} kg`} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('30 kg')).toBeInTheDocument();
    rerender(<DonutChart series={pie} centerLabel="Total" valueFormat={(v) => `${v} kg`} />);
    expect(container.querySelector('[data-center]')?.textContent).toBe('40 kg');
    expect(screen.getByText('Total')).toBeInTheDocument();
    rerender(<DonutChart series={pie} showCenter={false} />);
    expect(container.querySelector('[data-center]')).toBeNull();
  });
  it('legend toggle hides a slice', () => {
    const { container } = render(<PieChart series={pie} legendToggle />);
    expect(container.querySelectorAll('svg path')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'B' }));
    expect(container.querySelectorAll('svg path').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('ScatterChart settings props', () => {
  it('x bounds and formats, axis titles', () => {
    render(<ScatterChart series={[{ id: 's', name: 's', data: [{ x: 1, y: 1 }, { x: 2, y: 2 }] }]} xMin={0} xMax={10} xFormat={(v) => `${v} m`} xLabel="Distance" />);
    expect(screen.getByText('10 m')).toBeInTheDocument();
    expect(screen.getByText('Distance')).toBeInTheDocument();
  });
});

describe('HeatmapChart settings props', () => {
  const cells = [{ x: 'Mon', y: '1', value: 1 }, { x: 'Tue', y: '1', value: 9 }];
  it('banded colours, cell values, banded legend', () => {
    const { container } = render(
      <HeatmapChart cells={cells} showValues colorFor={(v) => (v > 5 ? '#ff0000' : undefined)} legendItems={[{ color: '#ff0000', label: 'Hot' }]} />,
    );
    expect(container.querySelectorAll('rect[fill="#ff0000"]')).toHaveLength(1);
    expect(container.querySelectorAll('[data-cell-label]')).toHaveLength(2);
    expect(screen.getByText('Hot')).toBeInTheDocument();
  });
  it('legend on the right', () => {
    const { container } = render(<HeatmapChart cells={cells} legendPosition="right" />);
    expect(container.firstElementChild?.lastElementChild?.getAttribute('data-heat-legend')).toBe('scale');
  });
});
