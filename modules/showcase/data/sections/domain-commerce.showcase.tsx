'use client';
import type { ShowcaseComponent } from '../showcase.types';
import { ProductStatusBadge } from '@/modules/domains/commerce/product/ProductStatusBadge';
import { ProductTypeBadge } from '@/modules/domains/commerce/product/ProductTypeBadge';
import { StockStatusBadge } from '@/modules/domains/commerce/product/StockStatusBadge';
import { OrderStatusBadge } from '@/modules/domains/commerce/order/OrderStatusBadge';
import { ProductCard } from '@/modules/domains/commerce/product/ProductCard';
import { OrderCard } from '@/modules/domains/commerce/order/OrderCard';
import { CartItem } from '@/modules/domains/commerce/cart/CartItem';
import { WishlistItemCard } from '@/modules/domains/commerce/wishlist/WishlistItemCard';
import { EmptyWishlistState } from '@/modules/domains/commerce/wishlist/EmptyWishlistState';
import { ProductImageGallery } from '@/modules/domains/commerce/product/ProductImageGallery';
import type { ProductStatus, ProductType, StockStatus, OrderStatus } from '@/modules/domains/commerce/types';

/* ─── demo data ─── */

const DEMO_PRODUCT_PHYSICAL = {
  productId: 'demo-p-01',
  title: 'MacBook Pro 14" M3',
  slug: 'macbook-pro-14-m3',
  basePrice: 1999,
  salePrice: undefined,
  currency: 'USD',
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
  type: 'PHYSICAL' as ProductType,
  stockStatus: 'IN_STOCK' as StockStatus,
  status: 'PUBLISHED' as ProductStatus,
  tags: ['Apple', 'Laptop', 'M3'],
};

const DEMO_PRODUCT_DIGITAL = {
  productId: 'demo-p-02',
  title: 'ShopFlow Pro — Annual Plan',
  slug: 'shopflow-pro-annual',
  basePrice: 299,
  salePrice: 199,
  currency: 'USD',
  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  type: 'DIGITAL' as ProductType,
  stockStatus: 'IN_STOCK' as StockStatus,
  status: 'PUBLISHED' as ProductStatus,
  tags: ['SaaS', 'Annual', 'Pro'],
};

const DEMO_ORDER = {
  orderId: 'demo-ord-01',
  orderNumber: 'SF-10042',
  status: 'DELIVERED' as OrderStatus,
  total: 1999,
  currency: 'USD',
  itemCount: 1,
  createdAt: new Date('2026-04-01'),
};

const DEMO_ORDER_PENDING = {
  orderId: 'demo-ord-02',
  orderNumber: 'SF-10067',
  status: 'PENDING' as OrderStatus,
  total: 329,
  currency: 'USD',
  itemCount: 3,
  createdAt: new Date('2026-05-06'),
};

const DEMO_CART_ITEM = {
  productId: 'demo-p-01',
  name: 'MacBook Pro 14" M3',
  quantity: 1,
  price: 1999,
  currency: 'USD',
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80',
};

const DEMO_CART_ITEM_MULTI = {
  productId: 'demo-p-03',
  name: 'Premium Cotton T-Shirt',
  quantity: 2,
  price: 35,
  currency: 'USD',
  image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80',
};

/* ─── builder ─── */

export function buildCommerceDomainData(): ShowcaseComponent[] {
  return [
    {
      id: 'commerce-product-status-badge',
      title: 'ProductStatusBadge',
      category: 'Domain',
      abbr: 'PS',
      description: 'Displays product lifecycle status with semantic colour coding.',
      filePath: 'modules/domains/commerce/product/ProductStatusBadge.tsx',
      sourceCode: `import { ProductStatusBadge } from '@/modules/domains/commerce/product/ProductStatusBadge';
<ProductStatusBadge status="PUBLISHED" />`,
      variants: [
        {
          title: 'All statuses',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'OUT_OF_STOCK'] as ProductStatus[]).map((s) => (
                <ProductStatusBadge key={s} status={s} />
              ))}
            </div>
          ),
          code: `{(['DRAFT', 'PUBLISHED', 'ARCHIVED', 'OUT_OF_STOCK'] as const).map((s) => (
  <ProductStatusBadge key={s} status={s} />
))}`,
        },
        {
          title: 'Sizes',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap items-center gap-2">
              <ProductStatusBadge status="PUBLISHED" size="sm" />
              <ProductStatusBadge status="PUBLISHED" size="md" />
            </div>
          ),
          code: `<ProductStatusBadge status="PUBLISHED" size="sm" />
<ProductStatusBadge status="PUBLISHED" size="md" />`,
        },
      ],
    },
    {
      id: 'commerce-product-type-badge',
      title: 'ProductTypeBadge',
      category: 'Domain',
      abbr: 'PT',
      description: 'Colour-coded badge for product type: Physical, Digital, or Service.',
      filePath: 'modules/domains/commerce/product/ProductTypeBadge.tsx',
      sourceCode: `import { ProductTypeBadge } from '@/modules/domains/commerce/product/ProductTypeBadge';
<ProductTypeBadge type="DIGITAL" />`,
      variants: [
        {
          title: 'All types',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['PHYSICAL', 'DIGITAL', 'SERVICE'] as ProductType[]).map((t) => (
                <ProductTypeBadge key={t} type={t} />
              ))}
            </div>
          ),
          code: `{(['PHYSICAL', 'DIGITAL', 'SERVICE'] as const).map((t) => (
  <ProductTypeBadge key={t} type={t} />
))}`,
        },
        {
          title: 'Small size',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['PHYSICAL', 'DIGITAL', 'SERVICE'] as ProductType[]).map((t) => (
                <ProductTypeBadge key={t} type={t} size="sm" />
              ))}
            </div>
          ),
          code: `{(['PHYSICAL', 'DIGITAL', 'SERVICE'] as const).map((t) => (
  <ProductTypeBadge key={t} type={t} size="sm" />
))}`,
        },
      ],
    },
    {
      id: 'commerce-stock-status-badge',
      title: 'StockStatusBadge',
      category: 'Domain',
      abbr: 'SS',
      description: 'Inventory status badge mapping stock levels to semantic colours.',
      filePath: 'modules/domains/commerce/product/StockStatusBadge.tsx',
      sourceCode: `import { StockStatusBadge } from '@/modules/domains/commerce/product/StockStatusBadge';
<StockStatusBadge status="IN_STOCK" />`,
      variants: [
        {
          title: 'All stock statuses',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER'] as StockStatus[]).map((s) => (
                <StockStatusBadge key={s} status={s} />
              ))}
            </div>
          ),
          code: `{(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER'] as const).map((s) => (
  <StockStatusBadge key={s} status={s} />
))}`,
        },
        {
          title: 'Small size',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER'] as StockStatus[]).map((s) => (
                <StockStatusBadge key={s} status={s} size="sm" />
              ))}
            </div>
          ),
          code: `{(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER'] as const).map((s) => (
  <StockStatusBadge key={s} status={s} size="sm" />
))}`,
        },
      ],
    },
    {
      id: 'commerce-order-status-badge',
      title: 'OrderStatusBadge',
      category: 'Domain',
      abbr: 'OS',
      description: 'Tracks an order through its full lifecycle from Pending to Delivered or Refunded.',
      filePath: 'modules/domains/commerce/order/OrderStatusBadge.tsx',
      sourceCode: `import { OrderStatusBadge } from '@/modules/domains/commerce/order/OrderStatusBadge';
<OrderStatusBadge status="SHIPPED" />`,
      variants: [
        {
          title: 'All statuses',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['PENDING', 'CONFIRMED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'] as OrderStatus[]).map((s) => (
                <OrderStatusBadge key={s} status={s} />
              ))}
            </div>
          ),
          code: `{(['PENDING', 'CONFIRMED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'] as const).map((s) => (
  <OrderStatusBadge key={s} status={s} />
))}`,
        },
        {
          title: 'Small size',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as OrderStatus[]).map((s) => (
                <OrderStatusBadge key={s} status={s} size="sm" />
              ))}
            </div>
          ),
          code: `{(['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((s) => (
  <OrderStatusBadge key={s} status={s} size="sm" />
))}`,
        },
      ],
    },
    {
      id: 'commerce-product-card',
      title: 'ProductCard',
      category: 'Domain',
      abbr: 'PC',
      description: 'Product card with image, price, type and stock badges, and tags.',
      filePath: 'modules/domains/commerce/product/ProductCard.tsx',
      sourceCode: `import { ProductCard } from '@/modules/domains/commerce/product/ProductCard';
<ProductCard product={product} href="/products/slug" />`,
      variants: [
        {
          title: 'Physical product with link',
          preview: (
            <div className="max-w-xs">
              <ProductCard product={DEMO_PRODUCT_PHYSICAL} href="#" />
            </div>
          ),
          code: `<ProductCard product={product} href="/products/slug" />`,
        },
        {
          title: 'Digital product with sale price',
          preview: (
            <div className="max-w-xs">
              <ProductCard product={DEMO_PRODUCT_DIGITAL} href="#" />
            </div>
          ),
          code: `<ProductCard product={{ ...product, salePrice: 199 }} href="/products/slug" />`,
        },
      ],
    },
    {
      id: 'commerce-order-card',
      title: 'OrderCard',
      category: 'Domain',
      abbr: 'OC',
      description: 'Compact order row showing order number, status badge, item count, and total.',
      filePath: 'modules/domains/commerce/order/OrderCard.tsx',
      sourceCode: `import { OrderCard } from '@/modules/domains/commerce/order/OrderCard';
<OrderCard order={order} href="/orders/id" />`,
      variants: [
        {
          title: 'Delivered order with link',
          layout: 'stack',
          preview: (
            <div className="max-w-lg">
              <OrderCard order={DEMO_ORDER} href="#" />
            </div>
          ),
          code: `<OrderCard order={order} href="/orders/id" />`,
        },
        {
          title: 'Pending order (no link)',
          layout: 'stack',
          preview: (
            <div className="max-w-lg">
              <OrderCard order={DEMO_ORDER_PENDING} />
            </div>
          ),
          code: `<OrderCard order={order} />`,
        },
      ],
    },
    {
      id: 'commerce-cart-item',
      title: 'CartItem',
      category: 'Domain',
      abbr: 'CI',
      description: 'Cart line item row with product image, name, quantity, unit price, and remove action.',
      filePath: 'modules/domains/commerce/cart/CartItem.tsx',
      sourceCode: `import { CartItem } from '@/modules/domains/commerce/cart/CartItem';
<CartItem item={item} onRemove={() => removeItem(item.productId)} />`,
      variants: [
        {
          title: 'Single item with remove',
          layout: 'stack',
          preview: (
            <div className="max-w-lg">
              <CartItem item={DEMO_CART_ITEM} onRemove={() => {}} />
            </div>
          ),
          code: `<CartItem item={item} onRemove={() => removeItem(item.productId)} />`,
        },
        {
          title: 'Multi-quantity item',
          layout: 'stack',
          preview: (
            <div className="max-w-lg">
              <CartItem item={DEMO_CART_ITEM_MULTI} />
            </div>
          ),
          code: `<CartItem item={{ ...item, quantity: 2 }} />`,
        },
      ],
    },
    {
      id: 'commerce-wishlist-item-card',
      title: 'WishlistItemCard',
      category: 'Domain',
      abbr: 'WI',
      description: 'Wishlist row card: product image, current price, sale strikethrough, price-drop badge, move-to-cart and remove actions.',
      filePath: 'modules/domains/commerce/wishlist/WishlistItemCard.tsx',
      sourceCode: `import { WishlistItemCard } from '@/modules/domains/commerce/wishlist/WishlistItemCard';
<WishlistItemCard item={item} onMoveToCart={…} onRemove={…} />`,
      variants: [
        {
          title: 'On sale with price drop',
          layout: 'stack',
          preview: (
            <div className="max-w-2xl">
              <WishlistItemCard
                item={{
                  productId: 'demo-1',
                  title: 'Sony WH-1000XM5 Headphones',
                  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
                  basePrice: 399,
                  salePrice: 279,
                  currency: 'USD',
                  stockStatus: 'IN_STOCK',
                  addedAt: new Date('2026-04-12'),
                  priceWhenAdded: 349,
                }}
                onMoveToCart={() => {}}
                onRemove={() => {}}
              />
            </div>
          ),
          code: `<WishlistItemCard item={{ …, salePrice: 279, priceWhenAdded: 349 }} onMoveToCart={…} onRemove={…} />`,
        },
        {
          title: 'Out of stock',
          layout: 'stack',
          preview: (
            <div className="max-w-2xl">
              <WishlistItemCard
                item={{
                  productId: 'demo-2',
                  title: 'Limited Edition Sneakers',
                  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
                  basePrice: 220,
                  currency: 'USD',
                  stockStatus: 'OUT_OF_STOCK',
                  addedAt: new Date('2026-05-01'),
                }}
                onMoveToCart={() => {}}
                onRemove={() => {}}
              />
            </div>
          ),
          code: `<WishlistItemCard item={{ …, stockStatus: 'OUT_OF_STOCK' }} onMoveToCart={…} onRemove={…} />`,
        },
      ],
    },
    {
      id: 'commerce-empty-wishlist-state',
      title: 'EmptyWishlistState',
      category: 'Domain',
      abbr: 'EW',
      description: 'Empty state for an empty wishlist with an optional recommendations grid.',
      filePath: 'modules/domains/commerce/wishlist/EmptyWishlistState.tsx',
      sourceCode: `import { EmptyWishlistState } from '@/modules/domains/commerce/wishlist/EmptyWishlistState';
<EmptyWishlistState browseHref="/products" recommendations={[…]} />`,
      variants: [
        {
          title: 'With recommendations',
          layout: 'stack',
          preview: (
            <div className="max-w-2xl">
              <EmptyWishlistState
                browseHref="#"
                recommendations={[
                  { productId: 'r1', title: 'MacBook Pro', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80' },
                  { productId: 'r2', title: 'Sony Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
                  { productId: 'r3', title: 'Cotton T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80' },
                  { productId: 'r4', title: 'Coffee Beans', image: 'https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=300&q=80' },
                ]}
              />
            </div>
          ),
          code: `<EmptyWishlistState recommendations={[…]} />`,
        },
        {
          title: 'Minimal',
          layout: 'stack',
          preview: (
            <div className="max-w-2xl">
              <EmptyWishlistState browseHref="#" />
            </div>
          ),
          code: `<EmptyWishlistState browseHref="/products" />`,
        },
      ],
    },
    {
      id: 'commerce-product-image-gallery',
      title: 'ProductImageGallery',
      category: 'Domain',
      abbr: 'PG',
      description:
        'Product image viewer: large main image with a thumbnail strip below. Hovering a thumbnail instantly swaps the main image via crossfade. When the image count exceeds thumbsVisible (default 5), the strip grows left/right arrows and becomes a slider.',
      filePath: 'modules/domains/commerce/product/ProductImageGallery.tsx',
      sourceCode: `import { ProductImageGallery } from '@/modules/domains/commerce/product/ProductImageGallery';

<ProductImageGallery
  images={[
    { src: '/product-front.jpg',  alt: 'Product front view' },
    { src: '/product-back.jpg',   alt: 'Product back view' },
    { src: '/product-detail.jpg', alt: 'Product detail' },
  ]}
  thumbsVisible={5}
/>`,
      variants: [
        {
          title: '4 görsel — thumbnail strip',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-sm">
              <ProductImageGallery
                images={[
                  { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', alt: 'Sony WH-1000XM5 — front' },
                  { src: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80', alt: 'Sony WH-1000XM5 — side' },
                  { src: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=600&q=80', alt: 'Sony WH-1000XM5 — on desk' },
                  { src: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80', alt: 'Sony WH-1000XM5 — profile' },
                ]}
                thumbsVisible={5}
              />
            </div>
          ),
          code: `<ProductImageGallery
  images={[
    { src: '/front.jpg',   alt: 'Front view' },
    { src: '/side.jpg',    alt: 'Side view' },
    { src: '/on-desk.jpg', alt: 'On desk' },
    { src: '/profile.jpg', alt: 'Profile' },
  ]}
  thumbsVisible={5}
/>`,
        },
        {
          title: '8 görsel — slider aktif',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-sm">
              <ProductImageGallery
                images={[
                  { src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', alt: 'T-Shirt — white front' },
                  { src: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80', alt: 'T-Shirt — flat lay' },
                  { src: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80', alt: 'T-Shirt — worn' },
                  { src: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80', alt: 'T-Shirt — folded' },
                  { src: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=600&q=80', alt: 'T-Shirt — detail' },
                  { src: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80', alt: 'T-Shirt — color range' },
                  { src: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80', alt: 'T-Shirt — close up' },
                  { src: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=600&q=80', alt: 'T-Shirt — collection' },
                ]}
                thumbsVisible={5}
              />
            </div>
          ),
          code: `// 8 images, thumbsVisible=5 → arrows appear automatically
<ProductImageGallery
  images={productImages}
  thumbsVisible={5}
/>`,
        },
        {
          title: 'Video aspect ratio',
          layout: 'stack' as const,
          preview: (
            <div className="w-full max-w-md">
              <ProductImageGallery
                images={[
                  { src: 'https://images.unsplash.com/photo-1617331721458-bd3bd3f9c7f8?w=800&q=80', alt: 'Keyboard — overhead' },
                  { src: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80', alt: 'Keyboard — front' },
                  { src: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80', alt: 'Keyboard — RGB' },
                  { src: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80', alt: 'Keyboard — backlight' },
                ]}
                aspect="video"
                thumbsVisible={5}
              />
            </div>
          ),
          code: `<ProductImageGallery
  images={productImages}
  aspect="video"
  thumbsVisible={5}
/>`,
        },
      ],
    },
  ];
}
