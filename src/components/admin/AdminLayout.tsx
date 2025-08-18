import Link from "next/link";
import { ReactNode } from "react";
import { signOut } from "next-auth/react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background-300">
      {/* Sidebar de Navegação */}
      <aside className="w-64 z-30 shadow-lg p-4 bg-background-800">
        <h2 className="text-xl font-bold mb-6 text-textcolor-100">Painel Admin</h2>
        <nav className="hidden md:flex text-textcolor-50">
          <ul className="list-none">
            <li className="mb-2">
              <Link href="/admin" className="block p-2 rounded hover:bg-graytone-700 text-textcolor-50">
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/menu" className="block p-2 rounded hover:bg-graytone-700 text-textcolor-50">
                Menu
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/banner" className="block p-2 rounded hover:bg-graytone-700 text-textcolor-50">
                Banner
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/homepage" className="block p-2 rounded hover:bg-graytone-700 text-textcolor-50">
                Homepage
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/testimonials" className="block p-2 rounded hover:bg-graytone-700 text-textcolor-50">
                Depoimentos
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/faq" className="block p-2 rounded hover:bg-graytone-700 text-textcolor-50">
                Perguntas Frequentes
              </Link>
            </li>
            <li className="mb-2">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full text-left p-2 rounded hover:bg-graytone-700 text-textcolor-50"
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