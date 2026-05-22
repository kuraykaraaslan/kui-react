import type { Metadata } from 'next';
import { buildPageTitle, THEME_TITLES } from '@/libs/config/showcase.config';
import { BookingStatusBadge } from '@/modules/domains/travel/booking/BookingStatusBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faPlane, faHotel } from '@fortawesome/free-solid-svg-icons';
import { SAMPLE_BOOKINGS } from '../travel.data';

export const metadata: Metadata = {
  title: buildPageTitle('Bookings', THEME_TITLES['travel']),
};

export default function BookingsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <FontAwesomeIcon icon={faTicket} className="w-5 h-5 text-primary" aria-hidden="true" />
          My Bookings
        </h1>
        <p className="mt-1 text-text-secondary text-sm">Manage your upcoming and past travel</p>
      </div>

      {/* Bookings table */}
      <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-overlay">
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Booking</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide hidden sm:table-cell">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Details</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide hidden md:table-cell">Traveler</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide hidden lg:table-cell">Dates</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text-secondary uppercase tracking-wide hidden md:table-cell">Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {SAMPLE_BOOKINGS.map((booking) => (
              <tr key={booking.bookingId} className="hover:bg-surface-overlay transition-colors">
                <td className="px-4 py-4">
                  <span className="font-mono text-xs text-text-secondary">{booking.bookingNumber}</span>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <FontAwesomeIcon
                      icon={booking.type === 'flight' ? faPlane : faHotel}
                      className="w-3.5 h-3.5"
                      aria-hidden="true"
                    />
                    <span className="text-xs capitalize">{booking.type}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-text-primary font-medium line-clamp-1">{booking.description}</p>
                </td>
                <td className="px-4 py-4 text-text-secondary hidden md:table-cell">{booking.traveler}</td>
                <td className="px-4 py-4 text-text-secondary text-xs hidden lg:table-cell">{booking.dates}</td>
                <td className="px-4 py-4 text-right font-medium text-text-primary hidden md:table-cell">{booking.total}</td>
                <td className="px-4 py-4">
                  <BookingStatusBadge status={booking.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state hint */}
      <p className="text-xs text-text-secondary mt-4 text-center">
        Showing {SAMPLE_BOOKINGS.length} booking{SAMPLE_BOOKINGS.length !== 1 ? 's' : ''}. Book a flight or hotel to see more.
      </p>
    </div>
  );
}
