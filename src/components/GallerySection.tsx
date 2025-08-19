import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaWhatsapp, FaShareAlt } from "react-icons/fa";
import { useGalleryNavigation } from "./useGalleryNavigation";

interface ColecaoItem {
    id: string; productMark: string; productModel: string; cor: string;
    img: string; slug: string; colecaoId: string;
}
interface ColecaoProps {
    id: string; title: string; subtitle: string | null; description: string | null;
    bgcolor: string | null; buttonText: string | null; buttonUrl: string | null;
    slug: string; items: ColecaoItem[];
}

type GallerySectionProps = {
    collection: ColecaoProps;
    buttonHref: string;
    gallery: ReturnType<typeof useGalleryNavigation>;
    onOpenModal: (collectionSlug: string, itemSlug: string) => void;
};

export function GallerySection({
    collection,
    buttonHref,
    gallery,
    onOpenModal
}: GallerySectionProps) {
    const [canShare, setCanShare] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [originUrl, setOriginUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOriginUrl(window.location.origin);
            if ('share' in navigator) {
                setCanShare(true);
            }
        }
    }, []);

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

    return (
        <article className="my-16">
            <div className="max-w-xs mx-auto text-center md:max-w-7xl">
                <h2
                    className={`mb-6 font-bold rounded-xl ${collection.bgcolor} text-background-50 px-4 py-2 w-fit m-auto`}
                >
                    {collection.title}
                </h2>
                <h3 className="px-2 font-semibold text-black">{collection.subtitle}</h3>
            </div>

            <div className="relative flex items-center justify-center overflow-hidden py-4 md:max-w-6xl mx-auto">
                <div className="flex gap-2 md:gap-4">
                    {/* A asserção de tipo é aplicada à chamada da função getVisibleItems */}
                    {(gallery.getVisibleItems(collection.items) as (ColecaoItem | null)[]).map(item => {
                        if (!item) return null;
                        const shareUrl = `${originUrl}/colecoes/${collection.slug}/${item.slug}`;

                        return (
                            <div
                                key={item.slug}
                                className={`${collection.bgcolor} relative h-100 w-80 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 flex-shrink-0`}
                            >
                                <img
                                    src={item.img}
                                    alt={`${item.productMark ?? ""} - ${item.productModel ?? ""}`}
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => onOpenModal(collection.slug, item.slug)}
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
                                        <h3 className="text-textcolor-50">{item.productMark}</h3>
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

                <button
                    type="button"
                    onClick={gallery.prev}
                    className="absolute left-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow-lg transition m-2"
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
                    onClick={gallery.next}
                    className="absolute right-0 z-10 bg-background-100 bg-opacity-80 hover:bg-background-200 rounded-full p-2 shadow-lg transition m-2"
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

            <div className="py-4 w-fit mx-auto text-center flex flex-col">
                {collection.description}
                <a
                    href={buttonHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="my-4 inline-flex items-center justify-center mx-auto mb-12 bg-background-300 hover:bg-background-200 rounded-full shadow-lg py-2 px-4 font-bold text-sm transition-colors duration-300"
                >
                    {collection.buttonText}
                </a>
            </div>
        </article>
    );
}