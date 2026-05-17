# MetricSparklineCard

- **id:** `iot-metric-sparkline-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/iot/telemetry/MetricSparklineCard.tsx`
- **status:** stable
- **since:** 2026-05

KPI tile with current value, unit, delta-vs-prev, and an inline SVG sparkline. No deps.

## Variants

### Four KPIs

```tsx
<MetricSparklineCard label="CPU" value={36} unit="%" series={[...]} deltaPct={5.2} goodWhen="down" />
```

### No delta

```tsx
<MetricSparklineCard label="Idle metric" value="—" series={[1,1,1,1]} />
```

## Full source

```tsx
import { MetricSparklineCard } from '@/modules/domains/iot/telemetry/MetricSparklineCard';
<MetricSparklineCard label="CPU" value={36} unit="%" series={[28,30,33,...]} deltaPct={5.2} goodWhen="down" />
```
