// DressesGallery.tsx

import { useState, useEffect } from "react";
import { GallerySection } from "./GallerySection";
import { useGalleryNavigation } from "./useGalleryNavigation";
import { useRouter } from "next/router";
import ModalPhotos from "./ModalPhotos";
import { BaseProduct, Collection } from "types";
import useSWR from 'swr';

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Erro ao buscar dados.');
    }
    return res.json();
};

export default function DressesGallery() {
    const [modalType, setModalType] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalIdx, setModalIdx] = useState(0);

    const router = useRouter();
    const { collectionId, id } = router.query;

    const { data: collections, error } = useSWR<Collection[]>('/api/crud/collections', fetcher);

    // Mapeia o array de coleções para um objeto para busca rápida
    const collectionsMap: Record<string, Collection> = collections ? collections.reduce((map, collection) => {
        map[collection.id] = collection;
        return map;
    }, {} as Record<string, Collection>) : {};

    function getCollectionById(id: string | null): Collection | null {
        return id ? collectionsMap[id] || null : null;
    }

    const openModal = (index: number, collectionId: string) => {
        router.push(`/${collectionId}/${index}`, undefined, { shallow: true, scroll: false });
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType(null);
        setModalIdx(0);
        router.push("/", undefined, { shallow: true });
    };

    useEffect(() => {
        if (typeof collectionId === "string" && typeof id === "string" && collections) {
            const col = getCollectionById(collectionId);
            const idx = Number(id);

            if (col && idx >= 0 && idx < col.items.length && !isNaN(idx)) {
                setModalType(collectionId);
                setModalIdx(idx);
                setShowModal(true);
            } else {
                closeModal();
            }
        }
    }, [collectionId, id, collections]);

    if (error) return <p className="text-center py-8">Falha ao carregar as coleções.</p>;
    if (!collections) return <p className="text-center py-8">Carregando...</p>;

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
                            Vestidos modernos, elegantes, acessíveis e sempre atualizados com as últimas tendências.
                        </strong>
                    </p>
                </div>

                {collections.map((collection: Collection) => {
                    const gallery = useGalleryNavigation<BaseProduct>(collection.items.length);

                    if (!collection || collection.items.length === 0) return null;

                    return (
                        <GallerySection
                            key={collection.id}
                            collection={collection}
                            buttonHref={`https://wa.me//5591985810208?text=Olá! Gostaria do Catálogo de ${collection.title}.`}
                            gallery={gallery}
                            onOpenModal={(index) => openModal(index, collection.id)}
                        />
                    );
                })}

                {showModal && modalType && (
                    <ModalPhotos
                        collections={collections}
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