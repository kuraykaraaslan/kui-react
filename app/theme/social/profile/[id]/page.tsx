import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { SocialProfileCard } from '@/modules/domains/social/profile/SocialProfileCard';
import { PostCard } from '@/modules/domains/social/post/PostCard';
import { USERS, FEED_POSTS, ME } from '../../social.data';

export async function generateStaticParams() {
  return [...USERS.map((u) => ({ id: u.userId })), { id: ME.userId }];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const user = id === ME.userId ? ME : USERS.find((u) => u.userId === id);
  return { title: buildPageTitle(user?.name ?? id, THEME_TITLES.social) };
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = id === ME.userId ? ME : USERS.find((u) => u.userId === id);
  if (!user) notFound();

  const userPosts = FEED_POSTS.filter((p) => p.authorId === user.userId);
  const isOwnProfile = id === ME.userId;

  return (
    <div className="bg-surface-base border-r border-border min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface-base/90 backdrop-blur-sm border-b border-border px-4 py-3">
        <h1 className="text-base font-bold text-text-primary">{user.name}</h1>
        <p className="text-xs text-text-secondary">{user.postCount} posts</p>
      </div>

      {/* Profile card */}
      <SocialProfileCard
        user={user}
        isOwnProfile={isOwnProfile}
        className="rounded-none border-x-0 border-t-0"
      />

      {/* Posts tab (simplified) */}
      <div className="border-b border-border">
        <div className="flex">
          <button
            type="button"
            className="flex-1 py-3 text-sm font-semibold text-primary border-b-2 border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            Posts
          </button>
          <button
            type="button"
            className="flex-1 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            Media
          </button>
          <button
            type="button"
            className="flex-1 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            Likes
          </button>
        </div>
      </div>

      {/* Posts */}
      <div className="divide-y divide-border">
        {userPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
            <p className="text-sm">No posts yet</p>
          </div>
        ) : (
          userPosts.map((post) => (
            <div key={post.postId} className="px-4 py-3">
              <PostCard post={post} />
            </div>
          ))
        )}
      </div>

      {/* Padding for mobile bottom nav */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
