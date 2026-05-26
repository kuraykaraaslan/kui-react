# RulesetEditor — Refactor Planı

## Hedef
`modules/domains/iot/ruleset/RulesetEditor.tsx` (911 satır) — birden çok bağımsız sub-component’i (CodeEditor, JsonEditor, NodeResultPanel, ChainTracePanel, NodeDebugModal, RulesetDebugModal, NodeEditorPanel) ve büyük bir canvas/render gövdesini tek dosyada tutuyor. Ayrı dosyalara çıkar, ana `<RulesetEditor />` public API (ref + props) aynı kalsın.

> EJS karşılığı **yok** — `02_EJS_Components` IoT/Ruleset modülü içermiyor. Parite şartı yok; ancak ileride port edilebilir olması için bölünme sınırlarını net çiz.

## Mevcut iskelet (modules/domains/iot/ruleset/RulesetEditor.tsx)
| Bölge | Satır | İçerik |
|---|---|---|
| Geometry constants | 15–22 | `NODE_W`, `NODE_HEADER_H`, `PORT_R`, `PORT_STEP`, `PORT_TOP_OFFSET` |
| Port meta | 23–42 | `PORT_META`, `portColor`, `portEdgeLabel` |
| Default scripts | 44–106 | `DEFAULT_SCRIPTS` (her node tipi için) |
| Node visuals | 108–128 | `NODE_VISUALS` (icon, color, ports) |
| Geometry helpers | 130–142 | `inputPortY`, `outputPortY`, `nodeHeight`, `bezier` |
| Script execution | 143–202 | `runScript`, `traceChain`, `RunResult`, `TraceStep` |
| CodeEditor | 203–229 | textarea + satır numarası gutter |
| JsonEditor | 230–250 | textarea + JSON validation rozet |
| MsgTypeInput | 251–263 | basit text input |
| NodeResultPanel | 264–320 | tek-node debug sonucu |
| ChainTracePanel | 321–381 | zincir trace görüntüleyici |
| NodeDebugModal | 382–432 | tek-node debug modal’ı |
| RulesetDebugModal | 433–478 | tüm ruleset debug modal’ı |
| NodeEditorPanel | 479–582 | sağ taraf script editör paneli |
| Public ref API | 583–596 | `RulesetEditorRef`, `RulesetEditorProps` |
| Main component | 598–911 | state (15 useState/useRef), drag/connect handler’ları, SVG canvas render, palette, edge labels |

## Hedef yapı
```
modules/domains/iot/ruleset/RulesetEditor/
├── index.tsx                       ← named export RulesetEditor + RulesetEditorRef tipi (≤180 satır)
├── geometry.ts                     ← NODE_W, NODE_HEADER_H, PORT_R, PORT_STEP, PORT_TOP_OFFSET, inputPortY, outputPortY, nodeHeight, bezier
├── node-meta.ts                    ← PORT_META, NODE_VISUALS, portColor, portEdgeLabel, PortDef tipi
├── default-scripts.ts              ← DEFAULT_SCRIPTS
├── runtime/
│   ├── runScript.ts                ← RunResult + runScript()
│   └── traceChain.ts               ← TraceStep + traceChain()
├── editors/
│   ├── CodeEditor.tsx              ← satır 203–229
│   ├── JsonEditor.tsx              ← satır 230–250
│   └── MsgTypeInput.tsx            ← satır 251–263
├── panels/
│   ├── NodeResultPanel.tsx         ← satır 264–320
│   ├── ChainTracePanel.tsx         ← satır 321–381
│   └── NodeEditorPanel.tsx         ← satır 479–582
├── modals/
│   ├── NodeDebugModal.tsx          ← satır 382–432
│   └── RulesetDebugModal.tsx       ← satır 433–478
├── canvas/
│   ├── RuleNode.tsx                ← tek node’un SVG çizimi (header rect, ports, label) — bugün main component içinde inline
│   ├── RuleEdge.tsx                ← edge’in bezier path’i + port label
│   ├── Palette.tsx                 ← sol palette (drag kaynağı node tipleri)
│   └── Canvas.tsx                  ← SVG kapsayıcı, drag/connect koordinasyonu (state hala parent’ta)
└── hooks/
    ├── useNodeDrag.ts              ← dragNodeId + dragOffset + mousemove/up listener’ları
    ├── useEdgeConnect.ts           ← connecting state + handlePortMouseDown/Up
    └── usePaletteDrop.ts           ← paletteDrag + drop handler
```

## Adım adım
1. **Klasör.** `mv modules/domains/iot/ruleset/RulesetEditor.tsx modules/domains/iot/ruleset/RulesetEditor/index.tsx`. `modules/domains/iot/index.ts` (barrel) sade `export { RulesetEditor, type RulesetEditorRef, type RulesetEditorProps } from './ruleset/RulesetEditor';` olarak güncellenebilir; yol değişmediği için tüketicileri etkilemez.
2. **Sabit dosyalar.** `geometry.ts`, `node-meta.ts`, `default-scripts.ts` — saf veriler, side effect yok. `node-meta.ts` `PortDef` tipini de export etsin.
3. **runtime/.** `runScript.ts` + `traceChain.ts`. `Function` constructor’lı eval davranışı korunsun; eklenti yok.
4. **editors/.** `CodeEditor` zaten kendi `useRef`’lerini taşıyor — birebir taşı, internal helper yok.
5. **panels/.** `NodeResultPanel`, `ChainTracePanel`, `NodeEditorPanel` taşı. `NodeEditorPanel` `editors/CodeEditor`’a bağımlı; import yolunu düzelt.
6. **modals/.** İki debug modal Modal + JsonEditor + MsgTypeInput’a bağlı; importları düzelt.
7. **canvas/RuleNode.tsx.** Main component’tan ayıklan: tek node’un SVG markup’ı (header + body + portlar + onMouseDown payload). Props: `{ node, visual, selected, onMouseDownHeader, onPortDown, onPortUp }`.
8. **canvas/RuleEdge.tsx.** Tek edge’in bezier path + label. Props: `{ edge, sourceNode, targetNode, sourcePortIdx, targetPortIdx }`.
9. **canvas/Palette.tsx.** Sol panel; drag start event’ini parent’a iletir (`onPaletteDragStart(type)`).
10. **canvas/Canvas.tsx.** SVG `<svg>` kapsayıcı + nodes.map + edges.map + connecting preview path. State **yok** — handler’ları prop ile alır.
11. **hooks/useNodeDrag.ts.** Window-level `mousemove/mouseup` listener’ları + `dragOffset` ref + container koordinat dönüşümü. Döner: `{ dragNodeId, onNodeHeaderMouseDown }` ve `nodes` state setter’ını parent verir.
12. **hooks/useEdgeConnect.ts.** `connecting` state + `onPortDown(nodeId, portIdx)` / `onPortUp(nodeId, portIdx)` + edges state setter parent’tan gelir.
13. **hooks/usePaletteDrop.ts.** `paletteDrag` state + canvas üzerine drop handler; yeni node ekler.
14. **index.tsx.** Sıra: props destructure → ref setup (`useImperativeHandle`) → state (nodes, edges, selected, edit/debug state) → hook çağrıları → render = `<Palette /> <Canvas /> <NodeEditorPanel /> <NodeDebugModal /> <RulesetDebugModal />`.
15. **Snapshot.** `npm run registry:snapshot` — registry’deki `RulesetEditor` source path’i değişir, regenerasyon zorunlu.
16. **Smoke test.** `/theme/iot/rulesets/` ve showcase IoT/Ruleset variantı: node sürükle, port bağla, palette’ten yeni node bırak, script düzenle + apply, debug modal aç, chain trace görüntüle.
17. **Tip kontrolü.** `npx tsc --noEmit`.

## Doğrulama kriterleri
- [ ] `index.tsx` ≤ 200 satır.
- [ ] Hiçbir sub-component / hook dosyası 200 satırı geçmesin (NodeEditorPanel sınırda — kabul edilir, gerekirse iki alt parçaya bölünmez).
- [ ] Public ref API (`openRulesetDebug`) ve `RulesetEditorProps` aynı; `app/theme/iot/rulesets/page.tsx` değişmeden çalışmalı.
- [ ] `npm run build` + `npm run registry:snapshot` temiz.
- [ ] Showcase entry `modules/showcase/data/sections/domain-iot.showcase.tsx` içindeki source kod örneği güncellenmeli (eğer inlined ise) — script bunu otomatik yenilemiyorsa elle gez.

## EJS paritesi
Yok. Eğer ilerleyen bir sprintte 02_EJS_Components’a IoT modülü eklenirse, yukarıdaki klasör sınırları (geometry / node-meta / runtime / editors / panels / modals / canvas) birebir EJS partial’larına eşlenebilir. Karar verildiğinde [feedback_ejs_nextjs_parity.md](../../.claude/projects/-home-kuray-01-NextJS-Components/memory/feedback_ejs_nextjs_parity.md) tetiklensin.
