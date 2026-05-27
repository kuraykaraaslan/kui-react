'use client';
import { useId, useMemo, useState } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faCheck,
  faPaperPlane,
  faXmark,
  faLink,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { Modal } from '@/modules/ui/Modal';
import { Button } from '@/modules/ui/Button';
import { Avatar } from '@/modules/ui/Avatar';

export type SharePermission = 'viewer' | 'commenter' | 'editor' | 'owner';

export type ShareInvitee = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  permission: SharePermission;
};

export type ShareDialogProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  shareUrl: string;
  invitees?: ShareInvitee[];
  permissions?: { value: SharePermission; label: string }[];
  defaultPermission?: SharePermission;
  onInvite?: (email: string, permission: SharePermission) => void | Promise<void>;
  onRemove?: (id: string) => void;
  onPermissionChange?: (id: string, permission: SharePermission) => void;
  portalTarget?: Element | string | null;
};

const DEFAULT_PERMISSIONS: { value: SharePermission; label: string }[] = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'commenter', label: 'Commenter' },
  { value: 'editor', label: 'Editor' },
];

const permissionBadgeClass: Record<SharePermission, string> = {
  viewer: 'bg-surface-sunken text-text-secondary',
  commenter: 'bg-info-subtle text-info-fg',
  editor: 'bg-primary-subtle text-primary',
  owner: 'bg-warning-subtle text-warning-fg',
};

export function ShareDialog({
  open,
  onClose,
  title = 'Share',
  description = 'Invite people or copy the link.',
  shareUrl,
  invitees = [],
  permissions = DEFAULT_PERMISSIONS,
  defaultPermission = 'viewer',
  onInvite,
  onRemove,
  onPermissionChange,
  portalTarget,
}: ShareDialogProps) {
  const linkId = useId();
  const emailId = useId();
  const permId = useId();
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<SharePermission>(defaultPermission);
  const [copied, setCopied] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = useMemo(() => /.+@.+\..+/.test(email.trim()), [email]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Couldn't copy link.");
    }
  }

  async function handleInvite() {
    if (!emailValid) {
      setError('Enter a valid email address.');
      return;
    }
    setError(null);
    setInviting(true);
    try {
      await onInvite?.(email.trim(), permission);
      setEmail('');
    } finally {
      setInviting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="lg" portalTarget={portalTarget}>
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor={linkId} className="block text-sm font-medium text-text-primary">
            Shareable Link
          </label>
          <div className="flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-surface-base px-3 py-2 text-sm">
              <FontAwesomeIcon
                icon={faLink}
                className="w-3.5 h-3.5 text-text-disabled shrink-0"
                aria-hidden="true"
              />
              <input
                id={linkId}
                type="text"
                value={shareUrl}
                readOnly
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 bg-transparent text-text-primary focus-visible:outline-none truncate"
              />
            </div>
            <Button
              variant={copied ? 'secondary' : 'primary'}
              onClick={copyLink}
              iconLeft={
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                />
              }
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor={emailId} className="block text-sm font-medium text-text-primary">
            Invite People
          </label>
          <div className="flex items-center gap-2 rounded-md border border-border bg-surface-base px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-border-focus">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="w-3.5 h-3.5 text-text-disabled shrink-0"
              aria-hidden="true"
            />
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="name@example.com"
              aria-invalid={!!error}
              aria-describedby={error ? `${emailId}-error` : undefined}
              className="w-full bg-transparent text-text-primary placeholder:text-text-disabled focus-visible:outline-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <select
              id={permId}
              value={permission}
              onChange={(e) => setPermission(e.target.value as SharePermission)}
              aria-label="Select permission"
              className={cn(
                'rounded-md border border-border bg-surface-base px-3 py-2 text-sm text-text-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              )}
            >
              {permissions.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <Button
              onClick={handleInvite}
              loading={inviting}
              disabled={!emailValid || inviting}
              iconLeft={
                <FontAwesomeIcon icon={faPaperPlane} className="w-3.5 h-3.5" aria-hidden="true" />
              }
            >
              Invite
            </Button>
          </div>
          {error && (
            <p id={`${emailId}-error`} className="text-xs text-error" role="alert">
              {error}
            </p>
          )}
        </div>

        {invitees.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-text-disabled font-medium">
              People with access ({invitees.length})
            </p>
            <ul className="divide-y divide-border rounded-md border border-border bg-surface-base">
              {invitees.map((inv) => (
                <li key={inv.id} className="flex items-center gap-3 px-3 py-2">
                  <Avatar src={inv.avatarUrl ?? undefined} name={inv.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{inv.name}</p>
                    <p className="text-xs text-text-secondary truncate">{inv.email}</p>
                  </div>
                  {inv.permission === 'owner' ? (
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                        permissionBadgeClass.owner,
                      )}
                    >
                      Owner
                    </span>
                  ) : (
                    <select
                      value={inv.permission}
                      onChange={(e) =>
                        onPermissionChange?.(inv.id, e.target.value as SharePermission)
                      }
                      aria-label={`Permission for ${inv.name}`}
                      className={cn(
                        'rounded-md border border-border bg-surface-base px-2 py-1 text-xs text-text-primary',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                      )}
                    >
                      {permissions.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {inv.permission !== 'owner' && onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(inv.id)}
                      aria-label={`Remove ${inv.name}'s access`}
                      className={cn(
                        'shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-md text-text-disabled',
                        'hover:text-error hover:bg-error-subtle transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
                      )}
                    >
                      <FontAwesomeIcon icon={faXmark} className="w-3 h-3" aria-hidden="true" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
