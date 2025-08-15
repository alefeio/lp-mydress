import Link from "next/link";
import { ReactNode } from "react";
import { signOut } from "next-auth/react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
            <li className="mb-2">
              <Link href="/admin/banner">
                <p className="block p-2 rounded hover:bg-gray-700">Banner</p>
              </Link>
            </li>
            <li className="mb-2">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full text-left p-2 rounded hover:bg-gray-700"
              >
                Sair
              </button>
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