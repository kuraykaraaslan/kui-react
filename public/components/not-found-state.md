# NotFoundState

- **id:** `not-found-state`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/EmptyErrorState.tsx`
- **status:** stable
- **since:** 2025-03

Kayıt bulunamadı / içerik yok durumu. onGoBack ile geri dön aksiyonu.

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

// Özel başlık + geri dön butonu ile:
<NotFoundState
  title="User not found"
  description="This user account doesn't exist or may have been deleted."
  onGoBack={() => router.back()}
  goBackLabel="Back to users"
/>
```
