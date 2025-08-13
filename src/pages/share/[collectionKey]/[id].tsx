import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { CollectionKey } from '../../../types'; 
import { collections } from 'components/Collections';

interface SharePageProps {
  shareData: {
    title: string;
    description: string;
    imageUrl: string;
    collectionKey: string;
    id: string;
  };
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { collectionKey, id, v } = context.params as { collectionKey: CollectionKey; id: string; v?: string };

  const collection = collections[collectionKey];
  const product = collection?.items[parseInt(id)];

  if (!product || !('productMark' in product)) {
    return {
      notFound: true,
    };
  }

  // LÓGICA CORRIGIDA: Adicionando o timestamp à URL da imagem
  const imageUrlWithTimestamp = v ? `${product.img}?v=${v}` : product.img;

  const shareData = {
    title: `Vestido ${product.productModel} - ${product.productMark}`,
    description: `Confira este modelo incrível: ${product.productModel} da marca ${product.productMark}!`,
    imageUrl: imageUrlWithTimestamp,
    collectionKey: collectionKey,
    id: id,
  };

  return {
    props: {
      shareData,
    },
  };
};

export default function SharePage({ shareData }: SharePageProps) {
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
      </div>
    </>
  );
}