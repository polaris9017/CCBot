import React, { ReactNode } from 'react';
import { Button } from '@headlessui/react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'danger';
  className?: string;
  disabled?: boolean;
}

export default function CustomButton({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}: ButtonProps) {
  const baseClasses =
    'min-w-[120px] cursor-pointer items-center justify-center overflow-hidden text-white text-sm font-medium shadow-md focus-visible:ring-2 focus-visible:ring-offset-2';

  const variantClasses = {
    primary:
      'flex max-w-xs rounded-md h-10 px-5 bg-sky-600 leading-normal data-hover:bg-sky-500 focus-visible:ring-blue-500 transition-colors mt-4',
    danger:
      'py-2 px-4 bg-red-500 font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:bg-red-500 focus-visible:ring-red-500 focus-visible:ring-opacity-75',
  };

  const isDisabled = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <Button
      className={`${baseClasses} ${variantClasses[variant]} ${isDisabled} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="truncate">{children}</span>
    </Button>
  );
}
