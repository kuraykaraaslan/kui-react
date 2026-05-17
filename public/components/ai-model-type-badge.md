# ModelTypeBadge

- **id:** `ai-model-type-badge`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/ai/model/ModelTypeBadge.tsx`
- **status:** stable
- **since:** 2026-05

Badge indicating the modality of an AI model (Text, Image, Embedding, etc.).

## Variants

### All types

```tsx
{(['TEXT', 'IMAGE', 'EMBEDDING', 'AUDIO', 'VIDEO'] as const).map((t) => (
  <ModelTypeBadge key={t} type={t} />
))}
```

### Small size

```tsx
<ModelTypeBadge type="TEXT" size="sm" />
```

## Full source

```tsx
import { ModelTypeBadge } from '@/modules/domains/ai/model/ModelTypeBadge';
<ModelTypeBadge type="TEXT" />
```
