import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AddDressForm from "../../components/admin/AddDressForm";

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // 1. Mostra um estado de carregamento enquanto a sessão é verificada
    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Verificando acesso...</p>
            </div>
        );
    }

    // 2. Se o usuário não estiver logado, redirecione-o
    if (status === "unauthenticated") {
        router.push("/auth/signin");
        return null; // Retorna null para evitar que a página seja renderizada
    }

    // 3. Se o usuário estiver logado, mas não for admin, redirecione-o para uma página de erro
    if (session?.user?.role !== "ADMIN") {
        router.push("/403"); // Redireciona para uma página de "Acesso Negado"
        return null;
    }

    // 4. Se o usuário for admin, mostre o conteúdo do painel
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Painel de Administração</h1>
            <p className="text-lg">Bem-vindo, {session.user.name}!</p>
            <div className="mt-8">
                <AddDressForm />
            </div>
            {/* ... o restante do seu painel */}
        </div>
    );
}