'use client';
import type { CalendarMessages } from '../types';

export const TR_MESSAGES: CalendarMessages = {
  today: 'Bugün',
  previous: 'Önceki',
  next: 'Sonraki',
  month: 'Ay',
  week: 'Hafta',
  day: 'Gün',
  agenda: 'Ajanda',
  resource: 'Kaynak',
  allDay: 'Tüm gün',
  noEvents: 'Etkinlik yok',
  more: (n) => `+${n} daha`,
  edit: 'Düzenle',
  delete: 'Sil',
  confirmDelete: 'Silinsin mi?',
  close: 'Kapat',
  calendars: 'Takvimler',
  noResources: 'Kaynak tanımlı değil',
};

/** Monday-start (TR default). */
export const TR_WEEK_START = 1;

export const TR_MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
];

/** Weekday headers, indexed Sun..Sat. */
export const TR_DAY_SHORT = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

export const TR_DAY_LONG  = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
