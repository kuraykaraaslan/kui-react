# kui-react vs. react-starter-kit

`.junk/react-starter-kit` (kriasoft) referans alınarak yapılan kısa bir kıyaslama. İki proje de "boilerplate" olarak anılsa da aslında farklı katmanlarda çözüm sunuyorlar — biri saf UI bileşen kütüphanesi, diğeri uçtan uca bir SaaS iskeleti.

## Özetle

| | **kui-react** | **react-starter-kit** |
|---|---|---|
| Ne yapar | UI bileşen kütüphanesi + tasarım sistemi | Full-stack SaaS monorepo şablonu |
| Kapsam | Sadece frontend/UI katmanı | Frontend + backend + DB + auth + billing + infra |
| Dağıtım şekli | npm paketi (`@kuraykaraaslan/kui-react`) olarak projene kurulur | GitHub template'ten clone'lanır, projenin kendisi olur |
| Runtime | Next.js (peer dependency) | Cloudflare Workers (3 ayrı worker: web/app/api) |
| Paket yöneticisi | npm | Bun (workspaces) |
| Backend | Yok | Hono + tRPC + Better Auth + Stripe |
| Veritabanı | Yok | Drizzle ORM + Neon PostgreSQL |
| Test altyapısı | Yok (proje içinde test dosyası/vitest-jest kurulumu bulunmuyor) | Vitest + Happy DOM + PGlite |

## Bileşen / kod hacmi

- **kui-react**: `modules/ui` altında 147 atom/molekül, `modules/app` altında 34 organizma, `modules/domains` altında 19 sektöre (`ai`, `commerce`, `fintech`, `travel`, vb.) dağılmış 270 domain bileşeni, ve bunları gerçek ürün gibi gösteren 19 tam tema demosu (`app/theme/*`).
- **react-starter-kit**: `packages/ui` altında shadcn/ui'nin standart 16 primitive'i (button, card, dialog, select, vb.) — ihtiyaç oldukça `bun ui:add <component>` ile CLI'dan eklenir, repo'da hazır gelmez.

Yani kui-react "bitmiş, geniş bir bileşen kataloğu" sağlarken; react-starter-kit "backend + auth + billing hazır, UI'ı sen shadcn CLI ile büyüteceksin" yaklaşımını benimsemiş.

## Stil ve tasarım sistemi

- Her ikisi de **Tailwind CSS v4** kullanıyor.
- kui-react: kendi yazılmış bileşenler + `app/globals.css` içinde tanımlı CSS variable token seti (`--primary`, `--surface-raised`, `--text-secondary` vb.), `cn()` (clsx + tailwind-merge) zorunlu, ikonlar sadece Font Awesome.
- react-starter-kit: shadcn/ui ("new-york" stili, Radix primitive'leri üzerine kurulu), ikon seti muhtemelen lucide (shadcn varsayılanı).

## AI-agent odaklılık

- **kui-react**'in kendine özgü güçlü yanı: `GET /api/registry`, `llms.txt`, `llms-full.txt`, her bileşen için ayrı markdown (`public/components/<id>.md`), JSON Schema, ve bir MCP sunucusu (`scripts/mcp-server.mjs`) ile bileşen kataloğunu AI ajanlarına makine-okunur şekilde sunuyor. Bu react-starter-kit'te karşılığı olmayan bir katman.
- react-starter-kit tarafında agent desteği `AGENTS.md`/`CLAUDE.md` konvansiyonları + `.agents/skills/` altında skill'ler şeklinde — kod kalitesi/iş akışı odaklı, bileşen keşfi için ayrı bir API yok.

## Mimari felsefe

- kui-react: 4 katmanlı (`ui → app → domains → registry`), her katman bir öncekinin üstüne inşa ediliyor; showcase (`modules/showcase`) ayrı bir dokümantasyon/canlı-önizleme sistemi.
- react-starter-kit: klasik monorepo ayrımı (`apps/*` + `packages/*` + `db/` + `infra/`), her app ayrı bir Cloudflare Worker olarak deploy ediliyor, service binding'lerle birbirine bağlanıyor.

## Ne zaman hangisi

- Var olan bir Next.js projesine hazır, geniş, tema kolayca değiştirilebilir bir bileşen seti lazımsa → **kui-react**.
- Sıfırdan bir SaaS (auth, ödeme, DB, edge deployment dahil) kurulacaksa ve UI tarafı shadcn ile zamanla büyütülecekse → **react-starter-kit**.

İkisi birbirinin yerine geçmiyor; pratikte react-starter-kit'in `packages/ui`'si, kui-react gibi bir bileşen kütüphanesiyle *değiştirilebilecek* bir katman.
