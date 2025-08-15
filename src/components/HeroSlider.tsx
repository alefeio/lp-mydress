import { useState, useEffect } from "react";

interface BannerItem {
  id: string;
  url: string;
  caption?: string; // Propriedade opcional para o texto do banner
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [startX, setStartX] = useState<number | null>(null);
  const [slides, setSlides] = useState<BannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Busca os dados do banner da API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/crud/banner");
        if (response.ok) {
          const data = await response.json();
          if (data && data.banners) {
            setSlides(data.banners);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do banner:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Lógica para auto-play do slider
  useEffect(() => {
    if (!playing || slides.length === 0) return;
    const timer = setTimeout(() => setCurrent((c) => (c + 1) % slides.length), 10000);
    return () => clearTimeout(timer);
  }, [current, playing, slides.length]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setPlaying(false);
    setStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (startX === null) return;
    const deltaX = e.clientX - startX;

    if (Math.abs(deltaX) > 50) {
      setCurrent((prev) => (deltaX > 0 ? (prev - 1 + slides.length) % slides.length : (prev + 1) % slides.length));
    }

    setStartX(null);
    setPlaying(true);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setPlaying(false);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;

    if (Math.abs(deltaX) > 50) {
      setCurrent((prev) => (deltaX > 0 ? (prev - 1 + slides.length) % slides.length : (prev + 1) % slides.length));
    }

    setStartX(null);
    setPlaying(true);
  };

  if (isLoading || slides.length === 0) {
    return null; // Não renderiza nada enquanto carrega ou se não houver banners
  }

  return (
    <div
      className="relative w-full h-[200px] md:h-[250px] lg:h-[280px] xl:h-[480px] overflow-hidden shadow-lg mb-8 mt-[4.7rem] md:mt-[7.1rem]"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setPlaying(false)}
      onMouseLeave={() => setPlaying(true)}
      id="inicio"
    >
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? "opacity-100 z-0" : "opacity-0 z-0"}`}
        >
          <img src={slide.url} alt={slide.caption || `Banner ${idx + 1}`} className="object-cover w-full h-full" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-graytone-950/60 to-transparent p-6">
            <h2 className="font-serif text-2xl text-textcolor-50 md:text-3xl font-bold drop-shadow">{slide.caption}</h2>
          </div>
        </div>
      ))}

      {/* Controles */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-textcolor-50" : "bg-textcolor-50/50 opacity-70"}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Ir para slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Botão Play/Pause */}
      <button
        className="absolute top-4 right-4 bg-textcolor-50/80 opacity-70 rounded-full p-2 shadow-lg hover:bg-textcolor-50 z-10"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pausar" : "Reproduzir"}
      >
        {playing ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
    </div>
  );
}