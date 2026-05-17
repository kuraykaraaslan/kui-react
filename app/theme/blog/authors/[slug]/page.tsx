import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { AuthorBioCard } from '@/modules/domains/blog/author/AuthorBioCard';
import { TopicCloud, type TopicCloudItem } from '@/modules/domains/blog/author/TopicCloud';
import { AuthorStatsRow } from '@/modules/domains/blog/author/AuthorStatsRow';
import { PostCard } from '@/modules/domains/blog/post/PostCard';
import { BLOG_AUTHORS, BLOG_POSTS } from '../../blog.data';

export async function generateStaticParams() {
  return BLOG_AUTHORS.map((a) => ({ slug: a.userProfile?.username ?? a.userId }));
}

function aggregateTopics(posts: typeof BLOG_POSTS): TopicCloudItem[] {
  const counts: Record<string, number> = {};
  for (const p of posts) {
    for (const kw of p.keywords ?? []) {
      counts[kw] = (counts[kw] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count, href: `/theme/blog/archive?topic=${encodeURIComponent(label)}` }))
    .sort((a, b) => b.count - a.count);
}

export default async function BlogAuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = BLOG_AUTHORS.find(
    (a) => a.userProfile?.username === slug || a.userId === slug,
  );
  if (!author) return notFound();

  const profile = author.userProfile;
  const authorPosts = BLOG_POSTS.filter((p) => p.authorId === author.userId);
  const totalViews = authorPosts.reduce((sum, p) => sum + (p.views ?? 0), 0);
  const topics = aggregateTopics(authorPosts);

  return (
    <main id="main-content" className="mx-auto max-w-5xl px-6 py-10 space-y-10">
      <Breadcrumb
        items={[
          { label: 'Blog', href: '/theme/blog' },
          { label: 'Authors', href: '/theme/blog' },
          { label: profile?.name ?? 'Author' },
        ]}
      />

      <AuthorBioCard
        name={profile?.name ?? 'Anonymous'}
        username={profile?.username ?? undefined}
        avatar={profile?.profilePicture ?? null}
        biography={profile?.biography ?? null}
        role="Senior Contributor"
        verified
        joinedAt={authorPosts[0]?.createdAt ?? new Date('2024-08-10')}
        socials={{
          twitter:  `https://x.com/${profile?.username ?? 'jnolan'}`,
          linkedin: `https://linkedin.com/in/${profile?.username ?? 'jnolan'}`,
          github:   `https://github.com/${profile?.username ?? 'jnolan'}`,
          website:  'https://example.com',
          email:    author.email,
        }}
      />

      <AuthorStatsRow
        stats={{
          posts: authorPosts.length,
          views: totalViews,
          comments: authorPosts.length * 14,
          likes: Math.round(totalViews * 0.18),
          followers: 1280,
        }}
      />

      <section aria-labelledby="topics">
        <h2 id="topics" className="text-lg font-bold text-text-primary mb-3">
          Topics
        </h2>
        {topics.length > 0 ? (
          <TopicCloud topics={topics} />
        ) : (
          <p className="text-sm text-text-secondary">No topics yet.</p>
        )}
      </section>

      <section aria-labelledby="posts">
        <h2 id="posts" className="text-lg font-bold text-text-primary mb-4">
          Recent posts
        </h2>
        {authorPosts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {authorPosts.map((post) => (
              <PostCard key={post.postId} post={post} href={`/theme/blog/${post.slug}`} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No posts yet.</p>
        )}
      </section>
    </main>
  );
}
