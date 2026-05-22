'use client';
import { use } from 'react';
import { notFound } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { AlertDetailHeader } from '@/modules/domains/iot/alert/AlertDetailHeader';
import { AlertEventTimeline } from '@/modules/domains/iot/alert/AlertEventTimeline';
import { ALERTS, ALERT_EVENTS, DEVICES } from '../../iot.data';
import { DocumentTitle } from '@/libs/utils/DocumentTitle';

export default function AlertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const alert = ALERTS.find((a) => a.alertId === id);
  const events = ALERT_EVENTS[id];

  if (!alert || !events) notFound();

  const device = DEVICES.find((d) => d.deviceId === alert.deviceId);

  return (
    <>
      <DocumentTitle text="Alert Detail — IoT Theme" />
      <div className="mx-auto max-w-5xl px-4 py-6">
      <a
        href="/theme/iot/alerts"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" aria-hidden="true" />
        Back to alerts
      </a>

      <div className="space-y-5">
        <AlertDetailHeader
          title={alert.title}
          message={alert.message}
          severity={alert.severity}
          status={alert.status}
          deviceName={alert.deviceName}
          deviceHref={device ? `/theme/iot/devices/${device.slug}` : undefined}
          openedAt={alert.createdAt ?? new Date()}
          onAcknowledge={() => undefined}
          onResolve={() => undefined}
          onOpenRunbook={() => undefined}
        />

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <AlertEventTimeline events={events} />

          <aside className="space-y-4">
            <section className="rounded-xl border border-border bg-surface-raised p-4 shadow-sm">
              <header className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                <FontAwesomeIcon icon={faBookOpen} className="w-3.5 h-3.5 text-text-secondary" aria-hidden="true" />
                Runbook
              </header>
              <ol className="list-decimal pl-4 text-sm text-text-secondary space-y-1.5">
                <li>Confirm device is reachable via MQTT broker.</li>
                <li>Verify physical state at the named location.</li>
                <li>If sensor is faulty, swap with calibrated spare.</li>
                <li>Acknowledge alert + add a note explaining the root cause.</li>
                <li>Resolve when monitored value is stable for 15 minutes.</li>
              </ol>
            </section>

            <section className="rounded-xl border border-border bg-surface-raised p-4 shadow-sm">
              <header className="mb-2 text-sm font-semibold text-text-primary">Related</header>
              <ul className="space-y-1.5 text-sm">
                {device && (
                  <li>
                    <a
                      href={`/theme/iot/devices/${device.slug}`}
                      className="text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
                    >
                      Device — {device.name}
                    </a>
                  </li>
                )}
                {device && (
                  <li>
                    <a
                      href={`/theme/iot/devices/${device.slug}/metrics`}
                      className="text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus rounded"
                    >
                      Device metrics & logs
                    </a>
                  </li>
                )}
              </ul>
            </section>
          </aside>
        </div>
      </div>
      </div>
    </>
  );
}
