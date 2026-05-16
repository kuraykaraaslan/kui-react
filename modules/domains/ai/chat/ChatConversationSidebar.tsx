'use client';
import { AppSidebar, type AppSidebarNavGroup } from '@/modules/app/AppSidebar';
import { Avatar } from '@/modules/ui/Avatar';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import type { AIChatSession } from '../types';

type ChatConversationSidebarProps = {
  sessions: AIChatSession[];
  activeSessionId?: string;
  onSelectSession?: (sessionId: string) => void;
};

const REFERENCE_DATE = new Date('2026-05-09');

function getGroup(date: Date): string {
  const today = REFERENCE_DATE;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const sevenAgo = new Date(today);
  sevenAgo.setDate(today.getDate() - 7);
  const thirtyAgo = new Date(today);
  thirtyAgo.setDate(today.getDate() - 30);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  if (date >= sevenAgo) return 'Previous 7 Days';
  if (date >= thirtyAgo) return 'Previous 30 Days';
  return 'Older';
}

const GROUP_ORDER = ['Today', 'Yesterday', 'Previous 7 Days', 'Previous 30 Days', 'Older'];

export function ChatConversationSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
}: ChatConversationSidebarProps) {
  const grouped: Record<string, AIChatSession[]> = {};
  for (const s of sessions) {
    const date = s.createdAt ? new Date(s.createdAt) : new Date();
    const g = getGroup(date);
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(s);
  }

  const navGroups: AppSidebarNavGroup[] = GROUP_ORDER.filter((g) => grouped[g]?.length).map((g) => ({
    label: g,
    items: grouped[g].map((s) => ({
      id: s.sessionId,
      label: s.title ?? 'New chat',
      href: '/theme/ai/playground',
    })),
  }));

  return (
    <AppSidebar
      navGroups={navGroups}
      activeId={activeSessionId}
      searchable
      onSelect={onSelectSession}
      footer={
        <div className="flex items-center gap-2.5 px-2 py-2 w-full">
          <Avatar name="John Nolan" size="sm" />
          <span className="flex-1 truncate text-sm text-text-primary">jnolan</span>
          <Button variant="ghost" size="xs" iconOnly aria-label="User options">
            <FontAwesomeIcon icon={faEllipsisVertical} className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </div>
      }
    />
  );
}
