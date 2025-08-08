import { Product } from "types";
import { collections } from "./Collections";
import { useGalleryNavigation } from "./useGalleryNavigation";

type GallerySectionProps = {
    title: string;
    subtitle: string;
    description: React.ReactNode;
    collectionKey: keyof typeof collections;
    buttonText: string;
    bgcolor: string;
    buttonHref: string;
    onOpenModal: (index: number, collectionKey: keyof typeof collections) => void;
    gallery: ReturnType<typeof useGalleryNavigation<Product>>;
};

export function GallerySection({
    title,
    subtitle,
    description,
    collectionKey,
    buttonText,
    bgcolor,
    buttonHref,
    onOpenModal,
    gallery,
}: GallerySectionProps) {
    const collection = collections[collectionKey] as Product[];

    return (
        <article className={`my-16`}>
            <div className="max-w-xs mx-auto mb-6 text-center md:max-w-7xl">
                <h2 className={`mb-6 font-bold rounded-xl ${bgcolor} text-background-50 px-4 py-2 w-fit m-auto`}>
                    {title}
                </h2>
                <p className="px-2 mb-6 text-bold text-black-200 font-semibold">{subtitle}</p>
                {description}
            </div>

            <div className="relative flex items-center justify-center overflow-hidden py-4 md:max-w-6xl mx-auto">
                <div className="flex gap-2 md:gap-4">
                    {gallery.getVisibleItems(collection).map((dress, idx) => {
                        const actualIndex = (gallery.index + idx - 1 + collection.length) % collection.length;
                        return (
                            <nav key={actualIndex}>
                                <div className={`${bgcolor} relative h-100 w-80 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 flex-shrink-0`}>
                                    <img
                                        src={dress.img}
                                        alt={`${dress.productMark} - ${dress.productModel}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => onOpenModal(actualIndex, collectionKey)}
                                        className="absolute top-2 right-2 cursor-pointer text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition"
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

                                    <div className="absolute flex justify-between items-end gap-2 bottom-0 left-0 w-full bg-gradient-to-t from-graytone-950/60 to-transparent p-4">
                                        <div className="font-semibold text-sm flex-1 text-left">
                                            <h3 className="text-textcolor-50">{dress.productMark}</h3>
                                            <h3 className="text-textcolor-50">Modelo: {dress.productModel}</h3>
                                        </div>

                                        <a
                                            href={`https://wa.me//5591985810208?text='Olá! Gostaria de reservar o modelo ${dress.productModel} - ${dress.productMark} - ${dress.cor}'`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="self-end inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-textcolor-50 hover:text-textcolor-100 rounded-full shadow-lg py-2 px-4 font-bold text-xs transition-colors duration-300"
                                        >
                                            Reservar
                                        </a>
                                    </div>
                                </div>
                            </nav>
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
            <a
                href={buttonHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center mx-auto mt-8 mb-12 bg-background-300 hover:bg-background-200 rounded-full shadow-lg py-2 px-4 font-bold text-sm transition-colors duration-300"
            >
                {buttonText}
            </a>
        </article>
    );
}
