# GeoPointDisplay

- **id:** `common-geo-point-display`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/location/GeoPointDisplay.tsx`
- **status:** beta
- **since:** 2025-04

Displays latitude/longitude coordinates with a Google Maps link. Configurable precision and optional label.

## Variants

### With label

```tsx
<GeoPointDisplay point={{ latitude: 41.0082, longitude: 28.9784 }} label="Istanbul" />
```

### Coordinates only

```tsx
<GeoPointDisplay point={{ latitude: 48.8566, longitude: 2.3522 }} showMapLink={false} />
```

## Full source

```tsx
<GeoPointDisplay point={{ latitude: 41.0082, longitude: 28.9784 }} label="Istanbul" />
```
