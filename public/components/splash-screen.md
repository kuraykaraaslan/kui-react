# SplashScreen

- **id:** `splash-screen`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/SplashScreen.tsx`
- **status:** beta
- **since:** 2025-05

Full-screen overlay shown during app initialisation. Accepts a logo slot, optional progress bar, and fades out when visible=false.

## Design tokens consumed

- `--primary`

## Variants

### Logo + message + progress

```tsx
<SplashScreen
  visible={true}
  logo={<span className="text-4xl font-black text-primary">Acme</span>}
  message="Loading your workspace…"
  progress={65}
/>
```

### Spinner only (no logo)

```tsx
<SplashScreen visible={true} message="Please wait…" />
```

### Interactive fade-out

```tsx
const [visible, setVisible] = useState(true);

<SplashScreen
  visible={visible}
  logo={<span className="text-4xl font-black text-primary">Acme</span>}
  message="Starting up…"
/>
<Button onClick={() => setVisible(false)}>Dismiss</Button>
```

## Full source

```tsx
'use client';
import { SplashScreen } from '@/modules/app/SplashScreen';

// Show on mount, hide once data is ready
<SplashScreen
  visible={isLoading}
  logo={<span className="text-4xl font-black text-primary">Acme</span>}
  message="Loading your workspace…"
  progress={progress}
/>
```
