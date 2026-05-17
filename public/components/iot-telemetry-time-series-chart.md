# TelemetryTimeSeriesChart

- **id:** `iot-telemetry-time-series-chart`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/iot/telemetry/TelemetryTimeSeriesChart.tsx`
- **status:** stable
- **since:** 2026-05

Multi-line time-series chart built on chart.js. Supports any number of series with custom colors.

## Variants

### Vibration / Temp / RPM

```tsx
<TelemetryTimeSeriesChart title="..." labels={[...]} series={[{ label, color, data }, ...]} />
```

## Full source

```tsx
import { TelemetryTimeSeriesChart } from '@/modules/domains/iot/telemetry/TelemetryTimeSeriesChart';
<TelemetryTimeSeriesChart title="..." labels={['12:00', ...]} series={[{ label, color, data }]} />
```
