import { HomePanel } from '@/modules/showcase/ui/HomePanel';
import { SHOWCASE_LINKS } from '@/libs/config/showcase.config';
import registry from '@/public/registry/components.index.json';

// JSON-LD ItemList so search engines see the component catalog as a
// structured list rather than just sidebar links buried in client JS
// (docs/dev/phase-7-showcase-and-dx.md 7.4). Static import of the committed
// registry snapshot — same reasoning as app/sitemap.ts.
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
