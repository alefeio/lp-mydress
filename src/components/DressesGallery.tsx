import { useRef, useState } from "react";
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

    const openModal = (index: number, type: CollectionKey) => {
        setModalIdx(index);
        setModalType(type);
        setShowModal(true);
    };

    const galleryMap: Record<CollectionKey, ReturnType<typeof useGalleryNavigation<Product>>> = {
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
        <section id="colecao">
            <div className="mt-[4.7rem] md:mt-[7.1rem] mb-32 text-center md:max-w-7xl mx-auto">
                <div className="my-8">
                    <div className="my-16 max-w-xs md:max-w-7xl mx-auto">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Conheça nossa Coleção</h2>
                        <p className="border-t-2 border-textcolor-200 text-background-700 px-4 py-6 w-fit m-auto">
                            <strong>Vestidos modernos, elegantes e sempre atualizados com as últimas tendências.</strong>
                        </p>
                    </div>

                    {(
                        [
                            {
                                key: "blueDresses",
                                title: "Vestidos Azuis",
                                subtitle: "Tons que transmitem elegância e serenidade",
                                description: (
                                    <>
                                        <p className="px-2 text-sm">
                                            Os vestidos azuis são perfeitos para quem deseja um look sofisticado, seja para eventos diurnos ou noturnos.
                                        </p>
                                        <p className="px-2 text-sm">
                                            Do azul claro ao marinho, escolha o tom que mais combina com você.
                                        </p>
                                    </>
                                ),
                                bgcolor: "bg-blue-500",
                                buttonText: "Solicitar Catálogo de Vestidos Azuis",
                            },
                            {
                                key: "blackDresses",
                                title: "Vestidos Pretos",
                                subtitle: "Clássicos, atemporais e indispensáveis",
                                description: (
                                    <p className="px-2 text-sm">
                                        Os vestidos pretos são sinônimo de versatilidade e poder. Ideal para ocasiões formais, jantares <br /> ou para aquele evento em que você quer se destacar com discrição e estilo.
                                    </p>
                                ),
                                bgcolor: "bg-black/90",
                                buttonText: "Solicitar Catálogo de Vestidos Pretos",
                            },
                            {
                                key: "greenDresses",
                                title: "Vestidos Verdes",
                                subtitle: "Inspira frescor e elegância",
                                description: (
                                    <p className="px-2 text-sm">
                                        Os vestidos verdes trazem frescor, leveza e modernidade. Desde o verde-menta ao esmeralda, <br />
                                        eles são ideais para eventos ao ar livre ou produções mais ousadas e elegantes, destacando-se o verde oliva, muito requisitado para madrinhas de casamento, no momento.
                                    </p>
                                ),
                                bgcolor: "bg-green-700",
                                buttonText: "Solicitar Catálogo de Vestidos Verdes",
                            },
                            {
                                key: "pinkDresses",
                                title: "Vestidos Rosas",
                                subtitle: "Delicadeza com atitude",
                                description: (
                                    <>
                                        <p className="px-2 text-sm">Os vestidos rosas vão do tom pastel ao pink vibrante, oferecendo opções românticas, femininas e cheias de personalidade.</p>
                                        <p className="px-2 text-sm">Perfeitos para celebrações especiais ou looks casuais com charme.</p>
                                    </>
                                ),
                                bgcolor: "bg-pink-700",
                                buttonText: "Solicitar Catálogo de Vestidos Rosas",
                            },
                            {
                                key: "redDresses",
                                title: "Vestidos Vermelhos",
                                subtitle: "Para mulheres que não passam despercebidas",
                                description: (
                                    <p className="px-2 text-sm">
                                        Os vestidos vermelhos são sensuais, marcantes e cheios de energia. Uma escolha poderosa para festas, encontros ou qualquer ocasião em que você queira ser lembrada.
                                    </p>
                                ),
                                bgcolor: "bg-red-700",
                                buttonText: "Solicitar Catálogo de Vestidos Vermelhos",
                            },
                            {
                                key: "orangeDresses",
                                title: "Vestidos Laranjas",
                                subtitle: "Para mulheres cheias de vida e personalidade",
                                description: (
                                    <p className="px-2 text-sm">
                                        Os vestidos laranjas transmitem alegria, criatividade e espontaneidade. São perfeitos para quem deseja um visual vibrante e inesquecível em eventos diurnos, festas ao ar livre ou qualquer ocasião onde o brilho da sua energia deve ser destaque.
                                    </p>
                                ),
                                bgcolor: "bg-orange-600",
                                buttonText: "Solicitar Catálogo de Vestidos Laranjas",
                            },
                            {
                                key: "midisBrancos",
                                title: "Midis Brancos",
                                subtitle: "Leves, sofisticados e cheios de significado",
                                description: (
                                    <>
                                        <p className="px-2 text-sm">Os vestidos midis brancos são ideais para momentos especiais como noivados, batizados, jantares ou celebrações ao ar livre.</p>
                                        <p className="px-2 text-sm">Transmitem pureza, delicadeza e elegância em cada detalhe.</p>
                                    </>
                                ),
                                bgcolor: "bg-midis-300",
                                buttonText: "Solicitar Catálogo de Midis Brancos",
                            },
                            {
                                key: "clutches",
                                title: "Clutches",
                                subtitle: "O toque final perfeito para qualquer produção",
                                description: (
                                    <p className="px-2 text-sm">
                                        As clutches unem praticidade e estilo, elevando o seu look com charme e sofisticação. Modelos ideais para eventos, festas ou para transformar o básico em algo memorável.
                                    </p>
                                ),
                                bgcolor: "bg-clutches-1",
                                buttonText: "Solicitar Catálogo de Clutches",
                            },
                        ] as {
                            key: CollectionKey;
                            title: string;
                            subtitle: string;
                            description: React.ReactNode;
                            bgcolor: string;
                            buttonText: string;
                        }[]
                    ).map((section) => (
                        <GallerySection
                            key={section.key}
                            title={section.title}
                            subtitle={section.subtitle}
                            description={section.description}
                            collectionKey={section.key}
                            bgcolor={section.bgcolor}
                            buttonText={section.buttonText}
                            buttonHref={`https://wa.me//5591985810208?text=Olá! Gostaria do Catálogo de ${section.title}.`}
                            gallery={galleryMap[section.key]}
                            onOpenModal={openModal}
                        />
                    ))}
                </div>
            </div>

            {showModal && modalType && (
                <ModalPhotos
                    modalType={modalType}
                    setModalIdx={setModalIdx}
                    setShowModal={setShowModal}
                    setModalType={setModalType}
                    modalIdx={modalIdx}
                />
            )
            }

        </section >
    );
}
