# ErrorState

- **id:** `error-state`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/EmptyErrorState.tsx`
- **status:** stable
- **since:** 2025-03

Hata durumu: uyarı banner'ı + merkezi boş durum kombinasyonu. onRetry ile yeniden deneme aksiyonu.

## Variants

### Default

```tsx
<ErrorState
  title="Something went wrong"
  message="Failed to load user data. Please check your connection."
/>
```

### With retry

```tsx
<ErrorState
  title="Database connection failed"
  message="Could not connect to the database. Please try again."
  onRetry={handleRetry}
  retryLabel="Try again"
/>
```

## Full source

```tsx
'use client';
import { ErrorState } from '@/modules/app/EmptyErrorState';

<ErrorState
  title="Something went wrong"
  message="Failed to load user data."
/>

// Retry aksiyonu ile:
<ErrorState
  title="Database connection failed"
  message="Could not connect. Please try again."
  onRetry={handleRetry}
  retryLabel="Try again"
/>
```
