import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { ARTISTS, EVENT_ARTISTS, EVENTS } from '@/app/theme/event/event.data';
import { ArtistCard } from '@/modules/domains/event/ArtistCard';

export const metadata: Metadata = {
  title: buildPageTitle('Artists', THEME_TITLES.event),
};

export default function ArtistsPage() {
  return (
    <div className="bg-surface-base min-h-screen">

      {/* hero */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Keşfet</p>
          <h1 className="text-3xl font-black text-text-primary">Sanatçılar</h1>
          <p className="text-text-secondary mt-2 text-sm">
            Platformumuzdaki tüm sanatçılar ve yaklaşan etkinlikleri.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {ARTISTS.map((artist) => {
            const eventCount = EVENTS.filter((e) =>
              (EVENT_ARTISTS[e.eventId] ?? []).includes(artist.artistId),
            ).length;
            return (
              <ArtistCard
                key={artist.artistId}
                artist={artist}
                eventCount={eventCount}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
}
