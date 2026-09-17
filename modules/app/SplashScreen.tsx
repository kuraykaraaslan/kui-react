'use client';
import { cn } from '@/libs/utils/cn';
import { Spinner } from '@/modules/ui/Spinner';

type SplashScreenProps = {
  visible?: boolean;
  logo?: React.ReactNode;
  message?: string;
  progress?: number;
  className?: string;
};

export function SplashScreen({
  visible = true,
  logo,
  message,
  progress,
  className,
}: SplashScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message ?? 'Loading'}
      aria-busy={visible}
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center gap-6',
        'bg-surface-base transition-opacity duration-500',
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        className
      )}
    >
      {logo ? (
        <div className="flex items-center justify-center">{logo}</div>
      ) : (
        <Spinner size="xl" />
      )}

      {logo && <Spinner size="lg" />}

      {progress !== undefined && (
        <div className="w-48 h-1 rounded-full bg-surface-sunken overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Loading progress"
            role="progressbar"
          />
        </div>
      )}

      {message && (
        <p className="text-sm text-text-secondary animate-pulse">{message}</p>
      )}
    </div>
  );
}
