# ImageGallery — Refactor Planı

## Hedef
`modules/app/ImageGallery.tsx` (405 satır) — grid render, lightbox, drag-to-reorder ve right-click context menu tek dosyada. Sub-component’lere ayır; public `<ImageGallery />` API’si aynı kalsın. EJS karşılığı [02_EJS_Components/modules/app/ImageGallery.ejs](../../02_EJS_Components/modules/app/ImageGallery.ejs) (477 satır) — pixel-perfect parite zorunlu, NextJS bölünmesinden sonra EJS tarafında da uygulanmalı.

## Mevcut iskelet (modules/app/ImageGallery.tsx)
| Bölge | Satır | İçerik |
|---|---|---|
| Types | 21–47 | `ImageGalleryImage`, `GalleryColumns`, `GalleryAspect`, `GalleryGap`, `ImageGalleryProps` |
| Constants | 49–68 | `columnClasses`, `gapClasses`, `aspectClasses` |
| Component | 72–405 | `useState`(images, activeIndex, zoomed, dragFrom, dragOver) + lightbox handlers + drag handlers + context menu + render (grid + lightbox + ContextMenu) |

## Hedef yapı
```
modules/app/ImageGallery/
├── index.tsx                ← named export ImageGallery (≤120 satır)
├── types.ts                 ← ImageGalleryImage + ImageGalleryProps + internal birimler
├── constants.ts             ← columnClasses, gapClasses, aspectClasses
├── parts/
│   ├── GalleryGrid.tsx      ← grid layout + draggable + onContextMenu (≈80 satır)
│   ├── GalleryItem.tsx      ← tek thumb (img + drop indicator + caption) — draggable HTML attr ve dnd event’leri burada
│   └── Lightbox.tsx         ← overlay + prev/next + zoom + thumbnail strip + keyboard handler
└── hooks/
    ├── useLightboxKeyboard.ts ← Escape / ← / → klavye haritası
    ├── useReorder.ts        ← dragFrom + dragOver + onDragStart/Over/Leave/Drop/End + onReorder callback
    └── useContextMenu.ts    ← context menu open state + item list builder (Open in lightbox, Copy URL, Move first/last, Remove)
```

## Adım adım
1. **Klasör.** `mv modules/app/ImageGallery.tsx modules/app/ImageGallery/index.tsx`. Tüketici `app/theme/**` ve showcase entry’lerinde import yolu değişmiyor.
2. **`types.ts` + `constants.ts`** — saf veri taşı.
3. **`hooks/useReorder.ts`.** Input: `{ images, onReorder }`. Çıktı: `{ dragFrom, dragOver, handlers: { onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd } }`. State setter parent’ta değil, hook’ta tutulur; reorder olunca `onReorder` çağrılır.
4. **`hooks/useContextMenu.ts`.** Input: `{ images, onRemove, onMoveToIndex, openLightbox, copyUrl }`. Çıktı: `{ menuState, openAt, close, buildItems(i): ContextMenuItem[] }`.
5. **`hooks/useLightboxKeyboard.ts`.** Input: `{ open, onClose, onPrev, onNext, onToggleZoom }`. `document.addEventListener('keydown', …)` cleanup ile.
6. **`parts/GalleryItem.tsx`.** Props: `{ image, index, columnClass, aspectClass, isDragOver, draggable, onClick, dragHandlers, onContextMenu }`.
7. **`parts/GalleryGrid.tsx`.** Sadece map + GalleryItem. `useReorder` + `useContextMenu` parent’ta tutulur, hook’ların ürettikleri prop olarak iner.
8. **`parts/Lightbox.tsx`.** Mevcut lightbox JSX’i (overlay, prev/next, zoom toggle, thumbnail strip). `useLightboxKeyboard` burada çağrılır.
9. **`index.tsx`.** `useState(images, activeIndex, zoomed)` + `useReorder` + `useContextMenu` + render = `<GalleryGrid /> + <Lightbox /> + <ContextMenu />`.
10. **Snapshot.** `npm run registry:snapshot` — `public/components/image-gallery.md` ve `components.json` regenere.
11. **Smoke test.** `/theme/social/` veya showcase ImageGallery variant’ında:
    - Grid render + columns/aspect/gap prop’ları
    - Lightbox: tıkla, ← / → ile gezin, ESC, çift tıkla zoom
    - Reorderable variant: drag-to-reorder + `onReorder` callback
    - Right-click context menu: Open in lightbox, Copy URL, Move first/last, Remove
12. **Tip kontrolü.** `npx tsc --noEmit`.

## Doğrulama kriterleri
- [ ] `index.tsx` ≤ 130 satır.
- [ ] Hiçbir parts/ veya hooks/ dosyası 150 satırı geçmesin.
- [ ] `ImageGallery` ve `ImageGalleryImage` named export’ları aynı path’ten erişilebilir (`@/modules/app/ImageGallery`).
- [ ] `npm run build` + registry snapshot temiz.

## EJS pariteli plan ([02_EJS_Components/modules/app/ImageGallery.ejs](../../02_EJS_Components/modules/app/ImageGallery.ejs), 477 satır)
NextJS bölünmesi tamamlandıktan sonra EJS tarafında da aynı sınırlarla böl:
```
modules/app/ImageGallery/
├── ImageGallery.ejs           ← root markup + <% data %> bloğu (≤80 satır)
├── partials/
│   ├── _grid.ejs              ← grid + her resim için item markup (draggable, contextmenu attr’ları)
│   └── _lightbox.ejs          ← overlay markup + thumbnail strip
└── scripts/
    ├── grid-renderer.js       ← renderGrid() (satır 123–197)
    ├── lightbox.js            ← lbOpen / lbClose / lbNav / lbZoom / lbUpdate / bindLbHandlers / keyboard (satır 199–298)
    ├── dnd.js                 ← dndStart / dndOver / dndLeave / dndDrop / dndEnd / markDrag (satır 301–326)
    └── context-menu.js        ← ensureGlobalCtx / openGalleryCtx / appendCtxItems / moveToIdx / removeAt (satır 328–469)
```
1. EJS root’ta `<% include('partials/_grid') %>` + `<% include('partials/_lightbox') %>` + tek `<script>` IIFE (script dosyalarını birleştir veya `public/assets/js/image-gallery/`’ye taşı).
2. Public API yüzeyi (`window.closeContextMenu(id)`, `window.openContextMenu()`) ve attribute kontratları (`draggable`, `contextmenu`) aynı kalsın — diğer EJS tüketicileri etkilenmesin.
3. `public/components/image-gallery.md` her iki repo için tek dokümanda — NextJS dosya yolları + EJS partial yolları yan yana.
4. Pixel-perfect parite ([feedback_pixel_perfect_parity.md](../../.claude/projects/-home-kuray-01-NextJS-Components/memory/feedback_pixel_perfect_parity.md)): aynı `var(--*)` token’ları, aynı ikon seti (Font Awesome solid: faXmark, faAnglesLeft/Right, faExpand, faCopy, faTrash, faMagnifyingGlassPlus/Minus, faChevronLeft/Right, faGripVertical), aynı klavye haritası (←, →, ESC, çift tık zoom), aynı menü davranışı.
5. EJS-NextJS parite kuralı: yeni özellik birinde eklenirse diğerinde de yapılıp yapılmayacağı kullanıcıya sorulmalı ([feedback_ejs_nextjs_parity.md](../../.claude/projects/-home-kuray-01-NextJS-Components/memory/feedback_ejs_nextjs_parity.md)).
