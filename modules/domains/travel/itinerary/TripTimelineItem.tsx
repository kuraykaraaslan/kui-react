'use client';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlane,
  faHotel,
  faUtensils,
  faCameraRetro,
  faMapPin,
  faMugSaucer,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type TimelineItemKind = 'flight' | 'hotel' | 'meal' | 'activity' | 'transfer' | 'coffee';

type TripTimelineItemProps = {
  kind: TimelineItemKind;
  title: string;
  location?: string;
  time: string;
  durationLabel?: string;
  note?: string;
  bookingRef?: string;
  className?: string;
};

const META: Record<TimelineItemKind, { icon: IconDefinition; tone: string; label: string }> = {
  flight:   { icon: faPlane,       tone: 'bg-info-subtle text-info',         label: 'Flight' },
  hotel:    { icon: faHotel,       tone: 'bg-primary-subtle text-primary',   label: 'Hotel' },
  meal:     { icon: faUtensils,    tone: 'bg-warning-subtle text-warning',   label: 'Meal' },
  activity: { icon: faCameraRetro, tone: 'bg-secondary/15 text-secondary',   label: 'Activity' },
  transfer: { icon: faMapPin,      tone: 'bg-surface-overlay text-text-secondary', label: 'Transfer' },
  coffee:   { icon: faMugSaucer,   tone: 'bg-success-subtle text-success',   label: 'Coffee' },
};

export function TripTimelineItem({
  kind,
  title,
  location,
  time,
  durationLabel,
  note,
  bookingRef,
  className,
}: TripTimelineItemProps) {
  const meta = META[kind];
  return (
    <li className={cn('relative flex gap-3 pb-5 last:pb-0', className)}>
      <span
        aria-hidden="true"
        className="absolute left-[15px] top-9 bottom-0 w-px bg-border last:hidden"
      />
      <span
        className={cn(
          'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-surface-base',
          meta.tone,
        )}
        aria-hidden="true"
      >
        <FontAwesomeIcon icon={meta.icon} className="w-3.5 h-3.5" />
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
            <Badge variant="neutral" size="sm">{meta.label}</Badge>
          </div>
          <time className="shrink-0 text-xs text-text-secondary tabular-nums inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="w-2.5 h-2.5" aria-hidden="true" />
            {time}
            {durationLabel && <span className="text-text-disabled">· {durationLabel}</span>}
          </time>
        </div>
        {location && (
          <p className="mt-0.5 text-xs text-text-secondary inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faMapPin} className="w-2.5 h-2.5" aria-hidden="true" />
            {location}
          </p>
        )}
        {note && (
          <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">{note}</p>
        )}
        {bookingRef && (
          <p className="mt-1 text-[11px] text-text-disabled font-mono tabular-nums">Ref: {bookingRef}</p>
        )}
      </div>
    </li>
  );
}
