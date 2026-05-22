'use client';
import { useState, useRef, useEffect } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { cn } from '@/libs/utils/cn';
import { Avatar } from '@/modules/ui/Avatar';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { CONVERSATIONS, ME } from '../social.data';
import type { ConversationWithParticipant } from '@/modules/domains/social/types';

type ChatMessage = { id: string; senderId: string; content: string; sentAt: Date };

function buildInitialMessages(conv: ConversationWithParticipant): ChatMessage[] {
  return [
    { id: '1', senderId: conv.participant.userId, content: conv.lastMessage ?? 'Hey there!', sentAt: new Date(Date.now() - 25 * 60 * 1000) },
    { id: '2', senderId: ME.userId, content: 'Thanks, appreciate it!', sentAt: new Date(Date.now() - 20 * 60 * 1000) },
  ];
}

function formatTime(date: Date | null | undefined): string {
  if (!date) return '';
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function MessagesPage() {
  const [selected, setSelected] = useState<ConversationWithParticipant | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) setMessages(buildInitialMessages(selected));
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send() {
    const text = draft.trim();
    if (!text || !selected) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), senderId: ME.userId, content: text, sentAt: new Date() },
    ]);
    setDraft('');
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] lg:h-screen overflow-hidden">
      <DocumentTitle text={`Messages — ${THEME_TITLES.social}`} />

      {/* Conversation list */}
      <div className={cn(
        'w-full lg:w-80 border-r border-border flex flex-col shrink-0',
        selected ? 'hidden lg:flex' : 'flex'
      )}>
        <div className="sticky top-0 bg-surface-base border-b border-border px-4 py-3 flex items-center gap-2">
          <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 text-primary" aria-hidden="true" />
          <h1 className="text-base font-bold text-text-primary">Messages</h1>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {CONVERSATIONS.map((conv) => (
            <button
              key={conv.conversationId}
              type="button"
              onClick={() => setSelected(conv)}
              className={cn(
                'w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                selected?.conversationId === conv.conversationId && 'bg-primary-subtle'
              )}
            >
              <div className="relative shrink-0">
                <Avatar src={conv.participant.avatar ?? undefined} name={conv.participant.name} size="md" />
                {conv.unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full border-2 border-surface-base" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-text-primary truncate">{conv.participant.name}</p>
                  <span className="text-xs text-text-secondary shrink-0">{formatTime(conv.lastMessageAt ?? undefined)}</span>
                </div>
                <p className={cn('text-xs truncate', conv.unreadCount > 0 ? 'text-text-primary font-medium' : 'text-text-secondary')}>
                  {conv.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      <div className={cn('flex-1 flex flex-col min-w-0', !selected ? 'hidden lg:flex' : 'flex')}>
        {selected ? (
          <>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-surface-base border-b border-border px-4 py-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="lg:hidden p-2 rounded-full text-text-secondary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                aria-label="Back to conversations"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" aria-hidden="true" />
              </button>
              <Avatar src={selected.participant.avatar ?? undefined} name={selected.participant.name} size="sm" />
              <div>
                <p className="text-sm font-semibold text-text-primary">{selected.participant.name}</p>
                <p className="text-xs text-text-secondary">@{selected.participant.username}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => {
                const isMine = msg.senderId === ME.userId;
                return (
                  <div key={msg.id} className={cn('flex gap-2.5', isMine ? 'flex-row-reverse' : 'flex-row')}>
                    {!isMine && (
                      <Avatar src={selected.participant.avatar ?? undefined} name={selected.participant.name} size="xs" />
                    )}
                    <div className={cn('max-w-[70%] space-y-1', isMine ? 'items-end' : 'items-start', 'flex flex-col')}>
                      <div className={cn(
                        'px-3.5 py-2 rounded-2xl text-sm leading-relaxed',
                        isMine
                          ? 'bg-primary text-primary-fg rounded-tr-sm'
                          : 'bg-surface-overlay text-text-primary rounded-tl-sm'
                      )}>
                        {msg.content}
                      </div>
                      <span className="text-xs text-text-secondary px-1">
                        {msg.sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Composer */}
            <div className="border-t border-border px-4 py-3">
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex items-center gap-2"
              >
                <Avatar src={ME.avatar ?? undefined} name={ME.name} size="xs" />
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  aria-label="Message"
                  className="flex-1 bg-surface-overlay rounded-full px-4 py-2 text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-border-focus"
                />
                <Button type="submit" variant="primary" size="sm" disabled={!draft.trim()} aria-label="Send">
                  <FontAwesomeIcon icon={faPaperPlane} className="w-3.5 h-3.5" aria-hidden="true" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-secondary gap-3">
            <FontAwesomeIcon icon={faEnvelope} className="w-12 h-12 text-text-disabled" aria-hidden="true" />
            <p className="text-sm font-medium">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
