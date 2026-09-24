'use client';
import { Badge } from '@/modules/ui/Badge';
import type { PostStatus } from '../types';

const statusMeta: Record<PostStatus, { label: string; variant: 'warning' | 'success' | 'neutral' | 'info' }> = {
  DRAFT:     { label: 'Draft',      variant: 'warning' },
  PUBLISHED: { label: 'Published',  variant: 'success' },
  ARCHIVED:  { label: 'Archived',   variant: 'neutral' },
  SCHEDULED: { label: 'Scheduled',  variant: 'info'    },
};

type PostStatusBadgeProps = {
  status: PostStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function PostStatusBadge({ status, size = 'md', className }: PostStatusBadgeProps) {
  const meta = statusMeta[status] ?? { label: status, variant: 'neutral' as const };
  return (
    <Badge variant={meta.variant} size={size} dot className={className}>
      {meta.label}
    </Badge>
  );
}
