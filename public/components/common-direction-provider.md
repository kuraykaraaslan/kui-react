# DirectionProvider

- **id:** `common-direction-provider`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/i18n/DirectionProvider.tsx`
- **status:** stable
- **since:** 2025-04

Context provider that sets dir="rtl"/"ltr" on a wrapper div based on the active language. useDirection() hook exposes lang, dir, isRTL.

## Variants

### RTL (Arabic)

```tsx
<DirectionProvider lang="ar">
  <p className="text-right">مرحبا بالعالم — Hello World</p>
</DirectionProvider>
```

### LTR (English)

```tsx
<DirectionProvider lang="en">
  <p>Hello World — مرحبا بالعالم</p>
</DirectionProvider>
```

## Full source

```tsx
<DirectionProvider lang={currentLang}>
  {/* all children inherit correct text direction */}
  <p>مرحبا بالعالم</p>
</DirectionProvider>
```
