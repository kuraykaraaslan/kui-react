'use client';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCircleCheck, faGripVertical } from '@fortawesome/free-solid-svg-icons';

type PlaylistVideoRowProps = {
  position: number;
  title: string;
  channelName: string;
  channelVerified?: boolean;
  thumbnailUrl?: string | null;
  duration?: number;
  isPlaying?: boolean;
  draggable?: boolean;
  href?: string;
  className?: string;
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function PlaylistVideoRow({
  position,
  title,
  channelName,
  channelVerified,
  thumbnailUrl,
  duration,
  isPlaying,
  draggable,
  href,
  className,
}: PlaylistVideoRowProps) {
  const Wrapper = href ? 'a' : 'div';

  return (
    <Wrapper
      {...(href ? { href } : {})}
      aria-current={isPlaying ? 'true' : undefined}
      className={cn(
        'group grid items-center gap-3 rounded-lg border border-transparent px-2 py-2',
        'grid-cols-[28px_120px_minmax(0,1fr)_auto]',
        isPlaying
          ? 'bg-primary-subtle border-primary/30'
          : 'hover:bg-surface-overlay hover:border-border',
        href && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus transition-colors',
        className,
      )}
    >
      <div className="flex items-center justify-center text-text-secondary text-xs font-semibold tabular-nums">
        {draggable && (
          <FontAwesomeIcon
            icon={faGripVertical}
            className="hidden group-hover:block w-3 h-3 cursor-grab text-text-disabled"
            aria-label="Drag to reorder"
          />
        )}
        <span className={cn(draggable && 'group-hover:hidden')}>
          {isPlaying ? (
            <FontAwesomeIcon icon={faPlay} className="w-3 h-3 text-primary" aria-label="Now playing" />
          ) : (
            position
          )}
        </span>
      </div>

      <div className="relative aspect-video w-[120px] overflow-hidden rounded bg-surface-sunken">
        {thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnailUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FontAwesomeIcon icon={faPlay} className="w-3.5 h-3.5 text-text-disabled" aria-hidden="true" />
          </div>
        )}
        {duration !== undefined && duration > 0 && (
          <span className="absolute bottom-1 right-1 rounded bg-[rgba(0,0,0,0.75)] px-1 py-0.5 text-[10px] font-semibold text-white tabular-nums">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <p className="line-clamp-2 text-sm font-medium text-text-primary leading-snug">{title}</p>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-text-secondary">
          <span>{channelName}</span>
          {channelVerified && (
            <FontAwesomeIcon icon={faCircleCheck} className="w-3 h-3 text-info" aria-label="Verified" />
          )}
        </div>
      </div>

      {duration !== undefined && duration > 0 && (
        <span className="hidden sm:inline text-xs text-text-secondary tabular-nums">
          {formatDuration(duration)}
        </span>
      )}
    </Wrapper>
  );
}
