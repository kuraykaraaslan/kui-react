'use client';
import { useState } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { VideoCard } from '@/modules/domains/media/video/VideoCard';
import { VIDEOS, CHANNELS, CATEGORIES } from '../media.data';

export default function VideosPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredVideos = VIDEOS.filter((v) => {
    const matchesSearch =
      search.trim() === '' ||
      v.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === null || v.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-surface-base text-text-primary">
      <DocumentTitle text={`Videos — ${THEME_TITLES.media}`} />
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Videos</h1>
          <p className="text-text-secondary text-sm mt-1">Browse all videos from your favourite creators</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search videos…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-surface-raised text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-border-focus transition"
              aria-label="Search videos"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${
                activeCategory === null
                  ? 'bg-primary text-primary-fg border-primary'
                  : 'border-border bg-surface-raised text-text-secondary hover:border-border-focus hover:text-text-primary'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-fg border-primary'
                    : 'border-border bg-surface-raised text-text-secondary hover:border-border-focus hover:text-text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filteredVideos.length === 0 ? (
          <div className="py-20 text-center text-text-secondary">
            <p className="text-lg font-medium">No videos found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => {
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
        )}
      </div>
    </div>
  );
}
