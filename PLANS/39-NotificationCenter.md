# NotificationCenter (Inbox) — Yeni Bileşen Planı (EJS Pariteli)

> Mevcut: [NotificationSystem.tsx](../modules/app/NotificationSystem.tsx) 39 satırlık toast provider — sadece toast queue. **Inbox / activity feed yok.**  
> EJS: [NotificationSystem.ejs](../../02_EJS_Components/modules/app/NotificationSystem.ejs) 169 satırlık benzer toast altyapısı.

Bu plan: GitHub Notifications + Slack Activity + Linear Inbox seviyesi **kalıcı bildirim merkezi** ekler. Mevcut `NotificationSystem` (toast) aynen kalır; yeni `NotificationCenter` kardeş bileşen olarak yazılır.

---

## Kuzey Yıldızı
GitHub Notifications + Linear Inbox + Slack Activity + Notion seviyesi: feed, mark read/unread, filters, snooze, group by source, real-time, accessible.

---

## Hedef yapı
```
modules/app/NotificationCenter/
├── index.tsx              ← named exports: NotificationCenter (panel) + Bell (trigger badge)
├── types.ts               ← Notification, NotificationGroup, FilterState
├── parts/
│   ├── Bell.tsx           ← topbar trigger + unread count
│   ├── Panel.tsx          ← drawer/popover container
│   ├── FilterTabs.tsx     ← All / Unread / Mentions / Assigned / ...
│   ├── NotificationItem.tsx
│   ├── GroupHeader.tsx    ← "GitHub · 3 new"
│   ├── EmptyState.tsx
│   ├── BulkActions.tsx    ← Mark all read / Archive all
│   └── PreferencesLink.tsx
└── hooks/
    ├── useNotifications.ts ← store (subscribe to source: WebSocket / SSE / polling)
    ├── useUnreadCount.ts
    ├── useGrouping.ts
    ├── useSnooze.ts        ← snooze until time
    └── useRealtimeSync.ts  ← optional WS/SSE adapter
```

### EJS paralel
- NotificationCenter.ejs root + partials (_bell/_panel/_item/_filter-tabs/_group-header).
- Scripts: store.js, unread.js, grouping.js, snooze.js, realtime.js.

---

## Milestone'lar

### M1 — Bell + panel
- Bell ikon + unread badge (count).
- Click → Panel açılır (Popover veya Drawer).
- Notification list: icon + title + meta + time + actor.
- Mark as read on hover/click.
- "Mark all as read" toolbar.
- Empty state.

### M2 — Filter + group
- Filter tabs: All / Unread / Mentions / Assigned / Following.
- Group by source (GitHub, Stripe, Internal, ...) — collapsible.
- Time grouping: Today / Yesterday / Last 7 days / Older.
- Search.

### M3 — Actions per notification
- Inline actions: View, Approve, Decline, Reply.
- Snooze: 1h / 4h / Tomorrow / Next week / Custom.
- Archive.
- Pin to top.
- Mute source.

### M4 — Real-time
- WebSocket / SSE adapter (`source.subscribe`).
- Toast preview (uses existing `NotificationSystem`) — yeni notification gelirse toast + bell update.
- Browser Notification API (Push API entegrasyonu — desktop notification).
- Sound on new (toggle).

### M5 — Preferences + premium
- Preferences modal: per-source on/off, channels (in-app / email / push), digest.
- Bulk: Mark all as read, Archive all, Mute source.
- Persistent storage (server sync via `onSync`).
- Cross-device read state.
- Mention rules.

### M6 — A11y + i18n
- WAI-ARIA: `role="region"` + `aria-live="polite"`.
- Klavye: J/K nav, Enter → açıklama paneli, M → mark read, A → archive.
- Screen reader: "3 unread notifications, latest from John Doe, 5 minutes ago".
- `messages` prop.

---

## Public API
```ts
type NotificationCenterProps = {
  notifications: Notification[];
  unreadCount?: number;
  groupBy?: 'source' | 'time' | 'none';
  filters?: ('all' | 'unread' | 'mentions' | 'assigned' | string)[];
  onMarkRead?: (id: string) => Promise<void>;
  onMarkAllRead?: () => Promise<void>;
  onArchive?: (id: string) => Promise<void>;
  onSnooze?: (id: string, until: Date) => Promise<void>;
  onMuteSource?: (source: string) => Promise<void>;
  onSync?: () => Promise<Notification[]>;
  realtime?: { url: string; protocol: 'ws' | 'sse' };
  enableBrowserPush?: boolean;
  enableSound?: boolean;
  preferencesHref?: string;
  trigger?: 'popover' | 'drawer';
  messages?: Partial<NotificationCenterMessages>;
  onTelemetry?: (e: NotificationTelemetry) => void;
};
```

## Telemetri
`open`, `close`, `mark-read`, `archive`, `snooze`, `mute-source`, `bulk-action`, `realtime-event`, `browser-push-grant`.

## Perf
- Core ≤ 12 kB.
- WS adapter ≤ 4 kB.
- Virtualization: 5 000 notif @ ≥ 58 fps.

## Mevcut `NotificationSystem` ile ilişki
- `NotificationSystem` toast queue olarak kalır.
- `NotificationCenter` toast'ları **mirror** edebilir: yeni notif gelirse hem inbox'a düşer hem (kullanıcı tercih ederse) toast atar.
- Aynı `notification.id` ile çift-render önlenir.

## DoD
- [ ] NextJS + EJS paralel yeni dosyalar.
- [ ] axe-core 0 violations.
- [ ] Real-time adapter referans implementation (WS).
- [ ] Showcase: bell + panel + filter + actions + real-time + preferences variant'ları.
