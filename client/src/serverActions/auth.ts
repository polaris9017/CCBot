'use server';
import { auth, signIn } from '@/auth';

export const signInWithNaver = async (redirectUri = '/') => {
  await signIn(
    'naver',
    {
      redirectTo: redirectUri,
    },
    { state: process.env.STATE_KEY || '' }
  );
};

export { auth as getSession };
