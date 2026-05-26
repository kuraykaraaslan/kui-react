// modules/ui/DatePicker/locale/tr.ts
import type { DatePickerLocale } from '../types';

export const trLocale: DatePickerLocale = {
  code: 'tr',
  months: [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
  ],
  monthsShort: [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
    'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
  ],
  // TR convention: Monday-first week.
  weekdaysShort: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
  weekStartsOn: 1,
  displayFormat: 'DD.MM.YYYY',
  messages: {
    placeholder: 'GG.AA.YYYY',
    prevMonth: 'Önceki ay',
    nextMonth: 'Sonraki ay',
    today: 'Bugün',
    clear: 'Tarihi temizle',
    dialogLabel: 'Tarih seçin',
    disabledDate: 'Bu tarih seçilemez',
  },
};
