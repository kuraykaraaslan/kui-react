# SeoPreview

- **id:** `common-seo-preview`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/seo/SeoPreview.tsx`
- **status:** stable
- **since:** 2025-04

Google search result preview card. Shows title, URL, and description with character count indicators. Empty fields render placeholder text.

## Variants

### Filled

```tsx
<SeoPreview seo={{ seoTitle: 'My Page Title', seoDescription: 'A clear meta description.', keywords: ['next', 'react'] }} url="https://example.com/page" />
```

### Empty (placeholders)

```tsx
<SeoPreview seo={{}} url="https://example.com/page" />
```

## Full source

```tsx
<SeoPreview
  seo={{ seoTitle: 'My Page', seoDescription: 'Description…', keywords: ['next'] }}
  url="https://example.com/my-page"
  siteName="Example"
/>
```
