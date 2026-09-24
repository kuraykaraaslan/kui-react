'use client';
import { useState, useMemo } from 'react';
import { cn } from '@/libs/utils/cn';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faPercent, faCalendar } from '@fortawesome/free-solid-svg-icons';

type MortgageCalculatorProps = {
  defaultPrice?: number;
  currency?: string;
  className?: string;
};

function formatCurrency(amount: number, currency: string): string {
  if (currency === 'TRY') {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(amount);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function MortgageCalculator({ defaultPrice = 1_000_000, currency = 'TRY', className }: MortgageCalculatorProps) {
  const [price, setPrice] = useState(defaultPrice);
  const [downPct, setDownPct] = useState(20);
  const [rateStr, setRateStr] = useState('3.5');
  const [years, setYears] = useState(20);

  const { monthly, interest, loanAmount } = useMemo(() => {
    const rate = parseFloat(rateStr) || 0;
    const loan = price * (1 - downPct / 100);
    if (loan <= 0 || rate <= 0) return { monthly: 0, total: 0, interest: 0, loanAmount: loan };
    const r = rate / 100 / 12;
    const n = years * 12;
    const m = loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const t = m * n;
    return { monthly: m, total: t, interest: t - loan, loanAmount: loan };
  }, [price, downPct, rateStr, years]);

  const downAmount = price * (downPct / 100);

  return (
    <div className={cn('rounded-2xl border border-border bg-surface-raised p-5 space-y-5', className)}>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-subtle text-primary shrink-0">
          <FontAwesomeIcon icon={faCalculator} className="w-4 h-4" aria-hidden="true" />
        </span>
        <h3 className="text-sm font-semibold text-text-primary">Mortgage Calculator</h3>
      </div>

      <div className="space-y-4">
        {/* Property Price */}
        <div>
          <label className="text-xs font-medium text-text-secondary mb-1 block">
            Property Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
            step={50000}
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus transition"
            aria-label="Property price"
          />
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-medium text-text-secondary">Down Payment</label>
            <span className="text-xs text-primary font-semibold">{downPct}% — {formatCurrency(downAmount, currency)}</span>
          </div>
          <input
            type="range"
            min={5}
            max={80}
            step={5}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="w-full accent-primary h-1.5 rounded-full"
            aria-label="Down payment percentage"
          />
          <div className="flex justify-between text-xs text-text-disabled mt-0.5">
            <span>5%</span><span>80%</span>
          </div>
        </div>

        {/* Rate + Term */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">
              Interest Rate
            </label>
            <div className="relative">
              <input
                type="number"
                value={rateStr}
                onChange={(e) => setRateStr(e.target.value)}
                min={0}
                step={0.1}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus transition"
                aria-label="Interest rate"
              />
              <FontAwesomeIcon icon={faPercent} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-disabled" aria-hidden="true" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary mb-1 block">
              Loan Term
            </label>
            <div className="relative">
              <select
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full pl-3 pr-8 py-2 rounded-lg border border-border bg-surface-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus transition appearance-none"
                aria-label="Loan term in years"
              >
                {[5, 10, 15, 20, 25, 30].map((y) => (
                  <option key={y} value={y}>{y} yrs</option>
                ))}
              </select>
              <FontAwesomeIcon icon={faCalendar} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-disabled pointer-events-none" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="rounded-xl border border-primary/20 bg-primary-subtle p-4 space-y-3">
        <div className="text-center">
          <p className="text-xs text-text-secondary">Estimated Monthly Payment</p>
          <p className="text-2xl font-bold text-primary mt-0.5">{formatCurrency(monthly, currency)}</p>
          <p className="text-xs text-text-secondary">/ month</p>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/20">
          <div className="text-center">
            <p className="text-xs text-text-secondary">Loan Amount</p>
            <p className="text-sm font-semibold text-text-primary">{formatCurrency(loanAmount, currency)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-secondary">Total Interest</p>
            <p className="text-sm font-semibold text-text-primary">{formatCurrency(interest, currency)}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-text-disabled text-center leading-relaxed">
        This is an estimate only. Contact an agent for accurate financing options.
      </p>
    </div>
  );
}
