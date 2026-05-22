import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Button } from '@/modules/ui/Button';
import { CartItem } from '@/modules/domains/commerce/cart/CartItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faArrowRight, faLock } from '@fortawesome/free-solid-svg-icons';
import { CART_ITEMS } from '../commerce.data';

export const metadata: Metadata = {
  title: buildPageTitle('Cart', THEME_TITLES['commerce']),
};

function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
}

export default function CartPage() {
  const currency = 'USD';
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-2xl font-bold text-text-primary mb-8">Shopping Cart</h1>

      {CART_ITEMS.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FontAwesomeIcon icon={faShoppingCart} className="w-16 h-16 text-text-disabled mb-4" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">Your cart is empty</h2>
          <p className="text-sm text-text-secondary mb-6">Add some products to get started.</p>
          <Button as="a" href="/theme/commerce/products" variant="primary">
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart items */}
          <div className="flex-1 space-y-3">
            {CART_ITEMS.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}

            <div className="pt-4">
              <a
                href="/theme/commerce/products"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                Continue Shopping
              </a>
            </div>
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="rounded-xl border border-border bg-surface-raised p-6 space-y-4 sticky top-24">
              <h2 className="text-lg font-semibold text-text-primary">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal ({CART_ITEMS.reduce((n, i) => n + i.quantity, 0)} items)</span>
                  <span className="text-text-primary font-medium">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span className="text-text-primary font-medium">
                    {shipping === 0 ? 'Free' : formatPrice(shipping, currency)}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-success">You qualify for free shipping!</p>
                )}
              </div>

              <div className="border-t border-border pt-4 flex justify-between text-base font-bold text-text-primary">
                <span>Total</span>
                <span>{formatPrice(total, currency)}</span>
              </div>

              <Button
                as="a"
                href="/theme/commerce"
                variant="primary"
                fullWidth
                size="lg"
                iconLeft={<FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5" />}
                iconRight={<FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />}
              >
                Checkout
              </Button>

              <p className="text-xs text-text-secondary text-center">
                Secure checkout powered by ShopFlow Payments
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
