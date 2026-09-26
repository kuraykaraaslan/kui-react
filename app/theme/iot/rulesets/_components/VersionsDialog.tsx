'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faRotateLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '@/modules/ui/Modal';
import { Button } from '@/modules/ui/Button';
import { Badge } from '@/modules/ui/Badge';
import type { RuleChain } from '@/modules/domains/iot/types';
import type { RulesetVersion } from '@/modules/domains/iot/ruleset/transfer';
import { formatDateTime } from './download';

export function VersionsDialog({ chain, versions, onClose, onRestore, onDownload }: {
  /** the ruleset whose versions are shown; null closes the dialog */
  chain: RuleChain | null;
  versions: RulesetVersion[];
  onClose: () => void;
  onRestore: (version: number) => void;
  /** export one version (same secret handling as any export) */
  onDownload: (version: RulesetVersion) => void;
}) {
  const [status, setStatus] = useState('');
  const sorted = [...versions].sort((a, b) => b.version - a.version);
  const current = sorted[0]?.version;

  function download(v: RulesetVersion) {
    onDownload(v);
    setStatus('');
  }

  function restore(v: RulesetVersion) {
    onRestore(v.version);
    setStatus(`Version ${v.version} restored and saved as version ${(current ?? 0) + 1}.`);
  }

  return (
    <Modal
      open={!!chain}
      onClose={() => { setStatus(''); onClose(); }}
      title={chain ? `Versions — ${chain.name}` : 'Versions'}
      description="Every save keeps a version. Restoring saves the old version as a new one, so nothing is lost."
      size="lg"
      scrollable
      className="max-h-[90vh] sm:max-w-3xl"
    >
      <div className="space-y-3">
        <p role="status" className="min-h-5 text-sm text-success-fg">
          {status && <><FontAwesomeIcon icon={faCircleCheck} className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />{status}</>}
        </p>
        {sorted.length === 0 ? (
          <p className="text-sm text-text-secondary">No versions saved yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <caption className="sr-only">Saved versions</caption>
              <thead className="bg-surface-overlay text-xs uppercase tracking-wide text-text-secondary">
                <tr>
                  <th scope="col" className="px-3 py-2 font-semibold">Version</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Saved at</th>
                  <th scope="col" className="px-3 py-2 font-semibold">By</th>
                  <th scope="col" className="px-3 py-2 font-semibold">Changes</th>
                  <th scope="col" className="px-3 py-2 text-right font-semibold"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sorted.map((v) => (
                  <tr key={v.version}>
                    <td className="whitespace-nowrap px-3 py-2 font-medium text-text-primary">
                      v{v.version}
                      {v.version === current && <Badge variant="success" size="sm" className="ml-2">current</Badge>}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-text-secondary">{formatDateTime(v.savedAt)}</td>
                    <td className="px-3 py-2 text-text-secondary">{v.by}</td>
                    <td className="px-3 py-2 text-text-secondary">{v.summary}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="xs" onClick={() => download(v)} aria-label={`Download version ${v.version}`}>
                          <FontAwesomeIcon icon={faDownload} className="h-3 w-3" aria-hidden="true" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                        {v.version !== current && (
                          <Button variant="outline" size="xs" onClick={() => restore(v)} aria-label={`Restore version ${v.version}`}>
                            <FontAwesomeIcon icon={faRotateLeft} className="h-3 w-3" aria-hidden="true" />
                            <span className="hidden sm:inline">Restore</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
}
