# ModelCard

- **id:** `ai-model-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/ai/model/ModelCard.tsx`
- **status:** stable
- **since:** 2026-05

Card summarising an AI model with provider, type badges, context window, and pricing.

## Variants

### Active text model with link

```tsx
<ModelCard model={model} href="/models/gpt-4o" />
```

### Inactive image model

```tsx
<ModelCard model={model} />
```

## Full source

```tsx
import { ModelCard } from '@/modules/domains/ai/model/ModelCard';
<ModelCard model={model} href="/models/gpt-4o" />
```
