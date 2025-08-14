import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Mostra um estado de carregamento enquanto a sessão é verificada
    if (status === "loading") {
        return <p>Carregando...</p>;
    }

    // Se o usuário não estiver logado ou não for admin, redirecione
    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
        router.push("/auth/signin");
        return <p>Acesso negado. Redirecionando para a página de login...</p>;
    }

    // Se o usuário for admin, mostre o conteúdo do painel
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Painel de Administração</h1>
            <p className="text-lg">Bem-vindo, {session.user.name}!</p>
            <p className="text-md mt-2">Este é o seu painel de controle. Aqui você pode gerenciar usuários, pedidos e outras configurações.</p>

            {/* Coloque o conteúdo do seu painel aqui */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Gerenciar Vestidos</h2>
                    <p>Adicionar, editar ou remover vestidos do catálogo.</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Ver Pedidos</h2>
                    <p>Visualize os pedidos e agendamentos dos clientes.</p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Configurações</h2>
                    <p>Ajuste as configurações gerais do site.</p>
                </div>
            </div>
        </div>
    );
}