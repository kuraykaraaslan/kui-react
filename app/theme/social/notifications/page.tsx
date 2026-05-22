'use client';
import { useState } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { Button } from '@/modules/ui/Button';
import { SocialNotificationItem } from '@/modules/domains/social/notification/SocialNotificationItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { NOTIFICATIONS } from '../social.data';
import type { NotificationWithActor } from '@/modules/domains/social/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationWithActor[]>(NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function handleClick(id: string) {
    setNotifications((prev) =>
      prev.map((n) => n.notificationId === id ? { ...n, isRead: true } : n)
    );
  }

  return (
    <div className="bg-surface-base border-r border-border min-h-full">
      <DocumentTitle text={`Notifications — ${THEME_TITLES.social}`} />
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface-base/90 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faBell} className="w-4 h-4 text-primary" aria-hidden="true" />
          <h1 className="text-base font-bold text-text-primary">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-error text-primary-fg text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="xs" onClick={markAllRead}>
            <FontAwesomeIcon icon={faCheckDouble} className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      <div
        role="list"
        aria-label="Notifications"
        className="divide-y divide-border"
      >
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
            <FontAwesomeIcon icon={faBell} className="w-10 h-10 mb-3 text-text-disabled" aria-hidden="true" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <SocialNotificationItem
              key={n.notificationId}
              notification={n}
              onClick={handleClick}
            />
          ))
        )}
      </div>

      {/* Padding for mobile bottom nav */}
      <div className="h-20 lg:hidden" />
    </div>
  );
}
