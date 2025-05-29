import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
}

export default function Avatar({ src, alt, size = 'large' }: AvatarProps) {
  const sizeClasses = {
    small: 'size-16',
    medium: 'size-24',
    large: 'size-24 sm:size-32',
  };

  return (
    <div
      className={`bg-center bg-no-repeat aspect-square bg-cover rounded-full ${sizeClasses[size]} flex-shrink-0`}
      style={{ backgroundImage: `url("${src}")` }}
      role="img"
      aria-label={alt}
    />
  );
}
