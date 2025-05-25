'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function RegisterCallback() {
  const { data } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const uid = data?.user?.uid ?? '';

  useEffect(() => {
    const code = params.get('code');
    if (!code) return setError('Callback: missing code');

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/register?code=${code}&state=${uid}`);
        if (response.ok) router.push('/register');
      } catch (e) {
        if (e instanceof Error) return setError(e.message);
      }
    };

    fetchData();
  }, [params, router]);
}
