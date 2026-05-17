# LocationPicker

- **id:** `common-location-picker`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/location/LocationPicker.tsx`
- **status:** beta
- **since:** 2025-04

Location form with country selector (countries-list), city, state, postal code, and optional lat/lng. 2-column grid layout.

## Variants

### Empty

```tsx
<LocationPicker onSubmit={handleSave} />
```

### Pre-filled

```tsx
<LocationPicker initial={{ city: 'Istanbul', countryCode: 'TR', postalCode: '34000' }} onSubmit={handleSave} onCancel={handleCancel} />
```

## Full source

```tsx
<LocationPicker
  initial={{ city: 'Istanbul', countryCode: 'TR' }}
  onSubmit={async (loc) => saveLocation(loc)}
/>
```
