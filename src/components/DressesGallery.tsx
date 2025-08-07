import { useState } from "react"

const blueDresses = [
    { img: "/images/dresses/azul1.jpg", alt: "Vestido Longo Azul 1" },
    { img: "/images/dresses/azul2.jpg", alt: "Vestido Longo Azul 2" },
    { img: "/images/dresses/azul3.jpg", alt: "Vestido Longo Azul 3" },
]

const blackDresses = [
    { img: "/images/dresses/preto1.jpg", alt: "Vestido Longe Preto 1" },
    { img: "/images/dresses/preto2.jpg", alt: "Vestido Longo Preto 2" },
    { img: "/images/dresses/preto3.jpg", alt: "Vestido Longo Preto 3" }
]

const pinkDresses = [
    { img: "/images/dresses/rosa1.jpg", alt: "Vestido Longo Rosa 1" },
    { img: "/images/dresses/rosa2.jpg", alt: "Vestido Longo Rosa 2" },
    { img: "/images/dresses/rosa3.jpg", alt: "Vestido Longo Rosa 3" }
]

const greenDresses = [
    { img: "/images/dresses/verde1.jpg", alt: "Vestido Longo Verde 1" },
    { img: "/images/dresses/verde2.jpg", alt: "Vestido Longo Verde 2" },
    { img: "/images/dresses/verde3.jpg", alt: "Vestido Longo Verde 3" }
]

const redDresses = [
    { img: "/images/dresses/vermelho1.jpg", alt: "Vestido Longo Vermelho 1" },
    { img: "/images/dresses/vermelho2.jpg", alt: "Vestido Longo Vermelho 2" },
    { img: "/images/dresses/vermelho1.jpg", alt: "Vestido Longo Vermelho 3" }
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
    const [currentBlueDresses, setCurrentBlueDresses] = useState(0)
    const [currentBlackDresses, setCurrentBlackDresses] = useState(0)
    const [currentPinkDresses, setCurrentPinkDresses] = useState(0)
    const [currentGreenDresses, setCurrentGreenDresses] = useState(0)
    const [currentRedDresses, setCurrentRedDresses] = useState(0)
    const [currentClutches, setCurrentClutches] = useState(0)
    const [currentMidisBrancos, setCurrentMidisBrancos] = useState(0)
    const [currentArticles, setCurrentArticles] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [modalIdx, setModalIdx] = useState(0)
    const [modalType, setModalType] = useState<"blueDresses" | "blackDresses" | "pinkDresses" | "greenDresses" | "redDresses" | "clutches" | "midisBrancos" | null>(null)

    const prevBlueDresses = () => setCurrentBlueDresses((c) => (c === 0 ? blueDresses.length - 1 : c - 1))
    const nextBlueDresses = () => setCurrentBlueDresses((c) => (c === blueDresses.length - 1 ? 0 : c + 1))

    const prevBlackDresses = () => setCurrentBlackDresses((c) => (c === 0 ? blackDresses.length - 1 : c - 1))
    const nextBlackDresses = () => setCurrentBlackDresses((c) => (c === blackDresses.length - 1 ? 0 : c + 1))

    const prevPinkDresses = () => setCurrentPinkDresses((c) => (c === 0 ? pinkDresses.length - 1 : c - 1))
    const nextPinkDresses = () => setCurrentPinkDresses((c) => (c === pinkDresses.length - 1 ? 0 : c + 1))

    const prevGreenDresses = () => setCurrentGreenDresses((c) => (c === 0 ? greenDresses.length - 1 : c - 1))
    const nextGreenDresses = () => setCurrentGreenDresses((c) => (c === greenDresses.length - 1 ? 0 : c + 1))

    const prevRedDresses = () => setCurrentRedDresses((c) => (c === 0 ? redDresses.length - 1 : c - 1))
    const nextRedDresses = () => setCurrentRedDresses((c) => (c === redDresses.length - 1 ? 0 : c + 1))

    const prevClutches = () => setCurrentClutches((c) => (c === 0 ? clutches.length - 1 : c - 1))
    const nextClutches = () => setCurrentClutches((c) => (c === clutches.length - 1 ? 0 : c + 1))

    const prevMidisBrancos = () => setCurrentMidisBrancos((c) => (c === 0 ? midisBrancos.length - 1 : c - 1))
    const nextMidisBrancos = () => setCurrentMidisBrancos((c) => (c === midisBrancos.length - 1 ? 0 : c + 1))

    const prevArticles = () => setCurrentArticles((c) => (c === 0 ? articles.length - 1 : c - 1))
    const nextArticles = () => setCurrentArticles((c) => (c === articles.length - 1 ? 0 : c + 1))

    // Mostra 3 imagens: anterior, atual, próxima
    const getVisibleBlueDresses = () => {
        const prevIdx = (currentBlueDresses === 0 ? blueDresses.length - 1 : currentBlueDresses - 1)
        const nextIdx = (currentBlueDresses === blueDresses.length - 1 ? 0 : currentBlueDresses + 1)
        return [blueDresses[prevIdx], blueDresses[currentBlueDresses], blueDresses[nextIdx]]
    }

    const getVisibleBlackDresses = () => {
        const prevIdx = (currentBlackDresses === 0 ? blackDresses.length - 1 : currentBlackDresses - 1)
        const nextIdx = (currentBlackDresses === blackDresses.length - 1 ? 0 : currentBlackDresses + 1)
        return [blackDresses[prevIdx], blackDresses[currentBlackDresses], blackDresses[nextIdx]]
    }

    const getVisiblePinkDresses = () => {
        const prevIdx = (currentPinkDresses === 0 ? pinkDresses.length - 1 : currentPinkDresses - 1)
        const nextIdx = (currentPinkDresses === pinkDresses.length - 1 ? 0 : currentPinkDresses + 1)
        return [pinkDresses[prevIdx], pinkDresses[currentPinkDresses], pinkDresses[nextIdx]]
    }

    const getVisibleGreenDresses = () => {
        const prevIdx = (currentGreenDresses === 0 ? greenDresses.length - 1 : currentGreenDresses - 1)
        const nextIdx = (currentGreenDresses === greenDresses.length - 1 ? 0 : currentGreenDresses + 1)
        return [greenDresses[prevIdx], greenDresses[currentGreenDresses], greenDresses[nextIdx]]
    }

    const getVisibleRedDresses = () => {
        const prevIdx = (currentRedDresses === 0 ? redDresses.length - 1 : currentRedDresses - 1)
        const nextIdx = (currentRedDresses === redDresses.length - 1 ? 0 : currentRedDresses + 1)
        return [redDresses[prevIdx], redDresses[currentRedDresses], redDresses[nextIdx]]
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
    const modalPrev = () => setModalIdx((idx) => (idx === 0 ? blueDresses.length - 1 : idx - 1))
    const modalNext = () => setModalIdx((idx) => (idx === blueDresses.length - 1 ? 0 : idx + 1))

    return (
        <section id="colecao">
            <div className="mt-[4.7rem] md:mt-[7.1rem] mb-32 text-center md:max-w-7xl mx-auto">
                <div className="my-8">
                    <div className="my-16 max-w-xs md:max-w-7xl mx-auto">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                            Conheça nossa Coleção
                        </h2>
                        <p className="border-t-2 border-textcolor-200 px-4 py-6 w-fit m-auto"><strong>Vestidos modernos, elegantes e sempre atualizados com as últimas tendências.</strong></p>
                    </div>

                    <article className="my-16">
                        <div className="max-w-xs mx-auto mb-6 text-center md:max-w-7xl mx-auto">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#528ce0]">
                                Vestidos Azuis
                            </h2>
                            <p className="px-2 text-graytone-400 mb-6"><strong>Tons que transmitem elegância e serenidade</strong></p>
                            <p className="px-2">Os vestidos azuis são perfeitos para quem deseja um look sofisticado, seja para eventos diurnos ou noturnos.</p>
                            <p className="px-2">
                                Do azul claro ao marinho, escolha o tom que mais combina com você.
                            </p>
                        </div>

                        <div className="relative flex items-center justify-center overflow-hidden py-4 md:max-w-6xl mx-auto">
                            <div className="flex gap-2 md:gap-4 md:gap-6">
                                {getVisibleBlueDresses().map((dress, idx) => (
                                    <div
                                        key={idx}
                                        className="h-100 w-80 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => {
                                            setShowModal(true);
                                            setModalIdx((currentBlueDresses + idx - 1 + blueDresses.length) % blueDresses.length);
                                            setModalType("blueDresses");
                                        }}
                                    >
                                        <img src={dress.img} alt={dress.alt} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={prevBlueDresses}
                                className="absolute left-0 z-10 bg-background-100 hover:bg-background-200 rounded-full p-2 shadow transition m-2"
                                aria-label="Anterior"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={nextBlueDresses}
                                className="absolute right-0 z-10 bg-background-100 hover:bg-background-200 rounded-full p-2 shadow transition m-2"
                                aria-label="Próximo"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <a
                            href="https://wa.me//5591985810208?text='Olá! Gostaria do Catálogo de Vestidos Azuis.'"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center mx-auto my-6 bg-[#528ce0] hover:bg-background-200 text-background-50 rounded-full shadow-lg py-2 px-4 font-bold text-sm transition-colors duration-300"
                        >
                            Solicitar Catálogo de Vestidos Azuis
                        </a>
                    </article>

                    <article className="my-16">
                        <div className="max-w-xs mx-auto mb-6 text-center md:max-w-7xl mx-auto">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1e1f24]">
                                Vestidos Pretos
                            </h2>
                            <p className="px-2 text-graytone-400 mb-6"><strong>Clássicos, atemporais e indispensáveis</strong></p>
                            <p className="px-2">Os vestidos pretos são sinônimo de versatilidade e poder. Ideal para ocasiões formais, jantares <br />
                                ou para aquele evento em que você quer se destacar com discrição e estilo.</p>
                        </div>

                        <div className="relative flex items-center justify-center overflow-hidden py-4 md:max-w-6xl mx-auto">
                            <div className="flex gap-2 md:gap-4 md:gap-6">
                                {getVisibleBlackDresses().map((dress, idx) => (
                                    <div
                                        key={idx}
                                        className="h-100 w-80 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105 flex-shrink-0"
                                        onClick={() => {
                                            setShowModal(true);
                                            setModalIdx((currentBlackDresses + idx - 1 + blackDresses.length) % blackDresses.length);
                                            setModalType("blackDresses");
                                        }}
                                    >
                                        <img src={dress.img} alt={dress.alt} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={prevBlackDresses}
                                className="absolute left-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow transition m-2"
                                aria-label="Anterior"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={nextBlackDresses}
                                className="absolute right-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow transition m-2"
                                aria-label="Próximo"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/*
  <div className="flex justify-center gap-2 mt-4">
    {dresses.map((_, idx) => (
      <button
        key={idx}
        className={`w-4 h-4 rounded-full border-2 ${
          idx === currentDresses
            ? "bg-textcolor-600 border-textcolor-600"
            : "bg-background-50 border-textcolor-600/40"
        }`}
        onClick={() => setCurrentDresses(idx)}
        aria-label={`Selecionar slide ${idx + 1}`}
      />
    ))}
  </div>
  */}
                        <a
                            href="https://wa.me//5591985810208?text='Olá! Gostaria do Catálogo de Vestidos Pretos.'"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center mx-auto my-6 bg-[#1e1f24] hover:bg-background-200 text-background-50 rounded-full shadow-lg py-2 px-4 font-bold text-sm transition-colors duration-300"
                        >
                            Solicitar Catálogo de Vestidos Pretos
                        </a>
                    </article>

                    <article className="my-16">
                        <div className="max-w-xs mx-auto mb-6 text-center md:max-w-7xl mx-auto">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#ad3163]">
                                Vestidos Rosas
                            </h2>
                            <p className="px-2 text-graytone-400 mb-6"><strong>Delicadeza com atitude</strong></p>
                            <p className="px-2">Os vestidos rosas vão do tom pastel ao pink vibrante, oferecendo opções românticas, femininas e cheias de personalidade.</p>
                            <p className="px-2">Perfeitos para celebrações especiais ou looks casuais com charme.</p>
                        </div>

                        <div className="relative flex items-center justify-center overflow-hidden py-4 md:max-w-6xl mx-auto">
                            <div className="flex gap-2 md:gap-4 md:gap-6">
                                {getVisiblePinkDresses().map((dress, idx) => (
                                    <div
                                        key={idx}
                                        className="h-100 w-80 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => {
                                            setShowModal(true);
                                            setModalIdx((currentPinkDresses + idx - 1 + pinkDresses.length) % pinkDresses.length);
                                            setModalType("pinkDresses");
                                        }}
                                    >
                                        <img src={dress.img} alt={dress.alt} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={prevPinkDresses}
                                className="absolute left-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow transition m-2"
                                aria-label="Anterior"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={nextPinkDresses}
                                className="absolute right-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow transition m-2"
                                aria-label="Próximo"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* 
  <div className="flex justify-center gap-2 mt-4">
    {dresses.map((_, idx) => (
      <button
        key={idx}
        className={`w-4 h-4 rounded-full border-2 ${
          idx === currentDresses
            ? "bg-textcolor-600 border-textcolor-600"
            : "bg-background-50 border-textcolor-600/40"
        }`}
        onClick={() => setCurrentDresses(idx)}
        aria-label={`Selecionar slide ${idx + 1}`}
      />
    ))}
  </div> 
  */}
                        <a
                            href="https://wa.me//5591985810208?text='Olá! Gostaria do Catálogo de Vestidos Rosas.'"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center mx-auto my-6 bg-[#ad3163] hover:bg-background-200 text-background-50 rounded-full shadow-lg py-2 px-4 font-bold text-sm transition-colors duration-300"
                        >
                            Solicitar Catálogo de Vestidos Rosas
                        </a>
                    </article>

                    <article className="my-16">
                        <div className="max-w-xs mx-auto mb-6 text-center md:max-w-7xl mx-auto">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#426b5d]">
                                Vestidos Verdes
                            </h2>
                            <p className="px-2 text-graytone-400 mb-6"><strong>Conecte-se com a natureza em grande estilo</strong></p>
                            <p className="px-2">Os vestidos verdes trazem frescor, leveza e modernidade. Desde o verde-menta ao esmeralda, <br />
                                eles são ideais para eventos ao ar livre ou produções mais ousadas e elegantes.
                            </p>
                        </div>

                        <div className="relative flex items-center justify-center overflow-hidden py-4 md:max-w-6xl mx-auto">
                            <div className="flex gap-2 md:gap-4 md:gap-6">
                                {getVisibleGreenDresses().map((dress, idx) => (
                                    <div
                                        key={idx}
                                        className="h-100 w-80 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => {
                                            setShowModal(true);
                                            setModalIdx((currentGreenDresses + idx - 1 + greenDresses.length) % greenDresses.length);
                                            setModalType("greenDresses");
                                        }}
                                    >
                                        <img src={dress.img} alt={dress.alt} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={prevGreenDresses}
                                className="absolute left-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow transition m-2"
                                aria-label="Anterior"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={nextGreenDresses}
                                className="absolute right-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow transition m-2"
                                aria-label="Próximo"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/*
  <div className="flex justify-center gap-2 mt-4">
    {dresses.map((_, idx) => (
      <button
        key={idx}
        className={`w-4 h-4 rounded-full border-2 ${
          idx === currentDresses
            ? "bg-textcolor-600 border-textcolor-600"
            : "bg-background-50 border-textcolor-600/40"
        }`}
        onClick={() => setCurrentDresses(idx)}
        aria-label={`Selecionar slide ${idx + 1}`}
      />
    ))}
  </div>
  */}
                        <a
                            href="https://wa.me//5591985810208?text='Olá! Gostaria do Catálogo de Vestidos Verdes.'"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center mx-auto my-6 bg-[#426b5d] hover:bg-background-200 text-background-50 rounded-full shadow-lg py-2 px-4 font-bold text-sm transition-colors duration-300"
                        >
                            Solicitar Catálogo de Vestidos Verdes
                        </a>
                    </article>

                    <article className="my-16">
                        <div className="max-w-xs mx-auto mb-6 text-center md:max-w-7xl mx-auto">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#d01b2c]">
                                Vestidos Vermelhos
                            </h2>
                            <p className="px-2 text-graytone-400 mb-6"><strong>Para mulheres que não passam despercebidas</strong></p>
                            <p className="px-2">Os vestidos vermelhos são sensuais, marcantes e cheios de energia.</p>
                            <p className="px-2">Uma escolha poderosa para festas, encontros ou qualquer ocasião em que você queira ser lembrada.</p>
                        </div>

                        <div className="relative flex items-center justify-center overflow-hidden py-4 md:max-w-6xl mx-auto">
                            <div className="flex gap-2 md:gap-4 md:gap-6">
                                {getVisibleRedDresses().map((dress, idx) => (
                                    <div
                                        key={idx}
                                        className="h-100 w-80 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => {
                                            setShowModal(true);
                                            setModalIdx((currentRedDresses + idx - 1 + redDresses.length) % redDresses.length);
                                            setModalType("redDresses");
                                        }}
                                    >
                                        <img src={dress.img} alt={dress.alt} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={prevRedDresses}
                                className="absolute left-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow transition m-2"
                                aria-label="Anterior"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={nextRedDresses}
                                className="absolute right-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow transition m-2"
                                aria-label="Próximo"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* 
  <div className="flex justify-center gap-2 mt-4">
    {dresses.map((_, idx) => (
      <button
        key={idx}
        className={`w-4 h-4 rounded-full border-2 ${
          idx === currentDresses
            ? "bg-textcolor-600 border-textcolor-600"
            : "bg-background-50 border-textcolor-600/40"
        }`}
        onClick={() => setCurrentDresses(idx)}
        aria-label={`Selecionar slide ${idx + 1}`}
      />
    ))}
  </div>
  */}
                        <a
                            href="https://wa.me//5591985810208?text='Olá! Gostaria do Catálogo de Vestidos Vermelhos.'"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center mx-auto my-6 bg-[#d01b2c] hover:bg-background-200 text-background-50 rounded-full shadow-lg py-2 px-4 font-bold text-sm transition-colors duration-300"
                        >
                            Solicitar Catálogo de Vestidos Vermelhos
                        </a>
                    </article>

                    <article className="my-16">
                        <div className="max-w-xs mx-auto mb-6 text-center md:max-w-4xl mx-auto">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold px-4 text-graytone-600">
                                Midis Brancos
                            </h2>
                            <p className="px-2 text-graytone-400 mb-6"><strong>Leves, sofisticados e cheios de significado</strong></p>
                            <p className="px-2">Os vestidos midis brancos são ideais para momentos especiais como <br />
                                noivados, batizados, jantares ou celebrações ao ar livre.</p>
                            <p className="px-2">Transmitem pureza, delicadeza e elegância em cada detalhe.</p>
                        </div>

                        <div className="relative flex items-center justify-center overflow-hidden py-4 md:max-w-6xl mx-auto">
                            <div className="flex gap-2 md:gap-4 md:gap-6">
                                {getVisibleMidisBrancos().map((dress, idx) => (
                                    <div
                                        key={idx}
                                        className="h-100 w-80 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => {
                                            setShowModal(true);
                                            setModalIdx((currentMidisBrancos + idx - 1 + midisBrancos.length) % midisBrancos.length);
                                            setModalType("midisBrancos");
                                        }}
                                    >
                                        <img src={dress.img} alt={dress.alt} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={prevMidisBrancos}
                                className="absolute left-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow transition mx-2"
                                aria-label="Anterior"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={nextMidisBrancos}
                                className="absolute right-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow transition mx-2"
                                aria-label="Próximo"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/*
  <div className="flex justify-center gap-2 mt-4">
    {dresses.map((_, idx) => (
      <button
        key={idx}
        className={`w-4 h-4 rounded-full border-2 ${
          idx === currentClutches
            ? "bg-textcolor-600 border-textcolor-600"
            : "bg-background-50 border-textcolor-600/40"
        }`}
        onClick={() => setCurrentClutches(idx)}
        aria-label={`Selecionar slide ${idx + 1}`}
      />
    ))}
  </div>
  */}
                        <a
                            href="https://wa.me//5591985810208?text='Olá! Gostaria do Catálogo de Midis Brancos.'"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center mx-auto my-6 hover:bg-background-200 text-graytone-600 border border-graytone-300 rounded-full shadow-lg py-2 px-4 font-bold text-sm transition-colors duration-300"
                        >
                            Solicitar Catálogo de Midis Brancos
                        </a>
                    </article>

                    <article className="my-16">
                        <div className="max-w-xs mx-auto mb-6 text-center md:max-w-4xl mx-auto">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold px-4 text-[#e39002]">
                                Chutches
                            </h2>
                            <p className="px-2 text-graytone-400 mb-6"><strong>O toque final perfeito para qualquer produção</strong></p>
                            <p className="px-2">As clutches unem praticidade e estilo, elevando o seu look com charme e sofisticação.</p>
                            <p className="px-2">Modelos ideais para eventos, festas ou para transformar o básico em algo memorável.</p>
                        </div>

                        <div className="relative flex items-center justify-center overflow-hidden py-4 md:max-w-6xl mx-auto">
                            <div className="flex gap-2 md:gap-4 md:gap-6">
                                {getVisibleClutches().map((dress, idx) => (
                                    <div
                                        key={idx}
                                        className="h-100 w-80 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-105"
                                        onClick={() => {
                                            setShowModal(true);
                                            setModalIdx((currentClutches + idx - 1 + clutches.length) % clutches.length);
                                            setModalType("clutches");
                                        }}
                                    >
                                        <img src={dress.img} alt={dress.alt} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={prevClutches}
                                className="absolute left-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow transition mx-2"
                                aria-label="Anterior"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                type="button"
                                onClick={nextClutches}
                                className="absolute right-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow transition mx-2"
                                aria-label="Próximo"
                            >
                                <svg
                                    className="w-6 h-6 text-textcolor-600"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/*
  <div className="flex justify-center gap-2 mt-4">
    {dresses.map((_, idx) => (
      <button
        key={idx}
        className={`w-4 h-4 rounded-full border-2 ${
          idx === currentClutches
            ? "bg-textcolor-600 border-textcolor-600"
            : "bg-background-50 border-textcolor-600/40"
        }`}
        onClick={() => setCurrentClutches(idx)}
        aria-label={`Selecionar slide ${idx + 1}`}
      />
    ))}
  </div>
  */}
                        <a
                            href="https://wa.me//5591985810208?text='Olá! Gostaria do Catálogo de Clutches.'"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center mx-auto my-6 bg-[#e39002] hover:bg-background-200 text-background-50 rounded-full shadow-lg py-2 px-4 font-bold text-sm transition-colors duration-300"
                        >
                            Solicitar Catálogo de Clutches
                        </a>
                    </article>

                    <article className="my-16">
                        <div className="max-w-xs mx-auto mb-6 text-center md:max-w-4xl mx-auto">
                            <h2 className="font-serif text-2xl md:text-3xl font-bold px-4 text-[#bf9376]">
                                Acessórios
                            </h2>
                            <p className="px-2 text-graytone-400 mb-6"><strong>São os detalhes que fazem a diferença</strong></p>
                            <p className="px-2">Nossos acessórios foram escolhidos para complementar seus looks com equilíbrio, brilho e personalidade.</p>
                            <p className="px-2">Do discreto ao ousado, encontre a peça certa para expressar seu estilo.</p>
                        </div>
                        <a
                            href="https://wa.me//5591985810208?text='Olá! Gostaria do Catálogo de Acessórios.'"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center mx-auto my-6 bg-[#bf9376] hover:bg-background-200 text-background-50 rounded-full shadow-lg py-2 px-4 font-bold text-sm transition-colors duration-300"
                        >
                            Solicitar Catálogo de Acessórios
                        </a>
                    </article>
                </div>
            </div>

            {/* Modal de Zoom com navegação */}
            {showModal && modalType && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
                    onClick={() => {
                        setShowModal(false);
                        setModalType(null);
                    }}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowModal(false);
                            setModalType(null);
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
                        onClick={(e) => {
                            e.stopPropagation();

                            // Navegação anterior para cada tipo
                            if (
                                modalType === "blueDresses" ||
                                modalType === "blackDresses" ||
                                modalType === "pinkDresses" ||
                                modalType === "greenDresses" ||
                                modalType === "redDresses"
                            ) {
                                // Usar função modalPrev para vestidos, supondo que ela é genérica
                                modalPrev();
                            } else if (modalType === "clutches") {
                                setModalIdx((idx) => (idx === 0 ? clutches.length - 1 : idx - 1));
                            } else if (modalType === "midisBrancos") {
                                setModalIdx((idx) => (idx === 0 ? midisBrancos.length - 1 : idx - 1));
                            }
                        }}
                        className="absolute left-8 md:left-20 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                        aria-label="Anterior"
                    >
                        <svg
                            className="w-8 h-8 text-textcolor-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <img
                        src={
                            modalType === "blueDresses"
                                ? blueDresses[modalIdx].img
                                : modalType === "blackDresses"
                                    ? blackDresses[modalIdx].img
                                    : modalType === "pinkDresses"
                                        ? pinkDresses[modalIdx].img
                                        : modalType === "greenDresses"
                                            ? greenDresses[modalIdx].img
                                            : modalType === "redDresses"
                                                ? redDresses[modalIdx].img
                                                : modalType === "clutches"
                                                    ? clutches[modalIdx].img
                                                    : modalType === "midisBrancos"
                                                        ? midisBrancos[modalIdx].img
                                                        : ""
                        }
                        alt={
                            modalType === "blueDresses"
                                ? blueDresses[modalIdx].alt
                                : modalType === "blackDresses"
                                    ? blackDresses[modalIdx].alt
                                    : modalType === "pinkDresses"
                                        ? pinkDresses[modalIdx].alt
                                        : modalType === "greenDresses"
                                            ? greenDresses[modalIdx].alt
                                            : modalType === "redDresses"
                                                ? redDresses[modalIdx].alt
                                                : modalType === "clutches"
                                                    ? clutches[modalIdx].alt
                                                    : modalType === "midisBrancos"
                                                        ? midisBrancos[modalIdx].alt
                                                        : ""
                        }
                        className="max-w-3xl max-h-[90vh] rounded-xl shadow-2xl border-4 border-primary object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();

                            // Navegação próxima para cada tipo
                            if (
                                modalType === "blueDresses" ||
                                modalType === "blackDresses" ||
                                modalType === "pinkDresses" ||
                                modalType === "greenDresses" ||
                                modalType === "redDresses"
                            ) {
                                modalNext();
                            } else if (modalType === "clutches") {
                                setModalIdx((idx) => (idx === clutches.length - 1 ? 0 : idx + 1));
                            } else if (modalType === "midisBrancos") {
                                setModalIdx((idx) => (idx === midisBrancos.length - 1 ? 0 : idx + 1));
                            }
                        }}
                        className="absolute right-8 md:right-20 bg-white/80 hover:bg-white rounded-full p-2 shadow transition"
                        aria-label="Próximo"
                    >
                        <svg
                            className="w-8 h-8 text-textcolor-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </section>
    )
}