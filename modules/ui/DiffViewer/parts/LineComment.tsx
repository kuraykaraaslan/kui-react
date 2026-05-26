'use client';
// modules/ui/DiffViewer/parts/LineComment.tsx
//
// M3 STUB — code-review comment thread anchored to a single diff line.
// The component currently renders nothing; the surface is reserved so the
// M3 implementation can land without touching every consumer of the
// DiffViewer module.

import type { Change } from '../types';

type LineCommentProps = {
  // TODO M3: threadId: string;
  // TODO M3: side: 'old' | 'new';
  change?: Change;
  // TODO M3: comments: Array<{ id: string; author: string; body: string; createdAt: string }>;
  // TODO M3: onReply?: (body: string) => Promise<void>;
  // TODO M3: onResolve?: () => Promise<void>;
};

export function LineComment(_props: LineCommentProps) {
  // TODO M3: render avatar + body + actions (reply, resolve, react), plus a
  //          suggestion-mode toggle. For M1 we return null so the JSX tree
  //          stays clean.
  return null;
}
