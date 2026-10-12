'use client';
import { Modal } from '@/modules/ui/Modal';
import { formatChord, SHORTCUT_GROUPS, SHORTCUTS } from '../shortcuts';
import { useMessages } from '../messages';
import { SecondaryButton } from './buttons';

/**
 * The list of keyboard shortcuts, read from the binding table, so it always matches what the keys do. A read-only
 * editor does not list what changes the flow; `save` is listed only when the host handles it (`onSave`).
 */
export function ShortcutsDialog({ readOnly, canSave, mac, onClose }: { readOnly: boolean; canSave: boolean; mac: boolean; onClose: () => void }) {
  const m = useMessages();
  const listed = SHORTCUTS.filter((s) => !(readOnly && s.writes) && (s.id !== 'save' || canSave));
  return (
    <Modal open onClose={onClose} title={m.shortcutsTitle} description={m.shortcutsIntro} size="md" scrollable
      footer={<div className="flex w-full justify-end"><SecondaryButton onClick={onClose}>{m.wsClose}</SecondaryButton></div>}>
      <div className="space-y-4">
        {SHORTCUT_GROUPS.map((group) => {
          const rows = listed.filter((s) => s.group === group);
          if (!rows.length) return null;
          return (
            <section key={group} aria-label={m.shortcutGroup(group)}>
              <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-secondary">{m.shortcutGroup(group)}</h3>
              <ul className="divide-y divide-border">
                {rows.map((s) => (
                  <li key={s.id} data-shortcut={s.id} className="flex items-center justify-between gap-4 py-1.5 text-sm">
                    <span>{m.shortcutText(s.id)}</span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      {s.chords.map((c, i) => (
                        <span key={i} className="flex items-center gap-1.5">
                          {i > 0 && <span aria-hidden="true" className="text-text-secondary">/</span>}
                          <kbd className="rounded border border-border bg-surface-raised px-1.5 py-0.5 font-sans text-xs">{formatChord(c, mac)}</kbd>
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Modal>
  );
}
