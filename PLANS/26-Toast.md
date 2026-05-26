# Toast — Geliştirme Planı (EJS Pariteli)

> NextJS: [Toast.tsx](../modules/ui/Toast.tsx) 267 + [Toast.store.ts](../modules/ui/Toast.store.ts) 103.  
> EJS: [Toast.ejs](../../02_EJS_Components/modules/ui/Toast.ejs) 261.

## Kuzey Yıldızı
react-hot-toast + sonner + radix Toast seviyesi: region stacking, swipe-to-dismiss, action button, promise toast, queue, accessible (WAI-ARIA Alert/Status).

---

## Hedef yapı
```
modules/ui/Toast/
├── index.tsx           ← Toaster (region container) + useToast hook + toast() API
├── types.ts            ← Toast, ToastVariant, ToastPosition
├── parts/
│   ├── ToastItem.tsx
│   ├── Region.tsx      ← position-aware container (6 corner/edge slot)
│   └── ProgressBar.tsx ← countdown bar
└── hooks/
    ├── useSwipeDismiss.ts
    └── useToastStore.ts
```

### EJS paralel
- Toast.ejs ana script global API (`window.toast`).
- Partials: `_toast-item.ejs`, `_region.ejs`.
- Scripts: store.js, swipe.js, region.js.

---

## Milestone'lar

### M1 — API + queue
- Imperative: `toast(msg, opts)`, `toast.success(...)`, `toast.error(...)`, `toast.loading(...)`, `toast.promise(p, { loading, success, error })`.
- Hook: `useToast()` (declarative).
- Queue limit (`max: 5`), older toast'lar dismiss.
- 6 pozisyon (top-left/center/right, bottom-left/center/right).
- Stack animasyonu (yeni toast yukarıdakini iter).

### M2 — Variant + action
- `variant: 'info' | 'success' | 'warning' | 'error' | 'loading'` + icon.
- `action: { label, onClick }` — "Undo" patterned.
- `duration: number | Infinity` + progress bar.
- `dismissible: boolean` + close X.
- Custom render (`render: (t) => ReactNode`).

### M3 — Gesture + a11y
- Swipe-to-dismiss (touch + mouse).
- `prefers-reduced-motion` honor.
- ARIA: `role="status"` (info/success), `role="alert"` (warning/error). Aria-live polite/assertive.
- Focus management: kritik error toast'larda focus alabilir.
- Klavye: Esc → focused toast'u dismiss.

### M4 — Premium
- Promise toast: tek toast loading → success/error.
- Group: aynı `id` ile mevcut toast'u güncelle (rate-limit).
- Persistent toast (oturum boyu, "Acknowledge" gerektirir).
- Notification badge sayacı (icon overlay).

---

## Public API
```ts
toast(message, {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'loading',
  duration?: number | Infinity,
  action?: { label: string; onClick: () => void },
  position?: ToastPosition,
  dismissible?: boolean,
  id?: string,
  render?: (t: Toast) => React.ReactNode,
});

toast.promise(promise, { loading, success, error });

<Toaster
  position="top-right"
  max={5}
  gap={8}
  reducedMotion={false}
  messages={{ ... }}
/>
```

## Perf
- Core ≤ 6 kB.
- Animasyon CSS transform-only (GPU).

## DoD
- [ ] NextJS + EJS paralel — EJS'te `window.toast()` global API NextJS API'sine eş.
- [ ] axe-core 0 violations.
- [ ] Showcase: tüm variant + promise + action + 6 position.
