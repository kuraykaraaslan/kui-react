'use client';
import { useState } from 'react';
import { AddressSelector } from '@/modules/domains/common/address/AddressSelector';
import { AddressForm } from '@/modules/domains/common/address/AddressForm';
import { AddressCard } from '@/modules/domains/common/address/AddressCard';
import { PaymentMethodSelector } from '@/modules/domains/common/payment/PaymentMethodSelector';
import { SavedCardSelector } from '@/modules/domains/common/payment/SavedCardSelector';
import { CreditCardForm } from '@/modules/domains/common/payment/CreditCardForm';
import { PaymentStatusBadge } from '@/modules/domains/common/payment/PaymentStatusBadge';
import { CheckoutSuccessState } from '@/modules/domains/common/payment/CheckoutSuccessState';
import { OrderTotalsCard } from '@/modules/domains/common/money/OrderTotalsCard';
import { CouponInput } from '@/modules/domains/common/discount/CouponInput';
import { CartPreview } from '@/modules/domains/common/cart/CartPreview';
import { Button } from '@/modules/ui/Button';
import { StepShell } from '@/modules/app/StepShell';

import { SAVED_ADDRESSES, SAVED_CARDS, ORDER_TOTALS, DEMO_CART } from '../../common.data';
import type { Address } from '@/modules/domains/common/AddressTypes';
import type { PaymentMethod, SavedCard, CreditCardInput, PaymentBase } from '@/modules/domains/common/PaymentTypes';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

/* ─── types ─── */

type CheckoutStep = 'address' | 'method' | 'details' | 'confirm' | 'success';

type AddressMode =
  | { kind: 'list' }
  | { kind: 'add' }
  | { kind: 'edit'; index: number };

/* ─── mock payment receipt ─── */

const MOCK_PAYMENT: PaymentBase = {
  paymentId: 'pay_demo_001',
  provider: 'Stripe',
  providerPaymentId: 'pi_3NxYz2EwLHMpEt9Q1aB2c3D4',
  method: 'CREDIT_CARD',
  status: 'PAID',
  amount: ORDER_TOTALS.total,
  currency: ORDER_TOTALS.currency,
};

/* ─── helpers ─── */

const FMT = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' });

function stepIndex(s: CheckoutStep): number {
  return ['address', 'method', 'details', 'confirm'].indexOf(s);
}

/* ════════════════════════════════════════════════════════════
   Page
════════════════════════════════════════════════════════════ */

export default function CheckoutPage() {
  /* ── step ── */
  const [step, setStep] = useState<CheckoutStep>('address');

  /* ── address ── */
  const [addresses, setAddresses] = useState<Address[]>(SAVED_ADDRESSES);
  const [selectedAddr, setSelectedAddr] = useState<number>(0);
  const [addrMode, setAddrMode] = useState<AddressMode>({ kind: 'list' });

  /* ── payment ── */
  const [method, setMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [cards, setCards] = useState<SavedCard[]>(SAVED_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string>(SAVED_CARDS[0].cardId);
  const [useNewCard, setUseNewCard] = useState(false);

  /* ── coupon ── */
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();

  /* ── paying ── */
  const [paying, setPaying] = useState(false);

  /* ════ address handlers ════ */

  function handleAddressSelect(idx: number) {
    setSelectedAddr(idx);
  }

  function handleAddressSave(values: Address) {
    if (addrMode.kind === 'add') {
      setAddresses((prev) => [...prev, values]);
      setSelectedAddr(addresses.length);
    } else if (addrMode.kind === 'edit') {
      setAddresses((prev) => prev.map((a, i) => (i === addrMode.index ? values : a)));
    }
    setAddrMode({ kind: 'list' });
  }

  function handleAddressDelete(idx: number) {
    setAddresses((prev) => prev.filter((_, i) => i !== idx));
    setSelectedAddr((prev) => {
      if (prev === idx) return 0;
      if (prev > idx) return prev - 1;
      return prev;
    });
  }

  /* ════ payment handlers ════ */

  function handleRemoveCard(cardId: string) {
    setCards((prev) => prev.filter((c) => c.cardId !== cardId));
    if (selectedCardId === cardId) {
      const remaining = cards.filter((c) => c.cardId !== cardId);
      setSelectedCardId(remaining[0]?.cardId ?? '');
    }
  }

  async function handleNewCard(values: CreditCardInput) {
    await new Promise((r) => setTimeout(r, 600));
    const newCard: SavedCard = {
      cardId: `card-new-${Date.now()}`,
      last4: values.cardNumber.slice(-4),
      brand: 'VISA',
      cardholderName: values.cardholderName,
      expiryMonth: values.expiryMonth,
      expiryYear: values.expiryYear,
    };
    setCards((prev) => [...prev, newCard]);
    setSelectedCardId(newCard.cardId);
    setUseNewCard(false);
    setStep('confirm');
  }

  async function handlePay() {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1600));
    setPaying(false);
    setStep('success');
  }

  /* ════ done ════ */

  if (step === 'success') {
    return (
      <>
        <DocumentTitle text="Checkout — Common Theme" />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <CheckoutSuccessState
          payment={MOCK_PAYMENT}
          address={addresses[selectedAddr]}
          onReset={() => window.location.reload()}
        />
      </div>
      </>
    );
  }

  const currentIndex = stepIndex(step);

  return (
    <>
      <DocumentTitle text="Checkout — Common Theme" />
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Checkout</h1>
        <p className="text-sm text-text-secondary mt-1">Complete your purchase securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* ── Left: steps ── */}
        <div className="space-y-4">

          {/* ── Step 1 — Delivery address ── */}
          <StepShell
            number={1}
            title="Delivery address"
            active={step === 'address'}
            done={currentIndex > 0}
            onEdit={() => { setAddrMode({ kind: 'list' }); setStep('address'); }}
            summary={
              currentIndex > 0 && addresses[selectedAddr]
                ? <AddressCard address={addresses[selectedAddr]} />
                : null
            }
          >
            {addrMode.kind === 'list' ? (
              <div className="space-y-4">
                <AddressSelector
                  addresses={addresses}
                  selectedIndex={selectedAddr}
                  onSelect={(idx) => handleAddressSelect(idx)}
                  onAdd={() => setAddrMode({ kind: 'add' })}
                  onEdit={(idx) => setAddrMode({ kind: 'edit', index: idx })}
                  onDelete={(idx) => handleAddressDelete(idx)}
                />
                <Button
                  disabled={addresses.length === 0}
                  onClick={() => setStep('method')}
                >
                  Continue
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-text-primary">
                  {addrMode.kind === 'add' ? 'New address' : 'Edit address'}
                </p>
                <AddressForm
                  initial={addrMode.kind === 'edit' ? addresses[addrMode.index] : undefined}
                  onSubmit={handleAddressSave}
                  onCancel={() => setAddrMode({ kind: 'list' })}
                  submitLabel={addrMode.kind === 'add' ? 'Add address' : 'Save changes'}
                />
              </div>
            )}
          </StepShell>

          {/* ── Step 2 — Payment method ── */}
          <StepShell
            number={2}
            title="Payment method"
            active={step === 'method'}
            done={currentIndex > 1}
            onEdit={() => setStep('method')}
            summary={
              currentIndex > 1
                ? <p className="text-sm text-text-secondary capitalize">{method.toLowerCase().replace('_', ' ')}</p>
                : null
            }
          >
            <div className="space-y-4">
              <PaymentMethodSelector value={method} onChange={(m) => setMethod(m)} />
              <Button onClick={() => setStep('details')}>Continue</Button>
            </div>
          </StepShell>

          {/* ── Step 3 — Card details ── */}
          <StepShell
            number={3}
            title={method === 'CREDIT_CARD' ? 'Card details' : 'Payment details'}
            active={step === 'details'}
            done={currentIndex > 2}
            onEdit={() => setStep('details')}
            summary={
              currentIndex > 2 && method === 'CREDIT_CARD'
                ? (() => {
                    const card = cards.find((c) => c.cardId === selectedCardId);
                    return card
                      ? <p className="text-sm text-text-secondary font-mono">•••• •••• •••• {card.last4}</p>
                      : null;
                  })()
                : null
            }
          >
            {method === 'CREDIT_CARD' ? (
              <div className="space-y-5">
                {!useNewCard && (
                  <SavedCardSelector
                    cards={cards}
                    selectedCardId={selectedCardId}
                    onSelect={(id) => setSelectedCardId(id)}
                    onRemove={handleRemoveCard}
                    onAddNew={() => setUseNewCard(true)}
                  />
                )}

                {useNewCard && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-text-primary">New card</p>
                      <Button variant="ghost" size="xs" onClick={() => setUseNewCard(false)} className="text-text-secondary">
                        Use saved card
                      </Button>
                    </div>
                    <CreditCardForm
                      onSubmit={handleNewCard}
                      onCancel={() => setUseNewCard(false)}
                    />
                  </div>
                )}

                {!useNewCard && (
                  <Button onClick={() => setStep('confirm')}>Continue</Button>
                )}
              </div>
            ) : (
              <div className="rounded-lg bg-surface-overlay border border-border px-4 py-6 text-center space-y-2">
                <p className="text-sm font-medium text-text-primary">
                  You will be redirected to{' '}
                  <span className="capitalize">{method.toLowerCase().replace('_', ' ')}</span>
                </p>
                <p className="text-xs text-text-secondary">Complete payment on the provider page, then return here.</p>
                <Button className="mt-3" onClick={() => setStep('confirm')}>Continue</Button>
              </div>
            )}
          </StepShell>

          {/* ── Step 4 — Review & pay ── */}
          <StepShell
            number={4}
            title="Review &amp; pay"
            active={step === 'confirm'}
            done={false}
          >
            <div className="space-y-4">
              {/* order items */}
              <div className="rounded-lg border border-border bg-surface-base p-4 text-sm text-text-secondary space-y-1">
                <p className="text-text-primary font-medium mb-2">Order items</p>
                <div className="flex justify-between">
                  <span>Pro Plan — Annual subscription</span>
                  <span className="font-mono text-text-primary">₺999,90</span>
                </div>
                <div className="flex justify-between">
                  <span>Design System Add-on</span>
                  <span className="font-mono text-text-primary">₺300,00</span>
                </div>
              </div>

              {/* coupon */}
              <CouponInput
                appliedCode={appliedCoupon}
                onApply={async (code) => {
                  await new Promise((r) => setTimeout(r, 700));
                  if (code === 'DEMO20') {
                    setAppliedCoupon(code);
                    return { success: true, message: '20% discount applied!' };
                  }
                  return { success: false, message: 'Coupon not found. Try DEMO20.' };
                }}
                onRemove={() => setAppliedCoupon(undefined)}
              />

              {/* status badges preview */}
              <div className="rounded-lg border border-border bg-surface-raised px-4 py-3 space-y-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Payment status</p>
                <div className="flex flex-wrap gap-2">
                  {(['PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED'] as const).map((s) => (
                    <PaymentStatusBadge key={s} status={s} size="sm" dot />
                  ))}
                </div>
              </div>

              {/* pay button */}
              <Button
                fullWidth
                loading={paying}
                onClick={handlePay}
                className="h-12 text-base font-semibold"
              >
                {paying ? 'Processing…' : `Pay ${FMT.format(ORDER_TOTALS.total)}`}
              </Button>

              <p className="text-xs text-center text-text-secondary">
                🔒 Payments are encrypted and secure
              </p>
            </div>
          </StepShell>
        </div>

        {/* ── Right: cart preview + order summary ── */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          <CartPreview cart={DEMO_CART} defaultOpen />

          <OrderTotalsCard totals={ORDER_TOTALS} />

          {addresses[selectedAddr] && step !== 'address' && (
            <div className="rounded-xl border border-border bg-surface-raised p-4 space-y-2">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Delivery to</p>
              <AddressCard address={addresses[selectedAddr]} />
            </div>
          )}
        </aside>
      </div>
    </div>
    </>
  );
}

