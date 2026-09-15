# Statistic

- **id:** `statistic`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Statistic.tsx`
- **status:** stable
- **since:** 2026-09

Bare numeric/text figure with a label, optional prefix/suffix, trend indicator, and loading skeleton — no card chrome (compose with Card for a bordered KPI tile).

## Variants

### Basic

```tsx
<Statistic label="Active users" value={1284} />
<Statistic label="Open tickets" value={12} />
```

### Prefix / suffix / trend

```tsx
<Statistic label="Revenue" value={82400} prefix="$" trend="up" trendValue="+12.4%" />
<Statistic label="Conversion rate" value={4.2} precision={1} suffix="%" trend="down" trendValue="-0.6%" />
<Statistic label="Loading example" value={0} loading />
```

## Full source

```tsx
'use client';
import { Statistic } from '@/modules/ui/Statistic';

<Statistic label="Active users" value={1284} />
<Statistic label="Conversion rate" value={4.2} precision={1} suffix="%" trend="up" trendValue="+0.6%" />
<Statistic label="Revenue" value={82400} prefix="$" trend="down" trendValue="-3.1%" />
```
