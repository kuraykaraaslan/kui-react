# AddressSelector

- **id:** `common-address-selector`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/address/AddressSelector.tsx`
- **status:** beta
- **since:** 2025-04

Selectable list of saved addresses built on AddressCard. Supports add, edit, and delete callbacks.

## Variants

### Multiple addresses

```tsx
<AddressSelector addresses={addresses} onSelect={handleSelect} onAdd={handleAdd} />
```

### Empty state

```tsx
<AddressSelector addresses={[]} onSelect={handleSelect} onAdd={() => setShowForm(true)} />
```

## Full source

```tsx
<AddressSelector
  addresses={savedAddresses}
  selectedIndex={selectedIdx}
  onSelect={(i, addr) => setSelected(i)}
  onAdd={() => setShowAddForm(true)}
  onEdit={(i, addr) => openEditModal(addr)}
  onDelete={(i) => deleteAddress(i)}
/>
```
