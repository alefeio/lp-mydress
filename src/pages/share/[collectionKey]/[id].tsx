import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { CollectionKey } from '../../../types'; 
import { collections } from 'components/Collections';
import { FaWhatsapp, FaHome } from 'react-icons/fa'; // Importando os ícones

interface SharePageProps {
  shareData: {
    title: string;
    description: string;
    imageUrl: string;
    collectionKey: string;
    id: string;
    productModel: string; // Adicionando o modelo para o botão do WhatsApp
    productMark: string; // Adicionando a marca para o botão do WhatsApp
  };
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { collectionKey, id } = context.params as { collectionKey: CollectionKey; id: string };

  const collection = collections[collectionKey];
  const product = collection?.items[parseInt(id)];

  if (!product || !('productMark' in product)) {
    return {
      notFound: true,
    };
  }

  const shareData = {
    title: `Vestido ${product.productModel} - ${product.productMark}`,
    description: `Confira este modelo incrível: ${product.productModel} da marca ${product.productMark}!`,
    imageUrl: product.img,
    collectionKey: collectionKey,
    id: id,
    productModel: product.productModel ?? '', // Passando o modelo
    productMark: product.productMark ?? '', // Passando a marca
  };

  return {
    props: {
      shareData,
    },
  };
};

export default function SharePage({ shareData }: SharePageProps) {
  const whatsappUrl = `https://wa.me//5591985810208?text=Olá! Gostaria de reservar o modelo ${encodeURIComponent(shareData.productModel)} - ${encodeURIComponent(shareData.productMark)}. Link para a foto: ${encodeURIComponent(`https://www.mydressbelem.com.br/share/${shareData.collectionKey}/${shareData.id}`)}`;
  const siteUrl = `https://www.mydressbelem.com.br/${shareData.collectionKey}/${shareData.id}`;

  return (
    <>
      <Head>
        <title>{shareData.title}</title>
        <meta property="og:title" content={shareData.title} />
        <meta property="og:description" content={shareData.description} />
        <meta property="og:image" content={shareData.imageUrl} />
        <meta property="og:url" content={`https://www.mydressbelem.com.br/share/${shareData.collectionKey}/${shareData.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold">{shareData.title}</h1>
        <p className="mt-2 text-gray-600">{shareData.description}</p>
        <img src={shareData.imageUrl} alt={shareData.title} className="mt-4 max-w-full h-auto" />

        <div className="flex gap-4 mt-8">
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg py-2 px-4 font-bold text-sm transition-colors duration-300"
                aria-label="Reservar via WhatsApp"
            >
                <FaWhatsapp className="w-5 h-5 mr-2 text-background-50" /> Falar no WhatsApp
            </a>

            <a
                href={siteUrl}
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg py-2 px-4 font-bold text-sm transition-colors duration-300"
                aria-label="Ir para o site"
            >
                <FaHome className="w-5 h-5 mr-2 text-background-50" /> Ver no site
            </a>
        </div>
      </div>
    </>
  );
}