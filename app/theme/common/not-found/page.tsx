import type { Metadata } from 'next';
import { NotFoundPage } from '@/modules/app/NotFoundPage';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';

export const metadata: Metadata = {
  title: buildPageTitle('Not Found', THEME_TITLES.common),
};

export default function NotFound() {
  return <NotFoundPage />;
}
