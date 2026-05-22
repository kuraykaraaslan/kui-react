import type { Metadata } from 'next';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { Button } from '@/modules/ui/Button';
import { Badge } from '@/modules/ui/Badge';
import { TransactionRow } from '@/modules/domains/fintech/transaction/TransactionRow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faArrowDown,
  faCoins,
  faCreditCard,
  faArrowRight,
  faShieldHalved,
  faQrcode,
  faEye,
  faEyeSlash,
  faPlus,
  faBolt,
  faGlobe,
  faPercent,
  faStar,
  faUsers,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { WALLETS, TRANSACTIONS } from './fintech.data';

export const metadata: Metadata = {
  title: { absolute: THEME_TITLES['fintech'] },
};

const QUICK_ACTIONS = [
  { label: 'Send',     icon: faPaperPlane, href: '/theme/fintech/transfer',     bg: 'bg-primary text-primary-fg',      desc: 'To friends' },
  { label: 'Request',  icon: faArrowDown,  href: '/theme/fintech/transfer',     bg: 'bg-[#003087] text-white',         desc: 'Get paid' },
  { label: 'Exchange', icon: faCoins,      href: '/theme/fintech/transactions', bg: 'bg-surface-sunken text-text-primary', desc: 'FX rates' },
  { label: 'Pay',      icon: faCreditCard, href: '/theme/fintech/transfer',     bg: 'bg-surface-sunken text-text-primary', desc: 'Online' },
  { label: 'Scan',     icon: faQrcode,     href: '/theme/fintech',              bg: 'bg-surface-sunken text-text-primary', desc: 'QR Pay' },
  { label: 'Top Up',   icon: faPlus,       href: '/theme/fintech/wallets',      bg: 'bg-surface-sunken text-text-primary', desc: 'Add funds' },
];

const TRUST_FEATURES = [
  { icon: faShieldHalved, title: 'Buyer Protection',      desc: 'Covered on eligible purchases' },
  { icon: faGlobe,         title: '200+ Countries',        desc: 'Send money worldwide' },
  { icon: faBolt,          title: 'Instant Transfers',     desc: 'Money arrives in seconds' },
  { icon: faPercent,       title: 'No Hidden Fees',        desc: 'Transparent pricing always' },
];

const STATS = [
  { label: 'Active Users',   value: '430M+',  icon: faUsers },
  { label: 'Countries',      value: '200+',   icon: faGlobe },
  { label: 'Transactions/day', value: '$23B',  icon: faBolt },
  { label: 'Trust Score',    value: '4.8★',   icon: faStar },
];

export default function FintechDashboardPage() {
  const recentTx = TRANSACTIONS.slice(0, 6);

  const tryWallet = WALLETS.find((w) => w.currency === 'TRY' && w.status === 'ACTIVE');
  const usdWallet = WALLETS.find((w) => w.currency === 'USD' && w.status === 'ACTIVE');
  const totalBalance = tryWallet ? tryWallet.balance : 0;
  const pendingCount = TRANSACTIONS.filter((t) => t.status === 'PENDING').length;

  return (
    <div className="bg-[#f5f7fa] text-text-primary">

      {/* Balance hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#003087] via-primary to-[#0070ba]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">

            {/* Left: balance */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <p className="text-white/70 text-sm font-medium">PayFlow Balance</p>
                <button aria-label="Toggle balance visibility" className="text-white/50 hover:text-white transition-colors">
                  <FontAwesomeIcon icon={faEye} className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tracking-tight">
                  ₺{totalBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {usdWallet && (
                  <span className="text-white/70 text-sm">
                    + ${usdWallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                )}
                {pendingCount > 0 && (
                  <Badge variant="warning" size="sm" dot>{pendingCount} pending</Badge>
                )}
              </div>
            </div>

            {/* Right: quick stats */}
            <div className="flex flex-wrap gap-3">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm px-5 py-3 text-white text-center min-w-[100px]">
                <p className="text-xl font-bold">+₺5,249</p>
                <p className="text-xs text-white/70 mt-0.5">Money In</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm px-5 py-3 text-white text-center min-w-[100px]">
                <p className="text-xl font-bold">-₺2,015</p>
                <p className="text-xs text-white/70 mt-0.5">Money Out</p>
              </div>
            </div>
          </div>

          {/* Quick action row */}
          <div className="mt-8 flex flex-wrap gap-3">
            {QUICK_ACTIONS.slice(0, 2).map((action) => (
              <Button
                key={action.label}
                as="a"
                href={action.href}
                variant="primary"
                size="md"
                className="rounded-full bg-white text-primary hover:bg-white/90 font-bold px-6 border-0 shadow-md"
                iconLeft={<FontAwesomeIcon icon={action.icon} className="w-4 h-4" aria-hidden="true" />}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative h-8 overflow-hidden">
          <svg viewBox="0 0 1440 32" className="absolute bottom-0 w-full fill-[#f5f7fa]" preserveAspectRatio="none">
            <path d="M0,32 C240,0 480,32 720,16 C960,0 1200,32 1440,16 L1440,32 Z" />
          </svg>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-10">

        {/* All Quick Actions grid */}
        <section>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-2xl bg-surface-base border border-border p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group text-center"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-full ${action.bg} transition-transform group-hover:scale-105`}>
                  <FontAwesomeIcon icon={action.icon} className="w-5 h-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-semibold text-text-primary">{action.label}</span>
                <span className="text-xs text-text-secondary">{action.desc}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Pending alert */}
        {pendingCount > 0 && (
          <section className="rounded-2xl border border-warning/40 bg-warning-subtle px-5 py-4 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/20 flex-shrink-0">
              <FontAwesomeIcon icon={faBolt} className="w-5 h-5 text-warning" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary">
                {pendingCount} transaction{pendingCount !== 1 ? 's' : ''} pending review
              </p>
              <p className="text-xs text-text-secondary mt-0.5">Funds will be available once confirmed.</p>
            </div>
            <Button as="a" href="/theme/fintech/transactions" variant="outline" size="sm" className="border-warning text-warning hover:bg-warning/10 shrink-0">
              Review
            </Button>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Activity */}
          <section className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Recent Activity</h2>
              <a href="/theme/fintech/transactions" className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline">
                See all <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
            <div className="rounded-2xl border border-border bg-surface-base shadow-sm overflow-hidden">
              {recentTx.map((tx, i) => (
                <div key={tx.transactionId} className={i !== recentTx.length - 1 ? 'border-b border-border' : ''}>
                  <TransactionRow transaction={tx} />
                </div>
              ))}
            </div>
          </section>

          {/* Sidebar: My Wallets */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">My Wallets</h2>
              <a href="/theme/fintech/wallets" className="text-sm text-primary font-semibold hover:underline">Manage</a>
            </div>
            <div className="space-y-2">
              {WALLETS.filter((w) => w.status === 'ACTIVE').map((wallet) => (
                <div
                  key={wallet.walletId}
                  className="rounded-xl border border-border bg-surface-base px-4 py-3 flex items-center justify-between gap-3 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-subtle font-bold text-primary text-sm">
                      {wallet.currency.slice(0, 1)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{wallet.currency} Wallet</p>
                      <p className="text-xs text-text-secondary">Available</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-text-primary">
                      {wallet.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-text-secondary">{wallet.currency}</p>
                  </div>
                </div>
              ))}
              <a
                href="/theme/fintech/wallets"
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-primary font-medium hover:bg-primary-subtle transition-colors"
              >
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" aria-hidden="true" />
                Add a wallet
              </a>
            </div>

            {/* Security card */}
            <div className="rounded-2xl overflow-hidden border border-border bg-gradient-to-br from-[#003087] to-primary p-5 text-white mt-4">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faShieldHalved} className="w-6 h-6 text-white/80" aria-hidden="true" />
                <p className="font-semibold">You're protected</p>
              </div>
              <p className="text-xs text-white/80 leading-relaxed mb-4">
                PayFlow's Purchase Protection covers your eligible transactions, keeping your money safe.
              </p>
              <div className="flex flex-col gap-1.5">
                {['Fraud monitoring 24/7', 'Encrypted transactions', 'Dispute resolution'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-white/90">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Trust features */}
        <section className="rounded-2xl border border-border bg-surface-base shadow-sm p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6 text-center">Why millions trust PayFlow</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {TRUST_FEATURES.map((feat) => (
              <div key={feat.title} className="flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle">
                  <FontAwesomeIcon icon={feat.icon} className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{feat.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats strip */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-surface-base p-5 flex flex-col items-center text-center gap-1 shadow-sm">
              <FontAwesomeIcon icon={stat.icon} className="w-5 h-5 text-primary mb-1" aria-hidden="true" />
              <p className="text-2xl font-black text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* CTA Banner */}
        <section className="rounded-2xl overflow-hidden relative bg-gradient-to-r from-[#003087] to-primary p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
          <div className="relative text-white space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Limited Time</p>
            <h3 className="text-xl font-black">Earn ₺50 when you invite a friend</h3>
            <p className="text-sm text-white/80">They send their first payment, you both get rewarded.</p>
          </div>
          <div className="relative flex gap-3 shrink-0">
            <Button
              variant="primary"
              className="bg-white text-primary hover:bg-white/90 border-0 font-bold rounded-full shadow-md"
              iconLeft={<FontAwesomeIcon icon={faUsers} className="w-4 h-4" aria-hidden="true" />}
            >
              Invite Friends
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}
