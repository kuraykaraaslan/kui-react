'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudArrowUp,
  faCheck,
  faImage,
  faTag,
  faGavel,
} from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import { cn } from '@/libs/utils/cn';
import { MintProgressBar } from '@/modules/domains/nft/mint/MintProgressBar';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

const STEPS = ['Upload', 'Details', 'Pricing', 'Review'] as const;
type Step = (typeof STEPS)[number];

export default function NftCreatePage() {
  const [step, setStep] = useState<Step>('Upload');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [chain, setChain] = useState('Ethereum');
  const [type, setType] = useState<'listing' | 'auction'>('listing');
  const [price, setPrice] = useState('0.5');

  const stepIndex = STEPS.indexOf(step);
  const next = () => stepIndex < STEPS.length - 1 && setStep(STEPS[stepIndex + 1]);
  const back = () => stepIndex > 0 && setStep(STEPS[stepIndex - 1]);

  return (
    <>
      <DocumentTitle text="Create — NFT Theme" />
      <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Create new item</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Mint a new NFT and list it on the Glyph marketplace.
        </p>
      </div>

      {/* Stepper */}
      <ol className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                i < stepIndex && 'bg-success text-text-inverse',
                i === stepIndex && 'bg-primary text-primary-fg',
                i > stepIndex && 'bg-surface-sunken text-text-secondary',
              )}
            >
              {i < stepIndex ? <FontAwesomeIcon icon={faCheck} className="w-3 h-3" aria-hidden="true" /> : i + 1}
            </div>
            <span
              className={cn(
                'truncate text-xs font-medium',
                i <= stepIndex ? 'text-text-primary' : 'text-text-secondary',
              )}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <span className={cn('h-px flex-1', i < stepIndex ? 'bg-success' : 'bg-border')} />
            )}
          </li>
        ))}
      </ol>

      {/* Body */}
      <section className="rounded-xl border border-border bg-surface-base p-6 space-y-4">
        {step === 'Upload' && (
          <>
            <h2 className="text-sm font-semibold text-text-primary">Upload media</h2>
            <label
              htmlFor="file"
              className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface-raised p-12 text-center cursor-pointer hover:bg-surface-overlay transition-colors"
            >
              <FontAwesomeIcon icon={faCloudArrowUp} className="w-8 h-8 text-text-secondary" aria-hidden="true" />
              <p className="text-sm font-medium text-text-primary">Drop file or click to upload</p>
              <p className="text-xs text-text-secondary">PNG, JPG, GIF, SVG, MP4 — up to 100 MB</p>
              <input id="file" type="file" accept="image/*,video/*" className="sr-only" />
            </label>
          </>
        )}

        {step === 'Details' && (
          <>
            <h2 className="text-sm font-semibold text-text-primary">Item details</h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs font-medium text-text-secondary">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Glyph Genesis #042"
                  className="mt-1 block w-full rounded-lg border border-border bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-text-secondary">Description</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Tell collectors about your piece…"
                  className="mt-1 block w-full rounded-lg border border-border bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-text-secondary">Blockchain</span>
                <select
                  value={chain}
                  onChange={(e) => setChain(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-border bg-surface-base px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
                >
                  <option>Ethereum</option>
                  <option>Polygon</option>
                  <option>Solana</option>
                  <option>Base</option>
                  <option>Arbitrum</option>
                </select>
              </label>
            </div>
          </>
        )}

        {step === 'Pricing' && (
          <>
            <h2 className="text-sm font-semibold text-text-primary">Pricing & listing</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(['listing', 'auction'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setType(mode)}
                  className={cn(
                    'rounded-xl border p-4 text-left transition-colors',
                    type === mode
                      ? 'border-primary bg-primary-subtle'
                      : 'border-border bg-surface-base hover:bg-surface-overlay',
                  )}
                >
                  <FontAwesomeIcon
                    icon={mode === 'listing' ? faTag : faGavel}
                    className="w-4 h-4 text-primary"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-sm font-semibold text-text-primary capitalize">{mode === 'listing' ? 'Fixed price' : 'Timed auction'}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {mode === 'listing'
                      ? 'List at a set price. Buyers purchase instantly.'
                      : 'Accept bids over a fixed window. Highest wins.'}
                  </p>
                </button>
              ))}
            </div>

            <label className="block">
              <span className="text-xs font-medium text-text-secondary">
                {type === 'auction' ? 'Starting price (ETH)' : 'Price (ETH)'}
              </span>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-surface-base px-3 py-2">
                <FontAwesomeIcon icon={faEthereum} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-text-primary focus-visible:outline-none tabular-nums"
                />
              </div>
            </label>
          </>
        )}

        {step === 'Review' && (
          <>
            <h2 className="text-sm font-semibold text-text-primary">Review and mint</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="aspect-square rounded-xl bg-surface-sunken flex items-center justify-center text-text-secondary">
                <FontAwesomeIcon icon={faImage} className="w-12 h-12" aria-hidden="true" />
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-text-secondary">Name</dt><dd className="font-medium text-text-primary">{name || '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-text-secondary">Chain</dt><dd className="font-medium text-text-primary">{chain}</dd></div>
                <div className="flex justify-between"><dt className="text-text-secondary">Listing</dt><dd className="font-medium text-text-primary capitalize">{type}</dd></div>
                <div className="flex justify-between"><dt className="text-text-secondary">Price</dt><dd className="font-medium text-text-primary tabular-nums">{price} ETH</dd></div>
                <div className="flex justify-between border-t border-border pt-2 mt-2">
                  <dt className="text-text-secondary">Est. gas fee</dt>
                  <dd className="font-medium text-text-primary tabular-nums">0.0021 ETH</dd>
                </div>
              </dl>
            </div>
            <MintProgressBar mintedCount={1247} totalSupply={5000} mintPriceEth={Number(price) || 0} label="Collection mint progress" />
          </>
        )}
      </section>

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={stepIndex === 0}
          className="rounded-lg border border-border bg-surface-base px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-overlay transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        {step === 'Review' ? (
          <button
            type="button"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-fg hover:bg-primary-hover transition-colors"
          >
            Mint NFT
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-fg hover:bg-primary-hover transition-colors"
          >
            Continue
          </button>
        )}
      </div>
      </div>
    </>
  );
}
