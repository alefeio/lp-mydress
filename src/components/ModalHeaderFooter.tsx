import { FaWhatsapp, FaShareAlt } from 'react-icons/fa';
import { ModalHeaderFooterProps } from 'types';

export function ModalHeaderFooter({
    productMark,
    productModel,
    shareUrl,
    modalIdx,
    modalType,
}: ModalHeaderFooterProps) {
    return (
        <>
            {/* Rodapé fixo com Reservar e Compartilhar */}
            <div className="sticky bottom-0 bg-background-50 rounded-b-xl px-6 py-4 flex justify-center gap-4 select-none z-30">
                {/* Botão de Reservar */}
                <a
                    href={`https://wa.me/5591985810208?text=Olá! Gostaria de reservar este modelo: ${encodeURIComponent(
                        shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg p-2 font-semibold text-sm transition-colors duration-300"
                    aria-label="Reservar via WhatsApp"
                >
                    <FaWhatsapp className="w-7 h-7 text-background-50" />
                </a>

                {navigator.share && (
                    <button
                        onClick={() =>
                            navigator.share({
                                title: `Foto ${modalIdx + 1} - ${modalType}`,
                                text: "Olha este modelo incrível!",
                                url: shareUrl,
                            })
                        }
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-3 font-semibold text-sm transition-colors duration-300"
                        aria-label="Compartilhar"
                    >
                        <FaShareAlt className="w-5 h-5 text-background-50" />
                    </button>
                )}
            </div>
        </>
    );
}