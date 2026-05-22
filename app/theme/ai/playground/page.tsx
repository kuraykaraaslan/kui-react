'use client';
import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/modules/domains/ai/chat/ChatMessage';
import { ChatInputBar } from '@/modules/domains/ai/chat/ChatInputBar';
import { DropdownMenu } from '@/modules/ui/DropdownMenu';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { MODELS, CHAT_MESSAGES } from '../ai.data';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

const TEXT_MODELS = MODELS.filter((m) => m.type === 'TEXT');
const DEMO_SESSION_ID = 'sess-01';
const DEFAULT_MODEL_ID = 'gokce-5.2';

export default function PlaygroundPage() {
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = CHAT_MESSAGES[DEMO_SESSION_ID] ?? [];
  const selectedModel = TEXT_MODELS.find((m) => m.modelId === selectedModelId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const modelItems = TEXT_MODELS.map((m) => ({
    type: 'item' as const,
    label: m.name,
    onClick: () => setSelectedModelId(m.modelId),
  }));

  return (
    <>
      <DocumentTitle text="Playground — AI Theme" />
      <div className="h-full flex flex-col bg-surface-base">
      {/* Model selector topbar */}
      <div className="shrink-0 flex items-center justify-center h-12 border-b border-border">
        <DropdownMenu
          trigger={
            <Button variant="ghost" size="sm" className="gap-1.5 font-semibold">
              {selectedModel?.name ?? 'GPT-4o'}
              <FontAwesomeIcon icon={faChevronDown} className="w-3.5 h-3.5 text-text-disabled" aria-hidden="true" />
            </Button>
          }
          items={modelItems}
          align="left"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="mx-auto max-w-3xl">
          {messages.map((msg) => (
            <ChatMessage key={msg.messageId} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 pb-6">
        <ChatInputBar
          placeholder={`${selectedModel?.name ?? 'Umay'}'a mesaj yaz`}
          modelName={`${selectedModel?.name ?? 'Umay'} hata yapabilir. Önemli bilgileri doğrulayın.`}
        />
      </div>
      </div>
    </>
  );
}
