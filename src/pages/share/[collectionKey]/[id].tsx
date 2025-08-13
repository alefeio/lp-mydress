import { collections } from "components/Collections";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Collection, CollectionKey } from "types";

type Props = {
    model: string;
    mark: string;
    img: string;
    whatsappUrl: string;
};

export default function SharePage({ model, mark, img, whatsappUrl }: Props) {
    return (
        <>
            <Head>
                {/* Open Graph para o WhatsApp */}
                <meta property="og:title" content={`${mark} - Modelo ${model}`} />
                <meta property="og:description" content={`Confira este vestido: ${mark} - Modelo ${model}`} />
                <meta property="og:image" content={img} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={whatsappUrl} />
            </Head>
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                <p className="text-xl">Redirecionando para o WhatsApp...</p>
                <p className="mt-2 text-gray-500">Se o redirecionamento não funcionar, <a href={whatsappUrl} className="text-blue-600 hover:underline">clique aqui</a>.</p>
            </div>
            {/* Opcional: redirecionar automaticamente */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.location.href = "${whatsappUrl}";`,
                }}
            />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id, collectionKey } = context.query;

    if (typeof id !== "string" || typeof collectionKey !== "string") {
        return { notFound: true };
    }

    // Acessa o objeto da coleção e não um array direto
    const collectionData: Collection = collections[collectionKey as CollectionKey];

    if (!collectionData) {
        return { notFound: true };
    }

    // Busca o produto no array 'items' da coleção
    const dress = collectionData.items[parseInt(id as string, 10)];

    if (!dress) {
        return { notFound: true };
    }

    // Link para a página de compartilhamento
    const shareLink = `https://www.mydressbelem.com.br/share/${collectionKey}/${id}`;

    // Monta URL WhatsApp
    const whatsappUrl = `https://wa.me/5591985810208?text=Olá! Gostaria de reservar o modelo ${encodeURIComponent(
        dress.productModel || ""
    )} - ${encodeURIComponent(dress.productMark ?? "")} - ${shareLink}`;

    return {
        props: {
            model: dress.productModel || "",
            mark: dress.productMark ?? "",
            img: dress.img || "",
            whatsappUrl,
        },
    };
};