import { GetServerSideProps } from "next";
import Head from "next/head";

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
      <p>Redirecionando para o WhatsApp...</p>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  // Aqui você pode buscar os dados do vestido por ID no seu array/BD
  const dresses = [
    { id: "1", productModel: "123", productMark: "Marca X", img: "https://seusite.com/images/dress1.jpg" },
    { id: "2", productModel: "456", productMark: "Marca Y", img: "https://seusite.com/images/dress2.jpg" },
  ];

  const dress = dresses.find((d) => d.id === id);

  if (!dress) {
    return { notFound: true };
  }

  const whatsappUrl = `https://wa.me/5591985810208?text=Olá! Gostaria de reservar o modelo ${dress.productModel} - ${dress.productMark}`;

  return {
    props: {
      model: dress.productModel,
      mark: dress.productMark,
      img: dress.img,
      whatsappUrl,
    },
  };
};