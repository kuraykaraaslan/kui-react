'use client';
import { cn } from '@/libs/utils/cn';
import { Avatar } from '@/modules/ui/Avatar';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faMotorcycle,
  faBicycle,
  faCar,
  faPhone,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type CourierVehicle = 'bike' | 'scooter' | 'car';

type CourierCardCourier = {
  name: string;
  avatarUrl?: string | null;
  rating?: number;
  reviewCount?: number;
  vehicle: CourierVehicle;
  vehicleLabel?: string;
  online?: boolean;
};

type CourierCardProps = {
  courier: CourierCardCourier;
  onCall?: () => void;
  onMessage?: () => void;
  className?: string;
};

const VEHICLE_ICON: Record<CourierVehicle, IconDefinition> = {
  bike: faBicycle,
  scooter: faMotorcycle,
  car: faCar,
};

const VEHICLE_DEFAULT_LABEL: Record<CourierVehicle, string> = {
  bike: 'Bicycle',
  scooter: 'Scooter',
  car: 'Car',
};

export function CourierCard({ courier, onCall, onMessage, className }: CourierCardProps) {
  return (
    <section
      className={cn(
        'rounded-xl border border-border bg-surface-raised p-4 shadow-sm',
        className,
      )}
      aria-label={`Courier ${courier.name}`}
    >
      <div className="flex items-center gap-3">
        <Avatar
          src={courier.avatarUrl}
          name={courier.name}
          size="lg"
          status={courier.online ? 'online' : 'offline'}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-primary">{courier.name}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-secondary">
            <span className="inline-flex items-center gap-1">
              <FontAwesomeIcon icon={VEHICLE_ICON[courier.vehicle]} className="w-3 h-3" aria-hidden="true" />
              {courier.vehicleLabel ?? VEHICLE_DEFAULT_LABEL[courier.vehicle]}
            </span>
            {courier.rating !== undefined && (
              <span className="inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-warning" aria-hidden="true" />
                <span className="font-medium text-text-primary tabular-nums">
                  {courier.rating.toFixed(1)}
                </span>
                {courier.reviewCount !== undefined && (
                  <span>({courier.reviewCount.toLocaleString()})</span>
                )}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {onMessage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              iconOnly
              onClick={onMessage}
              aria-label={`Message ${courier.name}`}
            >
              <FontAwesomeIcon icon={faMessage} className="w-3.5 h-3.5" aria-hidden="true" />
            </Button>
          )}
          {onCall && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              iconOnly
              onClick={onCall}
              aria-label={`Call ${courier.name}`}
            >
              <FontAwesomeIcon icon={faPhone} className="w-3.5 h-3.5" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
