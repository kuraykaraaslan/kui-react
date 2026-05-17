# CodeSamplePanel

- **id:** `api-doc-code-sample-panel`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/api-doc/CodeSamplePanel.tsx`
- **status:** stable
- **since:** 2025-04

Dark-themed panel showing code samples in multiple languages with tab switching and a one-click copy button.

## Variants

### Multi-language sample

```tsx
<CodeSamplePanel samples={[
  { lang: 'curl', label: 'cURL', source: `curl -X GET 'https://api.example.com/v1/users'` },
  { lang: 'javascript', label: 'JavaScript', source: `const res = await fetch('/users');` },
  { lang: 'python', label: 'Python', source: `import requests\nr = requests.get('/users')` },
]} />
```

### Single language

```tsx
<CodeSamplePanel samples={[{ lang: 'bash', label: 'Shell', source: '...' }]} />
```

## Full source

```tsx
import { CodeSamplePanel } from '@/modules/domains/api-doc/CodeSamplePanel';

<CodeSamplePanel samples={[
  { lang: 'curl', label: 'cURL', source: '...' },
  { lang: 'javascript', label: 'JS', source: '...' },
]} />
```
