'use client';
import { cn } from '@/libs/utils/cn';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWallet,
  faChevronDown,
  faCopy,
  faArrowRightFromBracket,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import type { ConnectedWallet, WalletProvider } from '../types';

const providerMeta: Record<WalletProvider, { label: string; classes: string }> = {
  METAMASK:      { label: 'MetaMask',       classes: 'bg-warning-subtle text-warning-fg' },
  WALLETCONNECT: { label: 'WalletConnect',  classes: 'bg-info-subtle text-info-fg' },
  COINBASE:      { label: 'Coinbase',       classes: 'bg-primary-subtle text-primary' },
  PHANTOM:       { label: 'Phantom',        classes: 'bg-secondary-subtle text-secondary' },
  RAINBOW:       { label: 'Rainbow',        classes: 'bg-error-subtle text-error-fg' },
};

const PROVIDERS: WalletProvider[] = ['METAMASK', 'WALLETCONNECT', 'COINBASE', 'PHANTOM', 'RAINBOW'];

function shortenAddress(addr: string): string {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

type WalletConnectButtonProps = {
  wallet?: ConnectedWallet | null;
  onConnect?: (provider: WalletProvider) => void;
  onDisconnect?: () => void;
  className?: string;
};

export function WalletConnectButton({
  wallet = null,
  onConnect,
  onDisconnect,
  className,
}: WalletConnectButtonProps) {
  const [open, setOpen] = useState(false);

  if (wallet) {
    return (
      <div className={cn('relative', className)}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-base px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-overlay transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          <FontAwesomeIcon icon={faEthereum} className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
          <span className="tabular-nums">{wallet.balanceEth.toFixed(3)} ETH</span>
          <span className="hidden sm:inline font-mono text-text-secondary">
            {wallet.ensName ?? shortenAddress(wallet.address)}
          </span>
          <FontAwesomeIcon icon={faChevronDown} className="w-2.5 h-2.5 text-text-secondary" aria-hidden="true" />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-64 rounded-xl border border-border bg-surface-base shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-xs text-text-secondary">Connected via {providerMeta[wallet.provider].label}</p>
              <p className="mt-1 font-mono text-sm text-text-primary truncate">
                {wallet.ensName ?? shortenAddress(wallet.address)}
              </p>
              <p className="mt-2 text-lg font-bold text-text-primary tabular-nums">
                {wallet.balanceEth.toFixed(4)} ETH
              </p>
            </div>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface-overlay hover:text-text-primary transition-colors"
            >
              <FontAwesomeIcon icon={faCopy} className="w-3.5 h-3.5" aria-hidden="true" />
              Copy address
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); onDisconnect?.(); }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error-subtle transition-colors"
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="w-3.5 h-3.5" aria-hidden="true" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-fg hover:bg-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        <FontAwesomeIcon icon={faWallet} className="w-3.5 h-3.5" aria-hidden="true" />
        Connect wallet
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-60 rounded-xl border border-border bg-surface-base shadow-lg z-50 overflow-hidden py-1">
          <p className="px-4 py-2 text-[10px] font-medium uppercase tracking-wide text-text-secondary border-b border-border">
            Choose a wallet
          </p>
          {PROVIDERS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => { setOpen(false); onConnect?.(p); }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-overlay transition-colors"
            >
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg',
                  providerMeta[p].classes,
                )}
              >
                <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <span className="text-text-primary">{providerMeta[p].label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
