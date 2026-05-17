'use client';
import { cn } from '@/libs/utils/cn';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBuilding } from '@fortawesome/free-solid-svg-icons';

type CaseStudyCardProps = {
  company: string;
  logoUrl?: string | null;
  industry: string;
  headline: string;
  summary: string;
  keyResult?: string;
  href?: string;
  className?: string;
};

export function CaseStudyCard({
  company,
  logoUrl,
  industry,
  headline,
  summary,
  keyResult,
  href,
  className,
}: CaseStudyCardProps) {
  const Wrapper = href ? 'a' : 'div';

  return (
    <Wrapper
      {...(href ? { href } : {})}
      className={cn(
        'group flex flex-col gap-4 rounded-xl border border-border bg-surface-raised p-6 shadow-sm',
        href && 'transition-all hover:shadow-md hover:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className,
      )}
    >
      <header className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle text-primary"
          aria-hidden="true"
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-8 w-8 rounded object-contain" />
          ) : (
            <FontAwesomeIcon icon={faBuilding} className="w-4 h-4" />
          )}
        </span>
        <div>
          <p className="text-sm font-semibold text-text-primary">{company}</p>
          <Badge variant="neutral" size="sm">{industry}</Badge>
        </div>
      </header>

      <div>
        <h3 className="text-lg font-bold text-text-primary leading-snug">{headline}</h3>
        <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-3">{summary}</p>
      </div>

      {keyResult && (
        <p className="rounded-lg border border-primary/20 bg-primary-subtle px-3 py-2 text-sm font-semibold text-primary">
          {keyResult}
        </p>
      )}

      {href && (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2 transition-all">
          Read case study
          <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" aria-hidden="true" />
        </span>
      )}
    </Wrapper>
  );
}
