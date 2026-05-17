'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AppShell } from '@/modules/app/AppShell';
import { AppSidebar, type AppSidebarNavGroup } from '@/modules/app/AppSidebar';
import { Avatar } from '@/modules/ui/Avatar';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faCompass,
  faBell,
  faEnvelope,
  faUser,
  faGear,
  faStore,
  faPlus,
  faUsers,
  faArrowRightFromBracket,
  faCircleUser,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { ME, NOTIFICATIONS } from './social.data';

const unreadNotifCount = NOTIFICATIONS.filter((n) => !n.isRead).length;

type SocialNavItem = {
  id: string;
  label: string;
  href: string;
  icon: typeof faHouse;
  exact: boolean;
  badge?: number;
};

const NAV_ITEMS: SocialNavItem[] = [
  { id: 'home',          label: 'Home',          href: '/theme/social',                          icon: faHouse,    exact: true  },
  { id: 'explore',       label: 'Explore',       href: '/theme/social',                          icon: faCompass,  exact: false },
  { id: 'notifications', label: 'Notifications', href: '/theme/social/notifications',            icon: faBell,     exact: false, badge: unreadNotifCount > 0 ? unreadNotifCount : undefined },
  { id: 'messages',      label: 'Messages',      href: '/theme/social/messages',                 icon: faEnvelope, exact: false },
  { id: 'friends',       label: 'Friends',       href: '/theme/social/friends',                  icon: faUsers,    exact: false },
  { id: 'marketplace',   label: 'Marketplace',   href: '/theme/social/marketplace',              icon: faStore,    exact: false },
  { id: 'profile',       label: 'Profile',       href: `/theme/social/profile/${ME.userId}`,     icon: faUser,     exact: false },
  { id: 'settings',      label: 'Settings',      href: '/theme/social/settings',                 icon: faGear,     exact: false },
];

function resolveActiveId(pathname: string): string | undefined {
  const exactMatch = NAV_ITEMS.find((item) => item.exact && pathname === item.href);
  if (exactMatch) return exactMatch.id;
  const prefixMatch = NAV_ITEMS
    .filter((item) => !item.exact && pathname.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return prefixMatch?.id;
}

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Open account menu"
        className="flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        <Avatar src={ME.avatar ?? undefined} name={ME.name} size="sm" />
        {!collapsed && (
          <div className="flex flex-1 min-w-0 items-center justify-between">
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-medium text-text-primary">{ME.name}</p>
              <p className="truncate text-xs text-text-secondary">@{ME.username}</p>
            </div>
            <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 text-text-secondary" aria-hidden="true" />
          </div>
        )}
      </button>
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1 rounded-xl border border-border bg-surface-base shadow-lg py-1 z-50">
          <div className="border-b border-border px-4 py-2.5">
            <p className="text-sm font-semibold text-text-primary truncate">{ME.name}</p>
            <p className="text-xs text-text-secondary truncate">@{ME.username}</p>
          </div>
          <a
            href={`/theme/social/profile/${ME.userId}`}
            className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors"
          >
            <FontAwesomeIcon icon={faCircleUser} className="w-4 h-4" aria-hidden="true" />
            Profile
          </a>
          <a
            href="/theme/social/settings"
            className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors"
          >
            <FontAwesomeIcon icon={faGear} className="w-4 h-4" aria-hidden="true" />
            Settings
          </a>
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error-subtle transition-colors"
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-4 h-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function SocialThemeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeId = resolveActiveId(pathname);

  const navGroups: AppSidebarNavGroup[] = [
    {
      items: NAV_ITEMS.map((item) => ({
        id: item.id,
        label: item.label,
        href: item.href,
        badge: item.badge,
        icon: <FontAwesomeIcon icon={item.icon} className="w-4 h-4" aria-hidden="true" />,
      })),
    },
  ];

  return (
    <AppShell
      mobileSidebarTitle="Nexus"
      logo={
        <a
          href="/theme/social"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-fg">
            <FontAwesomeIcon icon={faUsers} className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
          <span className="text-sm font-bold text-text-primary tracking-tight">Nexus</span>
        </a>
      }
      sidebar={
        <AppSidebar
          navGroups={navGroups}
          activeId={activeId}
          searchable={false}
          footer={({ collapsed }) => <SidebarFooter collapsed={collapsed} />}
        />
      }
      topbar={
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-semibold text-text-primary">Nexus</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="xs"
              iconOnly
              aria-label="Notifications"
              as="a"
              href="/theme/social/notifications"
            >
              <span className="relative">
                <FontAwesomeIcon icon={faBell} className="w-4 h-4" aria-hidden="true" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-error ring-2 ring-surface-raised" />
                )}
              </span>
            </Button>
            <Button variant="primary" size="xs" iconLeft={<FontAwesomeIcon icon={faPlus} className="w-3 h-3" aria-hidden="true" />}>
              New Post
            </Button>
          </div>
        </div>
      }
      mainClassName="overflow-hidden p-0"
    >
      <main id="main-content" className="h-full overflow-y-auto">
        {children}
      </main>
    </AppShell>
  );
}
