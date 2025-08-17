// src/types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// CORREÇÃO: O tipo 'USER' do seu schema do Prisma
// deve ser o único tipo aqui, além de 'ADMIN'.
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: "ADMIN" | "USER" | null; 
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: "ADMIN" | "USER" | null; 
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: "ADMIN" | "USER" | null; 
  }
}