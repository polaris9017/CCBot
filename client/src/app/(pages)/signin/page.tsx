'use client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import { signInWithNaver } from '@/serverActions/auth';
import CenteredCardContainer from '@/components/CenteredCardContainer';

export default function Signin() {
  const { status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const buttonStyle = {
    width: '15vw',
    height: 'auto',
  };

  const loginButton = (
    <Image
      className="mx-auto text-center"
      alt="login"
      src="/login_btnG.png"
      width={300}
      height={80}
      style={buttonStyle}
    />
  );

  if (status === 'authenticated') redirect(callbackUrl);

  return (
    <CenteredCardContainer
      action={async () => signInWithNaver(callbackUrl)}
      message="서비스 이용을 위해서는 네이버 로그인이 필요합니다."
      button={loginButton}
    />
  );
}
