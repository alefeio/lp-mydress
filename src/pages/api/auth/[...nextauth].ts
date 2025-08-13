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
    // <--- ADICIONE ESTA LINHA DE VOLTA
    session: {
        strategy: "jwt",
    },
    // <--- FIM DA ALTERAÇÃO

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
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