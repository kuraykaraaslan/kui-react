import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { ME } from '../social.data';

export const metadata: Metadata = {
  title: buildPageTitle('Profile', THEME_TITLES.social),
};

export default function ProfileIndexPage() {
  redirect(`/theme/social/profile/${ME.userId}`);
}
