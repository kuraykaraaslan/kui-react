# UsageStatsCard

- **id:** `ai-usage-stats-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/ai/usage/UsageStatsCard.tsx`
- **status:** stable
- **since:** 2026-05

Card displaying prompt tokens, completion tokens, and cost for a single AI usage record.

## Variants

### GPT-4o usage

```tsx
<UsageStatsCard usage={usage} />
```

### Low-cost model

```tsx
<UsageStatsCard usage={cheapUsage} />
```

## Full source

```tsx
import { UsageStatsCard } from '@/modules/domains/ai/usage/UsageStatsCard';
<UsageStatsCard usage={usage} />
```
