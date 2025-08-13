// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            // Adicione o campo 'role' aqui
            role?: "ADMIN" | "CLIENT";
        };
    }
}