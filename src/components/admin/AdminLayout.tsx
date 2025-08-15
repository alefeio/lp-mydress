import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
    router.push("/api/auth/signin");
    return null;
  }

  if (session?.user?.role !== "ADMIN") {
    router.push("/403"); // Página de acesso negado
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar de Navegação */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Painel Admin</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/admin">
                <p className="block p-2 rounded hover:bg-gray-700">Dashboard</p>
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/menu">
                <p className="block p-2 rounded hover:bg-gray-700">Menu</p>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}