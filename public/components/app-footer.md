# AppFooter

- **id:** `app-footer`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/AppFooter.tsx`
- **status:** stable
- **since:** 2026-05

Two-row application footer with logo, navigation links, system status badge, version, copyright, and social slot.

## Variants

### Operational, with nav + version

```tsx
<AppFooter
  logo={<><BrandLogo size="sm">K</BrandLogo><span>KUIreact</span></>}
  nav={<><a href="#">Docs</a><a href="#">Pricing</a><a href="#">Status</a></>}
  version="0.2.0"
  status="operational"
  copyright="© 2026 KUIreact"
/>
```

## Full source

```tsx
'use client';
import { AppFooter } from '@/modules/app/AppFooter';

<AppFooter
  logo={<span className="font-semibold">KUIreact</span>}
  nav={<><a href="/docs">Docs</a><a href="/status">Status</a></>}
  version="0.2.0"
  status="operational"          // 'operational' | 'degraded' | 'outage'
  copyright="© 2026 KUIreact"
/>
```
