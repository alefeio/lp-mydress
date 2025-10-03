import React, { useState, useEffect, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/router";
import Head from "next/head";
import { ZoomableImage } from "./ZoomableImage";
import { ModalHeaderFooter } from "./ModalHeaderFooter";
import { ColecaoItem, ColecaoProps } from "types"; // Presumindo que ColecaoItem tem 'img' e 'fotos' (ColecaoItemFoto[])

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
    const [currentItemStats, setCurrentItemStats] = useState<{ like: number | null | undefined; view: number | null | undefined }>({ like: null, view: null });

    // NOVO ESTADO: Índice da foto atual (0 é sempre a foto principal)
    const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

    const colecaoAtual = colecoes.find(c => c.slug === modalType);
    const totalItens = colecaoAtual?.items.length || 0;
    const itemAtual = colecaoAtual?.items[modalIdx];

    // Cria a lista completa de mídias (img principal + fotos adicionais)
    const allMedia = itemAtual
        // CORREÇÃO APLICADA: Troca 'f.img' por 'f.url' para resolver o erro de tipagem.
        ? [itemAtual.img, ...(itemAtual.fotos?.map(f => f.url) || [])].filter(Boolean)
        : [];
    const totalPhotos = allMedia.length;
    const currentMediaUrl = allMedia[currentPhotoIdx] || itemAtual?.img || '';


    // Resetar o índice da foto ao trocar de item e buscar stats
    useEffect(() => {
        setCurrentPhotoIdx(0);
        
        // Lógica de stats (mantida)
        const fetchStatsAndHandleView = async (itemId: string) => {
            try {
                const response = await fetch('/api/stats/item-view', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itemId }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setCurrentItemStats({ like: data.item.like, view: data.item.view });
                    }
                } else {
                    console.error('Falha ao registrar visualização:', response.status);
                }
            } catch (error) {
                console.error('Erro na API de visualização:', error);
            }
        };

        if (itemAtual) {
            setCurrentItemStats({ like: itemAtual.like, view: itemAtual.view });
            fetchStatsAndHandleView(itemAtual.id);
        }
    }, [itemAtual?.id]);


    // --- FUNÇÕES DE NAVEGAÇÃO ENTRE ITENS (ColecaoItem) ---

    // Navega para o próximo item da coleção
    const nextModalItem = useCallback(() => {
        // Encontra o próximo índice de item, fazendo o loop
        const nextIdx = (modalIdx + 1) % totalItens;
        setModalIdx(nextIdx);
    }, [totalItens, setModalIdx, modalIdx]);

    // Navega para o item anterior da coleção
    const prevModalItem = useCallback(() => {
        // Encontra o índice anterior, fazendo o loop
        const prevIdx = (modalIdx - 1 + totalItens) % totalItens;
        setModalIdx(prevIdx);
    }, [totalItens, setModalIdx, modalIdx]);

    
    // --- FUNÇÕES DE NAVEGAÇÃO DE FOTOS ---

    const nextPhoto = useCallback(() => {
        if (currentPhotoIdx < totalPhotos - 1) {
            // Se houver mais fotos no item atual, avança a foto
            setCurrentPhotoIdx(prev => prev + 1);
        } else {
            // Se for a última foto, navega para o próximo ColecaoItem
            nextModalItem();
        }
    }, [currentPhotoIdx, totalPhotos, nextModalItem]);

    const prevPhoto = useCallback(() => {
        if (currentPhotoIdx > 0) {
            // Se não for a primeira foto do item, volta a foto
            setCurrentPhotoIdx(prev => prev - 1);
        } else {
            // Se for a primeira foto, navega para o ColecaoItem anterior
            prevModalItem();
        }
    }, [currentPhotoIdx, prevModalItem]);


    // --- KEYBOARD LISTENER ADAPTADO ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowRight") {
                nextPhoto();
            } else if (e.key === "ArrowLeft") {
                prevPhoto();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, nextPhoto, prevPhoto]);


    const handleLike = async (itemId: string) => {
        try {
            const response = await fetch('/api/stats/item-like', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setCurrentItemStats({ like: data.item.like, view: data.item.view });
                }
            } else {
                console.error('Falha ao curtir item:', response.status);
            }
        } catch (error) {
            console.error('Erro na API de curtida:', error);
        }
    };

    if (!itemAtual) {
        return null;
    }

    const shareUrl = `${window.location.origin}/share/${colecaoAtual?.slug}/${itemAtual.slug}`;

    // Define se deve mostrar as setas de navegação de fotos
    // As setas internas devem aparecer se houver mais de uma foto na lista total de mídias (img + fotos adicionais).
    const showPhotoNavigation = totalPhotos > 1;

    return (
        <>
            <Head>
                {/* Título e Meta Tags adaptados para mostrar o número da foto */}
                <title>{`Foto ${currentPhotoIdx + 1} de ${totalPhotos} - ${colecaoAtual?.title}`}</title>
                <meta
                    name="description"
                    content={`Confira a foto ${currentPhotoIdx + 1} deste modelo da coleção ${colecaoAtual?.title}.`}
                />
                <meta property="og:title" content={`Foto ${currentPhotoIdx + 1} de ${totalPhotos} - ${colecaoAtual?.title}`} />
                <meta
                    property="og:description"
                    content={`Confira a foto ${currentPhotoIdx + 1} deste modelo da coleção ${colecaoAtual?.title}.`}
                />
                <meta property="og:image" content={currentMediaUrl} />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Foto ${currentPhotoIdx + 1} de ${totalPhotos} - ${colecaoAtual?.title}`} />
                <meta
                    name="twitter:description"
                    content={`Confira a foto ${currentPhotoIdx + 1} deste modelo da coleção ${colecaoAtual?.title}.`}
                />
                <meta name="twitter:image" content={currentMediaUrl} />
            </Head>

            <div
                className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center p-0 md:p-4"
                onClick={onClose}
            >
                <div
                    className="relative w-full max-w-7xl h-full flex flex-col items-center justify-center" // Ajustado para centralizar e ter um max-width
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Botão de fechar */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-background-100 z-50 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                        aria-label="Fechar Modal"
                    >
                        <AiOutlineClose size={24} className="text-background-100" />
                    </button>

                    {/* Container da imagem */}
                    <div className="flex-grow flex items-center justify-center w-full overflow-hidden h-full">
                        <ZoomableImage
                            src={currentMediaUrl}
                            alt={`${itemAtual.productMark} - ${itemAtual.productModel} - Foto ${currentPhotoIdx + 1}`}
                        />
                    </div>

                    {/* Controles de navegação (setas) */}
                    {showPhotoNavigation && (
                        <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 w-full p-2 sm:p-4">
                            <button
                                onClick={prevPhoto}
                                className="p-3 sm:p-4 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                                aria-label="Foto anterior"
                            >
                                <SlArrowLeft size={24} className="text-background-100" />
                            </button>
                            <button
                                onClick={nextPhoto}
                                className="p-3 sm:p-4 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                                aria-label="Próxima foto"
                            >
                                <SlArrowRight size={24} className="text-background-100" />
                            </button>
                        </div>
                    )}

                    {/* Indicador de fotos */}
                    {showPhotoNavigation && (
                        <div className="absolute top-2 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm z-50">
                            {`${currentPhotoIdx + 1} / ${totalPhotos}`}
                        </div>
                    )}


                    {/* Informações e Botões */}
                    <div className="flex flex-col items-center text-background-100 text-center w-full absolute bottom-0 bg-black bg-opacity-60 py-2">
                        <ModalHeaderFooter
                            productMark={itemAtual.productMark}
                            productModel={itemAtual.productModel}
                            size={itemAtual.size}
                            shareUrl={shareUrl}
                            likes={currentItemStats.like}
                            views={currentItemStats.view}
                            onLike={() => handleLike(itemAtual.id)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}