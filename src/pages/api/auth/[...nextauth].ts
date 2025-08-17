// src/pages/api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        EmailProvider({
            from: process.env.EMAIL_FROM,
            async sendVerificationRequest({ identifier: email, url, provider: { from } }) {
                await resend.emails.send({
                    from: from || "onboarding@resend.dev",
                    to: email,
                    subject: "Link de login para o My Dress Belém",
                    html: `Clique neste link para entrar: <a href="${url}">${url}</a>`,
                });
            },
        }),
    ],
    pages: {
        signIn: '/auth/signin',
        verifyRequest: '/auth/verify-request',
    },
    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user, account }) {
            // Se o usuário existir (no login ou atualização), adiciona o role e o ID ao token
            if (user) {
                const userFromDb = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { role: true },
                });
                token.id = user.id;
                (token as any).role = userFromDb?.role;
            }

            // Se a conta existir, adiciona o accessToken ao token
            if (account) {
                (token as any).accessToken = account.access_token;
            }

            return token;
        },
        async session({ session, token }) {
            // Adiciona as propriedades do token à sessão do usuário
            if (session.user) {
                (session.user as any).id = (token as any).id as string;
                (session.user as any).role = (token as any).role as "ADMIN" | "USER" | undefined;
                (session as any).accessToken = (token as any).accessToken;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);