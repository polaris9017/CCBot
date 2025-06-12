/* Layout from Tailwind UI (https://tailwindcss.com/plus/ui-blocks/marketing/feedback/404-pages) */

import Link from 'next/link';
import { ReactNode } from 'react';
import ErrorPageContainer from '@/components/ErrorPageContainer';

export default function NotFound() {
  const links: ReactNode[] = [
    <Link
      href="/"
      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      key="return-home"
    >
      홈으로 돌아가기
    </Link>,
    <a href="#" className="text-sm font-semibold text-gray-900" key="support">
      Contact support <span aria-hidden="true">&rarr;</span>
    </a>,
  ];

  return (
    <ErrorPageContainer
      title="Page not found"
      message="해당 페이지를 찾을 수 없습니다."
      linkList={links}
    />
  );
}
