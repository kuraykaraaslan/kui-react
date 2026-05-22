'use client';
import { useState } from 'react';
import { PaymentSummaryCard } from '@/modules/domains/common/payment/PaymentSummaryCard';
import { PaymentStatusBadge } from '@/modules/domains/common/payment/PaymentStatusBadge';
import { PriceDisplay } from '@/modules/domains/common/money/PriceDisplay';
import { DEMO_ORDERS } from '../../common.data';
import type { PaymentBase, PaymentStatus } from '@/modules/domains/common/PaymentTypes';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

const STATUS_FILTERS: { label: string; value: PaymentStatus | 'ALL' }[] = [
  { label: 'All',        value: 'ALL' },
  { label: 'Paid',       value: 'PAID' },
  { label: 'Pending',    value: 'PENDING' },
  { label: 'Refunded',   value: 'REFUNDED' },
  { label: 'Failed',     value: 'FAILED' },
];

export default function OrdersPage() {
  const [filter, setFilter]     = useState<PaymentStatus | 'ALL'>('ALL');
  const [selected, setSelected] = useState<PaymentBase | null>(null);

  const filtered = filter === 'ALL'
    ? DEMO_ORDERS
    : DEMO_ORDERS.filter((o) => o.status === filter);

  const fmt = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' });

  return (
    <>
      <DocumentTitle text="Orders — Common Theme" />
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Order History</h2>

      {/* filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => { setFilter(f.value); setSelected(null); }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === f.value
                ? 'bg-primary text-primary-fg'
                : 'bg-surface-overlay text-text-secondary hover:text-text-primary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface-raised py-12 text-center space-y-2">
          <p className="text-2xl" aria-hidden="true">📭</p>
          <p className="text-sm font-medium text-text-primary">No orders found</p>
          <p className="text-sm text-text-secondary">Try a different filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <button
              key={order.paymentId}
              type="button"
              onClick={() => setSelected(selected?.paymentId === order.paymentId ? null : order)}
              className="w-full text-left rounded-xl border border-border bg-surface-raised p-4 hover:border-primary transition-colors space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="space-y-0.5">
                  <p className="text-xs text-text-secondary font-mono">{order.paymentId}</p>
                  <p className="text-sm font-medium text-text-primary">{order.provider}</p>
                </div>
                <div className="flex items-center gap-3">
                  <PriceDisplay amount={order.amount} currency={order.currency} size="md" />
                  <PaymentStatusBadge status={order.status} size="sm" dot />
                </div>
              </div>

              {selected?.paymentId === order.paymentId && (
                <div className="pt-3 border-t border-border" onClick={(e) => e.stopPropagation()}>
                  <PaymentSummaryCard payment={order} />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* summary row */}
      <div className="rounded-lg bg-surface-overlay border border-border px-4 py-3 flex flex-wrap gap-4 text-sm">
        <span className="text-text-secondary">
          Total paid:{' '}
          <span className="font-semibold text-text-primary">
            {fmt.format(DEMO_ORDERS.filter((o) => o.status === 'PAID').reduce((s, o) => s + o.amount, 0))}
          </span>
        </span>
        <span className="text-text-secondary">
          Refunded:{' '}
          <span className="font-semibold text-text-primary">
            {fmt.format(DEMO_ORDERS.filter((o) => o.status === 'REFUNDED').reduce((s, o) => s + o.amount, 0))}
          </span>
        </span>
      </div>
    </div>
    </>
  );
}
