'use client';
import { use, useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPaperPlane, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';
import { MessageBubble, type MessageDeliveryStatus } from '@/modules/domains/social/message/MessageBubble';
import { TypingIndicator } from '@/modules/domains/social/message/TypingIndicator';
import { ConversationListItem } from '@/modules/domains/social/message/ConversationListItem';

type Conversation = {
  id: string;
  name: string;
  handle?: string;
  online: boolean;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: { id: string; side: 'incoming' | 'outgoing'; body: string; sentAt: string; status?: MessageDeliveryStatus }[];
};

const CONVERSATIONS: Conversation[] = [
  {
    id: 'c-jane',
    name: 'Jane Reeves',
    handle: 'mod_jane',
    online: true,
    lastMessage: 'PM2 with systemd is the cleanest path.',
    lastMessageAt: new Date(Date.now() - 4 * 60_000).toISOString(),
    unreadCount: 2,
    messages: [
      { id: 'm1', side: 'incoming', body: 'Hey — quick question about that VPS deploy thread.', sentAt: new Date(Date.now() - 32 * 60_000).toISOString() },
      { id: 'm2', side: 'outgoing', body: 'Sure! What\'s up?', sentAt: new Date(Date.now() - 30 * 60_000).toISOString(), status: 'read' },
      { id: 'm3', side: 'incoming', body: 'Do you really not run Docker at all? I thought everyone did by now.', sentAt: new Date(Date.now() - 22 * 60_000).toISOString() },
      { id: 'm4', side: 'outgoing', body: 'For small projects, no. The added complexity isn\'t worth it.', sentAt: new Date(Date.now() - 20 * 60_000).toISOString(), status: 'read' },
      { id: 'm5', side: 'outgoing', body: 'Plain Node on Linux is rock solid if you wire it up right.', sentAt: new Date(Date.now() - 19 * 60_000).toISOString(), status: 'read' },
      { id: 'm6', side: 'incoming', body: 'OK that makes sense.', sentAt: new Date(Date.now() - 6 * 60_000).toISOString() },
      { id: 'm7', side: 'incoming', body: 'PM2 with systemd is the cleanest path.', sentAt: new Date(Date.now() - 4 * 60_000).toISOString() },
    ],
  },
  {
    id: 'c-ruth',
    name: 'Ruth Stancev',
    handle: 'rustacean99',
    online: false,
    lastMessage: 'Pushed v0.2 — let me know what you think.',
    lastMessageAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
    unreadCount: 0,
    messages: [
      { id: 'm1', side: 'outgoing', body: 'Awesome work on that kanban board!', sentAt: new Date(Date.now() - 5 * 3600_000).toISOString(), status: 'read' },
      { id: 'm2', side: 'incoming', body: 'Thanks! Pushed v0.2 — let me know what you think.', sentAt: new Date(Date.now() - 3 * 3600_000).toISOString() },
    ],
  },
  {
    id: 'c-design-team',
    name: 'Design team',
    online: false,
    lastMessage: 'Pixel pushed the new tokens to staging.',
    lastMessageAt: new Date(Date.now() - 24 * 3600_000).toISOString(),
    unreadCount: 5,
    messages: [
      { id: 'm1', side: 'incoming', body: 'Pixel pushed the new tokens to staging.', sentAt: new Date(Date.now() - 24 * 3600_000).toISOString() },
    ],
  },
];

export default function ConversationThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const active = CONVERSATIONS.find((c) => c.id === id);
  if (!active) notFound();

  const [draft, setDraft] = useState('');
  const sortedConvs = useMemo(
    () => [...CONVERSATIONS].sort((a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt)),
    [],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <DocumentTitle text={`${active.name} — Messages — ${THEME_TITLES.social}`} />
      <a
        href="/theme/social/messages"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back to inbox
      </a>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr] rounded-xl border border-border bg-surface-base overflow-hidden">
        {/* Sidebar: conversations */}
        <aside className="border-b border-border lg:border-b-0 lg:border-r lg:border-border" aria-label="All conversations">
          <header className="border-b border-border px-3 py-3">
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-2.5 py-1.5 w-full focus-within:ring-2 focus-within:ring-border-focus">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-3 h-3 text-text-secondary" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search…"
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary outline-none"
                aria-label="Search messages"
              />
            </div>
          </header>
          <ol>
            {sortedConvs.map((c) => (
              <ConversationListItem
                key={c.id}
                name={c.name}
                lastMessage={c.lastMessage}
                lastMessageAt={c.lastMessageAt}
                unreadCount={c.unreadCount}
                online={c.online}
                active={c.id === active.id}
                href={`/theme/social/messages/${c.id}`}
              />
            ))}
          </ol>
        </aside>

        {/* Thread */}
        <section className="flex min-h-[60vh] flex-col" aria-label={`Conversation with ${active.name}`}>
          <header className="flex items-center gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">{active.name}</p>
              <p className="text-[11px] text-text-secondary">
                {active.online ? 'Online' : 'Offline'}
                {active.handle && ` · @${active.handle}`}
              </p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {active.messages.map((msg, idx) => {
              const prev = active.messages[idx - 1];
              const grouped = !!prev && prev.side === msg.side && (+new Date(msg.sentAt) - +new Date(prev.sentAt) < 3 * 60_000);
              return (
                <MessageBubble
                  key={msg.id}
                  side={msg.side}
                  authorName={msg.side === 'incoming' ? active.name : undefined}
                  body={msg.body}
                  sentAt={msg.sentAt}
                  status={msg.status}
                  groupedWithPrevious={grouped}
                />
              );
            })}
            {active.online && active.unreadCount > 0 && (
              <TypingIndicator name={active.name} />
            )}
          </div>

          <footer className="border-t border-border px-3 py-3">
            <form
              className="flex items-end gap-2"
              onSubmit={(e) => { e.preventDefault(); setDraft(''); }}
            >
              <label htmlFor="msg-draft" className="sr-only">Message</label>
              <textarea
                id="msg-draft"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${active.name}…`}
                rows={1}
                className="flex-1 resize-none rounded-lg border border-border bg-surface-base px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!draft.trim()}
                iconLeft={<FontAwesomeIcon icon={faPaperPlane} className="w-3.5 h-3.5" aria-hidden="true" />}
              >
                Send
              </Button>
            </form>
          </footer>
        </section>
      </div>
    </div>
  );
}
