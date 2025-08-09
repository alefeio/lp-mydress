import { useRef, useState } from "react";
import { GallerySection } from "./GallerySection";
import { collections } from "./Collections";
import { useGalleryNavigation } from "./useGalleryNavigation";
import { Product } from "types";
import { useRouter } from "next/router";

type CollectionKey = keyof typeof collections;

export default function DressesGallery() {
    const [showModal, setShowModal] = useState(false);
    const [modalIdx, setModalIdx] = useState(0);
    const [modalType, setModalType] = useState<CollectionKey | null>(null);
    const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
    const [showLens, setShowLens] = useState(false);
    const zoomImgRef = useRef<HTMLImageElement | null>(null);

    const router = useRouter();

    const handleClick = (pg: string) => {
        router.push(pg);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = zoomImgRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setLensPos({ x, y });
    };

    const lensSize = 350; // diâmetro da lente de zoom

    const galleryMap: Record<CollectionKey, ReturnType<typeof useGalleryNavigation<Product>>> = {
        blueDresses: useGalleryNavigation<Product>(collections.blueDresses.length),
        blackDresses: useGalleryNavigation<Product>(collections.blackDresses.length),
        pinkDresses: useGalleryNavigation<Product>(collections.pinkDresses.length),
        greenDresses: useGalleryNavigation<Product>(collections.greenDresses.length),
        redDresses: useGalleryNavigation<Product>(collections.redDresses.length),
        orangeDresses: useGalleryNavigation<Product>(collections.orangeDresses.length),
        clutches: useGalleryNavigation<Product>(collections.clutches.length),
        midisBrancos: useGalleryNavigation<Product>(collections.midisBrancos.length),
        articles: useGalleryNavigation<Product>(collections.articles.length),
    };

    const modalPrev = () => {
        if (!modalType) return;
        const items = collections[modalType];
        setModalIdx((idx) => (idx === 0 ? items.length - 1 : idx - 1));
    };

    const modalNext = () => {
        if (!modalType) return;
        const items = collections[modalType];
        setModalIdx((idx) => (idx === items.length - 1 ? 0 : idx + 1));
    };

    const openModal = (index: number, type: CollectionKey) => {
        setModalIdx(index);
        setModalType(type);
        setShowModal(true);
    };

    const currentCollection: Product[] = modalType ? collections[modalType] : [];

    return (
        <section id="colecao">
            <div className="mt-[4.7rem] md:mt-[7.1rem] mb-32 text-center md:max-w-7xl mx-auto">
                <div className="my-8">
                    <div className="my-16 max-w-xs md:max-w-7xl mx-auto">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Conheça nossa Coleção</h2>
                        <p className="border-t-2 border-textcolor-200 text-background-700 px-4 py-6 w-fit m-auto">
                            <strong>Vestidos modernos, elegantes e sempre atualizados com as últimas tendências.</strong>
                        </p>
                    </div>

                    {(
                        [
                            {
                                key: "blueDresses",
                                title: "Tons Azuis",
                                subtitle: "Tons que transmitem elegância e serenidade",
                                description: (
                                    <>
                                        <p className="px-2 text-sm">
                                            Os vestidos azuis são perfeitos para quem deseja um look sofisticado, seja para eventos diurnos ou noturnos.
                                        </p>
                                        <p className="px-2 text-sm">
                                            Do azul claro ao marinho, escolha o tom que mais combina com você.
                                        </p>
                                    </>
                                ),
                                bgcolor: "bg-blue-500",
                                buttonText: "Solicitar Catálogo de Tons Azuis",
                            },
                            {
                                key: "blackDresses",
                                title: "Tons Pretos",
                                subtitle: "Clássicos, atemporais e indispensáveis",
                                description: (
                                    <p className="px-2 text-sm">
                                        Os vestidos pretos são sinônimo de versatilidade e poder. Ideal para ocasiões formais, jantares <br /> ou para aquele evento em que você quer se destacar com discrição e estilo.
                                    </p>
                                ),
                                bgcolor: "bg-black/90",
                                buttonText: "Solicitar Catálogo de Tons Pretos",
                            },
                            {
                                key: "greenDresses",
                                title: "Tons Verdes",
                                subtitle: "Inspira frescor e elegância",
                                description: (
                                    <p className="px-2 text-sm">
                                        Os vestidos verdes trazem frescor, leveza e modernidade. Desde o verde-menta ao esmeralda, <br />
                                        eles são ideais para eventos ao ar livre ou produções mais ousadas e elegantes, destacando-se o verde oliva, muito requisitado para madrinhas de casamento, no momento.
                                    </p>
                                ),
                                bgcolor: "bg-green-700",
                                buttonText: "Solicitar Catálogo de Tons Verdes",
                            },
                            {
                                key: "pinkDresses",
                                title: "Tons Rosas",
                                subtitle: "Delicadeza com atitude",
                                description: (
                                    <>
                                        <p className="px-2 text-sm">Os vestidos rosas vão do tom pastel ao pink vibrante, oferecendo opções românticas, femininas e cheias de personalidade.</p>
                                        <p className="px-2 text-sm">Perfeitos para celebrações especiais ou looks casuais com charme.</p>
                                    </>
                                ),
                                bgcolor: "bg-pink-700",
                                buttonText: "Solicitar Catálogo de Tons Rosas",
                            },
                            {
                                key: "redDresses",
                                title: "Tons Vermelhos",
                                subtitle: "Para mulheres que não passam despercebidas",
                                description: (
                                    <p className="px-2 text-sm">
                                        Os vestidos vermelhos são sensuais, marcantes e cheios de energia. Uma escolha poderosa para festas, encontros ou qualquer ocasião em que você queira ser lembrada.
                                    </p>
                                ),
                                bgcolor: "bg-red-700",
                                buttonText: "Solicitar Catálogo de Tons Vermelhos",
                            },
                            {
                                key: "orangeDresses",
                                title: "Tons Laranjas",
                                subtitle: "Para mulheres cheias de vida e personalidade",
                                description: (
                                    <p className="px-2 text-sm">
                                        Os vestidos laranjas transmitem alegria, criatividade e espontaneidade. São perfeitos para quem deseja um visual vibrante e inesquecível em eventos diurnos, festas ao ar livre ou qualquer ocasião onde o brilho da sua energia deve ser destaque.
                                    </p>
                                ),
                                bgcolor: "bg-orange-600",
                                buttonText: "Solicitar Catálogo de Tons Laranjas",
                            },
                            {
                                key: "midisBrancos",
                                title: "Midis Brancos",
                                subtitle: "Leves, sofisticados e cheios de significado",
                                description: (
                                    <>
                                        <p className="px-2 text-sm">Os vestidos midis brancos são ideais para momentos especiais como noivados, batizados, jantares ou celebrações ao ar livre.</p>
                                        <p className="px-2 text-sm">Transmitem pureza, delicadeza e elegância em cada detalhe.</p>
                                    </>
                                ),
                                bgcolor: "bg-midis-300",
                                buttonText: "Solicitar Catálogo de Midis Brancos",
                            },
                            {
                                key: "clutches",
                                title: "Clutches",
                                subtitle: "O toque final perfeito para qualquer produção",
                                description: (
                                    <p className="px-2 text-sm">
                                        As clutches unem praticidade e estilo, elevando o seu look com charme e sofisticação. Modelos ideais para eventos, festas ou para transformar o básico em algo memorável.
                                    </p>
                                ),
                                bgcolor: "bg-clutches-1",
                                buttonText: "Solicitar Catálogo de Clutches",
                            },
                        ] as {
                            key: CollectionKey;
                            title: string;
                            subtitle: string;
                            description: React.ReactNode;
                            bgcolor: string;
                            buttonText: string;
                        }[]
                    ).map((section) => (
                        <GallerySection
                            key={section.key}
                            title={section.title}
                            subtitle={section.subtitle}
                            description={section.description}
                            collectionKey={section.key}
                            bgcolor={section.bgcolor}
                            buttonText={section.buttonText}
                            buttonHref={`https://wa.me//5591985810208?text=Olá! Gostaria do Catálogo de ${section.title}.`}
                            gallery={galleryMap[section.key]}
                            onOpenModal={openModal}
                        />
                    ))}
                </div>
            </div>

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
                        className="absolute top-8 right-8 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition"
                        aria-label="Fechar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {currentCollection.length > 0 && (
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <div
                                className="relative"
                                onMouseMove={handleMouseMove}
                                onMouseEnter={() => setShowLens(true)}
                                onMouseLeave={() => setShowLens(false)}
                            >
                                <img
                                    ref={zoomImgRef}
                                    src={currentCollection[modalIdx].img}
                                    alt={`${currentCollection[modalIdx].productMark} - ${currentCollection[modalIdx].productModel}`}
                                    className="max-w-[90vw] max-h-[80vh] shadow-2xl object-contain rounded-xl"
                                    onClick={(e) => e.stopPropagation()}
                                />

                                {showLens && (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation(); // não fechar o modal
                                            setShowLens(false);
                                        }}
                                        className="absolute rounded-full border border-gray-300 shadow-lg cursor-pointer"
                                        style={{
                                            width: lensSize,
                                            height: lensSize,
                                            top: lensPos.y - lensSize / 2,
                                            left: lensPos.x - lensSize / 2,
                                            backgroundImage: `url(${currentCollection[modalIdx].img})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: `${zoomImgRef.current?.width! * 2}px ${zoomImgRef.current?.height! * 2}px`,
                                            backgroundPosition: `-${lensPos.x * 2 - lensSize / 2}px -${lensPos.y * 2 - lensSize / 2}px`,
                                            zIndex: 60,
                                            pointerEvents: "auto",
                                        }}
                                        title="Clique para ocultar o zoom"
                                    />
                                )}
                            </div>

                            <div className="absolute flex justfy-between gap-2 bottom-0 left-0 w-full bg-gradient-to-t from-graytone-950/60 to-transparent p-2 rounded-b-xl">
                                <div className="font-semibold text-sm truncate flex-1 text-left">
                                    <h3 className="text-textcolor-50">{currentCollection[modalIdx].productMark}</h3>
                                    <p className="text-textcolor-50">Modelo: {currentCollection[modalIdx].productModel}</p>
                                </div>
                                <a
                                    href={`/share/${currentCollection[modalIdx].id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-textcolor-50 hover:text-textcolor-100 rounded-full shadow-lg py-2 px-4 font-bold text-xs transition-colors duration-300"
                                >
                                    Reservar
                                </a>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            modalPrev();
                        }}
                        className="absolute bottom-8 right-[51%] bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition"
                        aria-label="Anterior"
                    >
                        <svg className="w-8 h-8 text-textcolor-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            modalNext();
                        }}
                        className="absolute bottom-8 left-[51%] bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition"
                        aria-label="Próximo"
                    >
                        <svg className="w-8 h-8 text-textcolor-600" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )
            }

        </section >
    );
}
