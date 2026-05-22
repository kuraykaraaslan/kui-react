'use client';
import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { EventCard } from '@/modules/domains/event/EventCard';
import { ArtistCard } from '@/modules/domains/event/ArtistCard';
import { VenueCard } from '@/modules/domains/event/VenueCard';
import { EVENTS, ARTISTS, VENUES, EVENT_ARTISTS, EVENT_VENUE } from '@/app/theme/event/event.data';
import { Artist } from '@/modules/domains/event/types';

function normalize(s: string) {
  return s.toLocaleLowerCase('tr-TR');
}

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q')?.trim() ?? '';
  const qn = normalize(q);

  const results = useMemo(() => {
    if (!qn) return { events: [], artists: [], venues: [] };

    const events = EVENTS.filter((e) =>
      normalize(e.title).includes(qn) ||
      normalize(e.shortDescription ?? '').includes(qn) ||
      e.tags.some((t) => normalize(t).includes(qn)),
    );

    const artists = ARTISTS.filter((a) =>
      normalize(a.name).includes(qn) ||
      normalize(a.shortBio ?? '').includes(qn) ||
      a.genres.some((g) => normalize(g).includes(qn)),
    );

    const venues = VENUES.filter((v) =>
      normalize(v.name).includes(qn) ||
      normalize(v.city).includes(qn) ||
      normalize(v.address ?? '').includes(qn),
    );

    return { events, artists, venues };
  }, [qn]);

  const total = results.events.length + results.artists.length + results.venues.length;

  return (
    <div className="bg-surface-base min-h-screen">

      {/* header */}
      <div className="border-b border-border bg-surface-raised px-6 py-8">
        <div className="mx-auto max-w-7xl">
          {q ? (
            <>
              <p className="text-sm text-text-secondary mb-1">Arama sonuçları:</p>
              <h1 className="text-2xl font-black text-text-primary">
                &ldquo;{q}&rdquo;
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                {total > 0 ? `${total} sonuç bulundu` : 'Sonuç bulunamadı'}
              </p>
            </>
          ) : (
            <h1 className="text-2xl font-black text-text-primary">Arama</h1>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-10">

        {!q && (
          <div className="text-center py-16">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-12 h-12 text-text-disabled mb-4" aria-hidden="true" />
            <p className="text-text-secondary">Yukarıdaki arama kutusuna bir şeyler yazın.</p>
          </div>
        )}

        {q && total === 0 && (
          <div className="text-center py-16">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-12 h-12 text-text-disabled mb-4" aria-hidden="true" />
            <p className="text-text-primary font-semibold mb-1">Sonuç bulunamadı</p>
            <p className="text-text-secondary text-sm">&ldquo;{q}&rdquo; için eşleşme yok. Farklı anahtar kelimeler deneyin.</p>
          </div>
        )}

        {results.events.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-text-primary mb-4">
              Etkinlikler
              <span className="ml-2 text-sm font-normal text-text-secondary">({results.events.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {results.events.map((event) => (
                <EventCard key={event.eventId} event={event} />
              ))}
            </div>
          </section>
        )}

        {results.artists.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-text-primary mb-4">
              Sanatçılar
              <span className="ml-2 text-sm font-normal text-text-secondary">({results.artists.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {results.artists.map((artist: Artist) => {
                const count = EVENTS.filter((e) =>
                  (EVENT_ARTISTS[e.eventId] ?? []).includes(artist.artistId),
                ).length;
                return <ArtistCard key={artist.artistId} artist={artist} eventCount={count} />;
              })}
            </div>
          </section>
        )}

        {results.venues.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-text-primary mb-4">
              Mekanlar
              <span className="ml-2 text-sm font-normal text-text-secondary">({results.venues.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {results.venues.map((venue) => {
                const count = EVENTS.filter((e) => EVENT_VENUE[e.eventId] === venue.venueId).length;
                return <VenueCard key={venue.venueId} venue={venue} eventCount={count} />;
              })}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <DocumentTitle text={`Search — ${THEME_TITLES.event}`} />
      <Suspense>
        <SearchResults />
      </Suspense>
    </>
  );
}
