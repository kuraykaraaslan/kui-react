import type { MetadataRoute } from 'next';
import { SHOWCASE_LINKS } from '@/libs/config/showcase.config';
import registry from '@/public/registry/components.index.json';

// Statically imports the committed registry snapshot rather than the live
// showcase data — same reasoning as modules/registry/registry.test.ts:
// this needs to run at build time without pulling in all 66 showcase
// section files, and the snapshot is already the source of truth every
// other AI-facing surface (llms.txt, /api/registry) reads from. A static
// import rather than readFileSync(path.join(process.cwd(), ...)) because
// Turbopack treats cwd-relative fs access as "trace the whole project"
// and pulls every file into the route's output.
//
// Lists every showcase component slug and every theme's root route.
// Themes with dynamic sub-pages (listing/detail, per AGENTS.md's theme
// page anatomy) aren't expanded here — each would need its own data
// file imported individually, and this already covers the two page
// kinds most worth a search engine indexing: the component reference
// and each theme's landing page.
const components: { id: string }[] = registry.components;
const themes: { route: string }[] = registry.themes;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SHOWCASE_LINKS.siteUrl;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...components.map((c) => ({
      url: `${base}/${c.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...themes.map((t) => ({
      url: `${base}${t.route}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
