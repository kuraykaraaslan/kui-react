'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { CreditCardVisual } from '@/modules/domains/common/payment/CreditCardVisual';
import { PaymentStatusBadge } from '@/modules/domains/common/payment/PaymentStatusBadge';
import { PaymentSummaryCard } from '@/modules/domains/common/payment/PaymentSummaryCard';
import { SavedCardSelector } from '@/modules/domains/common/payment/SavedCardSelector';
import { OrderTotalsCard } from '@/modules/domains/common/money/OrderTotalsCard';
import { PriceDisplay } from '@/modules/domains/common/money/PriceDisplay';
import { Button } from '@/modules/ui/Button';
import { SAVED_CARDS, ORDER_TOTALS } from '../common.data';
import type { PaymentBase } from '@/modules/domains/common/PaymentTypes';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

const DEMO_PAYMENT: PaymentBase = {
  paymentId: 'pay_demo_001',
  provider: 'Stripe',
  providerPaymentId: 'pi_3NxYz2EwLHMpEt9Q1aB2c3D4',
  method: 'CREDIT_CARD',
  status: 'PAID',
  amount: ORDER_TOTALS.total,
  currency: ORDER_TOTALS.currency,
};

export default function PaymentOverviewPage() {
  return (
    <>
      <DocumentTitle text="Payment — Common Theme" />
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 space-y-16">

      {/* Hero */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-text-primary">Payment Components</h1>
        <p className="text-text-secondary max-w-xl">
          All payment UI pieces from{' '}
          <code className="rounded bg-surface-overlay px-1.5 py-0.5 text-sm font-mono">modules/domains/common/payment</code>{' '}
          and{' '}
          <code className="rounded bg-surface-overlay px-1.5 py-0.5 text-sm font-mono">common/money</code>.
        </p>
        <a
          href="/theme/common/payment/checkout"
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg hover:bg-primary-hover transition-colors"
        >
          Go to full checkout <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* Credit card visual */}
      <ComponentSection title="CreditCardVisual" path="common/payment/CreditCardVisual">
        <div className="flex flex-wrap gap-6">
          {(['VISA', 'MASTERCARD', 'AMEX', 'TROY', 'UNKNOWN'] as const).map((brand) => (
            <CreditCardVisual
              key={brand}
              brand={brand}
              cardNumber={brand === 'AMEX' ? '378282246310005' : '4111111111111111'}
              cardholderName="JOHN DOE"
              expiryMonth="08"
              expiryYear="27"
              cvv="123"
            />
          ))}
        </div>
      </ComponentSection>

      {/* Payment status badges */}
      <ComponentSection title="PaymentStatusBadge" path="common/payment/PaymentStatusBadge">
        <div className="flex flex-wrap gap-3">
          {(['PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED'] as const).map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <PaymentStatusBadge status={s} />
              <PaymentStatusBadge status={s} dot size="sm" />
            </div>
          ))}
        </div>
      </ComponentSection>

      {/* Price display */}
      <ComponentSection title="PriceDisplay" path="common/money/PriceDisplay">
        <div className="flex flex-wrap items-end gap-6">
          <PriceDisplay amount={29.99} currency="USD" locale="en-US" size="sm" />
          <PriceDisplay amount={1299.90} currency="TRY" locale="tr-TR" size="md" />
          <PriceDisplay amount={499.00} currency="EUR" locale="de-DE" size="lg" />
          <PriceDisplay amount={89.00} currency="GBP" locale="en-GB" size="xl" />
          <PriceDisplay amount={150.00} currency="TRY" locale="tr-TR" strikethrough />
        </div>
      </ComponentSection>

      {/* Order totals */}
      <ComponentSection title="OrderTotalsCard" path="common/money/OrderTotalsCard">
        <div className="max-w-sm">
          <OrderTotalsCard totals={ORDER_TOTALS} />
        </div>
      </ComponentSection>

      {/* Payment summary */}
      <ComponentSection title="PaymentSummaryCard" path="common/payment/PaymentSummaryCard">
        <div className="max-w-sm">
          <PaymentSummaryCard payment={DEMO_PAYMENT} />
        </div>
      </ComponentSection>

      {/* Saved card selector */}
      <ComponentSection title="SavedCardSelector" path="common/payment/SavedCardSelector">
        <div className="max-w-md">
          <SavedCardSelector
            cards={SAVED_CARDS}
            selectedCardId={SAVED_CARDS[0].cardId}
            onSelect={() => {}}
          />
        </div>
      </ComponentSection>
    </div>
    </>
  );
}

function ComponentSection({
  title,
  path,
  children,
}: {
  title: string;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <div className="flex-1 h-px bg-border" aria-hidden="true" />
        <code className="text-xs text-text-secondary font-mono">{path}</code>
      </div>
      <div className="rounded-xl border border-border bg-surface-raised p-6 overflow-x-auto">
        {children}
      </div>
    </section>
  );
}
