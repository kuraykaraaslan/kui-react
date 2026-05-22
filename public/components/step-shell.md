# StepShell

- **id:** `step-shell`
- **layer:** app
- **category:** App
- **filePath:** `modules/app/StepShell.tsx`
- **status:** stable
- **since:** 2026-05

Wrapper card for a single step in a multi-step flow. Border and number circle change based on active / done / inactive state; the done + onEdit combination shows an Edit button alongside the summary.

## Variants

### Active / Done / Pending

```tsx
<StepShell number={1} title="Delivery address" active={false} done
  summary={<AddressCard address={address} />}
  onEdit={() => setStep('address')}
/>
<StepShell number={2} title="Payment method" active done={false}>
  <PaymentMethodSelector value={method} onChange={setMethod} />
  <Button onClick={() => setStep('details')}>Continue</Button>
</StepShell>
<StepShell number={3} title="Review &amp; pay" active={false} done={false} />
```

## Full source

```tsx
import { StepShell } from '@/modules/app/StepShell';

// Done step — shows summary, allows editing
<StepShell
  number={1}
  title="Delivery address"
  active={false}
  done
  summary={<AddressCard address={selected} />}
  onEdit={() => setStep('address')}
/>

// Active step — shows children
<StepShell number={2} title="Payment method" active done={false}>
  <PaymentMethodSelector ... />
  <Button onClick={() => setStep('details')}>Continue</Button>
</StepShell>

// Pending step — title dimmed, no content
<StepShell number={3} title="Review &amp; pay" active={false} done={false} />
```
