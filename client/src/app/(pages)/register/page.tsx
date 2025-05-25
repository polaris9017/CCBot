'use client';

import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import CenteredCardContainer from '@/components/CenteredCardContainer';

export default function Register() {
  const [prevUrl, setPrevUrl] = useState<string>('');
  useEffect(() => {
    setPrevUrl(document.referrer);
  }, []);

  return !!prevUrl && prevUrl.includes('/register/callback') ? (
    <CenteredCardContainer
      action={() => redirect('/api/auth/signout?callbackUrl=/signin')}
      message="인증이 완료되었습니다. 사용을 위해서 다시 로그인해주세요"
    >
      로그인 페이지로 이동
    </CenteredCardContainer>
  ) : (
    <CenteredCardContainer
      action={() => redirect(prevUrl !== '' ? prevUrl : '/')}
      message="잘못된 접근입니다."
    >
      이전 페이지로 이동
    </CenteredCardContainer>
  );
}
