import type { MetadataRoute } from 'next';
import { SHOWCASE_LINKS } from '@/libs/config/showcase.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/internal/',
    },
    sitemap: `${SHOWCASE_LINKS.siteUrl}/sitemap.xml`,
  };
}
