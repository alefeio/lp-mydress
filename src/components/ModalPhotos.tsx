// src/components/ModalPhotos.tsx

import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useRouter } from "next/router";
import Head from "next/head";
import { ZoomableImage } from "./ZoomableImage";
import { ModalHeaderFooter } from "./ModalHeaderFooter";
import { ColecaoItem, ColecaoProps } from "types";

interface ModalPhotosProps {
    colecoes: ColecaoProps[];
    modalType: string;
    modalIdx: number;
    setModalIdx: (idx: number | ((prevIdx: number) => number)) => void;
    setShowModal: (show: boolean) => void;
    onClose: () => void;
}

export default function ModalPhotos({
    colecoes,
    modalType,
    modalIdx,
    setModalIdx,
    setShowModal,
    onClose
}: ModalPhotosProps) {
    const router = useRouter();
    const [isSharing, setIsSharing] = useState(false);

    const colecaoAtual = colecoes.find(c => c.slug === modalType);
    const totalItens = colecaoAtual?.items.length || 0;

    const nextItem = () => {
        // Tipagem explícita para 'prevIdx'
        setModalIdx((prevIdx: number) => (prevIdx + 1) % totalItens);
    };

    const prevItem = () => {
        // Tipagem explícita para 'prevIdx'
        setModalIdx((prevIdx: number) => (prevIdx - 1 + totalItens) % totalItens);
    };

    // Fechar com a tecla ESC
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const itemAtual = colecaoAtual?.items[modalIdx];

    if (!itemAtual) {
        return null;
    }

    // Gerar a URL de compartilhamento corretamente
    const shareUrl = `${window.location.origin}/share/${colecaoAtual?.slug}/${itemAtual.slug}`;

    return (
        <>
            <Head>
                <title>{`Foto ${modalIdx + 1} - ${colecaoAtual?.title}`}</title>
                <meta
                    name="description"
                    content={`Confira este modelo da coleção ${colecaoAtual?.title}.`}
                />
                <meta property="og:title" content={`Foto ${modalIdx + 1} - ${colecaoAtual?.title}`} />
                <meta
                    property="og:description"
                    content={`Confira este modelo da coleção ${colecaoAtual?.title}.`}
                />
                <meta property="og:image" content={itemAtual.img} />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Foto ${modalIdx + 1} - ${colecaoAtual?.title}`} />
                <meta
                    name="twitter:description"
                    content={`Confira este modelo da coleção ${colecaoAtual?.title}.`}
                />
                <meta name="twitter:image" content={itemAtual.img} />
            </Head>

            <div
                className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div
                    className="relative w-full max-w-7xl h-full flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Botão de fechar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white z-50 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                    >
                        <AiOutlineClose size={24} />
                    </button>

                    {/* Container da imagem com o componente ZoomableImage */}
                    <div className="flex-grow flex items-center justify-center w-full my-8 md:my-0 overflow-hidden rounded-lg">
                        <ZoomableImage
                            src={itemAtual.img}
                            alt={`${itemAtual.productMark} - ${itemAtual.productModel}`}
                        />
                    </div>

                    {/* Controles de navegação (setas) */}
                    <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 w-full p-4">
                        <button
                            onClick={prevItem}
                            className="text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                        >
                            <SlArrowLeft size={24} />
                        </button>
                        <button
                            onClick={nextItem}
                            className="text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                        >
                            <SlArrowRight size={24} />
                        </button>
                    </div>

                    {/* Informações e Botões com o componente ModalHeaderFooter */}
                    <div className="flex flex-col items-center p-4 text-white text-center">
                        <ModalHeaderFooter
                            productMark={itemAtual.productMark}
                            productModel={itemAtual.productModel}
                            shareUrl={shareUrl}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}