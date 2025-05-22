/* Layout from Tailwind UI (https://tailwindcss.com/plus/ui-blocks/marketing/feedback/404-pages) */

'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import ErrorPageContainer from '@/components/ErrorPageContainer';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const links: ReactNode[] = [
    <Link
      href=""
      key="retry"
      onClick={() => reset()}
      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      다시 시도하기
    </Link>,
    <a href="#" key="support" className="text-sm font-semibold text-gray-900">
      Contact support <span aria-hidden="true">&rarr;</span>
    </a>,
  ];

  return (
    <ErrorPageContainer
      title="이런!"
      message="처리 중 오류가 발생했습니다. 오류가 지속될 때에는 연락 바랍니다."
      linkList={links}
    />
  );
}
