# CurrencySelector

- **id:** `common-currency-selector`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/money/CurrencySelector.tsx`
- **status:** stable
- **since:** 2025-04

Currency dropdown built from countries-list. Deduped, alphabetically sorted ISO 4217 currency codes.

## Variants

### Default

```tsx
<CurrencySelector value={currency} onChange={setCurrency} />
```

### No label

```tsx
<CurrencySelector value="USD" onChange={setCurrency} label="" />
```

## Full source

```tsx
const [currency, setCurrency] = useState('TRY');

<CurrencySelector value={currency} onChange={setCurrency} />
```
