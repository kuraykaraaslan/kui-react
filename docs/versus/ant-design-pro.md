# kui-react vs. ant-design-pro

`.junk/ant-design-pro` (resmi Ant Design Pro repo'su, v6.0.3) referans alınarak yapılan kısa bir kıyaslama. İkisi de "React boilerplate" olarak anılsa da farklı problemleri çözüyorlar — biri bir UI bileşen kütüphanesi + tasarım sistemi, diğeri antd üzerine kurulu, sayfaları hazır gelen bir admin/enterprise şablonu.

## Özetle

| | **kui-react** | **ant-design-pro** |
|---|---|---|
| Ne yapar | UI bileşen kütüphanesi + tasarım sistemi | Hazır sayfalı enterprise admin şablonu |
| Kapsam | Sadece frontend/UI katmanı | Frontend + routing/auth iskeleti + mock API + i18n |
| Dağıtım şekli | npm paketi (`@kuraykaraaslan/kui-react`) olarak projene kurulur | GitHub'dan clone'lanır, projenin kendisi olur |
| Framework | Next.js 16 (App Router, peer dependency) | Umi Max v4 (konvansiyon bazlı, kendi router/derleyicisi — utoopack) |
| UI kütüphanesi | Kendi yazılmış, sıfırdan (no 3rd-party component lib) | antd v6 + `@ant-design/pro-components` v3 (ProTable, ProForm, ProLayout…) |
| Paket yöneticisi | npm | npm (package-lock.json) |
| Backend | Yok | Yok — `mock/` altında Express-style mock API; `cloudflare-worker/` ayrı, opsiyonel bir Hono worker |
| Veritabanı | Yok | Yok |
| Auth | Yok (bileşen seviyesinde `LoginForm` var, akış yok) | Var: `src/access.ts` (rol bazlı erişim), `getInitialState()` → `/api/currentUser`, mock login sayfaları |
| i18n | Yok | Var: 8 dilde hazır locale dosyası (`src/locales/`) |
| Test altyapısı | Yok | Var: Vitest + Testing Library + coverage |

## Bileşen / kod hacmi

- **kui-react**: `modules/ui` altında 63 atom/molekül, `modules/app` altında 35 organizma, `modules/domains` altında 18 sektöre (`ai`, `commerce`, `fintech`, `travel`, `iot`, `nft`, vb.) dağılmış 217 domain bileşeni — toplam 316 bileşen — ve bunları gerçek ürün gibi gösteren 19 tam tema demosu (`app/theme/*`). Bunların tamamı registry'de (`GET /api/registry`) makine-okunur şekilde kataloglanmış.
- **ant-design-pro**: kendi bileşen kataloğu yok — UI antd + ProComponents'ten geliyor (dışarıdan kütüphane). Kendi yazdığı, sayfaya özel ~10 paylaşılan bileşen var (`src/components/`: `AvatarList`, `HeaderDropdown`, `TagSelect`, `ArticleListContent`, vb.). Asıl hacim 37 sayfa (`src/pages/**/index.tsx`) — dashboard (analysis/monitor/workplace), form (basic/step/advanced), list (search/table/card/basic), profile, result, exception (403/404/500), account, ve antd X tabanlı bir chatbot sayfası.

Yani kui-react "geniş, bağımsız bir bileşen kataloğu" sağlarken; ant-design-pro "antd'nin üstüne hazır iş akışları/sayfa şablonları" sunuyor — component seviyesinde değil, sayfa/şablon seviyesinde bir başlangıç noktası.

## Bileşen bazlı fark: antd'de olup kui-react'te olmayanlar

antd'nin (ant-design-pro'nun kullandığı v6, `ant-design/ant-design` GitHub reposu) tam component klasörü kui-react'in registry snapshot'ıyla tek tek karşılaştırıldı. Gerçek boşluklar aşağıdaki gibi çıktı; bunların **5 tanesi bu geçişte kui-react'e eklendi** (component + showcase + registry), geri kalanlar bilinçli olarak ertelendi (bkz. "Ne zaman hangisi" altındaki not).

### ✅ Eklendi (bu commit'te)

| Bileşen | kui-react karşılığı | Not |
|---|---|---|
| Collapse / Accordion | [`Accordion`](../../modules/ui/Accordion.tsx) | Tek-açık veya `allowMultiple`, native `<button>` disclosure |
| Popconfirm | [`Popconfirm`](../../modules/ui/Popconfirm.tsx) | Popover primitiflerinin üstüne kurulu "emin misin?" onayı |
| Progress (bar + circle) | [`Progress`](../../modules/ui/Progress.tsx) | Daha önce sadece VideoPlayer/Toast/FileInput içine gömülüydü, artık bağımsız |
| Statistic | [`Statistic`](../../modules/ui/Statistic.tsx) | `StatCard`'ın kart-çerçevesiz hali; prefix/suffix/trend destekli |
| Slider (numeric range) | [`RangeSlider`](../../modules/ui/RangeSlider.tsx) | kui-react'teki mevcut `Slider` aslında bir **carousel** — isim çakışması nedeniyle ayrı isimlendirildi. Tekli veya çift-tutamaç (range) modu var |
| TimePicker | [`TimePicker`](../../modules/ui/DateRangePicker.tsx) | Zaten koddaydı (M1, native `type="time"`) ama kendi showcase/registry girişi yoktu — sadece DateRangePicker'ın bir varyantı olarak gömülüydü. Artık `time-picker` id'siyle kendi başına kataloglı |

> **İki düzeltme, ilk taramanın hatalı çıktığı yerler:**
> 1. "Divider" eksik sanılmıştı — meğer zaten [`Separator`](../../modules/ui/Separator.tsx) adıyla (yatay/dikey + etiketli varyant) mevcutmuş, sadece isim farklıydı.
> 2. "InputNumber" için önce ayrı bir bileşen yazıldı, ama sonra fark edildi ki [`Input`](../../modules/ui/Input.tsx) zaten `type="number"` ile artır/azalt (stepper) butonlarını destekliyor (`Input.tsx:170-191`) — antd'nin `InputNumber`'ıyla işlevsel olarak eşdeğer. Yazılan `InputNumber.tsx` bu yüzden **geri alındı**; iki bileşenli bir API yerine tek, zaten var olan `Input` tercih edildi.
>
> Bu, registry'yi ada göre tarayan bir AI ajanının gözden kaçırabileceği türden bir örtüşme — isim veya dosya yoksa "eksik" sanmak yerine, ilgili bileşenin mevcut prop yüzeyini de kontrol etmek gerekiyor.

### ⏸️ Bilinçli olarak ertelendi (niche / düşük öncelik)

| Bileşen | Ne işe yarar | Neden ertelendi |
|---|---|---|
| Cascader | Zincirleme (drill-down) seçim | Az kullanım; TreeSelect ile birlikte ele alınabilir |
| TreeSelect | Ağaç yapılı dropdown | `TreeView` var ama select içine gömülü hali yok |
| Transfer | İki liste arası taşıma (dual list box) | Niche, DnD gerektirir |
| Anchor | Sayfa içi scrollspy navigasyon | Az kullanım |
| BackTop | Yukarı çık butonu | Kolay ama düşük değer |
| FloatButton | Sağ alt köşe FAB | Kolay ama düşük değer |
| Watermark | İçerik üstü filigran | Niche |
| QRCode | QR kod üretici | Genelde harici bir kütüphane (ör. `qrcode`) gerektirir |
| Splitter | Sürüklenebilir bölünmüş paneller | Niche, karmaşık drag mantığı |
| Masonry | Pinterest tarzı grid | CSS `columns`/`grid` ile ad-hoc çözülebilir, ayrı bileşen değeri düşük |
| Typography (Title/Text/Paragraph ailesi) | Ellipsis/copyable/editable metin bileşenleri | kui-react bilinçli olarak düz Tailwind text class'larını tercih ediyor |

ProComponents (`ProTable`, `ProForm`, `ProField`) bu listede yok — onlar "eksik component" değil "eksik pattern": şema-güdümlü (valueType → otomatik render/edit) bir form/tablo sistemi. kui-react'te `Form`/`FormBuilder`/`FilterBar`/`DataTable` ayrı ayrı benzer işleri görüyor ama bu kadar sıkı entegre değil — bu, tek bir bileşenle kapatılamayacak, ayrı bir mimari karar.

## Stil ve tasarım sistemi

- kui-react: Tailwind CSS v4, kendi yazılmış bileşenler, `app/globals.css` içinde tanımlı CSS variable token seti (`--primary`, `--surface-raised`, `--text-secondary` vb.), `cn()` (clsx + tailwind-merge) zorunlu, ikonlar sadece Font Awesome. Tema değişimi CSS değişkenlerini override etmekten ibaret.
- ant-design-pro: antd v6'nın kendi design token sistemi (ConfigProvider / `antd-style` v4 `createStyles`) birincil; Tailwind v4 sadece layout için ikincil katman olarak devrede (`tailwind.config.js` çok minimal). Legacy Less dosyaları da hâlâ var (`global.less`, `Welcome.css`). İkon seti `@ant-design/icons`.
- kui-react'te component bazlı özgür stil yazımı var; ant-design-pro'da stil önceliği net bir hiyerarşiye bağlanmış (Tailwind → antd-style → CSS Modules → Less), yani antd'nin dışına çıkmak daha çok konvansiyon gerektiriyor.

## AI-agent odaklılık

Bu, ilginç biçimde her iki projenin de öncelik verdiği bir alan — ama farklı katmanlarda:

- **kui-react**: `GET /api/registry`, `llms.txt`, `llms-full.txt`, her bileşen için ayrı markdown (`public/components/<id>.md`), JSON Schema, ve bir MCP sunucusu (`scripts/mcp-server.mjs`) ile *bileşen kataloğunu* AI ajanlarına makine-okunur şekilde sunuyor. Amaç: "bu projede hangi bileşenler var, nasıl kullanılır" sorusuna agent'ın kendi kendine cevap bulabilmesi.
- **ant-design-pro**: kendi `CLAUDE.md`/`AGENTS.md`'si + `.claude/skills/` altında iki hazır Claude Code skill'i var — `/pro-upgrade` (projeyi en güncel Ant Design Pro şablonuyla diff'leyip iş kodunu koruyarak günceller) ve `/antd` (offline antd v3–v6 metadata'sı üzerinden `npx antd info/lint/demo/migrate` komutlarına erişim, "kod yazmadan önce API'yi antd CLI'dan doğrula" kuralıyla). Amaç: "antd API'sini doğru kullan ve şablonu güncel tut" — bir bileşen keşif API'si değil, bir CLI/upgrade asistanı.

Yani kui-react agent'a "ne var, nasıl bulunur" sorusunu; ant-design-pro agent'a "doğru antd API'sini nasıl kullanırım, şablonu nasıl güncel tutarım" sorusunu çözüyor. İkisi de birbirini tamamlayabilecek, örtüşmeyen katmanlar.

## Mimari felsefe

- kui-react: 4 katmanlı (`ui → app → domains → registry`), her katman bir öncekinin üstüne inşa ediliyor; `modules/showcase` ayrı bir dokümantasyon/canlı-önizleme sistemi. Routing/veri/erişim konusunda görüş bildirmiyor — sadece bileşen veriyor.
- ant-design-pro: Umi Max'in konvansiyon-bazlı mimarisi — `config/routes.ts` deklaratif route tanımları, `src/access.ts` route bazlı yetkilendirme, `app.tsx`'te `getInitialState`, sayfa-lokal `service.ts`/`_mock.ts`/`data.d.ts` co-location kuralı. Tüm uygulama iskeleti (routing, auth guard, mock, i18n) hazır geliyor; sen sadece business logic/sayfa dolduruyorsun.

## Ne zaman hangisi

- Var olan bir Next.js projesine hazır, geniş, tema kolayca değiştirilebilir bir Tailwind bileşen seti lazımsa → **kui-react**.
- Sıfırdan bir admin panel/enterprise dashboard kurulacaksa, antd'nin tasarım diline bağlı kalmak sorun değilse, routing/auth/mock/i18n iskeletinin hazır gelmesini istiyorsan → **ant-design-pro**.

İkisi birbirinin yerine geçmiyor: kui-react bir *component library*, ant-design-pro bir *application template*. Teorik olarak ant-design-pro'nun UI katmanı (antd + ProComponents) kui-react ile değiştirilebilir, ama bu ProTable/ProForm gibi ağır iş yapan bileşenlerin yeniden yazılmasını gerektirir — react-starter-kit'in shadcn primitive'lerini değiştirmekten çok daha maliyetli bir takas.
