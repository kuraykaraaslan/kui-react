'use client';
import { cn } from '@/libs/utils/cn';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

type LogStreamRowProps = {
  timestamp: Date | string;
  level: LogLevel;
  source?: string;
  message: string;
  className?: string;
};

const LEVEL_CLASSES: Record<LogLevel, string> = {
  debug: 'text-text-secondary',
  info:  'text-info',
  warn:  'text-warning',
  error: 'text-error',
  fatal: 'text-error font-bold',
};

const LEVEL_LABEL: Record<LogLevel, string> = {
  debug: 'DBG',
  info:  'INF',
  warn:  'WRN',
  error: 'ERR',
  fatal: 'FTL',
};

function formatTimestamp(date: Date | string): string {
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(d.getMilliseconds()).padStart(3, '0')}`;
}

export function LogStreamRow({
  timestamp,
  level,
  source,
  message,
  className,
}: LogStreamRowProps) {
  return (
    <li
      className={cn(
        'flex items-baseline gap-3 px-3 py-1.5 font-mono text-xs leading-relaxed',
        'border-b border-border last:border-b-0',
        level === 'error' && 'bg-error-subtle',
        level === 'fatal' && 'bg-error-subtle',
        level === 'warn' && 'bg-warning-subtle',
        className,
      )}
    >
      <time
        className="shrink-0 text-text-secondary tabular-nums"
        dateTime={new Date(timestamp).toISOString()}
      >
        {formatTimestamp(timestamp)}
      </time>
      <span
        className={cn('shrink-0 font-semibold tabular-nums', LEVEL_CLASSES[level])}
        aria-label={`Level ${level}`}
      >
        [{LEVEL_LABEL[level]}]
      </span>
      {source && (
        <span className="shrink-0 truncate text-text-secondary max-w-[10rem]" title={source}>
          {source}
        </span>
      )}
      <span className="min-w-0 flex-1 text-text-primary break-words">
        {message}
      </span>
    </li>
  );
}
