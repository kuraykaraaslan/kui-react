# Charts — Geliştirme Planı (EJS Pariteli)

> NextJS: [Charts.tsx](../modules/domains/common/charts/Charts.tsx) 253 + domain-specific 5 dosya.  
> EJS: [Charts.ejs](../../02_EJS_Components/modules/domain/common/charts/Charts.ejs) 149.  
> Mevcut yapı tek dosyada birkaç tip; bunu tutarlı bir **`@/modules/ui/Chart/*`** primitif kütüphanesine yükselt.

## Kuzey Yıldızı
Recharts + Visx + Apache ECharts + Observable Plot seviyesi: Line / Bar / Pie / Area / Scatter / Heatmap / Treemap / Radar / Funnel / Sankey, responsive, accessible, theme-aware.

---

## Yeni yapı (NextJS)
```
modules/ui/Chart/
├── index.ts               ← named export per chart tipi
├── types.ts               ← SeriesPoint, Series, ChartTheme, Tooltip
├── primitives/            ← Recharts wrap'ları (token-aware)
│   ├── Axis.tsx
│   ├── Legend.tsx
│   ├── Tooltip.tsx
│   ├── Grid.tsx
│   ├── Brush.tsx          ← zoom slider
│   └── Crosshair.tsx
├── charts/
│   ├── LineChart.tsx
│   ├── BarChart.tsx
│   ├── AreaChart.tsx
│   ├── PieChart.tsx
│   ├── DonutChart.tsx
│   ├── ScatterChart.tsx
│   ├── BubbleChart.tsx
│   ├── HeatmapChart.tsx
│   ├── TreemapChart.tsx
│   ├── RadarChart.tsx
│   ├── FunnelChart.tsx
│   ├── SankeyChart.tsx     ← visx
│   ├── CandlestickChart.tsx ← finansal
│   ├── GaugeChart.tsx
│   └── SparkLine.tsx       ← inline mini
└── theme.ts               ← --primary/--info/... token bağlama

modules/domains/common/charts/Charts.tsx
  → kullanılan primitiflere yönlendir, domain-specific olanlar (WatchTime / TransactionVolume / FloorPrice / PortfolioDonut / Telemetry) bu yeni primitiflerden derlensin.
```

### EJS paralel
- `modules/ui/Chart/`'a paralel `.ejs` dosyaları + her chart için dedicated script.
- Engine seçimi: NextJS `recharts` (zaten kurulu); EJS `chart.js` veya `echarts` (vanilla).
- Public API symmetrical (props vs data-attr).

---

## Milestone'lar

### M1 — Token + theme + primitives
- Tüm renkler `var(--primary)`, `var(--info)`, `var(--success)`, vb.'den.
- Dark mode auto.
- Print stylesheet (renkler high-contrast).
- Common primitives: Axis, Legend, Tooltip, Grid (token-aware).
- Responsive container (ResizeObserver-based).

### M2 — Temel chart tipleri
- Line / Bar / Area / Pie / Donut / Scatter.
- Tooltip + crosshair + active series.
- Animation entry (250 ms, reduced-motion off → instant).
- Empty state.
- Loading skeleton.

### M3 — İleri chart tipleri
- Heatmap (calendar / matrix).
- Treemap (squarified).
- Radar (multi-axis).
- Funnel.
- Sankey (visx-sankey lazy).
- Candlestick / OHLC (finans).
- Gauge.
- Sparkline (inline tek-satır).

### M4 — Interaktivite
- Brush zoom (alt aralık seçici).
- Pan + zoom (wheel + drag).
- Toggle series legend click.
- Drill-down (`onDataPointClick`).
- Synchronized tooltip (multi-chart aynı x ekseninde).

### M5 — A11y + i18n + export
- WAI-ARIA: tüm chart `role="img"` + `aria-label` özet + visually hidden table eşi.
- Klavye nav: arrow → next data point, Enter → details.
- Reduced motion.
- `messages` prop.
- Export: PNG (canvas), SVG, CSV.

### M6 — Premium
- Annotation: trend line, mean, target, vertical marker.
- Forecast (Holt-Winters opsiyonel).
- Real-time streaming (sliding window).
- Threshold (alert zones).
- Compare period (overlay previous period).

---

## Public API (ortak iskelet)
```ts
type BaseChartProps = {
  data: SeriesPoint[];
  series: Series[];
  width?: number | string;
  height?: number | string;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  tooltip?: boolean | { content?: (ctx) => React.ReactNode };
  legend?: boolean | { position?: 'top' | 'bottom' | 'left' | 'right' };
  grid?: boolean;
  brush?: boolean;
  annotations?: Annotation[];
  exportFormats?: ('png' | 'svg' | 'csv')[];
  messages?: Partial<ChartMessages>;
  reducedMotion?: boolean;
  onDataPointClick?: (point: SeriesPoint, series: Series) => void;
  onTelemetry?: (e: ChartTelemetry) => void;
};
```

## Perf
- Core (primitifler) ≤ 18 kB.
- Recharts already 60 kB lazy chunk.
- Heatmap/Sankey/Candlestick lazy +5–15 kB her biri.
- 10 000 nokta line @ ≥ 55 fps (canvas fallback).

## DoD
- [ ] NextJS + EJS paralel.
- [ ] Domain chart'lar (WatchTime, TransactionVolume, FloorPrice, PortfolioDonut, Telemetry) yeni primitifleri kullanıyor — kod yarıya iner.
- [ ] axe-core 0 violations.
- [ ] Showcase: tüm chart tipleri + dark mode + responsive + export variant'ları.
