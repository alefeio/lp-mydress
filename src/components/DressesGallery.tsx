import { useState, useEffect } from "react";
import { GallerySection } from "./GallerySection";
import { collections } from "./Collections";
import { useGalleryNavigation } from "./useGalleryNavigation";
import { BaseProduct, CollectionKey } from "./types"; // Ajuste o caminho conforme seu projeto
import { useRouter } from "next/router";
import ModalPhotos from "./ModalPhotos";

export default function DressesGallery() {
    const [modalType, setModalType] = useState<CollectionKey | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalIdx, setModalIdx] = useState(0);

    const router = useRouter();
    const { collection, id } = router.query;

    const openModal = (index: number, type: CollectionKey) => {
        router.push(`/${type}/${index}`, undefined, { shallow: true, scroll: false });
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType(null);
        setModalIdx(0);
        router.push("/", undefined, { shallow: true });
    };

    useEffect(() => {
        if (typeof collection === "string" && typeof id === "string") {
            const colKey = collection as CollectionKey;
            const idx = Number(id);

            // Acesso direto à coleção, sem a necessidade de getCollectionByKey
            const col = collections[colKey];

            if (col && idx >= 0 && idx < col.items.length && !isNaN(idx)) {
                setModalType(colKey);
                setModalIdx(idx);
                setShowModal(true);
            } else {
                closeModal();
            }
        }
    }, [collection, id]);

    // O objeto de galerias agora pode ser criado a partir de todas as chaves de `collections`
    const galleryMap: Record<CollectionKey, ReturnType<typeof useGalleryNavigation<BaseProduct>>> = {};
    (Object.keys(collections) as CollectionKey[]).forEach((key) => {
        const collectionItems = collections[key]?.items;
        const length = collectionItems ? collectionItems.length : 0;
        if (length > 0) {
            galleryMap[key] = useGalleryNavigation<BaseProduct>(length);
        }
    });

    return (
        <>
            <div id="colecao">&nbsp;</div>
            <section>
                <div className="my-16 text-center md:max-w-7xl mx-auto">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                        Conheça nossa Coleção
                    </h2>
                    <p className="border-t-2 border-textcolor-200 text-background-700 px-4 pt-6 w-fit m-auto">
                        <strong>
                            Vestidos modernos, elegantes e sempre atualizados com as últimas tendências.
                        </strong>
                    </p>
                </div>

                {/* Renderiza todas as coleções diretamente, sem precisar de `dresses` e `accessories` */}
                {Object.keys(collections).map((key) => {
                    const colKey = key as CollectionKey;
                    const col = collections[colKey];

                    if (!col) return null;

                    return (
                        <GallerySection
                            key={colKey}
                            // As props `title`, `subtitle`, etc., já estão disponíveis diretamente na coleção
                            title={col.title}
                            subtitle={col.subtitle}
                            description={col.description}
                            collectionKey={colKey}
                            bgcolor={col.bgcolor}
                            buttonText={col.buttonText}
                            buttonHref={`https://wa.me//5591985810208?text=Olá! Gostaria do Catálogo de ${col.title}.`}
                            gallery={galleryMap[colKey]}
                            onOpenModal={(index) => openModal(index, colKey)}
                        />
                    );
                })}

                {showModal && modalType && (
                    <ModalPhotos
                        modalType={modalType}
                        setModalIdx={setModalIdx}
                        setShowModal={setShowModal}
                        setModalType={setModalType}
                        modalIdx={modalIdx}
                        onClose={() => {
                            setShowModal(false);
                            setModalType(null);
                            router.push("/", undefined, { shallow: true, scroll: false });
                        }}
                    />
                )}
            </section>
        </>
    );
}