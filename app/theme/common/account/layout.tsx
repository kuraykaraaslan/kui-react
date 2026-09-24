'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserMenu } from '@/modules/domains/common/user/UserMenu';
import { DEMO_USER } from '../common.data';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGear, faLocationDot, faCreditCard, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

const NAV = [
  { label: 'Profile',         href: '/theme/common/account/profile',         icon: <FontAwesomeIcon icon={faUser} className="w-4 h-4" /> },
  { label: 'Settings',        href: '/theme/common/account/settings',         icon: <FontAwesomeIcon icon={faGear} className="w-4 h-4" /> },
  { label: 'Addresses',       href: '/theme/common/account/addresses',        icon: <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4" /> },
  { label: 'Payment Methods', href: '/theme/common/account/payment-methods',  icon: <FontAwesomeIcon icon={faCreditCard} className="w-4 h-4" /> },
  { label: 'Order History',   href: '/theme/common/account/orders',           icon: <FontAwesomeIcon icon={faBoxOpen} className="w-4 h-4" /> },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      {/* top bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/theme/common" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
            ← Common Theme
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mt-1">Account</h1>
        </div>
        <UserMenu user={DEMO_USER} />
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* sidebar nav */}
        <nav className="w-full md:w-52 shrink-0" aria-label="Account navigation">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary-subtle text-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay',
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* page content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
