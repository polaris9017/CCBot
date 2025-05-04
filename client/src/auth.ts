import NextAuth from 'next-auth';
import Naver from "@auth/core/providers/naver";

export const {
    handlers,
    signIn,
    signOut,
    auth,
} = NextAuth({
    providers: [Naver],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        jwt({token, account, profile, trigger, session}) {
            if (account) {
                token.accessToken = account.access_token;
                token.id = profile?.response?.id;
            }
            if (trigger === 'update') token.name = session.user.name;
            return token;
        },
        async session({session, token}) {
            session.accessToken = token.accessToken;
            session.user.id = token.id!;
            return session;
        }
    }
});

declare module 'next-auth' {
    interface Session {
        user?: {
            id: string;
        }
        accessToken?: string;
    }

    interface Profile {
        response?: {
            id: string;
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        accessToken?: string;
    }
}
