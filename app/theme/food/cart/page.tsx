import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { Card } from '@/modules/ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faTrash, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export const metadata: Metadata = {
  title: buildPageTitle('Cart', THEME_TITLES['food']),
};

const CART_ITEMS = [
  { id: 'ci-01', name: 'Margherita Pizza',    quantity: 1, unitPrice: 14.5,  restaurantName: 'Bella Napoli' },
  { id: 'ci-02', name: 'Tagliatelle al Ragù', quantity: 1, unitPrice: 16.0,  restaurantName: 'Bella Napoli' },
];

const DELIVERY_FEE = 2.99;
const subtotal = CART_ITEMS.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
const total = subtotal + DELIVERY_FEE;

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function CartPage() {
  return (
    <div className="bg-surface-base text-text-primary">
      {/* Sub-header */}
      <div className="border-b border-border bg-surface-raised">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/theme/food' },
              { label: 'Cart' },
            ]}
          />
          <div className="mt-3 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Your Cart</h1>
            <span className="text-sm text-text-secondary">({CART_ITEMS.length} items)</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {CART_ITEMS.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Items list */}
            <div className="flex-1 min-w-0 space-y-3">
              <p className="text-xs text-text-secondary font-medium uppercase tracking-widest mb-2">
                From {CART_ITEMS[0].restaurantName}
              </p>
              {CART_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface-raised"
                >
                  {/* Image placeholder */}
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-surface-overlay to-surface-sunken shrink-0" aria-hidden="true" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{item.name}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{formatPrice(item.unitPrice)} each</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus text-lg leading-none"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-medium text-text-primary">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus text-lg leading-none"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-bold text-text-primary shrink-0 w-16 text-right">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>

                  <button
                    type="button"
                    aria-label={`Remove ${item.name} from cart`}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary hover:text-error hover:bg-error-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus shrink-0"
                  >
                    <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <aside className="w-full lg:w-72 shrink-0">
              <Card variant="raised" title="Order Summary">
                <div className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-text-secondary">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Delivery fee</span>
                      <span>{formatPrice(DELIVERY_FEE)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-text-primary border-t border-border pt-2 mt-1">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  <a
                    href="/theme/food"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-fg hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                  >
                    Proceed to Checkout
                    <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </Card>
            </aside>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
            <FontAwesomeIcon icon={faCartShopping} className="w-14 h-14 text-text-disabled" aria-hidden="true" />
            <div>
              <p className="font-semibold text-text-primary text-lg">Your cart is empty</p>
              <p className="text-sm text-text-secondary mt-1">Add some delicious items to get started.</p>
            </div>
            <a
              href="/theme/food/restaurants"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-fg text-sm font-semibold hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              Browse Restaurants
              <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
