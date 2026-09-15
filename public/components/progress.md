# Progress

- **id:** `progress`
- **layer:** ui
- **category:** Atom
- **filePath:** `modules/ui/Progress.tsx`
- **status:** stable
- **since:** 2026-09

Determinate progress indicator as a bar or a circle, with variant colors and an optional percentage label.

## Variants

### Bar

```tsx
<Progress value={30} />
<Progress value={62} variant="warning" showLabel />
<Progress value={90} variant="success" size="lg" showLabel />
```

### Circle

```tsx
<Progress value={40} shape="circle" showLabel />
<Progress value={75} shape="circle" variant="success" size="lg" showLabel />
```

## Full source

```tsx
'use client';
import { Progress } from '@/modules/ui/Progress';

<Progress value={62} />
<Progress value={90} variant="success" showLabel />
<Progress value={40} shape="circle" showLabel />
```
