# ProcessingStatusIndicator

- **id:** `common-processing-status-indicator`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/common/status/ProcessingStatusIndicator.tsx`
- **status:** stable
- **since:** 2025-04

Animated status indicator for UPLOADING / PROCESSING / READY / FAILED states. Optional progress bar with percentage.

## Variants

### All states

```tsx
<ProcessingStatusIndicator status="UPLOADING" progress={30} />
<ProcessingStatusIndicator status="PROCESSING" progress={65} />
<ProcessingStatusIndicator status="READY" progress={100} />
<ProcessingStatusIndicator status="FAILED" />
```

### Custom label + sizes

```tsx
<ProcessingStatusIndicator status="PROCESSING" label="Encoding…" progress={45} size="sm" />
<ProcessingStatusIndicator status="PROCESSING" label="Encoding…" progress={45} size="md" />
<ProcessingStatusIndicator status="PROCESSING" label="Encoding…" progress={45} size="lg" />
```

## Full source

```tsx
<ProcessingStatusIndicator status="PROCESSING" progress={45} label="Encoding video…" />
```
