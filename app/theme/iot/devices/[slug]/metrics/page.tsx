import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { MetricSparklineCard } from '@/modules/domains/iot/telemetry/MetricSparklineCard';
import { TelemetryTimeSeriesChart } from '@/modules/domains/iot/telemetry/TelemetryTimeSeriesChart';
import { LogStreamRow } from '@/modules/domains/iot/telemetry/LogStreamRow';
import { DEVICES, DEVICE_METRICS } from '../../../iot.data';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';

export function generateStaticParams() {
  return Object.keys(DEVICE_METRICS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const device = DEVICES.find((d) => d.slug === slug);
  const base = device?.name ?? slug;
  return { title: buildPageTitle(`${base} — Metrics`, THEME_TITLES.iot) };
}

export default async function DeviceMetricsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const device = DEVICES.find((d) => d.slug === slug);
  const metrics = DEVICE_METRICS[slug];

  if (!device || !metrics) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <a
        href={`/theme/iot/devices/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back to device
      </a>

      <header className="mb-6">
        <p className="text-xs uppercase tracking-wide text-text-secondary font-medium">Telemetry</p>
        <h1 className="text-2xl font-bold text-text-primary">{device.name}</h1>
        <p className="mt-0.5 text-sm text-text-secondary">
          Live metrics, time series, and logs · sampled every 5 min
        </p>
      </header>

      {/* KPI sparklines */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricSparklineCard
          label="CPU"
          value={metrics.currentValues.cpuPct}
          unit="%"
          series={metrics.sparklines.cpu}
          deltaPct={5.2}
          goodWhen="down"
        />
        <MetricSparklineCard
          label="Memory"
          value={metrics.currentValues.memoryPct}
          unit="%"
          series={metrics.sparklines.memory}
          deltaPct={1.8}
          goodWhen="down"
        />
        <MetricSparklineCard
          label="Network"
          value={metrics.currentValues.networkKbps}
          unit="kb/s"
          series={metrics.sparklines.network}
          deltaPct={-3.1}
          goodWhen="up"
        />
        <MetricSparklineCard
          label="Temperature"
          value={metrics.currentValues.temperatureC}
          unit="°C"
          series={metrics.temperature}
          deltaPct={4.4}
          goodWhen="down"
        />
      </div>

      {/* Time-series chart */}
      <div className="mb-6">
        <TelemetryTimeSeriesChart
          title="Vibration, temperature, RPM"
          subtitle="Last 35 minutes · 5-minute resolution"
          labels={metrics.labels}
          yUnit="mixed"
          series={[
            { label: 'Vibration (G)',  color: 'rgba(239, 68, 68, 1)',  data: metrics.vibration },
            { label: 'Temperature (°C × 0.1)', color: 'rgba(245, 158, 11, 1)', data: metrics.temperature.map((t) => t * 0.1) },
            { label: 'RPM (× 0.01)',   color: 'rgba(59, 130, 246, 1)', data: metrics.rpm.map((r) => r * 0.01) },
          ]}
        />
      </div>

      {/* Log stream */}
      <section
        aria-label="Device logs"
        className="rounded-xl border border-border bg-surface-base shadow-sm overflow-hidden"
      >
        <header className="flex items-baseline justify-between gap-2 bg-surface-overlay px-4 py-2">
          <h2 className="text-sm font-semibold text-text-primary">Log stream</h2>
          <span className="text-xs text-text-secondary">Last {metrics.logs.length} entries</span>
        </header>
        <ol>
          {metrics.logs.map((log, i) => (
            <LogStreamRow
              key={i}
              timestamp={log.timestamp}
              level={log.level}
              source={log.source}
              message={log.message}
            />
          ))}
        </ol>
      </section>
    </div>
  );
}
