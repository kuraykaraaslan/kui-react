'use client';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVideo,
  faPhone,
  faBuilding,
  faClock,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type InterviewMode = 'video' | 'phone' | 'onsite';

type InterviewScheduleRowProps = {
  round: string;
  companyName: string;
  jobTitle?: string;
  mode: InterviewMode;
  scheduledAt: Date | string;
  durationMin: number;
  interviewer?: string;
  meetingLink?: string;
  className?: string;
};

const MODE_META: Record<InterviewMode, { icon: IconDefinition; label: string }> = {
  video:  { icon: faVideo,    label: 'Video call' },
  phone:  { icon: faPhone,    label: 'Phone' },
  onsite: { icon: faBuilding, label: 'On-site' },
};

function dateAndTime(date: Date | string): { date: string; time: string } {
  const d = new Date(date);
  return {
    date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
  };
}

export function InterviewScheduleRow({
  round,
  companyName,
  jobTitle,
  mode,
  scheduledAt,
  durationMin,
  interviewer,
  meetingLink,
  className,
}: InterviewScheduleRowProps) {
  const meta = MODE_META[mode];
  const { date, time } = dateAndTime(scheduledAt);
  const upcoming = new Date(scheduledAt).getTime() > Date.now();

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-lg border border-border bg-surface-raised p-4',
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center rounded-lg bg-primary-subtle text-primary px-3 py-2 shrink-0">
        <span className="text-[10px] uppercase font-semibold tracking-wide">
          {new Date(scheduledAt).toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-xl font-extrabold tabular-nums leading-none">
          {new Date(scheduledAt).getDate()}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-text-primary">{round}</h3>
          <Badge variant={upcoming ? 'primary' : 'neutral'} size="sm">
            {upcoming ? 'Upcoming' : 'Past'}
          </Badge>
        </div>
        <p className="text-xs text-text-secondary">
          {companyName}{jobTitle && ` · ${jobTitle}`}
        </p>
        <ul className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-secondary">
          <li className="inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faCalendar} className="w-3 h-3" aria-hidden="true" />
            {date}, {time}
          </li>
          <li className="inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="w-3 h-3" aria-hidden="true" />
            {durationMin} min
          </li>
          <li className="inline-flex items-center gap-1">
            <FontAwesomeIcon icon={meta.icon} className="w-3 h-3" aria-hidden="true" />
            {meta.label}
          </li>
        </ul>
        {interviewer && (
          <p className="mt-1 text-xs text-text-secondary">with {interviewer}</p>
        )}
      </div>

      {meetingLink && upcoming && (
        <a
          href={meetingLink}
          className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-fg hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <FontAwesomeIcon icon={meta.icon} className="w-3 h-3" aria-hidden="true" />
          Join
        </a>
      )}
    </div>
  );
}
