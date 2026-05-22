'use client';
import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheckDouble, faBellSlash } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';
import { NotificationListItem } from '@/modules/domains/common/notification/NotificationListItem';
import {
  NotificationFilterTabs,
} from '@/modules/domains/common/notification/NotificationFilterTabs';
import type { NotificationKind } from '@/modules/domains/common/notification/NotificationListItem';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

type Notification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body?: string;
  createdAt: string;
  read: boolean;
  href?: string;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    kind: 'order',
    title: 'Your order has shipped',
    body: 'Order #YD-20260516-007 from Bella Napoli is now out for delivery.',
    createdAt: new Date(Date.now() - 3 * 60_000).toISOString(),
    read: false,
    href: '/theme/food/orders/ord-02',
  },
  {
    id: 'n2',
    kind: 'message',
    title: 'New reply from mod_jane',
    body: 'You can use PM2 with a basic systemd service. Here is a working config…',
    createdAt: new Date(Date.now() - 32 * 60_000).toISOString(),
    read: false,
    href: '/theme/forum/topics/deploy-nextjs-vps-no-docker',
  },
  {
    id: 'n3',
    kind: 'alert',
    title: 'Security alert: new sign-in',
    body: 'A new sign-in from Berlin, DE was detected. Was this you?',
    createdAt: new Date(Date.now() - 4 * 3600_000).toISOString(),
    read: false,
  },
  {
    id: 'n4',
    kind: 'success',
    title: 'Payment received',
    body: 'Your subscription was renewed for another month.',
    createdAt: new Date(Date.now() - 18 * 3600_000).toISOString(),
    read: true,
  },
  {
    id: 'n5',
    kind: 'social',
    title: 'Ruth Stancev started following you',
    createdAt: new Date(Date.now() - 26 * 3600_000).toISOString(),
    read: true,
    href: '/theme/forum/users/rustacean99',
  },
  {
    id: 'n6',
    kind: 'system',
    title: 'Scheduled maintenance window',
    body: 'We will be performing maintenance on May 20 from 02:00–04:00 UTC.',
    createdAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
    read: true,
  },
];

const FILTERS = [
  { id: 'all',     label: 'All' },
  { id: 'unread',  label: 'Unread' },
  { id: 'order',   label: 'Orders' },
  { id: 'message', label: 'Messages' },
  { id: 'alert',   label: 'Alerts' },
];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [readState, setReadState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, n.read])),
  );

  const tabs = useMemo(() => {
    const counts = NOTIFICATIONS.reduce((acc, n) => {
      const isRead = readState[n.id];
      if (!isRead) acc.unread = (acc.unread ?? 0) + 1;
      acc[n.kind] = (acc[n.kind] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return FILTERS.map((f) => ({
      ...f,
      count: f.id === 'all' ? NOTIFICATIONS.length : counts[f.id],
    }));
  }, [readState]);

  const filtered = NOTIFICATIONS.filter((n) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !readState[n.id];
    return n.kind === activeFilter;
  });

  const unreadCount = NOTIFICATIONS.filter((n) => !readState[n.id]).length;

  return (
    <>
      <DocumentTitle text="Notifications — Common Theme" />
    <div className="mx-auto max-w-3xl px-4 py-8">
      <a
        href="/theme/common"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back home
      </a>

      <header className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Notifications</h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={unreadCount === 0}
          iconLeft={<FontAwesomeIcon icon={faCheckDouble} className="w-3 h-3" aria-hidden="true" />}
          onClick={() => setReadState(Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, true])))}
        >
          Mark all read
        </Button>
      </header>

      <NotificationFilterTabs
        tabs={tabs}
        activeId={activeFilter}
        onChange={setActiveFilter}
        className="mb-4"
      />

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface-raised p-10 text-center">
          <FontAwesomeIcon icon={faBellSlash} className="w-8 h-8 text-text-disabled mb-2" aria-hidden="true" />
          <p className="text-sm text-text-secondary">No notifications in this view.</p>
        </div>
      ) : (
        <section className="rounded-xl border border-border bg-surface-raised overflow-hidden shadow-sm">
          {filtered.map((n) => (
            <NotificationListItem
              key={n.id}
              kind={n.kind}
              title={n.title}
              body={n.body}
              createdAt={n.createdAt}
              read={readState[n.id]}
              href={n.href}
              onMarkRead={() => setReadState((s) => ({ ...s, [n.id]: true }))}
            />
          ))}
        </section>
      )}
    </div>
    </>
  );
}
