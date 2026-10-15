import type { Metadata } from 'next';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { IotDashboard } from './_components/IotDashboard';

export const metadata: Metadata = {
  title: { absolute: THEME_TITLES.iot },
};

/** The IoT dashboard: an editable WidgetKit board (cards, settings, export/import). */
export default function IoTDashboardPage() {
  return <IotDashboard />;
}
