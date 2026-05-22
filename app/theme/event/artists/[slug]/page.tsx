import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { BrandLogo } from '@/modules/ui/BrandLogo';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { EventCard } from '@/modules/domains/event/EventCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faLocationDot, faMicrophone, faTicket, faGlobe } from '@fortawesome/free-solid-svg-icons';
import {
  ARTISTS,
  getArtistBySlug,
  getEventsByArtistId,
} from '@/app/theme/event/event.data';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return ARTISTS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  return { title: buildPageTitle(artist?.name ?? slug, THEME_TITLES.event) };
}

export default async function ArtistDetailPage({ params }: Props) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  if (!artist) notFound();

  const events = getEventsByArtistId(artist.artistId);

  return (
    <div className="bg-surface-base">

      {/* cover */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        {artist.coverImage ? (
          <img src={artist.coverImage} alt="" className="h-full w-full object-cover" />
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
            { label: 'Sanatçılar', href: '/theme/event/artists' },
            { label: artist.name },
          ]}
        />

        {/* identity block */}
        <div className="flex items-end gap-5">
          {artist.image ? (
            <img
              src={artist.image}
              alt={artist.name}
              className="h-24 w-24 rounded-2xl object-cover border-4 border-surface-base shadow-xl shrink-0"
            />
          ) : (
            <BrandLogo size="2xl" className="font-black border-4 border-surface-base shadow-xl shrink-0">
              {artist.name[0]}
            </BrandLogo>
          )}
          <div className="pb-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-text-primary">{artist.name}</h1>
              {artist.verified && (
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-fg shrink-0"
                  title="Doğrulanmış sanatçı"
                >
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3" aria-hidden="true" />
                </span>
              )}
            </div>
            {artist.origin && (
              <p className="text-sm text-text-secondary mt-0.5 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3 shrink-0" aria-hidden="true" />
                {artist.origin}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* left: bio + genres */}
          <div className="lg:col-span-2 space-y-6">
            {artist.bio && (
              <div className="rounded-2xl border border-border bg-surface-raised p-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">Hakkında</h2>
                <p className="text-sm text-text-primary leading-relaxed">{artist.bio}</p>
              </div>
            )}

            {/* upcoming events */}
            {events.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-text-primary mb-4">
                  Yaklaşan Etkinlikler
                  <span className="ml-2 text-xs font-normal text-text-secondary">({events.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {events.map((event) => (
                    <EventCard key={event.eventId} event={event} />
                  ))}
                </div>
              </div>
            )}

            {events.length === 0 && (
              <div className="rounded-2xl border border-border bg-surface-raised p-8 text-center">
                <FontAwesomeIcon icon={faMicrophone} className="w-8 h-8 text-text-disabled mb-2" aria-hidden="true" />
                <p className="text-sm text-text-secondary">Yaklaşan etkinlik bulunmuyor.</p>
              </div>
            )}
          </div>

          {/* right: info sidebar */}
          <div className="space-y-4">

            {/* genres */}
            {artist.genres.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface-raised p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">Türler</p>
                <div className="flex flex-wrap gap-2">
                  {artist.genres.map((g) => (
                    <span
                      key={g}
                      className="inline-flex text-xs font-medium px-3 py-1 rounded-full bg-primary-subtle text-primary border border-primary/20"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* quick facts */}
            <div className="rounded-2xl border border-border bg-surface-raised p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Bilgiler</p>
              {artist.origin && (
                <div className="flex items-start gap-2 text-sm">
                  <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs text-text-secondary">Köken</p>
                    <p className="font-medium text-text-primary">{artist.origin}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2 text-sm">
                <FontAwesomeIcon icon={faTicket} className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs text-text-secondary">Etkinlik Sayısı</p>
                  <p className="font-medium text-text-primary">{events.length}</p>
                </div>
              </div>
              {artist.website && (
                <a
                  href={artist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
                >
                  <FontAwesomeIcon icon={faGlobe} className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Resmi Web Sitesi</span>
                </a>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
