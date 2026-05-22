import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { Button } from '@/modules/ui/Button';
import { Badge } from '@/modules/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faArrowUp,
  faArrowDown,
  faLock,
  faEllipsisV,
  faCreditCard,
  faBuilding,
  faShieldHalved,
  faArrowRightArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { WALLETS } from '../fintech.data';

export const metadata: Metadata = {
  title: buildPageTitle('Wallets', THEME_TITLES['fintech']),
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£',
  BTC: '₿',
  ETH: 'Ξ',
};

const CURRENCY_NAMES: Record<string, string> = {
  TRY: 'Turkish Lira',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
};

const CURRENCY_FLAGS: Record<string, string> = {
  TRY: '🇹🇷',
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  BTC: '₿',
  ETH: 'Ξ',
};

const CARD_COLORS: Record<string, string> = {
  TRY: 'from-[#003087] to-[#0070ba]',
  USD: 'from-[#1a1a2e] to-[#16213e]',
  EUR: 'from-[#003399] to-[#0050c8]',
  GBP: 'from-[#012169] to-[#c8102e]',
  BTC: 'from-[#f7931a] to-[#e6820f]',
  ETH: 'from-[#627eea] to-[#3c5bb0]',
};

const PAYMENT_METHODS = [
  { type: 'card',  label: 'Visa •••• 4242', sub: 'Expires 08/28', icon: faCreditCard, badge: 'Primary' },
  { type: 'card',  label: 'Mastercard •••• 8181', sub: 'Expires 03/27', icon: faCreditCard, badge: null },
  { type: 'bank',  label: 'Ziraat Bank •••• 0056', sub: 'Linked checking account', icon: faBuilding, badge: null },
];

export default function WalletsPage() {
  const activeWallets = WALLETS.filter((w) => w.status === 'ACTIVE');
  const frozenWallets = WALLETS.filter((w) => w.status === 'FROZEN');

  const totalUSD = activeWallets.reduce((sum, w) => {
    if (w.currency === 'USD') return sum + w.balance;
    if (w.currency === 'TRY') return sum + w.balance / 32.5;
    if (w.currency === 'EUR') return sum + w.balance * 1.08;
    if (w.currency === 'BTC') return sum + w.balance * 68420;
    if (w.currency === 'ETH') return sum + w.balance * 3842;
    return sum;
  }, 0);

  return (
    <div className="bg-[#f5f7fa] min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-text-primary">Wallet</h1>
            <p className="text-text-secondary mt-1 text-sm">Manage your balances and payment methods</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="rounded-full font-semibold"
            iconLeft={<FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" aria-hidden="true" />}
          >
            Add Currency
          </Button>
        </div>

        {/* Total portfolio value */}
        <div className="rounded-3xl overflow-hidden relative bg-gradient-to-br from-[#003087] via-primary to-[#0070ba] p-7 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12)_0%,_transparent_60%)]" />
          <div className="relative">
            <p className="text-white/70 text-sm font-medium mb-1">Total Portfolio Value</p>
            <p className="text-4xl font-black">${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-white/70 text-sm mt-2">{activeWallets.length} active currencies · {frozenWallets.length} frozen</p>
            <div className="flex gap-3 mt-5">
              <Button as="a" href="/theme/fintech/transfer" variant="primary"
                className="bg-white text-primary hover:bg-white/90 border-0 rounded-full font-bold text-sm"
                iconLeft={<FontAwesomeIcon icon={faArrowUp} className="w-3.5 h-3.5" aria-hidden="true" />}>
                Send
              </Button>
              <Button as="a" href="/theme/fintech/transfer" variant="outline"
                className="border-white/40 text-white hover:bg-white/10 rounded-full font-bold text-sm"
                iconLeft={<FontAwesomeIcon icon={faArrowDown} className="w-3.5 h-3.5" aria-hidden="true" />}>
                Receive
              </Button>
              <Button as="a" href="/theme/fintech/transactions" variant="outline"
                className="border-white/40 text-white hover:bg-white/10 rounded-full font-bold text-sm hidden sm:inline-flex"
                iconLeft={<FontAwesomeIcon icon={faArrowRightArrowLeft} className="w-3.5 h-3.5" aria-hidden="true" />}>
                Exchange
              </Button>
            </div>
          </div>
        </div>

        {/* Active wallets */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-text-primary">Currencies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeWallets.map((wallet) => {
              const sym = CURRENCY_SYMBOLS[wallet.currency] ?? wallet.currency;
              const flag = CURRENCY_FLAGS[wallet.currency] ?? '';
              const gradient = CARD_COLORS[wallet.currency] ?? 'from-primary to-[#003087]';
              return (
                <div
                  key={wallet.walletId}
                  className="rounded-2xl overflow-hidden border border-white/20 shadow-md"
                >
                  {/* Card face */}
                  <div className={`relative bg-gradient-to-br ${gradient} p-5 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{flag}</span>
                        <div>
                          <p className="text-xs text-white/70">{CURRENCY_NAMES[wallet.currency] ?? wallet.currency}</p>
                          <p className="text-sm font-bold">{wallet.currency}</p>
                        </div>
                      </div>
                      <button aria-label="Wallet options" className="text-white/60 hover:text-white transition-colors">
                        <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="text-2xl font-black mt-2">
                      {sym}{wallet.balance.toLocaleString('en-US', { minimumFractionDigits: wallet.currency === 'BTC' || wallet.currency === 'ETH' ? 4 : 2 })}
                    </p>
                    {wallet.lockedBalance > 0 && (
                      <p className="text-xs text-white/60 mt-1">
                        {sym}{wallet.lockedBalance.toFixed(2)} on hold
                      </p>
                    )}
                  </div>
                  {/* Card bottom */}
                  <div className="bg-surface-base px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-secondary">Available</p>
                      <p className="text-sm font-bold text-text-primary">
                        {sym}{wallet.availableBalance.toLocaleString('en-US', { minimumFractionDigits: wallet.currency === 'BTC' || wallet.currency === 'ETH' ? 4 : 2 })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary hover:bg-primary hover:text-primary-fg transition-colors" aria-label={`Send ${wallet.currency}`}>
                        <FontAwesomeIcon icon={faArrowUp} className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-primary hover:bg-primary hover:text-primary-fg transition-colors" aria-label={`Receive ${wallet.currency}`}>
                        <FontAwesomeIcon icon={faArrowDown} className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add wallet */}
            <div className="rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 p-8 text-center min-h-[160px] hover:border-primary hover:bg-primary-subtle transition-colors cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken">
                <FontAwesomeIcon icon={faPlus} className="w-5 h-5 text-text-secondary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">Add New Currency</p>
                <p className="text-xs text-text-secondary mt-0.5">Hold money in 20+ currencies</p>
              </div>
            </div>
          </div>
        </section>

        {/* Frozen wallets */}
        {frozenWallets.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-text-primary">Frozen</h2>
            {frozenWallets.map((wallet) => {
              const sym = CURRENCY_SYMBOLS[wallet.currency] ?? wallet.currency;
              return (
                <div key={wallet.walletId} className="rounded-2xl border border-border bg-surface-base px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunken">
                      <FontAwesomeIcon icon={faLock} className="w-5 h-5 text-text-secondary" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-text-primary">{wallet.currency} Wallet</p>
                        <Badge variant="warning" size="sm">Frozen</Badge>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5">{CURRENCY_NAMES[wallet.currency]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-text-secondary">{sym}{wallet.balance.toFixed(2)}</p>
                    <button className="text-xs text-primary font-semibold hover:underline mt-0.5">Unfreeze</button>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Payment methods */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-primary">Payment Methods</h2>
            <button className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
              <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" aria-hidden="true" />
              Link new
            </button>
          </div>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((pm, i) => (
              <div key={i} className="rounded-2xl border border-border bg-surface-base px-5 py-4 flex items-center gap-4 hover:border-primary/30 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-raised flex-shrink-0">
                  <FontAwesomeIcon icon={pm.icon} className="w-5 h-5 text-text-secondary" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary">{pm.label}</p>
                    {pm.badge && <Badge variant="primary" size="sm">{pm.badge}</Badge>}
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{pm.sub}</p>
                </div>
                <button className="text-text-secondary hover:text-text-primary transition-colors">
                  <FontAwesomeIcon icon={faEllipsisV} className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Info banner */}
        <div className="rounded-2xl border border-border bg-surface-base p-5 flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle flex-shrink-0">
            <FontAwesomeIcon icon={faShieldHalved} className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">Your funds are protected</p>
            <p className="text-sm text-text-secondary mt-1">
              PayFlow keeps your balance in regulated bank accounts. Your money is safe and insured up to ₺500,000.{' '}
              <a href="/theme/fintech" className="text-primary font-medium hover:underline">Learn more</a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
