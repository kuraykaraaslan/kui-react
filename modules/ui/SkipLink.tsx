'use client';
import { cn } from '@/libs/utils/cn';

export function SkipLink({
  href = '#main-content',
  label = 'Skip to main content',
  className,
}: {
  href?: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]',
        'px-4 py-2 rounded-md text-sm font-medium',
        'bg-primary text-primary-fg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
        className
      )}
    >
      {label}
    </a>
  );
}

export function LiveRegion({
  message,
  politeness = 'polite',
  className,
}: {
  message?: string;
  politeness?: 'polite' | 'assertive';
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className={cn('sr-only', className)}
    >
      {message}
    </div>
  );
}

export function Announcer({
  message,
  politeness = 'polite',
}: {
  message: string;
  politeness?: 'polite' | 'assertive';
}) {
  return <LiveRegion message={message} politeness={politeness} />;
}
