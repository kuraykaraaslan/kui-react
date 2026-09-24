'use client';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCommentDots,
  faTimes,
  faPaperPlane,
  faUser,
  faRobot,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';

export type ChatMessage = {
  id: string;
  role: 'user' | 'agent';
  text: string;
  timestamp?: string;
};

type ChatBoxProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  initialMessages?: ChatMessage[];
  onSend?: (text: string) => Promise<string> | string;
  className?: string;
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ChatBox({
  title = 'Support Chat',
  subtitle = 'We typically reply in a few minutes',
  placeholder = 'Type a message…',
  initialMessages = [],
  onSend,
  className,
}: ChatBoxProps) {
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Opening the chat marks everything as read.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setUnread(0);
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
      timestamp: formatTime(new Date()),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = onSend
        ? await onSend(text)
        : await new Promise<string>((r) => setTimeout(() => r("Thanks for your message! We’ll get back to you shortly."), 900));

      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'agent',
        text: reply,
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, agentMsg]);
      if (!open) setUnread((n) => n + 1);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function toggleOpen() {
    setOpen((v) => !v);
    if (minimised) setMinimised(false);
  }

  return (
    <div
      className={cn('fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3', className)}
      role="region"
      aria-label="Chat support"
    >
      {/* Chat panel */}
      {open && (
        <div
          className={cn(
            'w-80 sm:w-96 rounded-2xl shadow-2xl border border-border overflow-hidden',
            'bg-surface-base flex flex-col transition-all duration-200',
            minimised ? 'h-14' : 'h-[480px]',
          )}
          aria-live="polite"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-fg flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
              <FontAwesomeIcon icon={faRobot} className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight truncate">{title}</p>
              {!minimised && (
                <p className="text-xs text-primary-fg/70 truncate">{subtitle}</p>
              )}
            </div>
            <button
              onClick={() => setMinimised((v) => !v)}
              aria-label={minimised ? 'Expand chat' : 'Minimise chat'}
              className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
            </button>
          </div>

          {!minimised && (
            <>
              {/* Messages */}
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 scroll-smooth"
              >
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-text-secondary">
                    <FontAwesomeIcon icon={faCommentDots} className="w-8 h-8 opacity-30" />
                    <p className="text-sm">Start the conversation</p>
                  </div>
                )}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-2 items-end',
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                    )}
                  >
                    <div
                      className={cn(
                        'flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs',
                        msg.role === 'user'
                          ? 'bg-primary text-primary-fg'
                          : 'bg-surface-overlay text-text-secondary',
                      )}
                      aria-hidden="true"
                    >
                      <FontAwesomeIcon
                        icon={msg.role === 'user' ? faUser : faRobot}
                        className="w-3 h-3"
                      />
                    </div>
                    <div
                      className={cn(
                        'max-w-[75%] flex flex-col gap-0.5',
                        msg.role === 'user' ? 'items-end' : 'items-start',
                      )}
                    >
                      <div
                        className={cn(
                          'px-3 py-2 rounded-2xl text-sm leading-snug',
                          msg.role === 'user'
                            ? 'bg-primary text-primary-fg rounded-br-sm'
                            : 'bg-surface-raised border border-border text-text-primary rounded-bl-sm',
                        )}
                      >
                        {msg.text}
                      </div>
                      {msg.timestamp && (
                        <span className="text-[10px] text-text-disabled px-1">{msg.timestamp}</span>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2 items-end">
                    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-surface-overlay text-text-secondary">
                      <FontAwesomeIcon icon={faRobot} className="w-3 h-3" />
                    </div>
                    <div className="bg-surface-raised border border-border rounded-2xl rounded-bl-sm px-3 py-2">
                      <span className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-text-disabled animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-text-disabled animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-text-disabled animate-bounce [animation-delay:300ms]" />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex-shrink-0 border-t border-border bg-surface-base px-3 py-2 flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  rows={1}
                  disabled={loading}
                  aria-label="Chat message input"
                  className={cn(
                    'flex-1 resize-none rounded-xl border border-border bg-surface-raised px-3 py-2',
                    'text-sm text-text-primary placeholder:text-text-disabled',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'max-h-28 overflow-y-auto leading-snug',
                  )}
                  style={{ height: 38 }}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = '38px';
                    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className={cn(
                    'flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl',
                    'bg-primary text-primary-fg',
                    'hover:bg-primary-hover active:bg-primary-active transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  )}
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB toggle button */}
      <button
        onClick={toggleOpen}
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        className={cn(
          'relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl',
          'bg-primary text-primary-fg',
          'hover:bg-primary-hover active:bg-primary-active transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
        )}
      >
        <FontAwesomeIcon
          icon={open ? faTimes : faCommentDots}
          className="w-6 h-6"
          aria-hidden="true"
        />
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </div>
  );
}
