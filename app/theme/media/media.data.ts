export type MediaChannel = {
  channelId: string;
  name: string;
  handle: string;
  description: string;
  avatarUrl: string;
  subscriberCount: number;
  videoCount: number;
  verified: boolean;
};

export type MediaVideo = {
  videoId: string;
  channelId: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  duration: number; // seconds
  viewCount: number;
  likeCount: number;
  status: 'PUBLISHED' | 'DRAFT' | 'PRIVATE';
  category: string;
  publishedAt: Date;
};

export const CHANNELS: MediaChannel[] = [
  {
    channelId: 'ch-01',
    name: 'CodeWithAlex',
    handle: 'codewithAlex',
    description: 'Deep dives into web development, TypeScript, and modern frameworks. New videos every week.',
    avatarUrl: 'https://picsum.photos/seed/channel1/100/100',
    subscriberCount: 482000,
    videoCount: 214,
    verified: true,
  },
  {
    channelId: 'ch-02',
    name: 'NexusGaming',
    handle: 'nexusgaming',
    description: 'Speedruns, walkthroughs, and live commentary for the hottest games. Join the squad.',
    avatarUrl: 'https://picsum.photos/seed/channel2/100/100',
    subscriberCount: 1240000,
    videoCount: 876,
    verified: true,
  },
  {
    channelId: 'ch-03',
    name: 'ChefMarco',
    handle: 'chefmarco',
    description: 'Italian home cooking made easy. Simple recipes, fresh ingredients, incredible results.',
    avatarUrl: 'https://picsum.photos/seed/channel3/100/100',
    subscriberCount: 315000,
    videoCount: 189,
    verified: false,
  },
  {
    channelId: 'ch-04',
    name: 'WanderFar',
    handle: 'wanderfar',
    description: 'Budget travel guides, destination reviews, and hidden gems from around the world.',
    avatarUrl: 'https://picsum.photos/seed/channel4/100/100',
    subscriberCount: 728000,
    videoCount: 342,
    verified: true,
  },
];

export const VIDEOS: MediaVideo[] = [
  {
    videoId: 'v-01',
    channelId: 'ch-01',
    title: 'Next.js 16 App Router — Complete Beginner Guide',
    slug: 'nextjs-16-app-router-complete-guide',
    thumbnailUrl: 'https://picsum.photos/seed/video1/640/360',
    duration: 3842,
    viewCount: 128400,
    likeCount: 5320,
    status: 'PUBLISHED',
    category: 'Technology',
    publishedAt: new Date('2026-04-15'),
  },
  {
    videoId: 'v-02',
    channelId: 'ch-01',
    title: 'TypeScript 5 Decorators — Everything You Need to Know',
    slug: 'typescript-5-decorators-guide',
    thumbnailUrl: 'https://picsum.photos/seed/video2/640/360',
    duration: 2710,
    viewCount: 84200,
    likeCount: 3900,
    status: 'PUBLISHED',
    category: 'Technology',
    publishedAt: new Date('2026-03-28'),
  },
  {
    videoId: 'v-03',
    channelId: 'ch-01',
    title: 'Building a Full-Stack App with Prisma and tRPC',
    slug: 'full-stack-prisma-trpc',
    thumbnailUrl: 'https://picsum.photos/seed/video3/640/360',
    duration: 5460,
    viewCount: 62100,
    likeCount: 2870,
    status: 'PUBLISHED',
    category: 'Technology',
    publishedAt: new Date('2026-02-10'),
  },
  {
    videoId: 'v-04',
    channelId: 'ch-02',
    title: 'Elden Ring DLC — Full Boss Rush Speedrun World Record Attempt',
    slug: 'elden-ring-dlc-speedrun-world-record',
    thumbnailUrl: 'https://picsum.photos/seed/video4/640/360',
    duration: 7215,
    viewCount: 2340000,
    likeCount: 98400,
    status: 'PUBLISHED',
    category: 'Gaming',
    publishedAt: new Date('2026-04-20'),
  },
  {
    videoId: 'v-05',
    channelId: 'ch-02',
    title: 'Hollow Knight Silksong — Day One Blind Playthrough Part 1',
    slug: 'hollow-knight-silksong-day-one',
    thumbnailUrl: 'https://picsum.photos/seed/video5/640/360',
    duration: 4890,
    viewCount: 1820000,
    likeCount: 76300,
    status: 'PUBLISHED',
    category: 'Gaming',
    publishedAt: new Date('2026-04-01'),
  },
  {
    videoId: 'v-06',
    channelId: 'ch-02',
    title: 'Top 10 Indie Games You Must Play in 2026',
    slug: 'top-10-indie-games-2026',
    thumbnailUrl: 'https://picsum.photos/seed/video6/640/360',
    duration: 1820,
    viewCount: 943000,
    likeCount: 41200,
    status: 'PUBLISHED',
    category: 'Gaming',
    publishedAt: new Date('2026-03-05'),
  },
  {
    videoId: 'v-07',
    channelId: 'ch-03',
    title: 'Authentic Neapolitan Pizza at Home — Step by Step',
    slug: 'authentic-neapolitan-pizza-home',
    thumbnailUrl: 'https://picsum.photos/seed/video7/640/360',
    duration: 1560,
    viewCount: 412000,
    likeCount: 18700,
    status: 'PUBLISHED',
    category: 'Cooking',
    publishedAt: new Date('2026-04-08'),
  },
  {
    videoId: 'v-08',
    channelId: 'ch-03',
    title: 'Risotto Masterclass — Techniques Every Cook Should Know',
    slug: 'risotto-masterclass',
    thumbnailUrl: 'https://picsum.photos/seed/video8/640/360',
    duration: 2240,
    viewCount: 285000,
    likeCount: 12400,
    status: 'PUBLISHED',
    category: 'Cooking',
    publishedAt: new Date('2026-03-18'),
  },
  {
    videoId: 'v-09',
    channelId: 'ch-03',
    title: '5 Classic Italian Sauces — One Video, All the Secrets',
    slug: '5-classic-italian-sauces',
    thumbnailUrl: 'https://picsum.photos/seed/video9/640/360',
    duration: 3010,
    viewCount: 198000,
    likeCount: 9800,
    status: 'PUBLISHED',
    category: 'Cooking',
    publishedAt: new Date('2026-02-25'),
  },
  {
    videoId: 'v-10',
    channelId: 'ch-04',
    title: 'Kyoto on $50 a Day — Complete Budget Travel Guide',
    slug: 'kyoto-50-dollars-budget-guide',
    thumbnailUrl: 'https://picsum.photos/seed/video10/640/360',
    duration: 2940,
    viewCount: 724000,
    likeCount: 31200,
    status: 'PUBLISHED',
    category: 'Travel',
    publishedAt: new Date('2026-04-12'),
  },
  {
    videoId: 'v-11',
    channelId: 'ch-04',
    title: 'Hidden Gems of Lisbon — Places Tourists Miss',
    slug: 'hidden-gems-lisbon',
    thumbnailUrl: 'https://picsum.photos/seed/video11/640/360',
    duration: 1980,
    viewCount: 538000,
    likeCount: 24600,
    status: 'PUBLISHED',
    category: 'Travel',
    publishedAt: new Date('2026-03-22'),
  },
  {
    videoId: 'v-12',
    channelId: 'ch-04',
    title: 'Solo Travel Safety Tips — What I Learned in 30 Countries',
    slug: 'solo-travel-safety-tips',
    thumbnailUrl: 'https://picsum.photos/seed/video12/640/360',
    duration: 1450,
    viewCount: 892000,
    likeCount: 38900,
    status: 'PUBLISHED',
    category: 'Travel',
    publishedAt: new Date('2026-01-30'),
  },
];

export const CATEGORIES = ['Technology', 'Gaming', 'Cooking', 'Travel', 'Music', 'Education'];

export const FEATURED_VIDEO = VIDEOS[3]; // Elden Ring speedrun — most views

/* ─── Creator Studio sample data ─── */

export type StudioVideoStat = {
  videoId: string;
  ctrPct: number;
  watchTimeHours: number;
  deltaPct: number;
};

export const STUDIO_VIDEO_STATS: StudioVideoStat[] = [
  { videoId: 'v-01', ctrPct: 8.4, watchTimeHours: 12420, deltaPct: 12.3 },
  { videoId: 'v-02', ctrPct: 6.1, watchTimeHours: 7510,  deltaPct: -3.4 },
  { videoId: 'v-03', ctrPct: 5.7, watchTimeHours: 6200,  deltaPct: 2.1 },
  { videoId: 'v-04', ctrPct: 11.2, watchTimeHours: 184_000, deltaPct: 24.8 },
  { videoId: 'v-07', ctrPct: 9.5, watchTimeHours: 32_400, deltaPct: 5.7 },
];

export const STUDIO_WATCH_TIME: { date: string; hours: number }[] = [
  { date: 'Apr 20', hours: 4120 },
  { date: 'Apr 21', hours: 4560 },
  { date: 'Apr 22', hours: 5230 },
  { date: 'Apr 23', hours: 4980 },
  { date: 'Apr 24', hours: 6310 },
  { date: 'Apr 25', hours: 7240 },
  { date: 'Apr 26', hours: 6920 },
  { date: 'Apr 27', hours: 8410 },
];

export const STUDIO_CHANNEL_ID = 'ch-01';

/* ─── Playlists ─── */

export type MediaPlaylist = {
  playlistId: string;
  slug: string;
  channelId: string;
  title: string;
  description: string;
  coverUrl: string;
  visibility: 'PUBLIC' | 'UNLISTED' | 'PRIVATE';
  videoIds: string[];
};

export const PLAYLISTS: MediaPlaylist[] = [
  {
    playlistId: 'pl-01',
    slug: 'modern-fullstack-with-nextjs',
    channelId: 'ch-01',
    title: 'Modern Full-Stack with Next.js',
    description: 'Everything you need to ship a production-grade Next.js app: routing, data fetching, type safety, and deploy.',
    coverUrl: 'https://picsum.photos/seed/playlist1/800/450',
    visibility: 'PUBLIC',
    videoIds: ['v-01', 'v-02', 'v-03'],
  },
  {
    playlistId: 'pl-02',
    slug: 'cozy-italian-cooking-essentials',
    channelId: 'ch-03',
    title: 'Cozy Italian Cooking Essentials',
    description: 'A short masterclass on the techniques and sauces every home cook should know.',
    coverUrl: 'https://picsum.photos/seed/playlist2/800/450',
    visibility: 'PUBLIC',
    videoIds: ['v-07', 'v-08', 'v-09'],
  },
  {
    playlistId: 'pl-03',
    slug: 'travel-smarter-not-pricier',
    channelId: 'ch-04',
    title: 'Travel Smarter, Not Pricier',
    description: 'Budget guides and safety tips from 30+ countries — saved for later viewing.',
    coverUrl: 'https://picsum.photos/seed/playlist3/800/450',
    visibility: 'UNLISTED',
    videoIds: ['v-10', 'v-11', 'v-12'],
  },
];
