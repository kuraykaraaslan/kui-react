'use client';
import { AppBreadcrumbs } from '@/modules/app/AppBreadcrumbs';
import { AppFooter } from '@/modules/app/AppFooter';
import { ThemeSwitcher } from '@/modules/app/ThemeSwitcher';
import { Badge } from '@/modules/ui/Badge';
import { BrandLogo } from '@/modules/ui/BrandLogo';
import type { ShowcaseComponent } from '../showcase.types';

function AppBreadcrumbsBasicDemo() {
  return (
    <div className="w-full">
      <AppBreadcrumbs
        title="Project Atlas"
        description="Internal tooling for the design system team"
        items={[
          { label: 'Workspace', href: '#' },
          { label: 'Projects', href: '#' },
          { label: 'Atlas' },
        ]}
        badge={<Badge variant="info" size="sm">Beta</Badge>}
      />
    </div>
  );
}

function AppBreadcrumbsDeepDemo() {
  return (
    <div className="w-full">
      <AppBreadcrumbs
        title="invoice-2026-05-001.pdf"
        items={[
          { label: 'Home', href: '#' },
          { label: 'Accounts', href: '#' },
          { label: 'Acme Inc', href: '#' },
          { label: 'Invoices', href: '#' },
          { label: '2026-05', href: '#' },
          { label: 'invoice-2026-05-001.pdf' },
        ]}
      />
    </div>
  );
}

function AppFooterDemo() {
  return (
    <div className="w-full">
      <AppFooter
        logo={
          <div className="flex items-center gap-2">
            <BrandLogo size="sm">K</BrandLogo>
            <span className="font-semibold text-text-primary">KUIreact</span>
          </div>
        }
        nav={
          <>
            <a href="#" className="text-sm text-text-secondary hover:text-text-primary px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">Docs</a>
            <a href="#" className="text-sm text-text-secondary hover:text-text-primary px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">Pricing</a>
            <a href="#" className="text-sm text-text-secondary hover:text-text-primary px-2 py-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus">Status</a>
          </>
        }
        version="0.2.0"
        status="operational"
        copyright="© 2026 KUIreact"
      />
    </div>
  );
}

function ThemeSwitcherDemo() {
  return (
    <div className="flex items-center gap-3 p-4 border border-border rounded-xl bg-surface-raised">
      <span className="text-sm text-text-secondary">Try it:</span>
      <ThemeSwitcher />
    </div>
  );
}

export function buildAppExtrasData(): ShowcaseComponent[] {
  return [
    {
      id: 'app-breadcrumbs',
      title: 'AppBreadcrumbs',
      category: 'App',
      abbr: 'ABc',
      description: 'Page header with breadcrumb trail, title, description, and optional status badge. Collapses to a Breadcrumb + dropdown menu on mobile for deep paths.',
      filePath: 'modules/app/AppBreadcrumbs.tsx',
      sourceCode: `'use client';
import { AppBreadcrumbs } from '@/modules/app/AppBreadcrumbs';
import { Badge } from '@/modules/ui/Badge';

<AppBreadcrumbs
  title="Project Atlas"
  description="Internal tooling for the design system team"
  items={[
    { label: 'Workspace', href: '/' },
    { label: 'Projects',  href: '/projects' },
    { label: 'Atlas' },
  ]}
  badge={<Badge variant="info" size="sm">Beta</Badge>}
/>`,
      variants: [
        {
          title: 'With title + badge',
          layout: 'stack' as const,
          preview: <AppBreadcrumbsBasicDemo />,
          code: `<AppBreadcrumbs
  title="Project Atlas"
  description="Internal tooling for the design system team"
  items={[
    { label: 'Workspace', href: '/' },
    { label: 'Projects',  href: '/projects' },
    { label: 'Atlas' },
  ]}
  badge={<Badge variant="info" size="sm">Beta</Badge>}
/>`,
        },
        {
          title: 'Deep path',
          layout: 'stack' as const,
          preview: <AppBreadcrumbsDeepDemo />,
          code: `<AppBreadcrumbs
  title="invoice-2026-05-001.pdf"
  items={[
    { label: 'Home',     href: '/' },
    { label: 'Accounts', href: '/accounts' },
    { label: 'Acme Inc', href: '/accounts/acme' },
    { label: 'Invoices', href: '/accounts/acme/invoices' },
    { label: '2026-05',  href: '/accounts/acme/invoices/2026-05' },
    { label: 'invoice-2026-05-001.pdf' },
  ]}
/>`,
        },
      ],
    },
    {
      id: 'app-footer',
      title: 'AppFooter',
      category: 'App',
      abbr: 'AFt',
      description: 'Two-row application footer with logo, navigation links, system status badge, version, copyright, and social slot.',
      filePath: 'modules/app/AppFooter.tsx',
      sourceCode: `'use client';
import { AppFooter } from '@/modules/app/AppFooter';

<AppFooter
  logo={<span className="font-semibold">KUIreact</span>}
  nav={<><a href="/docs">Docs</a><a href="/status">Status</a></>}
  version="0.2.0"
  status="operational"          // 'operational' | 'degraded' | 'outage'
  copyright="© 2026 KUIreact"
/>`,
      variants: [
        {
          title: 'Operational, with nav + version',
          layout: 'stack' as const,
          preview: <AppFooterDemo />,
          code: `<AppFooter
  logo={<><BrandLogo size="sm">K</BrandLogo><span>KUIreact</span></>}
  nav={<><a href="#">Docs</a><a href="#">Pricing</a><a href="#">Status</a></>}
  version="0.2.0"
  status="operational"
  copyright="© 2026 KUIreact"
/>`,
        },
      ],
    },
    {
      id: 'theme-switcher',
      title: 'ThemeSwitcher',
      category: 'App',
      abbr: 'TS',
      description: 'Tri-state theme selector (light / dark / system). Persists the choice to localStorage and toggles the .dark class on <html>. Mounts safely on the server with a placeholder until hydrated.',
      filePath: 'modules/app/ThemeSwitcher.tsx',
      sourceCode: `'use client';
import { ThemeSwitcher } from '@/modules/app/ThemeSwitcher';

// Drop into any layout — manages its own state.
<ThemeSwitcher />`,
      variants: [
        {
          title: 'Default',
          preview: <ThemeSwitcherDemo />,
          code: `<ThemeSwitcher />`,
        },
      ],
    },
  ];
}
