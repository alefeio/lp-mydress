import { useState, useEffect } from "react"

const slides = [
    {
        img: "/images/banner/banner1.jpg",
        caption: "Primeiro você começa... depois você melhora! 💕✨"
    },
    {
        img: "/images/banner/banner2.jpg",
        caption: "Coleção 2025 – Cores e Modelos Exclusivos"
    },
    {
        img: "/images/banner/banner4.jpg",
        caption: "Midis Brancos - Perfeitos para eventos diurnos, noivados, batizados ou jantares especiais"
    },
    {
        img: "/images/banner/banner5.jpg",
        caption: "Clutches - O toque final que vai valorizar ainda mais o seu look"
    }
]

export default function HeroSlider() {
    const [current, setCurrent] = useState(0)
    const [playing, setPlaying] = useState(true)
    const [startX, setStartX] = useState(null)

    const handleMouseDown = (e) => setStartX(e.clientX)
    const handleMouseUp = (e) => {
        if (startX === null) return
        const deltaX = e.clientX - startX

        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe para direita → slide anterior
                setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
            } else {
                // Swipe para esquerda → próximo slide
                setCurrent((prev) => (prev + 1) % slides.length)
            }
        }
        setStartX(null)
    }

    const handleTouchStart = (e) => setStartX(e.touches[0].clientX)
    const handleTouchEnd = (e) => {
        if (startX === null) return
        const endX = e.changedTouches[0].clientX
        const deltaX = endX - startX

        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
            } else {
                setCurrent((prev) => (prev + 1) % slides.length)
            }
        }
        setStartX(null)
    }

    useEffect(() => {
        if (!playing) return
        const timer = setTimeout(() => setCurrent((c) => (c + 1) % slides.length), 10000)
        return () => clearTimeout(timer)
    }, [current, playing])

    return (
        <div
            className="relative w-full h-[380px] md:h-[480px] overflow-hidden shadow-lg mb-8 mt-[4.7rem] md:mt-[7.1rem]"
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
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? "opacity-100 z-0" : "opacity-0 z-0"}`}
                >
                    <img src={slide.img} alt={slide.caption} className="object-cover w-full h-full" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                        <h2 className="text-white text-2xl md:text-3xl font-bold drop-shadow">{slide.caption}</h2>
                    </div>
                </div>
            ))}

            {/* Controles (sempre visíveis) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-3 h-3 rounded-full opacity-70 ${idx === current ? "bg-white" : "bg-white/50"}`}
                        onClick={() => setCurrent(idx)}
                        aria-label={`Ir para slide ${idx + 1}`}
                    />
                ))}
            </div>

            <button
                className="absolute top-4 right-4 bg-white/80 opacity-70 rounded-full p-2 shadow hover:bg-white z-10"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pausar" : "Reproduzir"}
            >
                {playing ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" />
                    </svg>
                )}
            </button>
        </div>
    )
}
