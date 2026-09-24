'use client';
import Link from 'next/link';
import { AppShell } from '@/modules/app/AppShell';
import { ChatConversationSidebar } from '@/modules/domains/ai/chat/ChatConversationSidebar';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { CHAT_SESSIONS } from './ai.data';

export default function AIThemeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      className="dark"
      mainClassName="p-0 sm:p-0 overflow-hidden"
      mobileSidebarTitle="Umay"
      logo={
        <div className="flex items-center justify-between w-full gap-2">
          <Link href="/theme/ai" className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-fg">
              <FontAwesomeIcon icon={faRobot} className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="text-sm font-bold text-text-primary truncate">Umay</span>
          </Link>
          <Button variant="ghost" size="xs" iconOnly aria-label="New chat" as="a" href="/theme/ai">
            <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      }
      sidebar={<ChatConversationSidebar sessions={CHAT_SESSIONS} />}
      topbar={
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-semibold text-text-primary">Umay</span>
          <Button variant="ghost" size="xs" iconOnly aria-label="New chat" as="a" href="/theme/ai">
            <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
