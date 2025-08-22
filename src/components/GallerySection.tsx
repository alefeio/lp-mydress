import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { FaWhatsapp, FaShareAlt } from "react-icons/fa";
import { ColecaoProps } from "types";

interface ColecaoItem {
    id: string; productMark: string; productModel: string; cor: string;
    img: string; slug: string; colecaoId: string;
}

type GallerySectionProps = {
    collection: ColecaoProps;
    buttonHref: string;
    onOpenModal: (collectionSlug: string, itemSlug: string) => void;
};

export function GallerySection({
    collection,
    buttonHref,
    onOpenModal
}: GallerySectionProps) {
    const galleryRef = useRef<HTMLDivElement>(null);
    const [canShare, setCanShare] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [originUrl, setOriginUrl] = useState('');

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(false);

    const checkScroll = () => {
        if (galleryRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
            // Verifica se não está no início
            setShowPrev(scrollLeft > 0);
            // Verifica se não está no final (com uma pequena margem de erro)
            setShowNext(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    const prev = () => {
        if (galleryRef.current) {
            galleryRef.current.scrollBy({ left: -320, behavior: 'smooth' });
        }
    };

    const next = () => {
        if (galleryRef.current) {
            galleryRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOriginUrl(window.location.origin);
            if ('share' in navigator) {
                setCanShare(true);
            }
        }

        const currentRef = galleryRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', checkScroll);
            checkScroll();
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', checkScroll);
            }
        };
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (galleryRef.current) {
            setIsDragging(true);
            setStartX(e.pageX - galleryRef.current.offsetLeft);
            setScrollLeft(galleryRef.current.scrollLeft);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !galleryRef.current) return;
        e.preventDefault();
        const x = e.pageX - galleryRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        galleryRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleShare = async (item: ColecaoItem, shareUrl: string) => {
        if (isSharing) return;

        setIsSharing(true);
        try {
            await navigator.share({
                title: `Vestido ${item.productModel ?? ''}`,
                text: `Confira este modelo incrível: ${item.productModel ?? ''} - ${item.productMark ?? ''}!`,
                url: shareUrl,
            });
        } catch (error) {
            console.error('Falha ao compartilhar:', error);
        } finally {
            setIsSharing(false);
        }
    };

    if (!collection) {
        return <p className="text-center py-8">Coleção não encontrada.</p>;
    }

    // ADICIONADO: Pega a URL da última foto da coleção ou usa uma imagem de fallback
    const lastItem = collection.items.length > 0 ? collection.items[collection.items.length - 1] : null;
    const backgroundImageUrl = lastItem ? lastItem.img : ''; // Substitua '' por uma URL de imagem padrão, se desejar.

    return (
        <article className="my-16">
            <div
                className="relative flex flex-col justify-center items-center mx-auto text-center md:max-w-full h-[50vh] bg-fixed bg-cover bg-center"
                // ADICIONADO: Atributo style dinâmico
                style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                <div className="relative z-10 flex flex-col justify-center items-center h-full">
                    <h2
                        className={`font-serif text-3xl mb-4 font-bold rounded-xl ${collection.bgcolor} text-background-50 px-4 py-2 w-fit`}
                    >
                        {collection.title}
                    </h2>
                </div>
            </div>
            <div className={`${collection.bgcolor} h-4`}></div>

            <div></div>
            <div className="grid bg-gradient-to-b relative flex items-center justify-center overflow-hidden py-16 md:max-w-6xl mx-auto from-background-200 to-transparent md:max-w-full">
                <div
                    className="absolute left-0 top-0 bottom-0 w-2 z-20 pointer-events-none
                               bg-gradient-to-r from-graytone-1000/20 to-transparent"
                />

                <div
                    className="absolute right-0 top-0 bottom-0 w-2 z-20 pointer-events-none
                               bg-gradient-to-l from-graytone-1000/20 to-transparent"
                />
                <h3 className="w-full px-2 font-semibold text-xl text-textcolor-800 text-center font-serif w-fit pb-12">
                    {collection.subtitle}
                </h3>

                <div
                    className="flex gap-2 md:gap-4 overflow-x-scroll scrollbar-hide"
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    ref={galleryRef}
                >
                    {collection.items.map(item => {
                        const shareUrl = `${originUrl}/share/${collection.slug}/${item.slug}`;
                        return (
                            <div
                                key={item.slug}
                                className={`${collection.bgcolor} relative h-100 w-80 rounded-xl overflow-hidden shadow-lg flex-shrink-0`}
                            >
                                <img
                                    src={item.img}
                                    alt={`${item.productMark ?? ""} - ${item.productModel ?? ""}`}
                                    className="w-full h-full object-cover cursor-pointer"
                                // onClick={() => onOpenModal(collection.slug, item.slug)}
                                />

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenModal(collection.slug, item.slug);
                                    }}
                                    className="absolute top-2 right-2 cursor-pointer z-50 text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition"
                                    aria-label="Ver produto"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                                        />
                                    </svg>
                                </button>

                                <div className="absolute flex justify-between items-end gap-2 bottom-0 left-0 w-full max-w-xs bg-gradient-to-t from-graytone-950/60 to-transparent p-4">
                                    <div className="font-semibold text-sm flex-1 text-left">
                                        <h3 className="text-textcolor-50">Tecido: {item.productMark}</h3>
                                        <h3 className="text-textcolor-50">Modelo: {item.productModel}</h3>
                                    </div>

                                    <div className="flex gap-2">
                                        <a
                                            href={`https://wa.me//5591985810208?text=Olá! Gostaria de reservar o modelo ${encodeURIComponent(item.productModel ?? "")} - ${encodeURIComponent(item.productMark ?? "")}. Link para a foto: ${encodeURIComponent(shareUrl)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-textcolor-50 hover:text-textcolor-100 rounded-full shadow-lg p-2 font-bold text-xs transition-colors duration-300"
                                            aria-label="Reservar via WhatsApp"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <FaWhatsapp className="w-5 h-5 text-background-50" />
                                        </a>

                                        {canShare && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShare(item, shareUrl);
                                                }}
                                                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-2 font-semibold text-sm transition-colors duration-300"
                                                aria-label="Compartilhar"
                                                disabled={isSharing}
                                            >
                                                <FaShareAlt className="w-5 h-5 text-background-50" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {showPrev && (
                    <button
                        type="button"
                        onClick={prev}
                        className="absolute left-0 z-30 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow-lg transition m-2"
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
                )}

                {showNext && (
                    <button
                        type="button"
                        onClick={next}
                        className="absolute right-0 z-30 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow-lg transition m-2"
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
                )}
            </div>

            <div className="py-4 w-fit mx-auto text-center flex flex-col">
                <p className="px-4 leading-6">
                    {collection.description}
                </p>
                <a
                    href={buttonHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="my-4 inline-flex items-center justify-center mx-auto mb-12 bg-background-300 hover:bg-background-200 rounded-full shadow-lg py-2 px-4 font-bold transition-colors duration-300"
                >
                    {collection.buttonText}
                </a>
            </div>
        </article>
    );
}