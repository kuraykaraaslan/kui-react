import type { Metadata } from 'next';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { WidgetGallery } from '../_components/WidgetGallery';

export const metadata: Metadata = {
  title: { absolute: `Widget gallery · ${THEME_TITLES.iot}` },
};

/** Every builtin widget type on one board, each bound to sample data. */
export default function IoTWidgetGalleryPage() {
  return <WidgetGallery />;
}
