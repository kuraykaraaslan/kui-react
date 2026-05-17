import { Avatar } from '@/modules/ui/Avatar';
import { Button } from '@/modules/ui/Button';
import { PostCard } from '@/modules/domains/social/post/PostCard';
import { SocialProfileCard } from '@/modules/domains/social/profile/SocialProfileCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faLink, faHashtag, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import {
  ME,
  FEED_POSTS,
  SUGGESTED_USERS,
  TRENDING_TAGS,
} from './social.data';

function formatTagCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function SocialFeedPage() {
  return (
    <div className="flex gap-0">

      {/* ── Feed column ── */}
      <div className="flex-1 min-w-0 border-r border-border bg-surface-base">

        {/* Compose bar */}
        <div className="sticky top-0 z-10 bg-surface-base/90 backdrop-blur-sm border-b border-border px-4 py-3">
          <h1 className="text-base font-bold text-text-primary">Home</h1>
        </div>

        {/* New post composer */}
        <div className="border-b border-border px-4 py-3 bg-surface-base">
          <div className="flex gap-3">
            <Avatar src={ME.avatar ?? undefined} name={ME.name} size="md" />
            <div className="flex-1 min-w-0">
              <input
                type="text"
                placeholder="What's on your mind?"
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none py-2 border-b border-border focus:border-primary transition-colors"
                aria-label="New post content"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1">
                  {[faImage, faVideo, faLink].map((icon, i) => (
                    <button
                      key={i}
                      type="button"
                      className="p-2 rounded-full text-primary hover:bg-primary-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                      aria-label={['Attach image', 'Attach video', 'Add link'][i]}
                    >
                      <FontAwesomeIcon icon={icon} className="w-4 h-4" aria-hidden="true" />
                    </button>
                  ))}
                </div>
                <Button variant="primary" size="sm">Post</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="divide-y divide-border">
          {FEED_POSTS.map((post) => (
            <div key={post.postId} className="px-4 py-3">
              <PostCard post={post} />
            </div>
          ))}
        </div>

        {/* Padding for mobile bottom nav */}
        <div className="h-20 lg:hidden" />
      </div>

      {/* ── Right sidebar ── */}
      <aside className="hidden xl:block w-80 shrink-0 px-5 py-4 space-y-6">

        {/* Trending */}
        <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <FontAwesomeIcon icon={faArrowTrendUp} className="w-4 h-4 text-primary" aria-hidden="true" />
            <h2 className="text-sm font-bold text-text-primary">Trending</h2>
          </div>
          <div className="divide-y divide-border">
            {TRENDING_TAGS.map((t) => (
              <a
                key={t.tag}
                href="/theme/social"
                className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary flex items-center gap-1">
                    <FontAwesomeIcon icon={faHashtag} className="w-3 h-3 text-primary" aria-hidden="true" />
                    {t.tag}
                  </p>
                  <p className="text-xs text-text-secondary">{formatTagCount(t.postCount)} posts</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Suggested users */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-text-primary px-1">Who to follow</h2>
          {SUGGESTED_USERS.map((user) => (
            <SocialProfileCard key={user.userId} user={user} />
          ))}
        </div>
      </aside>
    </div>
  );
}
