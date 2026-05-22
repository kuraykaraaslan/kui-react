# TabGroup

- **id:** `tab-group`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/TabGroup.tsx`
- **status:** stable
- **since:** 2025-02

Accessible tab navigation following the role="tablist" / role="tab" / role="tabpanel" ARIA pattern. Arrow-key navigation; tabIndex=-1 on inactive tabs.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--primary`
- `--secondary`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```tsx
<TabGroup
  label="Account settings"
  tabs={[
    { id: 'profile', label: 'Profile', content: <ProfileSettings /> },
    { id: 'security', label: 'Security', content: <SecuritySettings /> },
    { id: 'billing', label: 'Billing', content: <BillingSettings /> },
  ]}
/>
```

### Icons + badge + disabled

```tsx
<TabGroup tabs={[
  { id: 'overview', label: 'Overview', icon: <BarChart2 />, content: ... },
  { id: 'analytics', label: 'Analytics', icon: <TrendingUp />, badge: <Badge>New</Badge>, content: ... },
  { id: 'settings', label: 'Settings', disabled: true, content: ... },
]} />
```

### Lazy panels

```tsx
// With lazy=true, panel content is only rendered when first activated:
<TabGroup lazy tabs={[
  { id: 'heavy', label: 'Heavy', content: <HeavyComponent /> },
]} />
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';
import { useState } from 'react';

export function TabGroup({ tabs, defaultTab, label = 'Tabs', className }) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? '');
  function handleKeyDown(e, index) {
    if (e.key === 'ArrowRight') setActive(tabs[(index + 1) % tabs.length].id);
    else if (e.key === 'ArrowLeft') setActive(tabs[(index - 1 + tabs.length) % tabs.length].id);
  }
  return (
    <div className={cn('w-full', className)}>
      <div role="tablist" aria-label={label} className="flex border-b border-border pb-3">
        {tabs.map((tab, i) => (
          <button key={tab.id} role="tab" id={`tab-btn-${tab.id}`} aria-selected={tab.id === active} aria-controls={`tabpanel-${tab.id}`} tabIndex={tab.id === active ? 0 : -1}
            onClick={() => setActive(tab.id)} onKeyDown={(e) => handleKeyDown(e, i)}
            className={cn('px-4 py-2.5 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus', tab.id === active ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border')}>
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div key={tab.id} id={`tabpanel-${tab.id}`} role="tabpanel" aria-labelledby={`tab-btn-${tab.id}`} tabIndex={0} hidden={tab.id !== active} className="py-4 focus-visible:outline-none">
          {tab.content}
        </div>
      ))}
    </div>
  );
}
```
