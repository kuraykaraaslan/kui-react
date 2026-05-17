# ChatBox

- **id:** `common-chat-box`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/chat/ChatBox.tsx`
- **status:** beta
- **since:** 2025-05

Floating chat widget that anchors to the bottom-right of the screen. Includes a FAB toggle, collapsible panel, scrollable message list with typing indicator, and an auto-growing textarea input.

## Variants

### With initial messages

```tsx
<ChatBox
  title="Support Chat"
  subtitle="We typically reply in a few minutes"
  initialMessages={[
    { id: 'm1', role: 'agent', text: 'Hi there! How can I help you today?' },
    { id: 'm2', role: 'user', text: 'I have a question about my order.' },
  ]}
/>
```

### Empty / initial state

```tsx
<ChatBox title="Sales Chat" subtitle="Ask us anything" />
```

## Full source

```tsx
'use client';
import { ChatBox } from '@/modules/domains/common/chat/ChatBox';

// Renders fixed at bottom-right of the page
<ChatBox
  title="Support Chat"
  subtitle="We typically reply in a few minutes"
  placeholder="Type a message…"
  onSend={async (text) => {
    // return agent reply string
    return 'Thanks for reaching out!';
  }}
/>
```
