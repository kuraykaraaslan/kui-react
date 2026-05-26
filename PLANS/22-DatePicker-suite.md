# DatePicker Ailesi — Geliştirme Planı (EJS Pariteli)

> NextJS: [DatePicker.tsx](../modules/ui/DatePicker.tsx) 77, [DateRangePicker.tsx](../modules/ui/DateRangePicker.tsx) 176.  
> EJS: 39 / 139.

## Kuzey Yıldızı
date-fns + react-day-picker + Airbnb DateRangePicker seviyesi: locale-aware, timezone-aware, mobile bottom-sheet, range + presets, accessible (WAI-ARIA Date Picker dialog pattern).

> Bugün `DatePicker` neredeyse boş bir `<input type="date">` wrap'ı (77 satır). Sıfırdan re-design.

---

## Hedef yapı
```
modules/ui/DatePicker/
├── index.tsx                  ← named exports: DatePicker, DateRangePicker, DateTimePicker
├── types.ts                   ← DateValue, DateRange, Locale, Preset
├── calendar/
│   ├── Calendar.tsx           ← tek-ay grid (used by both)
│   ├── MonthSelect.tsx
│   ├── YearSelect.tsx
│   └── TimeStrip.tsx          ← hour:minute:second sliders
├── parts/
│   ├── Trigger.tsx            ← input + ikon + clear
│   ├── PresetList.tsx         ← Today / Yesterday / Last 7 / Last 30 / This month
│   └── BottomSheet.tsx        ← mobil için tam ekran
├── hooks/
│   ├── useDateFns.ts          ← date-fns lazy wrapper (locale dynamic import)
│   ├── useDateMask.ts         ← input mask: DD/MM/YYYY locale-aware
│   └── useKeyboardNav.ts      ← arrow keys, Page Up/Down, Home/End
└── locale/                    ← TR/EN/AR/DE/ES ay & gün isimleri
```

### EJS paralel
```
modules/ui/DatePicker/
├── DatePicker.ejs / DateRangePicker.ejs
├── partials/_calendar.ejs / _presets.ejs / _time-strip.ejs
└── scripts/
    ├── calendar.js
    ├── range.js
    ├── mask.js
    ├── locale-en.js / locale-tr.js / ...
    └── keyboard.js
```

---

## Milestone'lar

### M1 — Calendar core
- Tek/çift takvim grid (range için yan yana).
- Klavye: Arrow nav, PageUp/Down (ay), Shift+PageUp/Down (yıl), Home (haftanın başı), End.
- Month / year hızlı seçim.
- `min`, `max`, `disabledDates`, `disabledRanges` props.

### M2 — Range + presets
- Range select (start → end).
- Preset listesi: Today, Yesterday, Last 7 days, Last 30 days, This week, Last week, This month, Last month, This year, Custom.
- "Compare to previous period" toggle (analytics use case).

### M3 — Input mask + locale
- Locale-aware mask (TR: `GG.AA.YYYY`, EN: `MM/DD/YYYY`).
- Mask sırasında validation: kullanıcı geçersiz gün yazarsa rozet.
- Type-while-mask: ay/gün otomatik atlama.
- date-fns locale dynamic import — sadece kullanılan locale yüklenir.

### M4 — Time + timezone
- `withTime` prop → saat:dakika (opsiyonel saniye).
- 12-hour / 24-hour locale-aware.
- `timezone` prop (IANA) — display TZ ≠ value TZ.
- "Floating time" desteği (timezone-less event).

### M5 — Mobil + A11y
- Bottom sheet (touch swipe) mobil için.
- ARIA Date Picker dialog pattern (W3C WAI-ARIA APG).
- Screen reader: "Tuesday, March 5, available".
- Reduced motion.
- Touch target ≥ 44×44 px.

### M6 — Premium
- `numberOfMonths: 1 | 2 | 3` prop.
- Year picker (yıl bazlı navigation).
- Decade view.
- İslami/Hicri takvim toggle (TR/AR pazar).
- Recurrence picker entegrasyonu (M5 sonu — opsiyonel).

---

## Public API
```ts
type DatePickerProps = {
  value: Date | null;
  onChange: (d: Date | null) => void;
  min?: Date;
  max?: Date;
  disabledDates?: Date[] | ((d: Date) => boolean);
  withTime?: boolean | { seconds?: boolean; hour12?: boolean };
  timezone?: string;
  locale?: string; // 'tr' | 'en' | 'ar' | ...
  format?: string;
  numberOfMonths?: 1 | 2 | 3;
  presets?: Preset[];
  variant?: 'popover' | 'inline' | 'bottom-sheet';
  messages?: Partial<DatePickerMessages>;
  onTelemetry?: (e: DatePickerTelemetry) => void;
};

type DateRangePickerProps = Omit<DatePickerProps, 'value' | 'onChange'> & {
  value: DateRange | null;
  onChange: (r: DateRange | null) => void;
  compareToPreviousPeriod?: boolean;
};
```

## Telemetri
`open`, `close`, `select`, `range-select`, `preset-apply`, `nav-month`, `nav-year`, `invalid-input`.

## Perf
- Core ≤ 14 kB.
- Locale lazy + 2–4 kB her.
- 60 fps month-switch animasyonu.

## DoD
- [ ] NextJS + EJS paralel merge.
- [ ] Showcase variant'larında: date / range / datetime / inline / bottom-sheet.
- [ ] axe-core 0 violations.
