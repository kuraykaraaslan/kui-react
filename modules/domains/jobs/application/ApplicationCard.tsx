'use client';
import { cn } from '@/libs/utils/cn';
import { Avatar } from '@/modules/ui/Avatar';
import { Badge } from '@/modules/ui/Badge';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import type { ApplicationStatus } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBriefcase, faLocationDot } from '@fortawesome/free-solid-svg-icons';

type ApplicationCardProps = {
  jobTitle: string;
  companyName: string;
  companyLogo?: string | null;
  location?: string;
  salaryRange?: string;
  appliedAt: Date | string;
  status: ApplicationStatus;
  href?: string;
  nextStep?: string;
  className?: string;
};

function daysAgo(date: Date | string): string {
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ApplicationCard({
  jobTitle,
  companyName,
  companyLogo,
  location,
  salaryRange,
  appliedAt,
  status,
  href,
  nextStep,
  className,
}: ApplicationCardProps) {
  const Wrapper = href ? 'a' : 'div';

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={cn(
        'group flex flex-col gap-3 rounded-xl border border-border bg-surface-raised p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between',
        href && 'hover:border-border-focus hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className,
      )}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <Avatar src={companyLogo} name={companyName} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{jobTitle}</h3>
          <p className="text-xs text-text-secondary">{companyName}</p>
          <ul className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-text-secondary">
            {location && (
              <li className="inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faLocationDot} className="w-2.5 h-2.5" aria-hidden="true" />
                {location}
              </li>
            )}
            {salaryRange && (
              <li className="inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faBriefcase} className="w-2.5 h-2.5" aria-hidden="true" />
                {salaryRange}
              </li>
            )}
            <li className="inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} className="w-2.5 h-2.5" aria-hidden="true" />
              Applied {daysAgo(appliedAt)}
            </li>
          </ul>
          {nextStep && (
            <p className="mt-2 text-xs text-text-primary">
              <Badge variant="primary" size="sm" className="mr-1.5">Next</Badge>
              {nextStep}
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 self-start sm:self-center">
        <ApplicationStatusBadge status={status} />
      </div>
    </Wrapper>
  );
}
