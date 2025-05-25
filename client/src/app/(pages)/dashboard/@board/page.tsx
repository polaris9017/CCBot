'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import CenteredCardContainer from '@/components/CenteredCardContainer';

function Board() {
  const { data } = useSession();
  const channelId = data?.user!.channelId;

  const handleClick = () => {
    window.location.href = `https://chzzk.naver.com/account-interlock?clientId=${process.env.NEXT_PUBLIC_CHZZK_CLIENT_ID}&redirectUri=${process.env.NEXT_PUBLIC_CLIENT_URL}/register/callback&state=${data!.user!.uid}`;
  };

  const apiRegisterMessage = (
    <CenteredCardContainer
      action={handleClick}
      message="처음 오셨네요. 먼저 API 사용 동의를 해주세요"
      buttonStyle="rounded bg-sky-600 px-4 py-2 text-sm text-white data-hover:bg-sky-500 data-hover:data-active:bg-sky-700"
    >
      API 사용 동의
    </CenteredCardContainer>
  );

  return <>{channelId ? channelId : apiRegisterMessage}</>;
}

export default Board;
