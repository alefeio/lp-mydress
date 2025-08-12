import { useEffect, useState } from "react";
import { Product } from "types";
import { collections } from "./Collections";
import Head from "next/head";
import { useRouter } from "next/router";
import { ZoomableImage } from "./ZoomableImage";
import { ModalHeaderFooter } from "./ModalHeaderFooter";

type CollectionKey = keyof typeof collections;

interface ModalPhotosProps {
    modalType: CollectionKey | null;
    setModalIdx: React.Dispatch<React.SetStateAction<number>>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setModalType: React.Dispatch<React.SetStateAction<CollectionKey | null>>;
    modalIdx: number;
    onClose: () => void;
}

function getCollectionByKey(key: CollectionKey | null): Product[] {
    return key ? collections[key] : [];
}

export default function ModalPhotos({
    modalType,
    setModalIdx,
    setShowModal,
    setModalType,
    modalIdx,
    onClose,
}: ModalPhotosProps) {
    const router = useRouter();
    const [shareUrl, setShareUrl] = useState("");
    const currentCollection = getCollectionByKey(modalType);

    useEffect(() => {
        if (modalType !== null) {
            router.replace(`/${modalType}/${modalIdx}`, undefined, { shallow: true });
            setShareUrl(`${window.location.origin}/${modalType}/${modalIdx}`);
        }
    }, [modalIdx, modalType, router]);

    if (currentCollection.length === 0) return null;

    const product = currentCollection[modalIdx];

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

    return (
        <>
            <Head>
                <title>{`Foto ${modalIdx + 1} - ${modalType}`}</title>
                <meta
                    name="description"
                    content={`Confira este modelo da coleção ${modalType}.`}
                />
                <meta property="og:title" content={`Foto ${modalIdx + 1} - ${modalType}`} />
                <meta
                    property="og:description"
                    content={`Confira este modelo da coleção ${modalType}.`}
                />
                <meta property="og:image" content={product.img} />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Foto ${modalIdx + 1} - ${modalType}`} />
                <meta
                    name="twitter:description"
                    content={`Confira este modelo da coleção ${modalType}.`}
                />
                <meta name="twitter:image" content={product.img} />
            </Head>

            <div
                className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
                onClick={onClose}
            >
                <div
                    className="relative bg-background-100 rounded-xl shadow-2xl max-w-[95vw] max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: "min(900px, 100%)" }}
                >
                    {/* Botão fechar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black/80 rounded-full p-2 transition z-50"
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

                    {/* Cabeçalho fixo */}
                    <div className="sticky top-0 bg-background-200 text-white px-6 py-4 rounded-t-xl text-center select-none z-30">
                        <h3 className="text-2xl font-semibold">{product.productMark}</h3>
                        <p className="text-sm mt-1">Modelo: {product.productModel}</p>
                    </div>

                    <ZoomableImage
                        src={product.img}
                        alt={`${product.productMark} - ${product.productModel}`}
                    />

                    <ModalHeaderFooter
                        productMark={product.productMark}
                        productModel={product.productModel}
                        shareUrl={shareUrl}
                        modalIdx={modalIdx}
                        modalType={modalType}
                    />

                    {/* Botões de navegação */}
                    <button
                        onClick={modalPrev}
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition z-50"
                        aria-label="Anterior"
                    >
                        <svg
                            className="w-6 h-6 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={modalNext}
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition z-50"
                        aria-label="Próximo"
                    >
                        <svg
                            className="w-6 h-6 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </>
    );
}
