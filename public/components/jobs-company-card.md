# CompanyCard

- **id:** `jobs-company-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/jobs/company/CompanyCard.tsx`
- **status:** stable
- **since:** 2026-05

Company profile card showing logo, name, industry, location, and open job count.

## Variants

### Verified with job count

```tsx
<CompanyCard company={company} jobCount={3} href="/companies/slug" />
```

### Unverified, no count

```tsx
<CompanyCard company={{ ...company, verified: false }} />
```

## Full source

```tsx
import { CompanyCard } from '@/modules/domains/jobs/company/CompanyCard';
<CompanyCard company={company} jobCount={5} href="/companies/slug" />
```
