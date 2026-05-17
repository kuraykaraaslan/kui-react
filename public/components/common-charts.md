# Charts

- **id:** `common-charts`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/charts/Charts.tsx`
- **status:** beta
- **since:** 2025-05

react-chartjs-2 chart components wrapped in Cards: Bar, Line, Doughnut, Radar, and Polar Area.

## Variants

### Bar — Revenue vs Expenses

```tsx
<RevenueBarChart />
```

### Line — User Activity

```tsx
<UserActivityLineChart />
```

### Doughnut — Sales by Category

```tsx
<SalesByCategoryDoughnut />
```

### Radar — Product Comparison

```tsx
<ProductComparisonRadar />
```

### Polar Area — Regional Sales

```tsx
<RegionalSalesPolar />
```

## Full source

```tsx
import {
  RevenueBarChart,
  UserActivityLineChart,
  SalesByCategoryDoughnut,
  ProductComparisonRadar,
  RegionalSalesPolar,
} from '@/modules/domains/common/charts/Charts';

<RevenueBarChart />
<UserActivityLineChart />
<SalesByCategoryDoughnut />
<ProductComparisonRadar />
<RegionalSalesPolar />
```
