import { useSession, signOut } from "next-auth/react"; // Importe useSession e signOut
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const menuLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Nossa coleção", href: "#colecao" },
  { label: "Sobre nós", href: "#empresa" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Perguntas Frequentes", href: "#faq" },
  { label: "Onde Estamos", href: "#localizacao" },
  {
    label: "Contato",
    href: "https://wa.me//5591985810208?text=Gostaria de mais informações. Estou entrando em contato através do site.",
    target: "_blank",
  },
];

export function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession(); // Use o hook useSession para obter a sessão
    
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 shadow-lg ${isScrolled
          ? "bg-background-100/50 backdrop-blur-sm pt-2 pb-1"
          : "bg-background-100 pt-4 pb-2"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <a href="#inicio" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Logomarca My Dress"
            className={`transition-all duration-300 ${isScrolled ? "w-14 md:w-20" : "w-16 md:w-24"
              }`}
          />
        </a>

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-8 font-semibold font-serif text-lg">
          {menuLinks.map(({ label, href, target = "" }) => (
            <a
              key={href}
              href={href}
              className="hover:text-textcolor-400 transition-colors"
              onClick={() => setMenuOpen(false)}
              target={target}
            >
              {label}
            </a>
          ))}
          {session ? (
            <div className="text-center p-4 bg-green-100">
              <p>Logado como: {session.user?.email}</p>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Sair
              </button>
            </div>
          ) : (
            <a
              href="#"
              className="hover:text-textcolor-400 transition-colors"
              onClick={handleSignIn}
            >
              Entrar
            </a>
          )}
        </nav>

        {/* Botão hamburger mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`block h-0.5 w-6 bg-textcolor-700 transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
          />
          <span
            className={`block h-0.5 w-6 bg-textcolor-700 transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"
              }`}
          />
          <span
            className={`block h-0.5 w-6 bg-textcolor-700 transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
          />
        </button>
      </div>

      {/* Menu móvel */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden py-4 flex flex-col gap-4 font-semibold bg-background-100/95 px-4"
        >
          {menuLinks.map(({ label, href, target = "" }) => (
            <a
              key={href}
              href={href}
              className="hover:text-textcolor-400 border-t border-background-200 transition-colors pt-4"
              onClick={() => setMenuOpen(false)}
              target={target}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
