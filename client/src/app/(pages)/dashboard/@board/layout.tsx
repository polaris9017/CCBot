'use client';

import { useSession } from 'next-auth/react';
import { useSharedState } from '@/providers/shared-state';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default function BoardLayout({
  commands,
  settings,
  overlay,
  profile,
}: {
  commands: ReactNode;
  settings: ReactNode;
  overlay: ReactNode;
  profile: ReactNode;
}) {
  const { status } = useSession();
  const { menuItem } = useSharedState();

  if (status === 'unauthenticated') redirect('/signin?callbackUrl=/dashboard');

  return (
    <>
      {menuItem === '' && 'default'}
      {menuItem === 'commands' && commands}
      {menuItem === 'settings' && settings}
      {menuItem === 'overlay' && overlay}
      {menuItem === 'profile' && profile}
    </>
  );
}
