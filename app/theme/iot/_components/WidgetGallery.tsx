'use client';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  WidgetBoard, WidgetKitProvider, BUILTIN_KINDS, BUILTIN_VIEWS, SAMPLE_GALLERY_BOARD, sampleData,
  type BoardDocument, type SlotData,
} from '@/modules/app/WidgetKit';
import { renderIcon } from './IotDashboard';

const noop = () => () => {};

/**
 * The widget gallery: all 24 builtin widget types on one editable board, bound to WidgetKit's sample
 * data. It is the visual reference for the kit (every type, real-looking data, light and dark).
 */
export function WidgetGallery() {
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  const [doc, setDoc] = useState<BoardDocument>(SAMPLE_GALLERY_BOARD);
  const data = useMemo(() => {
    const out: Record<string, Record<string, SlotData | undefined>> = {};
    for (const p of doc.placements) {
      out[p.id] = Object.fromEntries(Object.entries((p.binding ?? {}) as Record<string, string>).map(([slot, key]) => [slot, sampleData(key)]));
    }
    return out;
  }, [doc.placements]);
  if (!isClient) return <div className="h-full p-6" aria-busy="true"><div className="h-96 animate-pulse rounded-xl bg-surface-sunken" /></div>;
  return (
    <WidgetKitProvider value={{ renderIcon }}>
      <div className="h-full overflow-y-auto p-6">
        <WidgetBoard doc={doc} onChange={setDoc} data={data} kinds={BUILTIN_KINDS} views={BUILTIN_VIEWS}
          onControl={async () => { await new Promise((r) => setTimeout(r, 300)); }} />
      </div>
    </WidgetKitProvider>
  );
}
