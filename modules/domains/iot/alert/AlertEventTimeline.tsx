'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faCheck,
  faCircleCheck,
  faMessage,
  faRobot,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type AlertEventKind = 'opened' | 'acknowledged' | 'resolved' | 'note' | 'automation';

export type AlertEvent = {
  eventId: string;
  kind: AlertEventKind;
  by: string;
  at: Date | string;
  note?: string;
};

type AlertEventTimelineProps = {
  events: AlertEvent[];
  className?: string;
};

const KIND_META: Record<AlertEventKind, { icon: IconDefinition; label: string; tone: string }> = {
  opened:       { icon: faTriangleExclamation, label: 'Alert opened',     tone: 'bg-error-subtle text-error' },
  acknowledged: { icon: faCheck,               label: 'Acknowledged',     tone: 'bg-warning-subtle text-warning' },
  resolved:     { icon: faCircleCheck,         label: 'Resolved',         tone: 'bg-success-subtle text-success' },
  note:         { icon: faMessage,             label: 'Note added',       tone: 'bg-info-subtle text-info' },
  automation:   { icon: faRobot,               label: 'Automation',       tone: 'bg-surface-overlay text-text-secondary' },
};

function fullDate(date: Date | string): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function AlertEventTimeline({ events, className }: AlertEventTimelineProps) {
  return (
    <ol
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-5 shadow-sm',
        className,
      )}
      aria-label="Alert event history"
    >
      {events.map((event, idx) => {
        const meta = KIND_META[event.kind];
        const isLast = idx === events.length - 1;
        return (
          <li key={event.eventId} className="relative flex gap-3 pb-5 last:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className="absolute left-[15px] top-8 bottom-0 w-px bg-border"
              />
            )}
            <span
              className={cn(
                'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-4 ring-surface-raised',
                meta.tone,
              )}
              aria-hidden="true"
            >
              <FontAwesomeIcon icon={meta.icon} className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-text-primary">
                  {meta.label}
                  <span className="ml-1.5 font-normal text-text-secondary">by {event.by}</span>
                </p>
                <time
                  className="shrink-0 text-xs text-text-secondary tabular-nums"
                  dateTime={new Date(event.at).toISOString()}
                >
                  {fullDate(event.at)}
                </time>
              </div>
              {event.note && (
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">{event.note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
