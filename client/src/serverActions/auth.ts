'use server';
import { auth, signIn } from '@/auth';

export const signInWithNaver = async (redirectUri = '/') => {
  await signIn('naver', {
    redirectTo: redirectUri,
  });
};

export { auth as getSession };
