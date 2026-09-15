'use client';
import { Card } from '@/modules/ui/Card';
import type { EventWithData } from '@/modules/domains/event/types';

const FMT_DATE = new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const FMT_TIME = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' });

type Venue = { name: string; address: string };

type EventInfoGridProps = {
  event: Pick<EventWithData, 'startAt' | 'endAt' | 'format' | 'remainingCapacity' | 'totalCapacity'>;
  venue?: Venue | null;
};

export function EventInfoGrid({ event, venue }: EventInfoGridProps) {
  return (
    <Card variant="flat">
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Tarih & Saat</p>
          <p className="font-semibold text-text-primary">{FMT_DATE.format(event.startAt)}</p>
          <p className="text-text-secondary">
            {FMT_TIME.format(event.startAt)}
            {event.endAt && ` – ${FMT_TIME.format(event.endAt)}`}
          </p>
        </div>

        {venue && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Mekan</p>
            <p className="font-semibold text-text-primary">{venue.name}</p>
            <p className="text-text-secondary">{venue.address}</p>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Format</p>
          <p className="font-semibold text-text-primary">
            {event.format === 'PHYSICAL' ? 'Yüz Yüze' : event.format === 'ONLINE' ? 'Online' : 'Hibrit'}
          </p>
        </div>

        {event.remainingCapacity != null && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Kalan Kapasite</p>
            <p className="font-semibold text-text-primary">
              {event.remainingCapacity.toLocaleString('tr-TR')} koltuk
            </p>
            {event.totalCapacity && (
              <div className="w-full h-1.5 bg-surface-sunken rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.max(0, 100 - (event.remainingCapacity / event.totalCapacity) * 100)}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
