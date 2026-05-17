'use client';
import type { ShowcaseComponent } from '../showcase.types';
import { VideoStatusBadge } from '@/modules/domains/media/video/VideoStatusBadge';
import { VideoCard } from '@/modules/domains/media/video/VideoCard';
import { ChannelCard } from '@/modules/domains/media/channel/ChannelCard';
import { VideoMeta } from '@/modules/domains/media/video/VideoMeta';
import { ChannelStatsCard } from '@/modules/domains/media/channel/ChannelStatsCard';
import { VideoPerformanceRow } from '@/modules/domains/media/video/VideoPerformanceRow';
import { WatchTimeChart } from '@/modules/domains/media/chart/WatchTimeChart';
import { PlaylistHeaderCard } from '@/modules/domains/media/playlist/PlaylistHeaderCard';
import { PlaylistVideoRow } from '@/modules/domains/media/playlist/PlaylistVideoRow';

/* ─── demo data ─── */

const DEMO_VIDEO_PUBLISHED = {
  videoId: 'demo-v-01',
  title: 'Next.js 16 App Router — Complete Beginner Guide',
  slug: 'nextjs-16-app-router-complete-guide',
  thumbnailUrl: 'https://picsum.photos/seed/video1/640/360',
  duration: 3842,
  viewCount: 128400,
  likeCount: 5320,
  status: 'PUBLISHED' as const,
  channelName: 'CodeWithAlex',
  channelHandle: 'codewithAlex',
  channelVerified: true,
  publishedAt: new Date('2026-04-15'),
};

const DEMO_VIDEO_DRAFT = {
  ...DEMO_VIDEO_PUBLISHED,
  videoId: 'demo-v-02',
  title: 'Building a Full-Stack App with Prisma and tRPC',
  slug: 'full-stack-prisma-trpc',
  thumbnailUrl: undefined,
  duration: 5460,
  viewCount: 0,
  likeCount: 0,
  status: 'DRAFT' as const,
  publishedAt: undefined,
};

const DEMO_CHANNEL = {
  channelId: 'demo-ch-01',
  name: 'CodeWithAlex',
  handle: 'codewithAlex',
  description: 'Deep dives into web development, TypeScript, and modern frameworks. New videos every week.',
  avatarUrl: 'https://picsum.photos/seed/channel1/100/100',
  subscriberCount: 482000,
  videoCount: 214,
  verified: true,
};

const DEMO_CHANNEL_UNVERIFIED = {
  channelId: 'demo-ch-02',
  name: 'ChefMarco',
  handle: 'chefmarco',
  description: 'Italian home cooking made easy. Simple recipes, fresh ingredients, incredible results.',
  avatarUrl: 'https://picsum.photos/seed/channel3/100/100',
  subscriberCount: 315000,
  videoCount: 189,
  verified: false,
};

/* ─── builder ─── */

export function buildMediaDomainData(): ShowcaseComponent[] {
  return [
    {
      id: 'media-video-status-badge',
      title: 'VideoStatusBadge',
      category: 'Domain',
      abbr: 'VS',
      description: 'Displays video lifecycle status with semantic colour coding.',
      filePath: 'modules/domains/media/video/VideoStatusBadge.tsx',
      sourceCode: `import { VideoStatusBadge } from '@/modules/domains/media/video/VideoStatusBadge';
<VideoStatusBadge status="PUBLISHED" />`,
      variants: [
        {
          title: 'All statuses',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['DRAFT', 'PROCESSING', 'PUBLISHED', 'PRIVATE', 'UNLISTED', 'BLOCKED', 'DELETED'] as const).map((s) => (
                <VideoStatusBadge key={s} status={s} />
              ))}
            </div>
          ),
          code: `{(['DRAFT', 'PROCESSING', 'PUBLISHED', 'PRIVATE', 'UNLISTED', 'BLOCKED', 'DELETED'] as const).map((s) => (
  <VideoStatusBadge key={s} status={s} />
))}`,
        },
        {
          title: 'Sizes',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap items-center gap-2">
              <VideoStatusBadge status="PUBLISHED" size="sm" />
              <VideoStatusBadge status="PUBLISHED" size="md" />
            </div>
          ),
          code: `<VideoStatusBadge status="PUBLISHED" size="sm" />
<VideoStatusBadge status="PUBLISHED" size="md" />`,
        },
      ],
    },
    {
      id: 'media-video-card',
      title: 'VideoCard',
      category: 'Domain',
      abbr: 'VC',
      description: 'Thumbnail card for a video: 16:9 image, duration overlay, title, channel, and view count.',
      filePath: 'modules/domains/media/video/VideoCard.tsx',
      sourceCode: `import { VideoCard } from '@/modules/domains/media/video/VideoCard';
<VideoCard video={video} href="/theme/media/videos/slug" />`,
      variants: [
        {
          title: 'Published with thumbnail',
          preview: (
            <div className="max-w-sm">
              <VideoCard video={DEMO_VIDEO_PUBLISHED} href="#" />
            </div>
          ),
          code: `<VideoCard video={video} href="/videos/slug" />`,
        },
        {
          title: 'Draft, no thumbnail',
          preview: (
            <div className="max-w-sm">
              <VideoCard video={DEMO_VIDEO_DRAFT} />
            </div>
          ),
          code: `<VideoCard video={{ ...video, status: 'DRAFT', thumbnailUrl: undefined }} />`,
        },
      ],
    },
    {
      id: 'media-channel-card',
      title: 'ChannelCard',
      category: 'Domain',
      abbr: 'CC',
      description: 'Channel profile card: avatar, name, verified badge, subscriber count, and subscribe button.',
      filePath: 'modules/domains/media/channel/ChannelCard.tsx',
      sourceCode: `import { ChannelCard } from '@/modules/domains/media/channel/ChannelCard';
<ChannelCard channel={channel} href="/channels" />`,
      variants: [
        {
          title: 'Verified channel',
          preview: (
            <div className="max-w-sm">
              <ChannelCard channel={DEMO_CHANNEL} href="#" />
            </div>
          ),
          code: `<ChannelCard channel={channel} href="/channels" />`,
        },
        {
          title: 'Unverified channel',
          preview: (
            <div className="max-w-sm">
              <ChannelCard channel={DEMO_CHANNEL_UNVERIFIED} />
            </div>
          ),
          code: `<ChannelCard channel={{ ...channel, verified: false }} />`,
        },
      ],
    },
    {
      id: 'media-video-meta',
      title: 'VideoMeta',
      category: 'Domain',
      abbr: 'VM',
      description: 'Inline metadata strip: view count, like count, duration, and relative publish date.',
      filePath: 'modules/domains/media/video/VideoMeta.tsx',
      sourceCode: `import { VideoMeta } from '@/modules/domains/media/video/VideoMeta';
<VideoMeta video={video} />`,
      variants: [
        {
          title: 'Full meta',
          layout: 'stack',
          preview: (
            <VideoMeta
              video={{
                viewCount: 128400,
                likeCount: 5320,
                publishedAt: new Date('2026-04-15'),
                duration: 3842,
              }}
            />
          ),
          code: `<VideoMeta video={{ viewCount: 128400, likeCount: 5320, publishedAt: date, duration: 3842 }} />`,
        },
        {
          title: 'Views and date only',
          layout: 'stack',
          preview: (
            <VideoMeta
              video={{
                viewCount: 2340000,
                publishedAt: new Date('2026-04-20'),
              }}
            />
          ),
          code: `<VideoMeta video={{ viewCount: 2340000, publishedAt: date }} />`,
        },
      ],
    },
    {
      id: 'media-channel-stats-card',
      title: 'ChannelStatsCard',
      category: 'Domain',
      abbr: 'CS',
      description: 'Creator dashboard tile: 4 KPI metrics with deltas (subscribers, views, watch time, videos).',
      filePath: 'modules/domains/media/channel/ChannelStatsCard.tsx',
      sourceCode: `import { ChannelStatsCard } from '@/modules/domains/media/channel/ChannelStatsCard';
<ChannelStatsCard channelName="..." stats={[{ metric: 'views', value: 1_242_000, deltaPct: 12.8 }]} />`,
      variants: [
        {
          title: 'All four KPIs',
          layout: 'stack',
          preview: (
            <ChannelStatsCard
              channelName="CodeWithAlex"
              stats={[
                { metric: 'subscribers', value: 482_000, deltaPct: 4.2, helper: 'vs prev' },
                { metric: 'views', value: 1_242_000, deltaPct: 12.8, helper: 'vs prev' },
                { metric: 'watchTime', value: 48_220, deltaPct: 6.9, helper: 'hours' },
                { metric: 'videos', value: 214, deltaPct: 1.2, helper: 'new' },
              ]}
            />
          ),
          code: `<ChannelStatsCard channelName="CodeWithAlex" stats={[...]} />`,
        },
        {
          title: 'Negative deltas',
          layout: 'stack',
          preview: (
            <ChannelStatsCard
              channelName="WanderFar"
              period="Last 7 days"
              stats={[
                { metric: 'subscribers', value: 728_000, deltaPct: -0.6 },
                { metric: 'views', value: 184_000, deltaPct: -8.2 },
              ]}
            />
          ),
          code: `<ChannelStatsCard channelName="WanderFar" period="Last 7 days" stats={[{ metric: 'subscribers', value: 728000, deltaPct: -0.6 }, { metric: 'views', value: 184000, deltaPct: -8.2 }]} />`,
        },
      ],
    },
    {
      id: 'media-video-performance-row',
      title: 'VideoPerformanceRow',
      category: 'Domain',
      abbr: 'VP',
      description: 'Dashboard row for a single video: thumbnail, title + status, views, watch time, CTR delta.',
      filePath: 'modules/domains/media/video/VideoPerformanceRow.tsx',
      sourceCode: `import { VideoPerformanceRow } from '@/modules/domains/media/video/VideoPerformanceRow';
<VideoPerformanceRow title="..." status="PUBLISHED" views={128400} watchTimeHours={12420} ctrPct={8.4} deltaPct={12.3} />`,
      variants: [
        {
          title: 'Trending up',
          layout: 'stack',
          preview: (
            <VideoPerformanceRow
              thumbnailUrl="https://picsum.photos/seed/video1/640/360"
              title="Next.js 16 App Router — Complete Beginner Guide"
              status="PUBLISHED"
              publishedAt={new Date('2026-04-15')}
              views={128_400}
              watchTimeHours={12_420}
              ctrPct={8.4}
              deltaPct={12.3}
              href="#"
            />
          ),
          code: `<VideoPerformanceRow title="..." views={128400} watchTimeHours={12420} ctrPct={8.4} deltaPct={12.3} />`,
        },
        {
          title: 'Trending down',
          layout: 'stack',
          preview: (
            <VideoPerformanceRow
              thumbnailUrl="https://picsum.photos/seed/video2/640/360"
              title="TypeScript 5 Decorators — Everything You Need to Know"
              status="PUBLISHED"
              publishedAt={new Date('2026-03-28')}
              views={84_200}
              watchTimeHours={7_510}
              ctrPct={6.1}
              deltaPct={-3.4}
            />
          ),
          code: `<VideoPerformanceRow title="..." views={84200} ctrPct={6.1} deltaPct={-3.4} />`,
        },
      ],
    },
    {
      id: 'media-watch-time-chart',
      title: 'WatchTimeChart',
      category: 'Domain',
      abbr: 'WT',
      description: 'Smooth area chart showing daily watch hours over a period. Used in Creator Studio.',
      filePath: 'modules/domains/media/chart/WatchTimeChart.tsx',
      sourceCode: `import { WatchTimeChart } from '@/modules/domains/media/chart/WatchTimeChart';
<WatchTimeChart data={[{ date: 'Apr 20', hours: 4120 }]} />`,
      variants: [
        {
          title: '8-day window',
          layout: 'stack',
          preview: (
            <WatchTimeChart
              data={[
                { date: 'Apr 20', hours: 4120 },
                { date: 'Apr 21', hours: 4560 },
                { date: 'Apr 22', hours: 5230 },
                { date: 'Apr 23', hours: 4980 },
                { date: 'Apr 24', hours: 6310 },
                { date: 'Apr 25', hours: 7240 },
                { date: 'Apr 26', hours: 6920 },
                { date: 'Apr 27', hours: 8410 },
              ]}
            />
          ),
          code: `<WatchTimeChart data={[{ date: 'Apr 20', hours: 4120 }, ...]} />`,
        },
        {
          title: 'Custom title',
          layout: 'stack',
          preview: (
            <WatchTimeChart
              title="Subscriber growth"
              subtitle="Cumulative subs · last 6 days"
              data={[
                { date: 'Mon', hours: 1200 },
                { date: 'Tue', hours: 1350 },
                { date: 'Wed', hours: 1420 },
                { date: 'Thu', hours: 1580 },
                { date: 'Fri', hours: 1610 },
                { date: 'Sat', hours: 1740 },
              ]}
            />
          ),
          code: `<WatchTimeChart title="Subscriber growth" subtitle="..." data={[...]} />`,
        },
      ],
    },
    {
      id: 'media-playlist-header-card',
      title: 'PlaylistHeaderCard',
      category: 'Domain',
      abbr: 'PH',
      description: 'Playlist hero: cover image, visibility badge, total duration, owner channel, play / shuffle.',
      filePath: 'modules/domains/media/playlist/PlaylistHeaderCard.tsx',
      sourceCode: `import { PlaylistHeaderCard } from '@/modules/domains/media/playlist/PlaylistHeaderCard';
<PlaylistHeaderCard title="..." videoCount={3} totalDurationSeconds={12000} channel={{ name, handle }} />`,
      variants: [
        {
          title: 'Public playlist',
          layout: 'stack',
          preview: (
            <PlaylistHeaderCard
              title="Modern Full-Stack with Next.js"
              description="Everything you need to ship a production-grade Next.js app: routing, data fetching, type safety, and deploy."
              coverUrl="https://picsum.photos/seed/playlist1/800/450"
              videoCount={3}
              totalDurationSeconds={12012}
              visibility="PUBLIC"
              channel={{
                name: 'CodeWithAlex',
                handle: 'codewithAlex',
                avatarUrl: 'https://picsum.photos/seed/channel1/100/100',
                verified: true,
              }}
            />
          ),
          code: `<PlaylistHeaderCard title="..." videoCount={3} totalDurationSeconds={12012} channel={{ name, handle, verified: true }} />`,
        },
        {
          title: 'Unlisted, no cover',
          layout: 'stack',
          preview: (
            <PlaylistHeaderCard
              title="Travel Smarter, Not Pricier"
              description="Budget guides and safety tips from 30+ countries."
              videoCount={3}
              totalDurationSeconds={6370}
              visibility="UNLISTED"
              channel={{
                name: 'WanderFar',
                handle: 'wanderfar',
                verified: true,
              }}
            />
          ),
          code: `<PlaylistHeaderCard title="..." visibility="UNLISTED" videoCount={3} totalDurationSeconds={6370} channel={{ name, handle }} />`,
        },
      ],
    },
    {
      id: 'media-playlist-video-row',
      title: 'PlaylistVideoRow',
      category: 'Domain',
      abbr: 'PR',
      description: 'Numbered playlist row: position, thumbnail with duration, title, channel, now-playing state.',
      filePath: 'modules/domains/media/playlist/PlaylistVideoRow.tsx',
      sourceCode: `import { PlaylistVideoRow } from '@/modules/domains/media/playlist/PlaylistVideoRow';
<PlaylistVideoRow position={1} title="..." channelName="..." duration={3842} isPlaying />`,
      variants: [
        {
          title: 'Now playing + idle',
          layout: 'stack',
          preview: (
            <div className="flex flex-col gap-1 w-full max-w-2xl">
              <PlaylistVideoRow
                position={1}
                title="Next.js 16 App Router — Complete Beginner Guide"
                channelName="CodeWithAlex"
                channelVerified
                thumbnailUrl="https://picsum.photos/seed/video1/640/360"
                duration={3842}
                isPlaying
                href="#"
              />
              <PlaylistVideoRow
                position={2}
                title="TypeScript 5 Decorators — Everything You Need to Know"
                channelName="CodeWithAlex"
                channelVerified
                thumbnailUrl="https://picsum.photos/seed/video2/640/360"
                duration={2710}
                href="#"
              />
              <PlaylistVideoRow
                position={3}
                title="Building a Full-Stack App with Prisma and tRPC"
                channelName="CodeWithAlex"
                channelVerified
                thumbnailUrl="https://picsum.photos/seed/video3/640/360"
                duration={5460}
                href="#"
              />
            </div>
          ),
          code: `<PlaylistVideoRow position={1} title="..." channelName="..." duration={3842} isPlaying />`,
        },
        {
          title: 'Draggable (reorderable)',
          layout: 'stack',
          preview: (
            <div className="flex flex-col gap-1 w-full max-w-2xl">
              <PlaylistVideoRow
                position={1}
                title="Authentic Neapolitan Pizza at Home — Step by Step"
                channelName="ChefMarco"
                thumbnailUrl="https://picsum.photos/seed/video7/640/360"
                duration={1560}
                draggable
              />
              <PlaylistVideoRow
                position={2}
                title="Risotto Masterclass — Techniques Every Cook Should Know"
                channelName="ChefMarco"
                thumbnailUrl="https://picsum.photos/seed/video8/640/360"
                duration={2240}
                draggable
              />
            </div>
          ),
          code: `<PlaylistVideoRow position={1} title="..." channelName="..." draggable />`,
        },
      ],
    },
  ];
}
