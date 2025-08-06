import { useState, useEffect } from "react";

const menuLinks = [
  { label: "Início", href: "#inicio" },
  { label: "A MyDress", href: "#empresa" },
  { label: "Nossa coleção", href: "#colecao" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Perguntas Frequentes", href: "#faq" },
  { label: "Onde Estamos", href: "#localizacao" },
  { label: "Contato", href: "https://wa.me//5591985810208?text=Gostaria de mais informações. Estou entrando em contato através do site.", target: "_blank" },
];

export function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar rolagem
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350); // ajuste a altura conforme o tamanho do seu banner
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 shadow-md ${
        isScrolled
          ? "bg-[#ede4e2]/50 backdrop-blur-sm pt-2 pb-1"
          : "bg-[#ede4e2] pt-4 pb-2"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 transition-all duration-300">
        {/* Logo */}
        <a href="#inicio" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Logomarca MyDress"
            className={`transition-all duration-300 ${
              isScrolled ? "w-14 md:w-20" : "w-16 md:w-24"
            }`}
          />
        </a>

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-8 font-semibold text-primary text-lg">
          {menuLinks.map(({ label, href, target = "" }) => (
            <a
              key={href}
              href={href}
              className="hover:text-secondary transition-colors text-primary"
              onClick={() => setMenuOpen(false)}
              target={target}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Botão hamburger mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          <span
            className={`block h-0.5 w-6 bg-primary transition-transform ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-primary transition-opacity ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-primary transition-transform ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu móvel */}
      {menuOpen && (
        <nav className="md:hidden py-4 flex flex-col gap-4 font-semibold text-primary bg-[#ede4e2]/95 px-4">
          {menuLinks.map(({ label, href, target = "" }) => (
            <a
              key={href}
              href={href}
              className="hover:text-secondary border-t border-pink-200 transition-colors text-primary pt-4"
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
