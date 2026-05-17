# LoadingState

- **id:** `loading-state`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/LoadingState.tsx`
- **status:** stable
- **since:** 2025-03

İskelet yükleme animasyonları. spinner / table / cards / list / detail / form variant'ları.

## Variants

### Spinner

```tsx
<LoadingState variant="spinner" />
```

### Table skeleton

```tsx
<LoadingState variant="table" rows={5} cols={4} />
```

### Cards skeleton

```tsx
<LoadingState variant="cards" cards={3} />
```

### List skeleton

```tsx
<LoadingState variant="list" rows={4} />
```

### Form skeleton

```tsx
<LoadingState variant="form" rows={3} />
```

## Full source

```tsx
'use client';
import { LoadingState } from '@/modules/app/LoadingState';

<LoadingState variant="spinner" />
<LoadingState variant="table"  rows={5} cols={4} />
<LoadingState variant="cards"  cards={3} />
<LoadingState variant="list"   rows={4} />
<LoadingState variant="form"   rows={3} />
```
