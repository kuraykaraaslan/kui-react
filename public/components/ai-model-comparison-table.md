# ModelComparisonTable

- **id:** `ai-model-comparison-table`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/ai/compare/ModelComparisonTable.tsx`
- **status:** stable
- **since:** 2026-05

Side-by-side table comparing AI models across price, context, benchmarks, and feature support.

## Variants

### Three models compared

```tsx
<ModelComparisonTable rows={rows} featureKeys={featureKeys} />
```

### Two models only

```tsx
<ModelComparisonTable rows={rows.slice(0, 2)} featureKeys={featureKeys} />
```

## Full source

```tsx
import { ModelComparisonTable } from '@/modules/domains/ai/compare/ModelComparisonTable';
<ModelComparisonTable rows={rows} featureKeys={featureKeys} />
```
