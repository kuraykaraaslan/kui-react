'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '@/modules/ui/Modal';
import { Button } from '@/modules/ui/Button';
import { DELETED_KEEP_DAYS, type DeletedRuleset } from '@/modules/domains/iot/ruleset/transfer';
import { formatDateTime } from './download';

function ago(iso: string, now: number) {
  const h = Math.floor((now - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h} ${h === 1 ? 'hour' : 'hours'} ago`;
  const d = Math.floor(h / 24);
  return `${d} ${d === 1 ? 'day' : 'days'} ago`;
}

export function DeletedDialog({ open, items, now, onClose, onRestore }: {
  open: boolean;
  /** already limited to the last 7 days */
  items: DeletedRuleset[];
  /** reference time for "2 days ago" */
  now: number;
  onClose: () => void;
  onRestore: (entry: DeletedRuleset) => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Recently deleted"
      description={`Deleted rulesets are kept for ${DELETED_KEEP_DAYS} days. A restored ruleset comes back inactive.`}
      size="lg"
      scrollable
      className="max-h-[90vh]"
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <FontAwesomeIcon icon={faTrashCan} className="h-6 w-6 text-text-disabled" aria-hidden="true" />
          <p className="text-sm text-text-secondary">Nothing deleted in the last {DELETED_KEEP_DAYS} days.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border" aria-label="Deleted rulesets">
          {items.map((d) => (
            <li key={`${d.chain.chainId}-${d.deletedAt}`} className="flex flex-wrap items-center gap-3 px-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">{d.chain.name}</p>
                <p className="text-xs text-text-secondary">
                  <time dateTime={d.deletedAt} title={formatDateTime(d.deletedAt)}>Deleted {ago(d.deletedAt, now)}</time>
                  {' · '}{d.chain.nodes.length} nodes
                </p>
              </div>
              <Button variant="outline" size="xs" onClick={() => onRestore(d)} aria-label={`Restore ${d.chain.name}`}>
                <FontAwesomeIcon icon={faRotateLeft} className="h-3 w-3" aria-hidden="true" />
                Restore
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
