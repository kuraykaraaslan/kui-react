import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { BrandLogo } from '@/modules/ui/BrandLogo';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { EventCard } from '@/modules/domains/event/EventCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTicket, faGlobe, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {
  ORGANIZERS,
  getOrganizerBySlug,
  getEventsByOrganizerId,
} from '@/app/theme/event/event.data';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return ORGANIZERS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const organizer = getOrganizerBySlug(slug);
  return { title: buildPageTitle(organizer?.name ?? slug, THEME_TITLES.event) };
}

export default async function OrganizerDetailPage({ params }: Props) {
  const { slug } = await params;
  const organizer = getOrganizerBySlug(slug);
  if (!organizer) notFound();

  const events = getEventsByOrganizerId(organizer.organizerId);

  return (
    <div className="bg-surface-base min-h-screen">

      {/* hero */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb
            items={[
              { label: 'Ana Sayfa', href: '/theme/event' },
              { label: organizer.name },
            ]}
            className="mb-6"
          />
          <div className="flex items-center gap-5">
            {organizer.logo ? (
              <img
                src={organizer.logo}
                alt={organizer.name}
                className="h-20 w-20 rounded-2xl object-cover border border-border shadow-lg shrink-0"
              />
            ) : (
              <BrandLogo size="xl" className="font-black shadow-lg shrink-0">
                {organizer.name[0]}
              </BrandLogo>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-text-primary">{organizer.name}</h1>
                {organizer.verified && (
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-fg shrink-0"
                    title="Doğrulanmış organizatör"
                  >
                    <FontAwesomeIcon icon={faCheck} className="w-3 h-3" aria-hidden="true" />
                  </span>
                )}
              </div>
              {organizer.description && (
                <p className="text-text-secondary text-sm mt-1 max-w-lg">{organizer.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-text-secondary">
                {organizer.website && (
                  <a
                    href={organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <FontAwesomeIcon icon={faGlobe} className="w-3.5 h-3.5" aria-hidden="true" /> Web sitesi
                  </a>
                )}
                {organizer.email && (
                  <a
                    href={`mailto:${organizer.email}`}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="w-3.5 h-3.5" aria-hidden="true" /> {organizer.email}
                  </a>
                )}
                {organizer.phone && (
                  <a
                    href={`tel:${organizer.phone}`}
                    className="flex items-center gap-1 hover:text-primary transition-colors"
                  >
                    📞 {organizer.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* events */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h2 className="text-lg font-bold text-text-primary mb-6">
          Etkinlikler
          <span className="ml-2 text-sm font-normal text-text-secondary">({events.length})</span>
        </h2>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {events.map((event) => (
              <EventCard key={event.eventId} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface-raised p-12 text-center">
            <FontAwesomeIcon icon={faTicket} className="w-8 h-8 text-text-disabled mb-3" aria-hidden="true" />
            <p className="text-text-secondary text-sm">Henüz etkinlik bulunmuyor.</p>
          </div>
        )}
      </div>

    </div>
  );
}
