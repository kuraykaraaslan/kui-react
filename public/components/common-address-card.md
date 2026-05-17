# AddressCard

- **id:** `common-address-card`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/address/AddressCard.tsx`
- **status:** stable
- **since:** 2025-03

Read-only address display card with full name, phone, address lines, city, state, postal code, and country. Supports selected state and optional Edit/Delete actions.

## Variants

### Default

```tsx
<AddressCard address={address} onEdit={handleEdit} onDelete={handleDelete} />
```

### Selectable list

```tsx
<AddressCard address={address} selected={selected === idx} onEdit={() => setSelected(idx)} />
```

## Full source

```tsx
'use client';
import { AddressCard } from '@/modules/domains/common/address/AddressCard';

<AddressCard
  address={savedAddress}
  selected={selectedId === address.id}
  onEdit={() => openEditModal(address)}
  onDelete={() => deleteAddress(address.id)}
/>
```
