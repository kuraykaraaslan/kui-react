'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPizzaSlice,
  faBowlFood,
  faFireBurner,
  faSeedling,
  faDrumstickBite,
  faLeaf,
  faPepperHot,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type CuisineIconKey =
  | 'pizza'
  | 'bowl'
  | 'grill'
  | 'seedling'
  | 'drumstick'
  | 'leaf'
  | 'pepper'
  | 'default';

type CuisineHeroBannerProps = {
  cuisine: string;
  description?: string;
  icon?: CuisineIconKey;
  restaurantCount?: number;
  averageRating?: number;
  averageDeliveryMin?: number;
  imageUrl?: string | null;
  className?: string;
};

const ICON_MAP: Record<CuisineIconKey, IconDefinition> = {
  pizza: faPizzaSlice,
  bowl: faBowlFood,
  grill: faFireBurner,
  seedling: faSeedling,
  drumstick: faDrumstickBite,
  leaf: faLeaf,
  pepper: faPepperHot,
  default: faUtensils,
};

export function CuisineHeroBanner({
  cuisine,
  description,
  icon = 'default',
  restaurantCount,
  averageRating,
  averageDeliveryMin,
  imageUrl,
  className,
}: CuisineHeroBannerProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border',
        className,
      )}
      aria-label={`${cuisine} cuisine`}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-secondary" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      <div className="relative flex flex-col gap-4 px-6 py-10 sm:px-10 sm:py-14 text-white">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={ICON_MAP[icon]} className="w-5 h-5" />
        </span>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {cuisine} food
          </h1>
          {description && (
            <p className="max-w-2xl text-sm sm:text-base text-white/85 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {(restaurantCount !== undefined || averageRating !== undefined || averageDeliveryMin !== undefined) && (
          <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
            {restaurantCount !== undefined && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-white/65">Restaurants</dt>
                <dd className="font-semibold tabular-nums">{restaurantCount}</dd>
              </div>
            )}
            {averageRating !== undefined && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-white/65">Avg rating</dt>
                <dd className="font-semibold tabular-nums">{averageRating.toFixed(1)}</dd>
              </div>
            )}
            {averageDeliveryMin !== undefined && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-white/65">Avg delivery</dt>
                <dd className="font-semibold tabular-nums">{averageDeliveryMin} min</dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </section>
  );
}
