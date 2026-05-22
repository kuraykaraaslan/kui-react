'use client';
import { useState } from 'react';
import { SavedCardSelector } from '@/modules/domains/common/payment/SavedCardSelector';
import { CreditCardForm } from '@/modules/domains/common/payment/CreditCardForm';
import { Button } from '@/modules/ui/Button';
import { InlineAlert } from '@/modules/app/InlineAlert';
import { SAVED_CARDS } from '../../common.data';
import type { SavedCard, CreditCardInput } from '@/modules/domains/common/PaymentTypes';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

export default function PaymentMethodsPage() {
  const [cards, setCards]       = useState<SavedCard[]>(SAVED_CARDS);
  const [selected, setSelected] = useState<string>(SAVED_CARDS[0].cardId);
  const [adding, setAdding]     = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  function flash(msg: string) { setSavedMsg(msg); setTimeout(() => setSavedMsg(''), 3000); }

  function handleRemove(cardId: string) {
    setCards((prev) => prev.filter((c) => c.cardId !== cardId));
    if (selected === cardId) setSelected(cards.filter((c) => c.cardId !== cardId)[0]?.cardId ?? '');
    flash('Card removed.');
  }

  async function handleNewCard(values: CreditCardInput) {
    await new Promise((r) => setTimeout(r, 700));
    const newCard: SavedCard = {
      cardId:         `card-${Date.now()}`,
      last4:          values.cardNumber.slice(-4),
      brand:          'VISA',
      cardholderName: values.cardholderName,
      expiryMonth:    values.expiryMonth,
      expiryYear:     values.expiryYear,
    };
    setCards((prev) => [...prev, newCard]);
    setSelected(newCard.cardId);
    setAdding(false);
    flash('Card added.');
  }

  return (
    <>
      <DocumentTitle text="Payment Methods — Common Theme" />
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Payment Methods</h2>
        {!adding && (
          <Button size="sm" onClick={() => setAdding(true)}>
            + Add card
          </Button>
        )}
      </div>

      {savedMsg && <InlineAlert message={savedMsg} />}

      {!adding ? (
        <SavedCardSelector
          cards={cards}
          selectedCardId={selected}
          onSelect={(id) => setSelected(id)}
          onRemove={handleRemove}
          onAddNew={() => setAdding(true)}
        />
      ) : (
        <div className="rounded-xl border border-border bg-surface-raised p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Add new card</h3>
          <CreditCardForm
            onSubmit={handleNewCard}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}
    </div>
    </>
  );
}
