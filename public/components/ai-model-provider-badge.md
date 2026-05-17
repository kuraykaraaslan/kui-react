# ModelProviderBadge

- **id:** `ai-model-provider-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/ai/model/ModelProviderBadge.tsx`
- **status:** stable
- **since:** 2026-05

Colour-coded badge that maps an AI provider name to a semantic variant.

## Variants

### All providers

```tsx
{(['OPENAI', 'ANTHROPIC', 'GOOGLE', 'XAI', 'DEEPSEEK', 'AZURE_OPENAI', 'CUSTOM'] as const).map((p) => (
  <ModelProviderBadge key={p} provider={p} />
))}
```

### Small size

```tsx
<ModelProviderBadge provider="OPENAI" size="sm" />
```

## Full source

```tsx
import { ModelProviderBadge } from '@/modules/domains/ai/model/ModelProviderBadge';
<ModelProviderBadge provider="ANTHROPIC" />
```
