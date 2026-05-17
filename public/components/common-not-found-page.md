# NotFoundPage

- **id:** `common-not-found-page`
- **layer:** app
- **category:** Domain
- **filePath:** `modules/app/NotFoundPage.tsx`
- **status:** stable
- **since:** 2025-05

Full-page 404 screen with a gradient "404" heading, icon slot, title, description, and home/back action buttons.

## Variants

### Default (Turkish)

```tsx
<NotFoundPage homeHref="/" />
```

### Custom copy

```tsx
<NotFoundPage title="Resource Not Found" description="The item you are looking for has been removed." homeLabel="Go Home" backLabel="Go Back" homeHref="/" />
```

## Full source

```tsx
'use client';
import { NotFoundPage } from '@/modules/app/NotFoundPage';

<NotFoundPage
  title="Page Not Found"
  description="The page you are looking for does not exist."
  homeHref="/"
  homeLabel="Go Home"
  backLabel="Go Back"
/>
```
