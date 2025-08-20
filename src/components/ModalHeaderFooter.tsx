import React, { useEffect, useState } from 'react';
import { FaWhatsapp, FaShareAlt } from "react-icons/fa";

interface ModalHeaderFooterProps {
    productMark?: string;
    productModel?: string;
    shareUrl: string;
}

export const ModalHeaderFooter = ({
    productMark,
    productModel,
    shareUrl,
}: ModalHeaderFooterProps) => {
    const [canShare, setCanShare] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'share' in navigator) {
            setCanShare(true);
        }
    }, []);

    const handleShare = async () => {
        if (isSharing || !canShare) return;

        setIsSharing(true);
        try {
            await navigator.share({
                title: `Vestido ${productModel || ''}`,
                text: `Confira este modelo incrível: ${productModel || ''} - ${productMark || ''}!`,
                url: shareUrl,
            });
        } catch (error) {
            console.error('Falha ao compartilhar:', error);
        } finally {
            setIsSharing(false);
        }
    };

    return (
        <div className="w-full flex-shrink-0 flex justify-between items-center bg-background-200 gap-4 text-white p-4 rounded-b-xl z-30">
            <div className="flex flex-col text-left">
                <h3 className="font-semibold text-lg">Tecido: {productMark || 'Sem Marca'}</h3>
                <p className="text-sm mt-1">Modelo: {productModel || 'Sem Modelo'}</p>
            </div>
            <div className="flex gap-2">
                <a
                    // AQUI: A URL de compartilhamento é adicionada à mensagem do WhatsApp
                    href={`https://wa.me/5591985810208?text=Olá! Gostaria de reservar o modelo ${encodeURIComponent(productModel || '')} - ${encodeURIComponent(productMark || '')}. Link para a foto: ${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg p-3 font-bold text-sm transition-colors duration-300"
                    aria-label="Reservar via WhatsApp"
                >
                    <FaWhatsapp className="w-6 h-6 text-white" />
                </a>

                {canShare && (
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-3 font-semibold text-sm transition-colors duration-300"
                        aria-label="Compartilhar"
                        disabled={isSharing}
                    >
                        <FaShareAlt className="w-6 h-6 text-white" />
                    </button>
                )}
            </div>
        </div>
    );
};