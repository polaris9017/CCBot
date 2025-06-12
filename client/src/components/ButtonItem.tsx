import { useState } from 'react';
import CustomButton from '@/components/CustomButton';

export default function ButtonItem({
  label,
  buttonLabel = 'Button',
  onClick,
  variant = 'primary',
  isEnabled = true,
}: {
  label: string;
  buttonLabel?: string;
  onClick?: () => void;
  variant?: 'primary' | 'danger';
  isEnabled?: boolean;
}) {
  const [enabled, setEnabled] = useState(isEnabled);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-700">{label}</span>
      <CustomButton onClick={handleClick} variant={variant} disabled={!enabled}>
        {buttonLabel}
      </CustomButton>
    </div>
  );
}
