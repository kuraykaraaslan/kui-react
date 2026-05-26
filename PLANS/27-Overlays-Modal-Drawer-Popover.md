# Overlays — Modal + Drawer + Popover Geliştirme Planı (EJS Pariteli)

> NextJS: [Modal.tsx](../modules/ui/Modal.tsx) 105, [Drawer.tsx](../modules/ui/Drawer.tsx) 86, [Popover.tsx](../modules/ui/Popover.tsx) 70.  
> EJS: 106 / 121 / 86.

## Kuzey Yıldızı
Radix UI Dialog/Popover + Headless UI seviyesi: focus trap, scroll lock, portal, route-aware close, floating-ui positioning, accessible (WAI-ARIA Dialog/Tooltip pattern).

> Üç bileşen ortak altyapıyı paylaşır — `useOverlay()` hook'u bir kez yazılır, üçü de kullanır.

---

## Hedef yapı
```
modules/ui/Overlays/
├── Modal/index.tsx
├── Drawer/index.tsx
├── Popover/index.tsx
└── shared/
    ├── useFocusTrap.ts        ← Tab loop, return focus on close
    ├── useScrollLock.ts       ← body scroll lock + iOS rubber-band fix
    ├── usePortal.ts           ← createPortal target
    ├── useDismiss.ts          ← Esc + click-outside + nested layering
    ├── useRouteClose.ts       ← Next.js router events → auto-close
    ├── usePresence.ts         ← mount/unmount animation lifecycle
    └── positioning.ts         ← floating-ui wrap (Popover/Tooltip)
```

### EJS paralel
- Her bileşen kendi `.ejs`'sini korur; ortak `public/assets/js/overlay-shared/` altında `focus-trap.js`, `scroll-lock.js`, `dismiss.js`, `position.js`.

---

## Milestone'lar

### M1 — Shared hooks
- `useFocusTrap`: Tab/Shift+Tab loop, `data-focus-guard`, return focus on close, edge: nested modal.
- `useScrollLock`: body padding-right compensate, iOS `position: fixed` fallback.
- `useDismiss`: Esc, outside click (capture-phase), nested layering (`z-index` stack mgmt).
- `usePresence`: enter/exit animation phase (`open` → `closing` → `closed`).

### M2 — Modal
- Boyutlar: `sm/md/lg/xl/full`.
- Scroll behavior: `body | content`.
- Full-screen variant (sheet-from-bottom mobile).
- Footer slot (sticky actions).
- Confirm-style preset: `<Modal.Confirm title message onConfirm />`.
- Multi-step (Wizard) variant.

### M3 — Drawer
- Side: `left | right | top | bottom`.
- Resize handle (drag to resize).
- Snap points (mobile bottom-sheet: 25/50/90%).
- Push content mode (uncovered content shifts).
- Multi-drawer (nested layers).

### M4 — Popover
- floating-ui ile auto-position (collision flip/shift).
- Arrow.
- Trigger modes: `click | hover | focus | manual`.
- Hover delay (open/close).
- `as: 'tooltip' | 'menu' | 'popover'` (ARIA role değişir).
- Anchor virtual element (context menu).

### M5 — A11y + animation
- Tüm overlay'ler axe-core 0 violation.
- Reduced motion: instant snap.
- Animation tokens: `--motion-duration-modal`, `--motion-easing-overlay`.
- `data-state` ile CSS animasyon hook'ları.

### M6 — Route-aware + history
- `closeOnRouteChange?: boolean` — Next.js `usePathname` değişince close.
- `usePathname`/`router.events` ile entegre.
- Optional: deep link (`?modal=settings`) state sync.

---

## Public API
```ts
type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  scrollBehavior?: 'body' | 'content';
  footer?: React.ReactNode;
  closeOnRouteChange?: boolean;
  reducedMotion?: boolean;
};

type DrawerProps = ModalProps & {
  side: 'left' | 'right' | 'top' | 'bottom';
  resizable?: boolean;
  snapPoints?: number[];
  pushContent?: boolean;
};

type PopoverProps = {
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
  trigger: React.ReactNode | 'manual';
  placement?: Placement;
  triggerMode?: 'click' | 'hover' | 'focus' | 'manual';
  hoverDelay?: { open?: number; close?: number };
  as?: 'tooltip' | 'menu' | 'popover';
  arrow?: boolean;
};
```

## Perf
- Core (her biri) ≤ 4 kB.
- floating-ui lazy (sadece Popover) ≤ 5 kB.
- Animation 60 fps.

## DoD
- [ ] NextJS + EJS paralel.
- [ ] axe-core 0 violations.
- [ ] Tüm bileşenler aynı `useFocusTrap` + `useScrollLock` + `useDismiss`'i kullanıyor (DRY).
- [ ] Showcase: nested modal, drawer snap points, popover hover, tooltip variant.
