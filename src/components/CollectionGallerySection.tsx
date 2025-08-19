import React, { useCallback } from "react";
import { GallerySection } from "./GallerySection";
import { useGalleryNavigation } from "./useGalleryNavigation";
// Importação corrigida para ColecaoProps
import { ColecaoProps } from "types";

// Interface corrigida para usar ColecaoProps
interface CollectionGallerySectionProps {
    collection: ColecaoProps;
    openModal: (collectionSlug: string, itemSlug: string) => void;
}

function CollectionGallerySection({ collection, openModal }: CollectionGallerySectionProps) {
    if (!collection || collection.items.length === 0) {
        return null;
    }

    const gallery = useGalleryNavigation(collection.items.length);

    const handleOpenModal = useCallback(
        (collectionSlug: string, itemSlug: string) => {
            openModal(collectionSlug, itemSlug);
        },
        [openModal]
    );

    return (
        <GallerySection
            key={collection.slug}
            collection={collection}
            buttonHref={collection.buttonUrl || `https://wa.me/5591985810208?text=Olá! Gostaria do Catálogo de ${collection.title}.`}
            gallery={gallery}
            onOpenModal={handleOpenModal}
        />
    );
}

export default React.memo(CollectionGallerySection);