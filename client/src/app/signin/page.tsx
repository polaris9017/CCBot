'use client';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { signInWithNaver } from '@/serverActions/auth';

export default function Signin() {
  const { status } = useSession();
  const buttonStyle = {
    width: '15vw',
    height: 'auto',
  };

  if (status === 'authenticated') redirect('/dashboard');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md space-y-6">
        <form className="space-y-4" action={async () => signInWithNaver('/dashboard')}>
          <p className="text-gray-600 text-center">
            서비스 이용을 위해서는 네이버 로그인이 필요합니다.
          </p>
          <button type="submit" className="w-full">
            <Image
              className="mx-auto text-center"
              alt="login"
              src="/login_btnG.png"
              width={300}
              height={80}
              style={buttonStyle}
            />
          </button>
        </form>
      </div>
    </div>
  );
}
