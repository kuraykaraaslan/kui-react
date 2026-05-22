import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { Badge } from '@/modules/ui/Badge';
import { Card } from '@/modules/ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faClock,
  faMotorcycle,
  faBoxOpen,
  faCartShopping,
} from '@fortawesome/free-solid-svg-icons';
import { RestaurantStatusBadge } from '@/modules/domains/food/restaurant/RestaurantStatusBadge';
import { MenuItemCard } from '@/modules/domains/food/menu/MenuItemCard';
import { RESTAURANTS, MENU_ITEMS } from '../../food.data';

export function generateStaticParams() {
  return RESTAURANTS.map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = RESTAURANTS.find((r) => r.slug === slug);
  return { title: buildPageTitle(restaurant?.name ?? slug, THEME_TITLES['food']) };
}

export default async function RestaurantDetailPage({ params }: Props) {
  const { slug } = await params;
  const restaurant = RESTAURANTS.find((r) => r.slug === slug) ?? RESTAURANTS[0];
  const menuItems = MENU_ITEMS.filter((m) => m.restaurantId === restaurant.restaurantId);

  const CART_ITEMS = [
    { name: 'Margherita Pizza', quantity: 1, price: 14.5 },
    { name: 'Tagliatelle al Ragù', quantity: 1, price: 16.0 },
  ];
  const subtotal = CART_ITEMS.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = restaurant.deliveryFee;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-surface-base text-text-primary">
      {/* Sub-header */}
      <div className="border-b border-border bg-surface-raised">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <Breadcrumb
            items={[
              { label: 'Home',        href: '/theme/food' },
              { label: 'Restaurants', href: '/theme/food/restaurants' },
              { label: restaurant.name },
            ]}
          />
        </div>
      </div>

      {/* Restaurant hero */}
      <div
        className="h-48 sm:h-64 bg-gradient-to-br from-primary to-secondary relative"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 -mt-10 relative z-10">
        <div className="bg-surface-base rounded-2xl border border-border shadow-md p-6 flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-text-primary">{restaurant.name}</h1>
              <RestaurantStatusBadge status={restaurant.status} size="sm" />
            </div>
            <div className="flex flex-wrap gap-1">
              {restaurant.cuisineTypes.map((c) => (
                <span
                  key={c}
                  className="inline-block rounded-full bg-surface-sunken px-2 py-0.5 text-xs text-text-secondary"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-lg">
              {restaurant.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faStar} className="w-3.5 h-3.5 text-warning" aria-hidden="true" />
                <span className="font-medium text-text-primary">{restaurant.rating.toFixed(1)}</span>
                <span>({restaurant.reviewCount} reviews)</span>
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" aria-hidden="true" />
                {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} min
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faMotorcycle} className="w-3.5 h-3.5" aria-hidden="true" />
                {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
              </span>
              <span className="flex items-center gap-1">
                <FontAwesomeIcon icon={faBoxOpen} className="w-3.5 h-3.5" aria-hidden="true" />
                Min. ${restaurant.minimumOrderAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Content: menu + cart */}
        <div className="flex gap-8 pb-16">
          {/* Menu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">
                Menu
                <Badge variant="neutral" size="sm" className="ml-2">{menuItems.length} items</Badge>
              </h2>
            </div>

            {menuItems.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {menuItems.map((item) => (
                  <MenuItemCard
                    key={item.menuItemId}
                    item={{
                      menuItemId: item.menuItemId,
                      name: item.name,
                      description: item.description,
                      price: item.price,
                      currency: item.currency,
                      imageUrl: item.imageUrl,
                      calories: item.calories,
                      isVegetarian: item.isVegetarian,
                      isVegan: item.isVegan,
                      status: item.status,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <FontAwesomeIcon icon={faBoxOpen} className="w-10 h-10 text-text-disabled" aria-hidden="true" />
                <p className="text-text-secondary text-sm">No menu items available for this restaurant.</p>
              </div>
            )}
          </div>

          {/* Cart summary sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <Card variant="raised" title="Your Cart" className="overflow-hidden">
                <div className="space-y-4">
                  {CART_ITEMS.length > 0 ? (
                    <>
                      <ul className="divide-y divide-border">
                        {CART_ITEMS.map((ci, idx) => (
                          <li key={idx} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                            <span className="text-text-primary flex-1 min-w-0 truncate">
                              <span className="text-text-secondary mr-1">×{ci.quantity}</span>
                              {ci.name}
                            </span>
                            <span className="text-text-primary font-medium shrink-0">
                              ${(ci.price * ci.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="space-y-1.5 text-sm border-t border-border pt-3">
                        <div className="flex justify-between text-text-secondary">
                          <span>Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-text-secondary">
                          <span>Delivery fee</span>
                          <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-text-primary border-t border-border pt-2 mt-2">
                          <span>Total</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>

                      <a
                        href="/theme/food/cart"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-fg hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      >
                        <FontAwesomeIcon icon={faCartShopping} className="w-4 h-4" aria-hidden="true" />
                        Go to Cart
                      </a>
                    </>
                  ) : (
                    <p className="text-sm text-text-secondary text-center py-4">
                      Your cart is empty. Add items from the menu!
                    </p>
                  )}
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
