'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaypal,
  faApple,
  faGoogle,
  faBitcoin,
} from '@fortawesome/free-brands-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/libs/utils/cn';
import { RadioGroup, RadioOption } from '@/modules/ui/RadioGroup';
import type { PaymentMethod } from '../PaymentTypes';

const paymentOptions: RadioOption[] = [
  { value: 'CREDIT_CARD', label: 'Credit Card', icon: <FontAwesomeIcon icon={faCreditCard} className="h-4 w-4 text-blue-600" /> },
  { value: 'PAYPAL', label: 'PayPal', icon: <FontAwesomeIcon icon={faPaypal} className="h-4 w-4 text-blue-500" /> },
  { value: 'APPLE_PAY', label: 'Apple Pay', icon: <FontAwesomeIcon icon={faApple} className="h-4 w-4 text-gray-900" /> },
  { value: 'GOOGLE_PAY', label: 'Google Pay', icon: <FontAwesomeIcon icon={faGoogle} className="h-4 w-4 text-blue-600" /> },
  { value: 'CRYPTO', label: 'Cryptocurrency', icon: <FontAwesomeIcon icon={faBitcoin} className="h-4 w-4 text-orange-500" /> },
];

type PaymentMethodSelectorProps = {
  value?: PaymentMethod;
  onChange?: (method: PaymentMethod) => void;
  disabled?: boolean;
  className?: string;
};

export function PaymentMethodSelector({
  value,
  onChange,
  disabled = false,
  className,
}: PaymentMethodSelectorProps) {
  const [selected, setSelected] = useState<PaymentMethod>("CREDIT_CARD");

  return (
    <div className={cn('w-full', className)}>
      <RadioGroup
        name="payment-method"
        legend="Payment method"
        options={paymentOptions}
        value={selected}
        variant='card'
        columns={2}
        onChange={(val) => {
          setSelected(val as PaymentMethod);
          onChange?.(val as PaymentMethod);
        }}
        disabled={disabled}
      />
    </div>
  );
}
