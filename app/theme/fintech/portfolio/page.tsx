import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { AssetAllocationCard } from '@/modules/domains/fintech/portfolio/AssetAllocationCard';
import { PortfolioHoldingRow } from '@/modules/domains/fintech/portfolio/PortfolioHoldingRow';
import { PerformanceSparkline } from '@/modules/domains/fintech/portfolio/PerformanceSparkline';
import {
  PORTFOLIO_ALLOCATION,
  PORTFOLIO_HOLDINGS,
  PORTFOLIO_PERFORMANCE_SERIES,
} from '../fintech.data';

export default function PortfolioPage() {
  const totalUsd = PORTFOLIO_HOLDINGS.reduce((s, h) => s + h.usdValue, 0);
  const totalCost = PORTFOLIO_HOLDINGS.reduce((s, h) => s + h.costBasis, 0);
  const totalChangeAbs = totalUsd - totalCost;
  const totalChangePct = (totalChangeAbs / totalCost) * 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <a
        href="/theme/fintech"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back to summary
      </a>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wide font-medium text-text-secondary">Portfolio</p>
        <h1 className="text-2xl font-bold text-text-primary">Holdings & performance</h1>
        <p className="mt-0.5 text-sm text-text-secondary">
          Allocation across currencies and digital assets · USD-equivalent values.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {/* Performance card */}
          <section className="rounded-xl border border-border bg-surface-raised p-5 shadow-sm">
            <header className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-text-primary inline-flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
                Last 10 days
              </h2>
              <span className="text-xs text-text-secondary">USD equivalent</span>
            </header>
            <PerformanceSparkline series={PORTFOLIO_PERFORMANCE_SERIES} />
          </section>

          {/* Holdings table */}
          <section
            aria-label="Portfolio holdings"
            className="rounded-xl border border-border bg-surface-raised p-4 shadow-sm space-y-2"
          >
            <header className="flex items-baseline justify-between px-1">
              <h2 className="text-sm font-semibold text-text-primary">Holdings</h2>
              <span className="text-xs text-text-secondary">{PORTFOLIO_HOLDINGS.length} positions</span>
            </header>
            {PORTFOLIO_HOLDINGS.map((h) => (
              <PortfolioHoldingRow
                key={h.symbol}
                symbol={h.symbol}
                name={h.name}
                amount={h.amount}
                currency={h.currency}
                usdValue={h.usdValue}
                costBasis={h.costBasis}
                dayChangePct={h.dayChangePct}
              />
            ))}
          </section>
        </div>

        <aside>
          <AssetAllocationCard
            assets={PORTFOLIO_ALLOCATION}
            totalUsd={totalUsd}
            changePct={totalChangePct}
            changeAbsUsd={totalChangeAbs}
          />
        </aside>
      </div>
    </div>
  );
}
