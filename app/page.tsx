import { readFileSync } from 'node:fs';
import path from 'node:path';
import { HomePanel } from '@/modules/showcase/ui/HomePanel';
import { SHOWCASE_LINKS } from '@/libs/config/showcase.config';

// JSON-LD ItemList so search engines see the component catalog as a
// structured list rather than just sidebar links buried in client JS
// (docs/dev/phase-7-showcase-and-dx.md 7.4). Reads the committed
// registry snapshot — same reasoning as app/sitemap.ts.
const REPO_ROOT = path.resolve(process.cwd());
const registry = JSON.parse(
  readFileSync(path.join(REPO_ROOT, 'public/registry/components.index.json'), 'utf8')
);
const components: { id: string; name: string; description: string }[] = registry.components;

function buildItemListJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: components.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SHOWCASE_LINKS.siteUrl}/${c.id}`,
      name: c.name,
    })),
  };
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildItemListJsonLd()) }}
      />
      <HomePanel />
    </>
  );
}
