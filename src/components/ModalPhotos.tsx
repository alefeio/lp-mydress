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
        ? [itemAtual.img, ...(itemAtual.fotos?.map(f => f.img) || [])].filter(Boolean)
        : [];
    const totalPhotos = allMedia.length;
    const currentMediaUrl = allMedia[currentPhotoIdx] || itemAtual?.img || '';


    // Resetar o índice da foto ao trocar de item
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


    // --- FUNÇÕES DE NAVEGAÇÃO DE FOTOS ---

    const nextPhoto = useCallback(() => {
        if (currentPhotoIdx < totalPhotos - 1) {
            setCurrentPhotoIdx(prev => prev + 1);
        } else {
            // Se for a última foto, navega para o próximo ColecaoItem
            nextModalItem();
        }
    }, [currentPhotoIdx, totalPhotos]);

    const prevPhoto = useCallback(() => {
        if (currentPhotoIdx > 0) {
            setCurrentPhotoIdx(prev => prev - 1);
        } else {
            // Se for a primeira foto, navega para o ColecaoItem anterior
            prevModalItem();
        }
    }, [currentPhotoIdx]);


    // --- FUNÇÕES DE NAVEGAÇÃO ENTRE ITENS (ColecaoItem) ---

    // Renomeadas para serem chamadas internamente
    const nextModalItem = useCallback(() => {
        setModalIdx((prevIdx: number) => (prevIdx + 1) % totalItens);
    }, [totalItens, setModalIdx]);

    const prevModalItem = useCallback(() => {
        setModalIdx((prevIdx: number) => (prevIdx - 1 + totalItens) % totalItens);
    }, [totalItens, setModalIdx]);


    // --- KEYBOARD LISTENER ADAPTADO ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowRight") {
                // Ao pressionar a direita, tenta ir para a próxima foto ou próximo item
                nextPhoto();
            } else if (e.key === "ArrowLeft") {
                // Ao pressionar a esquerda, tenta ir para a foto anterior ou item anterior
                prevPhoto();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, nextPhoto, prevPhoto]);


    const handleLike = async (itemId: string) => {
        // ... (lógica de like mantida)
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

    // Apenas mostrar as setas se houver mais de uma foto neste item
    const showPhotoNavigation = totalPhotos > 1;

    return (
        <>
            <Head>
                <title>{`Foto ${currentPhotoIdx + 1} de ${totalPhotos} - ${colecaoAtual?.title}`}</title>
                <meta
                    name="description"
                    content={`Confira este modelo da coleção ${colecaoAtual?.title}.`}
                />
                <meta property="og:title" content={`Foto ${currentPhotoIdx + 1} de ${totalPhotos} - ${colecaoAtual?.title}`} />
                <meta
                    property="og:description"
                    content={`Confira este modelo da coleção ${colecaoAtual?.title}.`}
                />
                <meta property="og:image" content={currentMediaUrl} />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`Foto ${currentPhotoIdx + 1} de ${totalPhotos} - ${colecaoAtual?.title}`} />
                <meta
                    name="twitter:description"
                    content={`Confira este modelo da coleção ${colecaoAtual?.title}.`}
                />
                <meta name="twitter:image" content={currentMediaUrl} />
            </Head>

            {/* Container do modal: remove o padding no mobile e o aplica em telas maiores */}
            <div
                className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center p-0 md:p-4"
                onClick={onClose}
            >
                {/* Container do conteúdo: agora ocupa 100% da largura em mobile */}
                <div
                    className="relative w-fit h-full flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Botão de fechar: reduz a margem para ficar mais próximo da borda em mobile */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-background-100 z-50 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                    >
                        <AiOutlineClose size={24} className="text-background-100" />
                    </button>

                    {/* Container da imagem: remove a margem vertical para maximizar o espaço */}
                    <div className="flex-grow flex items-center justify-center w-full overflow-hidden">
                        <ZoomableImage
                            // ALTERADO: Agora usa a URL da foto atual (currentMediaUrl)
                            src={currentMediaUrl}
                            alt={`${itemAtual.productMark} - ${itemAtual.productModel} - Foto ${currentPhotoIdx + 1}`}
                        />
                    </div>

                    {/* Controles de navegação (setas): ADAPTADO para navegar entre as FOTOS do item */}
                    {showPhotoNavigation && (
                        <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 w-full p-2">
                            <button
                                // ALTERADO: Chama prevPhoto
                                onClick={prevPhoto}
                                className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                                aria-label="Foto anterior"
                            >
                                <SlArrowLeft size={24} className="text-background-100" />
                            </button>
                            <button
                                // ALTERADO: Chama nextPhoto
                                onClick={nextPhoto}
                                className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors"
                                aria-label="Próxima foto"
                            >
                                <SlArrowRight size={24} className="text-background-100" />
                            </button>
                        </div>
                    )}

                    {/* Indicador de fotos (Opcional, mas útil) */}
                    {showPhotoNavigation && (
                        <div className="absolute top-2 left-4 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm z-50">
                            {`${currentPhotoIdx + 1} / ${totalPhotos}`}
                        </div>
                    )}


                    {/* Informações e Botões */}
                    <div className="flex flex-col items-center text-background-100 text-center w-full">
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