'use client';
import { cn } from '@/libs/utils/cn';

type Metric = {
  value: string;
  label: string;
  helper?: string;
};

type MetricsCalloutProps = {
  title?: string;
  metrics: Metric[];
  variant?: 'default' | 'inverted';
  className?: string;
};

export function MetricsCallout({
  title,
  metrics,
  variant = 'default',
  className,
}: MetricsCalloutProps) {
  const inverted = variant === 'inverted';
  return (
    <section
      className={cn(
        'rounded-xl p-6',
        inverted
          ? 'bg-text-primary text-text-inverse'
          : 'bg-primary-subtle text-text-primary',
        className,
      )}
      aria-label={title ?? 'Results'}
    >
      {title && (
        <h3
          className={cn(
            'mb-4 text-sm font-semibold uppercase tracking-wide',
            inverted ? 'text-text-inverse/70' : 'text-primary',
          )}
        >
          {title}
        </h3>
      )}
      <dl
        className={cn(
          'grid gap-6',
          metrics.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3',
        )}
      >
        {metrics.map((m, i) => (
          <div key={i}>
            <dt
              className={cn(
                'text-xs font-medium uppercase tracking-wide',
                inverted ? 'text-text-inverse/70' : 'text-text-secondary',
              )}
            >
              {m.label}
            </dt>
            <dd className="mt-1 text-3xl font-extrabold tabular-nums">{m.value}</dd>
            {m.helper && (
              <p
                className={cn(
                  'mt-0.5 text-xs',
                  inverted ? 'text-text-inverse/70' : 'text-text-secondary',
                )}
              >
                {m.helper}
              </p>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
