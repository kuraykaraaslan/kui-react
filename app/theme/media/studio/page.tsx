import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faVideo, faChartLine, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';

export const metadata: Metadata = {
  title: buildPageTitle('Studio', THEME_TITLES.media),
};
import { ChannelStatsCard } from '@/modules/domains/media/channel/ChannelStatsCard';
import { VideoPerformanceRow } from '@/modules/domains/media/video/VideoPerformanceRow';
import { WatchTimeChart } from '@/modules/domains/media/chart/WatchTimeChart';
import {
  CHANNELS,
  VIDEOS,
  STUDIO_VIDEO_STATS,
  STUDIO_WATCH_TIME,
  STUDIO_CHANNEL_ID,
} from '../media.data';

export default function CreatorStudioPage() {
  const channel = CHANNELS.find((c) => c.channelId === STUDIO_CHANNEL_ID) ?? CHANNELS[0];

  const rows = STUDIO_VIDEO_STATS.map((s) => {
    const video = VIDEOS.find((v) => v.videoId === s.videoId);
    return { stat: s, video };
  }).filter((r): r is { stat: typeof STUDIO_VIDEO_STATS[number]; video: NonNullable<typeof r.video> } => Boolean(r.video));

  return (
    <div className="bg-surface-base text-text-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Back link */}
        <a
          href="/theme/media"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />
          Back to Home
        </a>

        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Creator Studio</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Performance overview for{' '}
              <span className="font-semibold text-text-primary">{channel.name}</span> · last 28 days
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="md"
              iconLeft={<FontAwesomeIcon icon={faChartLine} className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              Export report
            </Button>
            <Button
              variant="primary"
              size="md"
              iconLeft={<FontAwesomeIcon icon={faUpload} className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              Upload video
            </Button>
          </div>
        </header>

        {/* Stats */}
        <div className="mb-6">
          <ChannelStatsCard
            channelName={channel.name}
            stats={[
              { metric: 'subscribers', value: channel.subscriberCount, deltaPct: 4.2, helper: 'vs prev' },
              { metric: 'views', value: 1_242_000, deltaPct: 12.8, helper: 'vs prev' },
              { metric: 'watchTime', value: 48_220, deltaPct: 6.9, helper: 'hours' },
              { metric: 'videos', value: channel.videoCount, deltaPct: 1.2, helper: 'new' },
            ]}
          />
        </div>

        {/* Chart */}
        <div className="mb-6">
          <WatchTimeChart
            title="Watch time"
            subtitle="Daily watch hours · last 8 days"
            data={STUDIO_WATCH_TIME}
          />
        </div>

        {/* Top videos */}
        <section className="rounded-xl border border-border bg-surface-raised p-5 shadow-sm">
          <header className="mb-4 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-text-primary inline-flex items-center gap-2">
              <FontAwesomeIcon icon={faVideo} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
              Top performing videos
            </h2>
            <span className="text-xs text-text-secondary">Sorted by watch time</span>
          </header>

          <div className="flex flex-col gap-2">
            {rows.map(({ stat, video }) => (
              <VideoPerformanceRow
                key={video.videoId}
                thumbnailUrl={video.thumbnailUrl}
                title={video.title}
                status={video.status}
                publishedAt={video.publishedAt}
                views={video.viewCount}
                watchTimeHours={stat.watchTimeHours}
                ctrPct={stat.ctrPct}
                deltaPct={stat.deltaPct}
                href={`/theme/media/videos/${video.slug}`}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
