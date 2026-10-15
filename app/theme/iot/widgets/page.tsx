import type { Metadata } from 'next';
import { THEME_TITLES } from '@/libs/config/showcase.config';
import { WidgetGallery } from '../_components/WidgetGallery';

export const metadata: Metadata = {
  title: { absolute: `Widget gallery · ${THEME_TITLES.iot}` },
};

/** Five themed sample boards and one with every builtin widget type, all bound to sample data. */
export default function IoTWidgetGalleryPage() {
  return <WidgetGallery />;
}
