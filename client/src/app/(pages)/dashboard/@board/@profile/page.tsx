'use client';

import axios from 'axios';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProfileHeader from './ProfileHeader';
import MenuHeaderItem from '@/components/MenuHeader';
import CardComponent from '@/components/CardComponent';
import ButtonItem from '@/components/ButtonItem';

interface User {
  username: string;
  nickname: string;
  avatarUrl: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { channelId, channelName, channelImageUrl } = session?.user || {};
  const [isLoading, setIsLoading] = useState(false);

  const userData: User = {
    username: channelId ?? 'default_username',
    nickname: channelName ?? 'default_nickname',
    avatarUrl: !!channelImageUrl
      ? channelImageUrl
      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL7CQZcfRHIc9EYG4PW_oNIHrFd-8GfRNSI6Im3ubRd7W30UE7Ev5uYhtquJONuZbFfwwlvgfRPFy_jol0Drkj4nCuNY3zmEkb9Er6mBaU6bbOGUg7ZqT233cPeu_w3cZoyIwsnmrMk4cXhMwKnxRixnM1uXYnySHlyLFSIA0q2fwjpH2BKwXLOi5-zLletwnnnaTJKNwYCeMrmQrTPBdYfufdOMQ-qN9DmazfLLwF3Fp-HAMMuGTSI_1AlCfpQTJECRk1u2fsYXy4',
  };

  const handleWithdrawMembership = async () => {
    const confirmWithdraw = confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');

    if (!confirmWithdraw) return;

    try {
      setIsLoading(true);

      const response = await axios.delete(`/api/user`, {
        headers: {
          Authorization: `Bearer ${session?.user.accessToken}`, // 세션에서 토큰 가져오기
        },
      });

      if (response.status === 200) {
        alert('회원 탈퇴가 완료되었습니다.');

        // 로그아웃 처리 및 홈으로 리다이렉트
        router.push('/api/auth/signout?callbackUrl=/');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || '회원 탈퇴에 실패했습니다.';
        alert(errorMessage);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen p-4 flex-col group/design-root overflow-x-hidden bg-slate-50">
      <MenuHeaderItem title="프로필 관리" />
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col max-w-3xl flex-1 bg-white shadow-xl rounded-xl overflow-hidden">
            <ProfileHeader user={userData} />
            <CardComponent title="회원 관리">
              <ButtonItem
                label="회원 탈퇴"
                buttonLabel={isLoading ? '처리 중...' : '회원 탈퇴'}
                onClick={handleWithdrawMembership}
                variant="danger"
                isEnabled={!isLoading}
              />
            </CardComponent>
          </div>
        </div>
      </div>
    </div>
  );
}
