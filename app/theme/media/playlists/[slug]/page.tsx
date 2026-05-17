import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { PlaylistHeaderCard } from '@/modules/domains/media/playlist/PlaylistHeaderCard';
import { PlaylistVideoRow } from '@/modules/domains/media/playlist/PlaylistVideoRow';
import { PLAYLISTS, VIDEOS, CHANNELS } from '../../media.data';

export function generateStaticParams() {
  return PLAYLISTS.map((p) => ({ slug: p.slug }));
}

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const playlist = PLAYLISTS.find((p) => p.slug === slug) ?? PLAYLISTS[0];
  const channel = CHANNELS.find((c) => c.channelId === playlist.channelId);
  const videos = playlist.videoIds
    .map((id) => VIDEOS.find((v) => v.videoId === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const totalDurationSeconds = videos.reduce((sum, v) => sum + v.duration, 0);
  const nowPlayingId = videos[0]?.videoId;

  return (
    <div className="bg-surface-base text-text-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <a
          href="/theme/media"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />
          Back to Home
        </a>

        <div className="mb-6">
          <PlaylistHeaderCard
            title={playlist.title}
            description={playlist.description}
            coverUrl={playlist.coverUrl}
            videoCount={videos.length}
            totalDurationSeconds={totalDurationSeconds}
            visibility={playlist.visibility}
            channel={{
              name: channel?.name ?? 'Unknown',
              handle: channel?.handle ?? 'unknown',
              avatarUrl: channel?.avatarUrl,
              verified: channel?.verified,
            }}
          />
        </div>

        <section
          aria-label="Playlist videos"
          className="rounded-xl border border-border bg-surface-raised p-3 sm:p-4 shadow-sm"
        >
          <div className="flex flex-col gap-1">
            {videos.map((v, index) => {
              const vChannel = CHANNELS.find((c) => c.channelId === v.channelId);
              return (
                <PlaylistVideoRow
                  key={v.videoId}
                  position={index + 1}
                  title={v.title}
                  channelName={vChannel?.name ?? 'Unknown'}
                  channelVerified={vChannel?.verified}
                  thumbnailUrl={v.thumbnailUrl}
                  duration={v.duration}
                  isPlaying={v.videoId === nowPlayingId}
                  href={`/theme/media/videos/${v.slug}`}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
