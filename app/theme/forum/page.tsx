import type { Metadata } from 'next';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderOpen,
  faFolder,
  faLock,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FORUM_CATEGORIES, CATEGORY_GROUPS, TOPICS } from './forum.data';

export const metadata: Metadata = {
  title: { absolute: THEME_TITLES.forum },
};

function formatLastPost(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date('2026-05-09T12:00:00Z');
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (diffDays === 0) return `Today ${time}`;
  if (diffDays === 1) return `Yesterday ${time}`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ForumHomePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-xs text-text-secondary mb-3">
        <span className="font-medium text-text-primary">Board index</span>
      </div>

      {/* Action */}
      <div className="flex justify-end mb-3">
        <Button
          as="a"
          href="/theme/forum"
          variant="primary"
          size="xs"
          iconLeft={<FontAwesomeIcon icon={faPenToSquare} className="w-3 h-3" aria-hidden="true" />}
        >
          New Topic
        </Button>
      </div>

      {/* Board index groups */}
      <div className="space-y-3">
        {CATEGORY_GROUPS.map((group) => {
          const categories = FORUM_CATEGORIES.filter((c) =>
            group.categoryIds.includes(c.categoryId)
          );

          return (
            <div key={group.groupId} className="border border-border rounded overflow-hidden">
              {/* Group header */}
              <div className="bg-primary text-primary-fg px-3 py-2 flex items-center">
                <span className="text-sm font-bold uppercase tracking-wide">{group.title}</span>
              </div>

              {/* Column headers */}
              <div className="bg-surface-overlay border-b border-border grid grid-cols-[1fr_auto_auto_auto] text-xs font-semibold text-text-secondary uppercase tracking-wide">
                <div className="px-3 py-1.5">Forum</div>
                <div className="px-3 py-1.5 text-center w-16 hidden sm:block">Topics</div>
                <div className="px-3 py-1.5 text-center w-16 hidden sm:block">Posts</div>
                <div className="px-3 py-1.5 w-48 hidden md:block">Last post</div>
              </div>

              {/* Forum rows */}
              {categories.map((cat, i) => {
                const lastTopic = TOPICS
                  .filter((t) => t.categoryId === cat.categoryId)
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

                return (
                  <div
                    key={cat.categoryId}
                    className={`grid grid-cols-[1fr_auto_auto_auto] border-b border-border last:border-b-0 text-xs ${
                      i % 2 === 0 ? 'bg-surface-base' : 'bg-surface-raised'
                    }`}
                  >
                    {/* Forum name + description */}
                    <div className="px-3 py-2.5 flex items-start gap-2.5 min-w-0">
                      <FontAwesomeIcon
                        icon={faFolderOpen}
                        className="w-4 h-4 text-primary mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <a
                          href={`/theme/forum/topics?category=${cat.slug}`}
                          className="font-semibold text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
                        >
                          {cat.title}
                        </a>
                        <p className="text-text-secondary mt-0.5 leading-snug">{cat.description}</p>
                        {cat.moderators && (
                          <p className="text-text-disabled mt-1">
                            Moderators:{' '}
                            {cat.moderators.map((mod, mi) => (
                              <span key={mod}>
                                <a href="/theme/forum" className="text-text-secondary hover:text-primary hover:underline">
                                  {mod}
                                </a>
                                {mi < cat.moderators!.length - 1 && ', '}
                              </span>
                            ))}
                          </p>
                        )}
                        <p className="sm:hidden text-text-disabled mt-1">
                          {cat.topicCount.toLocaleString()} topics &bull; {cat.postCount.toLocaleString()} posts
                        </p>
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="px-3 py-2.5 text-center text-text-secondary w-16 hidden sm:flex items-center justify-center">
                      {cat.topicCount.toLocaleString()}
                    </div>

                    {/* Posts */}
                    <div className="px-3 py-2.5 text-center text-text-secondary w-16 hidden sm:flex items-center justify-center">
                      {cat.postCount.toLocaleString()}
                    </div>

                    {/* Last post */}
                    <div className="px-3 py-2.5 text-text-secondary w-48 hidden md:flex items-start">
                      {lastTopic ? (
                        <div>
                          <a
                            href={`/theme/forum/topics/${lastTopic.slug}`}
                            className="text-primary hover:underline font-medium line-clamp-1"
                          >
                            {lastTopic.title.length > 30 ? lastTopic.title.slice(0, 30) + '…' : lastTopic.title}
                          </a>
                          <div className="text-text-disabled mt-0.5 leading-snug">
                            {formatLastPost(cat.lastActivityAt)}<br />
                            by{' '}
                            <a href="/theme/forum" className="text-primary hover:underline">
                              {lastTopic.authorName}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <span className="text-text-disabled">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-border text-xs text-text-disabled flex flex-wrap gap-x-5 gap-y-1.5">
        <span className="flex items-center gap-1.5">
          <FontAwesomeIcon icon={faFolderOpen} className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          Contains new posts
        </span>
        <span className="flex items-center gap-1.5">
          <FontAwesomeIcon icon={faFolder} className="w-3.5 h-3.5 text-text-disabled" aria-hidden="true" />
          No new posts
        </span>
        <span className="flex items-center gap-1.5">
          <FontAwesomeIcon icon={faLock} className="w-3.5 h-3.5 text-text-disabled" aria-hidden="true" />
          Forum locked
        </span>
      </div>
    </div>
  );
}
