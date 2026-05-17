'use client';
import { SkipLink } from '@/modules/ui/SkipLink';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faHouse,
  faMagnifyingGlass,
  faUsers,
  faCircleQuestion,
  faCircleUser,
  faChartBar,
  faShield,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { BOARD_STATS } from './forum.data';

const NAV_ITEMS = [
  { label: 'Board index', href: '/theme/forum',                    icon: faHouse },
  { label: 'FAQ',         href: '/theme/forum',                    icon: faCircleQuestion },
  { label: 'Members',     href: '/theme/forum/users/mod_jane',     icon: faUsers },
  { label: 'Search',      href: '/theme/forum',                    icon: faMagnifyingGlass },
];

export default function ForumThemeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-sunken text-text-primary text-sm">
      <SkipLink href="#main-content" />

      <header>
        {/* Brand bar */}
        <div className="bg-primary text-primary-fg">
          <div className="mx-auto max-w-5xl px-4 py-2 flex items-center justify-between gap-4">
            <a
              href="/theme/forum"
              className="flex items-center gap-2 text-primary-fg hover:text-primary-fg/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-fg rounded"
            >
              <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5" aria-hidden="true" />
              <span className="text-lg font-bold tracking-tight">Agora</span>
              <span className="text-primary-fg/50 text-xs hidden sm:inline ml-1">:: Open Developer Community</span>
            </a>
            <div className="flex items-center gap-1.5 text-xs text-primary-fg/75">
              <FontAwesomeIcon icon={faCircleUser} className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Not logged in</span>
            </div>
          </div>
        </div>

        {/* Nav bar */}
        <div className="bg-surface-overlay border-b border-border">
          <div className="mx-auto max-w-5xl px-4 py-0.5 flex items-center flex-wrap gap-0.5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-sunken rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
              >
                <FontAwesomeIcon icon={item.icon} className="w-3 h-3" aria-hidden="true" />
                {item.label}
              </a>
            ))}

            <div className="ml-auto flex items-center gap-1">
              <Button
                as="a"
                href="/theme/forum/topics/new"
                variant="primary"
                size="xs"
                iconLeft={<FontAwesomeIcon icon={faPlus} className="w-3 h-3" aria-hidden="true" />}
              >
                New topic
              </Button>
              <Button as="a" href="/theme/forum" variant="ghost" size="xs">
                Login
              </Button>
              <Button as="a" href="/theme/forum" variant="primary" size="xs">
                Register
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-6">
        <div className="mx-auto max-w-5xl px-4 pb-6 space-y-2">
          {/* Who's online */}
          <div className="border border-border rounded overflow-hidden">
            <div className="bg-surface-overlay border-b border-border px-3 py-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wide flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="w-3 h-3" aria-hidden="true" />
              Who is online
            </div>
            <div className="bg-surface-base px-3 py-2 text-xs text-text-secondary">
              In total there are{' '}
              <strong className="text-text-primary">{BOARD_STATS.onlineCount}</strong> users online
              {' :: '}
              <strong className="text-text-primary">{BOARD_STATS.registeredOnline}</strong> registered, 0 hidden and{' '}
              <strong className="text-text-primary">{BOARD_STATS.guestOnline}</strong> guests
              <span className="ml-2 text-text-disabled hidden sm:inline">
                [ based on users active over the past 5 minutes ]
              </span>
            </div>
          </div>

          {/* Board stats */}
          <div className="border border-border rounded overflow-hidden">
            <div className="bg-surface-overlay border-b border-border px-3 py-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wide flex items-center gap-2">
              <FontAwesomeIcon icon={faChartBar} className="w-3 h-3" aria-hidden="true" />
              Board statistics
            </div>
            <div className="bg-surface-base px-3 py-2 text-xs text-text-secondary flex flex-wrap gap-x-6 gap-y-1">
              <span>Total posts: <strong className="text-text-primary">{BOARD_STATS.totalPosts.toLocaleString()}</strong></span>
              <span>Total topics: <strong className="text-text-primary">{BOARD_STATS.totalTopics.toLocaleString()}</strong></span>
              <span>Total members: <strong className="text-text-primary">{BOARD_STATS.totalMembers.toLocaleString()}</strong></span>
              <span>
                Newest member:{' '}
                <a href="/theme/forum" className="text-primary hover:underline font-medium">
                  {BOARD_STATS.newestMember}
                </a>
              </span>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex items-center justify-between text-xs text-text-disabled">
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faShield} className="w-3 h-3" aria-hidden="true" />
              <span>Agora Community &copy; {new Date().getFullYear()}</span>
            </div>
            <span>All times are UTC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
