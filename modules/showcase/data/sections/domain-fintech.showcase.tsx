'use client';
import type { ShowcaseComponent } from '../showcase.types';
import { WalletStatusBadge } from '@/modules/domains/fintech/wallet/WalletStatusBadge';
import { CurrencyBadge } from '@/modules/domains/fintech/wallet/CurrencyBadge';
import { WalletCard } from '@/modules/domains/fintech/wallet/WalletCard';
import { TransactionTypeBadge } from '@/modules/domains/fintech/transaction/TransactionTypeBadge';
import { TransactionStatusBadge } from '@/modules/domains/fintech/transaction/TransactionStatusBadge';
import { TransactionRow } from '@/modules/domains/fintech/transaction/TransactionRow';
import type { Wallet, Transaction } from '@/modules/domains/fintech/types';
import { PortfolioHoldingRow } from '@/modules/domains/fintech/portfolio/PortfolioHoldingRow';
import { AssetAllocationCard } from '@/modules/domains/fintech/portfolio/AssetAllocationCard';
import { PerformanceSparkline } from '@/modules/domains/fintech/portfolio/PerformanceSparkline';
import { PaymentCardTile } from '@/modules/domains/fintech/card/PaymentCardTile';
import { CardLimitMeter } from '@/modules/domains/fintech/card/CardLimitMeter';
import { CardActionMenu } from '@/modules/domains/fintech/card/CardActionMenu';

/* ─── demo data ─── */

const DEMO_WALLET_PRIMARY: Wallet = {
  walletId: 'wallet-demo-001',
  userId: 'user-demo',
  type: 'USER',
  status: 'ACTIVE',
  currency: 'TRY',
  balance: 24_850.75,
  availableBalance: 22_350.75,
  lockedBalance: 2_500.00,
  createdAt: new Date('2024-01-15'),
};

const DEMO_WALLET_USD: Wallet = {
  walletId: 'wallet-demo-002',
  userId: 'user-demo',
  type: 'USER',
  status: 'ACTIVE',
  currency: 'USD',
  balance: 3_420.00,
  availableBalance: 3_420.00,
  lockedBalance: 0,
  createdAt: new Date('2024-03-20'),
};

const DEMO_WALLET_FROZEN: Wallet = {
  walletId: 'wallet-demo-003',
  userId: 'user-demo',
  type: 'USER',
  status: 'FROZEN',
  currency: 'EUR',
  balance: 1_200.00,
  availableBalance: 0,
  lockedBalance: 1_200.00,
  createdAt: new Date('2024-06-10'),
};

const DEMO_TRANSACTION_DEPOSIT: Transaction = {
  transactionId: 'txn-demo-001',
  walletId: 'wallet-demo-001',
  type: 'DEPOSIT',
  status: 'COMPLETED',
  amount: 5_000.00,
  currency: 'TRY',
  fee: 0,
  description: 'Salary deposit from Acme Corp',
  createdAt: new Date('2026-05-01T09:15:00Z'),
  completedAt: new Date('2026-05-01T09:15:30Z'),
};

const DEMO_TRANSACTION_PAYMENT: Transaction = {
  transactionId: 'txn-demo-002',
  walletId: 'wallet-demo-001',
  type: 'PAYMENT',
  status: 'PENDING',
  amount: 349.99,
  currency: 'TRY',
  fee: 0,
  description: 'Netflix subscription',
  createdAt: new Date('2026-05-02T14:30:00Z'),
};

const DEMO_TRANSACTION_FAILED: Transaction = {
  transactionId: 'txn-demo-003',
  walletId: 'wallet-demo-001',
  type: 'TRANSFER',
  status: 'FAILED',
  amount: 1_000.00,
  currency: 'TRY',
  fee: 5.00,
  description: 'Transfer to savings',
  createdAt: new Date('2026-05-03T11:00:00Z'),
};

/* ─── builder ─── */

export function buildFintechDomainData(): ShowcaseComponent[] {
  return [
    {
      id: 'fintech-wallet-status-badge',
      title: 'WalletStatusBadge',
      category: 'Domain',
      abbr: 'WS',
      description: 'Displays wallet status with semantic colour coding: ACTIVE, FROZEN, CLOSED.',
      filePath: 'modules/domains/fintech/wallet/WalletStatusBadge.tsx',
      sourceCode: `import { WalletStatusBadge } from '@/modules/domains/fintech/wallet/WalletStatusBadge';
<WalletStatusBadge status="ACTIVE" />`,
      variants: [
        {
          title: 'All statuses',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['ACTIVE', 'FROZEN', 'CLOSED'] as const).map((s) => (
                <WalletStatusBadge key={s} status={s} />
              ))}
            </div>
          ),
          code: `{(['ACTIVE', 'FROZEN', 'CLOSED'] as const).map((s) => (
  <WalletStatusBadge key={s} status={s} />
))}`,
        },
        {
          title: 'Sizes',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap items-center gap-2">
              <WalletStatusBadge status="ACTIVE" size="sm" />
              <WalletStatusBadge status="ACTIVE" size="md" />
            </div>
          ),
          code: `<WalletStatusBadge status="ACTIVE" size="sm" />
<WalletStatusBadge status="ACTIVE" size="md" />`,
        },
      ],
    },
    {
      id: 'fintech-currency-badge',
      title: 'CurrencyBadge',
      category: 'Domain',
      abbr: 'CB',
      description: 'Currency code badge with distinct colour per currency: TRY, USD, EUR, GBP, BTC, ETH.',
      filePath: 'modules/domains/fintech/wallet/CurrencyBadge.tsx',
      sourceCode: `import { CurrencyBadge } from '@/modules/domains/fintech/wallet/CurrencyBadge';
<CurrencyBadge currency="USD" />`,
      variants: [
        {
          title: 'All currencies',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['TRY', 'USD', 'EUR', 'GBP', 'BTC', 'ETH'] as const).map((c) => (
                <CurrencyBadge key={c} currency={c} />
              ))}
            </div>
          ),
          code: `{(['TRY', 'USD', 'EUR', 'GBP', 'BTC', 'ETH'] as const).map((c) => (
  <CurrencyBadge key={c} currency={c} />
))}`,
        },
        {
          title: 'Small size',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['TRY', 'USD', 'EUR'] as const).map((c) => (
                <CurrencyBadge key={c} currency={c} size="sm" />
              ))}
            </div>
          ),
          code: `<CurrencyBadge currency="TRY" size="sm" />
<CurrencyBadge currency="USD" size="sm" />
<CurrencyBadge currency="EUR" size="sm" />`,
        },
      ],
    },
    {
      id: 'fintech-transaction-type-badge',
      title: 'TransactionTypeBadge',
      category: 'Domain',
      abbr: 'TT',
      description: 'Colour-coded badge for transaction type: DEPOSIT, WITHDRAW, TRANSFER, PAYMENT, REFUND, FX, FEE.',
      filePath: 'modules/domains/fintech/transaction/TransactionTypeBadge.tsx',
      sourceCode: `import { TransactionTypeBadge } from '@/modules/domains/fintech/transaction/TransactionTypeBadge';
<TransactionTypeBadge type="DEPOSIT" />`,
      variants: [
        {
          title: 'All types',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['DEPOSIT', 'WITHDRAW', 'TRANSFER', 'PAYMENT', 'REFUND', 'FX', 'FEE'] as const).map((t) => (
                <TransactionTypeBadge key={t} type={t} />
              ))}
            </div>
          ),
          code: `{(['DEPOSIT', 'WITHDRAW', 'TRANSFER', 'PAYMENT', 'REFUND', 'FX', 'FEE'] as const).map((t) => (
  <TransactionTypeBadge key={t} type={t} />
))}`,
        },
        {
          title: 'Small size',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['DEPOSIT', 'PAYMENT', 'REFUND'] as const).map((t) => (
                <TransactionTypeBadge key={t} type={t} size="sm" />
              ))}
            </div>
          ),
          code: `<TransactionTypeBadge type="DEPOSIT" size="sm" />
<TransactionTypeBadge type="PAYMENT" size="sm" />
<TransactionTypeBadge type="REFUND" size="sm" />`,
        },
      ],
    },
    {
      id: 'fintech-transaction-status-badge',
      title: 'TransactionStatusBadge',
      category: 'Domain',
      abbr: 'TS',
      description: 'Status badge tracking a transaction lifecycle: PENDING, COMPLETED, FAILED, CANCELLED.',
      filePath: 'modules/domains/fintech/transaction/TransactionStatusBadge.tsx',
      sourceCode: `import { TransactionStatusBadge } from '@/modules/domains/fintech/transaction/TransactionStatusBadge';
<TransactionStatusBadge status="COMPLETED" />`,
      variants: [
        {
          title: 'All statuses',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap gap-2">
              {(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'] as const).map((s) => (
                <TransactionStatusBadge key={s} status={s} />
              ))}
            </div>
          ),
          code: `{(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'] as const).map((s) => (
  <TransactionStatusBadge key={s} status={s} />
))}`,
        },
        {
          title: 'Small size',
          layout: 'stack',
          preview: (
            <div className="flex flex-wrap items-center gap-2">
              <TransactionStatusBadge status="COMPLETED" size="sm" />
              <TransactionStatusBadge status="PENDING" size="sm" />
              <TransactionStatusBadge status="FAILED" size="sm" />
            </div>
          ),
          code: `<TransactionStatusBadge status="COMPLETED" size="sm" />
<TransactionStatusBadge status="PENDING" size="sm" />
<TransactionStatusBadge status="FAILED" size="sm" />`,
        },
      ],
    },
    {
      id: 'fintech-wallet-card',
      title: 'WalletCard',
      category: 'Domain',
      abbr: 'WC',
      description: 'Wallet card displaying balance, currency, status, and account reference with a premium gradient look.',
      filePath: 'modules/domains/fintech/wallet/WalletCard.tsx',
      sourceCode: `import { WalletCard } from '@/modules/domains/fintech/wallet/WalletCard';
<WalletCard wallet={wallet} />`,
      variants: [
        {
          title: 'Active primary (TRY)',
          preview: (
            <div className="max-w-sm w-full">
              <WalletCard wallet={DEMO_WALLET_PRIMARY} />
            </div>
          ),
          code: `<WalletCard wallet={wallet} />`,
        },
        {
          title: 'Frozen wallet (EUR)',
          preview: (
            <div className="max-w-sm w-full">
              <WalletCard wallet={DEMO_WALLET_FROZEN} />
            </div>
          ),
          code: `<WalletCard wallet={{ ...wallet, status: 'FROZEN' }} />`,
        },
        {
          title: 'USD wallet',
          preview: (
            <div className="max-w-sm w-full">
              <WalletCard wallet={DEMO_WALLET_USD} />
            </div>
          ),
          code: `<WalletCard wallet={usdWallet} />`,
        },
      ],
    },
    {
      id: 'fintech-transaction-row',
      title: 'TransactionRow',
      category: 'Domain',
      abbr: 'TR',
      description: 'Transaction list row with icon, description, date, amount (coloured by direction), and status badge.',
      filePath: 'modules/domains/fintech/transaction/TransactionRow.tsx',
      sourceCode: `import { TransactionRow } from '@/modules/domains/fintech/transaction/TransactionRow';
<TransactionRow transaction={transaction} />`,
      variants: [
        {
          title: 'Completed deposit',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-lg">
              <TransactionRow transaction={DEMO_TRANSACTION_DEPOSIT} />
            </div>
          ),
          code: `<TransactionRow transaction={depositTransaction} />`,
        },
        {
          title: 'Mixed statuses',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-lg flex flex-col gap-2">
              <TransactionRow transaction={DEMO_TRANSACTION_DEPOSIT} />
              <TransactionRow transaction={DEMO_TRANSACTION_PAYMENT} />
              <TransactionRow transaction={DEMO_TRANSACTION_FAILED} />
            </div>
          ),
          code: `<TransactionRow transaction={depositTx} />
<TransactionRow transaction={paymentTx} />
<TransactionRow transaction={failedTx} />`,
        },
      ],
    },
    {
      id: 'fintech-portfolio-holding-row',
      title: 'PortfolioHoldingRow',
      category: 'Domain',
      abbr: 'PR',
      description: 'Portfolio table row: currency badge, name, holding amount, USD value, 24h delta, P&L.',
      filePath: 'modules/domains/fintech/portfolio/PortfolioHoldingRow.tsx',
      sourceCode: `import { PortfolioHoldingRow } from '@/modules/domains/fintech/portfolio/PortfolioHoldingRow';
<PortfolioHoldingRow symbol="BTC" name="Bitcoin" amount={0.05} currency="BTC" usdValue={3421} costBasis={2980} dayChangePct={2.34} />`,
      variants: [
        {
          title: 'Profit / loss rows',
          layout: 'stack',
          preview: (
            <div className="flex flex-col gap-2 w-full max-w-3xl">
              <PortfolioHoldingRow symbol="BTC" name="Bitcoin"  amount={0.05} currency="BTC" usdValue={3421} costBasis={2980} dayChangePct={2.34} />
              <PortfolioHoldingRow symbol="ETH" name="Ethereum" amount={1.46} currency="ETH" usdValue={4611} costBasis={5120} dayChangePct={-1.18} />
              <PortfolioHoldingRow symbol="EUR" name="Euro Holdings" amount={1180.50} currency="EUR" usdValue={1298} costBasis={1212} dayChangePct={0.42} />
            </div>
          ),
          code: `<PortfolioHoldingRow symbol="BTC" amount={0.05} currency="BTC" usdValue={3421} costBasis={2980} dayChangePct={2.34} />`,
        },
        {
          title: 'No cost basis (no P&L)',
          layout: 'stack',
          preview: (
            <div className="w-full max-w-3xl">
              <PortfolioHoldingRow symbol="USD" name="US Dollar Reserve" amount={3420} currency="USD" usdValue={3420} dayChangePct={0} />
            </div>
          ),
          code: `<PortfolioHoldingRow symbol="USD" amount={3420} currency="USD" usdValue={3420} />`,
        },
      ],
    },
    {
      id: 'fintech-asset-allocation-card',
      title: 'AssetAllocationCard',
      category: 'Domain',
      abbr: 'AA',
      description: 'Donut chart + total / change header. Self-contained portfolio summary tile.',
      filePath: 'modules/domains/fintech/portfolio/AssetAllocationCard.tsx',
      sourceCode: `import { AssetAllocationCard } from '@/modules/domains/fintech/portfolio/AssetAllocationCard';
<AssetAllocationCard assets={[{ currency, usdEquivalent }]} changePct={4.2} changeAbsUsd={464} />`,
      variants: [
        {
          title: 'Positive change',
          layout: 'stack',
          preview: (
            <div className="max-w-sm">
              <AssetAllocationCard
                assets={[
                  { currency: 'TRY', usdEquivalent: 766 },
                  { currency: 'USD', usdEquivalent: 3420 },
                  { currency: 'EUR', usdEquivalent: 1298 },
                  { currency: 'BTC', usdEquivalent: 3421 },
                  { currency: 'ETH', usdEquivalent: 4611 },
                ]}
                changePct={4.2}
                changeAbsUsd={552}
              />
            </div>
          ),
          code: `<AssetAllocationCard assets={[...]} changePct={4.2} changeAbsUsd={552} />`,
        },
        {
          title: 'Negative change',
          layout: 'stack',
          preview: (
            <div className="max-w-sm">
              <AssetAllocationCard
                assets={[
                  { currency: 'USD', usdEquivalent: 1200 },
                  { currency: 'EUR', usdEquivalent: 380 },
                  { currency: 'BTC', usdEquivalent: 950 },
                ]}
                changePct={-2.8}
                changeAbsUsd={-72}
              />
            </div>
          ),
          code: `<AssetAllocationCard assets={[...]} changePct={-2.8} changeAbsUsd={-72} />`,
        },
      ],
    },
    {
      id: 'fintech-performance-sparkline',
      title: 'PerformanceSparkline',
      category: 'Domain',
      abbr: 'PS',
      description: 'Inline sparkline + percent change label. Auto-colors green / red based on net change.',
      filePath: 'modules/domains/fintech/portfolio/PerformanceSparkline.tsx',
      sourceCode: `import { PerformanceSparkline } from '@/modules/domains/fintech/portfolio/PerformanceSparkline';
<PerformanceSparkline series={[10840, 10980, 11100, ...]} />`,
      variants: [
        {
          title: 'Trending up',
          layout: 'stack',
          preview: (
            <div className="max-w-md">
              <PerformanceSparkline series={[10840, 10980, 11100, 11240, 11380, 11320, 11460, 11550, 11680, 11516]} />
            </div>
          ),
          code: `<PerformanceSparkline series={[10840, ..., 11516]} />`,
        },
        {
          title: 'Trending down',
          layout: 'stack',
          preview: (
            <div className="max-w-md">
              <PerformanceSparkline series={[12500, 12350, 12200, 12290, 12100, 11960, 11820, 11750, 11600, 11450]} />
            </div>
          ),
          code: `<PerformanceSparkline series={[12500, ..., 11450]} />`,
        },
      ],
    },
    {
      id: 'fintech-payment-card-tile',
      title: 'PaymentCardTile',
      category: 'Domain',
      abbr: 'PT',
      description: 'Skeuomorphic payment card tile with scheme brand, kind icon (virtual / physical), and status badge.',
      filePath: 'modules/domains/fintech/card/PaymentCardTile.tsx',
      sourceCode: `import { PaymentCardTile } from '@/modules/domains/fintech/card/PaymentCardTile';
<PaymentCardTile nickname="Daily spend" scheme="visa" kind="physical" status="active" last4="4291" expiry="11/28" cardholderName="Alex Carter" />`,
      variants: [
        {
          title: 'Three states',
          layout: 'stack',
          preview: (
            <div className="grid gap-3 sm:grid-cols-3 max-w-3xl">
              <PaymentCardTile
                nickname="Daily spend"
                scheme="visa"
                kind="physical"
                status="active"
                last4="4291"
                expiry="11/28"
                cardholderName="Alex Carter"
              />
              <PaymentCardTile
                nickname="Travel backup"
                scheme="amex"
                kind="physical"
                status="frozen"
                last4="7350"
                expiry="03/29"
                cardholderName="Alex Carter"
              />
              <PaymentCardTile
                nickname="Old gift card"
                scheme="visa"
                kind="virtual"
                status="expired"
                last4="0019"
                expiry="01/24"
                cardholderName="Alex Carter"
              />
            </div>
          ),
          code: `<PaymentCardTile nickname="…" scheme="visa" kind="physical" status="active" last4="4291" expiry="11/28" />`,
        },
        {
          title: 'Virtual card',
          layout: 'stack',
          preview: (
            <div className="max-w-xs">
              <PaymentCardTile
                nickname="Subscriptions only"
                scheme="mastercard"
                kind="virtual"
                status="active"
                last4="8104"
                expiry="07/27"
                cardholderName="Alex Carter"
              />
            </div>
          ),
          code: `<PaymentCardTile scheme="mastercard" kind="virtual" status="active" />`,
        },
      ],
    },
    {
      id: 'fintech-card-limit-meter',
      title: 'CardLimitMeter',
      category: 'Domain',
      abbr: 'LM',
      description: 'Progress bar showing spend vs. limit. Color shifts at warning + over-limit thresholds.',
      filePath: 'modules/domains/fintech/card/CardLimitMeter.tsx',
      sourceCode: `import { CardLimitMeter } from '@/modules/domains/fintech/card/CardLimitMeter';
<CardLimitMeter spent={1820} limit={3000} currency="USD" />`,
      variants: [
        {
          title: 'Three thresholds',
          layout: 'stack',
          preview: (
            <div className="grid gap-3 sm:grid-cols-3 max-w-3xl">
              <CardLimitMeter spent={920}  limit={3000} currency="USD" label="Within budget" />
              <CardLimitMeter spent={2640} limit={3000} currency="USD" label="Near limit" />
              <CardLimitMeter spent={3180} limit={3000} currency="USD" label="Over limit" />
            </div>
          ),
          code: `<CardLimitMeter spent={920} limit={3000} currency="USD" />`,
        },
      ],
    },
    {
      id: 'fintech-card-action-menu',
      title: 'CardActionMenu',
      category: 'Domain',
      abbr: 'CA',
      description: 'Three-dot menu with status-aware actions (freeze / unfreeze / show / limits / delete).',
      filePath: 'modules/domains/fintech/card/CardActionMenu.tsx',
      sourceCode: `import { CardActionMenu } from '@/modules/domains/fintech/card/CardActionMenu';
<CardActionMenu status="active" onFreeze={...} onShowDetails={...} onUpdateLimits={...} onDelete={...} />`,
      variants: [
        {
          title: 'Active card menu',
          layout: 'stack',
          preview: (
            <div className="flex items-center gap-3 p-4 bg-surface-raised rounded-lg border border-border">
              <span className="text-sm text-text-secondary">Click the dots →</span>
              <CardActionMenu
                status="active"
                onFreeze={() => undefined}
                onShowDetails={() => undefined}
                onUpdateLimits={() => undefined}
                onDelete={() => undefined}
              />
            </div>
          ),
          code: `<CardActionMenu status="active" onFreeze={...} onShowDetails={...} onUpdateLimits={...} onDelete={...} />`,
        },
        {
          title: 'Frozen card menu',
          layout: 'stack',
          preview: (
            <div className="flex items-center gap-3 p-4 bg-surface-raised rounded-lg border border-border">
              <span className="text-sm text-text-secondary">Click the dots →</span>
              <CardActionMenu
                status="frozen"
                onUnfreeze={() => undefined}
                onShowDetails={() => undefined}
                onUpdateLimits={() => undefined}
                onDelete={() => undefined}
              />
            </div>
          ),
          code: `<CardActionMenu status="frozen" onUnfreeze={...} onShowDetails={...} />`,
        },
      ],
    },
  ];
}
