# FeatureCheckCell

- **id:** `ai-feature-check-cell`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/ai/compare/FeatureCheckCell.tsx`
- **status:** stable
- **since:** 2026-05

Pill-style indicator for feature-support cells in comparison tables (yes/no/partial/preview).

## Variants

### All states

```tsx
<FeatureCheckCell value="yes" />
<FeatureCheckCell value="no" />
<FeatureCheckCell value="partial" />
<FeatureCheckCell value="preview" />
```

### Custom labels

```tsx
<FeatureCheckCell value="yes" label="Supported" />
```

## Full source

```tsx
import { FeatureCheckCell } from '@/modules/domains/ai/compare/FeatureCheckCell';
<FeatureCheckCell value="yes" />
```
