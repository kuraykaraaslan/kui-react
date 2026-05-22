import type { Metadata } from 'next';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faFire,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { VideoCard } from '@/modules/domains/media/video/VideoCard';
import { ChannelCard } from '@/modules/domains/media/channel/ChannelCard';
import { VIDEOS, CHANNELS, CATEGORIES, FEATURED_VIDEO } from './media.data';

export const metadata: Metadata = {
  title: { absolute: THEME_TITLES.media },
};

export default function MediaThemePage() {
  const trendingVideos = VIDEOS.slice(0, 6);
  const topChannels = CHANNELS.slice(0, 4);

  return (
    <div className="bg-surface-base text-text-primary">
      {/* Hero — featured video banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 opacity-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FEATURED_VIDEO.thumbnailUrl}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-16 flex flex-col md:flex-row items-center gap-8">
          {/* Text */}
          <div className="flex-1 space-y-4 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-error/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <FontAwesomeIcon icon={faFire} className="w-3 h-3" aria-hidden="true" />
              Trending Now
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              {FEATURED_VIDEO.title}
            </h1>
            <p className="text-white/70 text-sm">
              {(FEATURED_VIDEO.viewCount / 1_000_000).toFixed(1)}M views &middot; {FEATURED_VIDEO.category}
            </p>
            <a
              href={`/theme/media/videos/${FEATURED_VIDEO.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-gray-900 font-semibold px-5 py-2.5 text-sm hover:bg-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FontAwesomeIcon icon={faPlay} className="w-4 h-4 translate-x-0.5" aria-hidden="true" />
              Watch Now
            </a>
          </div>

          {/* Thumbnail */}
          <div className="shrink-0 w-full md:w-96 rounded-2xl overflow-hidden shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FEATURED_VIDEO.thumbnailUrl}
              alt={FEATURED_VIDEO.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="border-b border-border bg-surface-raised">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide shrink-0 mr-2">Browse:</span>
          {CATEGORIES.map((cat) => (
            <a
              key={cat}
              href={`/theme/media/videos`}
              className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-surface-base text-text-secondary hover:border-border-focus hover:text-text-primary transition-colors"
            >
              {cat}
            </a>
          ))}
        </div>
      </section>

      {/* Trending videos */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
            <FontAwesomeIcon icon={faFire} className="w-5 h-5 text-error" aria-hidden="true" />
            Trending Videos
          </h2>
          <a href="/theme/media/videos" className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
            View all <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trendingVideos.map((video) => {
            const channel = CHANNELS.find((c) => c.channelId === video.channelId);
            return (
              <VideoCard
                key={video.videoId}
                video={{
                  videoId: video.videoId,
                  title: video.title,
                  slug: video.slug,
                  thumbnailUrl: video.thumbnailUrl,
                  duration: video.duration,
                  viewCount: video.viewCount,
                  likeCount: video.likeCount,
                  status: video.status,
                  channelName: channel?.name ?? 'Unknown',
                  channelHandle: channel?.handle ?? '',
                  channelVerified: channel?.verified,
                  publishedAt: video.publishedAt,
                }}
                href={`/theme/media/videos/${video.slug}`}
              />
            );
          })}
        </div>
      </section>

      {/* Top channels */}
      <section className="bg-surface-raised border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Top Channels</h2>
            <a href="/theme/media/channels" className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
              All channels <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topChannels.map((channel) => (
              <ChannelCard
                key={channel.channelId}
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
                href={`/theme/media/channels`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-2xl bg-primary px-8 py-10 text-center space-y-4">
          <h2 className="text-2xl font-bold text-primary-fg">Ready to start creating?</h2>
          <p className="text-primary-fg/80 max-w-md mx-auto text-sm leading-relaxed">
            Join thousands of creators sharing their passion on StreamVault. Upload your first video today — it&apos;s free.
          </p>
          <a
            href="/theme/media"
            className="inline-flex items-center gap-2 rounded-xl bg-white text-primary font-semibold px-6 py-2.5 text-sm hover:bg-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Start Uploading
          </a>
        </div>
      </section>
    </div>
  );
}
