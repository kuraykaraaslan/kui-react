'use client';
import { useState, useId } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faReply,
  faHeart,
  faTrash,
  faPaperPlane,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Avatar } from '@/modules/ui/Avatar';
import { Button } from '@/modules/ui/Button';

export type CommentThreadItem = {
  id: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  body: string;
  createdAt: string | Date;
  likeCount?: number;
  likedByMe?: boolean;
  replies?: CommentThreadItem[];
};

export type CommentThreadProps = {
  comments: CommentThreadItem[];
  currentUserId?: string;
  maxDepth?: number;
  onReply?: (parentId: string | null, body: string) => void | Promise<void>;
  onDelete?: (id: string) => void;
  onLike?: (id: string, liked: boolean) => void;
  formatTimestamp?: (value: string | Date) => string;
  emptyMessage?: string;
  placeholder?: string;
  className?: string;
};

function defaultFormat(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return date.toLocaleDateString();
}

type CommentNodeProps = {
  comment: CommentThreadItem;
  depth: number;
  maxDepth: number;
  currentUserId?: string;
  onReply?: CommentThreadProps['onReply'];
  onDelete?: CommentThreadProps['onDelete'];
  onLike?: CommentThreadProps['onLike'];
  formatTimestamp: (value: string | Date) => string;
  placeholder: string;
};

function CommentNode({
  comment,
  depth,
  maxDepth,
  currentUserId,
  onReply,
  onDelete,
  onLike,
  formatTimestamp,
  placeholder,
}: CommentNodeProps) {
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const replyId = useId();

  const canReply = onReply && depth < maxDepth;
  const isOwn = currentUserId && comment.author.id === currentUserId;

  async function submitReply() {
    if (!draft.trim() || !onReply) return;
    setSubmitting(true);
    try {
      await onReply(comment.id, draft.trim());
      setDraft('');
      setReplying(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <li className="flex gap-3">
      <Avatar src={comment.author.avatarUrl ?? undefined} name={comment.author.name} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="rounded-lg bg-surface-overlay px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-text-primary truncate">
              {comment.author.name}
            </span>
            <time
              dateTime={comment.createdAt instanceof Date ? comment.createdAt.toISOString() : String(comment.createdAt)}
              className="text-xs text-text-disabled shrink-0"
            >
              {formatTimestamp(comment.createdAt)}
            </time>
          </div>
          <p className="mt-1 text-sm text-text-primary whitespace-pre-wrap break-words">
            {comment.body}
          </p>
        </div>

        <div className="mt-1 flex items-center gap-3 px-1 text-xs text-text-secondary">
          {onLike && (
            <button
              type="button"
              onClick={() => onLike(comment.id, !comment.likedByMe)}
              aria-pressed={!!comment.likedByMe}
              className={cn(
                'inline-flex items-center gap-1 transition-colors hover:text-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded',
                comment.likedByMe && 'text-primary',
              )}
            >
              <FontAwesomeIcon icon={faHeart} className="w-3 h-3" aria-hidden="true" />
              {comment.likeCount ?? 0}
            </button>
          )}
          {canReply && (
            <button
              type="button"
              onClick={() => setReplying((v) => !v)}
              aria-expanded={replying}
              className={cn(
                'inline-flex items-center gap-1 transition-colors hover:text-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded',
              )}
            >
              <FontAwesomeIcon icon={faReply} className="w-3 h-3" aria-hidden="true" />
              Reply
            </button>
          )}
          {isOwn && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              className={cn(
                'inline-flex items-center gap-1 ml-auto transition-colors hover:text-error',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded',
              )}
            >
              <FontAwesomeIcon icon={faTrash} className="w-3 h-3" aria-hidden="true" />
              Delete
            </button>
          )}
        </div>

        {replying && (
          <div className="mt-2 flex flex-col gap-2">
            <label htmlFor={replyId} className="sr-only">
              Reply to {comment.author.name}
            </label>
            <textarea
              id={replyId}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={placeholder}
              rows={2}
              className={cn(
                'block w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary',
                'placeholder:text-text-disabled resize-y',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:border-border-focus',
              )}
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReplying(false);
                  setDraft('');
                }}
                iconLeft={<FontAwesomeIcon icon={faXmark} className="w-3 h-3" aria-hidden="true" />}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={submitReply}
                loading={submitting}
                disabled={!draft.trim() || submitting}
                iconLeft={<FontAwesomeIcon icon={faPaperPlane} className="w-3 h-3" aria-hidden="true" />}
              >
                Reply
              </Button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <ul className="mt-3 space-y-3 border-l border-border pl-4">
            {comment.replies.map((child) => (
              <CommentNode
                key={child.id}
                comment={child}
                depth={depth + 1}
                maxDepth={maxDepth}
                currentUserId={currentUserId}
                onReply={onReply}
                onDelete={onDelete}
                onLike={onLike}
                formatTimestamp={formatTimestamp}
                placeholder={placeholder}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function CommentThread({
  comments,
  currentUserId,
  maxDepth = 3,
  onReply,
  onDelete,
  onLike,
  formatTimestamp = defaultFormat,
  emptyMessage = 'No comments yet. Be the first to comment.',
  placeholder = 'Write a comment…',
  className,
}: CommentThreadProps) {
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const rootId = useId();

  async function submitRoot() {
    if (!draft.trim() || !onReply) return;
    setSubmitting(true);
    try {
      await onReply(null, draft.trim());
      setDraft('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={cn('space-y-4', className)} aria-label="Comments">
      {onReply && (
        <div className="flex flex-col gap-2">
          <label htmlFor={rootId} className="sr-only">
            New comment
          </label>
          <textarea
            id={rootId}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className={cn(
              'block w-full rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary',
              'placeholder:text-text-disabled resize-y',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:border-border-focus',
            )}
          />
          <div className="flex items-center justify-end">
            <Button
              onClick={submitRoot}
              loading={submitting}
              disabled={!draft.trim() || submitting}
              iconLeft={<FontAwesomeIcon icon={faPaperPlane} className="w-3.5 h-3.5" aria-hidden="true" />}
            >
              Post Comment
            </Button>
          </div>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-surface-base px-4 py-6 text-center text-sm text-text-secondary">
          {emptyMessage}
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <CommentNode
              key={c.id}
              comment={c}
              depth={0}
              maxDepth={maxDepth}
              currentUserId={currentUserId}
              onReply={onReply}
              onDelete={onDelete}
              onLike={onLike}
              formatTimestamp={formatTimestamp}
              placeholder={placeholder}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
