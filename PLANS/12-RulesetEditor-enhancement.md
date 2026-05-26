# RulesetEditor — Geliştirme Planı (Dünya Standardı)

> Refactor planı: [02-RulesetEditor-split.md](./02-RulesetEditor-split.md). Bu doküman **bölünme sonrası** uygulanacak özellik yol haritasıdır. Hedef: Node-RED / n8n / Apache NiFi seviyesinde bir görsel kural editörü.

> **EJS karşılığı yok** — `02_EJS_Components` IoT modülü içermiyor. Sadece NextJS tarafı kapsamda. Geleceğe yönelik: aşağıdaki milestone’lar EJS’ye port edilirse pixel-perfect parite zorunlu olacak.

## Kuzey Yıldızı
ThingsBoard Rule Chains + Node-RED + n8n + Unreal Blueprints arasında bir noktada — IoT mesaj akışı için, **scripte düşmeden** kural yazılabilen, debug edilebilen, sürüm yönetilebilen, mobil-friendly canvas.

## Karşılaştırma referansları
- **Node-RED** — palette, draggable nodes, port renkleri, debug panel.
- **n8n** — JSON-Schema-aware node config form’ları, expression editor, sub-workflow.
- **ThingsBoard Rule Chain** — IoT-specific node tipleri, runtime trace görselleştirme.
- **Blender Shader Editor / Unreal Blueprints** — pan/zoom, mini-map, snap-to-grid, multi-select.
- **Figma** — undo/redo davranışı, copy/paste, klavye haritası standardı.

## Özellik milestone’ları

### M1 — Canvas temelleri
| Özellik | Notlar |
|---|---|
| Pan + zoom | Orta-tıkla pan, wheel zoom (Ctrl+wheel = zoom, wheel = pan), pinch-zoom; `transform: matrix(s,0,0,s,tx,ty)`. `useCanvasTransform` hook. |
| Snap-to-grid | 8 px / 16 px / off; shift basılı tutunca kapalı. |
| Alignment guides | Sürüklenirken yakın node’larla X/Y hizalaması, 4 px snap. |
| Multi-select | Boş canvas’ta drag rectangle, shift+click toggle, Ctrl+A select-all. |
| Group move | Multi-select sürüklendiğinde hepsi birlikte. |
| Mini-map | Sağ-alt 160×120 px, viewport rect overlay, click-to-pan. |
| Auto-layout | "Auto-arrange" butonu — [dagre](https://github.com/dagrejs/dagre) (left-to-right). |

### M2 — Düzenleme deneyimi
| Özellik | Notlar |
|---|---|
| Undo / redo stack | Cap 100, `Ctrl+Z` / `Ctrl+Shift+Z`. State diff’i, full snapshot değil. |
| Copy / cut / paste | Ctrl+C / Ctrl+X / Ctrl+V; JSON serialize, paste = yeni id’ler + ofset. |
| Duplicate | Ctrl+D, hover’daki node’u 24 px ofsetle çoğalt. |
| Delete | `Delete` / `Backspace` selected nodes + bağlı edge’ler. |
| Klavye haritası overlay | `Shift+?` — modal. |
| Bulk-delete confirm | 3+ node silinirken Modal onay. |
| Edge bağlama UX | drag preview yarı saydam path; geçerli portlar üzerinde ışıma (validator port tipi). |
| Edge re-routing | Node hareket ettiğinde Manhattan/orthogonal routing seçeneği. |
| Edge label edit | Çift tık → inline edit. |

### M3 — Script editör paritesi (Monaco)
| Özellik | Notlar |
|---|---|
| Monaco editör | `@monaco-editor/react` dynamic import. JS syntax highlight, lint, autocomplete. |
| `msg` / `metadata` / `message_type` type defs | `monaco.languages.typescript.javascriptDefaults.addExtraLib(...)`. |
| Tema | `vs-dark` / `vs` — `prefers-color-scheme`. |
| Hata göstergesi | parse-time syntax error → port label kırmızı. |
| Snippets | `trigger`, `filter`, `transform`, `action` her tip için 3+ snippet. |
| Format | Prettier-in-the-browser (lite) veya Monaco built-in format. |
| Lokal kayıt | Editör draft’ı her node id için `localStorage`’a. |

### M4 — Çalışma zamanı + debug
| Özellik | Notlar |
|---|---|
| Live trace | "Watch mode" — her mesaj geldiğinde edge’ler 600 ms süreyle parlasın. |
| Stepper | Debug modal’da "step into / over". |
| Breakpoint | Node header’a sağ-tık → "Break here"; runScript bu node’da pause. |
| Variable inspector | `msg`, `metadata`, locals — JSON tree view + pin. |
| Replay | Son 50 mesajı kaydet, üstüne tekrar çalıştır. |
| Performans metrikleri | Her node için "ortalama exec süresi" rozet. |
| Schema validation | `msg` JSON-Schema (opsiyonel prop), uymayan field → error. |

### M5 — Versiyon kontrol + collaboration
| Özellik | Notlar |
|---|---|
| Versiyon snapshot’ları | Her save = yeni snapshot, yan panel "History" — diff görüntüle, restore. |
| Export / Import JSON | `.ruleset.json`, schema validation’lı. |
| Import’ta merge / replace seçeneği | |
| Sub-graphs (grouping) | Multi-select → "Group" → tek collapsed node; çift tık → içeri. |
| Comments / sticky notes | Yeni node tipi `NOTE` — sarı arka plan, sadece görsel. |
| Read-only mode | `readonly: boolean` prop; tüm düzenleme kapalı, debug açık. |
| Real-time collab (opsiyonel, M5.5) | Yjs + WebRTC provider — cursor presence. |

### M6 — A11y + UX cilası
| Özellik | Notlar |
|---|---|
| Klavye navigasyonu | Tab → node sırayla focus; Enter → edit; arrow → node taşı. |
| Screen reader | Live region: "Connected Filter to Transform via True port". |
| Renk-körü güvenli paleti | Mevcut `PORT_META` renkleri ColorBrewer "Set1" ile karşılaştır + ikon shape eklentisi (her port tipinin küçük ikonu). |
| Reduced motion | Edge fade-in / shake animasyonları kapanır. |
| Mobil dokunmatik | Long-press = select, two-finger pan, pinch-zoom, FAB ile palette modali. |
| i18n | Tüm string’ler `messages` prop’tan. |
| Tema variant’ları | Default + High Contrast + Solarized — token-based. |

## Public API delta
```ts
type RulesetEditorProps = {
  initialNodes: RuleNode[];
  initialEdges: RuleEdge[];
  chainName?: string;

  // M2
  readonly?: boolean;
  history?: { capacity?: number; persistKey?: string };
  onSave?: (snapshot: { nodes: RuleNode[]; edges: RuleEdge[] }) => void | Promise<void>;

  // M4
  schema?: JsonSchema;
  onTelemetry?: (e: RulesetTelemetry) => void;
  onValidate?: (errors: RuleValidationError[]) => void;

  // M5
  snapshots?: RulesetSnapshot[];
  onSnapshotsChange?: (snapshots: RulesetSnapshot[]) => void;

  // M6
  messages?: Partial<RulesetEditorMessages>;
  reducedMotion?: boolean;
  theme?: 'auto' | 'light' | 'dark' | 'high-contrast';
};

type RulesetEditorRef = {
  openRulesetDebug: () => void;
  // Yeni:
  undo: () => void;
  redo: () => void;
  fit: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  export: () => { nodes: RuleNode[]; edges: RuleEdge[]; meta: { version: string } };
  import: (data: unknown) => { ok: boolean; errors?: string[] };
};
```

## A11y kabul kriterleri (M6 sonu)
- [ ] axe-core 0 violations.
- [ ] Klavye-only ile tam zincir oluşturulabilmeli (palette → drop → connect → edit script → save).
- [ ] VoiceOver: her node "Filter node, selected, port True connected to Transform".
- [ ] `prefers-reduced-motion` honor edildi.

## Performans bütçesi
| Metrik | Hedef |
|---|---|
| Ana yol JS (gzip) | ≤ 35 kB (Monaco hariç) |
| Monaco lazy | + ~ 1 MB (sadece editor açılınca) |
| 100 node @ 60fps pan | sustained ≥ 55 fps |
| 1000 node sınır testi | en az 30 fps |
| Undo 1 step | < 16 ms |

## Telemetri şeması
```ts
type RulesetTelemetry =
  | { type: 'node-add'; nodeType: RuleNodeType }
  | { type: 'node-delete'; id: string }
  | { type: 'edge-add'; from: string; to: string }
  | { type: 'edge-delete'; id: string }
  | { type: 'script-apply'; id: string; bytes: number }
  | { type: 'debug-run'; durationMs: number; steps: number }
  | { type: 'undo' | 'redo' }
  | { type: 'export' | 'import' }
  | { type: 'validation-fail'; count: number };
```

## EJS paritesi
Şu an için **kapsam dışı**. Eğer ileride 02_EJS_Components’a IoT modülü eklenirse, bu plan EJS partial yapısına port edilmeli (canvas SVG, palette, panel, modal’lar tüm partial’lara karşılık gelir; Monaco dahil olamayacağı için fallback `<textarea>` + light syntax highlighter — örn. PrismJS).

## Definition of Done (milestone başına)
- [ ] Showcase IoT/Ruleset variant’ı yeni özelliği gösteriyor.
- [ ] `/theme/iot/rulesets/` sayfasında manuel senaryo yeşil (PLANS/checklists/ruleset-mX.md).
- [ ] `npm run registry:snapshot` + `npm run build` temiz.
- [ ] A11y + perf + i18n + telemetri kabul kriterleri yeşil.
- [ ] CHANGELOG.md — `## [RulesetEditor Mx]`.
