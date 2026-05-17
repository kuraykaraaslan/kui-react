# CountrySelector

- **id:** `common-country-selector`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/location/CountrySelector.tsx`
- **status:** stable
- **since:** 2026-05

Country dropdown built from countries-list. Shows flag + full name + ISO2 code. Supports search by name or code, error/hint states.

## Variants

### Default

```tsx
<CountrySelector value={country} onChange={setCountry} />
```

### With hint & error

```tsx
<CountrySelector value="" onChange={setCountry} hint="Used for shipping address." />
<CountrySelector value="" onChange={setCountry} error="Please select a country." required />
```

### No label

```tsx
<CountrySelector value="US" onChange={setCountry} label="" />
```

## Full source

```tsx
const [country, setCountry] = useState('TR');

<CountrySelector value={country} onChange={setCountry} />
```
