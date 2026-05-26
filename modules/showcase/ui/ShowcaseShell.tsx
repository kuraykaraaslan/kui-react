'use client';
import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppShell } from '@/modules/app/AppShell';
import { AppSidebar } from '@/modules/app/AppSidebar';
import { AppTopBar } from '@/modules/app/AppTopBar';
import { cn } from '@/libs/utils/cn';
import SHOWCASE_NAV_GROUPS from '@/modules/showcase/data/showcase.menu';
import { ThemeSwitcher } from '@/modules/app/ThemeSwitcher';
import { UserMenu } from '@/modules/domains/common/user/UserMenu';
import { GithubButton } from './GithubButton';
import { LayoutSwitcher, type VariantLayout } from './LayoutSwitcher';
import { VariantLayoutContext } from './VariantLayoutContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

export function ShowcaseShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathname && pathname !== '/' ? pathname.replace(/^\//, '') : null;
  const isHome = !slug;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [variantLayout, setVariantLayout] = useState<VariantLayout>('side');

  const navGroups = useMemo(() => [
    {
      label: undefined,
      collapsible: false,
      defaultExpanded: true,
      items: [{
        id: 'home',
        label: 'Home',
        href: '/',
        icon: <FontAwesomeIcon icon={faHouse} className="w-3.5 h-3.5" aria-hidden="true" />,
      }],
    },
    ...SHOWCASE_NAV_GROUPS.map((group) => ({
      label: group.label,
      collapsible: group.collapsible,
      defaultExpanded: true,
      items: group.items.map((item) => ({
        id: item.id,
        label: item.title,
        href: item.href ?? `/${item.id}`,
        icon: (
          <span className="flex items-center justify-center w-6 h-6 rounded text-[11px] font-bold bg-surface-sunken text-text-secondary">
            {item.abbr}
          </span>
        ),
      })),
    })),
  ], []);

  return (
    <VariantLayoutContext.Provider value={{ variantLayout, setVariantLayout }}>
      <AppShell
        logo={
          <div>
            <p className="text-sm font-semibold text-text-primary">UI Showcase</p>
            <p className="text-xs text-text-secondary">Component library</p>
          </div>
        }
        compactLogo={<span className="text-sm font-black text-primary">UI</span>}
        sidebarCollapsed={sidebarCollapsed}
        sidebar={
          <AppSidebar
            navGroups={navGroups}
            activeId={isHome ? 'home' : slug ?? undefined}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            footer={({ collapsed }) => (
              <div className={cn('p-3 flex items-center', collapsed ? 'justify-center' : 'gap-2')}>
                <span className="w-7 h-7 rounded-full bg-primary-subtle flex items-center justify-center text-xs font-bold text-primary shrink-0" aria-hidden="true">D</span>
                {!collapsed && (
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate">Developer</p>
                    <p className="text-[10px] text-text-secondary truncate">Component Library</p>
                  </div>
                )}
              </div>
            )}
          />
        }
        topbar={
          <AppTopBar>
            <div className="ml-auto flex items-center gap-1">
              <LayoutSwitcher value={variantLayout} onChange={setVariantLayout} />
              <GithubButton />
              <ThemeSwitcher />
              <UserMenu
                onlyAvatar
                user={{ userId: 'admin-1', email: 'admin@acme.com', userRole: 'ADMIN', userStatus: 'ACTIVE', userProfile: { name: 'Jane Doe', profilePicture: null } }}
              />
            </div>
          </AppTopBar>
        }
      >
        {children}
      </AppShell>
    </VariantLayoutContext.Provider>
  );
}
