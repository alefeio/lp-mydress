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
    // Removendo a estratégia "session: { strategy: 'jwt' }" porque ela é o padrão.
    // O NextAuth.js detecta que você está usando callbacks JWT e a usa.
    callbacks: {
        async jwt({ token, user }) {
            // O `user` só está disponível na primeira vez que o JWT é criado
            if (user) {
                token.id = user.id;
                // Se você tiver outras propriedades no seu modelo User, como "role", adicione-as aqui.
                // token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            // Adiciona as propriedades do token à sessão
            session.user.id = token.id as string;
            // session.user.role = token.role;
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);