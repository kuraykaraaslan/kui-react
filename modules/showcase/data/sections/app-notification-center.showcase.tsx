'use client';
import { useState } from 'react';
import { NotificationCenter } from '@/modules/app/NotificationCenter';
import type { Notification } from '@/modules/app/NotificationCenter';
import type { ShowcaseComponent } from '../showcase.types';

// Stable anchor so the relative time strings are deterministic across renders.
const NOW = Date.now();
const minutes = (n: number) => new Date(NOW - n * 60 * 1000).toISOString();
const hours = (n: number) => new Date(NOW - n * 60 * 60 * 1000).toISOString();
const days = (n: number) => new Date(NOW - n * 24 * 60 * 60 * 1000).toISOString();

function seedNotifications(): Notification[] {
  return [
    {
      id: 'n1',
      title: 'Ada Lovelace requested a review',
      message: 'feat: add notification inbox with unread badge + mark-all-read.',
      createdAt: minutes(4),
      read: false,
      source: 'GitHub',
      actor: 'Ada Lovelace',
      variant: 'mention',
    },
    {
      id: 'n2',
      title: 'Deployment succeeded',
      message: 'avantleap-web → production · build #2438 finished in 1m 42s.',
      createdAt: minutes(38),
      read: false,
      source: 'Vercel',
      variant: 'success',
    },
    {
      id: 'n3',
      title: 'Stripe payout scheduled',
      message: '$1,248.50 will be deposited on Friday, May 29.',
      createdAt: hours(3),
      read: false,
      source: 'Stripe',
      variant: 'info',
    },
    {
      id: 'n4',
      title: 'Disk usage is high on edge-2',
      message: '91% used. Add capacity or rotate logs.',
      createdAt: hours(7),
      read: true,
      source: 'Grafana',
      variant: 'warning',
    },
    {
      id: 'n5',
      title: 'Weekly summary is ready',
      message: '12 PRs merged, 4 incidents resolved, 31 design reviews.',
      createdAt: days(2),
      read: true,
      source: 'Linear',
      variant: 'system',
    },
  ];
}

function NotificationCenterDemo() {
  const [items, setItems] = useState<Notification[]>(seedNotifications);
  const markRead = (id: string) =>
    setItems((cur) => cur.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setItems((cur) => cur.map((n) => ({ ...n, read: true })));
  return (
    <div className="flex justify-end w-full px-4 py-6 bg-surface-raised rounded-lg border border-border">
      <NotificationCenter
        notifications={items}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
      />
    </div>
  );
}

function EmptyDemo() {
  return (
    <div className="flex justify-end w-full px-4 py-6 bg-surface-raised rounded-lg border border-border">
      <NotificationCenter notifications={[]} />
    </div>
  );
}

function HighUnreadDemo() {
  const [items, setItems] = useState<Notification[]>(() => {
    const base = seedNotifications();
    // 127 unread items so the badge collapses to "99+".
    const extras: Notification[] = Array.from({ length: 122 }, (_, i) => ({
      id: `bulk-${i}`,
      title: `System event ${i + 1}`,
      createdAt: days((i % 6) + 1),
      read: false,
      source: 'System',
      variant: 'info' as const,
    }));
    return [...base, ...extras];
  });
  const markRead = (id: string) =>
    setItems((cur) => cur.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const markAllRead = () => setItems((cur) => cur.map((n) => ({ ...n, read: true })));
  return (
    <div className="flex justify-end w-full px-4 py-6 bg-surface-raised rounded-lg border border-border">
      <NotificationCenter
        notifications={items}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
      />
    </div>
  );
}

export function buildAppNotificationCenterData(): ShowcaseComponent[] {
  return [
    {
      id: 'notification-center',
      title: 'NotificationCenter',
      category: 'App',
      abbr: 'NC',
      description:
        'Inbox / activity feed with a bell trigger + unread badge, a popover panel listing notifications newest-first, mark-as-read on hover or click, and a toolbar "Mark all as read". M2-M6 add filter tabs / grouping / per-notification actions / realtime / preferences / full a11y. Sibling of the toast layer (NotificationSystem) — both can co-exist.',
      filePath: 'modules/app/NotificationCenter/index.tsx',
      since: '2026-05',
      status: 'beta',
      sourceCode: `'use client';
import { useState } from 'react';
import { NotificationCenter, type Notification } from '@/modules/app/NotificationCenter';

const seed: Notification[] = [
  {
    id: 'n1',
    title: 'Ada Lovelace requested a review',
    message: 'feat: add notification inbox.',
    createdAt: new Date(),
    read: false,
    source: 'GitHub',
    actor: 'Ada Lovelace',
    variant: 'mention',
  },
];

export function Demo() {
  const [items, setItems] = useState(seed);
  return (
    <NotificationCenter
      notifications={items}
      onMarkRead={(id) =>
        setItems((cur) => cur.map((n) => (n.id === id ? { ...n, read: true } : n)))
      }
      onMarkAllRead={() => setItems((cur) => cur.map((n) => ({ ...n, read: true })))}
    />
  );
}`,
      a11y: {
        wcagLevel: 'AA',
        ariaPatterns: [
          'Button with aria-haspopup="dialog" + aria-expanded (bell)',
          'Region with aria-live="polite" (panel)',
          'Badge with aria-label="N unread notifications"',
        ],
        keyboardInteractions: [
          { keys: 'Enter / Space', action: 'Toggle the panel from the bell' },
          { keys: 'Escape', action: 'Close the panel' },
          { keys: 'Tab', action: 'Move through notification rows + mark-read buttons' },
        ],
        notes:
          'Full keyboard nav (J/K row nav, M = mark read, A = archive) and screen-reader announcement of new notifications arrive in M6.',
      },
      designTokens: [
        '--primary', '--primary-subtle',
        '--error', '--text-inverse',
        '--surface-base', '--surface-raised', '--surface-overlay',
        '--border', '--border-focus',
        '--text-primary', '--text-secondary',
        '--success', '--success-subtle',
        '--warning', '--warning-subtle',
        '--info', '--info-subtle',
        '--error-subtle',
      ],
      composes: [],
      variants: [
        {
          title: 'Bell + panel (default)',
          layout: 'stack',
          preview: <NotificationCenterDemo />,
          code: `<NotificationCenter
  notifications={items}
  onMarkRead={(id) => markRead(id)}
  onMarkAllRead={() => markAllRead()}
/>`,
        },
        {
          title: 'Empty state',
          layout: 'stack',
          preview: <EmptyDemo />,
          code: `<NotificationCenter notifications={[]} />`,
        },
        {
          title: 'High unread count — badge caps at 99+',
          layout: 'stack',
          preview: <HighUnreadDemo />,
          code: `<NotificationCenter
  notifications={many /* 100+ unread */}
  onMarkRead={(id) => markRead(id)}
  onMarkAllRead={() => markAllRead()}
/>`,
        },
      ],
    },
  ];
}
