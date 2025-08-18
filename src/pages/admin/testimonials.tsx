// src/pages/admin/testimonials.tsx

import { useState, useEffect, FormEvent } from 'react';
import { useSession } from 'next-auth/react';
import AdminLayout from '../../components/admin/AdminLayout';
import { FaTrash, FaEdit, FaPlus, FaCamera, FaVideo, FaAlignLeft } from 'react-icons/fa';

interface Testimonial {
  id: string;
  name: string;
  type: 'TEXT' | 'PHOTO' | 'VIDEO';
  content: string;
  createdAt: string;
}

export default function TestimonialsAdmin() {
  const { data: session, status } = useSession();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<'TEXT' | 'PHOTO' | 'VIDEO'>('TEXT');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crud/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      } else {
        setMessage('Erro ao carregar depoimentos.');
      }
    } catch (error) {
      setMessage('Erro ao carregar depoimentos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchTestimonials();
    }
  }, [session]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!session || session.user?.role !== 'ADMIN') {
      setMessage('Acesso não autorizado.');
      setLoading(false);
      return;
    }

    // Lógica para upload de imagem ou vídeo (se necessário)
    // Para simplificar, assumimos que o conteúdo é uma URL ou texto
    let contentToSave = content;

    const method = editingId ? 'POST' : 'POST'; // A API usa POST para criação e edição
    const url = '/api/crud/testimonials';
    const body = JSON.stringify({
      id: editingId,
      name,
      type,
      content: contentToSave,
    });

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (res.ok) {
        setMessage(`Depoimento ${editingId ? 'editado' : 'criado'} com sucesso!`);
        setName('');
        setType('TEXT');
        setContent('');
        setEditingId(null);
        fetchTestimonials(); // Recarrega a lista
      } else {
        setMessage(`Erro ao ${editingId ? 'editar' : 'criar'} o depoimento.`);
      }
    } catch (error) {
      setMessage(`Erro ao ${editingId ? 'editar' : 'criar'} o depoimento.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setName(testimonial.name);
    setType(testimonial.type);
    setContent(testimonial.content);
    setEditingId(testimonial.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este depoimento?')) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/crud/testimonials?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessage('Depoimento excluído com sucesso!');
        fetchTestimonials();
      } else {
        setMessage('Erro ao excluir o depoimento.');
      }
    } catch (error) {
      setMessage('Erro ao excluir o depoimento.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return <p>Carregando...</p>;
  if (session?.user?.role !== 'ADMIN') return <p>Acesso não autorizado.</p>;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Gerenciar Depoimentos</h1>
        {message && <p className={`mb-4 text-center ${message.startsWith('Erro') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Depoimento' : 'Adicionar Novo Depoimento'}</h2>
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nome do Depoente</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tipo de Conteúdo</label>
              <div className="mt-1 flex gap-4">
                <button
                  type="button"
                  onClick={() => setType('TEXT')}
                  className={`px-4 py-2 rounded-md transition-colors ${type === 'TEXT' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <FaAlignLeft className="inline-block mr-2" /> Texto
                </button>
                <button
                  type="button"
                  onClick={() => setType('PHOTO')}
                  className={`px-4 py-2 rounded-md transition-colors ${type === 'PHOTO' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <FaCamera className="inline-block mr-2" /> Foto
                </button>
                <button
                  type="button"
                  onClick={() => setType('VIDEO')}
                  className={`px-4 py-2 rounded-md transition-colors ${type === 'VIDEO' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <FaVideo className="inline-block mr-2" /> Vídeo
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {type === 'TEXT' ? 'Conteúdo do Depoimento' : type === 'PHOTO' ? 'URL da Foto' : 'URL do Vídeo'}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-md font-bold text-white ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {loading ? 'Salvando...' : editingId ? 'Salvar Edição' : 'Adicionar Depoimento'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName('');
                    setType('TEXT');
                    setContent('');
                  }}
                  className="px-6 py-2 rounded-md font-bold text-gray-700 bg-gray-200 hover:bg-gray-300"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Lista de Depoimentos</h2>
          {loading && <p>Carregando...</p>}
          {!loading && testimonials.length === 0 && <p>Nenhum depoimento encontrado.</p>}
          <ul className="space-y-4">
            {testimonials.map((testimonial) => (
              <li key={testimonial.id} className="border p-4 rounded-md shadow-sm flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-bold text-white ${testimonial.type === 'TEXT' ? 'bg-gray-500' : testimonial.type === 'PHOTO' ? 'bg-blue-500' : 'bg-red-500'}`}>
                      {testimonial.type}
                    </span>
                    <h3 className="text-lg font-bold">{testimonial.name}</h3>
                  </div>
                  {testimonial.type === 'TEXT' && <p className="text-gray-700">{testimonial.content}</p>}
                  {testimonial.type === 'PHOTO' && <img src={testimonial.content} alt={`Depoimento de ${testimonial.name}`} className="mt-2 max-w-xs rounded-md" />}
                  {testimonial.type === 'VIDEO' && <p className="text-sm text-gray-500 mt-2">Vídeo: <a href={testimonial.content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{testimonial.content}</a></p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(testimonial)} className="text-blue-500 hover:text-blue-700" aria-label="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(testimonial.id)} className="text-red-500 hover:text-red-700" aria-label="Excluir">
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}