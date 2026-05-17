# InlineAlert

- **id:** `inline-alert`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/InlineAlert.tsx`
- **status:** stable
- **since:** 2026-05

Form işlem sonuçları için satır içi küçük uyarı; success / error / warning / info variantları.

## Variants

### Tüm variantlar

```tsx
<InlineAlert variant="success" message="Changes saved successfully." />
<InlineAlert variant="error"   message="Something went wrong." />
<InlineAlert variant="warning" message="Please review before saving." />
<InlineAlert variant="info"    message="This action cannot be undone." />
```

## Full source

```tsx
import { InlineAlert } from '@/modules/app/InlineAlert';

// Default: success
<InlineAlert message="Changes saved." />

// Error
<InlineAlert variant="error" message="Something went wrong." />

// Conditional display (e.g. after save)
{saved && <InlineAlert message="Profile saved successfully." />}
```
