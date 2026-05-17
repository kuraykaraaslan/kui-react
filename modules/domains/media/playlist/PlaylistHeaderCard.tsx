'use client';
import { cn } from '@/libs/utils/cn';
import { Avatar } from '@/modules/ui/Avatar';
import { Button } from '@/modules/ui/Button';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faShuffle,
  faList,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';

type PlaylistHeaderCardProps = {
  title: string;
  description?: string;
  coverUrl?: string | null;
  videoCount: number;
  totalDurationSeconds: number;
  visibility?: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
  channel: {
    name: string;
    handle: string;
    avatarUrl?: string | null;
    verified?: boolean;
  };
  onPlay?: () => void;
  onShuffle?: () => void;
  className?: string;
};

function formatTotalDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
}

const VISIBILITY_VARIANT: Record<NonNullable<PlaylistHeaderCardProps['visibility']>, 'success' | 'neutral' | 'warning'> = {
  PUBLIC: 'success',
  UNLISTED: 'neutral',
  PRIVATE: 'warning',
};

export function PlaylistHeaderCard({
  title,
  description,
  coverUrl,
  videoCount,
  totalDurationSeconds,
  visibility = 'PUBLIC',
  channel,
  onPlay,
  onShuffle,
  className,
}: PlaylistHeaderCardProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-surface-raised overflow-hidden',
        className,
      )}
      aria-label={`Playlist: ${title}`}
    >
      <div className="grid gap-6 p-5 sm:grid-cols-[240px_1fr]">
        <div className="relative aspect-video sm:aspect-square w-full overflow-hidden rounded-lg bg-surface-sunken">
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-subtle to-surface-overlay">
              <FontAwesomeIcon icon={faList} className="w-10 h-10 text-primary" aria-hidden="true" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded bg-[rgba(0,0,0,0.7)] px-2 py-1 text-xs font-semibold text-white">
            <FontAwesomeIcon icon={faList} className="w-3 h-3" aria-hidden="true" />
            {videoCount} videos
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-2 flex-wrap">
            <Badge variant={VISIBILITY_VARIANT[visibility]} size="sm">
              {visibility}
            </Badge>
            <Badge variant="neutral" size="sm">
              {formatTotalDuration(totalDurationSeconds)}
            </Badge>
          </div>

          <h2 className="text-2xl font-extrabold text-text-primary leading-tight">{title}</h2>

          {description && (
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{description}</p>
          )}

          <div className="flex items-center gap-2">
            <Avatar src={channel.avatarUrl} name={channel.name} size="sm" />
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium text-text-primary">{channel.name}</span>
              {channel.verified && (
                <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5 text-info" aria-label="Verified" />
              )}
              <span className="text-text-secondary">· @{channel.handle}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button
              variant="primary"
              size="md"
              iconLeft={<FontAwesomeIcon icon={faPlay} className="w-3.5 h-3.5" aria-hidden="true" />}
              onClick={onPlay}
            >
              Play all
            </Button>
            <Button
              variant="outline"
              size="md"
              iconLeft={<FontAwesomeIcon icon={faShuffle} className="w-3.5 h-3.5" aria-hidden="true" />}
              onClick={onShuffle}
            >
              Shuffle
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
