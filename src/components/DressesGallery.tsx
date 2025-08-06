import { useState } from "react"

const dresses = [
    { img: "/images/dresses/azul1.jpg", alt: "Vestido Longo Azul" },
    { img: "/images/dresses/azul2.jpg", alt: "Vestido Longo Azul" },
    { img: "/images/dresses/azul3.jpg", alt: "Vestido Longo Azul" },
    { img: "/images/dresses/preto1.jpg", alt: "Vestido Longe Preto" },
    { img: "/images/dresses/preto2.jpg", alt: "Vestido Longo Preto" },
    { img: "/images/dresses/preto3.jpg", alt: "Vestido Longo Preto" },
    { img: "/images/dresses/rosa1.jpg", alt: "Vestido Longo Rosa" },
    { img: "/images/dresses/rosa2.jpg", alt: "Vestido Longo Rosa" },
    { img: "/images/dresses/rosa3.jpg", alt: "Vestido Longo Rosa" },
    { img: "/images/dresses/verde1.jpg", alt: "Vestido Longo Verde" },
    { img: "/images/dresses/verde2.jpg", alt: "Vestido Longo Verde" },
    { img: "/images/dresses/verde3.jpg", alt: "Vestido Longo Verde" },
    { img: "/images/dresses/vermelho1.jpg", alt: "Vestido Longo Vermelho" },
    { img: "/images/dresses/vermelho2.jpg", alt: "Vestido Longo Vermelho" }
]

const clutches = [
    { img: "/images/clutches/amarelo1.jpg", alt: "Vestido Longo Azul" },
    { img: "/images/clutches/azul1.jpg", alt: "Vestido Longo Azul" },
    { img: "/images/clutches/dourado1.jpg", alt: "Vestido Longo Azul" },
    { img: "/images/clutches/marmore1.jpg", alt: "Vestido Longo Azul" },
    { img: "/images/clutches/rosa1.jpg", alt: "Vestido Longo Azul" },
    { img: "/images/clutches/verde1.jpg", alt: "Vestido Longo Azul" },
]

const midisBrancos = [
    { img: "/images/midis-brancos/01.jpg", alt: "Midis Brancos" },
    { img: "/images/midis-brancos/02.jpg", alt: "Midis Brancos" },
    { img: "/images/midis-brancos/03.jpg", alt: "Midis Brancos" },
]

const articles = [
    { img: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80", alt: "Vestido Longo Verde" },
    { img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80", alt: "Vestido Longo Rosa" },
    { img: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80", alt: "Vestido Longo Azul" },
    { img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80", alt: "Vestido Longo Vermelho" },
    { img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80", alt: "Vestido Longo Lilás" },
    { img: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80", alt: "Vestido Longo Branco" },
    { img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80", alt: "Vestido Longo Preto" },
    { img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", alt: "Vestido Longo Dourado" },
]

export default function DressesGallery() {
    const [currentDresses, setCurrentDresses] = useState(0)
    const [currentClutches, setCurrentClutches] = useState(0)
    const [currentMidisBrancos, setCurrentMidisBrancos] = useState(0)
    const [currentArticles, setCurrentArticles] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [modalIdx, setModalIdx] = useState(0)
    const [modalType, setModalType] = useState<"dresses" | "clutches" | "midisBrancos" | null>(null)

    const prevDresses = () => setCurrentDresses((c) => (c === 0 ? dresses.length - 1 : c - 1))
    const nextDresses = () => setCurrentDresses((c) => (c === dresses.length - 1 ? 0 : c + 1))

    const prevClutches = () => setCurrentClutches((c) => (c === 0 ? clutches.length - 1 : c - 1))
    const nextClutches = () => setCurrentClutches((c) => (c === clutches.length - 1 ? 0 : c + 1))

    const prevMidisBrancos = () => setCurrentMidisBrancos((c) => (c === 0 ? midisBrancos.length - 1 : c - 1))
    const nextMidisBrancos = () => setCurrentMidisBrancos((c) => (c === midisBrancos.length - 1 ? 0 : c + 1))

    const prevArticles = () => setCurrentArticles((c) => (c === 0 ? articles.length - 1 : c - 1))
    const nextArticles = () => setCurrentArticles((c) => (c === articles.length - 1 ? 0 : c + 1))

    // Mostra 3 imagens: anterior, atual, próxima
    const getVisibleDresses = () => {
        const prevIdx = (currentDresses === 0 ? dresses.length - 1 : currentDresses - 1)
        const nextIdx = (currentDresses === dresses.length - 1 ? 0 : currentDresses + 1)
        return [dresses[prevIdx], dresses[currentDresses], dresses[nextIdx]]
    }

    const getVisibleClutches = () => {
        const prevIdx = (currentClutches === 0 ? clutches.length - 1 : currentClutches - 1)
        const nextIdx = (currentClutches === clutches.length - 1 ? 0 : currentClutches + 1)
        return [clutches[prevIdx], clutches[currentClutches], clutches[nextIdx]]
    }

    const getVisibleMidisBrancos = () => {
        const prevIdx = (currentMidisBrancos === 0 ? midisBrancos.length - 1 : currentMidisBrancos - 1)
        const nextIdx = (currentMidisBrancos === midisBrancos.length - 1 ? 0 : currentMidisBrancos + 1)
        return [midisBrancos[prevIdx], midisBrancos[currentMidisBrancos], midisBrancos[nextIdx]]
    }

    const getVisibleArticles = () => {
        const prevIdx = (currentArticles === 0 ? articles.length - 1 : currentArticles - 1)
        const nextIdx = (currentArticles === articles.length - 1 ? 0 : currentArticles + 1)
        return [articles[prevIdx], articles[currentArticles], articles[nextIdx]]
    }

    // Navegação no modal
    const modalPrev = () => setModalIdx((idx) => (idx === 0 ? dresses.length - 1 : idx - 1))
    const modalNext = () => setModalIdx((idx) => (idx === dresses.length - 1 ? 0 : idx + 1))

    return (
        <section id="colecao">
            <article className="mt-[2rem] mb-[4rem] md:my-[8rem] mb-8">
                <div className="mb-6 md:text-center max-w-xs md:max-w-7xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 text-center">Alugue seu vestido na MyDress</h2>
                    <p className="px-2 text-gray-700">Na My Dress, você encontra muito mais do que uma vitrine física — temos um catálogo digital completo e sempre atualizado.</p>
                    <p className="px-2 text-gray-700">Aqui você pode visualizar os modelos disponíveis, explorar por cores, tamanhos e estilos antes mesmo de vir até a loja.</p>
                </div>
                <div className="relative flex items-center justify-center overflow-hidden py-4 md:max-w-6xl mx-auto">
                    <div className="flex gap-2 md: gap-4 md:gap-6">
                        {getVisibleDresses().map((dress, idx) => (
                            <div
                                key={idx}
                                className={`h-100 w-80 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105
                ${idx === 1 ? "md:scale-105 z-10" : "opacity-80 scale-95 md:scale-100"}
              `}
                                onClick={() => {
                                    setShowModal(true)
                                    setModalIdx((currentDresses + idx - 1 + dresses.length) % dresses.length)
                                    setModalType("dresses")
                                }}
                            >
                                <img
                                    src={dress.img}
                                    alt={dress.alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={prevDresses}
                        className="absolute left-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition m-2"
                        aria-label="Anterior"
                    >
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextDresses}
                        className="absolute right-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition m-2"
                        aria-label="Próximo"
                    >
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                {/* <div className="flex justify-center gap-2 mt-4">
                    {dresses.map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-4 h-4 rounded-full border-2 ${idx === currentDresses ? "bg-primary border-primary" : "bg-white border-primary/40"}`}
                            onClick={() => setCurrentDresses(idx)}
                            aria-label={`Selecionar slide ${idx + 1}`}
                        />
                    ))}
                </div> */}
            </article>

            <article className="mt-[2rem] mb-[4rem] md:my-[8rem] mb-8">
                <div className="mb-6 md:text-center max-w-xs md:max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center px-4">Midis Brancos</h2>
                    <p className="px-2 text-gray-700">Os vestidos midis brancos são perfeitos para eventos diurnos, noivados, batizados ou jantares especiais.</p>
                    <p className="px-2 text-gray-700">Com cortes modernos e tecidos de alta qualidade, eles trazem charme e delicadeza para cada momento. É a escolha ideal para quem busca um look elegante e atemporal.</p>
                </div>
                <div className="relative flex items-center justify-center overflow-hidden py-4 md:max-w-6xl mx-auto">
                    <div className="flex gap-2 md: gap-4 md:gap-6">
                        {getVisibleMidisBrancos().map((dress, idx) => (
                            <div
                                key={idx}
                                className={`h-100 w-80 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105
                ${idx === 1 ? "md:scale-105 z-10" : "opacity-80 scale-95 md:scale-100"}
              `}
                                onClick={() => {
                                    setShowModal(true)
                                    setModalIdx((currentMidisBrancos + idx - 1 + midisBrancos.length) % midisBrancos.length)
                                    setModalType("midisBrancos")
                                }}
                            >
                                <img
                                    src={dress.img}
                                    alt={dress.alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={prevMidisBrancos}
                        className="absolute left-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition mx-2"
                        aria-label="Anterior"
                    >
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextMidisBrancos}
                        className="absolute right-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition mx-2"
                        aria-label="Próximo"
                    >
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                {/* <div className="flex justify-center gap-2 mt-4">
                    {dresses.map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-4 h-4 rounded-full border-2 ${idx === currentClutches ? "bg-primary border-primary" : "bg-white border-primary/40"}`}
                            onClick={() => setCurrentClutches(idx)}
                            aria-label={`Selecionar slide ${idx + 1}`}
                        />
                    ))}
                </div> */}
            </article>

            <article className="mt-[2rem] mb-[4rem] md:my-[8rem] mb-8">
                <div className="mb-6 md:text-center max-w-xs md:max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center px-4">Chutches</h2>
                    <p className="px-2 text-gray-700">Complete o seu visual com nossas clutches exclusivas, que unem sofisticação e funcionalidade.</p>
                    <p className="px-2 text-gray-700">Seja para uma festa elegante ou um evento formal, nossas bolsas são o toque final que vai valorizar ainda mais o seu look.</p>
                </div>
                <div className="relative flex items-center justify-center overflow-hidden py-4 md:max-w-6xl mx-auto">
                    <div className="flex gap-2 md: gap-4 md:gap-6">
                        {getVisibleClutches().map((dress, idx) => (
                            <div
                                key={idx}
                                className={`h-100 w-80 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105
                ${idx === 1 ? "md:scale-105 z-10" : "opacity-80 scale-95 md:scale-100"}
              `}
                                onClick={() => {
                                    setShowModal(true)
                                    setModalIdx((currentClutches + idx - 1 + clutches.length) % clutches.length)
                                    setModalType("clutches")
                                }}
                            >
                                <img
                                    src={dress.img}
                                    alt={dress.alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={prevClutches}
                        className="absolute left-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition mx-2"
                        aria-label="Anterior"
                    >
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextClutches}
                        className="absolute right-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition mx-2"
                        aria-label="Próximo"
                    >
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                {/* <div className="flex justify-center gap-2 mt-4">
                    {dresses.map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-4 h-4 rounded-full border-2 ${idx === currentClutches ? "bg-primary border-primary" : "bg-white border-primary/40"}`}
                            onClick={() => setCurrentClutches(idx)}
                            aria-label={`Selecionar slide ${idx + 1}`}
                        />
                    ))}
                </div> */}
            </article>

            <article className="mt-[2rem] mb-[4rem] md:my-[8rem] mb-8">
                <div className="mb-6 md:text-center max-w-xs md:max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center px-4 md:max-w-4xl mx-auto">Acessórios</h2>
                    <p className="px-2 text-gray-700">Transforme seu look com nossos acessórios elegantes.</p>
                    <p className="px-2 text-gray-700">Temos peças versáteis que harmonizam com qualquer estilo de vestido, desde joias discretas até acessórios mais marcantes.</p>
                    <p className="px-2 text-gray-700">São detalhes que fazem toda a diferença no resultado final.</p>
                </div>
                {/* <div className="relative flex items-center justify-center overflow-hidden py-4">
                    <button
                        onClick={prevArticles}
                        className="absolute left-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                        aria-label="Anterior"
                    >
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex gap-4">
                        {getVisibleArticles().map((dress, idx) => (
                            <div
                                key={idx}
                                className={`w-40 h-56 md:w-60 md:h-80 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105
                ${idx === 1 ? "scale-105 z-10" : "opacity-80"}
              `}
                                onClick={() => { setShowModal(true); setModalIdx((currentArticles + idx - 1 + dresses.length) % dresses.length) }}
                            >
                                <img
                                    src={dress.img}
                                    alt={dress.alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={nextArticles}
                        className="absolute right-0 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                        aria-label="Próximo"
                    >
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div> */}
                {/* <div className="flex justify-center gap-2 mt-4">
                    {dresses.map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-4 h-4 rounded-full border-2 ${idx === currentArticles ? "bg-primary border-primary" : "bg-white border-primary/40"}`}
                            onClick={() => setCurrentArticles(idx)}
                            aria-label={`Selecionar slide ${idx + 1}`}
                        />
                    ))}
                </div> */}
            </article>

            {/* Modal de Zoom com navegação */}
            {showModal && modalType && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
                    onClick={() => {
                        setShowModal(false)
                        setModalType(null)
                    }}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowModal(false)
                            setModalType(null)
                        }}
                        className="absolute top-20 right-8 md:right-20 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition"
                        aria-label="Fechar"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <button
                        onClick={e => {
                            e.stopPropagation()
                            if (modalType === "dresses") modalPrev()
                            else if (modalType === "clutches") setModalIdx((idx) => (idx === 0 ? clutches.length - 1 : idx - 1))
                            else if (modalType === "midisBrancos") setModalIdx((idx) => (idx === 0 ? midisBrancos.length - 1 : idx - 1))
                        }}
                        className="absolute left-8 md:left-20 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                        aria-label="Anterior"
                    >
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <img
                        src={
                            modalType === "dresses"
                                ? dresses[modalIdx].img
                                : modalType === "clutches"
                                    ? clutches[modalIdx].img
                                    : midisBrancos[modalIdx].img
                        }
                        alt={
                            modalType === "dresses"
                                ? dresses[modalIdx].alt
                                : modalType === "clutches"
                                    ? clutches[modalIdx].alt
                                    : midisBrancos[modalIdx].alt
                        }
                        className="max-w-3xl max-h-[90vh] rounded-xl shadow-2xl border-4 border-white object-contain"
                        onClick={e => e.stopPropagation()}
                    />

                    <button
                        onClick={e => {
                            e.stopPropagation()
                            if (modalType === "dresses") modalNext()
                            else if (modalType === "clutches") setModalIdx((idx) => (idx === clutches.length - 1 ? 0 : idx + 1))
                            else if (modalType === "midisBrancos") setModalIdx((idx) => (idx === midisBrancos.length - 1 ? 0 : idx + 1))
                        }}
                        className="absolute right-8 md:right-20 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                        aria-label="Próximo"
                    >
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </section>
    )
}