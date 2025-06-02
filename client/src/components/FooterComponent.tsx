import React, { useMemo } from 'react';
import Link from 'next/link';

export default function FooterComponent() {
  const startYear: number = 2025;
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const copyrightSubject = 'CCBot by polaris9017';

  return (
    <footer className="sticky bottom-0 flex flex-row justify-between w-full bg-gray-200 border-t border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 text-sm">
          &copy; {startYear} {startYear === currentYear ? '' : `- ${currentYear}`}{' '}
          {copyrightSubject}. All rights reserved.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-center text-gray-600 text-sm">
          <Link href="#">개인정보처리방침</Link>
          {'  |  '}
          <Link href="#">이용약관</Link>
        </p>
      </div>
    </footer>
  );
}
