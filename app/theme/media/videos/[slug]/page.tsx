import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faShare,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { VideoPlayer } from '@/modules/ui/VideoPlayer';
import { VideoMeta } from '@/modules/domains/media/video/VideoMeta';
import { ChannelCard } from '@/modules/domains/media/channel/ChannelCard';
import { VideoCard } from '@/modules/domains/media/video/VideoCard';
import { VIDEOS, CHANNELS } from '../../media.data';

export function generateStaticParams() {
  return VIDEOS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const video = VIDEOS.find((v) => v.slug === slug);
  return { title: buildPageTitle(video?.title ?? slug, THEME_TITLES.media) };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = VIDEOS.find((v) => v.slug === slug) ?? VIDEOS[0];
  const channel = CHANNELS.find((c) => c.channelId === video.channelId);
  const related = VIDEOS.filter(
    (v) => v.videoId !== video.videoId && v.category === video.category
  ).slice(0, 4);

  return (
    <div className="bg-surface-base text-text-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Back link */}
        <a
          href="/theme/media/videos"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />
          Back to Videos
        </a>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main column */}
          <div className="flex-1 min-w-0 space-y-6">
            <VideoPlayer
              src="https://placeholdervideo.dev/1920x1080"
              poster={video.thumbnailUrl}
              title={video.title}
              qualities={[
                { label: '1080p HD', value: '1080' },
                { label: '720p', value: '720' },
                { label: '480p', value: '480' },
                { label: 'Auto', value: 'auto' },
              ]}
              defaultQuality="auto"
            />

            {/* Title */}
            <div>
              <h1 className="text-xl font-bold text-text-primary leading-snug">{video.title}</h1>
            </div>

            {/* Meta + actions row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border">
              <VideoMeta
                video={{
                  viewCount: video.viewCount,
                  likeCount: video.likeCount,
                  publishedAt: video.publishedAt,
                  duration: video.duration,
                }}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-raised text-sm text-text-secondary hover:border-border-focus hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                  <FontAwesomeIcon icon={faThumbsUp} className="w-4 h-4" aria-hidden="true" />
                  Like
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-raised text-sm text-text-secondary hover:border-border-focus hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                  <FontAwesomeIcon icon={faShare} className="w-4 h-4" aria-hidden="true" />
                  Share
                </button>
              </div>
            </div>

            {/* Channel info */}
            {channel && (
              <div>
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-3">Channel</h2>
                <ChannelCard
                  channel={{
                    channelId: channel.channelId,
                    name: channel.name,
                    handle: channel.handle,
                    description: channel.description,
                    avatarUrl: channel.avatarUrl,
                    subscriberCount: channel.subscriberCount,
                    videoCount: channel.videoCount,
                    verified: channel.verified,
                  }}
                  href="/theme/media/channels"
                />
              </div>
            )}
          </div>

          {/* Sidebar — related videos */}
          {related.length > 0 && (
            <aside className="w-full lg:w-80 shrink-0 space-y-4">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">Up Next</h2>
              {related.map((rv) => {
                const rvChannel = CHANNELS.find((c) => c.channelId === rv.channelId);
                return (
                  <VideoCard
                    key={rv.videoId}
                    video={{
                      videoId: rv.videoId,
                      title: rv.title,
                      slug: rv.slug,
                      thumbnailUrl: rv.thumbnailUrl,
                      duration: rv.duration,
                      viewCount: rv.viewCount,
                      likeCount: rv.likeCount,
                      status: rv.status,
                      channelName: rvChannel?.name ?? 'Unknown',
                      channelHandle: rvChannel?.handle ?? '',
                      channelVerified: rvChannel?.verified,
                      publishedAt: rv.publishedAt,
                    }}
                    href={`/theme/media/videos/${rv.slug}`}
                  />
                );
              })}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
