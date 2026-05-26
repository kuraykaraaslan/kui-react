# MapView — Split + Geliştirme Planı (EJS Pariteli)

> NextJS: [modules/ui/MapView.tsx](../modules/ui/MapView.tsx) (432 satır).  
> EJS:    [02_EJS_Components/modules/ui/MapView.ejs](../../02_EJS_Components/modules/ui/MapView.ejs) (246 satır).  
> Her iki tarafta paralel — [feedback_pixel_perfect_parity.md](../.claude/projects/-home-kuray-01-NextJS-Components/memory/feedback_pixel_perfect_parity.md), [feedback_ejs_nextjs_parity.md](../.claude/projects/-home-kuray-01-NextJS-Components/memory/feedback_ejs_nextjs_parity.md).

## Kuzey Yıldızı
Mapbox GL JS + Leaflet + Google Maps embed seviyesi: marker clustering, search, draw tools, popup, geolocation, route, fit-to-bounds, heatmap. Sıfır framework lock-in: provider arkasında `MapProvider` arayüzü.

---

## 1. Split (NextJS)
Hedef yapı:
```
modules/ui/MapView/
├── index.tsx                  ← named export MapView (≤120 satır)
├── types.ts                   ← MapMarker, MapBounds, MapProvider, MapOptions
├── providers/
│   ├── leaflet.ts             ← Leaflet adapter (varsayılan)
│   ├── mapbox.ts              ← Mapbox GL adapter (opsiyonel)
│   └── google.ts              ← Google Maps adapter (opsiyonel)
├── parts/
│   ├── Marker.tsx             ← tek marker DOM elementi
│   ├── Popup.tsx              ← marker tıklayınca açılan kart
│   ├── Cluster.tsx            ← supercluster render'ı
│   ├── SearchBar.tsx          ← geocoder bağlı arama
│   └── Controls.tsx           ← zoom in/out, locate, fit, layers toggle
└── hooks/
    ├── useMapInstance.ts      ← provider init + cleanup
    ├── useMarkers.ts          ← marker diff (add/remove/update)
    ├── useCluster.ts          ← supercluster + viewport binding
    ├── useGeolocate.ts        ← navigator.geolocation
    └── useDrawTools.ts        ← çizim modu (polygon/line/rect)
```

`index.tsx`: provider seçimi → `useMapInstance` → çocuklar (`Marker`, `Popup`, `Controls`) → event forward.

### EJS split paralel
```
modules/ui/MapView/
├── MapView.ejs                ← root markup + <% data %>
├── partials/
│   ├── _search.ejs
│   ├── _controls.ejs
│   └── _popup.ejs
└── scripts/
    ├── map-leaflet.js
    ├── markers.js
    ├── cluster.js
    ├── geolocate.js
    └── draw.js
```

---

## 2. Geliştirme milestone'ları (NextJS + EJS paralel)

### M1 — Provider abstraction + Leaflet baseline
| Özellik | Notlar |
|---|---|
| `provider: 'leaflet' \| 'mapbox' \| 'google'` prop | Tek API, üç implementation. |
| Token-based theming | Tile layer URL stilleri `var(--*)` ile uyumlu (dark mode otomatik). |
| Fit-to-bounds | Marker dizisinden otomatik. `fitBoundsPadding`. |
| Lazy loading | Map provider script'i sadece component görünür olunca yüklensin (IntersectionObserver). |

### M2 — Marker UX
| Özellik | Notlar |
|---|---|
| Custom marker icon | `marker.icon?: ReactNode \| string` (Font Awesome veya img). |
| Hover state | Popup auto-açılır (opsiyonel). |
| Cluster | `supercluster` (8 kB) lazy load. `cluster: boolean`. |
| Heatmap mode | Yoğunluk gradient'i — `mode: 'markers' \| 'cluster' \| 'heatmap'`. |
| Active marker | `activeMarkerId` prop ile dışarıdan yönetim. |

### M3 — Search + geocode + route
| Özellik | Notlar |
|---|---|
| Search bar | Nominatim (Leaflet) / Mapbox Geocoder. Async suggestions. |
| Reverse geocode | Tıklanan koordinatın adresi (popup'ta). |
| Routing | `route: { from, to, mode }` — OpenRouteService veya Mapbox Directions. |
| Step-by-step talimat | Sağ panel (opsiyonel). |

### M4 — Draw + measure + locate
| Özellik | Notlar |
|---|---|
| Draw tools | Polygon, line, rectangle, circle. `leaflet-draw` lazy. |
| Measure | Mesafe / alan rozeti — drawing sırasında live. |
| Locate me | `navigator.geolocation` → blue dot. |
| Layer toggle | Satellite / terrain / streets katmanları. |

### M5 — A11y + perf + i18n
| Özellik | Notlar |
|---|---|
| Klavye nav | Arrow → pan, +/- zoom, Tab → markers. |
| Screen reader | "Marker: Office, 3 of 12". |
| Reduced motion | Pan/zoom animasyon kapalı. |
| `messages` prop | i18n string'leri. |
| Perf | 10 000 marker @ cluster + viewport-only render. |

---

## Public API
```ts
type MapViewProps = {
  provider?: 'leaflet' | 'mapbox' | 'google';
  apiKey?: string;
  center: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  activeMarkerId?: string;
  bounds?: MapBounds;
  fitBoundsPadding?: number;
  cluster?: boolean | { radius?: number; maxZoom?: number };
  mode?: 'markers' | 'cluster' | 'heatmap';
  search?: boolean | { provider?: 'nominatim' | 'mapbox' };
  route?: { from: [number, number]; to: [number, number]; mode?: 'driving' | 'walking' | 'cycling' };
  drawTools?: ('polygon' | 'line' | 'rect' | 'circle')[];
  locate?: boolean;
  layerToggle?: boolean;
  reducedMotion?: boolean;
  messages?: Partial<MapViewMessages>;
  onMarkerClick?: (m: MapMarker) => void;
  onMapClick?: (lat: number, lng: number) => void;
  onBoundsChange?: (b: MapBounds) => void;
  onTelemetry?: (e: MapViewTelemetry) => void;
};
```

## Telemetri
`map-load`, `marker-click`, `cluster-expand`, `search`, `route-request`, `geolocate`, `draw-complete`, `layer-change`.

## DoD (her milestone)
- [ ] NextJS + EJS PR aynı sprintte merge.
- [ ] Showcase variant'ı yeni özelliği gösteriyor.
- [ ] `public/components/map-view.md` her iki repoda güncel.
- [ ] `npm run registry:snapshot` + build temiz.
- [ ] A11y + perf yeşil.
