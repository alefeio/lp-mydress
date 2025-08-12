import { useState, useEffect } from "react";
import { GallerySection } from "./GallerySection";
import { collections } from "./Collections";
import { useGalleryNavigation } from "./useGalleryNavigation";
import { Product } from "types";
import { useRouter } from "next/router";
import ModalPhotos from "./ModalPhotos";

type CollectionKey = keyof typeof collections;

export default function DressesGallery() {
    const [modalType, setModalType] = useState<CollectionKey | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalIdx, setModalIdx] = useState(0);

    const router = useRouter();
    const { collection, id } = router.query;

    // Função para abrir modal atualizando URL com shallow routing
    const openModal = (index: number, type: CollectionKey) => {
        router.push(`/${type}/${index}`, undefined, { shallow: true, scroll: false });
    };

    // Função para fechar modal e resetar URL para raiz, também com shallow
    const closeModal = () => {
        setShowModal(false);
        setModalType(null);
        setModalIdx(0);
        router.push("/", undefined, { shallow: true });
    };

    // useEffect para abrir modal automaticamente ao detectar query params
    useEffect(() => {
        // Só executa quando collection e id são strings válidas
        if (typeof collection === "string" && typeof id === "string") {
            const colKey = collection as CollectionKey;
            const idx = Number(id);

            if (
                collections[colKey] &&
                !isNaN(idx) &&
                idx >= 0 &&
                idx < collections[colKey].length
            ) {
                setModalType(colKey);
                setModalIdx(idx);
                setShowModal(true);
            } else {
                closeModal();
            }
        }
        // Não chama closeModal() se query ainda não estiver disponível
    }, [collection, id]);

    const galleryMap: Record<
        CollectionKey,
        ReturnType<typeof useGalleryNavigation<Product>>
    > = {
        blueDresses: useGalleryNavigation<Product>(collections.blueDresses.length),
        blackDresses: useGalleryNavigation<Product>(collections.blackDresses.length),
        pinkDresses: useGalleryNavigation<Product>(collections.pinkDresses.length),
        greenDresses: useGalleryNavigation<Product>(collections.greenDresses.length),
        redDresses: useGalleryNavigation<Product>(collections.redDresses.length),
        orangeDresses: useGalleryNavigation<Product>(collections.orangeDresses.length),
        clutches: useGalleryNavigation<Product>(collections.clutches.length),
        midisBrancos: useGalleryNavigation<Product>(collections.midisBrancos.length),
        articles: useGalleryNavigation<Product>(collections.articles.length),
    };

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
                            Vestidos modernos, elegantes e sempre atualizados com as últimas
                            tendências.
                        </strong>
                    </p>

                    {Object.keys(collections).map((key) => {
                        const k = key as CollectionKey;
                        return (
                            <GallerySection
                                key={k}
                                title={k}
                                subtitle=""
                                description=""
                                collectionKey={k}
                                bgcolor="bg-gray-200"
                                buttonText="Ver Catálogo"
                                buttonHref={`https://wa.me//5591985810208?text=Olá! Gostaria do Catálogo de ${k}.`}
                                gallery={galleryMap[k]}
                                onOpenModal={(index) => openModal(index, k)}
                            />
                        );
                    })}
                </div>

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
