'use client';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  WidgetBoard, WidgetKitProvider, BUILTIN_KINDS, BUILTIN_VIEWS, SAMPLE_BOARDS, SAMPLE_GALLERY_BOARD, sampleData,
  type BoardDocument, type SlotData,
} from '@/modules/app/WidgetKit';
import { TabGroup } from '@/modules/ui/TabGroup';
import { renderIcon } from './IotDashboard';

const noop = () => () => {};

/** One editable board bound to WidgetKit's sample data. */
function SampleBoard({ initial }: { initial: BoardDocument }) {
  const [doc, setDoc] = useState<BoardDocument>(initial);
  const data = useMemo(() => {
    const out: Record<string, Record<string, SlotData | undefined>> = {};
    for (const p of doc.placements) {
      out[p.id] = Object.fromEntries(Object.entries((p.binding ?? {}) as Record<string, string>).map(([slot, key]) => [slot, sampleData(key)]));
    }
    return out;
  }, [doc.placements]);
  return (
    <WidgetBoard doc={doc} onChange={setDoc} data={data} kinds={BUILTIN_KINDS} views={BUILTIN_VIEWS}
      onControl={async () => { await new Promise((r) => setTimeout(r, 300)); }} />
  );
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

/**
 * The widget gallery: five themed boards (plant, sales, energy, infrastructure, sites) and one with all
 * 25 builtin types, each bound to WidgetKit's sample data. The visual reference for the kit.
 */
export function WidgetGallery() {
  const isClient = useSyncExternalStore(noop, () => true, () => false);
  if (!isClient) return <div className="h-full p-6" aria-busy="true"><div className="h-96 animate-pulse rounded-xl bg-surface-sunken" /></div>;
  const boards = [...SAMPLE_BOARDS, SAMPLE_GALLERY_BOARD];
  return (
    <WidgetKitProvider value={{ renderIcon }}>
      <div className="h-full overflow-y-auto p-6">
        <TabGroup label="Sample boards" lazy
          tabs={boards.map((b) => ({ id: slug(b.board.title), label: b.board.title === 'Widget gallery' ? 'All widget types' : b.board.title, content: <div className="pt-4"><SampleBoard initial={b} /></div> }))} />
      </div>
    </WidgetKitProvider>
  );
}
