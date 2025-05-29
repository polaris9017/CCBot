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
  children,
}: {
  commands: ReactNode;
  settings: ReactNode;
  overlay: ReactNode;
  profile: ReactNode;
  children: ReactNode;
}) {
  const { status } = useSession();
  const { menuItem } = useSharedState();

  if (status === 'unauthenticated') redirect('/signin?callbackUrl=/dashboard');

  return (
    <>
      {menuItem === '' && children}
      {menuItem === 'commands' && commands}
      {menuItem === 'settings' && settings}
      {menuItem === 'overlay' && overlay}
      {menuItem === 'profile' && profile}
    </>
    /*<div className="min-h-screen flex items-center justify-center w-full">

    </div>*/
  );
}
