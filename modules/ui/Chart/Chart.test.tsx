import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GaugeChart, HeatmapChart, LineChart, AreaChart, BarChart } from './index';

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
