import NextAuth, { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { Resend } from 'resend';

const prisma = new PrismaClient()

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
        async jwt({ token, user, account, profile }) {
            // No primeiro login, o user object é definido
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            // Em todas as outras chamadas, apenas o token existe. Retorne-o.
            return token;
        },
        async session({ session, token }) {
            // Adicione os campos do token (id e role) ao objeto da sessão
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role as "ADMIN" | "CLIENT";
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);