import type { Wallet, Transaction, Currency } from '@/modules/domains/fintech/types';

/* ── Chart data ── */

export type DailyVolume = { date: string; deposit: number; withdraw: number; payment: number; transfer: number };

export const DAILY_VOLUMES: DailyVolume[] = [
  { date: '05/01', deposit: 5000, withdraw: 0,    payment: 349.99, transfer: 0    },
  { date: '05/02', deposit: 0,    withdraw: 0,    payment: 349.99, transfer: 0    },
  { date: '05/03', deposit: 0,    withdraw: 0,    payment: 0,      transfer: 1000 },
  { date: '05/04', deposit: 0,    withdraw: 2000, payment: 0,      transfer: 0    },
  { date: '05/05', deposit: 249,  withdraw: 0,    payment: 0,      transfer: 0    },
  { date: '05/06', deposit: 1200, withdraw: 0,    payment: 750,    transfer: 0    },
  { date: '05/07', deposit: 0,    withdraw: 0,    payment: 299,    transfer: 500  },
];

export const PORTFOLIO_ALLOCATION = [
  { currency: 'TRY', usdEquivalent: 766  },
  { currency: 'USD', usdEquivalent: 3420 },
  { currency: 'EUR', usdEquivalent: 1298 },
  { currency: 'BTC', usdEquivalent: 3421 },
  { currency: 'ETH', usdEquivalent: 4611 },
];

export const CRYPTO_ASSETS = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 68420.50,
    change24h: 2.34,
    priceHistory: [65200, 66800, 64500, 67200, 68900, 67600, 68420],
    quoteCurrency: 'USD',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3842.20,
    change24h: -1.12,
    priceHistory: [3620, 3780, 3540, 3820, 3950, 3810, 3842],
    quoteCurrency: 'USD',
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 2219733,
    change24h: 3.01,
    priceHistory: [2116000, 2168000, 2094000, 2181000, 2237000, 2195000, 2219733],
    quoteCurrency: 'TRY',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 124679,
    change24h: -0.88,
    priceHistory: [117490, 122614, 114907, 123960, 128163, 123630, 124679],
    quoteCurrency: 'TRY',
  },
];

/* ── Wallets & Transactions ── */

export const WALLETS: Wallet[] = [
  {
    walletId: 'wallet-001',
    userId: 'user-001',
    type: 'USER',
    status: 'ACTIVE',
    currency: 'TRY',
    balance: 24_850.75,
    availableBalance: 22_350.75,
    lockedBalance: 2_500.00,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2026-05-07'),
  },
  {
    walletId: 'wallet-002',
    userId: 'user-001',
    type: 'USER',
    status: 'ACTIVE',
    currency: 'USD',
    balance: 3_420.00,
    availableBalance: 3_420.00,
    lockedBalance: 0,
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2026-05-06'),
  },
  {
    walletId: 'wallet-003',
    userId: 'user-001',
    type: 'USER',
    status: 'FROZEN',
    currency: 'EUR',
    balance: 1_200.00,
    availableBalance: 0,
    lockedBalance: 1_200.00,
    createdAt: new Date('2024-06-10'),
    updatedAt: new Date('2026-04-01'),
  },
  {
    walletId: 'wallet-004',
    userId: 'user-001',
    type: 'USER',
    status: 'ACTIVE',
    currency: 'BTC',
    balance: 0.05,
    availableBalance: 0.05,
    lockedBalance: 0,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2026-05-07'),
  },
  {
    walletId: 'wallet-005',
    userId: 'user-001',
    type: 'USER',
    status: 'ACTIVE',
    currency: 'ETH',
    balance: 1.2,
    availableBalance: 1.2,
    lockedBalance: 0,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2026-05-07'),
  },
];

export const TRANSACTIONS: Transaction[] = [
  {
    transactionId: 'txn-001',
    walletId: 'wallet-001',
    type: 'DEPOSIT',
    status: 'COMPLETED',
    amount: 5_000.00,
    currency: 'TRY',
    fee: 0,
    reference: 'REF-20260501',
    description: 'Salary deposit from Acme Corp',
    createdAt: new Date('2026-05-01T09:15:00Z'),
    completedAt: new Date('2026-05-01T09:15:30Z'),
  },
  {
    transactionId: 'txn-002',
    walletId: 'wallet-001',
    type: 'PAYMENT',
    status: 'COMPLETED',
    amount: 349.99,
    currency: 'TRY',
    fee: 0,
    reference: 'PAY-20260502',
    description: 'Netflix subscription',
    createdAt: new Date('2026-05-02T14:30:00Z'),
    completedAt: new Date('2026-05-02T14:30:05Z'),
  },
  {
    transactionId: 'txn-003',
    walletId: 'wallet-001',
    type: 'TRANSFER',
    status: 'COMPLETED',
    amount: 1_000.00,
    currency: 'TRY',
    fee: 5.00,
    reference: 'TRF-20260503',
    description: 'Transfer to savings wallet',
    createdAt: new Date('2026-05-03T11:00:00Z'),
    completedAt: new Date('2026-05-03T11:00:10Z'),
  },
  {
    transactionId: 'txn-004',
    walletId: 'wallet-002',
    type: 'FX',
    status: 'COMPLETED',
    amount: 500.00,
    currency: 'USD',
    fee: 2.50,
    reference: 'FX-20260503',
    description: 'USD to TRY exchange',
    createdAt: new Date('2026-05-03T12:00:00Z'),
    completedAt: new Date('2026-05-03T12:00:20Z'),
  },
  {
    transactionId: 'txn-005',
    walletId: 'wallet-001',
    type: 'WITHDRAW',
    status: 'COMPLETED',
    amount: 2_000.00,
    currency: 'TRY',
    fee: 10.00,
    reference: 'WD-20260504',
    description: 'ATM withdrawal',
    createdAt: new Date('2026-05-04T16:45:00Z'),
    completedAt: new Date('2026-05-04T16:45:30Z'),
  },
  {
    transactionId: 'txn-006',
    walletId: 'wallet-001',
    type: 'REFUND',
    status: 'COMPLETED',
    amount: 249.00,
    currency: 'TRY',
    fee: 0,
    reference: 'RFD-20260505',
    description: 'Refund from online purchase',
    createdAt: new Date('2026-05-05T10:00:00Z'),
    completedAt: new Date('2026-05-05T10:02:00Z'),
  },
  {
    transactionId: 'txn-007',
    walletId: 'wallet-001',
    type: 'FEE',
    status: 'COMPLETED',
    amount: 15.00,
    currency: 'TRY',
    fee: 0,
    description: 'Monthly account maintenance fee',
    createdAt: new Date('2026-05-05T00:00:00Z'),
    completedAt: new Date('2026-05-05T00:00:01Z'),
  },
  {
    transactionId: 'txn-008',
    walletId: 'wallet-002',
    type: 'DEPOSIT',
    status: 'PENDING',
    amount: 1_200.00,
    currency: 'USD',
    fee: 0,
    reference: 'DEP-20260506',
    description: 'Wire transfer from Chase Bank',
    createdAt: new Date('2026-05-06T08:30:00Z'),
  },
  {
    transactionId: 'txn-009',
    walletId: 'wallet-001',
    type: 'PAYMENT',
    status: 'FAILED',
    amount: 750.00,
    currency: 'TRY',
    fee: 0,
    reference: 'PAY-20260506',
    description: 'Failed utility bill payment',
    createdAt: new Date('2026-05-06T13:00:00Z'),
  },
  {
    transactionId: 'txn-010',
    walletId: 'wallet-001',
    type: 'TRANSFER',
    status: 'PENDING',
    amount: 500.00,
    currency: 'TRY',
    fee: 2.50,
    reference: 'TRF-20260507',
    description: 'Transfer to John Doe',
    createdAt: new Date('2026-05-07T09:00:00Z'),
  },
  {
    transactionId: 'txn-011',
    walletId: 'wallet-001',
    type: 'PAYMENT',
    status: 'CANCELLED',
    amount: 299.00,
    currency: 'TRY',
    fee: 0,
    reference: 'PAY-20260507',
    description: 'Cancelled subscription order',
    createdAt: new Date('2026-05-07T11:30:00Z'),
  },
  {
    transactionId: 'txn-012',
    walletId: 'wallet-002',
    type: 'FX',
    status: 'PENDING',
    amount: 200.00,
    currency: 'USD',
    fee: 1.00,
    reference: 'FX-20260507',
    description: 'USD to EUR exchange',
    createdAt: new Date('2026-05-07T15:45:00Z'),
  },
  {
    transactionId: 'txn-013',
    walletId: 'wallet-004',
    type: 'DEPOSIT',
    status: 'COMPLETED',
    amount: 0.02,
    currency: 'BTC',
    fee: 0.0001,
    reference: 'CRYPTO-20260430',
    description: 'BTC deposit from external wallet',
    createdAt: new Date('2026-04-30T10:00:00Z'),
    completedAt: new Date('2026-04-30T10:15:00Z'),
  },
  {
    transactionId: 'txn-014',
    walletId: 'wallet-004',
    type: 'WITHDRAW',
    status: 'COMPLETED',
    amount: 0.005,
    currency: 'BTC',
    fee: 0.0002,
    reference: 'CRYPTO-20260505',
    description: 'BTC transfer to hardware wallet',
    createdAt: new Date('2026-05-05T14:00:00Z'),
    completedAt: new Date('2026-05-05T14:20:00Z'),
  },
  {
    transactionId: 'txn-015',
    walletId: 'wallet-005',
    type: 'DEPOSIT',
    status: 'COMPLETED',
    amount: 0.5,
    currency: 'ETH',
    fee: 0.002,
    reference: 'CRYPTO-20260502',
    description: 'ETH purchase via crypto exchange',
    createdAt: new Date('2026-05-02T09:00:00Z'),
    completedAt: new Date('2026-05-02T09:05:00Z'),
  },
  {
    transactionId: 'txn-016',
    walletId: 'wallet-005',
    type: 'FX',
    status: 'PENDING',
    amount: 0.3,
    currency: 'ETH',
    fee: 0.001,
    reference: 'FX-CRYPTO-20260507',
    description: 'ETH to USD conversion',
    createdAt: new Date('2026-05-07T16:00:00Z'),
  },
];

/* =========================================================
   PORTFOLIO HOLDINGS (for /portfolio)
========================================================= */

export type PortfolioHolding = {
  symbol: string;
  name: string;
  amount: number;
  currency: Currency;
  usdValue: number;
  costBasis: number;
  dayChangePct: number;
};

export const PORTFOLIO_HOLDINGS: PortfolioHolding[] = [
  { symbol: 'BTC',  name: 'Bitcoin',           amount: 0.05,    currency: 'BTC', usdValue: 3421, costBasis: 2980, dayChangePct: 2.34 },
  { symbol: 'ETH',  name: 'Ethereum',          amount: 1.46,    currency: 'ETH', usdValue: 4611, costBasis: 5120, dayChangePct: -1.18 },
  { symbol: 'USD',  name: 'US Dollar Reserve', amount: 3420.00, currency: 'USD', usdValue: 3420, costBasis: 3420, dayChangePct: 0    },
  { symbol: 'EUR',  name: 'Euro Holdings',     amount: 1180.50, currency: 'EUR', usdValue: 1298, costBasis: 1212, dayChangePct: 0.42 },
  { symbol: 'TRY',  name: 'Turkish Lira',      amount: 23420.00, currency: 'TRY', usdValue: 766,  costBasis: 880,  dayChangePct: -0.55 },
];

export const PORTFOLIO_PERFORMANCE_SERIES = [
  10840, 10980, 11100, 11240, 11380, 11320, 11460, 11550, 11680, 11516,
];

/* =========================================================
   PAYMENT CARDS (for /cards)
========================================================= */

export type PaymentCardData = {
  cardId: string;
  nickname: string;
  scheme: 'visa' | 'mastercard' | 'amex';
  kind: 'virtual' | 'physical';
  status: 'active' | 'frozen' | 'expired';
  last4: string;
  expiry: string;
  cardholderName: string;
  monthlySpent: number;
  monthlyLimit: number;
  currency: string;
};

export const PAYMENT_CARDS: PaymentCardData[] = [
  {
    cardId: 'card-01',
    nickname: 'Daily spend',
    scheme: 'visa',
    kind: 'physical',
    status: 'active',
    last4: '4291',
    expiry: '11/28',
    cardholderName: 'Alex Carter',
    monthlySpent: 1820,
    monthlyLimit: 3000,
    currency: 'USD',
  },
  {
    cardId: 'card-02',
    nickname: 'Subscriptions only',
    scheme: 'mastercard',
    kind: 'virtual',
    status: 'active',
    last4: '8104',
    expiry: '07/27',
    cardholderName: 'Alex Carter',
    monthlySpent: 92,
    monthlyLimit: 250,
    currency: 'USD',
  },
  {
    cardId: 'card-03',
    nickname: 'Travel backup',
    scheme: 'amex',
    kind: 'physical',
    status: 'frozen',
    last4: '7350',
    expiry: '03/29',
    cardholderName: 'Alex Carter',
    monthlySpent: 0,
    monthlyLimit: 5000,
    currency: 'USD',
  },
  {
    cardId: 'card-04',
    nickname: 'Old gift card',
    scheme: 'visa',
    kind: 'virtual',
    status: 'expired',
    last4: '0019',
    expiry: '01/24',
    cardholderName: 'Alex Carter',
    monthlySpent: 0,
    monthlyLimit: 500,
    currency: 'USD',
  },
];
