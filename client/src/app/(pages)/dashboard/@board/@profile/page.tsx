'use client';

import ProfileHeader from './ProfileHeader';
import MenuHeaderItem from '@/components/MenuHeader';
import CardComponent from '@/components/CardComponent';
import CustomButton from '@/components/CustomButton';
import ButtonItem from '@/components/ButtonItem';

interface User {
  username: string;
  nickname: string;
  avatarUrl: string;
}

export default function ProfilePage() {
  const userData: User = {
    // Sample user data
    username: 'sophia.clark',
    nickname: 'sophia',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBL7CQZcfRHIc9EYG4PW_oNIHrFd-8GfRNSI6Im3ubRd7W30UE7Ev5uYhtquJONuZbFfwwlvgfRPFy_jol0Drkj4nCuNY3zmEkb9Er6mBaU6bbOGUg7ZqT233cPeu_w3cZoyIwsnmrMk4cXhMwKnxRixnM1uXYnySHlyLFSIA0q2fwjpH2BKwXLOi5-zLletwnnnaTJKNwYCeMrmQrTPBdYfufdOMQ-qN9DmazfLLwF3Fp-HAMMuGTSI_1AlCfpQTJECRk1u2fsYXy4',
  };

  const handleUpdateProfile = () => {
    console.log('Profile update requested');
    // 프로필 업데이트 로직 구현
  };

  const handleWithdrawMembership = () => {
    console.log('Membership withdrawal requested');
    // 회원 탈퇴 로직 구현
  };

  return (
    <div className="relative flex size-full min-h-screen p-4 flex-col group/design-root overflow-x-hidden bg-slate-50">
      <MenuHeaderItem title="프로필 관리" />
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col max-w-3xl flex-1 bg-white shadow-xl rounded-xl overflow-hidden">
            <ProfileHeader user={userData} onUpdateProfile={handleUpdateProfile} />
            <CardComponent title="회원 관리">
              <ButtonItem
                label="회원 탈퇴"
                buttonLabel="회원 탈퇴"
                onClick={handleWithdrawMembership}
                variant="danger"
              />
            </CardComponent>
          </div>
        </div>
      </div>
    </div>
  );
}
