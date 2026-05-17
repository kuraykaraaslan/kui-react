import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CuisineHeroBanner } from '@/modules/domains/food/cuisine/CuisineHeroBanner';
import { CuisineTagChip } from '@/modules/domains/food/cuisine/CuisineTagChip';
import { FeaturedDishCard } from '@/modules/domains/food/menu/FeaturedDishCard';
import { RestaurantCard } from '@/modules/domains/food/restaurant/RestaurantCard';
import {
  CUISINES,
  RESTAURANTS,
  MENU_ITEMS,
  FEATURED_DISH_IMAGES,
} from '../../food.data';

export function generateStaticParams() {
  return CUISINES.map((c) => ({ slug: c.slug }));
}

export default async function CuisinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cuisine = CUISINES.find((c) => c.slug === slug);

  if (!cuisine) notFound();

  const restaurants = RESTAURANTS.filter((r) =>
    r.cuisineTypes.includes(cuisine.cuisineFilter),
  );
  const featuredDishes = cuisine.featuredDishIds
    .map((id) => MENU_ITEMS.find((m) => m.menuItemId === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const avgRating =
    restaurants.reduce((sum, r) => sum + r.rating, 0) / Math.max(1, restaurants.length);
  const avgDelivery =
    restaurants.reduce((sum, r) => sum + (r.deliveryTimeMin + r.deliveryTimeMax) / 2, 0) /
    Math.max(1, restaurants.length);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <a
        href="/theme/food"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        All cuisines
      </a>

      <CuisineHeroBanner
        cuisine={cuisine.name}
        description={cuisine.description}
        icon={cuisine.icon}
        imageUrl={cuisine.imageUrl}
        restaurantCount={restaurants.length}
        averageRating={Math.round(avgRating * 10) / 10}
        averageDeliveryMin={Math.round(avgDelivery)}
      />

      {/* Cuisine filter chips */}
      <nav aria-label="Other cuisines" className="mt-6 flex flex-wrap gap-2">
        {CUISINES.map((c) => (
          <CuisineTagChip
            key={c.slug}
            label={c.name}
            selected={c.slug === cuisine.slug}
            href={`/theme/food/cuisines/${c.slug}`}
          />
        ))}
      </nav>

      {/* Featured dishes */}
      {featuredDishes.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-text-primary">Featured dishes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDishes.map((dish, i) => {
              const restaurant = RESTAURANTS.find((r) => r.restaurantId === dish.restaurantId);
              return (
                <FeaturedDishCard
                  key={dish.menuItemId}
                  name={dish.name}
                  restaurantName={restaurant?.name ?? 'Unknown'}
                  imageUrl={FEATURED_DISH_IMAGES[dish.menuItemId]}
                  price={dish.price}
                  currency={dish.currency}
                  rating={restaurant?.rating}
                  reviewCount={restaurant?.reviewCount}
                  prepTimeMin={restaurant?.deliveryTimeMin}
                  badge={i === 0 ? 'Chef pick' : undefined}
                  hot={i === 1}
                  href={`/theme/food/restaurants/${restaurant?.slug ?? ''}`}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Restaurants in this cuisine */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-text-primary">
          {restaurants.length} {cuisine.name.toLowerCase()} restaurant{restaurants.length === 1 ? '' : 's'}
        </h2>
        {restaurants.length === 0 ? (
          <p className="text-sm text-text-secondary italic">No restaurants yet for this cuisine.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard
                key={r.restaurantId}
                restaurant={r}
                href={`/theme/food/restaurants/${r.slug}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
