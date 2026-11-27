import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';
import type { Role } from '@/generated/prisma/client';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
    // The adapter is typed against @prisma/client's PrismaClient export, which
    // Prisma 7's generator no longer fills in. It only uses the user, account
    // and session model delegates, which are unchanged.
    adapter: PrismaAdapter(prisma as unknown as Parameters<typeof PrismaAdapter>[0]),
    pages: {
        signIn: '/login'
    },
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        // Expose the database user id and role: API routes look the user up by id,
        // and the UI uses the role to decide which controls to show
        session({ session, user }) {
            session.user.id = user.id;
            session.user.role = (user as AdapterUser & { role: Role }).role;
            return session;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };