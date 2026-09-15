'use client';
import { cn } from '@/libs/utils/cn';
import { AlertBanner } from '@/modules/ui/AlertBanner';
import { Button } from '@/modules/ui/Button';
import { EmptyState } from '@/modules/ui/EmptyState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faMagnifyingGlass, faLock, faArrowLeft, faRotateRight } from '@fortawesome/free-solid-svg-icons';

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  className,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <AlertBanner
        variant="error"
        title={title}
        message={message}
        action={onRetry ? { label: retryLabel, onClick: onRetry } : undefined}
      />
      {onRetry && (
        <div className="flex justify-center">
          <EmptyState
            icon={<FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5" aria-hidden="true" />}
            title="Unable to load data"
            description="There was a problem loading this content."
            action={
              <Button variant="outline" size="sm" onClick={onRetry} iconLeft={<FontAwesomeIcon icon={faRotateRight} className="w-3.5 h-3.5" aria-hidden="true" />}>
                {retryLabel}
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}

export function NotFoundState({
  title = 'Page not found',
  description = "The page you're looking for doesn't exist or has been moved.",
  onGoBack,
  goBackLabel = 'Go back',
  className,
}: {
  title?: string;
  description?: string;
  onGoBack?: () => void;
  goBackLabel?: string;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5" aria-hidden="true" />}
      title={title}
      description={description}
      action={
        onGoBack ? (
          <Button variant="outline" size="sm" onClick={onGoBack} iconLeft={<FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />}>
            {goBackLabel}
          </Button>
        ) : undefined
      }
      className={className}
    />
  );
}

export function NoAccessState({
  title = 'Access denied',
  description = "You don't have permission to view this content.",
  onRequestAccess,
  className,
}: {
  title?: string;
  description?: string;
  onRequestAccess?: () => void;
  className?: string;
}) {
  return (
    <EmptyState
      icon={<FontAwesomeIcon icon={faLock} className="w-5 h-5" aria-hidden="true" />}
      title={title}
      description={description}
      action={
        onRequestAccess ? (
          <Button variant="primary" size="sm" onClick={onRequestAccess}>
            Request access
          </Button>
        ) : undefined
      }
      className={className}
    />
  );
}
