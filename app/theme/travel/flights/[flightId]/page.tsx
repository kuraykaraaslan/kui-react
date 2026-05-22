import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FLIGHTS } from '../../travel.data';
import { FlightBookingFlow } from '../../FlightBookingFlow';

export function generateStaticParams() {
  return FLIGHTS.map((f) => ({ flightId: f.flightId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ flightId: string }>;
}): Promise<Metadata> {
  const { flightId } = await params;
  const flight = FLIGHTS.find((f) => f.flightId === flightId);
  const label = flight ? `Flight ${flight.flightId}` : flightId;
  return { title: buildPageTitle(label, THEME_TITLES['travel']) };
}

export default async function FlightDetailPage({ params }: { params: Promise<{ flightId: string }> }) {
  const { flightId } = await params;
  const flight = FLIGHTS.find((f) => f.flightId === flightId);
  if (!flight) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <a
        href="/theme/travel/flights"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="w-3 h-3" aria-hidden="true" />
        Back to flights
      </a>

      <FlightBookingFlow flight={flight} />
    </div>
  );
}
