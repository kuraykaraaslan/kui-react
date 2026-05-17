'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/modules/ui/Button';
import { PaymentCardTile } from '@/modules/domains/fintech/card/PaymentCardTile';
import { CardLimitMeter } from '@/modules/domains/fintech/card/CardLimitMeter';
import { CardActionMenu } from '@/modules/domains/fintech/card/CardActionMenu';
import { PAYMENT_CARDS } from '../fintech.data';

export default function CardsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <a
        href="/theme/fintech"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back to summary
      </a>

      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide font-medium text-text-secondary">Cards</p>
          <h1 className="text-2xl font-bold text-text-primary">Your cards</h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            Manage physical and virtual cards · freeze, set limits, view details.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          iconLeft={<FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" aria-hidden="true" />}
        >
          New virtual card
        </Button>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PAYMENT_CARDS.map((card) => (
          <section
            key={card.cardId}
            className="space-y-3 rounded-2xl border border-border bg-surface-base p-3 shadow-sm"
            aria-label={`${card.nickname} card`}
          >
            <PaymentCardTile
              nickname={card.nickname}
              scheme={card.scheme}
              kind={card.kind}
              status={card.status}
              last4={card.last4}
              expiry={card.expiry}
              cardholderName={card.cardholderName}
            />

            <div className="px-1">
              <CardLimitMeter
                spent={card.monthlySpent}
                limit={card.monthlyLimit}
                currency={card.currency}
              />
            </div>

            <div className="flex items-center justify-end px-1 pb-1">
              <CardActionMenu
                status={card.status}
                onFreeze={() => undefined}
                onUnfreeze={() => undefined}
                onShowDetails={() => undefined}
                onUpdateLimits={() => undefined}
                onDelete={() => undefined}
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
