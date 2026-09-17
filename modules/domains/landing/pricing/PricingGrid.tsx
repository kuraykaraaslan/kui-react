'use client';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { PricingPlanCard } from './PricingPlanCard';
import type { PricingPlan, PlanInterval } from '../types';

type PricingGridProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  plans: PricingPlan[];
  showIntervalToggle?: boolean;
  className?: string;
};

export function PricingGrid({
  eyebrow,
  title,
  subtitle,
  plans,
  showIntervalToggle = true,
  className,
}: PricingGridProps) {
  const [interval, setInterval] = useState<PlanInterval>('MONTHLY');

  const hasYearly = plans.some((p) => p.interval === 'YEARLY');
  const showToggle = showIntervalToggle && hasYearly;

  const visiblePlans = showToggle
    ? plans.filter((p) => p.interval === interval || p.interval === 'ONCE')
    : plans;

  return (
    <section className={cn('py-16 lg:py-24 bg-surface-base', className)}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mx-auto text-center mb-10">
          {eyebrow && (
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              {eyebrow}
            </span>
          )}
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-3 text-base text-text-secondary leading-relaxed">{subtitle}</p>
          )}
        </div>

        {showToggle && (
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className={cn('text-sm font-medium', interval === 'MONTHLY' ? 'text-text-primary' : 'text-text-secondary')}>
              Monthly
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={interval === 'YEARLY'}
              aria-label="Toggle yearly billing"
              onClick={() => setInterval((prev) => prev === 'MONTHLY' ? 'YEARLY' : 'MONTHLY')}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                interval === 'YEARLY' ? 'bg-primary' : 'bg-surface-sunken',
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                  interval === 'YEARLY' ? 'translate-x-6' : 'translate-x-1',
                )}
              />
            </button>
            <span className={cn('text-sm font-medium', interval === 'YEARLY' ? 'text-text-primary' : 'text-text-secondary')}>
              Yearly
              <span className="ml-1.5 rounded-full bg-success-subtle px-2 py-0.5 text-xs font-semibold text-success-fg">
                Save 20%
              </span>
            </span>
          </div>
        )}

        <div className={cn(
          'grid gap-6',
          visiblePlans.length === 2 && 'sm:grid-cols-2 max-w-2xl mx-auto',
          visiblePlans.length === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
          visiblePlans.length >= 4 && 'sm:grid-cols-2 lg:grid-cols-4',
        )}>
          {visiblePlans.map((plan) => (
            <PricingPlanCard key={plan.planId} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
