'use client';
import { useState, use, useMemo } from 'react';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { Button } from '@/modules/ui/Button';
import { Input } from '@/modules/ui/Input';
import { Breadcrumb } from '@/modules/ui/Breadcrumb';
import { Spinner } from '@/modules/ui/Spinner';
import { AlertBanner } from '@/modules/ui/AlertBanner';
import { CreditCardForm } from '@/modules/domains/common/payment/CreditCardForm';
import { CouponInput } from '@/modules/domains/common/discount/CouponInput';
import { OrderTotalsCard } from '@/modules/domains/common/money/OrderTotalsCard';
import { SectionPricingCard } from '@/modules/domains/event/SectionPricingCard';
import { SeatMapPicker, buildSectionTree } from '@/modules/domains/event/SeatMapPicker';
import { StepIndicator, type CheckoutStep } from '@/modules/domains/event/StepIndicator';
import { CheckoutSuccess } from '@/modules/domains/event/CheckoutSuccess';
import {
  getEventBySlug,
  getPricingsByEventId,
  getSeatMapConfig,
  VENUES,
} from '@/app/theme/event/event.data';
import type { EventSectionPricing, BuyerInfo, CartItem } from '@/modules/domains/event/types';
import type { CreditCardInput } from '@/modules/domains/common/PaymentTypes';
import type { OrderTotals } from '@/modules/domains/common/MoneyTypes';

type Step = CheckoutStep;

const FMT = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });
const FMT_DATE = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
const FMT_TIME = new Intl.DateTimeFormat('tr-TR', { hour: '2-digit', minute: '2-digit' });

const SERVICE_FEE_RATE = 0.05;
const VALID_COUPON = 'BILLET20';

/* ════════════════════════════════════════════
   Page
════════════════════════════════════════════ */

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const event = getEventBySlug(slug);
  const pricings = event ? getPricingsByEventId(event.eventId) : [];
  const venue = VENUES[0];
  const seatMapConfig = event ? getSeatMapConfig(event.eventId) : null;

  /* ── state ── */
  const [step, setStep] = useState<Step>('tickets');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [buyer, setBuyer] = useState<BuyerInfo>({ name: '', email: '', phone: '' });
  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [discountPct, setDiscountPct] = useState(0);
  const [paying, setPaying] = useState(false);
  const [ticketId] = useState(`TKT-${Math.random().toString(36).slice(2, 9).toUpperCase()}`);
  const [orderId] = useState(`ORD-${Math.random().toString(36).slice(2, 9).toUpperCase()}`);

  /* ── seat map tree (only for physical events) ── */
  const sectionTree = useMemo(() => {
    if (!seatMapConfig) return [];
    return buildSectionTree(seatMapConfig.sections, seatMapConfig.seatInfos, pricings);
  }, [seatMapConfig, pricings]);

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <DocumentTitle text={`Checkout — ${THEME_TITLES.event}`} />
        <p className="text-text-secondary">Etkinlik bulunamadı.</p>
        <a
          href="/theme/event/events"
          className="inline-flex items-center justify-center mt-4 rounded-md border border-border text-text-primary hover:bg-surface-overlay px-4 py-2 text-sm font-medium transition-colors"
        >
          Etkinliklere Dön
        </a>
      </div>
    );
  }

  /* ── cart calculations ── */
  const cartItems: CartItem[] = seatMapConfig
    ? (() => {
        const byPricing: Record<string, number> = {};
        for (const seatId of selectedSeatIds) {
          const info = seatMapConfig.seatInfos.find((s) => s.seat.seatId === seatId);
          if (info?.pricingId) byPricing[info.pricingId] = (byPricing[info.pricingId] ?? 0) + 1;
        }
        return pricings
          .map((p) => ({ pricing: p, quantity: byPricing[p.eventSectionPricingId] ?? 0 }))
          .filter((i) => i.quantity > 0);
      })()
    : pricings
        .map((p) => ({ pricing: p, quantity: quantities[p.eventSectionPricingId] ?? 0 }))
        .filter((i) => i.quantity > 0);

  const subtotal = cartItems.reduce((acc, i) => acc + i.pricing.price * i.quantity, 0);
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const discount = Math.round(subtotal * discountPct);
  const total = subtotal + serviceFee - discount;
  const totalQty = seatMapConfig ? selectedSeatIds.length : cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const orderTotals: OrderTotals = {
    subtotal,
    serviceFee,
    discountTotal: discount,
    taxTotal: 0,
    shippingTotal: 0,
    total,
    currency: 'TRY',
  };

  /* ── handlers ── */

  function setQty(pricingId: string, qty: number) {
    setQuantities((prev) => ({ ...prev, [pricingId]: qty }));
  }

  async function handleCouponApply(code: string) {
    await new Promise((r) => setTimeout(r, 700));
    if (code.toUpperCase() === VALID_COUPON) {
      setDiscountPct(0.2);
      setCouponCode(code.toUpperCase());
      return { success: true, message: '20% indirim uygulandı!' };
    }
    return { success: false, message: `Geçersiz kupon. "${VALID_COUPON}" deneyin.` };
  }

  async function handlePay(_card: CreditCardInput) {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPaying(false);
    setStep('confirm');
  }

  /* ── success view ── */

  if (step === 'confirm') {
    return (
      <>
        <DocumentTitle text={`Checkout — ${event.title} — ${THEME_TITLES.event}`} />
        <CheckoutSuccess
          orderId={orderId}
          ticketId={ticketId}
          buyerName={buyer.name}
          buyerEmail={buyer.email}
          event={{ eventId: event.eventId, title: event.title, startAt: event.startAt, slug }}
          venue={venue}
          cartItems={cartItems}
          total={total}
        />
      </>
    );
  }

  /* ── main checkout ── */

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <DocumentTitle text={`Checkout — ${event.title} — ${THEME_TITLES.event}`} />
      <Breadcrumb
        items={[
          { label: 'Ana Sayfa', href: '/theme/event' },
          { label: 'Etkinlikler', href: '/theme/event/events' },
          { label: event.title, href: `/theme/event/events/${slug}` },
          { label: 'Bilet Al' },
        ]}
        className="mb-6"
      />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-text-primary">{event.title}</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {FMT_DATE.format(event.startAt)} · {FMT_TIME.format(event.startAt)} · {venue.name}
          </p>
        </div>
        <StepIndicator current={step} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
        {/* ── left: step content ── */}
        <div className="space-y-4">

          {/* STEP 1: Ticket selection */}
          {step === 'tickets' && (
            <div className="space-y-4">
              {seatMapConfig ? (
                <SeatMapPicker
                  sections={sectionTree}
                  selectedSeatIds={selectedSeatIds}
                  onSeatToggle={(seatId) =>
                    setSelectedSeatIds((prev) =>
                      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
                    )
                  }
                  mapShapes={seatMapConfig.mapShapes}
                  mapViewBox={seatMapConfig.mapViewBox}
                  mapMaxWidth={seatMapConfig.mapMaxWidth}
                  stagePoints={seatMapConfig.stagePoints}
                  stageLabel={seatMapConfig.stageLabel}
                  stageLabelX={seatMapConfig.stageLabelX}
                  stageLabelY={seatMapConfig.stageLabelY}
                  showStage
                />
              ) : (
                <div className="rounded-2xl border border-primary bg-surface-raised p-5 space-y-3">
                  <h2 className="font-bold text-text-primary">Bilet Seçimi</h2>
                  <p className="text-xs text-text-secondary">Bilet kategorisi ve adet seçin.</p>
                  <div className="space-y-3">
                    {pricings.map((p) => (
                      <SectionPricingCard
                        key={p.eventSectionPricingId}
                        pricing={p}
                        quantity={quantities[p.eventSectionPricingId] ?? 0}
                        onQuantityChange={(qty) => setQty(p.eventSectionPricingId, qty)}
                        selected={(quantities[p.eventSectionPricingId] ?? 0) > 0}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Button
                fullWidth
                disabled={totalQty === 0}
                onClick={() => setStep('buyer')}
                size="lg"
              >
                Devam Et ({totalQty} bilet)
              </Button>
            </div>
          )}

          {/* STEP 2: Buyer info */}
          {step === 'buyer' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-primary bg-surface-raised p-5 space-y-4">
                <h2 className="font-bold text-text-primary">Kişisel Bilgiler</h2>
                <Input
                  id="buyer-name"
                  label="Ad Soyad"
                  value={buyer.name}
                  onChange={(e) => setBuyer((b) => ({ ...b, name: e.target.value }))}
                  placeholder="Adınız ve soyadınız"
                  required
                />
                <Input
                  id="buyer-email"
                  label="E-posta"
                  type="email"
                  value={buyer.email}
                  onChange={(e) => setBuyer((b) => ({ ...b, email: e.target.value }))}
                  placeholder="ornek@email.com"
                  hint="Biletiniz bu adrese gönderilecek."
                  required
                />
                <Input
                  id="buyer-phone"
                  label="Telefon"
                  type="tel"
                  value={buyer.phone}
                  onChange={(e) => setBuyer((b) => ({ ...b, phone: e.target.value }))}
                  placeholder="+90 5xx xxx xx xx"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('tickets')}>
                  Geri
                </Button>
                <Button
                  fullWidth
                  disabled={!buyer.name || !buyer.email}
                  onClick={() => setStep('payment')}
                  size="lg"
                >
                  Ödemeye Geç
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-primary bg-surface-raised p-5 space-y-5">
                <h2 className="font-bold text-text-primary">Ödeme Bilgileri</h2>

                <CouponInput
                  appliedCode={couponCode}
                  onApply={handleCouponApply}
                  onRemove={() => { setCouponCode(undefined); setDiscountPct(0); }}
                />

                {paying ? (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <Spinner size="lg" />
                    <p className="text-text-secondary text-sm">Ödeme işleniyor...</p>
                  </div>
                ) : (
                  <CreditCardForm
                    onSubmit={handlePay}
                    onCancel={() => setStep('buyer')}
                  />
                )}
              </div>

              <AlertBanner
                variant="info"
                message="🔒 Ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır."
              />
            </div>
          )}
        </div>

        {/* ── right: order summary ── */}
        <aside className="lg:sticky lg:top-24 space-y-4">
          {/* event info */}
          <div className="rounded-xl border border-border bg-surface-raised overflow-hidden">
            {event.image && (
              <img src={event.image} alt={event.title} className="w-full h-32 object-cover" />
            )}
            <div className="p-4 space-y-1">
              <p className="font-bold text-text-primary text-sm line-clamp-2">{event.title}</p>
              <p className="text-xs text-text-secondary">{FMT_DATE.format(event.startAt)}</p>
              <p className="text-xs text-text-secondary">{venue.name}, {venue.city}</p>
            </div>
          </div>

          {/* cart items */}
          {cartItems.length > 0 && (
            <div className="rounded-xl border border-border bg-surface-raised p-4 space-y-2">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Sepetiniz</p>
              {cartItems.map((item) => (
                <div key={item.pricing.eventSectionPricingId} className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    {item.pricing.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-text-primary font-mono">
                    {FMT.format(item.pricing.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* order totals */}
          <OrderTotalsCard totals={orderTotals} />

          {step !== 'tickets' && (
            <p className="text-xs text-center text-text-secondary">
              İpucu: Kupon kodu <strong>{VALID_COUPON}</strong> — %20 indirim
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
