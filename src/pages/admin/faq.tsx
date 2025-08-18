import AdminLayout from '@/components/admin/AdminLayout';
import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

interface FAQ {
  id: string;
  pergunta: string;
  resposta: string;
}

interface FaqPageProps {
  faqs: FAQ[];
}

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps<FaqPageProps> = async () => {
  const faqs = await prisma.fAQ.findMany({
    select: {
      id: true,
      pergunta: true,
      resposta: true,
    },
    orderBy: {
      pergunta: 'asc',
    },
  });
  return {
    props: {
      faqs,
    },
  };
};

const FaqPage = ({ faqs }: FaqPageProps) => {
  const [faqList, setFaqList] = useState(faqs);

  return (
    <AdminLayout>
      <h1 className="text-textcolor-900 text-3xl font-bold mb-6">Gerenciar Perguntas Frequentes</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Adicionar Nova FAQ</h2>
        {/* Formulário para adicionar FAQ irá aqui */}

        <h2 className="text-lg font-semibold mt-8 mb-4">FAQs Existentes</h2>
        {/* Lista de FAQs irá aqui */}
        {faqList.map((faq) => (
          <div key={faq.id} className="border-b last:border-b-0 py-4">
            <h3 className="text-lg font-bold">{faq.pergunta}</h3>
            <p className="text-graytone-700">{faq.resposta}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default FaqPage;