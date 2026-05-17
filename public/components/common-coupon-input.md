# CouponInput

- **id:** `common-coupon-input`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/discount/CouponInput.tsx`
- **status:** stable
- **since:** 2025-04

Coupon code input with apply/remove flow. Calls onApply which returns success/error; shows applied state once a valid code is accepted.

## Variants

### Default (try SAVE20)

```tsx
<CouponInput onApply={async (code) => validateCoupon(code)} />
```

### Applied state

```tsx
<CouponInput appliedCode="SAVE20" onApply={handleApply} onRemove={handleRemove} />
```

## Full source

```tsx
'use client';
import { CouponInput } from '@/modules/domains/common/discount/CouponInput';

<CouponInput
  onApply={async (code) => {
    const result = await validateCoupon(code);
    return { success: result.valid, message: result.message };
  }}
  appliedCode={appliedCoupon}
  onRemove={() => setAppliedCoupon(undefined)}
/>
```
