import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { VENUES, EVENT_VENUE, EVENTS } from '@/app/theme/event/event.data';
import { VenueCard } from '@/modules/domains/event/VenueCard';

export const metadata: Metadata = {
  title: buildPageTitle('Venues', THEME_TITLES.event),
};

export default function VenuesPage() {
  return (
    <div className="bg-surface-base min-h-screen">

      {/* hero */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Keşfet</p>
          <h1 className="text-3xl font-black text-text-primary">Mekanlar</h1>
          <p className="text-text-secondary mt-2 text-sm">
            Türkiye&apos;nin en iyi etkinlik mekanları ve yaklaşan programları.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VENUES.map((venue) => {
            const eventCount = EVENTS.filter(
              (e) => EVENT_VENUE[e.eventId] === venue.venueId,
            ).length;
            return (
              <VenueCard
                key={venue.venueId}
                venue={venue}
                eventCount={eventCount}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
}
