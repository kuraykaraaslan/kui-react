# PerformanceSparkline

- **id:** `fintech-performance-sparkline`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/fintech/portfolio/PerformanceSparkline.tsx`
- **status:** stable
- **since:** 2026-05

Inline sparkline + percent change label. Auto-colors green / red based on net change.

## Variants

### Trending up

```tsx
<PerformanceSparkline series={[10840, ..., 11516]} />
```

### Trending down

```tsx
<PerformanceSparkline series={[12500, ..., 11450]} />
```

## Full source

```tsx
import { PerformanceSparkline } from '@/modules/domains/fintech/portfolio/PerformanceSparkline';
<PerformanceSparkline series={[10840, 10980, 11100, ...]} />
```
