# AddressForm

- **id:** `common-address-form`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/address/AddressForm.tsx`
- **status:** stable
- **since:** 2025-03

Full address form with full name, phone, address lines, city, state/district, postal code, and country. Pre-fillable via the initial prop.

## Variants

### Empty

```tsx
<AddressForm onSubmit={handleSave} />
```

### Pre-filled

```tsx
<AddressForm initial={existingAddress} submitLabel="Update" onCancel={handleCancel} onSubmit={handleUpdate} />
```

## Full source

```tsx
'use client';
import { AddressForm } from '@/modules/domains/common/address/AddressForm';

<AddressForm
  initial={{ fullName: 'Jane Doe', city: 'New York', country: 'United States' }}
  onSubmit={async (values) => saveAddress(values)}
  onCancel={() => setOpen(false)}
/>
```
