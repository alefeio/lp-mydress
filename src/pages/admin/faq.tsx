import { PrismaClient } from '@prisma/client';
import AdminLayout from 'components/admin/AdminLayout';
import { GetServerSideProps } from 'next';
import { useState, FormEvent, useEffect } from 'react';

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
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFaqList(faqs);
  }, [faqs]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = editId ? 'PUT' : 'POST';
    const url = '/api/crud/faqs';
    const body = JSON.stringify({
      id: editId,
      pergunta,
      resposta,
    });

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.ok) {
        setPergunta('');
        setResposta('');
        setEditId(null);
        const newFaqs = await response.json();
        setFaqList(newFaqs);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao salvar a FAQ.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/crud/faqs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        const newFaqs = await response.json();
        setFaqList(newFaqs);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erro ao excluir a FAQ.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (faq: FAQ) => {
    setPergunta(faq.pergunta);
    setResposta(faq.resposta);
    setEditId(faq.id);
  };

  return (
    <AdminLayout>
      <h1 className="text-textcolor-900 text-3xl font-bold mb-6 text-textcolor-50">Gerenciar Perguntas Frequentes</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">{editId ? 'Editar FAQ' : 'Adicionar Nova FAQ'}</h2>
        {error && <div className="bg-red-200 text-red-800 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-graytone-700">Pergunta</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-graytone-700">Resposta</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              rows={4}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-textcolor-50 bg-background-500 hover:bg-background-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading}
          >
            {loading ? 'Salvando...' : editId ? 'Salvar Alterações' : 'Adicionar FAQ'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setPergunta('');
                setResposta('');
                setEditId(null);
              }}
              className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-graytone-600 hover:bg-graytone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-graytone-500"
            >
              Cancelar
            </button>
          )}
        </form>

        <h2 className="text-lg font-semibold mt-8 mb-4">FAQs Existentes</h2>
        <div className="border rounded-md">
          {faqList.map((faq) => (
            <div key={faq.id} className="border-b last:border-b-0 py-4 px-6 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold">{faq.pergunta}</h3>
                <p className="text-graytone-700 mt-1 whitespace-pre-line">{faq.resposta}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEditClick(faq)}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default FaqPage;