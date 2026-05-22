import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { EventCard } from '@/modules/domains/event/EventCard';
import { ArtistCard } from '@/modules/domains/event/ArtistCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faTicket, faCalendarDays, faBuilding } from '@fortawesome/free-solid-svg-icons';
import {
  VENUES,
  getVenueBySlug,
  getEventsByVenueId,
  getArtistsByEventId,
} from '@/app/theme/event/event.data';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return VENUES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  return { title: buildPageTitle(venue?.name ?? slug, THEME_TITLES.event) };
}

export default async function VenueDetailPage({ params }: Props) {
  const { slug } = await params;
  const venue = getVenueBySlug(slug);
  if (!venue) notFound();

  const events = getEventsByVenueId(venue.venueId);

  /* artists appearing at this venue */
  const artistMap = new Map<string, ReturnType<typeof getArtistsByEventId>[number]>();
  events.forEach((e) => {
    getArtistsByEventId(e.eventId).forEach((a) => artistMap.set(a.artistId, a));
  });
  const artists = [...artistMap.values()];

  return (
    <div className="bg-surface-base">

      {/* banner */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        {venue.image ? (
          <img src={venue.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-base via-black/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-8 relative z-10 pb-16 space-y-10">

        {/* breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Ana Sayfa', href: '/theme/event' },
            { label: 'Mekanlar', href: '/theme/event/venues' },
            { label: venue.name },
          ]}
        />

        {/* identity block */}
        <div className="flex items-end gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-raised border border-border shadow-xl shrink-0">
            <FontAwesomeIcon icon={faBuilding} className="w-8 h-8 text-text-disabled" aria-hidden="true" />
          </div>
          <div className="pb-1">
            <h1 className="text-2xl font-black text-text-primary">{venue.name}</h1>
            <p className="text-sm text-text-secondary mt-0.5 flex items-center gap-1.5"><FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 shrink-0" aria-hidden="true" /> {venue.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* left: events + artists */}
          <div className="lg:col-span-2 space-y-8">

            {/* events */}
            <div>
              <h2 className="text-base font-bold text-text-primary mb-4">
                Etkinlikler
                <span className="ml-2 text-xs font-normal text-text-secondary">({events.length})</span>
              </h2>
              {events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {events.map((event) => (
                    <EventCard key={event.eventId} event={event} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-surface-raised p-8 text-center">
                  <FontAwesomeIcon icon={faCalendarDays} className="w-6 h-6 text-text-disabled mb-2" aria-hidden="true" />
                  <p className="text-sm text-text-secondary">Yaklaşan etkinlik bulunmuyor.</p>
                </div>
              )}
            </div>

            {/* artists at this venue */}
            {artists.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-text-primary mb-4">
                  Sanatçılar
                  <span className="ml-2 text-xs font-normal text-text-secondary">({artists.length})</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {artists.map((artist) => (
                    <ArtistCard key={artist.artistId} artist={artist} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* right: info sidebar */}
          <div className="space-y-4">

            {/* map placeholder */}
            <div className="rounded-2xl border border-border bg-surface-raised overflow-hidden">
              <div
                className="h-36 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#e0f2fe,#ddd6fe)' }}
                aria-hidden="true"
              >
                <FontAwesomeIcon icon={faLocationDot} className="w-8 h-8 text-primary/50" aria-hidden="true" />
              </div>
              <div className="p-4 space-y-1">
                <p className="text-xs font-semibold text-text-primary">{venue.name}</p>
                <p className="text-xs text-text-secondary">{venue.address}</p>
                {venue.latitude && venue.longitude && (
                  <p className="text-[10px] text-text-disabled font-mono">
                    {venue.latitude.toFixed(4)}, {venue.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            </div>

            {/* quick facts */}
            <div className="rounded-2xl border border-border bg-surface-raised p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Bilgiler</p>
              <div className="flex items-start gap-2 text-sm">
                <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-text-secondary">Şehir</p>
                  <p className="font-medium text-text-primary">{venue.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <FontAwesomeIcon icon={faTicket} className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-text-secondary">Etkinlik Sayısı</p>
                  <p className="font-medium text-text-primary">{events.length}</p>
                </div>
              </div>
              {venue.description && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-text-secondary leading-relaxed">{venue.description}</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
