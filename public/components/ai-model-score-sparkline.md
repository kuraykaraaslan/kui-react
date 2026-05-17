# ModelScoreSparkline

- **id:** `ai-model-score-sparkline`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/ai/compare/ModelScoreSparkline.tsx`
- **status:** stable
- **since:** 2026-05

Compact inline sparkline for AI model benchmark scores over time.

## Variants

### Upward trend

```tsx
<ModelScoreSparkline scores={[62, 68, 71, 78, 81, 84, 86, 88]} label="MMLU" />
```

### Wider canvas

```tsx
<ModelScoreSparkline scores={[…]} width={220} height={48} label="GSM8K" />
```

## Full source

```tsx
import { ModelScoreSparkline } from '@/modules/domains/ai/compare/ModelScoreSparkline';
<ModelScoreSparkline scores={[62, 68, 71, 78, 81, 84, 86, 88]} />
```
