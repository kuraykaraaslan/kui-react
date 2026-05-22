# NotFoundState

- **id:** `not-found-state`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/EmptyErrorState.tsx`
- **status:** stable
- **since:** 2025-03

Not-found / empty record state with optional go-back action.

## Variants

### Default

```tsx
<NotFoundState />
```

### With back link

```tsx
<NotFoundState
  title="User not found"
  description="This user account doesn't exist or may have been deleted."
  onGoBack={() => router.back()}
  goBackLabel="Back to users"
/>
```

## Full source

```tsx
'use client';
import { NotFoundState } from '@/modules/app/EmptyErrorState';

<NotFoundState />

// With custom title + back button:
<NotFoundState
  title="User not found"
  description="This user account doesn't exist or may have been deleted."
  onGoBack={() => router.back()}
  goBackLabel="Back to users"
/>
```
