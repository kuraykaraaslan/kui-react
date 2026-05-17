# TabButton

- **id:** `tab-button`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/TabButton.tsx`
- **status:** stable
- **since:** 2026-05

Pill tarzı sekme butonu; aktif/pasif renklendirme ve opsiyonel sayaç rozeti.

## Variants

### Interactive

```tsx
const [tab, setTab] = useState('all');

<TabButton active={tab === 'all'}      onClick={() => setTab('all')}      count={42}>All</TabButton>
<TabButton active={tab === 'active'}   onClick={() => setTab('active')}   count={18}>Active</TabButton>
<TabButton active={tab === 'archived'} onClick={() => setTab('archived')} count={24}>Archived</TabButton>
```

### Without count

```tsx
<TabButton active onClick={...}>Selected</TabButton>
<TabButton active={false} onClick={...}>Default</TabButton>
```

## Full source

```tsx
import { TabButton } from '@/modules/ui/TabButton';

<TabButton active={tab === 'all'}    onClick={() => setTab('all')}    count={42}>All</TabButton>
<TabButton active={tab === 'active'} onClick={() => setTab('active')} count={18}>Active</TabButton>
```
