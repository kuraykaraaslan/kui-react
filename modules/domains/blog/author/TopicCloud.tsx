'use client';
import { cn } from '@/libs/utils/cn';

export type TopicCloudItem = {
  label: string;
  count: number;
  href?: string;
};

type TopicCloudProps = {
  topics: TopicCloudItem[];
  /** Min font size in rem. */
  minSize?: number;
  /** Max font size in rem. */
  maxSize?: number;
  className?: string;
};

export function TopicCloud({
  topics,
  minSize = 0.75,
  maxSize = 1.5,
  className,
}: TopicCloudProps) {
  if (!topics.length) return null;

  const counts = topics.map((t) => t.count);
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  const range = max - min || 1;

  function sizeFor(count: number) {
    const t = (count - min) / range;
    return (minSize + t * (maxSize - minSize)).toFixed(3);
  }

  function opacityFor(count: number) {
    const t = (count - min) / range;
    return (0.55 + t * 0.45).toFixed(2);
  }

  return (
    <ul
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-1.5',
        className,
      )}
      role="list"
    >
      {topics.map((t) => {
        const size = sizeFor(t.count);
        const opacity = opacityFor(t.count);
        const style = { fontSize: `${size}rem`, opacity } as React.CSSProperties;
        const inner = (
          <>
            <span>{t.label}</span>
            <span className="ml-1 text-[0.6em] font-mono text-text-secondary">
              {t.count}
            </span>
          </>
        );

        return (
          <li key={t.label} className="leading-tight">
            {t.href ? (
              <a
                href={t.href}
                style={style}
                className={cn(
                  'inline-flex items-baseline font-semibold text-text-primary',
                  'hover:text-primary transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded',
                )}
              >
                {inner}
              </a>
            ) : (
              <span
                style={style}
                className="inline-flex items-baseline font-semibold text-text-primary"
              >
                {inner}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
