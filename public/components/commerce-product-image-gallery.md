# ProductImageGallery

- **id:** `commerce-product-image-gallery`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/commerce/product/ProductImageGallery.tsx`
- **status:** stable
- **since:** 2026-05

Product image viewer: large main image with a thumbnail strip below. Hovering a thumbnail instantly swaps the main image via crossfade. When the image count exceeds thumbsVisible (default 5), the strip grows left/right arrows and becomes a slider.

## Variants

### 4 görsel — thumbnail strip

```tsx
<ProductImageGallery
  images={[
    { src: '/front.jpg',   alt: 'Front view' },
    { src: '/side.jpg',    alt: 'Side view' },
    { src: '/on-desk.jpg', alt: 'On desk' },
    { src: '/profile.jpg', alt: 'Profile' },
  ]}
  thumbsVisible={5}
/>
```

### 8 görsel — slider aktif

```tsx
// 8 images, thumbsVisible=5 → arrows appear automatically
<ProductImageGallery
  images={productImages}
  thumbsVisible={5}
/>
```

### Video aspect ratio

```tsx
<ProductImageGallery
  images={productImages}
  aspect="video"
  thumbsVisible={5}
/>
```

## Full source

```tsx
import { ProductImageGallery } from '@/modules/domains/commerce/product/ProductImageGallery';

<ProductImageGallery
  images={[
    { src: '/product-front.jpg',  alt: 'Product front view' },
    { src: '/product-back.jpg',   alt: 'Product back view' },
    { src: '/product-detail.jpg', alt: 'Product detail' },
  ]}
  thumbsVisible={5}
/>
```
