import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((request) => {
  if (!request.auth) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(
      new URL(`/api/auth/signin?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/api/((?!auth/signin|auth/signout|auth/session|auth/callback/naver).*)'],
};
