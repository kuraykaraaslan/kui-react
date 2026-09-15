'use client';
import { Badge } from '@/modules/ui/Badge';
import { EventCategoryBadge } from '@/modules/domains/event/EventCategoryBadge';
import { EventStatusBadge } from '@/modules/domains/event/EventStatusBadge';
import type { EventWithData } from '@/modules/domains/event/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCalendarDays, faTicket, faFire } from '@fortawesome/free-solid-svg-icons';

const FMT_DATE = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
const FMT_TIME = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' });

type HeroSlideProps = { event: EventWithData };

export function HeroSlide({ event }: HeroSlideProps) {
  const img = event.bannerImage ?? event.image;
  const isSoldOut = event.status === 'SOLD_OUT';

  const priceLabel =
    event.minPrice === 0
      ? 'Ücretsiz'
      : event.maxPrice != null && event.maxPrice !== event.minPrice
        ? `₺${event.minPrice?.toLocaleString('tr-TR')} – ₺${event.maxPrice.toLocaleString('tr-TR')}`
        : `₺${event.minPrice?.toLocaleString('tr-TR')} den`;

  return (
    <div className="relative flex items-end min-h-[520px] sm:min-h-[600px]">
      {img && (
        <img
          src={img}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      )}

      <div className="absolute inset-0" style={{
        background: [
          'linear-gradient(to right, rgba(10,18,32,0.92) 0%, rgba(10,18,32,0.55) 55%, rgba(10,18,32,0.15) 100%)',
          'linear-gradient(to top,   rgba(10,18,32,0.95) 0%, rgba(10,18,32,0.0)  45%)',
        ].join(', '),
      }} />

      <div className="relative w-full mx-auto max-w-7xl px-6 sm:px-8 pb-14 sm:pb-16 pt-12">
        <div className="max-w-xl space-y-4">

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="primary" size="sm">Öne Çıkan</Badge>
            <EventCategoryBadge category={event.category} size="sm" />
            {event.status !== 'PUBLISHED' && <EventStatusBadge status={event.status} size="sm" />}
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight drop-shadow-sm">
            {event.title}
          </h2>

          {event.shortDescription && (
            <p className="text-white/75 text-sm sm:text-base leading-relaxed line-clamp-2">
              {event.shortDescription}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/65">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendarDays} className="w-3.5 h-3.5" aria-hidden="true" /> {FMT_DATE.format(event.startAt)} · {FMT_TIME.format(event.startAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faLocationDot} className="w-3.5 h-3.5" aria-hidden="true" /> İstanbul
            </span>
            <span className="flex items-center gap-1.5 font-bold text-white">
              <FontAwesomeIcon icon={faTicket} className="w-3.5 h-3.5" aria-hidden="true" /> {priceLabel}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={`/theme/event/events/${event.slug}/checkout`}
              className="inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                boxShadow: '0 4px 18px rgba(59,130,246,0.45)',
              }}
            >
              Bilet Al
            </a>
            <a
              href={`/theme/event/events/${event.slug}`}
              className="inline-flex items-center justify-center rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              Detaylar
            </a>
          </div>

          {event.remainingCapacity != null && event.remainingCapacity < 5000 && !isSoldOut && (
            <p className="text-xs font-medium flex items-center gap-1" style={{ color: '#fbbf24' }}>
              <FontAwesomeIcon icon={faFire} className="w-3 h-3" aria-hidden="true" /> Son {event.remainingCapacity.toLocaleString('tr-TR')} bilet!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
