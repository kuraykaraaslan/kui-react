# NavDropdown

- **id:** `event-nav-dropdown`
- **layer:** domain
- **category:** Domain
- **filePath:** `modules/domains/event/NavDropdown.tsx`
- **status:** stable
- **since:** 2026-05

Event koyu nav barı için dropdown bileşen ailesi: NavDropdown kapsayıcı, NavDropdownHeader başlık, NavTriggerButton tetikleyici. useNavPopover hook'u ile kullanılır.

## Variants

### Dropdown açık/kapalı

```tsx
const { open, setOpen, ref } = useNavPopover();

<div ref={ref} className="relative">
  <NavTriggerButton onClick={() => setOpen(p => !p)} expanded={open}>
    Options
  </NavTriggerButton>
  {open && (
    <NavDropdown>
      <NavDropdownHeader>Choose one</NavDropdownHeader>
      <ul>{...}</ul>
    </NavDropdown>
  )}
</div>
```

## Full source

```tsx
import { NavDropdown, NavDropdownHeader, NavTriggerButton } from '@/modules/domains/event/NavDropdown';
import { useNavPopover } from '@/modules/domains/event/useNavPopover';

function MyPicker() {
  const { open, setOpen, ref } = useNavPopover();
  return (
    <div ref={ref} className="relative">
      <NavTriggerButton onClick={() => setOpen(p => !p)} expanded={open}>
        Select city
      </NavTriggerButton>
      {open && (
        <NavDropdown>
          <NavDropdownHeader>Choose</NavDropdownHeader>
          <ul>{...}</ul>
        </NavDropdown>
      )}
    </div>
  );
}
```
