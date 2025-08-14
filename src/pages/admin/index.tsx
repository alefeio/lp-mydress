import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddDressForm from "./AddDressForm";

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Verificando acesso...</p>
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/auth/signin");
        return null;
    }

    if (session?.user?.role !== "ADMIN") {
        router.push("/403");
        return null;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Painel de Administração</h1>
            <p className="text-lg">Bem-vindo, {session.user.name}!</p>
            <div className="mt-8">
                <AddDressForm />
            </div>
        </div>
    );
}