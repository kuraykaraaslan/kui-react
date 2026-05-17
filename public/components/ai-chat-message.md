# ChatMessage

- **id:** `ai-chat-message`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/ai/chat/ChatMessage.tsx`
- **status:** stable
- **since:** 2026-05

Chat bubble for AI conversations — USER bubbles are right-aligned (primary bg), ASSISTANT bubbles are left-aligned (surface-raised).

## Variants

### User message

```tsx
<ChatMessage message={{ role: 'USER', content: '...' }} />
```

### Assistant message

```tsx
<ChatMessage message={{ role: 'ASSISTANT', content: '...' }} />
```

## Full source

```tsx
import { ChatMessage } from '@/modules/domains/ai/chat/ChatMessage';
<ChatMessage message={message} />
```
