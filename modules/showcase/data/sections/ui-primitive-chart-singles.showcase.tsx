'use client';
import React from 'react';
import { LineChart, AreaChart, GaugeChart, HeatmapChart, type Series } from '@/modules/ui/Chart';
import type { ShowcaseComponent } from '../showcase.types';

// ── Deterministic demo data (no Math.random, no Date.now) ───────────
const BANDS = [
  { to: 60, tone: 'success' as const },
  { to: 85, tone: 'warning' as const },
  { to: 100, tone: 'error' as const },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
/** 7 days x 24 hours; every 37th cell is missing (null), never 0. */
const heatCells = Array.from({ length: 7 * 24 }, (_, i) => {
  const day = Math.floor(i / 24);
  const hour = i % 24;
  return { x: String(hour).padStart(2, '0'), y: DAYS[day], value: i % 37 === 0 ? null : Math.round(40 + 35 * Math.sin(hour / 4) + day * 3) };
});
/** 3 rooms x 4 time slots, all present, on a fixed 0-100 scale. */
const roomCells = ['Lab', 'Hall', 'Office'].flatMap((room, r) =>
  ['06:00', '12:00', '18:00', '24:00'].map((slot, c) => ({ x: slot, y: room, value: 20 + r * 25 + c * 10 })),
);

const T0 = Date.UTC(2026, 9, 6, 8, 0, 0);
const iso = (ms: number) => new Date(ms).toISOString();
/** 60 samples roughly 7 minutes apart with a deterministic jitter (uneven instants). */
const tempSeries: Series[] = [
  {
    id: 'temp',
    name: 'Temperature',
    data: Array.from({ length: 60 }, (_, i) => ({
      x: iso(T0 + i * 7 * 60_000 + (i % 3) * 20_000),
      y: Math.round((21 + Math.sin(i / 6) * 3 + (i % 5) * 0.2) * 10) / 10,
    })),
  },
  {
    id: 'setpoint',
    name: 'Setpoint',
    data: [
      { x: iso(T0), y: 22 },
      { x: iso(T0 + 3 * 3_600_000), y: 22 },
      { x: iso(T0 + 7 * 3_600_000), y: 20 },
    ],
  },
];
/** Two sensors sampled at different instants on the same axis. */
const flowSeries: Series[] = [
  {
    id: 'inlet',
    name: 'Inlet flow',
    data: Array.from({ length: 24 }, (_, i) => ({ x: iso(T0 + i * 10 * 60_000), y: 40 + (i % 6) * 4 })),
  },
  {
    id: 'outlet',
    name: 'Outlet flow',
    data: Array.from({ length: 16 }, (_, i) => ({ x: iso(T0 + 5 * 60_000 + i * 15 * 60_000), y: 35 + (i % 4) * 5 })),
  },
];

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full rounded-xl border border-border bg-surface-raised p-4 shadow-sm">
      <p className="mb-2 text-xs font-medium text-text-secondary">{title}</p>
      {children}
    </div>
  );
}

export function buildPrimitiveChartSinglesData(): ShowcaseComponent[] {
  return [
    {
      id: 'gauge-chart',
      title: 'GaugeChart',
      category: 'Molecule',
      abbr: 'Gc',
      since: '2026-10',
      status: 'beta',
      description:
        'Half-donut gauge (role="meter") with threshold bands, optional needle, three sizes and a stale state for readings that stopped updating. Part of the Chart library (`@/modules/ui/Chart`); the colour comes from semantic tokens through `bands[].tone`.',
      filePath: 'modules/ui/Chart/charts/GaugeChart.tsx',
      relatedTo: ['chart', 'heatmap-chart', 'time-series-chart'],
      designTokens: ['--success', '--warning', '--error', '--info', '--surface-sunken', '--text-primary', '--text-secondary'],
      a11y: { wcagLevel: 'AA', ariaPatterns: ['meter'], notes: 'role="meter" with aria-valuemin / aria-valuemax / aria-valuenow and an aria-label from `label`.' },
      sourceCode: `'use client';
import { GaugeChart } from '@/modules/ui/Chart';

<GaugeChart value={34} unit="%" label="CPU"
  bands={[{ to: 60, tone: 'success' }, { to: 85, tone: 'warning' }, { to: 100, tone: 'error' }]} />`,
      variants: [
        {
          title: 'Threshold bands',
          layout: 'stack' as const,
          preview: (
            <Frame title="CPU 34% (success band), Disk 91% (error band)">
              <div className="flex flex-wrap items-end gap-6">
                <GaugeChart value={34} unit="%" label="CPU" bands={BANDS} />
                <GaugeChart value={91} unit="%" label="Disk" bands={BANDS} />
              </div>
            </Frame>
          ),
          code: `<GaugeChart value={34} unit="%" label="CPU" bands={bands} />\n<GaugeChart value={91} unit="%" label="Disk" bands={bands} />`,
        },
        {
          title: 'Needle',
          layout: 'stack' as const,
          preview: (
            <Frame title="Disk 91% with a needle">
              <GaugeChart value={91} unit="%" label="Disk" needle bands={BANDS} />
            </Frame>
          ),
          code: `<GaugeChart value={91} min={0} max={100} unit="%" label="Disk" needle bands={bands} />`,
        },
        {
          title: 'Stale reading',
          layout: 'stack' as const,
          preview: (
            <Frame title="The value stopped updating">
              <GaugeChart value={72} size="sm" label="Stale reading" stale />
            </Frame>
          ),
          code: `<GaugeChart value={72} size="sm" label="Stale reading" stale />`,
        },
        {
          title: 'Sizes',
          layout: 'stack' as const,
          preview: (
            <Frame title="sm, md, lg at 55%">
              <div className="flex flex-wrap items-end gap-6">
                {(['sm', 'md', 'lg'] as const).map((s) => (
                  <GaugeChart key={s} value={55} unit="%" label={s} size={s} bands={BANDS} />
                ))}
              </div>
            </Frame>
          ),
          code: `<GaugeChart value={55} unit="%" label="sm" size="sm" bands={bands} />\n<GaugeChart value={55} unit="%" label="md" size="md" bands={bands} />\n<GaugeChart value={55} unit="%" label="lg" size="lg" bands={bands} />`,
        },
      ],
    },
    {
      id: 'heatmap-chart',
      title: 'HeatmapChart',
      category: 'Molecule',
      abbr: 'Hm',
      since: '2026-10',
      status: 'beta',
      description:
        'Matrix of cells coloured on one token scale. A missing value (`null`) renders as an empty cell, never as 0, so gaps in the data stay visible. Hover shows the value; the scale can be fixed with `min` / `max`.',
      filePath: 'modules/ui/Chart/charts/HeatmapChart.tsx',
      relatedTo: ['chart', 'gauge-chart', 'time-series-chart'],
      designTokens: ['--primary', '--surface-sunken', '--border', '--text-secondary'],
      a11y: { wcagLevel: 'AA', ariaPatterns: ['img'], notes: 'role="img" with an aria-label; the hover tooltip repeats the cell value as text.' },
      sourceCode: `'use client';
import { HeatmapChart } from '@/modules/ui/Chart';

<HeatmapChart cells={[{ x: '08', y: 'Mon', value: 42 }, { x: '09', y: 'Mon', value: null }]} valueLabel="Messages" />`,
      variants: [
        {
          title: 'Missing data is empty, not zero',
          layout: 'stack' as const,
          preview: (
            <Frame title="Messages per hour and weekday (every 37th cell is missing)">
              <HeatmapChart cells={heatCells} height={220} valueLabel="Messages" />
            </Frame>
          ),
          code: `<HeatmapChart cells={cells} height={220} valueLabel="Messages" />`,
        },
        {
          title: 'Fixed scale and value format',
          layout: 'stack' as const,
          preview: (
            <Frame title="Humidity by room and time of day (fixed 0-100 scale)">
              <HeatmapChart cells={roomCells} height={140} min={0} max={100} valueLabel="Humidity" valueFormat={(v) => `${v}%`} />
            </Frame>
          ),
          code: `<HeatmapChart cells={cells} min={0} max={100} valueLabel="Humidity" valueFormat={(v) => v + '%'} />`,
        },
      ],
    },
    {
      id: 'time-series-chart',
      title: 'TimeSeriesChart',
      category: 'Molecule',
      abbr: 'Ts',
      since: '2026-10',
      status: 'beta',
      description:
        'The continuous time axis behind `LineChart` / `AreaChart` with `xAxis="time"`: timestamps (ISO strings or epoch ms) in `x`, uneven sampling, series with different instants on one axis, and drag-to-zoom (double-click or "Reset zoom" to leave). Zoom is local to the chart and never reaches the caller.',
      filePath: 'modules/ui/Chart/charts/TimeSeriesChart.tsx',
      relatedTo: ['chart', 'gauge-chart', 'heatmap-chart'],
      designTokens: ['--primary', '--secondary', '--border', '--text-secondary', '--surface-raised'],
      a11y: { wcagLevel: 'AA', ariaPatterns: ['img'], notes: 'role="img" with an aria-label; the tooltip and crosshair follow the nearest sample.' },
      sourceCode: `'use client';
import { LineChart, AreaChart } from '@/modules/ui/Chart';

<LineChart series={series} xAxis="time" yFormat={(v) => v + '°C'} />
<AreaChart series={series} xAxis="time" />`,
      variants: [
        {
          title: 'Line with drag-to-zoom',
          layout: 'stack' as const,
          preview: (
            <Frame title="Temperature vs setpoint (drag a range to zoom, double-click to reset)">
              <LineChart series={tempSeries} xAxis="time" height={240} yFormat={(v) => `${v}°C`} />
            </Frame>
          ),
          code: `<LineChart series={series} xAxis="time" height={240} yFormat={(v) => v + '°C'} />`,
        },
        {
          title: 'Area, series sampled at different instants',
          layout: 'stack' as const,
          preview: (
            <Frame title="Inlet (every 10 min) and outlet (every 15 min) flow">
              <AreaChart series={flowSeries} xAxis="time" height={240} />
            </Frame>
          ),
          code: `<AreaChart series={[inlet, outlet]} xAxis="time" height={240} />`,
        },
        {
          title: 'Zoom disabled',
          layout: 'stack' as const,
          preview: (
            <Frame title="Same data, zoom={false}">
              <LineChart series={tempSeries} xAxis="time" zoom={false} height={200} yFormat={(v) => `${v}°C`} />
            </Frame>
          ),
          code: `<LineChart series={series} xAxis="time" zoom={false} />`,
        },
      ],
    },
  ];
}
