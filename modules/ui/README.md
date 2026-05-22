# modules/ui

UI primitives layer — stateless or locally-stateful atoms and molecules. No business logic, no data fetching, no routing.

## Files

```
AdvancedDataTable.tsx
AlertBanner.tsx
Avatar.tsx
Badge.tsx
BrandLogo.tsx
Breadcrumb.tsx
Button.tsx
ButtonGroup.tsx
Card.tsx
Checkbox.tsx
CheckboxGroup.tsx
ComboBox.tsx
ContentScoreBar.tsx
DataTable.tsx
DatePicker.tsx
DateRangePicker.tsx
Drawer.tsx
DropdownMenu.tsx
EmptyState.tsx
FileInput.tsx
Input.tsx
MapView.tsx
Modal.tsx
MultiSelect.tsx
PageHeader.tsx
Pagination.tsx
Popover.tsx
RadioGroup.tsx
SearchBar.tsx
Select.tsx
ServerDataTable.tsx
Skeleton.tsx
SkipLink.tsx
Slider.tsx
Spinner.tsx
StarRating.tsx
StatCard.tsx
Stepper.tsx
TabButton.tsx
TabGroup.tsx
Table.tsx
TagInput.tsx
Textarea.tsx
Toast.store.ts
Toast.tsx
Toggle.tsx
Tooltip.tsx
TreeView.tsx
VideoPlayer.tsx
ViewToggle.tsx
index.ts
lazy.tsx
```

## Parity

NextJS-only. EJS uses server-rendered partials under `/home/kuray/02_EJS_Components/views/partials/` and `views/theme/common/` instead of a primitives layer.

## Conventions

1. `'use client';` at top of every file.
2. `cn()` from `@/libs/utils/cn` for className composition.
3. Named exports only — no default exports.
4. Shared Tailwind tokens from `app/globals.css` (`bg-primary`, `text-text-secondary`, `border-border-focus`); never raw hex.
5. Icons via `<FontAwesomeIcon icon={...} />` from `@fortawesome/react-fontawesome`; no inline SVG, no other icon libs.
6. Always include `focus-visible:ring-2 focus-visible:ring-border-focus`.
7. Spread `...rest` to root element.

See [/AGENTS.md](../../AGENTS.md) for the full authoring contract.
