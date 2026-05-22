import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faLocationDot,
  faArrowRight,
  faChevronLeft,
  faCircleCheck,
  faWifi,
  faSwimmingPool,
  faDumbbell,
  faCar,
  faUtensils,
  faSnowflake,
  faUser,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { HOTELS } from '../../travel.data';

export function generateStaticParams() {
  return HOTELS.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hotel = HOTELS.find((h) => h.slug === slug);
  return { title: buildPageTitle(hotel?.name ?? slug, THEME_TITLES['travel']) };
}

const AMENITY_ICONS: Record<string, typeof faWifi> = {
  'Free Wi-Fi':        faWifi,
  'Pool':              faSwimmingPool,
  'Indoor Pool':       faSwimmingPool,
  'Rooftop Pool':      faSwimmingPool,
  'Gym':               faDumbbell,
  'Restaurant':        faUtensils,
  'Parking':           faCar,
  'Air Conditioning':  faSnowflake,
};

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${stars} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < stars;
        return (
          <FontAwesomeIcon
            key={i}
            icon={filled ? faStar : faStarEmpty}
            className={`w-4 h-4 ${filled ? 'text-warning' : 'text-text-disabled'}`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

const ROOM_TYPES = [
  { name: 'Standard Room',  beds: '1 King',            maxGuests: 2, price: 1.0  },
  { name: 'Deluxe Room',    beds: '1 King + Sofa',      maxGuests: 3, price: 1.35 },
  { name: 'Junior Suite',   beds: '1 King + Lounge',    maxGuests: 2, price: 1.8  },
  { name: 'Executive Suite',beds: '2 Kings + Lounge',   maxGuests: 4, price: 2.5  },
];

export default async function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hotel = HOTELS.find((h) => h.slug === slug);
  if (!hotel) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      {/* Back */}
      <a
        href="/theme/travel/hotels"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" aria-hidden="true" />
        Back to hotels
      </a>

      {/* Hero image */}
      <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 mb-8 bg-surface-sunken">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <StarRating stars={hotel.stars} />
          <h1 className="text-2xl font-bold text-white mt-1">{hotel.name}</h1>
          <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
            <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3" aria-hidden="true" />
            {hotel.city}, {hotel.country}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Rating overview */}
          <div className="bg-surface-raised border border-border rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-bold text-text-primary">{hotel.rating.toFixed(1)}</span>
                <span className="text-xs text-text-secondary mt-0.5">Overall</span>
              </div>
              <div>
                <StarRating stars={Math.round(hotel.rating)} />
                <p className="text-sm text-text-secondary mt-1">
                  Based on {hotel.reviewCount.toLocaleString()} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-surface-raised border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-text-primary mb-3">About</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{hotel.description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-surface-raised border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-text-primary mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {hotel.amenities.map((amenity) => {
                const icon = AMENITY_ICONS[amenity] ?? faCircleCheck;
                return (
                  <div key={amenity} className="flex items-center gap-2 text-sm text-text-primary">
                    <FontAwesomeIcon icon={icon} className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                    {amenity}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Room selection */}
          <div className="bg-surface-raised border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-text-primary mb-4">Select Room</h2>
            <div className="space-y-3">
              {ROOM_TYPES.map((room, i) => (
                <div
                  key={room.name}
                  className={`rounded-lg border p-4 flex items-center justify-between gap-4 transition-all ${
                    i === 0 ? 'border-primary bg-primary-subtle' : 'border-border bg-surface-base hover:border-border-strong'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{room.name}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {room.beds} · Up to {room.maxGuests} guests
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-text-primary">
                      {hotel.currency} {Math.round(hotel.pricePerNight * room.price).toLocaleString()}
                    </p>
                    <p className="text-xs text-text-secondary">/ night</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-surface-raised border border-border rounded-xl p-5 space-y-4">
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {hotel.currency} {hotel.pricePerNight.toLocaleString()}
              </p>
              <p className="text-xs text-text-secondary">per night</p>
            </div>

            {/* Date inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 mr-1" aria-hidden="true" />
                  Check-in
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
                  aria-label="Check-in date"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 mr-1" aria-hidden="true" />
                  Check-out
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
                  aria-label="Check-out date"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  <FontAwesomeIcon icon={faUser} className="w-3 h-3 mr-1" aria-hidden="true" />
                  Guests
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
                  aria-label="Number of guests"
                >
                  <option>1 adult</option>
                  <option>2 adults</option>
                  <option>2 adults, 1 child</option>
                  <option>2 adults, 2 children</option>
                </select>
              </div>
            </div>

            {/* Price summary */}
            <div className="space-y-2 text-sm border-t border-border pt-3">
              <div className="flex justify-between text-text-secondary">
                <span>{hotel.currency} {hotel.pricePerNight} × 3 nights</span>
                <span>{hotel.currency} {(hotel.pricePerNight * 3).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Taxes &amp; fees</span>
                <span>{hotel.currency} {Math.round(hotel.pricePerNight * 3 * 0.15).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-text-primary border-t border-border pt-2">
                <span>Total</span>
                <span>{hotel.currency} {Math.round(hotel.pricePerNight * 3 * 1.15).toLocaleString()}</span>
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              iconRight={<FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              Reserve Now
            </Button>

            <p className="text-xs text-text-secondary text-center">
              Free cancellation · No prepayment needed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
