import { BrandLogo } from '@/modules/ui/BrandLogo';
import { AppFooter } from '@/modules/app/AppFooter';
import { NavDrawer } from '@/modules/app/NavDrawer';
import { Badge } from '@/modules/ui/Badge';
import { Button } from '@/modules/ui/Button';
import { SearchBar } from '@/modules/ui/SearchBar';
import { SkipLink } from '@/modules/ui/SkipLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const NAV_ITEMS = [
  { label: 'Overview', href: '/domains/blog' },
  { label: 'Archive', href: '/domains/blog/archive' },
  { label: 'Community', href: '/domains/blog#community' },
];

const FOOTER_LINKS = [
  { label: 'Overview', href: '/domains/blog' },
  { label: 'Archive', href: '/domains/blog/archive' },
  { label: 'Community', href: '/domains/blog#community' },
];

const SOCIAL_LINKS = [
  { label: 'X', href: 'https://x.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'RSS', href: '/rss.xml' },
];

export default function BlogDomainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-text-primary">
      <SkipLink />

      <header className="sticky top-0 z-50">
        <div className="relative border-b border-border bg-surface-raised/90 backdrop-blur">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,_var(--primary-subtle)_0,_transparent_60%)]" />
            <div className="absolute right-0 top-0 h-16 w-48 bg-info/20 blur-2xl" />
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-center gap-4 py-4">
              <a href="/domains/blog" className="group inline-flex items-center gap-3">
                <BrandLogo className="h-11 w-11 text-base font-semibold">N</BrandLogo>
                <div className="leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-text-primary">Nolan Editorial</span>
                    <Badge variant="neutral" size="sm">Issue 24</Badge>
                  </div>
                  <span className="text-xs text-text-secondary">Editorial studio + engineering notes</span>
                </div>
              </a>

              <nav className="hidden lg:flex items-center gap-1 rounded-full border border-border bg-surface-base px-2 py-1 shadow-sm">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="ml-auto flex items-center gap-2">
                <SearchBar
                  id="nav-search"
                  placeholder="Search the archive"
                  className="hidden xl:flex w-56"
                />
                <Button variant="ghost" size="sm">Pitch a story</Button>
                <Button variant="primary" size="sm">Subscribe</Button>
                <div className="lg:hidden">
                  <NavDrawer
                    title="Navigation"
                    side="right"
                    trigger={(
                      <Button variant="outline" size="sm" iconOnly aria-label="Open menu">
                        <FontAwesomeIcon icon={faBars} className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    )}
                  >
                    <div className="space-y-4">
                      <SearchBar id="nav-search-mobile" placeholder="Search the archive" />
                      <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                        {NAV_ITEMS.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-overlay transition-colors"
                          >
                            {item.label}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </NavDrawer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <div className="mx-auto w-full max-w-6xl px-6 pb-12">
        <AppFooter
          logo={<span className="text-sm font-semibold text-text-primary">Nolan Editorial</span>}
          version="2026.04"
          status="operational"
          nav={(
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {FOOTER_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
          social={(
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
          copyright="(c) 2026 Nolan Editorial"
        />
      </div>
    </div>
  );
}
