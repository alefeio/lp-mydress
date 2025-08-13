import Head from 'next/head';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { DressesGallery, DressesGalleryProps } from '../../components/DressesGallery';
import { ModalHeaderFooter, ModalHeaderFooterProps } from '../../components/ModalHeaderFooter';
import { products } from '../../_data/products';

interface SharePageProps {
  shareData: {
    title: string;
    description: string;
    imageUrl: string;
  };
  galleryProps: DressesGalleryProps;
  modalProps: ModalHeaderFooterProps;
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { collectionKey, id } = context.params as { collectionKey: string; id: string };

  const product = products[collectionKey]?.find(p => p.id === parseInt(id));

  if (!product) {
    return {
      notFound: true,
    };
  }

  const shareData = {
    title: `Vestido ${product.productModel} - ${product.productMark}`,
    description: `Confira este modelo incrível: ${product.productModel} da marca ${product.productMark}!`,
    imageUrl: product.image, // A URL da imagem que você quer exibir
  };

  const galleryProps: DressesGalleryProps = {
    // Passar props necessárias para o DressesGallery, se houver
  };

  const modalProps: ModalHeaderFooterProps = {
    productMark: product.productMark,
    productModel: product.productModel,
    shareUrl: `/share/${collectionKey}/${id}`, // A URL de compartilhamento será a URL desta própria página
    modalIdx: parseInt(id),
    modalType: collectionKey,
  };

  return {
    props: {
      shareData,
      galleryProps,
      modalProps,
    },
  };
};

export default function SharePage({ shareData, galleryProps, modalProps }: SharePageProps) {
  return (
    <>
      <Head>
        <title>{shareData.title}</title>
        <meta property="og:title" content={shareData.title} />
        <meta property="og:description" content={shareData.description} />
        <meta property="og:image" content={shareData.imageUrl} />
        <meta property="og:url" content={`https://www.mydressbelem.com.br/share/${shareData.modalType}/${shareData.modalIdx}`} /> {/* Substitua com a URL real do seu site */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      {/* Aqui você pode renderizar um componente que exibe a foto e os detalhes do vestido */}
      {/* Exemplo: */}
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold">{shareData.title}</h1>
        <p className="mt-2 text-gray-600">{shareData.description}</p>
        <img src={shareData.imageUrl} alt={shareData.title} className="mt-4 max-w-full h-auto" />
        {/* Adicione o rodapé se desejar */}
        <ModalHeaderFooter {...modalProps} />
      </div>
    </>
  );
}