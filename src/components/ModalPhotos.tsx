import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Product } from "types";
import { collections } from "./Collections";
import Head from "next/head";

type CollectionKey = keyof typeof collections;

interface ModalPhotosProps {
    modalType: CollectionKey | null;
    setModalIdx: React.Dispatch<React.SetStateAction<number>>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setModalType: React.Dispatch<React.SetStateAction<CollectionKey | null>>;
    modalIdx: number;
}

function getCollectionByKey(key: CollectionKey | null): Product[] {
    return key ? collections[key] : [];
}

export default function ModalPhotos({
    modalType,
    setModalIdx,
    setShowModal,
    setModalType,
    modalIdx
}: ModalPhotosProps) {
    const [showLens, setShowLens] = useState(false);
    const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
    const zoomImgRef = useRef<HTMLImageElement | null>(null);
    const router = useRouter();
    const [shareUrl, setShareUrl] = useState("");

    const lensSize = 350; // diâmetro da lente de zoom
    const currentCollection = getCollectionByKey(modalType);

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

    useEffect(() => {
        console.log("currentCollection[modalIdx].id", currentCollection[modalIdx]?.id);
        console.log("collections", collections);

        // Atualiza a URL da página com shallow routing (não recarrega)
        router.replace(`/${modalType}/${modalIdx}`, undefined, { shallow: true });

        // Monta URL absoluta para compartilhar
        setShareUrl(`${window.location.origin}/${modalType}/${modalIdx}`);
    }, [modalIdx, modalType]);

    const shareHref =
        modalType && currentCollection[modalIdx]
            ? `/share/${modalType}/${currentCollection[modalIdx].id}`
            : "#";

    return (
        <>
            <Head>
                <title>{`Foto ${modalIdx + 1} - ${modalType}`}</title>
                <meta name="description" content={`Confira este modelo da coleção ${modalType}.`} />
                <meta property="og:title" content={`Foto ${modalIdx + 1} - ${modalType}`} />
                <meta property="og:description" content={`Confira este modelo da coleção ${modalType}.`} />
                <meta property="og:image" content={currentCollection[modalIdx].img} />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Foto ${modalIdx + 1} - ${modalType}`} />
                <meta name="twitter:description" content={`Confira este modelo da coleção ${modalType}.`} />
                <meta name="twitter:image" content={currentCollection[modalIdx].img} />
            </Head>
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
                                alt={`${currentCollection[modalIdx].productMark || ""} - ${currentCollection[modalIdx].productModel || ""}`}
                                className="max-w-[90vw] max-h-[80vh] shadow-2xl object-contain rounded-xl"
                                onClick={(e) => e.stopPropagation()}
                            />

                            {showLens && (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
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
                                        backgroundSize: `${(zoomImgRef.current?.width || 0) * 2}px ${(zoomImgRef.current?.height || 0) * 2}px`,
                                        backgroundPosition: `-${lensPos.x * 2 - lensSize / 2}px -${lensPos.y * 2 - lensSize / 2}px`,
                                        zIndex: 60,
                                        pointerEvents: "auto",
                                    }}
                                    title="Clique para ocultar o zoom"
                                />
                            )}
                        </div>

                        <div className="absolute flex justfy-between gap-2 top-0 left-0 w-full bg-gradient-to-t to-graytone-950/60 from-transparent p-2 rounded-t-xl">
                            <div className="font-semibold text-sm flex-1 text-left">
                                <h3 className="text-textcolor-50">{currentCollection[modalIdx].productMark}</h3>
                                <p className="text-textcolor-50">Modelo: {currentCollection[modalIdx].productModel}</p>
                            </div>
                        </div>                        

                        <div className="absolute flex justfy-between gap-2 bottom-0 right-0 p-2 rounded-b-xl">
                            <a
                                href={`https://wa.me/5591985810208?text=Olá! Gostaria de reservar este modelo: ${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-textcolor-50 hover:text-textcolor-100 rounded-full shadow-lg py-2 px-4 font-bold text-xs transition-colors duration-300 ${!modalType ? "pointer-events-none opacity-50" : ""}`}
                            >
                                Reservar
                            </a>

                            {/* Botão Compartilhar nativo */}
                            {navigator.share && (
                                <button
                                    onClick={() => navigator.share({
                                        title: `Foto ${modalIdx + 1} - ${modalType}`,
                                        text: "Olha este modelo incrível!",
                                        url: shareUrl
                                    })}
                                    className={`inline-flex items-center justify-center bg-blue-600 hover:bg-b blue-700 text-textcolor-50 hover:text-textcolor-100 rounded-full shadow-lg py-2 px-4 font-bold text-xs transition-colors duration-300 ${!modalType ? "pointer-events-none opacity-50" : ""}`}
                                >
                                    Compartilhar
                                </button>
                            )}
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
        </>
    );
}
