'use client';
import { useState } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { Pagination } from '@/modules/ui/Pagination';
import { Badge } from '@/modules/ui/Badge';
import { TransactionRow } from '@/modules/domains/fintech/transaction/TransactionRow';
import { TransactionVolumeChart } from '@/modules/domains/fintech/chart/TransactionVolumeChart';
import { PortfolioDonutChart } from '@/modules/domains/fintech/chart/PortfolioDonutChart';
import { CryptoPriceCard } from '@/modules/domains/fintech/crypto/CryptoPriceCard';
import { CurrencyExchangePanel } from '@/modules/domains/fintech/fx/CurrencyExchangePanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightArrowLeft,
  faDownload,
  faSearch,
  faArrowUp,
  faArrowDown,
  faCoins,
  faCreditCard,
  faUndo,
  faBan,
  faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons';
import type { TransactionType, TransactionStatus } from '@/modules/domains/fintech/types';
import { TRANSACTIONS, DAILY_VOLUMES, PORTFOLIO_ALLOCATION, CRYPTO_ASSETS } from '../fintech.data';

const FILTER_TABS: { label: string; value: TransactionType | 'ALL'; icon: Parameters<typeof FontAwesomeIcon>[0]['icon'] }[] = [
  { label: 'All',      value: 'ALL',     icon: faArrowRightArrowLeft },
  { label: 'Sent',     value: 'TRANSFER', icon: faArrowUp },
  { label: 'Received', value: 'DEPOSIT',  icon: faArrowDown },
  { label: 'Payments', value: 'PAYMENT',  icon: faCreditCard },
  { label: 'Exchange', value: 'FX',       icon: faCoins },
  { label: 'Refunds',  value: 'REFUND',   icon: faUndo },
];

const STATUS_OPTIONS: { label: string; value: TransactionStatus | 'ALL' }[] = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Completed',    value: 'COMPLETED' },
  { label: 'Pending',      value: 'PENDING' },
  { label: 'Failed',       value: 'FAILED' },
  { label: 'Cancelled',    value: 'CANCELLED' },
];

const PAGE_SIZE = 8;

export default function TransactionsPage() {
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [activeSection, setActiveSection] = useState<'activity' | 'analytics'>('activity');

  const filtered = TRANSACTIONS.filter((tx) => {
    const typeOk = typeFilter === 'ALL' || tx.type === typeFilter;
    const statusOk = statusFilter === 'ALL' || tx.status === statusFilter;
    const searchOk = !searchQuery || (tx.description ?? '').toLowerCase().includes(searchQuery.toLowerCase()) || (tx.reference ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return typeOk && statusOk && searchOk;
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const completedTx = TRANSACTIONS.filter((t) => t.status === 'COMPLETED');
  const totalIn = completedTx
    .filter((t) => t.type === 'DEPOSIT' || t.type === 'REFUND')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalOut = completedTx
    .filter((t) => t.type === 'WITHDRAW' || t.type === 'PAYMENT' || t.type === 'TRANSFER')
    .reduce((acc, t) => acc + t.amount, 0);

  function handleTypeChange(value: TransactionType | 'ALL') {
    setTypeFilter(value);
    setPage(1);
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(e.target.value as TransactionStatus | 'ALL');
    setPage(1);
  }

  return (
    <div className="bg-[#f5f7fa] min-h-screen">
      <DocumentTitle text={`Transactions — ${THEME_TITLES['fintech']}`} />
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-text-primary">Activity</h1>
            <p className="text-text-secondary mt-1 text-sm">Your complete payment history</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-base px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary hover:border-primary transition-colors">
            <FontAwesomeIcon icon={faDownload} className="w-3.5 h-3.5" aria-hidden="true" />
            Download Statement
          </button>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border bg-surface-base p-4 shadow-sm text-center">
            <p className="text-xs text-text-secondary mb-1">Money In</p>
            <p className="text-xl font-black text-[#188038]">+₺{totalIn.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-base p-4 shadow-sm text-center">
            <p className="text-xs text-text-secondary mb-1">Money Out</p>
            <p className="text-xl font-black text-error">-₺{totalOut.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-base p-4 shadow-sm text-center">
            <p className="text-xs text-text-secondary mb-1">Transactions</p>
            <p className="text-xl font-black text-text-primary">{TRANSACTIONS.length}</p>
          </div>
        </div>

        {/* Section toggle */}
        <div className="flex gap-1 p-1 rounded-xl bg-surface-sunken w-fit">
          {(['activity', 'analytics'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${activeSection === s ? 'bg-surface-base text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {activeSection === 'analytics' && (
          <div className="space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-border bg-surface-base shadow-sm overflow-hidden">
                <PortfolioDonutChart assets={PORTFOLIO_ALLOCATION} />
              </div>
              <div className="rounded-2xl border border-border bg-surface-base shadow-sm overflow-hidden">
                <TransactionVolumeChart data={DAILY_VOLUMES} />
              </div>
            </div>

            {/* Crypto markets */}
            <div>
              <h2 className="text-base font-bold text-text-primary mb-3">Crypto Markets</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CRYPTO_ASSETS.map((asset, i) => (
                  <CryptoPriceCard
                    key={i}
                    symbol={asset.symbol}
                    name={asset.name}
                    price={asset.price}
                    change24h={asset.change24h}
                    priceHistory={asset.priceHistory}
                    quoteCurrency={asset.quoteCurrency}
                  />
                ))}
              </div>
            </div>

            {/* FX Exchange panel */}
            <div className="rounded-2xl border border-border bg-surface-base shadow-sm overflow-hidden">
              <CurrencyExchangePanel />
            </div>
          </div>
        )}

        {activeSection === 'activity' && (
          <div className="space-y-5">
            {/* Filter tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTypeChange(tab.value)}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${typeFilter === tab.value ? 'bg-[#003087] text-white shadow-sm' : 'bg-surface-base border border-border text-text-secondary hover:border-primary hover:text-primary'}`}
                >
                  <FontAwesomeIcon icon={tab.icon} className="w-3.5 h-3.5" aria-hidden="true" />
                  {tab.label}
                  {tab.value !== 'ALL' && (
                    <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${typeFilter === tab.value ? 'bg-white/20' : 'bg-surface-sunken'}`}>
                      {TRANSACTIONS.filter((t) => t.type === tab.value).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search + status filter row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  placeholder="Search transactions..."
                  className="w-full rounded-xl border border-border bg-surface-base pl-9 pr-4 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
                />
              </div>
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                aria-label="Filter by status"
                className="rounded-xl border border-border bg-surface-base px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <span className="text-xs text-text-secondary whitespace-nowrap">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Transaction list */}
            {paginated.length > 0 ? (
              <div className="rounded-2xl border border-border bg-surface-base shadow-sm overflow-hidden">
                {paginated.map((tx, i) => (
                  <div key={tx.transactionId} className={i !== paginated.length - 1 ? 'border-b border-border' : ''}>
                    <TransactionRow transaction={tx} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-20 text-center rounded-2xl border border-dashed border-border bg-surface-base">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-sunken">
                  <FontAwesomeIcon icon={faBan} className="w-7 h-7 text-text-secondary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-base font-bold text-text-primary">No transactions found</p>
                  <p className="text-sm text-text-secondary mt-1">Try adjusting your filters or search term.</p>
                </div>
                <button
                  onClick={() => { setTypeFilter('ALL'); setStatusFilter('ALL'); setSearchQuery(''); setPage(1); }}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filtered.length > PAGE_SIZE && (
              <div className="flex justify-center">
                <Pagination
                  page={page}
                  totalPages={Math.ceil(filtered.length / PAGE_SIZE)}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}

        {/* Dispute banner */}
        <div className="rounded-2xl border border-border bg-surface-base p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-subtle flex-shrink-0">
            <FontAwesomeIcon icon={faMoneyBillWave} className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-primary">See something wrong?</p>
            <p className="text-xs text-text-secondary mt-0.5">If you don't recognize a transaction, you can dispute it within 180 days.</p>
          </div>
          <a href="/theme/fintech" className="text-sm text-primary font-semibold hover:underline shrink-0">Open Dispute</a>
        </div>

      </div>
    </div>
  );
}
