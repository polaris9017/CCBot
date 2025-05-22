'use client';

import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useSharedState } from '@/providers/shared-state';

export default function Dashboard() {
  const { status } = useSession();
  const { menuItem } = useSharedState();

  if (status === 'unauthenticated') redirect('/signin?callbackUrl=/dashboard');

  return <div></div>;
}
