'use client';
import { cn } from '@/libs/utils/cn';
import { Avatar } from '@/modules/ui/Avatar';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faCopy, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import type { AIChatMessage } from '../types';

type ChatMessageProps = {
  message: AIChatMessage;
  className?: string;
};

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isUser = message.role === 'USER';

  if (isUser) {
    return (
      <div className={cn('flex justify-end items-end gap-2 px-4 py-2', className)}>
        <div className="max-w-[80%] rounded-3xl bg-surface-overlay px-5 py-3 text-sm leading-relaxed text-text-primary whitespace-pre-wrap">
          {message.content}
        </div>
        <Avatar name="John Nolan" size="sm" />
      </div>
    );
  }

  return (
    <div className={cn('group flex gap-4 px-4 py-5', className)}>
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-fg mt-0.5"
        aria-hidden="true"
      >
        <FontAwesomeIcon icon={faRobot} className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary mb-2">Gökçe</p>
        <div className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">
          {message.content}
        </div>
        <div className="flex items-center gap-0.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="xs" iconOnly aria-label="Copy response">
            <FontAwesomeIcon icon={faCopy} className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="xs" iconOnly aria-label="Good response">
            <FontAwesomeIcon icon={faThumbsUp} className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="xs" iconOnly aria-label="Bad response">
            <FontAwesomeIcon icon={faThumbsDown} className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}
