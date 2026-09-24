'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { SkipLink } from '@/modules/ui/SkipLink';
import { AnnouncementBar } from '@/modules/domains/landing/nav/AnnouncementBar';
import { MegaMenu, useMegaMenu } from '@/modules/domains/landing/nav/MegaMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars, faXmark, faBolt, faChevronDown, faArrowRight,
  faRocket, faCodeBranch, faChartLine, faPlug,
  faBook, faRss, faClockRotateLeft, faCircleCheck,
  faBullhorn,
} from '@fortawesome/free-solid-svg-icons';

const BASE = '/theme/landing';

const PRODUCT_ITEMS = [
  { icon: faRocket,        label: 'Deployments',     description: 'Zero-downtime rolling releases to any cloud',  href: `${BASE}/features` },
  { icon: faCodeBranch,    label: 'Branch Previews', description: 'Auto-deploy every push, auto-expire on merge', href: `${BASE}/features` },
  { icon: faChartLine,     label: 'Analytics',       description: 'Performance, errors & behaviour in one view',  href: `${BASE}/features` },
  { icon: faPlug,          label: 'Integrations',    description: '100+ tools connected with a single click',     href: `${BASE}/features` },
];

const RESOURCES_ITEMS = [
  { icon: faBook,            label: 'Documentation', description: 'Guides, API refs, and quickstarts',   href: '#' },
  { icon: faRss,             label: 'Blog',          description: 'Product news and engineering posts',  href: '#' },
  { icon: faClockRotateLeft, label: 'Changelog',     description: 'Every release, documented',          href: '#' },
  { icon: faCircleCheck,     label: 'System Status', description: 'Live uptime and incident reports',   href: '#' },
];

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features',  href: `${BASE}/features` },
      { label: 'Pricing',   href: `${BASE}/pricing`  },
      { label: 'Changelog', href: '#' },
      { label: 'Roadmap',   href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About',   href: `${BASE}/about` },
      { label: 'Blog',    href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press',   href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy',   href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy',    href: '#' },
    ],
  },
];

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { openId, open, scheduleClose, close } = useMegaMenu();

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [close]);

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-text-primary">
      <SkipLink />

      <AnnouncementBar
        icon={faBullhorn}
        message={<><span className="font-semibold">Velox 2.0 is here</span> — faster builds, smarter branch previews.</>}
        cta={{ label: 'Read the announcement', href: '#' }}
      />

      <header className="sticky top-0 z-50 border-b border-border bg-surface-base/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-2 h-14">

            <Link href={BASE} className="flex items-center gap-2 flex-shrink-0 mr-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-fg">
                <FontAwesomeIcon icon={faBolt} className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <span className="text-sm font-bold text-text-primary tracking-tight">Velox</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main navigation">

              {/* Product mega menu */}
              <MegaMenu.Root id="product" openId={openId} onOpen={open} onScheduleClose={scheduleClose}>
                <MegaMenu.Trigger label="Product" isOpen={openId === 'product'} />
                {openId === 'product' && (
                  <MegaMenu.Panel id="product" onOpen={open} onScheduleClose={scheduleClose} width="w-[600px]" align="left">
                    <div className="grid grid-cols-[1fr_188px]">
                      <MegaMenu.Section label="Platform">
                        {PRODUCT_ITEMS.map((item) => (
                          <MegaMenu.Item key={item.label} {...item} iconVariant="primary" onClick={close} />
                        ))}
                        <MegaMenu.Footer label="See all features" href={`${BASE}/features`} onClick={close} />
                      </MegaMenu.Section>
                      <MegaMenu.FeaturedCard
                        eyebrow="What's new"
                        title="Velox 2.0"
                        description="Faster builds, smarter branch previews, and zero-config monorepo support."
                        secondaryCta={{ label: 'Read announcement', href: '#', onClick: close }}
                        primaryCta={{ label: 'Start free', href: `${BASE}/pricing`, onClick: close }}
                      />
                    </div>
                  </MegaMenu.Panel>
                )}
              </MegaMenu.Root>

              {/* Resources mega menu */}
              <MegaMenu.Root id="resources" openId={openId} onOpen={open} onScheduleClose={scheduleClose}>
                <MegaMenu.Trigger label="Resources" isOpen={openId === 'resources'} />
                {openId === 'resources' && (
                  <MegaMenu.Panel id="resources" onOpen={open} onScheduleClose={scheduleClose} width="w-[400px]" align="center">
                    <MegaMenu.Section label="Resources">
                      <div className="grid grid-cols-2 gap-0.5">
                        {RESOURCES_ITEMS.map((item) => (
                          <MegaMenu.Item key={item.label} {...item} iconVariant="neutral" onClick={close} />
                        ))}
                      </div>
                    </MegaMenu.Section>
                  </MegaMenu.Panel>
                )}
              </MegaMenu.Root>

              <span className="w-px h-4 bg-border mx-1" aria-hidden="true" />

              <Link href={`${BASE}/pricing`} className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
                Pricing
              </Link>
              <Link href={`${BASE}/about`} className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
                Company
              </Link>
            </nav>

            <div className="ml-auto flex items-center gap-1.5">
              <a href="#" className="hidden sm:inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">
                Sign in
              </a>
              <span className="hidden sm:block w-px h-4 bg-border mx-0.5" aria-hidden="true" />
              <Link
                href={`${BASE}/pricing`}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors',
                  'bg-primary text-primary-fg hover:bg-primary-hover active:bg-primary-active',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                )}
              >
                Start free
                <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" aria-hidden="true" />
              </Link>
              <button
                type="button"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className={cn(
                  'lg:hidden ml-1 flex items-center justify-center w-9 h-9 rounded-lg border border-border',
                  'text-text-secondary hover:bg-surface-overlay transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                )}
              >
                <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav aria-label="Mobile navigation" className="lg:hidden border-t border-border bg-surface-base">
            <div className="px-4 py-3 space-y-0.5">
              {[
                { id: 'product',   label: 'Product',   items: PRODUCT_ITEMS   },
                { id: 'resources', label: 'Resources', items: RESOURCES_ITEMS },
              ].map((group) => (
                <div key={group.id}>
                  <button
                    type="button"
                    aria-expanded={mobileExpanded === group.id}
                    onClick={() => setMobileExpanded(mobileExpanded === group.id ? null : group.id)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-overlay transition-colors"
                  >
                    {group.label}
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={cn('w-3 h-3 text-text-secondary transition-transform duration-150', mobileExpanded === group.id && 'rotate-180')}
                      aria-hidden="true"
                    />
                  </button>
                  {mobileExpanded === group.id && (
                    <div className="ml-3 mt-0.5 mb-1 border-l-2 border-border pl-3 space-y-0.5">
                      {group.items.map((item) => (
                        <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors">
                          <FontAwesomeIcon icon={item.icon} className="w-3.5 h-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link href={`${BASE}/pricing`} onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-overlay transition-colors">Pricing</Link>
              <Link href={`${BASE}/about`} onClick={() => setMobileOpen(false)} className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-text-primary hover:bg-surface-overlay transition-colors">Company</Link>

              <div className="pt-2 mt-1 border-t border-border space-y-1.5">
                <a href="#" className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-overlay transition-colors">Sign in</a>
                <Link href={`${BASE}/pricing`} onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-1.5 w-full px-3 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-fg hover:bg-primary-hover transition-colors">
                  Start free
                  <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">{children}</main>

      <footer className="border-t border-border bg-surface-raised">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <Link href={BASE} className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-fg">
                  <FontAwesomeIcon icon={faBolt} className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
                <span className="text-sm font-bold text-text-primary">Velox</span>
              </Link>
              <p className="mt-3 text-xs text-text-secondary leading-relaxed max-w-[180px]">
                Ship better products, faster. Trusted by 5 000+ teams worldwide.
              </p>
            </div>
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold text-text-primary uppercase tracking-widest mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-sm text-text-secondary hover:text-text-primary transition-colors">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-text-secondary">&copy; 2026 Velox, Inc. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
              <span className="text-xs text-text-secondary">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
