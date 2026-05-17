# SavedCardSelector

- **id:** `common-saved-card-selector`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/payment/SavedCardSelector.tsx`
- **status:** beta
- **since:** 2025-05

Radio-group list of saved payment cards. Shows brand badge, masked number, expiry, and default indicator. Supports remove and add-new callbacks.

## Variants

### Multiple cards

```tsx
<SavedCardSelector cards={cards} selectedCardId={selected} onSelect={handleSelect} onRemove={handleRemove} onAddNew={() => setShowForm(true)} />
```

### Empty state

```tsx
<SavedCardSelector cards={[]} onSelect={handleSelect} onAddNew={() => setShowForm(true)} />
```

## Full source

```tsx
<SavedCardSelector
  cards={savedCards}
  selectedCardId={selected}
  onSelect={(id, card) => setSelected(id)}
  onRemove={(id) => deleteCard(id)}
  onAddNew={() => setShowForm(true)}
/>
```
