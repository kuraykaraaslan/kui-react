# MapView

- **id:** `map-view`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/MapView.tsx`
- **status:** beta
- **since:** 2025-04

Leaflet-based interactive map. Tooltip-enabled markers, predefined zones (polygon), route lines (polyline), and click-to-add marker mode.

## Variants

### Tam özellik — işaretçi + zone + rota

```tsx
<MapView
  center={[41.015, 28.979]}
  zoom={6}
  markers={CITIES}
  zones={ZONES}
  routes={ROUTES}
  onMarkerClick={(id) => console.log(id)}
  height={420}
/>
```

### Tıkla-ekle işaretçi modu

```tsx
<MapView
  center={[39.5, 35.0]}
  zoom={5}
  markers={markers}
  onMarkerAdd={(pos) => setMarkers(prev => [
    ...prev,
    { id: String(Date.now()), position: pos, variant: 'warning' },
  ])}
  height={380}
/>
```

### Yalnız zone ve rota

```tsx
<MapView
  center={[39.5, 35.0]}
  zoom={5}
  zones={ZONES}
  routes={ROUTES}
  height={380}
/>
```

## Full source

```tsx
'use client';
import { MapView } from '@/modules/ui/MapView';

<MapView
  center={[39.9, 32.8]}
  zoom={6}
  markers={[
    {
      id: 'ankara',
      position: [39.925, 32.836],
      variant: 'primary',
      tooltip: {
        title: 'Ankara',
        description: 'Türkiye başkenti',
        fields: [{ label: 'Nüfus', value: '5.6 M' }],
      },
    },
  ]}
  zones={[
    {
      id: 'zone-1',
      label: 'İç Anadolu',
      variant: 'success',
      positions: [[40,30],[40,34],[38,34],[38,30]],
    },
  ]}
  routes={[
    {
      id: 'r1',
      label: 'Ankara → İstanbul',
      positions: [[39.9,32.8],[41.0,28.9]],
      color: '#3b82f6',
      weight: 3,
    },
  ]}
  onMarkerAdd={(pos) => console.log(pos)}
  onMarkerClick={(id) => console.log(id)}
  height={480}
/>
```
