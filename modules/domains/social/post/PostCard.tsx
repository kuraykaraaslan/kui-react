'use client';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as faHeartSolid,
  faBookmark as faBookmarkSolid,
  faEllipsis,
  faShare,
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartOutline,
  faComment,
  faBookmark as faBookmarkOutline,
} from '@fortawesome/free-regular-svg-icons';
import { Avatar } from '@/modules/ui/Avatar';
import { PostPrivacyBadge } from './PostPrivacyBadge';
import type { PostWithAuthor } from '@/modules/domains/social/types';

function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60)   return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type PostCardProps = {
  post: PostWithAuthor;
  className?: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
};

export function PostCard({ post, className, onLike, onComment, onShare, onBookmark }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked);

  function handleLike() {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    onLike?.(post.postId);
  }

  function handleBookmark() {
    setBookmarked((v) => !v);
    onBookmark?.(post.postId);
  }

  const { author } = post;
  const mediaUrls = post.mediaUrls ?? [];

  return (
    <article
      className={cn(
        'bg-surface-raised border border-border rounded-xl overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <Avatar
          src={author.avatar ?? undefined}
          name={author.name}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <Link
              href={`/theme/social/profile/${author.userId}`}
              className="font-semibold text-text-primary text-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
            >
              {author.name}
            </Link>
            {author.isVerified && (
              <span className="text-primary text-xs" title="Verified">✓</span>
            )}
            <span className="text-text-secondary text-xs">@{author.username}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-0.5">
            {post.createdAt && <span>{formatRelativeTime(post.createdAt)}</span>}
            <span>·</span>
            <PostPrivacyBadge privacy={post.privacy} />
          </div>
        </div>
        <button
          type="button"
          className="p-1.5 rounded-full text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          aria-label="More options"
        >
          <FontAwesomeIcon icon={faEllipsis} className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Content */}
      {post.content && (
        <p className="px-4 pb-3 text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* Media grid */}
      {mediaUrls.length > 0 && (
        <div
          className={cn(
            'grid gap-0.5 overflow-hidden',
            mediaUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          )}
        >
          {mediaUrls.slice(0, 4).map((url, i) => (
            <div
              key={i}
              className={cn(
                'relative bg-surface-sunken overflow-hidden',
                mediaUrls.length === 1 ? 'aspect-[16/9]' : 'aspect-square',
                mediaUrls.length === 3 && i === 0 ? 'row-span-2' : ''
              )}
            >
              <img src={url} alt="" className="w-full h-full object-cover" aria-hidden="true" />
              {i === 3 && mediaUrls.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">+{mediaUrls.length - 4}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-2 border-t border-border">
        {/* Like */}
        <button
          type="button"
          onClick={handleLike}
          aria-pressed={liked}
          aria-label={liked ? 'Unlike' : 'Like'}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            liked
              ? 'text-error bg-error-subtle hover:bg-error/10'
              : 'text-text-secondary hover:bg-surface-overlay hover:text-error'
          )}
        >
          <FontAwesomeIcon icon={liked ? faHeartSolid : faHeartOutline} className="w-4 h-4" aria-hidden="true" />
          {likeCount > 0 && <span>{formatCount(likeCount)}</span>}
        </button>

        {/* Comment */}
        <button
          type="button"
          onClick={() => onComment?.(post.postId)}
          aria-label="Comment"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-text-secondary hover:bg-surface-overlay hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <FontAwesomeIcon icon={faComment} className="w-4 h-4" aria-hidden="true" />
          {post.commentCount > 0 && <span>{formatCount(post.commentCount)}</span>}
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={() => onShare?.(post.postId)}
          aria-label="Share"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-text-secondary hover:bg-surface-overlay hover:text-success transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <FontAwesomeIcon icon={faShare} className="w-4 h-4" aria-hidden="true" />
          {post.shareCount > 0 && <span>{formatCount(post.shareCount)}</span>}
        </button>

        {/* Bookmark */}
        <button
          type="button"
          onClick={handleBookmark}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ml-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
            bookmarked
              ? 'text-primary bg-primary-subtle hover:bg-primary/10'
              : 'text-text-secondary hover:bg-surface-overlay hover:text-primary'
          )}
        >
          <FontAwesomeIcon icon={bookmarked ? faBookmarkSolid : faBookmarkOutline} className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
