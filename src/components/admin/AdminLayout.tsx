import Link from "next/link";
import { ReactNode } from "react";
import { signOut } from "next-auth/react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background-50">
      {/* Sidebar de Navegação */}
      <aside className="w-64 bg-background-900 text-background-50 p-4">
        <h2 className="text-xl font-bold mb-6">Painel Admin</h2>
        <nav>
          <ul className="list-none">
            <li className="mb-2">
              <Link href="/admin" className="block p-2 rounded hover:bg-graytone-700">
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/menu" className="block p-2 rounded hover:bg-graytone-700">
                Menu
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/banner" className="block p-2 rounded hover:bg-graytone-700">
                Banner
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/homepage" className="block p-2 rounded hover:bg-graytone-700">
                Homepage
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/testimonials" className="block p-2 rounded hover:bg-graytone-700">
                Depoimentos
              </Link>
            </li>
            <li className="mb-2">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full text-left p-2 rounded hover:bg-graytone-700"
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