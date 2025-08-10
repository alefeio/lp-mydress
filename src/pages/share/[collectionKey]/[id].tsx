import { collections } from "components/Collections";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Product } from "types";

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

  // Busca na coleção correta
  const collection = collections[collectionKey as keyof typeof collections] as Product[];

  if (!collection) {
    return { notFound: true };
  }

  // Busca pelo id numericamente
  const dress = collection.find((d) => d.id === Number(id));

  if (!dress) {
    return { notFound: true };
  }

  const link = "https://www.mydressbelem.com.br";

  // Monta URL WhatsApp para reservar, usando fallback para productMark
  const whatsappUrl = `https://wa.me/5591985810208?text=Olá! Gostaria de reservar o modelo ${encodeURIComponent(
    dress.productModel || ""
  )} - ${encodeURIComponent(dress.productMark ?? "")} - ${link}`;

  return {
    props: {
      model: dress.productModel || "",
      mark: dress.productMark ?? "",
      img: dress.img || "",
      whatsappUrl,
    },
  };
};