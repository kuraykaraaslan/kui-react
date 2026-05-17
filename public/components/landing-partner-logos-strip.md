# PartnerLogosStrip

- **id:** `landing-partner-logos-strip`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/landing/partner/PartnerLogosStrip.tsx`
- **status:** stable
- **since:** 2026-05

Horizontal strip of grayscale partner logos. On hover the logo transitions to full colour. Logos with a url prop are wrapped in an accessible <a>.

## Variants

### With label

```tsx
<PartnerLogosStrip label="Trusted by teams at" partners={partners} />
```

### Without label

```tsx
<PartnerLogosStrip partners={partners} />
```

## Full source

```tsx
'use client';
import { PartnerLogosStrip } from '@/modules/domains/landing/partner/PartnerLogosStrip';

<PartnerLogosStrip
  label="Trusted by teams at"
  partners={[
    { partnerId: 'p1', name: 'GitHub', logo: '/logos/github.svg', url: 'https://github.com' },
  ]}
/>
```
