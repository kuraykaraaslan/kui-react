# RadioGroup

- **id:** `radio-group`
- **layer:** ui
- **category:** Molecule
- **filePath:** `modules/ui/RadioGroup.tsx`
- **status:** stable
- **since:** 2025-02

fieldset + legend tabanlı radio grubu. WCAG uyumlu klavye navigasyonu için fieldset/legend zorunludur.

## Design tokens consumed

- `--border`
- `--border-focus`
- `--error`
- `--primary`
- `--secondary`
- `--text-primary`
- `--text-secondary`

## Variants

### Default

```tsx
<RadioGroup
  name="notify"
  legend="Notification preference"
  options={[
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'none', label: 'None' },
  ]}
/>
```

### Disabled

```tsx
<RadioGroup name="notify" legend="Notification preference" options={[...]} value="email" disabled />
```

### Card style

```tsx
function Demo() {
  const [v, setV] = useState('pro');
  const plans = [
    { value: 'free', label: 'Free',  hint: '$0/mo · 3 projects' },
    { value: 'pro',  label: 'Pro',   hint: '$12/mo · Unlimited' },
    { value: 'team', label: 'Team',  hint: '$49/mo · 10 seats'  },
  ];
  return (
    <fieldset className="space-y-2">
      <legend>Choose plan</legend>
      {plans.map(plan => (
        <label key={plan.value} className={cn(
          'flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer',
          v === plan.value ? 'border-primary bg-primary-subtle' : 'border-border hover:bg-surface-overlay'
        )}>
          <input type="radio" name="plan" value={plan.value}
            checked={v === plan.value} onChange={() => setV(plan.value)} />
          <div>
            <span className={v === plan.value ? 'text-primary font-medium' : ''}>{plan.label}</span>
            <p className="text-xs text-text-secondary">{plan.hint}</p>
          </div>
        </label>
      ))}
    </fieldset>
  );
}
```

## Full source

```tsx
'use client';
import { cn } from '@/libs/utils/cn';

export function RadioGroup({ name, legend, options, value, onChange, error, disabled, className }) {
  return (
    <fieldset className={cn('space-y-1', className)}>
      <legend className="text-sm font-medium text-text-primary mb-2">{legend}</legend>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt.value} className={cn('flex items-start gap-2', disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer')}>
            <input type="radio" name={name} value={opt.value} checked={value === opt.value} disabled={disabled}
              onChange={() => onChange?.(opt.value)} className="mt-0.5 h-4 w-4 border-border text-primary focus-visible:ring-2 focus-visible:ring-border-focus" />
            <div>
              <span className="text-sm text-text-primary">{opt.label}</span>
              {opt.hint && <p className="text-xs text-text-secondary">{opt.hint}</p>}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-error mt-1" role="alert">{error}</p>}
    </fieldset>
  );
}
```
