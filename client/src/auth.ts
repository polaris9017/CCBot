import NextAuth from 'next-auth';
import 'next-auth/jwt'; // Reference: https://github.com/nextauthjs/next-auth/issues/9571
import Naver from '@auth/core/providers/naver';
import { CredentialsSignin } from '@auth/core/errors';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Naver],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60,
  },
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'naver') {
        try {
          const retrievedUserInfo = await backendSignIn({
            naverUid: profile?.response?.id as string,
          });
          Object.assign(user, retrievedUserInfo);
          return !!profile?.response?.id;
        } catch (error) {
          if (error instanceof Error) return `/auth/error?error=${error.name}&code=${error.code}`;
        }
      }
      return true;
    },
    jwt({ token, user, account, profile, trigger, session }) {
      if (user) {
        Object.assign(token, { user });
      }
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.response?.id;
      }
      if (trigger === 'update') token.name = session.user.name;
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.id = token.id!;
      session.user.uid = token.user.uid as string;
      session.user.channelId = token.user.channelId;
      session.user.channelName = token.user.channelName;
      session.user.channelImageUrl = token.user.channelImageUrl;
      session.user.accessToken = token.user.accessToken;
      return session;
    },
  },
});

async function backendSignIn(body: { naverUid: string }) {
  try {
    const response = await fetch(`${process.env.BACK_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as UserResponse | string;

    if (response.ok && typeof data !== 'string') {
      return { ...data };
    }
  } catch (e) {
    const error = new CredentialsSignin();
    error.code = `ServerNotRespond`;
    throw error;
  }
}

declare module 'next-auth' {
  interface Session {
    user: Omit<UserResponse, 'refreshToken'>;
    accessToken?: string;
  }

  interface Profile {
    response?: {
      id: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: UserResponse;
    accessToken?: string;
    id?: string;
  }
}

interface UserResponse {
  uid: string;
  channelId: string;
  channelName?: string;
  channelImageUrl?: string;
  accessToken: string;
  refreshToken: string;
}
